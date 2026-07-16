const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const { PrismaClient } = require("@prisma/client");
const { lessonVocabularyContextTexts, normalizeAnswer, selectLessonVocabularyWords, vocabularyExpressionIsAnchored } = require("./learning-core");

const source = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");

test("lesson details select unseen vocabulary while enrollment accepts only the reported lesson batch", () => {
  const enrollment = source.slice(source.indexOf("async function enrollLessonWordsForReview"), source.indexOf("async function ensureAudioLabVocabularyGroup"));
  const lessonRoute = source.slice(source.indexOf('"/api/lessons/:id"'), source.indexOf('"/api/lessons/:id/reinforcement-complete"'));
  const completion = source.slice(source.indexOf("async function completeLessonReinforcement"), source.indexOf("async function updateReviewItem"));
  const completionRoute = source.slice(source.indexOf('"/api/lessons/:id/reinforcement-complete"'), source.indexOf('"/api/exercises/:id/attempt"'));
  const wordsRoute = source.slice(source.indexOf('"/api/words"'), source.indexOf('"/api/words/:id/attempt"'));

  assert.match(enrollment, /validatedIntroducedVocabularyIds\(candidateWordIds, introducedWordIds, 8\)/);
  assert.match(enrollment, /if \(!lesson \|\| isCheckpointLesson\(lesson\)\) return 0/);
  assert.match(lessonRoute, /introducedWords = candidateWordIds\.length/);
  assert.match(lessonRoute, /selectLessonVocabularyWords\(/);
  assert.match(lessonRoute, /lessonVocabularyContextTexts\(lesson\)/);
  assert.match(lessonRoute, /learningWords,/);
  assert.match(lessonRoute, /summary\.isCheckpoint\s*\? \[\]/);
  assert.match(completion, /evidence\.introducedWordIds/);
  assert.match(completion, /enrollLessonWordsForReview\(userId, lessonId, addMinutes\(now, 10\), evidence\.introducedWordIds\)/);
  assert.match(completionRoute, /introducedWordIds\.filter/);
  assert.match(completionRoute, /firstPassScore, independentScore, introducedWordIds/);
  assert.doesNotMatch(wordsRoute, /enrollLessonWordsForReview|enrollCompletedLessonWordsForReview/);
  assert.doesNotMatch(source, /async function enrollCompletedLessonWordsForReview/);
});

test("advanced lesson batches prefer vocabulary anchored in their Spanish input", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true, cefrLevel: { in: ["B1", "B2", "C1", "C2"] } },
      include: { sentences: true, exercises: true, vocabularyGroups: { include: { words: true } } }
    });
    let lessonsWithAnchoredCandidates = 0;
    for (const lesson of lessons.filter((item) => !/checkpoint/i.test(`${item.slug} ${item.theme}`))) {
      const context = lessonVocabularyContextTexts(lesson);
      const candidates = lesson.vocabularyGroups.flatMap((group) => group.words)
        .filter((word) => vocabularyExpressionIsAnchored(word.spanish, context));
      if (!candidates.length) continue;
      lessonsWithAnchoredCandidates += 1;
      const selected = selectLessonVocabularyWords(lesson.vocabularyGroups, lesson.id, 8, [], { ...lesson, texts: context });
      const selectedIds = new Set(selected.map((word) => word.id));
      const expectedAnchors = new Set(candidates.map((word) => normalizeAnswer(word.spanish)));
      const selectedAnchors = selected.filter((word) => expectedAnchors.has(normalizeAnswer(word.spanish)));
      assert.equal(
        selectedAnchors.length,
        Math.min(8, expectedAnchors.size),
        `${lesson.slug} should introduce every available in-context expression before unrelated filler`
      );
      assert.equal(selectedAnchors.every((word) => selectedIds.has(word.id)), true);
    }
    assert.ok(lessonsWithAnchoredCandidates >= 90, `expected broad anchored vocabulary coverage, found ${lessonsWithAnchoredCandidates}`);
  } finally {
    await prisma.$disconnect();
  }
});

test("published learning lessons provide contextual examples for every selected vocabulary item", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      include: { vocabularyGroups: { include: { words: true } } }
    });
    const learningLessons = lessons.filter((lesson) => !/checkpoint/i.test(`${lesson.slug} ${lesson.theme}`));
    const batches = learningLessons
      .map((lesson) => selectLessonVocabularyWords(lesson.vocabularyGroups, lesson.id, 8))
      .filter((batch) => batch.length);

    assert.ok(batches.length >= 235, `expected broad lesson vocabulary coverage, found ${batches.length}`);
    assert.equal(batches.every((batch) => batch.length <= 8), true);
    assert.equal(batches.flat().every((word) => String(word.example || "").trim()), true);
  } finally {
    await prisma.$disconnect();
  }
});
