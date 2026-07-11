const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const seedSource = fs.readFileSync(path.join(root, "prisma", "seed.js"), "utf8");
const serverSource = fs.readFileSync(path.join(root, "server", "index.js"), "utf8");
const packageConfig = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

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

function arrayFieldSection(block, fieldName) {
  const match = new RegExp(`${fieldName}:\\s*\\[`).exec(block);
  if (!match) return "";

  const start = match.index + match[0].lastIndexOf("[");
  let depth = 0;
  let quote = "";
  for (let index = start; index < block.length; index += 1) {
    const char = block[index];
    if (quote) {
      if (char === "\\") {
        index += 1;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) return block.slice(start, index + 1);
    }
  }
  return "";
}

function sentenceSpanishValues(block) {
  const sentences = arrayFieldSection(block, "sentences");
  return [...sentences.matchAll(/\[\s*"((?:\\.|[^"\\])*)"\s*,/g)].map((match) => JSON.parse(`"${match[1]}"`));
}

function vocabularySpanishValues(block) {
  const words = arrayFieldSection(block, "words");
  return [...words.matchAll(/\[\s*"((?:\\.|[^"\\])*)"\s*,/g)].map((match) => JSON.parse(`"${match[1]}"`));
}

function normalizeSeedText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function exerciseAnswer(block) {
  const direct = fieldValue(block, "correct");
  return direct || arrayValues(block, "correctWords").join(" ");
}

function hasContextualPrompt(value) {
  return (String(value || "").match(/\p{L}+/gu) || []).length >= 2;
}

const lessonBlocks = collectObjectBlocks(extractArraySection(seedSource, "lessons"));
const exerciseBlocks = collectObjectBlocks(extractArraySection(seedSource, "exercises"));

