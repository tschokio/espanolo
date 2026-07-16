const ARTICLES = new Set(["el", "la", "los", "las", "un", "una", "unos", "unas"]);
const SER_FORMS = new Set(["ser", "soy", "eres", "es", "somos", "sois", "son"]);
const ESTAR_FORMS = new Set(["estar", "estoy", "estas", "esta", "estamos", "estais", "estan"]);
const PRODUCTIVE_EXERCISE_TYPES = new Set(["TRANSLATION", "SENTENCE_BUILDER", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"]);
const FUNCTIONAL_EXERCISE_TYPES = new Set(["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"]);
const SUBJECT_PRONOUN_PATTERN = /^([¿¡]?)(yo|tú|él|ella|nosotros|nosotras|vosotros|vosotras|ellos|ellas|usted|ustedes)\s+(.+)$/iu;

const EXERCISE_MINUTES_BY_LEVEL = Object.freeze({ A1: 0.55, A2: 0.6, B1: 0.7, B2: 0.75, C1: 0.8, C2: 0.9 });
const MODEL_MINUTES_BY_LEVEL = Object.freeze({ A1: 0.85, A2: 0.9, B1: 1, B2: 1, C1: 1.05, C2: 1.1 });

function lessonContentCounts(lesson = {}) {
  const exercises = Array.isArray(lesson.exercises) ? lesson.exercises.length : Number(lesson.exerciseCount || 0);
  const sentences = Array.isArray(lesson.sentences) ? lesson.sentences.length : Number(lesson.sentenceCount || 0);
  const paragraphs = Array.isArray(lesson.readingJson?.paragraphs) ? lesson.readingJson.paragraphs.length : 0;
  const comprehensionChecks = Array.isArray(lesson.readingJson?.questions) ? lesson.readingJson.questions.length : 0;
  return {
    exercises: Math.max(0, exercises),
    sentences: Math.max(0, sentences),
    paragraphs,
    comprehensionChecks
  };
}

function isCheckpointContent(lesson = {}) {
  return /checkpoint/i.test(`${lesson.slug || ""} ${lesson.theme || ""} ${lesson.title || ""}`);
}

function estimateLessonMinutes(lesson = {}) {
  const level = String(lesson.cefrLevel || "A1").toUpperCase();
  const counts = lessonContentCounts(lesson);
  const exerciseMinutes = EXERCISE_MINUTES_BY_LEVEL[level] || 0.7;
  const modelMinutes = MODEL_MINUTES_BY_LEVEL[level] || 1;
  const connectedInputMinutes = counts.paragraphs
    ? 1.5 + counts.paragraphs * 1.25 + counts.comprehensionChecks * 0.6 + (lesson.readingJson?.recallPromptDe ? 0.75 : 0)
    : 0;
  const soundLabMinutes = /^sound-|sound-foundation/.test(`${lesson.slug || ""} ${lesson.topic?.slug || lesson.topicSlug || ""}`) ? 3 : 0;
  const learningFlowMinutes = 3
    + (isCheckpointContent(lesson) ? 0 : 2.5)
    + counts.sentences * modelMinutes
    + counts.exercises * exerciseMinutes
    + connectedInputMinutes
    + soundLabMinutes;
  const authoredEstimate = Math.max(0, Number(lesson.estimatedMinutes || 0));
  return Math.max(5, authoredEstimate, Math.ceil(learningFlowMinutes));
}

function estimateLessonReviewMinutes(lesson = {}) {
  const level = String(lesson.cefrLevel || "A1").toUpperCase();
  const counts = lessonContentCounts(lesson);
  const exerciseMinutes = EXERCISE_MINUTES_BY_LEVEL[level] || 0.7;
  const modelMinutes = MODEL_MINUTES_BY_LEVEL[level] || 1;
  const exerciseLimit = isCheckpointContent(lesson) ? 8 : 6;
  const reviewMinutes = 1.5
    + Math.min(counts.sentences, 2) * modelMinutes
    + Math.min(counts.exercises, exerciseLimit) * exerciseMinutes;
  return Math.max(4, Math.ceil(reviewMinutes));
}

function normalizeAnswer(value, { keepAccents = false } = {}) {
  let text = String(value || "");
  if (!keepAccents) {
    // Spanish acute accents can be handled as a graded spelling warning, but
    // ñ and ü are distinct orthographic forms and must never collapse to n/u.
    text = text.normalize("NFD").replace(/\u0301/g, "").normalize("NFC");
  }
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSpanishWordAnswer(value, { keepAcuteAccents = true } = {}) {
  let text = String(value || "").normalize("NFD");
  if (!keepAcuteAccents) text = text.replace(/\u0301/g, "");
  return text
    .normalize("NFC")
    .toLocaleLowerCase("es")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFullyFoldedAnswer(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function evaluateSpanishWordAnswer(expected, submitted) {
  const strictExpected = normalizeSpanishWordAnswer(expected);
  const strictSubmitted = normalizeSpanishWordAnswer(submitted);
  const accentTolerantExpected = normalizeSpanishWordAnswer(expected, { keepAcuteAccents: false });
  const accentTolerantSubmitted = normalizeSpanishWordAnswer(submitted, { keepAcuteAccents: false });
  const correct = Boolean(accentTolerantExpected) && accentTolerantSubmitted === accentTolerantExpected;
  const orthographyWarning = correct && strictSubmitted !== strictExpected;
  const orthographyMismatch = !correct
    && Boolean(strictExpected)
    && normalizeFullyFoldedAnswer(submitted) === normalizeFullyFoldedAnswer(expected);

  return {
    correct,
    status: correct ? (orthographyWarning ? "CORRECT_WITH_ACCENT_WARNING" : "CORRECT") : "INCORRECT",
    errorCategory: orthographyWarning ? "accent" : orthographyMismatch ? "orthography" : "vocabulary",
    orthographyWarning
  };
}

function listeningAlternativeMeaning(exercise, sentences = []) {
  if (exercise?.type !== "LISTENING_DICTATION") return "";
  const audioText = exercise?.answerJson?.audioText || exercise?.answerJson?.correct || exercise?.audioText || "";
  const normalizedAudio = normalizeAnswer(audioText);
  if (!normalizedAudio) return "";
  const model = (sentences || []).find((sentence) => normalizeAnswer(sentence?.spanish) === normalizedAudio);
  return String(model?.english || "").trim();
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

function subjectPronounOmissionVariant(value) {
  const match = String(value || "").trim().match(SUBJECT_PRONOUN_PATTERN);
  if (!match) return null;
  const remainder = match[3].trim();
  if (/^(?:que|mismo|misma|mismos|mismas)\b/iu.test(remainder)) return null;
  return {
    answer: `${match[1]}${remainder}`,
    note: "Spanish normally allows this subject pronoun to be omitted because the verb form and context identify the person."
  };
}

function grammaticalVariantsForExercise(exercise, accepted = []) {
  if (!PRODUCTIVE_EXERCISE_TYPES.has(exercise?.type) || exercise?.answerJson?.allowSubjectOmission === false) return [];
  const seen = new Set(accepted.map((answer) => normalizeAnswer(answer)));
  const variants = [];
  for (const answer of accepted) {
    const variant = subjectPronounOmissionVariant(answer);
    const normalized = normalizeAnswer(variant?.answer);
    if (!variant || !normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    variants.push(variant);
  }
  return variants;
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

function exerciseLearningSupport(exercise) {
  const model = expectedAnswerForExercise(exercise) ||
    (exercise.options || []).find((option) => option.isCorrect)?.value ||
    (exercise.options || []).find((option) => option.isCorrect)?.text || "";
  const words = String(model)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const wordBank = [...new Set(words)];
  const starterLength = words.length >= 5 ? 2 : words.length >= 2 ? 1 : 0;
  return {
    starter: starterLength ? `${words.slice(0, starterLength).join(" ")}…` : "",
    wordBank,
    model
  };
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

function containsNormalizedPhrase(text, phrase) {
  const normalizedText = normalizeAnswer(text);
  const normalizedPhrase = normalizeAnswer(phrase);
  if (!normalizedText || !normalizedPhrase) return false;
  return ` ${normalizedText} `.includes(` ${normalizedPhrase} `);
}

function containsPhraseWithTrailingSlot(text, phrase, minimumTrailingWords = 1) {
  const textTokens = tokenize(text);
  const phraseTokens = tokenize(phrase);
  if (!textTokens.length || !phraseTokens.length) return false;
  const requiredTrailingWords = Math.max(1, Math.min(6, Math.floor(Number(minimumTrailingWords) || 1)));
  for (let index = 0; index <= textTokens.length - phraseTokens.length; index += 1) {
    const phraseMatches = phraseTokens.every((token, phraseIndex) => textTokens[index + phraseIndex] === token);
    if (phraseMatches && textTokens.length - (index + phraseTokens.length) >= requiredTrailingWords) return true;
  }
  return false;
}

function correctionTokens(value) {
  return String(value || "").match(/[\p{L}\p{M}\p{N}]+(?:[’'-][\p{L}\p{M}\p{N}]+)*/gu) || [];
}

function normalizedCorrectionToken(value, keepAccents = false) {
  return normalizeAnswer(value, { keepAccents });
}

function buildCorrectionFocus(submittedText, expectedText) {
  const submittedTokens = correctionTokens(submittedText);
  const expectedTokens = correctionTokens(expectedText);
  if (!expectedTokens.length) return null;

  const submitted = submittedTokens.map((token) => normalizedCorrectionToken(token));
  const expected = expectedTokens.map((token) => normalizedCorrectionToken(token));
  const rows = submitted.length + 1;
  const columns = expected.length + 1;
  const cost = Array.from({ length: rows }, () => Array(columns).fill(0));
  const operation = Array.from({ length: rows }, () => Array(columns).fill("equal"));

  for (let row = 1; row < rows; row += 1) {
    cost[row][0] = row;
    operation[row][0] = "delete";
  }
  for (let column = 1; column < columns; column += 1) {
    cost[0][column] = column;
    operation[0][column] = "insert";
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      if (submitted[row - 1] === expected[column - 1]) {
        cost[row][column] = cost[row - 1][column - 1];
        operation[row][column] = "equal";
        continue;
      }
      const candidates = [
        { kind: "replace", value: cost[row - 1][column - 1] + 1, priority: 0 },
        { kind: "insert", value: cost[row][column - 1] + 1, priority: 1 },
        { kind: "delete", value: cost[row - 1][column] + 1, priority: 2 }
      ].sort((left, right) => left.value - right.value || left.priority - right.priority);
      cost[row][column] = candidates[0].value;
      operation[row][column] = candidates[0].kind;
    }
  }

  const edits = [];
  let row = submitted.length;
  let column = expected.length;
  while (row > 0 || column > 0) {
    const kind = operation[row][column];
    if (kind === "equal") {
      const submittedToken = submittedTokens[row - 1];
      const expectedToken = expectedTokens[column - 1];
      if (
        normalizedCorrectionToken(submittedToken, true) !== normalizedCorrectionToken(expectedToken, true)
      ) {
        edits.push({ kind: "accent", submittedIndex: row - 1, expectedIndex: column - 1 });
      }
      row -= 1;
      column -= 1;
    } else if (kind === "replace") {
      edits.push({ kind, submittedIndex: row - 1, expectedIndex: column - 1 });
      row -= 1;
      column -= 1;
    } else if (kind === "insert") {
      edits.push({ kind, submittedIndex: row, expectedIndex: column - 1 });
      column -= 1;
    } else {
      edits.push({ kind: "delete", submittedIndex: row - 1, expectedIndex: column });
      row -= 1;
    }
  }

  const first = edits.reverse()[0];
  if (!first) return null;
  const expectedIndex = Math.max(0, Math.min(expectedTokens.length - 1, first.expectedIndex));
  return {
    kind: first.kind,
    position: expectedIndex + 1,
    submittedToken: first.kind === "insert" ? "" : submittedTokens[first.submittedIndex] || "",
    expectedToken: first.kind === "delete" ? "" : expectedTokens[first.expectedIndex] || "",
    before: expectedTokens.slice(Math.max(0, expectedIndex - 2), expectedIndex).join(" "),
    after: expectedTokens.slice(expectedIndex + (first.kind === "delete" ? 0 : 1), expectedIndex + 3).join(" ")
  };
}

function evaluateFunctionalCheck(exercise, submittedText) {
  const check = exercise?.answerJson?.functionalCheck;
  if (!FUNCTIONAL_EXERCISE_TYPES.has(exercise?.type) || !check || !Array.isArray(check.groups)) return null;

  const groups = check.groups
    .filter((group) => group && (
      (Array.isArray(group.any) && group.any.some(Boolean)) ||
      (Array.isArray(group.followedBy) && group.followedBy.some(Boolean))
    ))
    .slice(0, 12);
  if (!groups.length) return null;

  const minimumMatched = Math.max(1, Math.min(groups.length, Math.floor(Number(check.minimumMatched) || groups.length)));
  const evaluatedGroups = groups.map((group, index) => ({
    key: String(group.key || `function-${index + 1}`),
    labelDe: String(group.labelDe || group.label || `Funktion ${index + 1}`),
    labelEn: String(group.labelEn || group.label || `Function ${index + 1}`),
    required: Boolean(group.required),
    matched: (
      (Array.isArray(group.any) && group.any.some((phrase) => containsNormalizedPhrase(submittedText, phrase))) ||
      (Array.isArray(group.followedBy) && group.followedBy.some((phrase) => containsPhraseWithTrailingSlot(submittedText, phrase, group.minimumTrailingWords)))
    ) &&
      !(Array.isArray(group.notAny) && group.notAny.some((phrase) => containsNormalizedPhrase(submittedText, phrase)))
  }));
  const matched = evaluatedGroups.filter((group) => group.matched);
  const missing = evaluatedGroups.filter((group) => !group.matched);
  const missingRequired = missing.filter((group) => group.required);

  return {
    correct: matched.length >= minimumMatched && missingRequired.length === 0,
    matchedCount: matched.length,
    minimumMatched,
    totalGroups: evaluatedGroups.length,
    matched,
    missing,
    missingRequired
  };
}

function evaluateExerciseAnswer(exercise, submitted) {
  const answerSpec = exercise.answerJson || {};
  const expected = expectedAnswerForExercise(exercise);
  const accepted = acceptedAnswersForExercise(exercise);
  const alternatives = Array.isArray(answerSpec.alternatives) ? answerSpec.alternatives : [];
  const grammaticalVariants = grammaticalVariantsForExercise(exercise, accepted);
  const allAccepted = [...accepted, ...grammaticalVariants.map((variant) => variant.answer)];
  const submittedText = submittedTextForExercise(exercise, submitted);
  const strictAccent = Boolean(answerSpec.accentStrict);
  const exact = accentlessMatch(submittedText, allAccepted);
  const exactWithAccent = exactAccentMatch(submittedText, allAccepted);
  const alternative = alternatives.find((item) =>
    accentlessMatch(submittedText, [typeof item === "string" ? item : item.answer])
  );
  const grammaticalVariant = grammaticalVariants.find((item) => accentlessMatch(submittedText, [item.answer]));

  if (exact || alternative || grammaticalVariant) {
    const acceptedAlternative = Boolean(alternative) && !accentlessMatch(submittedText, [expected]);
    const acceptedGrammaticalVariant = Boolean(grammaticalVariant) && !accentlessMatch(submittedText, accepted);
    const hasAccentWarning = !strictAccent && !exactWithAccent && exact;
    if (strictAccent && !exactWithAccent && exact) {
      const errorCategory = "accent";
      return {
        correct: false,
        status: "INCORRECT",
        errorCategory,
        submitted: submittedText,
        expected,
        accepted: allAccepted,
        correctionFocus: buildCorrectionFocus(submittedText, expected),
        feedbackMessage: feedbackForCategory(errorCategory, expected, answerSpec)
      };
    }
    return {
      correct: true,
      status: acceptedAlternative
        ? "ACCEPTED_ALTERNATIVE"
        : acceptedGrammaticalVariant
          ? "ACCEPTED_GRAMMATICAL_VARIANT"
          : hasAccentWarning
            ? "CORRECT_WITH_ACCENT_WARNING"
            : "CORRECT",
      errorCategory: hasAccentWarning ? "accent" : null,
      submitted: submittedText,
      expected,
      accepted: allAccepted,
      feedbackMessage: acceptedAlternative
        ? typeof alternative === "object" && alternative.note
          ? alternative.note
          : "That is a valid alternative."
        : acceptedGrammaticalVariant
          ? grammaticalVariant.note
          : hasAccentWarning
            ? feedbackForCategory("accent", expected, answerSpec)
            : "Correct."
    };
  }

  const functionalCheck = evaluateFunctionalCheck(exercise, submittedText);
  if (functionalCheck?.correct) {
    return {
      correct: true,
      status: "ACCEPTED_FUNCTIONAL_VARIANT",
      errorCategory: null,
      submitted: submittedText,
      expected,
      accepted: allAccepted,
      functionalCheck,
      feedbackMessage: `Valid natural answer: ${functionalCheck.matchedCount} required communication functions are present.`
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
    functionalCheck,
    correctionFocus: functionalCheck ? null : buildCorrectionFocus(submittedText, expected),
    feedbackMessage: feedbackForCategory(errorCategory, expected, answerSpec)
  };
}

function scheduleExerciseReview(existing, quality, now = new Date()) {
  const currentEase = existing?.ease || 2.3;
  const currentInterval = existing?.intervalDays || 0;
  const normalizedQuality = String(quality || "").toLowerCase();
  const isNew = !existing;
  let intervalDays = 0;
  let ease = currentEase;
  let state = "LEARNING";
  const dueAt = new Date(now);

  if (normalizedQuality === "again" || normalizedQuality === "incorrect") {
    ease = Math.max(1.3, currentEase - 0.25);
    dueAt.setUTCMinutes(dueAt.getUTCMinutes() + 10);
    return { intervalDays, ease, state, dueAt };
  } else if (normalizedQuality === "hard") {
    ease = Math.max(1.5, currentEase - 0.1);
    if (isNew) {
      dueAt.setUTCHours(dueAt.getUTCHours() + 8);
      return { intervalDays, ease, state, dueAt };
    }
    intervalDays = 1;
  } else if (normalizedQuality === "easy") {
    intervalDays = isNew ? 4 : Math.max(7, Math.ceil(Math.max(1, currentInterval) * (currentEase + 0.7)));
    ease = Math.min(3.2, currentEase + 0.18);
  } else {
    intervalDays = isNew ? 1 : currentInterval <= 1 ? 3 : Math.ceil(currentInterval * currentEase);
    ease = Math.min(3.0, currentEase + 0.08);
  }

  state = intervalDays >= 21 ? "MASTERED" : "REVIEW";
  dueAt.setUTCDate(dueAt.getUTCDate() + intervalDays);
  return { intervalDays, ease, state, dueAt };
}

function scheduleExercisePractice(existing, quality, now = new Date()) {
  const normalizedQuality = String(quality || "").toLowerCase();
  const wasCorrect = !["again", "incorrect", "wrong"].includes(normalizedQuality);
  const existingDueAt = existing?.dueAt ? new Date(existing.dueAt) : null;
  const isEarlyReinforcement = wasCorrect && existingDueAt && Number.isFinite(existingDueAt.getTime()) && existingDueAt > now;

  if (!isEarlyReinforcement) {
    return { ...scheduleExerciseReview(existing, quality, now), scheduleAdvanced: true };
  }

  return {
    intervalDays: existing.intervalDays || 0,
    ease: existing.ease || 2.3,
    state: existing.state || "LEARNING",
    dueAt: existingDueAt,
    scheduleAdvanced: false
  };
}

function exerciseReviewQuality({ correct, requestedQuality = "good", usedSupport = false, needsOrthographyReview = false } = {}) {
  if (!correct) return "again";
  if (usedSupport || needsOrthographyReview) return "hard";
  const normalized = String(requestedQuality || "good").toLowerCase();
  return ["hard", "good", "easy"].includes(normalized) ? normalized : "good";
}

function summarizeRetrievalAttempts(attempts = []) {
  const tracked = (attempts || []).filter((attempt) => attempt?.answerJson?.retrieval);
  const corrected = tracked.filter((attempt) => attempt.isCorrect && attempt.answerJson.retrieval.correctionAttempt).length;
  const independent = tracked.filter((attempt) => attempt.isCorrect && !attempt.answerJson.retrieval.usedSupport && !attempt.answerJson.retrieval.correctionAttempt).length;
  const supported = tracked.filter((attempt) => attempt.isCorrect && attempt.answerJson.retrieval.usedSupport && !attempt.answerJson.retrieval.correctionAttempt).length;
  const unsuccessful = tracked.filter((attempt) => !attempt.isCorrect).length;
  const successful = independent + supported + corrected;
  return {
    tracked: tracked.length,
    independent,
    supported,
    corrected,
    unsuccessful,
    independentRate: successful ? Math.round((independent / successful) * 100) : 0
  };
}

const SKILL_PROFILE_ORDER = Object.freeze([
  "vocabulary",
  "grammar",
  "listening",
  "reading",
  "writing",
  "conversation",
  "speaking"
]);

const WRITTEN_PRODUCTION_TYPES = new Set([
  "TRANSLATION",
  "SHORT_ANSWER",
  "WRITING_PROMPT",
  "TRANSFORMATION",
  "ERROR_CORRECTION"
]);

function emptySkillEvidence(key) {
  return { key, attempted: 0, independent: 0, supported: 0, corrected: 0, unsuccessful: 0 };
}

function addSkillEvidence(summary, key, outcome) {
  const skill = summary[key];
  if (!skill || !outcome) return;
  skill.attempted += 1;
  skill[outcome] += 1;
}

function retrievalOutcome(attempt = {}) {
  const retrieval = attempt.answerJson?.retrieval || {};
  if (!attempt.isCorrect) return "unsuccessful";
  if (retrieval.correctionAttempt) return "corrected";
  if (retrieval.usedSupport) return "supported";
  return "independent";
}

function skillStage(skill = {}) {
  if (!skill.attempted) return "no-evidence";
  const successful = skill.independent + skill.supported + skill.corrected;
  const independentRate = successful ? skill.independent / successful : 0;
  if (skill.independent >= 12 && independentRate >= 0.8 && skill.unsuccessful <= successful * 0.25) return "well-established";
  if (skill.independent >= 5 && independentRate >= 0.6) return "consolidating";
  return "building";
}

function buildSkillProfile({ attempts = [], wordAttempts = [], skillAttempts = [] } = {}) {
  const summary = Object.fromEntries(SKILL_PROFILE_ORDER.map((key) => [key, emptySkillEvidence(key)]));

  for (const attempt of attempts) {
    const type = attempt.exercise?.type || attempt.exerciseType || "";
    const practiceMode = attempt.answerJson?.retrieval?.practiceMode || "home";
    const inputMethod = attempt.answerJson?.retrieval?.inputMethod || "keyboard";
    const outcome = retrievalOutcome(attempt);

    if (type === "LISTENING_DICTATION" && practiceMode !== "quiet-alternative") {
      addSkillEvidence(summary, "listening", outcome);
    }
    if (type === "DIALOGUE_REPLY") addSkillEvidence(summary, "conversation", outcome);
    if (WRITTEN_PRODUCTION_TYPES.has(type) && inputMethod !== "speech") {
      addSkillEvidence(summary, "writing", outcome);
    }
    if (inputMethod === "speech" && ["TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"].includes(type)) {
      addSkillEvidence(summary, "speaking", outcome);
    }
    if (type && type !== "LISTENING_DICTATION") addSkillEvidence(summary, "grammar", outcome);
  }

  for (const attempt of wordAttempts) {
    const activityMode = attempt.activityMode || "";
    if (activityMode === "flashcard") continue;
    const successful = Boolean(attempt.isCorrect);
    const productive = ["typing", "context"].includes(activityMode) || (!activityMode && normalizeWordAttemptMode(attempt.mode) === "native-es");
    addSkillEvidence(summary, "vocabulary", successful ? (productive ? "independent" : "supported") : "unsuccessful");
  }

  for (const attempt of skillAttempts) {
    if (!summary[attempt.skill]) continue;
    addSkillEvidence(summary, attempt.skill, attempt.isSuccessful ? (attempt.usedSupport ? "supported" : "independent") : "unsuccessful");
  }

  const skills = SKILL_PROFILE_ORDER.map((key) => {
    const skill = summary[key];
    const successful = skill.independent + skill.supported + skill.corrected;
    return {
      ...skill,
      successful,
      independentRate: successful ? Math.round((skill.independent / successful) * 100) : 0,
      stage: skillStage(skill)
    };
  });
  const evidenced = skills.filter((skill) => skill.attempted > 0);
  const nextFocus = evidenced.length
    ? [...skills].sort((a, b) => (a.independent * 2 + a.supported + a.corrected) - (b.independent * 2 + b.supported + b.corrected) || SKILL_PROFILE_ORDER.indexOf(a.key) - SKILL_PROFILE_ORDER.indexOf(b.key))[0].key
    : "vocabulary";

  return { windowDays: 30, skills, nextFocus };
}

function deferredChannelPracticeAction({
  exerciseType = "",
  practiceMode = "home",
  correct = false,
  hasOpenPractice = false
} = {}) {
  if (exerciseType !== "LISTENING_DICTATION" || !correct) return "none";
  if (practiceMode === "home") return hasOpenPractice ? "complete" : "none";
  if (practiceMode !== "quiet-alternative") return "none";
  return hasOpenPractice ? "keep" : "create";
}

function lessonReinforcementInterval({
  mastered = false,
  firstPassScore = 0,
  independentScore = firstPassScore,
  currentInterval = 3,
  reviewCount = 0
} = {}) {
  if (!mastered) return 1;

  const firstPass = Math.max(0, Math.min(100, Number(firstPassScore) || 0));
  const independent = Math.max(0, Math.min(100, Number(independentScore) || 0));
  if (firstPass < 80 || independent < 70) return 1;

  const interval = Math.max(1, Number(currentInterval) || 3);
  return Math.min(30, Number(reviewCount) > 0 ? Math.ceil(interval * 1.7) : 3);
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
    dueAt.setUTCMinutes(dueAt.getUTCMinutes() + 10);
    return { intervalDays, ease, state, dueAt, correctCount, wrongCount, wasCorrect };
  }

  if (normalizedQuality === "hard") {
    intervalDays = correctCount <= 1 ? 0 : 1;
    ease = Math.max(1.45, currentEase - 0.08);
  } else if (normalizedQuality === "easy") {
    intervalDays = correctCount <= 1 ? 4 : Math.max(7, Math.ceil(Math.max(1, currentInterval) * (currentEase + 0.8)));
    ease = Math.min(3.2, currentEase + 0.16);
  } else {
    intervalDays = correctCount <= 1 ? 0 : correctCount === 2 ? 1 : correctCount === 3 ? 3 : Math.ceil(Math.max(1, currentInterval) * currentEase);
    ease = Math.min(3.0, currentEase + 0.08);
  }

  if (intervalDays === 0) {
    dueAt.setUTCMinutes(dueAt.getUTCMinutes() + 10);
  } else {
    dueAt.setUTCDate(dueAt.getUTCDate() + intervalDays);
    state = correctCount >= 5 && intervalDays >= 21 ? "MASTERED" : "REVIEW";
  }

  return { intervalDays, ease, state, dueAt, correctCount, wrongCount, wasCorrect };
}

function scheduleWordPractice(existing, quality, now = new Date()) {
  const normalizedQuality = String(quality || "").toLowerCase();
  const wasCorrect = !["again", "incorrect", "wrong"].includes(normalizedQuality);
  const existingDueAt = existing?.dueAt ? new Date(existing.dueAt) : null;
  const isEarlyReinforcement = wasCorrect && existingDueAt && Number.isFinite(existingDueAt.getTime()) && existingDueAt > now;

  if (!isEarlyReinforcement) {
    return { ...scheduleWordReview(existing, quality, now), scheduleAdvanced: true };
  }

  return {
    intervalDays: existing.intervalDays || 0,
    ease: existing.ease || 2.1,
    state: existing.state || "LEARNING",
    dueAt: existingDueAt,
    correctCount: existing.correctCount || 0,
    wrongCount: existing.wrongCount || 0,
    wasCorrect: true,
    scheduleAdvanced: false
  };
}

function stableVocabularyHash(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rotateVocabularyItems(items, offset) {
  if (!items.length) return [];
  const start = Math.abs(offset) % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

const VOCABULARY_CONTEXT_STOPWORDS = new Set([
  "a", "al", "como", "con", "cuando", "de", "del", "donde", "el", "ella", "ellas", "ellos", "en", "es", "la",
  "las", "lo", "los", "mas", "me", "mi", "muy", "no", "nos", "o", "para", "pero", "por", "porque", "que", "se",
  "si", "sin", "su", "sus", "tambien", "te", "tu", "tus", "un", "una", "uno", "unos", "unas", "y", "ya", "yo"
]);

function lessonVocabularyContextTexts(lesson = {}) {
  const reading = lesson?.readingJson && typeof lesson.readingJson === "object" ? lesson.readingJson : {};
  const answerTexts = (Array.isArray(lesson?.exercises) ? lesson.exercises : []).flatMap((exercise) => {
    const answer = exercise?.answerJson && typeof exercise.answerJson === "object" ? exercise.answerJson : {};
    return [
      answer.correct,
      answer.audioText,
      answer.model,
      ...(Array.isArray(answer.correctWords) ? [answer.correctWords.join(" ")] : [])
    ];
  });
  return [
    ...(Array.isArray(lesson?.sentences) ? lesson.sentences.map((sentence) => sentence?.spanish) : []),
    ...(Array.isArray(reading.paragraphs) ? reading.paragraphs : []),
    reading.modelSummary,
    ...answerTexts
  ].map((text) => String(text || "").replace(/\s+/g, " ").trim()).filter(Boolean);
}

function vocabularyExpressionIsAnchored(spanish, contextTexts = []) {
  const expression = normalizeAnswer(spanish || "");
  const meaningfulTokens = expression.split(" ").filter((token) => token.length >= 3 && !VOCABULARY_CONTEXT_STOPWORDS.has(token));
  if (!expression || !meaningfulTokens.length) return false;
  const texts = Array.isArray(contextTexts) ? contextTexts : [contextTexts];
  const corpus = normalizeAnswer(texts.join(" "));
  return Boolean(corpus) && ` ${corpus} `.includes(` ${expression} `);
}

function vocabularyContextScore(entry, contextCorpus, contextTokens, levelPrefix, lessonSlug) {
  const spanish = normalizeAnswer(entry.word?.spanish || "");
  if (!spanish) return -1;
  const tokens = spanish.split(" ").filter((token) => token.length >= 3 && !VOCABULARY_CONTEXT_STOPWORDS.has(token));
  const exact = tokens.length > 0 && ` ${contextCorpus} `.includes(` ${spanish} `);
  const tokenHits = tokens.filter((token) => contextTokens.has(token)).length;
  const groupLevelMatch = levelPrefix && String(entry.groupKey || "").startsWith(`${levelPrefix}-`);
  const lessonTokens = new Set(normalizeAnswer(lessonSlug).split(" ").filter((token) => token.length >= 4));
  const groupTokens = normalizeAnswer(entry.groupKey).split(" ");
  const groupLessonOverlap = groupTokens.filter((token) => lessonTokens.has(token)).length;
  return (exact ? 1000 + tokens.length * 20 : 0)
    + tokenHits * 80
    + (groupLevelMatch ? 30 : 0)
    + groupLessonOverlap * 12;
}

function selectLessonVocabularyWords(groups = [], lessonKey = "", limit = 8, excludedWordIds = [], context = {}) {
  const boundedLimit = Math.max(1, Math.min(20, Math.floor(Number(limit) || 8)));
  const excluded = new Set(excludedWordIds || []);
  const prepared = (groups || [])
    .filter((group) => Array.isArray(group?.words) && group.words.length)
    .map((group) => {
      const groupKey = group.slug || group.id || group.title || "group";
      const words = [...group.words]
        .filter((word) => word?.id && !excluded.has(word.id))
        .sort((left, right) => String(left.spanish || left.id).localeCompare(String(right.spanish || right.id), "es"));
      return {
        groupKey,
        words: rotateVocabularyItems(words, stableVocabularyHash(`${lessonKey}:${groupKey}`))
      };
    })
    .filter((group) => group.words.length)
    .sort((left, right) => left.groupKey.localeCompare(right.groupKey));
  const contextTexts = Array.isArray(context?.texts) ? context.texts : lessonVocabularyContextTexts(context);
  const contextCorpus = normalizeAnswer(contextTexts.join(" "));
  if (contextCorpus) {
    const contextTokens = new Set(contextCorpus.split(" ").filter(Boolean));
    const levelPrefix = String(context?.cefrLevel || "").toLowerCase();
    const lessonSlug = context?.slug || lessonKey;
    const contextualCandidates = prepared
      .flatMap((group) => group.words.map((word) => ({ word, groupKey: group.groupKey })))
      .map((entry) => ({
        ...entry,
        score: vocabularyContextScore(entry, contextCorpus, contextTokens, levelPrefix, lessonSlug),
        tieBreak: stableVocabularyHash(`${lessonKey}:${entry.groupKey}:${entry.word.id}`)
      }))
      .sort((left, right) => right.score - left.score || left.tieBreak - right.tieBreak || String(left.word.id).localeCompare(String(right.word.id)));
    const selected = [];
    const seen = new Set();
    for (const entry of contextualCandidates) {
      const key = normalizeAnswer(entry.word.spanish || entry.word.id);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      selected.push(entry.word);
      if (selected.length >= boundedLimit) break;
    }
    return selected;
  }
  const queues = rotateVocabularyItems(prepared, stableVocabularyHash(lessonKey));
  const selected = [];
  const seen = new Set();

  let depth = 0;
  while (selected.length < boundedLimit && queues.some((group) => depth < group.words.length)) {
    for (const group of queues) {
      const word = group.words[depth];
      if (!word) continue;
      const key = normalizeAnswer(word.spanish || word.id);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      selected.push(word);
      if (selected.length >= boundedLimit) break;
    }
    depth += 1;
  }
  return selected;
}

function validatedIntroducedVocabularyIds(candidateWordIds = [], introducedWordIds = [], limit = 8) {
  const candidates = new Set((candidateWordIds || []).filter((wordId) => typeof wordId === "string"));
  const boundedLimit = Math.max(0, Math.min(20, Math.floor(Number(limit) || 0)));
  return [...new Set(Array.isArray(introducedWordIds) ? introducedWordIds : [])]
    .filter((wordId) => typeof wordId === "string" && candidates.has(wordId))
    .slice(0, boundedLimit);
}

function requiresCheckpointUnlock(source) {
  // A review item was earned while the exercise was available. Curriculum
  // changes can later lock its checkpoint again, but that must not make the
  // learner's scheduled review impossible to submit.
  return String(source || "LESSON").toUpperCase() !== "REVIEW";
}

function dailyReviewPriorityReason({ reviewTotal = 0, mistakeCount = 0, recurringMistakeCount = 0, oldestOverdueDays = 0 } = {}) {
  if (recurringMistakeCount >= 1) return "recurring_mistake";
  if (oldestOverdueDays >= 3) return "overdue_review";
  if (mistakeCount >= 2) return "multiple_mistakes";
  if (reviewTotal >= 8) return "review_load";
  return "";
}

function buildReviewUrgencyDiagnostics({ dueDates = [], weakSpots = [], reviewTotal = 0, mistakeCount = 0 } = {}, now = new Date()) {
  const spots = Array.isArray(weakSpots) ? weakSpots : [];
  const recurringMistakeCount = spots.filter((spot) => Number(spot?.count || 0) >= 2).length;
  const maxMistakeOccurrences = spots.reduce((maximum, spot) => Math.max(maximum, Number(spot?.count || 0)), 0);
  const dueTimes = (Array.isArray(dueDates) ? dueDates : [])
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);
  const oldestDueAt = dueTimes.length ? new Date(Math.min(...dueTimes)) : null;
  const oldestOverdueDays = oldestDueAt
    ? Math.max(0, Math.floor((now.getTime() - oldestDueAt.getTime()) / 86400000))
    : 0;
  return {
    recurringMistakeCount,
    maxMistakeOccurrences,
    oldestDueAt,
    oldestOverdueDays,
    urgentReason: dailyReviewPriorityReason({
      reviewTotal,
      mistakeCount,
      recurringMistakeCount,
      oldestOverdueDays
    }) || null
  };
}

function chooseDailyPlanPriority({ hasInProgress = false, hasDueLesson = false, hasNewLesson = false, hasFreshLessonSession = false, reviewTotal = 0, mistakeCount = 0, recurringMistakeCount = 0, oldestOverdueDays = 0 } = {}) {
  if (dailyReviewPriorityReason({ reviewTotal, mistakeCount, recurringMistakeCount, oldestOverdueDays })) return "review";
  if (hasInProgress) return "lesson";
  if (hasDueLesson) return "lesson";
  if (reviewTotal > 0) return "review";
  if (hasFreshLessonSession) return "reinforcement";
  if (hasNewLesson) return "lesson";
  return "reinforcement";
}

function lessonProgressValue(lesson = {}) {
  if (typeof lesson.progress === "number") return lesson.progress;
  return lesson.progress?.[0]?.mastery || 0;
}

function completedLessonSessionToday(lessons = [], now = new Date()) {
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return (Array.isArray(lessons) ? lessons : []).some((lesson) => {
    if (lessonProgressValue(lesson) < 100) return false;
    const reviewedAt = lesson.lastReviewedAt || lesson.progress?.[0]?.lastReviewedAt;
    if (!reviewedAt) return false;
    const timestamp = new Date(reviewedAt).getTime();
    return Number.isFinite(timestamp) && timestamp >= dayStart.getTime() && timestamp <= now.getTime();
  });
}

function familiarPracticeTargets(lessons = [], correctExerciseIds = []) {
  const correctIds = new Set(Array.isArray(correctExerciseIds) ? correctExerciseIds : []);
  const candidates = [];

  for (const lesson of Array.isArray(lessons) ? lessons : []) {
    const mastery = lessonProgressValue(lesson);
    if (mastery <= 0) continue;
    for (const exercise of Array.isArray(lesson.exercises) ? lesson.exercises : []) {
      // A completed package proves every exercise has been solved correctly.
      // In an unfinished package, only exercises with explicit success evidence
      // are familiar enough for a reinforcement surface.
      if (mastery < 100 && !correctIds.has(exercise.id)) continue;
      candidates.push({ lesson, exercise });
    }
  }

  candidates.sort((left, right) =>
    Number(left.lesson.order || 0) - Number(right.lesson.order || 0) ||
    Number(left.exercise.order || 0) - Number(right.exercise.order || 0) ||
    String(left.exercise.id || "").localeCompare(String(right.exercise.id || ""))
  );
  return candidates;
}

function selectFamiliarPracticeTarget(lessons = [], correctExerciseIds = [], seed = "") {
  const candidates = familiarPracticeTargets(lessons, correctExerciseIds);
  if (!candidates.length) return null;
  return candidates[stableVocabularyHash(seed) % candidates.length];
}

const SKILL_PRACTICE_TYPES = Object.freeze({
  grammar: ["CLOZE", "SENTENCE_BUILDER", "CONJUGATION", "ARTICLE_MATCH", "TRANSLATION", "ERROR_CORRECTION", "TRANSFORMATION"],
  listening: ["LISTENING_DICTATION"],
  writing: ["WRITING_PROMPT", "TRANSLATION", "SHORT_ANSWER", "TRANSFORMATION", "ERROR_CORRECTION"],
  conversation: ["DIALOGUE_REPLY"],
  speaking: ["DIALOGUE_REPLY", "SHORT_ANSWER", "TRANSLATION"]
});

function selectFamiliarPracticeTargetForSkill(targets = [], skill = "", seed = "") {
  const allowedTypes = new Set(SKILL_PRACTICE_TYPES[skill] || []);
  if (!allowedTypes.size) return null;
  const matching = (Array.isArray(targets) ? targets : []).filter((target) => allowedTypes.has(target?.exercise?.type));
  if (!matching.length) return null;
  return matching[stableVocabularyHash(`${skill}:${seed}`) % matching.length];
}

function exerciseIsFamiliarForPractice({ lessonMastery = 0, priorAttemptCount = 0 } = {}) {
  return Number(lessonMastery) >= 100 || Number(priorAttemptCount) > 0;
}

function interleaveReviewItems({ mistakes = [], grammar = [], words = [] } = {}, limit = 12) {
  const queues = [mistakes, grammar, words].map((items) => [...(items || [])]);
  const result = [];
  while (result.length < limit && queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      if (result.length >= limit) break;
      if (queue.length) result.push(queue.shift());
    }
  }
  return result;
}

function reviewEntityKey(item = {}) {
  const exerciseId = item.exercise?.id || item.exerciseId;
  if (exerciseId) return `exercise:${exerciseId}`;
  const wordId = item.word?.id || item.wordId;
  if (wordId) return `word:${wordId}`;
  return item.key ? `item:${item.key}` : "";
}

function deduplicateReviewEntities(items = []) {
  const seen = new Set();
  return (Array.isArray(items) ? items : []).filter((item) => {
    const entityKey = reviewEntityKey(item);
    if (!entityKey || seen.has(entityKey)) return false;
    seen.add(entityKey);
    return true;
  });
}

const DIAGNOSTIC_CONCEPTS = Object.freeze({
  accent: { key: "accent", repairKey: "accent", labelDe: "Akzente und Betonung", labelEn: "Accents and stress" },
  gender_article: { key: "articles", repairKey: "articles", labelDe: "Artikel und Genus", labelEn: "Articles and gender" },
  missing_required_article: { key: "articles", repairKey: "articles", labelDe: "Artikel und Genus", labelEn: "Articles and gender" },
  ser_estar: { key: "ser_estar", repairKey: "ser_estar", labelDe: "ser und estar", labelEn: "ser and estar" },
  verb_conjugation: { key: "verb_forms", repairKey: "verb_forms", labelDe: "Verbformen", labelEn: "Verb forms" },
  word_order: { key: "word_order", repairKey: "word_order", labelDe: "Spanische Wortstellung", labelEn: "Spanish word order" },
  listening: { key: "listening", repairKey: "listening", labelDe: "Hörgenauigkeit", labelEn: "Listening accuracy" },
  transformation: { key: "transformation", repairKey: "transformation", labelDe: "Satzumformung", labelEn: "Sentence transformation" }
});

const CONCEPT_REPAIR_BRIEFS = Object.freeze({
  accent: {
    explanationDe: "Der geschriebene Akzent gehört zur Wortform. Er zeigt häufig die betonte Silbe und kann sogar Wörter unterscheiden.",
    explanationEn: "A written accent belongs to the word form. It often marks stress and can distinguish words.",
    decisionDe: "Sprich das Wort innerlich in Silben. Prüfe danach, ob die betonte Silbe im gelernten Modell einen Akzent trägt.",
    decisionEn: "Say the word internally in syllables, then check whether the stressed syllable carries an accent in the learned model.",
    examples: [
      { spanish: "Él habla español.", meaningDe: "Er spricht Spanisch.", meaningEn: "He speaks Spanish.", cueDe: "Él = er; der Akzent unterscheidet es vom Artikel el.", cueEn: "Él means he; the accent distinguishes it from the article el." },
      { spanish: "Mi papá trabaja aquí.", meaningDe: "Mein Papa arbeitet hier.", meaningEn: "My dad works here.", cueDe: "papá und aquí werden auf der letzten Silbe betont.", cueEn: "papá and aquí are stressed on the final syllable." }
    ],
    recallDe: "Achte beim nächsten Abruf zuerst auf die betonte Silbe und tippe den Akzent bewusst mit.",
    recallEn: "In the next retrieval, locate the stressed syllable first and type the accent deliberately."
  },
  articles: {
    explanationDe: "Spanische Nomen werden am zuverlässigsten zusammen mit ihrem Artikel gelernt. Artikel zeigen Genus und Zahl und sind oft ein fester Teil des Satzrahmens.",
    explanationEn: "Spanish nouns are learned most reliably together with their article. Articles mark gender and number and are often part of the sentence frame.",
    decisionDe: "Frage zuerst: ein bestimmtes oder ein unbestimmtes Ding? Prüfe danach Genus und Einzahl/Mehrzahl.",
    decisionEn: "First decide whether the noun is definite or indefinite, then check gender and singular or plural.",
    examples: [
      { spanish: "Necesito un billete.", meaningDe: "Ich brauche eine Fahrkarte.", meaningEn: "I need a ticket.", cueDe: "un billete: männlich und noch nicht näher bestimmt.", cueEn: "un billete: masculine and not yet specified." },
      { spanish: "La estación está cerca.", meaningDe: "Der Bahnhof ist in der Nähe.", meaningEn: "The station is nearby.", cueDe: "la estación: weiblich und bestimmt.", cueEn: "la estación: feminine and definite." }
    ],
    recallDe: "Rufe im nächsten Satz Nomen und Artikel als eine Einheit ab, nicht als zwei getrennte Wörter.",
    recallEn: "Retrieve the noun and article as one unit in the next sentence, not as two separate words."
  },
  ser_estar: {
    explanationDe: "ser ordnet etwas ein: Identität, Herkunft oder grundlegende Eigenschaft. estar verortet etwas oder beschreibt einen Zustand in der konkreten Situation.",
    explanationEn: "ser classifies identity, origin, or an identifying quality. estar locates something or describes its state in the current situation.",
    decisionDe: "Entscheide nicht nach ‚dauerhaft‘ oder ‚vorübergehend‘. Frage: Ordne ich ein – oder beschreibe ich Ort/Zustand?",
    decisionEn: "Do not decide by permanent versus temporary. Ask whether you are classifying something or describing location/state.",
    examples: [
      { spanish: "Soy estudiante.", meaningDe: "Ich bin Student/in.", meaningEn: "I am a student.", cueDe: "Identität oder Rolle → ser.", cueEn: "Identity or role → ser." },
      { spanish: "Estoy en la biblioteca.", meaningDe: "Ich bin in der Bibliothek.", meaningEn: "I am in the library.", cueDe: "Ort einer Person → estar.", cueEn: "Location of a person → estar." }
    ],
    recallDe: "Benenne vor der Antwort innerlich die Funktion: Einordnung, Ort oder Zustand.",
    recallEn: "Before answering, name the function internally: classification, location, or state."
  },
  verb_forms: {
    explanationDe: "Die spanische Verbendung trägt die Person. Deshalb darf das Subjektpronomen oft fehlen – die Form muss aber eindeutig zu yo, tú, él/ella usw. passen.",
    explanationEn: "The Spanish verb ending carries the person. That is why the subject pronoun can often be omitted, but the form must match yo, tú, él/ella, and so on.",
    decisionDe: "Bestimme zuerst, wer handelt. Setze dann Stamm und passende Personenendung zusammen.",
    decisionEn: "Identify who acts first, then combine the stem with the matching person ending.",
    examples: [
      { spanish: "Yo trabajo aquí.", meaningDe: "Ich arbeite hier.", meaningEn: "I work here.", cueDe: "yo → trabajo.", cueEn: "yo → trabajo." },
      { spanish: "Ella trabaja aquí.", meaningDe: "Sie arbeitet hier.", meaningEn: "She works here.", cueDe: "ella → trabaja.", cueEn: "ella → trabaja." }
    ],
    recallDe: "Suche beim nächsten Satz zuerst die handelnde Person und produziere danach die Verbform.",
    recallEn: "In the next sentence, identify the person first and then produce the verb form."
  },
  word_order: {
    explanationDe: "Spanische Aussagen folgen häufig Verb und Ergänzungen, erlauben aber flexible Angaben am Anfang. Fragen brauchen oft keinen deutschen Umbau mit einem Hilfsverb.",
    explanationEn: "Spanish statements often follow verb and complements, while time or place can move to the front. Questions usually need no English-style auxiliary verb.",
    decisionDe: "Baue zuerst den Kern aus Verb und Ergänzung. Setze Zeit, Ort oder Fragewort anschließend an die sinnvolle Position.",
    decisionEn: "Build the verb-and-complement core first, then place time, location, or the question word where it belongs.",
    examples: [
      { spanish: "Hoy estudio en la biblioteca.", meaningDe: "Heute lerne ich in der Bibliothek.", meaningEn: "Today I study in the library.", cueDe: "Zeitangabe + Verb + Ort bilden einen natürlichen Satz.", cueEn: "Time phrase + verb + location form a natural sentence." },
      { spanish: "¿Dónde estudias hoy?", meaningDe: "Wo lernst du heute?", meaningEn: "Where are you studying today?", cueDe: "Fragewort zuerst; die Verbform zeigt die Person.", cueEn: "Question word first; the verb form marks the person." }
    ],
    recallDe: "Ordne beim nächsten Abruf zuerst den Satzkern und ergänze erst danach bewegliche Angaben.",
    recallEn: "In the next retrieval, arrange the sentence core first and add movable details afterward."
  },
  listening: {
    explanationDe: "Beim Hören verschwimmen Wortgrenzen. Erfolgreiches Verstehen beginnt deshalb mit Sinnblöcken und betonten Schlüsselwörtern, nicht mit jedem einzelnen Laut.",
    explanationEn: "Word boundaries blur in speech. Successful listening starts with meaning chunks and stressed key words rather than every individual sound.",
    decisionDe: "Höre zuerst auf Situation und Schlüsselwörter. Rekonstruiere danach kleine Sinngruppen und prüfe Endungen zuletzt.",
    decisionEn: "Listen for the situation and key words first, then reconstruct short meaning chunks and check endings last.",
    examples: [
      { spanish: "Quiero una mesa para dos.", meaningDe: "Ich möchte einen Tisch für zwei.", meaningEn: "I would like a table for two.", cueDe: "Hörblöcke: quiero | una mesa | para dos.", cueEn: "Listening chunks: quiero | una mesa | para dos." },
      { spanish: "¿Puede repetirlo, por favor?", meaningDe: "Können Sie das bitte wiederholen?", meaningEn: "Could you repeat that, please?", cueDe: "Eine echte Reparaturfrage ist besser als Raten.", cueEn: "A real repair question is better than guessing." }
    ],
    recallDe: "Im Zuhause-Modus hörst du zuerst ohne Text; im Leisemodus rekonstruierst du dieselben Sinnblöcke aus der Bedeutung.",
    recallEn: "At home, listen once without text; in quiet mode, reconstruct the same meaning chunks from the meaning."
  },
  transformation: {
    explanationDe: "Beim Umformen bleibt die Grundbedeutung stabil, während genau eine grammatische Perspektive wechselt – etwa Person, Zeit, Verneinung oder Pronomen.",
    explanationEn: "In transformation, the core meaning stays stable while exactly one grammatical perspective changes, such as person, tense, negation, or pronoun.",
    decisionDe: "Markiere gedanklich zuerst, was gleich bleibt. Ändere dann nur das geforderte Merkmal und gleiche abhängige Verb- oder Pronomenformen an.",
    decisionEn: "First identify what stays the same, then change only the requested feature and adjust dependent verb or pronoun forms.",
    examples: [
      { spanish: "Trabajo hoy. → No trabajo hoy.", meaningDe: "Ich arbeite heute. → Ich arbeite heute nicht.", meaningEn: "I work today. → I do not work today.", cueDe: "Nur die Verneinung kommt vor das Verb.", cueEn: "Only the negation is added before the verb." },
      { spanish: "Yo estudio aquí. → Ella estudia aquí.", meaningDe: "Ich lerne hier. → Sie lernt hier.", meaningEn: "I study here. → She studies here.", cueDe: "Die Person wechselt; deshalb wechselt auch die Verbendung.", cueEn: "The person changes, so the verb ending changes too." }
    ],
    recallDe: "Nenne vor der nächsten Antwort das eine Merkmal, das du verändern sollst.",
    recallEn: "Before the next answer, name the one feature you need to change."
  },
  dialogue: {
    explanationDe: "Ein Gespräch bleibt in Bewegung, wenn eine Antwort nicht nur reagiert, sondern mit einer kleinen Rückfrage oder Anschlussinformation eine neue Tür öffnet.",
    explanationEn: "A conversation keeps moving when a reply not only reacts but opens the next turn with a small question or follow-up detail.",
    decisionDe: "Baue deine Antwort aus zwei Teilen: reagieren + zurückfragen oder ergänzen.",
    decisionEn: "Build your reply from two parts: react + ask back or add a detail.",
    examples: [
      { spanish: "Muy bien, gracias. ¿Y tú?", meaningDe: "Sehr gut, danke. Und du?", meaningEn: "Very well, thanks. And you?", cueDe: "Antwort + einfache Rückfrage.", cueEn: "Answer + simple return question." },
      { spanish: "Hoy voy a estudiar. ¿Qué vas a hacer tú?", meaningDe: "Heute werde ich lernen. Was wirst du machen?", meaningEn: "Today I am going to study. What are you going to do?", cueDe: "Eigene Information + passende Anschlussfrage.", cueEn: "Your information + a related follow-up question." }
    ],
    recallDe: "Plane beim nächsten Dialogzug nicht den ganzen Dialog – nur Reaktion und eine Anschlussbrücke.",
    recallEn: "For the next dialogue turn, do not plan the whole conversation—only a reaction and one bridge forward."
  },
  writing: {
    explanationDe: "Ein klarer spanischer Text erfüllt zuerst seinen Zweck: Anlass nennen, die nötige Information geben und mit einer passenden nächsten Handlung schließen.",
    explanationEn: "A clear Spanish text first fulfills its purpose: state the reason, give the needed information, and close with an appropriate next action.",
    decisionDe: "Plane drei kleine Bausteine: Einstieg, Kerninformation, Abschluss. Formuliere erst danach vollständige Sätze.",
    decisionEn: "Plan three small blocks: opening, core information, closing. Only then write complete sentences.",
    examples: [
      { spanish: "Hola, Ana: Te escribo porque necesito cambiar la cita.", meaningDe: "Hallo Ana, ich schreibe dir, weil ich den Termin ändern muss.", meaningEn: "Hi Ana, I am writing because I need to change the appointment.", cueDe: "Anrede + klarer Anlass.", cueEn: "Greeting + clear reason." },
      { spanish: "¿Te viene bien el viernes? Un saludo, Lukas.", meaningDe: "Passt dir Freitag? Viele Grüße, Lukas.", meaningEn: "Does Friday work for you? Best, Lukas.", cueDe: "Nächster Schritt + Abschluss.", cueEn: "Next step + closing." }
    ],
    recallDe: "Prüfe beim nächsten Schreibauftrag vor dem Absenden: Anlass, nötige Information und nächster Schritt vorhanden?",
    recallEn: "Before submitting the next writing task, check whether reason, needed information, and next step are present."
  },
  vocabulary: {
    explanationDe: "Ein Wort bleibt besser abrufbar, wenn es nicht allein, sondern in einem wiederverwendbaren Satzrahmen gelernt wird.",
    explanationEn: "A word is easier to retrieve when learned inside a reusable sentence frame rather than in isolation.",
    decisionDe: "Verbinde das Zielwort mit Artikel, typischem Verb und einer konkreten Situation.",
    decisionEn: "Connect the target word with its article, a typical verb, and a concrete situation.",
    examples: [
      { spanish: "Necesito una entrada.", meaningDe: "Ich brauche eine Eintrittskarte.", meaningEn: "I need a ticket.", cueDe: "necesito + eine konkrete Sache.", cueEn: "necesito + a concrete thing." },
      { spanish: "La entrada cuesta diez euros.", meaningDe: "Die Eintrittskarte kostet zehn Euro.", meaningEn: "The ticket costs ten euros.", cueDe: "Dasselbe Wort in einem zweiten nützlichen Satzrahmen.", cueEn: "The same word in a second useful sentence frame." }
    ],
    recallDe: "Rufe beim nächsten Zielwort zuerst den vertrauten Satzrahmen ab; das Einzelwort folgt darin leichter.",
    recallEn: "For the next target word, retrieve the familiar sentence frame first; the individual word will follow more easily."
  }
});

function diagnosticConceptForWeakSpot(spot = {}) {
  const category = String(spot.category || spot.errorCategory || "vocabulary");
  if (DIAGNOSTIC_CONCEPTS[category]) return DIAGNOSTIC_CONCEPTS[category];
  const topicKey = String(spot.topicSlug || spot.topicId || "").trim();
  if (topicKey) {
    const fallbackLabels = {
      dialogue: { de: "Gespräch sinnvoll fortsetzen", en: "Continue the conversation" },
      writing: { de: "Klarer spanischer Textaufbau", en: "Clear Spanish writing" },
      vocabulary: { de: "Wortschatz im Satz", en: "Vocabulary in context" }
    };
    const labels = fallbackLabels[category] || { de: "Muster aus demselben Lernthema", en: "Related lesson pattern" };
    return {
      key: `topic:${topicKey}`,
      repairKey: ["dialogue", "writing", "vocabulary"].includes(category) ? category : "vocabulary",
      labelDe: labels.de,
      labelEn: String(spot.topicTitle || spot.title || labels.en)
    };
  }
  return {
    key: `category:${category}`,
    repairKey: ["dialogue", "writing", "vocabulary"].includes(category) ? category : "vocabulary",
    labelDe: category === "vocabulary" ? "Wortschatz im Satz" : "Kommunikatives Satzmuster",
    labelEn: category === "vocabulary" ? "Vocabulary in context" : "Communicative sentence pattern"
  };
}

function conceptRepairBriefForWeakness(concept = {}) {
  const brief = CONCEPT_REPAIR_BRIEFS[concept.repairKey || concept.key];
  if (!brief) return null;
  return {
    ...brief,
    examples: brief.examples.map((example) => ({ ...example }))
  };
}

function buildConceptWeaknesses(weakSpots = []) {
  const groups = new Map();
  for (const spot of Array.isArray(weakSpots) ? weakSpots : []) {
    const concept = diagnosticConceptForWeakSpot(spot);
    const existing = groups.get(concept.key) || {
      ...concept,
      occurrences: 0,
      targetCount: 0,
      topicIds: [],
      exerciseIds: [],
      latestAt: null
    };
    existing.occurrences += Math.max(1, Number(spot.count || spot.occurrenceCount || 1));
    existing.targetCount += 1;
    if (spot.topicId && !existing.topicIds.includes(spot.topicId)) existing.topicIds.push(spot.topicId);
    const exerciseId = spot.exercise?.id || spot.exerciseId;
    if (exerciseId && !existing.exerciseIds.includes(exerciseId)) existing.exerciseIds.push(exerciseId);
    const occurredAt = spot.lastOccurredAt ? new Date(spot.lastOccurredAt) : null;
    if (occurredAt && !Number.isNaN(occurredAt.getTime()) && (!existing.latestAt || occurredAt > new Date(existing.latestAt))) {
      existing.latestAt = occurredAt.toISOString();
    }
    groups.set(concept.key, existing);
  }
  return [...groups.values()]
    .map((concept) => ({
      ...concept,
      recurring: concept.occurrences >= 3 || concept.targetCount >= 2,
      repairBrief: conceptRepairBriefForWeakness(concept)
    }))
    .sort((left, right) =>
      Number(right.recurring) - Number(left.recurring) ||
      right.targetCount - left.targetCount ||
      right.occurrences - left.occurrences ||
      String(left.key).localeCompare(String(right.key))
    );
}

function selectConceptContrastCandidates({ conceptWeaknesses = [], candidates = [], excludedExerciseIds = [], limit = 2 } = {}) {
  const excluded = new Set(excludedExerciseIds);
  const used = new Set();
  const selected = [];
  const recurringConcepts = (Array.isArray(conceptWeaknesses) ? conceptWeaknesses : [])
    .filter((concept) => concept.recurring && concept.topicIds?.length);

  for (const concept of recurringConcepts) {
    const exercise = (Array.isArray(candidates) ? candidates : []).find((candidate) => {
      const lessonMarker = `${candidate.lesson?.slug || ""} ${candidate.lesson?.theme || ""}`;
      return concept.topicIds.includes(candidate.topicId) &&
        !excluded.has(candidate.id) &&
        !used.has(candidate.id) &&
        Array.isArray(candidate.attempts) && candidate.attempts.length > 0 &&
        !/checkpoint/i.test(lessonMarker);
    });
    if (!exercise) continue;
    used.add(exercise.id);
    selected.push({ concept, exercise });
    if (selected.length >= Math.max(0, limit)) break;
  }
  return selected;
}

function normalizeWordAttemptMode(value) {
  const mode = String(value || "").toLowerCase();
  if (["native-es", "en-es", "typing"].includes(mode)) return "native-es";
  if (["es-native", "es-en"].includes(mode)) return "es-native";
  return "es-native";
}

function wordContextAnswer(word) {
  const example = String(word?.example || "").replace(/\s+/g, " ").trim();
  const target = String(word?.spanish || "").replace(/\s+/g, " ").trim();
  if (!example || !target || example.toLocaleLowerCase("es") === target.toLocaleLowerCase("es")) return "";

  const withoutOuterPunctuation = target.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
  const withoutArticle = withoutOuterPunctuation.replace(/^(?:el|la|los|las)\s+/iu, "");
  const candidates = [...new Set([target, withoutOuterPunctuation, withoutArticle].filter(Boolean))];
  return candidates.find((candidate) => {
    const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu").test(example);
  }) || "";
}

function wordAttemptExpectsSpanish(value) {
  return normalizeWordAttemptMode(value) === "native-es";
}

module.exports = {
  acceptedAnswersForExercise,
  buildCorrectionFocus,
  evaluateFunctionalCheck,
  evaluateExerciseAnswer,
  grammaticalVariantsForExercise,
  exerciseLearningSupport,
  expectedAnswerForExercise,
  normalizeAnswer,
  normalizeSpanishWordAnswer,
  evaluateSpanishWordAnswer,
  scheduleExerciseReview,
  scheduleExercisePractice,
  exerciseReviewQuality,
  summarizeRetrievalAttempts,
  buildSkillProfile,
  deferredChannelPracticeAction,
  lessonReinforcementInterval,
  scheduleWordReview,
  scheduleWordPractice,
  selectLessonVocabularyWords,
  lessonVocabularyContextTexts,
  vocabularyExpressionIsAnchored,
  validatedIntroducedVocabularyIds,
  requiresCheckpointUnlock,
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
  estimateLessonMinutes,
  estimateLessonReviewMinutes
};
