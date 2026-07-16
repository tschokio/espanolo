const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-para-goal-purpose", title: "Use Para for Destination and Purpose", order: 1260, imageKey: "travel-and-survival:14",
    summary: "Use para when something points toward a destination, goal, or intended purpose.", situation: "explaining where and why you are going",
    sentences: [
      ["Salgo para Madrid mañana.", "I leave for Madrid tomorrow.", "Para points toward the destination Madrid."],
      ["Estudio español para viajar.", "I study Spanish in order to travel.", "Para plus infinitive states the purpose of the first action."],
      ["Necesito una mesa para trabajar.", "I need a table to work at.", "The table has an intended use."],
      ["Este tren va para Sevilla.", "This train is going to Seville.", "Para marks the train's destination."],
      ["Ahorro dinero para comprar una bicicleta.", "I save money in order to buy a bicycle.", "The later purchase is the goal of saving."]
    ]
  },
  {
    slug: "b1-para-recipient-deadline", title: "Use Para for Recipient, Deadline, and Viewpoint", order: 1270, imageKey: "weather-and-time:10",
    summary: "Recognize the person something is intended for, a target deadline, and a viewpoint frame.", situation: "organizing tasks and expectations",
    sentences: [
      ["Este regalo es para Ana.", "This gift is for Ana.", "Ana is the intended recipient."],
      ["Necesito el informe para el viernes.", "I need the report by Friday.", "Friday is the target deadline."],
      ["Para mí, esta opción es mejor.", "For me, this option is better.", "Para mí introduces a personal viewpoint."],
      ["La tarea es difícil para los principiantes.", "The task is difficult for beginners.", "The judgment is relative to a group."],
      ["Trabajo para una empresa pequeña.", "I work for a small company.", "The company is the organization that receives the work."]
    ]
  },
  {
    slug: "b1-por-cause-exchange", title: "Use Por for Cause and Exchange", order: 1280, imageKey: "object-pronouns-and-shopping:14",
    summary: "Use por when you look backward to a reason or exchange one thing for another.", situation: "explaining reasons, thanks, and prices",
    sentences: [
      ["No salimos por la lluvia.", "We did not go out because of the rain.", "Por introduces the cause that prevented the action."],
      ["Gracias por tu ayuda.", "Thank you for your help.", "The help is the reason for the thanks."],
      ["Pagué veinte euros por el libro.", "I paid twenty euros for the book.", "Money is exchanged for the book."],
      ["Cambio mi café por un té.", "I exchange my coffee for a tea.", "One item is exchanged for another."],
      ["Lo hice por ti.", "I did it because of you.", "The person is presented as the motivation or reason."]
    ]
  },
  {
    slug: "b1-por-route-duration", title: "Use Por for Route, Duration, and Means", order: 1290, imageKey: "city-transport:9",
    summary: "Use por for movement through a place, approximate duration, communication means, and rate.", situation: "describing how an action happens",
    sentences: [
      ["Caminamos por el parque.", "We walk through the park.", "Por presents the park as the route or area crossed."],
      ["Estudié por dos horas.", "I studied for two hours.", "Por can express an approximate duration, especially in American Spanish."],
      ["Te llamo por teléfono.", "I call you by phone.", "Por introduces the means of communication."],
      ["Voy al centro dos veces por semana.", "I go downtown twice per week.", "Por expresses a rate or frequency."],
      ["Enviamos el documento por correo.", "We send the document by mail.", "Por identifies the channel or means."]
    ]
  },
  {
    slug: "b1-por-para-contrast", title: "Choose Por or Para from the Relationship", order: 1300, imageKey: "grammar-scenes:14",
    summary: "Contrast backward-looking cause or path with forward-looking goal, recipient, and deadline.", situation: "making the meaning relationship explicit",
    sentences: [
      ["Trabajo para ganar dinero.", "I work in order to earn money.", "The money is the goal, so para looks forward."],
      ["Trabajo por necesidad.", "I work out of necessity.", "Necessity is the cause, so por looks backward."],
      ["Este autobús pasa por el centro y va para el aeropuerto.", "This bus passes through downtown and goes to the airport.", "Por marks the route; para marks the destination."],
      ["Compré flores para Marta por diez euros.", "I bought flowers for Marta for ten euros.", "Marta is the recipient; ten euros is the exchange value."],
      ["Gracias por venir para ayudarme.", "Thank you for coming to help me.", "Por gives the reason for thanks; para gives the purpose of coming."]
    ]
  },
  {
    slug: "checkpoint-b1-por-para", title: "B1.8 Por and Para Checkpoint", order: 1310, imageKey: "directions-and-question-intents:16",
    summary: "Check destination, purpose, recipient, deadline, cause, exchange, route, duration, means, and contrast.", situation: "explaining a practical trip and its purpose", checkpoint: true,
    sentences: [
      ["Viajo para Barcelona por trabajo.", "I am traveling to Barcelona for work.", "Para marks destination; por marks the reason."],
      ["Necesito llegar para las ocho.", "I need to arrive by eight.", "The time is a deadline."],
      ["Voy por la carretera del norte.", "I am going via the northern road.", "The road is the route."],
      ["He comprado un regalo para mi compañera.", "I have bought a gift for my colleague.", "The colleague is the intended recipient."],
      ["Gracias por organizar el viaje.", "Thank you for organizing the trip.", "The action is the reason for the thanks."]
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
    { key: "explain", type: ExerciseType.SHORT_ANSWER, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "apply", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "por_para_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "por_para_relationship", rubric: "Choose por or para from the relationship: cause/path/exchange versus goal/destination/recipient/deadline." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Make the relationship clear with por or para", instruction: "Name the relationship first: cause, path, exchange, means, goal, destination, recipient, or deadline.", questionText: check.question, answerJson, explanation: "Por and para are reliable when selected from the relationship between ideas rather than translated from one German or English preposition.", difficulty: 4, order, xpReward: 15, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "por-para-relationships" }, update: { title: "Por and Para by Relationship", description: "Goal, destination, recipient, deadline, cause, exchange, route, duration, means, and rate.", cefrLevel: "B1", imageKey: "travel-and-survival:14" }, create: { slug: "por-para-relationships", title: "Por and Para by Relationship", description: "Goal, destination, recipient, deadline, cause, exchange, route, duration, means, and rate.", cefrLevel: "B1", imageKey: "travel-and-survival:14" } });
  const groupSlugs = ["city-transport", "weather-and-time", "essential-words", "useful-phrases", "b1-conversation-stories", "b1-plans-reactions"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B1.8 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Por and Para", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can use para for goals, destinations, recipients, and deadlines.", "You can use por for causes, routes, exchanges, means, and rates.", "You can explain the relationship that determines por or para."], conceptKeys: ["b1", "por", "para", "meaning-relationships"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 16 : 12, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B1.8 por/para learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
