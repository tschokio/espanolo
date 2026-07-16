const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a2-tu-or-usted", title: "Choose Tú or Usted from the Relationship", order: 729.1, imageKey: "conversation-and-opinion:7",
    summary: "Distinguish familiar tú from respectful usted and keep the verb in the matching person form.", situation: "meeting an adult or service professional for the first time",
    sentences: [
      ["¿Tú trabajas aquí?", "Do you work here?", "Tú uses the familiar second-person form trabajas."],
      ["¿Usted trabaja aquí?", "Do you work here, formally?", "Usted addresses one person but uses the same third-person verb form as él or ella."],
      ["Tú tienes una reserva.", "You have a reservation, informally.", "Tú combines with tienes."],
      ["Usted tiene una reserva.", "You have a reservation, formally.", "Usted combines with tiene, never tienes."],
      ["Con una persona nueva, empiezo con usted.", "With a new person, I begin with usted.", "Usted is a safe respectful opening when the relationship is still unknown."]
    ],
    readingJson: {
      title: "La misma pregunta con dos relaciones",
      orientationDe: "Vergleiche nicht nur die Pronomen. Achte darauf, wie sich mit tú oder usted gleichzeitig die Verbform verändert und welche Beziehung die Situation nahelegt.",
      orientationEn: "Compare more than the pronouns. Notice how tú or usted changes the verb form and which relationship the situation suggests.",
      paragraphs: [
        "En una residencia de estudiantes, Laura conoce a Diego, que tiene su edad. Le pregunta: ¿Tú trabajas aquí o estudias? Diego responde de manera informal porque los dos son estudiantes.",
        "Después Laura habla con la directora, a quien no conoce. Pregunta: Disculpe, ¿usted trabaja aquí? La directora responde con amabilidad. La información es parecida, pero la relación cambia la forma de dirigirse a la otra persona."
      ],
      questions: [
        { questionDe: "Warum verwendet Laura bei Diego tú?", questionEn: "Why does Laura use tú with Diego?", optionsDe: ["Beide sind gleichaltrige Studierende in einer ungezwungenen Situation", "Diego ist die Direktorin", "Tú ist immer formeller"], optionsEn: ["They are students of similar age in an informal setting", "Diego is the director", "Tú is always more formal"], correct: 0, explanationDe: "Gleiches Alter, gemeinsame Rolle und ungezwungener Rahmen machen tú hier erwartbar.", explanationEn: "Similar age, a shared role, and an informal setting make tú expected here." },
        { questionDe: "Welche Form passt zur Direktorin?", questionEn: "Which form fits the director?", optionsDe: ["¿Usted trabaja aquí?", "¿Tú trabaja aquí?", "¿Usted trabajas aquí?"], optionsEn: ["¿Usted trabaja aquí?", "¿Tú trabaja aquí?", "¿Usted trabajas aquí?"], correct: 0, explanationDe: "Usted bezeichnet eine angesprochene Person, verlangt grammatisch aber die Form trabaja.", explanationEn: "Usted addresses one person but grammatically requires trabaja." }
      ],
      recallPromptDe: "Stelle dieselbe Frage zweimal auf Spanisch: einmal vertraut mit tú und einmal respektvoll mit usted. Verändere Pronomen und Verbform gemeinsam.",
      recallPromptEn: "Ask the same question twice in Spanish: once familiarly with tú and once respectfully with usted. Change the pronoun and verb together.",
      modelSummary: "Laura usa tú con otro estudiante y usted con la directora. La relación cambia tanto la forma de tratamiento como la forma verbal."
    }
  },
  {
    slug: "a2-polite-usted-questions", title: "Ask Polite Questions with Usted", order: 729.2, imageKey: "conversation-and-opinion:8",
    summary: "Use puede, tiene, sabe, quiere, and recomienda to ask one unfamiliar person practical questions politely.", situation: "asking for information at a hotel or information desk",
    sentences: [
      ["Disculpe, ¿puede ayudarme?", "Excuse me, can you help me?", "Disculpe opens politely and puede agrees with an understood usted."],
      ["¿Tiene una habitación libre?", "Do you have a room available?", "Tiene addresses the receptionist respectfully without needing to repeat usted."],
      ["¿Sabe dónde está la estación?", "Do you know where the station is?", "Sabe introduces an embedded information question."],
      ["¿Qué me recomienda?", "What do you recommend to me?", "Recomienda is the usted form and me identifies the person receiving the recommendation."],
      ["¿Quiere que repita el nombre?", "Would you like me to repeat the name?", "Quiere checks the other person's preference respectfully."]
    ],
    readingJson: {
      title: "Tres preguntas en la recepción",
      inputMode: "listening",
      orientationDe: "Höre beim ersten Durchgang auf das jeweilige praktische Ziel. Ordne danach puede, tiene und sabe derselben unausgesprochenen Anrede usted zu.",
      orientationEn: "On the first pass, listen for each practical goal. Then connect puede, tiene, and sabe to the same unspoken usted address.",
      paragraphs: [
        "Nora llega a un hotel y dice: Disculpe, ¿tiene una habitación libre? El recepcionista confirma que sí. Nora pregunta después: ¿Sabe dónde está la estación?",
        "El recepcionista explica el camino y recomienda un autobús. Nora no oye el número y pregunta: ¿Puede repetirlo, por favor? Las preguntas son breves, respetuosas y resuelven una necesidad cada vez."
      ],
      questions: [
        { questionDe: "Welche Frage klärt zuerst die Übernachtung?", questionEn: "Which question first resolves the accommodation need?", optionsDe: ["¿Tiene una habitación libre?", "¿Sabe dónde está la estación?", "¿Puede repetirlo?"], optionsEn: ["¿Tiene una habitación libre?", "¿Sabe dónde está la estación?", "¿Puede repetirlo?"], correct: 0, explanationDe: "Habitación libre benennt genau die zuerst benötigte Leistung.", explanationEn: "Habitación libre names the service needed first." },
        { questionDe: "Warum fehlt usted in mehreren Fragen?", questionEn: "Why is usted absent from several questions?", optionsDe: ["Die Verbform zeigt die respektvoll angesprochene Einzelperson bereits", "Die Fragen haben kein Subjekt", "Usted darf nur einmal pro Tag verwendet werden"], optionsEn: ["The verb form already indicates the respectfully addressed individual", "The questions have no subject", "Usted may only be used once per day"], correct: 0, explanationDe: "Wie andere spanische Subjektpronomen kann usted wegfallen, wenn Person und Beziehung klar sind.", explanationEn: "Like other Spanish subject pronouns, usted may be omitted when person and relationship are clear." }
      ],
      recallPromptDe: "Formuliere drei höfliche Servicefragen auf Spanisch mit puede, tiene und sabe. Beginne mindestens einmal mit Disculpe und nenne pro Frage nur ein Ziel.",
      recallPromptEn: "Form three polite service questions in Spanish with puede, tiene, and sabe. Begin at least once with Disculpe and give each question only one goal.",
      modelSummary: "Nora pregunta con tiene, sabe y puede. No repite usted, porque las formas verbales y la situación mantienen el trato respetuoso."
    }
  },
  {
    slug: "a2-respectful-service-requests", title: "Make Respectful Service Requests", order: 729.3, imageKey: "conversation-and-opinion:9",
    summary: "Combine quisiera, me puede, por favor, and gracias into clear requests without becoming indirect or demanding.", situation: "requesting help in a pharmacy, restaurant, or public office",
    sentences: [
      ["Quisiera hablar con la farmacéutica.", "I would like to speak with the pharmacist.", "Quisiera packages a service wish politely."],
      ["¿Me puede explicar cómo funciona?", "Can you explain to me how it works?", "Me puede plus infinitive asks one respectfully addressed person for an action."],
      ["Dígame su nombre, por favor.", "Tell me your name, please, formally.", "Dígame is a formal usted instruction with me attached."],
      ["Espere un momento, por favor.", "Wait a moment, please, formally.", "Espere is a respectful usted instruction used in service interaction."],
      ["Muchas gracias por su ayuda.", "Thank you very much for your help, formally.", "Su aligns with the respectful relationship established in the exchange."]
    ],
    readingJson: {
      title: "Una petición clara en la farmacia",
      orientationDe: "Finde Wunsch, konkrete Bitte, Reaktion der Fachperson und Abschluss. Beobachte, wie Höflichkeit aus mehreren kleinen Signalen entsteht, nicht aus einem einzigen Zauberwort.",
      orientationEn: "Find the wish, concrete request, professional's response, and closing. Notice how politeness comes from several small signals, not one magic word.",
      paragraphs: [
        "Un cliente entra en la farmacia y dice: Buenos días. Quisiera hablar con la farmacéutica. Cuando ella llega, muestra un medicamento y pregunta: ¿Me puede explicar cómo funciona?",
        "La farmacéutica responde: Claro. Espere un momento, por favor. Después explica la dosis. El cliente confirma la información y termina con: Muchas gracias por su ayuda."
      ],
      questions: [
        { questionDe: "Welche konkrete Handlung erbittet der Kunde?", questionEn: "What concrete action does the customer request?", optionsDe: ["Eine Erklärung zur Wirkungsweise", "Ein Hotelzimmer", "Eine informelle Einladung"], optionsEn: ["An explanation of how it works", "A hotel room", "An informal invitation"], correct: 0, explanationDe: "¿Me puede explicar cómo funciona? benennt Empfänger, Handlung und Informationsziel.", explanationEn: "¿Me puede explicar cómo funciona? names recipient, action, and information goal." },
        { questionDe: "Wodurch bleibt die Bitte zugleich klar und höflich?", questionEn: "What keeps the request both clear and polite?", optionsDe: ["Me puede plus konkreter Infinitiv im respektvollen Rahmen", "Nur durch sehr viele Nebensätze", "Durch Weglassen der gewünschten Handlung"], optionsEn: ["Me puede plus a concrete infinitive in a respectful frame", "Only through many subordinate clauses", "By omitting the desired action"], correct: 0, explanationDe: "Die Bitte schwächt den Ton ab, verschweigt aber nicht, was die andere Person tun soll.", explanationEn: "The request softens the tone without hiding what the other person should do." }
      ],
      recallPromptDe: "Bitte eine respektvoll angesprochene Person auf Spanisch um eine konkrete Erklärung. Verwende quisiera oder me puede, ergänze por favor und schließe mit Dank.",
      recallPromptEn: "Ask a respectfully addressed person in Spanish for a concrete explanation. Use quisiera or me puede, add por favor, and close with thanks.",
      modelSummary: "El cliente usa quisiera y me puede para pedir una explicación clara. La farmacéutica responde con una instrucción formal y el cliente agradece su ayuda."
    }
  },
  {
    slug: "a2-ustedes-useful-plural", title: "Address More Than One Person with Ustedes", order: 729.4, imageKey: "conversation-and-opinion:10",
    summary: "Use ustedes with plural third-person forms and recognize that informal plural address varies by region.", situation: "speaking to two visitors or a small group",
    sentences: [
      ["¿Ustedes tienen una reserva?", "Do you all have a reservation?", "Ustedes addresses more than one person and combines with tienen."],
      ["¿Quieren sentarse aquí?", "Would you all like to sit here?", "Quieren keeps the plural addressees visible even when ustedes is omitted."],
      ["Pueden esperar en la sala.", "You all can wait in the room.", "Pueden is the plural counterpart of puede."],
      ["En gran parte de España también se usa vosotros.", "In much of Spain, vosotros is also used.", "Vosotros is important for recognition, while ustedes remains widely useful across regions."],
      ["Para empezar, puedo hablar a un grupo con ustedes.", "To begin, I can address a group with ustedes.", "Ustedes is a practical productive default for plural address."]
    ],
    readingJson: {
      title: "Una familia en la recepción",
      orientationDe: "Bestimme zuerst, wie viele Personen angesprochen werden. Achte danach auf die Pluralformen tienen, quieren und pueden und trenne produktive Grundform von regionaler Zusatzinformation.",
      orientationEn: "First determine how many people are being addressed. Then notice plural tienen, quieren, and pueden, separating the productive core from regional information.",
      paragraphs: [
        "Una recepcionista ve a dos viajeros y pregunta: ¿Ustedes tienen una reserva? Ellos responden que sí. La recepcionista añade: ¿Quieren sentarse aquí? Pueden esperar en la sala.",
        "En la mayor parte del mundo hispanohablante, ustedes sirve para dirigirse a varias personas. En gran parte de España se usa también vosotros en relaciones informales. Al principio basta producir ustedes y aprender a reconocer la otra forma."
      ],
      questions: [
        { questionDe: "Woran erkennt man die angesprochene Mehrzahl?", questionEn: "How is plural address visible?", optionsDe: ["An ustedes sowie tienen, quieren und pueden", "Nur am Wort reserva", "An einer Singularform mit tú"], optionsEn: ["In ustedes and in tienen, quieren, and pueden", "Only in the word reserva", "In a singular form with tú"], correct: 0, explanationDe: "Pronomen und drei Verbformen tragen gemeinsam die Pluralinformation.", explanationEn: "The pronoun and three verb forms jointly carry plural information." },
        { questionDe: "Was ist für den Einstieg die produktive Empfehlung?", questionEn: "What is the productive recommendation for beginners?", optionsDe: ["Ustedes sicher verwenden und vosotros zunächst erkennen", "Regionale Unterschiede als Fehler behandeln", "Jede Pluralanrede vermeiden"], optionsEn: ["Use ustedes confidently and initially recognize vosotros", "Treat regional differences as errors", "Avoid all plural address"], correct: 0, explanationDe: "So bleibt die eigene Produktion konsistent, während das Hör- und Leseverstehen bereits breiter wird.", explanationEn: "This keeps production consistent while receptive understanding already becomes broader." }
      ],
      recallPromptDe: "Sprich eine Gruppe auf Spanisch mit ustedes an. Stelle eine Frage mit tienen oder quieren und ergänze eine Aussage mit pueden. Erkläre auf Deutsch, wo dir später auch vosotros begegnen kann.",
      recallPromptEn: "Address a group in Spanish with ustedes. Ask a question with tienen or quieren and add a statement with pueden. Explain where you may later encounter vosotros.",
      modelSummary: "La recepcionista habla con dos viajeros usando ustedes, tienen, quieren y pueden. Vosotros aparece como variante informal de gran parte de España."
    }
  },
  {
    slug: "a2-adjust-form-of-address", title: "Adjust the Form of Address Respectfully", order: 729.5, imageKey: "conversation-and-opinion:11",
    summary: "Begin safely, follow the other person's signal, and negotiate tú or usted explicitly when the relationship is unclear.", situation: "moving from a formal first meeting to a more familiar conversation",
    sentences: [
      ["¿Prefiere que la trate de usted?", "Do you prefer that I address you as usted?", "A direct respectful question resolves uncertainty without guessing."],
      ["Si quiere, podemos tutearnos.", "If you like, we can use tú with each other.", "Tutearnos explicitly proposes a mutual move toward tú."],
      ["De acuerdo, puedes llamarme Ana.", "All right, you can call me Ana.", "Puedes confirms the new familiar relationship through the tú form."],
      ["Gracias, entonces te llamo Ana.", "Thank you, then I will call you Ana.", "Te and llamo enact the agreed closer form of address."],
      ["La forma adecuada depende de la relación y del lugar.", "The appropriate form depends on the relationship and the place.", "Spanish-speaking communities do not all draw the tú-usted boundary in the same place."]
    ],
    readingJson: {
      title: "De usted a tú sin adivinar",
      inputMode: "listening",
      orientationDe: "Höre auf das erste respektvolle Muster, das Angebot zur Veränderung und die Formen, die anschließend die neue Beziehung bestätigen. Suche keine starre Übersetzung der deutschen Du-/Sie-Grenze.",
      orientationEn: "Listen for the initial respectful pattern, the offer to change, and the forms that then confirm the new relationship. Do not seek a rigid copy of the German du/Sie boundary.",
      paragraphs: [
        "Marta conoce a una nueva colega mayor que ella y empieza con usted. La colega sonríe y dice: Si quiere, podemos tutearnos. Marta confirma: De acuerdo, entonces puedo llamarte Elena.",
        "Elena responde: Claro, y puedes llamarme cuando necesites ayuda. Las dos cambian de forma de tratamiento de manera explícita. En otra región o relación, usted podría mantenerse más tiempo sin resultar frío."
      ],
      questions: [
        { questionDe: "Wer schlägt den Wechsel zu tú vor?", questionEn: "Who proposes the move to tú?", optionsDe: ["Die neue Kollegin", "Marta ohne jedes Signal", "Eine dritte unbekannte Person"], optionsEn: ["The new colleague", "Marta without any signal", "An unknown third person"], correct: 0, explanationDe: "Si quiere, podemos tutearnos ist das ausdrückliche Angebot der Kollegin.", explanationEn: "Si quiere, podemos tutearnos is the colleague's explicit offer." },
        { questionDe: "Woran wird der Wechsel anschließend sichtbar?", questionEn: "How does the shift become visible afterward?", optionsDe: ["An llamarte und puedes", "Nur am Lächeln", "An einer unveränderten usted-Form"], optionsEn: ["In llamarte and puedes", "Only in the smile", "In an unchanged usted form"], correct: 0, explanationDe: "Die Pronomen- und Verbformen setzen die vereinbarte vertraute Anrede praktisch um.", explanationEn: "The pronoun and verb forms put the agreed familiar address into practice." }
      ],
      recallPromptDe: "Beginne ein kurzes Gespräch respektvoll mit usted. Lass die andere Person tú anbieten und bestätige den Wechsel anschließend mit einer passenden tú-Verbform und te.",
      recallPromptEn: "Begin a short conversation respectfully with usted. Let the other person offer tú, then confirm the shift with a matching tú verb form and te.",
      modelSummary: "Marta empieza con usted. Elena propone tutearse y las dos confirman el cambio usando formas de tú. La elección depende también de la comunidad y de la relación."
    }
  },
  {
    slug: "checkpoint-a2-formal-address", title: "Checkpoint: Tú, Usted, and Ustedes in Real Interaction", order: 729.6, imageKey: "conversation-and-opinion:12", checkpoint: true,
    summary: "Choose and maintain an appropriate form of address through a complete service encounter and a respectful relationship change.", situation: "helping one customer, addressing a group, and responding to a change of tone",
    sentences: [
      ["Buenos días. ¿En qué puedo ayudarle?", "Good morning. How can I help you, formally?", "Ayudarle maintains respectful singular service address."],
      ["Quisiera una habitación para dos noches.", "I would like a room for two nights.", "Quisiera states the customer's request politely and clearly."],
      ["¿Ustedes tienen los pasaportes?", "Do you all have your passports?", "Ustedes and tienen address both travelers."],
      ["Sí, aquí los tiene.", "Yes, here you have them, formally.", "Tiene returns to respectful singular address while los replaces the passports."],
      ["Si prefieren, pueden esperar en la sala.", "If you all prefer, you can wait in the room.", "Prefieren and pueden keep plural address consistent."],
      ["Gracias. ¿Puede repetir el número de la habitación?", "Thank you. Can you repeat the room number?", "Puede returns to respectful singular address for one receptionist."]
    ],
    readingJson: {
      title: "Una llegada con singular y plural",
      inputMode: "listening",
      orientationDe: "Beweise die Unterscheidung ohne Formhinweis: Verfolge bei jedem Sprecherwechsel, ob eine Person oder eine Gruppe angesprochen wird und ob die Beziehung respektvoll oder vertraut gerahmt ist.",
      orientationEn: "Prove the distinction without form hints: at every turn, track whether one person or a group is addressed and whether the relationship is framed respectfully or familiarly.",
      paragraphs: [
        "Una recepcionista recibe a una pareja y pregunta a la mujer: Buenos días. ¿En qué puedo ayudarle? Ella responde: Quisiera una habitación para dos noches. La recepcionista mira a los dos viajeros y pregunta: ¿Ustedes tienen los pasaportes?",
        "El hombre entrega ambos documentos y dice: Sí, aquí los tiene. La recepcionista añade: Si prefieren, pueden esperar en la sala. Al final, la mujer pregunta a la recepcionista: ¿Puede repetir el número de la habitación?"
      ],
      questions: [
        { questionDe: "Wann wechselt die Rezeptionistin zur Pluralanrede?", questionEn: "When does the receptionist switch to plural address?", optionsDe: ["Als sie beide Reisenden nach den Pässen fragt", "Bei der ersten Frage an die Frau", "Beim Satz hier los tiene des Mannes"], optionsEn: ["When she asks both travelers for their passports", "In the first question to the woman", "In the man's sentence aquí los tiene"], correct: 0, explanationDe: "Ustedes tienen richtet die Frage ausdrücklich an beide Personen.", explanationEn: "Ustedes tienen explicitly directs the question to both people." },
        { questionDe: "Warum steht am Ende puede im Singular?", questionEn: "Why is puede singular at the end?", optionsDe: ["Die Reisende fragt eine einzelne Rezeptionistin", "Puede ist eine Pluralform", "Die Reisende spricht mit sich selbst"], optionsEn: ["The traveler asks one receptionist", "Puede is a plural form", "The traveler speaks to herself"], correct: 0, explanationDe: "Die angesprochene Person ist wieder eine einzelne, respektvoll behandelte Fachperson.", explanationEn: "The addressee is again one respectfully addressed professional." }
      ],
      recallPromptDe: "Spiele die Szene auf Spanisch nach: respektvolle Singularfrage, Wunsch mit quisiera, eine Frage an zwei Personen mit ustedes und eine letzte Reparaturfrage mit puede.",
      recallPromptEn: "Recreate the scene in Spanish: a respectful singular question, a request with quisiera, a question to two people with ustedes, and a final repair question with puede.",
      modelSummary: "La recepcionista usa ayudarle y puede con una persona, pero ustedes, tienen, prefieren y pueden con la pareja. Los viajeros mantienen el trato respetuoso."
    }
  }
];

