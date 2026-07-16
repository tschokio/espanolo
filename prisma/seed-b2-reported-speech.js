const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b2-report-present-statements", title: "Report Current Statements", order: 1380, imageKey: "conversation-and-opinion:3",
    summary: "Report statements with dice que while preserving information that remains current.", situation: "passing on a current message accurately",
    sentences: [
      ["Marta dice que está cansada.", "Marta says that she is tired.", "The reporting verb is present, so the original present remains natural."],
      ["Luis afirma que no conoce la respuesta.", "Luis states that he does not know the answer.", "Afirma que presents the source more formally than dice que."],
      ["Ana explica que necesita más tiempo.", "Ana explains that she needs more time.", "The subject and verb now follow que instead of quotation marks."],
      ["Mis compañeros comentan que el curso es útil.", "My classmates comment that the course is useful.", "A plural reporting source takes comentan."],
      ["El informe señala que los resultados son positivos.", "The report indicates that the results are positive.", "An impersonal source can also introduce reported information."]
    ]
  },
  {
    slug: "b2-report-past-sequence", title: "Shift the Viewpoint into the Past", order: 1390, imageKey: "past-events:12",
    summary: "Use dijo que and choose tense forms from the intended time relationship rather than shifting mechanically.", situation: "retelling an earlier conversation",
    sentences: [
      ["Marta dijo que estaba cansada.", "Marta said that she was tired.", "The tired state is viewed from the past reporting point."],
      ["Luis explicó que había perdido el tren.", "Luis explained that he had missed the train.", "The missed train happened before the explanation."],
      ["Ana prometió que llamaría al día siguiente.", "Ana promised that she would call the next day.", "The conditional expresses a future viewed from the past."],
      ["Dijeron que ya habían terminado.", "They said that they had already finished.", "The completion precedes what they said."],
      ["Pedro contó que vivía en Chile cuando era niño.", "Pedro said that he lived in Chile when he was a child.", "The imperfect describes a past background or continuing situation."]
    ]
  },
  {
    slug: "b2-report-questions", title: "Report Questions without Question Word Order", order: 1400, imageKey: "directions-and-question-intents:10",
    summary: "Turn direct questions into embedded questions with si or an existing question word.", situation: "explaining what someone wanted to know",
    sentences: [
      ["Me preguntó si tenía tiempo.", "She asked me whether I had time.", "Si introduces a reported yes-or-no question."],
      ["Quería saber dónde estaba la estación.", "He wanted to know where the station was.", "Dónde remains, but the embedded clause uses statement order."],
      ["Nos preguntaron cuándo llegaríamos.", "They asked us when we would arrive.", "The future from a past viewpoint uses the conditional."],
      ["No recuerdo qué dijo exactamente.", "I do not remember exactly what he said.", "Qué introduces an embedded information question."],
      ["Explícame por qué cambiaste de opinión.", "Explain to me why you changed your mind.", "The embedded question keeps the accent on por qué."]
    ]
  },
  {
    slug: "b2-report-requests-commands", title: "Report Requests and Instructions", order: 1410, imageKey: "grammar-scenes:12",
    summary: "Use pedir que, recomendar que, and decir que with the subjunctive to report influence on another person.", situation: "relaying requests, advice, and instructions",
    sentences: [
      ["Me pidió que cerrara la puerta.", "She asked me to close the door.", "A past request takes the imperfect subjunctive in the reported action."],
      ["El médico recomendó que descansara unos días.", "The doctor recommended that I rest for a few days.", "The recommendation influences a different subject."],
      ["Nos dijeron que no llegáramos tarde.", "They told us not to arrive late.", "A negative instruction is reported with no plus imperfect subjunctive."],
      ["Ana sugirió que fuéramos en tren.", "Ana suggested that we go by train.", "The suggestion frames a shared possible action."],
      ["El profesor insistió en que revisáramos el texto.", "The teacher insisted that we review the text.", "Insistir en que introduces the demanded action."]
    ]
  },
  {
    slug: "b2-report-reference-shifts", title: "Shift Person, Place, and Time References", order: 1420, imageKey: "weather-and-time:14",
    summary: "Adjust pronouns, possessives, place words, and time expressions so the report remains true from the new viewpoint.", situation: "retelling a message on another day or in another place",
    sentences: [
      ["Dijo: «Te llamaré mañana». → Dijo que me llamaría al día siguiente.", "He said, ‘I will call you tomorrow.’ → He said that he would call me the next day.", "Person, future viewpoint, and the day reference all shift."],
      ["Ana dijo que aquel era su libro.", "Ana said that that was her book.", "Aquel and su fit the new speaker and distance."],
      ["Explicó que allí no había cobertura.", "She explained that there was no signal there.", "Aquí can become allí when the reporting place changes."],
      ["Me contó que había llegado dos días antes.", "He told me that he had arrived two days earlier.", "Hace dos días becomes dos días antes from the later reporting point."],
      ["Prometieron volver la semana siguiente.", "They promised to return the following week.", "The time expression is anchored to the original promise."]
    ]
  },
  {
    slug: "checkpoint-b2-reported-speech", title: "B2.2 Reported Speech Checkpoint", order: 1430, imageKey: "rewards-and-progress:14",
    summary: "Check statements, tense relationships, embedded questions, reported requests, and reference shifts.", situation: "summarizing an important conversation accurately", checkpoint: true,
    sentences: [
      ["Laura dijo que no podía asistir a la reunión.", "Laura said that she could not attend the meeting.", "The ability is viewed from Laura's past statement."],
      ["Me preguntó si podía enviarle el informe.", "She asked me whether I could send her the report.", "Si introduces the reported yes-or-no question and le identifies the recipient."],
      ["También pidió que aplazáramos la decisión.", "She also asked us to postpone the decision.", "A past request to a different subject takes imperfect subjunctive."],
      ["Explicó que había recibido nuevos datos aquella mañana.", "She explained that she had received new information that morning.", "The receipt precedes the explanation and the time reference shifts."],
      ["Prometió que nos llamaría al día siguiente.", "She promised that she would call us the next day.", "The promised call is future relative to the past promise."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:«»→]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;:«»→]/g, "").replace(/\s+/g, " ").trim();
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
    ? { correctWords: check.correctWords, goal: "b2_reported_speech_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "b2_reported_viewpoint", rubric: "Preserve who said what and place every event, person, place, and time reference correctly." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Report the message from the new viewpoint", instruction: "Locate the reporting point first, then adjust only the references that truly change.",
    questionText: check.question, answerJson,
    explanation: "Reliable reported speech follows meaning: identify the source, the reporting time, and whether each event is simultaneous, earlier, or later.",
    difficulty: 5, order, xpReward: 18, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "b2-reported-speech" },
    update: { title: "Reported Speech and Viewpoint", description: "Current and past reports, tense relationships, embedded questions, reported influence, and reference shifts.", cefrLevel: "B2", imageKey: "conversation-and-opinion:3" },
    create: { slug: "b2-reported-speech", title: "Reported Speech and Viewpoint", description: "Current and past reports, tense relationships, embedded questions, reported influence, and reference shifts.", cefrLevel: "B2", imageKey: "conversation-and-opinion:3" }
  });
  const groupSlugs = ["useful-phrases", "a2-reading-listening-lab", "people-and-pronouns", "weather-and-time", "b2-discourse-reporting", "b2-complex-structures"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B2.2 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B2", theme: input.checkpoint ? "Checkpoint" : "Reported Speech",
      situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can report statements and questions from a new viewpoint.", "You can preserve earlier, simultaneous, and later time relationships.", "You can relay requests and adjust person, place, and time references accurately."],
      conceptKeys: ["b2", "reported-speech", "viewpoint", "tense-sequence"], reviewSummary: input.summary,
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
  console.log(`Seeded ${lessons.length} B2.2 reported-speech learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
