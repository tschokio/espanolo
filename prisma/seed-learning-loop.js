const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const usefulWords = [
  ["hola", "hello", "phrase", null, "Hola, soy Ana.", null],
  ["me llamo", "my name is", "phrase", null, "Hola, me llamo Ana.", "people-and-family:1"],
  ["soy de", "I am from", "phrase", null, "Soy de Austria.", "travel-and-survival:5"]
];

const lesson = {
  slug: "intro-greetings-pronouns-ser",
  title: "Greetings, Pronouns, and SER",
  summary: "Say hello, use yo, and introduce yourself with soy and me llamo.",
  cefrLevel: "A1",
  theme: "Self-introduction",
  situation: "meeting someone",
  imageKey: "people-and-family:1",
  topicSlug: "absolute-basics",
  vocabularySlugs: ["people-and-pronouns", "useful-phrases"],
  order: 0,
  estimatedMinutes: 8,
  outcomesJson: [
    "You can introduce yourself.",
    "You can say where you are from.",
    "You can recognize when soy is used for identity."
  ],
  conceptKeys: ["greetings", "pronouns", "ser-identity", "self-introduction"],
  reviewSummary: "You practiced hello, yo, soy, me llamo, and soy de for a simple introduction.",
  sentences: [
    ["Hola.", "Hello.", "Use hola to start a simple greeting."],
    ["Yo soy Ana.", "I am Ana.", "Use soy for identity, names, and roles."],
    ["Me llamo Ana.", "My name is Ana.", "Me llamo is the natural phrase for giving your name."],
    ["Soy de Austria.", "I am from Austria.", "Origin uses soy because it is part of identity."]
  ]
};

const exercises = [
  {
    slug: "intro-hola-means-hello",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Greeting.",
    instruction: "Choose the meaning.",
    questionText: "hola",
    answerJson: { correct: "hello", accepted: ["hello", "hi"], goal: "vocabulary_recognition" },
    explanation: "Hola means hello. It is the easiest way to start a greeting.",
    difficulty: 1,
    order: 1,
    xpReward: 8,
    imageKey: "people-and-family:1",
    options: [["hello", "hello", true], ["thank you", "thank you", false], ["goodbye", "goodbye", false]]
  },
  {
    slug: "intro-yo-soy-name",
    type: ExerciseType.CLOZE,
    prompt: "Identity with SER.",
    instruction: "Use soy for I am plus a name.",
    questionText: "Yo ____ Ana.",
    answerJson: {
      correct: "soy",
      accepted: ["soy"],
      goal: "ser_identity",
      errorHints: { ser_estar: "Use soy here because a name is identity. Correct: Yo soy Ana." }
    },
    explanation: "Use soy for identity: Yo soy Ana.",
    difficulty: 1,
    order: 2,
    xpReward: 10,
    imageKey: "grammar-scenes:1",
    options: [["soy", "soy", true], ["estoy", "estoy", false], ["es", "es", false]]
  },
  {
    slug: "intro-me-llamo-ana",
    type: ExerciseType.TRANSLATION,
    prompt: "Introduce your name.",
    instruction: "Type the Spanish phrase.",
    questionText: "My name is Ana.",
    answerJson: {
      correct: "Me llamo Ana.",
      accepted: ["me llamo ana", "me llamo ana."],
      alternatives: [{ answer: "Soy Ana.", note: "Soy Ana is also a natural short introduction." }],
      goal: "active_production"
    },
    explanation: "Me llamo Ana is the natural Spanish phrase for My name is Ana.",
    difficulty: 2,
    order: 3,
    xpReward: 14,
    imageKey: "people-and-family:1",
    options: []
  },
  {
    slug: "intro-build-hola-soy-ana",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build an introduction.",
    instruction: "Put the words in order.",
    questionText: "Hello, I am Ana.",
    answerJson: { correctWords: ["Hola", ",", "soy", "Ana", "."], goal: "word_order" },
    explanation: "A simple introduction can be Hola, soy Ana.",
    difficulty: 1,
    order: 4,
    xpReward: 14,
    imageKey: "people-and-family:1",
    options: [["Hola", "Hola", false], [",", ",", false], ["soy", "soy", false], ["Ana", "Ana", false], [".", ".", false]]
  },
  {
    slug: "intro-soy-de-austria",
    type: ExerciseType.TRANSLATION,
    prompt: "Say origin.",
    instruction: "Type the Spanish sentence.",
    questionText: "I am from Austria.",
    answerJson: {
      correct: "Soy de Austria.",
      accepted: ["soy de austria", "soy de austria."],
      goal: "ser_origin",
      errorHints: { ser_estar: "Use soy for origin. Correct: Soy de Austria. Estoy de Austria is not used." }
    },
    explanation: "Use soy de for origin: Soy de Austria.",
    difficulty: 2,
    order: 5,
    xpReward: 16,
    imageKey: "travel-and-survival:5",
    options: []
  },
  {
    slug: "intro-correct-estoy-de-austria",
    type: ExerciseType.ERROR_CORRECTION,
    prompt: "Fix the mistake.",
    instruction: "Rewrite the sentence correctly.",
    questionText: "Estoy de Austria.",
    answerJson: {
      correct: "Soy de Austria.",
      accepted: ["soy de austria", "soy de austria."],
      goal: "mistake_correction",
      errorHints: { ser_estar: "Origin uses ser, not estar. Correct: Soy de Austria." }
    },
    explanation: "Use ser for origin. Soy de Austria is correct.",
    difficulty: 2,
    order: 6,
    xpReward: 16,
    imageKey: "grammar-scenes:1",
    options: []
  },
  {
    slug: "intro-scenario-cafe-greeting",
    type: ExerciseType.TRANSLATION,
    prompt: "Scenario response.",
    instruction: "You meet someone. Say hello and give your name.",
    questionText: "Say: Hello, my name is Ana.",
    answerJson: {
      correct: "Hola, me llamo Ana.",
      accepted: ["hola me llamo ana", "hola, me llamo ana", "hola me llamo ana.", "hola, me llamo ana."],
      alternatives: [{ answer: "Hola, soy Ana.", note: "Hola, soy Ana is also a valid short introduction." }],
      goal: "scenario_response"
    },
    explanation: "Hola, me llamo Ana is a complete practical introduction.",
    difficulty: 2,
    order: 7,
    xpReward: 18,
    imageKey: "people-and-family:1",
    options: []
  }
];

