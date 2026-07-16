const SPANISH_FUNCTION_WORDS = new Set([
  "a", "al", "algo", "ante", "como", "con", "contra", "cual", "cuando", "de", "del", "desde", "donde", "el", "ella", "ellos", "en", "entre", "era", "es", "esa", "ese", "esta", "este", "fue", "ha", "hay", "la", "las", "le", "les", "lo", "los", "más", "me", "mi", "muy", "no", "nos", "o", "para", "pero", "por", "porque", "que", "quien", "se", "ser", "si", "sin", "su", "sus", "también", "te", "tiene", "un", "una", "y", "ya"
]);

export function recallTokens(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .match(/[a-zñü0-9]+/gu) || [];
}

function unique(values) {
  return [...new Set(values)];
}

export function recallContentWords(value, limit = 8) {
  return unique(recallTokens(value).filter((token) =>
    (token.length >= 4 || /^\d+$/.test(token)) && !SPANISH_FUNCTION_WORDS.has(token)
  )).slice(0, limit);
}

export function evaluateRecallSummary(answer, model) {
  const answerTokens = recallTokens(answer);
  const answerSet = new Set(answerTokens);
  const concepts = recallContentWords(model);
  const matched = concepts.filter((concept) => answerSet.has(concept));
  const missing = concepts.filter((concept) => !answerSet.has(concept));
  const coverage = concepts.length ? matched.length / concepts.length : 0;
  const effortEnough = answerTokens.length >= 4;
  const signal = !effortEnough || matched.length === 0
    ? "low"
    : matched.length >= 2 && coverage >= 0.3
      ? "strong"
      : "partial";

  return {
    wordCount: answerTokens.length,
    effortEnough,
    concepts,
    matched,
    missing,
    coverage,
    signal
  };
}
