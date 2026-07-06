const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const seedSource = fs.readFileSync(path.join(root, "prisma", "seed.js"), "utf8");
const serverSource = fs.readFileSync(path.join(root, "server", "index.js"), "utf8");

function extractArraySection(source, declarationName) {
  const marker = `const ${declarationName} = [`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${declarationName} array should exist`);
  let depth = 0;
  for (let index = start + marker.length - 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Could not parse ${declarationName}`);
}

function collectObjectBlocks(arraySection) {
  const blocks = [];
  let depth = 0;
  let start = -1;
  for (let index = 0; index < arraySection.length; index += 1) {
    const char = arraySection[index];
    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        blocks.push(arraySection.slice(start, index + 1));
        start = -1;
      }
    }
  }
  return blocks;
}

function fieldValue(block, fieldName) {
  return new RegExp(`${fieldName}:\\s*["']([^"']+)["']`).exec(block)?.[1] || "";
}

function numberField(block, fieldName) {
  const value = new RegExp(`${fieldName}:\\s*(\\d+)`).exec(block)?.[1];
  return value ? Number(value) : null;
}

function arrayValues(block, fieldName) {
  const match = new RegExp(`${fieldName}:\\s*\\[([^\\]]*)\\]`).exec(block);
  if (!match) return [];
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((item) => item[1]);
}

const topics = new Set(collectObjectBlocks(extractArraySection(seedSource, "topics")).map((block) => fieldValue(block, "slug")));
const vocabularyGroups = new Set(
  collectObjectBlocks(extractArraySection(seedSource, "vocabularyGroups")).map((block) => fieldValue(block, "slug"))
);
const lessons = collectObjectBlocks(extractArraySection(seedSource, "lessons")).map((block) => ({
  slug: fieldValue(block, "slug"),
  title: fieldValue(block, "title"),
  theme: fieldValue(block, "theme"),
  topicSlug: fieldValue(block, "topicSlug"),
  vocabularySlugs: arrayValues(block, "vocabularySlugs"),
  order: numberField(block, "order"),
  isCheckpoint: /checkpoint/i.test(`${fieldValue(block, "theme")} ${fieldValue(block, "title")}`)
}));
const exercises = collectObjectBlocks(extractArraySection(seedSource, "exercises")).map((block) => ({
  slug: fieldValue(block, "slug"),
  lessonSlug: fieldValue(block, "lessonSlug"),
  topicSlug: fieldValue(block, "topicSlug"),
  type: /type:\s*ExerciseType\.([A-Z_]+)/.exec(block)?.[1] || "",
  hasCorrect: /correct:\s*["']/.test(block) || /correctWords:\s*\[/.test(block)
}));
const activeUnits = collectObjectBlocks(extractArraySection(serverSource, "curriculumUnits"))
  .filter((block) => !/planned:\s*true/.test(block))
  .map((block) => ({
    slug: fieldValue(block, "slug"),
    label: fieldValue(block, "label"),
    startOrder: numberField(block, "startOrder"),
    endOrder: numberField(block, "endOrder")
  }));

test("seed lesson order and references are valid", () => {
  const orderCounts = new Map();
  for (const lesson of lessons) {
    orderCounts.set(lesson.order, (orderCounts.get(lesson.order) || 0) + 1);
    assert.ok(topics.has(lesson.topicSlug), `${lesson.slug} references missing topic ${lesson.topicSlug}`);
    for (const groupSlug of lesson.vocabularySlugs) {
      assert.ok(vocabularyGroups.has(groupSlug), `${lesson.slug} references missing vocabulary group ${groupSlug}`);
    }
  }
  const duplicates = [...orderCounts.entries()].filter(([, count]) => count > 1);
  assert.deepEqual(duplicates, []);
});

test("active curriculum units have lessons and checkpoints", () => {
  for (const unit of activeUnits) {
    const unitLessons = lessons.filter((lesson) => lesson.order >= unit.startOrder && lesson.order <= unit.endOrder);
    assert.ok(unitLessons.length > 0, `${unit.label} has no lessons`);
    assert.ok(unitLessons.some((lesson) => lesson.isCheckpoint), `${unit.label} has no checkpoint lesson`);
  }
});

test("seed exercises reference existing lessons, topics, and answer specs", () => {
  const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
  for (const exercise of exercises) {
    assert.ok(lessonSlugs.has(exercise.lessonSlug), `${exercise.slug} references missing lesson ${exercise.lessonSlug}`);
    assert.ok(topics.has(exercise.topicSlug), `${exercise.slug} references missing topic ${exercise.topicSlug}`);
    assert.ok(exercise.hasCorrect, `${exercise.slug} is missing a correct answer spec`);
  }
});

test("checkpoint lessons have enough mixed checks", () => {
  const countByLesson = new Map();
  for (const exercise of exercises) {
    countByLesson.set(exercise.lessonSlug, (countByLesson.get(exercise.lessonSlug) || 0) + 1);
  }
  const underbuilt = lessons
    .filter((lesson) => lesson.isCheckpoint)
    .filter((lesson) => (countByLesson.get(lesson.slug) || 0) < 4)
    .map((lesson) => lesson.slug);
  assert.deepEqual(underbuilt, []);
});
