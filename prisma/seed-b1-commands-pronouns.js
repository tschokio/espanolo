const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-affirmative-tu-commands", title: "Give Clear Affirmative Tú Instructions", order: 1200, imageKey: "communication-repair:10",
    summary: "Use short affirmative tú commands to guide a familiar person through an action.", situation: "giving friendly instructions",
    sentences: [
      ["Habla más despacio.", "Speak more slowly.", "A regular affirmative tú command uses the third-person singular present form."],
      ["Abre la puerta, por favor.", "Open the door, please.", "The command can remain direct while por favor keeps it courteous."],
      ["Escribe tu nombre aquí.", "Write your name here.", "Regular -ir verbs follow the same affirmative pattern."],
      ["Espera un momento.", "Wait a moment.", "A short command can solve an immediate practical need."],
      ["Primero corta las verduras y después prepara la salsa.", "First cut the vegetables and then prepare the sauce.", "Sequence markers turn commands into clear instructions."]
    ]
  },
  {
    slug: "b1-irregular-tu-commands", title: "Use Essential Irregular Tú Commands", order: 1210, imageKey: "irregular-verbs:16",
    summary: "Learn frequent irregular affirmative commands as complete high-value chunks.", situation: "reacting quickly in everyday situations",
    sentences: [
      ["Ven aquí un momento.", "Come here for a moment.", "Ven is the irregular affirmative command of venir."],
      ["Haz la reserva hoy.", "Make the reservation today.", "Haz comes from hacer."],
      ["Dime la verdad.", "Tell me the truth.", "Di becomes dime when the object pronoun is attached."],
      ["Pon el libro en la mesa.", "Put the book on the table.", "Pon comes from poner."],
      ["Ten cuidado y sal por esta puerta.", "Be careful and leave through this door.", "Ten and sal are frequent irregular command chunks."]
    ]
  },
  {
    slug: "b1-negative-commands", title: "Build Negative Tú Commands", order: 1220, imageKey: "communication-repair:8",
    summary: "Use no plus the present subjunctive form to tell a familiar person not to act.", situation: "warning or stopping an action",
    sentences: [
      ["No hables tan rápido.", "Do not speak so quickly.", "Negative tú commands use the present subjunctive."],
      ["No abras la ventana.", "Do not open the window.", "No comes before the command form."],
      ["No llegues tarde.", "Do not arrive late.", "Llegar changes spelling to keep its sound."],
      ["No hagas eso.", "Do not do that.", "Hacer uses the irregular subjunctive form hagas."],
      ["No vayas solo.", "Do not go alone.", "Ir uses the irregular form vayas."]
    ]
  },
  {
    slug: "b1-pronouns-with-commands", title: "Place Pronouns with Commands", order: 1230, imageKey: "object-pronouns-and-shopping:13",
    summary: "Attach pronouns to affirmative commands and place them before negative commands.", situation: "giving concise instructions about known objects",
    sentences: [
      ["Cómpralo hoy.", "Buy it today.", "Lo attaches to the end of an affirmative command."],
      ["Llámame esta tarde.", "Call me this afternoon.", "Me attaches to llama; the written accent preserves the original stress."],
      ["Dímelo otra vez.", "Tell it to me again.", "Two pronouns attach in their normal order; the accent preserves pronunciation."],
      ["No lo compres todavía.", "Do not buy it yet.", "With a negative command, lo stands before the verb."],
      ["No me llames tan tarde.", "Do not call me so late.", "Me also moves before a negative command."]
    ]
  },
  {
    slug: "b1-double-object-pronouns", title: "Combine Recipient and Thing Pronouns", order: 1240, imageKey: "object-pronouns-and-shopping:15",
    summary: "Use recipient plus direct-object pronouns in the fixed order, changing le or les to se before lo/la/los/las.", situation: "passing on known things and information",
    sentences: [
      ["Le doy el libro a Ana.", "I give the book to Ana.", "The full sentence makes recipient and thing visible."],
      ["Se lo doy.", "I give it to her.", "Le changes to se before lo; se refers to Ana and lo to the book."],
      ["Les envío las fotos a mis padres.", "I send the photos to my parents.", "Les marks the plural recipients in the full sentence."],
      ["Se las envío mañana.", "I will send them to them tomorrow.", "Les becomes se and las replaces the photos."],
      ["¿Puedes explicármelo?", "Can you explain it to me?", "Me plus lo can attach to an infinitive after puedes."]
    ]
  },
  {
    slug: "checkpoint-b1-commands-pronouns", title: "B1.7 Commands and Pronouns Checkpoint", order: 1250, imageKey: "object-pronouns-and-shopping:16",
    summary: "Check affirmative and negative commands, pronoun placement, accents, and double-object combinations.", situation: "giving and following practical instructions", checkpoint: true,
    sentences: [
      ["Abre la aplicación y escribe tu nombre.", "Open the app and write your name.", "Two regular commands form a clear sequence."],
      ["No cierres la página todavía.", "Do not close the page yet.", "A negative command uses the subjunctive form cierres."],
      ["Mándame el documento, por favor.", "Send me the document, please.", "Me attaches to the affirmative command."],
      ["No se lo envíes a Marta.", "Do not send it to Marta.", "Both pronouns precede a negative command."],
      ["Dímelo cuando termines.", "Tell it to me when you finish.", "Both pronouns attach to the affirmative irregular command."]
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
    { key: "instruct", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "command_pronoun_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "commands_pronouns", rubric: "Choose affirmative or negative command form, then place and accent any pronouns correctly." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Give or follow a practical instruction", instruction: "Decide whether the instruction is affirmative or negative before placing any object pronouns.", questionText: check.question, answerJson, explanation: "Affirmative commands attach pronouns; negative commands place them before the verb. Double pronouns keep recipient before thing.", difficulty: 4, order, xpReward: 15, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "commands-combined-pronouns" }, update: { title: "Commands and Combined Pronouns", description: "Affirmative and negative tú commands, pronoun placement, written accents, and double-object combinations.", cefrLevel: "B1", imageKey: "communication-repair:10" }, create: { slug: "commands-combined-pronouns", title: "Commands and Combined Pronouns", description: "Affirmative and negative tú commands, pronoun placement, written accents, and double-object combinations.", cefrLevel: "B1", imageKey: "communication-repair:10" } });
  const groupSlugs = ["daily-actions", "essential-words", "useful-phrases", "city-transport", "b1-conversation-stories", "b1-plans-reactions"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B1.7 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Commands", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can give clear affirmative and negative familiar commands.", "You can place pronouns correctly with commands and infinitives.", "You can combine recipient and thing pronouns without repeating known nouns."], conceptKeys: ["b1", "commands", "object-pronouns", "instructions"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 16 : 12, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B1.7 command and pronoun packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