const topics = new Set(collectObjectBlocks(extractArraySection(seedSource, "topics")).map((block) => fieldValue(block, "slug")));
const vocabularyGroupBlocks = collectObjectBlocks(extractArraySection(seedSource, "vocabularyGroups"));
const vocabularyGroups = new Set(vocabularyGroupBlocks.map((block) => fieldValue(block, "slug")));
const lessons = lessonBlocks.map((block) => ({
  block,
  slug: fieldValue(block, "slug"),
  title: fieldValue(block, "title"),
  theme: fieldValue(block, "theme"),
  topicSlug: fieldValue(block, "topicSlug"),
  vocabularySlugs: arrayValues(block, "vocabularySlugs"),
  order: numberField(block, "order"),
  isCheckpoint: /checkpoint/i.test(`${fieldValue(block, "theme")} ${fieldValue(block, "title")}`)
}));
const exercises = exerciseBlocks.map((block) => ({
  block,
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

test("words mode includes expanded numbers, colors, and essential words", () => {
  const wordsFor = (slug) => {
    const group = vocabularyGroupBlocks.find((block) => fieldValue(block, "slug") === slug);
    assert.ok(group, `${slug} vocabulary group should exist`);
    return new Set(vocabularySpanishValues(group));
  };
  const numbersAndColors = wordsFor("numbers-and-colors");
  const essentials = wordsFor("essential-words");

  for (const word of ["cero", "diez", "once", "quince", "veinte", "rojo", "azul", "naranja", "morado", "gris"]) {
    assert.ok(numbersAndColors.has(word), `numbers-and-colors should include ${word}`);
  }
  for (const word of ["sí", "no", "hoy", "mañana", "bien", "pero", "con", "qué", "dónde", "por qué"]) {
    assert.ok(essentials.has(word), `essential-words should include ${word}`);
  }
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

test("the standard seed command reconciles supplemental lesson practice", () => {
  const command = packageConfig.scripts?.["db:seed"] || "";

  assert.match(command, /prisma\/seed\.js/, "db:seed should update the authored lesson content");
  assert.match(command, /prisma\/seed-lesson-practice\.js/, "db:seed should remove stale generated questions and add scoped practice");
  assert.match(packageConfig.prisma?.seed || "", /db:seed/, "Prisma should use the standard reconciled seed command");
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

test("zero pronoun lesson and checks stay scoped to taught pronouns", () => {
  const lesson = lessons.find((item) => item.slug === "zero-pronouns");
  assert.ok(lesson, "zero-pronouns lesson should exist");
  for (const pronoun of ["yo", "tú", "él", "ella"]) {
    assert.match(lesson.block, new RegExp(`["']${pronoun}`, "i"), `zero-pronouns should teach ${pronoun}`);
  }
  assert.doesNotMatch(lesson.block, /nosotros/i, "zero-pronouns should not teach nosotros");

  const lessonExercises = exercises.filter((exercise) => exercise.lessonSlug === "zero-pronouns");
  assert.ok(lessonExercises.length >= 6, "zero-pronouns should have enough focused checks");
  for (const exercise of lessonExercises) {
    assert.doesNotMatch(exercise.block, /nosotros/i, `${exercise.slug} should not quiz nosotros`);
  }
});

test("early ser and estar lessons teach enough contextual examples before practice", () => {
  for (const slug of ["zero-soy", "zero-estoy", "zero-es-esta", "ser-vs-estar-basics"]) {
    const lesson = lessons.find((item) => item.slug === slug);
    assert.ok(lesson, `${slug} lesson should exist`);
    const contextualExamples = sentenceSpanishValues(lesson.block).filter(
      (sentence) => (sentence.match(/\p{L}+/gu) || []).length >= 2
    );
    const minimumExamples = slug === "ser-vs-estar-basics" ? 6 : 5;
    assert.ok(
      contextualExamples.length >= minimumExamples,
      `${slug} should teach at least ${minimumExamples} contextual Spanish examples before its quiz, found ${contextualExamples.length}`
    );
  }
});

test("es and está checks use distinct sentence contexts", () => {
  const zeroExercises = exercises.filter((exercise) => exercise.lessonSlug === "zero-es-esta");
  const answerByPrompt = new Map();

  assert.ok(zeroExercises.length >= 4, "zero-es-esta should have several focused checks");
  assert.ok(zeroExercises.some((exercise) => normalizeSeedText(exerciseAnswer(exercise.block)) === "es"));
  assert.ok(zeroExercises.some((exercise) => normalizeSeedText(exerciseAnswer(exercise.block)) === "esta"));

  for (const exercise of zeroExercises) {
    const question = fieldValue(exercise.block, "questionText");
    const normalizedQuestion = normalizeSeedText(question);
    const answer = normalizeSeedText(exerciseAnswer(exercise.block));
    assert.ok(hasContextualPrompt(question), `${exercise.slug} should ask for a form in a sentence context`);
    assert.notEqual(normalizedQuestion, "es", `${exercise.slug} must not quiz a bare es prompt`);
    assert.notEqual(normalizedQuestion, "esta", `${exercise.slug} must not quiz a bare está prompt`);
    assert.notEqual(normalizedQuestion, "he she it is", `${exercise.slug} must not use the ambiguous he/she/it is prompt`);
    if (answerByPrompt.has(normalizedQuestion)) {
      assert.equal(answerByPrompt.get(normalizedQuestion), answer, `${exercise.slug} conflicts with another answer for the same prompt`);
    } else {
      answerByPrompt.set(normalizedQuestion, answer);
    }
  }
});

test("ser vs estar lesson has focused contextual recall across both verbs", () => {
  const lessonExercises = exercises.filter((exercise) => exercise.lessonSlug === "ser-vs-estar-basics");
  const answers = lessonExercises.map((exercise) => normalizeSeedText(exerciseAnswer(exercise.block)));

  assert.ok(lessonExercises.length >= 8, "ser-vs-estar-basics should have at least eight focused checks");
  assert.ok(
    lessonExercises.every((exercise) => hasContextualPrompt(fieldValue(exercise.block, "questionText"))),
    "ser-vs-estar-basics checks should all use meaningful sentence contexts"
  );
  assert.ok(answers.some((answer) => /\b(ser|soy|eres|es|somos|son)\b/.test(answer)), "the lesson should test ser forms");
  assert.ok(
    answers.some((answer) => /\b(estar|estoy|estas|esta|estamos|estan)\b/.test(answer)),
    "the lesson should test estar forms"
  );
});
