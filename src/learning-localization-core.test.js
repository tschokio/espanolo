const assert = require("node:assert/strict");
const test = require("node:test");

test("every seeded lesson has an authored German title", async () => {
  const { germanLessonTitleSlugs, localizedLessonTitle } = await import("./learning-localization-core.mjs");
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({ select: { slug: true, title: true } });
    const covered = new Set(germanLessonTitleSlugs);
    for (const lesson of lessons) {
      assert.ok(covered.has(lesson.slug), `${lesson.slug} needs an authored German lesson title`);
      assert.notEqual(localizedLessonTitle(lesson, "de"), lesson.title, `${lesson.slug} should not show its English title in German mode`);
      assert.equal(localizedLessonTitle(lesson, "en"), lesson.title);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("every seeded lesson receives a specific German learning promise", async () => {
  const { localizedLessonSummary, localizedLessonTitle } = await import("./learning-localization-core.mjs");
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({ select: { slug: true, title: true, summary: true, theme: true } });
    const summaries = new Set();
    for (const lesson of lessons) {
      const isCheckpoint = lesson.theme === "Checkpoint" || lesson.slug.includes("checkpoint");
      const localized = localizedLessonSummary({ ...lesson, isCheckpoint }, "de");
      const localizedTitle = localizedLessonTitle(lesson, "de");

      assert.match(localized, new RegExp(localizedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${lesson.slug} summary should name its exact learning focus`);
      assert.doesNotMatch(localized, /Diese Lektion baut ein klar begrenztes spanisches Grundmuster auf/);
      assert.equal(localizedLessonSummary(lesson, "en"), lesson.summary);
      if (isCheckpoint) assert.match(localized, /Checkpoint.+ohne Vorlage.+Spanisch/);
      else assert.match(localized, /Du lernst gezielt.+Bedeutung.+spanische Muster.+aktiv abrufen/);
      summaries.add(localized);
    }
    assert.equal(summaries.size, lessons.length, "each lesson should expose an individual German learning promise");
  } finally {
    await prisma.$disconnect();
  }
});
