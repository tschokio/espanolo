const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const {
  exerciseDefinitions,
  lessonDefinition
} = require("../prisma/seed-a2-personal-a");
const { evaluateExerciseAnswer } = require("./learning-core");

const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "App.jsx"), "utf8");
const foundationSource = fs.readFileSync(path.join(__dirname, "..", "src", "foundation-card-localization.mjs"), "utf8");
const localizationSource = fs.readFileSync(path.join(__dirname, "..", "src", "learning-localization-core.mjs"), "utf8");
const seedPathSource = fs.readFileSync(path.join(__dirname, "..", "prisma", "seed-a2-object-pronouns.js"), "utf8");

test("the A2 personal-a package teaches the decision before object pronouns require it", async () => {
  const prisma = new PrismaClient();
  try {
    const [lesson, nextLesson, previousCheckpoint] = await Promise.all([
      prisma.lesson.findUnique({
        where: { slug: lessonDefinition.slug },
        include: { topic: true, sentences: true, exercises: { include: { options: true } } }
      }),
      prisma.lesson.findUnique({ where: { slug: "a2-direct-objects-lo-la" }, select: { order: true } }),
      prisma.lesson.findUnique({ where: { slug: "checkpoint-a2-formal-address" }, select: { order: true } })
    ]);
    assert.ok(lesson);
    assert.equal(lesson.topic.slug, "personal-a-foundation");
    assert.ok(previousCheckpoint.order < lesson.order && lesson.order < nextLesson.order);
    assert.equal(lesson.sentences.length, 5);
    assert.equal(lesson.exercises.filter(({ slug }) => !slug.startsWith("supplement-")).length, 8);
    assert.ok(lesson.sentences.some(({ spanish }) => spanish === "Veo a Marta cada mañana."));
    assert.ok(lesson.sentences.some(({ spanish }) => spanish === "Busco un médico."));
    assert.ok(lesson.sentences.some(({ spanish }) => spanish === "Tengo dos hermanos."));
    assert.deepEqual(
      new Set(lesson.exercises.map(({ type }) => type)),
      new Set(["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "LISTENING_DICTATION", "SHORT_ANSWER", "DIALOGUE_REPLY"])
    );
    const production = lesson.exercises.find(({ slug }) => slug === "a2-personal-a-known-people");
    assert.equal(evaluateExerciseAnswer(production, { answer: "Conozco a tus padres." }).correct, true);
    assert.equal(evaluateExerciseAnswer(production, { answer: "Conozco tus padres." }).correct, false);
  } finally {
    await prisma.$disconnect();
  }
});

test("the personal-a explanation uses German decision contrasts and honest limits", async () => {
  const reading = lessonDefinition.readingJson;
  assert.match(reading.orientationDe, /zwei Schritten/);
  assert.match(reading.orientationDe, /konkrete oder identifizierte Person/);
  assert.equal(reading.questions.length, 3);
  assert.ok(reading.questions.every((question) => question.questionDe && question.optionsDe.length === 3 && question.explanationDe));
  assert.match(reading.paragraphs.join(" "), /busca a su hermano/);
  assert.match(reading.paragraphs.join(" "), /busca un taxi/);
  assert.match(reading.paragraphs.join(" "), /Tiene dos hermanos/);
  assert.match(appSource, /"personal-a-foundation": \[/);
  assert.match(appSource, /Betrifft die Handlung direkt eine Person oder eine Sache/);
  assert.match(foundationSource, /"personal-a-foundation": \[/);
  assert.match(foundationSource, /Besitz-, Beziehungs- und Existenzsätzen mit tener und hay/);
  assert.match(localizationSource, /"a2-personal-a-people": "Die persönliche Objektmarkierung a bei Personen"/);
  assert.match(seedPathSource, /await seedPersonalALesson\(prisma\)/);
  assert.equal(exerciseDefinitions.filter(({ type }) => type === "TRANSLATION").length, 2);
});
