const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-story-main-idea", title: "Find the Main Idea", order: 900, imageKey: "communication-repair:9",
    summary: "Understand who, where, and what changed before translating every detail.", situation: "understanding a short story",
    sentences: [
      ["Ana perdió el autobús, así que llegó tarde al trabajo.", "Ana missed the bus, so she arrived late to work.", "The cause and consequence form the central event."],
      ["Aunque salió temprano, había mucho tráfico.", "Although she left early, there was a lot of traffic.", "Aunque signals that the result contrasts with the expectation."],
      ["Su compañera empezó la reunión sin ella.", "Her colleague started the meeting without her.", "This detail shows the practical consequence."],
      ["Al final, Ana explicó lo ocurrido y todos lo entendieron.", "In the end, Ana explained what happened and everyone understood.", "Al final marks the resolution."],
      ["La idea principal es que un problema de transporte cambió su mañana.", "The main idea is that a transport problem changed her morning.", "A main idea compresses several details into one meaningful statement."]
    ]
  },
  {
    slug: "b1-story-sequence", title: "Follow a Sequence of Events", order: 910, imageKey: "daily-actions:18",
    summary: "Use sequencing signals to reconstruct what happened first, next, and finally.", situation: "retelling a day",
    sentences: [
      ["Primero, preparé el desayuno y revisé mis mensajes.", "First, I prepared breakfast and checked my messages.", "Primero establishes the opening step."],
      ["Luego, fui al centro para hacer unas compras.", "Then, I went downtown to do some shopping.", "Luego moves the story forward."],
      ["Mientras esperaba el autobús, empezó a llover.", "While I was waiting for the bus, it started to rain.", "Mientras introduces the ongoing background."],
      ["Después de comprar, me encontré con Marta.", "After shopping, I met Marta.", "Después de plus an infinitive links actions compactly."],
      ["Por último, volvimos a casa en taxi.", "Finally, we returned home by taxi.", "Por último closes the sequence."]
    ]
  },
  {
    slug: "b1-relative-que", title: "Connect Information with Que", order: 920, imageKey: "city-transport:12",
    summary: "Combine known information about people, places, and things with que.", situation: "describing precisely",
    sentences: [
      ["La mujer que trabaja aquí habla tres idiomas.", "The woman who works here speaks three languages.", "Que connects the woman to identifying information."],
      ["Busco un libro que explique la gramática con ejemplos.", "I am looking for a book that explains grammar with examples.", "The relative clause specifies the kind of book."],
      ["Este es el café que me recomendaste.", "This is the café that you recommended to me.", "Que prevents two short ideas from remaining disconnected."],
      ["Conocí a un profesor que vive en Sevilla.", "I met a teacher who lives in Seville.", "The added clause gives relevant information about a person."],
      ["La aplicación que uso cada día tiene ejercicios cortos.", "The app that I use every day has short exercises.", "The same connector works for things and people."]
    ]
  },
  {
    slug: "b1-report-what-someone-said", title: "Report What Someone Said", order: 930, imageKey: "conversation-and-opinion:10",
    summary: "Pass on messages and viewpoints with dice que, dijo que, and según.", situation: "sharing information from another person",
    sentences: [
      ["Marta dice que llega a las ocho.", "Marta says that she arrives at eight.", "Dice que reports a current message."],
      ["El médico dijo que debía descansar.", "The doctor said that I should rest.", "Dijo que places the reporting event in the past."],
      ["Según Pablo, el museo está cerrado hoy.", "According to Pablo, the museum is closed today.", "Según identifies the source without claiming direct certainty."],
      ["Ana me contó que había encontrado trabajo.", "Ana told me that she had found a job.", "Me contó que introduces news told as a story."],
      ["No sé si vendrá, pero dijo que lo intentaría.", "I do not know if she will come, but she said that she would try.", "The speaker separates uncertainty from the reported promise."]
    ]
  },
  {
    slug: "b1-inference-context", title: "Infer Meaning from Context", order: 940, imageKey: "communication-repair:14",
    summary: "Combine clues instead of stopping at every unknown word.", situation: "reading between the lines",
    sentences: [
      ["Carlos entró con el paraguas mojado y dejó los zapatos junto a la puerta.", "Carlos came in with a wet umbrella and left his shoes by the door.", "The clues strongly suggest rain without stating it directly."],
      ["La tienda estaba oscura y el cartel decía que volvía a las cuatro.", "The store was dark and the sign said they would return at four.", "Together, the clues imply that the store was temporarily closed."],
      ["Lucía miró el reloj varias veces durante la reunión.", "Lucía looked at the clock several times during the meeting.", "Repeated clock-checking can imply impatience or time pressure."],
      ["No respondió al mensaje, aunque apareció en línea.", "He did not reply to the message, although he appeared online.", "Aunque highlights a contrast that invites an inference."],
      ["No conocemos la razón exacta; solo podemos formular una hipótesis.", "We do not know the exact reason; we can only form a hypothesis.", "A good inference stays distinct from a proven fact."]
    ]
  },
  {
    slug: "checkpoint-b1-stories", title: "B1.2 Stories and Comprehension Checkpoint", order: 950, imageKey: "communication-repair:16",
    summary: "Check main ideas, sequence, connected descriptions, reported information, and inference.", situation: "understanding and retelling", checkpoint: true,
    sentences: [
      ["Aunque salió temprano, perdió el tren que iba al centro.", "Although she left early, she missed the train that went downtown.", "Contrast and relative information work together."],
      ["Luego llamó a Marta y le dijo que llegaría tarde.", "Then she called Marta and told her that she would arrive late.", "Sequence and reported information move the story forward."],
      ["Mientras esperaba, vio un café que acababa de abrir.", "While she was waiting, she saw a café that had just opened.", "Background and a relative clause enrich the scene."],
      ["Entró con el abrigo mojado, así que probablemente estaba lloviendo.", "She entered with a wet coat, so it was probably raining.", "Probablemente marks an inference rather than a fact."],
      ["En resumen, un retraso inesperado cambió sus planes.", "In summary, an unexpected delay changed her plans.", "The final sentence captures the main idea."]
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
    { key: "meaning", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "sequence", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "retell", type: ExerciseType.SHORT_ANSWER, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "connect", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "connected_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "narrative_comprehension", rubric: "Express the intended event and preserve its connector or source signal." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Understand and reconstruct the message", instruction: "Find the central event and connector before producing the complete Spanish sentence.", questionText: check.question, answerJson, explanation: "Strong comprehension follows the event structure, reference words, and connectors rather than translating isolated words.", difficulty: 3, order, xpReward: 14, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "stories-comprehension" }, update: { title: "Stories and Comprehension", description: "Main ideas, sequence, relative clauses, reported information, and inference.", cefrLevel: "B1", imageKey: "communication-repair:9" }, create: { slug: "stories-comprehension", title: "Stories and Comprehension", description: "Main ideas, sequence, relative clauses, reported information, and inference.", cefrLevel: "B1", imageKey: "communication-repair:9" } });
  const groupSlugs = ["daily-actions", "city-transport", "essential-words", "useful-phrases", "b1-conversation-stories", "b1-plans-reactions"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Stories", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can identify the main event and its sequence.", "You can connect and report information.", "You can distinguish evidence from inference."], conceptKeys: ["b1", "stories", "comprehension", "connectors"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 15 : 11, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B1.2 story and comprehension packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
