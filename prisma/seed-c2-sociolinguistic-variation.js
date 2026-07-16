const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c2-panhispanic-grammar", title: "Panhispanic Grammatical Variation", order: 2280, imageKey: "grammar-scenes:13",
    summary: "Recognize major regional grammatical patterns, understand their social meaning, and keep your own production internally consistent without treating one variety as defective.", situation: "following the same discussion as speakers from Spain, Argentina, and Mexico contribute",
    passage: ["Una hablante de Madrid pregunta «¿vosotros habéis terminado?», otra de Buenos Aires dice «¿ustedes terminaron?» y añade «si querés, te lo mando». Las diferencias afectan la segunda persona plural, la preferencia por ciertos tiempos pasados y, en buena parte del Río de la Plata y otras zonas, el voseo.", "No son versiones incompletas de una única norma, sino sistemas regionales asentados. La competencia panhispánica exige comprenderlos y reconocer su distribución; al producir, conviene mantener coherencia con la variedad elegida y adaptar únicamente lo necesario para facilitar la comunicación."],
    questions: [["¿Qué demuestra el diálogo?", "Que varias formas regionales sistemáticas pueden expresar funciones equivalentes.", "Que solo una hablante utiliza gramática.", "Que ustedes siempre indica formalidad."], ["¿Qué se recomienda al producir?", "Mantener coherencia con una variedad y comprender las demás de forma receptiva.", "Cambiar de sistema en cada frase.", "Evitar toda forma de segunda persona."]],
    modelSummary: "El español presenta sistemas regionales estables como vosotros, ustedes y vos; la meta es comprender la variación y producir de forma coherente, no jerarquizar variedades.",
    sentences: [
      ["¿Vosotros habéis terminado ya?", "Have you all finished yet?", "Vosotros and the present perfect are common in much of Spain in this context."],
      ["¿Ustedes ya terminaron?", "Have you all finished already?", "Ustedes is the general plural form of address throughout most of the Americas."],
      ["Si querés, te lo mando ahora.", "If you want, I will send it to you now.", "Querés is a standard voseo form in regions where vos is established."],
      ["Las tres formas pertenecen a sistemas regionales coherentes.", "All three forms belong to coherent regional systems.", "Variation is systematic rather than random error."],
      ["Comprender varias normas no obliga a mezclarlas al hablar.", "Understanding several norms does not require mixing them when speaking.", "Receptive breadth and productive consistency are compatible goals."]
    ]
  },
  {
    slug: "c2-regional-lexicon", title: "Regional Lexicon and Accommodation", order: 2290, imageKey: "conversation-and-opinion:13",
    summary: "Infer regional vocabulary from context, avoid false assumptions, and negotiate a shared term naturally when interlocutors use different words.", situation: "coordinating a trip with speakers who use different everyday vocabulary",
    passage: ["En distintos lugares se puede tomar un autobús, un bus, un colectivo, una guagua o un camión. El ordenador puede ser computadora; el móvil, celular. La elección informa sobre región y comunidad, pero una sola palabra rara vez permite identificar con seguridad el origen exacto de una persona.", "Cuando una variante no se entiende, la solución natural no es corregir al hablante: «¿Con colectivo te refieres al autobús urbano?». Después puede adoptarse temporalmente el término compartido. La acomodación busca entendimiento sin borrar la identidad lingüística de nadie."],
    questions: [["¿Qué no permite concluir una sola variante léxica?", "El origen exacto de una persona con total seguridad.", "Que existen palabras regionales.", "Que el contexto ayuda a interpretar."], ["¿Qué hace la pregunta sobre colectivo?", "Comprueba el significado sin presentar la variante como error.", "Prohíbe utilizar palabras locales.", "Cambia el tema del viaje." ]],
    modelSummary: "El léxico regional se interpreta con contexto y cautela; si falta comprensión, se confirma el referente y se acuerda una expresión compartida sin corregir identidades.",
    sentences: [
      ["Aquí al autobús urbano le decimos colectivo.", "Here we call the city bus colectivo.", "The frame explicitly maps a regional term to its referent."],
      ["¿Con guagua te refieres al autobús?", "By guagua, do you mean the bus?", "The clarification is neutral and meaning-focused."],
      ["En este contexto, móvil y celular designan el mismo objeto.", "In this context, móvil and celular refer to the same object.", "Shared reference does not erase regional distribution."],
      ["Una palabra aislada no identifica con certeza una procedencia.", "An isolated word does not identify someone's origin with certainty.", "Sociolinguistic inference requires multiple contextual signals."],
      ["Acomodarse es facilitar el entendimiento, no corregir una identidad.", "Accommodation means facilitating understanding, not correcting an identity.", "Successful adaptation remains respectful and reciprocal."]
    ]
  },
  {
    slug: "c2-address-social-distance", title: "Address, Power, and Social Distance", order: 2300, imageKey: "conversation-and-opinion:10",
    summary: "Choose and negotiate tú, usted, vos, names, titles, and indirectness from relationship, setting, community norms, and moment-to-moment alignment.", situation: "joining a new workplace where forms of address are not obvious",
    passage: ["La oposición entre tú y usted no equivale simplemente a informal y formal. Puede expresar cercanía, respeto, distancia profesional, edad, jerarquía o costumbre regional. En algunas comunidades se usa usted entre familiares; en otras, tutear a una persona mayor resulta normal si ella lo propone.", "La relación también puede negociarse explícitamente: «Si te parece, podemos tutearnos». Observar cómo se presentan los demás, cómo responden y qué práctica mantiene el grupo evita convertir una tabla rígida en una decisión social inadecuada."],
    questions: [["¿Por qué no basta la regla informal/formal?", "Porque la elección también depende de región, relación, jerarquía y costumbre.", "Porque usted carece de verbos.", "Porque todas las comunidades usan tú."], ["¿Qué logra «podemos tutearnos»?", "Negocia de forma explícita una mayor cercanía en la forma de tratamiento.", "Impone usted a todo el grupo.", "Evita cualquier forma de segunda persona."]],
    modelSummary: "Las formas de tratamiento construyen relaciones sociales; se eligen observando normas locales, vínculo y respuesta, y pueden negociarse explícitamente.",
    sentences: [
      ["Si le parece, podemos revisar el documento mañana.", "If that works for you, we can review the document tomorrow.", "Usted agreement combines respectful address with a cooperative proposal."],
      ["Si te parece, podemos tutearnos.", "If you like, we can address each other with tú.", "The wording explicitly negotiates the relationship rather than assuming it."],
      ["¿Cómo prefiere que me dirija a usted?", "How would you prefer me to address you?", "A direct respectful question resolves uncertainty safely."],
      ["El tratamiento cambia con la relación y con la comunidad.", "Forms of address change with the relationship and the community.", "Social meaning cannot be reduced to grammar alone."],
      ["La respuesta del interlocutor también indica el registro adecuado.", "The interlocutor's response also signals the appropriate register.", "Accommodation is interactional and can change during the exchange."]
    ]
  },
  {
    slug: "c2-face-euphemism", title: "Facework, Euphemism, and Delicate Meaning", order: 2310, imageKey: "conversation-and-opinion:9",
    summary: "Interpret and formulate delicate messages that protect dignity without concealing decisive facts, responsibility, or required action.", situation: "communicating a serious performance problem without humiliating the person involved",
    passage: ["Decir «hay aspectos mejorables» puede suavizar una crítica, pero resulta insuficiente si nadie sabe qué debe cambiar. Una formulación cuidadosa protege la imagen del interlocutor y, al mismo tiempo, concreta el problema: «El informe contiene dos cifras sin fuente; necesitamos verificarlas antes de publicarlo».", "El eufemismo también puede ocultar responsabilidad. «Se produjeron irregularidades» evita nombrar quién actuó y qué ocurrió. La delicadeza legítima reduce una amenaza interpersonal; no debería borrar información necesaria para comprender consecuencias o exigir rendición de cuentas."],
    questions: [["¿Por qué es mejor la crítica concreta del informe?", "Protege la relación, pero identifica problema y acción necesaria.", "Porque elimina toda mención de las cifras.", "Porque responsabiliza a una persona sin pruebas."], ["¿Qué riesgo tiene «se produjeron irregularidades»?", "Puede ocultar agentes, hechos y responsabilidad relevantes.", "Es siempre demasiado coloquial.", "Expresa con exactitud quién actuó." ]],
    modelSummary: "La delicadeza eficaz combina respeto con precisión; suaviza la amenaza interpersonal, pero no oculta el problema, la acción necesaria ni una responsabilidad relevante.",
    sentences: [
      ["Hay dos cifras que necesitamos verificar antes de publicar.", "There are two figures that we need to verify before publishing.", "The issue and next action are concrete without attacking the person."],
      ["Quizá convendría revisar el tono del último párrafo.", "It might be advisable to review the tone of the final paragraph.", "Conditional and quizá soften a specific actionable suggestion."],
      ["La formulación protege a la persona, no al error.", "The wording protects the person, not the error.", "Facework is compatible with factual clarity."],
      ["La pasiva puede ocultar quién asumió la decisión.", "The passive can conceal who made the decision.", "Agent suppression may have ethical and interpretive consequences."],
      ["Ser delicado no significa borrar la responsabilidad.", "Being tactful does not mean erasing responsibility.", "Respect and accountability must remain distinguishable."]
    ]
  },
  {
    slug: "c2-humor-cultural-reference", title: "Humor, Irony, and Cultural Reference", order: 2320, imageKey: "conversation-and-opinion:8",
    summary: "Detect humorous and ironic frames from incongruity, shared knowledge, prosody, and response, then explain or adapt them without inventing certainty.", situation: "interpreting a humorous comment in a team conversation",
    passage: ["Tras tres horas de una reunión improductiva, alguien comenta: «Bueno, hemos batido el récord de eficiencia». La valoración literal es positiva, pero la duración, el resultado y quizá la entonación crean una lectura irónica. La reacción de los demás puede confirmarla, aunque no todos compartan el mismo humor.", "Una referencia cultural añade otra capa: un título, personaje o frase conocida puede activar asociaciones que un nuevo público no posee. Mediarla exige explicar la función —burla, complicidad, crítica— o sustituirla por un recurso equivalente, sin afirmar una intención que el contexto no permite demostrar."],
    questions: [["¿Qué activa la ironía del récord de eficiencia?", "El contraste entre elogio literal y reunión improductiva.", "Una medición oficial de productividad.", "La ausencia total de contexto."], ["¿Qué se hace con una referencia desconocida al mediar?", "Se explica su función o se busca un recurso de efecto comparable.", "Se traduce cada palabra y se presupone el mismo efecto.", "Se elimina siempre cualquier valoración." ]],
    modelSummary: "Humor e ironía nacen de contraste, conocimiento compartido, entonación y respuesta; al mediarlos se conserva su función y se evita atribuir intenciones no demostradas.",
    sentences: [
      ["Sí, una reunión eficientísima.", "Yes, an extremely efficient meeting.", "In context, exaggerated praise can signal irony."],
      ["El elogio literal contrasta con el resultado real.", "The literal praise contrasts with the actual outcome.", "Incongruity supplies evidence for the ironic reading."],
      ["La entonación y la reacción ayudan a interpretar la intención.", "Intonation and the response help interpret the intention.", "Meaning is inferred from several converging cues."],
      ["La referencia crea complicidad solo si el público la reconoce.", "The reference creates rapport only if the audience recognizes it.", "Shared knowledge is part of the rhetorical mechanism."],
      ["Explicar la función es más fiel que traducir solo las palabras.", "Explaining the function is more faithful than translating only the words.", "Mediation aims for pragmatic rather than merely lexical equivalence."]
    ]
  },
  {
    slug: "checkpoint-c2-sociolinguistic-variation", title: "C2.3 Sociolinguistic Variation Checkpoint", order: 2330, imageKey: "rewards-and-progress:14", checkpoint: true,
    summary: "Recognize regional systems, negotiate vocabulary and address, communicate delicate meaning, and mediate irony in one socially coherent interaction.", situation: "facilitating a panhispanic team exchange with different norms and vocabulary",
    passage: ["Durante una reunión, Lucía dice «si querés, lo vemos después» y Marta pregunta qué significa «lo vemos». Otro compañero bromea: «Fantástico, otra expresión que todos entendemos igual». El coordinador no corrige a Lucía: aclara que propone revisar el asunto más tarde y pregunta qué término resultaría más transparente para el grupo.", "Después añade: «Si les parece, mantengamos nuestras formas habituales, pero confirmemos cualquier palabra que pueda cambiar de significado». Así reconoce el voseo, interpreta la ironía como señal de una dificultad real y propone una acomodación recíproca sin exigir una variedad única."],
    questions: [["¿Qué hace bien el coordinador?", "Aclara significado y acuerda una práctica común sin deslegitimar la variedad.", "Presenta el voseo como un error.", "Obliga a todos a utilizar el mismo acento."], ["¿Cómo trata el comentario irónico?", "Reconoce la dificultad comunicativa que señala y responde de forma cooperativa.", "Lo interpreta como elogio literal definitivo.", "Atribuye una intención hostil sin más indicios." ]],
    modelSummary: "El coordinador combina comprensión regional, aclaración neutral e interpretación prudente de la ironía para construir una norma compartida y recíproca.",
    sentences: [
      ["En esta región, querés es una forma habitual.", "In this region, querés is a customary form.", "The explanation identifies distribution without ranking it."],
      ["¿Qué significa esa expresión en este contexto?", "What does that expression mean in this context?", "The question seeks meaning without framing the form as wrong."],
      ["Mantengamos nuestras formas y aclaremos lo que cambie.", "Let us keep our own forms and clarify what differs.", "The proposal balances identity and shared understanding."],
      ["El comentario irónico señala una dificultad real.", "The ironic comment points to a real difficulty.", "Pragmatic interpretation connects humor to the interactional issue."],
      ["Una norma compartida puede construirse sin imponer una variedad única.", "A shared norm can be built without imposing a single variety.", "Reciprocal accommodation is the integrated target."]
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
    { key: "interpret", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "accommodate", type: ExerciseType.DIALOGUE_REPLY, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "mediate", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c2_sociolinguistic_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "c2_sociolinguistic_accommodation", rubric: "Interpret regional and social meaning accurately, then respond respectfully, clearly, and consistently." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Interpret variation and respond appropriately",
    instruction: "Use context, relationship, regional distribution, and communicative effect before choosing your Spanish response.",
    questionText: check.question, answerJson,
    explanation: "Advanced sociolinguistic competence combines receptive breadth, productive consistency, respectful clarification, and pragmatic interpretation.",
    difficulty: 7, order, xpReward: 22, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topicData = {
    title: "Panhispanic and Sociolinguistic Competence",
    description: "Regional grammar and vocabulary, forms of address, social distance, facework, euphemism, humor, irony, cultural reference, and reciprocal accommodation.",
    cefrLevel: "C2", imageKey: "conversation-and-opinion:13"
  };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c2-sociolinguistic-variation" }, update: topicData, create: { slug: "c2-sociolinguistic-variation", ...topicData } });
  const groupSlugs = ["useful-phrases", "essential-words", "a2-reading-listening-lab", "a2-scenario-survival", "c2-rhetoric-variation-vocabulary"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C2.3 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: "reading", title: input.title,
      orientationDe: "Beobachte zuerst Region, Beziehung, Rollen und Gesprächssituation. Trenne dann grammatische Bedeutung, soziale Bedeutung und die konkrete kommunikative Wirkung voneinander.",
      orientationEn: "Observe region, relationship, roles, and interactional setting first. Then separate grammatical meaning, social meaning, and concrete communicative effect.",
      paragraphs: input.passage,
      questions: input.questions.map(([question, answer, distractorOne, distractorTwo]) => ({ questionDe: question, questionEn: question, optionsDe: [answer, distractorOne, distractorTwo], optionsEn: [answer, distractorOne, distractorTwo], correct: 0, explanationDe: "Diese Antwort berücksichtigt regionale Verteilung, soziale Beziehung und Gesprächsfunktion, ohne eine Varietät abzuwerten.", explanationEn: "This answer accounts for regional distribution, social relationship, and interactional function without devaluing a variety." })),
      recallPromptDe: "Erkläre die regionale oder soziale Bedeutung auf Spanisch und formuliere eine respektvolle Reaktion, die gemeinsames Verstehen herstellt.",
      recallPromptEn: "Explain the regional or social meaning in Spanish and formulate a respectful response that establishes shared understanding.",
      modelSummary: input.modelSummary
    };
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "C2",
      theme: input.checkpoint ? "Checkpoint" : "Sociolinguistic Variation", situation: input.situation,
      imageKey: input.imageKey, readingJson,
      outcomesJson: ["You can understand major panhispanic grammatical and lexical variation.", "You can negotiate address and delicate meaning without losing clarity.", "You can interpret humor and accommodate respectfully across varieties."],
      conceptKeys: ["c2", "variation", "register", "politeness", "accommodation"], reviewSummary: input.summary,
      order: input.order, estimatedMinutes: input.checkpoint ? 28 : 22, topicId: topic.id
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
  console.log(`Seeded ${lessons.length} C2.3 sociolinguistic-variation learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
