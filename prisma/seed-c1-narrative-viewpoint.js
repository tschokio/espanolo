const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c1-narrative-tempo", title: "Control Narrative Tempo", order: 1860, imageKey: "past-events:14",
    summary: "Move between scene, repeated background, and decisive events to control how quickly a story unfolds.", situation: "turning a list of past events into a paced narrative",
    passage: ["La plaza estaba casi vacía y los últimos comerciantes recogían sus puestos. Marta caminaba sin prisa, como hacía cada jueves.", "De pronto, se apagaron todas las luces. Alguien gritó, una puerta se cerró de golpe y, durante unos segundos, nadie se movió."],
    questions: [["¿Qué información ralentiza la narración y construye la escena?", "La descripción de la plaza y la rutina de Marta.", "La puerta que se cierra de golpe.", "El grito que sigue al apagón."], ["¿Qué acelera el relato?", "La serie de acontecimientos breves después del apagón.", "La costumbre semanal de Marta.", "La descripción inicial de los comerciantes."]],
    modelSummary: "La escena avanza lentamente hasta que el apagón desencadena una rápida sucesión de acontecimientos.",
    sentences: [
      ["La plaza estaba casi vacía.", "The square was almost empty.", "The imperfect holds the scene open."],
      ["Marta caminaba sin prisa, como hacía cada jueves.", "Marta was walking unhurriedly, as she did every Thursday.", "Two imperfect forms combine an unfolding action with a habit."],
      ["De pronto, se apagaron todas las luces.", "Suddenly, all the lights went out.", "De pronto and the preterite accelerate the story."],
      ["Alguien gritó y una puerta se cerró de golpe.", "Someone shouted and a door slammed shut.", "Short coordinated events create narrative momentum."],
      ["Durante unos segundos, nadie se movió.", "For a few seconds, nobody moved.", "A bounded duration remains a completed event."]
    ]
  },
  {
    slug: "c1-flashback-foreshadowing", title: "Use Flashback and Foreshadowing", order: 1870, imageKey: "past-events:16",
    summary: "Place earlier causes and later expectations around the narrative present without confusing event order.", situation: "revealing why an event matters while maintaining suspense",
    passage: ["Al abrir la carta, reconoció enseguida la letra. Años atrás, su abuelo le había dejado un sobre idéntico, pero le había pedido que no lo abriera hasta cumplir treinta años.", "Ahora comprendía que aquella promesa iba a cambiarlo todo. Todavía no sabía cómo, aunque pronto descubriría la razón."],
    questions: [["¿Qué ocurrió antes de que se abriera la carta actual?", "El abuelo había dejado otro sobre y había pedido que esperara.", "La protagonista ya había descubierto la razón.", "La carta actual ya había cambiado toda la situación."], ["¿Qué anticipa el texto?", "Que la promesa cambiaría la situación y que pronto se conocería la razón.", "Que el abuelo volvería para recoger la carta.", "Que nunca se abriría ninguno de los sobres."]],
    modelSummary: "Una carta actual activa el recuerdo de una promesa anterior y anticipa un descubrimiento futuro.",
    sentences: [
      ["Años atrás, su abuelo le había dejado un sobre idéntico.", "Years earlier, his grandfather had left him an identical envelope.", "The pluperfect opens a layer before the main past event."],
      ["Le había pedido que no lo abriera todavía.", "He had asked him not to open it yet.", "Reported influence combines the pluperfect with the past subjunctive."],
      ["Ahora comprendía que aquella promesa iba a cambiarlo todo.", "Now he understood that the promise was going to change everything.", "Imperfect and iba a frame a future seen from the past."],
      ["Todavía no sabía cómo.", "He still did not know how.", "A state of incomplete knowledge sustains suspense."],
      ["Pronto descubriría la razón.", "He would soon discover the reason.", "The conditional marks a later event from a past viewpoint."]
    ]
  },
  {
    slug: "c1-viewpoint-distance", title: "Shift Viewpoint and Distance", order: 1880, imageKey: "conversation-and-opinion:14",
    summary: "Distinguish narrator fact, character perception, and uncertain interpretation so the reader knows whose viewpoint is active.", situation: "presenting an event through more than one consciousness",
    passage: ["El director aseguró que la decisión era inevitable. Desde su punto de vista, cualquier demora habría empeorado la situación.", "Clara, en cambio, tuvo la impresión de que aún quedaban alternativas. Tal vez él no las había considerado, pensó, o quizá prefería no mencionarlas."],
    questions: [["¿Qué afirmación pertenece al director?", "Que la decisión era inevitable y una demora habría empeorado la situación.", "Que todavía quedaban varias alternativas claras.", "Que Clara debía tomar la decisión final."], ["¿Qué parte es una interpretación de Clara?", "Que quizá el director no había considerado o no quería mencionar otras alternativas.", "Que la decisión se había anunciado oficialmente.", "Que cualquier demora habría empeorado necesariamente la situación."]],
    modelSummary: "El director presenta la decisión como inevitable, mientras Clara percibe alternativas y formula dos hipótesis.",
    sentences: [
      ["El director aseguró que la decisión era inevitable.", "The director asserted that the decision was inevitable.", "The reporting verb assigns the claim to its source."],
      ["Desde su punto de vista, cualquier demora habría empeorado la situación.", "From his point of view, any delay would have worsened the situation.", "The viewpoint frame prevents the evaluation from sounding narrator-neutral."],
      ["Clara tuvo la impresión de que aún quedaban alternativas.", "Clara had the impression that alternatives still remained.", "Perception is presented as a character interpretation."],
      ["Tal vez él no las había considerado, pensó.", "Perhaps he had not considered them, she thought.", "A thought tag and probability marker create distance."],
      ["Quizá prefería no mencionarlas.", "Perhaps he preferred not to mention them.", "Quizá keeps a second explanation explicitly uncertain."]
    ]
  },
  {
    slug: "c1-participial-compression", title: "Compress Information Naturally", order: 1890, imageKey: "reading-and-listening-lab:13",
    summary: "Use participles, gerunds, and reduced clauses to vary information density without creating unclear subjects.", situation: "making written narration concise but still easy to follow",
    passage: ["Terminada la reunión, los representantes abandonaron la sala sin hacer declaraciones. Rodeados de periodistas, avanzaron rápidamente hacia la salida.", "Habiendo revisado ya el acuerdo, la portavoz se limitó a confirmar su aprobación. Los documentos publicados esa misma tarde aclararon los detalles pendientes."],
    questions: [["¿Qué ocurrió inmediatamente después de terminar la reunión?", "Los representantes abandonaron la sala.", "La portavoz publicó los documentos.", "Los periodistas iniciaron otra reunión."], ["¿Quién había revisado el acuerdo?", "La portavoz.", "Todos los periodistas.", "Los representantes que abandonaron la sala."]],
    modelSummary: "Tras la reunión, los representantes evitaron declarar y la portavoz confirmó un acuerdo que ya había revisado.",
    sentences: [
      ["Terminada la reunión, los representantes abandonaron la sala.", "Once the meeting was over, the representatives left the room.", "An absolute participial clause sets a completed circumstance."],
      ["Rodeados de periodistas, avanzaron hacia la salida.", "Surrounded by journalists, they moved toward the exit.", "The participle agrees with the understood subject."],
      ["Salieron sin hacer declaraciones.", "They left without making statements.", "Sin plus infinitive compresses an accompanying non-event."],
      ["Habiendo revisado el acuerdo, la portavoz confirmó su aprobación.", "Having reviewed the agreement, the spokesperson confirmed her approval.", "The perfect gerund marks an earlier action by the same subject."],
      ["Los documentos publicados esa tarde aclararon los detalles.", "The documents published that afternoon clarified the details.", "A participle embeds identifying information inside the noun phrase."]
    ]
  },
  {
    slug: "c1-narrative-voice", title: "Choose an Effective Narrative Voice", order: 1900, imageKey: "people-and-family:16",
    summary: "Use first person, witness perspective, and impersonal narration deliberately according to access, reliability, and effect.", situation: "retelling the same event with a purposeful voice",
    passage: ["Yo no vi quién abrió la puerta; solo recuerdo el ruido y las voces del pasillo. Desde donde estaba, parecía que todos intentaban salir a la vez.", "Más tarde se supo que una alarma defectuosa había provocado la confusión. Según varios testigos, nadie había dado la orden de evacuar."],
    questions: [["¿Qué limita expresamente el narrador en primera persona?", "No vio quién abrió la puerta y cuenta solo lo que recuerda o percibió.", "La información publicada por los bomberos.", "La versión compartida por todos los testigos."], ["¿Cómo se presenta después la información confirmada?", "Con se supo y con la atribución a varios testigos.", "Como recuerdo directo y completo del narrador.", "A través de una orden dada durante el incidente."]],
    modelSummary: "El narrador limita su testimonio personal y después incorpora información conocida y atribuida a otros testigos.",
    sentences: [
      ["Yo no vi quién abrió la puerta.", "I did not see who opened the door.", "First person makes the limit of direct knowledge explicit."],
      ["Solo recuerdo el ruido y las voces del pasillo.", "I only remember the noise and the voices in the hallway.", "A memory verb marks subjective access."],
      ["Desde donde estaba, parecía que todos intentaban salir.", "From where I was, it seemed that everyone was trying to leave.", "The frame limits perception by physical viewpoint."],
      ["Más tarde se supo que la alarma era defectuosa.", "It later became known that the alarm was defective.", "Impersonal se foregrounds the information rather than its discoverer."],
      ["Según varios testigos, nadie había dado la orden.", "According to several witnesses, nobody had given the order.", "Attribution shows the evidence source."]
    ]
  },
  {
    slug: "checkpoint-c1-narrative-viewpoint", title: "C1.2 Narrative and Viewpoint Checkpoint", order: 1910, imageKey: "rewards-and-progress:13", checkpoint: true,
    summary: "Integrate narrative tempo, flashback, anticipation, viewpoint, compression, and source control in one connected account.", situation: "reconstructing a complex event clearly and engagingly",
    passage: ["Cuando llegamos, el edificio ya había sido evacuado. La gente esperaba en silencio mientras los bomberos revisaban cada planta.", "Al parecer, alguien había visto humo en una ventana; sin embargo, más tarde se supo que una tubería rota había producido el vapor. Aclarado el incidente, todos pudieron regresar, aunque nadie olvidaría fácilmente aquella noche."],
    questions: [["¿Qué había ocurrido antes de la llegada del narrador?", "El edificio ya había sido evacuado.", "Los bomberos ya habían terminado la revisión.", "Todos habían regresado al edificio."], ["¿Cómo cambia la explicación del supuesto humo?", "Primero se atribuye a lo que alguien creyó ver; después se conoce que era vapor de una tubería rota.", "Primero se confirma un incendio y después se descubre otra planta afectada.", "La primera explicación se mantiene sin ninguna corrección posterior."]],
    modelSummary: "Una evacuación causada por supuesto humo se resuelve al descubrirse que una tubería rota había producido vapor.",
    sentences: [
      ["Cuando llegamos, el edificio ya había sido evacuado.", "When we arrived, the building had already been evacuated.", "The pluperfect establishes the earlier result."],
      ["La gente esperaba mientras los bomberos revisaban cada planta.", "People were waiting while the firefighters checked every floor.", "Parallel imperfect forms hold two background processes open."],
      ["Al parecer, alguien había visto humo.", "Apparently, someone had seen smoke.", "The source remains indirect and the event earlier."],
      ["Más tarde se supo que una tubería había producido el vapor.", "It later became known that a pipe had produced the steam.", "Impersonal discovery corrects the earlier interpretation."],
      ["Aclarado el incidente, todos pudieron regresar.", "Once the incident was clarified, everyone was able to return.", "A reduced completed circumstance moves directly to the result."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`]; };
function checks(input) { return [
  { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
  { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
  { key: "transform", type: ExerciseType.TRANSFORMATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
  { key: "produce", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0] }
]; }

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords ? { correctWords: check.correctWords, goal: "c1_narrative_word_order" } : { correct: check.correct, accepted: accepted(check.correct), goal: "c1_narrative_viewpoint", rubric: "Preserve event order, source, viewpoint, and the intended narrative effect." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Reconstruct the narrative perspective", instruction: "Locate the narrative reference point, event order, information source, and intended tempo before choosing the form.", questionText: check.question, answerJson, explanation: "Advanced narration coordinates aspect, temporal layers, viewpoint, information source, and sentence density rather than choosing tense from a time word alone.", difficulty: 6, order, xpReward: 20, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c1-narrative-viewpoint" }, update: { title: "Advanced Narration and Viewpoint", description: "Narrative tempo, temporal layers, source and viewpoint, stylistic compression, and deliberate narrative voice.", cefrLevel: "C1", imageKey: "past-events:14" }, create: { slug: "c1-narrative-viewpoint", title: "Advanced Narration and Viewpoint", description: "Narrative tempo, temporal layers, source and viewpoint, stylistic compression, and deliberate narrative voice.", cefrLevel: "C1", imageKey: "past-events:14" } });
  const groupSlugs = ["a2-reading-listening-lab", "useful-phrases", "weather-and-time", "people-and-pronouns", "c1-narrative-interaction"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C1.2 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const readingJson = {
      inputMode: "reading",
      title: input.title,
      orientationDe: "Lies zuerst auf Ereignisfolge und Wendepunkt. Ordne danach jede Aussage ihrer Quelle oder Perspektive zu.",
      orientationEn: "Read first for event sequence and turning point, then assign each claim to its source or viewpoint.",
      paragraphs: input.passage,
      questions: input.questions.map(([question, answer, distractorOne, distractorTwo]) => ({
        questionDe: question,
        questionEn: question,
        optionsDe: [answer, distractorOne, distractorTwo],
        optionsEn: [answer, distractorOne, distractorTwo],
        correct: 0,
        explanationDe: "Diese Antwort bewahrt Ereignisfolge, Informationsquelle und Perspektive des Textes.",
        explanationEn: "This answer preserves the text's event sequence, information source, and viewpoint."
      })),
      recallPromptDe: "Fasse Ereignisfolge, Perspektive und entscheidende Veränderung in einem oder zwei spanischen Sätzen zusammen.",
      recallPromptEn: "Summarize the event sequence, viewpoint, and decisive change in one or two Spanish sentences.",
      modelSummary: input.modelSummary
    };
    const common = { title: input.title, summary: input.summary, cefrLevel: "C1", theme: input.checkpoint ? "Checkpoint" : "Advanced Narration", situation: input.situation, imageKey: input.imageKey, readingJson, outcomesJson: ["You can control narrative tempo with aspect and event structure.", "You can keep flashback, anticipation, source, and viewpoint distinct.", "You can compress information without losing reference clarity."], conceptKeys: ["c1", "narration", "viewpoint", "aspect", "cohesion"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 24 : 19, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} C1.2 narrative-and-viewpoint learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
