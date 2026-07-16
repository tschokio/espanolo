export function eligibleWordCatcherWords(groups = []) {
  return groups.flatMap((group) => (group.words || []).filter((word) => (
    word?.imageKey
    && word?.review?.state !== "NEW"
    && word?.groupSlug !== "audio-lab-saved"
  )));
}

export function wordCatcherCopy(nativeLanguage = "de") {
  if (nativeLanguage !== "de") {
    return {
      loading: "Loading your introduced words...",
      emptyTitle: "Not enough learned picture words yet",
      emptyText: "Learn at least four picture words in guided lessons first. The game deliberately avoids unknown material.",
      target: "Catch this word",
      score: "Score",
      lives: "Lives",
      time: "Time",
      prompt: "Catch the correct meaning.",
      option: "Option",
      finalScore: "Final score",
      saving: "Saving score...",
      saved: "Score saved.",
      replay: "Play Again",
      correct: "Correct",
      wrong: "Not that one.",
      means: "means",
      timeout: "Time.",
      round: (number) => `Round ${number}: catch the meaning.`
    };
  }
  return {
    loading: "Deine eingeführten Wörter werden vorbereitet...",
    emptyTitle: "Noch nicht genügend gelernte Bildwörter",
    emptyText: "Lerne zuerst mindestens vier Bildwörter in deinen geführten Lektionen. Das Spiel fragt bewusst keinen unbekannten Stoff ab.",
    target: "Fange die Bedeutung",
    score: "Punkte",
    lives: "Leben",
    time: "Zeit",
    prompt: "Wähle die richtige Bedeutung.",
    option: "Auswahl",
    finalScore: "Endpunktzahl",
    saving: "Ergebnis wird gespeichert...",
    saved: "Ergebnis gespeichert.",
    replay: "Noch einmal spielen",
    correct: "Richtig",
    wrong: "Noch nicht.",
    means: "bedeutet",
    timeout: "Zeit abgelaufen.",
    round: (number) => `Runde ${number}: Fange die richtige Bedeutung.`
  };
}
