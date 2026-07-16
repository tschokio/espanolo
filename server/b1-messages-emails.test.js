const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = [
  "b1-open-message-register",
  "b1-request-information-action",
  "b1-explain-context-sequence",
  "b1-reply-point-by-point",
  "b1-follow-up-reminder",
  "b1-written-problem-resolution",
  "checkpoint-b1-messages-emails"
];

test("B1.11 builds complete written action before independent email transfer", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: SLUGS } }, orderBy: { order: "asc" },
      select: {
        slug: true, order: true, cefrLevel: true, isPublished: true,
        topic: { select: { slug: true } }, sentences: true, exercises: true, readingJson: true,
        vocabularyGroups: { select: { slug: true } }
      }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [1313.1, 1313.2, 1313.3, 1313.4, 1313.5, 1313.6, 1313.7]);
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "B1");
      assert.equal(lesson.isPublished, true);
      assert.equal(lesson.topic.slug, "messages-emails-written-action");
      assert.ok(lesson.vocabularyGroups.some((group) => group.slug === "b1-messages-emails"));
      assert.ok(lesson.sentences.length >= 5);
      assert.ok(lesson.exercises.length >= 10 && lesson.exercises.length <= 12, `${lesson.slug} needs bounded mixed retrieval`);
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"]) {
        assert.ok(lesson.exercises.some((exercise) => exercise.type === type), `${lesson.slug} needs ${type}`);
      }
      assert.equal(lesson.readingJson.inputMode, undefined, `${lesson.slug} should preserve writing as visible reading input`);
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.orientationDe.length >= 150);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 160);
      assert.ok(lesson.readingJson.modelSummary.split(/\s+/).length >= 20);
      assert.doesNotMatch(`${lesson.readingJson.paragraphs.join(" ")} ${lesson.readingJson.modelSummary}`, /\b(?:the|with|email|German|English|schreibt|bestätigt|Frist|Nachricht)\b/i);
    }

    const bySlug = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson]));
    const register = bySlug["b1-open-message-register"].sentences.map((item) => item.spanish).join(" ");
    assert.match(register, /Hola, Marta/);
    assert.match(register, /Buenos días, señora Ruiz/);
    assert.match(register, /Estimado equipo de atención al cliente/);

    const reply = bySlug["b1-reply-point-by-point"].sentences.map((item) => item.spanish).join(" ");
    assert.match(reply, /En cuanto al horario/);
    assert.match(reply, /Respecto al nivel/);
    assert.match(reply, /Todavía estoy esperando/);

    const resolution = bySlug["b1-written-problem-resolution"].readingJson.paragraphs.join(" ");
    assert.match(resolution, /pedido 4831/);
    assert.match(resolution, /Adjunto una foto/);
    assert.match(resolution, /reembolso de los dos productos/);

    const checkpointFunctions = bySlug["checkpoint-b1-messages-emails"].exercises
      .filter((exercise) => ["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"].includes(exercise.type))
      .map((exercise) => exercise.answerJson.functionalCheck);
    assert.equal(checkpointFunctions.length, 3);
    assert.equal(checkpointFunctions.every((check) => check?.groups?.length >= 3), true);
    assert.equal(checkpointFunctions.every((check) => check.groups.every((group) => group.labelDe)), true);

    const words = await prisma.word.findMany({ where: { vocabularyGroup: { slug: "b1-messages-emails" } } });
    assert.equal(words.length, 24);
    assert.equal(new Set(words.map((word) => word.spanish)).size, 24);
    const { localizedWordMeaning } = await import("../src/word-localization-core.mjs");
    for (const word of words) assert.ok(localizedWordMeaning(word, "de"), `${word.spanish} needs a German meaning`);
  } finally {
    await prisma.$disconnect();
  }
});
