const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = [
  "a2-identify-product-problem",
  "a2-request-exchange-or-refund",
  "a2-report-home-problem",
  "a2-arrange-repair-visit",
  "a2-understand-next-service-step",
  "a2-complete-problem-solution-dialogue",
  "checkpoint-a2-everyday-problems"
];

test("A2.9 carries an everyday problem from precise report to confirmed resolution", async () => {
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
        readingJson: true,
        vocabularyGroups: { select: { slug: true } }
      }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [831.1, 831.2, 831.3, 831.4, 831.5, 831.6, 831.7]);
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A2");
      assert.equal(lesson.isPublished, true);
      assert.equal(lesson.topic.slug, "solving-everyday-problems");
      assert.ok(lesson.vocabularyGroups.some((group) => group.slug === "a2-everyday-problems-service"));
      assert.ok(lesson.sentences.length >= 5, `${lesson.slug} needs reusable model turns`);
      assert.ok(lesson.exercises.length >= 10 && lesson.exercises.length <= 12, `${lesson.slug} needs a full but bounded retrieval wave`);
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "DIALOGUE_REPLY", "WRITING_PROMPT"]) {
        assert.ok(lesson.exercises.some((exercise) => exercise.type === type), `${lesson.slug} needs ${type}`);
      }
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.orientationDe.length >= 130);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 135);
      assert.ok(lesson.readingJson.modelSummary.split(/\s+/).length >= 18);
    }

    const bySlug = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson]));
    const report = bySlug["a2-identify-product-problem"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(report, /no funciona/i);
    assert.match(report, /empezó/i);
    assert.match(report, /recibo/i);

    const negotiation = bySlug["a2-request-exchange-or-refund"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(negotiation, /cambiarlo|devolverme/i);
    assert.match(negotiation, /solución/i);

    const visit = bySlug["a2-arrange-repair-visit"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(visit, /entre las cuatro y las seis/i);
    assert.match(visit, /dirección/i);

    const checkpoint = bySlug["checkpoint-a2-everyday-problems"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(checkpoint, /no cierra/i);
    assert.match(checkpoint, /mañana entre/i);
    assert.match(checkpoint, /si cambia algo/i);
  } finally {
    await prisma.$disconnect();
  }
});
