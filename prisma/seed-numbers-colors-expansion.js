const { PrismaClient, ExerciseType } = require("@prisma/client");
const { sentenceExercises, vocabularyExercises } = require("./seed-lesson-practice");

const prisma = new PrismaClient();
const TARGET_EXERCISE_COUNT = 16;

const numberColorWords = [
  ["uno", "one", "number", null, "Tengo uno.", "quantities-and-clear-colors:1"],
  ["dos", "two", "number", null, "Tengo dos manzanas.", "quantities-and-clear-colors:2"],
  ["tres", "three", "number", null, "Tengo tres libros.", "quantities-and-clear-colors:3"],
  ["cuatro", "four", "number", null, "Quiero cuatro uvas.", "quantities-and-clear-colors:4"],
  ["cinco", "five", "number", null, "Tengo cinco minutos.", "quantities-and-clear-colors:5"],
  ["seis", "six", "number", null, "Tengo seis uvas.", "quantities-and-clear-colors:11"],
  ["siete", "seven", "number", null, "Tengo siete libros.", "quantities-and-clear-colors:12"],
  ["ocho", "eight", "number", null, "Tengo ocho manzanas.", "quantities-and-clear-colors:13"],
  ["nueve", "nine", "number", null, "Quiero nueve fresas.", "quantities-and-clear-colors:14"],
  ["diez", "ten", "number", null, "Tengo diez minutos.", "quantities-and-clear-colors:10"],
  ["el color", "color", "noun", "masculine", "El color es azul.", "quantities-and-clear-colors:25"],
  ["rojo", "red", "adjective", "masculine", "El tomate es rojo.", "quantities-and-clear-colors:24"],
  ["roja", "red", "adjective", "feminine", "La manzana es roja.", "quantities-and-clear-colors:24"],
  ["azul", "blue", "adjective", null, "La camisa es azul.", "quantities-and-clear-colors:17"],
  ["verde", "green", "adjective", null, "La ensalada es verde.", "quantities-and-clear-colors:18"],
  ["amarillo", "yellow", "adjective", "masculine", "El plátano es amarillo.", "quantities-and-clear-colors:19"],
  ["amarilla", "yellow", "adjective", "feminine", "La camisa es amarilla.", "quantities-and-clear-colors:15"],
  ["blanco", "white", "adjective", "masculine", "El pan es blanco.", "quantities-and-clear-colors:20"],
  ["blanca", "white", "adjective", "feminine", "La camisa es blanca.", "quantities-and-clear-colors:22"],
  ["negro", "black", "adjective", "masculine", "El café es negro.", "quantities-and-clear-colors:21"],
  ["negra", "black", "adjective", "feminine", "La mochila es negra.", "quantities-and-clear-colors:23"]
];

