const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("every seeded model sentence has a German meaning", async () => {
  const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  const section = source.slice(source.indexOf("const germanFoundationMeanings"), source.indexOf("const germanConversationMeanings"));
  const inlineKeys = new Set(
    [...section.matchAll(/^\s*"((?:\\.|[^"\\])*)":/gm)].map((match) => JSON.parse(`"${match[1]}"`))
  );
  const { germanCourseSentenceMeaningKeys } = await import("./course-sentence-meanings.mjs");
  const covered = new Set([...inlineKeys, ...germanCourseSentenceMeaningKeys]);
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const sentences = await prisma.sentence.findMany({
      select: { spanish: true, english: true, lesson: { select: { slug: true } } }
    });
    for (const sentence of sentences) {
      assert.ok(covered.has(sentence.english), `${sentence.lesson.slug}: “${sentence.spanish}” needs a German meaning for “${sentence.english}”`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("German native meanings never fall back to raw English", () => {
  const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  const nativeMeaningSource = source.slice(source.indexOf("function nativeMeaning"), source.indexOf("function localizedExerciseQuestion"));
  assert.match(nativeMeaningSource, /germanCourseSentenceMeaning\(english\)/);
  assert.doesNotMatch(nativeMeaningSource, /\|\|\s*value|\|\|\s*english\s*;/);
});

test("every English answer choice in the published course has a German display value", async () => {
  const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  const section = source.slice(source.indexOf("const germanFoundationMeanings"), source.indexOf("const germanConversationMeanings"));
  const inlineKeys = [...section.matchAll(/^\s*"((?:\\.|[^"\\])*)":/gm)].map((match) => JSON.parse(`"${match[1]}"`));
  const { germanCourseSentenceMeaningKeys } = await import("./course-sentence-meanings.mjs");
  const { germanWordMeaningKeys } = await import("./word-localization-core.mjs");
  const covered = new Set([...inlineKeys, ...germanCourseSentenceMeaningKeys, ...germanWordMeaningKeys]);
  const normalizedWords = new Set(germanWordMeaningKeys.map((value) => value.toLowerCase()));
  const looksEnglish = (value) => /\bI\b/.test(value) || /(?:\byou\b|\bshe\b|\bthe\b|\bbecause\b|\bstraight\b|\bleft\b|\bmorning\b|\bbread\b|\bbag\b|\btea\b|\bticket\b|\bmedicine\b|\bwater\b|\bcoffee\b|\bmusic\b|\bstudent\b|\bhappy\b|\bhome\b)/i.test(value);
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const options = await prisma.exerciseOption.findMany({
      select: { text: true, exercise: { select: { lesson: { select: { slug: true } } } } }
    });
    for (const option of options.filter((item) => looksEnglish(item.text))) {
      const normalized = option.text.toLowerCase().replace(/[.!?]+$/g, "").trim();
      assert.ok(
        covered.has(option.text) || normalizedWords.has(normalized),
        `${option.exercise.lesson.slug}: answer choice “${option.text}” needs a German display value`
      );
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("every English exercise question in the published course has a concrete German version", async () => {
  const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  const section = source.slice(source.indexOf("const germanFoundationMeanings"), source.indexOf("const germanConversationMeanings"));
  const inlineKeys = [...section.matchAll(/^\s*"((?:\\.|[^"\\])*)":/gm)].map((match) => JSON.parse(`"${match[1]}"`));
  const { germanCourseSentenceMeaningKeys } = await import("./course-sentence-meanings.mjs");
  const { germanExerciseQuestionKeys } = await import("./exercise-question-localization.mjs");
  const covered = new Set([...inlineKeys, ...germanCourseSentenceMeaningKeys, ...germanExerciseQuestionKeys]);
  const { looksLikeEnglishLearningText } = await import("./exercise-question-localization.mjs");
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { lesson: { is: { isPublished: true } } },
      select: { questionText: true, lesson: { select: { slug: true } } }
    });
    for (const exercise of exercises.filter((item) => looksLikeEnglishLearningText(item.questionText))) {
      assert.ok(
        covered.has(exercise.questionText),
        `${exercise.lesson.slug}: exercise question “${exercise.questionText}” needs a concrete German version`
      );
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("English leak detection catches learning instructions without misclassifying Spanish haber forms", async () => {
  const { germanExerciseQuestion, looksLikeEnglishLearningText } = await import("./exercise-question-localization.mjs");
  assert.equal(looksLikeEnglishLearningText("Order two coffees to go."), true);
  assert.equal(looksLikeEnglishLearningText("Students learn grammar with examples."), true);
  assert.equal(looksLikeEnglishLearningText("Good sentences build confidence."), true);
  assert.equal(germanExerciseQuestion("Order two coffees to go."), "Bestelle auf Spanisch zwei Kaffee zum Mitnehmen.");
  assert.equal(germanExerciseQuestion("Before starting, I want to confirm the objective."), "Bevor ich beginne, möchte ich das Ziel bestätigen.");
  assert.equal(looksLikeEnglishLearningText("He hablado con Ana."), false);
  assert.equal(looksLikeEnglishLearningText("¿Has visto mi mensaje?"), false);
  assert.equal(looksLikeEnglishLearningText("dieciséis · diecinueve · veinticuatro"), false);
  assert.equal(looksLikeEnglishLearningText("Escribo después de comer."), false);
});
