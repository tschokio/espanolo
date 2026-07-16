const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c2-lexical-precision", title: "Lexical Precision and Collocation", order: 2220, imageKey: "grammar-scenes:15",
    summary: "Choose the word and collocation that match the exact degree, register, and relationship intended instead of relying on a merely possible synonym.", situation: "editing a professional analysis whose vocabulary is correct but imprecise",
    passage: ["Un cambio puede provocar, generar, impulsar o desencadenar una reacción, pero esas combinaciones no presentan la relación del mismo modo. «Desencadenar» sugiere un inicio brusco y una cadena difícil de contener; «impulsar» atribuye una fuerza favorable o deliberada.", "La precisión léxica tampoco consiste en escoger siempre la palabra más rara. En «albergar dudas», el verbo aporta un registro reflexivo que «tener dudas» no necesita; en una conversación cotidiana, la opción sencilla puede ser la más natural."],
    questions: [["¿Qué aporta «desencadenar»?", "Un inicio brusco y una cadena difícil de contener.", "Una valoración necesariamente favorable.", "La ausencia total de consecuencias."], ["¿Cuándo puede ser más precisa una opción sencilla?", "Cuando corresponde mejor al registro y a la relación que se quiere expresar.", "Cuando evita cualquier verbo.", "Solo cuando el texto es muy corto."]],
    modelSummary: "La precisión léxica depende de matiz, colocación y registro: una palabra más marcada solo mejora el texto si expresa exactamente la relación pretendida.",
    sentences: [
      ["La medida desencadenó una reacción inmediata.", "The measure triggered an immediate reaction.", "Desencadenar presents a sudden beginning with subsequent effects."],
      ["El acuerdo impulsó una cooperación más estrecha.", "The agreement fostered closer cooperation.", "Impulsar frames the cause as a favorable driving force."],
      ["Los resultados suscitaron serias dudas.", "The results raised serious doubts.", "Suscitar dudas is a conventional formal collocation."],
      ["La comisión alberga reservas sobre el procedimiento.", "The committee harbors reservations about the procedure.", "Albergar reservas adds reflective institutional register."],
      ["La palabra más compleja no siempre es la más precisa.", "The more complex word is not always the more precise one.", "Precision is fit, not ornamental difficulty."]
    ]
  },
  {
    slug: "c2-idiom-figurative-meaning", title: "Idiom and Figurative Meaning", order: 2230, imageKey: "conversation-and-opinion:12",
    summary: "Interpret and use idioms, metaphors, understatement, and conventional images by their discourse function rather than by translating each word.", situation: "understanding an opinion column whose main evaluation is expressed indirectly",
    passage: ["El editorial afirma que la reforma «nació con buen pie», pero añade que el gobierno «ha dejado demasiados cabos sueltos». Ninguna expresión describe literalmente pies o cuerdas: la primera evalúa positivamente el comienzo; la segunda señala cuestiones pendientes que pueden causar problemas.", "Más adelante, «no es poca cosa» intensifica la importancia mediante una negación aparente. Comprender el texto exige identificar qué actitud cumple cada imagen y decidir si conviene conservarla, explicarla o sustituirla según el público."],
    questions: [["¿Qué significa «dejar cabos sueltos» en el texto?", "Dejar asuntos importantes sin resolver.", "Trabajar con materiales defectuosos.", "Eliminar todas las dificultades."], ["¿Qué efecto produce «no es poca cosa»?", "Intensifica la importancia mediante una formulación atenuada.", "Declara que el asunto carece de valor.", "Introduce una condición jurídica."]],
    modelSummary: "Las expresiones figuradas transmiten evaluaciones y funciones discursivas completas; deben interpretarse por contexto y adaptarse sin perder su actitud.",
    sentences: [
      ["El proyecto nació con buen pie.", "The project got off to a good start.", "The idiom evaluates the beginning positively."],
      ["Quedan varios cabos sueltos.", "Several loose ends remain.", "The image signals unresolved matters rather than physical objects."],
      ["La decisión marcó un antes y un después.", "The decision marked a turning point.", "The conventional image divides two distinct periods."],
      ["Conseguir ese acuerdo no es poca cosa.", "Reaching that agreement is no small achievement.", "Negated understatement creates emphasis."],
      ["Una metáfora se entiende por su función en el contexto.", "A metaphor is understood through its function in context.", "Discourse function guides interpretation and reformulation."]
    ]
  },
  {
    slug: "c2-genre-conventions", title: "Genre and Communicative Conventions", order: 2240, imageKey: "reading-and-listening-lab:15",
    summary: "Reshape the same content as a formal decision, public explanation, analytical note, or personal message while preserving facts and purpose.", situation: "communicating one institutional decision through several genres",
    passage: ["Una resolución administrativa debe identificar la decisión, su fundamento y sus efectos con formulaciones inequívocas: «Se acuerda ampliar el plazo hasta el 30 de septiembre». Una nota pública puede presentar la misma información desde la necesidad del lector: «Habrá un mes adicional para presentar la documentación».", "El dato central no cambia, pero sí el orden, la voz y lo que se hace explícito. Copiar el estilo jurídico en una noticia puede ocultar la información práctica; trasladar el tono promocional a una resolución puede debilitar su precisión y autoridad."],
    questions: [["¿Qué debe conservarse entre las dos versiones?", "La decisión, la nueva fecha y su efecto práctico.", "Exactamente el mismo orden sintáctico.", "Todas las fórmulas jurídicas en la nota pública."], ["¿Por qué cambia el orden de la información?", "Porque cada género responde a una finalidad y a expectativas distintas.", "Porque la fecha deja de ser verdadera.", "Para evitar mencionar la decisión."]],
    modelSummary: "Adaptar un contenido a otra clase de texto cambia orden, voz, explicitud y tono, pero conserva hechos, finalidad y efectos relevantes.",
    sentences: [
      ["Se acuerda ampliar el plazo hasta el 30 de septiembre.", "It is hereby agreed to extend the deadline until September 30.", "The impersonal formula performs a formal institutional decision."],
      ["Habrá un mes adicional para presentar los documentos.", "There will be an additional month to submit the documents.", "The public version foregrounds the reader's practical consequence."],
      ["El análisis distingue la decisión de sus posibles efectos.", "The analysis separates the decision from its possible effects.", "Analytical genre marks evidence and inference separately."],
      ["Te escribo para avisarte de que han ampliado el plazo.", "I am writing to let you know that they have extended the deadline.", "A personal message makes relationship and purpose explicit."],
      ["Cambiar de género no autoriza a cambiar los hechos.", "Changing genre does not authorize changing the facts.", "Genre adaptation preserves the propositional core."]
    ]
  },
  {
    slug: "c2-information-structure", title: "Information Structure and Emphasis", order: 2250, imageKey: "grammar-scenes:14",
    summary: "Control topic, focus, contrast, and emphasis through order, cleft constructions, passives, and explicit reference without creating ambiguity.", situation: "revising a report so the decisive contrast becomes immediately visible",
    passage: ["«El equipo detectó el error el viernes» responde de manera neutra. «Fue el viernes cuando el equipo detectó el error» corrige o destaca el momento; «Fue el equipo quien lo detectó» contrasta a los responsables. Las tres versiones describen el mismo hecho, pero organizan de forma distinta la atención.", "También la posición inicial establece el punto de partida: «En cuanto al coste, todavía faltan datos». La tematización resulta útil si el referente es claro; si se acumulan pronombres o incisos, el énfasis puede convertirse en ambigüedad."],
    questions: [["¿Qué destaca «Fue el viernes cuando…»?", "El momento en que se detectó el error.", "La gravedad exacta del error.", "La identidad de quien escribió el informe."], ["¿Qué riesgo tiene una tematización mal construida?", "Que el referente y el contraste dejen de estar claros.", "Que toda oración se vuelva informal.", "Que desaparezcan necesariamente los verbos."]],
    modelSummary: "El orden y las construcciones focales distribuyen la atención entre tema, contraste y dato nuevo; son útiles solo si mantienen referencias claras.",
    sentences: [
      ["Fue el viernes cuando detectamos el error.", "It was on Friday that we detected the error.", "The cleft focuses and potentially corrects the time."],
      ["Fue Marta quien propuso la alternativa.", "It was Marta who proposed the alternative.", "The focused constituent identifies the contrasted person."],
      ["En cuanto al coste, todavía faltan datos.", "As for the cost, data are still missing.", "The initial frame establishes the topic before the new information."],
      ["Lo decisivo no fue la cifra, sino su interpretación.", "What mattered was not the figure but its interpretation.", "The contrastive frame assigns explicit informational weight."],
      ["El énfasis solo ayuda cuando el referente sigue claro.", "Emphasis helps only when the referent remains clear.", "Salience must not undermine cohesion."]
    ]
  },
  {
    slug: "c2-rhetorical-architecture", title: "Rhetorical Architecture and Style", order: 2260, imageKey: "reading-and-listening-lab:14",
    summary: "Design openings, progression, paragraph rhythm, strategic repetition, and endings so a complex text guides the reader without sounding mechanical.", situation: "turning a collection of correct paragraphs into a coherent persuasive text",
    passage: ["Un texto complejo necesita una arquitectura reconocible, pero no una fila de conectores mecánicos. La apertura plantea el problema y delimita la pregunta; cada párrafo avanza una función distinta —explicar, contrastar, evaluar— y el cierre responde a la pregunta inicial sin fingir una certeza inexistente.", "La repetición también puede ser deliberada. Recuperar «el problema no es la falta de datos, sino su uso» al final crea cohesión y énfasis; repetir la misma fórmula al comienzo de cada frase, en cambio, puede aplanar el ritmo si no cumple una función."],
    questions: [["¿Qué hace un cierre eficaz?", "Responde al problema inicial con el grado de certeza justificado.", "Introduce un tema completamente nuevo.", "Repite literalmente todos los párrafos."], ["¿Cuándo es útil una repetición?", "Cuando recupera una idea central y cumple una función de cohesión o énfasis.", "Siempre que alargue el texto.", "Solo cuando sustituye todos los conectores."]],
    modelSummary: "La arquitectura retórica asigna una función a cada parte, crea progresión y usa repetición y ritmo de manera deliberada para conducir a una conclusión proporcionada.",
    sentences: [
      ["La cuestión no es si debemos actuar, sino cómo hacerlo.", "The question is not whether we should act, but how.", "The opening narrows the problem through contrast."],
      ["Antes de valorar la propuesta, conviene precisar su alcance.", "Before assessing the proposal, its scope should be clarified.", "The sentence announces a justified stage in the progression."],
      ["Ese límite permite entender el segundo problema.", "That limitation makes it possible to understand the second problem.", "Backward reference turns the previous result into the next starting point."],
      ["Volvamos, por tanto, a la pregunta inicial.", "Let us therefore return to the initial question.", "The transition signals closure and restores the controlling frame."],
      ["La conclusión debe cerrar el recorrido, no borrar sus matices.", "The conclusion should complete the line of reasoning, not erase its nuances.", "Closure integrates rather than flattens the argument."]
    ]
  },
  {
    slug: "checkpoint-c2-genre-rhetoric", title: "C2.2 Genre and Rhetorical Control Checkpoint", order: 2270, imageKey: "rewards-and-progress:15", checkpoint: true,
    summary: "Choose precise lexis, interpret figurative meaning, adapt genre, control focus, and construct a coherent rhetorical progression in one integrated task.", situation: "rewriting an expert assessment as a concise public statement with deliberate emphasis",
    passage: ["El informe sostiene que el programa «abrió una puerta importante», aunque advierte de que su aplicación dejó cabos sueltos. La evaluación no propone abandonarlo: recomienda delimitar responsabilidades y publicar criterios verificables antes de ampliarlo.", "Una nota pública eficaz podría abrir con la consecuencia: «El programa continuará, pero su ampliación dependerá de reglas más claras». Después explicaría los avances y las condiciones; al final recuperaría la idea central: continuar no significa avanzar sin límites, sino convertir una primera oportunidad en un procedimiento fiable."],
    questions: [["¿Qué significa «abrió una puerta importante»?", "Creó una oportunidad relevante.", "Obligó a cerrar el programa.", "Eliminó la necesidad de condiciones."], ["¿Qué organiza la versión pública en primer lugar?", "La decisión práctica y su condición principal.", "Todas las referencias metodológicas.", "Una descripción literal de una puerta." ]],
    modelSummary: "La versión pública presenta primero la continuidad condicionada, explica después avances y límites y cierra reformulando la oportunidad como responsabilidad verificable.",
    sentences: [
      ["El programa abrió una oportunidad importante.", "The program opened up an important opportunity.", "The accessible reformulation keeps the metaphor's positive evaluation."],
      ["Su aplicación dejó varios asuntos sin resolver.", "Its implementation left several issues unresolved.", "The explicit version preserves the function of cabos sueltos."],
      ["Lo prioritario es delimitar las responsabilidades.", "The priority is to define responsibilities clearly.", "The focus construction foregrounds the required action."],
      ["El programa continuará, pero su ampliación tendrá condiciones.", "The program will continue, but its expansion will be conditional.", "The public opening presents decision and decisive limit together."],
      ["Continuar no significa avanzar sin límites.", "Continuing does not mean moving forward without limits.", "The ending returns to the central contrast in a memorable form."]
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
    { key: "distinguish", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "reshape", type: ExerciseType.TRANSFORMATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "compose", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c2_genre_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "c2_genre_rhetoric", rubric: "Preserve meaning while controlling lexical nuance, genre, focus, cohesion, and rhetorical effect." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Control expression as well as factual meaning",
    instruction: "Choose the Spanish form that fits the intended nuance, genre, informational focus, and rhetorical function.",
    questionText: check.question, answerJson,
    explanation: "C2 control links every lexical and structural choice to audience, genre, information flow, and intended effect.",
    difficulty: 7, order, xpReward: 22, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topicData = {
    title: "Genre, Lexis, and Rhetorical Control",
    description: "Lexical precision, collocation, figurative meaning, genre conventions, information structure, rhetorical progression, and deliberate style.",
    cefrLevel: "C2", imageKey: "reading-and-listening-lab:15"
  };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c2-genre-rhetoric" }, update: topicData, create: { slug: "c2-genre-rhetoric", ...topicData } });
  const groupSlugs = ["useful-phrases", "essential-words", "a2-reading-listening-lab", "a2-scenario-survival", "c2-rhetoric-variation-vocabulary"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C2.2 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: "reading", title: input.title,
      orientationDe: "Bestimme zuerst Aussage, Textsorte, Adressat und beabsichtigte Wirkung. Beobachte dann, wie Wortwahl, Reihenfolge, Bildsprache und Aufbau diese Wirkung erzeugen.",
      orientationEn: "Identify claim, genre, audience, and intended effect first. Then observe how lexis, order, figurative language, and structure create that effect.",
      paragraphs: input.passage,
      questions: input.questions.map(([question, answer, distractorOne, distractorTwo]) => ({ questionDe: question, questionEn: question, optionsDe: [answer, distractorOne, distractorTwo], optionsEn: [answer, distractorOne, distractorTwo], correct: 0, explanationDe: "Diese Antwort verbindet die Form mit ihrer Bedeutung und kommunikativen Funktion.", explanationEn: "This answer links the form to its meaning and communicative function." })),
      recallPromptDe: "Fasse die Kernaussage auf Spanisch zusammen und nenne dabei auch, welche sprachliche Entscheidung die Wirkung des Textes steuert.",
      recallPromptEn: "Summarize the main point in Spanish and include the linguistic choice that controls the text's effect.",
      modelSummary: input.modelSummary
    };
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "C2",
      theme: input.checkpoint ? "Checkpoint" : "Genre and Rhetorical Control", situation: input.situation,
      imageKey: input.imageKey, readingJson,
      outcomesJson: ["You can choose precise collocations and interpret figurative language.", "You can adapt content to genre and audience without changing facts.", "You can control focus, cohesion, progression, rhythm, and rhetorical effect."],
      conceptKeys: ["c2", "lexis", "genre", "focus", "rhetoric"], reviewSummary: input.summary,
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
  console.log(`Seeded ${lessons.length} C2.2 genre-and-rhetoric learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
