const PRONUNCIATION_PROVIDERS = Object.freeze([
  { provider: "spanishdict", label: "SpanishDict" },
  { provider: "leo", label: "LEO" }
]);

function normalizeAvailability(value, playable = false) {
  if (playable || value === "playable") return "playable";
  if (value === "unavailable") return "unavailable";
  return "unknown";
}

function summarizePronunciationProviders(sources = [], providers = PRONUNCIATION_PROVIDERS) {
  const safeSources = Array.isArray(sources) ? sources : [];
  return providers.map(({ provider, label }) => {
    const matches = safeSources.filter((source) => source.provider === provider);
    const states = matches.map((source) => normalizeAvailability(source.availability, source.playable));
    const availability = !matches.length
      ? "not_found"
      : states.includes("playable")
        ? "playable"
        : states.includes("unknown")
          ? "unknown"
          : "unavailable";
    return {
      provider,
      label,
      availability,
      sourceCount: matches.length,
      playableCount: states.filter((state) => state === "playable").length
    };
  });
}

function bestPlayablePronunciationSource(sources = []) {
  return (Array.isArray(sources) ? sources : []).find((source) =>
    normalizeAvailability(source.availability, source.playable) === "playable"
  ) || null;
}

module.exports = {
  PRONUNCIATION_PROVIDERS,
  bestPlayablePronunciationSource,
  normalizeAvailability,
  summarizePronunciationProviders
};
