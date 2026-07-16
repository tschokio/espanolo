const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-clarify-work-assignment", title: "Clarify a Work Assignment Before Starting", order: 1311.1, imageKey: "grammar-scenes:9",
    summary: "Confirm purpose, expected result, scope, deadline, and the first priority instead of beginning with hidden assumptions.", situation: "receiving a new task from a colleague",
    sentences: [
      ["Antes de empezar, quiero confirmar el objetivo.", "Before starting, I want to confirm the objective.", "Confirming the objective prevents activity from replacing the intended result."],
      ["¿Qué resultado necesitas exactamente?", "What result do you need exactly?", "Qué resultado asks for the deliverable rather than only the general topic."],
      ["¿Debe incluir también los datos del mes pasado?", "Should it also include last month's data?", "También checks one uncertain boundary of the task."],
      ["La primera prioridad es preparar un resumen claro.", "The first priority is to prepare a clear summary.", "Primera prioridad makes the starting decision explicit."],
      ["Entonces, entregaré el borrador el jueves antes de las cuatro.", "So, I will deliver the draft on Thursday before four.", "The closing repeats deliverable and deadline as one shared plan."]
    ],
    readingJson: {
      title: "Un encargo claro antes de abrir el documento",
      inputMode: "listening",
      orientationDe: "Höre nicht nur das Thema des Auftrags. Trenne Zweck, erwartetes Ergebnis, Umfang, Frist und erste Priorität. Ziel ist eine kurze Rückbestätigung, mit der beide Personen vor Arbeitsbeginn dieselbe Aufgabe meinen.",
      orientationEn: "Do not listen only for the task topic. Separate purpose, expected result, scope, deadline, and first priority. End with a short confirmation that gives both people the same task before work begins.",
      paragraphs: [
        "Marta pide a Daniel un informe sobre las ventas. Daniel no empieza de inmediato. Primero pregunta qué resultado necesita Marta exactamente y si el informe debe incluir también los datos del mes pasado.",
        "Marta explica que la prioridad es un resumen claro de una página. Los datos antiguos no son necesarios. Daniel confirma que entregará un primer borrador el jueves antes de las cuatro para que Marta pueda revisarlo."
      ],
      questions: [
        { questionDe: "Welche Grenze des Auftrags klärt Daniel?", questionEn: "Which boundary of the task does Daniel clarify?", optionsDe: ["Ob Daten des Vormonats dazugehören", "Ob Marta im selben Gebäude arbeitet", "Ob das Dokument farbig gedruckt wird"], optionsEn: ["Whether last month's data is included", "Whether Marta works in the same building", "Whether the document is printed in color"], correct: 0, explanationDe: "Mit debe incluir también prüft Daniel genau einen unsicheren Bestandteil des Umfangs, bevor er Material sammelt.", explanationEn: "With debe incluir también, Daniel checks one uncertain part of the scope before collecting material." },
        { questionDe: "Was bestätigt Daniel am Ende gemeinsam?", questionEn: "What does Daniel confirm together at the end?", optionsDe: ["Einen ersten Entwurf und die Frist Donnerstag vor vier", "Nur das allgemeine Thema Verkauf", "Eine fertige Präsentation für heute"], optionsEn: ["A first draft and the deadline Thursday before four", "Only the general topic of sales", "A finished presentation for today"], correct: 0, explanationDe: "Entregaré el borrador und die konkrete Frist schließen die Abstimmung mit überprüfbarem Ergebnis und Zeitpunkt.", explanationEn: "Entregaré el borrador and the concrete deadline close the exchange with a verifiable result and time." }
      ],
      recallPromptDe: "Nimm auf Spanisch einen erfundenen Arbeitsauftrag entgegen: Ziel bestätigen, nach dem genauen Ergebnis fragen, eine Umfangsgrenze klären und Ergebnis plus Frist in einem Abschlusssatz wiederholen.",
      recallPromptEn: "Receive an invented work assignment in Spanish: confirm the objective, ask for the exact result, clarify one scope boundary, and restate deliverable plus deadline in a closing sentence.",
      modelSummary: "Daniel confirma el objetivo, pregunta por el resultado y el alcance, identifica la prioridad y acuerda entregar un borrador el jueves antes de las cuatro."
    }
  },
  {
    slug: "b1-report-progress-delay", title: "Report Progress, Delay, and Recovery", order: 1311.2, imageKey: "daily-actions:18",
    summary: "Give completed work, remaining work, cause of delay, current consequence, and a realistic recovery step.", situation: "updating a colleague before a deadline",
    sentences: [
      ["Ya he terminado la introducción y las tablas.", "I have already finished the introduction and the tables.", "Ya he terminado names verifiable completed work."],
      ["Todavía me falta comprobar dos cifras.", "I still need to check two figures.", "Todavía me falta separates remaining work from what is complete."],
      ["Me he retrasado porque el archivo llegó incompleto.", "I have fallen behind because the file arrived incomplete.", "The reason explains the delay without hiding the current state."],
      ["Puedo enviarte una versión parcial esta tarde.", "I can send you a partial version this afternoon.", "A partial version is a concrete intermediate option."],
      ["Para recuperar tiempo, revisaré las cifras con Ana mañana temprano.", "To make up time, I will review the figures with Ana early tomorrow.", "Para plus a future action creates a recovery plan."]
    ],
    readingJson: {
      title: "Un retraso comunicado antes de convertirse en sorpresa",
      orientationDe: "Ordne das Update in fünf Teile: erledigt, offen, Ursache, unmittelbare Folge und Wiederherstellungsplan. Eine Erklärung allein löst nichts; eine neue Zusage ohne realistische Grundlage schafft nur eine zweite Überraschung.",
      orientationEn: "Organize the update into five parts: completed, remaining, cause, immediate consequence, and recovery plan. An explanation alone solves nothing, while an unrealistic new promise creates another surprise.",
      paragraphs: [
        "Daniel avisa a Marta antes de la fecha límite. Ya ha terminado la introducción y las tablas, pero todavía le falta comprobar dos cifras porque el archivo principal llegó incompleto.",
        "No promete acabar todo esa tarde. Ofrece enviar una versión parcial y explica cómo recuperará tiempo: mañana temprano revisará las cifras con Ana. Marta puede decidir con información real, no con una sorpresa de última hora."
      ],
      questions: [
        { questionDe: "Was ist bereits überprüfbar erledigt?", questionEn: "What is already verifiably complete?", optionsDe: ["Einleitung und Tabellen", "Alle Zahlen und der Schluss", "Nur die E-Mail an Ana"], optionsEn: ["The introduction and tables", "All figures and the conclusion", "Only the email to Ana"], correct: 0, explanationDe: "Ya he terminado markiert zwei abgeschlossene Bestandteile; die zwei Zahlen werden ausdrücklich als noch offen getrennt.", explanationEn: "Ya he terminado marks two completed parts, while the two figures are explicitly separated as remaining." },
        { questionDe: "Warum ist Daniels neue Zusage glaubwürdig begrenzt?", questionEn: "Why is Daniel's new commitment credibly limited?", optionsDe: ["Er bietet heute eine Teilversion und morgen eine konkrete Prüfung an", "Er verspricht alles sofort ohne Plan", "Er verschweigt die unvollständige Datei"], optionsEn: ["He offers a partial version today and a concrete check tomorrow", "He promises everything immediately without a plan", "He hides the incomplete file"], correct: 0, explanationDe: "Teilversion und geplanter Prüfschritt trennen das heute Machbare vom noch nötigen Wiederherstellungsweg.", explanationEn: "The partial version and planned checking step separate what is possible today from the remaining recovery path." }
      ],
      recallPromptDe: "Gib auf Spanisch ein ehrliches Statusupdate: zwei erledigte Bestandteile, eine offene Aufgabe, einen konkreten Verzögerungsgrund, eine Teiloption und einen realistischen Schritt zum Aufholen.",
      recallPromptEn: "Give an honest status update in Spanish: two completed parts, one remaining task, a concrete reason for delay, a partial option, and a realistic recovery step.",
      modelSummary: "Daniel distingue lo terminado de lo pendiente, explica el archivo incompleto, ofrece una versión parcial y acuerda revisar las cifras con Ana para recuperar tiempo."
    }
  },
  {
    slug: "b1-negotiate-priorities-deadline", title: "Negotiate Priorities and a Feasible Deadline", order: 1311.3, imageKey: "weather-and-time:10",
    summary: "Expose competing work, ask who decides priority, show the consequence of each choice, and confirm the revised order and deadline.", situation: "receiving two urgent requests at the same time",
    sentences: [
      ["Tengo dos tareas urgentes para hoy.", "I have two urgent tasks for today.", "The opening makes the capacity conflict visible."],
      ["¿Cuál tiene más prioridad?", "Which one has higher priority?", "The question requests an explicit ranking rather than guessing."],
      ["Si termino el presupuesto primero, el informe estará mañana.", "If I finish the budget first, the report will be ready tomorrow.", "The real condition shows the consequence of one choice."],
      ["¿Podemos mover la fecha límite del informe?", "Can we move the report deadline?", "The request changes one constraint instead of silently missing it."],
      ["De acuerdo: hoy termino el presupuesto y mañana entrego el informe.", "Agreed: today I will finish the budget and tomorrow I will deliver the report.", "The closing confirms order and both time points."]
    ],
    readingJson: {
      title: "Dos urgencias no caben en el mismo primer lugar",
      inputMode: "listening",
      orientationDe: "Höre auf den Kapazitätskonflikt, die Entscheidungsfrage, die Folge jeder Priorität und den neu bestätigten Plan. Dringlichkeit wird nicht durch zwei gleichzeitige Versprechen gelöst, sondern durch eine sichtbare Reihenfolge.",
      orientationEn: "Listen for the capacity conflict, the decision question, the consequence of each priority, and the newly confirmed plan. Urgency is not solved with two simultaneous promises but with a visible order.",
      paragraphs: [
        "A Daniel le piden un presupuesto y un informe para hoy. Explica que las dos tareas son urgentes y pregunta cuál tiene más prioridad. No decide por su cuenta ni acepta dos plazos imposibles.",
        "Marta elige el presupuesto porque un cliente lo necesita esta tarde. Daniel explica la consecuencia: el informe estará mañana. Los dos aceptan mover esa fecha y repiten el orden final antes de terminar la conversación."
      ],
      questions: [
        { questionDe: "Wer entscheidet die höhere Priorität?", questionEn: "Who decides the higher priority?", optionsDe: ["Marta nach Daniels transparenter Rückfrage", "Daniel heimlich ohne Rückmeldung", "Der Kunde über die Farbe der Tabelle"], optionsEn: ["Marta after Daniel's transparent question", "Daniel secretly without feedback", "The client through the table color"], correct: 0, explanationDe: "Daniel macht den Konflikt sichtbar; Marta besitzt den Kontext, um den kundenrelevanten Haushalt zuerst einzuordnen.", explanationEn: "Daniel exposes the conflict; Marta has the context needed to rank the client-related budget first." },
        { questionDe: "Welche Folge wird ausdrücklich akzeptiert?", questionEn: "Which consequence is explicitly accepted?", optionsDe: ["Der Bericht wird auf morgen verschoben", "Beide Aufgaben entfallen", "Das Budget kommt nächste Woche"], optionsEn: ["The report moves to tomorrow", "Both tasks are canceled", "The budget arrives next week"], correct: 0, explanationDe: "Si termino el presupuesto primero verbindet die gewählte Priorität transparent mit der neuen Berichtsfrist.", explanationEn: "Si termino el presupuesto primero transparently connects the chosen priority with the new report deadline." }
      ],
      recallPromptDe: "Verhandle auf Spanisch zwei konkurrierende Aufgaben: Konflikt nennen, nach Priorität fragen, eine Folge mit si ausdrücken, eine Fristverschiebung erbitten und Reihenfolge plus Termine bestätigen.",
      recallPromptEn: "Negotiate two competing tasks in Spanish: name the conflict, ask for priority, express one consequence with si, request a moved deadline, and confirm order plus dates.",
      modelSummary: "Daniel presenta dos tareas urgentes, pide una prioridad explícita, explica la consecuencia y confirma que hoy hará el presupuesto y mañana entregará el informe."
    }
  },
  {
    slug: "b1-request-use-feedback", title: "Request, Clarify, and Use Feedback", order: 1311.4, imageKey: "conversation-and-opinion:9",
    summary: "Ask for focused feedback, separate strengths from changes, request an example when advice is vague, and state the revision you will make.", situation: "reviewing a draft with a colleague",
    sentences: [
      ["¿Podrías darme comentarios sobre la conclusión?", "Could you give me feedback on the conclusion?", "The request focuses attention on one part of the work."],
      ["Lo más claro es la comparación de los resultados.", "The clearest part is the comparison of the results.", "A concrete strength shows what should be preserved."],
      ["Conviene explicar mejor la causa del cambio.", "It would be useful to explain the cause of the change better.", "Conviene plus infinitive gives an actionable improvement without attacking the person."],
      ["¿Puedes mostrarme un ejemplo concreto?", "Can you show me a concrete example?", "An example repairs feedback that is still too general."],
      ["Voy a mantener la comparación y añadir una frase sobre la causa.", "I will keep the comparison and add a sentence about the cause.", "The response converts feedback into a specific revision decision."]
    ],
    readingJson: {
      title: "Comentarios que cambian el texto y no solo la impresión",
      orientationDe: "Trenne beizubehaltende Stärke, konkrete Änderung, Begründung oder Beispiel und eigene Revisionsentscheidung. Allgemeines gut oder unklar erzeugt noch keine Handlung; präzise Rückfragen machen Feedback verwendbar.",
      orientationEn: "Separate the strength to preserve, the concrete change, a reason or example, and your own revision decision. General good or unclear does not yet create action; focused questions make feedback usable.",
      paragraphs: [
        "Daniel pide comentarios específicamente sobre la conclusión. Marta señala primero una fortaleza: la comparación de los resultados es clara y debe mantenerse. Después identifica una mejora concreta: falta explicar la causa del cambio.",
        "Daniel no responde solo con gracias. Pide un ejemplo porque la recomendación todavía es general. Tras verlo, resume su decisión: conservará la comparación y añadirá una frase que conecte la causa con el resultado."
      ],
      questions: [
        { questionDe: "Was soll Daniel ausdrücklich beibehalten?", questionEn: "What should Daniel explicitly preserve?", optionsDe: ["Den klaren Ergebnisvergleich", "Jeden Satz unverändert", "Nur die Überschrift"], optionsEn: ["The clear comparison of results", "Every sentence unchanged", "Only the heading"], correct: 0, explanationDe: "Lo más claro benennt den Vergleich als Stärke; gutes Feedback schützt diese Funktion während der Überarbeitung.", explanationEn: "Lo más claro identifies the comparison as a strength; useful feedback protects that function during revision." },
        { questionDe: "Wie zeigt Daniel, dass er das Feedback in Handlung übersetzt?", questionEn: "How does Daniel show that he turns feedback into action?", optionsDe: ["Er nennt, was bleibt und welchen Satz er ergänzt", "Er sagt nur danke", "Er beginnt ein anderes Dokument"], optionsEn: ["He states what stays and which sentence he will add", "He only says thank you", "He starts a different document"], correct: 0, explanationDe: "Mantener und añadir bilden eine überprüfbare Revisionsentscheidung statt bloßer Zustimmung.", explanationEn: "Mantener and añadir form a verifiable revision decision rather than mere agreement." }
      ],
      recallPromptDe: "Führe auf Spanisch ein kurzes Feedbackgespräch: einen Bereich nennen, eine Stärke bewahren, eine konkrete Änderung empfehlen, nach einem Beispiel fragen und die eigene Überarbeitung zusammenfassen.",
      recallPromptEn: "Hold a short feedback exchange in Spanish: name one area, preserve a strength, recommend a concrete change, ask for an example, and summarize your revision.",
      modelSummary: "Daniel pide comentarios concretos, identifica una fortaleza y una mejora, solicita un ejemplo y decide mantener la comparación mientras añade una explicación de la causa."
    }
  },
  {
    slug: "b1-contribute-meeting-agreement", title: "Contribute, Qualify, and Close a Meeting Decision", order: 1311.5, imageKey: "conversation-and-opinion:10",
    summary: "Enter a discussion, connect agreement to a reason, raise one risk, propose an alternative, and summarize owner, action, and date.", situation: "participating in a short project meeting",
    sentences: [
      ["Quisiera añadir una idea.", "I would like to add an idea.", "The frame requests a turn without interrupting the topic."],
      ["Estoy de acuerdo porque reduce el tiempo de espera.", "I agree because it reduces the waiting time.", "Agreement plus reason contributes more than a bare sí."],
      ["Sin embargo, veo una dificultad con el presupuesto.", "However, I see one difficulty with the budget.", "The concern is limited to one concrete risk."],
      ["Propongo probarlo primero con un grupo pequeño.", "I propose testing it first with a small group.", "A proposal answers the concern with a workable next step."],
      ["Entonces, Ana organizará la prueba y revisaremos los resultados el lunes.", "So, Ana will organize the test and we will review the results on Monday.", "The summary names owner, action, and review date."]
    ],
    readingJson: {
      title: "De una opinión en la reunión a una decisión comprobable",
      inputMode: "listening",
      orientationDe: "Folge der Gesprächsbewegung: Wortbeitrag öffnen, Zustimmung begründen, Risiko begrenzen, Alternative anbieten und Entscheidung mit Verantwortlicher sowie Termin schließen. Ein gutes Treffen endet nicht bei interessanten Meinungen.",
      orientationEn: "Follow the meeting moves: open a contribution, justify agreement, bound a risk, offer an alternative, and close with an owner and date. A useful meeting does not end with interesting opinions alone.",
      paragraphs: [
        "El equipo quiere cambiar el proceso de atención. Daniel está de acuerdo porque la propuesta puede reducir el tiempo de espera. Sin embargo, señala que aplicarla a todos los clientes de inmediato costaría demasiado.",
        "En lugar de bloquear la idea, propone una prueba con un grupo pequeño. El equipo acepta. Antes de pasar al siguiente tema, Marta resume que Ana organizará la prueba y que todos revisarán los resultados el lunes."
      ],
      questions: [
        { questionDe: "Welche Funktion hat Daniels Einwand?", questionEn: "What function does Daniel's concern serve?", optionsDe: ["Er begrenzt das finanzielle Risiko, ohne die Idee abzulehnen", "Er beendet das Treffen sofort", "Er ändert das Thema zum Urlaub"], optionsEn: ["It limits the financial risk without rejecting the idea", "It ends the meeting immediately", "It changes the topic to vacation"], correct: 0, explanationDe: "Sin embargo markiert ein konkretes Budgetproblem; der anschließende Test hält das gemeinsame Ziel bestehen.", explanationEn: "Sin embargo marks a concrete budget problem; the following test preserves the shared objective." },
        { questionDe: "Woran erkennt man die vollständige Entscheidung?", questionEn: "What makes the decision complete?", optionsDe: ["Ana übernimmt die Probe und Montag ist der Prüftermin", "Alle finden die Idee interessant", "Daniel hat gesprochen"], optionsEn: ["Ana owns the test and Monday is the review date", "Everyone finds the idea interesting", "Daniel has spoken"], correct: 0, explanationDe: "Person, Handlung und Termin machen aus der Zustimmung einen überprüfbaren nächsten Schritt.", explanationEn: "Person, action, and date turn agreement into a verifiable next step." }
      ],
      recallPromptDe: "Leiste auf Spanisch einen vollständigen Besprechungsbeitrag: Wort erbitten, Zustimmung begründen, ein begrenztes Risiko nennen, einen Test vorschlagen und Person, Handlung sowie Termin zusammenfassen.",
      recallPromptEn: "Make a complete meeting contribution in Spanish: request the floor, justify agreement, name one bounded risk, propose a test, and summarize person, action, and date.",
      modelSummary: "Daniel apoya la propuesta con una razón, señala un riesgo de presupuesto, propone una prueba pequeña y el equipo acuerda responsable, acción y fecha de revisión."
    }
  },
  {
    slug: "b1-repair-work-misunderstanding", title: "Repair a Workplace Misunderstanding Without Blame", order: 1311.6, imageKey: "communication-repair:15",
    summary: "Name the mismatch, state your earlier interpretation, acknowledge impact, agree the corrected expectation, and create a prevention rule.", situation: "repairing different interpretations of a deadline",
    sentences: [
      ["Creo que ha habido un malentendido con la fecha.", "I think there has been a misunderstanding about the date.", "The opening names the shared problem without assigning a motive."],
      ["Yo entendí que el borrador era para el viernes.", "I understood that the draft was due Friday.", "Yo entendí presents the speaker's interpretation as one perspective."],
      ["No era mi intención retrasar tu trabajo.", "It was not my intention to delay your work.", "The sentence acknowledges impact without denying responsibility for repair."],
      ["Ahora necesitamos la versión completa el jueves a mediodía.", "Now we need the complete version on Thursday at noon.", "The corrected expectation contains deliverable and exact time."],
      ["A partir de ahora, confirmaremos las fechas por escrito.", "From now on, we will confirm deadlines in writing.", "The prevention rule changes the process that allowed ambiguity."]
    ],
    readingJson: {
      title: "Reparar la interpretación y también el proceso",
      orientationDe: "Unterscheide beobachtete Abweichung, frühere Interpretation, Wirkung, korrigierte Erwartung und Prävention. Schuldzuweisung erklärt selten, welcher Stand jetzt gilt oder wie derselbe Fehler künftig verhindert wird.",
      orientationEn: "Separate the observed mismatch, earlier interpretation, impact, corrected expectation, and prevention. Blame rarely explains what now applies or how to prevent the same error.",
      paragraphs: [
        "Marta esperaba la versión completa el jueves, pero Daniel había anotado el viernes y pensaba que el jueves solo debía enviar unas tablas. Los dos reconocen que usaron la palabra entrega para resultados diferentes.",
        "Daniel explica su interpretación y reconoce que el retraso afecta al trabajo de Marta. Después confirman la nueva expectativa: versión completa el jueves a mediodía. Para evitar otro problema, acordarán las próximas fechas por escrito."
      ],
      questions: [
        { questionDe: "Was verursachte die unterschiedliche Interpretation?", questionEn: "What caused the different interpretations?", optionsDe: ["Dass entrega für zwei unterschiedliche Ergebnisse verwendet wurde", "Dass Daniel kein Spanisch spricht", "Dass der Kunde das Projekt beendet hat"], optionsEn: ["Entrega was used for two different results", "Daniel does not speak Spanish", "The client ended the project"], correct: 0, explanationDe: "Der Text lokalisiert die Mehrdeutigkeit beim erwarteten Ergebnis und vermeidet eine unbelegte Absichtszuschreibung.", explanationEn: "The text locates the ambiguity in the expected result and avoids attributing an unsupported intention." },
        { questionDe: "Welche Prävention vereinbaren beide?", questionEn: "Which prevention step do they agree?", optionsDe: ["Künftige Fristen schriftlich bestätigen", "Nie wieder miteinander sprechen", "Jede Aufgabe einen Monat verschieben"], optionsEn: ["Confirm future deadlines in writing", "Never speak to each other again", "Delay every task by a month"], correct: 0, explanationDe: "A partir de ahora verändert die gemeinsame Bestätigungspraxis, durch die die Mehrdeutigkeit künftig sichtbar wird.", explanationEn: "A partir de ahora changes the shared confirmation practice so future ambiguity becomes visible." }
      ],
      recallPromptDe: "Repariere auf Spanisch ein Missverständnis: Problem neutral benennen, eigene frühere Interpretation erklären, Wirkung anerkennen, neues Ergebnis mit exakter Frist bestätigen und eine Präventionsregel vereinbaren.",
      recallPromptEn: "Repair a misunderstanding in Spanish: name the problem neutrally, explain your earlier interpretation, acknowledge impact, confirm the new result with an exact deadline, and agree a prevention rule.",
      modelSummary: "Marta y Daniel comparan sus interpretaciones, reconocen el efecto, fijan la versión completa para el jueves y acuerdan confirmar las próximas fechas por escrito."
    }
  },
  {
    slug: "checkpoint-b1-workplace-collaboration", title: "Checkpoint: Coordinate a Work Task from Brief to Repair", order: 1311.7, imageKey: "conversation-and-opinion:16", checkpoint: true,
    summary: "Independently clarify a brief, report a delay, negotiate priority, use feedback, close a meeting decision, and repair one misunderstanding.", situation: "coordinating a small project through changing constraints",
    sentences: [
      ["Antes de empezar, confirmemos el resultado y la fecha límite.", "Before starting, let us confirm the result and the deadline.", "The opening aligns deliverable and date."],
      ["Ya he terminado el análisis, pero todavía me falta la conclusión.", "I have finished the analysis, but I still need to complete the conclusion.", "The update separates completed and remaining work."],
      ["Si la presentación tiene prioridad, entregaré el informe mañana.", "If the presentation has priority, I will deliver the report tomorrow.", "The condition exposes the cost of the priority choice."],
      ["Conviene añadir un ejemplo; voy a incluirlo en la segunda página.", "It would be useful to add an example; I will include it on the second page.", "Feedback is converted into a revision action."],
      ["Entonces, Lucía preparará la presentación y la revisaremos a las tres.", "So, Lucía will prepare the presentation and we will review it at three.", "The decision names owner, action, and time."],
      ["Ha habido un malentendido; confirmemos por escrito qué versión necesitamos.", "There has been a misunderstanding; let us confirm in writing which version we need.", "The repair aligns the current deliverable and improves the process."]
    ],
    readingJson: {
      title: "Un proyecto pequeño con decisiones visibles de principio a fin",
      inputMode: "listening",
      orientationDe: "Übertrage die gesamte Handlungskette: Auftrag abgrenzen, echten Status melden, konkurrierende Prioritäten mit Folgen verhandeln, Feedback in Änderung übersetzen, Entscheidung schließen und eine Abweichung ohne Schuldzuweisung reparieren.",
      orientationEn: "Transfer the complete action chain: bound the brief, report real status, negotiate competing priorities with consequences, turn feedback into revision, close a decision, and repair a mismatch without blame.",
      paragraphs: [
        "Lucía y Daniel preparan una presentación y un informe. Primero confirman qué resultado necesita cada documento. Daniel ha terminado el análisis, pero no la conclusión, así que dan prioridad a la presentación y mueven el informe a mañana.",
        "Lucía sugiere añadir un ejemplo concreto y Daniel explica dónde lo incluirá. Más tarde descubren que esperaban versiones diferentes del archivo. Identifican el malentendido, confirman por escrito la versión necesaria y acuerdan revisar juntos la presentación a las tres."
      ],
      questions: [
        { questionDe: "Welche Folge hat die gewählte Priorität?", questionEn: "What consequence follows from the chosen priority?", optionsDe: ["Der Bericht wird morgen geliefert", "Die Präsentation wird abgesagt", "Die Analyse wird gelöscht"], optionsEn: ["The report will be delivered tomorrow", "The presentation is canceled", "The analysis is deleted"], correct: 0, explanationDe: "Die Präsentation erhält den ersten Platz; der Bericht wird als sichtbare und akzeptierte Folge auf morgen verschoben.", explanationEn: "The presentation takes first place; the report moves to tomorrow as a visible and accepted consequence." },
        { questionDe: "Wie schließen beide die reparierte Zusammenarbeit?", questionEn: "How do they close the repaired collaboration?", optionsDe: ["Benötigte Version schriftlich bestätigen und um drei gemeinsam prüfen", "Nur feststellen, dass jemand schuld ist", "Ohne neue Vereinbarung weiterarbeiten"], optionsEn: ["Confirm the needed version in writing and review together at three", "Only decide that someone is to blame", "Continue without a new agreement"], correct: 0, explanationDe: "Schriftliche Version und gemeinsamer Prüftermin reparieren sowohl den aktuellen Stand als auch den nächsten Kontrollpunkt.", explanationEn: "The written version and shared review time repair both the current state and the next control point." }
      ],
      recallPromptDe: "Koordiniere auf Spanisch ein neues Miniprojekt ohne Vorlage: Ergebnis und Frist klären, Status mit offenem Teil melden, Priorität samt Folge aushandeln, Feedback anwenden, Verantwortliche plus Prüftermin nennen und eine Versionsverwechslung schriftlich reparieren.",
      recallPromptEn: "Coordinate a new mini-project in Spanish without a model: clarify result and deadline, report status with a remaining part, negotiate priority and consequence, apply feedback, name owner plus review time, and repair a version mismatch in writing.",
      modelSummary: "Lucía y Daniel aclaran resultados, priorizan la presentación, aplazan el informe con transparencia, aplican un comentario, asignan la revisión y reparan por escrito una confusión de versiones."
    }
  }
];

