// Version 3 invalidates saved numeric steps from before the vocabulary lab;
// otherwise an interrupted lesson could resume at a different learning stage.
export const LESSON_RESUME_VERSION = 3;
export const LESSON_RESUME_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function stableHash(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function lessonResumeSignature(lesson = {}) {
  const sentences = (lesson.sentences || []).map((sentence) => `${sentence.id || ""}:${sentence.spanish || ""}`).join("|");
  const exercises = (lesson.exercises || []).map((exercise) => `${exercise.id || ""}:${exercise.type || ""}:${exercise.questionText || ""}`).join("|");
  return stableHash([
    lesson.id || "",
    lesson.updatedAt || "",
    lesson.reviewDue ? "review" : "learn",
    lesson.lessonReviewCount || 0,
    sentences,
    exercises
  ].join("::"));
}

function safeSentenceIndexes(values, sentenceCount) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value) => Number.isSafeInteger(value) && value >= 0 && value < sentenceCount))];
}

function safeExerciseIds(values, lesson) {
  const available = new Set((lesson?.exercises || []).map((exercise) => exercise.id).filter(Boolean));
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value) => available.has(value)))];
}

function safeFirstPassResults(values, lesson) {
  const available = new Set((lesson?.exercises || []).map((exercise) => exercise.id).filter(Boolean));
  const seen = new Set();
  if (!Array.isArray(values)) return [];
  return values.filter((result) => {
    if (!result || !available.has(result.exerciseId) || seen.has(result.exerciseId) || typeof result.correct !== "boolean") return false;
    seen.add(result.exerciseId);
    return true;
  }).map((result) => ({ exerciseId: result.exerciseId, correct: result.correct, usedSupport: Boolean(result.usedSupport) }));
}

export function createLessonResumeState({ lesson, step = 0, weakSentenceIndexes = [], scaffoldedSentenceIndexes = [], practiceTargetExerciseIds = [], firstPassResults = [], correctionExerciseIds = [], savedAt = new Date() } = {}) {
  const sentenceCount = Array.isArray(lesson?.sentences) ? lesson.sentences.length : 0;
  return {
    version: LESSON_RESUME_VERSION,
    lessonId: lesson?.id || "",
    signature: lessonResumeSignature(lesson),
    step: Math.max(0, Number.isSafeInteger(step) ? step : 0),
    weakSentenceIndexes: safeSentenceIndexes(weakSentenceIndexes, sentenceCount),
    scaffoldedSentenceIndexes: safeSentenceIndexes(scaffoldedSentenceIndexes, sentenceCount),
    practiceTargetExerciseIds: safeExerciseIds(practiceTargetExerciseIds, lesson),
    firstPassResults: safeFirstPassResults(firstPassResults, lesson),
    correctionExerciseIds: safeExerciseIds(correctionExerciseIds, lesson),
    savedAt: new Date(savedAt).toISOString()
  };
}

export function restoreLessonResumeState(rawValue, { lesson, maxStep = 0, now = new Date() } = {}) {
  const empty = { step: 0, weakSentenceIndexes: [], scaffoldedSentenceIndexes: [], practiceTargetExerciseIds: [], firstPassResults: [], correctionExerciseIds: [], resumed: false };
  if (!rawValue || !lesson?.id) return empty;
  try {
    const record = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
    const savedAt = new Date(record?.savedAt);
    const age = new Date(now).getTime() - savedAt.getTime();
    if (
      record?.version !== LESSON_RESUME_VERSION ||
      record.lessonId !== lesson.id ||
      record.signature !== lessonResumeSignature(lesson) ||
      Number.isNaN(savedAt.getTime()) ||
      age < 0 ||
      age > LESSON_RESUME_MAX_AGE_MS
    ) return empty;

    const sentenceCount = Array.isArray(lesson.sentences) ? lesson.sentences.length : 0;
    const boundedMax = Math.max(0, Number.isSafeInteger(maxStep) ? maxStep : 0);
    const step = Math.min(Math.max(0, Number.isSafeInteger(record.step) ? record.step : 0), boundedMax);
    return {
      step,
      weakSentenceIndexes: safeSentenceIndexes(record.weakSentenceIndexes, sentenceCount),
      scaffoldedSentenceIndexes: safeSentenceIndexes(record.scaffoldedSentenceIndexes, sentenceCount),
      practiceTargetExerciseIds: safeExerciseIds(record.practiceTargetExerciseIds, lesson),
      firstPassResults: safeFirstPassResults(record.firstPassResults, lesson),
      correctionExerciseIds: safeExerciseIds(record.correctionExerciseIds, lesson),
      resumed: step > 0
    };
  } catch {
    return empty;
  }
}
