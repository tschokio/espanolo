require("dotenv").config();

const crypto = require("crypto");
const path = require("path");
const { execFileSync } = require("child_process");
const cookieParser = require("cookie-parser");
const express = require("express");
const bcrypt = require("bcryptjs");
const packageJson = require("../package.json");
const { PrismaClient, Role, AttemptSource, ReviewState } = require("@prisma/client");
const {
  acceptedAnswersForExercise,
  evaluateExerciseAnswer,
  expectedAnswerForExercise,
  scheduleExerciseReview,
  scheduleWordReview
} = require("./learning-core");
const {
  applyCheckpointLocksToSummaries,
  buildLessonProgressState,
  checkpointUnlockState,
  lessonProgressNeedsSync
} = require("./progress-core");

const prisma = new PrismaClient();
const app = express();

const REPO_ROOT = path.resolve(__dirname, "..");
const PROCESS_STARTED_AT = new Date();
const PORT = Number(process.env.PORT || 5180);
const TRUST_PROXY = process.env.TRUST_PROXY || "";
const SESSION_COOKIE = "espanolo_sid";
const SESSION_DAYS = 30;
const EXTERNAL_LOOKUP_TIMEOUT_MS = 9000;
const PRONUNCIATION_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PRONUNCIATION_CACHE_VERSION = 2;
const PRONUNCIATION_USER_AGENT =
  "Mozilla/5.0 (compatible; EspanoloLearning/0.1; self-hosted pronunciation resolver)";
const pronunciationCache = new Map();

function runGit(args, fallback = "") {
  try {
    return execFileSync("git", args, {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 2000
    }).trim();
  } catch {
    return fallback;
  }
}

function gitCommitDetails(ref = "HEAD") {
  const raw = runGit(["show", "-s", "--format=%H%n%h%n%s%n%cI", ref]);
  if (!raw) return null;
  const [hash, shortHash, subject, committedAt] = raw.split("\n");
  return { hash, shortHash, subject, committedAt };
}

const ACTIVE_COMMIT = gitCommitDetails("HEAD");

function buildSystemStatus() {
  const checkedOutCommit = gitCommitDetails("HEAD");
  const branch = runGit(["rev-parse", "--abbrev-ref", "HEAD"], "unknown");
  const upstream = runGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
  const upstreamCommit = upstream ? gitCommitDetails("@{u}") : null;
  const aheadBehind = upstream ? runGit(["rev-list", "--left-right", "--count", "HEAD...@{u}"]) : "";
  const [aheadText = "0", behindText = "0"] = aheadBehind.split(/\s+/);
  const changes = runGit(["status", "--short"])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const recentCommits = runGit(["log", "--oneline", "-n", "6"])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const activeMatchesCheckout = Boolean(
    ACTIVE_COMMIT?.hash && checkedOutCommit?.hash && ACTIVE_COMMIT.hash === checkedOutCommit.hash
  );
  const ahead = Number(aheadText) || 0;
  const behind = Number(behindText) || 0;

  return {
    appVersion: packageJson.version,
    nodeEnv: process.env.NODE_ENV || "development",
    port: PORT,
    processStartedAt: PROCESS_STARTED_AT.toISOString(),
    activeCommit: ACTIVE_COMMIT,
    checkedOutCommit,
    branch,
    upstream: upstream || null,
    upstreamCommit,
    ahead,
    behind,
    syncedWithUpstream: upstream ? ahead === 0 && behind === 0 : null,
    activeMatchesCheckout,
    restartRequired: !activeMatchesCheckout,
    dirty: changes.length > 0,
    changes,
    recentCommits,
    status:
      !activeMatchesCheckout
        ? "Restart required"
        : changes.length
          ? "Uncommitted local changes"
          : upstream && behind > 0
            ? "Behind upstream"
            : "Active"
  };
}

if (TRUST_PROXY) {
  app.set("trust proxy", TRUST_PROXY);
}

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(process.env.SESSION_SECRET || "dev-secret"));
app.use(
  "/images",
  express.static(path.resolve(__dirname, "..", "images"), {
    immutable: true,
    maxAge: "30d"
  })
);

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const startOfUtcDay = (date = new Date()) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const addMinutes = (date, minutes) => {
  const next = new Date(date);
  next.setUTCMinutes(next.getUTCMinutes() + minutes);
  return next;
};

const xpForLevel = (level) => level * 250;

const calculateLevel = (xp) => Math.max(1, Math.floor(xp / 250) + 1);

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const parseTextList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeAnswer = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const dictionaryLinks = (text) => {
  const encoded = encodeURIComponent(text || "");
  return {
    spanishDict: `https://www.spanishdict.com/translate/${encoded}`,
    leo: `https://dict.leo.org/alem%C3%A1n-espa%C3%B1ol/${encoded}`
  };
};

const decodeHtmlEntities = (value) =>
  String(value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(parseInt(number, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const stripHtml = (value) => decodeHtmlEntities(String(value || "").replace(/<[^>]*>/g, " "));

const meaningfulTokens = (value) => {
  const articles = new Set(["el", "la", "los", "las", "un", "una", "unos", "unas"]);
  return normalizeAnswer(value)
    .split(" ")
    .filter((token) => token.length > 1 && !articles.has(token));
};

function scorePronunciationCandidate(candidateText, queryText) {
  const candidate = normalizeAnswer(String(candidateText || "").replace(/-/g, " "));
  const query = normalizeAnswer(queryText);
  if (!candidate || !query) return 100;
  if (candidate === query) return 0;

  const queryTokens = meaningfulTokens(queryText);
  if (!queryTokens.length) return candidate.includes(query) ? 2 : 100;

  const candidateTokens = new Set(candidate.split(" "));
  if (queryTokens.every((token) => candidateTokens.has(token))) return 1;
  if (queryTokens.every((token) => candidate.includes(token))) return 2;
  return 100;
}

function hasSameMeaningfulTokens(candidateText, queryText) {
  const candidateTokens = meaningfulTokens(candidateText);
  const queryTokens = meaningfulTokens(queryText);
  if (!candidateTokens.length || !queryTokens.length) return false;
  const candidateSet = new Set(candidateTokens);
  return candidateTokens.length === queryTokens.length && queryTokens.every((token) => candidateSet.has(token));
}

function sortPronunciationSources(sources) {
  const providerPriority = { spanishdict: 0, leo: 1 };
  return sources.sort((a, b) => {
    const scoreDelta = a.score - b.score;
    if (scoreDelta) return scoreDelta;
    return (providerPriority[a.provider] ?? 10) - (providerPriority[b.provider] ?? 10);
  });
}

function normalizeSpanishDictAudioUrl(rawUrl) {
  return decodeHtmlEntities(
    String(rawUrl || "")
      .replace(/\\u002F/g, "/")
      .replace(/\\u0026/g, "&")
      .replace(/\\\//g, "/")
  );
}

function decodeJsonString(value) {
  try {
    return JSON.parse(`"${String(value || "").replace(/"/g, '\\"')}"`);
  } catch {
    return decodeHtmlEntities(String(value || ""));
  }
}

function extractJsonAfter(html, key) {
  const marker = `"${key}":`;
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return null;
  const start = html.indexOf("[", markerIndex + marker.length);
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < html.length; index += 1) {
    const char = html[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return html.slice(start, index + 1);
      }
    }
  }
  return null;
}

function phraseMeaningFallback(text) {
  const cleaned = normalizeAnswer(text);
  const originalTail = (prefix) => String(text || "").trim().slice(prefix.length).trim();
  if (cleaned === "hola") return "hello";
  if (cleaned === "gracias") return "thank you";
  if (cleaned === "por favor") return "please";
  if (cleaned === "no entiendo") return "I do not understand";
  if (cleaned.startsWith("soy de ")) return `I am from ${originalTail("soy de ")}`;
  if (cleaned.startsWith("me llamo ")) return `my name is ${originalTail("me llamo ")}`;
  if (cleaned.startsWith("quiero ")) return `I want ${originalTail("quiero ")}`;
  if (cleaned.startsWith("necesito ")) return `I need ${originalTail("necesito ")}`;
  return "";
}

function extractSpanishDictMeanings(html, text) {
  const direct = [
    ...html.matchAll(/"translation":"([^"\\]*(?:\\.[^"\\]*)*)"/g)
  ]
    .map((match) => decodeJsonString(match[1]))
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((value) => !/^[-–—]+$/.test(value));

  const wordByWordJson = extractJsonAfter(html, "wordByWordTranslations");
  let wordByWord = [];
  if (wordByWordJson) {
    try {
      wordByWord = JSON.parse(wordByWordJson)
        .map((item) => ({
          query: item.query || item.source || "",
          meaning: item.quickdef1 || item.quickdef2 || ""
        }))
        .filter((item) => item.query && item.meaning);
    } catch {
      wordByWord = [];
    }
  }

  const fallback = phraseMeaningFallback(text);
  const articleTokens = new Set(["el", "la", "los", "las", "un", "una", "unos", "unas"]);
  const meaningfulQueryTokens = meaningfulTokens(text);
  const meaningfulWordByWord = wordByWord.filter((item) => !articleTokens.has(normalizeAnswer(item.query)));
  const wordByWordIsUseful =
    wordByWord.length > 1 &&
    meaningfulWordByWord.length > 0 &&
    meaningfulWordByWord.length >= Math.min(meaningfulQueryTokens.length, meaningfulWordByWord.length);
  const wordByWordMeaning = wordByWordIsUseful
    ? wordByWord.map((item) => `${item.query} = ${item.meaning}`).join("; ")
    : "";
  const meanings = [...direct, fallback, wordByWordMeaning]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value, index, list) => list.findIndex((item) => normalizeAnswer(item) === normalizeAnswer(value)) === index)
    .slice(0, 6);

  return {
    meanings: meanings.map((meaning, index) => ({
      text: meaning,
      source: index < direct.length ? "SpanishDict" : fallback && meaning === fallback ? "Pattern" : "Word by word"
    })),
    wordByWord
  };
}

async function fetchExternal(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EXTERNAL_LOOKUP_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "User-Agent": PRONUNCIATION_USER_AGENT,
        "Accept-Language": "en-US,en;q=0.8,es;q=0.7,de;q=0.5",
        ...(options.headers || {})
      }
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchExternalText(url, headers = {}) {
  const response = await fetchExternal(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      ...headers
    }
  });
  if (!response.ok) {
    throw new Error(`Lookup failed with HTTP ${response.status}`);
  }
  return response.text();
}

