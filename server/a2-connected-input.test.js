const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const A2_CONNECTED_SCENARIO_SLUGS = [
  "a2-preference-dialogues",
  "scenario-restaurant-order",
  "scenario-travel-directions",
  "scenario-pharmacy-help",
  "lab-a2-cafe-reading",
  "lab-a2-weekend-listening",
  "checkpoint-a2-scenarios-input"
];

const A2_FOUNDATION_INPUT_SLUGS = [
  "a2-daily-routine-overview",
  "a2-reflexive-morning",
  "a2-frequency-and-time",
  "a2-routine-sequence",
  "checkpoint-a2-daily-routine",
  "a2-irregular-present-overview",
  "a2-useful-verb-frames",
  "a2-more-irregular-actions",
  "a2-plans-obligations",
  "checkpoint-a2-verb-frames",
  "a2-gustar-basics",
  "a2-gustar-plurals-and-infinitives",
  "a2-preferir-and-favorites",
  "checkpoint-a2-likes-preferences"
];

const A2_FINAL_INPUT_SLUGS = [
  "a2-direct-objects-lo-la",
  "a2-direct-objects-los-las",
  "a2-indirect-object-le",
  "a2-shopping-with-pronouns",
  "checkpoint-a2-object-pronouns-shopping",
  "a2-past-time-and-ar-preterite",
  "a2-regular-er-ir-preterite",
  "a2-essential-irregular-preterite",
  "a2-imperfect-background",
  "a2-event-and-background",
  "checkpoint-a2-past-events"
];

test("A2 moves from sentence frames into short connected dialogues, reading, and listening", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: A2_CONNECTED_SCENARIO_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), A2_CONNECTED_SCENARIO_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 5);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      assert.equal(lesson.cefrLevel, "A2");
      assert.ok(lesson.estimatedMinutes >= 15);
      assert.ok(content.title.length >= 25);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(content.paragraphs.join(" ").split(/\s+/).length >= 50, `${lesson.slug} input is too thin`);
      assert.ok(content.paragraphs.join(" ").split(/\s+/).length <= 105, `${lesson.slug} input is too dense for A2`);
      assert.ok(content.orientationDe.length >= 90 && content.orientationEn.length >= 75);
      assert.equal(content.questions.length, 2);
      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 20 && question.questionEn.length >= 18);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(question.explanationDe.length >= 65 && question.explanationEn.length >= 55);
      }
      assert.ok(content.recallPromptDe.length >= 95 && content.recallPromptEn.length >= 80);
      assert.ok(content.modelSummary.split(/\s+/).length >= 12);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("A2 foundation packages add brief connected context without overloading beginners", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: A2_FOUNDATION_INPUT_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), A2_FOUNDATION_INPUT_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 9);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      const wordCount = content.paragraphs.join(" ").split(/\s+/).length;
      assert.equal(lesson.cefrLevel, "A2");
      assert.ok(lesson.estimatedMinutes >= 15);
      assert.ok(content.title.length >= 20);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(wordCount >= 45, `${lesson.slug} input is too thin`);
      assert.ok(wordCount <= 105, `${lesson.slug} input is too dense for early A2`);
      assert.ok(content.orientationDe.length >= 80, `${lesson.slug} needs a useful German orientation`);
      assert.ok(content.orientationEn.length >= 65, `${lesson.slug} needs optional English support`);
      assert.equal(content.questions.length, 2);
      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 20 && question.questionEn.length >= 18);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(question.explanationDe.length >= 65, `${lesson.slug} needs a substantive German explanation`);
        assert.ok(question.explanationEn.length >= 55, `${lesson.slug} needs optional English explanation`);
      }
      assert.ok(content.recallPromptDe.length >= 90, `${lesson.slug} needs German-guided recall`);
      assert.ok(content.recallPromptEn.length >= 75, `${lesson.slug} needs optional English-guided recall`);
      assert.ok(content.modelSummary.split(/\s+/).length >= 12);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("every final A2 package bridges its sentence models into connected comprehension and recall", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: A2_FINAL_INPUT_SLUGS } },
      orderBy: { order: "asc" },
      select: { slug: true, cefrLevel: true, estimatedMinutes: true, readingJson: true }
    });
    assert.deepEqual(lessons.map((lesson) => lesson.slug), A2_FINAL_INPUT_SLUGS);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 9);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      const wordCount = content.paragraphs.join(" ").split(/\s+/).length;
      assert.equal(lesson.cefrLevel, "A2");
      assert.ok(lesson.estimatedMinutes >= 15);
      assert.equal(content.paragraphs.length, 2);
      assert.ok(wordCount >= 45, `${lesson.slug} input is too thin`);
      assert.ok(wordCount <= 105, `${lesson.slug} input is too dense for A2`);
      assert.ok(content.orientationDe.length >= 90, `${lesson.slug} needs a useful German orientation`);
      assert.ok(content.orientationEn.length >= 75, `${lesson.slug} needs optional English support`);
      assert.equal(content.questions.length, 2);
      for (const question of content.questions) {
        assert.ok(question.questionDe.length >= 20 && question.questionEn.length >= 18);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        assert.ok(question.explanationDe.length >= 75, `${lesson.slug} needs a substantive German explanation`);
        assert.ok(question.explanationEn.length >= 65, `${lesson.slug} needs optional English explanation`);
      }
      assert.ok(content.recallPromptDe.length >= 110, `${lesson.slug} needs German-guided active recall`);
      assert.ok(content.recallPromptEn.length >= 95, `${lesson.slug} needs optional English-guided recall`);
      assert.ok(content.modelSummary.split(/\s+/).length >= 15);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("the complete published A2 path has bounded connected input in every lesson", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { cefrLevel: "A2" },
      select: { slug: true, readingJson: true }
    });
    assert.equal(lessons.length, 84);
    for (const lesson of lessons) {
      assert.equal(lesson.readingJson?.paragraphs?.length, 2, `${lesson.slug} lacks connected input`);
      const wordCount = lesson.readingJson.paragraphs.join(" ").split(/\s+/).length;
      assert.ok(wordCount <= 105, `${lesson.slug} connected input exceeds the A2 cognitive-load limit`);
    }
  } finally {
    await prisma.$disconnect();
  }
});
