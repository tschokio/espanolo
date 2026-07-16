const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-conditional-meaning", title: "Open a Possibility with the Conditional", order: 1140, imageKey: "conversation-and-opinion:11",
    summary: "Use the conditional for imagined results, softened wishes, and courteous possibilities.", situation: "talking about what would be possible",
    sentences: [
      ["Me gustaría aprender más español.", "I would like to learn more Spanish.", "Me gustaría expresses a softened wish rather than a direct demand."],
      ["Viajaría más con más tiempo.", "I would travel more with more time.", "The action depends on an imagined circumstance."],
      ["¿Podrías ayudarme?", "Could you help me?", "The conditional makes the request more courteous."],
      ["Sería una buena idea.", "It would be a good idea.", "Sería evaluates an imagined option."],
      ["Ahora no puedo, pero mañana podría.", "I cannot now, but tomorrow I might be able to.", "Podría presents a possibility without a firm commitment."]
    ]
  },
  {
    slug: "b1-regular-conditional", title: "Build Regular Conditional Forms", order: 1150, imageKey: "grammar-scenes:13",
    summary: "Attach one set of imperfect-style endings to the complete infinitive.", situation: "imagining outcomes for different people",
    sentences: [
      ["Yo hablaría con Marta.", "I would speak with Marta.", "The infinitive hablar receives -ía."],
      ["Tú comerías antes.", "You would eat beforehand.", "The tú ending is -ías."],
      ["Viviríamos cerca del mar.", "We would live near the sea.", "The nosotros ending is -íamos."],
      ["Ellos trabajarían desde casa.", "They would work from home.", "The plural ending is -ían."],
      ["¿Compraríais esa casa?", "Would you all buy that house?", "The vosotros ending is -íais."]
    ]
  },
  {
    slug: "b1-irregular-conditional", title: "Reuse Irregular Future Stems", order: 1160, imageKey: "irregular-verbs:14",
    summary: "Use the same irregular stems as the future together with conditional endings.", situation: "discussing imagined ability and outcomes",
    sentences: [
      ["Tendría más tiempo en verano.", "I would have more time in summer.", "Tener uses tendr- in both future and conditional."],
      ["Podríamos terminar hoy.", "We could finish today.", "Poder uses podr-."],
      ["Ella vendría con nosotros.", "She would come with us.", "Venir uses vendr-."],
      ["Harían el viaje en tren.", "They would make the trip by train.", "Hacer uses har-."],
      ["Te diría la verdad.", "I would tell you the truth.", "Decir uses dir-." ]
    ]
  },
  {
    slug: "b1-conditional-advice", title: "Give Softer Advice and Suggestions", order: 1170, imageKey: "communication-repair:15",
    summary: "Use deberías, podrías, and yo que tú to offer options without sounding like an order.", situation: "helping someone decide",
    sentences: [
      ["Deberías descansar más.", "You should rest more.", "Deberías gives advice rather than a direct command."],
      ["Podrías hablar con tu profesora.", "You could speak with your teacher.", "Podrías offers one possible action."],
      ["Yo que tú, esperaría un día.", "If I were you, I would wait a day.", "Yo que tú introduces advice from an imagined position."],
      ["Sería mejor reservar antes.", "It would be better to reserve beforehand.", "Sería mejor makes a recommendation impersonal and softer."],
      ["¿Te importaría repetirlo?", "Would you mind repeating it?", "The conditional creates a very courteous request." ]
    ]
  },
  {
    slug: "b1-hypothetical-si", title: "Build Hypothetical Si Sentences", order: 1180, imageKey: "grammar-scenes:15",
    summary: "Combine imperfect subjunctive after si with a conditional imagined result.", situation: "imagining a different present",
    sentences: [
      ["Si tuviera más tiempo, viajaría más.", "If I had more time, I would travel more.", "Tuviera marks the hypothetical condition; viajaría gives the imagined result."],
      ["Si pudiera, te ayudaría.", "If I could, I would help you.", "Pudiera and ayudaría keep both sides hypothetical."],
      ["Si viviéramos cerca, nos veríamos más.", "If we lived nearby, we would see each other more.", "Both subjects are imagined rather than asserted."],
      ["¿Qué harías si fueras yo?", "What would you do if you were me?", "The result may come before the si clause."],
      ["Si hiciera buen tiempo, iríamos andando.", "If the weather were good, we would walk.", "Hiciera frames weather contrary to or distant from the current situation."]
    ]
  },
  {
    slug: "checkpoint-b1-conditional", title: "B1.6 Conditional and Hypotheses Checkpoint", order: 1190, imageKey: "conversation-and-opinion:16",
    summary: "Check polite wishes, regular and irregular forms, advice, and hypothetical si sentences.", situation: "discussing choices and imagined outcomes", checkpoint: true,
    sentences: [
      ["Me gustaría cambiar de trabajo.", "I would like to change jobs.", "A softened wish opens the discussion."],
      ["Podría buscar algo más cerca.", "I could look for something closer.", "Podría presents a possibility."],
      ["Yo que tú, hablaría primero con la directora.", "If I were you, I would first speak with the director.", "The frame offers personal advice without commanding."],
      ["Si encontrara un buen puesto, lo aceptaría.", "If I found a good position, I would accept it.", "The condition is hypothetical and the result conditional."],
      ["¿Te importaría darme tu opinión?", "Would you mind giving me your opinion?", "The final request stays courteous."]
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
    { key: "imagine", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "conditional_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "conditional_hypothesis", rubric: "Keep a hypothetical si clause in the imperfect subjunctive and its imagined result in the conditional." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Express an imagined or softened possibility", instruction: "Decide whether you are making a courteous request, giving advice, or linking a hypothetical condition to its result.", questionText: check.question, answerJson, explanation: "Conditional language is easiest to retrieve through complete communicative frames such as me gustaría, podrías, and si tuviera..., haría....", difficulty: 4, order, xpReward: 15, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "conditional-hypotheses" }, update: { title: "Conditional and Hypotheses", description: "Conditional meaning and forms, courteous requests, advice, and hypothetical si clauses.", cefrLevel: "B1", imageKey: "conversation-and-opinion:11" }, create: { slug: "conditional-hypotheses", title: "Conditional and Hypotheses", description: "Conditional meaning and forms, courteous requests, advice, and hypothetical si clauses.", cefrLevel: "B1", imageKey: "conversation-and-opinion:11" } });
  const groupSlugs = ["a2-preferences-hobbies", "daily-actions", "essential-words", "useful-phrases", "b1-conversation-stories", "b1-plans-reactions"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B1.6 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Conditional", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can express softened wishes and courteous possibilities.", "You can form regular and frequent irregular conditional verbs.", "You can connect a hypothetical condition to an imagined result."], conceptKeys: ["b1", "conditional", "hypotheses", "politeness"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 16 : 12, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B1.6 conditional learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
