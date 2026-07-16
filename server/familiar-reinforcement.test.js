const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const serverSource = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");

test("dashboard reinforcement never falls forward into an unstarted lesson", () => {
  const dashboard = serverSource.slice(
    serverSource.indexOf("async function buildDashboard"),
    serverSource.indexOf("app.get(\n  \"/api/health\"")
  );

  assert.match(dashboard, /selectFamiliarPracticeTarget\(/);
  assert.match(dashboard, /correctAttempts\.map\(\(attempt\) => attempt\.exerciseId\)/);
  assert.match(dashboard, /practiceLesson = familiarTarget\?\.lesson \|\| null/);
  assert.match(dashboard, /publicExercise\(practiceExercise, practiceLesson\?\.sentences \|\| \[\]\)/);
  assert.doesNotMatch(dashboard, /currentLesson\.exercises\.find/);
  assert.doesNotMatch(dashboard, /currentLesson\.exercises\[0\]/);
});

test("daily planning lets a completed learning package settle before recommending more new material", () => {
  const planner = serverSource.slice(
    serverSource.indexOf("function buildDailyPlan"),
    serverSource.indexOf("async function updatePracticeStats")
  );

  assert.match(planner, /hasFreshLessonSession: completedLessonSessionToday\(lessons, now\)/);
  assert.match(planner, /kind: completedLessonSessionToday\(lessons, now\) \? "consolidation"/);
  assert.match(planner, /target: \{ type: "challenge" \}/);
  assert.match(planner, /secondaryTarget: currentLesson && mastery < 100/);
});

test("optional practice API and submission guard enforce introduced content on the server", () => {
  const route = serverSource.slice(
    serverSource.indexOf('"/api/practice/exercises"'),
    serverSource.indexOf('"/api/exercises/:id/attempt"')
  );
  const attemptRoute = serverSource.slice(
    serverSource.indexOf('"/api/exercises/:id/attempt"'),
    serverSource.indexOf('"/api/pronunciation"')
  );

  assert.match(route, /lesson: \{ progress: \{ some: \{ userId: req\.user\.id, mastery: \{ gte: 100 \}/);
  assert.match(route, /attempts: \{ some: \{ userId: req\.user\.id \} \}/);
  assert.match(attemptRoute, /\[AttemptSource\.GAME, AttemptSource\.CHALLENGE\]\.includes\(source\)/);
  assert.match(attemptRoute, /exerciseIsFamiliarForPractice/);
  assert.match(attemptRoute, /res\.status\(423\)/);
});

test("weekly challenges expose only familiar exercises and advance only after correctness", () => {
  const dashboard = serverSource.slice(
    serverSource.indexOf("async function buildDashboard"),
    serverSource.indexOf("app.get(\n  \"/api/health\"")
  );
  const progress = serverSource.slice(
    serverSource.indexOf("async function updateChallengeProgress"),
    serverSource.indexOf("async function buildDashboard")
  );

  assert.match(dashboard, /familiarExercises = authoredExercises\.filter/);
  assert.match(dashboard, /locked \? \[\] : familiarExercises\.map\(publicExercise\)/);
  assert.match(progress, /source !== AttemptSource\.CHALLENGE \|\| !isCorrect/);
  assert.match(serverSource, /updateChallengeProgress\(req\.user\.id, exercise\.id, source, wasCorrect\)/);
});

test("lesson detail access applies the progressive course gate to every lesson type", () => {
  const route = serverSource.slice(
    serverSource.indexOf('"/api/lessons/:id"'),
    serverSource.indexOf('"/api/lessons/:id/reinforcement-complete"')
  );

  assert.match(route, /syncAllPublishedLessonProgress\(req\.user\.id\)/);
  assert.match(route, /gatedSummary = lessonSummaries\.find/);
  assert.match(route, /if \(gatedSummary\?\.isLocked\)/);
  assert.doesNotMatch(route, /if \(isCheckpointLesson\(lesson\)\)/);
});

test("first lesson attempts cannot bypass the progressive course gate", () => {
  const route = serverSource.slice(
    serverSource.indexOf('"/api/exercises/:id/attempt"'),
    serverSource.indexOf('"/api/pronunciation"')
  );

  assert.match(route, /source === AttemptSource\.LESSON && !isCheckpointLesson\(exercise\.lesson\)/);
  assert.match(route, /if \(!existingProgress\)/);
  assert.match(route, /applyCheckpointLocksToSummaries\(syncedLessons\.map\(publicLessonSummary\)\)/);
  assert.match(route, /if \(gatedSummary\?\.isLocked\)/);
});
