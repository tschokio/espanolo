const assert = require("node:assert/strict");
const test = require("node:test");

const {
  lessonTeachingCorpus,
  semanticImageKey,
  sentenceExercises,
  vocabularyExercises,
  vocabularyWordIsTaught
} = require("./seed-lesson-practice");

const pronounWords = [
  { id: "yo", spanish: "yo", english: "I", partOfSpeech: "pronoun", imageKey: "identity-and-introductions:5" },
  { id: "tu", spanish: "tú", english: "you", partOfSpeech: "pronoun", imageKey: "identity-and-introductions:6" },
  { id: "el", spanish: "él", english: "he", partOfSpeech: "pronoun", imageKey: "people-and-family:1" },
  { id: "ella", spanish: "ella", english: "she", partOfSpeech: "pronoun", imageKey: "identity-and-introductions:1" },
  { id: "nosotros", spanish: "nosotros", english: "we", partOfSpeech: "pronoun", imageKey: "people-and-family:16" }
];

test("supplemental vocabulary exercises stay inside pronouns taught by the lesson", () => {
  const lesson = {
    slug: "zero-pronouns",
    title: "Zero: Core Subject Pronouns",
    summary: "Learn yo, tú, él, and ella.",
    situation: "starting from zero",
    imageKey: "identity-and-introductions:14",
    sentences: [
      { spanish: "yo", english: "I", note: "Use yo for the speaker." },
      { spanish: "tú", english: "you", note: "Use tú for one familiar listener." },
      { spanish: "él", english: "he", note: "Él with an accent means he." },
      { spanish: "ella", english: "she", note: "Ella means she." }
    ],
    exercises: [],
    vocabularyGroups: [{ words: pronounWords }]
  };

  const promptedWords = vocabularyExercises(lesson).map((exercise) => exercise.questionText);

  assert.deepEqual(new Set(promptedWords), new Set(["yo", "tú", "él", "ella"]));
  assert.ok(!promptedWords.includes("nosotros"));
});

test("supplemental vocabulary does not treat the article el as the pronoun él", () => {
  const corpus = lessonTeachingCorpus({
    title: "El for Masculine Nouns",
    summary: "Practice el before masculine nouns.",
    situation: "objects",
    sentences: [
      { spanish: "El libro.", english: "The book.", note: "Libro uses el." },
      { spanish: "El parque.", english: "The park.", note: "Parque uses el." }
    ],
    exercises: []
  });

  assert.equal(vocabularyWordIsTaught(pronounWords.find((word) => word.spanish === "él"), corpus), false);
});

test("supplemental vocabulary generation ignores stale generated exercises", () => {
  const lesson = {
    slug: "colors-with-things",
    title: "Colors with Things",
    summary: "Practice color descriptions.",
    situation: "describing objects",
    imageKey: "numbers-and-colors:16",
    sentences: [{ spanish: "La manzana es roja.", english: "The apple is red.", note: "Roja agrees with manzana." }],
    exercises: [
      {
        slug: "supplement-colors-with-things-vocab-1",
        prompt: "Vocabulary in this lesson.",
        instruction: "Choose the meaning.",
        questionText: "uno",
        explanation: "uno means one.",
        answerJson: { correct: "one" }
      }
    ],
    vocabularyGroups: [
      {
        words: [
          { id: "uno", spanish: "uno", english: "one", partOfSpeech: "number", imageKey: "numbers-and-colors:1" },
          { id: "roja", spanish: "roja", english: "red", partOfSpeech: "adjective", imageKey: "numbers-and-colors:7" },
          { id: "manzana", spanish: "la manzana", english: "apple", partOfSpeech: "noun", imageKey: "fruit-and-produce:1" }
        ]
      }
    ]
  };

  const promptedWords = vocabularyExercises(lesson).map((exercise) => exercise.questionText);

  assert.ok(promptedWords.includes("roja"));
  assert.ok(!promptedWords.includes("uno"));
});

