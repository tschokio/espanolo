const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = [
  "b1-clarify-work-assignment",
  "b1-report-progress-delay",
  "b1-negotiate-priorities-deadline",
  "b1-request-use-feedback",
  "b1-contribute-meeting-agreement",
  "b1-repair-work-misunderstanding",
  "checkpoint-b1-workplace-collaboration"
];

test("B1.9 teaches a complete workplace coordination chain in German and Spanish", async () => {
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
    assert.deepEqual(lessons.map((lesson) => lesson.order), [1311.1, 1311.2, 1311.3, 1311.4, 1311.5, 1311.6, 1311.7]);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 4);

    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "B1");
      assert.equal(lesson.isPublished, true);
      assert.equal(lesson.topic.slug, "workplace-collaboration-coordination");
      assert.ok(lesson.vocabularyGroups.some((group) => group.slug === "b1-workplace-collaboration"));
      assert.ok(lesson.sentences.length >= 5);
      assert.ok(lesson.exercises.length >= 10 && lesson.exercises.length <= 12, `${lesson.slug} needs a bounded retrieval mix`);
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"]) {
        assert.ok(lesson.exercises.some((exercise) => exercise.type === type), `${lesson.slug} needs ${type}`);
      }
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.orientationDe.length >= 145);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 145);
      assert.ok(lesson.readingJson.modelSummary.split(/\s+/).length >= 20);
      assert.doesNotMatch(lesson.readingJson.paragraphs.join(" "), /\b(?:the|with|work|deadline|feedback|German|English)\b/i);
    }

    const combined = lessons.flatMap((lesson) => lesson.sentences.map((sentence) => sentence.spanish)).join(" ");
    assert.match(combined, /resultado necesitas/i);
    assert.match(combined, /todavía me falta/i);
    assert.match(combined, /tiene más prioridad/i);
    assert.match(combined, /comentarios sobre la conclusión/i);
    assert.match(combined, /Quisiera añadir una idea/i);
    assert.match(combined, /ha habido un malentendido/i);

    const words = await prisma.word.findMany({ where: { vocabularyGroup: { slug: "b1-workplace-collaboration" } } });
    assert.equal(words.length, 24);
    assert.equal(new Set(words.map((word) => word.spanish)).size, 24);
    const { localizedWordMeaning } = await import("../src/word-localization-core.mjs");
    for (const word of words) assert.ok(localizedWordMeaning(word, "de"), `${word.spanish} needs a German meaning`);
  } finally {
    await prisma.$disconnect();
  }
});
