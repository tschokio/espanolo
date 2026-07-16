function cleanTokens(value) {
  return String(value || "").replace(/[¿?¡!.,;:]/g, "").split(/\s+/).filter(Boolean);
}

export function buildLessonSentenceFrames(sentences = []) {
  const examples = (Array.isArray(sentences) ? sentences : []).filter((sentence) => sentence?.spanish);
  const groups = new Map();
  for (const sentence of examples) {
    const tokens = cleanTokens(sentence.spanish);
    if (!tokens.length) continue;
    const prefixes = [...new Set([tokens.slice(0, Math.min(2, tokens.length)).join(" "), tokens[0]])];
    for (const prefix of prefixes) {
      if (!groups.has(prefix)) groups.set(prefix, []);
      groups.get(prefix).push(sentence);
    }
  }

  const selected = [];
  const used = new Set();
  const ranked = [...groups.entries()]
    .filter(([, items]) => items.length >= 2)
    .sort((a, b) => b[1].length - a[1].length || b[0].split(" ").length - a[0].split(" ").length);
  for (const [starter, items] of ranked) {
    const fresh = items.filter((item) => !used.has(item.spanish));
    if (fresh.length < 2) continue;
    fresh.forEach((item) => used.add(item.spanish));
    selected.push({
      starter,
      examples: fresh.map((item) => ({
        spanish: item.spanish,
        english: item.english,
        ending: cleanTokens(item.spanish).slice(starter.split(" ").length).join(" ") || item.spanish
      }))
    });
  }

  const remaining = examples.filter((item) => !used.has(item.spanish));
  if (remaining.length) {
    selected.push({
      starter: "Useful complete phrases",
      completePhrases: true,
      examples: remaining.map((item) => ({ spanish: item.spanish, english: item.english, ending: item.spanish }))
    });
  }
  return selected.slice(0, 4);
}
