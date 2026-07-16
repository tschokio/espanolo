const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");
const {
  exerciseDefinitions,
  lessonDefinition
} = require("../prisma/seed-a2-participant-object-pronouns");
const { evaluateExerciseAnswer } = require("./learning-core");

const root = path.join(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "src", "App.jsx"), "utf8");
const foundationSource = fs.readFileSync(path.join(root, "src", "foundation-card-localization.mjs"), "utf8");
const localizationSource = fs.readFileSync(path.join(root, "src", "learning-localization-core.mjs"), "utf8");
const objectSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-object-pronouns.js"), "utf8");

test("A2 explicitly teaches me, te, and nos before later command and double-pronoun work", async () => {
  const prisma = new PrismaClient();
  try {
    const [lesson, previousLesson, nextLesson, laterCommandLesson] = await Promise.all([
      prisma.lesson.findUnique({
        where: { slug: lessonDefinition.slug },
        include: { topic: true, sentences: true, exercises: { include: { options: true } } }
      }),
      prisma.lesson.findUnique({ where: { slug: "a2-indirect-object-le" }, select: { order: true } }),
      prisma.lesson.findUnique({ where: { slug: "a2-shopping-with-pronouns" }, select: { order: true } }),
      prisma.lesson.findUnique({ where: { slug: "b1-pronouns-with-commands" }, select: { order: true } })
    ]);
    assert.ok(lesson);
    assert.equal(lesson.topic.slug, "participant-object-pronouns");
    assert.ok(previousLesson.order < lesson.order && lesson.order < nextLesson.order);
    assert.ok(lesson.order < laterCommandLesson.order);
    assert.equal(lesson.estimatedMinutes, 15);
    assert.equal(lesson.sentences.length, 5);
    assert.equal(lesson.exercises.filter(({ slug }) => !slug.startsWith("supplement-")).length, 8);
    assert.deepEqual(
      new Set(lesson.exercises.map(({ type }) => type)),
      new Set(["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "LISTENING_DICTATION", "SHORT_ANSWER", "DIALOGUE_REPLY"])
    );
    const production = lesson.exercises.find(({ slug }) => slug === "a2-me-te-nos-production");
    assert.equal(evaluateExerciseAnswer(production, { answer: "Marta me ve cada mañana." }).correct, true);
    assert.equal(evaluateExerciseAnswer(production, { answer: "Marta ve cada mañana." }).correct, false);
  } finally {
    await prisma.$disconnect();
  }
});

test("the package contrasts direct participants with receivers in German-first connected input", () => {
  const reading = lessonDefinition.readingJson;
  assert.equal(reading.questions.length, 2);
  assert.match(reading.orientationDe, /Trifft die Handlung die Person direkt/);
  assert.match(reading.orientationDe, /Sache beziehungsweise Information/);
  assert.match(reading.paragraphs.join(" "), /Te llamo/);
  assert.match(reading.paragraphs.join(" "), /nos ayuda/);
  assert.match(reading.paragraphs.join(" "), /me dices la dirección/);
  assert.ok(reading.questions.every((question) => question.questionDe && question.optionsDe.length === 3 && question.explanationDe.length >= 80));
  assert.match(appSource, /"participant-object-pronouns": \[/);
  assert.match(foundationSource, /"participant-object-pronouns": \[/);
  assert.match(localizationSource, /"a2-object-pronouns-me-te-nos": "Gesprächspartner mit me, te und nos ausdrücken"/);
  assert.match(objectSeedSource, /await seedParticipantObjectPronouns\(prisma\)/);
  assert.equal(exerciseDefinitions.length, 8);
});