async function upsertWord(groupId, [spanish, english, partOfSpeech, gender, example, imageKey]) {
  const existing = await prisma.word.findFirst({ where: { groupId, spanish } });
  const data = { groupId, spanish, english, partOfSpeech, gender, example, imageKey };
  if (existing) return prisma.word.update({ where: { id: existing.id }, data });
  return prisma.word.create({ data });
}

async function main() {
  const topic = await prisma.grammarTopic.findUnique({ where: { slug: lesson.topicSlug } });
  if (!topic) throw new Error(`Missing topic ${lesson.topicSlug}. Run the base seed first.`);

  const vocabularyGroups = await prisma.vocabularyGroup.findMany({
    where: { slug: { in: lesson.vocabularySlugs } }
  });
  const groupBySlug = new Map(vocabularyGroups.map((group) => [group.slug, group]));
  const usefulGroup = groupBySlug.get("useful-phrases");
  if (!usefulGroup) throw new Error("Missing useful-phrases vocabulary group. Run the base seed first.");

  for (const word of usefulWords) {
    await upsertWord(usefulGroup.id, word);
  }

  const savedLesson = await prisma.lesson.upsert({
    where: { slug: lesson.slug },
    update: {
      title: lesson.title,
      summary: lesson.summary,
      cefrLevel: lesson.cefrLevel,
      theme: lesson.theme,
      situation: lesson.situation,
      imageKey: lesson.imageKey,
      outcomesJson: lesson.outcomesJson,
      conceptKeys: lesson.conceptKeys,
      reviewSummary: lesson.reviewSummary,
      order: lesson.order,
      estimatedMinutes: lesson.estimatedMinutes,
      topicId: topic.id,
      vocabularyGroups: {
        set: lesson.vocabularySlugs.map((slug) => ({ id: groupBySlug.get(slug).id }))
      }
    },
    create: {
      slug: lesson.slug,
      title: lesson.title,
      summary: lesson.summary,
      cefrLevel: lesson.cefrLevel,
      theme: lesson.theme,
      situation: lesson.situation,
      imageKey: lesson.imageKey,
      outcomesJson: lesson.outcomesJson,
      conceptKeys: lesson.conceptKeys,
      reviewSummary: lesson.reviewSummary,
      order: lesson.order,
      estimatedMinutes: lesson.estimatedMinutes,
      topicId: topic.id,
      vocabularyGroups: {
        connect: lesson.vocabularySlugs.map((slug) => ({ id: groupBySlug.get(slug).id }))
      }
    }
  });

  await prisma.sentence.deleteMany({ where: { lessonId: savedLesson.id } });
  await prisma.sentence.createMany({
    data: lesson.sentences.map(([spanish, english, note]) => ({
      lessonId: savedLesson.id,
      topicId: topic.id,
      spanish,
      english,
      note
    }))
  });

  for (const exercise of exercises) {
    const savedExercise = await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      update: {
        lessonId: savedLesson.id,
        topicId: topic.id,
        type: exercise.type,
        prompt: exercise.prompt,
        instruction: exercise.instruction,
        questionText: exercise.questionText,
        answerJson: exercise.answerJson,
        explanation: exercise.explanation,
        difficulty: exercise.difficulty,
        order: exercise.order,
        xpReward: exercise.xpReward,
        imageKey: exercise.imageKey
      },
      create: {
        slug: exercise.slug,
        lessonId: savedLesson.id,
        topicId: topic.id,
        type: exercise.type,
        prompt: exercise.prompt,
        instruction: exercise.instruction,
        questionText: exercise.questionText,
        answerJson: exercise.answerJson,
        explanation: exercise.explanation,
        difficulty: exercise.difficulty,
        order: exercise.order,
        xpReward: exercise.xpReward,
        imageKey: exercise.imageKey
      }
    });

    await prisma.exerciseOption.deleteMany({ where: { exerciseId: savedExercise.id } });
    if (exercise.options.length) {
      await prisma.exerciseOption.createMany({
        data: exercise.options.map(([text, value, isCorrect], index) => ({
          exerciseId: savedExercise.id,
          text,
          value,
          isCorrect,
          order: index + 1
        }))
      });
    }
  }

  console.log(`Upserted learning-loop module: ${lesson.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
