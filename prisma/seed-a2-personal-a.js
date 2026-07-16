const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessonDefinition = {
  slug: "a2-personal-a-people",
  title: "Mark Identified People with Personal A",
  summary: "Distinguish an identified person from a thing or an unspecified person before using direct-object pronouns.",
  order: 730,
  imageKey: "object-pronouns-and-shopping:1",
  sentences: [
    ["Veo a Marta cada mañana.", "I see Marta every morning.", "Use personal a before an identified person who receives the action directly."],
    ["Buscamos al médico.", "We are looking for the doctor.", "A plus el contracts to al before an identified male person."],
    ["Busco un médico.", "I am looking for a doctor.", "Omit personal a when the person is not yet identified and any suitable person would satisfy the search."],
    ["Conozco a tus padres.", "I know your parents.", "A marked group of known people can also be a direct object."],
    ["Tengo dos hermanos.", "I have two brothers.", "Tener normally does not use personal a before the person possessed or related to the subject."]
  ],
  readingJson: {
    title: "Personas concretas, cosas y alguien todavía desconocido",
    titleEs: "Personas concretas, cosas y alguien todavía desconocido",
    titleEn: "Identified People, Things, and Someone Not Yet Known",
    inputMode: "listening",
    paragraphs: [
      "En la estación, Laura busca a su hermano Daniel. Ve a Marta junto a la entrada y conoce a sus padres, pero Daniel todavía no está allí.",
      "Laura también busca un taxi y pregunta por un médico, porque cualquier profesional disponible puede ayudar. Tiene dos hermanos, pero hoy espera específicamente a Daniel."
    ],
    questions: [
      {
        questionDe: "Warum steht in busca a su hermano die persönliche Objektmarkierung a?",
        questionEn: "Why does busca a su hermano use personal a?",
        optionsDe: ["Der Bruder ist eine konkrete, identifizierte Person", "Buscar verlangt immer a", "Hermano ist männlich"],
        optionsEn: ["The brother is a specific, identified person", "Buscar always requires a", "Hermano is masculine"],
        correct: 0,
        explanationDe: "Die Handlung richtet sich direkt auf den konkret bestimmten Bruder Daniel. Geschlecht und Verb allein entscheiden die Markierung nicht.",
        explanationEn: "The action directly targets the specifically identified brother Daniel. Gender and the verb alone do not determine the marker."
      },
      {
        questionDe: "Warum heißt es dagegen busca un taxi und pregunta por un médico?",
        questionEn: "Why does the text instead say busca un taxi and pregunta por un médico?",
        optionsDe: ["Taxi ist eine Sache; der Arzt ist noch nicht als bestimmte Person identifiziert", "Nach un darf nie a stehen", "Nur Familienmitglieder erhalten a"],
        optionsEn: ["The taxi is a thing; the doctor is not yet identified as a specific person", "A can never follow un", "Only family members receive a"],
        correct: 0,
        explanationDe: "Zuerst entscheidest du zwischen Sache und Person; bei einer Person prüfst du zusätzlich, ob eine konkrete Person gemeint ist.",
        explanationEn: "First distinguish a thing from a person; for a person, also determine whether a specific individual is intended."
      },
      {
        questionDe: "Was zeigt tiene dos hermanos?",
        questionEn: "What does tiene dos hermanos demonstrate?",
        optionsDe: ["Tener steht bei dieser Beziehung normalerweise ohne persönliche a", "Mehrzahl entfernt jede Präposition", "Hermanos sind keine Personen"],
        optionsEn: ["Tener normally omits personal a in this relationship", "Plural removes every preposition", "Hermanos are not people"],
        correct: 0,
        explanationDe: "Die persönliche a ist keine mechanische Markierung vor jedem Personenwort. Tener und hay gehören zu den wichtigen frühen Grenzen.",
        explanationEn: "Personal a is not a mechanical marker before every person word. Tener and hay are important early boundaries."
      }
    ],
    orientationDe: "Entscheide in zwei Schritten: Ist das direkte Objekt eine Person? Wenn ja, ist eine konkrete oder identifizierte Person gemeint? Vergleiche danach bewusst mit einer Sache, einer noch unbestimmten Person und der Grenze bei tener.",
    orientationEn: "Decide in two steps: Is the direct object a person? If so, is a specific or identified person intended? Then contrast it with a thing, an unspecified person, and the tener boundary.",
    recallPromptDe: "Fasse auf Spanisch zusammen, wen Laura konkret sucht und sieht, welche Sache und welche noch unbestimmte Person sie braucht und wie viele Brüder sie hat.",
    recallPromptEn: "Summarize in Spanish whom Laura specifically seeks and sees, which thing and unspecified person she needs, and how many brothers she has.",
    modelSummary: "Laura busca a su hermano y ve a Marta, pero también busca un taxi y un médico; tiene dos hermanos."
  }
};

