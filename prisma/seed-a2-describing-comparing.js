const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a2-more-less-comparisons", title: "Compare with Más and Menos", order: 832, imageKey: "grammar-scenes:2",
    summary: "Compare two people, things, or options with más or menos plus an adjective and que.", situation: "choosing between everyday options",
    sentences: [
      ["Ana es más alta que Luis.", "Ana is taller than Luis.", "Más plus adjective plus que expresses a greater degree."],
      ["Este café es menos caro que ese.", "This café is less expensive than that one.", "Menos plus adjective plus que expresses a lower degree."],
      ["El tren es más rápido que el autobús.", "The train is faster than the bus.", "The compared items stand on either side of que."],
      ["Mi habitación es menos grande que la tuya.", "My room is less large than yours.", "The adjective describes the first item in the comparison."],
      ["Prefiero la opción más tranquila.", "I prefer the quieter option.", "Más can help identify the option with more of a quality."]
    ],
    readingJson: {
      title: "Dos formas de viajar al centro",
      inputMode: "listening",
      orientationDe: "Höre auf die beiden Vergleichsrichtungen: más nennt mehr von einer Eigenschaft, menos weniger. Que trennt die verglichenen Möglichkeiten.",
      orientationEn: "Listen for the two comparison directions: más gives more of a quality, menos gives less. Que separates the compared options.",
      paragraphs: [
        "El tren es más rápido que el autobús, pero también es más caro. El autobús es menos cómodo por la mañana porque hay muchas personas.",
        "Por la tarde el autobús es más tranquilo y menos caro que el tren. Marta tiene tiempo y poco dinero, por eso prefiere la opción menos cara."
      ],
      questions: [
        { questionDe: "Welches Verkehrsmittel ist schneller?", questionEn: "Which form of transport is faster?", optionsDe: ["Der Zug", "Der Bus", "Beide gleich"], optionsEn: ["The train", "The bus", "Both equally"], correct: 0, explanationDe: "El tren es más rápido que el autobús ordnet dem Zug ausdrücklich mehr Geschwindigkeit zu.", explanationEn: "El tren es más rápido que el autobús explicitly assigns greater speed to the train." },
        { questionDe: "Warum wählt Marta am Nachmittag den Bus?", questionEn: "Why does Marta choose the bus in the afternoon?", optionsDe: ["Sie hat Zeit und wenig Geld", "Der Bus ist immer schneller", "Der Zug fährt nicht"], optionsEn: ["She has time and little money", "The bus is always faster", "The train is not running"], correct: 0, explanationDe: "Tiene tiempo y poco dinero erklärt, warum für Marta weniger Kosten wichtiger als höhere Geschwindigkeit sind.", explanationEn: "Tiene tiempo y poco dinero explains why lower cost matters more to Marta than greater speed." }
      ],
      recallPromptDe: "Vergleiche Zug und Bus auf Spanisch in vier Sätzen. Verwende zweimal más ... que, zweimal menos ... que und begründe anschließend deine Wahl.",
      recallPromptEn: "Compare the train and bus in Spanish in four sentences. Use más ... que twice, menos ... que twice, and then give a reason for your choice.",
      modelSummary: "El tren es más rápido y más caro. Por la tarde el autobús es más tranquilo y menos caro, por eso Marta lo prefiere."
    }
  },
  {
    slug: "a2-equality-comparisons", title: "Compare Equality with Tan and Tanto", order: 833, imageKey: "grammar-scenes:3",
    summary: "Express equal qualities, quantities, and actions with tan ... como and tanto ... como.", situation: "comparing two study routines",
    sentences: [
      ["Eva es tan organizada como Leo.", "Eva is as organized as Leo.", "Tan plus adjective plus como compares an equal quality."],
      ["Tengo tantos libros como tú.", "I have as many books as you.", "Tanto agrees with the plural noun libros."],
      ["Ana estudia tanto como Pablo.", "Ana studies as much as Pablo.", "With an action, tanto remains unchanged."],
      ["Esta clase no es tan difícil como esa.", "This class is not as difficult as that one.", "No tan ... como expresses inequality through a shared scale."],
      ["Bebemos tanta agua como ellos.", "We drink as much water as they do.", "Tanta agrees with the feminine singular noun agua."]
    ],
    readingJson: {
      title: "Eva y Leo preparan el mismo examen",
      orientationDe: "Lies zuerst, was gleich ist. Tan steht vor einer Eigenschaft; tanto passt sich vor einem Nomen an oder bleibt bei einer Handlung unverändert.",
      orientationEn: "First read what is equal. Tan precedes a quality; tanto agrees before a noun or remains unchanged with an action.",
      paragraphs: [
        "Eva estudia tanto como Leo para el examen. Ella es tan organizada como él y tiene tantos libros como Leo, pero usa menos cuadernos.",
        "Los dos leen durante dos horas. Eva bebe tanta agua como Leo. Para ellos, la segunda parte no es tan difícil como la primera."
      ],
      questions: [
        { questionDe: "Was tun Eva und Leo in gleichem Umfang?", questionEn: "What do Eva and Leo do to the same extent?", optionsDe: ["Lernen", "Hefte benutzen", "Kaffee trinken"], optionsEn: ["Study", "Use notebooks", "Drink coffee"], correct: 0, explanationDe: "Eva estudia tanto como Leo verwendet tanto bei einer Handlung und setzt ihren Lernumfang gleich.", explanationEn: "Eva estudia tanto como Leo uses tanto with an action and makes their amount of studying equal." },
        { questionDe: "Welcher Prüfungsteil ist leichter?", questionEn: "Which part of the exam is easier?", optionsDe: ["Der zweite Teil", "Der erste Teil", "Beide sind unmöglich"], optionsEn: ["The second part", "The first part", "Both are impossible"], correct: 0, explanationDe: "La segunda parte no es tan difícil como la primera bedeutet, dass der zweite Teil einen geringeren Schwierigkeitsgrad hat.", explanationEn: "La segunda parte no es tan difícil como la primera means the second part has a lower level of difficulty." }
      ],
      recallPromptDe: "Vergleiche Eva und Leo auf Spanisch. Verwende tan ... como für eine Eigenschaft, tanto ... como für eine Handlung und tantos oder tanta vor einem Nomen.",
      recallPromptEn: "Compare Eva and Leo in Spanish. Use tan ... como for a quality, tanto ... como for an action, and tantos or tanta before a noun.",
      modelSummary: "Eva estudia tanto como Leo, es tan organizada como él y tiene tantos libros como él. La segunda parte es menos difícil."
    }
  },
  {
    slug: "a2-superlatives", title: "Choose the Most and Least", order: 834, imageKey: "grammar-scenes:13",
    summary: "Identify the highest or lowest degree with article plus más or menos and a comparison group.", situation: "choosing a place to stay",
    sentences: [
      ["Es el hotel más tranquilo de la ciudad.", "It is the quietest hotel in the city.", "Article plus más identifies the highest degree within a group."],
      ["Esta es la habitación menos cara.", "This is the least expensive room.", "Article plus menos identifies the lowest degree."],
      ["Ana es la persona más organizada del equipo.", "Ana is the most organized person on the team.", "The article agrees with the described person or thing."],
      ["El lunes es el día más ocupado.", "Monday is the busiest day.", "De or del can name the group being compared."],
      ["Es uno de los restaurantes más populares.", "It is one of the most popular restaurants.", "Uno de los ... más places something inside a leading group."]
    ],
    readingJson: {
      title: "Tres hoteles para una noche",
      inputMode: "listening",
      orientationDe: "Höre, welches Hotel innerhalb der Dreiergruppe den höchsten oder niedrigsten Wert besitzt. Artikel und Nomen müssen zusammenpassen.",
      orientationEn: "Listen for which hotel has the highest or lowest value within the group of three. The article and noun must agree.",
      paragraphs: [
        "El Hotel Sol es el más barato, pero está lejos. El Hotel Mar es el más moderno y tiene las habitaciones más grandes de los tres.",
        "El Hotel Plaza es el menos tranquilo, pero está en el centro. Nora elige el Hotel Mar porque para ella la comodidad es lo más importante."
      ],
      questions: [
        { questionDe: "Welches Hotel besitzt die größten Zimmer?", questionEn: "Which hotel has the largest rooms?", optionsDe: ["Hotel Mar", "Hotel Sol", "Hotel Plaza"], optionsEn: ["Hotel Mar", "Hotel Sol", "Hotel Plaza"], correct: 0, explanationDe: "Las habitaciones más grandes de los tres ordnet die größten Zimmer eindeutig dem zuvor genannten Hotel Mar zu.", explanationEn: "Las habitaciones más grandes de los tres clearly assigns the largest rooms to Hotel Mar, named immediately before." },
        { questionDe: "Warum entscheidet sich Nora für Hotel Mar?", questionEn: "Why does Nora choose Hotel Mar?", optionsDe: ["Komfort ist ihr am wichtigsten", "Es ist am billigsten", "Es ist das zentralste"], optionsEn: ["Comfort is most important to her", "It is the cheapest", "It is the most central"], correct: 0, explanationDe: "La comodidad es lo más importante nennt Noras Kriterium; modern und große Zimmer unterstützen diese Entscheidung.", explanationEn: "La comodidad es lo más importante names Nora's criterion; modern features and large rooms support that choice." }
      ],
      recallPromptDe: "Vergleiche die drei Hotels auf Spanisch und verwende el más, el menos, las más sowie lo más importante. Begründe danach Noras Entscheidung.",
      recallPromptEn: "Compare the three hotels in Spanish using el más, el menos, las más, and lo más importante. Then explain Nora's choice.",
      modelSummary: "El Hotel Sol es el más barato, el Mar es el más moderno y tiene las habitaciones más grandes, y el Plaza es el menos tranquilo."
    }
  },
  {
    slug: "a2-demonstratives-distance", title: "Choose Este, Ese, or Aquel", order: 835, imageKey: "object-location-scenes:16",
    summary: "Point to near, medium-distance, and far people or things with demonstratives that agree.", situation: "choosing objects in a shop",
    sentences: [
      ["Esta camisa de aquí es azul.", "This shirt here is blue.", "Este and esta point to something near the speaker."],
      ["Ese libro de ahí es de Ana.", "That book there belongs to Ana.", "Ese and esa point to something at medium distance or near the listener."],
      ["Aquel edificio de allí es un museo.", "That building over there is a museum.", "Aquel and aquella point to something far away."],
      ["Estos zapatos son cómodos.", "These shoes are comfortable.", "The demonstrative agrees with masculine plural zapatos."],
      ["Aquellas montañas están muy lejos.", "Those mountains over there are very far away.", "Aquellas agrees with feminine plural montañas and signals distance."]
    ],
    readingJson: {
      title: "Elegir una camisa sin señalar mal",
      inputMode: "listening",
      orientationDe: "Höre auf aquí, ahí und allí als Entfernungshilfe. Wähle danach die Demonstrativform passend zu Geschlecht und Zahl des Gegenstands.",
      orientationEn: "Listen for aquí, ahí, and allí as distance clues. Then match the demonstrative to the object's gender and number.",
      paragraphs: [
        "En una tienda, Julia dice: Esta camisa de aquí es bonita, pero esos pantalones de ahí son más prácticos. La vendedora muestra otra mesa.",
        "Julia pregunta: ¿Cuánto cuesta aquella chaqueta roja de allí? La chaqueta es cara. Al final compra estos zapatos negros de aquí porque son cómodos."
      ],
      questions: [
        { questionDe: "Welches Kleidungsstück befindet sich weit entfernt?", questionEn: "Which item of clothing is far away?", optionsDe: ["Die rote Jacke", "Die schöne Bluse", "Die schwarzen Schuhe"], optionsEn: ["The red jacket", "The pretty shirt", "The black shoes"], correct: 0, explanationDe: "Aquella chaqueta ... de allí kombiniert die Form für weiblichen Singular mit dem deutlich entfernten Ort allí.", explanationEn: "Aquella chaqueta ... de allí combines the feminine singular form with the clearly distant location allí." },
        { questionDe: "Was kauft Julia schließlich?", questionEn: "What does Julia finally buy?", optionsDe: ["Die schwarzen Schuhe hier", "Die Hose dort", "Die rote Jacke"], optionsEn: ["The black shoes here", "The trousers there", "The red jacket"], correct: 0, explanationDe: "Compra estos zapatos negros de aquí verwendet maskulinen Plural und Nähe für die tatsächlich gekauften Schuhe.", explanationEn: "Compra estos zapatos negros de aquí uses masculine plural and nearness for the shoes she actually buys." }
      ],
      recallPromptDe: "Spiele Julia und beschreibe auf Spanisch je ein nahes, mittleres und entferntes Kleidungsstück. Verwende esta oder estos, ese oder esos und aquella.",
      recallPromptEn: "Play Julia and describe one near, medium-distance, and far item of clothing in Spanish. Use esta or estos, ese or esos, and aquella.",
      modelSummary: "Esta camisa está aquí, esos pantalones están ahí y aquella chaqueta está allí. Julia compra estos zapatos negros porque son cómodos."
    }
  },
  {
    slug: "a2-present-progressive", title: "Say What Is Happening Now", order: 836, imageKey: "daily-actions:7",
    summary: "Use estar plus a gerund for an action visibly or specifically in progress now.", situation: "describing what people are doing right now",
    sentences: [
      ["Estoy estudiando ahora.", "I am studying now.", "Regular -ar verbs form the gerund with -ando."],
      ["Ana está comiendo.", "Ana is eating.", "Regular -er verbs form the gerund with -iendo."],
      ["Estamos escribiendo un mensaje.", "We are writing a message.", "Regular -ir verbs also use -iendo."],
      ["Los niños están jugando en el parque.", "The children are playing in the park.", "Estar agrees with the subject; the gerund remains unchanged."],
      ["Leo está leyendo el libro.", "Leo is reading the book.", "Leer uses the spelling form leyendo in the gerund."]
    ],
    readingJson: {
      title: "Ahora mismo en la biblioteca",
      inputMode: "listening",
      orientationDe: "Höre zuerst die passende estar-Form und danach die laufende Handlung auf -ando oder -iendo. Beide Teile bilden gemeinsam die Jetzt-Aussage.",
      orientationEn: "First hear the matching form of estar and then the ongoing action in -ando or -iendo. Both parts form the statement about now.",
      paragraphs: [
        "Ahora mismo Ana está leyendo en la biblioteca. Su amigo Pablo está escribiendo un mensaje y dos estudiantes están preparando una presentación.",
        "La profesora está hablando con una estudiante. Nosotros estamos esperando una mesa libre. Nadie está comiendo porque en esta biblioteca no hay cafetería."
      ],
      questions: [
        { questionDe: "Was macht Pablo gerade?", questionEn: "What is Pablo doing right now?", optionsDe: ["Eine Nachricht schreiben", "Ein Buch lesen", "Eine Präsentation halten"], optionsEn: ["Writing a message", "Reading a book", "Giving a presentation"], correct: 0, explanationDe: "Pablo está escribiendo un mensaje verbindet seine Person mit einer gerade laufenden Schreibhandlung.", explanationEn: "Pablo está escribiendo un mensaje connects him with a writing action currently in progress." },
        { questionDe: "Warum isst dort gerade niemand?", questionEn: "Why is nobody eating there right now?", optionsDe: ["Es gibt keine Cafeteria", "Alle sind zu Hause", "Das Essen ist teuer"], optionsEn: ["There is no café", "Everyone is at home", "The food is expensive"], correct: 0, explanationDe: "No hay cafetería liefert den ausdrücklich genannten Grund für nadie está comiendo.", explanationEn: "No hay cafetería gives the explicitly stated reason for nadie está comiendo." }
      ],
      recallPromptDe: "Beschreibe die Bibliothek auf Spanisch mit mindestens fünf laufenden Handlungen. Passe estar an die Person an und verwende -ando, -iendo sowie leyendo.",
      recallPromptEn: "Describe the library in Spanish with at least five ongoing actions. Match estar to the person and use -ando, -iendo, and leyendo.",
      modelSummary: "Ana está leyendo, Pablo está escribiendo, dos estudiantes están preparando una presentación y nosotros estamos esperando una mesa."
    }
  },
  {
    slug: "a2-habit-versus-now", title: "Distinguish Habit from Right Now", order: 837, imageKey: "daily-actions:12",
    summary: "Choose the simple present for routines and estar plus gerund for an action in progress now.", situation: "contrasting a normal day with this moment",
    sentences: [
      ["Trabajo en casa cada lunes.", "I work at home every Monday.", "The simple present describes a regular routine."],
      ["Ahora estoy trabajando en la oficina.", "Now I am working in the office.", "Estar plus gerund focuses on the action in progress now."],
      ["Ana lee por la noche.", "Ana reads at night.", "A repeated time phrase supports the habitual simple present."],
      ["Ana está leyendo ahora.", "Ana is reading now.", "Ahora supports the progressive view of the current action."],
      ["Vivimos en Madrid, pero estamos pasando la semana en Sevilla.", "We live in Madrid, but we are spending the week in Seville.", "The simple present gives the stable situation; the progressive gives the temporary ongoing one."]
    ],
    readingJson: {
      title: "La rutina de Marta y este lunes diferente",
      orientationDe: "Lies jede Zeitangabe vor der Verbwahl: cada lunes und normalmente rahmen Gewohnheiten; ahora und esta semana lenken auf die laufende Situation.",
      orientationEn: "Read each time phrase before choosing the verb: cada lunes and normalmente frame habits; ahora and esta semana focus the ongoing situation.",
      paragraphs: [
        "Marta trabaja en casa cada lunes y normalmente come a la una. Por la tarde lee y habla con su hermana. Esa es su rutina.",
        "Hoy es diferente: ahora está trabajando en una cafetería. Está comiendo a las dos y su hermana está viajando. Esta semana están cambiando sus horarios."
      ],
      questions: [
        { questionDe: "Wo arbeitet Marta normalerweise montags?", questionEn: "Where does Marta normally work on Mondays?", optionsDe: ["Zu Hause", "In einer Cafeteria", "Im Zug"], optionsEn: ["At home", "In a café", "On the train"], correct: 0, explanationDe: "Trabaja en casa cada lunes verbindet einfachen Präsenssatz und Wiederholungsangabe zu ihrer normalen Gewohnheit.", explanationEn: "Trabaja en casa cada lunes combines the simple present with a repetition phrase to state her normal habit." },
        { questionDe: "Was ist heute anders?", questionEn: "What is different today?", optionsDe: ["Sie arbeitet gerade in einer Cafeteria", "Sie liest jeden Abend", "Sie spricht nie mit ihrer Schwester"], optionsEn: ["She is working in a café now", "She reads every evening", "She never speaks with her sister"], correct: 0, explanationDe: "Ahora está trabajando en una cafetería hebt den aktuell laufenden Gegensatz zur üblichen Heimarbeit hervor.", explanationEn: "Ahora está trabajando en una cafetería highlights the current ongoing contrast with her usual work at home." }
      ],
      recallPromptDe: "Vergleiche Martas normale Routine mit heute auf Spanisch. Verwende zwei Gewohnheiten im einfachen Präsens und drei aktuelle Handlungen mit estar plus Gerundio.",
      recallPromptEn: "Compare Marta's normal routine with today in Spanish. Use two habits in the simple present and three current actions with estar plus gerund.",
      modelSummary: "Marta trabaja normalmente en casa, pero hoy está trabajando en una cafetería. Come a la una, pero ahora está comiendo a las dos."
    }
  },
  {
    slug: "checkpoint-a2-describing-comparing", title: "A2.8 Describing and Comparing Checkpoint", order: 838, imageKey: "grammar-scenes:16", checkpoint: true,
    summary: "Check comparisons, superlatives, distance, and the contrast between routines and actions happening now.", situation: "choosing a place while describing the current scene",
    sentences: [
      ["Este parque es más tranquilo que ese.", "This park is quieter than that one.", "The sentence combines distance and a greater-degree comparison."],
      ["La plaza es tan grande como el parque.", "The square is as large as the park.", "Tan plus adjective plus como expresses equal quality."],
      ["Es el lugar más bonito del barrio.", "It is the most beautiful place in the neighborhood.", "Article plus más identifies the highest degree in a group."],
      ["Aquellos niños están jugando.", "Those children over there are playing.", "A distant demonstrative agrees with the plural noun and estar frames the ongoing action."],
      ["Normalmente leemos aquí, pero ahora estamos hablando.", "We normally read here, but now we are talking.", "Simple present habit contrasts with a current progressive action."],
      ["Prefiero esta mesa porque es la menos ruidosa.", "I prefer this table because it is the least noisy.", "A near demonstrative and relative superlative support a reasoned choice."]
    ],
    readingJson: {
      title: "Elegir el mejor lugar para estudiar",
      inputMode: "listening",
      orientationDe: "Höre eine vollständige Entscheidung: Entfernung, Vergleich, Gleichheit, höchster oder niedrigster Wert und laufende Handlung. Ordne jede Form ihrer Funktion zu.",
      orientationEn: "Listen to a complete decision involving distance, comparison, equality, highest or lowest value, and an ongoing action. Match each form to its function.",
      paragraphs: [
        "Clara compara dos lugares. Esta biblioteca es más silenciosa que aquella cafetería, pero la cafetería tiene tantas mesas como la biblioteca y está más cerca.",
        "Ahora muchas personas están hablando en la cafetería. La biblioteca es el lugar menos ruidoso y Clara está estudiando, por eso elige esta mesa de aquí."
      ],
      questions: [
        { questionDe: "Welche Gemeinsamkeit haben beide Orte?", questionEn: "What do both places have in common?", optionsDe: ["Sie haben gleich viele Tische", "Sie sind gleich laut", "Sie sind gleich weit entfernt"], optionsEn: ["They have the same number of tables", "They are equally noisy", "They are equally far away"], correct: 0, explanationDe: "Tantas mesas como setzt die Tischmenge in Cafeteria und Bibliothek ausdrücklich gleich.", explanationEn: "Tantas mesas como explicitly makes the number of tables equal in the café and library." },
        { questionDe: "Warum wählt Clara den Tisch in der Bibliothek?", questionEn: "Why does Clara choose the table in the library?", optionsDe: ["Die Bibliothek ist am wenigsten laut", "Die Cafeteria ist leer", "Der Tisch ist am weitesten entfernt"], optionsEn: ["The library is the least noisy", "The café is empty", "The table is farthest away"], correct: 0, explanationDe: "El lugar menos ruidoso liefert das entscheidende Superlativkriterium; esta mesa bezeichnet anschließend ihre nahe Wahl.", explanationEn: "El lugar menos ruidoso gives the decisive superlative criterion; esta mesa then identifies her nearby choice." }
      ],
      recallPromptDe: "Begründe Claras Wahl auf Spanisch in sechs Sätzen. Verwende más ... que, tantas ... como, einen Superlativ, esta oder aquella und zwei laufende Handlungen.",
      recallPromptEn: "Explain Clara's choice in Spanish in six sentences. Use más ... que, tantas ... como, one superlative, esta or aquella, and two ongoing actions.",
      modelSummary: "La biblioteca es más silenciosa, pero tiene tantas mesas como la cafetería. Ahora la gente está hablando y Clara está estudiando en el lugar menos ruidoso."
    }
  }
];

