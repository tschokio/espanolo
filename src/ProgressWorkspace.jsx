import { BarChart3, BookOpen, Flame, GraduationCap, ListChecks, Mic, NotebookTabs, PenTool, Target, Users, Volume2 } from "lucide-react";
import { localizedUnit } from "./learning-localization-core.mjs";

export default function ProgressWorkspace({ dashboard, nativeLanguage = "de", Panel, ProgressBar, InfoTile, classNames }) {
  const german = nativeLanguage === "de";
  const retrieval = dashboard.stats.retrieval14Days || { tracked: 0, independent: 0, supported: 0, corrected: 0, unsuccessful: 0, independentRate: 0 };
  const skillProfile = dashboard.stats.skillProfile || { windowDays: 30, skills: [], nextFocus: "vocabulary" };
  const skillMeta = {
    vocabulary: { de: "Wortschatz", en: "Vocabulary", icon: NotebookTabs, tone: "lagoon" },
    grammar: { de: "Satzmuster & Grammatik", en: "Grammar & patterns", icon: GraduationCap, tone: "sky" },
    listening: { de: "Hörverstehen", en: "Listening", icon: Volume2, tone: "honey" },
    reading: { de: "Leseverstehen", en: "Reading", icon: BookOpen, tone: "emerald" },
    writing: { de: "Schreiben", en: "Writing", icon: PenTool, tone: "coral" },
    conversation: { de: "Gesprächsführung", en: "Conversation", icon: Users, tone: "sky" },
    speaking: { de: "Aussprache & Sprechen", en: "Speaking", icon: Mic, tone: "honey" }
  };
  const stageLabels = german
    ? { "no-evidence": "Noch nicht belastbar geübt", building: "Im Aufbau", consolidating: "Wird gefestigt", "well-established": "Oft selbstständig abgerufen" }
    : { "no-evidence": "Not practiced reliably yet", building: "Building", consolidating: "Consolidating", "well-established": "Often retrieved independently" };
  const nextFocusMeta = skillMeta[skillProfile.nextFocus] || skillMeta.vocabulary;
  const activeUnits = (dashboard.curriculumUnits || []).filter((unit) => !unit.planned && unit.lessonCount > 0);
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => {
    const units = activeUnits.filter((unit) => unit.label?.startsWith(level));
    const lessons = units.reduce((sum, unit) => sum + unit.lessonCount, 0);
    const completed = units.reduce((sum, unit) => sum + unit.completedCount, 0);
    const due = units.reduce((sum, unit) => sum + unit.dueCount, 0);
    return { level, lessons, completed, due, progress: lessons ? Math.round((completed / lessons) * 100) : 0 };
  }).filter((item) => item.lessons > 0);
  const totalPackages = levels.reduce((sum, item) => sum + item.lessons, 0);
  const completedPackages = levels.reduce((sum, item) => sum + item.completed, 0);
  const nextUnit = activeUnits.find((unit) => unit.status !== "complete") || activeUnits[activeUnits.length - 1];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title={german ? "Abrufstärke der letzten 14 Tage" : "Retrieval strength · 14 days"} icon={Target}>
          {retrieval.tracked ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-emerald-700">{german ? "Selbstständig" : "Independent"}</p><p className="mt-2 text-3xl font-black text-emerald-950">{retrieval.independent}</p><p className="mt-1 text-xs font-semibold text-emerald-800">{german ? "ohne sichtbare Hilfe richtig" : "correct without visible support"}</p></div>
                <div className="rounded-lg border border-sky-200 bg-sky-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-sky-700">{german ? "Mit Hilfe" : "Supported"}</p><p className="mt-2 text-3xl font-black text-sky-950">{retrieval.supported}</p><p className="mt-1 text-xs font-semibold text-sky-800">{german ? "richtig mit Hilfestufe" : "correct with support"}</p></div>
                <div className="rounded-lg border border-honey-200 bg-honey-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-honey-800">{german ? "Korrigiert" : "Corrected"}</p><p className="mt-2 text-3xl font-black text-honey-950">{retrieval.corrected || 0}</p><p className="mt-1 text-xs font-semibold text-honey-900">{german ? "nach einem Fehlversuch richtig" : "correct after an earlier miss"}</p></div>
                <div className="rounded-lg border border-coral-200 bg-coral-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-coral-700">{german ? "Noch unsicher" : "Unsuccessful"}</p><p className="mt-2 text-3xl font-black text-coral-950">{retrieval.unsuccessful}</p><p className="mt-1 text-xs font-semibold text-coral-800">{german ? "kommt früher erneut" : "returns sooner"}</p></div>
              </div>
              <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-end justify-between gap-3"><div><p className="font-black text-slate-950">{german ? "Anteil selbstständiger erfolgreicher Abrufe" : "Independent share of successful retrievals"}</p><p className="mt-1 text-sm font-semibold text-slate-600">{german ? "Hilfen sind erwünscht. Ziel ist, dass ihr Anteil mit späteren Wiederholungen natürlich sinkt." : "Support is useful; its share should naturally fall across later reviews."}</p></div><span className="text-2xl font-black text-lagoon-700">{retrieval.independentRate}%</span></div>
                <ProgressBar value={retrieval.independentRate} className="mt-3" />
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-5"><p className="font-black text-sky-950">{german ? "Die neue Abrufanalyse beginnt mit deiner nächsten Aufgabe." : "Retrieval analysis starts with your next exercise."}</p><p className="mt-2 text-sm font-semibold leading-6 text-sky-800">{german ? "Sie unterscheidet selbstständige Antworten, Lösungen mit Hilfe, korrigierte Zweitversuche und noch unsichere Abrufe – ohne dich zusätzlich zu bewerten." : "It separates independent, supported, corrected, and unsuccessful retrieval without adding extra grading."}</p></div>
          )}
        </Panel>

        <Panel title={german ? "Jetzt wichtig" : "What matters now"} icon={ListChecks}>
          <div className="grid gap-3">
            <div className="rounded-lg border border-honey-200 bg-honey-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-honey-800">{german ? "Fällige Festigung" : "Due retrieval"}</p><p className="mt-2 text-3xl font-black text-honey-950">{dashboard.stats.reviewDueToday || 0}</p><p className="mt-1 text-sm font-semibold text-honey-900">{german ? "Wörter, Satzmuster und abgeschlossene Pakete" : "words, patterns, and completed packages"}</p></div>
            <div className="rounded-lg border border-lagoon-200 bg-lagoon-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-lagoon-800">{german ? "Nächste Einheit" : "Next unit"}</p><p className="mt-2 font-black text-lagoon-950">{nextUnit ? localizedUnit(nextUnit, nativeLanguage).label + " · " + localizedUnit(nextUnit, nativeLanguage).title : "—"}</p><p className="mt-1 text-sm font-semibold text-lagoon-900">{nextUnit ? `${nextUnit.completedCount}/${nextUnit.lessonCount} ${german ? "Lernpakete sicher" : "packages secure"}` : ""}</p></div>
            <div className="grid grid-cols-2 gap-3"><InfoTile label={german ? "Wörter sicher" : "Words mastered"} value={dashboard.stats.masteredWords || 0} /><InfoTile label={german ? "Lernserie" : "Streak"} value={`${dashboard.stats.streakDays} ${german ? "Tage" : "days"}`} /></div>
          </div>
        </Panel>
      </div>

      <Panel title={german ? "Dein Kompetenzbild · letzte 30 Tage" : "Your skill evidence · last 30 days"} icon={BarChart3}>
        <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">{german ? "Nächster sinnvoller Ausgleich" : "Next useful balance"}</p>
          <p className="mt-2 text-lg font-black text-sky-950">{german ? nextFocusMeta.de : nextFocusMeta.en}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-sky-800">{german ? "Diese Empfehlung folgt echten Antworten, nicht XP. Bereiche ohne genügend Versuche bleiben bewusst als „noch nicht belastbar geübt“ sichtbar." : "This recommendation follows demonstrated answers, not XP. Areas without enough attempts deliberately remain marked as lacking reliable evidence."}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {skillProfile.skills.map((skill) => {
            const meta = skillMeta[skill.key] || skillMeta.vocabulary;
            const SkillIcon = meta.icon;
            return (
              <div key={skill.key} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-white text-lagoon-700 shadow-sm"><SkillIcon size={19} /></div>
                  <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-black text-slate-600">{stageLabels[skill.stage] || skill.stage}</span>
                </div>
                <h3 className="mt-3 font-black text-slate-950">{german ? meta.de : meta.en}</h3>
                {skill.attempted ? (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="rounded-md bg-emerald-50 px-2 py-2 text-emerald-900"><span className="block text-lg font-black">{skill.independent}</span>{german ? "selbstständig" : "independent"}</div>
                    <div className="rounded-md bg-white px-2 py-2 text-slate-700"><span className="block text-lg font-black">{skill.supported + skill.corrected}</span>{german ? "mit Hilfe" : "supported"}</div>
                    <div className="col-span-2 rounded-md bg-red-50 px-2 py-2 text-red-800"><span className="font-black">{skill.unsuccessful}</span> {german ? "noch unsichere Versuche" : "attempts still uncertain"}</div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{german ? "Noch keine auswertbare aktive Aufgabe. Gesehenes Material und XP zählen hier absichtlich nicht." : "No assessable active task yet. Exposure and XP deliberately do not count here."}</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">{german ? "Hördiktate zählen nur mit tatsächlich abgespieltem Ton als Hörverstehen; stille Alternativen werden nicht umetikettiert. Ausspracheerkennung zeigt Übungsevidenz, keine objektive Akzentnote." : "Dictation counts as listening only with actual audio; silent alternatives are not relabeled. Speech recognition is practice evidence, not an objective accent grade."}</p>
      </Panel>

      <Panel title={german ? "Fortschritt nach Sprachstufe" : "Progress by CEFR level"} icon={GraduationCap}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {levels.map((item) => (
            <div key={item.level} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center justify-between"><span className="text-xl font-black text-slate-950">{item.level}</span><span className="text-sm font-black text-lagoon-700">{item.progress}%</span></div>
              <ProgressBar value={item.progress} className="mt-3" />
              <p className="mt-3 text-xs font-bold text-slate-600">{item.completed}/{item.lessons} {german ? "Pakete sicher" : "packages secure"}</p>
              {!!item.due && <p className="mt-1 text-xs font-black text-honey-700">{item.due} {german ? "zu festigen" : "due"}</p>}
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-stone-200 bg-white p-4"><div><p className="font-black text-slate-950">{completedPackages}/{totalPackages} {german ? "Lernpakete aktuell sicher" : "packages currently secure"}</p><p className="mt-1 text-xs font-semibold text-slate-500">{german ? "Fällige Wiederholungen zählen erst danach wieder als sicher." : "Due reviews must be retrieved before counting as secure again."}</p></div><span className="text-2xl font-black text-lagoon-700">{totalPackages ? Math.round((completedPackages / totalPackages) * 100) : 0}%</span></div>
      </Panel>

      <Panel title={german ? "Lernrhythmus" : "Learning rhythm"} icon={Flame}>
        <div className="grid grid-cols-7 gap-2">
          {dashboard.streakCalendar.map((day) => {
            const date = new Date(`${day.date}T00:00:00Z`);
            return <div key={day.date} className="text-center"><div className="mb-2 text-[10px] font-black uppercase text-slate-500">{new Intl.DateTimeFormat(german ? "de-DE" : "en-US", { weekday: "narrow", timeZone: "UTC" }).format(date)}</div><div title={day.date} className={classNames("grid aspect-square place-items-center rounded-md border text-xs font-black", day.active ? "border-coral-500 bg-coral-500 text-white" : "border-stone-200 bg-stone-50 text-stone-300")}>{day.active ? "✓" : ""}</div></div>;
          })}
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-600">{german ? "Regelmäßigkeit hilft, aber ein ausgelassener Tag löscht kein gelerntes Wissen. Entscheidend sind verteilte, erfolgreiche Abrufe." : "Consistency helps, but a missed day does not erase learning. Spaced successful retrieval matters most."}</p>
      </Panel>

      <details className="rounded-lg border border-stone-200 bg-white shadow-sm">
        <summary className="cursor-pointer px-5 py-4 font-black text-slate-700">{german ? "Optionale XP-Rangliste anzeigen" : "Show optional XP leaderboard"}</summary>
        <div className="grid gap-2 border-t border-stone-200 p-4 md:grid-cols-2">
          {(dashboard.leaderboard || []).map((user, index) => <div key={user.id} className="flex items-center gap-3 rounded-lg border border-stone-200 p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-honey-100 text-sm font-black text-honey-700">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-black text-slate-950">{user.name}</p><p className="text-xs font-semibold text-slate-500">Level {user.level}</p></div><span className="text-sm font-black text-lagoon-700">{user.xp.toLocaleString()} XP</span></div>)}
        </div>
      </details>
    </div>
  );
}
