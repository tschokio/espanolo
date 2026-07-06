import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copy,
  Flame,
  Gamepad2,
  Gift,
  GraduationCap,
  Image,
  ExternalLink,
  ListChecks,
  LogOut,
  Medal,
  Moon,
  NotebookTabs,
  PenTool,
  Plus,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Sun,
  Target,
  Trash2,
  Trophy,
  Users,
  Volume2,
  Wand2,
  XCircle
} from "lucide-react";

const navItems = [
  { key: "learn", label: "Learn", icon: BookOpen },
  { key: "words", label: "Words", icon: NotebookTabs },
  { key: "review", label: "Review", icon: ListChecks },
  { key: "play", label: "Play", icon: Gamepad2 },
  { key: "profile", label: "Profile", icon: Users },
  { key: "manage", label: "Manage", icon: Shield, adminOnly: true }
];

function primaryNavKey(active) {
  if (["dashboard", "path", "lessons", "grammar"].includes(active)) return "learn";
  if (["pronunciation"].includes(active)) return "words";
  if (["games", "challenges"].includes(active)) return "play";
  if (["progress", "settings"].includes(active)) return "profile";
  if (["admin"].includes(active)) return "manage";
  return active || "learn";
}

const THEME_STORAGE_KEY = "vamos-espanolo-theme";

const imageSheets = {
  "body-and-health": { src: "/images/body-and-health.webp", grid: 4 },
  "city-transport": { src: "/images/city-transport.webp", grid: 4 },
  "classroom-basics": { src: "/images/classroom-basics.webp", grid: 4 },
  "clothing-basics": { src: "/images/clothing-basics.webp", grid: 5 },
  "daily-actions": { src: "/images/daily-actions.webp", grid: 5 },
  "emotions-and-states": { src: "/images/emotions-and-states.webp", grid: 4 },
  "food-and-ordering": { src: "/images/food-and-ordering.webp", grid: 5 },
  "fruit-and-produce": { src: "/images/fruit-and-produce.webp", grid: 5 },
  "grammar-scenes": { src: "/images/grammar-scenes.webp", grid: 4 },
  "home-objects": { src: "/images/home-objects.webp", grid: 5 },
  "minigame-ui-rewards": { src: "/images/minigame-ui-rewards.webp", grid: 4 },
  "nature-and-animals": { src: "/images/nature-and-animals.webp", grid: 4 },
  "numbers-and-colors": { src: "/images/numbers-and-colors.webp", grid: 4 },
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

const miniGameImageKeys = {
  "conjugation-sprint": "minigame-ui-rewards:3",
  "sentence-builder": "minigame-ui-rewards:10",
  "article-match": "minigame-ui-rewards:1",
  "word-catcher": "minigame-ui-rewards:2"
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

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    return "light";
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useThemeMode() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures; the active theme still applies for this session.
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0f172a" : "#fff7ed");
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark"))
  };
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

const DEFAULT_WORD_SESSION_SIZE = 8;
const wordSessionSizes = [
  { key: "easy", label: "Easy", count: 5 },
  { key: "standard", label: "Standard", count: 8 },
  { key: "challenge", label: "Challenge", count: 10 }
];
const wordQuestionStyles = [
  { key: "mixed", label: "Mixed" },
  { key: "flashcard", label: "Flip" },
  { key: "recognition", label: "Choice" },
  { key: "picture", label: "Picture" },
  { key: "typing", label: "Type" }
];

function isWordLearned(word) {
  return (word?.review?.correctCount || 0) > 0 || word?.review?.state === "MASTERED";
}

function isWordAttempted(word) {
  return (
    isWordLearned(word) ||
    Boolean(word?.lastAttempt) ||
    Boolean(word?.review?.dueAt && word?.review?.state !== "NEW") ||
    word?.groupSlug === "audio-lab-saved" ||
    (word?.review?.wrongCount || 0) > 0
  );
}

function wordDueTimestamp(word) {
  if (!word?.review?.dueAt) return 0;
  const time = new Date(word.review.dueAt).getTime();
  return Number.isFinite(time) ? time : 0;
}

function sortWordsForLearning(a, b) {
  return (
    Number(b.review?.due) - Number(a.review?.due) ||
    (a.review?.correctCount || 0) - (b.review?.correctCount || 0) ||
    wordDueTimestamp(a) - wordDueTimestamp(b) ||
    a.spanish.localeCompare(b.spanish)
  );
}

function shuffleWords(words) {
  return [...words].sort(() => 0.5 - Math.random());
}

function shuffleItems(items) {
  return [...(items || [])].sort(() => 0.5 - Math.random());
}

function shuffleAwayFromOriginalOrder(items) {
  const list = [...(items || [])];
  if (list.length <= 1) return list;
  const original = list.map((item) => item?.value ?? item?.id ?? item).join("|");
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const shuffled = shuffleItems(list);
    if (shuffled.map((item) => item?.value ?? item?.id ?? item).join("|") !== original) {
      return shuffled;
    }
  }
  return [list[list.length - 1], ...list.slice(1, -1), list[0]];
}

function lessonGuideSteps(lesson) {
  const outcomes = Array.isArray(lesson?.outcomes) ? lesson.outcomes : [];
  const conceptKeys = Array.isArray(lesson?.conceptKeys) ? lesson.conceptKeys : [];
  const exampleNotes = (lesson?.sentences || [])
    .map((sentence) => sentence.note)
    .filter(Boolean);
  const steps = [
    ...outcomes,
    ...conceptKeys.map((key) => `Focus: ${String(key).replace(/-/g, " ")}.`),
    ...exampleNotes
  ]
    .map((step) => String(step || "").trim())
    .filter(Boolean)
    .filter((step, index, list) => list.findIndex((item) => normalizeText(item) === normalizeText(step)) === index);

  if (steps.length) return steps.slice(0, 8);
  return [
    `Read the examples for ${lesson?.title || "this lesson"} before answering.`,
    "Say each Spanish sentence out loud once.",
    "Notice the small pattern that repeats across the examples.",
    "Then use the quiz to retrieve the pattern from memory."
  ];
}

function sessionPromptMode(type, word, position, repeated = false) {
  if (type === "learn" && !isWordLearned(word) && !repeated) return "flashcard";
  const modes = type === "memory" ? ["picture", "typing", "recognition", "flashcard"] : ["recognition", "picture", "flashcard", "typing"];
  return modes[position % modes.length];
}

function buildWordSession(type, selectedGroups, groups, options = {}) {
  const allWords = groups.flatMap((group) => group.words || []);
  const selectedGroupList = (Array.isArray(selectedGroups) ? selectedGroups : [selectedGroups]).filter(Boolean);
  const sessionSize = options.sessionSize || DEFAULT_WORD_SESSION_SIZE;
  const questionStyle = options.questionStyle || "mixed";
  const sourceWords =
    type === "memory"
      ? allWords.filter(isWordAttempted)
      : selectedGroupList.flatMap((group) => group.words || []);
  const uniqueWords = [...new Map(sourceWords.map((word) => [word.id, word])).values()];
  const sorted = [...uniqueWords].sort(sortWordsForLearning);
  const randomPriority = shuffleWords(sorted.slice(0, Math.max(sessionSize * 2, sessionSize)));
  const rest = shuffleWords(sorted.slice(Math.max(sessionSize * 2, sessionSize)));
  const pool = [...randomPriority, ...rest];
  const primaryLimit = Math.min(pool.length, sessionSize);
  const primary = pool.slice(0, primaryLimit);
  const modeFor = (word, index, repeated = false) =>
    questionStyle === "mixed" ? sessionPromptMode(type, word, index, repeated) : questionStyle;
  const items = primary.map((word, index) => ({
    key: `${type}-${word.id}-${index}`,
    wordId: word.id,
    mode: modeFor(word, index)
  }));

  if (items.length > 0) {
    const repeatPool = [...(type === "learn" ? primary : pool)]
      .sort((a, b) => (a.review?.correctCount || 0) - (b.review?.correctCount || 0) || a.spanish.localeCompare(b.spanish));
    let repeatIndex = 0;
    while (items.length < sessionSize && repeatPool.length) {
      const word = repeatPool[repeatIndex % repeatPool.length];
      items.push({
        key: `${type}-${word.id}-repeat-${repeatIndex}`,
        wordId: word.id,
        mode: modeFor(word, items.length, true)
      });
      repeatIndex += 1;
    }
  }

  return items;
}

let activePronunciationAudio = null;

function pronunciationAudioUrl(text, provider = "", sourceText = "") {
  const params = new URLSearchParams({ text: text || "" });
  if (provider) params.set("provider", provider);
  if (sourceText) params.set("sourceText", sourceText);
  return `/api/pronunciation/audio?${params.toString()}`;
}

function playPronunciationClip(text, setAudioState, provider = "", sourceText = "") {
  if (!text || typeof window === "undefined") return;
  if (activePronunciationAudio) {
    activePronunciationAudio.pause();
    activePronunciationAudio.removeAttribute("src");
  }

  const audio = new Audio(pronunciationAudioUrl(text, provider, sourceText));
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

function ThemeToggle({ theme, onToggle, showLabel = false }) {
  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      title={isDark ? "Use light mode" : "Use dark mode"}
      aria-label={isDark ? "Use light mode" : "Use dark mode"}
      className={classNames(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white font-black text-slate-700 hover:bg-stone-100",
        showLabel ? "px-3" : "w-11 px-0"
      )}
    >
      <Icon size={19} />
      {showLabel && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}

function App() {
  const { theme, setTheme, toggleTheme } = useThemeMode();
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
        <div className="rounded-lg bg-white px-5 py-4 shadow-soft">Loading Vamos Espanolo...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen error={authError} setError={setAuthError} onAuthed={setUser} theme={theme} toggleTheme={toggleTheme} />;
  }

  return <LearningApp user={user} setUser={setUser} theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} />;
}

function AuthScreen({ error, setError, onAuthed, theme, toggleTheme }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
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
    <main className="app-auth-screen min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed,#ecfeff_45%,#ffffff)] px-4 py-8">
      <div className="mx-auto mb-4 flex max-w-6xl justify-end">
        <ThemeToggle theme={theme} onToggle={toggleTheme} showLabel />
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px]">
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

          <p className="mt-4 text-center text-xs text-slate-500">Use your account, or register a new learner profile.</p>
        </form>
      </div>
    </main>
  );
}

function LearningApp({ user, setUser, theme, setTheme, toggleTheme }) {
  const [active, setActive] = useState("learn");
  const [launchLessonId, setLaunchLessonId] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshDashboard = async (options = {}) => {
    const showLoading = options.showLoading ?? !options.silent;
    if (showLoading) setLoading(true);
    setError("");
    try {
      const data = await api("/api/dashboard");
      setDashboard(data);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
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
  const activeNav = primaryNavKey(active);

  return (
    <div className="app-shell min-h-screen bg-stone-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-stone-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-stone-100 p-6">
            <Logo />
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {nav.map((item) => (
              <NavButton key={item.key} item={item} active={activeNav === item.key} onClick={() => setActive(item.key)} />
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
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button className="hidden h-11 w-11 place-items-center rounded-md border border-stone-200 bg-white text-coral-500 sm:grid">
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
              launchLessonId={launchLessonId}
              setLaunchLessonId={setLaunchLessonId}
              theme={theme}
              setTheme={setTheme}
            />
          )}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex gap-1 overflow-x-auto border-t border-stone-200 bg-white px-2 py-2 lg:hidden">
        {nav.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={classNames(
              "flex min-w-[68px] flex-1 flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] font-semibold",
              activeNav === item.key ? "bg-coral-50 text-coral-600" : "text-slate-500"
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

function ActiveView({ active, user, dashboard, refreshDashboard, setActive, launchLessonId, setLaunchLessonId, theme, setTheme }) {
  if (["learn", "dashboard", "path", "lessons", "grammar"].includes(active)) {
    return (
      <LearningWorkspace
        initialTab={active === "path" || active === "lessons" ? "course" : active === "grammar" ? "grammar" : "today"}
        dashboard={dashboard}
        refreshDashboard={refreshDashboard}
        setActive={setActive}
        launchLessonId={launchLessonId}
        setLaunchLessonId={setLaunchLessonId}
      />
    );
  }
  if (active === "review") return <ReviewQueueView refreshDashboard={refreshDashboard} setActive={setActive} />;
  if (["words", "pronunciation"].includes(active)) {
    return <WordsWorkspace initialTab={active === "pronunciation" ? "audio" : "memory"} dashboard={dashboard} refreshDashboard={refreshDashboard} />;
  }
  if (["play", "games", "challenges"].includes(active)) {
    return (
      <PlayWorkspace
        initialTab={active === "challenges" ? "challenge" : "games"}
        dashboard={dashboard}
        refreshDashboard={refreshDashboard}
      />
    );
  }
  if (["profile", "progress", "settings"].includes(active)) {
    return <ProfileWorkspace initialTab={active === "settings" ? "settings" : "progress"} user={user} dashboard={dashboard} theme={theme} setTheme={setTheme} />;
  }
  if ((active === "manage" || active === "admin") && user.role === "ADMIN") {
    return <ManageWorkspace user={user} refreshDashboard={refreshDashboard} theme={theme} setTheme={setTheme} />;
  }
  return <LearningWorkspace dashboard={dashboard} refreshDashboard={refreshDashboard} setActive={setActive} launchLessonId={launchLessonId} setLaunchLessonId={setLaunchLessonId} />;
}

function WorkspaceTabs({ tabs, active, onChange }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2 rounded-lg border border-stone-200 bg-white p-2 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={classNames(
            "inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-black",
            active === tab.key ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-stone-100"
          )}
        >
          <tab.icon size={17} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function LearningWorkspace({ initialTab = "today", dashboard, refreshDashboard, setActive, launchLessonId, setLaunchLessonId }) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!launchLessonId) return;
    setTab("course");
  }, [launchLessonId]);

  return (
    <div>
      <WorkspaceTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "today", label: "Today", icon: Target },
          { key: "course", label: "Course", icon: BookOpen },
          { key: "grammar", label: "Grammar Map", icon: GraduationCap }
        ]}
      />
      {tab === "today" ? (
        <DashboardView
          dashboard={dashboard}
          refreshDashboard={refreshDashboard}
          setActive={setActive}
          onStartLesson={(lessonId) => {
            setLaunchLessonId(lessonId);
            setTab("course");
          }}
        />
      ) : tab === "course" ? (
        <LearningPathView
          dashboard={dashboard}
          refreshDashboard={refreshDashboard}
          setActive={setActive}
          launchLessonId={launchLessonId}
          onLaunchHandled={() => setLaunchLessonId("")}
        />
      ) : (
        <GrammarView lessons={dashboard.lessons} />
      )}
    </div>
  );
}

function WorkspaceSummary({ title, icon: Icon, children, metrics = [] }) {
  return (
    <section className="mb-5 rounded-lg border border-slate-900 bg-slate-950 p-5 text-white shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-black text-lagoon-100">
            {Icon && <Icon size={16} />} {title}
          </p>
          <div className="mt-3 max-w-2xl text-sm font-semibold text-slate-300">{children}</div>
        </div>
        {!!metrics.length && (
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[360px]">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg bg-white/10 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-300">{metric.label}</p>
                <p className="mt-1 text-xl font-black">{metric.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WordsWorkspace({ initialTab = "memory", dashboard, refreshDashboard }) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div>
      <WorkspaceSummary
        title="Words"
        icon={NotebookTabs}
        metrics={[
          { label: "Total", value: dashboard?.stats?.totalWords || 0 },
          { label: "Due", value: dashboard?.stats?.wordReviewCount || 0 },
          { label: "Mastered", value: dashboard?.stats?.masteredWords || 0 }
        ]}
      >
        Practice vocabulary, memory, and audio in one place.
      </WorkspaceSummary>
      <WorkspaceTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "memory", label: "Words & Memory", icon: NotebookTabs },
          { key: "audio", label: "Audio Lab", icon: Volume2 }
        ]}
      />
      {tab === "audio" ? <PronunciationLookupView /> : <WordLearnerView refreshDashboard={refreshDashboard} />}
    </div>
  );
}

function PlayWorkspace({ initialTab = "games", dashboard, refreshDashboard }) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div>
      <WorkspaceSummary
        title="Play"
        icon={Gamepad2}
        metrics={[
          { label: "Challenge", value: dashboard.challenge ? `${dashboard.challenge.progress}/${dashboard.challenge.targetCount}` : "0/0" },
          { label: "Games", value: dashboard.miniGames?.length || 0 },
          { label: "XP", value: dashboard.stats.xp.toLocaleString() }
        ]}
      >
        Mini games and weekly challenges.
      </WorkspaceSummary>
      <WorkspaceTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "games", label: "Mini Games", icon: Gamepad2 },
          { key: "challenge", label: "Challenge", icon: Trophy }
        ]}
      />
      {tab === "challenge" ? (
        <ChallengesView challenge={dashboard.challenge} refreshDashboard={refreshDashboard} />
      ) : (
        <MiniGamesView dashboard={dashboard} refreshDashboard={refreshDashboard} />
      )}
    </div>
  );
}

