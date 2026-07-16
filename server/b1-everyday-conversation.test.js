const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = [
  "b1-show-interest-follow-up",
  "b1-expand-return-answer",
  "b1-tell-short-anecdote",
  "b1-react-personal-news",
  "b1-shift-return-topic",
  "b1-boundary-close-conversation",
  "checkpoint-b1-everyday-conversation"
];

test("B1.10 teaches conversation flow before asking for spontaneous conversation", async () => {
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
    assert.deepEqual(lessons.map((lesson) => lesson.order), [1312.1, 1312.2, 1312.3, 1312.4, 1312.5, 1312.6, 1312.7]);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 4);

    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "B1");
      assert.equal(lesson.isPublished, true);
      assert.equal(lesson.topic.slug, "everyday-conversation-relationships");
      assert.ok(lesson.vocabularyGroups.some((group) => group.slug === "b1-everyday-conversation"));
      assert.ok(lesson.sentences.length >= 5);
      assert.ok(lesson.exercises.length >= 10 && lesson.exercises.length <= 12, `${lesson.slug} needs bounded mixed retrieval`);
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"]) {
        assert.ok(lesson.exercises.some((exercise) => exercise.type === type), `${lesson.slug} needs ${type}`);
      }
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.orientationDe.length >= 150);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 150);
      assert.ok(lesson.readingJson.modelSummary.split(/\s+/).length >= 20);
      assert.doesNotMatch(lesson.readingJson.paragraphs.join(" "), /\b(?:the|with|conversation|German|English|Frage|Gespräch)\b/i);
    }

    const bySlug = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson]));
    assert.match(bySlug["b1-show-interest-follow-up"].sentences.map((item) => item.spanish).join(" "), /¿Y qué pasó después\?/);
    assert.match(bySlug["b1-expand-return-answer"].sentences.map((item) => item.spanish).join(" "), /¿Y tú, qué planes tienes\?/);
    assert.match(bySlug["b1-tell-short-anecdote"].sentences.map((item) => item.spanish).join(" "), /¿Te ha pasado alguna vez algo parecido\?/);
    assert.match(bySlug["b1-react-personal-news"].sentences.map((item) => item.spanish).join(" "), /¿Quieres hablar de ello\?/);
    assert.match(bySlug["b1-shift-return-topic"].sentences.map((item) => item.spanish).join(" "), /te he interrumpido/);
    assert.match(bySlug["b1-boundary-close-conversation"].sentences.map((item) => item.spanish).join(" "), /tengo que irme en cinco minutos/);

    const checkpointFunctions = bySlug["checkpoint-b1-everyday-conversation"].exercises
      .filter((exercise) => ["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"].includes(exercise.type))
      .map((exercise) => exercise.answerJson.functionalCheck);
    assert.equal(checkpointFunctions.length, 3);
    assert.equal(checkpointFunctions.every((check) => check?.groups?.length === 2), true);
    assert.equal(checkpointFunctions.every((check) => check.groups.every((group) => group.required && group.labelDe)), true);

    const words = await prisma.word.findMany({ where: { vocabularyGroup: { slug: "b1-everyday-conversation" } } });
    assert.equal(words.length, 24);
    assert.equal(new Set(words.map((word) => word.spanish)).size, 24);
    const { localizedWordMeaning } = await import("../src/word-localization-core.mjs");
    for (const word of words) assert.ok(localizedWordMeaning(word, "de"), `${word.spanish} needs a German meaning`);
  } finally {
    await prisma.$disconnect();
  }
});
