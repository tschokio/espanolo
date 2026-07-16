const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c2-literary-ambiguity", title: "Productive Ambiguity and Interpretive Limits", order: 2400, imageKey: "conversation-and-opinion:12", inputMode: "reading",
    summary: "Distinguish deliberate ambiguity from missing information and support multiple readings without claiming that every interpretation is equally plausible.", situation: "interpreting the unresolved ending of a short story",
    passage: ["Al final del relato, Inés deja la llave sobre la mesa y mira por última vez la puerta entreabierta. «Mañana ya no hará falta», piensa. El texto no aclara si piensa marcharse, revelar un secreto o renunciar a entrar en una habitación que ha evitado durante años.", "La ambigüedad es productiva porque varias señales sostienen más de una lectura: la llave implica acceso o renuncia; mañana proyecta una decisión; la puerta entreabierta mantiene una posibilidad. Sin embargo, el texto no permite afirmar que Inés vaya a destruir la casa. Interpretar exige formular hipótesis graduadas y marcar el límite entre indicio e invención."],
    questions: [["Warum ist das Ende produktiv mehrdeutig?", "Mehrere konkrete Textsignale stützen verschiedene, aber begrenzte Lesarten.", "Weil der Text keinerlei Gegenstände oder Handlungen nennt.", "Weil jede beliebige Fortsetzung gleichermaßen wahrscheinlich ist.", "Why is the ending productively ambiguous?", "Several concrete textual signals support different but bounded readings.", "Because the text names no objects or actions at all.", "Because every imaginable continuation is equally likely."], ["Welche Behauptung überschreitet die Textgrundlage?", "Inés werde das Haus zerstören.", "Die Schlüsselhandlung kann Verzicht andeuten.", "Das Wort mañana weist auf eine bevorstehende Entscheidung.", "Which claim exceeds the textual evidence?", "That Inés will destroy the house.", "The action with the key may suggest renunciation.", "The word mañana points toward an upcoming decision."]],
    modelSummary: "La ambigüedad literaria admite lecturas plurales cuando cada una se apoya en indicios; la interpretación rigurosa gradúa la certeza y no convierte una posibilidad en hecho.",
    sentences: [["El desenlace admite dos lecturas respaldadas por la llave y la puerta.", "The ending allows two readings supported by the key and the door.", "The interpretation names evidence instead of merely asserting ambiguity."], ["Es posible que Inés se marche, aunque el texto no lo confirma.", "Inés may leave, although the text does not confirm it.", "Modal framing preserves uncertainty."], ["La llave puede simbolizar acceso, control o renuncia.", "The key may symbolize access, control, or renunciation.", "The claim offers a bounded semantic field."], ["Nada en el pasaje permite concluir que vaya a destruir la casa.", "Nothing in the passage allows us to conclude that she will destroy the house.", "The sentence marks an interpretive limit."], ["Una lectura plausible explica más indicios de los que contradice.", "A plausible reading explains more clues than it contradicts.", "The model states a transferable criterion for interpretation." ]]
  },
  {
    slug: "c2-voice-free-indirect-discourse", title: "Voice, Distance, and Free Indirect Discourse", order: 2410, imageKey: "conversation-and-opinion:13", inputMode: "listening",
    summary: "Track narrator and character language when viewpoint shifts without quotation marks or an explicit reporting clause.", situation: "following a character's judgments inside third-person narration",
    passage: ["Tomás abrió la carta con calma. Otra disculpa impecable, claro. Como si tres páginas de frases cuidadosas pudieran devolverle los meses perdidos. La guardó en el cajón y dijo que respondería al día siguiente.", "Las expresiones «otra disculpa impecable, claro» y «como si...» transmiten la valoración de Tomás sin introducirla con pensó. El narrador mantiene la tercera persona, pero el léxico evaluativo y la cercanía emocional pertenecen al personaje. El estilo indirecto libre crea una voz doble: acerca la conciencia de Tomás sin convertir el fragmento en cita literal."],
    questions: [["Woran erkennt man die Perspektive von Tomás ohne pensó?", "An wertender Wortwahl und Gedankenrhythmus innerhalb der Erzählung in dritter Person.", "Nur an den Anführungszeichen der direkten Rede.", "An einem Wechsel zur ersten Person Plural.", "How is Tomás's perspective recognized without pensó?", "Through evaluative wording and thought rhythm inside third-person narration.", "Only through quotation marks for direct speech.", "Through a shift to first-person plural."], ["Welche Wirkung erzeugt der freie indirekte Stil?", "Er verbindet Erzählerdistanz mit unmittelbarer Nähe zur Figurenwahrnehmung.", "Er beweist, dass der Erzähler und Tomás dieselbe Person sind.", "Er entfernt jede Bewertung aus dem Text.", "What effect does free indirect discourse create?", "It combines narratorial distance with immediate access to the character's perception.", "It proves that the narrator and Tomás are the same person.", "It removes all evaluation from the text."]],
    modelSummary: "El estilo indirecto libre conserva la tercera persona y la voz narrativa, pero incorpora léxico, ritmo y valoraciones del personaje para producir cercanía y una voz doble.",
    sentences: [["La tercera persona pertenece al narrador, pero la ironía procede de Tomás.", "The third person belongs to the narrator, but the irony comes from Tomás.", "The sentence attributes grammatical voice and evaluation separately."], ["La expresión «claro» acerca la narración a la conciencia del personaje.", "The expression claro brings the narration closer to the character's consciousness.", "A small discourse marker becomes viewpoint evidence."], ["El texto no dice que Tomás pensara esas palabras literalmente.", "The text does not say that Tomás thought those exact words.", "Free indirect discourse is not a verbatim quotation."], ["La voz doble permite mantener distancia y, a la vez, transmitir resentimiento.", "The double voice preserves distance while conveying resentment.", "The form-effect link is made explicit."], ["Para identificar la perspectiva, conviene atribuir cada valoración a una voz.", "To identify viewpoint, each evaluation should be attributed to a voice.", "Attribution is the transferable reading strategy." ]]
  },
  {
    slug: "c2-motif-symbol-network", title: "Motif, Symbol, and Patterned Meaning", order: 2420, imageKey: "conversation-and-opinion:14", inputMode: "reading",
    summary: "Build a symbolic interpretation from recurrence, variation, contrast, and narrative consequence rather than from a fixed symbol dictionary.", situation: "tracing repeated images across a literary passage",
    passage: ["En el primer capítulo, la abuela cubre los espejos antes de comunicar una muerte. Años después, Clara limpia uno, pero evita mirarse. En la última escena, abre las cortinas y coloca el espejo frente a la ventana, donde refleja una calle llena de gente.", "El espejo no posee una traducción fija. Su sentido cambia con las acciones que lo rodean: ocultar, evitar y finalmente orientar hacia el exterior. La recurrencia construye un motivo; la transformación del motivo acompaña el paso del duelo encerrado a una posible reconexión. La interpretación se sostiene en el patrón completo, no en la idea universal de que todo espejo significa identidad."],
    questions: [["Wodurch entsteht die symbolische Deutung des Spiegels?", "Durch Wiederholung, veränderte Handlungen und ihre Stellung in der Entwicklung der Figur.", "Durch eine universelle Liste fester Symbolbedeutungen.", "Allein durch das Material des Spiegelrahmens.", "What creates the symbolic interpretation of the mirror?", "Repetition, changing actions, and their place in the character's development.", "A universal list of fixed symbolic meanings.", "Only the material of the mirror frame."], ["Welche Entwicklung begleitet das Motiv?", "Den Weg von abgeschlossener Trauer zu möglicher neuer Verbindung.", "Eine genaue technische Geschichte der Spiegelherstellung.", "Die Behauptung, Clara habe den Todesfall vergessen.", "What development does the motif accompany?", "A movement from enclosed grief toward possible reconnection.", "A precise technical history of mirror production.", "The claim that Clara has forgotten the death."]],
    modelSummary: "Un símbolo literario adquiere sentido mediante recurrencia, variación, contraste y consecuencia; el patrón del texto pesa más que una equivalencia simbólica aprendida de memoria.",
    sentences: [["El espejo reaparece en momentos decisivos, pero su función cambia.", "The mirror reappears at decisive moments, but its function changes.", "Recurrence and variation are named together."], ["Al principio se oculta; al final refleja el mundo exterior.", "At first it is hidden; at the end it reflects the outside world.", "The contrast supplies the interpretation's textual structure."], ["El motivo acompaña el paso del aislamiento a la reconexión.", "The motif accompanies the movement from isolation to reconnection.", "The symbol is linked to character development."], ["No basta afirmar que el espejo representa la identidad.", "It is not enough to state that the mirror represents identity.", "The sentence rejects dictionary symbolism."], ["La interpretación debe explicar cada aparición y también sus cambios.", "The interpretation must explain every appearance as well as its changes.", "A strong reading accounts for the whole pattern." ]]
  },
  {
    slug: "c2-intertext-cultural-memory", title: "Intertextuality and Cultural Memory", order: 2430, imageKey: "conversation-and-opinion:15", inputMode: "listening",
    summary: "Recognize how a text activates another work or shared cultural frame, then explain the new function without reducing meaning to source spotting.", situation: "interpreting a modern scene that reworks a familiar literary journey",
    passage: ["Una novela contemporánea presenta a una mujer que recorre la ciudad de noche buscando a su hermano. Cada persona le ofrece una versión contradictoria y le advierte que no mire atrás al cruzar el último puente. El relato evoca viajes al mundo de los muertos, pero sitúa la búsqueda entre estaciones, hospitales y mensajes de voz.", "Reconocer el eco mítico abre una relación, no resuelve el texto. La prohibición de mirar atrás puede conservar la tensión entre memoria y avance; la ciudad moderna transforma la hazaña heroica en experiencia de pérdida burocrática y fragmentada. Una lectura intertextual debe mostrar qué elemento se recupera, cómo se modifica y qué nueva función cumple."],
    questions: [["Was muss eine intertextuelle Deutung über das Erkennen der Quelle hinaus leisten?", "Sie muss zeigen, welches Element übernommen, verändert und neu funktionalisiert wird.", "Sie muss beweisen, dass beide Texte dieselbe Handlung besitzen.", "Sie muss jede moderne Einzelheit ausblenden.", "What must an intertextual reading do beyond recognizing a source?", "It must show which element is recovered, transformed, and given a new function.", "It must prove that both texts have the same plot.", "It must ignore every modern detail."], ["Welche neue Wirkung erzeugt die moderne Stadt?", "Sie verwandelt die heroische Suche in eine fragmentierte Erfahrung von Verlust und Institutionen.", "Sie beseitigt jeden Bezug zu Erinnerung.", "Sie macht die Figur automatisch zu einer mythologischen Göttin.", "What new effect does the modern city create?", "It turns the heroic quest into a fragmented experience of loss and institutions.", "It removes every connection to memory.", "It automatically turns the character into a mythological goddess."]],
    modelSummary: "La intertextualidad relaciona un texto con otro marco cultural mediante recuperación y transformación; interpretarla exige explicar la función nueva, no limitarse a identificar una referencia.",
    sentences: [["El relato recupera la prohibición de mirar atrás, pero cambia su contexto.", "The story recovers the prohibition against looking back but changes its context.", "The sentence separates retained element and transformation."], ["El eco mítico convierte la búsqueda urbana en un descenso simbólico.", "The mythical echo turns the urban search into a symbolic descent.", "The relation produces a new interpretive layer."], ["Reconocer la referencia no equivale a explicar su función.", "Recognizing the reference is not the same as explaining its function.", "Source spotting is distinguished from interpretation."], ["La ciudad sustituye la aventura heroica por una pérdida fragmentada.", "The city replaces heroic adventure with fragmented loss.", "The modern setting is tied to changed effect."], ["Una lectura responsable distingue semejanza, transformación y diferencia.", "A responsible reading distinguishes similarity, transformation, and difference.", "The model provides a reusable three-part method." ]]
  },
  {
    slug: "c2-creative-voice-constraint", title: "Controlled Creative Rewriting", order: 2440, imageKey: "conversation-and-opinion:16", inputMode: "reading",
    summary: "Rewrite a scene under explicit constraints while preserving facts and deliberately changing voice, distance, rhythm, or implied attitude.", situation: "rewriting the same event from a different viewpoint",
    passage: ["Texto base: «El tren salió a las seis. Daniel llegó al andén cuando las luces rojas ya se alejaban. Guardó el billete y llamó a su hermana». Los hechos mínimos son salida, llegada tardía, conservación del billete y llamada.", "Una reescritura desde la hermana no puede inventar que Daniel perdió el billete. Puede cambiar el acceso a la información: «A las seis y tres sonó el teléfono. Antes de contestar, ella ya sabía que había vuelto a llegar tarde». La nueva voz añade una inferencia coherente y una actitud cansada; conserva los hechos verificables y modifica distancia, selección y ritmo."],
    questions: [["Was muss bei der Umschreibung erhalten bleiben?", "Die vorgegebenen Ereignisse und ihre zeitliche Beziehung.", "Jedes einzelne Wort und dieselbe Satzlänge.", "Eine neu erfundene Ursache für die Verspätung.", "What must be preserved in the rewriting?", "The given events and their temporal relationship.", "Every individual word and the same sentence length.", "A newly invented cause for the delay."], ["Was darf sich gezielt verändern?", "Informationszugang, Haltung, Auswahl, Distanz und Rhythmus.", "Ob der Zug überhaupt abfährt.", "Ob Daniel seine Schwester anruft.", "What may be changed deliberately?", "Access to information, attitude, selection, distance, and rhythm.", "Whether the train leaves at all.", "Whether Daniel calls his sister."]],
    modelSummary: "La reescritura controlada mantiene hechos y relaciones esenciales, pero transforma de manera deliberada perspectiva, acceso a la información, actitud, selección léxica y ritmo.",
    sentences: [["La nueva versión conserva los hechos, pero cambia quién los percibe.", "The new version preserves the facts but changes who perceives them.", "Invariant and controlled variable are both explicit."], ["La hermana conoce la tardanza únicamente por la llamada y por su experiencia previa.", "The sister knows about the delay only through the call and her previous experience.", "Information access remains plausible."], ["El adverbio «ya» sugiere cansancio ante una conducta repetida.", "The adverb ya suggests weariness at repeated behavior.", "A small lexical choice carries attitude."], ["Cambiar la perspectiva no autoriza a contradecir el texto base.", "Changing viewpoint does not authorize contradicting the source text.", "The constraint protects factual fidelity."], ["Antes de reescribir, conviene separar invariantes y decisiones estilísticas.", "Before rewriting, invariants and stylistic decisions should be separated.", "The model gives a practical production procedure." ]]
  },
  {
    slug: "checkpoint-c2-literary-creative-control", title: "C2.5 Literary and Creative Control Checkpoint", order: 2450, imageKey: "rewards-and-progress:17", inputMode: "listening", checkpoint: true,
    summary: "Interpret ambiguity, attribute voice, trace a motif, explain an intertext, and rewrite under constraints without exceeding the evidence.", situation: "producing a rigorous interpretation and controlled stylistic transformation",
    passage: ["En una casa vacía, Mara encuentra tres cartas sin abrir junto a una ventana cubierta. La narración comenta: «Había llegado a tiempo, desde luego; solo llevaba diez años de retraso». Mara abre la ventana, pero guarda las cartas en el bolsillo sin leerlas. En la calle, un músico interpreta una melodía que su padre solía silbar.", "La ironía pertenece a una voz cercana a Mara y cuestiona la idea literal de puntualidad. Ventana y cartas forman un patrón de apertura aplazada; la melodía activa una memoria cultural privada sin explicar por sí sola qué decidirá la protagonista. Una reescritura desde el músico puede conservar acciones y sonido, pero no afirmar que él conoce el contenido de las cartas."],
    questions: [["Welche integrierte Deutung bleibt textnah?", "Ironie, Fenster, Briefe und Melodie markieren verspätete Öffnung, ohne Maras Entscheidung festzulegen.", "Die Melodie beweist, dass der Musiker den Vater persönlich kannte.", "Die ungeöffneten Briefe zeigen, dass Mara ihren Inhalt bereits kennt.", "Which integrated interpretation remains grounded in the text?", "Irony, window, letters, and melody mark delayed opening without determining Mara's decision.", "The melody proves that the musician personally knew the father.", "The unopened letters show that Mara already knows their contents."], ["Welche Grenze gilt für die Perspektive des Musikers?", "Er kann Handlungen und Reaktionen beobachten, aber den Briefinhalt nicht wissen.", "Er muss dieselben Gedanken wie Mara haben.", "Er darf die genannten Handlungen beliebig ersetzen.", "What limit applies to the musician's viewpoint?", "He can observe actions and reactions but cannot know the contents of the letters.", "He must have the same thoughts as Mara.", "He may replace the stated actions freely."]],
    modelSummary: "Una lectura integrada atribuye ironía y perspectiva, relaciona motivos e intertextos y limita cada inferencia; la reescritura conserva hechos y adapta solo la información disponible a la nueva voz.",
    sentences: [["La ironía cuestiona la puntualidad literal y acerca la voz a Mara.", "The irony challenges literal punctuality and brings the voice closer to Mara.", "Voice and effect are integrated."], ["La ventana y las cartas repiten una apertura que todavía se aplaza.", "The window and the letters repeat an opening that is still postponed.", "Two objects are connected as a motif network."], ["La melodía activa la memoria, pero no determina la decisión final.", "The melody activates memory but does not determine the final decision.", "The interpretation preserves an explicit limit."], ["Desde la calle, el músico puede observar el gesto, no conocer las cartas.", "From the street, the musician can observe the gesture but cannot know the letters.", "Viewpoint constrains information access."], ["La reescritura debe conservar los hechos y transformar solo voz, selección y ritmo.", "The rewriting must preserve the facts and transform only voice, selection, and rhythm.", "The final model joins interpretation and controlled production." ]]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:«»]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;:«»]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`];
};

function checks(input) {
  return [
    { key: "interpret", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "analyze", type: ExerciseType.TRANSFORMATION, question: input.sentences[3][1], correct: input.sentences[3][0] },
    { key: "compose", type: ExerciseType.WRITING_PROMPT, question: input.sentences[4][1], correct: input.sentences[4][0], functionalCheck: input.checkpoint ? { minimumMatched: 2, groups: [
      { key: "preserve", labelDe: "vorgegebene Fakten bewahren", labelEn: "preserve the given facts", required: true, any: ["conservar los hechos", "mantener los hechos", "preservar los hechos", "sin cambiar los hechos"] },
      { key: "transform", labelDe: "erlaubte Stilvariable verändern", labelEn: "transform an allowed style variable", required: true, any: ["cambiar la voz", "transformar la voz", "cambiar la perspectiva", "selección y ritmo", "seleccion y ritmo", "voz y ritmo"] }
    ] } : null }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "c2_literary_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "c2_literary_evidence_control", rubric: check.functionalCheck ? "Preserve the source facts and name an allowed stylistic transformation in natural Spanish." : "Retrieve the taught analytical model accurately; open interpretation is not scored as if semantic AI evaluation were available.", ...(check.functionalCheck ? { functionalCheck: check.functionalCheck } : {}) };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Interpret evidence and control literary effect",
    instruction: "Name the textual signal, attribute voice or pattern, explain its effect, and preserve the limit of what the passage supports.",
    questionText: check.question, answerJson,
    explanation: "Rigorous literary interpretation links form and effect to visible evidence, while controlled rewriting changes only the variables permitted by the task.",
    difficulty: 7, order, xpReward: 24, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topicData = {
    title: "Literary Interpretation and Creative Control",
    description: "Productive ambiguity, interpretive limits, free indirect discourse, motif and symbol networks, intertextuality, cultural memory, and controlled creative rewriting.",
    cefrLevel: "C2", imageKey: "conversation-and-opinion:14"
  };
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c2-literary-creative-control" }, update: topicData, create: { slug: "c2-literary-creative-control", ...topicData } });
  const groupSlugs = ["useful-phrases", "essential-words", "a2-reading-listening-lab", "a2-scenario-survival", "c2-rhetoric-variation-vocabulary"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C2.5 requires all configured vocabulary groups.");

  for (const input of lessons) {
    const readingJson = {
      inputMode: input.inputMode, title: input.title,
      orientationDe: "Lies oder höre zuerst auf konkrete Textsignale: Wortwahl, Perspektive, Wiederholung, Kontrast und Informationszugang. Trenne anschließend belegte Beobachtung, plausible Deutung und nicht gestützte Erfindung.",
      orientationEn: "First read or listen for concrete textual signals: wording, viewpoint, recurrence, contrast, and access to information. Then separate supported observation, plausible interpretation, and unsupported invention.",
      paragraphs: input.passage,
      questions: input.questions.map(([questionDe, answerDe, distractorOneDe, distractorTwoDe, questionEn, answerEn, distractorOneEn, distractorTwoEn]) => ({ questionDe, questionEn, optionsDe: [answerDe, distractorOneDe, distractorTwoDe], optionsEn: [answerEn, distractorOneEn, distractorTwoEn], correct: 0, explanationDe: "Diese Antwort verbindet ein sichtbares Textsignal mit seiner Wirkung und überschreitet nicht die Informationen, die Stimme, Muster und Kontext tatsächlich tragen.", explanationEn: "This answer connects a visible textual signal to its effect without exceeding what voice, pattern, and context actually support." })),
      recallPromptDe: "Fasse die Deutung auf Spanisch zusammen: Nenne mindestens ein Textsignal, seine Funktion und eine klare Grenze dessen, was daraus nicht sicher folgt.",
      recallPromptEn: "Summarize the interpretation in Spanish: name at least one textual signal, its function, and a clear limit on what cannot safely be inferred from it.",
      modelSummary: input.modelSummary
    };
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "C2",
      theme: input.checkpoint ? "Checkpoint" : "Literary and Creative Control", situation: input.situation,
      imageKey: input.imageKey, readingJson,
      outcomesJson: ["You can support plural literary readings while marking interpretive limits.", "You can attribute voice and trace motifs or intertexts through textual evidence.", "You can rewrite under explicit viewpoint and factual constraints."],
      conceptKeys: ["c2", "literature", "voice", "interpretation", "creative-writing"], reviewSummary: input.summary,
      order: input.order, estimatedMinutes: input.checkpoint ? 32 : 25, topicId: topic.id
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
  console.log(`Seeded ${lessons.length} C2.5 literary and creative-control learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
