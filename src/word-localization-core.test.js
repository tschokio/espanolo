const assert = require("node:assert/strict");
const test = require("node:test");

test("every vocabulary word has an authored German meaning", async () => {
  const { germanWordMeaningKeys, localizedWordMeaning } = await import("./word-localization-core.mjs");
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const words = await prisma.word.findMany({ select: { spanish: true, english: true } });
    const covered = new Set(germanWordMeaningKeys);
    for (const word of words) {
      assert.ok(covered.has(word.english), `${word.spanish} needs a German meaning for “${word.english}”`);
      assert.ok(localizedWordMeaning(word, "de"), `${word.spanish} must have a visible German meaning`);
      assert.equal(localizedWordMeaning(word, "en"), word.english);
    }
  } finally {
    await prisma.$disconnect();
  }
});
