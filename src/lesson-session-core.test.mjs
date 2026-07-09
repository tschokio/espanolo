import assert from "node:assert/strict";
import test from "node:test";

import { advanceLessonPracticeQueue, buildLessonPracticeQueue } from "./lesson-session-core.mjs";

const checks = [
  { id: "identity", mastered: true },
  { id: "location", mastered: false },
  { id: "state", mastered: false }
];

test("starts an unfinished lesson with only its unmastered checks", () => {
  const queue = buildLessonPracticeQueue(checks);

  assert.deepEqual(queue.map((check) => check.id), ["location", "state"]);
  assert.deepEqual(checks.map((check) => check.id), ["identity", "location", "state"]);
});

test("uses the full set when reviewing an already mastered lesson", () => {
  const masteredChecks = checks.map((check) => ({ ...check, mastered: true }));

  assert.deepEqual(
    buildLessonPracticeQueue(masteredChecks).map((check) => check.id),
    ["identity", "location", "state"]
  );
});

test("a missed check is retried after the remaining checks without restarting them", () => {
  const originalQueue = buildLessonPracticeQueue(checks);
  const afterMiss = advanceLessonPracticeQueue(originalQueue, false);
  const afterLocation = advanceLessonPracticeQueue(afterMiss, true);
  const afterState = advanceLessonPracticeQueue(afterLocation, true);
  const complete = advanceLessonPracticeQueue(afterState, true);

  assert.deepEqual(originalQueue.map((check) => check.id), ["location", "state"]);
  assert.deepEqual(afterMiss.map((check) => check.id), ["state", "location"]);
  assert.deepEqual(afterLocation.map((check) => check.id), ["location"]);
  assert.deepEqual(afterState.map((check) => check.id), []);
  assert.deepEqual(complete, []);
});

test("advancing an empty queue is safe", () => {
  assert.deepEqual(advanceLessonPracticeQueue([], false), []);
  assert.deepEqual(advanceLessonPracticeQueue(null, true), []);
});
