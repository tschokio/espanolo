const { PrismaClient, ExerciseType } = require("@prisma/client");
const { seedPersonalALesson } = require("./seed-a2-personal-a");
const { seedParticipantObjectPronouns } = require("./seed-a2-participant-object-pronouns");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a2-direct-objects-lo-la", title: "Direct Objects: Lo and La", order: 735, imageKey: "object-pronouns-and-shopping:1",
    summary: "Replace one known masculine or feminine object with lo or la.", situation: "talking about known objects",
    sentences: [
      ["Compro el pan. Lo compro.", "I buy the bread. I buy it.", "Lo replaces the known masculine object el pan."],
      ["Veo el libro. Lo veo.", "I see the book. I see it.", "Place lo before the conjugated verb."],
      ["Compro la camisa. La compro.", "I buy the shirt. I buy it.", "La replaces the known feminine object la camisa."],
      ["Leo la carta. La leo.", "I read the letter. I read it.", "The pronoun avoids repeating la carta."]
    ]
  },
  {
    slug: "a2-direct-objects-los-las", title: "Direct Objects: Los and Las", order: 740, imageKey: "object-pronouns-and-shopping:2",
    summary: "Replace known plural objects with los or las.", situation: "shopping for several things",
    sentences: [
      ["Necesito los libros. Los necesito.", "I need the books. I need them.", "Los replaces a masculine plural object."],
      ["Compro los zapatos. Los compro.", "I buy the shoes. I buy them.", "Los stands before compro."],
      ["Veo las llaves. Las veo.", "I see the keys. I see them.", "Las replaces a feminine plural object."],
      ["Quiero las manzanas. Las quiero.", "I want the apples. I want them.", "The pronoun agrees with the object, not the speaker."]
    ]
  },
  {
    slug: "a2-indirect-object-le", title: "Giving and Sending with Le", order: 750, imageKey: "object-pronouns-and-shopping:3",
    summary: "Use le for the person who receives something.", situation: "giving, showing, and sending",
    sentences: [
      ["Doy el libro a Ana. Le doy el libro.", "I give the book to Ana. I give her the book.", "Le replaces a Ana, the receiver."],
      ["Envío un mensaje a Luis. Le envío un mensaje.", "I send Luis a message. I send him a message.", "Le goes before the conjugated verb."],
      ["Muestro el mapa a la señora. Le muestro el mapa.", "I show the woman the map. I show her the map.", "The thing remains explicit; le marks the receiver."],
      ["Ofrezco agua al cliente. Le ofrezco agua.", "I offer the customer water. I offer them water.", "Le can refer to a male or female receiver."]
    ]
  },
  {
    slug: "a2-shopping-with-pronouns", title: "Shopping with Object Pronouns", order: 760, imageKey: "object-pronouns-and-shopping:12",
    summary: "Use object pronouns in short, useful shopping exchanges.", situation: "choosing and buying an item",
    sentences: [
      ["¿Tiene la camisa azul? Sí, la tengo.", "Do you have the blue shirt? Yes, I have it.", "La refers back to la camisa."],
      ["¿Quiere los zapatos? Sí, los quiero.", "Do you want the shoes? Yes, I want them.", "Los prevents repeating los zapatos."],
      ["La camisa cuesta veinte euros. La compro.", "The shirt costs twenty euros. I buy it.", "Use la once the shirt is already known."],
      ["No quiero las bolsas. No las necesito.", "I do not want the bags. I do not need them.", "No comes before the object pronoun and verb."],
      ["¿Le muestro otra talla? Sí, gracias.", "Shall I show you another size? Yes, thank you.", "Le marks the person receiving the service."]
    ]
  },
  {
    slug: "checkpoint-a2-object-pronouns-shopping", title: "A2.6 Object Pronouns and Shopping Checkpoint", order: 770, imageKey: "object-pronouns-and-shopping:16",
    summary: "Check direct and indirect object pronouns in practical shopping language.", situation: "mixed shopping review", checkpoint: true,
    sentences: [
      ["Compro el pan. Lo compro.", "I buy the bread. I buy it.", "Lo replaces one masculine object."],
      ["Quiero las manzanas. Las quiero.", "I want the apples. I want them.", "Las replaces feminine plural objects."],
      ["Le doy el libro a Ana.", "I give Ana the book.", "Le marks the receiver."],
      ["¿Quiere los zapatos? Sí, los quiero.", "Do you want the shoes? Yes, I want them.", "Use the pronoun in the reply."]
    ]
  }
];

function words(sentence) {
  return sentence.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
}

