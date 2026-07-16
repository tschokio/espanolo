const test = require("node:test");
const assert = require("node:assert/strict");

const {
  bestPlayablePronunciationSource,
  summarizePronunciationProviders
} = require("./pronunciation-core");

test("provider availability distinguishes playable, missing, unavailable, and uncertain sources", () => {
  assert.deepEqual(summarizePronunciationProviders([
    { provider: "spanishdict", availability: "unavailable" },
    { provider: "spanishdict", availability: "unknown" }
  ]), [
    { provider: "spanishdict", label: "SpanishDict", availability: "unknown", sourceCount: 2, playableCount: 0 },
    { provider: "leo", label: "LEO", availability: "not_found", sourceCount: 0, playableCount: 0 }
  ]);

  assert.equal(summarizePronunciationProviders([
    { provider: "leo", playable: true },
    { provider: "leo", availability: "unavailable" }
  ])[1].availability, "playable");
});

test("the best pronunciation source is the first verified playable match", () => {
  const sources = [
    { provider: "spanishdict", availability: "unknown" },
    { provider: "leo", availability: "playable", sourceText: "estudiante" }
  ];
  assert.equal(bestPlayablePronunciationSource(sources), sources[1]);
  assert.equal(bestPlayablePronunciationSource([{ provider: "leo", availability: "unavailable" }]), null);
  assert.equal(bestPlayablePronunciationSource(null), null);
});