async function resolveSpanishDictPronunciation(text) {
  const html = await fetchExternalText(dictionaryLinks(text).spanishDict, {
    Referer: "https://www.spanishdict.com/"
  });
  const matches = [
    ...html.matchAll(/https:(?:\\u002F){2}audio-cdn\.sdcdns\.com\\u002Faudio\?lang=es[^"]+/g),
    ...html.matchAll(/https:\/\/audio-cdn\.sdcdns\.com\/audio\?lang=es[^"'<>\s]+/g)
  ];
  const seen = new Set();

  return sortPronunciationSources(
    matches
      .map((match) => normalizeSpanishDictAudioUrl(match[0]))
      .map((url) => {
        let sourceText = "";
        try {
          sourceText = new URL(url).searchParams.get("text") || "";
        } catch {
          sourceText = "";
        }
        return {
          provider: "spanishdict",
          label: "SpanishDict",
          url,
          sourceText: sourceText.replace(/-/g, " "),
          score: scorePronunciationCandidate(sourceText, text)
        };
      })
      .filter((source) => source.score < 100)
      .filter((source) => {
        if (seen.has(source.url)) return false;
        seen.add(source.url);
        return true;
      })
  ).slice(0, 3);
}

async function resolveSpanishDictMeaning(text) {
  const html = await fetchExternalText(dictionaryLinks(text).spanishDict, {
    Referer: "https://www.spanishdict.com/"
  });
  return extractSpanishDictMeanings(html, text);
}

async function resolveLeoPronunciation(text) {
  const html = await fetchExternalText(dictionaryLinks(text).leo, {
    Referer: "https://dict.leo.org/"
  });
  const seen = new Set();
  const sources = [];
  const entryRegex =
    /<i\b[^>]*data-dz-ui="dictentry:playLeoAudio"[^>]*>[\s\S]{0,120}<\/i><\/td><td\b[^>]*lang="es"[^>]*><samp>([\s\S]*?)<\/samp>/g;

  for (const match of html.matchAll(entryRegex)) {
    const audioKeyMatch = match[0].match(/data-dz-rel-audio(?:-\d+)?="([^"]+)"/);
    if (!audioKeyMatch) continue;

    const audioKey = audioKeyMatch[1];
    const sourceText = stripHtml(match[1]);
    const score = scorePronunciationCandidate(sourceText, text);
    if (score >= 100 || (score > 0 && !hasSameMeaningfulTokens(sourceText, text)) || seen.has(audioKey)) continue;

    seen.add(audioKey);
    sources.push({
      provider: "leo",
      label: "LEO",
      url: `https://dict.leo.org/media/audio/${audioKey}.mp3`,
      sourceText,
      score
    });
  }

  return sortPronunciationSources(sources).slice(0, 3);
}

async function resolvePronunciation(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return { text: "", links: dictionaryLinks(""), sources: [] };
  }

  const cacheKey = normalizeAnswer(cleaned);
  const cached = pronunciationCache.get(cacheKey);
  if (
    cached &&
    cached.version === PRONUNCIATION_CACHE_VERSION &&
    Array.isArray(cached.payload.meanings) &&
    Date.now() - cached.createdAt < PRONUNCIATION_CACHE_TTL_MS
  ) {
    return cached.payload;
  }

  const results = await Promise.allSettled([
    resolveSpanishDictPronunciation(cleaned),
    resolveLeoPronunciation(cleaned),
    resolveSpanishDictMeaning(cleaned)
  ]);
  const sources = sortPronunciationSources(
    results
      .slice(0, 2)
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
  ).map(({ score, ...source }) => source);
  const meaningPayload = results[2]?.status === "fulfilled" ? results[2].value : { meanings: [], wordByWord: [] };

  const payload = {
    text: cleaned,
    links: dictionaryLinks(cleaned),
    sources,
    meanings: meaningPayload.meanings || [],
    bestMeaning: meaningPayload.meanings?.[0]?.text || "",
    wordByWord: meaningPayload.wordByWord || [],
    resolvedAt: new Date().toISOString()
  };
  pronunciationCache.set(cacheKey, { version: PRONUNCIATION_CACHE_VERSION, createdAt: Date.now(), payload });
  return payload;
}

function headersForAudioSource(source) {
  return {
    Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.5",
    Referer: source.provider === "leo" ? "https://dict.leo.org/" : "https://www.spanishdict.com/"
  };
}

function isAudioResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  return !contentType || contentType.startsWith("audio/") || contentType.includes("octet-stream");
}

async function closeResponse(response) {
  try {
    await response.body?.cancel?.();
  } catch {
    // Ignore cleanup failures after a successful probe.
  }
}

async function isPronunciationSourcePlayable(source) {
  const attempts = [
    { method: "HEAD", headers: headersForAudioSource(source) },
    { headers: { ...headersForAudioSource(source), Range: "bytes=0-0" } }
  ];

  for (const options of attempts) {
    try {
      const response = await fetchExternal(source.url, options);
      const playable = (response.ok || response.status === 206) && isAudioResponse(response);
      await closeResponse(response);
      if (playable) return true;
    } catch {
      // Try the next probe shape before marking this source unavailable.
    }
  }

  return false;
}

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  xp: user.xp,
  level: user.level,
  streakDays: user.streakDays,
  avatarUrl: user.avatarUrl
});

const publicExercise = (exercise) => ({
  id: exercise.id,
  slug: exercise.slug,
  type: exercise.type,
  prompt: exercise.prompt,
  instruction: exercise.instruction,
  questionText: exercise.questionText,
  explanation: exercise.explanation,
  difficulty: exercise.difficulty,
  xpReward: exercise.xpReward,
  imageKey: exercise.imageKey,
  lessonId: exercise.lessonId,
  topicId: exercise.topicId,
  answerGoal: exercise.answerJson?.goal || "",
  audioText: exercise.type === "LISTENING_DICTATION" ? exercise.answerJson?.audioText || exercise.answerJson?.correct || "" : "",
  rubric: exercise.answerJson?.rubric || "",
  trainer: exercise.answerJson?.trainer || null,
  scenario: exercise.answerJson?.scenario || null,
  lab: exercise.answerJson?.lab || null,
  mastered: Boolean(exercise.mastered),
  lastAttemptCorrect: exercise.lastAttemptCorrect ?? null,
  options: [...(exercise.options || [])]
    .sort((a, b) => a.order - b.order)
    .map((option) => ({
      id: option.id,
      text: option.text,
      value: option.value
    }))
});

const isLessonReviewDue = (progress, now = new Date()) =>
  Boolean(
    (progress?.mastery || 0) >= 100 &&
      progress?.completedAt &&
      progress?.reviewDueAt &&
      new Date(progress.reviewDueAt).getTime() <= now.getTime()
  );

const curriculumUnits = [
  {
    slug: "a1-0-absolute-start",
    label: "A1.0",
    title: "Absolute Start",
    phase: "A1 Foundation",
    description: "Tiny words, first identity sentences, and the first ser/estar split.",
    order: 1,
    startOrder: 10,
    endOrder: 55
  },
  {
    slug: "a1-1-core-grammar",
    label: "A1.1",
    title: "Core Grammar",
    phase: "A1 Foundation",
    description: "Ser, estar, articles, first verbs, and feelings.",
    order: 2,
    startOrder: 60,
    endOrder: 95
  },
  {
    slug: "a1-2-survival-spanish",
    label: "A1.2",
    title: "Survival Spanish",
    phase: "A1 Practical",
    description: "Food, travel, location, questions, negation, and useful needs.",
    order: 3,
    startOrder: 100,
    endOrder: 165
  },
  {
    slug: "a1-3-daily-life",
    label: "A1.3",
    title: "Daily Life",
    phase: "A1 Practical",
    description: "Daily actions, market phrases, restaurant conversation, and repair phrases.",
    order: 4,
    startOrder: 170,
    endOrder: 215
  },
  {
    slug: "a1-4-building-blocks",
    label: "A1.4",
    title: "Building Blocks",
    phase: "A1 Precision",
    description: "Identity, articles, location frames, and simple negation one pattern at a time.",
    order: 5,
    startOrder: 220,
    endOrder: 295
  },
  {
    slug: "a1-5-verb-frames",
    label: "A1.5",
    title: "Verb Frames",
    phase: "A1 Mastery",
    description: "Ordering, needs, possession, question frames, verb forms, feelings, location, and plurals.",
    order: 6,
    startOrder: 300,
    endOrder: 415
  },
  {
    slug: "a1-6-health-and-states",
    label: "A1.6",
    title: "Health and Body States",
    phase: "A1 Expansion",
    description: "Body words, me duele, hunger, thirst, hot, and cold.",
    order: 7,
    startOrder: 430,
    endOrder: 455
  },
  {
    slug: "a1-7-descriptions-and-weather",
    label: "A1.7",
    title: "Descriptions and Weather",
    phase: "A1 Expansion",
    description: "Numbers, colors, nature, weather, and the final A1 checkpoint.",
    order: 8,
    startOrder: 460,
    endOrder: 495
  },
  {
    slug: "a2-1-daily-routine",
    label: "A2.1",
    title: "Daily Routine and Time",
    phase: "A2 Foundation",
    description: "Routine, reflexive verbs, time, frequency, and simple schedule talk.",
    order: 9,
    startOrder: 520,
    endOrder: 560
  },
  {
    slug: "a2-2-verb-frames",
    label: "A2.2",
    title: "Irregular Verbs and Useful Frames",
    phase: "A2 Foundation",
    description: "Ir, hacer, decir, venir, poder, querer, tener que, and ir a.",
    order: 10,
    startOrder: 570,
    endOrder: 610
  },
  {
    slug: "a2-3-likes-and-preferences",
    label: "A2.3",
    title: "Likes and Preferences",
    phase: "A2 Foundation",
    description: "Gustar, encantar, preferir, hobbies, favorites, and preference dialogues.",
    order: 11,
    startOrder: 620,
    endOrder: 660
  },
  {
    slug: "a2-4-scenarios-and-input",
    label: "A2.4",
    title: "Scenarios and Input",
    phase: "A2 Practice",
    description: "Restaurant, travel, pharmacy scenarios plus reading and listening labs.",
    order: 12,
    startOrder: 670,
    endOrder: 720
  },
  {
    slug: "a2-5-object-pronouns-shopping",
    label: "A2.5",
    title: "Object Pronouns and Shopping",
    phase: "Planned A2",
    description: "Lo, la, los, las, indirect objects, shopping, prices, and concrete object actions.",
    order: 13,
    planned: true
  },
  {
    slug: "a2-6-past-events",
    label: "A2.6",
    title: "Past Events",
    phase: "Planned A2",
    description: "Preterite and imperfect foundations for simple stories and past routines.",
    order: 14,
    planned: true
  },
  {
    slug: "b1-bridge",
    label: "B1",
    title: "Intermediate Bridge",
    phase: "Planned B1",
    description: "Past tense control, opinions, reading, listening, and guided production.",
    order: 15,
    planned: true
  }
];

function lessonUnitForOrder(order) {
  return curriculumUnits.find((unit) => !unit.planned && order >= unit.startOrder && order <= unit.endOrder) || curriculumUnits[0];
}

