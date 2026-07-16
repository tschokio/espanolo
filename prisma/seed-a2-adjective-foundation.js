const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const packages = [
  {
    slug: "a2-adjective-agreement-position", topicSlug: "adjective-agreement-position", topicTitle: "Adjective Agreement and Position", order: 831.88, imageKey: "grammar-scenes:9",
    title: "Make Adjectives Agree and Place Them Naturally", summary: "Build complete noun groups and descriptions with reliable gender, number, and default adjective position.",
    sentences: [
      ["Busco un piso tranquilo.", "I am looking for a quiet apartment.", "A descriptive adjective normally follows the noun and agrees with it."],
      ["Busco una zona tranquila.", "I am looking for a quiet area.", "Tranquila matches the feminine noun zona."],
      ["Necesitamos habitaciones tranquilas.", "We need quiet rooms.", "The feminine plural ending carries both gender and number."],
      ["El barrio es moderno.", "The neighborhood is modern.", "An adjective after ser still agrees with the described noun."],
      ["Las calles son modernas.", "The streets are modern.", "Article, noun, verb, and adjective form one plural agreement chain."],
      ["El hotel tiene habitaciones grandes.", "The hotel has large rooms.", "Adjectives in -e usually keep one gender form but add -s in the plural."]
    ],
    readingJson: {
      title: "Un piso tranquilo en una zona práctica", inputMode: "reading",
      orientationDe: "Suche zuerst das Nomen, das beschrieben wird. Bestimme dann Geschlecht und Zahl und passe das Adjektiv daran an. Als sichere Grundstellung steht ein beschreibendes Adjektiv meistens hinter dem Nomen; auch nach ser richtet es sich weiterhin nach diesem Nomen.",
      orientationEn: "Find the noun being described, then match the adjective for gender and number. Descriptive adjectives normally follow the noun; after ser they still agree with that noun.",
      paragraphs: ["Lena busca un piso tranquilo en una zona práctica. Visita una casa moderna con habitaciones grandes, pero las ventanas son pequeñas y la calle es ruidosa.", "Después ve dos pisos luminosos en calles tranquilas. Las cocinas son modernas y los dormitorios son grandes. Lena prefiere el segundo piso porque la zona es tranquila y las habitaciones son luminosas."],
      questions: [
        { questionDe: "Warum steht im Text habitaciones grandes und nicht grandes mit einer weiblichen Endung?", questionEn: "Why does the text use habitaciones grandes without a feminine ending?", optionsDe: ["Adjektive auf -e haben hier dieselbe Geschlechtsform und bilden nur den Plural", "Habitaciones ist männlich", "Das Adjektiv beschreibt das Hotel"], optionsEn: ["Adjectives in -e use the same gender form here and only mark plural", "Habitaciones is masculine", "The adjective describes the hotel"], correct: 0, explanationDe: "Grande endet nicht auf -o und besitzt in dieser Verwendung keine getrennte männliche und weibliche Form. Bei mehreren Zimmern wird daraus jedoch grandes; die Zahl bleibt also sichtbar.", explanationEn: "Grande has no separate masculine and feminine form here, but it becomes grandes for plural rooms." },
        { questionDe: "Welches Wort steuert die Form luminosas?", questionEn: "Which word controls the form luminosas?", optionsDe: ["Habitaciones", "Pisos", "Lena"], optionsEn: ["Habitaciones", "Pisos", "Lena"], correct: 0, explanationDe: "Luminosas beschreibt habitaciones. Das feminine Pluralnomen verlangt deshalb ebenfalls die feminine Pluralform, unabhängig davon, wer die Zimmer betrachtet.", explanationEn: "Luminosas describes habitaciones, so it takes feminine plural form." }
      ],
      recallPromptDe: "Beschreibe auf Spanisch zwei Wohnungen mit mindestens vier Nomen-Adjektiv-Gruppen. Verwende männlichen und weiblichen Singular, mindestens einen Plural sowie ein Adjektiv auf -e.",
      recallPromptEn: "Describe two apartments in Spanish with at least four noun-adjective groups, including both genders, a plural, and an adjective in -e.",
      modelSummary: "Lena busca un piso tranquilo. Ve una casa moderna, habitaciones grandes, ventanas pequeñas y dos pisos luminosos en calles tranquilas."
    }
  },
  {
    slug: "a2-common-adjective-short-forms", topicSlug: "common-adjective-short-forms", topicTitle: "Common Short Adjective Forms", order: 831.89, imageKey: "grammar-scenes:10",
    title: "Use Buen, Mal, Gran, Primer, Algún, and Ningún", summary: "Recognize a small high-frequency set whose masculine singular form shortens before a noun.",
    sentences: [
      ["Es un buen restaurante.", "It is a good restaurant.", "Bueno shortens to buen before a masculine singular noun."],
      ["Hoy hace mal tiempo.", "The weather is bad today.", "Malo shortens to mal before a masculine singular noun."],
      ["Es una gran ciudad.", "It is a great city.", "Grande shortens to gran before a singular noun when it means great or important."],
      ["Es mi primer día aquí.", "It is my first day here.", "Primero shortens to primer before a masculine singular noun."],
      ["¿Hay algún problema?", "Is there any problem?", "Alguno shortens to algún before a masculine singular noun and keeps its accent."],
      ["No tengo ningún problema.", "I do not have any problem.", "Ninguno shortens to ningún before a masculine singular noun and remains inside the no frame."]
    ],
    readingJson: {
      title: "El primer día en una gran ciudad", inputMode: "listening",
      orientationDe: "Behandle diese Formen als kleine, häufige Sondergruppe. Vor einem männlichen Nomen im Singular werden bueno, malo, primero, alguno und ninguno zu buen, mal, primer, algún und ningún. Gran kann vor einem Nomen großartig oder bedeutend heißen; grande hinter dem Nomen beschreibt meist die Größe.",
      orientationEn: "Treat these as a small frequent special set. Before a masculine singular noun, several forms shorten; gran before a noun can mean great, while grande after it normally describes size.",
      paragraphs: ["Es el primer día de Tomás en una gran ciudad. Hace mal tiempo, pero encuentra un buen café cerca del hotel. Pregunta si hay algún autobús directo al centro.", "La camarera dice que no hay ningún problema: el primer autobús sale en diez minutos. Tomás ve después un edificio grande. No es un gran hotel, sino una estación grande y moderna."],
      questions: [
        { questionDe: "Warum steht buen vor café?", questionEn: "Why does buen appear before café?", optionsDe: ["Bueno verkürzt sich vor einem männlichen Nomen im Singular", "Café ist weiblich", "Buen ist die Pluralform"], optionsEn: ["Bueno shortens before a masculine singular noun", "Café is feminine", "Buen is plural"], correct: 0, explanationDe: "Café ist hier männlicher Singular und das Adjektiv steht unmittelbar davor. In genau dieser Umgebung wird bueno zur Kurzform buen.", explanationEn: "Café is masculine singular and bueno shortens immediately before it." },
        { questionDe: "Welchen Unterschied zeigt gran ciudad gegenüber edificio grande?", questionEn: "What contrast does gran ciudad show with edificio grande?", optionsDe: ["Gran bewertet die Stadt als bedeutend; grande beschreibt die Größe des Gebäudes", "Beide bedeuten immer exakt dasselbe", "Gran ist ausschließlich weiblich"], optionsEn: ["Gran evaluates the city as important; grande describes building size", "They always mean exactly the same", "Gran is feminine only"], correct: 0, explanationDe: "Die Stellung trägt hier Bedeutung: gran vor dem Nomen bewertet als großartig oder bedeutend, während grande hinter edificio dessen räumliche Größe beschreibt.", explanationEn: "Position carries meaning here: gran evaluates importance, while grande describes physical size." }
      ],
      recallPromptDe: "Erzähle auf Spanisch von Tomás' erstem Tag. Verwende buen, mal, gran, primer, algún und ningún jeweils in einer vollständigen Nomengruppe und erkläre den Unterschied zwischen gran und grande.",
      recallPromptEn: "Retell Tomás's first day in Spanish using all six short forms and contrast gran with grande.",
      modelSummary: "En su primer día Tomás llega a una gran ciudad con mal tiempo, encuentra un buen café y pregunta por algún autobús; no hay ningún problema."
    }
  },
  {
    slug: "checkpoint-a2-adjective-foundation", topicSlug: "adjective-foundation-checkpoint", topicTitle: "Adjective Foundation Checkpoint", order: 831.9, imageKey: "grammar-scenes:11", checkpoint: true,
    title: "A2 Adjective Foundation Checkpoint", summary: "Combine agreement, normal placement, invariant gender forms, and common short forms before comparing options.", checkpoint: true,
    sentences: [
      ["Buscamos una zona tranquila.", "We are looking for a quiet area.", "The adjective follows and agrees with zona."],
      ["Los pisos nuevos tienen habitaciones grandes.", "The new apartments have large rooms.", "Both adjectives agree with their own nouns."],
      ["El primer piso es pequeño, pero luminoso.", "The first apartment is small but bright.", "Primer shortens before piso; both later adjectives describe piso."],
      ["El segundo piso está en un buen barrio.", "The second apartment is in a good neighborhood.", "Buen is the pre-nominal masculine singular form."],
      ["No hay ningún problema con las ventanas nuevas.", "There is no problem with the new windows.", "Ningún precedes masculine singular problema; nuevas agrees with ventanas."],
      ["Es una gran opción para una familia pequeña.", "It is a great option for a small family.", "Gran evaluates opción; pequeña describes familia after the noun."]
    ],
    readingJson: {
      title: "Elegir un piso con formas que ya tienen sentido", inputMode: "listening",
      orientationDe: "Arbeite in zwei Durchgängen: Ordne zuerst jedes Adjektiv seinem Nomen zu und prüfe Geschlecht sowie Zahl. Markiere danach nur die häufigen Voranstellungen und entscheide, ob eine Kurzform wie primer, buen, ningún oder gran erforderlich ist.",
      orientationEn: "Work in two passes: connect each adjective to its noun and check agreement, then identify the few pre-nominal short forms.",
      paragraphs: ["Clara y Leo buscan una zona tranquila. El primer piso es pequeño, pero tiene ventanas nuevas y habitaciones luminosas. Está en un buen barrio y no hay ningún problema con el transporte.", "El segundo piso tiene habitaciones grandes, pero está en una calle ruidosa. Clara cree que el primero es una gran opción para su familia pequeña. Leo está de acuerdo: prefieren un piso pequeño en una zona tranquila."],
      questions: [
        { questionDe: "Welche Formen beschreiben im ersten Absatz den ersten piso?", questionEn: "Which forms describe the first piso in the first paragraph?", optionsDe: ["Pequeño; ventanas nuevas und habitaciones luminosas beschreiben seine Teile", "Tranquila beschreibt direkt piso", "Ningún beschreibt piso"], optionsEn: ["Pequeño; ventanas nuevas and habitaciones luminosas describe its parts", "Tranquila directly describes piso", "Ningún describes piso"], correct: 0, explanationDe: "Pequeño stimmt direkt mit piso überein. Nuevas gehört zu ventanas und luminosas zu habitaciones; die Endungen zeigen, welches Nomen jeweils beschrieben wird.", explanationEn: "Pequeño agrees with piso, nuevas with ventanas, and luminosas with habitaciones." },
        { questionDe: "Warum wählen Clara und Leo den ersten Piso?", questionEn: "Why do Clara and Leo choose the first apartment?", optionsDe: ["Er liegt in einer ruhigen Gegend und einem guten Viertel", "Er hat die größten Zimmer", "Die laute Straße gefällt ihnen"], optionsEn: ["It is in a quiet area and a good neighborhood", "It has the largest rooms", "They like the noisy street"], correct: 0, explanationDe: "Zona tranquila, buen barrio und kein Verkehrsproblem bilden ihre entscheidenden Kriterien. Die größeren Zimmer des zweiten Pisos gleichen die laute Straße nicht aus.", explanationEn: "The quiet area, good neighborhood, and transport access are decisive." }
      ],
      recallPromptDe: "Begründe auf Spanisch Claras Wahl in mindestens fünf Sätzen. Verwende zwei passende Pluraladjektive, ein Adjektiv auf -e und mindestens drei der Kurzformen buen, primer, algún, ningún oder gran.",
      recallPromptEn: "Justify Clara's choice in Spanish in at least five sentences using plural adjectives, an adjective in -e, and at least three short forms.",
      modelSummary: "El primer piso es pequeño pero luminoso, está en un buen barrio y no tiene ningún problema de transporte; es una gran opción para una familia pequeña."
    }
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`, `${plain}?`]; };

function checks(input) {
  const s = input.sentences;
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: s[0][1], answer: { correct: s[0][0], goal: "adjective_form_meaning" }, options: [s[0], s[1], s[2]].map((item, i) => [item[0], i === 0]) },
    { key: "contrast", type: ExerciseType.MULTIPLE_CHOICE, question: s[4][1], answer: { correct: s[4][0], goal: "adjective_agreement_contrast" }, options: [s[4], s[3], s[1]].map((item, i) => [item[0], i === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: s[1][1], answer: { correctWords: tokens(s[1][0]), goal: "adjective_position" } },
    { key: "translate", type: ExerciseType.TRANSLATION, question: s[2][1], answer: { correct: s[2][0], accepted: accepted(s[2][0]), goal: "adjective_production" } },
    { key: "listen", type: ExerciseType.LISTENING_DICTATION, question: "Type what you hear.", answer: { correct: s[3][0], audioText: s[3][0], accepted: accepted(s[3][0]), goal: "adjective_listening" } },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: s[5][1], answer: { correct: s[5][0], accepted: accepted(s[5][0]), goal: "adjective_recall" } },
    { key: "second-production", type: ExerciseType.TRANSLATION, question: s[4][1], answer: { correct: s[4][0], accepted: accepted(s[4][0]), goal: "adjective_production" } },
    { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.checkpoint ? "Recommend the first apartment as a great option." : input.topicSlug === "common-adjective-short-forms" ? "Ask whether there is any problem." : "Say that you are looking for a quiet area.", answer: { correct: input.checkpoint ? "Es una gran opción." : input.topicSlug === "common-adjective-short-forms" ? "¿Hay algún problema?" : "Busco una zona tranquila.", accepted: accepted(input.checkpoint ? "Es una gran opción." : input.topicSlug === "common-adjective-short-forms" ? "¿Hay algún problema?" : "Busco una zona tranquila."), goal: "adjective_dialogue" } }
  ];
}

async function seedAdjectiveFoundation(client = prisma) {
  const groups = await client.vocabularyGroup.findMany({ where: { slug: { in: ["home-and-objects", "useful-phrases", "essential-words"] } } });
  for (const input of packages) {
    const topic = await client.grammarTopic.upsert({ where: { slug: input.topicSlug }, update: { title: input.topicTitle, description: input.summary, cefrLevel: "A2", imageKey: input.imageKey }, create: { slug: input.topicSlug, title: input.topicTitle, description: input.summary, cefrLevel: "A2", imageKey: input.imageKey } });
    const common = { title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Adjective Foundation", situation: "describing and choosing a place to live", imageKey: input.imageKey, outcomesJson: ["You can connect each adjective to the noun it describes.", "You can match common adjective forms for gender and number.", "You can use a small set of frequent short forms before a noun."], conceptKeys: ["a2", "adjective-agreement", "adjective-position", input.topicSlug], readingJson: input.readingJson, reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 17 : 16, topicId: topic.id };
    const lesson = await client.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } } });
    await client.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await client.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input); const keep = [];
    for (let i = 0; i < authored.length; i += 1) {
      const check = authored[i]; const slug = `${input.slug}-${check.key}`; keep.push(slug);
      const data = { lessonId: lesson.id, topicId: topic.id, type: check.type, prompt: "Choose and build a Spanish adjective phrase", instruction: "Find the described noun, match gender and number, then check whether a frequent pre-nominal short form is required.", questionText: check.question, answerJson: check.answer, explanation: "The noun controls agreement; normal descriptive position and a small set of short forms are learned separately.", difficulty: input.checkpoint ? 4 : 3, order: i + 1, xpReward: 13, imageKey: input.imageKey };
      const exercise = await client.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
      await client.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
      if (check.options) await client.exerciseOption.createMany({ data: check.options.map(([text, isCorrect], j) => ({ exerciseId: exercise.id, text, value: text, isCorrect, order: j + 1 })) });
    }
    await client.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-`, notIn: keep } } });
  }
}

if (require.main === module) seedAdjectiveFoundation().then(() => console.log(`Seeded ${packages.length} A2 adjective foundation packages.`)).catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { checks, packages, seedAdjectiveFoundation };
