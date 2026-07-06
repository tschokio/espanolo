const test = require("node:test");
const assert = require("node:assert/strict");

const { buildLessonProgressState, lessonProgressNeedsSync } = require("./progress-core");

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
