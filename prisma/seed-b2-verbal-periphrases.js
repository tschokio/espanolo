const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b2-acabar-de-recent", title: "Express Very Recent Events with Acabar de", order: 1620, imageKey: "daily-actions:12",
    summary: "Use acabar de plus infinitive to place a completed event immediately before the current reference point.", situation: "sharing fresh news and immediate updates",
    sentences: [
      ["Acabo de llegar a casa.", "I have just arrived home.", "Present acabar de places the arrival immediately before now."],
      ["Ana acaba de llamar.", "Ana has just called.", "Only acabar changes for the subject; llamar remains infinitive."],
      ["Acabamos de terminar la reunión.", "We have just finished the meeting.", "The completed meeting is presented as very recent."],
      ["Cuando llegué, el tren acababa de salir.", "When I arrived, the train had just left.", "Imperfect acabar de places the departure immediately before a past reference point."],
      ["No puedo hablar: acabo de entrar en clase.", "I cannot talk: I have just entered class.", "The recent event explains the current situation."]
    ]
  },
  {
    slug: "b2-seguir-continuity", title: "Show Continuity with Seguir and Continuar", order: 1630, imageKey: "daily-actions:13",
    summary: "Use seguir or continuar plus gerund to show that an action remains in progress despite time or circumstances.", situation: "explaining what has not stopped or changed",
    sentences: [
      ["Sigo estudiando español.", "I am still studying Spanish.", "Seguir plus gerund emphasizes continuation."],
      ["Aunque está cansada, continúa trabajando.", "Although she is tired, she continues working.", "The action persists despite the obstacle."],
      ["Seguimos esperando una respuesta.", "We are still waiting for an answer.", "The waiting began earlier and remains active."],
      ["El problema sigue siendo complicado.", "The problem remains complicated.", "Seguir plus gerund of ser expresses an unchanged state."],
      ["¿Sigues viviendo en el mismo barrio?", "Do you still live in the same neighborhood?", "The question checks whether an earlier situation continues."]
    ]
  },
  {
    slug: "b2-llevar-duration", title: "Connect Duration to an Ongoing Action with Llevar", order: 1640, imageKey: "weather-and-time:12",
    summary: "Use llevar plus a duration and gerund to say how long an ongoing action has continued.", situation: "describing accumulated time and experience",
    sentences: [
      ["Llevo dos años estudiando español.", "I have been studying Spanish for two years.", "The duration extends from the past up to now."],
      ["Llevamos media hora esperando.", "We have been waiting for half an hour.", "Llevar agrees with the people experiencing the duration."],
      ["Ana llevaba meses buscando trabajo.", "Ana had been looking for work for months.", "Imperfect llevaba sets an ongoing duration at a past reference point."],
      ["¿Cuánto tiempo llevas viviendo aquí?", "How long have you been living here?", "The question asks for the duration of an ongoing situation."],
      ["No llevo mucho tiempo trabajando en esta empresa.", "I have not been working at this company for very long.", "Negation limits the accumulated duration."]
    ]
  },
  {
    slug: "b2-soler-habits", title: "Describe Typical Habits with Soler", order: 1650, imageKey: "a2-daily-routine:10",
    summary: "Use soler plus infinitive for what usually happens, while choosing present or imperfect from the time frame.", situation: "contrasting current and earlier routines",
    sentences: [
      ["Suelo levantarme temprano.", "I usually get up early.", "Present soler describes a current typical habit."],
      ["Solemos comer juntos los domingos.", "We usually eat together on Sundays.", "The infinitive carries the habitual action."],
      ["Antes solía caminar al trabajo.", "I used to walk to work.", "Imperfect solía describes a former repeated habit."],
      ["No suelo beber café por la tarde.", "I do not usually drink coffee in the afternoon.", "Negated soler describes what is not typical."],
      ["¿Qué sueles hacer los fines de semana?", "What do you usually do on weekends?", "The frame asks about a person's typical routine."]
    ]
  },
  {
    slug: "b2-change-repetition-periphrases", title: "Mark Starting, Stopping, and Repeating", order: 1660, imageKey: "grammar-scenes:13",
    summary: "Use empezar a, dejar de, volver a, and terminar de to show a change in an action's phase.", situation: "explaining how behavior or a process changed",
    sentences: [
      ["Empecé a trabajar aquí en enero.", "I started working here in January.", "Empezar a marks the beginning of the activity."],
      ["He dejado de fumar.", "I have stopped smoking.", "Dejar de marks that a previous activity no longer continues."],
      ["Volvieron a intentarlo al día siguiente.", "They tried it again the next day.", "Volver a marks repetition or resumption."],
      ["Terminamos de revisar el documento.", "We finished reviewing the document.", "Terminar de marks the endpoint of an activity."],
      ["Después de la pausa, empezó a llover otra vez.", "After the break, it started raining again.", "The frame marks a new beginning of the event."]
    ]
  },
  {
    slug: "checkpoint-b2-verbal-periphrases", title: "B2.6 Verbal Periphrases Checkpoint", order: 1670, imageKey: "rewards-and-progress:10",
    summary: "Check recent completion, continuity, accumulated duration, typical habits, beginnings, endings, and repetition.", situation: "giving a precise update about routines and ongoing changes", checkpoint: true,
    sentences: [
      ["Acabo de empezar un curso nuevo.", "I have just started a new course.", "Acabar de marks the start as very recent."],
      ["Llevo tres semanas asistiendo a clase.", "I have been attending class for three weeks.", "Llevar plus duration presents accumulated ongoing time."],
      ["Sigo practicando todos los días.", "I am still practicing every day.", "Seguir shows that the practice continues."],
      ["Antes no solía hablar en clase, pero ahora participo más.", "I did not usually speak in class before, but now I participate more.", "Solía describes the former habit and pero contrasts the current change."],
      ["He dejado de traducir cada palabra y he vuelto a disfrutar de la lectura.", "I have stopped translating every word and have started enjoying reading again.", "Dejar de marks stopping; volver a marks renewed experience."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`];
};

function checks(input) {
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "respond", type: ExerciseType.DIALOGUE_REPLY, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "produce", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "b2_periphrasis_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "b2_periphrasis_aspect", rubric: "Choose the verbal frame from the intended phase, continuity, duration, habit, or repetition." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Show how the action unfolds over time", instruction: "Choose the meaning first: just completed, continuing, accumulated, typical, beginning, ending, or repeated.",
    questionText: check.question, answerJson,
    explanation: "Verbal periphrases package time and aspect into reusable frames, making everyday descriptions more precise and natural.",
    difficulty: 5, order, xpReward: 18, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "b2-verbal-periphrases" },
    update: { title: "Verbal Periphrases and Action Phases", description: "Recent completion, continuity, accumulated duration, typical habits, beginnings, endings, and repetition.", cefrLevel: "B2", imageKey: "daily-actions:12" },
    create: { slug: "b2-verbal-periphrases", title: "Verbal Periphrases and Action Phases", description: "Recent completion, continuity, accumulated duration, typical habits, beginnings, endings, and repetition.", cefrLevel: "B2", imageKey: "daily-actions:12" }
  });
  const groupSlugs = ["daily-actions", "a2-daily-routine", "a2-irregular-verbs", "useful-phrases", "b2-discourse-reporting", "b2-complex-structures"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B2.6 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B2", theme: input.checkpoint ? "Checkpoint" : "Verbal Periphrases",
      situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can describe recent, continuing, and accumulated actions.", "You can express current and earlier typical habits.", "You can mark the beginning, end, and repetition of an action naturally."],
      conceptKeys: ["b2", "verbal-periphrases", "aspect", "duration", "habits"], reviewSummary: input.summary,
      order: input.order, estimatedMinutes: input.checkpoint ? 18 : 14, topicId: topic.id
    };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B2.6 verbal-periphrasis learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
