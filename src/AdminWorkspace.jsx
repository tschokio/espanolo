import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Image, ListChecks, PenTool, Shield } from "lucide-react";

export default function AdminWorkspace({ refreshDashboard, nativeLanguage = "de", api, Panel, InfoTile, AdminForm, TextInput, classNames }) {
  const german = nativeLanguage === "de";
  const [content, setContent] = useState(null);
  const [message, setMessage] = useState("");
  const [topicForm, setTopicForm] = useState({ title: "", description: "", cefrLevel: "A1", imageKey: "" });
  const [lessonForm, setLessonForm] = useState({
    title: "",
    summary: "",
    cefrLevel: "A1",
    theme: "Grammar",
    situation: "general",
    topicId: "",
    imageKey: "",
    outcomes: "",
    conceptKeysText: "",
    reviewSummary: ""
  });
  const [exerciseForm, setExerciseForm] = useState({
    lessonId: "",
    type: "MULTIPLE_CHOICE",
    prompt: "",
    instruction: "",
    questionText: "",
    correctAnswer: "",
    acceptedAnswers: "",
    alternatives: "",
    answerGoal: "",
    accentStrict: false,
    requiresArticle: false,
    explanation: "",
    imageKey: "",
    options: "soy:true, estoy:false"
  });
  const [assetForm, setAssetForm] = useState({ title: "", category: "Vocabulary", gridSize: 4, canvasSize: 1254, imagePath: "", promptMarkdown: "" });

  const load = async () => {
    const data = await api("/api/admin/content");
    setContent(data);
    setLessonForm((form) => ({ ...form, topicId: form.topicId || data.topics[0]?.id || "" }));
    setExerciseForm((form) => ({ ...form, lessonId: form.lessonId || data.lessons[0]?.id || "" }));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (path, body) => {
    setMessage("");
    await api(path, { method: "POST", body });
    setMessage(german ? "Gespeichert" : "Saved");
    await load();
    await refreshDashboard();
  };

  if (!content) return <Panel title="Admin">{german ? "Inhaltswerkzeuge werden geladen..." : "Loading content tools..."}</Panel>;

  const parsedOptions = exerciseForm.options
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [value, truthy] = item.split(":").map((part) => part.trim());
      return { text: value, value, isCorrect: truthy === "true" };
    });
  const parsedAcceptedAnswers = exerciseForm.acceptedAnswers
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  const parsedAlternatives = exerciseForm.alternatives
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((answer) => ({ answer }));
  const validationFields = {
    goal: exerciseForm.answerGoal || undefined,
    accentStrict: Boolean(exerciseForm.accentStrict),
    requiresArticle: Boolean(exerciseForm.requiresArticle)
  };

  return (
    <div className="space-y-5">
      <Panel title={german ? "Admin-Überblick" : "Admin Overview"} icon={Shield} action={message && <span className="text-sm font-bold text-emerald-600">{message}</span>}>
        <div className="grid gap-3 sm:grid-cols-5">
          <InfoTile label={german ? "Themen" : "Topics"} value={content.topics.length} />
          <InfoTile label={german ? "Lektionen" : "Lessons"} value={content.lessons.length} />
          <InfoTile label={german ? "Aufgaben" : "Exercises"} value={content.exercises.length} />
          <InfoTile label={german ? "Medien" : "Assets"} value={content.assets.length} />
          <InfoTile label={german ? "Nutzer" : "Users"} value={content.users.length} />
        </div>
      </Panel>

      <SystemStatusPanel system={content.system} nativeLanguage={nativeLanguage} />
      <CurriculumQaPanel qa={content.curriculumQa} nativeLanguage={nativeLanguage} />

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminForm
          title={german ? "Grammatikthema" : "Grammar Topic"}
          icon={GraduationCap}
          onSubmit={() => submit("/api/admin/topics", topicForm)}
          submitLabel={german ? "Speichern" : "Save"}
        >
          <TextInput label={german ? "Titel" : "Title"} value={topicForm.title} onChange={(title) => setTopicForm({ ...topicForm, title })} />
          <TextInput label={german ? "Beschreibung" : "Description"} value={topicForm.description} onChange={(description) => setTopicForm({ ...topicForm, description })} />
          <TextInput label="CEFR" value={topicForm.cefrLevel} onChange={(cefrLevel) => setTopicForm({ ...topicForm, cefrLevel })} />
          <TextInput label={german ? "Bildschlüssel" : "Image key"} value={topicForm.imageKey} onChange={(imageKey) => setTopicForm({ ...topicForm, imageKey })} />
        </AdminForm>

        <AdminForm title={german ? "Lektion" : "Lesson"} icon={BookOpen} onSubmit={() => submit("/api/admin/lessons", lessonForm)} submitLabel={german ? "Speichern" : "Save"}>
          <TextInput label={german ? "Titel" : "Title"} value={lessonForm.title} onChange={(title) => setLessonForm({ ...lessonForm, title })} />
          <TextInput label={german ? "Zusammenfassung" : "Summary"} value={lessonForm.summary} onChange={(summary) => setLessonForm({ ...lessonForm, summary })} />
          <select
            value={lessonForm.topicId}
            onChange={(event) => setLessonForm({ ...lessonForm, topicId: event.target.value })}
            className="rounded-md border border-stone-200 px-3 py-3"
          >
            {content.topics.map((topic) => (
              <option key={topic.id} value={topic.id}>{topic.title}</option>
            ))}
          </select>
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput label="CEFR" value={lessonForm.cefrLevel} onChange={(cefrLevel) => setLessonForm({ ...lessonForm, cefrLevel })} />
            <TextInput label={german ? "Thema" : "Theme"} value={lessonForm.theme} onChange={(theme) => setLessonForm({ ...lessonForm, theme })} />
            <TextInput label="Situation" value={lessonForm.situation} onChange={(situation) => setLessonForm({ ...lessonForm, situation })} />
          </div>
          <TextInput label={german ? "Lernziele" : "Outcomes"} value={lessonForm.outcomes} onChange={(outcomes) => setLessonForm({ ...lessonForm, outcomes })} />
          <TextInput label={german ? "Konzeptschlüssel" : "Concept keys"} value={lessonForm.conceptKeysText} onChange={(conceptKeysText) => setLessonForm({ ...lessonForm, conceptKeysText })} />
          <TextInput label={german ? "Wiederholungszusammenfassung" : "Review summary"} value={lessonForm.reviewSummary} onChange={(reviewSummary) => setLessonForm({ ...lessonForm, reviewSummary })} />
          <TextInput label={german ? "Bildschlüssel" : "Image key"} value={lessonForm.imageKey} onChange={(imageKey) => setLessonForm({ ...lessonForm, imageKey })} />
        </AdminForm>

        <AdminForm
          title={german ? "Aufgabe" : "Exercise"}
          icon={PenTool}
          submitLabel={german ? "Speichern" : "Save"}
          onSubmit={() =>
            submit("/api/admin/exercises", {
              ...exerciseForm,
              options: parsedOptions,
              answerJson:
                exerciseForm.type === "SENTENCE_BUILDER"
                  ? { correctWords: exerciseForm.correctAnswer.split(/\s+/).filter(Boolean), ...validationFields }
                  : {
                      correct: exerciseForm.correctAnswer,
                      accepted: [exerciseForm.correctAnswer, ...parsedAcceptedAnswers].filter(Boolean),
                      alternatives: parsedAlternatives,
                      ...validationFields
                    }
            })
          }
        >
          <select
            value={exerciseForm.lessonId}
            onChange={(event) => setExerciseForm({ ...exerciseForm, lessonId: event.target.value })}
            className="rounded-md border border-stone-200 px-3 py-3"
          >
            {content.lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
            ))}
          </select>
          <select
            value={exerciseForm.type}
            onChange={(event) => setExerciseForm({ ...exerciseForm, type: event.target.value })}
            className="rounded-md border border-stone-200 px-3 py-3"
          >
            {[
              "MULTIPLE_CHOICE",
              "CLOZE",
              "SENTENCE_BUILDER",
              "CONJUGATION",
              "ARTICLE_MATCH",
              "TRANSLATION",
              "ERROR_CORRECTION",
              "SHORT_ANSWER",
              "TRANSFORMATION",
              "DIALOGUE_REPLY",
              "LISTENING_DICTATION",
              "WRITING_PROMPT"
            ].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <TextInput label={german ? "Arbeitsauftrag" : "Prompt"} value={exerciseForm.prompt} onChange={(prompt) => setExerciseForm({ ...exerciseForm, prompt })} />
          <TextInput label={german ? "Frage" : "Question"} value={exerciseForm.questionText} onChange={(questionText) => setExerciseForm({ ...exerciseForm, questionText })} />
          <TextInput label={german ? "Richtige Antwort" : "Correct answer"} value={exerciseForm.correctAnswer} onChange={(correctAnswer) => setExerciseForm({ ...exerciseForm, correctAnswer })} />
          <TextInput label={german ? "Akzeptierte Antworten" : "Accepted answers"} value={exerciseForm.acceptedAnswers} onChange={(acceptedAnswers) => setExerciseForm({ ...exerciseForm, acceptedAnswers })} />
          <TextInput label={german ? "Alternativen" : "Alternatives"} value={exerciseForm.alternatives} onChange={(alternatives) => setExerciseForm({ ...exerciseForm, alternatives })} />
          <TextInput label={german ? "Prüfziel" : "Validation goal"} value={exerciseForm.answerGoal} onChange={(answerGoal) => setExerciseForm({ ...exerciseForm, answerGoal })} />
          <label className="flex items-center justify-between rounded-md border border-stone-200 px-3 py-3 text-sm font-bold text-slate-700">
            {german ? "Akzente strikt prüfen" : "Strict accents"}
            <input
              type="checkbox"
              checked={exerciseForm.accentStrict}
              onChange={(event) => setExerciseForm({ ...exerciseForm, accentStrict: event.target.checked })}
              className="h-5 w-5 accent-lagoon-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-md border border-stone-200 px-3 py-3 text-sm font-bold text-slate-700">
            {german ? "Artikel erforderlich" : "Requires article"}
            <input
              type="checkbox"
              checked={exerciseForm.requiresArticle}
              onChange={(event) => setExerciseForm({ ...exerciseForm, requiresArticle: event.target.checked })}
              className="h-5 w-5 accent-lagoon-500"
            />
          </label>
          <TextInput label={german ? "Optionen" : "Options"} value={exerciseForm.options} onChange={(options) => setExerciseForm({ ...exerciseForm, options })} />
          <TextInput label={german ? "Erklärung" : "Explanation"} value={exerciseForm.explanation} onChange={(explanation) => setExerciseForm({ ...exerciseForm, explanation })} />
          <TextInput label={german ? "Bildschlüssel" : "Image key"} value={exerciseForm.imageKey} onChange={(imageKey) => setExerciseForm({ ...exerciseForm, imageKey })} />
        </AdminForm>

        <AdminForm title={german ? "Bildauftrag" : "Asset Prompt"} icon={Image} onSubmit={() => submit("/api/admin/assets", assetForm)} submitLabel={german ? "Speichern" : "Save"}>
          <TextInput label={german ? "Titel" : "Title"} value={assetForm.title} onChange={(title) => setAssetForm({ ...assetForm, title })} />
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput label={german ? "Kategorie" : "Category"} value={assetForm.category} onChange={(category) => setAssetForm({ ...assetForm, category })} />
            <TextInput label={german ? "Raster" : "Grid"} value={assetForm.gridSize} onChange={(gridSize) => setAssetForm({ ...assetForm, gridSize })} />
            <TextInput label={german ? "Leinwand" : "Canvas"} value={assetForm.canvasSize} onChange={(canvasSize) => setAssetForm({ ...assetForm, canvasSize })} />
          </div>
          <TextInput label={german ? "Bildpfad" : "Image path"} value={assetForm.imagePath} onChange={(imagePath) => setAssetForm({ ...assetForm, imagePath })} />
          <textarea
            value={assetForm.promptMarkdown}
            onChange={(event) => setAssetForm({ ...assetForm, promptMarkdown: event.target.value })}
            className="min-h-36 rounded-md border border-stone-200 px-3 py-3"
            placeholder={german ? "Erstelle ein 1200×1200-Bild, unterteilt in ..." : "Create a 1200x1200 image divided into..."}
          />
        </AdminForm>
      </div>
    </div>
  );
}

