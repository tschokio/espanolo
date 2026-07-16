const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a1-numbers-eleven-to-twenty", topicSlug: "numbers-in-life", title: "Build Numbers from Eleven to Twenty", order: 418, imageKey: "quantities-and-clear-colors:25",
    summary: "Learn the special forms from once to quince, then recognize the dieci- pattern through veinte without treating ten isolated words as one memory test.",
    situation: "counting people, things, euros, and minutes",
    sentences: [
      ["Tengo once libros.", "I have eleven books.", "Once is the first number after diez."],
      ["Hay doce estudiantes.", "There are twelve students.", "Doce is useful for dates and quantities."],
      ["Necesito quince minutos.", "I need fifteen minutes.", "Once through quince are short special forms to retrieve as whole words."],
      ["Tengo dieciséis euros.", "I have sixteen euros.", "Dieciséis begins the written dieci- pattern and carries an accent."],
      ["Hay diecisiete preguntas.", "There are seventeen questions.", "Diecisiete continues dieci plus siete as one written word."],
      ["La clase tiene dieciocho estudiantes.", "The class has eighteen students.", "Dieciocho joins the pattern into one word."],
      ["Tengo diecinueve años.", "I am nineteen years old.", "Diecinueve is the last dieci- number before veinte."],
      ["Necesito veinte minutos.", "I need twenty minutes.", "Veinte closes this number group and anchors the next one."]
    ],
    dialogueCue: "¿Cuántos estudiantes hay?"
  },
  {
    slug: "a1-tens-and-composed-numbers", topicSlug: "numbers-in-life", title: "Build Tens and Composed Numbers", order: 419, imageKey: "quantities-and-clear-colors:26",
    summary: "Use veinti- for the twenties and tens plus y plus a unit from thirty onward so unfamiliar numbers can be built rather than memorized separately.",
    situation: "ages, prices, addresses, and larger quantities",
    sentences: [
      ["Tengo veintiún años.", "I am twenty-one years old.", "Veintiuno shortens to veintiún before the masculine plural noun años."],
      ["Tengo veinticuatro años.", "I am twenty-four years old.", "Veinticuatro is written as one word."],
      ["Cuesta treinta euros.", "It costs thirty euros.", "Treinta is the first regular tens anchor after veinte."],
      ["Cuesta treinta y cinco euros.", "It costs thirty-five euros.", "From thirty onward, connect the tens and unit with y."],
      ["Hay cuarenta y dos personas.", "There are forty-two people.", "Cuarenta y dos reuses the same tens plus y plus unit frame."],
      ["Necesito cincuenta minutos.", "I need fifty minutes.", "A whole multiple of ten does not need y."],
      ["Hay cien libros.", "There are one hundred books.", "Cien names exactly one hundred."]
    ],
    dialogueCue: "¿Cuánto cuesta?"
  },
  {
    slug: "checkpoint-a1-numbers-in-life", topicSlug: "numbers-in-life", title: "A1.6 Everyday Numbers Checkpoint", order: 420, imageKey: "quantities-and-clear-colors:25", checkpoint: true,
    summary: "Retrieve numbers inside age, date, price, time, quantity, and contact-detail frames before personal conversations require them.",
    situation: "understanding useful numbers in a first everyday exchange",
    sentences: [
      ["Tengo veinticuatro años.", "I am twenty-four years old.", "Age combines tener with a composed number and años."],
      ["Mi cumpleaños es el doce de mayo.", "My birthday is on the twelfth of May.", "Dates reuse a number after el."],
      ["Cuesta treinta y cinco euros.", "It costs thirty-five euros.", "Prices use the composed number before euros."],
      ["Mi número termina en seis, ocho, dos, cuatro.", "My number ends in six, eight, two, four.", "Telephone digits are normally spoken separately."],
      ["La clase es a las ocho.", "The class is at eight o'clock.", "Clock time uses a las before numbers other than one."],
      ["Hay dieciséis estudiantes.", "There are sixteen students.", "Quantities combine hay with a number and plural noun."]
    ],
    dialogueCue: "¿Cuántos años tienes?",
    readingJson: {
      title: "Números que importan",
      inputMode: "listening",
      orientationDe: "Höre zuerst nur auf die Funktion jeder Zahl: Alter, Datum, Preis, Uhrzeit oder Nummer. Beim zweiten Hören ordnest du den genauen Zahlenwert zu. Telefonnummern werden Ziffer für Ziffer gesprochen.",
      orientationEn: "First listen only for each number's function: age, date, price, time, or contact number. On the second listen, identify the exact value. Phone numbers are spoken digit by digit.",
      paragraphs: [
        "Lena tiene veinticuatro años y su cumpleaños es el doce de mayo. Una entrada cuesta treinta y cinco euros.",
        "La clase es a las ocho y tiene dieciséis estudiantes. El número de Lena termina en seis, ocho, dos, cuatro."
      ],
      questions: [
        { questionDe: "Welche Zahl bezeichnet den Preis?", questionEn: "Which number gives the price?", optionsDe: ["Fünfunddreißig", "Vierundzwanzig", "Sechzehn"], optionsEn: ["Thirty-five", "Twenty-four", "Sixteen"], correct: 0, explanationDe: "Una entrada cuesta treinta y cinco euros verbindet fünfunddreißig ausdrücklich mit dem Preis der Eintrittskarte.", explanationEn: "Una entrada cuesta treinta y cinco euros explicitly connects thirty-five with the ticket price." },
        { questionDe: "Was beginnt um acht Uhr?", questionEn: "What begins at eight o'clock?", optionsDe: ["Der Unterricht", "Der Geburtstag", "Der Verkauf"], optionsEn: ["The class", "The birthday", "The sale"], correct: 0, explanationDe: "La clase es a las ocho verwendet den Uhrzeitrahmen a las und ordnet acht Uhr eindeutig dem Unterricht zu.", explanationEn: "La clase es a las ocho uses the clock-time frame a las and clearly assigns eight o'clock to the class." }
      ],
      recallPromptDe: "Nenne auf Spanisch dein Alter, ein Datum, einen Preis zwischen 30 und 49 Euro, eine Uhrzeit und vier einzelne Ziffern einer erfundenen Telefonnummer. Verwende jeweils den vollständigen Satzrahmen statt nur der Zahl.",
      recallPromptEn: "In Spanish, state your age, a date, a price between 30 and 49 euros, a time, and four separate digits from an invented phone number. Use the complete sentence frame rather than only the number.",
      modelSummary: "Lena tiene veinticuatro años, cumple años el doce de mayo y distingue un precio, una hora, una cantidad y cuatro cifras de teléfono."
    }
  }
];

