const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "b2-imperfect-subjunctive-forms": {
    title: "La forma escondida dentro del pretérito",
    inputMode: "listening",
    orientationDe: "Leite jede Form aus der dritten Person Plural des Pretérito ab: Entferne -ron und setze die -ra-Endung an. So bleiben auch unregelmäßige Vergangenheitsstämme erhalten.",
    orientationEn: "Derive every form from the third-person plural preterite: remove -ron and add the -ra ending. This preserves irregular past stems too.",
    paragraphs: [
      "En clase, la profesora escribe hablaron, comieron y vivieron. Quita -ron y obtiene habla-, comie- y vivie-; después forma hablara, comiera y viviera. El procedimiento es el mismo para las tres conjugaciones.",
      "Luego prueba con tuvieron y dijeron. No vuelve a los infinitivos tener y decir: conserva tuvie- y dije- para formar tuviera y dijera. Al partir de una forma que ya existe, los cambios irregulares dejan de ser una segunda lista independiente."
    ],
    questions: [
      { questionDe: "Aus welcher Form wird tuviera zuverlässig abgeleitet?", questionEn: "From which form is tuviera reliably derived?", optionsDe: ["Tuvieron ohne -ron", "Tener ohne -er", "Tiene plus -ra"], optionsEn: ["Tuvieron without -ron", "Tener without -er", "Tiene plus -ra"], correct: 0, explanationDe: "Tuvieron liefert den unregelmäßigen Vergangenheitsstamm tuvie-. Nach dem Entfernen von -ron wird daran die passende -ra-Endung gesetzt.", explanationEn: "Tuvieron supplies the irregular past stem tuvie-. After removing -ron, the appropriate -ra ending is attached." },
      { questionDe: "Warum entsteht dijera und nicht decirra?", questionEn: "Why does dijera form rather than decirra?", optionsDe: ["Die Ableitung bewahrt den Stamm aus dijeron", "Decir verliert im Subjuntivo jedes j", "Die Form kommt vom Futur"], optionsEn: ["The derivation preserves the stem from dijeron", "Decir loses every j in the subjunctive", "The form comes from the future"], correct: 0, explanationDe: "Dijeron enthält bereits dije-. Dieser Stamm bleibt nach dem Entfernen von -ron erhalten; der Infinitivstamm wird nicht wiederhergestellt.", explanationEn: "Dijeron already contains dije-. That stem remains after removing -ron; the infinitive stem is not restored." }
    ],
    recallPromptDe: "Erkläre auf Spanisch den Ableitungsweg für hablaran, comieras, viviéramos, tuviera und dijeran jeweils von der passenden Pretéritoform aus.",
    recallPromptEn: "Explain in Spanish how to derive hablaran, comieras, viviéramos, tuviera, and dijeran from the corresponding preterite forms.",
    modelSummary: "Para formar el imperfecto de subjuntivo, se toma hablaron, comieron, vivieron, tuvieron o dijeron, se quita -ron y se añaden las terminaciones de -ra."
  },
  "b2-past-wishes-influence": {
    title: "Todo lo que esperaban antes del encuentro",
    orientationDe: "Markiere den vergangenen Wunsch- oder Einflussrahmen und die handelnde Person der Folghandlung. Unterschiedliche Subjekte verbinden sich über que mit dem Imperfecto de Subjuntivo.",
    orientationEn: "Mark the past wish or influence frame and the actor of the following action. Different subjects connect through que with the imperfect subjunctive.",
    paragraphs: [
      "Antes de una reunión familiar, Clara quería que su hermano viniera temprano. Su madre le pidió que esperara fuera mientras preparaban una sorpresa y prefería que los niños durmieran en la habitación del fondo.",
      "El padre insistió en que todos terminaran los preparativos ese día. Además, no permitieron que los invitados entraran antes de las ocho. Quería, pidió, prefería, insistió y no permitieron sitúan la influencia en el pasado; cada acción esperada pertenece a otra persona."
    ],
    questions: [
      { questionDe: "Welche Handlung wollte die Mutter von Clara?", questionEn: "Which action did the mother want Clara to perform?", optionsDe: ["Draußen warten", "Die Überraschung verraten", "Vor acht Uhr eintreten"], optionsEn: ["Wait outside", "Reveal the surprise", "Enter before eight"], correct: 0, explanationDe: "Le pidió que esperara fuera verbindet die vergangene Bitte der Mutter mit Claras gewünschter Handlung im Imperfecto de Subjuntivo.", explanationEn: "Le pidió que esperara fuera links the mother's past request to Clara's desired action in the imperfect subjunctive." },
      { questionDe: "Warum steht entraran nach no permitieron que?", questionEn: "Why is entraran used after no permitieron que?", optionsDe: ["Eine vergangene Verhinderung beeinflusst die Handlung anderer", "Entrar ist ein unregelmäßiges Pretérito", "Der Eintritt geschah sicher"], optionsEn: ["Past prevention influences other people's action", "Entrar has an irregular preterite", "The entry certainly happened"], correct: 0, explanationDe: "No permitieron que rahmt den Eintritt als blockierte oder nicht zugelassene Handlung der Gäste und löst den vergangenen Subjuntivo aus.", explanationEn: "No permitieron que frames entry as the guests' blocked or disallowed action and triggers the past subjunctive." }
    ],
    recallPromptDe: "Fasse die Vorbereitungen auf Spanisch zusammen und verwende mindestens vier unterschiedliche vergangene Einflussrahmen mit jeweils klarer Folghandlung.",
    recallPromptEn: "Summarize the preparations in Spanish using at least four different past influence frames with a clearly identified following action.",
    modelSummary: "Clara quería que su hermano viniera, su madre pidió que ella esperara, prefería que los niños durmieran allí y el padre insistió en que todos terminaran."
  },
  "b2-past-reactions-doubt": {
    title: "Las dudas antes de reparar el sistema",
    inputMode: "listening",
    orientationDe: "Unterscheide vergangene Reaktion, Bewertung, Zweifel und Suche nach einer noch unbekannten Person. Diese Rahmen behaupten die Folgesituation nicht einfach als Tatsache.",
    orientationEn: "Distinguish past reaction, evaluation, doubt, and a search for an unknown person. These frames do not simply assert the following situation as fact.",
    paragraphs: [
      "Cuando falló el sistema, me sorprendió que nadie respondiera al primer aviso. Era importante que todos participaran en la solución, pero varios compañeros dudaban que el plan provisional funcionara durante toda la semana.",
      "La dirección no creía que fuera necesario cerrar la oficina y buscaba a alguien que supiera reparar el servidor. Esa persona todavía no estaba identificada. Respuesta, participación, funcionamiento y habilidad aparecen desde una reacción, valoración, duda o necesidad abierta del pasado."
    ],
    questions: [
      { questionDe: "Warum steht supiera bei der gesuchten Person?", questionEn: "Why is supiera used for the person being sought?", optionsDe: ["Die fachkundige Person war noch nicht identifiziert", "Saber steht nach alguien immer im Subjuntivo", "Die Reparatur war bereits abgeschlossen"], optionsEn: ["The skilled person had not been identified", "Saber always follows alguien in the subjunctive", "The repair was already complete"], correct: 0, explanationDe: "Alguien que supiera beschreibt ein gesuchtes Profil, nicht eine bekannte Person. Die Existenz eines passenden Fachkundigen bleibt aus damaliger Sicht offen.", explanationEn: "Alguien que supiera describes a sought profile, not a known person. The existence of a suitable expert remained open at that past point." },
      { questionDe: "Welche Aussage wird als vergangene Bewertung gerahmt?", questionEn: "Which statement is framed as a past evaluation?", optionsDe: ["Alle sollten an der Lösung teilnehmen", "Der Server war sicher repariert", "Niemand hatte eine Frage"], optionsEn: ["Everyone should participate in the solution", "The server was certainly repaired", "Nobody had a question"], correct: 0, explanationDe: "Era importante que todos participaran bewertet die gewünschte Beteiligung aus einem vergangenen Referenzpunkt heraus.", explanationEn: "Era importante que todos participaran evaluates the desired participation from a past reference point." }
    ],
    recallPromptDe: "Erkläre die Situation auf Spanisch und verwende je einen Rahmen für Überraschung, Bewertung, Zweifel, verneinten Glauben und die Suche nach einer unbekannten Person.",
    recallPromptEn: "Explain the situation in Spanish using one frame each for surprise, evaluation, doubt, negated belief, and a search for an unknown person.",
    modelSummary: "Me sorprendió que nadie respondiera, era importante que todos participaran, dudaban que el plan funcionara y buscaban a alguien que supiera reparar el sistema."
  },
  "b2-past-perfect-subjunctive": {
    title: "Reacciones a lo que ya había ocurrido",
    orientationDe: "Ordne zwei vergangene Ebenen: Die Reaktion, der Zweifel oder die Unkenntnis liegt in der Vergangenheit; das mit hubiera plus Partizip gerahmte Ereignis liegt noch davor.",
    orientationEn: "Order two past levels: the reaction, doubt, or lack of knowledge is in the past, and the event framed with hubiera plus participle happened even earlier.",
    paragraphs: [
      "Al terminar el viaje, me alegró que Ana hubiera venido con nosotros. Algunos dudaban que el equipo hubiera reservado todas las habitaciones y era posible que dos compañeros se hubieran perdido antes de llegar al hotel.",
      "Durante la cena descubrí que Pablo había vivido en Perú. Le dije que no sabía que hubiera pasado tantos años allí. Más tarde perdimos el último tren y todos pensamos: «Ojalá hubiéramos salido antes». La forma compuesta mira a un hecho anterior desde otro pasado."
    ],
    questions: [
      { questionDe: "Welche Handlung geschah vor der Freude des Sprechers?", questionEn: "Which action occurred before the speaker's happiness?", optionsDe: ["Ana war mitgekommen", "Das Team zweifelte später", "Der Zug würde kommen"], optionsEn: ["Ana had come along", "The team doubted later", "The train would arrive"], correct: 0, explanationDe: "Hubiera venido ordnet Anas Teilnahme vor me alegró ein. Die Freude reagiert auf ein bereits abgeschlossenes Ereignis.", explanationEn: "Hubiera venido places Ana's participation before me alegró. The happiness reacts to an already completed event." },
      { questionDe: "Welche Haltung drückt ojalá hubiéramos salido antes aus?", questionEn: "What attitude does ojalá hubiéramos salido antes express?", optionsDe: ["Bedauern über eine unveränderbare Vergangenheit", "Einen sicheren Zukunftsplan", "Eine aktuelle Gewohnheit"], optionsEn: ["Regret about an unchangeable past", "A certain future plan", "A current habit"], correct: 0, explanationDe: "Die Gruppe ist nicht früher aufgebrochen und hat den Zug verpasst. Ojalá plus Pluscuamperfecto de Subjuntivo bewertet diese Vergangenheit im Nachhinein.", explanationEn: "The group did not leave earlier and missed the train. Ojalá plus past perfect subjunctive evaluates that unchangeable past afterward." }
    ],
    recallPromptDe: "Fasse die Reise auf Spanisch zusammen und verbinde mindestens drei frühere Ereignisse mit einer späteren Freude, einem Zweifel, einer Unkenntnis oder einem Bedauern.",
    recallPromptEn: "Summarize the trip in Spanish, linking at least three earlier events to a later reaction, doubt, lack of knowledge, or regret.",
    modelSummary: "Me alegró que Ana hubiera venido, dudaban que el equipo hubiera reservado todo, no sabía que Pablo hubiera vivido en Perú y ojalá hubiéramos salido antes."
  },
  "b2-counterfactual-past": {
    title: "El viaje que habría sido diferente",
    inputMode: "listening",
    orientationDe: "Trenne zwei nicht mehr veränderbare Teile: si plus Pluscuamperfecto de Subjuntivo nennt die unwirkliche Bedingung; das Condicional Compuesto nennt ihr ebenfalls unwirkliches Ergebnis.",
    orientationEn: "Separate two unchangeable parts: si plus past perfect subjunctive gives the unreal condition; the conditional perfect gives its equally unreal result.",
    paragraphs: [
      "El grupo llegó tarde a una excursión. Si hubiera salido media hora antes, habría tomado el tren directo. Si Marta hubiera comprobado el horario, les habría avisado del cambio y todos habrían evitado una larga espera.",
      "También comentaron: «Habríamos llegado antes si no hubiera habido tráfico». De haber sabido que la carretera estaba cortada, no habrían aceptado aquella ruta. Ninguna condición ni resultado ocurrió; los hablantes reconstruyen una alternativa para entender el fracaso."
    ],
    questions: [
      { questionDe: "Was wäre geschehen, wenn Marta den Fahrplan geprüft hätte?", questionEn: "What would have happened if Marta had checked the schedule?", optionsDe: ["Sie hätte die Gruppe gewarnt", "Der Fahrplan wäre verschwunden", "Alle hätten länger gewartet"], optionsEn: ["She would have warned the group", "The schedule would have disappeared", "Everyone would have waited longer"], correct: 0, explanationDe: "Si Marta hubiera comprobado el horario ist die unwirkliche Bedingung; les habría avisado nennt das ausgebliebene Ergebnis.", explanationEn: "Si Marta hubiera comprobado el horario is the unreal condition; les habría avisado states the result that did not occur." },
      { questionDe: "Welche formellere Kurzform ersetzt eine si-Bedingung?", questionEn: "Which more formal compact form replaces a si condition?", optionsDe: ["De haber sabido", "Habríamos llegado", "No habrían aceptado"], optionsEn: ["De haber sabido", "Habríamos llegado", "No habrían aceptado"], correct: 0, explanationDe: "De plus zusammengesetzter Infinitiv fasst si hubieran sabido kompakt zusammen, ohne die kontrafaktische Beziehung zu verändern.", explanationEn: "De plus perfect infinitive compactly replaces si hubieran sabido without changing the counterfactual relationship." }
    ],
    recallPromptDe: "Rekonstruiere auf Spanisch drei alternative Verläufe der Reise und verbinde jeweils eine nicht eingetretene Bedingung mit ihrem nicht eingetretenen Ergebnis.",
    recallPromptEn: "Reconstruct three alternative versions of the trip in Spanish, linking each unreal condition to its unreal result.",
    modelSummary: "Si hubieran salido antes, habrían tomado el tren; si Marta hubiera comprobado el horario, habría avisado, y de haber conocido el corte, no habrían elegido esa ruta."
  },
  "checkpoint-b2-past-subjunctive": {
    title: "La propuesta que todos habrían cambiado",
    orientationDe: "Rekonstruiere Wunsch, frühere Reaktion, damaligen Zweifel, kontrafaktische Bedingung samt Ergebnis und nachträgliches Bedauern als zusammenhängende Vergangenheit.",
    orientationEn: "Reconstruct a wish, earlier reaction, past doubt, counterfactual condition and result, and later regret as one connected past narrative.",
    paragraphs: [
      "El director quería que presentáramos otra propuesta porque el comité había rechazado la primera. Nos sorprendió que la hubieran descartado tan pronto y dudábamos que hubiera tiempo suficiente para empezar de nuevo.",
      "Al final entregamos una versión apresurada. Si hubiéramos recibido más información, habríamos cambiado el plan y explicado mejor los costes. Cuando supimos qué esperaba el comité, todos dijimos: «Ojalá nos lo hubieran explicado antes»."
    ],
    questions: [
      { questionDe: "Welche Handlung lag vor der Überraschung des Teams?", questionEn: "Which action occurred before the team's surprise?", optionsDe: ["Das Komitee hatte die erste Vorlage verworfen", "Der Direktor würde später sprechen", "Das Team hatte unbegrenzt Zeit"], optionsEn: ["The committee had rejected the first proposal", "The director would speak later", "The team had unlimited time"], correct: 0, explanationDe: "Hubieran descartado steht im zusammengesetzten vergangenen Subjuntivo, weil die Ablehnung vor nos sorprendió abgeschlossen war.", explanationEn: "Hubieran descartado is past perfect subjunctive because the rejection was completed before nos sorprendió." },
      { questionDe: "Welche alternative Folge nennen die Sprecher bei mehr Information?", questionEn: "What alternative result do the speakers give for having more information?", optionsDe: ["Sie hätten den Plan geändert", "Sie hätten nichts eingereicht", "Das Komitee hätte keine Erwartungen"], optionsEn: ["They would have changed the plan", "They would have submitted nothing", "The committee would have had no expectations"], correct: 0, explanationDe: "Si hubiéramos recibido más información nennt die unerfüllte Bedingung; habríamos cambiado el plan ist das ebenfalls unreal gebliebene Ergebnis.", explanationEn: "Si hubiéramos recibido más información gives the unmet condition; habríamos cambiado el plan is the equally unreal result." }
    ],
    recallPromptDe: "Fasse die Geschichte auf Spanisch zusammen und erhalte vergangenen Wunsch, frühere Reaktion, Zweifel, kontrafaktische Bedingung mit Ergebnis und ojalá-Bedauern.",
    recallPromptEn: "Summarize the story in Spanish, preserving the past wish, earlier reaction, doubt, counterfactual condition and result, and ojalá regret.",
    modelSummary: "El director quería que presentáramos otra propuesta; nos sorprendió que rechazaran la primera y, si hubiéramos recibido más datos, habríamos cambiado el plan. Ojalá lo hubieran explicado antes."
  },
  "b2-acabar-de-recent": {
    title: "Noticias que acaban de ocurrir",
    inputMode: "listening",
    orientationDe: "Suche den Referenzpunkt: acaba de plus Infinitiv liegt unmittelbar vor jetzt; acababa de plus Infinitiv liegt unmittelbar vor einem genannten vergangenen Moment.",
    orientationEn: "Find the reference point: acaba de plus infinitive occurs immediately before now; acababa de plus infinitive occurs immediately before a stated past moment.",
    paragraphs: [
      "Clara llega a casa y dice: «Acabo de terminar la reunión y Ana acaba de llamar con una noticia». Su hermano no puede hablar porque acaba de entrar en una clase en línea. Todos esos hechos ocurrieron inmediatamente antes de la conversación actual.",
      "Clara recuerda otra escena: cuando llegó ayer a la estación, el tren acababa de salir. La salida fue inmediatamente anterior a su llegada de ayer, no al relato actual. Solo acabar se adapta a la persona y al tiempo; el segundo verbo permanece en infinitivo."
    ],
    questions: [
      { questionDe: "Warum steht bei der Zugabfahrt acababa de?", questionEn: "Why is acababa de used for the train departure?", optionsDe: ["Die Abfahrt lag unmittelbar vor einer vergangenen Ankunft", "Der Zug fährt gerade jetzt ab", "Salir ist eine Gewohnheit"], optionsEn: ["The departure occurred just before a past arrival", "The train is leaving right now", "Leaving is a habit"], correct: 0, explanationDe: "Llegó setzt einen vergangenen Referenzpunkt. Acababa de salir platziert die Abfahrt unmittelbar davor und nicht unmittelbar vor dem aktuellen Sprechen.", explanationEn: "Llegó establishes a past reference point. Acababa de salir places departure immediately before it, not immediately before current speech." },
      { questionDe: "Welcher Teil wird an das Subjekt angepasst?", questionEn: "Which part agrees with the subject?", optionsDe: ["Acabar", "Der folgende Infinitiv", "Die Präposition de"], optionsEn: ["Acabar", "The following infinitive", "The preposition de"], correct: 0, explanationDe: "Acabo, acaba und acababa tragen Person und Zeit. Terminar, llamar, entrar oder salir bleiben danach unveränderte Infinitive.", explanationEn: "Acabo, acaba, and acababa carry person and tense. Terminar, llamar, entrar, and salir remain unchanged infinitives." }
    ],
    recallPromptDe: "Berichte auf Spanisch drei gerade erst geschehene Neuigkeiten und stelle ihnen ein Ereignis gegenüber, das unmittelbar vor einem vergangenen Moment geschehen war.",
    recallPromptEn: "Report three pieces of very recent news in Spanish and contrast them with an event that had happened just before a past moment.",
    modelSummary: "Clara acaba de llegar y de terminar la reunión, Ana acaba de llamar y su hermano acaba de entrar en clase; ayer el tren acababa de salir cuando Clara llegó."
  },
  "b2-seguir-continuity": {
    title: "Lo que continúa a pesar de los cambios",
    orientationDe: "Erkenne eine früher begonnene und weiterhin aktive Handlung oder einen unveränderten Zustand. Seguir oder continuar trägt Person und Zeit, das Gerundium trägt den fortdauernden Inhalt.",
    orientationEn: "Recognize an action begun earlier and still active, or an unchanged state. Seguir or continuar carries person and tense; the gerund carries the continuing content.",
    paragraphs: [
      "Aunque Elena está cansada, continúa trabajando en el proyecto. Sus compañeros siguen esperando una respuesta del ayuntamiento y ella sigue viviendo en el mismo barrio, aunque ya trabaja en otra oficina.",
      "El problema sigue siendo complicado, pero el equipo no abandona la tarea. Cuando alguien pregunta «¿Sigues estudiando español?», no pregunta por una actividad nueva, sino por la continuidad de algo que ya ocurría. El obstáculo no interrumpe necesariamente la acción."
    ],
    questions: [
      { questionDe: "Welche Situation bleibt trotz eines Arbeitsplatzwechsels unverändert?", questionEn: "Which situation remains unchanged despite a workplace change?", optionsDe: ["Elena wohnt weiterhin im selben Viertel", "Das Projekt ist beendet", "Die Antwort ist angekommen"], optionsEn: ["Elena still lives in the same neighborhood", "The project has ended", "The reply has arrived"], correct: 0, explanationDe: "Sigue viviendo kontrastiert die fortbestehende Wohnsituation mit dem veränderten Arbeitsort und macht die Kontinuität sichtbar.", explanationEn: "Sigue viviendo contrasts the continuing living situation with the changed workplace and makes continuity explicit." },
      { questionDe: "Warum ist sigue siendo möglich?", questionEn: "Why is sigue siendo possible?", optionsDe: ["Auch ein Zustand kann unverändert fortbestehen", "Ser wird dadurch reflexiv", "Seguir verlangt immer eine Bewegung"], optionsEn: ["A state can also continue unchanged", "Ser becomes reflexive", "Seguir always requires movement"], correct: 0, explanationDe: "Ser beschreibt hier den Zustand complicado. Seguir plus siendo zeigt, dass genau diese Eigenschaft bis zum Referenzpunkt fortbesteht.", explanationEn: "Ser describes the state complicado. Seguir plus siendo shows that this property remains in force up to the reference point." }
    ],
    recallPromptDe: "Fasse auf Spanisch vier fortdauernde Handlungen oder Zustände zusammen und erwähne jeweils den Gegensatz oder Zeitraum, trotz dessen sie weiterbestehen.",
    recallPromptEn: "Summarize four continuing actions or states in Spanish, mentioning the contrast or time span despite which each continues.",
    modelSummary: "Aunque está cansada, Elena continúa trabajando y sigue viviendo en el barrio; sus compañeros siguen esperando y el problema sigue siendo complicado."
  },
  "b2-llevar-duration": {
    title: "El tiempo acumulado en una nueva ciudad",
    inputMode: "listening",
    orientationDe: "Verbinde die Dauer mit einer am Referenzpunkt noch laufenden Handlung. Llevar wird an Person und Gegenwart oder Vergangenheit angepasst; Dauer und Gerundium bilden den Rest des Rahmens.",
    orientationEn: "Connect duration to an action still running at the reference point. Llevar agrees with person and present or past; duration and gerund complete the frame.",
    paragraphs: [
      "Nora lleva dos años viviendo en Valencia y lleva dieciocho meses estudiando español. Sus compañeros y ella llevan media hora esperando un autobús cuando un turista pregunta cuánto tiempo llevan trabajando en la ciudad.",
      "Nora recuerda que, al conseguir su empleo, llevaba meses buscando trabajo. Esa búsqueda seguía activa hasta aquel momento pasado. Llevar no cuenta una duración terminada: acumula tiempo hasta ahora o hasta otro punto de referencia que el contexto sitúa en el pasado."
    ],
    questions: [
      { questionDe: "Welche Handlung dauerte schon Monate bis zu Noras Arbeitsbeginn?", questionEn: "Which action had continued for months up to Nora's employment?", optionsDe: ["Die Arbeitssuche", "Das Warten auf den Bus", "Das Leben in Valencia"], optionsEn: ["The job search", "Waiting for the bus", "Living in Valencia"], correct: 0, explanationDe: "Llevaba meses buscando trabajo setzt einen vergangenen Referenzpunkt und misst die bis dahin fortlaufende Suche.", explanationEn: "Llevaba meses buscando trabajo establishes a past reference point and measures the search continuing up to it." },
      { questionDe: "Welche Frage bittet um die Dauer einer laufenden Tätigkeit?", questionEn: "Which question asks for the duration of an ongoing activity?", optionsDe: ["¿Cuánto tiempo llevan trabajando aquí?", "¿Cuándo terminaron el trabajo?", "¿Por qué perdieron el autobús?"], optionsEn: ["¿Cuánto tiempo llevan trabajando aquí?", "When did they finish the work?", "Why did they miss the bus?"], correct: 0, explanationDe: "Cuánto tiempo plus llevar und Gerundium fragt nach dem angesammelten Zeitraum einer Tätigkeit, die am Sprechzeitpunkt noch gilt.", explanationEn: "Cuánto tiempo plus llevar and gerund asks for the accumulated duration of an activity still true at speaking time." }
    ],
    recallPromptDe: "Beschreibe auf Spanisch Noras aktuelle und frühere Zeitspannen mit mindestens drei Gegenwartsformen und einer Vergangenheitsform von llevar plus Gerundium.",
    recallPromptEn: "Describe Nora's current and earlier durations in Spanish using at least three present forms and one past form of llevar plus gerund.",
    modelSummary: "Nora lleva dos años viviendo en Valencia y dieciocho meses estudiando; llevan media hora esperando el autobús y, al encontrar empleo, llevaba meses buscando trabajo."
  },
  "b2-soler-habits": {
    title: "Rutinas de antes y costumbres de ahora",
    orientationDe: "Lege zuerst den Zeitrahmen fest: suelo oder solemos beschreibt eine gegenwärtig typische Gewohnheit; solía oder solíamos blickt auf eine frühere regelmäßige Routine.",
    orientationEn: "Set the time frame first: suelo or solemos describes a current typical habit; solía or solíamos looks back on an earlier repeated routine.",
    paragraphs: [
      "Ahora Pablo suele levantarse temprano y suele ir al trabajo en bicicleta. Los domingos, él y su familia suelen comer juntos. No suele beber café por la tarde porque quiere dormir mejor.",
      "Antes vivía lejos y solía conducir casi una hora. Los fines de semana solía quedarse en casa, pero su rutina cambió al mudarse. Cuando alguien pregunta qué suele hacer, busca lo típico de ahora, no una acción que ocurre necesariamente todos los días."
    ],
    questions: [
      { questionDe: "Welche frühere Gewohnheit hat Pablo aufgegeben?", questionEn: "Which former habit has Pablo left behind?", optionsDe: ["Fast eine Stunde zur Arbeit fahren", "Sonntags mit der Familie essen", "Nachmittags keinen Kaffee trinken"], optionsEn: ["Drive nearly an hour to work", "Eat with family on Sundays", "Avoid coffee in the afternoon"], correct: 0, explanationDe: "Antes solía conducir situiert die regelmäßige Fahrt in einer früheren Lebensphase, die durch den Umzug beendet wurde.", explanationEn: "Antes solía conducir places the repeated drive in an earlier phase of life that ended when he moved." },
      { questionDe: "Behauptet suele, dass etwas ausnahmslos immer geschieht?", questionEn: "Does suele claim something happens without exception?", optionsDe: ["Nein, es bezeichnet das Typische", "Ja, es ist stärker als siempre", "Nein, es beschreibt nur einen einzelnen Tag"], optionsEn: ["No, it marks what is typical", "Yes, it is stronger than siempre", "No, it describes only one day"], correct: 0, explanationDe: "Soler charakterisiert eine übliche Routine. Einzelne Ausnahmen sind damit vereinbar, solange die Handlung für den Zeitraum typisch bleibt.", explanationEn: "Soler characterizes a usual routine. Individual exceptions are compatible as long as the action remains typical for the period." }
    ],
    recallPromptDe: "Vergleiche Pablos Leben auf Spanisch mit mindestens drei heutigen Gewohnheiten im Präsens und zwei früheren Gewohnheiten im Imperfecto von soler.",
    recallPromptEn: "Compare Pablo's life in Spanish using at least three current habits in the present and two former habits with imperfect soler.",
    modelSummary: "Ahora Pablo suele levantarse temprano, ir en bicicleta y comer con su familia; antes solía conducir una hora y quedarse en casa los fines de semana."
  },
  "b2-change-repetition-periphrases": {
    title: "Cómo cambió un proyecto después de fracasar",
    inputMode: "listening",
    orientationDe: "Bestimme die Phase der Handlung: empezar a eröffnet sie, dejar de beendet eine bisherige Aktivität, volver a nimmt sie erneut auf und terminar de markiert ihren Abschluss.",
    orientationEn: "Identify the action phase: empezar a opens it, dejar de ends a previous activity, volver a resumes it, and terminar de marks its completion.",
    paragraphs: [
      "El equipo empezó a desarrollar una aplicación en enero, pero dejó de trabajar durante un mes porque faltaba financiación. Cuando recibió apoyo, volvió a intentarlo con un diseño más sencillo y empezó a probarlo con usuarios reales.",
      "Ayer terminaron de revisar los últimos comentarios y dejaron de añadir funciones nuevas. Después de una breve pausa, volvió a fallar el servidor, así que empezaron a investigar otra vez. Las perífrasis muestran en qué punto se encuentra cada acción, no solo cuándo ocurre."
    ],
    questions: [
      { questionDe: "Welche Handlung nahm das Team nach der Finanzierung wieder auf?", questionEn: "Which action did the team resume after receiving funding?", optionsDe: ["Die Entwicklung mit einem einfacheren Entwurf", "Die endgültige Aufgabe des Projekts", "Das Entfernen aller Nutzer"], optionsEn: ["Development with a simpler design", "Permanently abandoning the project", "Removing every user"], correct: 0, explanationDe: "Volvió a intentarlo kennzeichnet die erneute Aufnahme nach der Unterbrechung; das einfachere Design verändert den neuen Versuch.", explanationEn: "Volvió a intentarlo marks resumption after interruption; the simpler design changes the renewed attempt." },
      { questionDe: "Was markiert terminaron de revisar?", questionEn: "What does terminaron de revisar mark?", optionsDe: ["Den Abschluss der Prüfung", "Den Beginn der Prüfung", "Eine typische Gewohnheit"], optionsEn: ["Completion of the review", "Beginning of the review", "A typical habit"], correct: 0, explanationDe: "Terminar de richtet die Aufmerksamkeit auf den Endpunkt der Überprüfung: Die letzten Kommentare sind vollständig bearbeitet.", explanationEn: "Terminar de focuses on the endpoint of reviewing: the final comments have been completely processed." }
    ],
    recallPromptDe: "Erzähle den Projektverlauf auf Spanisch und verwende empezar a, dejar de, volver a und terminar de jeweils so, dass Beginn, Unterbrechung, Wiederaufnahme und Abschluss klar werden.",
    recallPromptEn: "Retell the project in Spanish using empezar a, dejar de, volver a, and terminar de so beginning, interruption, resumption, and completion are clear.",
    modelSummary: "El equipo empezó a desarrollar la aplicación, dejó de trabajar por falta de dinero, volvió a intentarlo, terminó de revisar comentarios y empezó a investigar cuando el servidor volvió a fallar."
  },
  "checkpoint-b2-verbal-periphrases": {
    title: "Un curso que ha cambiado la forma de aprender",
    orientationDe: "Ordne jede Periphrase einer zeitlichen Funktion zu: unmittelbare Neuigkeit, angesammelte Dauer, Fortsetzung, frühere Gewohnheit, beendetes Verhalten oder erneute Aufnahme.",
    orientationEn: "Match every periphrasis to a time function: immediate news, accumulated duration, continuation, former habit, stopped behavior, or resumed action.",
    paragraphs: [
      "Clara acaba de empezar un curso nuevo y lleva tres semanas asistiendo a clase. Sigue practicando todos los días, incluso cuando está cansada. Antes no solía hablar delante del grupo, pero ahora participa con más confianza.",
      "También ha dejado de traducir cada palabra y ha vuelto a disfrutar de la lectura. Ayer terminó de leer su primer relato sin diccionario y enseguida empezó a escribir un resumen. Su progreso no se reduce a una fecha: cada perífrasis muestra una fase distinta del cambio."
    ],
    questions: [
      { questionDe: "Welche frühere Gewohnheit hat sich verändert?", questionEn: "Which former habit has changed?", optionsDe: ["Clara sprach gewöhnlich nicht vor der Gruppe", "Clara las jeden Tag ohne Wörterbuch", "Clara übersetzte nie ein Wort"], optionsEn: ["Clara did not usually speak before the group", "Clara read daily without a dictionary", "Clara never translated a word"], correct: 0, explanationDe: "Antes no solía hablar beschreibt eine typische frühere Zurückhaltung; ahora participa más setzt ihr die veränderte Gegenwart entgegen.", explanationEn: "Antes no solía hablar describes typical former reluctance; ahora participa más contrasts it with the changed present." },
      { questionDe: "Welche zwei Formen markieren Beenden und erneutes Erleben?", questionEn: "Which two forms mark stopping and renewed experience?", optionsDe: ["Ha dejado de traducir und ha vuelto a disfrutar", "Lleva asistiendo und sigue practicando", "Acaba de empezar und solía hablar"], optionsEn: ["Ha dejado de traducir and ha vuelto a disfrutar", "Lleva asistiendo and sigue practicando", "Acaba de empezar and solía hablar"], correct: 0, explanationDe: "Dejar de beendet die bisherige Übersetzungsgewohnheit; volver a zeigt, dass die Freude am Lesen nach einer Unterbrechung zurückkehrt.", explanationEn: "Dejar de ends the previous translation habit; volver a shows that enjoyment of reading returns after an interruption." }
    ],
    recallPromptDe: "Fasse Claras Lernentwicklung auf Spanisch zusammen und verwende alle sechs Funktionen: gerade erst, seit einer Dauer, weiterhin, früher gewöhnlich, aufgehört und wieder begonnen.",
    recallPromptEn: "Summarize Clara's learning development in Spanish using all six functions: just, for a duration, still, formerly usually, stopped, and resumed.",
    modelSummary: "Clara acaba de empezar un curso, lleva semanas asistiendo y sigue practicando; antes no solía hablar, pero ha dejado de traducir todo y ha vuelto a disfrutar de la lectura."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const existing = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (existing.length !== entries.length) throw new Error(`B2 past/periphrasis input requires ${entries.length} lessons, found ${existing.length}.`);
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 22 : 18 } });
  }
  console.log(`Seeded connected input for ${entries.length} B2 past-subjunctive and periphrasis packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
