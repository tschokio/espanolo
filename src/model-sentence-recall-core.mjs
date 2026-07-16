import { compareSpanishOrthography } from "./spanish-orthography-core.mjs";

const SUBJECT_PRONOUN_PATTERN = /^([¿¡]?)(yo|tú|él|ella|nosotros|nosotras|vosotros|vosotras|ellos|ellas|usted|ustedes)\s+(.+)$/iu;

export function modelSentenceWordBank(value) {
  return String(value || "")
    .replace(/[¿?¡!.,;:]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => ({ id: `${index}:${word}`, word }));
}

export function modelSentenceAnswerFromWordIds(bank = [], selectedIds = []) {
  const wordsById = new Map((bank || []).map((item) => [item.id, item.word]));
  return (selectedIds || []).map((id) => wordsById.get(id)).filter(Boolean).join(" ");
}

export function modelSentenceNeedsConsolidation(evidence = {}) {
  return evidence.correct !== true
    || evidence.usedSupport === true
    || evidence.orthographyWarning === true
    || Number(evidence.attemptCount) > 1;
}

export function modelSentenceRecallIsComplete(result = {}, { requireExactOrthography = false } = {}) {
  return result.correct === true && (!requireExactOrthography || result.accentWarning !== true);
}

export function modelSentenceRecallFeedback({
  result = {},
  complete = false,
  requireExactOrthography = false,
  nativeLanguage = "de",
  usedSupport = false,
  attemptCount = 0
} = {}) {
  const german = nativeLanguage === "de";
  if (result.correct && result.accentWarning && requireExactOrthography) {
    return german
      ? "Der Satzinhalt stimmt. Vergleiche jetzt die Akzente und rufe die vollständige Schreibweise noch einmal ab."
      : "The sentence meaning is correct. Compare the accents, then retrieve the complete spelling once more.";
  }
  if (!complete) {
    return german
      ? "Noch nicht ganz – vergleiche den ersten Unterschied und baue den Satz anschließend erneut auf."
      : "Not yet—compare the first difference, then build the sentence again.";
  }
  if (result.accentWarning) {
    return german
      ? "Richtig aufgebaut. Die Schreibweise kommt später gezielt zurück, damit die Akzente ebenfalls sicher werden."
      : "Correct structure. The spelling will return later so its accents also become secure.";
  }
  if (result.match === "omitted_subject_pronoun") {
    return german
      ? `Grammatikalisch richtig: „${result.omittedSubject}“ kann hier natürlich wegfallen.`
      : "Grammatically correct: Spanish can naturally omit this subject pronoun.";
  }
  if (usedSupport || Number(attemptCount) > 1) {
    return german
      ? "Mit Unterstützung richtig aufgebaut – dieser Satz kommt später erneut."
      : "Correct with support—this sentence will return later.";
  }
  return german
    ? "Selbstständig aus dem Gedächtnis abgerufen."
    : "Retrieved independently from memory.";
}

export function modelSentenceScaffoldReason({
  cefrLevel = "",
  index = 0,
  previousSentenceIndex = null,
  previousWasScaffolded = false,
  scheduledReview = false,
  weakSentenceIndexes = []
} = {}) {
  if (scheduledReview || !["A1", "A2"].includes(cefrLevel)) return "";
  if (index === 0) return "first";
  return !previousWasScaffolded && Number.isSafeInteger(previousSentenceIndex) && weakSentenceIndexes.includes(previousSentenceIndex)
    ? "carryover"
    : "";
}

function optionalSubjectRemainder(value) {
  const match = String(value || "").trim().match(SUBJECT_PRONOUN_PATTERN);
  if (!match) return null;
  const remainder = match[3].trim();
  if (/^(?:que|mismo|misma|mismos|mismas)\b/iu.test(remainder)) return null;
  return { subject: match[2], remainder: `${match[1]}${remainder}` };
}

export function evaluateModelSentenceRecall(submitted, expected) {
  const comparison = compareSpanishOrthography(submitted, expected);
  if (!String(submitted || "").trim()) return { correct: false, match: "empty", accentWarning: false };

  if (comparison.contentMatch) {
    return {
      correct: true,
      match: "exact",
      accentWarning: comparison.accentWarning
    };
  }

  const optionalSubject = optionalSubjectRemainder(expected);
  const optionalSubjectComparison = optionalSubject
    ? compareSpanishOrthography(submitted, optionalSubject.remainder)
    : null;
  if (optionalSubject && optionalSubjectComparison.contentMatch) {
    return {
      correct: true,
      match: "omitted_subject_pronoun",
      omittedSubject: optionalSubject.subject,
      accentWarning: optionalSubjectComparison.accentWarning
    };
  }

  return { correct: false, match: "different", accentWarning: false };
}
