const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildCorrectionFocus,
  evaluateExerciseAnswer,
  grammaticalVariantsForExercise,
  exerciseLearningSupport,
  chooseDailyPlanPriority,
  buildReviewUrgencyDiagnostics,
  dailyReviewPriorityReason,
  completedLessonSessionToday,
  familiarPracticeTargets,
  selectFamiliarPracticeTarget,
  selectFamiliarPracticeTargetForSkill,
  exerciseIsFamiliarForPractice,
  interleaveReviewItems,
  buildConceptWeaknesses,
  diagnosticConceptForWeakSpot,
  conceptRepairBriefForWeakness,
  selectConceptContrastCandidates,
  reviewEntityKey,
  deduplicateReviewEntities,
  normalizeWordAttemptMode,
  wordAttemptExpectsSpanish,
  wordContextAnswer,
  listeningAlternativeMeaning,
  requiresCheckpointUnlock,
  exerciseReviewQuality,
  summarizeRetrievalAttempts,
  buildSkillProfile,
  deferredChannelPracticeAction,
  lessonReinforcementInterval,
  scheduleExerciseReview,
  scheduleExercisePractice,
  scheduleWordReview,
  scheduleWordPractice,
  evaluateSpanishWordAnswer,
  selectLessonVocabularyWords,
  lessonVocabularyContextTexts,
  validatedIntroducedVocabularyIds,
  estimateLessonMinutes,
  estimateLessonReviewMinutes
} = require("./learning-core");

test("quiet listening alternatives create a durable channel follow-up without postponing it", () => {
  assert.equal(deferredChannelPracticeAction({
    exerciseType: "LISTENING_DICTATION",
    practiceMode: "quiet-alternative",
    correct: true,
    hasOpenPractice: false
  }), "create");
  assert.equal(deferredChannelPracticeAction({
    exerciseType: "LISTENING_DICTATION",
    practiceMode: "quiet-alternative",
    correct: true,
    hasOpenPractice: true
  }), "keep");
  assert.equal(deferredChannelPracticeAction({
    exerciseType: "LISTENING_DICTATION",
    practiceMode: "home",
    correct: true,
    hasOpenPractice: true
  }), "complete");
  assert.equal(deferredChannelPracticeAction({
    exerciseType: "LISTENING_DICTATION",
    practiceMode: "home",
    correct: false,
    hasOpenPractice: true
  }), "none");
  assert.equal(deferredChannelPracticeAction({
    exerciseType: "DIALOGUE_REPLY",
    practiceMode: "quiet-alternative",
    correct: true,
    hasOpenPractice: false
  }), "none");
});

test("skill profile counts demonstrated practice instead of XP or mere exposure", () => {
  const profile = buildSkillProfile({
    attempts: [
      { isCorrect: true, exercise: { type: "LISTENING_DICTATION" }, answerJson: { retrieval: { practiceMode: "home", usedSupport: false } } },
      { isCorrect: true, exercise: { type: "LISTENING_DICTATION" }, answerJson: { retrieval: { practiceMode: "quiet-alternative", usedSupport: false } } },
      { isCorrect: true, exercise: { type: "DIALOGUE_REPLY" }, answerJson: { retrieval: { inputMethod: "speech", usedSupport: false } } },
      { isCorrect: false, exercise: { type: "WRITING_PROMPT" }, answerJson: { retrieval: { inputMethod: "keyboard" } } }
    ],
    wordAttempts: [
      { isCorrect: true, mode: "es-native", activityMode: "recognition" },
      { isCorrect: true, mode: "native-es", activityMode: "typing" },
      { isCorrect: true, mode: "es-native", activityMode: "flashcard" }
    ],
    skillAttempts: [
      { skill: "reading", isSuccessful: true, usedSupport: true },
      { skill: "speaking", isSuccessful: false, usedSupport: true },
      { skill: "conversation", isSuccessful: true, usedSupport: true }
    ]
  });

  const byKey = Object.fromEntries(profile.skills.map((skill) => [skill.key, skill]));
  assert.deepEqual(
    { attempted: byKey.listening.attempted, independent: byKey.listening.independent },
    { attempted: 1, independent: 1 },
    "a silent reconstruction must not masquerade as listening"
  );
  assert.equal(byKey.conversation.independent, 1);
  assert.equal(byKey.speaking.independent, 1);
  assert.equal(byKey.speaking.unsuccessful, 1);
  assert.equal(byKey.writing.unsuccessful, 1);
  assert.equal(byKey.vocabulary.attempted, 2, "passive flashcard exposure is not evidence");
  assert.equal(byKey.vocabulary.independent, 1);
  assert.equal(byKey.vocabulary.supported, 1);
  assert.equal(byKey.reading.supported, 1);
  assert.equal(byKey.conversation.supported, 1);
  assert.equal(byKey.grammar.attempted, 2, "quiet listening alternatives do not become grammar evidence either");
});

test("skill balancing selects only familiar exercises that actually train the named skill", () => {
  const targets = [
    { lesson: { id: "known" }, exercise: { id: "choice", type: "MULTIPLE_CHOICE" } },
    { lesson: { id: "known" }, exercise: { id: "listen", type: "LISTENING_DICTATION" } },
    { lesson: { id: "known" }, exercise: { id: "write", type: "WRITING_PROMPT" } },
    { lesson: { id: "known" }, exercise: { id: "talk", type: "DIALOGUE_REPLY" } }
  ];

  assert.equal(selectFamiliarPracticeTargetForSkill(targets, "listening", "today").exercise.id, "listen");
  assert.equal(selectFamiliarPracticeTargetForSkill(targets, "writing", "today").exercise.id, "write");
  assert.equal(selectFamiliarPracticeTargetForSkill(targets, "conversation", "today").exercise.id, "talk");
  assert.equal(selectFamiliarPracticeTargetForSkill(targets, "reading", "today"), null, "generic quiz choice is not reading evidence");
  assert.equal(selectFamiliarPracticeTargetForSkill([], "speaking", "today"), null);
});