const vocabulary = [
  ["usted", "formal you singular", "pronoun", null, "¿Usted trabaja aquí?"],
  ["ustedes", "you all", "pronoun", null, "¿Ustedes tienen una reserva?"],
  ["el señor", "Mr. or gentleman", "noun", "masculine", "El señor espera en la recepción."],
  ["la señora", "Mrs. or lady", "noun", "feminine", "La señora tiene una reserva."],
  ["formal", "formal", "adjective", null, "Esta conversación es formal."],
  ["informal", "informal", "adjective", null, "Entre amigos, la conversación es informal."],
  ["dirigirse a", "to address someone", "phrase", null, "No sé cómo dirigirme a la directora."],
  ["tratar de usted", "to address as usted", "phrase", null, "Prefiero tratar de usted al cliente."],
  ["tutear", "to address with tú", "verb", null, "Podemos tutearnos si quieres."],
  ["disculpe", "excuse me formally", "phrase", null, "Disculpe, ¿puede ayudarme?"],
  ["¿me puede ayudar?", "can you help me formally?", "phrase", null, "Disculpe, ¿me puede ayudar?"],
  ["¿qué me recomienda?", "what do you recommend formally?", "phrase", null, "¿Qué me recomienda para cenar?"],
  ["repetir", "to repeat", "verb", null, "¿Puede repetir el número?"],
  ["preferir", "to prefer", "verb", null, "¿Prefiere esperar aquí?"],
  ["la forma de tratamiento", "form of address", "phrase", "feminine", "La forma de tratamiento depende de la relación."],
  ["respetuoso", "respectful", "adjective", "masculine", "El tono es claro y respetuoso."],
  ["la relación", "relationship", "noun", "feminine", "La relación cambia con el tiempo."],
  ["la confianza", "familiarity or trust", "noun", "feminine", "Con más confianza, usan tú."],
  ["una persona", "one person", "phrase", "feminine", "Usted se refiere a una persona."],
  ["un grupo", "a group", "phrase", "masculine", "Ustedes sirve para dirigirse a un grupo."]
];

