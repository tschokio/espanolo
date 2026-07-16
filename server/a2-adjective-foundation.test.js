const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { packages } = require("../prisma/seed-a2-adjective-foundation");
const { evaluateExerciseAnswer } = require("./learning-core");

const root = path.join(__dirname, "..");

test("A2 teaches adjective agreement and frequent short forms before comparisons", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({ where: { slug: { in: packages.map(({ slug }) => slug) } }, orderBy: { order: "asc" }, include: { topic: true, sentences: true, exercises: { include: { options: true } } } });
    const comparison = await prisma.lesson.findUnique({ where: { slug: "a2-more-less-comparisons" }, select: { order: true } });
    assert.deepEqual(lessons.map(({ slug }) => slug), packages.map(({ slug }) => slug));
    assert.ok(lessons.every(({ order }) => order < comparison.order));
    assert.deepEqual(lessons.map(({ topic }) => topic.slug), ["adjective-agreement-position", "common-adjective-short-forms", "adjective-foundation-checkpoint"]);
    assert.ok(lessons.every(({ sentences, exercises }) => sentences.length === 6 && exercises.filter(({ slug }) => !slug.startsWith("supplement-")).length === 8));
    const agreement = lessons[0].exercises.find(({ slug }) => slug === "a2-adjective-agreement-position-translate");
    assert.equal(evaluateExerciseAnswer(agreement, { answer: "Necesitamos habitaciones tranquilas." }).correct, true);
    assert.equal(evaluateExerciseAnswer(agreement, { answer: "Necesitamos habitaciones tranquilo." }).correct, false);
  } finally {
    await prisma.$disconnect();
  }
});

test("adjective packages are German-first, connected, and durably wired", () => {
  for (const input of packages) {
    assert.equal(input.readingJson.paragraphs.length, 2);
    assert.equal(input.readingJson.questions.length, 2);
    assert.ok(input.readingJson.orientationDe.length >= 160);
    assert.ok(input.readingJson.recallPromptDe.length >= 130);
  }
  const phone = fs.readFileSync(path.join(root, "prisma", "seed-a2-phone-messages.js"), "utf8");
  const foundation = fs.readFileSync(path.join(root, "src", "foundation-card-localization.mjs"), "utf8");
  const localization = fs.readFileSync(path.join(root, "src", "learning-localization-core.mjs"), "utf8");
  const server = fs.readFileSync(path.join(root, "server", "index.js"), "utf8");
  assert.match(phone, /await seedAdjectiveFoundation\(prisma\)/);
  assert.match(foundation, /"adjective-agreement-position": \[/);
  assert.match(foundation, /"common-adjective-short-forms": \[/);
  assert.match(foundation, /"adjective-foundation-checkpoint": \[/);
  assert.match(localization, /"checkpoint-a2-adjective-foundation": "A2\.13 Adjektiv-Grundlage/);
  assert.match(server, /slug: "a2-13-adjective-foundation"/);
});