function publicCurriculumUnit(unit, lessons = []) {
  const lessonCount = lessons.length;
  const completedCount = lessons.filter((lesson) => lesson.progress >= 100 && !lesson.reviewDue).length;
  const dueCount = lessons.filter((lesson) => lesson.reviewDue).length;
  const inProgressCount = lessons.filter((lesson) => lesson.progress > 0 && lesson.progress < 100).length;
  const checkpointLessons = lessons.filter((lesson) => lesson.isCheckpoint);
  const checkpointCompletedCount = checkpointLessons.filter((lesson) => lesson.progress >= 100 && !lesson.reviewDue).length;
  const checkpointDueCount = checkpointLessons.filter((lesson) => lesson.reviewDue).length;
  const averageProgress = lessonCount
    ? Math.round(lessons.reduce((sum, lesson) => sum + lesson.progress, 0) / lessonCount)
    : 0;

  return {
    slug: unit.slug,
    label: unit.label,
    title: unit.title,
    phase: unit.phase,
    description: unit.description,
    order: unit.order,
    planned: Boolean(unit.planned),
    lessonCount,
    completedCount,
    dueCount,
    inProgressCount,
    checkpointCount: checkpointLessons.length,
    checkpointCompletedCount,
    checkpointDueCount,
    averageProgress,
    status: unit.planned
      ? "planned"
      : lessonCount && completedCount === lessonCount
        ? "complete"
        : dueCount
          ? "review_due"
          : inProgressCount
            ? "in_progress"
            : averageProgress > 0
              ? "started"
              : "not_started"
  };
}

function buildCurriculumQa({ lessons, exercises }) {
  const exerciseCountByLessonId = new Map();
  const imageUse = new Map();

  for (const exercise of exercises) {
    exerciseCountByLessonId.set(exercise.lessonId, (exerciseCountByLessonId.get(exercise.lessonId) || 0) + 1);
    if (exercise.imageKey) {
      if (!imageUse.has(exercise.imageKey)) imageUse.set(exercise.imageKey, []);
      imageUse.get(exercise.imageKey).push(exercise.slug);
    }
  }

  const lessonSummaries = lessons.map((lesson) => {
    const isCheckpoint = /checkpoint/i.test(`${lesson.theme} ${lesson.title}`);
    const exerciseCount = exerciseCountByLessonId.get(lesson.id) || 0;
    return {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      order: lesson.order,
      unit: lessonUnitForOrder(lesson.order),
      isCheckpoint,
      exerciseCount,
      hasOutcomes: Array.isArray(lesson.outcomesJson) && lesson.outcomesJson.length > 0,
      hasReviewSummary: Boolean(lesson.reviewSummary)
    };
  });

  const missingOutcomes = lessonSummaries.filter((lesson) => !lesson.hasOutcomes);
  const missingReviewSummary = lessonSummaries.filter((lesson) => !lesson.hasReviewSummary);
  const lowExerciseLessons = lessonSummaries.filter((lesson) => lesson.exerciseCount < (lesson.isCheckpoint ? 4 : 2));
  const unitIssues = curriculumUnits
    .filter((unit) => !unit.planned)
    .map((unit) => {
      const unitLessons = lessonSummaries.filter((lesson) => lesson.order >= unit.startOrder && lesson.order <= unit.endOrder);
      const checkpoints = unitLessons.filter((lesson) => lesson.isCheckpoint);
      return {
        slug: unit.slug,
        label: unit.label,
        title: unit.title,
        lessonCount: unitLessons.length,
        checkpointCount: checkpoints.length,
        status: !unitLessons.length ? "missing_lessons" : !checkpoints.length ? "missing_checkpoint" : "ok"
      };
    })
    .filter((unit) => unit.status !== "ok");
  const repeatedImages = [...imageUse.entries()]
    .filter(([imageKey, slugs]) => slugs.length >= 6 && !/^(grammar-scenes|people-and-family):/.test(imageKey))
    .map(([imageKey, slugs]) => ({ imageKey, count: slugs.length, examples: slugs.slice(0, 5) }));

  return {
    counts: {
      missingOutcomes: missingOutcomes.length,
      missingReviewSummary: missingReviewSummary.length,
      lowExerciseLessons: lowExerciseLessons.length,
      unitIssues: unitIssues.length,
      repeatedImages: repeatedImages.length
    },
    missingOutcomes: missingOutcomes.slice(0, 12),
    missingReviewSummary: missingReviewSummary.slice(0, 12),
    lowExerciseLessons: lowExerciseLessons.slice(0, 12),
    unitIssues,
    repeatedImages
  };
}

const publicLessonSummary = (lesson) => {
  const progress = lesson.progress?.[0] || null;
  const reviewDue = isLessonReviewDue(progress);
  const mastery = progress?.mastery || 0;
  const completedAt = mastery >= 100 ? progress?.completedAt || null : null;
  const unit = lessonUnitForOrder(lesson.order);
  const isCheckpoint = /checkpoint/i.test(`${lesson.theme} ${lesson.title}`);
  const status = reviewDue
    ? "review_due"
    : mastery >= 100
      ? "completed"
      : mastery > 0
        ? "practicing"
        : "not_started";

  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    summary: lesson.summary,
    order: lesson.order,
    cefrLevel: lesson.cefrLevel,
    theme: lesson.theme,
    situation: lesson.situation,
    imageKey: lesson.imageKey,
    estimatedMinutes: lesson.estimatedMinutes,
    unit: {
      slug: unit.slug,
      label: unit.label,
      title: unit.title,
      phase: unit.phase,
      description: unit.description,
      order: unit.order
    },
    isCheckpoint,
    progress: mastery,
    completedExercises: progress?.completedExercises || 0,
    totalExercises: progress?.totalExercises || lesson.exercises?.length || 0,
    completedAt,
    reviewDueAt: mastery >= 100 ? progress?.reviewDueAt || null : null,
    lastReviewedAt: progress?.lastReviewedAt || null,
    reviewIntervalDays: progress?.reviewIntervalDays || 3,
    lessonReviewCount: progress?.lessonReviewCount || 0,
    reviewDue,
    status,
    outcomes: Array.isArray(lesson.outcomesJson) ? lesson.outcomesJson : [],
    conceptKeys: Array.isArray(lesson.conceptKeys) ? lesson.conceptKeys : [],
    reviewSummary: lesson.reviewSummary || "",
    exerciseCount: lesson.exercises?.length || 0,
    topic: lesson.topic
  };
};

const publicWord = (word) => ({
  id: word.id,
  spanish: word.spanish,
  english: word.english,
  partOfSpeech: word.partOfSpeech,
  gender: word.gender,
  example: word.example,
  imageKey: word.imageKey,
  groupId: word.groupId
});

async function sessionMiddleware(req, res, next) {
  try {
    const token = req.cookies[SESSION_COOKIE];
    if (!token) {
      return next();
    }

    const session = await prisma.session.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
      include: { user: true }
    });

    if (!session) {
      res.clearCookie(SESSION_COOKIE);
      return next();
    }

    req.session = session;
    req.user = session.user;
    return next();
  } catch (error) {
    return next(error);
  }
}

function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000
  });
}

async function createSession(userId, res) {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: addDays(new Date(), SESSION_DAYS)
    }
  });
  setSessionCookie(res, token);
}

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  return next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Admin access required" });
  }
  return next();
};

app.use(sessionMiddleware);

const isCheckpointLesson = (lesson) => /checkpoint/i.test(`${lesson?.theme || ""} ${lesson?.title || ""}`);

function lessonProgressSnapshot(lesson, state = null) {
  const progress = state || lesson.progress?.[0] || null;
  return {
    id: lesson.id,
    order: lesson.order,
    unit: lessonUnitForOrder(lesson.order),
    isCheckpoint: isCheckpointLesson(lesson),
    progress: progress?.mastery || 0,
    completedExercises: progress?.completedExercises || 0,
    completedAt: progress?.completedAt || null
  };
}

function validCheckpointAttemptIds(correctAttempts = [], unlockState = null) {
  if (!unlockState) return correctAttempts.map((attempt) => attempt.exerciseId);
  if (!unlockState.unlocked) return [];

  const unlockAt = unlockState.unlockAt ? new Date(unlockState.unlockAt).getTime() : 0;
  return correctAttempts
    .filter((attempt) => !unlockAt || new Date(attempt.createdAt).getTime() >= unlockAt)
    .map((attempt) => attempt.exerciseId);
}

async function checkpointUnlockStateForUser(userId, lesson) {
  if (!isCheckpointLesson(lesson)) return null;
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    include: { progress: { where: { userId } } }
  });
  const summaries = lessons.map((item) => lessonProgressSnapshot(item));
  const checkpoint = summaries.find((item) => item.id === lesson.id) || lessonProgressSnapshot(lesson);
  return checkpointUnlockState(checkpoint, summaries);
}

async function syncAllPublishedLessonProgress(userId) {
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      progress: { where: { userId } },
      exercises: { select: { id: true } }
    }
  });
  return syncLessonProgressForLessons(userId, lessons);
}

async function syncLessonProgressForLessons(userId, lessons) {
  const lessonList = lessons.filter(Boolean);
  if (!lessonList.length) return lessonList;

  const lessonIds = lessonList.map((lesson) => lesson.id).filter(Boolean);
  if (!lessonIds.length) return lessonList;

  const correctAttempts = await prisma.attempt.findMany({
    where: {
      userId,
      isCorrect: true,
      exercise: { lessonId: { in: lessonIds } }
    },
    select: {
      exerciseId: true,
      createdAt: true,
      exercise: { select: { lessonId: true } }
    }
  });

  const correctAttemptsByLesson = new Map();
  for (const attempt of correctAttempts) {
    const lessonId = attempt.exercise?.lessonId;
    if (!lessonId) continue;
    if (!correctAttemptsByLesson.has(lessonId)) correctAttemptsByLesson.set(lessonId, []);
    correctAttemptsByLesson.get(lessonId).push(attempt);
  }

  const now = new Date();
  const stateByLessonId = new Map();
  for (const lesson of lessonList) {
    if (isCheckpointLesson(lesson)) continue;
    const existingProgress = lesson.progress?.[0] || null;
    stateByLessonId.set(
      lesson.id,
      buildLessonProgressState(
        existingProgress,
        Array.isArray(lesson.exercises) ? lesson.exercises.length : existingProgress?.totalExercises || 0,
        (correctAttemptsByLesson.get(lesson.id) || []).map((attempt) => attempt.exerciseId),
        now
      )
    );
  }

  const progressSnapshots = lessonList.map((lesson) => lessonProgressSnapshot(lesson, stateByLessonId.get(lesson.id)));
  for (const lesson of lessonList) {
    if (!isCheckpointLesson(lesson)) continue;
    const existingProgress = lesson.progress?.[0] || null;
    const unlockState = checkpointUnlockState(lessonProgressSnapshot(lesson, existingProgress), progressSnapshots);
    stateByLessonId.set(
      lesson.id,
      buildLessonProgressState(
        existingProgress,
        Array.isArray(lesson.exercises) ? lesson.exercises.length : existingProgress?.totalExercises || 0,
        validCheckpointAttemptIds(correctAttemptsByLesson.get(lesson.id) || [], unlockState),
        now
      )
    );
  }

  const writes = [];
  for (const lesson of lessonList) {
    const existingProgress = lesson.progress?.[0] || null;
    const state = stateByLessonId.get(lesson.id);
    const shouldHaveProgress = Boolean(existingProgress || state.completedExercises > 0);
    lesson.progress = shouldHaveProgress
      ? [
          {
            ...(existingProgress || {}),
            userId,
            lessonId: lesson.id,
            ...state
          }
        ]
      : [];

    if (!shouldHaveProgress || !lessonProgressNeedsSync(existingProgress, state)) continue;
    writes.push(
      prisma.userLessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        update: state,
        create: {
          userId,
          lessonId: lesson.id,
          ...state
        }
      })
    );
  }

  await Promise.all(writes);
  return lessonList;
}

