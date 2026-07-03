require("dotenv").config();

const crypto = require("crypto");
const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient, Role, AttemptSource, ReviewState } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

const PORT = Number(process.env.PORT || 5180);
const TRUST_PROXY = process.env.TRUST_PROXY || "";
const SESSION_COOKIE = "espanolo_sid";
const SESSION_DAYS = 30;
const EXTERNAL_LOOKUP_TIMEOUT_MS = 9000;
const PRONUNCIATION_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PRONUNCIATION_USER_AGENT =
  "Mozilla/5.0 (compatible; EspanoloLearning/0.1; self-hosted pronunciation resolver)";
const pronunciationCache = new Map();

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
  if (cached && Date.now() - cached.createdAt < PRONUNCIATION_CACHE_TTL_MS) {
    return cached.payload;
  }

  const results = await Promise.allSettled([
    resolveSpanishDictPronunciation(cleaned),
    resolveLeoPronunciation(cleaned)
  ]);
  const sources = sortPronunciationSources(
    results.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
  ).map(({ score, ...source }) => source);

  const payload = {
    text: cleaned,
    links: dictionaryLinks(cleaned),
    sources,
    resolvedAt: new Date().toISOString()
  };
  pronunciationCache.set(cacheKey, { createdAt: Date.now(), payload });
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
  options: [...(exercise.options || [])]
    .sort((a, b) => a.order - b.order)
    .map((option) => ({
      id: option.id,
      text: option.text,
      value: option.value
    }))
});

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

function evaluateExercise(exercise, submitted) {
  const answerSpec = exercise.answerJson || {};

  if (exercise.type === "SENTENCE_BUILDER") {
    const submittedWords = Array.isArray(submitted.words)
      ? submitted.words
      : String(submitted.answer || "").split(/\s+/);
    const expected = Array.isArray(answerSpec.correctWords)
      ? answerSpec.correctWords.join(" ")
      : answerSpec.correct;
    return normalizeAnswer(submittedWords.join(" ")) === normalizeAnswer(expected);
  }

  const answer = normalizeAnswer(submitted.answer || submitted.value || "");
  const accepted = Array.isArray(answerSpec.accepted)
    ? answerSpec.accepted
    : [answerSpec.correct];

  return accepted.some((candidate) => normalizeAnswer(candidate) === answer);
}

function expectedAnswerForExercise(exercise) {
  const answerSpec = exercise.answerJson || {};
  if (Array.isArray(answerSpec.correctWords)) {
    return answerSpec.correctWords.join(" ");
  }
  return answerSpec.correct || "";
}

function acceptedAnswersForExercise(exercise) {
  const answerSpec = exercise.answerJson || {};
  if (Array.isArray(answerSpec.correctWords)) {
    return [answerSpec.correctWords.join(" ")];
  }
  if (Array.isArray(answerSpec.accepted)) {
    return answerSpec.accepted;
  }
  return answerSpec.correct ? [answerSpec.correct] : [];
}

async function refreshLessonProgress(userId, lessonId) {
  const [totalExercises, correctAttempts] = await Promise.all([
    prisma.exercise.count({ where: { lessonId } }),
    prisma.attempt.findMany({
      where: {
        userId,
        isCorrect: true,
        exercise: { lessonId }
      },
      select: { exerciseId: true }
    })
  ]);

  const completedExercises = new Set(correctAttempts.map((attempt) => attempt.exerciseId)).size;
  const mastery = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  return prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      completedExercises,
      totalExercises,
      mastery,
      completedAt: mastery >= 100 ? new Date() : null
    },
    create: {
      userId,
      lessonId,
      completedExercises,
      totalExercises,
      mastery,
      completedAt: mastery >= 100 ? new Date() : null
    }
  });
}

async function updateReviewItem(userId, exerciseId, wasCorrect) {
  const existing = await prisma.reviewItem.findUnique({
    where: { userId_exerciseId: { userId, exerciseId } }
  });

  const intervalDays = wasCorrect
    ? Math.max(1, Math.ceil((existing?.intervalDays || 1) * (existing?.ease || 2.3)))
    : 1;
  const ease = wasCorrect
    ? Math.min(3.0, (existing?.ease || 2.3) + 0.1)
    : Math.max(1.3, (existing?.ease || 2.3) - 0.25);
  const state = wasCorrect
    ? intervalDays >= 14
      ? ReviewState.MASTERED
      : ReviewState.REVIEW
    : ReviewState.LEARNING;

  return prisma.reviewItem.upsert({
    where: { userId_exerciseId: { userId, exerciseId } },
    update: {
      state,
      intervalDays,
      ease,
      dueAt: addDays(new Date(), intervalDays),
      lastAttemptAt: new Date()
    },
    create: {
      userId,
      exerciseId,
      state,
      intervalDays,
      ease,
      dueAt: addDays(new Date(), intervalDays),
      lastAttemptAt: new Date()
    }
  });
}