function lessonInputs(orders) {
  return [
    {
      slug: "numbers-one-to-five",
      title: "Numbers One to Five",
      summary: "Count from one to five with familiar objects.",
      cefrLevel: "A1",
      theme: "Numbers",
      situation: "counting",
      imageKey: "quantities-and-clear-colors:5",
      topicSlug: "plural-agreement",
      vocabularySlugs: ["numbers-and-colors", "fruit-and-produce", "classroom-basics"],
      order: orders.numbersOne,
      estimatedMinutes: 7,
      sentences: [
        ["Tengo uno.", "I have one.", "Uno means one."],
        ["Tengo dos manzanas.", "I have two apples.", "Dos means two."],
        ["Tengo tres libros.", "I have three books.", "Tres means three."],
        ["Quiero cuatro uvas.", "I want four grapes.", "Cuatro means four."],
        ["Tengo cinco minutos.", "I have five minutes.", "Cinco means five."]
      ]
    },
    {
      slug: "numbers-six-to-ten",
      title: "Numbers Six to Ten",
      summary: "Finish the first counting set so you can count from one to ten.",
      cefrLevel: "A1",
      theme: "Numbers",
      situation: "counting",
      imageKey: "quantities-and-clear-colors:10",
      topicSlug: "plural-agreement",
      vocabularySlugs: ["numbers-and-colors", "fruit-and-produce", "classroom-basics"],
      order: orders.numbersSix,
      estimatedMinutes: 7,
      sentences: [
        ["Tengo seis uvas.", "I have six grapes.", "Seis means six."],
        ["Tengo siete libros.", "I have seven books.", "Siete means seven."],
        ["Tengo ocho manzanas.", "I have eight apples.", "Ocho means eight."],
        ["Quiero nueve fresas.", "I want nine strawberries.", "Nueve means nine."],
        ["Tengo diez minutos.", "I have ten minutes.", "Diez means ten."]
      ]
    },
    {
      slug: "color-words-basics",
      title: "Basic Color Words",
      summary: "Name the core colors before describing real objects.",
      cefrLevel: "A1",
      theme: "Descriptions",
      situation: "naming colors",
      imageKey: "quantities-and-clear-colors:16",
      topicSlug: "articles-gender",
      vocabularySlugs: ["numbers-and-colors"],
      order: orders.colorBasics,
      estimatedMinutes: 7,
      sentences: [
        ["El color es rojo.", "The color is red.", "Rojo is the basic masculine form for red."],
        ["El color es azul.", "The color is blue.", "Azul does not change for masculine or feminine."],
        ["El color es verde.", "The color is green.", "Verde does not change for masculine or feminine."],
        ["El color es amarillo.", "The color is yellow.", "Amarillo is the basic masculine form for yellow."],
        ["El color es blanco.", "The color is white.", "Blanco is the basic masculine form for white."],
        ["El color es negro.", "The color is black.", "Negro is the basic masculine form for black."]
      ]
    },
    {
      slug: "colors-with-things",
      title: "Colors with Things",
      summary: "Use color words with masculine and feminine things.",
      cefrLevel: "A1",
      theme: "Descriptions",
      situation: "describing objects",
      imageKey: "quantities-and-clear-colors:25",
      topicSlug: "articles-gender",
      vocabularySlugs: ["numbers-and-colors", "fruit-and-produce", "clothing-basics", "home-and-objects"],
      order: orders.colorsWithThings,
      estimatedMinutes: 8,
      sentences: [
        ["La manzana es roja.", "The apple is red.", "Roja agrees with manzana."],
        ["El tomate es rojo.", "The tomato is red.", "Rojo agrees with tomate."],
        ["La camisa es azul.", "The shirt is blue.", "Azul works for masculine and feminine."],
        ["La ensalada es verde.", "The salad is green.", "Verde works for masculine and feminine."],
        ["El plátano es amarillo.", "The banana is yellow.", "Amarillo agrees with plátano."],
        ["La camisa es blanca.", "The shirt is white.", "Blanca agrees with camisa."],
        ["La mochila es negra.", "The backpack is black.", "Negra agrees with mochila."]
      ]
    }
  ];
}

async function upsertGroupWord(groupId, [spanish, english, partOfSpeech, gender, example, imageKey]) {
  const existing = await prisma.word.findFirst({ where: { groupId, spanish } });
  const data = { groupId, spanish, english, partOfSpeech, gender, example, imageKey: imageKey || null };
  if (existing) return prisma.word.update({ where: { id: existing.id }, data });
  return prisma.word.create({ data });
}