async function refreshLessonProgress(userId, lessonId) {
  const [lesson, totalExercises, correctAttempts, existingProgress] = await Promise.all([
    prisma.lesson.findUnique({ where: { id: lessonId } }),
    prisma.exercise.count({ where: { lessonId } }),
    prisma.attempt.findMany({
      where: {
        userId,
        isCorrect: true,
        exercise: { lessonId }
      },
      select: { exerciseId: true, createdAt: true }
    }),
    prisma.userLessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } })
  ]);

  const unlockState = lesson ? await checkpointUnlockStateForUser(userId, lesson) : null;
  const now = new Date();
  const state = buildLessonProgressState(
    existingProgress,
    totalExercises,
    validCheckpointAttemptIds(correctAttempts, unlockState),
    now
  );

  const progress = await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: state,
    create: {
      userId,
      lessonId,
      ...state
    }
  });

  if (progress.mastery >= 100) {
    await enrollLessonWordsForReview(userId, lessonId);
  }

  return progress;
}

async function completeLessonReinforcement(userId, lessonId, score = 100) {
  const progress = await refreshLessonProgress(userId, lessonId);
  const now = new Date();
  const mastered = progress.mastery >= 100;
  const strongReview = Number(score) >= 80 && mastered;
  const currentInterval = progress.reviewIntervalDays || 3;
  const nextInterval = mastered
    ? strongReview
      ? Math.min(30, progress.lessonReviewCount ? Math.ceil(currentInterval * 1.7) : 3)
      : 1
    : 1;

  return prisma.userLessonProgress.update({
    where: { userId_lessonId: { userId, lessonId } },
    data: {
      completedAt: mastered ? progress.completedAt || now : null,
      lastReviewedAt: now,
      lessonReviewCount: mastered ? { increment: 1 } : progress.lessonReviewCount,
      reviewIntervalDays: nextInterval,
      reviewDueAt: mastered ? addDays(now, nextInterval) : null
    }
  });
}

async function updateReviewItem(userId, exerciseId, quality) {
  const existing = await prisma.reviewItem.findUnique({
    where: { userId_exerciseId: { userId, exerciseId } }
  });
  const scheduled = scheduleExerciseReview(existing, quality);

  return prisma.reviewItem.upsert({
    where: { userId_exerciseId: { userId, exerciseId } },
    update: {
      state: ReviewState[scheduled.state],
      intervalDays: scheduled.intervalDays,
      ease: scheduled.ease,
      dueAt: scheduled.dueAt,
      lastAttemptAt: new Date()
    },
    create: {
      userId,
      exerciseId,
      state: ReviewState[scheduled.state],
      intervalDays: scheduled.intervalDays,
      ease: scheduled.ease,
      dueAt: scheduled.dueAt,
      lastAttemptAt: new Date()
    }
  });
}

async function updateWordReview(userId, wordId, quality) {
  const existing = await prisma.wordReview.findUnique({
    where: { userId_wordId: { userId, wordId } }
  });
  const scheduled = scheduleWordReview(existing, quality);

  return prisma.wordReview.upsert({
    where: { userId_wordId: { userId, wordId } },
    update: {
      state: ReviewState[scheduled.state],
      intervalDays: scheduled.intervalDays,
      ease: scheduled.ease,
      correctCount: scheduled.correctCount,
      wrongCount: scheduled.wrongCount,
      dueAt: scheduled.dueAt,
      lastAttemptAt: new Date()
    },
    create: {
      userId,
      wordId,
      state: ReviewState[scheduled.state],
      intervalDays: scheduled.intervalDays,
      ease: scheduled.ease,
      correctCount: scheduled.correctCount,
      wrongCount: scheduled.wrongCount,
      dueAt: scheduled.dueAt,
      lastAttemptAt: new Date()
    }
  });
}

async function enrollLessonWordsForReview(userId, lessonId, dueAt = addMinutes(new Date(), 10)) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      vocabularyGroups: {
        select: {
          words: { select: { id: true } }
        }
      }
    }
  });

  const wordIds = [
    ...new Set(lesson?.vocabularyGroups.flatMap((group) => group.words.map((word) => word.id)) || [])
  ];
  if (!wordIds.length) return 0;

  const result = await prisma.wordReview.createMany({
    data: wordIds.map((wordId) => ({
      userId,
      wordId,
      state: ReviewState.LEARNING,
      intervalDays: 0,
      ease: 2.1,
      dueAt
    })),
    skipDuplicates: true
  });

  return result.count;
}

async function enrollCompletedLessonWordsForReview(userId) {
  const completed = await prisma.userLessonProgress.findMany({
    where: {
      userId,
      completedAt: { not: null },
      mastery: { gte: 100 }
    },
    select: { lessonId: true }
  });

  let count = 0;
  for (const progress of completed) {
    count += await enrollLessonWordsForReview(userId, progress.lessonId);
  }
  return count;
}

async function ensureAudioLabVocabularyGroup() {
  return prisma.vocabularyGroup.upsert({
    where: { slug: "audio-lab-saved" },
    update: {
      title: "Audio Lab Saved",
      description: "Words and phrases saved from pronunciation lookup.",
      situation: "personal audio",
      imageKey: "daily-actions:15"
    },
    create: {
      slug: "audio-lab-saved",
      title: "Audio Lab Saved",
      description: "Words and phrases saved from pronunciation lookup.",
      situation: "personal audio",
      imageKey: "daily-actions:15"
    }
  });
}

async function saveAudioLookupWord(userId, text, english) {
  const spanish = String(text || "").replace(/\s+/g, " ").trim();
  if (!spanish) throw new Error("A Spanish word or phrase is required");

  const group = await ensureAudioLabVocabularyGroup();
  const existingWords = await prisma.word.findMany({ where: { groupId: group.id } });
  const existing = existingWords.find((word) => normalizeAnswer(word.spanish) === normalizeAnswer(spanish));
  const cleanedEnglish = String(english || "").replace(/\s+/g, " ").trim() || "Meaning not found yet";
  const data = {
    spanish,
    english: cleanedEnglish,
    partOfSpeech: spanish.split(/\s+/).length > 1 ? "phrase" : "word",
    gender: null,
    example: spanish,
    imageKey: group.imageKey,
    groupId: group.id
  };

  const word = existing
    ? await prisma.word.update({ where: { id: existing.id }, data })
    : await prisma.word.create({ data });

  const existingReview = await prisma.wordReview.findUnique({
    where: { userId_wordId: { userId, wordId: word.id } }
  });
  const review = await prisma.wordReview.upsert({
    where: { userId_wordId: { userId, wordId: word.id } },
    update: {
      dueAt: existingReview?.dueAt || new Date(),
      state: ReviewState.LEARNING
    },
    create: {
      userId,
      wordId: word.id,
      state: ReviewState.LEARNING,
      intervalDays: 0,
      ease: 2.1,
      dueAt: new Date(),
      lastAttemptAt: null
    }
  });

  return { word, group, review, created: !existing };
}

async function audioLabSavedWords(userId, limit = 12) {
  const group = await prisma.vocabularyGroup.findUnique({ where: { slug: "audio-lab-saved" } });
  if (!group) return [];

  const reviews = await prisma.wordReview.findMany({
    where: {
      userId,
      word: { groupId: group.id }
    },
    orderBy: [{ updatedAt: "desc" }],
    take: limit,
    include: { word: true }
  });

  return reviews.map((review) => ({
    ...publicWord(review.word),
    groupSlug: group.slug,
    groupTitle: group.title,
    review: {
      state: review.state,
      dueAt: review.dueAt,
      correctCount: review.correctCount,
      wrongCount: review.wrongCount,
      due: review.dueAt <= new Date()
    }
  }));
}

function categoryLabel(category) {
  const labels = {
    accent: "Accents",
    gender_article: "Articles and Gender",
    missing_required_article: "Missing Articles",
    ser_estar: "Ser vs Estar",
    verb_conjugation: "Verb Forms",
    vocabulary: "Vocabulary",
    word_order: "Word Order"
  };
  return labels[category] || "Spanish Pattern";
}

function mistakeWeakSpotKey({ exercise, word, errorCategory }) {
  if (exercise) return `exercise:${exercise.id}:${errorCategory || "general"}`;
  if (word) return `word:${word.id}:${errorCategory || "vocabulary"}`;
  return `general:${errorCategory || "practice"}`;
}

async function recordMistakeEvent({ userId, exercise, word, source, evaluation }) {
  if (!evaluation || evaluation.correct) return null;

  const weakSpotKey = mistakeWeakSpotKey({ exercise, word, errorCategory: evaluation.errorCategory });
  const occurrenceCount = (await prisma.mistakeEvent.count({ where: { userId, weakSpotKey } })) + 1;

  return prisma.mistakeEvent.create({
    data: {
      userId,
      exerciseId: exercise?.id || null,
      wordId: word?.id || null,
      lessonId: exercise?.lessonId || null,
      topicId: exercise?.topicId || null,
      source: source || "LESSON",
      submittedAnswer: evaluation.submitted || "",
      correctAnswer: evaluation.expected || "",
      errorCategory: evaluation.errorCategory || "vocabulary",
      feedbackMessage: evaluation.feedbackMessage || "",
      weakSpotKey,
      occurrenceCount,
      lastOccurredAt: new Date()
    }
  });
}

function summarizeMistakeEvents(events) {
  const byKey = new Map();
  for (const event of events) {
    const existing = byKey.get(event.weakSpotKey);
    const count = (existing?.count || 0) + 1;
    const lastOccurredAt =
      !existing || new Date(event.lastOccurredAt) > new Date(existing.lastOccurredAt)
        ? event.lastOccurredAt
        : existing.lastOccurredAt;
    const topicTitle = event.topic?.title || event.exercise?.topic?.title || "";
    const lessonTitle = event.lesson?.title || event.exercise?.lesson?.title || "";
    const wordTitle = event.word?.spanish || "";
    byKey.set(event.weakSpotKey, {
      key: event.weakSpotKey,
      title: topicTitle || lessonTitle || wordTitle || categoryLabel(event.errorCategory),
      detail: wordTitle
        ? `${wordTitle} = ${event.word.english}`
        : lessonTitle
          ? lessonTitle
          : categoryLabel(event.errorCategory),
      category: event.errorCategory,
      categoryLabel: categoryLabel(event.errorCategory),
      count,
      lastOccurredAt,
      feedbackMessage: event.feedbackMessage,
      exercise: event.exercise ? publicExercise(event.exercise) : null,
      word: event.word ? publicWord(event.word) : null
    });
  }
  return [...byKey.values()].sort(
    (a, b) => b.count - a.count || new Date(b.lastOccurredAt).getTime() - new Date(a.lastOccurredAt).getTime()
  );
}

