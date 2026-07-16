const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "c1-register-context", title: "Choose Register from Context", order: 1800, imageKey: "conversation-and-opinion:16",
    summary: "Adapt the same intention to a close conversation, a professional exchange, or a formal written context.", situation: "choosing how direct, distant, or formal a message should sound",
    sentences: [
      ["¿Te importa enviármelo hoy?", "Would you mind sending it to me today?", "A familiar request can be concise without sounding abrupt."],
      ["¿Podría enviármelo a lo largo del día?", "Could you send it to me during the day?", "The conditional and usted create polite professional distance."],
      ["Le agradecería que me lo enviara antes de finalizar la jornada.", "I would appreciate it if you sent it to me before the end of the working day.", "A formal request combines an appreciative frame with the past subjunctive."],
      ["Oye, al final no podré ir.", "Hey, in the end I will not be able to go.", "Oye fits an informal spoken update."],
      ["Lamento comunicarle que finalmente no podré asistir.", "I regret to inform you that I will ultimately be unable to attend.", "A formal notice names the communicative act and avoids casual framing."]
    ]
  },
  {
    slug: "c1-precise-paraphrase", title: "Paraphrase without Losing Meaning", order: 1810, imageKey: "reading-and-listening-lab:16",
    summary: "Restate an idea more clearly, formally, or concisely while preserving its essential meaning.", situation: "explaining a complex idea to a different audience",
    sentences: [
      ["Dicho de otro modo, el problema no es la falta de recursos, sino su distribución.", "Put another way, the problem is not the lack of resources but their distribution.", "The frame announces a faithful reformulation."],
      ["En términos sencillos, gastamos más de lo que ingresamos.", "In simple terms, we spend more than we earn.", "A technical relationship is made accessible without changing it."],
      ["Lo esencial es que ninguna medida funcionará de forma aislada.", "The essential point is that no measure will work in isolation.", "The sentence extracts the central claim from surrounding detail."],
      ["La propuesta, que inicialmente parecía inviable, resultó ser la más realista.", "The proposal, which initially seemed unfeasible, turned out to be the most realistic.", "A compact relative clause preserves contrast and development."],
      ["En resumidas cuentas, hace falta coordinar mejor los recursos existentes.", "All in all, the existing resources need to be coordinated better.", "The conclusion compresses the argument into one actionable idea."]
    ]
  },
  {
    slug: "c1-stance-nuance", title: "Express Stance with Nuance", order: 1820, imageKey: "conversation-and-opinion:12",
    summary: "Show degrees of certainty, reservation, and commitment instead of choosing only between agreement and disagreement.", situation: "responding carefully when evidence or agreement is incomplete",
    sentences: [
      ["No pondría en duda los resultados, aunque sí su interpretación.", "I would not question the results, though I would question their interpretation.", "The conditional softens disagreement while sí marks the precise contrast."],
      ["Hasta cierto punto, comparto el diagnóstico.", "To a certain extent, I share the diagnosis.", "The limiter signals partial rather than complete agreement."],
      ["Todo apunta a que la medida tendrá un efecto limitado.", "Everything suggests that the measure will have a limited effect.", "Evidence is presented as strong without claiming absolute proof."],
      ["Por convincente que parezca, el argumento no resuelve la cuestión principal.", "However convincing it may seem, the argument does not resolve the main issue.", "The concessive frame acknowledges strength before stating a limitation."],
      ["Me inclino a pensar que convendría esperar.", "I am inclined to think that it would be advisable to wait.", "Two cautious frames make the recommendation deliberately measured."]
    ]
  },
  {
    slug: "c1-cohesion-reference", title: "Build Cohesion across Sentences", order: 1830, imageKey: "grammar-scenes:16",
    summary: "Link extended discourse with clear reference, thematic progression, and varied connectors.", situation: "making a longer explanation easy to follow",
    sentences: [
      ["La empresa redujo los plazos. Esta decisión, sin embargo, aumentó la presión sobre el equipo.", "The company shortened the deadlines. This decision, however, increased pressure on the team.", "Esta decisión names the previous event and keeps the reference clear."],
      ["El primer informe omitía varios datos; el segundo, en cambio, los analizaba con detalle.", "The first report omitted several data points; the second, by contrast, analyzed them in detail.", "Ellipsis avoids repetition while the pronoun keeps its reference."],
      ["A ello se suma la dificultad de encontrar personal especializado.", "Added to this is the difficulty of finding specialized staff.", "A ello se suma connects a new point to the whole preceding problem."],
      ["De este modo, una medida temporal acabó convirtiéndose en una solución permanente.", "In this way, a temporary measure ended up becoming a permanent solution.", "De este modo links the result to the previously explained process."],
      ["Dicha transformación no estuvo exenta de dificultades.", "That transformation was not without difficulties.", "Dicha provides formal reference without repeating the full idea."]
    ]
  },
  {
    slug: "c1-idiomatic-collocations", title: "Use High-Value Collocations", order: 1840, imageKey: "conversation-and-opinion:9",
    summary: "Store advanced vocabulary as reliable word partnerships that make production more natural and precise.", situation: "speaking fluently without assembling every expression word by word",
    sentences: [
      ["La decisión sentó un precedente importante.", "The decision set an important precedent.", "Sentar un precedente is learned as one productive lexical unit."],
      ["Conviene tener en cuenta las consecuencias a largo plazo.", "It is advisable to take the long-term consequences into account.", "Tener en cuenta is a stable and frequent collocation."],
      ["El acuerdo entrará en vigor el próximo mes.", "The agreement will come into force next month.", "Entrar en vigor is the conventional expression for a law or agreement becoming effective."],
      ["Las nuevas pruebas arrojan luz sobre lo ocurrido.", "The new evidence sheds light on what happened.", "Arrojar luz sobre packages a figurative meaning into a reusable phrase."],
      ["El cambio dio lugar a numerosas protestas.", "The change gave rise to numerous protests.", "Dar lugar a expresses a result in neutral and formal registers."]
    ]
  },
  {
    slug: "checkpoint-c1-register-precision", title: "C1.1 Register and Precision Checkpoint", order: 1850, imageKey: "rewards-and-progress:16", checkpoint: true,
    summary: "Demonstrate register control, faithful paraphrase, nuanced stance, cohesion, and natural collocations.", situation: "adapting and presenting a careful professional recommendation",
    sentences: [
      ["Le agradecería que tuviera en cuenta las circunstancias actuales.", "I would appreciate it if you took the current circumstances into account.", "Formal register and a stable collocation work together."],
      ["Dicho de otro modo, no cuestionamos el objetivo, sino el procedimiento.", "Put another way, we are not questioning the objective but the procedure.", "The reformulation preserves the exact boundary of the criticism."],
      ["Hasta cierto punto, los datos respaldan esa conclusión.", "To a certain extent, the data support that conclusion.", "The stance is supportive but deliberately limited."],
      ["A ello se suma un factor que no se había tenido en cuenta.", "Added to this is a factor that had not been taken into account.", "Reference and collocation create cohesion across ideas."],
      ["En resumidas cuentas, me inclino a pensar que convendría aplazar la decisión.", "All in all, I am inclined to think that it would be advisable to postpone the decision.", "The conclusion combines summary, stance, and a measured recommendation."]
    ]
  }
];

