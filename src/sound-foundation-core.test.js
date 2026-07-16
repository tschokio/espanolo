const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("every taught A1.P sound topic has a bilingual listen-discriminate-shadow lab", async () => {
  const { soundFoundationLab, soundFoundationLabSlugs } = await import("./sound-foundation-core.mjs");
  assert.deepEqual(soundFoundationLabSlugs, [
    "sound-five-vowels",
    "sound-consonant-map",
    "sound-key-contrasts",
    "sound-stress-accents",
    "sound-rhythm-intonation"
  ]);

  for (const slug of soundFoundationLabSlugs) {
    const lab = soundFoundationLab(slug);
    assert.ok(lab.titleDe.length >= 20, `${slug} needs a concrete German title`);
    assert.ok(lab.principleDe.length >= 90, `${slug} needs a substantial German principle`);
    assert.ok(lab.titleEn && lab.principleEn, `${slug} must keep optional English support`);
    assert.ok(lab.contrasts.length >= 4, `${slug} needs several visible sound contrasts`);
    assert.ok(lab.contrasts.every((item) => item.focus && item.spanish && item.cueDe && item.cueEn));
    assert.ok(lab.challenge.audio);
    assert.ok(lab.challenge.questionDe && lab.challenge.quietQuestionDe);
    assert.ok(lab.challenge.options.length >= 3);
    assert.ok(lab.challenge.options.includes(lab.challenge.correct));
    assert.ok(lab.challenge.explanationDe.length >= 60);
    assert.ok(lab.shadowText && lab.shadowCueDe && lab.shadowCueEn);
  }
});

test("focused sound lessons insert the lab and preserve a complete quiet alternative", () => {
  const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  assert.match(source, /const soundLabStep = !scheduledReview && soundLab \? \{ type: "sound-lab" \} : null/);
  assert.match(source, /current\.type === "sound-lab"/);
  assert.match(source, /lab\.challenge\.quietQuestionDe/);
  assert.match(source, /Die Hör- und Sprechschritte bleiben für den Zuhause-Modus erhalten/);
  assert.match(source, /Die Spracherkennung prüft nur, ob der Satz verständlich erkannt wurde/);
  assert.match(source, /if \(audioState === "playing"\) setListened\(true\)/);
  assert.doesNotMatch(source, /const playChallenge = \(\) => \{\s*setListened\(true\)/);
  assert.match(source, /mode: "sound-discrimination"/);
  assert.match(source, /practiceMode: quiet \? "quiet-alternative" : "home"/);
  assert.match(source, /targetKind: "sound-discrimination"/);
  assert.match(source, /<SoundFoundationLab[\s\S]*?lessonId=\{lesson\.id\}/);
});

test("German microphone and theme feedback does not fall back to English or unexplained Spanish", () => {
  const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
  assert.match(source, /Mikrofon nicht verfügbar/);
  assert.match(source, /Dunkles Design verwenden/);
  assert.match(source, /nativeLanguage=\{user\.nativeLanguage \|\| "de"\}/);
  assert.match(source, /placeholder=\{german \? "z\. B\. ¿Dónde está la estación\?"/);
  assert.doesNotMatch(source, /text: "Mic no disponible"/);
  assert.doesNotMatch(source, /title=\{isDark \? "Use light mode"/);
});
