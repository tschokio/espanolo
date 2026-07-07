const assert = require("node:assert/strict");
const test = require("node:test");

const {
  lessonTeachingCorpus,
  vocabularyExercises,
  vocabularyWordIsTaught
} = require("./seed-lesson-practice");

const pronounWords = [
  { id: "yo", spanish: "yo", english: "I", partOfSpeech: "pronoun", imageKey: "identity-and-introductions:5" },
  { id: "tu", spanish: "tú", english: "you", partOfSpeech: "pronoun", imageKey: "identity-and-introductions:6" },
  { id: "el", spanish: "él", english: "he", partOfSpeech: "pronoun", imageKey: "people-and-family:10" },
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

  const promptedWords = vocabularyExercises(lesson, pronounWords).map((exercise) => exercise.questionText);

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
