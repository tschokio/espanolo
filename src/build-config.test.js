const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const configSource = fs.readFileSync(path.join(__dirname, "..", "vite.config.mjs"), "utf8");

test("production build caches stable learning content separately from the application shell", () => {
  assert.match(configSource, /course-sentence-meanings\.mjs/);
  assert.match(configSource, /learning-localization-core\.mjs/);
  assert.match(configSource, /word-localization-core\.mjs/);
  assert.match(configSource, /b2-word-localization\.mjs/);
  assert.match(configSource, /c1-c2-word-localization\.mjs/);
  assert.match(configSource, /speaking-library-localization\.mjs/);
  assert.match(configSource, /speaking-practice-core\.mjs/);
  assert.match(configSource, /SpeakingRoundStatus\.jsx/);
  assert.match(configSource, /word-catcher-core\.mjs/);
  assert.match(configSource, /daily-learning-core\.mjs/);
  assert.match(configSource, /conversation-core\.mjs/);
  assert.match(configSource, /lesson-pattern-core\.mjs/);
  assert.match(configSource, /recall-evaluation-core\.mjs/);
  assert.match(configSource, /foundation-card-localization\.mjs/);
  assert.match(configSource, /topic-remember-points\.mjs/);
  assert.match(configSource, /exercise-question-localization\.mjs/);
  assert.match(configSource, /model-sentence-recall-core\.mjs/);
  assert.match(configSource, /spanish-orthography-core\.mjs/);
  assert.match(configSource, /return "learning-content"/);
  assert.match(configSource, /MobileNavigation\.jsx/);
  assert.match(configSource, /return "ui-shell"/);
});
