import assert from "node:assert/strict";
import test from "node:test";
import prismaPackage from "@prisma/client";

import { advanceLessonPracticeQueue, advanceReviewSession, buildLessonPracticeQueue, interleaveLessonPracticeQueue, interleaveReviewSessionItems, practiceContentKey, reviewItemContentKey, rotateLessonReviewItems } from "./lesson-session-core.mjs";

const { PrismaClient } = prismaPackage;

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

test("scheduled lesson reviews rotate a bounded sample until every item has returned", () => {
  const items = Array.from({ length: 10 }, (_, index) => `item-${index}`);
  const first = rotateLessonReviewItems(items, 0, 4);
  const second = rotateLessonReviewItems(items, 1, 4);
  const seen = new Set();
  for (let cycle = 0; cycle < 5; cycle += 1) {
    rotateLessonReviewItems(items, cycle, 4).forEach((item) => seen.add(item));
  }

  assert.deepEqual(first, ["item-0", "item-1", "item-2", "item-3"]);
  assert.deepEqual(second, ["item-4", "item-5", "item-6", "item-7"]);
  assert.equal(seen.size, items.length);
  assert.deepEqual(rotateLessonReviewItems(items, 2, 20), items);
  assert.deepEqual(rotateLessonReviewItems(items, 2, 0), []);
});

test("a missed check is retried after the remaining checks without restarting them", () => {
  const originalQueue = buildLessonPracticeQueue(checks);
  const afterMiss = advanceLessonPracticeQueue(originalQueue, false);
  const afterLocation = advanceLessonPracticeQueue(afterMiss, true);
  const afterState = advanceLessonPracticeQueue(afterLocation, true);
  const complete = advanceLessonPracticeQueue(afterState, true);

  assert.deepEqual(originalQueue.map((check) => check.id), ["location", "state"]);
  assert.deepEqual(afterMiss.map((check) => check.id), ["state", "location"]);
  assert.equal(afterMiss.at(-1).sessionCorrection, true);
  assert.equal(afterMiss.at(-1).sessionRetryCount, 1);
  assert.deepEqual(afterLocation.map((check) => check.id), ["location"]);
  assert.deepEqual(afterState.map((check) => check.id), []);
  assert.deepEqual(complete, []);
});

test("repeated lesson corrections retain their correction identity", () => {
  const firstRetry = advanceLessonPracticeQueue([{ id: "target", type: "TRANSLATION" }], false);
  const secondRetry = advanceLessonPracticeQueue(firstRetry, false);

  assert.equal(secondRetry[0].sessionCorrection, true);
  assert.equal(secondRetry[0].sessionRetryCount, 2);
});

test("advancing an empty queue is safe", () => {
  assert.deepEqual(advanceLessonPracticeQueue([], false), []);
  assert.deepEqual(advanceLessonPracticeQueue(null, true), []);
});

test("a missed due-review item moves behind the remaining items until retrieved correctly", () => {
  const initial = [{ key: "grammar" }, { key: "word" }];
  const missed = advanceReviewSession(initial, 0, false);
  assert.deepEqual(missed.items.map((item) => item.key), ["grammar", "word", "grammar:retry:1"]);
  assert.equal(missed.nextIndex, 1);
  assert.equal(missed.finished, false);

  const wordDone = advanceReviewSession(missed.items, missed.nextIndex, true);
  assert.equal(wordDone.nextIndex, 2);
  assert.equal(wordDone.finished, false);

  const correctionDone = advanceReviewSession(wordDone.items, wordDone.nextIndex, true);
  assert.equal(correctionDone.finished, true);
  assert.equal(correctionDone.nextIndex, 3);
});

test("a repeatedly missed review item remains active without corrupting its original identity", () => {
  const first = advanceReviewSession([{ key: "grammar" }], 0, false);
  const second = advanceReviewSession(first.items, 1, false);

  assert.equal(second.finished, false);
  assert.equal(second.items.length, 3);
  assert.deepEqual(second.items[2], {
    key: "grammar:retry:2",
    originalKey: "grammar",
    retry: true,
    retryCount: 2
  });
});

