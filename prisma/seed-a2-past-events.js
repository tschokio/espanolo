const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a2-past-time-and-ar-preterite", title: "Yesterday: Regular -ar Events", order: 780, imageKey: "past-events:1",
    summary: "Use clear past-time markers with completed regular -ar actions.", situation: "saying what happened yesterday",
    sentences: [
      ["Ayer trabajé en casa.", "Yesterday I worked at home.", "The yo preterite of regular -ar verbs ends in -é."],
      ["Anoche estudié español.", "Last night I studied Spanish.", "Anoche places the completed action in the past."],
      ["Ana habló con su amiga.", "Ana spoke with her friend.", "The él/ella form of a regular -ar verb ends in -ó."],
      ["El sábado visitamos el museo.", "On Saturday we visited the museum.", "The nosotros preterite of -ar verbs ends in -amos, like the present; context clarifies the time."],
      ["Después compraron café.", "Afterwards they bought coffee.", "The ellos/ellas preterite ending is -aron."]
    ]
  },
  {
    slug: "a2-regular-er-ir-preterite", title: "Completed -er and -ir Events", order: 790, imageKey: "past-events:7",
    summary: "Use the shared regular preterite endings for -er and -ir verbs.", situation: "reporting completed food, travel, and communication actions",
    sentences: [
      ["Ayer comí en el café.", "Yesterday I ate at the café.", "Regular yo forms of -er and -ir verbs end in -í."],
      ["Luis bebió agua.", "Luis drank water.", "The él/ella preterite ending is -ió."],
      ["Vivimos en Madrid dos años.", "We lived in Madrid for two years.", "The completed period makes vivimos a past event here."],
      ["Escribieron un mensaje.", "They wrote a message.", "Regular plural -er/-ir preterite forms end in -ieron."],
      ["Abrí la puerta y entré.", "I opened the door and went in.", "Two completed actions can be linked with y."]
    ]
  },
  {
    slug: "a2-essential-irregular-preterite", title: "Essential Irregular Past Events", order: 800, imageKey: "past-events:6",
    summary: "Learn fui, hice, tuve, and estuve as high-frequency completed-event chunks.", situation: "telling a short story about yesterday",
    sentences: [
      ["Ayer fui al mercado.", "Yesterday I went to the market.", "Fui is the yo preterite of ir."],
      ["Después hice la cena.", "Afterwards I made dinner.", "Hice is the yo preterite of hacer."],
      ["Tuve un problema con el coche.", "I had a problem with the car.", "Tuve presents the problem as a completed past event."],
      ["Estuve en casa por la tarde.", "I was at home in the afternoon.", "Estuve presents a bounded stay or state."],
      ["Ana fue a la estación y tomó el tren.", "Ana went to the station and took the train.", "Fue is the él/ella form of ir in the preterite."]
    ]
  },
  {
    slug: "a2-imperfect-background", title: "Background with the Imperfect", order: 810, imageKey: "past-events:4",
    summary: "Use the imperfect for background, repeated past habits, and ongoing states.", situation: "describing how things used to be",
    sentences: [
      ["Cuando era niño, vivía en un pueblo.", "When I was a child, I lived in a village.", "Era and vivía describe background and an ongoing past situation."],
      ["Siempre caminaba al colegio.", "I always walked to school.", "Siempre plus imperfect describes a repeated past habit."],
      ["Ana estaba cansada.", "Ana was tired.", "Estaba describes the state in the background."],
      ["Teníamos un perro pequeño.", "We had a small dog.", "Teníamos describes an ongoing past possession."],
      ["Hacía frío y llovía.", "It was cold and it was raining.", "Weather commonly forms the background with the imperfect."]
    ]
  },
  {
    slug: "a2-event-and-background", title: "Event and Background Together", order: 820, imageKey: "past-events:9",
    summary: "Combine imperfect background with completed preterite events.", situation: "building a clear two-part past story",
    sentences: [
      ["Caminaba por el parque cuando empezó a llover.", "I was walking through the park when it started to rain.", "Caminaba is the ongoing background; empezó is the completed event."],
      ["Estaba en casa cuando llamó Ana.", "I was at home when Ana called.", "Estaba sets the scene; llamó moves the story forward."],
      ["Mientras estudiaba, sonó el teléfono.", "While I was studying, the phone rang.", "Mientras often introduces the ongoing background."],
      ["Hacía sol cuando salimos del hotel.", "It was sunny when we left the hotel.", "Weather is background; salimos is the bounded event."],
      ["Ayer fui al mercado y compré fruta.", "Yesterday I went to the market and bought fruit.", "A sequence of completed events uses the preterite."]
    ]
  },
  {
    slug: "checkpoint-a2-past-events", title: "A2.7 Past Events Checkpoint", order: 830, imageKey: "past-events:16",
    summary: "Check regular and irregular completed events, background, habits, and event contrast.", situation: "telling a short past story", checkpoint: true,
    sentences: [
      ["Ayer trabajé en casa.", "Yesterday I worked at home.", "A completed regular -ar event."],
      ["Ayer fui al mercado.", "Yesterday I went to the market.", "An essential irregular completed event."],
      ["Cuando era niño, vivía en un pueblo.", "When I was a child, I lived in a village.", "Imperfect background and past habit."],
      ["Estaba en casa cuando llamó Ana.", "I was at home when Ana called.", "Background plus completed event."],
      ["Mientras estudiaba, sonó el teléfono.", "While I was studying, the phone rang.", "Ongoing action interrupted by an event."]
    ]
  }
];