test("correction focus identifies the first minimal word-level repair", () => {
  assert.deepEqual(buildCorrectionFocus("Yo estudiante", "Yo soy estudiante"), {
    kind: "insert",
    position: 2,
    submittedToken: "",
    expectedToken: "soy",
    before: "Yo",
    after: "estudiante"
  });
  assert.equal(buildCorrectionFocus("Yo muy soy estudiante", "Yo soy estudiante").kind, "delete");
  assert.deepEqual(
    buildCorrectionFocus("Yo eres estudiante", "Yo soy estudiante"),
    {
      kind: "replace",
      position: 2,
      submittedToken: "eres",
      expectedToken: "soy",
      before: "Yo",
      after: "estudiante"
    }
  );
});

test("correction focus isolates an accent without treating the word as new vocabulary", () => {
  assert.deepEqual(buildCorrectionFocus("Tambien estudio", "También estudio"), {
    kind: "accent",
    position: 1,
    submittedToken: "Tambien",
    expectedToken: "También",
    before: "",
    after: "estudio"
  });
});

test("lesson estimates reflect the complete learning flow instead of stale seed labels", () => {
  const lesson = {
    slug: "a1-example",
    cefrLevel: "A1",
    estimatedMinutes: 6,
    sentences: Array.from({ length: 4 }, () => ({})),
    exercises: Array.from({ length: 10 }, () => ({}))
  };
  assert.equal(estimateLessonMinutes(lesson), 15);
  assert.equal(estimateLessonReviewMinutes(lesson), 7);
});

test("connected checkpoints account for comprehension while their later review stays compact", () => {
  const lesson = {
    slug: "checkpoint-a1-example",
    cefrLevel: "A1",
    estimatedMinutes: 8,
    sentences: Array.from({ length: 4 }, () => ({})),
    exercises: Array.from({ length: 12 }, () => ({})),
    readingJson: {
      paragraphs: ["Uno.", "Dos."],
      questions: [{}, {}],
      recallPromptDe: "Fasse zusammen."
    }
  };
  assert.equal(estimateLessonMinutes(lesson), 19);
  assert.equal(estimateLessonReviewMinutes(lesson), 8);
});

test("authored long-form estimates remain a lower bound", () => {
  assert.equal(estimateLessonMinutes({ cefrLevel: "C2", estimatedMinutes: 28, exercises: [], sentences: [] }), 28);
});

test("listening exercises receive a meaning-based silent alternative without exposing Spanish", () => {
  const exercise = {
    type: "LISTENING_DICTATION",
    answerJson: { audioText: "¿Cómo estás?", correct: "¿Cómo estás?" }
  };
  const sentences = [
    { spanish: "Estoy muy bien.", english: "I am very well." },
    { spanish: "Como estas", english: "How are you?" }
  ];

  assert.equal(listeningAlternativeMeaning(exercise, sentences), "How are you?");
  assert.equal(listeningAlternativeMeaning({ type: "TRANSLATION", answerJson: exercise.answerJson }, sentences), "");
  assert.equal(listeningAlternativeMeaning(exercise, []), "");
});

test("review quality reflects retrieval support without trusting invalid values", () => {
  assert.equal(exerciseReviewQuality({ correct: false, requestedQuality: "easy" }), "again");
  assert.equal(exerciseReviewQuality({ correct: true, usedSupport: true, requestedQuality: "easy" }), "hard");
  assert.equal(exerciseReviewQuality({ correct: true, needsOrthographyReview: true, requestedQuality: "easy" }), "hard");
  assert.equal(exerciseReviewQuality({ correct: true, usedSupport: false, requestedQuality: "good" }), "good");
  assert.equal(exerciseReviewQuality({ correct: true, usedSupport: false, requestedQuality: "invalid" }), "good");
});

test("retrieval summaries separate independent, supported, corrected, and unsuccessful attempts", () => {
  const summary = summarizeRetrievalAttempts([
    { isCorrect: true, answerJson: { retrieval: { usedSupport: false } } },
    { isCorrect: true, answerJson: { retrieval: { usedSupport: false } } },
    { isCorrect: true, answerJson: { retrieval: { usedSupport: true } } },
    { isCorrect: true, answerJson: { retrieval: { usedSupport: true, correctionAttempt: true } } },
    { isCorrect: false, answerJson: { retrieval: { usedSupport: true } } },
    { isCorrect: true, answerJson: {} }
  ]);
  assert.deepEqual(summary, { tracked: 5, independent: 2, supported: 1, corrected: 1, unsuccessful: 1, independentRate: 50 });
});

test("retrieval summaries are safe before tracked attempts exist", () => {
  assert.deepEqual(summarizeRetrievalAttempts([]), { tracked: 0, independent: 0, supported: 0, corrected: 0, unsuccessful: 0, independentRate: 0 });
});

test("lesson review intervals grow only after strong independent first-pass retrieval", () => {
  assert.equal(lessonReinforcementInterval({ mastered: false, firstPassScore: 100, independentScore: 100 }), 1);
  assert.equal(lessonReinforcementInterval({ mastered: true, firstPassScore: 100, independentScore: 50 }), 1);
  assert.equal(lessonReinforcementInterval({ mastered: true, firstPassScore: 70, independentScore: 70 }), 1);
  assert.equal(lessonReinforcementInterval({ mastered: true, firstPassScore: 80, independentScore: 70, currentInterval: 8, reviewCount: 0 }), 3);
  assert.equal(lessonReinforcementInterval({ mastered: true, firstPassScore: 90, independentScore: 85, currentInterval: 8, reviewCount: 2 }), 14);
  assert.equal(lessonReinforcementInterval({ mastered: true, firstPassScore: 100, independentScore: 100, currentInterval: 25, reviewCount: 4 }), 30);
});

