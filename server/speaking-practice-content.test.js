const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const serverSource = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");

test("speaking practice is sourced from introduced words and started lessons", () => {
  const helper = serverSource.slice(
    serverSource.indexOf("async function learnedSpeakingContent"),
    serverSource.indexOf("function categoryLabel")
  );

  assert.match(helper, /prisma\.wordReview\.findMany/);
  assert.match(helper, /slug: \{ not: "audio-lab-saved" \}/);
  assert.match(helper, /prisma\.userLessonProgress\.findMany/);
  assert.match(helper, /completedExercises: \{ gt: 0 \}/);
  assert.match(helper, /sentences: \{ orderBy: \{ id: "asc" \} \}/);
  assert.match(helper, /seenSpanish/);
});

test("the authenticated speaking endpoint returns learned content separately from audio-lab saves", () => {
  const route = serverSource.slice(
    serverSource.indexOf('"/api/speaking/practice"'),
    serverSource.indexOf('app.delete(\n  "/api/pronunciation/vocabulary/:wordId"')
  );

  assert.match(route, /requireAuth/);
  assert.match(route, /learnedSpeakingContent\(req\.user\.id, req\.query\.limit\)/);
});
