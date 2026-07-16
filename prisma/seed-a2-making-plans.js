const { PrismaClient, ExerciseType } = require("@prisma/client");
const { checkpointFunctionalCheck } = require("./checkpoint-functional-checks");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a2-invite-and-suggest", topicSlug: "making-plans-interaction", title: "Invite Someone and Suggest a Plan", order: 723, imageKey: "conversation-and-opinion:1",
    summary: "Open a real plan with quieres, te apetece, or podemos and name one concrete activity.", situation: "inviting a friend to do something",
    sentences: [
      ["¿Quieres tomar un café mañana?", "Do you want to have a coffee tomorrow?", "¿Quieres plus infinitive makes a direct, friendly invitation."],
      ["¿Te apetece ir al cine esta tarde?", "Do you feel like going to the cinema this afternoon?", "¿Te apetece...? asks whether an activity sounds appealing."],
      ["Podemos ir al parque después del trabajo.", "We can go to the park after work.", "Podemos presents a shared option without deciding for the other person."],
      ["¿Por qué no cenamos juntos el sábado?", "Why don't we have dinner together on Saturday?", "¿Por qué no...? turns a shared present form into a natural suggestion."],
      ["Tengo una idea: podemos visitar el museo.", "I have an idea: we can visit the museum.", "A short opening makes the proposal easy to follow."]
    ],
    readingJson: {
      title: "Una propuesta para después del trabajo",
      inputMode: "listening",
      orientationDe: "Höre zuerst, welche Form die Einladung eröffnet, und danach auf Tätigkeit und Zeitpunkt. Entscheide noch nicht, ob der Plan bereits feststeht.",
      orientationEn: "First listen for the frame that opens the invitation, then for the activity and time. Do not assume that the plan is already fixed.",
      paragraphs: [
        "Clara dice: Tengo una idea. ¿Quieres tomar un café mañana después del trabajo? Pablo no toma café por la tarde, pero quiere verla.",
        "Él responde: Podemos ir al parque y tomar un té. Clara dice que sí. Todavía no eligen la hora; solo tienen una actividad y un día posibles."
      ],
      questions: [
        { questionDe: "Was schlägt Clara zuerst vor?", questionEn: "What does Clara suggest first?", optionsDe: ["Morgen nach der Arbeit einen Kaffee trinken", "Am Samstag ins Museum gehen", "Heute Morgen frühstücken"], optionsEn: ["Have coffee tomorrow after work", "Go to the museum on Saturday", "Have breakfast this morning"], correct: 0, explanationDe: "¿Quieres tomar un café mañana después del trabajo? enthält Tätigkeit und Zeitpunkt der ersten Einladung.", explanationEn: "¿Quieres tomar un café mañana después del trabajo? contains the activity and time of the first invitation." },
        { questionDe: "Was ist am Ende noch nicht vereinbart?", questionEn: "What has not been agreed by the end?", optionsDe: ["Die genaue Uhrzeit", "Der mögliche Tag", "Dass beide sich sehen möchten"], optionsEn: ["The exact time", "The possible day", "That both want to meet"], correct: 0, explanationDe: "Todavía no eligen la hora sagt ausdrücklich, dass die genaue Zeit noch offen ist.", explanationEn: "Todavía no eligen la hora explicitly says that the exact time is still open." }
      ],
      recallPromptDe: "Lade eine Person auf Spanisch zu zwei unterschiedlichen Tätigkeiten ein. Verwende einmal ¿Quieres...?, einmal Podemos... und nenne jeweils einen Tag oder Tagesabschnitt.",
      recallPromptEn: "Invite someone in Spanish to two different activities. Use ¿Quieres...? once, Podemos... once, and include a day or part of the day each time.",
      modelSummary: "Clara quiere tomar un café mañana. Pablo propone ir al parque y tomar un té, pero todavía no acuerdan la hora."
    }
  },
  {
    slug: "a2-accept-or-decline", topicSlug: "making-plans-interaction", title: "Accept or Decline Without Ending the Conversation", order: 724, imageKey: "conversation-and-opinion:2",
    summary: "Accept warmly or decline politely with a short reason while keeping the exchange open.", situation: "responding to an invitation",
    sentences: [
      ["Sí, me encantaría.", "Yes, I would love to.", "Me encantaría is a warm acceptance stored as one useful reply."],
      ["Claro, me parece muy bien.", "Of course, that sounds very good to me.", "Me parece bien accepts the proposed plan rather than only saying yes."],
      ["Lo siento, no puedo porque trabajo.", "I'm sorry, I can't because I am working.", "Lo siento plus no puedo and a reason makes a refusal clear and considerate."],
      ["Esta tarde no puedo, pero mañana sí.", "I can't this afternoon, but I can tomorrow.", "Pero plus an available alternative keeps the conversation moving."],
      ["Gracias por invitarme, pero ya tengo planes.", "Thank you for inviting me, but I already have plans.", "Thanks can acknowledge the invitation before a polite refusal."]
    ],
    readingJson: {
      title: "Una respuesta que mantiene abierto el plan",
      orientationDe: "Lies jede Antwort als Gesprächshandlung: Annahme, begründete Absage oder Absage mit Alternative. Achte besonders darauf, ob der Austausch weitergehen kann.",
      orientationEn: "Read each reply as a conversational action: acceptance, reasoned refusal, or refusal with an alternative. Notice whether the exchange can continue.",
      paragraphs: [
        "Diego pregunta: ¿Te apetece cenar conmigo esta tarde? Sara responde: Gracias por invitarme, pero esta tarde no puedo porque trabajo hasta tarde.",
        "No quiere terminar la conversación y añade: Mañana sí puedo. Diego contesta: Perfecto, mañana me parece muy bien. Ahora tienen un día posible, pero todavía necesitan una hora."
      ],
      questions: [
        { questionDe: "Warum kann Sara heute nicht?", questionEn: "Why can't Sara meet today?", optionsDe: ["Sie arbeitet bis spät", "Sie mag Diego nicht", "Das Restaurant ist geschlossen"], optionsEn: ["She works until late", "She does not like Diego", "The restaurant is closed"], correct: 0, explanationDe: "No puedo porque trabajo hasta tarde nennt einen eindeutigen Grund, ohne die Einladung abzuwerten.", explanationEn: "No puedo porque trabajo hasta tarde gives a clear reason without rejecting the invitation itself." },
        { questionDe: "Wie hält Sara das Gespräch offen?", questionEn: "How does Sara keep the conversation open?", optionsDe: ["Sie bietet morgen als Alternative an", "Sie wechselt das Thema", "Sie antwortet nur mit nein"], optionsEn: ["She offers tomorrow as an alternative", "She changes the subject", "She only says no"], correct: 0, explanationDe: "Mañana sí puedo ersetzt den nicht möglichen Zeitpunkt direkt durch eine verfügbare Alternative.", explanationEn: "Mañana sí puedo directly replaces the unavailable time with an available alternative." }
      ],
      recallPromptDe: "Antworte auf Spanisch auf eine Einladung: Nimm sie einmal herzlich an. Lehne sie danach in einer zweiten Variante höflich mit Grund ab und biete einen anderen Tag an.",
      recallPromptEn: "Respond to an invitation in Spanish: accept warmly once, then give a second version that declines politely with a reason and offers another day.",
      modelSummary: "Sara no puede cenar esta tarde porque trabaja, pero propone mañana. Diego acepta la alternativa y los dos mantienen abierto el plan."
    }
  },
  {
    slug: "a2-negotiate-time-place", topicSlug: "making-plans-interaction", title: "Agree on a Time and Place", order: 725, imageKey: "conversation-and-opinion:3",
    summary: "Turn a possible plan into a concrete arrangement by negotiating time and meeting place.", situation: "agreeing when and where to meet",
    sentences: [
      ["¿Te va bien a las seis?", "Does six o'clock work for you?", "¿Te va bien...? checks whether a proposed time suits the other person."],
      ["A las seis no puedo. ¿Puede ser a las siete?", "I can't at six. Can it be at seven?", "Reject the time, not the whole plan, and immediately propose another one."],
      ["¿Quedamos delante del cine?", "Shall we meet in front of the cinema?", "Quedamos plus a place proposes a shared meeting point."],
      ["Mejor en la entrada, porque va a llover.", "Better at the entrance, because it is going to rain.", "Mejor introduces a preferred alternative and porque explains it."],
      ["Entonces, a las siete en la entrada.", "So, at seven at the entrance.", "Entonces can summarize the agreed time and place."]
    ],
    readingJson: {
      title: "Encontrar una hora que funciona para los dos",
      inputMode: "listening",
      orientationDe: "Höre auf drei getrennte Schritte: Zeit vorschlagen, bei Bedarf eine Alternative nennen und anschließend Zeit sowie Treffpunkt gemeinsam bestätigen.",
      orientationEn: "Listen for three separate steps: propose a time, offer an alternative if needed, and then confirm both the time and meeting place together.",
      paragraphs: [
        "Nora pregunta: ¿Te va bien a las seis? Luis responde que a las seis no puede porque sale del trabajo a esa hora. Propone las siete.",
        "Nora acepta y pregunta: ¿Quedamos delante del cine? Como va a llover, Luis prefiere la entrada. Nora resume: Entonces, a las siete en la entrada."
      ],
      questions: [
        { questionDe: "Warum lehnt Luis sechs Uhr ab?", questionEn: "Why does Luis reject six o'clock?", optionsDe: ["Dann verlässt er erst die Arbeit", "Er möchte den Film nicht sehen", "Nora kommt erst um acht"], optionsEn: ["He only leaves work then", "He does not want to see the film", "Nora only arrives at eight"], correct: 0, explanationDe: "Sale del trabajo a esa hora macht sechs Uhr unpraktisch; Luis lehnt damit nur den Zeitpunkt ab.", explanationEn: "Sale del trabajo a esa hora makes six impractical; Luis rejects only the time." },
        { questionDe: "Welche vollständige Vereinbarung gilt am Ende?", questionEn: "What complete arrangement applies at the end?", optionsDe: ["Um sieben am Eingang", "Um sechs vor dem Kino", "Um sieben bei der Arbeit"], optionsEn: ["At seven at the entrance", "At six in front of the cinema", "At seven at work"], correct: 0, explanationDe: "Entonces, a las siete en la entrada fasst die beiden vereinbarten Angaben zusammen.", explanationEn: "Entonces, a las siete en la entrada summarizes the two agreed details." }
      ],
      recallPromptDe: "Handle auf Spanisch einen Treffpunkt aus: Schlage eine Uhrzeit vor, lehne sie in der Antwort mit kurzem Grund ab, nenne eine Alternative und bestätige am Ende Zeit und Ort.",
      recallPromptEn: "Negotiate a meeting in Spanish: propose a time, reject it with a short reason, offer an alternative, and confirm the final time and place.",
      modelSummary: "Luis no puede a las seis y propone las siete. Nora acepta. Como va a llover, quedan a las siete en la entrada del cine."
    }
  },
  {
    slug: "a2-change-or-cancel-plan", topicSlug: "making-plans-interaction", title: "Change a Plan Clearly and Politely", order: 726, imageKey: "conversation-and-opinion:4",
    summary: "Explain a change, apologize briefly, and propose a concrete replacement instead of disappearing.", situation: "changing an existing arrangement",
    sentences: [
      ["Perdona, no puedo llegar a las siete.", "Sorry, I can't arrive at seven.", "Begin with a brief apology and state exactly what no longer works."],
      ["Tengo que cambiar la hora.", "I have to change the time.", "Tengo que cambiar names the necessary change directly."],
      ["¿Podemos quedar media hora más tarde?", "Can we meet half an hour later?", "¿Podemos...? proposes a shared repair rather than imposing it."],
      ["Si no puedes, lo dejamos para mañana.", "If you can't, we can leave it until tomorrow.", "Si no puedes offers a simple backup without pressure."],
      ["Gracias por avisar. A las siete y media está bien.", "Thanks for letting me know. Seven thirty is fine.", "Acknowledge the message, then confirm the new time."]
    ],
    readingJson: {
      title: "Cambiar el plan sin crear otra duda",
      orientationDe: "Lies zuerst, was sich geändert hat. Suche danach Entschuldigung, Grund oder Notwendigkeit, konkrete Alternative und Bestätigung des neuen Plans.",
      orientationEn: "First identify what changed. Then find the apology, reason or necessity, concrete alternative, and confirmation of the new plan.",
      paragraphs: [
        "Marta escribe: Perdona, tengo que cambiar la hora porque el autobús llega tarde. No puedo estar allí a las siete. ¿Podemos quedar media hora más tarde?",
        "Álex responde: Gracias por avisar. A las siete y media está bien. Entonces nos vemos en la misma cafetería. La actividad y el lugar no cambian; solo cambia la hora."
      ],
      questions: [
        { questionDe: "Welcher Teil des Plans ändert sich?", questionEn: "Which part of the plan changes?", optionsDe: ["Nur die Uhrzeit", "Die Tätigkeit und der Ort", "Die eingeladenen Personen"], optionsEn: ["Only the time", "The activity and place", "The invited people"], correct: 0, explanationDe: "Solo cambia la hora grenzt die Änderung ausdrücklich von Tätigkeit und Ort ab.", explanationEn: "Solo cambia la hora explicitly separates the change from the activity and place." },
        { questionDe: "Woran erkennt man, dass der neue Plan feststeht?", questionEn: "How do we know the new plan is fixed?", optionsDe: ["Álex bestätigt halb acht und dieselbe Cafeteria", "Marta stellt nur eine offene Frage", "Beide sagen das Treffen ab"], optionsEn: ["Álex confirms seven thirty and the same café", "Marta only asks an open question", "Both cancel the meeting"], correct: 0, explanationDe: "A las siete y media está bien und nos vemos en la misma cafetería bestätigen neue Zeit und bestehenden Ort.", explanationEn: "A las siete y media está bien and nos vemos en la misma cafetería confirm the new time and existing place." }
      ],
      recallPromptDe: "Ändere auf Spanisch eine bestehende Verabredung: Entschuldige dich kurz, nenne präzise, was nicht mehr funktioniert, schlage eine neue Uhrzeit vor und bestätige anschließend den reparierten Plan.",
      recallPromptEn: "Change an existing arrangement in Spanish: apologize briefly, say exactly what no longer works, propose a new time, and then confirm the repaired plan.",
      modelSummary: "Marta no puede llegar a las siete porque el autobús llega tarde. Propone las siete y media, Álex acepta y confirma la misma cafetería."
    }
  },
  {
    slug: "a2-clarify-and-confirm", topicSlug: "making-plans-interaction", title: "Clarify and Confirm the Agreement", order: 727, imageKey: "conversation-and-opinion:5",
    summary: "Repair a detail you did not understand and close the exchange with a complete confirmation.", situation: "checking an unclear arrangement",
    sentences: [
      ["Perdona, no he entendido la hora.", "Sorry, I didn't understand the time.", "Name the exact missing detail instead of only saying no entiendo."],
      ["¿Has dicho a las seis o a las siete?", "Did you say six or seven?", "An either-or question makes the repair quick and precise."],
      ["Quiero decir a las siete, no a las seis.", "I mean seven, not six.", "Quiero decir replaces the misunderstood detail explicitly."],
      ["Entonces, ¿nos vemos el viernes a las siete?", "So, shall we see each other on Friday at seven?", "Entonces plus a full question checks the shared result."],
      ["Sí, el viernes a las siete delante de la estación.", "Yes, Friday at seven in front of the station.", "Repeat the decisive details to close the coordination loop."]
    ],
    readingJson: {
      title: "Una hora mal entendida",
      inputMode: "listening",
      orientationDe: "Höre nicht nur auf das letzte Ja. Finde zuerst die unklare Angabe, dann die gezielte Rückfrage, die Korrektur und schließlich die vollständige Bestätigung.",
      orientationEn: "Do not listen only for the final yes. First find the unclear detail, then the focused question, correction, and complete confirmation.",
      paragraphs: [
        "Iván oye una Nachricht von Elena, aber die Uhrzeit ist nicht klar. Er fragt: Perdona, ¿has dicho a las seis o a las siete?",
        "Elena antwortet: Quiero decir a las siete. Iván prüft den ganzen Plan: Entonces, ¿nos vemos el viernes a las siete delante de la estación? Elena bestätigt alle drei Angaben."
      ],
      questions: [
        { questionDe: "Welche Einzelheit hat Iván nicht sicher verstanden?", questionEn: "Which detail did Iván not understand securely?", optionsDe: ["Die Uhrzeit", "Den Wochentag", "Die Person"], optionsEn: ["The time", "The day", "The person"], correct: 0, explanationDe: "¿Has dicho a las seis o a las siete? isoliert genau die unsichere Zeitangabe.", explanationEn: "¿Has dicho a las seis o a las siete? isolates the uncertain time detail." },
        { questionDe: "Warum wiederholt Iván am Ende Tag, Zeit und Ort?", questionEn: "Why does Iván repeat the day, time, and place at the end?", optionsDe: ["Um ein gemeinsames eindeutiges Ergebnis zu prüfen", "Um die Einladung abzulehnen", "Um einen neuen Ort vorzuschlagen"], optionsEn: ["To check one shared unambiguous result", "To decline the invitation", "To propose a new place"], correct: 0, explanationDe: "Die vollständige Rückfrage verhindert, dass nach der reparierten Uhrzeit ein anderer Teil des Plans unklar bleibt.", explanationEn: "The full question prevents another part of the plan from remaining unclear after the time is repaired." }
      ],
      recallPromptDe: "Repariere auf Spanisch eine unklare Verabredung: Sage, welche Angabe du nicht verstanden hast, stelle eine Entweder-oder-Frage und bestätige anschließend Tag, Zeit und Ort vollständig.",
      recallPromptEn: "Repair an unclear arrangement in Spanish: say which detail you did not understand, ask an either-or question, and then confirm day, time, and place in full.",
      modelSummary: "Iván no ha entendido la hora. Elena aclara que es a las siete y después confirman el viernes a las siete delante de la estación."
    }
  },
  {
    slug: "a2-complete-plan-dialogue", topicSlug: "making-plans-interaction", title: "Carry a Plan from Invitation to Confirmation", order: 728, imageKey: "conversation-and-opinion:6",
    summary: "Combine invitation, response, negotiation, reason, and confirmation in one short connected exchange.", situation: "holding a complete planning conversation",
    sentences: [
      ["¿Te apetece ir al mercado el sábado?", "Do you feel like going to the market on Saturday?", "Open with an activity and a possible day."],
      ["El sábado por la mañana no puedo, pero por la tarde sí.", "I can't on Saturday morning, but I can in the afternoon.", "Contrast the unavailable and available periods."],
      ["Perfecto. ¿Te va bien a las cinco?", "Perfect. Does five o'clock work for you?", "React before negotiating the next missing detail."],
      ["Sí. ¿Quedamos en la entrada principal?", "Yes. Shall we meet at the main entrance?", "Accept the time and move the conversation to place."],
      ["De acuerdo. Entonces, el sábado a las cinco en la entrada principal.", "Agreed. So, Saturday at five at the main entrance.", "A complete final summary proves that the plan is shared."]
    ],
    readingJson: {
      title: "De la primera propuesta al plan completo",
      orientationDe: "Ordne den Dialog nach Funktionen statt nach Einzelsätzen: Einladung, eingeschränkte Verfügbarkeit, Zeitvorschlag, Treffpunkt und vollständige Schlussbestätigung.",
      orientationEn: "Organize the dialogue by functions rather than isolated sentences: invitation, limited availability, time proposal, meeting point, and full final confirmation.",
      paragraphs: [
        "Raúl pregunta a Inés si quiere ir al mercado el sábado. Inés acepta la actividad, pero por la mañana no puede porque trabaja. Por la tarde sí está libre.",
        "Raúl propone las cinco e Inés acepta. Ella propone la entrada principal como punto de encuentro. Antes de terminar, Raúl repite: el sábado a las cinco en la entrada principal."
      ],
      questions: [
        { questionDe: "Welche Reaktion hält Inés' Antwort im Gespräch?", questionEn: "Which move keeps Inés's answer in the conversation?", optionsDe: ["Sie bietet den Nachmittag als verfügbare Zeit an", "Sie sagt nur, dass sie arbeitet", "Sie ändert die Tätigkeit ohne Erklärung"], optionsEn: ["She offers the afternoon as an available time", "She only says that she works", "She changes the activity without explanation"], correct: 0, explanationDe: "Por la mañana no puedo, pero por la tarde sí verbindet Grenze und unmittelbar nutzbare Alternative.", explanationEn: "Por la mañana no puedo, pero por la tarde sí combines a limit with an immediately usable alternative." },
        { questionDe: "Welche fünf Gesprächsschritte enthält der Dialog?", questionEn: "Which five conversational steps does the dialogue contain?", optionsDe: ["Einladung, Antwort, Zeit, Ort und Bestätigung", "Begrüßung, Bestellung, Preis, Zahlung und Abschied", "Frage, Geschichte, Meinung, Vergleich und Beschwerde"], optionsEn: ["Invitation, reply, time, place, and confirmation", "Greeting, order, price, payment, and farewell", "Question, story, opinion, comparison, and complaint"], correct: 0, explanationDe: "Jeder Gesprächszug löst genau eine noch offene Koordinationsaufgabe, bis ein vollständiger gemeinsamer Plan entsteht.", explanationEn: "Each turn solves one open coordination task until a complete shared plan exists." }
      ],
      recallPromptDe: "Führe den vollständigen Dialog auf Spanisch neu: Lade ein, lehne einen Zeitraum mit Grund ab, biete eine Alternative, handle Uhrzeit und Ort aus und schließe mit einer vollständigen Bestätigung.",
      recallPromptEn: "Recreate the complete dialogue in Spanish: invite, decline one time period with a reason, offer an alternative, negotiate time and place, and close with full confirmation.",
      modelSummary: "Raúl invita a Inés para el sábado. Ella solo puede por la tarde. Quedan a las cinco en la entrada principal y confirman el plan completo."
    }
  },
  {
    slug: "checkpoint-a2-making-plans", topicSlug: "making-plans-interaction", title: "A2.5 Making Plans and Coordination Checkpoint", order: 729, imageKey: "conversation-and-opinion:16", checkpoint: true,
    summary: "Prove that you can open, negotiate, repair, and confirm a practical arrangement without a visible script.", situation: "coordinating a complete plan independently",
    sentences: [
      ["¿Quieres hacer algo el domingo?", "Do you want to do something on Sunday?", "Open the exchange without prescribing every detail."],
      ["Por la mañana no puedo, pero por la tarde sí.", "I can't in the morning, but I can in the afternoon.", "State a limit and preserve a usable alternative."],
      ["¿Te va bien a las cuatro?", "Does four o'clock work for you?", "Check a concrete time rather than assuming it."],
      ["Perdona, ¿has dicho a las cuatro o a las cinco?", "Sorry, did you say four or five?", "Repair only the uncertain detail."],
      ["Entonces, el domingo a las cuatro delante del museo.", "So, Sunday at four in front of the museum.", "Close with day, time, and place."],
      ["Si cambia algo, te aviso.", "If anything changes, I will let you know.", "A short contingency frame protects the agreement after it is made."]
    ],
    readingJson: {
      title: "Checkpoint: un plan con cambio y reparación",
      inputMode: "listening",
      orientationDe: "Höre ohne Satzhilfe auf die gesamte Koordinationskette. Halte fest, was zuerst vorgeschlagen, abgelehnt, ersetzt, missverstanden und am Ende tatsächlich bestätigt wird.",
      orientationEn: "Listen without sentence support for the entire coordination chain. Track what is proposed, declined, replaced, misunderstood, and finally confirmed.",
      paragraphs: [
        "Sofía invita a Leo a visitar el museo el domingo. Leo no puede por la mañana, pero propone la tarde. Sofía pregunta si las cuatro le van bien.",
        "Leo no oye la hora y pregunta si ha dicho las cuatro o las cinco. Sofía aclara las cuatro. Al final confirman el domingo a las cuatro delante del museo."
      ],
      questions: [
        { questionDe: "Welche Alternative bietet Leo an?", questionEn: "What alternative does Leo offer?", optionsDe: ["Sonntagnachmittag", "Samstagmorgen", "Montagabend"], optionsEn: ["Sunday afternoon", "Saturday morning", "Monday evening"], correct: 0, explanationDe: "No puede por la mañana, pero propone la tarde ersetzt den unmöglichen Tagesabschnitt.", explanationEn: "No puede por la mañana, pero propone la tarde replaces the unavailable part of the day." },
        { questionDe: "Welche Vereinbarung gilt nach der Reparatur?", questionEn: "What arrangement applies after the repair?", optionsDe: ["Sonntag um vier vor dem Museum", "Sonntag um fünf im Museum", "Samstag um vier vor dem Kino"], optionsEn: ["Sunday at four in front of the museum", "Sunday at five in the museum", "Saturday at four in front of the cinema"], correct: 0, explanationDe: "Die Klärung ersetzt die unsichere Uhrzeit; der letzte Satz bestätigt Tag, vier Uhr und den Ort vor dem Museum.", explanationEn: "The clarification replaces the uncertain time; the final sentence confirms the day, four o'clock, and the place in front of the museum." }
      ],
      recallPromptDe: "Plane ohne Vorlage ein Treffen auf Spanisch. Deine Antwort muss Einladung, eingeschränkte Verfügbarkeit, Alternative, Uhrzeitfrage, gezielte Reparatur und eine vollständige Bestätigung enthalten.",
      recallPromptEn: "Plan a meeting in Spanish without a model. Include an invitation, limited availability, an alternative, a time question, focused repair, and full confirmation.",
      modelSummary: "Leo solo puede el domingo por la tarde. Después de aclarar la hora, confirman el domingo a las cuatro delante del museo."
    }
  }
];

