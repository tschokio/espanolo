const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const TRAVEL_SLUGS = [
  "a1-locate-landmarks-on-route",
  "a1-follow-short-directions",
  "a1-buy-a-transport-ticket",
  "a1-check-departure-and-platform",
  "a1-check-in-at-a-hotel",
  "a1-repair-a-travel-problem",
  "checkpoint-a1-getting-around"
];

test("A1.11 closes the travel gap from locating a place through arrival and repair", async () => {
  const prisma = new PrismaClient();
  try {
    const [lessons, firstA2] = await Promise.all([
      prisma.lesson.findMany({
        where: { slug: { in: TRAVEL_SLUGS } },
        orderBy: { order: "asc" },
        select: { slug: true, order: true, cefrLevel: true, topic: { select: { slug: true } }, sentences: { orderBy: { id: "asc" } }, exercises: true, readingJson: true }
      }),
      prisma.lesson.findFirst({ where: { cefrLevel: "A2" }, orderBy: { order: "asc" }, select: { order: true } })
    ]);

    assert.deepEqual(lessons.map((lesson) => lesson.slug), TRAVEL_SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [518.1, 518.2, 518.3, 518.4, 518.5, 518.6, 518.7]);
    assert.ok(lessons.at(-1).order < firstA2.order, "complete A1 travel transfer must precede the A2 path");
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A1");
      assert.equal(lesson.topic.slug, "getting-around-services");
      assert.ok(lesson.sentences.length >= 5, `${lesson.slug} needs enough controlled travel examples`);
      assert.ok(lesson.exercises.length >= 5, `${lesson.slug} needs varied active retrieval`);
      assert.ok(lesson.exercises.some((exercise) => exercise.type === "DIALOGUE_REPLY"), `${lesson.slug} needs a guided service turn`);
      assert.ok(lesson.exercises.some((exercise) => ["TRANSLATION", "SHORT_ANSWER", "WRITING_PROMPT"].includes(exercise.type)), `${lesson.slug} needs unsupported Spanish production`);
    }

    const spanish = lessons.flatMap((lesson) => lesson.sentences.map((sentence) => sentence.spanish)).join(" ");
    for (const pattern of [/al lado|enfrente|entre/i, /todo recto|derecha|izquierda/i, /billete|ida y vuelta/i, /andén|sale a las/i, /reserva|pasaporte|habitación/i, /llave no funciona|repetir/i]) assert.match(spanish, pattern);

    assert.equal(lessons.slice(0, -1).every((lesson) => !lesson.readingJson?.paragraphs), true);
    const checkpoint = lessons.at(-1).readingJson;
    assert.equal(checkpoint.inputMode, "listening");
    assert.equal(checkpoint.paragraphs.length, 2);
    assert.equal(checkpoint.questions.length, 2);
    assert.ok(checkpoint.paragraphs.join(" ").split(/\s+/).length <= 65);
    assert.ok(checkpoint.orientationDe.length >= 140);
    assert.ok(checkpoint.orientationEn.length >= 120);
    assert.ok(checkpoint.recallPromptDe.length >= 170);
    assert.ok(checkpoint.recallPromptEn.length >= 150);
  } finally {
    await prisma.$disconnect();
  }
});
