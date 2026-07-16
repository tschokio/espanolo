const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c2-spoken-repair-compression", title: "Repairs, Parentheses, and Compressed Speech", order: 2460, imageKey: "conversation-and-opinion:17",
    summary: "Follow spontaneous self-correction, parenthetical qualification, and compressed references without retaining wording the speaker has explicitly replaced.", situation: "extracting the final claim from an unscripted expert explanation",
    passage: ["Elena: El cambio redujo el coste un veinte por ciento; bueno, el coste directo, porque el mantenimiento —que antes se imputaba a otro departamento— aumentó ligeramente. Elena: Dicho de otro modo, no ahorramos un veinte por ciento en total, sino alrededor de un doce.", "Pablo: Entonces, si te entiendo bien, la primera cifra queda descartada como ahorro global. Elena: Exacto; sirve para el componente directo, pero la conclusión final es más limitada. Pablo: Y esa precisión, aunque parezca secundaria, cambia la comparación con el año anterior."],
    questions: [["Welche Zahl ist die endgültige Aussage zur Gesamtersparnis?", "Ungefähr zwölf Prozent.", "Genau zwanzig Prozent ohne Einschränkung.", "Eine leichte Erhöhung um zwanzig Prozent.", "Which figure is the final claim about total savings?", "Approximately twelve percent.", "Exactly twenty percent without qualification.", "A slight increase of twenty percent."], ["Welche Funktion hat dicho de otro modo?", "Es ersetzt die vorläufige Formulierung durch eine begrenztere Gesamtaussage.", "Es führt ein unabhängiges zweites Thema ein.", "Es bestätigt, dass beide Prozentzahlen dasselbe messen.", "What is the function of dicho de otro modo?", "It replaces the provisional wording with a more limited overall claim.", "It introduces an unrelated second topic.", "It confirms that both percentages measure the same thing."]],
    modelSummary: "La hablante corrige el alcance de la cifra inicial: el veinte por ciento corresponde al coste directo, mientras que el ahorro total, incluido el mantenimiento, ronda el doce por ciento.",
    sentences: [["La cifra inicial se limita al coste directo.", "The initial figure is limited to direct cost.", "The scope correction is retained."], ["El mantenimiento aumentó ligeramente y reduce el ahorro total.", "Maintenance increased slightly and reduces the total savings.", "The parenthetical detail changes the conclusion."], ["La formulación final sustituye, no añade, la estimación anterior.", "The final wording replaces rather than adds to the earlier estimate.", "Repair is interpreted as replacement."], ["El ahorro global ronda el doce por ciento.", "Overall savings are around twelve percent.", "The final claim preserves calibrated precision."], ["Al transmitirlo, hay que conservar la diferencia entre coste directo y total.", "When relaying it, the difference between direct and total cost must be preserved.", "The relay target protects scope." ]]
  },
  {
    slug: "c2-polyphonic-stance-tracking", title: "Polyphony and Speaker Attribution", order: 2470, imageKey: "conversation-and-opinion:18",
    summary: "Track who proposes, supports, qualifies, doubts, or reserves judgment across a dense multi-speaker exchange.", situation: "reporting the positions in a panel discussion",
    passage: ["Nuria: Yo adelantaría la prueba, siempre que sea reversible. Iván: Comparto la urgencia, pero no veo que la reversibilidad esté demostrada. Sara: A mí me preocupa otra cosa: que evaluemos el resultado antes de que aparezcan los efectos tardíos.", "Nuria: No propongo una adopción definitiva, solo obtener datos antes. Iván: En ese caso no me opongo al ensayo; me opongo a llamarlo reversible sin un protocolo de salida. Sara: Con ese protocolo y una evaluación posterior, podría apoyar la propuesta."],
    questions: [["Wer bestreitet die Dringlichkeit nicht, verlangt aber einen belegten Ausstiegsmechanismus?", "Iván.", "Nuria.", "Sara.", "Who does not dispute the urgency but requires a demonstrated exit mechanism?", "Iván.", "Nuria.", "Sara."], ["Unter welchen Bedingungen könnte Sara zustimmen?", "Mit einem Ausstiegsprotokoll und einer späteren Auswertung.", "Nur bei sofortiger endgültiger Einführung.", "Wenn keine Spätfolgen untersucht werden.", "Under what conditions could Sara support the proposal?", "With an exit protocol and a later evaluation.", "Only with immediate permanent adoption.", "If delayed effects are not studied."]],
    modelSummary: "Una atribución de hablantes precisa muestra que Nuria propone un ensayo temprano, Iván exige un protocolo que justifique la reversibilidad y Sara condiciona su apoyo a ese protocolo y a una evaluación posterior.",
    sentences: [["Nuria defiende un ensayo temprano, no una adopción definitiva.", "Nuria supports an early trial, not permanent adoption.", "Her position is attributed with its limit."], ["Iván comparte la urgencia, pero cuestiona la reversibilidad.", "Iván shares the sense of urgency but questions reversibility.", "Partial alignment and objection stay together."], ["Sara introduce el riesgo de evaluar demasiado pronto.", "Sara introduces the risk of evaluating too early.", "A distinct concern remains attributed."], ["El apoyo de Sara depende de dos condiciones explícitas.", "Sara's support depends on two explicit conditions.", "Conditional stance is not reported as agreement."], ["Una síntesis fiel mantiene separados hablante, postura y condición.", "A faithful synthesis keeps speaker, stance, and condition separate.", "The strategy prevents attribution errors." ]]
  },
  {
    slug: "c2-implicit-alignment-dissent", title: "Implicit Alignment and Diplomatic Dissent", order: 2480, imageKey: "conversation-and-opinion:19",
    summary: "Infer agreement, hesitation, and opposition from cautious wording without turning a polite reservation into either full support or hostility.", situation: "interpreting a diplomatically worded decision meeting",
    passage: ["Álvaro: La propuesta es ambiciosa y responde a una necesidad real. Beatriz: Desde luego; quizá convendría, eso sí, precisar quién asume el coste si la demanda supera la previsión. Carmen: No quisiera frenar el proyecto, aunque me costaría recomendarlo sin esa garantía.", "Álvaro: Entiendo la reserva. Podríamos aprobar el principio y dejar la ejecución condicionada a un límite presupuestario. Beatriz: Esa distinción me parece razonable. Carmen: Con un límite vinculante, mi objeción principal quedaría resuelta."],
    questions: [["Welche Haltung vertritt Carmen zunächst?", "Sie erkennt das Ziel an, kann die Umsetzung ohne Garantie aber nicht empfehlen.", "Sie lehnt den Zweck des Projekts grundsätzlich ab.", "Sie unterstützt die Umsetzung bereits vorbehaltlos.", "What stance does Carmen initially take?", "She recognizes the goal but cannot recommend implementation without a guarantee.", "She fundamentally rejects the purpose of the project.", "She already supports implementation unconditionally."], ["Was verändert der verbindliche Kostenrahmen?", "Er löst Carmens zentralen Vorbehalt und ermöglicht bedingte Unterstützung.", "Er beweist, dass keinerlei Nachfrage entstehen wird.", "Er macht Beatriz zur Gegnerin des Projekts.", "What does the binding cost limit change?", "It resolves Carmen's main reservation and enables conditional support.", "It proves that no demand will arise.", "It turns Beatriz into an opponent of the project."]],
    modelSummary: "Beatriz y Carmen expresan reservas mediante fórmulas diplomáticas, no rechazo total; un límite presupuestario vinculante transforma la objeción principal en apoyo condicionado.",
    sentences: [["El elogio inicial no equivale a una aprobación sin condiciones.", "The initial praise does not amount to unconditional approval.", "Positive framing is separated from final stance."], ["Beatriz introduce una reserva con «eso sí».", "Beatriz introduces a reservation with eso sí.", "The discourse marker signals qualification."], ["Carmen evita bloquear el objetivo, pero no recomienda la ejecución.", "Carmen avoids blocking the goal but does not recommend implementation.", "Diplomatic wording retains real opposition to action."], ["El límite vinculante convierte la reserva en apoyo condicionado.", "The binding limit turns the reservation into conditional support.", "The stance change is tied to a condition."], ["Al resumir, no hay que confundir cortesía con consentimiento.", "When summarizing, politeness must not be confused with consent.", "The inference rule protects stance accuracy." ]]
  },
  {
    slug: "c2-briefing-conditions-exceptions", title: "Conditions, Exceptions, and Operational Consequences", order: 2490, imageKey: "conversation-and-opinion:16",
    summary: "Retain the default rule, nested condition, exception, deadline, and responsible action from a dense spoken briefing.", situation: "relaying an operational procedure after one hearing",
    passage: ["Raúl: Como regla general, las solicitudes recibidas antes de las cuatro se procesan el mismo día. Raúl: Ahora bien, si requieren verificación externa, pasan al día siguiente, salvo las urgentes autorizadas por dirección, que deben quedar registradas antes de las cinco.", "Marta: ¿Y si la autorización llega después? Raúl: Se procesa al día siguiente y se deja constancia de la hora; no se aplica la excepción retroactivamente. Marta: Entonces, hoy debo identificar las verificaciones externas y confirmar antes de las cinco cuáles tienen autorización urgente."],
    questions: [["Welche Fälle werden trotz externer Prüfung noch am selben Tag bearbeitet?", "Dringende, von der Leitung genehmigte Fälle, die vor fünf Uhr erfasst sind.", "Alle nach vier Uhr eingegangenen Anträge.", "Jeder Fall mit nachträglicher Genehmigung.", "Which cases are still processed the same day despite external verification?", "Urgent cases authorized by management and recorded before five.", "All requests received after four.", "Every case with retrospective authorization."], ["Was geschieht bei einer Genehmigung nach fünf Uhr?", "Bearbeitung am Folgetag mit dokumentierter Eingangszeit.", "Die Ausnahme gilt rückwirkend.", "Der Antrag wird ohne Vermerk gelöscht.", "What happens when authorization arrives after five?", "Processing moves to the next day and the arrival time is recorded.", "The exception applies retroactively.", "The request is deleted without a record."]],
    modelSummary: "La regla permite procesar solicitudes tempranas el mismo día; la verificación externa las aplaza, excepto cuando una urgencia autorizada queda registrada antes de las cinco, sin aplicación retroactiva.",
    sentences: [["La regla general se aplica a las solicitudes recibidas antes de las cuatro.", "The default rule applies to requests received before four.", "The default remains separate from exceptions."], ["La verificación externa desplaza el trámite al día siguiente.", "External verification moves processing to the next day.", "The first condition changes the timeline."], ["La urgencia autorizada constituye una excepción con plazo.", "An authorized urgent case is an exception with a deadline.", "Exception and deadline are bound together."], ["Una autorización tardía no produce efectos retroactivos.", "Late authorization does not have retroactive effect.", "The negative boundary is retained."], ["La acción inmediata es identificar casos y confirmar autorizaciones antes de las cinco.", "The immediate action is to identify cases and confirm authorizations before five.", "The relay ends with ownership and deadline." ]]
  },
  {
    slug: "c2-live-synthesis-relay", title: "Live Synthesis and Actionable Relay", order: 2500, imageKey: "conversation-and-opinion:15",
    summary: "Compress a discussion into decision, rationale, unresolved risk, owner, and deadline without replaying the meeting chronologically.", situation: "briefing a colleague who missed a decision meeting",
    passage: ["Laura: Acordamos mantener la fecha, pero reducir el alcance de la primera fase. Diego: Porque las pruebas principales están completas; falta, eso sí, verificar la integración externa. Laura: Exacto, y si esa verificación falla, se aplaza únicamente el módulo nuevo.", "Sofía: Yo revisaré la integración mañana antes de las doce. Diego: Y yo prepararé el aviso alternativo por si hay que aplazar el módulo. Laura: La decisión general no cambia, pero el riesgo y el plan de contingencia deben figurar en el resumen."],
    questions: [["Welche Zusammenfassung ist handlungsfähig?", "Termin bleibt; Umfang sinkt; Sofía prüft bis morgen zwölf Uhr; Diego bereitet den Alternativhinweis vor.", "Das Team sprach ausführlich über mehrere technische Themen.", "Alles ist abgeschlossen und es bestehen keine Risiken.", "Which summary is actionable?", "The date remains; scope is reduced; Sofía checks by noon tomorrow; Diego prepares the alternative notice.", "The team spoke at length about several technical matters.", "Everything is complete and no risks remain."], ["Was wird nur bei fehlgeschlagener Prüfung verschoben?", "Das neue Modul.", "Das gesamte Projekt.", "Die bereits abgeschlossenen Haupttests.", "What is postponed only if verification fails?", "The new module.", "The entire project.", "The main tests that are already complete."]],
    modelSummary: "El equipo mantiene la fecha con un alcance reducido; Sofía verificará la integración antes de mañana al mediodía y Diego preparará un aviso alternativo por si debe aplazarse solo el módulo nuevo.",
    sentences: [["La decisión es mantener la fecha con un alcance reducido.", "The decision is to keep the date with a reduced scope.", "Decision and modification lead the relay."], ["La integración externa sigue siendo el riesgo pendiente.", "External integration remains the unresolved risk.", "The unresolved issue is not erased."], ["Si falla la verificación, solo se aplazará el módulo nuevo.", "If verification fails, only the new module will be postponed.", "Condition and scope remain exact."], ["Sofía verificará la integración antes de mañana al mediodía.", "Sofía will verify the integration before noon tomorrow.", "Owner and deadline are explicit."], ["Diego preparará el aviso alternativo como medida de contingencia.", "Diego will prepare the alternative notice as a contingency measure.", "The backup action remains attributed." ]]
  },
  {
    slug: "checkpoint-c2-expert-listening-synthesis", title: "C2.6 Expert Listening and Synthesis Checkpoint", order: 2510, imageKey: "rewards-and-progress:18", checkpoint: true,
    summary: "Track repairs, speakers, implicit stance, nested exceptions, and ownership, then relay the final decision in a concise actionable synthesis.", situation: "producing an immediate decision brief from a dense multi-speaker exchange",
    passage: ["Alicia: El presupuesto permite iniciar dos sedes; perdón, dos si la segunda abre en octubre, porque antes no habrá personal suficiente. Bruno: Yo no cuestiono la expansión, pero llamarla simultánea sería engañoso. Celia: Coincido; además, la sede norte necesita una licencia que, salvo retraso administrativo, llegará en septiembre.", "Alicia: Entonces mantenemos ambas sedes en el plan, con apertura escalonada. Bruno: Puedo apoyar esa formulación si la fecha de la segunda queda condicionada a personal y licencia. Celia: Yo confirmaré la licencia el viernes; Alicia revisará la plantilla el lunes y Bruno actualizará el comunicado después."],
    questions: [["Welche Aussage ersetzt die Idee einer gleichzeitigen Eröffnung?", "Beide Standorte bleiben geplant, öffnen aber gestaffelt und bedingt.", "Nur der nördliche Standort wird jemals eröffnet.", "Beide Standorte öffnen zwingend vor Oktober.", "Which statement replaces the idea of simultaneous opening?", "Both sites remain planned but open in stages and conditionally.", "Only the northern site will ever open.", "Both sites must open before October."], ["Wer handelt in welcher Reihenfolge?", "Celia prüft Freitag die Lizenz, Alicia Montag das Personal, danach aktualisiert Bruno die Mitteilung.", "Bruno prüft zuerst die Lizenz und eröffnet beide Standorte.", "Alicia wartet ohne weitere Zuständigkeit auf Oktober.", "Who acts, and in what order?", "Celia checks the license on Friday, Alicia checks staffing on Monday, and Bruno then updates the announcement.", "Bruno first checks the license and opens both sites.", "Alicia waits until October with no further responsibility."]],
    modelSummary: "Las dos sedes siguen en el plan, pero abrirán de forma escalonada; la segunda depende de personal y licencia, que Celia y Alicia comprobarán antes de que Bruno actualice el comunicado.",
    sentences: [["La apertura simultánea queda sustituida por una apertura escalonada.", "Simultaneous opening is replaced by a phased opening.", "The corrected final frame replaces earlier wording."], ["Bruno apoya la expansión, pero rechaza una descripción engañosa.", "Bruno supports expansion but rejects a misleading description.", "Agreement and dissent stay attributed."], ["La segunda sede depende tanto del personal como de la licencia.", "The second site depends on both staffing and the license.", "Both conditions remain attached."], ["Celia y Alicia comprobarán las condiciones antes de actualizar el comunicado.", "Celia and Alicia will check the conditions before the announcement is updated.", "Action order is preserved."], ["La síntesis final debe incluir decisión, condiciones, responsables y secuencia.", "The final synthesis must include the decision, conditions, owners, and sequence.", "The checkpoint relay names every required function." ]]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`];
};

function checks(input) {
  return [
    { key: "attribute", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "dictate", type: ExerciseType.LISTENING_DICTATION, question: input.sentences[2][1], correct: input.sentences[2][0], audioText: input.sentences[2][0] },
    { key: "reframe", type: ExerciseType.TRANSFORMATION, question: input.sentences[3][1], correct: input.sentences[3][0] },
    { key: "relay", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0], functionalCheck: input.checkpoint ? { minimumMatched: 2, groups: [
      { key: "decision-condition", labelDe: "Entscheidung und Bedingung bewahren", labelEn: "preserve decision and condition", required: true, any: ["apertura escalonada", "segunda sede depende", "depende del personal", "depende de la licencia"] },
      { key: "ownership-sequence", labelDe: "Verantwortliche oder Reihenfolge nennen", labelEn: "name ownership or sequence", required: true, any: ["Celia", "Alicia", "Bruno", "antes de actualizar", "después"] }
    ] } : null }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c2_expert_listening_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), ...(check.audioText ? { audioText: check.audioText } : {}), goal: "c2_expert_listening_relay", rubric: check.functionalCheck ? "Relay the final decision and preserve conditions plus ownership in natural Spanish." : "Retrieve the attributed final meaning accurately after listening; do not preserve wording the speaker corrected away.", ...(check.functionalCheck ? { functionalCheck: check.functionalCheck } : {}) };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Track the final spoken meaning and relay it accurately",
    instruction: "Follow repair markers, speaker attribution, stance, conditions, exceptions, owners, and sequence before formulating the Spanish relay.",
    questionText: check.question, answerJson,
    explanation: "Expert listening preserves the final version, attributes each stance, and compresses decisions into conditions, owners, and next actions.",
    difficulty: 7, order, xpReward: 24, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topicData = {
    title: "Expert Listening, Polyphony, and Live Synthesis",
    description: "Spontaneous repair, compressed speech, speaker attribution, implicit stance, nested conditions and exceptions, actionable relay, and live synthesis.",
    cefrLevel: "C2", imageKey: "conversation-and-opinion:17"
  };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c2-expert-listening-synthesis" }, update: topicData, create: { slug: "c2-expert-listening-synthesis", ...topicData } });
  const groupSlugs = ["useful-phrases", "essential-words", "a2-reading-listening-lab", "a2-scenario-survival", "c2-rhetoric-variation-vocabulary"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C2.6 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: "listening", title: input.title,
      orientationDe: "Höre zuerst auf die endgültige Aussage und ordne jede Position einer Person zu. Notiere beim zweiten Durchgang Korrekturen, Einschränkungen, Bedingungen, Ausnahmen, Verantwortliche und zeitliche Reihenfolge.",
      orientationEn: "Listen first for the final claim and attribute each stance to a speaker. On the second pass, track repairs, qualifications, conditions, exceptions, owners, and temporal sequence.",
      paragraphs: input.passage,
      questions: input.questions.map(([questionDe, answerDe, distractorOneDe, distractorTwoDe, questionEn, answerEn, distractorOneEn, distractorTwoEn]) => ({ questionDe, questionEn, optionsDe: [answerDe, distractorOneDe, distractorTwoDe], optionsEn: [answerEn, distractorOneEn, distractorTwoEn], correct: 0, explanationDe: "Diese Antwort bewahrt die endgültige Formulierung, ordnet Haltung und Bedingung korrekt zu und lässt verworfene oder nur vorläufige Angaben nicht als Ergebnis stehen.", explanationEn: "This answer preserves the final wording, attributes stance and condition correctly, and does not retain discarded or provisional information as the outcome." })),
      recallPromptDe: "Gib die endgültige Aussage auf Spanisch weiter. Nenne Entscheidung oder Ergebnis, die entscheidende Einschränkung und – falls vorhanden – Verantwortliche sowie Reihenfolge.",
      recallPromptEn: "Relay the final meaning in Spanish. State the decision or result, the decisive qualification, and, where present, ownership and sequence.",
      modelSummary: input.modelSummary
    };
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "C2",
      theme: input.checkpoint ? "Checkpoint" : "Expert Listening and Synthesis", situation: input.situation,
      imageKey: input.imageKey, readingJson,
      outcomesJson: ["You can follow spontaneous repair and retain the speaker's final scope.", "You can attribute nuanced stances across several speakers.", "You can relay conditions, exceptions, owners, and sequence concisely."],
      conceptKeys: ["c2", "listening", "polyphony", "stance", "synthesis"], reviewSummary: input.summary,
      order: input.order, estimatedMinutes: input.checkpoint ? 34 : 27, topicId: topic.id
    };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} C2.6 expert-listening and synthesis learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
