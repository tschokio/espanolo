import assert from "node:assert/strict";
import test from "node:test";

import {
  SPEAKING_SESSION_SIZE,
  buildSpeakingPracticeDeck,
  learnedSpeakingItems,
  nextUnmasteredSpeakingIndex,
  speakingMasteryProgress,
  speakingModeTabs,
  speakingSessionAfterScore
} from "./speaking-practice-core.mjs";

const items = Array.from({ length: 20 }, (_, index) => ({ spanish: `frase ${index}`, english: `phrase ${index}` }));

test("speaking practice creates a focused unique round instead of an endless random deck", () => {
  const deck = buildSpeakingPracticeDeck([...items, items[0]], (values) => values.reverse());

  assert.equal(deck.length, SPEAKING_SESSION_SIZE);
  assert.equal(new Set(deck.map((item) => item.spanish)).size, SPEAKING_SESSION_SIZE);
  assert.equal(deck[0].spanish, "frase 19");
});

test("successful cards are skipped while uncertain cards remain in the round", () => {
  const deck = items.slice(0, 4);

  assert.equal(nextUnmasteredSpeakingIndex(deck, 0, ["frase 0", "frase 1"]), 2);
  assert.equal(nextUnmasteredSpeakingIndex(deck, 3, ["frase 0", "frase 3"]), 1);
  assert.equal(nextUnmasteredSpeakingIndex(deck, 2, deck.map((item) => item.spanish)), -1);
});

test("speaking progress counts only mastered cards from the active round", () => {
  const progress = speakingMasteryProgress(items.slice(0, 4), ["frase 0", "frase 0", "frase 2", "unknown"]);

  assert.deepEqual(progress, { mastered: 2, total: 4, percent: 50, complete: false });
  assert.equal(speakingMasteryProgress(items.slice(0, 2), ["frase 0", "frase 1"]).complete, true);
});

test("speaking session scoring separates clear, close, and missed attempts", () => {
  const clear = speakingSessionAfterScore({}, "success");
  const close = speakingSessionAfterScore(clear, "close");
  const missed = speakingSessionAfterScore(close, "fail");

  assert.deepEqual(missed, { perfect: 1, close: 1, missed: 1, streak: 0, bestStreak: 1 });
});

test("speaking mode labels explain the bounded round in German and optional English", () => {
  const german = speakingModeTabs({ german: true, wordCount: 140, sentenceCount: 84, savedCount: 3 });
  const english = speakingModeTabs({ german: false, wordCount: 140, sentenceCount: 84 });

  assert.equal(german[0].label, "Aus deinen Lektionen");
  assert.equal(german[1].label, "Freie Wörterrunde (12 aus 140)");
  assert.equal(german[4].label, "Gespeichert (3)");
  assert.equal(english[2].label, "Free sentence round (12 of 84)");
});

test("learned speaking content puts lesson sentences before introduced words", () => {
  const content = {
    sentences: [{ spanish: "Estoy aquí.", english: "I am here.", lessonId: "lesson-1" }],
    words: [{ id: "word-1", spanish: "la mesa", english: "table" }]
  };
  const result = learnedSpeakingItems(content, () => "Ich bin hier.", () => "der Tisch");

  assert.deepEqual(result, [
    { spanish: "Estoy aquí.", english: "I am here.", meaning: "Ich bin hier.", tag: "Learned", type: "sentence", sourceId: "lesson-1" },
    { spanish: "la mesa", english: "table", meaning: "der Tisch", tag: "Learned", type: "word", sourceId: "word-1" }
  ]);
});
