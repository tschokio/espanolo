function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function stableNumber(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rotate(values, offset) {
  if (!values.length) return [];
  const start = Math.abs(offset) % values.length;
  return [...values.slice(start), ...values.slice(0, start)];
}

export function buildLessonVocabularyLab(words = [], meaningFor = (word) => word?.english || "", lessonKey = "") {
  const items = (words || [])
    .map((word) => ({ ...word, spanish: normalize(word?.spanish), meaning: normalize(meaningFor(word)), example: normalize(word?.example) }))
    .filter((word) => word.id && word.spanish && word.meaning)
    .filter((word, index, list) => list.findIndex((item) => item.spanish.toLocaleLowerCase("es") === word.spanish.toLocaleLowerCase("es")) === index)
    .slice(0, 8);
  if (!items.length) return null;

  const targetIndexes = [...new Set([0, Math.floor(items.length / 2), items.length - 1])];
  const checks = targetIndexes.map((targetIndex) => {
    const target = items[targetIndex];
    const alternatives = items
      .filter((word) => word.id !== target.id && word.meaning !== target.meaning)
      .map((word) => word.meaning)
      .slice(0, 2);
    const options = rotate(
      [{ text: target.meaning, correct: true }, ...alternatives.map((text) => ({ text, correct: false }))],
      stableNumber(`${lessonKey}:${target.id}`)
    );
    return { target, options };
  }).filter((check) => check.options.length >= 2);
  const productionTarget = items[stableNumber(`${lessonKey}:production`) % items.length];

  return { items, checks, productionTarget };
}
