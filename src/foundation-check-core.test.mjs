import assert from "node:assert/strict";
import test from "node:test";

import { balanceFoundationQuickCheck, buildEnglishFoundationQuickCheck } from "./foundation-check-core.mjs";

const sourceCheck = {
  question: "Welche Aussage stimmt?",
  options: ["Richtig", "Ablenkung A", "Ablenkung B"],
  correct: 0,
  explanation: "Die erste Aussage ist fachlich richtig."
};

test("foundation checks rotate the correct position across consecutive concept cards", () => {
  const checks = [0, 1, 2].map((cardIndex) => balanceFoundationQuickCheck(sourceCheck, 2, cardIndex));

  assert.deepEqual(checks.map((check) => check.correct), [2, 0, 1]);
  for (const check of checks) {
    assert.equal(check.options[check.correct], "Richtig");
    assert.deepEqual([...check.options].sort(), [...sourceCheck.options].sort());
  }
});

test("foundation check balancing is stable, non-mutating, and supports authored nonzero answers", () => {
  const authored = { ...sourceCheck, options: ["A", "Richtig", "B"], correct: 1 };
  const first = balanceFoundationQuickCheck(authored, 1, 1);
  const second = balanceFoundationQuickCheck(authored, 1, 1);

  assert.deepEqual(first, second);
  assert.equal(first.correct, 2);
  assert.equal(first.options[first.correct], "Richtig");
  assert.deepEqual(authored.options, ["A", "Richtig", "B"]);
  assert.equal(authored.correct, 1);
});

test("foundation check balancing safely normalizes offsets", () => {
  assert.equal(balanceFoundationQuickCheck(sourceCheck, -1, 0).correct, 2);
  assert.deepEqual(balanceFoundationQuickCheck({ question: "Leer" }, 4, 2).options, []);
});

test("optional English builds a concept-specific discrimination check", () => {
  const cards = [
    { title: "Identity uses ser", body: "Use ser to classify identity and origin." },
    { title: "State uses estar", body: "Use estar for a current state or location." },
    { title: "Match the person", body: "Choose the verb form that matches the person." }
  ];
  const check = buildEnglishFoundationQuickCheck(cards, 1);

  assert.equal(check.question, "Which explanation matches “State uses estar”?");
  assert.equal(check.options[check.correct], cards[1].body);
  assert.equal(check.options.length, 3);
  assert.equal(new Set(check.options).size, 3);
  assert.ok(check.options.includes(cards[0].body));
  assert.match(check.explanation, /State uses estar/);
});

test("optional English checks remain usable for a single-card foundation", () => {
  const check = buildEnglishFoundationQuickCheck([{ title: "Negation", body: "Put no before the conjugated verb." }], 0);
  assert.equal(check.options.length, 3);
  assert.equal(check.options[0], "Put no before the conjugated verb.");
  assert.match(check.options[1], /word-for-word/);
});
