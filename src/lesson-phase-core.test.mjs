import assert from "node:assert/strict";
import test from "node:test";
import { lessonSessionPhaseIndex, lessonSessionPhaseStates } from "./lesson-phase-core.mjs";

test("focused lesson steps map into a stable four-phase learning sequence", () => {
  for (const type of ["overview", "guide", "sound-lab", "vocabulary", "reading", "pattern"]) assert.equal(lessonSessionPhaseIndex(type), 0);
  assert.equal(lessonSessionPhaseIndex("learn"), 1);
  for (const type of ["context-bridge", "consolidation", "practice-preview"]) assert.equal(lessonSessionPhaseIndex(type), 2);
  assert.equal(lessonSessionPhaseIndex("practice"), 3);
});

test("phase states expose completed, current, and upcoming stages in German or English", () => {
  assert.deepEqual(lessonSessionPhaseStates("context-bridge", "de").map(({ label, state }) => [label, state]), [
    ["Verstehen", "complete"],
    ["Aufbauen", "complete"],
    ["Verbinden", "active"],
    ["Anwenden", "upcoming"]
  ]);
  assert.equal(lessonSessionPhaseStates("practice", "en").at(-1).label, "Apply");
});
