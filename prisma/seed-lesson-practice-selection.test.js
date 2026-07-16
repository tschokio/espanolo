const assert = require("node:assert/strict");
const test = require("node:test");
const { ExerciseType } = require("@prisma/client");
const {
  balancedSupplementSelection,
  CORE_EXERCISE_COUNT,
  CHECKPOINT_EXERCISE_COUNT
} = require("./seed-lesson-practice");

const candidate = (key, type) => ({ key, type });

test("core and checkpoint sessions use deliberately bounded sizes", () => {
  assert.equal(CORE_EXERCISE_COUNT, 10);
  assert.equal(CHECKPOINT_EXERCISE_COUNT, 12);
  assert.ok(CHECKPOINT_EXERCISE_COUNT > CORE_EXERCISE_COUNT);
});

test("supplement selection fills missing exercise types before repeating a type", () => {
  const authored = [candidate("authored-choice", ExerciseType.MULTIPLE_CHOICE)];
  const candidates = [
    candidate("translate-1", ExerciseType.TRANSLATION),
    candidate("translate-2", ExerciseType.TRANSLATION),
    candidate("builder-1", ExerciseType.SENTENCE_BUILDER),
    candidate("vocab-1", ExerciseType.MULTIPLE_CHOICE),
    candidate("builder-2", ExerciseType.SENTENCE_BUILDER)
  ];
  const selected = balancedSupplementSelection(candidates, authored, 4);
  assert.deepEqual(selected.map((item) => item.key), ["builder-1", "translate-1", "vocab-1"]);
});

test("supplement selection never exceeds the remaining session capacity", () => {
  const authored = Array.from({ length: 8 }, (_, index) => candidate(`authored-${index}`, ExerciseType.MULTIPLE_CHOICE));
  const candidates = Array.from({ length: 20 }, (_, index) => candidate(`candidate-${index}`, ExerciseType.TRANSLATION));
  assert.equal(balancedSupplementSelection(candidates, authored, CORE_EXERCISE_COUNT).length, 2);
});
