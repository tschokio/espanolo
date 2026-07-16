const assert = require("node:assert/strict");
const test = require("node:test");
const { readFileSync } = require("node:fs");
const path = require("node:path");

test("every authored foundation card has specific German explanation and pitfall copy", async () => {
  const { germanFoundationCardCopy, germanFoundationCopyCardCount } = await import("./foundation-card-localization.mjs");
  const appSource = readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  const localizationSource = readFileSync(path.join(__dirname, "foundation-card-localization.mjs"), "utf8");
  const start = appSource.indexOf("const topicTeachingCards =");
  const end = appSource.indexOf("const topicRememberPoints", start);
  const supplementalStart = localizationSource.indexOf("export const supplementalTopicTeachingCards =");
  const supplementalEnd = localizationSource.indexOf("const GERMAN_FOUNDATION_CARD_COPY", supplementalStart);
  const source = `${appSource.slice(start, end)}\n${localizationSource.slice(supplementalStart, supplementalEnd)}`;
  const topicMatches = [...source.matchAll(/^  "([^"]+)": \[/gm)];
  let authoredCardTotal = 0;

  for (let topicIndex = 0; topicIndex < topicMatches.length; topicIndex += 1) {
    const slug = topicMatches[topicIndex][1];
    const topicStart = topicMatches[topicIndex].index;
    const topicEnd = topicMatches[topicIndex + 1]?.index ?? source.length;
    const cardCount = (source.slice(topicStart, topicEnd).match(/\btitle: "/g) || []).length;
    authoredCardTotal += cardCount;
    assert.equal(germanFoundationCopyCardCount[slug], cardCount, `${slug} needs one German copy block per authored card`);
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex += 1) {
      const copy = germanFoundationCardCopy(slug, cardIndex);
      assert.equal(copy.authored, true, `${slug} card ${cardIndex + 1} must not use generic copy`);
      assert.ok(copy.plain.length >= 60, `${slug} card ${cardIndex + 1} explanation is too thin`);
      assert.ok(copy.trap.length >= 35, `${slug} card ${cardIndex + 1} pitfall is too thin`);
      assert.doesNotMatch(`${copy.plain} ${copy.trap}`, /\b(?:the|use|do not|english|spanish)\b/i);
    }
  }

  assert.equal(topicMatches.length, 71);
  assert.equal(authoredCardTotal, 221);
});

test("sentence-derived guide cards receive a Spanish-specific German fallback", async () => {
  const { germanFoundationCardCopy } = await import("./foundation-card-localization.mjs");
  const copy = germanFoundationCardCopy("advanced-topic", 4, { example: "Aunque llueva, iremos." }, "Offene Möglichkeit ausdrücken");

  assert.equal(copy.authored, false);
  assert.match(copy.plain, /Aunque llueva, iremos\./);
  assert.match(copy.plain, /Offene Möglichkeit ausdrücken/);
  assert.match(copy.trap, /unteilbaren Block/);
});

test("all 80 curriculum topics have authored German concept-level teaching copy", async () => {
  const { germanFoundationCardCopy, germanFoundationCopyCardCount, germanFoundationCopyTopicSlugs } = await import("./foundation-card-localization.mjs");
  const appSource = readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  const advancedTitlesSource = readFileSync(path.join(__dirname, "advanced-german-concept-titles.mjs"), "utf8");
  const start = appSource.indexOf("const germanConceptTitles =");
  const end = appSource.indexOf("function germanConceptTitle", start);
  const source = `${appSource.slice(start, end)}\n${advancedTitlesSource}`;
  const topics = [...source.matchAll(/^  "([^"]+)": \[(.*)\],?$/gm)].map((match) => ({
    slug: match[1],
    concepts: [...match[2].matchAll(/"([^"]+)"/g)].map((item) => item[1])
  }));
  let conceptTotal = 0;

  for (const topic of topics) {
    conceptTotal += topic.concepts.length;
    assert.equal(germanFoundationCopyCardCount[topic.slug], topic.concepts.length, `${topic.slug} needs specific copy for every German concept`);
    topic.concepts.forEach((concept, index) => {
      const copy = germanFoundationCardCopy(topic.slug, index, {}, concept);
      assert.equal(copy.authored, true, `${topic.slug} concept ${index + 1} must not use the generic fallback`);
      assert.ok(copy.plain.length >= 60, `${topic.slug} concept ${index + 1} explanation is too thin`);
      assert.ok(copy.trap.length >= 35, `${topic.slug} concept ${index + 1} pitfall is too thin`);
    });
  }

  assert.equal(topics.length, 80);
  assert.equal(germanFoundationCopyTopicSlugs.length, 80);
  assert.equal(conceptTotal, 266);
});