test("practice waves interleave cognitive demand while already varied content keeps authored order", () => {
  const exercises = [
    { id: "g1", type: "MULTIPLE_CHOICE" },
    { id: "g2", type: "CLOZE" },
    { id: "c1", type: "SENTENCE_BUILDER" },
    { id: "c2", type: "ERROR_CORRECTION" },
    { id: "p1", type: "TRANSLATION" },
    { id: "p2", type: "DIALOGUE_REPLY" }
  ];
  const interleaved = interleaveLessonPracticeQueue(exercises, "c");

  assert.deepEqual(interleaved.map((exercise) => exercise.id), ["g1", "c1", "p1", "g2", "c2", "p2"]);
  assert.deepEqual(exercises.map((exercise) => exercise.id), ["g1", "g2", "c1", "c2", "p1", "p2"]);
});

test("different lessons receive stable but different valid practice waves", () => {
  const exercises = [
    { id: "g1", type: "MULTIPLE_CHOICE" },
    { id: "g2", type: "MULTIPLE_CHOICE" },
    { id: "c1", type: "SENTENCE_BUILDER" },
    { id: "c2", type: "SENTENCE_BUILDER" },
    { id: "p1", type: "TRANSLATION" },
    { id: "p2", type: "WRITING_PROMPT" }
  ];
  const first = interleaveLessonPracticeQueue(exercises, "a").map((exercise) => exercise.id);
  const repeated = interleaveLessonPracticeQueue(exercises, "a").map((exercise) => exercise.id);
  const second = interleaveLessonPracticeQueue(exercises, "b").map((exercise) => exercise.id);

  assert.deepEqual(first, repeated);
  assert.notDeepEqual(first, second);
  assert.deepEqual([...first].sort(), exercises.map((exercise) => exercise.id).sort());
  assert.deepEqual([...second].sort(), exercises.map((exercise) => exercise.id).sort());
  assert.equal(first[0], "g1");
  assert.equal(second[0], "g1");
});

test("practice waves keep short or single-mode queues complete", () => {
  const short = [{ id: "one", type: "TRANSLATION" }, { id: "two", type: "TRANSLATION" }];
  const oneMode = [
    { id: "p1", type: "TRANSLATION" },
    { id: "p2", type: "SHORT_ANSWER" },
    { id: "p3", type: "WRITING_PROMPT" }
  ];

  assert.deepEqual(interleaveLessonPracticeQueue(short, "lesson"), short);
  assert.deepEqual(interleaveLessonPracticeQueue(oneMode, "lesson"), oneMode);
});

test("a mixed teaching wave ends with independent Spanish recall", () => {
  const exercises = [
    { id: "g1", type: "MULTIPLE_CHOICE", difficulty: 1 },
    { id: "g2", type: "MULTIPLE_CHOICE", difficulty: 1 },
    { id: "g3", type: "CLOZE", difficulty: 2 },
    { id: "g4", type: "MULTIPLE_CHOICE", difficulty: 1, answerJson: { goal: "sentence_recognition", correct: "Hablo español." } },
    { id: "c1", type: "SENTENCE_BUILDER", difficulty: 1 },
    { id: "c2", type: "SENTENCE_BUILDER", difficulty: 1 },
    { id: "c3", type: "ERROR_CORRECTION", difficulty: 2 },
    { id: "p1", type: "TRANSLATION", difficulty: 1 },
    { id: "p2", type: "SHORT_ANSWER", difficulty: 2 },
    { id: "p3", type: "DIALOGUE_REPLY", difficulty: 3, answerJson: { correct: "Hablo español." } }
  ];
  const interleaved = interleaveLessonPracticeQueue(exercises, "ten-item-a1-wave");

  assert.deepEqual([...interleaved.map((exercise) => exercise.id)].sort(), exercises.map((exercise) => exercise.id).sort());
  assert.equal(interleaved.at(-1).id, "p3", "the strongest productive check should close the learning wave");
});

