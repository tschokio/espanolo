import assert from "node:assert/strict";
import test from "node:test";

import { buildLessonSentenceFrames } from "./lesson-pattern-core.mjs";

test("groups repeated sentence openings into productive frames", () => {
  const frames = buildLessonSentenceFrames([
    { spanish: "Estoy en casa.", english: "I am at home." },
    { spanish: "Estoy en la biblioteca.", english: "I am in the library." },
    { spanish: "Necesito ayuda.", english: "I need help." }
  ]);
  assert.equal(frames[0].starter, "Estoy en");
  assert.deepEqual(frames[0].examples.map((example) => example.ending), ["casa", "la biblioteca"]);
  assert.equal(frames[1].completePhrases, true);
});

test("keeps unrelated examples as useful complete phrases", () => {
  const frames = buildLessonSentenceFrames([
    { spanish: "Hola.", english: "Hello." },
    { spanish: "Gracias.", english: "Thank you." }
  ]);
  assert.equal(frames.length, 1);
  assert.equal(frames[0].examples.length, 2);
});
