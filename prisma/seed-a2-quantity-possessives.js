const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const packages = [
  {
    slug: "a2-quantity-words", topicSlug: "quantity-noun-adverb", topicTitle: "Quantity with Nouns and Actions", order: 831.92, imageKey: "quantities-and-clear-colors:25",
    title: "Use Mucho, Poco, Demasiado, and Bastante", summary: "Distinguish quantities that agree with a noun from degree words that remain unchanged with an action or adjective.",
    sentences: [
      ["Bebo mucha agua.", "I drink a lot of water.", "Mucha agrees with the feminine singular noun agua."],
      ["Tengo pocos libros.", "I have few books.", "Pocos agrees with the masculine plural noun libros."],
      ["Hay demasiadas personas aquí.", "There are too many people here.", "Demasiadas agrees with the feminine plural noun personas."],
      ["Tenemos bastante tiempo.", "We have enough time.", "Bastante stays singular before the singular noun tiempo."],
      ["Trabajo mucho.", "I work a lot.", "With an action, mucho is an adverb and does not agree with the speaker."],
      ["La habitación es bastante pequeña.", "The room is quite small.", "Before an adjective, bastante expresses degree and remains unchanged."]
    ],
    readingJson: {
      title: "Preparar una comida sin comprar demasiado", inputMode: "reading",
      orientationDe: "Entscheide zuerst, ob das Mengenwort ein Nomen zählt oder eine Handlung beziehungsweise Eigenschaft verstärkt. Vor einem Nomen passen sich mucho, poco und demasiado an Geschlecht und Zahl an. Bei einem Verb bleiben mucho und poco unverändert; vor einem Adjektiv bleibt bastante ebenfalls unverändert.",
      orientationEn: "Decide whether the quantity word counts a noun or modifies an action or quality. Before nouns, common quantity words agree; with verbs or adjectives they remain adverbs.",
      paragraphs: ["Nora prepara una comida para seis personas. Tiene bastante arroz, pero hay pocas verduras y muy poca fruta. Compra muchas verduras, dos botellas de agua y demasiados dulces.", "En casa cocina mucho, pero la cocina es bastante pequeña. Al final hay suficiente comida y no quedan demasiadas cosas en la mesa. Nora aprende a comprar bastante, pero no demasiado."],
      questions: [
        { questionDe: "Warum steht muchas vor verduras?", questionEn: "Why does muchas appear before verduras?", optionsDe: ["Das Mengenwort passt sich dem femininen Pluralnomen an", "Es beschreibt Nora", "Vor jedem Verb steht die feminine Form"], optionsEn: ["The quantity word agrees with the feminine plural noun", "It describes Nora", "The feminine form precedes every verb"], correct: 0, explanationDe: "Muchas bestimmt die Menge von verduras. Da verduras feminin und Plural ist, trägt das Mengenwort beide Merkmale sichtbar mit.", explanationEn: "Muchas quantifies the feminine plural noun verduras and carries both features." },
        { questionDe: "Warum verändert sich mucho in Nora cocina mucho nicht?", questionEn: "Why does mucho not change in Nora cocina mucho?", optionsDe: ["Es bestimmt die Intensität der Handlung und ist hier ein Adverb", "Cocina ist männlich", "Nora ist Plural"], optionsEn: ["It modifies the action and is an adverb here", "Cocina is masculine", "Nora is plural"], correct: 0, explanationDe: "Mucho zählt hier kein Nomen, sondern beantwortet bei cocina die Frage nach dem Umfang der Handlung. Als Adverb richtet es sich weder nach Nora noch nach cocina.", explanationEn: "Mucho modifies the extent of cooking rather than counting a noun, so it does not agree." }
      ],
      recallPromptDe: "Plane Noras Einkauf auf Spanisch. Verwende mucha oder muchas, poco oder pocas, demasiado mit passender Endung, bastante vor einem Nomen sowie mucho und bastante unverändert bei Handlung oder Eigenschaft.",
      recallPromptEn: "Plan Nora's shopping in Spanish using agreeing quantity words and unchanged adverbial mucho and bastante.",
      modelSummary: "Nora tiene bastante arroz, poca fruta y pocas verduras. Compra muchas verduras y demasiados dulces; cocina mucho en una cocina bastante pequeña."
    }
  },
  {
    slug: "a2-independent-possessives", topicSlug: "independent-possessives", topicTitle: "Independent Possessive Forms", order: 831.94, imageKey: "people-and-pronouns:13",
    title: "Say Mine, Yours, and Ours", summary: "Replace a repeated owned noun with an agreeing article plus mío, tuyo, suyo, or nuestro and clarify ambiguous owners with de.",
    sentences: [
      ["Mi habitación es pequeña; la tuya es grande.", "My room is small; yours is large.", "La tuya replaces tu habitación and agrees with habitación."],
      ["Tu piso es moderno; el mío es antiguo.", "Your apartment is modern; mine is old.", "El mío replaces mi piso and agrees with piso."],
      ["Sus ventanas son nuevas; las nuestras son antiguas.", "Their windows are new; ours are old.", "Las nuestras replaces nuestras ventanas and keeps feminine plural agreement."],
      ["Este libro es mío.", "This book is mine.", "After ser, the possessive agrees with the owned noun and does not need an article."],
      ["La mochila es suya.", "The backpack is his, hers, yours formal, or theirs.", "Suya agrees with mochila, while context must identify the owner."],
      ["Es la mochila de Ana.", "It is Ana's backpack.", "De plus a person clarifies an owner when suya would be ambiguous."]
    ],
    readingJson: {
      title: "Dos habitaciones y varias cosas parecidas", inputMode: "listening",
      orientationDe: "Trenne Besitzer und Besitz. Die Endung von mío, tuyo, suyo und nuestro richtet sich nach der besessenen Sache, nicht nach der Person, der sie gehört. Wenn das Nomen ausgelassen wird, steht meist ein passender Artikel davor; nach ser kann die Besitzform ohne Artikel stehen. De plus Name klärt mehrdeutiges su oder suyo.",
      orientationEn: "Separate owner from owned item. The possessive agrees with the owned noun. Use an article when replacing the noun, no article after ser, and de plus a name to clarify ambiguous su or suyo.",
      paragraphs: ["Marta y Leo comparan sus habitaciones. La habitación de Marta es pequeña; la de Leo es grande. Marta dice: «Mi habitación tiene una ventana nueva». Leo responde: «La mía tiene dos, pero la tuya es más luminosa». ", "Después ordenan unos libros. Este libro rojo es mío, dice Marta. Leo pregunta por una mochila azul: «¿Es tuya?». No, es la mochila de Ana. Las mochilas negras son nuestras y las azules son suyas."],
      questions: [
        { questionDe: "Worauf richtet sich die feminine Form la mía?", questionEn: "What controls the feminine form la mía?", optionsDe: ["Auf das ausgelassene Nomen habitación", "Auf Martas Geschlecht", "Auf die Anzahl der Fenster"], optionsEn: ["The omitted noun habitación", "Marta's gender", "The number of windows"], correct: 0, explanationDe: "La mía ersetzt la habitación mía beziehungsweise mi habitación. Artikel und Besitzform bewahren deshalb das feminine Singularmerkmal der ausgelassenen Sache.", explanationEn: "La mía replaces the feminine singular noun habitación, so both article and possessive preserve its features." },
        { questionDe: "Warum sagt der Text la mochila de Ana?", questionEn: "Why does the text say la mochila de Ana?", optionsDe: ["Der Name macht den Besitzer eindeutig", "Suyo darf nie für eine Tasche stehen", "Ana ist ein Gegenstand"], optionsEn: ["The name makes the owner explicit", "Suyo can never refer to a bag", "Ana is an object"], correct: 0, explanationDe: "Su und suyo können mehrere Besitzer bedeuten. De Ana nennt die konkrete Person und verhindert, dass hers, yours formal oder theirs verwechselt werden.", explanationEn: "Su and suyo can point to several owners; de Ana identifies the person explicitly." }
      ],
      recallPromptDe: "Vergleiche Martas und Leos Zimmer und Gegenstände auf Spanisch. Verwende la mía, la tuya, el mío, las nuestras, es mío oder es tuya und kläre mindestens einen Besitzer mit de plus Name.",
      recallPromptEn: "Compare Marta's and Leo's rooms and objects in Spanish using independent possessives and clarify one owner with de plus a name.",
      modelSummary: "La habitación de Marta es pequeña y la de Leo es grande. La mía y la tuya sustituyen las habitaciones; los libros rojos son míos y las mochilas negras son nuestras."
    }
  },
  {
    slug: "checkpoint-a2-quantity-possessives", topicSlug: "quantity-possessive-checkpoint", topicTitle: "Quantity and Possessive Checkpoint", order: 831.96, imageKey: "grammar-scenes:14", checkpoint: true,
    title: "A2 Quantity and Possessive Checkpoint", summary: "Choose a place by combining quantity, degree, adjective agreement, and independent possession without repeating every noun.",
    sentences: [
      ["Mi piso tiene muchas ventanas; el tuyo tiene pocas.", "My apartment has many windows; yours has few.", "El tuyo replaces tu piso, while muchas and pocas quantify ventanas."],
      ["Nuestra cocina es pequeña; la suya es bastante grande.", "Our kitchen is small; theirs is quite large.", "La suya agrees with cocina; bastante modifies grande and stays unchanged."],
      ["Tenemos poco espacio, pero trabajamos mucho en casa.", "We have little space, but we work a lot at home.", "Poco agrees with espacio as a quantity; mucho modifies the action."],
      ["Hay demasiadas cosas en mi habitación.", "There are too many things in my room.", "Demasiadas agrees with cosas."],
      ["El dormitorio luminoso es mío.", "The bright bedroom is mine.", "Both luminoso and mío agree with dormitorio."],
      ["La habitación más tranquila es la tuya.", "The quietest room is yours.", "La tuya replaces tu habitación and prepares a natural comparison outcome."]
    ],
    readingJson: {
      title: "Elegir dónde estudiar sin repetir cada palabra", inputMode: "listening",
      orientationDe: "Verbinde drei Entscheidungen: Welches Nomen wird beschrieben oder ersetzt, welche Menge wird genannt, und verändert das Mengenwort ein Nomen oder eine Handlung beziehungsweise Eigenschaft? Prüfe danach Artikel und Endung der selbstständigen Besitzform.",
      orientationEn: "Combine three choices: identify the described or replaced noun, identify the quantity, and decide whether the quantity word modifies a noun or acts as an adverb. Then check the possessive article and ending.",
      paragraphs: ["Clara y Dani comparan sus pisos para elegir dónde estudiar. El piso de Clara tiene muchas ventanas, pero poco espacio. El de Dani tiene pocas ventanas, pero su cocina es bastante grande y hay suficiente espacio para una mesa.", "Clara trabaja mucho en casa y tiene demasiadas cosas en su habitación. Dani dice: «La mesa grande es mía, pero la habitación más tranquila es la tuya». Al final estudian en el piso de Dani porque el suyo tiene bastante espacio."],
      questions: [
        { questionDe: "Warum steht poco bei espacio, aber mucho bei trabaja?", questionEn: "Why does poco appear with espacio but mucho with trabaja?", optionsDe: ["Poco bestimmt ein Nomen; mucho bestimmt den Umfang der Handlung", "Beide richten sich nach Clara", "Espacio ist ein Verb"], optionsEn: ["Poco quantifies a noun; mucho modifies the extent of the action", "Both agree with Clara", "Espacio is a verb"], correct: 0, explanationDe: "Poco steht als Mengenwort beim männlichen Singularnomen espacio. Mucho zählt dagegen nichts, sondern verstärkt arbeitet; als Adverb bleibt es unverändert.", explanationEn: "Poco quantifies the noun espacio, while mucho modifies the action trabaja and remains adverbial." },
        { questionDe: "Worauf verweist el suyo im letzten Satz?", questionEn: "What does el suyo refer to in the final sentence?", optionsDe: ["Auf Danis piso", "Auf Claras habitación", "Auf die mesa"], optionsEn: ["Dani's apartment", "Clara's room", "The table"], correct: 0, explanationDe: "El übernimmt Geschlecht und Zahl von piso. Der vorherige Kontext nennt Danis Wohnung als Ort mit genügend Platz; suyo ersetzt deshalb el piso de Dani.", explanationEn: "El preserves masculine singular piso, and context identifies Dani's apartment as the spacious one." }
      ],
      recallPromptDe: "Begründe die Wahl des Lernorts in mindestens fünf spanischen Sätzen. Verwende ein angepasstes Mengenwort, mucho als Adverb, bastante vor einem Adjektiv sowie el mío, el tuyo, la suya oder eine passende andere Besitzform.",
      recallPromptEn: "Justify the study location in at least five Spanish sentences using agreeing quantity words, adverbial mucho, bastante with an adjective, and independent possessives.",
      modelSummary: "El piso de Clara tiene muchas ventanas, pero poco espacio; el de Dani tiene bastante espacio. Clara trabaja mucho en casa, pero la habitación más tranquila es la suya."
    }
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,;]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`, `${plain}?`]; };

function checks(input) {
  const s = input.sentences;
  const dialogue = input.checkpoint ? "La habitación más tranquila es la tuya." : input.topicSlug === "independent-possessives" ? "Mi habitación es pequeña; la tuya es grande." : "Bebo mucha agua.";
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: s[0][1], answer: { correct: s[0][0], goal: "quantity_possessive_meaning" }, options: [s[0], s[1], s[2]].map((item, i) => [item[0], i === 0]) },
    { key: "contrast", type: ExerciseType.MULTIPLE_CHOICE, question: s[5][1], answer: { correct: s[5][0], goal: "quantity_possessive_contrast" }, options: [s[5], s[3], s[1]].map((item, i) => [item[0], i === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: s[1][1], answer: { correctWords: tokens(s[1][0]), goal: "quantity_possessive_structure" } },
    { key: "translate", type: ExerciseType.TRANSLATION, question: s[2][1], answer: { correct: s[2][0], accepted: accepted(s[2][0]), goal: "quantity_possessive_production" } },
    { key: "listen", type: ExerciseType.LISTENING_DICTATION, question: "Type what you hear.", answer: { correct: s[4][0], audioText: s[4][0], accepted: accepted(s[4][0]), goal: "quantity_possessive_listening" } },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: s[3][1], answer: { correct: s[3][0], accepted: accepted(s[3][0]), goal: "quantity_possessive_recall" } },
    { key: "second-production", type: ExerciseType.TRANSLATION, question: s[5][1], answer: { correct: s[5][0], accepted: accepted(s[5][0]), goal: "quantity_possessive_production" } },
    { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.checkpoint ? "Say that the quietest room is the other person's." : input.topicSlug === "independent-possessives" ? "Compare your small room with the other person's large room." : "Say that you drink a lot of water.", answer: { correct: dialogue, accepted: accepted(dialogue), goal: "quantity_possessive_dialogue" } }
  ];
}

async function seedQuantityPossessives(client = prisma) {
  const groups = await client.vocabularyGroup.findMany({ where: { slug: { in: ["home-and-objects", "essential-words", "people-and-family"] } } });
  for (const input of packages) {
    const topic = await client.grammarTopic.upsert({ where: { slug: input.topicSlug }, update: { title: input.topicTitle, description: input.summary, cefrLevel: "A2", imageKey: input.imageKey }, create: { slug: input.topicSlug, title: input.topicTitle, description: input.summary, cefrLevel: "A2", imageKey: input.imageKey } });
    const common = { title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Quantity and Possession", situation: "comparing rooms, belongings, and available space", imageKey: input.imageKey, outcomesJson: ["You can distinguish quantity before a noun from degree with a verb or adjective.", "You can replace a repeated owned noun with an agreeing possessive form.", "You can clarify an ambiguous owner with de plus a person."], conceptKeys: ["a2", "quantity", "possessives", input.topicSlug], readingJson: input.readingJson, reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 17 : 16, topicId: topic.id };
    const lesson = await client.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } } });
    await client.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await client.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input); const keep = [];
    for (let i = 0; i < authored.length; i += 1) {
      const check = authored[i]; const slug = `${input.slug}-${check.key}`; keep.push(slug);
      const data = { lessonId: lesson.id, topicId: topic.id, type: check.type, prompt: "Choose and build a Spanish quantity or possessive phrase", instruction: "Find the noun, decide whether it is quantified or replaced, and match gender and number; keep adverbial degree words unchanged.", questionText: check.question, answerJson: check.answer, explanation: "Quantity agreement and possessive agreement both follow the noun, while adverbs modify an action or quality without agreement.", difficulty: input.checkpoint ? 4 : 3, order: i + 1, xpReward: 13, imageKey: input.imageKey };
      const exercise = await client.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
      await client.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
      if (check.options) await client.exerciseOption.createMany({ data: check.options.map(([text, isCorrect], j) => ({ exerciseId: exercise.id, text, value: text, isCorrect, order: j + 1 })) });
    }
    await client.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-`, notIn: keep } } });
  }
}

if (require.main === module) seedQuantityPossessives().then(() => console.log(`Seeded ${packages.length} A2 quantity and possessive packages.`)).catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { checks, packages, seedQuantityPossessives };
