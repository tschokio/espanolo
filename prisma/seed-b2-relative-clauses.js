const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "b2-relative-que-quien", title: "Choose Que or Quien by Structure", order: 1440, imageKey: "people-and-family:10",
    summary: "Use que as the broad default and quien for people after a preposition or in an added comment.", situation: "identifying people and adding relevant detail",
    sentences: [
      ["La mujer que trabaja aquí es médica.", "The woman who works here is a doctor.", "Que directly identifies the person without a preposition."],
      ["El compañero con quien hablé vive cerca.", "The colleague with whom I spoke lives nearby.", "Quien follows the preposition con and refers to a person."],
      ["Marta, quien dirige el proyecto, llegará mañana.", "Marta, who leads the project, will arrive tomorrow.", "Between commas, quien adds nonessential information about a known person."],
      ["Busco a alguien que pueda ayudarme.", "I am looking for someone who can help me.", "An indefinite person not known to exist triggers the subjunctive."],
      ["No hay nadie que conozca la respuesta.", "There is nobody who knows the answer.", "A negated or nonexistent antecedent takes the subjunctive."]
    ]
  },
  {
    slug: "b2-relative-prepositions", title: "Keep the Required Preposition in Relative Clauses", order: 1450, imageKey: "grammar-scenes:7",
    summary: "Preserve the preposition required by the verb or relationship and combine it with a clear relative form.", situation: "connecting people and things through precise relationships",
    sentences: [
      ["Este es el tema del que hablamos ayer.", "This is the topic we talked about yesterday.", "Hablar de requires de, which remains before el que."],
      ["La empresa para la que trabajo es pequeña.", "The company I work for is small.", "Trabajar para preserves para before la que."],
      ["La razón por la que me fui era personal.", "The reason why I left was personal.", "Por la que connects the reason to the action."],
      ["El problema al que nos enfrentamos es complejo.", "The problem we are facing is complex.", "Enfrentarse a requires a, combined here as al que."],
      ["Son decisiones de las que depende el resultado.", "They are decisions on which the result depends.", "Depender de preserves de and agrees with the plural antecedent."]
    ]
  },
  {
    slug: "b2-relative-el-que-lo-que", title: "Use El Que and Lo Que Precisely", order: 1460, imageKey: "conversation-and-opinion:8",
    summary: "Refer back to a known noun with el que forms and to an entire idea or unnamed thing with lo que.", situation: "clarifying exactly what an evaluation refers to",
    sentences: [
      ["Tengo dos propuestas; la que prefiero es la segunda.", "I have two proposals; the one I prefer is the second.", "La que replaces a known feminine noun."],
      ["No entendí lo que quiso decir.", "I did not understand what he meant.", "Lo que refers to an unnamed idea rather than a specific noun."],
      ["Perdimos el tren, lo que nos obligó a esperar.", "We missed the train, which forced us to wait.", "Lo que refers back to the whole previous event."],
      ["Los que hayan terminado pueden salir.", "Those who have finished may leave.", "Los que refers to an understood plural group."],
      ["Eso es precisamente lo que necesitamos.", "That is exactly what we need.", "Lo que identifies the needed thing without naming a noun."]
    ]
  },
  {
    slug: "b2-relative-cuyo", title: "Express Possession with Cuyo", order: 1470, imageKey: "people-and-family:12",
    summary: "Use cuyo to connect an owner to a possessed noun and agree with the possessed noun.", situation: "describing people, organizations, and works compactly",
    sentences: [
      ["Conocí a una autora cuyos libros admiro.", "I met an author whose books I admire.", "Cuyos agrees with the plural masculine noun libros."],
      ["Visitamos una ciudad cuya historia es fascinante.", "We visited a city whose history is fascinating.", "Cuya agrees with historia, not with ciudad as owner."],
      ["La empresa, cuyo director dimitió, busca un sustituto.", "The company, whose director resigned, is looking for a replacement.", "The relative clause adds information about the company's director."],
      ["Ese es el científico cuyas investigaciones cambiaron el campo.", "That is the scientist whose research changed the field.", "Cuyas agrees with the feminine plural investigaciones."],
      ["Apoyamos proyectos cuyo impacto puede medirse.", "We support projects whose impact can be measured.", "Cuyo creates a compact possession relationship in a formal register."]
    ]
  },
  {
    slug: "b2-relative-place-time-manner", title: "Link Place, Time, and Manner", order: 1480, imageKey: "places-around-town:12",
    summary: "Use donde, cuando, and como as relative links when their antecedent expresses place, time, or manner.", situation: "describing circumstances without repeating full clauses",
    sentences: [
      ["Volvimos al barrio donde crecí.", "We returned to the neighborhood where I grew up.", "Donde links the action to a place antecedent."],
      ["Recuerdo la época cuando vivíamos junto al mar.", "I remember the time when we lived by the sea.", "Cuando links the memory to a time period."],
      ["Me sorprendió la manera como resolvió el conflicto.", "I was surprised by the way he resolved the conflict.", "Como links to the manner in which something happened."],
      ["La casa en la que nací ya no existe.", "The house in which I was born no longer exists.", "En la que is a precise alternative to donde with a noun place."],
      ["Fue entonces cuando comprendí el problema.", "It was then that I understood the problem.", "Cuando focuses the exact moment of realization."]
    ]
  },
  {
    slug: "checkpoint-b2-relative-clauses", title: "B2.3 Advanced Relative Clauses Checkpoint", order: 1490, imageKey: "rewards-and-progress:13",
    summary: "Check person references, required prepositions, el que and lo que, possession with cuyo, and circumstance links.", situation: "describing a project and the people connected to it", checkpoint: true,
    sentences: [
      ["La persona con quien colaboro dirige una organización que ayuda a jóvenes.", "The person I collaborate with runs an organization that helps young people.", "Con quien preserves the relationship; que identifies the organization."],
      ["El proyecto del que te hablé empieza el mes que viene.", "The project I told you about starts next month.", "Hablar de requires del que."],
      ["Su objetivo es mejorar el barrio donde viven muchas familias.", "Its goal is to improve the neighborhood where many families live.", "Donde links the families to the neighborhood."],
      ["Conocimos a una arquitecta cuyas ideas nos impresionaron.", "We met an architect whose ideas impressed us.", "Cuyas agrees with ideas."],
      ["El ayuntamiento aprobó la propuesta, lo que permitirá comenzar pronto.", "The city council approved the proposal, which will make it possible to begin soon.", "Lo que refers to the complete approval event."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`];
};

function checks(input) {
  return [
    { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
    { key: "respond", type: ExerciseType.DIALOGUE_REPLY, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "produce", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
  ];
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "b2_relative_clause_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "b2_relative_reference", rubric: "Choose the relative form from its antecedent, required preposition, and intended relationship." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: "Connect the information without losing the relationship", instruction: "Find the antecedent and any required preposition before choosing the relative form.",
    questionText: check.question, answerJson,
    explanation: "Advanced relative clauses become reliable when you identify what the relative form refers to and which grammatical relationship must remain visible.",
    difficulty: 5, order, xpReward: 18, imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "b2-relative-clauses" },
    update: { title: "Advanced Relative Clauses", description: "People, required prepositions, el que and lo que, possession with cuyo, and links for place, time, and manner.", cefrLevel: "B2", imageKey: "people-and-family:10" },
    create: { slug: "b2-relative-clauses", title: "Advanced Relative Clauses", description: "People, required prepositions, el que and lo que, possession with cuyo, and links for place, time, and manner.", cefrLevel: "B2", imageKey: "people-and-family:10" }
  });
  const groupSlugs = ["people-and-pronouns", "places-around-town", "useful-phrases", "a2-reading-listening-lab", "b2-discourse-reporting", "b2-complex-structures"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("B2.3 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "B2", theme: input.checkpoint ? "Checkpoint" : "Advanced Relative Clauses",
      situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can choose relative forms for people, things, and complete ideas.", "You can preserve required prepositions inside relative clauses.", "You can express possession and circumstance compactly."],
      conceptKeys: ["b2", "relative-clauses", "reference", "sentence-complexity"], reviewSummary: input.summary,
      order: input.order, estimatedMinutes: input.checkpoint ? 18 : 14, topicId: topic.id
    };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} B2.3 relative-clause learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
