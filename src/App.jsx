import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Flame,
  Gamepad2,
  Gift,
  GraduationCap,
  Home,
  Image,
  ExternalLink,
  ListChecks,
  LogOut,
  Medal,
  NotebookTabs,
  PenTool,
  Plus,
  Puzzle,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Volume2,
  Wand2,
  XCircle
} from "lucide-react";

const navItems = [
  { key: "path", label: "Path", icon: Target },
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "words", label: "Words", icon: NotebookTabs },
  { key: "lessons", label: "Lessons", icon: BookOpen },
  { key: "grammar", label: "Grammar", icon: GraduationCap },
  { key: "games", label: "Mini Games", icon: Gamepad2 },
  { key: "challenges", label: "Challenges", icon: Trophy },
  { key: "progress", label: "Progress", icon: BarChart3 },
  { key: "admin", label: "Admin", icon: Shield, adminOnly: true },
  { key: "settings", label: "Settings", icon: Settings }
];

const imageSheets = {
  "city-transport": { src: "/images/city-transport.webp", grid: 4 },
  "classroom-basics": { src: "/images/classroom-basics.webp", grid: 4 },
  "clothing-basics": { src: "/images/clothing-basics.webp", grid: 5 },
  "daily-actions": { src: "/images/daily-actions.webp", grid: 5 },
  "emotions-and-states": { src: "/images/emotions-and-states.webp", grid: 4 },
  "food-and-ordering": { src: "/images/food-and-ordering.webp", grid: 5 },
  "fruit-and-produce": { src: "/images/fruit-and-produce.webp", grid: 5 },
  "grammar-scenes": { src: "/images/grammar-scenes.webp", grid: 4 },
  "home-objects": { src: "/images/home-objects.webp", grid: 5 },
  "people-and-family": { src: "/images/people-and-family.webp", grid: 4 },
  "places-around-town": { src: "/images/places-around-town.webp", grid: 4 },
  "rewards-and-progress": { src: "/images/rewards-and-progress.webp", grid: 4 },
  "travel-and-survival": { src: "/images/travel-and-survival.webp", grid: 5 },
  "weather-and-time": { src: "/images/weather-and-time.webp", grid: 4 }
};

const badgeImageKeys = {
  "on-fire": "rewards-and-progress:1",
  "grammar-guru": "rewards-and-progress:2",
  "challenge-ace": "rewards-and-progress:3",
  "article-scout": "rewards-and-progress:11"
};

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseImageKey(imageKey) {
  const [sheetId, indexText] = String(imageKey || "").split(":");
  const sheet = imageSheets[sheetId];
  const index = Number(indexText || 1);
  if (!sheet || !Number.isFinite(index) || index < 1 || index > sheet.grid * sheet.grid) {
    return null;
  }
  const row = Math.floor((index - 1) / sheet.grid);
  const col = (index - 1) % sheet.grid;
  return { ...sheet, row, col, index };
}

function dictionaryLinks(text) {
  const encoded = encodeURIComponent(text || "");
  return {
    spanishDict: `https://www.spanishdict.com/translate/${encoded}`,
    leo: `https://dict.leo.org/alem%C3%A1n-espa%C3%B1ol/${encoded}`
  };
}

let activePronunciationAudio = null;

function pronunciationAudioUrl(text, provider = "") {
  const params = new URLSearchParams({ text: text || "" });
  if (provider) params.set("provider", provider);
  return `/api/pronunciation/audio?${params.toString()}`;
}

function playPronunciationClip(text, setAudioState, provider = "") {
  if (!text || typeof window === "undefined") return;
  if (activePronunciationAudio) {
    activePronunciationAudio.pause();
    activePronunciationAudio.removeAttribute("src");
  }

  const audio = new Audio(pronunciationAudioUrl(text, provider));
  activePronunciationAudio = audio;
  setAudioState("loading");

  const resetAfterError = () => {
    if (activePronunciationAudio === audio) activePronunciationAudio = null;
    setAudioState("error");
    window.setTimeout(() => setAudioState("idle"), 2600);
  };

  audio.addEventListener("playing", () => setAudioState("playing"), { once: true });
  audio.addEventListener(
    "ended",
    () => {
      if (activePronunciationAudio === audio) activePronunciationAudio = null;
      setAudioState("idle");
    },
    { once: true }
  );
  audio.addEventListener("error", resetAfterError, { once: true });

  const playback = audio.play();
  if (playback?.catch) playback.catch(resetAfterError);
}

function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    api("/api/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setBooting(false));
  }, []);

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-orange-50 text-slate-700">
        <div className="rounded-lg bg-white px-5 py-4 shadow-soft">Loading Vamos Gramatica...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen error={authError} setError={setAuthError} onAuthed={setUser} />;
  }

  return <LearningApp user={user} setUser={setUser} />;
}

function AuthScreen({ error, setError, onAuthed }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "admin@espanolo.local",
    password: "change-me"
  });
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        body: form
      });
      onAuthed(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed,#ecfeff_45%,#ffffff)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px]">
        <section className="max-w-2xl">
          <Logo large />
          <h1 className="mt-8 text-4xl font-extrabold leading-tight text-slate-950 sm:text-6xl">
            Spanish grammar that feels like a game.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Practice grammar, review weak spots, earn XP, and turn Spanish into a daily habit.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <FeaturePill icon={ListChecks} label="Spaced review" />
            <FeaturePill icon={Gamepad2} label="Mini games" />
            <FeaturePill icon={Trophy} label="Challenges" />
          </div>
        </section>

        <form onSubmit={submit} className="rounded-lg border border-white/70 bg-white p-6 shadow-soft">
          <div className="mb-6 flex rounded-lg bg-slate-100 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={classNames(
                "flex-1 rounded-md px-3 py-2",
                mode === "login" ? "bg-white text-coral-600 shadow-sm" : "text-slate-600"
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={classNames(
                "flex-1 rounded-md px-3 py-2",
                mode === "register" ? "bg-white text-coral-600 shadow-sm" : "text-slate-600"
              )}
            >
              Register
            </button>
          </div>

          {mode === "register" && (
            <label className="mb-4 block text-sm font-semibold text-slate-700">
              Name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-lagoon-500"
                placeholder="Ana"
              />
            </label>
          )}

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-lagoon-500"
              placeholder="you@example.com"
            />
          </label>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-lagoon-500"
              placeholder="8+ characters"
            />
          </label>

          {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <button
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-coral-500 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-coral-600 disabled:opacity-60"
          >
            <Rocket size={18} />
            {busy ? "Working..." : mode === "login" ? "Start Learning" : "Create Account"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Seeded admin default is shown. Change it in `.env` for production.
          </p>
        </form>
      </div>
    </main>
  );
}

function LearningApp({ user, setUser }) {
  const [active, setActive] = useState("path");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/dashboard");
      setDashboard(data);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => null);
    setUser(null);
  };

  const nav = navItems.filter((item) => !item.adminOnly || user.role === "ADMIN");

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-stone-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-stone-100 p-6">
            <Logo />
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {nav.map((item) => (
              <NavButton key={item.key} item={item} active={active === item.key} onClick={() => setActive(item.key)} />
            ))}
          </nav>
          <div className="m-4 rounded-lg border border-orange-100 bg-orange-50 p-4">
            <div className="mb-3 grid h-16 w-16 place-items-center rounded-lg bg-white text-4xl shadow-sm">LL</div>
            <p className="font-bold text-coral-600">¡Tu puedes!</p>
            <p className="mt-1 text-sm text-slate-600">Pequenos pasos, grandes conquistas.</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="hidden items-center gap-6 lg:flex">
              <TopMetric icon={Flame} label="Day Streak" value={dashboard?.stats.streakDays || user.streakDays} />
              <TopMetric icon={Star} label="XP" value={(dashboard?.stats.xp || user.xp).toLocaleString()} />
              <TopMetric icon={Medal} label="Level" value={dashboard?.stats.level || user.level} />
            </div>
            <div className="lg:hidden">
              <Logo compact />
            </div>
            <div className="flex items-center gap-3">
              <button className="grid h-11 w-11 place-items-center rounded-md border border-stone-200 bg-white text-coral-500">
                <Gift size={21} />
              </button>
              <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-lagoon-100 font-bold text-lagoon-700">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="hidden text-sm font-semibold sm:block">¡Hola, {user.name}!</span>
                <ChevronDown size={17} />
              </div>
              <button onClick={logout} className="grid h-11 w-11 place-items-center rounded-md text-slate-500 hover:bg-stone-100">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 pb-28 pt-5 sm:px-6 lg:px-8">
          {error && <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-red-700">{error}</div>}
          {loading || !dashboard ? (
            <div className="rounded-lg bg-white p-8 shadow-soft">Loading your learning path...</div>
          ) : (
            <ActiveView
              active={active}
              user={user}
              dashboard={dashboard}
              refreshDashboard={refreshDashboard}
              setActive={setActive}
            />
          )}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-stone-200 bg-white px-2 py-2 lg:hidden">
        {nav.slice(0, 5).map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={classNames(
              "flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] font-semibold",
              active === item.key ? "bg-coral-50 text-coral-600" : "text-slate-500"
            )}
          >
            <item.icon size={19} />
            {item.label.split(" ")[0]}
          </button>
        ))}
      </nav>
    </div>
  );
}

