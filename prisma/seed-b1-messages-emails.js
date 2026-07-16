const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-open-message-register", title: "Open a Message with the Right Register and Purpose", order: 1313.1, imageKey: "conversation-and-opinion:12",
    summary: "Choose a personal, neutral, or formal opening and state the reason for writing before adding background details.", situation: "writing to a friend, colleague, or service organization",
    sentences: [
      ["Hola, Marta: ¿Cómo estás?", "Hi Marta, how are you?", "A personal opening fits an established informal relationship."],
      ["Buenos días, señora Ruiz:", "Good morning, Ms Ruiz,", "A respectful named greeting suits a known professional contact."],
      ["Estimado equipo de atención al cliente:", "Dear customer service team,", "Estimado plus a role addresses an organization when no individual name is known."],
      ["Le escribo para solicitar información sobre el curso de septiembre.", "I am writing to request information about the September course.", "The purpose appears early so the reader can classify the message."],
      ["Quería preguntarte si sigues libre el sábado.", "I wanted to ask whether you are still free on Saturday.", "The personal purpose uses tú and a softer imperfect frame consistently."]
    ],
    readingJson: {
      title: "La relación decide el saludo y las formas que siguen",
      orientationDe: "Bestimme vor dem Schreiben Beziehung, Empfänger und Zweck. Wähle danach eine Anrede und halte tú, usted beziehungsweise eine institutionelle Form im restlichen Text konsequent. Der Anlass gehört in die ersten Zeilen.",
      orientationEn: "Before writing, identify relationship, recipient, and purpose. Then choose a greeting and keep tú, usted, or an institutional form consistent throughout. Put the reason for writing in the opening lines.",
      paragraphs: [
        "Buenos días, señora Ruiz: Le escribo para solicitar información sobre el curso intensivo de septiembre. He visto las fechas en la página web, pero no encuentro el horario completo.",
        "En concreto, quisiera saber si las clases terminan antes de las cinco. Muchas gracias por su ayuda. Un saludo, Lena Weber"
      ],
      questions: [
        { questionDe: "Woran erkennt man das durchgehend respektvolle Register?", questionEn: "What shows the consistently respectful register?", optionsDe: ["Señora Ruiz, le, quisiera und su", "Hola zusammen mit tú", "Nur am Wort septiembre"], optionsEn: ["Señora Ruiz, le, quisiera, and su", "Hola together with tú", "Only in the word septiembre"], correct: 0, explanationDe: "Anrede, Objektpronomen, Bitte und Besitzform gehören alle zur respektvollen Beziehung.", explanationEn: "Greeting, object pronoun, request, and possessive all belong to the respectful relationship." },
        { questionDe: "Warum steht der Anlass bereits im ersten Absatz?", questionEn: "Why is the purpose already in the first paragraph?", optionsDe: ["Die Empfängerin kann die Nachricht sofort einordnen", "Damit keine konkrete Frage mehr nötig ist", "Weil eine E-Mail nur einen Satz haben darf"], optionsEn: ["The recipient can classify the message immediately", "So that no concrete question is needed", "Because an email may contain only one sentence"], correct: 0, explanationDe: "Le escribo para nennt die Handlung früh; die genaue offene Information folgt danach.", explanationEn: "Le escribo para names the action early; the precise missing information follows." }
      ],
      recallPromptDe: "Schreibe auf Spanisch drei unterschiedliche Eröffnungen mit Anlass: an einen Freund, an eine bekannte professionelle Ansprechpartnerin und an ein unbekanntes Serviceteam. Halte jede Anredeform konsequent.",
      recallPromptEn: "Write three Spanish openings with a purpose: to a friend, a known professional contact, and an unknown service team. Keep each form of address consistent.",
      modelSummary: "Lena elige un saludo respetuoso con nombre, presenta inmediatamente su solicitud de información, explica la fuente que ya consultó y formula una sola pregunta concreta sobre la hora de finalización."
    }
  },
  {
    slug: "b1-request-information-action", title: "Request Information or Action Precisely", order: 1313.2, imageKey: "conversation-and-opinion:13",
    summary: "Ask for one clear piece of information or action, explain why it matters, and give a usable response date without sounding like an order.", situation: "requesting a document from a course office",
    sentences: [
      ["¿Podría enviarme el formulario de inscripción?", "Could you send me the registration form?", "Conditional podría makes a precise formal request."],
      ["Lo necesito para completar la solicitud.", "I need it in order to complete the application.", "The short reason helps the reader understand the purpose of the action."],
      ["Si fuera posible, agradecería recibirlo antes del jueves.", "If possible, I would appreciate receiving it before Thursday.", "The frame gives a desired deadline without pretending it is already agreed."],
      ["¿Me puede confirmar si también debo adjuntar una copia del pasaporte?", "Can you confirm whether I must also attach a copy of the passport?", "The embedded yes-or-no question isolates one requirement."],
      ["Quedo pendiente de su respuesta.", "I look forward to your reply.", "The closing signals that a response is still required."]
    ],
    readingJson: {
      title: "Petición, motivo y fecha útil sin convertirla en una orden",
      orientationDe: "Trenne gewünschte Handlung, kurzen Grund, bevorzugten Zeitpunkt und zusätzliche offene Frage. Eine höfliche Form darf nicht verschleiern, was die empfangende Person konkret senden oder bestätigen soll.",
      orientationEn: "Separate the requested action, short reason, preferred date, and additional open question. A polite form must not hide what the recipient should actually send or confirm.",
      paragraphs: [
        "Estimado equipo de inscripción: ¿Podrían enviarme el formulario actualizado para el curso de otoño? Lo necesito para completar mi solicitud y la versión de la página web corresponde al año pasado.",
        "Si fuera posible, agradecería recibirlo antes del jueves. También quisiera confirmar si debo adjuntar una copia del pasaporte. Quedo pendiente de su respuesta. Un saludo, Daniel Klein"
      ],
      questions: [
        { questionDe: "Welche konkrete Handlung soll das Team ausführen?", questionEn: "Which concrete action should the team perform?", optionsDe: ["Das aktuelle Formular senden", "Den ganzen Kurs erklären", "Daniels Pass verlängern"], optionsEn: ["Send the current form", "Explain the entire course", "Renew Daniel's passport"], correct: 0, explanationDe: "Die erste Frage nennt das benötigte Dokument; Grund und Frist stützen genau diese Handlung.", explanationEn: "The first question names the needed document; reason and date support that exact action." },
        { questionDe: "Warum ist antes del jueves keine behauptete Vereinbarung?", questionEn: "Why is antes del jueves not presented as an agreed deadline?", optionsDe: ["Si fuera posible und agradecería kennzeichnen einen Wunsch", "Das Datum steht im ersten Absatz", "Daniel verwendet kein Verb"], optionsEn: ["Si fuera posible and agradecería mark it as a preference", "The date is in the first paragraph", "Daniel uses no verb"], correct: 0, explanationDe: "Der Rahmen macht Dringlichkeit sichtbar, respektiert aber, dass die andere Seite noch reagieren muss.", explanationEn: "The frame makes urgency visible while respecting that the other side still needs to respond." }
      ],
      recallPromptDe: "Verfasse auf Spanisch eine formelle Anfrage: eine eindeutig benannte Handlung, einen kurzen sachlichen Grund, eine höflich markierte Wunschfrist, genau eine zusätzliche Bestätigungsfrage und einen Abschluss mit Antwortbedarf.",
      recallPromptEn: "Write a formal request in Spanish: one clearly named action, a short factual reason, a politely marked preferred date, exactly one additional confirmation question, and a close showing that a reply is needed.",
      modelSummary: "Daniel solicita el formulario actualizado, explica que la versión disponible está anticuada, indica una fecha deseada sin imponerla, pregunta por la copia del pasaporte y deja claro que espera respuesta."
    }
  },
  {
    slug: "b1-explain-context-sequence", title: "Explain Context in a Clear Written Sequence", order: 1313.3, imageKey: "reading-and-listening-lab:9",
    summary: "Give only the background needed for the reader to understand what happened, what changed, and what the situation is now.", situation: "explaining why an appointment must be changed",
    sentences: [
      ["El lunes reservé una cita para el viernes a las diez.", "On Monday I booked an appointment for Friday at ten.", "The first sentence anchors the original arrangement."],
      ["Sin embargo, ayer me informaron de un cambio en mi horario de trabajo.", "However, yesterday I was informed of a change in my work schedule.", "Sin embargo marks the event that makes the original plan impossible."],
      ["Por ese motivo, ya no puedo acudir a la hora acordada.", "For that reason, I can no longer attend at the agreed time.", "The consequence is explicitly linked to the change."],
      ["Podría asistir el viernes después de las dos o el lunes por la mañana.", "I could attend on Friday after two or Monday morning.", "Two bounded alternatives make the problem actionable."],
      ["¿Sería posible cambiar la cita a uno de esos horarios?", "Would it be possible to move the appointment to one of those times?", "The final request follows logically from the sequence."]
    ],
    readingJson: {
      title: "Situación original, cambio, consecuencia y opciones actuales",
      orientationDe: "Ordne den Kontext nach seiner Funktion statt nach jedem erinnerbaren Detail: ursprüngliche Vereinbarung, relevante Veränderung, konkrete Folge und heutige Möglichkeiten. Erst danach folgt die gewünschte Handlung.",
      orientationEn: "Organize context by function rather than every remembered detail: original arrangement, relevant change, concrete consequence, and current options. Only then state the requested action.",
      paragraphs: [
        "Buenos días: El lunes reservé una cita para el viernes a las diez. Sin embargo, ayer me informaron de una reunión obligatoria en el trabajo que terminará al mediodía.",
        "Por ese motivo, ya no puedo acudir a la hora acordada. Podría asistir el viernes después de las dos o el lunes por la mañana. ¿Sería posible cambiar la cita a uno de esos horarios? Gracias por su comprensión."
      ],
      questions: [
        { questionDe: "Welche Information erklärt, warum die ursprüngliche Zeit nicht mehr funktioniert?", questionEn: "Which information explains why the original time no longer works?", optionsDe: ["Die verpflichtende Besprechung bis mittags", "Die Buchung am Montag allein", "Der Dank am Schluss"], optionsEn: ["The mandatory meeting until noon", "The booking on Monday alone", "The thanks at the end"], correct: 0, explanationDe: "Die neue Arbeitspflicht ist die Veränderung, aus der die fehlende Verfügbarkeit folgt.", explanationEn: "The new work obligation is the change that causes the lack of availability." },
        { questionDe: "Was macht die Nachricht unmittelbar lösbar?", questionEn: "What makes the message immediately actionable?", optionsDe: ["Zwei klar begrenzte Alternativen", "Eine vollständige Wochenchronik", "Nur die Aussage, dass alles schwierig ist"], optionsEn: ["Two clearly bounded alternatives", "A complete chronicle of the week", "Only saying that everything is difficult"], correct: 0, explanationDe: "Die Empfängerseite kann die zwei Zeitfenster prüfen und die konkrete Änderungsfrage beantworten.", explanationEn: "The recipient can check the two time windows and answer the specific change request." }
      ],
      recallPromptDe: "Erkläre auf Spanisch eine Terminänderung in fünf Sätzen: ursprüngliche Vereinbarung, spätere relevante Veränderung, direkte Folge, zwei mögliche Alternativen und eine daraus folgende konkrete Bitte.",
      recallPromptEn: "Explain an appointment change in Spanish in five sentences: original arrangement, later relevant change, direct consequence, two possible alternatives, and one resulting request.",
      modelSummary: "La persona sitúa la cita original, introduce una reunión obligatoria posterior, conecta esa novedad con su imposibilidad de asistir, ofrece dos franjas concretas y pide trasladar la cita a una de ellas."
    }
  },
  {
    slug: "b1-reply-point-by-point", title: "Reply Point by Point Without Missing a Question", order: 1313.4, imageKey: "reading-and-listening-lab:10",
    summary: "Identify every requested item in an incoming message, answer each one visibly, and distinguish confirmation from information still pending.", situation: "replying to several questions from a course coordinator",
    sentences: [
      ["Gracias por su mensaje. Respondo a sus preguntas a continuación.", "Thank you for your message. I answer your questions below.", "The opening announces a structured response."],
      ["En cuanto al horario, puedo asistir por las tardes.", "Regarding the schedule, I can attend in the afternoons.", "En cuanto a labels the first answer by topic."],
      ["Respecto al nivel, terminé el curso A2 en junio.", "Regarding the level, I completed the A2 course in June.", "A second topic marker prevents two answers from blending together."],
      ["Adjunto la copia del certificado que me solicitaron.", "I attach the copy of the certificate that you requested.", "The sentence confirms a required attachment explicitly."],
      ["Todavía estoy esperando la confirmación de mi empresa sobre el viernes.", "I am still waiting for my company's confirmation about Friday.", "The response labels an unresolved item honestly instead of implying completion."]
    ],
    readingJson: {
      title: "Cada pregunta recibida obtiene un estado visible",
      orientationDe: "Markiere vor dem Antworten alle erbetenen Informationen, Dokumente und Entscheidungen. Beantworte sie danach einzeln. Unterscheide klar zwischen bestätigt, beigefügt und noch ausstehend.",
      orientationEn: "Before replying, mark every requested piece of information, document, and decision. Then answer them separately. Clearly distinguish confirmed, attached, and still pending.",
      paragraphs: [
        "Buenos días, señora Martín: Gracias por su mensaje. En cuanto al horario, puedo asistir de lunes a jueves por las tardes. Respecto al nivel, terminé el curso A2 en junio y adjunto el certificado solicitado.",
        "Sobre la sesión del viernes, todavía estoy esperando la confirmación de mi empresa. Se lo confirmaré como máximo mañana a las doce. Un saludo, David"
      ],
      questions: [
        { questionDe: "Welche drei Themen aus der Anfrage beantwortet David getrennt?", questionEn: "Which three topics from the request does David answer separately?", optionsDe: ["Verfügbarkeit, Sprachniveau und Freitagstermin", "Preis, Wohnort und Telefon", "Wetter, Reise und Essen"], optionsEn: ["Availability, language level, and the Friday session", "Price, address, and phone", "Weather, travel, and food"], correct: 0, explanationDe: "En cuanto al, respecto al und sobre markieren die drei Antwortbereiche sichtbar.", explanationEn: "En cuanto al, respecto al, and sobre visibly mark the three answer areas." },
        { questionDe: "Wie behandelt David die noch fehlende Firmenbestätigung?", questionEn: "How does David handle the missing company confirmation?", optionsDe: ["Er nennt sie als offen und verspricht eine Rückmeldung bis morgen Mittag", "Er stellt sie als bereits sicher dar", "Er lässt den Freitag vollständig unerwähnt"], optionsEn: ["He marks it as pending and promises an update by noon tomorrow", "He presents it as already certain", "He omits Friday completely"], correct: 0, explanationDe: "Todavía estoy esperando zeigt den aktuellen Status; se lo confirmaré nennt den nächsten Kontrollpunkt.", explanationEn: "Todavía estoy esperando shows the current status; se lo confirmaré gives the next checkpoint." }
      ],
      recallPromptDe: "Beantworte auf Spanisch eine Nachricht mit drei Punkten: Verfügbarkeit bestätigen, ein Dokument ausdrücklich als Anhang nennen und eine noch offene Entscheidung mit einem konkreten Rückmeldezeitpunkt kennzeichnen.",
      recallPromptEn: "Reply in Spanish to a three-part message: confirm availability, explicitly name an attached document, and mark one pending decision with a concrete update time.",
      modelSummary: "David responde por temas, confirma su disponibilidad y nivel, identifica el certificado adjunto y presenta la sesión del viernes como pendiente con una hora concreta para la próxima confirmación."
    }
  },
  {
    slug: "b1-follow-up-reminder", title: "Follow Up and Remind Without Rewriting the Whole Message", order: 1313.5, imageKey: "conversation-and-opinion:14",
    summary: "Refer to the earlier message, state what remains open, explain any real time constraint, and make the next response easy.", situation: "following up when a registration deadline is approaching",
    sentences: [
      ["Le escribo de nuevo en relación con mi mensaje del lunes.", "I am writing again regarding my message from Monday.", "The reference lets the reader locate the earlier thread."],
      ["Quería saber si ha podido revisar la solicitud.", "I wanted to know whether you have been able to review the application.", "The question checks status without assuming neglect."],
      ["El plazo termina mañana y todavía me falta su confirmación.", "The deadline ends tomorrow and I still need your confirmation.", "A factual constraint explains the urgency."],
      ["Si necesita algún documento adicional, puedo enviarlo hoy mismo.", "If you need any additional document, I can send it today.", "The offer removes a possible obstacle."],
      ["Le agradecería una breve confirmación cuando sea posible.", "I would appreciate a brief confirmation when possible.", "The requested response is deliberately small and clear."]
    ],
    readingJson: {
      title: "Referencia, estado abierto, urgencia real y respuesta fácil",
      orientationDe: "Eine Erinnerung wiederholt nicht die gesamte erste Nachricht. Verweise auf den Vorgang, benenne den offenen Punkt und nur eine echte Frist. Biete fehlende Zuarbeit an und formuliere die kleinstmögliche hilfreiche Antwort.",
      orientationEn: "A reminder does not repeat the entire first message. Refer to the thread, name the open item, and give only a real deadline. Offer any missing input and request the smallest useful response.",
      paragraphs: [
        "Buenos días: Le escribo de nuevo en relación con la solicitud que envié el lunes. Quería saber si ha podido revisarla, ya que el plazo de inscripción termina mañana y todavía me falta la confirmación.",
        "Si necesita algún documento adicional, puedo enviarlo hoy mismo. Le agradecería una breve confirmación cuando sea posible. Muchas gracias, Laura"
      ],
      questions: [
        { questionDe: "Wodurch begründet Laura die Dringlichkeit sachlich?", questionEn: "How does Laura justify the urgency factually?", optionsDe: ["Die Anmeldefrist endet morgen", "Sie verwendet besonders viele Ausrufezeichen", "Sie behauptet, absichtlich ignoriert zu werden"], optionsEn: ["The registration deadline ends tomorrow", "She uses many exclamation marks", "She claims she is being intentionally ignored"], correct: 0, explanationDe: "Die reale externe Frist erklärt, warum eine zeitnahe Bestätigung gebraucht wird.", explanationEn: "The real external deadline explains why a timely confirmation is needed." },
        { questionDe: "Wie erleichtert Laura der Empfängerseite den nächsten Schritt?", questionEn: "How does Laura make the next step easier for the recipient?", optionsDe: ["Sie bietet fehlende Dokumente heute an und bittet nur um kurze Bestätigung", "Sie fügt drei neue Themen hinzu", "Sie verlangt eine lange Begründung"], optionsEn: ["She offers missing documents today and asks only for brief confirmation", "She adds three new topics", "She demands a long explanation"], correct: 0, explanationDe: "Angebot und kleine Antwortanforderung reduzieren mögliche Hindernisse für eine schnelle Reaktion.", explanationEn: "The offer and small response request reduce possible obstacles to a quick reply." }
      ],
      recallPromptDe: "Formuliere auf Spanisch eine höfliche Erinnerung: frühere Nachricht eindeutig verorten, offenen Status erfragen, eine reale Frist erklären, mögliche fehlende Zuarbeit anbieten und um eine kurze konkrete Antwort bitten.",
      recallPromptEn: "Write a polite Spanish follow-up: locate the earlier message, ask about the open status, explain a real deadline, offer any missing input, and request one brief concrete reply.",
      modelSummary: "Laura remite a su solicitud anterior, pregunta por el estado sin acusar, explica el plazo, ofrece documentación adicional ese mismo día y reduce la respuesta necesaria a una confirmación breve."
    }
  },
  {
    slug: "b1-written-problem-resolution", title: "Report a Written Problem and Request Resolution", order: 1313.6, imageKey: "conversation-and-opinion:7",
    summary: "Document facts, evidence, impact, preferred remedy, acceptable alternative, and the next response point without emotional escalation.", situation: "writing about an incorrect online order",
    sentences: [
      ["El pedido llegó el martes, pero faltaban dos productos.", "The order arrived on Tuesday, but two products were missing.", "Date and observable mismatch establish the factual problem."],
      ["Adjunto una foto del contenido y una copia de la factura.", "I attach a photo of the contents and a copy of the invoice.", "The message names evidence that the reader can inspect."],
      ["Necesito los productos antes del viernes para un evento.", "I need the products before Friday for an event.", "The practical impact explains the meaningful time constraint."],
      ["Preferiría que enviaran los artículos que faltan sin coste adicional.", "I would prefer you to send the missing items at no additional cost.", "The preferred remedy is explicit and proportionate."],
      ["Si no fuera posible, agradecería el reembolso de esos dos artículos.", "If that is not possible, I would appreciate a refund for those two items.", "A bounded alternative keeps resolution possible."]
    ],
    readingJson: {
      title: "Hechos comprobables, impacto y dos soluciones proporcionadas",
      orientationDe: "Eine schriftliche Problemmeldung trennt beobachtbare Abweichung, Beleg, praktische Folge und gewünschte Lösung. Nenne eine begrenzte Alternative, statt Absicht zu unterstellen oder den gesamten Kauf pauschal abzuwerten.",
      orientationEn: "A written problem report separates observable mismatch, evidence, practical impact, and requested remedy. Give one bounded alternative instead of attributing intention or condemning the entire purchase.",
      paragraphs: [
        "Estimado equipo de atención al cliente: El pedido 4831 llegó el martes, pero faltaban dos de los seis productos. Adjunto una foto del contenido del paquete y una copia de la factura.",
        "Necesito esos artículos antes del viernes para un evento. Preferiría que los enviaran sin coste adicional. Si no fuera posible entregarlos a tiempo, agradecería el reembolso de los dos productos que faltan. Quedo pendiente de su respuesta."
      ],
      questions: [
        { questionDe: "Welche Belege kann das Serviceteam unmittelbar prüfen?", questionEn: "Which evidence can the service team inspect immediately?", optionsDe: ["Foto des Inhalts und Rechnungskopie", "Nur die persönliche Enttäuschung", "Eine fremde Bestellung ohne Nummer"], optionsEn: ["Photo of the contents and copy of the invoice", "Only personal disappointment", "Someone else's order without a number"], correct: 0, explanationDe: "Beide ausdrücklich genannten Anhänge stützen die konkrete Mengenabweichung.", explanationEn: "Both explicitly named attachments support the concrete quantity mismatch." },
        { questionDe: "Wie bleibt die geforderte Lösung verhältnismäßig?", questionEn: "How does the requested solution remain proportionate?", optionsDe: ["Nachsendung der fehlenden Artikel oder Erstattung genau dieser Artikel", "Erstattung aller jemals gekauften Produkte", "Öffentliche Schuldzuweisung ohne Anfrage"], optionsEn: ["Send the missing items or refund exactly those items", "Refund every product ever purchased", "Public blame without a request"], correct: 0, explanationDe: "Bevorzugte und alternative Lösung beziehen sich beide nur auf die belegte Abweichung.", explanationEn: "Preferred and alternative remedies both address only the documented mismatch." }
      ],
      recallPromptDe: "Schreibe auf Spanisch eine sachliche Problemmeldung: Datum und konkrete Abweichung, zwei prüfbare Belege, praktische Folge, bevorzugte verhältnismäßige Lösung, eine begrenzte Alternative und klarer Antwortbedarf.",
      recallPromptEn: "Write a factual Spanish problem report: date and exact mismatch, two inspectable pieces of evidence, practical impact, preferred proportionate remedy, one bounded alternative, and clear response need.",
      modelSummary: "El cliente identifica pedido, fecha y dos artículos ausentes, aporta foto y factura, explica la necesidad antes del viernes y solicita primero el envío sin coste o, como alternativa, el reembolso limitado."
    }
  },
  {
    slug: "checkpoint-b1-messages-emails", title: "Checkpoint: Complete a Written Exchange from Opening to Resolution", order: 1313.7, imageKey: "reading-and-listening-lab:16", checkpoint: true,
    summary: "Independently read a multi-part request, write a structured reply, follow up on one pending item, and resolve a documented problem in an appropriate register.", situation: "completing an email thread about a course registration problem",
    sentences: [
      ["Le escribo en relación con mi inscripción en el curso de octubre.", "I am writing regarding my registration for the October course.", "The opening identifies the exact process immediately."],
      ["Adjunto el certificado solicitado y confirmo que puedo asistir por las tardes.", "I attach the requested certificate and confirm that I can attend in the afternoons.", "The reply completes two requested items visibly."],
      ["Todavía no he recibido la confirmación del pago que realicé el lunes.", "I still have not received confirmation of the payment I made on Monday.", "The unresolved item includes its relevant time anchor."],
      ["¿Podrían comprobar si el pago se ha registrado correctamente?", "Could you check whether the payment has been recorded correctly?", "The request names one verifiable action."],
      ["Si necesitan otro justificante, puedo enviarlo hoy mismo.", "If you need another receipt, I can send it today.", "The conditional offer removes a likely obstacle."],
      ["Les agradecería una breve respuesta antes del viernes, ya que entonces termina el plazo.", "I would appreciate a brief reply before Friday, since that is when the deadline ends.", "Response size, desired date, and factual reason are all explicit."]
    ],
    readingJson: {
      title: "Un hilo escrito completo con estado, prueba y siguiente acción",
      orientationDe: "Übertrage die gesamte schriftliche Handlungskette: Register wählen, Vorgang benennen, erhaltene Fragen punktweise beantworten, Anhang bestätigen, offenen Status mit Zeitbezug markieren, prüfbare Handlung erbitten und Frist sachlich begründen.",
      orientationEn: "Transfer the complete written action chain: choose register, identify the process, answer received questions point by point, confirm an attachment, mark pending status with a time reference, request a verifiable action, and justify the date factually.",
      paragraphs: [
        "Estimado equipo de inscripción: Le escribo en relación con mi inscripción en el curso de octubre. Adjunto el certificado solicitado y confirmo que puedo asistir por las tardes. Sin embargo, todavía no he recibido la confirmación del pago que realicé el lunes.",
        "¿Podrían comprobar si el pago se ha registrado correctamente? Si necesitan otro justificante, puedo enviarlo hoy mismo. Les agradecería una breve respuesta antes del viernes, ya que entonces termina el plazo. Un saludo, Felix Braun"
      ],
      questions: [
        { questionDe: "Welche zwei Punkte aus der früheren Anfrage erledigt Felix sichtbar?", questionEn: "Which two items from the earlier request does Felix visibly complete?", optionsDe: ["Zertifikat beifügen und Nachmittagsverfügbarkeit bestätigen", "Kurs absagen und Adresse ändern", "Neuen Preis festlegen und telefonieren"], optionsEn: ["Attach the certificate and confirm afternoon availability", "Cancel the course and change address", "Set a new price and call"], correct: 0, explanationDe: "Adjunto und confirmo markieren zwei abgeschlossene Antwortpunkte ausdrücklich.", explanationEn: "Adjunto and confirmo explicitly mark two completed response items." },
        { questionDe: "Wie verbindet Felix offenen Status, gewünschte Handlung und Frist?", questionEn: "How does Felix connect pending status, requested action, and deadline?", optionsDe: ["Fehlende Zahlungsbestätigung, Registrierungsprüfung und Fristende am Freitag", "Allgemeine Unzufriedenheit ohne Beleg", "Mehrere unverbundene Bitten ohne Zeitpunkt"], optionsEn: ["Missing payment confirmation, registration check, and deadline ending Friday", "General dissatisfaction without evidence", "Several unrelated requests without a time"], correct: 0, explanationDe: "Der Text führt vom belegten offenen Punkt zu einer konkreten Prüfung und begründet den gewünschten Antwortzeitpunkt extern.", explanationEn: "The message moves from a documented pending item to a concrete check and justifies the desired response date externally." }
      ],
      recallPromptDe: "Schreibe ohne Vorlage auf Spanisch eine vollständige Antwort auf einen Anmeldevorgang: passende Anrede und Zweck, zwei erledigte Antwortpunkte, ein Anhang, ein offener Zahlungsstatus mit Datum, konkrete Prüfanfrage, Hilfsangebot und sachlich begründete Antwortfrist.",
      recallPromptEn: "Without a model, write a complete Spanish registration reply: suitable greeting and purpose, two completed response items, one attachment, one pending payment status with date, concrete check request, offer of help, and factually justified reply date.",
      modelSummary: "Felix identifica la inscripción, responde a disponibilidad y certificado, distingue la confirmación de pago pendiente, solicita una comprobación concreta, ofrece otro justificante y explica por qué necesita respuesta antes del viernes."
    }
  }
];