test("supplemental sentence practice skips bare ser and estar glossary forms", () => {
  const generated = sentenceExercises({
    sentences: [
      { spanish: "es", english: "he/she/it is", note: "Es is a form of ser." },
      { spanish: "está", english: "he/she/it is", note: "Está is a form of estar." },
      { spanish: "Ella es profesora.", english: "She is a teacher.", note: "Identity uses es." },
      { spanish: "Ella está en casa.", english: "She is at home.", note: "Location uses está." }
    ]
  });

  const prompts = generated.map((exercise) => exercise.questionText);
  assert.ok(!prompts.includes("he/she/it is"), "bare verb forms must not become ambiguous translation prompts");
  assert.deepEqual(new Set(prompts), new Set(["She is a teacher.", "She is at home."]));
  assert.deepEqual(
    new Set(
      generated.map((exercise) =>
        String(exercise.answerJson.correct || exercise.answerJson.correctWords?.join(" ") || "").replace(/\s+([.!?])/g, "$1")
      )
    ),
    new Set(["Ella es profesora.", "Ella está en casa."])
  );
});

test("supplemental vocabulary cannot be taught only by an authored quiz", () => {
  const library = {
    id: "library",
    spanish: "la biblioteca",
    english: "library",
    partOfSpeech: "noun",
    imageKey: "classroom-basics:10"
  };
  const lesson = {
    slug: "identity-only",
    title: "Identity",
    summary: "Introduce yourself with ser.",
    situation: "meeting someone",
    sentences: [{ spanish: "Yo soy Ana.", english: "I am Ana.", note: "Use soy for identity." }],
    exercises: [
      {
        slug: "identity-unrelated-library",
        prompt: "An authored check.",
        instruction: "Choose the location word.",
        questionText: "la biblioteca",
        explanation: "La biblioteca means library.",
        answerJson: { correct: "library", accepted: ["library"] }
      }
    ],
    vocabularyGroups: [{ words: [library] }]
  };

  assert.deepEqual(vocabularyExercises(lesson), []);
});

test("supplemental vocabulary choices use only words taught in the lesson", () => {
  const book = { id: "book", spanish: "el libro", english: "book", partOfSpeech: "noun", imageKey: "classroom-basics:3" };
  const teacher = { id: "teacher", spanish: "la profesora", english: "teacher", partOfSpeech: "noun", imageKey: "classroom-basics:2" };
  const taxi = { id: "taxi", spanish: "el taxi", english: "taxi", partOfSpeech: "noun", imageKey: "city-transport:3" };
  const lesson = {
    slug: "classroom-description",
    title: "Classroom description",
    summary: "Describe familiar classroom things.",
    situation: "classroom",
    sentences: [
      { spanish: "El libro es nuevo.", english: "The book is new.", note: "Libro means book." },
      { spanish: "La profesora está aquí.", english: "The teacher is here.", note: "Profesora means teacher." }
    ],
    exercises: [],
    vocabularyGroups: [{ words: [book, teacher, taxi] }]
  };

  const exercises = vocabularyExercises(lesson);
  const optionValues = exercises.flatMap((exercise) => exercise.options.map(([, value]) => value));

  assert.deepEqual(new Set(optionValues), new Set(["book", "teacher"]));
  assert.ok(!optionValues.includes("taxi"));
});

test("semantic image selection uses the precise existing body and scenario cells", () => {
  assert.equal(semanticImageKey("el ojo eye", "body-and-health:6"), "body-and-health:3");
  assert.equal(semanticImageKey("la mano hand", "body-and-health:6"), "body-and-health:2");
  assert.equal(semanticImageKey("Necesito medicina para el dolor.", "body-and-health:12"), "body-and-health:13");
  assert.equal(semanticImageKey("Can you repeat, please?", "travel-and-survival:1"), "conversation-and-opinion:7");
});

test("semantic image selection does not substitute a wrong quantity image", () => {
  assert.equal(semanticImageKey("Tengo seis uvas. I have six grapes.", "numbers-and-colors:5"), null);
  assert.equal(semanticImageKey("Tengo dos manzanas. I have two apples.", "fruit-and-produce:1"), "numbers-and-colors:2");
  assert.equal(semanticImageKey("La manzana es roja. The apple is red.", "fruit-and-produce:1"), "numbers-and-colors:7");
});
