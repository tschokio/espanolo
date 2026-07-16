const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "checkpoint-a1-absolute-start": {
    title: "Hola, soy Ana",
    inputMode: "listening",
    orientationDe: "Höre nur auf vier vertraute Bausteine: Begrüßung, Name, Person und Ort. Du musst noch nicht jedes Wort selbst bilden können.",
    orientationEn: "Listen only for four familiar chunks: greeting, name, person, and place. You do not yet need to produce every word yourself.",
    paragraphs: [
      "Ana: Hola. Me llamo Ana. Soy estudiante. Estoy en la biblioteca.",
      "Leo: Hola, Ana. Soy Leo. Él es Pablo. Él está en la cafetería."
    ],
    questions: [
      { questionDe: "Wo befindet sich Ana?", questionEn: "Where is Ana?", optionsDe: ["In der Bibliothek", "In der Cafeteria", "Zu Hause"], optionsEn: ["In the library", "In the café", "At home"], correct: 0, explanationDe: "Ana sagt Estoy en la biblioteca. Estoy verbindet ihre aktuelle Person mit dem Ort Bibliothek.", explanationEn: "Ana says Estoy en la biblioteca. Estoy connects her current person with the library location." },
      { questionDe: "Wer ist in der Cafeteria?", questionEn: "Who is in the café?", optionsDe: ["Pablo", "Ana", "Leo"], optionsEn: ["Pablo", "Ana", "Leo"], correct: 0, explanationDe: "Leo sagt zuerst Él es Pablo und danach Él está en la cafetería. Beide Sätze beziehen sich auf Pablo.", explanationEn: "Leo first says Él es Pablo and then Él está en la cafetería. Both sentences refer to Pablo." }
    ],
    recallPromptDe: "Stelle dich auf Spanisch in drei sehr kurzen Sätzen vor: Begrüßung, Name oder Rolle und dein aktueller Ort. Nutze Hola, soy und estoy en.",
    recallPromptEn: "Introduce yourself in Spanish in three very short sentences: greeting, name or role, and current location. Use hola, soy, and estoy en.",
    modelSummary: "Hola. Me llamo Ana. Soy estudiante y estoy en la biblioteca."
  },
  "checkpoint-a1-core-grammar": {
    title: "Una estudiante en clase",
    orientationDe: "Lies eine kleine Szene und unterscheide Identität von Zustand. Achte zusätzlich auf Artikel und eine einfache Handlung mit einem -ar-Verb.",
    orientationEn: "Read a small scene and distinguish identity from state. Also notice articles and one simple action with an -ar verb.",
    paragraphs: [
      "Clara es una estudiante. Está en la clase de español y habla con el profesor.",
      "El libro está en la mesa. Clara estudia, pero hoy está cansada. El profesor es amable."
    ],
    questions: [
      { questionDe: "Warum steht bei Clara es?", questionEn: "Why is es used for Clara?", optionsDe: ["Es nennt ihre Rolle als Studentin", "Es nennt einen vorübergehenden Ort", "Es bedeutet müde"], optionsEn: ["It names her role as a student", "It names a temporary location", "It means tired"], correct: 0, explanationDe: "Clara es una estudiante beschreibt ihre Identität oder Rolle. Der Ort und ihr Zustand werden dagegen mit está ausgedrückt.", explanationEn: "Clara es una estudiante describes her identity or role. Her location and state instead use está." },
      { questionDe: "Wo befindet sich das Buch?", questionEn: "Where is the book?", optionsDe: ["Auf dem Tisch", "In der Cafeteria", "Bei Clara zu Hause"], optionsEn: ["On the table", "In the café", "At Clara's home"], correct: 0, explanationDe: "El libro está en la mesa verwendet está für den aktuellen Ort des Buches und en für die Ortsangabe.", explanationEn: "El libro está en la mesa uses está for the book's current location and en for the place phrase." }
    ],
    recallPromptDe: "Beschreibe Clara auf Spanisch mit vier Sätzen: ihre Rolle mit es, ihren Ort mit está, ihre Handlung mit estudia oder habla und ihren Zustand.",
    recallPromptEn: "Describe Clara in Spanish in four sentences: her role with es, location with está, action with estudia or habla, and current state.",
    modelSummary: "Clara es estudiante, está en clase, habla con el profesor y hoy está cansada."
  },
  "checkpoint-a1-survival-spanish": {
    title: "Necesito ayuda en la estación",
    inputMode: "listening",
    orientationDe: "Höre eine Überlebenssituation. Suche zuerst das Bedürfnis, dann die Ortsfrage und schließlich die Antwort; unbekannte Einzelwörter darfst du übergehen.",
    orientationEn: "Listen to a survival situation. First find the need, then the location question, and finally the answer; you may ignore unfamiliar individual words.",
    paragraphs: [
      "Viajera: Hola. Necesito un taxi. ¿Dónde está la parada? No tengo un mapa.",
      "Empleado: La parada está cerca del hotel, a la derecha. Viajera: Gracias. También quiero agua, por favor."
    ],
    questions: [
      { questionDe: "Was braucht die Reisende zuerst?", questionEn: "What does the traveler need first?", optionsDe: ["Ein Taxi", "Zwei Bücher", "Einen Tisch"], optionsEn: ["A taxi", "Two books", "A table"], correct: 0, explanationDe: "Necesito un taxi benennt ausdrücklich ihr unmittelbares Bedürfnis. Die Ortsfrage danach sucht den Taxistand.", explanationEn: "Necesito un taxi explicitly names her immediate need. The following location question searches for the taxi stand." },
      { questionDe: "Wo ist der Taxistand?", questionEn: "Where is the taxi stand?", optionsDe: ["Nahe beim Hotel, rechts", "Im Restaurant, links", "Weit vom Hotel"], optionsEn: ["Near the hotel, on the right", "In the restaurant, on the left", "Far from the hotel"], correct: 0, explanationDe: "La parada está cerca del hotel, a la derecha gibt Nähe und Richtung als vollständige Ortsantwort an.", explanationEn: "La parada está cerca del hotel, a la derecha gives both proximity and direction as the full location answer." }
    ],
    recallPromptDe: "Spiele die Reisende und sage auf Spanisch vier Dinge: Begrüßung, was du brauchst, was du nicht hast und wo etwas ist. Ende höflich mit por favor oder gracias.",
    recallPromptEn: "Play the traveler and say four things in Spanish: greeting, what you need, what you do not have, and where something is. End politely with por favor or gracias.",
    modelSummary: "Hola. Necesito un taxi y no tengo un mapa. ¿Dónde está la parada? Gracias."
  },
  "checkpoint-a1-daily-life": {
    title: "Una compra y un pedido sencillos",
    inputMode: "listening",
    orientationDe: "Höre zwei kurze Alltagsschritte: zuerst auf dem Markt kaufen, danach im Café bestellen. Achte besonders auf höfliche Wörter und eine Bitte um Wiederholung.",
    orientationEn: "Listen to two short everyday steps: first buying at the market, then ordering in a café. Notice polite words and a request for repetition.",
    paragraphs: [
      "En el mercado, Sara compra una manzana y dos naranjas. Dice: Una manzana, por favor. Gracias.",
      "Después entra en un café. Pide café con leche. No entiende al camarero y dice: Perdón, más despacio. ¿Puede repetir?"
    ],
    questions: [
      { questionDe: "Was kauft Sara auf dem Markt?", questionEn: "What does Sara buy at the market?", optionsDe: ["Einen Apfel und zwei Orangen", "Nur Kaffee", "Drei Bücher"], optionsEn: ["One apple and two oranges", "Only coffee", "Three books"], correct: 0, explanationDe: "Sara compra una manzana y dos naranjas nennt die Früchte und ihre Mengen unmittelbar im ersten Satz.", explanationEn: "Sara compra una manzana y dos naranjas directly states the fruit and quantities in the first sentence." },
      { questionDe: "Was sagt Sara, als sie nicht versteht?", questionEn: "What does Sara say when she does not understand?", optionsDe: ["Langsamer und bitte wiederholen", "Wo ist der Markt?", "Ich brauche keinen Kaffee"], optionsEn: ["Slower and please repeat", "Where is the market?", "I do not need coffee"], correct: 0, explanationDe: "Más despacio und ¿Puede repetir? sind konkrete Reparaturbausteine, mit denen Sara das Gespräch aufrechterhält.", explanationEn: "Más despacio and ¿Puede repetir? are concrete repair chunks that let Sara keep the conversation going." }
    ],
    recallPromptDe: "Erzähle Saras Weg auf Spanisch in vier kurzen Sätzen. Nenne ihren Einkauf, ihre Bestellung und beide Reparatursätze, wenn sie den Kellner nicht versteht.",
    recallPromptEn: "Retell Sara's trip in Spanish in four short sentences. Include her purchase, order, and both repair phrases when she does not understand the waiter.",
    modelSummary: "Sara compra fruta y después pide café con leche. No entiende y dice: Más despacio. ¿Puede repetir?"
  },
  "checkpoint-a1-building-blocks": {
    title: "De Berlín a una cafetería",
    orientationDe: "Lies eine erste Begegnung mit Herkunft, Person, Ort und Verneinung. Jede Aussage besteht aus einem bereits geübten kurzen Satzbaustein.",
    orientationEn: "Read a first meeting with origin, person, location, and negation. Every statement uses a short sentence chunk already practiced.",
    paragraphs: [
      "Nora: Soy Nora. Soy de Berlín. Él es Luis. Luis no es de Berlín; es de Madrid.",
      "Ahora estamos en una cafetería. La tienda está cerca. El hotel no está cerca; está lejos."
    ],
    questions: [
      { questionDe: "Woher kommt Luis?", questionEn: "Where is Luis from?", optionsDe: ["Aus Madrid", "Aus Berlin", "Aus der Cafeteria"], optionsEn: ["From Madrid", "From Berlin", "From the café"], correct: 0, explanationDe: "Luis no es de Berlín verneint Berlin; es de Madrid nennt anschließend seine tatsächliche Herkunft.", explanationEn: "Luis no es de Berlín rules out Berlin; es de Madrid then gives his actual origin." },
      { questionDe: "Welcher Ort ist weit entfernt?", questionEn: "Which place is far away?", optionsDe: ["Das Hotel", "Das Geschäft", "Die Cafeteria"], optionsEn: ["The hotel", "The shop", "The café"], correct: 0, explanationDe: "El hotel no está cerca; está lejos stellt Nähe und Entfernung als direkten Gegensatz für das Hotel dar.", explanationEn: "El hotel no está cerca; está lejos directly contrasts nearness and distance for the hotel." }
    ],
    recallPromptDe: "Stelle Nora und Luis auf Spanisch vor: Name, Herkunft und aktueller Ort. Ergänze anschließend je einen positiven und einen verneinten Satz über die Nähe von Geschäft und Hotel.",
    recallPromptEn: "Introduce Nora and Luis in Spanish: name, origin, and current location. Then add one positive and one negative sentence about the shop and hotel locations.",
    modelSummary: "Nora es de Berlín y Luis es de Madrid. Están en una cafetería. La tienda está cerca, pero el hotel está lejos."
  },
  "checkpoint-a1-verb-frames": {
    title: "Una mochila para la clase",
    inputMode: "listening",
    orientationDe: "Höre eine kleine Einkaufsszene. Sammle vier Funktionen: Wunsch, Bedarf, Besitz und Preisfrage. Beachte danach den Ort des gekauften Gegenstands.",
    orientationEn: "Listen to a small shopping scene. Collect four functions: want, need, possession, and price question. Then notice the purchased object's location.",
    paragraphs: [
      "Eva: Quiero una mochila para la clase. Necesito una mochila negra. ¿Cuánto cuesta esta? Vendedor: Cuesta veinte euros.",
      "Eva: Tengo veinte euros. La compro. Después la mochila está en la mesa. Eva habla con sus amigos y está feliz."
    ],
    questions: [
      { questionDe: "Welche Farbe soll die Tasche haben?", questionEn: "What color should the bag be?", optionsDe: ["Schwarz", "Rot", "Grün"], optionsEn: ["Black", "Red", "Green"], correct: 0, explanationDe: "Necesito una mochila negra verbindet den Bedarf direkt mit dem Adjektiv negra für die gewünschte Farbe.", explanationEn: "Necesito una mochila negra connects the need directly with the adjective negra for the desired color." },
      { questionDe: "Warum kann Eva die Tasche kaufen?", questionEn: "Why can Eva buy the bag?", optionsDe: ["Sie besitzt zwanzig Euro", "Die Tasche ist kostenlos", "Ihre Freunde kaufen sie"], optionsEn: ["She has twenty euros", "The bag is free", "Her friends buy it"], correct: 0, explanationDe: "Die Tasche kostet zwanzig Euro und Eva sagt Tengo veinte euros. Besitz und Preis passen deshalb zusammen.", explanationEn: "The bag costs twenty euros and Eva says Tengo veinte euros. Her money therefore matches the price." }
    ],
    recallPromptDe: "Spiele Eva und bilde auf Spanisch je einen Satz mit quiero, necesito und tengo. Frage nach dem Preis und sage abschließend, wo die gekaufte Tasche liegt.",
    recallPromptEn: "Play Eva and make one Spanish sentence each with quiero, necesito, and tengo. Ask the price and finally say where the purchased bag is.",
    modelSummary: "Eva quiere y necesita una mochila negra. Tiene veinte euros, pregunta el precio, compra la mochila y la pone en la mesa."
  },
  "checkpoint-a1-health-and-states": {
    title: "En la farmacia con dolor y sed",
    inputMode: "listening",
    orientationDe: "Höre auf Körpersymptom und allgemeinen Zustand. Me duele nennt ein schmerzendes Körperteil; tengo beschreibt hier Durst, Hunger, Hitze oder Kälte.",
    orientationEn: "Listen for a body symptom and a general state. Me duele names a painful body part; tengo here describes thirst, hunger, heat, or cold.",
    paragraphs: [
      "Farmacéutica: Hola. ¿Qué pasa? Tomás: Me duele la cabeza y tengo sed. También tengo mucho calor.",
      "Farmacéutica: Toma agua y descansa. Tomás: Gracias. Mi amiga tiene frío, pero no le duele la cabeza."
    ],
    questions: [
      { questionDe: "Welches Körperteil tut Tomás weh?", questionEn: "Which body part hurts Tomás?", optionsDe: ["Der Kopf", "Der Arm", "Der Fuß"], optionsEn: ["His head", "His arm", "His foot"], correct: 0, explanationDe: "Me duele la cabeza setzt nach me duele genau das betroffene Körperteil la cabeza ein.", explanationEn: "Me duele la cabeza places the affected body part la cabeza directly after me duele." },
      { questionDe: "Welcher Zustand gehört zu seiner Freundin?", questionEn: "Which state belongs to his friend?", optionsDe: ["Ihr ist kalt", "Sie hat Kopfschmerzen", "Sie hat großen Durst"], optionsEn: ["She is cold", "Her head hurts", "She is very thirsty"], correct: 0, explanationDe: "Mi amiga tiene frío nennt Kälte als ihren Zustand; danach wird Kopfschmerz ausdrücklich verneint.", explanationEn: "Mi amiga tiene frío names cold as her state; the following clause explicitly rules out a headache." }
    ],
    recallPromptDe: "Erkläre in der Apotheke auf Spanisch mindestens drei Dinge: welches Körperteil weh tut und ob du Hunger, Durst, Hitze oder Kälte hast. Beende die Antwort höflich.",
    recallPromptEn: "Explain at the pharmacy in Spanish at least three things: which body part hurts and whether you are hungry, thirsty, hot, or cold. End politely.",
    modelSummary: "A Tomás le duele la cabeza, tiene sed y tiene calor. Su amiga tiene frío, pero no le duele la cabeza."
  },
  "checkpoint-a1-foundations": {
    title: "Cinco cosas en un parque de colores",
    orientationDe: "Lies eine kleine Parkbeschreibung und entnimm Anzahl, Farbe, Naturwort und Wetter. Die Aufgabe verbindet bekannten Wortschatz, ohne neue Grammatik einzuführen.",
    orientationEn: "Read a small park description and identify quantity, color, nature word, and weather. The task connects known vocabulary without adding new grammar.",
    paragraphs: [
      "Hoy hace sol. En el parque hay tres árboles verdes, dos flores rojas y un banco blanco.",
      "Ana ve cinco pájaros pequeños. El cielo es azul, pero una nube gris está lejos. No hace frío."
    ],
    questions: [
      { questionDe: "Wie viele rote Blumen gibt es?", questionEn: "How many red flowers are there?", optionsDe: ["Zwei", "Drei", "Fünf"], optionsEn: ["Two", "Three", "Five"], correct: 0, explanationDe: "Dos flores rojas verbindet die Zahl zwei mit dem femininen Plural von Blume und der passenden Farbform rojas.", explanationEn: "Dos flores rojas combines the number two with the feminine plural noun and matching color form rojas." },
      { questionDe: "Wie ist das Wetter?", questionEn: "What is the weather like?", optionsDe: ["Sonnig und nicht kalt", "Kalt und regnerisch", "Sehr windig"], optionsEn: ["Sunny and not cold", "Cold and rainy", "Very windy"], correct: 0, explanationDe: "Hoy hace sol beschreibt Sonne; No hace frío verneint Kälte. Die graue Wolke ist nur Teil der Szene.", explanationEn: "Hoy hace sol describes sunshine; No hace frío rules out cold. The gray cloud is only part of the scene." }
    ],
    recallPromptDe: "Beschreibe den Park auf Spanisch mit mindestens fünf Sätzen. Verwende zwei Zahlen, drei Farben, zwei Naturwörter und je einen positiven und negativen Wettersatz.",
    recallPromptEn: "Describe the park in Spanish in at least five sentences. Use two numbers, three colors, two nature words, and one positive and one negative weather sentence.",
    modelSummary: "Hace sol y no hace frío. Hay árboles verdes, flores rojas, un banco blanco, cinco pájaros y una nube gris."
  }
};

