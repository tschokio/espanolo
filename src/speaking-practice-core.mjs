export const SPEAKING_SESSION_SIZE = 12;

export function buildSpeakingPracticeDeck(items = [], shuffle = (values) => values, limit = SPEAKING_SESSION_SIZE) {
  const unique = [];
  const seen = new Set();
  for (const item of items) {
    const key = String(item?.spanish || "").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  const boundedLimit = Math.max(1, Math.floor(Number(limit) || SPEAKING_SESSION_SIZE));
  return shuffle([...unique]).slice(0, boundedLimit);
}

export function nextUnmasteredSpeakingIndex(deck = [], currentIndex = 0, masteredSpanish = []) {
  if (!deck.length) return -1;
  const mastered = new Set(masteredSpanish);
  for (let offset = 1; offset <= deck.length; offset += 1) {
    const candidate = (currentIndex + offset) % deck.length;
    if (!mastered.has(deck[candidate]?.spanish)) return candidate;
  }
  return -1;
}

export function speakingMasteryProgress(deck = [], masteredSpanish = []) {
  if (!deck.length) return { mastered: 0, total: 0, percent: 0, complete: false };
  const available = new Set(deck.map((item) => item?.spanish).filter(Boolean));
  const mastered = new Set(masteredSpanish.filter((spanish) => available.has(spanish))).size;
  return {
    mastered,
    total: available.size,
    percent: Math.round((mastered / available.size) * 100),
    complete: mastered >= available.size
  };
}

export function speakingSessionAfterScore(session = {}, result = "fail") {
  const current = {
    perfect: Number(session.perfect) || 0,
    close: Number(session.close) || 0,
    missed: Number(session.missed) || 0,
    streak: Number(session.streak) || 0,
    bestStreak: Number(session.bestStreak) || 0
  };
  if (result === "success") {
    const streak = current.streak + 1;
    return { ...current, perfect: current.perfect + 1, streak, bestStreak: Math.max(current.bestStreak, streak) };
  }
  if (result === "close") return { ...current, close: current.close + 1, streak: 0 };
  return { ...current, missed: current.missed + 1, streak: 0 };
}

export function speakingModeTabs({ german = true, wordCount = 0, sentenceCount = 0, savedCount = 0 } = {}) {
  const wordRound = Math.min(SPEAKING_SESSION_SIZE, wordCount);
  const sentenceRound = Math.min(SPEAKING_SESSION_SIZE, sentenceCount);
  return [
    { key: "learned", label: german ? "Aus deinen Lektionen" : "From your lessons" },
    { key: "words", label: german ? `Freie Wörterrunde (${wordRound} aus ${wordCount})` : `Free word round (${wordRound} of ${wordCount})` },
    { key: "sentences", label: german ? `Freie Satzrunde (${sentenceRound} aus ${sentenceCount})` : `Free sentence round (${sentenceRound} of ${sentenceCount})` },
    { key: "category", label: german ? "Kategorien" : "Categories" },
    { key: "saved", label: `${german ? "Gespeichert" : "Saved"}${savedCount ? ` (${savedCount})` : ""}` },
    { key: "custom", label: german ? "Freie Übung" : "Free practice" }
  ];
}

export function learnedSpeakingItems(content = {}, meaningForSentence = () => "", meaningForWord = () => "") {
  const sentences = (content.sentences || []).map((sentence) => ({
    spanish: sentence.spanish,
    english: sentence.english,
    meaning: meaningForSentence(sentence),
    tag: "Learned",
    type: "sentence",
    sourceId: sentence.lessonId || ""
  }));
  const words = (content.words || []).map((word) => ({
    spanish: word.spanish,
    english: word.english,
    meaning: meaningForWord(word),
    tag: "Learned",
    type: "word",
    sourceId: word.id || ""
  }));
  return [...sentences, ...words];
}
