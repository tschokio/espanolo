const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

test("every C2 lesson has German-first connected comprehension and balanced listening practice", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { cefrLevel: "C2" },
      orderBy: { order: "asc" },
      select: { slug: true, estimatedMinutes: true, readingJson: true }
    });
    assert.equal(lessons.length, 36);
    assert.equal(lessons.filter((lesson) => lesson.readingJson.inputMode === "listening").length, 21);

    for (const lesson of lessons) {
      const content = lesson.readingJson;
      assert.ok(lesson.estimatedMinutes >= 22);
      assert.equal(content.paragraphs.length, 2);
      assert.equal(content.questions.length, 2);
      assert.ok(content.orientationDe.length >= 70);
      assert.ok(content.recallPromptDe.length >= 70);
      assert.ok(content.modelSummary.split(/\s+/).length >= 12);

      for (const question of content.questions) {
        assert.doesNotMatch(question.questionDe, /^¿|\b(?:Qué|Cómo|Cuál|Quién|Por qué)\b/);
        assert.doesNotMatch(question.questionEn, /^¿|\b(?:Qué|Cómo|Cuál|Quién|Por qué)\b/);
        assert.equal(question.optionsDe.length, 3);
        assert.equal(question.optionsEn.length, 3);
        for (const option of question.optionsDe) {
          assert.doesNotMatch(option, /^(?:La|El|Los|Las|Una|Un|Que|Porque|En que|Hace que|Convierte|Limita|Niega|Solo|Se)\b/);
        }
        assert.ok(question.explanationDe.length >= 70);
        assert.ok(question.explanationEn.length >= 70);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
});
