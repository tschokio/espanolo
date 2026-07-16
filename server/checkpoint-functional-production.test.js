const assert = require("node:assert/strict");
const test = require("node:test");
const { PrismaClient } = require("@prisma/client");

const { CHECKS } = require("../prisma/checkpoint-functional-checks");
const { evaluateExerciseAnswer } = require("./learning-core");

const CHECKPOINT_SLUGS = [
  "checkpoint-a1-personal-profile",
  "checkpoint-a2-making-plans",
  "checkpoint-a2-everyday-problems",
  "checkpoint-a2-health-appointments",
  "checkpoint-a2-phone-messages"
];

test("beginner transfer checkpoints expose authored function goals for every open production check", async () => {
  assert.equal(Object.keys(CHECKS).length, 15);
  assert.equal(Object.values(CHECKS).every((check) => check.groups.every((group) => group.required && group.labelDe && group.labelEn)), true);

  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: {
        lesson: { slug: { in: CHECKPOINT_SLUGS } },
        type: { in: ["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"] }
      },
      select: { slug: true, type: true, answerJson: true }
    });
    assert.equal(exercises.length, 15);
    assert.equal(exercises.every((exercise) => exercise.answerJson.functionalCheck?.groups?.length >= 2), true);

    const bySlug = Object.fromEntries(exercises.map((exercise) => [exercise.slug, exercise]));
    const naturalVariants = {
      "checkpoint-a1-personal-profile-recall": "Puedo hablar alemán y algo de español.",
      "checkpoint-a2-making-plans-dialogue": "¿Te viene bien a las 4?",
      "checkpoint-a2-everyday-problems-dialogue-reply": "Hoy no estoy disponible, pero mañana estaré en casa.",
      "checkpoint-a2-health-appointments-short-answer": "Me gustaría una cita hoy por la tarde.",
      "checkpoint-a2-phone-messages-short-answer": "Quisiera hablar con la señora Molina, por favor."
    };
    for (const [slug, answer] of Object.entries(naturalVariants)) {
      const result = evaluateExerciseAnswer(bySlug[slug], { answer });
      assert.equal(result.correct, true, `${slug} should accept “${answer}”`);
      assert.equal(result.status, "ACCEPTED_FUNCTIONAL_VARIANT");
    }
  } finally {
    await prisma.$disconnect();
  }
});
