const { PrismaClient, ExerciseType } = require("@prisma/client");
const { seedContractionsChoice } = require("./seed-a1-contractions-choice");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a1-present-er-verbs", title: "Regular Present -er Verbs", order: 498, imageKey: "daily-actions:5",
    summary: "Build regular present-tense -er forms for eating, drinking, reading, and learning.", situation: "talking about simple everyday actions",
    sentences: [
      ["Yo como pan.", "I eat bread.", "Remove -er and add -o for yo: comer becomes como."],
      ["Tú bebes agua.", "You drink water.", "The regular tú ending for -er verbs is -es."],
      ["Ana lee un libro.", "Ana reads a book.", "The third-person singular ending is -e."],
      ["Nosotros aprendemos español.", "We learn Spanish.", "The regular nosotros ending for -er verbs is -emos."],
      ["Ellos comen en casa.", "They eat at home.", "The regular plural ending for ellos and ellas is -en."]
    ]
  },
  {
    slug: "a1-present-ir-verbs", title: "Regular Present -ir Verbs", order: 501, imageKey: "daily-actions:13",
    summary: "Build regular present-tense -ir forms for living, writing, opening, and sharing.", situation: "describing where people live and what they do",
    sentences: [
      ["Yo vivo en Berlín.", "I live in Berlin.", "Remove -ir and add -o for yo: vivir becomes vivo."],
      ["Tú escribes un mensaje.", "You write a message.", "The regular tú ending for -ir verbs is -es."],
      ["Luis abre la puerta.", "Luis opens the door.", "The third-person singular ending is -e."],
      ["Nosotros vivimos cerca.", "We live nearby.", "The regular nosotros ending for -ir verbs is -imos."],
      ["Ellas comparten la comida.", "They share the food.", "The regular plural ending for ellas is -en."]
    ]
  },
  {
    slug: "a1-present-er-ir-together", title: "Use -er and -ir Verbs Together", order: 504, imageKey: "daily-actions:16",
    summary: "Choose the correct present ending while connecting -er and -ir actions in one account.", situation: "describing a simple study day",
    sentences: [
      ["Como y bebo en casa.", "I eat and drink at home.", "Both first-person forms end in -o."],
      ["Tú lees y escribes en la biblioteca.", "You read and write in the library.", "The tú forms of both regular groups end in -es."],
      ["Marta aprende español y vive en Madrid.", "Marta learns Spanish and lives in Madrid.", "Third-person singular forms of both groups end in -e."],
      ["Nosotros comemos y vivimos juntos.", "We eat and live together.", "Nosotros distinguishes -emos for -er from -imos for -ir."],
      ["Ellos abren los libros y leen.", "They open the books and read.", "Both third-person plural forms end in -en."]
    ]
  },
  {
    slug: "a1-hay-one-and-many", title: "Hay: Say What There Is", order: 507, imageKey: "home-and-objects:15",
    summary: "Use hay unchanged for one thing, several things, questions, and absence.", situation: "saying what is present in a room",
    sentences: [
      ["Hay un libro en la mesa.", "There is a book on the table.", "Hay introduces the existence of one thing."],
      ["Hay tres sillas en la clase.", "There are three chairs in the classroom.", "Hay stays unchanged with plural things."],
      ["¿Hay una cafetería cerca?", "Is there a café nearby?", "Place hay inside question marks to ask whether something exists."],
      ["No hay agua.", "There is no water.", "Put no directly before hay to express absence."],
      ["¿Cuántos libros hay?", "How many books are there?", "Cuántos asks for the number; hay still does not change."]
    ]
  },
  {
    slug: "a1-possessives-family", title: "Possessives with People and Things", order: 510, imageKey: "people-and-pronouns:14",
    summary: "Use mi, tu, su, nuestro, and their plural forms to show whose person or thing is meant.", situation: "introducing family and personal things",
    sentences: [
      ["Mi hermana vive en Madrid.", "My sister lives in Madrid.", "Mi stands before one owned noun."],
      ["Tus amigos comen aquí.", "Your friends eat here.", "Tus agrees with the plural noun amigos, not with the owner."],
      ["Su libro está en la mesa.", "His book is on the table.", "Su can mean his, her, your formal, or their; context identifies the owner."],
      ["Nuestra familia es pequeña.", "Our family is small.", "Nuestra agrees with the feminine singular noun familia."],
      ["Mis padres beben café.", "My parents drink coffee.", "Mis is the plural form used before padres."]
    ]
  },
  {
    slug: "a1-days-and-clock-time", title: "Days and Clock Time", order: 513, imageKey: "weather-and-time:13",
    summary: "Name weekdays and place a simple activity on a day or at a whole clock hour.", situation: "understanding a basic weekly schedule",
    sentences: [
      ["Hoy es lunes.", "Today is Monday.", "Use hoy es plus the day for today's date in a simple schedule."],
      ["La clase es a las ocho.", "The class is at eight.", "Use a las with clock times other than one."],
      ["Trabajo de nueve a cinco.", "I work from nine to five.", "De ... a ... marks the start and end of a time range."],
      ["Los martes estudio español.", "On Tuesdays I study Spanish.", "The plural article plus a weekday expresses a regular weekly habit."],
      ["¿Qué día es hoy?", "What day is it today?", "This fixed question asks for the current weekday."]
    ]
  },
  {
    slug: "a1-months-and-calendar-dates", title: "Months and Calendar Dates", order: 514, imageKey: "weather-and-time:12",
    summary: "Learn the twelve month words through spaced vocabulary and use en plus month or el plus day plus de plus month in complete calendar frames.", situation: "asking and answering about dates",
    sentences: [
      ["Estamos en enero.", "It is January.", "Estar en plus a month places the current point in the calendar."],
      ["Mi cumpleaños es el doce de mayo.", "My birthday is on the twelfth of May.", "A complete date uses el plus number plus de plus month."],
      ["Las vacaciones son en agosto.", "The holidays are in August.", "Use en before a month when no exact day is given."],
      ["El curso empieza en septiembre.", "The course begins in September.", "Month names are normally lowercase in Spanish."],
      ["¿Cuál es la fecha de hoy?", "What is today's date?", "Cuál es la fecha asks for the full calendar date."],
      ["Hoy es el tres de octubre.", "Today is the third of October.", "Hoy es introduces the complete date without an extra preposition."]
    ],
    dialogueCue: "¿Cuál es la fecha de hoy?", dialogueAnswerIndex: 5
  },
  {
    slug: "a1-ask-and-tell-the-hour", title: "Ask and Tell the Hour", order: 515, imageKey: "weather-and-time:13",
    summary: "Distinguish es la una from son las for every other hour and ask when an activity begins.", situation: "checking the time before class",
    sentences: [
      ["¿Qué hora es?", "What time is it?", "This fixed question asks for the current clock time."],
      ["Es la una.", "It is one o'clock.", "One o'clock uses singular es la una."],
      ["Son las dos.", "It is two o'clock.", "Every other hour uses plural son las."],
      ["La clase empieza a las ocho.", "The class begins at eight o'clock.", "An event time uses a la una or a las plus the other hours."],
      ["¿A qué hora empieza la clase?", "What time does the class begin?", "A qué hora asks for the time assigned to an activity."],
      ["Empieza a las ocho.", "It begins at eight o'clock.", "The short answer keeps the complete a las time frame."]
    ],
    dialogueCue: "¿A qué hora empieza la clase?", dialogueAnswerIndex: 5
  },
  {
    slug: "a1-quarter-half-and-minutes", title: "Quarter Hours, Half Hours, and Minutes", order: 516, imageKey: "weather-and-time:13",
    summary: "Add minutes with y, use y cuarto and y media, and count back to the next hour with menos cuarto.", situation: "understanding a more precise clock time",
    sentences: [
      ["Son las dos y cuarto.", "It is quarter past two.", "Y cuarto adds one quarter after the stated hour."],
      ["Son las tres y media.", "It is half past three.", "Y media adds one half hour."],
      ["Son las cinco menos cuarto.", "It is quarter to five.", "Menos cuarto counts back from the following hour."],
      ["Son las seis y diez.", "It is ten past six.", "Use y plus the minute number after the hour."],
      ["Es mediodía.", "It is noon.", "Mediodía names twelve in the middle of the day."],
      ["Es medianoche.", "It is midnight.", "Medianoche names twelve at night."]
    ],
    dialogueCue: "Perdona, ¿qué hora es?", dialogueAnswerIndex: 1
  },
  {
    slug: "a1-simple-schedule-dialogue", title: "Arrange a Simple Time", order: 517, imageKey: "weather-and-time:16",
    summary: "Combine day, availability, a precise time, and final confirmation in a short controlled scheduling exchange.", situation: "agreeing a simple study time",
    sentences: [
      ["¿Te va bien el martes?", "Does Tuesday work for you?", "Te va bien checks whether a proposed day is suitable."],
      ["Sí, el martes está bien.", "Yes, Tuesday is fine.", "Repeat the day so the acceptance is unambiguous."],
      ["¿A qué hora?", "At what time?", "This short question requests the missing time detail."],
      ["A las siete y media.", "At half past seven.", "A las combines with a precise clock time."],
      ["Entonces, el martes a las siete y media.", "So, Tuesday at half past seven.", "Entonces plus day and time confirms the complete arrangement."],
      ["Perfecto, nos vemos el martes.", "Perfect, see you on Tuesday.", "A brief closing follows only after the shared details are confirmed."]
    ],
    dialogueCue: "Entonces, ¿cuándo nos vemos?", dialogueAnswerIndex: 4
  },
  {
    slug: "checkpoint-a1-essential-present", title: "A1.10 Essential Present Checkpoint", order: 518, imageKey: "daily-actions:16", checkpoint: true,
    summary: "Check regular present verbs, hay, possession, calendar dates, and precise schedule language before A2.", situation: "describing and coordinating a complete simple study day",
    sentences: [
      ["Los martes vivo con mi hermana.", "On Tuesdays I live with my sister.", "The sentence combines a weekly marker, an -ir verb, and possession."],
      ["Hay dos clases por la mañana.", "There are two classes in the morning.", "Hay introduces a plural quantity without changing form."],
      ["Mi hermana lee y yo escribo.", "My sister reads and I write.", "The sentence contrasts one -er and one -ir present form."],
      ["Comemos a las dos y media.", "We eat at half past two.", "The -er nosotros form combines with a precise clock time."],
      ["Después abrimos nuestros libros.", "Afterwards we open our books.", "The -ir nosotros form and possessive agree with plural libros."],
      ["No hay clase el viernes.", "There is no class on Friday.", "No directly negates hay and the weekday places the absence in time."],
      ["El curso empieza el tres de septiembre.", "The course begins on the third of September.", "The complete date places the course in the calendar."],
      ["¿A qué hora empieza? Empieza a las ocho y cuarto.", "What time does it begin? It begins at quarter past eight.", "The question and answer preserve the complete precise time frame."]
    ],
    readingJson: {
      title: "Un martes de estudio",
      inputMode: "listening",
      orientationDe: "Höre zuerst auf Datum, Wochentag und genaue Uhrzeiten. Ordne danach die regelmäßigen -er- und -ir-Handlungen sowie hay und die Besitzformen zu.",
      orientationEn: "First listen for the date, weekday, and precise clock times. Then identify the regular -er and -ir actions, hay, and the possessive forms.",
      paragraphs: [
        "El curso empieza el tres de septiembre. Los martes Clara vive con su hermana en Madrid. Hay dos clases y la primera empieza a las ocho y cuarto.",
        "Clara lee y escribe en la biblioteca. Las hermanas comen a las dos y media. Después abren sus libros. El viernes no hay clase."
      ],
      questions: [
        { questionDe: "Wann beginnt die erste Unterrichtsstunde?", questionEn: "When does the first class begin?", optionsDe: ["Um Viertel nach acht", "Um halb zwei", "Um drei Uhr"], optionsEn: ["At quarter past eight", "At half past one", "At three o'clock"], correct: 0, explanationDe: "La primera empieza a las ocho y cuarto ordnet der ersten Unterrichtsstunde eindeutig die genaue Uhrzeit Viertel nach acht zu.", explanationEn: "La primera empieza a las ocho y cuarto clearly assigns quarter past eight to the first class." },
        { questionDe: "Was geschieht am Freitag nicht?", questionEn: "What does not happen on Friday?", optionsDe: ["Unterricht", "Kaffee trinken", "Freunde treffen"], optionsEn: ["Classes", "Drinking coffee", "Meeting friends"], correct: 0, explanationDe: "El viernes no hay clase verneint den Unterricht; anschließend trinken die Schwestern gerade an diesem Tag Kaffee mit Freunden.", explanationEn: "El viernes no hay clase rules out classes; the sisters then drink coffee with friends on that day." }
      ],
      recallPromptDe: "Fasse Claras Kurs auf Spanisch in mindestens sechs kurzen Sätzen zusammen. Verwende das Datum, hay, eine -er-Form, eine -ir-Form, eine Besitzform sowie beide genauen Uhrzeiten.",
      recallPromptEn: "Summarize Clara's course in Spanish in at least six short sentences. Use the date, hay, one -er form, one -ir form, one possessive, and both precise clock times.",
      modelSummary: "El curso empieza el tres de septiembre. Los martes hay dos clases; Clara lee y escribe, come a las dos y media y abre sus libros."
    }
  }
];

