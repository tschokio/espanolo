const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a1-five-clear-vowels",
    topic: { slug: "sound-five-vowels", title: "Five Clear Spanish Vowels", description: "Stable a, e, i, o, u sounds and their relationship to Spanish spelling." },
    title: "Hear and Produce the Five Clear Vowels",
    summary: "Build a reliable sound anchor for a, e, i, o, and u without importing German diphthongs or reduced vowels.",
    situation: "reading and repeating new Spanish words accurately",
    order: 1,
    imageKey: "communication-repair:1",
    conceptKeys: ["sound-foundation", "vowels", "sound-spelling"],
    sentences: [
      ["casa, mesa, piso, poco, luna", "Five vowel anchors: house, table, floor, little, moon.", "Each written vowel keeps one clear target sound."],
      ["Ana toma café.", "Ana drinks coffee.", "Keep every vowel short and clear instead of swallowing an unstressed syllable."],
      ["Mi libro está aquí.", "My book is here.", "The written vowels remain recognizable in unstressed and stressed syllables."],
      ["Como poco, pero bebo agua.", "I eat little, but I drink water.", "A sequence of vowels stays separated across the rhythm of the sentence."],
      ["Una música suave.", "Soft music.", "Clear u and a sounds make even a short phrase easier to recognize." ]
    ],
    checks: [
      ["Which row shows the five Spanish vowels in order?", "a · e · i · o · u", ["a · e · i · o · u", "a · i · e · u · o", "a · ä · e · ö · u"]],
      ["Which word is the anchor for the Spanish vowel u?", "luna", ["luna", "mesa", "piso"]]
    ],
    error: ["Mi libro esta aqui.", "Mi libro está aquí."]
  },
  {
    slug: "a1-consonant-sound-map",
    topic: { slug: "sound-consonant-map", title: "Consonant Sound Map", description: "High-value sound-spelling patterns with h, j, g, c, z, qu, and ñ." },
    title: "Map H, J, G, C, Z, Qu, and Ñ",
    summary: "Read the most important Spanish consonant spellings from their letter context instead of guessing from German.",
    situation: "decoding unfamiliar names, places, and everyday words",
    order: 3,
    imageKey: "communication-repair:10",
    conceptKeys: ["sound-foundation", "consonants", "sound-spelling"],
    sentences: [
      ["Hola, Hugo.", "Hello, Hugo.", "Written h is silent in standard Spanish."],
      ["La gente viaja a México.", "People travel to Mexico.", "J and g before e or i often share the strong jota sound."],
      ["Cecilia cocina queso.", "Cecilia cooks cheese.", "C changes with the following vowel, while qu protects the k sound before e or i."],
      ["El niño quiere una guitarra.", "The boy wants a guitar.", "Ñ is its own sound; gu keeps a hard g before i in guitarra."],
      ["Cinco zapatos azules.", "Five blue shoes.", "C before e or i and z vary regionally between an s-like and th-like realization." ]
    ],
    checks: [
      ["Which Spanish word begins with a silent h?", "hola", ["hola", "jota", "gente"]],
      ["Which spelling keeps a k sound before e?", "que", ["que", "ce", "ge"]]
    ],
    error: ["La jente viaja a Méjico.", "La gente viaja a México."]
  },
  {
    slug: "a1-r-rr-b-v-ll-y",
    topic: { slug: "sound-key-contrasts", title: "Key Consonant Contrasts and Variation", description: "Single r versus rr, b/v, and common ll/y pronunciation without ranking regional varieties." },
    title: "Control R and RR; Understand B/V and LL/Y",
    summary: "Protect meaning with the r–rr contrast while learning which written distinctions usually do and do not create a sound contrast.",
    situation: "being understood when a small consonant change can alter a word",
    order: 5,
    imageKey: "communication-repair:9",
    conceptKeys: ["sound-foundation", "r-rr", "regional-variation"],
    sentences: [
      ["Pero el perro corre.", "But the dog runs.", "A single r between vowels and rr are distinct: pero and perro are different words."],
      ["Quiero un carro rojo.", "I want a red car.", "The strong r appears in rr and at the beginning of rojo."],
      ["Bebo vino con Verónica.", "I drink wine with Verónica.", "B and v normally belong to the same sound system in Spanish."],
      ["Yo llamo a Yolanda.", "I call Yolanda.", "Many varieties pronounce ll and y alike; established regional alternatives are also valid."],
      ["Caro y carro no son iguales.", "Expensive and car are not the same.", "The r–rr contrast can change lexical meaning." ]
    ],
    checks: [
      ["Which pair contrasts a single r with rr?", "pero · perro", ["pero · perro", "bebo · vivo", "yo · llamo"]],
      ["Which letter pair normally does not create a meaning-changing sound contrast in Spanish?", "b · v", ["b · v", "r · rr", "n · ñ"]]
    ],
    error: ["Pero el pero corre.", "Pero el perro corre."]
  },
  {
    slug: "a1-syllables-stress-accents",
    topic: { slug: "sound-stress-accents", title: "Syllables, Stress, and Written Accents", description: "Default stress, written accents, question words, and meaning-changing accent marks." },
    title: "Find Stress and Read Written Accents",
    summary: "Predict the stressed syllable, notice when a written accent overrides the default, and preserve accent marks that carry meaning.",
    situation: "reading a new word aloud and writing it accurately",
    order: 7,
    imageKey: "reading-and-listening-lab:4",
    conceptKeys: ["sound-foundation", "stress", "written-accents"],
    sentences: [
      ["La casa es grande.", "The house is big.", "Words ending in a vowel, n, or s normally stress the next-to-last syllable when no accent is written."],
      ["Trabajo en un hotel.", "I work in a hotel.", "Words ending in another consonant normally stress the last syllable."],
      ["La canción terminó.", "The song ended.", "A written accent marks stress that the default spelling rule would not predict."],
      ["El médico llegó rápido.", "The doctor arrived quickly.", "Accent marks remain visible even when several stressed words occur in one sentence."],
      ["¿Dónde está el teléfono?", "Where is the telephone?", "Direct question words carry a written accent, and teléfono marks its non-default stress." ]
    ],
    checks: [
      ["Which word needs a written accent in standard spelling?", "canción", ["canción", "casa", "hotel"]],
      ["Which word normally carries final stress without a written accent?", "hotel", ["hotel", "casa", "mesa"]]
    ],
    error: ["La cancion termino.", "La canción terminó."]
  },
  {
    slug: "a1-rhythm-linking-intonation",
    topic: { slug: "sound-rhythm-intonation", title: "Rhythm, Linking, and Intonation", description: "Phrase groups, smooth linking, question melody, contrastive stress, and communication repair." },
    title: "Speak in Meaning Groups, Not Isolated Words",
    summary: "Follow Spanish syllable rhythm, connect words naturally, and use intonation to make questions, contrast, and repair easier to understand.",
    situation: "saying a complete thought at a manageable natural pace",
    order: 8,
    imageKey: "conversation-and-opinion:4",
    conceptKeys: ["sound-foundation", "rhythm", "intonation"],
    sentences: [
      ["Buenos días, ¿cómo estás?", "Good morning, how are you?", "Greeting and question form two short meaning groups."],
      ["Quiero ir a casa.", "I want to go home.", "Adjacent words connect smoothly without inserting a new pause after every word."],
      ["¿Vienes conmigo o te quedas?", "Are you coming with me or staying?", "Intonation and the two alternatives make the question structure audible."],
      ["No entiendo; ¿puede repetirlo?", "I do not understand; can you repeat that?", "A small pause separates the problem from the repair request."],
      ["Hoy no puedo, pero mañana sí.", "I cannot today, but tomorrow I can.", "Stress on hoy, mañana, no, and sí makes the contrast easy to follow." ]
    ],
    checks: [
      ["Which sentence uses the complete Spanish question marks?", "¿Cómo estás?", ["¿Cómo estás?", "Cómo estás?", "¡Cómo estás!"]],
      ["Which sentence contains an explicit spoken contrast?", "Hoy no puedo, pero mañana sí.", ["Hoy no puedo, pero mañana sí.", "Quiero ir a casa.", "Buenos días."]]
    ],
    error: ["Como estas?", "¿Cómo estás?"]
  },
  {
    slug: "checkpoint-a1-sound-foundation",
    topic: { slug: "sound-foundation-checkpoint", title: "Spanish Sound Foundation Checkpoint", description: "Integrated proof of vowel clarity, consonant decoding, r/rr, stress, written accents, rhythm, and intonation." },
    title: "A1.P Spanish Sound Foundation Checkpoint",
    summary: "Check that you can decode, hear, write, and produce the core Spanish sound-spelling system before building a large vocabulary.",
    situation: "reading and recovering unfamiliar Spanish accurately",
    order: 9,
    imageKey: "reading-and-listening-lab:12",
    checkpoint: true,
    conceptKeys: ["checkpoint", "sound-foundation", "vowels", "consonants", "stress", "rhythm"],
    sentences: [
      ["Ana quiere un carro rojo.", "Ana wants a red car.", "Clear vowels, qu, and rr combine in one short sentence."],
      ["La gente llegó a casa.", "People arrived home.", "Jota-like g, written stress, and final natural stress work together."],
      ["¿Dónde está el niño?", "Where is the boy?", "Question intonation, written accents, and ñ remain distinct."],
      ["Pero el perro no bebe vino.", "But the dog does not drink wine.", "Single r, rr, and b/v spelling appear in one retrievable contrast."],
      ["No entiendo; ¿puede repetirlo más despacio?", "I do not understand; can you repeat it more slowly?", "Use rhythm and intonation in the repair phrase that protects real conversations." ]
    ],
    checks: [
      ["Which example shows a meaning-changing r–rr contrast?", "pero · perro", ["pero · perro", "bebo · vivo", "hola · ola"]],
      ["Which word combines ñ with a written question context?", "niño", ["niño", "hotel", "vino"]]
    ],
    error: ["Donde esta el niño?", "¿Dónde está el niño?"]
  }
];

