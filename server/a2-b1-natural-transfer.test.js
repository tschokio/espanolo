const test = require("node:test");
const assert = require("node:assert/strict");
const { PrismaClient } = require("@prisma/client");
const { evaluateExerciseAnswer } = require("./learning-core");

const naturalReplies = Object.freeze({
  "checkpoint-a2-tomorrow-plan": "Pienso descansar.",
  "checkpoint-a2-weekend-preference": "Prefiero hacer senderismo.",
  "checkpoint-a2-scenario-order-coffee": "Me gustaría dos cafés para llevar, gracias.",
  "checkpoint-a2-scenario-ask-station": "Disculpe, ¿cómo llego a la estación?",
  "checkpoint-a2-scenario-medicine": "Busco algo para el dolor de cabeza.",
  "checkpoint-b1-opinions-dialogue-response": "El tren tarda menos, pero el autobús cuesta menos.",
  "checkpoint-b1-opinions-write-model": "Por otra parte, ahorraremos tiempo.",
  "checkpoint-b1-future-conditions-produce": "Si surge un problema, podremos resolverlo entre todos.",
  "checkpoint-b1-future-conditions-apply": "Marta no se encuentra aquí; se habrá ido a una reunión.",
  "checkpoint-b1-subjunctive-respond": "Me gustaría que vinieras, aunque sé que estás ocupada.",
  "checkpoint-b1-subjunctive-apply": "Me alegro de que las cosas vayan bien.",
  "checkpoint-b1-conditional-respond": "En tu lugar, consultaría a la responsable.",
  "checkpoint-b1-conditional-imagine": "Si consiguiese un empleo, diría que sí.",
  "checkpoint-b1-commands-pronouns-respond": "Pásame el archivo, por favor.",
  "checkpoint-b1-commands-pronouns-instruct": "No lo mandes a Marta.",
  "checkpoint-b1-por-para-explain": "Voy por la ruta septentrional.",
  "checkpoint-b1-por-para-apply": "Compré un regalo para un colega.",
  "checkpoint-b1-workplace-collaboration-short-answer": "He completado el análisis, pero queda la conclusión.",
  "checkpoint-b1-workplace-collaboration-dialogue-reply": "Sería útil añadir un ejemplo; lo incluiré en la segunda página.",
  "checkpoint-b1-workplace-collaboration-write": "Ha habido una confusión; deberíamos confirmar por escrito cuál es la versión correcta."
});

const preciseModelChecks = Object.freeze([
  "checkpoint-a2-short-routine",
  "checkpoint-a2-formal-address-write",
  "checkpoint-a2-object-pronouns-shopping-recall-model",
  "checkpoint-a2-past-events-recall-past-model",
  "checkpoint-b1-stories-connect",
  "checkpoint-b1-perfect-tenses-connect"
]);

test("A2/B1 transfer checkpoints expose complete bilingual communication goals", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { slug: { in: Object.keys(naturalReplies) } },
      select: { slug: true, answerJson: true }
    });

    assert.equal(exercises.length, Object.keys(naturalReplies).length);
    for (const exercise of exercises) {
      const check = exercise.answerJson?.functionalCheck;
      assert.ok(check, `${exercise.slug} needs functional grading`);
      assert.ok(check.groups.every((group) => group.labelDe && group.labelEn), `${exercise.slug} needs bilingual visible goals`);
      assert.ok(check.groups.filter((group) => group.required).length >= check.minimumMatched, `${exercise.slug} needs enough required functions`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("A2/B1 transfer checkpoints accept meaning-preserving natural variants", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { slug: { in: Object.keys(naturalReplies) } },
      select: { slug: true, type: true, answerJson: true }
    });

    for (const exercise of exercises) {
      const result = evaluateExerciseAnswer(exercise, { answer: naturalReplies[exercise.slug] });
      assert.equal(result.correct, true, `${exercise.slug} should accept: ${naturalReplies[exercise.slug]}`);
      assert.equal(result.status, "ACCEPTED_FUNCTIONAL_VARIANT", `${exercise.slug} should prove a genuine natural variant`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("targeted tense, pronoun, address, and reconstruction checks remain precise model retrieval", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { slug: { in: preciseModelChecks } },
      select: { slug: true, type: true, answerJson: true }
    });

    assert.equal(exercises.length, preciseModelChecks.length);
    assert.equal(exercises.every((exercise) => !exercise.answerJson?.functionalCheck), true);
    const routine = exercises.find((exercise) => exercise.slug === "checkpoint-a2-short-routine");
    assert.equal(evaluateExerciseAnswer(routine, { answer: "A las siete me levanto y a las ocho como." }).correct, false);
  } finally {
    await prisma.$disconnect();
  }
});

test("functional grading rejects plausible fragments that omit a required communication move", async () => {
  const incompleteReplies = {
    "checkpoint-a2-tomorrow-plan": "Mañana.",
    "checkpoint-a2-scenario-order-coffee": "Quisiera dos cafés.",
    "checkpoint-b1-opinions-dialogue-response": "El tren tarda menos.",
    "checkpoint-b1-future-conditions-produce": "Si surge un problema.",
    "checkpoint-b1-subjunctive-respond": "Me gustaría que vinieras.",
    "checkpoint-b1-conditional-respond": "En tu lugar, consultaría.",
    "checkpoint-b1-workplace-collaboration-write": "Ha habido una confusión."
  };
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { slug: { in: Object.keys(incompleteReplies) } },
      select: { slug: true, type: true, answerJson: true }
    });

    for (const exercise of exercises) {
      const result = evaluateExerciseAnswer(exercise, { answer: incompleteReplies[exercise.slug] });
      assert.equal(result.correct, false, `${exercise.slug} must reject an incomplete function set`);
      assert.ok(result.functionalCheck?.missingRequired?.length >= 1, `${exercise.slug} should identify the missing move`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("published rubrics never promise natural variants without executable function grading", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { lesson: { isPublished: true }, type: { in: ["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"] } },
      select: { slug: true, answerJson: true }
    });
    const naturalClaim = /equivalent natural|natural equivalent|equivalent clear|natural regional|equivalent wording/i;
    const unbacked = exercises
      .filter((exercise) => naturalClaim.test(String(exercise.answerJson?.rubric || "")) && !exercise.answerJson?.functionalCheck)
      .map((exercise) => exercise.slug);

    assert.deepEqual(unbacked, []);
  } finally {
    await prisma.$disconnect();
  }
});