async function buildMistakeSummary(userId, limit = 6) {
  const events = await prisma.mistakeEvent.findMany({
    where: { userId, lastOccurredAt: { gte: addDays(new Date(), -14) } },
    orderBy: { lastOccurredAt: "desc" },
    take: 80,
    include: {
      exercise: { include: { options: true, lesson: true, topic: true } },
      lesson: true,
      topic: true,
      word: true
    }
  });

  const summary = summarizeMistakeEvents(events);
  const visible = [];
  for (const spot of summary) {
    if (spot.exercise?.id) {
      const [latestCorrect, review] = await Promise.all([
        prisma.attempt.findFirst({
          where: {
            userId,
            exerciseId: spot.exercise.id,
            isCorrect: true,
            createdAt: { gt: new Date(spot.lastOccurredAt) }
          },
          orderBy: { createdAt: "desc" }
        }),
        prisma.reviewItem.findUnique({
          where: { userId_exerciseId: { userId, exerciseId: spot.exercise.id } }
        })
      ]);
      if (latestCorrect && review?.dueAt && review.dueAt > new Date()) continue;
    }

    if (spot.word?.id) {
      const [latestCorrect, review] = await Promise.all([
        prisma.wordAttempt.findFirst({
          where: {
            userId,
            wordId: spot.word.id,
            isCorrect: true,
            createdAt: { gt: new Date(spot.lastOccurredAt) }
          },
          orderBy: { createdAt: "desc" }
        }),
        prisma.wordReview.findUnique({
          where: { userId_wordId: { userId, wordId: spot.word.id } }
        })
      ]);
      if (latestCorrect && review?.dueAt && review.dueAt > new Date()) continue;
    }

    visible.push(spot);
    if (visible.length >= limit) break;
  }

  return visible;
}

async function buildDueReview(userId, limit = 12) {
  const now = new Date();
  const [grammarCount, wordCount, grammarItems, wordItems, weakSpots] = await Promise.all([
    prisma.reviewItem.count({
      where: { userId, dueAt: { lte: now } }
    }),
    prisma.wordReview.count({
      where: { userId, dueAt: { lte: now } }
    }),
    prisma.reviewItem.findMany({
      where: { userId, dueAt: { lte: now } },
      orderBy: { dueAt: "asc" },
      take: limit,
      include: {
        exercise: {
          include: {
            options: true,
            lesson: true,
            topic: true
          }
        }
      }
    }),
    prisma.wordReview.findMany({
      where: { userId, dueAt: { lte: now } },
      orderBy: { dueAt: "asc" },
      take: limit,
      include: {
        word: { include: { vocabularyGroup: true } }
      }
    }),
    buildMistakeSummary(userId, 5)
  ]);

  const items = [
    ...weakSpots.map((spot) => ({
      type: "mistake",
      key: spot.key,
      title: spot.title,
      detail: spot.detail,
      category: spot.category,
      count: spot.count,
      exercise: spot.exercise,
      word: spot.word
    })),
    ...grammarItems.map((item) => ({
      type: "grammar",
      key: `grammar:${item.id}`,
      title: item.exercise.topic?.title || item.exercise.lesson?.title || "Grammar review",
      detail: item.exercise.questionText,
      dueAt: item.dueAt,
      state: item.state,
      exercise: publicExercise(item.exercise)
    })),
    ...wordItems.map((item) => ({
      type: "word",
      key: `word:${item.id}`,
      title: item.word.english,
      detail: item.word.vocabularyGroup?.title || "Vocabulary",
      dueAt: item.dueAt,
      state: item.state,
      word: {
        ...publicWord(item.word),
        groupTitle: item.word.vocabularyGroup?.title || ""
      }
    }))
  ].slice(0, limit);

  return {
    counts: {
      grammar: grammarCount,
      vocabulary: wordCount,
      mistakes: weakSpots.length,
      total: grammarCount + wordCount + weakSpots.length
    },
    estimatedMinutes: Math.max(3, Math.ceil(Math.min(limit, grammarCount + wordCount + weakSpots.length) * 0.7)),
    items,
    weakSpots
  };
}

function recentAchievementFromLessons(lessons) {
  const completed = lessons
    .filter((lesson) => lesson.progress?.[0]?.completedAt)
    .sort((a, b) => new Date(b.progress[0].completedAt).getTime() - new Date(a.progress[0].completedAt).getTime());
  const latest = completed[0];
  if (!latest) return null;
  const outcomes = Array.isArray(latest.outcomesJson) ? latest.outcomesJson : [];
  return outcomes[0] || latest.reviewSummary || `You completed ${latest.title}.`;
}

function lessonSummaryMastery(lesson) {
  if (typeof lesson.progress === "number") return lesson.progress;
  return lesson.progress?.[0]?.mastery || 0;
}

function lessonSummaryReviewDue(lesson, now = new Date()) {
  if (typeof lesson.reviewDue === "boolean") return lesson.reviewDue;
  return isLessonReviewDue(lesson.progress?.[0], now);
}

function pickCurrentLessonSummary(lessons) {
  const availableLessons = (lessons || []).filter((lesson) => !lesson.isLocked);
  const now = new Date();
  return (
    availableLessons.find((lesson) => {
      const mastery = lessonSummaryMastery(lesson);
      return mastery > 0 && mastery < 100;
    }) ||
    availableLessons
      .filter((lesson) => lessonSummaryReviewDue(lesson, now))
      .sort((a, b) => {
        const left = new Date(a.reviewDueAt || a.progress?.[0]?.reviewDueAt || 0).getTime();
        const right = new Date(b.reviewDueAt || b.progress?.[0]?.reviewDueAt || 0).getTime();
        return left - right || (a.order || 0) - (b.order || 0);
      })[0] ||
    availableLessons.find((lesson) => lessonSummaryMastery(lesson) < 100) ||
    availableLessons[0] ||
    null
  );
}

function buildDailyPlan({ lessons, review }) {
  const now = new Date();
  const currentLesson = pickCurrentLessonSummary(lessons);
  const reviewDue = review.counts.total > 0;
  const mistakeDue = review.counts.mistakes > 0;

  if (currentLesson) {
    const currentMastery = lessonSummaryMastery(currentLesson);
    const due = lessonSummaryReviewDue(currentLesson, now);
    return {
      kind: due ? "lesson_review" : "lesson",
      title: due
        ? `Review: ${currentLesson.title}`
        : currentMastery
          ? `Continue: ${currentLesson.title}`
          : `Start: ${currentLesson.title}`,
      reason: due
        ? "Review this completed lesson."
        : mistakeDue
          ? "This lesson moves you forward, and your mistakes are ready afterward."
          : "This is the best next step in your beginner path.",
      estimatedMinutes: currentLesson.estimatedMinutes,
      cta: "Start today's session",
      target: { type: "lesson", id: currentLesson.id, slug: currentLesson.slug }
    };
  }

  if (reviewDue) {
    return {
      kind: "review",
      title: "Review due today",
      reason: "Keep older vocabulary and grammar stable before adding more.",
      estimatedMinutes: review.estimatedMinutes,
      cta: "Start review",
      target: { type: "review" }
    };
  }

  return {
    kind: "reinforcement",
    title: "Reinforce completed Spanish",
    reason: "A short mixed challenge will keep completed lessons active.",
    estimatedMinutes: 5,
    cta: "Start mixed challenge",
    target: { type: "challenge" }
  };
}

async function updatePracticeStats(user, xpAwarded, reason) {
  const today = startOfUtcDay();
  const lastPractice = user.lastPracticeDate ? startOfUtcDay(user.lastPracticeDate) : null;
  let streakDays = user.streakDays || 0;

  if (!lastPractice) {
    streakDays = 1;
  } else if (lastPractice.getTime() === addDays(today, -1).getTime()) {
    streakDays += 1;
  } else if (lastPractice.getTime() !== today.getTime()) {
    streakDays = 1;
  }

  const newXp = user.xp + xpAwarded;
  const level = calculateLevel(newXp);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      xp: newXp,
      level,
      streakDays,
      lastPracticeDate: new Date()
    }
  });

  if (xpAwarded > 0) {
    await prisma.xpEvent.create({
      data: {
        userId: user.id,
        amount: xpAwarded,
        reason
      }
    });
  }

  return updatedUser;
}

async function awardBadge(userId, slug) {
  const badge = await prisma.badge.findUnique({ where: { slug } });
  if (!badge) return null;
  return prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
    update: {},
    create: { userId, badgeId: badge.id }
  });
}

async function checkBadges(user, exercise, isCorrect) {
  if (!isCorrect) return;

  const correctCount = await prisma.attempt.count({
    where: { userId: user.id, isCorrect: true }
  });

  if (correctCount >= 5) await awardBadge(user.id, "grammar-guru");
  if (user.streakDays >= 3) await awardBadge(user.id, "on-fire");
  if (exercise.type === "ARTICLE_MATCH") await awardBadge(user.id, "article-scout");
}

async function updateChallengeProgress(userId, exerciseId, source) {
  if (source !== AttemptSource.CHALLENGE) return null;

  const challengeExercise = await prisma.challengeExercise.findFirst({
    where: {
      exerciseId,
      challenge: {
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() }
      }
    },
    include: { challenge: true }
  });

  if (!challengeExercise) return null;

  const existing = await prisma.challengeProgress.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challengeExercise.challengeId
      }
    }
  });

  const completedCount = Math.min(
    challengeExercise.challenge.targetCount,
    (existing?.completedCount || 0) + 1
  );
  const isCompleted = completedCount >= challengeExercise.challenge.targetCount;

  const progress = await prisma.challengeProgress.upsert({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challengeExercise.challengeId
      }
    },
    update: { completedCount, isCompleted },
    create: {
      userId,
      challengeId: challengeExercise.challengeId,
      completedCount,
      isCompleted
    }
  });

  if (isCompleted && !existing?.isCompleted) {
    await awardBadge(userId, "challenge-ace");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    await updatePracticeStats(user, challengeExercise.challenge.xpReward, "Weekly challenge completed");
  }

  return progress;
}

