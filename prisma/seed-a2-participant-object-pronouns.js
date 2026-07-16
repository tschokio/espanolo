const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessonDefinition = {
  slug: "a2-object-pronouns-me-te-nos",
  title: "Use Me, Te, and Nos with Conversation Partners",
  summary: "Use me, te, and nos for people directly affected by an action or receiving a thing or message.",
  order: 755,
  imageKey: "object-pronouns-and-shopping:5",
  sentences: [
    ["Marta me ve cada mañana.", "Marta sees me every morning.", "Me is the person directly seen; it does not change for gender."],
    ["Te llamo esta tarde.", "I will call you this afternoon.", "Te is the familiar conversation partner directly called."],
    ["Ana nos ayuda con el problema.", "Ana helps us with the problem.", "Nos marks the group directly helped."],
    ["¿Me da el menú, por favor?", "Could you give me the menu, please?", "Me is the receiver while el menú remains the thing given."],
    ["Te envío la dirección ahora.", "I am sending you the address now.", "Te is the receiver while la dirección remains explicit."]
  ],
  readingJson: {
    title: "Quién recibe la acción y quién recibe una cosa",
    titleEs: "Quién recibe la acción y quién recibe una cosa",
    titleEn: "Who Receives the Action and Who Receives a Thing",
    inputMode: "listening",
    paragraphs: [
      "Clara llama a Diego: «Te llamo porque Ana nos ayuda con la mudanza. ¿Me dices la dirección del piso?». Diego responde: «Sí, te digo la dirección ahora. Marta me lleva en coche». Los tres coordinan una tarea sin repetir sus nombres en cada frase.",
      "En te llamo, Diego recibe directamente la llamada. En nos ayuda, Clara y Diego reciben directamente la ayuda. En me dices la dirección y te digo la dirección, una persona recibe información y la dirección sigue expresada como la cosa comunicada."
    ],
    questions: [
      {
        questionDe: "Welche Person ist in te llamo direkt von der Handlung betroffen?",
        questionEn: "Which person is directly affected by the action in te llamo?",
        optionsDe: ["Die angesprochene vertraute Person Diego", "Die Sprecherin Clara", "Ana und Clara zusammen"],
        optionsEn: ["The familiar person addressed, Diego", "The speaker, Clara", "Ana and Clara together"],
        correct: 0,
        explanationDe: "Te verweist auf die vertraut angesprochene Person. Diego ist hier das direkte Objekt von llamar: Clara ruft ihn an.",
        explanationEn: "Te refers to the familiar person addressed. Diego is the direct object of llamar here: Clara calls him."
      },
      {
        questionDe: "Warum bleibt in me dices la dirección die Richtung zusätzlich im Satz stehen?",
        questionEn: "Why does la dirección remain explicit in me dices la dirección?",
        optionsDe: ["Me bezeichnet den Empfänger; la dirección ist die mitgeteilte Sache", "Me ersetzt gleichzeitig Person und Sache", "Decir darf kein direktes Objekt haben"],
        optionsEn: ["Me marks the receiver; la dirección is the thing communicated", "Me replaces both person and thing", "Decir cannot have a direct object"],
        correct: 0,
        explanationDe: "Die Person erhält Information und wird mit me markiert; der Inhalt der Mitteilung bleibt als la dirección sichtbar. So trennst du Empfänger und Sache.",
        explanationEn: "The person receives information and is marked by me; the content remains visible as la dirección. This separates receiver from thing."
      }
    ],
    orientationDe: "Achte zuerst darauf, wer spricht und wer angesprochen wird. Frage dann: Trifft die Handlung die Person direkt, oder erhält sie eine Sache beziehungsweise Information? Me, te und nos behalten in beiden Rollen dieselbe Form.",
    orientationEn: "First identify who is speaking and who is addressed. Then ask whether the action directly affects the person or whether the person receives a thing or information. Me, te, and nos keep the same form in both roles.",
    recallPromptDe: "Erkläre auf Spanisch, warum Clara Diego anruft, wer bei der Aufgabe hilft, welche Information Clara benötigt und wie Marta zum Ort kommt. Verwende dabei te, nos und me.",
    recallPromptEn: "Explain in Spanish why Clara calls Diego, who helps with the task, which information Clara needs, and how Marta reaches the place. Use te, nos, and me.",
    modelSummary: "Clara te llama porque Ana nos ayuda; Diego me dice la dirección y Marta me lleva en coche."
  }
};

