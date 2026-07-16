const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-subjunctive-meaning", title: "Understand Why the Subjunctive Appears", order: 1020, imageKey: "conversation-and-opinion:5",
    summary: "Recognize two-part sentences where a wish, influence, judgment, or reaction frames another action.", situation: "reacting to another possible action",
    sentences: [
      ["Quiero que vengas mañana.", "I want you to come tomorrow.", "Quiero frames the desired action; que introduces the other person's action."],
      ["Es importante que descanses.", "It is important that you rest.", "The judgment es importante frames descansar as necessary, not as a stated fact."],
      ["Me alegra que estés aquí.", "I am glad that you are here.", "An emotional reaction frames the following situation."],
      ["Creo que Ana trabaja hoy.", "I think Ana is working today.", "A positive belief normally presents information and keeps the indicative."],
      ["No creo que Ana trabaje hoy.", "I do not think Ana is working today.", "Negated belief no longer presents the action as an accepted fact."]
    ]
  },
  {
    slug: "b1-subjunctive-regular", title: "Build Regular Present Subjunctive Forms", order: 1030, imageKey: "grammar-scenes:9",
    summary: "Start from the yo form, remove -o, and use the opposite vowel endings.", situation: "forming reliable present subjunctive verbs",
    sentences: [
      ["Espero que hables con Marta.", "I hope that you speak with Marta.", "Hablar changes to hables for tú."],
      ["Es mejor que comamos antes.", "It is better that we eat beforehand.", "Comer changes to comamos for nosotros."],
      ["Quieren que vivamos cerca.", "They want us to live nearby.", "Vivir changes to vivamos."],
      ["Necesito que llegues temprano.", "I need you to arrive early.", "Llegar changes spelling to preserve its sound."],
      ["Prefiero que busques otra opción.", "I prefer that you look for another option.", "Buscar changes c to qu before e."]
    ]
  },
  {
    slug: "b1-subjunctive-irregular", title: "Use Essential Irregular Subjunctive Forms", order: 1040, imageKey: "irregular-verbs:15",
    summary: "Learn the most frequent irregular forms inside complete useful frames.", situation: "requests and reactions with frequent verbs",
    sentences: [
      ["Espero que seas feliz.", "I hope that you are happy.", "Ser uses the irregular form seas."],
      ["Quiero que vayas conmigo.", "I want you to go with me.", "Ir uses vayas."],
      ["Es posible que haya un problema.", "It is possible that there is a problem.", "Haber uses haya."],
      ["Me alegra que estés mejor.", "I am glad that you are feeling better.", "Estar uses estés with a written accent."],
      ["Dudo que él sepa la respuesta.", "I doubt that he knows the answer.", "Saber uses sepa."]
    ]
  },
  {
    slug: "b1-wishes-requests", title: "Express Wishes and Requests", order: 1050, imageKey: "wants-needs-and-possession:13",
    summary: "Use querer que, esperar que, pedir que, and preferir que when another person performs the action.", situation: "asking for a change or expressing a wish",
    sentences: [
      ["Quiero que me llames esta tarde.", "I want you to call me this afternoon.", "Different subjects make querer que plus subjunctive necessary."],
      ["Espero que todo salga bien.", "I hope that everything goes well.", "Esperar que presents a hoped-for result."],
      ["Te pido que hables más despacio.", "I ask you to speak more slowly.", "Pedir que influences another person's action."],
      ["Preferimos que vengáis el sábado.", "We prefer you all to come on Saturday.", "Preferir que frames a preference about another subject."],
      ["Quiero viajar mañana.", "I want to travel tomorrow.", "With the same subject, querer is followed directly by the infinitive."]
    ]
  },
  {
    slug: "b1-advice-reactions-subjunctive", title: "Give Advice and Emotional Reactions", order: 1060, imageKey: "emotions-and-states:10",
    summary: "Use impersonal judgments and emotional reactions to frame another action.", situation: "supporting someone with advice and reactions",
    sentences: [
      ["Es necesario que descanses más.", "It is necessary that you rest more.", "An impersonal necessity leads to the subjunctive."],
      ["Es mejor que hables con ella.", "It is better that you speak with her.", "Es mejor que gives advice without a direct command."],
      ["Me preocupa que trabajes tanto.", "I am worried that you work so much.", "The speaker reacts emotionally to the situation."],
      ["Nos sorprende que lleguen tan pronto.", "We are surprised that they arrive so early.", "Surprise frames the following event as a reaction."],
      ["Es verdad que trabaja mucho.", "It is true that she works a lot.", "Es verdad presents a fact and therefore uses the indicative."]
    ]
  },
  {
    slug: "checkpoint-b1-subjunctive", title: "B1.4 Present Subjunctive Checkpoint", order: 1070, imageKey: "grammar-scenes:16",
    summary: "Check meaning triggers, regular and irregular forms, wishes, requests, advice, and reactions.", situation: "responding to plans and concerns", checkpoint: true,
    sentences: [
      ["Espero que tengas tiempo mañana.", "I hope that you have time tomorrow.", "A hope about another situation uses tengas."],
      ["Es importante que hablemos hoy.", "It is important that we speak today.", "An impersonal judgment frames the action."],
      ["Quiero que vengas, pero entiendo que estás ocupado.", "I want you to come, but I understand that you are busy.", "A wish uses subjunctive; accepted information uses indicative."],
      ["Me alegra que todo salga bien.", "I am glad that everything is going well.", "An emotional reaction uses salga."],
      ["No creo que sea necesario cambiar el plan.", "I do not think it is necessary to change the plan.", "Negated belief uses sea in the dependent clause."]
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
    { key: "respond", type: ExerciseType.DIALOGUE_REPLY, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "apply", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "subjunctive_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "subjunctive_meaning", rubric: "Make the framing expression and the other subject's action clear; choose mood from the intended status of that action." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Frame another action", instruction: "Identify the wish, influence, judgment, reaction, doubt, or accepted fact before choosing the verb form.", questionText: check.question, answerJson, explanation: "The subjunctive is learned most reliably as the form inside a meaning frame, not as a free-standing tense table.", difficulty: 4, order, xpReward: 15, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "present-subjunctive-meaning" }, update: { title: "Present Subjunctive by Meaning", description: "Meaning frames, regular and irregular forms, wishes, influence, advice, emotion, doubt, and fact contrast.", cefrLevel: "B1", imageKey: "conversation-and-opinion:5" }, create: { slug: "present-subjunctive-meaning", title: "Present Subjunctive by Meaning", description: "Meaning frames, regular and irregular forms, wishes, influence, advice, emotion, doubt, and fact contrast.", cefrLevel: "B1", imageKey: "conversation-and-opinion:5" } });
  const groupSlugs = ["emotions-and-states", "daily-actions", "essential-words", "useful-phrases", "b1-conversation-stories", "b1-plans-reactions"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B1.4 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Subjunctive", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can recognize why a meaning frame requires the subjunctive.", "You can form frequent regular and irregular present subjunctive verbs.", "You can express wishes, requests, advice, reactions, and doubt."], conceptKeys: ["b1", "subjunctive", "meaning-frames", "two-subjects"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 16 : 12, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B1.4 present subjunctive packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
