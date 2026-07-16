const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b1-show-interest-follow-up", title: "Show Interest and Ask a Useful Follow-up", order: 1312.1, imageKey: "conversation-and-opinion:2",
    summary: "React to one detail, ask an open or focused follow-up, and listen for information that can carry the exchange forward.", situation: "talking to someone after class",
    sentences: [
      ["¡Qué bien! ¿Qué fue lo que más te gustó?", "That is great! What did you like most?", "A reaction plus a focused open question gives the other person something meaningful to develop."],
      ["¿Y cómo empezaste a hacerlo?", "And how did you start doing it?", "Cómo invites a process or short story rather than a yes-or-no answer."],
      ["Entonces, ¿vas allí todos los fines de semana?", "So, do you go there every weekend?", "Entonces connects the question to information already heard."],
      ["¿Te refieres al curso de la universidad?", "Do you mean the university course?", "A focused clarification prevents a false follow-up."],
      ["Ah, entiendo. ¿Y qué pasó después?", "Ah, I understand. And what happened next?", "A listening signal plus a sequence question keeps attention on the speaker's story."]
    ],
    readingJson: {
      title: "Escuchar un detalle y convertirlo en el siguiente turno", inputMode: "listening",
      orientationDe: "Suche nicht sofort ein neues Thema. Reagiere auf ein konkretes Wort des Gegenübers und frage nach Grund, Ablauf, Häufigkeit oder nächstem Ereignis. So entsteht der nächste Gesprächszug aus dem bereits Gesagten.",
      orientationEn: "Do not search for a new topic immediately. React to one concrete detail and ask about reason, process, frequency, or the next event. The next turn then grows from what was already said.",
      paragraphs: [
        "Nora cuenta que el sábado hizo una excursión con un grupo nuevo. Leo no responde solo con qué bien. Le pregunta qué parte le gustó más y descubre que disfrutó especialmente de una conversación durante el camino.",
        "Después pregunta cómo conoció al grupo. Nora explica que vio un anuncio en la universidad. Leo confirma a qué curso se refiere y pregunta si piensa volver el próximo fin de semana. Cada pregunta nace de un detalle anterior."
      ],
      questions: [
        { questionDe: "Warum wirkt Leos Gespräch nicht wie ein Verhör?", questionEn: "Why does Leo's conversation not feel like an interrogation?", optionsDe: ["Er reagiert und knüpft jede Frage an Noras vorherige Information", "Er stellt möglichst viele unverbundene Fragen", "Er erzählt nur von sich"], optionsEn: ["He reacts and links each question to Nora's previous information", "He asks as many unrelated questions as possible", "He only talks about himself"], correct: 0, explanationDe: "Reaktion und inhaltlicher Anschluss zeigen echtes Zuhören; die Fragen bilden eine erkennbare Kette.", explanationEn: "Reaction and topical connection demonstrate listening; the questions form a recognizable chain." },
        { questionDe: "Welche neue Information ermöglicht die Frage nach dem nächsten Wochenende?", questionEn: "Which new information enables the question about next weekend?", optionsDe: ["Nora hat die Gruppe über einen Universitätskurs gefunden", "Leo kennt den Weg nicht", "Die Wanderung wurde abgesagt"], optionsEn: ["Nora found the group through a university course", "Leo does not know the route", "The hike was canceled"], correct: 0, explanationDe: "Die geklärte Gruppenzugehörigkeit macht eine Frage nach regelmäßiger oder künftiger Teilnahme sinnvoll.", explanationEn: "Clarifying the group makes a question about regular or future participation meaningful." }
      ],
      recallPromptDe: "Reagiere auf Spanisch auf jemanden, der von einem neuen Hobby erzählt: eine echte Reaktion, eine offene Anschlussfrage, eine gezielte Klärung und eine Frage zum nächsten Ereignis.",
      recallPromptEn: "Respond in Spanish to someone describing a new hobby: give a genuine reaction, an open follow-up, a focused clarification, and a question about the next event.",
      modelSummary: "Leo escucha detalles concretos, reacciona a la experiencia de Nora, pregunta qué le gustó, aclara cómo conoció al grupo y conecta esa información con un posible plan futuro."
    }
  },
  {
    slug: "b1-expand-return-answer", title: "Expand a Short Answer and Return the Conversation", order: 1312.2, imageKey: "conversation-and-opinion:3",
    summary: "Replace conversational dead ends with a small answer pattern: direct answer, one useful detail, and a related return question.", situation: "having a casual conversation during a break",
    sentences: [
      ["Muy bien, gracias. Esta mañana terminé un proyecto importante.", "Very well, thank you. This morning I finished an important project.", "One concrete detail gives the listener material for a natural follow-up."],
      ["Estoy un poco cansada porque dormí mal, pero todo va bien.", "I am a little tired because I slept badly, but everything is going well.", "A reason and contrast develop an honest answer without becoming a long monologue."],
      ["Hoy voy a cenar con unos amigos. ¿Y tú, qué planes tienes?", "Today I am going to have dinner with some friends. And you, what plans do you have?", "A related return question shares the conversational space."],
      ["Últimamente estoy aprendiendo a cocinar. ¿Te gusta cocinar?", "Lately I have been learning to cook. Do you like cooking?", "The return question stays inside the detail just introduced."],
      ["No mucho, la verdad. Prefiero salir a caminar cuando tengo tiempo.", "Not much, honestly. I prefer going for a walk when I have time.", "A negative answer still adds an alternative that keeps the topic usable."]
    ],
    readingJson: {
      title: "De una respuesta mínima a un intercambio equilibrado",
      orientationDe: "Baue eine kurze Antwort mit drei Teilen aus: direkte Antwort, genau ein konkretes Detail und eine passende Rückfrage. Auch ein Nein braucht eine Alternative, damit das Gegenüber nicht ohne Anschluss dasteht.",
      orientationEn: "Expand a short answer with three parts: direct answer, exactly one concrete detail, and a related return question. Even a no needs an alternative so the other person still has a way forward.",
      paragraphs: [
        "En una pausa, Carla pregunta a Amir cómo está. Amir responde que está bien y añade que esa mañana terminó un proyecto importante. Carla puede entonces preguntarle por el proyecto sin tener que inventar un tema nuevo.",
        "Después Amir cuenta que cenará con unos amigos y devuelve la conversación con una pregunta sobre los planes de Carla. Ella no tiene planes parecidos, pero menciona que prefiere caminar. La respuesta negativa abre una alternativa en lugar de cerrar el intercambio."
      ],
      questions: [
        { questionDe: "Welcher Teil liefert Carla den natürlichen Anschluss?", questionEn: "Which part gives Carla a natural way to continue?", optionsDe: ["Das konkrete Detail über das beendete Projekt", "Nur das Wort bien", "Die Begrüßung vor der Pause"], optionsEn: ["The concrete detail about the completed project", "Only the word bien", "The greeting before the break"], correct: 0, explanationDe: "Das Detail erzeugt ein gemeinsames Gesprächsthema, während bien allein kaum neue Information enthält.", explanationEn: "The detail creates shared conversational material, while bien alone contains little new information." },
        { questionDe: "Wie verhindert Carla nach ihrer negativen Antwort einen Gesprächsabbruch?", questionEn: "How does Carla prevent the conversation from ending after her negative answer?", optionsDe: ["Sie nennt mit Spazierengehen eine echte Alternative", "Sie wiederholt no dreimal", "Sie wechselt wortlos den Ort"], optionsEn: ["She names walking as a genuine alternative", "She repeats no three times", "She silently changes location"], correct: 0, explanationDe: "Die Alternative zeigt ihre eigene Präferenz und bietet Amir sofort einen neuen möglichen Anschluss.", explanationEn: "The alternative reveals her own preference and immediately offers Amir another possible connection." }
      ],
      recallPromptDe: "Beantworte auf Spanisch drei typische Smalltalkfragen mit dem Dreischritt Antwort, ein Detail, passende Rückfrage. Formuliere mindestens einmal ein ehrliches Nein mit einer anschlussfähigen Alternative.",
      recallPromptEn: "Answer three common small-talk questions in Spanish using direct answer, one detail, and a related return question. Include one honest no with a usable alternative.",
      modelSummary: "Amir erweitert eine kurze Antwort um ein konkretes Projekt, teilt danach einen persönlichen Plan und gibt die Gesprächsrolle zurück; Carla hält selbst eine negative Antwort mit einer Alternative offen."
    }
  },
  {
    slug: "b1-tell-short-anecdote", title: "Tell a Short Anecdote Without Losing the Listener", order: 1312.3, imageKey: "conversation-and-opinion:6",
    summary: "Tell a bounded personal anecdote with setting, change, reaction, outcome, and a clear hand-back to the listener.", situation: "sharing something that happened at the weekend",
    sentences: [
      ["El sábado me pasó algo curioso en el mercado.", "On Saturday something curious happened to me at the market.", "The opening gives time, place, and a reason to listen."],
      ["Estaba buscando fruta cuando oí mi nombre.", "I was looking for fruit when I heard my name.", "Background plus a bounded event creates a clear change."],
      ["Resulta que era una amiga a la que no veía desde hacía años.", "It turned out to be a friend whom I had not seen for years.", "Resulta que reveals the meaningful surprise."],
      ["Nos hizo mucha ilusión y terminamos tomando un café juntas.", "We were delighted and ended up having coffee together.", "Reaction and outcome complete the event rather than adding endless detail."],
      ["¿Te ha pasado alguna vez algo parecido?", "Has anything similar ever happened to you?", "A related hand-back turns a monologue into shared conversation."]
    ],
    readingJson: {
      title: "Una mini-historia con principio, cambio y devolución", inputMode: "listening",
      orientationDe: "Eine Gesprächsanekdote braucht keine vollständige Chronik. Setze kurz Zeit und Ort, markiere die überraschende Veränderung, nenne Reaktion und Ergebnis und gib das Thema anschließend mit einer verwandten Frage zurück.",
      orientationEn: "A conversational anecdote does not need a complete chronicle. Briefly set time and place, mark the surprising change, give reaction and outcome, then return the topic with a related question.",
      paragraphs: [
        "El sábado, Elena estaba comprando fruta en el mercado cuando alguien dijo su nombre. Al principio no reconoció la voz. Era Paula, una antigua compañera a la que no veía desde la universidad.",
        "Las dos se alegraron mucho y decidieron tomar un café cerca del mercado. Elena cuenta solo los detalles que explican la sorpresa y el resultado. Al terminar, pregunta a su interlocutor si alguna vez ha vivido un encuentro parecido."
      ],
      questions: [
        { questionDe: "Welche Funktion hat der erste Satz der Geschichte?", questionEn: "What function does the first sentence of the story have?", optionsDe: ["Er setzt Zeit, Ort und einen Grund zuzuhören", "Er erklärt bereits jede Einzelheit", "Er fordert sofort einen Themenwechsel"], optionsEn: ["It sets time, place, and a reason to listen", "It already explains every detail", "It immediately requests a topic change"], correct: 0, explanationDe: "Der Rahmen orientiert den Hörer und algo curioso erzeugt eine begrenzte Erwartung auf eine Veränderung.", explanationEn: "The frame orients the listener and algo curioso creates a bounded expectation of a change." },
        { questionDe: "Warum endet Elena mit einer Frage nach einer ähnlichen Erfahrung?", questionEn: "Why does Elena end with a question about a similar experience?", optionsDe: ["Sie gibt das gemeinsame Thema an die andere Person zurück", "Sie bezweifelt ihre eigene Geschichte", "Sie möchte alle Namen wiederholen"], optionsEn: ["She returns the shared topic to the other person", "She doubts her own story", "She wants to repeat every name"], correct: 0, explanationDe: "Die Frage bewahrt das Thema, beendet aber den eigenen längeren Redezug und schafft Gegenseitigkeit.", explanationEn: "The question preserves the topic while ending her longer turn and creating reciprocity." }
      ],
      recallPromptDe: "Erzähle auf Spanisch eine Mini-Anekdote in fünf Schritten: Zeit und Ort, Ausgangshandlung, unerwartete Veränderung, Reaktion mit Ergebnis und eine verwandte Frage an dein Gegenüber.",
      recallPromptEn: "Tell a mini-anecdote in Spanish in five steps: time and place, starting action, unexpected change, reaction with outcome, and a related question for your listener.",
      modelSummary: "Elena sitúa un sábado en el mercado, introduce una voz inesperada, revela el encuentro con una antigua amiga, resume la alegría y el café y devuelve el tema con una pregunta relacionada."
    }
  },
  {
    slug: "b1-react-personal-news", title: "Respond to Positive and Difficult Personal News", order: 1312.4, imageKey: "conversation-and-opinion:8",
    summary: "Match a response to positive, uncertain, or difficult news before asking what the other person wants to share or needs next.", situation: "responding when a friend shares personal news",
    sentences: [
      ["¡Enhorabuena! Me alegro mucho por ti.", "Congratulations! I am very happy for you.", "The response matches clearly positive news before moving to questions."],
      ["Vaya, lo siento. ¿Cómo estás llevando la situación?", "Oh, I am sorry. How are you coping with the situation?", "Acknowledgment comes before an open question about the person's experience."],
      ["Entiendo que estés preocupado. ¿Quieres hablar de ello?", "I understand that you are worried. Do you want to talk about it?", "The question offers space without forcing disclosure."],
      ["No sé muy bien qué decir, pero estoy aquí si necesitas algo.", "I am not quite sure what to say, but I am here if you need anything.", "Honest presence is safer than invented reassurance."],
      ["¡Qué emoción! ¿Cuándo empiezas el nuevo trabajo?", "How exciting! When do you start the new job?", "A matching reaction leads into a relevant practical detail."]
    ],
    readingJson: {
      title: "Reaccionar primero y preguntar sin apropiarse de la noticia",
      orientationDe: "Ordne zuerst ein, ob die Nachricht positiv, schwierig oder noch unsicher ist. Reagiere auf diese Bedeutung, bevor du fragst. Bei Belastendem bietest du Raum oder Hilfe an, ohne Gefühle kleinzureden oder Lösungen aufzudrängen.",
      orientationEn: "First decide whether the news is positive, difficult, or still uncertain. Respond to that meaning before asking. With difficult news, offer space or help without minimizing feelings or imposing solutions.",
      paragraphs: [
        "Marta cuenta que ha conseguido un trabajo nuevo. Luis la felicita y pregunta cuándo empieza. No cambia inmediatamente a su propia experiencia laboral, porque primero deja espacio para la noticia de Marta.",
        "Más tarde, Jaime explica que quizá tenga que mudarse y que está preocupado. Luis reconoce esa preocupación y pregunta si quiere hablar. Como Jaime todavía no sabe qué necesita, Luis no promete que todo será fácil; simplemente ofrece estar disponible."
      ],
      questions: [
        { questionDe: "Warum erzählt Luis nach Martas Nachricht nicht sofort von seinem eigenen Beruf?", questionEn: "Why does Luis not immediately talk about his own job after Marta's news?", optionsDe: ["Er lässt ihre positive Nachricht zunächst bei ihr", "Er hat das Wort trabajo nicht verstanden", "Er will das Gespräch beenden"], optionsEn: ["He initially keeps the focus on her positive news", "He did not understand the word trabajo", "He wants to end the conversation"], correct: 0, explanationDe: "Glückwunsch und passende Nachfrage zeigen Anteilnahme, ohne die Aufmerksamkeit sofort auf sich selbst zu ziehen.", explanationEn: "Congratulations and a relevant question show engagement without immediately redirecting attention to himself." },
        { questionDe: "Was vermeidet Luis bei Jaimes schwieriger Nachricht?", questionEn: "What does Luis avoid with Jaime's difficult news?", optionsDe: ["Ungefragte Gewissheiten und aufgezwungene Lösungen", "Jede Form von Anerkennung", "Die Möglichkeit weiterer Gespräche"], optionsEn: ["Unrequested certainty and imposed solutions", "Every form of acknowledgment", "The possibility of further conversation"], correct: 0, explanationDe: "Er erkennt die Sorge an und bietet Wahlfreiheit; damit respektiert er, was Jaime gerade teilen möchte.", explanationEn: "He acknowledges the worry and offers choice, respecting what Jaime currently wants to share." }
      ],
      recallPromptDe: "Reagiere auf Spanisch auf drei Nachrichten: eine gute, eine belastende und eine unsichere. Benenne zuerst eine passende Reaktion und stelle danach eine respektvolle Frage oder biete Hilfe ohne leere Versprechen an.",
      recallPromptEn: "Respond in Spanish to three pieces of news: one positive, one difficult, and one uncertain. First give a matching response, then ask respectfully or offer help without empty promises.",
      modelSummary: "Luis responde de forma adecuada a noticias positivas y difíciles, mantiene la atención en la otra persona, pregunta por su experiencia y ofrece apoyo sin minimizar sentimientos ni inventar soluciones seguras."
    }
  },
  {
    slug: "b1-shift-return-topic", title: "Change, Pause, and Return to a Topic Naturally", order: 1312.5, imageKey: "conversation-and-opinion:11",
    summary: "Signal a related shift, return after an interruption, and check whether the other person has finished before opening a new topic.", situation: "moving between topics in a longer informal conversation",
    sentences: [
      ["A propósito de viajes, ¿al final fuiste a Valencia?", "Speaking of travel, did you go to Valencia in the end?", "A propósito de links a new question to the current topic."],
      ["Eso me recuerda algo que me pasó el año pasado.", "That reminds me of something that happened to me last year.", "The bridge explains why a personal anecdote is relevant."],
      ["Perdona, te he interrumpido. ¿Qué ibas a decir?", "Sorry, I interrupted you. What were you going to say?", "The repair restores the other person's unfinished turn."],
      ["Antes de cambiar de tema, ¿cómo terminó la historia?", "Before changing the subject, how did the story end?", "The question closes an incomplete thread before shifting."],
      ["Volviendo a lo de antes, ¿ya has tomado una decisión?", "Going back to what we were discussing, have you made a decision yet?", "Volviendo a marks a deliberate return instead of confusing the listener."]
    ],
    readingJson: {
      title: "Mover el tema sin cortar el hilo de la otra persona", inputMode: "listening",
      orientationDe: "Ein Themenwechsel braucht ein sichtbares Gelenk. Zeige den Zusammenhang, schließe einen offenen Erzählfaden oder kündige die Rückkehr an. Wenn du unterbrichst, gibst du den verlorenen Gesprächszug ausdrücklich zurück.",
      orientationEn: "A topic shift needs a visible hinge. Show the connection, close an unfinished story thread, or announce the return. If you interrupt, explicitly restore the lost turn.",
      paragraphs: [
        "Sara habla de un viaje en tren. La historia le recuerda a Tomás un problema parecido, pero él empieza a contarlo antes de que Sara termine. Se da cuenta, se disculpa y le pregunta qué iba a decir.",
        "Cuando Sara termina, Tomás enlaza su experiencia con eso me recuerda. Más tarde cambian de tema. Antes de despedirse, Sara dice volviendo a lo de antes y pregunta si Tomás ya resolvió el problema del tren. Los marcadores conservan el mapa de la conversación."
      ],
      questions: [
        { questionDe: "Was repariert Tomás mit ¿Qué ibas a decir?", questionEn: "What does Tomás repair with ¿Qué ibas a decir?", optionsDe: ["Er gibt Sara ihren unterbrochenen Gesprächszug zurück", "Er bittet um eine Wortübersetzung", "Er eröffnet endgültig sein eigenes Thema"], optionsEn: ["He returns Sara's interrupted turn", "He asks for a word translation", "He permanently opens his own topic"], correct: 0, explanationDe: "Die Frage stellt nicht nur Höflichkeit her, sondern rekonstruiert konkret den verlorenen Redezug.", explanationEn: "The question restores not only politeness but the specific lost turn." },
        { questionDe: "Welche Funktion hat volviendo a lo de antes?", questionEn: "What is the function of volviendo a lo de antes?", optionsDe: ["Es markiert eine bewusste Rückkehr zu einem früheren Gesprächsfaden", "Es beendet jede frühere Aussage", "Es zeigt, dass Sara nicht zugehört hat"], optionsEn: ["It marks a deliberate return to an earlier conversation thread", "It ends every earlier statement", "It shows that Sara did not listen"], correct: 0, explanationDe: "Der Marker hilft beiden Personen, den Bezug trotz zwischenzeitlichem Themenwechsel wiederzufinden.", explanationEn: "The marker helps both people recover the reference despite the intervening topic shift." }
      ],
      recallPromptDe: "Steuere auf Spanisch drei Übergänge: von einem Thema zu einem verwandten, nach einer eigenen Unterbrechung zurück zum Gegenüber und später zurück zu einem früheren offenen Gesprächsfaden.",
      recallPromptEn: "Manage three transitions in Spanish: from one topic to a related one, back to the other person after interrupting, and later back to an earlier unfinished thread.",
      modelSummary: "Tomás reconoce la interrupción y devuelve el turno a Sara, conecta después su propia experiencia con la historia de ella y Sara marca más tarde el regreso al problema anterior del tren."
    }
  },
  {
    slug: "b1-boundary-close-conversation", title: "Set a Boundary and Close a Conversation Politely", order: 1312.6, imageKey: "conversation-and-opinion:15",
    summary: "State a practical limit without rejecting the person, acknowledge the exchange, and leave a clear option for future contact.", situation: "ending a friendly conversation when you need to leave",
    sentences: [
      ["Me encantaría seguir hablando, pero tengo que irme en cinco minutos.", "I would love to keep talking, but I have to leave in five minutes.", "Warmth plus a concrete limit separates the relationship from the practical boundary."],
      ["Antes de irme, cuéntame cómo terminó lo del curso.", "Before I go, tell me how the course situation ended.", "A final focused thread avoids an abrupt disappearance."],
      ["Ha sido muy agradable hablar contigo.", "It has been very nice talking to you.", "The closing explicitly values the exchange."],
      ["¿Te parece si seguimos hablando otro día?", "Would it be okay if we continued talking another day?", "The future option is offered rather than vaguely promised."],
      ["Te escribo mañana y buscamos un momento con calma.", "I will write to you tomorrow and we will find a time without rushing.", "A named next action makes the continuation credible."]
    ],
    readingJson: {
      title: "Cerrar el tiempo disponible sin cerrar la relación",
      orientationDe: "Ein höflicher Abschluss besteht aus Grenze, Wertschätzung und – falls ehrlich gewünscht – einem konkreten nächsten Kontakt. Nenne die verfügbare Zeit früh genug; erfinde keine spätere Verabredung, wenn du sie nicht möchtest.",
      orientationEn: "A polite close consists of a boundary, appreciation, and—if genuinely wanted—a concrete next contact. State the available time early enough; do not invent a future meeting if you do not want one.",
      paragraphs: [
        "Después de clase, Julia y Andrés llevan un rato hablando. Julia debe tomar un autobús y le quedan cinco minutos. En lugar de mirar el teléfono y desaparecer, explica el límite y pregunta brevemente cómo terminó el problema que Andrés estaba contando.",
        "Antes de irse, dice que le ha gustado hablar con él. Como realmente quiere continuar, propone hablar otro día y concreta que escribirá mañana. Andrés entiende que el límite pertenece al tiempo disponible y no a una falta de interés."
      ],
      questions: [
        { questionDe: "Warum wirkt Julias Zeitgrenze nicht wie persönliche Ablehnung?", questionEn: "Why does Julia's time limit not feel like personal rejection?", optionsDe: ["Sie verbindet konkreten Grund, Interesse und Wertschätzung", "Sie verschwindet ohne Erklärung", "Sie behauptet, jedes Gespräch zu hassen"], optionsEn: ["She combines a concrete reason, interest, and appreciation", "She disappears without explanation", "She claims to hate every conversation"], correct: 0, explanationDe: "Die Grenze wird als praktische Zeitangabe sichtbar, während Frage und Abschluss den Wert des Kontakts bestätigen.", explanationEn: "The boundary is visible as a practical time limit, while the question and close confirm the value of the contact." },
        { questionDe: "Was macht die angebotene Fortsetzung glaubwürdig?", questionEn: "What makes the offered continuation credible?", optionsDe: ["Julia nennt mit morgen eine eigene nächste Handlung", "Sie sagt irgendwann vielleicht", "Andrés muss alles organisieren"], optionsEn: ["Julia names her own next action for tomorrow", "She says perhaps sometime", "Andrés must organize everything"], correct: 0, explanationDe: "Ein konkreter nächster Schritt unterscheidet eine echte Fortsetzung von einer bloßen Höflichkeitsformel.", explanationEn: "A concrete next step distinguishes genuine continuation from a mere politeness formula." }
      ],
      recallPromptDe: "Beende auf Spanisch ein freundliches Gespräch: Wärme zeigen, ein konkretes Zeitlimit nennen, einen letzten offenen Punkt schließen, den Austausch wertschätzen und nur bei ehrlicher Absicht einen bestimmten nächsten Kontakt anbieten.",
      recallPromptEn: "End a friendly conversation in Spanish: show warmth, state a concrete time limit, close one open point, appreciate the exchange, and offer a specific next contact only if genuine.",
      modelSummary: "Julia explica su tiempo limitado, mantiene el interés con una última pregunta, valora la conversación y convierte la posible continuación en algo creíble al prometer un mensaje concreto para el día siguiente."
    }
  },
  {
    slug: "checkpoint-b1-everyday-conversation", title: "Checkpoint: Sustain a Natural Everyday Conversation", order: 1312.7, imageKey: "conversation-and-opinion:16", checkpoint: true,
    summary: "Independently sustain a balanced conversation by expanding, following up, telling, reacting, shifting, repairing, and closing.", situation: "meeting an acquaintance and holding an unplanned ten-minute conversation",
    sentences: [
      ["Muy bien, gracias. Hoy por fin terminé un proyecto difícil. ¿Y tú?", "Very well, thank you. Today I finally finished a difficult project. And you?", "Answer, detail, and hand-back open a shared exchange."],
      ["¡Qué alivio! ¿Qué parte te costó más?", "What a relief! Which part was hardest for you?", "A matching reaction and focused follow-up show active listening."],
      ["Eso me recuerda algo que me pasó la semana pasada.", "That reminds me of something that happened to me last week.", "The transition makes a related anecdote relevant."],
      ["Perdona, te he interrumpido. Termina lo que estabas diciendo.", "Sorry, I interrupted you. Finish what you were saying.", "The repair restores the other person's turn directly."],
      ["Volviendo a tu proyecto, ¿qué vas a hacer ahora?", "Going back to your project, what are you going to do now?", "The return marker reopens the earlier thread clearly."],
      ["Me ha encantado verte. Te escribo mañana y seguimos hablando.", "It was lovely seeing you. I will write tomorrow and we can keep talking.", "Appreciation plus a next action closes without ambiguity."]
    ],
    readingJson: {
      title: "Una conversación imprevista que avanza sin guion", inputMode: "listening",
      orientationDe: "Übertrage die ganze Gesprächssteuerung ohne Satz-für-Satz-Hilfe: Antwort ausbauen und zurückgeben, an einem Detail anschließen, eine kurze eigene Geschichte einbetten, passend reagieren, Unterbrechungen reparieren und transparent schließen.",
      orientationEn: "Transfer the full conversation-management chain without sentence-by-sentence help: expand and return an answer, follow one detail, embed a short story, react appropriately, repair interruptions, and close transparently.",
      paragraphs: [
        "Clara se encuentra por casualidad con Iván. Cuando él pregunta cómo está, ella cuenta que acaba de terminar un proyecto difícil y devuelve la pregunta. Iván reacciona al alivio y pregunta qué parte fue más complicada. La respuesta de Clara le recuerda una experiencia relacionada.",
        "Iván empieza su historia, pero interrumpe una explicación de Clara y le devuelve el turno. Más tarde marca que vuelve al proyecto y pregunta por el siguiente paso. Cuando Clara tiene que irse, valora el encuentro y promete una acción concreta: escribirá al día siguiente para continuar."
      ],
      questions: [
        { questionDe: "Welche Kette verwandelt Claras erste Antwort in ein gemeinsames Gespräch?", questionEn: "Which chain turns Clara's first answer into a shared conversation?", optionsDe: ["Antwort, konkretes Detail, Rückgabe, Reaktion und Anschlussfrage", "Nur eine lange Projektbeschreibung", "Mehrere zufällige Themen ohne Reaktion"], optionsEn: ["Answer, concrete detail, hand-back, reaction, and follow-up", "Only a long project description", "Several random topics without reaction"], correct: 0, explanationDe: "Jeder Zug bietet Bedeutung und einen klaren nächsten Anschluss, ohne dass eine Person den Austausch allein tragen muss.", explanationEn: "Each turn offers meaning and a clear next connection without making one person carry the exchange alone." },
        { questionDe: "Welche zwei Reparaturen schützen den Gesprächsfaden?", questionEn: "Which two repairs protect the conversation thread?", optionsDe: ["Unterbrochenen Zug zurückgeben und frühere Thematik ausdrücklich wieder öffnen", "Schneller sprechen und jede Pause vermeiden", "Die eigene Geschichte zweimal beginnen"], optionsEn: ["Restore the interrupted turn and explicitly reopen the earlier topic", "Speak faster and avoid every pause", "Start the same personal story twice"], correct: 0, explanationDe: "Die erste Reparatur stellt das Rederecht wieder her; die zweite stellt nach Zwischenbewegungen den inhaltlichen Bezug wieder her.", explanationEn: "The first repair restores the speaking turn; the second restores topical reference after intervening moves." }
      ],
      recallPromptDe: "Führe auf Spanisch ein ungeplantes Gespräch ohne Modell: kurze Antwort ausbauen und zurückgeben, zweimal an Details anschließen, eine Mini-Anekdote erzählen, auf eine Nachricht reagieren, eine Unterbrechung reparieren und mit konkretem Abschluss enden.",
      recallPromptEn: "Hold an unplanned conversation in Spanish without a model: expand and return a short answer, follow details twice, tell a mini-anecdote, respond to news, repair an interruption, and end with a concrete close.",
      modelSummary: "Clara e Iván amplían respuestas, siguen detalles concretos, conectan una experiencia personal, reparan una interrupción, vuelven claramente al proyecto y cierran el encuentro con aprecio y un próximo contacto."
    }
  }
];