async function buildDashboard(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: { include: { badge: true } }
    }
  });

  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      topic: true,
      progress: { where: { userId } },
      exercises: { orderBy: { order: "asc" }, include: { options: true } }
    }
  });
  await syncLessonProgressForLessons(userId, lessons);
  const review = await buildDueReview(userId, 12);

  const dueReview = await prisma.reviewItem.findFirst({
    where: { userId, dueAt: { lte: new Date() } },
    orderBy: { dueAt: "asc" },
    include: {
      exercise: {
        include: {
          options: true,
          lesson: true,
          topic: true
        }
      }
    }
  });

  const now = new Date();
  const dueLesson = lessons
    .filter((lesson) => isLessonReviewDue(lesson.progress[0], now))
    .sort(
      (a, b) =>
        new Date(a.progress[0].reviewDueAt).getTime() - new Date(b.progress[0].reviewDueAt).getTime() ||
        a.order - b.order
    )[0];
  const currentLesson =
    lessons.find((lesson) => (lesson.progress[0]?.mastery || 0) > 0 && (lesson.progress[0]?.mastery || 0) < 100) ||
    dueLesson ||
    lessons.find((lesson) => (lesson.progress[0]?.mastery || 0) < 100) ||
    lessons[0] ||
    null;

  let practiceExercise = dueReview?.exercise || null;
  if (!practiceExercise && currentLesson) {
    const correctAttempts = await prisma.attempt.findMany({
      where: {
        userId,
        isCorrect: true,
        exercise: { lessonId: currentLesson.id }
      },
      select: { exerciseId: true }
    });
    const correctIds = new Set(correctAttempts.map((attempt) => attempt.exerciseId));
    practiceExercise =
      currentLesson.exercises.find((exercise) => !correctIds.has(exercise.id)) ||
      currentLesson.exercises[0] ||
      null;
  }

  const activeChallenge = await prisma.challenge.findFirst({
    where: {
      startsAt: { lte: new Date() },
      endsAt: { gte: new Date() }
    },
    orderBy: { endsAt: "asc" },
    include: {
      progress: { where: { userId } },
      exercises: {
        orderBy: { order: "asc" },
        include: { exercise: { include: { options: true } } }
      }
    }
  });

  const leaderboard = await prisma.user.findMany({
    orderBy: [{ xp: "desc" }, { streakDays: "desc" }],
    take: 10,
    select: { id: true, name: true, xp: true, level: true, streakDays: true }
  });

  const [recentAttempts, recentWordAttempts] = await Promise.all([
    prisma.attempt.findMany({
      where: { userId, createdAt: { gte: addDays(new Date(), -14) } },
      select: { createdAt: true }
    }),
    prisma.wordAttempt.findMany({
      where: { userId, createdAt: { gte: addDays(new Date(), -14) } },
      select: { createdAt: true }
    })
  ]);

  const activeDays = new Set(
    [...recentAttempts, ...recentWordAttempts].map((attempt) =>
      startOfUtcDay(attempt.createdAt).toISOString().slice(0, 10)
    )
  );
  const streakCalendar = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(startOfUtcDay(), index - 13);
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      day: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      active: activeDays.has(key)
    };
  });

  const miniGameScores = await prisma.miniGameScore.groupBy({
    by: ["gameKey"],
    where: { userId },
    _max: { score: true }
  });
  const highScoreByGame = Object.fromEntries(
    miniGameScores.map((score) => [score.gameKey, score._max.score || 0])
  );

  const reviewCount = await prisma.reviewItem.count({
    where: { userId, dueAt: { lte: new Date() } }
  });
  const [wordReviewCount, lessonReviewCount, masteredWords, totalWords] = await Promise.all([
    prisma.wordReview.count({ where: { userId, dueAt: { lte: new Date() } } }),
    prisma.userLessonProgress.count({ where: { userId, completedAt: { not: null }, reviewDueAt: { lte: new Date() } } }),
    prisma.wordReview.count({ where: { userId, state: ReviewState.MASTERED } }),
    prisma.word.count()
  ]);

  const badgeCatalog = await prisma.badge.findMany({ orderBy: { title: "asc" } });
  const earnedBadgeIds = new Set(user.badges.map((userBadge) => userBadge.badgeId));
  const lessonSummaries = applyCheckpointLocksToSummaries(lessons.map(publicLessonSummary));
  const currentLessonSummary = pickCurrentLessonSummary(lessonSummaries);
  if (!dueReview && currentLessonSummary && practiceExercise?.lessonId !== currentLessonSummary.id) {
    const summaryLesson = lessons.find((lesson) => lesson.id === currentLessonSummary.id);
    if (summaryLesson) {
      const correctAttempts = await prisma.attempt.findMany({
        where: {
          userId,
          isCorrect: true,
          exercise: { lessonId: summaryLesson.id }
        },
        select: { exerciseId: true }
      });
      const correctIds = new Set(correctAttempts.map((attempt) => attempt.exerciseId));
      practiceExercise =
        summaryLesson.exercises.find((exercise) => !correctIds.has(exercise.id)) ||
        summaryLesson.exercises[0] ||
        null;
    }
  }
  const curriculumProgress = curriculumUnits.map((unit) =>
    publicCurriculumUnit(
      unit,
      lessonSummaries.filter((lesson) => lesson.unit?.slug === unit.slug)
    )
  );

  return {
    user: publicUser(user),
    stats: {
      xp: user.xp,
      level: user.level,
      currentLevelXp: xpForLevel(user.level - 1),
      nextLevelXp: xpForLevel(user.level),
      streakDays: user.streakDays,
      reviewCount,
      wordReviewCount,
      lessonReviewCount,
      mistakeCount: review.counts.mistakes,
      reviewDueToday: review.counts.total + lessonReviewCount,
      masteredWords,
      totalWords
    },
    dailyPlan: buildDailyPlan({ lessons: lessonSummaries, review }),
    review,
    curriculumUnits: curriculumProgress,
    recentAchievement: recentAchievementFromLessons(lessons),
    currentLesson: currentLessonSummary,
    lessons: lessonSummaries,
    practiceExercise: practiceExercise ? publicExercise(practiceExercise) : null,
    challenge: activeChallenge
      ? {
          id: activeChallenge.id,
          slug: activeChallenge.slug,
          title: activeChallenge.title,
          description: activeChallenge.description,
          targetCount: activeChallenge.targetCount,
          xpReward: activeChallenge.xpReward,
          endsAt: activeChallenge.endsAt,
          progress: activeChallenge.progress[0]?.completedCount || 0,
          isCompleted: activeChallenge.progress[0]?.isCompleted || false,
          exercises: activeChallenge.exercises
            .map((challengeExercise) => challengeExercise.exercise)
            .filter(Boolean)
            .map(publicExercise),
          exercise: activeChallenge.exercises[0]?.exercise
            ? publicExercise(activeChallenge.exercises[0].exercise)
            : null
        }
      : null,
    badges: badgeCatalog.map((badge) => ({
      id: badge.id,
      slug: badge.slug,
      title: badge.title,
      description: badge.description,
      icon: badge.icon,
      threshold: badge.threshold,
      earned: earnedBadgeIds.has(badge.id)
    })),
    miniGames: [
      {
        key: "conjugation-sprint",
        title: "Conjugation Sprint",
        description: "Race the clock with present-tense verbs.",
        highScore: highScoreByGame["conjugation-sprint"] || 0,
        color: "lagoon"
      },
      {
        key: "sentence-builder",
        title: "Sentence Builder",
        description: "Drag words into useful Spanish sentences.",
        highScore: highScoreByGame["sentence-builder"] || 0,
        color: "honey"
      },
      {
        key: "article-match",
        title: "Article Match",
        description: "Pair nouns with el, la, los, and las.",
        highScore: highScoreByGame["article-match"] || 0,
        color: "blue"
      },
      {
        key: "word-catcher",
        title: "Word Catch",
        description: "Catch the matching meaning before the timer runs out.",
        highScore: highScoreByGame["word-catcher"] || 0,
        color: "coral"
      }
    ],
    streakCalendar,
    leaderboard
  };
}

app.post(
  "/api/auth/register",
  asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password || password.length < 8) {
      return res.status(400).json({ error: "Name, email, and an 8+ character password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ error: "That email is already registered" });
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash: await bcrypt.hash(password, 12)
      }
    });

    await createSession(user.id, res);
    return res.status(201).json({ user: publicUser(user) });
  })
);

app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: String(email || "").toLowerCase() } });
    if (!user || !(await bcrypt.compare(String(password || ""), user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    await createSession(user.id, res);
    return res.json({ user: publicUser(user) });
  })
);

app.post(
  "/api/auth/logout",
  asyncHandler(async (req, res) => {
    if (req.cookies[SESSION_COOKIE]) {
      await prisma.session.deleteMany({ where: { token: req.cookies[SESSION_COOKIE] } });
    }
    res.clearCookie(SESSION_COOKIE);
    return res.json({ ok: true });
  })
);

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.get(
  "/api/dashboard",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await buildDashboard(req.user.id));
  })
);

app.get(
  "/api/daily-session",
  requireAuth,
  asyncHandler(async (req, res) => {
    const dashboard = await buildDashboard(req.user.id);
    res.json({
      dailyPlan: dashboard.dailyPlan,
      review: dashboard.review,
      currentLesson: dashboard.currentLesson,
      recentAchievement: dashboard.recentAchievement
    });
  })
);

app.get(
  "/api/review/due",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await buildDueReview(req.user.id, Number(req.query.limit || 12)));
  })
);

app.get(
  "/api/mistakes/summary",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ weakSpots: await buildMistakeSummary(req.user.id, Number(req.query.limit || 8)) });
  })
);

app.get(
  "/api/mistakes/review",
  requireAuth,
  asyncHandler(async (req, res) => {
    const weakSpots = await buildMistakeSummary(req.user.id, Number(req.query.limit || 5));
    res.json({
      estimatedMinutes: Math.max(3, Math.ceil(weakSpots.length * 0.8)),
      items: weakSpots
    });
  })
);

app.get(
  "/api/lessons",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { title: "asc" }],
      include: {
        topic: true,
        progress: { where: { userId: req.user.id } },
        exercises: { select: { id: true } }
      }
    });
    await syncLessonProgressForLessons(req.user.id, lessons);
    res.json({
      lessons: applyCheckpointLocksToSummaries(lessons.map(publicLessonSummary))
    });
  })
);

