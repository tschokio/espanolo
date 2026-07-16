const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const appSource = readFileSync(path.join(__dirname, "App.jsx"), "utf8");
const stylesSource = readFileSync(path.join(__dirname, "styles.css"), "utf8");
const mobileNavigationSource = readFileSync(path.join(__dirname, "MobileNavigation.jsx"), "utf8");

test("the application shell supports keyboard navigation and announced loading states", () => {
  assert.match(appSource, /href="#main-content" className="skip-link"/);
  assert.match(appSource, /<main id="main-content" tabIndex=\{-1\}/);
  assert.match(appSource, /aria-label=\{german \? "Hauptnavigation"/);
  assert.match(appSource, /aria-current=\{active \? "page" : undefined\}/);
  assert.match(appSource, /role="alert" className="mb-4/);
  assert.match(appSource, /role="status" aria-live="polite" className="flex items-center/);
});

test("mobile navigation keeps five stable targets and exposes an accessible more dialog", () => {
  const mobile = mobileNavigationSource;

  assert.match(appSource, /<MobileNavigation[\s\S]*?reviewDue=\{dashboard\?\.review\?\.counts\?\.total \|\| 0\}/);
  assert.match(mobile, /const primaryOrder = \["learn", "review", "talk", "words"\]/);
  assert.match(mobile, /grid grid-cols-5/);
  assert.doesNotMatch(mobile, /overflow-x-auto/);
  assert.match(mobile, /role="dialog"/);
  assert.match(mobile, /aria-modal="true"/);
  assert.match(mobile, /aria-expanded=\{moreOpen\}/);
  assert.match(mobile, /aria-controls="mobile-more-navigation"/);
  assert.match(mobile, /event\.key !== "Escape"/);
  assert.match(mobile, /firstMoreItemRef\.current\?\.focus\(\)/);
  assert.match(mobile, /Wiederholungen fällig/);
  assert.match(mobile, /env\(safe-area-inset-bottom\)/);
});

test("focused lessons keep the new step in view without ignoring reduced-motion preferences", () => {
  assert.match(appSource, /const sessionTopRef = useRef\(null\)/);
  assert.match(appSource, /prefers-reduced-motion: reduce/);
  assert.match(appSource, /node\.focus\(\{ preventScroll: true \}\)/);
  assert.match(appSource, /node\.scrollIntoView\(\{ behavior: reduceMotion \? "auto" : "smooth"/);
  assert.match(appSource, /sticky top-\[4\.5rem\]/);
  assert.match(stylesSource, /@media \(prefers-reduced-motion: reduce\)/);
});

test("mobile lessons keep the active stage visible in a compact accessible rail", () => {
  assert.match(appSource, /const currentStageLabel = current\?\.type === "overview"/);
  assert.match(appSource, /lesson-session-rail sticky top-\[4\.5rem\]/);
  assert.match(appSource, /Orientierung in der Lerneinheit/);
  assert.match(appSource, /Schritt \$\{currentStageNumber\} von \$\{totalSteps\}/);
  assert.match(appSource, /min-h-11 min-w-11/);
  assert.match(appSource, /<span className="hidden sm:inline">/);
  assert.match(appSource, /\{quiet && <span[\s\S]*?Leise/);
  assert.match(appSource, /aria-label=\{nativeLanguage === "de" \? "Lernphasen"/);
  assert.match(appSource, /aria-current=\{phase\.state === "active" \? "step" : undefined\}/);
  assert.match(appSource, /phase\.state === "complete" \? "✓"/);
  assert.match(appSource, /<span className="hidden truncate sm:block">\{phase\.label\}<\/span>/);
});

test("learning progress, checks, and feedback expose semantic status", () => {
  assert.match(appSource, /role="progressbar" aria-label=\{label\}/);
  assert.match(appSource, /aria-valuenow=\{Math\.round\(normalized\)\}/);
  assert.match(appSource, /role="radiogroup" aria-label=\{german \? "Antwortmöglichkeiten"/);
  assert.match(appSource, /role="radio" aria-checked=\{selected === index\}/);
  assert.match(appSource, /role="radio"\s*\n\s*aria-checked=\{selected\}/);
  assert.match(appSource, /role=\{isSubmissionError \? "alert" : "status"\}/);
  assert.match(appSource, /aria-label=\{german \? "Spanische Antwort"/);
  assert.match(appSource, /aria-label=\{german \? "Spanische Zusammenfassung"/);
});

test("lesson errors pause for reflection instead of disappearing on a timer", () => {
  const lessonStart = appSource.indexOf("function FocusedLessonSession");
  const lessonEnd = appSource.indexOf("function LessonReadingLab", lessonStart);
  const focusedLesson = appSource.slice(lessonStart, lessonEnd);
  assert.match(focusedLesson, /autoAdvanceOnWrong=\{false\}/);
  assert.match(focusedLesson, /requireCorrectToContinue/);
  assert.match(focusedLesson, /onReset=\{\(\) => setResultBanner\(null\)\}/);
});
