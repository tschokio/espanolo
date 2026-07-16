const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c1-relative-reference", title: "Choose Mood from Reference", order: 2040, imageKey: "grammar-scenes:15",
    summary: "Use indicative for an identified or asserted referent and subjunctive for a sought, denied, hypothetical, or not-yet-identified one.", situation: "describing what exists and what still needs to be found",
    passage: ["Tenemos una traductora que conoce bien el sector jurídico, pero necesitamos a alguien que pueda trabajar también con textos médicos. No buscamos una persona que traduzca palabra por palabra, sino alguien que adapte el registro sin alterar el sentido.", "La primera traductora es una persona concreta y conocida; por eso aparece conoce. Las demás expresiones no identifican todavía a una persona real y disponible, sino que definen el perfil buscado; por eso aparecen pueda, traduzca y adapte."],
    questions: [["¿Por qué aparece «conoce» en indicativo?", "Porque se afirma una cualidad de una traductora concreta.", "Porque toda oración relativa exige indicativo.", "Porque el sector jurídico es hipotético."], ["¿Qué expresa «alguien que pueda»?", "Un perfil necesario cuya persona todavía no está identificada.", "Una empleada concreta que ya ha aceptado.", "Una negación de cualquier capacidad médica."]],
    modelSummary: "El texto distingue una traductora conocida, descrita con indicativo, de un perfil todavía buscado, definido mediante relativas en subjuntivo.",
    sentences: [
      ["Conozco a una médica que habla alemán.", "I know a doctor who speaks German.", "The speaker identifies a real person and asserts the quality as information."],
      ["Busco a una médica que hable alemán.", "I am looking for a doctor who speaks German.", "The required quality defines a person who has not yet been identified."],
      ["No hay ninguna solución que elimine todos los riesgos.", "There is no solution that eliminates all risks.", "Negated existence makes the relative referent unavailable rather than asserted."],
      ["Elige el método que te resulte más claro.", "Choose whichever method seems clearest to you.", "The listener will determine the still-open referent through the choice."],
      ["Necesitamos algo que podamos aplicar desde mañana.", "We need something that we can apply starting tomorrow.", "The clause specifies a desired but not yet selected option."]
    ]
  },
  {
    slug: "c1-future-time-clauses", title: "Anchor Time before Choosing Mood", order: 2050, imageKey: "past-events:13",
    summary: "Contrast completed or habitual time clauses with anticipated events whose occurrence frames a future action.", situation: "coordinating actions across past, habitual, and future timelines",
    passage: ["Cuando recibimos la confirmación ayer, avisamos a todo el equipo. Normalmente empezamos en cuanto llega la coordinadora. Mañana, en cambio, no entraremos en la sala hasta que hayan terminado las pruebas técnicas.", "Recibimos presents a completed event and llega a habitual fact. Hayan terminado refers to a future boundary that must become real before the main action can occur, so the time clause uses subjunctive."],
    questions: [["¿Por qué «recibimos» está en indicativo?", "Porque presenta un hecho completado ayer.", "Porque cuando nunca admite subjuntivo.", "Porque la confirmación todavía es incierta."], ["¿Qué relación expresa «hasta que hayan terminado»?", "Una condición temporal futura previa a la entrada.", "Una costumbre que ocurre todos los días.", "Un hecho anterior ya confirmado." ]],
    modelSummary: "El indicativo presenta un hecho pasado y una rutina, mientras que el subjuntivo marca el límite futuro que debe cumplirse antes de entrar.",
    sentences: [
      ["Cuando terminó la reunión, enviamos el resumen.", "When the meeting ended, we sent the summary.", "The time clause reports a completed event on an established past timeline."],
      ["Cuando termine la reunión, enviaremos el resumen.", "When the meeting ends, we will send the summary.", "The future main action waits for a not-yet-realized time boundary."],
      ["Siempre me llama en cuanto llega a casa.", "She always calls me as soon as she gets home.", "A repeated routine is presented as known experience."],
      ["No firmaremos nada hasta que lo haya revisado la abogada.", "We will not sign anything until the lawyer has reviewed it.", "The perfect subjunctive presents a future action that must be complete first."],
      ["Avísame antes de que empiece la presentación.", "Let me know before the presentation begins.", "Antes de que frames an anticipated event from the earlier action's viewpoint."]
    ]
  },
  {
    slug: "c1-concession-certainty", title: "Separate Fact from Concession", order: 2060, imageKey: "conversation-and-opinion:13",
    summary: "Use mood to show whether a conceded obstacle is asserted as fact, entertained as a possibility, or deliberately treated as irrelevant.", situation: "maintaining a decision while calibrating the status of an obstacle",
    passage: ["Aunque el presupuesto es limitado, el proyecto ya cuenta con financiación suficiente para empezar. La segunda fase se mantendrá aunque surjan gastos imprevistos, siempre que no comprometan la seguridad.", "Es limitado presents an accepted fact. Surjan does not deny that extra costs are possible; it presents any such costs as an open circumstance that will not by itself change the decision. No comprometan states the condition that still limits that concession."],
    questions: [["¿Qué comunica «aunque el presupuesto es limitado»?", "Que la limitación se acepta como un hecho real.", "Que nadie sabe si existe un presupuesto.", "Que el proyecto depende de negar la limitación."], ["¿Por qué aparece «surjan»?", "Porque abarca posibles gastos todavía no identificados.", "Porque aunque siempre exige subjuntivo.", "Porque los gastos ya se registraron ayer." ]],
    modelSummary: "El texto concede con indicativo una limitación conocida y usa subjuntivo para posibles gastos futuros que no cambiarían la decisión salvo que afectaran a la seguridad.",
    sentences: [
      ["Aunque está cansada, terminará el informe.", "Although she is tired, she will finish the report.", "Indicative presents the tiredness as accepted information."],
      ["Aunque esté cansada, terminará el informe.", "Even if she is tired, she will finish the report.", "Subjunctive treats the obstacle as possible or irrelevant to the outcome."],
      ["Por muy convincente que parezca, el argumento necesita pruebas.", "However convincing it may seem, the argument needs evidence.", "The concessive frame neutralizes any degree of the quality."],
      ["Digan lo que digan, mantendremos el criterio acordado.", "Whatever they may say, we will maintain the agreed criterion.", "The repeated subjunctive frame covers any possible content without asserting it."],
      ["Aun cuando hubiera dificultades, la medida seguiría siendo necesaria.", "Even if there were difficulties, the measure would still be necessary.", "Past subjunctive aligns a hypothetical concession with a conditional result."]
    ]
  },
  {
    slug: "c1-purpose-prevention", title: "Link Purpose, Prevention, and Subject", order: 2070, imageKey: "grammar-scenes:11",
    summary: "Choose infinitive or que plus subjunctive by subject continuity, and express intended results, avoided outcomes, and prior safeguards precisely.", situation: "designing instructions that distinguish who performs each action",
    passage: ["El equipo simplificó el formulario para reducir los errores. También añadió ejemplos para que los usuarios entendieran cada apartado y una confirmación final a fin de que nadie enviara datos incompletos. Antes de que se publicara la nueva versión, otro grupo la probó sin que los diseñadores intervinieran.", "Para reducir keeps the same acting subject: the team simplifies and thereby reduces. Para que, a fin de que, antes de que and sin que introduce actions or situations with a different or explicit subject, so they use subjunctive."],
    questions: [["¿Por qué se usa infinitivo en «para reducir»?", "Porque el mismo equipo realiza la acción principal y persigue el resultado.", "Porque reducir nunca puede conjugarse.", "Porque los usuarios son el sujeto de ambas acciones."], ["¿Qué muestra «sin que los diseñadores intervinieran»?", "Que la prueba ocurrió sin la intervención de otro sujeto.", "Que los diseñadores realizaron la prueba solos.", "Que la intervención era el objetivo principal." ]],
    modelSummary: "El texto usa infinitivo cuando se mantiene el sujeto y que más subjuntivo cuando propósito, prevención o circunstancia corresponden a otro sujeto.",
    sentences: [
      ["Reescribí el párrafo para hacerlo más claro.", "I rewrote the paragraph to make it clearer.", "One subject performs both the main action and the intended result, so Spanish uses an infinitive."],
      ["Reescribí el párrafo para que todos lo entendieran.", "I rewrote the paragraph so that everyone would understand it.", "A different subject performs the intended result, requiring que plus subjunctive."],
      ["Guarda una copia por si surge algún problema.", "Keep a copy in case a problem arises.", "Por si normally takes indicative even though the precaution addresses a possibility."],
      ["Cerraron la puerta para evitar que entrara ruido.", "They closed the door to prevent noise from coming in.", "Evitar que frames the prevented event and its own subject with subjunctive."],
      ["Lo revisaremos antes de que se tome una decisión definitiva.", "We will review it before a final decision is made.", "The safeguard is earlier than a separately framed anticipated event."]
    ]
  },
  {
    slug: "c1-open-contingency", title: "Express Open Contingency", order: 2080, imageKey: "travel-and-directions:15",
    summary: "Use subjunctive in open-ended place, manner, person, and choice clauses when the exact realization remains undetermined.", situation: "giving flexible instructions that remain valid across unknown circumstances",
    passage: ["Quien necesite ayuda podrá pedirla donde le resulte más cómodo, ya sea por teléfono o mediante la plataforma. Como quiera que se presente la solicitud, deberá incluir un número de contacto. El equipo responderá a lo que plantee cada persona sin imponer una única vía.", "Quien, donde, como and lo que do not refer here to already identified people, places, methods, or content. The subjunctive keeps each reference open while the main instruction applies to every possible realization."],
    questions: [["¿Qué comparten «quien necesite» y «donde le resulte»?", "Sus referentes concretos quedan abiertos y serán determinados después.", "Describen personas y lugares ya identificados.", "Niegan que alguien pueda pedir ayuda."], ["¿Qué efecto produce el subjuntivo en estas estructuras?", "Hace que la regla abarque distintas posibilidades no especificadas.", "Convierte las instrucciones en hechos pasados.", "Limita la ayuda a una sola vía conocida." ]],
    modelSummary: "Las formas en subjuntivo dejan abiertas persona, lugar, método y contenido para que una misma regla cubra cualquier posibilidad pertinente.",
    sentences: [
      ["Quien tenga alguna duda puede escribirme.", "Anyone who has a question can write to me.", "The free relative covers any not-yet-identified person who meets the condition."],
      ["Puedes sentarte donde prefieras.", "You can sit wherever you prefer.", "The place remains open for the listener to determine."],
      ["Hazlo como consideres más adecuado.", "Do it however you consider most appropriate.", "The manner is intentionally left to the listener's judgment."],
      ["Sea cual sea el resultado, lo analizaremos con calma.", "Whatever the result may be, we will analyze it calmly.", "The fixed concessive frame covers every possible result while withholding commitment to one."],
      ["Responderemos a cualquier problema que pueda surgir.", "We will respond to any problem that may arise.", "The relative clause keeps future problems possible and non-specific."]
    ]
  },
  {
    slug: "checkpoint-c1-mood-meaning", title: "C1.5 Mood and Meaning Checkpoint", order: 2090, imageKey: "rewards-and-progress:12", checkpoint: true,
    summary: "Choose mood from reference, timeline, certainty, subject relationship, and open contingency across a connected policy text.", situation: "explaining a flexible procedure with known facts and unresolved future cases",
    passage: ["La oficina dispone de un equipo que atiende consultas urgentes. Quien necesite apoyo fuera del horario habitual deberá dejar un mensaje para que la persona de guardia pueda responder cuando lo reciba. Aunque el sistema funciona con normalidad, se conservará una copia por si ocurre alguna incidencia.", "No se cerrará ningún caso hasta que el usuario haya confirmado la solución. Si surge una situación que no esté prevista en el protocolo, el responsable elegirá la medida que considere más segura, sea cual sea el canal por el que haya llegado la consulta."],
    questions: [["¿Qué contraste explica «atiende» frente a «necesite»?", "El primero describe un equipo real; el segundo abarca a cualquier persona futura.", "El primero expresa duda y el segundo una persona conocida.", "Ambos se refieren únicamente al pasado."], ["¿Qué organiza el subjuntivo a lo largo del texto?", "Propósitos, límites futuros y casos todavía abiertos o no identificados.", "Solo hechos habituales ya comprobados.", "Una lista de acciones imposibles." ]],
    modelSummary: "El texto combina indicativo para hechos y recursos existentes con subjuntivo para destinatarios abiertos, propósitos, límites futuros y casos aún no previstos.",
    sentences: [
      ["Hay un equipo que atiende las consultas urgentes.", "There is a team that handles urgent inquiries.", "The indicative asserts the existence and established function of a known team."],
      ["Quien necesite ayuda deberá dejar un mensaje.", "Anyone who needs help will have to leave a message.", "The person remains unidentified and the rule applies to any matching future case."],
      ["Responderán cuando hayan recibido toda la información.", "They will respond when they have received all the information.", "The perfect subjunctive marks the completion required before a future response."],
      ["Buscaremos una medida que no esté prevista en el protocolo.", "We will look for a measure that is not provided for in the protocol.", "The desired measure is not yet identified within the existing set."],
      ["Sea cual sea el caso, confirmaremos primero los datos.", "Whatever the case may be, we will first confirm the information.", "Open concession makes the procedure valid across every possible case."]
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
    { key: "contrast", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "reframe", type: ExerciseType.TRANSFORMATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "produce", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c1_mood_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "c1_mood_meaning", rubric: "Preserve reference status, timeline, certainty, subject relationship, and intended clause connection." };
  const data = {
    lessonId: lesson.id,
    topicId: lesson.topicId,
    type: check.type,
    prompt: "Choose mood from the meaning of the whole clause",
    instruction: "Decide first whether the referent or event is asserted, completed, habitual, anticipated, denied, sought, or deliberately left open.",
    questionText: check.question,
    answerJson,
    explanation: "Spanish mood follows how the speaker presents the referent or event, not a mechanical translation of one connector.",
    difficulty: 6,
    order,
    xpReward: 20,
    imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) {
    await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
  }
}

async function main() {
  const topicData = {
    title: "Mood and Meaning in Complex Clauses",
    description: "Indicative and subjunctive choices based on reference, timeline, certainty, purpose, subject relationship, and open contingency.",
    cefrLevel: "C1",
    imageKey: "grammar-scenes:15"
  };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c1-mood-meaning" }, update: topicData, create: { slug: "c1-mood-meaning", ...topicData } });
  const groupSlugs = ["useful-phrases", "essential-words", "a2-reading-listening-lab", "a2-scenario-survival", "c1-register-argument"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C1.5 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: "reading",
      title: input.title,
      orientationDe: "Bestimme vor der Formwahl: Ist Person, Sache oder Ereignis konkret und behauptet – oder gesucht, verneint, zukünftig, möglich beziehungsweise bewusst offengelassen?",
      orientationEn: "Before choosing the form, decide whether the person, thing, or event is identified and asserted, or sought, denied, future, possible, or deliberately left open.",
      paragraphs: input.passage,
      questions: input.questions.map(([question, answer, distractorOne, distractorTwo]) => ({
        questionDe: question,
        questionEn: question,
        optionsDe: [answer, distractorOne, distractorTwo],
        optionsEn: [answer, distractorOne, distractorTwo],
        correct: 0,
        explanationDe: "Die Moduswahl folgt hier dem Status der Information im Gesamtzusammenhang, nicht allein dem einleitenden Wort.",
        explanationEn: "The mood choice follows the information status in the full context, not the introductory word alone."
      })),
      recallPromptDe: "Erkläre den entscheidenden Bedeutungsunterschied und formuliere einen passenden spanischen Kontrastsatz.",
      recallPromptEn: "Explain the decisive meaning contrast and produce a matching Spanish contrast sentence.",
      modelSummary: input.modelSummary
    };
    const common = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "C1",
      theme: input.checkpoint ? "Checkpoint" : "Mood and Meaning",
      situation: input.situation,
      imageKey: input.imageKey,
      readingJson,
      outcomesJson: [
        "You can choose mood from whether a referent is known, sought, denied, or open.",
        "You can distinguish realized time and fact from anticipated or hypothetical circumstances.",
        "You can connect purpose, prevention, and contingency with the correct subject relationship."
      ],
      conceptKeys: ["c1", "indicative", "subjunctive", "reference", "contingency"],
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
    await prisma.exercise.deleteMany({
      where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] }
    });
  }
  console.log(`Seeded ${lessons.length} C1.5 mood-and-meaning learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
