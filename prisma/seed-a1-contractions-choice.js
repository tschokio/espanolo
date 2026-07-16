const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const packages = [
  {
    slug: "a1-al-del-contractions", topicSlug: "al-del-contractions", topicTitle: "Al and Del", order: 518.02, imageKey: "directions-and-question-intents:9",
    title: "Connect A and De with El", summary: "Build destination, source, and location phrases with al and del while keeping a la and de la separate.",
    sentences: [
      ["Voy al mercado.", "I go to the market.", "A plus el combines as al before a masculine singular noun."],
      ["Voy a la estación.", "I go to the station.", "A and la remain separate."],
      ["Vengo del mercado.", "I come from the market.", "De plus el combines as del."],
      ["Vengo de la estación.", "I come from the station.", "De and la remain separate."],
      ["El banco está al lado del museo.", "The bank is next to the museum.", "The fixed frame al lado de contains both contractions before masculine nouns."],
      ["La farmacia está al lado de la estación.", "The pharmacy is next to the station.", "Only a plus el and de plus el contract; la remains separate."]
    ]
  },
  {
    slug: "a1-que-cual-questions", topicSlug: "que-cual-selection", topicTitle: "Qué and Cuál", order: 518.04, imageKey: "directions-and-question-intents:7",
    title: "Choose Qué or Cuál in Everyday Questions", summary: "Ask for a category with qué and identify an answer from understood possibilities with cuál or cuáles.",
    sentences: [
      ["¿Qué día es hoy?", "What day is today?", "Qué stands before the noun día to ask for the category."],
      ["¿Qué idiomas hablas?", "What languages do you speak?", "Qué plus a plural noun opens a category question."],
      ["¿Cuál es la fecha de hoy?", "What is today's date?", "Cuál plus es asks for the specific identifying answer."],
      ["¿Cuál es tu número de teléfono?", "What is your phone number?", "Cuál asks the other person to supply the identifying value."],
      ["¿Cuáles son tus días libres?", "Which days are your days off?", "Cuáles agrees with the plural answer set."],
      ["¿Qué es una farmacia?", "What is a pharmacy?", "Qué es asks for a definition rather than selecting an identity."]
    ]
  },
  {
    slug: "checkpoint-a1-contractions-choice", topicSlug: "contractions-choice-checkpoint", topicTitle: "Connections and Choice Checkpoint", order: 518.06, imageKey: "directions-and-question-intents:16", checkpoint: true,
    title: "A1 Connections and Choice Checkpoint", summary: "Combine destination, source, nearby location, and focused information questions before the travel unit.",
    sentences: [
      ["Voy al hotel y después a la estación.", "I go to the hotel and then to the station.", "Al contrasts with a la inside one route."],
      ["Vengo del museo, no de la farmacia.", "I come from the museum, not from the pharmacy.", "Del contrasts with de la inside one source statement."],
      ["El café está al lado del hotel.", "The cafe is next to the hotel.", "Al lado del combines destination-like al lado with de plus el."],
      ["¿Qué lugar buscas?", "What place are you looking for?", "Qué stands before the category noun lugar."],
      ["¿Cuál es tu hotel?", "Which one is your hotel?", "Cuál asks the listener to identify the relevant hotel."],
      ["¿Cuáles son tus opciones?", "Which ones are your options?", "Cuáles asks for more than one item from an understood set."]
    ],
    readingJson: {
      title: "Del museo al hotel correcto", inputMode: "listening",
      orientationDe: "Höre zuerst auf Richtung und Herkunft: a plus el wird al, de plus el wird del; vor la bleiben beide Wörter getrennt. Entscheide bei Fragen danach, ob qué direkt eine Kategorie nennt oder cuál beziehungsweise cuáles eine konkrete Antwort aus bekannten Möglichkeiten identifiziert.",
      orientationEn: "Listen first for direction and source: a plus el becomes al and de plus el becomes del, while la stays separate. Then decide whether qué names a category or cuál identifies an answer from understood options.",
      paragraphs: ["Lena sale del museo y va al centro. Hay dos hoteles. Pregunta: «¿Cuál es el Hotel Sol?». Respuesta: «El edificio blanco al lado del café».", "Después pregunta: «¿Qué calle va a la estación?». La respuesta es Calle Mayor. La estación está al lado de la farmacia. Lena camina del hotel a la estación."],
      questions: [
        { questionDe: "Warum fragt Lena ¿Cuál es el Hotel Sol?", questionEn: "Why does Lena ask ¿Cuál es el Hotel Sol?", optionsDe: ["Sie möchte eines von zwei bekannten Hotels identifizieren", "Sie bittet um die Definition von Hotel", "Sie fragt nach irgendeiner Wortart"], optionsEn: ["She wants to identify one of two known hotels", "She asks for the definition of hotel", "She asks about a word class"], correct: 0, explanationDe: "Der Kontext hat bereits zwei Hotels eingeführt. Cuál fordert nun die konkrete Identifikation innerhalb dieser verstandenen Auswahl.", explanationEn: "The context has introduced two hotels, so cuál requests identification within that understood set." },
        { questionDe: "Welche Form zeigt im Text die Herkunft vom Museum?", questionEn: "Which form marks the source from the museum?", optionsDe: ["Del museo", "Al museo", "De la museo"], optionsEn: ["Del museo", "Al museo", "De la museo"], correct: 0, explanationDe: "Museo ist männlicher Singular mit el. Die Herkunftsbeziehung de verbindet sich deshalb mit el zu del: Lena sale del museo.", explanationEn: "Museo is masculine singular with el, so source de combines with el as del." }
      ],
      recallPromptDe: "Erkläre Lenas Weg auf Spanisch in mindestens fünf kurzen Sätzen. Verwende al, a la, del und de la sowie eine Frage mit qué und eine Identifikationsfrage mit cuál oder cuáles.",
      recallPromptEn: "Explain Lena's route in Spanish in at least five short sentences using al, a la, del, de la, qué, and cuál or cuáles.",
      modelSummary: "Lena sale del museo y va al hotel. Identifica el Hotel Sol con cuál y pregunta con qué por la calle. La estación está al lado de la farmacia."
    }
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,;]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`, `${plain}?`]; };

function checks(input) {
  const s = input.sentences;
  const dialogue = input.checkpoint ? "¿Cuál es tu hotel?" : input.topicSlug === "que-cual-selection" ? "¿Cuál es tu número de teléfono?" : "Voy al mercado.";
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: s[0][1], answer: { correct: s[0][0], goal: "connection_choice_meaning" }, options: [s[0], s[1], s[2]].map((item, i) => [item[0], i === 0]) },
    { key: "contrast", type: ExerciseType.MULTIPLE_CHOICE, question: s[3][1], answer: { correct: s[3][0], goal: "connection_choice_contrast" }, options: [s[3], s[2], s[4]].map((item, i) => [item[0], i === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: s[1][1], answer: { correctWords: tokens(s[1][0]), goal: "connection_choice_structure" } },
    { key: "translate", type: ExerciseType.TRANSLATION, question: s[2][1], answer: { correct: s[2][0], accepted: accepted(s[2][0]), goal: "connection_choice_production" } },
    { key: "listen", type: ExerciseType.LISTENING_DICTATION, question: "Type what you hear.", answer: { correct: s[4][0], audioText: s[4][0], accepted: accepted(s[4][0]), goal: "connection_choice_listening" } },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: s[5][1], answer: { correct: s[5][0], accepted: accepted(s[5][0]), goal: "connection_choice_recall" } },
    { key: "second-production", type: ExerciseType.TRANSLATION, question: s[4][1], answer: { correct: s[4][0], accepted: accepted(s[4][0]), goal: "connection_choice_production" } },
    { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.checkpoint ? "Ask which hotel belongs to the other person?" : input.topicSlug === "que-cual-selection" ? "Ask for the other person's phone number." : "Say that you go to the market.", answer: { correct: dialogue, accepted: accepted(dialogue), goal: "connection_choice_dialogue" } }
  ];
}

async function seedContractionsChoice(client = prisma) {
  const groups = await client.vocabularyGroup.findMany({ where: { slug: { in: ["travel-essentials", "places-and-directions", "essential-words"] } } });
  for (const input of packages) {
    const topic = await client.grammarTopic.upsert({ where: { slug: input.topicSlug }, update: { title: input.topicTitle, description: input.summary, cefrLevel: "A1", imageKey: input.imageKey }, create: { slug: input.topicSlug, title: input.topicTitle, description: input.summary, cefrLevel: "A1", imageKey: input.imageKey } });
    const common = { title: input.title, summary: input.summary, cefrLevel: "A1", theme: input.checkpoint ? "Checkpoint" : "Sentence Connections", situation: "identifying a destination and following a short route", imageKey: input.imageKey, outcomesJson: ["You can connect a or de with masculine singular el.", "You can keep a la and de la separate.", "You can choose qué for a category and cuál or cuáles for identification."], conceptKeys: ["a1", "contractions", "questions", input.topicSlug], ...(input.readingJson ? { readingJson: input.readingJson } : {}), reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 18 : 12, topicId: topic.id };
    const lesson = await client.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } } });
    await client.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await client.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input); const keep = [];
    for (let i = 0; i < authored.length; i += 1) {
      const check = authored[i]; const slug = `${input.slug}-${check.key}`; keep.push(slug);
      const data = { lessonId: lesson.id, topicId: topic.id, type: check.type, prompt: "Choose and build a short Spanish connection or information question", instruction: "Identify direction or source before contracting al or del; for questions, decide between a named category and a specific identification.", questionText: check.question, answerJson: check.answer, explanation: "A and de contract only with masculine singular el; qué names a category, while cuál or cuáles identify an answer from understood possibilities.", difficulty: input.checkpoint ? 3 : 2, order: i + 1, xpReward: 12, imageKey: input.imageKey };
      const exercise = await client.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
      await client.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
      if (check.options) await client.exerciseOption.createMany({ data: check.options.map(([text, isCorrect], j) => ({ exerciseId: exercise.id, text, value: text, isCorrect, order: j + 1 })) });
    }
    await client.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-`, notIn: keep } } });
  }
}

if (require.main === module) seedContractionsChoice().then(() => console.log(`Seeded ${packages.length} A1 contraction and choice packages.`)).catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { checks, packages, seedContractionsChoice };