test("practice waves space repeated sentence content across different task modes", () => {
  const exercises = [
    { id: "recognize-a", type: "MULTIPLE_CHOICE", questionText: "I am Ana.", answerJson: { goal: "sentence_recognition", correct: "Soy Ana." } },
    { id: "recognize-b", type: "MULTIPLE_CHOICE", questionText: "I am a student.", answerJson: { goal: "sentence_recognition", correct: "Soy estudiante." } },
    { id: "build-a", type: "SENTENCE_BUILDER", questionText: "I am Ana.", answerJson: { correctWords: ["Soy", "Ana", "."] } },
    { id: "build-b", type: "SENTENCE_BUILDER", questionText: "I am a student.", answerJson: { correctWords: ["Soy", "estudiante", "."] } },
    { id: "produce-a", type: "TRANSLATION", questionText: "I am Ana.", answerJson: { correct: "Soy Ana." } },
    { id: "produce-b", type: "TRANSLATION", questionText: "I am a student.", answerJson: { correct: "Soy estudiante." } }
  ];
  const interleaved = interleaveLessonPracticeQueue(exercises, "content-spacing");
  const keys = interleaved.map(practiceContentKey);

  assert.deepEqual([...interleaved.map((exercise) => exercise.id)].sort(), exercises.map((exercise) => exercise.id).sort());
  for (let index = 1; index < keys.length; index += 1) {
    assert.notEqual(keys[index], keys[index - 1], `content repeated immediately at position ${index}`);
  }
});

test("content keys identify the same Spanish target across recognition, building, and production", () => {
  const recognize = { type: "MULTIPLE_CHOICE", questionText: "I am Ana.", answerJson: { goal: "sentence_recognition", correct: "¡Soy Ana!" } };
  const build = { type: "SENTENCE_BUILDER", questionText: "I am Ana.", answerJson: { correctWords: ["Soy", "Ana", "."] } };
  const produce = { type: "TRANSLATION", questionText: "I am Ana.", answerJson: { correct: "Soy Ana." } };

  assert.equal(practiceContentKey(recognize), "soy ana");
  assert.equal(practiceContentKey(build), "soy ana");
  assert.equal(practiceContentKey(produce), "soy ana");
});

