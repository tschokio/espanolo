const test = require("node:test");
const assert = require("node:assert/strict");

const { applyCheckpointLocksToSummaries, buildLessonProgressState, lessonProgressNeedsSync } = require("./progress-core");

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

test("locks checkpoint display progress until earlier unit lessons are complete", () => {
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
  assert.match(checkpoint.lockedReason, /Complete 2 earlier lessons/);
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