test("a completed lesson session makes fresh material rest while urgent and unfinished work keeps priority", () => {
  assert.equal(chooseDailyPlanPriority({ hasNewLesson: true, hasFreshLessonSession: true }), "reinforcement");
  assert.equal(chooseDailyPlanPriority({ hasNewLesson: true, hasFreshLessonSession: true, reviewTotal: 2 }), "review");
  assert.equal(chooseDailyPlanPriority({ hasInProgress: true, hasFreshLessonSession: true }), "lesson");
  assert.equal(chooseDailyPlanPriority({ hasDueLesson: true, hasFreshLessonSession: true }), "lesson");
});

test("daily planning prioritizes one recurring or seriously overdue memory without blocking on fresh small debt", () => {
  assert.equal(chooseDailyPlanPriority({ hasInProgress: true, reviewTotal: 1, recurringMistakeCount: 1 }), "review");
  assert.equal(chooseDailyPlanPriority({ hasInProgress: true, reviewTotal: 1, oldestOverdueDays: 3 }), "review");
  assert.equal(chooseDailyPlanPriority({ hasInProgress: true, reviewTotal: 1, oldestOverdueDays: 2 }), "lesson");
  assert.equal(chooseDailyPlanPriority({ hasInProgress: true, reviewTotal: 1, mistakeCount: 1 }), "lesson");
  assert.equal(dailyReviewPriorityReason({ recurringMistakeCount: 1, oldestOverdueDays: 8, reviewTotal: 12 }), "recurring_mistake");
  assert.equal(dailyReviewPriorityReason({ oldestOverdueDays: 4, reviewTotal: 1 }), "overdue_review");
  assert.equal(dailyReviewPriorityReason({ reviewTotal: 7, mistakeCount: 1 }), "");
});

test("review diagnostics derive recurrence and overdue age from real evidence", () => {
  const now = new Date("2026-07-15T12:00:00.000Z");
  const diagnosis = buildReviewUrgencyDiagnostics({
    dueDates: ["2026-07-14T12:00:00.000Z", "2026-07-10T11:59:00.000Z", "invalid"],
    weakSpots: [{ count: 1 }, { count: 2 }, { count: 5 }],
    reviewTotal: 4,
    mistakeCount: 3
  }, now);

  assert.equal(diagnosis.recurringMistakeCount, 2);
  assert.equal(diagnosis.maxMistakeOccurrences, 5);
  assert.equal(diagnosis.oldestDueAt.toISOString(), "2026-07-10T11:59:00.000Z");
  assert.equal(diagnosis.oldestOverdueDays, 5);
  assert.equal(diagnosis.urgentReason, "recurring_mistake");
});

test("today's completed or reviewed package is detected as a fresh learning session", () => {
  const now = new Date("2026-07-15T18:00:00.000Z");
  assert.equal(completedLessonSessionToday([
    { progress: 100, lastReviewedAt: "2026-07-15T12:00:00.000Z" }
  ], now), true);
  assert.equal(completedLessonSessionToday([
    { progress: [{ mastery: 100, lastReviewedAt: "2026-07-14T23:59:59.000Z" }] }
  ], now), false);
  assert.equal(completedLessonSessionToday([
    { progress: 60, lastReviewedAt: "2026-07-15T12:00:00.000Z" }
  ], now), false);
});

test("reinforcement selects only exercises proven familiar to the learner", () => {
  const lessons = [
    {
      id: "complete",
      order: 1,
      progress: [{ mastery: 100 }],
      exercises: [{ id: "complete-a", order: 1 }, { id: "complete-b", order: 2 }]
    },
    {
      id: "partial",
      order: 2,
      progress: [{ mastery: 50 }],
      exercises: [{ id: "partial-known", order: 1 }, { id: "partial-unknown", order: 2 }]
    },
    {
      id: "new",
      order: 3,
      progress: [],
      exercises: [{ id: "new-unknown", order: 1 }]
    }
  ];
  const allowed = new Set(["complete-a", "complete-b", "partial-known"]);
  for (let index = 0; index < 30; index += 1) {
    const target = selectFamiliarPracticeTarget(lessons, ["partial-known"], `day-${index}`);
    assert.ok(target);
    assert.ok(allowed.has(target.exercise.id));
    assert.notEqual(target.exercise.id, "partial-unknown");
    assert.notEqual(target.exercise.id, "new-unknown");
  }
  assert.equal(selectFamiliarPracticeTarget([{ progress: [], exercises: [{ id: "unknown" }] }], [], "seed"), null);
  assert.deepEqual(
    familiarPracticeTargets(lessons, ["partial-known"]).map((target) => target.exercise.id),
    ["complete-a", "complete-b", "partial-known"]
  );
});

test("optional practice accepts completed lessons or a prior attempt but never untouched content", () => {
  assert.equal(exerciseIsFamiliarForPractice({ lessonMastery: 100, priorAttemptCount: 0 }), true);
  assert.equal(exerciseIsFamiliarForPractice({ lessonMastery: 20, priorAttemptCount: 1 }), true);
  assert.equal(exerciseIsFamiliarForPractice({ lessonMastery: 20, priorAttemptCount: 0 }), false);
  assert.equal(exerciseIsFamiliarForPractice({ lessonMastery: 0, priorAttemptCount: 0 }), false);
});

