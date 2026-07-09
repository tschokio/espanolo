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

export function advanceLessonPracticeQueue(queue = [], wasCorrect) {
  const [current, ...remaining] = Array.isArray(queue) ? queue : [];
  if (!current) return [];

  // Preserve passed checks. A miss stays in the active queue, but moves behind
  // the other remaining checks instead of forcing a full lesson restart.
  return wasCorrect ? remaining : [...remaining, current];
}
