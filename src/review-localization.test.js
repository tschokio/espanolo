const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");

test("review sessions propagate the selected native language", () => {
  assert.match(source, /<ReviewQueueView[^>]+nativeLanguage=\{user\.nativeLanguage \|\| "de"\}/);
  assert.match(source, /<PracticePanel[\s\S]*?nativeLanguage=\{nativeLanguage\}[\s\S]*?source="REVIEW"/);
  assert.match(source, /<ReviewWordQuizCard[\s\S]*?nativeLanguage=\{nativeLanguage\}/);
});

test("German word review uses authored German meanings", () => {
  const reviewCard = source.slice(source.indexOf("function ReviewWordQuizCard"), source.indexOf("function SettingsView"));
  assert.match(reviewCard, /localizedWordMeaning\(word, nativeLanguage\)/);
  assert.match(reviewCard, /Deutsche Bedeutung → Spanisch/);
  assert.doesNotMatch(reviewCard, />\{word\.english\}</);
});
