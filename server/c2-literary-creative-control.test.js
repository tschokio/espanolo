const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { evaluateExerciseAnswer } = require("./learning-core");

test("C2.5 persists evidence-bounded literary learning packages in German and Spanish", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true, topic: { slug: "c2-literary-creative-control" } },
      orderBy: { order: "asc" },
      include: { sentences: true, exercises: true, vocabularyGroups: { include: { words: true } } }
    });
    assert.equal(lessons.length, 6);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "reading").length, 3);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 3);
    for (const lesson of lessons) {
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.equal(lesson.readingJson.questions.every((question) => question.questionDe && question.optionsDe.length === 3), true);
      assert.match(lesson.readingJson.recallPromptDe, /Textsignal/);
      assert.equal(lesson.sentences.length, 5);
      assert.equal(lesson.vocabularyGroups.find((group) => group.slug === "c2-literary-context-vocabulary")?.words.length, 12);
      const types = new Set(lesson.exercises.map((exercise) => exercise.type));
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "WRITING_PROMPT"]) {
        assert.ok(types.has(type), `${lesson.slug} needs ${type}`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("C2.5 accepts a natural constrained rewrite but rejects style change that drops factual fidelity", async () => {
  const prisma = new PrismaClient();
  try {
    const exercise = await prisma.exercise.findUnique({ where: { slug: "checkpoint-c2-literary-creative-control-compose" } });
    const natural = evaluateExerciseAnswer(exercise, { answer: "Hay que conservar los hechos, aunque podemos cambiar la voz y el ritmo." });
    assert.equal(natural.correct, true);
    assert.equal(natural.status, "ACCEPTED_FUNCTIONAL_VARIANT");

    const incomplete = evaluateExerciseAnswer(exercise, { answer: "Podemos cambiar la voz y el ritmo." });
    assert.equal(incomplete.correct, false);
    assert.equal(incomplete.functionalCheck.missingRequired.some((group) => group.key === "preserve"), true);
  } finally {
    await prisma.$disconnect();
  }
});

test("non-checkpoint C2.5 writing stays honest about model retrieval without semantic AI", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { lesson: { topic: { slug: "c2-literary-creative-control" }, slug: { not: { contains: "checkpoint" } } }, type: "WRITING_PROMPT", slug: { not: { startsWith: "supplement-" } } },
      select: { slug: true, answerJson: true }
    });
    assert.equal(exercises.length, 5);
    for (const exercise of exercises) {
      assert.equal(exercise.answerJson.functionalCheck, undefined);
      assert.match(exercise.answerJson.rubric, /not scored as if semantic AI evaluation were available/);
    }
  } finally {
    await prisma.$disconnect();
  }
});
