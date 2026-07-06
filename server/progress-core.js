function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toDate(value) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

function uniqueCorrectCount(correctExerciseIds = []) {
  return new Set(correctExerciseIds.filter(Boolean)).size;
}

function buildLessonProgressState(existingProgress, totalExercises, correctExerciseIds, now = new Date()) {
  const total = Math.max(0, Number(totalExercises) || 0);
  const completedExercises = Math.min(total, uniqueCorrectCount(correctExerciseIds));
  const mastery = total > 0 ? Math.round((completedExercises / total) * 100) : 0;
  const mastered = total > 0 && mastery >= 100;
  const existingCompletedAt = toDate(existingProgress?.completedAt);
  const existingReviewDueAt = toDate(existingProgress?.reviewDueAt);

  return {
    completedExercises,
    totalExercises: total,
    mastery,
    completedAt: mastered ? existingCompletedAt || now : null,
    reviewDueAt: mastered ? existingReviewDueAt || addDays(now, 1) : null
  };
}

function sameDateTime(left, right) {
  const leftDate = toDate(left);
  const rightDate = toDate(right);
  if (!leftDate && !rightDate) return true;
  if (!leftDate || !rightDate) return false;
  return leftDate.getTime() === rightDate.getTime();
}

function lessonProgressNeedsSync(existingProgress, state) {
  if (!existingProgress) return state.completedExercises > 0 || state.mastery > 0;
  return (
    (existingProgress.completedExercises || 0) !== state.completedExercises ||
    (existingProgress.totalExercises || 0) !== state.totalExercises ||
    (existingProgress.mastery || 0) !== state.mastery ||
    !sameDateTime(existingProgress.completedAt, state.completedAt) ||
    !sameDateTime(existingProgress.reviewDueAt, state.reviewDueAt)
  );
}

function applyCheckpointLocksToSummaries(lessonSummaries = []) {
  const lessons = lessonSummaries.filter(Boolean);
  const byUnit = new Map();

  for (const lesson of lessons) {
    const unitSlug = lesson.unit?.slug || "unassigned";
    if (!byUnit.has(unitSlug)) byUnit.set(unitSlug, []);
    byUnit.get(unitSlug).push(lesson);
  }

  const lockedCheckpointIds = new Set();
  const lockedReasons = new Map();
  for (const unitLessons of byUnit.values()) {
    const ordered = [...unitLessons].sort((left, right) => (left.order || 0) - (right.order || 0));
    for (const lesson of ordered) {
      if (!lesson.isCheckpoint) continue;
      const prerequisites = ordered.filter((candidate) => !candidate.isCheckpoint && (candidate.order || 0) < (lesson.order || 0));
      const incompletePrerequisites = prerequisites.filter(
        (candidate) => (candidate.progress || 0) < 100 || Boolean(candidate.reviewDue)
      );
      if (!incompletePrerequisites.length) continue;

      lockedCheckpointIds.add(lesson.id);
      const unitLabel = lesson.unit?.label || "this unit";
      const count = incompletePrerequisites.length;
      lockedReasons.set(
        lesson.id,
        `Complete ${count} earlier ${count === 1 ? "lesson" : "lessons"} in ${unitLabel} before this checkpoint.`
      );
    }
  }

  return lessons.map((lesson) => {
    const actualProgress = lesson.progress || 0;
    const actualCompletedExercises = lesson.completedExercises || 0;
    const actualStatus = lesson.status || "not_started";
    const locked = lockedCheckpointIds.has(lesson.id);
    if (!locked) {
      return {
        ...lesson,
        isLocked: false,
        lockedReason: "",
        actualProgress,
        displayProgress: actualProgress
      };
    }

    return {
      ...lesson,
      isLocked: true,
      lockedReason: lockedReasons.get(lesson.id) || "Complete the earlier lessons before this checkpoint.",
      actualProgress,
      actualCompletedExercises,
      actualStatus,
      displayProgress: 0,
      progress: 0,
      completedExercises: 0,
      completedAt: null,
      reviewDueAt: null,
      reviewDue: false,
      status: "locked"
    };
  });
}

module.exports = {
  applyCheckpointLocksToSummaries,
  buildLessonProgressState,
  lessonProgressNeedsSync
};