const exerciseDefinitions = [
  {
    slug: "a2-personal-a-meaning",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Choose the sentence that marks an identified person",
    instruction: "First decide whether the direct object is a thing or a person, then whether that person is identified.",
    questionText: "Which sentence identifies Marta as the direct object?",
    answerJson: { correct: "Veo a Marta.", goal: "personal_a_meaning" },
    options: [["Veo a Marta.", "Veo a Marta.", true], ["Veo Marta.", "Veo Marta.", false], ["Veo al libro.", "Veo al libro.", false]],
    explanation: "An identified person used as a direct object normally receives personal a."
  },
  {
    slug: "a2-personal-a-build",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the identified-person sentence",
    instruction: "Place personal a immediately before the identified person.",
    questionText: "I see Marta every morning.",
    answerJson: { correctWords: ["Veo", "a", "Marta", "cada", "mañana", "."], goal: "personal_a_word_order" },
    explanation: "Marta is the identified person directly seen."
  },
  {
    slug: "a2-personal-a-unspecified",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Contrast a specific person with an unspecified person",
    instruction: "Choose the form for any suitable doctor, not one already identified.",
    questionText: "I am looking for any available doctor.",
    answerJson: { correct: "Busco un médico.", goal: "personal_a_specificity" },
    options: [["Busco un médico.", "Busco un médico.", true], ["Busco a un médico.", "Busco a un médico.", false], ["Busco al médico.", "Busco al médico.", false]],
    explanation: "Here the doctor is not identified; any suitable doctor can satisfy the search."
  },
  {
    slug: "a2-personal-a-contraction",
    type: ExerciseType.TRANSLATION,
    prompt: "Produce the identified-person contrast",
    instruction: "Remember that a plus el contracts to al.",
    questionText: "We are looking for the doctor.",
    answerJson: { correct: "Buscamos al médico.", accepted: ["buscamos al médico", "buscamos al medico"], goal: "personal_a_contraction" },
    explanation: "The doctor is identified, and a plus el becomes al."
  },
  {
    slug: "a2-personal-a-listen",
    type: ExerciseType.LISTENING_DICTATION,
    prompt: "Hear the identified-person marker",
    instruction: "Listen for the short a before the known group of people.",
    questionText: "Type what you hear.",
    answerJson: { correct: "Conozco a tus padres.", audioText: "Conozco a tus padres.", accepted: ["conozco a tus padres"], goal: "personal_a_listening" },
    explanation: "The known parents form an identified human direct object."
  },
  {
    slug: "a2-personal-a-tener",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Apply an important boundary",
    instruction: "Do not insert personal a mechanically before every person word.",
    questionText: "I have two brothers.",
    answerJson: { correct: "Tengo dos hermanos.", accepted: ["tengo dos hermanos"], goal: "personal_a_tener_boundary" },
    explanation: "Tener normally omits personal a in this relationship."
  },
  {
    slug: "a2-personal-a-known-people",
    type: ExerciseType.TRANSLATION,
    prompt: "Produce a known-people sentence",
    instruction: "Use personal a before the identified group.",
    questionText: "I know your parents.",
    answerJson: { correct: "Conozco a tus padres.", accepted: ["conozco a tus padres"], goal: "personal_a_production" },
    explanation: "Tus padres identifies the people directly known."
  },
  {
    slug: "a2-personal-a-dialogue",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Answer with a specific person",
    instruction: "Reply with a complete sentence and keep personal a before the named person.",
    questionText: "Say that you are waiting for Daniel.",
    answerJson: { correct: "Espero a Daniel.", accepted: ["espero a daniel"], goal: "personal_a_dialogue" },
    explanation: "Daniel is the specific person directly awaited."
  }
];

