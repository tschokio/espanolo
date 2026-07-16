const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b2-listening-voicemail", title: "Understand a Detailed Voicemail", order: 1740, imageKey: "travel-and-survival:12",
    summary: "Extract the purpose, changed plan, time, place, and requested response from a natural message.", situation: "responding correctly to a changed arrangement",
    readingJson: {
      inputMode: "listening", title: "Un cambio de última hora",
      orientationDe: "Höre zuerst: Warum ruft Clara an? Beim zweiten Hören notiere gedanklich neue Uhrzeit, neuen Ort und gewünschte Reaktion.", orientationEn: "First listen for why Clara is calling. On the second listen, track the new time, place, and requested response.",
      paragraphs: ["Hola, soy Clara. Te llamo porque han cambiado la hora de la reunión de mañana. En vez de empezar a las nueve, comenzará a las diez y media.", "Además, no será en la oficina principal, sino en la sala pequeña del segundo piso. Por favor, confírmame esta tarde que has recibido el mensaje, porque tengo que enviar la lista definitiva antes de las seis."],
      questions: [
        { questionDe: "Was hat sich geändert?", questionEn: "What changed?", optionsDe: ["Uhrzeit und Raum der Besprechung", "Nur der Wochentag", "Der Name der Anruferin"], optionsEn: ["The meeting time and room", "Only the day of the week", "The caller's name"], correct: 0, explanationDe: "Die Besprechung beginnt um 10:30 Uhr und findet im kleinen Raum im zweiten Stock statt.", explanationEn: "The meeting begins at 10:30 and takes place in the small second-floor room." },
        { questionDe: "Was soll der Empfänger tun?", questionEn: "What should the recipient do?", optionsDe: ["Den Erhalt noch am Nachmittag bestätigen", "Vor neun Uhr zur Hauptstelle gehen", "Die Teilnehmerliste selbst schicken"], optionsEn: ["Confirm receipt that afternoon", "Go to the main office before nine", "Send the participant list personally"], correct: 0, explanationDe: "Clara braucht die Bestätigung vor ihrer endgültigen Liste um sechs.", explanationEn: "Clara needs confirmation before her final list at six." }
      ],
      recallPromptDe: "Antworte Clara auf Spanisch und bestätige neue Uhrzeit und neuen Raum.", recallPromptEn: "Reply to Clara in Spanish and confirm the new time and room.",
      modelSummary: "Gracias por avisarme. Confirmo que la reunión será mañana a las diez y media en la sala pequeña del segundo piso."
    },
    sentences: [
      ["Han cambiado la hora de la reunión de mañana.", "They have changed the time of tomorrow's meeting.", "The opening gives the purpose of the call."],
      ["En vez de empezar a las nueve, comenzará a las diez y media.", "Instead of starting at nine, it will begin at ten thirty.", "The contrast marks old and new information."],
      ["La reunión será en la sala pequeña del segundo piso.", "The meeting will be in the small room on the second floor.", "This is the new location."],
      ["Confírmame esta tarde que has recibido el mensaje.", "Confirm this afternoon that you have received the message.", "The speaker requests a response within a time frame."],
      ["Tengo que enviar la lista antes de las seis.", "I have to send the list before six.", "The deadline explains the request."]
    ]
  },
  {
    slug: "b2-listening-announcement", title: "Follow a Public Announcement", order: 1750, imageKey: "city-transport:14",
    summary: "Identify an interruption, alternative route, duration, and exception in a public announcement.", situation: "adapting travel plans after hearing an announcement",
    readingJson: {
      inputMode: "listening", title: "Aviso para los viajeros",
      orientationDe: "Achte auf vier Informationen: betroffene Linie, Grund, Ersatz und Dauer.", orientationEn: "Track four details: affected line, reason, replacement, and duration.",
      paragraphs: ["Atención, viajeros. Debido a unas obras urgentes, la línea tres no circulará entre las estaciones Central y Norte durante este fin de semana.", "Habrá autobuses gratuitos cada quince minutos desde la salida principal de ambas estaciones. El servicio normal se reanudará el lunes a las cinco de la mañana. Los trenes hacia el aeropuerto no se verán afectados."],
      questions: [
        { questionDe: "Welche Alternative wird angeboten?", questionEn: "What alternative is provided?", optionsDe: ["Kostenlose Busse alle fünfzehn Minuten", "Taxis nur am Montag", "Eine andere Bahn zum Flughafen"], optionsEn: ["Free buses every fifteen minutes", "Taxis only on Monday", "A different airport train"], correct: 0, explanationDe: "Die Busse fahren von den Hauptausgängen beider Stationen.", explanationEn: "The buses leave from the main exits of both stations." },
        { questionDe: "Welche Verbindung bleibt normal?", questionEn: "Which service remains normal?", optionsDe: ["Die Züge zum Flughafen", "Linie drei zwischen Central und Norte", "Alle Wochenendzüge"], optionsEn: ["The airport trains", "Line three between Central and Norte", "All weekend trains"], correct: 0, explanationDe: "Die letzte Aussage nennt die Flughafenverbindung ausdrücklich als nicht betroffen.", explanationEn: "The final statement explicitly says airport trains are unaffected." }
      ],
      recallPromptDe: "Erkläre einem Mitreisenden auf Spanisch Störung und Ersatzverbindung.", recallPromptEn: "Explain the disruption and replacement service to another traveler in Spanish.",
      modelSummary: "La línea tres estará interrumpida entre Central y Norte durante el fin de semana, pero habrá autobuses gratuitos cada quince minutos."
    },
    sentences: [
      ["La línea tres no circulará durante el fin de semana.", "Line three will not run during the weekend.", "This is the main interruption."],
      ["La causa son unas obras urgentes.", "The cause is urgent construction work.", "The announcement explains the reason."],
      ["Habrá autobuses gratuitos cada quince minutos.", "There will be free buses every fifteen minutes.", "This is the replacement service."],
      ["El servicio normal se reanudará el lunes.", "Normal service will resume on Monday.", "The future marks the end of the interruption."],
      ["Los trenes hacia el aeropuerto no se verán afectados.", "Trains to the airport will not be affected.", "The final detail gives an exception."]
    ]
  },
  {
    slug: "b2-listening-interview", title: "Compare Viewpoints in an Interview", order: 1760, imageKey: "conversation-and-opinion:15",
    summary: "Attribute opinions to the correct speaker and identify the shared conclusion.", situation: "following a short interview with qualified agreement",
    readingJson: {
      inputMode: "listening", title: "Aprender en grupo o a solas",
      orientationDe: "Ordne jeder Person ihre Sichtweise zu und höre danach auf den Punkt, in dem beide übereinstimmen.", orientationEn: "Assign each viewpoint to the correct person, then listen for what both agree on.",
      paragraphs: ["Entrevistadora: ¿Es mejor estudiar en grupo? Lucía: Para mí, hablar con otros ayuda a descubrir errores que sola no veo. Sin embargo, necesito preparar el tema antes para no perderme.", "Diego: Yo me concentro mejor a solas, sobre todo cuando leo algo difícil. Aun así, reunirme después con mis compañeros me obliga a explicar lo aprendido. Los dos coincidimos en que combinar ambas formas suele ser lo más útil."],
      questions: [
        { questionDe: "Warum schätzt Lucía die Gruppe?", questionEn: "Why does Lucía value group study?", optionsDe: ["Andere helfen ihr, unbemerkte Fehler zu finden", "Sie muss sich nie vorbereiten", "Schwierige Texte verschwinden"], optionsEn: ["Others help her find unnoticed mistakes", "She never has to prepare", "Difficult texts disappear"], correct: 0, explanationDe: "Lucía nennt das Entdecken eigener Fehler als Vorteil.", explanationEn: "Lucía names discovering her own errors as the benefit." },
        { questionDe: "Worin stimmen beide überein?", questionEn: "What do both speakers agree on?", optionsDe: ["Eine Kombination aus Einzel- und Gruppenarbeit ist sinnvoll", "Nur Gruppenarbeit funktioniert", "Vorbereitung ist unnötig"], optionsEn: ["Combining individual and group work is useful", "Only group work works", "Preparation is unnecessary"], correct: 0, explanationDe: "Die letzte Aussage formuliert ausdrücklich ihre gemeinsame Schlussfolgerung.", explanationEn: "The final statement explicitly gives their shared conclusion." }
      ],
      recallPromptDe: "Fasse auf Spanisch beide Positionen und den gemeinsamen Schluss zusammen.", recallPromptEn: "Summarize both positions and the shared conclusion in Spanish.",
      modelSummary: "Lucía aprende de los errores en grupo y Diego se concentra mejor solo, pero ambos prefieren combinar las dos formas."
    },
    sentences: [
      ["Hablar con otros ayuda a descubrir errores.", "Talking with others helps reveal mistakes.", "This is Lucía's supporting reason."],
      ["Lucía necesita preparar el tema antes.", "Lucía needs to prepare the topic beforehand.", "She qualifies the benefit with a condition."],
      ["Diego se concentra mejor a solas.", "Diego concentrates better alone.", "This is Diego's preference."],
      ["Explicar lo aprendido le ayuda a comprobarlo.", "Explaining what he learned helps him check it.", "Group explanation still has value for Diego."],
      ["Ambos prefieren combinar las dos formas.", "Both prefer combining the two approaches.", "This is the shared conclusion."]
    ]
  },
  {
    slug: "b2-listening-narrative-sequence", title: "Reconstruct a Spoken Event Sequence", order: 1770, imageKey: "past-events:13",
    summary: "Use time markers and tense relationships to reconstruct a spoken narrative and its turning point.", situation: "understanding why an ordinary plan changed unexpectedly",
    readingJson: {
      inputMode: "listening", title: "Una cartera perdida",
      orientationDe: "Höre auf Reihenfolge und Wendepunkt: ursprünglicher Plan, Entdeckung, bereits geschehene Handlung und Lösung.", orientationEn: "Listen for sequence and turning point: original plan, discovery, earlier action, and solution.",
      paragraphs: ["Ayer iba al cine cuando me di cuenta de que no tenía la cartera. Volví rápidamente al café donde había estado media hora antes, pero la mesa ya estaba vacía.", "Mientras preguntaba al camarero, recibí una llamada. Una mujer había encontrado la cartera junto a la puerta y había usado una tarjeta que llevaba mi número. Al final llegué tarde al cine, pero recuperé todo."],
      questions: [
        { questionDe: "Wie konnte die Finderin anrufen?", questionEn: "How was the finder able to call?", optionsDe: ["Eine Karte in der Brieftasche trug die Nummer", "Der Kellner kannte die Adresse", "Das Kino schickte die Nummer"], optionsEn: ["A card in the wallet had the number", "The waiter knew the address", "The cinema sent the number"], correct: 0, explanationDe: "Der Hörtext nennt die Karte mit der Telefonnummer als direkte Erklärung.", explanationEn: "The listening text directly identifies a card carrying the phone number." },
        { questionDe: "Was war das Endergebnis?", questionEn: "What was the final outcome?", optionsDe: ["Die Brieftasche kam vollständig zurück, aber die Person verspätete sich", "Die Brieftasche blieb im Café", "Der Kinobesuch fand früher statt"], optionsEn: ["The wallet was fully recovered, but the person arrived late", "The wallet stayed in the café", "The cinema visit happened earlier"], correct: 0, explanationDe: "Der letzte Satz verbindet positive Lösung und negative Nebenfolge.", explanationEn: "The final sentence combines the positive solution with a negative side effect." }
      ],
      recallPromptDe: "Erzähle auf Spanisch in zwei Sätzen Wendepunkt und Lösung.", recallPromptEn: "Retell the turning point and solution in two Spanish sentences.",
      modelSummary: "Al volver al café, la cartera ya no estaba, pero una mujer la había encontrado y llamó gracias a una tarjeta con el número."
    },
    sentences: [
      ["Iba al cine cuando noté que no tenía la cartera.", "I was going to the cinema when I noticed I did not have my wallet.", "The imperfect background meets the turning event."],
      ["Volví al café donde había estado antes.", "I returned to the café where I had been earlier.", "The earlier visit explains the search location."],
      ["Una mujer había encontrado la cartera.", "A woman had found the wallet.", "The finding occurred before the phone call."],
      ["Llevaba una tarjeta con mi número.", "It contained a card with my number.", "The card explains how contact became possible."],
      ["Llegué tarde, pero recuperé todo.", "I arrived late, but I recovered everything.", "The ending contrasts cost and successful resolution."]
    ]
  },
  {
    slug: "b2-listening-instructions", title: "Follow Multi-Step Spoken Instructions", order: 1780, imageKey: "classroom-basics:12",
    summary: "Retain ordered steps, a condition, and a warning from spoken instructions.", situation: "completing a procedure correctly after listening",
    readingJson: {
      inputMode: "listening", title: "Cómo entregar el proyecto",
      orientationDe: "Merke dir drei Schritte in Reihenfolge und die eine Warnung, die einen Fehler verhindert.", orientationEn: "Remember three ordered steps and the warning that prevents an error.",
      paragraphs: ["Primero, guarda el documento con tu nombre y el número del grupo. Después, súbelo a la carpeta llamada Proyectos finales y comprueba que aparece la fecha correcta.", "Si el archivo ocupa más de diez megabytes, tendrás que comprimirlo antes. No lo envíes por correo, porque de ese modo no quedará registrado en la plataforma. Por último, conserva el mensaje de confirmación."],
      questions: [
        { questionDe: "Was geschieht direkt nach dem Hochladen?", questionEn: "What happens directly after uploading?", optionsDe: ["Das korrekte Datum wird geprüft", "Die Datei wird per E-Mail gesendet", "Der Bestätigungstext wird gelöscht"], optionsEn: ["The correct date is checked", "The file is sent by email", "The confirmation message is deleted"], correct: 0, explanationDe: "Die Anweisung nennt Hochladen und Datum prüfen unmittelbar nacheinander.", explanationEn: "The instruction places uploading and checking the date directly together." },
        { questionDe: "Warum soll die Datei nicht per E-Mail geschickt werden?", questionEn: "Why should the file not be emailed?", optionsDe: ["Dann wird die Abgabe nicht auf der Plattform registriert", "E-Mails können keine Dateien enthalten", "Die Datei ist immer zu groß"], optionsEn: ["Then the submission is not recorded on the platform", "Emails cannot contain files", "The file is always too large"], correct: 0, explanationDe: "Die Warnung nennt den fehlenden Plattformnachweis als Folge.", explanationEn: "The warning gives lack of platform registration as the consequence." }
      ],
      recallPromptDe: "Gib die drei wichtigsten Schritte auf Spanisch mit primero, después und por último wieder.", recallPromptEn: "Restate the three main steps in Spanish using primero, después, and por último.",
      modelSummary: "Primero guarda el archivo con los datos correctos, después súbelo y comprueba la fecha y, por último, conserva la confirmación."
    },
    sentences: [
      ["Guarda el documento con tu nombre y el número del grupo.", "Save the document with your name and group number.", "This is the first required step."],
      ["Súbelo a la carpeta de proyectos finales.", "Upload it to the final projects folder.", "The attached pronoun refers to the document."],
      ["Comprueba que aparece la fecha correcta.", "Check that the correct date appears.", "This verification follows uploading."],
      ["Si ocupa demasiado, comprímelo antes.", "If it is too large, compress it first.", "The conditional step applies only to large files."],
      ["Conserva el mensaje de confirmación.", "Keep the confirmation message.", "The final step preserves proof of submission."]
    ]
  },
  {
    slug: "checkpoint-b2-listening-comprehension", title: "B2.8 Connected Listening Checkpoint", order: 1790, imageKey: "rewards-and-progress:8",
    summary: "Check gist, changed details, viewpoints, event order, conditions, and spoken inference across a connected announcement.", situation: "understanding and relaying a detailed community update", checkpoint: true,
    readingJson: {
      inputMode: "listening", title: "Cambio en las actividades del centro",
      orientationDe: "Höre auf Anlass, verschobene Aktivität, unveränderte Aktivität, Ersatzangebot und notwendige Anmeldung.", orientationEn: "Listen for the reason, postponed activity, unchanged activity, replacement offer, and required registration.",
      paragraphs: ["Debido a la lluvia prevista para el sábado, la visita guiada al parque se aplazará hasta el domingo siguiente. El taller de fotografía, en cambio, se celebrará a la hora habitual porque tendrá lugar dentro del centro.", "Quienes ya se habían inscrito en la visita pueden mantener su plaza o cambiarla por una charla sobre naturaleza que se ofrecerá este sábado a las once. Para elegir la charla, es necesario responder al mensaje antes del viernes al mediodía."],
      questions: [
        { questionDe: "Welche Aktivität bleibt unverändert?", questionEn: "Which activity remains unchanged?", optionsDe: ["Der Fotoworkshop", "Die Parkführung", "Der Naturvortrag am Sonntag"], optionsEn: ["The photography workshop", "The park tour", "The nature talk on Sunday"], correct: 0, explanationDe: "Der Workshop findet drinnen und deshalb zur üblichen Zeit statt.", explanationEn: "The workshop is indoors and therefore remains at its usual time." },
        { questionDe: "Was ist für den Wechsel zum Vortrag nötig?", questionEn: "What is required to switch to the talk?", optionsDe: ["Vor Freitagmittag auf die Nachricht antworten", "Am Sonntag unangemeldet kommen", "Die Parkführung absagen und nichts mitteilen"], optionsEn: ["Reply to the message before Friday noon", "Arrive unregistered on Sunday", "Cancel the park tour without notifying anyone"], correct: 0, explanationDe: "Der letzte Satz nennt Reaktion und Frist ausdrücklich.", explanationEn: "The final sentence explicitly states the response and deadline." }
      ],
      recallPromptDe: "Erkläre einer angemeldeten Person auf Spanisch die Änderungen und ihre beiden Möglichkeiten.", recallPromptEn: "Explain the changes and two options in Spanish to someone already registered.",
      modelSummary: "La visita al parque se aplaza por la lluvia, pero los inscritos pueden conservar su plaza o elegir la charla del sábado si responden antes del viernes."
    },
    sentences: [
      ["La visita al parque se aplazará debido a la lluvia.", "The park tour will be postponed because of the rain.", "This is the main change and its cause."],
      ["El taller de fotografía mantendrá su horario.", "The photography workshop will keep its schedule.", "The indoor activity is unaffected."],
      ["Los inscritos pueden conservar su plaza.", "Registered participants may keep their place.", "This is the first option."],
      ["También pueden elegir una charla sobre naturaleza.", "They may also choose a nature talk.", "This is the alternative option."],
      ["Deben responder antes del viernes al mediodía.", "They must respond before Friday at noon.", "The deadline applies to choosing the alternative."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`]; };
function checks(input) { return [
  { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
  { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
  { key: "dictate", type: ExerciseType.LISTENING_DICTATION, question: "Write the key sentence you hear.", correct: input.sentences[2][0], audioText: input.sentences[2][0] },
  { key: "produce", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
]; }

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords ? { correctWords: check.correctWords, goal: "b2_listening_reconstruction" } : { correct: check.correct, accepted: accepted(check.correct), audioText: check.audioText, goal: "b2_listening_comprehension", rubric: "Recover the key meaning, sequence, and detail from connected spoken input." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Recover meaning from connected speech", instruction: "Listen for gist first, then time, contrast, condition, and requested action.", questionText: check.question, answerJson, explanation: "Connected listening becomes manageable when gist and discourse signals are identified before every word.", difficulty: 5, order, xpReward: 18, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "b2-listening-comprehension" }, update: { title: "Connected Listening Comprehension", description: "Gist, changed details, public announcements, viewpoints, event sequence, conditions, and spoken instructions.", cefrLevel: "B2", imageKey: "travel-and-survival:12" }, create: { slug: "b2-listening-comprehension", title: "Connected Listening Comprehension", description: "Gist, changed details, public announcements, viewpoints, event sequence, conditions, and spoken instructions.", cefrLevel: "B2", imageKey: "travel-and-survival:12" } });
  const groupSlugs = ["a2-reading-listening-lab", "a2-scenario-survival", "useful-phrases", "weather-and-time", "b2-discourse-reporting", "b2-complex-structures"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B2.8 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B2", theme: input.checkpoint ? "Checkpoint" : "Connected Listening", situation: input.situation, imageKey: input.imageKey, readingJson: input.readingJson, outcomesJson: ["You can identify gist and changed details in connected speech.", "You can follow viewpoints, event order, conditions, and instructions.", "You can relay spoken information accurately in Spanish."], conceptKeys: ["b2", "listening", "gist", "details", "spoken-input"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 20 : 16, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B2.8 connected-listening learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
