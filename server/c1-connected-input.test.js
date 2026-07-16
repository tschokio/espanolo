const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const C1_REGISTER_SLUGS = [
  "c1-register-context",
  "c1-precise-paraphrase",
  "c1-stance-nuance",
  "c1-cohesion-reference",
  "c1-idiomatic-collocations",
  "checkpoint-c1-register-precision"
];

test("C1.1 develops register and precision through demanding connected input and reconstruction", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: C1_REGISTER_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), C1_REGISTER_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 3);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      assert.equal(lesson.cefrLevel, "C1");
      assert.ok(lesson.estimatedMinutes >= 20);
      assert.ok(content.title.length >= 30);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(content.paragraphs.join(" ").split(/\s+/).length >= 75);
      assert.ok(content.orientationDe.length >= 140 && content.orientationEn.length >= 115);
      assert.equal(content.questions.length, 2);
      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 35 && question.questionEn.length >= 30);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(question.explanationDe.length >= 110 && question.explanationEn.length >= 95);
      }
      assert.ok(content.recallPromptDe.length >= 125 && content.recallPromptEn.length >= 110);
      assert.ok(content.modelSummary.split(/\s+/).length >= 22);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("C1.2 through C1.5 comprehension is genuinely German-first with optional English", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { cefrLevel: "C1", order: { gte: 1860, lte: 2090 } },
      orderBy: { order: "asc" },
      select: { slug: true, readingJson: true }
    });
    assert.equal(lessons.length, 24);
    for (const lesson of lessons) {
      const questions = lesson.readingJson.questions;
      assert.equal(questions.length, 2);
      for (const question of questions) {
        assert.doesNotMatch(question.questionDe, /^¿|\b(?:Qué|Cómo|Cuál|Quién|Por qué)\b/);
        assert.doesNotMatch(question.questionEn, /^¿|\b(?:Qué|Cómo|Cuál|Quién|Por qué)\b/);
        for (const option of question.optionsDe) {
          assert.doesNotMatch(option, /^(?:La|El|Los|Las|Una|Un|Que|Porque|En que|Hace que|Convierte|Limita|Niega|Solo)\b/);
        }
        assert.ok(question.explanationDe.length >= 70);
        assert.ok(question.explanationEn.length >= 70);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
});