async function seedPersonalALesson(client = prisma) {
  const topic = await client.grammarTopic.upsert({
    where: { slug: "personal-a-foundation" },
    update: {
      title: "Personal A with Identified People",
      description: "Direct objects that are identified people, contrasted with things, unspecified people, tener, and hay.",
      cefrLevel: "A2",
      imageKey: lessonDefinition.imageKey
    },
    create: {
      slug: "personal-a-foundation",
      title: "Personal A with Identified People",
      description: "Direct objects that are identified people, contrasted with things, unspecified people, tener, and hay.",
      cefrLevel: "A2",
      imageKey: lessonDefinition.imageKey
    }
  });
  const groups = await client.vocabularyGroup.findMany({
    where: { slug: { in: ["family-basics", "essential-words", "people-and-identity"] } }
  });
  const lessonData = {
    title: lessonDefinition.title,
    summary: lessonDefinition.summary,
    cefrLevel: "A2",
    theme: "Direct Objects and People",
    situation: "finding, seeing, knowing, and waiting for people",
    imageKey: lessonDefinition.imageKey,
    outcomesJson: [
      "You can decide whether a direct object is a thing or a person.",
      "You can mark a specific or identified person with personal a.",
      "You can contrast identified people with unspecified people and the tener boundary."
    ],
    conceptKeys: ["a2", "personal-a", "direct-object", "identified-people"],
    readingJson: lessonDefinition.readingJson,
    reviewSummary: "Choose personal a from personhood and identification, not from a word-for-word German translation.",
    order: lessonDefinition.order,
    estimatedMinutes: 15,
    topicId: topic.id
  };
  const lesson = await client.lesson.upsert({
    where: { slug: lessonDefinition.slug },
    update: {
      ...lessonData,
      vocabularyGroups: { set: groups.map(({ id }) => ({ id })) }
    },
    create: {
      slug: lessonDefinition.slug,
      ...lessonData,
      vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) }
    }
  });
  await client.sentence.deleteMany({ where: { lessonId: lesson.id } });
  await client.sentence.createMany({
    data: lessonDefinition.sentences.map(([spanish, english, note]) => ({
      lessonId: lesson.id,
      topicId: topic.id,
      spanish,
      english,
      note
    }))
  });
  const keepSlugs = [];
  for (let index = 0; index < exerciseDefinitions.length; index += 1) {
    const input = exerciseDefinitions[index];
    keepSlugs.push(input.slug);
    const exercise = await client.exercise.upsert({
      where: { slug: input.slug },
      update: {
        lessonId: lesson.id,
        topicId: topic.id,
        type: input.type,
        prompt: input.prompt,
        instruction: input.instruction,
        questionText: input.questionText,
        answerJson: input.answerJson,
        explanation: input.explanation,
        difficulty: 2,
        order: index + 1,
        xpReward: 12,
        imageKey: lessonDefinition.imageKey
      },
      create: {
        slug: input.slug,
        lessonId: lesson.id,
        topicId: topic.id,
        type: input.type,
        prompt: input.prompt,
        instruction: input.instruction,
        questionText: input.questionText,
        answerJson: input.answerJson,
        explanation: input.explanation,
        difficulty: 2,
        order: index + 1,
        xpReward: 12,
        imageKey: lessonDefinition.imageKey
      }
    });
    await client.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
    if (input.options?.length) {
      await client.exerciseOption.createMany({
        data: input.options.map(([text, value, isCorrect], optionIndex) => ({
          exerciseId: exercise.id,
          text,
          value,
          isCorrect,
          order: optionIndex + 1
        }))
      });
    }
  }
  await client.exercise.deleteMany({
    where: {
      lessonId: lesson.id,
      NOT: [
        { slug: { in: keepSlugs } },
        { slug: { startsWith: `supplement-${lessonDefinition.slug}-` } }
      ]
    }
  });
  return lesson;
}

if (require.main === module) {
  seedPersonalALesson()
    .then(() => console.log("Seeded the A2 personal-a foundation package."))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}

module.exports = { lessonDefinition, exerciseDefinitions, seedPersonalALesson };
