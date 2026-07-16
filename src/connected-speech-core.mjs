const SPEAKER_PREFIX = /^([\p{Lu}][\p{L}'’.-]{1,30}):\s*/u;

export function parseConnectedSpeechChunk(value) {
  const raw = String(value || "").trim();
  const match = SPEAKER_PREFIX.exec(raw);
  if (!match) return { speaker: "", text: raw };
  return { speaker: match[1], text: raw.slice(match[0].length).trim() };
}

export function stableSpeakerVoiceIndex(speaker, voiceCount) {
  const count = Math.max(0, Math.floor(Number(voiceCount) || 0));
  if (!count) return -1;
  const value = String(speaker || "");
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.codePointAt(0)) >>> 0;
  return hash % count;
}

export function connectedSpeechUtterancePlan(chunks, voices = []) {
  const spanishVoices = (voices || []).filter((voice) => /^es(?:-|_)/i.test(String(voice?.lang || "")));
  const distinctSpeakerVoices = spanishVoices.length >= 2;
  const speakerVoiceIndices = new Map();
  return (chunks || []).map((chunk) => {
    const parsed = parseConnectedSpeechChunk(chunk);
    if (parsed.speaker && !speakerVoiceIndices.has(parsed.speaker) && spanishVoices.length) {
      speakerVoiceIndices.set(parsed.speaker, speakerVoiceIndices.size % spanishVoices.length);
    }
    const voiceIndex = parsed.speaker ? speakerVoiceIndices.get(parsed.speaker) ?? -1 : -1;
    return {
      ...parsed,
      spokenText: parsed.speaker && !distinctSpeakerVoices ? `${parsed.speaker}. ${parsed.text}` : parsed.text,
      voice: voiceIndex >= 0 ? spanishVoices[voiceIndex] : null
    };
  });
}