function CurriculumQaPanel({ qa, nativeLanguage = "de" }) {
  if (!qa) return null;
  const german = nativeLanguage === "de";
  const counts = qa.counts || {};
  const issueTotal = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0);
  const issueSections = [
    [german ? "Fehlende Lernziele" : "Missing outcomes", qa.missingOutcomes],
    [german ? "Fehlende Wiederholungszusammenfassungen" : "Missing review summaries", qa.missingReviewSummary],
    [german ? "Zu wenige Aufgaben" : "Low exercise count", qa.lowExerciseLessons],
    [german ? "Probleme mit Einheiten" : "Unit issues", qa.unitIssues],
    [german ? "Wiederholte Bilder" : "Repeated images", qa.repeatedImages]
  ].filter(([, items]) => items?.length);

  return (
    <Panel
      title={german ? "Curriculum-Qualitätsprüfung" : "Curriculum QA"}
      icon={ListChecks}
      action={
        <span className={classNames("rounded-full px-3 py-1 text-xs font-black", issueTotal ? "bg-honey-100 text-honey-800" : "bg-emerald-100 text-emerald-800")}>
          {issueTotal ? `${issueTotal} ${german ? "Prüfpunkte" : "checks"}` : german ? "Sauber" : "Clean"}
        </span>
      }
    >
      <div className="grid gap-3 sm:grid-cols-5">
        <InfoTile label={german ? "Lernziele" : "Outcomes"} value={counts.missingOutcomes || 0} />
        <InfoTile label={german ? "Zusammenfassungen" : "Summaries"} value={counts.missingReviewSummary || 0} />
        <InfoTile label={german ? "Dünne Lektionen" : "Thin lessons"} value={counts.lowExerciseLessons || 0} />
        <InfoTile label={german ? "Einheiten" : "Units"} value={counts.unitIssues || 0} />
        <InfoTile label={german ? "Bilder" : "Images"} value={counts.repeatedImages || 0} />
      </div>
      {issueSections.length ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {issueSections.map(([title, items]) => (
            <div key={title} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
              <div className="mt-2 grid gap-2 text-sm font-bold text-slate-700">
                {items.slice(0, 5).map((item) => (
                  <span key={item.slug || item.imageKey}>{item.label || item.title || item.imageKey} {item.count ? `(${item.count})` : ""}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm font-semibold text-slate-600">{german ? "Keine Curriculum-Probleme gefunden." : "No curriculum QA issues found."}</p>
      )}
    </Panel>
  );
}

function SystemStatusPanel({ system, nativeLanguage = "de" }) {
  if (!system) return null;
  const german = nativeLanguage === "de";
  const active = system.activeCommit;
  const checkedOut = system.checkedOutCommit;
  const statusClass =
    system.restartRequired || system.behind > 0
      ? "bg-honey-100 text-honey-800"
      : system.dirty
        ? "bg-sky-100 text-sky-800"
        : "bg-emerald-100 text-emerald-800";

  return (
    <Panel
      title={german ? "Aktiver Code" : "Active Code"}
      icon={Shield}
      action={<span className={classNames("rounded-full px-3 py-1 text-xs font-black", statusClass)}>{german ? ({ "Restart required": "Neustart erforderlich", "Uncommitted local changes": "Lokale Änderungen", "Behind upstream": "Hinter Upstream", "Active": "Aktiv" }[system.status] || system.status) : system.status}</span>}
    >
      <div className="grid gap-3 lg:grid-cols-4">
        <InfoTile label={german ? "Aktiv" : "Active"} value={active?.shortHash || (german ? "unbekannt" : "unknown")} />
        <InfoTile label={german ? "Ausgecheckt" : "Checked out"} value={checkedOut?.shortHash || (german ? "unbekannt" : "unknown")} />
        <InfoTile label={german ? "Branch" : "Branch"} value={system.branch || (german ? "unbekannt" : "unknown")} />
        <InfoTile label={german ? "Gestartet" : "Started"} value={system.processStartedAt ? new Date(system.processStartedAt).toLocaleString(german ? "de-DE" : "en-US") : german ? "unbekannt" : "unknown"} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Bereitstellungsstatus" : "Deployment State"}</p>
          <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700">
            <div className="flex justify-between gap-3">
              <span>{german ? "Neustart nötig" : "Restart needed"}</span>
              <span className={system.restartRequired ? "text-honey-700" : "text-emerald-700"}>{system.restartRequired ? (german ? "Ja" : "Yes") : (german ? "Nein" : "No")}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{german ? "Nicht gespeicherte Dateien" : "Uncommitted files"}</span>
              <span className={system.dirty ? "text-sky-700" : "text-emerald-700"}>{system.dirty ? system.changes.length : german ? "Nein" : "No"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Upstream</span>
              <span>{system.upstream || (german ? "nicht eingerichtet" : "not configured")}</span>
            </div>
            {system.upstream && (
              <div className="flex justify-between gap-3">
                <span>{german ? "Voraus / zurück" : "Ahead / behind"}</span>
                <span>{system.ahead || 0} / {system.behind || 0}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Aktueller Commit" : "Current Commit"}</p>
          <p className="mt-3 font-black text-slate-950">{active?.subject || (german ? "Commit nicht verfügbar" : "Commit unavailable")}</p>
          <p className="mt-1 text-sm font-bold text-slate-600">{active?.hash || (german ? "unbekannt" : "unknown")}</p>
          {checkedOut?.hash && active?.hash && checkedOut.hash !== active.hash && (
            <p className="mt-3 rounded-md border border-honey-200 bg-honey-50 px-3 py-2 text-sm font-bold text-honey-900">
              {german ? "Der ausgecheckte Stand ist neuer als der laufende Dienst. Starte den Dienst neu, um ihn zu aktivieren." : "Checkout is newer than the running service. Restart the service to activate it."}
            </p>
          )}
        </div>
      </div>

      {!!system.changes?.length && (
        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">{german ? "Lokale Änderungen" : "Local Changes"}</p>
          <div className="mt-2 grid gap-1 font-mono text-xs text-slate-700">
            {system.changes.slice(0, 8).map((change) => (
              <span key={change}>{change}</span>
            ))}
          </div>
        </div>
      )}

      {!!system.recentCommits?.length && (
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Letzte Commits" : "Recent Commits"}</p>
          <div className="mt-2 grid gap-1 font-mono text-xs text-slate-700">
            {system.recentCommits.map((commit) => (
              <span key={commit}>{commit}</span>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
