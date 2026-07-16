const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const appSource = readFileSync(path.join(__dirname, "App.jsx"), "utf8");
const conversationSource = readFileSync(path.join(__dirname, "ConversationWorkspace.jsx"), "utf8");
const barSource = readFileSync(path.join(__dirname, "SpanishCharacterBar.jsx"), "utf8");
const vocabularyLabSource = readFileSync(path.join(__dirname, "LessonVocabularyLab.jsx"), "utf8");

test("the Spanish character toolbar preserves focus and restores the caret", () => {
  assert.match(barSource, /role="toolbar"/);
  assert.match(barSource, /onMouseDown=\{\(event\) => event\.preventDefault\(\)\}/);
  assert.match(barSource, /activeInput\?\.focus\(\)/);
  assert.match(barSource, /setSelectionRange\?\.\(result\.caret, result\.caret\)/);
  assert.match(barSource, /nativeLanguage === "de"/);
});

test("core lesson, practice, vocabulary, and review typing expose Spanish characters", () => {
  const toolbarUses = appSource.match(/<SpanishCharacterBar/g) || [];
  assert.ok(toolbarUses.length >= 10, `expected Spanish input support across core learning surfaces, found ${toolbarUses.length}`);
  assert.match(appSource, /function A1ContextBridgeLab[\s\S]*?<SpanishCharacterBar value=\{answer\}/);
  assert.match(appSource, /function LessonSentenceStudy[\s\S]*?<SpanishCharacterBar value=\{answer\}/);
  assert.match(appSource, /function PracticePanel[\s\S]*?isWritingPrompt[\s\S]*?<SpanishCharacterBar value=\{answer\}/);
  assert.match(appSource, /function ReviewWordQuizCard[\s\S]*?<SpanishCharacterBar value=\{answer\}/);
  assert.match(appSource, /function LessonReadingLab[\s\S]*?<SpanishCharacterBar value=\{summary\}/);
  assert.match(appSource, /function PronunciationLookupView[\s\S]*?<SpanishCharacterBar value=\{query\}/);
  assert.match(appSource, /function SpeakingLabView[\s\S]*?<SpanishCharacterBar value=\{customText\}/);
  assert.match(appSource, /SpanishCharacterComponent=\{SpanishCharacterBar\}/);
  assert.match(vocabularyLabSource, /SpanishCharacterComponent value=\{answer\}[\s\S]*?inputRef=\{answerInputRef\}/);
});

test("an accent warning stays correct but receives an earlier orthography review", () => {
  assert.match(appSource, /CORRECT_WITH_ACCENT_WARNING[\s\S]*?Schreibweise braucht noch einen Akzent/);
  assert.match(appSource, /Dieser Abruf kommt deshalb bewusst früher zurück/);
});

test("authored conversation typing shares the same cursor-aware Spanish toolbar", () => {
  assert.match(conversationSource, /ref=\{inputRef\}/);
  assert.match(conversationSource, /<SpanishCharacterBar value=\{answer\}[\s\S]*?inputRef=\{inputRef\}/);
});
