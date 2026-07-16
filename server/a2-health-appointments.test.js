const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const SLUGS = [
  "a2-describe-symptoms-duration",
  "a2-request-medical-appointment",
  "a2-check-in-health-details",
  "a2-answer-clinical-questions",
  "a2-understand-care-instructions",
  "a2-clarify-health-instructions",
  "checkpoint-a2-health-appointments"
];

test("A2.10 develops a complete basic health appointment without teaching self-diagnosis", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: SLUGS } },
      orderBy: { order: "asc" },
      select: {
        slug: true, order: true, cefrLevel: true, isPublished: true,
        topic: { select: { slug: true } }, sentences: true, exercises: true, readingJson: true,
        vocabularyGroups: { select: { slug: true } }
      }
    });

    assert.deepEqual(lessons.map((lesson) => lesson.slug), SLUGS);
    assert.deepEqual(lessons.map((lesson) => lesson.order), [831.71, 831.72, 831.73, 831.74, 831.75, 831.76, 831.77]);
    for (const lesson of lessons) {
      assert.equal(lesson.cefrLevel, "A2");
      assert.equal(lesson.isPublished, true);
      assert.equal(lesson.topic.slug, "health-appointments-instructions");
      assert.ok(lesson.vocabularyGroups.some((group) => group.slug === "a2-health-appointments"));
      assert.ok(lesson.sentences.length >= 5);
      assert.ok(lesson.exercises.length >= 10 && lesson.exercises.length <= 12, `${lesson.slug} needs bounded mixed retrieval`);
      for (const type of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "DIALOGUE_REPLY", "WRITING_PROMPT"]) {
        assert.ok(lesson.exercises.some((exercise) => exercise.type === type), `${lesson.slug} needs ${type}`);
      }
      assert.equal(lesson.readingJson.paragraphs.length, 2);
      assert.equal(lesson.readingJson.questions.length, 2);
      assert.ok(lesson.readingJson.orientationDe.length >= 140);
      assert.ok(lesson.readingJson.recallPromptDe.length >= 140);
      assert.ok(lesson.readingJson.modelSummary.split(/\s+/).length >= 19);
      assert.doesNotMatch(`${lesson.readingJson.orientationDe} ${lesson.readingJson.recallPromptDe}`, /Diagnose stellen|diagnostiziere/i);
    }

    const bySlug = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson]));
    const symptoms = bySlug["a2-describe-symptoms-duration"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(symptoms, /desde hace/i);
    assert.match(symptoms, /bastante fuerte/i);
    assert.match(symptoms, /No tengo dificultad/i);

    const appointment = bySlug["a2-request-medical-appointment"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(appointment, /pedir una cita/i);
    assert.match(appointment, /cinco y media con la doctora/i);

    const instructions = bySlug["a2-understand-care-instructions"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(instructions, /cada ocho horas/i);
    assert.match(instructions, /después de comer/i);
    assert.match(instructions, /durante tres días/i);
    assert.match(instructions, /Si se encuentra peor/i);

    const repair = bySlug["a2-clarify-health-instructions"].sentences.map((sentence) => sentence.spanish).join(" ");
    assert.match(repair, /cada seis o cada ocho/i);
    assert.match(repair, /Entonces, una pastilla/i);
  } finally {
    await prisma.$disconnect();
  }
});