const tokens = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;:]/gu) || [];
const accepted = (value) => { const plain = value.toLowerCase().replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim(); return [plain, `${plain}.`]; };
function checks(input) { return [
  { key: "recognize", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: input.sentences.slice(0, 3).map((sentence, index) => [sentence[0], sentence[0], index === 0]) },
  { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correctWords: tokens(input.sentences[1][0]) },
  { key: "reformulate", type: ExerciseType.TRANSFORMATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
  { key: "produce", type: ExerciseType.WRITING_PROMPT, question: input.sentences[3][1], correct: input.sentences[3][0] }
]; }

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords ? { correctWords: check.correctWords, goal: "c1_precision_word_order" } : { correct: check.correct, accepted: accepted(check.correct), goal: "c1_register_precision", rubric: "Preserve the intended meaning while choosing precise, cohesive, and context-appropriate Spanish." };
  const data = { lessonId: lesson.id, topicId: lesson.topicId, type: check.type, prompt: "Express the idea with precise register", instruction: "Identify audience, intention, degree of certainty, and relationship between ideas before producing the sentence.", questionText: check.question, answerJson, explanation: "At C1, accuracy includes not only grammar but also register, lexical partnership, information structure, and the exact strength of a claim.", difficulty: 6, order, xpReward: 20, imageKey: lesson.imageKey };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map(([text, value, isCorrect], index) => ({ exerciseId: saved.id, text, value, isCorrect, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({ where: { slug: "c1-register-precision" }, update: { title: "Register, Precision, and Cohesion", description: "Context-sensitive register, faithful paraphrase, nuanced stance, discourse cohesion, and productive collocations.", cefrLevel: "C1", imageKey: "conversation-and-opinion:16" }, create: { slug: "c1-register-precision", title: "Register, Precision, and Cohesion", description: "Context-sensitive register, faithful paraphrase, nuanced stance, discourse cohesion, and productive collocations.", cefrLevel: "C1", imageKey: "conversation-and-opinion:16" } });
  const groupSlugs = ["useful-phrases", "a2-reading-listening-lab", "essential-words", "a2-scenario-survival", "c1-register-argument"];
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: groupSlugs } } });
  const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
  if (groups.length !== groupSlugs.length) throw new Error("C1.1 requires all configured vocabulary groups.");
  for (const input of lessons) {
    const common = { title: input.title, summary: input.summary, cefrLevel: "C1", theme: input.checkpoint ? "Checkpoint" : "Register and Precision", situation: input.situation, imageKey: input.imageKey, outcomesJson: ["You can adapt register to audience and purpose.", "You can paraphrase and qualify a claim without losing its meaning.", "You can build cohesive discourse with natural high-value collocations."], conceptKeys: ["c1", "register", "precision", "cohesion", "collocations"], reviewSummary: input.summary, order: input.order, estimatedMinutes: input.checkpoint ? 22 : 17, topicId: topic.id };
    const connectedGroups = groupSlugs.map((slug) => ({ id: groupBySlug.get(slug).id }));
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: connectedGroups } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: connectedGroups } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const authored = checks(input);
    for (let index = 0; index < authored.length; index += 1) await saveExercise(lesson, authored[index], index + 1);
    const keep = authored.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} C1.1 register-and-precision learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
module.exports = { lessons };
