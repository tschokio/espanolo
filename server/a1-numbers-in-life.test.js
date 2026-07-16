const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const NUMBER_SLUGS = [
  "numbers-one-to-five",
  "numbers-six-to-ten",
  "a1-numbers-eleven-to-twenty",
  "a1-tens-and-composed-numbers",
  "checkpoint-a1-numbers-in-life"
];

test("A1.6 teaches number construction before age, dates, prices, and contact details require it", async () => {
  const prisma = new PrismaClient();
  try {
    const [lessons, firstProfile] = await Promise.all([
      prisma.lesson.findMany({
        where: { slug: { in: NUMBER_SLUGS } },
        orderBy: { order: "asc" },
        select: { slug: true, order: true, cefrLevel: true, topic: { select: { slug: true } }, sentences: { orderBy: { id: "asc" } }, exercises: true, readingJson: true }
      }),
      prisma.lesson.findUnique({ where: { slug: "a1-age-and-personal-question" }, select: { order: true } })
    ]);

    assert.deepEqual(lessons.map((lesson) => lesson.slug), NUMBER_SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [416, 417, 418, 419, 420]);
    assert.ok(lessons.at(-1).order < firstProfile.order, "number transfer must precede the first lesson that asks for an age");
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A1");
      assert.equal(lesson.topic.slug, "numbers-in-life");
      assert.ok(lesson.sentences.length >= 5, `${lesson.slug} needs controlled number examples`);
      assert.ok(lesson.exercises.length >= 5, `${lesson.slug} needs repeated retrieval in varied modes`);
      assert.ok(lesson.exercises.some((exercise) => ["TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"].includes(exercise.type)), `${lesson.slug} needs productive number retrieval`);
    }

    const spanish = lessons.flatMap((lesson) => lesson.sentences.map((sentence) => sentence.spanish)).join(" ");
    for (const pattern of [/uno/i, /diez/i, /once/i, /quince/i, /dieciséis/i, /veinte/i, /veinticuatro/i, /treinta y cinco/i, /cuarenta y dos/i, /cien/i]) assert.match(spanish, pattern);
    for (const pattern of [/años/i, /cumpleaños/i, /cuesta/i, /número/i, /a las/i, /estudiantes/i]) assert.match(spanish, pattern);

    assert.equal(lessons.slice(0, -1).every((lesson) => !lesson.readingJson?.paragraphs), true);
    const checkpoint = lessons.at(-1).readingJson;
    assert.equal(checkpoint.inputMode, "listening");
    assert.equal(checkpoint.paragraphs.length, 2);
    assert.equal(checkpoint.questions.length, 2);
    assert.ok(checkpoint.orientationDe.length >= 120);
    assert.ok(checkpoint.orientationEn.length >= 100);
    assert.ok(checkpoint.recallPromptDe.length >= 150);
    assert.ok(checkpoint.recallPromptEn.length >= 130);
  } finally {
    await prisma.$disconnect();
  }
});
