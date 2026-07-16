import assert from "node:assert/strict";
import test from "node:test";

import { createLessonResumeState, lessonResumeSignature, restoreLessonResumeState } from "./lesson-resume-core.mjs";

const lesson = {
  id: "lesson-1",
  updatedAt: "2026-07-13T10:00:00.000Z",
  reviewDue: false,
  lessonReviewCount: 0,
  sentences: [
    { id: "s1", spanish: "Soy estudiante." },
    { id: "s2", spanish: "Estoy en casa." }
  ],
  exercises: [{ id: "e1", type: "TRANSLATION", questionText: "I am a student." }]
};

test("a valid lesson resume survives a later browser session with bounded sentence evidence", () => {
  const savedAt = new Date("2026-07-13T12:00:00.000Z");
  const state = createLessonResumeState({
    lesson,
    step: 5,
    weakSentenceIndexes: [1, 1, 99],
    scaffoldedSentenceIndexes: [0, -1],
    practiceTargetExerciseIds: ["e1", "missing"],
    firstPassResults: [
      { exerciseId: "e1", correct: false, usedSupport: true },
      { exerciseId: "e1", correct: true },
      { exerciseId: "missing", correct: true }
    ],
    correctionExerciseIds: ["e1", "missing"],
    savedAt
  });
  const restored = restoreLessonResumeState(JSON.stringify(state), {
    lesson,
    maxStep: 8,
    now: new Date("2026-07-14T12:00:00.000Z")
  });

  assert.deepEqual(restored, {
    step: 5,
    weakSentenceIndexes: [1],
    scaffoldedSentenceIndexes: [0],
    practiceTargetExerciseIds: ["e1"],
    firstPassResults: [{ exerciseId: "e1", correct: false, usedSupport: true }],
    correctionExerciseIds: ["e1"],
    resumed: true
  });
});

test("a stale oversized step is safely clamped instead of producing a blank lesson", () => {
  const state = createLessonResumeState({ lesson, step: 999, savedAt: new Date("2026-07-13T12:00:00.000Z") });
  const restored = restoreLessonResumeState(state, {
    lesson,
    maxStep: 7,
    now: new Date("2026-07-13T13:00:00.000Z")
  });

  assert.equal(restored.step, 7);
  assert.equal(restored.resumed, true);
});

test("changed, expired, malformed, and wrong-lesson records restart safely", () => {
  const state = createLessonResumeState({ lesson, step: 4, savedAt: new Date("2026-06-01T00:00:00.000Z") });
  const changedLesson = { ...lesson, sentences: [...lesson.sentences, { id: "s3", spanish: "Hablo español." }] };
  const wrongLesson = { ...lesson, id: "lesson-2" };
  const now = new Date("2026-07-13T12:00:00.000Z");

  assert.equal(restoreLessonResumeState(state, { lesson, maxStep: 8, now }).resumed, false);
  assert.equal(restoreLessonResumeState({ ...state, savedAt: now.toISOString() }, { lesson: changedLesson, maxStep: 8, now }).resumed, false);
  assert.equal(restoreLessonResumeState({ ...state, savedAt: now.toISOString() }, { lesson: wrongLesson, maxStep: 8, now }).resumed, false);
  assert.equal(restoreLessonResumeState("not-json", { lesson, maxStep: 8, now }).resumed, false);
  assert.notEqual(lessonResumeSignature(lesson), lessonResumeSignature(changedLesson));
});
