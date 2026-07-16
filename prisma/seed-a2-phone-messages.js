const { PrismaClient, ExerciseType } = require("@prisma/client");
const { checkpointFunctionalCheck } = require("./checkpoint-functional-checks");
const { seedIndefiniteNegativeWords } = require("./seed-a2-indefinite-negative-words");
const { seedAdjectiveFoundation } = require("./seed-a2-adjective-foundation");
const { seedQuantityPossessives } = require("./seed-a2-quantity-possessives");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a2-open-phone-call", title: "Open a Phone Call and State the Purpose", order: 831.78, imageKey: "conversation-and-opinion:13",
    summary: "Recognize several regional answering formulas while using one stable neutral opening to identify yourself and your purpose.", situation: "starting a call to a business or service desk",
    sentences: [
      ["Buenos días, soy Lena Weber.", "Good morning, this is Lena Weber.", "Soy plus the name identifies the caller clearly when there is no visual context."],
      ["Llamo para confirmar una cita.", "I am calling to confirm an appointment.", "Llamo para plus infinitive states the purpose in one compact frame."],
      ["¿Diga?", "Hello? when answering the phone in Spain.", "Diga is a frequent answering formula in Spain and is mainly a recognition target here."],
      ["¿Aló?", "Hello? when answering the phone in many regions.", "Aló appears in several Spanish-speaking regions as a phone-answering formula."],
      ["También puede oír ¿Bueno? en México.", "You may also hear ¿Bueno? in Mexico.", "Regional formulas differ; recognizing them does not require changing your neutral caller opening."]
    ],
    readingJson: {
      title: "Una función, varias respuestas regionales",
      inputMode: "listening",
      orientationDe: "Trenne rezeptive Varianten von deiner eigenen produktiven Grundform. Erkenne ¿Diga?, ¿Aló? und ¿Bueno? als Telefoneröffnung; beginne selbst stabil mit Tagesgruß, Name und llamo para plus Gesprächszweck.",
      orientationEn: "Separate receptive variants from your own productive default. Recognize ¿Diga?, ¿Aló?, and ¿Bueno? as phone openings; begin with greeting, name, and llamo para plus purpose.",
      paragraphs: [
        "Una oficina en Madrid responde: ¿Diga? Lena dice: Buenos días, soy Lena Weber. Llamo para confirmar una cita. Su apertura identifica persona y objetivo antes de añadir detalles.",
        "En otros lugares Lena puede oír ¿Aló? o, especialmente en México, ¿Bueno? Las tres fórmulas abren el canal. Para llamar, Lena mantiene una forma productiva estable aunque cambie la respuesta regional."
      ],
      questions: [
        { questionDe: "Was produziert Lena unabhängig von der regionalen Antwort?", questionEn: "What does Lena produce regardless of the regional answer?", optionsDe: ["Gruß, Name und Gesprächszweck", "Alle regionalen Formeln gleichzeitig", "Nur ihren Vornamen"], optionsEn: ["Greeting, name, and purpose", "All regional formulas at once", "Only her first name"], correct: 0, explanationDe: "Soy Lena Weber und llamo para bilden einen stabilen, überall verständlichen Anruferrahmen.", explanationEn: "Soy Lena Weber and llamo para form a stable caller frame that is widely understandable." },
        { questionDe: "Was ist vorerst das Ziel bei ¿Diga?, ¿Aló? und ¿Bueno??", questionEn: "What is the initial goal with ¿Diga?, ¿Aló?, and ¿Bueno??", optionsDe: ["Sie als regionale Telefoneröffnungen erkennen", "Sie als drei Bedeutungen von gut übersetzen", "Sie in jedem eigenen Satz abwechseln"], optionsEn: ["Recognize them as regional phone openings", "Translate them as three meanings of good", "Alternate them in every sentence"], correct: 0, explanationDe: "Rezeptive Breite und eine konsistente eigene Grundform vermeiden unnötige Produktionslast.", explanationEn: "Broad recognition and one consistent productive default avoid unnecessary production load." }
      ],
      recallPromptDe: "Eröffne einen erfundenen Anruf auf Spanisch mit Tagesgruß, vollständigem Namen und llamo para plus einem Zweck. Erkläre anschließend auf Deutsch, was ¿Diga?, ¿Aló? und ¿Bueno? am Telefon leisten.",
      recallPromptEn: "Open an invented call in Spanish with a greeting, full name, and llamo para plus a purpose. Then explain what ¿Diga?, ¿Aló?, and ¿Bueno? do on the phone.",
      modelSummary: "Lena se identifica y usa llamo para expresar el objetivo. Reconoce diga, aló y bueno como aperturas regionales sin cambiar su forma productiva estable."
    }
  },
  {
    slug: "a2-ask-for-person-phone", title: "Ask for a Person and Handle the Transfer", order: 831.79, imageKey: "conversation-and-opinion:14",
    summary: "Request one person or department, answer who is calling, and understand hold, absence, or transfer as distinct outcomes.", situation: "asking to speak with someone through reception",
    sentences: [
      ["¿Puedo hablar con la señora Ruiz, por favor?", "May I speak with Ms. Ruiz, please?", "Puedo hablar con names the requested person politely."],
      ["¿De parte de quién?", "Who is calling?", "De parte de quién asks for the caller's identity, not the reason for the call."],
      ["De parte de Lena Weber.", "Lena Weber is calling.", "De parte de plus the name answers in the same frame."],
      ["Un momento, por favor. Le paso la llamada.", "One moment, please. I will put you through.", "Le paso la llamada announces the transfer to the requested person."],
      ["Lo siento, ahora no está disponible.", "I am sorry, she is not available now.", "No está disponible is a temporary availability result, not a refusal of the caller."]
    ],
    readingJson: {
      title: "Persona, identidad y resultado de la transferencia",
      inputMode: "listening",
      orientationDe: "Höre drei getrennte Aufgaben: gewünschte Person nennen, Identität des Anrufers beantworten und Ergebnis verstehen. Verwechsle de parte de quién nicht mit einer Frage nach dem gesamten Gesprächsgrund.",
      orientationEn: "Listen for three separate tasks: name the requested person, identify the caller, and understand the outcome. Do not confuse de parte de quién with a question about the whole reason for calling.",
      paragraphs: [
        "Lena pregunta: ¿Puedo hablar con la señora Ruiz, por favor? La recepcionista necesita identificar a la persona que llama y pregunta: ¿De parte de quién? Lena responde con su nombre.",
        "Si la señora Ruiz puede atender, la recepcionista dice: Un momento. Le paso la llamada. Si no puede, explica que ahora no está disponible. Cada resultado exige un siguiente paso diferente."
      ],
      questions: [
        { questionDe: "Wonach fragt de parte de quién?", questionEn: "What does de parte de quién ask for?", optionsDe: ["Nach der Identität der anrufenden Person", "Nach der Uhrzeit des Termins", "Nach einer Telefonnummer"], optionsEn: ["The caller's identity", "The appointment time", "A phone number"], correct: 0, explanationDe: "Die passende Kurzantwort lautet de parte de plus Name.", explanationEn: "The matching short answer is de parte de plus the caller's name." },
        { questionDe: "Was bedeutet le paso la llamada?", questionEn: "What does le paso la llamada mean?", optionsDe: ["Der Anruf wird weiterverbunden", "Die Nachricht wurde gelöscht", "Die Person ist dauerhaft fort"], optionsEn: ["The call is being transferred", "The message was deleted", "The person is permanently gone"], correct: 0, explanationDe: "Pasar la llamada bezeichnet hier den nächsten technischen Gesprächsschritt.", explanationEn: "Pasar la llamada names the next technical step in the call." }
      ],
      recallPromptDe: "Bitte auf Spanisch darum, mit einer bestimmten Person zu sprechen. Beantworte de parte de quién mit deinem Namen und reagiere anschließend einmal auf Weiterverbinden und einmal auf vorübergehende Abwesenheit.",
      recallPromptEn: "Ask in Spanish to speak with a specific person. Answer de parte de quién with your name, then respond once to a transfer and once to temporary absence.",
      modelSummary: "Lena pide hablar con la señora Ruiz, se identifica con de parte de, entiende cuándo le pasan la llamada y reconoce que no está disponible exige otro paso."
    }
  },
  {
    slug: "a2-leave-phone-message", title: "Leave a Complete Phone Message", order: 831.80, imageKey: "conversation-and-opinion:15",
    summary: "Leave recipient, caller, reason, requested action, and reliable contact detail instead of a vague request to call back.", situation: "leaving a message when the requested person is unavailable",
    sentences: [
      ["¿Puedo dejarle un mensaje?", "May I leave her a message?", "Le refers to the unavailable recipient while dejar un mensaje requests the next option."],
      ["Dígale que ha llamado Lena Weber.", "Tell her that Lena Weber called.", "Dígale is a respectful service chunk and ha llamado reports the completed call."],
      ["Llamo por la cita del jueves.", "I am calling about Thursday's appointment.", "Por introduces the concise topic of the call."],
      ["¿Puede decirle que me llame esta tarde?", "Can you tell her to call me this afternoon?", "The request includes both desired action and time window."],
      ["Mi número es seis ocho dos, cuatro uno nueve.", "My number is six eight two, four one nine.", "Chunked digits make the contact detail easier to hear and verify."]
    ],
    readingJson: {
      title: "Cinco piezas para que el mensaje funcione",
      orientationDe: "Suche Empfänger, Anrufer, Anlass, gewünschte Handlung und Kontaktangabe. Ein bloßes rufen Sie mich zurück ist nicht vollständig, wenn die empfangende Person weder weiß, wer anrief noch worum es geht.",
      orientationEn: "Find recipient, caller, reason, requested action, and contact detail. A bare call me back is incomplete if the recipient does not know who called or why.",
      paragraphs: [
        "La señora Ruiz no está disponible. Lena pregunta si puede dejarle un mensaje. Dice su nombre y explica el tema de forma breve: llama por la cita del jueves.",
        "Después pide una acción con plazo: que la señora Ruiz la llame esta tarde. Finalmente deja su número en dos grupos y espera que la recepcionista lo confirme."
      ],
      questions: [
        { questionDe: "Welche fünf Bestandteile enthält Lenas Nachricht?", questionEn: "Which five parts does Lena's message contain?", optionsDe: ["Empfänger, Anrufer, Anlass, Handlung und Kontaktdetail", "Nur Name und Gruß", "Adresse, Preis und Farbe"], optionsEn: ["Recipient, caller, reason, action, and contact detail", "Only name and greeting", "Address, price, and color"], correct: 0, explanationDe: "Alle fünf Teile ermöglichen der abwesenden Person später eine sinnvolle Reaktion.", explanationEn: "All five parts let the absent person respond meaningfully later." },
        { questionDe: "Warum nennt Lena esta tarde?", questionEn: "Why does Lena include esta tarde?", optionsDe: ["Es begrenzt den gewünschten Rückruf zeitlich", "Es ersetzt die Telefonnummer", "Es bezeichnet die Empfängerin"], optionsEn: ["It gives the requested callback a time window", "It replaces the phone number", "It identifies the recipient"], correct: 0, explanationDe: "Die gewünschte Handlung wird dadurch konkreter und planbar.", explanationEn: "It makes the requested action more concrete and schedulable." }
      ],
      recallPromptDe: "Hinterlasse eine vollständige erfundene Nachricht auf Spanisch: Empfänger, eigener Name, kurzer Anlass, gewünschter Rückruf mit Zeitraum und eine in gut hörbare Gruppen geteilte Telefonnummer.",
      recallPromptEn: "Leave a complete invented message in Spanish: recipient, your name, brief reason, requested callback with a time window, and a phone number divided into audible groups.",
      modelSummary: "Lena deja un mensaje para la señora Ruiz con su identidad, el tema de la cita, una petición de llamada para esa tarde y un número de contacto."
    }
  },
  {
    slug: "a2-understand-voicemail", title: "Understand a Voicemail and Plan the Callback", order: 831.81, imageKey: "conversation-and-opinion:16",
    summary: "Extract caller, reason, changed detail, requested action, and deadline from one short recorded message before replaying it.", situation: "listening to a voicemail about an appointment change",
    sentences: [
      ["Hola, soy Marta del centro dental.", "Hello, this is Marta from the dental clinic.", "The opening identifies both caller and organization."],
      ["Llamo porque tenemos que cambiar su cita.", "I am calling because we have to change your appointment.", "Porque introduces the reason for the recorded message."],
      ["La nueva hora es el viernes a las once.", "The new time is Friday at eleven.", "Nueva marks the changed decisive detail."],
      ["Por favor, devuélvanos la llamada antes de las seis.", "Please call us back before six.", "The message contains an action and a deadline, not merely information."],
      ["Repito el número: nueve uno cuatro, dos cero seis.", "I repeat the number: nine one four, two zero six.", "Repito signals a second chance to capture the contact detail."]
    ],
    readingJson: {
      title: "Quién, por qué, qué cambió y qué debo hacer",
      inputMode: "listening",
      orientationDe: "Höre zuerst nur Anrufer und Anlass. Sammle im zweiten Durchgang die geänderte Angabe, geforderte Handlung, Frist und Rückrufnummer. Im stillen Modus liest du denselben Text mit derselben Abrufreihenfolge.",
      orientationEn: "First listen only for caller and reason. On the second pass, collect the changed detail, requested action, deadline, and callback number. Quiet mode uses the same retrieval order in text.",
      paragraphs: [
        "Hola, soy Marta del centro dental. Llamo porque tenemos que cambiar su cita. La nueva hora es el viernes a las once, no el jueves a las cinco.",
        "Por favor, devuélvanos la llamada antes de las seis para confirmar. Nuestro número es nueve uno cuatro, dos cero seis. Repito: nueve uno cuatro, dos cero seis. Gracias."
      ],
      questions: [
        { questionDe: "Welche Angabe wurde geändert?", questionEn: "Which detail changed?", optionsDe: ["Der Termin liegt nun Freitag um elf", "Die Zahnarztpraxis hat eine neue Adresse", "Lena hat eine neue Telefonnummer"], optionsEn: ["The appointment is now Friday at eleven", "The clinic has a new address", "Lena has a new phone number"], correct: 0, explanationDe: "Nueva hora sowie der Kontrast no el jueves markieren die konkrete Änderung.", explanationEn: "Nueva hora and the contrast no el jueves mark the specific change." },
        { questionDe: "Was muss die empfangende Person bis wann tun?", questionEn: "What must the recipient do, and by when?", optionsDe: ["Vor sechs zurückrufen und bestätigen", "Am Freitag eine Nachricht schreiben", "Sofort zur Praxis fahren"], optionsEn: ["Call back before six and confirm", "Write a message on Friday", "Go to the clinic immediately"], correct: 0, explanationDe: "Devuélvanos la llamada und antes de las seis bilden Handlung plus Frist.", explanationEn: "Devuélvanos la llamada and antes de las seis give action plus deadline." }
      ],
      recallPromptDe: "Gib die Sprachnachricht aus dem Gedächtnis auf Spanisch wieder: Wer ruft an, warum, welche alte und neue Zeit stehen im Kontrast, welche Handlung wird bis wann verlangt und welche Nummer wird wiederholt?",
      recallPromptEn: "Reconstruct the voicemail from memory in Spanish: who calls, why, which old and new times contrast, what action is requested by when, and which number is repeated?",
      modelSummary: "Marta llama del centro dental porque cambia la cita del jueves al viernes a las once. Pide una llamada antes de las seis y repite el número."
    }
  },
  {
    slug: "a2-spell-check-contact-details", title: "Spell and Verify Contact Details", order: 831.82, imageKey: "conversation-and-opinion:17",
    summary: "Break names, email, and numbers into audible units, ask for the exact unclear part, and confirm the completed detail.", situation: "checking contact details over the phone",
    sentences: [
      ["Mi apellido se escribe W-E-B-E-R.", "My surname is spelled W-E-B-E-R.", "Se escribe introduces a spoken spelling sequence."],
      ["Mi correo es lena punto weber arroba ejemplo punto com.", "My email is lena dot weber at example dot com.", "Punto and arroba turn written symbols into spoken units."],
      ["Perdone, ¿ha dicho B o V?", "Excuse me, did you say B or V?", "The either-or repair isolates one uncertain letter."],
      ["El último grupo es cuatro uno nueve.", "The last group is four one nine.", "Naming the group avoids repeating the whole number."],
      ["Entonces, termina en cuatro uno nueve, ¿correcto?", "So, it ends in four one nine, correct?", "The confirmation repeats the repaired segment and requests explicit agreement."]
    ],
    readingJson: {
      title: "Dividir, localizar y confirmar",
      inputMode: "listening",
      orientationDe: "Behandle Namen, E-Mail und Nummer nicht als einen langen Klangstrom. Teile sie in Einheiten, benenne genau Buchstabe oder Zahlengruppe mit Unsicherheit und bestätige nur den reparierten Abschnitt im vollständigen Bezug.",
      orientationEn: "Do not treat names, email, and number as one long sound stream. Divide them into units, identify the uncertain letter or digit group, and confirm the repaired segment in context.",
      paragraphs: [
        "Lena deletrea su apellido: W-E-B-E-R. Después dicta su correo usando punto y arroba. La recepcionista no distingue una letra y pregunta de forma concreta si Lena ha dicho B o V.",
        "Con el número, la recepcionista no pide repetirlo todo. Pregunta por el último grupo. Lena dice cuatro uno nueve y la recepcionista confirma exactamente ese final."
      ],
      questions: [
        { questionDe: "Wie repariert die Rezeptionistin den unklaren Buchstaben?", questionEn: "How does the receptionist repair the unclear letter?", optionsDe: ["Mit einer gezielten B-oder-V-Frage", "Durch Wiederholung des ganzen Gesprächs", "Durch Raten ohne Bestätigung"], optionsEn: ["With a focused B-or-V question", "By repeating the whole conversation", "By guessing without confirmation"], correct: 0, explanationDe: "Die Entweder-oder-Frage minimiert Wiederholung und macht die Unsicherheit sichtbar.", explanationEn: "The either-or question minimizes repetition and exposes the uncertainty." },
        { questionDe: "Welchen Zahlenteil wiederholen beide?", questionEn: "Which part of the number do both repeat?", optionsDe: ["Nur die letzte Gruppe vier eins neun", "Jede Zahl zweimal", "Keine Zahl"], optionsEn: ["Only the last group four one nine", "Every digit twice", "No digits"], correct: 0, explanationDe: "El último grupo lokalisiert genau den zu reparierenden Abschnitt.", explanationEn: "El último grupo identifies exactly the segment that needs repair." }
      ],
      recallPromptDe: "Diktiere auf Spanisch einen erfundenen Nachnamen, eine E-Mail mit punto und arroba sowie eine gruppierte Nummer. Lass genau einen Buchstaben und eine Zahlengruppe gezielt nachfragen und rückbestätigen.",
      recallPromptEn: "Dictate an invented surname, an email with punto and arroba, and a grouped number in Spanish. Have exactly one letter and one digit group queried and confirmed.",
      modelSummary: "Lena divide apellido, correo y número en unidades. La recepcionista localiza una letra y el último grupo, recibe la corrección y confirma solo esos detalles."
    }
  },
  {
    slug: "a2-repair-phone-connection", title: "Repair a Poor Phone Connection", order: 831.83, imageKey: "conversation-and-opinion:18",
    summary: "Name the audio problem, request one targeted repetition, verify the decisive detail, and agree what happens if the call drops.", situation: "keeping a call usable when the connection is poor",
    sentences: [
      ["Perdone, se oye muy bajo.", "Excuse me, the sound is very quiet.", "Se oye describes the received sound rather than blaming the speaker."],
      ["La llamada se corta.", "The call keeps cutting out.", "Se corta names an intermittent connection problem."],
      ["¿Puede repetir solo la nueva hora?", "Can you repeat only the new time?", "Solo isolates the decisive detail and reduces listening load."],
      ["He entendido viernes a las once.", "I understood Friday at eleven.", "Repeating the interpretation lets the other person correct it immediately."],
      ["Si se corta otra vez, le devuelvo la llamada.", "If the call drops again, I will call you back.", "The si frame gives both speakers a shared recovery plan."]
    ],
    readingJson: {
      title: "Nombrar el fallo sin perder el objetivo",
      inputMode: "listening",
      orientationDe: "Unterscheide Klangproblem, Abbruch, gezielte Wiederholung, verstandene Interpretation und Plan B. Die Reparatur soll die Aufgabe des Gesprächs retten, nicht eine lange Diskussion über die Technik beginnen.",
      orientationEn: "Distinguish sound problem, dropout, targeted repetition, understood interpretation, and backup plan. The repair should save the task of the call rather than start a long discussion about technology.",
      paragraphs: [
        "Durante la llamada, Lena oye la voz muy baja y la conexión se corta. Dice qué ocurre y pide repetir solo la nueva hora, no todo el mensaje.",
        "Después comprueba: He entendido viernes a las once. Antes de continuar acuerda un plan B: Si se corta otra vez, le devuelvo la llamada. Así conserva objetivo, detalle y recuperación."
      ],
      questions: [
        { questionDe: "Was lässt Lena gezielt wiederholen?", questionEn: "What does Lena ask to have repeated?", optionsDe: ["Nur die neue Uhrzeit", "Das gesamte Gespräch", "Nur den Namen der Stadt"], optionsEn: ["Only the new time", "The whole conversation", "Only the city name"], correct: 0, explanationDe: "Solo la nueva hora isoliert die Information, von der die Terminhandlung abhängt.", explanationEn: "Solo la nueva hora isolates the information on which the appointment task depends." },
        { questionDe: "Welchen Plan vereinbart Lena bei erneutem Abbruch?", questionEn: "What plan does Lena establish if the call drops again?", optionsDe: ["Sie ruft zurück", "Sie rät die Uhrzeit", "Sie löscht die Nachricht"], optionsEn: ["She calls back", "She guesses the time", "She deletes the message"], correct: 0, explanationDe: "Le devuelvo la llamada legt die Verantwortung für die Wiederaufnahme fest.", explanationEn: "Le devuelvo la llamada establishes responsibility for reconnecting." }
      ],
      recallPromptDe: "Repariere einen erfundenen schlechten Anruf auf Spanisch: leisen Ton und Abbruch benennen, nur eine entscheidende Angabe wiederholen lassen, die verstandene Version aussprechen und einen Rückrufplan mit si vereinbaren.",
      recallPromptEn: "Repair an invented poor call in Spanish: name quiet sound and dropout, request only one decisive detail, state the understood version, and agree a callback plan with si.",
      modelSummary: "Lena identifica sonido bajo y cortes, pide repetir solo la hora, confirma viernes a las once y acuerda devolver la llamada si vuelve a cortarse."
    }
  },
  {
    slug: "checkpoint-a2-phone-messages", title: "Checkpoint: Complete a Phone Task", order: 831.84, imageKey: "conversation-and-opinion:19", checkpoint: true,
    summary: "Independently change an appointment through reception, leave a complete message, repair one unclear time, and confirm the callback plan.", situation: "changing an appointment by phone when the responsible person is unavailable",
    sentences: [
      ["Buenos días, soy Jonas Berg. Llamo para cambiar una cita.", "Good morning, this is Jonas Berg. I am calling to change an appointment.", "Identity and purpose create a complete neutral opening."],
      ["¿Puedo hablar con la señora Molina, por favor?", "May I speak with Ms. Molina, please?", "The caller requests the responsible person through reception."],
      ["Como no está, ¿puedo dejarle un mensaje?", "Since she is not there, may I leave her a message?", "Como links the unavailable result to the next useful action."],
      ["Dígale que el viernes no puedo y que prefiero el lunes por la tarde.", "Tell her that I cannot come Friday and prefer Monday afternoon.", "The message contains constraint and alternative, not only cancellation."],
      ["Perdone, ¿ha dicho lunes a las cuatro o a las cinco?", "Excuse me, did you say Monday at four or at five?", "The receptionist isolates the uncertain time before recording it."],
      ["A las cinco. Si hay algún problema, puede llamarme al seis ocho dos, cuatro uno nueve.", "At five. If there is any problem, you can call me at six eight two, four one nine.", "The closing corrects the detail and supplies a callback plan and number."]
    ],
    readingJson: {
      title: "Cambiar una cita sin contacto directo",
      inputMode: "listening",
      orientationDe: "Übertrage alle Funktionen auf eine neue Situation: neutral eröffnen, Zielperson verlangen, Abwesenheit in eine Nachricht umwandeln, Grenze plus Alternative nennen, eine Uhrzeit reparieren und den Rückrufweg bestätigen.",
      orientationEn: "Transfer all functions to a new situation: open neutrally, request the person, turn absence into a message, state constraint plus alternative, repair a time, and confirm the callback route.",
      paragraphs: [
        "Jonas llama para cambiar una cita y pide hablar con la señora Molina. Ella no está disponible, así que deja un mensaje: no puede el viernes y prefiere el lunes por la tarde.",
        "La recepcionista no sabe si ha oído las cuatro o las cinco. Pregunta de forma concreta. Jonas corrige a las cinco y deja un número agrupado para que puedan llamarlo si surge algún problema."
      ],
      questions: [
        { questionDe: "Was enthält Jonas’ Änderungsnachricht?", questionEn: "What does Jonas's change message contain?", optionsDe: ["Unmöglicher alter Termin und bevorzugte Alternative", "Nur eine Absage ohne nächsten Schritt", "Eine Bestellung im Café"], optionsEn: ["Unavailable old appointment and preferred alternative", "Only a cancellation with no next step", "A café order"], correct: 0, explanationDe: "No puedo plus prefiero hält die Terminhandlung trotz Abwesenheit lösbar.", explanationEn: "No puedo plus prefiero keeps the appointment task solvable despite the person's absence." },
        { questionDe: "Welche Information wird vor dem Auflegen repariert?", questionEn: "Which information is repaired before hanging up?", optionsDe: ["Vier oder fünf Uhr", "Der Nachname der Zielperson", "Freitag oder Samstag"], optionsEn: ["Four or five o'clock", "The requested person's surname", "Friday or Saturday"], correct: 0, explanationDe: "Die Entweder-oder-Frage und a las cinco erzeugen eine eindeutige gespeicherte Uhrzeit.", explanationEn: "The either-or question and a las cinco produce one unambiguous recorded time." }
      ],
      recallPromptDe: "Führe das gesamte Telefongespräch auf Spanisch ohne Modellsicht: Name und Zweck, Zielperson, Nachricht bei Abwesenheit, Grenze plus Alternative, gezielte Uhrzeitreparatur und gruppierte Rückrufnummer mit Plan B.",
      recallPromptEn: "Complete the whole call in Spanish without the model: name and purpose, requested person, message during absence, constraint plus alternative, focused time repair, and grouped callback number with a backup plan.",
      modelSummary: "Jonas abre la llamada, pide hablar con la señora Molina, deja una alternativa para su cita, aclara la hora y facilita un número para cualquier problema."
    }
  }
];

