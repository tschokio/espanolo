function normalizedIndex(value, length) {
  if (!length) return 0;
  const integer = Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0;
  return ((integer % length) + length) % length;
}

export function balanceFoundationQuickCheck(check, sessionOffset = 0, cardIndex = 0) {
  const options = Array.isArray(check?.options) ? [...check.options] : [];
  if (!options.length) return { ...check, options, correct: 0 };

  const correct = normalizedIndex(check?.correct, options.length);
  const target = normalizedIndex(Number(sessionOffset) + Number(cardIndex), options.length);
  if (correct !== target) {
    [options[correct], options[target]] = [options[target], options[correct]];
  }

  return { ...check, options, correct: target };
}

export function buildEnglishFoundationQuickCheck(cards = [], cardIndex = 0) {
  const available = Array.isArray(cards) ? cards.filter((card) => card?.title && card?.body) : [];
  const current = available[normalizedIndex(cardIndex, available.length)] || null;
  if (!current) {
    return {
      question: "What should guide your choice?",
      options: [
        "Use meaning and communicative function before choosing the form.",
        "Choose only from the nearest word-for-word translation.",
        "Ignore the pattern and memorize one example as an unchangeable sentence."
      ],
      correct: 0,
      explanation: "Meaning and function provide the foundation; form and retrieval build on them."
    };
  }

  const candidates = [
    ...available.filter((card) => card !== current).map((card) => card.body),
    "Choose only from the nearest word-for-word translation.",
    "Memorize one example as an unchangeable sentence and ignore the reusable pattern."
  ];
  const distractors = candidates
    .map((option) => String(option || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((option) => option !== current.body)
    .filter((option, index, list) => list.indexOf(option) === index)
    .slice(0, 2);

  return {
    question: `Which explanation matches “${current.title}”?`,
    options: [current.body, ...distractors],
    correct: 0,
    explanation: `${current.title}: ${current.body}`
  };
}
