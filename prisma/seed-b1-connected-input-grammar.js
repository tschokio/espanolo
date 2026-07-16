const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "b1-future-intentions": {
    title: "Tres futuros en una sola semana",
    inputMode: "listening",
    orientationDe: "Höre, welche Zukunft schon fest im Kalender steht, welche gerade beabsichtigt ist und welche nur als weitere Aussicht erscheint.",
    orientationEn: "Listen for which future event is scheduled, which is a current intention, and which is only a broader prospect.",
    paragraphs: [
      "Esta semana Clara tiene varios planes. El lunes trabaja desde casa y la reunión del martes empieza a las nueve; las dos actividades ya están en su calendario. Esta tarde va a llamar a Marta para preparar la reunión.",
      "Clara también piensa en cambios más lejanos. Cree que el próximo año viajará más por trabajo, pero todavía no conoce las fechas. Está segura de que todo saldrá bien si organiza cada paso con tiempo."
    ],
    questions: [
      { questionDe: "Welche Handlung ist eine gegenwärtige Absicht?", questionEn: "Which action is a current intention?", optionsDe: ["Marta heute Nachmittag anrufen", "Am Montag nach Kalender zu Hause arbeiten", "Nächstes Jahr wahrscheinlich mehr reisen"], optionsEn: ["Call Marta this afternoon", "Work from home on Monday as scheduled", "Probably travel more next year"], correct: 0, explanationDe: "Va a llamar zeigt einen bereits bestehenden Vorsatz; Kalendertermine stehen im Präsens und die weitere Aussicht im einfachen Futur.", explanationEn: "Va a llamar marks a current intention; scheduled events use the present and the broader prospect uses the simple future." },
      { questionDe: "Warum steht viajará im einfachen Futur?", questionEn: "Why is viajará in the simple future?", optionsDe: ["Es ist eine weitere Aussicht ohne konkrete Termine", "Die Reise geschieht gerade", "Es handelt sich um eine tägliche Gewohnheit"], optionsEn: ["It is a broader prospect without set dates", "The trip is happening now", "It is a daily habit"], correct: 0, explanationDe: "Der Text grenzt die Aussage ausdrücklich von festen Daten ab und präsentiert sie als längerfristige Erwartung.", explanationEn: "The text explicitly separates the statement from fixed dates and presents it as a longer-term expectation." }
    ],
    recallPromptDe: "Nenne auf Spanisch einen festen Termin, eine Absicht und eine längerfristige Erwartung aus Claras Woche.",
    recallPromptEn: "State one scheduled event, one intention, and one longer-term expectation from Clara's week in Spanish.",
    modelSummary: "Clara trabaja desde casa el lunes, va a llamar a Marta esta tarde y cree que el próximo año viajará más."
  },
  "b1-regular-future": {
    title: "Los compromisos del nuevo equipo",
    orientationDe: "Suche in jedem Versprechen den vollständigen Infinitiv und die Endung, die zeigt, wer handeln wird.",
    orientationEn: "In each promise, find the complete infinitive and the ending that shows who will act.",
    paragraphs: [
      "El nuevo equipo prepara una presentación importante. Marta hablará con la directora y después escribirá la introducción. Pablo y yo comeremos temprano para poder revisar las diapositivas antes de la reunión.",
      "Los compañeros de otra ciudad vivirán cerca de la oficina durante esa semana. Antes de terminar, Marta pregunta a Pablo: «¿Estudiarás también las preguntas del público?». Él promete que responderá a todas."
    ],
    questions: [
      { questionDe: "Wer wird früh essen?", questionEn: "Who will eat early?", optionsDe: ["Pablo und die erzählende Person", "Nur Marta", "Die Kollegen aus der anderen Stadt"], optionsEn: ["Pablo and the narrator", "Only Marta", "The colleagues from the other city"], correct: 0, explanationDe: "Comeremos trägt die nosotros-Endung und das ausdrücklich genannte Pablo y yo bestätigt die handelnde Gruppe.", explanationEn: "Comeremos carries the nosotros ending and the explicit Pablo y yo confirms the acting group." },
      { questionDe: "Welche Aufgabe übernimmt Marta zuerst?", questionEn: "Which task does Marta take on first?", optionsDe: ["Mit der Direktorin sprechen", "Die Publikumsfragen beantworten", "In der Nähe des Büros wohnen"], optionsEn: ["Speak with the director", "Answer the audience's questions", "Live near the office"], correct: 0, explanationDe: "Hablará bezeichnet ihre erste zugesagte Handlung; escribirá folgt ausdrücklich danach.", explanationEn: "Hablará names her first promised action; escribirá explicitly follows afterward." }
    ],
    recallPromptDe: "Fasse auf Spanisch mit mindestens zwei verschiedenen Personenformen zusammen, wer welche Aufgabe übernehmen wird.",
    recallPromptEn: "Summarize in Spanish who will do which task using at least two different person endings.",
    modelSummary: "Marta hablará con la directora, nosotros comeremos temprano y los demás compañeros vivirán cerca de la oficina."
  },
  "b1-irregular-future": {
    title: "Un proyecto difícil, pero posible",
    orientationDe: "Achte auf die veränderten Futurstämme und trenne sie von den regelmäßigen Personenendungen.",
    orientationEn: "Notice the changed future stems and keep them separate from the regular person endings.",
    paragraphs: [
      "Mañana tendré más tiempo para el proyecto y podré revisar los últimos datos. Julia vendrá después del trabajo para comprobar los gráficos conmigo.",
      "Mientras tanto, los diseñadores harán una nueva portada y el director nos dirá si necesita algún cambio. Si todos cumplen su parte, podremos terminar antes del viernes."
    ],
    questions: [
      { questionDe: "Welche Aufgabe wird Julia übernehmen?", questionEn: "Which task will Julia take on?", optionsDe: ["Nach der Arbeit kommen und die Grafiken prüfen", "Eine neue Titelseite gestalten", "Dem Team die Entscheidung mitteilen"], optionsEn: ["Come after work and check the charts", "Design a new cover", "Tell the team the decision"], correct: 0, explanationDe: "Vendrá bezeichnet Julias Ankunft; der anschließende Infinitiv comprobar nennt den Zweck.", explanationEn: "Vendrá marks Julia's arrival and the following infinitive comprobar gives its purpose." },
      { questionDe: "Welche Aussage betrifft das gesamte Team?", questionEn: "Which statement concerns the whole team?", optionsDe: ["Es wird das Projekt vor Freitag beenden können", "Es wird nur die Grafiken ansehen", "Es wird keinen Direktor haben"], optionsEn: ["It will be able to finish before Friday", "It will only look at the charts", "It will have no director"], correct: 0, explanationDe: "Podremos trägt die nosotros-Endung und fasst das mögliche gemeinsame Ergebnis aller Beiträge zusammen.", explanationEn: "Podremos carries the nosotros ending and summarizes the possible shared result of everyone's contributions." }
    ],
    recallPromptDe: "Nenne auf Spanisch drei zukünftige Beiträge zum Projekt und verwende dabei mindestens zwei unregelmäßige Futurstämme.",
    recallPromptEn: "State three future contributions to the project in Spanish using at least two irregular future stems.",
    modelSummary: "Tendré tiempo para revisar los datos, Julia vendrá a comprobarlos y los diseñadores harán una portada nueva."
  },
  "b1-future-probability": {
    title: "¿Dónde estará Ana esta noche?",
    inputMode: "listening",
    orientationDe: "Höre, welche Aussagen sichere Beobachtungen sind und welche mit dem Futur nur eine vorsichtige Vermutung über die Gegenwart ausdrücken.",
    orientationEn: "Listen for which statements are certain observations and which use the future only as a cautious guess about the present.",
    paragraphs: [
      "Ana no responde al teléfono y todavía no ha llegado al café. Luis mira el reloj y dice: «Serán las ocho, más o menos. ¿Dónde estará ahora?».",
      "Marta recuerda que Ana tenía mucho trabajo. Piensa que estará todavía en la oficina o que no responderá porque está hablando con un cliente. Nadie sabe la razón exacta."
    ],
    questions: [
      { questionDe: "Welche Information ist sicher beobachtet?", questionEn: "Which information is directly observed?", optionsDe: ["Ana antwortet nicht und ist noch nicht im Café", "Ana ist sicher im Büro", "Ana spricht sicher mit einem Kunden"], optionsEn: ["Ana is not answering and has not reached the café", "Ana is definitely at the office", "Ana is definitely speaking with a client"], correct: 0, explanationDe: "Nur Ausbleiben und fehlende Antwort werden direkt festgestellt; Büro und Kundengespräch bleiben Erklärungsversuche.", explanationEn: "Only her absence and lack of response are directly observed; the office and client call remain attempted explanations." },
      { questionDe: "Welche Funktion hat estará in diesem Dialog?", questionEn: "What is the function of estará in this dialogue?", optionsDe: ["Eine Vermutung über Anas aktuellen Ort", "Ein fester Termin für morgen", "Eine Aufforderung an Ana"], optionsEn: ["A guess about Ana's current location", "A fixed appointment for tomorrow", "A command to Ana"], correct: 0, explanationDe: "Ahora und todavía verankern die Situation in der Gegenwart; das Futur markiert die Unsicherheit der Sprecher.", explanationEn: "Ahora and todavía anchor the situation in the present; the future marks the speakers' uncertainty." }
    ],
    recallPromptDe: "Formuliere auf Spanisch eine Beobachtung und zwei ausdrücklich unsichere Erklärungen für Anas Verspätung.",
    recallPromptEn: "State one observation and two explicitly uncertain explanations for Ana's delay in Spanish.",
    modelSummary: "Ana no responde; estará todavía en la oficina o no responderá porque está con un cliente."
  },
  "b1-real-conditions": {
    title: "Una excursión con un plan B",
    orientationDe: "Ordne jeder realistischen Bedingung ihre konkrete Folge, Absicht oder Aufforderung zu.",
    orientationEn: "Match each realistic condition to its concrete result, intention, or instruction.",
    paragraphs: [
      "El grupo quiere caminar hasta un lago el sábado. Si hace buen tiempo, irán a pie desde el pueblo. Si llueve mucho, se quedarán en el centro y visitarán el museo.",
      "Marta llevará comida si termina de trabajar temprano. Luis recuerda a todos: «Si no entendéis el mensaje con la hora, preguntad antes de salir». Así nadie tendrá que adivinar el plan."
    ],
    questions: [
      { questionDe: "Was geschieht bei starkem Regen?", questionEn: "What happens if it rains heavily?", optionsDe: ["Die Gruppe bleibt im Zentrum und besucht das Museum", "Alle gehen trotzdem zum See", "Marta beendet ihre Arbeit später"], optionsEn: ["The group stays downtown and visits the museum", "Everyone still walks to the lake", "Marta finishes work later"], correct: 0, explanationDe: "Die si-Bedingung und die beiden Futurfolgen bilden den ausdrücklich genannten Plan B.", explanationEn: "The si condition and the two future results form the explicitly stated backup plan." },
      { questionDe: "Welche Bedingung führt zu einer Aufforderung?", questionEn: "Which condition leads to an instruction?", optionsDe: ["Wenn jemand die Nachricht nicht versteht", "Wenn das Wetter gut ist", "Wenn Marta früh fertig wird"], optionsEn: ["If someone does not understand the message", "If the weather is good", "If Marta finishes early"], correct: 0, explanationDe: "Pregunta beziehungsweise preguntad ist die praktische Reaktion auf fehlendes Verständnis.", explanationEn: "Pregunta or preguntad is the practical response to not understanding." }
    ],
    recallPromptDe: "Gib auf Spanisch den Plan für gutes Wetter, den Plan B und eine praktische si-Aufforderung wieder.",
    recallPromptEn: "Restate the good-weather plan, the backup plan, and one practical si instruction in Spanish.",
    modelSummary: "Si hace buen tiempo, el grupo irá al lago; si llueve, visitará el museo, y si alguien no entiende el horario, debe preguntar."
  },
  "checkpoint-b1-future-conditions": {
    title: "La presentación del viernes",
    inputMode: "listening",
    orientationDe: "Unterscheide Kalendertermine, Absichten, spätere Handlungen, Gegenwartsvermutungen und reale Bedingungen ohne Formhinweise.",
    orientationEn: "Distinguish scheduled events, intentions, later actions, present guesses, and real conditions without form hints.",
    paragraphs: [
      "La presentación empieza el viernes a las diez. Mañana el equipo va a revisar el plan y después hablará con la directora. Marta no participa en la llamada de hoy; estará en otra reunión.",
      "Si aparece un problema con los datos, lo resolverán juntos. Julia dice que tendrá una respuesta antes del jueves y que podrá enviar la versión final esa misma tarde."
    ],
    questions: [
      { questionDe: "Welche Aussage ist ein feststehender Termin?", questionEn: "Which statement is a scheduled event?", optionsDe: ["Die Präsentation beginnt Freitag um zehn", "Marta ist wahrscheinlich in einer anderen Besprechung", "Julia wird eine Antwort haben"], optionsEn: ["The presentation starts Friday at ten", "Marta is probably in another meeting", "Julia will have an answer"], correct: 0, explanationDe: "Der genaue Kalenderzeitpunkt wird natürlich im Präsens ausgedrückt.", explanationEn: "The precise scheduled time is naturally expressed in the present." },
      { questionDe: "Was ist eine Vermutung über die Gegenwart?", questionEn: "What is a guess about the present?", optionsDe: ["Marta wird wohl in einer anderen Besprechung sein", "Das Team prüft morgen den Plan", "Bei Problemen arbeitet das Team zusammen"], optionsEn: ["Marta is probably in another meeting", "The team reviews the plan tomorrow", "The team works together if problems arise"], correct: 0, explanationDe: "Estará erklärt Martas aktuelle Abwesenheit vorsichtig; der Text behauptet ihren Ort nicht als sichere Tatsache.", explanationEn: "Estará cautiously explains Marta's current absence; the text does not claim her location as certain." }
    ],
    recallPromptDe: "Fasse auf Spanisch Termin, morgige Absicht, eine Vermutung und den Plan bei Problemen zusammen.",
    recallPromptEn: "Summarize the schedule, tomorrow's intention, one guess, and the problem plan in Spanish.",
    modelSummary: "La presentación empieza el viernes. Mañana revisarán el plan y, si hay un problema, lo resolverán juntos; Marta estará ahora en otra reunión."
  },
  "b1-subjunctive-meaning": {
    title: "Lo que la familia quiere para Leo",
    inputMode: "listening",
    orientationDe: "Höre zuerst auf den Rahmen vor que: Wunsch, Bewertung, Gefühl, positive Überzeugung oder verneinter Glaube.",
    orientationEn: "First listen to the frame before que: wish, judgment, emotion, positive belief, or negated belief.",
    paragraphs: [
      "Leo trabaja demasiado y su familia está preocupada. Su madre dice: «Quiero que descanses este fin de semana. Es importante que duermas más». Su hermana añade: «Me alegra que estés con nosotros hoy».",
      "El padre cree que Leo entiende el problema, pero no cree que cambie sus horarios sin ayuda. Todos hablan de la misma situación, aunque cada expresión presenta la acción de una manera diferente."
    ],
    questions: [
      { questionDe: "Welche Aussage präsentiert Information als positive Überzeugung?", questionEn: "Which statement presents information as a positive belief?", optionsDe: ["Der Vater glaubt, dass Leo das Problem versteht", "Die Mutter möchte, dass Leo ruht", "Die Schwester freut sich über Leos Anwesenheit"], optionsEn: ["The father believes Leo understands the problem", "The mother wants Leo to rest", "The sister is glad Leo is there"], correct: 0, explanationDe: "Cree que setzt entender als angenommene Information und verwendet deshalb den Indicativo.", explanationEn: "Cree que presents entender as accepted information and therefore uses the indicative." },
      { questionDe: "Warum steht cambie im Subjuntivo?", questionEn: "Why is cambie in the subjunctive?", optionsDe: ["Der Vater verneint seinen Glauben an die Änderung", "Cambiar steht immer im Subjuntivo", "Die Handlung ist sicher abgeschlossen"], optionsEn: ["The father negates his belief in the change", "Cambiar is always subjunctive", "The action is certainly complete"], correct: 0, explanationDe: "No cree que präsentiert die Änderung nicht als akzeptierte Tatsache, sondern als bezweifelte Möglichkeit.", explanationEn: "No cree que does not present the change as an accepted fact but as a doubted possibility." }
    ],
    recallPromptDe: "Gib auf Spanisch je einen Wunsch, eine Bewertung und einen positiven oder verneinten Glauben aus dem Gespräch wieder.",
    recallPromptEn: "Restate one wish, one judgment, and one positive or negated belief from the conversation in Spanish.",
    modelSummary: "La familia quiere que Leo descanse y cree que entiende el problema, pero no cree que cambie sin ayuda."
  },
  "b1-subjunctive-regular": {
    title: "Preparativos para la visita",
    orientationDe: "Finde zuerst die yo-Basis der Verben und beobachte danach Gegenvokal und notwendige Schreibänderungen.",
    orientationEn: "First find each verb's yo base, then notice the opposite vowel and any spelling change needed.",
    paragraphs: [
      "Marta prepara la visita de un grupo nuevo. Espera que Pablo hable con la directora y cree que es mejor que todos coman antes de la reunión. También quieren que dos compañeros vivan cerca durante el proyecto.",
      "Marta necesita que el autobús llegue temprano y prefiere que Pablo busque otra ruta por si hay tráfico. Las formas cambian, pero el sonido de llegar y buscar debe mantenerse."
    ],
    questions: [
      { questionDe: "Welche Formen benötigen eine Schreibänderung zum Erhalt des Klangs?", questionEn: "Which forms need a spelling change to preserve sound?", optionsDe: ["Llegue und busque", "Hable und coman", "Vivan und esperan"], optionsEn: ["Llegue and busque", "Hable and coman", "Vivan and esperan"], correct: 0, explanationDe: "G wird vor e zu gu und c wird vor e zu qu, damit der jeweilige Stammklang erhalten bleibt.", explanationEn: "G becomes gu before e and c becomes qu before e so each stem sound is preserved." },
      { questionDe: "Warum steht coman nach es mejor que?", questionEn: "Why does coman follow es mejor que?", optionsDe: ["Die Bewertung rahmt die gewünschte Handlung der Gruppe", "Comer ist immer unregelmäßig", "Der Satz berichtet nur eine sichere Gewohnheit"], optionsEn: ["The judgment frames the group's desired action", "Comer is always irregular", "The sentence only reports a certain habit"], correct: 0, explanationDe: "Es mejor que bewertet eine noch auszuführende Handlung und löst hier den Subjuntivo aus.", explanationEn: "Es mejor que evaluates an action still to be carried out and triggers the subjunctive here." }
    ],
    recallPromptDe: "Fasse auf Spanisch drei Vorbereitungswünsche zusammen und verwende dabei ein -ar-, ein -er/-ir- und ein schreibverändertes Verb.",
    recallPromptEn: "Summarize three preparation wishes in Spanish using an -ar verb, an -er/-ir verb, and one spelling-changing verb.",
    modelSummary: "Marta espera que Pablo hable con la directora, que todos coman antes y que el autobús llegue temprano."
  },
  "b1-subjunctive-irregular": {
    title: "Una sorpresa para Elena",
    orientationDe: "Behandle die häufigen unregelmäßigen Formen als vollständige Bedeutungsbausteine, nicht als isolierte Liste.",
    orientationEn: "Treat the frequent irregular forms as complete meaning chunks, not as an isolated list.",
    paragraphs: [
      "Los amigos de Elena preparan una fiesta sorpresa. Esperan que ella sea feliz y quieren que vaya directamente al jardín después del trabajo. Es posible que haya un pequeño problema si llega demasiado pronto.",
      "A Marta le alegra que Elena esté mejor después de una semana difícil. Sin embargo, duda que Pablo sepa guardar el secreto, así que no le contará todos los detalles."
    ],
    questions: [
      { questionDe: "Warum erhält Pablo nicht alle Einzelheiten?", questionEn: "Why does Pablo not receive every detail?", optionsDe: ["Marta bezweifelt, dass er das Geheimnis bewahren kann", "Elena kennt bereits die Überraschung", "Im Garten ist kein Platz"], optionsEn: ["Marta doubts he can keep the secret", "Elena already knows the surprise", "There is no room in the garden"], correct: 0, explanationDe: "Duda que sepa verbindet Martas Zweifel mit der unregelmäßigen Form von saber.", explanationEn: "Duda que sepa connects Marta's doubt with the irregular form of saber." },
      { questionDe: "Welche mögliche Schwierigkeit nennt der Text?", questionEn: "What possible difficulty does the text mention?", optionsDe: ["Elena könnte zu früh ankommen", "Niemand möchte feiern", "Marta ist noch krank"], optionsEn: ["Elena might arrive too early", "Nobody wants to celebrate", "Marta is still ill"], correct: 0, explanationDe: "Es posible que haya rahmt ein noch nicht eingetretenes mögliches Problem.", explanationEn: "Es posible que haya frames a possible problem that has not yet occurred." }
    ],
    recallPromptDe: "Beschreibe auf Spanisch Hoffnung, mögliche Schwierigkeit und Zweifel mit drei verschiedenen unregelmäßigen Subjuntivoformen.",
    recallPromptEn: "Describe the hope, possible difficulty, and doubt in Spanish using three different irregular subjunctive forms.",
    modelSummary: "Los amigos esperan que Elena sea feliz, es posible que haya un problema y Marta duda que Pablo sepa guardar el secreto."
  },
  "b1-wishes-requests": {
    title: "Preparativos para una fiesta del barrio",
    inputMode: "listening",
    orientationDe: "Höre, wann dieselbe Person selbst handeln will und wann sie mit que die Handlung einer anderen Person beeinflusst.",
    orientationEn: "Listen for when the same person wants to act and when que introduces an action to be carried out by someone else.",
    paragraphs: [
      "Nora organiza una fiesta para los vecinos. Le dice a Luis: «Quiero que me llames esta tarde y te pido que hables con el dueño del local. Espero que todo salga bien».",
      "Luis responde que prefiere que los músicos vengan el sábado por la mañana. Nora, en cambio, quiere decorar el lugar ella misma. Por eso dice quiero decorar, sin que, cuando el sujeto no cambia."
    ],
    questions: [
      { questionDe: "Welche Handlung möchte Nora selbst ausführen?", questionEn: "Which action does Nora want to perform herself?", optionsDe: ["Den Raum dekorieren", "Luis anrufen", "Als Musiker am Samstag kommen"], optionsEn: ["Decorate the venue", "Call Luis", "Come as a musician on Saturday"], correct: 0, explanationDe: "Quiero decorar verbindet Noras Wunsch direkt mit ihrem eigenen Infinitiv und benötigt kein que.", explanationEn: "Quiero decorar connects Nora's wish directly to her own infinitive and does not need que." },
      { questionDe: "Was bittet Nora Luis ausdrücklich zu tun?", questionEn: "What does Nora explicitly ask Luis to do?", optionsDe: ["Mit dem Besitzer des Raums sprechen", "Allein dekorieren", "Die Feier absagen"], optionsEn: ["Speak with the venue owner", "Decorate alone", "Cancel the party"], correct: 0, explanationDe: "Te pido que hables macht Einfluss und unterschiedliche handelnde Personen sichtbar.", explanationEn: "Te pido que hables makes influence and the different acting subjects explicit." }
    ],
    recallPromptDe: "Gib auf Spanisch zwei Wünsche über andere Personen und einen Wunsch über die eigene Handlung wieder.",
    recallPromptEn: "Restate two wishes about other people and one wish about the speaker's own action in Spanish.",
    modelSummary: "Nora quiere que Luis la llame y hable con el dueño, pero quiere decorar el lugar ella misma."
  },
  "b1-advice-reactions-subjunctive": {
    title: "Una conversación sobre el exceso de trabajo",
    orientationDe: "Trenne Rat, Sorge, Überraschung und als sicher dargestellte Information.",
    orientationEn: "Separate advice, concern, surprise, and information presented as certain.",
    paragraphs: [
      "Clara trabaja hasta muy tarde desde hace varias semanas. Su amiga le dice: «Es necesario que descanses más y es mejor que hables con tu jefa». También le preocupa que Clara trabaje tanto.",
      "En la oficina, todos saben que Clara trabaja mucho. Por eso nadie se sorprende de ese hecho; lo que sorprende a sus compañeros es que llegue tan temprano incluso después de una noche larga."
    ],
    questions: [
      { questionDe: "Welche Aussage wird als bekannte Tatsache dargestellt?", questionEn: "Which statement is presented as a known fact?", optionsDe: ["Clara arbeitet viel", "Clara wird sicher mehr ruhen", "Ihre Chefin ändert sofort den Plan"], optionsEn: ["Clara works a lot", "Clara will certainly rest more", "Her manager immediately changes the plan"], correct: 0, explanationDe: "Saben que und die anschließende Tatsache stehen im Indicativo; Rat und Reaktionen rahmen andere Aussagen ein.", explanationEn: "Saben que and the following fact use the indicative; advice and reactions frame other statements." },
      { questionDe: "Worüber wundern sich die Kollegen?", questionEn: "What surprises the colleagues?", optionsDe: ["Dass Clara trotz langer Nächte so früh kommt", "Dass sie überhaupt arbeitet", "Dass die Freundin nichts sagt"], optionsEn: ["That Clara arrives so early despite long nights", "That she works at all", "That the friend says nothing"], correct: 0, explanationDe: "Es que llegue tan temprano ist der ausdrücklich als überraschend eingerahmte Sachverhalt.", explanationEn: "Que llegue tan temprano is the situation explicitly framed as surprising." }
    ],
    recallPromptDe: "Formuliere auf Spanisch einen Rat, eine Sorge und eine als wahr gesetzte Information über Clara.",
    recallPromptEn: "State one piece of advice, one concern, and one accepted fact about Clara in Spanish.",
    modelSummary: "Es necesario que Clara descanse y a su amiga le preocupa que trabaje tanto, aunque todos saben que trabaja mucho."
  },
  "checkpoint-b1-subjunctive": {
    title: "Un plan, dos actitudes",
    inputMode: "listening",
    orientationDe: "Ordne jedem Verb seinen Bedeutungsrahmen zu und unterscheide Wunsch, Bewertung, Gefühl, Zweifel und akzeptierte Information.",
    orientationEn: "Match each verb to its meaning frame and distinguish wish, judgment, emotion, doubt, and accepted information.",
    paragraphs: [
      "Marta espera que Pablo tenga tiempo mañana y dice que es importante que hablen antes de cambiar el plan. Quiere que él venga a la reunión, pero entiende que está ocupado.",
      "A Marta le alegra que el proyecto salga bien. Sin embargo, no cree que sea necesario terminar todo esta semana. Pablo responde que sabe que el viernes es difícil y propone que continúen el lunes."
    ],
    questions: [
      { questionDe: "Welche Information akzeptiert Marta als Tatsache?", questionEn: "Which information does Marta accept as fact?", optionsDe: ["Pablo ist beschäftigt", "Pablo wird sicher kommen", "Alles muss diese Woche fertig werden"], optionsEn: ["Pablo is busy", "Pablo will certainly come", "Everything must be finished this week"], correct: 0, explanationDe: "Entiende que está setzt die Beschäftigung als verstandene Information; ihr Wunsch zu kommen steht getrennt im Subjuntivo.", explanationEn: "Entiende que está presents his being busy as understood information; her wish for him to come is separately subjunctive." },
      { questionDe: "Was hält Marta nicht für notwendig?", questionEn: "What does Marta not consider necessary?", optionsDe: ["Alles in dieser Woche beenden", "Vor der Änderung sprechen", "Das Projekt fortsetzen"], optionsEn: ["Finish everything this week", "Talk before changing the plan", "Continue the project"], correct: 0, explanationDe: "No cree que sea necesario rahmt genau die Fertigstellung in dieser Woche als verneinte Bewertung.", explanationEn: "No cree que sea necesario frames finishing this week as the negated judgment." }
    ],
    recallPromptDe: "Fasse auf Spanisch Martas Wunsch, akzeptierte Information und verneinte Bewertung sowie Pablos Vorschlag zusammen.",
    recallPromptEn: "Summarize Marta's wish, accepted information, negated judgment, and Pablo's proposal in Spanish.",
    modelSummary: "Marta quiere que Pablo venga, aunque entiende que está ocupado, y no cree que sea necesario terminar esta semana; Pablo propone que continúen el lunes."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const existing = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (existing.length !== entries.length) throw new Error(`B1 grammar input requires ${entries.length} lessons, found ${existing.length}.`);
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 20 : 16 } });
  }
  console.log(`Seeded connected reading/listening input for ${entries.length} B1 grammar packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
