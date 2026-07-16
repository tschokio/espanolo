const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "a2-gustar-basics": {
    title: "Lo que le gusta a Clara",
    inputMode: "listening",
    orientationDe: "Höre auf die kleinen Wörter vor gusta: me, te und le zeigen, wem etwas gefällt. Das Gefallende steht danach und bestimmt das Verb.",
    orientationEn: "Listen for the small words before gusta: me, te, and le show who likes something. The liked thing follows and controls the verb.",
    paragraphs: [
      "A Clara le gusta el café, pero no le gusta el té. Por la mañana escucha música porque le gusta empezar el día con calma.",
      "Su amigo pregunta: ¿Te gusta estudiar en una cafetería? Clara responde: Sí, me gusta mucho. Allí lee, escribe y habla un poco de español."
    ],
    questions: [
      { questionDe: "Welches Getränk gefällt Clara nicht?", questionEn: "Which drink does Clara not like?", optionsDe: ["Tee", "Kaffee", "Wasser"], optionsEn: ["Tea", "Coffee", "Water"], correct: 0, explanationDe: "No le gusta el té verneint ausdrücklich, dass Clara Tee mag; Kaffee wird zuvor positiv genannt.", explanationEn: "No le gusta el té explicitly says Clara does not like tea; coffee is mentioned positively before it." },
      { questionDe: "Worauf bezieht sich me in me gusta mucho?", questionEn: "Who does me refer to in me gusta mucho?", optionsDe: ["Auf Clara, die antwortet", "Auf ihren Freund", "Auf die Cafeteria als Person"], optionsEn: ["Clara, who is answering", "Her friend", "The café as a person"], correct: 0, explanationDe: "Clara spricht über sich selbst. Deshalb zeigt me, dass ihr das Lernen in der Cafeteria gefällt.", explanationEn: "Clara is speaking about herself, so me shows that studying in the café is pleasing to her." }
    ],
    recallPromptDe: "Sage auf Spanisch, welches Getränk Clara mag, welches sie nicht mag und was sie gern in der Cafeteria macht. Verwende le gusta und me gusta.",
    recallPromptEn: "Say in Spanish which drink Clara likes, which she dislikes, and what she likes doing in the café. Use le gusta and me gusta.",
    modelSummary: "A Clara le gusta el café, no le gusta el té y le gusta estudiar en una cafetería."
  },
  "a2-gustar-plurals-and-infinitives": {
    title: "Una cosa, varias cosas y una actividad",
    orientationDe: "Vergleiche gusta mit gustan. Ein einzelnes Ding oder eine Tätigkeit verlangt gusta; mehrere Dinge verlangen gustan. Die Person bleibt dabei gleich.",
    orientationEn: "Compare gusta and gustan. One thing or an activity takes gusta; several things take gustan. The person stays the same.",
    paragraphs: [
      "A Diego le gusta la película nueva y le gusta bailar los viernes. También le encantan las canciones de la película porque son alegres.",
      "No le gustan los finales tristes. Su hermana prefiere leer: le gustan los libros cortos y le encanta visitar la biblioteca después del trabajo."
    ],
    questions: [
      { questionDe: "Warum steht bei las canciones die Form encantan?", questionEn: "Why is encantan used with las canciones?", optionsDe: ["Weil canciones im Plural steht", "Weil Diego männlich ist", "Weil die Handlung freitags geschieht"], optionsEn: ["Because canciones is plural", "Because Diego is male", "Because the action happens on Fridays"], correct: 0, explanationDe: "Das Verb richtet sich nach dem, was gefällt. Las canciones steht im Plural, deshalb heißt es le encantan.", explanationEn: "The verb agrees with what is pleasing. Las canciones is plural, so the form is le encantan." },
      { questionDe: "Welche Tätigkeit gefällt Diegos Schwester besonders?", questionEn: "Which activity does Diego's sister especially enjoy?", optionsDe: ["Die Bibliothek besuchen", "Freitags tanzen", "Traurige Filme sehen"], optionsEn: ["Visiting the library", "Dancing on Fridays", "Watching sad films"], correct: 0, explanationDe: "Le encanta visitar la biblioteca verwendet encanta vor dem Infinitiv visitar und verstärkt ihr Gefallen.", explanationEn: "Le encanta visitar la biblioteca uses encanta before the infinitive visitar and emphasizes her enjoyment." }
    ],
    recallPromptDe: "Bilde auf Spanisch drei Sätze: einen mit gusta und einem einzelnen Ding, einen mit gustan und mehreren Dingen und einen mit gusta oder encanta plus Infinitiv.",
    recallPromptEn: "Make three Spanish sentences: one with gusta and one thing, one with gustan and several things, and one with gusta or encanta plus an infinitive.",
    modelSummary: "A Diego le gusta bailar y le encantan las canciones, pero no le gustan los finales tristes."
  },
  "a2-preferir-and-favorites": {
    title: "Café o té: una conversación sobre favoritos",
    inputMode: "listening",
    orientationDe: "Höre den Unterschied zwischen mögen, bevorzugen und Favoriten nennen: me gusta, prefiero und mi favorito oder favorita ist.",
    orientationEn: "Listen for the difference between liking, preferring, and naming favorites: me gusta, prefiero, and mi favorito or favorita es.",
    paragraphs: [
      "Nora pregunta: ¿Te gusta el café? Luis responde: Sí, me gusta, pero prefiero el té por la mañana. Mi té favorito es el té verde.",
      "Por la tarde Luis prefiere beber agua. A Nora le encanta el café con leche, pero su bebida favorita en verano es la limonada fría."
    ],
    questions: [
      { questionDe: "Was bevorzugt Luis am Morgen?", questionEn: "What does Luis prefer in the morning?", optionsDe: ["Tee", "Kaffee mit Milch", "Kalte Limonade"], optionsEn: ["Tea", "Coffee with milk", "Cold lemonade"], correct: 0, explanationDe: "Prefiero el té por la mañana drückt eine Wahl zwischen Möglichkeiten aus und nennt Luis' morgendliche Präferenz.", explanationEn: "Prefiero el té por la mañana expresses a choice between options and gives Luis's morning preference." },
      { questionDe: "Welches Getränk ist Noras Sommerfavorit?", questionEn: "Which drink is Nora's summer favorite?", optionsDe: ["Kalte Limonade", "Grüner Tee", "Wasser"], optionsEn: ["Cold lemonade", "Green tea", "Water"], correct: 0, explanationDe: "Su bebida favorita en verano es la limonada fría nennt ausdrücklich Noras Favoriten für den Sommer.", explanationEn: "Su bebida favorita en verano es la limonada fría explicitly names Nora's favorite summer drink." }
    ],
    recallPromptDe: "Spiele Luis oder Nora und antworte auf Spanisch: Was magst du, was bevorzugst du und was ist dein Lieblingsgetränk? Nutze aber für einen Gegensatz.",
    recallPromptEn: "Play Luis or Nora and answer in Spanish: what do you like, what do you prefer, and what is your favorite drink? Use pero for contrast.",
    modelSummary: "A Luis le gusta el café, pero prefiere el té; a Nora le encanta el café con leche, pero su favorita es la limonada."
  },
  "checkpoint-a2-likes-preferences": {
    title: "Elegir juntos un plan para el sábado",
    inputMode: "listening",
    orientationDe: "Höre ein kurzes Planungsgespräch. Sammle zuerst Gemeinsamkeiten und Unterschiede; achte dann auf gusta, gustan, encanta, prefiero und favorito.",
    orientationEn: "Listen to a short planning conversation. First collect shared and different preferences; then notice gusta, gustan, encanta, prefiero, and favorito.",
    paragraphs: [
      "Ana pregunta: ¿Te gusta ir al cine? A Pablo le gustan las películas, pero no le gustan los cines grandes. Prefiere ver una película en casa.",
      "A Ana le encanta cocinar y su comida favorita es la pizza. Pablo responde: ¡A mí también! El sábado van a preparar una pizza y ver una película juntos."
    ],
    questions: [
      { questionDe: "Warum möchte Pablo lieber zu Hause bleiben?", questionEn: "Why would Pablo rather stay at home?", optionsDe: ["Er mag große Kinos nicht", "Er mag keine Filme", "Er muss arbeiten"], optionsEn: ["He does not like large cinemas", "He does not like films", "He has to work"], correct: 0, explanationDe: "No le gustan los cines grandes erklärt den Gegensatz: Filme gefallen ihm, große Kinos dagegen nicht.", explanationEn: "No le gustan los cines grandes explains the contrast: he likes films, but not large cinemas." },
      { questionDe: "Welcher gemeinsame Plan entsteht?", questionEn: "What shared plan do they make?", optionsDe: ["Pizza machen und einen Film sehen", "Ins große Kino gehen", "Nur Kaffee trinken"], optionsEn: ["Make pizza and watch a film", "Go to a large cinema", "Only drink coffee"], correct: 0, explanationDe: "Van a preparar una pizza y ver una película verbindet ihre gemeinsamen Vorlieben zu einem konkreten Samstagsplan.", explanationEn: "Van a preparar una pizza y ver una película combines their shared preferences into a concrete Saturday plan." }
    ],
    recallPromptDe: "Erkläre den Dialog auf Spanisch: Was mag Pablo, was mag er nicht, was bevorzugt er, was liebt Ana und welchen gemeinsamen Plan finden beide?",
    recallPromptEn: "Explain the dialogue in Spanish: what does Pablo like and dislike, what does he prefer, what does Ana love, and what shared plan do they find?",
    modelSummary: "A Pablo le gustan las películas, pero prefiere verlas en casa. A Ana le encanta cocinar y juntos preparan pizza y ven una película."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const lessons = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (lessons.length !== entries.length) throw new Error(`A2 preference input requires ${entries.length} lessons, found ${lessons.length}.`);
  for (const [slug, readingJson] of entries) await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 18 : 15 } });
  console.log(`Seeded connected micro-input for ${entries.length} A2 preference packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
