const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b2-imperfect-subjunctive-forms", title: "Build the Imperfect Subjunctive from the Preterite", order: 1560, imageKey: "irregular-verbs:13",
    summary: "Derive reliable -ra forms from the third-person plural preterite instead of memorizing a separate stem list.", situation: "forming past subjunctive patterns accurately",
    sentences: [
      ["hablaron → hablara", "they spoke → that I/he/she spoke", "Remove -ron from hablaron and add the imperfect-subjunctive endings."],
      ["comieron → comiera", "they ate → that I/he/she ate", "The preterite third-person plural supplies the stem comie-."],
      ["vivieron → viviera", "they lived → that I/he/she lived", "The same derivation works for regular -ir verbs."],
      ["tuvieron → tuviera", "they had → that I/he/she had", "An irregular preterite stem remains visible in the subjunctive."],
      ["dijeron → dijera", "they said → that I/he/she said", "Use dijeron without -ron; do not restore the infinitive stem." ]
    ]
  },
  {
    slug: "b2-past-wishes-influence", title: "Frame Past Wishes, Requests, and Influence", order: 1570, imageKey: "conversation-and-opinion:14",
    summary: "Use a past main frame plus imperfect subjunctive for an action desired or influenced at that past point.", situation: "retelling what someone wanted another person to do",
    sentences: [
      ["Quería que vinieras conmigo.", "I wanted you to come with me.", "A past desire frames another person's action."],
      ["Me pidió que esperara fuera.", "She asked me to wait outside.", "The past request triggers imperfect subjunctive."],
      ["El jefe insistió en que termináramos ese día.", "The boss insisted that we finish that day.", "Past influence is followed by a different subject's action."],
      ["Preferíamos que los niños durmieran aquí.", "We preferred the children to sleep here.", "A past preference frames the children's action."],
      ["No permitieron que entráramos.", "They did not allow us to enter.", "Past prevention or permission frames the blocked action."]
    ]
  },
  {
    slug: "b2-past-reactions-doubt", title: "Express Past Reactions, Evaluation, and Doubt", order: 1580, imageKey: "emotions-and-states:14",
    summary: "Use imperfect subjunctive when a past frame evaluates, reacts to, or doubts another situation.", situation: "explaining earlier feelings and uncertainty",
    sentences: [
      ["Me sorprendió que nadie respondiera.", "I was surprised that nobody answered.", "A past emotional reaction frames the response."],
      ["Era importante que todos participaran.", "It was important that everyone participate.", "A past evaluation frames the desired participation."],
      ["Dudaba que el plan funcionara.", "I doubted that the plan would work.", "Past doubt prevents the following idea from being asserted as fact."],
      ["No creíamos que fuera necesario.", "We did not believe that it was necessary.", "Negated past belief frames the idea as uncertain."],
      ["Buscaban a alguien que supiera reparar el sistema.", "They were looking for someone who knew how to repair the system.", "The unknown or not-yet-identified person triggers subjunctive."]
    ]
  },
  {
    slug: "b2-past-perfect-subjunctive", title: "Place an Unreal or Evaluated Event before a Past Point", order: 1590, imageKey: "past-events:14",
    summary: "Use hubiera plus participle for an event viewed as earlier inside a subjunctive frame.", situation: "reacting to or imagining an earlier outcome",
    sentences: [
      ["Me alegró que hubieras venido.", "I was glad that you had come.", "The arrival happened before the past reaction."],
      ["Dudaban que el equipo hubiera terminado.", "They doubted that the team had finished.", "The possible completion precedes their doubt."],
      ["Era posible que se hubieran perdido.", "It was possible that they had gotten lost.", "A past possibility evaluates an even earlier event."],
      ["No sabía que hubieras vivido en Perú.", "I did not know that you had lived in Peru.", "The earlier life experience is viewed from a later past state of knowledge."],
      ["Ojalá hubiéramos llegado antes.", "I wish we had arrived earlier.", "Ojalá plus past perfect subjunctive expresses regret about an unchangeable past." ]
    ]
  },
  {
    slug: "b2-counterfactual-past", title: "Build Counterfactual Past Conditions", order: 1600, imageKey: "grammar-scenes:15",
    summary: "Use si plus past perfect subjunctive and a conditional-perfect result to evaluate an unreal past.", situation: "explaining how a different past condition would have changed the result",
    sentences: [
      ["Si hubiera tenido tiempo, habría ido contigo.", "If I had had time, I would have gone with you.", "Neither the time nor the trip became reality."],
      ["Si me lo hubieras dicho, te habría ayudado.", "If you had told me, I would have helped you.", "The unreal condition precedes its unreal result."],
      ["Habríamos llegado antes si no hubiera habido tráfico.", "We would have arrived earlier if there had not been traffic.", "The result may come before the si clause without changing the relationship."],
      ["Si hubieran estudiado más, habrían aprobado.", "If they had studied more, they would have passed.", "The sentence evaluates an alternative past outcome."],
      ["De haberlo sabido, no habría aceptado.", "Had I known, I would not have accepted.", "De plus perfect infinitive is a compact formal alternative for the unreal condition." ]
    ]
  },
  {
    slug: "checkpoint-b2-past-subjunctive", title: "B2.5 Past Subjunctive Checkpoint", order: 1610, imageKey: "rewards-and-progress:11",
    summary: "Check form derivation, past wishes and influence, reactions and doubt, earlier evaluated events, and counterfactual past results.", situation: "reconstructing decisions, reactions, and alternative outcomes", checkpoint: true,
    sentences: [
      ["El director quería que presentáramos otra propuesta.", "The director wanted us to present another proposal.", "A past wish frames our action."],
      ["Nos sorprendió que hubieran rechazado la primera.", "We were surprised that they had rejected the first one.", "The rejection happened before the reaction."],
      ["Dudábamos que hubiera tiempo suficiente.", "We doubted that there was enough time.", "Past doubt frames the availability of time as uncertain."],
      ["Si hubiéramos recibido más información, habríamos cambiado el plan.", "If we had received more information, we would have changed the plan.", "Both condition and result are unreal past events."],
      ["Ojalá nos lo hubieran explicado antes.", "I wish they had explained it to us earlier.", "The frame expresses regret about an unchangeable past." ]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:→]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;:→]/g, "").replace(/\s+/g, " ").trim();
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
    ? { correctWords: check.correctWords, goal: "b2_past_subjunctive_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "b2_past_subjunctive_meaning", rubric: "Choose the form from the past framing meaning and the time relationship between events." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Frame the past event with the intended meaning", instruction: "Identify the past trigger and decide whether the framed event is simultaneous, later, or already earlier.",
    questionText: check.question, answerJson,
    explanation: "Past subjunctive forms become usable when the trigger meaning and event order are chosen before the ending.",
    difficulty: 5, order, xpReward: 18, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "b2-past-subjunctive" },
    update: { title: "Past Subjunctive and Counterfactual Past", description: "Form derivation, past wishes and influence, reactions and doubt, earlier evaluated events, and unreal past conditions.", cefrLevel: "B2", imageKey: "irregular-verbs:13" },
    create: { slug: "b2-past-subjunctive", title: "Past Subjunctive and Counterfactual Past", description: "Form derivation, past wishes and influence, reactions and doubt, earlier evaluated events, and unreal past conditions.", cefrLevel: "B2", imageKey: "irregular-verbs:13" }
  });
  const groupSlugs = ["a2-irregular-verbs", "emotions-and-states", "useful-phrases", "a2-reading-listening-lab", "b2-discourse-reporting", "b2-complex-structures"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B2.5 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B2", theme: input.checkpoint ? "Checkpoint" : "Past Subjunctive",
      situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can derive imperfect-subjunctive forms from the preterite.", "You can frame past wishes, influence, reactions, doubt, and earlier events.", "You can evaluate unreal past conditions and results."],
      conceptKeys: ["b2", "past-subjunctive", "counterfactual", "event-order"], reviewSummary: input.summary,
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
  console.log(`Seeded ${lessons.length} B2.5 past-subjunctive learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
