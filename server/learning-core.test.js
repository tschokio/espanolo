const test = require("node:test");
const assert = require("node:assert/strict");

const {
  evaluateExerciseAnswer,
  scheduleExerciseReview,
  scheduleWordReview
} = require("./learning-core");

const baseExercise = (overrides = {}) => ({
  type: "TRANSLATION",
  answerJson: { correct: "también", accepted: ["también"], ...overrides.answerJson },
  ...overrides
});

test("accepts missing accents with a warning when accent strictness is off", () => {
  const result = evaluateExerciseAnswer(baseExercise(), { answer: "tambien" });
  assert.equal(result.correct, true);
  assert.equal(result.status, "CORRECT_WITH_ACCENT_WARNING");
  assert.equal(result.errorCategory, "accent");
});

test("rejects missing accents when accent strictness is on", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({ answerJson: { correct: "también", accepted: ["también"], accentStrict: true } }),
    { answer: "tambien" }
  );
  assert.equal(result.correct, false);
  assert.equal(result.errorCategory, "accent");
});

test("accepts supported alternatives", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      answerJson: {
        correct: "Quiero agua.",
        accepted: ["quiero agua", "quiero agua."],
        alternatives: [{ answer: "Me gustaría agua.", note: "Natural polite alternative." }]
      }
    }),
    { answer: "me gustaria agua" }
  );
  assert.equal(result.correct, true);
  assert.equal(result.status, "ACCEPTED_ALTERNATIVE");
});

test("classifies missing required articles", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      type: "ARTICLE_MATCH",
      answerJson: { correct: "la camisa", accepted: ["la camisa"], requiresArticle: true }
    }),
    { answer: "camisa" }
  );
  assert.equal(result.correct, false);
  assert.equal(result.errorCategory, "missing_required_article");
});

test("classifies ser vs estar mistakes", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      answerJson: {
        correct: "Soy de Austria.",
        accepted: ["soy de austria", "soy de austria."],
        goal: "ser_origin"
      }
    }),
    { answer: "Estoy de Austria." }
  );
  assert.equal(result.correct, false);
  assert.equal(result.errorCategory, "ser_estar");
});

test("classifies sentence builder word order mistakes", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      type: "SENTENCE_BUILDER",
      answerJson: { correctWords: ["Yo", "soy", "estudiante"] }
    }),
    { words: ["soy", "Yo", "estudiante"] }
  );
  assert.equal(result.correct, false);
  assert.equal(result.errorCategory, "word_order");
});

test("checks short answer production exercises", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      type: "SHORT_ANSWER",
      answerJson: { correct: "Me despierto temprano.", accepted: ["me despierto temprano", "me despierto temprano."] }
    }),
    { answer: "me despierto temprano" }
  );

  assert.equal(result.correct, true);
});

test("classifies transformation production mistakes", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      type: "TRANSFORMATION",
      answerJson: { correct: "Me cepillo los dientes.", accepted: ["me cepillo los dientes", "me cepillo los dientes."] }
    }),
    { answer: "Cepillo mis dientes." }
  );

  assert.equal(result.correct, false);
  assert.equal(result.errorCategory, "transformation");
});

test("schedules word review qualities in the expected order", () => {
  const now = new Date("2026-07-04T00:00:00.000Z");
  const existing = { ease: 2.1, intervalDays: 2, correctCount: 3, wrongCount: 0 };
  const again = scheduleWordReview(existing, "again", now);
  const hard = scheduleWordReview(existing, "hard", now);
  const good = scheduleWordReview(existing, "good", now);
  const easy = scheduleWordReview(existing, "easy", now);

  assert.equal(again.wasCorrect, false);
  assert.equal(hard.intervalDays, 1);
  assert.ok(good.intervalDays > hard.intervalDays);
  assert.ok(easy.intervalDays > good.intervalDays);
});

test("schedules exercise review easy later than hard", () => {
  const now = new Date("2026-07-04T00:00:00.000Z");
  const existing = { ease: 2.3, intervalDays: 2 };
  const hard = scheduleExerciseReview(existing, "hard", now);
  const easy = scheduleExerciseReview(existing, "easy", now);

  assert.equal(hard.intervalDays, 1);
  assert.ok(easy.intervalDays >= 7);
});
