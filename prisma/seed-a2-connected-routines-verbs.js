const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "a2-daily-routine-overview": {
    title: "Un día sencillo de Marta",
    inputMode: "listening",
    orientationDe: "Höre zuerst nur auf die Tageszeiten. Ordne danach jeder Zeit eine Handlung zu: früh aufwachen, um acht frühstücken, nachmittags lernen und abends lesen.",
    orientationEn: "First listen only for times of day. Then match each time with an action: wake early, eat at eight, study in the afternoon, and read at night.",
    paragraphs: [
      "Marta se despierta temprano todos los días. Desayuna a las ocho y después sale de casa. Por la mañana trabaja en una oficina pequeña.",
      "Por la tarde estudia español durante una hora. Por la noche prepara la cena y lee un libro antes de dormir. Cada parte del día tiene una acción clara."
    ],
    questions: [
      { questionDe: "Wann lernt Marta Spanisch?", questionEn: "When does Marta study Spanish?", optionsDe: ["Am Nachmittag", "Am Morgen", "Um Mitternacht"], optionsEn: ["In the afternoon", "In the morning", "At midnight"], correct: 0, explanationDe: "Por la tarde estudia español verbindet die Handlung estudiar mit der Tageszeit am Nachmittag.", explanationEn: "Por la tarde estudia español links the action estudiar with the afternoon." },
      { questionDe: "Was macht Marta vor dem Schlafen?", questionEn: "What does Marta do before sleeping?", optionsDe: ["Sie liest ein Buch", "Sie geht ins Büro", "Sie frühstückt"], optionsEn: ["She reads a book", "She goes to the office", "She eats breakfast"], correct: 0, explanationDe: "Lee un libro antes de dormir nennt Lesen als letzte Handlung vor dem Schlafen.", explanationEn: "Lee un libro antes de dormir states that reading is the final action before sleep." }
    ],
    recallPromptDe: "Beschreibe Martas Tag auf Spanisch in vier kurzen Sätzen und verwende temprano, a las ocho, por la tarde und por la noche.",
    recallPromptEn: "Describe Marta's day in four short Spanish sentences using temprano, a las ocho, por la tarde, and por la noche.",
    modelSummary: "Marta se despierta temprano, desayuna a las ocho, estudia por la tarde y lee por la noche."
  },
  "a2-reflexive-morning": {
    title: "La mañana de Pablo antes del trabajo",
    orientationDe: "Achte auf me vor den reflexiven Morgenhandlungen. Körperteile stehen dabei mit dem Artikel: me cepillo los dientes, nicht meine Zähne.",
    orientationEn: "Notice me before reflexive morning actions. Body parts use the article: me cepillo los dientes, not my teeth.",
    paragraphs: [
      "Pablo se despierta a las siete y se levanta cinco minutos después. Primero se ducha y luego se cepilla los dientes en el baño.",
      "Después se viste y prepara el desayuno. Antes de salir, mira la hora y toma su mochila. Las acciones reflexivas describen lo que Pablo hace consigo mismo."
    ],
    questions: [
      { questionDe: "Was macht Pablo direkt nach dem Duschen?", questionEn: "What does Pablo do immediately after showering?", optionsDe: ["Er putzt sich die Zähne", "Er verlässt das Haus", "Er schläft wieder"], optionsEn: ["He brushes his teeth", "He leaves the house", "He goes back to sleep"], correct: 0, explanationDe: "Luego se cepilla los dientes folgt unmittelbar auf se ducha und zeigt die Reihenfolge.", explanationEn: "Luego se cepilla los dientes follows se ducha and shows the sequence." },
      { questionDe: "Warum steht se vor viste?", questionEn: "Why does se appear before viste?", optionsDe: ["Pablo zieht sich selbst an", "Vestir ist immer unpersönlich", "Se bedeutet danach"], optionsEn: ["Pablo dresses himself", "Vestir is always impersonal", "Se means afterward"], correct: 0, explanationDe: "Se viste ist reflexiv: Pablo ist sowohl Handelnder als auch die Person, die angezogen wird.", explanationEn: "Se viste is reflexive: Pablo is both the actor and the person being dressed." }
    ],
    recallPromptDe: "Erzähle Pablos Morgen auf Spanisch mit mindestens fünf Handlungen und verwende zuerst, danach und dann für die Reihenfolge.",
    recallPromptEn: "Retell Pablo's morning in Spanish with at least five actions, using first, afterward, and then for sequence.",
    modelSummary: "Pablo se despierta, se levanta, se ducha, se cepilla los dientes y se viste antes de desayunar."
  },
  "a2-frequency-and-time": {
    title: "El horario semanal de Lucía",
    inputMode: "listening",
    orientationDe: "Höre, wann und wie oft etwas geschieht. Tageszeiten beantworten wann; cada día, cada semana und los sábados beschreiben Häufigkeit.",
    orientationEn: "Listen for when and how often actions happen. Times of day answer when; cada día, cada semana, and los sábados express frequency.",
    paragraphs: [
      "Lucía trabaja por la mañana de lunes a viernes. Estudia español por la tarde cada día y cocina la cena por la noche.",
      "Limpia su habitación cada semana, normalmente el sábado. Los domingos no trabaja: desayuna tarde y visita a su familia. Su horario combina momentos del día y repeticiones."
    ],
    questions: [
      { questionDe: "Wie oft putzt Lucía ihr Zimmer?", questionEn: "How often does Lucía clean her room?", optionsDe: ["Jede Woche", "Jeden Morgen", "Nie"], optionsEn: ["Every week", "Every morning", "Never"], correct: 0, explanationDe: "Cada semana markiert eine regelmäßige wöchentliche Wiederholung der Handlung limpiar.", explanationEn: "Cada semana marks regular weekly repetition of limpiar." },
      { questionDe: "Was macht Lucía sonntags nicht?", questionEn: "What does Lucía not do on Sundays?", optionsDe: ["Arbeiten", "Spät frühstücken", "Die Familie besuchen"], optionsEn: ["Work", "Eat breakfast late", "Visit her family"], correct: 0, explanationDe: "Los domingos no trabaja setzt die Sonntagsroutine ausdrücklich von den Werktagen ab.", explanationEn: "Los domingos no trabaja explicitly contrasts Sunday with her weekdays." }
    ],
    recallPromptDe: "Fasse Lucías Woche auf Spanisch zusammen und verwende zwei Tageszeiten sowie cada día, cada semana und los domingos.",
    recallPromptEn: "Summarize Lucía's week in Spanish using two times of day plus cada día, cada semana, and los domingos.",
    modelSummary: "Lucía trabaja por la mañana, estudia cada tarde, cocina por la noche, limpia cada semana y no trabaja los domingos."
  },
  "a2-routine-sequence": {
    title: "De la mañana a la noche con conectores",
    orientationDe: "Lies auf die vier Wegweiser primero, después, luego und por la noche. Sie verwandeln einzelne Routinen in eine kleine zusammenhängende Erzählung.",
    orientationEn: "Read for the four signposts primero, después, luego, and por la noche. They turn separate routines into a small connected account.",
    paragraphs: [
      "Primero Elena se levanta y abre la ventana. Después desayuna con su hija. Luego lleva a la niña a la escuela y va al trabajo en autobús.",
      "Por la tarde vuelve a casa y prepara la cena. Por la noche lee un poco y se acuesta a las once. Los conectores mantienen la secuencia sin repetir muchas veces y."
    ],
    questions: [
      { questionDe: "Was geschieht nach dem Frühstück?", questionEn: "What happens after breakfast?", optionsDe: ["Elena bringt ihre Tochter zur Schule", "Elena geht schlafen", "Elena kocht sofort das Abendessen"], optionsEn: ["Elena takes her daughter to school", "Elena goes to sleep", "Elena immediately cooks dinner"], correct: 0, explanationDe: "Luego lleva a la niña a la escuela nennt den nächsten Schritt nach después desayuna.", explanationEn: "Luego lleva a la niña a la escuela gives the next step after después desayuna." },
      { questionDe: "Welche Handlung beendet den Tag?", questionEn: "Which action ends the day?", optionsDe: ["Sie geht um elf ins Bett", "Sie öffnet das Fenster", "Sie fährt zur Arbeit"], optionsEn: ["She goes to bed at eleven", "She opens the window", "She goes to work"], correct: 0, explanationDe: "Se acuesta a las once ist die letzte Handlung im Abschnitt por la noche.", explanationEn: "Se acuesta a las once is the final action in the por la noche section." }
    ],
    recallPromptDe: "Schreibe Elenas Routine auf Spanisch als kurzen Absatz und beginne vier Schritte mit primero, después, luego und por la noche.",
    recallPromptEn: "Write Elena's routine as a short Spanish paragraph, beginning four steps with primero, después, luego, and por la noche.",
    modelSummary: "Primero Elena se levanta, después desayuna, luego lleva a su hija a la escuela y por la noche lee y se acuesta."
  },
  "checkpoint-a2-daily-routine": {
    title: "Una rutina completa con hora y frecuencia",
    inputMode: "listening",
    orientationDe: "Höre nun auf mehrere Dinge zugleich: reflexive und normale Verben, Uhrzeiten, Tageszeiten, Reihenfolge und eine wöchentliche Gewohnheit.",
    orientationEn: "Now listen for several things together: reflexive and ordinary verbs, clock times, times of day, sequence, and a weekly habit.",
    paragraphs: [
      "Tomás se despierta a las siete y desayuna a las ocho. Después trabaja por la mañana. Por la tarde estudia y vuelve a casa a las seis.",
      "Por la noche lee y se acuesta a las once. Cada sábado limpia su habitación y cocina con un amigo. Su rutina combina hora, secuencia y frecuencia."
    ],
    questions: [
      { questionDe: "Um wie viel Uhr kehrt Tomás nach Hause zurück?", questionEn: "What time does Tomás return home?", optionsDe: ["Um sechs", "Um sieben", "Um elf"], optionsEn: ["At six", "At seven", "At eleven"], correct: 0, explanationDe: "Vuelve a casa a las seis ordnet die Rückkehr eindeutig dem Nachmittag um sechs Uhr zu.", explanationEn: "Vuelve a casa a las seis clearly places his return at six in the afternoon." },
      { questionDe: "Welche Handlung geschieht jede Woche?", questionEn: "Which action happens every week?", optionsDe: ["Samstags das Zimmer putzen", "Jeden Tag mit einem Freund kochen", "Morgens lesen"], optionsEn: ["Clean his room on Saturdays", "Cook with a friend every day", "Read in the morning"], correct: 0, explanationDe: "Cada sábado markiert das Putzen als wöchentlich wiederkehrende Handlung.", explanationEn: "Cada sábado marks cleaning as a weekly repeated action." }
    ],
    recallPromptDe: "Fasse Tomás' Routine auf Spanisch zusammen und nenne zwei Uhrzeiten, zwei Tageszeiten, einen Reihenfolgeausdruck und eine wöchentliche Handlung.",
    recallPromptEn: "Summarize Tomás's routine in Spanish, including two clock times, two times of day, one sequence marker, and one weekly action.",
    modelSummary: "Tomás se despierta a las siete, trabaja por la mañana, estudia por la tarde, lee por la noche y limpia su cuarto cada sábado."
  },
  "a2-irregular-present-overview": {
    title: "Cinco acciones antes de salir de casa",
    inputMode: "listening",
    orientationDe: "Höre die unregelmäßigen yo-Formen als ganze Alltagsbausteine: voy, hago, digo, vengo und salgo. Der restliche Satz hilft beim Abruf.",
    orientationEn: "Hear the irregular yo forms as complete everyday chunks: voy, hago, digo, vengo, and salgo. The rest of each sentence supports retrieval.",
    paragraphs: [
      "Por la mañana hago la tarea y digo la verdad cuando mi madre pregunta. Después salgo de casa a las ocho y voy a la tienda antes del trabajo.",
      "Por la tarde vengo a casa y preparo la cena. Las formas voy, hago, digo, vengo y salgo no siguen el modelo regular, pero aparecen en acciones frecuentes."
    ],
    questions: [
      { questionDe: "Was macht der Sprecher vor der Arbeit?", questionEn: "What does the speaker do before work?", optionsDe: ["Er geht zum Laden", "Er kommt nach Hause", "Er kocht das Abendessen"], optionsEn: ["He goes to the store", "He comes home", "He cooks dinner"], correct: 0, explanationDe: "Voy a la tienda antes del trabajo verbindet die unregelmäßige Form voy mit einer konkreten Station.", explanationEn: "Voy a la tienda antes del trabajo connects irregular voy with a concrete destination." },
      { questionDe: "Welche Form gehört zu salir?", questionEn: "Which form belongs to salir?", optionsDe: ["Salgo", "Salo", "Sale yo"], optionsEn: ["Salgo", "Salo", "Sale yo"], correct: 0, explanationDe: "Salgo ist die häufige unregelmäßige yo-Form und steht hier in salgo de casa.", explanationEn: "Salgo is the frequent irregular yo form, used here in salgo de casa." }
    ],
    recallPromptDe: "Beschreibe den Tag auf Spanisch mit allen fünf Formen voy, hago, digo, vengo und salgo in kurzen vollständigen Sätzen.",
    recallPromptEn: "Describe the day in Spanish using all five forms voy, hago, digo, vengo, and salgo in short complete sentences.",
    modelSummary: "Hago la tarea, digo la verdad, salgo de casa, voy a la tienda y por la tarde vengo a casa."
  },
  "a2-useful-verb-frames": {
    title: "Lo que puedo, quiero y tengo que hacer",
    orientationDe: "Unterscheide fünf Absichten vor dem Infinitiv: Fähigkeit, Wunsch, Notwendigkeit, Verpflichtung und Plan. Das zweite Verb bleibt immer im Infinitiv.",
    orientationEn: "Distinguish five intentions before the infinitive: ability, desire, need, obligation, and plan. The second verb always remains an infinitive.",
    paragraphs: [
      "Hoy puedo estudiar una hora, pero primero tengo que trabajar. También necesito hacer la tarea y quiero ir a la tienda antes de las seis.",
      "Mañana voy a estudiar con Ana. No conjugamos el segundo verbo: puedo estudiar, tengo que trabajar, necesito hacer, quiero ir y voy a estudiar."
    ],
    questions: [
      { questionDe: "Welche Handlung ist eine Verpflichtung?", questionEn: "Which action is an obligation?", optionsDe: ["Arbeiten", "Mit Ana lernen", "Zum Laden gehen wollen"], optionsEn: ["Work", "Study with Ana", "Want to go to the store"], correct: 0, explanationDe: "Tengo que trabajar kennzeichnet arbeiten als Pflicht und nicht nur als Wunsch oder Möglichkeit.", explanationEn: "Tengo que trabajar marks working as an obligation, not merely a wish or possibility." },
      { questionDe: "Warum bleibt estudiar nach puedo unverändert?", questionEn: "Why does estudiar remain unchanged after puedo?", optionsDe: ["Nach dem Rahmen folgt ein Infinitiv", "Estudiar hat kein Präsens", "Beide Verben müssen yo-Endungen tragen"], optionsEn: ["The frame is followed by an infinitive", "Estudiar has no present tense", "Both verbs need first-person endings"], correct: 0, explanationDe: "Puedo trägt Person und Zeit; estudiar benennt als Infinitiv die mögliche Handlung.", explanationEn: "Puedo carries person and tense; estudiar names the possible action as an infinitive." }
    ],
    recallPromptDe: "Formuliere auf Spanisch je einen Satz zu etwas, das du kannst, willst, brauchst, tun musst und morgen tun wirst.",
    recallPromptEn: "Write one Spanish sentence each about something you can do, want to do, need to do, have to do, and are going to do tomorrow.",
    modelSummary: "Puedo estudiar, quiero ir a la tienda, necesito hacer la tarea, tengo que trabajar y mañana voy a estudiar."
  },
  "a2-more-irregular-actions": {
    title: "Una bolsa, un letrero y una respuesta",
    inputMode: "listening",
    orientationDe: "Verbinde jede unregelmäßige Form mit ihrem Objekt oder ihrer Informationsart: pongo, traigo, veo, oigo, sé und conozco.",
    orientationEn: "Connect each irregular form with its object or type of information: pongo, traigo, veo, oigo, sé, and conozco.",
    paragraphs: [
      "Entro en la sala y pongo el libro en la mesa. Traigo una bolsa con comida. Veo un letrero en la puerta y oigo música en la habitación.",
      "Sé la respuesta a una pregunta y conozco a Ana, la profesora. Sé se usa para un dato; conozco para una persona. Cada verbo aparece en una escena visible."
    ],
    questions: [
      { questionDe: "Wo legt der Sprecher das Buch hin?", questionEn: "Where does the speaker put the book?", optionsDe: ["Auf den Tisch", "In die Tasche", "Vor die Tür"], optionsEn: ["On the table", "In the bag", "In front of the door"], correct: 0, explanationDe: "Pongo el libro en la mesa verbindet pongo mit Buch und Tisch in einer sichtbaren Handlung.", explanationEn: "Pongo el libro en la mesa connects pongo with the book and table in a visible action." },
      { questionDe: "Warum heißt es conozco a Ana, aber sé la respuesta?", questionEn: "Why is it conozco a Ana but sé la respuesta?", optionsDe: ["Conocer gilt für Personen, saber für Fakten", "Beide Formen sind austauschbar", "Sé bezeichnet immer Musik"], optionsEn: ["Conocer is for people, saber for facts", "Both forms are interchangeable", "Sé always refers to music"], correct: 0, explanationDe: "Ana ist eine bekannte Person; la respuesta ist gewusste Information. Deshalb werden zwei verschiedene Verben gebraucht.", explanationEn: "Ana is a known person; la respuesta is known information. This requires two different verbs." }
    ],
    recallPromptDe: "Beschreibe die Szene auf Spanisch mit mindestens fünf der Formen pongo, traigo, veo, oigo, sé und conozco.",
    recallPromptEn: "Describe the scene in Spanish using at least five of pongo, traigo, veo, oigo, sé, and conozco.",
    modelSummary: "Pongo el libro en la mesa, traigo una bolsa, veo un letrero, oigo música, sé la respuesta y conozco a Ana."
  },
  "a2-plans-obligations": {
    title: "Un plan que cambia por una obligación",
    orientationDe: "Lies den Gegensatz zwischen Wunsch und Pflicht. Danach suche den neuen Plan und die verbleibende Möglichkeit für den Abend.",
    orientationEn: "Read the contrast between desire and obligation. Then find the new plan and the possibility that remains for the evening.",
    paragraphs: [
      "Quiero ir a la tienda esta tarde, pero tengo que trabajar hasta las seis. No puedo ir antes. Por eso voy a traer una bolsa mañana.",
      "Esta noche puedo estudiar una hora en casa. El deseo no desaparece, pero la obligación cambia el momento del plan. Pero y por eso conectan la decisión."
    ],
    questions: [
      { questionDe: "Warum geht die Person heute nicht zum Laden?", questionEn: "Why does the person not go to the store today?", optionsDe: ["Sie muss bis sechs arbeiten", "Sie hat keine Tasche", "Der Laden ist unbekannt"], optionsEn: ["They have to work until six", "They have no bag", "The store is unknown"], correct: 0, explanationDe: "Tengo que trabajar hasta las seis steht als Verpflichtung dem Wunsch quiero ir entgegen.", explanationEn: "Tengo que trabajar hasta las seis is the obligation that conflicts with quiero ir." },
      { questionDe: "Welcher neue Plan entsteht?", questionEn: "What new plan is formed?", optionsDe: ["Morgen eine Tasche mitbringen", "Heute Morgen einkaufen", "Nicht mehr lernen"], optionsEn: ["Bring a bag tomorrow", "Shop this morning", "Stop studying"], correct: 0, explanationDe: "Voy a traer una bolsa mañana verschiebt die geplante Handlung auf den nächsten Tag.", explanationEn: "Voy a traer una bolsa mañana moves the planned action to the next day." }
    ],
    recallPromptDe: "Fasse den Konflikt auf Spanisch mit quiero, pero tengo que, no puedo, por eso voy a und einer verbleibenden Möglichkeit zusammen.",
    recallPromptEn: "Summarize the conflict in Spanish using quiero, pero tengo que, no puedo, por eso voy a, and one remaining possibility.",
    modelSummary: "Quiero ir a la tienda, pero tengo que trabajar. No puedo ir hoy, por eso voy a traer una bolsa mañana y puedo estudiar esta noche."
  },
  "checkpoint-a2-verb-frames": {
    title: "Hoy y mañana con verbos útiles",
    inputMode: "listening",
    orientationDe: "Höre sowohl einzelne unregelmäßige yo-Formen als auch Verbrahmen mit Infinitiv. Entscheide jeweils: aktuelle Handlung, Fähigkeit, Pflicht oder Plan.",
    orientationEn: "Listen for both irregular first-person forms and verb frames with an infinitive. Decide whether each expresses a current action, ability, obligation, or plan.",
    paragraphs: [
      "Salgo de casa a las ocho y vengo a la oficina en autobús. Allí hago la tarea y pongo los documentos en una mesa. También veo a Ana.",
      "Hoy tengo que trabajar, pero puedo abrir la puerta para un compañero. Mañana voy a traer una bolsa y quiero ir a la tienda después del trabajo."
    ],
    questions: [
      { questionDe: "Was plant der Sprecher für morgen?", questionEn: "What does the speaker plan for tomorrow?", optionsDe: ["Eine Tasche mitbringen", "Die Tür gestern öffnen", "Um acht nach Hause kommen"], optionsEn: ["Bring a bag", "Open the door yesterday", "Come home at eight"], correct: 0, explanationDe: "Mañana voy a traer una bolsa verbindet die Zukunftsangabe mit voy a plus Infinitiv.", explanationEn: "Mañana voy a traer una bolsa combines the future time word with voy a plus infinitive." },
      { questionDe: "Welche Form beschreibt eine Fähigkeit?", questionEn: "Which form expresses ability?", optionsDe: ["Puedo abrir", "Tengo que trabajar", "Salgo de casa"], optionsEn: ["Puedo abrir", "Tengo que trabajar", "Salgo de casa"], correct: 0, explanationDe: "Puedo abrir sagt, dass das Öffnen möglich ist; tengo que beschreibt dagegen eine Pflicht.", explanationEn: "Puedo abrir says opening is possible; tengo que instead expresses an obligation." }
    ],
    recallPromptDe: "Beschreibe den Ablauf auf Spanisch mit drei unregelmäßigen yo-Formen und je einem Rahmen für Fähigkeit, Verpflichtung, Wunsch und Plan.",
    recallPromptEn: "Describe the sequence in Spanish with three irregular first-person forms and one frame each for ability, obligation, desire, and plan.",
    modelSummary: "Salgo de casa, vengo a la oficina, hago la tarea y pongo documentos. Puedo ayudar, tengo que trabajar y mañana voy a traer una bolsa."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const lessons = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (lessons.length !== entries.length) throw new Error(`A2 routine/verb input requires ${entries.length} lessons, found ${lessons.length}.`);
  for (const [slug, readingJson] of entries) await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 18 : 15 } });
  console.log(`Seeded connected micro-input for ${entries.length} A2 routine and verb-frame packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
