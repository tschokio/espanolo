const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { evaluateExerciseAnswer } = require("./learning-core");

test("C2.6 persists six speaker-labelled listening packages with active relay", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true, topic: { slug: "c2-expert-listening-synthesis" } },
      orderBy: { order: "asc" },
      include: { sentences: true, exercises: true, vocabularyGroups: { include: { words: true } } }
    });
    assert.equal(lessons.length, 6);
    for (const lesson of lessons) {
      assert.equal(lesson.readingJson.inputMode, "listening");
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.paragraphs.every((paragraph) => /\p{Lu}[\p{L}'’.-]+:/u.test(paragraph)), true);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.equal(lesson.readingJson.questions.every((question) => question.questionDe && question.optionsDe.length === 3), true);
      assert.equal(lesson.sentences.length, 5);
      assert.equal(lesson.vocabularyGroups.find((group) => group.slug === "c2-expert-listening-context-vocabulary")?.words.length, 12);
      const types = new Set(lesson.exercises.map((exercise) => exercise.type));
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "LISTENING_DICTATION", "TRANSFORMATION", "WRITING_PROMPT"]) {
        assert.ok(types.has(type), `${lesson.slug} needs ${type}`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("C2.6 checkpoint accepts a natural actionable relay and rejects missing ownership", async () => {
  const prisma = new PrismaClient();
  try {
    const exercise = await prisma.exercise.findUnique({ where: { slug: "checkpoint-c2-expert-listening-synthesis-relay" } });
    const natural = evaluateExerciseAnswer(exercise, { answer: "La segunda sede depende de la licencia; Celia la comprobará antes de que Bruno actualice el comunicado." });
    assert.equal(natural.correct, true);
    assert.equal(natural.status, "ACCEPTED_FUNCTIONAL_VARIANT");

    const incomplete = evaluateExerciseAnswer(exercise, { answer: "La segunda sede depende de la licencia." });
    assert.equal(incomplete.correct, false);
    assert.equal(incomplete.functionalCheck.missingRequired.some((group) => group.key === "ownership-sequence"), true);
  } finally {
    await prisma.$disconnect();
  }
});
