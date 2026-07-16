const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const PROFILE_SLUGS = [
  "a1-age-and-personal-question",
  "a1-birthday-and-date",
  "a1-family-introductions",
  "a1-home-work-study",
  "a1-languages-you-speak",
  "a1-contact-details-repair",
  "checkpoint-a1-personal-profile"
];

test("A1.7 teaches a complete German-guided personal introduction after everyday numbers", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: PROFILE_SLUGS } },
      orderBy: { order: "asc" },
      select: {
        slug: true,
        order: true,
        cefrLevel: true,
        topic: { select: { slug: true } },
        sentences: { orderBy: { id: "asc" } },
        exercises: true,
        readingJson: true
      }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), PROFILE_SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [421, 422, 423, 424, 425, 426, 427]);
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A1");
      assert.equal(lesson.topic.slug, "personal-profile-basics");
      assert.ok(lesson.sentences.length >= 5, `${lesson.slug} needs enough controlled examples`);
      assert.ok(lesson.exercises.length >= 5, `${lesson.slug} needs repeated active retrieval`);
      assert.ok(lesson.exercises.some((exercise) => exercise.type === "DIALOGUE_REPLY"), `${lesson.slug} needs a guided conversation turn`);
      assert.ok(lesson.exercises.some((exercise) => ["TRANSLATION", "SHORT_ANSWER", "WRITING_PROMPT"].includes(exercise.type)), `${lesson.slug} needs unsupported Spanish production`);
    }

    assert.equal(lessons.slice(0, -1).every((lesson) => !lesson.readingJson?.paragraphs), true);
    const checkpoint = lessons.at(-1).readingJson;
    assert.equal(checkpoint.inputMode, "listening");
    assert.equal(checkpoint.paragraphs.length, 2);
    assert.equal(checkpoint.questions.length, 2);
    assert.ok(checkpoint.orientationDe.length >= 100);
    assert.ok(checkpoint.orientationEn.length >= 85);
    assert.ok(checkpoint.recallPromptDe.length >= 120);
    assert.ok(checkpoint.recallPromptEn.length >= 100);

    const spanish = lessons.flatMap((lesson) => lesson.sentences.map((sentence) => sentence.spanish)).join(" ");
    for (const pattern of [/años/i, /cumpleaños/i, /madre|padre|hermana/i, /vivo|trabajo|estudio/i, /idiomas|alemán/i, /teléfono|correo|repetir/i]) {
      assert.match(spanish, pattern);
    }
  } finally {
    await prisma.$disconnect();
  }
});