async function updateWordReview(userId, wordId, wasCorrect) {
  const existing = await prisma.wordReview.findUnique({
    where: { userId_wordId: { userId, wordId } }
  });

  const previousCorrectCount = existing?.correctCount || 0;
  const correctCount = previousCorrectCount + (wasCorrect ? 1 : 0);
  const wrongCount = (existing?.wrongCount || 0) + (wasCorrect ? 0 : 1);
  const ease = wasCorrect
    ? Math.min(3.0, (existing?.ease || 2.1) + 0.08)
    : Math.max(1.25, (existing?.ease || 2.1) - 0.3);
  const now = new Date();
  let intervalDays = 0;
  let dueAt = addMinutes(now, 5);
  let state = ReviewState.LEARNING;

  if (wasCorrect) {
    if (correctCount === 1) {
      dueAt = addMinutes(now, 10);
    } else if (correctCount === 2) {
      intervalDays = 1;
      dueAt = addDays(now, intervalDays);
      state = ReviewState.REVIEW;
    } else {
      const previousInterval = Math.max(1, existing?.intervalDays || 1);
      intervalDays = Math.max(correctCount === 3 ? 3 : 4, Math.ceil(previousInterval * ease));
      dueAt = addDays(now, intervalDays);
      state = correctCount >= 5 && intervalDays >= 14 ? ReviewState.MASTERED : ReviewState.REVIEW;
    }
  }

  return prisma.wordReview.upsert({
    where: { userId_wordId: { userId, wordId } },
    update: {
      state,
      intervalDays,
      ease,
      correctCount,
      wrongCount,
      dueAt,
      lastAttemptAt: now
    },
    create: {
      userId,
      wordId,
      state,
      intervalDays,
      ease,
      correctCount,
      wrongCount,
      dueAt,
      lastAttemptAt: now
    }
  });
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

  const currentLesson =
    lessons.find((lesson) => (lesson.progress[0]?.mastery || 0) < 100) || lessons[0] || null;

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
  const [wordReviewCount, masteredWords, totalWords] = await Promise.all([
    prisma.wordReview.count({ where: { userId, dueAt: { lte: new Date() } } }),
    prisma.wordReview.count({ where: { userId, state: ReviewState.MASTERED } }),
    prisma.word.count()
  ]);

  const badgeCatalog = await prisma.badge.findMany({ orderBy: { title: "asc" } });
  const earnedBadgeIds = new Set(user.badges.map((userBadge) => userBadge.badgeId));

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
      masteredWords,
      totalWords
    },
    currentLesson: currentLesson
      ? {
          id: currentLesson.id,
          slug: currentLesson.slug,
          title: currentLesson.title,
          summary: currentLesson.summary,
          cefrLevel: currentLesson.cefrLevel,
          theme: currentLesson.theme,
          situation: currentLesson.situation,
          imageKey: currentLesson.imageKey,
          estimatedMinutes: currentLesson.estimatedMinutes,
          progress: currentLesson.progress[0]?.mastery || 0,
          topic: currentLesson.topic
        }
      : null,
    lessons: lessons.map((lesson) => ({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      summary: lesson.summary,
      cefrLevel: lesson.cefrLevel,
      theme: lesson.theme,
      situation: lesson.situation,
      imageKey: lesson.imageKey,
      estimatedMinutes: lesson.estimatedMinutes,
      exerciseCount: lesson.exercises.length,
      progress: lesson.progress[0]?.mastery || 0,
      topic: lesson.topic
    })),
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
    res.json({
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        cefrLevel: lesson.cefrLevel,
        theme: lesson.theme,
        situation: lesson.situation,
        imageKey: lesson.imageKey,
        estimatedMinutes: lesson.estimatedMinutes,
        progress: lesson.progress[0]?.mastery || 0,
        exerciseCount: lesson.exercises.length,
        topic: lesson.topic
      }))
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

    res.json({
      lesson: {
        ...lesson,
        progress: lesson.progress[0]?.mastery || 0,
        exercises: lesson.exercises.map(publicExercise)
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
      include: { options: true, lesson: true }
    });

    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    const wasCorrect = evaluateExercise(exercise, req.body);
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
          words: Array.isArray(req.body.words) ? req.body.words : null
        },
        isCorrect: wasCorrect,
        xpAwarded
      }
    });

    const updatedUser = await updatePracticeStats(req.user, xpAwarded, `Exercise: ${exercise.slug}`);
    await updateReviewItem(req.user.id, exercise.id, wasCorrect);
    await refreshLessonProgress(req.user.id, exercise.lessonId);
    await updateChallengeProgress(req.user.id, exercise.id, source);
    await checkBadges(updatedUser, exercise, wasCorrect);

    res.json({
      correct: wasCorrect,
      xpAwarded,
      explanation: exercise.explanation,
      user: publicUser(updatedUser),
      expected: expectedAnswerForExercise(exercise),
      accepted: acceptedAnswersForExercise(exercise),
      review: {
        state: wasCorrect ? "scheduled" : "needs_practice",
        message: wasCorrect
          ? "This item has been scheduled for spaced review."
          : "This item will come back soon so you can strengthen it."
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
    const expected = mode === "en-es" ? word.spanish : word.english;
    const accepted = mode === "en-es" ? [word.spanish] : [word.english];
    const isCorrect = accepted.some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer));
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

    const review = await updateWordReview(req.user.id, word.id, isCorrect);
    const updatedUser = await updatePracticeStats(req.user, xpAwarded, `Word: ${word.spanish}`);

    res.json({
      correct: isCorrect,
      xpAwarded,
      expected,
      word: publicWord(word),
      review: {
        state: review.state,
        dueAt: review.dueAt,
        correctCount: review.correctCount,
        wrongCount: review.wrongCount,
        message: isCorrect
          ? "This word moved forward in your review schedule."
          : "This word will come back soon for another retrieval attempt."
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

    res.json({ topics, lessons, vocabularyGroups, exercises: exercises.map(publicExercise), assets, users });
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
    const lesson = await prisma.lesson.upsert({
      where: { slug },
      update: {
        title: req.body.title,
        summary: req.body.summary || "",
        cefrLevel: req.body.cefrLevel || "A1",
        theme: req.body.theme || "Grammar",
        situation: req.body.situation || "general",
        imageKey: req.body.imageKey || null,
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
    console.log(`Vamos Gramatica is running on http://localhost:${PORT}`);
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
