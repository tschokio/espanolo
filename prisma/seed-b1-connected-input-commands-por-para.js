const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "b1-affirmative-tu-commands": {
    title: "La receta que Pablo aprende por teléfono",
    inputMode: "listening",
    orientationDe: "Höre die Anweisungen als geordnete Handlungskette. Die Imperative führen eine vertraute Person Schritt für Schritt zum Ergebnis.",
    orientationEn: "Listen to the instructions as an ordered action chain guiding a familiar person step by step.",
    paragraphs: [
      "Pablo llama a su hermana porque quiere preparar una salsa. Ella le explica: «Primero corta dos tomates y abre la botella de aceite. Después mezcla todo en un cuenco y añade un poco de sal». Pablo repite cada paso.",
      "Su hermana continúa: «Prueba la salsa, espera un minuto y sirve la comida». Son instrucciones directas entre personas cercanas, pero por favor y un tono amable evitan que parezcan agresivas. Primero y después mantienen clara la secuencia."
    ],
    questions: [
      { questionDe: "Was soll Pablo unmittelbar nach dem Öffnen des Öls tun?", questionEn: "What should Pablo do immediately after opening the oil?", optionsDe: ["Alles in einer Schüssel mischen", "Das Essen servieren", "Seine Schwester anrufen"], optionsEn: ["Mix everything in a bowl", "Serve the food", "Call his sister"], correct: 0, explanationDe: "Después mezcla todo en un cuenco folgt auf corta und abre; der Sequenzmarker verbindet die Befehle zu einer klaren Anleitung.", explanationEn: "Después mezcla todo en un cuenco follows corta and abre; the sequence marker creates a clear procedure." },
      { questionDe: "Wie entsteht der regelmäßige bejahte tú-Imperativ hier?", questionEn: "How is the regular affirmative tú command formed here?", optionsDe: ["Wie die dritte Person Singular im Präsens", "Mit no und Subjuntivo", "Aus dem Infinitiv plus -ía"], optionsEn: ["Like third-person singular present", "With no and the subjunctive", "From the infinitive plus -ía"], correct: 0, explanationDe: "Corta, abre, mezcla, añade, prueba, espera und sirve entsprechen den Formen der dritten Person Singular im Präsens.", explanationEn: "Corta, abre, mezcla, añade, prueba, espera, and sirve match third-person singular present forms." }
    ],
    recallPromptDe: "Erkläre Pablo das Rezept auf Spanisch mit mindestens fünf bejahten tú-Imperativen und passenden Wörtern für die Reihenfolge.",
    recallPromptEn: "Explain the recipe to Pablo in Spanish using at least five affirmative tú commands and suitable sequence words.",
    modelSummary: "Primero corta los tomates y abre el aceite; después mezcla todo, añade sal, prueba la salsa, espera un minuto y sirve la comida."
  },
  "b1-irregular-tu-commands": {
    title: "Cinco instrucciones antes de salir de viaje",
    orientationDe: "Speichere ven, haz, di, pon, ten und sal als häufige vollständige Handlungsbausteine und verbinde sie mit der konkreten Situation.",
    orientationEn: "Store ven, haz, di, pon, ten, and sal as frequent action chunks connected to the situation.",
    paragraphs: [
      "Marta ayuda a Luis antes de un viaje urgente. Le dice: «Ven aquí y haz la reserva ahora. Pon el pasaporte en la mochila y di a Clara a qué hora llegas». Luis busca sus cosas mientras escucha.",
      "Antes de cerrar la puerta, Marta añade: «Ten cuidado con el equipaje y sal con tiempo, porque hay tráfico». Las formas no siguen el patrón regular, pero cada una aparece en una necesidad cotidiana que permite recuperarla como unidad."
    ],
    questions: [
      { questionDe: "Wohin soll Luis den Pass legen?", questionEn: "Where should Luis put the passport?", optionsDe: ["In den Rucksack", "Auf den Küchentisch", "In Claras Auto"], optionsEn: ["In the backpack", "On the kitchen table", "In Clara's car"], correct: 0, explanationDe: "Pon el pasaporte en la mochila verbindet den unregelmäßigen Imperativ pon mit einer eindeutig sichtbaren Handlung.", explanationEn: "Pon el pasaporte en la mochila connects the irregular command pon with a clear physical action." },
      { questionDe: "Welche Formen gehören zu venir, hacer und salir?", questionEn: "Which forms belong to venir, hacer, and salir?", optionsDe: ["Ven, haz und sal", "Viene, hace und sale", "Vengas, hagas und salgas"], optionsEn: ["Ven, haz, and sal", "Viene, hace, and sale", "Vengas, hagas, and salgas"], correct: 0, explanationDe: "Ven, haz und sal sind gebräuchliche unregelmäßige bejahte tú-Imperative und werden am zuverlässigsten als feste Formen abgerufen.", explanationEn: "Ven, haz, and sal are common irregular affirmative tú commands best retrieved as fixed forms." }
    ],
    recallPromptDe: "Gib Luis auf Spanisch mindestens fünf der Reiseanweisungen wieder und verwende dabei verschiedene unregelmäßige tú-Imperative.",
    recallPromptEn: "Restate at least five travel instructions to Luis in Spanish using different irregular tú commands.",
    modelSummary: "Ven aquí, haz la reserva, pon el pasaporte en la mochila, di a Clara la hora, ten cuidado y sal con tiempo."
  },
  "b1-negative-commands": {
    title: "Normas para una excursión segura",
    inputMode: "listening",
    orientationDe: "Höre zuerst das stoppende no und danach die Form des Presente de Subjuntivo. Achte besonders auf Schreibänderungen und unregelmäßige Formen.",
    orientationEn: "First hear the stopping no, then the present subjunctive form, especially spelling changes and irregular forms.",
    paragraphs: [
      "Antes de una excursión, la guía recuerda varias normas: «No llegues tarde, no olvides el agua y no vayas solo por el bosque. Si ves un animal, no hagas movimientos rápidos y no intentes tocarlo». ",
      "También dice: «No cruces el río cuando llueva y no dejes basura». Las prohibiciones no describen acciones futuras seguras; intentan impedirlas. Por eso usan no seguido de formas como llegues, vayas, hagas, cruces y dejes."
    ],
    questions: [
      { questionDe: "Was sollen die Teilnehmer bei einem Tier vermeiden?", questionEn: "What should participants avoid when they see an animal?", optionsDe: ["Schnelle Bewegungen und Berühren", "Ruhig stehen bleiben", "Die Reiseleitung informieren"], optionsEn: ["Quick movements and touching it", "Standing calmly", "Informing the guide"], correct: 0, explanationDe: "No hagas movimientos rápidos und no intentes tocarlo nennen zwei Handlungen, welche die Gruppe ausdrücklich unterlassen soll.", explanationEn: "No hagas movimientos rápidos and no intentes tocarlo name two actions the group must avoid." },
      { questionDe: "Warum heißt es no llegues statt no llega?", questionEn: "Why is it no llegues rather than no llega?", optionsDe: ["Negative tú-Befehle verwenden den Subjuntivo", "Llegar ist ein Partizip", "No verlangt immer Futur"], optionsEn: ["Negative tú commands use the subjunctive", "Llegar is a participle", "No always requires the future"], correct: 0, explanationDe: "Der negative tú-Imperativ wird mit dem Presente de Subjuntivo gebildet; gu erhält dabei den harten g-Laut von llegar.", explanationEn: "The negative tú command uses the present subjunctive; gu preserves the hard g sound from llegar." }
    ],
    recallPromptDe: "Formuliere auf Spanisch mindestens fünf Sicherheitsregeln aus dem Text als negative tú-Befehle, darunter eine unregelmäßige Form.",
    recallPromptEn: "State at least five safety rules from the text in Spanish as negative tú commands, including an irregular form.",
    modelSummary: "No llegues tarde, no vayas solo, no hagas movimientos rápidos, no cruces el río cuando llueva y no dejes basura."
  },
  "b1-pronouns-with-commands": {
    title: "El paquete que debe salir esta tarde",
    orientationDe: "Entscheide zuerst bejaht oder verneint. Danach erkennst du die Position: angehängt beim bejahten, vorangestellt beim verneinten Imperativ.",
    orientationEn: "First decide affirmative or negative; then place pronouns attached after affirmative commands and before negative ones.",
    paragraphs: [
      "Nora prepara un paquete y deja instrucciones a su compañero: «Ciérralo bien y mándamelo antes de las cuatro. Llámame cuando llegue el mensajero». Los pronombres se unen a los mandatos afirmativos y los acentos conservan la pronunciación.",
      "Después corrige un detalle: «No lo envíes todavía y no me llames durante la reunión. Espera mi mensaje y, cuando lo recibas, dáselo al mensajero». Con no, los pronombres cambian de posición y aparecen delante del verbo."
    ],
    questions: [
      { questionDe: "Wann darf das Paket übergeben werden?", questionEn: "When may the package be handed over?", optionsDe: ["Nach Noras Nachricht", "Sofort ohne Rückfrage", "Erst am nächsten Morgen"], optionsEn: ["After Nora's message", "Immediately without checking", "The next morning"], correct: 0, explanationDe: "Cuando lo recibas, dáselo al mensajero macht Noras Nachricht zum Signal für die spätere Übergabe.", explanationEn: "Cuando lo recibas, dáselo al mensajero makes Nora's message the signal for the handover." },
      { questionDe: "Warum steht lo in no lo envíes vor dem Verb?", questionEn: "Why does lo precede the verb in no lo envíes?", optionsDe: ["Bei negativen Befehlen stehen Pronomen davor", "Lo bezeichnet immer eine Person", "Enviar ist ein Infinitiv"], optionsEn: ["Pronouns precede negative commands", "Lo always refers to a person", "Enviar is an infinitive"], correct: 0, explanationDe: "Negativer Imperativ und Pronomen bilden no + lo + envíes; beim bejahten envíalo würde lo dagegen angehängt.", explanationEn: "The negative command follows no + lo + envíes; in affirmative envíalo, lo would be attached." }
    ],
    recallPromptDe: "Gib Noras Anweisungen auf Spanisch wieder und verwende mindestens zwei bejahte sowie zwei verneinte Befehle mit Pronomen.",
    recallPromptEn: "Restate Nora's instructions in Spanish using at least two affirmative and two negative commands with pronouns.",
    modelSummary: "Ciérralo y mándamelo, pero no lo envíes todavía ni me llames durante la reunión; después dáselo al mensajero."
  },
  "b1-double-object-pronouns": {
    title: "Fotos y documentos para toda la familia",
    inputMode: "listening",
    orientationDe: "Bestimme erst Empfänger und Sache. Setze dann das Empfängerpronomen vor das Sachpronomen und ersetze le oder les vor lo/la/los/las durch se.",
    orientationEn: "Identify recipient and thing, place the recipient pronoun first, and change le or les to se before lo/la/los/las.",
    paragraphs: [
      "Después de una fiesta, Clara organiza los recuerdos. Dice: «Doy el álbum a mi abuela; se lo llevo mañana. Envío las fotos a mis padres; se las mando esta noche». Los nombres completos muestran quién recibe cada cosa.",
      "Su hermano pregunta por un documento y Clara responde: «Puedo explicártelo ahora». Aquí te representa al hermano y lo representa el documento. Se no significa automáticamente reflexivo: en se lo y se las sustituye a le o les delante del pronombre directo."
    ],
    questions: [
      { questionDe: "Wofür stehen se und las in se las mando?", questionEn: "What do se and las represent in se las mando?", optionsDe: ["Se für die Eltern, las für die Fotos", "Se für Clara, las für die Großmutter", "Beide für das Album"], optionsEn: ["Se for the parents, las for the photos", "Se for Clara, las for the grandmother", "Both for the album"], correct: 0, explanationDe: "Les für mis padres wird vor las zu se; las ersetzt das feminine Pluralobjekt las fotos.", explanationEn: "Les for mis padres changes to se before las; las replaces the feminine plural object las fotos." },
      { questionDe: "Warum sagt Clara nicht le lo llevo?", questionEn: "Why does Clara not say le lo llevo?", optionsDe: ["Le wird vor lo zu se", "Lo darf nie mit Personen stehen", "Llevar benötigt kein Objekt"], optionsEn: ["Le changes to se before lo", "Lo can never occur with people", "Llevar takes no object"], correct: 0, explanationDe: "Die feste Kombination vermeidet le lo: Das Empfängerpronomen le wird zu se, während lo weiterhin das Album bezeichnet.", explanationEn: "The fixed combination avoids le lo: recipient le becomes se while lo continues to represent the album." }
    ],
    recallPromptDe: "Erkläre auf Spanisch mit vollständigen Nomen und danach mit Doppelpronomen, wem Clara Album, Fotos und Dokument übermittelt.",
    recallPromptEn: "In Spanish, first use full nouns and then double pronouns to explain to whom Clara gives the album, photos, and document.",
    modelSummary: "Clara lleva el álbum a su abuela y se lo lleva; envía las fotos a sus padres y se las manda; a su hermano puede explicárselo."
  },
  "checkpoint-b1-commands-pronouns": {
    title: "Instrucciones para enviar un documento urgente",
    orientationDe: "Führe die Entscheidung vollständig aus: bejaht oder verneint, regelmäßig oder unregelmäßig, Pronomenposition und nötiger Akzent.",
    orientationEn: "Complete the whole decision: affirmative or negative, regular or irregular, pronoun position, and necessary accent.",
    paragraphs: [
      "La directora explica a Pablo cómo enviar un documento: «Abre la aplicación, escribe tu nombre y busca el archivo. No cierres la página todavía. Cuando lo encuentres, mándamelo para que pueda revisarlo». ",
      "Después añade: «Si Marta pregunta, no se lo envíes aún. Dile que espere y dímelo cuando termine la reunión». Pablo debe distinguir una secuencia normal, una prohibición y varias referencias a información ya conocida."
    ],
    questions: [
      { questionDe: "Warum darf Pablo das Dokument noch nicht an Marta senden?", questionEn: "Why must Pablo not send the document to Marta yet?", optionsDe: ["Die Direktorin will es zuerst prüfen", "Marta hat keine E-Mail-Adresse", "Die Datei ist bereits gelöscht"], optionsEn: ["The director wants to review it first", "Marta has no email address", "The file has been deleted"], correct: 0, explanationDe: "Mándamelo para que pueda revisarlo kommt vor no se lo envíes; die Direktorin ist damit zunächst die vorgesehene Empfängerin.", explanationEn: "Mándamelo para que pueda revisarlo precedes no se lo envíes; the director must receive it first." },
      { questionDe: "Welche Form verbindet einen unregelmäßigen Befehl mit zwei Pronomen?", questionEn: "Which form combines an irregular command with two pronouns?", optionsDe: ["Dímelo", "No cierres", "Escribe"], optionsEn: ["Dímelo", "No cierres", "Escribe"], correct: 0, explanationDe: "Di ist der unregelmäßige Imperativ von decir; me und lo werden angehängt, und der Akzent in dímelo bewahrt die Betonung.", explanationEn: "Di is the irregular command of decir; me and lo attach, and the accent in dímelo preserves stress." }
    ],
    recallPromptDe: "Gib den vollständigen Arbeitsablauf auf Spanisch wieder und verwende regelmäßige, negative und unregelmäßige Befehle sowie einfache und doppelte Pronomen.",
    recallPromptEn: "Restate the full workflow in Spanish using regular, negative, and irregular commands with single and double pronouns.",
    modelSummary: "Abre la aplicación y busca el archivo; no cierres la página, mándamelo primero, no se lo envíes a Marta y dímelo al terminar."
  },
  "b1-para-goal-purpose": {
    title: "Un viaje a Valencia con un propósito claro",
    inputMode: "listening",
    orientationDe: "Höre para als Pfeil nach vorn: zu einem Zielort, einem Zweck oder einer vorgesehenen Verwendung.",
    orientationEn: "Hear para as a forward arrow toward a destination, purpose, or intended use.",
    paragraphs: [
      "Lucía sale para Valencia el lunes. Viaja para asistir a un curso de cocina y lleva un cuaderno para apuntar las recetas. También ahorra dinero para comprar buenos ingredientes durante su estancia.",
      "En el apartamento pide una mesa para trabajar y pregunta qué autobús va para el centro. En cada caso, para señala algo hacia lo que se dirige una acción: una ciudad, una finalidad, una compra futura o el uso previsto de un objeto."
    ],
    questions: [
      { questionDe: "Zu welchem Zweck nimmt Lucía ein Heft mit?", questionEn: "For what purpose does Lucía take a notebook?", optionsDe: ["Um Rezepte aufzuschreiben", "Um das Busticket zu bezahlen", "Um es zu verschenken"], optionsEn: ["To write down recipes", "To pay for the bus ticket", "To give it away"], correct: 0, explanationDe: "Un cuaderno para apuntar las recetas nennt die vorgesehene Verwendung des Hefts und blickt auf das spätere Aufschreiben.", explanationEn: "Un cuaderno para apuntar las recetas states the notebook's intended use and points toward the later action." },
      { questionDe: "Welche Beziehung drückt para Valencia aus?", questionEn: "What relationship does para Valencia express?", optionsDe: ["Zielrichtung", "Ursache", "Austauschpreis"], optionsEn: ["Destination", "Cause", "Exchange value"], correct: 0, explanationDe: "Salir para Valencia richtet die Bewegung auf den Zielort Valencia; es erklärt weder die Ursache noch den Weg dorthin.", explanationEn: "Salir para Valencia directs movement toward Valencia as destination; it gives neither cause nor route." }
    ],
    recallPromptDe: "Fasse Lucías Reise auf Spanisch zusammen und verwende para für Zielort, Zweck, zukünftiges Ziel und vorgesehene Verwendung.",
    recallPromptEn: "Summarize Lucía's trip in Spanish using para for destination, purpose, future goal, and intended use.",
    modelSummary: "Lucía sale para Valencia para asistir a un curso, lleva un cuaderno para apuntar recetas y ahorra para comprar ingredientes."
  },
  "b1-para-recipient-deadline": {
    title: "Preparativos para el viernes en la oficina",
    orientationDe: "Ordne para jeweils einem Zielpunkt zu: vorgesehener Empfänger, Termin, Perspektive, betroffene Gruppe oder Organisation.",
    orientationEn: "Match para with a target: intended recipient, deadline, viewpoint, affected group, or organization.",
    paragraphs: [
      "El equipo prepara una presentación para el viernes. Marta escribe un informe para la directora y compra un pequeño regalo para una compañera nueva. Todos trabajan para una empresa que abrirá otra oficina.",
      "Durante la reunión, Pablo dice: «Para mí, la primera propuesta es mejor, pero el gráfico es difícil para los principiantes». Para no significa exactamente lo mismo en todas las frases; conserva la idea común de un destinatario o punto de referencia."
    ],
    questions: [
      { questionDe: "Bis wann muss die Präsentation fertig sein?", questionEn: "By when must the presentation be ready?", optionsDe: ["Bis Freitag", "Seit Freitag", "Für zwei Wochen"], optionsEn: ["By Friday", "Since Friday", "For two weeks"], correct: 0, explanationDe: "Para el viernes setzt Freitag als Zieltermin, bis zu dem die Präsentation vorbereitet sein soll.", explanationEn: "Para el viernes sets Friday as the target deadline by which the presentation should be ready." },
      { questionDe: "Was führt para mí ein?", questionEn: "What does para mí introduce?", optionsDe: ["Pablos persönliche Perspektive", "Den Preis der Grafik", "Die Ursache des Treffens"], optionsEn: ["Pablo's personal viewpoint", "The price of the chart", "The cause of the meeting"], correct: 0, explanationDe: "Para mí rahmt die anschließende Bewertung als Pablos Standpunkt und nicht als allgemein bewiesene Tatsache.", explanationEn: "Para mí frames the following evaluation as Pablo's viewpoint rather than a universally proven fact." }
    ],
    recallPromptDe: "Beschreibe auf Spanisch die Vorbereitungen und verwende para für Termin, zwei Empfänger, Arbeitgeber und persönliche Perspektive.",
    recallPromptEn: "Describe the preparations in Spanish using para for a deadline, two recipients, an employer, and a viewpoint.",
    modelSummary: "El equipo prepara todo para el viernes; Marta escribe para la directora, compra un regalo para una compañera y, para Pablo, la primera propuesta es mejor."
  },
  "b1-por-cause-exchange": {
    title: "Una compra que salió bien gracias a un vecino",
    inputMode: "listening",
    orientationDe: "Höre por als Blick zurück auf Ursache, Anlass oder Gegenleistung. Frage jeweils: Was erklärt oder bezahlt die Handlung?",
    orientationEn: "Hear por as looking back to a cause, motive, or exchange. Ask what explains or pays for the action.",
    paragraphs: [
      "Clara no pudo ir al mercado por la lluvia, así que su vecino fue por ella. Compró una lámpara por treinta euros y cambió una bombilla defectuosa por otra nueva. Después llevó todo a casa de Clara.",
      "Clara le dijo: «Gracias por tu ayuda. Lo has hecho por mí y te invito a cenar». La lluvia explica por qué no salió; el dinero se intercambia por la lámpara; la ayuda es el motivo del agradecimiento."
    ],
    questions: [
      { questionDe: "Warum ging Clara nicht selbst zum Markt?", questionEn: "Why did Clara not go to the market herself?", optionsDe: ["Wegen des Regens", "Wegen des Lampenpreises", "Wegen des Abendessens"], optionsEn: ["Because of the rain", "Because of the lamp's price", "Because of dinner"], correct: 0, explanationDe: "Por la lluvia führt die Ursache ein, welche Claras Nichtgehen erklärt; diese Beziehung blickt auf den Grund zurück.", explanationEn: "Por la lluvia introduces the cause explaining why Clara did not go, looking back to the reason." },
      { questionDe: "Welche Beziehung besteht in por treinta euros?", questionEn: "What relationship appears in por treinta euros?", optionsDe: ["Austauschwert", "Zielort", "Abgabetermin"], optionsEn: ["Exchange value", "Destination", "Deadline"], correct: 0, explanationDe: "Dreißig Euro werden gegen die Lampe gegeben. Por markiert somit die Gegenleistung innerhalb eines Austauschs.", explanationEn: "Thirty euros are given in exchange for the lamp, so por marks the value exchanged." }
    ],
    recallPromptDe: "Erzähle auf Spanisch, was wegen des Regens geschah, welche zwei Austausche stattfanden und wofür Clara ihrem Nachbarn dankt.",
    recallPromptEn: "In Spanish, explain what happened because of the rain, which two exchanges occurred, and what Clara thanks her neighbor for.",
    modelSummary: "Por la lluvia, el vecino fue por Clara, pagó treinta euros por una lámpara, cambió una bombilla por otra y Clara le dio las gracias por su ayuda."
  },
  "b1-por-route-duration": {
    title: "Dos días de trabajo por toda la ciudad",
    orientationDe: "Erkenne por als Weg oder Kanal: durch welchen Raum, wie lange ungefähr, mit welchem Mittel oder wie oft pro Zeitraum?",
    orientationEn: "Recognize por as route or channel: through what space, for roughly how long, by what means, or at what rate?",
    paragraphs: [
      "Durante una campaña, Elena camina por varios barrios y trabaja por dos horas cada mañana en una biblioteca. Habla con el equipo por teléfono y envía los informes por correo electrónico al final del día.",
      "Va al centro tres veces por semana y normalmente pasa por el parque. En estas expresiones, por no apunta a una meta futura: presenta el espacio recorrido, una duración aproximada, el medio de comunicación o una frecuencia."
    ],
    questions: [
      { questionDe: "Über welchen Kanal verschickt Elena die Berichte?", questionEn: "Through which channel does Elena send the reports?", optionsDe: ["Per E-Mail", "Durch den Park", "Dreimal pro Woche"], optionsEn: ["By email", "Through the park", "Three times per week"], correct: 0, explanationDe: "Por correo electrónico bezeichnet das Mittel oder den Kanal, durch den die Berichte ihre Empfänger erreichen.", explanationEn: "Por correo electrónico identifies the means or channel through which the reports reach their recipients." },
      { questionDe: "Welche Bedeutung hat por in tres veces por semana?", questionEn: "What does por mean in tres veces por semana?", optionsDe: ["Häufigkeit pro Zeitraum", "Ungefähre Wegstrecke", "Grund der Arbeit"], optionsEn: ["Frequency per time period", "Approximate route", "Reason for working"], correct: 0, explanationDe: "Por semana setzt die Woche als Bezugsgröße einer Rate: Das Ereignis findet innerhalb jeder Woche dreimal statt.", explanationEn: "Por semana makes the week the unit of a rate: the event occurs three times within each week." }
    ],
    recallPromptDe: "Beschreibe Elenas Arbeit auf Spanisch und verwende por für Route, ungefähre Dauer, Kommunikationsmittel und Häufigkeit.",
    recallPromptEn: "Describe Elena's work in Spanish using por for route, approximate duration, communication means, and frequency.",
    modelSummary: "Elena camina por los barrios, trabaja por dos horas, habla por teléfono, informa por correo y va al centro tres veces por semana."
  },
  "b1-por-para-contrast": {
    title: "El autobús que pasa por el centro",
    inputMode: "listening",
    orientationDe: "Stelle zwei mentale Pfeile gegenüber: por blickt auf Grund, Weg oder Austausch; para richtet sich auf Ziel, Empfänger oder Zweck.",
    orientationEn: "Contrast two mental arrows: por looks to cause, route, or exchange; para points to goal, recipient, or purpose.",
    paragraphs: [
      "Nora viaja para el aeropuerto porque sale para Lisboa. El autobús pasa por el centro y ella aprovecha el trayecto para comprar flores para Marta. Paga doce euros por ellas en una tienda pequeña.",
      "Antes de bajar, llama a Marta por teléfono y le dice: «Gracias por reservar el hotel para nosotros». En pocas frases, por y para aparecen juntos, pero cada elección nace de la relación entre las ideas y no de una traducción fija."
    ],
    questions: [
      { questionDe: "Warum heißt es por el centro, aber para el aeropuerto?", questionEn: "Why is it por el centro but para el aeropuerto?", optionsDe: ["Das Zentrum ist Weg, der Flughafen Ziel", "Beides sind Preise", "Das Zentrum ist Empfänger"], optionsEn: ["Downtown is route, the airport is destination", "Both are prices", "Downtown is the recipient"], correct: 0, explanationDe: "Der Bus durchquert das Zentrum als Route, richtet seine Bewegung jedoch auf den Flughafen als Zielpunkt.", explanationEn: "The bus passes through downtown as its route while directing its movement toward the airport as destination." },
      { questionDe: "Wofür stehen para Marta und por doce euros?", questionEn: "What do para Marta and por doce euros represent?", optionsDe: ["Empfängerin und Austauschwert", "Ursache und Termin", "Route und Arbeitgeber"], optionsEn: ["Recipient and exchange value", "Cause and deadline", "Route and employer"], correct: 0, explanationDe: "Marta ist die vorgesehene Empfängerin der Blumen; zwölf Euro sind die dafür gegebene Gegenleistung.", explanationEn: "Marta is the intended recipient of the flowers; twelve euros are the value exchanged for them." }
    ],
    recallPromptDe: "Erzähle Noras Weg auf Spanisch nach und erkläre durch den Satzkontext mindestens drei Verwendungen von por und drei von para.",
    recallPromptEn: "Retell Nora's journey in Spanish, showing through context at least three uses each of por and para.",
    modelSummary: "Nora va para el aeropuerto, pasa por el centro, compra flores para Marta por doce euros y agradece por teléfono la reserva para el viaje."
  },
  "checkpoint-b1-por-para": {
    title: "Un viaje de trabajo con muchas relaciones",
    orientationDe: "Benenne vor jeder Wahl die Beziehung: Ziel, Zweck, Empfänger und Termin verlangen para; Grund, Route, Mittel und Gegenleistung verlangen por.",
    orientationEn: "Name the relationship before choosing: destination, purpose, recipient, and deadline use para; cause, route, means, and exchange use por.",
    paragraphs: [
      "Diego viaja para Barcelona por trabajo y necesita llegar para las ocho. Va por la carretera del norte porque la ruta habitual está cerrada. Durante el trayecto llama por teléfono a su compañera para confirmar la reunión.",
      "Ha comprado un regalo para ella por veinte euros y lleva documentos para los clientes. Al llegar dice: «Gracias por organizarlo todo». Destino, razón, plazo, ruta, medio, propósito, destinatario e intercambio forman una sola situación práctica."
    ],
    questions: [
      { questionDe: "Welche vier Beziehungen erscheinen im ersten Satzabschnitt?", questionEn: "Which four relationships appear in the first part?", optionsDe: ["Ziel, Grund, Termin und Route", "Preis, Empfänger, Meinung und Dauer", "Arbeitgeber, Austausch, Rate und Dank"], optionsEn: ["Destination, cause, deadline, and route", "Price, recipient, viewpoint, and duration", "Employer, exchange, rate, and thanks"], correct: 0, explanationDe: "Para Barcelona markiert das Ziel, por trabajo den Grund, para las ocho den Termin und por la carretera den Weg.", explanationEn: "Para Barcelona marks destination, por trabajo cause, para las ocho deadline, and por la carretera route." },
      { questionDe: "Warum stehen beim Geschenk beide Präpositionen?", questionEn: "Why do both prepositions appear with the gift?", optionsDe: ["Para nennt die Empfängerin, por den Preis", "Para nennt die Ursache, por das Ziel", "Beide bedeuten exakt dasselbe"], optionsEn: ["Para names the recipient, por the price", "Para names the cause, por the destination", "Both mean exactly the same"], correct: 0, explanationDe: "Para ella richtet das Geschenk auf die Empfängerin; por veinte euros nennt den Austauschwert des Kaufs.", explanationEn: "Para ella directs the gift toward its recipient; por veinte euros states the purchase's exchange value." }
    ],
    recallPromptDe: "Fasse Diegos Reise auf Spanisch zusammen und verwende por und para jeweils mindestens viermal mit klar unterschiedlichen Bedeutungsbeziehungen.",
    recallPromptEn: "Summarize Diego's trip in Spanish using por and para at least four times each for clearly different relationships.",
    modelSummary: "Diego viaja para Barcelona por trabajo, llega para las ocho por la carretera norte, llama por teléfono para confirmar y lleva un regalo para su compañera por veinte euros."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const existing = await prisma.lesson.findMany({
    where: { slug: { in: entries.map(([slug]) => slug) } },
    select: { slug: true }
  });
  if (existing.length !== entries.length) {
    throw new Error(`B1 commands/por-para input requires ${entries.length} lessons, found ${existing.length}.`);
  }
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({
      where: { slug },
      data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 20 : 16 }
    });
  }
  console.log(`Seeded connected input for ${entries.length} B1 commands and por/para packages.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