const vocabulary = [
  ["mostrar interés", "to show interest", "phrase", null, "Quiero mostrar interés con una pregunta."],
  ["hacer una pregunta de seguimiento", "to ask a follow-up question", "phrase", null, "Hago una pregunta de seguimiento."],
  ["dar un detalle", "to give a detail", "phrase", null, "Doy un detalle concreto."],
  ["devolver la pregunta", "to return the question", "phrase", null, "Después devuelvo la pregunta."],
  ["por cierto", "by the way", "phrase", null, "Por cierto, ¿cómo está Ana?"],
  ["a propósito de", "speaking of", "phrase", null, "A propósito de viajes, fui a Valencia."],
  ["eso me recuerda", "that reminds me", "phrase", null, "Eso me recuerda una historia."],
  ["volver a lo de antes", "to return to the earlier topic", "phrase", null, "Quiero volver a lo de antes."],
  ["interrumpir", "to interrupt", "verb", null, "Perdona por interrumpir."],
  ["devolver el turno", "to give the turn back", "phrase", null, "Le devuelvo el turno."],
  ["una anécdota", "an anecdote", "noun", "feminine", "Cuenta una anécdota breve."],
  ["algo curioso", "something curious", "phrase", null, "Me pasó algo curioso."],
  ["resulta que", "it turns out that", "phrase", null, "Resulta que ya nos conocíamos."],
  ["terminar haciendo algo", "to end up doing something", "phrase", null, "Terminamos tomando un café."],
  ["alegrarse por alguien", "to be happy for someone", "phrase", null, "Me alegro mucho por ti."],
  ["llevar una situación", "to cope with a situation", "phrase", null, "¿Cómo llevas la situación?"],
  ["ofrecer apoyo", "to offer support", "phrase", null, "Quiero ofrecer apoyo."],
  ["dar espacio", "to give someone space", "phrase", null, "A veces conviene dar espacio."],
  ["cambiar de tema", "to change the subject", "phrase", null, "Antes de cambiar de tema, termina la historia."],
  ["retomar un tema", "to resume a topic", "phrase", null, "Podemos retomar el tema mañana."],
  ["poner un límite", "to set a boundary", "phrase", null, "Pongo un límite con claridad."],
  ["tener que irse", "to have to leave", "phrase", null, "Tengo que irme en cinco minutos."],
  ["seguir en contacto", "to keep in touch", "phrase", null, "Podemos seguir en contacto."],
  ["despedirse", "to say goodbye", "verb", null, "Se despide con amabilidad."]
];

