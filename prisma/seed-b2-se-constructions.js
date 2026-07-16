const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b2-se-reflexive-reciprocal", title: "Distinguish Reflexive and Reciprocal Se", order: 1500, imageKey: "people-and-family:8",
    summary: "Use context and participants to distinguish acting on oneself from acting on one another.", situation: "describing personal and shared actions precisely",
    sentences: [
      ["Ana se prepara para la entrevista.", "Ana gets herself ready for the interview.", "One person performs the action on herself."],
      ["Los amigos se abrazaron al verse.", "The friends hugged each other when they met.", "A plural subject performs the action reciprocally."],
      ["Nos miramos en el espejo.", "We look at ourselves in the mirror.", "The mirror context makes the reflexive reading clear."],
      ["Nos miramos y sonreímos.", "We looked at each other and smiled.", "Two participants and the interaction support a reciprocal reading."],
      ["Se escriben todos los días.", "They write to each other every day.", "The plural participants exchange the action."]
    ]
  },
  {
    slug: "b2-se-impersonal", title: "Use Impersonal Se for General People", order: 1510, imageKey: "places-around-town:8",
    summary: "State what people generally do without naming a specific subject.", situation: "expressing rules, customs, and general experience",
    sentences: [
      ["Aquí se vive bien.", "People live well here.", "Impersonal se leaves the human subject general."],
      ["En esta oficina se trabaja con calma.", "People work calmly in this office.", "The third-person singular verb describes a general practice."],
      ["No se puede entrar sin permiso.", "You cannot enter without permission.", "The statement applies generally rather than to one named person."],
      ["Se habla mucho de ese tema.", "People talk a lot about that topic.", "The prepositional topic is not a grammatical subject."],
      ["¿Cómo se llega al museo?", "How does one get to the museum?", "The question asks for general directions."]
    ]
  },
  {
    slug: "b2-se-passive", title: "Build Passive Se with Agreement", order: 1520, imageKey: "grammar-scenes:9",
    summary: "Present an action and its affected thing while making the verb agree with that grammatical subject.", situation: "reading and producing notices, offers, and reports",
    sentences: [
      ["Se vende una casa.", "A house is for sale.", "The singular affected noun controls singular agreement."],
      ["Se venden dos casas.", "Two houses are for sale.", "The plural affected noun requires venden."],
      ["Se publicaron los resultados ayer.", "The results were published yesterday.", "The plural subject results controls past plural agreement."],
      ["Se necesitan personas con experiencia.", "People with experience are needed.", "The needed plural noun controls necesitan."],
      ["Se han tomado varias medidas.", "Several measures have been taken.", "The passive se works across compound tenses with plural agreement."]
    ]
  },
  {
    slug: "b2-se-accidental", title: "Describe Unintended Events with Se", order: 1530, imageKey: "home-objects:10",
    summary: "Use se plus an indirect-object pronoun to foreground what happened rather than deliberate agency.", situation: "explaining mistakes and accidents without hiding responsibility",
    sentences: [
      ["Se me cayeron las llaves.", "I dropped the keys accidentally.", "The keys are grammatical subject; me identifies the affected person."],
      ["Se nos olvidó la cita.", "We forgot the appointment.", "The event is framed as an unintended lapse affecting us."],
      ["Se le rompió el teléfono.", "His phone broke on him.", "Le identifies the affected person and the phone controls singular agreement."],
      ["Se te han quemado las tostadas.", "Your toast has burned.", "Te marks who is affected; the plural toast controls the verb form."],
      ["Se les perdió el documento.", "They lost the document accidentally.", "Les identifies the affected group while the document remains subject."]
    ]
  },
  {
    slug: "b2-se-passive-contrast", title: "Choose Passive Se, Impersonal Se, or Ser Passive", order: 1540, imageKey: "reading-and-listening-lab:9",
    summary: "Choose a construction from whether the sentence foregrounds a general person, an affected thing, or a formal event and agent.", situation: "adapting information to notices, conversation, and formal reporting",
    sentences: [
      ["Se entrevistó a tres candidatos.", "Three candidates were interviewed.", "Personal a prevents the candidates from acting as an agreeing passive subject, so the verb stays singular."],
      ["Se aprobaron tres propuestas.", "Three proposals were approved.", "The nonhuman plural subject controls plural agreement in passive se."],
      ["Las propuestas fueron aprobadas por el comité.", "The proposals were approved by the committee.", "Ser passive is useful when the agent is explicit and relevant."],
      ["En España se cena tarde.", "People eat dinner late in Spain.", "The intransitive activity uses impersonal singular se."],
      ["La ley fue modificada en 2020.", "The law was amended in 2020.", "The formal passive foregrounds the affected law and event."]
    ]
  },
  {
    slug: "checkpoint-b2-se-constructions", title: "B2.4 Se Constructions Checkpoint", order: 1550, imageKey: "rewards-and-progress:12",
    summary: "Check reflexive and reciprocal meaning, impersonal statements, passive agreement, accidental events, and passive contrasts.", situation: "understanding and producing public information and everyday explanations", checkpoint: true,
    sentences: [
      ["En este barrio se vive con tranquilidad.", "People live peacefully in this neighborhood.", "The statement makes a general impersonal claim."],
      ["Se alquilan habitaciones cerca de la universidad.", "Rooms are rented near the university.", "The plural affected noun controls alquilan."],
      ["Se entrevistó a todos los candidatos.", "All the candidates were interviewed.", "Personal a keeps the impersonal construction singular."],
      ["Se me olvidaron los documentos en casa.", "I accidentally left the documents at home.", "Me marks the affected person and documentos controls plural agreement."],
      ["Los vecinos se ayudan cuando hay un problema.", "The neighbors help one another when there is a problem.", "The plural participants exchange the action reciprocally."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;]/g, "").replace(/\s+/g, " ").trim();
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
    ? { correctWords: check.correctWords, goal: "b2_se_construction_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "b2_se_function", rubric: "Identify the function of se, the grammatical subject, and any affected person before choosing agreement." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Choose the se construction from its meaning", instruction: "Ask who or what controls the verb and whether the subject is specific, general, affected, or reciprocal.",
    questionText: check.question, answerJson,
    explanation: "Se becomes manageable when each sentence is classified by function and agreement rather than translated as one fixed word.",
    difficulty: 5, order, xpReward: 18, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "b2-se-constructions" },
    update: { title: "Se by Function", description: "Reflexive and reciprocal action, impersonal statements, passive agreement, accidental events, and passive contrasts.", cefrLevel: "B2", imageKey: "grammar-scenes:9" },
    create: { slug: "b2-se-constructions", title: "Se by Function", description: "Reflexive and reciprocal action, impersonal statements, passive agreement, accidental events, and passive contrasts.", cefrLevel: "B2", imageKey: "grammar-scenes:9" }
  });
  const groupSlugs = ["people-and-pronouns", "places-around-town", "home-and-objects", "useful-phrases", "b2-discourse-reporting", "b2-complex-structures"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B2.4 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B2", theme: input.checkpoint ? "Checkpoint" : "Se by Function",
      situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can distinguish reflexive, reciprocal, impersonal, passive, and accidental se.", "You can find the grammatical subject and choose agreement reliably.", "You can select a natural construction for notices, reports, and everyday explanations."],
      conceptKeys: ["b2", "se", "voice", "impersonal", "agreement"], reviewSummary: input.summary,
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
  console.log(`Seeded ${lessons.length} B2.4 se-construction learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
