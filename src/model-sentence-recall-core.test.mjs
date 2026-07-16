import assert from "node:assert/strict";
import test from "node:test";
import prismaPackage from "@prisma/client";

import { evaluateModelSentenceRecall, modelSentenceAnswerFromWordIds, modelSentenceNeedsConsolidation, modelSentenceRecallFeedback, modelSentenceRecallIsComplete, modelSentenceScaffoldReason, modelSentenceWordBank } from "./model-sentence-recall-core.mjs";

const { PrismaClient } = prismaPackage;

test("model recall accepts an exact sentence without requiring punctuation", () => {
  assert.deepEqual(evaluateModelSentenceRecall("Soy estudiante", "Soy estudiante."), {
    correct: true,
    match: "exact",
    accentWarning: false
  });
});

test("word-bank tokens keep repeated words independently selectable", () => {
  const bank = modelSentenceWordBank("Yo soy Ana y soy estudiante.");
  const soyTokens = bank.filter((item) => item.word === "soy");

  assert.equal(bank.length, 6);
  assert.equal(soyTokens.length, 2);
  assert.notEqual(soyTokens[0].id, soyTokens[1].id);
  assert.equal(
    modelSentenceAnswerFromWordIds(bank, [bank[0].id, soyTokens[0].id, bank[2].id, bank[3].id, soyTokens[1].id, bank[5].id]),
    "Yo soy Ana y soy estudiante"
  );
});

test("word-bank composition safely ignores removed or stale token ids", () => {
  const bank = modelSentenceWordBank("Estoy en casa.");
  assert.equal(modelSentenceAnswerFromWordIds(bank, [bank[0].id, "missing", bank[2].id]), "Estoy casa");
});

test("only supported, corrected, or unsuccessful model recalls need delayed consolidation", () => {
  assert.equal(modelSentenceNeedsConsolidation({ correct: true, usedSupport: false, attemptCount: 1 }), false);
  assert.equal(modelSentenceNeedsConsolidation({ correct: true, usedSupport: true, attemptCount: 1 }), true);
  assert.equal(modelSentenceNeedsConsolidation({ correct: true, usedSupport: false, attemptCount: 2 }), true);
  assert.equal(modelSentenceNeedsConsolidation({ correct: false, usedSupport: false, attemptCount: 1 }), true);
  assert.equal(modelSentenceNeedsConsolidation({ correct: true, usedSupport: false, attemptCount: 1, orthographyWarning: true }), true);
  assert.equal(modelSentenceNeedsConsolidation({}), true);
});

test("beginner scaffolding fades after success and briefly persists after supported recall", () => {
  assert.equal(modelSentenceScaffoldReason({ cefrLevel: "A1", index: 0 }), "first");
  assert.equal(modelSentenceScaffoldReason({ cefrLevel: "A2", index: 2, previousSentenceIndex: 7, weakSentenceIndexes: [7] }), "carryover");
  assert.equal(modelSentenceScaffoldReason({ cefrLevel: "A2", index: 2, previousSentenceIndex: 7, previousWasScaffolded: true, weakSentenceIndexes: [7] }), "");
  assert.equal(modelSentenceScaffoldReason({ cefrLevel: "A1", index: 2, previousSentenceIndex: 7, weakSentenceIndexes: [] }), "");
  assert.equal(modelSentenceScaffoldReason({ cefrLevel: "B1", index: 0 }), "");
  assert.equal(modelSentenceScaffoldReason({ cefrLevel: "A1", index: 0, scheduledReview: true }), "");
});

test("model recall accepts safe Spanish subject-pronoun omission", () => {
  const result = evaluateModelSentenceRecall("¿Trabajas hoy?", "¿Tú trabajas hoy?");

  assert.equal(result.correct, true);
  assert.equal(result.match, "omitted_subject_pronoun");
  assert.equal(result.omittedSubject, "Tú");
});

test("model recall does not mistake an article or fixed comparison frame for an optional subject", () => {
  assert.equal(evaluateModelSentenceRecall("Libro es nuevo", "El libro es nuevo.").correct, false);
  assert.equal(evaluateModelSentenceRecall("Que tú, prefiero esperar", "Yo que tú, prefiero esperar.").correct, false);
});

test("model recall still rejects a changed verb or word order", () => {
  assert.equal(evaluateModelSentenceRecall("Soy cansado", "Estoy cansado.").correct, false);
  assert.equal(evaluateModelSentenceRecall("Estudiante soy", "Yo soy estudiante.").correct, false);
});

test("model recall accepts missing accents but reports the writing target", () => {
  const result = evaluateModelSentenceRecall("Tu estas aqui", "Tú estás aquí.");

  assert.equal(result.correct, true);
  assert.equal(result.match, "exact");
  assert.equal(result.accentWarning, true);
  assert.equal(modelSentenceRecallIsComplete(result), true);
  assert.equal(modelSentenceRecallIsComplete(result, { requireExactOrthography: true }), false);
  assert.equal(modelSentenceRecallIsComplete(evaluateModelSentenceRecall("Tú estás aquí", "Tú estás aquí."), { requireExactOrthography: true }), true);
});

test("model recall feedback distinguishes a warning from required corrected spelling", () => {
  const result = evaluateModelSentenceRecall("Tu estas aqui", "Tú estás aquí.");
  assert.match(modelSentenceRecallFeedback({ result, complete: true, nativeLanguage: "de" }), /kommt später gezielt zurück/);
  assert.match(modelSentenceRecallFeedback({ result, requireExactOrthography: true, nativeLanguage: "de" }), /vollständige Schreibweise noch einmal/);
  assert.match(modelSentenceRecallFeedback({ result: { correct: true, match: "exact" }, complete: true, usedSupport: true, nativeLanguage: "de" }), /Mit Unterstützung/);
});

test("model recall never treats ñ or ü as optional accents", () => {
  assert.equal(evaluateModelSentenceRecall("Tengo treinta anos", "Tengo treinta años.").correct, false);
  assert.equal(evaluateModelSentenceRecall("El pinguino nada", "El pingüino nada.").correct, false);
});

test("every eligible seeded model sentence accepts its natural omitted-subject form", async () => {
  const prisma = new PrismaClient();
  const subjectPattern = /^([¿¡]?)(yo|tú|él|ella|nosotros|nosotras|vosotros|vosotras|ellos|ellas|usted|ustedes)\s+(.+)$/iu;
  try {
    const sentences = await prisma.sentence.findMany({ select: { spanish: true } });
    let eligible = 0;
    for (const sentence of sentences) {
      const match = sentence.spanish.trim().match(subjectPattern);
      if (!match || /^(?:que|mismo|misma|mismos|mismas)\b/iu.test(match[3])) continue;
      eligible += 1;
      const submitted = `${match[1]}${match[3]}`;
      const result = evaluateModelSentenceRecall(submitted, sentence.spanish);
      assert.equal(result.correct, true, `${sentence.spanish} should accept ${submitted}`);
      assert.equal(result.match, "omitted_subject_pronoun");
    }
    assert.ok(sentences.length >= 1149, "expected the full model-sentence curriculum");
    assert.ok(eligible >= 58, "expected meaningful coursewide pronoun-omission coverage");
  } finally {
    await prisma.$disconnect();
  }
});
