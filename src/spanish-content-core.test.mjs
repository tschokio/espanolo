import test from "node:test";
import assert from "node:assert/strict";

import { spanishLearningExample, withSpanishLearningExample } from "./spanish-content-core.mjs";

test("learning examples keep Spanish and reject English source text", () => {
  assert.equal(spanishLearningExample("Estoy en la biblioteca."), "Estoy en la biblioteca.");
  assert.equal(spanishLearningExample("I am in the library."), "");
  assert.equal(spanishLearningExample("Students learn grammar with examples."), "");
  assert.equal(spanishLearningExample("Good sentences build confidence."), "");
  assert.equal(
    spanishLearningExample("I am in the library.", "Estoy en la biblioteca."),
    "Estoy en la biblioteca."
  );
});

test("lesson vocabulary cannot pass an English example into the learning phase", () => {
  assert.deepEqual(
    withSpanishLearningExample({ id: "library", spanish: "la biblioteca", example: "The library is open." }),
    { id: "library", spanish: "la biblioteca", example: "" }
  );
  assert.equal(
    withSpanishLearningExample({ spanish: "la biblioteca", example: "La biblioteca está abierta." }).example,
    "La biblioteca está abierta."
  );
});