function ProfileWorkspace({ initialTab = "progress", user, dashboard, theme, setTheme }) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div>
      <WorkspaceSummary
        title="Profile"
        icon={Users}
        metrics={[
          { label: "Level", value: dashboard.stats.level },
          { label: "Streak", value: dashboard.stats.streakDays },
          { label: "XP", value: dashboard.stats.xp.toLocaleString() }
        ]}
      >
        Progress, badges, leaderboard, and settings.
      </WorkspaceSummary>
      <WorkspaceTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "progress", label: "Progress", icon: BarChart3 },
          { key: "settings", label: "Settings", icon: Settings }
        ]}
      />
      {tab === "settings" ? <SettingsView user={user} theme={theme} setTheme={setTheme} /> : <ProgressView dashboard={dashboard} />}
    </div>
  );
}

function ManageWorkspace({ user, refreshDashboard, theme, setTheme }) {
  return (
    <div className="space-y-5">
      <WorkspaceSummary
        title="Manage"
        icon={Shield}
        metrics={[
          { label: "Role", value: user.role },
          { label: "Admin", value: "Tools" },
          { label: "Settings", value: "Included" }
        ]}
      >
        Admin tools, deployment status, and account settings.
      </WorkspaceSummary>
      <AdminView refreshDashboard={refreshDashboard} />
      <SettingsView user={user} theme={theme} setTheme={setTheme} />
    </div>
  );
}

