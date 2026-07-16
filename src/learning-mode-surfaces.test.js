const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
const speakingStatusSource = fs.readFileSync(path.join(__dirname, "SpeakingRoundStatus.jsx"), "utf8");

test("quiet mode removes audio and speaking tabs from word practice", () => {
  const workspace = source.slice(source.indexOf("function WordsWorkspace"), source.indexOf("function PlayWorkspace"));
  assert.match(workspace, /const quiet = dashboard\?\.user\?\.learningMode === "quiet"/);
  assert.match(workspace, /quiet && initialTab !== "memory" \? "memory" : initialTab/);
  assert.match(workspace, /tabs=\{quiet \? \[/);
  const quietTabs = workspace.slice(workspace.indexOf("tabs={quiet ? ["), workspace.indexOf("] : ["));
  assert.doesNotMatch(quietTabs, /key: "audio"|key: "speaking"/);
});

test("German audio lookup does not save an English dictionary meaning", () => {
  const lookup = source.slice(source.indexOf("function PronunciationLookupView"), source.indexOf("const SPEAKING_LIBRARY"));
  assert.match(lookup, /if \(!german\) \{[\s\S]*?\/api\/pronunciation\/vocabulary/);
  assert.match(lookup, /!german && meanings\.length/);
  assert.match(lookup, /!german && !!result\.wordByWord/);
});

test("speaking controls receive the selected native language", () => {
  const speaking = source.slice(source.indexOf("function SpeakingLabView"), source.indexOf("function NaturalLearningHome"));
  assert.match(speaking, /<SpeakCheck[^>]+nativeLanguage=\{nativeLanguage\}/);
  assert.match(source, /function SpeakCheck\([^)]*nativeLanguage = "de"/);
});

test("speaking practice uses bounded mastery rounds with automatic progression", () => {
  const speaking = source.slice(source.indexOf("function SpeakingLabView"), source.indexOf("function NaturalLearningHome"));
  assert.match(speaking, /buildSpeakingPracticeDeck\(SPEAKING_LIBRARY\.filter/);
  assert.match(speaking, /speakingMasteryProgress\(deck, masteredSpanish\)/);
  assert.match(speaking, /nextUnmasteredSpeakingIndex\(deck, index, nextMastered\)/);
  assert.match(speaking, /<SpeakingRoundComplete german=\{german\} onNewRound=\{reshuffle\}/);
  assert.match(speaking, /if \(mode !== "custom"\) setDeck/);
});

test("speaking practice defaults to content the learner has already encountered", () => {
  const speaking = source.slice(source.indexOf("function SpeakingLabView"), source.indexOf("function NaturalLearningHome"));
  assert.match(speaking, /useState\("learned"\)/);
  assert.match(speaking, /api\("\/api\/speaking\/practice"\)/);
  assert.match(speaking, /learnedSpeakingItems\(/);
  assert.match(speaking, /<SpeakingPracticeGuidance mode=\{mode\} german=\{german\}/);
  assert.match(speaking, /<SpeakingPracticeEmpty mode=\{mode\} german=\{german\} loading=\{savedLoading\}/);
  assert.match(speakingStatusSource, /Neue Inhalte lernst du weiterhin im geführten Kurs/);
  assert.match(speakingStatusSource, /Freie Zusatzübung/);
  assert.match(speakingStatusSource, /if \(loading \|\| mode === "custom"\) return null/);
});
