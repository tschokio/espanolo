const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const { packages } = require("../prisma/seed-a1-contractions-choice");
const { evaluateExerciseAnswer } = require("./learning-core");

const root = path.join(__dirname, "..");

test("A1 teaches al, del, qué, and cuál before the travel path relies on them", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({ where: { slug: { in: packages.map(({ slug }) => slug) } }, orderBy: { order: "asc" }, include: { topic: true, sentences: true, exercises: true } });
    const travel = await prisma.lesson.findUnique({ where: { slug: "a1-locate-landmarks-on-route" }, select: { order: true, sentences: true } });
    assert.deepEqual(lessons.map(({ slug }) => slug), packages.map(({ slug }) => slug));
    assert.ok(lessons.every(({ order }) => order < travel.order));
    assert.match(travel.sentences.map(({ spanish }) => spanish).join(" "), /al lado del museo/i);
    assert.deepEqual(lessons.map(({ topic }) => topic.slug), ["al-del-contractions", "que-cual-selection", "contractions-choice-checkpoint"]);
    assert.ok(lessons.every(({ sentences, exercises }) => sentences.length === 6 && exercises.filter(({ slug }) => !slug.startsWith("supplement-")).length === 8));
    const contraction = lessons[0].exercises.find(({ slug }) => slug === "a1-al-del-contractions-translate");
    assert.equal(evaluateExerciseAnswer(contraction, { answer: "Vengo del mercado." }).correct, true);
    assert.equal(evaluateExerciseAnswer(contraction, { answer: "Vengo de el mercado." }).correct, false);
  } finally {
    await prisma.$disconnect();
  }
});

test("premature A1 examples no longer require unexplained contractions or personal a", () => {
  const sound = fs.readFileSync(path.join(root, "prisma", "seed-a1-sound-foundation.js"), "utf8");
  const base = fs.readFileSync(path.join(root, "prisma", "seed.js"), "utf8");
  const essential = fs.readFileSync(path.join(root, "prisma", "seed-a1-essential-present-bridge.js"), "utf8");
  assert.doesNotMatch(sound, /Quiero ir al mercado|La gente llegó al hotel/);
  assert.doesNotMatch(base, /Nosotros caminamos al parque|No entiendo al doctor/);
  assert.match(essential, /await seedContractionsChoice\(prisma\)/);
});