app.get(
  "/api/lessons/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lesson = await prisma.lesson.findFirst({
      where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
      include: {
        topic: true,
        vocabularyGroups: { include: { words: true } },
        sentences: true,
        progress: { where: { userId: req.user.id } },
        exercises: { orderBy: { order: "asc" }, include: { options: true } }
      }
    });

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    if (isCheckpointLesson(lesson)) {
      const syncedLessons = await syncAllPublishedLessonProgress(req.user.id);
      const lessonSummaries = applyCheckpointLocksToSummaries(syncedLessons.map(publicLessonSummary));
      const checkpointSummary = lessonSummaries.find((item) => item.id === lesson.id);
      if (checkpointSummary?.isLocked) {
        return res.status(423).json({
          error: checkpointSummary.lockedReason || "Complete the earlier lessons before this checkpoint.",
          lesson: checkpointSummary
        });
      }
      const syncedLesson = syncedLessons.find((item) => item.id === lesson.id);
      if (syncedLesson) lesson.progress = syncedLesson.progress;
    } else {
      await syncLessonProgressForLessons(req.user.id, [lesson]);
    }
    const summary = publicLessonSummary(lesson);
    const attempts = await prisma.attempt.findMany({
      where: {
        userId: req.user.id,
        exercise: { lessonId: lesson.id }
      },
      orderBy: { createdAt: "desc" },
      select: { exerciseId: true, isCorrect: true }
    });
    const correctExerciseIds = new Set(attempts.filter((attempt) => attempt.isCorrect).map((attempt) => attempt.exerciseId));
    const latestAttemptByExercise = new Map();
    for (const attempt of attempts) {
      if (!latestAttemptByExercise.has(attempt.exerciseId)) {
        latestAttemptByExercise.set(attempt.exerciseId, attempt);
      }
    }

    res.json({
      lesson: {
        ...lesson,
        progress: summary.progress,
        completedExercises: summary.completedExercises,
        totalExercises: summary.totalExercises,
        unit: summary.unit,
        isCheckpoint: summary.isCheckpoint,
        outcomes: Array.isArray(lesson.outcomesJson) ? lesson.outcomesJson : [],
        conceptKeys: Array.isArray(lesson.conceptKeys) ? lesson.conceptKeys : [],
        reviewSummary: lesson.reviewSummary || "",
        exercises: lesson.exercises.map((exercise) =>
          publicExercise({
            ...exercise,
            mastered: correctExerciseIds.has(exercise.id),
            lastAttemptCorrect: latestAttemptByExercise.get(exercise.id)?.isCorrect ?? null
          })
        )
      }
    });
  })
);

app.post(
  "/api/lessons/:id/reinforcement-complete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const lesson = await prisma.lesson.findFirst({
      where: { id: req.params.id, isPublished: true },
      select: { id: true }
    });

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const score = Number.isFinite(Number(req.body.score)) ? Math.max(0, Math.min(100, Number(req.body.score))) : 100;
    const progress = await completeLessonReinforcement(req.user.id, lesson.id, score);

    res.json({
      progress: {
        mastery: progress.mastery,
        completedAt: progress.completedAt,
        reviewDueAt: progress.reviewDueAt,
        lastReviewedAt: progress.lastReviewedAt,
        reviewIntervalDays: progress.reviewIntervalDays,
        lessonReviewCount: progress.lessonReviewCount
      }
    });
  })
);

app.post(
  "/api/exercises/:id/attempt",
  requireAuth,
  asyncHandler(async (req, res) => {
    const source = Object.values(AttemptSource).includes(req.body.source)
      ? req.body.source
      : AttemptSource.LESSON;
    const exercise = await prisma.exercise.findUnique({
      where: { id: req.params.id },
      include: { options: true, lesson: true, topic: true }
    });

    if (!exercise) return res.status(404).json({ error: "Exercise not found" });
    if (isCheckpointLesson(exercise.lesson)) {
      const unlockState = await checkpointUnlockStateForUser(req.user.id, exercise.lesson);
      if (unlockState && !unlockState.unlocked) {
        const unitLabel = lessonUnitForOrder(exercise.lesson.order).label || "this unit";
        const count = unlockState.incompleteCount;
        return res.status(423).json({
          error: `Complete ${count} earlier ${count === 1 ? "lesson" : "lessons"} in ${unitLabel} before this checkpoint.`
        });
      }
    }

    const evaluation = evaluateExerciseAnswer(exercise, req.body);
    const wasCorrect = evaluation.correct;
    const quality = wasCorrect ? String(req.body.quality || "good").toLowerCase() : "again";
    const previousCorrect = await prisma.attempt.findFirst({
      where: { userId: req.user.id, exerciseId: exercise.id, isCorrect: true }
    });
    const xpAwarded = wasCorrect
      ? previousCorrect
        ? Math.max(2, Math.ceil(exercise.xpReward * 0.2))
        : exercise.xpReward
      : 0;

    await prisma.attempt.create({
      data: {
        userId: req.user.id,
        exerciseId: exercise.id,
        source,
        answerJson: {
          answer: req.body.answer || null,
          words: Array.isArray(req.body.words) ? req.body.words : null,
          evaluation: {
            status: evaluation.status,
            errorCategory: evaluation.errorCategory,
            feedbackMessage: evaluation.feedbackMessage
          }
        },
        isCorrect: wasCorrect,
        xpAwarded
      }
    });

    const updatedUser = await updatePracticeStats(req.user, xpAwarded, `Exercise: ${exercise.slug}`);
    const reviewItem = await updateReviewItem(req.user.id, exercise.id, quality);
    await recordMistakeEvent({ userId: req.user.id, exercise, source, evaluation });
    await refreshLessonProgress(req.user.id, exercise.lessonId);
    await updateChallengeProgress(req.user.id, exercise.id, source);
    await checkBadges(updatedUser, exercise, wasCorrect);

    res.json({
      correct: wasCorrect,
      status: evaluation.status,
      errorCategory: evaluation.errorCategory,
      xpAwarded,
      explanation: wasCorrect && evaluation.status === "CORRECT" ? exercise.explanation : evaluation.feedbackMessage,
      feedbackMessage: evaluation.feedbackMessage,
      user: publicUser(updatedUser),
      expected: evaluation.expected || expectedAnswerForExercise(exercise),
      accepted: evaluation.accepted?.length ? evaluation.accepted : acceptedAnswersForExercise(exercise),
      evaluation,
      review: {
        state: wasCorrect ? reviewItem.state : "needs_practice",
        dueAt: reviewItem.dueAt,
        message: wasCorrect
          ? `Scheduled for review on ${reviewItem.dueAt.toISOString().slice(0, 10)}.`
          : "Saved to Fix My Mistakes and scheduled for another try."
      }
    });
  })
);

app.get(
  "/api/pronunciation",
  requireAuth,
  asyncHandler(async (req, res) => {
    const pronunciation = await resolvePronunciation(req.query.text);
    const shouldVerify = ["1", "true", "yes"].includes(String(req.query.verify || "").toLowerCase());
    if (shouldVerify && pronunciation.sources.length) {
      const sources = await Promise.all(
        pronunciation.sources.map(async (source) => ({
          ...source,
          playable: await isPronunciationSourcePlayable(source)
        }))
      );
      return res.json({ ...pronunciation, sources });
    }
    res.json(pronunciation);
  })
);

app.post(
  "/api/pronunciation/vocabulary",
  requireAuth,
  asyncHandler(async (req, res) => {
    const text = String(req.body.text || "").replace(/\s+/g, " ").trim();
    const providedEnglish = String(req.body.english || "").replace(/\s+/g, " ").trim();
    const usefulProvidedEnglish = providedEnglish && normalizeAnswer(providedEnglish) !== "meaning not found yet";
    if (!text) return res.status(400).json({ error: "A Spanish word or phrase is required" });

    const pronunciation = usefulProvidedEnglish ? null : await resolvePronunciation(text);
    const english = usefulProvidedEnglish ? providedEnglish : pronunciation?.bestMeaning || pronunciation?.meanings?.[0]?.text || "";
    if (!english || normalizeAnswer(english) === normalizeAnswer(text)) {
      return res.status(422).json({
        error: "No reliable meaning found, so this was not saved. Check the spelling or add a clearer word."
      });
    }
    const saved = await saveAudioLookupWord(req.user.id, text, english);

    res.status(saved.created ? 201 : 200).json({
      saved: true,
      created: saved.created,
      group: {
        id: saved.group.id,
        slug: saved.group.slug,
        title: saved.group.title
      },
      word: {
        ...publicWord(saved.word),
        groupSlug: saved.group.slug,
        groupTitle: saved.group.title,
        review: {
          state: saved.review.state,
          dueAt: saved.review.dueAt,
          correctCount: saved.review.correctCount,
          wrongCount: saved.review.wrongCount,
          due: saved.review.dueAt <= new Date()
        }
      }
    });
  })
);

app.get(
  "/api/pronunciation/vocabulary/recent",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ words: await audioLabSavedWords(req.user.id, Number(req.query.limit || 12)) });
  })
);

app.delete(
  "/api/pronunciation/vocabulary/:wordId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const word = await prisma.word.findUnique({
      where: { id: req.params.wordId },
      include: { vocabularyGroup: true }
    });
    if (!word || word.vocabularyGroup.slug !== "audio-lab-saved") {
      return res.status(404).json({ error: "Saved Audio Lab word not found" });
    }

    await prisma.word.delete({ where: { id: word.id } });
    res.json({ ok: true });
  })
);

app.get(
  "/api/pronunciation/audio",
  requireAuth,
  asyncHandler(async (req, res) => {
    const pronunciation = await resolvePronunciation(req.query.text);
    const provider = String(req.query.provider || "").toLowerCase();
    const sourceText = String(req.query.sourceText || "");
    let candidates = provider
      ? pronunciation.sources.filter((source) => source.provider === provider)
      : pronunciation.sources;
    if (sourceText) {
      const exactCandidates = candidates.filter((source) => source.sourceText === sourceText);
      candidates = exactCandidates.length
        ? exactCandidates
        : candidates.filter((source) => normalizeAnswer(source.sourceText) === normalizeAnswer(sourceText));
    }

    for (const source of candidates) {
      try {
        const response = await fetchExternal(source.url, {
          headers: headersForAudioSource(source)
        });
        if (!response.ok) continue;

        const contentType = response.headers.get("content-type") || "audio/mpeg";
        const audioBuffer = Buffer.from(await response.arrayBuffer());
        res.set({
          "Cache-Control": "private, max-age=604800",
          "Content-Length": String(audioBuffer.length),
          "Content-Type": contentType,
          "X-Pronunciation-Provider": source.provider,
          "X-Pronunciation-Source-Text": source.sourceText || ""
        });
        return res.send(audioBuffer);
      } catch {
        // Try the next provider source before giving up.
      }
    }

    return res.status(404).json({
      error: "No playable pronunciation audio found",
      links: pronunciation.links
    });
  })
);

