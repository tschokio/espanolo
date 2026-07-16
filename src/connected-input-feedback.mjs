function questionFocus(question = {}) {
  const prompt = `${question.questionDe || ""} ${question.questionEn || ""}`.toLocaleLowerCase("de");
  if (/\b(wer|wem|wen|wessen|sprecher|quelle|bezieht|who|whose|speaker|source|refer)\b/u.test(prompt)) return "reference";
  if (/\b(wann|zuerst|danach|reihenfolge|zeitpunkt|when|first|after|sequence|timeline|order)\b/u.test(prompt)) return "sequence";
  if (/\b(warum|weshalb|grund|ursache|konsequenz|folge|why|reason|cause|consequence|result)\b/u.test(prompt)) return "cause";
  if (/haltung|absicht|zweck|ton|impliz|register|bewertung|stance|attitude|purpose|tone|impli|register/u.test(prompt)) return "stance";
  if (/beding|einschränk|ausnahme|voraussetz|condition|limitation|exception|unless/u.test(prompt)) return "condition";
  return "evidence";
}
export function connectedInputRetryMessage(question, { nativeLanguage = "de", listening = false, quiet = false } = {}) {
  const focus = questionFocus(question);
  const german = nativeLanguage === "de";
  const inputAction = listening && !quiet
    ? (german ? "Höre den relevanten Abschnitt noch einmal." : "Listen to the relevant section once more.")
    : (german ? "Lies die relevante Textstelle noch einmal." : "Read the relevant passage once more.");
  const focusMessages = german
    ? {
        reference: "Prüfe genau, wer spricht, handelt oder als Quelle genannt wird.",
        sequence: "Ordne Zeitangaben und Ereignisse, bevor du die Optionen vergleichst.",
        cause: "Trenne Auslöser, Begründung und tatsächliche Folge voneinander.",
        stance: "Achte auf Haltung, Absicht, Einschränkungen und die Stärke der Aussage.",
        condition: "Suche nach Bedingungen, Ausnahmen und Wörtern, die die Aussage begrenzen.",
        evidence: "Vergleiche jede Option mit der Aussage des Textes; ein bekanntes Einzelwort allein ist noch kein Beleg."
      }
    : {
        reference: "Check exactly who is speaking, acting, or named as the source.",
        sequence: "Order the time markers and events before comparing the options.",
        cause: "Separate the trigger, the stated reason, and the actual consequence.",
        stance: "Notice stance, intention, qualifications, and the strength of the claim.",
        condition: "Look for conditions, exceptions, and words that limit the claim.",
        evidence: "Compare every option with the passage; one familiar word is not enough evidence."
      };
  return `${german ? "Noch nicht." : "Not yet."} ${inputAction} ${focusMessages[focus]}`;
}
