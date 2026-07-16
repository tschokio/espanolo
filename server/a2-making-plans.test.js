const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = [
  "a2-invite-and-suggest",
  "a2-accept-or-decline",
  "a2-negotiate-time-place",
  "a2-change-or-cancel-plan",
  "a2-clarify-and-confirm",
  "a2-complete-plan-dialogue",
  "checkpoint-a2-making-plans"
];

test("A2.5 builds everyday coordination from invitation to independent confirmation", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: SLUGS } },
      orderBy: { order: "asc" },
      select: {
        slug: true,
        order: true,
        cefrLevel: true,
        topic: { select: { slug: true } },
        sentences: true,
        exercises: true,
        readingJson: true
      }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), SLUGS);
    assert.ok(lessons[0].order > 720 && lessons.at(-1).order < 730);
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A2");
      assert.equal(lesson.topic.slug, "making-plans-interaction");
      assert.ok(lesson.sentences.length >= 5, `${lesson.slug} needs enough reusable dialogue models`);
      assert.ok(lesson.exercises.length >= 5, `${lesson.slug} needs a complete active practice wave`);
      assert.ok(lesson.exercises.some((exercise) => exercise.type === "DIALOGUE_REPLY"));
      assert.ok(lesson.exercises.some((exercise) => ["TRANSLATION", "SHORT_ANSWER", "WRITING_PROMPT"].includes(exercise.type)));
      assert.ok(["reading", "listening"].includes(lesson.readingJson.inputMode || "reading"));
      assert.ok(lesson.readingJson.orientationDe.length >= 100);
      assert.ok(lesson.readingJson.orientationEn.length >= 100);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 140);
      assert.ok(lesson.readingJson.modelSummary.split(/\s+/).length >= 12);
    }

    const courseSpanish = lessons.flatMap((lesson) => lesson.sentences.map((sentence) => sentence.spanish)).join(" ");
    for (const expectedMove of ["¿Quieres", "no puedo", "¿Te va bien", "¿Podemos quedar", "¿Has dicho", "Entonces"]) {
      assert.match(courseSpanish, new RegExp(expectedMove.replace(/[?¿]/g, "\\$&"), "i"), `missing coordination move ${expectedMove}`);
    }
  } finally {
    await prisma.$disconnect();
  }
});