const tokenize = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`, `${plain}?`];
};

function checksFor(input) {
  const checks = [
    { key: "meaning", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: [input.sentences[0][0], input.sentences[1][0], input.sentences[2][0]] },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correct: input.sentences[1][0] },
    { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "translate", type: ExerciseType.TRANSLATION, question: input.sentences[3][1], correct: input.sentences[3][0] },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
  if (input.checkpoint) checks.push({ key: "contingency", type: ExerciseType.WRITING_PROMPT, question: input.sentences[5][1], correct: input.sentences[5][0] });
  return checks;
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const functionalCheck = checkpointFunctionalCheck(slug);
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "plan_coordination_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "plan_coordination", rubric: "Complete the intended conversational move in clear Spanish.", ...(functionalCheck ? { functionalCheck } : {}) };
  const data = {
    lessonId: lesson.id,
    topicId: lesson.topicId,
    type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the Spanish conversational move" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the Spanish reply" : "Continue the plan in Spanish",
    instruction: "First decide the conversational job: invite, respond, negotiate, repair, or confirm. Then retrieve the complete Spanish frame.",
    questionText: check.question,
    answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 1 : check.type === ExerciseType.SENTENCE_BUILDER ? 2 : 3,
    order,
    xpReward: 13,
    imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) {
    await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
  }
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "making-plans-interaction" },
    update: { title: "Making Plans and Everyday Coordination", description: "Invitations, polite responses, time and place negotiation, changes, clarification, and complete confirmation.", cefrLevel: "A2", imageKey: "conversation-and-opinion:1" },
    create: { slug: "making-plans-interaction", title: "Making Plans and Everyday Coordination", description: "Invitations, polite responses, time and place negotiation, changes, clarification, and complete confirmation.", cefrLevel: "A2", imageKey: "conversation-and-opinion:1" }
  });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["daily-actions", "places-around-town", "weather-and-time", "essential-words"] } } });
  for (const input of lessons) {
    const common = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "A2",
      theme: input.checkpoint ? "Checkpoint" : "Everyday Interaction",
      situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: ["You can identify the next conversational job before choosing words.", "You can keep a plan moving with a reason, alternative, or focused repair.", "You can confirm day, time, and place in connected Spanish without a visible model."],
      conceptKeys: ["a2", "making-plans", "interaction", input.slug],
      reviewSummary: input.summary,
      readingJson: input.readingJson,
      order: input.order,
      estimatedMinutes: input.checkpoint ? 18 : 15,
      topicId: topic.id
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
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} A2.5 making-plans interaction packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
