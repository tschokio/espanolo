export function normalizeSpanishOrthography(value, { ignoreAcuteAccents = false } = {}) {
  let text = String(value || "").normalize("NFD");
  if (ignoreAcuteAccents) text = text.replace(/\u0301/g, "");
  return text
    .normalize("NFC")
    .toLocaleLowerCase("es")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function compareSpanishOrthography(submitted, expected) {
  const submittedStrict = normalizeSpanishOrthography(submitted);
  const expectedStrict = normalizeSpanishOrthography(expected);
  const submittedWithoutAcute = normalizeSpanishOrthography(submitted, { ignoreAcuteAccents: true });
  const expectedWithoutAcute = normalizeSpanishOrthography(expected, { ignoreAcuteAccents: true });
  const contentMatch = Boolean(submittedWithoutAcute) && submittedWithoutAcute === expectedWithoutAcute;

  return {
    contentMatch,
    exactSpelling: contentMatch && submittedStrict === expectedStrict,
    accentWarning: contentMatch && submittedStrict !== expectedStrict
  };
}
