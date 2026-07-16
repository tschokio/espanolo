const test = require("node:test");
const assert = require("node:assert/strict");
const { PrismaClient } = require("@prisma/client");
const { evaluateExerciseAnswer } = require("./learning-core");

const naturalReplies = Object.freeze({
  "checkpoint-b2-discourse-respond": "Que yo sepa, aún no hay una mejor opción.",
  "checkpoint-b2-discourse-produce": "Por una parte bajaría los costos; en cambio requeriría más tiempo.",
  "checkpoint-b2-reported-speech-respond": "Además, solicitó que pospusiéramos la decisión.",
  "checkpoint-b2-reported-speech-produce": "Dijo que había obtenido nueva información esa mañana.",
  "checkpoint-b2-relative-clauses-respond": "Su meta es mejorar el barrio en el que residen muchas familias.",
  "checkpoint-b2-relative-clauses-produce": "Conocimos a un arquitecto cuyas ideas nos sorprendieron.",
  "checkpoint-b2-se-constructions-respond": "Se entrevistaron todos los candidatos.",
  "checkpoint-b2-se-constructions-produce": "Se me quedaron los documentos en casa.",
  "checkpoint-b2-past-subjunctive-respond": "Dudamos que hubiese bastante tiempo.",
  "checkpoint-b2-past-subjunctive-produce": "Si hubiésemos recibido más datos, habríamos modificado el plan.",
  "checkpoint-b2-verbal-periphrases-respond": "Continúo practicando cada día.",
  "checkpoint-b2-verbal-periphrases-produce": "Antes no acostumbraba a hablar en clase, pero ahora intervengo más.",
  "checkpoint-b2-reading-inference-respond": "Al cabo de seis meses, los residuos se habían reducido en un 40 por ciento.",
  "checkpoint-b2-reading-inference-produce": "Los tiempos de espera únicamente crecieron durante los días iniciales.",
  "checkpoint-b2-listening-comprehension-produce": "Además, pueden escoger una charla de naturaleza.",
  "checkpoint-c1-register-precision-produce": "A esto se añade un factor que no había sido considerado.",
  "checkpoint-c1-narrative-viewpoint-produce": "Una vez aclarado el incidente, todos pudieron volver.",
  "checkpoint-c1-argument-synthesis-synthesize": "Por consiguiente, sería aconsejable ampliar los ensayos antes de tomar una decisión general.",
  "checkpoint-c1-pragmatic-interaction-respond": "Veamos si coincidimos: hoy valoramos y mañana tomamos la decisión.",
  "checkpoint-c1-mood-meaning-produce": "Pase lo que pase, primero verificaremos la información.",
  "checkpoint-c1-dense-listening-relay": "Para mantener su prioridad, tendrán que contestar antes del mediodía de mañana.",
  "checkpoint-c2-precision-mediation-mediate": "Una síntesis rigurosa mantiene tanto los avances como la cuestión aún sin resolver.",
  "checkpoint-c2-genre-rhetoric-compose": "Seguir no implica avanzar sin límite alguno.",
  "checkpoint-c2-sociolinguistic-variation-accommodate": "Conservemos nuestras propias formas y expliquemos las diferencias.",
  "checkpoint-c2-sociolinguistic-variation-mediate": "Es posible construir una norma común sin imponer una sola variedad.",
  "checkpoint-c2-high-stakes-negotiation-respond": "Siempre que concluyera la auditoría, las reservas constarán en acta.",
  "checkpoint-c2-high-stakes-negotiation-transfer": "Aclaremos los intereses subyacentes y cerremos con compromisos verificables y responsables.",
  "checkpoint-c2-literary-creative-control-compose": "Hay que conservar los hechos, aunque podemos cambiar la voz y el ritmo.",
  "checkpoint-c2-expert-listening-synthesis-relay": "La segunda sede depende de la licencia; Celia la comprobará antes de que Bruno actualice el comunicado."
});

test("every B2–C2 checkpoint production task exposes complete bilingual goals", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: {
        lesson: { isPublished: true, cefrLevel: { in: ["B2", "C1", "C2"] }, slug: { contains: "checkpoint" } },
        type: { in: ["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"] }
      },
      select: { slug: true, answerJson: true }
    });

    assert.equal(exercises.length, 29);
    assert.deepEqual(new Set(exercises.map((exercise) => exercise.slug)), new Set(Object.keys(naturalReplies)));
    for (const exercise of exercises) {
      const check = exercise.answerJson?.functionalCheck;
      assert.ok(check, `${exercise.slug} needs advanced functional grading`);
      assert.ok(check.groups.every((item) => item.required && item.labelDe && item.labelEn), `${exercise.slug} needs required bilingual goals`);
      assert.equal(check.minimumMatched, check.groups.length, `${exercise.slug} must preserve every advanced meaning function`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("B2–C2 checkpoints accept natural equivalents while preserving the target structure", async () => {
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { slug: { in: Object.keys(naturalReplies) } },
      select: { slug: true, type: true, answerJson: true }
    });

    for (const exercise of exercises) {
      const result = evaluateExerciseAnswer(exercise, { answer: naturalReplies[exercise.slug] });
      assert.equal(result.correct, true, `${exercise.slug} should accept: ${naturalReplies[exercise.slug]}`);
      assert.equal(result.status, "ACCEPTED_FUNCTIONAL_VARIANT", `${exercise.slug} should prove a genuine advanced variant`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("advanced function grids reject fluent fragments that lose grammar or meaning", async () => {
  const incompleteReplies = {
    "checkpoint-b2-discourse-produce": "Por una parte bajaría los costos.",
    "checkpoint-b2-reported-speech-respond": "También pidió aplazar la decisión.",
    "checkpoint-b2-se-constructions-produce": "Olvidé los documentos en casa.",
    "checkpoint-b2-past-subjunctive-produce": "Si hubiésemos recibido más datos.",
    "checkpoint-c1-argument-synthesis-synthesize": "Por consiguiente, sería aconsejable.",
    "checkpoint-c1-dense-listening-relay": "Tendrán que contestar.",
    "checkpoint-c2-precision-mediation-mediate": "Una síntesis rigurosa mantiene los avances."
  };
  const prisma = new PrismaClient();
  try {
    const exercises = await prisma.exercise.findMany({
      where: { slug: { in: Object.keys(incompleteReplies) } },
      select: { slug: true, type: true, answerJson: true }
    });

    for (const exercise of exercises) {
      const result = evaluateExerciseAnswer(exercise, { answer: incompleteReplies[exercise.slug] });
      assert.equal(result.correct, false, `${exercise.slug} must reject an incomplete advanced function set`);
      assert.ok(result.functionalCheck?.missingRequired?.length >= 1, `${exercise.slug} should identify the missing meaning or structure`);
    }
  } finally {
    await prisma.$disconnect();
  }
});
