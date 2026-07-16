const { PrismaClient, ExerciseType } = require("@prisma/client");
const { checkpointFunctionalCheck } = require("./checkpoint-functional-checks");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a2-identify-product-problem", title: "Identify a Product Problem Clearly", order: 831.1, imageKey: "shopping-and-services:5",
    summary: "Name the item, the concrete fault, when it began, and the proof you have before asking for a solution.", situation: "returning a faulty item to a shop",
    sentences: [
      ["Disculpe, este teléfono no funciona.", "Excuse me, this phone does not work.", "Open politely and name one concrete problem instead of saying only that something is bad."],
      ["La pantalla está rota.", "The screen is broken.", "Estar plus rota describes the current condition and agrees with la pantalla."],
      ["Lo compré ayer.", "I bought it yesterday.", "Lo replaces el teléfono and compré gives the relevant completed purchase."],
      ["El problema empezó esta mañana.", "The problem started this morning.", "A precise time detail helps the employee understand the case."],
      ["Aquí tiene el recibo.", "Here is the receipt.", "Aquí tiene hands over proof while maintaining respectful usted address."]
    ],
    readingJson: {
      title: "Primero, el problema y los datos",
      orientationDe: "Suche vier Bausteine: Gegenstand, genauer Defekt, Zeitpunkt und Beleg. Noch wird keine Lösung diskutiert; die Kundin macht das Problem zuerst so konkret, dass die andere Person sinnvoll reagieren kann.",
      orientationEn: "Find four building blocks: item, exact fault, time, and proof. No solution is discussed yet; the customer first makes the problem concrete enough for the other person to respond.",
      paragraphs: [
        "Clara vuelve a una tienda con un teléfono. Dice: Disculpe, este teléfono no funciona. La pantalla está rota y el problema empezó esta mañana.",
        "El empleado pregunta cuándo compró el teléfono. Clara responde: Lo compré ayer. Aquí tiene el recibo. Ahora el empleado conoce el objeto, el defecto, el momento y la prueba de compra."
      ],
      questions: [
        { questionDe: "Welche vier Angaben liefert Clara?", questionEn: "Which four details does Clara provide?", optionsDe: ["Gegenstand, Defekt, Zeitpunkt und Beleg", "Nur Preis und Farbe", "Adresse, Beruf und Alter"], optionsEn: ["Item, fault, time, and proof", "Only price and color", "Address, job, and age"], correct: 0, explanationDe: "Telefon, kaputte Anzeige, Beginn am Morgen und Kassenbon bilden gemeinsam eine bearbeitbare Problembeschreibung.", explanationEn: "The phone, broken screen, start time, and receipt together form an actionable problem description." },
        { questionDe: "Wofür steht lo in Lo compré ayer?", questionEn: "What does lo replace in Lo compré ayer?", optionsDe: ["Für el teléfono", "Für la pantalla", "Für la tienda"], optionsEn: ["El teléfono", "La pantalla", "La tienda"], correct: 0, explanationDe: "Das bereits genannte männliche Singularobjekt el teléfono wird nicht unnötig wiederholt.", explanationEn: "The already named masculine singular object el teléfono is not repeated unnecessarily." }
      ],
      recallPromptDe: "Melde auf Spanisch einen Defekt in vier kurzen Schritten: höflich eröffnen, Gegenstand und Fehler nennen, den Zeitpunkt ergänzen und den Beleg übergeben. Bitte noch nicht um eine Lösung.",
      recallPromptEn: "Report a fault in Spanish in four short steps: open politely, name the item and fault, add the time, and hand over proof. Do not request a solution yet.",
      modelSummary: "Clara explica que el teléfono no funciona, precisa que la pantalla está rota, indica cuándo empezó el problema y entrega el recibo."
    }
  },
  {
    slug: "a2-request-exchange-or-refund", title: "Request an Exchange or Refund", order: 831.2, imageKey: "shopping-and-services:6",
    summary: "Ask for one preferred solution, understand an alternative, and accept or reject it without losing the conversation.", situation: "negotiating a solution for a faulty purchase",
    sentences: [
      ["Quisiera cambiarlo por otro.", "I would like to exchange it for another one.", "Cambiarlo keeps the known masculine item attached to the infinitive; por otro names the replacement."],
      ["¿Puede devolverme el dinero?", "Can you refund my money?", "The respectful puede frame asks for a different concrete solution."],
      ["No tenemos el mismo modelo.", "We do not have the same model.", "The employee states the relevant limit instead of ending the exchange."],
      ["Entonces prefiero otro teléfono.", "Then I prefer another phone.", "Entonces marks a decision that follows from the new information."],
      ["Sí, esta solución me parece bien.", "Yes, this solution seems good to me.", "A complete acceptance names the solution rather than relying on an unclear sí."]
    ],
    readingJson: {
      title: "Una petición y una alternativa",
      inputMode: "listening",
      orientationDe: "Höre zuerst nur auf Claras Wunsch. Unterscheide danach Grenze, Alternative und ausdrückliche Annahme. Das Lernziel ist nicht ein einzelner Satz, sondern eine kleine Verhandlung mit klarem Ergebnis.",
      orientationEn: "First listen only for Clara's preferred solution. Then distinguish the limit, alternative, and explicit acceptance. The goal is a short negotiation with a clear outcome.",
      paragraphs: [
        "Clara dice: Quisiera cambiarlo por otro. El empleado explica: Lo siento, no tenemos el mismo modelo. ¿Prefiere otro teléfono o la devolución del dinero?",
        "Clara mira las opciones y responde: Entonces prefiero otro teléfono. El empleado muestra un modelo parecido. Clara confirma: Sí, esta solución me parece bien."
      ],
      questions: [
        { questionDe: "Warum bekommt Clara nicht dasselbe Modell?", questionEn: "Why does Clara not get the same model?", optionsDe: ["Das Geschäft hat es nicht", "Sie hat keinen Beleg", "Sie möchte keinen Austausch"], optionsEn: ["The shop does not have it", "She has no receipt", "She does not want an exchange"], correct: 0, explanationDe: "No tenemos el mismo modelo setzt die konkrete Grenze, auf die Clara mit einer neuen Wahl reagiert.", explanationEn: "No tenemos el mismo modelo states the concrete limit that prompts Clara to make a new choice." },
        { questionDe: "Wie schließt Clara die Lösungsschleife?", questionEn: "How does Clara close the solution loop?", optionsDe: ["Sie nennt die Lösung ausdrücklich passend", "Sie sagt nur vielleicht", "Sie beginnt erneut mit dem Defekt"], optionsEn: ["She explicitly accepts the solution", "She only says maybe", "She starts the fault report again"], correct: 0, explanationDe: "Esta solución me parece bien bestätigt eindeutig, worauf beide Seiten sich geeinigt haben.", explanationEn: "Esta solución me parece bien clearly confirms what both sides have agreed on." }
      ],
      recallPromptDe: "Bitte auf Spanisch höflich um Austausch. Lass das gewünschte Modell fehlen, wähle deshalb eine angebotene Alternative und bestätige am Ende ausdrücklich, dass diese Lösung für dich passt.",
      recallPromptEn: "Politely request an exchange in Spanish. Let the desired model be unavailable, choose an offered alternative, and explicitly confirm that the solution works for you.",
      modelSummary: "Clara pide cambiar el teléfono. Como no queda el mismo modelo, elige otro y confirma claramente que la solución le parece bien."
    }
  },
  {
    slug: "a2-report-home-problem", title: "Report a Problem at Home", order: 831.3, imageKey: "home-and-routine:8",
    summary: "Describe a household problem by location and consequence, then request one concrete service action.", situation: "calling a landlord or reception desk about a housing problem",
    sentences: [
      ["Buenos días, tengo un problema en el apartamento.", "Good morning, I have a problem in the apartment.", "The opening establishes the purpose without overloading the first turn."],
      ["No hay agua caliente en el baño.", "There is no hot water in the bathroom.", "No hay reports what is missing and en el baño locates it."],
      ["La calefacción tampoco funciona.", "The heating does not work either.", "Tampoco adds a second negative fact without repeating the entire frame."],
      ["No puedo usar la ducha.", "I cannot use the shower.", "No puedo plus infinitive gives the practical consequence."],
      ["¿Puede enviar a alguien para revisarlo?", "Can you send someone to check it?", "The polite request names one actionable response; lo refers to the reported problem or system."]
    ],
    readingJson: {
      title: "Del problema a una acción concreta",
      orientationDe: "Ordne jeden Satz einer Funktion zu: Gesprächszweck, fehlende Leistung, zweites Symptom, praktische Folge und gewünschte Handlung. So entsteht aus losen Beschwerden eine bearbeitbare Meldung.",
      orientationEn: "Assign each sentence a function: purpose, missing service, second symptom, practical consequence, and requested action. This turns loose complaints into an actionable report.",
      paragraphs: [
        "Nico llama a la recepción de su edificio: Buenos días, tengo un problema en el apartamento. No hay agua caliente en el baño y la calefacción tampoco funciona.",
        "Añade la consecuencia: No puedo usar la ducha. Después pide una acción concreta: ¿Puede enviar a alguien para revisarlo? La recepcionista solicita la dirección y propone una visita."
      ],
      questions: [
        { questionDe: "Welche praktische Folge nennt Nico?", questionEn: "What practical consequence does Nico state?", optionsDe: ["Er kann die Dusche nicht benutzen", "Er kann das Telefon nicht kaufen", "Er verpasst einen Zug"], optionsEn: ["He cannot use the shower", "He cannot buy the phone", "He misses a train"], correct: 0, explanationDe: "Die Folge zeigt, warum das Problem nicht nur eine allgemeine Unzufriedenheit ist.", explanationEn: "The consequence shows why the problem is more than a general complaint." },
        { questionDe: "Warum ist die letzte Frage handlungsfähig?", questionEn: "Why is the final question actionable?", optionsDe: ["Sie bittet konkret darum, jemanden zur Prüfung zu schicken", "Sie nennt nur das Wort Problem", "Sie verlangt keine Reaktion"], optionsEn: ["It specifically asks for someone to be sent to inspect it", "It only says the word problem", "It requests no response"], correct: 0, explanationDe: "Enviar a alguien para revisarlo benennt die nächste mögliche Handlung der Servicestelle.", explanationEn: "Enviar a alguien para revisarlo names the next possible action for the service desk." }
      ],
      recallPromptDe: "Melde auf Spanisch ein Wohnungsproblem: eröffne den Anruf, nenne Ort und zwei Beobachtungen, erkläre eine konkrete Folge und bitte die Servicestelle um genau eine Handlung.",
      recallPromptEn: "Report a housing problem in Spanish: open the call, name the location and two observations, explain one concrete consequence, and ask the service desk for one action.",
      modelSummary: "Nico informa de que no hay agua caliente y la calefacción no funciona. Explica la consecuencia y pide que envíen a alguien para revisar el problema."
    }
  },
  {
    slug: "a2-arrange-repair-visit", title: "Arrange a Repair Visit", order: 831.4, imageKey: "home-and-routine:9",
    summary: "Exchange availability, choose a workable time window, provide access details, and restate the appointment.", situation: "arranging when a technician can visit",
    sentences: [
      ["El técnico puede ir mañana por la mañana.", "The technician can come tomorrow morning.", "Puede ir introduces the offered visit window."],
      ["Por la mañana trabajo. ¿Puede ser por la tarde?", "I work in the morning. Can it be in the afternoon?", "A short reason plus a concrete alternative keeps coordination moving."],
      ["Sí, entre las cuatro y las seis.", "Yes, between four and six.", "Entre ... y ... expresses a service time window rather than one exact minute."],
      ["La dirección es calle Sol, número doce, tercero B.", "The address is 12 Sol Street, third floor, apartment B.", "Give access information in small checkable units."],
      ["Entonces, mañana entre las cuatro y las seis.", "So, tomorrow between four and six.", "Entonces restates day and time window to close the coordination loop."]
    ],
    readingJson: {
      title: "Una franja que funciona para los dos",
      inputMode: "listening",
      orientationDe: "Höre im ersten Durchgang auf angebotenen und abgelehnten Zeitraum. Sammle danach Adresse und endgültige Terminspanne. Eine Servicezeit ist oft ein Fenster und keine einzelne Uhrzeit.",
      orientationEn: "On the first pass, listen for the offered and rejected period. Then collect the address and final time window. A service visit often uses a window rather than one exact time.",
      paragraphs: [
        "La recepcionista dice que el técnico puede ir mañana por la mañana. Nico responde: Por la mañana trabajo. ¿Puede ser por la tarde? Ella ofrece una franja entre las cuatro y las seis.",
        "Nico acepta y da la dirección por partes: calle Sol, número doce, tercero B. Antes de terminar confirma: Entonces, mañana entre las cuatro y las seis."
      ],
      questions: [
        { questionDe: "Warum bittet Nico um den Nachmittag?", questionEn: "Why does Nico ask for the afternoon?", optionsDe: ["Er arbeitet am Vormittag", "Er kennt seine Adresse nicht", "Der Techniker kam gestern"], optionsEn: ["He works in the morning", "He does not know his address", "The technician came yesterday"], correct: 0, explanationDe: "Por la mañana trabajo begründet die Grenze knapp; die anschließende Alternative hält den Termin möglich.", explanationEn: "Por la mañana trabajo briefly explains the constraint; the following alternative keeps the appointment possible." },
        { questionDe: "Welche Angaben bestätigt Nico am Ende?", questionEn: "Which details does Nico confirm at the end?", optionsDe: ["Tag und Zeitfenster", "Nur den Namen des Technikers", "Farbe und Preis"], optionsEn: ["Day and time window", "Only the technician's name", "Color and price"], correct: 0, explanationDe: "Mañana entre las cuatro y las seis wiederholt die entscheidenden Termindaten gemeinsam.", explanationEn: "Mañana entre las cuatro y las seis repeats the decisive appointment details together." }
      ],
      recallPromptDe: "Führe auf Spanisch eine Terminabsprache: lehne den ersten Zeitraum mit kurzem Grund ab, schlage einen anderen vor, nenne eine vollständige Adresse und bestätige Tag plus Zeitfenster.",
      recallPromptEn: "Arrange a visit in Spanish: decline the first period with a short reason, suggest another, give a complete address, and confirm the day plus time window.",
      modelSummary: "Nico no puede por la mañana, propone la tarde, acepta la franja ofrecida, da la dirección y confirma el día y las horas de la visita."
    }
  },
  {
    slug: "a2-understand-next-service-step", title: "Understand and Confirm the Next Service Step", order: 831.5, imageKey: "home-and-routine:10",
    summary: "Ask what will happen next, check your own responsibility, and repeat the final arrangement in plain Spanish.", situation: "confirming what happens after a service request",
    sentences: [
      ["El técnico va a llamar antes de ir.", "The technician is going to call before coming.", "Ir a gives the agreed next step; antes de plus infinitive orders the actions."],
      ["¿Tengo que estar en casa?", "Do I have to be at home?", "Tengo que checks the customer's own obligation."],
      ["Sí, alguien tiene que abrir la puerta.", "Yes, someone has to open the door.", "The reply gives the reason for that obligation."],
      ["Si no puede venir, nos llama.", "If the technician cannot come, they call us.", "The present-tense si frame states a realistic contingency without introducing future grammar."],
      ["De acuerdo: espero la llamada y estoy en casa.", "All right: I will wait for the call and be at home.", "The customer restates both responsibilities as a final understanding check."]
    ],
    readingJson: {
      title: "Qué pasa ahora y qué debo hacer",
      orientationDe: "Trenne die Verantwortung des Dienstes von deiner eigenen. Markiere außerdem den Plan B. Am Ende sollst du nicht nur sí sagen, sondern beide übernommenen Schritte selbst wiedergeben.",
      orientationEn: "Separate the service provider's responsibility from your own. Also identify the backup plan. At the end, do not just say yes; restate both steps you have accepted.",
      paragraphs: [
        "La recepcionista explica: El técnico va a llamar antes de ir. Nico pregunta: ¿Tengo que estar en casa? Ella responde que sí, porque alguien tiene que abrir la puerta.",
        "También acuerdan un plan B: Si no puede venir, nos llama. Nico cierra la conversación con sus propias palabras: De acuerdo: espero la llamada y estoy en casa."
      ],
      questions: [
        { questionDe: "Was macht der Techniker vor dem Besuch?", questionEn: "What does the technician do before the visit?", optionsDe: ["Er ruft an", "Er schickt einen Kassenbon", "Er tauscht ein Telefon"], optionsEn: ["He calls", "He sends a receipt", "He exchanges a phone"], correct: 0, explanationDe: "Va a llamar antes de ir ordnet Anruf und Besuch eindeutig.", explanationEn: "Va a llamar antes de ir clearly orders the call and visit." },
        { questionDe: "Was beweist Nicos letzter Satz?", questionEn: "What does Nico's final sentence prove?", optionsDe: ["Er hat Anruf und Anwesenheit verstanden", "Er kennt nur die Adresse", "Er lehnt den Termin ab"], optionsEn: ["He understood the call and need to be home", "He only knows the address", "He declines the appointment"], correct: 0, explanationDe: "Die Wiedergabe in eigenen Worten ist eine echte Verständniskontrolle statt eines möglicherweise automatischen sí.", explanationEn: "Restating in his own words is a real understanding check rather than a possibly automatic sí." }
      ],
      recallPromptDe: "Lass eine Servicestelle auf Spanisch den nächsten Schritt erklären. Frage nach deiner Pflicht, ergänze einen realistischen Plan B mit si und fasse am Ende beide vereinbarten Handlungen selbst zusammen.",
      recallPromptEn: "Have a service desk explain the next step in Spanish. Ask about your obligation, add a realistic backup plan with si, and summarize both agreed actions yourself.",
      modelSummary: "El técnico llama antes de la visita y Nico debe estar en casa. Si cambia el plan, recibe una llamada. Nico repite sus responsabilidades para confirmar."
    }
  },
  {
    slug: "a2-complete-problem-solution-dialogue", title: "Carry a Problem from Report to Resolution", order: 831.6, imageKey: "shopping-and-services:7",
    summary: "Hold a complete service conversation without a prompt for every turn, from the first report to a confirmed resolution.", situation: "solving a faulty-purchase case from opening to agreement",
    sentences: [
      ["Buenos días. Esta cafetera no funciona.", "Good morning. This coffee maker does not work.", "The opening combines courtesy, object, and exact fault."],
      ["La compré hace dos días y aquí tiene el recibo.", "I bought it two days ago, and here is the receipt.", "La replaces la cafetera while the time and receipt support the case."],
      ["Quisiera cambiarla por otra.", "I would like to exchange it for another one.", "The preferred solution is stated only after the problem is clear."],
      ["No queda ese modelo, pero puede elegir este.", "That model is no longer available, but you can choose this one.", "The employee pairs a limit with a usable alternative."],
      ["¿Tiene la misma garantía?", "Does it have the same warranty?", "The customer checks a decisive condition before accepting."],
      ["Sí. Entonces elijo esta y devuelvo la otra.", "Yes. Then I choose this one and return the other.", "The final turn names both parts of the agreed resolution."]
    ],
    readingJson: {
      title: "De la cafetera rota al acuerdo",
      inputMode: "listening",
      orientationDe: "Verfolge die gesamte Handlungskette ohne vorgegebene Satzform: Meldung, Beleg, Wunsch, Grenze, Alternative, Rückfrage und bestätigte Lösung. Achte besonders darauf, worauf la, otra, ese und esta jeweils zeigen.",
      orientationEn: "Follow the full action chain without a supplied sentence frame: report, proof, request, limit, alternative, check, and confirmed resolution. Track what la, otra, ese, and esta refer to.",
      paragraphs: [
        "Una clienta vuelve a la tienda y dice que la cafetera no funciona. Explica que la compró hace dos días, entrega el recibo y pide cambiarla por otra.",
        "El empleado ya no tiene ese modelo, pero ofrece uno parecido. La clienta pregunta si tiene la misma garantía. Cuando el empleado confirma que sí, ella elige la nueva y devuelve la otra."
      ],
      questions: [
        { questionDe: "Was prüft die Kundin vor der Annahme?", questionEn: "What does the customer check before accepting?", optionsDe: ["Ob die Garantie gleich ist", "Ob das Geschäft morgen öffnet", "Ob ein Techniker anruft"], optionsEn: ["Whether the warranty is the same", "Whether the shop opens tomorrow", "Whether a technician calls"], correct: 0, explanationDe: "Die Garantie ist für die Gleichwertigkeit der Alternative entscheidend und wird deshalb vor der Zustimmung geklärt.", explanationEn: "The warranty is decisive for the equivalence of the alternative and is therefore checked before acceptance." },
        { questionDe: "Wodurch wird die Lösung am Ende eindeutig?", questionEn: "What makes the final solution unambiguous?", optionsDe: ["Sie wählt die neue und gibt die alte zurück", "Sie sagt nur gut", "Sie wiederholt nur den Defekt"], optionsEn: ["She chooses the new one and returns the old one", "She only says good", "She only repeats the fault"], correct: 0, explanationDe: "Elijo esta y devuelvo la otra benennt beide vereinbarten Handlungen und ihre Gegenstände.", explanationEn: "Elijo esta y devuelvo la otra names both agreed actions and their objects." }
      ],
      recallPromptDe: "Spiele das vollständige Gespräch auf Spanisch nach, ohne die Modellsätze abzulesen: Defekt melden, Kauf und Beleg nennen, Lösung wünschen, Alternative prüfen und die endgültige Vereinbarung eindeutig bestätigen.",
      recallPromptEn: "Recreate the full conversation in Spanish without reading the model sentences: report the fault, give purchase and receipt details, request a solution, check the alternative, and clearly confirm the final agreement.",
      modelSummary: "La clienta presenta el problema y el recibo, pide un cambio, evalúa una alternativa mediante una pregunta sobre la garantía y confirma la solución completa."
    }
  },
  {
    slug: "checkpoint-a2-everyday-problems", title: "Checkpoint: Solve an Everyday Problem", order: 831.7, imageKey: "shopping-and-services:8", checkpoint: true,
    summary: "Independently report a new household problem, negotiate a visit, and confirm responsibilities and a backup plan.", situation: "solving a new household service problem without step-by-step sentence hints",
    sentences: [
      ["Buenos días, la ventana del dormitorio no cierra.", "Good morning, the bedroom window does not close.", "The report identifies both location and observable fault."],
      ["El problema empezó anoche y ahora hace mucho frío.", "The problem started last night, and now it is very cold.", "Time and consequence establish why action is needed."],
      ["¿Puede enviar a alguien para repararla?", "Can you send someone to repair it?", "La in repararla refers to la ventana and the request names a concrete action."],
      ["Hoy no puedo, pero mañana estoy en casa.", "I cannot today, but tomorrow I am at home.", "A boundary plus alternative preserves the appointment."],
      ["Entonces, mañana entre las diez y las doce.", "So, tomorrow between ten and twelve.", "The shared time window is restated after negotiation."],
      ["Espero la llamada; si cambia algo, me avisa.", "I will wait for the call; if anything changes, let me know.", "The closing confirms one responsibility and a realistic repair plan."]
    ],
    readingJson: {
      title: "Una ventana que no cierra",
      inputMode: "listening",
      orientationDe: "Übertrage das gelernte Verfahren auf einen neuen Gegenstand. Es gibt keine Hilfe durch dieselben Produktsätze: Erkenne Problem, Zeitpunkt, Folge, gewünschte Handlung, Termingrenze, Alternative, Bestätigung und Plan B aus ihrer Funktion.",
      orientationEn: "Transfer the learned procedure to a new object. The product sentences are no longer reused: identify problem, time, consequence, requested action, scheduling constraint, alternative, confirmation, and backup plan by function.",
      paragraphs: [
        "Mara llama porque la ventana del dormitorio no cierra. El problema empezó anoche y ahora hace mucho frío. Pide que envíen a alguien para repararla.",
        "La primera visita ofrecida es hoy, pero Mara no puede. Propone mañana y acuerdan una franja entre las diez y las doce. Mara espera una llamada y pide que le avisen si cambia algo."
      ],
      questions: [
        { questionDe: "Warum braucht Mara eine Reparatur?", questionEn: "Why does Mara need a repair?", optionsDe: ["Das Schlafzimmerfenster schließt nicht und es ist kalt", "Die Kaffeemaschine ist teuer", "Der Zug fährt zu früh"], optionsEn: ["The bedroom window does not close and it is cold", "The coffee maker is expensive", "The train leaves too early"], correct: 0, explanationDe: "Gegenstand, Defekt und Folge bilden gemeinsam die Begründung der Meldung.", explanationEn: "The item, fault, and consequence jointly explain the report." },
        { questionDe: "Was geschieht, falls sich etwas ändert?", questionEn: "What happens if something changes?", optionsDe: ["Die Servicestelle informiert Mara", "Mara kauft ein Telefon", "Niemand reagiert"], optionsEn: ["The service desk informs Mara", "Mara buys a phone", "Nobody responds"], correct: 0, explanationDe: "Me avisa legt fest, wie eine Änderung kommuniziert und damit das Gespräch repariert wird.", explanationEn: "Me avisa establishes how a change will be communicated and the arrangement repaired." }
      ],
      recallPromptDe: "Löse die neue Situation vollständig auf Spanisch: Fensterproblem mit Zeitpunkt und Folge melden, Reparatur erbitten, ersten Termin ablehnen, Alternative vereinbaren und Verantwortung plus Plan B bestätigen.",
      recallPromptEn: "Solve the new situation fully in Spanish: report the window problem with time and consequence, request repair, decline the first visit, arrange an alternative, and confirm responsibility plus backup plan.",
      modelSummary: "Mara describe un problema nuevo, explica su consecuencia, pide una reparación, negocia una franja posible y termina con una confirmación y un plan para cambios."
    }
  }
];