function accepted(sentence) {
  const plain = sentence.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`, `${plain}?`];
}

async function upsertExercise(lesson, input, order) {
  const slug = `${lesson.slug}-${input.key}`;
  const saved = await prisma.exercise.upsert({
    where: { slug },
    update: { lessonId: lesson.id, topicId: lesson.topicId, type: input.type, prompt: input.prompt, instruction: input.instruction, questionText: input.question, answerJson: input.answer, explanation: input.explanation, difficulty: input.difficulty || 2, order, xpReward: 12, imageKey: input.imageKey || lesson.imageKey },
    create: { slug, lessonId: lesson.id, topicId: lesson.topicId, type: input.type, prompt: input.prompt, instruction: input.instruction, questionText: input.question, answerJson: input.answer, explanation: input.explanation, difficulty: input.difficulty || 2, order, xpReward: 12, imageKey: input.imageKey || lesson.imageKey }
  });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (input.options?.length) await prisma.exerciseOption.createMany({ data: input.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

function authoredChecks(input) {
  const [first, second, third, fourth] = input.sentences.map((item) => item[0]);
  return [
    { key: "meaning-check", type: ExerciseType.MULTIPLE_CHOICE, prompt: "Choose the pronoun", instruction: "Choose the object pronoun that agrees with the known object.", question: input.slug.includes("indirect") ? "Doy el libro a Ana. ____ doy el libro." : first.split(".")[0] + ". ____ " + first.split(".")[1]?.trim(), answer: { correct: input.slug.includes("indirect") ? "le" : first.split(".")[1]?.trim().split(" ")[0]?.toLowerCase(), goal: "object_pronoun" }, options: input.slug.includes("indirect") ? [["Le", "le", true], ["La", "la", false], ["Lo", "lo", false]] : [[first.split(".")[1]?.trim().split(" ")[0] || "Lo", first.split(".")[1]?.trim().split(" ")[0]?.toLowerCase(), true], ["Me", "me", false], ["Te", "te", false]], explanation: "The pronoun agrees with the object or marks the receiver." },
    { key: "build-model", type: ExerciseType.SENTENCE_BUILDER, prompt: "Build the replacement sentence", instruction: "Put the object pronoun before the conjugated verb.", question: second, answer: { correctWords: words(second.split(".").slice(-2, -1)[0] || second), goal: "word_order" }, explanation: "Object pronouns normally stand before a conjugated verb." },
    { key: "translate-model", type: ExerciseType.TRANSLATION, prompt: "Produce the Spanish model", instruction: "Use the object pronoun instead of repeating the noun.", question: input.sentences[2][1], answer: { correct: third, accepted: accepted(third), goal: "active_production" }, explanation: input.sentences[2][2] },
    { key: "recall-model", type: ExerciseType.SHORT_ANSWER, prompt: "Recall the useful sentence", instruction: "Write the complete Spanish model.", question: input.sentences[3][1], answer: { correct: fourth, accepted: accepted(fourth), goal: "active_production" }, explanation: input.sentences[3][2] }
  ];
}

async function main() {
  await seedPersonalALesson(prisma);
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "object-pronouns-shopping" },
    update: { title: "Object Pronouns and Shopping", description: "Direct and indirect object pronouns in concrete shopping and giving situations.", cefrLevel: "A2", imageKey: "object-pronouns-and-shopping:1" },
    create: { slug: "object-pronouns-shopping", title: "Object Pronouns and Shopping", description: "Direct and indirect object pronouns in concrete shopping and giving situations.", cefrLevel: "A2", imageKey: "object-pronouns-and-shopping:1" }
  });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["home-and-objects", "clothing-basics", "food-and-ordering", "fruit-and-produce", "essential-words"] } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  for (const input of lessons) {
    const groupSlugs = input.slug.includes("shopping") ? ["clothing-basics", "essential-words"] : input.slug.includes("los-las") ? ["home-and-objects", "fruit-and-produce"] : ["home-and-objects", "food-and-ordering"];
    const data = { title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Object Pronouns", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can identify what an object pronoun replaces.", "You can place the pronoun before a conjugated verb.", "You can use the pattern in a concrete exchange."], conceptKeys: ["a2", "object-pronouns", "shopping"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 18 : 15, topicId: topic.id };
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...data, vocabularyGroups: { set: groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id })) } }, create: { slug: input.slug, ...data, vocabularyGroups: { connect: groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id })) } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const stalePrefix = `${input.slug}-`;
    const checks = authoredChecks(input);
    for (let index = 0; index < checks.length; index += 1) await upsertExercise(lesson, checks[index], index + 1);
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: stalePrefix }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  await seedParticipantObjectPronouns(prisma);
  console.log(`Seeded ${lessons.length} A2.6 object-pronoun learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
