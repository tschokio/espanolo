const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { lessonVocabularyContextTexts, selectLessonVocabularyWords, wordContextAnswer } = require("./learning-core");

const GROUP_TOPICS = new Map([
  ["b1-opinion-discussion-vocabulary", "opinions-connected-production"],
  ["b1-story-sequencing-vocabulary", "stories-comprehension"],
  ["b1-future-planning-vocabulary", "future-real-conditions"],
  ["b1-subjunctive-interaction-vocabulary", "present-subjunctive-meaning"],
  ["b1-perfect-experience-vocabulary", "perfect-past-connections"],
  ["b1-conditional-advice-vocabulary", "conditional-hypotheses"],
  ["b1-command-action-vocabulary", "commands-combined-pronouns"],
  ["b1-purpose-cause-route-vocabulary", "por-para-relationships"]
]);

test("B1 vocabulary expands through eight topic-bound contextual domains", async () => {
  const prisma = new PrismaClient();
  try {
    const groups = await prisma.vocabularyGroup.findMany({
      where: { slug: { in: [...GROUP_TOPICS.keys()] } },
      include: {
        words: true,
        lessons: { select: { cefrLevel: true, topic: { select: { slug: true } } } }
      }
    });

    assert.equal(groups.length, 8);
    assert.equal(groups.reduce((total, group) => total + group.words.length, 0), 96);
    for (const group of groups) {
      assert.equal(group.words.length, 12, `${group.slug} should remain a bounded thematic package`);
      assert.equal(group.words.every((word) => String(word.example || "").length >= 18), true, `${group.slug} needs substantive Spanish examples`);
      assert.equal(group.words.every((word) => wordContextAnswer(word)), true, `${group.slug} examples must contain the complete learnable expression`);
      assert.equal(group.lessons.length, 6, `${group.slug} should attach to exactly one six-lesson B1 unit`);
      assert.equal(group.lessons.every((lesson) => lesson.cefrLevel === "B1"), true);
      assert.equal(group.lessons.every((lesson) => lesson.topic.slug === GROUP_TOPICS.get(group.slug)), true, `${group.slug} leaked into an unrelated topic`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("the full seed restores contextual B1 vocabulary after topic seeds set their base groups", () => {
  const packageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
  const command = packageConfig.scripts["db:seed"];
  const expansionPosition = command.indexOf("seed-b1-context-vocabulary.js");
  const lastB1TopicPosition = Math.max(
    command.indexOf("seed-b1-por-para.js"),
    command.indexOf("seed-b1-connected-input-commands-por-para.js")
  );
  const practicePosition = command.indexOf("seed-lesson-practice.js");

  assert.ok(expansionPosition > lastB1TopicPosition);
  assert.ok(expansionPosition < practicePosition);
});

test("the bounded lesson batches introduce every topic word before its B1 checkpoint", async () => {
  const prisma = new PrismaClient();
  try {
    for (const [groupSlug, topicSlug] of GROUP_TOPICS) {
      const lessons = await prisma.lesson.findMany({
        where: { isPublished: true, topic: { slug: topicSlug } },
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

test("every new contextual B1 meaning has an authored German bridge", async () => {
  const { germanWordMeaningKeys, localizedWordMeaning } = await import("../src/word-localization-core.mjs");
  const covered = new Set(germanWordMeaningKeys);
  const prisma = new PrismaClient();
  try {
    const words = await prisma.word.findMany({ where: { vocabularyGroup: { slug: { in: [...GROUP_TOPICS.keys()] } } } });
    assert.equal(words.length, 96);
    for (const word of words) {
      assert.ok(covered.has(word.english), `${word.spanish} needs a German bridge for “${word.english}”`);
      assert.ok(localizedWordMeaning(word, "de"));
      assert.equal(localizedWordMeaning(word, "en"), word.english);
    }
  } finally {
    await prisma.$disconnect();
  }
});