function ActiveView({ active, user, dashboard, refreshDashboard, setActive }) {
  if (active === "path") return <LearningPathView dashboard={dashboard} refreshDashboard={refreshDashboard} setActive={setActive} />;
  if (active === "words") return <WordLearnerView refreshDashboard={refreshDashboard} />;
  if (active === "lessons") return <LessonsView lessons={dashboard.lessons} refreshDashboard={refreshDashboard} />;
  if (active === "grammar") return <GrammarView lessons={dashboard.lessons} />;
  if (active === "games") return <MiniGamesView dashboard={dashboard} refreshDashboard={refreshDashboard} />;
  if (active === "challenges") return <ChallengesView challenge={dashboard.challenge} refreshDashboard={refreshDashboard} />;
  if (active === "progress") return <ProgressView dashboard={dashboard} />;
  if (active === "admin" && user.role === "ADMIN") return <AdminView refreshDashboard={refreshDashboard} />;
  if (active === "settings") return <SettingsView user={user} />;
  return <DashboardView dashboard={dashboard} refreshDashboard={refreshDashboard} setActive={setActive} />;
}

function LearningPathView({ dashboard, refreshDashboard, setActive }) {
  const orderedLessons = dashboard.lessons;
  const nextLesson = orderedLessons.find((lesson) => lesson.progress < 100) || orderedLessons[0];
  const [selectedId, setSelectedId] = useState("");
  const [lesson, setLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);

  useEffect(() => {
    if (!selectedId) {
      setLesson(null);
      return;
    }
    setLoadingLesson(true);
    api(`/api/lessons/${selectedId}`)
      .then((data) => setLesson(data.lesson))
      .finally(() => setLoadingLesson(false));
  }, [selectedId]);

  const averageProgress = dashboard.lessons.length
    ? Math.round(dashboard.lessons.reduce((sum, item) => sum + item.progress, 0) / dashboard.lessons.length)
    : 0;

  if (selectedId) {
    return loadingLesson || !lesson ? (
      <Panel title="Loading Session">Preparing the focused lesson...</Panel>
    ) : (
      <FocusedLessonSession
        lesson={lesson}
        onBack={() => {
          setSelectedId("");
          refreshDashboard();
        }}
        refreshDashboard={refreshDashboard}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg bg-slate-950 p-5 text-white shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-lagoon-100">
              <Target size={16} /> Ground-up A1 Map
            </p>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">Tap a node. Learn one thing. Pass the check.</h1>
          </div>
          <div className="w-full rounded-lg bg-white/10 p-4 sm:w-80">
            <div className="flex justify-between text-sm font-bold text-slate-200">
              <span>Path mastery</span>
              <span>{averageProgress}%</span>
            </div>
            <ProgressBar value={averageProgress} className="mt-3" color="bg-honey-500" />
            {nextLesson && (
              <button
                onClick={() => setSelectedId(nextLesson.id)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-honey-500 px-4 py-3 font-black text-white hover:bg-honey-600"
              >
                <Rocket size={18} /> Continue
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedLessons.map((lessonItem, index) => {
              const done = lessonItem.progress >= 100;
              const isNext = nextLesson?.id === lessonItem.id;
              return (
                <button
                  key={lessonItem.id}
                  onClick={() => setSelectedId(lessonItem.id)}
                  className={classNames(
                    "relative min-h-44 rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft",
                    done
                      ? "border-emerald-200 bg-emerald-50"
                      : isNext
                        ? "border-honey-500 bg-amber-50"
                        : "border-stone-200 bg-white"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <AssetImage imageKey={lessonItem.imageKey} alt={lessonItem.title} className="h-16 w-16" />
                      <span className="absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{lessonItem.theme}</p>
                      <h2 className="mt-1 text-lg font-black leading-tight">{lessonItem.title}</h2>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm text-slate-600">{lessonItem.summary}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <ProgressBar value={lessonItem.progress} className="flex-1" color={done ? "bg-emerald-500" : "bg-lagoon-500"} />
                    <span className="text-sm font-black text-slate-700">{lessonItem.progress}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function FocusedLessonSession({ lesson, onBack, refreshDashboard }) {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);
  const [resultBanner, setResultBanner] = useState(null);

  useEffect(() => {
    setStep(0);
    setResults([]);
    setResultBanner(null);
  }, [lesson.id]);

  const learnSteps = lesson.sentences.map((sentence, index) => ({ type: "learn", sentence, index }));
  const practiceSteps = lesson.exercises.map((exercise, index) => ({ type: "practice", exercise, index }));
  const steps = [...learnSteps, ...practiceSteps];
  const current = steps[step];
  const finished = step >= steps.length;
  const correct = results.filter(Boolean).length;
  const progress = steps.length ? Math.round((Math.min(step, steps.length) / steps.length) * 100) : 0;

  if (finished) {
    const score = lesson.exercises.length ? Math.round((correct / lesson.exercises.length) * 100) : 100;
    return (
      <section className="mx-auto max-w-3xl">
        <button onClick={onBack} className="mb-4 rounded-md border border-stone-200 bg-white px-4 py-2 font-bold text-slate-600">
          Back to map
        </button>
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-center shadow-soft">
          <AssetImage imageKey="rewards-and-progress:15" alt="Complete" className="mx-auto h-28 w-28" />
          <h1 className="mt-5 text-3xl font-black">Node complete</h1>
          <p className="mt-2 text-slate-600">{lesson.title}</p>
          <div className="mx-auto mt-5 max-w-sm">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Recall score</span>
              <span>{score}%</span>
            </div>
            <ProgressBar value={score} className="mt-2" color={score >= 80 ? "bg-emerald-500" : "bg-honey-500"} />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setStep(0);
                setResults([]);
              }}
              className="rounded-md border border-stone-200 px-4 py-3 font-black text-slate-700 hover:bg-stone-50"
            >
              Repeat
            </button>
            <button onClick={onBack} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600">
              Return to map
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!current) return null;

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button onClick={onBack} className="rounded-md border border-stone-200 bg-white px-4 py-2 font-bold text-slate-600">
          Back
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-xs font-black uppercase tracking-wide text-slate-500">
            <span>{lesson.title}</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} className="mt-2" />
        </div>
      </div>

      {resultBanner && (
        <div
          className={classNames(
            "sticky top-24 z-20 mb-4 rounded-lg border p-3 shadow-soft",
            resultBanner.correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={classNames(
                "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-white",
                resultBanner.correct ? "bg-emerald-600" : "bg-red-600"
              )}
            >
              {resultBanner.correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            </div>
            <div className="min-w-0">
              <p className="font-black">
                {resultBanner.correct ? `Correct +${resultBanner.xpAwarded || 0} XP` : "Not quite"}
              </p>
              <p className="mt-1 text-sm">
                Answer: <span className="font-black">{resultBanner.expected || "—"}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {current.type === "learn" ? (
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-[140px_1fr] sm:items-center">
            <AssetImage imageKey={lesson.imageKey} alt={lesson.title} className="aspect-square w-full max-w-[160px]" />
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">Learn {current.index + 1}/{learnSteps.length}</p>
              <h1 className="mt-3 text-3xl font-black text-slate-950">{current.sentence.spanish}</h1>
              <p className="mt-3 text-lg font-bold text-slate-600">{current.sentence.english}</p>
              {current.sentence.note && (
                <div className="mt-5 rounded-lg border border-lagoon-200 bg-lagoon-50 p-4 text-lagoon-900">
                  <p className="font-bold">{current.sentence.note}</p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setStep((value) => value + 1)}
            className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600"
          >
            Continue
          </button>
        </div>
      ) : (
        <PracticePanel
          title={`Recall ${current.index + 1}/${practiceSteps.length}`}
          exercise={current.exercise}
          source="LESSON"
          autoAdvance
          autoAdvanceDelay={850}
          onResult={(result) => {
            setResultBanner(result);
            setResults((currentResults) => {
              const next = [...currentResults];
              next[current.index] = Boolean(result.correct);
              return next;
            });
          }}
          onComplete={async () => {
            await refreshDashboard();
            setStep((value) => value + 1);
          }}
        />
      )}
    </section>
  );
}

function WordLearnerView({ refreshDashboard }) {
  const [data, setData] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [mode, setMode] = useState("flashcard");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWords = async () => {
    setLoading(true);
    const payload = await api("/api/words");
    setData(payload);
    setSelectedGroupId((current) => current || payload.groups[0]?.id || "");
    setLoading(false);
  };

  useEffect(() => {
    loadWords();
  }, []);

  const selectedGroup = data?.groups.find((group) => group.id === selectedGroupId) || data?.groups[0];
  const words = useMemo(() => {
    const list = selectedGroup?.words || [];
    return [...list].sort((a, b) => Number(b.review.due) - Number(a.review.due) || a.spanish.localeCompare(b.spanish));
  }, [selectedGroup]);
  const word = words[index % Math.max(1, words.length)];
  const allWords = data?.groups.flatMap((group) => group.words) || [];
  const choices = useMemo(() => {
    if (!word) return [];
    const distractors = allWords
      .filter((candidate) => candidate.id !== word.id)
      .map((candidate) => candidate.english)
      .filter(Boolean)
      .slice(0, 30);
    const pool = [word.english, ...distractors.sort(() => 0.5 - Math.random()).slice(0, 3)];
    return pool.sort(() => 0.5 - Math.random());
  }, [word?.id, allWords.length]);

  const resetCard = () => {
    setFlipped(false);
    setTypedAnswer("");
    setFeedback(null);
  };

  const nextCard = () => {
    setIndex((current) => (words.length ? (current + 1) % words.length : 0));
    resetCard();
  };

  const submitWord = async (answer, attemptMode = mode) => {
    if (!word) return;
    const result = await api(`/api/words/${word.id}/attempt`, {
      method: "POST",
      body: {
        mode: attemptMode === "typing" ? "en-es" : "es-en",
        answer
      }
    });
    setFeedback(result);
    await refreshDashboard?.();
  };

  if (loading || !data) {
    return <Panel title="Words">Loading word decks...</Panel>;
  }

  if (!word) {
    return <Panel title="Words">No words are available yet.</Panel>;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <section className="space-y-5">
        <Panel title="Vocabulary Decks" icon={NotebookTabs}>
          <div className="grid gap-3">
            {data.groups.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  setSelectedGroupId(group.id);
                  setIndex(0);
                  resetCard();
                }}
                className={classNames(
                  "grid grid-cols-[54px_1fr_auto] items-center gap-3 rounded-lg border p-3 text-left",
                  selectedGroupId === group.id ? "border-lagoon-500 bg-lagoon-50" : "border-stone-200 bg-white hover:bg-stone-50"
                )}
              >
                <AssetImage imageKey={group.imageKey} alt={group.title} className="h-12 w-12" />
                <div className="min-w-0">
                  <p className="truncate font-black">{group.title}</p>
                  <p className="truncate text-xs text-slate-500">{group.total} words · {group.due} due</p>
                  <ProgressBar value={group.total ? (group.mastered / group.total) * 100 : 0} className="mt-2" />
                </div>
                <span className="text-sm font-black text-lagoon-700">{group.mastered}/{group.total}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Word Stats" icon={BarChart3}>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile label="Total" value={data.stats.total} />
            <InfoTile label="Due" value={data.stats.due} />
            <InfoTile label="Learning" value={data.stats.learning} />
            <InfoTile label="Mastered" value={data.stats.mastered} />
          </div>
        </Panel>
      </section>

      <section className="space-y-5">
        <Panel
          title={selectedGroup?.title || "Word Deck"}
          icon={Sparkles}
          action={
            <div className="flex rounded-md bg-stone-100 p-1 text-xs font-black">
              {[
                ["flashcard", "Card"],
                ["recognition", "Choice"],
                ["typing", "Type"]
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setMode(key);
                    resetCard();
                  }}
                  className={classNames("rounded px-3 py-2", mode === key ? "bg-white text-coral-600 shadow-sm" : "text-slate-500")}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        >
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <div>
              <AssetImage imageKey={word.imageKey || selectedGroup?.imageKey} alt={word.spanish} className="aspect-square w-full" />
              <div className="mt-3 flex justify-between text-sm font-bold text-slate-500">
                <span>{index + 1} / {words.length}</span>
                <span>{word.review.state}</span>
              </div>
            </div>

            <div className="flex min-h-[330px] flex-col rounded-lg border border-stone-200 bg-stone-50 p-5">
              {mode === "flashcard" && (
                <>
                  <p className="text-sm font-black uppercase tracking-wide text-slate-500">Front</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-4xl font-black text-slate-950">{word.spanish}</h2>
                    <PronunciationTools text={word.spanish} />
                  </div>
                  <p className="mt-2 text-slate-600">{word.partOfSpeech}{word.gender ? ` · ${word.gender}` : ""}</p>
                  <div className="mt-6 rounded-lg bg-white p-4">
                    <p className="text-sm font-black text-slate-500">Example</p>
                    <p className="mt-1 font-bold">{word.example || "No example yet."}</p>
                  </div>
                  {flipped && (
                    <div className="mt-5 rounded-lg border border-lagoon-200 bg-lagoon-50 p-4">
                      <p className="text-sm font-black text-lagoon-700">Meaning</p>
                      <p className="mt-1 text-2xl font-black text-lagoon-900">{word.english}</p>
                    </div>
                  )}
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    {!flipped ? (
                      <button onClick={() => setFlipped(true)} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600">
                        Flip Card
                      </button>
                    ) : (
                      <>
                        <button onClick={() => submitWord(word.english, "flashcard")} className="rounded-md bg-emerald-600 px-5 py-3 font-black text-white hover:bg-emerald-700">
                          I knew it
                        </button>
                        <button onClick={() => submitWord("", "flashcard")} className="rounded-md bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700">
                          Again
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {mode === "recognition" && (
                <>
                  <p className="text-sm font-black uppercase tracking-wide text-slate-500">Choose the meaning</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-4xl font-black text-slate-950">{word.spanish}</h2>
                    <PronunciationTools text={word.spanish} />
                  </div>
                  <div className="mt-6 grid gap-3">
                    {choices.map((choice) => (
                      <button
                        key={choice}
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord(choice, "recognition")}
                        className={classNames(
                          "rounded-md border bg-white px-4 py-3 text-left font-bold hover:bg-stone-50 disabled:cursor-default",
                          feedback && choice === word.english && "border-emerald-400 bg-emerald-50 text-emerald-900",
                          feedback && feedback.correct === false && choice === feedback.expected && "border-emerald-400 bg-emerald-50"
                        )}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {mode === "typing" && (
                <>
                  <p className="text-sm font-black uppercase tracking-wide text-slate-500">Type the Spanish</p>
                  <h2 className="mt-3 text-4xl font-black text-slate-950">{word.english}</h2>
                  <div className="mt-3">
                    <PronunciationTools text={word.spanish} />
                  </div>
                  <input
                    value={typedAnswer}
                    disabled={Boolean(feedback)}
                    onChange={(event) => setTypedAnswer(event.target.value)}
                    className="mt-6 w-full rounded-md border border-stone-200 bg-white px-4 py-4 text-xl font-bold outline-none focus:border-lagoon-500 disabled:bg-stone-100"
                    placeholder="Spanish word"
                  />
                  <button
                    disabled={!typedAnswer.trim() || Boolean(feedback)}
                    onClick={() => submitWord(typedAnswer, "typing")}
                    className="mt-4 w-fit rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 disabled:opacity-50"
                  >
                    Check
                  </button>
                </>
              )}

              {feedback && (
                <div className={classNames("mt-5 rounded-lg border p-4", feedback.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50")}>
                  <p className={classNames("font-black", feedback.correct ? "text-emerald-900" : "text-red-900")}>
                    {feedback.correct ? `Correct +${feedback.xpAwarded} XP` : "Not yet"}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">Expected: <span className="font-black">{feedback.expected}</span></p>
                  <p className="mt-1 text-sm text-slate-700">{feedback.review.message}</p>
                  <button onClick={nextCard} className="mt-4 rounded-md bg-slate-950 px-4 py-2 font-black text-white">
                    Next word
                  </button>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function DashboardView({ dashboard, refreshDashboard, setActive }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
      <section className="space-y-5">
        <HeroBand />
        <div className="grid gap-5 xl:grid-cols-[minmax(280px,0.85fr)_1.4fr]">
          <CurrentLessonCard lesson={dashboard.currentLesson} setActive={setActive} />
          <PracticePanel
            exercise={dashboard.practiceExercise}
            source="LESSON"
            title="Practice Time!"
            onComplete={refreshDashboard}
          />
        </div>
        <MiniGameCards games={dashboard.miniGames} onViewAll={() => setActive("games")} />
        <WeeklyChallengeCard challenge={dashboard.challenge} onOpen={() => setActive("challenges")} />
      </section>

      <aside className="space-y-5">
        <StatsCard dashboard={dashboard} />
        <BadgesCard badges={dashboard.badges} />
        <CefrCard level={dashboard.currentLesson?.cefrLevel || "A1"} />
      </aside>
    </div>
  );
}

function HeroBand() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-coral-500 px-6 py-7 text-white shadow-soft">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-20 top-6 text-6xl">✦</div>
        <div className="absolute right-48 bottom-2 text-4xl">✧</div>
      </div>
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-4xl">Spanish Grammar Adventure</h1>
          <p className="mt-2 text-base font-semibold text-white/95">Master the rules. Build real confidence.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-4 py-3 text-sm font-bold text-coral-600">
          <Sparkles size={17} /> ¡Sigue asi!
        </div>
      </div>
    </div>
  );
}

function CurrentLessonCard({ lesson, setActive }) {
  if (!lesson) return <Panel title="Current Lesson">No lesson is available yet.</Panel>;
  return (
    <Panel title="Current Lesson" icon={NotebookTabs}>
      <div className="flex gap-4">
        <AssetImage imageKey={lesson.imageKey} alt={lesson.title} className="h-24 w-24 shrink-0" />
        <div>
          <h2 className="text-xl font-extrabold">{lesson.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{lesson.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-lagoon-50 px-2 py-1 text-lagoon-700">{lesson.cefrLevel}</span>
            <span className="rounded-full bg-orange-50 px-2 py-1 text-coral-600">{lesson.theme}</span>
          </div>
        </div>
      </div>
      <ProgressBar value={lesson.progress} className="mt-6" />
      <div className="mt-2 flex justify-between text-sm text-slate-600">
        <span>Lesson Progress</span>
        <span className="font-bold">{lesson.progress}%</span>
      </div>
      <button
        onClick={() => setActive("lessons")}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-lagoon-500 px-4 py-3 font-bold text-white hover:bg-lagoon-600"
      >
        <BookOpen size={18} /> Continue Lesson
      </button>
    </Panel>
  );
}

function PracticePanel({
  exercise,
  source = "LESSON",
  title = "Practice",
  onComplete,
  onResult,
  gameKey,
  autoAdvance = false,
  autoAdvanceDelay = 900
}) {
  const [answer, setAnswer] = useState("");
  const [words, setWords] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [continuing, setContinuing] = useState(false);

  useEffect(() => {
    setAnswer("");
    setWords([]);
    setFeedback(null);
    setHintOpen(false);
  }, [exercise?.id]);

  if (!exercise) {
    return (
      <Panel title={title} icon={Sparkles}>
        <p className="text-slate-600">No exercise is ready yet. Add one from the admin area.</p>
      </Panel>
    );
  }

  const isSentenceBuilder = exercise.type === "SENTENCE_BUILDER";
  const selectedValue = isSentenceBuilder ? words.join(" ") : answer;
  const locked = Boolean(feedback && typeof feedback.correct === "boolean");
  const canSubmit = selectedValue.trim().length > 0 && !locked;
  const acceptedValues = feedback?.accepted?.map(normalizeText) || [];

  const resetAttempt = () => {
    setAnswer("");
    setWords([]);
    setFeedback(null);
    setHintOpen(false);
  };

  const continueAfterFeedback = async () => {
    setContinuing(true);
    try {
      await onComplete?.();
      resetAttempt();
    } finally {
      setContinuing(false);
    }
  };

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    try {
      const result = await api(`/api/exercises/${exercise.id}/attempt`, {
        method: "POST",
        body: {
          source,
          answer,
          words
        }
      });
      const resultWithAnswer = { ...result, submitted: selectedValue };
      setFeedback(resultWithAnswer);
      onResult?.(resultWithAnswer);
      setHintOpen(false);

      if (gameKey) {
        const score = result.correct ? exercise.xpReward * 100 + 50 : 50;
        await api(`/api/minigames/${gameKey}/score`, {
          method: "POST",
          body: { score }
        });
      }

      if (autoAdvance) {
        window.setTimeout(() => {
          continueAfterFeedback();
        }, autoAdvanceDelay);
      }
    } catch (err) {
      const errorResult = { correct: false, explanation: err.message, submitted: selectedValue, expected: "" };
      setFeedback(errorResult);
      onResult?.(errorResult);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      title={title}
      icon={Sparkles}
      action={
        <span className="rounded-full border border-lagoon-100 bg-lagoon-50 px-3 py-1 text-xs font-bold text-lagoon-700">
          +{exercise.xpReward} XP
        </span>
      }
    >
      <div
        className={classNames(
          "rounded-lg border transition",
          feedback?.correct === true
            ? "border-emerald-300 bg-emerald-50/30"
            : feedback?.correct === false
              ? "border-red-300 bg-red-50/30"
              : "border-stone-200"
        )}
      >
        <div className="border-b border-stone-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 gap-4">
              <AssetImage imageKey={exercise.imageKey} alt={exercise.prompt} className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-500">{exercise.prompt}</p>
                <h3 className="mt-2 text-xl font-extrabold text-slate-950">{exercise.questionText}</h3>
                <p className="mt-1 text-sm text-slate-600">{exercise.instruction}</p>
              </div>
            </div>
            {locked && (
              <span
                className={classNames(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-black",
                  feedback.correct ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                )}
              >
                {feedback.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {feedback.correct ? "Correct" : "Needs review"}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_220px]">
          <div className="p-4">
            {isSentenceBuilder ? (
              <SentenceBuilder exercise={exercise} words={words} setWords={setWords} disabled={locked} />
            ) : (
              <AnswerChoices
                exercise={exercise}
                answer={answer}
                setAnswer={setAnswer}
                disabled={locked}
                feedback={feedback}
                acceptedValues={acceptedValues}
              />
            )}
          </div>
          <div className="border-t border-stone-200 p-4 md:border-l md:border-t-0">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Your answer</label>
            <div
              className={classNames(
                "mt-2 min-h-11 rounded-md border px-3 py-2 font-semibold",
                feedback?.correct === true
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : feedback?.correct === false
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-stone-200 bg-stone-50"
              )}
            >
              {selectedValue || "—"}
            </div>
            {feedback?.expected && (
              <>
                <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Correct answer
                </label>
                <div className="mt-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm font-black text-emerald-800">
                  {feedback.expected}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {hintOpen && !locked && (
        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sky-800">
          <p className="flex items-center gap-2 font-black">
            <Wand2 size={18} /> Hint
          </p>
          <p className="mt-1 text-sm">{exercise.explanation}</p>
        </div>
      )}

      {feedback && (
        <div className={classNames("mt-4 rounded-lg border p-4", feedback.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50")}>
          <div className="flex gap-3">
            <div
              className={classNames(
                "grid h-11 w-11 shrink-0 place-items-center rounded-full",
                feedback.correct ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
              )}
            >
              {feedback.correct ? <CheckCircle2 /> : <XCircle />}
            </div>
            <div>
              <p className={classNames("text-lg font-black", feedback.correct ? "text-emerald-900" : "text-red-900")}>
                {feedback.correct ? `Correct. +${feedback.xpAwarded} XP` : "Not quite. Review the pattern."}
              </p>
              <p className={classNames("mt-1 text-sm", feedback.correct ? "text-emerald-800" : "text-red-800")}>
                {feedback.explanation}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <FeedbackFact label="Your answer" value={feedback.submitted || "—"} />
            <FeedbackFact label="Correct answer" value={feedback.expected || "—"} good />
            <FeedbackFact label="Review" value={feedback.review?.message || "Saved for practice."} />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {!locked && (
          <>
            <button
              onClick={() => setHintOpen((value) => !value)}
              className="rounded-md border border-stone-200 px-4 py-2 font-semibold text-slate-600 hover:bg-stone-50"
            >
              Hint
            </button>
            <button
              onClick={resetAttempt}
              className="rounded-md border border-sky-200 px-4 py-2 font-semibold text-sky-700 hover:bg-sky-50"
            >
              Clear
            </button>
            <button
              disabled={!canSubmit || busy}
              onClick={submit}
              className="ml-auto rounded-md bg-lagoon-500 px-5 py-2 font-bold text-white hover:bg-lagoon-600 disabled:opacity-50"
            >
              {busy ? "Checking..." : "Check Answer"}
            </button>
          </>
        )}
        {locked && !autoAdvance && (
          <div>
            <button
              onClick={feedback.correct ? continueAfterFeedback : resetAttempt}
              disabled={continuing}
              className={classNames(
                "rounded-md px-5 py-2 font-bold text-white disabled:opacity-60",
                feedback.correct ? "bg-lagoon-500 hover:bg-lagoon-600" : "bg-red-600 hover:bg-red-700"
              )}
            >
              {continuing ? "Loading..." : feedback.correct ? "Continue" : "Try Again"}
            </button>
            {!feedback.correct && (
              <button
                onClick={continueAfterFeedback}
                disabled={continuing}
                className="ml-3 rounded-md border border-stone-200 bg-white px-4 py-2 font-semibold text-slate-600 hover:bg-stone-50 disabled:opacity-60"
              >
                Continue Anyway
              </button>
            )}
          </div>
        )}
        {locked && autoAdvance && (
          <div className="rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
            Next question loading...
          </div>
        )}
      </div>
    </Panel>
  );
}

function FeedbackFact({ label, value, good = false }) {
  return (
    <div className={classNames("rounded-md border bg-white p-3", good ? "border-emerald-200" : "border-white/80")}>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className={classNames("mt-1 text-sm font-bold", good ? "text-emerald-800" : "text-slate-800")}>{value}</p>
    </div>
  );
}

function PronunciationTools({ text, compact = false }) {
  const links = dictionaryLinks(text);
  const [audioState, setAudioState] = useState("idle");
  const buttonClass = compact
    ? "grid h-8 w-8 place-items-center rounded-md border border-stone-200 bg-white text-slate-600 hover:bg-stone-50"
    : "inline-flex min-w-[96px] items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-stone-50";
  const providerButtonClass =
    "rounded px-2 py-2 text-xs font-black text-slate-600 hover:bg-white hover:text-lagoon-700";
  const audioLabel = audioState === "loading" ? "Loading" : audioState === "playing" ? "Playing" : "Listen";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => playPronunciationClip(text, setAudioState)}
        className={classNames(
          buttonClass,
          audioState === "playing" && "border-lagoon-300 bg-lagoon-50 text-lagoon-800",
          audioState === "error" && "border-red-200 bg-red-50 text-red-700"
        )}
        title={`Play real pronunciation audio for ${text}`}
      >
        <Volume2 size={compact ? 16 : 17} />
        {!compact && audioLabel}
      </button>
      {!compact && (
        <div className="flex overflow-hidden rounded-md border border-stone-200 bg-stone-50" aria-label="Pronunciation audio source">
          <button
            type="button"
            onClick={() => playPronunciationClip(text, setAudioState, "spanishdict")}
            className={providerButtonClass}
            title={`Play ${text} from SpanishDict audio`}
          >
            SD
          </button>
          <button
            type="button"
            onClick={() => playPronunciationClip(text, setAudioState, "leo")}
            className={providerButtonClass}
            title={`Play ${text} from LEO audio`}
          >
            LEO
          </button>
        </div>
      )}
      <a
        href={links.spanishDict}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
        title={`Open ${text} on SpanishDict`}
      >
        <ExternalLink size={compact ? 15 : 16} />
        {!compact && "SpanishDict"}
      </a>
      <a
        href={links.leo}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
        title={`Open ${text} on LEO`}
      >
        <ExternalLink size={compact ? 15 : 16} />
        {!compact && "LEO"}
      </a>
      {audioState === "error" && !compact && <span className="text-xs font-bold text-red-600">Audio unavailable</span>}
    </div>
  );
}

function AnswerChoices({ exercise, answer, setAnswer, disabled = false, feedback, acceptedValues = [] }) {
  const [freeText, setFreeText] = useState(false);
  const hasAttemptFeedback = Boolean(feedback && typeof feedback.correct === "boolean");

  if (!exercise.options.length || freeText) {
    return (
      <div>
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={disabled}
          className="w-full rounded-md border border-stone-200 px-3 py-3 outline-none focus:border-lagoon-500 disabled:bg-stone-100"
          placeholder="Type your answer"
        />
        {!!exercise.options.length && (
          <button disabled={disabled} onClick={() => setFreeText(false)} className="mt-3 text-sm font-bold text-lagoon-600 disabled:opacity-50">
            Use choices
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {exercise.options.map((option) => {
        const selected = answer === option.value;
        const correctOption = acceptedValues.includes(normalizeText(option.value));
        const wrongSelection = hasAttemptFeedback && selected && !correctOption;
        return (
          <button
            key={option.id}
            disabled={disabled}
            onClick={() => setAnswer(option.value)}
            className={classNames(
              "flex items-center gap-3 rounded-md border px-4 py-3 text-left font-semibold transition disabled:cursor-default",
              hasAttemptFeedback && correctOption && "border-emerald-400 bg-emerald-50 text-emerald-900",
              wrongSelection && "border-red-400 bg-red-50 text-red-900",
              !hasAttemptFeedback &&
                (selected
                  ? "border-lagoon-500 bg-lagoon-50 text-lagoon-800"
                  : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50")
            )}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full border border-current">
              {hasAttemptFeedback && correctOption ? (
                <CheckCircle2 size={15} />
              ) : wrongSelection ? (
                <XCircle size={15} />
              ) : (
                selected && <span className="h-2.5 w-2.5 rounded-full bg-current" />
              )}
            </span>
            {option.text}
          </button>
        );
      })}
      <button disabled={disabled} onClick={() => setFreeText(true)} className="mt-2 text-left text-sm font-bold text-lagoon-600 disabled:opacity-50">
        Type instead
      </button>
    </div>
  );
}

function SentenceBuilder({ exercise, words, setWords, disabled = false }) {
  const remaining = exercise.options.filter((option) => !words.includes(option.value));
  return (
    <div>
      <div className="min-h-16 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3">
        <div className="flex flex-wrap gap-2">
          {words.length ? (
            words.map((word, index) => (
              <button
                key={`${word}-${index}`}
                disabled={disabled}
                onClick={() => setWords(words.filter((_, wordIndex) => wordIndex !== index))}
                className="rounded-md bg-lagoon-500 px-3 py-2 font-bold text-white disabled:cursor-default disabled:opacity-80"
              >
                {word}
              </button>
            ))
          ) : (
            <span className="text-sm text-slate-500">Build the sentence here</span>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {remaining.map((option) => (
          <button
            key={option.id}
            disabled={disabled}
            onClick={() => setWords([...words, option.value])}
            className="rounded-md border border-stone-200 bg-white px-3 py-2 font-semibold hover:bg-stone-50 disabled:cursor-default disabled:opacity-50"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniGameCards({ games, onViewAll }) {
  return (
    <Panel
      title="Mini Games"
      icon={Gamepad2}
      action={
        <button onClick={onViewAll} className="text-sm font-bold text-sky-700">
          View all games
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {games.map((game) => (
          <div key={game.key} className={classNames("rounded-lg border p-4", game.color === "honey" ? "border-amber-200 bg-amber-50" : game.color === "blue" ? "border-sky-200 bg-sky-50" : "border-lagoon-200 bg-lagoon-50")}>
            <div className="flex items-start gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-lagoon-600 shadow-sm">
                {game.key.includes("article") ? <Puzzle /> : game.key.includes("sentence") ? <ListChecks /> : <PenTool />}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900">{game.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{game.description}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-slate-600">High Score</span>
              <span className="font-bold">{game.highScore} pts</span>
            </div>
            <ProgressBar value={Math.min(100, game.highScore / 20)} className="mt-2" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function WeeklyChallengeCard({ challenge, onOpen }) {
  if (!challenge) return null;
  const percentage = Math.round((challenge.progress / challenge.targetCount) * 100);
  const ends = new Date(challenge.endsAt);
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_220px_180px] md:items-center">
        <div className="flex items-center gap-4">
          <AssetImage imageKey="rewards-and-progress:3" alt="Challenge trophy" className="h-16 w-16 shrink-0 rounded-full" />
          <div>
            <h3 className="text-lg font-extrabold">{challenge.title}</h3>
            <p className="text-sm text-slate-600">{challenge.description}</p>
            <p className="mt-1 text-xs font-bold text-honey-600">Ends {ends.toLocaleDateString()}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-bold">
            <span>Progress</span>
            <span>
              {challenge.progress} / {challenge.targetCount}
            </span>
          </div>
          <ProgressBar value={percentage} className="mt-2" color="bg-honey-500" />
        </div>
        <button onClick={onOpen} className="rounded-md bg-honey-500 px-4 py-3 font-bold text-white hover:bg-honey-600">
          See Challenge
        </button>
      </div>
    </div>
  );
}

function StatsCard({ dashboard }) {
  const progress =
    ((dashboard.stats.xp - dashboard.stats.currentLevelXp) /
      Math.max(1, dashboard.stats.nextLevelXp - dashboard.stats.currentLevelXp)) *
    100;
  return (
    <Panel title="Your Stats">
      <div className="flex items-center gap-5">
        <div className="relative grid h-32 w-32 place-items-center rounded-full border-[12px] border-lagoon-100 border-t-lagoon-500">
          <Medal className="text-honey-500" size={54} />
        </div>
        <div>
          <h3 className="text-xl font-extrabold">Level {dashboard.stats.level}</h3>
          <p className="text-sm text-slate-600">Avanzado A1</p>
          <p className="mt-2 text-sm font-bold">
            {dashboard.stats.xp.toLocaleString()} / {dashboard.stats.nextLevelXp.toLocaleString()} XP
          </p>
          <ProgressBar value={progress} className="mt-2" />
        </div>
      </div>
      <div className="mt-6 border-t border-stone-200 pt-5">
        <div className="mb-5 grid grid-cols-3 gap-3">
          <InfoTile label="Words" value={dashboard.stats.totalWords || 0} />
          <InfoTile label="Due" value={dashboard.stats.wordReviewCount || 0} />
          <InfoTile label="Known" value={dashboard.stats.masteredWords || 0} />
        </div>
        <div className="mb-3 flex justify-between">
          <h4 className="flex items-center gap-2 font-extrabold">
            <Flame className="text-coral-500" size={18} /> Streak Calendar
          </h4>
          <span className="font-bold text-coral-500">{dashboard.stats.streakDays} days</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {dashboard.streakCalendar.slice(-7).map((day) => (
            <div key={day.date}>
              <div className="mb-2 font-bold text-slate-500">{day.day.slice(0, 1)}</div>
              <div
                className={classNames(
                  "grid aspect-square place-items-center rounded-full border text-sm font-bold",
                  day.active ? "border-coral-500 bg-coral-500 text-white" : "border-stone-300 bg-white text-stone-400"
                )}
              >
                {day.active ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function BadgesCard({ badges }) {
  return (
    <Panel title="Badges Earned" action={<span className="text-sm font-bold text-sky-700">View all</span>}>
      <div className="grid grid-cols-4 gap-3">
        {badges.slice(0, 4).map((badge) => (
          <div key={badge.slug} className={classNames("text-center", !badge.earned && "opacity-45")}>
            <AssetImage imageKey={badgeImageKeys[badge.slug] || "rewards-and-progress:13"} alt={badge.title} className="mx-auto h-14 w-14" />
            <p className="mt-2 text-xs font-bold">{badge.title}</p>
            <p className="text-[11px] text-slate-500">{badge.earned ? "Earned" : "Keep going"}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CefrCard({ level }) {
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  return (
    <Panel title="CEFR Path" action={<span className="text-sm font-bold text-sky-700">Learn more</span>}>
      <div className="flex items-center justify-between">
        {levels.map((item) => (
          <div key={item} className="flex flex-1 items-center last:flex-none">
            <div
              className={classNames(
                "grid h-10 w-10 place-items-center rounded-full font-black",
                item === level ? "bg-lagoon-500 text-white" : item === "A2" ? "bg-honey-500 text-white" : "bg-stone-200 text-slate-600"
              )}
            >
              {item}
            </div>
            {item !== "C1" && <div className="mx-2 h-1 flex-1 border-t-2 border-dashed border-stone-300" />}
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg bg-orange-50 p-4">
        <p className="text-sm text-slate-600">You're on track for A2. Complete 12 more lessons to level up.</p>
        <ProgressBar value={40} className="mt-4" />
      </div>
    </Panel>
  );
}

function LessonsView({ lessons, refreshDashboard }) {
  const [selected, setSelected] = useState(lessons[0]?.id || "");
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    api(`/api/lessons/${selected}`)
      .then((data) => setLesson(data.lesson))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <Panel title="Lessons" icon={BookOpen}>
        <div className="space-y-3">
          {lessons.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={classNames(
                "flex w-full gap-3 rounded-lg border p-4 text-left",
                selected === item.id ? "border-lagoon-500 bg-lagoon-50" : "border-stone-200 bg-white hover:bg-stone-50"
              )}
            >
              <AssetImage imageKey={item.imageKey} alt={item.title} className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3">
                  <h3 className="font-extrabold">{item.title}</h3>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-lagoon-700">{item.cefrLevel}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                <ProgressBar value={item.progress} className="mt-3" />
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <section className="space-y-5">
        {loading || !lesson ? (
          <Panel title="Lesson">Loading lesson...</Panel>
        ) : (
          <>
            <Panel title={lesson.title} icon={GraduationCap}>
              <div className="grid gap-5 lg:grid-cols-[150px_1fr_280px]">
                <AssetImage imageKey={lesson.imageKey} alt={lesson.title} className="aspect-square w-full max-w-[150px]" />
                <div>
                  <p className="text-slate-600">{lesson.summary}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <InfoTile label="Theme" value={lesson.theme} />
                    <InfoTile label="Situation" value={lesson.situation} />
                    <InfoTile label="Time" value={`${lesson.estimatedMinutes} min`} />
                  </div>
                </div>
                <div>
                  <ProgressBar value={lesson.progress} />
                  <p className="mt-2 text-sm font-bold">{lesson.progress}% mastered</p>
                </div>
              </div>
            </Panel>

            <Panel title="Examples" icon={NotebookTabs}>
              <div className="grid gap-3">
                {lesson.sentences.map((sentence) => (
                  <div key={sentence.id} className="rounded-lg border border-stone-200 p-4">
                    <p className="font-extrabold">{sentence.spanish}</p>
                    <p className="text-sm text-slate-600">{sentence.english}</p>
                    {sentence.note && <p className="mt-2 text-sm text-lagoon-700">{sentence.note}</p>}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Vocabulary" icon={Image}>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {lesson.vocabularyGroups.flatMap((group) =>
                  group.words.map((word) => (
                    <div key={word.id} className="flex gap-3 rounded-lg border border-stone-200 bg-white p-3">
                      <AssetImage imageKey={word.imageKey || group.imageKey} alt={word.spanish} className="h-16 w-16 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-950">{word.spanish}</p>
                        <p className="text-sm text-slate-600">{word.english}</p>
                        {word.example && <p className="mt-1 text-xs text-lagoon-700">{word.example}</p>}
                        <div className="mt-2">
                          <PronunciationTools text={word.spanish} compact />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <PracticePanel
              title="Lesson Practice"
              exercise={lesson.exercises.find((exercise) => exercise.type !== "SENTENCE_BUILDER") || lesson.exercises[0]}
              source="LESSON"
              onComplete={refreshDashboard}
            />
          </>
        )}
      </section>
    </div>
  );
}

function GrammarView({ lessons }) {
  const grouped = useMemo(() => {
    const map = new Map();
    for (const lesson of lessons) {
      const key = lesson.topic.title;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(lesson);
    }
    return [...map.entries()];
  }, [lessons]);

  return (
    <div className="space-y-5">
      <HeroBand />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {grouped.map(([topic, topicLessons]) => (
          <Panel key={topic} title={topic} icon={GraduationCap}>
            <div className="flex gap-4">
              <AssetImage imageKey={topicLessons[0].topic.imageKey || topicLessons[0].imageKey} alt={topic} className="h-20 w-20 shrink-0" />
              <p className="text-sm text-slate-600">{topicLessons[0].topic.description}</p>
            </div>
            <div className="mt-4 space-y-3">
              {topicLessons.map((lesson) => (
                <div key={lesson.id} className="rounded-lg border border-stone-200 p-3">
                  <div className="flex justify-between">
                    <p className="font-bold">{lesson.title}</p>
                    <span className="text-sm font-bold text-lagoon-700">{lesson.progress}%</span>
                  </div>
                  <ProgressBar value={lesson.progress} className="mt-2" />
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function MiniGamesView({ dashboard, refreshDashboard }) {
  const [activeGame, setActiveGame] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(false);

  const startGame = async (game) => {
    setActiveGame(game);
    setLoading(true);
    try {
      const lessonDetails = await Promise.all(dashboard.lessons.map((lesson) => api(`/api/lessons/${lesson.id}`)));
      const exercises = lessonDetails.flatMap((data) => data.lesson.exercises);
      const preferredType =
        game.key === "sentence-builder"
          ? "SENTENCE_BUILDER"
          : game.key === "article-match"
            ? "ARTICLE_MATCH"
            : "CONJUGATION";
      setExercise(exercises.find((item) => item.type === preferredType) || exercises[0] || dashboard.practiceExercise);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <MiniGameCards games={dashboard.miniGames} onViewAll={() => null} />
      <div className="grid gap-4 md:grid-cols-3">
        {dashboard.miniGames.map((game) => (
          <button
            key={game.key}
            onClick={() => startGame(game)}
            className="rounded-lg border border-stone-200 bg-white p-5 text-left shadow-sm hover:border-lagoon-300"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-lagoon-50 text-lagoon-600">
              <Gamepad2 />
            </div>
            <h3 className="font-extrabold">{game.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{game.description}</p>
            <p className="mt-4 text-sm font-bold text-honey-600">Start round</p>
          </button>
        ))}
      </div>

      {activeGame && (
        <PracticePanel
          title={loading ? "Loading Game..." : activeGame.title}
          exercise={exercise}
          source="GAME"
          gameKey={activeGame.key}
          onComplete={refreshDashboard}
        />
      )}
    </div>
  );
}

function ChallengesView({ challenge, refreshDashboard }) {
  return (
    <div className="space-y-5">
      <WeeklyChallengeCard challenge={challenge} onOpen={() => null} />
      {challenge?.exercise ? (
        <PracticePanel title="Challenge Round" exercise={challenge.exercise} source="CHALLENGE" onComplete={refreshDashboard} />
      ) : (
        <Panel title="Challenges" icon={Trophy}>No active challenge is available.</Panel>
      )}
    </div>
  );
}

function ProgressView({ dashboard }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <Panel title="Leaderboard" icon={Trophy}>
        <div className="space-y-3">
          {dashboard.leaderboard.map((user, index) => (
            <div key={user.id} className="grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-lg border border-stone-200 p-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-honey-100 font-black text-honey-700">{index + 1}</div>
              <div>
                <p className="font-extrabold">{user.name}</p>
                <p className="text-sm text-slate-500">Level {user.level} · {user.streakDays} day streak</p>
              </div>
              <p className="font-black text-lagoon-700">{user.xp.toLocaleString()} XP</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="space-y-5">
        <StatsCard dashboard={dashboard} />
        <BadgesCard badges={dashboard.badges} />
      </div>
    </div>
  );
}

function AdminView({ refreshDashboard }) {
  const [content, setContent] = useState(null);
  const [message, setMessage] = useState("");
  const [topicForm, setTopicForm] = useState({ title: "", description: "", cefrLevel: "A1", imageKey: "" });
  const [lessonForm, setLessonForm] = useState({ title: "", summary: "", cefrLevel: "A1", theme: "Grammar", situation: "general", topicId: "", imageKey: "" });
  const [exerciseForm, setExerciseForm] = useState({
    lessonId: "",
    type: "MULTIPLE_CHOICE",
    prompt: "",
    instruction: "",
    questionText: "",
    correctAnswer: "",
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
    setMessage("Saved");
    await load();
    await refreshDashboard();
  };

  if (!content) return <Panel title="Admin">Loading content tools...</Panel>;

  const parsedOptions = exerciseForm.options
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [value, truthy] = item.split(":").map((part) => part.trim());
      return { text: value, value, isCorrect: truthy === "true" };
    });

  return (
    <div className="space-y-5">
      <Panel title="Admin Overview" icon={Shield} action={message && <span className="text-sm font-bold text-emerald-600">{message}</span>}>
        <div className="grid gap-3 sm:grid-cols-5">
          <InfoTile label="Topics" value={content.topics.length} />
          <InfoTile label="Lessons" value={content.lessons.length} />
          <InfoTile label="Exercises" value={content.exercises.length} />
          <InfoTile label="Assets" value={content.assets.length} />
          <InfoTile label="Users" value={content.users.length} />
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminForm
          title="Grammar Topic"
          icon={GraduationCap}
          onSubmit={() => submit("/api/admin/topics", topicForm)}
        >
          <TextInput label="Title" value={topicForm.title} onChange={(title) => setTopicForm({ ...topicForm, title })} />
          <TextInput label="Description" value={topicForm.description} onChange={(description) => setTopicForm({ ...topicForm, description })} />
          <TextInput label="CEFR" value={topicForm.cefrLevel} onChange={(cefrLevel) => setTopicForm({ ...topicForm, cefrLevel })} />
          <TextInput label="Image key" value={topicForm.imageKey} onChange={(imageKey) => setTopicForm({ ...topicForm, imageKey })} />
        </AdminForm>

        <AdminForm title="Lesson" icon={BookOpen} onSubmit={() => submit("/api/admin/lessons", lessonForm)}>
          <TextInput label="Title" value={lessonForm.title} onChange={(title) => setLessonForm({ ...lessonForm, title })} />
          <TextInput label="Summary" value={lessonForm.summary} onChange={(summary) => setLessonForm({ ...lessonForm, summary })} />
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
            <TextInput label="Theme" value={lessonForm.theme} onChange={(theme) => setLessonForm({ ...lessonForm, theme })} />
            <TextInput label="Situation" value={lessonForm.situation} onChange={(situation) => setLessonForm({ ...lessonForm, situation })} />
          </div>
          <TextInput label="Image key" value={lessonForm.imageKey} onChange={(imageKey) => setLessonForm({ ...lessonForm, imageKey })} />
        </AdminForm>

        <AdminForm
          title="Exercise"
          icon={PenTool}
          onSubmit={() =>
            submit("/api/admin/exercises", {
              ...exerciseForm,
              options: parsedOptions,
              answerJson:
                exerciseForm.type === "SENTENCE_BUILDER"
                  ? { correctWords: exerciseForm.correctAnswer.split(/\s+/).filter(Boolean) }
                  : { correct: exerciseForm.correctAnswer, accepted: [exerciseForm.correctAnswer] }
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
            {["MULTIPLE_CHOICE", "CLOZE", "SENTENCE_BUILDER", "CONJUGATION", "ARTICLE_MATCH", "TRANSLATION", "ERROR_CORRECTION"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <TextInput label="Prompt" value={exerciseForm.prompt} onChange={(prompt) => setExerciseForm({ ...exerciseForm, prompt })} />
          <TextInput label="Question" value={exerciseForm.questionText} onChange={(questionText) => setExerciseForm({ ...exerciseForm, questionText })} />
          <TextInput label="Correct answer" value={exerciseForm.correctAnswer} onChange={(correctAnswer) => setExerciseForm({ ...exerciseForm, correctAnswer })} />
          <TextInput label="Options" value={exerciseForm.options} onChange={(options) => setExerciseForm({ ...exerciseForm, options })} />
          <TextInput label="Explanation" value={exerciseForm.explanation} onChange={(explanation) => setExerciseForm({ ...exerciseForm, explanation })} />
          <TextInput label="Image key" value={exerciseForm.imageKey} onChange={(imageKey) => setExerciseForm({ ...exerciseForm, imageKey })} />
        </AdminForm>

        <AdminForm title="Asset Prompt" icon={Image} onSubmit={() => submit("/api/admin/assets", assetForm)}>
          <TextInput label="Title" value={assetForm.title} onChange={(title) => setAssetForm({ ...assetForm, title })} />
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput label="Category" value={assetForm.category} onChange={(category) => setAssetForm({ ...assetForm, category })} />
            <TextInput label="Grid" value={assetForm.gridSize} onChange={(gridSize) => setAssetForm({ ...assetForm, gridSize })} />
            <TextInput label="Canvas" value={assetForm.canvasSize} onChange={(canvasSize) => setAssetForm({ ...assetForm, canvasSize })} />
          </div>
          <TextInput label="Image path" value={assetForm.imagePath} onChange={(imagePath) => setAssetForm({ ...assetForm, imagePath })} />
          <textarea
            value={assetForm.promptMarkdown}
            onChange={(event) => setAssetForm({ ...assetForm, promptMarkdown: event.target.value })}
            className="min-h-36 rounded-md border border-stone-200 px-3 py-3"
            placeholder="Create a 1200x1200 image divided into..."
          />
        </AdminForm>
      </div>
    </div>
  );
}

function SettingsView({ user }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Profile" icon={Users}>
        <InfoTile label="Name" value={user.name} />
        <InfoTile label="Email" value={user.email} />
        <InfoTile label="Role" value={user.role} />
      </Panel>
      <Panel title="Learning Preferences" icon={Settings}>
        <div className="grid gap-3">
          <label className="flex items-center justify-between rounded-lg border border-stone-200 p-4">
            <span className="font-semibold">Daily challenge reminders</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-lagoon-500" />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-stone-200 p-4">
            <span className="font-semibold">Hard mode after streak day 7</span>
            <input type="checkbox" className="h-5 w-5 accent-lagoon-500" />
          </label>
        </div>
      </Panel>
    </div>
  );
}

function AdminForm({ title, icon: Icon, children, onSubmit }) {
  return (
    <Panel title={title} icon={Icon}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="grid gap-3"
      >
        {children}
        <button className="mt-2 flex w-fit items-center gap-2 rounded-md bg-coral-500 px-4 py-2 font-bold text-white hover:bg-coral-600">
          <Plus size={17} /> Save
        </button>
      </form>
    </Panel>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-stone-200 px-3 py-3 font-normal outline-none focus:border-lagoon-500"
      />
    </label>
  );
}

function Panel({ title, icon: Icon, action, children }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          {Icon && <Icon size={20} className="text-lagoon-600" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function NavButton({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex w-full items-center gap-3 rounded-md px-4 py-3 text-left font-bold",
        active ? "bg-coral-500 text-white" : "text-slate-600 hover:bg-stone-100"
      )}
    >
      <item.icon size={21} />
      {item.label}
    </button>
  );
}

function TopMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-r border-stone-200 pr-6 last:border-r-0">
      <Icon className="text-coral-500" size={31} />
      <div>
        <p className="font-black">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function ProgressBar({ value, className, color = "bg-lagoon-500" }) {
  return (
    <div className={classNames("h-2 overflow-hidden rounded-full bg-stone-200", className)}>
      <div className={classNames("h-full rounded-full", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function FeaturePill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white bg-white/70 px-4 py-3 font-bold text-slate-700 shadow-sm">
      <Icon size={18} className="text-lagoon-600" />
      {label}
    </div>
  );
}

function AssetImage({ imageKey, className = "", alt = "Learning image" }) {
  const parsed = parseImageKey(imageKey);
  if (!parsed) {
    return (
      <div className={classNames("grid place-items-center rounded-lg bg-stone-100 text-stone-400", className)} aria-label={alt}>
        <Image size={24} />
      </div>
    );
  }

  const positionX = parsed.grid === 1 ? 50 : (parsed.col / (parsed.grid - 1)) * 100;
  const positionY = parsed.grid === 1 ? 50 : (parsed.row / (parsed.grid - 1)) * 100;

  return (
    <div
      role="img"
      aria-label={alt}
      className={classNames("overflow-hidden rounded-lg bg-stone-100 bg-no-repeat shadow-sm", className)}
      style={{
        backgroundImage: `url(${parsed.src})`,
        backgroundSize: `${parsed.grid * 100}% ${parsed.grid * 100}%`,
        backgroundPosition: `${positionX}% ${positionY}%`
      }}
    />
  );
}

function Logo({ large = false, compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={classNames("grid place-items-center rounded-lg bg-coral-500 font-black text-white shadow-sm", large ? "h-14 w-14 text-2xl" : "h-11 w-11 text-xl")}>
        ¡V
      </div>
      {!compact && (
        <div>
          <div className={classNames("font-black leading-none text-coral-500", large ? "text-4xl" : "text-3xl")}>Vamos!</div>
          <div className="text-xs font-black uppercase tracking-[0.22em] text-lagoon-600">Gramatica</div>
        </div>
      )}
    </div>
  );
}

export default App;