app.get(
  "/api/words",
  requireAuth,
  asyncHandler(async (req, res) => {
    await enrollCompletedLessonWordsForReview(req.user.id);

    const groups = await prisma.vocabularyGroup.findMany({
      orderBy: { title: "asc" },
      include: {
        words: {
          orderBy: [{ spanish: "asc" }],
          include: {
            reviews: { where: { userId: req.user.id } },
            attempts: {
              where: { userId: req.user.id },
              orderBy: { createdAt: "desc" },
              take: 1
            }
          }
        }
      }
    });

    const now = new Date();
    const payload = groups.map((group) => {
      const words = group.words.map((word) => {
        const review = word.reviews[0] || null;
        return {
          ...publicWord(word),
          groupSlug: group.slug,
          groupTitle: group.title,
          review: review
            ? {
                state: review.state,
                dueAt: review.dueAt,
                correctCount: review.correctCount,
                wrongCount: review.wrongCount,
                due: review.dueAt <= now
              }
            : {
                state: "NEW",
                dueAt: null,
                correctCount: 0,
                wrongCount: 0,
                due: true
              },
          lastAttempt: word.attempts[0] || null
        };
      });
      const learned = words.filter((word) => word.review.correctCount > 0).length;
      const reviewDue = words.filter((word) => word.review.correctCount > 0 && word.review.due).length;

      return {
        id: group.id,
        slug: group.slug,
        title: group.title,
        description: group.description,
        situation: group.situation,
        imageKey: group.imageKey,
        total: words.length,
        due: words.filter((word) => word.review.due).length,
        reviewDue,
        new: words.filter((word) => word.review.correctCount === 0).length,
        learned,
        mastered: words.filter((word) => word.review.state === ReviewState.MASTERED).length,
        words
      };
    });

    const allWords = payload.flatMap((group) => group.words);
    res.json({
      groups: payload,
      stats: {
        total: allWords.length,
        due: allWords.filter((word) => word.review.due).length,
        reviewDue: allWords.filter((word) => word.review.correctCount > 0 && word.review.due).length,
        new: allWords.filter((word) => word.review.correctCount === 0).length,
        learned: allWords.filter((word) => word.review.correctCount > 0).length,
        mastered: allWords.filter((word) => word.review.state === ReviewState.MASTERED).length,
        learning: allWords.filter((word) => word.review.state === ReviewState.LEARNING || word.review.state === "NEW").length
      }
    });
  })
);

app.post(
  "/api/words/:id/attempt",
  requireAuth,
  asyncHandler(async (req, res) => {
    const word = await prisma.word.findUnique({
      where: { id: req.params.id },
      include: { vocabularyGroup: true }
    });
    if (!word) return res.status(404).json({ error: "Word not found" });

    const mode = String(req.body.mode || "es-en");
    const answer = String(req.body.answer || "");
    const qualityInput = String(req.body.quality || "").toLowerCase();
    const expected = mode === "en-es" ? word.spanish : word.english;
    const accepted = mode === "en-es" ? [word.spanish] : [word.english];
    const isCorrect = accepted.some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer));
    const reviewQuality = isCorrect ? qualityInput || "good" : "again";
    const xpAwarded = isCorrect ? (mode === "typing" || mode === "en-es" ? 8 : 5) : 0;

    await prisma.wordAttempt.create({
      data: {
        userId: req.user.id,
        wordId: word.id,
        mode,
        answer,
        isCorrect,
        xpAwarded
      }
    });

    const review = await updateWordReview(req.user.id, word.id, reviewQuality);
    if (!isCorrect) {
      await recordMistakeEvent({
        userId: req.user.id,
        word,
        source: "WORD",
        evaluation: {
          correct: false,
          submitted: answer,
          expected,
          errorCategory: "vocabulary",
          feedbackMessage: `Review ${word.spanish}: ${word.english}.`
        }
      });
    }
    const updatedUser = await updatePracticeStats(req.user, xpAwarded, `Word: ${word.spanish}`);

    res.json({
      correct: isCorrect,
      status: isCorrect ? "CORRECT" : "INCORRECT",
      errorCategory: isCorrect ? null : "vocabulary",
      xpAwarded,
      expected,
      word: publicWord(word),
      review: {
        state: review.state,
        dueAt: review.dueAt,
        correctCount: review.correctCount,
        wrongCount: review.wrongCount,
        message: isCorrect
          ? `This word moved forward in your review schedule (${reviewQuality}).`
          : "Saved to Fix My Mistakes and queued for another retrieval attempt."
      },
      user: publicUser(updatedUser)
    });
  })
);

app.get(
  "/api/leaderboard",
  requireAuth,
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      orderBy: [{ xp: "desc" }, { streakDays: "desc" }],
      take: 50,
      select: { id: true, name: true, xp: true, level: true, streakDays: true }
    });
    res.json({ users });
  })
);

app.post(
  "/api/minigames/:gameKey/score",
  requireAuth,
  asyncHandler(async (req, res) => {
    const score = Math.max(0, Math.min(10000, Number(req.body.score || 0)));
    const xpAwarded = Math.min(100, Math.max(5, Math.round(score / 20)));
    const gameKey = slugify(req.params.gameKey);

    const record = await prisma.miniGameScore.create({
      data: {
        userId: req.user.id,
        gameKey,
        score,
        xpAwarded
      }
    });
    const updatedUser = await updatePracticeStats(req.user, xpAwarded, `Mini game: ${gameKey}`);

    res.json({ score: record, user: publicUser(updatedUser), xpAwarded });
  })
);

app.get(
  "/api/admin/content",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const [topics, lessons, vocabularyGroups, exercises, assets, users] = await Promise.all([
      prisma.grammarTopic.findMany({ orderBy: { order: "asc" } }),
      prisma.lesson.findMany({ orderBy: { order: "asc" }, include: { topic: true } }),
      prisma.vocabularyGroup.findMany({ include: { words: true } }),
      prisma.exercise.findMany({ orderBy: { order: "asc" }, include: { lesson: true, topic: true, options: true } }),
      prisma.assetPrompt.findMany({ orderBy: { title: "asc" } }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, xp: true, level: true } })
    ]);

    res.json({
      topics,
      lessons,
      vocabularyGroups,
      exercises: exercises.map(publicExercise),
      assets,
      users,
      curriculumQa: buildCurriculumQa({ lessons, exercises }),
      system: buildSystemStatus()
    });
  })
);

app.post(
  "/api/admin/topics",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.slug || req.body.title);
    const topic = await prisma.grammarTopic.upsert({
      where: { slug },
      update: {
        title: req.body.title,
        description: req.body.description || "",
        cefrLevel: req.body.cefrLevel || "A1",
        imageKey: req.body.imageKey || null,
        order: Number(req.body.order || 0)
      },
      create: {
        slug,
        title: req.body.title,
        description: req.body.description || "",
        cefrLevel: req.body.cefrLevel || "A1",
        imageKey: req.body.imageKey || null,
        order: Number(req.body.order || 0)
      }
    });
    res.status(201).json({ topic });
  })
);

app.post(
  "/api/admin/lessons",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.slug || req.body.title);
    const outcomesJson = Array.isArray(req.body.outcomesJson)
      ? req.body.outcomesJson
      : parseTextList(req.body.outcomes);
    const conceptKeys = Array.isArray(req.body.conceptKeys)
      ? req.body.conceptKeys
      : parseTextList(req.body.conceptKeysText || req.body.conceptKeys);
    const lesson = await prisma.lesson.upsert({
      where: { slug },
      update: {
        title: req.body.title,
        summary: req.body.summary || "",
        cefrLevel: req.body.cefrLevel || "A1",
        theme: req.body.theme || "Grammar",
        situation: req.body.situation || "general",
        imageKey: req.body.imageKey || null,
        outcomesJson,
        conceptKeys,
        reviewSummary: req.body.reviewSummary || "",
        topicId: req.body.topicId,
        estimatedMinutes: Number(req.body.estimatedMinutes || 8),
        order: Number(req.body.order || 0)
      },
      create: {
        slug,
        title: req.body.title,
        summary: req.body.summary || "",
        cefrLevel: req.body.cefrLevel || "A1",
        theme: req.body.theme || "Grammar",
        situation: req.body.situation || "general",
        imageKey: req.body.imageKey || null,
        outcomesJson,
        conceptKeys,
        reviewSummary: req.body.reviewSummary || "",
        topicId: req.body.topicId,
        estimatedMinutes: Number(req.body.estimatedMinutes || 8),
        order: Number(req.body.order || 0)
      }
    });
    res.status(201).json({ lesson });
  })
);

app.post(
  "/api/admin/exercises",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.body.lessonId } });
    if (!lesson) return res.status(400).json({ error: "A valid lessonId is required" });

    const slug = slugify(req.body.slug || `${lesson.slug}-${req.body.prompt || req.body.questionText}`);
    const exercise = await prisma.exercise.upsert({
      where: { slug },
      update: {
        lessonId: lesson.id,
        topicId: req.body.topicId || lesson.topicId,
        type: req.body.type || "MULTIPLE_CHOICE",
        prompt: req.body.prompt || "Practice",
        instruction: req.body.instruction || "",
        questionText: req.body.questionText || "",
        answerJson: req.body.answerJson || { correct: req.body.correctAnswer || "" },
        explanation: req.body.explanation || "",
        difficulty: Number(req.body.difficulty || 1),
        order: Number(req.body.order || 0),
        xpReward: Number(req.body.xpReward || 10),
        imageKey: req.body.imageKey || null
      },
      create: {
        slug,
        lessonId: lesson.id,
        topicId: req.body.topicId || lesson.topicId,
        type: req.body.type || "MULTIPLE_CHOICE",
        prompt: req.body.prompt || "Practice",
        instruction: req.body.instruction || "",
        questionText: req.body.questionText || "",
        answerJson: req.body.answerJson || { correct: req.body.correctAnswer || "" },
        explanation: req.body.explanation || "",
        difficulty: Number(req.body.difficulty || 1),
        order: Number(req.body.order || 0),
        xpReward: Number(req.body.xpReward || 10),
        imageKey: req.body.imageKey || null
      }
    });

    await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
    const optionValues = Array.isArray(req.body.options) ? req.body.options : [];
    if (optionValues.length) {
      await prisma.exerciseOption.createMany({
        data: optionValues.map((option, index) => ({
          exerciseId: exercise.id,
          text: option.text || option.value,
          value: option.value || option.text,
          isCorrect: Boolean(option.isCorrect),
          order: index + 1
        }))
      });
    }

    const saved = await prisma.exercise.findUnique({
      where: { id: exercise.id },
      include: { options: true }
    });
    res.status(201).json({ exercise: publicExercise(saved) });
  })
);

app.post(
  "/api/admin/assets",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.slug || req.body.title);
    const asset = await prisma.assetPrompt.upsert({
      where: { slug },
      update: {
        title: req.body.title,
        category: req.body.category || "Vocabulary",
        gridSize: Number(req.body.gridSize || 4),
        canvasSize: Number(req.body.canvasSize || 1200),
        imagePath: req.body.imagePath || null,
        promptMarkdown: req.body.promptMarkdown || ""
      },
      create: {
        slug,
        title: req.body.title,
        category: req.body.category || "Vocabulary",
        gridSize: Number(req.body.gridSize || 4),
        canvasSize: Number(req.body.canvasSize || 1200),
        imagePath: req.body.imagePath || null,
        promptMarkdown: req.body.promptMarkdown || ""
      }
    });
    res.status(201).json({ asset });
  })
);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use((error, req, res, next) => {
  if (req.path.startsWith("/api")) {
    console.error(error);
    return res.status(500).json({ error: "Server error", detail: error.message });
  }
  return next(error);
});

async function attachFrontend() {
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "..", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    return;
  }

  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa"
  });
  app.use(vite.middlewares);
}

attachFrontend().then(() => {
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vamos Espanolo is running on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
});
