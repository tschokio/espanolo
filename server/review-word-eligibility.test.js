const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");

test("the main review queue includes only vocabulary introduced in the Words tab", () => {
  const reviewBuilder = source.slice(
    source.indexOf("async function buildDueReview"),
    source.indexOf("function recentAchievementFromLessons")
  );

  assert.match(reviewBuilder, /activityMode: "flashcard"/);
  assert.match(reviewBuilder, /word: wordsTabIntroductionWhere/);
  assert.match(reviewBuilder, /introducedWordIds\.has\(spot\.word\.id\)/);
});

test("word-deck status ignores review records created outside the Words tab", () => {
  const wordsRoute = source.slice(
    source.indexOf('app.get(\n  "/api/words"'),
    source.indexOf('app.post(\n  "/api/words/:id/attempt"')
  );

  assert.match(wordsRoute, /where: \{ userId: req\.user\.id, activityMode: "flashcard" \}/);
  assert.match(wordsRoute, /const introducedInWords = Boolean\(word\.attempts\[0\]\)/);
  assert.match(wordsRoute, /review: introducedInWords && review/);
  assert.match(wordsRoute, /new: words\.filter\(\(word\) => !word\.introducedInWords\)\.length/);
});
