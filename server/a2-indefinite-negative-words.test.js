const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { packages } = require("../prisma/seed-a2-indefinite-negative-words");
const { evaluateExerciseAnswer } = require("./learning-core");

const root = path.join(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "src", "App.jsx"), "utf8");
const foundationSource = fs.readFileSync(path.join(root, "src", "foundation-card-localization.mjs"), "utf8");
const localizationSource = fs.readFileSync(path.join(root, "src", "learning-localization-core.mjs"), "utf8");
const phoneSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-phone-messages.js"), "utf8");
const serverSource = fs.readFileSync(path.join(root, "server", "index.js"), "utf8");

test("A2 teaches indefinite and negative word pairs before later connected input assumes nadie", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: packages.map(({ slug }) => slug) } },
      orderBy: { order: "asc" },
      include: { topic: true, sentences: true, exercises: { include: { options: true } } }
    });
    const nextLesson = await prisma.lesson.findUnique({ where: { slug: "a2-present-progressive" }, select: { order: true, readingJson: true } });
    assert.deepEqual(lessons.map(({ slug }) => slug), packages.map(({ slug }) => slug));
    assert.ok(lessons.every(({ order }) => order < nextLesson.order));
    assert.match(nextLesson.readingJson.paragraphs.join(" "), /Nadie está comiendo/i);
    assert.deepEqual(lessons.map(({ topic }) => topic.slug), ["indefinite-people-things", "positive-negative-agreement", "indefinite-negative-checkpoint"]);
    assert.ok(lessons.every(({ sentences, exercises }) => sentences.length === 6 && exercises.filter(({ slug }) => !slug.startsWith("supplement-")).length === 8));
    assert.ok(lessons.every(({ exercises }) => new Set(exercises.map(({ type }) => type)).size >= 6));
    const core = lessons[0];
    const afterVerb = core.exercises.find(({ slug }) => slug === "a2-algo-alguien-nada-nadie-translate");
    const beforeVerb = core.exercises.find(({ slug }) => slug === "a2-algo-alguien-nada-nadie-recall");
    assert.equal(evaluateExerciseAnswer(afterVerb, { answer: "No necesito nada más." }).correct, true);
    assert.equal(evaluateExerciseAnswer(afterVerb, { answer: "Necesito nada más." }).correct, false);
    assert.equal(evaluateExerciseAnswer(beforeVerb, { answer: "Nadie sabe la respuesta." }).correct, true);
    assert.equal(evaluateExerciseAnswer(beforeVerb, { answer: "No nadie sabe la respuesta." }).correct, false);
  } finally {
    await prisma.$disconnect();
  }
});

test("the three packages provide German-first meaning, contrast, transfer, and durable seed wiring", () => {
  for (const input of packages) {
    const reading = input.readingJson;
    assert.equal(reading.paragraphs.length, 2);
    assert.equal(reading.questions.length, 2);
    assert.ok(reading.orientationDe.length >= 150);
    assert.ok(reading.recallPromptDe.length >= 130);
    assert.ok(reading.questions.every((question) => question.questionDe && question.optionsDe.length === 3 && question.explanationDe.length >= 90));
    assert.ok(reading.modelSummary.split(/\s+/).length >= 15);
  }
  assert.match(appSource, /indefinite-people-things/);
  assert.match(foundationSource, /"indefinite-people-things": \[/);
  assert.match(foundationSource, /"positive-negative-agreement": \[/);
  assert.match(foundationSource, /"indefinite-negative-checkpoint": \[/);
  assert.match(localizationSource, /"checkpoint-a2-indefinite-negative-words": "A2\.12 Unbestimmte und negative Wörter/);
  assert.match(phoneSeedSource, /await seedIndefiniteNegativeWords\(prisma\)/);
  assert.match(serverSource, /slug: "a2-12-indefinite-negative-words"/);
});
