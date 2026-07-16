const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c2-scope-ambiguity", title: "Resolve Scope and Ambiguity", order: 2160, imageKey: "grammar-scenes:16",
    summary: "Detect competing interpretations and reformulate quantifiers, negation, reference, and attachment so that only the intended reading remains.", situation: "editing a policy whose wording permits incompatible interpretations",
    passage: ["El borrador afirmaba: «No todos los participantes recibirán necesariamente la misma ayuda». Algunos lectores entendieron que la ayuda sería desigual; otros, que quizá no todos la recibirían. La combinación de no todos y necesariamente dejaba abierto el alcance de la negación.", "La versión revisada distingue las dos ideas: «Todos recibirán ayuda, aunque la modalidad podrá variar según sus necesidades». Así se garantiza la cobertura universal y se limita la variación al tipo de apoyo."],
    questions: [["¿Qué problema tenía la primera formulación?", "Permitía más de una interpretación sobre quién recibiría ayuda.", "Carecía de cualquier forma negativa.", "Garantizaba claramente una ayuda idéntica."], ["¿Qué fija la versión revisada?", "Ayuda para todos y posible variación únicamente en la modalidad.", "Exclusión de parte de los participantes.", "Ausencia de criterios según necesidades."]],
    modelSummary: "La primera frase era ambigua por el alcance de la negación; la revisión garantiza ayuda para todos y reserva la variación al tipo de apoyo.",
    sentences: [
      ["No todos interpretaron la frase de la misma manera.", "Not everyone interpreted the sentence in the same way.", "The quantifier clearly means that interpretations differed among the group."],
      ["Todos recibirán ayuda; solo variará la modalidad.", "Everyone will receive help; only the format will vary.", "Two clauses separate universal coverage from limited variation."],
      ["La restricción afecta al plazo, no al derecho de acceso.", "The restriction affects the deadline, not the right of access.", "The explicit contrast fixes the scope of the restriction."],
      ["Para evitar ambigüedades, conviene nombrar de nuevo el referente.", "To avoid ambiguity, it is advisable to name the referent again.", "Repeating a noun can be more precise than using an unclear pronoun."],
      ["La versión revisada admite una sola interpretación pertinente.", "The revised version allows only one relevant interpretation.", "The final test is whether the intended reading is uniquely recoverable."]
    ]
  },
  {
    slug: "c2-faithful-compression", title: "Compress without Distortion", order: 2170, imageKey: "reading-and-listening-lab:16",
    summary: "Reduce dense information while preserving attribution, causal limits, exceptions, uncertainty, and the practical consequence.", situation: "turning a long technical finding into an accurate executive summary",
    passage: ["El estudio observó una mejora media tras la intervención, pero el efecto fue menor en los centros con alta rotación de personal. Los autores advierten de que el diseño no permite aislar la intervención de otros cambios simultáneos y que dos centros abandonaron el seguimiento.", "Una síntesis fiel no puede decir simplemente «la intervención funcionó». Debe conservar el resultado medio, la variación, la limitación causal y la pérdida de datos: hubo una mejora asociada a la intervención, desigual entre centros y todavía no atribuible a una sola causa."],
    questions: [["¿Qué perdería la frase «la intervención funcionó»?", "Variación, límites causales y abandono del seguimiento.", "Únicamente el nombre de los autores.", "Ninguna información relevante."], ["¿Qué conclusión permite el estudio?", "Hubo una mejora asociada, pero no puede atribuirse con certeza a una sola causa.", "La intervención produjo exactamente el mismo efecto en todos los centros.", "Los centros que abandonaron demostraron un fracaso total."]],
    modelSummary: "El estudio asocia la intervención con una mejora media desigual, pero los cambios simultáneos y la pérdida de seguimiento impiden una atribución causal concluyente.",
    sentences: [
      ["El estudio registró una mejora media, aunque desigual.", "The study recorded an average improvement, although an uneven one.", "The compression retains both central result and variation."],
      ["Los datos muestran una asociación, no una causa aislada.", "The data show an association, not an isolated cause.", "The causal limit survives the shorter formulation."],
      ["Dos centros abandonaron el seguimiento, lo que reduce la solidez del resultado.", "Two centers left the follow-up, which reduces the robustness of the result.", "The missing data remain connected to their evidential consequence."],
      ["En síntesis, el resultado es prometedor, pero no concluyente.", "In summary, the result is promising but not conclusive.", "The evaluative balance preserves degree rather than flattening it."],
      ["Resumir exige jerarquizar, no borrar las condiciones decisivas.", "Summarizing requires prioritizing, not erasing decisive conditions.", "Faithful compression distinguishes dispensable detail from meaning-changing limits."]
    ]
  },
  {
    slug: "c2-audience-mediation", title: "Mediate for a New Audience", order: 2180, imageKey: "conversation-and-opinion:16",
    summary: "Translate specialized reasoning into accessible Spanish while preserving mechanisms, thresholds, uncertainty, and required action.", situation: "explaining a technical notice to people without specialist knowledge",
    passage: ["El informe técnico indica que la ventilación debe intensificarse cuando la concentración supere el umbral establecido y mantenerse hasta que las mediciones se estabilicen. También aclara que una lectura aislada no basta para evaluar la tendencia.", "Para el público general podría reformularse así: «Si el valor supera el límite, aumentaremos la ventilación y seguiremos midiendo. No volveremos al nivel normal por una sola lectura baja, sino cuando varias mediciones confirmen que la situación se ha estabilizado»."],
    questions: [["¿Qué conserva la reformulación accesible?", "Límite, acción, seguimiento y necesidad de varias mediciones.", "Solo la orden de abrir una ventana.", "La idea de que una lectura aislada siempre basta."], ["¿Qué cambia para adaptarse al público?", "La terminología y la explicitud de los pasos, no el criterio técnico.", "El umbral y la condición de estabilidad.", "La necesidad de continuar midiendo."]],
    modelSummary: "La mediación sustituye terminología especializada por pasos claros, pero mantiene el límite, la ventilación, las mediciones repetidas y el criterio de estabilidad.",
    sentences: [
      ["En términos sencillos, el valor ha superado el límite seguro.", "In simple terms, the value has exceeded the safe limit.", "The accessible frame preserves the threshold while reducing terminology."],
      ["Por eso aumentaremos la ventilación y seguiremos midiendo.", "That is why we will increase ventilation and continue measuring.", "The explanation keeps cause, action, and monitoring together."],
      ["Una sola lectura baja no demuestra que el problema haya terminado.", "A single low reading does not show that the problem has ended.", "The audience receives the decisive evidential limitation explicitly."],
      ["Volveremos al nivel normal cuando varias mediciones lo confirmen.", "We will return to the normal level when several measurements confirm it.", "The practical decision remains tied to the original criterion."],
      ["Adaptar el lenguaje no significa simplificar la evidencia.", "Adapting the language does not mean simplifying the evidence.", "Mediation changes accessibility without changing epistemic content."]
    ]
  },
  {
    slug: "c2-reconcile-accounts", title: "Reconcile Conflicting Accounts", order: 2190, imageKey: "conversation-and-opinion:15",
    summary: "Separate genuine contradiction from different scope, timing, definitions, and evidence before constructing a justified synthesis.", situation: "explaining why two apparently incompatible reports may both contain valid information",
    passage: ["Un informe afirma que el tiempo de espera disminuyó un quince por ciento; otro sostiene que los usuarios no percibieron ninguna mejora. No miden exactamente lo mismo: el primero compara el promedio mensual, mientras que el segundo recoge opiniones durante las horas de mayor demanda.", "Los resultados no son equivalentes, pero tampoco se anulan. El promedio pudo mejorar al reducirse las esperas en horas tranquilas, mientras los momentos de máxima demanda siguieron generando una experiencia negativa."],
    questions: [["¿Por qué los informes no se contradicen necesariamente?", "Miden variables y franjas distintas.", "Uno de ellos carece por completo de datos.", "Ambos describen exactamente la misma experiencia."], ["¿Qué síntesis explica ambos resultados?", "Mejoró el promedio, pero las horas punta pudieron seguir siendo problemáticas.", "Las esperas aumentaron por igual en todo momento.", "La percepción siempre invalida cualquier medición."]],
    modelSummary: "Los informes miden promedio y percepción en horas punta; por eso puede haber una mejora general sin que mejore la experiencia durante la máxima demanda.",
    sentences: [
      ["Los informes parecen discrepar, pero no miden lo mismo.", "The reports appear to disagree, but they do not measure the same thing.", "The opening suspends a premature contradiction judgment."],
      ["El primero analiza el promedio mensual; el segundo, las horas punta.", "The first analyzes the monthly average; the second, peak hours.", "Parallel structure makes the scope difference explicit."],
      ["Una mejora general puede coexistir con problemas en momentos concretos.", "A general improvement can coexist with problems at specific times.", "The synthesis provides a model under which both findings hold."],
      ["Ningún resultado invalida automáticamente al otro.", "Neither result automatically invalidates the other.", "The sentence blocks false either-or reasoning."],
      ["Antes de conciliar fuentes, hay que comparar qué define y mide cada una.", "Before reconciling sources, one must compare what each defines and measures.", "Definitions and measurement frames precede synthesis."]
    ]
  },
  {
    slug: "c2-connotation-effect", title: "Preserve Connotation and Effect", order: 2200, imageKey: "conversation-and-opinion:11",
    summary: "Choose reformulations that preserve evaluation, distance, irony, intensity, and rhetorical effect rather than only dictionary meaning.", situation: "rephrasing a sensitive statement without changing the speaker's stance",
    passage: ["Describir una medida como «ambiciosa» puede elogiar su alcance; llamarla «pretenciosa» introduce una evaluación negativa. Del mismo modo, «admitió el error» presenta resistencia previa o responsabilidad de un modo que «dijo que se había equivocado» no reproduce por completo.", "Una paráfrasis precisa debe conservar no solo el hecho, sino también la postura. Si el original afirma que alguien «se limitó a reconocer» un problema, sustituirlo por «celebró que se hubiera detectado» transforma distancia crítica en entusiasmo."],
    questions: [["¿Qué diferencia hay entre «ambiciosa» y «pretenciosa»?", "Comparten una idea de alcance, pero difieren en valoración.", "Son equivalentes en tono y efecto.", "La segunda es siempre un término técnico neutro."], ["¿Qué debe conservar una paráfrasis de alto nivel?", "Hecho, valoración, intensidad y distancia del hablante.", "Solo los sustantivos principales.", "La misma longitud, aunque cambie la postura."]],
    modelSummary: "Las palabras cercanas pueden transmitir valoraciones distintas; una paráfrasis precisa conserva el hecho y también la postura, intensidad y efecto del original.",
    sentences: [
      ["La propuesta es ambiciosa, no necesariamente pretenciosa.", "The proposal is ambitious, not necessarily pretentious.", "The contrast separates reach from negative evaluation."],
      ["El portavoz admitió el error tras varias preguntas.", "The spokesperson admitted the error after several questions.", "Admitió can imply reluctant acknowledgment and accountability."],
      ["Se limitó a reconocer que existía un problema.", "She merely acknowledged that a problem existed.", "Se limitó a adds critical evaluation of an insufficient response."],
      ["La reformulación conserva el hecho, pero pierde la ironía.", "The reformulation preserves the fact but loses the irony.", "Propositional content and rhetorical effect are evaluated separately."],
      ["Dos expresiones cercanas no producen siempre la misma impresión.", "Two similar expressions do not always create the same impression.", "Near-synonymy does not guarantee pragmatic equivalence."]
    ]
  },
  {
    slug: "checkpoint-c2-precision-mediation", title: "C2.1 Precision and Mediation Checkpoint", order: 2210, imageKey: "rewards-and-progress:16", checkpoint: true,
    summary: "Resolve ambiguity, compress faithfully, mediate for a new audience, reconcile sources, and preserve stance in one integrated task.", situation: "preparing a clear public synthesis from technical and partly conflicting material",
    passage: ["El informe interno concluye que el nuevo sistema redujo el tiempo medio, aunque no demuestra que esa mejora se deba únicamente a la automatización. Una encuesta realizada en horas punta, por su parte, recoge todavía numerosas quejas. La frase inicial «el sistema resolvió las demoras» resultaría, por tanto, excesiva y ambigua respecto al alcance.", "Una comunicación pública fiel podría decir: «El tiempo medio ha disminuido, pero siguen produciéndose demoras en los momentos de mayor demanda. Como intervinieron varios cambios a la vez, todavía no podemos atribuir la mejora a una sola medida. Mantendremos el sistema y evaluaremos específicamente las horas punta»."],
    questions: [["¿Qué evita la comunicación pública revisada?", "Generalizar la mejora y atribuirla a una causa no demostrada.", "Mencionar que el promedio disminuyó.", "Proponer una evaluación de las horas punta."], ["¿Cómo integra las dos fuentes?", "Distingue el promedio general de la experiencia en máxima demanda.", "Declara falsa la encuesta por no medir promedios.", "Afirma que todas las demoras desaparecieron."]],
    modelSummary: "La síntesis comunica una mejora media sin atribución causal exclusiva, conserva las quejas de horas punta y propone evaluar específicamente esos periodos.",
    sentences: [
      ["El tiempo medio disminuyó, aunque persisten demoras en horas punta.", "Average waiting time fell, although delays persist at peak times.", "The sentence integrates both findings without flattening their scope."],
      ["No puede atribuirse la mejora a una sola medida.", "The improvement cannot be attributed to a single measure.", "The impersonal formulation preserves the causal limitation."],
      ["En términos sencillos, la situación ha mejorado, pero no en todo momento.", "In simple terms, the situation has improved, but not at all times.", "Accessible wording preserves the crucial temporal qualification."],
      ["Los informes difieren en su objeto, no necesariamente en sus resultados.", "The reports differ in their focus, not necessarily in their findings.", "The reconciliation identifies the source of apparent conflict."],
      ["Una síntesis precisa conserva tanto el avance como el problema pendiente.", "A precise synthesis preserves both the progress and the unresolved problem.", "The final principle balances achievement and remaining limitation."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`]; };

function checks(input) {
  return [
    { key: "distinguish", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "reformulate", type: ExerciseType.TRANSFORMATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "mediate", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c2_precision_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "c2_precision_mediation", rubric: "Preserve scope, attribution, evidential strength, exception, connotation, and audience-appropriate action." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Preserve meaning while reshaping the message", instruction: "Identify proposition, scope, source, limitation, stance, and audience before reformulating in Spanish.", questionText: check.question, answerJson, explanation: "C2 precision preserves not only the central fact but also its scope, evidence status, exceptions, connotation, and intended effect.", difficulty: 7, order, xpReward: 22, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topicData = { title: "Precision, Reformulation, and Mediation", description: "Ambiguity resolution, faithful compression, audience mediation, source reconciliation, connotation, and rhetorical effect.", cefrLevel: "C2", imageKey: "grammar-scenes:16" };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c2-precision-mediation" }, update: topicData, create: { slug: "c2-precision-mediation", ...topicData } });
  const groupSlugs = ["useful-phrases", "essential-words", "a2-reading-listening-lab", "a2-scenario-survival", "c2-precision-mediation-vocabulary"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C2.1 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: "reading", title: input.title,
      orientationDe: "Trenne zuerst Kernaussage, Reichweite, Quelle, Einschränkung und Haltung. Prüfe danach, welche dieser Informationen bei einer kürzeren oder zugänglicheren Formulierung erhalten bleiben müssen.",
      orientationEn: "Separate the central claim, scope, source, limitation, and stance first. Then decide which information must survive a shorter or more accessible formulation.",
      paragraphs: input.passage,
      questions: input.questions.map(([questionDe, answerDe, distractorOneDe, distractorTwoDe]) => ({ questionDe, questionEn: questionDe, optionsDe: [answerDe, distractorOneDe, distractorTwoDe], optionsEn: [answerDe, distractorOneDe, distractorTwoDe], correct: 0, explanationDe: "Diese Antwort erhält Reichweite, Belegstatus und kommunikative Wirkung des Ausgangstextes.", explanationEn: "This answer preserves the scope, evidence status, and communicative effect of the source." })),
      recallPromptDe: "Formuliere die Kernaussage für einen neuen Leser auf Spanisch, ohne entscheidende Einschränkung oder Haltung zu verlieren.",
      recallPromptEn: "Reformulate the main point in Spanish for a new reader without losing the decisive limitation or stance.",
      modelSummary: input.modelSummary
    };
    const common = { title: input.title, summary: input.summary, cefrLevel: "C2", theme: input.checkpoint ? "Checkpoint" : "Precision and Mediation", situation: input.situation, imageKey: input.imageKey, readingJson, outcomesJson: ["You can resolve scope and reference ambiguity.", "You can compress and mediate information without distorting evidence.", "You can reconcile sources and preserve connotation and rhetorical effect."], conceptKeys: ["c2", "precision", "reformulation", "mediation", "connotation"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 28 : 22, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} C2.1 precision-and-mediation learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