const vocabulary = [
  ["el encargo", "assignment or brief", "noun", "masculine", "Antes de empezar, aclaro el encargo."],
  ["el objetivo", "objective", "noun", "masculine", "Confirmamos el objetivo."],
  ["el resultado esperado", "expected result", "phrase", "masculine", "¿Cuál es el resultado esperado?"],
  ["el alcance", "scope", "noun", "masculine", "Debemos aclarar el alcance."],
  ["el borrador", "draft", "noun", "masculine", "Entregaré el borrador el jueves."],
  ["la prioridad", "priority", "noun", "feminine", "¿Cuál tiene más prioridad?"],
  ["informar del progreso", "to report progress", "phrase", null, "Voy a informar del progreso."],
  ["estar pendiente", "to remain outstanding", "phrase", null, "La conclusión está pendiente."],
  ["retrasarse", "to fall behind", "verb", null, "Me he retrasado un día."],
  ["una versión parcial", "a partial version", "phrase", "feminine", "Puedo enviar una versión parcial."],
  ["recuperar tiempo", "to make up time", "phrase", null, "Necesitamos recuperar tiempo."],
  ["la fecha límite", "deadline", "phrase", "feminine", "Movemos la fecha límite."],
  ["los comentarios", "feedback or comments", "noun", "masculine", "Gracias por los comentarios."],
  ["una fortaleza", "a strength", "noun", "feminine", "La comparación es una fortaleza."],
  ["una mejora", "an improvement", "noun", "feminine", "Propone una mejora concreta."],
  ["revisar un texto", "to revise a text", "phrase", null, "Voy a revisar el texto."],
  ["añadir una idea", "to add an idea", "phrase", null, "Quisiera añadir una idea."],
  ["plantear una dificultad", "to raise a difficulty", "phrase", null, "Daniel plantea una dificultad."],
  ["proponer una prueba", "to propose a trial", "phrase", null, "Propongo una prueba pequeña."],
  ["la persona responsable", "person responsible", "phrase", "feminine", "Ana es la persona responsable."],
  ["llegar a un acuerdo", "to reach an agreement", "phrase", null, "El equipo llega a un acuerdo."],
  ["el malentendido", "misunderstanding", "noun", "masculine", "Ha habido un malentendido."],
  ["la interpretación", "interpretation", "noun", "feminine", "Explico mi interpretación."],
  ["por escrito", "in writing", "phrase", null, "Confirmamos la fecha por escrito."]
];

