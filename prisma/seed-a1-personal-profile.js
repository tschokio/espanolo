const { PrismaClient, ExerciseType } = require("@prisma/client");
const { checkpointFunctionalCheck } = require("./checkpoint-functional-checks");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a1-age-and-personal-question", topicSlug: "personal-profile-basics", title: "Say and Ask How Old Someone Is", order: 421, imageKey: "people-and-family:1",
    summary: "Use tener plus años to ask and answer about age without translating German sein word for word.", situation: "sharing one basic personal detail",
    sentences: [
      ["¿Cuántos años tienes?", "How old are you?", "Spanish asks how many years you have with tener."],
      ["Tengo veinticuatro años.", "I am twenty-four years old.", "Age uses tengo plus a number and años."],
      ["Mi hermana tiene veinte años.", "My sister is twenty years old.", "Use tiene for another single person."],
      ["No tengo treinta años; tengo veinticuatro.", "I am not thirty; I am twenty-four.", "No stands before tengo and the correction follows clearly."],
      ["Tengo veinticuatro años. ¿Y tú?", "I am twenty-four. And you?", "Return the question to keep the first conversation moving."]
    ],
    dialogueCue: "Hola, ¿cuántos años tienes?"
  },
  {
    slug: "a1-birthday-and-date", topicSlug: "personal-profile-basics", title: "Give a Birthday and Calendar Date", order: 422, imageKey: "weather-and-time:8",
    summary: "Build simple dates with el, a number, de, and a month and ask when a birthday is.", situation: "sharing a birthday",
    sentences: [
      ["¿Cuándo es tu cumpleaños?", "When is your birthday?", "Cuándo asks for the time or date of an event."],
      ["Mi cumpleaños es el doce de mayo.", "My birthday is on the twelfth of May.", "A date uses el plus number plus de and the month."],
      ["Es el tres de enero.", "It is on the third of January.", "The short answer keeps the complete date frame."],
      ["Hoy es el veinte de junio.", "Today is the twentieth of June.", "Hoy es introduces today's calendar date."],
      ["Mi cumpleaños es en mayo. ¿Y el tuyo?", "My birthday is in May. And yours?", "Use en plus a month when the exact day is not needed." ]
    ],
    dialogueCue: "¿Cuándo es tu cumpleaños?"
  },
  {
    slug: "a1-family-introductions", topicSlug: "personal-profile-basics", title: "Introduce Close Family", order: 423, imageKey: "people-and-family:5",
    summary: "Use esta es, este es, tengo, and se llama to introduce close family members.", situation: "showing a family photo",
    sentences: [
      ["Esta es mi madre.", "This is my mother.", "Esta es introduces one female person."],
      ["Este es mi padre.", "This is my father.", "Este es introduces one male person."],
      ["Tengo una hermana y un hermano.", "I have one sister and one brother.", "Tengo gives the family relationship from your point of view."],
      ["Mi familia vive en Viena.", "My family lives in Vienna.", "Vive en adds one simple place detail about the family."],
      ["Mi hermana se llama Laura. ¿Y tu familia?", "My sister's name is Laura. And your family?", "Add one small detail and return the topic." ]
    ],
    dialogueCue: "¿Cómo se llama tu hermana?"
  },
  {
    slug: "a1-home-work-study", topicSlug: "personal-profile-basics", title: "Say Where You Live, Work, or Study", order: 424, imageKey: "daily-actions:9",
    summary: "Combine vivo, trabajo, and estudio to describe the three most useful parts of everyday identity.", situation: "getting to know a new person",
    sentences: [
      ["Vivo en Berlín.", "I live in Berlin.", "Vivo en plus a place states where you live."],
      ["Trabajo en un hotel.", "I work in a hotel.", "Trabajo en connects an occupation context with its place."],
      ["Estudio español en la universidad.", "I study Spanish at the university.", "Estudio can take both the subject and place."],
      ["¿Trabajas o estudias?", "Do you work or study?", "O offers two simple alternatives in one useful question."],
      ["Trabajo por la mañana y estudio por la tarde.", "I work in the morning and study in the afternoon.", "Join two true personal details with y." ]
    ],
    dialogueCue: "Hola, ¿trabajas o estudias?"
  },
  {
    slug: "a1-languages-you-speak", topicSlug: "personal-profile-basics", title: "Talk About Languages You Speak", order: 425, imageKey: "classroom-basics:10",
    summary: "Say which languages you speak or understand and describe an early level without apologizing for learning.", situation: "finding a shared language",
    sentences: [
      ["Hablo alemán.", "I speak German.", "Hablo plus a language gives your speaking language."],
      ["Hablo un poco de español.", "I speak a little Spanish.", "Un poco de makes the level modest and specific."],
      ["Entiendo inglés, pero no lo hablo mucho.", "I understand English, but I do not speak it much.", "Contrast understanding and speaking instead of treating them as identical."],
      ["¿Qué idiomas hablas?", "What languages do you speak?", "Qué idiomas asks an open personal question."],
      ["Hablo alemán y un poco de español. ¿Y tú?", "I speak German and a little Spanish. And you?", "Give a complete answer and ask back." ]
    ],
    dialogueCue: "¿Qué idiomas hablas?"
  },
  {
    slug: "a1-contact-details-repair", topicSlug: "personal-profile-basics", title: "Share and Check Contact Details", order: 426, imageKey: "classroom-basics:12",
    summary: "Ask for a phone number or email address and use repetition to check an important detail.", situation: "exchanging contact details safely",
    sentences: [
      ["¿Cuál es tu número de teléfono?", "What is your phone number?", "Cuál es asks for one specific identifying detail."],
      ["Mi número es seis, ocho, dos, cuatro.", "My number is six, eight, two, four.", "Say phone digits separately so they are easier to verify."],
      ["¿Cuál es tu correo electrónico?", "What is your email address?", "Correo electrónico is the standard general term for email."],
      ["Mi correo es ana punto sol arroba ejemplo punto com.", "My email is ana dot sol at example dot com.", "Punto and arroba make the written address speakable."],
      ["Perdona, ¿puedes repetir el número?", "Sorry, can you repeat the number?", "Name the detail that needs repetition." ]
    ],
    dialogueCue: "No he entendido tu número."
  },
  {
    slug: "checkpoint-a1-personal-profile", topicSlug: "personal-profile-basics", title: "A1.7 Personal Profile Checkpoint", order: 427, imageKey: "people-and-family:16", checkpoint: true,
    summary: "Combine age, family, home, work or study, languages, and one checked contact detail in a first conversation.", situation: "holding a complete first personal exchange",
    sentences: [
      ["Me llamo Lena y tengo veinticuatro años.", "My name is Lena and I am twenty-four years old.", "Connect name and age without repeating yo."],
      ["Vivo en Hamburgo con mi hermana.", "I live in Hamburg with my sister.", "Combine home and one family relationship."],
      ["Trabajo por la mañana y estudio español.", "I work in the morning and study Spanish.", "Join work and study as two personal facts."],
      ["Hablo alemán y un poco de español.", "I speak German and a little Spanish.", "State language ability at an honest useful level."],
      ["Mi cumpleaños es el doce de mayo.", "My birthday is on the twelfth of May.", "Use the complete date frame."],
      ["Perdona, ¿puedes repetir tu número?", "Sorry, can you repeat your number?", "Finish by repairing one important contact detail." ]
    ],
    dialogueCue: "¿Cuándo es tu cumpleaños?",
    readingJson: {
      title: "Conocer a Lena",
      inputMode: "listening",
      orientationDe: "Höre auf sechs vertraute persönliche Angaben: Name, Alter, Wohnort, Familie, Tätigkeit und Sprache. Einzelne Kontaktdaten kommen erst beim zweiten Hören.",
      orientationEn: "Listen for six familiar personal details: name, age, home, family, activity, and language. Leave individual contact details for the second listen.",
      paragraphs: [
        "Lena: Hola. Me llamo Lena y tengo veinticuatro años. Vivo en Hamburgo con mi hermana. Trabajo por la mañana y estudio español.",
        "Hablo alemán y un poco de español. Mi cumpleaños es el doce de mayo. Pablo no entiende su número y pide: Perdona, ¿puedes repetirlo?"
      ],
      questions: [
        { questionDe: "Mit wem wohnt Lena?", questionEn: "Who does Lena live with?", optionsDe: ["Mit ihrer Schwester", "Mit Pablo", "Allein im Hotel"], optionsEn: ["With her sister", "With Pablo", "Alone in the hotel"], correct: 0, explanationDe: "Vivo en Hamburgo con mi hermana verbindet ihren Wohnort ausdrücklich mit der Schwester als Mitbewohnerin.", explanationEn: "Vivo en Hamburgo con mi hermana explicitly connects her home with her sister as the person living with her." },
        { questionDe: "Welche Angabe muss Pablo noch einmal hören?", questionEn: "Which detail does Pablo need to hear again?", optionsDe: ["Die Nummer", "Das Alter", "Den Wohnort"], optionsEn: ["The number", "The age", "The home city"], correct: 0, explanationDe: "Pablo no entiende su número und ¿puedes repetirlo? benennen genau die unsichere Kontaktangabe.", explanationEn: "Pablo no entiende su número and ¿puedes repetirlo? identify the uncertain contact detail." }
      ],
      recallPromptDe: "Stelle dich auf Spanisch in mindestens sechs kurzen Sätzen vor: Name, Alter, Wohnort oder Familie, Arbeit oder Studium, Sprachen und Geburtstag. Bitte danach gezielt um Wiederholung einer Kontaktangabe.",
      recallPromptEn: "Introduce yourself in Spanish in at least six short sentences: name, age, home or family, work or study, languages, and birthday. Then ask for one contact detail to be repeated.",
      modelSummary: "Lena tiene veinticuatro años, vive con su hermana, trabaja, estudia español, habla alemán y cumple años el doce de mayo."
    }
  }
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
    { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.dialogueCue, correct: input.sentences[4][0] }
  ];
  if (input.checkpoint) checks.push({ key: "profile", type: ExerciseType.WRITING_PROMPT, question: input.sentences[5][1], correct: input.sentences[5][0] });
  return checks;
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const functionalCheck = checkpointFunctionalCheck(slug);
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "personal_profile_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "personal_profile", rubric: "Answer the personal question with a complete clear Spanish frame.", ...(functionalCheck ? { functionalCheck } : {}) };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the matching Spanish sentence" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the personal sentence" : "Answer with the learned Spanish frame",
    instruction: "Identify which personal detail is requested, then retrieve the complete Spanish frame rather than translating word by word.",
    questionText: check.question, answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 1 : check.type === ExerciseType.SENTENCE_BUILDER ? 2 : 3,
    order, xpReward: 12, imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "personal-profile-basics" },
    update: { title: "Personal Profile and First Conversations", description: "Age, birthday, family, home, work or study, languages, and checked contact details.", cefrLevel: "A1", imageKey: "people-and-family:1" },
    create: { slug: "personal-profile-basics", title: "Personal Profile and First Conversations", description: "Age, birthday, family, home, work or study, languages, and checked contact details.", cefrLevel: "A1", imageKey: "people-and-family:1" }
  });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["people-and-family", "people-and-pronouns", "places-around-town", "classroom-basics", "essential-words"] } } });
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "A1", theme: input.checkpoint ? "Checkpoint" : "Personal Profile", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can understand which personal detail is being requested.", "You can answer with a complete reusable Spanish frame.", "You can ask back or repair one detail to keep the first conversation moving."], conceptKeys: ["a1", "personal-profile", input.slug], reviewSummary: input.summary, readingJson: input.readingJson || null, order: input.order, estimatedMinutes: input.checkpoint ? 18 : 14, topicId: topic.id };
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const checks = checksFor(input);
    for (let index = 0; index < checks.length; index += 1) await saveExercise(lesson, input, checks[index], index + 1);
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} A1.7 personal-profile learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