const normalize = (value) => String(value || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñü]+/g, " ").trim();
const accepted = (value) => [...new Set([value, normalize(value), `${normalize(value)}.`, `${normalize(value)}?`, `${normalize(value)}!`])];
const tokenize = (value) => String(value || "").match(/[¿¡]?[^\s.,;:!?]+|[.,;:!?]/g) || [];

function checksFor(input) {
  const s = input.sentences;
  return [
    ...[0, 1, 2].map((index) => ({ key: `recognize-${index + 1}`, type: ExerciseType.MULTIPLE_CHOICE, question: s[index][1], correct: s[index][0], options: [s[index][0], s[(index + 1) % s.length][0], s[(index + 2) % s.length][0]] })),
    ...[3, 4].map((index) => ({ key: `build-${index + 1}`, type: ExerciseType.SENTENCE_BUILDER, question: s[index][1], correct: s[index][0] })),
    ...[0, 2].map((index) => ({ key: `translate-${index + 1}`, type: ExerciseType.TRANSLATION, question: s[index][1], correct: s[index][0] })),
    { key: "short-answer", type: ExerciseType.SHORT_ANSWER, question: s[1][1], correct: s[1][0] },
    { key: "dialogue-reply", type: ExerciseType.DIALOGUE_REPLY, question: s[3][1], correct: s[3][0] },
    { key: "write", type: ExerciseType.WRITING_PROMPT, question: s[4][1], correct: s[4][0] }
  ];
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "formal_address_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "formal_address_choice", rubric: "Keep addressee number, relationship, pronouns, and verb person consistent." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the Spanish form that fits the relationship" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the Spanish address frame" : "Respond in Spanish with consistent address",
    instruction: "First identify one person or a group and familiar or respectful relationship. Then choose the matching pronoun, verb form, and object forms.",
    questionText: check.question, answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 1 : check.type === ExerciseType.SENTENCE_BUILDER ? 2 : 3,
    order, xpReward: 13, imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "formal-address-service" },
    update: { title: "Tú, Usted, and Ustedes in Interaction", description: "Familiar and respectful singular address, plural address, service questions, polite requests, and negotiated changes in relationship.", cefrLevel: "A2", imageKey: "conversation-and-opinion:7" },
    create: { slug: "formal-address-service", title: "Tú, Usted, and Ustedes in Interaction", description: "Familiar and respectful singular address, plural address, service questions, polite requests, and negotiated changes in relationship.", cefrLevel: "A2", imageKey: "conversation-and-opinion:7" }
  });
  const vocabularyGroup = await prisma.vocabularyGroup.upsert({
    where: { slug: "a2-formal-address-service" },
    update: { title: "A2 Formal Address and Service", description: "Core words and chunks for respectful singular and plural interaction.", situation: "addressing unfamiliar people and groups", imageKey: "conversation-and-opinion:7" },
    create: { slug: "a2-formal-address-service", title: "A2 Formal Address and Service", description: "Core words and chunks for respectful singular and plural interaction.", situation: "addressing unfamiliar people and groups", imageKey: "conversation-and-opinion:7" }
  });
  for (const [spanish, english, partOfSpeech, gender, example] of vocabulary) {
    const existing = await prisma.word.findFirst({ where: { groupId: vocabularyGroup.id, spanish } });
    const data = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: vocabularyGroup.id };
    if (existing) await prisma.word.update({ where: { id: existing.id }, data });
    else await prisma.word.create({ data });
  }
  const supportingGroups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["useful-phrases", "people-and-pronouns"] } } });
  const groups = [vocabularyGroup, ...supportingGroups];
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Formal Interaction", situation: input.situation,
      imageKey: input.imageKey, outcomesJson: ["You can choose tú, usted, or ustedes from relationship and addressee number.", "You can keep pronouns and verb forms consistent through a practical exchange.", "You can ask, request, repair, and respond respectfully without translating German du and Sie mechanically."],
      conceptKeys: ["a2", "formal-address", "usted", "ustedes", input.slug], reviewSummary: input.summary, readingJson: input.readingJson,
      order: input.order, estimatedMinutes: input.checkpoint ? 18 : 15, topicId: topic.id
    };
    const lesson = await prisma.lesson.upsert({
      where: { slug: input.slug },
      update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } },
      create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } }
    });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const checks = checksFor(input);
    for (let index = 0; index < checks.length; index += 1) await saveExercise(lesson, input, checks[index], index + 1);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: { slug: { in: checks.map((check) => `${input.slug}-${check.key}`) } } } });
  }
  console.log(`Seeded ${lessons.length} A2.6 formal-address learning packages and ${vocabulary.length} aligned vocabulary items.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons, vocabulary };