const tokenize = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`]; };

function checksFor(input) {
  return [
    { key: "choose-time-meaning", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: [[input.sentences[0][0], input.sentences[0][0], true], [input.sentences[1][0], input.sentences[1][0], false], [input.sentences[2][0], input.sentences[2][0], false]] },
    { key: "build-past-model", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokenize(input.sentences[1][0]) },
    { key: "translate-past-model", type: ExerciseType.TRANSLATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "recall-past-model", type: ExerciseType.SHORT_ANSWER, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords ? { correctWords: check.correctWords, goal: "past_word_order" } : { correct: check.correct, accepted: accepted(check.correct), goal: "past_event_production" };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the matching past sentence" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the past sentence" : "Recall the past model", instruction: "Use the time meaning and the completed-event or background pattern from this lesson.", questionText: check.question, answerJson, explanation: "Choose tense and form from the meaning: completed event, ongoing background, or repeated past habit.", difficulty: 2, order, xpReward: 12, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "past-events-foundation" }, update: { title: "Past Events Foundation", description: "Completed events, past background, habits, and their contrast.", cefrLevel: "A2", imageKey: "past-events:1" }, create: { slug: "past-events-foundation", title: "Past Events Foundation", description: "Completed events, past background, habits, and their contrast.", cefrLevel: "A2", imageKey: "past-events:1" } });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["daily-actions", "travel-and-survival", "weather-and-time", "home-and-objects", "essential-words"] } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  for (const input of lessons) {
    const groupSlugs = input.slug.includes("background") || input.slug.includes("event-and") ? ["daily-actions", "weather-and-time", "home-and-objects"] : ["daily-actions", "travel-and-survival", "essential-words"];
    const common = { title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Past Events", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can distinguish a completed event from background information.", "You can produce the lesson's high-frequency past forms.", "You can connect past actions into a short meaningful account."], conceptKeys: ["a2", "past-events", input.slug.includes("imperfect") ? "imperfect" : "preterite"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 13 : 10, topicId: topic.id };
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id })) } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const checks = checksFor(input);
    for (let index = 0; index < checks.length; index += 1) await saveExercise(lesson, checks[index], index + 1);
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} A2.7 past-event learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
