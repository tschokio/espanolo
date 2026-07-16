export const SPANISH_CHARACTERS = Object.freeze(["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"]);
export const SPANISH_CHARACTERS_UPPER = Object.freeze(["Á", "É", "Í", "Ó", "Ú", "Ü", "Ñ", "¿", "¡"]);

export function insertSpanishCharacter(value, character, selectionStart, selectionEnd) {
  const text = String(value || "");
  const start = Math.max(0, Math.min(text.length, Number.isFinite(selectionStart) ? selectionStart : text.length));
  const end = Math.max(start, Math.min(text.length, Number.isFinite(selectionEnd) ? selectionEnd : start));
  const inserted = String(character || "");
  return {
    value: `${text.slice(0, start)}${inserted}${text.slice(end)}`,
    caret: start + inserted.length
  };
}