const vocabulary = [
  ["el asunto", "email subject", "noun", "masculine", "El asunto identifica la solicitud."],
  ["el saludo", "greeting", "noun", "masculine", "El saludo corresponde a la relación."],
  ["el destinatario", "recipient", "noun", "masculine", "Confirmo el destinatario."],
  ["el motivo del mensaje", "reason for the message", "phrase", "masculine", "Explico el motivo del mensaje."],
  ["le escribo para", "I am writing to", "phrase", null, "Le escribo para solicitar información."],
  ["en relación con", "regarding", "phrase", null, "Escribo en relación con la inscripción."],
  ["solicitar información", "to request information", "phrase", null, "Quiero solicitar información."],
  ["confirmar un dato", "to confirm a detail", "phrase", null, "Necesito confirmar un dato."],
  ["adjuntar un documento", "to attach a document", "phrase", null, "Voy a adjuntar un documento."],
  ["el archivo adjunto", "attachment", "phrase", "masculine", "Revise el archivo adjunto."],
  ["la solicitud", "application or request", "noun", "feminine", "Completo la solicitud."],
  ["el formulario", "form", "noun", "masculine", "Envío el formulario."],
  ["el justificante", "receipt or supporting document", "noun", "masculine", "Adjunto el justificante del pago."],
  ["quedar pendiente", "to await or remain pending", "phrase", null, "Quedo pendiente de su respuesta."],
  ["en cuanto a", "regarding a first point", "phrase", null, "En cuanto al horario, puedo asistir."],
  ["respecto a", "regarding another point", "phrase", null, "Respecto al nivel, terminé A2."],
  ["estar a la espera de", "to be waiting for", "phrase", null, "Estoy a la espera de la confirmación."],
  ["hacer un seguimiento", "to follow up", "phrase", null, "Voy a hacer un seguimiento mañana."],
  ["el plazo", "deadline or time limit", "noun", "masculine", "El plazo termina el viernes."],
  ["una breve confirmación", "a brief confirmation", "phrase", "feminine", "Necesito una breve confirmación."],
  ["la incidencia", "issue or incident", "noun", "feminine", "Describo la incidencia con datos."],
  ["aportar pruebas", "to provide evidence", "phrase", null, "Puedo aportar pruebas."],
  ["la solución preferida", "preferred solution", "phrase", "feminine", "Indico la solución preferida."],
  ["el reembolso", "refund", "noun", "masculine", "Solicito el reembolso." ]
];

