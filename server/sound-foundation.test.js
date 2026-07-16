const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SOUND_LESSON_SLUGS = [
  "a1-five-clear-vowels",
  "a1-consonant-sound-map",
  "a1-r-rr-b-v-ll-y",
  "a1-syllables-stress-accents",
  "a1-rhythm-linking-intonation",
  "checkpoint-a1-sound-foundation"
];

test("A1.P builds a complete sound foundation before the first grammar package", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: SOUND_LESSON_SLUGS } },
      orderBy: { order: "asc" },
      select: {
        slug: true,
        order: true,
        topic: { select: { slug: true } },
        sentences: { select: { spanish: true } },
        exercises: { select: { type: true, answerJson: true } }
      }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), SOUND_LESSON_SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [1, 3, 5, 7, 8, 9]);
    assert.equal(new Set(lessons.map((lesson) => lesson.topic.slug)).size, 6);

    for (const lesson of lessons) {
      const checkpoint = lesson.slug.startsWith("checkpoint-");
      const types = new Set(lesson.exercises.map((exercise) => exercise.type));
      const goals = new Set(lesson.exercises.map((exercise) => exercise.answerJson?.goal));
      assert.equal(lesson.sentences.length, 5, `${lesson.slug} needs five meaningful sound models`);
      assert.equal(lesson.exercises.length, checkpoint ? 12 : 10, `${lesson.slug} has an incomplete practice package`);
      assert.ok(lesson.exercises.filter((exercise) => exercise.type === "LISTENING_DICTATION").length >= 2);
      for (const type of ["MULTIPLE_CHOICE", "LISTENING_DICTATION", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "ERROR_CORRECTION", "TRANSFORMATION"]) {
        assert.ok(types.has(type), `${lesson.slug} is missing ${type}`);
      }
      for (const goal of ["sound_listening", "sound_spelling_correction", "sound_active_recall", "sound_word_order"]) {
        assert.ok(goals.has(goal), `${lesson.slug} is missing ${goal}`);
      }
    }

    const firstLaterLesson = await prisma.lesson.findFirst({
      where: { slug: { notIn: SOUND_LESSON_SLUGS }, isPublished: true },
      orderBy: { order: "asc" },
      select: { order: true }
    });
    assert.ok(firstLaterLesson.order > lessons.at(-1).order);
  } finally {
    await prisma.$disconnect();
  }
});

test("quiet mode converts sound dictation into scheduled silent reconstruction", async () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(path.join(__dirname, "..", "src", "App.jsx"), "utf8");
  assert.doesNotMatch(source, /filter\(\(exercise\) => !quiet \|\| exercise\.type !== "LISTENING_DICTATION"\)/);
  assert.match(source, /isQuietListeningAlternative = quiet && isListeningDictation/);
  assert.match(source, /practiceMode: isQuietListeningAlternative \? "quiet-alternative" : "home"/);
  assert.match(source, /quality: hintLevel > 0 \|\| needsCorrection \|\| correctionAttempt \|\| isQuietListeningAlternative \? "hard" : "good"/);
  assert.match(source, /Die echte Hörprüfung kehrt im Zuhause-Modus zurück/);

  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { type: "LISTENING_DICTATION", lesson: { isPublished: true } },
      include: { lesson: { include: { sentences: true } } }
    });
    const normalize = (value) => String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    for (const exercise of exercises) {
      const audioText = exercise.answerJson?.audioText || exercise.answerJson?.correct || "";
      assert.ok(
        exercise.lesson.sentences.some((sentence) => normalize(sentence.spanish) === normalize(audioText)),
        `${exercise.lesson.slug}/${exercise.slug} needs a model-sentence meaning for quiet mode`
      );
    }
  } finally {
    await prisma.$disconnect();
  }
});
