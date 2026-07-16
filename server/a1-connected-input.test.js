const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const A1_TRANSFER_SLUGS = [
  "checkpoint-a1-absolute-start",
  "checkpoint-a1-core-grammar",
  "checkpoint-a1-survival-spanish",
  "checkpoint-a1-daily-life",
  "checkpoint-a1-building-blocks",
  "checkpoint-a1-verb-frames",
  "checkpoint-a1-numbers-in-life",
  "checkpoint-a1-personal-profile",
  "checkpoint-a1-health-and-states",
  "checkpoint-a1-foundations",
  "checkpoint-a1-essential-present",
  "checkpoint-a1-contractions-choice",
  "checkpoint-a1-getting-around"
];

test("A1 checkpoints add tiny connected transfer only after focused sentence learning", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: A1_TRANSFER_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, theme: true, estimatedMinutes: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), A1_TRANSFER_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 10);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      const wordCount = content.paragraphs.join(" ").split(/\s+/).length;
      assert.equal(lesson.cefrLevel, "A1");
      assert.equal(lesson.theme, "Checkpoint");
      assert.equal(lesson.estimatedMinutes, 18);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(wordCount >= 22, `${lesson.slug} input is too thin to transfer meaning`);
      assert.ok(wordCount <= 55, `${lesson.slug} input overloads an A1 checkpoint`);
      assert.ok(content.orientationDe.length >= 100, `${lesson.slug} needs useful German guidance`);
      assert.ok(content.orientationEn.length >= 85, `${lesson.slug} needs optional English guidance`);
      assert.equal(content.questions.length, 2);
      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 12 && question.questionEn.length >= 12);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(question.explanationDe.length >= 75, `${lesson.slug} needs a German explanation`);
        assert.ok(question.explanationEn.length >= 65, `${lesson.slug} needs optional English support`);
      }
      assert.ok(content.recallPromptDe.length >= 120, `${lesson.slug} needs explicit German-guided recall`);
      assert.ok(content.recallPromptEn.length >= 100, `${lesson.slug} needs optional English-guided recall`);
      assert.ok(content.modelSummary.split(/\s+/).length >= 9);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("A1 connected input stays confined to consolidation checkpoints", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { cefrLevel: "A1", NOT: { slug: "checkpoint-a1-sound-foundation" } },
      select: { slug: true, readingJson: true }
    });
    const connected = lessons.filter((lesson) => lesson.readingJson?.paragraphs?.length);
    assert.deepEqual(connected.map((lesson) => lesson.slug).sort(), [...A1_TRANSFER_SLUGS].sort());
    assert.ok(connected.every((lesson) => lesson.slug.startsWith("checkpoint-a1-")));
  } finally {
    await prisma.$disconnect();
  }
});
