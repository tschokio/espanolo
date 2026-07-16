const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b2-reading-main-claim", title: "Find the Main Claim and Its Support", order: 1680, imageKey: "reading-and-listening-lab:10",
    summary: "Separate a text's central claim from examples and supporting details.", situation: "reading an explanatory article without translating every word",
    readingJson: {
      title: "Una biblioteca que cambió de función",
      orientationDe: "Suche zuerst die wichtigste Veränderung. Einzelheiten wie Öffnungszeiten und Möbel dienen nur als Belege.",
      orientationEn: "First find the main change. Details such as opening hours and furniture only support it.",
      paragraphs: [
        "Durante años, la biblioteca del barrio fue un lugar silencioso al que acudían sobre todo estudiantes. Sin embargo, muchas familias no podían aprovecharla porque cerraba antes de que los adultos terminaran de trabajar.",
        "El ayuntamiento amplió el horario y creó zonas para conversar, trabajar en grupo y asistir a talleres. Desde entonces ha aumentado el número de visitantes. La biblioteca sigue prestando libros, pero ahora funciona también como un espacio de encuentro para todo el barrio."
      ],
      questions: [
        { questionDe: "Was ist die zentrale Aussage?", questionEn: "What is the main claim?", optionsDe: ["Die Bibliothek wurde zu einem vielseitigen Treffpunkt", "Studierende lesen keine Bücher mehr", "Das Rathaus schloss die Bibliothek"], optionsEn: ["The library became a versatile community space", "Students no longer read books", "The council closed the library"], correct: 0, explanationDe: "Der ganze Text erklärt den Wandel von einem vorwiegend stillen Lernort zu einem breiteren Treffpunkt.", explanationEn: "The whole text explains the shift from a mainly quiet study place to a broader community space." },
        { questionDe: "Welcher Beleg stützt diese Aussage?", questionEn: "Which evidence supports the claim?", optionsDe: ["Mehr Besucher seit längeren Zeiten und neuen Bereichen", "Die Bibliothek besitzt Bücher", "Erwachsene arbeiten"], optionsEn: ["More visitors after longer hours and new areas", "The library owns books", "Adults work"], correct: 0, explanationDe: "Die gestiegene Besucherzahl nach den Änderungen ist der direkte Beleg.", explanationEn: "The increased visitor count after the changes is the direct evidence." }
      ],
      recallPromptDe: "Fasse Wandel und Ergebnis in einem spanischen Satz mit pero, por eso oder desde entonces zusammen.",
      recallPromptEn: "Summarize the change and result in one Spanish sentence using pero, por eso, or desde entonces.",
      modelSummary: "La biblioteca sigue prestando libros, pero ahora ofrece más actividades y por eso recibe a más vecinos."
    },
    sentences: [
      ["Durante años, la biblioteca fue un lugar principalmente silencioso.", "For years, the library was a mainly quiet place.", "The opening establishes the earlier situation."],
      ["Muchas familias no podían aprovecharla porque cerraba temprano.", "Many families could not use it because it closed early.", "Porque introduces the problem's cause."],
      ["El ayuntamiento amplió el horario y creó nuevas zonas.", "The city council extended the hours and created new areas.", "Two coordinated actions describe the intervention."],
      ["Desde entonces ha aumentado el número de visitantes.", "Since then, the number of visitors has increased.", "Desde entonces links the change to its later result."],
      ["Ahora funciona también como un espacio de encuentro.", "Now it also functions as a meeting place.", "The final sentence restates the central transformation."]
    ]
  },
  {
    slug: "b2-reading-cause-result", title: "Reconstruct Cause, Response, and Result", order: 1690, imageKey: "city-transport:12",
    summary: "Track a problem, the response to it, and the evidence that the response changed the outcome.", situation: "understanding a short report about a public measure",
    readingJson: {
      title: "Una calle con menos coches",
      orientationDe: "Ordne drei Schritte: ursprüngliches Problem, Maßnahme und beobachtetes Ergebnis.", orientationEn: "Track three stages: original problem, measure, and observed result.",
      paragraphs: ["La calle Mayor sufría atascos diarios y los peatones apenas tenían espacio. Por ese motivo, el municipio decidió limitar el acceso de coches durante seis meses.", "Al principio algunos comerciantes temían perder clientes. No obstante, las ventas no disminuyeron y aumentó el número de personas que caminaban por la zona. Debido a estos resultados, la medida se mantendrá de forma permanente."],
      questions: [
        { questionDe: "Warum wurde der Autoverkehr begrenzt?", questionEn: "Why was car access limited?", optionsDe: ["Wegen täglicher Staus und wenig Platz für Fußgänger", "Weil alle Geschäfte schließen wollten", "Wegen sinkender Besucherzahlen"], optionsEn: ["Because of daily congestion and little pedestrian space", "Because every shop wanted to close", "Because visitor numbers were falling"], correct: 0, explanationDe: "Der erste Absatz nennt Staus und fehlenden Raum als direkte Gründe.", explanationEn: "The first paragraph names congestion and lack of space as the direct reasons." },
        { questionDe: "Warum bleibt die Maßnahme bestehen?", questionEn: "Why will the measure remain?", optionsDe: ["Die Verkäufe blieben stabil und mehr Menschen kamen zu Fuß", "Der Versuch wurde nie ausgewertet", "Autos wurden schneller"], optionsEn: ["Sales stayed stable and more people came on foot", "The trial was never evaluated", "Cars became faster"], correct: 0, explanationDe: "Die beobachteten Ergebnisse widersprachen der Befürchtung und stützten die dauerhafte Lösung.", explanationEn: "The observed results contradicted the concern and supported the permanent solution." }
      ],
      recallPromptDe: "Verbinde Problem, Maßnahme und Ergebnis in einem spanischen Satz.", recallPromptEn: "Connect the problem, measure, and result in one Spanish sentence.",
      modelSummary: "Como había demasiado tráfico, el municipio limitó los coches y, tras comprobar los resultados, decidió mantener la medida."
    },
    sentences: [
      ["La calle sufría atascos diarios.", "The street suffered daily traffic jams.", "This is the initial problem."],
      ["Por ese motivo, el municipio limitó el acceso de coches.", "For that reason, the municipality limited car access.", "The connector marks the response to the cause."],
      ["Algunos comerciantes temían perder clientes.", "Some shopkeepers feared losing customers.", "This introduces an opposing expectation."],
      ["No obstante, las ventas no disminuyeron.", "Nevertheless, sales did not decrease.", "No obstante contrasts evidence with the fear."],
      ["Debido a estos resultados, la medida se mantendrá.", "Because of these results, the measure will remain.", "The conclusion explicitly rests on evidence."]
    ]
  },
  {
    slug: "b2-reading-viewpoints-evidence", title: "Separate Viewpoints from Evidence", order: 1700, imageKey: "conversation-and-opinion:12",
    summary: "Identify who holds each opinion and which information is presented as observable evidence.", situation: "reading a balanced discussion rather than accepting every sentence as fact",
    readingJson: {
      title: "¿Trabajar desde casa o desde la oficina?",
      orientationDe: "Markiere gedanklich: Meinung der Beschäftigten, Meinung der Leitung und messbare Beobachtung.", orientationEn: "Mentally label employee opinion, management opinion, and measurable observation.",
      paragraphs: ["Muchos empleados afirman que en casa se concentran mejor y ahorran tiempo de desplazamiento. La dirección, en cambio, considera que la oficina facilita la colaboración espontánea.", "Una prueba de tres meses mostró que la productividad general no cambió, aunque los equipos nuevos necesitaron más reuniones. A partir de estos datos, la empresa adoptó un modelo híbrido y evaluará de nuevo los resultados dentro de un año."],
      questions: [
        { questionDe: "Welche Information ist ein beobachtetes Ergebnis?", questionEn: "Which information is an observed result?", optionsDe: ["Die Gesamtproduktivität blieb gleich", "Zu Hause ist grundsätzlich besser", "Die Leitung mag Büros"], optionsEn: ["Overall productivity stayed the same", "Home is always better", "Management likes offices"], correct: 0, explanationDe: "Die unveränderte Produktivität stammt aus der dreimonatigen Erprobung.", explanationEn: "The unchanged productivity comes from the three-month trial." },
        { questionDe: "Warum wurde ein hybrides Modell gewählt?", questionEn: "Why was a hybrid model chosen?", optionsDe: ["Die Daten zeigten Vorteile und Einschränkungen beider Seiten", "Alle waren derselben Meinung", "Es gab keine Erprobung"], optionsEn: ["The data showed benefits and limits on both sides", "Everyone held the same opinion", "There was no trial"], correct: 0, explanationDe: "Der Text verbindet unterschiedliche Sichtweisen mit gemischten Ergebnissen.", explanationEn: "The text combines different viewpoints with mixed results." }
      ],
      recallPromptDe: "Formuliere auf Spanisch eine ausgewogene Schlussfolgerung aus den beiden Sichtweisen und den Daten.", recallPromptEn: "State a balanced Spanish conclusion from both viewpoints and the data.",
      modelSummary: "Aunque empleados y dirección valoran aspectos distintos, los datos apoyan un modelo híbrido que deberá seguir evaluándose."
    },
    sentences: [
      ["Muchos empleados afirman que en casa se concentran mejor.", "Many employees state that they concentrate better at home.", "The reporting verb attributes a viewpoint."],
      ["La dirección, en cambio, valora la colaboración espontánea.", "Management, by contrast, values spontaneous collaboration.", "En cambio marks the opposing viewpoint."],
      ["La productividad general no cambió durante la prueba.", "Overall productivity did not change during the trial.", "This sentence reports observed evidence."],
      ["Los equipos nuevos necesitaron más reuniones.", "New teams needed more meetings.", "The detail qualifies the broad productivity result."],
      ["La empresa evaluará de nuevo los resultados.", "The company will evaluate the results again.", "The future review keeps the conclusion provisional."]
    ]
  },
  {
    slug: "b2-reading-inference-reference", title: "Infer Carefully and Track References", order: 1710, imageKey: "reading-and-listening-lab:13",
    summary: "Resolve pronouns and connectors, then distinguish a supported inference from information stated directly.", situation: "understanding a narrative with implied conclusions",
    readingJson: {
      title: "El huerto después de la tormenta",
      orientationDe: "Achte darauf, worauf eso, allí und por eso zeigen. Entscheide danach, was ausdrücklich gesagt und was nur ableitbar ist.", orientationEn: "Track what eso, allí, and por eso refer to. Then separate explicit information from inference.",
      paragraphs: ["La tormenta derribó varias ramas en el huerto comunitario. Cuando Julia llegó, vio que alguien ya las había apartado y había cubierto las plantas más frágiles.", "No encontró a nadie allí, pero junto a la puerta había unas herramientas todavía húmedas. Por eso dejó una nota de agradecimiento. Esa misma tarde, un vecino respondió que no había trabajado solo."],
      questions: [
        { questionDe: "Was lässt sich begründet schließen?", questionEn: "What can reasonably be inferred?", optionsDe: ["Mehr als eine Person half nach dem Sturm", "Julia hatte die Werkzeuge gekauft", "Niemand kümmerte sich um den Garten"], optionsEn: ["More than one person helped after the storm", "Julia had bought the tools", "Nobody cared for the garden"], correct: 0, explanationDe: "Der Nachbar sagt ausdrücklich, dass er nicht allein gearbeitet habe; daraus folgt mindestens eine weitere Person.", explanationEn: "The neighbor explicitly says he did not work alone, implying at least one other person." },
        { questionDe: "Worauf bezieht sich por eso?", questionEn: "What does por eso refer to?", optionsDe: ["Auf die sichtbaren Spuren der bereits geleisteten Hilfe", "Auf den Kauf neuer Pflanzen", "Auf Julias Abreise"], optionsEn: ["The visible signs of help already given", "Buying new plants", "Julia's departure"], correct: 0, explanationDe: "Die weggeräumten Äste, geschützten Pflanzen und feuchten Werkzeuge erklären die Dankesnotiz.", explanationEn: "The cleared branches, protected plants, and wet tools explain the thank-you note." }
      ],
      recallPromptDe: "Fasse auf Spanisch zusammen, welche Hinweise Julia fand und was sie daraus schloss.", recallPromptEn: "Summarize in Spanish what clues Julia found and what she inferred.",
      modelSummary: "Julia vio señales de que alguien había protegido el huerto y dedujo que varias personas habían colaborado."
    },
    sentences: [
      ["La tormenta derribó varias ramas.", "The storm knocked down several branches.", "This event creates the problem."],
      ["Alguien ya las había apartado.", "Someone had already moved them aside.", "Las refers back to the branches."],
      ["Las herramientas todavía estaban húmedas.", "The tools were still wet.", "This physical clue supports an inference about recent work."],
      ["Por eso Julia dejó una nota de agradecimiento.", "That is why Julia left a thank-you note.", "Por eso connects the clues to her response."],
      ["El vecino dijo que no había trabajado solo.", "The neighbor said that he had not worked alone.", "The reported statement confirms shared help."]
    ]
  },
  {
    slug: "b2-reading-paraphrase-register", title: "Paraphrase Formal Information in Plain Spanish", order: 1720, imageKey: "classroom-basics:14",
    summary: "Recognize formal nominal language and restate its meaning with clear verbs and familiar connectors.", situation: "understanding an official notice and explaining it to another person",
    readingJson: {
      title: "Aviso sobre el uso de las salas",
      orientationDe: "Suche hinter formellen Nomen die eigentliche Handlung: solicitud, autorización und devolución.", orientationEn: "Find the actions behind formal nouns such as solicitud, autorización, and devolución.",
      paragraphs: ["La utilización de las salas requiere una solicitud previa. La autorización se concederá según la disponibilidad y deberá confirmarse por correo electrónico.", "La cancelación con menos de veinticuatro horas de antelación podrá limitar futuras reservas. Asimismo, la devolución de las llaves deberá realizarse antes del cierre del edificio."],
      questions: [
        { questionDe: "Was muss man zuerst tun, um einen Raum zu nutzen?", questionEn: "What must someone do first to use a room?", optionsDe: ["Vorher einen Antrag stellen", "Nur die Schlüssel nehmen", "Nach der Nutzung eine E-Mail senden"], optionsEn: ["Submit a request in advance", "Simply take the keys", "Send an email after using it"], correct: 0, explanationDe: "Solicitud previa bedeutet, dass die Anfrage vor der Nutzung erfolgen muss.", explanationEn: "Solicitud previa means the request must happen before use." },
        { questionDe: "Welche einfache Umschreibung passt zur Schlüsselregel?", questionEn: "Which plain paraphrase matches the key rule?", optionsDe: ["Man muss die Schlüssel vor Gebäudeschluss zurückgeben", "Die Schlüssel dürfen behalten werden", "Das Gebäude bleibt immer geöffnet"], optionsEn: ["You must return the keys before the building closes", "You may keep the keys", "The building stays open at all times"], correct: 0, explanationDe: "Devolución deberá realizarse entspricht hier schlicht debe devolver.", explanationEn: "Devolución deberá realizarse simply corresponds to debe devolver here." }
      ],
      recallPromptDe: "Erkläre die beiden wichtigsten Regeln in einem einfachen spanischen Satz mit hay que oder tener que.", recallPromptEn: "Explain the two main rules in one plain Spanish sentence using hay que or tener que.",
      modelSummary: "Hay que pedir la sala con antelación y devolver las llaves antes de que cierre el edificio."
    },
    sentences: [
      ["El uso de las salas requiere una solicitud previa.", "Using the rooms requires a prior request.", "The formal noun phrase states the first requirement."],
      ["La autorización depende de la disponibilidad.", "Authorization depends on availability.", "The approval is not guaranteed."],
      ["La reserva debe confirmarse por correo electrónico.", "The reservation must be confirmed by email.", "A passive form presents the required procedure."],
      ["Una cancelación tardía puede limitar futuras reservas.", "A late cancellation may limit future reservations.", "The sentence states a possible consequence."],
      ["Las llaves deben devolverse antes del cierre.", "The keys must be returned before closing.", "The formal rule can be paraphrased with tener que devolver."]
    ]
  },
  {
    slug: "checkpoint-b2-reading-inference", title: "B2.7 Connected Reading Checkpoint", order: 1730, imageKey: "rewards-and-progress:9",
    summary: "Check main claims, causal structure, attributed viewpoints, evidence, inference, reference tracking, and paraphrase.", situation: "reading a balanced local report and summarizing its conclusion", checkpoint: true,
    readingJson: {
      title: "Un mercado que redujo sus residuos",
      orientationDe: "Bestimme Problem, zwei Perspektiven, beobachtete Daten und die daraus gezogene Schlussfolgerung.", orientationEn: "Identify the problem, two viewpoints, observed data, and resulting conclusion.",
      paragraphs: ["El mercado del barrio introdujo envases reutilizables porque cada semana se tiraban grandes cantidades de embalajes de un solo uso. Algunos vendedores temían tener más trabajo, mientras que muchos clientes apoyaban la medida.", "Después de seis meses, los residuos de embalajes habían bajado un cuarenta por ciento. Los tiempos de espera solo habían aumentado durante los primeros días. Debido a estos resultados, el sistema se mantendrá, aunque los nuevos vendedores recibirán una breve formación."],
      questions: [
        { questionDe: "Welche Schlussfolgerung stützen die Daten?", questionEn: "Which conclusion do the data support?", optionsDe: ["Das System reduziert Abfall und die Anfangsprobleme waren begrenzt", "Das System erhöhte dauerhaft alle Wartezeiten", "Die Händler erzeugten mehr Abfall"], optionsEn: ["The system reduces waste and the initial problems were limited", "The system permanently increased all waiting times", "The sellers produced more waste"], correct: 0, explanationDe: "Vierzig Prozent weniger Abfall und nur vorübergehend längere Wartezeiten stützen die Fortsetzung.", explanationEn: "Forty percent less waste and only temporarily longer waits support continuation." },
        { questionDe: "Warum ist eine Schulung vorgesehen?", questionEn: "Why is training planned?", optionsDe: ["Damit neue Händler das beibehaltene System anwenden können", "Damit das System abgeschafft wird", "Weil Kunden keine Behälter möchten"], optionsEn: ["So new sellers can use the retained system", "So the system can be abolished", "Because customers do not want containers"], correct: 0, explanationDe: "Die Schulung ist eine Anpassung innerhalb der positiven Gesamtentscheidung.", explanationEn: "Training is an adjustment within the overall positive decision." }
      ],
      recallPromptDe: "Formuliere auf Spanisch Problem, Ergebnis und Entscheidung in höchstens zwei Sätzen.", recallPromptEn: "State the problem, result, and decision in no more than two Spanish sentences.",
      modelSummary: "El mercado introdujo envases reutilizables para reducir residuos. Como la basura bajó un cuarenta por ciento, mantendrá el sistema y formará a los nuevos vendedores."
    },
    sentences: [
      ["El mercado introdujo envases reutilizables para reducir residuos.", "The market introduced reusable containers to reduce waste.", "Purpose explains the measure."],
      ["Algunos vendedores temían tener más trabajo.", "Some sellers feared having more work.", "This attributes a concern to one group."],
      ["Después de seis meses, los residuos habían bajado un cuarenta por ciento.", "After six months, waste had fallen by forty percent.", "The measured change is evidence."],
      ["Las esperas solo aumentaron durante los primeros días.", "Waiting times increased only during the first few days.", "The limitation qualifies the concern."],
      ["El sistema se mantendrá y los nuevos vendedores recibirán formación.", "The system will remain and new sellers will receive training.", "The conclusion combines continuation with an adjustment."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,;]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`]; };
function checks(input) { return [
  { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
  { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
  { key: "respond", type: ExerciseType.SHORT_ANSWER, question: input.sentences[2][1], correct: input.sentences[2][0] },
  { key: "produce", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
]; }

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords ? { correctWords: check.correctWords, goal: "b2_reading_reconstruction" } : { correct: check.correct, accepted: accepted(check.correct), goal: "b2_reading_evidence", rubric: "Reconstruct the claim, relationship, or evidence from the text before producing the model sentence." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Reconstruct meaning from connected input", instruction: "Use the text structure and evidence, not isolated word matching.", questionText: check.question, answerJson, explanation: "Connected reading improves when claims, viewpoints, references, and evidence are tracked before details are translated.", difficulty: 5, order, xpReward: 18, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "b2-reading-inference" }, update: { title: "Connected Reading and Inference", description: "Main claims, causal structure, viewpoints, evidence, reference tracking, inference, and paraphrase.", cefrLevel: "B2", imageKey: "reading-and-listening-lab:10" }, create: { slug: "b2-reading-inference", title: "Connected Reading and Inference", description: "Main claims, causal structure, viewpoints, evidence, reference tracking, inference, and paraphrase.", cefrLevel: "B2", imageKey: "reading-and-listening-lab:10" } });
  const groupSlugs = ["a2-reading-listening-lab", "useful-phrases", "places-around-town", "essential-words", "b2-discourse-reporting", "b2-complex-structures"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B2.7 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "B2", theme: input.checkpoint ? "Checkpoint" : "Connected Reading", situation: input.situation, imageKey: input.imageKey, readingJson: input.readingJson, outcomesJson: ["You can find a main claim and its supporting evidence.", "You can separate viewpoints, facts, and supported inference.", "You can paraphrase a connected Spanish text in clear Spanish."], conceptKeys: ["b2", "reading", "inference", "evidence", "paraphrase"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 20 : 16, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B2.7 connected-reading learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