const tokens = (value) => String(value || "").match(/[\p{L}\p{N}]+|[¿?¡!.,;·]/gu) || [];
const accepted = (value) => {
  const plain = String(value || "").toLocaleLowerCase("es").replace(/[¿?¡!.,;·]/g, " ").replace(/\s+/g, " ").trim();
  return [...new Set([plain, `${plain}.`, `${plain}?`])];
};

function lessonChecks(input) {
  const sentence = (index) => ({ spanish: input.sentences[index][0], english: input.sentences[index][1] });
  const checks = [
    { key: "recognize-model", type: ExerciseType.MULTIPLE_CHOICE, question: sentence(0).english, correct: sentence(0).spanish, options: [sentence(0).spanish, sentence(1).spanish, sentence(2).spanish] },
    { key: "concept-choice", type: ExerciseType.MULTIPLE_CHOICE, question: input.checks[0][0], correct: input.checks[0][1], options: input.checks[0][2] },
    { key: "listen-one", type: ExerciseType.LISTENING_DICTATION, question: "Type what you hear.", correct: sentence(0).spanish, audioText: sentence(0).spanish },
    { key: "listen-two", type: ExerciseType.LISTENING_DICTATION, question: "Write the key sentence you hear.", correct: sentence(1).spanish, audioText: sentence(1).spanish },
    { key: "build-model", type: ExerciseType.SENTENCE_BUILDER, question: sentence(2).english, correctWords: tokens(sentence(2).spanish) },
    { key: "produce-model", type: ExerciseType.TRANSLATION, question: sentence(3).english, correct: sentence(3).spanish },
    { key: "recall-model", type: ExerciseType.SHORT_ANSWER, question: sentence(4).english, correct: sentence(4).spanish },
    { key: "correct-spelling", type: ExerciseType.ERROR_CORRECTION, question: input.error[0], correct: input.error[1] },
    { key: "transform-sound", type: ExerciseType.TRANSFORMATION, question: sentence(1).english, correct: sentence(1).spanish },
    { key: "contrast-choice", type: ExerciseType.MULTIPLE_CHOICE, question: input.checks[1][0], correct: input.checks[1][1], options: input.checks[1][2] }
  ];
  if (input.checkpoint) {
    checks.push(
      { key: "listen-checkpoint", type: ExerciseType.LISTENING_DICTATION, question: "Listen to the sentence.", correct: sentence(2).spanish, audioText: sentence(2).spanish },
      { key: "produce-checkpoint", type: ExerciseType.TRANSLATION, question: sentence(0).english, correct: sentence(0).spanish }
    );
  }
  return checks;
}

