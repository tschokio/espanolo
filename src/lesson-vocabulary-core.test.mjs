import assert from "node:assert/strict";
import test from "node:test";

import { buildLessonVocabularyLab } from "./lesson-vocabulary-core.mjs";

const words = Array.from({ length: 10 }, (_, index) => ({
  id: `word-${index}`,
  spanish: `palabra ${index}`,
  english: `meaning ${index}`,
  example: `Uso palabra ${index} en contexto.`
}));

test("a lesson vocabulary lab stays small and moves from study through recognition to production", () => {
  const lab = buildLessonVocabularyLab(words, (word) => `Bedeutung ${word.id}`, "lesson-one");

  assert.equal(lab.items.length, 8);
  assert.equal(lab.checks.length, 3);
  assert.equal(lab.checks.every((check) => check.options.length === 3), true);
  assert.equal(lab.checks.every((check) => check.options.filter((option) => option.correct).length === 1), true);
  assert.ok(lab.productionTarget);
  assert.match(lab.productionTarget.meaning, /^Bedeutung/);
});

test("vocabulary checks are stable per lesson but do not always put the answer first", () => {
  const first = buildLessonVocabularyLab(words, (word) => word.english, "lesson-one");
  const repeated = buildLessonVocabularyLab([...words], (word) => word.english, "lesson-one");

  assert.deepEqual(first, repeated);
  assert.ok(first.checks.some((check) => !check.options[0].correct));
});

test("a final one-word batch still provides contextual study and active production", () => {
  const lab = buildLessonVocabularyLab([words[0]], (word) => word.english, "last-lesson");

  assert.equal(lab.items.length, 1);
  assert.deepEqual(lab.checks, []);
  assert.equal(lab.productionTarget.id, "word-0");
});
