const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const packages = [
  {
    slug: "a2-algo-alguien-nada-nadie",
    topicSlug: "indefinite-people-things",
    topicTitle: "Algo, Alguien, Nada, and Nadie",
    topicDescription: "Unknown people and things, their negative counterparts, and Spanish negative-word placement.",
    title: "Talk about Someone, Something, Nobody, and Nothing",
    summary: "Distinguish people from things and place nada or nadie correctly before or after the verb.",
    order: 831.85,
    imageKey: "people-and-family:15",
    sentences: [
      ["Quiero hacer algo diferente hoy.", "I want to do something different today.", "Algo refers to an unspecified thing or activity."],
      ["Hay alguien en la recepción.", "There is someone at reception.", "Alguien refers to an unspecified person."],
      ["No necesito nada más.", "I do not need anything else.", "After the verb, nada works with no before the verb."],
      ["No hay nadie en la oficina.", "There is nobody in the office.", "After the verb, nadie remains inside a negative frame with no."],
      ["Nada funciona hoy.", "Nothing is working today.", "A negative word before the verb already makes the clause negative."],
      ["Nadie sabe la respuesta.", "Nobody knows the answer.", "Nadie before the verb does not need an additional no."]
    ],
    readingJson: {
      title: "Una persona desconocida y una solución todavía abierta",
      titleEs: "Una persona desconocida y una solución todavía abierta",
      titleEn: "An Unknown Person and a Solution Still Open",
      inputMode: "reading",
      paragraphs: [
        "Eva llega temprano a la oficina, pero no hay nadie en la recepción. Oye algo en la sala de reuniones y pregunta si hay alguien allí. Nadie responde y nada parece funcionar en el teléfono de la entrada.",
        "Después llega un compañero. Eva necesita hablar con alguien de informática porque no sabe qué ocurre, pero todavía no necesita nada concreto: primero quiere entender el problema. El compañero conoce a una persona que puede ayudar."
      ],
      questions: [
        { questionDe: "Welche Wörter beziehen sich im Text auf eine unbekannte Person?", questionEn: "Which words refer to an unknown person in the text?", optionsDe: ["Alguien und nadie", "Algo und nada", "Allí und primero"], optionsEn: ["Alguien and nadie", "Algo and nada", "Allí and primero"], correct: 0, explanationDe: "Alguien bezeichnet eine nicht näher bestimmte Person; nadie ist das negative Gegenstück und schließt eine Person aus.", explanationEn: "Alguien refers to an unspecified person; nadie is its negative counterpart and excludes any person." },
        { questionDe: "Warum steht in nadie responde kein zusätzliches no?", questionEn: "Why does nadie responde not add no?", optionsDe: ["Nadie steht bereits vor dem Verb und trägt die Verneinung", "Responder kann nicht verneint werden", "Nadie bedeutet hier jemand"], optionsEn: ["Nadie already precedes the verb and carries the negation", "Responder cannot be negated", "Nadie means someone here"], correct: 0, explanationDe: "Steht nada oder nadie vor dem Verb, verneint dieses Wort den Satz bereits. Hinter dem Verb benötigt es dagegen normalerweise no vor dem Verb.", explanationEn: "When nada or nadie precedes the verb, it already negates the clause. After the verb, it normally requires no before the verb." }
      ],
      orientationDe: "Trenne zuerst Person und Sache: alguien/nadie beziehen sich auf Personen, algo/nada auf Sachen oder Inhalte. Prüfe danach die Position: Vor dem Verb genügt das negative Wort; hinter dem Verb steht zusätzlich no vor dem Verb.",
      orientationEn: "First separate person from thing: alguien/nadie refer to people, algo/nada to things or content. Then check position: before the verb the negative word is enough; after the verb, add no before the verb.",
      recallPromptDe: "Beschreibe auf Spanisch, wen Eva am Anfang nicht findet, was sie hört, mit wem sie sprechen muss und ob sie bereits etwas Konkretes benötigt. Verwende alguien, nadie, algo und nada.",
      recallPromptEn: "Describe in Spanish whom Eva cannot find at first, what she hears, whom she needs to speak to, and whether she already needs anything specific. Use alguien, nadie, algo, and nada.",
      modelSummary: "No hay nadie en la recepción; Eva oye algo, necesita hablar con alguien y todavía no necesita nada concreto."
    }
  },
  {
    slug: "a2-siempre-nunca-tambien-tampoco",
    topicSlug: "positive-negative-agreement",
    topicTitle: "Siempre, Nunca, También, and Tampoco",
    topicDescription: "Frequency and agreement words that extend positive and negative statements without translating word by word.",
    title: "Express Always, Never, Also, and Neither",
    summary: "Connect frequency and agreement to the polarity of the first statement.",
    order: 831.86,
    imageKey: "daily-actions:20",
    sentences: [
      ["Siempre desayuno antes de trabajar.", "I always eat breakfast before working.", "Siempre presents the routine as consistent."],
      ["Nunca trabajo los domingos.", "I never work on Sundays.", "Nunca before the verb carries the negative meaning without no."],
      ["No trabajo nunca los domingos.", "I never work on Sundays, with nunca after the verb.", "Nunca after the verb appears with no before the verb."],
      ["A mí también me gusta caminar.", "I also like walking.", "También agrees with a positive statement."],
      ["A mí tampoco me gusta conducir.", "I do not like driving either.", "Tampoco agrees with a negative statement."],
      ["La calefacción tampoco funciona.", "The heating does not work either.", "Tampoco before the verb already makes the added statement negative."]
    ],
    readingJson: {
      title: "Dos rutinas, una coincidencia positiva y otra negativa",
      titleEs: "Dos rutinas, una coincidencia positiva y otra negativa",
      titleEn: "Two Routines, One Positive Match, and One Negative Match",
      inputMode: "listening",
      paragraphs: [
        "Marta siempre desayuna antes de trabajar y nunca conduce a la oficina. Luis también desayuna temprano, pero normalmente va en autobús. Marta dice: «Me gusta caminar». Luis responde: «A mí también».",
        "Los domingos Marta no trabaja nunca. Luis tampoco trabaja ese día. Cuando Marta explica que no le gusta conducir con tráfico, Luis responde: «A mí tampoco». También y tampoco mantienen la dirección positiva o negativa de la idea anterior."
      ],
      questions: [
        { questionDe: "Warum antwortet Luis auf me gusta caminar mit a mí también?", questionEn: "Why does Luis answer me gusta caminar with a mí también?", optionsDe: ["Er teilt eine positive Aussage", "Er widerspricht Marta", "Er sagt, dass er nie läuft"], optionsEn: ["He shares a positive statement", "He disagrees with Marta", "He says he never walks"], correct: 0, explanationDe: "También fügt dieselbe positive Aussage für eine weitere Person hinzu. Luis bestätigt damit, dass auch ihm das Spazierengehen gefällt.", explanationEn: "También adds the same positive statement for another person. Luis confirms that he also likes walking." },
        { questionDe: "Welche Antwort übernimmt eine negative Aussage?", questionEn: "Which reply carries forward a negative statement?", optionsDe: ["A mí tampoco", "A mí también", "Siempre"], optionsEn: ["A mí tampoco", "A mí también", "Siempre"], correct: 0, explanationDe: "Tampoco stimmt einer negativen Aussage zu oder fügt einen zweiten negativen Sachverhalt hinzu; también gehört dagegen zu einer positiven Aussage.", explanationEn: "Tampoco agrees with a negative statement or adds another negative fact; también instead follows a positive statement." }
      ],
      orientationDe: "Ordne zuerst die Bedeutung: siempre und nunca beschreiben Häufigkeit; también und tampoco reagieren auf die Richtung einer Aussage. Positive Aussage plus Übereinstimmung ergibt también, negative Aussage plus Übereinstimmung ergibt tampoco.",
      orientationEn: "First identify meaning: siempre and nunca describe frequency; también and tampoco follow the polarity of a statement. Positive agreement uses también, negative agreement uses tampoco.",
      recallPromptDe: "Vergleiche auf Spanisch Martas und Luis' Routinen: Was tun beide früh, was tun sie sonntags nie, welche positive Vorliebe teilen sie und welche negative Haltung teilen sie?",
      recallPromptEn: "Compare Marta's and Luis's routines in Spanish: what do both do early, what do they never do on Sundays, which positive preference and negative attitude do they share?",
      modelSummary: "Marta siempre desayuna temprano y Luis también; ella nunca trabaja los domingos y Luis tampoco; a Marta no le gusta conducir con tráfico y a Luis tampoco."
    }
  },
  {
    slug: "checkpoint-a2-indefinite-negative-words",
    topicSlug: "indefinite-negative-checkpoint",
    topicTitle: "Indefinite and Negative Words Checkpoint",
    topicDescription: "Integrated person, thing, frequency, agreement, and negative-word placement in a practical exchange.",
    title: "A2 Indefinite and Negative Words Checkpoint",
    summary: "Use positive and negative word pairs in a connected plan and problem-solving exchange.",
    order: 831.87,
    imageKey: "communication-repair:15",
    checkpoint: true,
    sentences: [
      ["¿Quieres hacer algo después del trabajo?", "Do you want to do something after work?", "Algo opens an unspecified activity choice."],
      ["No, hoy no quiero hacer nada.", "No, today I do not want to do anything.", "Nada after the verb stays inside the no frame."],
      ["¿Hay alguien disponible para ayudarnos?", "Is anyone available to help us?", "Alguien asks about an unspecified available person without requiring that person to be identified."],
      ["No hay nadie aquí ahora.", "There is nobody here now.", "Nadie after hay requires the initial no."],
      ["Yo tampoco conozco a nadie disponible.", "I do not know anyone available either.", "Tampoco and nadie coherently extend the negative context."],
      ["Por la mañana siempre hay alguien en la recepción.", "In the morning there is always someone at reception.", "Siempre and alguien combine a recurring time with an unspecified person."]
    ],
    readingJson: {
      title: "Un plan aplazado y una ayuda todavía posible",
      titleEs: "Un plan aplazado y una ayuda todavía posible",
      titleEn: "A Delayed Plan and Help That Is Still Possible",
      inputMode: "listening",
      paragraphs: [
        "Nora pregunta a Pablo si quiere hacer algo después del trabajo. Pablo responde que hoy no quiere hacer nada porque tiene un problema en casa. Necesita hablar con alguien del servicio técnico, pero no hay nadie disponible ahora.",
        "Nora tampoco conoce a nadie disponible esta tarde. Recuerda que por la mañana siempre hay alguien en la recepción y propone llamar temprano. Pablo acepta: hoy nadie puede ayudar, pero mañana pueden buscar a alguien y después hacer algo juntos."
      ],
      questions: [
        { questionDe: "Warum können Nora und Pablo heute niemanden organisieren?", questionEn: "Why can Nora and Pablo not arrange anyone today?", optionsDe: ["Jetzt ist niemand verfügbar und Nora kennt ebenfalls niemanden", "Pablo braucht keine Hilfe", "Die Rezeption ist immer geschlossen"], optionsEn: ["Nobody is available now and Nora does not know anyone either", "Pablo needs no help", "Reception is always closed"], correct: 0, explanationDe: "No hay nadie disponible und Nora tampoco conoce a nadie verbinden zwei negative Informationen zu derselben aktuellen Grenze.", explanationEn: "No hay nadie disponible and Nora tampoco conoce a nadie connect two negative facts about the same current limitation." },
        { questionDe: "Welche Information hält eine Lösung für morgen offen?", questionEn: "Which information keeps a solution open for tomorrow?", optionsDe: ["Por la mañana siempre hay alguien en la recepción", "Hoy no quiero hacer nada", "Nadie puede ayudar hoy"], optionsEn: ["In the morning there is always someone at reception", "Today I do not want to do anything", "Nobody can help today"], correct: 0, explanationDe: "Siempre und alguien bilden hier eine positive regelmäßige Erwartung für den Morgen; daraus entsteht der konkrete nächste Schritt, morgen früh anzurufen.", explanationEn: "Siempre and alguien form a positive recurring expectation for the morning, creating the concrete next step of calling early tomorrow." }
      ],
      orientationDe: "Löse jede Aussage in drei Entscheidungen: Person oder Sache, positiv oder negativ, und Position vor oder hinter dem Verb. Prüfe bei einer Reaktion zusätzlich, ob du mit también einer positiven oder mit tampoco einer negativen Aussage zustimmst.",
      orientationEn: "Resolve each statement through three choices: person or thing, positive or negative, and position before or after the verb. For a reply, also decide whether también agrees positively or tampoco agrees negatively.",
      recallPromptDe: "Erzähle auf Spanisch, welchen Plan Nora vorschlägt, warum Pablo heute nichts unternehmen möchte, wen beide heute nicht finden und welche regelmäßige Möglichkeit morgen besteht.",
      recallPromptEn: "Explain in Spanish what Nora suggests, why Pablo does not want to do anything today, whom they cannot find today, and which recurring possibility exists tomorrow.",
      modelSummary: "Pablo no quiere hacer nada y no hay nadie disponible; Nora tampoco conoce a nadie, pero por la mañana siempre hay alguien en la recepción."
    }
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`, `${plain}?`];
};

function checks(input) {
  const sentences = input.sentences;
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: sentences[0][1], answer: { correct: sentences[0][0], goal: "indefinite_negative_meaning" }, options: sentences.slice(0, 3).map((item, index) => [item[0], index === 0]) },
    { key: "contrast", type: ExerciseType.MULTIPLE_CHOICE, question: sentences[3][1], answer: { correct: sentences[3][0], goal: "indefinite_negative_contrast" }, options: [sentences[3], sentences[1], sentences[4]].map((item, index) => [item[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: sentences[1][1], answer: { correctWords: tokens(sentences[1][0]), goal: "indefinite_negative_position" } },
    { key: "translate", type: ExerciseType.TRANSLATION, question: sentences[2][1], answer: { correct: sentences[2][0], accepted: accepted(sentences[2][0]), goal: "indefinite_negative_production" } },
    { key: "listen", type: ExerciseType.LISTENING_DICTATION, question: "Type what you hear.", answer: { correct: sentences[4][0], audioText: sentences[4][0], accepted: accepted(sentences[4][0]), goal: "indefinite_negative_listening" } },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: sentences[5][1], answer: { correct: sentences[5][0], accepted: accepted(sentences[5][0]), goal: "indefinite_negative_recall" } },
    { key: "second-production", type: ExerciseType.TRANSLATION, question: sentences[4][1], answer: { correct: sentences[4][0], accepted: accepted(sentences[4][0]), goal: "indefinite_negative_production" } },
    { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.checkpoint ? "Say that you do not know anyone available either." : input.topicSlug === "positive-negative-agreement" ? "Agree that you do not like driving either." : "Say that nobody is in the office.", answer: { correct: input.checkpoint ? "Yo tampoco conozco a nadie disponible." : input.topicSlug === "positive-negative-agreement" ? "A mí tampoco me gusta conducir." : "No hay nadie en la oficina.", accepted: accepted(input.checkpoint ? "Yo tampoco conozco a nadie disponible." : input.topicSlug === "positive-negative-agreement" ? "A mí tampoco me gusta conducir." : "No hay nadie en la oficina."), goal: "indefinite_negative_dialogue" } }
  ];
}

async function seedIndefiniteNegativeWords(client = prisma) {
  const groupSlugs = ["essential-words", "useful-phrases"];
  const groups = await client.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  for (const input of packages) {
    const topic = await client.grammarTopic.upsert({
      where: { slug: input.topicSlug },
      update: { title: input.topicTitle, description: input.topicDescription, cefrLevel: "A2", imageKey: input.imageKey },
      create: { slug: input.topicSlug, title: input.topicTitle, description: input.topicDescription, cefrLevel: "A2", imageKey: input.imageKey }
    });
    const lessonData = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "A2",
      theme: input.checkpoint ? "Checkpoint" : "Indefinite and Negative Words",
      situation: input.checkpoint ? "coordinating a plan while help is unavailable" : "talking about unspecified people, things, routines, and agreement",
      imageKey: input.imageKey,
      outcomesJson: ["You can separate references to people from references to things.", "You can place Spanish negative words before or after the verb.", "You can extend positive and negative statements with matching agreement words."],
      conceptKeys: ["a2", "indefinite-words", "negative-concord", input.topicSlug],
      readingJson: input.readingJson,
      reviewSummary: input.summary,
      order: input.order,
      estimatedMinutes: input.checkpoint ? 16 : 15,
      topicId: topic.id
    };
    const lesson = await client.lesson.upsert({
      where: { slug: input.slug },
      update: { ...lessonData, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } },
      create: { slug: input.slug, ...lessonData, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } }
    });
    await client.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await client.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    const keep = [];
    for (let index = 0; index < authored.length; index += 1) {
      const check = authored[index];
      const slug = `${input.slug}-${check.key}`;
      keep.push(slug);
      const data = { lessonId: lesson.id, topicId: topic.id, type: check.type, prompt: "Choose and place an indefinite or negative word", instruction: "Identify person or thing, positive or negative meaning, and position relative to the verb.", questionText: check.question, answerJson: check.answer, explanation: "The word pair, sentence polarity, and position work together; Spanish can keep no with a later negative word.", difficulty: input.checkpoint ? 4 : 3, order: index + 1, xpReward: 13, imageKey: input.imageKey };
      const exercise = await client.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
      await client.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
      if (check.options) await client.exerciseOption.createMany({ data: check.options.map(([text, isCorrect], optionIndex) => ({ exerciseId: exercise.id, text, value: text, isCorrect, order: optionIndex + 1 })) });
    }
    await client.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-`, notIn: keep } } });
  }
}

if (require.main === module) {
  seedIndefiniteNegativeWords()
    .then(() => console.log(`Seeded ${packages.length} A2 indefinite and negative word packages.`))
    .catch((error) => { console.error(error); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
}

module.exports = { checks, packages, seedIndefiniteNegativeWords };