async function saveExercise(lesson, check, order) {
  const slug = `${lesson.slug}-${check.key}`;
  const answerJson = check.correctWords
    ? { correctWords: check.correctWords, goal: "sound_word_order" }
    : {
        correct: check.correct,
        accepted: accepted(check.correct),
        goal: check.type === ExerciseType.LISTENING_DICTATION ? "sound_listening" : check.type === ExerciseType.ERROR_CORRECTION ? "sound_spelling_correction" : "sound_active_recall",
        ...(check.audioText ? { audioText: check.audioText } : {})
      };
  const data = {
    lessonId: lesson.id,
    topicId: lesson.topicId,
    type: check.type,
    prompt: check.type === ExerciseType.LISTENING_DICTATION ? "Hear the Spanish sound pattern" : "Connect Spanish sound and spelling",
    instruction: "Listen or read for the target contrast, then retrieve the complete Spanish form before checking the model.",
    questionText: check.question,
    answerJson,
    explanation: "Spanish becomes easier to hear and produce when spelling, stress, and rhythm are stored together with meaningful examples.",
    difficulty: inputDifficulty(lesson.order),
    order,
    xpReward: lesson.order === 9 ? 12 : 10,
    imageKey: lesson.imageKey
  };
  const saved = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (check.options) {
    await prisma.exerciseOption.createMany({
      data: check.options.map((text, index) => ({ exerciseId: saved.id, text, value: text, isCorrect: text === check.correct, order: index + 1 }))
    });
  }
}

