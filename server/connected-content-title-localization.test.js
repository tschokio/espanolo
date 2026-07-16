const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PrismaClient, Prisma } = require("@prisma/client");
const {
  SPANISH_CONNECTED_CONTENT_TITLES
} = require("../prisma/seed-connected-content-spanish-titles");

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "src", "App.jsx"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const ENGLISH_TITLE_MARKERS = /\b(?:and|without|before|after|choose|hear|evaluate|integrate|compare|synthesize|recommend|retain|infer|mediate|frame|manage|repair|resolve|compress|preserve|checkpoint|listening|meaning|viewpoint|narrative|evidence|audience|structure|emphasis|genre|speech|relay)\b/i;

test("advanced connected-content titles are Spanish targets with their English author title retained only as metadata", async () => {
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        isPublished: true,
        cefrLevel: { in: ["C1", "C2"] },
        readingJson: { not: Prisma.DbNull }
      },
      select: { slug: true, readingJson: true }
    });
    assert.equal(lessons.length, 72, "the audit must cover the complete published C1/C2 connected curriculum");
    for (const lesson of lessons) {
      const content = lesson.readingJson || {};
      assert.ok(content.title, `${lesson.slug} needs a visible target-language title`);
      assert.doesNotMatch(content.title, ENGLISH_TITLE_MARKERS, `${lesson.slug} still exposes an English connected-content title`);
      if (SPANISH_CONNECTED_CONTENT_TITLES[lesson.slug]) {
        assert.equal(content.title, SPANISH_CONNECTED_CONTENT_TITLES[lesson.slug]);
        assert.equal(content.titleEs, SPANISH_CONNECTED_CONTENT_TITLES[lesson.slug]);
        assert.ok(content.titleEn && content.titleEn !== content.titleEs, `${lesson.slug} should preserve optional English separately`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("the runtime and canonical seed path enforce Spanish connected-content headings", () => {
  assert.equal(Object.keys(SPANISH_CONNECTED_CONTENT_TITLES).length, 67);
  for (const [slug, title] of Object.entries(SPANISH_CONNECTED_CONTENT_TITLES)) {
    assert.ok(title.length >= 18, `${slug} needs a specific Spanish title`);
    assert.doesNotMatch(title, ENGLISH_TITLE_MARKERS, `${slug} has an English title in the Spanish mapping`);
  }
  assert.match(appSource, /content\.titleEs \|\| content\.title/);
  assert.match(packageJson.scripts["db:seed"], /seed-connected-content-spanish-titles\.js$/);
});
