const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { lessonVocabularyContextTexts, selectLessonVocabularyWords, wordContextAnswer } = require("./learning-core");

const GROUP_TOPICS = new Map([
  ["c1-register-context-vocabulary", { topic: "c1-register-precision", level: "C1" }],
  ["c1-narrative-context-vocabulary", { topic: "c1-narrative-viewpoint", level: "C1" }],
  ["c1-argument-context-vocabulary", { topic: "c1-argument-synthesis", level: "C1" }],
  ["c1-pragmatic-context-vocabulary", { topic: "c1-pragmatic-interaction", level: "C1" }],
  ["c1-mood-context-vocabulary", { topic: "c1-mood-meaning", level: "C1" }],
  ["c1-listening-context-vocabulary", { topic: "c1-dense-listening", level: "C1" }],
  ["c2-precision-context-vocabulary", { topic: "c2-precision-mediation", level: "C2" }],
  ["c2-rhetoric-context-vocabulary", { topic: "c2-genre-rhetoric", level: "C2" }],
  ["c2-variation-context-vocabulary", { topic: "c2-sociolinguistic-variation", level: "C2" }],
  ["c2-negotiation-context-vocabulary", { topic: "c2-high-stakes-negotiation", level: "C2" }],
  ["c2-literary-context-vocabulary", { topic: "c2-literary-creative-control", level: "C2" }],
  ["c2-expert-listening-context-vocabulary", { topic: "c2-expert-listening-synthesis", level: "C2" }]
]);

test("C1 and C2 gain twelve bounded vocabulary domains drawn from their connected input", async () => {
  const prisma = new PrismaClient();
  try {
    const groups = await prisma.vocabularyGroup.findMany({
      where: { slug: { in: [...GROUP_TOPICS.keys()] } },
      include: { words: true, lessons: { select: { cefrLevel: true, topic: { select: { slug: true } } } } }
    });
    assert.equal(groups.length, 12);
    assert.equal(groups.reduce((total, group) => total + group.words.length, 0), 144);
    for (const group of groups) {
      const expected = GROUP_TOPICS.get(group.slug);
      assert.equal(group.words.length, 12, `${group.slug} should remain a bounded thematic package`);
      assert.equal(group.words.every((word) => String(word.example || "").length >= 18), true, `${group.slug} needs substantive Spanish examples`);
      assert.equal(group.words.every((word) => wordContextAnswer(word)), true, `${group.slug} examples must contain the complete expression`);
      assert.equal(group.lessons.length, 6, `${group.slug} should attach to exactly one six-lesson unit`);
      assert.equal(group.lessons.every((lesson) => lesson.cefrLevel === expected.level), true);
      assert.equal(group.lessons.every((lesson) => lesson.topic.slug === expected.topic), true, `${group.slug} leaked into an unrelated topic`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("the full seed attaches C1/C2 context vocabulary after all advanced topic seeds", () => {
  const packageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
  const command = packageConfig.scripts["db:seed"];
  const expansionPosition = command.indexOf("seed-c1-c2-context-vocabulary.js");
  const lastAdvancedTopicPosition = Math.max(
    command.indexOf("seed-c1-dense-listening.js"),
    command.indexOf("seed-c2-german-listening.js"),
    command.indexOf("seed-c2-sociolinguistic-variation.js"),
    command.indexOf("seed-c2-high-stakes-negotiation.js"),
    command.indexOf("seed-c2-literary-creative-control.js"),
    command.indexOf("seed-c2-expert-listening-synthesis.js")
  );
  const practicePosition = command.indexOf("seed-lesson-practice.js");
  assert.ok(expansionPosition > lastAdvancedTopicPosition);
  assert.ok(expansionPosition < practicePosition);
});

test("bounded advanced lesson batches introduce all context words before each checkpoint", async () => {
  const prisma = new PrismaClient();
  try {
    for (const [groupSlug, expected] of GROUP_TOPICS) {
      const lessons = await prisma.lesson.findMany({
        where: { isPublished: true, topic: { slug: expected.topic } },
        orderBy: { order: "asc" },
        include: { sentences: true, exercises: true, vocabularyGroups: { include: { words: true } } }
      });
      const targetGroup = lessons[0].vocabularyGroups.find((group) => group.slug === groupSlug);
      const targetIds = new Set(targetGroup.words.map((word) => word.id));
      const introducedTargetIds = new Set();
      const previouslyIntroducedIds = [];
      for (const lesson of lessons.filter((item) => !/checkpoint/i.test(`${item.slug} ${item.theme}`))) {
        const contextTexts = lessonVocabularyContextTexts(lesson);
        const batch = selectLessonVocabularyWords(lesson.vocabularyGroups, lesson.id, 8, previouslyIntroducedIds, { ...lesson, texts: contextTexts });
        previouslyIntroducedIds.push(...batch.map((word) => word.id));
        batch.filter((word) => targetIds.has(word.id)).forEach((word) => introducedTargetIds.add(word.id));
      }
      assert.equal(introducedTargetIds.size, 12, `${groupSlug} should be fully taught before its checkpoint`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("every new C1/C2 meaning has an authored German bridge", async () => {
  const { germanWordMeaningKeys, localizedWordMeaning } = await import("../src/word-localization-core.mjs");
  const covered = new Set(germanWordMeaningKeys);
  const prisma = new PrismaClient();
  try {
    const words = await prisma.word.findMany({ where: { vocabularyGroup: { slug: { in: [...GROUP_TOPICS.keys()] } } } });
    assert.equal(words.length, 144);
    for (const word of words) {
      assert.ok(covered.has(word.english), `${word.spanish} needs a German bridge for “${word.english}”`);
      assert.ok(localizedWordMeaning(word, "de"));
      assert.equal(localizedWordMeaning(word, "en"), word.english);
    }
  } finally {
    await prisma.$disconnect();
  }
});
