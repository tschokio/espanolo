const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function speakingLibraryItems() {
  const appSource = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  const library = appSource.match(/const SPEAKING_LIBRARY = \[([\s\S]*?)\n\];/);
  assert.ok(library, "the speaking library should remain auditable");
  return [...library[1].matchAll(/\{ spanish: "([^"]+)", english: "([^"]+)", tag: "([^"]+)", type: "([^"]+)" \}/g)]
    .map((match) => ({ spanish: match[1], english: match[2], tag: match[3], type: match[4] }));
}

test("every speaking card has a German meaning while English remains optional", async () => {
  const { germanSpeakingMeaningKeys, localizedSpeakingMeaning } = await import("./speaking-library-localization.mjs");
  const items = speakingLibraryItems();
  const covered = new Set(germanSpeakingMeaningKeys);

  assert.equal(items.length, 224);
  for (const item of items) {
    assert.ok(covered.has(item.spanish), `${item.spanish} needs a German speaking-library meaning`);
    assert.ok(localizedSpeakingMeaning(item, "de"), `${item.spanish} must render a German meaning`);
    assert.equal(localizedSpeakingMeaning(item, "en"), item.english);
  }
});

test("every speaking category has a specific German label", async () => {
  const { germanSpeakingTagKeys, localizedSpeakingTag } = await import("./speaking-library-localization.mjs");
  const tags = [...new Set(speakingLibraryItems().map((item) => item.tag))];
  const covered = new Set(germanSpeakingTagKeys);

  assert.equal(tags.length, 18);
  for (const tag of tags) {
    assert.ok(covered.has(tag), `${tag} needs a German category label`);
    assert.notEqual(localizedSpeakingTag(tag, "de"), tag);
    assert.equal(localizedSpeakingTag(tag, "en"), tag);
  }
});