test("published lesson queues never repeat content immediately while another meaning remains", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      select: { id: true, slug: true, exercises: { orderBy: { order: "asc" } } }
    });
    assert.ok(lessons.length >= 240, "expected the complete published curriculum");

    for (const lesson of lessons) {
      const queue = interleaveLessonPracticeQueue(lesson.exercises, lesson.id);
      assert.deepEqual(
        [...queue.map((exercise) => exercise.id)].sort(),
        lesson.exercises.map((exercise) => exercise.id).sort(),
        `${lesson.slug} must retain every mastery check`
      );
      for (let index = 1; index < queue.length; index += 1) {
        const contentKey = practiceContentKey(queue[index]);
        if (!contentKey || contentKey !== practiceContentKey(queue[index - 1])) continue;
        const alternativeRemains = queue.slice(index + 1).some((exercise) => practiceContentKey(exercise) !== contentKey);
        assert.equal(alternativeRemains, false, `${lesson.slug} repeats content although another sentence could be scheduled`);
      }
      const isCheckpoint = /checkpoint/i.test(`${lesson.slug} ${lesson.title || ""}`);
      const independentTypes = new Set(["TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT", "TRANSFORMATION", "LISTENING_DICTATION"]);
      if (!isCheckpoint && lesson.exercises.some((exercise) => independentTypes.has(exercise.type))) {
        assert.ok(independentTypes.has(queue.at(-1)?.type), `${lesson.slug} should finish with independent Spanish recall`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("bounded scheduled reviews rotate through every published sentence and exercise", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        slug: true,
        title: true,
        theme: true,
        sentences: { select: { id: true } },
        exercises: { orderBy: { order: "asc" } }
      }
    });
    assert.ok(lessons.length >= 240, "expected the complete published curriculum");

    for (const lesson of lessons) {
      const sentenceIds = new Set();
      const sentenceCycles = Math.ceil(lesson.sentences.length / 2) + 1;
      for (let cycle = 0; cycle < sentenceCycles; cycle += 1) {
        const sample = rotateLessonReviewItems(lesson.sentences, cycle, 2);
        assert.ok(sample.length <= 2, `${lesson.slug} sentence review must stay compact`);
        sample.forEach((sentence) => sentenceIds.add(sentence.id));
      }
      assert.equal(sentenceIds.size, lesson.sentences.length, `${lesson.slug} must rotate through every model sentence`);

      const interleaved = interleaveLessonPracticeQueue(lesson.exercises, lesson.id);
      const exerciseIds = new Set();
      const exerciseLimit = /checkpoint/i.test(`${lesson.theme} ${lesson.title}`) ? 8 : 6;
      const exerciseCycles = Math.ceil(interleaved.length / exerciseLimit) + 1;
      for (let cycle = 0; cycle < exerciseCycles; cycle += 1) {
        const sample = rotateLessonReviewItems(interleaved, cycle, exerciseLimit);
        assert.ok(sample.length <= exerciseLimit, `${lesson.slug} exercise review must stay compact`);
        sample.forEach((exercise) => exerciseIds.add(exercise.id));
      }
      assert.equal(exerciseIds.size, lesson.exercises.length, `${lesson.slug} must rotate through every exercise`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("review sessions preserve every due item while alternating source and content", () => {
  const items = [
    { key: "g-a", type: "grammar", exercise: { id: "a", type: "TRANSLATION", questionText: "I am Ana.", answerJson: { correct: "Soy Ana." } } },
    { key: "g-b", type: "grammar", exercise: { id: "b", type: "TRANSLATION", questionText: "I am tired.", answerJson: { correct: "Estoy cansado." } } },
    { key: "m-c", type: "mistake", exercise: { id: "c", type: "TRANSLATION", questionText: "I am here.", answerJson: { correct: "Estoy aquí." } } },
    { key: "w-a", type: "word", word: { id: "word-a", spanish: "biblioteca" } },
    { key: "w-b", type: "word", word: { id: "word-b", spanish: "estudiante" } },
    { key: "g-a-variant", type: "grammar", exercise: { id: "a2", type: "SENTENCE_BUILDER", questionText: "I am Ana.", answerJson: { correctWords: ["Soy", "Ana", "."] } } }
  ];
  const queue = interleaveReviewSessionItems(items, "daily-review");

  assert.deepEqual([...queue.map((item) => item.key)].sort(), items.map((item) => item.key).sort());
  assert.equal(queue[0].type, "mistake", "the current weak spot should receive first retrieval priority");
  for (let index = 1; index < queue.length; index += 1) {
    if (queue[index].type === queue[index - 1].type) {
      const anotherTypeRemains = queue.slice(index + 1).some((item) => item.type !== queue[index].type);
      assert.equal(anotherTypeRemains, false, `review source repeated at position ${index} while another source remained`);
    }
    if (reviewItemContentKey(queue[index]) === reviewItemContentKey(queue[index - 1])) {
      const anotherContentRemains = queue.slice(index + 1).some((item) => reviewItemContentKey(item) !== reviewItemContentKey(queue[index]));
      assert.equal(anotherContentRemains, false, `review content repeated at position ${index} while another target remained`);
    }
  }
});

test("review session planning is stable for the same due set", () => {
  const items = [
    { key: "m", type: "mistake" },
    { key: "g1", type: "grammar" },
    { key: "g2", type: "grammar" },
    { key: "w", type: "word", word: { spanish: "casa" } }
  ];
  assert.deepEqual(interleaveReviewSessionItems(items, "same-day"), interleaveReviewSessionItems(items, "same-day"));
});