const vocabulary = [
  ["llamar para", "to call in order to", "phrase", null, "Llamo para confirmar una cita."],
  ["¿diga?", "phone hello in Spain", "phrase", null, "¿Diga? Buenos días."],
  ["¿aló?", "phone hello in many regions", "phrase", null, "¿Aló? Soy Marta."],
  ["¿bueno?", "phone hello in Mexico", "phrase", null, "¿Bueno? Llamo para confirmar."],
  ["¿puedo hablar con...?", "may I speak with...?", "phrase", null, "¿Puedo hablar con la señora Ruiz?"],
  ["¿de parte de quién?", "who is calling?", "question", null, "¿De parte de quién?"],
  ["pasar la llamada", "to put a call through", "phrase", null, "Le paso la llamada."],
  ["estar disponible", "to be available", "phrase", null, "Ahora no está disponible."],
  ["dejar un mensaje", "to leave a message", "phrase", null, "¿Puedo dejarle un mensaje?"],
  ["devolver la llamada", "to return a call", "phrase", null, "Le devuelvo la llamada."],
  ["el buzón de voz", "voicemail", "phrase", "masculine", "Escucho el buzón de voz."],
  ["el centro dental", "dental clinic", "phrase", "masculine", "Llama Marta del centro dental."],
  ["la nueva hora", "new appointment time", "phrase", "feminine", "La nueva hora es el viernes."],
  ["antes de las seis", "before six o'clock", "phrase", null, "Llame antes de las seis."],
  ["deletrear", "to spell", "verb", null, "Puede deletrear su apellido."],
  ["se escribe", "it is spelled", "phrase", null, "Mi apellido se escribe W-E-B-E-R."],
  ["la arroba", "at sign", "noun", "feminine", "Diga arroba en el correo."],
  ["el punto", "dot or full stop", "noun", "masculine", "Diga punto antes de com."],
  ["el último grupo", "the last group", "phrase", "masculine", "Repita el último grupo."],
  ["se oye bajo", "the sound is quiet", "phrase", null, "Se oye muy bajo."],
  ["la llamada se corta", "the call is cutting out", "phrase", "feminine", "La llamada se corta."],
  ["solo la nueva hora", "only the new time", "phrase", null, "Repita solo la nueva hora."],
  ["he entendido", "I understood", "phrase", null, "He entendido viernes a las once."],
  ["otra vez", "again", "phrase", null, "Si se corta otra vez, llamo."]
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
    ? { correctWords: tokenize(check.correct), goal: "phone_task_word_order" }
    : {
        correct: check.correct,
        accepted: accepted(check.correct),
        goal: "phone_task_step",
        rubric: functionalCheck
          ? "Complete the requested phone task clearly; equivalent natural regional Spanish is acceptable."
          : "Retrieve the lesson's Spanish phone-task model accurately before the checkpoint transfer.",
        ...(functionalCheck ? { functionalCheck } : {})
      };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the Spanish turn that performs the current phone task" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the next Spanish phone turn" : "Continue the phone task in clear Spanish",
    instruction: "Identify the next phone function: open, request, identify, leave a message, capture a detail, repair, or confirm. Keep each turn short and check decisive details.",
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
    where: { slug: "phone-calls-messages" },
    update: { title: "Phone Calls and Messages", description: "Regional opening recognition, stable caller openings, transfer, complete messages, voicemail, contact-detail verification, and connection repair.", cefrLevel: "A2", imageKey: "conversation-and-opinion:13" },
    create: { slug: "phone-calls-messages", title: "Phone Calls and Messages", description: "Regional opening recognition, stable caller openings, transfer, complete messages, voicemail, contact-detail verification, and connection repair.", cefrLevel: "A2", imageKey: "conversation-and-opinion:13" }
  });
  const vocabularyGroup = await prisma.vocabularyGroup.upsert({
    where: { slug: "a2-phone-messages" },
    update: { title: "A2 Phone Calls and Messages", description: "Reusable chunks for opening calls, reaching someone, leaving and understanding messages, checking contact details, and repairing sound.", situation: "completing a phone task without visual context", imageKey: "conversation-and-opinion:13" },
    create: { slug: "a2-phone-messages", title: "A2 Phone Calls and Messages", description: "Reusable chunks for opening calls, reaching someone, leaving and understanding messages, checking contact details, and repairing sound.", situation: "completing a phone task without visual context", imageKey: "conversation-and-opinion:13" }
  });
  for (const [spanish, english, partOfSpeech, gender, example] of vocabulary) {
    const existing = await prisma.word.findFirst({ where: { groupId: vocabularyGroup.id, spanish } });
    const data = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: vocabularyGroup.id };
    if (existing) await prisma.word.update({ where: { id: existing.id }, data });
    else await prisma.word.create({ data });
  }
  const supportingGroups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["useful-phrases", "a2-formal-address-service", "a2-making-plans"] } } });
  const groups = [vocabularyGroup, ...supportingGroups];
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Phone Interaction", situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: ["You can open a call, identify yourself, and state one purpose clearly.", "You can reach a person or leave and understand a complete message.", "You can isolate poor audio or an uncertain detail and confirm a callback plan."],
      conceptKeys: ["a2", "phone-calls-messages", "phone-interaction", input.slug], reviewSummary: input.summary, readingJson: input.readingJson,
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
  await seedIndefiniteNegativeWords(prisma);
  await seedAdjectiveFoundation(prisma);
  await seedQuantityPossessives(prisma);
  console.log(`Seeded ${lessons.length} A2.11 phone-and-message learning packages and ${vocabulary.length} aligned vocabulary items.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons, vocabulary };
