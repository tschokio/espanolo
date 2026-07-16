// Keep lesson-session progression deterministic and independent of the UI.
// A correct answer removes that check; a missed check waits until the learner
// has worked through the other remaining checks before it appears again.
export function buildLessonPracticeQueue(exercises = []) {
  const checks = Array.isArray(exercises) ? exercises.filter(Boolean) : [];
  const unmasteredChecks = checks.filter((exercise) => !exercise.mastered);

  // A completed lesson is being reviewed, so include its full set. Otherwise,
  // resume exactly where the learner left off.
  return unmasteredChecks.length ? unmasteredChecks : [...checks];
}

export function rotateLessonReviewItems(items = [], reviewCount = 0, limit = 6) {
  const available = Array.isArray(items) ? items.filter(Boolean) : [];
  const size = Math.max(0, Math.min(available.length, Math.floor(Number(limit) || 0)));
  if (!size) return [];
  if (available.length <= size) return [...available];
  const cycle = Math.max(0, Math.floor(Number(reviewCount) || 0));
  const start = (cycle * size) % available.length;
  return Array.from({ length: size }, (_, index) => available[(start + index) % available.length]);
}

const GUIDED_RECALL_TYPES = new Set(["MULTIPLE_CHOICE", "CLOZE", "ARTICLE_MATCH", "CONJUGATION"]);
const CONSTRUCTION_TYPES = new Set(["SENTENCE_BUILDER", "ERROR_CORRECTION"]);
const SPANISH_TARGET_TYPES = new Set(["SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT", "TRANSFORMATION", "ERROR_CORRECTION"]);

function practiceDemand(type) {
  if (GUIDED_RECALL_TYPES.has(type)) return "guided";
  if (CONSTRUCTION_TYPES.has(type)) return "construction";
  return "production";
}

function stableVariant(seed) {
  return [...String(seed || "")].reduce((sum, character) => sum + character.codePointAt(0), 0) % 3;
}

function normalizePracticeContent(value) {
  return String(value || "")
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñü]+/g, " ")
    .trim();
}

function preservesPracticeContentSpacing(exercises = []) {
  const keys = exercises.map(practiceContentKey);
  for (let index = 1; index < keys.length; index += 1) {
    if (!keys[index] || keys[index] !== keys[index - 1]) continue;
    if (keys.slice(index + 1).some((key) => key && key !== keys[index])) return false;
  }
  return true;
}

export function practiceContentKey(exercise = {}) {
  const answer = exercise.answerJson && typeof exercise.answerJson === "object" ? exercise.answerJson : {};
  if (Array.isArray(answer.correctWords) && answer.correctWords.length) {
    return normalizePracticeContent(answer.correctWords.join(" "));
  }
  if ((answer.goal || SPANISH_TARGET_TYPES.has(exercise.type)) && typeof answer.correct === "string") {
    return normalizePracticeContent(answer.correct);
  }
  return normalizePracticeContent(exercise.questionText || exercise.prompt || exercise.id || exercise.slug);
}

export function interleaveLessonPracticeQueue(exercises = [], seed = "") {
  const checks = Array.isArray(exercises) ? exercises.filter(Boolean) : [];
  if (checks.length < 3) return [...checks];
  const patterns = [
    ["guided", "construction", "production"],
    ["guided", "production", "construction"],
    ["guided", "construction", "production", "production"]
  ];
  const pattern = patterns[stableVariant(seed)];
  const remaining = checks.map((exercise, originalIndex) => ({
    exercise,
    originalIndex,
    demand: practiceDemand(exercise.type),
    contentKey: practiceContentKey(exercise)
  }));
  const result = [];
  const recentContent = [];

  while (remaining.length) {
    const preferredDemand = pattern[result.length % pattern.length];
    const recentThree = new Set(recentContent.slice(-3).filter(Boolean));
    const lastContent = recentContent.at(-1);
    const choices = [
      (item) => item.demand === preferredDemand && !recentThree.has(item.contentKey),
      (item) => !recentThree.has(item.contentKey),
      (item) => item.demand === preferredDemand && item.contentKey !== lastContent,
      (item) => item.contentKey !== lastContent,
      (item) => item.demand === preferredDemand,
      () => true
    ];
    const nextIndex = choices.reduce((found, matches) => found >= 0 ? found : remaining.findIndex(matches), -1);
    const [next] = remaining.splice(nextIndex, 1);
    result.push(next.exercise);
    recentContent.push(next.contentKey);
  }

  // Finish a teaching session with independent Spanish retrieval whenever the
  // move does not collapse two repetitions together. Recognition is useful
  // early in a wave, but it should not be the final evidence of learning.
  if (practiceDemand(result.at(-1)?.type) !== "production") {
    const finalContentKey = practiceContentKey(result.at(-1));
    const productionCandidates = result
      .map((exercise, index) => ({ exercise, index, difficulty: Number(exercise.difficulty || 0) }))
      .filter((item) => practiceDemand(item.exercise.type) === "production")
      .sort((left, right) => right.difficulty - left.difficulty || right.index - left.index);
    const sameContentProduction = productionCandidates.find((item) => practiceContentKey(item.exercise) === finalContentKey);
    if (sameContentProduction) {
      const finalExercise = result.at(-1);
      result[sameContentProduction.index] = finalExercise;
      result[result.length - 1] = sameContentProduction.exercise;
    } else {
      const safeMove = productionCandidates
        .map((item) => ({
          ...item,
          proposed: [...result.slice(0, item.index), ...result.slice(item.index + 1), item.exercise]
        }))
        .find((item) => preservesPracticeContentSpacing(item.proposed));
      if (safeMove) return safeMove.proposed;
    }
  }
  return result;
}

