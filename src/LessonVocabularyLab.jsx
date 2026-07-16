import { useMemo, useRef, useState } from "react";

import { evaluateModelSentenceRecall, modelSentenceRecallIsComplete } from "./model-sentence-recall-core.mjs";
import { spanishLearningExample } from "./spanish-content-core.mjs";

function classes(...values) {
  return values.filter(Boolean).join(" ");
}

export default function LessonVocabularyLab({ lab, nativeLanguage = "de", quiet = false, grammarFor, PronunciationComponent, SpeakCheckComponent, SpanishCharacterComponent, onContinue }) {
  const german = nativeLanguage === "de";
  const [phase, setPhase] = useState("study");
  const [checkIndex, setCheckIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const answerInputRef = useRef(null);
  const check = lab.checks[checkIndex];
  const selectedOption = selected === null ? null : check?.options[selected];
  const productionResult = useMemo(
    () => checked ? evaluateModelSentenceRecall(answer, lab.productionTarget.spanish) : { correct: false },
    [answer, checked, lab.productionTarget.spanish]
  );
  const productionComplete = modelSentenceRecallIsComplete(productionResult, { requireExactOrthography: true });

  const continueRecognition = () => {
    if (checkIndex + 1 >= lab.checks.length) {
      setPhase("production");
      setSelected(null);
      return;
    }
    setCheckIndex((value) => value + 1);
    setSelected(null);
  };

  const checkProduction = () => {
    if (!answer.trim()) return;
    setAttemptCount((value) => value + 1);
    setChecked(true);
  };

  const retryProduction = () => {
    setAnswer("");
    setChecked(false);
  };

  if (phase === "study") {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">{german ? "Wörter im Zusammenhang erschließen" : "Build vocabulary from context"}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{german ? `${lab.items.length} neue Bausteine für diese Lektion` : `${lab.items.length} new building blocks for this lesson`}</h1>
        <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600">{german ? "Verstehe zuerst die Bedeutung im Beispielsatz. Danach prüfst du einige Bedeutungen und holst einen Ausdruck selbst auf Spanisch hervor. Erst dann gelangen diese Wörter in die zeitversetzte Wiederholung." : "Understand each item in its example first. Then check several meanings and retrieve one expression in Spanish before the words enter spaced review."}</p>
        {quiet && <p className="mt-4 rounded-md border border-sky-200 bg-sky-50 p-3 text-sm font-bold text-sky-900">{german ? "Leisemodus: Lies die Beispiele und sprich sie innerlich mit. Audio und Mikrofon bleiben aus." : "Quiet mode: read and rehearse internally. Audio and microphone stay off."}</p>}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {lab.items.map((word) => (
            <div key={word.id} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-black text-coral-700">{word.spanish}</p>
                  <p className="mt-1 font-bold text-slate-700">{word.meaning}</p>
                </div>
                {!quiet && PronunciationComponent && <PronunciationComponent text={word.spanish} compact allowCopy={false} nativeLanguage={nativeLanguage} />}
              </div>
              {spanishLearningExample(word.example) && <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{spanishLearningExample(word.example)}</p>}
              {grammarFor?.(word.partOfSpeech, nativeLanguage) && <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-400">{grammarFor(word.partOfSpeech, nativeLanguage)}{word.gender ? ` · ${grammarFor(word.gender, nativeLanguage)}` : ""}</p>}
            </div>
          ))}
        </div>
        <button onClick={() => setPhase(lab.checks.length ? "recognition" : "production")} className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600">{german ? "Bedeutungen verstecken und kurz prüfen" : "Hide meanings and run a quick check"}</button>
      </div>
    );
  }

  if (phase === "recognition" && check) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-honey-700">{german ? `Schneller Bedeutungscheck ${checkIndex + 1}/${lab.checks.length}` : `Quick meaning check ${checkIndex + 1}/${lab.checks.length}`}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{check.target.spanish}</h1>
        <p className="mt-2 font-semibold text-slate-600">{german ? "Welche Bedeutung passt in diesem Lernpaket?" : "Which meaning fits in this learning package?"}</p>
        {!quiet && PronunciationComponent && <div className="mt-3"><PronunciationComponent text={check.target.spanish} compact allowCopy={false} nativeLanguage={nativeLanguage} /></div>}
        <div className="mt-5 grid gap-2" role="radiogroup" aria-label={german ? "Bedeutung auswählen" : "Choose a meaning"}>
          {check.options.map((option, index) => (
            <button key={option.text} role="radio" aria-checked={selected === index} onClick={() => setSelected(index)} className={classes("rounded-md border px-4 py-3 text-left font-bold", selected === index ? option.correct ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-800" : "border-stone-200 bg-stone-50 text-slate-700")}>{option.text}</button>
          ))}
        </div>
        {selectedOption && <p role="status" aria-live="polite" className={classes("mt-3 text-sm font-bold", selectedOption.correct ? "text-emerald-800" : "text-red-700")}>{selectedOption.correct ? (german ? "Richtig erkannt. Die Bedeutung ist jetzt mit dem spanischen Ausdruck verknüpft." : "Correct. The meaning is now linked to the Spanish expression.") : (german ? "Noch nicht – lies den spanischen Ausdruck noch einmal und vergleiche die Bedeutungsunterschiede." : "Not yet—read the Spanish expression again and compare the meaning differences.")}</p>}
        {selectedOption?.correct && <button onClick={continueRecognition} className="mt-5 w-full rounded-md bg-honey-500 px-5 py-3 font-black text-white">{checkIndex + 1 >= lab.checks.length ? (german ? "Jetzt einen Ausdruck selbst hervorholen" : "Now retrieve one expression") : (german ? "Nächste Bedeutung" : "Next meaning")}</button>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <p className="text-sm font-black uppercase tracking-wide text-coral-700">{german ? "Aktiver Wortabruf" : "Active vocabulary recall"}</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">{german ? "Hole den Ausdruck auf Spanisch hervor" : "Retrieve the expression in Spanish"}</h1>
      <div className="mt-5 rounded-lg border border-honey-200 bg-honey-50 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-honey-700">{german ? "Bedeutungsreiz" : "Meaning cue"}</p>
        <p className="mt-2 text-xl font-black text-honey-950">{lab.productionTarget.meaning}</p>
        <p className="mt-2 text-sm font-semibold text-honey-900">{german ? "Schreibe den gelernten spanischen Ausdruck, nicht den ganzen Beispielsatz." : "Write the learned Spanish expression, not the full example sentence."}</p>
      </div>
      <div className="mt-5 flex gap-2">
        <input ref={answerInputRef} aria-label={german ? "Spanischen Ausdruck eingeben" : "Enter the Spanish expression"} value={answer} disabled={checked} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") checkProduction(); }} className="min-w-0 flex-1 rounded-md border border-stone-200 px-4 py-3 font-bold outline-none focus:border-lagoon-500 disabled:bg-stone-100" placeholder={german ? "Spanischer Ausdruck" : "Spanish expression"} />
        {!checked && <button disabled={!answer.trim()} onClick={checkProduction} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white disabled:opacity-40">{german ? "Prüfen" : "Check"}</button>}
      </div>
      {!checked && SpanishCharacterComponent && <SpanishCharacterComponent value={answer} onChange={setAnswer} inputRef={answerInputRef} nativeLanguage={nativeLanguage} />}
      {!checked && !quiet && SpeakCheckComponent && <div className="mt-3"><SpeakCheckComponent onTranscript={setAnswer} nativeLanguage={nativeLanguage} /></div>}
      {checked && (
        <div className={classes("mt-4 rounded-lg border p-4", productionResult.accentWarning ? "border-honey-300 bg-honey-50" : productionComplete ? "border-emerald-200 bg-emerald-50" : "border-honey-200 bg-honey-50")}>
          <p className={classes("font-black", productionResult.accentWarning ? "text-honey-950" : productionComplete ? "text-emerald-900" : "text-honey-900")}>{productionResult.accentWarning ? (german ? "Der Ausdruck stimmt. Vergleiche jetzt den Akzent und hole die vollständige Schreibweise noch einmal hervor." : "The expression is correct. Compare the accent, then retrieve the complete spelling once more.") : productionComplete ? (german ? (attemptCount > 1 ? "Nach dem Vergleich richtig abgerufen – dieser Ausdruck bekommt einen kurzen Wiederholungsabstand." : "Selbstständig abgerufen – jetzt ist der Ausdruck bereit für die zeitversetzte Wiederholung.") : (attemptCount > 1 ? "Retrieved after comparison; this expression will receive a short review interval." : "Retrieved independently; the expression is ready for spaced review.")) : (german ? "Noch nicht ganz. Vergleiche das Modell, verstecke es und rufe den Ausdruck erneut ab." : "Not yet. Compare the model, hide it, and retrieve the expression again.")}</p>
          <p className="mt-2 text-xl font-black text-slate-950">{lab.productionTarget.spanish}</p>
          {!quiet && PronunciationComponent && <div className="mt-2"><PronunciationComponent text={lab.productionTarget.spanish} compact allowCopy={false} nativeLanguage={nativeLanguage} /></div>}
          {!productionComplete && <button onClick={retryProduction} className="mt-3 rounded-md border border-honey-300 bg-white px-4 py-2 text-sm font-black text-honey-800">{productionResult.accentWarning ? (german ? "Modell verstecken und Akzent selbst setzen" : "Hide the model and place the accent yourself") : (german ? "Modell wieder verstecken und neu versuchen" : "Hide the model and try again")}</button>}
        </div>
      )}
      {productionComplete && <button onClick={onContinue} className="mt-5 w-full rounded-md bg-emerald-600 px-5 py-3 font-black text-white">{german ? "Wörter erschlossen – mit der Lektion weiter" : "Vocabulary ready—continue the lesson"}</button>}
    </div>
  );
}
