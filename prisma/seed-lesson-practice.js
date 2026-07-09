const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();
const TARGET_EXERCISE_COUNT = 16;

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const slugPart = (value) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

const tokensForBuilder = (sentence) => String(sentence || "").match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];

const acceptedSentence = (sentence) => {
  const plain = normalize(sentence);
  return [...new Set([plain, `${plain}.`, `${plain}?`, `${plain}!`])];
};

const lowerRaw = (value) => String(value || "").toLocaleLowerCase("es");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasRawSpanishToken(rawText, token) {
  if (!token) return false;
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(lowerRaw(token))}([^\\p{L}\\p{N}]|$)`, "u").test(rawText);
}

function hasNormalizedTerm(normalizedText, term) {
  if (!term || term.length < 3) return false;
  return new RegExp(`(^|\\s)${escapeRegExp(term)}(\\s|$)`).test(normalizedText);
}

function lessonTeachingCorpus(lesson) {
  const pieces = [
    lesson.title,
    lesson.summary,
    lesson.situation,
    lesson.reviewSummary,
    ...(lesson.sentences || []).flatMap((sentence) => [sentence.spanish, sentence.english, sentence.note])
  ].filter(Boolean);
  const raw = lowerRaw(pieces.join(" "));
  return {
    raw,
    normalized: normalize(raw)
  };
}

function vocabularySearchTerms(word) {
  const spanish = normalize(word.spanish);
  const english = normalize(word.english);
  const terms = new Set([spanish, english].filter((term) => term.length >= 3));
  const spanishWithoutArticle = spanish.replace(/^(el|la|los|las|un|una|unos|unas)\s+/, "");
  const englishWithoutTo = english.replace(/^to\s+/, "");
  if (spanishWithoutArticle.length >= 3) terms.add(spanishWithoutArticle);
  if (englishWithoutTo.length >= 3) terms.add(englishWithoutTo);
  return [...terms];
}

function vocabularyWordIsTaught(word, corpus) {
  if (word.partOfSpeech === "pronoun") {
    return hasRawSpanishToken(corpus.raw, word.spanish);
  }
  return vocabularySearchTerms(word).some((term) => hasNormalizedTerm(corpus.normalized, term));
}

function semanticImageKey(text, fallback) {
  const normalized = normalize(text);
  if (/\b(me llamo|my name is)\b/.test(normalized)) return "identity-and-introductions:2";
  if (/\b(yo soy ana|soy ana|i am ana)\b/.test(normalized)) return "identity-and-introductions:1";
  if (/\b(soy de|from austria)\b/.test(normalized)) return "identity-and-introductions:12";
  if (/\b(hola|hello)\b/.test(normalized)) return "identity-and-introductions:13";
  if (/^yo i\b/.test(normalized) || normalized === "yo") return "identity-and-introductions:5";
  if (/^tu you\b/.test(normalized) || normalized === "tu") return "identity-and-introductions:6";
  if (/^ella she\b/.test(normalized) || normalized === "ella") return "identity-and-introductions:1";
  if (/\b(yo soy estudiante|yo estudiante|i am a student)\b/.test(normalized)) return "identity-and-introductions:8";
  if (/\b(ana esta cansada|ana is tired)\b/.test(normalized)) return "identity-and-introductions:9";
  if (/\b(nervios|nervous)\b/.test(normalized)) return "emotions-and-states:4";
  if (/\b(cansad|tired)\b/.test(normalized)) return "emotions-and-states:3";
  if (/\b(feliz|happy)\b/.test(normalized)) return "emotions-and-states:1";
  if (/\b(estoy en casa|ella esta en casa|i am at home|she is at home)\b/.test(normalized)) return "identity-and-introductions:7";
  if (/\b(me gusta el cafe|like coffee)\b/.test(normalized)) return "preferences-and-hobbies:7";
  if (/\b(en el cafe|in the cafe|where is the cafe)\b/.test(normalized)) return "places-around-town:1";
  if (/\b(un cafe|a coffee|coffee please|coffees|quiero.*cafe|order.*coffee)\b/.test(normalized)) return "food-and-ordering:2";
  if (/\b(la cuenta|the bill)\b/.test(normalized)) return "food-and-ordering:18";
  if (/\b(menu)\b/.test(normalized)) return "food-and-ordering:17";
  if (/\b(mesa para dos|table for two|cuantas personas)\b/.test(normalized)) return "food-and-ordering:19";
  if (/\b(para llevar|to go)\b/.test(normalized)) return "food-and-ordering:20";
  if (/\b(sopa|soup)\b/.test(normalized)) return "food-and-ordering:5";
  if (/\b(pan|bread)\b/.test(normalized)) return "food-and-ordering:3";
  if (/\b(dos manzanas|two apples)\b/.test(normalized)) return "numbers-and-colors:2";
  if (/\b(la manzana es roja|apple is red)\b/.test(normalized)) return "numbers-and-colors:7";
  if (/\b(manzana|apple)\b/.test(normalized)) return "fruit-and-produce:1";
  if (/\b(platano|banana)\b/.test(normalized)) return "fruit-and-produce:2";
  if (/\b(taxi)\b/.test(normalized)) return "city-transport:3";
  if (/\b(hotel)\b/.test(normalized)) return "city-transport:13";
  if (/\b(estacion|station|platform)\b/.test(normalized)) return "city-transport:7";
  if (/\b(mapa|map)\b/.test(normalized)) return "travel-and-survival:5";
  if (/\b(me duele.*cabeza|head hurts|my head hurts)\b/.test(normalized)) return "body-and-health:7";
  if (/\b(cabeza|head)\b/.test(normalized)) return "body-and-health:1";
  if (/\b(doctor|farmacia|farmaceutica|medicine|medicina|alergia|allergy|aspirin)\b/.test(normalized)) return "body-and-health:12";
  if (/\b(hambre|hungry)\b/.test(normalized)) return "body-and-health:10";
  if (/\b(sed|thirsty)\b/.test(normalized)) return "body-and-health:11";
  if (/\b(no me gusta la lluvia|do not like rain)\b/.test(normalized)) return "preferences-and-hobbies:8";
  if (/\b(lluvia|rain)\b/.test(normalized)) return "weather-and-time:2";
  if (/\b(hace sol|sunny)\b/.test(normalized)) return "weather-and-time:1";
  if (/\b(prefiero la playa|prefer the beach)\b/.test(normalized)) return "preferences-and-hobbies:10";
  if (/\b(playa|beach)\b/.test(normalized)) return "places-around-town:16";
  if (/\b(me despierto|despertarse|wake up)\b/.test(normalized)) return "a2-daily-routine:1";
  if (/\b(me levanto|levantarse|get up)\b/.test(normalized)) return "a2-daily-routine:2";
  if (/\b(cepill|brush teeth)\b/.test(normalized)) return "a2-daily-routine:4";
  if (/\b(desayun|breakfast)\b/.test(normalized)) return "a2-daily-routine:6";
  if (/\b(trabajo por la manana|work in the morning)\b/.test(normalized)) return "identity-and-introductions:10";
  if (/\b(estudio por la tarde|study in the afternoon)\b/.test(normalized)) return "a2-daily-routine:8";
  if (/\b(limpio cada semana|clean every week)\b/.test(normalized)) return "a2-daily-routine:15";
  if (/\b(cocino|cook)\b/.test(normalized)) return "a2-daily-routine:9";
  if (/\b(por la noche.*le|read at night|at night.*read)\b/.test(normalized)) return "a2-daily-routine:12";
  if (/\b(leo|leer|read)\b/.test(normalized)) return "daily-actions:7";
  if (/\b(musica|music)\b/.test(normalized)) return "preferences-and-hobbies:1";
  if (/\b(peliculas|movies)\b/.test(normalized)) return "preferences-and-hobbies:2";
  if (/\b(futbol|soccer)\b/.test(normalized)) return "preferences-and-hobbies:3";
  if (/\b(el te|tea|prefieres cafe o te|prefiero el te)\b/.test(normalized)) return "preferences-and-hobbies:9";
  if (/\b(color favorito|favorite color)\b/.test(normalized)) return "preferences-and-hobbies:12";
  if (/\b(mas despacio|more slowly)\b/.test(normalized)) return "daily-actions:6";
  if (/\b(no entiendo|do not understand)\b/.test(normalized)) return "grammar-scenes:12";
  if (/\b(necesito ayuda|need help)\b/.test(normalized)) return "travel-and-survival:12";
  if (/\b(perdon|sorry|excuse me)\b/.test(normalized)) return "travel-and-survival:1";
  if (/\b(gracias|thank you)\b/.test(normalized)) return "identity-and-introductions:16";
  if (/\b(cuanto cuesta|cost)\b/.test(normalized)) return "travel-and-survival:19";
  if (/\b(por favor|please)\b/.test(normalized)) return "food-and-ordering:17";
  return fallback;
}

function choiceOptions(correct, distractors) {
  return [
    [correct, correct, true],
    ...distractors
      .filter(Boolean)
      .filter((item) => normalize(item) !== normalize(correct))
      .filter((item, index, list) => list.findIndex((candidate) => normalize(candidate) === normalize(item)) === index)
      .slice(0, 3)
      .map((item) => [item, item, false])
  ];
}

function sentenceExercises(lesson) {
  const exercises = [];
  for (const [index, sentence] of lesson.sentences.entries()) {
    const spanish = sentence.spanish.trim();
    const english = sentence.english.trim();
    if (!spanish || !english) continue;
    const words = tokensForBuilder(spanish);
    const lexicalWordCount = words.filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

    // A single conjugated form such as "es" or "está" needs a subject or
    // situation before it can be translated unambiguously. Keep it as a
    // teaching card, but do not turn it into a standalone recall question.
    if (lexicalWordCount < 2) continue;

    exercises.push({
      key: `translate-${index + 1}`,
      type: ExerciseType.TRANSLATION,
      prompt: "Active production.",
      instruction: "Type the Spanish sentence.",
      questionText: english,
      answerJson: {
        correct: spanish,
        accepted: acceptedSentence(spanish),
        goal: "active_production"
      },
      explanation: sentence.note || `A natural answer is: ${spanish}`,
      difficulty: 2,
      imageKey: semanticImageKey(`${spanish} ${english}`, lesson.imageKey),
      options: []
    });

    if (words.length >= 3 && words.length <= 10) {
      exercises.push({
        key: `builder-${index + 1}`,
        type: ExerciseType.SENTENCE_BUILDER,
        prompt: "Build the sentence.",
        instruction: "Put the words in order.",
        questionText: english,
        answerJson: {
          correctWords: words,
          goal: "word_order"
        },
        explanation: sentence.note || `The word order is: ${spanish}`,
        difficulty: 1,
        imageKey: semanticImageKey(`${spanish} ${english}`, lesson.imageKey),
        options: words.map((word) => [word, word, false])
      });
    }
  }
  return exercises;
}

function vocabularyExercises(lesson) {
  const corpus = lessonTeachingCorpus(lesson);
  const lessonWords = lesson.vocabularyGroups
    .flatMap((group) => group.words || [])
    .filter((word) => vocabularyWordIsTaught(word, corpus));
  const exercises = [];
  for (const [index, word] of lessonWords.entries()) {
    const distractors = lessonWords
      .filter((candidate) => candidate.id !== word.id)
      .map((candidate) => candidate.english)
      .filter(Boolean);
    const options = choiceOptions(word.english, distractors);
    if (options.length < 2) continue;

    exercises.push({
      key: `vocab-${index + 1}`,
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: "Vocabulary in this lesson.",
      instruction: "Choose the meaning.",
      questionText: word.spanish,
      answerJson: {
        correct: word.english,
        accepted: [word.english],
        goal: "vocabulary_recognition"
      },
      explanation: `${word.spanish} means ${word.english}.`,
      difficulty: 1,
      imageKey: semanticImageKey(`${word.spanish} ${word.english}`, word.imageKey || lesson.imageKey),
      options
    });
  }
  return exercises;
}

async function upsertExercise(lesson, topicId, exercise, order) {
  const slug = `supplement-${lesson.slug}-${exercise.key}`;
  const saved = await prisma.exercise.upsert({
    where: { slug },
    update: {
      lessonId: lesson.id,
      topicId,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      questionText: exercise.questionText,
      answerJson: exercise.answerJson,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty,
      order,
      xpReward: exercise.type === ExerciseType.TRANSLATION ? 16 : exercise.type === ExerciseType.SENTENCE_BUILDER ? 14 : 10,
      imageKey: exercise.imageKey || null
    },
    create: {
      slug,
      lessonId: lesson.id,
      topicId,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      questionText: exercise.questionText,
      answerJson: exercise.answerJson,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty,
      order,
      xpReward: exercise.type === ExerciseType.TRANSLATION ? 16 : exercise.type === ExerciseType.SENTENCE_BUILDER ? 14 : 10,
      imageKey: exercise.imageKey || null
    }
  });

  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (exercise.options.length) {
    await prisma.exerciseOption.createMany({
      data: exercise.options.map(([text, value, isCorrect], index) => ({
        exerciseId: saved.id,
        text,
        value,
        isCorrect,
        order: index + 1
      }))
    });
  }

  return saved;
}

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      sentences: { orderBy: { id: "asc" } },
      vocabularyGroups: { include: { words: true } },
      exercises: { orderBy: { order: "asc" } }
    }
  });

  let createdOrUpdated = 0;
  let removedStale = 0;
  for (const lesson of lessons) {
    const supplementPrefix = `supplement-${lesson.slug}-`;
    const authoredExercises = lesson.exercises.filter((exercise) => !exercise.slug.startsWith(supplementPrefix));
    const candidates = [...sentenceExercises(lesson), ...vocabularyExercises(lesson)]
      .filter((exercise) => exercise.options.length === 0 || exercise.options.length >= 2)
      .filter((exercise, index, list) => list.findIndex((candidate) => candidate.key === exercise.key) === index);
    const selected = candidates.slice(0, Math.max(0, TARGET_EXERCISE_COUNT - authoredExercises.length));
    const validSupplementSlugs = new Set(selected.map((exercise) => `${supplementPrefix}${exercise.key}`));
    const staleSupplements = lesson.exercises.filter(
      (exercise) => exercise.slug.startsWith(supplementPrefix) && !validSupplementSlugs.has(exercise.slug)
    );
    if (staleSupplements.length) {
      await prisma.exercise.deleteMany({ where: { id: { in: staleSupplements.map((exercise) => exercise.id) } } });
      removedStale += staleSupplements.length;
    }

    let order = Math.max(0, ...authoredExercises.map((exercise) => exercise.order || 0)) + 1;
    for (const exercise of selected) {
      await upsertExercise(lesson, lesson.topicId, exercise, order);
      order += 1;
      createdOrUpdated += 1;
    }
    console.log(`${lesson.slug}: ${authoredExercises.length} authored + ${selected.length} supplemental`);
  }

  console.log(`Supplemental lesson practice upserted: ${createdOrUpdated} exercises`);
  console.log(`Stale supplemental lesson practice removed: ${removedStale} exercises`);
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = {
  lessonTeachingCorpus,
  sentenceExercises,
  vocabularyExercises,
  vocabularyWordIsTaught
};
