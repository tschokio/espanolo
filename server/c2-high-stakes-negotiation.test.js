const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { evaluateExerciseAnswer } = require("./learning-core");

test("C2.4 open production accepts natural negotiation moves and rejects incomplete moves", async () => {
  const prisma = new PrismaClient();
  try {
    const exercise = await prisma.exercise.findUnique({ where: { slug: "c2-conditional-concessions-respond" } });
    assert.ok(exercise?.answerJson?.functionalCheck);

    const natural = evaluateExerciseAnswer(exercise, { answer: "Podríamos ceder en el plazo, siempre que garanticen la asistencia por escrito." });
    assert.equal(natural.correct, true);
    assert.equal(natural.functionalCheck.matchedCount, 2);

    const incomplete = evaluateExerciseAnswer(exercise, { answer: "Sí, de acuerdo." });
    assert.equal(incomplete.correct, false);
    assert.equal(incomplete.functionalCheck.missingRequired.length, 2);
  } finally {
    await prisma.$disconnect();
  }
});

test("C2.4 persists balanced connected input and active production in every package", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true, topic: { slug: "c2-high-stakes-negotiation" } },
      orderBy: { order: "asc" },
      include: { sentences: true, exercises: true }
    });
    assert.equal(lessons.length, 6);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "reading").length, 3);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 3);
    for (const lesson of lessons) {
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.equal(lesson.readingJson.questions.every((question) => question.questionDe && question.optionsDe.length === 3), true);
      assert.equal(lesson.sentences.length, 5);
      const types = new Set(lesson.exercises.map((exercise) => exercise.type));
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "DIALOGUE_REPLY", "WRITING_PROMPT"]) {
        assert.ok(types.has(type), `${lesson.slug} needs ${type}`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
});
