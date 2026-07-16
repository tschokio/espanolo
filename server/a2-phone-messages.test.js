const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = [
  "a2-open-phone-call",
  "a2-ask-for-person-phone",
  "a2-leave-phone-message",
  "a2-understand-voicemail",
  "a2-spell-check-contact-details",
  "a2-repair-phone-connection",
  "checkpoint-a2-phone-messages"
];

test("A2.11 develops a complete phone task with regional recognition and quiet-mode equivalence", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: SLUGS } }, orderBy: { order: "asc" },
      select: { slug: true, order: true, cefrLevel: true, isPublished: true, topic: { select: { slug: true } }, sentences: true, exercises: true, readingJson: true, vocabularyGroups: { select: { slug: true } } }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [831.78, 831.79, 831.8, 831.81, 831.82, 831.83, 831.84]);
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A2");
      assert.equal(lesson.isPublished, true);
      assert.equal(lesson.topic.slug, "phone-calls-messages");
      assert.ok(lesson.vocabularyGroups.some((group) => group.slug === "a2-phone-messages"));
      assert.ok(lesson.sentences.length >= 5);
      assert.ok(lesson.exercises.length >= 10 && lesson.exercises.length <= 12, `${lesson.slug} needs bounded mixed retrieval`);
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "DIALOGUE_REPLY", "WRITING_PROMPT"]) assert.ok(lesson.exercises.some((exercise) => exercise.type === type), `${lesson.slug} needs ${type}`);
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.orientationDe.length >= 140);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 140);
      assert.ok(lesson.readingJson.modelSummary.split(/\s+/).length >= 19);
    }

    const bySlug = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson]));
    const openings = `${bySlug["a2-open-phone-call"].sentences.map((sentence) => sentence.spanish).join(" ")} ${bySlug["a2-open-phone-call"].readingJson.orientationDe}`;
    assert.match(openings, /¿Diga\?/);
    assert.match(openings, /¿Aló\?/);
    assert.match(openings, /¿Bueno\?/);
    assert.match(openings, /produktiven Grundform|produktive Grundform/);

    const message = bySlug["a2-leave-phone-message"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(message, /dejarle un mensaje/i);
    assert.match(message, /me llame esta tarde/i);
    assert.match(message, /seis ocho dos/i);

    const voicemail = bySlug["a2-understand-voicemail"].readingJson;
    assert.equal(voicemail.inputMode, "listening");
    assert.match(voicemail.paragraphs.join(" "), /viernes a las once/i);
    assert.match(voicemail.paragraphs.join(" "), /antes de las seis/i);

    const repair = bySlug["a2-repair-phone-connection"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(repair, /se oye muy bajo/i);
    assert.match(repair, /solo la nueva hora/i);
    assert.match(repair, /Si se corta otra vez/i);
  } finally {
    await prisma.$disconnect();
  }
});
