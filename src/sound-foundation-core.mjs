const SOUND_FOUNDATION_LABS = Object.freeze({
  "sound-five-vowels": {
    titleDe: "Fünf feste Klanganker",
    titleEn: "Five stable sound anchors",
    principleDe: "Sieh, höre und sprich jedes Beispiel als klare Silbenfolge. Ein spanischer Vokal behält sein Klangziel auch ohne Wortbetonung.",
    principleEn: "See, hear, and say each example as a clear syllable sequence. A Spanish vowel keeps its target even without word stress.",
    contrasts: [
      { focus: "a", spanish: "casa", cueDe: "offen und klar", cueEn: "open and clear" },
      { focus: "e", spanish: "mesa", cueDe: "kein deutsches e-i-Gleiten", cueEn: "no glide toward i" },
      { focus: "i", spanish: "piso", cueDe: "kurz und eindeutig", cueEn: "short and distinct" },
      { focus: "o", spanish: "poco", cueDe: "kein deutsches o-u-Gleiten", cueEn: "no glide toward u" },
      { focus: "u", spanish: "luna", cueDe: "Lippen rund, Klang stabil", cueEn: "rounded lips, stable sound" }
    ],
    challenge: {
      audio: "luna",
      questionDe: "Welches Wort hast du gehört? Achte nur auf den Vokalklang.",
      questionEn: "Which word did you hear? Focus only on the vowel sound.",
      quietQuestionDe: "Welches Wort ist der Klanganker für u?",
      quietQuestionEn: "Which word is the sound anchor for u?",
      options: ["luna", "mesa", "piso"],
      correct: "luna",
      explanationDe: "In luna bleibt u klar erkennbar; die zweite Silbe enthält ein ebenso klares a.",
      explanationEn: "In luna, u remains distinct and the second syllable keeps a clear a."
    },
    shadowText: "Ana toma café.",
    shadowCueDe: "Sprich langsam in drei klaren Gruppen: A-na · to-ma · ca-fé.",
    shadowCueEn: "Say it slowly in three clear groups: A-na · to-ma · ca-fé."
  },
  "sound-consonant-map": {
    titleDe: "Schrift in Klang übersetzen",
    titleEn: "Turn spelling into sound",
    principleDe: "Lies bei c und g immer mindestens einen Buchstaben weiter. H, qu, gu und ñ werden als vollständige Schreibmuster erkannt, nicht Buchstabe für Buchstabe geraten.",
    principleEn: "With c and g, always read at least one letter ahead. Treat h, qu, gu, and ñ as complete spelling patterns.",
    contrasts: [
      { focus: "h", spanish: "hola", cueDe: "h bleibt stumm", cueEn: "h stays silent" },
      { focus: "j / ge", spanish: "viaja · gente", cueDe: "kräftiger Jota-Klang", cueEn: "strong jota sound" },
      { focus: "qu / gu", spanish: "queso · guitarra", cueDe: "k und hartes g vor e/i", cueEn: "k and hard g before e/i" },
      { focus: "ñ", spanish: "niño", cueDe: "eigener Buchstabe, eigener Klang", cueEn: "separate letter and sound" }
    ],
    challenge: {
      audio: "queso",
      questionDe: "Welche Schreibweise passt zu dem gehörten Wort?",
      questionEn: "Which spelling matches the word you heard?",
      quietQuestionDe: "Welche Schreibweise erhält vor e den k-Klang?",
      quietQuestionEn: "Which spelling keeps the k sound before e?",
      options: ["queso", "ceso", "gueso"],
      correct: "queso",
      explanationDe: "Qu schreibt vor e den k-Klang; das u wird in diesem Muster nicht als eigener Vokal gesprochen.",
      explanationEn: "Before e, qu spells the k sound; u is not pronounced as a separate vowel in this pattern."
    },
    shadowText: "El niño quiere una guitarra.",
    shadowCueDe: "Markiere beim Nachsprechen ñ, qu und gu – drei verschiedene Schrift-Klang-Regeln in einem Satz.",
    shadowCueEn: "Notice ñ, qu, and gu while shadowing—three spelling-to-sound rules in one sentence."
  },
  "sound-key-contrasts": {
    titleDe: "Wichtige Kontraste schützen",
    titleEn: "Protect important contrasts",
    principleDe: "R und RR können die Bedeutung verändern. B/V und in vielen Regionen LL/Y sind dagegen keine künstlich zu erzwingenden Lautpaare.",
    principleEn: "R and RR can change meaning. B/V and, in many regions, LL/Y are not contrasts to force artificially.",
    contrasts: [
      { focus: "r", spanish: "pero", cueDe: "ein kurzer Zungenschlag", cueEn: "one brief tongue tap" },
      { focus: "rr", spanish: "perro", cueDe: "deutlich starkes r", cueEn: "clearly strong r" },
      { focus: "b / v", spanish: "bebo vino", cueDe: "ein gemeinsames Lautsystem", cueEn: "one shared sound system" },
      { focus: "ll / y", spanish: "yo llamo", cueDe: "regionale Varianten sind normal", cueEn: "regional variants are normal" }
    ],
    challenge: {
      audio: "perro",
      questionDe: "Welches Wort hast du gehört? Achte auf die Stärke des r.",
      questionEn: "Which word did you hear? Listen for the strength of r.",
      quietQuestionDe: "Welche Schreibweise kennzeichnet das starke r zwischen Vokalen?",
      quietQuestionEn: "Which spelling marks a strong r between vowels?",
      options: ["pero", "perro", "pelo"],
      correct: "perro",
      explanationDe: "RR schützt hier die Bedeutung „Hund“. Pero mit einfachem r bedeutet dagegen „aber“.",
      explanationEn: "RR protects the meaning ‘dog’ here. Pero with a single r means ‘but’."
    },
    shadowText: "Pero el perro corre.",
    shadowCueDe: "Sprich pero und perro bewusst verschieden, ohne den restlichen Satz zu beschleunigen.",
    shadowCueEn: "Keep pero and perro distinct without rushing the rest of the sentence."
  },
  "sound-stress-accents": {
    titleDe: "Die betonte Silbe finden",
    titleEn: "Find the stressed syllable",
    principleDe: "Sage das Wort zuerst silbenweise und hebe genau eine Silbe hervor. Das Akzentzeichen zeigt dir, wann die normale Endungsregel überschrieben wird.",
    principleEn: "Say the word syllable by syllable and highlight exactly one syllable. A written accent overrides the default ending rule.",
    contrasts: [
      { focus: "CA-sa", spanish: "casa", cueDe: "Vokalendung → vorletzte Silbe", cueEn: "vowel ending → next-to-last" },
      { focus: "ho-TEL", spanish: "hotel", cueDe: "andere Konsonantendung → letzte Silbe", cueEn: "other consonant ending → final" },
      { focus: "can-CIÓN", spanish: "canción", cueDe: "Akzent überschreibt die Grundregel", cueEn: "accent overrides the default" },
      { focus: "te-LÉ-fo-no", spanish: "teléfono", cueDe: "Akzent macht die Betonung sichtbar", cueEn: "accent makes stress visible" }
    ],
    challenge: {
      audio: "canción",
      questionDe: "Welche Schreibweise bildet die gehörte Betonung korrekt ab?",
      questionEn: "Which spelling correctly represents the stress you heard?",
      quietQuestionDe: "Welche Schreibweise markiert die Betonung auf der letzten Silbe korrekt?",
      quietQuestionEn: "Which spelling correctly marks final stress?",
      options: ["cancion", "canción", "cáncion"],
      correct: "canción",
      explanationDe: "Der Akzent auf ó legt die Betonung auf -ción und bewahrt die Standardschreibung.",
      explanationEn: "The accent on ó places stress on -ción and preserves standard spelling."
    },
    shadowText: "¿Dónde está el teléfono?",
    shadowCueDe: "Hebe DÓN-, -TÁ und -LÉ- hervor; sprich die übrigen Silben weiterhin klar.",
    shadowCueEn: "Highlight DÓN-, -TÁ, and -LÉ- while keeping every other syllable clear."
  },
  "sound-rhythm-intonation": {
    titleDe: "In Sinngruppen sprechen",
    titleEn: "Speak in meaning groups",
    principleDe: "Flüssigkeit entsteht nicht durch hastiges Sprechen. Verbinde Wörter innerhalb einer Sinngruppe und setze nur dort eine kleine Grenze, wo der Gedanke sie braucht.",
    principleEn: "Fluency does not come from rushing. Link words inside a meaning group and place a small boundary where the thought needs it.",
    contrasts: [
      { focus: "Begrüßung / Frage", spanish: "Buenos días / ¿cómo estás?", cueDe: "zwei vollständige Gedanken", cueEn: "two complete thoughts" },
      { focus: "Wunsch", spanish: "Quiero ir a casa.", cueDe: "innerhalb der Gruppe verbinden", cueEn: "link inside the group" },
      { focus: "Problem / Reparatur", spanish: "No entiendo / ¿puede repetirlo?", cueDe: "kurze Grenze vor der Bitte", cueEn: "small boundary before the request" },
      { focus: "Gegensatz", spanish: "hoy no / mañana sí", cueDe: "Kontrast gezielt hervorheben", cueEn: "highlight the contrast" }
    ],
    challenge: {
      audio: "Hoy no puedo, pero mañana sí.",
      questionDe: "Welche Gruppierung macht den Gegensatz am klarsten hörbar?",
      questionEn: "Which grouping makes the contrast easiest to hear?",
      quietQuestionDe: "Welche Gruppierung teilt den Satz in zwei sinnvolle Gegensätze?",
      quietQuestionEn: "Which grouping divides the sentence into two meaningful contrasts?",
      options: ["Hoy no puedo / pero mañana sí.", "Hoy / no puedo pero / mañana sí.", "Hoy no / puedo pero mañana / sí."],
      correct: "Hoy no puedo / pero mañana sí.",
      explanationDe: "Die Grenze liegt am Gegensatzkonnektor pero; hoy/no und mañana/sí bleiben jeweils als Einheit hörbar.",
      explanationEn: "The boundary falls at pero, keeping hoy/no and mañana/sí audible as two units."
    },
    shadowText: "No entiendo; ¿puede repetirlo más despacio?",
    shadowCueDe: "Löse zuerst das Problem aus und beginne danach die höfliche Reparaturfrage als neue Sinngruppe.",
    shadowCueEn: "State the problem first, then begin the polite repair question as a new meaning group."
  }
});

export function soundFoundationLab(topicSlug) {
  return SOUND_FOUNDATION_LABS[topicSlug] || null;
}

export const soundFoundationLabSlugs = Object.freeze(Object.keys(SOUND_FOUNDATION_LABS));
