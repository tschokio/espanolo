const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b2-concession-aunque", title: "Concede a Point with Aunque", order: 1320, imageKey: "conversation-and-opinion:10",
    summary: "Use aunque to acknowledge a fact or introduce a possibility without abandoning your main point.", situation: "responding fairly before presenting a contrast",
    sentences: [
      ["Aunque es caro, merece la pena.", "Although it is expensive, it is worth it.", "Indicative presents the cost as an accepted fact."],
      ["Aunque sea caro, lo compraré si lo necesito.", "Even if it is expensive, I will buy it if I need it.", "Subjunctive presents the cost as possible rather than confirmed."],
      ["Aunque entiendo tu postura, no comparto la conclusión.", "Although I understand your position, I do not share the conclusion.", "A concession makes disagreement more cooperative."],
      ["Seguiré intentándolo aunque resulte difícil.", "I will keep trying even if it proves difficult.", "The possible obstacle does not change the decision."],
      ["Aunque había poco tiempo, terminamos el informe.", "Although there was little time, we finished the report.", "A known past circumstance contrasts with the result."]
    ]
  },
  {
    slug: "b2-concession-alternatives", title: "Use Precise Concession Frames", order: 1330, imageKey: "conversation-and-opinion:11",
    summary: "Vary concession with a pesar de, pese a, and por mucho que while keeping the relationship clear.", situation: "weighing obstacles and outcomes",
    sentences: [
      ["A pesar del tráfico, llegamos a tiempo.", "Despite the traffic, we arrived on time.", "A pesar de introduces a noun as the obstacle."],
      ["A pesar de estar cansada, Ana siguió trabajando.", "Despite being tired, Ana kept working.", "The infinitive follows de when the subject is understood."],
      ["Pese a que llovía, salimos a caminar.", "Despite the fact that it was raining, we went for a walk.", "Pese a que introduces a full clause."],
      ["Por mucho que lo expliques, no todos estarán de acuerdo.", "No matter how much you explain it, not everyone will agree.", "Por mucho que emphasizes that the obstacle can be repeated or intense."],
      ["Con todo, la propuesta ofrece ventajas claras.", "Even so, the proposal offers clear advantages.", "Con todo reconnects to the whole previous argument."]
    ]
  },
  {
    slug: "b2-cause-consequence", title: "Connect Cause and Consequence Precisely", order: 1340, imageKey: "grammar-scenes:11",
    summary: "Distinguish reasons, evidence, and consequences with debido a, ya que, por lo tanto, and de ahí que.", situation: "explaining why a conclusion follows",
    sentences: [
      ["La reunión se canceló debido a la tormenta.", "The meeting was canceled because of the storm.", "Debido a introduces a noun cause in a neutral register."],
      ["Decidimos esperar, ya que faltaban varios datos.", "We decided to wait, since several pieces of information were missing.", "Ya que gives a reason treated as shared or explanatory."],
      ["Faltaban varios datos; por lo tanto, aplazamos la decisión.", "Several pieces of information were missing; therefore, we postponed the decision.", "Por lo tanto introduces a logical consequence."],
      ["El plazo era demasiado corto, de ahí que surgieran errores.", "The deadline was too short, hence errors arose.", "De ahí que presents a resulting explanation and takes the subjunctive."],
      ["No solo bajaron los costes, sino que además mejoró el servicio.", "Not only did costs fall, but the service also improved.", "The paired frame adds a second, stronger consequence."]
    ]
  },
  {
    slug: "b2-hedging-register", title: "Make Claims with Appropriate Caution", order: 1350, imageKey: "reading-and-listening-lab:12",
    summary: "Separate certainty, probability, and personal interpretation instead of making every claim absolute.", situation: "discussing evidence and uncertain conclusions",
    sentences: [
      ["Todo indica que la situación está mejorando.", "Everything indicates that the situation is improving.", "The evidence supports the claim without presenting it as absolute certainty."],
      ["Es probable que los precios sigan subiendo.", "It is likely that prices will continue to rise.", "A probability frame triggers the subjunctive."],
      ["Al parecer, nadie recibió el mensaje.", "Apparently, nobody received the message.", "Al parecer attributes the conclusion to available appearances."],
      ["Hasta donde sé, todavía no han tomado una decisión.", "As far as I know, they have not made a decision yet.", "The frame explicitly limits the speaker's knowledge."],
      ["Cabe la posibilidad de que cambien las condiciones.", "There is a possibility that the conditions may change.", "A formal frame opens a possibility without asserting it."]
    ]
  },
  {
    slug: "b2-structured-argument", title: "Build a Balanced Argument", order: 1360, imageKey: "conversation-and-opinion:13",
    summary: "Guide a listener through a position, supporting reason, limitation, and considered conclusion.", situation: "giving a structured contribution in a discussion",
    sentences: [
      ["En primer lugar, la medida reduciría el tráfico.", "First of all, the measure would reduce traffic.", "A signpost announces the first supporting point."],
      ["Además, permitiría recuperar espacio público.", "Furthermore, it would make it possible to reclaim public space.", "Además adds evidence in the same argumentative direction."],
      ["Ahora bien, también podría perjudicar a algunos comercios.", "That said, it could also harm some businesses.", "Ahora bien introduces an important qualification."],
      ["Por un lado mejora la movilidad; por otro, exige una buena planificación.", "On the one hand it improves mobility; on the other, it requires good planning.", "The paired frame balances two sides explicitly."],
      ["En definitiva, la propuesta es útil siempre que se aplique gradualmente.", "Ultimately, the proposal is useful provided that it is implemented gradually.", "The conclusion includes a condition rather than ignoring the limitation."]
    ]
  },
  {
    slug: "checkpoint-b2-discourse", title: "B2.1 Nuanced Discourse Checkpoint", order: 1370, imageKey: "rewards-and-progress:16",
    summary: "Check concession, precise cause and consequence, cautious claims, and balanced argument structure.", situation: "presenting and defending a nuanced recommendation", checkpoint: true,
    sentences: [
      ["Aunque la propuesta tiene riesgos, ofrece beneficios importantes.", "Although the proposal has risks, it offers important benefits.", "A factual concession opens a balanced evaluation."],
      ["Faltan algunos datos; por lo tanto, conviene actuar con prudencia.", "Some information is missing; therefore, it is advisable to act cautiously.", "Evidence leads to a measured consequence."],
      ["Hasta donde sé, todavía no existe una alternativa mejor.", "As far as I know, there is still no better alternative.", "The claim is limited to the speaker's knowledge."],
      ["Por un lado reduciría los costes; por otro, exigiría más tiempo.", "On the one hand it would reduce costs; on the other, it would require more time.", "Two effects are weighed with parallel structure."],
      ["En definitiva, la apoyaría siempre que se revisaran los resultados.", "Ultimately, I would support it provided that the results were reviewed.", "The conclusion states a condition for support."]
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
    ? { correctWords: check.correctWords, goal: "b2_discourse_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "b2_discourse_connection", rubric: "Use the connector to make concession, cause, consequence, caution, or argument structure explicit." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Connect the ideas precisely", instruction: "Identify the intended relationship before choosing the connector.",
    questionText: check.question, answerJson,
    explanation: "At B2, connectors do more than join sentences: they show how strongly you commit to a claim and how each idea relates to the argument.",
    difficulty: 5, order, xpReward: 18, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "b2-discourse-connectors" },
    update: { title: "Nuanced Discourse and Connectors", description: "Concession, precise cause and consequence, cautious claims, register, and balanced argument structure.", cefrLevel: "B2", imageKey: "conversation-and-opinion:10" },
    create: { slug: "b2-discourse-connectors", title: "Nuanced Discourse and Connectors", description: "Concession, precise cause and consequence, cautious claims, register, and balanced argument structure.", cefrLevel: "B2", imageKey: "conversation-and-opinion:10" }
  });
  const groupSlugs = ["useful-phrases", "a2-reading-listening-lab", "essential-words", "emotions-and-states", "b2-discourse-reporting", "b2-complex-structures"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B2.1 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B2", theme: input.checkpoint ? "Checkpoint" : "Nuanced Discourse",
      situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can concede a point without losing your main argument.", "You can mark cause, consequence, certainty, and limitation precisely.", "You can structure a balanced extended contribution."],
      conceptKeys: ["b2", "discourse", "connectors", "argument"], reviewSummary: input.summary,
      order: input.order, estimatedMinutes: input.checkpoint ? 18 : 14, topicId: topic.id
    };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({
      where: { slug: input.slug },
      update: { ...common, vocabularyGroups: { set: connectedGroups } },
      create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } }
    });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B2.1 discourse learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