async function upsertLesson(lesson, topicBySlug, groupBySlug) {
  const topic = topicBySlug.get(lesson.topicSlug);
  if (!topic) throw new Error(`Missing topic ${lesson.topicSlug}`);
  const groups = lesson.vocabularySlugs.map((slug) => {
    const group = groupBySlug.get(slug);
    if (!group) throw new Error(`Missing vocabulary group ${slug}`);
    return { id: group.id };
  });

  const data = {
    title: lesson.title,
    summary: lesson.summary,
    cefrLevel: lesson.cefrLevel,
    theme: lesson.theme,
    situation: lesson.situation,
    imageKey: lesson.imageKey || null,
    outcomesJson: [
      `You can use ${lesson.title.toLowerCase()} in simple A1 sentences.`,
      "You can answer before looking at the model answer.",
      "You can connect the words to familiar objects."
    ],
    conceptKeys: [lesson.topicSlug, lesson.theme.toLowerCase(), "a1"],
    reviewSummary: `You practiced ${lesson.summary.toLowerCase()}`,
    order: lesson.order,
    estimatedMinutes: lesson.estimatedMinutes,
    topicId: topic.id,
    vocabularyGroups: { set: groups }
  };

  const savedLesson = await prisma.lesson.upsert({
    where: { slug: lesson.slug },
    update: data,
    create: {
      slug: lesson.slug,
      ...data,
      vocabularyGroups: { connect: groups }
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

  return savedLesson;
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
}

async function rebuildSupplementalPractice(slugs) {
  const [lessons, allWords] = await Promise.all([
    prisma.lesson.findMany({
      where: { slug: { in: slugs } },
      include: {
        sentences: { orderBy: { id: "asc" } },
        vocabularyGroups: { include: { words: true } },
        exercises: { orderBy: { order: "asc" } }
      }
    }),
    prisma.word.findMany()
  ]);

  for (const lesson of lessons) {
    const supplementPrefix = `supplement-${lesson.slug}-`;
    const candidates = [...sentenceExercises(lesson), ...vocabularyExercises(lesson, allWords)]
      .filter((exercise) => exercise.options.length === 0 || exercise.options.length >= 2)
      .filter((exercise, index, list) => list.findIndex((candidate) => candidate.key === exercise.key) === index)
      .slice(0, TARGET_EXERCISE_COUNT);
    const validSlugs = new Set(candidates.map((exercise) => `${supplementPrefix}${exercise.key}`));
    const stale = lesson.exercises.filter((exercise) => exercise.slug.startsWith(supplementPrefix) && !validSlugs.has(exercise.slug));
    if (stale.length) {
      await prisma.exercise.deleteMany({ where: { id: { in: stale.map((exercise) => exercise.id) } } });
    }

    for (const [index, exercise] of candidates.entries()) {
      await upsertExercise(lesson, lesson.topicId, exercise, index + 1);
    }
    console.log(`${lesson.slug}: ${candidates.length} supplemental exercises`);
  }
}

async function main() {
  const [topics, groups, numbersLesson] = await Promise.all([
    prisma.grammarTopic.findMany(),
    prisma.vocabularyGroup.findMany(),
    prisma.lesson.findUnique({ where: { slug: "numbers-one-to-five" } })
  ]);
  const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  const numbersGroup = groupBySlug.get("numbers-and-colors");
  if (!numbersGroup) throw new Error("Missing numbers-and-colors vocabulary group.");

  for (const word of numberColorWords) {
    await upsertGroupWord(numbersGroup.id, word);
  }

  const baseOrder = numbersLesson?.order || 460;
  const largeOrderSpacing = baseOrder >= 100;
  const orders = {
    numbersOne: baseOrder,
    numbersSix: baseOrder + (largeOrderSpacing ? 5 : 1),
    colorBasics: baseOrder + (largeOrderSpacing ? 10 : 2),
    colorsWithThings: baseOrder + (largeOrderSpacing ? 15 : 3),
    parkNature: baseOrder + (largeOrderSpacing ? 20 : 4),
    weatherOutside: baseOrder + (largeOrderSpacing ? 30 : 5),
    finalCheckpoint: baseOrder + (largeOrderSpacing ? 35 : 6)
  };

  const lessons = lessonInputs(orders);
  for (const lesson of lessons) {
    await upsertLesson(lesson, topicBySlug, groupBySlug);
  }

  await Promise.all([
    prisma.lesson.updateMany({ where: { slug: "park-nature-words" }, data: { order: orders.parkNature } }),
    prisma.lesson.updateMany({ where: { slug: "weather-outside" }, data: { order: orders.weatherOutside } }),
    prisma.lesson.updateMany({ where: { slug: "checkpoint-a1-foundations" }, data: { order: orders.finalCheckpoint } })
  ]);

  await rebuildSupplementalPractice(lessons.map((lesson) => lesson.slug));
  console.log("Numbers and colors expansion seeded.");
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
