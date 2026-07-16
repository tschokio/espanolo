const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-opinion-frames", title: "State an Opinion Clearly", order: 840, imageKey: "conversation-and-opinion:3",
    summary: "Use creo que, pienso que, and para mí to introduce a clear personal view.", situation: "sharing a simple opinion",
    sentences: [
      ["Creo que aprender idiomas es importante.", "I think learning languages is important.", "Creo que introduces a personal view without sounding too absolute."],
      ["Pienso que esta opción es mejor.", "I think this option is better.", "Pienso que works as another reusable opinion frame."],
      ["Para mí, vivir cerca del trabajo es práctico.", "For me, living near work is practical.", "Para mí marks the view as personal."],
      ["En mi opinión, el transporte público es necesario.", "In my opinion, public transport is necessary.", "En mi opinión is useful in more formal discussion."],
      ["No creo que sea fácil, pero es posible.", "I do not think it is easy, but it is possible.", "No creo que softens a negative judgment; this model introduces the useful sea chunk."]
    ]
  },
  {
    slug: "b1-give-reasons", title: "Support an Opinion with Reasons", order: 850, imageKey: "conversation-and-opinion:1",
    summary: "Connect an opinion to a reason, consequence, or contrast.", situation: "explaining why you think something",
    sentences: [
      ["Prefiero el tren porque puedo descansar.", "I prefer the train because I can rest.", "Porque introduces the reason."],
      ["Trabajo desde casa, por eso ahorro tiempo.", "I work from home, so I save time.", "Por eso introduces a consequence."],
      ["Aunque es caro, el curso es muy útil.", "Although it is expensive, the course is very useful.", "Aunque introduces a contrast that does not cancel the main point."],
      ["Además, puedo estudiar a mi ritmo.", "In addition, I can study at my own pace.", "Además adds another supporting reason."],
      ["Sin embargo, necesito más práctica oral.", "However, I need more speaking practice.", "Sin embargo introduces a limitation or opposing point."]
    ]
  },
  {
    slug: "b1-agree-disagree-politely", title: "Agree and Disagree Politely", order: 860, imageKey: "conversation-and-opinion:4",
    summary: "Respond to another view while keeping the conversation respectful and open.", situation: "friendly discussion",
    sentences: [
      ["Estoy de acuerdo contigo.", "I agree with you.", "Contigo identifies the person whose view you share."],
      ["Tienes razón, especialmente sobre el precio.", "You are right, especially about the price.", "Tienes razón acknowledges a strong point."],
      ["Entiendo tu punto, pero lo veo de otra manera.", "I understand your point, but I see it differently.", "Acknowledge first, then contrast politely."],
      ["No estoy del todo de acuerdo.", "I do not completely agree.", "Del todo softens a direct disagreement."],
      ["Puede ser, aunque prefiero la primera opción.", "That may be, although I prefer the first option.", "Puede ser leaves room for the other person's view."]
    ]
  },
  {
    slug: "b1-compare-options", title: "Compare Options and Recommend", order: 870, imageKey: "conversation-and-opinion:8",
    summary: "Compare cost, usefulness, speed, and convenience before making a recommendation.", situation: "choosing between alternatives",
    sentences: [
      ["El tren es más rápido que el autobús.", "The train is faster than the bus.", "Más ... que forms a comparison."],
      ["El autobús es menos caro, pero tarda más.", "The bus is less expensive, but it takes longer.", "Menos ... and pero balance two criteria."],
      ["La primera opción es tan práctica como la segunda.", "The first option is as practical as the second.", "Tan ... como expresses equality."],
      ["Te recomiendo el tren porque es más cómodo.", "I recommend the train because it is more comfortable.", "A recommendation becomes stronger with a reason."],
      ["Depende de tu presupuesto y del tiempo disponible.", "It depends on your budget and the available time.", "Depende de avoids pretending one option is always best."]
    ]
  },
  {
    slug: "b1-connected-opinion", title: "Build a Connected Opinion", order: 880, imageKey: "conversation-and-opinion:12",
    summary: "Organize an opinion into a position, reasons, contrast, and conclusion.", situation: "speaking or writing for one minute",
    sentences: [
      ["En mi opinión, estudiar en línea es una buena opción.", "In my opinion, studying online is a good option.", "Open with a clear position."],
      ["Primero, permite estudiar a cualquier hora.", "First, it allows you to study at any time.", "Primero organizes the first supporting point."],
      ["Además, no es necesario viajar.", "In addition, it is not necessary to travel.", "Además adds a second point."],
      ["Sin embargo, hablar con otras personas puede ser más difícil.", "However, speaking with other people can be more difficult.", "A contrast makes the opinion balanced."],
      ["Por eso, recomiendo combinar las clases con conversación.", "Therefore, I recommend combining classes with conversation.", "Finish with a consequence or recommendation."],
      ["En resumen, es flexible, pero necesita práctica activa.", "In summary, it is flexible, but it needs active practice.", "En resumen closes the contribution clearly."]
    ]
  },
  {
    slug: "checkpoint-b1-opinions", title: "B1.1 Opinions and Connected Production Checkpoint", order: 890, imageKey: "conversation-and-opinion:16",
    summary: "Check opinions, reasons, polite interaction, comparisons, and connected production.", situation: "guided discussion", checkpoint: true,
    sentences: [
      ["Creo que esta opción es mejor porque es más práctica.", "I think this option is better because it is more practical.", "Position plus reason."],
      ["Entiendo tu punto, pero no estoy del todo de acuerdo.", "I understand your point, but I do not completely agree.", "Acknowledgment plus polite disagreement."],
      ["El tren es más rápido, aunque el autobús es menos caro.", "The train is faster, although the bus is less expensive.", "Comparison plus contrast."],
      ["Además, podemos ahorrar tiempo.", "In addition, we can save time.", "Add another supporting point."],
      ["En resumen, recomiendo combinar las dos opciones.", "In summary, I recommend combining the two options.", "Conclude with a recommendation."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`]; };

function checks(input) {
  return [
    { key: "recognize-function", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: [[input.sentences[0][0], input.sentences[0][0], true], [input.sentences[1][0], input.sentences[1][0], false], [input.sentences[2][0], input.sentences[2][0], false]] },
    { key: "build-connected", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "dialogue-response", type: ExerciseType.DIALOGUE_REPLY, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "write-model", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords ? { correctWords: check.correctWords, goal: "connected_word_order" } : { correct: check.correct, accepted: accepted(check.correct), goal: check.type === ExerciseType.DIALOGUE_REPLY ? "dialogue" : "opinion_production", rubric: "State the intended idea clearly and use the lesson connector or interaction frame." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: check.type === ExerciseType.DIALOGUE_REPLY ? "Respond in the discussion" : check.type === ExerciseType.WRITING_PROMPT ? "Produce a connected idea" : "Use the opinion model", instruction: "Use the frame and connector as one meaningful contribution, not as isolated vocabulary.", questionText: check.question, answerJson, explanation: "A strong contribution states a position or response and connects it to a reason, contrast, or conclusion.", difficulty: 3, order, xpReward: 14, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "opinions-connected-production" }, update: { title: "Opinions and Connected Production", description: "Opinion frames, reasons, interaction, comparison, and coherent connected output.", cefrLevel: "B1", imageKey: "conversation-and-opinion:3" }, create: { slug: "opinions-connected-production", title: "Opinions and Connected Production", description: "Opinion frames, reasons, interaction, comparison, and coherent connected output.", cefrLevel: "B1", imageKey: "conversation-and-opinion:3" } });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["a2-preferences-hobbies", "daily-actions", "city-transport", "essential-words", "useful-phrases", "b1-conversation-stories", "b1-plans-reactions"] } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  for (const input of lessons) {
    const groupSlugs = [...(input.slug.includes("compare") ? ["city-transport", "essential-words"] : input.slug.includes("connected") || input.checkpoint ? ["a2-preferences-hobbies", "daily-actions", "essential-words"] : ["a2-preferences-hobbies", "useful-phrases", "essential-words"]), "b1-conversation-stories", "b1-plans-reactions"];
    const common = { title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Opinions", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can state and support a personal view.", "You can respond politely to another viewpoint.", "You can connect several ideas into a coherent contribution."], conceptKeys: ["b1", "opinions", "connectors", "connected-production"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 14 : 10, topicId: topic.id };
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id })) } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B1.1 opinion learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
