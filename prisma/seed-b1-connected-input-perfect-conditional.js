const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "b1-present-perfect-meaning": {
    title: "Una semana que todavía no ha terminado",
    inputMode: "listening",
    orientationDe: "Achte darauf, ob der genannte Zeitraum noch läuft oder bereits abgeschlossen ist. Genau diese Perspektive steuert hier die Zeitform.",
    orientationEn: "Notice whether each time period is still open or already finished. That perspective controls the tense here.",
    paragraphs: [
      "Esta semana ha sido intensa para Julia. Ha trabajado desde casa dos días, ha hablado varias veces con un cliente nuevo y hoy ha terminado una propuesta importante. Todavía es jueves, así que para ella la semana sigue abierta.",
      "Ayer fue distinto: salió temprano, tomó el tren y visitó la oficina de Madrid. Cuando cuenta ese día, usa el pretérito porque ayer ya terminó. La misma acción pasada cambia de perspectiva según el período desde el que se mira."
    ],
    questions: [
      { questionDe: "Warum sagt Julia esta semana ha sido intensa?", questionEn: "Why does Julia say esta semana ha sido intensa?", optionsDe: ["Die Woche läuft für sie noch", "Die Woche liegt Jahre zurück", "Die Handlung war nur geplant"], optionsEn: ["The week is still in progress for her", "The week was years ago", "The action was only planned"], correct: 0, explanationDe: "Der Zeitraum esta semana ist am Donnerstag noch offen; das Perfekt verbindet die bisherigen Ereignisse deshalb mit dem Jetzt.", explanationEn: "On Thursday, esta semana is still open, so the perfect connects the events so far with the present." },
      { questionDe: "Weshalb verwendet der Text für den Bürobesuch das Pretérito?", questionEn: "Why does the text use the preterite for the office visit?", optionsDe: ["Ayer ist ein abgeschlossener Zeitraum", "Besuche stehen immer im Pretérito", "Julia erinnert sich nicht"], optionsEn: ["Ayer is a completed time period", "Visits always use the preterite", "Julia does not remember"], correct: 0, explanationDe: "Ayer ist abgeschlossen. Salió, tomó und visitó erzählen Ereignisse innerhalb dieses geschlossenen vergangenen Tages.", explanationEn: "Ayer is complete. Salió, tomó, and visitó narrate events inside that closed past day." }
    ],
    recallPromptDe: "Berichte auf Spanisch, was Julia diese Woche bisher getan hat, und stelle dem mindestens ein abgeschlossenes Ereignis von gestern gegenüber.",
    recallPromptEn: "In Spanish, report what Julia has done so far this week and contrast it with at least one completed event from yesterday.",
    modelSummary: "Esta semana Julia ha trabajado en casa y ha terminado una propuesta, pero ayer salió temprano y visitó la oficina de Madrid."
  },
  "b1-regular-participles": {
    title: "El informe del equipo internacional",
    orientationDe: "Beobachte die Formen von haber und prüfe zugleich, ob sich das Partizip mit Person oder Anzahl verändert.",
    orientationEn: "Watch the forms of haber and check whether the participle changes with person or number.",
    paragraphs: [
      "El equipo prepara un informe internacional. Yo he hablado con los clientes, tú has reunido los datos y Marta ha revisado las cifras. Nosotros hemos escrito la introducción, mientras que dos compañeros han organizado las imágenes.",
      "Al final, todos comparan sus avances. Aunque cambian he, has, ha, hemos y han, los participios hablado, reunido, revisado, escrito y organizado no concuerdan con el sujeto. Haber lleva la información de persona; el participio presenta el resultado."
    ],
    questions: [
      { questionDe: "Wer hat die Einleitung geschrieben?", questionEn: "Who has written the introduction?", optionsDe: ["Der Sprecher und sein Team", "Nur Marta", "Die Kunden"], optionsEn: ["The speaker and the team", "Marta alone", "The clients"], correct: 0, explanationDe: "Nosotros hemos escrito la introducción nennt das Team als Handelnde; hemos markiert dabei die erste Person Plural.", explanationEn: "Nosotros hemos escrito la introducción identifies the team; hemos marks first-person plural." },
      { questionDe: "Welche Form trägt im Perfekt die Personeninformation?", questionEn: "Which form carries person information in the perfect?", optionsDe: ["Die jeweilige Form von haber", "Die Endung des Partizips", "Der bestimmte Artikel"], optionsEn: ["The relevant form of haber", "The participle ending", "The definite article"], correct: 0, explanationDe: "He, has, ha, hemos und han wechseln mit der Person. Das Partizip bleibt mit haber unverändert und trägt keine Kongruenzendung.", explanationEn: "He, has, ha, hemos, and han change with person. With haber, the participle remains invariant." }
    ],
    recallPromptDe: "Fasse die Aufgabenverteilung auf Spanisch mit mindestens drei verschiedenen Formen von haber und passenden Partizipien zusammen.",
    recallPromptEn: "Summarize the division of work in Spanish using at least three forms of haber with suitable participles.",
    modelSummary: "Yo he hablado con los clientes, Marta ha revisado las cifras y nosotros hemos escrito la introducción del informe."
  },
  "b1-irregular-participles": {
    title: "Todo listo antes de abrir el café",
    inputMode: "listening",
    orientationDe: "Höre die häufigen unregelmäßigen Partizipien als feste Einheiten mit haber: hecho, puesto, abierto, escrito, visto und vuelto.",
    orientationEn: "Listen for frequent irregular participles as chunks with haber: hecho, puesto, abierto, escrito, visto, and vuelto.",
    paragraphs: [
      "Son las siete y el nuevo café abre dentro de una hora. Clara ya ha hecho el pan, ha puesto las mesas junto a la ventana y ha escrito el menú del día. Su compañero Diego ha abierto las cajas y ha visto que faltan dos tazas.",
      "Diego ha vuelto rápidamente del almacén con todo lo necesario. Antes de recibir al primer cliente, comprueban la lista: han hecho mucho trabajo, pero no dicen hacido, ponido ni abrido. Las formas irregulares aparecen dentro de resultados concretos."
    ],
    questions: [
      { questionDe: "Welches Problem entdeckt Diego?", questionEn: "What problem does Diego discover?", optionsDe: ["Zwei Tassen fehlen", "Das Brot ist verbrannt", "Das Café öffnet morgen"], optionsEn: ["Two cups are missing", "The bread is burnt", "The café opens tomorrow"], correct: 0, explanationDe: "Ha visto que faltan dos tazas beschreibt Diegos Entdeckung; danach kehrt er mit dem Benötigten aus dem Lager zurück.", explanationEn: "Ha visto que faltan dos tazas describes Diego's discovery, after which he returns with what is needed." },
      { questionDe: "Welche Partizipien gehören zu hacer, poner und abrir?", questionEn: "Which participles belong to hacer, poner, and abrir?", optionsDe: ["Hecho, puesto und abierto", "Hacido, ponido und abrido", "Hago, pongo und abro"], optionsEn: ["Hecho, puesto, and abierto", "Hacido, ponido, and abrido", "Hago, pongo, and abro"], correct: 0, explanationDe: "Hecho, puesto und abierto sind die gebräuchlichen unregelmäßigen Partizipien und werden als vollständige Formen gespeichert.", explanationEn: "Hecho, puesto, and abierto are the common irregular participles and are learned as complete forms." }
    ],
    recallPromptDe: "Erzähle auf Spanisch mit mindestens vier unregelmäßigen Partizipien, was Clara und Diego vor der Eröffnung bereits erledigt haben.",
    recallPromptEn: "In Spanish, use at least four irregular participles to say what Clara and Diego have completed before opening.",
    modelSummary: "Clara ha hecho el pan, ha puesto las mesas y ha escrito el menú; Diego ha abierto las cajas, ha visto el problema y ha vuelto del almacén."
  },
  "b1-perfect-time-markers": {
    title: "La lista de experiencias de Inés",
    orientationDe: "Ordne ya, todavía no, nunca, alguna vez und últimamente ihrer Funktion zu: erledigt, noch offen, bisher nie, Erfahrung oder jüngster Zeitraum.",
    orientationEn: "Match ya, todavía no, nunca, alguna vez, and últimamente with completion, open expectation, experience, or a recent period.",
    paragraphs: [
      "Inés prepara un viaje largo. Ya ha comprado el billete, pero todavía no ha reservado el hotel. Nunca ha viajado sola fuera de Europa y pregunta a su amiga: «¿Has estado alguna vez en Colombia?».",
      "Su amiga conoce bien el país y le responde que sí. Últimamente ha hablado mucho con unos amigos de Bogotá y ya ha preparado una lista de lugares. Inés sigue nerviosa, pero ahora tiene información y una tarea pendiente muy concreta."
    ],
    questions: [
      { questionDe: "Welche Aufgabe ist noch nicht erledigt?", questionEn: "Which task has not been completed yet?", optionsDe: ["Das Hotel reservieren", "Das Ticket kaufen", "Eine Freundin fragen"], optionsEn: ["Reserve the hotel", "Buy the ticket", "Ask a friend"], correct: 0, explanationDe: "Todavía no ha reservado el hotel kennzeichnet eine erwartete Handlung, die bis zum jetzigen Zeitpunkt noch offen ist.", explanationEn: "Todavía no ha reservado el hotel marks an expected action that remains incomplete up to now." },
      { questionDe: "Wonach fragt alguna vez?", questionEn: "What does alguna vez ask about?", optionsDe: ["Ob die Erfahrung irgendwann bisher vorkam", "Ob sie gerade in Bogotá ist", "Wie lange der Flug dauert"], optionsEn: ["Whether the experience has ever occurred", "Whether she is in Bogotá now", "How long the flight takes"], correct: 0, explanationDe: "Alguna vez öffnet den gesamten Erfahrungszeitraum bis heute und fragt, ob der Kolumbienbesuch darin einmal stattgefunden hat.", explanationEn: "Alguna vez opens the experience period up to today and asks whether the visit has occurred within it." }
    ],
    recallPromptDe: "Gib auf Spanisch wieder, was Inés schon, noch nicht und noch nie getan hat, und formuliere zusätzlich ihre Erfahrungsfrage.",
    recallPromptEn: "In Spanish, state what Inés has already, not yet, and never done, and include her experience question.",
    modelSummary: "Inés ya ha comprado el billete, todavía no ha reservado el hotel y nunca ha viajado sola fuera de Europa; pregunta si su amiga ha estado alguna vez en Colombia."
  },
  "b1-past-perfect": {
    title: "La llave que cambió toda la tarde",
    inputMode: "listening",
    orientationDe: "Rekonstruiere zwei Zeitebenen: Was geschah zuerst, und welches spätere Ereignis machte die frühere Handlung relevant?",
    orientationEn: "Reconstruct two time levels: what happened first, and which later event made that earlier action relevant?",
    paragraphs: [
      "Cuando Daniel llegó a casa, descubrió que había perdido la llave. La había usado por la mañana, pero después había cambiado de chaqueta antes de salir de la oficina. Buscó en todos los bolsillos y llamó a su compañera.",
      "Ella encontró la llave debajo de una mesa. El personal de limpieza todavía no había cerrado el edificio, así que Daniel pudo volver a recogerla. Cuando regresó a casa por segunda vez, su vecino ya había llamado a un cerrajero para ayudarlo."
    ],
    questions: [
      { questionDe: "Was war geschehen, bevor Daniel erstmals zu Hause ankam?", questionEn: "What had happened before Daniel first arrived home?", optionsDe: ["Er hatte den Schlüssel verloren", "Der Schlüsseldienst hatte die Tür geöffnet", "Sein Nachbar war verreist"], optionsEn: ["He had lost the key", "The locksmith had opened the door", "His neighbor had left"], correct: 0, explanationDe: "Había perdido liegt zeitlich vor llegó. Das Plusquamperfekt markiert damit die frühere Ursache des später entdeckten Problems.", explanationEn: "Había perdido precedes llegó. The past perfect marks the earlier cause of the later discovery." },
      { questionDe: "Warum konnte Daniel noch ins Büro zurückkehren?", questionEn: "Why could Daniel still return to the office?", optionsDe: ["Das Reinigungsteam hatte noch nicht abgeschlossen", "Er hatte einen Ersatzschlüssel", "Das Büro war näher als sein Haus"], optionsEn: ["The cleaning staff had not locked up yet", "He had a spare key", "The office was closer than home"], correct: 0, explanationDe: "Todavía no había cerrado zeigt, dass das erwartete Schließen vor Daniels Rückkehr noch nicht stattgefunden hatte.", explanationEn: "Todavía no había cerrado shows that the expected closing had not happened before Daniel returned." }
    ],
    recallPromptDe: "Erzähle die Geschichte auf Spanisch in zeitlicher Ordnung und verwende mindestens zwei Formen mit había oder habían für die früheren Ereignisse.",
    recallPromptEn: "Retell the story in Spanish in chronological order, using at least two había or habían forms for earlier events.",
    modelSummary: "Daniel había perdido la llave después de cambiar de chaqueta; cuando volvió a la oficina, el personal todavía no había cerrado y su compañera ya la había encontrado."
  },
  "checkpoint-b1-perfect-tenses": {
    title: "Una consulta médica con varios tiempos",
    orientationDe: "Entscheide für jedes Ereignis, ob es mit heute verbunden, in einem abgeschlossenen Zeitraum erzählt oder vor einem anderen vergangenen Moment geschehen ist.",
    orientationEn: "For each event, decide whether it connects to today, belongs to a closed period, or happened before another past moment.",
    paragraphs: [
      "Esta mañana Laura ha hablado con el médico porque últimamente ha dormido mal. Ya ha recibido algunos consejos, pero todavía no ha comprado el medicamento. Ayer fue a una farmacia cercana y descubrió que no lo tenían.",
      "Cuando llegó allí, el proveedor todavía no había entregado el pedido. Por suerte, Laura había escrito el nombre exacto y la farmacéutica llamó a otra tienda. Ahora Laura sabe qué ha pasado, qué ocurrió ayer y qué había sucedido antes."
    ],
    questions: [
      { questionDe: "Welche Handlung gehört zum noch aktuellen Zeitraum heute?", questionEn: "Which action belongs to the still-current period today?", optionsDe: ["Laura hat mit dem Arzt gesprochen", "Sie ging gestern zur Apotheke", "Der Lieferant hatte nicht geliefert"], optionsEn: ["Laura has spoken with the doctor", "She went to the pharmacy yesterday", "The supplier had not delivered"], correct: 0, explanationDe: "Esta mañana ha hablado verbindet das Gespräch mit dem heutigen, noch relevanten Zeitraum; ayer fue erzählt dagegen einen abgeschlossenen Tag.", explanationEn: "Esta mañana ha hablado connects the conversation with today's relevant period; ayer fue narrates a completed day." },
      { questionDe: "Was war vor Lauras Ankunft in der Apotheke noch nicht geschehen?", questionEn: "What had not happened before Laura arrived at the pharmacy?", optionsDe: ["Die Lieferung des Medikaments", "Das Gespräch mit dem Arzt", "Das Aufschreiben des Namens"], optionsEn: ["Delivery of the medicine", "The conversation with the doctor", "Writing down the name"], correct: 0, explanationDe: "Todavía no había entregado ordnet die ausstehende Lieferung vor dem Referenzpunkt llegó ein und erklärt den fehlenden Bestand.", explanationEn: "Todavía no había entregado places the missing delivery before llegó and explains the lack of stock." }
    ],
    recallPromptDe: "Fasse Lauras Situation auf Spanisch zusammen und verwende bewusst Perfekt, Pretérito und Plusquamperfekt für die drei Zeitperspektiven.",
    recallPromptEn: "Summarize Laura's situation in Spanish, deliberately using present perfect, preterite, and past perfect for the three perspectives.",
    modelSummary: "Hoy Laura ha hablado con el médico; ayer fue a la farmacia, pero el proveedor todavía no había entregado el medicamento cuando llegó."
  },
  "b1-conditional-meaning": {
    title: "Ideas para cambiar de vida sin decidir todavía",
    inputMode: "listening",
    orientationDe: "Höre, ob der Condicional einen Wunsch abschwächt, eine Möglichkeit öffnet oder ein vorgestelltes Ergebnis beschreibt.",
    orientationEn: "Listen for whether the conditional softens a wish, opens a possibility, or describes an imagined result.",
    paragraphs: [
      "Sofía está cansada de su rutina. Dice: «Me gustaría vivir cerca del mar. Trabajaría menos y tendría más tiempo para pintar». No anuncia una decisión; imagina cómo sería una vida diferente.",
      "Su amigo responde: «Podrías probar primero un mes allí. Sería una forma tranquila de conocer la ciudad». Sofía acepta que la idea es posible, pero todavía no compra un billete ni promete mudarse."
    ],
    questions: [
      { questionDe: "Hat Sofía bereits entschieden umzuziehen?", questionEn: "Has Sofía already decided to move?", optionsDe: ["Nein, sie stellt sich Möglichkeiten vor", "Ja, der Umzug ist morgen", "Nein, sie will am selben Ort bleiben"], optionsEn: ["No, she is imagining possibilities", "Yes, the move is tomorrow", "No, she wants to stay forever"], correct: 0, explanationDe: "Me gustaría, trabajaría und tendría öffnen einen vorgestellten Raum; sie melden weder einen festen Plan noch ein sicheres Ergebnis.", explanationEn: "Me gustaría, trabajaría, and tendría open an imagined space rather than stating a firm plan or certain result." },
      { questionDe: "Welche Funktion hat podrías probar?", questionEn: "What is the function of podrías probar?", optionsDe: ["Es bietet eine mögliche Handlung an", "Es erteilt einen strengen Befehl", "Es beschreibt eine vergangene Gewohnheit"], optionsEn: ["It offers a possible action", "It gives a strict order", "It describes a past habit"], correct: 0, explanationDe: "Podrías stellt einen Versuch als Option dar und lässt Sofía die Entscheidung, anstatt sie direkt anzuweisen.", explanationEn: "Podrías presents trying as an option and leaves the decision to Sofía rather than directing her." }
    ],
    recallPromptDe: "Beschreibe Sofías Wunsch und zwei vorgestellte Folgen auf Spanisch; ergänze anschließend den vorsichtigen Vorschlag ihres Freundes.",
    recallPromptEn: "Describe Sofía's wish and two imagined consequences in Spanish, then add her friend's cautious suggestion.",
    modelSummary: "A Sofía le gustaría vivir junto al mar, trabajaría menos y tendría más tiempo; su amigo cree que podría probar un mes allí."
  },
  "b1-regular-conditional": {
    title: "Cómo sería nuestra casa compartida",
    orientationDe: "Achte auf den vollständigen Infinitiv und die einheitliche Endungsreihe. Ordne jede Form außerdem der handelnden Person zu.",
    orientationEn: "Notice the complete infinitive and shared ending set, and match each form to its subject.",
    paragraphs: [
      "Cuatro amigos imaginan una casa compartida. Ana trabajaría en una habitación luminosa y Pablo cocinaría para todos. Marta y yo viviríamos en la planta de arriba, mientras que Luis y Elena dormirían cerca del jardín.",
      "Durante la conversación preguntan: «¿Comerías con nosotros cada noche? ¿Compartiríais el coche?». Nadie firma un contrato todavía. Conservan los infinitivos trabajar, cocinar, vivir, dormir, comer y compartir, y cambian únicamente las terminaciones."
    ],
    questions: [
      { questionDe: "Wer würde im oberen Stockwerk wohnen?", questionEn: "Who would live upstairs?", optionsDe: ["Marta und der Sprecher", "Luis und Elena", "Nur Ana"], optionsEn: ["Marta and the speaker", "Luis and Elena", "Ana alone"], correct: 0, explanationDe: "Marta y yo viviríamos enthält die Nosotros-Endung -íamos und nennt beide Personen ausdrücklich als Bewohner des oberen Stockwerks.", explanationEn: "Marta y yo viviríamos uses the nosotros ending -íamos and identifies both people as living upstairs." },
      { questionDe: "Was bleibt bei regelmäßigen Condicionalformen erhalten?", questionEn: "What remains intact in regular conditional forms?", optionsDe: ["Der vollständige Infinitiv", "Nur der Verbstamm ohne Endung", "Die Präsensform der dritten Person"], optionsEn: ["The complete infinitive", "Only the stem without its ending", "The third-person present form"], correct: 0, explanationDe: "Die Endungen werden an hablar, comer oder vivir als vollständige Infinitive angefügt; deshalb bleiben auch -ar, -er und -ir sichtbar.", explanationEn: "The endings attach to complete infinitives such as hablar, comer, and vivir, so -ar, -er, and -ir remain visible." }
    ],
    recallPromptDe: "Sage auf Spanisch mit mindestens vier verschiedenen Personenformen, wie das Zusammenleben der Freunde aussehen würde.",
    recallPromptEn: "In Spanish, use at least four different person forms to say what the friends' shared life would be like.",
    modelSummary: "Ana trabajaría en una habitación luminosa, Pablo cocinaría, Marta y yo viviríamos arriba y los demás dormirían junto al jardín."
  },
  "b1-irregular-conditional": {
    title: "Un viaje posible con algunos obstáculos",
    inputMode: "listening",
    orientationDe: "Höre auf die verkürzten oder veränderten Stämme tendr-, podr-, vendr-, har- und dir-; die Condicionalendungen bleiben regelmäßig.",
    orientationEn: "Listen for tendr-, podr-, vendr-, har-, and dir-; the conditional endings themselves remain regular.",
    paragraphs: [
      "Nora y sus amigos quieren hacer un viaje en tren. Con una semana libre tendrían tiempo para visitar tres ciudades y podrían quedarse dos noches en cada una. Elena vendría también si terminara su proyecto.",
      "Pablo haría las reservas y les diría a todos cuánto cuestan. El plan todavía depende del trabajo y del dinero, pero los verbos irregulares comparten las mismas terminaciones que hablaría o comeríamos; solo cambia el tallo del infinitivo."
    ],
    questions: [
      { questionDe: "Welche Aufgabe würde Pablo übernehmen?", questionEn: "Which task would Pablo take on?", optionsDe: ["Die Reservierungen machen", "Elenas Projekt beenden", "Drei Züge fahren"], optionsEn: ["Make the reservations", "Finish Elena's project", "Drive three trains"], correct: 0, explanationDe: "Pablo haría las reservas nennt seine vorgestellte Aufgabe; anschließend würde er den anderen die Kosten mitteilen.", explanationEn: "Pablo haría las reservas states his imagined task, after which he would tell the others the cost." },
      { questionDe: "Welche Verbindung besteht zwischen Futur und Condicional?", questionEn: "What link exists between future and conditional?", optionsDe: ["Sie teilen dieselben unregelmäßigen Stämme", "Sie haben immer identische Endungen", "Beide verwenden haber als Hilfsverb"], optionsEn: ["They share the same irregular stems", "They always have identical endings", "Both use haber as an auxiliary"], correct: 0, explanationDe: "Tendr-, podr-, vendr-, har- und dir- werden in beiden Zeitformen verwendet; an sie treten hier die regelmäßigen Condicionalendungen.", explanationEn: "Tendr-, podr-, vendr-, har-, and dir- occur in both tenses; here they take regular conditional endings." }
    ],
    recallPromptDe: "Fasse den möglichen Reiseplan auf Spanisch mit mindestens vier unterschiedlichen unregelmäßigen Condicionalstämmen zusammen.",
    recallPromptEn: "Summarize the possible travel plan in Spanish using at least four different irregular conditional stems.",
    modelSummary: "Los amigos tendrían una semana, podrían visitar tres ciudades, Elena vendría, Pablo haría las reservas y les diría el precio."
  },
  "b1-conditional-advice": {
    title: "Consejos para una decisión difícil",
    orientationDe: "Unterscheide zwischen direktem Befehl und abschwächendem Rat. Beobachte, wie mehrere Optionen die Entscheidung bei der anderen Person lassen.",
    orientationEn: "Distinguish a direct order from softened advice and notice how options leave the decision with the listener.",
    paragraphs: [
      "Marcos piensa dejar su trabajo porque está agotado. Su amiga le dice: «Yo que tú, esperaría una semana. Deberías hablar primero con tu responsable y podrías pedir un horario más flexible». No decide por él.",
      "También añade: «Sería mejor revisar tus gastos antes de renunciar». Al final pregunta: «¿Te importaría contarme qué es lo que más te preocupa?». Cada frase abre una opción o invita a hablar sin convertir el consejo en una orden."
    ],
    questions: [
      { questionDe: "Welchen ersten Schritt empfiehlt die Freundin?", questionEn: "Which first step does the friend recommend?", optionsDe: ["Mit dem Vorgesetzten sprechen", "Sofort kündigen", "Die Stadt verlassen"], optionsEn: ["Speak with the manager", "Resign immediately", "Leave the city"], correct: 0, explanationDe: "Deberías hablar primero con tu responsable empfiehlt ein Gespräch vor einer endgültigen Entscheidung und ist kein direkter Befehl.", explanationEn: "Deberías hablar primero con tu responsable recommends a conversation before any final decision and is not a direct order." },
      { questionDe: "Warum verwendet sie ¿Te importaría...?", questionEn: "Why does she use ¿Te importaría...?", optionsDe: ["Sie bittet besonders höflich um Offenheit", "Sie verbietet ihm zu antworten", "Sie berichtet eine sichere Zukunft"], optionsEn: ["She politely asks him to open up", "She forbids him to answer", "She reports a certain future"], correct: 0, explanationDe: "Die Condicionalfrage schwächt die Bitte ab, respektiert Marcos' Entscheidung und lädt ihn zum Erzählen ein.", explanationEn: "The conditional question softens the request, respects Marcos's choice, and invites him to speak." }
    ],
    recallPromptDe: "Gib Marcos auf Spanisch drei unterschiedlich formulierte Ratschläge und stelle danach eine höfliche Frage mit te importaría.",
    recallPromptEn: "Give Marcos three differently framed pieces of advice in Spanish, then ask a polite question with te importaría.",
    modelSummary: "Yo que Marcos, esperaría una semana; debería hablar con su responsable, podría pedir otro horario y sería mejor revisar sus gastos."
  },
  "b1-hypothetical-si": {
    title: "Si el barrio tuviera menos coches",
    inputMode: "listening",
    orientationDe: "Teile jeden Gedanken in unwirkliche oder ferne Bedingung mit Imperfecto de Subjuntivo und vorgestelltes Ergebnis mit Condicional.",
    orientationEn: "Split each idea into a remote condition in the imperfect subjunctive and an imagined result in the conditional.",
    paragraphs: [
      "Los vecinos imaginan una calle diferente. Si hubiera menos coches, los niños jugarían fuera con más seguridad. Si el ayuntamiento plantara árboles, la plaza tendría sombra y más personas pasarían la tarde allí.",
      "Una vecina pregunta: «¿Qué haríamos si cerraran la calle los domingos?». Otro responde que, si fuera posible, organizarían un mercado pequeño. Hablan de un presente alternativo, no de un plan confirmado para la próxima semana."
    ],
    questions: [
      { questionDe: "Welche Folge hätte das Pflanzen von Bäumen?", questionEn: "What would result from planting trees?", optionsDe: ["Der Platz hätte Schatten", "Alle Autos würden verschwinden", "Der Markt wäre abgesagt"], optionsEn: ["The square would have shade", "All cars would disappear", "The market would be canceled"], correct: 0, explanationDe: "Si el ayuntamiento plantara árboles bildet die hypothetische Bedingung; la plaza tendría sombra ist das vorgestellte Ergebnis.", explanationEn: "Si el ayuntamiento plantara árboles is the hypothetical condition; la plaza tendría sombra is the imagined result." },
      { questionDe: "Warum steht nach si nicht das Condicional?", questionEn: "Why is the conditional not used after si?", optionsDe: ["Die ferne Bedingung verwendet Imperfecto de Subjuntivo", "Si erlaubt überhaupt kein Verb", "Das Ergebnis liegt in der Vergangenheit"], optionsEn: ["The remote condition uses the imperfect subjunctive", "Si permits no verb", "The result is in the past"], correct: 0, explanationDe: "Im Muster si + Imperfecto de Subjuntivo + Condicional trägt die si-Klausel die hypothetische Bedingung und der andere Teil das Ergebnis.", explanationEn: "In si + imperfect subjunctive + conditional, the si clause carries the hypothetical condition and the other clause the result." }
    ],
    recallPromptDe: "Entwirf auf Spanisch drei Veränderungen für das Viertel und verbinde jeweils eine hypothetische si-Bedingung mit ihrer möglichen Folge.",
    recallPromptEn: "In Spanish, design three neighborhood changes, linking each hypothetical si condition to its imagined result.",
    modelSummary: "Si hubiera menos coches, los niños jugarían fuera; si plantaran árboles, la plaza tendría sombra, y si cerraran la calle, organizarían un mercado."
  },
  "checkpoint-b1-conditional": {
    title: "Una conversación antes de cambiar de trabajo",
    orientationDe: "Verfolge die gesamte Entscheidung: Wunsch, Möglichkeit, höflicher Rat, hypothetische Bedingung und höfliche Bitte erfüllen verschiedene kommunikative Aufgaben.",
    orientationEn: "Follow the whole decision: wish, possibility, advice, hypothetical condition, and polite request serve different purposes.",
    paragraphs: [
      "Elena le cuenta a su amigo que le gustaría cambiar de trabajo. Podría buscar un puesto más cerca, porque pierde mucho tiempo en el tren. Su amigo responde: «Yo que tú, hablaría primero con la directora». ",
      "Elena admite que, si encontrara una empresa con un horario flexible, aceptaría la oferta. Antes de decidir, pregunta: «¿Te importaría revisar mi currículum?». El amigo acepta, pero le recuerda que una posibilidad imaginada todavía necesita pasos reales."
    ],
    questions: [
      { questionDe: "Unter welcher Bedingung würde Elena ein Angebot annehmen?", questionEn: "Under what condition would Elena accept an offer?", optionsDe: ["Wenn sie flexible Arbeitszeiten fände", "Wenn der Zug später käme", "Wenn sie keinen Lebenslauf hätte"], optionsEn: ["If she found flexible hours", "If the train arrived later", "If she had no résumé"], correct: 0, explanationDe: "Si encontrara una empresa con un horario flexible nennt die hypothetische Bedingung; aceptaría ist das vorgestellte Ergebnis.", explanationEn: "Si encontrara una empresa con un horario flexible gives the hypothetical condition; aceptaría is the imagined result." },
      { questionDe: "Worum bittet Elena besonders höflich?", questionEn: "What does Elena ask for especially politely?", optionsDe: ["Um eine Prüfung ihres Lebenslaufs", "Um eine sofortige Kündigung", "Um eine Zugfahrkarte"], optionsEn: ["A review of her résumé", "An immediate resignation", "A train ticket"], correct: 0, explanationDe: "¿Te importaría revisar mi currículum? verwendet den Condicional, um die Bitte respektvoll und nicht fordernd zu formulieren.", explanationEn: "¿Te importaría revisar mi currículum? uses the conditional to make the request respectful rather than demanding." }
    ],
    recallPromptDe: "Fasse Elenas Gespräch auf Spanisch zusammen: Wunsch, mögliche Alternative, Rat, hypothetische Entscheidung und höfliche Bitte sollen erkennbar sein.",
    recallPromptEn: "Summarize Elena's conversation in Spanish, including the wish, possibility, advice, hypothetical decision, and polite request.",
    modelSummary: "A Elena le gustaría cambiar de trabajo; podría buscar algo más cerca y, si encontrara un horario flexible, aceptaría la oferta. Su amigo hablaría primero con la directora."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const existing = await prisma.lesson.findMany({
    where: { slug: { in: entries.map(([slug]) => slug) } },
    select: { slug: true }
  });
  if (existing.length !== entries.length) {
    throw new Error(`B1 perfect/conditional input requires ${entries.length} lessons, found ${existing.length}.`);
  }
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({
      where: { slug },
      data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 20 : 16 }
    });
  }
  console.log(`Seeded connected input for ${entries.length} B1 perfect and conditional packages.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
