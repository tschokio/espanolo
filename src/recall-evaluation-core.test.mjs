import assert from "node:assert/strict";
import test from "node:test";

import { evaluateRecallSummary, recallContentWords, recallTokens } from "./recall-evaluation-core.mjs";

test("recall comparison ignores accents, punctuation, and frequent function words", () => {
  assert.deepEqual(recallTokens("¡La reunión será más tarde!"), ["la", "reunion", "sera", "mas", "tarde"]);
  assert.deepEqual(recallContentWords("La reunión será más tarde y cambia de sala."), ["reunion", "sera", "tarde", "cambia", "sala"]);
});

test("recall comparison recognizes several shared Spanish content signals", () => {
  const result = evaluateRecallSummary(
    "La reunión cambia de hora y será en otra sala.",
    "La reunión será más tarde y tendrá lugar en una sala distinta."
  );
  assert.equal(result.effortEnough, true);
  assert.equal(result.signal, "strong");
  assert.ok(result.matched.includes("reunion"));
  assert.ok(result.matched.includes("sera"));
});

test("recall comparison rejects token gestures without pretending to score semantics", () => {
  const result = evaluateRecallSummary("sí", "La visita se aplaza por la lluvia.");
  assert.equal(result.effortEnough, false);
  assert.equal(result.signal, "low");
  assert.equal(result.wordCount, 1);
});
