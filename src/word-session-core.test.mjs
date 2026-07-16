import assert from "node:assert/strict";
import test from "node:test";

import { buildWordSession, queueMissedWord, wordContextPrompt } from "./word-session-core.mjs";

const word = (id, learned = false, imageKey = "") => ({
  id,
  spanish: `palabra-${id}`,
  example: `Uso palabra-${id} aquí.`,
  imageKey,
  review: { due: true, correctCount: learned ? 2 : 0, state: learned ? "REVIEW" : "NEW", wrongCount: 0 }
});
const group = (words) => ({ id: "group", words });
const stableOptions = { sessionSize: 8, questionStyle: "mixed", random: () => 0.999999 };

test("a full deck of new words progresses from introduction to retrieval in one session", () => {
  const words = Array.from({ length: 10 }, (_, index) => word(String(index + 1), false, index % 2 ? `image-${index}` : ""));
  const items = buildWordSession("learn", [group(words)], [group(words)], stableOptions);
  const firstModeByWord = new Map();
  for (const item of items) {
    if (!firstModeByWord.has(item.wordId)) firstModeByWord.set(item.wordId, item.mode);
  }

  assert.equal(items.length, 8);
  assert.ok([...firstModeByWord.values()].every((mode) => mode === "flashcard"));
  assert.ok(items.some((item) => item.mode === "recognition" || item.mode === "picture"));
  assert.ok(items.some((item) => item.mode === "typing"));
  assert.ok(items.some((item) => item.mode === "context"));
  assert.deepEqual(new Set(items.map((item) => item.phase)), new Set(["introduce", "recognize", "retrieve", "apply"]));
  assert.ok(new Set(items.map((item) => item.wordId)).size < items.length, "new words need a delayed second encounter");
});

test("known words skip introduction while new words receive a complete learning cycle", () => {
  const newWords = [word("new-1"), word("new-2", false, "image")];
  const knownWords = Array.from({ length: 8 }, (_, index) => word(`known-${index + 1}`, true));
  const words = [...newWords, ...knownWords];
  const items = buildWordSession("learn", [group(words)], [group(words)], stableOptions);

  const introducedWords = newWords.filter((newWord) => items.some((item) => item.wordId === newWord.id));
  assert.equal(introducedWords.length, 1, "a standard mixed session should introduce one new word deeply alongside retrieval");
  for (const newWord of introducedWords) {
    const modes = items.filter((item) => item.wordId === newWord.id).map((item) => item.mode);
    assert.equal(modes[0], "flashcard");
    assert.deepEqual(modes, ["flashcard", "recognition", "typing", "context"]);
  }
  assert.ok(items.some((item) => item.wordId.startsWith("known-") && item.mode !== "flashcard"));
});

test("an explicit typing preference still introduces an unseen word before testing it", () => {
  const words = [word("new-1"), word("new-2"), word("new-3")];
  const items = buildWordSession("learn", [group(words)], [group(words)], { sessionSize: 5, questionStyle: "typing", random: () => 0.999999 });
  const firstByWord = new Map();
  for (const item of items) {
    if (!firstByWord.has(item.wordId)) firstByWord.set(item.wordId, item.mode);
  }

  assert.ok([...firstByWord.values()].every((mode) => mode === "flashcard"));
  assert.ok(items.some((item) => item.mode === "typing"));
});

test("memory sessions exclude untouched words and keep picture fallback usable", () => {
  const untouched = word("new");
  const learned = word("known", true);
  const items = buildWordSession("memory", [group([untouched, learned])], [group([untouched, learned])], { sessionSize: 4, questionStyle: "picture", random: () => 0.999999 });

  assert.deepEqual(items.map((item) => item.wordId), ["known"]);
  assert.equal(items[0].mode, "recognition");
});

test("context prompts hide only the complete learned expression", () => {
  assert.deepEqual(wordContextPrompt({ spanish: "la manzana", example: "La manzana es roja." }), {
    example: "La manzana es roja.",
    target: "la manzana",
    answer: "la manzana",
    masked: "_____ es roja."
  });
  assert.equal(wordContextPrompt({ spanish: "el doctor", example: "Necesito un doctor." }).answer, "doctor");
  assert.equal(wordContextPrompt({ spanish: "¿cuánto cuesta?", example: "¿Cuánto cuesta el pan?" }).answer, "cuánto cuesta");
  assert.equal(wordContextPrompt({ spanish: "en", example: "Tengo pan." }), null, "short words must not match inside another word");
  assert.equal(wordContextPrompt({ spanish: "hola", example: "hola" }), null, "a bare duplicate is not a sentence context");
  assert.equal(wordContextPrompt({ spanish: "la biblioteca", example: "The library is open." }), null, "English text must never become a Spanish context prompt");
});

test("a missed final word returns once without duplicating an already planned encounter", () => {
  const items = [
    { key: "one", wordId: "one", mode: "recognition", phase: "recognize" },
    { key: "two", wordId: "two", mode: "context", phase: "apply" }
  ];
  const queued = queueMissedWord(items, 1);
  assert.equal(queued.length, 3);
  assert.deepEqual(queued[2], { key: "two-retry", wordId: "two", mode: "context", phase: "apply", retry: true });
  assert.equal(queueMissedWord(queued, 2).length, 3, "the retry must not create an endless loop");

  const alreadyPlanned = [...items, { key: "one-later", wordId: "one", mode: "typing" }];
  assert.equal(queueMissedWord(alreadyPlanned, 0), alreadyPlanned);
});