test("builds a progressive learning scaffold without losing accented words", () => {
  const support = exerciseLearningSupport({
    type: "TRANSLATION",
    answerJson: { correct: "Estoy en la biblioteca." },
    options: []
  });
  assert.equal(support.starter, "Estoy…");
  assert.deepEqual(support.wordBank, ["Estoy", "en", "la", "biblioteca"]);
  assert.equal(support.model, "Estoy en la biblioteca.");
});

test("scheduled reviews can submit checkpoint exercises after curriculum locks change", () => {
  assert.equal(requiresCheckpointUnlock("REVIEW"), false);
  assert.equal(requiresCheckpointUnlock("LESSON"), true);
  assert.equal(requiresCheckpointUnlock("CHALLENGE"), true);
});

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
  assert.equal(result.correctionFocus.kind, "accent");
  assert.equal(result.correctionFocus.expectedToken, "también");
});

test("sentence evaluation never collapses Spanish ñ or ü into n or u", () => {
  const enye = evaluateExerciseAnswer(
    baseExercise({ answerJson: { correct: "Tengo treinta años.", accepted: ["Tengo treinta años."] } }),
    { answer: "Tengo treinta anos." }
  );
  const diaeresis = evaluateExerciseAnswer(
    baseExercise({ answerJson: { correct: "El pingüino nada.", accepted: ["El pingüino nada."] } }),
    { answer: "El pinguino nada." }
  );

  assert.equal(enye.correct, false);
  assert.equal(diaeresis.correct, false);
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

test("accepts safe Spanish subject-pronoun omission as a grammatical variant", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      type: "TRANSLATION",
      answerJson: { correct: "Yo soy estudiante.", accepted: ["yo soy estudiante"] }
    }),
    { answer: "Soy estudiante." }
  );

  assert.equal(result.correct, true);
  assert.equal(result.status, "ACCEPTED_GRAMMATICAL_VARIANT");
  assert.match(result.feedbackMessage, /subject pronoun/i);
});

test("accepts safe subject-pronoun omission in a sentence builder", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      type: "SENTENCE_BUILDER",
      answerJson: { correctWords: ["Yo", "soy", "Ana", "."] }
    }),
    { words: ["soy", "Ana", "."] }
  );

  assert.equal(result.correct, true);
  assert.equal(result.status, "ACCEPTED_GRAMMATICAL_VARIANT");
});

test("supports pronoun omission in questions without losing opening punctuation", () => {
  const result = evaluateExerciseAnswer(
    baseExercise({
      type: "DIALOGUE_REPLY",
      answerJson: { correct: "¿Tú estudias hoy?", accepted: ["¿tú estudias hoy?"] }
    }),
    { answer: "¿Estudias hoy?" }
  );

  assert.equal(result.correct, true);
  assert.equal(result.status, "ACCEPTED_GRAMMATICAL_VARIANT");
});

test("does not mistake articles or fixed yo que tú frames for optional subjects", () => {
  const articleExercise = baseExercise({
    type: "TRANSLATION",
    answerJson: { correct: "El libro es nuevo.", accepted: ["el libro es nuevo"] }
  });
  const fixedFrameExercise = baseExercise({
    type: "DIALOGUE_REPLY",
    answerJson: { correct: "Yo que tú, esperaría.", accepted: ["yo que tú esperaría"] }
  });

  assert.deepEqual(grammaticalVariantsForExercise(articleExercise, ["El libro es nuevo."]), []);
  assert.deepEqual(grammaticalVariantsForExercise(fixedFrameExercise, ["Yo que tú, esperaría."]), []);
  assert.equal(evaluateExerciseAnswer(articleExercise, { answer: "Libro es nuevo." }).correct, false);
  assert.equal(evaluateExerciseAnswer(fixedFrameExercise, { answer: "Que tú, esperaría." }).correct, false);
});

