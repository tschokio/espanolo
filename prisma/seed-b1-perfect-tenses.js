const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-present-perfect-meaning", title: "Connect the Past to Now", order: 1080, imageKey: "past-events:11",
    summary: "Use the present perfect for experiences and past events viewed inside a still-relevant time period.", situation: "talking about today and life experience",
    sentences: [
      ["Hoy he trabajado desde casa.", "Today I have worked from home.", "Hoy is still open, so the event is viewed inside the current period."],
      ["Esta semana hemos hablado tres veces.", "This week we have spoken three times.", "The current week connects the completed conversations to now."],
      ["¿Has estado alguna vez en Sevilla?", "Have you ever been to Seville?", "The question asks about experience up to the present."],
      ["Ayer trabajé desde casa.", "Yesterday I worked from home.", "Ayer is a closed period and naturally uses the preterite."],
      ["En muchos países americanos también se usa el pretérito para hechos recientes.", "In many American countries the preterite is also used for recent events.", "Regional usage differs; comprehension should allow both perspectives."]
    ]
  },
  {
    slug: "b1-regular-participles", title: "Build the Present Perfect", order: 1090, imageKey: "grammar-scenes:11",
    summary: "Combine the present forms of haber with an invariant past participle.", situation: "reporting completed actions",
    sentences: [
      ["He hablado con Ana.", "I have spoken with Ana.", "The yo form is he plus hablado."],
      ["Has comido muy poco.", "You have eaten very little.", "The tú form is has plus comido."],
      ["Hemos vivido aquí durante un año.", "We have lived here for a year.", "The nosotros form is hemos plus vivido."],
      ["Han terminado el proyecto.", "They have finished the project.", "The ellos form is han plus terminado."],
      ["Las cartas han llegado.", "The letters have arrived.", "With haber, the participle does not change to match the subject or object."]
    ]
  },
  {
    slug: "b1-irregular-participles", title: "Use Essential Irregular Participles", order: 1100, imageKey: "irregular-verbs:11",
    summary: "Learn frequent irregular participles inside meaningful complete sentences.", situation: "sharing news and completed results",
    sentences: [
      ["He hecho la reserva.", "I have made the reservation.", "Hacer uses the irregular participle hecho."],
      ["¿Has visto mi mensaje?", "Have you seen my message?", "Ver uses visto."],
      ["Marta ha vuelto a casa.", "Marta has returned home.", "Volver uses vuelto."],
      ["Hemos escrito tres correos.", "We have written three emails.", "Escribir uses escrito."],
      ["La tienda ha abierto tarde.", "The store has opened late.", "Abrir uses abierto."]
    ]
  },
  {
    slug: "b1-perfect-time-markers", title: "Use Ya, Todavía, Nunca, and Alguna Vez", order: 1110, imageKey: "weather-and-time:9",
    summary: "Place common time markers around the perfect to express completion, absence, and experience.", situation: "checking what has happened so far",
    sentences: [
      ["Ya he terminado.", "I have already finished.", "Ya presents the expected action as complete."],
      ["Todavía no he comido.", "I have not eaten yet.", "Todavía no presents an expected action as incomplete up to now."],
      ["Nunca hemos visitado Chile.", "We have never visited Chile.", "Nunca summarizes experience up to the present."],
      ["¿Has probado alguna vez la paella?", "Have you ever tried paella?", "Alguna vez asks whether an experience has occurred at any time."],
      ["Últimamente he dormido poco.", "Lately I have slept little.", "Últimamente creates a recent period connected to now."]
    ]
  },
  {
    slug: "b1-past-perfect", title: "Show What Had Happened Earlier", order: 1120, imageKey: "past-events:15",
    summary: "Use había plus participle for an event completed before another past reference point.", situation: "explaining an earlier cause",
    sentences: [
      ["Cuando llegué, Ana ya había salido.", "When I arrived, Ana had already left.", "Había salido happened before llegué."],
      ["No pude entrar porque había perdido la llave.", "I could not enter because I had lost the key.", "The earlier loss explains the later problem."],
      ["Nunca habíamos visto tanta nieve.", "We had never seen so much snow.", "The experience is measured up to a point in the past."],
      ["Ellos habían terminado antes de las ocho.", "They had finished before eight.", "Habían marks the plural subject; terminado remains invariant."],
      ["Después de que habíamos comido, fuimos al museo.", "After we had eaten, we went to the museum.", "The perfect makes the earlier event explicit before the story continues."]
    ]
  },
  {
    slug: "checkpoint-b1-perfect-tenses", title: "B1.5 Perfect Tenses Checkpoint", order: 1130, imageKey: "past-events:16",
    summary: "Check present relevance, participles, time markers, regional variation, and past-before-past order.", situation: "explaining recent and earlier events", checkpoint: true,
    sentences: [
      ["Esta mañana he hablado con el médico.", "This morning I have spoken with the doctor.", "The speaker treats this morning as connected to the current day."],
      ["Todavía no me ha respondido.", "He has not replied to me yet.", "Todavía no keeps the expected reply open."],
      ["Ayer fui a la farmacia.", "Yesterday I went to the pharmacy.", "The closed time period ayer uses the preterite."],
      ["Cuando llegué, ya habían cerrado.", "When I arrived, they had already closed.", "The closing happened before arrival."],
      ["Por suerte, había escrito la dirección.", "Luckily, I had written down the address.", "The earlier action helped in the later situation."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`];
};

function checks(input) {
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "produce", type: ExerciseType.SHORT_ANSWER, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "connect", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "perfect_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "perfect_time_perspective", rubric: "Choose the tense from the time perspective, keep haber next to the participle, and preserve any time marker." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Connect past events to a reference point", instruction: "Decide whether the time period is still connected to now, closed in the past, or earlier than another past event.", questionText: check.question, answerJson, explanation: "Perfect forms become meaningful when tied to a reference point: now for the present perfect and another past moment for the past perfect.", difficulty: 4, order, xpReward: 15, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "perfect-past-connections" }, update: { title: "Perfect Tenses and Past Connections", description: "Present relevance, regular and irregular participles, time markers, regional variation, and past-before-past order.", cefrLevel: "B1", imageKey: "past-events:11" }, create: { slug: "perfect-past-connections", title: "Perfect Tenses and Past Connections", description: "Present relevance, regular and irregular participles, time markers, regional variation, and past-before-past order.", cefrLevel: "B1", imageKey: "past-events:11" } });
  const groupSlugs = ["daily-actions", "weather-and-time", "essential-words", "useful-phrases", "b1-conversation-stories", "b1-plans-reactions"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B1.5 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Perfect Tenses", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can connect a past event to the present reference period.", "You can build regular and frequent irregular participles with haber.", "You can show that one event happened before another past event."], conceptKeys: ["b1", "perfect", "participles", "time-perspective"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 16 : 12, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B1.5 perfect tense packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
