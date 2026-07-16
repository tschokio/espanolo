const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const B1_CONNECTED_INPUT_SLUGS = [
  "b1-opinion-frames",
  "b1-give-reasons",
  "b1-agree-disagree-politely",
  "b1-compare-options",
  "b1-connected-opinion",
  "checkpoint-b1-opinions",
  "b1-story-main-idea",
  "b1-story-sequence",
  "b1-relative-que",
  "b1-report-what-someone-said",
  "b1-inference-context",
  "checkpoint-b1-stories"
];

const B1_GRAMMAR_INPUT_SLUGS = [
  "b1-future-intentions",
  "b1-regular-future",
  "b1-irregular-future",
  "b1-future-probability",
  "b1-real-conditions",
  "checkpoint-b1-future-conditions",
  "b1-subjunctive-meaning",
  "b1-subjunctive-regular",
  "b1-subjunctive-irregular",
  "b1-wishes-requests",
  "b1-advice-reactions-subjunctive",
  "checkpoint-b1-subjunctive"
];

const B1_ADVANCED_INPUT_SLUGS = [
  "b1-present-perfect-meaning",
  "b1-regular-participles",
  "b1-irregular-participles",
  "b1-perfect-time-markers",
  "b1-past-perfect",
  "checkpoint-b1-perfect-tenses",
  "b1-conditional-meaning",
  "b1-regular-conditional",
  "b1-irregular-conditional",
  "b1-conditional-advice",
  "b1-hypothetical-si",
  "checkpoint-b1-conditional",
  "b1-affirmative-tu-commands",
  "b1-irregular-tu-commands",
  "b1-negative-commands",
  "b1-pronouns-with-commands",
  "b1-double-object-pronouns",
  "checkpoint-b1-commands-pronouns",
  "b1-para-goal-purpose",
  "b1-para-recipient-deadline",
  "b1-por-cause-exchange",
  "b1-por-route-duration",
  "b1-por-para-contrast",
  "checkpoint-b1-por-para"
];

test("B1.1 and B1.2 move from connected input to comprehension and Spanish recall", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: B1_CONNECTED_INPUT_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), B1_CONNECTED_INPUT_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 6);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      assert.equal(lesson.cefrLevel, "B1");
      assert.ok(lesson.estimatedMinutes >= 15);
      assert.ok(content.title.length >= 20, `${lesson.slug} needs a concrete Spanish input title`);
      assert.equal(content.paragraphs.length, 2, `${lesson.slug} needs a connected two-part text`);
      assert.ok(content.paragraphs.join(" ").split(/\s+/).length >= 40, `${lesson.slug} input is too thin`);
      assert.ok(content.orientationDe.length >= 70 && content.orientationEn.length >= 60);
      assert.equal(content.questions.length, 2, `${lesson.slug} needs two meaning checks`);
      for (const question of content.questions) {
        assert.ok(question.questionDe && question.questionEn);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 3);
        assert.ok(question.explanationDe.length >= 60 && question.explanationEn.length >= 50);
      }
      assert.ok(content.recallPromptDe.length >= 60 && content.recallPromptEn.length >= 50);
      assert.ok(content.modelSummary.split(/\s+/).length >= 10, `${lesson.slug} needs a useful Spanish recall model`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("B1.3 and B1.4 teach future and subjunctive choices through meaningful connected situations", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: B1_GRAMMAR_INPUT_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), B1_GRAMMAR_INPUT_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 6);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      assert.equal(lesson.cefrLevel, "B1");
      assert.ok(lesson.estimatedMinutes >= 16);
      assert.ok(content.title.length >= 20);
      assert.doesNotMatch(content.title, /\b(?:Die|Was|Vorbereitung|Eine|Ein)\b/);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(content.paragraphs.join(" ").split(/\s+/).length >= 45, `${lesson.slug} input is too thin`);
      assert.doesNotMatch(content.paragraphs.join(" "), /\b(?:Besuch einer neuen|Überlastung|Vorbereitung auf)\b/i);
      assert.equal(content.questions.length, 2);
      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 20 && question.questionEn.length >= 18);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(question.explanationDe.length >= 60 && question.explanationEn.length >= 50);
      }
      assert.ok(content.recallPromptDe.length >= 65 && content.recallPromptEn.length >= 55);
      assert.ok(content.modelSummary.split(/\s+/).length >= 11);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("B1.5 through B1.8 embed grammar in connected situations with German guidance and Spanish recall", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: B1_ADVANCED_INPUT_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), B1_ADVANCED_INPUT_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 12);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      assert.equal(lesson.cefrLevel, "B1");
      assert.ok(lesson.estimatedMinutes >= 16);
      assert.ok(content.title.length >= 20, `${lesson.slug} needs a concrete Spanish title`);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(content.paragraphs.join(" ").split(/\s+/).length >= 55, `${lesson.slug} input is too thin`);
      assert.ok(content.orientationDe.length >= 85 && content.orientationEn.length >= 70);
      assert.equal(content.questions.length, 2);
      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 20 && question.questionEn.length >= 18);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 3);
        assert.ok(question.explanationDe.length >= 75 && question.explanationEn.length >= 65);
      }
      assert.ok(content.recallPromptDe.length >= 80 && content.recallPromptEn.length >= 70);
      assert.ok(content.modelSummary.split(/\s+/).length >= 14);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("connected B1 listening has a complete quiet-mode reading path", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "src", "App.jsx"), "utf8");
  assert.match(source, /listening && quiet/);
  assert.match(source, /Dieser Hörinhalt wird heute als Lesetext geübt/);
  assert.match(source, /content\.recallPromptDe/);
  assert.match(source, /content\.modelSummary/);
});
