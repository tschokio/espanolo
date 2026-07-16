const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c1-thesis-scope", title: "Frame a Precise Thesis", order: 1920, imageKey: "conversation-and-opinion:15",
    summary: "State a defensible central claim, define its scope, and preview the reasoning without making it broader than the evidence.", situation: "opening a formal argument with a precise and supportable position",
    passage: ["Prohibir por completo los coches en el centro reduciría parte de la contaminación, pero no resolvería por sí solo los problemas de movilidad. La medida afectaría de forma distinta a residentes, comercios y personas con movilidad reducida.", "Por tanto, la cuestión no es si debe limitarse el tráfico, sino qué combinación de restricciones, transporte público y excepciones produciría una mejora justa y duradera."],
    questions: [["¿Qué tesis defiende el texto?", "La mejora exige combinar restricciones, transporte público y excepciones.", "Una prohibición total resolvería todos los problemas.", "No debería limitarse nunca el tráfico."], ["¿Qué evita que la tesis sea demasiado absoluta?", "Reconoce efectos distintos y limita lo que una sola medida puede lograr.", "Elimina cualquier referencia a grupos afectados.", "Presenta una preferencia personal como hecho demostrado."]],
    modelSummary: "El texto apoya limitar el tráfico, pero sostiene que una solución justa requiere combinar varias medidas y considerar a los grupos afectados.",
    sentences: [
      ["La cuestión central no es si debemos actuar, sino cómo hacerlo de forma justa.", "The central question is not whether we should act, but how to do so fairly.", "The contrast defines the exact issue under discussion."],
      ["Sostendré que ninguna medida aislada puede resolver el problema.", "I will argue that no isolated measure can solve the problem.", "The thesis announces a bounded, defensible claim."],
      ["Este análisis se limita a los efectos sobre la movilidad urbana.", "This analysis is limited to the effects on urban mobility.", "A scope statement prevents the argument from overreaching."],
      ["Conviene distinguir entre una mejora parcial y una solución definitiva.", "It is advisable to distinguish between a partial improvement and a definitive solution.", "The distinction calibrates the strength of the conclusion."],
      ["A continuación, examinaré los beneficios, los costes y las posibles excepciones.", "I will next examine the benefits, costs, and possible exceptions.", "A roadmap makes the reasoning predictable and easy to follow."]
    ]
  },
  {
    slug: "c1-evidence-causality", title: "Evaluate Evidence and Causality", order: 1930, imageKey: "reading-and-listening-lab:15",
    summary: "Separate observation, correlation, explanation, and causal proof while stating exactly what the available evidence supports.", situation: "evaluating a confident claim against limited data",
    passage: ["Tras ampliar el horario de la biblioteca, aumentó un veinte por ciento el número de visitantes. El dato coincide con la reforma, pero también se organizaron nuevas actividades y abrió una residencia estudiantil cercana.", "El aumento es compatible con la idea de que el horario influyó; sin embargo, la información disponible no permite atribuirle todo el cambio ni separar todavía el peso de cada factor."],
    questions: [["¿Qué demuestra directamente el dato?", "Que las visitas aumentaron después de la ampliación del horario.", "Que el horario causó por sí solo todo el aumento.", "Que las nuevas actividades no tuvieron ningún efecto."], ["¿Por qué se limita la conclusión causal?", "Porque cambiaron varios factores al mismo tiempo.", "Porque no existe ningún dato sobre visitantes.", "Porque una correlación demuestra siempre la causa."]],
    modelSummary: "Las visitas aumentaron tras varios cambios simultáneos, por lo que el horario pudo influir, pero no puede considerarse la única causa.",
    sentences: [
      ["Los datos muestran una asociación, no una relación causal demostrada.", "The data show an association, not a demonstrated causal relationship.", "The sentence separates co-occurrence from causal proof."],
      ["El resultado es compatible con esta explicación, aunque no la confirma por sí solo.", "The result is consistent with this explanation, although it does not confirm it on its own.", "Compatible con supports a hypothesis without overstating certainty."],
      ["No puede descartarse que otros factores hayan influido.", "It cannot be ruled out that other factors may have had an influence.", "The impersonal frame keeps alternative causes visible."],
      ["La muestra es demasiado reducida para generalizar la conclusión.", "The sample is too small to generalize the conclusion.", "A limitation names why the inference must remain narrow."],
      ["Harían falta datos comparables antes y después de la medida.", "Comparable data from before and after the measure would be needed.", "The conditional identifies evidence required for a stronger claim."]
    ]
  },
  {
    slug: "c1-source-integration", title: "Integrate and Compare Sources", order: 1940, imageKey: "reading-and-listening-lab:11",
    summary: "Attribute claims accurately, compare agreements and tensions, and keep your own synthesis distinct from every source.", situation: "combining two reports into one coherent explanation",
    passage: ["Según el informe municipal, el nuevo carril bici redujo los trayectos en coche en el barrio. La asociación de comerciantes coincide en que hay menos tráfico, pero advierte de que las zonas de carga resultan insuficientes.", "Ambas fuentes describen una mejora general, aunque evalúan de manera distinta sus costes. En conjunto, sugieren que la medida funciona, pero necesita ajustes operativos."],
    questions: [["¿En qué coinciden las dos fuentes?", "En que hay menos tráfico tras la creación del carril bici.", "En que deben eliminarse todas las zonas de carga.", "En que la medida no produjo ningún cambio."], ["¿Qué añade la síntesis final?", "Combina la mejora observada con la necesidad de ajustes.", "Atribuye a ambas fuentes una opinión que ninguna expresa.", "Sustituye los informes por una experiencia personal."]],
    modelSummary: "Las dos fuentes observan menos tráfico, pero la asociación señala problemas de carga; por eso la síntesis apoya la medida con ajustes.",
    sentences: [
      ["Según el primer informe, la medida redujo el tráfico.", "According to the first report, the measure reduced traffic.", "Attribution keeps the claim attached to its source."],
      ["La segunda fuente coincide en el resultado, pero discrepa sobre sus costes.", "The second source agrees on the result but disagrees about its costs.", "The sentence compares agreement and disagreement in one frame."],
      ["Mientras que un estudio destaca la eficacia, el otro subraya sus límites.", "While one study highlights effectiveness, the other emphasizes its limitations.", "Mientras que organizes a balanced source contrast."],
      ["Ninguna de las fuentes demuestra que el efecto vaya a mantenerse.", "Neither source demonstrates that the effect will be maintained.", "The synthesis identifies a shared evidential gap."],
      ["Consideradas en conjunto, ambas perspectivas apuntan a una conclusión matizada.", "Taken together, both perspectives point to a nuanced conclusion.", "The reduced clause marks the writer's synthesis rather than a new source claim."]
    ]
  },
  {
    slug: "c1-counterargument-rebuttal", title: "Answer Counterarguments Fairly", order: 1950, imageKey: "conversation-and-opinion:13",
    summary: "Represent an opposing position fairly, concede what is valid, and answer the point that actually threatens your thesis.", situation: "strengthening a proposal by engaging with its strongest objection",
    passage: ["Quienes se oponen al teletrabajo señalan, con razón, que la coordinación espontánea puede resultar más difícil. También advierten del riesgo de aislamiento para quienes viven solos.", "Estas objeciones justifican espacios de encuentro y días presenciales, pero no demuestran que todo el trabajo deba realizarse en la oficina. Un modelo flexible puede responder a ambos riesgos sin renunciar a la autonomía."],
    questions: [["¿Qué concede el autor a la posición contraria?", "Que existen riesgos reales de coordinación y aislamiento.", "Que el teletrabajo debe eliminarse por completo.", "Que la autonomía carece de valor."], ["¿Cómo responde a la objeción?", "Propone un modelo flexible con encuentros y días presenciales.", "Ignora los riesgos mencionados.", "Cambia de tema y habla solo de salarios."]],
    modelSummary: "El texto acepta dos riesgos del teletrabajo, pero responde que un modelo flexible puede reducirlos sin volver obligatoria la oficina diaria.",
    sentences: [
      ["Es cierto que la propuesta implica costes iniciales.", "It is true that the proposal involves initial costs.", "A concession acknowledges a valid opposing point."],
      ["La objeción resulta pertinente, pero no invalida la tesis principal.", "The objection is relevant, but it does not invalidate the main thesis.", "The rebuttal states exactly how far the objection reaches."],
      ["Quienes discrepan sostienen que la medida perjudicaría a los comercios.", "Those who disagree argue that the measure would harm businesses.", "A neutral reporting verb presents the opposing view fairly."],
      ["Ahora bien, ese argumento presupone que no habrá medidas compensatorias.", "However, that argument assumes that there will be no compensatory measures.", "The response identifies an unstated premise rather than dismissing the speaker."],
      ["Incluso aceptando esa dificultad, los beneficios a largo plazo seguirían siendo relevantes.", "Even accepting that difficulty, the long-term benefits would remain relevant.", "The concessive gerund tests whether the thesis survives the objection."]
    ]
  },
  {
    slug: "c1-synthesis-recommendation", title: "Synthesize and Recommend", order: 1960, imageKey: "conversation-and-opinion:10",
    summary: "Turn mixed evidence into a proportionate conclusion, practical recommendation, conditions, and remaining uncertainty.", situation: "closing an analysis with a useful but carefully limited recommendation",
    passage: ["La prueba piloto redujo el consumo energético, aunque el ahorro varió mucho entre edificios. Los costes de instalación fueron superiores a lo previsto, pero el mantenimiento resultó más sencillo.", "En vista de estos resultados, convendría ampliar el programa de forma gradual, priorizar los edificios con mayor consumo y revisar los datos al cabo de un año antes de adoptar una decisión definitiva."],
    questions: [["¿Por qué no se recomienda una ampliación inmediata y total?", "Porque los resultados y los costes varían y todavía existe incertidumbre.", "Porque la prueba no produjo ningún ahorro.", "Porque el mantenimiento fue imposible."], ["¿Qué hace proporcionada la recomendación?", "Propone una ampliación gradual, prioridades y una revisión posterior.", "Presenta el resultado como definitivo.", "Elimina cualquier condición de seguimiento."]],
    modelSummary: "Como la prueba ahorró energía con resultados desiguales y costes altos, se recomienda ampliar gradualmente y evaluar de nuevo antes de decidir.",
    sentences: [
      ["En conjunto, la evidencia respalda una ampliación gradual.", "Overall, the evidence supports a gradual expansion.", "The conclusion combines the evidence without claiming unanimity."],
      ["La recomendación debe entenderse como provisional.", "The recommendation should be understood as provisional.", "The frame explicitly limits the decision's status."],
      ["Siempre que se mantenga el seguimiento, los riesgos parecen asumibles.", "Provided that monitoring is maintained, the risks appear manageable.", "The condition states what must remain true for the recommendation to hold."],
      ["Sería prematuro extender el programa sin evaluar sus costes reales.", "It would be premature to extend the program without evaluating its real costs.", "The conditional gives a proportionate warning."],
      ["Queda por determinar si los resultados pueden reproducirse a mayor escala.", "It remains to be determined whether the results can be reproduced on a larger scale.", "The final sentence preserves an unresolved question."],
    ]
  },
  {
    slug: "checkpoint-c1-argument-synthesis", title: "C1.3 Argument and Synthesis Checkpoint", order: 1970, imageKey: "rewards-and-progress:14", checkpoint: true,
    summary: "Build a scoped thesis, evaluate evidence, integrate sources, answer objections, and make a proportionate recommendation.", situation: "writing a balanced recommendation from incomplete and partly conflicting evidence",
    passage: ["Dos estudios sobre la semana laboral de cuatro días registraron mayor satisfacción y menos ausencias. Uno observó una productividad estable; el otro incluyó solo empresas pequeñas y no midió los efectos a largo plazo.", "Aunque la evidencia justifica nuevas pruebas, todavía no permite afirmar que el modelo funcione igual en todos los sectores. Por ello, convendría realizar proyectos piloto más amplios, acordar indicadores comunes y revisar los resultados antes de una implantación general."],
    questions: [["¿Qué conclusión apoya la evidencia disponible?", "Que conviene realizar pruebas más amplias antes de generalizar el modelo.", "Que el modelo funciona igual en todos los sectores.", "Que debe abandonarse cualquier nueva prueba."], ["¿Qué limitación impide una conclusión universal?", "Las muestras y mediciones no cubren todos los sectores ni el largo plazo.", "Los estudios no midieron satisfacción ni ausencias.", "Ambos estudios demostraron una caída general de productividad."]],
    modelSummary: "Los estudios ofrecen resultados prometedores, pero sus límites impiden generalizar; se recomiendan pruebas mayores con indicadores comunes.",
    sentences: [
      ["La evidencia disponible es prometedora, aunque todavía limitada.", "The available evidence is promising, although still limited.", "The stance balances support and restraint."],
      ["Ambos estudios coinciden en algunos beneficios, pero difieren en su alcance.", "Both studies agree on some benefits but differ in their scope.", "The synthesis compares the sources precisely."],
      ["No puede concluirse que el modelo funcione igual en todos los sectores.", "It cannot be concluded that the model works equally in every sector.", "The impersonal frame blocks an unsupported generalization."],
      ["Incluso aceptando los resultados positivos, faltan datos a largo plazo.", "Even accepting the positive results, long-term data are lacking.", "The counterargument remains valid after the concession."],
      ["Por tanto, convendría ampliar las pruebas antes de adoptar una decisión general.", "Therefore, it would be advisable to expand the trials before adopting a general decision.", "The recommendation matches the strength of the evidence."],
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`]; };

function checks(input) {
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "qualify", type: ExerciseType.TRANSFORMATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "synthesize", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c1_argument_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "c1_argument_synthesis", rubric: "Preserve source, scope, evidential strength, concession, and the intended recommendation." };
  const data = {
    lessonId: lesson.id,
    topicId: lesson.topicId,
    type: check.type,
    prompt: "Build a precise evidence-based argument",
    instruction: "Identify claim, scope, source, evidence strength, objection, and warranted conclusion before producing the sentence.",
    questionText: check.question,
    answerJson,
    explanation: "A strong C1 argument keeps source, evidence, inference, limitation, and recommendation distinct while connecting them into one coherent line of reasoning.",
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
    title: "Argumentation, Evidence, and Synthesis",
    description: "Precise thesis scope, evidence and causality, source integration, fair counterargument, synthesis, and proportionate recommendation.",
    cefrLevel: "C1",
    imageKey: "conversation-and-opinion:15"
  };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c1-argument-synthesis" }, update: topicData, create: { slug: "c1-argument-synthesis", ...topicData } });
  const groupSlugs = ["useful-phrases", "a2-reading-listening-lab", "essential-words", "a2-scenario-survival", "c1-register-argument"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C1.3 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: "reading",
      title: input.title,
      orientationDe: "Bestimme zuerst These, Belege und Schluss. Prüfe danach, welche Einschränkung oder Gegenposition die Aussage begrenzt.",
      orientationEn: "Identify thesis, evidence, and conclusion first; then track the limitation or opposing view that narrows the claim.",
      paragraphs: input.passage,
      questions: input.questions.map(([question, answer, distractorOne, distractorTwo]) => ({
        questionDe: question,
        questionEn: question,
        optionsDe: [answer, distractorOne, distractorTwo],
        optionsEn: [answer, distractorOne, distractorTwo],
        correct: 0,
        explanationDe: "Diese Antwort entspricht der Reichweite der Belege und der tatsächlich gezogenen Schlussfolgerung.",
        explanationEn: "This answer matches the scope of the evidence and the conclusion actually drawn."
      })),
      recallPromptDe: "Fasse These, wichtigsten Beleg und begrenzte Schlussfolgerung in ein oder zwei spanischen Sätzen zusammen.",
      recallPromptEn: "Summarize the thesis, strongest evidence, and qualified conclusion in one or two Spanish sentences.",
      modelSummary: input.modelSummary
    };
    const common = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "C1",
      theme: input.checkpoint ? "Checkpoint" : "Argument and Synthesis",
      situation: input.situation,
      imageKey: input.imageKey,
      readingJson,
      outcomesJson: [
        "You can frame a precise, supportable thesis and define its scope.",
        "You can evaluate evidence, integrate sources, and answer counterarguments fairly.",
        "You can synthesize mixed findings into a proportionate recommendation."
      ],
      conceptKeys: ["c1", "argument", "evidence", "sources", "synthesis"],
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
  console.log(`Seeded ${lessons.length} C1.3 argument-and-synthesis learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