const normalize = (value) => String(value || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñü]+/g, " ").trim();
const accepted = (value) => [...new Set([value, normalize(value), `${normalize(value)}.`, `${normalize(value)}?`, `${normalize(value)}!`])];
const tokenize = (value) => String(value || "").replace(/[¿?¡!.,;:]/g, "").split(/\s+/).filter(Boolean);

const checkpointFunctionalChecks = {
  "checkpoint-b1-messages-emails:short-answer": {
    minimumMatched: 3,
    groups: [
      { key: "attachment-action", labelDe: "Anhang als erledigte Handlung", labelEn: "completed attachment action", required: true, any: ["adjunto", "he adjuntado", "envío", "envio"] },
      { key: "attachment", labelDe: "Zertifikat oder Dokument", labelEn: "certificate or document", any: ["certificado", "documento"] },
      { key: "availability", labelDe: "Verfügbarkeit bestätigen", labelEn: "confirm availability", required: true, any: ["puedo asistir", "estoy disponible", "tengo disponibilidad"] },
      { key: "afternoon", labelDe: "Nachmittag als Zeitangabe", labelEn: "afternoon time detail", any: ["por las tardes", "de tarde", "en horario de tarde"] }
    ]
  },
  "checkpoint-b1-messages-emails:dialogue-reply": {
    minimumMatched: 3,
    groups: [
      { key: "request", labelDe: "höfliche Prüfanfrage", labelEn: "polite check request", required: true, any: ["podrían comprobar", "podrian comprobar", "pueden comprobar", "quisiera saber", "me gustaría saber", "me gustaria saber"] },
      { key: "payment", labelDe: "Zahlung als Vorgang", labelEn: "payment process", required: true, any: ["pago"] },
      { key: "status", labelDe: "zu prüfender Zahlungsstatus", labelEn: "payment status to verify", required: true, any: ["registrado", "recibido", "consta", "correctamente"] }
    ]
  },
  "checkpoint-b1-messages-emails:write": {
    minimumMatched: 4,
    groups: [
      { key: "request", labelDe: "höfliche Bitte", labelEn: "polite request", required: true, any: ["agradecería", "agradeceria", "necesito", "quisiera", "podrían responder", "podrian responder", "espero"] },
      { key: "reply", labelDe: "gewünschte Antwort oder Bestätigung", labelEn: "requested reply or confirmation", required: true, any: ["respuesta", "confirmación", "confirmacion", "responder"] },
      { key: "date", labelDe: "Freitag als Zeitpunkt", labelEn: "Friday as the requested date", required: true, any: ["viernes"] },
      { key: "reason", labelDe: "sachlicher Fristgrund", labelEn: "factual deadline reason", required: true, any: ["plazo", "fecha límite", "fecha limite", "termina", "vence"] }
    ]
  }
};