const temporalWords = [
  ["lunes", "Monday", "weekday", "Hoy es lunes."], ["martes", "Tuesday", "weekday", "Los martes estudio español."],
  ["miércoles", "Wednesday", "weekday", "La clase es el miércoles."], ["jueves", "Thursday", "weekday", "Trabajo el jueves."],
  ["viernes", "Friday", "weekday", "El viernes no hay clase."], ["sábado", "Saturday", "weekday", "El mercado abre el sábado."],
  ["domingo", "Sunday", "weekday", "El domingo descanso."], ["enero", "January", "month", "Estamos en enero."],
  ["febrero", "February", "month", "El curso termina en febrero."], ["marzo", "March", "month", "Viajo en marzo."],
  ["abril", "April", "month", "La clase empieza en abril."], ["mayo", "May", "month", "Mi cumpleaños es en mayo."],
  ["junio", "June", "month", "Hoy es el veinte de junio."], ["julio", "July", "month", "Trabajo en julio."],
  ["agosto", "August", "month", "Las vacaciones son en agosto."], ["septiembre", "September", "month", "El curso empieza en septiembre."],
  ["octubre", "October", "month", "Hoy es el tres de octubre."], ["noviembre", "November", "month", "Viajo en noviembre."],
  ["diciembre", "December", "month", "La tienda cierra en diciembre."], ["el fin de semana", "weekend", "noun", "Estudio el fin de semana."],
  ["¿Qué hora es?", "What time is it?", "phrase", "Perdona, ¿qué hora es?"], ["¿A qué hora?", "At what time?", "phrase", "¿A qué hora empieza?"],
  ["y cuarto", "quarter past", "time phrase", "Son las dos y cuarto."], ["y media", "half past", "time phrase", "Son las tres y media."],
  ["menos cuarto", "quarter to", "time phrase", "Son las cinco menos cuarto."], ["mediodía", "noon", "noun", "Es mediodía."],
  ["medianoche", "midnight", "noun", "Es medianoche."]
];