const vocabulary = [
  ["el defecto", "fault or defect", "noun", "masculine", "El producto tiene un defecto."],
  ["estar roto", "to be broken", "phrase", null, "La pantalla está rota."],
  ["no funcionar", "not to work", "phrase", null, "El teléfono no funciona."],
  ["el recibo", "receipt", "noun", "masculine", "Aquí tiene el recibo."],
  ["la prueba de compra", "proof of purchase", "phrase", "feminine", "Necesito la prueba de compra."],
  ["cambiar", "to exchange or change", "verb", null, "Quisiera cambiarlo por otro."],
  ["devolver", "to return or refund", "verb", null, "Quiero devolver la cafetera."],
  ["la devolución", "return or refund", "noun", "feminine", "Prefiero la devolución del dinero."],
  ["el mismo modelo", "the same model", "phrase", "masculine", "No tenemos el mismo modelo."],
  ["la garantía", "warranty", "noun", "feminine", "¿Tiene la misma garantía?"],
  ["la solución", "solution", "noun", "feminine", "Esta solución me parece bien."],
  ["el apartamento", "apartment", "noun", "masculine", "Tengo un problema en el apartamento."],
  ["el agua caliente", "hot water", "phrase", "feminine", "No hay agua caliente."],
  ["la calefacción", "heating", "noun", "feminine", "La calefacción no funciona."],
  ["la ducha", "shower", "noun", "feminine", "No puedo usar la ducha."],
  ["revisar", "to inspect or check", "verb", null, "Puede enviar a alguien para revisarlo."],
  ["reparar", "to repair", "verb", null, "Viene para reparar la ventana."],
  ["el técnico", "technician", "noun", "masculine", "El técnico va a llamar."],
  ["la franja horaria", "time window", "phrase", "feminine", "La franja es entre las cuatro y las seis."],
  ["estar disponible", "to be available", "phrase", null, "Estoy disponible por la tarde."],
  ["antes de ir", "before coming", "phrase", null, "Va a llamar antes de ir."],
  ["avisar", "to let someone know", "verb", null, "Si cambia algo, me avisa."],
  ["cerrar", "to close", "verb", null, "La ventana no cierra."],
  ["el dormitorio", "bedroom", "noun", "masculine", "La ventana del dormitorio no cierra."]
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
    { key: "write", type: ExerciseType.WRITING_PROMPT, question: s.at(-1)[1], correct: s.at(-1)[0] }
  ];
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const functionalCheck = checkpointFunctionalCheck(slug);
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "problem_solution_word_order" }
    : {
        correct: check.correct,
        accepted: accepted(check.correct),
        goal: "problem_solution_step",
        rubric: functionalCheck
          ? "Perform the requested conversational step clearly; equivalent natural Spanish is acceptable."
          : "Retrieve the lesson's Spanish problem-solving model accurately before the checkpoint transfer.",
        ...(functionalCheck ? { functionalCheck } : {})
      };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the Spanish turn that performs the required step" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the next Spanish service turn" : "Continue the service conversation in Spanish",
    instruction: "Identify the current task first: report, add evidence, request, negotiate, clarify, or confirm. Give one useful turn and keep references and address consistent.",
    questionText: check.question, answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 1 : check.type === ExerciseType.SENTENCE_BUILDER ? 2 : 3,
    order, xpReward: 14, imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "solving-everyday-problems" },
    update: { title: "Solving Everyday Problems", description: "Reporting faults, supplying useful details, requesting a remedy, negotiating service visits, and confirming outcomes.", cefrLevel: "A2", imageKey: "shopping-and-services:5" },
    create: { slug: "solving-everyday-problems", title: "Solving Everyday Problems", description: "Reporting faults, supplying useful details, requesting a remedy, negotiating service visits, and confirming outcomes.", cefrLevel: "A2", imageKey: "shopping-and-services:5" }
  });
  const vocabularyGroup = await prisma.vocabularyGroup.upsert({
    where: { slug: "a2-everyday-problems-service" },
    update: { title: "A2 Everyday Problems and Service", description: "Reusable words and chunks for returns, household faults, repair visits, and confirmed solutions.", situation: "solving a practical problem with a shop or service desk", imageKey: "shopping-and-services:5" },
    create: { slug: "a2-everyday-problems-service", title: "A2 Everyday Problems and Service", description: "Reusable words and chunks for returns, household faults, repair visits, and confirmed solutions.", situation: "solving a practical problem with a shop or service desk", imageKey: "shopping-and-services:5" }
  });
  for (const [spanish, english, partOfSpeech, gender, example] of vocabulary) {
    const existing = await prisma.word.findFirst({ where: { groupId: vocabularyGroup.id, spanish } });
    const data = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: vocabularyGroup.id };
    if (existing) await prisma.word.update({ where: { id: existing.id }, data });
    else await prisma.word.create({ data });
  }
  const supportingGroups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["useful-phrases", "a2-formal-address-service"] } } });
  const groups = [vocabularyGroup, ...supportingGroups];
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Everyday Problem Solving", situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: ["You can make a practical problem specific with object, fault, time, place, and consequence.", "You can request and negotiate a concrete remedy or service visit.", "You can clarify conditions and confirm the shared result and backup plan."],
      conceptKeys: ["a2", "solving-everyday-problems", "service-repair", input.slug], reviewSummary: input.summary, readingJson: input.readingJson,
      order: input.order, estimatedMinutes: input.checkpoint ? 19 : 16, topicId: topic.id
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
  console.log(`Seeded ${lessons.length} A2.9 everyday-problem learning packages and ${vocabulary.length} aligned vocabulary items.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons, vocabulary };
