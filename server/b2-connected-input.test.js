const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const B2_DISCOURSE_REPORTED_SLUGS = [
  "b2-concession-aunque",
  "b2-concession-alternatives",
  "b2-cause-consequence",
  "b2-hedging-register",
  "b2-structured-argument",
  "checkpoint-b2-discourse",
  "b2-report-present-statements",
  "b2-report-past-sequence",
  "b2-report-questions",
  "b2-report-requests-commands",
  "b2-report-reference-shifts",
  "checkpoint-b2-reported-speech"
];

const B2_GRAMMAR_CONTEXT_SLUGS = [
  "b2-relative-que-quien",
  "b2-relative-prepositions",
  "b2-relative-el-que-lo-que",
  "b2-relative-cuyo",
  "b2-relative-place-time-manner",
  "checkpoint-b2-relative-clauses",
  "b2-se-reflexive-reciprocal",
  "b2-se-impersonal",
  "b2-se-passive",
  "b2-se-accidental",
  "b2-se-passive-contrast",
  "checkpoint-b2-se-constructions",
  "b2-imperfect-subjunctive-forms",
  "b2-past-wishes-influence",
  "b2-past-reactions-doubt",
  "b2-past-perfect-subjunctive",
  "b2-counterfactual-past",
  "checkpoint-b2-past-subjunctive",
  "b2-acabar-de-recent",
  "b2-seguir-continuity",
  "b2-llevar-duration",
  "b2-soler-habits",
  "b2-change-repetition-periphrases",
  "checkpoint-b2-verbal-periphrases"
];

test("B2.1 and B2.2 develop discourse and reported viewpoint through connected German-guided input", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: B2_DISCOURSE_REPORTED_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), B2_DISCOURSE_REPORTED_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 6);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      assert.equal(lesson.cefrLevel, "B2");
      assert.ok(lesson.estimatedMinutes >= 18);
      assert.ok(content.title.length >= 25, `${lesson.slug} needs a concrete Spanish title`);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(content.paragraphs.join(" ").split(/\s+/).length >= 65, `${lesson.slug} input is too thin`);
      assert.ok(content.orientationDe.length >= 115 && content.orientationEn.length >= 95);
      assert.equal(content.questions.length, 2);

      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 25 && question.questionEn.length >= 22);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 3);
        assert.ok(question.explanationDe.length >= 90 && question.explanationEn.length >= 80);
      }

      assert.ok(content.recallPromptDe.length >= 100 && content.recallPromptEn.length >= 90);
      assert.ok(content.modelSummary.split(/\s+/).length >= 18);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("B2.3 through B2.6 teach grammar through connected situations, meaning checks, and Spanish reconstruction", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: B2_GRAMMAR_CONTEXT_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), B2_GRAMMAR_CONTEXT_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 12);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      assert.equal(lesson.cefrLevel, "B2");
      assert.ok(lesson.estimatedMinutes >= 18);
      assert.ok(content.title.length >= 25, `${lesson.slug} needs a concrete Spanish title`);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(content.paragraphs.join(" ").split(/\s+/).length >= 65, `${lesson.slug} input is too thin`);
      assert.ok(content.orientationDe.length >= 115 && content.orientationEn.length >= 95);
      assert.equal(content.questions.length, 2);

      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 25 && question.questionEn.length >= 22);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 3);
        assert.ok(question.explanationDe.length >= 90 && question.explanationEn.length >= 80);
      }

      assert.ok(content.recallPromptDe.length >= 100 && content.recallPromptEn.length >= 90);
      assert.ok(content.modelSummary.split(/\s+/).length >= 18);
    }
  } finally {
    await prisma.$disconnect();
  }
});