function inputDifficulty(order) {
  return order <= 3 ? 1 : order <= 8 ? 2 : 3;
}

async function main() {
  for (const input of lessons) {
    const topic = await prisma.grammarTopic.upsert({
      where: { slug: input.topic.slug },
      update: { title: input.topic.title, description: input.topic.description, cefrLevel: "A1", imageKey: input.imageKey },
      create: { slug: input.topic.slug, title: input.topic.title, description: input.topic.description, cefrLevel: "A1", imageKey: input.imageKey }
    });
    const lessonData = {
      title: input.title,
      summary: input.summary,
      cefrLevel: "A1",
      theme: input.checkpoint ? "Checkpoint" : "Sound Foundation",
      situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: [
        "You can connect frequent Spanish spellings to a reliable sound target.",
        "You can hear and reproduce the lesson contrast in meaningful words and sentences.",
        "You can use stress, accent marks, and rhythm to make a complete thought easier to understand."
      ],
      conceptKeys: input.conceptKeys,
      reviewSummary: input.summary,
      order: input.order,
      estimatedMinutes: input.checkpoint ? 15 : 11,
      topicId: topic.id
    };
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: lessonData, create: { slug: input.slug, ...lessonData } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const checks = lessonChecks(input);
    for (let index = 0; index < checks.length; index += 1) await saveExercise(lesson, checks[index], index + 1);
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { notIn: keep } } });
  }
  console.log(`Seeded ${lessons.length} A1 sound-foundation learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
