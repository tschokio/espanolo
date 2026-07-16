const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "a2-past-time-and-ar-preterite": {
    title: "El sábado de Laura paso a paso",
    inputMode: "listening",
    orientationDe: "Höre zuerst die Zeitanker ayer, por la mañana und después. Danach achte auf die abgeschlossenen -ar-Handlungen mit -é, -ó, -amos und -aron.",
    orientationEn: "First listen for the time anchors ayer, por la mañana, and después. Then notice completed -ar actions with -é, -ó, -amos, and -aron.",
    paragraphs: [
      "Ayer Laura trabajó por la mañana y preparó el desayuno para su familia. Después llamó a su amiga Eva y las dos caminaron hasta el centro.",
      "Allí visitaron un museo pequeño. Laura compró una postal y Eva sacó varias fotos. Por la noche cenaron juntas y hablaron sobre el día."
    ],
    questions: [
      { questionDe: "Wen rief Laura nach dem Frühstück an?", questionEn: "Who did Laura call after breakfast?", optionsDe: ["Ihre Freundin Eva", "Ihre Familie", "Das Museum"], optionsEn: ["Her friend Eva", "Her family", "The museum"], correct: 0, explanationDe: "Después llamó a su amiga Eva nennt sowohl die abgeschlossene Handlung als auch die angerufene Person eindeutig.", explanationEn: "Después llamó a su amiga Eva clearly names both the completed action and the person she called." },
      { questionDe: "Welche Endung verbindet die gemeinsamen Handlungen?", questionEn: "Which ending links their shared actions?", optionsDe: ["-aron", "-é", "-ó"], optionsEn: ["-aron", "-é", "-ó"], correct: 0, explanationDe: "Caminaron, visitaron, cenaron und hablaron stehen für Laura und Eva zusammen und tragen die Pluralendung -aron.", explanationEn: "Caminaron, visitaron, cenaron, and hablaron refer to Laura and Eva together and use the plural ending -aron." }
    ],
    recallPromptDe: "Erzähle Lauras Samstag auf Spanisch in mindestens fünf abgeschlossenen Schritten. Nutze ayer, después und por la noche sowie Formen mit -ó und -aron.",
    recallPromptEn: "Retell Laura's Saturday in Spanish in at least five completed steps. Use ayer, después, and por la noche plus forms ending in -ó and -aron.",
    modelSummary: "Ayer Laura trabajó, llamó a Eva y caminaron al centro. Visitaron un museo, cenaron juntas y hablaron sobre el día."
  },
  "a2-regular-er-ir-preterite": {
    title: "Una llegada tarde pero completa",
    orientationDe: "Lies eine Folge abgeschlossener -er- und -ir-Handlungen. Achte besonders auf -í für yo, -ió für eine Person und -ieron für mehrere Personen.",
    orientationEn: "Read a sequence of completed -er and -ir actions. Notice especially -í for yo, -ió for one person, and -ieron for several people.",
    paragraphs: [
      "Ayer salí tarde del trabajo y corrí hasta la estación. Allí vi a Marcos. Él recibió un mensaje y decidió esperar conmigo.",
      "Cuando llegó el tren, subimos y compartimos unos bocadillos. Marcos comió uno y yo bebí agua. Después escribimos a nuestros amigos y todos volvieron a casa."
    ],
    questions: [
      { questionDe: "Warum wartete Marcos am Bahnhof?", questionEn: "Why did Marcos wait at the station?", optionsDe: ["Er erhielt eine Nachricht und blieb bei der Person", "Er verpasste sein Essen", "Er arbeitete dort"], optionsEn: ["He received a message and stayed with the person", "He missed his food", "He worked there"], correct: 0, explanationDe: "Él recibió un mensaje y decidió esperar conmigo verbindet zwei abgeschlossene Handlungen von Marcos.", explanationEn: "Él recibió un mensaje y decidió esperar conmigo connects two completed actions performed by Marcos." },
      { questionDe: "Welche Handlung steht eindeutig in der yo-Form?", questionEn: "Which action is clearly in the first-person singular?", optionsDe: ["Bebí agua", "Volvieron a casa", "Marcos comió"], optionsEn: ["Bebí agua", "They returned home", "Marcos ate"], correct: 0, explanationDe: "Yo bebí agua nennt das Subjekt ausdrücklich; die Endung -í ist die regelmäßige yo-Endung im Präteritum.", explanationEn: "Yo bebí agua states the subject explicitly; -í is the regular first-person preterite ending." }
    ],
    recallPromptDe: "Fasse die Reise auf Spanisch in fünf Sätzen zusammen. Verwende mindestens eine Form auf -í, eine auf -ió und eine Pluralform auf -ieron.",
    recallPromptEn: "Summarize the journey in Spanish in five sentences. Use at least one form ending in -í, one in -ió, and one plural form ending in -ieron.",
    modelSummary: "Ayer salí tarde, vi a Marcos y subimos al tren. Él comió, yo bebí agua y después escribimos a nuestros amigos."
  },
  "a2-essential-irregular-preterite": {
    title: "Un problema inesperado en el mercado",
    inputMode: "listening",
    orientationDe: "Höre die häufigen Vergangenheitsbausteine als ganze Einheiten: fui, hice, tuve und estuve. Suche danach die Reihenfolge des Problems und seiner Lösung.",
    orientationEn: "Listen to the common past chunks as complete units: fui, hice, tuve, and estuve. Then find the order of the problem and its solution.",
    paragraphs: [
      "Ayer fui al mercado y tuve un problema: no encontré mi cartera. Primero estuve muy nervioso y hablé con una vendedora.",
      "Después hice una llamada a casa. Mi hermano encontró la cartera y fue al mercado. Estuve allí veinte minutos más y finalmente tuve mi cartera otra vez."
    ],
    questions: [
      { questionDe: "Welches Problem hatte der Sprecher?", questionEn: "What problem did the speaker have?", optionsDe: ["Er fand seine Geldbörse nicht", "Der Markt war geschlossen", "Sein Bruder verlor sein Telefon"], optionsEn: ["He could not find his wallet", "The market was closed", "His brother lost his phone"], correct: 0, explanationDe: "Tuve un problema wird direkt durch no encontré mi cartera erklärt: Die Geldbörse war zunächst nicht auffindbar.", explanationEn: "Tuve un problema is immediately explained by no encontré mi cartera: the wallet could not be found at first." },
      { questionDe: "Wer brachte die Lösung zum Markt?", questionEn: "Who brought the solution to the market?", optionsDe: ["Der Bruder", "Die Verkäuferin", "Eine Freundin"], optionsEn: ["The brother", "The salesperson", "A friend"], correct: 0, explanationDe: "Mi hermano encontró la cartera y fue al mercado zeigt, dass der Bruder die Geldbörse fand und zum Markt kam.", explanationEn: "Mi hermano encontró la cartera y fue al mercado shows that the brother found the wallet and came to the market." }
    ],
    recallPromptDe: "Erzähle die Geschichte auf Spanisch mit fui, tuve, estuve und hice in der richtigen Reihenfolge. Nenne anschließend, wie der Bruder das Problem löste.",
    recallPromptEn: "Retell the story in Spanish with fui, tuve, estuve, and hice in the correct order. Then say how the brother solved the problem.",
    modelSummary: "Ayer fui al mercado, tuve un problema y estuve nervioso. Hice una llamada y mi hermano fue al mercado con mi cartera."
  },
  "a2-imperfect-background": {
    title: "Los veranos de la infancia",
    inputMode: "listening",
    orientationDe: "Höre nicht nach einzelnen Ereignissen, sondern nach einer früheren Lebenswelt: Zustände, Wetter und wiederholte Gewohnheiten stehen hier im Imperfekt.",
    orientationEn: "Do not listen for isolated events, but for a past world: states, weather, and repeated habits use the imperfect here.",
    paragraphs: [
      "Cuando Elena era niña, vivía con sus abuelos en un pueblo pequeño. La casa tenía un jardín y siempre hacía mucho calor en verano.",
      "Cada mañana Elena caminaba al río con su perro. Por la tarde jugaba con sus amigos y por la noche todos cenaban fuera. Eran veranos tranquilos y largos."
    ],
    questions: [
      { questionDe: "Welche Handlung wiederholte sich jeden Morgen?", questionEn: "Which action was repeated every morning?", optionsDe: ["Elena ging mit ihrem Hund zum Fluss", "Elena zog in ein Dorf", "Die Freunde aßen Frühstück"], optionsEn: ["Elena walked to the river with her dog", "Elena moved to a village", "The friends ate breakfast"], correct: 0, explanationDe: "Cada mañana zusammen mit caminaba kennzeichnet den Weg zum Fluss als regelmäßige frühere Gewohnheit.", explanationEn: "Cada mañana together with caminaba marks the walk to the river as a repeated past habit." },
      { questionDe: "Welche Information beschreibt das Wetter im Hintergrund?", questionEn: "Which information describes the background weather?", optionsDe: ["Im Sommer war es sehr heiß", "Es regnete einmal", "Heute ist es kalt"], optionsEn: ["It was very hot in summer", "It rained once", "It is cold today"], correct: 0, explanationDe: "Siempre hacía mucho calor en verano beschreibt einen typischen länger bestehenden Hintergrund und kein einzelnes Ereignis.", explanationEn: "Siempre hacía mucho calor en verano describes a typical ongoing background, not one isolated event." }
    ],
    recallPromptDe: "Beschreibe Elenas frühere Sommer auf Spanisch. Nutze cuando era niña, vivía, tenía, hacía sowie mindestens zwei wiederholte Handlungen im Imperfekt.",
    recallPromptEn: "Describe Elena's childhood summers in Spanish. Use cuando era niña, vivía, tenía, hacía, and at least two repeated imperfect actions.",
    modelSummary: "Cuando Elena era niña, vivía en un pueblo. Hacía calor y cada día caminaba al río, jugaba con amigos y cenaba fuera."
  },
  "a2-event-and-background": {
    title: "La llamada durante la tormenta",
    inputMode: "listening",
    orientationDe: "Trenne Kulisse und Ereignis: Das Imperfekt beschreibt, was bereits andauerte; das Präteritum setzt einen abgeschlossenen neuen Punkt in die Geschichte.",
    orientationEn: "Separate scene and event: the imperfect describes what was already ongoing; the preterite adds a completed new point to the story.",
    paragraphs: [
      "Ayer hacía frío y llovía. Marta estaba en casa y preparaba la cena cuando sonó el teléfono. Era su amigo Daniel.",
      "Daniel caminaba por el parque cuando empezó la tormenta. No tenía paraguas, así que Marta salió de casa, condujo hasta el parque y lo llevó a casa."
    ],
    questions: [
      { questionDe: "Was geschah, während Marta das Abendessen vorbereitete?", questionEn: "What happened while Marta was preparing dinner?", optionsDe: ["Das Telefon klingelte", "Der Regen hörte auf", "Daniel kaufte einen Regenschirm"], optionsEn: ["The phone rang", "The rain stopped", "Daniel bought an umbrella"], correct: 0, explanationDe: "Preparaba bildet die bereits laufende Kulisse; sonó setzt das abgeschlossene Ereignis, das die Handlung weiterführt.", explanationEn: "Preparaba forms the ongoing background; sonó gives the completed event that moves the story forward." },
      { questionDe: "Welche Formen beschreiben Daniels Hintergrundsituation?", questionEn: "Which forms describe Daniel's background situation?", optionsDe: ["Caminaba und no tenía", "Empezó und salió", "Condujo und llevó"], optionsEn: ["Caminaba and no tenía", "Empezó and salió", "Condujo and llevó"], correct: 0, explanationDe: "Caminaba und no tenía beschreiben die laufende Situation. Empezó, salió, condujo und llevó sind begrenzte Ereignisse.", explanationEn: "Caminaba and no tenía describe the ongoing situation. Empezó, salió, condujo, and llevó are bounded events." }
    ],
    recallPromptDe: "Erzähle die Geschichte auf Spanisch nach. Beginne mit Wetter und laufenden Handlungen im Imperfekt und setze dann mindestens vier abgeschlossene Ereignisse im Präteritum ein.",
    recallPromptEn: "Retell the story in Spanish. Begin with weather and ongoing imperfect actions, then include at least four completed preterite events.",
    modelSummary: "Llovía y Marta preparaba la cena cuando sonó el teléfono. Daniel caminaba sin paraguas, así que Marta salió y lo llevó a casa."
  },
  "checkpoint-a2-past-events": {
    title: "Una tarde que cambió de repente",
    inputMode: "listening",
    orientationDe: "Höre die vollständige Mini-Erzählung zweimal. Beim ersten Mal ordnest du die Ereignisse; beim zweiten Mal trennst du Hintergrund, Gewohnheit und abgeschlossene Handlung.",
    orientationEn: "Listen to the complete mini-story twice. First order the events; then separate background, habit, and completed action.",
    paragraphs: [
      "Cuando Luis era estudiante, trabajaba cada sábado en una cafetería. Ayer hacía sol y había muchos clientes. Luis preparaba café cuando entró una mujer con un perro.",
      "El perro vio una bolsa, corrió hacia una mesa y tiró dos tazas. Luis fue rápido, recogió las tazas y trajo agua. La mujer pidió perdón y todos rieron."
    ],
    questions: [
      { questionDe: "Welche Information ist eine frühere Gewohnheit?", questionEn: "Which information is a former habit?", optionsDe: ["Luis arbeitete jeden Samstag im Café", "Der Hund warf zwei Tassen um", "Die Frau entschuldigte sich"], optionsEn: ["Luis worked at the café every Saturday", "The dog knocked over two cups", "The woman apologized"], correct: 0, explanationDe: "Trabajaba cada sábado kombiniert Imperfekt und Häufigkeitsangabe und kennzeichnet deshalb eine wiederholte frühere Gewohnheit.", explanationEn: "Trabajaba cada sábado combines the imperfect with a frequency phrase, marking a repeated past habit." },
      { questionDe: "Welches Ereignis löste die schnelle Reaktion aus?", questionEn: "Which event triggered the quick reaction?", optionsDe: ["Der Hund warf zwei Tassen um", "Es war sonnig", "Luis war Student"], optionsEn: ["The dog knocked over two cups", "It was sunny", "Luis was a student"], correct: 0, explanationDe: "Tiró dos tazas ist das abgeschlossene Ereignis; danach folgen Luis' Reaktionen fue, recogió und trajo als Ereigniskette.", explanationEn: "Tiró dos tazas is the completed event; Luis's reactions fue, recogió, and trajo then form an event sequence." }
    ],
    recallPromptDe: "Erzähle die Cafégeschichte auf Spanisch in sechs bis acht Sätzen. Markiere mit Imperfekt die frühere Gewohnheit und Kulisse und mit Präteritum die vollständige Ereigniskette.",
    recallPromptEn: "Retell the café story in Spanish in six to eight sentences. Use the imperfect for the former habit and scene, and the preterite for the full event chain.",
    modelSummary: "Luis trabajaba en una cafetería y preparaba café cuando entró una mujer. Su perro tiró unas tazas; Luis fue, las recogió y trajo agua."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const lessons = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (lessons.length !== entries.length) throw new Error(`A2 past-event input requires ${entries.length} lessons, found ${lessons.length}.`);
  for (const [slug, readingJson] of entries) await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 18 : 15 } });
  console.log(`Seeded connected micro-input for ${entries.length} A2 past-event packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
