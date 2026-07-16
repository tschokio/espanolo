const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = ["a2-more-less-comparisons", "a2-equality-comparisons", "a2-superlatives", "a2-demonstratives-distance", "a2-present-progressive", "a2-habit-versus-now", "checkpoint-a2-describing-comparing"];

test("A2.8 teaches comparison, distance, and ongoing action before B1", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({ where: { slug: { in: SLUGS } }, orderBy: { order: "asc" }, select: { slug: true, order: true, cefrLevel: true, topic: { select: { slug: true } }, sentences: true, exercises: true, readingJson: true } });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), SLUGS);
    assert.ok(lessons[0].order > 830 && lessons.at(-1).order < 840);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 5);
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A2");
      assert.equal(lesson.topic.slug, "describing-comparing-progressive");
      assert.ok(lesson.sentences.length >= 5);
      assert.ok(lesson.exercises.length >= 5);
      const words = lesson.readingJson.paragraphs.join(" ").split(/\s+/).length;
      assert.ok(words >= 45 && words <= 80, `${lesson.slug} input must remain bounded`);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 120);
      assert.ok(lesson.exercises.some((exercise) => ["TRANSLATION", "SHORT_ANSWER", "TRANSFORMATION"].includes(exercise.type)));
    }
  } finally {
    await prisma.$disconnect();
  }
});
