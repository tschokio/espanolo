#!/usr/bin/env node

// Structural answer-key integrity checker for lesson/quiz seed content.
// Complements audit-spanish.js (which checks canonical spelling/accents).
// It extracts each `const exercises = [...]` array from the seed files
// WITHOUT executing their database `main()`, then validates the answer keys.

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const seedFiles = [
  "prisma/seed.js",
  "prisma/seed-learning-loop.js",
  "prisma/seed-numbers-colors-expansion.js",
  "prisma/seed-lesson-practice.js"
].map((rel) => path.join(root, rel));

function extractArray(source, varName) {
  const start = source.indexOf(`const ${varName} = [`);
  if (start === -1) return null;
  const open = source.indexOf("[", start);
  let depth = 0;
  for (let j = open; j < source.length; j++) {
    const c = source[j];
    if (c === "[") depth++;
    else if (c === "]" && --depth === 0) return source.slice(open, j + 1);
  }
  return null;
}

function loadExercises(file) {
  if (!fs.existsSync(file)) return [];
  const source = fs.readFileSync(file, "utf8");
  const arrText = extractArray(source, "exercises");
  if (!arrText) return [];
  const ExerciseType = new Proxy({}, { get: (_t, prop) => String(prop) });
  // eslint-disable-next-line no-new-func
  return Function("ExerciseType", `return ${arrText};`)(ExerciseType);
}

function norm(v) {
  return String(v || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Choice-style exercises where exactly one option must be correct and
// answerJson.correct must line up with that option.
const CHOICE_TYPES = new Set(["MULTIPLE_CHOICE", "ARTICLE_MATCH", "LISTENING_CHOICE", "IMAGE_CHOICE"]);

const problems = [];
const seenSlugs = new Map();
let total = 0;

for (const file of seedFiles) {
  const rel = path.relative(root, file);
  // Duplicate slugs are only a real bug when they collide inside a single
  // file. Some seed scripts (e.g. seed-learning-loop.js) intentionally mirror
  // slugs defined in seed.js and upsert them by their unique slug, so those
  // cross-file matches are expected and harmless.
  const slugsInFile = new Set();
  for (const ex of loadExercises(file)) {
    total++;
    const where = `${rel}:${ex.slug}`;
    if (slugsInFile.has(ex.slug)) {
      problems.push(`[dup-slug-in-file] ${where}`);
    }
    slugsInFile.add(ex.slug);
    seenSlugs.set(ex.slug, rel);

    const opts = Array.isArray(ex.options) ? ex.options : [];
    const correct = ex.answerJson?.correct;
    const correctWords = ex.answerJson?.correctWords;

    if (opts.length && ex.type !== "SENTENCE_BUILDER") {
      const correctOpts = opts.filter((o) => o[2] === true);
      if (correctOpts.length !== 1) {
        problems.push(`[${correctOpts.length}-correct-options] ${where} (${ex.type})`);
      }
      if (CHOICE_TYPES.has(ex.type) && correct != null && correctOpts.length) {
        const ok = correctOpts.some((o) => norm(o[0]) === norm(correct) || norm(o[1]) === norm(correct));
        if (!ok) {
          problems.push(
            `[correct-not-in-options] ${where} correct="${correct}" opts="${correctOpts.map((o) => o[0]).join(" | ")}"`
          );
        }
      }
    }

    if (ex.type === "SENTENCE_BUILDER" && Array.isArray(correctWords) && opts.length) {
      const bank = opts.map((o) => o[0]);
      for (const w of new Set(correctWords)) {
        if (bank.filter((x) => x === w).length < correctWords.filter((x) => x === w).length) {
          problems.push(`[builder-word-missing] ${where} word="${w}"`);
        }
      }
    }

    if (CHOICE_TYPES.has(ex.type) && !opts.length) {
      problems.push(`[choice-without-options] ${where} (${ex.type})`);
    }
  }
}

console.log(`Checked ${total} exercises across ${seedFiles.length} seed file(s).`);
if (!problems.length) {
  console.log("No answer-key integrity problems found.");
  process.exit(0);
}
console.error(`\nFound ${problems.length} integrity problem(s):`);
for (const p of problems) console.error(" - " + p);
process.exit(1);
