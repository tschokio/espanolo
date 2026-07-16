export const LESSON_SESSION_PHASES = Object.freeze([
  { key: "understand", de: "Verstehen", en: "Understand" },
  { key: "build", de: "Aufbauen", en: "Build" },
  { key: "connect", de: "Verbinden", en: "Connect" },
  { key: "apply", de: "Anwenden", en: "Apply" }
]);

const PHASE_BY_STEP_TYPE = Object.freeze({
  overview: "understand",
  guide: "understand",
  "sound-lab": "understand",
  vocabulary: "understand",
  reading: "understand",
  pattern: "understand",
  learn: "build",
  "context-bridge": "connect",
  consolidation: "connect",
  "practice-preview": "connect",
  practice: "apply"
});

export function lessonSessionPhaseIndex(stepType) {
  const key = PHASE_BY_STEP_TYPE[String(stepType || "")] || "understand";
  return Math.max(0, LESSON_SESSION_PHASES.findIndex((phase) => phase.key === key));
}

export function lessonSessionPhaseStates(stepType, nativeLanguage = "de") {
  const activeIndex = lessonSessionPhaseIndex(stepType);
  return LESSON_SESSION_PHASES.map((phase, index) => ({
    ...phase,
    label: nativeLanguage === "de" ? phase.de : phase.en,
    state: index < activeIndex ? "complete" : index === activeIndex ? "active" : "upcoming"
  }));
}