test("allows an authored exercise to require the explicit subject pronoun", () => {
  const exercise = baseExercise({
    type: "TRANSLATION",
    answerJson: { correct: "Ella trabaja hoy.", accepted: ["ella trabaja hoy"], allowSubjectOmission: false }
  });

  assert.equal(evaluateExerciseAnswer(exercise, { answer: "Trabaja hoy." }).correct, false);
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

test("keeps es and está distinct in contextual checks", () => {
  const identity = evaluateExerciseAnswer(
    baseExercise({
      type: "CLOZE",
      questionText: "Ana ____ profesora.",
      answerJson: { correct: "es", accepted: ["es"], goal: "ser_identity" }
    }),
    { answer: "está" }
  );
  const location = evaluateExerciseAnswer(
    baseExercise({
      type: "CLOZE",
      questionText: "Ana ____ en casa.",
      answerJson: { correct: "está", accepted: ["esta", "está"], goal: "estar_location" }
    }),
    { answer: "es" }
  );

  assert.equal(identity.correct, false);
  assert.equal(identity.errorCategory, "ser_estar");
  assert.equal(location.correct, false);
  assert.equal(location.errorCategory, "ser_estar");
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
  assert.ok(result.correctionFocus);
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

test("accepts an authored natural reply when its required communication functions are present", () => {
  const exercise = baseExercise({
    type: "DIALOGUE_REPLY",
    answerJson: {
      correct: "Me ha encantado verte. Te escribo mañana.",
      accepted: ["me ha encantado verte te escribo mañana"],
      functionalCheck: {
        minimumMatched: 2,
        groups: [
          { key: "appreciation", labelDe: "Wertschätzung", required: true, any: ["me ha encantado verte", "ha sido un placer", "me ha gustado verte"], notAny: ["no ha sido un placer"] },
          { key: "next-contact", labelDe: "konkreter nächster Kontakt", required: true, any: ["te escribo", "te llamaré", "hablamos mañana"], notAny: ["no te escribo"] }
        ]
      }
    }
  });
  const result = evaluateExerciseAnswer(exercise, { answer: "Ha sido un placer. Te llamaré mañana." });

  assert.equal(result.correct, true);
  assert.equal(result.status, "ACCEPTED_FUNCTIONAL_VARIANT");
  assert.equal(result.functionalCheck.matchedCount, 2);
  assert.equal(result.functionalCheck.missing.length, 0);
  assert.equal(evaluateExerciseAnswer(exercise, { answer: "No ha sido un placer. No te escribo mañana." }).correct, false);
});

test("a functional reply reports the missing communicative move without accepting token fragments", () => {
  const exercise = baseExercise({
    type: "WRITING_PROMPT",
    answerJson: {
      correct: "Le agradecería una respuesta antes del viernes, ya que termina el plazo.",
      functionalCheck: {
        minimumMatched: 3,
        groups: [
          { key: "request", labelDe: "höfliche Bitte", any: ["le agradecería", "quisiera"] },
          { key: "reply", labelDe: "gewünschte Antwort", any: ["respuesta", "confirmación"] },
          { key: "date", labelDe: "Freitag als Zeitpunkt", any: ["viernes"] },
          { key: "reason", labelDe: "sachlicher Fristgrund", any: ["plazo", "fecha límite"] }
        ]
      }
    }
  });
  const result = evaluateExerciseAnswer(exercise, { answer: "Quisiera una respuesta antes del viernesx." });

  assert.equal(result.correct, false);
  assert.equal(result.functionalCheck.matchedCount, 2);
  assert.equal(result.correctionFocus, null);
  assert.deepEqual(result.functionalCheck.missing.map((group) => group.key), ["date", "reason"]);
});

test("functional slots accept a learner's own value only after a complete Spanish frame", () => {
  const exercise = baseExercise({
    type: "DIALOGUE_REPLY",
    answerJson: {
      correct: "Me llamo Ana.",
      functionalCheck: {
        minimumMatched: 1,
        groups: [
          {
            key: "name",
            labelDe: "eigener Name nach me llamo",
            required: true,
            followedBy: ["me llamo"],
            minimumTrailingWords: 1,
            notAny: ["no me llamo"]
          }
        ]
      }
    }
  });

  assert.equal(evaluateExerciseAnswer(exercise, { answer: "Me llamo Tobias." }).correct, true);
  assert.equal(evaluateExerciseAnswer(exercise, { answer: "Me llamo." }).correct, false);
  assert.equal(evaluateExerciseAnswer(exercise, { answer: "Llamo Tobias." }).correct, false);
  assert.equal(evaluateExerciseAnswer(exercise, { answer: "No me llamo Tobias." }).correct, false);
});

test("functional rubrics never weaken exact translation exercises", () => {
  const exercise = baseExercise({
    type: "TRANSLATION",
    answerJson: {
      correct: "Estoy en casa.",
      functionalCheck: {
        minimumMatched: 1,
        groups: [{ key: "place", any: ["casa"] }]
      }
    }
  });

  assert.equal(evaluateExerciseAnswer(exercise, { answer: "Casa." }).correct, false);
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

test("word recall accepts a missing acute accent but schedules an orthography warning", () => {
  assert.deepEqual(evaluateSpanishWordAnswer("también", "tambien"), {
    correct: true,
    status: "CORRECT_WITH_ACCENT_WARNING",
    errorCategory: "accent",
    orthographyWarning: true
  });
  assert.deepEqual(evaluateSpanishWordAnswer("También.", "TAMBIÉN"), {
    correct: true,
    status: "CORRECT",
    errorCategory: "vocabulary",
    orthographyWarning: false
  });
});

test("word recall preserves Spanish ñ and ü as meaningful spelling distinctions", () => {
  assert.equal(evaluateSpanishWordAnswer("año", "ano").correct, false);
  assert.equal(evaluateSpanishWordAnswer("año", "ano").errorCategory, "orthography");
  assert.equal(evaluateSpanishWordAnswer("pingüino", "pinguino").correct, false);
  assert.equal(evaluateSpanishWordAnswer("pingüino", "pinguino").errorCategory, "orthography");
});

test("schedules exercise review easy later than hard", () => {
  const now = new Date("2026-07-04T00:00:00.000Z");
  const existing = { ease: 2.3, intervalDays: 2 };
  const hard = scheduleExerciseReview(existing, "hard", now);
  const easy = scheduleExerciseReview(existing, "easy", now);

  assert.equal(hard.intervalDays, 1);
  assert.ok(easy.intervalDays >= 7);
});

test("exercise reviews use short learning steps before expanding intervals", () => {
  const now = new Date("2026-07-04T08:00:00.000Z");
  const again = scheduleExerciseReview(null, "again", now);
  const hard = scheduleExerciseReview(null, "hard", now);
  const good = scheduleExerciseReview(null, "good", now);
  const easy = scheduleExerciseReview(null, "easy", now);

  assert.equal(again.intervalDays, 0);
  assert.equal(again.state, "LEARNING");
  assert.equal(again.dueAt.toISOString(), "2026-07-04T08:10:00.000Z");
  assert.equal(hard.dueAt.toISOString(), "2026-07-04T16:00:00.000Z");
  assert.equal(good.intervalDays, 1);
  assert.equal(easy.intervalDays, 4);

  const secondGood = scheduleExerciseReview({ ease: good.ease, intervalDays: good.intervalDays }, "good", good.dueAt);
  assert.equal(secondGood.intervalDays, 3);
});

test("same-session exercise correction keeps the short relearning deadline", () => {
  const missedAt = new Date("2026-07-04T08:00:00.000Z");
  const missed = scheduleExercisePractice(null, "again", missedAt);
  const corrected = scheduleExercisePractice(missed, "hard", new Date("2026-07-04T08:02:00.000Z"));

  assert.equal(missed.scheduleAdvanced, true);
  assert.equal(missed.dueAt.toISOString(), "2026-07-04T08:10:00.000Z");
  assert.equal(corrected.scheduleAdvanced, false);
  assert.equal(corrected.intervalDays, 0);
  assert.equal(corrected.state, "LEARNING");
  assert.equal(corrected.dueAt.toISOString(), "2026-07-04T08:10:00.000Z");

  const delayedRecall = scheduleExercisePractice(corrected, "good", corrected.dueAt);
  assert.equal(delayedRecall.scheduleAdvanced, true);
  assert.equal(delayedRecall.intervalDays, 3);
});

test("an early exercise error always resets its due time", () => {
  const existing = {
    state: "REVIEW",
    ease: 2.5,
    intervalDays: 7,
    dueAt: new Date("2026-07-11T08:00:00.000Z")
  };
  const result = scheduleExercisePractice(existing, "again", new Date("2026-07-04T08:00:00.000Z"));

  assert.equal(result.scheduleAdvanced, true);
  assert.equal(result.intervalDays, 0);
  assert.equal(result.state, "LEARNING");
  assert.equal(result.dueAt.toISOString(), "2026-07-04T08:10:00.000Z");
});

test("word reviews build a 10 minute, one day, three day ladder", () => {
  const now = new Date("2026-07-04T08:00:00.000Z");
  const first = scheduleWordReview(null, "good", now);
  const second = scheduleWordReview({ ...first }, "good", first.dueAt);
  const third = scheduleWordReview({ ...second }, "good", second.dueAt);

  assert.equal(first.intervalDays, 0);
  assert.equal(first.dueAt.toISOString(), "2026-07-04T08:10:00.000Z");
  assert.equal(second.intervalDays, 1);
  assert.equal(third.intervalDays, 3);
});

test("same-session word reinforcement cannot inflate the long-term interval", () => {
  const introducedAt = new Date("2026-07-04T08:00:00.000Z");
  const first = scheduleWordPractice(null, "good", introducedAt);
  const recognition = scheduleWordPractice(first, "good", new Date("2026-07-04T08:01:00.000Z"));
  const typedRecall = scheduleWordPractice(recognition, "good", new Date("2026-07-04T08:03:00.000Z"));

  assert.equal(first.scheduleAdvanced, true);
  assert.equal(recognition.scheduleAdvanced, false);
  assert.equal(typedRecall.scheduleAdvanced, false);
  assert.equal(typedRecall.correctCount, 1);
  assert.equal(typedRecall.intervalDays, 0);
  assert.equal(typedRecall.dueAt.toISOString(), "2026-07-04T08:10:00.000Z");

  const dueRecall = scheduleWordPractice(typedRecall, "good", typedRecall.dueAt);
  assert.equal(dueRecall.scheduleAdvanced, true);
  assert.equal(dueRecall.correctCount, 2);
  assert.equal(dueRecall.intervalDays, 1);
});

test("an early word error always resets the learning step", () => {
  const existing = {
    state: "REVIEW",
    ease: 2.3,
    intervalDays: 3,
    correctCount: 3,
    wrongCount: 0,
    dueAt: new Date("2026-07-07T08:00:00.000Z")
  };
  const result = scheduleWordPractice(existing, "again", new Date("2026-07-04T08:00:00.000Z"));

  assert.equal(result.scheduleAdvanced, true);
  assert.equal(result.wasCorrect, false);
  assert.equal(result.intervalDays, 0);
  assert.equal(result.wrongCount, 1);
  assert.equal(result.dueAt.toISOString(), "2026-07-04T08:10:00.000Z");
});

test("lesson vocabulary is introduced in a small balanced deterministic batch", () => {
  const groups = [
    { id: "g1", slug: "general", words: Array.from({ length: 12 }, (_, index) => ({ id: `g1-${index}`, spanish: `general ${index}` })) },
    { id: "g2", slug: "topic", words: Array.from({ length: 12 }, (_, index) => ({ id: `g2-${index}`, spanish: `tema ${index}` })) },
    { id: "g3", slug: "advanced", words: Array.from({ length: 12 }, (_, index) => ({ id: `g3-${index}`, spanish: `avance ${index}` })) }
  ];
  const first = selectLessonVocabularyWords(groups, "lesson-one", 8);
  const repeated = selectLessonVocabularyWords([...groups].reverse(), "lesson-one", 8);
  const nextLesson = selectLessonVocabularyWords(groups, "lesson-two", 8);

  assert.equal(first.length, 8);
  assert.deepEqual(first, repeated);
  assert.equal(new Set(first.map((word) => word.id.split("-")[0])).size, 3);
  assert.notDeepEqual(first.map((word) => word.id), nextLesson.map((word) => word.id));
});

test("lesson vocabulary selection removes duplicate expressions and never floods the review queue", () => {
  const selected = selectLessonVocabularyWords([
    { slug: "one", words: [{ id: "a", spanish: "la evidencia" }, { id: "b", spanish: "el matiz" }] },
    { slug: "two", words: [{ id: "c", spanish: "La evidencia" }, { id: "d", spanish: "la postura" }] }
  ], "lesson", 50);

  assert.equal(selected.length, 3);
  assert.equal(selected.filter((word) => /evidencia/i.test(word.spanish)).length, 1);
});

test("later lessons skip introduced words and fill the batch from unseen vocabulary", () => {
  const words = Array.from({ length: 16 }, (_, index) => ({ id: `word-${index}`, spanish: `palabra ${index}` }));
  const first = selectLessonVocabularyWords([{ slug: "topic", words }], "lesson", 8);
  const next = selectLessonVocabularyWords([{ slug: "topic", words }], "lesson", 8, first.map((word) => word.id));

  assert.equal(first.length, 8);
  assert.equal(next.length, 8);
  assert.equal(next.some((word) => first.some((introduced) => introduced.id === word.id)), false);
});

test("lesson vocabulary prioritizes words used by the actual Spanish learning context", () => {
  const groups = [
    {
      slug: "essential-words",
      words: [
        { id: "coffee", spanish: "el café" },
        { id: "thanks", spanish: "gracias" },
        { id: "always", spanish: "siempre" }
      ]
    },
    {
      slug: "c1-register-argument",
      words: [
        { id: "evidence", spanish: "la evidencia" },
        { id: "scope", spanish: "el alcance" },
        { id: "nuance", spanish: "el matiz" },
        { id: "claim", spanish: "la afirmación" }
      ]
    }
  ];
  const lesson = {
    id: "lesson",
    slug: "c1-evidence-scope",
    cefrLevel: "C1",
    sentences: [
      { spanish: "La evidencia limita el alcance de la afirmación." },
      { spanish: "Conviene preservar cada matiz." }
    ],
    readingJson: { paragraphs: ["El alcance depende de la evidencia disponible."] },
    exercises: [{ answerJson: { correctWords: ["La", "afirmación", "exige", "un", "matiz", "."] } }]
  };
  const selected = selectLessonVocabularyWords(groups, lesson.id, 4, [], lesson);

  assert.deepEqual(new Set(selected.map((word) => word.id)), new Set(["evidence", "scope", "nuance", "claim"]));
  assert.deepEqual(lessonVocabularyContextTexts(lesson), [
    "La evidencia limita el alcance de la afirmación.",
    "Conviene preservar cada matiz.",
    "El alcance depende de la evidencia disponible.",
    "La afirmación exige un matiz ."
  ]);
});

test("contextual vocabulary remains deterministic and fills from level-specific words", () => {
  const groups = [
    { slug: "essential-words", words: [{ id: "coffee", spanish: "el café" }, { id: "thanks", spanish: "gracias" }] },
    { slug: "b2-discourse", words: [{ id: "evidence", spanish: "la evidencia" }, { id: "claim", spanish: "la afirmación" }, { id: "scope", spanish: "el alcance" }] }
  ];
  const context = { slug: "b2-argument", cefrLevel: "B2", texts: ["La evidencia apoya el argumento."] };
  const first = selectLessonVocabularyWords(groups, "lesson", 4, [], context);
  const repeated = selectLessonVocabularyWords([...groups].reverse(), "lesson", 4, [], context);

  assert.deepEqual(first, repeated);
  assert.equal(first[0].id, "evidence");
  assert.equal(first.slice(0, 3).every((word) => ["evidence", "claim", "scope"].includes(word.id)), true);
});

test("reported lesson vocabulary is deduplicated, capped, and restricted to words from that lesson", () => {
  const candidates = Array.from({ length: 12 }, (_, index) => `word-${index}`);
  const reported = ["foreign", "word-2", "word-2", ...candidates];
  const validated = validatedIntroducedVocabularyIds(candidates, reported, 8);

  assert.deepEqual(validated, ["word-2", "word-0", "word-1", "word-3", "word-4", "word-5", "word-6", "word-7"]);
  assert.deepEqual(validatedIntroducedVocabularyIds(candidates, null, 8), []);
});

test("daily planning clears meaningful review debt without blocking an active lesson for one small item", () => {
  assert.equal(chooseDailyPlanPriority({ hasInProgress: true, reviewTotal: 1 }), "lesson");
  assert.equal(chooseDailyPlanPriority({ hasInProgress: true, reviewTotal: 8 }), "review");
  assert.equal(chooseDailyPlanPriority({ hasInProgress: true, reviewTotal: 2, mistakeCount: 2 }), "review");
  assert.equal(chooseDailyPlanPriority({ hasNewLesson: true, reviewTotal: 1 }), "review");
  assert.equal(chooseDailyPlanPriority({ hasNewLesson: true, reviewTotal: 0 }), "lesson");
});

test("review sessions interleave mistakes, grammar, and words instead of exhausting one type first", () => {
  const items = interleaveReviewItems({
    mistakes: ["m1", "m2", "m3"],
    grammar: ["g1", "g2", "g3"],
    words: ["w1", "w2", "w3"]
  }, 7);

  assert.deepEqual(items, ["m1", "g1", "w1", "m2", "g2", "w2", "m3"]);
  assert.deepEqual(interleaveReviewItems({ grammar: ["g1", "g2"], words: ["w1"] }, 4), ["g1", "w1", "g2"]);
});

test("review entity deduplication preserves priority without inflating review debt", () => {
  const mistake = { type: "mistake", key: "mistake:ser", exercise: { id: "exercise-1" } };
  const grammarDuplicate = { type: "grammar", key: "grammar:1", exercise: { id: "exercise-1" } };
  const word = { type: "word", key: "word:1", word: { id: "word-1" } };
  const wordDuplicate = { type: "mistake", key: "mistake:word", word: { id: "word-1" } };

  assert.equal(reviewEntityKey(mistake), "exercise:exercise-1");
  assert.equal(reviewEntityKey({ exerciseId: "exercise-2" }), "exercise:exercise-2");
  assert.equal(reviewEntityKey({ wordId: "word-2" }), "word:word-2");
  assert.deepEqual(deduplicateReviewEntities([mistake, grammarDuplicate, word, wordDuplicate]), [mistake, word]);
  assert.deepEqual(deduplicateReviewEntities(null), []);
});

test("weak spots are combined into stable learner-facing concepts", () => {
  const concepts = buildConceptWeaknesses([
    { category: "gender_article", count: 1, topicId: "topic-articles", exerciseId: "article-1", lastOccurredAt: "2026-07-10T08:00:00.000Z" },
    { category: "missing_required_article", count: 2, topicId: "topic-articles", exerciseId: "article-2", lastOccurredAt: "2026-07-11T08:00:00.000Z" },
    { category: "ser_estar", count: 1, topicId: "topic-copulas", exerciseId: "copula-1" },
    { category: "ser_estar", count: 1, topicId: "topic-copulas", exerciseId: "copula-2" },
    { category: "vocabulary", count: 1, topicId: "topic-cafe", topicSlug: "cafe", topicTitle: "Im Café" }
  ]);

  assert.equal(concepts[0].key, "articles");
  assert.equal(concepts[0].repairKey, "articles");
  assert.equal(concepts[0].labelDe, "Artikel und Genus");
  assert.equal(concepts[0].occurrences, 3);
  assert.equal(concepts[0].targetCount, 2);
  assert.deepEqual(concepts[0].topicIds, ["topic-articles"]);
  assert.deepEqual(concepts[0].exerciseIds, ["article-1", "article-2"]);
  assert.equal(concepts[0].latestAt, "2026-07-11T08:00:00.000Z");
  assert.equal(concepts[0].recurring, true);
  assert.equal(concepts[0].repairBrief.examples.length, 2);
  assert.equal(concepts.find((concept) => concept.key === "ser_estar").recurring, true);
  assert.equal(concepts.find((concept) => concept.key === "topic:cafe").recurring, false);
  assert.equal(diagnosticConceptForWeakSpot({ category: "word_order" }).labelDe, "Spanische Wortstellung");
});

test("every diagnosed error family has a bilingual contrastive repair brief", () => {
  const directCategories = ["accent", "gender_article", "missing_required_article", "ser_estar", "verb_conjugation", "word_order", "listening", "transformation"];
  const topicCategories = ["dialogue", "writing", "vocabulary"];
  const concepts = [
    ...directCategories.map((category) => diagnosticConceptForWeakSpot({ category })),
    ...topicCategories.map((category) => diagnosticConceptForWeakSpot({ category, topicId: `topic-${category}` }))
  ];

  for (const concept of concepts) {
    const brief = conceptRepairBriefForWeakness(concept);
    assert.ok(brief, `${concept.repairKey} should have a repair brief`);
    assert.ok(brief.explanationDe.length > 40);
    assert.ok(brief.explanationEn.length > 40);
    assert.ok(brief.decisionDe.length > 30);
    assert.ok(brief.recallDe.length > 30);
    assert.equal(brief.examples.length, 2);
    assert.equal(brief.examples.every((example) => /[áéíóúüñ¿¡]|\b(?:soy|estoy|habla|trabajo|trabaja|estudio|estudias|quiero|puede|necesito|estación|entrada|escribo|viene)\b/iu.test(example.spanish)), true);
    assert.equal(brief.examples.every((example) => example.meaningDe && example.meaningEn && example.cueDe && example.cueEn), true);
  }
  assert.equal(diagnosticConceptForWeakSpot({ category: "dialogue", topicId: "conversation" }).labelDe, "Gespräch sinnvoll fortsetzen");
  assert.equal(diagnosticConceptForWeakSpot({ category: "writing", topicId: "email" }).labelDe, "Klarer spanischer Textaufbau");
});

test("related contrast selection accepts only familiar non-checkpoint exercises", () => {
  const concepts = [{ key: "articles", recurring: true, topicIds: ["topic-articles"] }];
  const candidates = [
    { id: "unknown", topicId: "topic-articles", attempts: [], lesson: { slug: "a1-articles" } },
    { id: "due", topicId: "topic-articles", attempts: [{ id: "attempt-1" }], lesson: { slug: "a1-articles" } },
    { id: "checkpoint", topicId: "topic-articles", attempts: [{ id: "attempt-2" }], lesson: { slug: "checkpoint-a1" } },
    { id: "familiar", topicId: "topic-articles", attempts: [{ id: "attempt-3" }], lesson: { slug: "a1-articles-more" } }
  ];

  const selected = selectConceptContrastCandidates({
    conceptWeaknesses: concepts,
    candidates,
    excludedExerciseIds: ["due"]
  });
  assert.equal(selected.length, 1);
  assert.equal(selected[0].exercise.id, "familiar");
  assert.deepEqual(selectConceptContrastCandidates({ conceptWeaknesses: concepts, candidates: [{ ...candidates[0] }] }), []);
});

test("word attempt directions are native-language neutral with legacy compatibility", () => {
  assert.equal(normalizeWordAttemptMode("native-es"), "native-es");
  assert.equal(normalizeWordAttemptMode("es-native"), "es-native");
  assert.equal(normalizeWordAttemptMode("en-es"), "native-es");
  assert.equal(normalizeWordAttemptMode("es-en"), "es-native");
  assert.equal(normalizeWordAttemptMode("unknown"), "es-native");
  assert.equal(wordAttemptExpectsSpanish("native-es"), true);
  assert.equal(wordAttemptExpectsSpanish("en-es"), true);
  assert.equal(wordAttemptExpectsSpanish("es-native"), false);
});

test("word context answers use only forms that occur as complete units in the authored example", () => {
  assert.equal(wordContextAnswer({ spanish: "la manzana", example: "La manzana es roja." }), "la manzana");
  assert.equal(wordContextAnswer({ spanish: "el doctor", example: "Necesito un doctor." }), "doctor");
  assert.equal(wordContextAnswer({ spanish: "¿cuánto cuesta?", example: "¿Cuánto cuesta el pan?" }), "cuánto cuesta");
  assert.equal(wordContextAnswer({ spanish: "en", example: "Tengo pan." }), "");
  assert.equal(wordContextAnswer({ spanish: "despertarse", example: "Me despierto temprano." }), "");
});
