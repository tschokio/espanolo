const test = require("node:test");
const assert = require("node:assert/strict");

const { applyCheckpointLocksToSummaries, buildLessonProgressState, checkpointUnlockState, progressiveLessonUnlockState, lessonProgressNeedsSync } = require("./progress-core");

test("drops old complete progress when a lesson gains new exercises", () => {
  const completedAt = new Date("2026-07-01T00:00:00.000Z");
  const reviewDueAt = new Date("2026-07-02T00:00:00.000Z");
  const state = buildLessonProgressState(
    {
      completedExercises: 2,
      totalExercises: 2,
      mastery: 100,
      completedAt,
      reviewDueAt
    },
    4,
    ["a", "b"],
    new Date("2026-07-06T00:00:00.000Z")
  );

  assert.equal(state.completedExercises, 2);
  assert.equal(state.totalExercises, 4);
  assert.equal(state.mastery, 50);
  assert.equal(state.completedAt, null);
  assert.equal(state.reviewDueAt, null);
});

test("keeps completion only when all current lesson checks are mastered", () => {
  const completedAt = new Date("2026-07-01T00:00:00.000Z");
  const reviewDueAt = new Date("2026-07-03T00:00:00.000Z");
  const state = buildLessonProgressState(
    {
      completedExercises: 3,
      totalExercises: 3,
      mastery: 100,
      completedAt,
      reviewDueAt
    },
    3,
    ["a", "b", "c"],
    new Date("2026-07-06T00:00:00.000Z")
  );

  assert.equal(state.mastery, 100);
  assert.equal(state.completedAt, completedAt);
  assert.equal(state.reviewDueAt, reviewDueAt);
});

test("detects stale stored progress totals", () => {
  const existing = {
    completedExercises: 2,
    totalExercises: 2,
    mastery: 100,
    completedAt: new Date("2026-07-01T00:00:00.000Z"),
    reviewDueAt: new Date("2026-07-02T00:00:00.000Z")
  };
  const state = buildLessonProgressState(existing, 4, ["a", "b"], new Date("2026-07-06T00:00:00.000Z"));

  assert.equal(lessonProgressNeedsSync(existing, state), true);
});

test("keeps fresh checkpoints locked until earlier unit lessons are complete", () => {
  const unit = { slug: "a1-final", label: "A1", title: "A1 Foundations" };
  const lessons = applyCheckpointLocksToSummaries([
    { id: "lesson-1", title: "Core 1", order: 10, unit, progress: 40, isCheckpoint: false, reviewDue: false, status: "practicing" },
    { id: "lesson-2", title: "Core 2", order: 20, unit, progress: 0, isCheckpoint: false, reviewDue: false, status: "not_started" },
    {
      id: "checkpoint",
      title: "Final Checkpoint",
      order: 30,
      unit,
      progress: 0,
      completedExercises: 0,
      isCheckpoint: true,
      reviewDue: false,
      status: "not_started"
    }
  ]);
  const checkpoint = lessons.find((lesson) => lesson.id === "checkpoint");

  assert.equal(checkpoint.isLocked, true);
  assert.equal(checkpoint.progress, 0);
  assert.equal(checkpoint.displayProgress, 0);
  assert.equal(checkpoint.actualProgress, 0);
  assert.equal(checkpoint.completedExercises, 0);
  assert.equal(checkpoint.actualCompletedExercises, 0);
  assert.match(checkpoint.lockedReason, /Complete 2 earlier learning packages/);
});

test("locks and hides saved checkpoint progress until earlier unit lessons are complete", () => {
  const unit = { slug: "a1-final", label: "A1", title: "A1 Foundations" };
  const lessons = applyCheckpointLocksToSummaries([
    { id: "lesson-1", title: "Core 1", order: 10, unit, progress: 40, isCheckpoint: false, reviewDue: false, status: "practicing" },
    { id: "lesson-2", title: "Core 2", order: 20, unit, progress: 0, isCheckpoint: false, reviewDue: false, status: "not_started" },
    {
      id: "checkpoint",
      title: "Final Checkpoint",
      order: 30,
      unit,
      progress: 92,
      completedExercises: 11,
      isCheckpoint: true,
      reviewDue: false,
      status: "practicing"
    }
  ]);
  const checkpoint = lessons.find((lesson) => lesson.id === "checkpoint");

  assert.equal(checkpoint.isLocked, true);
  assert.equal(checkpoint.progress, 0);
  assert.equal(checkpoint.displayProgress, 0);
  assert.equal(checkpoint.actualProgress, 92);
  assert.equal(checkpoint.completedExercises, 0);
  assert.equal(checkpoint.actualCompletedExercises, 11);
  assert.match(checkpoint.lockedReason, /Complete 2 earlier learning packages/);
});

