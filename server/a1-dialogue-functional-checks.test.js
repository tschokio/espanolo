const test = require("node:test");
const assert = require("node:assert/strict");
const { PrismaClient } = require("@prisma/client");
const { evaluateExerciseAnswer } = require("./learning-core");

const naturalReplies = Object.freeze({
  "checkpoint-a1-absolute-dialogue-name": "Me llamo Tobias.",
  "checkpoint-a1-core-grammar-dialogue-transfer": "Me llamo Tobias. Me siento cansado.",
  "checkpoint-a1-survival-cafe-reply": "Quisiera agua, gracias.",
  "checkpoint-a1-daily-life-dialogue-transfer": "No comprendo. ¿Puede repetir más despacio?",
  "checkpoint-a1-building-blocks-dialogue-transfer": "Vengo de Berlín.",
  "checkpoint-a1-verb-frames-dialogue-transfer": "Llevo dos libros.",
  "checkpoint-a1-numbers-in-life-dialogue": "Tengo treinta y dos años.",
  "checkpoint-a1-health-doctor-reply": "Busco una farmacia.",
  "checkpoint-a1-foundations-dialogue-transfer": "Me llamo Tobias y me encuentro en casa.",
  "checkpoint-a1-essential-present-time-dialogue": "Comienza a las nueve.",
  "checkpoint-a1-contractions-choice-dialogue": "¿Cuál es el hotel de ustedes?",
  "checkpoint-a1-getting-around-dialogue": "No puedo entrar en mi habitación."
});

test("every meaning-focused A1 checkpoint dialogue exposes German functional goals", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: {
        lesson: { isPublished: true, cefrLevel: "A1", slug: { contains: "checkpoint", not: "checkpoint-a1-sound-foundation" } },
        type: "DIALOGUE_REPLY"
      },
      select: { slug: true, type: true, answerJson: true }
    });

    assert.equal(exercises.length, 13);
    for (const exercise of exercises) {
      const check = exercise.answerJson?.functionalCheck;
      assert.ok(check, `${exercise.slug} needs natural functional grading`);
      assert.ok(check.minimumMatched >= 1, `${exercise.slug} needs an explicit threshold`);
      assert.ok(check.groups.every((group) => group.labelDe && group.labelEn), `${exercise.slug} needs bilingual visible goals`);
      assert.ok(check.groups.filter((group) => group.required).length >= check.minimumMatched, `${exercise.slug} must mark enough indispensable dialogue moves`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("A1 checkpoints accept learner-owned names, origins, items, states, times, and problems", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { slug: { in: Object.keys(naturalReplies) } },
      select: { slug: true, type: true, answerJson: true }
    });

    assert.equal(exercises.length, Object.keys(naturalReplies).length);
    for (const exercise of exercises) {
      const result = evaluateExerciseAnswer(exercise, { answer: naturalReplies[exercise.slug] });
      assert.equal(result.correct, true, `${exercise.slug} should accept: ${naturalReplies[exercise.slug]}`);
      assert.equal(result.status, "ACCEPTED_FUNCTIONAL_VARIANT", `${exercise.slug} should prove a genuine natural variant`);
    }
  } finally {
    await prisma.$disconnect();
  }
});
