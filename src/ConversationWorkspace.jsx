import { useEffect, useRef, useState } from "react";
import { BookOpen, CheckCircle2, GraduationCap, ListChecks, Mic, RefreshCw, Target, Users } from "lucide-react";
import { conversationScenarios, matchConversationReply } from "./conversation-core.mjs";
import SpanishCharacterBar from "./SpanishCharacterBar.jsx";

export default function ConversationWorkspace({ nativeLanguage = "de", learningMode = "home", api, classNames, playSpeechSynthesisFallback, conversationUi, conversationMeaning, conversationSkill, Panel, PronunciationTools, SpeakCheck }) {
  const quiet = learningMode === "quiet";
  const [scenarioId, setScenarioId] = useState(conversationScenarios[0].id);
  const [mode, setMode] = useState("learn");
  const scenario = conversationScenarios.find((item) => item.id === scenarioId) || conversationScenarios[0];
  const [nodeId, setNodeId] = useState(conversationScenarios[0].start);
  const [messages, setMessages] = useState(() => {
    const start = scenario.nodes[scenario.start];
    return [{ id: `bot-${scenario.start}`, role: "bot", speaker: start.speaker, text: start.text, translation: start.translation }];
  });
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [sessionEvidence, setSessionEvidence] = useState({ independent: 0, supported: 0, unsuccessful: 0, spoken: 0 });
  const inputRef = useRef(null);
  const transcriptRef = useRef(null);
  const node = scenario.nodes[nodeId];

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages.length]);

  const loadScenario = (nextScenario, nextMode = mode) => {
    const start = nextScenario.nodes[nextScenario.start];
    setScenarioId(nextScenario.id);
    setMode(nextMode);
    setNodeId(nextScenario.start);
    setMessages([{ id: `bot-${nextScenario.start}`, role: "bot", speaker: start.speaker, text: start.text, translation: start.translation }]);
    setAnswer("");
    setFeedback(null);
    setHintLevel(0);
    setSessionEvidence({ independent: 0, supported: 0, unsuccessful: 0, spoken: 0 });
    if (!quiet) playSpeechSynthesisFallback(start.text, () => {});
  };

  const reset = () => {
    loadScenario(scenario);
  };

  const recordTurnEvidence = ({ isSuccessful, usedSupport, inputMethod }) => {
    const body = {
      mode: "authored-conversation",
      isSuccessful,
      usedSupport,
      sourceKey: `${scenario.id}:${nodeId}`
    };
    api("/api/practice-signals", { method: "POST", body: { ...body, skill: "conversation" } }).catch(() => null);
    if (inputMethod === "speech") {
      api("/api/practice-signals", { method: "POST", body: { ...body, skill: "speaking" } }).catch(() => null);
    }
  };

  const submitReply = (value = answer, inputMethod = "keyboard") => {
    if (node.complete || !String(value).trim()) return;
    const reply = matchConversationReply(node, value);
    const usedSupport = mode === "learn" || hintLevel > 0 || inputMethod === "selection";
    if (!reply) {
      recordTurnEvidence({ isSuccessful: false, usedSupport, inputMethod });
      setSessionEvidence((current) => ({ ...current, unsuccessful: current.unsuccessful + 1 }));
      setFeedback({
        correct: false,
        text: nativeLanguage === "de"
          ? "Diese Antwort passt noch nicht zu diesem Gesprächsschritt. Nutze eine der Antworten unten oder öffne eine Hilfe."
          : "That sentence does not fit this turn yet. Try one of the conversation moves below, or open the hint."
      });
      return;
    }

    const nextNode = scenario.nodes[reply.next];
    setMessages((current) => [
      ...current,
      { id: `user-${current.length}`, role: "user", text: String(value).trim(), skill: reply.skill },
      { id: `bot-${reply.next}-${current.length}`, role: "bot", speaker: nextNode.speaker, text: nextNode.text, translation: nextNode.translation }
    ]);
    recordTurnEvidence({ isSuccessful: true, usedSupport, inputMethod });
    setSessionEvidence((current) => ({
      ...current,
      independent: current.independent + (usedSupport ? 0 : 1),
      supported: current.supported + (usedSupport ? 1 : 0),
      spoken: current.spoken + (inputMethod === "speech" ? 1 : 0)
    }));
    setNodeId(reply.next);
    setAnswer("");
    setHintLevel(0);
    setFeedback({
      correct: true,
      text: nativeLanguage === "de"
        ? `Gut gemacht: Du hast den Gesprächsschritt „${conversationSkill(reply.skill, nativeLanguage)}“ sinnvoll eingesetzt.`
        : reply.feedback,
      skill: reply.skill
    });
    if (!quiet) playSpeechSynthesisFallback(nextNode.text, () => {});
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <section className="hidden overflow-hidden rounded-lg border border-slate-900 bg-slate-950 p-7 text-white shadow-soft sm:block">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-black text-lagoon-100">
              <Mic size={16} /> {nativeLanguage === "de" ? "Interaktives Gespräch" : "Conversation proof of concept"}
            </p>
            <h1 className="mt-3 text-2xl font-black sm:mt-4 sm:text-5xl">{conversationUi(scenario.title, nativeLanguage)}</h1>
            <p className="mt-3 hidden max-w-2xl font-semibold text-slate-300 sm:block">{conversationUi(scenario.description, nativeLanguage)}</p>
          </div>
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 font-black text-white hover:bg-white/10">
            <RefreshCw size={17} /> {nativeLanguage === "de" ? "Neu beginnen" : "Start again"}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 md:hidden">
        <select value={scenario.id} onChange={(event) => loadScenario(conversationScenarios.find((item) => item.id === event.target.value) || scenario)} className="min-w-0 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-black text-slate-800">
          {conversationScenarios.map((item) => <option key={item.id} value={item.id}>{conversationUi(item.title, nativeLanguage)}</option>)}
        </select>
        <button onClick={() => loadScenario(scenario, mode === "learn" ? "conversation" : "learn")} className={classNames("rounded-md border px-3 py-2 text-xs font-black", mode === "learn" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-coral-300 bg-coral-50 text-coral-800")}>
          {mode === "learn" ? (nativeLanguage === "de" ? "Lernen" : "Learn") : (nativeLanguage === "de" ? "Gespräch" : "Conversation")}
        </button>
      </div>
      {quiet && <div className="rounded-lg border border-coral-200 bg-coral-50 px-4 py-3 text-sm font-bold text-coral-900"><BookOpen className="mr-2 inline" size={17} /> Leisemodus: Antworten lesen, auswählen oder tippen. Ton und Mikrofon bleiben ausgeschaltet.</div>}

      <div className="hidden md:block">
      <Panel title={nativeLanguage === "de" ? "Gespräch auswählen" : "Choose your conversation"} icon={ListChecks}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {conversationScenarios.map((item) => (
            <button key={item.id} onClick={() => loadScenario(item)} className={classNames("rounded-lg border p-4 text-left transition", scenario.id === item.id ? "border-lagoon-500 bg-lagoon-50 ring-2 ring-lagoon-100" : "border-stone-200 bg-white hover:border-lagoon-300")}>
              <span className="text-xs font-black uppercase tracking-wide text-lagoon-700">{conversationUi(item.level, nativeLanguage)}</span>
              <span className="mt-1 block font-black text-slate-950">{conversationUi(item.title, nativeLanguage)}</span>
              <span className="mt-2 block text-xs font-semibold text-slate-500">{conversationUi(item.description, nativeLanguage)}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button onClick={() => loadScenario(scenario, "learn")} className={classNames("rounded-lg border px-4 py-4 text-left", mode === "learn" ? "border-emerald-400 bg-emerald-50" : "border-stone-200 bg-stone-50")}>
            <span className="flex items-center gap-2 font-black text-slate-950"><GraduationCap size={19} /> {nativeLanguage === "de" ? "Lernmodus" : "Learn mode"}</span>
            <span className="mt-1 block text-sm font-semibold text-slate-600">{nativeLanguage === "de" ? "Sieh passende Antworten mit Bedeutung und lerne Schritt für Schritt, wie ein Gespräch weitergeht." : "See translated replies and learn what each conversational move does."}</span>
          </button>
          <button onClick={() => loadScenario(scenario, "conversation")} className={classNames("rounded-lg border px-4 py-4 text-left", mode === "conversation" ? "border-coral-400 bg-coral-50" : "border-stone-200 bg-stone-50")}>
            <span className="flex items-center gap-2 font-black text-slate-950"><Mic size={19} /> {nativeLanguage === "de" ? "Gesprächsmodus" : "Conversation mode"}</span>
            <span className="mt-1 block text-sm font-semibold text-slate-600">{nativeLanguage === "de" ? "Antworte selbstständig und decke nur so viel Hilfe auf, wie du gerade brauchst." : "Answer independently. Ask for a starter, useful words, or full replies only when stuck."}</span>
          </button>
        </div>
      </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel
          title={nativeLanguage === "de" ? "Laufendes Gespräch" : "Live conversation"}
          icon={Users}
          action={<span className="hidden rounded-full bg-lagoon-50 px-3 py-1 text-xs font-black text-lagoon-700 sm:inline">{nativeLanguage === "de" ? "Ohne KI · didaktisch erstellt" : "No AI · authored branches"}</span>}
        >
          <div ref={transcriptRef} className="max-h-[250px] space-y-3 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-3 sm:max-h-[430px] sm:space-y-4 sm:p-4">
            {messages.map((message) => (
              <div key={message.id} className={classNames("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <div className={classNames("max-w-[92%] rounded-2xl px-3 py-2 sm:max-w-[85%] sm:px-4 sm:py-3", message.role === "user" ? "rounded-br-sm bg-lagoon-600 text-white" : "rounded-bl-sm border border-stone-200 bg-white text-slate-900")}>
                  <p className="text-xs font-black uppercase tracking-wide opacity-65">{message.role === "user" ? (nativeLanguage === "de" ? "Du" : "You") : message.speaker || (nativeLanguage === "de" ? "Gesprächspartner" : "Partner")}</p>
                  <p className="mt-1 text-base font-black sm:text-lg">{message.text}</p>
                  {conversationMeaning(message.translation, nativeLanguage) && <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">{conversationMeaning(message.translation, nativeLanguage)}</p>}
                  {message.role === "bot" && !quiet && <div className="mt-2"><PronunciationTools text={message.text} compact allowCopy={false} nativeLanguage={nativeLanguage} /></div>}
                  {message.skill && <p className="mt-2 text-xs font-black text-lagoon-100">{nativeLanguage === "de" ? "Gesprächsschritt" : "Move"}: {conversationSkill(message.skill, nativeLanguage)}</p>}
                </div>
              </div>
            ))}
          </div>

          {node.complete ? (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <p className="flex items-center gap-2 text-lg font-black text-emerald-900"><CheckCircle2 size={21} /> {nativeLanguage === "de" ? "Gespräch abgeschlossen" : "Conversation complete"}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-800">{nativeLanguage === "de" ? "Du hast diesen Gesprächsweg bis zum natürlichen Abschluss geführt. Entscheidend ist nicht, alles sofort frei zu können, sondern bei jedem Durchgang weniger Hilfe zu benötigen." : "You carried this path to a natural close. The goal is to need a little less support on each later run."}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
                <div className="rounded-md bg-white px-2 py-2 text-emerald-900"><span className="block text-lg font-black">{sessionEvidence.independent}</span>{nativeLanguage === "de" ? "selbstständig" : "independent"}</div>
                <div className="rounded-md bg-white px-2 py-2 text-sky-900"><span className="block text-lg font-black">{sessionEvidence.supported}</span>{nativeLanguage === "de" ? "mit Hilfe" : "supported"}</div>
                <div className="rounded-md bg-white px-2 py-2 text-lagoon-900"><span className="block text-lg font-black">{sessionEvidence.spoken}</span>{nativeLanguage === "de" ? "gesprochen" : "spoken"}</div>
                <div className="rounded-md bg-white px-2 py-2 text-red-800"><span className="block text-lg font-black">{sessionEvidence.unsuccessful}</span>{nativeLanguage === "de" ? "noch unsicher" : "uncertain"}</div>
              </div>
              <button onClick={reset} className="mt-4 rounded-md bg-emerald-600 px-5 py-2 font-black text-white hover:bg-emerald-700">{nativeLanguage === "de" ? "Anderen Weg ausprobieren" : "Try another path"}</button>
            </div>
          ) : (
            <div className="mt-4">
              {mode === "learn" ? <div className="rounded-lg border border-lagoon-200 bg-lagoon-50 p-3 sm:p-4">
                <p className="text-sm font-black text-lagoon-950 sm:text-base">{nativeLanguage === "de" ? "Wähle, was du sagen möchtest" : "Choose what you want to say"}</p>
                <p className="mt-1 text-xs font-semibold text-lagoon-800 sm:text-sm">{conversationUi(node.prompt, nativeLanguage)}</p>
                <div className="-mx-1 mt-2 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
                  {node.replies.map((reply) => (
                    <button key={reply.id} onClick={() => submitReply(reply.label, "selection")} className="min-w-[210px] snap-start rounded-md border border-lagoon-200 bg-white px-3 py-2 text-left hover:border-lagoon-400 hover:shadow-sm sm:min-w-0 sm:py-3">
                      <span className="block text-sm font-black text-slate-950 sm:text-base">{reply.label}</span>
                      <span className="mt-1 block text-xs font-semibold text-slate-500 sm:text-sm">{conversationMeaning(reply.meaning, nativeLanguage)}</span>
                      <span className="mt-1 block text-[10px] font-black uppercase tracking-wide text-lagoon-700 sm:mt-2 sm:text-xs">{conversationSkill(reply.skill, nativeLanguage)}</span>
                    </button>
                  ))}
                </div>
              </div> : <div className="rounded-lg border border-coral-200 bg-coral-50 p-4">
                <p className="font-black text-coral-950">{nativeLanguage === "de" ? "Gesprächsmodus" : "Conversation mode"}</p>
                <p className="mt-1 text-sm font-semibold text-coral-800">{nativeLanguage === "de" ? "Antworte ohne Auswahl oder decke schrittweise genau die Hilfe auf, die du brauchst." : "Respond without choices—or reveal only as much help as you need."}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => setHintLevel((value) => Math.max(value, 1))} className="rounded-md border border-coral-200 bg-white px-3 py-2 text-sm font-black text-coral-700">{nativeLanguage === "de" ? "Satzanfang" : "Sentence starter"}</button>
                  <button onClick={() => setHintLevel((value) => Math.max(value, 2))} className="rounded-md border border-coral-200 bg-white px-3 py-2 text-sm font-black text-coral-700">{nativeLanguage === "de" ? "Nützliche Wörter" : "Useful words"}</button>
                  <button onClick={() => setHintLevel(3)} className="rounded-md border border-coral-200 bg-white px-3 py-2 text-sm font-black text-coral-700">{nativeLanguage === "de" ? "Antworten zeigen" : "Show replies"}</button>
                </div>
                {hintLevel >= 1 && <p className="mt-3 rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-700"><span className="text-coral-700">{nativeLanguage === "de" ? "Beginne mit:" : "Start with:"}</span> {node.starter}</p>}
                {hintLevel >= 2 && <div className="mt-2 flex flex-wrap gap-2">{node.words.map((word) => <button key={word} onClick={() => setAnswer((current) => `${current}${current ? " " : ""}${word}`)} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-700">{word}</button>)}</div>}
                {hintLevel >= 3 && <div className="mt-3 grid gap-2">{node.replies.map((reply) => <button key={reply.id} onClick={() => submitReply(reply.label, "selection")} className="rounded-md border border-coral-100 bg-white px-3 py-2 text-left"><span className="font-black text-slate-900">{reply.label}</span><span className="block text-xs font-semibold text-slate-500">{conversationMeaning(reply.meaning, nativeLanguage)}</span></button>)}</div>}
              </div>}
              <p className="mt-5 font-black text-slate-950">{mode === "learn" ? (nativeLanguage === "de" ? "Oder formuliere selbst" : "Or make your own reply") : (nativeLanguage === "de" ? "Deine Antwort" : "Your reply")}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{nativeLanguage === "de" ? "Tippe oder sprich – nach der Spracherkennung antwortet Lucía automatisch." : "Type it, or speak and Lucía will answer automatically."}</p>
              <div className="mt-3 flex gap-2">
                <input
                  ref={inputRef}
                  value={answer}
                  onChange={(event) => { setAnswer(event.target.value); setFeedback(null); }}
                  onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); submitReply(); } }}
                  className="min-w-0 flex-1 rounded-md border border-stone-200 px-4 py-3 font-bold outline-none focus:border-lagoon-500"
                  placeholder={nativeLanguage === "de" ? "Auf Spanisch antworten" : "Answer in Spanish"}
                />
                <button disabled={!answer.trim()} onClick={() => submitReply()} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 disabled:opacity-50">
                  {nativeLanguage === "de" ? "Senden" : "Send"}
                </button>
              </div>
              <SpanishCharacterBar value={answer} onChange={(value) => { setAnswer(value); setFeedback(null); }} inputRef={inputRef} nativeLanguage={nativeLanguage} />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {!quiet && <SpeakCheck nativeLanguage={nativeLanguage} onTranscript={(transcript) => { setAnswer(transcript); setFeedback(null); submitReply(transcript, "speech"); }} />}
                <span className="text-xs font-bold text-slate-500">{quiet ? "Leise antworten: tippen oder eine Lernantwort auswählen." : (nativeLanguage === "de" ? "Die Antwort wird nach der Spracherkennung automatisch gesendet." : "Speech is sent automatically when recognition finishes.")}</span>
              </div>
              {feedback && (
                <div className={classNames("mt-4 rounded-md border px-4 py-3 text-sm font-bold", feedback.correct ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700")}>
                  {feedback.text}
                </div>
              )}
            </div>
          )}
        </Panel>

        <aside className="hidden space-y-5 lg:block">
          {!node.complete && <Panel title={mode === "learn" ? (nativeLanguage === "de" ? "Lernmodus" : "Learning mode") : (nativeLanguage === "de" ? "Gesprächsmodus" : "Conversation mode")} icon={mode === "learn" ? GraduationCap : Mic}><p className="text-sm font-semibold text-slate-600">{mode === "learn" ? (nativeLanguage === "de" ? "Du musst noch nichts erfinden. Lies die Möglichkeiten und wähle eine aus. Freies Abrufen folgt, sobald dir die Muster vertraut sind." : "You do not need to invent an answer. Read the choices and tap one. Free recall comes after the patterns feel familiar.") : (nativeLanguage === "de" ? "Versuche es zuerst selbst. Eine Hilfe aufzudecken ist kein Fehler: Sie zeigt, welches Muster noch mehr geführte Wiederholung braucht." : "Try independently first. Revealing a hint is not failure—it shows which phrase needs more guided exposure.")}</p></Panel>}
          <Panel title={nativeLanguage === "de" ? "Gesprächsformel" : "Conversation formula"} icon={Target}>
            <div className="grid gap-2 text-sm font-bold text-slate-700">
              <div className="rounded-md bg-coral-50 px-3 py-3"><span className="text-coral-700">1. {nativeLanguage === "de" ? "Antworten" : "Answer"}</span><br />Muy bien, gracias.</div>
              <div className="rounded-md bg-honey-50 px-3 py-3"><span className="text-honey-700">2. {nativeLanguage === "de" ? "Detail ergänzen" : "Add a detail"}</span><br />Estoy un poco cansado.</div>
              <div className="rounded-md bg-lagoon-50 px-3 py-3"><span className="text-lagoon-700">3. {nativeLanguage === "de" ? "Zurückfragen" : "Ask back"}</span><br />¿Y tú? ¿Qué haces hoy?</div>
            </div>
            {!node.complete && <p className="mt-4 rounded-md border border-stone-200 bg-white px-3 py-3 text-sm font-semibold text-slate-600"><span className="font-black">{nativeLanguage === "de" ? "Beispiel:" : "Hint:"}</span> {node.hint}</p>}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
