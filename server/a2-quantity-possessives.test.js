const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { packages } = require("../prisma/seed-a2-quantity-possessives");
const { evaluateExerciseAnswer } = require("./learning-core");

const root = path.join(__dirname, "..");

test("A2 teaches quantity and independent possession before tanto and la tuya are required", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({ where: { slug: { in: packages.map(({ slug }) => slug) } }, orderBy: { order: "asc" }, include: { topic: true, sentences: true, exercises: true } });
    const comparisons = await prisma.lesson.findMany({ where: { slug: { in: ["a2-more-less-comparisons", "a2-equality-comparisons"] } }, select: { slug: true, order: true, sentences: true } });
    assert.deepEqual(lessons.map(({ slug }) => slug), packages.map(({ slug }) => slug));
    assert.ok(lessons.every(({ order }) => comparisons.every((comparison) => order < comparison.order)));
    assert.match(comparisons.flatMap(({ sentences }) => sentences.map(({ spanish }) => spanish)).join(" "), /la tuya|tantos libros|tanta agua/i);
    assert.deepEqual(lessons.map(({ topic }) => topic.slug), ["quantity-noun-adverb", "independent-possessives", "quantity-possessive-checkpoint"]);
    assert.ok(lessons.every(({ sentences, exercises }) => sentences.length === 6 && exercises.filter(({ slug }) => !slug.startsWith("supplement-")).length === 8));
    const quantity = lessons[0].exercises.find(({ slug }) => slug === "a2-quantity-words-translate");
    assert.equal(evaluateExerciseAnswer(quantity, { answer: "Hay demasiadas personas aquí." }).correct, true);
    assert.equal(evaluateExerciseAnswer(quantity, { answer: "Hay demasiado personas aquí." }).correct, false);
  } finally {
    await prisma.$disconnect();
  }
});

test("quantity and possessive packages have German transfer and durable wiring", () => {
  for (const input of packages) {
    assert.equal(input.readingJson.paragraphs.length, 2);
    assert.equal(input.readingJson.questions.length, 2);
    assert.ok(input.readingJson.orientationDe.length >= 170);
    assert.ok(input.readingJson.recallPromptDe.length >= 135);
    assert.doesNotMatch(input.readingJson.modelSummary, /\b(?:der|die|das|und|ist|sind|wenig|genügend)\b/i);
  }
  const phone = fs.readFileSync(path.join(root, "prisma", "seed-a2-phone-messages.js"), "utf8");
  const foundation = fs.readFileSync(path.join(root, "src", "foundation-card-localization.mjs"), "utf8");
  const server = fs.readFileSync(path.join(root, "server", "index.js"), "utf8");
  assert.match(phone, /await seedQuantityPossessives\(prisma\)/);
  assert.match(foundation, /"quantity-noun-adverb": \[/);
  assert.match(foundation, /"independent-possessives": \[/);
  assert.match(foundation, /"quantity-possessive-checkpoint": \[/);
  assert.match(server, /slug: "a2-14-quantity-possessives"/);
});
