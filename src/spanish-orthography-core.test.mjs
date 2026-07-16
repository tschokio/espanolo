import assert from "node:assert/strict";
import test from "node:test";

import { compareSpanishOrthography, normalizeSpanishOrthography } from "./spanish-orthography-core.mjs";

test("Spanish comparison treats a missing acute accent as a graded writing warning", () => {
  assert.deepEqual(compareSpanishOrthography("Tu estas aqui", "Tú estás aquí."), {
    contentMatch: true,
    exactSpelling: false,
    accentWarning: true
  });
  assert.equal(compareSpanishOrthography("Tú estás aquí", "Tú estás aquí.").exactSpelling, true);
});

test("Spanish comparison preserves eñe and diaeresis while ignoring punctuation and case", () => {
  assert.equal(compareSpanishOrthography("ANO", "año").contentMatch, false);
  assert.equal(compareSpanishOrthography("PINGUINO", "pingüino").contentMatch, false);
  assert.equal(normalizeSpanishOrthography("  ¡AÑO! "), "año");
});
