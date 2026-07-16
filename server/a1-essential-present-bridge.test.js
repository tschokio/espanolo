const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const BRIDGE_SLUGS = [
  "a1-present-er-verbs",
  "a1-present-ir-verbs",
  "a1-present-er-ir-together",
  "a1-hay-one-and-many",
  "a1-possessives-family",
  "a1-days-and-clock-time",
  "a1-months-and-calendar-dates",
  "a1-ask-and-tell-the-hour",
  "a1-quarter-half-and-minutes",
  "a1-simple-schedule-dialogue",
  "checkpoint-a1-essential-present"
];

test("A1.10 explicitly teaches essential forms that A2 previously had to assume", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: BRIDGE_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, order: true, cefrLevel: true, estimatedMinutes: true, topic: { select: { slug: true } }, sentences: { orderBy: { id: "asc" } }, exercises: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), BRIDGE_SLUGS);
    assert.ok(lessons[0].order > 495 && lessons.at(-1).order < 520);

    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A1");
      assert.equal(lesson.topic.slug, "essential-present-bridge");
      assert.ok(lesson.estimatedMinutes >= 13);
      assert.ok(lesson.sentences.length >= 5);
      assert.ok(lesson.exercises.length >= 5);
      assert.ok(lesson.exercises.some((exercise) => ["TRANSLATION", "SHORT_ANSWER", "TRANSFORMATION"].includes(exercise.type)), `${lesson.slug} needs unsupported active recall`);
    }

    assert.equal(lessons.slice(0, -1).every((lesson) => !lesson.readingJson?.paragraphs), true, "focused A1 bridge lessons should stay sentence-first");
    const checkpoint = lessons.at(-1).readingJson;
    assert.equal(checkpoint.inputMode, "listening");
    assert.equal(checkpoint.paragraphs.length, 2);
    assert.ok(checkpoint.paragraphs.join(" ").split(/\s+/).length <= 65);
    assert.equal(checkpoint.questions.length, 2);
    assert.ok(checkpoint.recallPromptDe.length >= 120);
    const temporalSpanish = lessons.slice(5).flatMap((lesson) => lesson.sentences.map((sentence) => sentence.spanish)).join(" ");
    for (const pattern of [/enero/i, /septiembre/i, /¿Qué hora es\?/i, /Es la una/i, /Son las dos/i, /y cuarto/i, /y media/i, /menos cuarto/i, /¿A qué hora\?/i]) assert.match(temporalSpanish, pattern);
  } finally {
    await prisma.$disconnect();
  }
});

test("the visible curriculum places A1.10 between the earlier A1 checkpoint and A2", () => {
  const source = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");
  const bridge = source.indexOf('slug: "a1-8-essential-present"');
  assert.ok(bridge > source.indexOf('slug: "a1-7-descriptions-and-weather"'));
  assert.ok(bridge < source.indexOf('slug: "a2-1-daily-routine"'));
  assert.match(source.slice(bridge, bridge + 420), /startOrder: 498[\s\S]*endOrder: 518/);
});
