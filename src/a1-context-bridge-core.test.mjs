import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import { buildA1ContextBridge, shouldBuildA1ContextBridge } from "./a1-context-bridge-core.mjs";

const lesson = {
  id: "travel-1",
  slug: "a1-find-the-station",
  cefrLevel: "A1",
  theme: "Travel",
  sentences: [
    { id: "s1", spanish: "¿Dónde está la estación?", english: "Where is the station?" },
    { id: "s2", spanish: "Está al lado del hotel.", english: "It is next to the hotel." },
    { id: "s3", spanish: "Siga todo recto.", english: "Go straight ahead." }
  ]
};

test("A1 context bridges turn an authored question and answer into comprehension plus recall", () => {
  const meanings = {
    "Where is the station?": "Wo ist der Bahnhof?",
    "It is next to the hotel.": "Er ist neben dem Hotel.",
    "Go straight ahead.": "Gehen Sie geradeaus."
  };
  const bridge = buildA1ContextBridge(lesson, (sentence) => meanings[sentence.english]);

  assert.equal(bridge.dialogue, true);
  assert.deepEqual(bridge.lines.map((line) => line.spanish), ["¿Dónde está la estación?", "Está al lado del hotel."]);
  assert.equal(bridge.options.length, 3);
  assert.equal(bridge.options.filter((option) => option.correct).length, 1);
  assert.equal(bridge.recallTarget.spanish, "Está al lado del hotel.");
  assert.equal(bridge.recallTarget.sentenceIndex, 1);
});

test("context bridges stay out of reviews, checkpoints, sound lessons, and lessons with authored input", () => {
  assert.equal(shouldBuildA1ContextBridge(lesson, { scheduledReview: true }), false);
  assert.equal(shouldBuildA1ContextBridge({ ...lesson, isCheckpoint: true }), false);
  assert.equal(shouldBuildA1ContextBridge({ ...lesson, theme: "Sound Foundation" }), false);
  assert.equal(shouldBuildA1ContextBridge({ ...lesson, readingJson: { paragraphs: ["Texto."] } }), false);
  assert.equal(shouldBuildA1ContextBridge({ ...lesson, cefrLevel: "A2" }), false);
});

test("a non-dialogue bridge still connects two related statements without inventing content", () => {
  const bridge = buildA1ContextBridge({
    ...lesson,
    id: "identity-1",
    sentences: [
      { spanish: "Soy estudiante.", english: "I am a student." },
      { spanish: "Soy de Berlín.", english: "I am from Berlin." },
      { spanish: "Trabajo en un hotel.", english: "I work in a hotel." }
    ]
  }, (sentence) => sentence.english);

  assert.equal(bridge.dialogue, false);
  assert.deepEqual(bridge.lines.map((line) => line.spanish), ["Soy estudiante.", "Soy de Berlín."]);
  assert.equal(bridge.options.every((option) => !option.text.includes("undefined")), true);
});

test("every eligible published A1 lesson produces a complete bridge from authored material", async () => {
  const require = createRequire(import.meta.url);
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { cefrLevel: "A1", isPublished: true },
      include: { sentences: true }
    });
    const eligible = lessons
      .map((item) => ({ ...item, isCheckpoint: /checkpoint/i.test(`${item.slug} ${item.theme}`) }))
      .filter((item) => shouldBuildA1ContextBridge(item));
    const bridges = eligible.map((item) => buildA1ContextBridge(item, (sentence) => sentence.english));

    assert.ok(eligible.length >= 70, `expected broad A1 coverage, found ${eligible.length}`);
    assert.equal(bridges.every(Boolean), true);
    assert.equal(bridges.every((bridge) => bridge.lines.length === 2 && bridge.options.length === 3), true);
    assert.equal(bridges.every((bridge) => bridge.options.filter((option) => option.correct).length === 1), true);
  } finally {
    await prisma.$disconnect();
  }
});