function reviewItemType(item = {}) {
  if (item.type === "mistake") return "mistake";
  if (item.type === "word" || item.word) return "word";
  return "grammar";
}

export function reviewItemContentKey(item = {}) {
  if (item.exercise) return `sentence:${practiceContentKey(item.exercise)}`;
  if (item.word) return `word:${normalizePracticeContent(item.word.spanish || item.word.id)}`;
  return `item:${normalizePracticeContent(item.key || item.id || item.title)}`;
}

export function interleaveReviewSessionItems(items = [], seed = "") {
  const checks = Array.isArray(items) ? items.filter(Boolean) : [];
  if (checks.length < 3) return [...checks];
  const patterns = [
    ["mistake", "grammar", "word"],
    ["mistake", "word", "grammar"],
    ["mistake", "grammar", "word", "grammar"]
  ];
  const pattern = patterns[stableVariant(seed)];
  const remaining = checks.map((item) => ({
    item,
    type: reviewItemType(item),
    contentKey: reviewItemContentKey(item)
  }));
  const result = [];
  const recentContent = [];
  const recentTypes = [];

  while (remaining.length) {
    const preferredType = pattern[result.length % pattern.length];
    const recentKeys = new Set(recentContent.slice(-2).filter(Boolean));
    const lastType = recentTypes.at(-1);
    const lastContent = recentContent.at(-1);
    const choices = [
      (entry) => entry.type === preferredType && entry.type !== lastType && !recentKeys.has(entry.contentKey),
      (entry) => entry.type !== lastType && !recentKeys.has(entry.contentKey),
      (entry) => entry.type === preferredType && entry.contentKey !== lastContent,
      (entry) => entry.type !== lastType && entry.contentKey !== lastContent,
      (entry) => entry.contentKey !== lastContent,
      (entry) => entry.type === preferredType,
      () => true
    ];
    const nextIndex = choices.reduce((found, matches) => found >= 0 ? found : remaining.findIndex(matches), -1);
    const [next] = remaining.splice(nextIndex, 1);
    result.push(next.item);
    recentContent.push(next.contentKey);
    recentTypes.push(next.type);
  }

  return result;
}

export function advanceLessonPracticeQueue(queue = [], wasCorrect) {
  const [current, ...remaining] = Array.isArray(queue) ? queue : [];
  if (!current) return [];

  // Preserve passed checks. A miss stays in the active queue, but moves behind
  // the other remaining checks instead of forcing a full lesson restart.
  if (wasCorrect) return remaining;
  const retryCount = (current.sessionRetryCount || 0) + 1;
  return [...remaining, { ...current, sessionCorrection: true, sessionRetryCount: retryCount }];
}

export function advanceReviewSession(items = [], currentIndex = 0, wasCorrect = false) {
  const list = Array.isArray(items) ? items : [];
  const index = Math.max(0, Math.floor(Number(currentIndex) || 0));
  const current = list[index];
  if (!current) return { items: list, nextIndex: index, finished: true };

  if (wasCorrect) {
    const nextIndex = index + 1;
    return { items: list, nextIndex, finished: nextIndex >= list.length };
  }

  const originalKey = current.originalKey || current.key || current.id || `item-${index}`;
  const retryCount = (current.retryCount || 0) + 1;
  const retry = {
    ...current,
    key: `${originalKey}:retry:${retryCount}`,
    originalKey,
    retry: true,
    retryCount
  };
  return {
    items: [...list, retry],
    nextIndex: index + 1,
    finished: false
  };
}