const expandedNumberWords = [
  ["veintiuno", "twenty-one", "Tengo veintiún años."], ["veintidós", "twenty-two", "Hay veintidós personas."],
  ["veintitrés", "twenty-three", "Cuesta veintitrés euros."], ["veinticuatro", "twenty-four", "Tengo veinticuatro años."],
  ["veinticinco", "twenty-five", "Necesito veinticinco minutos."], ["veintiséis", "twenty-six", "Hay veintiséis preguntas."],
  ["veintisiete", "twenty-seven", "Cuesta veintisiete euros."], ["veintiocho", "twenty-eight", "Hay veintiocho estudiantes."],
  ["veintinueve", "twenty-nine", "Tengo veintinueve años."], ["treinta", "thirty", "Cuesta treinta euros."],
  ["cuarenta", "forty", "Hay cuarenta personas."], ["cincuenta", "fifty", "Necesito cincuenta minutos."],
  ["sesenta", "sixty", "Hay sesenta libros."], ["setenta", "seventy", "Cuesta setenta euros."],
  ["ochenta", "eighty", "Hay ochenta personas."], ["noventa", "ninety", "Necesito noventa minutos."],
  ["cien", "one hundred", "Hay cien libros."]
];

const tokenize = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`, `${plain}?`];
};

function checksFor(input) {
  const checks = [
    { key: "meaning", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: [input.sentences[0][0], input.sentences[1][0], input.sentences[2][0]] },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correct: input.sentences[1][0] },
    { key: "translate", type: ExerciseType.TRANSLATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: input.sentences[3][1], correct: input.sentences[3][0] },
    { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.dialogueCue, correct: input.sentences[input.checkpoint ? 0 : 4][0] }
  ];
  if (input.checkpoint) checks.push({ key: "transfer", type: ExerciseType.WRITING_PROMPT, question: input.sentences[5][1], correct: input.sentences[5][0] });
  return checks;
}

async function saveExercise(lesson, topic, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "number_frame_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "numbers_in_context", rubric: "Use the complete Spanish frame and the correct number form." };
  const data = {
    lessonId: lesson.id,
    topicId: topic.id,
    type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the matching Spanish sentence" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the complete number frame" : "Retrieve the complete Spanish number frame",
    instruction: "Identify what the number means in this situation, build it from the learned pattern, and answer with the complete Spanish frame.",
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
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "numbers-in-life" },
    update: { title: "Numbers in Everyday Life", description: "Build numbers and use them for age, dates, prices, time, quantities, and contact details.", cefrLevel: "A1", imageKey: "quantities-and-clear-colors:25" },
    create: { slug: "numbers-in-life", title: "Numbers in Everyday Life", description: "Build numbers and use them for age, dates, prices, time, quantities, and contact details.", cefrLevel: "A1", imageKey: "quantities-and-clear-colors:25" }
  });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["numbers-and-colors", "classroom-basics", "weather-and-time", "essential-words"] } } });
  const numberGroup = groups.find((group) => group.slug === "numbers-and-colors");
  if (numberGroup) {
    for (const [spanish, english, example] of expandedNumberWords) {
      const existing = await prisma.word.findFirst({ where: { groupId: numberGroup.id, spanish } });
      const data = { groupId: numberGroup.id, spanish, english, partOfSpeech: "number", gender: null, example, imageKey: null };
      if (existing) await prisma.word.update({ where: { id: existing.id }, data });
      else await prisma.word.create({ data });
    }
  }
  for (const input of lessons) {
    const common = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "A1",
      theme: input.checkpoint ? "Checkpoint" : "Numbers",
      situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: ["You can understand what a number represents in context.", "You can build unfamiliar numbers from a small set of patterns.", "You can retrieve a complete Spanish frame for age, dates, prices, time, quantities, or contact details."],
      conceptKeys: ["a1", "numbers-in-context", input.slug],
      reviewSummary: input.summary,
      readingJson: input.readingJson || null,
      order: input.order,
      estimatedMinutes: input.checkpoint ? 18 : 15,
      topicId: topic.id
    };
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const checks = checksFor(input);
    for (let index = 0; index < checks.length; index += 1) await saveExercise(lesson, topic, input, checks[index], index + 1);
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  await prisma.lesson.updateMany({ where: { slug: "numbers-one-to-five" }, data: { order: 416, topicId: topic.id } });
  await prisma.lesson.updateMany({ where: { slug: "numbers-six-to-ten" }, data: { order: 417, topicId: topic.id } });
  await prisma.sentence.updateMany({ where: { lesson: { slug: { in: ["numbers-one-to-five", "numbers-six-to-ten"] } } }, data: { topicId: topic.id } });
  await prisma.exercise.updateMany({ where: { lesson: { slug: { in: ["numbers-one-to-five", "numbers-six-to-ten"] } } }, data: { topicId: topic.id } });
  console.log(`Seeded and aligned ${lessons.length + 2} A1.6 everyday-number learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