const tokenize = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`, `${plain}?`];
};

function checksFor(input) {
  const checks = [
    { key: "meaning", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: [input.sentences[0][0], input.sentences[1][0], input.sentences[2][0]] },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correct: input.sentences[1][0] },
    { key: "translate", type: ExerciseType.TRANSLATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: input.sentences[3][1], correct: input.sentences[3][0] },
    { key: "transfer", type: ExerciseType.TRANSFORMATION, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
  return input.checkpoint ? [...checks, { key: "choice-reason", type: ExerciseType.SHORT_ANSWER, question: input.sentences[5][1], correct: input.sentences[5][0] }] : checks;
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "description_comparison_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "description_comparison_retrieval" };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the matching Spanish sentence" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the Spanish sentence" : "Produce the Spanish sentence",
    instruction: "Choose the form from meaning, distance, comparison, or time focus before producing the sentence.",
    questionText: check.question, answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 1 : check.type === ExerciseType.SENTENCE_BUILDER ? 2 : 3,
    order, xpReward: 12, imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "describing-comparing-progressive" },
    update: { title: "Describing, Comparing, and Ongoing Action", description: "Comparatives, equality, superlatives, demonstratives, and estar plus gerund before B1.", cefrLevel: "A2", imageKey: "grammar-scenes:16" },
    create: { slug: "describing-comparing-progressive", title: "Describing, Comparing, and Ongoing Action", description: "Comparatives, equality, superlatives, demonstratives, and estar plus gerund before B1.", cefrLevel: "A2", imageKey: "grammar-scenes:16" }
  });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["daily-actions", "places-around-town", "clothing-basics", "home-and-objects", "essential-words"] } } });
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Description and Comparison", situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: ["You can understand the communicative contrast before choosing a form.", "You can build the pattern with agreement and word order intact.", "You can use the pattern in connected Spanish without a visible model."],
      conceptKeys: ["a2", "description-comparison", input.slug], reviewSummary: input.summary, readingJson: input.readingJson,
      order: input.order, estimatedMinutes: input.checkpoint ? 18 : 15, topicId: topic.id
    };
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const checks = checksFor(input);
    for (let index = 0; index < checks.length; index += 1) await saveExercise(lesson, input, checks[index], index + 1);
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} A2.8 description, comparison, and progressive packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
