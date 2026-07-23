import { spanishLearningExample } from "./spanish-content-core.mjs";

function shuffleWords(words, random = Math.random) {
  const copy = [...words];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function isWordLearned(word) {
  return (word?.review?.correctCount || 0) > 0 || word?.review?.state === "MASTERED";
}

export function isWordAttempted(word) {
  return Boolean(word?.introducedInWords || word?.lastAttempt?.activityMode === "flashcard");
}

function wordDueTimestamp(word) {
  if (!word?.review?.dueAt) return 0;
  const time = new Date(word.review.dueAt).getTime();
  return Number.isFinite(time) ? time : 0;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function wordContextPrompt(word) {
  const example = spanishLearningExample(word?.example);
  const target = String(word?.spanish || "").replace(/\s+/g, " ").trim();
  if (!example || !target || example.toLocaleLowerCase("es") === target.toLocaleLowerCase("es")) return null;

  const withoutOuterPunctuation = target.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
  const withoutArticle = withoutOuterPunctuation.replace(/^(?:el|la|los|las)\s+/iu, "");
  const candidates = [...new Set([target, withoutOuterPunctuation, withoutArticle].filter(Boolean))];

  for (const answer of candidates) {
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(answer)}(?![\\p{L}\\p{N}])`, "iu");
    if (!pattern.test(example)) continue;
    return {
      example,
      target,
      answer,
      masked: example.replace(pattern, "_____")
    };
  }
  return null;
}

export function sortWordsForLearning(a, b) {
  return (
    Number(b.review?.due) - Number(a.review?.due) ||
    (a.review?.correctCount || 0) - (b.review?.correctCount || 0) ||
    wordDueTimestamp(a) - wordDueTimestamp(b) ||
    a.spanish.localeCompare(b.spanish)
  );
}

function mixedPromptMode(type, word, position) {
  const modes = type === "memory" ? ["context", "typing", "picture", "recognition"] : ["recognition", "context", "typing", "picture"];
  const mode = modes[position % modes.length];
  if (mode === "picture" && !word.imageKey) return "recognition";
  if (mode === "context" && !wordContextPrompt(word)) return "typing";
  return mode;
}

function selectedPromptMode(type, word, position, questionStyle) {
  if (questionStyle === "mixed") return mixedPromptMode(type, word, position);
  if (questionStyle === "picture" && !word.imageKey) return "recognition";
  if (questionStyle === "context" && !wordContextPrompt(word)) return "typing";
  return questionStyle;
}

function newWordRetrievalMode(word, stage, questionStyle, position) {
  if (stage === 0) return "flashcard";
  if (questionStyle !== "mixed") return selectedPromptMode("learn", word, position, questionStyle);
  if (stage === 1) return word.imageKey && position % 2 ? "picture" : "recognition";
  if (stage === 2) return "typing";
  return wordContextPrompt(word) ? "context" : "typing";
}

function learningPhase(mode, fallback = "retrieve") {
  if (mode === "flashcard") return "introduce";
  if (["recognition", "picture"].includes(mode)) return "recognize";
  if (mode === "context") return "apply";
  return fallback;
}

export function buildWordSession(type, selectedGroups, groups, options = {}) {
  const allWords = (groups || []).flatMap((group) => group.words || []);
  const selectedGroupList = (Array.isArray(selectedGroups) ? selectedGroups : [selectedGroups]).filter(Boolean);
  const sessionSize = Math.max(1, Math.floor(Number(options.sessionSize) || 8));
  const questionStyle = options.questionStyle || "mixed";
  const random = typeof options.random === "function" ? options.random : Math.random;
  const sourceWords = type === "memory"
    ? allWords.filter(isWordAttempted)
    : selectedGroupList.flatMap((group) => group.words || []);
  const uniqueWords = [...new Map(sourceWords.map((word) => [word.id, word])).values()];
  const sorted = [...uniqueWords].sort(sortWordsForLearning);
  const prioritySize = Math.max(sessionSize * 2, sessionSize);
  const pool = [
    ...shuffleWords(sorted.slice(0, prioritySize), random),
    ...shuffleWords(sorted.slice(prioritySize), random)
  ];

  if (type !== "learn") {
    return pool.slice(0, sessionSize).map((word, index) => {
      const mode = selectedPromptMode(type, word, index, questionStyle);
      return {
        key: `${type}-${word.id}-${index}`,
        wordId: word.id,
        mode,
        phase: learningPhase(mode, "retrieve")
      };
    });
  }

  const newWords = pool.filter((word) => !isWordLearned(word));
  const knownWords = pool.filter(isWordLearned);
  const newLimit = Math.min(
    newWords.length,
    knownWords.length ? Math.max(1, Math.floor(sessionSize / 5)) : Math.max(1, Math.floor(sessionSize / 4))
  );
  const selectedNew = newWords.slice(0, newLimit);
  const knownSlots = Math.max(0, sessionSize - selectedNew.length * 4);
  const selectedKnown = knownWords.slice(0, knownSlots || (selectedNew.length ? 0 : sessionSize));
  const items = [];
  const append = (word, mode, label, phase = learningPhase(mode)) => {
    if (items.length >= sessionSize) return;
    items.push({ key: `${type}-${word.id}-${label}-${items.length}`, wordId: word.id, mode, phase });
  };

  selectedNew.forEach((word) => append(word, "flashcard", "introduce", "introduce"));
  selectedKnown.forEach((word) => {
    const mode = selectedPromptMode(type, word, items.length, questionStyle);
    append(word, mode, "retrieve", learningPhase(mode, "retrieve"));
  });
  [1, 2, 3].forEach((stage) => {
    selectedNew.forEach((word) => append(word, newWordRetrievalMode(word, stage, questionStyle, items.length), `stage-${stage}`));
  });

  const repeatPool = [...selectedKnown, ...selectedNew];
  let repeatIndex = 0;
  while (items.length < sessionSize && repeatPool.length) {
    const word = repeatPool[repeatIndex % repeatPool.length];
    const mode = isWordLearned(word)
      ? selectedPromptMode(type, word, items.length, questionStyle)
      : newWordRetrievalMode(word, 2, questionStyle, items.length);
    append(word, mode, `reinforce-${repeatIndex}`);
    repeatIndex += 1;
  }

  return items;
}

export function queueMissedWord(items, currentIndex) {
  const list = Array.isArray(items) ? items : [];
  const item = list[currentIndex];
  if (!item?.wordId) return list;
  if (list.slice(currentIndex + 1).some((candidate) => candidate.wordId === item.wordId)) return list;
  if (list.some((candidate) => candidate.wordId === item.wordId && candidate.retry)) return list;

  return [
    ...list,
    {
      ...item,
      key: `${item.key}-retry`,
      mode: item.mode === "flashcard" ? "recognition" : item.mode,
      phase: item.mode === "context" ? "apply" : "retrieve",
      retry: true
    }
  ];
}
