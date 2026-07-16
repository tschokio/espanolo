import assert from "node:assert/strict";
import test from "node:test";

import { eligibleWordCatcherWords, wordCatcherCopy } from "./word-catcher-core.mjs";

test("word catch accepts only introduced course words with usable images", () => {
  const groups = [{ words: [
    { id: "learned", imageKey: "food:1", groupSlug: "food", review: { state: "LEARNING" } },
    { id: "new", imageKey: "food:2", groupSlug: "food", review: { state: "NEW" } },
    { id: "saved", imageKey: "food:3", groupSlug: "audio-lab-saved", review: { state: "LEARNING" } },
    { id: "no-image", imageKey: null, groupSlug: "food", review: { state: "MASTERED" } }
  ] }];

  assert.deepEqual(eligibleWordCatcherWords(groups).map((word) => word.id), ["learned"]);
});

test("word catch is German-first while preserving optional English", () => {
  const german = wordCatcherCopy();
  const english = wordCatcherCopy("en");

  assert.equal(german.score, "Punkte");
  assert.equal(german.round(2), "Runde 2: Fange die richtige Bedeutung.");
  assert.equal(english.score, "Score");
  assert.equal(english.round(2), "Round 2: catch the meaning.");
});