test("opens exactly the next untouched package across unit and level boundaries", () => {
  const lessons = applyCheckpointLocksToSummaries([
    { id: "first", title: "First", order: 1, unit: { slug: "a1-one", label: "A1.1" }, progress: 100, isCheckpoint: false },
    { id: "next", title: "Next", order: 2, unit: { slug: "a1-one", label: "A1.1" }, progress: 0, isCheckpoint: false },
    { id: "later", title: "Later", order: 3, unit: { slug: "a1-one", label: "A1.1" }, progress: 0, isCheckpoint: false },
    { id: "future-level", title: "Future", order: 100, unit: { slug: "a2-one", label: "A2.1" }, progress: 0, isCheckpoint: false }
  ]);

  assert.equal(lessons.find((lesson) => lesson.id === "first").isLocked, false);
  assert.equal(lessons.find((lesson) => lesson.id === "next").isLocked, false);
  assert.equal(lessons.find((lesson) => lesson.id === "later").isLocked, true);
  assert.equal(lessons.find((lesson) => lesson.id === "future-level").isLocked, true);
  assert.equal(lessons.find((lesson) => lesson.id === "later").unlockState.blockingLesson.id, "next");
});

test("keeps legacy started packages and completed review material accessible", () => {
  const lessons = applyCheckpointLocksToSummaries([
    { id: "gap", order: 1, progress: 0, isCheckpoint: false },
    { id: "legacy-started", order: 2, progress: 25, isCheckpoint: false },
    { id: "legacy-complete", order: 3, progress: 100, reviewDue: true, isCheckpoint: false },
    { id: "new-after-gap", order: 4, progress: 0, isCheckpoint: false }
  ]);

  assert.equal(lessons.find((lesson) => lesson.id === "gap").isLocked, false);
  assert.equal(lessons.find((lesson) => lesson.id === "legacy-started").isLocked, false);
  assert.equal(lessons.find((lesson) => lesson.id === "legacy-complete").isLocked, false);
  assert.equal(lessons.find((lesson) => lesson.id === "new-after-gap").isLocked, true);
  assert.equal(progressiveLessonUnlockState({ id: "started", order: 9, progress: 10 }, [{ id: "gap", order: 1, progress: 0 }]).unlocked, true);
});

test("keeps checkpoint progress visible after unit lessons are complete", () => {
  const unit = { slug: "a1-final", label: "A1", title: "A1 Foundations" };
  const lessons = applyCheckpointLocksToSummaries([
    { id: "lesson-1", title: "Core 1", order: 10, unit, progress: 100, isCheckpoint: false, reviewDue: false, status: "completed" },
    { id: "lesson-2", title: "Core 2", order: 20, unit, progress: 100, isCheckpoint: false, reviewDue: false, status: "completed" },
    {
      id: "checkpoint",
      title: "Final Checkpoint",
      order: 30,
      unit,
      progress: 92,
      completedExercises: 11,
      isCheckpoint: true,
      reviewDue: false,
      status: "practicing"
    }
  ]);
  const checkpoint = lessons.find((lesson) => lesson.id === "checkpoint");

  assert.equal(checkpoint.isLocked, false);
  assert.equal(checkpoint.progress, 92);
  assert.equal(checkpoint.displayProgress, 92);
  assert.equal(checkpoint.actualProgress, 92);
});

test("keeps checkpoints open when completed prerequisite lessons are due for review", () => {
  const unit = { slug: "a1-final", label: "A1", title: "A1 Foundations" };
  const lessons = applyCheckpointLocksToSummaries([
    { id: "lesson-1", title: "Core 1", order: 10, unit, progress: 100, isCheckpoint: false, reviewDue: true, status: "review_due" },
    { id: "lesson-2", title: "Core 2", order: 20, unit, progress: 100, isCheckpoint: false, reviewDue: false, status: "completed" },
    {
      id: "checkpoint",
      title: "Final Checkpoint",
      order: 30,
      unit,
      progress: 0,
      completedExercises: 0,
      isCheckpoint: true,
      reviewDue: false,
      status: "not_started"
    }
  ]);
  const checkpoint = lessons.find((lesson) => lesson.id === "checkpoint");

  assert.equal(checkpoint.isLocked, false);
  assert.equal(checkpoint.progress, 0);
  assert.equal(checkpoint.lockedReason, "");
});

test("uses the latest prerequisite completion time as the checkpoint unlock time", () => {
  const unit = { slug: "a1-final", label: "A1", title: "A1 Foundations" };
  const lessons = [
    {
      id: "lesson-1",
      title: "Core 1",
      order: 10,
      unit,
      progress: 100,
      completedAt: new Date("2026-07-01T10:00:00.000Z"),
      isCheckpoint: false,
      reviewDue: false,
      status: "completed"
    },
    {
      id: "lesson-2",
      title: "Core 2",
      order: 20,
      unit,
      progress: 100,
      completedAt: new Date("2026-07-02T10:00:00.000Z"),
      isCheckpoint: false,
      reviewDue: false,
      status: "completed"
    },
    {
      id: "checkpoint",
      title: "Final Checkpoint",
      order: 30,
      unit,
      progress: 0,
      completedExercises: 0,
      isCheckpoint: true,
      reviewDue: false,
      status: "not_started"
    }
  ];

  const state = checkpointUnlockState(lessons[2], lessons);

  assert.equal(state.unlocked, true);
  assert.equal(state.incompleteCount, 0);
  assert.equal(state.unlockAt.toISOString(), "2026-07-02T10:00:00.000Z");
});