function LearningPathView({ dashboard, refreshDashboard, setActive, launchLessonId, onLaunchHandled }) {
  const orderedLessons = dashboard.lessons || [];
  const inProgressLessons = orderedLessons.filter((lessonItem) => lessonItem.progress > 0 && lessonItem.progress < 100);
  const dueLessons = orderedLessons.filter((lessonItem) => lessonItem.reviewDue);
  const freshLessons = orderedLessons.filter((lessonItem) => lessonItem.progress === 0);
  const completedLessons = orderedLessons.filter((lessonItem) => lessonItem.progress >= 100 && !lessonItem.reviewDue);
  const nextLesson =
    inProgressLessons[0] || dueLessons[0] || freshLessons[0] || completedLessons[completedLessons.length - 1] || orderedLessons[0];
  const activeLessons = orderedLessons.filter(
    (lessonItem) => (lessonItem.progress < 100 || lessonItem.reviewDue) && lessonItem.id !== nextLesson?.id
  );
  const [selectedId, setSelectedId] = useState("");
  const [lesson, setLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    if (!launchLessonId) return;
    setSelectedId(launchLessonId);
    onLaunchHandled?.();
  }, [launchLessonId, onLaunchHandled]);

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
  const nextIndex = nextLesson ? orderedLessons.findIndex((lessonItem) => lessonItem.id === nextLesson.id) : -1;
  const upcomingLessons = activeLessons;

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
      <section className="rounded-lg bg-slate-950 p-5 text-white shadow-soft sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-lagoon-100">
              <Target size={16} /> Easiest to hardest
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-black sm:text-4xl">One path. Finish the next lesson, then move up.</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold text-slate-300 sm:text-base">
              Completed lessons stay available, and important ones come back automatically for reinforcement.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-[560px]">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-300">Mastery</p>
              <p className="mt-2 text-2xl font-black">{averageProgress}%</p>
              <ProgressBar value={averageProgress} className="mt-3" color="bg-honey-500" />
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-300">Next step</p>
              <p className="mt-2 text-2xl font-black">{nextIndex >= 0 ? `${nextIndex + 1}/${orderedLessons.length}` : "0/0"}</p>
              <p className="mt-1 text-xs font-bold text-slate-300">{dueLessons.length ? `${dueLessons.length} due` : "Path active"}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-300">Completed</p>
              <p className="mt-2 text-2xl font-black">{completedLessons.length}</p>
              <p className="mt-1 text-xs font-bold text-slate-300">{orderedLessons.length} total lessons</p>
            </div>
          </div>
        </div>
        {nextLesson && (
          <button
            onClick={() => setSelectedId(nextLesson.id)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-honey-500 px-4 py-3 font-black text-white hover:bg-honey-600 sm:w-fit sm:px-6"
          >
            <Rocket size={18} /> {nextLesson.reviewDue ? "Review Due Lesson" : nextLesson.progress > 0 ? "Continue Next Lesson" : "Start Next Lesson"}
          </button>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-5">
          {nextLesson && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">{nextLesson.reviewDue ? "Due for review" : "Current lesson"}</h2>
                <span className="rounded-full bg-honey-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-honey-700">
                  Step {nextIndex + 1}
                </span>
              </div>
              <PathLessonCard
                lessonItem={nextLesson}
                index={nextIndex}
                state="current"
                onSelect={() => setSelectedId(nextLesson.id)}
              />
            </div>
          )}

          {upcomingLessons.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">Coming up and due</h2>
                <span className="text-sm font-bold text-slate-500">{upcomingLessons.length} lessons</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {upcomingLessons.map((lessonItem) => (
                  <PathLessonCard
                    key={lessonItem.id}
                    lessonItem={lessonItem}
                    index={orderedLessons.findIndex((item) => item.id === lessonItem.id)}
                    state="upcoming"
                    onSelect={() => setSelectedId(lessonItem.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {!nextLesson && orderedLessons.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <AssetImage imageKey="rewards-and-progress:15" alt="Path complete" className="h-20 w-20 shrink-0" />
                <div>
                  <h2 className="text-xl font-black text-emerald-950">All lessons are complete</h2>
                  <p className="mt-1 text-sm font-semibold text-emerald-800">
                    Use the completed section below to review anything again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {completedLessons.length > 0 && (
            <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
              <button
                onClick={() => setShowCompleted((value) => !value)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <span>
                  <span className="block text-lg font-black">Completed lessons</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-500">
                    {completedLessons.length} available any time
                  </span>
                </span>
                <span className="rounded-md border border-stone-200 px-3 py-2 text-sm font-black text-slate-700">
                  {showCompleted ? "Hide" : "Show"}
                </span>
              </button>
              {showCompleted && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {completedLessons.map((lessonItem) => (
                    <PathLessonCard
                      key={lessonItem.id}
                      lessonItem={lessonItem}
                      index={orderedLessons.findIndex((item) => item.id === lessonItem.id)}
                      state="completed"
                      onSelect={() => setSelectedId(lessonItem.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </section>

        <aside className="space-y-5">
          <Panel title="Path Status" icon={ListChecks}>
            <div className="grid gap-3">
              <InfoTile label="Open lessons" value={activeLessons.length} />
              <InfoTile label="Due again" value={dueLessons.length} />
              <InfoTile label="Completed" value={completedLessons.length} />
              <InfoTile label="Average mastery" value={`${averageProgress}%`} />
            </div>
            {nextLesson && (
              <button
                onClick={() => setSelectedId(nextLesson.id)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-lagoon-500 px-4 py-3 font-black text-white hover:bg-lagoon-600"
              >
                <Rocket size={18} /> {nextLesson.reviewDue ? "Review Due" : nextLesson.progress > 0 ? "Start Next" : "Start"}
              </button>
            )}
          </Panel>

          <Panel title="Learning Rhythm" icon={Target}>
            <div className="grid gap-3 text-sm font-bold text-slate-700">
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                Course lessons introduce the grammar and vocabulary together.
              </div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                Review brings back weak items when they are due.
              </div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                Words and play reinforce the same material from another angle.
              </div>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function PathLessonCard({ lessonItem, index, state, onSelect }) {
  const done = lessonItem.progress >= 100;
  const due = lessonItem.reviewDue;
  const current = state === "current";
  const actionLabel = due ? "Review due" : done ? "Review" : lessonItem.progress > 0 ? "Continue" : "Start";

  return (
    <button
      onClick={onSelect}
      className={classNames(
        "group flex min-h-36 w-full flex-col rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft",
        current
          ? "border-honey-500 bg-amber-50"
          : due
            ? "border-honey-300 bg-amber-50"
            : done
            ? "border-emerald-200 bg-emerald-50"
            : "border-stone-200 bg-white hover:bg-stone-50"
      )}
    >
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <AssetImage imageKey={lessonItem.imageKey} alt={lessonItem.title} className="h-20 w-20" />
          <span
            className={classNames(
              "absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full text-xs font-black text-white",
              due ? "bg-honey-600" : done ? "bg-emerald-600" : current ? "bg-honey-600" : "bg-slate-950"
            )}
          >
            {index + 1}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-lagoon-700">{lessonItem.cefrLevel}</span>
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">{lessonItem.theme}</span>
          </div>
          <h3 className="mt-2 text-lg font-black leading-tight text-slate-950">{lessonItem.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-600">{lessonItem.summary}</p>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-3">
          <ProgressBar
            value={lessonItem.progress}
            className="flex-1"
            color={due ? "bg-honey-500" : done ? "bg-emerald-500" : current ? "bg-honey-500" : "bg-lagoon-500"}
          />
          <span className="text-sm font-black text-slate-700">{lessonItem.progress}%</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-bold text-slate-500">
            {lessonItem.estimatedMinutes} min · {lessonItem.exerciseCount} checks
          </span>
          <span className="font-black text-lagoon-700 group-hover:text-lagoon-900">{actionLabel}</span>
        </div>
      </div>
    </button>
  );
}

function FocusedLessonSession({ lesson, onBack, refreshDashboard }) {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);
  const [resultBanner, setResultBanner] = useState(null);
  const [sessionRun, setSessionRun] = useState(0);
  const [completionReported, setCompletionReported] = useState(false);

  useEffect(() => {
    setStep(0);
    setResults([]);
    setResultBanner(null);
    setSessionRun(0);
    setCompletionReported(false);
  }, [lesson.id]);

  const overviewStep = { type: "overview" };
  const learnSteps = lesson.sentences.map((sentence, index) => ({ type: "learn", sentence, index }));
  const randomizedExercises = useMemo(() => shuffleItems(lesson.exercises || []), [lesson.id, sessionRun]);
  const practiceSteps = randomizedExercises.map((exercise, index) => ({ type: "practice", exercise, index }));
  const steps = [overviewStep, ...learnSteps, ...practiceSteps];
  const current = steps[step];
  const finished = step >= steps.length;
  const correct = results.filter(Boolean).length;
  const score = lesson.exercises.length ? Math.round((correct / lesson.exercises.length) * 100) : 100;
  const progress = steps.length ? Math.round((Math.min(step, steps.length) / steps.length) * 100) : 0;

  useEffect(() => {
    if (!finished || completionReported) return;
    setCompletionReported(true);
    api(`/api/lessons/${lesson.id}/reinforcement-complete`, {
      method: "POST",
      body: { score }
    })
      .then(() => refreshDashboard?.({ silent: true }))
      .catch(() => null);
  }, [completionReported, finished, lesson.id, refreshDashboard, score]);

  if (finished) {
    return (
      <section className="mx-auto max-w-3xl">
        <button onClick={onBack} className="mb-4 rounded-md border border-stone-200 bg-white px-4 py-2 font-bold text-slate-600">
          Back to map
        </button>
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-center shadow-soft">
          <AssetImage imageKey="rewards-and-progress:15" alt="Complete" className="mx-auto h-28 w-28" />
          <h1 className="mt-5 text-3xl font-black">Lesson complete</h1>
          <p className="mt-2 text-slate-600">{lesson.reviewSummary || lesson.title}</p>
          {!!lesson.outcomes?.length && (
            <div className="mx-auto mt-5 max-w-md rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left">
              <p className="font-black text-emerald-950">You can now</p>
              <div className="mt-2 grid gap-2">
                {lesson.outcomes.map((outcome) => (
                  <p key={outcome} className="flex items-start gap-2 text-sm font-bold text-emerald-800">
                    <CheckCircle2 className="mt-0.5 shrink-0" size={16} /> {outcome}
                  </p>
                ))}
              </div>
            </div>
          )}
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
                setResultBanner(null);
                setCompletionReported(false);
                setSessionRun((value) => value + 1);
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

      <QuizResultBanner result={resultBanner} className="mb-4" />

      {current.type === "overview" ? (
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center">
            <AssetImage imageKey={lesson.imageKey} alt={lesson.title} className="aspect-square w-full max-w-[170px]" />
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">Lesson focus</p>
              <h1 className="mt-3 text-3xl font-black text-slate-950">{lesson.title}</h1>
              <p className="mt-3 text-base font-semibold text-slate-600">{lesson.summary}</p>
              {!!lesson.outcomes?.length && (
                <div className="mt-5 grid gap-2">
                  {lesson.outcomes.map((outcome) => (
                    <p key={outcome} className="flex items-start gap-2 text-sm font-bold text-slate-700">
                      <Target className="mt-0.5 shrink-0 text-lagoon-600" size={16} /> {outcome}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setStep((value) => value + 1)}
            className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600"
          >
            Start lesson
          </button>
        </div>
      ) : current.type === "learn" ? (
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-[140px_1fr] sm:items-center">
            <AssetImage imageKey={lesson.imageKey} alt={lesson.title} className="aspect-square w-full max-w-[160px]" />
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">Learn {current.index + 1}/{learnSteps.length}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-slate-950">{current.sentence.spanish}</h1>
                <PronunciationTools text={current.sentence.spanish} compact />
              </div>
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
          autoAdvanceOnWrong
          autoAdvanceDelay={850}
          autoSubmitChoices
          onResult={(result) => {
            setResultBanner(result);
            setResults((currentResults) => {
              const next = [...currentResults];
              next[current.index] = Boolean(result.correct);
              return next;
            });
          }}
          onComplete={() => {
            setStep((value) => value + 1);
            refreshDashboard?.({ silent: true }).catch(() => null);
          }}
        />
      )}
    </section>
  );
}

function WordLearnerView({ refreshDashboard }) {
  const [data, setData] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [studyMode, setStudyMode] = useState("learn");
  const [session, setSession] = useState(null);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [sessionNotice, setSessionNotice] = useState("");
  const [lastSummary, setLastSummary] = useState(null);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("standard");
  const [questionStyle, setQuestionStyle] = useState("mixed");
  const [mode, setMode] = useState("flashcard");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const wordAdvanceTimer = useRef(null);

  const resetCard = () => {
    if (wordAdvanceTimer.current) {
      window.clearTimeout(wordAdvanceTimer.current);
      wordAdvanceTimer.current = null;
    }
    setFlipped(false);
    setTypedAnswer("");
    setFeedback(null);
  };

  useEffect(
    () => () => {
      if (wordAdvanceTimer.current) window.clearTimeout(wordAdvanceTimer.current);
    },
    []
  );

  const loadWords = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const payload = await api("/api/words");
    const cityGroup = payload.groups.find((group) => group.slug === "city-transport");
    setData(payload);
    setSelectedGroupId((current) => current || cityGroup?.id || payload.groups[0]?.id || "");
    setSelectedGroupIds((current) => (current.length ? current : cityGroup?.id ? [cityGroup.id] : payload.groups[0]?.id ? [payload.groups[0].id] : []));
    setLoading(false);
  };

  useEffect(() => {
    loadWords();
  }, []);

  const selectedGroups = data?.groups.filter((group) => selectedGroupIds.includes(group.id)) || [];
  const selectedGroup = selectedGroups[0] || data?.groups.find((group) => group.id === selectedGroupId) || data?.groups[0];
  const words = useMemo(() => {
    const list = selectedGroups.length ? selectedGroups.flatMap((group) => group.words || []) : selectedGroup?.words || [];
    return [...list].sort(sortWordsForLearning);
  }, [selectedGroup, selectedGroups]);
  const allWords = useMemo(() => data?.groups.flatMap((group) => group.words) || [], [data]);
  const memoryCount = allWords.filter(isWordAttempted).length;
  const sessionSize = wordSessionSizes.find((item) => item.key === difficulty)?.count || DEFAULT_WORD_SESSION_SIZE;

  const beginSession = (type = studyMode, groupId = selectedGroupId, sourceData = data) => {
    if (!sourceData?.groups?.length) return;
    const group =
      sourceData.groups.find((item) => item.id === groupId) ||
      sourceData.groups.find((item) => item.slug === "city-transport") ||
      sourceData.groups[0];
    const items = buildWordSession(type, group, sourceData.groups, { sessionSize, questionStyle });

    setStudyMode(type);
    setSelectedGroupId(group?.id || "");
    setIndex(0);
    resetCard();

    if (!items.length) {
      setSession(null);
      setSessionResults([]);
      setSessionIndex(0);
      setSessionNotice(type === "memory" ? "Do a few category questions first, then Memory will test them again." : "This deck has no words yet.");
      return;
    }

    setSession({
      type,
      groupId: group?.id || "",
      groupTitle: type === "memory" ? "Memory" : group?.title || "Words",
      questionStyle,
      sessionSize,
      items,
      startedAt: Date.now()
    });
    setSessionIndex(0);
    setSessionResults([]);
    setSessionNotice("");
    setLastAnswer(null);
  };

  const startQuiz = (type = studyMode) => {
    if (!data?.groups?.length) return;
    const groupsForQuiz = data.groups.filter((group) => selectedGroupIds.includes(group.id));

    if (type !== "memory" && !groupsForQuiz.length) {
      setSessionNotice("Choose at least one category first.");
      return;
    }

    const items = buildWordSession(type, groupsForQuiz, data.groups, { sessionSize, questionStyle });
    if (!items.length) {
      setSession(null);
      setSessionResults([]);
      setSessionIndex(0);
      setSessionNotice(type === "memory" ? "Do a few category questions first, then Memory will test them again." : "The selected categories have no words yet.");
      return;
    }

    setStudyMode(type);
    setSelectedGroupId(groupsForQuiz[0]?.id || selectedGroupId || data.groups[0]?.id || "");
    setSession({
      type,
      groupIds: groupsForQuiz.map((group) => group.id),
      groupTitle: type === "memory" ? "Memory" : groupsForQuiz.map((group) => group.title).join(", "),
      questionStyle,
      sessionSize,
      items,
      startedAt: Date.now()
    });
    setSessionIndex(0);
    setSessionResults([]);
    setSessionNotice("");
    setLastSummary(null);
    setLastAnswer(null);
    resetCard();
  };

  const finishQuiz = () => {
    const total = session?.items.length || 0;
    const correct = sessionResults.filter(Boolean).length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    setLastSummary({
      title: session?.groupTitle || "Words",
      type: session?.type || studyMode,
      correct,
      total,
      score,
      difficulty: wordSessionSizes.find((item) => item.key === difficulty)?.label || "Standard",
      questionType: wordQuestionStyles.find((item) => item.key === questionStyle)?.label || "Mixed"
    });
    setSession(null);
    setSessionIndex(0);
    setSessionResults([]);
    resetCard();
    loadWords(false);
    refreshDashboard?.({ silent: true }).catch(() => null);
  };

  useEffect(() => {
    if (!data || hasAutoStarted) return;
    setHasAutoStarted(true);
  }, [data, hasAutoStarted]);

  const sessionFinished = Boolean(session && sessionIndex >= session.items.length);
  const currentSessionItem = !sessionFinished ? session?.items[sessionIndex] : null;
  const sessionWord = currentSessionItem
    ? allWords.find((candidate) => candidate.id === currentSessionItem.wordId) || null
    : null;
  const word = sessionWord || (!sessionFinished ? words[index % Math.max(1, words.length)] : null);
  const activeMode = currentSessionItem?.mode || mode;
  const choices = useMemo(() => {
    if (!word) return [];
    const answerField = activeMode === "picture" ? "spanish" : "english";
    const distractors = allWords
      .filter((candidate) => candidate.id !== word.id)
      .map((candidate) => candidate[answerField])
      .filter(Boolean)
      .slice(0, 30);
    const pool = [word[answerField], ...distractors.sort(() => 0.5 - Math.random()).slice(0, 3)];
    return pool.sort(() => 0.5 - Math.random());
  }, [word?.id, activeMode, allWords.length]);

  const nextCard = () => {
    if (session) {
      if (sessionIndex + 1 >= session.items.length) {
        finishQuiz();
        return;
      }
      setSessionIndex((current) => Math.min(current + 1, session.items.length));
      resetCard();
      return;
    }
    setIndex((current) => (words.length ? (current + 1) % words.length : 0));
    resetCard();
  };

  const submitWord = async (answer, attemptMode = activeMode, quality = "") => {
    if (!word) return;
    const result = await api(`/api/words/${word.id}/attempt`, {
      method: "POST",
      body: {
        mode: ["typing", "picture"].includes(attemptMode) ? "en-es" : "es-en",
        answer,
        quality
      }
    });
    setFeedback(result);
    setLastAnswer({
      correct: result.correct,
      spanish: word.spanish,
      english: word.english,
      submitted: answer || (quality ? quality : ""),
      expected: result.expected,
      message: result.review?.message || "",
      xpAwarded: result.xpAwarded
    });
    if (session) {
      setSessionResults((current) => {
        const next = [...current];
        next[sessionIndex] = Boolean(result.correct);
        return next;
      });
      wordAdvanceTimer.current = window.setTimeout(() => {
        wordAdvanceTimer.current = null;
        nextCard();
      }, result.correct ? 750 : 1250);
    } else {
      await loadWords(false);
    }
  };

  if (loading || !data) {
    return <Panel title="Words">Loading word decks...</Panel>;
  }

  if (!word && !sessionFinished) {
    return <Panel title="Words">No words are available yet.</Panel>;
  }

  const sessionTotal = session?.items.length || 0;
  const attemptedCount = sessionResults.filter((result) => result !== undefined).length;
  const sessionCorrect = sessionResults.filter(Boolean).length;
  const sessionProgress = sessionTotal ? Math.round((attemptedCount / sessionTotal) * 100) : 0;
  const scorePercent = sessionTotal ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
  const selectedLearned = selectedGroup?.learned ?? selectedGroup?.mastered ?? 0;
  const selectedTotal = selectedGroup?.total || 0;
  const promptLabel =
    activeMode === "typing" ? "Type" : activeMode === "recognition" ? "Choice" : activeMode === "picture" ? "Picture" : "Flip";
  const expectedChoice = activeMode === "picture" ? word?.spanish : word?.english;
  const nextLabel = session
    ? sessionIndex + 1 >= session.items.length
      ? "Finish session"
      : "Next question"
    : "Next word";
  const sessionTitle = session
    ? session.type === "memory"
      ? "Memory Session"
      : `${session.groupTitle || selectedGroup?.title || "Words"} Session`
    : selectedGroup?.title || "Word Deck";
  const selectedWordCount = selectedGroups.reduce((sum, group) => sum + (group.total || group.words?.length || 0), 0);
  const canStartQuiz = studyMode === "memory" ? memoryCount > 0 : selectedGroups.length > 0 && selectedWordCount > 0;

  if (!session) {
    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-5">
          <Panel title="Word Quiz Setup" icon={NotebookTabs}>
            {lastSummary && (
              <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Last Quiz</p>
                    <h2 className="mt-1 text-xl font-black text-emerald-950">{lastSummary.title}</h2>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {lastSummary.correct}/{lastSummary.total} correct · {lastSummary.difficulty} · {lastSummary.questionType}
                    </p>
                  </div>
                  <div className="text-3xl font-black text-emerald-700">{lastSummary.score}%</div>
                </div>
              </div>
            )}

            <div className="grid gap-4 rounded-lg border border-stone-200 bg-stone-50 p-4 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Mode</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["learn", "Learn Categories"],
                    ["memory", "Memory"]
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setStudyMode(key);
                        setSessionNotice("");
                      }}
                      className={classNames(
                        "rounded-md px-3 py-2 text-xs font-black",
                        studyMode === key ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-stone-100"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {wordSessionSizes.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setDifficulty(item.key)}
                      className={classNames(
                        "rounded-md px-3 py-2 text-xs font-black",
                        difficulty === item.key ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-stone-100"
                      )}
                    >
                      {item.label} · {item.count}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Question Type</p>
                <div className="flex flex-wrap gap-2">
                  {wordQuestionStyles.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setQuestionStyle(item.key);
                        resetCard();
                      }}
                      className={classNames(
                        "rounded-md px-3 py-2 text-xs font-black",
                        questionStyle === item.key ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-stone-100"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {sessionNotice && (
              <div className="mt-4 rounded-lg border border-honey-200 bg-honey-50 p-4 font-bold text-honey-900">
                {sessionNotice}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-bold text-slate-600">
                {studyMode === "memory"
                  ? `${memoryCount} memory word${memoryCount === 1 ? "" : "s"} available`
                  : `${selectedGroups.length} categor${selectedGroups.length === 1 ? "y" : "ies"} · ${selectedWordCount} words`}
              </div>
              <button
                disabled={!canStartQuiz}
                onClick={() => startQuiz(studyMode)}
                className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start Quiz
              </button>
            </div>
          </Panel>

          <Panel title="Categories" icon={ListChecks}>
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const ids = data.groups.map((group) => group.id);
                  setSelectedGroupIds(ids);
                  setSelectedGroupId(ids[0] || "");
                }}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-stone-50"
              >
                Select All
              </button>
              <button
                onClick={() => {
                  setSelectedGroupIds([]);
                  setSelectedGroupId("");
                }}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-stone-50"
              >
                Clear
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {data.groups.map((group) => {
                const selected = selectedGroupIds.includes(group.id);
                const learned = group.learned ?? group.mastered ?? 0;
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroupIds((current) => {
                        const next = current.includes(group.id)
                          ? current.filter((id) => id !== group.id)
                          : [...current, group.id];
                        setSelectedGroupId(next[0] || "");
                        return next;
                      });
                      setSessionNotice("");
                    }}
                    className={classNames(
                      "grid grid-cols-[54px_1fr_auto] items-center gap-3 rounded-lg border p-3 text-left",
                      selected ? "border-lagoon-500 bg-lagoon-50" : "border-stone-200 bg-white hover:bg-stone-50"
                    )}
                  >
                    <AssetImage imageKey={group.imageKey} alt={group.title} className="h-12 w-12" />
                    <div className="min-w-0">
                      <p className="truncate font-black">{group.title}</p>
                      <p className="truncate text-xs text-slate-500">
                        {group.new ?? 0} new · {group.reviewDue ?? group.due} review
                      </p>
                      <ProgressBar value={group.total ? (learned / group.total) * 100 : 0} className="mt-2" />
                    </div>
                    <span className="text-sm font-black text-lagoon-700">{learned}/{group.total}</span>
                  </button>
                );
              })}
            </div>
          </Panel>
        </section>

        <aside className="space-y-5">
          <Panel title="Word Stats" icon={BarChart3}>
            <div className="grid grid-cols-2 gap-3">
              <InfoTile label="Total" value={data.stats.total} />
              <InfoTile label="New" value={data.stats.new ?? 0} />
              <InfoTile label="Review" value={data.stats.reviewDue ?? data.stats.due} />
              <InfoTile label="Memory" value={memoryCount} />
              <InfoTile label="Learned" value={data.stats.learned ?? 0} />
              <InfoTile label="Mastered" value={data.stats.mastered} />
            </div>
          </Panel>
        </aside>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <Panel
        title={sessionTitle}
        icon={Sparkles}
        action={
          <button
            onClick={() => {
              setSession(null);
              setSessionIndex(0);
              setSessionResults([]);
              resetCard();
            }}
            className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-stone-50"
          >
            Exit
          </button>
        }
      >
        <div className="mb-5 rounded-lg border border-lagoon-100 bg-lagoon-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-black text-lagoon-900">
            <span>{session.type === "memory" ? `Memory · ${memoryCount} words` : session.groupTitle}</span>
            <span>
              {attemptedCount}/{sessionTotal} answered · {promptLabel}
            </span>
          </div>
          <ProgressBar value={sessionProgress} className="mt-3" />
        </div>

        {lastAnswer && (
          <div
            className={classNames(
              "mb-5 rounded-lg border p-4",
              lastAnswer.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className={classNames("text-xs font-black uppercase tracking-wide", lastAnswer.correct ? "text-emerald-700" : "text-red-700")}>
                  Last answer
                </p>
                <p className="mt-1 font-black text-slate-950">
                  {lastAnswer.spanish} = {lastAnswer.english}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {lastAnswer.correct ? `Correct +${lastAnswer.xpAwarded} XP` : `Expected: ${lastAnswer.expected}`}
                </p>
              </div>
              <span className={classNames("rounded-full px-3 py-1 text-sm font-black", lastAnswer.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}>
                {lastAnswer.correct ? "Scheduled forward" : "Queued again soon"}
              </span>
            </div>
            {lastAnswer.message && <p className="mt-2 text-sm font-semibold text-slate-600">{lastAnswer.message}</p>}
          </div>
        )}

        <div className={classNames("grid gap-5", activeMode === "picture" ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-1")}>
          {activeMode === "picture" && (
            <div>
              <AssetImage imageKey={word.imageKey || selectedGroup?.imageKey} alt={word.spanish} className="aspect-square w-full" />
              <div className="mt-3 flex justify-between text-sm font-bold text-slate-500">
                <span>{sessionIndex + 1} / {sessionTotal}</span>
                <span>{word.review.state}</span>
              </div>
            </div>
          )}

          <div className="flex min-h-[330px] flex-col rounded-lg border border-stone-200 bg-stone-50 p-5">
            {activeMode === "flashcard" && (
              <>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">Front</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-4xl font-black text-slate-950">{word.spanish}</h2>
                  <PronunciationTools text={word.spanish} />
                </div>
                {flipped && (
                  <div className="mt-6 grid gap-4 rounded-lg border border-lagoon-200 bg-white p-4 sm:grid-cols-[150px_1fr] sm:items-center">
                    <AssetImage imageKey={word.imageKey || selectedGroup?.imageKey} alt={word.spanish} className="aspect-square w-full" />
                    <div>
                      <p className="text-sm font-black text-lagoon-700">Meaning</p>
                      <p className="mt-1 text-2xl font-black text-lagoon-900">{word.english}</p>
                      <p className="mt-2 text-sm font-bold text-slate-600">
                        {word.partOfSpeech}
                        {word.gender ? ` · ${word.gender}` : ""}
                      </p>
                      {word.example && <p className="mt-3 font-bold text-slate-700">{word.example}</p>}
                    </div>
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {!flipped ? (
                    <button onClick={() => setFlipped(true)} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600">
                      Flip Card
                    </button>
                  ) : (
                    <>
                      <button
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord("", "flashcard", "again")}
                        className="rounded-md bg-red-600 px-4 py-3 font-black text-white hover:bg-red-700 disabled:cursor-default disabled:opacity-60"
                      >
                        Again
                      </button>
                      <button
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord(word.english, "flashcard", "hard")}
                        className="rounded-md bg-honey-500 px-4 py-3 font-black text-white hover:bg-honey-600 disabled:cursor-default disabled:opacity-60"
                      >
                        Hard
                      </button>
                      <button
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord(word.english, "flashcard", "good")}
                        className="rounded-md bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700 disabled:cursor-default disabled:opacity-60"
                      >
                        Good
                      </button>
                      <button
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord(word.english, "flashcard", "easy")}
                        className="rounded-md bg-lagoon-600 px-4 py-3 font-black text-white hover:bg-lagoon-700 disabled:cursor-default disabled:opacity-60"
                      >
                        Easy
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {activeMode === "recognition" && (
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
                        feedback && choice === expectedChoice && "border-emerald-400 bg-emerald-50 text-emerald-900",
                        feedback && feedback.correct === false && choice === feedback.expected && "border-emerald-400 bg-emerald-50"
                      )}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeMode === "picture" && (
              <>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">Choose the Spanish</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">What is this?</h2>
                <div className="mt-3">
                  <PronunciationTools text={word.spanish} />
                </div>
                <div className="mt-6 grid gap-3">
                  {choices.map((choice) => (
                    <button
                      key={choice}
                      disabled={Boolean(feedback)}
                      onClick={() => submitWord(choice, "picture")}
                      className={classNames(
                        "rounded-md border bg-white px-4 py-3 text-left font-bold hover:bg-stone-50 disabled:cursor-default",
                        feedback && choice === expectedChoice && "border-emerald-400 bg-emerald-50 text-emerald-900",
                        feedback && feedback.correct === false && choice === feedback.expected && "border-emerald-400 bg-emerald-50"
                      )}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeMode === "typing" && (
              <>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">Type the Spanish</p>
                <h2 className="mt-3 text-4xl font-black text-slate-950">{word.english}</h2>
                <input
                  value={typedAnswer}
                  disabled={Boolean(feedback)}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    if (!feedback && typedAnswer.trim()) {
                      submitWord(typedAnswer, "typing");
                    }
                  }}
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
                <p className="mt-1 text-sm text-slate-700">
                  Expected: <span className="font-black">{feedback.expected}</span>
                </p>
                <p className="mt-1 text-sm text-slate-700">{feedback.review.message}</p>
                <div className="mt-4 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
                  {nextLabel} loading...
                </div>
              </div>
            )}
          </div>
        </div>
      </Panel>
    </section>
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <section className="order-1 space-y-5 xl:order-2">
        <Panel
          title={sessionTitle}
          icon={Sparkles}
          action={
            <div className="flex flex-wrap gap-2 text-xs font-black">
              <button
                onClick={() => beginSession("learn")}
                className={classNames(
                  "rounded-md px-3 py-2",
                  studyMode === "learn" ? "bg-lagoon-500 text-white" : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                )}
              >
                Learn
              </button>
              <button
                onClick={() => beginSession("memory")}
                className={classNames(
                  "rounded-md px-3 py-2",
                  studyMode === "memory" ? "bg-lagoon-500 text-white" : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                )}
              >
                Memory
              </button>
            </div>
          }
        >
          <div className="mb-5 grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 lg:grid-cols-[1fr_1.2fr_auto] lg:items-center">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {wordSessionSizes.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setDifficulty(item.key)}
                    className={classNames(
                      "rounded-md px-3 py-2 text-xs font-black",
                      difficulty === item.key ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-stone-100"
                    )}
                  >
                    {item.label} · {item.count}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Question Type</p>
              <div className="flex flex-wrap gap-2">
                {wordQuestionStyles.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setQuestionStyle(item.key);
                      setMode(item.key === "mixed" ? "flashcard" : item.key);
                      resetCard();
                    }}
                    className={classNames(
                      "rounded-md px-3 py-2 text-xs font-black",
                      questionStyle === item.key ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-stone-100"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => beginSession(studyMode === "memory" ? "memory" : "learn")}
              className="rounded-md bg-lagoon-500 px-4 py-3 font-black text-white hover:bg-lagoon-600"
            >
              Start
            </button>
          </div>

          {sessionNotice && (
            <div className="mb-5 rounded-lg border border-honey-200 bg-honey-50 p-4 font-bold text-honey-900">
              {sessionNotice}
            </div>
          )}

          {!session && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="flex rounded-md bg-white p-1 text-xs font-black shadow-sm">
                {[
                  ["flashcard", "Card"],
                  ["recognition", "Choice"],
                  ["picture", "Picture"],
                  ["typing", "Type"]
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMode(key);
                      setQuestionStyle(key);
                      resetCard();
                    }}
                    className={classNames("rounded px-3 py-2", mode === key ? "bg-slate-950 text-white" : "text-slate-500")}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => beginSession("learn")}
                className="rounded-md bg-lagoon-500 px-4 py-2 font-black text-white hover:bg-lagoon-600"
              >
                Start session
              </button>
            </div>
          )}

          {session && !sessionFinished && (
            <div className="mb-5 rounded-lg border border-lagoon-100 bg-lagoon-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-black text-lagoon-900">
                <span>{session.type === "memory" ? `Memory · ${memoryCount} words` : "Category learning"}</span>
                <span>
                  {attemptedCount}/{sessionTotal} answered · {promptLabel}
                </span>
              </div>
              <ProgressBar value={sessionProgress} className="mt-3" />
            </div>
          )}

          {sessionFinished ? (
            <div className="mx-auto max-w-xl py-4 text-center">
              <AssetImage imageKey="rewards-and-progress:15" alt="Complete" className="mx-auto h-28 w-28" />
              <h2 className="mt-5 text-3xl font-black text-slate-950">Session complete</h2>
              <p className="mt-2 font-semibold text-slate-600">
                {sessionCorrect}/{sessionTotal} correct
              </p>
              <div className="mx-auto mt-5 max-w-sm">
                <ProgressBar value={scorePercent} color={scorePercent >= 80 ? "bg-emerald-500" : "bg-honey-500"} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoTile label="Score" value={`${scorePercent}%`} />
                <InfoTile label="Questions" value={sessionTotal} />
                <InfoTile
                  label={session.type === "memory" ? "Memory" : "Deck"}
                  value={session.type === "memory" ? memoryCount : `${selectedLearned}/${selectedTotal}`}
                />
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => beginSession("learn")}
                  className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600"
                >
                  Learn again
                </button>
                <button
                  onClick={() => beginSession("memory")}
                  className="rounded-md border border-stone-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-stone-50"
                >
                  Memory
                </button>
              </div>
            </div>
          ) : (
            <div className={classNames("grid gap-5", activeMode === "picture" ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-1")}>
              {activeMode === "picture" && (
                <div>
                  <AssetImage imageKey={word.imageKey || selectedGroup?.imageKey} alt={word.spanish} className="aspect-square w-full" />
                  <div className="mt-3 flex justify-between text-sm font-bold text-slate-500">
                    <span>{session ? `${sessionIndex + 1} / ${sessionTotal}` : `${index + 1} / ${words.length}`}</span>
                    <span>{word.review.state}</span>
                  </div>
                </div>
              )}

              <div className="flex min-h-[330px] flex-col rounded-lg border border-stone-200 bg-stone-50 p-5">
                {activeMode === "flashcard" && (
                  <>
                    <p className="text-sm font-black uppercase tracking-wide text-slate-500">Front</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-4xl font-black text-slate-950">{word.spanish}</h2>
                      <PronunciationTools text={word.spanish} />
                    </div>
                    {flipped && (
                      <div className="mt-6 grid gap-4 rounded-lg border border-lagoon-200 bg-white p-4 sm:grid-cols-[150px_1fr] sm:items-center">
                        <AssetImage imageKey={word.imageKey || selectedGroup?.imageKey} alt={word.spanish} className="aspect-square w-full" />
                        <div>
                          <p className="text-sm font-black text-lagoon-700">Meaning</p>
                          <p className="mt-1 text-2xl font-black text-lagoon-900">{word.english}</p>
                          <p className="mt-2 text-sm font-bold text-slate-600">
                            {word.partOfSpeech}
                            {word.gender ? ` · ${word.gender}` : ""}
                          </p>
                          {word.example && <p className="mt-3 font-bold text-slate-700">{word.example}</p>}
                        </div>
                      </div>
                    )}
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      {!flipped ? (
                        <button onClick={() => setFlipped(true)} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600">
                          Flip Card
                        </button>
                      ) : (
                        <>
                          <button
                            disabled={Boolean(feedback)}
                            onClick={() => submitWord("", "flashcard", "again")}
                            className="rounded-md bg-red-600 px-4 py-3 font-black text-white hover:bg-red-700 disabled:cursor-default disabled:opacity-60"
                          >
                            Again
                          </button>
                          <button
                            disabled={Boolean(feedback)}
                            onClick={() => submitWord(word.english, "flashcard", "hard")}
                            className="rounded-md bg-honey-500 px-4 py-3 font-black text-white hover:bg-honey-600 disabled:cursor-default disabled:opacity-60"
                          >
                            Hard
                          </button>
                          <button
                            disabled={Boolean(feedback)}
                            onClick={() => submitWord(word.english, "flashcard", "good")}
                            className="rounded-md bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700 disabled:cursor-default disabled:opacity-60"
                          >
                            Good
                          </button>
                          <button
                            disabled={Boolean(feedback)}
                            onClick={() => submitWord(word.english, "flashcard", "easy")}
                            className="rounded-md bg-lagoon-600 px-4 py-3 font-black text-white hover:bg-lagoon-700 disabled:cursor-default disabled:opacity-60"
                          >
                            Easy
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}

                {activeMode === "recognition" && (
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
                            feedback && choice === expectedChoice && "border-emerald-400 bg-emerald-50 text-emerald-900",
                            feedback && feedback.correct === false && choice === feedback.expected && "border-emerald-400 bg-emerald-50"
                          )}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {activeMode === "picture" && (
                  <>
                    <p className="text-sm font-black uppercase tracking-wide text-slate-500">Choose the Spanish</p>
                    <h2 className="mt-3 text-3xl font-black text-slate-950">What is this?</h2>
                    <div className="mt-3">
                      <PronunciationTools text={word.spanish} />
                    </div>
                    <div className="mt-6 grid gap-3">
                      {choices.map((choice) => (
                        <button
                          key={choice}
                          disabled={Boolean(feedback)}
                          onClick={() => submitWord(choice, "picture")}
                          className={classNames(
                            "rounded-md border bg-white px-4 py-3 text-left font-bold hover:bg-stone-50 disabled:cursor-default",
                            feedback && choice === expectedChoice && "border-emerald-400 bg-emerald-50 text-emerald-900",
                            feedback && feedback.correct === false && choice === feedback.expected && "border-emerald-400 bg-emerald-50"
                          )}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {activeMode === "typing" && (
                  <>
                    <p className="text-sm font-black uppercase tracking-wide text-slate-500">Type the Spanish</p>
                    <h2 className="mt-3 text-4xl font-black text-slate-950">{word.english}</h2>
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
                    <p className="mt-1 text-sm text-slate-700">
                      Expected: <span className="font-black">{feedback.expected}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{feedback.review.message}</p>
                    <div className="mt-4 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
                      {nextLabel} loading...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Panel>
      </section>

      <section className="order-2 space-y-5 xl:order-1">
        <Panel title="Vocabulary Decks" icon={NotebookTabs}>
          <div className="grid gap-3">
            {data.groups.map((group) => {
              const learned = group.learned ?? group.mastered ?? 0;
              return (
                <button
                  key={group.id}
                  onClick={() => {
                    beginSession("learn", group.id);
                  }}
                  className={classNames(
                    "grid grid-cols-[54px_1fr_auto] items-center gap-3 rounded-lg border p-3 text-left",
                    selectedGroupId === group.id ? "border-lagoon-500 bg-lagoon-50" : "border-stone-200 bg-white hover:bg-stone-50"
                  )}
                >
                  <AssetImage imageKey={group.imageKey} alt={group.title} className="h-12 w-12" />
                  <div className="min-w-0">
                    <p className="truncate font-black">{group.title}</p>
                    <p className="truncate text-xs text-slate-500">
                      {group.new ?? 0} new · {group.reviewDue ?? group.due} review
                    </p>
                    <ProgressBar value={group.total ? (learned / group.total) * 100 : 0} className="mt-2" />
                  </div>
                  <span className="text-sm font-black text-lagoon-700">{learned}/{group.total}</span>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="Word Stats" icon={BarChart3}>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile label="Total" value={data.stats.total} />
            <InfoTile label="New" value={data.stats.new ?? 0} />
            <InfoTile label="Review" value={data.stats.reviewDue ?? data.stats.due} />
            <InfoTile label="Learned" value={data.stats.learned ?? 0} />
            <InfoTile label="Memory" value={memoryCount} />
            <InfoTile label="Mastered" value={data.stats.mastered} />
          </div>
        </Panel>
      </section>
    </div>
  );
}

function PronunciationLookupView() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const [savedWords, setSavedWords] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [deletingWordId, setDeletingWordId] = useState("");
  const [bestAudioState, setBestAudioState] = useState("idle");
  const [sourceAudioStates, setSourceAudioStates] = useState({});
  const searchText = query.trim();
  const sources = result?.sources || [];
  const meanings = result?.meanings || [];
  const playableCount = sources.filter((source) => source.playable).length;
  const links = result?.links || (searchText ? dictionaryLinks(searchText) : null);

  const providerLabel = (provider) => {
    if (provider === "spanishdict") return "SpanishDict";
    if (provider === "leo") return "LEO";
    return provider || "Provider";
  };

  const audioLabel = (state, idleLabel = "Play") => {
    if (state === "loading") return "Loading";
    if (state === "playing") return "Playing";
    if (state === "error") return "Retry";
    return idleLabel;
  };

  const setSourceAudioState = (key) => (state) => {
    setSourceAudioStates((current) => ({ ...current, [key]: state }));
  };

  const loadRecentSaved = async () => {
    setRecentLoading(true);
    try {
      const data = await api("/api/pronunciation/vocabulary/recent");
      setSavedWords(data.words || []);
    } finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    loadRecentSaved();
  }, []);

  const deleteSavedWord = async (wordId) => {
    setDeletingWordId(wordId);
    setSaveError("");
    try {
      await api(`/api/pronunciation/vocabulary/${wordId}`, { method: "DELETE" });
      setSavedWords((current) => current.filter((word) => word.id !== wordId));
      setSaveStatus("Removed from Audio Lab vocabulary.");
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setDeletingWordId("");
    }
  };

  const lookup = async (event) => {
    event.preventDefault();
    if (!searchText) return;

    setLoading(true);
    setError("");
    setSaveStatus("");
    setSaveError("");
    setResult(null);
    setBestAudioState("idle");
    setSourceAudioStates({});

    try {
      const params = new URLSearchParams({ text: searchText, verify: "1" });
      const pronunciation = await api(`/api/pronunciation?${params.toString()}`);
      let saved = null;
      try {
        saved = await api("/api/pronunciation/vocabulary", {
          method: "POST",
          body: {
            text: pronunciation.text,
            english: pronunciation.bestMeaning || pronunciation.meanings?.[0]?.text || ""
          }
        });
        setSaveStatus(saved.created ? "Added to vocabulary review." : "Vocabulary item updated.");
        await loadRecentSaved();
      } catch (saveErr) {
        setSaveError(saveErr.message);
      }
      setResult({ ...pronunciation, savedWord: saved?.word || null, savedGroup: saved?.group || null });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-5">
        <Panel title="Audio Lookup" icon={Volume2}>
          <form onSubmit={lookup} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="block text-sm font-semibold text-slate-700">
              Word
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="mt-2 w-full rounded-md border border-stone-200 bg-white px-4 py-4 text-xl font-black text-slate-950 outline-none focus:border-lagoon-500"
                placeholder="Spanish word or phrase"
              />
            </label>
            <button
              type="submit"
              disabled={!searchText || loading}
              className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Search size={18} />
              {loading ? "Searching" : "Find Audio"}
            </button>
          </form>

          {error && <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-700">{error}</div>}

          {loading && (
            <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-5 font-bold text-slate-600">
              Searching SpanishDict and LEO...
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-lagoon-100 bg-lagoon-50 p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">Search</p>
                  <h2 className="mt-1 text-3xl font-black text-slate-950">{result.text}</h2>
                  <p className="mt-1 text-sm font-bold text-slate-600">
                    {sources.length} match{sources.length === 1 ? "" : "es"} · {playableCount} playable
                  </p>
                  {meanings.length > 0 && (
                    <p className="mt-3 text-xl font-black text-lagoon-950">
                      {result.bestMeaning || meanings[0].text}
                    </p>
                  )}
                  {saveStatus && <p className="mt-2 text-sm font-bold text-emerald-700">{saveStatus}</p>}
                  {saveError && <p className="mt-2 text-sm font-bold text-red-700">{saveError}</p>}
                </div>
                <button
                  type="button"
                  disabled={!sources.length}
                  onClick={() => playPronunciationClip(result.text, setBestAudioState)}
                  className={classNames(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 font-black",
                    bestAudioState === "playing"
                      ? "border-lagoon-300 bg-white text-lagoon-800"
                      : "border-stone-200 bg-white text-slate-800 hover:bg-stone-50",
                    bestAudioState === "error" && "border-red-200 bg-red-50 text-red-700",
                    !sources.length && "cursor-not-allowed opacity-50"
                  )}
                >
                  <Volume2 size={18} />
                  {audioLabel(bestAudioState, "Best Match")}
                </button>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Meaning</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-950">
                      {result.bestMeaning || meanings[0]?.text || "Meaning not found yet"}
                    </h3>
                    {result.savedWord && (
                      <p className="mt-2 text-sm font-bold text-slate-600">
                        Saved in {result.savedGroup?.title || "Audio Lab Saved"} for review and memory practice.
                      </p>
                    )}
                  </div>
                  {result.savedWord && (
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(result.savedWord.spanish).catch(() => null)}
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-black text-slate-700 hover:bg-stone-50"
                    >
                      <Copy size={15} /> Copy
                    </button>
                  )}
                </div>
                {meanings.length > 1 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {meanings.slice(1, 5).map((meaning) => (
                      <span key={`${meaning.source}-${meaning.text}`} className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-slate-700">
                        {meaning.text}
                      </span>
                    ))}
                  </div>
                )}
                {!!result.wordByWord?.length && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {result.wordByWord.slice(0, 6).map((item) => (
                      <div key={`${item.query}-${item.meaning}`} className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm">
                        <span className="font-black text-slate-950">{item.query}</span>
                        <span className="font-semibold text-slate-600"> = {item.meaning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {sources.length ? (
                <div className="grid gap-3">
                  {sources.map((source, index) => {
                    const key = `${source.provider}-${source.sourceText || result.text}-${index}`;
                    const state = sourceAudioStates[key] || "idle";
                    const providerLink = source.provider === "leo" ? result.links.leo : result.links.spanishDict;
                    return (
                      <div
                        key={key}
                        className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                              {providerLabel(source.provider)}
                            </span>
                            <span
                              className={classNames(
                                "rounded-full px-3 py-1 text-xs font-black",
                                source.playable
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-stone-100 text-slate-600"
                              )}
                            >
                              {source.playable ? "Playable" : "Not confirmed"}
                            </span>
                          </div>
                          <p className="mt-2 truncate text-lg font-black text-slate-950">{source.sourceText || result.text}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              playPronunciationClip(result.text, setSourceAudioState(key), source.provider, source.sourceText)
                            }
                            className={classNames(
                              "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-4 font-black text-slate-700 hover:bg-stone-50",
                              state === "playing" && "border-lagoon-300 bg-lagoon-50 text-lagoon-800",
                              state === "error" && "border-red-200 bg-red-50 text-red-700"
                            )}
                          >
                            <Volume2 size={17} />
                            {audioLabel(state)}
                          </button>
                          <a
                            href={providerLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-4 font-black text-slate-700 hover:bg-stone-50"
                          >
                            <ExternalLink size={16} />
                            Open
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-honey-200 bg-honey-50 p-5">
                  <p className="font-black text-honey-900">No matching clip found</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">Dictionary entries are available for manual review.</p>
                </div>
              )}
            </div>
          )}
        </Panel>
      </section>

      <aside className="space-y-5">
        <Panel title="Resolver" icon={ListChecks}>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile label="Sources" value={result ? sources.length : 0} />
            <InfoTile label="Playable" value={result ? playableCount : 0} />
          </div>
          <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Provider Order</p>
            <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700">
              <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
                <span>1</span>
                <span>SpanishDict</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
                <span>2</span>
                <span>LEO</span>
              </div>
            </div>
          </div>
          {links && (
            <div className="mt-5 grid gap-2">
              <a
                href={links.spanishDict}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-3 font-black text-slate-700 hover:bg-stone-50"
              >
                SpanishDict
                <ExternalLink size={16} />
              </a>
              <a
                href={links.leo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-3 font-black text-slate-700 hover:bg-stone-50"
              >
                LEO
                <ExternalLink size={16} />
              </a>
            </div>
          )}
        </Panel>
        <Panel title="Recently Saved" icon={NotebookTabs}>
          {recentLoading ? (
            <p className="text-sm font-semibold text-slate-600">Loading saved words...</p>
          ) : savedWords.length ? (
            <div className="grid gap-3">
              {savedWords.map((word) => (
                <div key={word.id} className="rounded-lg border border-stone-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950">{word.spanish}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{word.english}</p>
                      <p className="mt-1 text-xs font-bold text-lagoon-700">
                        {word.review?.due ? "Due now" : word.review?.state || "Saved"}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={deletingWordId === word.id}
                      onClick={() => deleteSavedWord(word.id)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-red-100 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                      title={`Remove ${word.spanish}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-600">Saved Audio Lab words will appear here.</p>
          )}
        </Panel>
      </aside>
    </div>
  );
}

function DashboardView({ dashboard, setActive, onStartLesson }) {
  const plan = dashboard.dailyPlan || {};
  const review = dashboard.review || { counts: {}, weakSpots: [], estimatedMinutes: 0 };
  const lessons = dashboard.lessons || [];
  const completedLessons = lessons.filter((lesson) => lesson.progress >= 100).length;
  const inProgressLesson = lessons.find((lesson) => lesson.progress > 0 && lesson.progress < 100);
  const nextLesson = inProgressLesson || dashboard.currentLesson || lessons.find((lesson) => lesson.progress < 100) || lessons[0];
  const courseProgress = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0;
  const reviewTotal = review.counts?.total || 0;
  const wordDue = dashboard.stats.wordReviewCount || review.counts?.vocabulary || 0;
  const challenge = dashboard.challenge;
  const primaryTitle = plan.title || nextLesson?.title || "Start Spanish";

  const startPrimary = () => {
    if (plan.target?.type === "lesson" && plan.target.id) {
      onStartLesson(plan.target.id);
      return;
    }
    if (plan.target?.type === "review") {
      setActive("review");
      return;
    }
    setActive("challenges");
  };

  const flowSteps = [
    {
      key: "course",
      icon: BookOpen,
      title: "Course",
      detail: nextLesson?.title || "Begin the A1 path",
      meta: `${completedLessons}/${lessons.length || 0} lessons complete`,
      state: plan.target?.type === "lesson" ? "Next" : courseProgress >= 100 ? "Complete" : "Ready",
      action: plan.target?.type === "lesson" ? plan.cta || "Start" : nextLesson?.progress ? "Continue" : "Open",
      onClick: () => (plan.target?.type === "lesson" && plan.target.id ? onStartLesson(plan.target.id) : setActive("path"))
    },
    {
      key: "review",
      icon: ListChecks,
      title: "Review",
      detail: reviewTotal ? "Due grammar, words, and mistakes" : "No due review right now",
      meta: `${reviewTotal} due · ${review.estimatedMinutes || 0} min`,
      state: reviewTotal ? "Due" : "Clear",
      action: "Review",
      onClick: () => setActive("review")
    },
    {
      key: "words",
      icon: NotebookTabs,
      title: "Words",
      detail: wordDue ? "Memory words are ready" : "Build vocabulary memory",
      meta: `${dashboard.stats.masteredWords || 0}/${dashboard.stats.totalWords || 0} mastered`,
      state: wordDue ? "Due" : "Practice",
      action: "Practice",
      onClick: () => setActive("words")
    },
    {
      key: "play",
      icon: Gamepad2,
      title: "Play",
      detail: challenge?.title || "Mini games and short challenges",
      meta: challenge ? `${challenge.progress}/${challenge.targetCount} challenge` : "Games available",
      state: challenge?.isCompleted ? "Done" : "Optional",
      action: challenge ? "Challenge" : "Games",
      onClick: () => setActive(challenge ? "challenges" : "play")
    }
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <section className="rounded-lg border border-slate-900 bg-slate-950 p-5 text-white shadow-soft sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-black text-lagoon-100">
                <Target size={16} /> Today
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">{primaryTitle}</h1>
              <p className="mt-3 max-w-2xl text-base font-semibold text-slate-300">
                {plan.reason || "Start with the strongest next action, then keep the rest in one clean queue."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm font-black">
                <span className="rounded-full bg-white/10 px-3 py-1">{plan.estimatedMinutes || nextLesson?.estimatedMinutes || 8} min focus</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{reviewTotal} review due</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{courseProgress}% course</span>
              </div>
            </div>
            <button
              onClick={startPrimary}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-honey-500 px-5 py-4 font-black text-white hover:bg-honey-600"
            >
              <Rocket size={19} /> {plan.cta || "Start"}
            </button>
          </div>
        </section>

        <Panel title="Today's Flow" icon={Rocket}>
          <div className="grid gap-3 lg:grid-cols-4">
            {flowSteps.map((step, index) => (
              <button
                key={step.key}
                onClick={step.onClick}
                className="flex min-h-48 flex-col rounded-lg border border-stone-200 bg-stone-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-lagoon-300 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-md bg-white text-lagoon-600 shadow-sm">
                    <step.icon size={21} />
                  </div>
                  <span className="rounded-full bg-slate-950 px-2 py-1 text-xs font-black text-white">{index + 1}</span>
                </div>
                <div className="mt-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-950">{step.title}</h3>
                    <span className="rounded-full bg-white px-2 py-1 text-[11px] font-black uppercase text-lagoon-700">{step.state}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{step.detail}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-500">{step.meta}</p>
                </div>
                <span className="mt-4 font-black text-lagoon-700">{step.action}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Weak Spots" icon={PenTool} action={<button onClick={() => setActive("review")} className="text-sm font-black text-lagoon-700">Review</button>}>
          {review.weakSpots?.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {review.weakSpots.slice(0, 4).map((spot) => (
                <div key={spot.key} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">{spot.title}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{spot.categoryLabel}</p>
                    </div>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">{spot.count}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{spot.feedbackMessage}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-600">No recurring weak spots.</p>
          )}
        </Panel>
      </section>

      <aside className="space-y-5">
        <Panel title="Snapshot" icon={BarChart3}>
          <div className="grid gap-3">
            <InfoTile label="Course" value={`${courseProgress}%`} />
            <InfoTile label="Review due" value={reviewTotal} />
            <InfoTile label="Mastered words" value={dashboard.stats.masteredWords || 0} />
            <InfoTile label="Streak" value={dashboard.stats.streakDays} />
          </div>
        </Panel>
        <Panel title="Latest Ability" icon={Trophy}>
          <div className="flex gap-4">
            <AssetImage imageKey="rewards-and-progress:15" alt="Recent achievement" className="h-20 w-20 shrink-0" />
            <div>
              <p className="font-black text-slate-950">{dashboard.recentAchievement || "Complete a lesson to unlock your first practical ability."}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">Abilities come from finished lessons, not isolated drills.</p>
            </div>
          </div>
        </Panel>
        {challenge && <WeeklyChallengeCard challenge={challenge} onOpen={() => setActive("challenges")} />}
      </aside>
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
        onClick={() => setActive("path")}
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
  autoAdvanceDelay = 900,
  autoAdvanceOnWrong = true,
  showInlineFeedback = true,
  autoSubmitChoices = true
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

  const randomizedOptions = useMemo(() => {
    if (!exercise?.options?.length) return [];
    return exercise.type === "SENTENCE_BUILDER"
      ? shuffleAwayFromOriginalOrder(exercise.options)
      : shuffleItems(exercise.options);
  }, [exercise?.id]);
  const exerciseForDisplay = exercise ? { ...exercise, options: randomizedOptions } : null;

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
  const canSubmit = selectedValue.trim().length > 0 && !locked && !busy;
  const acceptedValues = feedback?.accepted?.map(normalizeText) || [];
  const autoAdvancingFeedback =
    locked && autoAdvance && !feedback?.submissionError && (feedback.correct || autoAdvanceOnWrong);

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

  const submit = async (answerOverride = null, wordsOverride = null) => {
    const submittedAnswer = answerOverride ?? answer;
    const submittedWords = wordsOverride ?? words;
    const submittedValue = isSentenceBuilder ? submittedWords.join(" ") : submittedAnswer;
    if (!submittedValue.trim() || locked || busy) return;
    setBusy(true);
    try {
      const result = await api(`/api/exercises/${exercise.id}/attempt`, {
        method: "POST",
        body: {
          source,
          answer: submittedAnswer,
          words: submittedWords
        }
      });
      const resultWithAnswer = { ...result, submitted: submittedValue };
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

      if (autoAdvance && (result.correct || autoAdvanceOnWrong)) {
        window.setTimeout(() => {
          continueAfterFeedback();
        }, autoAdvanceDelay);
      }
    } catch (err) {
      const errorResult = {
        correct: false,
        submissionError: true,
        explanation: err.message,
        submitted: submittedValue,
        expected: ""
      };
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
              <SentenceBuilder
                exercise={exerciseForDisplay}
                words={words}
                setWords={setWords}
                disabled={locked || busy}
                onAutoComplete={autoSubmitChoices ? (nextWords) => submit("", nextWords) : null}
              />
            ) : (
              <AnswerChoices
                exercise={exerciseForDisplay}
                answer={answer}
                setAnswer={setAnswer}
                disabled={locked || busy}
                feedback={feedback}
                acceptedValues={acceptedValues}
                onAutoSelect={autoSubmitChoices ? (value) => submit(value, words) : null}
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

      {feedback && showInlineFeedback && (
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
              onClick={() => submit()}
              className="ml-auto rounded-md bg-lagoon-500 px-5 py-2 font-bold text-white hover:bg-lagoon-600 disabled:opacity-50"
            >
              {busy ? "Checking..." : "Check Answer"}
            </button>
          </>
        )}
        {locked && !autoAdvancingFeedback && (
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
            {!feedback.correct && !feedback.submissionError && (
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
        {autoAdvancingFeedback && (
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

function QuizResultBanner({ result, className = "" }) {
  if (!result) return null;
  const isSubmissionError = Boolean(result.submissionError);
  return (
    <div
      className={classNames(
        "sticky top-24 z-20 rounded-lg border p-3 shadow-soft",
        result.correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={classNames(
            "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-white",
            result.correct ? "bg-emerald-600" : "bg-red-600"
          )}
        >
          {result.correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </div>
        <div className="min-w-0">
          <p className="font-black">
            {isSubmissionError ? "Could not check answer" : result.correct ? `Correct +${result.xpAwarded || 0} XP` : "Not correct"}
          </p>
          {isSubmissionError ? (
            <p className="mt-1 text-sm">{result.explanation || "Try again."}</p>
          ) : (
            <p className="mt-1 text-sm">
              Correct answer: <span className="font-black">{result.expected || "—"}</span>
            </p>
          )}
          {result.submitted && (
            <p className="mt-1 text-xs font-bold opacity-80">
              Your answer: <span className="font-black">{result.submitted}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ExerciseQueue({
  title,
  exercises = [],
  source = "LESSON",
  refreshDashboard,
  emptyMessage = "No practice questions are available yet.",
  completeTitle = "Practice complete",
  completeImageKey = "rewards-and-progress:15"
}) {
  const usableExercises = exercises.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    setIndex(0);
    setResults([]);
    setLastResult(null);
  }, [usableExercises.map((exercise) => exercise.id).join("|"), source]);

  if (!usableExercises.length) {
    return (
      <Panel title={title} icon={Sparkles}>
        <p className="text-sm font-semibold text-slate-600">{emptyMessage}</p>
      </Panel>
    );
  }

  const finished = index >= usableExercises.length;
  const correct = results.filter(Boolean).length;
  const progress = Math.round((Math.min(index, usableExercises.length) / usableExercises.length) * 100);

  if (finished) {
    return (
      <div className="space-y-4">
        <QuizResultBanner result={lastResult} />
        <Panel title={completeTitle} icon={Trophy}>
          <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
            <AssetImage imageKey={completeImageKey} alt={completeTitle} className="h-28 w-28" />
            <div>
              <h2 className="text-3xl font-black text-slate-950">{correct}/{usableExercises.length} correct</h2>
              <ProgressBar value={usableExercises.length ? (correct / usableExercises.length) * 100 : 0} className="mt-4" />
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  const current = usableExercises[index];

  return (
    <div className="space-y-4">
      <QuizResultBanner result={lastResult} />
      <div className="rounded-lg border border-lagoon-100 bg-lagoon-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-black text-lagoon-900">
          <span>{title}</span>
          <span>{index + 1}/{usableExercises.length}</span>
        </div>
        <ProgressBar value={progress} className="mt-3" />
      </div>
      <PracticePanel
        key={current.id}
        title={`${title} ${index + 1}/${usableExercises.length}`}
        exercise={current}
        source={source}
        autoAdvance
        autoAdvanceOnWrong
        autoAdvanceDelay={1000}
        autoSubmitChoices
        onResult={(result) => {
          setLastResult(result);
          setResults((currentResults) => {
            const next = [...currentResults];
            next[index] = Boolean(result.correct);
            return next;
          });
        }}
        onComplete={async () => {
          setIndex((value) => value + 1);
          await refreshDashboard?.({ silent: true });
        }}
      />
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
            SpanishDict
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
      {!compact && (
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(text).catch(() => null)}
          className={buttonClass}
          title={`Copy ${text}`}
        >
          <Copy size={16} />
          Copy
        </button>
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

function AnswerChoices({ exercise, answer, setAnswer, disabled = false, feedback, acceptedValues = [], onAutoSelect = null }) {
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
            onClick={() => {
              setAnswer(option.value);
              onAutoSelect?.(option.value);
            }}
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

function SentenceBuilder({ exercise, words, setWords, disabled = false, onAutoComplete = null }) {
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
            onClick={() => {
              const nextWords = [...words, option.value];
              setWords(nextWords);
              if (nextWords.length === exercise.options.length) {
                onAutoComplete?.(nextWords);
              }
            }}
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
              <AssetImage imageKey={miniGameImageKeys[game.key] || "minigame-ui-rewards:9"} alt={game.title} className="h-14 w-14 shrink-0 rounded-full" />
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

            <Panel title="Lesson Guide" icon={ListChecks}>
              <div className="grid gap-3 md:grid-cols-2">
                {lessonGuideSteps(lesson).map((step, index) => (
                  <div key={`${lesson.id}-guide-${index}`} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">Step {index + 1}</p>
                    <p className="mt-2 font-bold text-slate-800">{step}</p>
                  </div>
                ))}
              </div>
              {lesson.reviewSummary && (
                <div className="mt-4 rounded-lg border border-lagoon-100 bg-lagoon-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">What should stick</p>
                  <p className="mt-2 font-bold text-lagoon-950">{lesson.reviewSummary}</p>
                </div>
              )}
            </Panel>

            <Panel title="Examples" icon={NotebookTabs}>
              <div className="grid gap-3">
                {lesson.sentences.map((sentence) => (
                  <div key={sentence.id} className="rounded-lg border border-stone-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold">{sentence.spanish}</p>
                      <PronunciationTools text={sentence.spanish} compact />
                    </div>
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

            <ExerciseQueue
              key={lesson.id}
              title="Lesson Practice"
              exercises={lesson.exercises}
              source="LESSON"
              refreshDashboard={refreshDashboard}
              completeTitle="Lesson practice complete"
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
      <Panel title="Grammar Map" icon={GraduationCap}>
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoTile label="Topics" value={grouped.length} />
          <InfoTile label="Lessons" value={lessons.length} />
          <InfoTile label="Average" value={`${lessons.length ? Math.round(lessons.reduce((sum, lesson) => sum + lesson.progress, 0) / lessons.length) : 0}%`} />
        </div>
      </Panel>
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
  const [gameExercises, setGameExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const startGame = async (game) => {
    setActiveGame(game);
    if (game.key === "word-catcher") return;
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
      setGameExercises(shuffleItems(exercises.filter((item) => item.type === preferredType)));
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
            <AssetImage imageKey={miniGameImageKeys[game.key] || "minigame-ui-rewards:9"} alt={game.title} className="mb-4 h-12 w-12 rounded-full" />
            <h3 className="font-extrabold">{game.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{game.description}</p>
            <p className="mt-4 text-sm font-bold text-honey-600">Start round</p>
          </button>
        ))}
      </div>

      {activeGame?.key === "word-catcher" ? (
        <WordCatcherGame game={activeGame} refreshDashboard={refreshDashboard} />
      ) : activeGame && (
        <PracticeMiniGameRound
          game={activeGame}
          exercises={gameExercises}
          loading={loading}
          refreshDashboard={refreshDashboard}
        />
      )}
    </div>
  );
}

function PracticeMiniGameRound({ game, exercises, loading, refreshDashboard }) {
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeLimit, setTimeLimit] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5);
  const [roundResolving, setRoundResolving] = useState(false);
  const latestResultsRef = useRef([]);

  useEffect(() => {
    setIndex(0);
    setDeck(shuffleItems(exercises));
    setResults([]);
    latestResultsRef.current = [];
    setLastAnswer(null);
    setFinished(false);
  }, [game?.key, exercises.map((exercise) => exercise.id).join("|")]);

  const current = deck.length ? deck[index % deck.length] : null;
  const total = deck.length;
  const correct = results.filter(Boolean).length;
  const deckPosition = total ? (index % total) + 1 : 0;
  const progress = total ? Math.round((deckPosition / total) * 100) : 0;
  const score = correct * 250 + results.length * 25;
  const timing = miniGameTiming(game.key, index);

  const finishRound = async (finalResults = results) => {
    setFinished(true);
    setSaving(true);
    const finalCorrect = finalResults.filter(Boolean).length;
    try {
      await api(`/api/minigames/${game.key}/score`, {
        method: "POST",
        body: { score: finalCorrect * 250 + finalResults.length * 25 }
      });
      await refreshDashboard?.({ silent: true });
    } finally {
      setSaving(false);
    }
  };

  const advance = async (finalResults = latestResultsRef.current) => {
    setIndex((currentIndex) => currentIndex + 1);
    if (total && (index + 1) % total === 0) {
      setDeck((currentDeck) => shuffleItems(currentDeck));
    }
  };

  const recordResult = (result) => {
    setRoundResolving(true);
    const nextResults = [...latestResultsRef.current, Boolean(result.correct)];
    latestResultsRef.current = nextResults;
    setResults(nextResults);
    setLastAnswer(result);
    return nextResults;
  };

  useEffect(() => {
    if (!current || finished) return;
    const nextLimit = miniGameTiming(game.key, index).limit;
    setTimeLimit(nextLimit);
    setTimeLeft(nextLimit);
    setRoundResolving(false);
  }, [current?.id, game.key, index, finished]);

  useEffect(() => {
    if (!current || finished || loading || roundResolving) return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 0.1));
    }, 100);

    const timeout = window.setTimeout(async () => {
      window.clearInterval(timer);
      setRoundResolving(true);
      const result = await api(`/api/exercises/${current.id}/attempt`, {
        method: "POST",
        body: {
          source: "GAME",
          answer: "",
          words: []
        }
      });
      const nextResults = recordResult({
        ...result,
        correct: false,
        submitted: "Timed out",
        explanation: `Time ran out. ${result.explanation || "Keep going."}`
      });
      window.setTimeout(() => {
        advance(nextResults);
      }, 850);
    }, timing.limit * 1000);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(timeout);
    };
  }, [current?.id, index, finished, loading, roundResolving, timing.limit]);

  if (loading) {
    return <Panel title={game.title} icon={Gamepad2}>Loading mini-game questions...</Panel>;
  }

  if (!total) {
    return (
      <Panel title={game.title} icon={Gamepad2}>
        <p className="text-sm font-semibold text-slate-600">No matching exercises are available yet.</p>
      </Panel>
    );
  }

  if (finished) {
    const percent = results.length ? Math.round((correct / results.length) * 100) : 0;
    return (
      <Panel title={`${game.title} Complete`} icon={Trophy}>
        <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
          <AssetImage imageKey="minigame-ui-rewards:8" alt="Complete" className="h-28 w-28" />
          <div>
            <h2 className="text-3xl font-black text-slate-950">{correct}/{results.length} correct</h2>
            <p className="mt-2 font-semibold text-slate-600">{saving ? "Saving score..." : "Score saved."}</p>
            <ProgressBar value={percent} className="mt-4" color={percent >= 80 ? "bg-emerald-500" : "bg-honey-500"} />
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <section className="space-y-5">
      <Panel title={game.title} icon={Gamepad2}>
        <div className="grid gap-3 sm:grid-cols-5">
          <InfoTile label="Round" value={index + 1} />
          <InfoTile label="Deck" value={`${deckPosition}/${total}`} />
          <InfoTile label="Correct" value={correct} />
          <InfoTile label="Time" value={`${Math.ceil(timeLeft)}s`} />
          <InfoTile label="High Score" value={game.highScore || 0} />
        </div>
        <ProgressBar value={progress} className="mt-4" />
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-wide text-slate-500">
            <span>Timer</span>
            <span>
              {Math.ceil(timeLeft)}s / {timeLimit}s
            </span>
          </div>
          <ProgressBar
            value={timeLimit ? (timeLeft / timeLimit) * 100 : 0}
            color={timeLeft <= 2 ? "bg-red-500" : timeLeft <= 4 ? "bg-honey-500" : "bg-emerald-500"}
          />
          <p className="mt-2 text-xs font-bold text-slate-500">
            Endless mode: no repeats until the current deck cycles. Starts at {timing.start}s and shrinks toward {timing.min}s.
          </p>
        </div>
        <button
          onClick={() => finishRound(latestResultsRef.current)}
          className="mt-4 rounded-md border border-stone-200 bg-white px-4 py-2 font-black text-slate-700 hover:bg-stone-50"
        >
          End Round
        </button>
      </Panel>

      {lastAnswer && (
        <div
          className={classNames(
            "rounded-lg border p-4",
            lastAnswer.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={classNames("text-xs font-black uppercase tracking-wide", lastAnswer.correct ? "text-emerald-700" : "text-red-700")}>
                Previous answer
              </p>
              <p className="mt-1 font-black text-slate-950">{lastAnswer.correct ? "Correct" : "Wrong"}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                You answered: {lastAnswer.submitted || "-"} · Correct: {lastAnswer.expected || "-"}
              </p>
            </div>
            <span className={classNames("rounded-full px-3 py-1 text-sm font-black", lastAnswer.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}>
              {lastAnswer.correct ? `+${lastAnswer.xpAwarded || 0} XP` : "Keep going"}
            </span>
          </div>
        </div>
      )}

      <PracticePanel
        key={current.id}
        title={`${game.title} Round`}
        exercise={current}
        source="GAME"
        autoAdvance
        autoAdvanceOnWrong
        autoAdvanceDelay={850}
        autoSubmitChoices
        showInlineFeedback={false}
        onResult={(result) => {
          recordResult(result);
        }}
        onComplete={() => advance(latestResultsRef.current)}
      />
    </section>
  );
}

function miniGameTiming(gameKey, index) {
  const configs = {
    "article-match": { start: 5, min: 1, step: 0.45 },
    "conjugation-sprint": { start: 7, min: 2, step: 0.55 },
    "sentence-builder": { start: 10, min: 3, step: 0.75 }
  };
  const config = configs[gameKey] || { start: 6, min: 1, step: 0.5 };
  return {
    ...config,
    limit: Math.max(config.min, Math.round((config.start - index * config.step) * 10) / 10)
  };
}

function WordCatcherGame({ game, refreshDashboard }) {
  const [words, setWords] = useState([]);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickRound = (sourceWords = words, nextRound = round) => {
    const usable = sourceWords.filter((word) => word.spanish && word.english);
    if (usable.length < 4) return;
    const nextTarget = usable[Math.floor(Math.random() * usable.length)];
    const distractors = shuffleItems(usable.filter((word) => word.id !== nextTarget.id)).slice(0, 3);
    setTarget(nextTarget);
    setChoices(shuffleItems([nextTarget, ...distractors]));
    setTimeLeft(10);
    setResolving(false);
    setMessage(`Round ${nextRound + 1}: catch the meaning.`);
  };

  const finishGame = async (finalScore = score) => {
    setFinished(true);
    setSaving(true);
    try {
      await api(`/api/minigames/${game.key}/score`, {
        method: "POST",
        body: { score: finalScore }
      });
      await refreshDashboard?.({ silent: true });
    } finally {
      setSaving(false);
    }
  };

  const nextRound = (nextScore = score, nextLives = lives) => {
    if (nextRoundNumber(round) >= 10 || nextLives <= 0) {
      finishGame(nextScore);
      return;
    }
    const updatedRound = round + 1;
    setRound(updatedRound);
    pickRound(words, updatedRound);
  };

  const answer = (choice) => {
    if (finished || resolving || !target) return;
    setResolving(true);
    if (choice.id === target.id) {
      const gained = 100 + timeLeft * 10;
      const nextScore = score + gained;
      setScore(nextScore);
      setMessage(`Correct: ${target.spanish} = ${target.english}. +${gained}`);
      window.setTimeout(() => nextRound(nextScore, lives), 650);
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setMessage(`Not that one. ${target.spanish} means ${target.english}.`);
      window.setTimeout(() => nextRound(score, nextLives), 900);
    }
  };

  useEffect(() => {
    api("/api/words").then((data) => {
      const allWords = data.groups.flatMap((group) =>
        group.words.map((word) => ({
          ...word,
          imageKey: word.imageKey || group.imageKey
        }))
      );
      const usable = shuffleItems(allWords).slice(0, 60);
      setWords(usable);
      pickRound(usable, 0);
    });
  }, []);

  useEffect(() => {
    if (finished || resolving || !target) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          const nextLives = lives - 1;
          setLives(nextLives);
          setMessage(`Time. ${target.spanish} means ${target.english}.`);
          window.setTimeout(() => nextRound(score, nextLives), 850);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finished, resolving, target?.id, lives, score, round]);

  const restart = () => {
    setRound(0);
    setScore(0);
    setLives(3);
    setFinished(false);
    setMessage("");
    pickRound(words, 0);
  };

  if (!target) {
    return <Panel title="Word Catch" icon={Gamepad2}>Loading words...</Panel>;
  }

  return (
    <Panel title="Word Catch" icon={Gamepad2}>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="rounded-lg border border-slate-900 bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-wide text-lagoon-100">Catch this word</p>
          <h2 className="mt-3 text-4xl font-black">{target.spanish}</h2>
          <AssetImage imageKey={target.imageKey} alt={target.spanish} className="mt-5 aspect-square w-full" />
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <InfoTile label="Score" value={score} />
            <InfoTile label="Lives" value={lives} />
            <InfoTile label="Time" value={timeLeft} />
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-black text-slate-950">{message || "Catch the correct meaning."}</p>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-lagoon-700">
              {Math.min(round + 1, 10)} / 10
            </span>
          </div>
          <div className="grid min-h-[270px] gap-3 sm:grid-cols-2">
            {choices.map((choice, index) => (
              <button
                key={`${choice.id}-${index}`}
                disabled={finished || saving || resolving}
                onClick={() => answer(choice)}
                className="rounded-lg border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-coral-300 hover:shadow-md disabled:opacity-60"
              >
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Option {index + 1}</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{choice.english}</p>
              </button>
            ))}
          </div>

          {finished && (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xl font-black text-emerald-950">Final score: {score}</p>
              <p className="mt-1 text-sm font-bold text-slate-700">{saving ? "Saving score..." : "Score saved."}</p>
              <button onClick={restart} className="mt-4 rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600">
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

function nextRoundNumber(round) {
  return round + 1;
}

function ChallengesView({ challenge, refreshDashboard }) {
  const exercises = challenge?.exercises?.length ? challenge.exercises : challenge?.exercise ? [challenge.exercise] : [];
  const [localProgress, setLocalProgress] = useState(challenge?.progress || 0);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    setLocalProgress(challenge?.progress || 0);
    setLastResult(null);
  }, [challenge?.id]);

  useEffect(() => {
    if (challenge && challenge.progress > localProgress) {
      setLocalProgress(challenge.progress);
    }
  }, [challenge?.progress, challenge?.id, localProgress]);

  if (!challenge) {
    return <Panel title="Challenges" icon={Trophy}>No active challenge is available.</Panel>;
  }

  const targetCount = challenge.targetCount || exercises.length || 1;
  const isComplete = localProgress >= targetCount || challenge.isCompleted;
  const displayChallenge = { ...challenge, progress: Math.min(localProgress, targetCount), isCompleted: isComplete };
  const current = exercises.length ? exercises[localProgress % exercises.length] : null;

  return (
    <div className="space-y-5">
      <WeeklyChallengeCard challenge={displayChallenge} onOpen={() => null} />
      <QuizResultBanner result={lastResult} />
      {isComplete ? (
        <Panel title="Challenge Complete" icon={Trophy}>
          <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
            <AssetImage imageKey="rewards-and-progress:3" alt="Challenge complete" className="h-28 w-28" />
            <div>
              <h2 className="text-3xl font-black text-slate-950">Challenge complete</h2>
              <p className="mt-2 font-semibold text-slate-600">Your weekly challenge progress is saved.</p>
            </div>
          </div>
        </Panel>
      ) : current ? (
        <PracticePanel
          key={`${current.id}-${localProgress}`}
          title={`Challenge Round ${localProgress + 1}/${targetCount}`}
          exercise={current}
          source="CHALLENGE"
          autoAdvance
          autoAdvanceOnWrong
          autoAdvanceDelay={1000}
          autoSubmitChoices
          onResult={setLastResult}
          onComplete={async () => {
            setLocalProgress((value) => Math.min(targetCount, value + 1));
            await refreshDashboard?.({ silent: true });
          }}
        />
      ) : (
        <Panel title="Challenges" icon={Trophy}>No challenge questions are available yet.</Panel>
      )}
    </div>
  );
}

function ReviewQueueView({ refreshDashboard }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionItems, setSessionItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const loadReview = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await api("/api/review/due");
      setReview(data);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadReview();
  }, []);

  if (loading || !review) return <Panel title="Review">Loading your review queue...</Panel>;

  const reviewItems = review.items || [];
  const inSession = sessionItems.length > 0 && !finished;
  const currentItem = inSession ? sessionItems[index] : null;
  const attempted = results.filter((result) => result !== undefined).length;
  const correct = results.filter(Boolean).length;
  const progress = sessionItems.length ? Math.round((attempted / sessionItems.length) * 100) : 0;

  const startReview = () => {
    setSessionItems(shuffleItems(reviewItems));
    setIndex(0);
    setResults([]);
    setLastResult(null);
    setFinished(false);
  };

  const recordResult = (result) => {
    setLastResult(result);
    if (result.submissionError) return;
    setResults((currentResults) => {
      const next = [...currentResults];
      next[index] = Boolean(result.correct);
      return next;
    });
  };

  const advance = async () => {
    if (index + 1 >= sessionItems.length) {
      setFinished(true);
      await loadReview(false);
      await refreshDashboard?.({ silent: true });
      return;
    }
    setIndex((value) => value + 1);
    await refreshDashboard?.({ silent: true });
  };

  if (!inSession && !finished) {
    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <section className="rounded-lg border border-slate-900 bg-slate-950 p-5 text-white shadow-soft sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-black text-lagoon-100">
                  <ListChecks size={16} /> Review
                </p>
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
                  Review
                </h1>
                <p className="mt-3 max-w-2xl text-base font-semibold text-slate-300">
                  Answer due words, grammar, and mistakes one question at a time.
                </p>
              </div>
              <button
                disabled={!reviewItems.length}
                onClick={startReview}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-honey-500 px-5 py-4 font-black text-white hover:bg-honey-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Rocket size={19} /> Start Review
              </button>
            </div>
          </section>

          {reviewItems.length ? (
            <Panel title="What Will Be Tested" icon={Target}>
              <div className="grid gap-3 md:grid-cols-3">
                <InfoTile label="Words" value={review.counts.vocabulary} />
                <InfoTile label="Grammar" value={review.counts.grammar} />
                <InfoTile label="Mistakes" value={review.counts.mistakes} />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600">
                Estimated time: {review.estimatedMinutes} minutes.
              </p>
            </Panel>
          ) : (
            <Panel title="Nothing Due" icon={CheckCircle2}>
              <p className="text-sm font-semibold text-slate-600">
                No review is due right now. Continue the course or words practice to create future review items.
              </p>
            </Panel>
          )}
        </section>

        <aside className="space-y-5">
          <Panel title="Review Rules" icon={Shield}>
            <div className="grid gap-3 text-sm font-bold text-slate-700">
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">Answers stay hidden until you submit.</div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">Wrong answers are shown, then queued again for practice.</div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">Vocabulary uses active recall: type the Spanish.</div>
            </div>
          </Panel>

          {!!review.weakSpots?.length && (
            <Panel title="Weak Areas" icon={PenTool}>
              <div className="grid gap-2">
                {review.weakSpots.slice(0, 4).map((spot) => (
                  <div key={spot.key} className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                    <p className="font-black text-slate-950">{spot.title}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{spot.categoryLabel}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </aside>
      </div>
    );
  }

  if (finished) {
    const score = sessionItems.length ? Math.round((correct / sessionItems.length) * 100) : 0;
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <QuizResultBanner result={lastResult} />
        <Panel title="Review Complete" icon={Trophy}>
          <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
            <AssetImage imageKey="rewards-and-progress:15" alt="Review complete" className="h-28 w-28" />
            <div>
              <h2 className="text-3xl font-black text-slate-950">{correct}/{sessionItems.length} correct</h2>
              <p className="mt-2 font-semibold text-slate-600">Your review schedule has been updated.</p>
              <ProgressBar value={score} className="mt-4" color={score >= 80 ? "bg-emerald-500" : "bg-honey-500"} />
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSessionItems([]);
                    setFinished(false);
                    setLastResult(null);
                  }}
                  className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600"
                >
                  Back to review
                </button>
                {!!review.items?.length && (
                  <button
                    onClick={startReview}
                    className="rounded-md border border-stone-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-stone-50"
                  >
                    Review remaining
                  </button>
                )}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <QuizResultBanner result={lastResult} />
      <Panel title="Review Session" icon={ListChecks}>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-black text-lagoon-900">
          <span>Question {index + 1}/{sessionItems.length}</span>
          <span>{attempted}/{sessionItems.length} answered</span>
        </div>
        <ProgressBar value={progress} className="mt-3" />
      </Panel>

      {currentItem?.exercise ? (
        <PracticePanel
          key={currentItem.key}
          title={currentItem.type === "mistake" ? "Fix the mistake" : "Grammar review"}
          exercise={currentItem.exercise}
          source="REVIEW"
          autoAdvance
          autoAdvanceOnWrong
          autoSubmitChoices
          onResult={recordResult}
          onComplete={advance}
        />
      ) : currentItem?.word ? (
        <ReviewWordQuizCard
          key={currentItem.key}
          item={currentItem}
          onResult={recordResult}
          onComplete={advance}
        />
      ) : (
        <Panel title="Review" icon={ListChecks}>
          <p className="text-sm font-semibold text-slate-600">This review item is unavailable.</p>
        </Panel>
      )}
    </section>
  );
}

function ReviewWordQuizCard({ item, onComplete, onResult }) {
  const word = item.word;
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const advanceTimer = useRef(null);

  useEffect(() => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    setAnswer("");
    setFeedback(null);
  }, [word?.id]);

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
  }, []);

  const submit = async () => {
    if (!word || !answer.trim() || feedback) return;
    setBusy(true);
    try {
      const result = await api(`/api/words/${word.id}/attempt`, {
        method: "POST",
        body: {
          mode: "en-es",
          answer
        }
      });
      const resultWithAnswer = { ...result, submitted: answer };
      setFeedback(resultWithAnswer);
      onResult?.(resultWithAnswer);
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null;
        onComplete?.();
      }, result.correct ? 900 : 1400);
    } catch (err) {
      const result = { correct: false, submissionError: true, submitted: answer, expected: "", explanation: err.message };
      setFeedback(result);
      onResult?.(result);
    } finally {
      setBusy(false);
    }
  };

  if (!word) {
    return (
      <Panel title="Vocabulary Review" icon={NotebookTabs}>
        <p className="text-sm font-semibold text-slate-600">This word is unavailable.</p>
      </Panel>
    );
  }

  return (
    <Panel
      title="Word Recall"
      icon={NotebookTabs}
      action={<span className="rounded-full bg-lagoon-50 px-3 py-1 text-xs font-black text-lagoon-700">{item.state || "Review"}</span>}
    >
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{word.groupTitle || "Vocabulary"}</p>
        <h2 className="mt-3 text-4xl font-black text-slate-950">{word.english}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">Type the Spanish word or phrase. The Spanish answer stays hidden until you submit.</p>
        <input
          value={answer}
          disabled={Boolean(feedback)}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          className="mt-5 w-full rounded-md border border-stone-200 bg-white px-4 py-4 text-xl font-bold outline-none focus:border-lagoon-500 disabled:bg-stone-100"
          placeholder="Spanish answer"
        />
        {!feedback && (
          <button
            disabled={!answer.trim() || busy}
            onClick={() => submit()}
            className="mt-4 rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 disabled:opacity-50"
          >
            {busy ? "Checking..." : "Check Answer"}
          </button>
        )}
      </div>

      {feedback && !feedback.submissionError && word.imageKey && (
        <div className="mt-5 grid gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:grid-cols-[110px_1fr] sm:items-center">
          <AssetImage imageKey={word.imageKey} alt={word.spanish} className="aspect-square w-full" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Answer revealed</p>
            <p className="mt-1 text-xl font-black text-emerald-950">{word.spanish}</p>
            {word.example && <p className="mt-2 text-sm font-semibold text-slate-700">{word.example}</p>}
          </div>
        </div>
      )}

      {feedback && (
        <div className={classNames("mt-5 rounded-lg border p-4", feedback.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50")}>
          <p className={classNames("font-black", feedback.correct ? "text-emerald-900" : "text-red-900")}>
            {feedback.submissionError ? "Could not check the answer" : feedback.correct ? `Correct +${feedback.xpAwarded} XP` : "Not yet"}
          </p>
          {feedback.expected && (
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Correct answer: <span className="font-black">{feedback.expected}</span>
            </p>
          )}
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {feedback.submissionError ? feedback.explanation : feedback.review?.message}
          </p>
          {feedback.submissionError ? (
            <button
              onClick={() => setFeedback(null)}
              className="mt-4 rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          ) : (
            <div className="mt-4 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
              Moving to the next due item...
            </div>
          )}
        </div>
      )}
    </Panel>
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
      <Panel title="Admin Overview" icon={Shield} action={message && <span className="text-sm font-bold text-emerald-600">{message}</span>}>
        <div className="grid gap-3 sm:grid-cols-5">
          <InfoTile label="Topics" value={content.topics.length} />
          <InfoTile label="Lessons" value={content.lessons.length} />
          <InfoTile label="Exercises" value={content.exercises.length} />
          <InfoTile label="Assets" value={content.assets.length} />
          <InfoTile label="Users" value={content.users.length} />
        </div>
      </Panel>

      <SystemStatusPanel system={content.system} />

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
          <TextInput label="Outcomes" value={lessonForm.outcomes} onChange={(outcomes) => setLessonForm({ ...lessonForm, outcomes })} />
          <TextInput label="Concept keys" value={lessonForm.conceptKeysText} onChange={(conceptKeysText) => setLessonForm({ ...lessonForm, conceptKeysText })} />
          <TextInput label="Review summary" value={lessonForm.reviewSummary} onChange={(reviewSummary) => setLessonForm({ ...lessonForm, reviewSummary })} />
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
            {["MULTIPLE_CHOICE", "CLOZE", "SENTENCE_BUILDER", "CONJUGATION", "ARTICLE_MATCH", "TRANSLATION", "ERROR_CORRECTION"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <TextInput label="Prompt" value={exerciseForm.prompt} onChange={(prompt) => setExerciseForm({ ...exerciseForm, prompt })} />
          <TextInput label="Question" value={exerciseForm.questionText} onChange={(questionText) => setExerciseForm({ ...exerciseForm, questionText })} />
          <TextInput label="Correct answer" value={exerciseForm.correctAnswer} onChange={(correctAnswer) => setExerciseForm({ ...exerciseForm, correctAnswer })} />
          <TextInput label="Accepted answers" value={exerciseForm.acceptedAnswers} onChange={(acceptedAnswers) => setExerciseForm({ ...exerciseForm, acceptedAnswers })} />
          <TextInput label="Alternatives" value={exerciseForm.alternatives} onChange={(alternatives) => setExerciseForm({ ...exerciseForm, alternatives })} />
          <TextInput label="Validation goal" value={exerciseForm.answerGoal} onChange={(answerGoal) => setExerciseForm({ ...exerciseForm, answerGoal })} />
          <label className="flex items-center justify-between rounded-md border border-stone-200 px-3 py-3 text-sm font-bold text-slate-700">
            Strict accents
            <input
              type="checkbox"
              checked={exerciseForm.accentStrict}
              onChange={(event) => setExerciseForm({ ...exerciseForm, accentStrict: event.target.checked })}
              className="h-5 w-5 accent-lagoon-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-md border border-stone-200 px-3 py-3 text-sm font-bold text-slate-700">
            Requires article
            <input
              type="checkbox"
              checked={exerciseForm.requiresArticle}
              onChange={(event) => setExerciseForm({ ...exerciseForm, requiresArticle: event.target.checked })}
              className="h-5 w-5 accent-lagoon-500"
            />
          </label>
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

function SystemStatusPanel({ system }) {
  if (!system) return null;
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
      title="Active Code"
      icon={Shield}
      action={<span className={classNames("rounded-full px-3 py-1 text-xs font-black", statusClass)}>{system.status}</span>}
    >
      <div className="grid gap-3 lg:grid-cols-4">
        <InfoTile label="Active" value={active?.shortHash || "unknown"} />
        <InfoTile label="Checked out" value={checkedOut?.shortHash || "unknown"} />
        <InfoTile label="Branch" value={system.branch || "unknown"} />
        <InfoTile label="Started" value={system.processStartedAt ? new Date(system.processStartedAt).toLocaleString() : "unknown"} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Deployment State</p>
          <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700">
            <div className="flex justify-between gap-3">
              <span>Restart needed</span>
              <span className={system.restartRequired ? "text-honey-700" : "text-emerald-700"}>{system.restartRequired ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Uncommitted files</span>
              <span className={system.dirty ? "text-sky-700" : "text-emerald-700"}>{system.dirty ? system.changes.length : "No"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Upstream</span>
              <span>{system.upstream || "not configured"}</span>
            </div>
            {system.upstream && (
              <div className="flex justify-between gap-3">
                <span>Ahead / behind</span>
                <span>{system.ahead || 0} / {system.behind || 0}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Current Commit</p>
          <p className="mt-3 font-black text-slate-950">{active?.subject || "Commit unavailable"}</p>
          <p className="mt-1 text-sm font-bold text-slate-600">{active?.hash || "unknown"}</p>
          {checkedOut?.hash && active?.hash && checkedOut.hash !== active.hash && (
            <p className="mt-3 rounded-md border border-honey-200 bg-honey-50 px-3 py-2 text-sm font-bold text-honey-900">
              Checkout is newer than the running service. Restart the service to activate it.
            </p>
          )}
        </div>
      </div>

      {!!system.changes?.length && (
        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Local Changes</p>
          <div className="mt-2 grid gap-1 font-mono text-xs text-slate-700">
            {system.changes.slice(0, 8).map((change) => (
              <span key={change}>{change}</span>
            ))}
          </div>
        </div>
      )}

      {!!system.recentCommits?.length && (
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Recent Commits</p>
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

function SettingsView({ user, theme, setTheme }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Profile" icon={Users}>
        <InfoTile label="Name" value={user.name} />
        <InfoTile label="Email" value={user.email} />
        <InfoTile label="Role" value={user.role} />
      </Panel>
      <Panel title="Appearance" icon={theme === "dark" ? Moon : Sun}>
        <div className="flex rounded-lg border border-stone-200 bg-stone-50 p-1 text-sm font-black">
          {[
            { value: "light", label: "Light", icon: Sun },
            { value: "dark", label: "Dark", icon: Moon }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={classNames(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3",
                theme === option.value ? "bg-white text-coral-600 shadow-sm" : "text-slate-600 hover:bg-white"
              )}
            >
              <option.icon size={17} />
              {option.label}
            </button>
          ))}
        </div>
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
          <div className="text-xs font-black uppercase tracking-[0.22em] text-lagoon-600">Espanolo</div>
        </div>
      )}
    </div>
  );
}

export default App;