const exerciseDefinitions = [
  {
    slug: "a2-me-te-nos-direct-meaning",
    type: ExerciseType.MULTIPLE_CHOICE,
    questionText: "Marta sees me every morning.",
    answerJson: { correct: "Marta me ve cada mañana.", goal: "participant_object_direct" },
    options: [["Marta me ve cada mañana.", true], ["Marta te ve cada mañana.", false], ["Marta nos vemos cada mañana.", false]]
  },
  {
    slug: "a2-me-te-nos-build-te",
    type: ExerciseType.SENTENCE_BUILDER,
    questionText: "I will call you this afternoon.",
    answerJson: { correctWords: ["Te", "llamo", "esta", "tarde", "."], goal: "participant_object_position" }
  },
  {
    slug: "a2-me-te-nos-group",
    type: ExerciseType.MULTIPLE_CHOICE,
    questionText: "Ana helps us with the problem.",
    answerJson: { correct: "Ana nos ayuda con el problema.", goal: "participant_object_group" },
    options: [["Ana nos ayuda con el problema.", true], ["Ana me ayuda con el problema.", false], ["Ana los ayuda con el problema.", false]]
  },
  {
    slug: "a2-me-te-nos-receiver",
    type: ExerciseType.TRANSLATION,
    questionText: "Could you give me the menu, please?",
    answerJson: { correct: "¿Me da el menú, por favor?", accepted: ["me da el menú por favor", "me da el menu por favor"], goal: "participant_object_receiver" }
  },
  {
    slug: "a2-me-te-nos-listen",
    type: ExerciseType.LISTENING_DICTATION,
    questionText: "Type what you hear.",
    answerJson: { correct: "Ana nos ayuda con el problema.", audioText: "Ana nos ayuda con el problema.", accepted: ["ana nos ayuda con el problema"], goal: "participant_object_listening" }
  },
  {
    slug: "a2-me-te-nos-information",
    type: ExerciseType.SHORT_ANSWER,
    questionText: "I am sending you the address now.",
    answerJson: { correct: "Te envío la dirección ahora.", accepted: ["te envío la dirección ahora", "te envio la direccion ahora"], goal: "participant_object_receiver" }
  },
  {
    slug: "a2-me-te-nos-production",
    type: ExerciseType.TRANSLATION,
    questionText: "Marta sees me every morning.",
    answerJson: { correct: "Marta me ve cada mañana.", accepted: ["marta me ve cada mañana"], goal: "participant_object_production" }
  },
  {
    slug: "a2-me-te-nos-dialogue",
    type: ExerciseType.DIALOGUE_REPLY,
    questionText: "Promise to call the other person this afternoon.",
    answerJson: { correct: "Sí, te llamo esta tarde.", accepted: ["sí te llamo esta tarde", "si te llamo esta tarde", "te llamo esta tarde"], goal: "participant_object_dialogue" }
  }
];

async function seedParticipantObjectPronouns(client = prisma) {
  const topic = await client.grammarTopic.upsert({
    where: { slug: "participant-object-pronouns" },
    update: {
      title: "Me, Te, and Nos as Object Pronouns",
      description: "Conversation participants as direct objects or receivers, with stable pronoun form and preverbal placement.",
      cefrLevel: "A2",
      imageKey: lessonDefinition.imageKey
    },
    create: {
      slug: "participant-object-pronouns",
      title: "Me, Te, and Nos as Object Pronouns",
      description: "Conversation participants as direct objects or receivers, with stable pronoun form and preverbal placement.",
      cefrLevel: "A2",
      imageKey: lessonDefinition.imageKey
    }
  });
  const groups = await client.vocabularyGroup.findMany({
    where: { slug: { in: ["essential-words", "useful-phrases", "communication-repair"] } }
  });
  const lessonData = {
    title: lessonDefinition.title,
    summary: lessonDefinition.summary,
    cefrLevel: "A2",
    theme: "Conversation Participants and Objects",
    situation: "calling, helping, giving, and sending between conversation partners",
    imageKey: lessonDefinition.imageKey,
    outcomesJson: [
      "You can use me, te, and nos for people directly affected by an action.",
      "You can use the same forms for receivers while keeping the thing explicit.",
      "You can place participant object pronouns before a conjugated verb."
    ],
    conceptKeys: ["a2", "object-pronouns", "me-te-nos", "conversation-participants"],
    readingJson: lessonDefinition.readingJson,
    reviewSummary: "Identify the conversation participant and their role before choosing me, te, or nos.",
    order: lessonDefinition.order,
    estimatedMinutes: 15,
    topicId: topic.id
  };
  const lesson = await client.lesson.upsert({
    where: { slug: lessonDefinition.slug },
    update: { ...lessonData, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } },
    create: { slug: lessonDefinition.slug, ...lessonData, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } }
  });
  await client.sentence.deleteMany({ where: { lessonId: lesson.id } });
  await client.sentence.createMany({
    data: lessonDefinition.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note }))
  });
  const keep = [];
  for (let index = 0; index < exerciseDefinitions.length; index += 1) {
    const input = exerciseDefinitions[index];
    keep.push(input.slug);
    const data = {
      lessonId: lesson.id,
      topicId: topic.id,
      type: input.type,
      prompt: "Use a conversation-participant object pronoun",
      instruction: "Identify who is directly affected or receives something, then place me, te, or nos before the conjugated verb.",
      questionText: input.questionText,
      answerJson: input.answerJson,
      explanation: "Me, te, and nos identify conversation participants; the surrounding verb and remaining noun show whether the person is directly affected or receives something.",
      difficulty: index < 3 ? 2 : 3,
      order: index + 1,
      xpReward: 12,
      imageKey: lessonDefinition.imageKey
    };
    const exercise = await client.exercise.upsert({ where: { slug: input.slug }, update: data, create: { slug: input.slug, ...data } });
    await client.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
    if (input.options) {
      await client.exerciseOption.createMany({
        data: input.options.map(([text, isCorrect], optionIndex) => ({ exerciseId: exercise.id, text, value: text, isCorrect, order: optionIndex + 1 }))
      });
    }
  }
  await client.exercise.deleteMany({
    where: { lessonId: lesson.id, slug: { startsWith: "a2-me-te-nos-", notIn: keep } }
  });
  return lesson;
}

if (require.main === module) {
  seedParticipantObjectPronouns()
    .then(() => console.log("Seeded the A2 me, te, and nos object-pronoun package."))
    .catch((error) => { console.error(error); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
}

module.exports = { exerciseDefinitions, lessonDefinition, seedParticipantObjectPronouns };
