const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "App.jsx"), "utf8");
const dailySource = fs.readFileSync(path.join(__dirname, "daily-learning-core.mjs"), "utf8");
const homeSource = source.slice(source.indexOf("function NaturalLearningHome"), source.indexOf("function PracticePanel"));

test("the natural learning home localizes dynamic lesson and unit metadata", () => {
  assert.match(homeSource, /localizedLessonTitle\(plannedLesson, nativeLanguage\)/);
  assert.match(homeSource, /localizedUnit\(plannedLesson\?\.unit \|\| \{\}, nativeLanguage\)/);
  assert.doesNotMatch(homeSource, /Spanisch verstehen und benutzen: \$\{nextLesson\.title\}/);
});

test("the primary home action respects every daily-plan target", () => {
  assert.match(homeSource, /plannedLesson = plan\.target\?\.type === "lesson" \? lessons\.find/);
  assert.match(homeSource, /plan\.target\?\.type === "review"\) setActive\("review"\)/);
  assert.match(homeSource, /plan\.target\?\.type === "challenge"\) setActive\("challenges"\)/);
  assert.match(homeSource, /primaryActionLabel/);
});

test("the home promise, follow-up action, and learning cycle match today's real plan", () => {
  assert.match(homeSource, /naturalLearningHomeCopy\(/);
  assert.match(dailySource, /primaryTargetType === "review"[\s\S]*?Heute festigen: fällige Wörter und Satzmuster/);
  assert.match(dailySource, /Heute kommt kein unnötiger neuer Stoff dazu/);
  assert.match(homeSource, /secondaryActionLabel/);
  assert.match(homeSource, /onClick=\{startSecondary\}/);
  assert.match(homeSource, /Danach: \$\{secondaryLessonTitle/);
  assert.match(homeSource, /quiet[\s\S]*?2\. Klangbild vorbereiten/);
  assert.match(homeSource, /quiet[\s\S]*?4\. Leise anwenden/);
  assert.match(dailySource, /Hören und Sprechen kehren zu Hause zurück/);
  assert.match(dailySource, /primaryTargetType === "review" \? "So läuft deine Wiederholung"/);
  assert.match(homeSource, /const reviewCycle = german \? \[/);
  assert.match(homeSource, /1\. Ohne Modell starten/);
  assert.match(homeSource, /4\. Unsicheres korrigieren/);
  assert.match(homeSource, /5\. Nächsten Abstand planen/);
  assert.match(homeSource, /const reinforcementCycle = german \? \[/);
  assert.match(homeSource, /2\. Abrufformen wechseln/);
  assert.match(homeSource, /const cycle = primaryTargetType === "review" \? reviewCycle : primaryTargetType === "challenge" \? reinforcementCycle : lessonCycle/);
});

test("the home shows evidence for the adaptive daily-plan decision", () => {
  assert.match(homeSource, /planDiagnosis = plan\.diagnosis \|\| review\.diagnostics/);
  assert.match(homeSource, /dailyPlanDiagnosticChips/);
  assert.match(homeSource, /Gründe für den heutigen Lernplan/);
  assert.match(homeSource, /planDiagnosticChips\.map/);
  assert.match(dailySource, /recurring_mistake/);
  assert.match(dailySource, /overdue_review/);
});

test("the optional skill balance follows evidence without replacing the main plan", () => {
  assert.match(homeSource, /skillBalance = dashboard\.stats\?\.skillBalance/);
  assert.match(homeSource, /Optional nach deinem heutigen Hauptziel/);
  assert.match(homeSource, /verändert weder die Kursreihenfolge noch die Priorität fälliger Wiederholungen/);
  assert.match(homeSource, /\(skillBalance\.exercise \|\| deferredLessonListening\) && !skillBalance\.quietDeferred/);
  assert.match(homeSource, /source="REVIEW"/);
  assert.match(homeSource, /deferredListeningCopy/);
  assert.match(dailySource, /Der Auftrag bleibt gespeichert/);
  assert.match(homeSource, /\(skillBalance\?\.exercise \|\| deferredLessonListening\) && !skillBalance\.quietDeferred\) setSkillPracticeOpen\(true\)/);
});
