const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "b2-concession-aunque": {
    title: "Una decisión que reconoce los obstáculos",
    inputMode: "listening",
    orientationDe: "Achte darauf, ob der Sprecher den Einwand als bekannte Tatsache akzeptiert oder nur als mögliche Hürde vorwegnimmt. Das steuert Indicativo oder Subjuntivo.",
    orientationEn: "Notice whether the speaker accepts the objection as a known fact or anticipates it only as a possible obstacle. This controls indicative or subjunctive.",
    paragraphs: [
      "Elena quiere hacer un curso profesional. Aunque el precio es alto, considera que la formación merece la pena porque mejoraría sus oportunidades. Su hermano reconoce el beneficio, pero duda de que sea el momento adecuado para gastar tanto dinero.",
      "Elena responde que se matriculará aunque tenga que reducir otros gastos. En la primera frase, el precio alto es un hecho conocido y aparece en indicativo. En la segunda, el sacrificio económico todavía es una posibilidad que no cambia su decisión."
    ],
    questions: [
      { questionDe: "Welche Information behandelt Elena als bereits bekannte Tatsache?", questionEn: "Which information does Elena treat as an established fact?", optionsDe: ["Der Kurs ist teuer", "Sie muss sicher alle Ausgaben streichen", "Ihr Bruder bezahlt den Kurs"], optionsEn: ["The course is expensive", "She must certainly eliminate every expense", "Her brother pays for the course"], correct: 0, explanationDe: "Aunque el precio es alto steht im Indicativo, weil beide Gesprächspartner den hohen Preis als gegebenen Einwand behandeln.", explanationEn: "Aunque el precio es alto uses the indicative because both speakers treat the high price as an accepted objection." },
      { questionDe: "Warum steht tenga in aunque tenga que reducir...?", questionEn: "Why is tenga used in aunque tenga que reducir...?", optionsDe: ["Die Einschränkung ist noch möglich, aber nicht bestätigt", "Reducir verlangt immer Subjuntivo", "Der Kurs wurde bereits beendet"], optionsEn: ["The limitation is possible but not confirmed", "Reducir always requires the subjunctive", "The course has already ended"], correct: 0, explanationDe: "Elena räumt eine mögliche zukünftige Folge ein. Ob und wie stark sie sparen muss, steht noch nicht fest, ihre Entscheidung aber schon.", explanationEn: "Elena concedes a possible future consequence. Whether and how much she must cut spending is not yet known, but her decision stands." }
    ],
    recallPromptDe: "Gib Elenas Argument auf Spanisch wieder und verwende aunque einmal mit einer anerkannten Tatsache und einmal mit einer möglichen zukünftigen Hürde.",
    recallPromptEn: "Restate Elena's argument in Spanish, using aunque once with an accepted fact and once with a possible future obstacle.",
    modelSummary: "Aunque el curso es caro, Elena cree que merece la pena y se matriculará aunque tenga que reducir otros gastos."
  },
  "b2-concession-alternatives": {
    title: "El festival que siguió adelante bajo la lluvia",
    orientationDe: "Ordne jedem Einräumungsrahmen seine Struktur zu: Nomen nach a pesar de, Infinitiv bei gleichem Subjekt, vollständiger Satz nach pese a que und intensive Hürde nach por mucho que.",
    orientationEn: "Match each concessive frame with its structure: noun after a pesar de, infinitive with the same subject, full clause after pese a que, and an intensified obstacle after por mucho que.",
    paragraphs: [
      "A pesar de la lluvia, el festival del barrio abrió a la hora prevista. Los músicos actuaron a pesar de estar cansados después del viaje y el público permaneció en la plaza pese a que hacía bastante frío.",
      "Por mucho que aumentara la lluvia, los organizadores protegían los equipos y adaptaban el programa. Con todo, tuvieron que cancelar el último concierto. La jornada no fue un fracaso: las concesiones permiten reconocer dificultades reales sin borrar el resultado principal."
    ],
    questions: [
      { questionDe: "Warum folgt auf a pesar de estar kein que?", questionEn: "Why does a pesar de estar not include que?", optionsDe: ["Das verstandene Subjekt der Musiker bleibt gleich", "Estar ist ein Nomen", "Der Satz enthält keine Einräumung"], optionsEn: ["The understood subject remains the musicians", "Estar is a noun", "The sentence contains no concession"], correct: 0, explanationDe: "Die Musiker sind sowohl erschöpft als auch die Handelnden von actuaron. Bei identischem Subjekt kann a pesar de direkt mit dem Infinitiv stehen.", explanationEn: "The musicians are both tired and the actors of actuaron. With the same subject, a pesar de can take an infinitive directly." },
      { questionDe: "Welche Funktion erfüllt con todo am Ende?", questionEn: "What function does con todo serve at the end?", optionsDe: ["Es verbindet die Gesamtlage mit einer einschränkenden Folge", "Es nennt die Ursache des Regens", "Es führt einen Zielort ein"], optionsEn: ["It links the whole situation to a limiting result", "It states the cause of the rain", "It introduces a destination"], correct: 0, explanationDe: "Con todo greift die zuvor genannten erfolgreichen Anpassungen auf und setzt ihnen die dennoch notwendige Absage entgegen.", explanationEn: "Con todo refers back to the successful adjustments and contrasts them with the cancellation that was still necessary." }
    ],
    recallPromptDe: "Fasse den Verlauf des Festivals auf Spanisch mit a pesar de plus Nomen, a pesar de plus Infinitiv, pese a que und con todo zusammen.",
    recallPromptEn: "Summarize the festival in Spanish using a pesar de plus a noun, a pesar de plus an infinitive, pese a que, and con todo.",
    modelSummary: "A pesar de la lluvia, el festival abrió; los músicos actuaron a pesar de estar cansados y el público se quedó pese a que hacía frío. Con todo, cancelaron el final."
  },
  "b2-cause-consequence": {
    title: "Por qué se aplazó una decisión importante",
    inputMode: "listening",
    orientationDe: "Trenne Ursache, als geteilt präsentierte Begründung und logische Folge. Achte besonders darauf, dass de ahí que als resultierender Rahmen den Subjuntivo verlangt.",
    orientationEn: "Separate cause, shared explanation, and logical consequence. Notice especially that de ahí que introduces a resulting frame with the subjunctive.",
    paragraphs: [
      "La dirección aplazó la apertura de una nueva oficina debido a varios problemas técnicos. Decidió esperar, ya que todavía faltaban datos sobre la seguridad del edificio. Por lo tanto, el equipo mantendrá durante un mes su sede actual.",
      "Además, el plazo inicial había sido demasiado corto, de ahí que surgieran errores en los informes. La revisión no solo permitirá corregirlos, sino que además dará tiempo para consultar a los empleados. Cada conector hace visible una relación distinta dentro de la explicación."
    ],
    questions: [
      { questionDe: "Welche unmittelbare Konsequenz hat die Verschiebung?", questionEn: "What is the immediate consequence of the postponement?", optionsDe: ["Das Team bleibt einen Monat am bisherigen Standort", "Das Gebäude öffnet sofort", "Alle Berichte werden gelöscht"], optionsEn: ["The team remains at its current site for a month", "The building opens immediately", "All reports are deleted"], correct: 0, explanationDe: "Por lo tanto kündigt die logische Folge der Verschiebung an: Das Team nutzt vorerst weiterhin den bisherigen Standort.", explanationEn: "Por lo tanto introduces the logical consequence of postponement: the team continues using its current site for now." },
      { questionDe: "Warum verwendet de ahí que die Form surgieran?", questionEn: "Why does de ahí que use surgieran?", optionsDe: ["Der Rahmen präsentiert Fehler als daraus entstandenes Ergebnis", "Surgir ist immer unregelmäßig", "Die Fehler sind ein zukünftiger Plan"], optionsEn: ["The frame presents errors as a resulting outcome", "Surgir is always irregular", "The errors are a future plan"], correct: 0, explanationDe: "De ahí que verbindet den zu kurzen Zeitraum mit seiner resultierenden Erklärung und verlangt in diesem Bedeutungsrahmen den Subjuntivo.", explanationEn: "De ahí que links the short deadline to its resulting explanation and takes the subjunctive in this meaning frame." }
    ],
    recallPromptDe: "Erkläre die Verschiebung auf Spanisch mit je einem Ausdruck für Ursache, Begründung, logische Folge und resultierendes Ergebnis.",
    recallPromptEn: "Explain the postponement in Spanish using one expression each for cause, explanation, logical consequence, and resulting outcome.",
    modelSummary: "La apertura se aplazó debido a problemas técnicos y, ya que faltaban datos, el equipo seguirá en su sede; el plazo fue corto, de ahí que surgieran errores."
  },
  "b2-hedging-register": {
    title: "Lo que realmente sabemos sobre los precios",
    orientationDe: "Bewerte die Stärke jeder Aussage. Die Sprecher markieren Evidenz, Wahrscheinlichkeit, äußeren Anschein, begrenztes Wissen oder eine bloße Möglichkeit, statt absolute Gewissheit vorzutäuschen.",
    orientationEn: "Assess the strength of each claim. Speakers mark evidence, probability, appearance, limited knowledge, or mere possibility instead of pretending absolute certainty.",
    paragraphs: [
      "En una entrevista, una economista afirma: «Todo indica que los precios están subiendo más despacio, pero es probable que algunos alimentos sigan encareciéndose». No transforma una tendencia en una certeza sobre cada producto.",
      "Añade: «Al parecer, varias empresas ya han reducido sus costes. Hasta donde sé, todavía no han anunciado nuevas tarifas, aunque cabe la posibilidad de que cambien las condiciones en otoño». Cada marco permite distinguir datos, interpretación y límites del conocimiento."
    ],
    questions: [
      { questionDe: "Welche Aussage begrenzt ausdrücklich das Wissen der Sprecherin?", questionEn: "Which expression explicitly limits the speaker's knowledge?", optionsDe: ["Hasta donde sé", "Todo indica que", "Es probable que"], optionsEn: ["Hasta donde sé", "Todo indica que", "Es probable que"], correct: 0, explanationDe: "Hasta donde sé macht deutlich, dass die Aussage nur innerhalb ihres aktuellen Informationsstands gilt und korrigierbar bleibt.", explanationEn: "Hasta donde sé makes clear that the statement holds only within her current knowledge and remains open to correction." },
      { questionDe: "Behauptet die Ökonomin sichere Preisänderungen im Herbst?", questionEn: "Does the economist claim certain price changes in autumn?", optionsDe: ["Nein, sie öffnet nur eine Möglichkeit", "Ja, alle Preise werden sicher steigen", "Nein, sie schließt jede Änderung aus"], optionsEn: ["No, she only opens a possibility", "Yes, every price will certainly rise", "No, she rules out any change"], correct: 0, explanationDe: "Cabe la posibilidad de que cambien formuliert eine mögliche Entwicklung und vermeidet eine unbelegte sichere Vorhersage.", explanationEn: "Cabe la posibilidad de que cambien frames a possible development and avoids an unsupported certain prediction." }
    ],
    recallPromptDe: "Fasse die Einschätzung auf Spanisch zusammen und markiere dabei gestützte Tendenz, Wahrscheinlichkeit, begrenztes Wissen und mögliche Änderung unterschiedlich stark.",
    recallPromptEn: "Summarize the assessment in Spanish, separately marking supported trend, probability, limited knowledge, and possible change.",
    modelSummary: "Todo indica que la subida se frena, aunque es probable que algunos alimentos se encarezcan; hasta donde sabe la economista, no hay nuevas tarifas, pero cabe la posibilidad de cambios."
  },
  "b2-structured-argument": {
    title: "¿Debe el centro cerrar una calle al tráfico?",
    inputMode: "listening",
    orientationDe: "Verfolge die Argumentarchitektur: Position, zwei stützende Gründe, gewichtige Einschränkung, explizite Gegenüberstellung und bedingte Schlussfolgerung.",
    orientationEn: "Follow the argument architecture: position, two supporting reasons, a serious limitation, explicit balance, and a conditional conclusion.",
    paragraphs: [
      "En primer lugar, cerrar la calle principal los domingos reduciría el ruido y mejoraría la seguridad. Además, permitiría recuperar espacio para peatones y actividades del barrio. Estas ventajas explican por qué muchos vecinos apoyan la propuesta.",
      "Ahora bien, la medida también podría dificultar las entregas de algunos comercios. Por un lado mejoraría el espacio público; por otro, exigiría rutas alternativas bien organizadas. En definitiva, sería útil siempre que se aplicara gradualmente y se revisaran sus efectos."
    ],
    questions: [
      { questionDe: "Welche Einschränkung erkennt das Argument ausdrücklich an?", questionEn: "Which limitation does the argument explicitly acknowledge?", optionsDe: ["Lieferungen könnten schwieriger werden", "Die Straße hat keine Geschäfte", "Die Anwohner lehnen Sicherheit ab"], optionsEn: ["Deliveries could become more difficult", "The street has no businesses", "Residents oppose safety"], correct: 0, explanationDe: "Ahora bien leitet eine ernsthafte Einschränkung der zuvor genannten Vorteile ein: die praktischen Folgen für Lieferungen.", explanationEn: "Ahora bien introduces a serious qualification to the earlier benefits: the practical impact on deliveries." },
      { questionDe: "Unter welcher Bedingung fällt die Schlussfolgerung positiv aus?", questionEn: "Under what condition is the conclusion positive?", optionsDe: ["Bei schrittweiser Einführung und Überprüfung", "Nur bei sofortiger dauerhafter Sperrung", "Wenn keine Daten erhoben werden"], optionsEn: ["With gradual implementation and review", "Only with an immediate permanent closure", "If no data are collected"], correct: 0, explanationDe: "Siempre que se aplicara gradualmente y se revisaran sus efectos begrenzt die Zustimmung durch zwei überprüfbare Bedingungen.", explanationEn: "Siempre que se aplicara gradualmente y se revisaran sus efectos limits support with two testable conditions." }
    ],
    recallPromptDe: "Halte auf Spanisch einen kurzen ausgewogenen Beitrag mit erstem Grund, zusätzlichem Vorteil, Einschränkung, zwei Seiten und bedingter Schlussfolgerung.",
    recallPromptEn: "Give a short balanced contribution in Spanish with a first reason, added benefit, limitation, two sides, and conditional conclusion.",
    modelSummary: "En primer lugar, el cierre reduciría el ruido; además, recuperaría espacio. Ahora bien, complicaría las entregas. En definitiva, convendría aplicarlo gradualmente y revisar los resultados."
  },
  "checkpoint-b2-discourse": {
    title: "Una propuesta razonada para cambiar el horario",
    orientationDe: "Prüfe, ob der Beitrag fair einräumt, Ursachen und Folgen präzise verbindet, Behauptungen angemessen begrenzt und zu einer bedingten statt absoluten Empfehlung gelangt.",
    orientationEn: "Check whether the contribution concedes fairly, links causes and consequences precisely, limits claims appropriately, and reaches a conditional rather than absolute recommendation.",
    paragraphs: [
      "Aunque ampliar el horario de la biblioteca tendría costes, ofrecería beneficios importantes para quienes trabajan hasta tarde. Muchos usuarios no pueden llegar antes debido a sus empleos; por lo tanto, una apertura nocturna respondería a una necesidad real.",
      "Hasta donde sabemos, todavía faltan datos sobre la demanda de los domingos. Por un lado, el cambio mejoraría el acceso; por otro, exigiría más personal. En definitiva, convendría probarlo durante tres meses, siempre que se revisaran los costes y la asistencia."
    ],
    questions: [
      { questionDe: "Welche Behauptung wird ausdrücklich durch fehlendes Wissen begrenzt?", questionEn: "Which claim is explicitly limited by missing knowledge?", optionsDe: ["Die Nachfrage am Sonntag ist noch unklar", "Berufstätige kommen oft spät", "Eine Testphase dauert drei Monate"], optionsEn: ["Sunday demand remains unclear", "Workers often arrive late", "A trial lasts three months"], correct: 0, explanationDe: "Hasta donde sabemos und todavía faltan datos markieren gemeinsam, dass zur Sonntagsnachfrage noch keine belastbare Aussage möglich ist.", explanationEn: "Hasta donde sabemos and todavía faltan datos jointly mark that no firm claim about Sunday demand is possible yet." },
      { questionDe: "Welche Empfehlung zieht der Text aus der Abwägung?", questionEn: "What recommendation follows from the balance?", optionsDe: ["Eine überwachte dreimonatige Testphase", "Eine sofortige unbegrenzte Erweiterung", "Die Bibliothek vollständig schließen"], optionsEn: ["A monitored three-month trial", "Immediate unlimited expansion", "Close the library completely"], correct: 0, explanationDe: "Die Schlussfolgerung verbindet einen begrenzten Versuch mit der Bedingung, Kosten und tatsächliche Nutzung anschließend zu überprüfen.", explanationEn: "The conclusion combines a limited trial with the condition that cost and actual attendance be reviewed." }
    ],
    recallPromptDe: "Formuliere die Empfehlung auf Spanisch in höchstens vier Sätzen und erhalte Einräumung, Ursache-Folge, Wissensgrenze, Abwägung und Bedingung.",
    recallPromptEn: "State the recommendation in Spanish in at most four sentences, preserving concession, cause-result, knowledge limit, balance, and condition.",
    modelSummary: "Aunque ampliar el horario costaría dinero, ayudaría a muchos usuarios. Como faltan datos, convendría probarlo tres meses y mantenerlo solo si los resultados fueran positivos."
  },
  "b2-report-present-statements": {
    title: "El mensaje actual de cuatro departamentos",
    inputMode: "listening",
    orientationDe: "Bestimme zuerst die Quelle jeder Information. Da die Berichtsverben im Präsens stehen und die Aussagen weiterhin gelten, bleiben die ursprünglichen Präsensbeziehungen erhalten.",
    orientationEn: "First identify each source. Since the reporting verbs are present and the information remains current, the original present relationships remain.",
    paragraphs: [
      "Marta dice que está cansada porque el proyecto exige muchas reuniones. Luis afirma que no conoce todavía la fecha final y Ana explica que necesita más tiempo para revisar los datos. Cada persona aporta una información distinta.",
      "Mientras tanto, los compañeros comentan que el curso interno es útil. El informe semanal señala que los resultados son positivos, aunque recomienda mantener el seguimiento. Las comillas desaparecen, pero la fuente y el grado de formalidad siguen siendo visibles en dice, afirma, explica, comentan y señala."
    ],
    questions: [
      { questionDe: "Wer benötigt mehr Zeit für die Datenprüfung?", questionEn: "Who needs more time to review the data?", optionsDe: ["Ana", "Luis", "Die Verfasser des Berichts"], optionsEn: ["Ana", "Luis", "The report's authors"], correct: 0, explanationDe: "Ana explica que necesita más tiempo weist Ana eindeutig als Quelle und Subjekt der weiterhin aktuellen Notwendigkeit aus.", explanationEn: "Ana explica que necesita más tiempo clearly identifies Ana as the source and subject of the continuing need." },
      { questionDe: "Welches Berichtsverb passt zu einer formellen schriftlichen Quelle?", questionEn: "Which reporting verb suits a formal written source?", optionsDe: ["El informe señala que", "Marta dice que", "Los compañeros comentan que"], optionsEn: ["El informe señala que", "Marta dice que", "Los compañeros comentan que"], correct: 0, explanationDe: "Señala que lässt einen Bericht sachlich auf ein Ergebnis hinweisen und ist formeller als das alltägliche dice oder comentan.", explanationEn: "Señala que lets a report point formally to a result and is more formal than everyday dice or comentan." }
    ],
    recallPromptDe: "Berichte auf Spanisch mindestens vier aktuelle Aussagen und mache mit unterschiedlichen Berichtsverben jeweils klar, von wem die Information stammt.",
    recallPromptEn: "Report at least four current statements in Spanish, using different reporting verbs to make each source clear.",
    modelSummary: "Marta dice que está cansada, Luis afirma que desconoce la fecha, Ana explica que necesita tiempo y el informe señala que los resultados son positivos."
  },
  "b2-report-past-sequence": {
    title: "Lo que ocurrió antes, durante y después de la llamada",
    orientationDe: "Setze das vergangene Berichten als Referenzpunkt. Unterscheide gleichzeitig gültigen Zustand, davor abgeschlossenes Ereignis und aus damaliger Sicht zukünftige Handlung.",
    orientationEn: "Use the past report as reference point. Distinguish a simultaneous state, an earlier completed event, and an action future from that past viewpoint.",
    paragraphs: [
      "Ayer Marta llamó a Pablo y dijo que estaba cansada. Explicó que había perdido el tren por la mañana y que por eso había llegado tarde a la oficina. Esos hechos ocurrieron antes de la llamada, mientras que su cansancio existía en aquel momento.",
      "Antes de despedirse, Marta prometió que llamaría al día siguiente y añadió que sus compañeros ya habían terminado el informe. Pablo contó después que ella vivía lejos de la oficina y que el trayecto diario también explicaba su cansancio."
    ],
    questions: [
      { questionDe: "Welches Ereignis lag vor Martas Erklärung?", questionEn: "Which event happened before Marta's explanation?", optionsDe: ["Sie hatte den Zug verpasst", "Sie würde am nächsten Tag anrufen", "Pablo erzählte später davon"], optionsEn: ["She had missed the train", "She would call the next day", "Pablo later reported it"], correct: 0, explanationDe: "Había perdido ordnet den verpassten Zug zeitlich vor explicó ein und macht ihn zur früheren Ursache der Verspätung.", explanationEn: "Había perdido places the missed train before explicó and makes it the earlier cause of her delay." },
      { questionDe: "Warum steht llamaría im Condicional?", questionEn: "Why is llamaría in the conditional?", optionsDe: ["Der Anruf war aus Sicht des Versprechens noch zukünftig", "Der Anruf geschieht regelmäßig", "Llamar hat kein Futur"], optionsEn: ["The call was future from the promise's viewpoint", "The call happens regularly", "Llamar has no future"], correct: 0, explanationDe: "Prometió ist der vergangene Orientierungspunkt; der Anruf liegt danach und wird deshalb als futuro del pasado mit llamaría dargestellt.", explanationEn: "Prometió is the past orientation point; the call comes later and is expressed as future-in-the-past with llamaría." }
    ],
    recallPromptDe: "Erzähle Pablos Zusammenfassung auf Spanisch und markiere einen gleichzeitigen Zustand, zwei frühere Ereignisse und ein damals zukünftiges Versprechen.",
    recallPromptEn: "Retell Pablo's summary in Spanish, marking a simultaneous state, two earlier events, and one promise that was future at that time.",
    modelSummary: "Marta dijo que estaba cansada porque había perdido el tren y había llegado tarde; añadió que sus compañeros habían terminado y prometió que llamaría al día siguiente."
  },
  "b2-report-questions": {
    title: "Las preguntas que quedaron después de la reunión",
    inputMode: "listening",
    orientationDe: "Unterscheide Ja-Nein-Fragen mit si von Informationsfragen, die ihr Fragewort behalten. Im eingebetteten Satz gilt Aussagesatzstellung, nicht direkte Fragewortstellung.",
    orientationEn: "Distinguish yes-no questions with si from information questions that keep their question word. Embedded clauses use statement order, not direct-question order.",
    paragraphs: [
      "Después de la reunión, Clara explicó las dudas del equipo. Marta le había preguntado si tenía tiempo para revisar el informe. Luis quería saber dónde estaba la versión definitiva y Ana preguntó cuándo recibirían una respuesta.",
      "Clara añadió que no recordaba qué había dicho exactamente la directora sobre el presupuesto. También pidió a Pablo que explicara por qué había cambiado de opinión. Ninguna pregunta conserva signos de interrogación, pero si, dónde, cuándo, qué y por qué mantienen su función."
    ],
    questions: [
      { questionDe: "Welche berichtete Frage erwartet ursprünglich Ja oder Nein?", questionEn: "Which reported question originally expects yes or no?", optionsDe: ["Si tenía tiempo", "Dónde estaba la versión", "Cuándo recibirían respuesta"], optionsEn: ["Whether she had time", "Where the version was", "When they would receive a reply"], correct: 0, explanationDe: "Si leitet hier eine eingebettete Entscheidungsfrage ein. Die anderen Beispiele besitzen bereits ein eigenes Informationsfragewort.", explanationEn: "Si introduces an embedded yes-no question here. The other examples already contain their own information question word." },
      { questionDe: "Warum bleibt der Akzent in por qué erhalten?", questionEn: "Why does por qué retain its accent?", optionsDe: ["Es leitet weiterhin eine indirekte Frage ein", "Es bedeutet deshalb", "Es steht vor einem Nomen"], optionsEn: ["It still introduces an indirect question", "It means therefore", "It precedes a noun"], correct: 0, explanationDe: "Auch ohne Fragezeichen fragt por qué nach dem Grund. Es bleibt interrogativ und unterscheidet sich vom erklärenden porque.", explanationEn: "Even without question marks, por qué asks for a reason. It remains interrogative and differs from explanatory porque." }
    ],
    recallPromptDe: "Berichte auf Spanisch vier Fragen aus dem Gespräch: eine Ja-Nein-Frage und drei Informationsfragen mit unterschiedlichen Fragewörtern.",
    recallPromptEn: "Report four questions from the conversation in Spanish: one yes-no question and three information questions with different question words.",
    modelSummary: "Marta preguntó si Clara tenía tiempo, Luis quiso saber dónde estaba el informe, Ana preguntó cuándo responderían y Pablo debía explicar por qué había cambiado de opinión."
  },
  "b2-report-requests-commands": {
    title: "Las instrucciones que transmitió la coordinadora",
    orientationDe: "Erkenne Einfluss auf eine andere Person. Nach einem vergangenen Bitten, Empfehlen, Sagen oder Bestehen steht die gewünschte Handlung im Imperfecto de Subjuntivo.",
    orientationEn: "Recognize influence on another person. After past asking, recommending, telling, or insisting, the desired action uses the imperfect subjunctive.",
    paragraphs: [
      "La coordinadora habló con Elena antes del congreso. Le pidió que cerrara la oficina al salir y recomendó que descansara durante el viaje. También dijo a todo el equipo que no llegaran tarde a la primera sesión.",
      "Después, Ana sugirió que fueran juntos en tren y el profesor insistió en que revisaran la presentación una última vez. Al informar de estas palabras, nadie repite el imperativo original: los verbos de influencia en pasado crean un marco para cerrara, descansara, llegaran, fueran y revisaran."
    ],
    questions: [
      { questionDe: "Welche negative Anweisung erhielt das ganze Team?", questionEn: "Which negative instruction did the whole team receive?", optionsDe: ["Nicht zu spät zur ersten Sitzung kommen", "Nicht mit dem Zug fahren", "Die Präsentation nicht prüfen"], optionsEn: ["Not arrive late to the first session", "Not travel by train", "Not review the presentation"], correct: 0, explanationDe: "Dijo a todo el equipo que no llegaran tarde berichtet eine negative Anweisung mit no und Imperfecto de Subjuntivo.", explanationEn: "Dijo a todo el equipo que no llegaran tarde reports a negative instruction with no and the imperfect subjunctive." },
      { questionDe: "Was unterscheidet pidió que cerrara von dijo que cerró?", questionEn: "What distinguishes pidió que cerrara from dijo que cerró?", optionsDe: ["Ersteres beeinflusst eine gewünschte Handlung", "Ersteres behauptet eine abgeschlossene Tatsache", "Beide bedeuten exakt dasselbe"], optionsEn: ["The first influences a desired action", "The first asserts a completed fact", "Both mean exactly the same"], correct: 0, explanationDe: "Pedir que will eine Handlung der anderen Person auslösen; decir que plus Indicativo könnte dagegen Information als Aussage berichten.", explanationEn: "Pedir que seeks to cause another person's action; decir que plus indicative could instead report information as a statement." }
    ],
    recallPromptDe: "Gib auf Spanisch mindestens vier Bitten, Ratschläge oder Anweisungen aus dem Text als berichtete Rede mit passenden Einleitungsverben wieder.",
    recallPromptEn: "In Spanish, report at least four requests, recommendations, or instructions from the text using suitable introductory verbs.",
    modelSummary: "La coordinadora pidió que Elena cerrara la oficina, recomendó que descansara y dijo que no llegaran tarde; Ana sugirió que fueran en tren."
  },
  "b2-report-reference-shifts": {
    title: "Un mensaje contado al día siguiente desde otro lugar",
    inputMode: "listening",
    orientationDe: "Versetze dich in den neuen Sprechort und -zeitpunkt. Passe Person, Besitz, Nähe und Zeit nur dort an, wo die ursprünglichen Wörter sonst nicht mehr wahr wären.",
    orientationEn: "Move to the new place and time of reporting. Adjust person, possession, distance, and time only where the original words would no longer be true.",
    paragraphs: [
      "El lunes, desde su oficina, Ana dijo a Pablo: «Te llamaré mañana. Este es mi informe y aquí no hay buena cobertura». El miércoles, Pablo contó el mensaje desde otra ciudad y desde un momento posterior.",
      "Explicó que Ana había dicho que lo llamaría al día siguiente, que aquel era su informe y que allí no había buena cobertura. Añadió que ella había llegado dos días antes y que prometía volver la semana siguiente. Las referencias cambiaron con la perspectiva, no por una regla automática."
    ],
    questions: [
      { questionDe: "Warum wird mañana zu al día siguiente?", questionEn: "Why does mañana become al día siguiente?", optionsDe: ["Der Bericht erfolgt später als die Originalaussage", "Der Wochentag bleibt derselbe", "Ana spricht weiterhin direkt"], optionsEn: ["The report occurs later than the original statement", "The weekday remains the same", "Ana is still speaking directly"], correct: 0, explanationDe: "Mañana war relativ zum Montag. Beim späteren Bericht verankert al día siguiente den versprochenen Anruf weiterhin am Tag nach der Originalaussage.", explanationEn: "Mañana was relative to Monday. In the later report, al día siguiente keeps the promised call on the day after the original statement." },
      { questionDe: "Welche zwei räumlichen Ausdrücke verändern die Perspektive?", questionEn: "Which two spatial expressions change perspective?", optionsDe: ["Aquel und allí", "Mañana und antes", "Mi und lo"], optionsEn: ["Aquel and allí", "Mañana and antes", "Mi and lo"], correct: 0, explanationDe: "Este und aquí passten zu Anas ursprünglichem Ort; aus Pablos späterer Distanz werden daraus aquel und allí.", explanationEn: "Este and aquí matched Ana's original location; from Pablo's later distance they become aquel and allí." }
    ],
    recallPromptDe: "Berichte Anas ursprüngliche Nachricht auf Spanisch aus Pablos späterer Perspektive und passe Person, Ort, Besitz sowie mindestens zwei Zeitangaben an.",
    recallPromptEn: "Report Ana's original message in Spanish from Pablo's later viewpoint, adjusting person, place, possession, and at least two time references.",
    modelSummary: "Pablo contó que Ana lo llamaría al día siguiente, que aquel era su informe, que allí no había cobertura y que volvería la semana siguiente."
  },
  "checkpoint-b2-reported-speech": {
    title: "El resumen preciso de una conversación decisiva",
    orientationDe: "Rekonstruiere Quelle und Zeitachse, bevor du Formen veränderst: gleichzeitiger Zustand, frühere Information, spätere Zusage, eingebettete Frage, Bitte und verschobene Zeitangabe.",
    orientationEn: "Reconstruct source and timeline before changing forms: simultaneous state, earlier information, later promise, embedded question, request, and shifted time reference.",
    paragraphs: [
      "Laura llamó el martes y dijo que no podía asistir a la reunión. Explicó que había recibido nuevos datos aquella mañana y preguntó si podía enviarle el informe a la directora antes de que el equipo decidiera.",
      "También pidió que aplazaran la votación y prometió que los llamaría al día siguiente. Cuando Marcos resumió la conversación el jueves, mantuvo clara la relación entre lo que Laura sabía, lo que solicitaba y lo que todavía iba a hacer."
    ],
    questions: [
      { questionDe: "Welche Information lag zeitlich vor Lauras Erklärung?", questionEn: "Which information preceded Laura's explanation?", optionsDe: ["Sie hatte neue Daten erhalten", "Sie würde am Folgetag anrufen", "Das Team hatte sicher abgestimmt"], optionsEn: ["She had received new data", "She would call the next day", "The team had certainly voted"], correct: 0, explanationDe: "Había recibido markiert den Datenerhalt als früheres Ereignis relativ zu explicó und aquella mañana verankert ihn am Tag des Gesprächs.", explanationEn: "Había recibido marks receipt of the data as earlier than explicó, and aquella mañana anchors it to the day of the conversation." },
      { questionDe: "Welche Handlung wollte Laura beim Team auslösen?", questionEn: "Which action did Laura want the team to take?", optionsDe: ["Die Abstimmung verschieben", "Die neuen Daten ignorieren", "Sie am Dienstag anrufen"], optionsEn: ["Postpone the vote", "Ignore the new data", "Call her on Tuesday"], correct: 0, explanationDe: "Pidió que aplazaran verbindet Lauras vergangene Bitte mit der gewünschten Handlung des Teams im Imperfecto de Subjuntivo.", explanationEn: "Pidió que aplazaran links Laura's past request to the team's desired action in the imperfect subjunctive." }
    ],
    recallPromptDe: "Fasse das Gespräch auf Spanisch zusammen und erhalte Zustand, früheres Ereignis, indirekte Frage, Bitte, spätere Zusage und verschobene Zeitreferenzen korrekt.",
    recallPromptEn: "Summarize the conversation in Spanish, accurately preserving the state, earlier event, embedded question, request, later promise, and shifted time references.",
    modelSummary: "Laura dijo que no podía asistir, explicó que había recibido datos, preguntó si podía enviar el informe, pidió que aplazaran la votación y prometió que llamaría al día siguiente."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const existing = await prisma.lesson.findMany({
    where: { slug: { in: entries.map(([slug]) => slug) } },
    select: { slug: true }
  });
  if (existing.length !== entries.length) {
    throw new Error(`B2 discourse/reported input requires ${entries.length} lessons, found ${existing.length}.`);
  }
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({
      where: { slug },
      data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 22 : 18 }
    });
  }
  console.log(`Seeded connected input for ${entries.length} B2 discourse and reported-speech packages.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