const tokenize = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`, `${plain}?`];
};

function checksFor(input) {
  const checks = [
    { key: "meaning", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: [input.sentences[0][0], input.sentences[1][0], input.sentences[2][0]] },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correct: input.sentences[1][0] },
    { key: "translate", type: ExerciseType.TRANSLATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: input.sentences[3][1], correct: input.sentences[3][0] },
    input.dialogueCue
      ? { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.dialogueCue, correct: input.sentences[input.dialogueAnswerIndex ?? 4][0] }
      : { key: "transfer", type: ExerciseType.TRANSFORMATION, question: input.sentences[4][1], correct: input.sentences[4][0] }
  ];
  return input.checkpoint
    ? [
        ...checks,
        { key: "mixed-recall", type: ExerciseType.SHORT_ANSWER, question: input.sentences[5][1], correct: input.sentences[5][0] },
        { key: "calendar-recall", type: ExerciseType.TRANSLATION, question: input.sentences[6][1], correct: input.sentences[6][0] },
        { key: "time-dialogue", type: ExerciseType.DIALOGUE_REPLY, question: "¿A qué hora empieza el curso?", correct: "Empieza a las ocho y cuarto." }
      ]
    : checks;
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "essential_present_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "essential_present_retrieval" };
  const data = {
    lessonId: lesson.id,
    topicId: lesson.topicId,
    type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the matching Spanish sentence" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the Spanish sentence" : "Produce the Spanish sentence",
    instruction: "Use the person, number, and meaning pattern from this learning package.",
    questionText: check.question,
    answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 1 : check.type === ExerciseType.SENTENCE_BUILDER ? 2 : 3,
    order,
    xpReward: 12,
    imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) {
    await prisma.exerciseOption.createMany({
      data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 }))
    });
  }
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "essential-present-bridge" },
    update: { title: "Essential Present and Time Bridge", description: "Regular -er and -ir verbs, hay, possessives, weekdays, months, calendar dates, and precise clock time before A2.", cefrLevel: "A1", imageKey: "daily-actions:16" },
    create: { slug: "essential-present-bridge", title: "Essential Present and Time Bridge", description: "Regular -er and -ir verbs, hay, possessives, weekdays, months, calendar dates, and precise clock time before A2.", cefrLevel: "A1", imageKey: "daily-actions:16" }
  });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["daily-actions", "people-and-pronouns", "home-and-objects", "weather-and-time", "classroom-basics"] } } });
  const timeGroup = groups.find((group) => group.slug === "weather-and-time");
  if (timeGroup) {
    for (const [spanish, english, partOfSpeech, example] of temporalWords) {
      const existing = await prisma.word.findFirst({ where: { groupId: timeGroup.id, spanish } });
      const data = { groupId: timeGroup.id, spanish, english, partOfSpeech, gender: null, example, imageKey: null };
      if (existing) await prisma.word.update({ where: { id: existing.id }, data });
      else await prisma.word.create({ data });
    }
  }
  for (const input of lessons) {
    const common = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "A1",
      theme: input.checkpoint ? "Checkpoint" : "Essential Present",
      situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: ["You can recognize the meaning before choosing a form.", "You can build the sentence from a stable pattern.", "You can retrieve the Spanish form without a visible model."],
      conceptKeys: ["a1", "essential-present", input.slug],
      reviewSummary: input.summary,
      readingJson: input.readingJson || undefined,
      order: input.order,
      estimatedMinutes: input.checkpoint ? 18 : 13,
      topicId: topic.id
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
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  await seedContractionsChoice(prisma);
  console.log(`Seeded ${lessons.length} A1.10 essential-present bridge packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
