const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c1-implicit-meaning", title: "Infer Intended Meaning", order: 1980, imageKey: "conversation-and-opinion:11",
    summary: "Infer requests, refusals, criticism, and agreement that speakers communicate without stating them directly.", situation: "understanding what a speaker intends beyond the literal words",
    passage: ["—¿Te importaría cerrar la ventana? Empieza a hacer frío. —Claro. Pensé que querías ventilar un poco más.", "La primera pregunta no solicita información sobre si cerrar la ventana resulta molesto: funciona como una petición cortés. La respuesta muestra que el segundo hablante reconoce esa intención y explica su interpretación anterior."],
    questions: [["¿Qué pretende la primera persona?", "Pedir cortésmente que cierren la ventana.", "Preguntar si la ventana está rota.", "Afirmar que quiere seguir ventilando."], ["¿Qué revela la respuesta del segundo hablante?", "Que había interpretado de otra manera la situación.", "Que se niega a cerrar la ventana.", "Que no ha oído la petición."]],
    modelSummary: "La pregunta funciona como una petición indirecta para cerrar la ventana, y la respuesta aclara por qué el interlocutor no lo había hecho antes.",
    sentences: [
      ["¿Te importaría bajar un poco la música?", "Would you mind turning the music down a little?", "The literal question about willingness conventionally performs a polite request."],
      ["No sé si este es el mejor momento para decidirlo.", "I am not sure this is the best time to decide it.", "The uncertainty can function as an indirect recommendation to postpone the decision."],
      ["La propuesta es interesante, aunque necesitaría algunos ajustes.", "The proposal is interesting, although it would need some adjustments.", "The initial praise softens criticism without removing it."],
      ["Mañana tengo que madrugar.", "I have to get up early tomorrow.", "In context, a statement can imply that the speaker wants to leave or end an activity."],
      ["Entiendo que prefieres dejarlo para otro día.", "I take it that you would prefer to leave it for another day.", "The listener checks an inferred intention instead of treating it as certain."]
    ]
  },
  {
    slug: "c1-diplomatic-softening", title: "Soften without Becoming Vague", order: 1990, imageKey: "conversation-and-opinion:16",
    summary: "Disagree, request change, and raise problems diplomatically while keeping the required action unmistakably clear.", situation: "giving sensitive professional feedback without hiding the message",
    passage: ["—El informe está prácticamente terminado. —La estructura se entiende bien. Quizá convendría justificar mejor la segunda conclusión antes de enviarlo.", "La respuesta protege la relación mediante una valoración concreta y quizá convendría, pero también identifica con precisión qué debe cambiar y cuándo: la justificación tiene que revisarse antes del envío."],
    questions: [["¿Qué cambio solicita la segunda persona?", "Justificar mejor la segunda conclusión.", "Eliminar por completo la estructura.", "Enviar el informe sin revisarlo."], ["¿Por qué la respuesta sigue siendo clara?", "Porque nombra el problema y el momento límite pese a suavizar el tono.", "Porque evita mencionar cualquier acción.", "Porque convierte la crítica en una pregunta sin contexto."]],
    modelSummary: "El hablante reconoce una fortaleza del informe y pide diplomáticamente una revisión concreta antes de enviarlo.",
    sentences: [
      ["Quizá convendría revisar esta cifra antes de publicar el informe.", "It might be advisable to review this figure before publishing the report.", "Quizá and the conditional soften the proposal while the required review remains explicit."],
      ["No estoy del todo convencida de que esa solución sea sostenible.", "I am not entirely convinced that this solution is sustainable.", "Partial qualification makes disagreement measured rather than evasive."],
      ["¿Podríamos precisar qué recursos necesitaría el equipo?", "Could we clarify what resources the team would need?", "The inclusive question invites cooperation around a specific gap."],
      ["Entiendo la urgencia; aun así, necesitaríamos un día más.", "I understand the urgency; even so, we would need one more day.", "Acknowledgment precedes a clear boundary and concrete request."],
      ["Se lo comento porque podría afectar al resultado final.", "I mention it because it could affect the final result.", "Giving the reason frames criticism as useful information rather than attack."]
    ]
  },
  {
    slug: "c1-turn-management", title: "Manage Turns Naturally", order: 2000, imageKey: "conversation-and-opinion:12",
    summary: "Enter, hold, connect, and yield a speaking turn without sounding abrupt or losing the thread of a group conversation.", situation: "participating actively in a fast multi-speaker discussion",
    passage: ["—La campaña debería centrarse en el precio. —Si me permites añadir algo, el precio importa, pero los datos de la encuesta señalan otra dificultad. —¿Te refieres a la confianza? —Exacto. Termino esta idea y te cedo la palabra.", "El segundo hablante entra señalando que quiere añadir, conecta su aporte con la intervención anterior y mantiene brevemente el turno. Después reconoce la contribución del tercero y anuncia de forma explícita que le devolverá la palabra."],
    questions: [["¿Cómo entra el segundo hablante en la conversación?", "Pide espacio para añadir una idea conectada con lo anterior.", "Interrumpe y cambia de tema sin señal alguna.", "Espera a que termine la reunión."], ["¿Qué función cumple «te cedo la palabra»?", "Indicar que otro participante puede continuar.", "Rechazar la pregunta anterior.", "Cerrar definitivamente la conversación."]],
    modelSummary: "El hablante entra con cortesía, relaciona su aporte con el tema, mantiene el turno para completar la idea y luego lo cede explícitamente.",
    sentences: [
      ["Si me permites añadir algo, hay otro factor que deberíamos considerar.", "If I may add something, there is another factor we should consider.", "The preface claims a turn politely and signals a relevant addition."],
      ["Retomando lo que decía Ana, el problema no es solo económico.", "Returning to what Ana was saying, the problem is not only economic.", "The reference connects a new contribution to the shared conversational thread."],
      ["Déjame terminar esta idea y enseguida te escucho.", "Let me finish this thought and I will listen to you right away.", "The speaker holds the turn while recognizing the other person's right to speak."],
      ["Perdona que te interrumpa: ¿esa cifra incluye los gastos?", "Sorry to interrupt: does that figure include the expenses?", "A brief interruption is marked and justified by an immediately relevant clarification."],
      ["No tengo nada más que añadir; adelante, Marta.", "I have nothing else to add; go ahead, Marta.", "The speaker closes the contribution and allocates the next turn clearly."]
    ]
  },
  {
    slug: "c1-conversation-repair", title: "Repair Misunderstandings", order: 2010, imageKey: "conversation-and-opinion:9",
    summary: "Detect a misunderstanding, locate its source, reformulate the intended meaning, and confirm shared understanding.", situation: "recovering smoothly when two speakers interpret the same words differently",
    passage: ["—Entonces cancelamos la prueba del jueves. —No exactamente. Quería decir que aplazáramos la decisión sobre la prueba, no la prueba misma. —Ah, de acuerdo: mantenemos el jueves y decidimos mañana si habrá cambios. —Eso es.", "La reparación empieza con no exactamente, identifica qué elemento se interpretó mal y sustituye la formulación ambigua por un contraste explícito. El otro hablante reformula el acuerdo y obtiene confirmación."],
    questions: [["¿Qué se había entendido incorrectamente?", "Que la prueba del jueves ya estaba cancelada.", "Que la decisión se tomaría el jueves.", "Que nunca se había previsto una prueba."], ["¿Cómo comprueban que la reparación ha funcionado?", "El interlocutor resume el acuerdo y recibe confirmación.", "Ambos cambian de tema inmediatamente.", "Repiten exactamente la frase ambigua."]],
    modelSummary: "Una persona corrige la interpretación, distingue aplazar la decisión de cancelar la prueba y confirma la nueva comprensión mediante un resumen.",
    sentences: [
      ["No exactamente; me refería al plazo, no al presupuesto.", "Not exactly; I was referring to the deadline, not the budget.", "The contrast isolates the specific source of the misunderstanding."],
      ["Déjame expresarlo de otra manera.", "Let me put it another way.", "The phrase openly signals self-repair before reformulation."],
      ["Cuando dices que lo revisemos, ¿incluyes también los anexos?", "When you say that we should review it, do you also include the appendices?", "The listener identifies the uncertain scope instead of guessing."],
      ["A ver si te he entendido bien: propones mantener la fecha.", "Let me see if I have understood you correctly: you propose keeping the date.", "A candidate understanding gives the other speaker something precise to confirm or correct."],
      ["Eso es; ahora estamos hablando de lo mismo.", "That is it; now we are talking about the same thing.", "Explicit confirmation closes the repair sequence and restores common ground."]
    ]
  },
  {
    slug: "c1-tone-stance", title: "Read Tone and Stance", order: 2020, imageKey: "reading-and-listening-lab:12",
    summary: "Use context, contrast, exaggeration, and prosody cues to distinguish sincere praise, reservation, frustration, and irony.", situation: "interpreting a reaction whose real stance is carried by context and tone",
    passage: ["El equipo recibió el programa definitivo apenas una hora antes del acto. Al verlo, Julia comentó: «Qué bien, otra oportunidad para improvisar». Nadie respondió con entusiasmo; Carlos suspiró y abrió de nuevo sus notas.", "Aislada, qué bien podría expresar alegría. Sin embargo, otra oportunidad para improvisar, la entrega tardía y las reacciones del grupo indican que Julia critica la falta de planificación mediante ironía."],
    questions: [["¿Qué actitud expresa Julia realmente?", "Frustración por la falta de planificación.", "Entusiasmo por actuar sin preparación.", "Indiferencia ante el programa."], ["¿Qué permite reconocer la ironía?", "El contraste entre las palabras positivas y el contexto negativo.", "La presencia de una fecha exacta.", "La ausencia total de reacción del grupo."]],
    modelSummary: "Aunque Julia usa palabras aparentemente positivas, el contexto y las reacciones muestran que critica irónicamente la entrega tardía del programa.",
    sentences: [
      ["Qué detalle avisarnos cuando ya no podemos cambiar nada.", "How thoughtful to tell us when we can no longer change anything.", "The positive formula conflicts with the harmful timing and therefore signals irony."],
      ["No diría que salió mal, pero desde luego no salió como esperábamos.", "I would not say it went badly, but it certainly did not go as we expected.", "The correction conveys a reserved negative evaluation without an absolute judgment."],
      ["Por fin una propuesta que responde al problema real.", "At last, a proposal that addresses the real problem.", "Por fin can convey relief and contrast with earlier dissatisfaction."],
      ["Está bien, supongo.", "It is fine, I suppose.", "The trailing qualification can weaken what would otherwise sound like clear approval."],
      ["Lo dijo en broma, pero la crítica era evidente.", "She said it as a joke, but the criticism was obvious.", "Humorous form and critical stance can coexist and must be interpreted separately."]
    ]
  },
  {
    slug: "checkpoint-c1-pragmatic-interaction", title: "C1.4 Pragmatic Interaction Checkpoint", order: 2030, imageKey: "rewards-and-progress:15", checkpoint: true,
    summary: "Infer intention, respond diplomatically, manage turns, repair meaning, and interpret stance in a demanding group exchange.", situation: "keeping a sensitive meeting clear, cooperative, and pragmatically accurate",
    passage: ["—Veo que el calendario vuelve a ser bastante optimista. —Entiendo tu preocupación. Quizá podríamos revisar primero las dos fechas más ajustadas. —Perdona que te interrumpa: ¿hablas de las entregas o de las reuniones? —De las entregas. Me expresé mal. A ver si estamos de acuerdo: hoy identificamos los riesgos y mañana fijamos nuevas fechas.", "La primera intervención critica indirectamente el calendario. La respuesta reconoce la preocupación y convierte la crítica en una propuesta concreta. Una pregunta repara la ambigüedad, el hablante se corrige y finalmente formula un resumen que todos pueden confirmar."],
    questions: [["¿Qué secuencia comunicativa desarrolla el diálogo?", "Crítica indirecta, propuesta diplomática, aclaración y confirmación.", "Elogio literal, rechazo, cambio de tema y despedida.", "Orden directa, aceptación inmediata y silencio."], ["¿Por qué resulta eficaz el resumen final?", "Convierte la comprensión compartida en dos acciones y momentos concretos.", "Mantiene deliberadamente la ambigüedad sobre las fechas.", "Evita responder a la pregunta sobre las entregas."]],
    modelSummary: "Los participantes interpretan una crítica indirecta, proponen una revisión, reparan una ambigüedad y cierran con un acuerdo concreto sobre los siguientes pasos.",
    sentences: [
      ["Entiendo que el calendario te parece poco realista.", "I take it that the schedule seems unrealistic to you.", "The listener makes an inferred criticism explicit but still open to correction."],
      ["Quizá podríamos empezar por las fechas que presentan más riesgo.", "Perhaps we could start with the dates that present the greatest risk.", "The softened inclusive proposal turns concern into a concrete next step."],
      ["Perdona que te interrumpa: ¿te refieres a las entregas?", "Sorry to interrupt: are you referring to the deliveries?", "A justified interruption prevents the conversation from building on an ambiguous reference."],
      ["Me expresé mal; quería distinguir las entregas de las reuniones.", "I expressed myself badly; I wanted to distinguish the deliveries from the meetings.", "The speaker takes responsibility and supplies the intended contrast."],
      ["A ver si estamos de acuerdo: hoy evaluamos y mañana decidimos.", "Let us see whether we agree: today we evaluate and tomorrow we decide.", "The final formulation checks common ground through a concise action summary."]
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
    { key: "repair", type: ExerciseType.TRANSFORMATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "respond", type: ExerciseType.DIALOGUE_REPLY, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c1_pragmatic_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "c1_pragmatic_interaction", rubric: "Preserve intended meaning, relationship, turn function, repair target, and degree of certainty." };
  const data = {
    lessonId: lesson.id,
    topicId: lesson.topicId,
    type: check.type,
    prompt: "Interpret intention and keep the interaction cooperative",
    instruction: "Use context to identify the intended action, relationship signal, turn function, and stance before you respond in Spanish.",
    questionText: check.question,
    answerJson,
    explanation: "Effective C1 interaction connects literal form with intended action, protects the relationship, and makes shared understanding easy to verify.",
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
    title: "Pragmatics and Spoken Interaction",
    description: "Implicit meaning, diplomatic clarity, turn management, conversational repair, tone, stance, and shared understanding.",
    cefrLevel: "C1",
    imageKey: "conversation-and-opinion:11"
  };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c1-pragmatic-interaction" }, update: topicData, create: { slug: "c1-pragmatic-interaction", ...topicData } });
  const groupSlugs = ["useful-phrases", "a2-reading-listening-lab", "essential-words", "a2-scenario-survival", "c1-narrative-interaction"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C1.4 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: "reading",
      title: input.title,
      orientationDe: "Lies zuerst die Situation und den Dialog. Unterscheide dann wörtliche Aussage, beabsichtigte Handlung, Beziehungssignal und Reaktion des Gegenübers.",
      orientationEn: "Read the situation and dialogue first. Then distinguish literal wording, intended action, relationship signal, and the other speaker's response.",
      paragraphs: input.passage,
      questions: input.questions.map(([question, answer, distractorOne, distractorTwo]) => ({
        questionDe: question,
        questionEn: question,
        optionsDe: [answer, distractorOne, distractorTwo],
        optionsEn: [answer, distractorOne, distractorTwo],
        correct: 0,
        explanationDe: "Diese Antwort verbindet den sprachlichen Ausdruck mit seiner Funktion im konkreten Gespräch.",
        explanationEn: "This answer connects the wording with its function in the specific interaction."
      })),
      recallPromptDe: "Erkläre die Absicht oder das Missverständnis und formuliere die entscheidende Reaktion in ein bis zwei spanischen Sätzen.",
      recallPromptEn: "Explain the intention or misunderstanding and produce the key response in one or two Spanish sentences.",
      modelSummary: input.modelSummary
    };
    const common = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "C1",
      theme: input.checkpoint ? "Checkpoint" : "Pragmatic Interaction",
      situation: input.situation,
      imageKey: input.imageKey,
      readingJson,
      outcomesJson: [
        "You can infer intended meaning from wording, context, and response.",
        "You can disagree, manage turns, and repair misunderstandings cooperatively.",
        "You can interpret tone and verify shared understanding in demanding interaction."
      ],
      conceptKeys: ["c1", "pragmatics", "interaction", "repair", "stance"],
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
  console.log(`Seeded ${lessons.length} C1.4 pragmatic-interaction learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
