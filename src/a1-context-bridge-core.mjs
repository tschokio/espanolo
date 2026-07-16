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

export function shouldBuildA1ContextBridge(lesson = {}, { scheduledReview = false } = {}) {
  if (scheduledReview || lesson.isCheckpoint || lesson.readingJson?.paragraphs?.length) return false;
  if (String(lesson.cefrLevel || "").toUpperCase() !== "A1") return false;
  if (/sound foundation|sound-|aussprache|lautgrundlage/i.test(`${lesson.theme || ""} ${lesson.slug || ""}`)) return false;
  return (lesson.sentences || []).filter((sentence) => normalize(sentence?.spanish) && normalize(sentence?.english)).length >= 3;
}

export function buildA1ContextBridge(lesson = {}, meaningFor = (sentence) => sentence?.english || "") {
  if (!shouldBuildA1ContextBridge(lesson)) return null;

  const sentences = (lesson.sentences || [])
    .map((sentence, sentenceIndex) => ({
      ...sentence,
      sentenceIndex,
      spanish: normalize(sentence.spanish),
      meaning: normalize(meaningFor(sentence))
    }))
    .filter((sentence) => sentence.spanish && sentence.meaning)
    .filter((sentence, index, list) => list.findIndex((item) => item.spanish === sentence.spanish) === index);
  if (sentences.length < 3) return null;

  const questionIndex = sentences.findIndex((sentence, index) => /[?¿]/u.test(sentence.spanish) && index < sentences.length - 1);
  const firstIndex = questionIndex >= 0 ? questionIndex : 0;
  const first = sentences[firstIndex];
  const second = sentences[firstIndex + 1] || sentences[1];
  const distractor = sentences.find((sentence) => sentence.sentenceIndex !== first.sentenceIndex && sentence.sentenceIndex !== second.sentenceIndex);
  if (!first || !second || !distractor) return null;

  const correctMeaning = `${first.meaning} ${second.meaning}`;
  const rawOptions = [
    { text: correctMeaning, correct: true },
    { text: `${first.meaning} ${distractor.meaning}`, correct: false },
    { text: `${distractor.meaning} ${second.meaning}`, correct: false }
  ].filter((option, index, list) => list.findIndex((item) => item.text === option.text) === index);
  if (rawOptions.length < 3) return null;

  return {
    dialogue: /[?¿]/u.test(first.spanish),
    lines: [first, second],
    options: rotate(rawOptions, stableNumber(lesson.id || lesson.slug || lesson.title) % rawOptions.length),
    recallTarget: second
  };
}
