const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c1-listening-structure-focus", title: "Hear Structure before Detail", order: 2100, imageKey: "reading-and-listening-lab:14",
    summary: "Follow a dense spoken explanation by locating its frame, correction, decisive contrast, and final point before retaining details.", situation: "extracting the real conclusion from a compact expert explanation",
    transcript: ["A primera vista, la caída de las ventas parece deberse al aumento de precios. Ahora bien, si observamos los datos por regiones, esa explicación resulta insuficiente: donde más subieron los precios, las ventas apenas cambiaron.", "Lo decisivo, por tanto, no fue el precio por sí solo, sino la combinación de retrasos en la distribución y menor disponibilidad. Dicho de otro modo, el problema principal estuvo en el acceso al producto, no en la demanda."],
    questions: [["Was ist die zunächst naheliegende Erklärung?", "Der Preisanstieg.", "Eine höhere Produktverfügbarkeit.", "Ein Anstieg der Nachfrage."], ["Welche Schlussfolgerung vertritt der Sprecher schließlich?", "Verteilung und Verfügbarkeit waren entscheidender als der Preis allein.", "Die regionalen Daten bestätigen ausschließlich den Preiseffekt.", "Die Nachfrage war überall vollständig verschwunden."]],
    modelSummary: "Aunque al principio parece que los precios explican la caída, los datos regionales indican que el problema principal fue la falta de acceso causada por retrasos y menor disponibilidad.",
    sentences: [
      ["A primera vista, el precio parece explicar la caída.", "At first glance, the price appears to explain the decline.", "The opening marks a provisional interpretation rather than the conclusion."],
      ["Ahora bien, los datos regionales no confirman esa explicación.", "However, the regional data do not confirm that explanation.", "Ahora bien announces a decisive restriction or correction."],
      ["Lo decisivo fue la combinación de retrasos y menor disponibilidad.", "The decisive factor was the combination of delays and lower availability.", "Focus language identifies the information that must be retained."],
      ["Dicho de otro modo, el problema estuvo en el acceso.", "Put another way, the problem lay in access.", "The reformulation restates the conclusion in a more retrievable form."],
      ["La demanda no fue la causa principal.", "Demand was not the main cause.", "The final contrast blocks the tempting initial interpretation."]
    ]
  },
  {
    slug: "c1-listening-self-correction", title: "Track Spoken Correction", order: 2110, imageKey: "conversation-and-opinion:14",
    summary: "Notice hesitation, replacement, and narrowed wording so that an abandoned formulation is not mistaken for the final message.", situation: "following a speaker who revises a plan while talking",
    transcript: ["La sesión será el martes por la mañana… perdón, el martes no, porque coincide con la visita externa. Quería decir el miércoles, aunque tampoco toda la mañana: empezaremos a las diez y terminaremos antes de las doce.", "Bueno, en realidad conviene que reservemos la sala hasta las doce y media por si se alarga el debate. Así que, para que quede claro: miércoles a las diez; la sesión debería terminar antes de las doce, pero la sala estará disponible media hora más."],
    questions: [["Wann beginnt die Sitzung nach allen Korrekturen?", "Am Mittwoch um zehn Uhr.", "Am Dienstagmorgen.", "Am Mittwoch um halb eins."], ["Warum bleibt der Raum bis 12:30 Uhr reserviert?", "Als Zeitpuffer für eine mögliche längere Diskussion.", "Weil die Sitzung sicher erst um zwölf beginnt.", "Wegen des externen Besuchs am Mittwoch."]],
    modelSummary: "La sesión se corrige del martes al miércoles a las diez; debería acabar antes de las doce, pero la sala se reserva hasta las doce y media como margen.",
    sentences: [
      ["La sesión será el martes… perdón, el miércoles.", "The session will be on Tuesday… sorry, on Wednesday.", "The repair marker cancels the first day and replaces it with the second."],
      ["Quería decir que empezaremos a las diez.", "I meant that we will start at ten.", "The explicit correction identifies the speaker's intended formulation."],
      ["Bueno, en realidad reservaremos la sala hasta las doce y media.", "Well, actually, we will reserve the room until twelve thirty.", "En realidad revises the preceding time frame without changing the scheduled start."],
      ["La sesión debería terminar antes de las doce.", "The session should end before twelve.", "Debería marks the expected endpoint rather than the room-booking limit."],
      ["La media hora adicional será solo un margen.", "The additional half hour will only be a buffer.", "The final statement prevents a precaution from being heard as the planned duration."]
    ]
  },
  {
    slug: "c1-listening-implicit-purpose", title: "Infer the Required Response", order: 2120, imageKey: "conversation-and-opinion:10",
    summary: "Infer what a speaker wants the listener to do when the request is distributed across context, concern, and a closing question.", situation: "responding appropriately to an indirect but urgent voice message",
    transcript: ["Hola, Elena. He visto que el documento sigue marcado como borrador y mañana a primera hora lo revisa la dirección. Imagino que quizá te faltaba confirmar la última cifra; por eso no he querido cambiar el estado yo mismo.", "Yo estaré fuera esta tarde y no podré conectarme después de las cinco. ¿Crees que podrías comprobar la cifra y dejar la versión definitiva preparada antes de esa hora? Si encuentras algún problema, llámame; si no, basta con que me escribas cuando esté listo."],
    questions: [["Was soll Elena hauptsächlich tun?", "Die letzte Zahl prüfen und die Endfassung vor fünf Uhr vorbereiten.", "Den Entwurf morgen früh erstmals lesen.", "Die Leitung nach fünf Uhr anrufen."], ["Welche Rückmeldung reicht, wenn kein Problem auftritt?", "Eine kurze Nachricht, sobald das Dokument fertig ist.", "Ein ausführlicher Anruf bei der Leitung.", "Keine Rückmeldung bis zum nächsten Morgen."]],
    modelSummary: "Elena debe comprobar la última cifra, preparar la versión definitiva antes de las cinco y avisar por escrito cuando esté lista, salvo que surja un problema.",
    sentences: [
      ["El documento sigue marcado como borrador.", "The document is still marked as a draft.", "The observed state establishes the problem without yet stating the requested action."],
      ["Mañana a primera hora lo revisa la dirección.", "Management will review it first thing tomorrow.", "The deadline context creates urgency."],
      ["¿Podrías comprobar la última cifra antes de las cinco?", "Could you check the last figure before five?", "The polite question carries the central request and its deadline."],
      ["Si encuentras algún problema, llámame.", "If you find a problem, call me.", "This branch specifies the response only for an exceptional case."],
      ["Si todo está bien, basta con que me escribas.", "If everything is fine, you only need to write to me.", "The closing branch defines the normal confirmation channel."]
    ]
  },
  {
    slug: "c1-listening-viewpoint-shifts", title: "Attribute Shifting Viewpoints", order: 2130, imageKey: "conversation-and-opinion:15",
    summary: "Keep claims attached to their speakers while identifying partial agreement, qualification, and the moderator's synthesis.", situation: "following a compact round-table exchange without merging viewpoints",
    transcript: ["Moderadora: ¿Debería ampliarse el programa? Nora: Los primeros resultados son positivos y, desde mi punto de vista, justifican una ampliación gradual. Luis: Coincido en que los resultados son prometedores, pero todavía no sabemos si se mantendrán fuera de los centros piloto.", "Nora: De acuerdo, no propongo extenderlo de golpe, sino probarlo en contextos distintos. Luis: En ese caso sí; mi objeción se refiere a una aplicación general inmediata. Moderadora: Entonces ambos apoyan nuevas pruebas, aunque Luis exige más evidencia antes de una implantación completa."],
    questions: [["Worin stimmen Nora und Luis am Ende überein?", "Das Programm soll in weiteren Kontexten erprobt werden.", "Es soll sofort überall eingeführt werden.", "Die ersten Ergebnisse sind eindeutig negativ."], ["Wogegen richtet sich Luis' Einwand?", "Gegen eine sofortige allgemeine Einführung ohne weitere Belege.", "Gegen jede zusätzliche Erprobung.", "Gegen die Ergebnisse der Pilotzentren selbst."]],
    modelSummary: "Nora propone ampliar las pruebas de forma gradual y Luis acepta esa opción; su desacuerdo se limita a una implantación general antes de obtener más evidencia.",
    sentences: [
      ["Nora considera que los resultados justifican una ampliación gradual.", "Nora believes that the results justify a gradual expansion.", "The attribution keeps the recommendation attached to Nora."],
      ["Luis coincide en que los resultados son prometedores.", "Luis agrees that the results are promising.", "Coincide marks shared ground before the objection."],
      ["Todavía no sabemos si el efecto se mantendrá fuera de los centros piloto.", "We still do not know whether the effect will persist outside the pilot centers.", "This is the evidential limitation behind Luis's position."],
      ["La objeción se refiere a una aplicación general inmediata.", "The objection concerns an immediate general implementation.", "The clarification narrows the actual disagreement."],
      ["Ambos apoyan nuevas pruebas en contextos distintos.", "Both support further trials in different contexts.", "The moderator's synthesis identifies the final shared position."]
    ]
  },
  {
    slug: "c1-listening-conditions-exceptions", title: "Retain Conditions and Exceptions", order: 2140, imageKey: "classroom-basics:14",
    summary: "Separate the default rule, eligibility condition, exception, deadline, and required proof in a dense spoken procedure.", situation: "acting correctly after hearing a policy with several nested conditions",
    transcript: ["Las solicitudes recibidas hasta el día quince se resolverán este mes, siempre que incluyan toda la documentación. Las que lleguen después pasarán al mes siguiente, salvo que se trate de una urgencia debidamente acreditada.", "En ese caso, no basta con marcar la casilla de urgente: habrá que adjuntar el justificante antes de las dos de la tarde del día siguiente. Si falta algún documento ordinario, se concederán tres días para aportarlo; ese plazo adicional, sin embargo, no se aplica al justificante de urgencia."],
    questions: [["Welche verspätete Anfrage kann noch im aktuellen Monat bearbeitet werden?", "Eine nachweislich dringende Anfrage mit rechtzeitigem Beleg.", "Jede Anfrage mit angekreuztem Dringlichkeitsfeld.", "Jede unvollständige Anfrage ohne weitere Unterlagen."], ["Wofür gilt die zusätzliche Dreitagesfrist nicht?", "Für den Dringlichkeitsnachweis.", "Für gewöhnliche fehlende Dokumente.", "Für Anträge vor dem fünfzehnten Tag."]],
    modelSummary: "Las solicitudes completas hasta el día quince se tramitan este mes; una urgencia posterior necesita un justificante inmediato, al que no se aplica el plazo adicional de tres días.",
    sentences: [
      ["Las solicitudes completas se resolverán este mes.", "Complete applications will be processed this month.", "This is the default outcome under the documentation condition."],
      ["Las solicitudes tardías pasarán al mes siguiente.", "Late applications will move to the following month.", "This is the default rule after the cutoff date."],
      ["Se hará una excepción si la urgencia está acreditada.", "An exception will be made if the urgency is documented.", "The exception requires evidence rather than a label alone."],
      ["El justificante debe adjuntarse antes de las dos.", "The supporting document must be attached before two o'clock.", "The exact deadline applies to the urgency proof."],
      ["El plazo adicional no se aplica al justificante de urgencia.", "The additional period does not apply to the urgency document.", "The final contrast prevents overgeneralizing the three-day allowance."]
    ]
  },
  {
    slug: "checkpoint-c1-dense-listening", title: "C1.6 Dense Listening Checkpoint", order: 2150, imageKey: "rewards-and-progress:16", checkpoint: true,
    summary: "Recover structure, corrections, implicit action, attributed viewpoints, conditions, and exceptions from one demanding spoken update.", situation: "relaying a revised decision accurately after a dense committee update",
    transcript: ["En principio, la apertura estaba prevista para el lunes. Mejor dicho, el lunes iba a comenzar la formación del personal; la atención al público empezará el miércoles, siempre que la prueba del martes no revele fallos importantes. La directora considera que el sistema está preparado, mientras que el responsable técnico prefiere mantener un margen.", "No se ha cancelado la apertura, por tanto, sino que se han separado dos fases que antes aparecían juntas. Quienes tengan cita el lunes recibirán hoy una propuesta de cambio. Si alguna persona no puede acudir el miércoles, deberá responder antes de mañana al mediodía para conservar la prioridad; de lo contrario, se le ofrecerá la primera fecha libre."],
    questions: [["Was findet nach der Korrektur am Montag statt?", "Die Schulung des Personals.", "Die allgemeine Öffnung für das Publikum.", "Die endgültige technische Prüfung."], ["Was muss eine betroffene Person tun, um bei Verhinderung ihre Priorität zu behalten?", "Bis morgen Mittag auf den Änderungsvorschlag antworten.", "Ohne Rückmeldung am Montag erscheinen.", "Erst nach dem Mittwoch eine neue Anfrage stellen."]],
    modelSummary: "El lunes empieza la formación, la apertura al público se prevé para el miércoles si la prueba sale bien y quienes no puedan aceptar el cambio deben responder antes de mañana al mediodía.",
    sentences: [
      ["La formación del personal comenzará el lunes.", "Staff training will begin on Monday.", "This is the corrected meaning of the original Monday date."],
      ["La atención al público empezará el miércoles.", "Public service will begin on Wednesday.", "This is the actual opening date after the self-correction."],
      ["La apertura depende de que la prueba no revele fallos importantes.", "The opening depends on the test not revealing major faults.", "The condition limits the Wednesday plan."],
      ["Las personas afectadas recibirán una propuesta de cambio.", "The affected people will receive a proposal to change their appointment.", "This is the action the organization will take."],
      ["Para conservar la prioridad, deberán responder antes de mañana al mediodía.", "To keep their priority, they will have to respond before noon tomorrow.", "The final instruction combines required action, purpose, and deadline."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`];
};

function checks(input) {
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "dictate", type: ExerciseType.LISTENING_DICTATION, question: "Write the key sentence you hear.", correct: input.sentences[2][0], audioText: input.sentences[2][0] },
    { key: "relay", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c1_dense_listening_reconstruction" }
    : { correct: check.correct, accepted: accepted(check.correct), audioText: check.audioText, goal: "c1_dense_listening", rubric: "Recover the final formulation, speaker, condition, exception, and required response without preserving abandoned wording." };
  const data = {
    lessonId: lesson.id,
    topicId: lesson.topicId,
    type: check.type,
    prompt: "Recover the final meaning from dense connected speech",
    instruction: "Listen once for structure, then replay only the section containing the correction, viewpoint, condition, or requested response.",
    questionText: check.question,
    answerJson,
    explanation: "C1 listening depends on discourse structure: corrections replace earlier wording, attribution separates viewpoints, and exceptions limit general rules.",
    difficulty: 6,
    order,
    xpReward: 20,
    imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topicData = {
    title: "Dense Listening and Spoken Discourse",
    description: "Spoken structure, self-correction, implicit requests, viewpoint attribution, conditions, exceptions, and accurate relay.",
    cefrLevel: "C1",
    imageKey: "reading-and-listening-lab:14"
  };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c1-dense-listening" }, update: topicData, create: { slug: "c1-dense-listening", ...topicData } });
  const groupSlugs = ["a2-reading-listening-lab", "a2-scenario-survival", "useful-phrases", "weather-and-time", "c1-narrative-interaction"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C1.6 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: "listening",
      title: input.title,
      orientationDe: "Höre einmal vollständig auf Aufbau und Endaussage. Nutze danach die abschnittsweise Wiederholung nur für Korrektur, Sprecherposition, Bedingung oder notwendige Reaktion.",
      orientationEn: "Listen once in full for structure and final meaning. Then use focused section replay only for the correction, viewpoint, condition, or required response.",
      paragraphs: input.transcript,
      questions: input.questions.map(([questionDe, answerDe, distractorOneDe, distractorTwoDe]) => ({
        questionDe,
        questionEn: questionDe,
        optionsDe: [answerDe, distractorOneDe, distractorTwoDe],
        optionsEn: [answerDe, distractorOneDe, distractorTwoDe],
        correct: 0,
        explanationDe: "Diese Antwort berücksichtigt die endgültige Formulierung und die einschränkenden Signale des Hörtexts.",
        explanationEn: "This answer follows the final formulation and the limiting signals in the listening text."
      })),
      recallPromptDe: "Gib Endaussage, entscheidende Einschränkung und notwendige Reaktion in ein bis zwei spanischen Sätzen wieder.",
      recallPromptEn: "Relay the final message, decisive limitation, and required response in one or two Spanish sentences.",
      modelSummary: input.modelSummary
    };
    const common = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "C1",
      theme: input.checkpoint ? "Checkpoint" : "Dense Listening",
      situation: input.situation,
      imageKey: input.imageKey,
      readingJson,
      outcomesJson: [
        "You can recover structure and final meaning from dense connected speech.",
        "You can track corrections, attributed viewpoints, conditions, and exceptions.",
        "You can relay the required response accurately in Spanish."
      ],
      conceptKeys: ["c1", "listening", "spoken-discourse", "correction", "inference"],
      reviewSummary: input.summary,
      order: input.order,
      estimatedMinutes: input.checkpoint ? 25 : 20,
      topicId: topic.id
    };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({
      where: { slug: input.slug },
      update: { ...common, vocabularyGroups: { set: connectedGroups } },
      create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } }
    });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} C1.6 dense-listening learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