const dialogueTransfers = [
  {
    lessonSlug: "checkpoint-a1-core-grammar",
    slug: "checkpoint-a1-core-grammar-dialogue-transfer",
    questionText: "Hola, ¿quién eres y cómo estás hoy?",
    correct: "Yo soy estudiante. Estoy feliz hoy.",
    accepted: [
      "yo soy estudiante estoy feliz hoy",
      "yo soy estudiante. estoy feliz hoy.",
      "soy estudiante estoy feliz hoy",
      "soy estudiante. estoy feliz hoy."
    ],
    explanation: "Use ser for identity and estar for a current state: Yo soy estudiante. Estoy feliz hoy."
  },
  {
    lessonSlug: "checkpoint-a1-daily-life",
    slug: "checkpoint-a1-daily-life-dialogue-transfer",
    questionText: "El camarero habla muy rápido. ¿Qué dices?",
    correct: "No entiendo, más despacio, por favor.",
    accepted: [
      "no entiendo mas despacio por favor",
      "no entiendo, mas despacio, por favor",
      "no entiendo más despacio por favor",
      "no entiendo, más despacio, por favor."
    ],
    explanation: "No entiendo signals the problem; más despacio, por favor keeps the conversation going politely."
  },
  {
    lessonSlug: "checkpoint-a1-building-blocks",
    slug: "checkpoint-a1-building-blocks-dialogue-transfer",
    questionText: "Hola, ¿de dónde eres?",
    correct: "Soy de Austria.",
    accepted: ["soy de austria", "soy de austria."],
    explanation: "Origin uses the stable chunk soy de plus a place."
  },
  {
    lessonSlug: "checkpoint-a1-verb-frames",
    slug: "checkpoint-a1-verb-frames-dialogue-transfer",
    questionText: "¿Qué tienes para la clase?",
    correct: "Tengo una mochila.",
    accepted: ["tengo una mochila", "tengo una mochila."],
    explanation: "Tengo plus a noun says what you have."
  },
  {
    lessonSlug: "checkpoint-a1-foundations",
    slug: "checkpoint-a1-foundations-dialogue-transfer",
    questionText: "Hola, ¿quién eres y dónde estás?",
    correct: "Yo soy estudiante y estoy en la biblioteca.",
    accepted: [
      "yo soy estudiante y estoy en la biblioteca",
      "yo soy estudiante y estoy en la biblioteca.",
      "soy estudiante y estoy en la biblioteca",
      "soy estudiante y estoy en la biblioteca."
    ],
    explanation: "Use soy for identity and estoy en for your current location."
  },
  {
    lessonSlug: "checkpoint-a1-essential-present",
    slug: "checkpoint-a1-essential-present-dialogue-transfer",
    questionText: "Tu hermana y tú, ¿qué hacen por la mañana?",
    correct: "Mi hermana lee y yo escribo.",
    accepted: [
      "mi hermana lee y yo escribo",
      "mi hermana lee y yo escribo."
    ],
    explanation: "The reply combines two already practiced present-tense actions in one connected answer."
  }
];