const normalize = (value) => String(value || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñü]+/g, " ").trim();
const accepted = (value) => [...new Set([value, normalize(value), `${normalize(value)}.`, `${normalize(value)}?`, `${normalize(value)}!`])];
const tokenize = (value) => String(value || "").replace(/[¿?¡!.,;:]/g, "").split(/\s+/).filter(Boolean);

const checkpointFunctionalChecks = {
  "checkpoint-b1-everyday-conversation:short-answer": {
    minimumMatched: 2,
    groups: [
      { key: "reaction", labelDe: "passende Reaktion", labelEn: "fitting reaction", required: true, any: ["qué alivio", "me alegro", "qué bien", "entiendo"], notAny: ["no me alegro", "no entiendo"] },
      { key: "follow-up", labelDe: "Anschlussfrage zu einem Detail", labelEn: "detail-based follow-up", required: true, any: ["qué parte", "qué fue", "cuál fue", "qué te costó", "qué resultó"] }
    ]
  },
  "checkpoint-b1-everyday-conversation:dialogue-reply": {
    minimumMatched: 2,
    groups: [
      { key: "repair", labelDe: "Unterbrechung anerkennen", labelEn: "acknowledge the interruption", required: true, any: ["perdona", "lo siento", "disculpa", "te he interrumpido"] },
      { key: "restore-turn", labelDe: "Redezug konkret zurückgeben", labelEn: "restore the speaker's turn", required: true, any: ["termina", "sigue", "continúa", "continua", "qué estabas diciendo", "lo que estabas diciendo"] }
    ]
  },
  "checkpoint-b1-everyday-conversation:write": {
    minimumMatched: 2,
    groups: [
      { key: "appreciation", labelDe: "Wertschätzung", labelEn: "appreciation", required: true, any: ["me ha encantado verte", "me ha gustado verte", "ha sido un placer", "me alegro de verte"], notAny: ["no me ha encantado verte", "no me ha gustado verte", "no ha sido un placer", "no me alegro de verte"] },
      { key: "next-contact", labelDe: "konkreter nächster Kontakt", labelEn: "specific next contact", required: true, any: ["te escribo", "te llamaré", "te llamare", "hablamos mañana", "seguimos hablando", "nos vemos"], notAny: ["no te escribo", "no te llamaré", "no te llamare", "no hablamos mañana", "no seguimos hablando", "no nos vemos"] }
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
    ? { correctWords: tokenize(check.correct), goal: "conversation_flow_word_order" }
    : {
        correct: check.correct,
        accepted: accepted(check.correct),
        goal: "conversation_flow_move",
        rubric: functionalCheck
          ? "Perform the conversational move naturally; equivalent clear Spanish that preserves the relationship and topic is acceptable."
          : "Retrieve the lesson's Spanish conversation move accurately before the checkpoint transfer.",
        ...(functionalCheck ? { functionalCheck } : {})
      };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the Spanish turn that keeps this conversation coherent" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the next Spanish conversation turn" : "Continue the exchange naturally in Spanish",
    instruction: "Identify the current conversation move: react, expand, follow up, tell, hand back, shift, repair, set a boundary, or close. Connect your turn to what was actually said.",
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
    where: { slug: "everyday-conversation-relationships" },
    update: { title: "Everyday Conversation and Relationships", description: "Follow-up questions, expanded answers, short anecdotes, empathic responses, topic movement, interruption repair, boundaries, and natural closings.", cefrLevel: "B1", imageKey: "conversation-and-opinion:2" },
    create: { slug: "everyday-conversation-relationships", title: "Everyday Conversation and Relationships", description: "Follow-up questions, expanded answers, short anecdotes, empathic responses, topic movement, interruption repair, boundaries, and natural closings.", cefrLevel: "B1", imageKey: "conversation-and-opinion:2" }
  });
  const vocabularyGroup = await prisma.vocabularyGroup.upsert({
    where: { slug: "b1-everyday-conversation" },
    update: { title: "B1 Everyday Conversation", description: "Reusable moves for sustaining, balancing, repairing, and closing an everyday conversation.", situation: "holding an unplanned balanced conversation", imageKey: "conversation-and-opinion:2" },
    create: { slug: "b1-everyday-conversation", title: "B1 Everyday Conversation", description: "Reusable moves for sustaining, balancing, repairing, and closing an everyday conversation.", situation: "holding an unplanned balanced conversation", imageKey: "conversation-and-opinion:2" }
  });
  for (const [spanish, english, partOfSpeech, gender, example] of vocabulary) {
    const existing = await prisma.word.findFirst({ where: { groupId: vocabularyGroup.id, spanish } });
    const data = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: vocabularyGroup.id };
    if (existing) await prisma.word.update({ where: { id: existing.id }, data });
    else await prisma.word.create({ data });
  }
  const supportingGroups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["b1-conversation-stories", "b1-plans-reactions"] } } });
  const groups = [vocabularyGroup, ...supportingGroups];
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B1", theme: input.checkpoint ? "Checkpoint" : "Everyday Conversation", situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can expand a short answer and ask follow-up questions grounded in what you heard.", "You can tell a bounded anecdote, respond to personal news, and share the conversational space.", "You can shift, repair, set a boundary, and close a conversation without damaging the relationship."],
      conceptKeys: ["b1", "everyday-conversation", "interaction", input.slug], reviewSummary: input.summary, readingJson: input.readingJson,
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
  console.log(`Seeded ${lessons.length} B1.10 everyday-conversation learning packages and ${vocabulary.length} aligned vocabulary items.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons, vocabulary };
