const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();
const TARGET_EXERCISE_COUNT = 16;

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const slugPart = (value) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

const tokensForBuilder = (sentence) => String(sentence || "").match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];

const acceptedSentence = (sentence) => {
  const plain = normalize(sentence);
  return [...new Set([plain, `${plain}.`, `${plain}?`, `${plain}!`])];
};

function choiceOptions(correct, distractors) {
  return [
    [correct, correct, true],
    ...distractors
      .filter(Boolean)
      .filter((item) => normalize(item) !== normalize(correct))
      .filter((item, index, list) => list.findIndex((candidate) => normalize(candidate) === normalize(item)) === index)
      .slice(0, 3)
      .map((item) => [item, item, false])
  ];
}

function sentenceExercises(lesson) {
  const exercises = [];
  for (const [index, sentence] of lesson.sentences.entries()) {
    const spanish = sentence.spanish.trim();
    const english = sentence.english.trim();
    if (!spanish || !english) continue;

    exercises.push({
      key: `translate-${index + 1}`,
      type: ExerciseType.TRANSLATION,
      prompt: "Active production.",
      instruction: "Type the Spanish sentence.",
      questionText: english,
      answerJson: {
        correct: spanish,
        accepted: acceptedSentence(spanish),
        goal: "active_production"
      },
      explanation: sentence.note || `A natural answer is: ${spanish}`,
      difficulty: 2,
      imageKey: lesson.imageKey,
      options: []
    });

    const words = tokensForBuilder(spanish);
    if (words.length >= 3 && words.length <= 10) {
      exercises.push({
        key: `builder-${index + 1}`,
        type: ExerciseType.SENTENCE_BUILDER,
        prompt: "Build the sentence.",
        instruction: "Put the words in order.",
        questionText: english,
        answerJson: {
          correctWords: words,
          goal: "word_order"
        },
        explanation: sentence.note || `The word order is: ${spanish}`,
        difficulty: 1,
        imageKey: lesson.imageKey,
        options: words.map((word) => [word, word, false])
      });
    }
  }
  return exercises;
}

function vocabularyExercises(lesson, allWords) {
  const lessonWords = lesson.vocabularyGroups.flatMap((group) => group.words || []);
  const exercises = [];
  for (const [index, word] of lessonWords.entries()) {
    const distractors = allWords
      .filter((candidate) => candidate.id !== word.id)
      .map((candidate) => candidate.english)
      .filter(Boolean);
    exercises.push({
      key: `vocab-${index + 1}`,
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: "Vocabulary in this lesson.",
      instruction: "Choose the meaning.",
      questionText: word.spanish,
      answerJson: {
        correct: word.english,
        accepted: [word.english],
        goal: "vocabulary_recognition"
      },
      explanation: `${word.spanish} means ${word.english}.`,
      difficulty: 1,
      imageKey: word.imageKey || lesson.imageKey,
      options: choiceOptions(word.english, distractors)
    });
  }
  return exercises;
}

async function upsertExercise(lesson, topicId, exercise, order) {
  const slug = `supplement-${lesson.slug}-${exercise.key}`;
  const saved = await prisma.exercise.upsert({
    where: { slug },
    update: {
      lessonId: lesson.id,
      topicId,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      questionText: exercise.questionText,
      answerJson: exercise.answerJson,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty,
      order,
      xpReward: exercise.type === ExerciseType.TRANSLATION ? 16 : exercise.type === ExerciseType.SENTENCE_BUILDER ? 14 : 10,
      imageKey: exercise.imageKey || null
    },
    create: {
      slug,
      lessonId: lesson.id,
      topicId,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      questionText: exercise.questionText,
      answerJson: exercise.answerJson,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty,
      order,
      xpReward: exercise.type === ExerciseType.TRANSLATION ? 16 : exercise.type === ExerciseType.SENTENCE_BUILDER ? 14 : 10,
      imageKey: exercise.imageKey || null
    }
  });

  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (exercise.options.length) {
    await prisma.exerciseOption.createMany({
      data: exercise.options.map(([text, value, isCorrect], index) => ({
        exerciseId: saved.id,
        text,
        value,
        isCorrect,
        order: index + 1
      }))
    });
  }

  return saved;
}

async function main() {
  const [lessons, allWords] = await Promise.all([
    prisma.lesson.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { title: "asc" }],
      include: {
        sentences: { orderBy: { id: "asc" } },
        vocabularyGroups: { include: { words: true } },
        exercises: { orderBy: { order: "asc" } }
      }
    }),
    prisma.word.findMany()
  ]);

  let createdOrUpdated = 0;
  for (const lesson of lessons) {
    const existingCount = lesson.exercises.length;
    const needed = Math.max(0, TARGET_EXERCISE_COUNT - existingCount);
    if (!needed) continue;

    const existingSlugs = new Set(lesson.exercises.map((exercise) => exercise.slug));
    const candidates = [...sentenceExercises(lesson), ...vocabularyExercises(lesson, allWords)]
      .filter((exercise) => exercise.options.length === 0 || exercise.options.length >= 2)
      .filter((exercise) => !existingSlugs.has(`supplement-${lesson.slug}-${exercise.key}`))
      .filter((exercise, index, list) => list.findIndex((candidate) => candidate.key === exercise.key) === index);

    const selected = candidates.slice(0, needed);
    let order = Math.max(0, ...lesson.exercises.map((exercise) => exercise.order || 0)) + 1;
    for (const exercise of selected) {
      await upsertExercise(lesson, lesson.topicId, exercise, order);
      order += 1;
      createdOrUpdated += 1;
    }
    console.log(`${lesson.slug}: ${existingCount} -> ${existingCount + selected.length}`);
  }

  console.log(`Supplemental lesson practice upserted: ${createdOrUpdated} exercises`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