async function upsertDialogueTransfer(lesson, transfer) {
  const data = {
    lessonId: lesson.id,
    topicId: lesson.topicId,
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Continue the short conversation.",
    instruction: "Reply in Spanish with the sentence pattern practiced in this checkpoint.",
    questionText: transfer.questionText,
    answerJson: {
      correct: transfer.correct,
      accepted: transfer.accepted,
      goal: "dialogue_reply",
      supportDe: "Antworte mit den bereits geübten Satzbausteinen. Beginne direkt mit der Information, nach der gefragt wurde."
    },
    explanation: transfer.explanation,
    difficulty: 2,
    order: 90,
    xpReward: 18,
    imageKey: null
  };
  await prisma.exercise.upsert({
    where: { slug: transfer.slug },
    update: data,
    create: { slug: transfer.slug, ...data }
  });
}

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const requiredSlugs = [...new Set([
    ...entries.map(([slug]) => slug),
    ...dialogueTransfers.map((transfer) => transfer.lessonSlug)
  ])];
  const lessons = await prisma.lesson.findMany({
    where: { slug: { in: requiredSlugs } },
    select: { id: true, slug: true, topicId: true }
  });
  if (lessons.length !== requiredSlugs.length) throw new Error(`A1 checkpoint transfer requires ${requiredSlugs.length} lessons, found ${lessons.length}.`);
  for (const [slug, readingJson] of entries) await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: 18 } });
  const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));
  for (const transfer of dialogueTransfers) await upsertDialogueTransfer(lessonBySlug.get(transfer.lessonSlug), transfer);
  console.log(`Seeded ${entries.length} A1 checkpoint micro-transfer packages and ${dialogueTransfers.length} dialogue transfers.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson, dialogueTransfers };