const normalize = (value) => String(value || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñü]+/g, " ").trim();
const accepted = (value) => [...new Set([value, normalize(value), `${normalize(value)}.`, `${normalize(value)}?`, `${normalize(value)}!`])];
const tokenize = (value) => String(value || "").match(/[¿¡]?[^\s.,;:!?]+|[.,;:!?]/g) || [];

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
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "workplace_coordination_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "workplace_coordination_step", rubric: "Retrieve the lesson's Spanish workplace model accurately before the checkpoint transfer." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the Spanish turn that performs the current coordination task" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the next Spanish coordination turn" : "Continue the workplace task in clear Spanish",
    instruction: "Identify the current function first: clarify, report, prioritize, request feedback, contribute, close, or repair. Include the decisive result, responsibility, or deadline.",
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
    where: { slug: "workplace-collaboration-coordination" },
    update: { title: "Workplace Collaboration and Coordination", description: "Clarifying assignments, reporting progress, negotiating priority, using feedback, closing meeting decisions, and repairing misunderstandings.", cefrLevel: "B1", imageKey: "grammar-scenes:9" },
    create: { slug: "workplace-collaboration-coordination", title: "Workplace Collaboration and Coordination", description: "Clarifying assignments, reporting progress, negotiating priority, using feedback, closing meeting decisions, and repairing misunderstandings.", cefrLevel: "B1", imageKey: "grammar-scenes:9" }
  });
  const vocabularyGroup = await prisma.vocabularyGroup.upsert({
    where: { slug: "b1-workplace-collaboration" },
    update: { title: "B1 Workplace Collaboration", description: "Reusable chunks for coordinating work, progress, priorities, feedback, decisions, and misunderstandings.", situation: "completing a shared task with visible expectations", imageKey: "grammar-scenes:9" },
    create: { slug: "b1-workplace-collaboration", title: "B1 Workplace Collaboration", description: "Reusable chunks for coordinating work, progress, priorities, feedback, decisions, and misunderstandings.", situation: "completing a shared task with visible expectations", imageKey: "grammar-scenes:9" }
  });
  for (const [spanish, english, partOfSpeech, gender, example] of vocabulary) {
    const existing = await prisma.word.findFirst({ where: { groupId: vocabularyGroup.id, spanish } });
    const data = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: vocabularyGroup.id };
    if (existing) await prisma.word.update({ where: { id: existing.id }, data });
    else await prisma.word.create({ data });
  }
  const supportingGroups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["b1-conversation-stories", "b1-plans-reactions", "b1-por-para-context"] } } });
  const groups = [vocabularyGroup, ...supportingGroups];
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Workplace Collaboration", situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: ["You can make task expectations, priorities, progress, and deadlines explicit.", "You can request and apply feedback while contributing constructively to a decision.", "You can repair a professional misunderstanding and confirm a shared prevention step."],
      conceptKeys: ["b1", "workplace-collaboration", "coordination", input.slug], reviewSummary: input.summary, readingJson: input.readingJson,
      order: input.order, estimatedMinutes: input.checkpoint ? 22 : 18, topicId: topic.id
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
  console.log(`Seeded ${lessons.length} B1.9 workplace-collaboration learning packages and ${vocabulary.length} aligned vocabulary items.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons, vocabulary };