function checksFor(input) {
  const sentences = input.sentences;
  return [
    ...[0, 1, 2].map((index) => ({ key: `recognize-${index + 1}`, type: ExerciseType.MULTIPLE_CHOICE, question: sentences[index][1], correct: sentences[index][0], options: [sentences[index][0], sentences[(index + 1) % sentences.length][0], sentences[(index + 2) % sentences.length][0]] })),
    ...[3, 4].map((index) => ({ key: `build-${index + 1}`, type: ExerciseType.SENTENCE_BUILDER, question: sentences[index][1], correct: sentences[index][0] })),
    ...[0, 2].map((index) => ({ key: `translate-${index + 1}`, type: ExerciseType.TRANSLATION, question: sentences[index][1], correct: sentences[index][0] })),
    { key: "short-answer", type: ExerciseType.SHORT_ANSWER, question: sentences[1][1], correct: sentences[1][0] },
    { key: "dialogue-reply", type: ExerciseType.DIALOGUE_REPLY, question: sentences[3][1], correct: sentences[3][0] },
    { key: "write", type: ExerciseType.WRITING_PROMPT, question: sentences.at(-1)[1], correct: sentences.at(-1)[0] }
  ];
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const functionalCheck = checkpointFunctionalChecks[`${input.slug}:${check.key}`];
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "written_communication_word_order" }
    : {
        correct: check.correct,
        accepted: accepted(check.correct),
        goal: "written_communication_function",
        rubric: functionalCheck
          ? "Perform the requested written function clearly in an appropriate register; equivalent natural Spanish is accepted by the visible function goals."
          : "Retrieve the lesson's Spanish written-communication model accurately before the checkpoint transfer.",
        ...(functionalCheck ? { functionalCheck } : {})
      };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the Spanish sentence that performs the current written function" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the next sentence of the Spanish message" : "Write the next part of the message in Spanish",
    instruction: "Identify the function first: open, state purpose, request, explain context, answer, attach, mark pending status, follow up, document a problem, or close. Keep register and reference consistent.",
    questionText: check.question, answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 2 : check.type === ExerciseType.SENTENCE_BUILDER ? 3 : 4,
    order, xpReward: 16, imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "messages-emails-written-action" },
    update: { title: "Messages, Emails, and Written Action", description: "Register, purpose, precise requests, relevant context, point-by-point replies, attachments, pending status, follow-up, evidence, remedies, and complete written exchanges.", cefrLevel: "B1", imageKey: "conversation-and-opinion:12" },
    create: { slug: "messages-emails-written-action", title: "Messages, Emails, and Written Action", description: "Register, purpose, precise requests, relevant context, point-by-point replies, attachments, pending status, follow-up, evidence, remedies, and complete written exchanges.", cefrLevel: "B1", imageKey: "conversation-and-opinion:12" }
  });
  const vocabularyGroup = await prisma.vocabularyGroup.upsert({
    where: { slug: "b1-messages-emails" },
    update: { title: "B1 Messages and Emails", description: "Reusable language for clear personal, professional, and service messages from opening through response and resolution.", situation: "completing a written exchange with a visible next action", imageKey: "conversation-and-opinion:12" },
    create: { slug: "b1-messages-emails", title: "B1 Messages and Emails", description: "Reusable language for clear personal, professional, and service messages from opening through response and resolution.", situation: "completing a written exchange with a visible next action", imageKey: "conversation-and-opinion:12" }
  });
  for (const [spanish, english, partOfSpeech, gender, example] of vocabulary) {
    const existing = await prisma.word.findFirst({ where: { groupId: vocabularyGroup.id, spanish } });
    const data = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: vocabularyGroup.id };
    if (existing) await prisma.word.update({ where: { id: existing.id }, data });
    else await prisma.word.create({ data });
  }
  const supportingGroups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["b1-workplace-collaboration", "b1-plans-reactions"] } } });
  const groups = [vocabularyGroup, ...supportingGroups];
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Written Communication", situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can choose an appropriate register and make purpose, request, and relevant context easy to find.", "You can answer every received point, label attachments and pending items, and follow up without blame.", "You can document a problem with evidence and request a proportionate written resolution."],
      conceptKeys: ["b1", "written-communication", "messages-emails", input.slug], reviewSummary: input.summary, readingJson: input.readingJson,
      order: input.order, estimatedMinutes: input.checkpoint ? 23 : 19, topicId: topic.id
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
  console.log(`Seeded ${lessons.length} B1.11 messages-and-emails learning packages and ${vocabulary.length} aligned vocabulary items.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons, vocabulary };
