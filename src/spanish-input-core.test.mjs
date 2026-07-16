import test from "node:test";
import assert from "node:assert/strict";
import { SPANISH_CHARACTERS, SPANISH_CHARACTERS_UPPER, insertSpanishCharacter } from "./spanish-input-core.mjs";

test("Spanish character sets expose accents, diaeresis, eñe, and opening punctuation", () => {
  assert.deepEqual(SPANISH_CHARACTERS, ["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"]);
  assert.deepEqual(SPANISH_CHARACTERS_UPPER, ["Á", "É", "Í", "Ó", "Ú", "Ü", "Ñ", "¿", "¡"]);
});

test("Spanish characters insert at the caret and replace a selected range", () => {
  assert.deepEqual(insertSpanishCharacter("como estas", "ó", 1, 2), { value: "cómo estas", caret: 2 });
  assert.deepEqual(insertSpanishCharacter("Que tal", "¿", 0, 0), { value: "¿Que tal", caret: 1 });
});

test("Spanish character insertion safely falls back to the end of the value", () => {
  assert.deepEqual(insertSpanishCharacter("manan", "á"), { value: "mananá", caret: 6 });
  assert.deepEqual(insertSpanishCharacter("ano", "ñ", 1, 2), { value: "año", caret: 2 });
});
