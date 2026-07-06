const ARTICLES = new Set(["el", "la", "los", "las", "un", "una", "unos", "unas"]);
const SER_FORMS = new Set(["ser", "soy", "eres", "es", "somos", "sois", "son"]);
const ESTAR_FORMS = new Set(["estar", "estoy", "estas", "esta", "estamos", "estais", "estan"]);

function normalizeAnswer(value, { keepAccents = false } = {}) {
  let text = String(value || "");
  if (!keepAccents) {
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeAnswer(value).split(" ").filter(Boolean);
}

function compactTokens(value) {
  return tokenize(value).join(" ");
}

function exactAccentMatch(submitted, candidates) {
  const strict = normalizeAnswer(submitted, { keepAccents: true });
  return candidates.some((candidate) => normalizeAnswer(candidate, { keepAccents: true }) === strict);
}

function accentlessMatch(submitted, candidates) {
  const loose = normalizeAnswer(submitted);
  return candidates.some((candidate) => normalizeAnswer(candidate) === loose);
}

function articleMissing(submitted, expected) {
  const submittedTokens = tokenize(submitted);
  const expectedTokens = tokenize(expected);
  return ARTICLES.has(expectedTokens[0]) && submittedTokens[0] !== expectedTokens[0] && submittedTokens.join(" ") === expectedTokens.slice(1).join(" ");
}

function sameTokensDifferentOrder(submitted, expected) {
  const submittedTokens = tokenize(submitted).sort();
  const expectedTokens = tokenize(expected).sort();
  return (
    submittedTokens.length > 1 &&
    submittedTokens.length === expectedTokens.length &&
    submittedTokens.every((token, index) => token === expectedTokens[index]) &&
    compactTokens(submitted) !== compactTokens(expected)
  );
}

function firstKnownVerb(value) {
  return tokenize(value).find((token) => SER_FORMS.has(token) || ESTAR_FORMS.has(token));
}

function classifyError(exercise, submittedText, expected, answerSpec = {}) {
  const submittedVerb = firstKnownVerb(submittedText);
  const expectedVerb = firstKnownVerb(expected);
  const goal = String(answerSpec.goal || "").toLowerCase();

  if (accentlessMatch(submittedText, [expected]) && !exactAccentMatch(submittedText, [expected])) {
    return "accent";
  }

  if (answerSpec.requiresArticle || goal.includes("article") || exercise.type === "ARTICLE_MATCH") {
    if (articleMissing(submittedText, expected)) return "missing_required_article";
    return "gender_article";
  }

  if (exercise.type === "SENTENCE_BUILDER" && sameTokensDifferentOrder(submittedText, expected)) {
    return "word_order";
  }

  if (
    submittedVerb &&
    expectedVerb &&
    ((SER_FORMS.has(submittedVerb) && ESTAR_FORMS.has(expectedVerb)) ||
      (ESTAR_FORMS.has(submittedVerb) && SER_FORMS.has(expectedVerb)))
  ) {
    return "ser_estar";
  }

  if (["CONJUGATION", "CLOZE"].includes(exercise.type) && submittedVerb && expectedVerb && submittedVerb !== expectedVerb) {
    return "verb_conjugation";
  }

  if (exercise.type === "TRANSFORMATION") return "transformation";
  if (exercise.type === "DIALOGUE_REPLY") return "dialogue";
  if (exercise.type === "LISTENING_DICTATION") return "listening";
  if (exercise.type === "WRITING_PROMPT") return "writing";

  return "vocabulary";
}

function feedbackForCategory(category, expected, answerSpec = {}) {
  const custom = answerSpec.errorHints || {};
  if (custom[category]) return custom[category];

  const messages = {
    accent: `Correct meaning. Remember the accent: ${expected}.`,
    missing_required_article: `The word is right, but this question requires the article: ${expected}.`,
    gender_article: `Check the article or gender. The expected answer is ${expected}.`,
    word_order: `The words are right, but the order needs to be: ${expected}.`,
    ser_estar: `Check ser vs estar here. The expected answer is ${expected}.`,
    verb_conjugation: `Check the verb form. The expected answer is ${expected}.`,
    transformation: `Rewrite the sentence to match the requested pattern: ${expected}.`,
    dialogue: `Use a natural reply for this situation. One good answer is ${expected}.`,
    listening: `Listen again and check each word. The expected sentence is ${expected}.`,
    writing: `Match the required model sentence first: ${expected}.`,
    vocabulary: `Review the meaning and pattern. The expected answer is ${expected}.`
  };
  return messages[category] || messages.vocabulary;
}

function expectedAnswerForExercise(exercise) {
  const answerSpec = exercise.answerJson || {};
  if (Array.isArray(answerSpec.correctWords)) {
    return answerSpec.correctWords.join(" ");
  }
  return answerSpec.correct || "";
}

function acceptedAnswersForExercise(exercise) {
  const answerSpec = exercise.answerJson || {};
  const accepted = [];
  if (Array.isArray(answerSpec.correctWords)) {
    accepted.push(answerSpec.correctWords.join(" "));
  }
  if (answerSpec.correct) accepted.push(answerSpec.correct);
  if (Array.isArray(answerSpec.accepted)) accepted.push(...answerSpec.accepted);
  if (Array.isArray(answerSpec.alternatives)) {
    accepted.push(...answerSpec.alternatives.map((item) => (typeof item === "string" ? item : item.answer)).filter(Boolean));
  }
  return [...new Set(accepted.filter(Boolean))];
}

function submittedTextForExercise(exercise, submitted) {
  if (exercise.type === "SENTENCE_BUILDER") {
    return Array.isArray(submitted.words)
      ? submitted.words.join(" ")
      : String(submitted.answer || submitted.value || "");
  }
  return String(submitted.answer || submitted.value || "");
}

function evaluateExerciseAnswer(exercise, submitted) {
  const answerSpec = exercise.answerJson || {};
  const expected = expectedAnswerForExercise(exercise);
  const accepted = acceptedAnswersForExercise(exercise);
  const alternatives = Array.isArray(answerSpec.alternatives) ? answerSpec.alternatives : [];
  const submittedText = submittedTextForExercise(exercise, submitted);
  const strictAccent = Boolean(answerSpec.accentStrict);
  const exact = accentlessMatch(submittedText, accepted);
  const exactWithAccent = exactAccentMatch(submittedText, accepted);
  const alternative = alternatives.find((item) =>
    accentlessMatch(submittedText, [typeof item === "string" ? item : item.answer])
  );

  if (exact || alternative) {
    const acceptedAlternative = Boolean(alternative) && !accentlessMatch(submittedText, [expected]);
    const hasAccentWarning = !strictAccent && !exactWithAccent && exact;
    if (strictAccent && !exactWithAccent && exact) {
      const errorCategory = "accent";
      return {
        correct: false,
        status: "INCORRECT",
        errorCategory,
        submitted: submittedText,
        expected,
        accepted,
        feedbackMessage: feedbackForCategory(errorCategory, expected, answerSpec)
      };
    }
    return {
      correct: true,
      status: acceptedAlternative
        ? "ACCEPTED_ALTERNATIVE"
        : hasAccentWarning
          ? "CORRECT_WITH_ACCENT_WARNING"
          : "CORRECT",
      errorCategory: hasAccentWarning ? "accent" : null,
      submitted: submittedText,
      expected,
      accepted,
      feedbackMessage: acceptedAlternative
        ? typeof alternative === "object" && alternative.note
          ? alternative.note
          : "That is a valid alternative."
        : hasAccentWarning
          ? feedbackForCategory("accent", expected, answerSpec)
          : "Correct."
    };
  }

  const errorCategory = classifyError(exercise, submittedText, expected, answerSpec);
  return {
    correct: false,
    status: "INCORRECT",
    errorCategory,
    submitted: submittedText,
    expected,
    accepted,
    feedbackMessage: feedbackForCategory(errorCategory, expected, answerSpec)
  };
}

function scheduleExerciseReview(existing, quality, now = new Date()) {
  const currentEase = existing?.ease || 2.3;
  const currentInterval = existing?.intervalDays || 1;
  const normalizedQuality = String(quality || "").toLowerCase();
  let intervalDays = 1;
  let ease = currentEase;
  let state = "LEARNING";

  if (normalizedQuality === "again" || normalizedQuality === "incorrect") {
    intervalDays = 1;
    ease = Math.max(1.3, currentEase - 0.25);
  } else if (normalizedQuality === "hard") {
    intervalDays = 1;
    ease = Math.max(1.5, currentEase - 0.1);
    state = "REVIEW";
  } else if (normalizedQuality === "easy") {
    intervalDays = Math.max(7, Math.ceil(currentInterval * (currentEase + 0.7)));
    ease = Math.min(3.2, currentEase + 0.18);
    state = intervalDays >= 14 ? "MASTERED" : "REVIEW";
  } else {
    intervalDays = Math.max(3, Math.ceil(currentInterval * currentEase));
    ease = Math.min(3.0, currentEase + 0.08);
    state = intervalDays >= 14 ? "MASTERED" : "REVIEW";
  }

  const dueAt = new Date(now);
  dueAt.setUTCDate(dueAt.getUTCDate() + intervalDays);
  return { intervalDays, ease, state, dueAt };
}

function scheduleWordReview(existing, quality, now = new Date()) {
  const normalizedQuality = String(quality || "").toLowerCase();
  const currentEase = existing?.ease || 2.1;
  const currentInterval = existing?.intervalDays || 0;
  const wasCorrect = !["again", "incorrect", "wrong"].includes(normalizedQuality);
  const correctCount = (existing?.correctCount || 0) + (wasCorrect ? 1 : 0);
  const wrongCount = (existing?.wrongCount || 0) + (wasCorrect ? 0 : 1);
  let intervalDays = 0;
  let ease = currentEase;
  let state = "LEARNING";
  const dueAt = new Date(now);

  if (!wasCorrect) {
    ease = Math.max(1.25, currentEase - 0.3);
    dueAt.setUTCMinutes(dueAt.getUTCMinutes() + 5);
    return { intervalDays, ease, state, dueAt, correctCount, wrongCount, wasCorrect };
  }

  if (normalizedQuality === "hard") {
    intervalDays = 1;
    ease = Math.max(1.45, currentEase - 0.08);
  } else if (normalizedQuality === "easy") {
    intervalDays = Math.max(7, Math.ceil(Math.max(1, currentInterval) * (currentEase + 0.8)));
    ease = Math.min(3.2, currentEase + 0.16);
  } else {
    intervalDays = correctCount <= 1 ? 0 : Math.max(3, Math.ceil(Math.max(1, currentInterval) * currentEase));
    ease = Math.min(3.0, currentEase + 0.08);
  }

  if (intervalDays === 0) {
    dueAt.setUTCMinutes(dueAt.getUTCMinutes() + 10);
  } else {
    dueAt.setUTCDate(dueAt.getUTCDate() + intervalDays);
    state = correctCount >= 5 && intervalDays >= 14 ? "MASTERED" : "REVIEW";
  }

  return { intervalDays, ease, state, dueAt, correctCount, wrongCount, wasCorrect };
}

module.exports = {
  acceptedAnswersForExercise,
  evaluateExerciseAnswer,
  expectedAnswerForExercise,
  normalizeAnswer,
  scheduleExerciseReview,
  scheduleWordReview
};
