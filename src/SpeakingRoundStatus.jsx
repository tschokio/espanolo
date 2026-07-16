import React from "react";
import { RefreshCw } from "lucide-react";

export function SpeakingRoundProgress({ mastery, german }) {
  const percent = Math.max(0, Math.min(100, Number(mastery?.percent) || 0));
  return (
    <div className="mt-4 rounded-lg border border-white/80 bg-white/70 p-3">
      <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide text-slate-600">
        <span>{german ? "Sicher gesprochen" : "Mastered aloud"}</span>
        <span>{mastery?.mastered || 0} / {mastery?.total || 0}</span>
      </div>
      <div
        role="progressbar"
        aria-label={german ? `Sprechfortschritt ${percent} Prozent` : `Speaking progress ${percent} percent`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={percent}
        className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200"
      >
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function SpeakingRoundComplete({ german, onNewRound }) {
  return (
    <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
      <p className="font-black">{german ? "Runde geschafft" : "Round complete"}</p>
      <p className="mt-1 text-sm font-semibold">
        {german
          ? "Du hast alle Ausdrücke dieser fokussierten Runde verständlich gesprochen. Eine neue Runde bringt frische Karten."
          : "You spoke every expression in this focused round clearly. Start a new round for fresh cards."}
      </p>
      <button type="button" onClick={onNewRound} className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 font-black text-white hover:bg-emerald-800">
        <RefreshCw size={16} />
        {german ? "Neue Runde" : "New round"}
      </button>
    </div>
  );
}

export function SpeakingPracticeGuidance({ mode, german }) {
  if (mode === "learned") {
    return (
      <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
        <p className="font-black">{german ? "Festigen, was du schon gelernt hast" : "Strengthen what you have already learned"}</p>
        <p className="mt-1">
          {german
            ? "Diese Runde verwendet nur eingeführte Wörter und Modellsätze aus deinen begonnenen Lektionen. Neue Inhalte lernst du weiterhin im geführten Kurs."
            : "This round uses only introduced words and model sentences from lessons you have started. New content still belongs in the guided course."}
        </p>
      </div>
    );
  }
  if (["words", "sentences", "category"].includes(mode)) {
    return (
      <div className="mt-4 rounded-lg border border-honey-200 bg-honey-50 p-3 text-sm font-semibold text-honey-900">
        {german
          ? "Freie Zusatzübung: Hier können auch Ausdrücke erscheinen, die dein Lernweg noch nicht eingeführt hat."
          : "Optional free practice: this library may include expressions your learning path has not introduced yet."}
      </div>
    );
  }
  return null;
}

export function SpeakingPracticeEmpty({ mode, german, loading }) {
  if (loading || mode === "custom") return null;
  if (mode === "learned") {
    return (
      <div className="mt-5 rounded-lg border border-lagoon-200 bg-lagoon-50 p-5">
        <p className="font-black text-lagoon-900">{german ? "Noch kein gelernter Stoff für die Sprechpraxis" : "No learned material for speaking practice yet"}</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">
          {german
            ? "Beginne oder beende zuerst eine geführte Lektion. Danach erscheinen ihre Wörter und Modellsätze automatisch hier."
            : "Start or complete a guided lesson first. Its words and model sentences will then appear here automatically."}
        </p>
      </div>
    );
  }
  if (mode === "saved") {
    return (
      <div className="mt-5 rounded-lg border border-honey-200 bg-honey-50 p-5">
        <p className="font-black text-honey-900">{german ? "Noch keine gespeicherten Wörter" : "No saved words yet"}</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">
          {german
            ? "Bekannte Wörter aus deinem Wörtertraining erscheinen hier für die Ausspracheübung."
            : "Save words in the Audio Lab tab and they'll show up here to practice speaking."}
        </p>
      </div>
    );
  }
  return <p className="mt-5 text-sm font-semibold text-slate-600">{german ? "Noch nichts zum Üben verfügbar." : "Nothing to practice yet."}</p>;
}
