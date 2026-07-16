const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-future-intentions", title: "Choose How to Talk About the Future", order: 960, imageKey: "weather-and-time:12",
    summary: "Separate a present plan, an intention with ir a, and a prediction with the simple future.", situation: "planning the next few days",
    sentences: [
      ["Mañana trabajo desde casa.", "Tomorrow I work from home.", "The present tense can express a fixed or scheduled future event."],
      ["Esta tarde voy a llamar a Marta.", "This afternoon I am going to call Marta.", "Ir a plus infinitive presents a current intention."],
      ["El próximo año viajaré más.", "Next year I will travel more.", "The simple future is useful for predictions and less immediate plans."],
      ["La reunión empieza a las nueve.", "The meeting starts at nine.", "A timetable naturally uses the present tense."],
      ["Creo que todo saldrá bien.", "I think everything will turn out well.", "A prediction after creo que fits the simple future."]
    ]
  },
  {
    slug: "b1-regular-future", title: "Build the Regular Simple Future", order: 970, imageKey: "weather-and-time:4",
    summary: "Add one set of endings to the complete infinitive for -ar, -er, and -ir verbs.", situation: "making predictions and promises",
    sentences: [
      ["Mañana hablaré con la directora.", "Tomorrow I will speak with the director.", "The full infinitive hablar receives the ending -é."],
      ["Comeremos después de la reunión.", "We will eat after the meeting.", "All three verb groups use the same future endings."],
      ["Vivirán cerca del centro.", "They will live near downtown.", "The ending -án marks the third-person plural."],
      ["¿Estudiarás este fin de semana?", "Will you study this weekend?", "The tú form uses -ás."],
      ["Te escribiré cuando llegue.", "I will write to you when I arrive.", "The future presents the later main event."]
    ]
  },
  {
    slug: "b1-irregular-future", title: "Use Essential Irregular Future Stems", order: 980, imageKey: "irregular-verbs:12",
    summary: "Learn high-frequency future stems inside useful predictions and commitments.", situation: "talking about what will happen",
    sentences: [
      ["Tendré más tiempo mañana.", "I will have more time tomorrow.", "Tener uses the future stem tendr-."],
      ["Podremos terminar el proyecto.", "We will be able to finish the project.", "Poder uses podr-."],
      ["Ella vendrá después del trabajo.", "She will come after work.", "Venir uses vendr-."],
      ["Harán una reserva esta tarde.", "They will make a reservation this afternoon.", "Hacer uses har-."],
      ["Te diré la verdad.", "I will tell you the truth.", "Decir uses dir-." ]
    ]
  },
  {
    slug: "b1-future-probability", title: "Express Probability with the Future", order: 990, imageKey: "conversation-and-opinion:7",
    summary: "Use the future to make a careful guess about the present.", situation: "wondering what is happening now",
    sentences: [
      ["¿Dónde estará Ana ahora?", "Where could Ana be now?", "The future can frame uncertainty about a present situation."],
      ["Estará en casa.", "She is probably at home.", "Context makes this a guess, not a later event."],
      ["Serán las ocho, más o menos.", "It must be about eight o'clock.", "Serán estimates the current time."],
      ["Tendrá unos treinta años.", "He is probably about thirty years old.", "The future softens an estimate."],
      ["No responderá porque está ocupado.", "He is probably not answering because he is busy.", "The speaker offers a probable explanation."]
    ]
  },
  {
    slug: "b1-real-conditions", title: "Build Real Conditions with Si", order: 1000, imageKey: "weather-and-time:13",
    summary: "Connect a realistic condition to its present, future, or command result.", situation: "making practical plans",
    sentences: [
      ["Si llueve, me quedaré en casa.", "If it rains, I will stay home.", "A realistic present condition can lead to a future result."],
      ["Si tienes tiempo, llámame.", "If you have time, call me.", "The result can be a practical command."],
      ["Si termino temprano, voy a preparar la cena.", "If I finish early, I am going to prepare dinner.", "An intention can be conditional on a realistic event."],
      ["Si no entiendes, pregunta.", "If you do not understand, ask.", "The present condition plus command is direct and useful."],
      ["Podemos ir andando si hace buen tiempo.", "We can walk if the weather is good.", "The si clause may also follow the result."]
    ]
  },
  {
    slug: "checkpoint-b1-future-conditions", title: "B1.3 Future and Real Conditions Checkpoint", order: 1010, imageKey: "weather-and-time:16",
    summary: "Check future choices, regular and irregular forms, probability, and realistic conditions.", situation: "planning under changing conditions", checkpoint: true,
    sentences: [
      ["Mañana voy a revisar el plan.", "Tomorrow I am going to review the plan.", "A current intention uses ir a."],
      ["Después hablaré con el equipo.", "Afterwards I will speak with the team.", "The simple future moves to a later planned action."],
      ["Si hay un problema, lo resolveremos juntos.", "If there is a problem, we will solve it together.", "A realistic condition leads to a future response."],
      ["Marta no está aquí; estará en una reunión.", "Marta is not here; she is probably in a meeting.", "The future expresses probability about now."],
      ["Tendremos una respuesta antes del viernes.", "We will have an answer before Friday.", "The irregular stem tendr- carries the normal future ending."]
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
    { key: "apply", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "future_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "future_conditions", rubric: "Choose the future form from the intended meaning and keep both parts of a condition clear." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Express a future meaning", instruction: "Decide whether this is a schedule, intention, prediction, probability, or realistic condition before choosing the form.", questionText: check.question, answerJson, explanation: "Future forms become reliable when each one is tied to its communicative function rather than memorized in isolation.", difficulty: 3, order, xpReward: 14, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "future-real-conditions" }, update: { title: "Future and Real Conditions", description: "Future choices, regular and irregular forms, probability, and realistic si clauses.", cefrLevel: "B1", imageKey: "weather-and-time:12" }, create: { slug: "future-real-conditions", title: "Future and Real Conditions", description: "Future choices, regular and irregular forms, probability, and realistic si clauses.", cefrLevel: "B1", imageKey: "weather-and-time:12" } });
  const groupSlugs = ["daily-actions", "weather-and-time", "essential-words", "useful-phrases", "b1-conversation-stories", "b1-plans-reactions"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B1.3 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Future", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can choose a future form from its intended function.", "You can make predictions and careful present guesses.", "You can connect a realistic condition to its result."], conceptKeys: ["b1", "future", "conditions", "meaning-choice"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 15 : 11, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B1.3 future and condition packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
