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

function checkpointUnlockState(lesson, lessonSummaries = []) {
  const unitSlug = lesson.unit?.slug || "unassigned";
  const lessonOrder = lesson.order || 0;
  const prerequisites = lessonSummaries.filter(
    (candidate) =>
      candidate &&
      !candidate.isCheckpoint &&
      (candidate.unit?.slug || "unassigned") === unitSlug &&
      (candidate.order || 0) < lessonOrder
  );
  const incompletePrerequisites = prerequisites.filter((candidate) => (candidate.progress || 0) < 100);
  const completedTimes = prerequisites
    .map((candidate) => toDate(candidate.completedAt))
    .filter(Boolean)
    .map((date) => date.getTime());

  return {
    unlocked: incompletePrerequisites.length === 0,
    incompleteCount: incompletePrerequisites.length,
    unlockAt: incompletePrerequisites.length === 0 && completedTimes.length ? new Date(Math.max(...completedTimes)) : null
  };
}

function progressiveLessonUnlockState(lesson, lessonSummaries = []) {
  const lessonOrder = Number(lesson?.order || 0);
  const actualProgress = Number(lesson?.actualProgress ?? lesson?.progress ?? 0);
  // Preserve access to anything the learner has already begun. This keeps
  // existing progress and deliberate review available after curriculum edits.
  if (!lesson?.isCheckpoint && actualProgress > 0) {
    return { unlocked: true, incompleteCount: 0, blockingLesson: null };
  }

  const prerequisites = (Array.isArray(lessonSummaries) ? lessonSummaries : [])
    .filter((candidate) => candidate && candidate.id !== lesson?.id && Number(candidate.order || 0) < lessonOrder)
    .sort((left, right) => Number(left.order || 0) - Number(right.order || 0));
  const incompletePrerequisites = prerequisites.filter((candidate) => Number(candidate.actualProgress ?? candidate.progress ?? 0) < 100);
  const blocker = incompletePrerequisites[0] || null;
  return {
    unlocked: incompletePrerequisites.length === 0,
    incompleteCount: incompletePrerequisites.length,
    blockingLesson: blocker
      ? {
          id: blocker.id,
          slug: blocker.slug,
          title: blocker.title,
          order: blocker.order,
          cefrLevel: blocker.cefrLevel,
          unit: blocker.unit ? { slug: blocker.unit.slug, label: blocker.unit.label } : null
        }
      : null
  };
}

function applyCheckpointLocksToSummaries(lessonSummaries = []) {
  const lessons = lessonSummaries.filter(Boolean);
  const globallyOrdered = [...lessons].sort((left, right) => Number(left.order || 0) - Number(right.order || 0));
  const byUnit = new Map();

  for (const lesson of lessons) {
    const unitSlug = lesson.unit?.slug || "unassigned";
    if (!byUnit.has(unitSlug)) byUnit.set(unitSlug, []);
    byUnit.get(unitSlug).push(lesson);
  }

  const lockedCheckpointIds = new Set();
  const lockedReasons = new Map();
  const unlockStates = new Map();
  for (const unitLessons of byUnit.values()) {
    const ordered = [...unitLessons].sort((left, right) => (left.order || 0) - (right.order || 0));
    for (const lesson of ordered) {
      if (!lesson.isCheckpoint) continue;
      const lockState = checkpointUnlockState(lesson, ordered);
      if (lockState.unlocked) continue;

      lockedCheckpointIds.add(lesson.id);
      const count = lockState.incompleteCount;
      lockedReasons.set(
        lesson.id,
        `Complete ${count} earlier ${count === 1 ? "learning package" : "learning packages"} before this checkpoint.`
      );
    }
  }

  const lockedLessonIds = new Set(lockedCheckpointIds);
  for (const lesson of globallyOrdered) {
    const lockState = progressiveLessonUnlockState(lesson, globallyOrdered);
    unlockStates.set(lesson.id, lockState);
    if (lockState.unlocked) continue;
    lockedLessonIds.add(lesson.id);
    if (!lockedReasons.has(lesson.id)) {
      lockedReasons.set(
        lesson.id,
        `Complete the earlier learning package${lockState.incompleteCount === 1 ? "" : "s"} before starting this one.`
      );
    }
  }

  return lessons.map((lesson) => {
    const actualProgress = lesson.progress || 0;
    const actualCompletedExercises = lesson.completedExercises || 0;
    const actualStatus = lesson.status || "not_started";
    const locked = lockedLessonIds.has(lesson.id);
    if (!locked) {
      return {
        ...lesson,
        isLocked: false,
        lockedReason: "",
        unlockState: unlockStates.get(lesson.id) || { unlocked: true, incompleteCount: 0, blockingLesson: null },
        actualProgress,
        displayProgress: actualProgress
      };
    }

    return {
      ...lesson,
      isLocked: true,
      lockedReason: lockedReasons.get(lesson.id) || "Complete the earlier lessons before this checkpoint.",
      unlockState: unlockStates.get(lesson.id) || { unlocked: false, incompleteCount: 1, blockingLesson: null },
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
  checkpointUnlockState,
  progressiveLessonUnlockState,
  lessonProgressNeedsSync
};
