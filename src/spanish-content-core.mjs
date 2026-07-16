import { looksLikeEnglishLearningText } from "./exercise-question-localization.mjs";

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function spanishLearningExample(value, fallback = "") {
  const example = compact(value);
  if (example && !looksLikeEnglishLearningText(example)) return example;

  const spanishFallback = compact(fallback);
  return spanishFallback && !looksLikeEnglishLearningText(spanishFallback) ? spanishFallback : "";
}

export function withSpanishLearningExample(item = {}, fallback = "") {
  return {
    ...item,
    example: spanishLearningExample(item.example, fallback)
  };
}
