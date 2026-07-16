const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "a2-preference-dialogues": {
    title: "Una charla breve sobre gustos",
    inputMode: "listening",
    orientationDe: "Höre zuerst nur auf Frage und Antwort. Achte danach darauf, wie ¿Y tú? das Gespräch zurückgibt und wie pero einen kleinen Gegensatz verbindet.",
    orientationEn: "First listen only for question and answer. Then notice how ¿Y tú? returns the conversation and pero links a small contrast.",
    paragraphs: [
      "Ana pregunta: «¿Qué te gusta hacer?». Pablo responde: «Me gusta leer y cocinar. ¿Y tú?». Ana dice que le gusta escuchar música, pero prefiere ver películas los fines de semana.",
      "Después Pablo pregunta: «¿Prefieres café o té?». Ana responde: «Prefiero el té». No dan respuestas de una sola palabra: añaden una actividad, una preferencia o una pregunta para continuar la conversación."
    ],
    questions: [
      { questionDe: "Was macht Pablo gern?", questionEn: "What does Pablo like doing?", optionsDe: ["Lesen und kochen", "Nur Filme sehen", "Tee kaufen"], optionsEn: ["Reading and cooking", "Only watching films", "Buying tea"], correct: 0, explanationDe: "Pablo sagt me gusta leer y cocinar und verbindet damit zwei Tätigkeiten durch y.", explanationEn: "Pablo says me gusta leer y cocinar, linking two activities with y." },
      { questionDe: "Welche Funktion hat ¿Y tú??", questionEn: "What does ¿Y tú? do?", optionsDe: ["Es gibt dieselbe Frage an die andere Person zurück", "Es beendet das Gespräch", "Es bedeutet aber"], optionsEn: ["It returns the same question to the other person", "It ends the conversation", "It means but"], correct: 0, explanationDe: "¿Y tú? lädt die andere Person zu einer eigenen Antwort ein und hält den kurzen Dialog am Laufen.", explanationEn: "¿Y tú? invites the other person to answer and keeps the short dialogue moving." }
    ],
    recallPromptDe: "Führe den Dialog auf Spanisch in vier kurzen Sätzen weiter: Frage nach einer Tätigkeit, antworte mit zwei Dingen, frage zurück und nenne eine Vorliebe.",
    recallPromptEn: "Continue the dialogue in four short Spanish sentences: ask about an activity, answer with two things, ask back, and state a preference.",
    modelSummary: "Me gusta leer y cocinar. ¿Y tú? Me gusta la música, pero prefiero las películas."
  },
  "scenario-restaurant-order": {
    title: "Una comida sencilla en un restaurante",
    inputMode: "listening",
    orientationDe: "Höre den Restaurantbesuch als feste Reihenfolge: Platz erfragen, Empfehlung verstehen, bestellen und am Ende die Rechnung verlangen.",
    orientationEn: "Listen to the restaurant visit as a fixed sequence: ask for a table, hear a recommendation, order, and request the bill at the end.",
    paragraphs: [
      "Camarero: «Buenas tardes. ¿Cuántas personas?». Cliente: «Una mesa para dos, por favor». El camarero ofrece sopa y pollo. El cliente pregunta: «¿Qué recomienda?». El camarero recomienda la sopa.",
      "El cliente pide la sopa y dos cafés para llevar. Después de comer, dice: «La cuenta, por favor». Las frases son cortas, pero cada una cumple una función distinta dentro de la visita."
    ],
    questions: [
      { questionDe: "Für wie viele Personen braucht der Kunde einen Tisch?", questionEn: "For how many people does the customer need a table?", optionsDe: ["Für zwei", "Für eine", "Für vier"], optionsEn: ["Two", "One", "Four"], correct: 0, explanationDe: "Una mesa para dos, por favor nennt die gewünschte Tischgröße höflich und vollständig.", explanationEn: "Una mesa para dos, por favor states the requested table size politely and completely." },
      { questionDe: "Was sagt der Kunde zum Abschluss?", questionEn: "What does the customer say at the end?", optionsDe: ["La cuenta, por favor", "¿Qué recomienda?", "Para llevar"], optionsEn: ["La cuenta, por favor", "¿Qué recomienda?", "Para llevar"], correct: 0, explanationDe: "La cuenta, por favor verlangt nach dem Essen höflich die Rechnung und beendet den Restaurantablauf.", explanationEn: "La cuenta, por favor politely requests the bill after eating and closes the restaurant sequence." }
    ],
    recallPromptDe: "Spiele den Kunden auf Spanisch: Bitte um einen Tisch für zwei, frage nach einer Empfehlung, bestelle zwei Kaffees zum Mitnehmen und verlange die Rechnung.",
    recallPromptEn: "Play the customer in Spanish: ask for a table for two, request a recommendation, order two coffees to go, and ask for the bill.",
    modelSummary: "Una mesa para dos, por favor. ¿Qué recomienda? Quisiera dos cafés para llevar. La cuenta, por favor."
  },
  "scenario-travel-directions": {
    title: "El camino desde la plaza hasta la estación",
    orientationDe: "Lies zuerst nach dem Ziel und dann Schritt für Schritt. Du musst noch nicht jedes Wort behalten: geradeaus, links und Nähe reichen für den Weg.",
    orientationEn: "Read first for the destination and then step by step. You do not need every word yet: straight, left, and nearby are enough for the route.",
    paragraphs: [
      "Una viajera pregunta: «Perdón, ¿dónde está la estación?». Un hombre responde: «Siga derecho hasta la plaza. Después gire a la izquierda. La estación está cerca del hotel». ",
      "La viajera no entiende el segundo paso y pregunta: «¿Puede repetir, por favor?». El hombre repite más despacio. Ahora ella sabe el destino, dos movimientos y un punto de referencia."
    ],
    questions: [
      { questionDe: "Was soll die Reisende nach dem Platz tun?", questionEn: "What should the traveler do after the square?", optionsDe: ["Links abbiegen", "Rechts abbiegen", "Zurückgehen"], optionsEn: ["Turn left", "Turn right", "Go back"], correct: 0, explanationDe: "Después gire a la izquierda nennt den zweiten Wegschritt nach dem Geradeausgehen bis zum Platz.", explanationEn: "Después gire a la izquierda gives the second direction after going straight to the square." },
      { questionDe: "Warum fragt sie ¿Puede repetir, por favor??", questionEn: "Why does she ask ¿Puede repetir, por favor??", optionsDe: ["Sie hat den zweiten Schritt nicht verstanden", "Sie sucht ein Restaurant", "Sie kennt die Station bereits"], optionsEn: ["She did not understand the second step", "She is looking for a restaurant", "She already knows the station"], correct: 0, explanationDe: "Die Reparaturfrage bittet höflich um Wiederholung, statt so zu tun, als hätte sie den Weg verstanden.", explanationEn: "The repair question politely asks for repetition instead of pretending she understood the route." }
    ],
    recallPromptDe: "Frage auf Spanisch nach der Station, gib danach die zwei Wegschritte wieder und verwende abschließend eine höfliche Bitte um Wiederholung.",
    recallPromptEn: "Ask for the station in Spanish, restate the two direction steps, and finish with a polite request for repetition.",
    modelSummary: "Perdón, ¿dónde está la estación? Siga derecho, gire a la izquierda y, si no entiende, pregunte: ¿Puede repetir, por favor?"
  },
  "scenario-pharmacy-help": {
    title: "Una consulta breve en la farmacia",
    inputMode: "listening",
    orientationDe: "Höre auf vier notwendige Informationen: Symptom, gewünschte Hilfe, wichtige Allergie und Frage zur Häufigkeit der Einnahme.",
    orientationEn: "Listen for four necessary pieces of information: symptom, requested help, important allergy, and the question about how often to take the medicine.",
    paragraphs: [
      "Farmacéutica: «Buenos días. ¿Qué necesita?». Cliente: «Me duele la cabeza y necesito medicina para el dolor. Tengo alergia a la aspirina». La farmacéutica busca una opción adecuada.",
      "Antes de salir, el cliente pregunta: «¿Cada cuánto tomo la medicina?». La farmacéutica explica la frecuencia. El cliente ha dicho qué le duele, qué necesita y qué medicamento debe evitar."
    ],
    questions: [
      { questionDe: "Welche wichtige Sicherheitsinformation nennt der Kunde?", questionEn: "Which important safety information does the customer give?", optionsDe: ["Er hat eine Aspirinallergie", "Er verträgt jedes Medikament", "Er braucht keine Medizin"], optionsEn: ["He is allergic to aspirin", "He tolerates every medicine", "He needs no medicine"], correct: 0, explanationDe: "Tengo alergia a la aspirina warnt die Apothekerin vor einem Mittel, das der Kunde vermeiden muss.", explanationEn: "Tengo alergia a la aspirina warns the pharmacist about a medicine the customer must avoid." },
      { questionDe: "Wonach fragt ¿Cada cuánto tomo la medicina??", questionEn: "What does ¿Cada cuánto tomo la medicina? ask about?", optionsDe: ["Nach der Einnahmehäufigkeit", "Nach dem Preis", "Nach dem Weg zur Apotheke"], optionsEn: ["How often to take it", "The price", "Directions to the pharmacy"], correct: 0, explanationDe: "Cada cuánto fragt, in welchen zeitlichen Abständen die Medizin eingenommen werden soll.", explanationEn: "Cada cuánto asks at what time intervals the medicine should be taken." }
    ],
    recallPromptDe: "Antworte der Apothekerin auf Spanisch mit Symptom, benötigter Medizin und Allergie; frage danach, wie oft du das Mittel nehmen sollst.",
    recallPromptEn: "Answer the pharmacist in Spanish with your symptom, needed medicine, and allergy; then ask how often to take it.",
    modelSummary: "Me duele la cabeza. Necesito medicina para el dolor, pero tengo alergia a la aspirina. ¿Cada cuánto tomo la medicina?"
  },
  "lab-a2-cafe-reading": {
    title: "La rutina de Ana después del trabajo",
    orientationDe: "Lies zuerst nach Person, Zeit und Reihenfolge. Suche danach den Gegensatz mit pero: Was mag Ana, und was bevorzugt sie am Nachmittag?",
    orientationEn: "Read first for person, time, and sequence. Then find the contrast with pero: what does Ana like, and what does she prefer in the afternoon?",
    paragraphs: [
      "Ana trabaja por la mañana en una tienda pequeña. Después va a un café cerca de la estación. Allí habla unos minutos con una amiga y pide una bebida.",
      "A Ana le gusta el café, pero por la tarde prefiere el té. También lee un libro pequeño antes de volver a casa. Su visita al café tiene una secuencia clara y una preferencia concreta."
    ],
    questions: [
      { questionDe: "Wo befindet sich das Café?", questionEn: "Where is the café?", optionsDe: ["In der Nähe des Bahnhofs", "Neben Anas Wohnung", "Im Laden"], optionsEn: ["Near the station", "Next to Ana's home", "Inside the store"], correct: 0, explanationDe: "Cerca de la estación beschreibt die Lage des Cafés mit einem bereits bekannten Ortsrahmen.", explanationEn: "Cerca de la estación locates the café with an already familiar place frame." },
      { questionDe: "Was bevorzugt Ana am Nachmittag?", questionEn: "What does Ana prefer in the afternoon?", optionsDe: ["Tee", "Kaffee", "Saft"], optionsEn: ["Tea", "Coffee", "Juice"], correct: 0, explanationDe: "Pero führt den Gegensatz ein: Kaffee mag sie allgemein, am Nachmittag bevorzugt sie jedoch Tee.", explanationEn: "Pero introduces the contrast: she likes coffee generally but prefers tea in the afternoon." }
    ],
    recallPromptDe: "Fasse Anas Ablauf auf Spanisch in zwei kurzen Sätzen zusammen: Arbeit, Café, Lage, Getränkewahl und Lesen sollen vorkommen.",
    recallPromptEn: "Summarize Ana's routine in two short Spanish sentences, mentioning work, café, location, drink choice, and reading.",
    modelSummary: "Ana trabaja por la mañana y después va a un café cerca de la estación. Le gusta el café, pero prefiere el té y lee antes de volver a casa."
  },
  "lab-a2-weekend-listening": {
    title: "Los planes de mañana y de la noche",
    inputMode: "listening",
    orientationDe: "Höre einmal nur auf die Reihenfolge. Beim zweiten Hören suche Plan, Verpflichtung, Wunsch und Abendaktivität: voy a, tengo que, quiero und por la noche.",
    orientationEn: "Listen once only for sequence. On the second listen, find the plan, obligation, wish, and evening activity: voy a, tengo que, quiero, and por la noche.",
    paragraphs: [
      "Mañana voy a la tienda porque tengo que comprar pan y una bolsa. No quiero estar mucho tiempo allí. Después quiero escuchar música en casa y descansar un poco.",
      "Por la noche voy a leer un libro. Si termino temprano, también voy a llamar a una amiga. El plan distingue lo necesario, lo que la persona quiere hacer y una actividad posible."
    ],
    questions: [
      { questionDe: "Was muss die Person im Laden kaufen?", questionEn: "What does the speaker have to buy at the store?", optionsDe: ["Brot und eine Tasche", "Ein Buch und Musik", "Kaffee und Tee"], optionsEn: ["Bread and a bag", "A book and music", "Coffee and tea"], correct: 0, explanationDe: "Tengo que comprar pan y una bolsa nennt die verpflichtende Aufgabe innerhalb des Plans.", explanationEn: "Tengo que comprar pan y una bolsa states the required task within the plan." },
      { questionDe: "Was möchte die Person nach dem Laden tun?", questionEn: "What does the speaker want to do after the store?", optionsDe: ["Zu Hause Musik hören und sich ausruhen", "Sofort wieder einkaufen", "Zum Bahnhof gehen"], optionsEn: ["Listen to music at home and rest", "Shop again immediately", "Go to the station"], correct: 0, explanationDe: "Después quiero escuchar música en casa y descansar un poco beschreibt den Wunsch nach dem Einkauf.", explanationEn: "Después quiero escuchar música en casa y descansar un poco describes the wish after shopping." }
    ],
    recallPromptDe: "Gib den Plan auf Spanisch in der richtigen Reihenfolge wieder und unterscheide mit tengo que, quiero und voy a zwischen Pflicht, Wunsch und Plan.",
    recallPromptEn: "Restate the plan in Spanish in the correct order, using tengo que, quiero, and voy a to distinguish obligation, wish, and plan.",
    modelSummary: "Mañana voy a la tienda y tengo que comprar pan. Después quiero escuchar música y por la noche voy a leer un libro."
  },
  "checkpoint-a2-scenarios-input": {
    title: "Una tarde con restaurante, estación y farmacia",
    inputMode: "listening",
    orientationDe: "Höre den Ablauf in drei Stationen. Ordne jeder Situation ihre passende Absicht zu: bestellen, nach dem Weg fragen, ein Gesundheitsproblem erklären.",
    orientationEn: "Listen to the sequence in three stops. Match each situation with its purpose: order, ask for directions, and explain a health problem.",
    paragraphs: [
      "Primero, Nora entra en un café y dice: «Quisiera dos cafés para llevar». Después pregunta: «Perdón, ¿dónde está la estación?». Un hombre le explica el camino, pero Nora pide que repita.",
      "Antes de tomar el tren, Nora va a una farmacia porque le duele la cabeza. Dice que necesita medicina para el dolor y pregunta cada cuánto debe tomarla. En una tarde utiliza tres pequeños guiones de supervivencia."
    ],
    questions: [
      { questionDe: "Warum bittet Nora um Wiederholung?", questionEn: "Why does Nora ask for repetition?", optionsDe: ["Sie hat die Wegbeschreibung nicht vollständig verstanden", "Sie möchte noch zwei Kaffees", "Sie kennt die Einnahmehäufigkeit"], optionsEn: ["She did not fully understand the directions", "She wants two more coffees", "She knows how often to take the medicine"], correct: 0, explanationDe: "Die Bitte um Wiederholung gehört zur Wegsituation und hilft Nora, fehlende Information aktiv zu reparieren.", explanationEn: "The repetition request belongs to the direction scenario and helps Nora repair missing information actively." },
      { questionDe: "Welche drei kommunikativen Ziele erreicht Nora?", questionEn: "Which three communicative goals does Nora achieve?", optionsDe: ["Bestellen, Weg erfragen und Apothekenhilfe erhalten", "Über Hobbys sprechen, arbeiten und lesen", "Ein Hotel buchen, bezahlen und kochen"], optionsEn: ["Order, ask directions, and get pharmacy help", "Discuss hobbies, work, and read", "Book a hotel, pay, and cook"], correct: 0, explanationDe: "Der Text verbindet drei bereits gelernte Überlebenssituationen zu einem kurzen, erinnerbaren Tagesablauf.", explanationEn: "The text connects three previously learned survival situations into a short, memorable sequence." }
    ],
    recallPromptDe: "Fasse Noras Nachmittag auf Spanisch zusammen und verwende mindestens eine vollständige Äußerung aus Restaurant, Wegfrage und Apotheke.",
    recallPromptEn: "Summarize Nora's afternoon in Spanish using at least one complete expression from the restaurant, directions, and pharmacy scenarios.",
    modelSummary: "Nora pide dos cafés para llevar, pregunta dónde está la estación y después explica en la farmacia que le duele la cabeza."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const lessons = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (lessons.length !== entries.length) throw new Error(`A2 connected scenarios require ${entries.length} lessons, found ${lessons.length}.`);
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 18 : 15 } });
  }
  console.log(`Seeded connected micro-input for ${entries.length} A2 dialogue and scenario packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
