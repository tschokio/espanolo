const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const { PrismaClient } = require("@prisma/client");
const { wordContextAnswer } = require("./learning-core");

const LEVEL_VOCABULARY_GROUPS = [
  "b1-conversation-stories",
  "b1-plans-reactions",
  "b2-discourse-reporting",
  "b2-complex-structures",
  "c1-register-argument",
  "c1-narrative-interaction",
  "c2-precision-mediation-vocabulary",
  "c2-rhetoric-variation-vocabulary"
];

test("the standard seed path creates level vocabulary before B1-C2 lessons attach it", () => {
  const packageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
  const command = packageConfig.scripts["db:seed"];
  const vocabularyPosition = command.indexOf("seed-advanced-vocabulary.js");
  const b1Position = command.indexOf("seed-b1-opinions.js");

  assert.ok(vocabularyPosition >= 0);
  assert.ok(vocabularyPosition < b1Position);
});

test("B1-C2 have eight complete German-ready level vocabulary domains", async () => {
  const prisma = new PrismaClient();
  try {
    const groups = await prisma.vocabularyGroup.findMany({
      where: { slug: { in: LEVEL_VOCABULARY_GROUPS } },
      include: { words: true, lessons: { select: { cefrLevel: true, slug: true } } }
    });

    assert.equal(groups.length, 8);
    for (const group of groups) {
      assert.equal(group.words.length, 20, `${group.slug} should contain a focused 20-word package`);
      assert.equal(group.words.every((word) => word.example && wordContextAnswer(word)), true, `${group.slug} needs usable Spanish contexts for every word`);
      assert.ok(group.lessons.length >= 6, `${group.slug} should be attached to a substantial curriculum unit`);
    }
    assert.equal(groups.filter((group) => group.lessons.every((lesson) => lesson.cefrLevel === "B1")).length, 2);
    assert.equal(groups.filter((group) => group.lessons.every((lesson) => lesson.cefrLevel === "B2")).length, 2);
    assert.equal(groups.filter((group) => group.lessons.every((lesson) => lesson.cefrLevel === "C1")).length, 2);
    assert.equal(groups.filter((group) => group.lessons.every((lesson) => lesson.cefrLevel === "C2")).length, 2);
  } finally {
    await prisma.$disconnect();
  }
});

test("every published B1-C2 lesson receives its level-specific vocabulary domain", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true, cefrLevel: { in: ["B1", "B2", "C1", "C2"] } },
      select: { slug: true, cefrLevel: true, vocabularyGroups: { select: { slug: true } } }
    });
    const uncovered = lessons.filter((lesson) => !lesson.vocabularyGroups.some((group) => LEVEL_VOCABULARY_GROUPS.includes(group.slug)));

    assert.equal(lessons.length, 189);
    assert.deepEqual(uncovered.map((lesson) => lesson.slug), []);
  } finally {
    await prisma.$disconnect();
  }
});
