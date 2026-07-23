import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copy,
  Flame,
  Gamepad2,
  GraduationCap,
  Image,
  ExternalLink,
  ListChecks,
  Lock,
  LogOut,
  Medal,
  Mic,
  Moon,
  NotebookTabs,
  PenTool,
  Plus,
  RefreshCw,
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
import { advanceLessonPracticeQueue, advanceReviewSession, buildLessonPracticeQueue, interleaveLessonPracticeQueue, interleaveReviewSessionItems, rotateLessonReviewItems } from "./lesson-session-core.mjs";
import { buildLessonSentenceFrames } from "./lesson-pattern-core.mjs";
import { localizedLessonSummary, localizedLessonTitle, localizedUnit } from "./learning-localization-core.mjs";
import { localizedWordMeaning } from "./word-localization-core.mjs";
import { localizedSpeakingMeaning, localizedSpeakingTag } from "./speaking-library-localization.mjs";
import { buildSpeakingPracticeDeck, learnedSpeakingItems, nextUnmasteredSpeakingIndex, speakingMasteryProgress, speakingModeTabs, speakingSessionAfterScore } from "./speaking-practice-core.mjs";
import { SpeakingPracticeEmpty, SpeakingPracticeGuidance, SpeakingRoundComplete, SpeakingRoundProgress } from "./SpeakingRoundStatus.jsx";
import { eligibleWordCatcherWords, wordCatcherCopy } from "./word-catcher-core.mjs";
import { germanCourseSentenceMeaning } from "./course-sentence-meanings.mjs";
import { connectedInputRetryMessage } from "./connected-input-feedback.mjs";
import { connectedSpeechUtterancePlan } from "./connected-speech-core.mjs";
import { germanExerciseQuestion, looksLikeEnglishLearningText } from "./exercise-question-localization.mjs";
import { spanishLearningExample, withSpanishLearningExample } from "./spanish-content-core.mjs";
import { evaluateRecallSummary } from "./recall-evaluation-core.mjs";
import { contractionsChoiceFoundationExplanation, germanFoundationCardCopy, quantityPossessiveFoundationExplanation, supplementalTopicTeachingCards } from "./foundation-card-localization.mjs";
import { topicRememberPoints as authoredTopicRememberPoints } from "./topic-remember-points.mjs";
import { balanceFoundationQuickCheck, buildEnglishFoundationQuickCheck } from "./foundation-check-core.mjs";
import { evaluateModelSentenceRecall, modelSentenceAnswerFromWordIds, modelSentenceNeedsConsolidation, modelSentenceRecallFeedback, modelSentenceRecallIsComplete, modelSentenceScaffoldReason, modelSentenceWordBank } from "./model-sentence-recall-core.mjs";
import { soundFoundationLab } from "./sound-foundation-core.mjs";
import { buildWordSession, isWordAttempted, queueMissedWord, sortWordsForLearning, wordContextPrompt } from "./word-session-core.mjs";
import { createLessonResumeState, lessonResumeSignature, restoreLessonResumeState } from "./lesson-resume-core.mjs";
import { lessonSessionPhaseStates } from "./lesson-phase-core.mjs";
import { buildA1ContextBridge } from "./a1-context-bridge-core.mjs";
import { buildLessonVocabularyLab } from "./lesson-vocabulary-core.mjs";
import { dailyPlanDiagnosticChips, dailyPlanExplanation, deferredListeningCopy, naturalLearningHomeCopy } from "./daily-learning-core.mjs";
import LessonVocabularyLab from "./LessonVocabularyLab.jsx";
import MobileNavigation from "./MobileNavigation.jsx";
import SpanishCharacterBar from "./SpanishCharacterBar.jsx";
import { imageSheets, miniGameImageKeys } from "./image-sheet-catalog.mjs";
import { adjectiveFoundationGermanConceptTitles, advancedGermanConceptTitles, contractionsChoiceGermanConceptTitles, quantityPossessiveGermanConceptTitles } from "./advanced-german-concept-titles.mjs";

const AdminWorkspace = lazy(() => import("./AdminWorkspace.jsx"));
const ConversationWorkspace = lazy(() => import("./ConversationWorkspace.jsx"));
const ProgressView = lazy(() => import("./ProgressWorkspace.jsx"));

class LazyWorkspaceErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const german = this.props.nativeLanguage === "de";
    const title = german ? this.props.titleDe : this.props.titleEn;
    return (
      <section className="rounded-lg border border-honey-200 bg-honey-50 p-5 text-honey-950 shadow-sm" role="alert">
        <p className="font-black">{title}</p>
        <p className="mt-2 text-sm font-semibold">{german ? "Lade die Seite neu. Dein Lernfortschritt ist davon nicht betroffen." : "Reload the page. Your learning progress is not affected."}</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-md bg-honey-700 px-4 py-2 text-sm font-black text-white hover:bg-honey-800">
          {german ? "Seite neu laden" : "Reload page"}
        </button>
      </section>
    );
  }
}

const navItems = [
  { key: "learn", label: "Learn", icon: BookOpen },
  { key: "words", label: "Words", icon: NotebookTabs },
  { key: "review", label: "Review", icon: ListChecks },
  { key: "talk", label: "Talk", icon: Mic },
  { key: "play", label: "Play", icon: Gamepad2 },
  { key: "profile", label: "Profile", icon: Users },
  { key: "manage", label: "Manage", icon: Shield, adminOnly: true }
];

function primaryNavKey(active) {
  if (["dashboard", "path", "lessons", "grammar", "lab"].includes(active)) return "learn";
  if (["pronunciation"].includes(active)) return "words";
  if (["games", "challenges", "scenarios"].includes(active)) return "play";
  if (["progress", "settings"].includes(active)) return "profile";
  if (["admin"].includes(active)) return "manage";
  return active || "learn";
}

const THEME_STORAGE_KEY = "vamos-espanolo-theme";

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

function readLessonResumeRecord(key) {
  try {
    return window.localStorage.getItem(key) || window.sessionStorage.getItem(key) || "";
  } catch {
    try {
      return window.sessionStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }
}

function writeLessonResumeRecord(key, record) {
  const serialized = JSON.stringify(record);
  try {
    window.localStorage.setItem(key, serialized);
    window.sessionStorage.removeItem(key);
    return;
  } catch {
    try {
      window.sessionStorage.setItem(key, serialized);
    } catch {
      // Durable resume is an enhancement; the active lesson remains usable.
    }
  }
}

function removeLessonResumeRecord(key, legacyKeys = []) {
  for (const storageName of ["localStorage", "sessionStorage"]) {
    try {
      const storage = window[storageName];
      storage.removeItem(key);
      legacyKeys.forEach((legacyKey) => storage.removeItem(legacyKey));
    } catch {
      // Completion and manual restart remain usable without browser storage.
    }
  }
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

const germanFoundationMeanings = {
  "Hello.": "Hallo.",
  "I": "ich",
  "you": "du",
  "he": "er",
  "she": "sie",
  "I am Ana.": "Ich bin Ana.",
  "My name is Ana.": "Ich heiße Ana.",
  "I am from Austria.": "Ich komme aus Österreich.",
  "Hello, I am Ana.": "Hallo, ich bin Ana.",
  "Hello, my name is Ana.": "Hallo, ich heiße Ana.",
  "I am for identity or origin": "„Ich bin“ für Identität oder Herkunft",
  "I am for a current state or location": "„Ich bin“ für einen aktuellen Zustand oder Ort",
  "is for identity or a trait": "„ist“ für Identität oder eine Eigenschaft",
  "is for a current state or location": "„ist“ für einen aktuellen Zustand oder Ort",
  "I am a student.": "Ich bin Student / Studentin.",
  "I am Ana and I am a student.": "Ich bin Ana und ich bin Studentin.",
  "I am a student and I am from Austria.": "Ich bin Student / Studentin und komme aus Österreich.",
  "I am happy.": "Ich bin glücklich.",
  "I am happy today.": "Ich bin heute glücklich.",
  "I am tired today.": "Ich bin heute müde.",
  "I am at home.": "Ich bin zu Hause.",
  "I am at the café.": "Ich bin im Café.",
  "I am in the library.": "Ich bin in der Bibliothek.",
  "Today I am happy at home.": "Heute bin ich glücklich zu Hause.",
  "You study.": "Du lernst.",
  "He speaks.": "Er spricht.",
  "She is happy.": "Sie ist glücklich.",
  "She is a teacher.": "Sie ist Lehrerin.",
  "She is at home.": "Sie ist zu Hause.",
  "She is tired.": "Sie ist müde.",
  "Ana is happy today.": "Ana ist heute glücklich.",
  "Ana is a teacher.": "Ana ist Lehrerin.",
  "Ana is nervous.": "Ana ist nervös.",
  "Ana is a teacher, but she is tired today.": "Ana ist Lehrerin, aber sie ist heute müde.",
  "They are students.": "Sie sind Studenten / Studentinnen.",
  "They are in the library.": "Sie sind in der Bibliothek.",
  "Because movies are plural.": "Weil películas in der Mehrzahl steht.",
  "Because me is plural.": "Weil me in der Mehrzahl steht.",
  "Because it is negative.": "Weil der Satz verneint ist.",
  "We are nervous.": "Wir sind nervös.",
  "The student is sick.": "Der Student / die Studentin ist krank.",
  "The book is new.": "Das Buch ist neu.",
  "The store is open.": "Das Geschäft ist geöffnet.",
  "The students speak.": "Die Studenten / Studentinnen sprechen.",
  "I speak Spanish.": "Ich spreche Spanisch.",
  "You study a lot.": "Du lernst viel.",
  "They work today.": "Sie arbeiten heute.",
  "We walk to the park.": "Wir gehen zu Fuß zum Park.",
  "We walk together.": "Wir gehen gemeinsam zu Fuß.",
  "The person says: I": "Die Person sagt: ich",
  "You are talking to one familiar person.": "Du sprichst mit einer vertrauten Person.",
  "Say: Hello, my name is Ana.": "Sage: Hallo, ich heiße Ana.",
  "I buy the bread. I buy it.": "Ich kaufe das Brot. Ich kaufe es.",
  "I see the book. I see it.": "Ich sehe das Buch. Ich sehe es.",
  "I buy the shirt. I buy it.": "Ich kaufe das Hemd. Ich kaufe es.",
  "I read the letter. I read it.": "Ich lese den Brief. Ich lese ihn.",
  "I need the books. I need them.": "Ich brauche die Bücher. Ich brauche sie.",
  "I buy the shoes. I buy them.": "Ich kaufe die Schuhe. Ich kaufe sie.",
  "I see the keys. I see them.": "Ich sehe die Schlüssel. Ich sehe sie.",
  "I want the apples. I want them.": "Ich möchte die Äpfel. Ich möchte sie.",
  "I give the book to Ana. I give her the book.": "Ich gebe Ana das Buch. Ich gebe ihr das Buch.",
  "I send Luis a message. I send him a message.": "Ich schicke Luis eine Nachricht. Ich schicke ihm eine Nachricht.",
  "I show the woman the map. I show her the map.": "Ich zeige der Frau die Karte. Ich zeige ihr die Karte.",
  "I offer the customer water. I offer them water.": "Ich biete dem Kunden Wasser an. Ich biete ihm Wasser an.",
  "Do you have the blue shirt? Yes, I have it.": "Haben Sie das blaue Hemd? Ja, ich habe es.",
  "Do you want the shoes? Yes, I want them.": "Möchten Sie die Schuhe? Ja, ich möchte sie.",
  "The shirt costs twenty euros. I buy it.": "Das Hemd kostet zwanzig Euro. Ich kaufe es.",
  "I do not want the bags. I do not need them.": "Ich möchte die Taschen nicht. Ich brauche sie nicht.",
  "Shall I show you another size? Yes, thank you.": "Soll ich Ihnen eine andere Größe zeigen? Ja, danke.",
  "I give Ana the book.": "Ich gebe Ana das Buch.",
  "Yesterday I worked at home.": "Gestern arbeitete ich zu Hause.",
  "Last night I studied Spanish.": "Gestern Abend lernte ich Spanisch.",
  "Ana spoke with her friend.": "Ana sprach mit ihrer Freundin.",
  "On Saturday we visited the museum.": "Am Samstag besuchten wir das Museum.",
  "Afterwards they bought coffee.": "Danach kauften sie Kaffee.",
  "Yesterday I ate at the café.": "Gestern aß ich im Café.",
  "Luis drank water.": "Luis trank Wasser.",
  "We lived in Madrid for two years.": "Wir lebten zwei Jahre in Madrid.",
  "They wrote a message.": "Sie schrieben eine Nachricht.",
  "I opened the door and went in.": "Ich öffnete die Tür und ging hinein.",
  "Yesterday I went to the market.": "Gestern ging ich zum Markt.",
  "Afterwards I made dinner.": "Danach machte ich das Abendessen.",
  "I had a problem with the car.": "Ich hatte ein Problem mit dem Auto.",
  "I was at home in the afternoon.": "Am Nachmittag war ich zu Hause.",
  "Ana went to the station and took the train.": "Ana ging zum Bahnhof und nahm den Zug.",
  "When I was a child, I lived in a village.": "Als ich ein Kind war, lebte ich in einem Dorf.",
  "I always walked to school.": "Ich ging immer zu Fuß zur Schule.",
  "Ana was tired.": "Ana war müde.",
  "We had a small dog.": "Wir hatten einen kleinen Hund.",
  "It was cold and it was raining.": "Es war kalt und es regnete.",
  "I was walking through the park when it started to rain.": "Ich ging gerade durch den Park, als es anfing zu regnen.",
  "I was at home when Ana called.": "Ich war zu Hause, als Ana anrief.",
  "While I was studying, the phone rang.": "Während ich lernte, klingelte das Telefon.",
  "It was sunny when we left the hotel.": "Es war sonnig, als wir das Hotel verließen.",
  "Yesterday I went to the market and bought fruit.": "Gestern ging ich zum Markt und kaufte Obst.",
  "I think learning languages is important.": "Ich denke, dass Sprachenlernen wichtig ist.",
  "I think this option is better.": "Ich denke, dass diese Möglichkeit besser ist.",
  "For me, living near work is practical.": "Für mich ist es praktisch, in der Nähe der Arbeit zu wohnen.",
  "In my opinion, public transport is necessary.": "Meiner Meinung nach sind öffentliche Verkehrsmittel notwendig.",
  "I do not think it is easy, but it is possible.": "Ich glaube nicht, dass es einfach ist, aber es ist möglich.",
  "I prefer the train because I can rest.": "Ich bevorzuge den Zug, weil ich mich ausruhen kann.",
  "I work from home, so I save time.": "Ich arbeite von zu Hause, deshalb spare ich Zeit.",
  "Although it is expensive, the course is very useful.": "Obwohl der Kurs teuer ist, ist er sehr nützlich.",
  "In addition, I can study at my own pace.": "Außerdem kann ich in meinem eigenen Tempo lernen.",
  "However, I need more speaking practice.": "Allerdings brauche ich mehr Sprechpraxis.",
  "I agree with you.": "Ich stimme dir zu.",
  "You are right, especially about the price.": "Du hast recht, besonders beim Preis.",
  "I understand your point, but I see it differently.": "Ich verstehe deinen Standpunkt, aber ich sehe es anders.",
  "I do not completely agree.": "Ich stimme nicht vollständig zu.",
  "That may be, although I prefer the first option.": "Das mag sein, obwohl ich die erste Möglichkeit bevorzuge.",
  "The train is faster than the bus.": "Der Zug ist schneller als der Bus.",
  "The bus is less expensive, but it takes longer.": "Der Bus ist günstiger, aber er braucht länger.",
  "The first option is as practical as the second.": "Die erste Möglichkeit ist genauso praktisch wie die zweite.",
  "I recommend the train because it is more comfortable.": "Ich empfehle den Zug, weil er bequemer ist.",
  "It depends on your budget and the available time.": "Es hängt von deinem Budget und der verfügbaren Zeit ab.",
  "In my opinion, studying online is a good option.": "Meiner Meinung nach ist Online-Lernen eine gute Möglichkeit.",
  "First, it allows you to study at any time.": "Erstens ermöglicht es, jederzeit zu lernen.",
  "In addition, it is not necessary to travel.": "Außerdem ist es nicht notwendig zu fahren.",
  "However, speaking with other people can be more difficult.": "Allerdings kann das Sprechen mit anderen Menschen schwieriger sein.",
  "Therefore, I recommend combining classes with conversation.": "Deshalb empfehle ich, Unterricht mit Gesprächen zu verbinden.",
  "In summary, it is flexible, but it needs active practice.": "Zusammenfassend ist es flexibel, braucht aber aktive Übung.",
  "I think this option is better because it is more practical.": "Ich denke, diese Möglichkeit ist besser, weil sie praktischer ist.",
  "I understand your point, but I do not completely agree.": "Ich verstehe deinen Standpunkt, stimme aber nicht vollständig zu.",
  "The train is faster, although the bus is less expensive.": "Der Zug ist schneller, obwohl der Bus günstiger ist.",
  "In addition, we can save time.": "Außerdem können wir Zeit sparen.",
  "In summary, I recommend combining the two options.": "Zusammenfassend empfehle ich, die beiden Möglichkeiten zu kombinieren.",
  "Ana missed the bus, so she arrived late to work.": "Ana verpasste den Bus und kam deshalb zu spät zur Arbeit.",
  "Although she left early, there was a lot of traffic.": "Obwohl sie früh losfuhr, herrschte viel Verkehr.",
  "Her colleague started the meeting without her.": "Ihre Kollegin begann die Besprechung ohne sie.",
  "In the end, Ana explained what happened and everyone understood.": "Am Ende erklärte Ana, was geschehen war, und alle verstanden es.",
  "The main idea is that a transport problem changed her morning.": "Die Hauptaussage ist, dass ein Verkehrsproblem ihren Morgen veränderte.",
  "First, I prepared breakfast and checked my messages.": "Zuerst bereitete ich das Frühstück zu und prüfte meine Nachrichten.",
  "Then, I went downtown to do some shopping.": "Dann fuhr ich ins Zentrum, um einzukaufen.",
  "While I was waiting for the bus, it started to rain.": "Während ich auf den Bus wartete, begann es zu regnen.",
  "After shopping, I met Marta.": "Nach dem Einkaufen traf ich Marta.",
  "Finally, we returned home by taxi.": "Zum Schluss fuhren wir mit dem Taxi nach Hause.",
  "The woman who works here speaks three languages.": "Die Frau, die hier arbeitet, spricht drei Sprachen.",
  "I am looking for a book that explains grammar with examples.": "Ich suche ein Buch, das die Grammatik mit Beispielen erklärt.",
  "This is the café that you recommended to me.": "Das ist das Café, das du mir empfohlen hast.",
  "I met a teacher who lives in Seville.": "Ich lernte einen Lehrer kennen, der in Sevilla lebt.",
  "The app that I use every day has short exercises.": "Die App, die ich jeden Tag nutze, hat kurze Übungen.",
  "Marta says that she arrives at eight.": "Marta sagt, dass sie um acht Uhr ankommt.",
  "The doctor said that I should rest.": "Der Arzt sagte, dass ich mich ausruhen solle.",
  "According to Pablo, the museum is closed today.": "Laut Pablo ist das Museum heute geschlossen.",
  "Ana told me that she had found a job.": "Ana erzählte mir, dass sie eine Arbeit gefunden hatte.",
  "I do not know if she will come, but she said that she would try.": "Ich weiß nicht, ob sie kommt, aber sie sagte, dass sie es versuchen würde.",
  "Carlos came in with a wet umbrella and left his shoes by the door.": "Carlos kam mit einem nassen Regenschirm herein und stellte seine Schuhe an die Tür.",
  "The store was dark and the sign said they would return at four.": "Der Laden war dunkel und auf dem Schild stand, dass sie um vier zurückkämen.",
  "Lucía looked at the clock several times during the meeting.": "Lucía sah während der Besprechung mehrmals auf die Uhr.",
  "He did not reply to the message, although he appeared online.": "Er antwortete nicht auf die Nachricht, obwohl er als online angezeigt wurde.",
  "We do not know the exact reason; we can only form a hypothesis.": "Wir kennen den genauen Grund nicht; wir können nur eine Vermutung formulieren.",
  "Although she left early, she missed the train that went downtown.": "Obwohl sie früh losfuhr, verpasste sie den Zug ins Zentrum.",
  "Then she called Marta and told her that she would arrive late.": "Dann rief sie Marta an und sagte ihr, dass sie sich verspäten würde.",
  "While she was waiting, she saw a café that had just opened.": "Während sie wartete, sah sie ein Café, das gerade geöffnet hatte.",
  "She entered with a wet coat, so it was probably raining.": "Sie kam mit einem nassen Mantel herein, also regnete es wahrscheinlich.",
  "In summary, an unexpected delay changed her plans.": "Zusammenfassend änderte eine unerwartete Verspätung ihre Pläne.",
  "Tomorrow I work from home.": "Morgen arbeite ich von zu Hause.",
  "This afternoon I am going to call Marta.": "Heute Nachmittag werde ich Marta anrufen.",
  "Next year I will travel more.": "Nächstes Jahr werde ich mehr reisen.",
  "The meeting starts at nine.": "Die Besprechung beginnt um neun Uhr.",
  "I think everything will turn out well.": "Ich denke, dass alles gut ausgehen wird.",
  "Tomorrow I will speak with the director.": "Morgen werde ich mit der Direktorin sprechen.",
  "We will eat after the meeting.": "Wir werden nach der Besprechung essen.",
  "They will live near downtown.": "Sie werden in der Nähe des Zentrums wohnen.",
  "Will you study this weekend?": "Wirst du dieses Wochenende lernen?",
  "I will write to you when I arrive.": "Ich werde dir schreiben, wenn ich ankomme.",
  "I will have more time tomorrow.": "Morgen werde ich mehr Zeit haben.",
  "We will be able to finish the project.": "Wir werden das Projekt beenden können.",
  "She will come after work.": "Sie wird nach der Arbeit kommen.",
  "They will make a reservation this afternoon.": "Sie werden heute Nachmittag reservieren.",
  "I will tell you the truth.": "Ich werde dir die Wahrheit sagen.",
  "Where could Ana be now?": "Wo könnte Ana jetzt sein?",
  "She is probably at home.": "Sie ist wahrscheinlich zu Hause.",
  "It must be about eight o'clock.": "Es ist vermutlich ungefähr acht Uhr.",
  "He is probably about thirty years old.": "Er ist wahrscheinlich ungefähr dreißig Jahre alt.",
  "He is probably not answering because he is busy.": "Er antwortet vermutlich nicht, weil er beschäftigt ist.",
  "If it rains, I will stay home.": "Wenn es regnet, bleibe ich zu Hause.",
  "If you have time, call me.": "Wenn du Zeit hast, ruf mich an.",
  "If I finish early, I am going to prepare dinner.": "Wenn ich früh fertig bin, werde ich das Abendessen zubereiten.",
  "If you do not understand, ask.": "Wenn du etwas nicht verstehst, frag nach.",
  "We can walk if the weather is good.": "Wir können zu Fuß gehen, wenn das Wetter gut ist.",
  "Tomorrow I am going to review the plan.": "Morgen werde ich den Plan überprüfen.",
  "Afterwards I will speak with the team.": "Danach werde ich mit dem Team sprechen.",
  "If there is a problem, we will solve it together.": "Wenn es ein Problem gibt, werden wir es gemeinsam lösen.",
  "Marta is not here; she is probably in a meeting.": "Marta ist nicht hier; sie ist wahrscheinlich in einer Besprechung.",
  "We will have an answer before Friday.": "Wir werden vor Freitag eine Antwort haben.",
  "I want you to come tomorrow.": "Ich möchte, dass du morgen kommst.",
  "It is important that you rest.": "Es ist wichtig, dass du dich ausruhst.",
  "I am glad that you are here.": "Ich freue mich, dass du hier bist.",
  "I think Ana is working today.": "Ich denke, dass Ana heute arbeitet.",
  "I do not think Ana is working today.": "Ich glaube nicht, dass Ana heute arbeitet.",
  "I hope that you speak with Marta.": "Ich hoffe, dass du mit Marta sprichst.",
  "It is better that we eat beforehand.": "Es ist besser, wenn wir vorher essen.",
  "They want us to live nearby.": "Sie möchten, dass wir in der Nähe wohnen.",
  "I need you to arrive early.": "Ich brauche dich früh hier.",
  "I prefer that you look for another option.": "Mir ist lieber, dass du nach einer anderen Möglichkeit suchst.",
  "I hope that you are happy.": "Ich hoffe, dass du glücklich bist.",
  "I want you to go with me.": "Ich möchte, dass du mit mir gehst.",
  "It is possible that there is a problem.": "Es ist möglich, dass es ein Problem gibt.",
  "I am glad that you are feeling better.": "Ich freue mich, dass es dir besser geht.",
  "I doubt that he knows the answer.": "Ich bezweifle, dass er die Antwort kennt.",
  "I want you to call me this afternoon.": "Ich möchte, dass du mich heute Nachmittag anrufst.",
  "I hope that everything goes well.": "Ich hoffe, dass alles gut geht.",
  "I ask you to speak more slowly.": "Ich bitte dich, langsamer zu sprechen.",
  "We prefer you all to come on Saturday.": "Uns ist lieber, dass ihr am Samstag kommt.",
  "I want to travel tomorrow.": "Ich möchte morgen reisen.",
  "It is necessary that you rest more.": "Es ist notwendig, dass du dich mehr ausruhst.",
  "It is better that you speak with her.": "Es ist besser, wenn du mit ihr sprichst.",
  "I am worried that you work so much.": "Ich mache mir Sorgen, dass du so viel arbeitest.",
  "We are surprised that they arrive so early.": "Wir sind überrascht, dass sie so früh ankommen.",
  "It is true that she works a lot.": "Es stimmt, dass sie viel arbeitet.",
  "I hope that you have time tomorrow.": "Ich hoffe, dass du morgen Zeit hast.",
  "It is important that we speak today.": "Es ist wichtig, dass wir heute sprechen.",
  "I want you to come, but I understand that you are busy.": "Ich möchte, dass du kommst, aber ich verstehe, dass du beschäftigt bist.",
  "I am glad that everything is going well.": "Ich freue mich, dass alles gut läuft.",
  "I do not think it is necessary to change the plan.": "Ich glaube nicht, dass es notwendig ist, den Plan zu ändern.",
  "Today I have worked from home.": "Heute habe ich von zu Hause gearbeitet.",
  "This week we have spoken three times.": "Diese Woche haben wir dreimal gesprochen.",
  "Have you ever been to Seville?": "Warst du schon einmal in Sevilla?",
  "In many American countries the preterite is also used for recent events.": "In vielen amerikanischen Ländern wird auch für kürzlich Geschehenes das Pretérito verwendet.",
  "I have spoken with Ana.": "Ich habe mit Ana gesprochen.",
  "You have eaten very little.": "Du hast sehr wenig gegessen.",
  "We have lived here for a year.": "Wir leben seit einem Jahr hier.",
  "They have finished the project.": "Sie haben das Projekt abgeschlossen.",
  "The letters have arrived.": "Die Briefe sind angekommen.",
  "I have made the reservation.": "Ich habe die Reservierung vorgenommen.",
  "Have you seen my message?": "Hast du meine Nachricht gesehen?",
  "Marta has returned home.": "Marta ist nach Hause zurückgekehrt.",
  "We have written three emails.": "Wir haben drei E-Mails geschrieben.",
  "The store has opened late.": "Das Geschäft hat spät geöffnet.",
  "I have already finished.": "Ich bin bereits fertig.",
  "I have not eaten yet.": "Ich habe noch nicht gegessen.",
  "We have never visited Chile.": "Wir haben Chile noch nie besucht.",
  "Have you ever tried paella?": "Hast du schon einmal Paella probiert?",
  "Lately I have slept little.": "In letzter Zeit habe ich wenig geschlafen.",
  "When I arrived, Ana had already left.": "Als ich ankam, war Ana bereits gegangen.",
  "I could not enter because I had lost the key.": "Ich konnte nicht hinein, weil ich den Schlüssel verloren hatte.",
  "We had never seen so much snow.": "Wir hatten noch nie so viel Schnee gesehen.",
  "They had finished before eight.": "Sie waren vor acht Uhr fertig gewesen.",
  "After we had eaten, we went to the museum.": "Nachdem wir gegessen hatten, gingen wir ins Museum.",
  "This morning I have spoken with the doctor.": "Heute Morgen habe ich mit dem Arzt gesprochen.",
  "He has not replied to me yet.": "Er hat mir noch nicht geantwortet.",
  "Yesterday I went to the pharmacy.": "Gestern ging ich in die Apotheke.",
  "When I arrived, they had already closed.": "Als ich ankam, hatten sie bereits geschlossen.",
  "Luckily, I had written down the address.": "Zum Glück hatte ich die Adresse aufgeschrieben."
};

const germanConversationMeanings = {
  "Hi! How are you?": "Hallo! Wie geht es dir?", "Very well, thanks. And you?": "Sehr gut, danke. Und dir?", "Very well, thanks.": "Sehr gut, danke.", "So-so. I'm a little tired.": "Es geht. Ich bin ein wenig müde.", "Not very well. I'm sick.": "Nicht sehr gut. Ich bin krank.",
  "That's great! I'm well too. What are you doing today?": "Wie schön! Mir geht es auch gut. Was machst du heute?", "I'm working today. And you, what are you doing?": "Ich arbeite heute. Und du, was machst du?", "I'm studying Spanish and resting afterwards.": "Ich lerne Spanisch und ruhe mich danach aus.", "I'm resting today. And you?": "Ich ruhe mich heute aus. Und du?",
  "Oh dear. Are you working a lot today?": "Oh je. Arbeitest du heute viel?", "Yes, I work a lot in the morning.": "Ja, ich arbeite morgens viel.", "No, but I didn't sleep much.": "Nein, aber ich habe wenig geschlafen.", "That's a shame. Do you need anything?": "Wie schade. Brauchst du etwas?", "I need to rest, thanks.": "Ich muss mich ausruhen, danke.", "No, thanks. I'm going to rest.": "Nein, danke. Ich werde mich ausruhen.",
  "I'm going to the market. Have a good day!": "Ich gehe zum Markt. Hab einen schönen Tag!", "Very good! I'm going to the market. See you later.": "Sehr gut! Ich gehe zum Markt. Bis später.", "I'm going to the market. Enjoy your day off.": "Ich gehe zum Markt. Genieß deinen freien Tag.", "I understand. I hope you rest this afternoon.": "Ich verstehe. Ich hoffe, du ruhst dich heute Nachmittag aus.", "Ah, I understand. Then rest tonight.": "Ah, ich verstehe. Dann ruh dich heute Abend aus.", "Of course. I hope you feel better soon.": "Natürlich. Ich hoffe, dir geht es bald besser.",
  "Hi! My name is Diego. What's your name?": "Hallo! Ich heiße Diego. Wie heißt du?", "My name is Alex. Where are you from?": "Ich heiße Alex. Woher kommst du?", "My name is Alex. Nice to meet you.": "Ich heiße Alex. Freut mich.", "I'm from Mexico. And you, where are you from?": "Ich komme aus Mexiko. Und du, woher kommst du?", "I'm from Austria. That's great!": "Ich komme aus Österreich. Wie schön!", "I'm from Austria, but I live here.": "Ich komme aus Österreich, aber ich wohne hier.", "Nice to meet you! See you soon.": "Freut mich, dich kennenzulernen! Bis bald.",
  "Good morning. What would you like to drink?": "Guten Morgen. Was möchtest du trinken?", "I'd like a coffee, please.": "Ich möchte einen Kaffee, bitte.", "A tea, please.": "Einen Tee, bitte.", "Of course. With milk or black?": "Natürlich. Mit Milch oder schwarz?", "With milk, thank you.": "Mit Milch, danke.", "Black, thank you.": "Schwarz, danke.", "Very well. Would you like something to eat?": "Sehr gut. Möchtest du etwas essen?", "No, thank you. Just the tea.": "Nein, danke. Nur den Tee.", "Yes, I'd like a sandwich.": "Ja, ich möchte ein Sandwich.", "Perfect. Right away.": "Perfekt. Sofort.",
  "What are you going to do this weekend?": "Was wirst du dieses Wochenende machen?", "I'm going to rest and watch a movie.": "Ich werde mich ausruhen und einen Film ansehen.", "I'm going out with my friends. And you?": "Ich gehe mit meinen Freunden aus. Und du?", "That's great! I'm going to the park. Do you want to come?": "Wie schön! Ich gehe in den Park. Möchtest du mitkommen?", "Yes, of course. At what time?": "Ja, natürlich. Um wie viel Uhr?", "Sorry, but I can't. I have work.": "Tut mir leid, aber ich kann nicht. Ich muss arbeiten.", "I'm going to the park with Ana.": "Ich gehe mit Ana in den Park.", "That's great! What time are you going?": "Wie schön! Um wie viel Uhr geht ihr?", "That's great! Where is the park?": "Wie schön! Wo ist der Park?", "I'll tell you later. Have a good weekend!": "Ich erzähle es dir später. Schönes Wochenende!"
};

function conversationMeaning(value, nativeLanguage = "de") {
  return nativeLanguage === "de" ? germanConversationMeanings[value] || "" : value;
}

const germanConversationUi = {
  "Keep a greeting going": "Ein Begrüßungsgespräch weiterführen",
  "Answer, react, and return a question instead of stopping after one phrase.": "Antworte, reagiere und stelle eine Frage zurück, statt nach einem Satz aufzuhören.",
  "Meet someone new": "Jemanden kennenlernen",
  "Introduce yourself, say where you are from, and return a personal question.": "Stelle dich vor, sage, woher du kommst, und stelle eine persönliche Frage zurück.",
  "Order at a café": "Im Café bestellen",
  "Order a drink, respond to a follow-up question, and close politely.": "Bestelle ein Getränk, beantworte eine Rückfrage und beende das Gespräch höflich.",
  "Talk about the weekend": "Über das Wochenende sprechen",
  "Share a plan, react to someone else's plan, and ask a follow-up question.": "Erzähle von einem Plan, reagiere auf den Plan deines Gegenübers und frage nach.",
  Starter: "Einstieg",
  Beginner: "Anfänger",
  "Say how you feel. A strong reply also asks the question back.": "Sage, wie es dir geht. Eine starke Antwort stellt die Frage anschließend zurück.",
  "Give one activity, then ask Lucía what she is doing.": "Nenne eine Tätigkeit und frage Lucía danach, was sie macht.",
  "Answer yes or no and add one small reason.": "Antworte mit Ja oder Nein und ergänze einen kurzen Grund.",
  "Say what you need, or politely say no.": "Sage, was du brauchst, oder lehne höflich ab.",
  "Introduce yourself, then ask Diego where he is from.": "Stelle dich vor und frage Diego anschließend, woher er kommt.",
  "Say where you are from and react to Diego's answer.": "Sage, woher du kommst, und reagiere auf Diegos Antwort.",
  "Order one drink politely.": "Bestelle höflich ein Getränk.",
  "Choose one and thank the server.": "Wähle eine Möglichkeit und bedanke dich bei der Bedienung.",
  "Accept or decline politely.": "Nimm höflich an oder lehne höflich ab.",
  "Share one plan. Use “voy a” plus an action.": "Nenne einen Plan. Verwende „voy a“ mit einer Tätigkeit.",
  "Accept or decline, then add a reason.": "Nimm an oder lehne ab und ergänze einen Grund.",
  "React and ask one follow-up question.": "Reagiere und stelle eine passende Rückfrage."
};

const germanConversationSkills = {
  "answer + ask back": "antworten + zurückfragen",
  answer: "antworten",
  "answer + detail": "antworten + Detail ergänzen",
  "negative answer": "negativ antworten",
  "answer + follow up": "antworten + nachfragen",
  "two details": "zwei Details verbinden",
  "answer + reason": "antworten + begründen",
  "answer + contrast": "antworten + Gegensatz ausdrücken",
  "state a need": "ein Bedürfnis ausdrücken",
  "decline + detail": "ablehnen + Detail ergänzen",
  "introduce + ask": "vorstellen + fragen",
  introduce: "sich vorstellen",
  "answer + react": "antworten + reagieren",
  "polite request": "höflich bitten",
  "short request": "kurz bitten",
  "choose + thank": "auswählen + bedanken",
  "decline politely": "höflich ablehnen",
  "accept + request": "annehmen + bitten",
  "share a plan": "einen Plan nennen",
  "plan + ask back": "Plan nennen + zurückfragen",
  "accept + follow up": "annehmen + nachfragen",
  "decline + reason": "ablehnen + begründen",
  "react + follow up": "reagieren + nachfragen",
  "react + question": "reagieren + Frage stellen"
};

function conversationUi(value, nativeLanguage = "de") {
  return nativeLanguage === "de" ? germanConversationUi[value] || "" : value;
}

function conversationSkill(value, nativeLanguage = "de") {
  return nativeLanguage === "de" ? germanConversationSkills[value] || "Gespräch weiterführen" : value;
}

function nativeMeaning(value, nativeLanguage = "de") {
  if (nativeLanguage !== "de") return value;
  const english = String(value || "").trim();
  return germanFoundationMeanings[english] || germanCourseSentenceMeaning(english);
}

function localizedExerciseOption(option, nativeLanguage = "de") {
  if (nativeLanguage !== "de") return option;
  const normalizedWord = String(option?.text || "").toLowerCase().replace(/[.!?]+$/g, "").trim();
  const translated = nativeMeaning(option?.text, nativeLanguage)
    || localizedWordMeaning({ english: option?.text }, nativeLanguage)
    || localizedWordMeaning({ english: normalizedWord }, nativeLanguage);
  if (translated) return { ...option, text: translated };
  if (looksLikeEnglishLearningText(option?.text)) {
    return { ...option, text: "Diese Bedeutungsoption muss noch auf Deutsch ergänzt werden." };
  }
  return option;
}

function localizedExerciseQuestion(exercise, nativeLanguage = "de") {
  if (nativeLanguage !== "de") return exercise?.questionText || "";
  const translated = germanExerciseQuestion(exercise?.questionText)
    || nativeMeaning(exercise?.questionText, nativeLanguage)
    || germanScenarioMetadata[exercise?.questionText];
  if (translated) return translated;
  const question = String(exercise?.questionText || "");
  return looksLikeEnglishLearningText(question)
    ? "Wende das gelernte spanische Satzmuster auf diese Bedeutung an."
    : question;
}

function localizedLockedReason(lesson, nativeLanguage = "de") {
  if (!lesson?.isLocked) return "";
  const blockingLesson = lesson?.unlockState?.blockingLesson;
  if (nativeLanguage !== "de") {
    return blockingLesson
      ? `Complete “${localizedLessonTitle(blockingLesson, nativeLanguage)}” first.`
      : lesson.lockedReason || "Complete the earlier learning packages first.";
  }
  if (blockingLesson) return `Als Nächstes: „${localizedLessonTitle(blockingLesson, nativeLanguage)}“. Schließe dieses Lernpaket zuerst ab.`;
  const count = Number(lesson?.unlockState?.incompleteCount || 0);
  if (count > 0) return `Schließe zuerst ${count} frühere ${count === 1 ? "Lernpaket" : "Lernpakete"} im geführten Lernweg ab.`;
  return "Schließe zuerst das vorherige Lernpaket im geführten Lernweg ab.";
}

const germanScenarioMetadata = {
  restaurant: "Restaurant",
  directions: "Wegbeschreibung",
  street: "Straße",
  pharmacy: "Apotheke",
  "Ask for a table for two.": "Bitte um einen Tisch für zwei Personen.",
  "Ask for a recommendation.": "Bitte um eine Empfehlung.",
  "Say the order is to go.": "Sage, dass die Bestellung zum Mitnehmen ist.",
  "Ask where the station is.": "Frage, wo der Bahnhof ist.",
  "Ask for pain medicine.": "Bitte um ein Schmerzmittel.",
  "Order two coffees to go.": "Bestelle zwei Kaffee zum Mitnehmen."
};

function localizedScenarioMetadata(value, nativeLanguage = "de") {
  if (nativeLanguage !== "de") return value || "";
  return germanScenarioMetadata[value] || "In dieser Situation passend auf Spanisch reagieren";
}

const germanMiniGames = {
  "conjugation-sprint": { title: "Verbformen-Sprint", description: "Rufe spanische Verbformen zügig und ohne sichtbares Modell ab." },
  "sentence-builder": { title: "Satzbau", description: "Ordne Bausteine zu vollständigen, nützlichen spanischen Sätzen." },
  "article-match": { title: "Artikel zuordnen", description: "Verbinde Nomen mit el, la, los oder las und speichere sie als Einheit." },
  "word-catcher": { title: "Wortfänger", description: "Fange die passende deutsche Bedeutung, bevor die Zeit abläuft." }
};

function localizedMiniGame(game, nativeLanguage = "de") {
  if (nativeLanguage !== "de") return game;
  return { ...game, ...(germanMiniGames[game?.key] || { title: "Spanisch-Training", description: "Festige bekannten Lernstoff in einer kurzen Runde." }) };
}

function germanExerciseHelp(exercise, quiet = false) {
  if (quiet && exercise?.type === "LISTENING_DICTATION") return "Rufe den bekannten spanischen Satz aus seiner deutschen Bedeutung ab. Beginne mit Person und Verb; ergänze danach die entscheidenden Inhaltswörter.";
  const goal = String(exercise?.answerGoal || "").toLowerCase();
  if (goal.includes("personal_a")) return "Bestimme zuerst das direkte Objekt: Sache oder Person? Bei einer konkreten oder identifizierten Person steht meist a; eine noch unbestimmte Person sowie frühe Grenzen wie tener bleiben hier ohne a.";
  if (goal.includes("participant_object")) return "Bestimme zuerst die Gesprächsrolle: me verweist auf mich, te auf dein vertrautes Gegenüber und nos auf uns. Verb und übrige Ergänzungen zeigen, ob die Person direkt betroffen ist oder etwas erhält; das Pronomen steht vor dem konjugierten Verb.";
  if (goal.includes("sound_")) return "Verbinde Schrift und Klang: Prüfe zuerst Vokale und besondere Buchstabenfolgen, bestimme danach die betonte Silbe und sprich oder schreibe erst dann die vollständige Sinngruppe.";
  if (goal.includes("ser") || goal.includes("estar")) return "Entscheide zuerst nach der Bedeutung: Identität/Herkunft verwendet ser; Zustand/Ort verwendet estar. Wähle danach die passende Personenform.";
  if (goal.includes("article") || exercise?.type === "ARTICLE_MATCH") return "Lerne Artikel und Nomen als Einheit. Prüfe Geschlecht und Anzahl, bevor du den Satz zusammensetzt.";
  if (exercise?.type === "SENTENCE_BUILDER") return "Suche zuerst das konjugierte Verb. Ordne dann Person, Verb und Ergänzung zu einem vollständigen Gedanken.";
  if (exercise?.type === "LISTENING_DICTATION") return "Höre zuerst auf das Verb und die betonten Inhaltswörter. Ergänze kleine Wörter erst beim zweiten Hören.";
  if (exercise?.type === "DIALOGUE_REPLY") return "Antworte zuerst direkt auf die Frage. Füge danach ein kleines Detail oder eine Rückfrage hinzu.";
  return "Rufe zuerst das gelernte Satzmuster ab. Beginne mit dem stabilen Rahmen und setze anschließend das passende Detail ein.";
}

function germanExercisePrompt(exercise) {
  const functional = Boolean(exercise?.functionalGoals?.groups?.length);
  const labels = {
    MULTIPLE_CHOICE: "Wähle die passende Antwort",
    CLOZE: "Ergänze die Lücke",
    TRANSLATION: "Drücke die Bedeutung auf Spanisch aus",
    SENTENCE_BUILDER: "Baue einen vollständigen spanischen Satz",
    ERROR_CORRECTION: "Finde und verbessere den Fehler",
    ARTICLE_MATCH: "Wähle den passenden Artikel",
    CONJUGATION: "Setze das Verb in die passende Form",
    SHORT_ANSWER: functional ? "Formuliere eine eigene passende Antwort auf Spanisch" : "Rufe den passenden spanischen Modellsatz ab",
    TRANSFORMATION: "Forme den Satz nach dem verlangten Muster um",
    DIALOGUE_REPLY: functional ? "Formuliere einen eigenen passenden Gesprächszug" : "Rufe den gelernten Gesprächsbaustein ab",
    LISTENING_DICTATION: "Höre und schreibe den spanischen Satz",
    WRITING_PROMPT: functional ? "Formuliere eine eigene spanische Antwort" : "Rufe das gelernte spanische Schreibmuster ab"
  };
  return labels[exercise?.type] || "Wende das gelernte Muster an";
}

function germanExerciseInstruction(exercise, quiet = false) {
  if (quiet && exercise?.type === "LISTENING_DICTATION") return "Stille Ersatzaufgabe: Rekonstruiere den bekannten spanischen Zielsatz aus seiner Bedeutung. Die echte Hörprüfung kehrt im Zuhause-Modus zurück.";
  if (String(exercise?.answerGoal || "").startsWith("sound_")) return "Achte zuerst auf den Ziellaut oder die Betonung. Rufe anschließend das vollständige spanische Wort beziehungsweise die Sinngruppe ab.";
  if (exercise?.type === "SENTENCE_BUILDER") return "Tippe die Wortbausteine in einer natürlichen spanischen Reihenfolge an.";
  if (exercise?.type === "MULTIPLE_CHOICE") return "Entscheide nach Bedeutung und Satzmuster, nicht nur nach einem bekannten Einzelwort.";
  if (exercise?.type === "TRANSLATION") return "Erinnere dich zuerst an den stabilen spanischen Satzrahmen und ergänze dann das passende Detail.";
  if (["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"].includes(exercise?.type) && exercise?.functionalGoals?.groups?.length) return "Erfülle die sichtbaren Gesprächs- oder Schreibfunktionen. Du darfst dafür eine eigene natürliche spanische Formulierung verwenden.";
  if (["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"].includes(exercise?.type)) return "Diese Abrufaufgabe prüft den zuvor gelernten spanischen Modellsatz. Natürliche Varianten werden nur dann frei bewertet, wenn Funktionsziele sichtbar sind.";
  return "Löse die Aufgabe zunächst selbst. Verwende die Hilfestufen, sobald du merkst, dass das Muster noch nicht sicher ist.";
}

function localizedExercisePrompt(exercise, nativeLanguage = "de") {
  if (nativeLanguage === "de") return germanExercisePrompt(exercise);
  const openType = ["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"].includes(exercise?.type);
  if (openType && !exercise?.functionalGoals?.groups?.length) return "Retrieve the learned Spanish model";
  return exercise?.prompt || "Use the learned Spanish pattern";
}

function localizedExerciseInstruction(exercise, nativeLanguage = "de", quiet = false) {
  if (nativeLanguage === "de") return germanExerciseInstruction(exercise, quiet);
  if (quiet && exercise?.type === "LISTENING_DICTATION") return "Silent alternative: reconstruct the known Spanish target from meaning. Listening returns in home mode.";
  const openType = ["SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"].includes(exercise?.type);
  if (openType && exercise?.functionalGoals?.groups?.length) return "Complete the visible communication functions in your own natural Spanish wording.";
  if (openType) return "Retrieve the specific Spanish model taught earlier. Open variants are used only when function goals are visible.";
  return exercise?.instruction || "Solve the task from the learned meaning and pattern.";
}

function germanFeedbackMessage(feedback) {
  if (feedback?.status === "ACCEPTED_FUNCTIONAL_VARIANT") {
    const matched = feedback.functionalCheck?.matchedCount || feedback.evaluation?.functionalCheck?.matchedCount || 0;
    const required = feedback.functionalCheck?.minimumMatched || feedback.evaluation?.functionalCheck?.minimumMatched || 0;
    return `Richtig – deine eigene Formulierung erfüllt ${matched} von ${required} benötigten Gesprächs- oder Schreibfunktionen.`;
  }
  if (feedback?.status === "ACCEPTED_GRAMMATICAL_VARIANT") {
    return "Richtig – im Spanischen darf das Subjektpronomen hier entfallen, weil Verbform und Kontext die Person bereits zeigen.";
  }
  if (feedback?.status === "ACCEPTED_ALTERNATIVE") return "Richtig – das ist eine gültige natürliche Alternative zum Modellsatz.";
  const messages = {
    accent: "Die Bedeutung stimmt. Prüfe jetzt noch den Akzent im Modell.",
    gender_article: "Prüfe Geschlecht und Artikel des Nomens.",
    missing_required_article: "Das Wort stimmt, aber der notwendige Artikel fehlt.",
    ser_estar: "Prüfe noch einmal: Identität/Herkunft oder Zustand/Ort?",
    verb_conjugation: "Das Verb passt, aber die Form muss zur handelnden Person passen.",
    word_order: "Die richtigen Bausteine sind vorhanden, aber ihre Reihenfolge stimmt noch nicht.",
    vocabulary: "Prüfe Bedeutung und Satzrahmen anhand des Modells."
  };
  const functionalCheck = feedback?.functionalCheck || feedback?.evaluation?.functionalCheck;
  if (!feedback?.correct && functionalCheck?.missing?.length) {
    const missing = functionalCheck.missing.map((group) => group.labelDe).filter(Boolean).slice(0, 3);
    if (missing.length) return `Deine Formulierung ist möglich, aber diese Funktion fehlt noch: ${missing.join(" · ")}.`;
  }
  return messages[feedback?.errorCategory] || (feedback?.correct ? "Richtig – das Muster wurde sicher abgerufen." : "Vergleiche deine Antwort bewusst mit dem Modell und achte auf den ersten Unterschied.");
}

function germanReviewMessage(feedback, now = new Date()) {
  if (!feedback?.correct) return "Unsicheres Muster: Es wird nach einer kurzen Lernpause erneut abgefragt.";
  const supportNote = feedback?.status === "CORRECT_WITH_ACCENT_WARNING" || feedback?.review?.orthographyWarning
    ? "Inhaltlich selbstständig richtig; die Schreibweise braucht noch einen Akzent. Dieser Abruf kommt deshalb bewusst früher zurück. "
    : feedback?.review?.correctionAttempt
    ? "Nach einem Fehlversuch richtig korrigiert: Der nächste Abruf kommt bewusst früher. "
    : feedback?.review?.usedSupport
      ? "Mit Hilfe richtig gelöst: Der nächste Abruf kommt bewusst früher. "
      : "Selbstständig abgerufen. ";
  const dueAt = feedback?.review?.dueAt ? new Date(feedback.review.dueAt) : null;
  if (!dueAt || Number.isNaN(dueAt.getTime())) return `${supportNote}Für eine spätere aktive Wiederholung gespeichert.`;
  const hours = Math.max(0, (dueAt.getTime() - now.getTime()) / 3600000);
  if (hours < 1) return `${supportNote}Kurzer Lernschritt: Die Aufgabe kommt in wenigen Minuten zurück.`;
  if (hours < 12) return `${supportNote}Noch heute erneut abrufen, bevor das Muster verblasst.`;
  if (hours < 36) return `${supportNote}Nächster Abruf morgen.`;
  return `${supportNote}Nächster Abruf am ${new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(dueAt)}.`;
}

function correctionFocusMessage(focus, nativeLanguage = "de") {
  if (!focus) return "";
  const german = nativeLanguage === "de";
  if (focus.kind === "accent") {
    return german
      ? `Akzentstelle: Schreibe „${focus.expectedToken}“ statt „${focus.submittedToken}“.`
      : `Accent focus: write “${focus.expectedToken}” instead of “${focus.submittedToken}”.`;
  }
  if (focus.kind === "insert") {
    return german
      ? `Fehlendes Wort an Stelle ${focus.position}: Ergänze „${focus.expectedToken}“.`
      : `Missing word at position ${focus.position}: add “${focus.expectedToken}”.`;
  }
  if (focus.kind === "delete") {
    return german
      ? `Zusätzliches Wort: „${focus.submittedToken}“ gehört an dieser Stelle nicht in den Modellsatz.`
      : `Extra word: “${focus.submittedToken}” does not belong here in the model sentence.`;
  }
  return german
    ? `Erster Unterschied an Stelle ${focus.position}: „${focus.expectedToken}“ statt „${focus.submittedToken}“.`
    : `First difference at position ${focus.position}: “${focus.expectedToken}” instead of “${focus.submittedToken}”.`;
}

function CorrectionFocusCard({ focus, nativeLanguage = "de" }) {
  if (!focus) return null;
  const context = [focus.before, focus.expectedToken, focus.after].filter(Boolean).join(" ");
  return (
    <div className="mt-4 rounded-md border border-red-200 bg-white p-3 text-red-900">
      <p className="text-xs font-black uppercase tracking-wide text-red-700">
        {nativeLanguage === "de" ? "Korrigiere zuerst nur diese Stelle" : "Correct this part first"}
      </p>
      <p className="mt-1 text-sm font-bold leading-6">{correctionFocusMessage(focus, nativeLanguage)}</p>
      {context && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-slate-700">
          <span className="mr-2 text-xs font-black uppercase tracking-wide text-slate-500">{nativeLanguage === "de" ? "Modellstelle" : "Model context"}</span>
          {focus.before && <span>{focus.before} </span>}
          {focus.expectedToken && <mark className="rounded bg-honey-100 px-1 font-black text-slate-950">{focus.expectedToken}</mark>}
          {focus.after && <span> {focus.after}</span>}
        </p>
      )}
    </div>
  );
}

function localizedReviewMoment(value, nativeLanguage = "de", now = new Date()) {
  const dueAt = value ? new Date(value) : null;
  if (!dueAt || Number.isNaN(dueAt.getTime())) {
    return nativeLanguage === "de" ? "Der nächste Abruf wird automatisch eingeplant." : "The next retrieval will be scheduled automatically.";
  }
  const hours = Math.max(0, (dueAt.getTime() - now.getTime()) / 3600000);
  if (nativeLanguage === "de") {
    if (hours < 1) return "In wenigen Minuten noch einmal kurz abrufen";
    if (hours < 12) return "Später heute erneut abrufen";
    if (hours < 36) return "Morgen erneut abrufen";
    return `Am ${new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(dueAt)} erneut abrufen`;
  }
  if (hours < 1) return "Retrieve again in a few minutes";
  if (hours < 12) return "Retrieve again later today";
  if (hours < 36) return "Retrieve again tomorrow";
  return `Retrieve again on ${new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(dueAt)}`;
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

function lessonSentenceImageKey(lesson, sentence) {
  const english = normalizeText(sentence?.english);
  const spanish = normalizeText(sentence?.spanish);
  const matchingExercise = (lesson?.exercises || []).find(
    (exercise) => exercise.imageKey && english && normalizeText(exercise.questionText) === english
  );
  if (matchingExercise) return matchingExercise.imageKey;

  const words = (lesson?.vocabularyGroups || []).flatMap((group) => group.words || []);
  const matchingWord = words.find(
    (word) =>
      word.imageKey &&
      spanish &&
      (normalizeText(word.spanish) === spanish || normalizeText(word.example) === spanish)
  );
  return matchingWord?.imageKey || null;
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
  { key: "typing", label: "Type" },
  { key: "context", label: "Sentence gap" }
];

const germanWordGroupTitles = {
  "pharmacy-and-medicine": "Apotheke und Medizin",
  "object-location-scenes": "Genaue Ortsangaben",
  "wants-needs-and-possession": "Wünsche, Bedürfnisse und Besitz",
  "classroom-basics": "Grundwortschatz im Unterricht",
  "daily-actions": "Alltägliche Tätigkeiten",
  "places-around-town": "Orte in der Stadt",
  "food-and-ordering": "Essen und Bestellen",
  "fruit-and-produce": "Obst und Lebensmittel",
  "clothing-basics": "Kleidung",
  "home-objects": "Gegenstände zu Hause",
  "home-and-objects": "Gegenstände zu Hause",
  "city-transport": "Verkehrsmittel in der Stadt",
  "weather-and-time": "Wetter und Zeit",
  "body-and-health": "Körper und Gesundheit",
  "numbers-and-colors": "Zahlen und Farben",
  "nature-and-animals": "Natur und Tiere",
  "people-and-family": "Menschen und Familie",
  "people-and-pronouns": "Menschen und Pronomen",
  "identity-and-introductions": "Identität und Vorstellen",
  "emotions-and-states": "Gefühle und Zustände",
  "grammar-scenes": "Grammatik im Kontext",
  "travel-and-survival": "Reisen und Verständigung",
  "rewards-and-progress": "Fortschritt und Belohnungen",
  "minigame-ui-rewards": "Minispiele und Belohnungen",
  "a2-daily-routine": "A2 · Tagesablauf",
  "a2-irregular-verbs": "A2 · Unregelmäßige Verben",
  "a2-preferences-hobbies": "A2 · Vorlieben und Hobbys",
  "a2-reading-listening-lab": "A2 · Lese- und Hörtraining",
  "a2-scenario-survival": "A2 · Alltagssituationen meistern",
  "b1-conversation-stories": "B1 · Gespräch und Geschichten",
  "b1-plans-reactions": "B1 · Pläne und Reaktionen",
  "b2-discourse-reporting": "B2 · Diskurs und Bericht",
  "b2-complex-structures": "B2 · Komplexe Strukturen",
  "c1-register-argument": "C1 · Register und Argumentation",
  "c1-narrative-interaction": "C1 · Erzählen und Interaktion",
  "c2-precision-mediation-vocabulary": "C2 · Präzision und Mediation",
  "c2-rhetoric-variation-vocabulary": "C2 · Rhetorik und Sprachvariation",
  "irregular-verbs": "A2 · Unregelmäßige Verben",
  "preferences-and-hobbies": "A2 · Vorlieben und Hobbys",
  "object-pronouns-and-shopping": "A2 · Objektpronomen und Einkaufen",
  "past-events": "A2 · Vergangene Ereignisse",
  "conversation-and-opinion": "B1 · Gespräch und Meinung",
  "reading-and-listening-lab": "Lese- und Hörtraining",
  "essential-words": "Unverzichtbare Wörter",
  "useful-phrases": "Nützliche Wendungen",
  "audio-lab-saved": "Gespeicherte Aussprachewörter"
};

function localizedWordGroupTitle(group, nativeLanguage = "de") {
  if (nativeLanguage !== "de") return group?.title || "Words";
  return germanWordGroupTitles[group?.slug] || "Wortschatz";
}

function localizedWordGrammar(value, nativeLanguage = "de") {
  if (nativeLanguage !== "de") return value || "";
  const labels = {
    noun: "Nomen",
    verb: "Verb",
    adjective: "Adjektiv",
    adverb: "Adverb",
    pronoun: "Pronomen",
    preposition: "Präposition",
    conjunction: "Konjunktion",
    phrase: "Ausdruck",
    sentence: "Satz",
    masculine: "maskulin",
    feminine: "feminin",
    neutral: "neutral"
  };
  return labels[String(value || "").toLowerCase()] || "";
}

function localizedReviewState(value, nativeLanguage = "de") {
  if (nativeLanguage !== "de") return value || "";
  return ({ NEW: "Neu", LEARNING: "Im Aufbau", REVIEW: "Wiederholen", MASTERED: "Sicher" })[value] || "Im Aufbau";
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

const topicTeachingCards = {
  ...supplementalTopicTeachingCards,
  "sound-five-vowels": [
    {
      title: "Give every vowel one clear target",
      body: "Spanish a, e, i, o, and u are short, stable anchors. Keep the vowel recognizable even when its syllable is not stressed.",
      example: "casa · mesa · piso · poco · luna",
      pitfall: "Do not turn e or o into a German-style glide, and do not reduce an unstressed vowel to an indistinct sound."
    },
    {
      title: "Read before you imitate speed",
      body: "First produce each syllable clearly; natural speed comes from connecting clear syllables, not from swallowing them.",
      example: "A-na to-ma ca-fé.",
      pitfall: "Speaking faster before the vowel targets are stable makes both listening and self-correction harder."
    }
  ],
  "sound-consonant-map": [
    {
      title: "Let the following vowel choose the sound",
      body: "C and g change before e or i. Qu protects a k sound, while gu protects a hard g in spellings such as guitarra.",
      example: "casa · Cecilia · queso · gente · guitarra",
      pitfall: "Do not assign one sound to c or g without looking at the next letter."
    },
    {
      title: "Treat h and ñ as Spanish rules",
      body: "Written h is silent. Ñ represents its own sound and must not be flattened into an ordinary n.",
      example: "hola · ahora · niño · mañana",
      pitfall: "A German or English h sound changes the Spanish word; ignoring the tilde changes ñ into n."
    },
    {
      title: "Understand both major c/z realizations",
      body: "Before e or i, c and written z are s-like in most of Latin America and th-like in much of Spain. Both established systems are correct.",
      example: "cinco · zapato · Cecilia",
      pitfall: "Choose a consistent model for your own speech, but never mark the other established regional realization as defective."
    }
  ],
  "sound-key-contrasts": [
    {
      title: "Protect the meaning contrast between r and rr",
      body: "A single r between vowels and the strong sound written rr can distinguish words. At the beginning of a word, r is also strong.",
      example: "pero · perro · caro · carro · rojo",
      pitfall: "A learner accent is fine, but collapsing pero and perro can remove a meaning distinction."
    },
    {
      title: "Do not invent a b–v contrast",
      body: "Spanish b and v normally belong to the same sound pattern; their exact realization changes with position, not with the written letter.",
      example: "bebo vino · vivir · trabajo",
      pitfall: "Pronouncing every v like a distinct German or English v does not reflect the usual Spanish system."
    },
    {
      title: "Expect regional ll and y variation",
      body: "Many speakers pronounce ll and y alike, while other established varieties use different regional sounds. Learn to understand the range.",
      example: "yo · llamar · lluvia · Yolanda",
      pitfall: "Do not confuse regional variation with an individual mistake."
    }
  ],
  "sound-stress-accents": [
    {
      title: "Predict stress from the word ending",
      body: "Without a written accent, words ending in a vowel, n, or s normally stress the next-to-last syllable; other endings normally stress the last.",
      example: "CA-sa · jo-VE-nes · ho-TEL",
      pitfall: "Count syllables from the end instead of copying the stress of a similar-looking German word."
    },
    {
      title: "Let the written accent override the default",
      body: "An accent mark identifies the stressed vowel when the default rule would predict something else and can also distinguish meanings.",
      example: "canción · médico · terminó · sí",
      pitfall: "An accent mark is not decoration; omitting it can hide stress or change the written meaning."
    },
    {
      title: "Keep accents on direct question words",
      body: "Qué, quién, dónde, cuándo, cómo, and cuánto carry an accent in direct and indirect questions.",
      example: "¿Dónde está? · No sé cuándo llega.",
      pitfall: "Opening question marks and word accents solve different jobs; a correct question may require both."
    }
  ],
  "sound-rhythm-intonation": [
    {
      title: "Group words by meaning",
      body: "Spanish rhythm becomes manageable when a thought is divided into short meaning groups rather than isolated words.",
      example: "No entiendo / ¿puede repetirlo?",
      pitfall: "A pause after every word makes a correct sentence difficult to follow."
    },
    {
      title: "Connect vowels and consonants across spaces",
      body: "Word boundaries do not require new sounds. Keep the syllable flow smooth while preserving every vowel target.",
      example: "quiero_ir · voy_a · el_amigo",
      pitfall: "Do not insert a German glottal restart before every vowel-initial word."
    },
    {
      title: "Use melody and stress to show intention",
      body: "Question melody, final movement, and contrastive stress help listeners hear whether you ask, state, correct, or contrast.",
      example: "¿Vienes? · Hoy NO, pero mañana SÍ.",
      pitfall: "Correct words with flat or misplaced emphasis can hide the intended contrast."
    }
  ],
  "sound-foundation-checkpoint": [
    {
      title: "Decode before guessing",
      body: "Use vowel anchors, the following-letter rule, silent h, ñ, qu, and gu to turn unfamiliar spelling into a plausible sound form.",
      example: "gente · guitarra · queso · niño",
      pitfall: "Do not pronounce an unfamiliar Spanish word by applying German spelling rules wholesale."
    },
    {
      title: "Preserve stress and meaning contrasts",
      body: "Check written accents and protect contrasts such as r versus rr while accepting non-contrastive and regional variation.",
      example: "canción · pero/perro · b/v · ll/y",
      pitfall: "Spend effort on distinctions that can change recognition or meaning, not on imitating one prestigious accent."
    },
    {
      title: "Move from accurate syllables to a complete thought",
      body: "Connect clear syllables into meaning groups and use intonation to make questions, repair, and contrast audible.",
      example: "No entiendo / ¿puede repetirlo más despacio?",
      pitfall: "Natural rhythm grows from clarity and grouping, not from rushing."
    }
  ],
  "absolute-basics": [
    {
      title: "Start with small sentence pieces",
      body: "Build the sentence around one clear verb form first, then add the person or place.",
      example: "Yo soy Ana. Estoy en casa.",
      pitfall: "Do not translate word by word before you know which verb is carrying the meaning."
    },
    {
      title: "Subject words are often optional",
      body: "Yo, tú, él, and ella are useful for learning, but the verb ending often already shows the person.",
      example: "Soy Ana.",
      pitfall: "Keep yo and tú while learning, but expect real Spanish to drop them often."
    }
  ],
  "ser-estar": [
    {
      title: "Ser identifies",
      body: "Use ser when the sentence says what someone or something is: identity, role, origin, or a normal trait.",
      example: "Soy estudiante. Ella es profesora.",
      pitfall: "Origin uses ser: soy de Austria, not estoy de Austria."
    },
    {
      title: "Estar locates or describes a current state",
      body: "Use estar for where something is and how someone is right now.",
      example: "Estoy en casa. Ella está cansada.",
      pitfall: "Location usually uses estar even when the place feels permanent."
    },
    {
      title: "English is not enough to choose",
      body: "Es and está can both translate to is in English. Choose from the meaning: identity or role uses ser; a current state or location uses estar.",
      example: "Ana es profesora. / Ana está cansada.",
      pitfall: "Do not translate is by itself. First ask: what is being said about Ana?"
    },
    {
      title: "Choose the verb, then the person form",
      body: "After choosing ser or estar, match the form to the subject. For yo use soy or estoy; for one named person use es or está.",
      example: "Yo soy estudiante. Yo estoy en casa. Ana es profesora. Ana está en casa.",
      pitfall: "A correct verb family still needs the right form: Ana está, not Ana estoy."
    }
  ],
  "articles-gender": [
    {
      title: "Learn nouns with their article",
      body: "Spanish nouns have grammatical gender. Treat the article as part of the word while learning.",
      example: "el libro, la silla, un café, una manzana",
      pitfall: "Do not memorize libro alone; memorize el libro."
    },
    {
      title: "Articles agree with the noun",
      body: "The article must match the noun in gender and number.",
      example: "el pan, la sopa",
      pitfall: "English has one the; Spanish forces you to choose el, la, los, or las."
    }
  ],
  "present-tense-ar": [
    {
      title: "Regular -ar verbs follow a pattern",
      body: "Remove -ar, then add the ending that matches the person.",
      example: "hablar: yo hablo, tú hablas, nosotros hablamos",
      pitfall: "Do not keep the -ar ending after conjugating: yo hablar is not the present-tense sentence."
    },
    {
      title: "The ending carries meaning",
      body: "Spanish verb endings often tell you who is doing the action, so endings are meaning, not decoration.",
      example: "Yo hablo. Tú hablas.",
      pitfall: "One wrong ending can change who is doing the action."
    }
  ],
  "estar-emotions": [
    {
      title: "Feelings use estar",
      body: "Use estar for feelings, health, and conditions that describe the current state.",
      example: "Estoy feliz. Ana está nerviosa.",
      pitfall: "Do not use soy for a temporary feeling unless you mean a permanent identity trait."
    },
    {
      title: "Adjectives can agree",
      body: "Many adjectives change form to match the person or thing they describe.",
      example: "cansado, cansada, nervioso, nerviosa",
      pitfall: "Match the person: Ana está cansada, not Ana está cansado."
    }
  ],
  "ordering-food": [
    {
      title: "Quiero is a direct request",
      body: "Quiero plus a noun is a direct, usable request. Add por favor to soften it.",
      example: "Quiero un café, por favor.",
      pitfall: "For a service setting, quisiera is more polite, but quiero is still understandable."
    },
    {
      title: "Countable items often need un or una",
      body: "Use un or una when asking for one countable item.",
      example: "un café, una manzana",
      pitfall: "The article still has to match the noun: un café, una sopa."
    }
  ],
  "travel-questions": [
    {
      title: "Dónde asks for location",
      body: "Use dónde with está when asking where a place or object is.",
      example: "¿Dónde está el hotel?",
      pitfall: "Use está for the place location; do not switch to es here."
    },
    {
      title: "Survival phrases should stay short",
      body: "In travel situations, short correct phrases are more useful than long sentences.",
      example: "Necesito ayuda. Tengo un mapa.",
      pitfall: "If you are stuck, use a repair phrase first: No entiendo. Más despacio, por favor."
    }
  ],
  "location-prepositions": [
    {
      title: "Location uses estar",
      body: "Use estar to place people and objects in a location.",
      example: "El libro está en la mesa.",
      pitfall: "Do not use es for location in these beginner sentences."
    },
    {
      title: "En covers many location meanings",
      body: "En can mean in, on, or at depending on context.",
      example: "en casa, en la mesa, en la biblioteca",
      pitfall: "English changes prepositions often; Spanish en covers many of those cases."
    }
  ],
  "plural-agreement": [
    {
      title: "Plural changes more than one word",
      body: "Articles, nouns, adjectives, and verbs can all show plural meaning.",
      example: "Las manzanas son rojas.",
      pitfall: "Do not pluralize only the noun and leave the article singular."
    },
    {
      title: "Los can be mixed plural",
      body: "Los is used for masculine plural groups and for mixed groups.",
      example: "Los estudiantes hablan.",
      pitfall: "A mixed group uses los, even if only one person in the group is masculine."
    }
  ],
  "negation-basics": [
    {
      title: "No goes before the verb",
      body: "The basic negative pattern is simple: put no directly before the conjugated verb.",
      example: "No entiendo. Ella no trabaja hoy.",
      pitfall: "Do not add an English-style helper verb. Spanish does not need do not here."
    }
  ],
  "tener-necesitar": [
    {
      title: "Tener does more than have",
      body: "Tener means to have, but Spanish also uses it for some body states.",
      example: "Tengo un mapa. Tengo hambre.",
      pitfall: "Spanish says tengo hambre and tengo frío, not soy hambre or estoy frío for these states."
    },
    {
      title: "Necesito is practical",
      body: "Necesito plus a noun gives you a direct way to ask for help or objects.",
      example: "Necesito ayuda. Necesito el pasaporte.",
      pitfall: "Use necesito plus the thing; do not add para unless you are explaining purpose."
    }
  ],
  "question-words": [
    {
      title: "Question words carry accents",
      body: "Qué, quién, dónde, cuándo, cómo, and cuánto use accents in direct questions.",
      example: "¿Qué quieres? ¿Cuánto cuesta?",
      pitfall: "The accent is part of the question word in direct questions."
    },
    {
      title: "Question frames are reusable",
      body: "Keep the frame and swap the noun or place to make new questions.",
      example: "¿Dónde está el hotel? ¿Dónde está la estación?",
      pitfall: "Change only the noun until the frame feels automatic."
    }
  ],
  "daily-routine-time": [
    {
      title: "Some routine verbs are reflexive",
      body: "Use me with actions you do to yourself in the yo form. The me is part of the meaning.",
      example: "Me despierto. Me levanto. Me ducho.",
      pitfall: "Do not drop me from reflexive routine verbs in the yo form."
    },
    {
      title: "Not every routine verb needs me",
      body: "Normal action verbs like desayunar, estudiar, trabajar, cocinar, and leer do not use me in basic routine sentences.",
      example: "Desayuno a las ocho. Estudio por la tarde.",
      pitfall: "Do not add me to normal action verbs just because they are part of a routine."
    },
    {
      title: "Time phrases usually follow the action",
      body: "Use por la mañana, por la tarde, por la noche, and cada semana to place habits in time.",
      example: "Trabajo por la mañana. Limpio cada semana.",
      pitfall: "Learn time chunks as phrases; por la mañana is not translated word by word."
    }
  ],
  "irregular-present-frames": [
    {
      title: "Common verbs often have irregular yo forms",
      body: "The most useful verbs do not always follow the regular pattern in the yo form, so learn them as complete chunks.",
      example: "voy, hago, digo, vengo, salgo, pongo",
      pitfall: "Do not force regular endings onto high-frequency irregular verbs."
    },
    {
      title: "Frames take an infinitive after them",
      body: "Use the unchanged verb after puedo, quiero, necesito, and tengo que.",
      example: "Puedo estudiar. Quiero ir. Tengo que trabajar.",
      pitfall: "After puedo or quiero, the next verb stays in the infinitive."
    },
    {
      title: "Voy a makes a near-future plan",
      body: "Use voy a plus an infinitive for something you are going to do.",
      example: "Voy a estudiar mañana.",
      pitfall: "The a is required in this pattern: voy a estudiar."
    }
  ],
  "likes-preferences": [
    {
      title: "Gustar works from the liked thing",
      body: "Use gusta with one thing or an activity, and gustan with plural things.",
      example: "Me gusta el café. Me gustan las películas.",
      pitfall: "Do not conjugate gustar to match yo here; the liked thing controls gusta/gustan."
    },
    {
      title: "No goes before me gusta",
      body: "Make a dislike by placing no before the whole me gusta pattern.",
      example: "No me gusta la lluvia.",
      pitfall: "Keep no before me, not after gusta."
    },
    {
      title: "Preferir has the yo form prefiero",
      body: "Use prefiero when choosing one option over another.",
      example: "Me gusta el café, pero prefiero el té.",
      pitfall: "Preferir is stem-changing: yo prefiero, not yo prefero."
    }
  ],
  "scenario-practice": [
    {
      title: "Scenarios use short useful replies",
      body: "In service and travel contexts, a clear phrase is better than an overly long sentence.",
      example: "La cuenta, por favor. Perdón, ¿dónde está la estación?",
      pitfall: "Do not try to say everything at once; finish the immediate task first."
    },
    {
      title: "Polite requests use quisiera",
      body: "Quisiera is useful when ordering or asking for something in a restaurant, shop, or pharmacy.",
      example: "Quisiera dos cafés para llevar.",
      pitfall: "Quiero is understandable, but quisiera sounds more polite in service situations."
    }
  ],
  "input-comprehension": [
    {
      title: "Read or listen for the main action first",
      body: "Identify who acts, what they do, and when it happens before focusing on every word.",
      example: "Ana trabaja por la mañana.",
      pitfall: "Do not pause on every unknown word before you know the main idea."
    },
    {
      title: "Use the transcript as a check",
      body: "Try the audio first, then reveal the transcript to compare what you heard with the real sentence.",
      example: "Mañana voy a la tienda.",
      pitfall: "Read the transcript after listening, not before, when you want listening practice."
    }
  ],
  "personal-a-foundation": [
    {
      title: "Identify the direct object before adding a",
      body: "Ask what or whom the verb acts on. If that direct object is a specific or identified person, Spanish normally places personal a before it.",
      example: "Veo a Marta. · Conozco a tus padres.",
      pitfall: "Personal a marks the identified human object; it does not mean that the person is receiving something."
    },
    {
      title: "Contrast a person with a thing",
      body: "Things do not receive personal a. Compare the same verb with a known person and with an ordinary thing.",
      example: "Veo a Marta. · Veo el libro.",
      pitfall: "Do not put a before every direct object just because German sometimes uses a preposition elsewhere."
    },
    {
      title: "Check whether the person is identified",
      body: "An unspecified person can appear without personal a when any suitable person would satisfy the meaning; an identified person receives it.",
      example: "Busco un médico. · Busco al médico de Ana.",
      pitfall: "The article alone does not decide the rule; specificity and intended identification do."
    },
    {
      title: "Learn the early boundaries with tener and hay",
      body: "Tener and hay normally omit personal a in basic possession, relationship, and existence statements.",
      example: "Tengo dos hermanos. · Hay una médica aquí.",
      pitfall: "Do not turn the rule into a mechanical a before every word that names a person."
    }
  ],
  "object-pronouns-shopping": [
    {
      title: "Replace a known object",
      body: "Use lo, la, los, or las when the listener already knows which direct object you mean. The pronoun agrees with that object.",
      example: "Compro el pan. Lo compro. / Quiero las manzanas. Las quiero.",
      pitfall: "Choose from the object being replaced, not from the gender of the speaker."
    },
    {
      title: "Put the pronoun before a conjugated verb",
      body: "In these beginner present-tense patterns, place the object pronoun immediately before the conjugated verb.",
      example: "Lo veo. La compro. Los necesito. Las quiero.",
      pitfall: "Do not copy English word order by placing it after the conjugated verb."
    },
    {
      title: "Le marks the receiver",
      body: "Use le for the person who receives a thing, message, explanation, or service.",
      example: "Le doy el libro. Le envío un mensaje.",
      pitfall: "Le replaces the receiver; lo or la replaces the direct object itself."
    }
  ],
  "participant-object-pronouns": [
    {
      title: "Start from the conversation roles",
      body: "Me points back to the speaker, te to one familiar conversation partner, and nos to a group that includes the speaker.",
      example: "Marta me ve. · Te llamo. · Ana nos ayuda.",
      pitfall: "Do not choose these forms from grammatical gender; they identify conversation participants."
    },
    {
      title: "Recognize a directly affected person",
      body: "With verbs such as ver, llamar, and ayudar, me, te, or nos can replace the person directly affected by the action.",
      example: "Marta me ve. · Te llamo esta tarde. · Ana nos ayuda.",
      pitfall: "Do not add lo or la when me, te, or nos already replaces the direct object."
    },
    {
      title: "Separate the receiver from the thing",
      body: "With giving, sending, or telling, me, te, or nos can mark the receiver while the thing or information remains visible.",
      example: "Me da el menú. · Te envío la dirección.",
      pitfall: "The person and the thing have different roles even when German translates them with different case forms."
    },
    {
      title: "Place the pronoun before the conjugated verb",
      body: "In these A2 present-tense patterns, put me, te, or nos immediately before the conjugated verb.",
      example: "Me ve. · Te llamo. · Nos ayuda.",
      pitfall: "Do not copy German word order by moving the short pronoun behind the conjugated verb."
    }
  ],
  "past-events-foundation": [
    {
      title: "Completed events use the preterite",
      body: "Use the preterite when you present an action as completed and bounded in past time.",
      example: "Ayer trabajé. Ana habló. Comieron en casa.",
      pitfall: "A past-time word helps, but the intended event shape still determines the tense."
    },
    {
      title: "Background and habits use the imperfect",
      body: "Use the imperfect for an ongoing past state, repeated habit, description, or scene behind another event.",
      example: "Vivía en Madrid. Siempre caminaba. Hacía frío.",
      pitfall: "Do not treat every past sentence as one completed event."
    },
    {
      title: "Stories combine both viewpoints",
      body: "The imperfect sets the scene; the preterite moves the event sequence forward.",
      example: "Estaba en casa cuando llamó Ana.",
      pitfall: "Choose from the role in the story, not by translating the German past form mechanically."
    }
  ],
  "opinions-connected-production": [
    {
      title: "Frame a view before supporting it",
      body: "Use creo que, pienso que, para mí, or en mi opinión to make the status of your statement clear.",
      example: "Creo que esta opción es mejor.",
      pitfall: "Do not stack disconnected facts; make your position visible first."
    },
    {
      title: "Connect each idea by function",
      body: "Use porque for a reason, además for another point, aunque or sin embargo for contrast, and por eso for a consequence.",
      example: "Es práctico porque ahorro tiempo. Sin embargo, necesito más conversación.",
      pitfall: "Choose the connector from the logical relationship, not because it sounds advanced."
    },
    {
      title: "Interaction comes before winning",
      body: "Acknowledge the other view before disagreeing and support recommendations with criteria.",
      example: "Entiendo tu punto, pero lo veo de otra manera.",
      pitfall: "A bare no ends the exchange; acknowledgment plus contrast keeps it productive."
    }
  ],
  "stories-comprehension": [
    {
      title: "Find the event spine first",
      body: "Identify the central person, event, change, and result before resolving every detail.",
      example: "Ana perdió el autobús, así que llegó tarde.",
      pitfall: "Unknown details do not prevent comprehension when the event structure is clear."
    },
    {
      title: "Connect events and information",
      body: "Sequence words organize time, que attaches relevant information, and dice que identifies reported content.",
      example: "Luego llamó a Marta y le dijo que llegaría tarde.",
      pitfall: "Treat connectors as instructions for the relationship between ideas."
    },
    {
      title: "Keep inference separate from fact",
      body: "Combine contextual clues to form a likely interpretation, but mark uncertainty with probablemente or quizá.",
      example: "El abrigo está mojado, así que probablemente llueve.",
      pitfall: "A plausible inference is not the same as information stated directly."
    }
  ],
  "future-real-conditions": [
    {
      title: "Choose the future from its function",
      body: "Use the present for schedules, ir a for a current intention, and the simple future for predictions or more distant plans.",
      example: "La reunión empieza a las nueve. Voy a llamar. Viajaré más.",
      pitfall: "Do not force every future meaning into one grammatical form."
    },
    {
      title: "Build the future from the infinitive",
      body: "Regular verbs keep the complete infinitive and share one set of endings; common irregular verbs change only the stem.",
      example: "hablaré · comeremos · vivirán · tendré · podremos",
      pitfall: "Future endings attach to the whole infinitive, not to a present-tense stem."
    },
    {
      title: "Real si clauses use a real present condition",
      body: "Use present tense after si for a realistic condition, then use a present, future, intention, or command result.",
      example: "Si llueve, me quedaré en casa. Si tienes tiempo, llámame.",
      pitfall: "Do not put the simple future directly after si in this real-condition pattern."
    }
  ],
  "present-subjunctive-meaning": [
    {
      title: "Learn the frame, not an isolated tense",
      body: "A wish, influence, judgment, emotion, or doubt frames another subject's action after que.",
      example: "Quiero que vengas. Me alegra que estés aquí.",
      pitfall: "The subjunctive does not simply mean uncertain; the complete relationship between both clauses matters."
    },
    {
      title: "Form the present subjunctive from the yo form",
      body: "Remove the final -o and add the opposite-vowel endings: -ar verbs use e; -er and -ir verbs use a.",
      example: "hablo → hable · como → coma · vivo → viva",
      pitfall: "Spelling changes may preserve pronunciation, as in llegues and busques."
    },
    {
      title: "Contrast framed action with accepted information",
      body: "A wish or negated belief often uses the subjunctive, while a positive statement of belief or fact uses the indicative.",
      example: "No creo que trabaje. / Creo que trabaja.",
      pitfall: "Choose mood from what the speaker is doing with the information, not from German dass alone."
    }
  ],
  "perfect-past-connections": [
    {
      title: "Choose a reference period before a tense",
      body: "The present perfect views an event inside a period connected to now; the preterite places it in a closed past period.",
      example: "Hoy he trabajado. / Ayer trabajé.",
      pitfall: "Regional Spanish differs: recent events often use the preterite in Latin America. Learn to understand both choices."
    },
    {
      title: "Keep haber and the participle together",
      body: "Conjugate haber for the subject and keep the participle unchanged: he hablado, hemos comido, han vivido.",
      example: "Las cartas han llegado.",
      pitfall: "A participle used with haber does not agree with the subject or object."
    },
    {
      title: "Move the reference point into the past",
      body: "Use había plus participle when one event was already complete before another past event or state.",
      example: "Cuando llegué, Ana ya había salido.",
      pitfall: "The past perfect is not simply an older-sounding past; it establishes past-before-past order."
    }
  ],
  "conditional-hypotheses": [
    {
      title: "Use the conditional to open distance",
      body: "The conditional presents an imagined result and can soften wishes, requests, advice, and evaluations.",
      example: "Me gustaría aprender más. ¿Podrías ayudarme?",
      pitfall: "The conditional does not always require an explicit si clause."
    },
    {
      title: "Reuse the future stem with new endings",
      body: "Regular forms keep the infinitive; irregular verbs reuse future stems such as tendr-, podr-, vendr-, har-, and dir-.",
      example: "hablaría · viviríamos · tendría · podrías",
      pitfall: "All conditional endings carry a written accent on í."
    },
    {
      title: "Keep both sides of a hypothesis distinct",
      body: "After si, use the imperfect subjunctive for the imagined condition; use the conditional for its result.",
      example: "Si tuviera tiempo, viajaría más.",
      pitfall: "Do not put the conditional directly after si in this hypothetical pattern."
    }
  ],
  "commands-combined-pronouns": [
    {
      title: "Choose affirmative or negative before the form",
      body: "Affirmative tú commands often use the third-person present form; negative commands use no plus present subjunctive.",
      example: "Habla más despacio. / No hables tan rápido.",
      pitfall: "An affirmative and a negative tú command do not use the same verb form."
    },
    {
      title: "Let command polarity place the pronoun",
      body: "Attach pronouns to affirmative commands; place them before a negative command.",
      example: "Cómpralo. / No lo compres.",
      pitfall: "Attached pronouns may require a written accent to preserve the original stress."
    },
    {
      title: "Keep recipient before thing",
      body: "Order indirect-object before direct-object pronouns, and change le or les to se before lo, la, los, or las.",
      example: "Le doy el libro. → Se lo doy.",
      pitfall: "Se here replaces le or les; context still identifies the recipient."
    }
  ],
  "por-para-relationships": [
    {
      title: "Let para point forward",
      body: "Para points toward a destination, goal, intended recipient, use, deadline, or viewpoint.",
      example: "Voy para Madrid. Estudio para viajar. Es para Ana.",
      pitfall: "Do not memorize para as one German word; identify what the action points toward."
    },
    {
      title: "Let por explain the path or background",
      body: "Por presents a cause, route, exchange, means, rate, or approximate duration.",
      example: "Por la lluvia. Por el parque. Por teléfono. Dos veces por semana.",
      pitfall: "A reason with por looks back to what motivates or causes the action."
    },
    {
      title: "Contrast relationships inside one sentence",
      body: "The same sentence can use both: por explains cause, route, or exchange while para marks goal, destination, or recipient.",
      example: "Viajo para Barcelona por trabajo.",
      pitfall: "Choose each preposition locally; one does not force the choice of the other."
    }
  ],
  "b2-discourse-connectors": [
    {
      title: "Concede before you contrast",
      body: "A concession acknowledges a fact, obstacle, or other viewpoint before the main claim continues.",
      example: "Aunque entiendo tu postura, no comparto la conclusión.",
      pitfall: "Conceding a point does not mean abandoning your own conclusion."
    },
    {
      title: "Name the relationship between ideas",
      body: "Advanced connectors distinguish reason from consequence and evidence from interpretation.",
      example: "Faltaban datos; por lo tanto, aplazamos la decisión.",
      pitfall: "Do not select connectors only because they sound formal; select the relationship they express."
    },
    {
      title: "Calibrate certainty and structure",
      body: "Limit a claim when evidence is incomplete, then guide the listener through support, qualification, and conclusion.",
      example: "Hasta donde sé, no hay una alternativa mejor. En definitiva, conviene esperar.",
      pitfall: "A nuanced argument needs visible structure, not a long chain of equally weighted sentences."
    }
  ],
  "b2-reported-speech": [
    {
      title: "Anchor the report before shifting forms",
      body: "First identify who reports the message and whether the reporting point is present or past.",
      example: "Marta dice que está cansada. / Marta dijo que estaba cansada.",
      pitfall: "Do not shift every tense automatically; preserve the actual time relationship."
    },
    {
      title: "Place every event relative to the report",
      body: "Use a past perfect for an earlier event and a conditional for an event that was still future from a past reporting point.",
      example: "Dijo que había terminado y que llamaría después.",
      pitfall: "The tense shows earlier, simultaneous, or later time—not merely formal style."
    },
    {
      title: "Rebuild references for the new viewpoint",
      body: "Reported questions use embedded-clause order, while pronouns and words for place and time may need to change.",
      example: "Preguntó dónde estaba y dijo que volvería al día siguiente.",
      pitfall: "A grammatically shifted tense is not enough if mañana, aquí, yo, or tú now point to the wrong reference."
    }
  ],
  "b2-relative-clauses": [
    {
      title: "Start from the antecedent",
      body: "Identify whether the relative expression refers to a person, a named thing, an unnamed idea, or an entire previous event.",
      example: "La mujer que trabaja aquí. / No entendí lo que dijo.",
      pitfall: "Que and lo que are not interchangeable: lo que has no named noun antecedent."
    },
    {
      title: "Preserve the grammatical relationship",
      body: "If the verb requires de, a, con, por, or para, that preposition remains visible before the relative form.",
      example: "El tema del que hablamos. La persona con quien trabajo.",
      pitfall: "Do not drop a preposition merely because the clause has become relative."
    },
    {
      title: "Make possession and circumstance compact",
      body: "Cuyo agrees with the possessed noun; donde, cuando, and como link a clause to place, time, or manner.",
      example: "Una autora cuyos libros admiro. El barrio donde crecí.",
      pitfall: "Cuyo agrees with what is possessed, not with the owner."
    }
  ],
  "b2-se-constructions": [
    {
      title: "Classify the function before translating",
      body: "Se can mark an action toward oneself, between people, by people in general, or toward an affected thing.",
      example: "Ana se prepara. / Los amigos se abrazan. / Aquí se vive bien.",
      pitfall: "Do not assign one fixed translation to se."
    },
    {
      title: "Find what controls agreement",
      body: "In passive se, the affected noun is grammatical subject and controls singular or plural agreement.",
      example: "Se vende una casa. / Se venden dos casas.",
      pitfall: "With personal a in an impersonal construction, the verb remains singular: se entrevistó a tres personas."
    },
    {
      title: "Separate the event from the affected person",
      body: "Accidental se foregrounds what happened; an indirect-object pronoun shows who is affected.",
      example: "Se me cayeron las llaves. / Se nos olvidó la cita.",
      pitfall: "The affected person does not control verb agreement; the keys or appointment do."
    }
  ],
  "b2-past-subjunctive": [
    {
      title: "Derive the form from a form you already know",
      body: "Start from the third-person plural preterite, remove -ron, and add the imperfect-subjunctive ending.",
      example: "hablaron → hablara · tuvieron → tuviera · dijeron → dijera",
      pitfall: "Do not return to the infinitive stem when the preterite is irregular."
    },
    {
      title: "Choose the past framing meaning first",
      body: "A past wish, request, reaction, evaluation, or doubt can frame another event in the imperfect subjunctive.",
      example: "Quería que vinieras. Me sorprendió que nadie respondiera.",
      pitfall: "The subjunctive follows the framing relationship, not merely the presence of a past tense."
    },
    {
      title: "Separate an earlier event from an unreal past",
      body: "Use hubiera plus participle for an earlier framed event; combine it with habría plus participle for a counterfactual result.",
      example: "Si lo hubiera sabido, no habría aceptado.",
      pitfall: "The si clause takes hubiera; the unreal result normally takes habría."
    }
  ],
  "b2-verbal-periphrases": [
    {
      title: "Choose the action phase before the verb frame",
      body: "Spanish verbal periphrases show whether an action has just happened, continues, accumulates duration, or is typical.",
      example: "Acabo de llegar. Sigo estudiando. Llevo dos años aprendiendo.",
      pitfall: "Do not translate each helper verb literally; learn the complete frame and its time meaning."
    },
    {
      title: "Separate continuity from duration",
      body: "Seguir plus gerund says that an action continues; llevar plus duration and gerund measures how long it has continued.",
      example: "Sigo esperando. / Llevo media hora esperando.",
      pitfall: "Llevar needs the accumulated duration when this pattern measures elapsed time."
    },
    {
      title: "Mark changes in the action itself",
      body: "Empezar a, dejar de, volver a, and terminar de identify a beginning, stopping point, repetition, or endpoint.",
      example: "Empecé a trabajar. Dejé de fumar. Volví a intentarlo.",
      pitfall: "The preposition is part of each stable frame and cannot be swapped freely."
    }
  ],
  "b2-reading-inference": [
    {
      title: "Read for the text skeleton first",
      body: "Find the main claim, problem, response, and result before resolving every local detail.",
      example: "Problema → medida → resultado → conclusión",
      pitfall: "Translating every word can hide the relationship that makes the text understandable."
    },
    {
      title: "Keep viewpoints and evidence separate",
      body: "Reporting verbs attribute opinions; dates, measurements, and observed changes often provide evidence.",
      example: "Los empleados afirman… / La prueba mostró…",
      pitfall: "A confidently worded opinion is still not the same as observed evidence."
    },
    {
      title: "Infer only from visible clues",
      body: "Track pronouns and connectors, combine explicit clues, and state no more than the text supports.",
      example: "Había herramientas húmedas; por eso dejó una nota.",
      pitfall: "A plausible guess is not a supported inference unless a clue in the text points to it."
    }
  ],
  "b2-listening-comprehension": [
    {
      title: "Listen once for purpose and gist",
      body: "On the first pass, identify who speaks, why, and what changed before chasing individual words.",
      example: "¿Quién habla? · ¿Por qué? · ¿Qué cambió?",
      pitfall: "Trying to transcribe the first pass overloads attention and can hide the main point."
    },
    {
      title: "Use a second pass for decisive details",
      body: "Then track times, places, contrast, conditions, deadlines, and requested actions.",
      example: "en vez de · no obstante · antes de · si…",
      pitfall: "Not every detail deserves equal attention; prioritize information that changes what you must understand or do."
    },
    {
      title: "Relay meaning before checking the transcript",
      body: "Summarize the message in Spanish from memory, then use the transcript to notice missed forms and sounds.",
      example: "La reunión será más tarde y tengo que confirmar el mensaje.",
      pitfall: "Opening the transcript too early turns listening into reading."
    }
  ]
};

const topicRememberPoints = authoredTopicRememberPoints;

function lessonGuideCards(lesson) {
  const topicSlug = lesson?.topic?.slug || lesson?.topicSlug || "";
  const cards = [...(topicTeachingCards[topicSlug] || [])];
  const sentenceCards = (lesson?.sentences || [])
    .filter((sentence) => sentence?.note && sentence?.spanish)
    .slice(0, 3)
    .map((sentence) => ({
      title: sentence.spanish,
      body: sentence.note,
      example: sentence.spanish
    }));

  // A1–B2 topics have deliberately authored concept cards. Their model
  // sentences are retrieved in the following learning steps and should not
  // inflate the explanation block. C1/C2 use sentence notes as their concept
  // cards because connected input is the teaching material at those levels.
  const candidates = cards.length ? cards : sentenceCards;
  return candidates
    .filter((card) => card.title && card.body)
    .filter((card, index, list) => list.findIndex((item) => normalizeText(`${item.title} ${item.body}`) === normalizeText(`${card.title} ${card.body}`)) === index)
    .slice(0, 5);
}

function lessonRememberPoints(lesson) {
  const topicSlug = lesson?.topic?.slug || lesson?.topicSlug || "";
  const cards = topicTeachingCards[topicSlug] || [];
  const sentenceNotes = (lesson?.sentences || [])
    .map((sentence) => sentence?.note)
    .filter(Boolean);
  const points = [
    ...(topicRememberPoints[topicSlug] || []),
    ...cards.map((card) => card.pitfall).filter(Boolean),
    ...(lesson?.isCheckpoint ? ["A checkpoint is a proof step: answer before looking for the model."] : []),
    ...(lesson?.reviewSummary ? [lesson.reviewSummary] : []),
    ...sentenceNotes
  ];

  return points
    .map((point) => String(point || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((point, index, list) => list.findIndex((item) => normalizeText(item) === normalizeText(point)) === index)
    .slice(0, 6);
}

function LessonRememberBlock({ lesson, title = "Important to Remember", className = "" }) {
  const points = lessonRememberPoints(lesson);
  if (!points.length) return null;

  return (
    <div className={classNames("rounded-lg border border-honey-200 bg-honey-50 p-4", className)}>
      <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-honey-800">
        <Star size={16} /> {title}
      </p>
      <div className="mt-3 grid gap-2">
        {points.map((point) => (
          <p key={point} className="flex items-start gap-2 text-sm font-bold leading-6 text-slate-800">
            <CheckCircle2 className="mt-1 shrink-0 text-honey-700" size={15} /> {point}
          </p>
        ))}
      </div>
    </div>
  );
}

function LessonPracticePreview({ lesson, exercises = [], nativeLanguage = "de", quiet = false, onStart }) {
  const german = nativeLanguage === "de";
  const modelCount = (lesson?.sentences || []).filter((sentence) => sentence?.spanish).length;
  const targets = (exercises || [])
    .filter(Boolean)
    .map((exercise) => ({
      key: exercise.type,
      prompt: exercise.prompt,
      exercise
    }))
    .filter((target) => target.key)
    .filter((target, index, list) => list.findIndex((item) => item.key === target.key) === index)
    .slice(0, 6);
  const transferSteps = german
    ? [
        `${modelCount} ${modelCount === 1 ? "bekanntes Satzmuster erscheint" : "bekannte Satzmuster erscheinen"} jetzt ohne sichtbare Lösung in neuer Reihenfolge.`,
        "Entscheide zuerst nach der Bedeutung und rufe danach den spanischen Rahmen ab.",
        quiet ? "Formuliere innerlich oder tippe. Audio und Mikrofon bleiben vollständig aus." : "Sprich die Antwort nach Möglichkeit laut aus oder nutze das Mikrofon nach eigener Entscheidung."
      ]
    : [
        `${modelCount} familiar sentence ${modelCount === 1 ? "pattern now appears" : "patterns now appear"} without visible answers and in a new order.`,
        "Decide from meaning first, then retrieve the Spanish frame.",
        quiet ? "Rehearse silently or type. Audio and microphone remain off." : "Say the answer aloud when useful, or choose the microphone yourself."
      ];

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">{german ? "Transfer statt Wiederlesen" : "Transfer, not rereading"}</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">{german ? "Jetzt arbeitest du ohne sichtbare Lösung" : "Now work without visible answers"}</h1>
      <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
        {german ? "Du hast Bedeutung, Muster und Beispiele bereits verarbeitet. Eine erneute Modellliste würde nur Vertrautheit erzeugen; die folgende Mischung prüft deshalb, was du wirklich selbst hervorholen kannst." : "You already processed the meanings, patterns, and examples. Another model list would create familiarity, so the following mix checks what you can retrieve yourself."}
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-lg border border-lagoon-100 bg-lagoon-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-lagoon-800">
            <Target size={16} /> {german ? "So gelingt der Transfer" : "How transfer works"}
          </p>
          <div className="mt-3 grid gap-2">
            {transferSteps.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-md border border-lagoon-100 bg-white px-3 py-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lagoon-600 text-xs font-black text-white">{index + 1}</span>
                <p className="text-sm font-bold leading-6 text-slate-800">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-sky-200 bg-white px-3 py-3 text-sm font-bold leading-6 text-sky-900">
            {german ? "Wenn du festhängst, öffne die Hilfestufen nacheinander. Eine Antwort mit Hilfe zählt als Lernschritt und wird früher erneut abgerufen." : "If you get stuck, open help one level at a time. A supported answer counts as learning and returns sooner."}
          </div>
        </div>
        <div className="rounded-lg border border-honey-200 bg-honey-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-honey-800">
            <ListChecks size={16} /> {german ? "Dein Aufgabenmix" : "Your task mix"}
          </p>
          <div className="mt-3 grid gap-2">
            {targets.map((target) => (
              <div key={target.key} className="rounded-md border border-honey-100 bg-white px-3 py-3">
                <p className="text-sm font-black text-slate-950">{localizedExercisePrompt(target.exercise, nativeLanguage)}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{german ? "Bekannter Inhalt · neue Abrufform" : "Known content · new retrieval form"}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-honey-200 bg-white px-3 py-3 text-sm font-bold leading-6 text-honey-900">
            {german ? "Eine nicht gelöste Aufgabe kommt nach den übrigen Aufgaben erneut. Bereits richtig gelöste Aufgaben bleiben bestanden." : "A missed check returns after the remaining checks. Anything you already got right stays passed."}
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600"
      >
        {german ? "Ohne Vorlage starten" : "Start without the model"}
      </button>
    </div>
  );
}

let activePronunciationAudio = null;
let activePronunciationSpeech = null;
const pronunciationAvailabilityRequests = new Map();

function requestPronunciationAvailability(text) {
  const key = String(text || "").replace(/\s+/g, " ").trim().toLocaleLowerCase("es");
  if (!key) return Promise.resolve(null);
  if (!pronunciationAvailabilityRequests.has(key)) {
    const params = new URLSearchParams({ text, verify: "1" });
    const request = api(`/api/pronunciation?${params.toString()}`).catch((error) => {
      pronunciationAvailabilityRequests.delete(key);
      throw error;
    });
    pronunciationAvailabilityRequests.set(key, request);
  }
  return pronunciationAvailabilityRequests.get(key);
}

function usePronunciationAvailability(text, enabled = true) {
  const [state, setState] = useState({ loading: false, data: null, error: "" });
  useEffect(() => {
    let active = true;
    if (!enabled || !String(text || "").trim()) {
      setState({ loading: false, data: null, error: "" });
      return () => { active = false; };
    }
    setState({ loading: true, data: null, error: "" });
    requestPronunciationAvailability(text)
      .then((data) => {
        if (active) setState({ loading: false, data, error: "" });
      })
      .catch((error) => {
        if (active) setState({ loading: false, data: null, error: error.message || "lookup_failed" });
      });
    return () => { active = false; };
  }, [text, enabled]);
  return state;
}

function pronunciationAudioUrl(text, provider = "", sourceText = "") {
  const params = new URLSearchParams({ text: text || "" });
  if (provider) params.set("provider", provider);
  if (sourceText) params.set("sourceText", sourceText);
  return `/api/pronunciation/audio?${params.toString()}`;
}

function playSpeechSynthesisFallback(text, setAudioState) {
  if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance === "undefined") return false;
  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.9;
  utterance.onstart = () => setAudioState("playing");
  utterance.onend = () => {
    if (activePronunciationSpeech === utterance) activePronunciationSpeech = null;
    setAudioState("idle");
  };
  utterance.onerror = () => {
    if (activePronunciationSpeech === utterance) activePronunciationSpeech = null;
    setAudioState("error");
    window.setTimeout(() => setAudioState("idle"), 2600);
  };
  activePronunciationSpeech = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

function playPronunciationClip(text, setAudioState, provider = "", sourceText = "") {
  if (!text || typeof window === "undefined") return;
  if (activePronunciationAudio) {
    activePronunciationAudio.pause();
    activePronunciationAudio.removeAttribute("src");
  }
  if (window.speechSynthesis && activePronunciationSpeech) {
    window.speechSynthesis.cancel();
    activePronunciationSpeech = null;
  }

  const audio = new Audio(pronunciationAudioUrl(text, provider, sourceText));
  activePronunciationAudio = audio;
  setAudioState("loading");
  let fallbackTried = false;

  const resetAfterError = () => {
    if (!fallbackTried && provider) {
      fallbackTried = true;
      if (activePronunciationAudio === audio) activePronunciationAudio = null;
      playPronunciationClip(text, setAudioState);
      return;
    }
    if (!fallbackTried && !provider && playSpeechSynthesisFallback(text, setAudioState)) {
      fallbackTried = true;
      if (activePronunciationAudio === audio) activePronunciationAudio = null;
      return;
    }
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

function ThemeToggle({ theme, onToggle, showLabel = false, nativeLanguage = "de" }) {
  const isDark = theme === "dark";
  const german = nativeLanguage === "de";
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? (german ? "Helles Design verwenden" : "Use light mode") : (german ? "Dunkles Design verwenden" : "Use dark mode");

  return (
    <button
      type="button"
      onClick={onToggle}
      title={label}
      aria-label={label}
      className={classNames(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white font-bold text-slate-600 hover:bg-stone-100 hover:text-slate-900",
        showLabel ? "px-3.5" : "w-11 px-0"
      )}
    >
      <Icon size={19} />
      {showLabel && <span>{isDark ? "Hell" : "Dunkel"}</span>}
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
      <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#fff7ed,#ecfeff_45%,#ffffff)] text-slate-700">
        <div className="flex items-center gap-3 rounded-2xl bg-white/90 px-6 py-4 shadow-card backdrop-blur">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-coral-500 border-t-transparent" />
          <span className="font-bold">Vamos Español wird geladen…</span>
        </div>
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
      setError(mode === "login" ? "Anmeldung fehlgeschlagen. Prüfe E-Mail-Adresse und Passwort." : "Das Lernkonto konnte nicht erstellt werden. Prüfe deine Angaben und versuche es erneut.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="app-auth-screen relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#fff7ed,#ecfeff_45%,#ffffff)] px-4 py-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-coral-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-lagoon-300/25 blur-3xl" />
      <div className="relative mx-auto mb-4 flex max-w-6xl justify-end">
        <ThemeToggle theme={theme} onToggle={toggleTheme} showLabel />
      </div>
      <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_430px]">
        <section className="max-w-2xl animate-fade-in">
          <Logo large />
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-coral-100 bg-coral-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral-600">
            <Sparkles size={14} />
            Spanisch verstehen, abrufen und anwenden
          </div>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Spanisch, das du wirklich
            <br className="hidden sm:block" /> <span className="text-coral-500">anwenden</span> kannst.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Verstehe ein klares Konzept, sieh echte Beispiele, prüfe dich aktiv und wiederhole genau dann, wenn dein Gedächtnis es braucht.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <FeaturePill icon={ListChecks} label="Geplante Wiederholung" />
            <FeaturePill icon={Gamepad2} label="Aktiver Abruf" />
            <FeaturePill icon={Trophy} label="Praktische Fähigkeiten" />
          </div>
        </section>

        <form
          onSubmit={submit}
          className="animate-fade-in rounded-3xl border border-white/80 bg-white/95 p-7 shadow-card backdrop-blur"
        >
          <div className="mb-1 text-lg font-black text-slate-900">
            {mode === "login" ? "Willkommen zurück" : "Erstelle dein Lernkonto"}
          </div>
          <p className="mb-5 text-sm text-slate-500">
            {mode === "login" ? "Setze deinen Lernweg dort fort, wo du aufgehört hast." : "In weniger als einer Minute kannst du dein erstes Lernpaket beginnen."}
          </p>
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1 text-sm font-bold">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={classNames(
                "flex-1 rounded-lg px-3 py-2 transition",
                mode === "login" ? "bg-white text-coral-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Anmelden
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={classNames(
                "flex-1 rounded-lg px-3 py-2 transition",
                mode === "register" ? "bg-white text-coral-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Registrieren
            </button>
          </div>

          {mode === "register" && (
            <label className="mb-4 block text-sm font-semibold text-slate-700">
              Name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 outline-none transition focus:border-lagoon-500 focus:ring-2 focus:ring-lagoon-500/20"
                placeholder="Ana"
              />
            </label>
          )}

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            E-Mail-Adresse
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 outline-none transition focus:border-lagoon-500 focus:ring-2 focus:ring-lagoon-500/20"
              placeholder="you@example.com"
            />
          </label>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Passwort
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 outline-none transition focus:border-lagoon-500 focus:ring-2 focus:ring-lagoon-500/20"
              placeholder="Mindestens 8 Zeichen"
            />
          </label>

          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 px-4 py-3.5 font-bold text-white shadow-glow transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
          >
            <Rocket size={18} />
            {busy ? "Einen Moment..." : mode === "login" ? "Lernen starten" : "Konto erstellen"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">Melde dich an oder erstelle ein neues Lernprofil. Deutsch ist zunächst die Erklärungssprache; Spanisch bleibt die Zielsprache.</p>
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
      return data;
    } catch (err) {
      setError((user.nativeLanguage || "de") === "de" ? "Dein Lernstand konnte gerade nicht geladen werden. Bitte versuche es erneut." : err.message);
      return null;
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

  const germanNavLabels = { learn: "Lernen", words: "Wörter", review: "Wiederholen", talk: "Sprechen", play: "Üben", profile: "Profil", manage: "Verwalten" };
  const german = (user.nativeLanguage || "de") === "de";
  const nav = navItems
    .filter((item) => !item.adminOnly || user.role === "ADMIN")
    .map((item) => german ? { ...item, label: germanNavLabels[item.key] || item.label } : item);
  const activeNav = primaryNavKey(active);

  return (
    <div className="app-shell min-h-screen bg-stone-50 text-slate-900">
      <a href="#main-content" className="skip-link">{german ? "Direkt zum Lerninhalt" : "Skip to learning content"}</a>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-stone-200/80 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-stone-100 p-6">
            <Logo />
          </div>
          <nav className="flex-1 space-y-1.5 p-4" aria-label={german ? "Hauptnavigation" : "Main navigation"}>
            {nav.map((item) => (
              <NavButton key={item.key} item={item} active={activeNav === item.key} onClick={() => setActive(item.key)} />
            ))}
          </nav>
          <div className="m-4 overflow-hidden rounded-2xl border border-coral-100 bg-coral-50 p-4">
            <div className="flex items-center gap-2 text-coral-600">
              <Flame size={18} />
              <p className="font-black">{dashboard?.stats.streakDays || user.streakDays} {german ? "Lerntage in Folge" : "day streak"}</p>
            </div>
            <p className="mt-1.5 text-sm leading-snug text-slate-600">Pequeños pasos, grandes conquistas.</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/80 backdrop-blur-md">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="hidden items-center gap-5 lg:flex">
              <TopMetric icon={Flame} label={german ? "Lernserie" : "Day Streak"} value={dashboard?.stats.streakDays || user.streakDays} />
              <TopMetric icon={Star} label="XP" value={(dashboard?.stats.xp || user.xp).toLocaleString()} />
              <TopMetric icon={Medal} label={german ? "Stufe" : "Level"} value={dashboard?.stats.level || user.level} />
            </div>
            <div className="lg:hidden">
              <Logo compact />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle theme={theme} onToggle={toggleTheme} nativeLanguage={user.nativeLanguage || "de"} />
              <div className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-lagoon-400 to-lagoon-600 text-sm font-black text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="hidden text-sm font-bold text-slate-700 sm:block">¡Hola, {user.name}!</span>
              </div>
              <button
                onClick={logout}
                title={german ? "Abmelden" : "Log out"}
                aria-label={german ? "Abmelden" : "Log out"}
                className="grid h-11 w-11 place-items-center rounded-xl text-slate-500 hover:bg-stone-100 hover:text-coral-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
          {error && (
            <div role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 font-medium text-red-700">{error}</div>
          )}
          {loading || !dashboard ? (
            <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-2xl bg-white p-8 text-slate-500 shadow-soft">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-coral-500 border-t-transparent" />
              {german ? "Dein Lernweg wird geladen..." : "Loading your learning path..."}
            </div>
          ) : (
            <div className="animate-fade-in">
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
            </div>
          )}
        </main>
      </div>

      <MobileNavigation
        nav={nav}
        activeNav={activeNav}
        onNavigate={setActive}
        german={german}
        reviewDue={dashboard?.review?.counts?.total || 0}
      />
    </div>
  );
}

function ActiveView({ active, user, dashboard, refreshDashboard, setActive, launchLessonId, setLaunchLessonId, theme, setTheme }) {
  if (["learn", "dashboard", "path", "lessons", "grammar", "lab"].includes(active)) {
    return (
      <LearningWorkspace
        initialTab={active === "path" || active === "lessons" ? "course" : active === "grammar" ? "grammar" : active === "lab" ? "lab" : "today"}
        dashboard={dashboard}
        refreshDashboard={refreshDashboard}
        setActive={setActive}
        launchLessonId={launchLessonId}
        setLaunchLessonId={setLaunchLessonId}
      />
    );
  }
  if (active === "review") return <ReviewQueueView refreshDashboard={refreshDashboard} setActive={setActive} nativeLanguage={user.nativeLanguage || "de"} learningMode={user.learningMode || "home"} />;
  if (active === "talk") {
    const nativeLanguage = user.nativeLanguage || "de";
    return (
      <LazyWorkspaceErrorBoundary
        nativeLanguage={nativeLanguage}
        titleDe="Gesprächstraining konnte nicht geladen werden."
        titleEn="Conversation practice could not be loaded."
      >
        <Suspense fallback={<Panel title={nativeLanguage === "de" ? "Gesprächstraining" : "Conversation practice"}>{nativeLanguage === "de" ? "Gesprächswege werden geladen..." : "Loading conversation paths..."}</Panel>}>
          <ConversationWorkspace
            nativeLanguage={nativeLanguage}
            learningMode={user.learningMode || "home"}
            api={api}
            classNames={classNames}
            playSpeechSynthesisFallback={playSpeechSynthesisFallback}
            conversationUi={conversationUi}
            conversationMeaning={conversationMeaning}
            conversationSkill={conversationSkill}
            Panel={Panel}
            PronunciationTools={PronunciationTools}
            SpeakCheck={SpeakCheck}
          />
        </Suspense>
      </LazyWorkspaceErrorBoundary>
    );
  }
  if (["words", "pronunciation"].includes(active)) {
    return <WordsWorkspace initialTab={active === "pronunciation" ? "audio" : "memory"} dashboard={dashboard} refreshDashboard={refreshDashboard} />;
  }
  if (["play", "games", "challenges", "scenarios"].includes(active)) {
    return (
      <PlayWorkspace
        initialTab={active === "challenges" ? "challenge" : active === "scenarios" ? "scenarios" : "games"}
        dashboard={dashboard}
        refreshDashboard={refreshDashboard}
      />
    );
  }
  if (["profile", "progress", "settings"].includes(active)) {
    return <ProfileWorkspace initialTab={active === "settings" ? "settings" : "progress"} user={user} dashboard={dashboard} refreshDashboard={refreshDashboard} theme={theme} setTheme={setTheme} />;
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
  const german = dashboard.user?.nativeLanguage === "de";

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
          { key: "today", label: german ? "Heute" : "Today", icon: Target },
          { key: "course", label: german ? "Lernweg" : "Course", icon: BookOpen },
          { key: "grammar", label: german ? "Grammatik" : "Grammar Map", icon: GraduationCap },
          { key: "lab", label: german ? "Hören & Lesen" : "Input Lab", icon: Volume2 }
        ]}
      />
      {tab === "today" ? (
        <NaturalLearningHome
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
      ) : tab === "lab" ? (
        <ReadingListeningLabView dashboard={dashboard} refreshDashboard={refreshDashboard} />
      ) : (
        <GrammarView
          dashboard={dashboard}
          onStartLesson={(lessonId) => {
            setLaunchLessonId(lessonId);
            setTab("course");
          }}
        />
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
  const nativeLanguage = dashboard?.user?.nativeLanguage || "de";
  const german = nativeLanguage === "de";
  const quiet = dashboard?.user?.learningMode === "quiet";

  useEffect(() => {
    setTab(quiet && initialTab !== "memory" ? "memory" : initialTab);
  }, [initialTab, quiet]);

  return (
    <div>
      <WorkspaceSummary
        title={german ? "Wörter" : "Words"}
        icon={NotebookTabs}
        metrics={[
          { label: german ? "Insgesamt" : "Total", value: dashboard?.stats?.totalWords || 0 },
          { label: german ? "Fällig" : "Due", value: dashboard?.stats?.wordReviewCount || 0 },
          { label: german ? "Sicher" : "Mastered", value: dashboard?.stats?.masteredWords || 0 }
        ]}
      >
        {quiet
          ? (german ? "Lerne Wörter leise mit aktivem Abruf, Bildern, Schreiben und Wiederholungsplanung." : "Practice vocabulary quietly with recall, pictures, typing, and spaced review.")
          : (german ? "Lerne Wörter mit aktivem Abruf, Wiederholungsplanung, Audio und Aussprache an einem Ort." : "Practice vocabulary, memory, audio, and speaking in one place.")}
      </WorkspaceSummary>
      <WorkspaceTabs
        active={tab}
        onChange={setTab}
        tabs={quiet ? [
          { key: "memory", label: german ? "Wörter & Gedächtnis" : "Words & Memory", icon: NotebookTabs }
        ] : [
          { key: "memory", label: german ? "Wörter & Gedächtnis" : "Words & Memory", icon: NotebookTabs },
          { key: "audio", label: german ? "Hörtraining" : "Audio Lab", icon: Volume2 },
          { key: "speaking", label: german ? "Sprechtraining" : "Speaking Lab", icon: Mic }
        ]}
      />
      {quiet && <div className="mb-5 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-900">{german ? "Leisemodus: Hör- und Sprechtraining sind ausgeblendet. Das Wörtertraining funktioniert vollständig ohne Ton und Mikrofon." : "Quiet mode: audio and speaking practice are hidden. Word memory remains fully available without sound or a microphone."}</div>}
      {tab === "audio" ? (
        <PronunciationLookupView nativeLanguage={nativeLanguage} />
      ) : tab === "speaking" ? (
        <SpeakingLabView nativeLanguage={nativeLanguage} />
      ) : (
        <WordLearnerView refreshDashboard={refreshDashboard} nativeLanguage={nativeLanguage} quiet={quiet} />
      )}
    </div>
  );
}

function PlayWorkspace({ initialTab = "games", dashboard, refreshDashboard }) {
  const [tab, setTab] = useState(initialTab);
  const nativeLanguage = dashboard.user?.nativeLanguage || "de";
  const german = nativeLanguage === "de";

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div>
      <WorkspaceSummary
        title={german ? "Zusätzlich üben" : "Play"}
        icon={Gamepad2}
        metrics={[
          { label: german ? "Wochenziel" : "Challenge", value: dashboard.challenge ? `${dashboard.challenge.progress}/${dashboard.challenge.targetCount}` : "0/0" },
          { label: german ? "Übungsformen" : "Games", value: dashboard.miniGames?.length || 0 },
          { label: "XP", value: dashboard.stats.xp.toLocaleString() }
        ]}
      >
        {german ? "Kurze Abrufspiele, geführte Alltagssituationen und ein optionales Wochenziel ergänzen deinen Lernweg." : "Mini games, scenario practice, and weekly challenges."}
      </WorkspaceSummary>
      <WorkspaceTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "games", label: german ? "Abrufspiele" : "Mini Games", icon: Gamepad2 },
          { key: "scenarios", label: german ? "Situationen" : "Scenarios", icon: Users },
          { key: "challenge", label: german ? "Wochenziel" : "Challenge", icon: Trophy }
        ]}
      />
      {tab === "challenge" ? (
        <ChallengesView challenge={dashboard.challenge} refreshDashboard={refreshDashboard} nativeLanguage={nativeLanguage} />
      ) : tab === "scenarios" ? (
        <ScenarioPracticeView dashboard={dashboard} refreshDashboard={refreshDashboard} nativeLanguage={nativeLanguage} />
      ) : (
        <MiniGamesView dashboard={dashboard} refreshDashboard={refreshDashboard} nativeLanguage={nativeLanguage} />
      )}
    </div>
  );
}

function ProfileWorkspace({ initialTab = "progress", user, dashboard, refreshDashboard, theme, setTheme }) {
  const [tab, setTab] = useState(initialTab);
  const german = (user?.nativeLanguage || "de") === "de";

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div>
      <WorkspaceSummary
        title={german ? "Dein Lernstand" : "Your progress"}
        icon={Users}
        metrics={[
          { label: german ? "Level" : "Level", value: dashboard.stats.level },
          { label: german ? "Lerntage in Folge" : "Streak", value: dashboard.stats.streakDays },
          { label: "XP", value: dashboard.stats.xp.toLocaleString() }
        ]}
      >
        {german ? "Sieh, was bereits selbstständig abrufbar ist, was Hilfe brauchte und welche Inhalte als Nächstes gefestigt werden sollten." : "See what you can retrieve independently, what needed support, and what should be strengthened next."}
      </WorkspaceSummary>
      <WorkspaceTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "progress", label: german ? "Lernfortschritt" : "Progress", icon: BarChart3 },
          { key: "settings", label: german ? "Einstellungen" : "Settings", icon: Settings }
        ]}
      />
      {tab === "settings" ? (
        <SettingsView user={user} refreshDashboard={refreshDashboard} theme={theme} setTheme={setTheme} />
      ) : (
        <LazyWorkspaceErrorBoundary
          nativeLanguage={user?.nativeLanguage || "de"}
          titleDe="Lernstand konnte nicht geladen werden."
          titleEn="Progress could not be loaded."
        >
          <Suspense fallback={<Panel title={german ? "Dein Lernstand" : "Your progress"}>{german ? "Lernnachweise werden geladen..." : "Loading learning evidence..."}</Panel>}>
            <ProgressView
              dashboard={dashboard}
              nativeLanguage={user?.nativeLanguage || "de"}
              Panel={Panel}
              ProgressBar={ProgressBar}
              InfoTile={InfoTile}
              classNames={classNames}
            />
          </Suspense>
        </LazyWorkspaceErrorBoundary>
      )}
    </div>
  );
}

function ManageWorkspace({ user, refreshDashboard, theme, setTheme }) {
  const german = (user?.nativeLanguage || "de") === "de";
  return (
    <div className="space-y-5">
      <WorkspaceSummary
        title={german ? "Verwalten" : "Manage"}
        icon={Shield}
        metrics={[
          { label: german ? "Rolle" : "Role", value: user.role },
          { label: "Admin", value: german ? "Werkzeuge" : "Tools" },
          { label: german ? "Einstellungen" : "Settings", value: german ? "Enthalten" : "Included" }
        ]}
      >
        {german ? "Inhalte prüfen, Systemstatus einsehen und Kontoeinstellungen verwalten." : "Admin tools, deployment status, and account settings."}
      </WorkspaceSummary>
      <LazyWorkspaceErrorBoundary
        nativeLanguage={user?.nativeLanguage || "de"}
        titleDe="Admin-Werkzeuge konnten nicht geladen werden."
        titleEn="Admin tools could not be loaded."
      >
        <Suspense fallback={<Panel title="Admin">{german ? "Inhaltswerkzeuge werden geladen..." : "Loading content tools..."}</Panel>}>
          <AdminWorkspace
            refreshDashboard={refreshDashboard}
            nativeLanguage={user?.nativeLanguage || "de"}
            api={api}
            Panel={Panel}
            InfoTile={InfoTile}
            AdminForm={AdminForm}
            TextInput={TextInput}
            classNames={classNames}
          />
        </Suspense>
      </LazyWorkspaceErrorBoundary>
      <SettingsView user={user} refreshDashboard={refreshDashboard} theme={theme} setTheme={setTheme} />
    </div>
  );
}

function LearningPathView({ dashboard, refreshDashboard, setActive, launchLessonId, onLaunchHandled }) {
  const nativeLanguage = dashboard.user?.nativeLanguage || "de";
  const german = nativeLanguage === "de";
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
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState({});

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
  const curriculumUnits = (dashboard.curriculumUnits || []).map((unit) => localizedUnit(unit, nativeLanguage));
  const currentUnit = nextLesson?.unit
    ? curriculumUnits.find((unit) => unit.slug === nextLesson.unit.slug) || nextLesson.unit
    : curriculumUnits.find((unit) => unit.lessonCount > 0 && unit.status !== "complete");
  const availableLevels = [...new Set(
    curriculumUnits
      .filter((unit) => !unit.planned && unit.lessonCount > 0)
      .map((unit) => unit.label?.match(/^[A-C][12]/)?.[0])
      .filter(Boolean)
  )];
  const currentLevel = currentUnit?.label?.match(/^[A-C][12]/)?.[0] || availableLevels[0] || "A1";
  const [selectedLevel, setSelectedLevel] = useState("");
  const visibleLevel = availableLevels.includes(selectedLevel) ? selectedLevel : currentLevel;
  const activeUnitGroups = curriculumUnits
    .filter((unit) => !unit.planned && unit.lessonCount > 0)
    .map((unit) => {
      const unitLessons = orderedLessons.filter((lessonItem) => lessonItem.unit?.slug === unit.slug);
      const checkpointLesson = unitLessons.find((lessonItem) => lessonItem.isCheckpoint) || null;
      const coreLessons = unitLessons.filter((lessonItem) => !lessonItem.isCheckpoint);
      const openLesson =
        unitLessons.find((lessonItem) => !lessonItem.isLocked && (lessonItem.reviewDue || lessonItem.progress < 100)) ||
        (checkpointLesson && !checkpointLesson.isLocked ? checkpointLesson : null) ||
        unitLessons.find((lessonItem) => !lessonItem.isLocked) ||
        unitLessons[0];
      return {
        ...unit,
        lessons: unitLessons,
        coreLessons,
        checkpointLesson,
        nextActionLesson: openLesson
      };
    });
  const visibleUnitGroups = activeUnitGroups.filter((unit) => unit.label?.startsWith(visibleLevel));
  const visibleLessons = orderedLessons.filter((lessonItem) => lessonItem.cefrLevel === visibleLevel);
  const visibleRemainingLessons = visibleLessons.filter((lessonItem) => lessonItem.progress < 100 || lessonItem.reviewDue);
  const visibleRemainingMinutes = visibleRemainingLessons.reduce(
    (sum, lessonItem) => sum + (lessonItem.reviewDue ? lessonItem.reviewEstimatedMinutes || lessonItem.estimatedMinutes : lessonItem.estimatedMinutes || 0),
    0
  );
  const visibleCompleted = visibleLessons.length - visibleRemainingLessons.length;
  const plannedUnits = curriculumUnits.filter((unit) => unit.planned);

  useEffect(() => {
    if (!currentUnit?.slug) return;
    setExpandedUnits((current) => (current[currentUnit.slug] ? current : { ...current, [currentUnit.slug]: true }));
  }, [currentUnit?.slug]);

  if (selectedId) {
    return loadingLesson || !lesson ? (
      <Panel title={german ? "Lerneinheit wird geladen" : "Loading Session"}>{german ? "Dein Lernpaket wird vorbereitet..." : "Preparing the focused lesson..."}</Panel>
    ) : (
      <FocusedLessonSession
        lesson={lesson}
        nativeLanguage={dashboard.user?.nativeLanguage || "de"}
        learningMode={dashboard.user?.learningMode || "home"}
        setActive={setActive}
        onBack={() => {
          setSelectedId("");
          refreshDashboard();
        }}
        onStartLesson={(lessonId) => {
          setLesson(null);
          setSelectedId(lessonId);
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
              <Target size={16} /> {german ? "Dein Lernweg" : "Unit path"}
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-black sm:text-4xl">{german ? "Lerne ein Konzept nach dem anderen – und festige es, bevor du weitergehst." : "Follow the unit, pass the checkpoint, then move up."}</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold text-slate-300 sm:text-base">
              {german ? "Jede Einheit erklärt, zeigt, prüft und wiederholt den Stoff. Der gemischte Abschluss zeigt dir, ob das Fundament wirklich sitzt." : "Each unit now ends with a mixed check, and completed lessons stay available when you need reinforcement."}
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-[560px]">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-300">{german ? "Sicherheit" : "Mastery"}</p>
              <p className="mt-2 text-2xl font-black">{averageProgress}%</p>
              <p className="mt-1 text-xs font-bold text-slate-300">{german ? "aktuelle Aufgaben" : "current checks"}</p>
              <ProgressBar value={averageProgress} className="mt-3" color="bg-honey-500" />
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-300">{german ? "Aktuelle Einheit" : "Current unit"}</p>
              <p className="mt-2 text-2xl font-black">{currentUnit?.label || "A1"}</p>
              <p className="mt-1 text-xs font-bold text-slate-300">{currentUnit?.title || (german ? "Lernweg aktiv" : "Path active")}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-300">{german ? "Abgeschlossen" : "Completed"}</p>
              <p className="mt-2 text-2xl font-black">{completedLessons.length}</p>
              <p className="mt-1 text-xs font-bold text-slate-300">{orderedLessons.length} {german ? "Lernpakete insgesamt" : "total lessons"}</p>
            </div>
          </div>
        </div>
        {nextLesson && (
          <button
            onClick={() => setSelectedId(nextLesson.id)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-honey-500 px-4 py-3 font-black text-white hover:bg-honey-600 sm:w-fit sm:px-6"
          >
            <Rocket size={18} /> {german ? (nextLesson.reviewDue ? "Fällige Wiederholung starten" : nextLesson.progress > 0 ? "Lernpaket fortsetzen" : "Nächstes Lernpaket starten") : (nextLesson.reviewDue ? "Review Due Lesson" : nextLesson.progress > 0 ? "Continue Next Lesson" : "Start Next Lesson")}
          </button>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-5">
          {nextLesson && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">{german ? (nextLesson.reviewDue ? "Jetzt wiederholen" : "Aktuelles Lernpaket") : (nextLesson.reviewDue ? "Due for review" : "Current lesson")}</h2>
                <span className="rounded-full bg-honey-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-honey-700">
                  {german ? "Schritt" : "Step"} {nextIndex + 1}
                </span>
              </div>
              <PathLessonCard
                lessonItem={nextLesson}
                nativeLanguage={nativeLanguage}
                index={nextIndex}
                state="current"
                onSelect={() => setSelectedId(nextLesson.id)}
              />
            </div>
          )}

          {activeUnitGroups.length > 0 && (
            <div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">{german ? `Dein Weg durch ${visibleLevel}` : `Your ${visibleLevel} path`}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {visibleCompleted}/{visibleLessons.length} {german ? "Lernpakete sicher" : "packages secure"} · {german ? "noch etwa" : "about"} {formatLearningTime(visibleRemainingMinutes, german)}
                  </p>
                </div>
                <span className="hidden text-sm font-bold text-slate-500 sm:block">{visibleUnitGroups.length} {german ? "Einheiten" : "units"}</span>
              </div>
              <div className="sticky top-20 z-10 -mx-1 mb-4 overflow-x-auto px-1 pb-1">
                <div className="flex min-w-max gap-2 rounded-lg border border-stone-200 bg-white/95 p-2 shadow-sm backdrop-blur">
                  {availableLevels.map((level) => {
                    const levelUnits = activeUnitGroups.filter((unit) => unit.label?.startsWith(level));
                    const levelComplete = levelUnits.length > 0 && levelUnits.every((unit) => unit.status === "complete");
                    return (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        aria-pressed={visibleLevel === level}
                        className={classNames(
                          "rounded-md px-4 py-2.5 text-sm font-black",
                          visibleLevel === level ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-stone-100"
                        )}
                      >
                        {level}{levelComplete ? " ✓" : level === currentLevel ? (german ? " · jetzt" : " · now") : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
              {visibleLevel === currentLevel && currentUnit && (
                <div className="mb-4 rounded-lg border border-lagoon-200 bg-lagoon-50 p-4 text-lagoon-950">
                  <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{german ? "Warum dieses Paket jetzt kommt" : "Why this comes next"}</p>
                  <p className="mt-2 font-black">{currentUnit.label} · {currentUnit.title}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-lagoon-900">{currentUnit.description}</p>
                </div>
              )}
              <div className="space-y-4">
                {visibleUnitGroups.map((unit) => (
                  <CourseUnitCard
                    key={unit.slug}
                    unit={unit}
                    isCurrent={currentUnit?.slug === unit.slug}
                    isExpanded={Boolean(expandedUnits[unit.slug])}
                    nextLessonId={nextLesson?.id}
                    orderedLessons={orderedLessons}
                    nativeLanguage={nativeLanguage}
                    onToggle={() => setExpandedUnits((current) => ({ ...current, [unit.slug]: !current[unit.slug] }))}
                    onSelectLesson={(lessonId) => setSelectedId(lessonId)}
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
                  <h2 className="text-xl font-black text-emerald-950">{german ? "Alle Lernpakete sind abgeschlossen" : "All lessons are complete"}</h2>
                  <p className="mt-1 text-sm font-semibold text-emerald-800">
                    {german ? "Im abgeschlossenen Bereich kannst du jedes Thema jederzeit erneut festigen." : "Use the completed section below to review anything again."}
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
                  <span className="block text-lg font-black">{german ? "Abgeschlossene Lernpakete" : "Completed lessons"}</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-500">
                    {completedLessons.length} {german ? "jederzeit verfügbar" : "available any time"}
                  </span>
                </span>
                <span className="rounded-md border border-stone-200 px-3 py-2 text-sm font-black text-slate-700">
                  {german ? (showCompleted ? "Ausblenden" : "Anzeigen") : (showCompleted ? "Hide" : "Show")}
                </span>
              </button>
              {showCompleted && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {completedLessons.map((lessonItem) => (
                    <PathLessonCard
                      key={lessonItem.id}
                      lessonItem={lessonItem}
                      nativeLanguage={nativeLanguage}
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
          <Panel title={german ? "Status des Lernwegs" : "Path Status"} icon={ListChecks}>
            <div className="grid gap-3">
              <InfoTile label={german ? "Offene Lernpakete" : "Open lessons"} value={activeLessons.length} />
              <InfoTile label={german ? "Fällige Wiederholungen" : "Due again"} value={dueLessons.length} />
              <InfoTile label={german ? "Abgeschlossen" : "Completed"} value={completedLessons.length} />
              <InfoTile label={german ? "Durchschnittliche Sicherheit" : "Average mastery"} value={`${averageProgress}%`} />
              <InfoTile label={german ? "Aktuelle Einheit" : "Current unit"} value={currentUnit ? `${currentUnit.label} ${currentUnit.title}` : "A1"} />
            </div>
            {nextLesson && (
              <button
                onClick={() => setSelectedId(nextLesson.id)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-lagoon-500 px-4 py-3 font-black text-white hover:bg-lagoon-600"
              >
                <Rocket size={18} /> {german ? (nextLesson.reviewDue ? "Wiederholen" : nextLesson.progress > 0 ? "Fortsetzen" : "Starten") : (nextLesson.reviewDue ? "Review Due" : nextLesson.progress > 0 ? "Start Next" : "Start")}
              </button>
            )}
          </Panel>

          <Panel title={german ? "Dein Lernrhythmus" : "Learning Rhythm"} icon={Target}>
            <div className="grid gap-3 text-sm font-bold text-slate-700">
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                {german ? "Lernpakete führen Bedeutung, Satzmuster und Wortschatz gemeinsam ein." : "Course lessons introduce the grammar and vocabulary together."}
              </div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                {german ? "Wiederholungen bringen unsichere Inhalte zum richtigen Zeitpunkt zurück." : "Review brings back weak items when they are due."}
              </div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                {german ? "Wörter und Spiele festigen denselben Stoff aus einem anderen Blickwinkel." : "Words and play reinforce the same material from another angle."}
              </div>
            </div>
          </Panel>

          {!!plannedUnits.length && (
            <Panel title={german ? "Geplante Erweiterungen" : "Planned Roadmap"} icon={GraduationCap}>
              <div className="grid gap-3">
                {plannedUnits.map((unit) => (
                  <div key={unit.slug} className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                    <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{unit.label} · {unit.phase}</p>
                    <p className="mt-1 font-black text-slate-950">{unit.title}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{unit.description}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}

function formatLearningTime(minutes, german = true) {
  if (minutes < 60) return `${Math.max(0, minutes)} ${german ? "Min." : "min"}`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder
    ? `${hours} ${german ? "Std." : "hr"} ${remainder} ${german ? "Min." : "min"}`
    : `${hours} ${german ? "Std." : "hr"}`;
}

function lessonDisplayProgress(lessonItem) {
  return typeof lessonItem?.displayProgress === "number" ? lessonItem.displayProgress : lessonItem?.progress || 0;
}

function CourseUnitCard({ unit, isCurrent, isExpanded, nextLessonId, orderedLessons, nativeLanguage = "de", onToggle, onSelectLesson }) {
  const german = nativeLanguage === "de";
  const checkpoint = unit.checkpointLesson;
  const coreComplete = unit.coreLessons.filter((lessonItem) => lessonItem.progress >= 100 && !lessonItem.reviewDue).length;
  const checkpointStatus = !checkpoint
    ? german ? "Kein Abschluss" : "No checkpoint"
    : checkpoint.isLocked
      ? `${lessonDisplayProgress(checkpoint)}% ${german ? "Abschluss" : "checkpoint"}`
      : checkpoint.reviewDue
      ? german ? "Erneut fällig" : "Due again"
      : checkpoint.progress >= 100
        ? german ? "Bestanden" : "Passed"
        : checkpoint.progress > 0
          ? german ? "In Arbeit" : "In progress"
          : german ? "Wartet" : "Waiting";
  const nextAction = unit.nextActionLesson;
  const actionLabel = nextAction?.reviewDue
    ? german ? "Wiederholung fällig" : "Review due"
    : nextAction?.isLocked
      ? german ? "Gesperrt" : "Locked"
    : nextAction?.isCheckpoint
      ? nextAction.progress >= 100
        ? german ? "Abschluss wiederholen" : "Review checkpoint"
        : german ? "Abschluss starten" : "Start checkpoint"
      : nextAction?.progress > 0
        ? german ? "Fortsetzen" : "Continue"
        : german ? "Starten" : "Start";
  const statusTone =
    unit.status === "complete"
      ? "border-emerald-200 bg-emerald-50"
      : unit.dueCount
        ? "border-honey-300 bg-honey-50"
        : isCurrent
          ? "border-lagoon-300 bg-lagoon-50"
          : "border-stone-200 bg-white";

  return (
    <section className={classNames("rounded-lg border p-4 shadow-sm sm:p-5", statusTone)}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-lagoon-700">{unit.label}</span>
            <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-700">{unit.phase}</span>
            {isCurrent && <span className="rounded-full bg-honey-500 px-2 py-1 text-xs font-black text-white">{german ? "Aktuell" : "Current"}</span>}
          </div>
          <h3 className="mt-3 text-xl font-black text-slate-950">{unit.title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-600">{unit.description}</p>
          <div className="mt-4 grid gap-2 text-sm font-bold text-slate-700 sm:grid-cols-3">
            <span>{coreComplete}/{unit.coreLessons.length} {german ? "Lernpakete" : "lessons"}</span>
            <span>{checkpointStatus}</span>
            <span>{unit.averageProgress}% {german ? "Sicherheit" : "mastery"}</span>
          </div>
          <ProgressBar
            value={unit.averageProgress}
            className="mt-3"
            color={unit.status === "complete" ? "bg-emerald-500" : unit.dueCount ? "bg-honey-500" : "bg-lagoon-500"}
          />
        </div>
        <div className="grid gap-3">
          {nextAction ? (
            <button
              disabled={nextAction.isLocked}
              onClick={() => !nextAction.isLocked && onSelectLesson(nextAction.id)}
              className={classNames(
                "rounded-md px-4 py-3 text-left font-black text-white",
                nextAction.isLocked ? "cursor-not-allowed bg-slate-400" : "bg-slate-950 hover:bg-slate-800"
              )}
            >
              <span className="block text-xs uppercase tracking-wide text-lagoon-100">{actionLabel}</span>
              <span className="mt-1 block">{localizedLessonTitle(nextAction, nativeLanguage)}</span>
              {nextAction.isLocked && <span className="mt-1 block text-xs text-white/80">{localizedLockedReason(nextAction, nativeLanguage)}</span>}
            </button>
          ) : (
            <div className="rounded-md border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">{german ? "Kein Lernpaket verfügbar." : "No lesson available."}</div>
          )}
          <button
            onClick={onToggle}
            className="flex items-center justify-between gap-3 rounded-md border border-stone-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:border-lagoon-300"
          >
            <span>{german ? (isExpanded ? "Lernpakete ausblenden" : "Lernpakete anzeigen") : (isExpanded ? "Hide lesson list" : "Show lesson list")}</span>
            <ChevronDown size={17} className={classNames("transition", isExpanded && "rotate-180")} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
          {unit.lessons.map((lessonItem) => (
            <CourseLessonRow
              key={lessonItem.id}
              lessonItem={lessonItem}
              index={orderedLessons.findIndex((item) => item.id === lessonItem.id)}
              isNext={nextLessonId === lessonItem.id}
              nativeLanguage={nativeLanguage}
              onSelect={() => onSelectLesson(lessonItem.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CourseLessonRow({ lessonItem, index, isNext, nativeLanguage = "de", onSelect }) {
  const german = nativeLanguage === "de";
  const locked = Boolean(lessonItem.isLocked);
  const displayProgress = lessonDisplayProgress(lessonItem);
  const done = displayProgress >= 100 && !lessonItem.reviewDue && !locked;
  const checkpoint = lessonItem.isCheckpoint;
  const actionLabel = locked
    ? german ? "Gesperrt" : "Locked"
    : lessonItem.reviewDue
    ? german ? "Wiederholen" : "Review due"
    : done
      ? german ? "Festigen" : "Review"
      : checkpoint
        ? german ? "Abschluss" : "Checkpoint"
        : displayProgress > 0
          ? german ? "Fortsetzen" : "Continue"
          : german ? "Starten" : "Start";

  return (
    <button
      disabled={locked}
      onClick={() => !locked && onSelect()}
      className={classNames(
        "flex w-full items-center gap-3 py-3 text-left sm:gap-4",
        locked ? "cursor-not-allowed opacity-65" : "hover:bg-white/70"
      )}
    >
      <span
        className={classNames(
          "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black text-white",
          locked
            ? "bg-slate-400"
            : lessonItem.reviewDue
              ? "bg-honey-600"
              : done
                ? "bg-emerald-600"
                : isNext
                  ? "bg-lagoon-600"
                  : checkpoint
                    ? "bg-coral-500"
                    : "bg-slate-800"
        )}
      >
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-black text-slate-950">{localizedLessonTitle(lessonItem, nativeLanguage)}</p>
          {checkpoint && <span className="rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-black text-coral-700">{german ? "Abschluss" : "Checkpoint"}</span>}
          {locked && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-600">{german ? "Gesperrt" : "Locked"}</span>}
          {isNext && <span className="rounded-full bg-lagoon-50 px-2 py-0.5 text-[11px] font-black text-lagoon-700">{german ? "Als Nächstes" : "Next"}</span>}
        </div>
        <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-600">{localizedLessonSummary(lessonItem, nativeLanguage)}</p>
        {locked && lessonItem.lockedReason && <p className="mt-1 text-xs font-bold text-slate-500">{localizedLockedReason(lessonItem, nativeLanguage)}</p>}
      </div>
      <div className="hidden w-28 shrink-0 sm:block">
        <ProgressBar value={displayProgress} color={locked ? "bg-slate-400" : done ? "bg-emerald-500" : lessonItem.reviewDue ? "bg-honey-500" : "bg-lagoon-500"} />
        <p className="mt-1 text-right text-xs font-black text-slate-500">{displayProgress}%</p>
      </div>
      <span className="shrink-0 text-sm font-black text-lagoon-700">{actionLabel}</span>
    </button>
  );
}

function PathLessonCard({ lessonItem, index, state, nativeLanguage = "de", onSelect }) {
  const german = nativeLanguage === "de";
  const locked = Boolean(lessonItem.isLocked);
  const displayProgress = lessonDisplayProgress(lessonItem);
  const done = displayProgress >= 100 && !locked;
  const due = lessonItem.reviewDue && !locked;
  const current = state === "current";
  const checkpoint = lessonItem.isCheckpoint;
  const actionLabel = german
    ? locked ? "Gesperrt" : due ? "Wiederholen" : done ? "Festigen" : checkpoint ? "Abschluss" : displayProgress > 0 ? "Fortsetzen" : "Starten"
    : locked ? "Locked" : due ? "Review due" : done ? "Review" : checkpoint ? "Checkpoint" : displayProgress > 0 ? "Continue" : "Start";

  return (
    <button
      disabled={locked}
      onClick={() => !locked && onSelect()}
      className={classNames(
        "group flex min-h-36 w-full flex-col rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft",
        locked
          ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-75"
          : current
          ? "border-honey-500 bg-amber-50"
          : due
            ? "border-honey-300 bg-amber-50"
            : done
            ? "border-emerald-200 bg-emerald-50"
            : checkpoint
            ? "border-coral-300 bg-coral-50"
            : "border-stone-200 bg-white hover:bg-stone-50"
      )}
    >
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <AssetImage imageKey={lessonItem.imageKey} alt={localizedLessonTitle(lessonItem, nativeLanguage)} className="h-20 w-20" />
          <span
            className={classNames(
              "absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full text-xs font-black text-white",
              locked ? "bg-slate-400" : due ? "bg-honey-600" : done ? "bg-emerald-600" : current ? "bg-honey-600" : "bg-slate-950"
            )}
          >
            {index + 1}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-lagoon-700">{lessonItem.cefrLevel}</span>
            {lessonItem.unit?.label && (
              <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-700">{lessonItem.unit.label}</span>
            )}
            {checkpoint && <span className="rounded-full bg-coral-500 px-2 py-1 text-xs font-black text-white">{german ? "Abschluss" : "Checkpoint"}</span>}
            {locked && <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-black text-slate-700">{german ? "Gesperrt" : "Locked"}</span>}
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">{german ? (checkpoint ? "Gemischter Abruf" : "Lernpaket") : lessonItem.theme}</span>
          </div>
          <h3 className="mt-2 text-lg font-black leading-tight text-slate-950">{localizedLessonTitle(lessonItem, nativeLanguage)}</h3>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-600">{localizedLessonSummary(lessonItem, nativeLanguage)}</p>
          {locked && lessonItem.lockedReason && <p className="mt-2 text-xs font-bold text-slate-500">{localizedLockedReason(lessonItem, nativeLanguage)}</p>}
        </div>
      </div>
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-3">
          <ProgressBar
            value={displayProgress}
            className="flex-1"
            color={locked ? "bg-slate-400" : due ? "bg-honey-500" : done ? "bg-emerald-500" : current ? "bg-honey-500" : "bg-lagoon-500"}
          />
          <span className="text-sm font-black text-slate-700">{displayProgress}%</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-bold text-slate-500">
            {locked ? (german ? "Öffnet sich im geführten Lernweg" : "Unlocks through the guided course") : `${lessonItem.completedExercises || 0}/${lessonItem.exerciseCount || lessonItem.totalExercises || 0} ${german ? "Aufgaben sicher" : "checks mastered"}`} · {due ? lessonItem.reviewEstimatedMinutes || lessonItem.estimatedMinutes : lessonItem.estimatedMinutes} Min.
          </span>
          <span className="font-black text-lagoon-700 group-hover:text-lagoon-900">{actionLabel}</span>
        </div>
      </div>
    </button>
  );
}

function FocusedLessonSession({ lesson, onBack, onStartLesson, refreshDashboard, setActive, nativeLanguage = "de", learningMode = "home" }) {
  const quiet = learningMode === "quiet";
  const scheduledReview = Boolean(lesson.reviewDue);
  const lessonResumeKey = `espanolo:lesson-resume:${lesson.id}`;
  const legacyLessonResumeKeys = [
    `espanolo:lesson-step:${lesson.id}`,
    `espanolo:lesson-recall:${lesson.id}`,
    `espanolo:lesson-scaffold:${lesson.id}`
  ];
  const [sessionRun, setSessionRun] = useState(0);
  const practiceExercises = useMemo(() => {
    const queue = buildLessonPracticeQueue(lesson.exercises || []);
    // Checkpoints stay unpredictable. Normal lessons use a reproducible
    // recognition → construction → production wave that spaces repeated
    // sentence meanings whenever another target is available.
    const interleaved = lesson.isCheckpoint && !scheduledReview ? shuffleItems(queue) : interleaveLessonPracticeQueue(queue, lesson.id);
    if (!scheduledReview) return interleaved;
    return rotateLessonReviewItems(interleaved, (lesson.lessonReviewCount || 0) + sessionRun, lesson.isCheckpoint ? 8 : 6);
  }, [lesson.exercises, lesson.isCheckpoint, lesson.lessonReviewCount, quiet, scheduledReview, sessionRun]);
  const resumeSignature = useMemo(() => lessonResumeSignature(lesson), [lesson]);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);
  const [resultBanner, setResultBanner] = useState(null);
  const [practiceQueue, setPracticeQueue] = useState(() => practiceExercises);
  const [practiceTurn, setPracticeTurn] = useState(0);
  const [completionReported, setCompletionReported] = useState(false);
  const [nextReviewAt, setNextReviewAt] = useState(null);
  const [postLessonDashboard, setPostLessonDashboard] = useState(null);
  const [postLessonPlanLoading, setPostLessonPlanLoading] = useState(false);
  const [weakModelSentenceIndexes, setWeakModelSentenceIndexes] = useState([]);
  const [scaffoldedModelSentenceIndexes, setScaffoldedModelSentenceIndexes] = useState([]);
  const [practiceTargetExerciseIds, setPracticeTargetExerciseIds] = useState(() => practiceExercises.map((exercise) => exercise.id));
  const [resumeHydratedFor, setResumeHydratedFor] = useState("");
  const [resumedFromSavedState, setResumedFromSavedState] = useState(false);
  const practiceResultRef = useRef(null);
  const sessionTopRef = useRef(null);

  const overviewStep = { type: "overview" };
  const guideCards = useMemo(() => lessonGuideCards(lesson), [lesson.id]);
  const guideStep = !scheduledReview && guideCards.length ? { type: "guide" } : null;
  const soundLab = useMemo(() => soundFoundationLab(lesson?.topic?.slug || lesson?.topicSlug || ""), [lesson.id, lesson?.topic?.slug, lesson?.topicSlug]);
  const soundLabStep = !scheduledReview && soundLab ? { type: "sound-lab" } : null;
  const vocabularyLab = useMemo(
    () => scheduledReview ? null : buildLessonVocabularyLab(
      (lesson.learningWords || []).map((word) => withSpanishLearningExample(word)),
      (word) => localizedWordMeaning(word, nativeLanguage),
      lesson.id
    ),
    [lesson.id, lesson.learningWords, nativeLanguage, scheduledReview]
  );
  const vocabularyStep = vocabularyLab ? { type: "vocabulary" } : null;
  const readingStep = !scheduledReview && lesson.readingJson?.paragraphs?.length ? { type: "reading" } : null;
  const sentenceFrames = useMemo(() => buildLessonSentenceFrames(lesson.sentences || []), [lesson.id]);
  const patternStep = !scheduledReview && sentenceFrames.length ? { type: "pattern" } : null;
  const contextBridge = useMemo(
    () => scheduledReview ? null : buildA1ContextBridge(lesson, (sentence) => nativeMeaning(sentence.english, nativeLanguage)),
    [lesson, nativeLanguage, scheduledReview]
  );
  const selectedModelSentences = scheduledReview
    ? rotateLessonReviewItems(
        (lesson.sentences || []).map((sentence, sentenceIndex) => ({ sentence, sentenceIndex })),
        (lesson.lessonReviewCount || 0) + sessionRun,
        2
      )
    : (lesson.sentences || []).map((sentence, sentenceIndex) => ({ sentence, sentenceIndex }));
  const learnSteps = selectedModelSentences.map(({ sentence, sentenceIndex }, index) => ({ type: "learn", sentence, sentenceIndex, index }));
  const contextBridgeStep = contextBridge ? { type: "context-bridge" } : null;
  const weakModelSentences = weakModelSentenceIndexes
    .map((sentenceIndex) => ({ sentence: lesson.sentences?.[sentenceIndex], sentenceIndex }))
    .filter((item) => item.sentence);
  const consolidationStep = learnSteps.length ? { type: "consolidation" } : null;
  const practicePreviewStep = !scheduledReview && practiceExercises.length ? { type: "practice-preview" } : null;
  const lessonSteps = [overviewStep, ...(guideStep ? [guideStep] : []), ...(soundLabStep ? [soundLabStep] : []), ...(vocabularyStep ? [vocabularyStep] : []), ...(readingStep ? [readingStep] : []), ...(patternStep ? [patternStep] : []), ...learnSteps, ...(contextBridgeStep ? [contextBridgeStep] : []), ...(consolidationStep ? [consolidationStep] : []), ...(practicePreviewStep ? [practicePreviewStep] : [])];

  useEffect(() => {
    const restored = sessionRun === 0
      ? restoreLessonResumeState(readLessonResumeRecord(lessonResumeKey), { lesson, maxStep: lessonSteps.length })
      : restoreLessonResumeState("", { lesson, maxStep: lessonSteps.length });
    const correctionIds = new Set([
      ...restored.correctionExerciseIds,
      ...restored.firstPassResults.filter((result) => !result.correct).map((result) => result.exerciseId)
    ]);
    const restoredQueue = practiceExercises.map((exercise) => correctionIds.has(exercise.id)
      ? { ...exercise, sessionCorrection: true, sessionRetryCount: 1 }
      : exercise);
    const restoredTargetIds = [...new Set([
      ...(restored.practiceTargetExerciseIds.length ? restored.practiceTargetExerciseIds : practiceExercises.map((exercise) => exercise.id)),
      ...practiceExercises.map((exercise) => exercise.id)
    ])];

    setStep(restored.step);
    setResults(restored.firstPassResults);
    setResultBanner(null);
    setPracticeQueue(restoredQueue);
    setPracticeTargetExerciseIds(restoredTargetIds);
    setPracticeTurn(0);
    setCompletionReported(false);
    setNextReviewAt(null);
    setPostLessonDashboard(null);
    setPostLessonPlanLoading(false);
    setWeakModelSentenceIndexes(restored.weakSentenceIndexes);
    setScaffoldedModelSentenceIndexes(restored.scaffoldedSentenceIndexes);
    setResumedFromSavedState(restored.resumed);
    setResumeHydratedFor(resumeSignature);
    practiceResultRef.current = null;
  }, [lesson.id, lessonResumeKey, resumeSignature, sessionRun]);

  useEffect(() => {
    if (sessionRun !== 0 || resumeHydratedFor !== resumeSignature || completionReported) return;
    writeLessonResumeRecord(lessonResumeKey, createLessonResumeState({
      lesson,
      step,
      weakSentenceIndexes: weakModelSentenceIndexes,
      scaffoldedSentenceIndexes: scaffoldedModelSentenceIndexes,
      practiceTargetExerciseIds,
      firstPassResults: results,
      correctionExerciseIds: practiceQueue.filter((exercise) => exercise.sessionCorrection).map((exercise) => exercise.id)
    }));
  }, [completionReported, lesson, lessonResumeKey, practiceQueue, practiceTargetExerciseIds, results, resumeHydratedFor, resumeSignature, scaffoldedModelSentenceIndexes, sessionRun, step, weakModelSentenceIndexes]);

  const inPractice = step >= lessonSteps.length;
  const current = inPractice
    ? practiceQueue[0]
      ? { type: "practice", exercise: practiceQueue[0] }
      : null
    : lessonSteps[step];
  const currentLearnImageKey = current?.type === "learn" ? lessonSentenceImageKey(lesson, current.sentence) : null;
  const currentModelSupportReason = current?.type === "learn"
    ? modelSentenceScaffoldReason({
        cefrLevel: lesson.cefrLevel,
        index: current.index,
        previousSentenceIndex: learnSteps[current.index - 1]?.sentenceIndex,
        previousWasScaffolded: scaffoldedModelSentenceIndexes.includes(learnSteps[current.index - 1]?.sentenceIndex),
        scheduledReview,
        weakSentenceIndexes: weakModelSentenceIndexes
      })
    : "";
  const finished = inPractice && practiceQueue.length === 0;
  const correct = results.filter((result) => result.correct).length;
  const independent = results.filter((result) => result.correct && !result.usedSupport).length;
  const supported = results.filter((result) => result.correct && result.usedSupport).length;
  const corrected = results.filter((result) => !result.correct).length;
  const practiceTargetCount = practiceTargetExerciseIds.length || practiceExercises.length;
  const score = practiceTargetCount ? Math.round((correct / practiceTargetCount) * 100) : 100;
  const independentScore = practiceTargetCount ? Math.round((independent / practiceTargetCount) * 100) : 100;
  const outstandingPracticeChecks = new Set(practiceQueue.map((exercise) => exercise.id)).size;
  const completedPracticeChecks = Math.max(0, practiceTargetCount - outstandingPracticeChecks);
  const totalSteps = lessonSteps.length + practiceTargetCount;
  const progress = totalSteps
    ? Math.round(((Math.min(step, lessonSteps.length) + completedPracticeChecks) / totalSteps) * 100)
    : 100;
  const masteredChecks = lesson.completedExercises || 0;
  const totalChecks = lesson.exerciseCount || lesson.totalExercises || lesson.exercises.length || 0;
  const unmasteredChecks = (lesson.exercises || []).filter((exercise) => !exercise.mastered);
  const practiceTargetIdSet = new Set(practiceTargetExerciseIds);
  const quietAlternativeChecks = quiet ? (lesson.exercises || []).filter((exercise) => practiceTargetIdSet.has(exercise.id) && exercise.type === "LISTENING_DICTATION") : [];
  const retryingMisses = results.length >= practiceTargetCount && practiceQueue.length > 0;
  const germanLearnedConcepts = guideCards.map((card, index) => germanConceptTitle(lesson, index, card)).slice(0, 5);
  const germanLearningGoals = scheduledReview
    ? [
        `${learnSteps.length} rotierende Modellsätze ohne vorher sichtbare Lösung abrufen`,
        `${practiceTargetCount} gemischte Aufgaben aus dem Lernpaket lösen`,
        "Nur tatsächlich unsichere Inhalte gezielt korrigieren"
      ]
    : germanLearnedConcepts.length
      ? [...germanLearnedConcepts.slice(0, contextBridge || vocabularyLab ? 3 : 5), ...(vocabularyLab ? [`${vocabularyLab.items.length} neue Wörter zuerst im Kontext erschließen`] : []), ...(contextBridge ? ["Bekannte Sätze als Mini-Szene verstehen und selbst fortsetzen"] : [])]
      : [`„${localizedLessonTitle(lesson, "de")}“ in spanischen Beispielen verstehen`, "Das neue Muster ohne Vorlage abrufen"];
  const germanPerformanceTarget = scheduledReview
    ? "Du kannst eine wechselnde Stichprobe des Lernpakets nach Abstand selbstständig produzieren. Andere Inhalte rotieren bei späteren Terminen hinein."
    : germanLessonPerformanceTarget(lesson, quiet);
  const germanLearningRoute = scheduledReview
    ? ["Ohne Vorlage abrufen", "Unsicheres korrigieren", "Gemischt anwenden", "Nächsten Abstand planen"]
    : germanLessonLearningRoute(lesson, quiet);
  const practiceTitle = retryingMisses
    ? nativeLanguage === "de" ? `${practiceQueue.length} unsichere ${practiceQueue.length === 1 ? "Aufgabe" : "Aufgaben"} festigen` : `Fix ${practiceQueue.length} missed ${practiceQueue.length === 1 ? "check" : "checks"}`
    : nativeLanguage === "de" ? `Aktiver Abruf ${Math.min(results.length + 1, practiceTargetCount)}/${practiceTargetCount}` : `Recall ${Math.min(results.length + 1, practiceTargetCount)}/${practiceTargetCount}`;
  const currentStageLabel = current?.type === "overview"
    ? nativeLanguage === "de" ? scheduledReview ? "Wiederholungsplan" : "Lernziel verstehen" : scheduledReview ? "Review plan" : "Understand the goal"
    : current?.type === "guide"
      ? nativeLanguage === "de" ? "Grundlage verstehen" : "Understand the foundation"
        : current?.type === "sound-lab"
          ? nativeLanguage === "de" ? quiet ? "Lautmuster leise erschließen" : "Klang und Aussprache" : quiet ? "Study sound patterns silently" : "Sound and pronunciation"
          : current?.type === "vocabulary"
            ? nativeLanguage === "de" ? "Wörter im Kontext erschließen" : "Build vocabulary from context"
        : current?.type === "reading"
          ? nativeLanguage === "de" ? "Zusammenhängendes Spanisch" : "Connected Spanish"
          : current?.type === "context-bridge"
            ? nativeLanguage === "de" ? "Mini-Szene verstehen und fortsetzen" : "Understand and continue a mini-scene"
          : current?.type === "pattern"
            ? nativeLanguage === "de" ? "Satzmuster aufbauen" : "Build sentence patterns"
            : current?.type === "learn"
              ? nativeLanguage === "de" ? `Modellsatz ${current.index + 1}/${learnSteps.length}` : `Model sentence ${current.index + 1}/${learnSteps.length}`
              : current?.type === "consolidation"
                ? nativeLanguage === "de" ? "Unsichere Sätze festigen" : "Strengthen uncertain sentences"
                : current?.type === "practice-preview"
                  ? nativeLanguage === "de" ? "Mischübung vorbereiten" : "Prepare mixed practice"
                  : retryingMisses
                    ? nativeLanguage === "de" ? "Unsicheres gezielt korrigieren" : "Correct uncertain checks"
                    : nativeLanguage === "de" ? "Aktiv und gemischt abrufen" : "Active mixed retrieval";
  const currentStageNumber = Math.min(
    totalSteps,
    inPractice
      ? lessonSteps.length + Math.min(completedPracticeChecks + 1, practiceTargetCount)
      : step + 1
  );
  const learningPhaseStates = lessonSessionPhaseStates(current?.type, nativeLanguage);

  const advanceLessonStep = () => {
    setStep((value) => {
      return Math.min(value + 1, lessonSteps.length);
    });
  };

  const completeModelSentenceStep = (sentenceIndex, evidence) => {
    if (evidence?.autoScaffolded) {
      setScaffoldedModelSentenceIndexes((currentIndexes) => {
        return currentIndexes.includes(sentenceIndex) ? currentIndexes : [...currentIndexes, sentenceIndex];
      });
    }
    if (modelSentenceNeedsConsolidation(evidence)) {
      setWeakModelSentenceIndexes((currentIndexes) => {
        return currentIndexes.includes(sentenceIndex) ? currentIndexes : [...currentIndexes, sentenceIndex];
      });
    }
    advanceLessonStep();
  };

  const completeContextBridgeStep = (evidence = {}) => {
    if ((evidence.usedSupport || evidence.orthographyWarning) && Number.isSafeInteger(contextBridge?.recallTarget?.sentenceIndex)) {
      setWeakModelSentenceIndexes((currentIndexes) => currentIndexes.includes(contextBridge.recallTarget.sentenceIndex)
        ? currentIndexes
        : [...currentIndexes, contextBridge.recallTarget.sentenceIndex]);
    }
    advanceLessonStep();
  };

  useEffect(() => {
    const node = sessionTopRef.current;
    if (!node) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [lesson.id, step, practiceTurn, finished]);

  const completePracticeAttempt = () => {
    const result = practiceResultRef.current;
    if (!result || result.submissionError) return;

    practiceResultRef.current = null;
    setPracticeQueue((queue) => advanceLessonPracticeQueue(queue, result.correct));
    setPracticeTurn((value) => value + 1);
    refreshDashboard?.({ silent: true }).catch(() => null);
  };

  useEffect(() => {
    if (!finished || completionReported) return;
    setCompletionReported(true);
    setPostLessonPlanLoading(true);
    removeLessonResumeRecord(lessonResumeKey, legacyLessonResumeKeys);
    api(`/api/lessons/${lesson.id}/reinforcement-complete`, {
      method: "POST",
      body: { score, independentScore, introducedWordIds: (vocabularyLab?.items || []).map((word) => word.id) }
    })
      .then(() => refreshDashboard?.({ silent: true }))
      .then((dashboardData) => setPostLessonDashboard(dashboardData || null))
      .catch(() => null)
      .finally(() => setPostLessonPlanLoading(false));
  }, [completionReported, finished, independentScore, lesson.id, lessonResumeKey, refreshDashboard, score]);

  const postLessonPlan = postLessonDashboard?.dailyPlan || null;
  const postLessonTarget = postLessonPlan?.target || null;
  const postLessonTargetLesson = postLessonTarget?.type === "lesson"
    ? (postLessonDashboard?.lessons || []).find((item) => item.id === postLessonTarget.id) || null
    : null;
  const postLessonReviewTotal = postLessonDashboard?.review?.counts?.total || 0;
  const postLessonStep = postLessonTarget?.type === "review"
    ? {
        eyebrow: nativeLanguage === "de" ? "Nächster sinnvoller Schritt" : "Next meaningful step",
        title: nativeLanguage === "de" ? "Fälliges Wissen jetzt kurz festigen" : "Strengthen what is due next",
        detail: nativeLanguage === "de"
          ? `${postLessonReviewTotal} ${postLessonReviewTotal === 1 ? "Abruf ist" : "Abrufe sind"} jetzt bereit. Danach wählt der Tagesplan wieder den passenden Kursinhalt.`
          : `${postLessonReviewTotal} retrieval ${postLessonReviewTotal === 1 ? "item is" : "items are"} ready now.`,
        action: nativeLanguage === "de" ? "Mit Wiederholung weitermachen" : "Continue with review",
        icon: RefreshCw
      }
    : postLessonTarget?.type === "lesson" && postLessonTargetLesson
      ? {
          eyebrow: nativeLanguage === "de" ? "Nächster sinnvoller Schritt" : "Next meaningful step",
          title: localizedLessonTitle(postLessonTargetLesson, nativeLanguage),
          detail: nativeLanguage === "de"
            ? postLessonPlan.kind === "lesson_review"
              ? "Diese Grundlage ist jetzt für einen kompakten Gedächtnischeck fällig. Die Erklärung wird nicht unnötig wiederholt."
              : "Der Tagesplan führt mit dem nächsten passenden Lernpaket weiter. Du kannst hier bewusst stoppen oder direkt anschließen."
            : postLessonPlan.reason || "Continue with the next suitable learning package.",
          action: nativeLanguage === "de"
            ? postLessonPlan.kind === "lesson_review" ? "Gedächtnischeck starten" : "Nächstes Lernpaket starten"
            : postLessonPlan.kind === "lesson_review" ? "Start memory check" : "Start next lesson",
          icon: BookOpen
        }
      : postLessonTarget?.type === "challenge"
        ? {
            eyebrow: nativeLanguage === "de" ? "Nächster sinnvoller Schritt" : "Next meaningful step",
            title: nativeLanguage === "de"
              ? postLessonPlan.kind === "consolidation" ? "Neues jetzt setzen lassen" : "Bekanntes kurz und flexibel anwenden"
              : postLessonPlan.title || "Apply familiar Spanish flexibly",
            detail: nativeLanguage === "de"
              ? postLessonPlan.kind === "consolidation"
                ? "Dieses Lernpaket war für heute genug neuer Stoff. Eine kurze optionale Runde verwendet ausschließlich bereits eingeführte Inhalte; der nächste echte Gedächtnischeck folgt nach einer Lernpause."
                : "Heute ist nichts Dringendes mehr fällig. Eine kurze gemischte Anwendung hält Bekanntes beweglich, ohne neuen Stoff zu erzwingen."
              : postLessonPlan.reason || "Use a short mixed challenge without forcing new material.",
            action: nativeLanguage === "de" ? "Nur Bekanntes kurz festigen" : "Reinforce familiar material",
            icon: Gamepad2
          }
        : null;

  const continueWithPostLessonPlan = () => {
    if (postLessonTarget?.type === "review") setActive?.("review");
    else if (postLessonTarget?.type === "lesson" && postLessonTarget.id) onStartLesson?.(postLessonTarget.id);
    else if (postLessonTarget?.type === "challenge") setActive?.("challenges");
  };

  if (finished) {
    return (
      <section ref={sessionTopRef} tabIndex={-1} aria-label={nativeLanguage === "de" ? "Abgeschlossene Lerneinheit" : "Completed learning session"} className="mx-auto max-w-3xl scroll-mt-24 outline-none">
        <button onClick={onBack} className="mb-4 rounded-md border border-stone-200 bg-white px-4 py-2 font-bold text-slate-600">
          {nativeLanguage === "de" ? "Zurück zum Lernweg" : "Back to map"}
        </button>
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-center shadow-soft">
          <AssetImage imageKey="rewards-and-progress:15" alt="Complete" className="mx-auto h-28 w-28" />
          <h1 className="mt-5 text-3xl font-black">{nativeLanguage === "de" ? (scheduledReview ? "Gedächtnischeck abgeschlossen" : "Lernpaket abgeschlossen") : (scheduledReview ? "Memory check complete" : "Lesson complete")}</h1>
          <p className="mt-2 text-slate-600">{nativeLanguage === "de" ? (scheduledReview ? "Du hast eine rotierende Auswahl ohne erneute Erklärungsrunde abgerufen, Unsicheres korrigiert und den nächsten Abstand vorbereitet." : "Du hast die Bedeutung verstanden, Satzmuster aufgebaut, sie aktiv abgerufen und in Aufgaben gefestigt.") : lesson.reviewSummary || lesson.title}</p>
          <p className="mt-2 text-sm font-bold text-emerald-700">{quietAlternativeChecks.length ? (nativeLanguage === "de" ? `${quietAlternativeChecks.length} ${quietAlternativeChecks.length === 1 ? "Hörziel wurde" : "Hörziele wurden"} heute still aus der Bedeutung rekonstruiert und ${quietAlternativeChecks.length === 1 ? "kehrt" : "kehren"} im Zuhause-Modus als echte Hörübung zurück.` : `${quietAlternativeChecks.length} listening ${quietAlternativeChecks.length === 1 ? "target was" : "targets were"} reconstructed silently and will return as listening practice in home mode.`) : (nativeLanguage === "de" ? (supported || corrected ? "Alle vorgesehenen Aufgaben konnten schließlich richtig gelöst werden. Unterstützte und korrigierte Inhalte gelten noch nicht als dauerhaft sicher und kehren früher zurück." : scheduledReview ? "Alle ausgewählten Abrufe wurden im ersten Versuch sicher gelöst; weitere Inhalte rotieren später hinein." : "Alle vorgesehenen Aufgaben wurden im ersten Versuch selbstständig gelöst.") : (supported || corrected ? "Every required check was eventually solved; supported and corrected material will return sooner." : "All required checks were solved independently on the first attempt."))}</p>
          <div className="mx-auto mt-5 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{nativeLanguage === "de" ? "Selbstständig" : "Independent"}</p>
              <p className="mt-2 text-3xl font-black text-emerald-950">{independent}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-800">{nativeLanguage === "de" ? "im ersten Versuch ohne Hilfe" : "first attempt without support"}</p>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-sky-700">{nativeLanguage === "de" ? "Mit Hilfe" : "Supported"}</p>
              <p className="mt-2 text-3xl font-black text-sky-950">{supported}</p>
              <p className="mt-1 text-xs font-semibold text-sky-800">{nativeLanguage === "de" ? "im ersten Versuch mit Hilfestufe" : "first attempt with a help step"}</p>
            </div>
            <div className="rounded-lg border border-honey-200 bg-honey-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-honey-800">{nativeLanguage === "de" ? "Korrigiert" : "Corrected"}</p>
              <p className="mt-2 text-3xl font-black text-honey-950">{corrected}</p>
              <p className="mt-1 text-xs font-semibold text-honey-900">{nativeLanguage === "de" ? "nach Vergleich erneut richtig abgerufen" : "retrieved correctly after comparison"}</p>
            </div>
          </div>
          {nativeLanguage === "de" && germanLearnedConcepts.length > 0 && (
            <div className="mx-auto mt-5 max-w-2xl rounded-lg border border-stone-200 bg-stone-50 p-4 text-left">
              <p className="font-black text-slate-950">{scheduledReview ? "Diese Grundlage hast du heute gefestigt" : "Das hast du in diesem Paket aufgebaut"}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {germanLearnedConcepts.map((concept) => (
                  <p key={concept} className="flex items-start gap-2 text-sm font-bold leading-5 text-slate-700">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} /> {concept}
                  </p>
                ))}
              </div>
            </div>
          )}
          {nativeLanguage !== "de" && !!lesson.outcomes?.length && (
            <div className="mx-auto mt-5 max-w-md rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left">
              <p className="font-black text-emerald-950">{nativeLanguage === "de" ? "Das kannst du jetzt anwenden" : "You can now"}</p>
              <div className="mt-2 grid gap-2">
                {lesson.outcomes.map((outcome) => (
                  <p key={outcome} className="flex items-start gap-2 text-sm font-bold text-emerald-800">
                    <CheckCircle2 className="mt-0.5 shrink-0" size={16} /> {outcome}
                  </p>
                ))}
              </div>
            </div>
          )}
          {nativeLanguage !== "de" && <LessonRememberBlock lesson={lesson} className="mx-auto mt-5 max-w-md text-left" />}
          <div className="mx-auto mt-5 max-w-sm">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>{nativeLanguage === "de" ? (scheduledReview ? "Gedächtnischeck im ersten Versuch" : "Erster aktiver Abruf") : "First-pass recall score"}</span>
              <span>{score}%</span>
            </div>
            <ProgressBar value={score} className="mt-2" color={score >= 80 ? "bg-emerald-500" : "bg-honey-500"} />
          </div>
          <div className="mx-auto mt-5 flex max-w-lg items-start gap-3 rounded-lg border border-lagoon-200 bg-lagoon-50 p-4 text-left">
            <RefreshCw className="mt-0.5 shrink-0 text-lagoon-700" size={19} />
            <div>
              <p className="font-black text-lagoon-950">{nativeLanguage === "de" ? "So bleibt es im Gedächtnis" : "Keep it in memory"}</p>
              <p className="mt-1 text-sm font-semibold text-lagoon-900">{localizedReviewMoment(nextReviewAt, nativeLanguage)}</p>
              <p className="mt-1 text-xs font-semibold text-lagoon-800">{nativeLanguage === "de" ? "Unterstützte und korrigierte Antworten erhalten bewusst einen kürzeren Abstand." : "Supported and corrected answers deliberately receive a shorter interval."}</p>
            </div>
          </div>
          <div className="mx-auto mt-5 max-w-2xl text-left" aria-live="polite">
            {postLessonPlanLoading ? (
              <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm font-bold text-slate-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-lagoon-500 border-t-transparent" />
                {nativeLanguage === "de" ? "Der nächste sinnvolle Schritt wird aus deinem neuen Lernstand berechnet..." : "Calculating the next meaningful step from your updated progress..."}
              </div>
            ) : postLessonStep ? (
              <div className="overflow-hidden rounded-xl border border-honey-300 bg-honey-50 shadow-sm">
                <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-honey-500 text-white"><postLessonStep.icon size={23} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-honey-800">{postLessonStep.eyebrow}</p>
                    <h2 className="mt-1 text-xl font-black text-slate-950">{postLessonStep.title}</h2>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{postLessonStep.detail}</p>
                  </div>
                  <button onClick={continueWithPostLessonPlan} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-honey-500 px-5 py-3 font-black text-white hover:bg-honey-600 sm:w-auto">
                    {postLessonStep.action} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-slate-600">
                {nativeLanguage === "de" ? "Dein Lernstand ist gespeichert. Kehre zum Lernweg zurück; dort wird der nächste Schritt aus dem aktuellen Stand neu berechnet." : "Your progress is saved. Return to the course map to recalculate the next step from the current state."}
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                removeLessonResumeRecord(lessonResumeKey, legacyLessonResumeKeys);
                setStep(0);
                setResults([]);
                setPracticeTargetExerciseIds(practiceExercises.map((exercise) => exercise.id));
                setResultBanner(null);
                setCompletionReported(false);
                setNextReviewAt(null);
                setPostLessonDashboard(null);
                setPostLessonPlanLoading(false);
                setResumedFromSavedState(false);
                setSessionRun((value) => value + 1);
              }}
              className="rounded-md border border-stone-200 px-4 py-3 font-black text-slate-700 hover:bg-stone-50"
            >
              {nativeLanguage === "de" ? (scheduledReview ? "Andere Stichprobe üben" : "Lernpaket wiederholen") : (scheduledReview ? "Practice another sample" : "Repeat")}
            </button>
            <button onClick={onBack} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600">
              {nativeLanguage === "de" ? "Zurück zum Lernweg" : "Return to map"}
            </button>
            <button onClick={() => setActive?.("talk")} className="inline-flex items-center gap-2 rounded-md bg-coral-500 px-5 py-3 font-black text-white hover:bg-coral-600">
              <Mic size={18} /> {nativeLanguage === "de" ? "Im Gespräch benutzen" : "Use it in conversation"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!current) return null;

  return (
    <section ref={sessionTopRef} tabIndex={-1} aria-label={nativeLanguage === "de" ? "Aktive Lerneinheit" : "Active learning session"} className="mx-auto max-w-3xl scroll-mt-24 outline-none">
      <div className="lesson-session-rail sticky top-[4.5rem] z-20 -mx-1 mb-4 flex items-center gap-2 rounded-lg border border-stone-200 bg-white/95 p-2 shadow-sm backdrop-blur-md sm:mx-0 sm:gap-3" aria-label={nativeLanguage === "de" ? "Orientierung in der Lerneinheit" : "Lesson orientation"}>
        <button onClick={onBack} aria-label={nativeLanguage === "de" ? "Zurück zum Lernweg" : "Back to learning path"} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-2 font-bold text-slate-600 sm:px-4">
          <ArrowLeft size={18} aria-hidden="true" />
          <span className="hidden sm:inline">{nativeLanguage === "de" ? "Zurück" : "Back"}</span>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0" aria-live="polite">
              <p className="truncate text-sm font-black leading-5 text-slate-900">{currentStageLabel}</p>
              <p className="truncate text-[11px] font-bold text-slate-500 sm:text-xs">{localizedLessonTitle(lesson, nativeLanguage)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {resumedFromSavedState && <span className="hidden rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-800 sm:inline-flex">{nativeLanguage === "de" ? "Fortgesetzt" : "Resumed"}</span>}
              {quiet && <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1 text-[10px] font-black text-sky-800"><BookOpen size={12} aria-hidden="true" /> {nativeLanguage === "de" ? "Leise" : "Quiet"}</span>}
              <span className="rounded-full bg-lagoon-50 px-2 py-1 text-[10px] font-black text-lagoon-800" aria-label={nativeLanguage === "de" ? `Schritt ${currentStageNumber} von ${totalSteps}` : `Step ${currentStageNumber} of ${totalSteps}`}>{currentStageNumber}/{totalSteps}</span>
            </div>
          </div>
          <ProgressBar value={progress} className="mt-1.5" label={nativeLanguage === "de" ? `Lektionsfortschritt ${progress} Prozent` : `Lesson progress ${progress} percent`} />
          <div className="mt-1.5 grid grid-cols-4 gap-1" aria-label={nativeLanguage === "de" ? "Lernphasen" : "Learning phases"}>
            {learningPhaseStates.map((phase) => (
              <div
                key={phase.key}
                aria-current={phase.state === "active" ? "step" : undefined}
                className={classNames(
                  "min-w-0 rounded-full px-1.5 py-0.5 text-center text-[9px] font-black leading-3 sm:text-[10px]",
                  phase.state === "complete" && "bg-emerald-100 text-emerald-800",
                  phase.state === "active" && "bg-lagoon-600 text-white shadow-sm",
                  phase.state === "upcoming" && "bg-stone-100 text-slate-500"
                )}
              >
                <span className="sm:hidden" aria-hidden="true">{phase.state === "complete" ? "✓" : phase.state === "active" ? "●" : "·"}</span>
                <span className="hidden truncate sm:block">{phase.label}</span>
                <span className="sr-only sm:hidden">{phase.label}: {phase.state === "complete" ? (nativeLanguage === "de" ? "abgeschlossen" : "complete") : phase.state === "active" ? (nativeLanguage === "de" ? "aktuell" : "current") : (nativeLanguage === "de" ? "folgt" : "upcoming")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuizResultBanner result={resultBanner} className="mb-4" nativeLanguage={nativeLanguage} />

      {current.type === "overview" ? (
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center">
            <AssetImage imageKey={lesson.imageKey} alt={localizedLessonTitle(lesson, nativeLanguage)} className="aspect-square w-full max-w-[170px]" />
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">{nativeLanguage === "de" ? (scheduledReview ? "Fälliger Gedächtnischeck" : "Lernziel") : (scheduledReview ? "Due memory check" : "Lesson focus")}</p>
              <h1 className="mt-3 text-3xl font-black text-slate-950">{localizedLessonTitle(lesson, nativeLanguage)}</h1>
              <p className="mt-3 text-base font-semibold leading-7 text-slate-600">{localizedLessonSummary(lesson, nativeLanguage)}</p>
              {nativeLanguage !== "de" && !!lesson.outcomes?.length && (
                <div className="mt-5 grid gap-2">
                  {lesson.outcomes.map((outcome) => (
                    <p key={outcome} className="flex items-start gap-2 text-sm font-bold text-slate-700">
                      <Target className="mt-0.5 shrink-0 text-lagoon-600" size={16} /> {outcome}
                    </p>
                  ))}
                </div>
              )}
              {nativeLanguage !== "de" && <LessonRememberBlock lesson={lesson} className="mt-5" />}
              {nativeLanguage === "de" && (
                <div className="mt-5 overflow-hidden rounded-lg border border-lagoon-200 bg-lagoon-50">
                  <div className="border-b border-lagoon-200 bg-white/70 px-4 py-3">
                    <p className="flex items-center gap-2 font-black text-lagoon-950">
                      <Target className="shrink-0 text-lagoon-600" size={18} />
                      {scheduledReview ? "Dein kompakter Wiederholungsplan" : lesson.isCheckpoint ? "Das weist du in diesem Checkpoint nach" : "Dein Lernvertrag"}
                    </p>
                  </div>
                  <div className="grid gap-4 p-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{scheduledReview ? "Heute wird abgerufen" : lesson.isCheckpoint ? "Das wird geprüft" : "Das lernst du konkret"}</p>
                      <div className="mt-2 grid gap-2">
                        {germanLearningGoals.map((goal, index) => (
                          <p key={`${goal}-${index}`} className="flex items-start gap-2 text-sm font-bold leading-5 text-slate-800">
                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lagoon-600 text-[11px] font-black text-white">{index + 1}</span>
                            {goal}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md border border-emerald-200 bg-white p-3">
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Am Ende kannst du</p>
                      <p className="mt-1 text-sm font-bold leading-6 text-emerald-950">{germanPerformanceTarget}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{scheduledReview ? "So bleibt es effizient" : lesson.isCheckpoint ? "So läuft der Nachweis" : "So lernst du es"}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {germanLearningRoute.map((stage, index) => (
                          <span key={stage} className="inline-flex items-center gap-1.5 rounded-full border border-lagoon-200 bg-white px-2.5 py-1 text-xs font-black text-slate-700">
                            <span className="text-lagoon-600">{index + 1}</span> {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {nativeLanguage === "de" && !scheduledReview && <GermanLessonBridge lesson={lesson} className="mt-5" />}
              {!!totalChecks && (
                <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm font-black text-slate-700">
                    <span>{nativeLanguage === "de" ? (scheduledReview ? "Rotierende Aufgabenstichprobe heute" : "Bereits sicher gelöste Aufgaben") : (scheduledReview ? "Rotating sample today" : "Current checks mastered")}</span>
                    <span>{scheduledReview ? practiceExercises.length : masteredChecks}/{totalChecks}</span>
                  </div>
                  <ProgressBar value={totalChecks ? Math.round(((scheduledReview ? practiceExercises.length : masteredChecks) / totalChecks) * 100) : 0} className="mt-3" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    {nativeLanguage === "de" ? (scheduledReview ? "Nicht alles auf einmal: Bei späteren Terminen verschiebt sich die Auswahl, bis alle Inhalte erneut abgerufen wurden." : "Eine Aufgabe zählt erst dann als sicher, wenn genau diese Aufgabe mindestens einmal richtig gelöst wurde.") : (scheduledReview ? "The sample rotates across later reviews until every item has returned." : "A check counts here only after that exact exercise has been answered correctly at least once.")}
                  </p>
                </div>
              )}
              {lesson.isCheckpoint && unmasteredChecks.length > 0 && (
                <div className="mt-5 rounded-lg border border-honey-200 bg-honey-50 p-4">
                  <p className="font-black text-honey-900">{nativeLanguage === "de" ? "Noch zu festigende Aufgaben" : "Checks still to master"}</p>
                  <div className="mt-3 grid gap-2">
                    {unmasteredChecks.slice(0, 8).map((exercise) => (
                      <div key={exercise.id} className="rounded-md border border-honey-100 bg-white px-3 py-2">
                        <p className="text-sm font-black text-slate-900">{localizedExercisePrompt(exercise, nativeLanguage)}</p>
                        <p className="mt-1 text-xs font-bold text-slate-600">{localizedExerciseQuestion(exercise, nativeLanguage)}</p>
                      </div>
                    ))}
                  </div>
                  {unmasteredChecks.length > 8 && (
                    <p className="mt-2 text-xs font-bold text-honey-800">{nativeLanguage === "de" ? `${unmasteredChecks.length - 8} weitere Aufgaben brauchen noch eine richtige Antwort.` : `${unmasteredChecks.length - 8} more checks need a correct answer.`}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={advanceLessonStep}
            className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600"
          >
            {nativeLanguage === "de" ? (scheduledReview ? "Gedächtnischeck starten" : lesson.isCheckpoint ? "Checkpoint starten" : "Grundlage verstehen") : (scheduledReview ? "Start memory check" : "Continue")}
          </button>
        </div>
      ) : current.type === "guide" ? (
        <LessonFoundationGuide
          key={`${lesson.id}:foundation`}
          lesson={lesson}
          cards={guideCards}
          nativeLanguage={nativeLanguage}
          quiet={quiet}
          onContinue={advanceLessonStep}
        />
      ) : current.type === "sound-lab" ? (
        <SoundFoundationLab
          key={`${lesson.id}:sound-lab`}
          lab={soundLab}
          lessonId={lesson.id}
          nativeLanguage={nativeLanguage}
          quiet={quiet}
          onContinue={advanceLessonStep}
        />
      ) : current.type === "vocabulary" ? (
        <LessonVocabularyLab
          key={`${lesson.id}:vocabulary`}
          lab={vocabularyLab}
          nativeLanguage={nativeLanguage}
          quiet={quiet}
          grammarFor={localizedWordGrammar}
          PronunciationComponent={PronunciationTools}
          SpeakCheckComponent={SpeakCheck}
          SpanishCharacterComponent={SpanishCharacterBar}
          onContinue={advanceLessonStep}
        />
      ) : current.type === "reading" ? (
        <LessonReadingLab
          key={`${lesson.id}:reading`}
          content={lesson.readingJson}
          lessonId={lesson.id}
          nativeLanguage={nativeLanguage}
          quiet={quiet}
          onContinue={advanceLessonStep}
        />
      ) : current.type === "context-bridge" ? (
        <A1ContextBridgeLab
          key={`${lesson.id}:context-bridge`}
          bridge={contextBridge}
          nativeLanguage={nativeLanguage}
          quiet={quiet}
          onContinue={completeContextBridgeStep}
        />
      ) : current.type === "learn" ? (
        <LessonSentenceStudy
          key={`${lesson.id}:${scheduledReview ? "review" : "learn"}:${current.sentenceIndex}`}
          sentence={current.sentence}
          nativeLanguage={nativeLanguage}
          quiet={quiet}
          initialSupport={Boolean(currentModelSupportReason)}
          supportReason={currentModelSupportReason}
          recallOnly={scheduledReview}
          index={current.index}
          total={learnSteps.length}
          imageKey={currentLearnImageKey}
          onContinue={(evidence) => completeModelSentenceStep(current.sentenceIndex, { ...evidence, autoScaffolded: Boolean(currentModelSupportReason) })}
        />
      ) : current.type === "pattern" ? (
        <LessonPatternLab frames={sentenceFrames} nativeLanguage={nativeLanguage} quiet={quiet} onContinue={advanceLessonStep} />
      ) : current.type === "consolidation" ? (
        <LessonSentenceConsolidation
          key={`${lesson.id}:consolidation`}
          items={weakModelSentences}
          nativeLanguage={nativeLanguage}
          quiet={quiet}
          onContinue={advanceLessonStep}
        />
      ) : current.type === "practice-preview" ? (
        <LessonPracticePreview lesson={lesson} exercises={practiceExercises} nativeLanguage={nativeLanguage} quiet={quiet} onStart={advanceLessonStep} />
      ) : (
        <div className="space-y-4">
          {retryingMisses && (
            <div className="rounded-lg border border-honey-200 bg-honey-50 p-4 text-sm font-semibold text-honey-900">
              {nativeLanguage === "de" ? "Jetzt bleiben nur unsichere Aufgaben übrig. Bereits richtig gelöste Aufgaben bleiben bestanden." : "Only missed checks remain. The checks you already got right stay passed."}
            </div>
          )}
          <PracticePanel
            key={`${current.exercise.id}:${practiceTurn}`}
            title={practiceTitle}
            exercise={current.exercise}
            nativeLanguage={nativeLanguage}
            quiet={quiet}
            source="LESSON"
            shuffleKey={`${lesson.id}:${sessionRun}:${practiceTurn}:${current.exercise.id}`}
            autoAdvance
            autoAdvanceOnWrong={false}
            deferWrongRetry
            correctionAttempt={Boolean(current.exercise.sessionCorrection)}
            requireCorrectToContinue
            autoAdvanceDelay={850}
            autoSubmitChoices
            onReset={() => setResultBanner(null)}
            onResult={(result) => {
              practiceResultRef.current = result;
              setResultBanner(result);
              if (result.submissionError) return;
              setResults((currentResults) => {
                if (currentResults.some((attempt) => attempt.exerciseId === current.exercise.id)) return currentResults;
                return [...currentResults, { exerciseId: current.exercise.id, correct: Boolean(result.correct), usedSupport: Boolean(result.review?.usedSupport) }];
              });
              if (result.correct && result.review?.dueAt) {
                setNextReviewAt((currentDueAt) => {
                  const candidate = new Date(result.review.dueAt);
                  const currentDate = currentDueAt ? new Date(currentDueAt) : null;
                  return !currentDate || candidate < currentDate ? candidate.toISOString() : currentDueAt;
                });
              }
            }}
            onComplete={completePracticeAttempt}
          />
        </div>
      )}
    </section>
  );
}

function A1ContextBridgeLab({ bridge, nativeLanguage = "de", quiet = false, onContinue }) {
  const german = nativeLanguage === "de";
  const [selected, setSelected] = useState(null);
  const [recalling, setRecalling] = useState(false);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const answerInputRef = useRef(null);
  const selectedOption = selected === null ? null : bridge.options[selected];
  const recallResult = useMemo(
    () => checked ? evaluateModelSentenceRecall(answer, bridge.recallTarget.spanish) : { correct: false },
    [answer, bridge.recallTarget.spanish, checked]
  );
  const recallComplete = modelSentenceRecallIsComplete(recallResult);

  const checkRecall = () => {
    if (!answer.trim()) return;
    setAttemptCount((value) => value + 1);
    setChecked(true);
  };

  const retryRecall = () => {
    setAnswer("");
    setChecked(false);
  };

  if (recalling) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-coral-700">{german ? "Mini-Szene aktiv fortsetzen" : "Actively continue the mini-scene"}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{bridge.dialogue ? (german ? "Was antwortet die zweite Person?" : "How does the second person reply?") : (german ? "Wie geht der Zusammenhang weiter?" : "How does the context continue?")}</h1>
        <div className="mt-5 rounded-lg border border-lagoon-200 bg-lagoon-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{bridge.dialogue ? (german ? "Person A" : "Person A") : (german ? "Erster Gedanke" : "First thought")}</p>
          <p className="mt-2 text-xl font-black text-lagoon-950">{bridge.lines[0].spanish}</p>
        </div>
        <div className="mt-4 rounded-lg border border-honey-200 bg-honey-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-honey-700">{german ? "Bedeutungsreiz – antworte auf Spanisch" : "Meaning cue—answer in Spanish"}</p>
          <p className="mt-2 text-lg font-black text-honey-950">{bridge.recallTarget.meaning}</p>
        </div>
        <div className="mt-5 flex gap-2">
          <input
            ref={answerInputRef}
            aria-label={german ? "Spanische Fortsetzung" : "Spanish continuation"}
            value={answer}
            disabled={checked}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") checkRecall(); }}
            className="min-w-0 flex-1 rounded-md border border-stone-200 px-4 py-3 font-bold outline-none focus:border-lagoon-500 disabled:bg-stone-100"
            placeholder={german ? "Auf Spanisch fortsetzen" : "Continue in Spanish"}
          />
          {!checked && <button disabled={!answer.trim()} onClick={checkRecall} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white disabled:opacity-40">{german ? "Prüfen" : "Check"}</button>}
        </div>
        {!checked && <SpanishCharacterBar value={answer} onChange={setAnswer} inputRef={answerInputRef} nativeLanguage={nativeLanguage} />}
        {!checked && !quiet && <div className="mt-3"><SpeakCheck onTranscript={setAnswer} nativeLanguage={nativeLanguage} /></div>}
        {checked && (
          <div className={classNames("mt-4 rounded-lg border p-4", recallResult.accentWarning ? "border-honey-300 bg-honey-50" : recallComplete ? "border-emerald-200 bg-emerald-50" : "border-honey-200 bg-honey-50")}>
            <p className={classNames("font-black", recallResult.accentWarning ? "text-honey-950" : recallComplete ? "text-emerald-900" : "text-honey-900")}>
              {recallResult.accentWarning
                ? (german ? "Inhaltlich richtig. Die vollständige Schreibweise wird in der folgenden Festigungsrunde noch einmal aktiv abgerufen." : "Meaning correct. The complete spelling will be retrieved again in the following consolidation round.")
                : recallComplete
                  ? (german ? (attemptCount > 1 ? "Jetzt sitzt die Fortsetzung – sie wird gleich noch einmal gezielt gefestigt." : "Du hast den zweiten Gedanken selbstständig aus dem Zusammenhang abgerufen.") : (attemptCount > 1 ? "The continuation is secure now and will receive one more focused retrieval." : "You retrieved the second thought independently from context."))
                : (german ? "Noch nicht ganz. Vergleiche kurz das Modell, verstecke es wieder und rufe die Fortsetzung erneut ab." : "Not yet. Compare the model briefly, hide it again, and retrieve the continuation once more.")}
            </p>
            <p className="mt-2 text-xl font-black text-slate-950">{bridge.recallTarget.spanish}</p>
            {!quiet && <div className="mt-2"><PronunciationTools text={bridge.recallTarget.spanish} compact nativeLanguage={nativeLanguage} /></div>}
            {!recallComplete && <button onClick={retryRecall} className="mt-3 rounded-md border border-honey-300 bg-white px-4 py-2 text-sm font-black text-honey-800">{german ? "Modell wieder verstecken und neu versuchen" : "Hide the model and try again"}</button>}
          </div>
        )}
        {recallComplete && <button onClick={() => onContinue?.({ usedSupport: attemptCount > 1, orthographyWarning: recallResult.accentWarning })} className="mt-5 w-full rounded-md bg-emerald-600 px-5 py-3 font-black text-white">{recallResult.accentWarning ? (german ? "Schreibweise zur Festigung vormerken" : "Continue to spelling consolidation") : (german ? "Mini-Szene sicher – weiter zur Festigung" : "Mini-scene secure—continue")}</button>}
      </div>
    );
  }

  const passage = bridge.lines.map((line) => line.spanish).join(" ");
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">{german ? "Vom Einzelsatz zum Zusammenhang" : "From single sentences to context"}</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">{bridge.dialogue ? (german ? "Verstehe den kurzen Wechsel" : "Understand the short exchange") : (german ? "Verbinde zwei bekannte Gedanken" : "Connect two familiar thoughts")}</h1>
      <p className="mt-3 font-semibold leading-6 text-slate-600">{german ? "Die Wörter sind bekannt. Lies jetzt nicht Wort für Wort auf Deutsch, sondern erfasse, was beide spanischen Sätze gemeinsam ausdrücken." : "The words are familiar. Read for what the two Spanish sentences express together instead of translating word by word."}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {bridge.lines.map((line, index) => (
          <div key={`${line.sentenceIndex}:${line.spanish}`} className="rounded-lg border border-lagoon-200 bg-lagoon-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{bridge.dialogue ? `${german ? "Person" : "Person"} ${index ? "B" : "A"}` : `${german ? "Gedanke" : "Thought"} ${index + 1}`}</p>
            <p className="mt-2 text-xl font-black leading-7 text-lagoon-950">{line.spanish}</p>
          </div>
        ))}
      </div>
      {!quiet && <div className="mt-4"><PronunciationTools text={passage} compact allowCopy={false} nativeLanguage={nativeLanguage} /></div>}
      <div className="mt-6 rounded-lg border border-honey-200 bg-honey-50 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-honey-700">{german ? "Schneller Bedeutungscheck" : "Quick meaning check"}</p>
        <p className="mt-2 text-lg font-black text-honey-950">{german ? "Welche Gesamtbedeutung passt genau zu beiden Sätzen?" : "Which overall meaning matches both sentences exactly?"}</p>
        <div className="mt-3 grid gap-2" role="radiogroup" aria-label={german ? "Gesamtbedeutung auswählen" : "Choose the overall meaning"}>
          {bridge.options.map((option, index) => (
            <button
              key={option.text}
              role="radio"
              aria-checked={selected === index}
              onClick={() => setSelected(index)}
              className={classNames("rounded-md border px-4 py-3 text-left font-bold", selected === index ? option.correct ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-800" : "border-honey-200 bg-white text-slate-700")}
            >
              {option.text}
            </button>
          ))}
        </div>
        {selectedOption && <p role="status" aria-live="polite" className={classNames("mt-3 text-sm font-bold", selectedOption.correct ? "text-emerald-800" : "text-red-700")}>{selectedOption.correct ? (german ? "Genau: Beide Informationen sind enthalten. Jetzt verschwindet die zweite Zeile für den aktiven Abruf." : "Exactly: both pieces of information are present. Now the second line will disappear for active recall.") : (german ? "Fast – mindestens ein Detail gehört zu einem anderen Beispielsatz. Vergleiche Subjekt, Handlung und Ergänzung noch einmal." : "Close—at least one detail belongs to another example. Compare the subject, action, and complement again.")}</p>}
        {selectedOption?.correct && <button onClick={() => setRecalling(true)} className="mt-4 rounded-md bg-honey-500 px-5 py-3 font-black text-white">{german ? "Zweite Zeile verstecken und Szene fortsetzen" : "Hide the second line and continue the scene"}</button>}
      </div>
    </div>
  );
}

function LessonReadingLab({ content, lessonId = "", nativeLanguage = "de", quiet = false, onContinue }) {
  const german = nativeLanguage === "de";
  const listening = content?.inputMode === "listening";
  const questions = content?.questions || [];
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [recall, setRecall] = useState(false);
  const [summary, setSummary] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [listeningCompleted, setListeningCompleted] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const summaryInputRef = useRef(null);
  const question = questions[questionIndex];
  const correct = selected === question?.correct;
  const passage = (content?.paragraphs || []).join(" ");
  const recallEvaluation = useMemo(() => evaluateRecallSummary(summary, content?.modelSummary || ""), [summary, content?.modelSummary]);

  const retryRecall = () => {
    setSummary("");
    setModelOpen(false);
  };

  const selectComprehensionAnswer = async (answerIndex) => {
    setSelected(answerIndex);
    const heardAudio = listening && !quiet && listeningCompleted && !audioUnavailable;
    await api("/api/practice-signals", {
      method: "POST",
      body: {
        skill: heardAudio ? "listening" : "reading",
        mode: "connected-comprehension",
        isSuccessful: answerIndex === question?.correct,
        usedSupport: true,
        sourceKey: `${lessonId || "lesson"}:question-${questionIndex + 1}`,
        lessonId,
        targetChannel: listening ? "listening" : null,
        practiceMode: heardAudio ? "home" : "quiet-alternative",
        completesChannelTarget: listening && questionIndex + 1 >= questions.length
      }
    }).catch(() => null);
  };

  useEffect(() => {
    setListeningCompleted(false);
    setAudioUnavailable(false);
  }, [content]);

  if (recall) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-coral-700">{german ? "Text aktiv verdichten" : "Retrieve and condense"}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{german ? "Formuliere die Kernaussage auf Spanisch" : "State the main idea in Spanish"}</h1>
        <p className="mt-3 font-semibold leading-6 text-slate-600">{german ? content.recallPromptDe || "Schreibe einen spanischen Satz, der die wichtigste Veränderung und ihre Folge verbindet." : content.recallPromptEn || "Write one Spanish sentence connecting the main change and its consequence."}</p>
        <textarea ref={summaryInputRef} aria-label={german ? "Spanische Zusammenfassung" : "Spanish summary"} value={summary} disabled={modelOpen} onChange={(event) => setSummary(event.target.value)} className="mt-5 min-h-28 w-full rounded-md border border-stone-200 p-4 font-bold outline-none focus:border-lagoon-500 disabled:bg-stone-100" placeholder={german ? "Deine spanische Zusammenfassung" : "Your Spanish summary"} />
        {!modelOpen && <SpanishCharacterBar value={summary} onChange={setSummary} inputRef={summaryInputRef} nativeLanguage={nativeLanguage} />}
        {!modelOpen ? (
          <div className="mt-3">
            <p className={classNames("text-sm font-bold", recallEvaluation.effortEnough ? "text-emerald-700" : "text-slate-500")}>
              {recallEvaluation.effortEnough
                ? (german ? "Eigener Abruf steht – jetzt erst mit dem Modell vergleichen." : "Your retrieval attempt is ready—now compare it with the model.")
                : (german ? `Schreibe mindestens vier spanische Wörter aus dem Gedächtnis (${recallEvaluation.wordCount}/4).` : `Write at least four Spanish words from memory (${recallEvaluation.wordCount}/4).`)}
            </p>
            <button disabled={!recallEvaluation.effortEnough} onClick={() => setModelOpen(true)} className="mt-3 rounded-md bg-lagoon-500 px-5 py-3 font-black text-white disabled:opacity-40">{german ? "Mit einem Modell vergleichen" : "Compare with a model"}</button>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-4 sm:p-5">
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">{german ? "Abruf ehrlich vergleichen" : "Compare your retrieval honestly"}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-stone-200 bg-white p-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Dein Abruf" : "Your retrieval"}</p>
                <p className="mt-2 font-bold leading-6 text-slate-900">{summary}</p>
              </div>
              <div className="rounded-md border border-sky-200 bg-white p-3">
                <p className="text-xs font-black uppercase tracking-wide text-sky-700">{german ? "Ein mögliches Modell" : "One possible model"}</p>
                <p className="mt-2 font-bold leading-6 text-slate-900">{content.modelSummary}</p>
              </div>
            </div>
            {!!recallEvaluation.concepts.length && (
              <div className="mt-4 rounded-md border border-stone-200 bg-white p-3">
                <p className="text-sm font-black text-slate-900">{german ? "Wortsignale als Kontrollhilfe" : "Word signals as a checking aid"}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{german ? "Das ist keine Bedeutungsnote: Synonyme und andere richtige Formulierungen sind ausdrücklich möglich." : "This is not a semantic score: synonyms and other correct formulations are explicitly possible."}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recallEvaluation.matched.map((word) => <span key={`match-${word}`} className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800">✓ {word}</span>)}
                  {recallEvaluation.missing.slice(0, 5).map((word) => <span key={`missing-${word}`} className="rounded-full border border-honey-300 bg-honey-50 px-2.5 py-1 text-xs font-black text-honey-800">{german ? "Modell:" : "Model:"} {word}</span>)}
                </div>
                {recallEvaluation.signal === "low" && <p className="mt-3 text-sm font-bold text-honey-900">{german ? "Der Wortvergleich erkennt noch wenig gemeinsame Information. Prüfe besonders Hauptaussage, Einschränkung und Folge – oder formuliere bewusst mit passenden Synonymen." : "The word comparison finds little shared information. Check the main point, limitation, and consequence—or verify that you deliberately used fitting synonyms."}</p>}
              </div>
            )}
            <p className="mt-4 text-sm font-semibold text-sky-900">{german ? "Dein Satz muss nicht identisch sein. Entscheide selbst: Sind Hauptaussage und entscheidende Einschränkung beziehungsweise Folge enthalten?" : "Your sentence need not be identical. Decide whether it contains the main point and the decisive limitation or consequence."}</p>
            {listening && <details className="mt-4 rounded-md border border-sky-200 bg-white p-3"><summary className="cursor-pointer font-black text-sky-800">{german ? "Transkript jetzt zum genauen Vergleich öffnen" : "Open transcript for exact comparison"}</summary><div className="mt-3">{(content.paragraphs || []).map((paragraph, index) => <p key={index} className={classNames("font-semibold leading-7 text-slate-800", index > 0 && "mt-3")}>{paragraph}</p>)}</div></details>}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button onClick={retryRecall} className="rounded-md border border-honey-300 bg-white px-4 py-3 font-black text-honey-800">{german ? "Noch unsicher – Modell schließen und neu versuchen" : "Still unsure—hide the model and retry"}</button>
              <button onClick={onContinue} className="rounded-md bg-emerald-600 px-5 py-3 font-black text-white">{german ? "Inhalt getroffen – mit Satzmustern weiter" : "Meaning covered—continue to sentence patterns"}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">{listening ? quiet ? (german ? "Hörinhalt leise als Text erschließen" : "Study listening content as text") : (german ? "Zusammenhängenden Hörtext verstehen" : "Understand connected listening") : (german ? "Zusammenhängenden Text verstehen" : "Understand connected input")}</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">{content.titleEs || content.title}</h1>
      <p className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-4 font-semibold leading-6 text-sky-950">{german ? content.orientationDe : content.orientationEn}</p>
      {listening && !quiet ? (
        <div className="mt-5 rounded-lg border border-lagoon-200 bg-lagoon-50 p-5 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lagoon-600 text-white"><Volume2 size={27} /></div>
          <p className="mt-3 font-black text-lagoon-950">{german ? "Höre zuerst auf die Hauptaussage, dann ein zweites Mal auf Belege und Zeitangaben." : "Listen first for the main point, then again for evidence and time markers."}</p>
          <p className="mt-2 text-sm font-semibold text-lagoon-800">{german ? "Das Transkript bleibt bis nach deiner eigenen Zusammenfassung verborgen." : "The transcript stays hidden until after your own summary."}</p>
          <div className="mt-4">
            <ConnectedSpeechPlayer
              text={passage}
              nativeLanguage={nativeLanguage}
              onComplete={() => setListeningCompleted(true)}
              onUnavailable={() => setAudioUnavailable(true)}
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-5">
          {listening && quiet && <p className="mb-4 rounded-md bg-sky-50 p-3 text-sm font-bold text-sky-900">{german ? "Leisemodus: Dieser Hörinhalt wird heute als Lesetext geübt. Im Zuhause-Modus kannst du ihn später zusätzlich ohne sichtbares Transkript hören." : "Quiet mode: practice this listening content as reading today. You can hear it without the transcript later in home mode."}</p>}
          {(content.paragraphs || []).map((paragraph, index) => <p key={index} className={classNames("text-lg font-semibold leading-8 text-slate-900", index > 0 && "mt-4")}>{paragraph}</p>)}
          {!quiet && !listening && <div className="mt-4"><PronunciationTools text={passage} compact allowCopy={false} nativeLanguage={nativeLanguage} /></div>}
        </div>
      )}
      {listening && !quiet && audioUnavailable && (
        <div className="mt-5 rounded-lg border border-sky-200 bg-sky-50 p-4">
          <p className="font-black text-sky-950">{german ? "Audio ist hier nicht verfügbar – arbeite mit dem vollständigen Lesetext weiter." : "Audio is unavailable here—continue with the complete reading text."}</p>
          <div className="mt-3 rounded-md border border-sky-200 bg-white p-4">
            {(content.paragraphs || []).map((paragraph, index) => <p key={index} className={classNames("font-semibold leading-7 text-slate-800", index > 0 && "mt-3")}>{paragraph}</p>)}
          </div>
        </div>
      )}
      {question && listening && !quiet && !listeningCompleted && !audioUnavailable && (
        <div className="mt-5 rounded-lg border border-honey-200 bg-honey-50 p-4 text-honey-950">
          <p className="text-xs font-black uppercase tracking-wide text-honey-700">{german ? "Erst hören, dann prüfen" : "Listen before checking"}</p>
          <p className="mt-2 font-bold">{german ? "Höre den Text einmal vollständig bis zum Ende. Danach erscheinen die Verständnisfragen; einzelne Abschnitte kannst du anschließend gezielt nachhören." : "Listen to the complete passage once. The comprehension questions will then appear, and you can replay individual sections afterward."}</p>
        </div>
      )}
      {question && (!listening || quiet || listeningCompleted || audioUnavailable) && (
        <div className="mt-5 rounded-lg border border-honey-200 bg-honey-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-honey-700">{german ? `Verständnischeck ${questionIndex + 1}/${questions.length}` : `Comprehension check ${questionIndex + 1}/${questions.length}`}</p>
          <p className="mt-2 text-lg font-black text-honey-950">{german ? question.questionDe : question.questionEn}</p>
          <div className="mt-3 grid gap-2" role="radiogroup" aria-label={german ? "Antwortmöglichkeiten" : "Answer choices"}>
            {(german ? question.optionsDe : question.optionsEn).map((option, index) => (
              <button role="radio" aria-checked={selected === index} key={option} onClick={() => selectComprehensionAnswer(index)} className={classNames("rounded-md border px-4 py-3 text-left font-bold", selected === index ? index === question.correct ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-800" : "border-honey-200 bg-white text-slate-700")}>{option}</button>
            ))}
          </div>
          {selected !== null && <p role="status" aria-live="polite" className={classNames("mt-3 text-sm font-bold", correct ? "text-emerald-800" : "text-red-700")}>{correct ? (german ? question.explanationDe : question.explanationEn) : connectedInputRetryMessage(question, { nativeLanguage, listening, quiet })}</p>}
          {correct && <button onClick={() => { if (questionIndex + 1 >= questions.length) setRecall(true); else { setQuestionIndex((value) => value + 1); setSelected(null); } }} className="mt-4 rounded-md bg-honey-500 px-5 py-3 font-black text-white">{questionIndex + 1 >= questions.length ? (german ? "Text aus dem Gedächtnis verdichten" : "Summarize from memory") : (german ? "Nächste Frage" : "Next question")}</button>}
        </div>
      )}
    </div>
  );
}

function LessonPatternLab({ frames, nativeLanguage, quiet = false, onContinue }) {
  const german = nativeLanguage === "de";
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">{german ? "Sätze erzeugen statt auswendig lernen" : "Generate sentences instead of memorizing them"}</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">{german ? "Baue mit Satzrahmen" : "Build with sentence frames"}</h1>
      <p className="mt-3 max-w-2xl font-semibold leading-6 text-slate-600">{german ? (quiet ? "Der Anfang bleibt stabil. Der letzte Teil verändert die Bedeutung. Lies jeden Satz innerlich mit und achte darauf, welches Stück du austauschen kannst." : "Der Anfang bleibt stabil. Der letzte Teil verändert die Bedeutung. Sprich jeden Satz laut und achte darauf, welches Stück du austauschen kannst.") : (quiet ? "Keep the opening stable, swap the final detail, and rehearse each sentence silently." : "Keep the opening stable and swap the final detail. Say every sentence aloud and notice which part changes.")}</p>
      <div className="mt-5 grid gap-4">
        {frames.map((frame) => (
          <div key={frame.starter} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">{frame.completePhrases ? (german ? "Nützliche feste Wendungen" : "Useful complete phrases") : (german ? "Stabiler Satzanfang" : "Stable sentence opening")}</p>
            {!frame.completePhrases && <p className="mt-2 text-2xl font-black text-coral-600">{frame.starter} <span className="text-slate-400">…</span></p>}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {frame.examples.map((example) => (
                <div key={example.spanish} className="rounded-md border border-stone-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-black text-slate-950">{frame.completePhrases ? example.spanish : <><span className="text-coral-600">{frame.starter}</span> {example.ending}</>}</p>
                    {!quiet && <PronunciationTools text={example.spanish} compact allowCopy={false} nativeLanguage={nativeLanguage} />}
                  </div>
                  {nativeMeaning(example.english, nativeLanguage) && <p className="mt-1 text-xs font-semibold text-slate-500">{nativeMeaning(example.english, nativeLanguage)}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-honey-200 bg-honey-50 p-4">
        <p className="font-black text-honey-950">{german ? "Das eigentliche Lernziel" : "The real learning target"}</p>
        <p className="mt-1 text-sm font-semibold text-honey-900">{german ? "Du musst nicht jeden Beispielsatz als Block speichern. Du sollst den Rahmen erkennen und später selbst eine passende Ergänzung einsetzen können." : "Do not store every example as one block. Learn the frame so you can insert a fitting detail yourself."}</p>
      </div>
      <button onClick={onContinue} className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600">{german ? "Jetzt aktiv abrufen" : "Start active recall"}</button>
    </div>
  );
}

function germanFoundationExplanation(lesson, card) {
  const key = `${lesson.slug || ""} ${lesson.theme || ""} ${card.title || ""}`.toLowerCase();
  if (/personal-a|identified people|direct objects and people/.test(key)) {
    return {
      plain: "Die persönliche a ist keine übersetzbare Präposition, sondern ein spanisches Signal vor einem direkten Objekt, das als konkrete oder identifizierte Person gemeint ist. Du entscheidest zuerst Person oder Sache und danach bestimmt oder noch unbestimmt.",
      why: "Diese Entscheidung muss vor lo, la und weiteren Objektpronomen sitzen. Sonst bleibt unklar, ob a eine empfangende Person, eine Richtung oder gerade das direkte Personenobjekt kennzeichnet.",
      question: "Betrifft die Handlung direkt eine Person oder eine Sache – und ist diese Person konkret identifiziert oder noch beliebig beziehungsweise unbekannt?"
    };
  }
  if (/messages-emails|written-action|open-message-register|request-information-action|explain-context-sequence|reply-point-by-point|follow-up-reminder|written-problem-resolution/.test(key)) {
    return {
      plain: "Eine gute Nachricht ist kein besonders langer Text, sondern ein bearbeitbarer Vorgang. Du machst Beziehung und Anlass sichtbar, ordnest nur relevanten Kontext, beantwortest jeden Punkt und kennzeichnest klar, was bestätigt, beigefügt, noch offen oder als Nächstes erbeten ist.",
      why: "Schriftlich fehlen direkte Rückfragen und Tonfall. Sichtbare Funktionsblöcke entlasten deshalb sowohl dein Arbeitsgedächtnis beim Schreiben als auch die empfangende Person beim Verstehen und Handeln.",
      question: "Welche Funktion fehlt dem Text noch – passende Anrede, Anlass, Kontext, konkrete Bitte, Antwortpunkt, Anhang, offener Status, Frist, Beleg, Lösung oder nächster Schritt?"
    };
  }
  if (/everyday-conversation|show-interest-follow-up|expand-return-answer|tell-short-anecdote|react-personal-news|shift-return-topic|boundary-close-conversation/.test(key)) {
    return {
      plain: "Ein natürliches Gespräch ist keine Sammlung auswendig gelernter Dialoge. Du lernst wiederverwendbare Gesprächszüge: auf ein echtes Detail reagieren, eine Antwort ausbauen, zurückfragen, kurz erzählen, passend Anteil nehmen, Gesprächsfäden reparieren und transparent schließen.",
      why: "Diese kleinen Funktionen reduzieren die Improvisationslast. Du musst nach muy bien, gracias kein völlig neues Thema erfinden, sondern kannst mit einem Detail, einer Anschlussfrage oder einer Rückgabe genau einen sinnvollen nächsten Zug bauen.",
      question: "Was hat mein Gegenüber gerade wirklich mitgeteilt – und brauche ich jetzt Reaktion, Detail, Anschlussfrage, Rückgabe, kurze Geschichte, Reparatur, Übergang oder Abschluss?"
    };
  }
  if (/workplace-collaboration|clarify-work-assignment|report-progress-delay|negotiate-priorities-deadline|request-use-feedback|contribute-meeting-agreement|repair-work-misunderstanding/.test(key)) {
    return {
      plain: "Berufliche Zusammenarbeit wird als sichtbare Handlungskette gelernt: Auftrag und Ergebnis klären, echten Fortschritt melden, Prioritäten samt Folgen aushandeln, Feedback in eine Änderung übersetzen und Missverständnisse sachlich reparieren.",
      why: "Einzelne höfliche Sätze reichen nicht, wenn Ergebnis, Frist oder Verantwortung unterschiedlich verstanden werden. Stabile Gesprächsschritte entlasten das Gedächtnis und erzeugen nach jedem Beitrag einen klaren nächsten Zug.",
      question: "Welche Arbeitsinformation ist noch nicht gemeinsam geklärt – Ergebnis, Umfang, Priorität, Stand, Folge, Handlung, verantwortliche Person oder Kontrolltermin?"
    };
  }
  if (/getting-around|locate-landmarks|follow-short-directions|transport-ticket|departure-and-platform|check-in-at-a-hotel|travel-problem/.test(key)) {
    return {
      plain: "Unterwegs löst du keine lange Erzählung, sondern eine Folge klarer Aufgaben: Ziel finden, einen Wegschritt verstehen, Fahrkartenart wählen, Zeit oder Gleis prüfen, Reservierung nennen und ein konkretes Problem reparieren.",
      why: "Die Trennung senkt die Belastung des Arbeitsgedächtnisses und macht Verständigung prüfbar. Höfliche Formen wie siga oder gire werden zunächst als sichere Servicebausteine verwendet; die vollständige Aufforderungsgrammatik folgt später.",
      question: "Welche einzelne Reiseaufgabe ist gerade offen, welche entscheidende Angabe fehlt und mit welchem kurzen vollständigen Rahmen kann ich sie erfragen, beantworten oder bestätigen?"
    };
  }
  if (/numbers-in-life|numbers-eleven|tens-and-composed|everyday-numbers/.test(key)) {
    return {
      plain: "Zahlen werden nicht als endlose Reihe gelernt. Du sicherst kleine Gruppen, erkennst danach die spanischen Bildungsmuster und verwendest jede Zahl sofort in einem vollständigen Satz über Alter, Datum, Preis, Uhrzeit, Menge oder Kontaktdaten.",
      why: "Das getrennte Abrufen verhindert, dass du eine Zahl nur findest, indem du innerlich bei eins zu zählen beginnst. Der vollständige Satz verbindet Form, Bedeutung und echte Gesprächsfunktion.",
      question: "Welche Funktion hat die Zahl hier, aus welchem Bildungsmuster entsteht sie und welcher vollständige spanische Satzrahmen macht sie unmittelbar verwendbar?"
    };
  }
  if (/essential-present|months-and-calendar|ask-and-tell-the-hour|quarter-half-and-minutes|simple-schedule-dialogue|days-and-clock/.test(key)) {
    return {
      plain: "Dieser Abschlussblock verbindet Präsensformen mit vollständigen Zeitrahmen. Du lernst nicht nur einzelne Tage oder Zahlen, sondern unterscheidest Monat, vollständiges Datum, aktuelle Uhrzeit, Zeitpunkt einer Handlung und eine gemeinsam bestätigte Verabredung.",
      why: "Zeitangaben werden in Gesprächen schnell verwechselt, wenn nur Wörter bekannt sind. Stabile Rahmen wie el tres de septiembre, son las tres y media und a las ocho y cuarto machen Bedeutung und Form gemeinsam abrufbar.",
      question: "Fragt die Situation nach Tag, Datum, aktueller Uhrzeit oder dem Zeitpunkt einer Handlung – und welcher vollständige spanische Rahmen beantwortet genau diese Funktion?"
    };
  }
  if (/personal-profile|age-and-personal|birthday-and-date|family-introductions|home-work-study|languages-you-speak|contact-details/.test(key)) {
    return {
      plain: "Ein erstes Kennenlernen besteht aus kleinen, wiederkehrenden Gesprächsaufgaben: nach Alter, Geburtstag, Familie, Wohnort, Tätigkeit, Sprachen oder Kontaktdaten fragen und jeweils genau diese eine Angabe beantworten.",
      why: "Stabile Frage-Antwort-Rahmen entlasten dein Gedächtnis. Du musst keine ganze Biografie improvisieren, sondern kannst eine vertraute Struktur abrufen, ein persönliches Detail einsetzen und mit ¿Y tú? das Gespräch weitergeben.",
      question: "Welche persönliche Angabe wurde gerade erfragt, welcher spanische Rahmen passt dazu und möchtest du zurückfragen oder eine unklare Angabe gezielt wiederholen lassen?"
    };
  }
  if (/making-plans|invite|decline the detail|repair only|coordination loop/.test(key)) {
    return {
      plain: "Eine Verabredung ist kein einzelner auswendig gelernter Satz, sondern eine kurze Folge von Gesprächsaufgaben: einladen, auf Verfügbarkeit reagieren, Zeit und Ort aushandeln, eine unklare Angabe reparieren und das gemeinsame Ergebnis bestätigen.",
      why: "Diese Funktionskette gibt dir nach jeder Antwort einen klaren nächsten Schritt. Du musst nicht spontan ein ganzes Gespräch erfinden, sondern löst jeweils nur die Information, die gerade noch fehlt.",
      question: "Welche Gesprächsaufgabe ist jetzt offen – Einladung, Antwort, Alternative, Zeit, Ort, Reparatur oder vollständige Bestätigung?"
    };
  }
  if (/participant-object-pronouns|me-te-nos|conversation-participants/.test(key)) {
    return {
      plain: "Me, te und nos verankern ein Objekt direkt in der Gesprächssituation: me verweist auf die sprechende Person, te auf ein vertrautes Gegenüber und nos auf eine Gruppe einschließlich der sprechenden Person. Die Form bleibt gleich, egal ob die Person direkt betroffen ist oder etwas erhält.",
      why: "Im Deutschen unterscheiden mich und mir, dich und dir beziehungsweise uns die Rolle sichtbarer. Im Spanischen zeigen bei me, te und nos vor allem Verb und übrige Ergänzungen, ob die Person direkt betroffen ist oder eine Sache beziehungsweise Information empfängt.",
      question: "Wer spricht, wer ist angesprochen, trifft die Handlung diese Person direkt oder erhält sie etwas – und steht me, te oder nos unmittelbar vor dem konjugierten Verb?"
    };
  }
  if (/indefinite-people-things|positive-negative-agreement|indefinite-negative-checkpoint|indefinite-words|negative-concord/.test(key)) {
    return {
      plain: "Spanische positive und negative Wortpaare bilden ein Bedeutungssystem: alguien/nadie für Personen, algo/nada für Sachen oder Inhalte, siempre/nunca für Häufigkeit und también/tampoco für positive beziehungsweise negative Übereinstimmung.",
      why: "Anders als im Deutschen kann Spanisch no und ein späteres negatives Wort gemeinsam verlangen: no veo a nadie. Steht nadie oder nada dagegen vor dem Verb, trägt es die Verneinung bereits selbst. Die Position gehört deshalb untrennbar zur Bedeutung.",
      question: "Geht es um eine Person, Sache, Häufigkeit oder Übereinstimmung; ist die Aussage positiv oder negativ; und steht das entscheidende Wort vor oder hinter dem Verb?"
    };
  }
  if (/adjective-agreement-position|common-adjective-short-forms|adjective-foundation-checkpoint|adjective-foundation/.test(key)) {
    return {
      plain: "Ein spanisches Adjektiv gehört immer zu einem bestimmten Nomen. Du findest zuerst dieses Nomen, bestimmst Geschlecht und Zahl und bildest danach die passende Adjektivform. Die neutrale Beschreibung steht meist hinter dem Nomen; nur eine kleine häufige Gruppe erhält unmittelbar davor eine Kurzform.",
      why: "Damit lernst du kein loses Endungsrätsel. Dieselbe Entscheidungskette trägt später Vergleiche und Superlative: Erst wenn piso tranquilo, zona tranquila und habitaciones tranquilas sicher sind, lassen sich más tranquilo oder la zona más tranquila zuverlässig bilden.",
      question: "Welches Nomen wird beschrieben, welches Geschlecht und welche Zahl hat es, steht das Adjektiv neutral dahinter oder gehört es zur kleinen Gruppe mit einer Kurzform davor?"
    };
  }
  if (/quantity-noun-adverb|independent-possessives|quantity-possessive-checkpoint|quantity.*possess/.test(key)) {
    return quantityPossessiveFoundationExplanation;
  }
  if (/al-del-contractions|que-cual-selection|contractions-choice-checkpoint|connections-choice/.test(key)) {
    return contractionsChoiceFoundationExplanation;
  }
  if (/c2-sociolinguistic|panhispanic|regional lexicon|address.*social|facework|euphemism|humor.*cultural/.test(key)) {
    return {
      plain: "Spanisch besteht aus mehreren regional und sozial verankerten Systemen. Du lernst, Formen wie vosotros, ustedes und vos, regionale Wörter, Anrede, indirekte Kritik sowie Ironie aus Situation, Beziehung und Region zu verstehen und respektvoll darauf zu reagieren.",
      why: "Soziolinguistische Sicherheit verhindert zwei typische Fehler: eine etablierte Varietät als falsch zu behandeln oder aus einem einzelnen Signal zu viel über Herkunft und Absicht abzuleiten. Breites Verstehen kann dabei mit einer konsequenten eigenen Sprechweise verbunden werden.",
      question: "Welche Region, Beziehung und Gesprächsfunktion erklärt diese Form – und wie stelle ich gemeinsames Verstehen her, ohne die sprachliche Identität meines Gegenübers abzuwerten?"
    };
  }
  if (/c2-genre|lexical precision|idiom|figurative|genre convention|information structure|rhetorical architecture/.test(key)) {
    return {
      plain: "Auf C2 steuerst du nicht nur, was ein Satz sagt, sondern wie er beim jeweiligen Publikum wirkt. Wortverbindungen, Bildsprache, Textsorte, Reihenfolge, Hervorhebung, Rhythmus und Schluss müssen gemeinsam zur Absicht passen.",
      why: "Zwei grammatisch richtige Formulierungen können unterschiedliche Stärke, Haltung oder Textsortenwirkung haben. Wer jede sprachliche Entscheidung an Kontext und Funktion bindet, schreibt und spricht natürlich, präzise und ohne unnötig kompliziert zu klingen.",
      question: "Welche Wirkung soll diese Stelle erfüllen – und welche Wortwahl, Informationsreihenfolge oder Textsortenkonvention erzeugt genau diese Wirkung?"
    };
  }
  if (/c2|precision and mediation|scope|ambiguity|faithful compression|audience mediation|reconcile|connotation/.test(key)) {
    return {
      plain: "Auf C2 formst du eine Aussage um, ohne ihre genaue Reichweite zu verändern. Kernaussage, Quelle, Belegstärke, Einschränkungen, Ausnahmen sowie Haltung und Wirkung müssen auch in einer kürzeren oder verständlicheren Fassung erhalten bleiben.",
      why: "Eine sprachlich elegante Zusammenfassung kann sachlich falsch werden, wenn sie aus einem Zusammenhang eine Ursache, aus einem Durchschnitt eine allgemeine Regel oder aus vorsichtiger Distanz Zustimmung macht. Präzision bedeutet deshalb, vor jeder Umformulierung die bedeutungstragenden Teile sichtbar zu machen.",
      question: "Welche Aussage stammt von wem, wie weit gilt sie, wie sicher ist sie und welche Einschränkung oder Haltung darf beim Umformulieren keinesfalls verschwinden?"
    };
  }
  if (/c1-dense-listening|listening-(structure|self-correction|implicit-purpose|viewpoint-shifts|conditions-exceptions)|dense listening/.test(key)) {
    return {
      plain: "Bei anspruchsvollem Hören musst du nicht jedes Wort gleichzeitig speichern. Zuerst erkennst du Aufbau und Endaussage; danach hörst du gezielt nach, wo eine frühere Formulierung korrigiert, eine Sichtweise zugeordnet oder eine allgemeine Regel eingeschränkt wird.",
      why: "Gesprochene Sprache enthält Wiederholungen, Selbstkorrekturen und Einschübe. Wer alles gleich gewichtet, behält leicht eine verworfene Uhrzeit oder übersieht eine Ausnahme. Struktur und Fokus entlasten das Arbeitsgedächtnis.",
      question: "Welche Aussage gilt am Ende, welches Signal ersetzt oder begrenzt eine frühere Information und welche konkrete Reaktion wird erwartet?"
    };
  }
  if (/c1-mood|mood and meaning|relative reference|future time clauses|concession certainty|purpose prevention|open contingency/.test(key)) {
    return {
      plain: "Indicativo und Subjuntivo benennen nicht einfach Wirklichkeit und Unwirklichkeit. Entscheidend ist, wie du eine Person, Sache oder Handlung präsentierst: konkret behauptet und bekannt – oder gesucht, verneint, zukünftig erwartet, nur möglich beziehungsweise bewusst offengelassen.",
      why: "Damit kannst du mit denselben Konnektoren sehr genaue Bedeutungsunterschiede ausdrücken. Statt Auslöserlisten auswendig zu lernen, triffst du die Formwahl aus Bezug, Zeitlinie, Gewissheit und der Beziehung der handelnden Personen.",
      question: "Ist der Bezug bereits identifiziert und als Information gesetzt – oder soll die Form gerade Suche, Zukunft, Möglichkeit, Zweck oder Offenheit sichtbar machen?"
    };
  }
  if (/c1-pragmatic|implicit meaning|diplomatic|turn management|conversation repair|tone and stance/.test(key)) {
    return {
      plain: "In echten Gesprächen ist die wörtliche Aussage oft nur ein Teil der Botschaft. Situation, Beziehung, Tonfall und Reaktion zeigen zusätzlich, ob jemand bittet, ablehnt, kritisiert, einlenkt, das Wort beansprucht oder ein Missverständnis korrigiert.",
      why: "Wer diese Signale erkennt und selbst gezielt verwendet, kann spontan reagieren, ohne unnötig direkt, unklar oder unhöflich zu wirken. Eine gute Reparatur macht das Problem sichtbar und stellt anschließend gemeinsames Verstehen her.",
      question: "Was wird wörtlich gesagt, welche Handlung ist tatsächlich beabsichtigt und woran lässt sich erkennen, ob das Gegenüber sie richtig verstanden hat?"
    };
  }
  if (/c1-argument|argument and synthesis|evidence|causality|counterargument/.test(key)) {
    return {
      plain: "Eine starke C1-Argumentation trennt sauber zwischen These, beobachtbarem Beleg, eigener Schlussfolgerung, Einschränkung und Empfehlung. Jede Aussage darf nur so weit reichen, wie die sichtbaren Belege tragen.",
      why: "So kannst du komplexe Informationen glaubwürdig zusammenführen, ohne Quellen zu vermischen oder aus einer Korrelation vorschnell eine Ursache zu machen. Faire Gegenargumente stärken dabei die eigene Position.",
      question: "Wer behauptet was, welcher Beleg stützt es, welche alternative Erklärung bleibt möglich und welche Schlussfolgerung ist deshalb wirklich gerechtfertigt?"
    };
  }
  if (/c1-narrative|advanced narration|flashback|foreshadow|narrative voice/.test(key)) {
    return {
      plain: "Fortgeschrittenes Erzählen ordnet nicht nur Vergangenheit. Du steuerst, was als offene Szene, wiederholter Hintergrund, plötzliches Ereignis, frühere Ursache, spätere Erwartung oder Wahrnehmung einer bestimmten Figur erscheint.",
      why: "Diese Entscheidungen bestimmen Tempo, Spannung und Zuverlässigkeit eines Textes. Wer zuerst Bezugspunkt, Ereignisfolge und Informationsquelle klärt, kann komplex erzählen, ohne den Leser zeitlich oder perspektivisch zu verlieren.",
      question: "Wo liegt der aktuelle Erzählpunkt, was geschah davor oder danach und wessen Wissen beziehungsweise Wahrnehmung wird gerade wiedergegeben?"
    };
  }
  if (/c1-register|register and precision|paraphrase|collocation|cohesion/.test(key)) {
    return {
      plain: "Auf C1 reicht ein grammatisch richtiger Satz nicht mehr allein. Du wählst Formulierung, Höflichkeit, Sicherheit und Textverknüpfung passend zu Beziehung, Medium, Absicht und Wirkung.",
      why: "So kannst du denselben Gedanken im Freundeskreis, im Beruf oder in einem formellen Text ausdrücken, ohne ungewollt grob, vage oder künstlich zu klingen. Feste Wortverbindungen entlasten dabei den aktiven Abruf.",
      question: "Wer spricht mit wem, mit welchem Ziel und in welchem Medium – und wie stark oder vorsichtig soll die Aussage wirken?"
    };
  }
  if (/connected listening|b2-listening-|listen once/.test(key)) {
    return {
      plain: "Beim zusammenhängenden Hören teilst du Aufmerksamkeit auf zwei Durchgänge: zuerst Sprecher, Anlass und Hauptaussage; danach entscheidende Einzelheiten wie Zeit, Ort, Gegensatz, Bedingung, Frist und gewünschte Handlung.",
      why: "Wer sofort jedes Wort festhalten will, überlastet das Arbeitsgedächtnis. Ein klarer Hörzweck macht längere Beiträge verständlich und bereitet darauf vor, die Information anschließend selbst weiterzugeben.",
      question: "Welche Information brauchst du im ersten Durchgang für den Gesamtzusammenhang – und welche wenigen Details entscheiden im zweiten über die richtige Reaktion?"
    };
  }
  if (/connected reading|b2-reading-|text skeleton|viewpoints and evidence/.test(key)) {
    return {
      plain: "Beim zusammenhängenden Lesen suchst du zuerst das Textgerüst: Hauptaussage, Problem, Maßnahme, Ergebnis und Schluss. Danach trennst du zugeschriebene Meinungen von beobachtbaren Belegen und verfolgst sprachliche Bezüge.",
      why: "Gutes B2-Lesen bedeutet nicht, jedes Wort sofort zu übersetzen. Wer Struktur und Belege erkennt, kann unbekannte Details einordnen, begründet schlussfolgern und den Inhalt anschließend selbst auf Spanisch wiedergeben.",
      question: "Was behauptet der Text zentral, welche Sätze belegen es und welche Schlussfolgerung ist wirklich durch sichtbare Hinweise gedeckt?"
    };
  }
  if (/verbal periphras|b2-(acabar-de|seguir-continuity|llevar-duration|soler-habits|change-repetition)/.test(key)) {
    return {
      plain: "Verbperiphrasen verbinden ein veränderliches Hilfsverb mit Infinitiv oder Gerundio. Der ganze Rahmen zeigt, ob etwas gerade erst geschah, weiterläuft, schon eine bestimmte Dauer hat, gewöhnlich passiert, beginnt, endet oder erneut geschieht.",
      why: "Diese Rahmen sind in gesprochener Alltagssprache extrem häufig. Mit ihnen beschreibst du den Verlauf einer Handlung wesentlich natürlicher als mit isolierten Zeitformen und langen Umschreibungen.",
      question: "Welche Phase oder zeitliche Perspektive der Handlung soll sichtbar werden – und verlangt der gewählte Rahmen Infinitiv oder Gerundio?"
    };
  }
  if (/past subjunctive|b2-(imperfect-subjunctive|past-wishes|past-reactions|past-perfect-subjunctive|counterfactual)/.test(key)) {
    return {
      plain: "Der vergangene Subjuntivo verbindet einen vergangenen Bedeutungsrahmen – etwa Wunsch, Einfluss, Reaktion oder Zweifel – mit einer weiteren Handlung. Für ein noch früheres eingerahmtes Ereignis verwendest du hubiera plus Partizip.",
      why: "Damit kannst du nicht nur erzählen, was geschah, sondern auch frühere Absichten, Unsicherheit, Bedauern und alternative Ausgänge ausdrücken. Die Formen folgen dabei einer klaren zeitlichen Beziehung.",
      question: "Welcher vergangene Rahmen löst die Form aus – und liegt die eingerahmte Handlung gleichzeitig, später oder bereits davor?"
    };
  }
  if (/se by function|b2-se-|accidental se|passive se/.test(key)) {
    return {
      plain: "Se hat nicht eine einzige Übersetzung. Seine Funktion ergibt sich daraus, wer handelt, ob eine Handlung gegenseitig ist, ob Menschen allgemein gemeint sind oder ob eine betroffene Sache als grammatisches Subjekt die Verbform steuert.",
      why: "Diese Muster stehen überall: in Anzeigen, Regeln, Nachrichten und Erklärungen kleiner Missgeschicke. Wer zuerst Funktion und Subjekt erkennt, braucht keine unverbundene Liste von se-Sonderfällen.",
      question: "Welche Funktion hat se hier – und welches Satzglied bestimmt tatsächlich Singular oder Plural des Verbs?"
    };
  }
  if (/advanced relative|b2-relative|antecedent|cuyo/.test(key)) {
    return {
      plain: "Erweiterte Relativsätze verbinden Informationen, ohne den Bezug unklar zu machen. Du bestimmst zuerst das Bezugswort, erhältst notwendige Präpositionen und wählst dann die Form für Person, Sache, ganzen Gedanken, Besitz oder Umstand.",
      why: "So kannst du längere Beschreibungen und Argumente kompakt aufbauen. Der Satz bleibt verständlich, weil jede Zusatzinformation sichtbar an genau das richtige Element gebunden ist.",
      question: "Worauf bezieht sich der Relativsatz – und verlangt die Beziehung eine Präposition, einen Besitzbezug oder einen Orts-, Zeit- beziehungsweise Artbezug?"
    };
  }
  if (/reported speech|b2-report|indirect|viewpoint/.test(key)) {
    return {
      plain: "Bei der indirekten Rede baust du die Aussage aus einem neuen Blickpunkt neu auf. Entscheidend sind Quelle und Berichtszeitpunkt sowie die Frage, ob das wiedergegebene Ereignis davor, gleichzeitig oder danach liegt.",
      why: "Im echten Gespräch erzählst du ständig weiter, was jemand gesagt, gefragt oder verlangt hat. Wenn Zeit, Person oder Ortsangabe nicht zum neuen Blickpunkt passen, verändert sich unbemerkt die Information.",
      question: "Wer berichtet wann – und liegt die wiedergegebene Handlung vor, gleichzeitig mit oder nach diesem Berichtszeitpunkt?"
    };
  }
  if (/nuanced discourse|b2-discourse|concession|calibrate certainty/.test(key)) {
    return {
      plain: "Auf B2 verbindest du Gedanken nicht nur mit und, aber oder weil. Du zeigst, ob du etwas einräumst, begründest, folgerst, vorsichtig vermutest oder einen ausgewogenen Schluss ziehst.",
      why: "Diese Signale helfen deinem Gegenüber, längeren Beiträgen ohne Rätselraten zu folgen. Gleichzeitig kannst du widersprechen, ohne unnötig absolut oder unhöflich zu wirken.",
      question: "Welche Beziehung soll sichtbar werden: Einräumung, Ursache, Folge, begrenzte Sicherheit, Einschränkung oder Schlussfolgerung?"
    };
  }
  if (/por and para|por-para|relationship/.test(key)) {
    return {
      plain: "Para zeigt meist nach vorn: auf Ziel, Zweck, Empfänger, Frist oder Sichtweise. Por erklärt eher den Hintergrund oder Weg: Ursache, Austausch, Route, Mittel, Häufigkeit oder Dauer.",
      why: "Deutsch verteilt diese Beziehungen auf mehrere Wörter und verwendet zugleich oft „für“ für völlig unterschiedliche Funktionen. Eine einzige Übersetzung reicht daher nicht; die Beziehung im Satz entscheidet.",
      question: "Zeigt die Aussage auf ein Ziel oder einen Empfänger – oder erklärt sie Ursache, Weg, Austausch beziehungsweise Mittel?"
    };
  }
  if (/command|combined pronoun|affirmative|negative tú/.test(key)) {
    return {
      plain: "Bei Aufforderungen entscheidet zuerst die Richtung: Eine bejahte tú-Aufforderung verwendet häufig die él/ella-Form; eine verneinte verwendet no plus Subjuntivo. Pronomen werden bei bejahten Formen angehängt und stehen bei verneinten davor.",
      why: "Diese Muster machen Anweisungen kurz und natürlich. Gleichzeitig verbinden sie bereits bekannte Pronomen mit einer neuen Satzfunktion, statt isolierte Formen neu auswendig zu lernen.",
      question: "Ist die Aufforderung bejaht oder verneint, welche Form brauchst du deshalb und wo müssen bekannte Objektpronomen stehen?"
    };
  }
  if (/conditional|hypoth|podrías|gustaría/.test(key)) {
    return {
      plain: "Das Konditional schafft gedanklichen Abstand: Eine Handlung wäre möglich, wünschenswert oder höflich vorgeschlagen. In hypothetischen si-Sätzen steht die gedachte Bedingung im Imperfecto de subjuntivo und das Ergebnis im Konditional.",
      why: "Diese Formen erlauben dir, nicht nur Tatsachen zu nennen, sondern Möglichkeiten abzuwägen, höflich zu bitten und Ratschläge zu geben – zentrale Fähigkeiten für längere Gespräche.",
      question: "Ist dies ein abgeschwächter Wunsch, eine höfliche Möglichkeit, ein Rat oder das Ergebnis einer nur vorgestellten Bedingung?"
    };
  }
  if (/perfect|participle|past connection|había|haber/.test(key)) {
    return {
      plain: "Perfektformen verbinden ein abgeschlossenes Ereignis mit einem Bezugspunkt. Beim Pretérito perfecto ist das die Gegenwart oder ein noch offener Zeitraum; beim Pluscuamperfecto ist es ein späterer Zeitpunkt in der Vergangenheit.",
      why: "Deutsch und Spanisch verteilen Perfekt und einfache Vergangenheit regional und stilistisch unterschiedlich. Deshalb lernst du zuerst den Zeitbezug und erkennst zugleich mehrere natürliche Varianten.",
      question: "Liegt das Ereignis in einem noch aktuellen Zeitraum, in einem klar abgeschlossenen Zeitraum oder bereits vor einem anderen vergangenen Ereignis?"
    };
  }
  if (/subjunctive|subjuntivo|wish|request|reaction/.test(key)) {
    return {
      plain: "Der Subjuntivo ist kein zweites Wort für Vergangenheit oder Zukunft. Er erscheint häufig, wenn ein erster Satzteil die Handlung einer anderen Person als Wunsch, Einfluss, Bewertung, Gefühl oder Zweifel einordnet.",
      why: "Wenn du ganze Rahmen wie quiero que, es importante que oder me alegra que speicherst, musst du beim Sprechen keine abstrakte Regelliste durchsuchen. Der Rahmen ruft die passende Form mit ab.",
      question: "Wird die folgende Handlung als Tatsache mitgeteilt – oder durch Wunsch, Einfluss, Bewertung, Reaktion beziehungsweise Zweifel eingerahmt?"
    };
  }
  if (/future|condition|prediction|probability/.test(key)) {
    return {
      plain: "Spanisch wählt Zukunftsformen nach der gemeinten Funktion: Ein Termin kann im Präsens stehen, eine aktuelle Absicht mit ir a und eine Vorhersage im Futur. Nach si steht bei einer realistischen Bedingung das Präsens.",
      why: "So lernst du nicht nur Endungen, sondern triffst zuerst die inhaltliche Entscheidung. Genau diese Verbindung zwischen Bedeutung und Form macht die Zukunftsformen später spontan abrufbar.",
      question: "Ist dies ein fester Termin, eine gegenwärtige Absicht, eine Vorhersage, eine Vermutung über jetzt oder eine realistische Bedingung?"
    };
  }
  if (/story|comprehension|main idea|sequence|inference|reported/.test(key)) {
    return {
      plain: "Beim Verstehen einer Geschichte suchst du zuerst das Gerüst: Wer handelt, was verändert sich, wodurch und mit welchem Ergebnis? Konnektoren zeigen Zeit, Gegensatz, Ursache und Folge.",
      why: "Gutes Sprachverstehen bedeutet nicht, jedes Wort sofort zu übersetzen. Wer Beziehungen und Hinweise erkennt, kann auch mit unbekanntem Wortschatz sinnvoll weiterlesen oder zuhören.",
      question: "Welche Information ist ausdrücklich genannt, wie hängen die Ereignisse zusammen und was ist nur eine begründete Vermutung?"
    };
  }
  if (/opinion|connected production|disagree|compare/.test(key)) {
    return {
      plain: "Ein zusammenhängender Beitrag braucht eine erkennbare Funktion: Meinung nennen, begründen, ergänzen, kontrastieren und abschließen. Konnektoren machen diese Beziehungen hörbar.",
      why: "Auf B1-Niveau zählt nicht nur ein richtiger Einzelsatz. Andere müssen verstehen können, wie deine Gedanken zusammengehören und worauf du reagierst.",
      question: "Welche Funktion hat dein nächster Satz: Position, Grund, Ergänzung, Gegensatz oder Schlussfolgerung?"
    };
  }
  if (/past-event|preterite|imperfect|background/.test(key)) {
    return {
      plain: "Spanisch betrachtet Vergangenes aus zwei Perspektiven: als abgeschlossenes Ereignis (Pretérito) oder als laufenden Hintergrund, Zustand beziehungsweise Gewohnheit (Imperfecto).",
      why: "Im Deutschen kann dieselbe Vergangenheitsform beide Perspektiven ausdrücken. Im Spanischen musst du entscheiden, welche Rolle die Handlung in der Geschichte spielt.",
      question: "Bewegt diese Handlung die Geschichte als abgeschlossenes Ereignis weiter, oder beschreibt sie den Hintergrund?"
    };
  }
  if (/object-pronoun|direct object|receiver/.test(key)) {
    return {
      plain: "Ein Objektpronomen verhindert Wiederholungen. Lo, la, los oder las ersetzen eine bereits bekannte Sache; le bezeichnet die Person, die etwas erhält.",
      why: "Diese kleinen Pronomen machen Spanisch natürlicher und ermöglichen kurze Antworten in echten Einkaufs- und Alltagssituationen.",
      question: "Welche Sache oder welche empfangende Person soll im zweiten Satz nicht noch einmal vollständig genannt werden?"
    };
  }
  if (/sound|vowel|consonant|stress|accent|rhythm|intonation|r-rr/.test(key)) {
    return {
      plain: "Verbinde die spanische Schreibweise mit einem verlässlichen Klangziel. Übe zuerst langsam und deutlich; Geschwindigkeit entsteht später durch flüssiges Verbinden.",
      why: "Ein stabiles Laut-Schrift-System entlastet Hören, Lesen, Schreiben und Sprechen gleichzeitig. Du musst neue Wörter dann nicht mehr als vier getrennte Informationen lernen.",
      question: "Welcher Buchstabe, Akzent oder Wortabschluss sagt dir, wie dieser Teil klingt und wo die Betonung liegt?"
    };
  }
  if (/ser|estar|soy|estoy|identity|state/.test(key)) {
    return {
      plain: "Im Deutschen steht in beiden Fällen meist „sein“. Im Spanischen musst du zuerst entscheiden: Beschreibe ich Identität und Einordnung, oder einen Zustand beziehungsweise Ort?",
      why: "Wenn diese Entscheidung früh automatisch wird, musst du später nicht jeden einzelnen Satz als Sonderfall lernen.",
      question: "Frage dich vor dem Sprechen: Was jemand ist – oder wie/wo jemand gerade ist?"
    };
  }
  if (/article|noun|masculine|feminine|plural|agreement/.test(key)) {
    return {
      plain: "Artikel und Nomen gehören als Lernpaket zusammen. Lerne deshalb nicht nur casa, sondern la casa; nicht nur libro, sondern el libro.",
      why: "So speicherst du das Geschlecht direkt mit dem Wort und musst es später nicht jedes Mal neu erraten.",
      question: "Welcher Artikel gehört fest zu diesem Nomen, und müssen weitere Wörter dazu passen?"
    };
  }
  if (/verb|conjug|action|present|routine/.test(key)) {
    return {
      plain: "Die Verbendung trägt Information über die handelnde Person. Lerne die Form deshalb in einem kurzen persönlichen Satz, nicht als isolierte Tabelle.",
      why: "Ein verwendbarer Satz wie trabajo hoy bleibt leichter abrufbar als die abstrakte Information „erste Person Singular“.",
      question: "Wer handelt, welche Endung zeigt das, und welchen kleinen Inhalt kannst du ergänzen?"
    };
  }
  if (/question|donde|que|cuanto|travel/.test(key)) {
    return {
      plain: "Behandle die Frage als fertigen Rahmen. Du hältst den Anfang stabil und ersetzt nur den Ort, Gegenstand oder die Person.",
      why: "Das reduziert die Zahl neuer Entscheidungen beim Sprechen und gibt dir schneller einen vollständigen Satz.",
      question: "Welcher Teil der Frage bleibt immer gleich, und welches Detail kannst du austauschen?"
    };
  }
  if (/quiero|necesito|tengo|food|market|restaurant/.test(key)) {
    return {
      plain: "Der Satzanfang ist dein Werkzeug: quiero, necesito oder tengo. Danach setzt du die Sache oder Handlung ein, die gerade zur Situation passt.",
      why: "Mit einem einzigen stabilen Rahmen kannst du viele echte Bedürfnisse ausdrücken, ohne viele fertige Sätze zu memorieren.",
      question: "Was möchtest, brauchst oder hast du in dieser konkreten Situation?"
    };
  }
  return {
    plain: "Verstehe zuerst die Situation und die Funktion des Satzes. Die deutsche Bedeutung dient als Kontrolle; gespeichert werden soll aber das spanische Muster mit seinem Klang.",
    why: "Bedeutung, Klang, Bild und eigene Verwendung erzeugen mehrere Gedächtniswege. Das hält besser als eine einzelne Übersetzung.",
    question: "Wann würdest du diesen Satz im echten Leben brauchen, und welches Detail könntest du verändern?"
  };
}

const germanConceptTitles = {
  "sound-five-vowels": ["Jedem Vokal ein klares Klangziel geben", "Erst deutlich lesen, dann flüssig verbinden"],
  "sound-consonant-map": ["Den Folgebuchstaben mitlesen", "H und Ñ als spanische Regeln behandeln", "Beide großen C/Z-Aussprachen verstehen"],
  "sound-key-contrasts": ["Den Bedeutungsunterschied zwischen R und RR schützen", "Keinen künstlichen B/V-Gegensatz erzeugen", "Regionale Varianten von LL und Y verstehen"],
  "sound-stress-accents": ["Betonung aus dem Wortende vorhersagen", "Akzentzeichen überschreiben die Grundregel", "Fragewörter behalten ihren Akzent"],
  "sound-rhythm-intonation": ["Wörter nach Bedeutung gruppieren", "Über Wortgrenzen hinweg flüssig verbinden", "Absicht durch Satzmelodie und Betonung zeigen"],
  "sound-foundation-checkpoint": ["Unbekannte Wörter systematisch entschlüsseln", "Betonung und bedeutungsrelevante Kontraste erhalten", "Aus klaren Silben einen vollständigen Gedanken bilden"],
  "absolute-basics": ["Mit kleinen Satzbausteinen beginnen", "Subjektpronomen sind eine Lernhilfe"],
  "ser-estar": ["Ser beschreibt Identität", "Estar beschreibt Zustand und Ort", "Nicht allein nach der Übersetzung entscheiden", "Verb und Personenform gemeinsam wählen"],
  "articles-gender": ["Nomen immer mit Artikel lernen", "Artikel und Nomen müssen zusammenpassen"],
  "present-tense-ar": ["Regelmäßige Verben folgen einem Muster", "Die Verbendung trägt Bedeutung"],
  "essential-present-bridge": ["-er- und -ir-Verben systematisch bilden", "Mit hay Vorhandenes ausdrücken", "Besitzformen nach dem Nomen wählen", "Kalenderdaten und genaue Uhrzeiten als Rahmen bilden"],
  "personal-profile-basics": ["Immer nur die erfragte persönliche Angabe beantworten", "Das Alter mit tener und años ausdrücken", "Ein Datum als festen Rahmen bilden", "Zurückfragen oder eine Angabe gezielt reparieren"],
  "numbers-in-life": ["Zahlen in kleinen Gruppen sichern", "Dieci- und veinti- als Wortmuster erkennen", "Zahlen ab dreißig mit y zusammensetzen", "Zahlen an eine echte Gesprächsfunktion binden"],
  "getting-around-services": ["Immer nur die nächste Reiseaufgabe lösen", "Höfliche Weganweisungen als Servicebausteine verstehen", "Entscheidende Reisedetails getrennt prüfen", "Jede Verständigungsreparatur vollständig abschließen"],
  "estar-emotions": ["Gefühle werden mit estar beschrieben", "Adjektive passen sich der Person an"],
  "ordering-food": ["Mit quiero eine Bitte beginnen", "Zählbare Dinge brauchen oft un oder una"],
  "travel-questions": ["Mit dónde nach einem Ort fragen", "Überlebenssätze kurz und klar halten"],
  "location-prepositions": ["Orte werden mit estar beschrieben", "En deckt mehrere deutsche Präpositionen ab"],
  "plural-agreement": ["Der Plural verändert mehrere Wörter", "Los kann auch gemischte Gruppen bezeichnen"],
  "negation-basics": ["No steht direkt vor dem Verb"],
  "tener-necesitar": ["Tener bedeutet mehr als nur haben", "Necesito drückt einen praktischen Bedarf aus"],
  "question-words": ["Fragewörter tragen Akzente", "Fragen als wiederverwendbare Rahmen lernen"],
  "daily-routine-time": ["Manche Alltagsverben sind reflexiv", "Nicht jedes Alltagsverb braucht me", "Zeitangaben folgen meistens der Handlung"],
  "irregular-present-frames": ["Häufige Verben haben besondere yo-Formen", "Nach Hilfsrahmen folgt der Infinitiv", "Voy a beschreibt einen nahen Plan"],
  "likes-preferences": ["Gustar richtet sich nach der gemochten Sache", "No steht vor dem ganzen me-gusta-Muster", "Prefiero drückt eine Bevorzugung aus"],
  "scenario-practice": ["In Situationen kurz und zweckmäßig antworten", "Quisiera macht Bitten höflicher"],
  "input-comprehension": ["Zuerst die Haupthandlung verstehen", "Das Transkript erst zur Kontrolle verwenden"],
  "personal-a-foundation": ["Das direkte Objekt vor der Markierung bestimmen", "Person und Sache kontrastieren", "Bestimmte und noch unbestimmte Personen unterscheiden", "Die Grenzen bei tener und hay beachten"],
  "object-pronouns-shopping": ["Ein bekanntes Objekt ersetzen", "Das Pronomen vor das konjugierte Verb setzen", "Le bezeichnet die empfangende Person"],
  "participant-object-pronouns": ["Die Gesprächsrollen zuerst bestimmen", "Eine direkt betroffene Person erkennen", "Empfänger und Sache auseinanderhalten", "Das Pronomen vor das konjugierte Verb setzen"],
  "indefinite-people-things": ["Unbekannte Personen und Sachen unterscheiden", "Ein späteres negatives Wort mit no einrahmen", "Ein anfängliches negatives Wort selbst verneinen lassen"],
  "positive-negative-agreement": ["Siempre und nunca als Häufigkeitsgegensatz verwenden", "Mit también einer positiven Aussage folgen", "Mit tampoco einer negativen Aussage folgen"],
  "indefinite-negative-checkpoint": ["Vor der Wortwahl drei Bedeutungsentscheidungen treffen", "Die positive oder negative Richtung der vorherigen Aussage bewahren"],
  "past-events-foundation": ["Abgeschlossene Ereignisse im Pretérito", "Hintergrund und Gewohnheiten im Imperfecto", "Ereignis und Hintergrund verbinden"],
  "describing-comparing-progressive": ["Unterschied und Gleichheit gezielt vergleichen", "Höchsten und niedrigsten Grad markieren", "Entfernung und Kongruenz verbinden", "Gewohnheit von laufender Handlung trennen"],
  "making-plans-interaction": ["Eine Verabredung Schritt für Schritt aufbauen", "Den Zeitpunkt ablehnen, nicht die Beziehung", "Nur die unklare Angabe gezielt reparieren", "Tag, Zeit und Ort gemeinsam bestätigen"],
  "formal-address-service": ["Anzahl und Beziehung vor der Form bestimmen", "Tú, usted und ustedes konsequent bilden", "Höfliche Servicebausteine gezielt verwenden", "Die Anrede ausdrücklich und respektvoll anpassen"],
  "solving-everyday-problems": ["Ein Problem bearbeitbar beschreiben", "Eine Lösung erbitten und Alternativen aushandeln", "Einen Servicetermin vollständig koordinieren", "Verantwortung und Plan B bestätigen"],
  "health-appointments-instructions": ["Beobachtungen statt Diagnosen beschreiben", "Termin und Anmeldung schrittweise bewältigen", "Anweisungen in fünf Bestandteile zerlegen", "Unklares gezielt reparieren und rückbestätigen"],
  "phone-calls-messages": ["Regionale Eröffnungen erkennen und selbst stabil beginnen", "Eine handlungsfähige Nachricht aufbauen", "Ohne sichtbaren Kontext in Hörschichten arbeiten", "Nur Kanal oder entscheidendes Detail reparieren"],
  "workplace-collaboration-coordination": ["Auftrag und erwartetes Ergebnis vor Arbeitsbeginn klären", "Fortschritt, offene Arbeit und Folgen sichtbar machen", "Feedback und Besprechungen in überprüfbare Handlungen übersetzen", "Missverständnis und zugrunde liegenden Ablauf reparieren"],
  "everyday-conversation-relationships": ["Aus einem gehörten Detail sinnvoll weiterfragen", "Kurze Antworten ausbauen und den Gesprächsraum teilen", "Anekdoten begrenzen und auf die Person reagieren", "Gesprächsfäden sichtbar steuern und ehrlich schließen"],
  "messages-emails-written-action": ["Beziehung, Empfänger und Anlass vor dem Schreiben bestimmen", "Eine Bitte in eine bearbeitbare schriftliche Handlung verwandeln", "Jeden erhaltenen Punkt mit sichtbarem Status beantworten", "Einen Vorgang mit Belegen bis zur Lösung weiterführen"],
  "opinions-connected-production": ["Eine klare Meinung einleiten", "Gedanken logisch verbinden", "Höflich reagieren und begründet empfehlen"],
  "stories-comprehension": ["Das Ereignisgerüst zuerst erkennen", "Informationen und Ereignisse verbinden", "Fakten und Schlussfolgerungen unterscheiden"],
  "future-real-conditions": ["Die Zukunftsform nach ihrer Funktion wählen", "Futurformen aus Infinitiv und Stamm bilden", "Reale Bedingungen mit si verbinden"],
  "present-subjunctive-meaning": ["Den Subjuntivo als Bedeutungsrahmen verstehen", "Formen aus der yo-Form aufbauen", "Eingerahmte Handlung und Tatsache unterscheiden"],
  "perfect-past-connections": ["Den Zeitbezug vor der Form wählen", "Haber und Partizip als Einheit aufbauen", "Vorvergangenheit als Reihenfolge verstehen"],
  "conditional-hypotheses": ["Mit dem Konditional gedanklichen Abstand schaffen", "Futurstämme mit Konditionalendungen verbinden", "Bedingung und hypothetisches Ergebnis trennen"],
  "commands-combined-pronouns": ["Bejahte und verneinte Aufforderungen unterscheiden", "Pronomen nach der Satzrichtung platzieren", "Empfänger und Sache in fester Reihenfolge ersetzen"],
  "por-para-relationships": ["Para als Zielrichtung verstehen", "Por als Ursache, Weg oder Austausch verstehen", "Beide Beziehungen im Kontext unterscheiden"],
  "b2-discourse-connectors": ["Einräumen, ohne den Standpunkt aufzugeben", "Beziehungen zwischen Gedanken präzise markieren", "Sicherheit dosieren und Argumente strukturieren"],
  "b2-reported-speech": ["Quelle und Berichtszeitpunkt verankern", "Zeitbeziehungen statt Formen mechanisch verschieben", "Fragen, Personen, Orte und Zeiten neu ausrichten"],
  "b2-relative-clauses": ["Bezugswort und Funktion bestimmen", "Notwendige Präpositionen im Relativsatz erhalten", "Besitz, Ort, Zeit und Art kompakt verbinden"],
  "b2-se-constructions": ["Die Funktion von se aus dem Kontext bestimmen", "Das kongruenzsteuernde Subjekt finden", "Ereignis, handelnde und betroffene Person unterscheiden"],
  "b2-past-subjunctive": ["Die Form aus der Pretérito-Basis ableiten", "Vergangene Wünsche, Einfluss, Reaktionen und Zweifel einrahmen", "Frühere und nicht eingetretene Ereignisse zeitlich ordnen"],
  "b2-verbal-periphrases": ["Handlungsphase vor dem Satzrahmen bestimmen", "Fortdauer und angesammelte Dauer unterscheiden", "Beginn, Ende und Wiederaufnahme präzise markieren"],
  "b2-reading-inference": ["Das Textgerüst vor Einzelheiten erkennen", "Sichtweisen und beobachtbare Belege trennen", "Bezüge verfolgen und nur begründet schlussfolgern"],
  "b2-listening-comprehension": ["Im ersten Hören Anlass und Hauptaussage erfassen", "Im zweiten Hören entscheidende Details verfolgen", "Vor dem Transkript aus dem Gedächtnis zusammenfassen"],
  ...adjectiveFoundationGermanConceptTitles,
  ...quantityPossessiveGermanConceptTitles,
  ...contractionsChoiceGermanConceptTitles,
  ...advancedGermanConceptTitles
};

function germanConceptTitle(lesson, index, card = null) {
  const topicSlug = lesson?.topic?.slug || lesson?.topicSlug || "";
  const authored = germanConceptTitles[topicSlug]?.[index];
  if (authored) return authored;
  const example = card?.example || card?.title;
  return example ? `Satzmuster: ${example}` : `Beispiel ${index + 1} genauer verstehen`;
}

function germanLessonPerformanceTarget(lesson, quiet = false) {
  const title = localizedLessonTitle(lesson, "de");
  const exerciseTypes = new Set((lesson?.exercises || []).map((exercise) => exercise.type));

  if (lesson?.isCheckpoint) {
    return `Du kannst die Inhalte aus „${title}“ ohne Modell erkennen, passend auswählen und selbstständig auf Spanisch produzieren.`;
  }
  if (exerciseTypes.has("DIALOGUE_REPLY")) {
    return `Du kannst „${title}“ in einer kurzen spanischen Gesprächssituation verstehen und mit einem passenden eigenen Satz weiterführen.`;
  }
  if (exerciseTypes.has("READING_COMPREHENSION")) {
    return `Du kannst einen passenden spanischen Text verstehen, entscheidende Hinweise finden und die Kernaussage zu „${title}“ selbst ausdrücken.`;
  }
  if (exerciseTypes.has("LISTENING_DICTATION")) {
    return quiet
      ? `Du kannst die spanischen Aussagen zu „${title}“ leise lesen, unterscheiden und anschließend ohne Vorlage bilden; das Hören bleibt für zu Hause vorgemerkt.`
      : `Du kannst die spanischen Aussagen zu „${title}“ hören, unterscheiden und anschließend ohne Vorlage bilden.`;
  }
  if (["WRITING_PROMPT", "SHORT_ANSWER", "TRANSLATION"].some((type) => exerciseTypes.has(type))) {
    return `Du kannst die Bedeutung zu „${title}“ erkennen und daraus mindestens einen korrekten spanischen Satz ohne Vorlage bilden.`;
  }
  return `Du kannst das Muster zu „${title}“ in spanischen Beispielen erkennen, korrekt zusammensetzen und ohne Vorlage abrufen.`;
}

function germanLessonLearningRoute(lesson, quiet = false) {
  if (lesson?.isCheckpoint) return ["Ohne Erklärung starten", "Wissen aktiv abrufen", "Unsicheres gezielt korrigieren"];
  const topicSlug = lesson?.topic?.slug || lesson?.topicSlug || "";
  if (topicSlug.startsWith("sound-")) {
    return quiet
      ? ["Lautregel verstehen", "Schrift und Betonung visuell unterscheiden", "Innerlich mitsprechen", "Spanisches Modell ohne Vorlage abrufen", "Hören für zu Hause vormerken"]
      : ["Lautregel verstehen", "Hören und unterscheiden", "Nachsprechen und Verständlichkeit prüfen", "Spanisches Modell ohne Vorlage abrufen"];
  }
  const hasListening = (lesson?.exercises || []).some((exercise) => exercise.type === "LISTENING_DICTATION");
  return [
    "Bedeutung verstehen",
    "Muster an Beispielen entdecken",
    "Kurz prüfen",
    "Ohne Vorlage abrufen",
    ...(hasListening && quiet ? ["Hören für zu Hause vormerken"] : [])
  ];
}

function foundationQuickCheck(lesson, index = 0) {
  const key = `${lesson?.topic?.slug || ""} ${lesson?.slug || ""}`.toLowerCase();
  if (/messages-emails|written-action|b1-(open-message-register|request-information-action|explain-context-sequence|reply-point-by-point|follow-up-reminder|written-problem-resolution)|checkpoint-b1-messages-emails/.test(key)) {
    const checks = [
      { question: "Welche Entscheidung steht vor der ersten geschriebenen Zeile?", options: ["Beziehung, Empfänger und Zweck bestimmen", "Möglichst viele Einzelheiten sammeln", "Immer automatisch tú verwenden"], correct: 0, explanation: "Diese drei Größen steuern Anrede, Formenwahl, Ton und die notwendige erste Information." },
      { question: "Wann ist eine höfliche schriftliche Bitte wirklich bearbeitbar?", options: ["Wenn Handlung, kurzer Grund und gegebenenfalls Wunschfrist sichtbar sind", "Wenn sie besonders lang klingt", "Wenn das entscheidende Verb fehlt"], correct: 0, explanation: "Die empfangende Person muss erkennen können, was sie senden, prüfen oder bestätigen soll und warum der Zeitpunkt zählt." },
      { question: "Wie behandelst du eine noch offene Antwort auf einen von drei Punkten?", options: ["Als offen markieren und nächsten Rückmeldezeitpunkt nennen", "So formulieren, als sei sie bestätigt", "Den ganzen Punkt auslassen"], correct: 0, explanation: "Status und nächster Kontrollpunkt verhindern, dass fehlende Information mit einer Zusage verwechselt wird." },
      { question: "Was macht eine schriftliche Problemlösung verhältnismäßig?", options: ["Belegbare Abweichung, praktische Folge und darauf begrenzte Lösung", "Eine Forderung ohne Bezug zum Problem", "Eine vermutete böse Absicht"], correct: 0, explanation: "Beleg und passende Lösung halten den Vorgang prüfbar und geben der anderen Seite einen konkreten Handlungsweg." }
    ];
    return checks[index % checks.length];
  }
  if (/everyday-conversation|b1-(show-interest-follow-up|expand-return-answer|tell-short-anecdote|react-personal-news|shift-return-topic|boundary-close-conversation)|checkpoint-b1-everyday-conversation/.test(key)) {
    const checks = [
      { question: "Welche Anschlussfrage zeigt am deutlichsten, dass du wirklich zugehört hast?", options: ["Eine Frage zu einem konkreten gerade genannten Detail", "Eine vorbereitete Frage zu einem fremden Thema", "Fünf Ja-Nein-Fragen ohne Reaktion"], correct: 0, explanation: "Ein konkreter Bezug verbindet die Gesprächszüge und zeigt, welche Information du aufgenommen hast." },
      { question: "Welcher Dreischritt verhindert nach ¿Cómo estás? die Sackgasse?", options: ["Direkte Antwort, ein Detail, passende Rückfrage", "Nur muy bien wiederholen", "Sofort eine lange Lebensgeschichte erzählen"], correct: 0, explanation: "Das Detail bietet Anschlussmaterial; die verwandte Rückfrage verteilt den Gesprächsraum wieder." },
      { question: "Was gehört in eine kurze Gesprächsanekdote?", options: ["Rahmen, Veränderung, Reaktion, Ergebnis und Rückgabe", "Jede Minute des gesamten Tages", "Nur Namen ohne Ereignis"], correct: 0, explanation: "Die begrenzte Struktur hält die Geschichte verständlich und gibt anschließend der anderen Person wieder Raum." },
      { question: "Wie reparierst du eine eigene Unterbrechung?", options: ["Entschuldigen und den verlorenen Redezug konkret zurückgeben", "Einfach lauter weitererzählen", "Ohne Marker ein anderes Thema öffnen"], correct: 0, explanation: "Die Reparatur benennt den Eingriff und stellt genau die noch nicht beendete Äußerung wieder her." }
    ];
    return checks[index % checks.length];
  }
  if (/workplace-collaboration|b1-(clarify-work-assignment|report-progress-delay|negotiate-priorities-deadline|request-use-feedback|contribute-meeting-agreement|repair-work-misunderstanding)|checkpoint-b1-workplace-collaboration/.test(key)) {
    const checks = [
      { question: "Was muss vor Arbeitsbeginn mehr als nur das Thema klären?", options: ["Erwartetes Ergebnis, Umfang, Priorität und Frist", "Nur eine freundliche Begrüßung", "Nur der Name der Datei"], correct: 0, explanation: "Erst die gemeinsam bestätigten Erwartungen zeigen, ob beide Personen unter demselben Auftrag dasselbe Ergebnis verstehen." },
      { question: "Was macht eine Fortschrittsmeldung handlungsfähig?", options: ["Erledigtes, offenen Teil, Ursache, Folge und Aufholplan trennen", "Nur sagen, dass es schwierig ist", "Zwei unmögliche Fristen gleichzeitig zusagen"], correct: 0, explanation: "Die getrennten Bestandteile zeigen den echten Stand und machen sichtbar, welche Entscheidung oder Hilfe jetzt gebraucht wird." },
      { question: "Wann wird Feedback zu einer überprüfbaren Arbeitsentscheidung?", options: ["Wenn Stärke, konkrete Änderung und eigener nächster Schritt genannt sind", "Sobald jemand danke sagt", "Wenn die Rückmeldung möglichst allgemein bleibt"], correct: 0, explanation: "Ein konkreter Revisionsschritt schützt die Stärke und legt fest, was am Ergebnis tatsächlich verändert wird." },
      { question: "Wie endet die Reparatur eines Missverständnisses belastbar?", options: ["Korrigierte Erwartung und künftige Bestätigungspraxis vereinbaren", "Nur eine schuldige Person bestimmen", "Die alte mehrdeutige Formulierung wiederholen"], correct: 0, explanation: "Die Reparatur muss sowohl das jetzt benötigte Ergebnis als auch den Ablauf klären, der eine erneute Mehrdeutigkeit verhindert." }
    ];
    return checks[index % checks.length];
  }
  if (key.includes("getting-around-services")) {
    const checks = [
      { question: "Welche Frage isoliert das Abfahrtsgleis?", options: ["¿De qué andén sale?", "¿Cuánto cuesta?", "¿Dónde vive?"], correct: 0, explanation: "De qué andén fragt genau nach dem Gleis und vermischt es nicht mit Uhrzeit oder Preis." },
      { question: "Wie behandelst du siga und gire auf A1 sinnvoll?", options: ["Als vollständige höfliche Reisebausteine", "Als Beweis, dass jedes Verb gleich konjugiert wird", "Als Vergangenheitsformen"], correct: 0, explanation: "Die Bausteine sind sofort verständlich und nützlich; das allgemeine Aufforderungssystem wird später systematisch gelernt." },
      { question: "Welche Reaktion passt auf ¿Solo ida o ida y vuelta?", options: ["Ida y vuelta, por favor.", "Sale del andén tres.", "La llave no funciona."], correct: 0, explanation: "Die Frage verlangt nur die Fahrkartenart; eine kurze eindeutige Antwort hält den Ablauf übersichtlich." },
      { question: "Was schließt eine Reparatur nach einer unklaren Zimmernummer ab?", options: ["Die korrigierte Nummer vollständig wiederholen", "Nur gracias sagen", "Ein neues Thema beginnen"], correct: 0, explanation: "Die Wiederholung zeigt, ob die neue Information auf beiden Seiten identisch verstanden wurde." }
    ];
    return checks[index % checks.length];
  }
  if (key.includes("numbers-in-life")) {
    const checks = [
      { question: "Welche Schreibweise folgt dem Muster für Zahlen in den Zwanzigern?", options: ["veinticuatro", "veinte y cuatro", "veinti y cuatro"], correct: 0, explanation: "Die normalen Zahlen von 21 bis 29 werden zusammengeschrieben und beginnen mit veinti-." },
      { question: "Wie wird 35 ab dreißig regelgerecht aufgebaut?", options: ["treinta y cinco", "treintacinco", "treinta cinco"], correct: 0, explanation: "Ab dreißig verbindet y den Zehner und den Einer, wenn beide vorhanden sind." },
      { question: "Warum übst du Tengo veinticuatro años statt nur veinticuatro?", options: ["Damit Zahl und echte Gesprächsfunktion gemeinsam abrufbar werden", "Weil einzelne Zahlen im Spanischen verboten sind", "Damit jede Zahl ein Verb im Infinitiv erhält"], correct: 0, explanation: "Der vollständige Rahmen macht die Zahl unmittelbar als Altersangabe verwendbar." },
      { question: "Wie werden Ziffern einer Telefonnummer verständlich gesprochen?", options: ["Einzeln und in prüfbaren Gruppen", "Immer als eine einzige große Zahl", "Nur als geschriebene Buchstaben"], correct: 0, explanation: "Einzelne Ziffern lassen sich leichter hören, wiederholen und gezielt korrigieren." }
    ];
    return checks[index % checks.length];
  }
  if (key.includes("essential-present-bridge")) {
    const checks = [
      { question: "Welche nosotros-Form gehört zu einem regelmäßigen -ir-Verb?", options: ["vivimos", "vivemos", "viven"], correct: 0, explanation: "Regelmäßige -ir-Verben verwenden bei nosotros die Endung -imos; -er-Verben verwenden -emos." },
      { question: "Welche Form bleibt bei einer oder mehreren vorhandenen Sachen gleich?", options: ["hay", "han", "están"], correct: 0, explanation: "Hay verändert sich in diesem Existenzrahmen weder nach Zahl noch nach Geschlecht." },
      { question: "Woran richtet sich mi oder mis?", options: ["An der Zahl der besessenen Dinge", "An der Zahl der Besitzer", "An der Uhrzeit"], correct: 0, explanation: "Mis libros steht wegen mehrerer Bücher im Plural, unabhängig davon, wie viele Personen sie besitzen." },
      { question: "Welche spanische Uhrzeit entspricht deutschem „halb vier“?", options: ["Son las tres y media.", "Son las cuatro y media.", "Son las tres menos cuarto."], correct: 0, explanation: "Spanisch zählt die halbe Stunde zur bereits begonnenen dritten Stunde: tres y media." }
    ];
    return checks[index % checks.length];
  }
  if (key.includes("personal-profile-basics")) {
    const checks = [
      { question: "Welche Antwort passt direkt auf ¿Cuántos años tienes?", options: ["Tengo veinticuatro años.", "Soy veinticuatro años.", "Estoy veinticuatro."], correct: 0, explanation: "Alter wird im Spanischen mit tener plus Zahl und años ausgedrückt: Tengo veinticuatro años." },
      { question: "Welcher Rahmen nennt ein vollständiges Geburtstagsdatum?", options: ["el doce de mayo", "en doce mayo", "a mayo doce"], correct: 0, explanation: "Ein vollständiges Datum folgt dem Rahmen el + Tageszahl + de + Monat." },
      { question: "Wie hältst du nach deiner eigenen Antwort das Kennenlernen einfach am Laufen?", options: ["Mit ¿Y tú? zurückfragen", "Sofort die ganze Biografie erzählen", "Ohne Bezug das Thema wechseln"], correct: 0, explanation: "¿Y tú? gibt dieselbe kleine Gesprächsaufgabe zurück und schafft einen klaren nächsten Zug." },
      { question: "Was ist bei einer unklaren Telefonnummer die hilfreichste Reparatur?", options: ["Gezielt um Wiederholung der Nummer bitten", "Nur ¿Qué? sagen", "Eine andere Nummer raten"], correct: 0, explanation: "Wenn du die unsichere Angabe benennst, weiß dein Gegenüber genau, welcher Teil wiederholt werden muss." }
    ];
    return checks[index % checks.length];
  }
  const soundChecks = key.includes("sound-five-vowels")
    ? [
        { question: "Was bleibt bei einem spanischen Vokal auch in einer unbetonten Silbe erhalten?", options: ["Ein klares Klangziel", "Nur die ungefähre Wortlänge", "Ein deutscher Doppellaut"], correct: 0, explanation: "Die fünf Vokale bleiben deutlich erkennbar und werden nicht zu einem undeutlichen Mittellaut reduziert." },
        { question: "Wodurch entsteht beim Üben sinnvolles höheres Tempo?", options: ["Durch das Verbinden klarer Silben", "Durch das Verschlucken unbetonter Vokale", "Durch das Auslassen kurzer Wörter"], correct: 0, explanation: "Flüssigkeit baut auf stabilen Lautzielen auf; undeutliche Reduktion erschwert Hören und Verstehen." }
      ]
    : key.includes("sound-consonant-map")
      ? [
          { question: "Was musst du vor der Aussprache von c oder g zuerst ansehen?", options: ["Den folgenden Buchstaben", "Nur die Wortlänge", "Die deutsche Übersetzung"], correct: 0, explanation: "Besonders e und i verändern bei c und g die erwartete Lautzuordnung." },
          { question: "Welche Aussage unterscheidet h und ñ korrekt?", options: ["H bleibt stumm; ñ ist ein eigener Laut", "Beide werden wie deutsches n gesprochen", "Beide bleiben immer stumm"], correct: 0, explanation: "Hola beginnt ohne gesprochenes h; niño enthält dagegen den eigenständigen ñ-Laut." },
          { question: "Wie gehst du mit den etablierten C/Z-Aussprachen verschiedener Regionen um?", options: ["Beide verstehen und für das eigene Sprechen ein Modell konsistent verwenden", "Eine Variante grundsätzlich als Fehler behandeln", "Beide Varianten innerhalb jedes Wortes mischen"], correct: 0, explanation: "Die s-ähnliche und die in Teilen Spaniens th-ähnliche Aussprache sind etablierte regionale Systeme." }
        ]
      : key.includes("sound-key-contrasts")
        ? [
            { question: "Welcher Lautunterschied kann die Wortbedeutung verändern?", options: ["r gegenüber rr", "b gegenüber v in der Standardsprache", "zwei regionale LL/Y-Varianten"], correct: 0, explanation: "Pero und perro sind verschiedene Wörter; der R/RR-Kontrast muss daher hörbar bleiben." },
            { question: "Was ist beim spanischen b und v normalerweise das sinnvolle Lernziel?", options: ["Ein gemeinsames positionsabhängiges Lautsystem verstehen", "Immer deutsches b und v streng trennen", "Beide Buchstaben grundsätzlich auslassen"], correct: 0, explanation: "Die Schreibweise bleibt verschieden, bildet aber normalerweise keinen bedeutungsunterscheidenden Lautkontrast." },
            { question: "Was gilt für ll und y?", options: ["Viele Regionen sprechen sie gleich; etablierte Varianten sind normal", "Nur eine weltweite Aussprache ist korrekt", "Sie werden beide wie deutsches l gesprochen"], correct: 0, explanation: "Rezeptive Breite ist wichtiger als die Abwertung einer regionalen Aussprache." }
          ]
        : key.includes("sound-stress-accents")
          ? [
              { question: "Wo liegt ohne Akzent meist die Betonung bei einem Wort auf Vokal, n oder s?", options: ["Auf der vorletzten Silbe", "Immer auf der ersten Silbe", "Immer auf der letzten Silbe"], correct: 0, explanation: "Diese Endungen führen in der Grundregel zur vorletzten Silbe; andere Konsonantendungen meist zur letzten." },
              { question: "Was leistet ein geschriebenes Akzentzeichen?", options: ["Es markiert Betonung außerhalb der Grundregel oder unterscheidet Bedeutung", "Es verlängert automatisch jeden Vokal", "Es ist nur typografischer Schmuck"], correct: 0, explanation: "Das Zeichen ist bedeutungstragende Rechtschreibung und darf nicht als Dekoration behandelt werden." },
              { question: "Welche Wörter tragen in einer direkten Frage einen Akzent?", options: ["Fragewörter wie qué, dónde und cómo", "Jeder Artikel", "Jedes Verb unabhängig von seiner Form"], correct: 0, explanation: "Der Wortakzent und die öffnenden Fragezeichen erfüllen unterschiedliche, gleichzeitig wichtige Aufgaben." }
            ]
          : key.includes("sound-rhythm-intonation")
            ? [
                { question: "Wie wird ein längerer Satz leichter verständlich?", options: ["Durch kurze Sinngruppen", "Durch eine Pause nach jedem Wort", "Durch möglichst hohes Tempo"], correct: 0, explanation: "Sinngruppen halten zusammengehörige Wörter zusammen und setzen nur bedeutungsvolle Grenzen." },
                { question: "Was geschieht an einer normalen Wortgrenze innerhalb derselben Sinngruppe?", options: ["Die Silben werden flüssig verbunden", "Vor jedem Wort wird ein deutsches h eingesetzt", "Die Stimme muss vollständig abbrechen"], correct: 0, explanation: "Flüssige Verbindung erhält die klaren Vokale, ohne künstliche Pausen oder neue Stimmeinsätze." },
                { question: "Welche Information kann gezielte Satzbetonung sichtbar machen?", options: ["Frage, Korrektur oder Gegensatz", "Nur die Anzahl der Buchstaben", "Das grammatische Geschlecht jedes Nomens"], correct: 0, explanation: "Melodie und Hervorhebung helfen dem Gegenüber, die beabsichtigte Gesprächsfunktion zu erkennen." }
              ]
            : key.includes("sound-foundation-checkpoint")
              ? [
                  { question: "Wie entschlüsselst du ein unbekanntes spanisches Wort zuerst?", options: ["Mit Vokalankern und spanischen Schrift-Klang-Regeln", "Mit deutschen Lautregeln", "Durch zufälliges Raten"], correct: 0, explanation: "Folgebuchstaben, h, ñ, qu, gu und Akzente liefern systematische Hinweise." },
                  { question: "Welche Kontraste verdienen beim Sprechen besondere Aufmerksamkeit?", options: ["Bedeutungsrelevante Unterschiede wie r/rr und Wortbetonung", "Jede regionale Variante als Fehler", "Ein künstlicher deutscher b/v-Gegensatz"], correct: 0, explanation: "Übungszeit gehört zuerst den Merkmalen, die Bedeutung und Verständlichkeit tatsächlich schützen." },
                  { question: "Woraus entsteht natürliche verständliche Aussprache?", options: ["Aus klaren Silben, Sinngruppen und passender Satzmelodie", "Nur aus maximalem Tempo", "Aus einer Pause nach jedem Wort"], correct: 0, explanation: "Natürlichkeit ist organisierte Klarheit, nicht hastiges oder wortweise abgehacktes Sprechen." }
                ]
              : null;
  if (soundChecks) return soundChecks[index % soundChecks.length];
  if (/c2-sociolinguistic-variation|c2-(panhispanic|regional-lexicon|address-social|face-euphemism|humor-cultural)/.test(key)) {
    const checks = [
      { question: "Was ist das sinnvolle Ziel beim Umgang mit vosotros, ustedes und vos?", options: ["Mehrere Systeme verstehen und die eigene gewählte Varietät konsequent verwenden", "Alle Formen in jedem Satz mischen", "Nur eine Region als korrekt anerkennen"], correct: 0, explanation: "Rezeptive Breite und eine konsistente eigene Produktion ergänzen sich; etablierte regionale Systeme werden nicht als Fehler behandelt." },
      { question: "Wie klärst du ein unbekanntes regionales Wort am besten?", options: ["Du fragst neutral nach dem gemeinten Gegenstand oder Vorgang", "Du korrigierst es sofort", "Du leitest daraus sicher die genaue Herkunft ab"], correct: 0, explanation: "Eine neutrale Bedeutungsfrage schafft Verständigung, ohne Identität zu bewerten oder aus einem Signal zu viel zu folgern." },
      { question: "Woran erkennst du eine mögliche ironische Aussage?", options: ["An einem begründeten Kontrast zwischen Wortlaut, Situation, Ton und Reaktion", "An jedem positiven Adjektiv", "Allein an der Satzlänge"], correct: 0, explanation: "Ironie wird aus mehreren zusammenpassenden Signalen erschlossen; eine einzelne Form beweist die Absicht noch nicht." }
    ];
    return checks[index % checks.length];
  }
  if (/c2-genre-rhetoric|c2-(lexical|idiom|genre-conventions|information-structure|rhetorical)/.test(key)) {
    const checks = [
      { question: "Woran erkennst du die präziseste Wortwahl?", options: ["Sie passt zu Bedeutungsnuance, fester Verbindung, Register und Kontext", "Sie ist immer das seltenste Wort", "Sie enthält möglichst viele Silben"], correct: 0, explanation: "Präzision ist funktionale Passung. Ein einfaches Wort kann genauer sein als ein auffälliges Synonym." },
      { question: "Was bleibt beim Wechsel der Textsorte stabil?", options: ["Fakten, kommunikative Absicht und relevante Folgen", "Immer dieselbe Satzstellung", "Alle Fachformeln unabhängig vom Publikum"], correct: 0, explanation: "Reihenfolge, Stimme und Erklärungstiefe dürfen sich ändern; der sachliche Kern und sein Zweck nicht." },
      { question: "Wann verbessert Hervorhebung einen Text?", options: ["Wenn sie den entscheidenden Kontrast sichtbar macht und Bezüge klar bleiben", "Wenn jeder Satz eine Spaltkonstruktion enthält", "Wenn sie neue Fakten ersetzt"], correct: 0, explanation: "Fokus verteilt Aufmerksamkeit. Er hilft nur, solange deutlich bleibt, was hervorgehoben und worauf Bezug genommen wird." }
    ];
    return checks[index % checks.length];
  }
  if (/c2-precision-mediation|c2-(scope|faithful|audience|reconcile|connotation)/.test(key)) {
    const checks = [
      { question: "Was muss eine präzise Kurzfassung neben der Kernaussage bewahren?", options: ["Reichweite, Quelle, Belegstärke und entscheidende Einschränkungen", "Nur möglichst viele Fachwörter", "Immer exakt dieselbe Satzlänge"], correct: 0, explanation: "Eine Kurzfassung darf Details weglassen, aber keine Information, die Geltung, Sicherheit oder Haltung der Aussage verändert." },
      { question: "Wann widersprechen sich zwei Berichte nicht zwingend?", options: ["Wenn sie unterschiedliche Zeiträume, Gruppen oder Messgrößen betrachten", "Wenn einer länger geschrieben ist", "Wenn beide Prozentzahlen enthalten"], correct: 0, explanation: "Vor einer Synthese wird geprüft, was jede Quelle genau definiert, misst und auf welchen Bereich sie sich bezieht." },
      { question: "Was verändert gute sprachliche Vermittlung für ein neues Publikum?", options: ["Wortwahl und Erklärungstiefe, nicht den fachlichen Maßstab", "Die Beleglage zugunsten einer einfachen Botschaft", "Alle Bedingungen und Ausnahmen"], correct: 0, explanation: "Zugängliche Sprache macht Mechanismus und Handlung verständlich, erhält aber Schwellenwerte, Unsicherheit und Bedingungen." }
    ];
    return checks[index % checks.length];
  }
  if (/c1-dense-listening|c1-listening-(structure|self-correction|implicit-purpose|viewpoint-shifts|conditions-exceptions)/.test(key)) {
    const checks = [
      { question: "Was sollte beim ersten Hördurchgang im Mittelpunkt stehen?", options: ["Aufbau, Sprecherabsicht und endgültige Hauptaussage", "Jede einzelne Endung als Diktat", "Das sofortige Öffnen des Transkripts"], correct: 0, explanation: "Ein Bedeutungsgerüst schafft Platz, um beim gezielten zweiten Hören Korrekturen und Bedingungen richtig einzuordnen." },
      { question: "Was geschieht mit einer Angabe vor «perdón, quería decir …»?", options: ["Sie wird durch die folgende Korrektur ersetzt", "Sie bleibt automatisch die wichtigste Angabe", "Sie wird zu einer Frage"], correct: 0, explanation: "Mündliche Selbstkorrekturen sind Teil des Sprechflusses; behalten werden muss die endgültige Formulierung." },
      { question: "Warum wird eine Ausnahme getrennt von der Grundregel gespeichert?", options: ["Weil sie Reichweite und richtige Handlung für einen Sonderfall verändert", "Weil Ausnahmen nie wichtig sind", "Nur um den Hörtext länger zu machen"], correct: 0, explanation: "Wörter wie salvo que oder sin embargo können entscheiden, ob eine Handlung, Frist oder Bedingung überhaupt gilt." }
    ];
    return checks[index % checks.length];
  }
  if (/c1-mood-meaning|c1-(relative-reference|future-time|concession-certainty|purpose-prevention|open-contingency)/.test(key)) {
    const checks = [
      { question: "Warum steht in busco a alguien que hable alemán der Subjuntivo?", options: ["Die gesuchte Person ist noch nicht identifiziert", "Jeder Relativsatz verlangt Subjuntivo", "Hablar bezeichnet keine wirkliche Fähigkeit"], correct: 0, explanation: "Der Relativsatz definiert ein gewünschtes Profil, behauptet aber noch keine konkrete vorhandene Person." },
      { question: "Was unterscheidet cuando llegó von cuando llegue?", options: ["Llegó verankert ein realisiertes Ereignis; llegue eine noch ausstehende Zeitgrenze", "Nur die sprechende Person", "Llegue ist einfach eine höflichere Vergangenheit"], correct: 0, explanation: "Die Moduswahl zeigt, ob der Zeitpunkt bereits als Ereignis gesetzt ist oder erst eintreten muss." },
      { question: "Wann steht nach para häufig ein Infinitiv statt para que plus Subjuntivo?", options: ["Wenn dieselbe Person beide Handlungen ausführt", "Wenn die Handlung besonders wichtig ist", "Nur in negativen Sätzen"], correct: 0, explanation: "Bleibt das handelnde Subjekt gleich, verbindet para meist direkt den Infinitiv; ein neues explizites Subjekt braucht para que plus Subjuntivo." }
    ];
    return checks[index % checks.length];
  }
  if (/c1-pragmatic-interaction|c1-(implicit|diplomatic|turn-management|conversation-repair|tone-stance)/.test(key)) {
    const checks = [
      { question: "Warum kann ¿Te importaría cerrar la ventana? mehr als eine Informationsfrage sein?", options: ["Situation und konventionelle Form machen daraus eine höfliche Bitte", "Jede Frage ist automatisch ein Befehl", "Das Verb cerrar steht immer für Kritik"], correct: 0, explanation: "Die beabsichtigte Handlung entsteht aus Ausdruck, Situation und Beziehung – hier wird höflich um eine konkrete Handlung gebeten." },
      { question: "Was macht eine abgeschwächte Kritik trotzdem klar?", options: ["Sie nennt das konkrete Problem und die erforderliche Änderung", "Sie vermeidet jede problematische Einzelheit", "Sie besteht nur aus einem Lob"], correct: 0, explanation: "Höflichkeit schützt die Beziehung; Klarheit zeigt weiterhin, was warum geändert werden soll." },
      { question: "Wie wird ein Missverständnis zuverlässig beendet?", options: ["Die beabsichtigte Bedeutung wird neu formuliert und anschließend bestätigt", "Der gleiche mehrdeutige Satz wird lauter wiederholt", "Beide wechseln ohne Klärung das Thema"], correct: 0, explanation: "Reformulierung plus Bestätigung stellt gemeinsamen Gesprächsboden wieder her." }
    ];
    return checks[index % checks.length];
  }
  if (/c1-argument-synthesis|c1-(thesis|evidence|source|counterargument|synthesis)/.test(key)) {
    const checks = [
      { question: "Was macht eine These wissenschaftlich und sprachlich belastbar?", options: ["Sie ist klar eingegrenzt und durch die vorhandenen Belege prüfbar", "Sie behauptet möglichst viel", "Sie verzichtet auf jede Einschränkung"], correct: 0, explanation: "Eine präzise These nennt ihren Geltungsbereich und behauptet nicht mehr, als anschließend begründet werden kann." },
      { question: "Was folgt aus zwei gleichzeitig beobachteten Veränderungen?", options: ["Zunächst nur ein Zusammenhang, nicht automatisch eine bewiesene Ursache", "Immer eine eindeutige Kausalität", "Dass alle anderen Erklärungen ausgeschlossen sind"], correct: 0, explanation: "Für eine kausale Aussage müssen alternative Erklärungen und die zeitliche beziehungsweise methodische Grundlage geprüft werden." },
      { question: "Was leistet ein gutes Gegenargument?", options: ["Es stellt die stärkste relevante Einwendung fair dar und prüft ihre Reichweite", "Es verspottet die Gegenposition", "Es wechselt zu einem leichteren Thema"], correct: 0, explanation: "Eine faire Darstellung zeigt, welchen Teil der eigenen These die Einwendung tatsächlich berührt und welcher Teil bestehen bleibt." }
    ];
    return checks[index % checks.length];
  }
  if (/c1-narrative-viewpoint|c1-(narrative|flashback|viewpoint|participial)/.test(key)) {
    const checks = [
      { question: "Was verlangsamt eine Erzählung typischerweise?", options: ["Offene Beschreibung und laufender Hintergrund", "Eine dichte Reihe kurzer abgeschlossener Ereignisse", "Nur ein Ausrufezeichen"], correct: 0, explanation: "Imperfecto und beschreibende Einzelheiten halten die Szene offen; kurze Pretérito-Ereignisse treiben sie voran." },
      { question: "Was zeigt descubriría aus einem vergangenen Erzählpunkt?", options: ["Ein damals noch späteres Ereignis", "Eine Gewohnheit vor dem Erzählpunkt", "Eine sichere Gegenwart"], correct: 0, explanation: "Das Konditional kann Zukunft aus der Sicht eines vergangenen Bezugspunkts ausdrücken." },
      { question: "Wann ist eine verdichtete Partizipialkonstruktion klar?", options: ["Wenn Bezug und handelnde Person eindeutig bleiben", "Wenn möglichst viele Subjekte ausgelassen werden", "Nur wenn kein Verb folgt"], correct: 0, explanation: "Verdichtung ist nur hilfreich, solange eindeutig bleibt, wer handelt und wie die Information zeitlich zum Hauptsatz steht." }
    ];
    return checks[index % checks.length];
  }
  if (/c1-register-precision|c1-/.test(key)) {
    const checks = [
      { question: "Was entscheidet zuerst über eine passende C1-Formulierung?", options: ["Adressat, Beziehung, Medium und Absicht", "Nur die Länge des Satzes", "Möglichst seltene Wörter"], correct: 0, explanation: "Register ist eine kommunikative Entscheidung; schwierigere Wörter sind nicht automatisch angemessener." },
      { question: "Was muss eine gute Paraphrase unbedingt bewahren?", options: ["Kernaussage und Stärke der Behauptung", "Jede ursprüngliche Wortfolge", "Die gleiche Satzlänge"], correct: 0, explanation: "Form und Register dürfen sich ändern, die wesentliche Aussage und ihre Begrenzungen jedoch nicht." },
      { question: "Warum lernst du tener en cuenta als Einheit?", options: ["Die feste Verbindung wird schneller und natürlicher abgerufen", "Jedes Verb hat nur ein mögliches Nomen", "Einzelwörter sind auf C1 verboten"], correct: 0, explanation: "Häufige Wortpartnerschaften reduzieren Entscheidungen beim Sprechen und verhindern unnatürliche Kombinationen." }
    ];
    return checks[index % checks.length];
  }
  if (/b2-listening-comprehension|b2-listening-/.test(key)) {
    const checks = [
      { question: "Was ist das Ziel des ersten Hörens?", options: ["Sprecher, Anlass und Hauptaussage erkennen", "Jedes Wort exakt mitschreiben", "Sofort das Transkript öffnen"], correct: 0, explanation: "Der erste Durchgang baut ein Gerüst, in das Einzelheiten beim zweiten Hören eingeordnet werden." },
      { question: "Welche Details verdienen beim zweiten Hören besondere Aufmerksamkeit?", options: ["Zeit, Ort, Änderung, Bedingung und gewünschte Handlung", "Nur besonders lange Wörter", "Alle Artikel unabhängig vom Sinn"], correct: 0, explanation: "Diese Details entscheiden häufig darüber, wie du die Nachricht verstehen und darauf reagieren musst." },
      { question: "Wann wird das Transkript geöffnet?", options: ["Nach eigener Zusammenfassung und Verständnisprüfung", "Vor dem ersten Hören", "Statt des Hörens"], correct: 0, explanation: "Der späte Vergleich erhält die Höranforderung und macht anschließend überhörte Formen sichtbar." }
    ];
    return checks[index % checks.length];
  }
  if (/b2-reading-inference|b2-reading-/.test(key)) {
    const checks = [
      { question: "Was suchst du vor der Übersetzung einzelner Details?", options: ["Hauptaussage und Textgerüst", "Jede Verbendung isoliert", "Nur unbekannte Nomen"], correct: 0, explanation: "Das Gerüst ordnet Details nach Problem, Reaktion, Ergebnis und Schluss ein." },
      { question: "Was unterscheidet einen Beleg von einer Sichtweise?", options: ["Ein Beleg beruht auf beobachtbaren Daten oder Ereignissen", "Eine Sichtweise enthält immer Zahlen", "Beides ist grundsätzlich identisch"], correct: 0, explanation: "Berichtsverben schreiben Meinungen einer Quelle zu; Messungen und beobachtete Veränderungen können sie stützen oder begrenzen." },
      { question: "Wann ist eine Schlussfolgerung begründet?", options: ["Wenn konkrete Hinweise im Text auf sie zeigen", "Wenn sie nur wahrscheinlich klingt", "Wenn kein Satz dazu passt"], correct: 0, explanation: "Eine B2-Inferenz verbindet vorhandene Hinweise, ohne mehr zu behaupten, als der Text trägt." }
    ];
    return checks[index % checks.length];
  }
  if (/b2-verbal-periphrases|b2-(acabar-de|seguir-continuity|llevar-duration|soler-habits|change-repetition)/.test(key)) {
    const checks = [
      { question: "Was bedeutet acabo de llegar?", options: ["Ich bin gerade angekommen", "Ich werde irgendwann ankommen", "Ich komme gewöhnlich an"], correct: 0, explanation: "Acabar de plus Infinitiv setzt ein abgeschlossenes Ereignis unmittelbar vor den Bezugspunkt." },
      { question: "Was ergänzt llevar im Muster llevo dos años estudiando?", options: ["Die bisher angesammelte Dauer", "Einen plötzlichen Beginn", "Eine einmalige Aufforderung"], correct: 0, explanation: "Llevar verbindet eine Zeitspanne mit einer Handlung, die bis zum Bezugspunkt weiterläuft." },
      { question: "Welcher Rahmen zeigt eine Wiederaufnahme oder Wiederholung?", options: ["Volver a + Infinitiv", "Dejar de + Infinitiv", "Acabar de + Infinitiv"], correct: 0, explanation: "Volver a zeigt, dass eine Handlung erneut geschieht oder wieder aufgenommen wird." }
    ];
    return checks[index % checks.length];
  }
  if (/b2-past-subjunctive|b2-(imperfect-subjunctive|past-wishes|past-reactions|past-perfect-subjunctive|counterfactual)/.test(key)) {
    const checks = [
      { question: "Aus welcher Form wird hablara zuverlässig abgeleitet?", options: ["Aus hablaron ohne -ron", "Direkt aus hablaré", "Aus dem Partizip hablado"], correct: 0, explanation: "Die 3. Person Plural des Pretérito liefert den Stamm: hablaron → hablara." },
      { question: "Warum steht in quería que vinieras der Subjuntivo?", options: ["Ein vergangener Wunsch rahmt die Handlung einer anderen Person ein", "Jeder vergangene Satz braucht Subjuntivo", "Weil venir immer unregelmäßig ist"], correct: 0, explanation: "Der Wunsch im vergangenen Rahmen löst die Form für die eingerahmte Handlung aus." },
      { question: "Welche Verteilung passt zu einer irrealen Vergangenheit?", options: ["Si hubiera..., habría...", "Si habría..., hubiera...", "Si había..., ha..."], correct: 0, explanation: "Die nicht eingetretene Bedingung steht mit hubiera; ihr gedachtes Ergebnis mit habría." }
    ];
    return checks[index % checks.length];
  }
  if (/b2-se-constructions|b2-se-/.test(key)) {
    const checks = [
      { question: "Warum kann se nicht mit einem einzigen deutschen Wort gelernt werden?", options: ["Es erfüllt je nach Satz verschiedene Funktionen", "Es bedeutet immer sich", "Es steht ausschließlich im Passiv"], correct: 0, explanation: "Kontext und Satzbau unterscheiden reflexive, gegenseitige, unpersönliche, passive und unbeabsichtigte Lesarten." },
      { question: "Warum heißt es se venden dos casas?", options: ["Casas ist das pluralische grammatische Subjekt", "Se verlangt immer Plural", "Dos verändert jedes Verb"], correct: 0, explanation: "Im Passiv mit se steuert die betroffene Sache die Kongruenz." },
      { question: "Was bezeichnet me in „se me cayeron las llaves“?", options: ["Die betroffene Person", "Das grammatische Subjekt", "Eine Ortsangabe"], correct: 0, explanation: "Me zeigt, wem das Missgeschick passiert; las llaves steuert die Verbform cayeron." }
    ];
    return checks[index % checks.length];
  }
  if (/b2-relative-clauses|b2-relative/.test(key)) {
    const checks = [
      { question: "Wann passt lo que statt que?", options: ["Wenn kein konkretes Nomen vorausgeht oder ein ganzer Gedanke gemeint ist", "Nur nach einem Personennamen", "Ausschließlich bei Ortsangaben"], correct: 0, explanation: "Lo que bezieht sich auf etwas nicht eigens Benanntes oder auf die gesamte vorherige Aussage." },
      { question: "Was geschieht mit de in „hablar de“ innerhalb eines Relativsatzes?", options: ["Es bleibt vor der Relativform erhalten", "Es wird immer gelöscht", "Es wird durch con ersetzt"], correct: 0, explanation: "Die vom Verb verlangte Beziehung bleibt bestehen, etwa el tema del que hablamos." },
      { question: "Womit stimmt cuyo überein?", options: ["Mit dem besessenen Nomen", "Immer mit dem Besitzer", "Mit dem Verb des Hauptsatzes"], correct: 0, explanation: "In una autora cuyos libros bewundere ich die Autorin, aber cuyos stimmt mit libros überein." }
    ];
    return checks[index % checks.length];
  }
  if (/b2-reported-speech|b2-report/.test(key)) {
    const checks = [
      { question: "Was entscheidest du vor jeder Zeitverschiebung?", options: ["Berichtszeitpunkt und zeitliche Beziehung der Handlung", "Nur die Länge des Satzes", "Ob ein Artikel vorkommt"], correct: 0, explanation: "Die Form folgt daraus, ob das Ereignis vor, gleichzeitig mit oder nach dem Berichtszeitpunkt liegt." },
      { question: "Warum steht in „dijo que había terminado“ había terminado?", options: ["Das Beenden geschah vor dem Sagen", "Das Beenden liegt immer in der Zukunft", "Nach que steht ausnahmslos Plusquamperfekt"], correct: 0, explanation: "Das Pluscuamperfecto markiert hier ein Ereignis, das bereits vor der vergangenen Aussage abgeschlossen war." },
      { question: "Was muss neben der Verbzeit häufig ebenfalls angepasst werden?", options: ["Personen-, Orts- und Zeitbezüge", "Die spanische Zeichensetzung muss verschwinden", "Jedes Nomen wird in den Plural gesetzt"], correct: 0, explanation: "Wörter wie yo, aquí oder mañana müssen vom neuen Sprecher-, Orts- und Zeitstandpunkt aus stimmen." }
    ];
    return checks[index % checks.length];
  }
  if (/b2-discourse-connectors|b2-(concession|cause|hedging|structured)/.test(key)) {
    const checks = [
      { question: "Was leistet aunque am Anfang eines Arguments?", options: ["Es räumt einen Punkt ein und lässt die Hauptaussage weiterbestehen", "Es beendet jedes Argument", "Es markiert ausschließlich eine Zeitangabe"], correct: 0, explanation: "Eine Einräumung erkennt einen Umstand an, ohne die folgende Hauptaussage aufzugeben." },
      { question: "Welche Aufgabe hat por lo tanto?", options: ["Es führt eine logische Folge ein", "Es nennt eine unbekannte Person", "Es schwächt ein einzelnes Nomen ab"], correct: 0, explanation: "Por lo tanto zeigt, welche Konsequenz aus der vorherigen Information folgt." },
      { question: "Warum ist hasta donde sé für B2 nützlich?", options: ["Es begrenzt eine Aussage auf den eigenen Wissensstand", "Es macht jede Aussage sicher wahr", "Es ersetzt alle Vergangenheitsformen"], correct: 0, explanation: "Der Rahmen macht transparent, dass die Aussage nur innerhalb des eigenen Wissens gilt." }
    ];
    return checks[index % checks.length];
  }
  if (/object-pronoun/.test(key)) {
    const checks = [
      { question: "Woran richtet sich lo, la, los oder las?", options: ["An der ersetzten Sache", "Am Geschlecht des Sprechers", "An der Tageszeit"], correct: 0, explanation: "Das Pronomen stimmt mit dem direkten Objekt überein, das es ersetzt." },
      { question: "Wo steht das Objektpronomen in den geübten Präsenssätzen?", options: ["Vor dem konjugierten Verb", "Immer am Satzende", "Zwischen Artikel und Nomen"], correct: 0, explanation: "In diesen Mustern steht es direkt vor dem konjugierten Verb." },
      { question: "Was bezeichnet le in „Le doy el libro“?", options: ["Das Buch", "Die empfangende Person", "Die Handlung"], correct: 1, explanation: "Le bezeichnet, wem das Buch gegeben wird." }
    ];
    return checks[index % checks.length];
  }
  if (/past-event/.test(key)) {
    const checks = [
      { question: "Welche Perspektive passt zu einem abgeschlossenen Ereignis gestern?", options: ["Pretérito", "Imperfecto als Hintergrund", "Gegenwart"], correct: 0, explanation: "Ein begrenztes, abgeschlossenes Ereignis wird im Pretérito erzählt." },
      { question: "Welche Perspektive passt zu einer früheren Gewohnheit mit siempre?", options: ["Imperfecto", "Nur Pretérito", "Zukunft"], correct: 0, explanation: "Wiederholte Gewohnheiten und laufender Hintergrund stehen typischerweise im Imperfecto." },
      { question: "Was geschieht in „Estaba en casa cuando llamó Ana“?", options: ["Beide Verben sind gleichartige Einzelereignisse", "Estaba setzt den Hintergrund, llamó ist das Ereignis", "Llamó beschreibt nur das Wetter"], correct: 1, explanation: "Das Imperfecto setzt die Szene; das Pretérito lässt etwas darin geschehen." }
    ];
    return checks[index % checks.length];
  }
  if (/opinion|connected-production/.test(key)) {
    const checks = [
      { question: "Wozu dient creo que am Satzanfang?", options: ["Es kennzeichnet eine persönliche Einschätzung", "Es markiert immer Vergangenheit", "Es ersetzt jede Begründung"], correct: 0, explanation: "Der Rahmen macht deutlich, dass nun eine persönliche Meinung folgt." },
      { question: "Welcher Konnektor führt einen Gegensatz ein?", options: ["Además", "Sin embargo", "Por eso"], correct: 1, explanation: "Sin embargo stellt einen Gegensatz oder eine Einschränkung zum vorherigen Gedanken her." },
      { question: "Welche Reaktion hält eine Meinungsverschiedenheit offen?", options: ["No.", "Entiendo tu punto, pero...", "Eso es falso."], correct: 1, explanation: "Zuerst anerkennen, dann den eigenen Kontrast formulieren." }
    ];
    return checks[index % checks.length];
  }
  if (/stories-comprehension|story|inference|relative-que/.test(key)) {
    const checks = [
      { question: "Was suchst du beim ersten Lesen einer kurzen Geschichte zuerst?", options: ["Person, zentrales Ereignis und Ergebnis", "Die Übersetzung jedes einzelnen Wortes", "Nur alle Verbendungen"], correct: 0, explanation: "Das Ereignisgerüst gibt dir Orientierung; Details können danach ergänzt werden." },
      { question: "Welche Aufgabe haben primero, luego und por último?", options: ["Sie ordnen Ereignisse zeitlich", "Sie markieren immer Zweifel", "Sie ersetzen die handelnde Person"], correct: 0, explanation: "Diese Signale helfen, die Reihenfolge einer Geschichte zu rekonstruieren." },
      { question: "Was zeigt probablemente in einer Aussage?", options: ["Eine begründete Vermutung", "Eine direkt bewiesene Tatsache", "Eine Aufforderung"], correct: 0, explanation: "Probablemente hält eine Schlussfolgerung sprachlich von einer sicheren Tatsache getrennt." }
    ];
    return checks[index % checks.length];
  }
  if (/future-real-conditions|future|condition/.test(key)) {
    const checks = [
      { question: "Welche Form passt besonders gut zu einer bereits bestehenden Absicht?", options: ["Ir a + Infinitiv", "Nur das Imperfecto", "Si + Futur"], correct: 0, explanation: "Ir a verbindet eine gegenwärtige Absicht mit der folgenden Handlung." },
      { question: "Woran werden die regelmäßigen Futurendungen angehängt?", options: ["An den vollständigen Infinitiv", "Nur an die yo-Form", "An das Partizip"], correct: 0, explanation: "Hablar, comer und vivir bleiben vollständig erhalten: hablaré, comeremos, vivirán." },
      { question: "Welche Form steht nach si in einer realistischen Zukunftsbedingung?", options: ["Präsens", "Einfaches Futur", "Immer Imperfecto"], correct: 0, explanation: "Im Muster si llueve, me quedaré en casa steht die Bedingung im Präsens." }
    ];
    return checks[index % checks.length];
  }
  if (/present-subjunctive|subjunctive|subjuntivo/.test(key)) {
    const checks = [
      { question: "Was verbindet quiero que vengas?", options: ["Meinen Wunsch mit der Handlung einer anderen Person", "Zwei sichere Tatsachen", "Nur zwei Zeitformen"], correct: 0, explanation: "Quiero rahmt ein, was die andere Person tun soll; deshalb steht vengas im Subjuntivo." },
      { question: "Wie entsteht eine regelmäßige Subjuntivo-Form im Präsens?", options: ["Von der yo-Form ohne -o mit der gegensätzlichen Vokalreihe", "Immer aus dem Partizip", "Durch Anhängen der Futurendung"], correct: 0, explanation: "Hablar: hablo → hable; comer: como → coma; vivir: vivo → viva." },
      { question: "Welche Aussage präsentiert arbeiten als angenommene Tatsache?", options: ["Creo que trabaja", "No creo que trabaje", "Quiero que trabaje"], correct: 0, explanation: "Ein positiver Glaube mit creo que verwendet normalerweise den Indikativ." }
    ];
    return checks[index % checks.length];
  }
  if (/perfect-past-connections|perfect|participle/.test(key)) {
    const checks = [
      { question: "Welche Perspektive passt in Spanien typischerweise zu hoy, wenn der Tag noch läuft?", options: ["Pretérito perfecto", "Nur Imperfecto", "Pluscuamperfecto"], correct: 0, explanation: "Hoy he trabajado betrachtet das Ereignis innerhalb des noch aktuellen Tages." },
      { question: "Was verändert sich in han llegado?", options: ["Haber passt sich an; llegado bleibt unverändert", "Llegado wird feminin oder plural", "Beide Wörter bleiben immer gleich"], correct: 0, explanation: "Mit haber bleibt das Partizip unverändert; die Personeninformation steckt in he, has, ha, hemos oder han." },
      { question: "Was zeigt había salido in einer Geschichte?", options: ["Das Verlassen geschah vor einem anderen vergangenen Bezugspunkt", "Das Verlassen geschieht gerade jetzt", "Es ist nur eine Zukunftsabsicht"], correct: 0, explanation: "Das Pluscuamperfecto ordnet ein Ereignis vor einem weiteren Zeitpunkt in der Vergangenheit ein." }
    ];
    return checks[index % checks.length];
  }
  if (/conditional-hypotheses|conditional|hypoth/.test(key)) {
    const checks = [
      { question: "Was bewirkt das Konditional in ¿Podrías ayudarme??", options: ["Es macht die Bitte höflicher und weniger direkt", "Es beschreibt eine abgeschlossene Vergangenheit", "Es befiehlt eine Handlung"], correct: 0, explanation: "Podrías öffnet eine höfliche Möglichkeit statt direkt zu fordern." },
      { question: "Welche Grundlage verwendet tendría?", options: ["Den unregelmäßigen Stamm tendr- mit -ía", "Das Partizip tenido", "Die Präsensform tengo ohne Änderung"], correct: 0, explanation: "Die unregelmäßigen Stämme von Futur und Konditional sind gleich." },
      { question: "Welche Kombination passt zu einer gegenwärtigen Hypothese?", options: ["Si tuviera..., viajaría...", "Si tendría..., viajara...", "Si tendré..., viajaré..."], correct: 0, explanation: "Nach si steht das Imperfecto de subjuntivo; das gedachte Ergebnis steht im Konditional." }
    ];
    return checks[index % checks.length];
  }
  if (/commands-combined-pronouns|command|pronouns-with/.test(key)) {
    const checks = [
      { question: "Welche Formen bilden ein passendes Gegensatzpaar?", options: ["Habla. / No hables.", "Hablas. / No hablar.", "Hable. / No hablas."], correct: 0, explanation: "Die bejahte tú-Aufforderung lautet habla; die verneinte no hables." },
      { question: "Wo steht lo in einer bejahten Aufforderung?", options: ["An die Verbform angehängt: cómpralo", "Immer vor dem Verb: lo compra", "Zwischen no und Verb"], correct: 0, explanation: "Bei bejahten Aufforderungen werden Pronomen angehängt; bei verneinten stehen sie davor." },
      { question: "Warum heißt es se lo doy statt le lo doy?", options: ["Le oder les wird vor lo/la/los/las zu se", "Lo wird bei Personen immer zu se", "Se bezeichnet hier nur eine reflexive Handlung"], correct: 0, explanation: "Die feste Pronomenfolge vermeidet le lo; der Empfänger bleibt aus dem Kontext verständlich." }
    ];
    return checks[index % checks.length];
  }
  if (/por-para-relationships|por-para/.test(key)) {
    const checks = [
      { question: "Welche Beziehung drückt para in estudio para viajar aus?", options: ["Zweck oder Ziel", "Ursache", "Austausch"], correct: 0, explanation: "Das Reisen ist das Ziel des Lernens; para zeigt nach vorn." },
      { question: "Welche Beziehung drückt por in gracias por tu ayuda aus?", options: ["Grund für den Dank", "Empfänger des Danks", "Zielort"], correct: 0, explanation: "Die Hilfe ist der Anlass oder Grund für den Dank." },
      { question: "Warum stehen in viajo para Barcelona por trabajo beide Präpositionen?", options: ["Para markiert das Ziel, por den Grund", "Beide bedeuten genau dasselbe", "Por markiert das Ziel, para die Route"], correct: 0, explanation: "Barcelona ist das Reiseziel; die Arbeit ist der Grund der Reise." }
    ];
    return checks[index % checks.length];
  }
  if (/making-plans-interaction|a2-(invite|accept-or-decline|negotiate-time-place|change-or-cancel|clarify-and-confirm|complete-plan)|checkpoint-a2-making-plans/.test(key)) {
    const checks = [
      { question: "Welcher Schritt folgt sinnvoll auf eine angenommene Tätigkeit, wenn der Zeitpunkt noch offen ist?", options: ["Eine passende Uhrzeit vorschlagen und prüfen", "Die gesamte Einladung wortgleich wiederholen", "Das Gespräch ohne Bestätigung beenden"], correct: 0, explanation: "Eine Verabredung wird schrittweise konkret: Nach Tätigkeit und Verfügbarkeit folgt normalerweise die Zeit." },
      { question: "Welche Antwort lehnt einen Zeitpunkt ab und hält den Plan zugleich offen?", options: ["Esta tarde no puedo, pero mañana sí.", "No.", "No entiendo nada."], correct: 0, explanation: "Der Grundrahmen no puedo setzt eine Grenze; pero plus Alternative liefert sofort einen verwendbaren nächsten Schritt." },
      { question: "Wie reparierst du eine unsicher verstandene Uhrzeit am genauesten?", options: ["¿Has dicho a las seis o a las siete?", "¿Qué?", "Repite todo."], correct: 0, explanation: "Die Entweder-oder-Frage isoliert genau die unklare Angabe und vermeidet unnötige Wiederholung." },
      { question: "Was gehört in die Schlussbestätigung einer vollständigen Verabredung?", options: ["Tag, Uhrzeit und Treffpunkt", "Nur ein allgemeines sí", "Nur die ursprüngliche Tätigkeit"], correct: 0, explanation: "Die entscheidenden Angaben werden gemeinsam wiederholt, damit beide Personen denselben Plan behalten." }
    ];
    return checks[index % checks.length];
  }
  if (/formal-address-service|a2-(tu-or-usted|polite-usted|respectful-service|ustedes-useful|adjust-form)|checkpoint-a2-formal-address/.test(key)) {
    const checks = [
      { question: "Welche Kombination spricht eine einzelne unbekannte Person respektvoll an?", options: ["usted trabaja", "tú trabaja", "usted trabajas"], correct: 0, explanation: "Usted bezeichnet eine angesprochene Einzelperson, verwendet grammatisch aber die Form der dritten Person: trabaja." },
      { question: "Welche Formenfamilie passt zu einer vertrauten Einzelperson?", options: ["tú puedes", "usted puedes", "ustedes puede"], correct: 0, explanation: "Tú und puedes gehören zusammen; usted verlangt puede und ustedes verlangt pueden." },
      { question: "Welche Bitte ist für ein respektvolles Servicegespräch klar und passend?", options: ["Disculpe, ¿me puede ayudar?", "Tú puede ayudarme.", "Ayuda."], correct: 0, explanation: "Disculpe eröffnet höflich; me puede ayudar benennt die gewünschte Hilfe mit einer konsistenten usted-Form." },
      { question: "Was ist sinnvoll, wenn die passende Anrede unklar ist?", options: ["Respektvoll beginnen und ein Signal oder eine ausdrückliche Absprache abwarten", "Die deutsche Du-/Sie-Regel unverändert übertragen", "In jedem Satz zwischen tú und usted wechseln"], correct: 0, explanation: "Anredenormen unterscheiden sich nach Region, Beziehung und Situation; ein respektvoller Beginn und eine klare Absprache vermeiden bloßes Raten." }
    ];
    return checks[index % checks.length];
  }
  if (/solving-everyday-problems|a2-(identify-product-problem|request-exchange-or-refund|report-home-problem|arrange-repair-visit|understand-next-service-step|complete-problem-solution)|checkpoint-a2-everyday-problems/.test(key)) {
    const checks = [
      { question: "Welche Meldung gibt einer Servicestelle die beste Arbeitsgrundlage?", options: ["Gegenstand, genauen Defekt, Zeitpunkt oder Ort und Folge nennen", "Nur sagen, dass alles schlecht ist", "Sofort dieselbe Forderung dreimal wiederholen"], correct: 0, explanation: "Konkrete Beobachtungen und relevante Umstände machen das Problem bearbeitbar; die gewünschte Lösung folgt anschließend als eigener Schritt." },
      { question: "Was tust du, wenn der gewünschte Umtausch nicht möglich ist?", options: ["Die angebotenen Alternativen prüfen und eine konkrete Lösung wählen", "Das Gespräch ohne Ergebnis beenden", "Den ursprünglichen Defekt wortgleich wiederholen"], correct: 0, explanation: "Eine Grenze verändert den nächsten Gesprächsschritt: Du prüfst Ersatz, Rückzahlung oder Bedingungen und bestätigst danach eine gemeinsame Lösung." },
      { question: "Was gehört nach einer geänderten Terminabsprache in die Bestätigung?", options: ["Tag, Zeitfenster und nötige Zugangsdaten", "Nur ein allgemeines sí", "Nur der erste abgelehnte Termin"], correct: 0, explanation: "Alle entscheidenden Termindaten werden gemeinsam wiederholt, damit Angebot, Änderung und endgültige Vereinbarung nicht verwechselt werden." },
      { question: "Wie schließt du ein Servicegespräch belastbar ab?", options: ["Nächste Handlungen beider Seiten und einen Plan bei Änderungen bestätigen", "Nur gracias sagen", "Ein neues Problem beginnen"], correct: 0, explanation: "Die eigene Wiedergabe von Verantwortung und Plan B zeigt echtes Verstehen und verhindert eine offene Koordinationslücke." }
    ];
    return checks[index % checks.length];
  }
  if (/health-appointments-instructions|a2-(describe-symptoms-duration|request-medical-appointment|check-in-health-details|answer-clinical-questions|understand-care-instructions|clarify-health-instructions)|checkpoint-a2-health-appointments/.test(key)) {
    const checks = [
      { question: "Welche Beschreibung bleibt sprachlich präzise, ohne eine Diagnose zu erfinden?", options: ["Symptom, Dauer, Stärke und wichtige verneinte Beobachtung nennen", "Eine Krankheit ohne Untersuchung festlegen", "Nur sagen, dass alles schlecht ist"], correct: 0, explanation: "Beobachtbare Einzelheiten helfen bei Rückfragen und bleiben innerhalb dessen, was die sprechende Person tatsächlich weiß." },
      { question: "Was bestätigst du nach einer ausgehandelten Terminzeit?", options: ["Tag, Uhrzeit und zuständige Fachperson", "Nur ein allgemeines sí", "Allergie und Medikamentendosis ungefragt zusammen"], correct: 0, explanation: "Die entscheidenden Termindaten werden gemeinsam wiederholt; Gesundheitsangaben folgen als eigene prüfbare Antworten." },
      { question: "Welche Struktur solltest du aus einer Anweisung entnehmen?", options: ["Handlung, Menge oder Häufigkeit, Zeitpunkt, Dauer und Bedingung", "Nur den Namen eines Medikaments", "Nur das letzte Verb"], correct: 0, explanation: "Erst alle Bestandteile ergeben einen vollständigen Handlungsplan und zeigen, wann sich der nächste Schritt ändert." },
      { question: "Was ist die stärkste Kontrolle einer unsicher gehörten Zahl?", options: ["Die unklare Kategorie benennen, Möglichkeiten gegenüberstellen und den ganzen Plan zurückgeben", "Trotz Unsicherheit sí sagen", "Die gesamte Konsultation abbrechen"], correct: 0, explanation: "Gezielte Reparatur plus Rückbestätigung macht die konkrete Interpretation für beide Seiten überprüfbar." }
    ];
    return checks[index % checks.length];
  }
  if (/phone-calls-messages|a2-(open-phone-call|ask-for-person-phone|leave-phone-message|understand-voicemail|spell-check-contact-details|repair-phone-connection)|checkpoint-a2-phone-messages/.test(key)) {
    const checks = [
      { question: "Wie gehst du mit ¿Diga?, ¿Aló? und ¿Bueno? am effizientesten um?", options: ["Als regionale Annahmesignale erkennen und selbst mit Gruß, Name und Zweck stabil eröffnen", "Alle drei in jedem Anruf aufsagen", "Sie als bedeutungsgleiche Adjektive behandeln"], correct: 0, explanation: "Rezeptive Variantenbreite und eine sichere eigene Grundform ermöglichen Verständigung ohne unnötige Produktionslast." },
      { question: "Welche Nachricht erlaubt später eine sinnvolle Reaktion?", options: ["Empfänger, Anrufer, Anlass, Handlung mit Zeitraum und geprüfte Kontaktdaten", "Nur ein unbestimmtes Bitte zurückrufen", "Nur eine lange Begrüßung"], correct: 0, explanation: "Die abwesende Person braucht genug Kontext, eine konkrete Handlung und einen zuverlässigen Rückrufweg." },
      { question: "Was suchst du im ersten Durchgang einer Sprachnachricht?", options: ["Anrufer und Hauptanlass", "Jedes einzelne Wort und Satzzeichen", "Nur die letzte Ziffer"], correct: 0, explanation: "Die Hauptstruktur gibt den Details im zweiten Durchgang einen Platz und verhindert Überlastung." },
      { question: "Wie reparierst du eine unsicher gehörte Uhrzeit am Telefon?", options: ["Nur die Uhrzeit wiederholen lassen, deine Interpretation nennen und bestätigen lassen", "Das ganze Gespräch neu beginnen", "Eine Zeit raten und auflegen"], correct: 0, explanation: "Gezielte Wiederholung und Rückbestätigung schließen die Informationslücke mit möglichst wenig zusätzlicher Hörlast." }
    ];
    return checks[index % checks.length];
  }
  if (/ser-estar|absolute-basics|estar-emotions/.test(key)) {
    const checks = [
      { question: "Welcher Gedanke passt zu ser?", options: ["Identität oder Herkunft", "Aktueller Ort", "Vorübergehende Müdigkeit"], correct: 0, explanation: "Ser ordnet ein: Wer oder was jemand ist und woher jemand kommt." },
      { question: "Welcher Gedanke passt zu estar?", options: ["Beruf", "Aktueller Zustand oder Ort", "Herkunft"], correct: 1, explanation: "Estar beschreibt, wie oder wo jemand beziehungsweise etwas gerade ist." },
      { question: "Reicht die deutsche Übersetzung „sein“ zur Verbwahl aus?", options: ["Ja, immer", "Nein, die gemeinte Situation entscheidet", "Nur bei Fragen"], correct: 1, explanation: "Die gleiche deutsche Form kann im Spanischen ser oder estar benötigen." },
      { question: "Was folgt nach der Wahl von ser oder estar?", options: ["Die Form an die Person anpassen", "Immer soy einsetzen", "Den Artikel entfernen"], correct: 0, explanation: "Nach der Verbwahl brauchst du noch die passende Personenform, etwa soy/estoy oder es/está." }
    ];
    return checks[index % checks.length];
  }
  if (/article|plural-agreement/.test(key)) return { question: "Wie sollte ein neues spanisches Nomen gespeichert werden?", options: ["Nur als einzelnes Wort", "Zusammen mit seinem Artikel", "Nur in der Mehrzahl"], correct: 1, explanation: "Artikel und Nomen werden als ein gemeinsames Lernpaket gespeichert." };
  if (/verb|routine|present/.test(key)) return { question: "Was trägt bei einem spanischen Verb oft bereits Personeninformation?", options: ["Die Verbendung", "Nur das Satzzeichen", "Der Artikel"], correct: 0, explanation: "Die Endung zeigt häufig schon, wer handelt." };
  if (/question|travel/.test(key)) return { question: "Wie lernst du eine Frage am produktivsten?", options: ["Als Rahmen mit austauschbarem Detail", "Als Folge einzelner übersetzter Wörter", "Nur durch Lesen"], correct: 0, explanation: "Ein stabiler Fragerahmen kann in vielen neuen Situationen wiederverwendet werden." };
  if (/ordering|tener-necesitar|scenario/.test(key)) return { question: "Was macht einen Satzrahmen wie quiero oder necesito so nützlich?", options: ["Danach lassen sich viele passende Details einsetzen", "Er funktioniert nur mit einem einzigen Nomen", "Er muss immer wörtlich übersetzt werden"], correct: 0, explanation: "Der Rahmen bleibt stabil; nur Bedarf, Sache oder Handlung wechseln." };
  return { question: "Was solltest du beim Lernen zuerst sicher verstehen?", options: ["Situation und Funktion des Satzes", "Jeden Buchstaben auswendig", "Nur eine Wort-für-Wort-Übersetzung"], correct: 0, explanation: "Bedeutung und Funktion bilden die Grundlage; Form, Klang und Abruf werden darauf aufgebaut." };
}

function SoundFoundationLab({ lab, lessonId = "", nativeLanguage = "de", quiet = false, onContinue }) {
  const german = nativeLanguage === "de";
  const [listened, setListened] = useState(false);
  const [answer, setAnswer] = useState("");
  const [audioState, setAudioState] = useState("idle");
  const correct = answer === lab.challenge.correct;
  const title = german ? lab.titleDe : lab.titleEn;
  const principle = german ? lab.principleDe : lab.principleEn;
  const question = quiet
    ? (german ? lab.challenge.quietQuestionDe : lab.challenge.quietQuestionEn)
    : (german ? lab.challenge.questionDe : lab.challenge.questionEn);
  const explanation = german ? lab.challenge.explanationDe : lab.challenge.explanationEn;
  const shadowCue = german ? lab.shadowCueDe : lab.shadowCueEn;
  const audioLabel = audioState === "loading"
    ? (german ? "Wird geladen…" : "Loading…")
    : audioState === "playing"
      ? (german ? "Höre genau hin…" : "Listen closely…")
      : (german ? "Hörbeispiel ohne Text abspielen" : "Play the hidden example");

  const playChallenge = () => {
    playPronunciationClip(lab.challenge.audio, setAudioState);
  };

  useEffect(() => {
    if (audioState === "playing") setListened(true);
  }, [audioState]);

  const completeSoundLab = async () => {
    if (lessonId) {
      await api("/api/practice-signals", {
        method: "POST",
        body: {
          skill: quiet ? "visual" : "listening",
          mode: "sound-discrimination",
          isSuccessful: correct,
          usedSupport: true,
          sourceKey: `${lessonId}:sound-discrimination`,
          lessonId,
          targetChannel: "listening",
          targetKind: "sound-discrimination",
          practiceMode: quiet ? "quiet-alternative" : "home",
          completesChannelTarget: true
        }
      }).catch(() => null);
    }
    await onContinue?.();
  };

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-wide text-coral-700">{german ? (quiet ? "Leise Klangwerkstatt" : "Interaktive Klangwerkstatt") : (quiet ? "Silent sound lab" : "Interactive sound lab")}</p>
        <div className="flex gap-1.5" aria-label={german ? "Drei Lernschritte" : "Three learning steps"}>
          {[1, 2, 3].map((stage) => <span key={stage} className="grid h-7 w-7 place-items-center rounded-full bg-lagoon-600 text-xs font-black text-white">{stage}</span>)}
        </div>
      </div>
      <h1 className="mt-3 text-3xl font-black text-slate-950">{title}</h1>
      <p className="mt-3 font-semibold leading-7 text-slate-700">{principle}</p>
      {quiet && (
        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm font-bold leading-6 text-sky-950">
          {german ? "Du bist im Ruhemodus: Analysiere Schrift, Silben und Betonung visuell. Die Hör- und Sprechschritte bleiben für den Zuhause-Modus erhalten." : "Quiet mode is active: analyze spelling, syllables, and stress visually. Listening and speaking remain available in home mode."}
        </div>
      )}

      <section className="mt-6" aria-labelledby="sound-notice-title">
        <p id="sound-notice-title" className="text-xs font-black uppercase tracking-wide text-lagoon-700">1 · {german ? (quiet ? "Sehen und bemerken" : "Sehen, hören und bemerken") : (quiet ? "See and notice" : "See, hear, and notice")}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {lab.contrasts.map((item) => (
            <div key={`${item.focus}:${item.spanish}`} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-coral-700">{item.focus}</p>
                  <p className="mt-1 break-words text-lg font-black text-slate-950">{item.spanish}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{german ? item.cueDe : item.cueEn}</p>
                </div>
                {!quiet && <PronunciationTools text={item.spanish.replaceAll(" / ", ", ").replaceAll(" · ", ", ")} compact allowCopy={false} nativeLanguage={nativeLanguage} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-honey-200 bg-honey-50 p-4" aria-labelledby="sound-choice-title">
        <p id="sound-choice-title" className="text-xs font-black uppercase tracking-wide text-honey-800">2 · {german ? (quiet ? "Regel unterscheiden" : "Ohne sichtbare Lösung unterscheiden") : (quiet ? "Distinguish the rule" : "Distinguish without seeing the answer")}</p>
        {!quiet && (
          <button type="button" onClick={playChallenge} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 font-black text-white hover:bg-slate-800" aria-label={german ? "Verdecktes spanisches Hörbeispiel abspielen" : "Play hidden Spanish listening example"}>
            <Volume2 size={18} /> {audioLabel}
          </button>
        )}
        <p className="mt-4 font-black leading-6 text-honey-950">{question}</p>
        {!quiet && !listened && <p className="mt-2 text-sm font-semibold text-honey-800">{german ? "Spiele zuerst das Hörbeispiel ab; danach werden die Antworten freigeschaltet." : "Play the example first; then the answers unlock."}</p>}
        <div className="mt-3 grid gap-2" role="radiogroup" aria-label={german ? "Antwortmöglichkeiten" : "Answer choices"}>
          {lab.challenge.options.map((option) => {
            const selected = answer === option;
            const tone = selected ? (option === lab.challenge.correct ? "border-emerald-400 bg-emerald-50 text-emerald-950" : "border-red-300 bg-red-50 text-red-800") : "border-stone-200 bg-white text-slate-800";
            return <button type="button" role="radio" aria-checked={selected} disabled={!quiet && !listened} key={option} onClick={() => setAnswer(option)} className={classNames("rounded-md border px-4 py-3 text-left font-black disabled:cursor-not-allowed disabled:opacity-45", tone)}>{option}</button>;
          })}
        </div>
        {answer && (
          <div role="status" aria-live="polite" className={classNames("mt-3 rounded-md border p-3 text-sm font-bold leading-6", correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-800")}>
            {correct ? `${german ? "Richtig" : "Correct"}. ${explanation}` : (german ? "Noch nicht. Höre erneut oder vergleiche die sichtbare Regel oben; danach entscheide noch einmal." : "Not yet. Listen again or compare the visible rule above, then decide once more.")}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4" aria-labelledby="sound-shadow-title">
        <p id="sound-shadow-title" className="text-xs font-black uppercase tracking-wide text-emerald-700">3 · {german ? (quiet ? "Innerlich mitsprechen" : "Nachsprechen und prüfen") : (quiet ? "Rehearse silently" : "Shadow and check")}</p>
        <p className="mt-3 text-xl font-black text-emerald-950">{lab.shadowText}</p>
        <p className="mt-2 text-sm font-bold leading-6 text-emerald-900">{shadowCue}</p>
        {!quiet && (
          <div className="mt-3">
            <PronunciationTools text={lab.shadowText} compact allowCopy={false} nativeLanguage={nativeLanguage} />
            <p className="mt-2 text-xs font-semibold leading-5 text-emerald-800">{german ? "Die Spracherkennung prüft nur, ob der Satz verständlich erkannt wurde – sie bewertet keinen regionalen Akzent und ersetzt kein menschliches Ausspracheurteil." : "Speech recognition only checks whether the sentence was understood. It does not judge regional accent or replace human pronunciation feedback."}</p>
          </div>
        )}
      </section>

      <button disabled={!correct} onClick={completeSoundLab} className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600 disabled:cursor-not-allowed disabled:opacity-40">
        {german ? (quiet ? "Mit visueller Sicherheit weiter" : "Mit Satzbeispielen weiter") : (quiet ? "Continue with visual confidence" : "Continue to sentence examples")}
      </button>
    </div>
  );
}

function LessonFoundationRecall({ lesson, cards, nativeLanguage = "de", onRepeatExplanations, onContinue }) {
  const german = nativeLanguage === "de";
  const allIndexes = useMemo(() => cards.map((_, index) => index), [cards]);
  const [recallOrder, setRecallOrder] = useState(allIndexes);
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState({});
  const [selectiveRound, setSelectiveRound] = useState(false);
  const currentIndex = recallOrder[position];
  const currentCard = cards[currentIndex];
  const finished = position >= recallOrder.length;
  const uncertainIndexes = allIndexes.filter((cardIndex) => ratings[cardIndex] !== "secure");
  const currentTitle = currentCard ? (german ? germanConceptTitle(lesson, currentIndex, currentCard) : currentCard.title) : "";
  const currentDetail = currentCard && german
    ? { ...germanFoundationExplanation(lesson, currentCard), ...germanFoundationCardCopy(lesson?.topic?.slug || lesson?.topicSlug || "", currentIndex, currentCard, currentTitle) }
    : null;

  const rateRecall = (rating) => {
    setRatings((current) => ({ ...current, [currentIndex]: rating }));
    setRevealed(false);
    setPosition((value) => value + 1);
  };

  const repeatUncertain = () => {
    setRecallOrder(uncertainIndexes);
    setPosition(0);
    setRevealed(false);
    setSelectiveRound(true);
  };

  if (finished) {
    const secureCount = allIndexes.length - uncertainIndexes.length;
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">{german ? "Aktiver Rückblick abgeschlossen" : "Active recap complete"}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{german ? (uncertainIndexes.length ? "Das Fundament steht – einen Teil festigst du noch" : "Das Fundament ist abrufbar") : (uncertainIndexes.length ? "The foundation is built; strengthen one part" : "The foundation is retrievable")}</h1>
        <p className="mt-3 font-semibold leading-6 text-slate-600">{german ? "Diese Selbsteinschätzung ersetzt keinen Test. Sie entscheidet nur, welche Erklärung du vor den Satzmustern noch einmal aktiv abrufen solltest." : "This self-rating does not replace a test. It only decides which explanation should receive one more active recall before sentence work."}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-emerald-700">{german ? "Vor dem Aufdecken abrufbar" : "Retrieved before reveal"}</p><p className="mt-2 text-3xl font-black text-emerald-950">{secureCount}/{allIndexes.length}</p></div>
          <div className="rounded-lg border border-honey-200 bg-honey-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-honey-800">{german ? "Noch einmal abrufen" : "Retrieve once more"}</p><p className="mt-2 text-3xl font-black text-honey-950">{uncertainIndexes.length}</p></div>
        </div>
        <div className="mt-5 grid gap-2">
          {allIndexes.map((cardIndex) => (
            <div key={`${cards[cardIndex].title}-${cardIndex}`} className={classNames("flex items-start gap-3 rounded-md border px-3 py-3", ratings[cardIndex] === "secure" ? "border-emerald-200 bg-emerald-50" : "border-honey-200 bg-honey-50")}>
              {ratings[cardIndex] === "secure" ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} /> : <RefreshCw className="mt-0.5 shrink-0 text-honey-700" size={18} />}
              <p className="text-sm font-black leading-5 text-slate-900">{german ? germanConceptTitle(lesson, cardIndex, cards[cardIndex]) : cards[cardIndex].title}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button onClick={onRepeatExplanations} className="rounded-md border border-stone-200 px-4 py-3 font-black text-slate-700">{german ? "Erklärungen wiederholen" : "Repeat explanations"}</button>
          {!!uncertainIndexes.length && !selectiveRound && <button onClick={repeatUncertain} className="rounded-md border border-honey-300 bg-honey-50 px-4 py-3 font-black text-honey-900">{german ? "Nur Unsicheres erneut abrufen" : "Retrieve only uncertain concepts"}</button>}
          <button onClick={onContinue} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 sm:ml-auto">{german ? "Satzmuster aufbauen" : "Build sentence patterns"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-wide text-coral-700">{german ? (selectiveRound ? "Gezielte zweite Abrufrunde" : "Fundament aktiv abrufen") : (selectiveRound ? "Targeted second recall" : "Actively retrieve the foundation")}</p>
        <span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-black text-coral-700">{position + 1}/{recallOrder.length}</span>
      </div>
      <ProgressBar value={Math.round((position / recallOrder.length) * 100)} className="mt-3" color="bg-coral-500" />
      <h1 className="mt-6 text-3xl font-black text-slate-950">{german ? `Konzept ${currentIndex + 1} ohne Vorlage erklären` : `Explain concept ${currentIndex + 1} without the model`}</h1>
      <p className="mt-3 font-semibold leading-7 text-slate-600">{german ? "Schau nicht zurück: Welche Grundidee hast du gerade gelernt, welche Entscheidung erleichtert sie dir und welche typische Verwechslung verhindert sie? Formuliere die Antwort kurz im Kopf." : "Do not look back: what principle did you just learn, which decision does it simplify, and which common confusion does it prevent? Formulate a brief answer mentally."}</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="mt-6 w-full rounded-md bg-coral-500 px-5 py-4 font-black text-white hover:bg-coral-600">{german ? "Meine Erinnerung mit dem Merksatz vergleichen" : "Compare my recall with the key idea"}</button>
      ) : (
        <>
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{german ? "Merksatz zum Vergleich" : "Key idea for comparison"}</p>
            <p className="mt-2 text-lg font-black text-emerald-950">{currentTitle}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-emerald-900">{german ? currentDetail.plain : currentCard.body}</p>
            {german && currentDetail.trap && <p className="mt-3 rounded-md bg-white px-3 py-2 text-sm font-bold leading-6 text-honey-900"><span className="font-black">Typische Falle:</span> {currentDetail.trap}</p>}
          </div>
          <p className="mt-5 font-black text-slate-950">{german ? "Wie gut konntest du die Idee vor dem Aufdecken nennen?" : "How well could you state the idea before revealing it?"}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button onClick={() => rateRecall("uncertain")} className="rounded-md border border-honey-300 bg-honey-50 px-4 py-3 font-black text-honey-900">{german ? "Noch unsicher" : "Still uncertain"}</button>
            <button onClick={() => rateRecall("secure")} className="rounded-md bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700">{german ? "Vorher selbst gewusst" : "Retrieved before reveal"}</button>
          </div>
        </>
      )}
    </div>
  );
}

function LessonFoundationGuide({ lesson, cards, nativeLanguage, quiet = false, onContinue }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [checkAnswer, setCheckAnswer] = useState(null);
  const [answerPositionOffset, setAnswerPositionOffset] = useState(() => Math.floor(Math.random() * 3));
  const german = nativeLanguage === "de";
  const complete = index >= cards.length;
  const card = cards[index];

  if (complete) {
    return (
      <LessonFoundationRecall
        lesson={lesson}
        cards={cards}
        nativeLanguage={nativeLanguage}
        onRepeatExplanations={() => { setIndex(0); setExpanded(false); setCheckAnswer(null); setAnswerPositionOffset((value) => value + 1); }}
        onContinue={onContinue}
      />
    );
  }

  const conceptTitle = german ? germanConceptTitle(lesson, index, card) : card.title;
  const germanDetail = german
    ? { ...germanFoundationExplanation(lesson, card), ...germanFoundationCardCopy(lesson?.topic?.slug || lesson?.topicSlug || "", index, card, conceptTitle) }
    : null;
  const authoredQuickCheck = german ? foundationQuickCheck(lesson, index) : buildEnglishFoundationQuickCheck(cards, index);
  const quickCheck = balanceFoundationQuickCheck(authoredQuickCheck, answerPositionOffset, index);
  const visibleExample = spanishLearningExample(card.example, lesson?.sentences?.[index]?.spanish);
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">{german ? "Grundlage verstehen" : "Understand the foundation"} · {index + 1}/{cards.length}</p>
        <span className="rounded-full bg-lagoon-50 px-3 py-1 text-xs font-black text-lagoon-700">{Math.round(((index + (expanded ? 0.7 : 0.25)) / cards.length) * 100)}%</span>
      </div>
      <ProgressBar value={Math.round(((index + (expanded ? 0.7 : 0.25)) / cards.length) * 100)} className="mt-3" />
      <h1 className="mt-6 text-3xl font-black text-slate-950">{conceptTitle}</h1>
      <p className="mt-4 text-base font-semibold leading-7 text-slate-700">{german ? germanDetail.plain : card.body}</p>
      {german && (
        <div className="mt-5 rounded-lg border border-sky-200 bg-sky-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Warum das wichtig ist</p>
          <p className="mt-2 font-bold leading-7 text-sky-950">{germanDetail.why}</p>
        </div>
      )}
      {!expanded ? (
        <button onClick={() => setExpanded(true)} className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600">{german ? "Beispiel und typische Falle ansehen" : "See the example and common trap"}</button>
      ) : (
        <>
          {visibleExample && (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{german ? "Konkretes Beispiel" : "Concrete example"}</p>
              <p className="mt-2 text-lg font-black text-emerald-950">{visibleExample}</p>
              {!quiet && <div className="mt-2"><PronunciationTools text={visibleExample} compact allowCopy={false} nativeLanguage={nativeLanguage} /></div>}
            </div>
          )}
          {card.pitfall && !german && <div className="mt-3 rounded-lg border border-honey-200 bg-honey-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-honey-700">Common confusion</p><p className="mt-2 font-bold leading-6 text-honey-950">{card.pitfall}</p></div>}
          {german && germanDetail.trap && <div className="mt-3 rounded-lg border border-honey-200 bg-honey-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-honey-800">Typische Falle</p><p className="mt-2 font-bold leading-6 text-honey-950">{germanDetail.trap}</p></div>}
          {german && <div className="mt-3 rounded-lg border border-coral-200 bg-coral-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-coral-700">Denkfrage</p><p className="mt-2 font-bold text-coral-950">{germanDetail.question}</p></div>}
          <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{german ? "Kurzer Verständnischeck" : "Quick understanding check"}</p>
            <p className="mt-2 font-black text-slate-950">{quickCheck.question}</p>
            <div className="mt-3 grid gap-2" role="radiogroup" aria-label={german ? "Antwortmöglichkeiten" : "Answer choices"}>
              {quickCheck.options.map((option, optionIndex) => (
                <button role="radio" aria-checked={checkAnswer === optionIndex} key={option} onClick={() => setCheckAnswer(optionIndex)} className={classNames("rounded-md border px-3 py-2 text-left text-sm font-bold", checkAnswer === optionIndex ? optionIndex === quickCheck.correct ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-800" : "border-stone-200 bg-white text-slate-700")}>{option}</button>
              ))}
            </div>
            {checkAnswer !== null && <p role="status" aria-live="polite" className={classNames("mt-3 text-sm font-bold", checkAnswer === quickCheck.correct ? "text-emerald-800" : "text-red-700")}>{checkAnswer === quickCheck.correct ? `${german ? "Richtig" : "Correct"}. ${quickCheck.explanation}` : (german ? "Noch nicht. Lies die Erklärung direkt darüber noch einmal und entscheide nach der Bedeutung." : "Not yet. Re-read the explanation above and decide from meaning rather than position.")}</p>}
          </div>
          <div className="mt-6 flex gap-3">
            {index > 0 && <button onClick={() => { setIndex((value) => value - 1); setExpanded(true); setCheckAnswer(null); }} className="rounded-md border border-stone-200 px-4 py-3 font-black text-slate-700">{german ? "Zurück" : "Back"}</button>}
            <button disabled={checkAnswer !== quickCheck.correct} onClick={() => { setIndex((value) => value + 1); setExpanded(false); setCheckAnswer(null); }} className="ml-auto rounded-md bg-lagoon-500 px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40">{index + 1 >= cards.length ? (german ? "Grundlagen zusammenfassen" : "Recap foundation") : (german ? "Nächstes Konzept" : "Next concept")}</button>
          </div>
        </>
      )}
    </div>
  );
}

function GermanLessonBridge({ lesson, className = "" }) {
  const key = `${lesson.slug || ""} ${lesson.theme || ""}`.toLowerCase();
  const bridge = /ser|estar|soy|estoy|es-esta/.test(key)
    ? { title: "Die wichtige Brücke zum Deutschen", text: "Deutsch benutzt meistens „sein“. Spanisch teilt diese Idee: ser beschreibt eher Identität und Einordnung, estar eher Zustand und Ort. Lerne deshalb nicht nur die Übersetzung, sondern immer die ganze Situation.", example: "Soy estudiante. = Ich bin Student. · Estoy cansado. = Ich bin müde." }
    : /article|noun|masculine|feminine|plural/.test(key)
      ? { title: "Artikel nicht einzeln übersetzen", text: "Wie im Deutschen haben Nomen ein grammatisches Geschlecht. Lerne das spanische Wort direkt zusammen mit seinem Artikel als ein Paket.", example: "la casa · el libro · una mesa" }
      : /location|donde|place|cerca|lejos/.test(key)
        ? { title: "Ort als festes Muster", text: "Für einen Ort hilft das feste Muster estar + en. Denk an die Situation „etwas befindet sich irgendwo“, nicht an eine Wort-für-Wort-Übersetzung.", example: "Estoy en casa. · El libro está en la mesa." }
        : /quiero|necesito|tengo|food|restaurant|market/.test(key)
          ? { title: "Ein Rahmen, viele echte Sätze", text: "Speichere den Anfang als Werkzeug. Danach tauschst du nur das benötigte Wort aus. So erzeugst du neue Sätze, statt fertige Sätze auswendig zu lernen.", example: "Quiero… · Necesito… · Tengo…" }
          : /question|que-|cuanto|travel/.test(key)
            ? { title: "Fragen als wiederverwendbare Rahmen", text: "Lerne die Frage als Gerüst und ersetze später nur Ort, Gegenstand oder Person. Das ist näher an echtem Sprechen als einzelne Vokabeln zu übersetzen.", example: "¿Dónde está…? · ¿Qué quieres? · ¿Cuánto cuesta?" }
            : /negation|no-before/.test(key)
              ? { title: "Einfacher als im Deutschen", text: "Im Spanischen steht no direkt vor dem konjugierten Verb. Es braucht kein zusätzliches Hilfsverb.", example: "No entiendo. · No trabajo hoy." }
              : /verb|action|routine|plan/.test(key)
                ? { title: "Verben als Personenmuster", text: "Lerne Verbformen in kurzen, persönlichen Sätzen. Die Endung zeigt oft schon, wer handelt; das Pronomen kann später häufig wegfallen.", example: "Trabajo. · Hablas. · Vamos." }
                : { title: "Bedeutung zuerst, Übersetzung später loslassen", text: "Benutze Deutsch, um die Situation sicher zu verstehen. Verbinde danach den spanischen Satz mit Bild, Klang und Handlung, damit du beim Sprechen nicht jedes Wort im Kopf übersetzen musst.", example: lesson.sentences?.[0]?.spanish || "Hören · verstehen · benutzen" };
  return (
    <div className={classNames("rounded-lg border border-sky-200 bg-sky-50 p-4", className)}>
      <p className="flex items-center gap-2 font-black text-sky-950"><GraduationCap size={18} /> {bridge.title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-sky-900">{bridge.text}</p>
      <p className="mt-3 rounded-md bg-white px-3 py-2 text-sm font-black text-sky-800">{bridge.example}</p>
    </div>
  );
}

function LessonSentenceStudy({ sentence, index, total, imageKey, nativeLanguage = "de", quiet = false, initialSupport = false, supportReason = "", recallOnly = false, requireExactOrthography = false, onContinue }) {
  const german = nativeLanguage === "de";
  const meaning = nativeMeaning(sentence.english, nativeLanguage);
  const [recalling, setRecalling] = useState(recallOnly);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [supportOpen, setSupportOpen] = useState(initialSupport);
  const [attemptCount, setAttemptCount] = useState(0);
  const [usedSupport, setUsedSupport] = useState(initialSupport);
  const [entryMode, setEntryMode] = useState(initialSupport ? "build" : "type");
  const [selectedSupportWordIds, setSelectedSupportWordIds] = useState([]);
  const answerInputRef = useRef(null);
  const supportWords = useMemo(
    () => shuffleItems(modelSentenceWordBank(sentence.spanish)),
    [sentence.spanish]
  );
  const recallResult = useMemo(
    () => checked ? evaluateModelSentenceRecall(answer, sentence.spanish) : { correct: false, match: "unchecked", accentWarning: false },
    [answer, checked, sentence.spanish]
  );
  const correct = checked && modelSentenceRecallIsComplete(recallResult, { requireExactOrthography });
  const orthographyNeedsCorrection = checked && recallResult.correct && recallResult.accentWarning && requireExactOrthography;
  const recallFeedback = modelSentenceRecallFeedback({ result: recallResult, complete: correct, requireExactOrthography, nativeLanguage, usedSupport, attemptCount });
  const checkAnswer = () => {
    if (!answer.trim()) return;
    setAttemptCount((value) => value + 1);
    setChecked(true);
  };
  const retryWithSupport = () => {
    setAnswer("");
    setChecked(false);
    setSupportOpen(true);
    setUsedSupport(true);
    setEntryMode("build");
    setSelectedSupportWordIds([]);
  };
  const studyAgain = () => {
    setRecalling(false);
    setAnswer("");
    setChecked(false);
    setSupportOpen(initialSupport);
    setUsedSupport(true);
    setEntryMode(initialSupport ? "build" : "type");
    setSelectedSupportWordIds([]);
  };
  const selectSupportWord = (wordId) => {
    if (checked || selectedSupportWordIds.includes(wordId)) return;
    const next = [...selectedSupportWordIds, wordId];
    setSelectedSupportWordIds(next);
    setAnswer(modelSentenceAnswerFromWordIds(supportWords, next));
    setUsedSupport(true);
  };
  const removeSupportWord = (position) => {
    if (checked) return;
    const next = selectedSupportWordIds.filter((_, index) => index !== position);
    setSelectedSupportWordIds(next);
    setAnswer(modelSentenceAnswerFromWordIds(supportWords, next));
  };
  const switchToTyping = () => {
    if (checked) return;
    setEntryMode("type");
    setSelectedSupportWordIds([]);
  };
  const switchToWordBank = () => {
    if (checked) return;
    setEntryMode("build");
    setSelectedSupportWordIds([]);
    setAnswer("");
    setUsedSupport(true);
  };

  if (!recalling) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
        <div className={classNames("grid gap-5 sm:items-center", imageKey && "sm:grid-cols-[140px_1fr]")}>
          {imageKey && <AssetImage imageKey={imageKey} alt={sentence.spanish} className="aspect-square w-full max-w-[160px]" />}
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-lagoon-700">{german ? "Sehen und hören" : "See and hear"} {index + 1}/{total}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-slate-950">{sentence.spanish}</h1>
              {!quiet && <PronunciationTools text={sentence.spanish} compact nativeLanguage={nativeLanguage} />}
            </div>
            {meaning ? <p className="mt-3 text-lg font-bold text-slate-600">{meaning}</p> : <p className="mt-3 text-sm font-semibold text-slate-500">Bedeutung über Bild, Kontext und das zuvor erklärte Satzmuster erschließen.</p>}
            {sentence.note && !german && <div className="mt-5 rounded-lg border border-lagoon-200 bg-lagoon-50 p-4 text-lagoon-900"><p className="font-bold">{sentence.note}</p></div>}
            <p className="mt-4 text-sm font-semibold text-slate-500">{quiet ? (german ? "Lies den Satz aufmerksam, sprich ihn innerlich mit und verstecke ihn anschließend für den aktiven Abruf." : "Read carefully, rehearse silently, then hide it for active recall.") : (german ? "Höre einmal zu, sprich den Satz laut nach und verstecke ihn anschließend, um ihn aktiv aus dem Gedächtnis zu holen." : "Listen once, say it aloud, then hide it and retrieve it from memory.")}</p>
          </div>
        </div>
        <button onClick={() => setRecalling(true)} className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600">{german ? "Verstecken und aktiv abrufen" : "Hide it and recall"}</button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <p className="text-sm font-black uppercase tracking-wide text-coral-700">{german ? "Aktiv abrufen" : "Retrieve it"} {index + 1}/{total}</p>
      <p className="mt-3 text-sm font-bold text-slate-500">{german ? "Sage oder schreibe auf Spanisch:" : "Say or write this in Spanish:"}</p>
      <h1 className="mt-2 text-2xl font-black text-slate-950">{meaning || "Rufe den spanischen Modellsatz aus dem vorherigen Schritt ab."}</h1>
      {supportOpen && (
        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">{german ? supportReason === "carryover" ? "Hilfe passend weiterführen" : initialSupport ? "Sanfter Einstieg" : "Gezielte Unterstützung" : supportReason === "carryover" ? "Adaptive support" : initialSupport ? "Guided start" : "Focused support"}</p>
            <div className="inline-flex rounded-md border border-sky-200 bg-white p-1" role="group" aria-label={german ? "Eingabemodus" : "Entry mode"}>
              <button disabled={checked} aria-pressed={entryMode === "build"} onClick={switchToWordBank} className={classNames("rounded px-2.5 py-1 text-xs font-black", entryMode === "build" ? "bg-sky-600 text-white" : "text-sky-800", checked && "opacity-50")}>{german ? "Zusammensetzen" : "Build"}</button>
              <button disabled={checked} aria-pressed={entryMode === "type"} onClick={switchToTyping} className={classNames("rounded px-2.5 py-1 text-xs font-black", entryMode === "type" ? "bg-sky-600 text-white" : "text-sky-800", checked && "opacity-50")}>{german ? "Selbst tippen" : "Type"}</button>
            </div>
          </div>
          {initialSupport && <p className="mt-1 text-xs font-semibold leading-5 text-sky-800">{supportReason === "carryover" ? (german ? "Der vorige freie Abruf brauchte Unterstützung. Hier bleiben die Bausteine sichtbar; der nächste Satz prüft das Muster wieder ohne offene Hilfe." : "The previous free recall needed support. Chunks remain here; the next sentence probes the pattern without open help again.") : (german ? "Beim ersten A1/A2-Modell erhältst du Bausteine. Der nächste Satz prüft das Muster frei; nur nach Unsicherheit kehrt die Hilfe für einen Übergang zurück." : "The first A1/A2 model provides chunks. The next sentence is a free probe; support returns for one transition only after difficulty.")}</p>}
          {entryMode === "build" ? (
            <>
              <div className="mt-3 min-h-14 rounded-md border border-sky-200 bg-white p-2" aria-label={german ? "Zusammengesetzter Satz" : "Built sentence"} aria-live="polite">
                {selectedSupportWordIds.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSupportWordIds.map((wordId, position) => {
                      const item = supportWords.find((word) => word.id === wordId);
                      return <button disabled={checked} aria-label={german ? `${item?.word || "Wort"} aus der Antwort entfernen` : `Remove ${item?.word || "word"} from the answer`} key={`${wordId}:${position}`} onClick={() => removeSupportWord(position)} className="rounded-full bg-sky-600 px-3 py-1.5 text-sm font-black text-white disabled:opacity-60">{item?.word}</button>;
                    })}
                  </div>
                ) : <p className="px-1 py-2 text-sm font-bold text-sky-700">{german ? "Tippe die Wörter unten in der richtigen Reihenfolge an." : "Tap the words below in the correct order."}</p>}
              </div>
              <p className="mt-2 text-xs font-semibold text-sky-800">{german ? "Ein Wort wandert nach oben. Tippe es dort erneut an, um es zurückzulegen." : "A word moves into your sentence. Tap it there to return it."}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {supportWords.map((item) => {
                  const selected = selectedSupportWordIds.includes(item.id);
                  return (
                    <button disabled={checked || selected} aria-label={german ? `${item.word} zur Antwort hinzufügen` : `Add ${item.word} to the answer`} key={item.id} onClick={() => selectSupportWord(item.id)} className={classNames("rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm font-black text-sky-900", selected && "cursor-default opacity-25", checked && "opacity-50")}>{item.word}</button>
                  );
                })}
              </div>
            </>
          ) : <p className="mt-3 rounded-md border border-sky-100 bg-white px-3 py-2 text-sm font-bold text-sky-800">{german ? "Tippe den Satz frei in das Feld. Du kannst jederzeit zur Wortbank zurückkehren; dabei wird die Eingabe geleert." : "Type the sentence freely. Returning to the word bank clears the typed answer."}</p>}
        </div>
      )}
      <div className={classNames("mt-5 gap-2", entryMode === "type" ? "flex" : "grid")}>
        {entryMode === "type" && <input ref={answerInputRef} aria-label={german ? "Spanischen Satz eingeben" : "Enter the Spanish sentence"} value={answer} disabled={checked} onChange={(event) => { setAnswer(event.target.value); setSelectedSupportWordIds([]); }} onKeyDown={(event) => { if (event.key === "Enter") checkAnswer(); }} className="min-w-0 flex-1 rounded-md border border-stone-200 px-4 py-3 font-bold outline-none focus:border-lagoon-500 disabled:bg-stone-100" placeholder={german ? "Spanischer Satz" : "Spanish sentence"} />}
        {!checked && <button disabled={!answer.trim()} onClick={checkAnswer} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white disabled:opacity-50">{german ? (entryMode === "build" ? "Satz prüfen" : "Prüfen") : "Check"}</button>}
      </div>
      {entryMode === "type" && !checked && <SpanishCharacterBar value={answer} onChange={(value) => { setAnswer(value); setSelectedSupportWordIds([]); }} inputRef={answerInputRef} nativeLanguage={nativeLanguage} />}
      {!checked && !quiet && entryMode === "type" && <div className="mt-3"><SpeakCheck onTranscript={setAnswer} nativeLanguage={nativeLanguage} /></div>}
      {checked && (
        <div className={classNames("mt-4 rounded-lg border p-4", recallResult.accentWarning ? "border-honey-300 bg-honey-50" : correct ? "border-emerald-200 bg-emerald-50" : "border-honey-200 bg-honey-50")}>
          <p className={classNames("font-black", recallResult.accentWarning ? "text-honey-950" : correct ? "text-emerald-900" : "text-honey-900")}>
            {recallFeedback}
          </p>
          <p className="mt-2 text-xl font-black text-slate-950">{sentence.spanish}</p>
          {!quiet && <div className="mt-2"><PronunciationTools text={sentence.spanish} compact nativeLanguage={nativeLanguage} /></div>}
          {!correct && <button onClick={retryWithSupport} className="mt-3 rounded-md border border-honey-300 bg-white px-4 py-2 text-sm font-black text-honey-800">{orthographyNeedsCorrection ? (german ? "Modell schließen und Schreibweise erneut bilden" : "Hide the model and rebuild the spelling") : (german ? "Modell schließen und mit Wortbausteinen erneut versuchen" : "Hide the model and retry with word chunks")}</button>}
        </div>
      )}
      <div className="mt-5 flex justify-between gap-3">
        <button onClick={studyAgain} className="rounded-md border border-stone-200 px-4 py-2 font-bold text-slate-600">{german ? "Noch einmal ansehen" : "Study again"}</button>
        {correct && <button onClick={() => onContinue?.({ correct: true, usedSupport, attemptCount, orthographyWarning: recallResult.accentWarning })} className="rounded-md bg-lagoon-500 px-5 py-2 font-black text-white">{german ? "Weiter" : "Continue"}</button>}
      </div>
    </div>
  );
}

function LessonSentenceConsolidation({ items = [], nativeLanguage = "de", quiet = false, onContinue }) {
  const german = nativeLanguage === "de";
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const complete = started && index >= items.length;

  if (!started) {
    const hasWeakSentences = items.length > 0;
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
        <p className={classNames("text-sm font-black uppercase tracking-wide", hasWeakSentences ? "text-coral-700" : "text-emerald-700")}>{german ? "Verzögerter Abruf" : "Delayed retrieval"}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{german ? (hasWeakSentences ? "Was eben noch Hilfe brauchte, kommt jetzt zurück" : "Die Modellsätze sitzen bereits selbstständig") : (hasWeakSentences ? "Retrieve the sentences that needed support" : "The model sentences are already independent")}</h1>
        <p className="mt-3 font-semibold leading-7 text-slate-600">{german ? (hasWeakSentences ? `Du hast inzwischen andere Inhalte verarbeitet. Rufe jetzt ${items.length === 1 ? "den unsicheren Satz" : `die ${items.length} unsicheren Sätze`} erneut ohne sichtbare Vorlage ab. Nur bei Bedarf öffnet sich wieder eine Hilfe.` : "Jeden Modellsatz hast du beim ersten Abruf ohne erneutes Ansehen und ohne Wortbausteine aufgebaut. Deshalb wiederholen wir hier nichts unnötig und gehen direkt zur gemischten Anwendung.") : (hasWeakSentences ? "After an interval filled with other material, retrieve only the sentences that needed support. Help returns only when needed." : "Every model sentence was retrieved independently, so nothing is repeated unnecessarily." )}</p>
        <div className={classNames("mt-5 rounded-lg border p-4", hasWeakSentences ? "border-honey-200 bg-honey-50" : "border-emerald-200 bg-emerald-50") }>
          <p className={classNames("font-black", hasWeakSentences ? "text-honey-950" : "text-emerald-950")}>{german ? (hasWeakSentences ? `${items.length} ${items.length === 1 ? "Satz wird" : "Sätze werden"} gezielt gefestigt` : "0 unnötige Wiederholungen") : (hasWeakSentences ? `${items.length} targeted ${items.length === 1 ? "sentence" : "sentences"}` : "0 unnecessary repeats")}</p>
          <p className={classNames("mt-1 text-sm font-semibold", hasWeakSentences ? "text-honey-900" : "text-emerald-900")}>{german ? (hasWeakSentences ? "Die deutsche Bedeutung bleibt als Abrufreiz sichtbar; die spanische Lösung bleibt verborgen." : "Als Nächstes wechselst du von einzelnen Modellen zu gemischten Aufgaben.") : (hasWeakSentences ? "The native-language cue remains visible while the Spanish answer stays hidden." : "Next, move from model sentences to mixed practice.")}</p>
        </div>
        <button onClick={() => hasWeakSentences ? setStarted(true) : onContinue?.()} className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600">{german ? (hasWeakSentences ? "Festigungsrunde starten" : "Gemischte Anwendung starten") : (hasWeakSentences ? "Start consolidation" : "Start mixed practice")}</button>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-soft sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">{german ? "Abruf gefestigt" : "Retrieval consolidated"}</p>
        <h1 className="mt-3 text-3xl font-black text-emerald-950">{german ? "Jetzt sitzt auch der schwierige Teil" : "The difficult part is now secure"}</h1>
        <p className="mt-3 font-semibold leading-7 text-emerald-900">{german ? "Du hast die unsicheren Modellsätze nach einer Unterbrechung erneut korrekt aufgebaut. Jetzt werden sie mit anderen Aufgaben und Bedeutungen vermischt." : "You correctly rebuilt the uncertain model sentences after a delay. They will now be mixed with other tasks and meanings."}</p>
        <button onClick={onContinue} className="mt-6 w-full rounded-md bg-lagoon-500 px-5 py-4 font-black text-white hover:bg-lagoon-600">{german ? "Gemischte Anwendung starten" : "Start mixed practice"}</button>
      </div>
    );
  }

  const current = items[index];
  return (
    <LessonSentenceStudy
      key={`consolidation:${current.sentenceIndex}`}
      sentence={current.sentence}
      index={index}
      total={items.length}
      nativeLanguage={nativeLanguage}
      quiet={quiet}
      recallOnly
      requireExactOrthography
      onContinue={() => setIndex((value) => value + 1)}
    />
  );
}

function WordLearnerView({ refreshDashboard, nativeLanguage = "de", quiet = false }) {
  const german = nativeLanguage === "de";
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
  const wordSessionRef = useRef(null);
  const wordSessionResultsRef = useRef([]);
  const typedInputRef = useRef(null);

  useEffect(() => {
    wordSessionRef.current = session;
  }, [session]);

  useEffect(() => {
    wordSessionResultsRef.current = sessionResults;
  }, [sessionResults]);

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
    const availableGroupIds = new Set(payload.groups.map((group) => group.id));
    setData(payload);
    setSelectedGroupId((current) => (availableGroupIds.has(current) ? current : ""));
    setSelectedGroupIds((current) => current.filter((id) => availableGroupIds.has(id)));
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
      setSessionNotice(type === "memory"
        ? (german ? "Bearbeite zuerst einige Wörter aus den Kategorien. Danach fragt die Wiederholung sie erneut ab." : "Do a few category questions first, then Memory will test them again.")
        : (german ? "Dieses Wortpaket enthält noch keine Wörter." : "This deck has no words yet."));
      return;
    }

    setSession({
      type,
      groupId: group?.id || "",
      groupTitle: type === "memory" ? (german ? "Wiederholung" : "Memory") : localizedWordGroupTitle(group, nativeLanguage),
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
      setSessionNotice(german ? "Wähle zuerst mindestens eine Kategorie aus." : "Choose at least one category first.");
      return;
    }

    const items = buildWordSession(type, groupsForQuiz, data.groups, { sessionSize, questionStyle });
    if (!items.length) {
      setSession(null);
      setSessionResults([]);
      setSessionIndex(0);
      setSessionNotice(type === "memory"
        ? (german ? "Bearbeite zuerst einige Wörter aus den Kategorien. Danach fragt die Wiederholung sie erneut ab." : "Do a few category questions first, then Memory will test them again.")
        : (german ? "Die ausgewählten Kategorien enthalten noch keine Wörter." : "The selected categories have no words yet."));
      return;
    }

    setStudyMode(type);
    setSelectedGroupId(groupsForQuiz[0]?.id || selectedGroupId || data.groups[0]?.id || "");
    setSession({
      type,
      groupIds: groupsForQuiz.map((group) => group.id),
      groupTitle: type === "memory" ? (german ? "Wiederholung" : "Memory") : groupsForQuiz.map((group) => localizedWordGroupTitle(group, nativeLanguage)).join(", "),
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

  const finishQuiz = (completedSession = wordSessionRef.current, completedResults = wordSessionResultsRef.current) => {
    const total = completedSession?.items.length || 0;
    const correct = completedResults.filter(Boolean).length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    setLastSummary({
      title: completedSession?.groupTitle || (german ? "Wörter" : "Words"),
      type: completedSession?.type || studyMode,
      correct,
      total,
      score,
      difficulty: german ? ({ easy: "Kurz", standard: "Normal", challenge: "Intensiv" }[difficulty] || "Normal") : wordSessionSizes.find((item) => item.key === difficulty)?.label || "Standard",
      questionType: german ? ({ mixed: "Gemischt", flashcard: "Karten", recognition: "Bedeutung wählen", picture: "Bild erkennen", typing: "Spanisch schreiben", context: "Im Satz einsetzen" }[questionStyle] || "Gemischt") : wordQuestionStyles.find((item) => item.key === questionStyle)?.label || "Mixed"
    });
    setSession(null);
    wordSessionRef.current = null;
    setSessionIndex(0);
    setSessionResults([]);
    wordSessionResultsRef.current = [];
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
    const activeSession = wordSessionRef.current;
    if (activeSession) {
      if (sessionIndex + 1 >= activeSession.items.length) {
        finishQuiz(activeSession, wordSessionResultsRef.current);
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
        mode: ["typing", "picture", "context"].includes(attemptMode) ? "native-es" : "es-native",
        answer,
        quality,
        activityMode: attemptMode
      }
    });
    setFeedback(result);
    setLastAnswer({
      correct: result.correct,
      spanish: word.spanish,
      english: word.english,
      meaning: localizedWordMeaning(word, nativeLanguage),
      submitted: answer || (quality ? quality : ""),
      expected: result.expected,
      message: result.review?.message || "",
      orthographyWarning: Boolean(result.orthographyWarning),
      scheduleAdvanced: result.review?.scheduleAdvanced !== false,
      xpAwarded: result.xpAwarded
    });
    if (session) {
      if (!result.correct) {
        setSession((current) => {
          const next = current ? { ...current, items: queueMissedWord(current.items, sessionIndex) } : current;
          wordSessionRef.current = next;
          return next;
        });
      }
      setSessionResults((current) => {
        const next = [...current];
        next[sessionIndex] = Boolean(result.correct);
        wordSessionResultsRef.current = next;
        return next;
      });
      wordAdvanceTimer.current = window.setTimeout(() => {
        wordAdvanceTimer.current = null;
        nextCard();
      }, result.correct ? 750 : 2200);
    } else {
      await loadWords(false);
    }
  };

  if (loading || !data) {
    return <Panel title={german ? "Wörter" : "Words"}>{german ? "Wortpakete werden geladen..." : "Loading word decks..."}</Panel>;
  }

  if (!word && !sessionFinished) {
    return <Panel title={german ? "Wörter" : "Words"}>{german ? "Noch keine Wörter verfügbar." : "No words are available yet."}</Panel>;
  }

  const sessionTotal = session?.items.length || 0;
  const attemptedCount = sessionResults.filter((result) => result !== undefined).length;
  const sessionCorrect = sessionResults.filter(Boolean).length;
  const sessionProgress = sessionTotal ? Math.round((attemptedCount / sessionTotal) * 100) : 0;
  const scorePercent = sessionTotal ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
  const selectedLearned = selectedGroup?.learned ?? selectedGroup?.mastered ?? 0;
  const selectedTotal = selectedGroup?.total || 0;
  const promptLabel = activeMode === "typing"
    ? german ? "Schreiben" : "Type"
    : activeMode === "context"
      ? german ? "Satzlücke" : "Sentence gap"
    : activeMode === "recognition"
      ? german ? "Auswahl" : "Choice"
      : activeMode === "picture"
        ? german ? "Bild" : "Picture"
        : german ? "Karte" : "Flip";
  const contextPrompt = activeMode === "context" ? wordContextPrompt(word) : null;
  const learningPhase = currentSessionItem?.phase || (activeMode === "context" ? "apply" : activeMode === "flashcard" ? "introduce" : "retrieve");
  const learningPhaseLabel = german
    ? ({ introduce: "Einführen", recognize: "Erkennen", retrieve: "Aktiv abrufen", apply: "Im Satz einsetzen" }[learningPhase] || "Abrufen")
    : ({ introduce: "Introduce", recognize: "Recognize", retrieve: "Active recall", apply: "Use in a sentence" }[learningPhase] || "Retrieve");
  const expectedChoice = activeMode === "picture" ? word?.spanish : word?.english;
  const nextLabel = session
    ? sessionIndex + 1 >= session.items.length
      ? german ? "Einheit abschließen" : "Finish session"
      : german ? "Nächste Aufgabe" : "Next question"
    : german ? "Nächstes Wort" : "Next word";
  const sessionTitle = session
    ? session.type === "memory"
      ? german ? "Wiederholungseinheit" : "Memory Session"
      : `${session.groupTitle || localizedWordGroupTitle(selectedGroup, nativeLanguage)} ${german ? "– Lerneinheit" : "Session"}`
    : localizedWordGroupTitle(selectedGroup, nativeLanguage) || (german ? "Wortpaket" : "Word Deck");
  const selectedWordCount = selectedGroups.reduce((sum, group) => sum + (group.total || group.words?.length || 0), 0);
  const canStartQuiz = studyMode === "memory" ? memoryCount > 0 : selectedGroups.length > 0 && selectedWordCount > 0;

  if (!session) {
    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-5">
          <Panel title={german ? "Wörtertraining zusammenstellen" : "Word Quiz Setup"} icon={NotebookTabs}>
            {lastSummary && (
              <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{german ? "Letzte Einheit" : "Last Quiz"}</p>
                    <h2 className="mt-1 text-xl font-black text-emerald-950">{lastSummary.title}</h2>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {lastSummary.correct}/{lastSummary.total} {german ? "richtig" : "correct"} · {lastSummary.difficulty} · {lastSummary.questionType}
                    </p>
                  </div>
                  <div className="text-3xl font-black text-emerald-700">{lastSummary.score}%</div>
                </div>
              </div>
            )}

            <div className="grid gap-4 rounded-lg border border-stone-200 bg-stone-50 p-4 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Modus" : "Mode"}</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["learn", german ? "Kategorien lernen" : "Learn Categories"],
                    ["memory", german ? "Wiederholen" : "Memory"]
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
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Umfang" : "Difficulty"}</p>
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
                      {german ? ({ easy: "Kurz", standard: "Normal", challenge: "Intensiv" }[item.key] || item.label) : item.label} · {item.count}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Aufgabentyp" : "Question Type"}</p>
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
                      {german ? ({ mixed: "Gemischt", flashcard: "Karten", recognition: "Bedeutung wählen", picture: "Bild erkennen", typing: "Spanisch schreiben", context: "Im Satz einsetzen" }[item.key] || item.label) : item.label}
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
                  ? german ? `${memoryCount} Wörter zur Wiederholung verfügbar` : `${memoryCount} memory word${memoryCount === 1 ? "" : "s"} available`
                  : german ? `${selectedGroups.length} Kategorien · ${selectedWordCount} Wörter` : `${selectedGroups.length} categor${selectedGroups.length === 1 ? "y" : "ies"} · ${selectedWordCount} words`}
              </div>
              <button
                disabled={!canStartQuiz}
                onClick={() => startQuiz(studyMode)}
                className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {german ? "Training starten" : "Start Quiz"}
              </button>
            </div>
          </Panel>

          <Panel title={german ? "Kategorien" : "Categories"} icon={ListChecks}>
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const ids = data.groups.map((group) => group.id);
                  setSelectedGroupIds(ids);
                  setSelectedGroupId(ids[0] || "");
                }}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-stone-50"
              >
                {german ? "Alle auswählen" : "Select All"}
              </button>
              <button
                onClick={() => {
                  setSelectedGroupIds([]);
                  setSelectedGroupId("");
                }}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-stone-50"
              >
                {german ? "Auswahl leeren" : "Clear"}
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
                    <AssetImage imageKey={group.imageKey} alt={localizedWordGroupTitle(group, nativeLanguage)} className="h-12 w-12" />
                    <div className="min-w-0">
                      <p className="truncate font-black">{localizedWordGroupTitle(group, nativeLanguage)}</p>
                      <p className="truncate text-xs text-slate-500">
                        {group.new ?? 0} {german ? "neu" : "new"} · {group.reviewDue ?? group.due} {german ? "wiederholen" : "review"}
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
          <Panel title={german ? "Wortschatz-Status" : "Word Stats"} icon={BarChart3}>
            <div className="grid grid-cols-2 gap-3">
              <InfoTile label={german ? "Insgesamt" : "Total"} value={data.stats.total} />
              <InfoTile label={german ? "Neu" : "New"} value={data.stats.new ?? 0} />
              <InfoTile label={german ? "Fällig" : "Review"} value={data.stats.reviewDue ?? data.stats.due} />
              <InfoTile label={german ? "Wiederholung" : "Memory"} value={memoryCount} />
              <InfoTile label={german ? "Gelernt" : "Learned"} value={data.stats.learned ?? 0} />
              <InfoTile label={german ? "Sicher" : "Mastered"} value={data.stats.mastered} />
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
            {german ? "Beenden" : "Exit"}
          </button>
        }
      >
        <div className="mb-5 rounded-lg border border-lagoon-100 bg-lagoon-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-black text-lagoon-900">
            <span>{session.type === "memory" ? `${german ? "Wiederholung" : "Memory"} · ${memoryCount} ${german ? "Wörter" : "words"}` : session.groupTitle}</span>
            <span>
              {attemptedCount}/{sessionTotal} {german ? "beantwortet" : "answered"} · {learningPhaseLabel}
            </span>
          </div>
          <ProgressBar value={sessionProgress} className="mt-3" />
          {session.type === "learn" && (
            <div className="mt-3 flex flex-wrap gap-1.5" aria-label={german ? "Lernschritte" : "Learning steps"}>
              {[
                ["introduce", german ? "1 Einführen" : "1 Introduce"],
                ["recognize", german ? "2 Erkennen" : "2 Recognize"],
                ["retrieve", german ? "3 Abrufen" : "3 Retrieve"],
                ["apply", german ? "4 Im Satz" : "4 In context"]
              ].map(([key, label]) => (
                <span key={key} className={classNames("rounded-full px-2.5 py-1 text-[11px] font-black", learningPhase === key ? "bg-lagoon-700 text-white" : "bg-white/80 text-lagoon-800")}>{label}</span>
              ))}
            </div>
          )}
        </div>

        {lastAnswer && (
          <div
            className={classNames(
              "mb-5 rounded-lg border p-4",
              lastAnswer.orthographyWarning ? "border-honey-300 bg-honey-50" : lastAnswer.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className={classNames("text-xs font-black uppercase tracking-wide", lastAnswer.orthographyWarning ? "text-honey-800" : lastAnswer.correct ? "text-emerald-700" : "text-red-700")}>
                  {german ? "Letzte Antwort" : "Last answer"}
                </p>
                <p className="mt-1 font-black text-slate-950">
                  {lastAnswer.spanish} = {lastAnswer.meaning || lastAnswer.english}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {lastAnswer.orthographyWarning
                    ? (german ? `Inhaltlich richtig. Schreibe beim nächsten Abruf „${lastAnswer.expected}“ mit Akzent.` : `Meaning correct. Next time, write “${lastAnswer.expected}” with its accent.`)
                    : lastAnswer.correct ? `${german ? "Richtig" : "Correct"} +${lastAnswer.xpAwarded} XP` : `${german ? "Erwartet" : "Expected"}: ${german ? localizedWordMeaning({ english: lastAnswer.expected }, nativeLanguage) || lastAnswer.expected : lastAnswer.expected}`}
                </p>
              </div>
              <span className={classNames("rounded-full px-3 py-1 text-sm font-black", lastAnswer.orthographyWarning ? "bg-honey-100 text-honey-900" : lastAnswer.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}>
                {lastAnswer.orthographyWarning
                  ? (german ? "Kommt früher zurück" : "Returns sooner")
                  : lastAnswer.correct
                  ? lastAnswer.scheduleAdvanced
                    ? (german ? "Später erneut fällig" : "Scheduled forward")
                    : (german ? "Lernschritt gefestigt" : "Learning step reinforced")
                  : (german ? "Wird bald wiederholt" : "Queued again soon")}
              </span>
            </div>
            {lastAnswer.message && !german && <p className="mt-2 text-sm font-semibold text-slate-600">{lastAnswer.message}</p>}
          </div>
        )}

        <div className={classNames("grid gap-5", activeMode === "picture" ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-1")}>
          {activeMode === "picture" && (
            <div>
              <AssetImage imageKey={word.imageKey} alt={word.spanish} className="aspect-square w-full" />
              <div className="mt-3 flex justify-between text-sm font-bold text-slate-500">
                <span>{sessionIndex + 1} / {sessionTotal}</span>
                <span>{localizedReviewState(word.review.state, nativeLanguage)}</span>
              </div>
            </div>
          )}

          <div className="flex min-h-[330px] flex-col rounded-lg border border-stone-200 bg-stone-50 p-5">
            {activeMode === "flashcard" && (
              <>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">{german ? "Vorderseite" : "Front"}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-4xl font-black text-slate-950">{word.spanish}</h2>
                  {!quiet && <PronunciationTools text={word.spanish} nativeLanguage={nativeLanguage} />}
                </div>
                {flipped && (
                  <div className="mt-6 grid gap-4 rounded-lg border border-lagoon-200 bg-white p-4 sm:grid-cols-[150px_1fr] sm:items-center">
                    <AssetImage imageKey={word.imageKey} alt={word.spanish} className="aspect-square w-full" />
                    <div>
                      <p className="text-sm font-black text-lagoon-700">{german ? "Bedeutung" : "Meaning"}</p>
                      <p className="mt-1 text-2xl font-black text-lagoon-900">{localizedWordMeaning(word, nativeLanguage)}</p>
                      <p className="mt-2 text-sm font-bold text-slate-600">
                        {localizedWordGrammar(word.partOfSpeech, nativeLanguage)}
                        {word.gender && localizedWordGrammar(word.gender, nativeLanguage) ? ` · ${localizedWordGrammar(word.gender, nativeLanguage)}` : ""}
                      </p>
                      {spanishLearningExample(word.example) && <p className="mt-3 font-bold text-slate-700">{spanishLearningExample(word.example)}</p>}
                    </div>
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {!flipped ? (
                    <button onClick={() => setFlipped(true)} className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600">
                      {german ? "Karte umdrehen" : "Flip Card"}
                    </button>
                  ) : (
                    <>
                      <button
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord("", "flashcard", "again")}
                        className="rounded-md bg-red-600 px-4 py-3 font-black text-white hover:bg-red-700 disabled:cursor-default disabled:opacity-60"
                      >
                        {german ? "Noch einmal" : "Again"}
                      </button>
                      <button
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord(word.english, "flashcard", "hard")}
                        className="rounded-md bg-honey-500 px-4 py-3 font-black text-white hover:bg-honey-600 disabled:cursor-default disabled:opacity-60"
                      >
                        {german ? "Schwer" : "Hard"}
                      </button>
                      <button
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord(word.english, "flashcard", "good")}
                        className="rounded-md bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700 disabled:cursor-default disabled:opacity-60"
                      >
                        {german ? "Gut" : "Good"}
                      </button>
                      <button
                        disabled={Boolean(feedback)}
                        onClick={() => submitWord(word.english, "flashcard", "easy")}
                        className="rounded-md bg-lagoon-600 px-4 py-3 font-black text-white hover:bg-lagoon-700 disabled:cursor-default disabled:opacity-60"
                      >
                        {german ? "Leicht" : "Easy"}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {activeMode === "recognition" && (
              <>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">{german ? "Wähle die Bedeutung" : "Choose the meaning"}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-4xl font-black text-slate-950">{word.spanish}</h2>
                  {!quiet && <PronunciationTools text={word.spanish} nativeLanguage={nativeLanguage} />}
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
                      {german ? localizedWordMeaning({ english: choice }, nativeLanguage) : choice}
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeMode === "picture" && (
              <>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">{german ? "Wähle das spanische Wort" : "Choose the Spanish"}</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">{german ? "Was ist das?" : "What is this?"}</h2>
                {!quiet && <div className="mt-3"><PronunciationTools text={word.spanish} nativeLanguage={nativeLanguage} /></div>}
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
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">{german ? "Schreibe das spanische Wort" : "Type the Spanish"}</p>
                <h2 className="mt-3 text-4xl font-black text-slate-950">{localizedWordMeaning(word, nativeLanguage)}</h2>
                <input
                  ref={typedInputRef}
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
                  placeholder={german ? "Spanisches Wort" : "Spanish word"}
                />
                <SpanishCharacterBar value={typedAnswer} onChange={setTypedAnswer} inputRef={typedInputRef} disabled={Boolean(feedback)} nativeLanguage={nativeLanguage} />
                <button
                  disabled={!typedAnswer.trim() || Boolean(feedback)}
                  onClick={() => submitWord(typedAnswer, "typing")}
                  className="mt-4 w-fit rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 disabled:opacity-50"
                >
                  {german ? "Prüfen" : "Check"}
                </button>
              </>
            )}

            {activeMode === "context" && contextPrompt && (
              <>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">{german ? "Setze das Wort im Satz ein" : "Use the word in context"}</p>
                <p className="mt-3 text-sm font-bold text-lagoon-800">{localizedWordMeaning(word, nativeLanguage)}</p>
                <h2 className="mt-3 rounded-md border border-lagoon-100 bg-white px-4 py-5 text-2xl font-black leading-relaxed text-slate-950">{contextPrompt.masked}</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {german ? "Der Satz zeigt die echte Umgebung des Wortes. Konzentriere dich zunächst auf die Lücke – du musst noch nicht jedes andere Wort verstehen." : "The sentence shows the word in a real context. Focus on the gap first; you do not need to understand every other word yet."}
                </p>
                <input
                  ref={typedInputRef}
                  value={typedAnswer}
                  disabled={Boolean(feedback)}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    if (!feedback && typedAnswer.trim()) submitWord(typedAnswer, "context");
                  }}
                  className="mt-5 w-full rounded-md border border-stone-200 bg-white px-4 py-4 text-xl font-bold outline-none focus:border-lagoon-500 disabled:bg-stone-100"
                  placeholder={german ? "Fehlendes spanisches Wort" : "Missing Spanish word"}
                />
                <SpanishCharacterBar value={typedAnswer} onChange={setTypedAnswer} inputRef={typedInputRef} disabled={Boolean(feedback)} nativeLanguage={nativeLanguage} />
                <button
                  disabled={!typedAnswer.trim() || Boolean(feedback)}
                  onClick={() => submitWord(typedAnswer, "context")}
                  className="mt-4 w-fit rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 disabled:opacity-50"
                >
                  {german ? "Im Satz prüfen" : "Check in context"}
                </button>
              </>
            )}

            {feedback && (
              <div className={classNames("mt-5 rounded-lg border p-4", feedback.orthographyWarning ? "border-honey-300 bg-honey-50" : feedback.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50")}>
                <p className={classNames("font-black", feedback.orthographyWarning ? "text-honey-950" : feedback.correct ? "text-emerald-900" : "text-red-900")}>
                  {feedback.orthographyWarning
                    ? (german ? "Inhaltlich richtig – Akzent noch festigen" : "Meaning correct—strengthen the accent")
                    : feedback.correct ? `${german ? "Richtig" : "Correct"} +${feedback.xpAwarded} XP` : (german ? "Noch nicht" : "Not yet")}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {german ? "Erwartet" : "Expected"}: <span className="font-black">{["recognition", "flashcard"].includes(activeMode) && german ? localizedWordMeaning({ english: feedback.expected }, nativeLanguage) || feedback.expected : feedback.expected}</span>
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {german
                    ? feedback.orthographyWarning
                      ? `Deine Antwort wurde verstanden. Die vollständige spanische Schreibweise lautet „${feedback.expected}“. Das Wort kommt deshalb bewusst früher zurück.`
                      : feedback.correct
                      ? feedback.review.scheduleAdvanced === false
                        ? "Dieser Lernschritt ist geschafft. Der bereits geplante Wiederholungstermin bleibt unverändert."
                        : "Das Wort wurde im Lernplan weitergesetzt und wird mit passendem Abstand erneut abgefragt."
                      : "Dieses Wort kommt bald noch einmal zurück."
                    : feedback.review.message}
                </p>
                {feedback.correct && activeMode === "context" && contextPrompt && (
                  <div className="mt-3 rounded-md border border-emerald-200 bg-white px-3 py-3">
                    <p className="font-black text-slate-950">{contextPrompt.example}</p>
                    {!quiet && <div className="mt-2"><PronunciationTools text={contextPrompt.example} compact nativeLanguage={nativeLanguage} /></div>}
                  </div>
                )}
                <div className="mt-4 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
                  {nextLabel} {german ? "wird geladen..." : "loading..."}
                </div>
              </div>
            )}
          </div>
        </div>
      </Panel>
    </section>
  );

}

function PronunciationLookupView({ nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  const queryInputRef = useRef(null);
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
  const providerAvailability = result?.providers || ["spanishdict", "leo"].map((provider) => ({
    provider,
    label: provider === "spanishdict" ? "SpanishDict" : "LEO",
    availability: sources.some((source) => source.provider === provider && source.playable)
      ? "playable"
      : sources.some((source) => source.provider === provider)
        ? "unknown"
        : "not_found"
  }));
  const canPlayResolvedAudio = sources.some((source) => source.availability !== "unavailable");
  const links = result?.links || (searchText ? dictionaryLinks(searchText) : null);

  const providerLabel = (provider) => {
    if (provider === "spanishdict") return "SpanishDict";
    if (provider === "leo") return "LEO";
    return provider || "Provider";
  };

  const audioLabel = (state, idleLabel = "Play") => {
    if (state === "loading") return german ? "Lädt" : "Loading";
    if (state === "playing") return german ? "Wird abgespielt" : "Playing";
    if (state === "error") return german ? "Erneut versuchen" : "Retry";
    return german && idleLabel === "Play" ? "Abspielen" : idleLabel;
  };

  const availabilityLabel = (availability) => {
    if (availability === "playable") return german ? "Abspielbar" : "Playable";
    if (availability === "unavailable") return german ? "Nicht erreichbar" : "Unavailable";
    if (availability === "not_found") return german ? "Keine Aufnahme" : "No recording";
    return german ? "Prüfung unsicher" : "Verification uncertain";
  };

  const availabilityClass = (availability) => {
    if (availability === "playable") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (["unavailable", "not_found"].includes(availability)) return "border-stone-200 bg-stone-100 text-slate-500";
    return "border-honey-200 bg-honey-50 text-honey-800";
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
      setSaveStatus(german ? "Aus dem gespeicherten Wortschatz entfernt." : "Removed from Audio Lab vocabulary.");
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
      if (!german) {
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
        <Panel title={german ? "Spanische Aussprache nachschlagen" : "Audio Lookup"} icon={Volume2}>
          <form onSubmit={lookup} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="block text-sm font-semibold text-slate-700">
              {german ? "Spanisches Wort oder Wendung" : "Word"}
              <input
                ref={queryInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="mt-2 w-full rounded-md border border-stone-200 bg-white px-4 py-4 text-xl font-black text-slate-950 outline-none focus:border-lagoon-500"
                placeholder={german ? "Spanisches Wort oder Wendung" : "Spanish word or phrase"}
              />
              <SpanishCharacterBar value={query} onChange={setQuery} inputRef={queryInputRef} disabled={loading} nativeLanguage={nativeLanguage} />
            </label>
            <button
              type="submit"
              disabled={!searchText || loading}
              className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Search size={18} />
              {loading ? (german ? "Suche läuft" : "Searching") : (german ? "Audio finden" : "Find Audio")}
            </button>
          </form>

          {error && <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-700">{error}</div>}

          {loading && (
            <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-5 font-bold text-slate-600">
              {german ? "Aussprachequellen werden durchsucht..." : "Searching SpanishDict and LEO..."}
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-lagoon-100 bg-lagoon-50 p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{german ? "Suchergebnis" : "Search"}</p>
                  <h2 className="mt-1 text-3xl font-black text-slate-950">{result.text}</h2>
                  <p className="mt-1 text-sm font-bold text-slate-600">
                    {german ? `${sources.length} Treffer · ${playableCount} abspielbar` : `${sources.length} match${sources.length === 1 ? "" : "es"} · ${playableCount} playable`}
                  </p>
                  {!german && meanings.length > 0 && (
                    <p className="mt-3 text-xl font-black text-lagoon-950">
                      {result.bestMeaning || meanings[0].text}
                    </p>
                  )}
                  {saveStatus && <p className="mt-2 text-sm font-bold text-emerald-700">{saveStatus}</p>}
                  {saveError && <p className="mt-2 text-sm font-bold text-red-700">{saveError}</p>}
                </div>
                <button
                  type="button"
                  disabled={!canPlayResolvedAudio}
                  onClick={() => playPronunciationClip(result.text, setBestAudioState)}
                  className={classNames(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 font-black",
                    bestAudioState === "playing"
                      ? "border-lagoon-300 bg-white text-lagoon-800"
                      : "border-stone-200 bg-white text-slate-800 hover:bg-stone-50",
                    bestAudioState === "error" && "border-red-200 bg-red-50 text-red-700",
                    !canPlayResolvedAudio && "cursor-not-allowed opacity-50"
                  )}
                >
                  <Volume2 size={18} />
                  {audioLabel(bestAudioState, german ? "Beste Aussprache" : "Best Match")}
                </button>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Aussprachetraining" : "Meaning"}</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-950">
                      {german ? "Höre das spanische Modell und sprich es anschließend selbst nach." : result.bestMeaning || meanings[0]?.text || "Meaning not found yet"}
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
                {!german && meanings.length > 1 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {meanings.slice(1, 5).map((meaning) => (
                      <span key={`${meaning.source}-${meaning.text}`} className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-slate-700">
                        {meaning.text}
                      </span>
                    ))}
                  </div>
                )}
                {!german && !!result.wordByWord?.length && (
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
                                "rounded-full border px-3 py-1 text-xs font-black",
                                availabilityClass(source.availability || (source.playable ? "playable" : "unknown"))
                              )}
                            >
                              {availabilityLabel(source.availability || (source.playable ? "playable" : "unknown"))}
                            </span>
                          </div>
                          <p className="mt-2 truncate text-lg font-black text-slate-950">{source.sourceText || result.text}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={source.availability === "unavailable"}
                            onClick={() =>
                              playPronunciationClip(result.text, setSourceAudioState(key), source.provider, source.sourceText)
                            }
                            className={classNames(
                              "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-4 font-black text-slate-700 hover:bg-stone-50",
                              state === "playing" && "border-lagoon-300 bg-lagoon-50 text-lagoon-800",
                              state === "error" && "border-red-200 bg-red-50 text-red-700",
                              source.availability === "unavailable" && "cursor-not-allowed opacity-50"
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
                            {german ? "Öffnen" : "Open"}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-honey-200 bg-honey-50 p-5">
                  <p className="font-black text-honey-900">{german ? "Kein passender Audioclip gefunden" : "No matching clip found"}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{german ? "Du kannst die Wörterbuchquellen zur manuellen Kontrolle öffnen." : "Dictionary entries are available for manual review."}</p>
                </div>
              )}
            </div>
          )}
        </Panel>
      </section>

      <aside className="space-y-5">
        <Panel title={german ? "Audioquellen" : "Resolver"} icon={ListChecks}>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile label={german ? "Quellen" : "Sources"} value={result ? sources.length : 0} />
            <InfoTile label={german ? "Abspielbar" : "Playable"} value={result ? playableCount : 0} />
          </div>
          <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Verfügbarkeit je Anbieter" : "Availability by provider"}</p>
            <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700">
              {providerAvailability.map((provider) => (
                <div key={provider.provider} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
                  <span>{provider.label}</span>
                  <span className={classNames("rounded-full border px-2.5 py-1 text-xs", availabilityClass(provider.availability))}>
                    {availabilityLabel(provider.availability)}
                  </span>
                </div>
              ))}
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
        <Panel title={german ? "Zuletzt gespeichert" : "Recently Saved"} icon={NotebookTabs}>
          {recentLoading ? (
            <p className="text-sm font-semibold text-slate-600">{german ? "Gespeicherte Wörter werden geladen..." : "Loading saved words..."}</p>
          ) : savedWords.length ? (
            <div className="grid gap-3">
              {savedWords.map((word) => (
                <div key={word.id} className="rounded-lg border border-stone-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950">{word.spanish}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{localizedWordMeaning(word, nativeLanguage)}</p>
                      <p className="mt-1 text-xs font-bold text-lagoon-700">
                        {german ? (word.review?.due ? "Jetzt fällig" : "Gespeichert") : word.review?.due ? "Due now" : word.review?.state || "Saved"}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={deletingWordId === word.id}
                      onClick={() => deleteSavedWord(word.id)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-red-100 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                      title={german ? `${word.spanish} entfernen` : `Remove ${word.spanish}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-600">{german ? "Im deutschen Modus bleibt die Audiosuche ein reines Aussprachewerkzeug; bekannte Wörter übst du im Wörterbereich." : "Saved Audio Lab words will appear here."}</p>
          )}
        </Panel>
      </aside>
    </div>
  );
}

// Large, always-translated speaking library. `type` is "word" or "sentence"
// so learners can drill single vocabulary or full phrases; `tag` groups items
// into categories for focused practice.
const SPEAKING_LIBRARY = [
  // Saludos y cortesía
  { spanish: "Hola", english: "Hello", tag: "Greetings", type: "word" },
  { spanish: "Adiós", english: "Goodbye", tag: "Greetings", type: "word" },
  { spanish: "Gracias", english: "Thank you", tag: "Greetings", type: "word" },
  { spanish: "Por favor", english: "Please", tag: "Greetings", type: "word" },
  { spanish: "Perdón", english: "Sorry / Excuse me", tag: "Greetings", type: "word" },
  { spanish: "Buenos días", english: "Good morning", tag: "Greetings", type: "sentence" },
  { spanish: "Buenas tardes", english: "Good afternoon", tag: "Greetings", type: "sentence" },
  { spanish: "Buenas noches", english: "Good night", tag: "Greetings", type: "sentence" },
  { spanish: "Muchas gracias", english: "Thank you very much", tag: "Greetings", type: "sentence" },
  { spanish: "De nada", english: "You're welcome", tag: "Greetings", type: "sentence" },
  { spanish: "¿Cómo estás?", english: "How are you?", tag: "Greetings", type: "sentence" },
  { spanish: "Muy bien, gracias", english: "Very well, thank you", tag: "Greetings", type: "sentence" },
  { spanish: "Hasta luego", english: "See you later", tag: "Greetings", type: "sentence" },
  { spanish: "Hasta mañana", english: "See you tomorrow", tag: "Greetings", type: "sentence" },
  { spanish: "Mucho gusto", english: "Nice to meet you", tag: "Greetings", type: "sentence" },
  { spanish: "Lo siento", english: "I'm sorry", tag: "Greetings", type: "sentence" },
  { spanish: "Con permiso", english: "Excuse me (to pass)", tag: "Greetings", type: "sentence" },
  { spanish: "Bienvenido", english: "Welcome", tag: "Greetings", type: "word" },

  // Presentaciones
  { spanish: "¿Cómo te llamas?", english: "What's your name?", tag: "Introductions", type: "sentence" },
  { spanish: "Me llamo Ana", english: "My name is Ana", tag: "Introductions", type: "sentence" },
  { spanish: "Soy de España", english: "I'm from Spain", tag: "Introductions", type: "sentence" },
  { spanish: "¿De dónde eres?", english: "Where are you from?", tag: "Introductions", type: "sentence" },
  { spanish: "Tengo veinte años", english: "I'm twenty years old", tag: "Introductions", type: "sentence" },
  { spanish: "Encantado de conocerte", english: "Pleased to meet you", tag: "Introductions", type: "sentence" },
  { spanish: "Hablo un poco de español", english: "I speak a little Spanish", tag: "Introductions", type: "sentence" },
  { spanish: "Estoy aprendiendo español", english: "I'm learning Spanish", tag: "Introductions", type: "sentence" },

  // Familia y personas
  { spanish: "La familia", english: "The family", tag: "Family & People", type: "word" },
  { spanish: "La madre", english: "The mother", tag: "Family & People", type: "word" },
  { spanish: "El padre", english: "The father", tag: "Family & People", type: "word" },
  { spanish: "El hermano", english: "The brother", tag: "Family & People", type: "word" },
  { spanish: "La hermana", english: "The sister", tag: "Family & People", type: "word" },
  { spanish: "El hijo", english: "The son", tag: "Family & People", type: "word" },
  { spanish: "La hija", english: "The daughter", tag: "Family & People", type: "word" },
  { spanish: "El abuelo", english: "The grandfather", tag: "Family & People", type: "word" },
  { spanish: "La abuela", english: "The grandmother", tag: "Family & People", type: "word" },
  { spanish: "El amigo", english: "The friend (m)", tag: "Family & People", type: "word" },
  { spanish: "La amiga", english: "The friend (f)", tag: "Family & People", type: "word" },
  { spanish: "El niño", english: "The boy", tag: "Family & People", type: "word" },
  { spanish: "La mujer", english: "The woman", tag: "Family & People", type: "word" },
  { spanish: "El hombre", english: "The man", tag: "Family & People", type: "word" },
  { spanish: "Tengo dos hermanos", english: "I have two siblings", tag: "Family & People", type: "sentence" },
  { spanish: "Mi familia es grande", english: "My family is big", tag: "Family & People", type: "sentence" },

  // Números
  { spanish: "Uno", english: "One", tag: "Numbers", type: "word" },
  { spanish: "Dos", english: "Two", tag: "Numbers", type: "word" },
  { spanish: "Tres", english: "Three", tag: "Numbers", type: "word" },
  { spanish: "Cuatro", english: "Four", tag: "Numbers", type: "word" },
  { spanish: "Cinco", english: "Five", tag: "Numbers", type: "word" },
  { spanish: "Seis", english: "Six", tag: "Numbers", type: "word" },
  { spanish: "Siete", english: "Seven", tag: "Numbers", type: "word" },
  { spanish: "Ocho", english: "Eight", tag: "Numbers", type: "word" },
  { spanish: "Nueve", english: "Nine", tag: "Numbers", type: "word" },
  { spanish: "Diez", english: "Ten", tag: "Numbers", type: "word" },
  { spanish: "Veinte", english: "Twenty", tag: "Numbers", type: "word" },
  { spanish: "Cincuenta", english: "Fifty", tag: "Numbers", type: "word" },
  { spanish: "Cien", english: "One hundred", tag: "Numbers", type: "word" },
  { spanish: "Mil", english: "One thousand", tag: "Numbers", type: "word" },

  // Colores
  { spanish: "Rojo", english: "Red", tag: "Colors", type: "word" },
  { spanish: "Azul", english: "Blue", tag: "Colors", type: "word" },
  { spanish: "Verde", english: "Green", tag: "Colors", type: "word" },
  { spanish: "Amarillo", english: "Yellow", tag: "Colors", type: "word" },
  { spanish: "Naranja", english: "Orange", tag: "Colors", type: "word" },
  { spanish: "Negro", english: "Black", tag: "Colors", type: "word" },
  { spanish: "Blanco", english: "White", tag: "Colors", type: "word" },
  { spanish: "Rosa", english: "Pink", tag: "Colors", type: "word" },
  { spanish: "Morado", english: "Purple", tag: "Colors", type: "word" },
  { spanish: "Gris", english: "Gray", tag: "Colors", type: "word" },
  { spanish: "Marrón", english: "Brown", tag: "Colors", type: "word" },

  // Días y tiempo
  { spanish: "Lunes", english: "Monday", tag: "Days & Time", type: "word" },
  { spanish: "Martes", english: "Tuesday", tag: "Days & Time", type: "word" },
  { spanish: "Miércoles", english: "Wednesday", tag: "Days & Time", type: "word" },
  { spanish: "Jueves", english: "Thursday", tag: "Days & Time", type: "word" },
  { spanish: "Viernes", english: "Friday", tag: "Days & Time", type: "word" },
  { spanish: "Sábado", english: "Saturday", tag: "Days & Time", type: "word" },
  { spanish: "Domingo", english: "Sunday", tag: "Days & Time", type: "word" },
  { spanish: "Hoy", english: "Today", tag: "Days & Time", type: "word" },
  { spanish: "Mañana", english: "Tomorrow", tag: "Days & Time", type: "word" },
  { spanish: "Ayer", english: "Yesterday", tag: "Days & Time", type: "word" },
  { spanish: "La semana", english: "The week", tag: "Days & Time", type: "word" },
  { spanish: "El mes", english: "The month", tag: "Days & Time", type: "word" },
  { spanish: "¿Qué hora es?", english: "What time is it?", tag: "Days & Time", type: "sentence" },
  { spanish: "Son las tres", english: "It's three o'clock", tag: "Days & Time", type: "sentence" },

  // Comida y bebida
  { spanish: "El agua", english: "The water", tag: "Food & Drink", type: "word" },
  { spanish: "El café", english: "The coffee", tag: "Food & Drink", type: "word" },
  { spanish: "El pan", english: "The bread", tag: "Food & Drink", type: "word" },
  { spanish: "La leche", english: "The milk", tag: "Food & Drink", type: "word" },
  { spanish: "El huevo", english: "The egg", tag: "Food & Drink", type: "word" },
  { spanish: "La manzana", english: "The apple", tag: "Food & Drink", type: "word" },
  { spanish: "El queso", english: "The cheese", tag: "Food & Drink", type: "word" },
  { spanish: "La carne", english: "The meat", tag: "Food & Drink", type: "word" },
  { spanish: "El pescado", english: "The fish", tag: "Food & Drink", type: "word" },
  { spanish: "El arroz", english: "The rice", tag: "Food & Drink", type: "word" },
  { spanish: "La fruta", english: "The fruit", tag: "Food & Drink", type: "word" },
  { spanish: "La verdura", english: "The vegetable", tag: "Food & Drink", type: "word" },
  { spanish: "Quisiera un café, por favor", english: "I would like a coffee, please", tag: "Food & Drink", type: "sentence" },
  { spanish: "La cuenta, por favor", english: "The check, please", tag: "Food & Drink", type: "sentence" },
  { spanish: "Tengo hambre", english: "I'm hungry", tag: "Food & Drink", type: "sentence" },
  { spanish: "Tengo sed", english: "I'm thirsty", tag: "Food & Drink", type: "sentence" },
  { spanish: "Está delicioso", english: "It's delicious", tag: "Food & Drink", type: "sentence" },
  { spanish: "¿Qué me recomienda?", english: "What do you recommend?", tag: "Food & Drink", type: "sentence" },

  // Viajes y direcciones
  { spanish: "El aeropuerto", english: "The airport", tag: "Travel & Directions", type: "word" },
  { spanish: "La estación", english: "The station", tag: "Travel & Directions", type: "word" },
  { spanish: "El tren", english: "The train", tag: "Travel & Directions", type: "word" },
  { spanish: "El autobús", english: "The bus", tag: "Travel & Directions", type: "word" },
  { spanish: "El hotel", english: "The hotel", tag: "Travel & Directions", type: "word" },
  { spanish: "La calle", english: "The street", tag: "Travel & Directions", type: "word" },
  { spanish: "Izquierda", english: "Left", tag: "Travel & Directions", type: "word" },
  { spanish: "Derecha", english: "Right", tag: "Travel & Directions", type: "word" },
  { spanish: "Recto", english: "Straight ahead", tag: "Travel & Directions", type: "word" },
  { spanish: "¿Dónde está el baño?", english: "Where is the bathroom?", tag: "Travel & Directions", type: "sentence" },
  { spanish: "¿Dónde está la estación?", english: "Where is the station?", tag: "Travel & Directions", type: "sentence" },
  { spanish: "¿Cómo llego al centro?", english: "How do I get downtown?", tag: "Travel & Directions", type: "sentence" },
  { spanish: "Estoy perdido", english: "I'm lost", tag: "Travel & Directions", type: "sentence" },
  { spanish: "¿Está lejos?", english: "Is it far?", tag: "Travel & Directions", type: "sentence" },
  { spanish: "Quiero un billete de ida y vuelta", english: "I want a round-trip ticket", tag: "Travel & Directions", type: "sentence" },

  // Compras
  { spanish: "La tienda", english: "The shop", tag: "Shopping", type: "word" },
  { spanish: "El dinero", english: "The money", tag: "Shopping", type: "word" },
  { spanish: "El precio", english: "The price", tag: "Shopping", type: "word" },
  { spanish: "La talla", english: "The size", tag: "Shopping", type: "word" },
  { spanish: "Barato", english: "Cheap", tag: "Shopping", type: "word" },
  { spanish: "Caro", english: "Expensive", tag: "Shopping", type: "word" },
  { spanish: "¿Cuánto cuesta?", english: "How much does it cost?", tag: "Shopping", type: "sentence" },
  { spanish: "¿Puedo pagar con tarjeta?", english: "Can I pay by card?", tag: "Shopping", type: "sentence" },
  { spanish: "Solo estoy mirando", english: "I'm just looking", tag: "Shopping", type: "sentence" },
  { spanish: "Me lo llevo", english: "I'll take it", tag: "Shopping", type: "sentence" },

  // Casa
  { spanish: "La casa", english: "The house", tag: "Home", type: "word" },
  { spanish: "La puerta", english: "The door", tag: "Home", type: "word" },
  { spanish: "La ventana", english: "The window", tag: "Home", type: "word" },
  { spanish: "La mesa", english: "The table", tag: "Home", type: "word" },
  { spanish: "La silla", english: "The chair", tag: "Home", type: "word" },
  { spanish: "La cama", english: "The bed", tag: "Home", type: "word" },
  { spanish: "La cocina", english: "The kitchen", tag: "Home", type: "word" },
  { spanish: "El baño", english: "The bathroom", tag: "Home", type: "word" },
  { spanish: "El dormitorio", english: "The bedroom", tag: "Home", type: "word" },
  { spanish: "La llave", english: "The key", tag: "Home", type: "word" },

  // Cuerpo y salud
  { spanish: "La cabeza", english: "The head", tag: "Body & Health", type: "word" },
  { spanish: "La mano", english: "The hand", tag: "Body & Health", type: "word" },
  { spanish: "El ojo", english: "The eye", tag: "Body & Health", type: "word" },
  { spanish: "El pie", english: "The foot", tag: "Body & Health", type: "word" },
  { spanish: "El brazo", english: "The arm", tag: "Body & Health", type: "word" },
  { spanish: "La pierna", english: "The leg", tag: "Body & Health", type: "word" },
  { spanish: "El médico", english: "The doctor", tag: "Body & Health", type: "word" },
  { spanish: "Me duele la cabeza", english: "My head hurts", tag: "Body & Health", type: "sentence" },
  { spanish: "Estoy enfermo", english: "I'm sick", tag: "Body & Health", type: "sentence" },
  { spanish: "Necesito un médico", english: "I need a doctor", tag: "Body & Health", type: "sentence" },

  // Trabajo y escuela
  { spanish: "El trabajo", english: "The work / job", tag: "Work & School", type: "word" },
  { spanish: "La escuela", english: "The school", tag: "Work & School", type: "word" },
  { spanish: "El profesor", english: "The teacher", tag: "Work & School", type: "word" },
  { spanish: "El estudiante", english: "The student", tag: "Work & School", type: "word" },
  { spanish: "El libro", english: "The book", tag: "Work & School", type: "word" },
  { spanish: "La oficina", english: "The office", tag: "Work & School", type: "word" },
  { spanish: "El ordenador", english: "The computer", tag: "Work & School", type: "word" },
  { spanish: "¿En qué trabajas?", english: "What do you do for work?", tag: "Work & School", type: "sentence" },
  { spanish: "Trabajo en una oficina", english: "I work in an office", tag: "Work & School", type: "sentence" },
  { spanish: "Tengo una reunión", english: "I have a meeting", tag: "Work & School", type: "sentence" },

  // Clima y naturaleza
  { spanish: "El sol", english: "The sun", tag: "Weather & Nature", type: "word" },
  { spanish: "La lluvia", english: "The rain", tag: "Weather & Nature", type: "word" },
  { spanish: "El viento", english: "The wind", tag: "Weather & Nature", type: "word" },
  { spanish: "La nieve", english: "The snow", tag: "Weather & Nature", type: "word" },
  { spanish: "El mar", english: "The sea", tag: "Weather & Nature", type: "word" },
  { spanish: "La montaña", english: "The mountain", tag: "Weather & Nature", type: "word" },
  { spanish: "El árbol", english: "The tree", tag: "Weather & Nature", type: "word" },
  { spanish: "Hace calor", english: "It's hot", tag: "Weather & Nature", type: "sentence" },
  { spanish: "Hace frío", english: "It's cold", tag: "Weather & Nature", type: "sentence" },
  { spanish: "Está lloviendo", english: "It's raining", tag: "Weather & Nature", type: "sentence" },

  // Verbos comunes
  { spanish: "Ser", english: "To be (permanent)", tag: "Common Verbs", type: "word" },
  { spanish: "Estar", english: "To be (state)", tag: "Common Verbs", type: "word" },
  { spanish: "Tener", english: "To have", tag: "Common Verbs", type: "word" },
  { spanish: "Hacer", english: "To do / make", tag: "Common Verbs", type: "word" },
  { spanish: "Ir", english: "To go", tag: "Common Verbs", type: "word" },
  { spanish: "Comer", english: "To eat", tag: "Common Verbs", type: "word" },
  { spanish: "Beber", english: "To drink", tag: "Common Verbs", type: "word" },
  { spanish: "Hablar", english: "To speak", tag: "Common Verbs", type: "word" },
  { spanish: "Querer", english: "To want", tag: "Common Verbs", type: "word" },
  { spanish: "Poder", english: "To be able to", tag: "Common Verbs", type: "word" },
  { spanish: "Vivir", english: "To live", tag: "Common Verbs", type: "word" },
  { spanish: "Trabajar", english: "To work", tag: "Common Verbs", type: "word" },
  { spanish: "Aprender", english: "To learn", tag: "Common Verbs", type: "word" },
  { spanish: "Comprar", english: "To buy", tag: "Common Verbs", type: "word" },

  // Adjetivos
  { spanish: "Grande", english: "Big", tag: "Adjectives", type: "word" },
  { spanish: "Pequeño", english: "Small", tag: "Adjectives", type: "word" },
  { spanish: "Bueno", english: "Good", tag: "Adjectives", type: "word" },
  { spanish: "Malo", english: "Bad", tag: "Adjectives", type: "word" },
  { spanish: "Nuevo", english: "New", tag: "Adjectives", type: "word" },
  { spanish: "Viejo", english: "Old", tag: "Adjectives", type: "word" },
  { spanish: "Bonito", english: "Pretty", tag: "Adjectives", type: "word" },
  { spanish: "Feo", english: "Ugly", tag: "Adjectives", type: "word" },
  { spanish: "Rápido", english: "Fast", tag: "Adjectives", type: "word" },
  { spanish: "Lento", english: "Slow", tag: "Adjectives", type: "word" },
  { spanish: "Fácil", english: "Easy", tag: "Adjectives", type: "word" },
  { spanish: "Difícil", english: "Difficult", tag: "Adjectives", type: "word" },
  { spanish: "Feliz", english: "Happy", tag: "Adjectives", type: "word" },
  { spanish: "Cansado", english: "Tired", tag: "Adjectives", type: "word" },

  // Animales
  { spanish: "El perro", english: "The dog", tag: "Animals", type: "word" },
  { spanish: "El gato", english: "The cat", tag: "Animals", type: "word" },
  { spanish: "El pájaro", english: "The bird", tag: "Animals", type: "word" },
  { spanish: "El caballo", english: "The horse", tag: "Animals", type: "word" },
  { spanish: "La vaca", english: "The cow", tag: "Animals", type: "word" },
  { spanish: "El pez", english: "The fish", tag: "Animals", type: "word" },
  { spanish: "El ratón", english: "The mouse", tag: "Animals", type: "word" },
  { spanish: "El pollo", english: "The chicken", tag: "Animals", type: "word" },

  // Preguntas útiles
  { spanish: "¿Qué?", english: "What?", tag: "Questions", type: "word" },
  { spanish: "¿Quién?", english: "Who?", tag: "Questions", type: "word" },
  { spanish: "¿Dónde?", english: "Where?", tag: "Questions", type: "word" },
  { spanish: "¿Cuándo?", english: "When?", tag: "Questions", type: "word" },
  { spanish: "¿Por qué?", english: "Why?", tag: "Questions", type: "word" },
  { spanish: "¿Cómo?", english: "How?", tag: "Questions", type: "word" },
  { spanish: "¿Cuánto?", english: "How much?", tag: "Questions", type: "word" },
  { spanish: "¿Hablas inglés?", english: "Do you speak English?", tag: "Questions", type: "sentence" },
  { spanish: "¿Puedes ayudarme?", english: "Can you help me?", tag: "Questions", type: "sentence" },
  { spanish: "¿Qué significa esto?", english: "What does this mean?", tag: "Questions", type: "sentence" },
  { spanish: "¿Puedes repetir, por favor?", english: "Can you repeat, please?", tag: "Questions", type: "sentence" },
  { spanish: "¿Cómo se dice esto en español?", english: "How do you say this in Spanish?", tag: "Questions", type: "sentence" },

  // Frases del día a día
  { spanish: "No entiendo", english: "I don't understand", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "No lo sé", english: "I don't know", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "Claro que sí", english: "Of course", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "Estoy de acuerdo", english: "I agree", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "Un momento, por favor", english: "One moment, please", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "No hay problema", english: "No problem", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "Estoy cansado", english: "I'm tired", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "Tengo prisa", english: "I'm in a hurry", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "Me gusta mucho", english: "I like it a lot", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "¿Puedo ayudarte?", english: "Can I help you?", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "Nos vemos pronto", english: "See you soon", tag: "Everyday Sentences", type: "sentence" },
  { spanish: "Que tengas un buen día", english: "Have a good day", tag: "Everyday Sentences", type: "sentence" }
];

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function SpeakingLabView({ nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  const customInputRef = useRef(null);
  const supported = useMemo(() => Boolean(getSpeechRecognition()), []);
  const categories = useMemo(() => {
    const seen = [];
    for (const item of SPEAKING_LIBRARY) {
      if (!seen.includes(item.tag)) seen.push(item.tag);
    }
    return seen;
  }, []);

  const [mode, setMode] = useState("learned"); // learned | words | sentences | category | saved | custom
  const [category, setCategory] = useState(categories[0]);
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [learnedItems, setLearnedItems] = useState([]);
  const [savedWords, setSavedWords] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customEnglish, setCustomEnglish] = useState("");
  const [audioState, setAudioState] = useState("idle");
  const [lastResult, setLastResult] = useState("");
  const [session, setSession] = useState({ perfect: 0, close: 0, missed: 0, streak: 0, bestStreak: 0 });
  const [masteredSpanish, setMasteredSpanish] = useState([]);
  const autoAdvanceRef = useRef(null);

  useEffect(() => () => clearTimeout(autoAdvanceRef.current), []);

  useEffect(() => {
    let cancelled = false;
    setSavedLoading(true);
    Promise.all([
      api("/api/speaking/practice"),
      api("/api/pronunciation/vocabulary/recent")
    ])
      .then(([learned, saved]) => {
        if (cancelled) return;
        const items = learnedSpeakingItems(
          learned,
          (sentence) => nativeMeaning(sentence.english, nativeLanguage),
          (word) => localizedWordMeaning(word, nativeLanguage)
        );
        setLearnedItems(items);
        setSavedWords(saved.words || []);
        if (mode === "learned") setDeck(buildSpeakingPracticeDeck(items, shuffleArray));
      })
      .catch(() => {
        if (!cancelled) {
          setLearnedItems([]);
          setSavedWords([]);
          if (mode === "learned") setDeck([]);
        }
      })
      .finally(() => {
        if (!cancelled) setSavedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [nativeLanguage]);

  const current = deck[index] || null;
  const currentMeaning = !current
    ? ""
    : mode === "learned"
      ? current.meaning
      : mode === "saved" || mode === "custom"
      ? current.english
      : localizedSpeakingMeaning(current, nativeLanguage);

  const buildDeck = (nextMode, nextCategory) => {
    if (nextMode === "learned") {
      return buildSpeakingPracticeDeck(learnedItems, shuffleArray);
    }
    if (nextMode === "words") {
      return buildSpeakingPracticeDeck(SPEAKING_LIBRARY.filter((item) => item.type === "word"), shuffleArray);
    }
    if (nextMode === "sentences") {
      return buildSpeakingPracticeDeck(SPEAKING_LIBRARY.filter((item) => item.type === "sentence"), shuffleArray);
    }
    if (nextMode === "category") {
      return buildSpeakingPracticeDeck(SPEAKING_LIBRARY.filter((item) => item.tag === nextCategory), shuffleArray);
    }
    if (nextMode === "saved") {
      return buildSpeakingPracticeDeck(
        savedWords
          .filter((word) => word.spanish)
          .map((word) => ({ spanish: word.spanish, english: localizedWordMeaning(word, nativeLanguage), tag: german ? "Gespeichert" : "Saved", type: "word" })),
        shuffleArray
      );
    }
    return [];
  };

  const loadMode = (nextMode, nextCategory = category) => {
    setMode(nextMode);
    if (nextCategory !== category) setCategory(nextCategory);
    setLastResult("");
    setAudioState("idle");
    setIndex(0);
    setMasteredSpanish([]);
    setSession({ perfect: 0, close: 0, missed: 0, streak: 0, bestStreak: 0 });
    clearTimeout(autoAdvanceRef.current);
    setDeck(buildDeck(nextMode, nextCategory));
  };

  const reshuffle = () => {
    setLastResult("");
    setAudioState("idle");
    setIndex(0);
    setMasteredSpanish([]);
    setSession({ perfect: 0, close: 0, missed: 0, streak: 0, bestStreak: 0 });
    clearTimeout(autoAdvanceRef.current);
    if (mode !== "custom") setDeck(buildDeck(mode, category));
  };

  const goTo = (nextIndex) => {
    if (!deck.length) return;
    clearTimeout(autoAdvanceRef.current);
    const wrapped = (nextIndex + deck.length) % deck.length;
    setIndex(wrapped);
    setLastResult("");
    setAudioState("idle");
  };

  const startCustom = () => {
    const spanish = customText.trim();
    if (!spanish) return;
    setDeck([{ spanish, english: customEnglish.trim(), tag: german ? "Eigene Übung" : "Custom", type: "sentence" }]);
    setIndex(0);
    setMasteredSpanish([]);
    setSession({ perfect: 0, close: 0, missed: 0, streak: 0, bestStreak: 0 });
    setLastResult("");
    setAudioState("idle");
  };

  const registerScore = (result) => {
    setLastResult(result);
    setSession((prev) => speakingSessionAfterScore(prev, result));
    api("/api/practice-signals", {
      method: "POST",
      body: {
        skill: "speaking",
        mode: "pronunciation",
        isSuccessful: result === "success",
        usedSupport: true,
        sourceKey: `${mode}:${index + 1}`
      }
    }).catch(() => null);
    if (result === "success" && current?.spanish) {
      const nextMastered = [...new Set([...masteredSpanish, current.spanish])];
      setMasteredSpanish(nextMastered);
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        const nextIndex = nextUnmasteredSpeakingIndex(deck, index, nextMastered);
        if (nextIndex >= 0) {
          setIndex(nextIndex);
          setLastResult("");
          setAudioState("idle");
        }
      }, 900);
    }
  };

  const totalAttempts = session.perfect + session.close + session.missed;
  const accuracy = totalAttempts ? Math.round(((session.perfect + session.close * 0.5) / totalAttempts) * 100) : 0;
  const mastery = speakingMasteryProgress(deck, masteredSpanish);

  const wordCount = useMemo(() => SPEAKING_LIBRARY.filter((item) => item.type === "word").length, []);
  const sentenceCount = useMemo(() => SPEAKING_LIBRARY.filter((item) => item.type === "sentence").length, []);

  const modeTabs = speakingModeTabs({ german, wordCount, sentenceCount, savedCount: savedWords.length });

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-5">
        <Panel
          title={german ? "Sprechtraining" : "Speaking Lab"}
          icon={Mic}
          action={
            mode !== "custom" && deck.length ? (
              <button
                type="button"
                onClick={reshuffle}
                className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-stone-50"
                title={german ? "Karten neu mischen" : "Shuffle deck"}
              >
                <RefreshCw size={15} />
                {german ? "Neu mischen" : "Shuffle"}
              </button>
            ) : null
          }
        >
          {!supported && (
            <div className="mb-4 rounded-lg border border-honey-200 bg-honey-50 p-4 font-bold text-honey-900">
              {german ? "Die Spracherkennung ist in diesem Browser nicht verfügbar. Verwende Chrome, Edge oder Safari für das Mikrofontraining." : "Speech recognition isn't available in this browser. Try Chrome, Edge, or Safari to use the mic."}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {modeTabs.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => loadMode(item.key)}
                className={classNames(
                  "rounded-full border px-4 py-2 text-sm font-bold transition",
                  mode === item.key
                    ? "border-coral-300 bg-coral-50 text-coral-700"
                    : "border-stone-200 bg-white text-slate-600 hover:bg-stone-50"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <SpeakingPracticeGuidance mode={mode} german={german} />

          {mode === "category" && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => loadMode("category", tag)}
                  className={classNames(
                    "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                    category === tag
                      ? "border-lagoon-300 bg-lagoon-50 text-lagoon-700"
                      : "border-stone-200 bg-white text-slate-600 hover:bg-stone-50"
                  )}
                >
                  {localizedSpeakingTag(tag, nativeLanguage)}
                </button>
              ))}
            </div>
          )}

          {mode === "custom" && (
            <div className="mt-4 grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
              <label className="block text-sm font-semibold text-slate-700">
                {german ? "Spanisches Wort oder spanische Wendung" : "Spanish word or phrase to practice"}
                <input
                  ref={customInputRef}
                  value={customText}
                  onChange={(event) => setCustomText(event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-lg font-black text-slate-950 outline-none focus:border-lagoon-500"
                  placeholder={german ? "z. B. ¿Dónde está la estación?" : "e.g. ¿Dónde está la estación?"}
                />
                <SpanishCharacterBar value={customText} onChange={setCustomText} inputRef={customInputRef} nativeLanguage={nativeLanguage} />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                {german ? "Deutsche Bedeutung (optional)" : "English translation (optional)"}
                <input
                  value={customEnglish}
                  onChange={(event) => setCustomEnglish(event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-200 bg-white px-4 py-2 font-semibold text-slate-800 outline-none focus:border-lagoon-500"
                  placeholder={german ? "Wo ist der Bahnhof?" : "Where is the station?"}
                />
              </label>
              <button
                type="button"
                onClick={startCustom}
                disabled={!customText.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Target size={17} />
                {german ? "Damit üben" : "Practice this"}
              </button>
            </div>
          )}

          {savedLoading && (
            <p className="mt-4 text-sm font-semibold text-slate-600">{german ? "Dein gelernter Stoff wird geladen..." : "Loading your learned material..."}</p>
          )}

          {current ? (
            <div className="mt-5 rounded-xl border border-lagoon-100 bg-lagoon-50 p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-lagoon-700">
                  {localizedSpeakingTag(current.tag, nativeLanguage) || (german ? "Übung" : "Practice")}
                  {current.type ? ` · ${current.type === "word" ? (german ? "Wort" : "Word") : (german ? "Satz" : "Sentence")}` : ""}
                </span>
                {deck.length > 1 && (
                  <span className="text-xs font-bold text-slate-500">
                    {index + 1} / {deck.length}
                  </span>
                )}
              </div>
              <SpeakingRoundProgress mastery={mastery} german={german} />

              <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950">{current.spanish}</h2>

              {currentMeaning && <p className="mt-3 text-lg font-bold text-slate-600">{currentMeaning}</p>}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => playPronunciationClip(current.spanish, setAudioState)}
                  className={classNames(
                    "inline-flex items-center gap-2 rounded-md border px-4 py-3 font-black",
                    audioState === "playing"
                      ? "border-lagoon-300 bg-lagoon-50 text-lagoon-800"
                      : "border-stone-200 bg-white text-slate-800 hover:bg-stone-50",
                    audioState === "error" && "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  <Volume2 size={18} />
                  {german ? "Anhören" : "Listen"}
                </button>
                {!mastery.complete && <SpeakCheck key={`${mode}-${index}-${current.spanish}`} target={current.spanish} onScore={registerScore} nativeLanguage={nativeLanguage} />}
              </div>

              {lastResult && (
                <div
                  className={classNames(
                    "mt-5 rounded-lg border p-4 font-bold",
                    lastResult === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
                    lastResult === "close" && "border-honey-200 bg-honey-50 text-honey-900",
                    lastResult === "fail" && "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {lastResult === "success" && (german ? "Sehr gut! Die Aussprache wurde sicher erkannt. Die nächste offene Karte kommt automatisch." : "Great! That sounded clear. The next unfinished card will appear automatically.")}
                  {lastResult === "close" && (german ? "Fast. Sprich den Satz noch einmal etwas langsamer und deutlicher." : "Close! The recognizer almost got it — try again a touch slower and clearer.")}
                  {lastResult === "fail" && (german ? "Noch nicht erkannt. Höre das Modell erneut an und sprich danach deutlich ins Mikrofon." : "Not quite. Tap Listen, then repeat it back and speak clearly into the mic.")}
                </div>
              )}

              {mastery.complete && <SpeakingRoundComplete german={german} onNewRound={reshuffle} />}

              {deck.length > 1 && !mastery.complete && (
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-stone-50"
                  >
                    <ArrowLeft size={16} />
                    {german ? "Zurück" : "Previous"}
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    className="inline-flex items-center gap-2 rounded-md bg-coral-500 px-5 py-2 font-black text-white hover:bg-coral-600"
                  >
                    {german ? "Weiter" : "Next"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : <SpeakingPracticeEmpty mode={mode} german={german} loading={savedLoading} />}
        </Panel>
      </section>

      <aside className="space-y-5">
        <Panel title={german ? "Diese Einheit" : "Session"} icon={Flame}>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile label={german ? "Sicher" : "Perfect"} value={session.perfect} />
            <InfoTile label={german ? "Fast" : "Close"} value={session.close} />
            <InfoTile label={german ? "Verfehlt" : "Missed"} value={session.missed} />
            <InfoTile label={german ? "Erkennung" : "Accuracy"} value={`${accuracy}%`} />
            <InfoTile label={german ? "Geschafft" : "Mastered"} value={`${mastery.mastered}/${mastery.total}`} />
          </div>
          <div className="mt-4 rounded-lg border border-coral-100 bg-coral-50 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-coral-700">
                <Flame size={16} />
                {german ? "Serie" : "Streak"}
              </span>
              <span className="text-2xl font-black text-coral-700">{session.streak}</span>
            </div>
            <p className="mt-1 text-xs font-bold text-coral-600">{german ? "Beste Serie dieser Einheit" : "Best this session"}: {session.bestStreak}</p>
          </div>
        </Panel>
        <Panel title={german ? "So funktioniert es" : "How it works"} icon={Sparkles}>
          <ol className="grid gap-3 text-sm font-semibold text-slate-700">
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lagoon-100 font-black text-lagoon-700">1</span>
              {german ? "Lies den spanischen Ausdruck und – wenn vorhanden – seine deutsche Bedeutung." : "Read the Spanish and its English translation."}
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lagoon-100 font-black text-lagoon-700">2</span>
              {german ? <>Tippe auf <span className="font-black">Anhören</span> und sprich den Ausdruck danach laut nach.</> : <>Tap <span className="font-black">Listen</span>, then <span className="font-black">Speak</span> it out loud.</>}
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lagoon-100 font-black text-lagoon-700">3</span>
              {german ? "Sicher erkannte Ausdrücke gehen automatisch weiter. Unsichere Karten bleiben in der kurzen Runde, bis sie verständlich sitzen." : "Clearly recognized expressions advance automatically. Uncertain cards stay in the short round until they are secure."}
            </li>
          </ol>
          <p className="mt-4 rounded-md bg-stone-50 p-3 text-xs font-semibold text-slate-500">
            {german ? "Die Browser-Spracherkennung prüft, ob die erwarteten spanischen Wörter erkannt wurden. Sie ist eine praktische Sprechhilfe, aber keine präzise Bewertung deines Akzents." : "Speech is matched with the same rules quizzes use, so accents are forgiven. It scores what you say, not a perfect accent — great for building confidence."}
          </p>
        </Panel>
      </aside>
    </div>
  );
}

function NaturalLearningHome({ dashboard, refreshDashboard, setActive, onStartLesson }) {
  const lessons = dashboard.lessons || [];
  const plan = dashboard.dailyPlan || {};
  const skillBalance = dashboard.stats?.skillBalance || null;
  const [skillPracticeOpen, setSkillPracticeOpen] = useState(false);
  const review = dashboard.review || { counts: {}, estimatedMinutes: 0 };
  const nextLesson = lessons.find((lesson) => lesson.progress > 0 && lesson.progress < 100) || dashboard.currentLesson || lessons.find((lesson) => lesson.progress < 100) || lessons[0];
  const plannedLesson = plan.target?.type === "lesson" ? lessons.find((lesson) => lesson.id === plan.target.id) || nextLesson : nextLesson;
  const secondaryLesson = plan.secondaryTarget?.type === "lesson" ? lessons.find((lesson) => lesson.id === plan.secondaryTarget.id) : null;
  const completed = lessons.filter((lesson) => lesson.progress >= 100).length;
  const courseProgress = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
  const reviewTotal = review.counts?.total || 0;
  const german = (dashboard.user?.nativeLanguage || "de") === "de";
  const nativeLanguage = dashboard.user?.nativeLanguage || "de";
  const nextLessonTitle = plannedLesson ? localizedLessonTitle(plannedLesson, nativeLanguage) : "";
  const secondaryLessonTitle = secondaryLesson ? localizedLessonTitle(secondaryLesson, nativeLanguage) : "";
  const currentUnit = localizedUnit(plannedLesson?.unit || {}, nativeLanguage);
  const quiet = dashboard.user?.learningMode === "quiet";
  const skillBalanceCopy = {
    vocabulary: { de: "Wortschatz", en: "Vocabulary", icon: NotebookTabs, textDe: "Bekannte Bedeutungen wieder selbst auf Spanisch abrufen.", textEn: "Retrieve familiar meanings in Spanish." },
    grammar: { de: "Satzmuster & Grammatik", en: "Grammar & patterns", icon: GraduationCap, textDe: "Ein bekanntes Muster noch einmal aktiv bilden.", textEn: "Actively form one familiar pattern again." },
    listening: { de: "Hörverstehen", en: "Listening", icon: Volume2, textDe: "Einen vertrauten spanischen Satz wirklich aus dem Klang rekonstruieren.", textEn: "Reconstruct familiar Spanish from actual sound." },
    reading: { de: "Leseverstehen", en: "Reading", icon: BookOpen, textDe: "Einen bereits eingeführten Zusammenhang auf Bedeutung lesen.", textEn: "Read familiar connected input for meaning." },
    writing: { de: "Schreiben", en: "Writing", icon: PenTool, textDe: "Eine bekannte Bedeutung ohne sichtbares Modell auf Spanisch formulieren.", textEn: "Express a familiar meaning in Spanish without a visible model." },
    conversation: { de: "Gesprächsführung", en: "Conversation", icon: Users, textDe: "Einen vertrauten Gesprächszug passend fortsetzen.", textEn: "Continue one familiar conversational turn." },
    speaking: { de: "Sprechen", en: "Speaking", icon: Mic, textDe: "Eine bekannte Antwort mit dem Mikrofon statt über die Tastatur abrufen.", textEn: "Retrieve a familiar response with the microphone." }
  };
  const balanceMeta = skillBalanceCopy[skillBalance?.key] || skillBalanceCopy.vocabulary;
  const BalanceIcon = balanceMeta.icon;
  const deferredChannel = skillBalance?.deferred || null;
  const deferredWaiting = Boolean(deferredChannel && !deferredChannel.ready);
  const deferredConnectedListening = deferredChannel?.kind === "connected-listening";
  const deferredSoundListening = deferredChannel?.kind === "sound-listening";
  const deferredLessonListening = deferredConnectedListening || deferredSoundListening;
  const deferredCopy = deferredListeningCopy({ german, count: deferredChannel?.count, quiet: skillBalance?.quietDeferred, waiting: deferredWaiting, connected: deferredConnectedListening, sound: deferredSoundListening });
  const primaryTargetType = plan.target?.type || (plannedLesson ? "lesson" : "challenge");
  const freshConsolidation = plan.kind === "consolidation";
  const planDiagnosis = plan.diagnosis || review.diagnostics || {};
  const planExplanation = dailyPlanExplanation({
    german,
    targetType: plan.target?.type,
    mistakeCount: review.counts?.mistakes,
    reviewTotal,
    recurringMistakeCount: planDiagnosis.recurringMistakeCount,
    maxMistakeOccurrences: planDiagnosis.maxMistakeOccurrences,
    oldestOverdueDays: planDiagnosis.oldestOverdueDays,
    freshConsolidation,
    reason: plan.reason,
    reasonCode: planDiagnosis.reasonCode,
    weakConcept: planDiagnosis.weakConcept
  });
  const planDiagnosticChips = dailyPlanDiagnosticChips({ german, diagnosis: planDiagnosis });
  const toggleLearningMode = async () => {
    await api("/api/preferences", { method: "PATCH", body: { learningMode: quiet ? "home" : "quiet" } });
    await refreshDashboard?.({ silent: true });
  };
  const copy = naturalLearningHomeCopy({ german, primaryTargetType, freshConsolidation, quiet, hasPlannedLesson: Boolean(plannedLesson), lessonProgress: plannedLesson?.progress, nextLessonTitle, mistakeCount: review.counts?.mistakes, recurringMistakeCount: planDiagnosis.recurringMistakeCount });

  const startLesson = () => {
    if (plan.target?.type === "lesson" && plan.target.id) onStartLesson(plan.target.id);
    else if (plan.target?.type === "review") setActive("review");
    else if (plan.target?.type === "challenge") setActive("challenges");
    else if (plannedLesson?.id) onStartLesson(plannedLesson.id);
    else setActive("path");
  };
  const startSecondary = () => {
    if (plan.secondaryTarget?.type === "lesson" && plan.secondaryTarget.id) onStartLesson(plan.secondaryTarget.id);
    else if (plan.secondaryTarget?.type === "review") setActive("review");
  };
  const startSkillBalance = () => {
    if (deferredChannel && (skillBalance.quietDeferred || deferredWaiting)) return;
    if ((skillBalance?.exercise || deferredLessonListening) && !skillBalance.quietDeferred) setSkillPracticeOpen(true);
    else if (skillBalance?.route) setActive(skillBalance.route);
  };
  const primaryActionLabel = plan.target?.type === "review"
    ? german ? "Fällige Wiederholung starten" : "Start review"
    : plan.target?.type === "challenge"
      ? german ? "Kurze Festigung starten" : "Start reinforcement"
      : copy.start;
  const secondaryActionLabel = plan.secondaryTarget?.type === "lesson"
    ? german
      ? freshConsolidation ? `Optional trotzdem weiter: ${secondaryLessonTitle || "nächstes Lernpaket"}` : `Danach: ${secondaryLessonTitle || "Lernweg fortsetzen"}`
      : freshConsolidation ? `Optional: ${secondaryLessonTitle || "next lesson"}` : `Then: ${secondaryLessonTitle || "continue the course"}`
    : plan.secondaryTarget?.type === "review"
      ? german ? "Danach: fällige Wiederholung" : "Then: due review"
      : "";
  const lessonCycle = german ? [
    { icon: BookOpen, title: "1. Verstehen", text: "Bedeutung und Satzmuster auf Deutsch begreifen.", color: "bg-coral-50 text-coral-700" },
    quiet
      ? { icon: PenTool, title: "2. Klangbild vorbereiten", text: "Schrift, Silben und Betonung leise miteinander verbinden.", color: "bg-honey-50 text-honey-700" }
      : { icon: Volume2, title: "2. Hören & Sprechen", text: "Spanisch hören, laut nachsprechen und den Rhythmus aufnehmen.", color: "bg-honey-50 text-honey-700" },
    { icon: Wand2, title: "3. Abrufen mit Hilfe", text: "Den Satz verstecken und mit Satzanfang, Wörtern oder Modell zurückholen.", color: "bg-sky-50 text-sky-700" },
    quiet
      ? { icon: PenTool, title: "4. Leise anwenden", text: "Das Muster selbst tippen, ordnen und in Antworten einsetzen.", color: "bg-lagoon-50 text-lagoon-700" }
      : { icon: Mic, title: "4. Benutzen", text: "Das Muster in einer eigenen gesprochenen oder geschriebenen Antwort einsetzen.", color: "bg-lagoon-50 text-lagoon-700" },
    { icon: ListChecks, title: "5. Später festigen", text: "Erst nach einer Pause wiederholen, damit es im Langzeitgedächtnis landet.", color: "bg-emerald-50 text-emerald-700" }
  ] : [
    { icon: BookOpen, title: "1. Understand", text: "Understand meaning and the sentence pattern.", color: "bg-coral-50 text-coral-700" },
    quiet
      ? { icon: PenTool, title: "2. Prepare the sound pattern", text: "Connect spelling, syllables, and stress silently.", color: "bg-honey-50 text-honey-700" }
      : { icon: Volume2, title: "2. Hear & speak", text: "Listen, repeat aloud, and absorb the rhythm.", color: "bg-honey-50 text-honey-700" },
    { icon: Wand2, title: "3. Retrieve with help", text: "Hide it and recover it using progressively smaller supports.", color: "bg-sky-50 text-sky-700" },
    quiet
      ? { icon: PenTool, title: "4. Apply silently", text: "Type, order, and use the pattern in your own answers.", color: "bg-lagoon-50 text-lagoon-700" }
      : { icon: Mic, title: "4. Use it", text: "Apply the pattern in your own spoken or written answer.", color: "bg-lagoon-50 text-lagoon-700" },
    { icon: ListChecks, title: "5. Strengthen later", text: "Return after a delay so it reaches long-term memory.", color: "bg-emerald-50 text-emerald-700" }
  ];
  const reviewCycle = german ? [
    { icon: Target, title: "1. Ohne Modell starten", text: "Nur Bedeutung oder Situation sehen; die spanische Lösung bleibt verborgen.", color: "bg-coral-50 text-coral-700" },
    quiet
      ? { icon: PenTool, title: "2. Leise abrufen", text: "Spanisch tippen oder zusammensetzen; Hörziele werden aus der deutschen Bedeutung rekonstruiert.", color: "bg-honey-50 text-honey-700" }
      : { icon: Volume2, title: "2. Aktiv abrufen", text: "Spanisch tippen, zusammensetzen oder bei einem Hörziel aus dem Klang rekonstruieren.", color: "bg-honey-50 text-honey-700" },
    { icon: Wand2, title: "3. Hilfe nur bei Bedarf", text: "Erst Strategie, dann Satzanfang und Wörter; das vollständige Modell bleibt die letzte Stufe.", color: "bg-sky-50 text-sky-700" },
    { icon: RefreshCw, title: "4. Unsicheres korrigieren", text: "Nach einem Fehler die richtige Form vergleichen und anschließend noch einmal selbst abrufen.", color: "bg-lagoon-50 text-lagoon-700" },
    { icon: ListChecks, title: "5. Nächsten Abstand planen", text: "Sichere Antworten ruhen länger; unterstützte oder korrigierte Antworten kehren früher zurück.", color: "bg-emerald-50 text-emerald-700" }
  ] : [
    { icon: Target, title: "1. Start without a model", text: "See only meaning or context while the Spanish answer stays hidden.", color: "bg-coral-50 text-coral-700" },
    quiet
      ? { icon: PenTool, title: "2. Retrieve silently", text: "Type or build Spanish; listening targets are reconstructed from meaning.", color: "bg-honey-50 text-honey-700" }
      : { icon: Volume2, title: "2. Retrieve actively", text: "Type, build, or reconstruct a listening target from sound.", color: "bg-honey-50 text-honey-700" },
    { icon: Wand2, title: "3. Use help only when needed", text: "Move from strategy to starter and words; reveal the full model last.", color: "bg-sky-50 text-sky-700" },
    { icon: RefreshCw, title: "4. Correct uncertainty", text: "Compare after a miss, then retrieve the correct form yourself.", color: "bg-lagoon-50 text-lagoon-700" },
    { icon: ListChecks, title: "5. Schedule the next gap", text: "Secure answers rest longer; supported or corrected answers return sooner.", color: "bg-emerald-50 text-emerald-700" }
  ];
  const reinforcementCycle = german ? [
    { icon: Target, title: "1. Bekanntes aktivieren", text: "Ohne erneute Erklärungsrunde mit einem vertrauten Satzmuster beginnen.", color: "bg-coral-50 text-coral-700" },
    { icon: Gamepad2, title: "2. Abrufformen wechseln", text: "Erkennen, ordnen und selbst produzieren wechseln sich kurz und gezielt ab.", color: "bg-honey-50 text-honey-700" },
    quiet
      ? { icon: PenTool, title: "3. Leise variieren", text: "Bekannte Muster tippend mit neuen Personen, Details oder Situationen verbinden.", color: "bg-sky-50 text-sky-700" }
      : { icon: Mic, title: "3. Flexibel variieren", text: "Bekannte Muster sprechend oder schreibend mit neuen Details verbinden.", color: "bg-sky-50 text-sky-700" },
    { icon: CheckCircle2, title: "4. Direktes Feedback", text: "Nur die konkrete Unsicherheit korrigieren und die richtige Form erneut abrufen.", color: "bg-lagoon-50 text-lagoon-700" },
    { icon: ListChecks, title: "5. Lernweg erhalten", text: "Die Runde ergänzt den Kurs; sie ersetzt weder neue Grundlagen noch fällige Wiederholungen.", color: "bg-emerald-50 text-emerald-700" }
  ] : [
    { icon: Target, title: "1. Activate familiar material", text: "Start from a known pattern without replaying the explanation.", color: "bg-coral-50 text-coral-700" },
    { icon: Gamepad2, title: "2. Vary retrieval", text: "Alternate recognition, ordering, and production in a short round.", color: "bg-honey-50 text-honey-700" },
    quiet
      ? { icon: PenTool, title: "3. Vary silently", text: "Type familiar patterns with new people, details, or situations.", color: "bg-sky-50 text-sky-700" }
      : { icon: Mic, title: "3. Vary flexibly", text: "Speak or write familiar patterns with new details.", color: "bg-sky-50 text-sky-700" },
    { icon: CheckCircle2, title: "4. Use direct feedback", text: "Correct only the uncertain part and retrieve the right form again.", color: "bg-lagoon-50 text-lagoon-700" },
    { icon: ListChecks, title: "5. Preserve the course path", text: "The round supplements the course; it does not replace foundations or due review.", color: "bg-emerald-50 text-emerald-700" }
  ];
  const cycle = primaryTargetType === "review" ? reviewCycle : primaryTargetType === "challenge" ? reinforcementCycle : lessonCycle;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950 p-5 text-white shadow-soft sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-black text-lagoon-100"><Target size={16} /> {copy.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-300">{copy.intro}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button onClick={startLesson} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-honey-500 px-6 py-4 font-black text-white hover:bg-honey-600 sm:w-auto"><Rocket size={19} /> {primaryActionLabel}</button>
              {secondaryActionLabel && <button onClick={startSecondary} className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-4 text-sm font-black text-white hover:bg-white/10 sm:w-auto"><ArrowRight size={18} /> {secondaryActionLabel}</button>}
              <button onClick={toggleLearningMode} className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 px-4 py-3 text-sm font-black text-white hover:bg-white/10 sm:w-auto">{quiet ? <BookOpen size={18} /> : <Volume2 size={18} />}{quiet ? (german ? "Leisemodus aktiv" : "Quiet mode active") : (german ? "Zuhause: Ton & Sprechen" : "Home: audio & speaking")}</button>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-300">{copy.today}</p>
            <p className="mt-3 text-sm font-bold leading-6 text-white">{planExplanation}</p>
            {!!planDiagnosticChips.length && (
              <div className="mt-3 flex flex-wrap gap-2" aria-label={german ? "Gründe für den heutigen Lernplan" : "Reasons for today's learning plan"}>
                {planDiagnosticChips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-black text-slate-100">{chip}</span>
                ))}
              </div>
            )}
            <div className="mt-4 grid gap-3 text-sm font-bold">
              <div className="flex justify-between"><span>{german ? "Kursfortschritt" : "Course progress"}</span><span>{courseProgress}%</span></div>
              <ProgressBar value={courseProgress} color="bg-honey-500" />
              {plannedLesson && <div className="mt-2 flex justify-between"><span>{german ? (primaryTargetType === "review" ? "Lernpaket danach" : "Aktuelles Lernpaket") : (primaryTargetType === "review" ? "Lesson after review" : "Current lesson")}</span><span>{plannedLesson.progress || 0}%</span></div>}
              <div className="mt-2 flex justify-between"><span>{copy.review}</span><span>{reviewTotal}</span></div>
              {!!reviewTotal && <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <span className="rounded-md bg-white/10 px-2 py-2">{review.counts?.mistakes || 0}<span className="mt-1 block text-slate-300">{german ? "Unsicher" : "Mistakes"}</span></span>
                <span className="rounded-md bg-white/10 px-2 py-2">{review.counts?.grammar || 0}<span className="mt-1 block text-slate-300">{german ? "Muster" : "Patterns"}</span></span>
                <span className="rounded-md bg-white/10 px-2 py-2">{review.counts?.vocabulary || 0}<span className="mt-1 block text-slate-300">{german ? "Wörter" : "Words"}</span></span>
              </div>}
              <div className="flex justify-between"><span>{german ? "Zeit" : "Time"}</span><span>≈ {plan.estimatedMinutes || plannedLesson?.estimatedMinutes || 8} min</span></div>
              {plannedLesson && <div className="flex justify-between gap-3 border-t border-white/10 pt-3"><span>{german ? "Einheit" : "Unit"}</span><span className="text-right">{currentUnit?.label || plannedLesson.cefrLevel} · {currentUnit?.title || plannedLesson.cefrLevel}</span></div>}
            </div>
          </div>
        </div>
      </section>

      <Panel title={copy.path} icon={Rocket}>
        <div className="grid gap-3 md:grid-cols-5">
          {cycle.map((step) => (
            <div key={step.title} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className={classNames("grid h-10 w-10 place-items-center rounded-md", step.color)}><step.icon size={20} /></div>
              <h2 className="mt-3 font-black text-slate-950">{step.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-5 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </Panel>

      {skillBalance && (
        <Panel title={deferredChannel ? deferredCopy.panelTitle : (german ? "Optional nach deinem heutigen Hauptziel" : "Optional after today's main goal")} icon={Target}>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-700"><BalanceIcon size={22} /></div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-sky-700">{deferredChannel ? deferredCopy.eyebrow : (german ? "Kurzer Kompetenz-Ausgleich" : "Short skill balance")}</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{deferredChannel ? deferredCopy.title : (german ? balanceMeta.de : balanceMeta.en)}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {deferredChannel ? deferredCopy.detail : german ? balanceMeta.textDe : balanceMeta.textEn}
                </p>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                  {deferredChannel ? deferredCopy.note : (german ? "Die Aufgabe verwendet nur bereits eingeführten Stoff und verändert weder die Kursreihenfolge noch die Priorität fälliger Wiederholungen." : "This uses introduced material only and does not change course or review priority.")}
                </p>
              </div>
            </div>
            {!skillBalance.quietDeferred && !deferredWaiting && (
              <button onClick={startSkillBalance} className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-5 py-3 font-black text-sky-800 hover:bg-sky-100 lg:w-auto">
                <BalanceIcon size={18} />
                {deferredChannel
                  ? deferredCopy.action
                  : german ? (skillBalance.key === "speaking" ? "Mit Mikrofon kurz üben" : "Kurzen Ausgleich starten") : "Start short balance"}
              </button>
            )}
          </div>
          {skillPracticeOpen && (skillBalance.exercise || deferredLessonListening) && !skillBalance.quietDeferred && (
            <div className="mt-5 border-t border-stone-200 pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-slate-700">{german ? `Vertrauter Stoff${skillBalance.lesson?.title ? ` · ${localizedLessonTitle(skillBalance.lesson, nativeLanguage)}` : ""}` : "Familiar material"}</p>
                <button onClick={() => setSkillPracticeOpen(false)} className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-black text-slate-600">{german ? "Schließen" : "Close"}</button>
              </div>
              {deferredConnectedListening ? (
                <LessonReadingLab
                  content={skillBalance.lesson?.readingJson}
                  lessonId={skillBalance.lesson?.id}
                  nativeLanguage={nativeLanguage}
                  quiet={false}
                  onContinue={async () => {
                    setSkillPracticeOpen(false);
                    await refreshDashboard?.({ silent: true });
                  }}
                />
              ) : deferredSoundListening ? (
                <SoundFoundationLab
                  lab={soundFoundationLab(skillBalance.lesson?.topicSlug)}
                  lessonId={skillBalance.lesson?.id}
                  nativeLanguage={nativeLanguage}
                  quiet={false}
                  onContinue={async () => {
                    setSkillPracticeOpen(false);
                    await refreshDashboard?.({ silent: true });
                  }}
                />
              ) : (
                <PracticePanel
                  exercise={skillBalance.exercise}
                  nativeLanguage={nativeLanguage}
                  quiet={quiet}
                  source="REVIEW"
                  title={deferredChannel ? deferredCopy.practiceTitle : (german ? `${balanceMeta.de} gezielt ausgleichen` : `Balance ${balanceMeta.en}`)}
                  autoSubmitChoices={false}
                  requireCorrectToContinue
                  onComplete={async () => {
                    setSkillPracticeOpen(false);
                    await refreshDashboard?.({ silent: true });
                  }}
                />
              )}
            </div>
          )}
        </Panel>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel title={copy.native} icon={GraduationCap}>
          <div className="rounded-lg border border-lagoon-200 bg-lagoon-50 p-5">
            <p className="text-base font-bold leading-7 text-lagoon-950">{copy.nativeText}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-white p-3 text-sm"><span className="font-black text-slate-950">ser / estar</span><span className="mt-1 block font-semibold text-slate-600">{german ? "beides oft „sein“, aber für unterschiedliche Situationen" : "both mean “to be,” for different situations"}</span></div>
              <div className="rounded-md bg-white p-3 text-sm"><span className="font-black text-slate-950">tengo hambre</span><span className="mt-1 block font-semibold text-slate-600">{german ? "wörtlich „ich habe Hunger“ – genau wie im Deutschen" : "literally “I have hunger”"}</span></div>
              <div className="rounded-md bg-white p-3 text-sm"><span className="font-black text-slate-950">¿Y tú?</span><span className="mt-1 block font-semibold text-slate-600">{german ? "„Und du?“ hält fast jedes einfache Gespräch am Leben" : "“And you?” keeps a simple conversation alive"}</span></div>
            </div>
          </div>
        </Panel>

        <aside className="space-y-5">
          <Panel title={copy.abilities} icon={Trophy}>
            <p className="text-sm font-bold leading-6 text-slate-700">{german ? (completed ? `Du hast bereits ${completed} ${completed === 1 ? "Lernpaket" : "Lernpakete"} abgeschlossen. Im nächsten Paket baust du eine weitere direkt verwendbare Fähigkeit auf.` : "Schließe ein Lernpaket ab, um deine erste praktische Fähigkeit aufzubauen.") : dashboard.recentAchievement || "Complete a lesson to build your first practical ability."}</p>
            <button onClick={() => setActive("talk")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-coral-500 px-4 py-3 font-black text-white"><Mic size={18} /> {german ? "Im Gespräch benutzen" : "Use in conversation"}</button>
          </Panel>
          <Panel title={copy.review} icon={ListChecks}>
            <p className="text-sm font-semibold text-slate-600">{reviewTotal ? (german ? `${reviewTotal} Aufgaben sind nach einer Lernpause bereit.` : `${reviewTotal} items are ready after a learning delay.`) : copy.noReview}</p>
            {!!reviewTotal && <button onClick={() => setActive("review")} className="mt-4 w-full rounded-md border border-lagoon-200 px-4 py-3 font-black text-lagoon-700">{german ? "Jetzt festigen" : "Strengthen now"}</button>}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function PracticePanel({
  exercise,
  nativeLanguage = "de",
  quiet = false,
  source = "LESSON",
  title = "Practice",
  onComplete,
  onResult,
  onReset,
  gameKey,
  autoAdvance = false,
  autoAdvanceDelay = 900,
  autoAdvanceOnWrong = true,
  deferWrongRetry = false,
  correctionAttempt = false,
  requireCorrectToContinue = false,
  showInlineFeedback = true,
  autoSubmitChoices = true,
  shuffleKey = ""
}) {
  const german = nativeLanguage === "de";
  const [answer, setAnswer] = useState("");
  const [words, setWords] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [needsCorrection, setNeedsCorrection] = useState(Boolean(correctionAttempt));
  const [busy, setBusy] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const attemptStartedAtRef = useRef(Date.now());
  const inputMethodRef = useRef("keyboard");
  const writingInputRef = useRef(null);

  useEffect(() => {
    setAnswer("");
    setWords([]);
    setFeedback(null);
    setHintLevel(0);
    setNeedsCorrection(Boolean(correctionAttempt));
    inputMethodRef.current = "keyboard";
    attemptStartedAtRef.current = Date.now();
  }, [correctionAttempt, exercise?.id, shuffleKey]);

  const randomizedOptions = useMemo(() => {
    if (!exercise?.options?.length) return [];
    return exercise.type === "SENTENCE_BUILDER"
      ? shuffleAwayFromOriginalOrder(exercise.options)
      : shuffleItems(exercise.options);
  }, [exercise?.id, shuffleKey]);
  const exerciseForDisplay = exercise
    ? { ...exercise, options: randomizedOptions.map((option) => localizedExerciseOption(option, nativeLanguage)) }
    : null;

  if (!exercise) {
    return (
      <Panel title={title} icon={Sparkles}>
        <p className="text-slate-600">No exercise is ready yet. Add one from the admin area.</p>
      </Panel>
    );
  }

  const isSentenceBuilder = exercise.type === "SENTENCE_BUILDER";
  const isWritingPrompt = exercise.type === "WRITING_PROMPT";
  const isListeningDictation = exercise.type === "LISTENING_DICTATION";
  const isQuietListeningAlternative = quiet && isListeningDictation;
  const silentMeaning = isQuietListeningAlternative ? nativeMeaning(exercise.silentMeaning, nativeLanguage) : "";
  const exerciseTypeLabels = {
    MULTIPLE_CHOICE: german ? "Auswahl" : "Choice",
    CLOZE: german ? "Lückensatz" : "Fill the gap",
    TRANSLATION: german ? "Übertragen" : "Translation",
    SENTENCE_BUILDER: german ? "Satzbau" : "Sentence builder",
    ERROR_CORRECTION: german ? "Fehler finden" : "Correction",
    ARTICLE_MATCH: german ? "Artikel" : "Article",
    CONJUGATION: german ? "Verbform" : "Conjugation",
    SHORT_ANSWER: german ? (exercise.functionalGoals?.groups?.length ? "Freie Antwort" : "Modellsatz") : (exercise.functionalGoals?.groups?.length ? "Open answer" : "Model recall"),
    TRANSFORMATION: german ? "Umformung" : "Rewrite",
    DIALOGUE_REPLY: german ? (exercise.functionalGoals?.groups?.length ? "Freies Gespräch" : "Gesprächsbaustein") : (exercise.functionalGoals?.groups?.length ? "Open dialogue" : "Dialogue model"),
    LISTENING_DICTATION: isQuietListeningAlternative ? (german ? "Stiller Abruf" : "Silent recall") : (german ? "Hördiktat" : "Dictation"),
    WRITING_PROMPT: german ? (exercise.functionalGoals?.groups?.length ? "Freies Schreiben" : "Schreibmuster") : (exercise.functionalGoals?.groups?.length ? "Open writing" : "Writing model")
  };
  const selectedValue = isSentenceBuilder ? words.join(" ") : answer;
  const locked = Boolean(feedback && typeof feedback.correct === "boolean");
  const canSubmit = selectedValue.trim().length > 0 && !locked && !busy;
  const acceptedValues = feedback?.accepted?.map(normalizeText) || [];
  const autoAdvancingFeedback =
    locked && autoAdvance && !feedback?.submissionError && (feedback.correct || autoAdvanceOnWrong);
  const canDeferWrongRetry = Boolean(locked && !feedback?.correct && !feedback?.submissionError && deferWrongRetry);

  const resetAttempt = () => {
    setAnswer("");
    setWords([]);
    setFeedback(null);
    setHintLevel(0);
    setNeedsCorrection(Boolean(correctionAttempt));
    inputMethodRef.current = "keyboard";
    attemptStartedAtRef.current = Date.now();
    onReset?.();
  };

  const continueAfterFeedback = async () => {
    setContinuing(true);
    try {
      await onComplete?.();
      setNeedsCorrection(false);
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
          words: submittedWords,
          quality: hintLevel > 0 || needsCorrection || correctionAttempt || isQuietListeningAlternative ? "hard" : "good",
          usedSupport: hintLevel > 0 || needsCorrection || correctionAttempt,
          correctionAttempt,
          practiceMode: isQuietListeningAlternative ? "quiet-alternative" : "home",
          inputMethod: inputMethodRef.current,
          responseTimeMs: Date.now() - attemptStartedAtRef.current
        }
      });
      const resultWithAnswer = { ...result, submitted: submittedValue };
      setFeedback(resultWithAnswer);
      onResult?.(resultWithAnswer);
      if (!result.correct) setNeedsCorrection(true);
      setHintLevel(0);

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
        }, result.correct ? autoAdvanceDelay : Math.max(autoAdvanceDelay, 2600));
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
              {exercise.imageKey && (
                <AssetImage imageKey={exercise.imageKey} alt={exercise.prompt} className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-500">{isQuietListeningAlternative ? (german ? "Bedeutung aktiv auf Spanisch rekonstruieren" : "Reconstruct the meaning in Spanish") : localizedExercisePrompt(exercise, nativeLanguage)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-950">{isQuietListeningAlternative && silentMeaning ? (german ? `Drücke diese Bedeutung auf Spanisch aus: „${silentMeaning}“` : `Express this meaning in Spanish: “${silentMeaning}”`) : localizedExerciseQuestion(exercise, nativeLanguage)}</h3>
                  {exerciseTypeLabels[exercise.type] && (
                    <span className="rounded-full bg-lagoon-50 px-2 py-1 text-xs font-black text-lagoon-700">
                      {exerciseTypeLabels[exercise.type]}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{localizedExerciseInstruction(exercise, nativeLanguage, isQuietListeningAlternative)}</p>
                {isQuietListeningAlternative && !silentMeaning && (
                  <p role="alert" className="mt-3 rounded-md border border-honey-200 bg-honey-50 px-3 py-2 text-sm font-bold text-honey-900">{german ? "Für dieses Hörziel fehlt noch die stille Bedeutungsangabe. Nutze die Hilfestufen oder wechsle für diese Aufgabe in den Zuhause-Modus." : "This listening target has no silent meaning cue yet. Use the help ladder or switch to home mode for this item."}</p>
                )}
                {isListeningDictation && exercise.audioText && !quiet && (
                  <div className="mt-3">
                    <PronunciationTools text={exercise.audioText} hideTextInTitle allowCopy={false} nativeLanguage={nativeLanguage} />
                  </div>
                )}
                {isWritingPrompt && exercise.rubric && !german && exercise.functionalGoals?.groups?.length > 0 && (
                  <p className="mt-3 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-slate-700">
                    {exercise.rubric}
                  </p>
                )}
                {exercise.functionalGoals?.groups?.length > 0 && (
                  <div className="mt-3 rounded-md border border-sky-200 bg-sky-50 px-3 py-3 text-sky-950">
                    <p className="text-xs font-black uppercase tracking-wide text-sky-700">{german ? "Darauf kommt es an" : "What this answer needs"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {exercise.functionalGoals.groups.map((goal) => (
                        <span key={goal.key} className="rounded-full border border-sky-200 bg-white px-2.5 py-1 text-xs font-bold text-sky-900">
                          {german ? goal.labelDe : goal.labelEn}{goal.required ? " *" : ""}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-sky-800">
                      {german
                        ? `* Pflichtfunktion. Insgesamt ${exercise.functionalGoals.minimumMatched === 1 ? "muss mindestens eine Funktion" : `müssen mindestens ${exercise.functionalGoals.minimumMatched} Funktionen`} klar erkennbar sein; die genaue Formulierung bestimmst du selbst.`
                        : `* Required function. At least ${exercise.functionalGoals.minimumMatched} functions must be clear; the exact wording is yours.`}
                    </p>
                  </div>
                )}
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
                {feedback.correct ? (german ? "Richtig" : "Correct") : (german ? "Noch festigen" : "Needs review")}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_220px]">
          <div className="p-4">
            {isSentenceBuilder ? (
              <SentenceBuilder
                exercise={exerciseForDisplay}
                nativeLanguage={nativeLanguage}
                words={words}
                setWords={setWords}
                disabled={locked || busy}
                onAutoComplete={autoSubmitChoices ? (nextWords) => submit("", nextWords) : null}
              />
            ) : isWritingPrompt ? (
              <textarea
                ref={writingInputRef}
                aria-label={german ? "Spanische Antwort" : "Spanish answer"}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={locked || busy}
                className="min-h-32 w-full rounded-md border border-stone-200 px-3 py-3 outline-none focus:border-lagoon-500 disabled:bg-stone-100"
                placeholder={german ? "Schreibe deine Antwort auf Spanisch" : "Write your answer"}
              />
            ) : (
              <AnswerChoices
                exercise={exerciseForDisplay}
                nativeLanguage={nativeLanguage}
                quiet={quiet}
                answer={answer}
                setAnswer={setAnswer}
                onSpeechTranscript={(transcript) => {
                  inputMethodRef.current = "speech";
                  setAnswer(transcript);
                }}
                onKeyboardInput={() => {
                  inputMethodRef.current = "keyboard";
                }}
                disabled={locked || busy}
                feedback={feedback}
                acceptedValues={acceptedValues}
                onAutoSelect={autoSubmitChoices ? (value) => submit(value, words) : null}
              />
            )}
            {isWritingPrompt && !locked && !busy && <SpanishCharacterBar value={answer} onChange={setAnswer} inputRef={writingInputRef} nativeLanguage={nativeLanguage} />}
          </div>
          <div className="border-t border-stone-200 p-4 md:border-l md:border-t-0">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500">{german ? "Deine Antwort" : "Your answer"}</label>
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
                  {german ? "Richtige Antwort" : "Correct answer"}
                </label>
                <div className="mt-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm font-black text-emerald-800">
                  {feedback.expected}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {hintLevel > 0 && !locked && (
        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sky-800">
          <p className="flex items-center gap-2 font-black">
            <Wand2 size={18} /> {german ? `Hilfestufen ${hintLevel}/3` : `Help ladder ${hintLevel}/3`}
          </p>
          <p className="mt-2 text-sm font-semibold">{german ? germanExerciseHelp(exercise, quiet) : exercise.explanation}</p>
          {hintLevel >= 2 && (
            <div className="mt-3 rounded-md border border-sky-200 bg-white p-3">
              {exercise.learningSupport?.starter && <p className="text-sm font-black text-sky-900">{german ? "Beginne mit:" : "Start with:"} {exercise.learningSupport.starter}</p>}
              {!!exercise.learningSupport?.wordBank?.length && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {exercise.learningSupport.wordBank.map((word) => (
                    <span key={word} className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">{word}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {hintLevel >= 3 && exercise.learningSupport?.model && (
            <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{german ? "Modell bewusst ansehen und danach selbst versuchen" : "Study the model, then try it yourself"}</p>
              <p className="mt-1 font-black text-emerald-950">{exercise.learningSupport.model}</p>
              {!quiet && <div className="mt-2"><PronunciationTools text={exercise.learningSupport.model} compact allowCopy={false} nativeLanguage={nativeLanguage} /></div>}
            </div>
          )}
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
                {feedback.correct ? (german ? `Richtig. +${feedback.xpAwarded} XP` : `Correct. +${feedback.xpAwarded} XP`) : (german ? "Noch nicht ganz. Sieh dir das Muster an." : "Not quite. Review the pattern.")}
              </p>
              <p className={classNames("mt-1 text-sm", feedback.correct ? "text-emerald-800" : "text-red-800")}>
                {german ? germanFeedbackMessage(feedback) : feedback.explanation}
              </p>
            </div>
          </div>

          {!feedback.correct && !feedback.functionalCheck && (
            <CorrectionFocusCard
              focus={feedback.correctionFocus || feedback.evaluation?.correctionFocus}
              nativeLanguage={nativeLanguage}
            />
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <FeedbackFact label={german ? "Deine Antwort" : "Your answer"} value={feedback.submitted || "—"} />
            <FeedbackFact label={german ? "Richtige Antwort" : "Correct answer"} value={feedback.expected || "—"} good />
            <FeedbackFact label={german ? "Wiederholung" : "Review"} value={german ? germanReviewMessage(feedback) : feedback.review?.message || "Saved for practice."} />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {!locked && (
          <>
            <button
              onClick={() => setHintLevel((value) => Math.min(3, value + 1))}
              className="rounded-md border border-stone-200 px-4 py-2 font-semibold text-slate-600 hover:bg-stone-50"
            >
              {hintLevel ? (german ? `Mehr Hilfe (${hintLevel}/3)` : `More help (${hintLevel}/3)`) : (german ? "Ich brauche Hilfe" : "Help me")}
            </button>
            <button
              onClick={resetAttempt}
              className="rounded-md border border-sky-200 px-4 py-2 font-semibold text-sky-700 hover:bg-sky-50"
            >
              {german ? "Leeren" : "Clear"}
            </button>
            <button
              disabled={!canSubmit || busy}
              onClick={() => submit()}
              className="ml-auto rounded-md bg-lagoon-500 px-5 py-2 font-bold text-white hover:bg-lagoon-600 disabled:opacity-50"
            >
              {busy ? (german ? "Wird geprüft..." : "Checking...") : (german ? "Antwort prüfen" : "Check Answer")}
            </button>
          </>
        )}
        {locked && !autoAdvancingFeedback && (
          <div>
            <button
              onClick={feedback.correct || canDeferWrongRetry ? continueAfterFeedback : resetAttempt}
              disabled={continuing}
              className={classNames(
                "rounded-md px-5 py-2 font-bold text-white disabled:opacity-60",
                feedback.correct ? "bg-lagoon-500 hover:bg-lagoon-600" : canDeferWrongRetry ? "bg-honey-500 hover:bg-honey-600" : "bg-red-600 hover:bg-red-700"
              )}
            >
              {continuing
                ? (german ? "Wird geladen..." : "Loading...")
                : feedback.correct
                  ? (german ? "Weiter" : "Continue")
                  : canDeferWrongRetry
                    ? (german ? "Korrektur verstanden – später erneut abrufen" : "Correction understood—retrieve again later")
                    : (german ? "Erneut versuchen" : "Try Again")}
            </button>
            {!feedback.correct && !feedback.submissionError && !requireCorrectToContinue && (
              <button
                onClick={continueAfterFeedback}
                disabled={continuing}
                className="ml-3 rounded-md border border-stone-200 bg-white px-4 py-2 font-semibold text-slate-600 hover:bg-stone-50 disabled:opacity-60"
              >
                {german ? "Trotzdem weiter" : "Continue Anyway"}
              </button>
            )}
          </div>
        )}
        {autoAdvancingFeedback && (
          <div className="rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
            {feedback.correct
              ? (german ? "Nächste Aufgabe wird geladen..." : "Next question loading...")
              : (german ? "Die unsichere Aufgabe kehrt nach den übrigen Aufgaben zurück..." : "This uncertain check will return after the remaining questions...")}
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

function QuizResultBanner({ result, className = "", nativeLanguage = "de" }) {
  if (!result) return null;
  const german = nativeLanguage === "de";
  const isSubmissionError = Boolean(result.submissionError);
  return (
    <div
      role={isSubmissionError ? "alert" : "status"}
      aria-live={isSubmissionError ? "assertive" : "polite"}
      aria-atomic="true"
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
            {isSubmissionError ? (german ? "Antwort konnte nicht geprüft werden" : "Could not check answer") : result.correct ? `${german ? "Richtig" : "Correct"} +${result.xpAwarded || 0} XP` : (german ? "Noch nicht richtig" : "Not correct")}
          </p>
          {isSubmissionError ? (
            <p className="mt-1 text-sm">{german ? "Versuche es erneut. Deine bisherige Antwort bleibt nicht als Fehler gewertet." : result.explanation || "Try again."}</p>
          ) : (
            <p className="mt-1 text-sm">
              {german ? "Richtige Antwort" : "Correct answer"}: <span className="font-black">{result.expected || "—"}</span>
            </p>
          )}
          {result.submitted && (
            <p className="mt-1 text-xs font-bold opacity-80">
              {german ? "Deine Antwort" : "Your answer"}: <span className="font-black">{result.submitted}</span>
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
  nativeLanguage = "de",
  quiet = false,
  emptyMessage = "No practice questions are available yet.",
  completeTitle = "Practice complete",
  completeImageKey = "rewards-and-progress:15"
}) {
  const german = nativeLanguage === "de";
  const usableExercises = buildLessonPracticeQueue(exercises);
  const exerciseKey = (exercises || [])
    .filter(Boolean)
    .map((exercise) => `${exercise.id}:${Boolean(exercise.mastered)}`)
    .join("|");
  const [results, setResults] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [practiceQueue, setPracticeQueue] = useState(() => usableExercises);
  const [practiceTurn, setPracticeTurn] = useState(0);
  const practiceResultRef = useRef(null);

  useEffect(() => {
    setResults([]);
    setLastResult(null);
    setPracticeQueue(usableExercises);
    setPracticeTurn(0);
    practiceResultRef.current = null;
  }, [exerciseKey, source]);

  if (!usableExercises.length) {
    return (
      <Panel title={title} icon={Sparkles}>
        <p className="text-sm font-semibold text-slate-600">{emptyMessage}</p>
      </Panel>
    );
  }

  const finished = practiceQueue.length === 0;
  const correct = results.filter((result) => result.correct).length;
  const completedChecks = Math.max(0, usableExercises.length - practiceQueue.length);
  const progress = Math.round((completedChecks / usableExercises.length) * 100);
  const retryingMisses = results.length >= usableExercises.length && practiceQueue.length > 0;
  const current = practiceQueue[0];
  const currentLabel = retryingMisses
    ? german ? `${practiceQueue.length} unsichere ${practiceQueue.length === 1 ? "Aufgabe" : "Aufgaben"} festigen` : `Fix ${practiceQueue.length} missed ${practiceQueue.length === 1 ? "check" : "checks"}`
    : `${Math.min(results.length + 1, usableExercises.length)}/${usableExercises.length}`;

  const completePracticeAttempt = () => {
    const result = practiceResultRef.current;
    if (!result || result.submissionError) return;

    practiceResultRef.current = null;
    setPracticeQueue((queue) => advanceLessonPracticeQueue(queue, result.correct));
    setPracticeTurn((value) => value + 1);
    refreshDashboard?.({ silent: true }).catch(() => null);
  };

  if (finished) {
    return (
      <div className="space-y-4">
        <QuizResultBanner result={lastResult} nativeLanguage={nativeLanguage} />
        <Panel title={completeTitle} icon={Trophy}>
          <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
            <AssetImage imageKey={completeImageKey} alt={completeTitle} className="h-28 w-28" />
            <div>
              <h2 className="text-3xl font-black text-slate-950">{correct}/{usableExercises.length} {german ? "beim ersten Abruf richtig" : "first-pass correct"}</h2>
              <ProgressBar value={usableExercises.length ? (correct / usableExercises.length) * 100 : 0} className="mt-4" />
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <QuizResultBanner result={lastResult} nativeLanguage={nativeLanguage} />
      <div className="rounded-lg border border-lagoon-100 bg-lagoon-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-black text-lagoon-900">
          <span>{title}</span>
          <span>{currentLabel}</span>
        </div>
        <ProgressBar value={progress} className="mt-3" />
      </div>
      {retryingMisses && (
        <div className="rounded-lg border border-honey-200 bg-honey-50 p-4 text-sm font-semibold text-honey-900">
          {german ? "Jetzt bleiben nur unsichere Aufgaben übrig. Bereits richtig gelöste Aufgaben bleiben bestanden." : "Only missed checks remain. The checks you already got right stay passed."}
        </div>
      )}
      <PracticePanel
        key={`${current.id}:${practiceTurn}`}
        title={retryingMisses ? `${title}: ${currentLabel}` : `${title} ${currentLabel}`}
        exercise={current}
        nativeLanguage={nativeLanguage}
        quiet={quiet}
        source={source}
        shuffleKey={`${source}:${practiceTurn}:${current.id}`}
        autoAdvance
        autoAdvanceOnWrong
        autoAdvanceDelay={1000}
        autoSubmitChoices
        onResult={(result) => {
          practiceResultRef.current = result;
          setLastResult(result);
          if (result.submissionError) return;
          setResults((currentResults) => {
            if (currentResults.some((attempt) => attempt.exerciseId === current.id)) return currentResults;
            return [...currentResults, { exerciseId: current.id, correct: Boolean(result.correct) }];
          });
        }}
        onComplete={completePracticeAttempt}
      />
    </div>
  );
}

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

// Client-side speech scoring reuses the same normalization the server grader
// uses, so "understandable" here means the same thing quizzes accept.
function scoreSpeech(target, transcript) {
  const expected = normalizeText(target);
  const heard = normalizeText(transcript);
  if (!expected || !heard) return "fail";
  if (expected === heard) return "success";
  if (heard.includes(expected) || expected.includes(heard)) return "close";
  const expectedTokens = expected.split(" ").filter(Boolean);
  const heardTokens = new Set(heard.split(" ").filter(Boolean));
  const overlap = expectedTokens.filter((token) => heardTokens.has(token)).length;
  if (expectedTokens.length && overlap / expectedTokens.length >= 0.6) return "close";
  return "fail";
}

// Speaking check built on the browser's free Web Speech API. When `target` is
// provided it self-grades and shows pronunciation feedback (practice mode);
// when `onTranscript` is provided it feeds the transcript to the caller so a
// learner can answer any exercise by speaking (fill mode).
function SpeakCheck({ target = "", onTranscript = null, onScore = null, compact = false, lang = "es-ES", nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  const Recognition = useMemo(() => getSpeechRecognition(), []);
  const [status, setStatus] = useState("idle"); // idle | listening | success | close | fail | error
  const [heard, setHeard] = useState("");
  const recognitionRef = useRef(null);

  useEffect(
    () => () => {
      try {
        recognitionRef.current?.abort?.();
      } catch {
        /* ignore */
      }
    },
    []
  );

  if (!Recognition) return null;

  const listening = status === "listening";

  const begin = () => {
    if (listening) {
      recognitionRef.current?.stop?.();
      return;
    }
    let recognition;
    try {
      recognition = new Recognition();
    } catch {
      setStatus("error");
      return;
    }
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 4;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setHeard("");
    setStatus("listening");

    recognition.onresult = (event) => {
      const alternatives = Array.from(event.results?.[0] || [])
        .map((alt) => alt?.transcript || "")
        .filter(Boolean);
      const best = alternatives[0] || "";
      setHeard(best);
      onTranscript?.(best);
      if (target) {
        const outcomes = alternatives.map((alt) => scoreSpeech(target, alt));
        const result = outcomes.includes("success") ? "success" : outcomes.includes("close") ? "close" : "fail";
        setStatus(result);
        onScore?.(result, best);
      } else {
        setStatus("idle");
      }
    };
    recognition.onerror = (event) => {
      setStatus(event?.error === "no-speech" || event?.error === "aborted" ? "fail" : "error");
    };
    recognition.onend = () => {
      setStatus((prev) => (prev === "listening" ? "idle" : prev));
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch {
      setStatus("error");
    }
  };

  const buttonClass = compact
    ? "grid h-8 w-8 place-items-center rounded-md border"
    : "inline-flex min-w-[96px] items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-bold";
  const badge = {
    success: { text: heard ? (german ? `Sehr gut – erkannt: „${heard}“` : `Great—recognized: “${heard}”`) : (german ? "Sehr gut erkannt" : "Recognized clearly"), cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    close: { text: heard ? (german ? `Fast – erkannt wurde: „${heard}“` : `Close—recognized: “${heard}”`) : (german ? "Fast verständlich" : "Almost clear"), cls: "bg-honey-100 text-honey-700 border-honey-200" },
    fail: { text: heard ? (german ? `Erkannt wurde: „${heard}“` : `Recognized: “${heard}”`) : (german ? "Noch nicht erkannt" : "Not recognized yet"), cls: "bg-red-100 text-red-700 border-red-200" },
    error: { text: german ? "Mikrofon nicht verfügbar" : "Microphone unavailable", cls: "bg-stone-100 text-slate-600 border-stone-200" }
  }[status];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={begin}
        aria-label={listening ? (german ? "Aufnahme stoppen" : "Stop listening") : (german ? "Zum Aussprachetraining sprechen" : "Speak to practice pronunciation")}
        title={listening ? (german ? "Hört zu – zum Stoppen klicken" : "Listening… click to stop") : (german ? "Sprich, um deine Aussprache zu prüfen" : "Speak to check your pronunciation")}
        className={classNames(
          buttonClass,
          listening
            ? "animate-pulse border-coral-300 bg-coral-50 text-coral-600"
            : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
        )}
      >
        <Mic size={compact ? 16 : 17} />
        {!compact && (listening ? (german ? "Hört zu..." : "Listening…") : (german ? "Sprechen" : "Speak"))}
      </button>
      {badge && (
        <span className={classNames("rounded-full border px-2.5 py-1 text-xs font-bold", badge.cls)}>{badge.text}</span>
      )}
    </div>
  );
}

function PronunciationTools({ text, compact = false, hideTextInTitle = false, allowCopy = true, nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  const links = dictionaryLinks(text);
  const [audioState, setAudioState] = useState("idle");
  const availability = usePronunciationAvailability(text, !compact);
  const providerAvailability = availability.data?.providers || [];
  const sourceForProvider = (provider) => availability.data?.sources?.find((source) => source.provider === provider && source.playable) || availability.data?.sources?.find((source) => source.provider === provider) || null;
  const providerState = (provider) => providerAvailability.find((item) => item.provider === provider)?.availability || (availability.loading ? "checking" : "unknown");
  const providerUnavailable = (provider) => ["unavailable", "not_found"].includes(providerState(provider));
  const providerStatusMark = (provider) => ({ playable: "✓", unavailable: "×", not_found: "–", checking: "…", unknown: "?" }[providerState(provider)] || "?");
  const providerStatusText = (provider) => {
    const state = providerState(provider);
    if (state === "playable") return german ? "abspielbar" : "playable";
    if (state === "unavailable") return german ? "Audio nicht erreichbar" : "audio unavailable";
    if (state === "not_found") return german ? "keine passende Aufnahme gefunden" : "no matching recording";
    if (state === "checking") return german ? "wird geprüft" : "checking";
    return german ? "momentan nicht sicher prüfbar" : "could not verify now";
  };
  const buttonClass = compact
    ? "grid h-8 w-8 place-items-center rounded-md border border-stone-200 bg-white text-slate-600 hover:bg-stone-50"
    : "inline-flex min-w-[96px] items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-stone-50";
  const providerButtonClass = (provider) => classNames(
    "inline-flex items-center gap-1.5 rounded px-2 py-2 text-xs font-black",
    providerUnavailable(provider)
      ? "cursor-not-allowed text-slate-400 opacity-60"
      : providerState(provider) === "playable"
        ? "text-emerald-700 hover:bg-white"
        : "text-slate-600 hover:bg-white hover:text-lagoon-700"
  );
  const audioLabel = audioState === "loading" ? (german ? "Lädt" : "Loading") : audioState === "playing" ? (german ? "Läuft" : "Playing") : (german ? "Anhören" : "Listen");
  const audioTitle = hideTextInTitle ? (german ? "Spanische Aussprache abspielen" : "Play Spanish pronunciation audio") : (german ? `Aussprache von ${text} abspielen` : `Play real pronunciation audio for ${text}`);

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
        title={audioTitle}
      >
        <Volume2 size={compact ? 16 : 17} />
        {!compact && audioLabel}
      </button>
      {!compact && (
        <div className="flex overflow-hidden rounded-md border border-stone-200 bg-stone-50" aria-label={german ? "Quelle der Aussprache" : "Pronunciation audio source"}>
          <button
            type="button"
            disabled={providerUnavailable("spanishdict") || availability.loading}
            onClick={() => playPronunciationClip(text, setAudioState, "spanishdict", sourceForProvider("spanishdict")?.sourceText || "")}
            className={providerButtonClass("spanishdict")}
            aria-label={`SpanishDict: ${providerStatusText("spanishdict")}`}
            title={`SpanishDict: ${providerStatusText("spanishdict")}`}
          >
            SpanishDict <span aria-hidden="true">{providerStatusMark("spanishdict")}</span>
          </button>
          <button
            type="button"
            disabled={providerUnavailable("leo") || availability.loading}
            onClick={() => playPronunciationClip(text, setAudioState, "leo", sourceForProvider("leo")?.sourceText || "")}
            className={providerButtonClass("leo")}
            aria-label={`LEO: ${providerStatusText("leo")}`}
            title={`LEO: ${providerStatusText("leo")}`}
          >
            LEO <span aria-hidden="true">{providerStatusMark("leo")}</span>
          </button>
        </div>
      )}
      {!compact && allowCopy && (
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(text).catch(() => null)}
          className={buttonClass}
          title={hideTextInTitle ? (german ? "Spanischen Text kopieren" : "Copy Spanish text") : (german ? `${text} kopieren` : `Copy ${text}`)}
        >
          <Copy size={16} />
          {german ? "Kopieren" : "Copy"}
        </button>
      )}
      <SpeakCheck target={text} compact={compact} nativeLanguage={nativeLanguage} />
      <a
        href={links.spanishDict}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
        title={hideTextInTitle ? (german ? "SpanishDict öffnen" : "Open SpanishDict") : (german ? `${text} bei SpanishDict öffnen` : `Open ${text} on SpanishDict`)}
      >
        <ExternalLink size={compact ? 15 : 16} />
        {!compact && "SpanishDict"}
      </a>
      <a
        href={links.leo}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
        title={hideTextInTitle ? (german ? "LEO öffnen" : "Open LEO") : (german ? `${text} bei LEO öffnen` : `Open ${text} on LEO`)}
      >
        <ExternalLink size={compact ? 15 : 16} />
        {!compact && "LEO"}
      </a>
      {!compact && (
        <span className="sr-only" role="status" aria-live="polite">
          {availability.loading
            ? (german ? "Aussprachequellen werden geprüft." : "Checking pronunciation providers.")
            : providerAvailability.map((provider) => `${provider.label}: ${providerStatusText(provider.provider)}`).join(". ")}
        </span>
      )}
      {audioState === "error" && !compact && <span className="text-xs font-bold text-red-600">{german ? "Keine Audioquelle konnte abgespielt werden." : "No audio source could be played."}</span>}
    </div>
  );
}

function ConnectedSpeechPlayer({ text, nativeLanguage = "de", onComplete = null, onUnavailable = null }) {
  const german = nativeLanguage === "de";
  const [state, setState] = useState("idle");
  const [playCount, setPlayCount] = useState(0);
  const [focusIndex, setFocusIndex] = useState(0);
  const runRef = useRef(0);
  const chunks = useMemo(() => String(text || "").match(/[^.!?]+[.!?]+|[^.!?]+$/gu)?.map((chunk) => chunk.trim()).filter(Boolean) || [], [text]);

  const stop = () => {
    runRef.current += 1;
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    activePronunciationSpeech = null;
    setState("stopped");
  };

  useEffect(() => () => {
    runRef.current += 1;
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    activePronunciationSpeech = null;
  }, [text]);

  useEffect(() => setFocusIndex(0), [text]);

  const play = (rate, selectedChunks = chunks, completePass = true) => {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance === "undefined") {
      setState("error");
      onUnavailable?.();
      return;
    }
    runRef.current += 1;
    window.speechSynthesis.cancel();
    activePronunciationSpeech = null;
    const run = runRef.current;
    const utterancePlan = connectedSpeechUtterancePlan(selectedChunks, window.speechSynthesis.getVoices?.() || []);
    let index = 0;
    setState("playing");
    setPlayCount((count) => count + 1);

    const speakNext = () => {
      if (run !== runRef.current) return;
      if (index >= utterancePlan.length) {
        activePronunciationSpeech = null;
        setState("complete");
        if (completePass) onComplete?.();
        return;
      }
      const planned = utterancePlan[index];
      const utterance = new window.SpeechSynthesisUtterance(planned.spokenText);
      index += 1;
      utterance.lang = "es-ES";
      utterance.rate = rate;
      if (planned.voice) utterance.voice = planned.voice;
      utterance.onend = speakNext;
      utterance.onerror = () => {
        if (run !== runRef.current) return;
        activePronunciationSpeech = null;
        setState("error");
        onUnavailable?.();
      };
      activePronunciationSpeech = utterance;
      window.speechSynthesis.speak(utterance);
    };
    speakNext();
  };

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" disabled={state === "playing"} onClick={() => play(0.9)} className="inline-flex items-center gap-2 rounded-md border border-lagoon-200 bg-white px-4 py-2 text-sm font-black text-lagoon-800 disabled:opacity-50"><Volume2 size={17} /> {german ? "Vollständig hören" : "Listen in full"}</button>
        <button type="button" disabled={state === "playing"} onClick={() => play(0.72)} className="rounded-md border border-lagoon-200 bg-white px-4 py-2 text-sm font-black text-lagoon-800 disabled:opacity-50">{german ? "Vollständig langsamer" : "Full text slower"}</button>
        {state === "playing" && <button type="button" onClick={stop} className="rounded-md bg-coral-600 px-4 py-2 text-sm font-black text-white">{german ? "Stoppen" : "Stop"}</button>}
        <span className={classNames("text-xs font-bold", state === "error" ? "text-red-700" : "text-lagoon-700")}>{state === "playing" ? (german ? "Wiedergabe läuft" : "Playing") : state === "error" ? (german ? "Sprachausgabe ist in diesem Browser nicht verfügbar." : "Speech playback is unavailable.") : state === "stopped" ? (german ? "Wiedergabe gestoppt" : "Playback stopped") : state === "complete" ? (german ? `${playCount}. Hördurchgang beendet` : `${playCount} playthrough${playCount === 1 ? "" : "s"}`) : (german ? "Transkript verborgen" : "Transcript hidden")}</span>
      </div>
      {playCount > 0 && chunks.length > 1 && (
        <div className="rounded-md border border-lagoon-200 bg-white/80 p-3">
          <p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{german ? "Gezielt nachhören – Text bleibt verborgen" : "Focused replay — text remains hidden"}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <button type="button" disabled={state === "playing" || focusIndex === 0} onClick={() => setFocusIndex((index) => Math.max(0, index - 1))} className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 text-slate-700 disabled:opacity-35" aria-label={german ? "Vorherigen Abschnitt wählen" : "Choose previous section"}><ArrowLeft size={17} /></button>
            <button type="button" disabled={state === "playing"} onClick={() => play(0.82, [chunks[focusIndex]], false)} className="rounded-md bg-lagoon-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50"><Volume2 className="mr-2 inline" size={16} />{german ? `Abschnitt ${focusIndex + 1} von ${chunks.length}` : `Section ${focusIndex + 1} of ${chunks.length}`}</button>
            <button type="button" disabled={state === "playing" || focusIndex >= chunks.length - 1} onClick={() => setFocusIndex((index) => Math.min(chunks.length - 1, index + 1))} className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 text-slate-700 disabled:opacity-35" aria-label={german ? "Nächsten Abschnitt wählen" : "Choose next section"}><ArrowRight size={17} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function AnswerChoices({ exercise, answer, setAnswer, nativeLanguage = "de", quiet = false, onSpeechTranscript = null, onKeyboardInput = null, disabled = false, feedback, acceptedValues = [], onAutoSelect = null }) {
  const [freeText, setFreeText] = useState(false);
  const answerInputRef = useRef(null);
  const hasAttemptFeedback = Boolean(feedback && typeof feedback.correct === "boolean");

  if (!exercise.options.length || freeText) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <input
            ref={answerInputRef}
            value={answer}
            onChange={(event) => {
              onKeyboardInput?.();
              setAnswer(event.target.value);
            }}
            disabled={disabled}
            className="w-full rounded-md border border-stone-200 px-3 py-3 outline-none focus:border-lagoon-500 disabled:bg-stone-100"
            placeholder={nativeLanguage === "de" ? "Antwort auf Spanisch" : "Type your answer"}
          />
          {!disabled && !quiet && <SpeakCheck onTranscript={onSpeechTranscript || setAnswer} compact nativeLanguage={nativeLanguage} />}
        </div>
        {!disabled && <SpanishCharacterBar value={answer} onChange={(value) => { onKeyboardInput?.(); setAnswer(value); }} inputRef={answerInputRef} nativeLanguage={nativeLanguage} />}
        {!!exercise.options.length && (
          <button disabled={disabled} onClick={() => setFreeText(false)} className="mt-3 text-sm font-bold text-lagoon-600 disabled:opacity-50">
            {nativeLanguage === "de" ? "Antworten verwenden" : "Use choices"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-2" role="radiogroup" aria-label={nativeLanguage === "de" ? "Antwortmöglichkeiten" : "Answer choices"}>
      {exercise.options.map((option) => {
        const selected = answer === option.value;
        const correctOption = acceptedValues.includes(normalizeText(option.value));
        const wrongSelection = hasAttemptFeedback && selected && !correctOption;
        return (
          <button
            key={option.id}
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => {
              onKeyboardInput?.();
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
        {nativeLanguage === "de" ? "Stattdessen selbst eingeben" : "Type instead"}
      </button>
    </div>
  );
}

function SentenceBuilder({ exercise, words, setWords, nativeLanguage = "de", disabled = false, onAutoComplete = null }) {
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
            <span className="text-sm text-slate-500">{nativeLanguage === "de" ? "Baue den spanischen Satz hier auf" : "Build the sentence here"}</span>
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

function MiniGameCards({ games, onViewAll, nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  return (
    <Panel
      title={german ? "Kurze Abrufspiele" : "Mini Games"}
      icon={Gamepad2}
      action={
        <button onClick={onViewAll} className="text-sm font-bold text-sky-700">
          {german ? "Alle Übungen" : "View all games"}
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {games.map((rawGame) => {
          const game = localizedMiniGame(rawGame, nativeLanguage);
          return <div key={game.key} className={classNames("rounded-lg border p-4", game.color === "honey" ? "border-amber-200 bg-amber-50" : game.color === "blue" ? "border-sky-200 bg-sky-50" : "border-lagoon-200 bg-lagoon-50")}>
            <div className="flex items-start gap-3">
              <AssetImage imageKey={miniGameImageKeys[game.key] || "minigame-ui-rewards:9"} alt={game.title} className="h-14 w-14 shrink-0 rounded-full" />
              <div>
                <h3 className="font-extrabold text-slate-900">{game.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{game.description}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-slate-600">{german ? "Bestwert" : "High Score"}</span>
              <span className="font-bold">{game.highScore} {german ? "Pkt." : "pts"}</span>
            </div>
            <ProgressBar value={Math.min(100, game.highScore / 20)} className="mt-2" />
          </div>;
        })}
      </div>
    </Panel>
  );
}

function WeeklyChallengeCard({ challenge, onOpen, nativeLanguage = "de" }) {
  if (!challenge) return null;
  const german = nativeLanguage === "de";
  const percentage = Math.round((challenge.progress / challenge.targetCount) * 100);
  const ends = new Date(challenge.endsAt);
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_220px_180px] md:items-center">
        <div className="flex items-center gap-4">
          <AssetImage imageKey="rewards-and-progress:3" alt="Challenge trophy" className="h-16 w-16 shrink-0 rounded-full" />
          <div>
            <h3 className="text-lg font-extrabold">{german ? "Dein Wochenziel" : challenge.title}</h3>
            <p className="text-sm text-slate-600">{german ? `Löse ${challenge.targetCount} kurze Abrufaufgaben aus deinem Lernstoff.` : challenge.description}</p>
            <p className="mt-1 text-xs font-bold text-honey-600">{german ? "Endet am" : "Ends"} {ends.toLocaleDateString(german ? "de-DE" : undefined)}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-bold">
            <span>{german ? "Fortschritt" : "Progress"}</span>
            <span>
              {challenge.progress} / {challenge.targetCount}
            </span>
          </div>
          <ProgressBar value={percentage} className="mt-2" color="bg-honey-500" />
        </div>
        <button onClick={onOpen} className="rounded-md bg-honey-500 px-4 py-3 font-bold text-white hover:bg-honey-600">
          {german ? "Wochenziel öffnen" : "See Challenge"}
        </button>
      </div>
    </div>
  );
}

function GrammarView({ dashboard, onStartLesson }) {
  const lessons = dashboard.lessons || [];
  const nativeLanguage = dashboard.user?.nativeLanguage || "de";
  const german = nativeLanguage === "de";
  const levels = [...new Set(lessons.map((lesson) => lesson.cefrLevel).filter(Boolean))];
  const suggested = lessons.find((lesson) => !lesson.isLocked && (lesson.reviewDue || lesson.progress < 100)) || lessons[0];
  const [level, setLevel] = useState(suggested?.cefrLevel || levels[0] || "A1");
  const units = (dashboard.curriculumUnits || [])
    .filter((unit) => !unit.planned && unit.label?.startsWith(level))
    .map((unit) => localizedUnit(unit, nativeLanguage));
  const levelLessons = lessons.filter((lesson) => lesson.cefrLevel === level);
  const completed = levelLessons.filter((lesson) => lesson.progress >= 100 && !lesson.reviewDue).length;
  const due = levelLessons.filter((lesson) => lesson.reviewDue).length;
  const average = levelLessons.length ? Math.round(levelLessons.reduce((sum, lesson) => sum + lesson.progress, 0) / levelLessons.length) : 0;

  return (
    <div className="space-y-5">
      <WorkspaceSummary
        title={german ? "Deine Kompetenzkarte" : "Your skill map"}
        icon={GraduationCap}
        metrics={[
          { label: german ? "Lernpakete" : "Packages", value: levelLessons.length },
          { label: german ? "Sicher" : "Mastered", value: completed },
          { label: german ? "Zu festigen" : "Due", value: due }
        ]}
      >
        {german ? "Sieh nicht nur, welche Grammatik existiert, sondern was du bereits anwenden kannst. Öffne eine Einheit, um ein unsicheres Muster gezielt zu festigen oder ein abgeschlossenes Paket erneut abzurufen." : "See what you can actually use, then open any unit to strengthen or retrieve it again."}
      </WorkspaceSummary>

      <div className="sticky top-20 z-10 -mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex min-w-max gap-2 rounded-lg border border-stone-200 bg-white/95 p-2 shadow-sm backdrop-blur">
          {levels.map((item) => (
            <button key={item} onClick={() => setLevel(item)} className={classNames("rounded-md px-5 py-3 text-sm font-black", level === item ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-stone-100")}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <Panel title={`${level} · ${german ? "Überblick" : "Overview"}`} icon={Target}>
        <div className="grid gap-4 sm:grid-cols-[1fr_220px] sm:items-center">
          <div>
            <p className="font-black text-slate-950">{completed}/{levelLessons.length} {german ? "Lernpakete aktuell sicher" : "packages currently secure"}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{due ? (german ? `${due} bereits gelerntes ${due === 1 ? "Muster braucht" : "Muster brauchen"} einen erneuten aktiven Abruf.` : `${due} learned items need retrieval.`) : (german ? "Derzeit ist in dieser Stufe keine Wiederholung fällig." : "Nothing is due at this level right now.")}</p>
          </div>
          <div><div className="flex justify-between text-xs font-black uppercase tracking-wide text-slate-500"><span>{german ? "Stufenfortschritt" : "Level progress"}</span><span>{average}%</span></div><ProgressBar value={average} className="mt-2" /></div>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        {units.map((unit) => {
          const unitLessons = levelLessons.filter((lesson) => lesson.unit?.slug === unit.slug);
          const next = unitLessons.find((lesson) => !lesson.isLocked && (lesson.reviewDue || lesson.progress < 100)) || unitLessons.find((lesson) => !lesson.isLocked);
          return (
            <section key={unit.slug} className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-200 bg-stone-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-xs font-black uppercase tracking-wide text-lagoon-700">{unit.label} · {unit.phase}</p><h2 className="mt-2 text-xl font-black text-slate-950">{unit.title}</h2></div>
                  <span className={classNames("rounded-full px-3 py-1 text-xs font-black", unit.status === "complete" ? "bg-emerald-100 text-emerald-800" : unit.dueCount ? "bg-honey-100 text-honey-800" : "bg-sky-100 text-sky-800")}>{unit.status === "complete" ? (german ? "Sicher" : "Secure") : unit.dueCount ? (german ? "Wiederholen" : "Review") : (german ? "Im Aufbau" : "Building")}</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{unit.description}</p>
              </div>
              <div className="grid gap-2 p-4">
                {unitLessons.map((lesson) => (
                  <button key={lesson.id} disabled={lesson.isLocked} onClick={() => onStartLesson(lesson.id)} className="group flex items-center gap-3 rounded-lg border border-stone-200 p-3 text-left transition hover:border-lagoon-300 hover:bg-lagoon-50 disabled:cursor-not-allowed disabled:opacity-55">
                    <AssetImage imageKey={lesson.imageKey} alt={localizedLessonTitle(lesson, nativeLanguage)} className="h-12 w-12 shrink-0" />
                    <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="font-black leading-5 text-slate-950">{localizedLessonTitle(lesson, nativeLanguage)}</p><span className="shrink-0 text-xs font-black text-lagoon-700">{lesson.progress}%</span></div><p className="mt-1 text-xs font-semibold text-slate-500">{lesson.isLocked ? (german ? "Vorherige Pakete zuerst abschließen" : "Complete earlier packages first") : lesson.reviewDue ? (german ? "Aktiver Abruf ist fällig" : "Retrieval is due") : lesson.progress >= 100 ? (german ? "Erneut abrufen" : "Retrieve again") : lesson.progress > 0 ? (german ? "Lernpaket fortsetzen" : "Continue package") : (german ? "Konzept lernen" : "Learn concept")}</p></div>
                    <ArrowRight className="shrink-0 text-stone-300 group-hover:text-lagoon-600" size={18} />
                  </button>
                ))}
                {next && <button onClick={() => onStartLesson(next.id)} className="mt-2 flex items-center justify-center gap-2 rounded-md bg-lagoon-500 px-4 py-3 font-black text-white hover:bg-lagoon-600"><Rocket size={17} /> {german ? "Nächsten sinnvollen Schritt öffnen" : "Open next useful step"}</button>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function lessonsByThemes(dashboard, themes) {
  const themeSet = new Set(themes);
  return (dashboard.lessons || []).filter((lesson) => themeSet.has(lesson.theme));
}

function ScenarioPracticeView({ dashboard, refreshDashboard, nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  const scenarioLessons = lessonsByThemes(dashboard, ["Scenario"]).filter((lesson) => !lesson.isLocked && lesson.progress > 0);
  const [selectedId, setSelectedId] = useState("");
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [turns, setTurns] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  const loadLesson = async (lessonId) => {
    setSelectedId(lessonId);
    setLoading(true);
    setLesson(null);
    setIndex(0);
    setTurns([]);
    setLastResult(null);
    try {
      const data = await api(`/api/lessons/${lessonId}`);
      setLesson(data.lesson);
    } finally {
      setLoading(false);
    }
  };

  const exercises = lesson?.exercises || [];
  const current = exercises[index] || null;
  const finished = Boolean(lesson && index >= exercises.length);
  const correctCount = turns.filter((turn) => turn.correct).length;
  const progress = exercises.length ? Math.round((Math.min(index, exercises.length) / exercises.length) * 100) : 0;

  if (!scenarioLessons.length) {
    return (
      <Panel title={german ? "Alltagssituationen" : "Scenarios"} icon={Users}>
        <p className="text-sm font-semibold text-slate-600">{german ? "Situationen werden hier freigeschaltet, sobald du das zugehörige Lernpaket im Kurs begonnen hast. So übst du bekannte Satzrahmen, statt späteren Stoff vorwegzunehmen." : "Scenarios unlock after you begin their course package, so practice never jumps ahead of teaching."}</p>
      </Panel>
    );
  }

  if (!selectedId) {
    return (
      <div className="space-y-5">
        <Panel title={german ? "Geführte Alltagssituationen" : "Scenario Packs"} icon={Users}>
          <div className="grid gap-4 md:grid-cols-3">
            {scenarioLessons.map((item) => (
              <button
                key={item.id}
                onClick={() => loadLesson(item.id)}
                className="rounded-lg border border-stone-200 bg-white p-4 text-left shadow-sm hover:border-lagoon-300"
              >
                <AssetImage imageKey={item.imageKey} alt={localizedLessonTitle(item, nativeLanguage)} className="h-20 w-20" />
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-lagoon-50 px-2 py-1 text-xs font-black text-lagoon-700">{item.cefrLevel}</span>
                  {item.unit?.label && <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-black text-slate-700">{item.unit.label}</span>}
                </div>
                <h3 className="mt-3 text-lg font-black text-slate-950">{localizedLessonTitle(item, nativeLanguage)}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-600">{localizedLessonSummary(item, nativeLanguage)}</p>
                <ProgressBar value={item.progress || 0} className="mt-4" />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  if (loading || !lesson) {
    return <Panel title={german ? "Alltagssituationen" : "Scenarios"} icon={Users}>{german ? "Situation wird vorbereitet..." : "Loading scenario..."}</Panel>;
  }

  if (finished) {
    const score = exercises.length ? Math.round((correctCount / exercises.length) * 100) : 0;
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <QuizResultBanner result={lastResult} nativeLanguage={nativeLanguage} />
        <Panel title={german ? "Situation abgeschlossen" : "Scenario Complete"} icon={Trophy}>
          <div className="grid gap-5 md:grid-cols-[130px_1fr] md:items-center">
            <AssetImage imageKey={lesson.imageKey} alt={localizedLessonTitle(lesson, nativeLanguage)} className="h-28 w-28" />
            <div>
              <h2 className="text-3xl font-black text-slate-950">{correctCount}/{exercises.length} {german ? "Gesprächsschritte richtig" : "turns correct"}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">{german ? "Du hast bekannte Satzmuster in einer zusammenhängenden Alltagssituation aktiv abgerufen." : lesson.reviewSummary}</p>
              <ProgressBar value={score} className="mt-4" color={score >= 80 ? "bg-emerald-500" : "bg-honey-500"} />
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setIndex(0);
                    setTurns([]);
                    setLastResult(null);
                  }}
                  className="rounded-md border border-stone-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-stone-50"
                >
                  {german ? "Situation wiederholen" : "Repeat"}
                </button>
                <button
                  onClick={() => {
                    setSelectedId("");
                    setLesson(null);
                    refreshDashboard?.({ silent: true });
                  }}
                  className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600"
                >
                  {german ? "Andere Situation wählen" : "Choose Scenario"}
                </button>
              </div>
            </div>
          </div>
        </Panel>
        <ScenarioTurnHistory turns={turns} nativeLanguage={nativeLanguage} />
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <button
          onClick={() => {
            setSelectedId("");
            setLesson(null);
          }}
          className="rounded-md border border-stone-200 bg-white px-4 py-2 font-bold text-slate-600 hover:bg-stone-50"
        >
          {german ? "Zurück zu den Situationen" : "Back to scenarios"}
        </button>
        <QuizResultBanner result={lastResult} nativeLanguage={nativeLanguage} />
        <Panel title={localizedLessonTitle(lesson, nativeLanguage)} icon={Users}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-black text-lagoon-900">
            <span>{german ? "Schritt" : "Turn"} {index + 1}/{exercises.length}</span>
            <span>{localizedScenarioMetadata(lesson.situation, nativeLanguage)}</span>
          </div>
          <ProgressBar value={progress} className="mt-3" />
        </Panel>
        {current?.scenario && (
          <Panel title={german ? "Gesprächskontext" : "Turn Context"} icon={Users}>
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoTile label={german ? "Ort" : "Setting"} value={localizedScenarioMetadata(current.scenario.setting || lesson.situation, nativeLanguage)} />
              <InfoTile label={german ? "Gegenüber" : "Partner"} value={current.scenario.partner || (german ? "Gesprächspartner" : "Partner")} />
              <InfoTile label={german ? "Dein Ziel" : "Goal"} value={localizedScenarioMetadata(current.scenario.goal || current.prompt, nativeLanguage)} />
            </div>
          </Panel>
        )}
        <PracticePanel
          key={current.id}
          title={`${localizedLessonTitle(lesson, nativeLanguage)} ${index + 1}/${exercises.length}`}
          exercise={current}
          nativeLanguage={nativeLanguage}
          source="LESSON"
          shuffleKey={`${lesson.id}:${index}:${current.id}`}
          autoAdvance
          autoAdvanceOnWrong={false}
          requireCorrectToContinue
          autoAdvanceDelay={1000}
          autoSubmitChoices
          onResult={(result) => {
            const savedTurn = {
              id: current.id,
              prompt: current.prompt,
              questionText: current.questionText,
              submitted: result.submitted,
              expected: result.expected,
              correct: Boolean(result.correct),
              scenario: current.scenario || null
            };
            setLastResult(result);
            setTurns((currentTurns) => {
              const next = [...currentTurns];
              next[index] = savedTurn;
              return next;
            });
          }}
          onComplete={async () => {
            setIndex((value) => value + 1);
            await refreshDashboard?.({ silent: true });
          }}
        />
      </section>
      <aside className="space-y-5">
        <Panel title={german ? "Deine Situation" : "Scenario"} icon={BookOpen}>
          <div className="flex gap-4">
            <AssetImage imageKey={lesson.imageKey} alt={localizedLessonTitle(lesson, nativeLanguage)} className="h-20 w-20 shrink-0" />
            <div>
              <p className="font-black text-slate-950">{localizedLessonTitle(lesson, nativeLanguage)}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{localizedLessonSummary(lesson, nativeLanguage)}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {(german ? ["Gespräch passend eröffnen", "Mit einem bekannten Satzrahmen reagieren", "Die Situation höflich weiterführen"] : (lesson.outcomes || []).slice(0, 3)).map((outcome) => (
              <p key={outcome} className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-bold text-slate-700">
                {outcome}
              </p>
            ))}
          </div>
        </Panel>
        <ScenarioTurnHistory turns={turns} nativeLanguage={nativeLanguage} />
      </aside>
    </div>
  );
}

function ScenarioTurnHistory({ turns, nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  return (
    <Panel title={german ? "Bisherige Gesprächsschritte" : "Answered Turns"} icon={ListChecks}>
      {turns.filter(Boolean).length ? (
        <div className="grid gap-3">
          {turns.filter(Boolean).map((turn, index) => (
            <div key={`${turn.id}-${index}`} className="rounded-lg border border-stone-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-black text-slate-950">{turn.questionText}</p>
                <span className={classNames("rounded-full px-2 py-1 text-xs font-black", turn.correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
                  {turn.correct ? (german ? "Richtig" : "Correct") : (german ? "Festigen" : "Review")}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-slate-500">{german ? "Du" : "You"}: {turn.submitted || "—"}</p>
              <p className="mt-1 text-xs font-bold text-emerald-700">{german ? "Modell" : "Answer"}: {turn.expected || "—"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-semibold text-slate-600">{german ? "Deine Antworten bleiben während der Situation hier sichtbar." : "Answered turns will stay visible here."}</p>
      )}
    </Panel>
  );
}

function ReadingListeningLabView({ dashboard, refreshDashboard }) {
  const nativeLanguage = dashboard.user?.nativeLanguage || "de";
  const german = nativeLanguage === "de";
  const quiet = dashboard.user?.learningMode === "quiet";
  const labLessons = lessonsByThemes(dashboard, ["Reading Lab", "Listening Lab"]).filter((lesson) => !lesson.isLocked && lesson.progress > 0);
  const [selectedId, setSelectedId] = useState("");
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);

  const loadLesson = async (lessonId) => {
    setSelectedId(lessonId);
    setLesson(null);
    setLoading(true);
    setShowTranscript(false);
    setPracticeOpen(false);
    try {
      const data = await api(`/api/lessons/${lessonId}`);
      setLesson(data.lesson);
    } finally {
      setLoading(false);
    }
  };

  const isListening = lesson?.theme === "Listening Lab";
  const transcript = (lesson?.sentences || []).map((sentence) => sentence.spanish).join(" ");

  if (!labLessons.length) {
    return (
      <Panel title={german ? "Hör- und Lesetraining" : "Input Lab"} icon={Volume2}>
        <p className="text-sm font-semibold text-slate-600">{german ? "Hör- und Lesetexte erscheinen hier, nachdem du ihr Lernpaket im geführten Kurs begonnen hast. Unbekannte Texte bleiben im Lernweg, wo Wortschatz und Strategie zuerst erklärt werden." : "Reading and listening texts appear here after you begin their guided course package."}</p>
      </Panel>
    );
  }

  if (!selectedId) {
    return (
      <Panel title={german ? "Hör- und Lesetraining" : "Input Lab"} icon={Volume2}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {labLessons.map((item) => (
            <button
              key={item.id}
              onClick={() => loadLesson(item.id)}
              className="rounded-lg border border-stone-200 bg-white p-4 text-left shadow-sm hover:border-lagoon-300"
            >
              <AssetImage imageKey={item.imageKey} alt={localizedLessonTitle(item, nativeLanguage)} className="h-20 w-20" />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-lagoon-50 px-2 py-1 text-xs font-black text-lagoon-700">{item.theme === "Listening Lab" ? (german ? "Hörtraining" : item.theme) : (german ? "Lesetraining" : item.theme)}</span>
                {item.unit?.label && <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-black text-slate-700">{item.unit.label}</span>}
              </div>
              <h3 className="mt-3 text-lg font-black text-slate-950">{localizedLessonTitle(item, nativeLanguage)}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">{localizedLessonSummary(item, nativeLanguage)}</p>
              <ProgressBar value={item.progress || 0} className="mt-4" />
            </button>
          ))}
        </div>
      </Panel>
    );
  }

  if (loading || !lesson) {
    return <Panel title={german ? "Hör- und Lesetraining" : "Input Lab"} icon={Volume2}>{german ? "Training wird geladen..." : "Loading lab..."}</Panel>;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <button
          onClick={() => {
            setSelectedId("");
            setLesson(null);
          }}
          className="rounded-md border border-stone-200 bg-white px-4 py-2 font-bold text-slate-600 hover:bg-stone-50"
        >
          {german ? "Zurück zur Auswahl" : "Back to labs"}
        </button>

        <Panel title={localizedLessonTitle(lesson, nativeLanguage)} icon={isListening ? Volume2 : BookOpen}>
          <div className="grid gap-5 lg:grid-cols-[140px_1fr]">
            <AssetImage imageKey={lesson.imageKey} alt={localizedLessonTitle(lesson, nativeLanguage)} className="aspect-square w-full max-w-[150px]" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-lagoon-50 px-2 py-1 text-xs font-black text-lagoon-700">{lesson.cefrLevel}</span>
                <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-black text-slate-700">{isListening ? (german ? "Hörtraining" : lesson.theme) : (german ? "Lesetraining" : lesson.theme)}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600">{localizedLessonSummary(lesson, nativeLanguage)}</p>
              {isListening ? (
                <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Erster Hörversuch ohne Transkript" : "Audio"}</p>
                  {quiet ? <p className="text-sm font-bold text-slate-700">{german ? "Leisemodus: Nutze diesen Inhalt heute als Lesetext." : "Quiet mode: use this as a reading text today."}</p> : <ConnectedSpeechPlayer text={transcript} nativeLanguage={nativeLanguage} />}
                </div>
              ) : (
                <div className="mt-5 space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
                  {(lesson.sentences || []).map((sentence) => (
                    <p key={sentence.id} className="text-lg font-black text-slate-950">{sentence.spanish}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setShowTranscript((value) => !value)}
              className="rounded-md border border-stone-200 bg-white px-4 py-3 font-black text-slate-700 hover:bg-stone-50"
            >
              {showTranscript ? (german ? "Vergleich schließen" : "Hide Transcript") : isListening ? (german ? "Transkript zum Vergleich öffnen" : "Reveal Transcript") : (german ? "Deutsche Bedeutungen anzeigen" : "Show Translation")}
            </button>
            <button
              onClick={() => setPracticeOpen(true)}
              className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600"
            >
              {german ? "Verständnisfragen starten" : "Start Questions"}
            </button>
          </div>
        </Panel>

        {showTranscript && (
          <Panel title={isListening ? (german ? "Transkript und Bedeutungsvergleich" : "Transcript") : (german ? "Bedeutungsvergleich" : "Translation")} icon={NotebookTabs}>
            <div className="grid gap-3">
              {(lesson.sentences || []).map((sentence) => (
                <div key={sentence.id} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-slate-950">{sentence.spanish}</p>
                    {!quiet && <PronunciationTools text={sentence.spanish} compact nativeLanguage={nativeLanguage} />}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{nativeMeaning(sentence.english, nativeLanguage) || (german ? "Erschließe die Bedeutung aus Kontext und Satzmuster." : sentence.english)}</p>
                  {sentence.note && !german && <p className="mt-2 text-sm font-bold text-lagoon-700">{sentence.note}</p>}
                </div>
              ))}
            </div>
          </Panel>
        )}

        {practiceOpen && (
          <ExerciseQueue
            key={lesson.id}
            title={german ? "Verständnis aktiv prüfen" : `${lesson.theme} Questions`}
            exercises={lesson.exercises}
            source="LESSON"
            refreshDashboard={refreshDashboard}
            nativeLanguage={nativeLanguage}
            quiet={quiet}
            completeTitle={german ? "Training abgeschlossen" : "Lab Complete"}
            completeImageKey={lesson.imageKey || "reading-and-listening-lab:1"}
          />
        )}
      </section>
      <aside className="space-y-5">
        <Panel title={german ? "Darauf achtest du" : "Lab Focus"} icon={Target}>
          <div className="grid gap-2">
            {(lesson.outcomes || []).slice(0, 4).map((outcome) => (
              <p key={outcome} className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-bold text-slate-700">
                {german ? "Hauptaussage, wichtige Details und Zusammenhänge aus dem spanischen Text erschließen." : outcome}
              </p>
            ))}
          </div>
        </Panel>
        <Panel title={german ? "Wichtige Wörter" : "Vocabulary"} icon={NotebookTabs}>
          <div className="grid gap-3">
            {(lesson.vocabularyGroups || []).flatMap((group) => group.words.slice(0, 6)).slice(0, 8).map((word) => (
              <div key={word.id} className="flex items-center gap-3 rounded-md border border-stone-200 bg-white p-2">
                {word.imageKey && <AssetImage imageKey={word.imageKey} alt={word.spanish} className="h-12 w-12 shrink-0" />}
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-950">{word.spanish}</p>
                  <p className="text-xs font-semibold text-slate-600">{localizedWordMeaning(word, nativeLanguage) || (german ? "Bedeutung im Kontext erschließen" : word.english)}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </aside>
    </div>
  );
}

function MiniGamesView({ dashboard, refreshDashboard, nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  const [activeGame, setActiveGame] = useState(null);
  const [gameExercises, setGameExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const startGame = async (game) => {
    setActiveGame(game);
    if (game.key === "word-catcher") return;
    setLoading(true);
    setLoadError("");
    try {
      const preferredType =
        game.key === "sentence-builder"
          ? "SENTENCE_BUILDER"
          : game.key === "article-match"
            ? "ARTICLE_MATCH"
            : "CONJUGATION";
      const data = await api(`/api/practice/exercises?type=${preferredType}&limit=80`);
      setGameExercises(shuffleItems(data.exercises || []));
    } catch {
      setGameExercises([]);
      setLoadError(german ? "Der gelernte Übungsstapel konnte gerade nicht geladen werden." : "Your learned practice deck could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <MiniGameCards games={dashboard.miniGames} onViewAll={() => null} nativeLanguage={nativeLanguage} />
      <div className="grid gap-4 md:grid-cols-3">
        {dashboard.miniGames.map((rawGame) => {
          const game = localizedMiniGame(rawGame, nativeLanguage);
          return (
          <button
            key={game.key}
            onClick={() => startGame(rawGame)}
            className="rounded-lg border border-stone-200 bg-white p-5 text-left shadow-sm hover:border-lagoon-300"
          >
            <AssetImage imageKey={miniGameImageKeys[game.key] || "minigame-ui-rewards:9"} alt={game.title} className="mb-4 h-12 w-12 rounded-full" />
            <h3 className="font-extrabold">{game.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{game.description}</p>
            <p className="mt-4 text-sm font-bold text-honey-600">{german ? "Runde starten" : "Start round"}</p>
          </button>
          );
        })}
      </div>

      {activeGame?.key === "word-catcher" ? (
        <WordCatcherGame game={activeGame} refreshDashboard={refreshDashboard} nativeLanguage={dashboard.user?.nativeLanguage || "de"} />
      ) : activeGame && (
        <PracticeMiniGameRound
          game={activeGame}
          exercises={gameExercises}
          loading={loading}
          loadError={loadError}
          refreshDashboard={refreshDashboard}
          nativeLanguage={nativeLanguage}
        />
      )}

      <ConjugationTrainer refreshDashboard={refreshDashboard} nativeLanguage={nativeLanguage} />
    </div>
  );
}

function inferConjugationMeta(exercise) {
  const text = `${exercise.questionText || ""} ${exercise.explanation || ""} ${exercise.lessonTitle || ""}`;
  const trainer = exercise.trainer || {};
  const infinitive = trainer.infinitive || /\(([^)]+)\)/.exec(exercise.questionText || "")?.[1] || "";
  const lower = `${text} ${infinitive}`.toLowerCase();
  const person =
    trainer.person ||
    (/nosotros/.test(lower)
      ? "nosotros"
      : /tú| tu /.test(lower)
        ? "tu"
        : /ellos|ellas/.test(lower)
          ? "ellos"
          : /él|ella/.test(lower)
            ? "el-ella"
            : "yo");
  const family =
    trainer.family ||
    (/despertarse|levantarse|ducharse|cepillarse|acostarse|se\)/.test(lower)
      ? "reflexive"
      : /ir|hacer|decir|venir|salir|poner|traer|ver|oír|oir|saber|conocer|poder|querer|tener|dar/.test(lower)
        ? "irregular"
        : /-ar|hablar|estudiar|trabajar|comprar|caminar/.test(lower)
          ? "regular-ar"
          : "other");
  const tense = trainer.tense || "present";
  const difficulty = exercise.difficulty >= 3 ? "hard" : exercise.difficulty >= 2 ? "medium" : "easy";
  return { tense, person, family, difficulty, infinitive };
}

function ConjugationTrainer({ refreshDashboard, nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  const [deck, setDeck] = useState([]);
  const [filters, setFilters] = useState({
    tense: "all",
    person: "all",
    family: "all",
    difficulty: "all",
    mistakesOnly: false
  });
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [loadError, setLoadError] = useState("");

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const loadDeck = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api("/api/practice/exercises?type=CONJUGATION&limit=120");
      const exercises = (data.exercises || [])
        .map((exercise) => ({ ...exercise, trainerMeta: inferConjugationMeta(exercise) }));
      setDeck(exercises);
      setStarted(true);
    } catch {
      setDeck([]);
      setStarted(true);
      setLoadError(german ? "Deine bereits eingeführten Verbformen konnten gerade nicht geladen werden." : "Your introduced verb forms could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDeck = useMemo(() => {
    return deck.filter((exercise) => {
      const meta = exercise.trainerMeta || inferConjugationMeta(exercise);
      if (filters.tense !== "all" && meta.tense !== filters.tense) return false;
      if (filters.person !== "all" && meta.person !== filters.person) return false;
      if (filters.family !== "all" && meta.family !== filters.family) return false;
      if (filters.difficulty !== "all" && meta.difficulty !== filters.difficulty) return false;
      if (filters.mistakesOnly && exercise.lastAttemptCorrect !== false) return false;
      return true;
    });
  }, [deck, filters]);

  const mistakeCount = deck.filter((exercise) => exercise.lastAttemptCorrect === false).length;
  const filterKey = `${filters.tense}-${filters.person}-${filters.family}-${filters.difficulty}-${filters.mistakesOnly}`;
  const selectClass = "rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-black text-slate-700";

  return (
    <section className="space-y-4">
      <Panel title={german ? "Verbformen gezielt abrufen" : "Conjugation Trainer"} icon={PenTool}>
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div>
            <p className="text-sm font-semibold text-slate-600">
              {german ? "Übe bereits eingeführte Verbformen gezielt. Unsichere Antworten fließen automatisch in deine Wiederholungen ein." : "Train verb forms separately from the course path. Mistakes still enter review."}
            </p>
            <div className="mt-4 grid gap-3">
              <select value={filters.tense} onChange={(event) => updateFilter("tense", event.target.value)} className={selectClass}>
                <option value="all">{german ? "Alle Zeiten" : "All tenses"}</option>
                <option value="present">{german ? "Präsens" : "Present"}</option>
              </select>
              <select value={filters.person} onChange={(event) => updateFilter("person", event.target.value)} className={selectClass}>
                <option value="all">{german ? "Alle Personen" : "All people"}</option>
                <option value="yo">Yo</option>
                <option value="tu">Tú</option>
                <option value="el-ella">Él / Ella</option>
                <option value="nosotros">Nosotros</option>
                <option value="ellos">Ellos</option>
              </select>
              <select value={filters.family} onChange={(event) => updateFilter("family", event.target.value)} className={selectClass}>
                <option value="all">{german ? "Alle Verbgruppen" : "All verb families"}</option>
                <option value="regular-ar">{german ? "Regelmäßige Verben auf -ar" : "Regular -ar"}</option>
                <option value="irregular">{german ? "Unregelmäßiges Präsens" : "Irregular present"}</option>
                <option value="reflexive">{german ? "Reflexive Verben" : "Reflexive"}</option>
                <option value="other">{german ? "Weitere Formen" : "Other"}</option>
              </select>
              <select value={filters.difficulty} onChange={(event) => updateFilter("difficulty", event.target.value)} className={selectClass}>
                <option value="all">{german ? "Alle Schwierigkeiten" : "All difficulty"}</option>
                <option value="easy">{german ? "Leicht" : "Easy"}</option>
                <option value="medium">{german ? "Mittel" : "Medium"}</option>
                <option value="hard">{german ? "Schwer" : "Hard"}</option>
              </select>
              <label className="flex items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-black text-slate-700">
                {german ? "Nur frühere Fehler" : "Mistakes only"}
                <input
                  type="checkbox"
                  checked={filters.mistakesOnly}
                  onChange={(event) => updateFilter("mistakesOnly", event.target.checked)}
                  className="h-5 w-5 accent-lagoon-500"
                />
              </label>
            </div>
            <button
              onClick={loadDeck}
              disabled={loading}
              className="mt-4 w-full rounded-md bg-lagoon-500 px-4 py-3 font-black text-white hover:bg-lagoon-600 disabled:opacity-60"
            >
              {loading ? (german ? "Wird vorbereitet..." : "Loading...") : started ? (german ? "Aufgaben neu laden" : "Refresh deck") : (german ? "Training starten" : "Start trainer")}
            </button>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
            <p className="font-black text-slate-900">{loadError || (started ? (german ? deck.length ? "Deine Abrufrunde mit bereits eingeführten Verbformen ist bereit." : "Noch keine Verbform ist für die Extra-Übung freigeschaltet. Beginne zuerst ein passendes Lernpaket im Kurs." : deck.length ? "Your introduced-verb deck is ready." : "No verb forms are unlocked for extra practice yet.") : (german ? "Wähle einen Schwerpunkt und starte eine kurze Abrufrunde." : "Choose filters and start a trainer round."))}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <InfoTile label={german ? "Gesamt" : "Deck"} value={deck.length} />
              <InfoTile label={german ? "Ausgewählt" : "Filtered"} value={filteredDeck.length} />
              <InfoTile label={german ? "Unsicher" : "Mistakes"} value={mistakeCount} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-600">
              {german ? "Richtige Antworten stärken den Lernstand; falsche Antworten werden für eine spätere Wiederholung gespeichert." : "Correct answers count toward lesson mastery; wrong answers are saved for review."}
            </p>
          </div>
        </div>
      </Panel>
      {started && (
        <ExerciseQueue
          key={`conjugation-${filterKey}-${deck.map((exercise) => exercise.id).join("|")}`}
          title={german ? "Verbformen" : "Conjugation"}
          exercises={filteredDeck}
          source="LESSON"
          refreshDashboard={refreshDashboard}
          emptyMessage={german ? "Für diesen Filter sind noch keine passenden Verbaufgaben verfügbar." : "No conjugation checks match this filter yet."}
          completeTitle={german ? "Verbformen-Runde abgeschlossen" : "Conjugation round complete"}
          completeImageKey="minigame-ui-rewards:3"
          nativeLanguage={nativeLanguage}
        />
      )}
    </section>
  );
}

function PracticeMiniGameRound({ game, exercises, loading, loadError = "", refreshDashboard, nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
  const displayGame = localizedMiniGame(game, nativeLanguage);
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
        submitted: german ? "Zeit abgelaufen" : "Timed out",
        explanation: german ? "Die Zeit ist abgelaufen. Das Muster kommt erneut." : `Time ran out. ${result.explanation || "Keep going."}`
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
    return <Panel title={displayGame.title} icon={Gamepad2}>{german ? "Übungsaufgaben werden vorbereitet..." : "Loading mini-game questions..."}</Panel>;
  }

  if (!total) {
    return (
      <Panel title={displayGame.title} icon={Gamepad2}>
        <p className="text-sm font-semibold text-slate-600">{loadError || (german ? "Dafür ist noch keine passende Aufgabe aus deinem bisherigen Lernweg freigeschaltet. Bearbeite zuerst das entsprechende Lernpaket; unbekannter Stoff wird hier bewusst nicht gezeigt." : "No matching exercise has been introduced in your course yet; unknown material stays hidden.")}</p>
      </Panel>
    );
  }

  if (finished) {
    const percent = results.length ? Math.round((correct / results.length) * 100) : 0;
    return (
      <Panel title={german ? `${displayGame.title} abgeschlossen` : `${displayGame.title} Complete`} icon={Trophy}>
        <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
          <AssetImage imageKey="minigame-ui-rewards:8" alt="Complete" className="h-28 w-28" />
          <div>
            <h2 className="text-3xl font-black text-slate-950">{correct}/{results.length} {german ? "richtig" : "correct"}</h2>
            <p className="mt-2 font-semibold text-slate-600">{saving ? (german ? "Ergebnis wird gespeichert..." : "Saving score...") : (german ? "Ergebnis gespeichert." : "Score saved.")}</p>
            <ProgressBar value={percent} className="mt-4" color={percent >= 80 ? "bg-emerald-500" : "bg-honey-500"} />
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <section className="space-y-5">
      <Panel title={displayGame.title} icon={Gamepad2}>
        <div className="grid gap-3 sm:grid-cols-5">
          <InfoTile label={german ? "Runde" : "Round"} value={index + 1} />
          <InfoTile label={german ? "Stapel" : "Deck"} value={`${deckPosition}/${total}`} />
          <InfoTile label={german ? "Richtig" : "Correct"} value={correct} />
          <InfoTile label={german ? "Zeit" : "Time"} value={`${Math.ceil(timeLeft)}s`} />
          <InfoTile label={german ? "Bestwert" : "High Score"} value={game.highScore || 0} />
        </div>
        <ProgressBar value={progress} className="mt-4" />
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-wide text-slate-500">
            <span>{german ? "Zeit" : "Timer"}</span>
            <span>
              {Math.ceil(timeLeft)}s / {timeLimit}s
            </span>
          </div>
          <ProgressBar
            value={timeLimit ? (timeLeft / timeLimit) * 100 : 0}
            color={timeLeft <= 2 ? "bg-red-500" : timeLeft <= 4 ? "bg-honey-500" : "bg-emerald-500"}
          />
          <p className="mt-2 text-xs font-bold text-slate-500">
            {german ? `Endlosmodus: Erst nach einem vollständigen Durchlauf wiederholen sich Aufgaben. Die Zeit sinkt schrittweise von ${timing.start}s auf ${timing.min}s.` : `Endless mode: no repeats until the current deck cycles. Starts at ${timing.start}s and shrinks toward ${timing.min}s.`}
          </p>
        </div>
        <button
          onClick={() => finishRound(latestResultsRef.current)}
          className="mt-4 rounded-md border border-stone-200 bg-white px-4 py-2 font-black text-slate-700 hover:bg-stone-50"
        >
          {german ? "Runde beenden" : "End Round"}
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
                {german ? "Vorherige Antwort" : "Previous answer"}
              </p>
              <p className="mt-1 font-black text-slate-950">{lastAnswer.correct ? (german ? "Richtig" : "Correct") : (german ? "Noch unsicher" : "Wrong")}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {german ? "Deine Antwort" : "You answered"}: {lastAnswer.submitted || "-"} · {german ? "Richtig" : "Correct"}: {lastAnswer.expected || "-"}
              </p>
            </div>
            <span className={classNames("rounded-full px-3 py-1 text-sm font-black", lastAnswer.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}>
              {lastAnswer.correct ? `+${lastAnswer.xpAwarded || 0} XP` : (german ? "Weiterüben" : "Keep going")}
            </span>
          </div>
        </div>
      )}

      <PracticePanel
        key={current.id}
        title={german ? `${displayGame.title} · Runde` : `${displayGame.title} Round`}
        exercise={current}
        nativeLanguage={nativeLanguage}
        source="GAME"
        shuffleKey={`${game.key}:${index}:${current.id}`}
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

function WordCatcherGame({ game, refreshDashboard, nativeLanguage = "de" }) {
  const displayGame = localizedMiniGame(game, nativeLanguage);
  const copy = wordCatcherCopy(nativeLanguage);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setMessage(copy.round(nextRound + 1));
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
      setMessage(`${copy.correct}: ${target.spanish} = ${localizedWordMeaning(target, nativeLanguage)}. +${gained}`);
      window.setTimeout(() => nextRound(nextScore, lives), 650);
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setMessage(`${copy.wrong} ${target.spanish} ${copy.means} ${localizedWordMeaning(target, nativeLanguage)}.`);
      window.setTimeout(() => nextRound(score, nextLives), 900);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setTarget(null);
    api("/api/words")
      .then((data) => {
        if (cancelled) return;
        const introducedWords = eligibleWordCatcherWords(data.groups);
        const usable = shuffleItems(introducedWords).slice(0, 60);
        setWords(usable);
        pickRound(usable, 0);
      })
      .catch(() => {
        if (!cancelled) setWords([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [nativeLanguage]);

  useEffect(() => {
    if (finished || resolving || !target) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          const nextLives = lives - 1;
          setLives(nextLives);
          setMessage(`${copy.timeout} ${target.spanish} ${copy.means} ${localizedWordMeaning(target, nativeLanguage)}.`);
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

  if (loading) {
    return <Panel title={displayGame.title} icon={Gamepad2}>{copy.loading}</Panel>;
  }

  if (!target) {
    return (
      <Panel title={displayGame.title} icon={Gamepad2}>
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-5">
          <p className="font-black text-sky-950">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm font-semibold text-sky-800">{copy.emptyText}</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title={displayGame.title} icon={Gamepad2}>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="rounded-lg border border-slate-900 bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-wide text-lagoon-100">{copy.target}</p>
          <h2 className="mt-3 text-4xl font-black">{target.spanish}</h2>
          <AssetImage imageKey={target.imageKey} alt={target.spanish} className="mt-5 aspect-square w-full" />
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <InfoTile label={copy.score} value={score} />
            <InfoTile label={copy.lives} value={lives} />
            <InfoTile label={copy.time} value={timeLeft} />
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-black text-slate-950">{message || copy.prompt}</p>
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
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">{copy.option} {index + 1}</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{localizedWordMeaning(choice, nativeLanguage)}</p>
              </button>
            ))}
          </div>

          {finished && (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xl font-black text-emerald-950">{copy.finalScore}: {score}</p>
              <p className="mt-1 text-sm font-bold text-slate-700">{saving ? copy.saving : copy.saved}</p>
              <button onClick={restart} className="mt-4 rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600">
                {copy.replay}
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

function ChallengesView({ challenge, refreshDashboard, nativeLanguage = "de" }) {
  const german = nativeLanguage === "de";
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
    return <Panel title={german ? "Wochenziel" : "Challenges"} icon={Trophy}>{german ? "Aktuell ist kein Wochenziel verfügbar." : "No active challenge is available."}</Panel>;
  }

  const targetCount = challenge.targetCount || exercises.length || 1;
  const isComplete = localProgress >= targetCount || challenge.isCompleted;
  const displayChallenge = { ...challenge, progress: Math.min(localProgress, targetCount), isCompleted: isComplete };
  const current = exercises.length ? exercises[localProgress % exercises.length] : null;

  return (
    <div className="space-y-5">
      <WeeklyChallengeCard challenge={displayChallenge} onOpen={() => null} nativeLanguage={nativeLanguage} />
      <QuizResultBanner result={lastResult} nativeLanguage={nativeLanguage} />
      {challenge.locked ? (
        <Panel title={german ? "Wochenziel noch nicht freigeschaltet" : "Weekly goal not unlocked yet"} icon={Lock}>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-5">
            <p className="font-black text-sky-950">{german ? "Dieses Ziel bleibt sichtbar, zieht aber keinen späteren Stoff vor." : "This goal stays visible without pulling future material forward."}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-sky-800">{german ? `Du kennst aktuell ${challenge.familiarCount || 0} von ${challenge.requiredFamiliarCount || targetCount} benötigten Aufgaben. Die zugehörigen Grundlagen werden automatisch im normalen Lernweg aufgebaut.` : `${challenge.familiarCount || 0} of ${challenge.requiredFamiliarCount || targetCount} required checks are familiar.`}</p>
            <ProgressBar value={(challenge.requiredFamiliarCount || targetCount) ? ((challenge.familiarCount || 0) / (challenge.requiredFamiliarCount || targetCount)) * 100 : 0} className="mt-4" />
          </div>
        </Panel>
      ) : isComplete ? (
        <Panel title={german ? "Wochenziel erreicht" : "Challenge Complete"} icon={Trophy}>
          <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
            <AssetImage imageKey="rewards-and-progress:3" alt="Challenge complete" className="h-28 w-28" />
            <div>
              <h2 className="text-3xl font-black text-slate-950">{german ? "Wochenziel erreicht" : "Challenge complete"}</h2>
              <p className="mt-2 font-semibold text-slate-600">{german ? "Dein Fortschritt wurde gespeichert." : "Your weekly challenge progress is saved."}</p>
            </div>
          </div>
        </Panel>
      ) : current ? (
        <PracticePanel
          key={`${current.id}-${localProgress}`}
          title={german ? `Wochenziel · Aufgabe ${localProgress + 1}/${targetCount}` : `Challenge Round ${localProgress + 1}/${targetCount}`}
          exercise={current}
          nativeLanguage={nativeLanguage}
          source="CHALLENGE"
          shuffleKey={`${challenge.id}:${localProgress}:${current.id}`}
          autoAdvance
          autoAdvanceOnWrong={false}
          requireCorrectToContinue
          autoAdvanceDelay={1000}
          autoSubmitChoices
          onResult={setLastResult}
          onComplete={async () => {
            setLocalProgress((value) => Math.min(targetCount, value + 1));
            await refreshDashboard?.({ silent: true });
          }}
        />
      ) : (
        <Panel title={german ? "Wochenziel" : "Challenges"} icon={Trophy}>{german ? "Noch sind keine Aufgaben für dieses Wochenziel verfügbar." : "No challenge questions are available yet."}</Panel>
      )}
    </div>
  );
}


function ConceptRepairBrief({ concept, nativeLanguage = "de", quiet = false }) {
  const german = nativeLanguage === "de";
  const brief = concept?.repairBrief;
  if (!brief) return null;
  const examples = Array.isArray(brief.examples) ? brief.examples.slice(0, 2) : [];

  return (
    <Panel title={german ? "30-Sekunden-Musterreparatur" : "30-second pattern repair"} icon={Wand2}>
      <div className="rounded-lg border border-lagoon-200 bg-lagoon-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-lagoon-700 px-3 py-1 text-xs font-black text-white">
            {german ? concept.labelDe : concept.labelEn}
          </span>
          <span className="text-xs font-bold text-lagoon-900">
            {concept.occurrences} {german ? (concept.occurrences === 1 ? "beobachteter Fehlversuch" : "beobachtete Fehlversuche") : (concept.occurrences === 1 ? "observed miss" : "observed misses")}
          </span>
        </div>
        <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">
          {german ? brief.explanationDe : brief.explanationEn}
        </p>
        <div className="mt-4 rounded-md border border-white/80 bg-white/70 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-wide text-lagoon-800">
            {german ? "So entscheidest du" : "How to decide"}
          </p>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-800">
            {german ? brief.decisionDe : brief.decisionEn}
          </p>
        </div>
        {!!examples.length && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {examples.map((example) => (
              <div key={example.spanish} className="rounded-md border border-stone-200 bg-white p-4">
                <p lang="es" className="text-lg font-black leading-6 text-slate-950">{example.spanish}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{german ? example.meaningDe : example.meaningEn}</p>
                <p className="mt-3 text-xs font-bold leading-5 text-lagoon-900">{german ? example.cueDe : example.cueEn}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-900">
          <Target className="mt-0.5 shrink-0" size={18} />
          <p>{german ? brief.recallDe : brief.recallEn}</p>
        </div>
        {quiet && concept.repairKey === "listening" && (
          <p className="mt-3 text-xs font-bold text-slate-600">
            {german ? "Leisemodus bleibt aktiv: Diese Reparatur und die folgende Ersatzaufgabe funktionieren vollständig ohne Audio." : "Quiet mode stays active: this repair and the following alternative work without audio."}
          </p>
        )}
      </div>
    </Panel>
  );
}

function ReviewQueueView({ refreshDashboard, nativeLanguage = "de", learningMode = "home" }) {
  const german = nativeLanguage === "de";
  const quiet = learningMode === "quiet";
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionItems, setSessionItems] = useState([]);
  const [initialItemCount, setInitialItemCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [finished, setFinished] = useState(false);
  const pendingReviewResultRef = useRef(null);

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

  if (loading || !review) return <Panel title={german ? "Wiederholen" : "Review"}>{german ? "Deine Wiederholungen werden vorbereitet..." : "Loading your review queue..."}</Panel>;

  const reviewItems = review.items || [];
  const sessionCounts = review.sessionCounts || review.counts;
  const repairConcept = review.conceptWeaknesses?.find((concept) => concept.recurring && concept.repairBrief) || review.conceptWeaknesses?.find((concept) => concept.repairBrief) || null;
  const inSession = sessionItems.length > 0 && !finished;
  const currentItem = inSession ? sessionItems[index] : null;
  const attempted = results.filter((result) => result !== undefined).length;
  const correct = results.filter(Boolean).length;
  const progress = sessionItems.length ? Math.round((index / sessionItems.length) * 100) : 0;

  const startReview = () => {
    const sessionSeed = reviewItems.map((item) => item.key).join("|");
    const plannedItems = interleaveReviewSessionItems(reviewItems, sessionSeed);
    setSessionItems(plannedItems);
    setInitialItemCount(plannedItems.length);
    setIndex(0);
    setResults([]);
    setLastResult(null);
    setFinished(false);
    pendingReviewResultRef.current = null;
  };

  const recordResult = (result) => {
    pendingReviewResultRef.current = result;
    setLastResult(result);
    if (result.submissionError) return;
    if (currentItem?.retry) return;
    setResults((currentResults) => {
      const next = [...currentResults];
      if (next[index] === undefined) next[index] = Boolean(result.correct);
      return next;
    });
  };

  const advance = async () => {
    const result = pendingReviewResultRef.current;
    if (!result || result.submissionError) return;
    const next = advanceReviewSession(sessionItems, index, result.correct);
    pendingReviewResultRef.current = null;
    setSessionItems(next.items);
    if (next.finished) {
      setFinished(true);
      await loadReview(false);
      await refreshDashboard?.({ silent: true });
      return;
    }
    setIndex(next.nextIndex);
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
                  <ListChecks size={16} /> {german ? "Gezielt wiederholen" : "Review"}
                </p>
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
                  {german ? "Festigen, bevor du vergisst" : "Review"}
                </h1>
                <p className="mt-3 max-w-2xl text-base font-semibold text-slate-300">
                  {german ? "Rufe fällige Wörter und Satzmuster aktiv ab. Unsichere Antworten kommen gezielt noch einmal zurück." : "Answer due words, grammar, and mistakes one question at a time."}
                </p>
              </div>
              <button
                disabled={!reviewItems.length}
                onClick={startReview}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-honey-500 px-5 py-4 font-black text-white hover:bg-honey-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Rocket size={19} /> {german ? "Wiederholung starten" : "Start Review"}
              </button>
            </div>
          </section>

          {repairConcept && <ConceptRepairBrief concept={repairConcept} nativeLanguage={nativeLanguage} quiet={quiet} />}

          {reviewItems.length ? (
            <Panel title={german ? "Das wartet heute auf dich" : "What Will Be Tested"} icon={Target}>
              <div className="grid gap-3 md:grid-cols-3">
                <InfoTile label={german ? "Wörter" : "Words"} value={sessionCounts.vocabulary} />
                <InfoTile label={german ? "Satzmuster" : "Grammar"} value={sessionCounts.grammar} />
                <InfoTile label={german ? "Unsicherheiten" : "Mistakes"} value={sessionCounts.mistakes} />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600">
                {german ? `${reviewItems.length} gezielte ${reviewItems.length === 1 ? "Aufgabe" : "Aufgaben"} · etwa ${review.estimatedMinutes} Minuten.` : `${reviewItems.length} focused ${reviewItems.length === 1 ? "question" : "questions"} · about ${review.estimatedMinutes} minutes.`}
              </p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
                {german
                  ? "Wörter erscheinen hier erst, nachdem du sie im Wörter-Tab eingeführt hast. Ein sicherer Erstabruf verschiebt sie auf einen späteren Tag; Fehler kommen früher zurück."
                  : "Words appear here only after you introduce them in the Words tab. A correct first recall moves them to a later day; missed items return sooner."}
              </p>
              {!!review.conceptWeaknesses?.length && (
                <div className="mt-5 rounded-lg border border-lagoon-200 bg-lagoon-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-lagoon-800">
                    {german ? "Erkannte Musterschwerpunkte" : "Detected pattern focus"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.conceptWeaknesses.slice(0, 3).map((concept) => (
                      <span key={concept.key} className="rounded-full border border-lagoon-200 bg-white px-3 py-1.5 text-xs font-black text-lagoon-900">
                        {german ? concept.labelDe : concept.labelEn} · {concept.targetCount} {german ? (concept.targetCount === 1 ? "Aufgabe" : "Aufgaben") : (concept.targetCount === 1 ? "task" : "tasks")} · {concept.occurrences} {german ? (concept.occurrences === 1 ? "Fehlversuch" : "Fehlversuche") : (concept.occurrences === 1 ? "miss" : "misses")}
                      </span>
                    ))}
                  </div>
                  {reviewItems.some((item) => item.relatedContrast) && (
                    <p className="mt-3 text-xs font-bold text-lagoon-900">
                      {german ? "Eine bereits bekannte Kontrastaufgabe ist enthalten, damit du das Muster sicher unterscheiden lernst." : "One familiar contrast task is included so you can distinguish the pattern reliably."}
                    </p>
                  )}
                </div>
              )}
            </Panel>
          ) : (
            <Panel title={german ? "Im Moment ist nichts fällig" : "Nothing Due"} icon={CheckCircle2}>
              <p className="text-sm font-semibold text-slate-600">
                {german ? "Du bist auf dem aktuellen Stand. Setze den Lernweg oder das Wörtertraining fort; neue Wiederholungen erscheinen automatisch zum passenden Zeitpunkt." : "No review is due right now. Continue the course or words practice to create future review items."}
              </p>
            </Panel>
          )}
        </section>

        <aside className="space-y-5">
          <Panel title={german ? "So funktioniert die Wiederholung" : "Review Rules"} icon={Shield}>
            <div className="grid gap-3 text-sm font-bold text-slate-700">
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">{german ? "Die Lösung bleibt verborgen, bis du selbst geantwortet hast." : "Answers stay hidden until you submit."}</div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">{german ? "Unsichere Antworten werden erklärt und zeitnah erneut abgefragt." : "Wrong answers are shown, then queued again for practice."}</div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">{german ? "Bei Wörtern produzierst du aktiv die spanische Form." : "Vocabulary uses active recall: type the Spanish."}</div>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">{german ? "Unsicherheiten, Satzmuster und Wörter wechseln sich gezielt ab; gleiche Inhalte stehen nicht unnötig direkt hintereinander." : "Mistakes, grammar, and words are deliberately interleaved without unnecessary immediate content repeats."}</div>
            </div>
          </Panel>

          {!!review.weakSpots?.length && (
            <Panel title={german ? "Noch zu festigen" : "Weak Areas"} icon={PenTool}>
              <div className="grid gap-2">
                {review.weakSpots.slice(0, 4).map((spot) => (
                  <div key={spot.key} className="rounded-md border border-stone-200 bg-stone-50 px-3 py-3">
                    <p className="font-black text-slate-950">{german ? "Gezielte Wiederholungsaufgabe" : spot.title}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{german ? (spot.word ? "Wortschatz" : "Satzmuster") : spot.categoryLabel}</p>
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
    const score = initialItemCount ? Math.round((correct / initialItemCount) * 100) : 0;
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <QuizResultBanner result={lastResult} nativeLanguage={nativeLanguage} />
        <Panel title={german ? "Wiederholung abgeschlossen" : "Review Complete"} icon={Trophy}>
          <div className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
            <AssetImage imageKey="rewards-and-progress:15" alt={german ? "Wiederholung abgeschlossen" : "Review complete"} className="h-28 w-28" />
            <div>
              <h2 className="text-3xl font-black text-slate-950">{correct}/{initialItemCount} {german ? "im ersten Versuch richtig" : "correct on the first attempt"}</h2>
              <p className="mt-2 font-semibold text-slate-600">{german ? "Unsichere Antworten hast du vor dem Abschluss korrigiert. Dein Wiederholungsplan berücksichtigt trotzdem den ersten Versuch." : "You corrected missed answers before finishing. Your review schedule still accounts for the first attempt."}</p>
              <ProgressBar value={score} className="mt-4" color={score >= 80 ? "bg-emerald-500" : "bg-honey-500"} />
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSessionItems([]);
                    setInitialItemCount(0);
                    setFinished(false);
                    setLastResult(null);
                  }}
                  className="rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600"
                >
                  {german ? "Zur Übersicht" : "Back to review"}
                </button>
                {!!review.items?.length && (
                  <button
                    onClick={startReview}
                    className="rounded-md border border-stone-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-stone-50"
                  >
                    {german ? "Verbleibende Aufgaben wiederholen" : "Review remaining"}
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
      <QuizResultBanner result={lastResult} nativeLanguage={nativeLanguage} />
      <Panel title={german ? "Aktive Wiederholung" : "Review Session"} icon={ListChecks}>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-black text-lagoon-900">
          <span>{german ? "Aufgabe" : "Question"} {index + 1}/{sessionItems.length}</span>
          <span>{attempted}/{initialItemCount} {german ? "Erstversuche" : "first attempts"}</span>
        </div>
        <ProgressBar value={progress} className="mt-3" />
      </Panel>

      {currentItem?.retry && (
        <div className="rounded-lg border border-honey-200 bg-honey-50 p-4 text-sm font-semibold text-honey-900">
          {german ? "Zeitlich getrennte Rückholung: Rufe die zuvor unsichere Antwort jetzt erneut ohne sichtbare Lösung ab." : "Delayed retry: retrieve the previously uncertain answer again without a visible solution."}
        </div>
      )}

      {currentItem?.exercise ? (
        <PracticePanel
          key={currentItem.key}
          title={german ? (currentItem.type === "mistake" ? "Unsicherheit festigen" : currentItem.relatedContrast ? "Verwandtes Muster unterscheiden" : "Satzmuster wiederholen") : (currentItem.type === "mistake" ? "Fix the mistake" : currentItem.relatedContrast ? "Distinguish a related pattern" : "Grammar review")}
          exercise={currentItem.exercise}
          nativeLanguage={nativeLanguage}
          quiet={quiet}
          source="REVIEW"
          shuffleKey={`review:${index}:${currentItem.key}`}
          autoAdvance
          autoAdvanceOnWrong={false}
          deferWrongRetry
          correctionAttempt={Boolean(currentItem.retry)}
          requireCorrectToContinue
          autoSubmitChoices
          onReset={() => setLastResult(null)}
          onResult={recordResult}
          onComplete={advance}
        />
      ) : currentItem?.word ? (
        <ReviewWordQuizCard
          key={currentItem.key}
          item={currentItem}
          nativeLanguage={nativeLanguage}
          onReset={() => setLastResult(null)}
          onResult={recordResult}
          onComplete={advance}
        />
      ) : (
        <Panel title={german ? "Wiederholen" : "Review"} icon={ListChecks}>
          <p className="text-sm font-semibold text-slate-600">{german ? "Diese Wiederholungsaufgabe ist nicht mehr verfügbar." : "This review item is unavailable."}</p>
        </Panel>
      )}
    </section>
  );
}

function ReviewWordQuizCard({ item, nativeLanguage = "de", onComplete, onResult, onReset }) {
  const german = nativeLanguage === "de";
  const word = item.word;
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [needsCorrection, setNeedsCorrection] = useState(Boolean(item.retry));
  const advanceTimer = useRef(null);
  const answerInputRef = useRef(null);

  useEffect(() => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    setAnswer("");
    setFeedback(null);
    setNeedsCorrection(Boolean(item.retry));
  }, [item.key, item.retry, word?.id]);

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
          mode: "native-es",
          answer,
          quality: needsCorrection ? "hard" : "good",
          activityMode: "typing"
        }
      });
      const resultWithAnswer = { ...result, submitted: answer };
      setFeedback(resultWithAnswer);
      onResult?.(resultWithAnswer);
      if (result.correct) {
        advanceTimer.current = window.setTimeout(() => {
          advanceTimer.current = null;
          onComplete?.();
        }, 900);
      } else {
        setNeedsCorrection(true);
      }
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
      <Panel title={german ? "Wortschatz wiederholen" : "Vocabulary Review"} icon={NotebookTabs}>
        <p className="text-sm font-semibold text-slate-600">{german ? "Dieses Wort ist nicht mehr verfügbar." : "This word is unavailable."}</p>
      </Panel>
    );
  }

  return (
    <Panel
      title={german ? "Wort aktiv abrufen" : "Word Recall"}
      icon={NotebookTabs}
      action={<span className="rounded-full bg-lagoon-50 px-3 py-1 text-xs font-black text-lagoon-700">{german ? "Wiederholung" : item.state || "Review"}</span>}
    >
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{german ? "Deutsche Bedeutung → Spanisch" : word.groupTitle || "Vocabulary"}</p>
        <h2 className="mt-3 text-4xl font-black text-slate-950">{localizedWordMeaning(word, nativeLanguage)}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">{german ? "Schreibe das spanische Wort oder die Wendung. Die Lösung bleibt bis zu deiner Antwort verborgen." : "Type the Spanish word or phrase. The Spanish answer stays hidden until you submit."}</p>
        <input
          ref={answerInputRef}
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
          placeholder={german ? "Spanische Antwort" : "Spanish answer"}
        />
        {!feedback && <SpanishCharacterBar value={answer} onChange={setAnswer} inputRef={answerInputRef} disabled={busy} nativeLanguage={nativeLanguage} />}
        {!feedback && (
          <button
            disabled={!answer.trim() || busy}
            onClick={() => submit()}
            className="mt-4 rounded-md bg-lagoon-500 px-5 py-3 font-black text-white hover:bg-lagoon-600 disabled:opacity-50"
          >
            {busy ? (german ? "Wird geprüft..." : "Checking...") : (german ? "Antwort prüfen" : "Check Answer")}
          </button>
        )}
      </div>

      {feedback && !feedback.submissionError && word.imageKey && (
        <div className="mt-5 grid gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:grid-cols-[110px_1fr] sm:items-center">
          <AssetImage imageKey={word.imageKey} alt={word.spanish} className="aspect-square w-full" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{german ? "Lösung aufgedeckt" : "Answer revealed"}</p>
            <p className="mt-1 text-xl font-black text-emerald-950">{word.spanish}</p>
            {spanishLearningExample(word.example) && <p className="mt-2 text-sm font-semibold text-slate-700">{spanishLearningExample(word.example)}</p>}
          </div>
        </div>
      )}

      {feedback && (
        <div className={classNames("mt-5 rounded-lg border p-4", feedback.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50")}>
          <p className={classNames("font-black", feedback.correct ? "text-emerald-900" : "text-red-900")}>
            {feedback.submissionError ? (german ? "Antwort konnte nicht geprüft werden" : "Could not check the answer") : feedback.correct ? `${german ? "Richtig" : "Correct"} +${feedback.xpAwarded} XP` : (german ? "Noch nicht" : "Not yet")}
          </p>
          {feedback.expected && (
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {german ? "Richtige Antwort" : "Correct answer"}: <span className="font-black">{feedback.expected}</span>
            </p>
          )}
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {feedback.submissionError
              ? (german ? "Bitte versuche es erneut." : feedback.explanation)
              : german
                ? feedback.correct
                  ? feedback.review?.scheduleAdvanced === false
                    ? "Der Abruf ist richtig. Der bereits geplante Termin bleibt unverändert."
                    : "Das Wort wird mit passendem Abstand erneut abgefragt."
                  : "Das Wort wird hinter die übrigen Aufgaben gestellt und kommt in dieser Runde erneut zurück."
                : feedback.review?.message}
          </p>
          {feedback.submissionError ? (
            <button
              onClick={() => setFeedback(null)}
              className="mt-4 rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              {german ? "Erneut versuchen" : "Try Again"}
            </button>
          ) : feedback.correct ? (
            <div className="mt-4 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
              {german ? "Die nächste fällige Aufgabe wird geladen..." : "Moving to the next due item..."}
            </div>
          ) : (
            <button
              onClick={() => onComplete?.()}
              className="mt-4 rounded-md bg-honey-500 px-4 py-2 font-bold text-white hover:bg-honey-600"
            >
              {german ? "Korrektur verstanden – später erneut abrufen" : "Correction understood—retrieve again later"}
            </button>
          )}
        </div>
      )}
    </Panel>
  );
}

function SettingsView({ user, refreshDashboard, theme, setTheme }) {
  const [nativeLanguage, setNativeLanguage] = useState(user.nativeLanguage || "de");
  const [learningMode, setLearningMode] = useState(user.learningMode || "home");
  const [languageStatus, setLanguageStatus] = useState("");
  const [savingPreference, setSavingPreference] = useState("");
  const german = nativeLanguage === "de";

  const saveNativeLanguage = async (value) => {
    const previous = nativeLanguage;
    setNativeLanguage(value);
    setSavingPreference("language");
    setLanguageStatus(value === "de" ? "Wird gespeichert..." : "Saving...");
    try {
      await api("/api/preferences", { method: "PATCH", body: { nativeLanguage: value } });
      await refreshDashboard?.({ silent: true });
      setLanguageStatus(value === "de" ? "Gespeichert" : "Saved");
    } catch (error) {
      setNativeLanguage(previous);
      setLanguageStatus(value === "de" ? "Konnte nicht gespeichert werden" : "Could not save");
    } finally {
      setSavingPreference("");
    }
  };

  const saveLearningMode = async (value) => {
    const previous = learningMode;
    setLearningMode(value);
    setSavingPreference("environment");
    setLanguageStatus(german ? "Wird gespeichert..." : "Saving...");
    try {
      await api("/api/preferences", { method: "PATCH", body: { learningMode: value } });
      await refreshDashboard?.({ silent: true });
      setLanguageStatus(german ? "Gespeichert" : "Saved");
    } catch (error) {
      setLearningMode(previous);
      setLanguageStatus(german ? "Konnte nicht gespeichert werden" : "Could not save");
    } finally {
      setSavingPreference("");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-5">
      <Panel title={german ? "Profil" : "Profile"} icon={Users}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <InfoTile label={german ? "Name" : "Name"} value={user.name} />
          <InfoTile label={german ? "E-Mail" : "Email"} value={user.email} />
        </div>
      </Panel>
      <Panel title={german ? "Darstellung" : "Appearance"} icon={theme === "dark" ? Moon : Sun}>
        <p className="mb-4 text-sm font-semibold leading-6 text-slate-600">{german ? "Wähle die Darstellung, in der längere Erklärungen und Übungen für dich angenehm lesbar bleiben." : "Choose the appearance that keeps longer explanations and exercises comfortable to read."}</p>
        <div className="flex rounded-lg border border-stone-200 bg-stone-50 p-1 text-sm font-black">
          {[
            { value: "light", label: german ? "Hell" : "Light", icon: Sun },
            { value: "dark", label: german ? "Dunkel" : "Dark", icon: Moon }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              aria-pressed={theme === option.value}
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
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
        <p className="font-black text-sky-950">{german ? "Spanisch bleibt immer die Zielsprache" : "Spanish always remains the target language"}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-sky-900">{german ? "Die Brückensprache verändert Erklärungen und Bedeutungen – niemals die spanischen Beispiele, Aussprachemodelle oder Antworten." : "The bridge language changes explanations and meanings, never the Spanish examples, pronunciation models, or answers."}</p>
      </div>
      </div>

      <Panel title={german ? "Lernpräferenzen" : "Learning preferences"} icon={Settings} action={languageStatus && <span aria-live="polite" className="text-xs font-black text-lagoon-700">{languageStatus}</span>}>
        <div className="grid gap-3">
          <div className="rounded-lg border border-stone-200 p-4">
            <p className="font-black text-slate-950">{german ? "Brückensprache" : "Bridge language"}</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{german ? "Deutsch ist der Standard für Erklärungen und Bedeutungen. Du kannst jederzeit bewusst auf Englisch wechseln." : "English is used for explanations and meanings. You can switch back to German at any time."}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[{ value: "de", label: "Deutsch" }, { value: "en", label: "English" }].map((option) => (
                <button key={option.value} disabled={Boolean(savingPreference)} aria-pressed={nativeLanguage === option.value} onClick={() => saveNativeLanguage(option.value)} className={classNames("rounded-md border px-3 py-3 font-black disabled:opacity-60", nativeLanguage === option.value ? "border-lagoon-400 bg-lagoon-50 text-lagoon-800" : "border-stone-200 bg-stone-50 text-slate-600")}>{option.label}{option.value === "de" && <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide opacity-70">{german ? "Standard" : "Default"}</span>}</button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-stone-200 p-4">
            <p className="font-black text-slate-950">{german ? "Lernumgebung" : "Learning environment"}</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{german ? "Wechsle jederzeit zwischen vollständigem Sprachtraining und lautlosem Lernen unterwegs. Dein Fortschritt bleibt derselbe." : "Switch between full language training and silent learning at any time. Your progress stays intact."}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button disabled={Boolean(savingPreference)} aria-pressed={learningMode === "home"} onClick={() => saveLearningMode("home")} className={classNames("rounded-md border p-4 text-left disabled:opacity-60", learningMode === "home" ? "border-lagoon-400 bg-lagoon-50" : "border-stone-200 bg-stone-50")}><span className="flex items-center gap-2 font-black"><Volume2 size={18} /> {german ? "Zu Hause" : "At home"}</span><span className="mt-2 block text-xs font-semibold leading-5 text-slate-500">{german ? "Hören, Nachsprechen und Mikrofon nach eigener Aktion verwenden" : "Listen, repeat, and use the microphone when you choose"}</span></button>
              <button disabled={Boolean(savingPreference)} aria-pressed={learningMode === "quiet"} onClick={() => saveLearningMode("quiet")} className={classNames("rounded-md border p-4 text-left disabled:opacity-60", learningMode === "quiet" ? "border-coral-400 bg-coral-50" : "border-stone-200 bg-stone-50")}><span className="flex items-center gap-2 font-black"><BookOpen size={18} /> {german ? "Unterwegs / leise" : "Quiet / on the go"}</span><span className="mt-2 block text-xs font-semibold leading-5 text-slate-500">{german ? "Lesen, Tippen und Wortbausteine; Audio und Mikrofon bleiben aus" : "Read, type, and build sentences; audio and microphone stay off"}</span></button>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><p className="font-black text-emerald-950">{german ? "Was automatisch erhalten bleibt" : "What is always preserved"}</p><div className="mt-3 grid gap-2 text-sm font-semibold text-emerald-900"><p className="flex gap-2"><CheckCircle2 className="mt-0.5 shrink-0" size={16} /> {german ? "Lektionsfortschritt und fällige Wiederholungen" : "Lesson progress and scheduled reviews"}</p><p className="flex gap-2"><CheckCircle2 className="mt-0.5 shrink-0" size={16} /> {german ? "Antworten, Abrufstärke und gespeicherte Wörter" : "Answers, retrieval strength, and saved words"}</p><p className="flex gap-2"><CheckCircle2 className="mt-0.5 shrink-0" size={16} /> {german ? "Spanische Zielsätze und Curriculumreihenfolge" : "Spanish target sentences and curriculum order"}</p></div></div>
        </div>
      </Panel>
    </div>
  );
}

function AdminForm({ title, icon: Icon, children, onSubmit, submitLabel = "Save" }) {
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
          <Plus size={17} /> {submitLabel}
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
      aria-current={active ? "page" : undefined}
      className={classNames(
        "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-bold transition",
        active
          ? "bg-gradient-to-br from-coral-500 to-coral-600 text-white shadow-glow"
          : "text-slate-600 hover:bg-stone-100 hover:text-slate-900"
      )}
    >
      <item.icon size={20} className={classNames("transition", !active && "text-slate-400 group-hover:text-coral-500")} />
      {item.label}
    </button>
  );
}

function TopMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 border-r border-stone-200 pr-5 last:border-r-0">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-coral-50 text-coral-500">
        <Icon size={20} />
      </span>
      <div className="leading-tight">
        <p className="text-lg font-black text-slate-900">{value}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function ProgressBar({ value, className, color = "bg-lagoon-500", label = "Lernfortschritt / learning progress" }) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(normalized)} className={classNames("h-2 overflow-hidden rounded-full bg-stone-200", className)}>
      <div className={classNames("h-full rounded-full", color)} style={{ width: `${normalized}%` }} />
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
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 font-bold text-slate-700 shadow-soft backdrop-blur">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-lagoon-50 text-lagoon-600">
        <Icon size={16} />
      </span>
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
      <div
        className={classNames(
          "grid place-items-center rounded-2xl bg-gradient-to-br from-coral-500 to-coral-600 font-black text-white shadow-glow ring-1 ring-white/30",
          large ? "h-14 w-14 text-2xl" : "h-11 w-11 text-xl"
        )}
      >
        ¡V
      </div>
      {!compact && (
        <div className="leading-none">
          <div className={classNames("font-black tracking-tight text-slate-900", large ? "text-4xl" : "text-2xl")}>
            Vamos
            <span className="text-coral-500">!</span>
          </div>
          <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-lagoon-600">Español</div>
        </div>
      )}
    </div>
  );
}

export default App;
