import assert from "node:assert/strict";
import test from "node:test";

import { dailyPlanDiagnosticChips, dailyPlanExplanation, naturalLearningHomeCopy } from "./daily-learning-core.mjs";

test("German daily guidance lets fresh material settle and promises only familiar reinforcement", () => {
  const copy = naturalLearningHomeCopy({ german: true, primaryTargetType: "challenge", freshConsolidation: true });
  assert.equal(copy.title, "Ein gutes Lernpaket ist für heute genug");
  assert.match(copy.intro, /Abstand/);
  assert.match(dailyPlanExplanation({ german: true, targetType: "challenge", freshConsolidation: true }), /ausschließlich auf Bekanntes/);
});

test("optional English retains the same lesson, review, and reinforcement states", () => {
  assert.equal(naturalLearningHomeCopy({ german: false, primaryTargetType: "review" }).title, "Strengthen what is due today");
  assert.equal(naturalLearningHomeCopy({ german: false, primaryTargetType: "lesson", hasPlannedLesson: true, nextLessonTitle: "Identity" }).title, "Understand and use Spanish: Identity");
});

test("German daily diagnosis explains recurring and overdue retrieval priority", () => {
  assert.match(dailyPlanExplanation({
    german: true,
    targetType: "review",
    recurringMistakeCount: 1,
    maxMistakeOccurrences: 4,
    reasonCode: "recurring_mistake",
    weakConcept: { labelDe: "ser und estar" }
  }), /„ser und estar“[\s\S]*4-mal unsicher/);
  assert.match(dailyPlanExplanation({
    german: true,
    targetType: "review",
    oldestOverdueDays: 5,
    reasonCode: "overdue_review"
  }), /seit 5 Tagen fällig/);
});

test("daily plan chips expose only actionable learner-facing evidence", () => {
  assert.deepEqual(dailyPlanDiagnosticChips({
    german: true,
    diagnosis: { recurringMistakeCount: 1, oldestOverdueDays: 4, lessonProgress: 35 }
  }), ["1 wiederkehrendes Muster", "ältester Abruf 4 Tage überfällig", "Lernpaket zu 35 % begonnen"]);
  assert.deepEqual(dailyPlanDiagnosticChips({
    german: true,
    diagnosis: { recurringMistakeCount: 2, weakConcept: { labelDe: "ser und estar" } }
  }), ["Schwerpunkt: ser und estar"]);
  assert.deepEqual(dailyPlanDiagnosticChips({ german: true, diagnosis: {} }), []);
});
