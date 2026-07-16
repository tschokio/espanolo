const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = [
  "a2-tu-or-usted",
  "a2-polite-usted-questions",
  "a2-respectful-service-requests",
  "a2-ustedes-useful-plural",
  "a2-adjust-form-of-address",
  "checkpoint-a2-formal-address"
];

test("A2.6 teaches familiar, respectful, and plural address before later object-pronoun work", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: SLUGS } },
      orderBy: { order: "asc" },
      select: {
        slug: true,
        order: true,
        cefrLevel: true,
        isPublished: true,
        topic: { select: { slug: true } },
        sentences: true,
        exercises: true,
        readingJson: true
      }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [729.1, 729.2, 729.3, 729.4, 729.5, 729.6]);
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A2");
      assert.equal(lesson.isPublished, true);
      assert.equal(lesson.topic.slug, "formal-address-service");
      assert.ok(lesson.sentences.length >= 5, `${lesson.slug} needs enough reusable models`);
      assert.ok(lesson.exercises.length >= 10 && lesson.exercises.length <= 12, `${lesson.slug} needs a complete but bounded retrieval wave`);
      assert.ok(lesson.exercises.some((exercise) => exercise.type === "MULTIPLE_CHOICE"));
      assert.ok(lesson.exercises.some((exercise) => exercise.type === "SENTENCE_BUILDER"));
      assert.ok(lesson.exercises.some((exercise) => exercise.type === "DIALOGUE_REPLY"));
      assert.ok(lesson.exercises.some((exercise) => exercise.type === "WRITING_PROMPT"));
      assert.ok(["reading", "listening"].includes(lesson.readingJson.inputMode || "reading"));
      assert.ok(lesson.readingJson.orientationDe.length >= 100);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 120);
      assert.ok(lesson.readingJson.modelSummary.split(/\s+/).length >= 12);
    }

    const bySlug = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson]));
    const singularModels = bySlug["a2-tu-or-usted"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(singularModels, /Tú trabajas/);
    assert.match(singularModels, /Usted trabaja/);
    assert.match(singularModels, /Tú tienes/);
    assert.match(singularModels, /Usted tiene/);

    const pluralContent = `${bySlug["a2-ustedes-useful-plural"].sentences.map((sentence) => sentence.spanish).join(" ")} ${bySlug["a2-ustedes-useful-plural"].readingJson.paragraphs.join(" ")}`;
    assert.match(pluralContent, /ustedes/i);
    assert.match(pluralContent, /vosotros/i);
    assert.match(bySlug["a2-ustedes-useful-plural"].readingJson.orientationDe, /produktive Grundform/);

    const checkpoint = bySlug["checkpoint-a2-formal-address"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(checkpoint, /ayudarle|Puede/);
    assert.match(checkpoint, /Ustedes|prefieren|pueden/);
  } finally {
    await prisma.$disconnect();
  }
});
