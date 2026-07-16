const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "b2-relative-que-quien": {
    title: "Las personas que hacen posible el proyecto",
    inputMode: "listening",
    orientationDe: "Bestimme zuerst, ob die Person direkt identifiziert, nach einer Präposition genannt oder als bekannte Person nur zusätzlich beschrieben wird. Prüfe danach, ob sie überhaupt konkret existiert.",
    orientationEn: "First decide whether the person is directly identified, follows a preposition, or is a known person receiving extra information. Then check whether the person is known to exist.",
    paragraphs: [
      "La mujer que coordina el proyecto se llama Marta. Su compañero, con quien hablé ayer, organiza las visitas. Marta, quien conoce bien el barrio, explica las necesidades a los nuevos voluntarios y presenta a las familias que participan.",
      "Todavía buscan a alguien que pueda diseñar una página web, pero no hay nadie que conozca todas las herramientas necesarias. Que identifica personas y cosas de forma amplia; quien aparece con personas tras una preposición o entre comas como información adicional."
    ],
    questions: [
      { questionDe: "Warum steht con quien und nicht einfach quien?", questionEn: "Why is con quien used rather than quien alone?", optionsDe: ["Hablar con verlangt die Präposition con", "Quien bezeichnet eine Sache", "Der Kollege existiert noch nicht"], optionsEn: ["Hablar con requires the preposition con", "Quien refers to a thing", "The colleague does not yet exist"], correct: 0, explanationDe: "Die Beziehung lautet hablar con alguien. Die Präposition bleibt im Relativsatz sichtbar und steht vor quien, das auf den Kollegen verweist.", explanationEn: "The relationship is hablar con alguien. The preposition remains visible before quien, which refers to the colleague." },
      { questionDe: "Warum steht pueda bei der gesuchten Person im Subjuntivo?", questionEn: "Why is pueda subjunctive for the person being sought?", optionsDe: ["Die passende Person ist noch nicht identifiziert", "Poder steht immer im Subjuntivo", "Die Suche wurde beendet"], optionsEn: ["The suitable person has not been identified", "Poder is always subjunctive", "The search has ended"], correct: 0, explanationDe: "Alguien bezeichnet hier keine bekannte existierende Person mit dieser Fähigkeit. Der Subjuntivo hält die gewünschte Eigenschaft offen.", explanationEn: "Alguien does not identify a known existing person with that ability. The subjunctive keeps the desired quality open." }
    ],
    recallPromptDe: "Beschreibe das Team auf Spanisch mit que zur Identifikation, con quien nach einer Präposition, quien zwischen Kommas und einem unbekannten Bezug im Subjuntivo.",
    recallPromptEn: "Describe the team in Spanish using que for identification, con quien after a preposition, quien between commas, and an unknown referent with the subjunctive.",
    modelSummary: "Marta, quien conoce el barrio, dirige a las personas que participan; su compañero, con quien hablé, organiza visitas y buscan a alguien que pueda diseñar la web."
  },
  "b2-relative-prepositions": {
    title: "Las relaciones detrás de una propuesta compleja",
    orientationDe: "Rekonstruiere im Relativsatz zuerst das ursprüngliche Verb mit seiner Präposition: hablar de, trabajar para, enfrentarse a, depender de oder irse por una razón.",
    orientationEn: "First reconstruct the original verb with its preposition inside the relative clause: hablar de, trabajar para, enfrentarse a, depender de, or leave for a reason.",
    paragraphs: [
      "Este es el proyecto del que hablamos ayer. La empresa para la que trabaja Elena quiere renovar una plaza, pero el problema al que se enfrenta es la falta de presupuesto. Hay varias decisiones de las que depende el resultado.",
      "Elena también explica la razón por la que rechazaron el primer diseño: no protegía los árboles. Las formas del que, para la que, al que, de las que y por la que conservan relaciones que desaparecerían si solo se eligiera que por traducción."
    ],
    questions: [
      { questionDe: "Welche Präposition verlangt enfrentarse im Text?", questionEn: "Which preposition does enfrentarse require in the text?", optionsDe: ["A, verbunden zu al que", "De, verbunden zu del que", "Para, vor la que"], optionsEn: ["A, combined as al que", "De, combined as del que", "Para, before la que"], correct: 0, explanationDe: "Man sagt enfrentarse a un problema. Vor el que verschmilzt a mit el zu al, während die geforderte Beziehung erhalten bleibt.", explanationEn: "The expression is enfrentarse a un problema. Before el que, a combines with el as al while preserving the required relationship." },
      { questionDe: "Wovon hängt laut Text das Ergebnis ab?", questionEn: "What does the result depend on according to the text?", optionsDe: ["Von mehreren Entscheidungen", "Nur von Elena", "Vom gestrigen Gespräch"], optionsEn: ["Several decisions", "Elena alone", "Yesterday's conversation"], correct: 0, explanationDe: "Decisiones de las que depende el resultado bewahrt depender de und passt den Artikel an das feminine Pluralwort decisiones an.", explanationEn: "Decisiones de las que depende el resultado preserves depender de and agrees with feminine plural decisiones." }
    ],
    recallPromptDe: "Fasse die Projektsituation auf Spanisch zusammen und erhalte in mindestens vier Relativsätzen jeweils die vom Verb oder der Beziehung geforderte Präposition.",
    recallPromptEn: "Summarize the project in Spanish, preserving the preposition required by the verb or relationship in at least four relative clauses.",
    modelSummary: "El proyecto del que hablamos pertenece a la empresa para la que trabaja Elena; el problema al que se enfrenta y las decisiones de las que depende todo son complejos."
  },
  "b2-relative-el-que-lo-que": {
    title: "Dos propuestas y una consecuencia inesperada",
    inputMode: "listening",
    orientationDe: "Prüfe den Rückbezug: Ersetzt der Relativausdruck ein bekanntes Nomen, eine nicht benannte Sache oder den gesamten vorherigen Sachverhalt? Daraus folgt la que, los que oder lo que.",
    orientationEn: "Check the reference: does the relative expression replace a known noun, an unnamed thing, or the entire previous event? This determines la que, los que, or lo que.",
    paragraphs: [
      "El comité recibió dos propuestas. La que prefería la mayoría era más económica, pero nadie entendió bien lo que quería conseguir. La segunda explicaba cada objetivo con claridad, lo que convenció a varios miembros indecisos.",
      "Al final eligieron la segunda. Los que habían defendido la primera aceptaron el resultado y dijeron: «Eso era precisamente lo que necesitábamos: una explicación clara». La que sustituye propuesta; lo que puede nombrar una idea desconocida o todo el hecho anterior."
    ],
    questions: [
      { questionDe: "Worauf bezieht sich lo que convenció a varios miembros?", questionEn: "What does lo que convenció a varios miembros refer to?", optionsDe: ["Auf die klare Erklärung aller Ziele", "Nur auf das Wort propuesta", "Auf die niedrigeren Kosten"], optionsEn: ["The clear explanation of every goal", "Only the word propuesta", "The lower cost"], correct: 0, explanationDe: "Lo que greift den gesamten vorherigen Sachverhalt auf: Die zweite Vorlage erläuterte jedes Ziel klar, und genau das überzeugte.", explanationEn: "Lo que refers to the whole preceding event: the second proposal explained every goal clearly, and that convinced them." },
      { questionDe: "Warum heißt es la que prefería la mayoría?", questionEn: "Why is it la que prefería la mayoría?", optionsDe: ["La que ersetzt das bekannte feminine Nomen propuesta", "Lo que bezeichnet eine Person", "Que braucht immer einen Artikel"], optionsEn: ["La que replaces the known feminine noun propuesta", "Lo que refers to a person", "Que always needs an article"], correct: 0, explanationDe: "Von zwei bereits genannten propuestas wird eine ausgewählt. La que stimmt mit dem ausgelassenen femininen Nomen überein.", explanationEn: "One of two already-mentioned propuestas is selected. La que agrees with the omitted feminine noun." }
    ],
    recallPromptDe: "Erzähle die Entscheidung auf Spanisch nach und verwende la que für eine bekannte Vorlage, los que für eine Gruppe und lo que einmal für eine Idee sowie einmal für einen ganzen Sachverhalt.",
    recallPromptEn: "Retell the decision in Spanish using la que for a known proposal, los que for a group, and lo que once for an idea and once for a whole event.",
    modelSummary: "La propuesta que parecía barata no explicaba lo que buscaba; la segunda era más clara, lo que convenció al comité, incluidos los que preferían la primera."
  },
  "b2-relative-cuyo": {
    title: "La autora cuyas ideas transformaron una ciudad",
    orientationDe: "Suche Eigentümer und Besitz getrennt. Cuyo verbindet beide, stimmt aber in Genus und Numerus mit dem folgenden Besitzwort überein – nicht mit der besitzenden Person oder Organisation.",
    orientationEn: "Identify owner and possession separately. Cuyo links them but agrees in gender and number with the following possessed noun, not with the owner.",
    paragraphs: [
      "En el congreso conocimos a una arquitecta cuyos proyectos han transformado varios barrios. Su estudio, cuya oficina principal está en Sevilla, trabaja con comunidades locales. También presentó una iniciativa cuyo impacto puede medirse cada año.",
      "La arquitecta citó a una autora cuyas investigaciones cambiaron su manera de diseñar. Cuyos concuerda con proyectos, cuya con oficina, cuyo con impacto y cuyas con investigaciones. El propietario queda antes de cuyo; la cosa poseída aparece inmediatamente después."
    ],
    questions: [
      { questionDe: "Warum lautet die Form cuyas investigaciones?", questionEn: "Why is the form cuyas investigaciones?", optionsDe: ["Sie stimmt mit investigaciones im Feminin Plural überein", "Sie stimmt mit autora im Singular überein", "Cuyo bleibt immer unverändert"], optionsEn: ["It agrees with feminine plural investigaciones", "It agrees with singular autora", "Cuyo never changes"], correct: 0, explanationDe: "Die Autorin ist die Besitzerin, aber investigaciones ist das besessene Wort. Dessen femininer Plural bestimmt cuyas.", explanationEn: "The author is the owner, but investigaciones is the possessed noun. Its feminine plural determines cuyas." },
      { questionDe: "Was kann bei der Initiative jährlich gemessen werden?", questionEn: "What can be measured yearly about the initiative?", optionsDe: ["Ihre Wirkung", "Die Hauptgeschäftsstelle", "Die Autorin"], optionsEn: ["Its impact", "The main office", "The author"], correct: 0, explanationDe: "Una iniciativa cuyo impacto puede medirse verbindet die Initiative als Besitzerin mit dem messbaren maskulinen Singularwort impacto.", explanationEn: "Una iniciativa cuyo impacto puede medirse links the initiative as owner to the measurable masculine singular noun impacto." }
    ],
    recallPromptDe: "Beschreibe auf Spanisch Architektin, Büro, Initiative und Autorin mit vier cuyo-Formen und achte jeweils auf die Übereinstimmung mit dem Besitzwort.",
    recallPromptEn: "Describe the architect, office, initiative, and author in Spanish with four forms of cuyo, agreeing each with the possessed noun.",
    modelSummary: "Conocimos a una arquitecta cuyos proyectos transforman barrios; su estudio, cuya oficina está en Sevilla, mide iniciativas cuyo impacto parte de investigaciones cuyas ideas la inspiraron."
  },
  "b2-relative-place-time-manner": {
    title: "El lugar, la época y la manera que recuerdo",
    inputMode: "listening",
    orientationDe: "Ordne das Bezugswort einer Kategorie zu: Ort führt zu donde oder en el que, Zeitpunkt zu cuando und Art und Weise zu como. Die Verbindung ersetzt keine beliebige Präposition.",
    orientationEn: "Classify the antecedent: place leads to donde or en el que, time to cuando, and manner to como. The link does not replace arbitrary prepositions.",
    paragraphs: [
      "Volví al barrio donde crecí y visité la casa en la que nací. Ya no existe la tienda donde comprábamos pan, pero todavía recuerdo la época cuando todos los vecinos se conocían y compartían las fiestas.",
      "Una vecina resolvió un conflicto de una manera como nadie esperaba: invitó a todos a hablar. Fue entonces cuando comprendí por qué aquel lugar seguía siendo especial. Donde localiza, cuando sitúa en el tiempo y como recupera una manera."
    ],
    questions: [
      { questionDe: "Welche präzisere Alternative verwendet der Text zu donde bei casa?", questionEn: "Which more precise alternative to donde does the text use with casa?", optionsDe: ["En la que", "Por la que", "Cuyas"], optionsEn: ["En la que", "Por la que", "Cuyas"], correct: 0, explanationDe: "Nacer en una casa verlangt die Ortspräposition en. En la que bewahrt diese Beziehung und verweist auf casa.", explanationEn: "Nacer en una casa requires the location preposition en. En la que preserves that relationship and refers to casa." },
      { questionDe: "Worauf bezieht sich como im Konfliktsatz?", questionEn: "What does como refer to in the conflict sentence?", optionsDe: ["Auf die unerwartete Art der Lösung", "Auf den Stadtteil", "Auf eine Zeitspanne"], optionsEn: ["The unexpected manner of resolving it", "The neighborhood", "A time period"], correct: 0, explanationDe: "Como nimmt manera wieder auf und beschreibt, auf welche Art die Nachbarin den Konflikt löste – durch ein gemeinsames Gespräch.", explanationEn: "Como refers back to manera and describes how the neighbor resolved the conflict, through a shared conversation." }
    ],
    recallPromptDe: "Erzähle die Erinnerung auf Spanisch mit donde und en la que für Orte, cuando für zwei Zeitbezüge und como für die Art der Konfliktlösung.",
    recallPromptEn: "Retell the memory in Spanish using donde and en la que for places, cuando for two time references, and como for the manner of resolving the conflict.",
    modelSummary: "Volví al barrio donde crecí y a la casa en la que nací; recordé la época cuando todos se conocían y la manera como una vecina resolvió el conflicto."
  },
  "checkpoint-b2-relative-clauses": {
    title: "La organización que renovará el barrio",
    orientationDe: "Verfolge für jede Relativform ihren genauen Rückbezug: Person mit Präposition, direkt identifizierte Organisation, vom Verb geforderte Präposition, Ort, Besitz und ganzer vorheriger Sachverhalt.",
    orientationEn: "Track the exact reference of each relative form: person after a preposition, directly identified organization, verb-required preposition, place, possession, and a whole preceding event.",
    paragraphs: [
      "La persona con quien colaboro dirige una organización que ayuda a jóvenes. El proyecto del que te hablé renovará el barrio donde viven muchas familias y creará salas en las que podrán estudiar después de clase.",
      "Ayer conocimos a una arquitecta cuyas ideas impresionaron al ayuntamiento. Presentó dos diseños; el que eligieron conserva los árboles y mejora la plaza, lo que permitirá comenzar pronto. Cada enlace evita repetir información sin ocultar la relación original."
    ],
    questions: [
      { questionDe: "Worauf verweist lo que permitirá comenzar pronto?", questionEn: "What does lo que permitirá comenzar pronto refer to?", optionsDe: ["Auf die gesamte Auswahl und Genehmigung des passenden Entwurfs", "Nur auf das Wort árboles", "Auf die Familien im Viertel"], optionsEn: ["The whole selection and approval of the suitable design", "Only the word árboles", "The families in the neighborhood"], correct: 0, explanationDe: "Lo que nimmt den vorherigen Sachverhalt als Ganzes auf: Der gewählte Entwurf erfüllt die Anforderungen und ermöglicht dadurch den baldigen Beginn.", explanationEn: "Lo que takes up the whole preceding event: the chosen design meets the needs and therefore makes an early start possible." },
      { questionDe: "Welche Form zeigt Besitz und stimmt mit ideas überein?", questionEn: "Which form shows possession and agrees with ideas?", optionsDe: ["Cuyas", "Con quien", "En las que"], optionsEn: ["Cuyas", "Con quien", "En las que"], correct: 0, explanationDe: "Die Ideen gehören der Architektin. Cuyas steht zwischen Besitzerin und Besitz und übernimmt Feminin Plural von ideas.", explanationEn: "The ideas belong to the architect. Cuyas links owner and possession and takes feminine plural agreement from ideas." }
    ],
    recallPromptDe: "Fasse das Projekt auf Spanisch in höchstens vier Sätzen zusammen und verwende dabei con quien, del que, donde, en las que, cuyas, el que und lo que korrekt.",
    recallPromptEn: "Summarize the project in Spanish in no more than four sentences, accurately using con quien, del que, donde, en las que, cuyas, el que, and lo que.",
    modelSummary: "La persona con quien colaboro dirige la organización que realizará el proyecto del que te hablé en el barrio donde viven familias, con una arquitecta cuyas ideas fueron elegidas."
  },
  "b2-se-reflexive-reciprocal": {
    title: "Un encuentro frente al espejo y entre amigos",
    inputMode: "listening",
    orientationDe: "Nutze Teilnehmerzahl und Kontext: Wirkt die Handlung auf dieselbe Person zurück oder tauschen mehrere Personen sie miteinander aus? Se allein entscheidet die Bedeutung nicht.",
    orientationEn: "Use participant number and context: does the action return to the same person, or do multiple people exchange it? Se alone does not decide the meaning.",
    paragraphs: [
      "Antes de una entrevista, Ana se prepara y se mira en el espejo. Su hermano también se peina. Cada persona realiza la acción sobre sí misma. Más tarde, Ana se encuentra con dos viejos amigos en la estación.",
      "Los amigos se abrazan, se cuentan sus novedades y se escriben sus nuevos números de teléfono. Cuando Ana dice «nos miramos y sonreímos», la situación muestra que se miran unos a otros, no cada uno en un espejo."
    ],
    questions: [
      { questionDe: "Welche Handlung ist eindeutig reflexiv?", questionEn: "Which action is clearly reflexive?", optionsDe: ["Ana betrachtet sich im Spiegel", "Die Freunde umarmen einander", "Sie tauschen Telefonnummern aus"], optionsEn: ["Ana looks at herself in the mirror", "The friends hug one another", "They exchange phone numbers"], correct: 0, explanationDe: "Der Spiegel und das einzelne Subjekt Ana zeigen, dass Handelnde und Ziel der Handlung dieselbe Person sind.", explanationEn: "The mirror and singular subject Ana show that the actor and target of the action are the same person." },
      { questionDe: "Warum ist se abrazan reziprok?", questionEn: "Why is se abrazan reciprocal?", optionsDe: ["Mehrere Freunde führen die Handlung gegenseitig aus", "Jeder umarmt nur sich selbst", "Abrazar ist unpersönlich"], optionsEn: ["Several friends perform the action toward one another", "Each only hugs themselves", "Abrazar is impersonal"], correct: 0, explanationDe: "Das plurale Subjekt und die Begegnungssituation erzeugen einen Austausch: Jeder Freund ist zugleich Handelnder und Ziel eines anderen.", explanationEn: "The plural subject and meeting context create an exchange: each friend is both actor and another person's target." }
    ],
    recallPromptDe: "Beschreibe auf Spanisch zwei reflexive Vorbereitungen und drei gegenseitige Handlungen der Freunde; ergänze Kontext, der jede Lesart eindeutig macht.",
    recallPromptEn: "Describe two reflexive preparations and three reciprocal actions in Spanish, adding context that makes each reading unambiguous.",
    modelSummary: "Ana se prepara y se mira en el espejo; después los amigos se abrazan, se cuentan novedades, se escriben sus números y se miran unos a otros."
  },
  "b2-se-impersonal": {
    title: "Cómo se vive y se trabaja en este barrio",
    orientationDe: "Prüfe, ob eine allgemeine menschliche Tätigkeit ohne bestimmte handelnde Person beschrieben wird. Bei intransitiven Verben oder Ergänzungen mit Präposition bleibt das Verb in der dritten Person Singular.",
    orientationEn: "Check whether a general human activity is described without a specific actor. With intransitive verbs or prepositional complements, the verb remains third-person singular.",
    paragraphs: [
      "En este barrio se vive con tranquilidad y se trabaja sin demasiado ruido. En los cafés se habla mucho de política, pero no se puede fumar dentro. Nadie concreto aparece como sujeto de esas costumbres y normas.",
      "Los visitantes suelen preguntar cómo se llega al museo o dónde se come bien. Las respuestas describen lo que la gente hace en general. El museo y la política no controlan el verbo: al museo y de política son complementos con preposición."
    ],
    questions: [
      { questionDe: "Warum bleibt se habla im Singular?", questionEn: "Why does se habla remain singular?", optionsDe: ["De política ist kein grammatisches Subjekt", "Política ist immer Singular", "Se habla ist ein Passiv mit politik als Handelnder"], optionsEn: ["De política is not a grammatical subject", "Política is always singular", "Se habla is a passive with politics as agent"], correct: 0, explanationDe: "Hablar de führt ein Präpositionalobjekt ein. Der Satz meint allgemein Menschen, die über das Thema sprechen, und bleibt unpersönlich Singular.", explanationEn: "Hablar de introduces a prepositional complement. The sentence refers to people generally talking about the topic and remains impersonal singular." },
      { questionDe: "Was fragt ¿Cómo se llega al museo?", questionEn: "What does ¿Cómo se llega al museo? ask?", optionsDe: ["Nach einer allgemeinen Wegbeschreibung", "Wer das Museum gebaut hat", "Ob Museen verkauft werden"], optionsEn: ["For general directions", "Who built the museum", "Whether museums are sold"], correct: 0, explanationDe: "Die Frage sucht keinen bestimmten Reisenden, sondern den allgemein üblichen Weg, wie man das Museum erreicht.", explanationEn: "The question does not identify a particular traveler; it asks for the general way one reaches the museum." }
    ],
    recallPromptDe: "Beschreibe das Viertel auf Spanisch mit mindestens vier unpersönlichen se-Sätzen zu Lebensqualität, Arbeit, Regeln, Gesprächsthemen und Wegbeschreibung.",
    recallPromptEn: "Describe the neighborhood in Spanish with at least four impersonal se statements about quality of life, work, rules, topics, and directions.",
    modelSummary: "En el barrio se vive bien, se trabaja con calma, se habla de política y no se puede fumar; también se explica cómo se llega al museo."
  },
  "b2-se-passive": {
    title: "Anuncios y resultados en una página local",
    inputMode: "listening",
    orientationDe: "Suche das betroffene Ding als grammatisches Subjekt und passe das Verb daran an. Einzahl, Mehrzahl und zusammengesetzte Zeit bleiben auch mit passivem se sichtbar.",
    orientationEn: "Find the affected thing as grammatical subject and make the verb agree with it. Singular, plural, and compound tense remain visible with passive se.",
    paragraphs: [
      "En la página del barrio se vende una casa y se alquilan tres habitaciones. También se necesitan personas con experiencia para un proyecto cultural. Los sustantivos que aparecen con se determinan el número singular o plural del verbo.",
      "Ayer se publicaron los resultados de una consulta y esta semana se han tomado varias medidas. No se presenta al agente porque interesa el hecho y aquello que resulta afectado. Resultados y medidas exigen formas plurales, aunque aparezcan después del verbo."
    ],
    questions: [
      { questionDe: "Warum heißt es se alquilan tres habitaciones?", questionEn: "Why is it se alquilan tres habitaciones?", optionsDe: ["Habitaciones ist das plurale grammatische Subjekt", "Alquilar ist immer Plural", "Se bezeichnet drei Personen"], optionsEn: ["Habitaciones is the plural grammatical subject", "Alquilar is always plural", "Se refers to three people"], correct: 0, explanationDe: "Die Zimmer sind das von der Vermietung betroffene Subjekt. Ihre Mehrzahl steuert alquilan, auch wenn sie hinter dem Verb stehen.", explanationEn: "The rooms are the affected grammatical subject. Their plural controls alquilan even though they follow the verb." },
      { questionDe: "Welche zusammengesetzte Passivform steht im Text?", questionEn: "Which compound passive-se form appears in the text?", optionsDe: ["Se han tomado varias medidas", "Se vende una casa", "Se publicaron los resultados"], optionsEn: ["Se han tomado varias medidas", "Se vende una casa", "Se publicaron los resultados"], correct: 0, explanationDe: "Han tomado ist Perfekt und stimmt über han mit dem pluralen Subjekt varias medidas überein; se markiert die passive Perspektive.", explanationEn: "Han tomado is present perfect and agrees through han with plural varias medidas; se marks the passive perspective." }
    ],
    recallPromptDe: "Berichte die Anzeigen und Neuigkeiten auf Spanisch mit mindestens einer singularen, drei pluralen und einer zusammengesetzten passiven se-Konstruktion.",
    recallPromptEn: "Report the listings and news in Spanish using at least one singular, three plural, and one compound passive-se construction.",
    modelSummary: "Se vende una casa, se alquilan habitaciones y se necesitan personas; además, se publicaron los resultados y se han tomado varias medidas."
  },
  "b2-se-accidental": {
    title: "Una mañana en la que todo salió mal",
    orientationDe: "Trenne betroffene Person und betroffenes Ding. Me, te, le, nos oder les nennt die betroffene Person; das Ding ist grammatisches Subjekt und steuert Singular oder Plural.",
    orientationEn: "Separate affected person and affected thing. Me, te, le, nos, or les identifies the affected person; the thing is grammatical subject and controls agreement.",
    paragraphs: [
      "Esta mañana se me cayeron las llaves al salir de casa y se me olvidó la cartera en la cocina. A mi hermano se le rompió el teléfono justo cuando intentaba llamarme. Ninguno planeó esos hechos.",
      "En el desayuno se te han quemado las tostadas y a nuestros vecinos se les perdió un documento importante. La construcción pone en primer plano lo ocurrido sin borrar a la persona afectada: cayeron concuerda con llaves, olvidó con cartera y perdió con documento."
    ],
    questions: [
      { questionDe: "Warum steht cayeron im Plural, aber olvidó im Singular?", questionEn: "Why is cayeron plural but olvidó singular?", optionsDe: ["Llaves ist Plural und cartera Singular", "Me verändert die Verbzahl", "Caer ist immer Plural"], optionsEn: ["Llaves is plural and cartera singular", "Me changes verb number", "Caer is always plural"], correct: 0, explanationDe: "Die betroffenen Dinge sind grammatische Subjekte und steuern die Kongruenz; me bezeichnet in beiden Fällen nur die betroffene Person.", explanationEn: "The affected things are grammatical subjects and control agreement; me only identifies the affected person in both cases." },
      { questionDe: "Welche Rolle spielt les in se les perdió el documento?", questionEn: "What role does les play in se les perdió el documento?", optionsDe: ["Es bezeichnet die betroffenen Nachbarn", "Es ersetzt das Dokument", "Es macht das Verb Plural"], optionsEn: ["It identifies the affected neighbors", "It replaces the document", "It makes the verb plural"], correct: 0, explanationDe: "Les verweist auf die Nachbarn, denen das Missgeschick widerfuhr; el documento bleibt das singulare Subjekt von perdió.", explanationEn: "Les refers to the neighbors affected by the mishap; el documento remains the singular subject of perdió." }
    ],
    recallPromptDe: "Erzähle die Pannen auf Spanisch nach und verwende mindestens drei verschiedene Betroffenenpronomen sowie sowohl singulare als auch plurale betroffene Dinge.",
    recallPromptEn: "Retell the mishaps in Spanish using at least three different affected-person pronouns and both singular and plural affected things.",
    modelSummary: "Se me cayeron las llaves y se me olvidó la cartera; a mi hermano se le rompió el móvil, se te quemaron las tostadas y a los vecinos se les perdió un documento."
  },
  "b2-se-passive-contrast": {
    title: "La misma noticia en un aviso y un informe",
    inputMode: "listening",
    orientationDe: "Entscheide, was im Vordergrund steht: allgemeine Menschen, ein betroffenes Ding mit Kongruenz oder ein formeller Vorgang samt ausdrücklich genanntem Handelnden.",
    orientationEn: "Decide what is foregrounded: people in general, an affected thing controlling agreement, or a formal event with an explicitly named agent.",
    paragraphs: [
      "En un aviso se lee: «Se entrevistó a tres candidatos y se aprobaron dos propuestas». Con la a personal, candidatos no controla el verbo; propuestas sí es sujeto plural de una pasiva con se.",
      "El informe formal añade: «Las propuestas fueron aprobadas por el comité y la ley fue modificada en 2020». La pasiva con ser permite nombrar al agente. En cambio, en España se cena tarde es impersonal porque cenar no actúa sobre un objeto."
    ],
    questions: [
      { questionDe: "Warum bleibt se entrevistó trotz drei Kandidaten Singular?", questionEn: "Why does se entrevistó remain singular despite three candidates?", optionsDe: ["Die persönliche a verhindert ein passives Subjekt", "Candidatos ist grammatisch Singular", "Entrevistar ist unpersönlich ohne Menschen"], optionsEn: ["Personal a prevents a passive subject", "Candidatos is grammatically singular", "Entrevistar is impersonal without people"], correct: 0, explanationDe: "A tres candidatos ist mit persönlichem a markiert und kann hier nicht als kongruierendes Passivsubjekt dienen; die Konstruktion ist unpersönlich Singular.", explanationEn: "A tres candidatos is marked with personal a and cannot serve as an agreeing passive subject here; the construction is impersonal singular." },
      { questionDe: "Wann ist die ser-Passivform besonders nützlich?", questionEn: "When is the ser passive especially useful?", optionsDe: ["Wenn der Handelnde ausdrücklich relevant ist", "Bei jeder allgemeinen Gewohnheit", "Nur wenn kein betroffenes Ding existiert"], optionsEn: ["When the agent is explicitly relevant", "For every general habit", "Only when no affected thing exists"], correct: 0, explanationDe: "Fueron aprobadas por el comité rückt Vorgang und Vorschläge in den Vordergrund und erlaubt zugleich die ausdrückliche Nennung des Ausschusses.", explanationEn: "Fueron aprobadas por el comité foregrounds the event and proposals while allowing the committee to be named explicitly." }
    ],
    recallPromptDe: "Gib die Informationen auf Spanisch in drei Registern wieder: unpersönliches se für Menschen allgemein, passives se mit Kongruenz und ser-Passiv mit genanntem Handelnden.",
    recallPromptEn: "Present the information in Spanish in three forms: impersonal se for people generally, agreeing passive se, and ser passive with a named agent.",
    modelSummary: "Se entrevistó a tres candidatos, se aprobaron dos propuestas y las propuestas fueron aprobadas por el comité; además, en España se cena tarde."
  },
  "checkpoint-b2-se-constructions": {
    title: "Un día de avisos, accidentes y ayuda vecinal",
    orientationDe: "Klassifiziere jedes se vor der Formbildung: allgemein handelnde Menschen, betroffenes Passivsubjekt, betroffene Person bei einem Missgeschick oder gegenseitige Handlung mehrerer Beteiligter.",
    orientationEn: "Classify each se before forming it: people acting generally, an affected passive subject, a person affected by a mishap, or reciprocal action among participants.",
    paragraphs: [
      "En este barrio se vive con tranquilidad y se alquilan habitaciones cerca de la universidad. Ayer se entrevistó a todos los candidatos para un nuevo centro, pero todavía no se han publicado los resultados.",
      "Al llegar a la reunión, se me olvidaron los documentos en casa. Por suerte, los vecinos se ayudan cuando hay un problema: Ana me prestó una copia y después todos se enviaron la información necesaria. Cada se responde a una función y una estructura distinta."
    ],
    questions: [
      { questionDe: "Welche beiden Formen werden von einem pluralen Subjekt gesteuert?", questionEn: "Which two forms are controlled by a plural subject?", optionsDe: ["Se alquilan und se han publicado", "Se vive und se entrevistó", "Se me und se ayudan"], optionsEn: ["Se alquilan and se han publicado", "Se vive and se entrevistó", "Se me and se ayudan"], correct: 0, explanationDe: "Habitaciones und resultados sind plurale Passivsubjekte. Deshalb stimmen alquilan sowie han publicado mit ihnen überein.", explanationEn: "Habitaciones and resultados are plural passive subjects, so alquilan and han publicado agree with them." },
      { questionDe: "Welche Funktion hat se in los vecinos se ayudan?", questionEn: "What is the function of se in los vecinos se ayudan?", optionsDe: ["Gegenseitige Hilfe", "Unpersönliche Regel", "Unbeabsichtigtes Missgeschick"], optionsEn: ["Reciprocal help", "Impersonal rule", "Unintended mishap"], correct: 0, explanationDe: "Mehrere Nachbarn helfen einander. Das plurale Subjekt tauscht die Handlung aus, weshalb die reziproke Lesart durch den Kontext gestützt wird.", explanationEn: "Several neighbors help one another. The plural participants exchange the action, so context supports the reciprocal reading." }
    ],
    recallPromptDe: "Fasse den Tag auf Spanisch zusammen und verwende je ein Beispiel für unpersönliches se, passives se, Missgeschick mit Betroffenenpronomen und reziprokes se.",
    recallPromptEn: "Summarize the day in Spanish using one example each of impersonal se, passive se, accidental se with an affected-person pronoun, and reciprocal se.",
    modelSummary: "En el barrio se vive bien y se alquilan habitaciones; se entrevistó a candidatos, se me olvidaron documentos y los vecinos se ayudaron y se enviaron información."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const existing = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (existing.length !== entries.length) throw new Error(`B2 relatives/se input requires ${entries.length} lessons, found ${existing.length}.`);
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 22 : 18 } });
  }
  console.log(`Seeded connected input for ${entries.length} B2 relative-clause and se packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
