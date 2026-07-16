const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const appSource = readFileSync(path.join(__dirname, "App.jsx"), "utf8");
const conversationSource = readFileSync(path.join(__dirname, "ConversationWorkspace.jsx"), "utf8");
const progressSource = readFileSync(path.join(__dirname, "ProgressWorkspace.jsx"), "utf8");
const lessonVocabularyLabSource = readFileSync(path.join(__dirname, "LessonVocabularyLab.jsx"), "utf8");
const dailyLearningSource = readFileSync(path.join(__dirname, "daily-learning-core.mjs"), "utf8");

test("foundation examples contain Spanish target text rather than English explanations", async () => {
  const teachingCards = appSource.match(/const topicTeachingCards = ([\s\S]*?)\nconst topicRememberPoints/)?.[1] || "";
  const localizationSource = readFileSync(path.join(__dirname, "foundation-card-localization.mjs"), "utf8");
  const supplementalCards = localizationSource.match(/export const supplementalTopicTeachingCards = ([\s\S]*?)\nconst GERMAN_FOUNDATION_CARD_COPY/)?.[1] || "";
  const examples = [...`${teachingCards}\n${supplementalCards}`.matchAll(/example:\s*"([^"]+)"/g)].map((match) => match[1]);
  const { looksLikeEnglishLearningText } = await import("./exercise-question-localization.mjs");

  assert.ok(examples.length >= 20, "expected the authored foundation examples");
  for (const example of examples) {
    assert.equal(looksLikeEnglishLearningText(example), false, `foundation example must stay in Spanish: ${example}`);
  }
});

test("learning examples have a runtime target-language guard", () => {
  const helper = readFileSync(path.join(__dirname, "spanish-content-core.mjs"), "utf8");
  const foundation = appSource.slice(appSource.indexOf("function LessonFoundationGuide"), appSource.indexOf("function GermanLessonBridge"));

  assert.match(helper, /looksLikeEnglishLearningText\(example\)/);
  assert.match(helper, /looksLikeEnglishLearningText\(spanishFallback\)/);
  assert.match(foundation, /const visibleExample = spanishLearningExample\(card\.example, lesson\?\.sentences\?\.\[index\]\?\.spanish\)/);
  assert.match(foundation, /PronunciationTools text=\{visibleExample\}/);
  assert.doesNotMatch(foundation, /PronunciationTools text=\{card\.example\}/);
});

test("vocabulary examples and context checks use the same Spanish-only guard", () => {
  const wordSession = readFileSync(path.join(__dirname, "word-session-core.mjs"), "utf8");

  assert.match(lessonVocabularyLabSource, /spanishLearningExample\(word\.example\)/);
  assert.match(appSource, /withSpanishLearningExample\(word\)/);
  assert.doesNotMatch(appSource, />\{word\.example\}<\/p>/);
  assert.match(wordSession, /const example = spanishLearningExample\(word\?\.example\)/);
});

test("the active app no longer contains the obsolete English-first lesson screen", () => {
  assert.doesNotMatch(appSource, /function LessonsView/);
  assert.doesNotMatch(appSource, /function DashboardView/);
  assert.doesNotMatch(appSource, /function CurrentLessonCard/);
  assert.doesNotMatch(appSource, /function LessonGuidePanel/);
  assert.doesNotMatch(appSource, /function StatsCard/);
  assert.doesNotMatch(appSource, /function BadgesCard/);
  assert.doesNotMatch(appSource, /function CefrCard/);
  assert.doesNotMatch(appSource, />\{sentence\.english\}<\/p>/);
  assert.doesNotMatch(appSource, />\{word\.english\}<\/p>/);
});

test("German conversation mode does not expose raw English teaching metadata", () => {
  assert.match(conversationSource, /conversationUi\(node\.prompt, nativeLanguage\)/);
  assert.match(conversationSource, /conversationSkill\(reply\.skill, nativeLanguage\)/);
  assert.match(conversationSource, /nativeLanguage === "de"\s*\? "Satzanfang"/);
  assert.match(conversationSource, /nativeLanguage === "de"\s*\? "Nützliche Wörter"/);
  assert.match(conversationSource, /nativeLanguage === "de"\s*\? "Antworten zeigen"/);
});

test("authored conversations preserve honest guided, independent, and spoken evidence", () => {
  const conversation = conversationSource;
  assert.match(conversation, /mode: "authored-conversation"/);
  assert.match(conversation, /skill: "conversation"/);
  assert.match(conversation, /inputMethod === "speech"[\s\S]*?skill: "speaking"/);
  assert.match(conversation, /usedSupport = mode === "learn" \|\| hintLevel > 0 \|\| inputMethod === "selection"/);
  assert.match(conversation, /sessionEvidence\.independent/);
  assert.match(conversation, /sessionEvidence\.supported/);
  assert.match(conversation, /sessionEvidence\.spoken/);
  assert.match(conversation, /message\.speaker \|\|/);
  assert.doesNotMatch(conversation, /: "Lucía"/);
  assert.match(appSource, /lazy\(\(\) => import\("\.\/ConversationWorkspace\.jsx"\)\)/);
  assert.match(appSource, /Gesprächswege werden geladen/);
  assert.match(appSource, /Gesprächstraining konnte nicht geladen werden/);
});

test("the speaking lab uses its complete German-first localization layer", () => {
  assert.match(appSource, /localizedSpeakingMeaning\(current, nativeLanguage\)/);
  assert.match(appSource, /localizedSpeakingTag\(tag, nativeLanguage\)/);
  assert.doesNotMatch(appSource, /\[tag\] \|\| "Sprechtraining"/);
});

test("word catch is German-first and reinforces only introduced vocabulary", () => {
  const game = appSource.slice(appSource.indexOf("function WordCatcherGame"), appSource.indexOf("function nextRoundNumber"));
  assert.match(game, /eligibleWordCatcherWords\(data\.groups\)/);
  assert.match(game, /wordCatcherCopy\(nativeLanguage\)/);
  assert.match(game, /label=\{copy\.score\}/);
  assert.match(game, /\{copy\.replay\}/);
  assert.doesNotMatch(game, /title="Word Catch"/);
});

test("optional games and scenarios reinforce only content introduced through the course", () => {
  const scenarios = appSource.slice(appSource.indexOf("function ScenarioPracticeView"), appSource.indexOf("function ScenarioTurnHistory"));
  const games = appSource.slice(appSource.indexOf("function MiniGamesView"), appSource.indexOf("function inferConjugationMeta"));
  const conjugation = appSource.slice(appSource.indexOf("function ConjugationTrainer"), appSource.indexOf("function PracticeMiniGameRound"));
  const challenge = appSource.slice(appSource.indexOf("function ChallengesView"), appSource.indexOf("function ConceptRepairBrief"));

  assert.match(scenarios, /filter\(\(lesson\) => !lesson\.isLocked && lesson\.progress > 0\)/);
  assert.match(scenarios, /späteren Stoff vorwegzunehmen/);
  assert.match(scenarios, /autoAdvanceOnWrong=\{false\}/);
  assert.match(scenarios, /requireCorrectToContinue/);
  assert.match(games, /\/api\/practice\/exercises\?type=\$\{preferredType\}/);
  assert.doesNotMatch(games, /Promise\.all\(dashboard\.lessons/);
  assert.match(conjugation, /\/api\/practice\/exercises\?type=CONJUGATION/);
  assert.doesNotMatch(conjugation, /Promise\.all\(lessons\.map/);
  assert.match(challenge, /challenge\.locked/);
  assert.match(challenge, /zieht aber keinen späteren Stoff vor/);
  assert.match(challenge, /autoAdvanceOnWrong=\{false\}/);
  assert.match(challenge, /requireCorrectToContinue/);
});

test("optional input labs cannot bypass the guided course sequence", () => {
  const lab = appSource.slice(appSource.indexOf("function ReadingListeningLabView"), appSource.indexOf("function MiniGamesView"));

  assert.match(lab, /filter\(\(lesson\) => !lesson\.isLocked && lesson\.progress > 0\)/);
  assert.match(lab, /Unbekannte Texte bleiben im Lernweg/);
});

test("locked course cards explain the exact next package instead of exposing a dead end", () => {
  const localization = appSource.slice(appSource.indexOf("function localizedLockedReason"), appSource.indexOf("const germanScenarioMetadata"));
  const cards = appSource.slice(appSource.indexOf("function CourseLessonRow"), appSource.indexOf("function FocusedLessonSession"));

  assert.match(localization, /unlockState\?\.blockingLesson/);
  assert.match(localization, /Als Nächstes/);
  assert.match(localization, /localizedLessonTitle\(blockingLesson, nativeLanguage\)/);
  assert.match(cards, /Öffnet sich im geführten Lernweg/);
  assert.doesNotMatch(cards, /Checkpoint opens after the unit lessons/);
});

test("word learning uses German metadata and makes quiet mode truly silent", () => {
  assert.match(appSource, /localizedWordGroupTitle\(group, nativeLanguage\)/);
  assert.match(appSource, /localizedWordGrammar\(word\.partOfSpeech, nativeLanguage\)/);
  assert.match(appSource, /"b1-conversation-stories": "B1 · Gespräch und Geschichten"/);
  assert.match(appSource, /"b1-plans-reactions": "B1 · Pläne und Reaktionen"/);
  assert.match(appSource, /"b2-discourse-reporting": "B2 · Diskurs und Bericht"/);
  assert.match(appSource, /"b2-complex-structures": "B2 · Komplexe Strukturen"/);
  assert.match(appSource, /"c1-register-argument": "C1 · Register und Argumentation"/);
  assert.match(appSource, /"c1-narrative-interaction": "C1 · Erzählen und Interaktion"/);
  assert.match(appSource, /"c2-precision-mediation-vocabulary": "C2 · Präzision und Mediation"/);
  assert.match(appSource, /"c2-rhetoric-variation-vocabulary": "C2 · Rhetorik und Sprachvariation"/);
  assert.match(appSource, /localizedReviewState\(word\.review\.state, nativeLanguage\)/);
  assert.match(appSource, /WordLearnerView refreshDashboard=\{refreshDashboard\} nativeLanguage=\{nativeLanguage\} quiet=\{quiet\}/);
  assert.match(appSource, /!quiet && <PronunciationTools text=\{word\.spanish\}/);
  assert.match(appSource, /\? "native-es" : "es-native"/);
  assert.match(appSource, /\["recognition", "flashcard"\]\.includes\(activeMode\) && german/);
  assert.doesNotMatch(appSource, /mode: "en-es"/);
  assert.doesNotMatch(appSource, /<Panel title="Vocabulary Decks"/);
  assert.doesNotMatch(appSource, />Session complete</);
});

test("fresh lesson vocabulary is understood, recognized, and produced before spaced review", () => {
  const focusedLesson = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function A1ContextBridgeLab"));
  assert.match(focusedLesson, /buildLessonVocabularyLab\([\s\S]*?\(lesson\.learningWords \|\| \[\]\)\.map\(\(word\) => withSpanishLearningExample\(word\)\)/);
  assert.match(focusedLesson, /\.\.\.\(soundLabStep \? \[soundLabStep\] : \[\]\), \.\.\.\(vocabularyStep \? \[vocabularyStep\] : \[\]\), \.\.\.\(readingStep/);
  assert.match(focusedLesson, /current\.type === "vocabulary"/);
  assert.match(focusedLesson, /PronunciationComponent=\{PronunciationTools\}/);
  assert.match(focusedLesson, /SpeakCheckComponent=\{SpeakCheck\}/);
  assert.match(focusedLesson, /SpanishCharacterComponent=\{SpanishCharacterBar\}/);
  assert.match(lessonVocabularyLabSource, /Wörter im Zusammenhang erschließen/);
  assert.match(lessonVocabularyLabSource, /Schneller Bedeutungscheck/);
  assert.match(lessonVocabularyLabSource, /Aktiver Wortabruf/);
  assert.match(lessonVocabularyLabSource, /evaluateModelSentenceRecall\(answer, lab\.productionTarget\.spanish\)/);
  assert.match(lessonVocabularyLabSource, /modelSentenceRecallIsComplete\(productionResult, \{ requireExactOrthography: true \}\)/);
  assert.match(lessonVocabularyLabSource, /SpanishCharacterComponent value=\{answer\}/);
  assert.match(lessonVocabularyLabSource, /!checked && !quiet && SpeakCheckComponent/);
  assert.match(lessonVocabularyLabSource, /Erst dann gelangen diese Wörter in die zeitversetzte Wiederholung/);
  assert.match(lessonVocabularyLabSource, /Modell wieder verstecken und neu versuchen/);
});

test("connected reading requires comprehension and Spanish recall before continuing", () => {
  assert.match(appSource, /lesson\.readingJson\?\.paragraphs\?\.length/);
  assert.match(appSource, /function LessonReadingLab/);
  assert.match(appSource, /setRecall\(true\)/);
  assert.match(appSource, /content\.modelSummary/);
  assert.match(appSource, /!quiet && !listening && <div className="mt-4"><PronunciationTools text=\{passage\}/);
});

test("connected recall requires a real attempt and an explicit model comparison", () => {
  const start = appSource.indexOf("function LessonReadingLab");
  const end = appSource.indexOf("function LessonPatternLab", start);
  const readingLab = appSource.slice(start, end);
  assert.match(readingLab, /evaluateRecallSummary\(summary, content\?\.modelSummary/);
  assert.match(readingLab, /disabled=\{!recallEvaluation\.effortEnough\}/);
  assert.match(readingLab, /mindestens vier spanische Wörter/);
  assert.match(readingLab, /Das ist keine Bedeutungsnote/);
  assert.match(readingLab, /Noch unsicher – Modell schließen und neu versuchen/);
  assert.match(readingLab, /Inhalt getroffen – mit Satzmustern weiter/);
  assert.doesNotMatch(readingLab, /button onClick=\{onContinue\}[^>]*>\{german \? "Mit den Satzmustern weiter"/);
});

test("connected listening hides its transcript and falls back to reading in quiet mode", () => {
  assert.match(appSource, /content\?\.inputMode === "listening"/);
  assert.match(appSource, /Das Transkript bleibt bis nach deiner eigenen Zusammenfassung verborgen/);
  assert.match(appSource, /Leisemodus: Dieser Hörinhalt wird heute als Lesetext geübt/);
  assert.match(appSource, /Transkript jetzt zum genauen Vergleich öffnen/);
  assert.match(appSource, /function ConnectedSpeechPlayer/);
  assert.match(appSource, /ConnectedSpeechPlayer[\s\S]*?text=\{passage\}[\s\S]*?onComplete=\{\(\) => setListeningCompleted\(true\)\}/);
  assert.match(appSource, /Wiedergabe gestoppt/);
  assert.match(appSource, /Hördurchgang beendet/);
  assert.match(appSource, /question && \(!listening \|\| quiet \|\| listeningCompleted \|\| audioUnavailable\)/);
  assert.match(appSource, /Erst hören, dann prüfen/);
  assert.match(appSource, /Audio ist hier nicht verfügbar – arbeite mit dem vollständigen Lesetext weiter/);
});

test("connected listening unlocks hidden section replay after a full attempt", () => {
  const start = appSource.indexOf("function ConnectedSpeechPlayer");
  const end = appSource.indexOf("function AnswerChoices", start);
  const player = appSource.slice(start, end);
  assert.match(player, /const chunks = useMemo/);
  assert.match(player, /playCount > 0 && chunks\.length > 1/);
  assert.match(player, /Gezielt nachhören – Text bleibt verborgen/);
  assert.match(player, /play\(0\.82, \[chunks\[focusIndex\]\], false\)/);
  assert.match(player, /if \(completePass\) onComplete\?\.\(\)/);
  assert.match(player, /onUnavailable\?\.\(\)/);
  assert.doesNotMatch(player, /\{chunks\[focusIndex\]\}/, "focused replay must not reveal the transcript text");
});

test("German lesson practice localizes answer choices and input controls", () => {
  assert.match(appSource, /import \{ germanExerciseQuestion, looksLikeEnglishLearningText \} from "\.\/exercise-question-localization\.mjs"/);
  assert.match(appSource, /const translated = germanExerciseQuestion\(exercise\?\.questionText\)/);
  assert.match(appSource, /Diese Bedeutungsoption muss noch auf Deutsch ergänzt werden\./);
  assert.match(appSource, /randomizedOptions\.map\(\(option\) => localizedExerciseOption\(option, nativeLanguage\)\)/);
  assert.match(appSource, /function AnswerChoices\(\{ exercise, answer, setAnswer, nativeLanguage = "de"/);
  assert.match(appSource, /Antwort auf Spanisch/);
  assert.match(appSource, /Stattdessen selbst eingeben/);
  assert.match(appSource, /Baue den spanischen Satz hier auf/);
  assert.match(appSource, /Because movies are plural\.\": \"Weil películas in der Mehrzahl steht\./);
});

test("open production shows function goals without revealing accepted phrases", () => {
  const practice = appSource.slice(appSource.indexOf("function PracticePanel"), appSource.indexOf("function FeedbackFact"));

  assert.match(practice, /exercise\.functionalGoals\?\.groups\?\.length/);
  assert.match(practice, /Darauf kommt es an/);
  assert.match(practice, /die genaue Formulierung bestimmst du selbst/);
  assert.doesNotMatch(practice, /goal\.any/);
});

test("the UI distinguishes exact model recall from genuinely open production", () => {
  const prompts = appSource.slice(appSource.indexOf("function germanExercisePrompt"), appSource.indexOf("function germanFeedbackMessage"));
  const practice = appSource.slice(appSource.indexOf("function PracticePanel"), appSource.indexOf("function FeedbackFact"));

  assert.match(prompts, /functional \? "Formuliere eine eigene passende Antwort auf Spanisch" : "Rufe den passenden spanischen Modellsatz ab"/);
  assert.match(prompts, /Natürliche Varianten werden nur dann frei bewertet, wenn Funktionsziele sichtbar sind/);
  assert.match(prompts, /return "Retrieve the learned Spanish model"/);
  assert.match(prompts, /Open variants are used only when function goals are visible/);
  assert.match(practice, /exercise\.functionalGoals\?\.groups\?\.length \? "Freie Antwort" : "Modellsatz"/);
  assert.match(practice, /exercise\.functionalGoals\?\.groups\?\.length > 0/);
});

test("wrong model recall highlights one concrete repair before the retry", () => {
  const practice = appSource.slice(appSource.indexOf("function PracticePanel"), appSource.indexOf("function FeedbackFact"));
  const correction = appSource.slice(appSource.indexOf("function correctionFocusMessage"), appSource.indexOf("function localizedReviewMoment"));

  assert.match(practice, /<CorrectionFocusCard/);
  assert.match(practice, /!feedback\.correct && !feedback\.functionalCheck/);
  assert.match(correction, /Korrigiere zuerst nur diese Stelle/);
  assert.match(correction, /Fehlendes Wort an Stelle/);
  assert.match(correction, /Zusätzliches Wort/);
  assert.match(correction, /Erster Unterschied an Stelle/);
  assert.match(correction, /focus\.expectedToken/);
});

test("quiet lesson practice keeps free dialogue answers text-only", () => {
  assert.match(appSource, /<AnswerChoices[\s\S]*?nativeLanguage=\{nativeLanguage\}[\s\S]*?quiet=\{quiet\}/);
  assert.match(appSource, /function AnswerChoices\(\{ exercise, answer, setAnswer, nativeLanguage = "de", quiet = false/);
  const start = appSource.indexOf("function AnswerChoices");
  const end = appSource.indexOf("function ", start + 20);
  const answerChoices = appSource.slice(start, end);
  assert.match(answerChoices, /!disabled && !quiet && <SpeakCheck onTranscript=\{onSpeechTranscript \|\| setAnswer\} compact nativeLanguage=\{nativeLanguage\}/);
});

test("German is the safe default and lesson previews never render an untranslated prompt", () => {
  assert.doesNotMatch(appSource, /nativeLanguage = "en"/, "user-facing learning components must default to German");
  assert.match(appSource, /localizedExercisePrompt\(target\.exercise, nativeLanguage\)/);
  assert.match(appSource, /function germanExercisePrompt\(exercise\)/);
  assert.match(appSource, /return labels\[exercise\?\.type\] \|\| "Wende das gelernte Muster an"/);
});

test("the separate input lab follows German-first and quiet-mode learning rules", () => {
  assert.match(appSource, /function ReadingListeningLabView\(\{ dashboard, refreshDashboard \}\) \{[\s\S]*?const nativeLanguage = dashboard\.user\?\.nativeLanguage \|\| "de"/);
  assert.match(appSource, /Erster Hörversuch ohne Transkript/);
  assert.match(appSource, /Leisemodus: Nutze diesen Inhalt heute als Lesetext\./);
  assert.match(appSource, /ConnectedSpeechPlayer text=\{transcript\} nativeLanguage=\{nativeLanguage\}/);
  assert.match(appSource, /nativeMeaning\(sentence\.english, nativeLanguage\)/);
  assert.match(appSource, /localizedWordMeaning\(word, nativeLanguage\)/);
  assert.match(appSource, /nativeLanguage=\{nativeLanguage\}[\s\S]*?quiet=\{quiet\}[\s\S]*?completeTitle=\{german \? "Training abgeschlossen"/);
});

test("shared exercise queues propagate language and quiet-mode preferences", () => {
  assert.match(appSource, /function ExerciseQueue\(\{[\s\S]*?nativeLanguage = "de",[\s\S]*?quiet = false/);
  assert.match(appSource, /<QuizResultBanner result=\{lastResult\} nativeLanguage=\{nativeLanguage\}/);
  assert.match(appSource, /exercise=\{current\}[\s\S]*?nativeLanguage=\{nativeLanguage\}[\s\S]*?quiet=\{quiet\}/);
});

test("pronunciation controls are German-first without disabling optional English", () => {
  assert.match(appSource, /function PronunciationTools\(\{ text, compact = false, hideTextInTitle = false, allowCopy = true, nativeLanguage = "de" \}\)/);
  assert.match(appSource, /german \? "Anhören" : "Listen"/);
  assert.match(appSource, /german \? "Kopieren" : "Copy"/);
  assert.match(appSource, /<SpeakCheck target=\{text\} compact=\{compact\} nativeLanguage=\{nativeLanguage\}/);
  assert.match(appSource, /PronunciationTools text=\{passage\} compact allowCopy=\{false\} nativeLanguage=\{nativeLanguage\}/);
  assert.match(appSource, /PronunciationTools text=\{word\.spanish\} nativeLanguage=\{nativeLanguage\}/);
  assert.match(appSource, /PronunciationTools text=\{exercise\.audioText\} hideTextInTitle allowCopy=\{false\} nativeLanguage=\{nativeLanguage\}/);
  assert.match(conversationSource, /PronunciationTools text=\{message\.text\} compact allowCopy=\{false\} nativeLanguage=\{nativeLanguage\}/);
});

test("pronunciation controls resolve provider availability before exposing provider-specific playback", () => {
  const audioHelpers = appSource.slice(appSource.indexOf("let activePronunciationAudio"), appSource.indexOf("function PronunciationLookupView"));
  const tools = appSource.slice(appSource.indexOf("function PronunciationTools"), appSource.indexOf("function ConnectedSpeechPlayer"));
  assert.match(audioHelpers, /const pronunciationAvailabilityRequests = new Map\(\)/);
  assert.match(audioHelpers, /new URLSearchParams\(\{ text, verify: "1" \}\)/);
  assert.match(audioHelpers, /if \(!fallbackTried && provider\)[\s\S]*?playPronunciationClip\(text, setAudioState\)/);
  assert.match(tools, /usePronunciationAvailability\(text, !compact\)/);
  assert.match(tools, /\["unavailable", "not_found"\]\.includes/);
  assert.match(tools, /disabled=\{providerUnavailable\("spanishdict"\) \|\| availability\.loading\}/);
  assert.match(tools, /disabled=\{providerUnavailable\("leo"\) \|\| availability\.loading\}/);
  assert.match(tools, /role="status" aria-live="polite"/);
  assert.match(tools, /Keine Audioquelle konnte abgespielt werden/);
});

test("the pronunciation lookup reports each provider separately and disables confirmed failures", () => {
  const lookup = appSource.slice(appSource.indexOf("function PronunciationLookupView"), appSource.indexOf("const SPEAKING_LIBRARY"));
  assert.match(lookup, /const providerAvailability = result\?\.providers/);
  assert.match(lookup, /Verfügbarkeit je Anbieter/);
  assert.match(lookup, /providerAvailability\.map/);
  assert.match(lookup, /source\.availability === "unavailable"/);
  assert.match(lookup, /Prüfung unsicher/);
  assert.match(lookup, /Keine Aufnahme/);
});

test("the grammar tab is an actionable German-first skill map", () => {
  assert.match(appSource, /function GrammarView\(\{ dashboard, onStartLesson \}\)/);
  assert.match(appSource, /Deine Kompetenzkarte/);
  assert.match(appSource, /localizedUnit\(unit, nativeLanguage\)/);
  assert.match(appSource, /localizedLessonTitle\(lesson, nativeLanguage\)/);
  assert.match(appSource, /Aktiver Abruf ist fällig/);
  assert.match(appSource, /Nächsten sinnvollen Schritt öffnen/);
  assert.match(appSource, /disabled=\{lesson\.isLocked\}/);
  assert.doesNotMatch(appSource, /<Panel title="Grammar Map"/);
  assert.doesNotMatch(appSource, /topicLessons\[0\]\.topic\.description/);
});

test("the grammar map launches the focused lesson through the course workspace", () => {
  assert.match(appSource, /<GrammarView[\s\S]*?dashboard=\{dashboard\}[\s\S]*?setLaunchLessonId\(lessonId\);[\s\S]*?setTab\("course"\)/);
});

test("exercise scheduling distinguishes independent recall from supported recall", () => {
  assert.match(appSource, /quality: hintLevel > 0 \|\| needsCorrection \|\| correctionAttempt \|\| isQuietListeningAlternative \? "hard" : "good"/);
  assert.match(appSource, /usedSupport: hintLevel > 0 \|\| needsCorrection \|\| correctionAttempt/);
  assert.match(appSource, /correctionAttempt,/);
  assert.match(appSource, /practiceMode: isQuietListeningAlternative \? "quiet-alternative" : "home"/);
  assert.match(appSource, /responseTimeMs: Date\.now\(\) - attemptStartedAtRef\.current/);
  assert.match(appSource, /Mit Hilfe richtig gelöst: Der nächste Abruf kommt bewusst früher\./);
  assert.match(appSource, /Selbstständig abgerufen\./);
});

test("missed lesson and review answers require a corrected retrieval", () => {
  const practice = appSource.slice(appSource.indexOf("function PracticePanel"), appSource.indexOf("function FeedbackFact"));
  const review = appSource.slice(appSource.indexOf("function ReviewQueueView"), appSource.indexOf("function SettingsView"));
  assert.match(practice, /if \(!result\.correct\) setNeedsCorrection\(true\)/);
  assert.match(practice, /!requireCorrectToContinue &&/);
  assert.match(review, /source="REVIEW"[\s\S]*?autoAdvanceOnWrong=\{false\}[\s\S]*?requireCorrectToContinue/);
  assert.match(review, /if \(next\[index\] === undefined\) next\[index\] = Boolean\(result\.correct\)/);
  assert.match(review, /im ersten Versuch richtig/);
  assert.match(review, /quality: needsCorrection \? "hard" : "good"/);
  assert.match(review, /advanceReviewSession\(sessionItems, index, result\.correct\)/);
  assert.match(review, /Korrektur verstanden – später erneut abrufen/);
  assert.match(review, /Zeitlich getrennte Rückholung/);
  assert.match(review, /correctionAttempt=\{Boolean\(currentItem\.retry\)\}/);
});

test("progress focuses on learning evidence before optional gamification", () => {
  assert.match(progressSource, /function ProgressWorkspace\(\{ dashboard, nativeLanguage = "de"/);
  assert.match(progressSource, /Abrufstärke der letzten 14 Tage/);
  assert.match(progressSource, /Anteil selbstständiger erfolgreicher Abrufe/);
  assert.match(progressSource, /Dein Kompetenzbild · letzte 30 Tage/);
  assert.match(progressSource, /Diese Empfehlung folgt echten Antworten, nicht XP/);
  assert.match(progressSource, /Ausspracheerkennung zeigt Übungsevidenz, keine objektive Akzentnote/);
  assert.match(progressSource, /Fortschritt nach Sprachstufe/);
  assert.match(progressSource, /Fällige Wiederholungen zählen erst danach wieder als sicher\./);
  assert.match(progressSource, /Optionale XP-Rangliste anzeigen/);
  assert.doesNotMatch(progressSource, /<Panel title="Leaderboard" icon=\{Trophy\}>/);
  assert.match(appSource, /lazy\(\(\) => import\("\.\/ProgressWorkspace\.jsx"\)\)/);
  assert.match(appSource, /Lernnachweise werden geladen/);
});

test("skill evidence records the actual learning channel without blocking practice", () => {
  assert.match(appSource, /inputMethod: inputMethodRef\.current/);
  assert.match(appSource, /skill: heardAudio \? "listening" : "reading"/);
  assert.match(appSource, /skill: "speaking"/);
  assert.match(appSource, /api\("\/api\/practice-signals"/);
  assert.match(appSource, /\.catch\(\(\) => null\)/);
});

test("the profile workspace is German-first and passes language into progress", () => {
  assert.match(appSource, /title=\{german \? "Dein Lernstand" : "Your progress"\}/);
  assert.match(appSource, /label: german \? "Lernfortschritt" : "Progress"/);
  assert.match(appSource, /<ProgressView[\s\S]*?dashboard=\{dashboard\}[\s\S]*?nativeLanguage=\{user\?\.nativeLanguage \|\| "de"\}/);
});

test("settings expose only real persisted learning preferences", () => {
  assert.match(appSource, /Spanisch bleibt immer die Zielsprache/);
  assert.match(appSource, /Deutsch ist der Standard für Erklärungen und Bedeutungen\./);
  assert.match(appSource, /Audio und Mikrofon bleiben aus/);
  assert.match(appSource, /Was automatisch erhalten bleibt/);
  assert.match(appSource, /aria-pressed=\{nativeLanguage === option\.value\}/);
  assert.match(appSource, /aria-pressed=\{learningMode === "quiet"\}/);
  assert.match(appSource, /setNativeLanguage\(previous\)/);
  assert.match(appSource, /setLearningMode\(previous\)/);
  assert.doesNotMatch(appSource, /Daily challenge reminders/);
  assert.doesNotMatch(appSource, /Hard mode after streak day 7/);
});

test("German and English remain the only explicit bridge-language choices", () => {
  assert.match(appSource, /\[\{ value: "de", label: "Deutsch" \}, \{ value: "en", label: "English" \}\]/);
  assert.match(appSource, /body: \{ nativeLanguage: value \}/);
});

test("review starts with deliberate interleaving instead of discarding the server plan", () => {
  const review = appSource.slice(appSource.indexOf("function ReviewQueueView"), appSource.indexOf("function SettingsView"));
  assert.match(review, /interleaveReviewSessionItems\(reviewItems, sessionSeed\)/);
  assert.match(review, /Unsicherheiten, Satzmuster und Wörter wechseln sich gezielt ab/);
  assert.doesNotMatch(review, /setSessionItems\(shuffleItems\(reviewItems\)\)/);
  assert.match(progressSource, /retrieval\.corrected \|\| 0/);
  assert.match(progressSource, /nach einem Fehlversuch richtig/);
});

test("review explains diagnosed concepts and labels familiar contrast retrieval honestly", () => {
  const review = appSource.slice(appSource.indexOf("function ReviewQueueView"), appSource.indexOf("function ReviewWordQuizCard"));
  const repairBrief = appSource.slice(appSource.indexOf("function ConceptRepairBrief"), appSource.indexOf("function ReviewQueueView"));
  assert.match(review, /Erkannte Musterschwerpunkte/);
  assert.match(review, /concept\.targetCount[\s\S]*?Fehlversuche/);
  assert.match(review, /bereits bekannte Kontrastaufgabe/);
  assert.match(review, /currentItem\.relatedContrast \? "Verwandtes Muster unterscheiden"/);
  assert.match(review, /<ConceptRepairBrief concept=\{repairConcept\}/);
  assert.match(repairBrief, /30-Sekunden-Musterreparatur/);
  assert.match(repairBrief, /brief\.explanationDe/);
  assert.match(repairBrief, /brief\.decisionDe/);
  assert.match(repairBrief, /example\.spanish/);
  assert.match(repairBrief, /brief\.recallDe/);
  assert.match(repairBrief, /Leisemodus bleibt aktiv/);
});

test("review misses return after other due items while preserving the first-pass score", () => {
  const review = appSource.slice(appSource.indexOf("function ReviewQueueView"), appSource.indexOf("function ReviewWordQuizCard"));
  const wordReview = appSource.slice(appSource.indexOf("function ReviewWordQuizCard"), appSource.indexOf("function SettingsView"));

  assert.match(review, /setInitialItemCount\(plannedItems\.length\)/);
  assert.match(review, /advanceReviewSession\(sessionItems, index, result\.correct\)/);
  assert.match(review, /if \(currentItem\?\.retry\) return/);
  assert.match(review, /correct \/ initialItemCount/);
  assert.match(review, /autoAdvanceOnWrong=\{false\}/);
  assert.match(review, /deferWrongRetry/);
  assert.match(review, /Zeitlich getrennte Rückholung/);
  assert.match(wordReview, /quality: needsCorrection \? "hard" : "good"/);
  assert.match(wordReview, /activityMode: "typing"/);
  assert.match(wordReview, /onClick=\{\(\) => onComplete\?\.\(\)\}/);
  assert.match(wordReview, /Korrektur verstanden – später erneut abrufen/);
});

test("the authenticated shell and optional practice area preserve the selected bridge language", () => {
  assert.match(appSource, /const german = \(user\.nativeLanguage \|\| "de"\) === "de"/);
  assert.match(appSource, /german \? "Dein Lernweg wird geladen\.\.\." : "Loading your learning path\.\.\."/);
  assert.match(appSource, /function PlayWorkspace[\s\S]*?nativeLanguage=\{nativeLanguage\}[\s\S]*?<ScenarioPracticeView/);
  assert.match(appSource, /<ScenarioPracticeView[^>]+nativeLanguage=\{nativeLanguage\}/);
  assert.match(appSource, /<MiniGamesView[^>]+nativeLanguage=\{nativeLanguage\}/);
  assert.match(appSource, /<ChallengesView[^>]+nativeLanguage=\{nativeLanguage\}/);
  assert.match(appSource, /function PracticeMiniGameRound\([^)]*nativeLanguage = "de"/);
  assert.match(appSource, /function ConjugationTrainer\([^)]*nativeLanguage = "de"/);
});

test("German-first localization also covers the reachable management and roadmap surfaces", () => {
  const manage = appSource.slice(appSource.indexOf("function ManageWorkspace"), appSource.indexOf("function LearningPathView"));
  const admin = readFileSync(path.join(__dirname, "AdminWorkspace.jsx"), "utf8");

  assert.match(manage, /title=\{german \? "Verwalten" : "Manage"\}/);
  assert.match(manage, /<AdminWorkspace[\s\S]*?nativeLanguage=\{user\?\.nativeLanguage \|\| "de"\}/);
  assert.match(appSource, /lazy\(\(\) => import\("\.\/AdminWorkspace\.jsx"\)\)/);
  assert.match(manage, /<Suspense fallback=/);
  assert.match(appSource, /Admin-Werkzeuge konnten nicht geladen werden/);
  assert.match(appSource, /german \? "Geplante Erweiterungen" : "Planned Roadmap"/);
  assert.match(admin, /const german = nativeLanguage === "de"/);
  assert.match(admin, /german \? "Curriculum-Qualitätsprüfung" : "Curriculum QA"/);
  assert.match(admin, /german \? "Aktiver Code" : "Active Code"/);
  assert.match(admin, /submitLabel=\{german \? "Speichern" : "Save"\}/);
  assert.match(admin, /german \? "Inhaltswerkzeuge werden geladen\.\.\." : "Loading content tools\.\.\."/);
});

test("German checkpoint and lesson previews never print raw English server metadata", () => {
  assert.match(appSource, /localizedLockedReason\(nextAction, nativeLanguage\)/);
  assert.match(appSource, /localizedLockedReason\(lessonItem, nativeLanguage\)/);
  assert.match(appSource, /localizedExercisePrompt\(exercise, nativeLanguage\)/);
  assert.match(appSource, /localizedExerciseQuestion\(exercise, nativeLanguage\)/);
  assert.doesNotMatch(appSource, /nextAction\.isLocked[^\n]+\{nextAction\.lockedReason\}/);
});

test("the German scenario path localizes lesson and conversation metadata", () => {
  const scenarioSource = appSource.slice(appSource.indexOf("function ScenarioPracticeView"), appSource.indexOf("function ReadingListeningLabView"));
  assert.match(scenarioSource, /localizedLessonTitle\(item, nativeLanguage\)/);
  assert.match(scenarioSource, /localizedLessonSummary\(item, nativeLanguage\)/);
  assert.match(scenarioSource, /localizedScenarioMetadata\(current\.scenario\.goal \|\| current\.prompt, nativeLanguage\)/);
  assert.match(scenarioSource, /nativeLanguage=\{nativeLanguage\}/);
  assert.doesNotMatch(scenarioSource, />Back to scenarios</);
  assert.doesNotMatch(scenarioSource, />Choose Scenario</);
  assert.doesNotMatch(scenarioSource, />Answered Turns</);
});

test("model-sentence study requires successful retrieval and adaptively fades support", () => {
  const sentenceStudy = appSource.slice(appSource.indexOf("function LessonSentenceStudy"), appSource.indexOf("function WordLearnerView"));
  assert.match(sentenceStudy, /const \[attemptCount, setAttemptCount\] = useState\(0\)/);
  assert.match(sentenceStudy, /const \[usedSupport, setUsedSupport\] = useState\(initialSupport\)/);
  assert.match(sentenceStudy, /const \[recalling, setRecalling\] = useState\(recallOnly\)/);
  assert.match(sentenceStudy, /setSupportOpen\(true\)/);
  assert.match(sentenceStudy, /\{correct && <button onClick=\{\(\) => onContinue\?\.\(\{ correct: true, usedSupport, attemptCount, orthographyWarning: recallResult\.accentWarning \}\)\}/);
  assert.doesNotMatch(sentenceStudy, /\{checked && <button onClick=/);
  assert.match(sentenceStudy, /modelSentenceRecallFeedback\(\{ result: recallResult, complete: correct, requireExactOrthography, nativeLanguage, usedSupport, attemptCount \}\)/);
  assert.match(sentenceStudy, /setUsedSupport\(true\)/);
  assert.match(sentenceStudy, /onContinue\?\.\(\{ correct: true, usedSupport, attemptCount, orthographyWarning: recallResult\.accentWarning \}\)/);
  assert.match(sentenceStudy, /requireExactOrthography/);
  assert.match(sentenceStudy, /modelSentenceRecallIsComplete\(recallResult, \{ requireExactOrthography \}\)/);
  assert.match(appSource, /const currentModelSupportReason = current\?\.type === "learn"/);
  assert.match(appSource, /scaffoldedSentenceIndexes: scaffoldedModelSentenceIndexes/);
  assert.match(appSource, /modelSentenceScaffoldReason\(\{/);
  assert.match(appSource, /previousSentenceIndex: learnSteps\[current\.index - 1\]\?\.sentenceIndex/);
  assert.match(appSource, /previousWasScaffolded: scaffoldedModelSentenceIndexes\.includes/);
  assert.match(appSource, /weakSentenceIndexes: weakModelSentenceIndexes/);
  assert.match(appSource, /initialSupport=\{Boolean\(currentModelSupportReason\)\}/);
  assert.match(appSource, /supportReason=\{currentModelSupportReason\}/);
  assert.match(appSource, /autoScaffolded: Boolean\(currentModelSupportReason\)/);
  assert.match(appSource, /createLessonResumeState\(\{/);
  assert.match(sentenceStudy, /const \[supportOpen, setSupportOpen\] = useState\(initialSupport\)/);
  assert.match(sentenceStudy, /Der nächste Satz prüft das Muster frei/);
  assert.match(sentenceStudy, /Der vorige freie Abruf brauchte Unterstützung/);
  assert.match(sentenceStudy, /shuffleItems\(modelSentenceWordBank\(sentence\.spanish\)\)/);
  assert.match(sentenceStudy, /evaluateModelSentenceRecall\(answer, sentence\.spanish\)/);
  assert.doesNotMatch(sentenceStudy, /normalizeText\(answer\) === normalizeText\(sentence\.spanish\)/);
  assert.match(sentenceStudy, /const \[entryMode, setEntryMode\] = useState\(initialSupport \? "build" : "type"\)/);
  assert.match(sentenceStudy, /modelSentenceAnswerFromWordIds\(supportWords, next\)/);
  assert.match(sentenceStudy, /Ein Wort wandert nach oben/);
  assert.match(sentenceStudy, /aus der Antwort entfernen/);
  assert.doesNotMatch(sentenceStudy, /setAnswer\(\(current\) => `\$\{current}/);
});

test("supported model sentences receive a delayed selective retrieval before mixed practice", () => {
  const focusedLesson = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));
  const consolidation = appSource.slice(appSource.indexOf("function LessonSentenceConsolidation"), appSource.indexOf("function WordLearnerView"));
  assert.match(focusedLesson, /modelSentenceNeedsConsolidation\(evidence\)/);
  assert.match(focusedLesson, /weakSentenceIndexes: weakModelSentenceIndexes/);
  assert.match(focusedLesson, /\.\.\.learnSteps, \.\.\.\(contextBridgeStep \? \[contextBridgeStep\] : \[\]\), \.\.\.\(consolidationStep \? \[consolidationStep\] : \[\]\), \.\.\.\(practicePreviewStep/);
  assert.match(focusedLesson, /current\.type === "consolidation"/);
  assert.match(consolidation, /recallOnly/);
  assert.match(consolidation, /0 unnötige Wiederholungen/);
  assert.match(consolidation, /Die deutsche Bedeutung bleibt als Abrufreiz sichtbar; die spanische Lösung bleibt verborgen/);
});

test("A1 lessons bridge isolated model sentences into comprehension and contextual production", () => {
  const focusedLesson = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));
  const bridgeLab = appSource.slice(appSource.indexOf("function A1ContextBridgeLab"), appSource.indexOf("function LessonReadingLab"));
  assert.match(focusedLesson, /buildA1ContextBridge\(lesson/);
  assert.match(focusedLesson, /current\.type === "context-bridge"/);
  assert.match(focusedLesson, /Mini-Szene verstehen und fortsetzen/);
  assert.match(focusedLesson, /completeContextBridgeStep/);
  assert.match(bridgeLab, /Vom Einzelsatz zum Zusammenhang/);
  assert.match(bridgeLab, /Welche Gesamtbedeutung passt genau zu beiden Sätzen/);
  assert.match(bridgeLab, /evaluateModelSentenceRecall\(answer, bridge\.recallTarget\.spanish\)/);
  assert.match(bridgeLab, /SpeakCheck onTranscript=\{setAnswer\}/);
  assert.match(bridgeLab, /!checked && !quiet/);
  assert.match(bridgeLab, /Modell wieder verstecken und neu versuchen/);
  assert.match(bridgeLab, /onContinue\?\.\(\{ usedSupport: attemptCount > 1, orthographyWarning: recallResult\.accentWarning \}\)/);
  assert.match(focusedLesson, /evidence\.usedSupport \|\| evidence\.orthographyWarning/);
});

test("missed lesson checks rotate behind other content before correction", () => {
  const focused = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));
  assert.match(focused, /setPracticeQueue\(\(queue\) => advanceLessonPracticeQueue\(queue, result\.correct\)\)/);
  assert.match(focused, /autoAdvanceOnWrong=\{false\}/);
  assert.match(focused, /deferWrongRetry/);
  assert.match(focused, /requireCorrectToContinue/);
  assert.match(focused, /Jetzt bleiben nur unsichere Aufgaben übrig/);
  assert.match(appSource, /Korrektur verstanden – später erneut abrufen/);
});

test("due lessons use a compact rotating memory check instead of replaying the full teaching sequence", () => {
  const focusedLesson = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));
  assert.match(focusedLesson, /const scheduledReview = Boolean\(lesson\.reviewDue\)/);
  assert.match(focusedLesson, /rotateLessonReviewItems\(interleaved, \(lesson\.lessonReviewCount \|\| 0\) \+ sessionRun, lesson\.isCheckpoint \? 8 : 6\)/);
  assert.match(focusedLesson, /const guideStep = !scheduledReview/);
  assert.match(focusedLesson, /const readingStep = !scheduledReview/);
  assert.match(focusedLesson, /const patternStep = !scheduledReview/);
  assert.match(focusedLesson, /const practicePreviewStep = !scheduledReview/);
  assert.match(focusedLesson, /recallOnly=\{scheduledReview\}/);
  assert.match(focusedLesson, /Gedächtnischeck starten/);
  assert.match(focusedLesson, /Bei späteren Terminen verschiebt sich die Auswahl/);
});

test("an interrupted lesson resumes at its last learning step without weakening mastery checks", () => {
  const focusedLesson = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));
  assert.match(focusedLesson, /espanolo:lesson-resume:\$\{lesson\.id\}/);
  assert.match(focusedLesson, /restoreLessonResumeState\(readLessonResumeRecord\(lessonResumeKey\)/);
  assert.match(focusedLesson, /writeLessonResumeRecord\(lessonResumeKey, createLessonResumeState\(\{/);
  assert.match(focusedLesson, /removeLessonResumeRecord\(lessonResumeKey, legacyLessonResumeKeys\)/);
  assert.match(focusedLesson, /return Math\.min\(value \+ 1, lessonSteps\.length\)/);
  assert.match(focusedLesson, /firstPassResults: results/);
  assert.match(focusedLesson, /correctionExerciseIds: practiceQueue\.filter/);
  assert.match(focusedLesson, /resumedFromSavedState/);
  assert.match(focusedLesson, /buildLessonPracticeQueue\(lesson\.exercises \|\| \[\]\)/);
  assert.match(focusedLesson, /interleaveLessonPracticeQueue\(queue, lesson\.id\)/);
  assert.match(focusedLesson, /rotateLessonReviewItems\(interleaved, \(lesson\.lessonReviewCount \|\| 0\) \+ sessionRun/);
});

test("lesson completion explains retrieval evidence and the next spaced review", () => {
  const focusedLesson = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));
  assert.match(focusedLesson, /const independent = results\.filter\(\(result\) => result\.correct && !result\.usedSupport\)\.length/);
  assert.match(focusedLesson, /const independentScore = practiceTargetCount/);
  assert.match(focusedLesson, /body: \{ score, independentScore, introducedWordIds: \(vocabularyLab\?\.items \|\| \[\]\)\.map\(\(word\) => word\.id\) \}/);
  assert.match(focusedLesson, /const supported = results\.filter\(\(result\) => result\.correct && result\.usedSupport\)\.length/);
  assert.match(focusedLesson, /const corrected = results\.filter\(\(result\) => !result\.correct\)\.length/);
  assert.match(focusedLesson, /im ersten Versuch ohne Hilfe/);
  assert.match(focusedLesson, /nach Vergleich erneut richtig abgerufen/);
  assert.match(focusedLesson, /Das hast du in diesem Paket aufgebaut/);
  assert.match(focusedLesson, /localizedReviewMoment\(nextReviewAt, nativeLanguage\)/);
  assert.match(focusedLesson, /usedSupport: Boolean\(result\.review\?\.usedSupport\)/);
  assert.match(focusedLesson, /candidate < currentDate \? candidate\.toISOString\(\) : currentDueAt/);
});

test("lesson completion continues with the freshly recalculated daily plan", () => {
  const learningApp = appSource.slice(appSource.indexOf("function LearningApp"), appSource.indexOf("function ActiveView"));
  const path = appSource.slice(appSource.indexOf("function LearningPathView"), appSource.indexOf("function CourseUnitCard"));
  const focused = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));

  assert.match(learningApp, /setDashboard\(data\);[\s\S]*?return data;/);
  assert.match(path, /onStartLesson=\{\(lessonId\) => \{[\s\S]*?setLesson\(null\);[\s\S]*?setSelectedId\(lessonId\);/);
  assert.match(focused, /setPostLessonPlanLoading\(true\)/);
  assert.match(focused, /setPostLessonDashboard\(dashboardData \|\| null\)/);
  assert.match(focused, /postLessonTarget\?\.type === "review"/);
  assert.match(focused, /postLessonTarget\?\.type === "lesson"/);
  assert.match(focused, /postLessonTarget\?\.type === "challenge"/);
  assert.match(focused, /Nächster sinnvoller Schritt/);
  assert.match(focused, /Mit Wiederholung weitermachen/);
  assert.match(focused, /Nächstes Lernpaket starten/);
  assert.match(focused, /w-full[^"]*sm:w-auto/);
  assert.match(focused, /postLessonPlan\.kind === "consolidation"/);
  assert.match(focused, /Dieses Lernpaket war für heute genug neuer Stoff/);
});

test("the learning path stays focused on one CEFR level and explains the next unit", () => {
  const path = appSource.slice(appSource.indexOf("function LearningPathView"), appSource.indexOf("function CourseUnitCard"));

  assert.match(path, /const availableLevels = \[\.\.\.new Set/);
  assert.match(path, /const visibleLevel = availableLevels\.includes\(selectedLevel\) \? selectedLevel : currentLevel/);
  assert.match(path, /const visibleUnitGroups = activeUnitGroups\.filter/);
  assert.match(path, /visibleUnitGroups\.map/);
  assert.doesNotMatch(path, /activeUnitGroups\.map\(\(unit\) => \(/);
  assert.match(path, /aria-pressed=\{visibleLevel === level\}/);
  assert.match(path, /Warum dieses Paket jetzt kommt/);
  assert.match(path, /formatLearningTime\(visibleRemainingMinutes, german\)/);
});

test("the German-first home lets a fresh learning package settle without blocking an explicit choice", () => {
  const home = appSource.slice(appSource.indexOf("function NaturalLearningHome"), appSource.indexOf("function PracticePanel"));

  assert.match(home, /const freshConsolidation = plan\.kind === "consolidation"/);
  assert.match(home, /dailyPlanExplanation\(/);
  assert.match(home, /naturalLearningHomeCopy\(/);
  assert.match(home, /Optional trotzdem weiter/);
});

test("lesson completion distinguishes eventual correction from independent first-pass mastery", () => {
  const focused = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));

  assert.match(focused, /Unterstützte und korrigierte Inhalte gelten noch nicht als dauerhaft sicher/);
  assert.match(focused, /Alle vorgesehenen Aufgaben wurden im ersten Versuch selbstständig gelöst/);
  assert.doesNotMatch(focused, /Alle vorgesehenen Aufgaben wurden sicher gelöst\./);
});

test("lesson cards distinguish a full learning package from its compact later review", () => {
  assert.match(appSource, /due \? lessonItem\.reviewEstimatedMinutes \|\| lessonItem\.estimatedMinutes : lessonItem\.estimatedMinutes/);
});

test("every focused lesson starts with a concrete German learning contract", () => {
  const focusedLesson = appSource.slice(appSource.indexOf("function FocusedLessonSession"), appSource.indexOf("function LessonReadingLab"));
  assert.match(focusedLesson, /localizedLessonSummary\(lesson, nativeLanguage\)/);
  assert.match(focusedLesson, /Dein Lernvertrag/);
  assert.match(focusedLesson, /Das lernst du konkret/);
  assert.match(focusedLesson, /Am Ende kannst du/);
  assert.match(focusedLesson, /So lernst du es/);
  assert.match(focusedLesson, /germanLearningGoals\.map/);
  assert.match(focusedLesson, /germanPerformanceTarget/);
  assert.match(focusedLesson, /germanLearningRoute\.map/);
  assert.match(focusedLesson, /Das weist du in diesem Checkpoint nach/);
  assert.match(focusedLesson, /Checkpoint starten/);
  assert.doesNotMatch(focusedLesson, /Diese Lektion baut ein klar begrenztes spanisches Grundmuster auf/);
});

test("German foundation cards show concept-specific explanations and visible pitfalls", () => {
  const foundation = appSource.slice(appSource.indexOf("function LessonFoundationRecall"), appSource.indexOf("function GermanLessonBridge"));
  assert.match(foundation, /germanFoundationCardCopy/);
  assert.match(foundation, /Typische Falle/);
  assert.match(foundation, /germanConceptTitle\(lesson, cardIndex, cards\[cardIndex\]\)/);
  assert.match(foundation, /germanConceptTitle\(lesson, index, card\)/);
  assert.doesNotMatch(foundation, /german \? germanConceptTitle\(lesson, cardIndex\) : item\.title/);
});

test("foundation recap requires hidden retrieval and selectively repeats uncertainty", () => {
  const recall = appSource.slice(appSource.indexOf("function LessonFoundationRecall"), appSource.indexOf("function LessonFoundationGuide"));
  assert.match(recall, /Konzept \$\{currentIndex \+ 1\} ohne Vorlage erklären/);
  assert.match(recall, /Meine Erinnerung mit dem Merksatz vergleichen/);
  assert.match(recall, /!revealed \?/);
  assert.match(recall, /rateRecall\("uncertain"\)/);
  assert.match(recall, /rateRecall\("secure"\)/);
  assert.match(recall, /setRecallOrder\(uncertainIndexes\)/);
  assert.match(recall, /Nur Unsicheres erneut abrufen/);
  assert.doesNotMatch(recall, /currentCard\.example/);
  assert.doesNotMatch(recall, /cards\.map\(\(item/);
});

test("foundation checks remove answer-position shortcuts within a lesson", () => {
  const guide = appSource.slice(appSource.indexOf("function LessonFoundationGuide"), appSource.indexOf("function GermanLessonBridge"));
  assert.match(guide, /answerPositionOffset/);
  assert.match(guide, /balanceFoundationQuickCheck\(authoredQuickCheck, answerPositionOffset, index\)/);
  assert.match(guide, /setAnswerPositionOffset\(\(value\) => value \+ 1\)/);
  assert.match(guide, /quickCheck\.options\.map/);
  assert.match(guide, /optionIndex === quickCheck\.correct/);
});

test("optional English keeps the same objective foundation gate as German", () => {
  const guide = appSource.slice(appSource.indexOf("function LessonFoundationGuide"), appSource.indexOf("function GermanLessonBridge"));
  assert.match(guide, /german \? foundationQuickCheck\(lesson, index\) : buildEnglishFoundationQuickCheck\(cards, index\)/);
  assert.match(guide, /german \? "Kurzer Verständnischeck" : "Quick understanding check"/);
  assert.match(guide, /disabled=\{checkAnswer !== quickCheck\.correct\}/);
  assert.doesNotMatch(guide, /disabled=\{german && checkAnswer !== quickCheck\.correct\}/);
});

test("foundation scope stays focused instead of duplicating model-sentence study", () => {
  const guideBuilder = appSource.slice(appSource.indexOf("function lessonGuideCards"), appSource.indexOf("function lessonRememberPoints"));
  assert.match(guideBuilder, /const candidates = cards\.length \? cards : sentenceCards/);
  assert.match(guideBuilder, /return candidates/);
  assert.doesNotMatch(guideBuilder, /return \[\.\.\.cards, \.\.\.sentenceCards\]/);
});

test("mixed practice begins with transfer guidance instead of showing the Spanish models again", () => {
  const preview = appSource.slice(appSource.indexOf("function LessonPracticePreview"), appSource.indexOf("let activePronunciationAudio"));
  assert.match(preview, /Transfer statt Wiederlesen/);
  assert.match(preview, /Jetzt arbeitest du ohne sichtbare Lösung/);
  assert.match(preview, /Eine erneute Modellliste würde nur Vertrautheit erzeugen/);
  assert.match(preview, /quiet \? "Formuliere innerlich oder tippe/);
  assert.match(preview, /Hilfestufen nacheinander/);
  assert.match(preview, /Ohne Vorlage starten/);
  assert.doesNotMatch(preview, /sentence\.spanish/);
  assert.doesNotMatch(preview, /nativeMeaning\(/);
  assert.match(appSource, /<LessonPracticePreview[\s\S]*?quiet=\{quiet\}/);
});

test("lesson audio follows home and quiet modes without blocking silent recall", () => {
  assert.match(appSource, /<LessonSentenceStudy[\s\S]*?nativeLanguage=\{nativeLanguage\}[\s\S]*?quiet=\{quiet\}[\s\S]*?index=\{current\.index\}/);
  const patternLab = appSource.slice(appSource.indexOf("function LessonPatternLab"), appSource.indexOf("function germanFoundationExplanation"));
  const sentenceStudy = appSource.slice(appSource.indexOf("function LessonSentenceStudy"), appSource.indexOf("function WordLearnerView"));
  assert.match(patternLab, /quiet \? "Der Anfang bleibt stabil[^"]+Lies jeden Satz innerlich mit/);
  assert.match(patternLab, /!quiet && <PronunciationTools[^>]+nativeLanguage=\{nativeLanguage\}/);
  assert.match(sentenceStudy, /!checked && !quiet && entryMode === "type" && <div className="mt-3"><SpeakCheck/);
  assert.match(sentenceStudy, /!quiet && <PronunciationTools[^>]+nativeLanguage=\{nativeLanguage\}/);
  const practicePanel = appSource.slice(appSource.indexOf("function PracticePanel"), appSource.indexOf("function FeedbackFact"));
  assert.match(practicePanel, /isQuietListeningAlternative = quiet && isListeningDictation/);
  assert.match(practicePanel, /Drücke diese Bedeutung auf Spanisch aus/);
  assert.match(practicePanel, /silentMeaning = isQuietListeningAlternative \? nativeMeaning\(exercise\.silentMeaning, nativeLanguage\)/);
  assert.match(practicePanel, /isListeningDictation && exercise\.audioText && !quiet/);
  assert.match(practicePanel, /practiceMode: isQuietListeningAlternative \? "quiet-alternative" : "home"/);
  assert.match(appSource, /<ReviewQueueView[^>]+learningMode=\{user\.learningMode \|\| "home"\}/);
  const reviewQueue = appSource.slice(appSource.indexOf("function ReviewQueueView"), appSource.indexOf("function ReviewWordQuizCard"));
  assert.match(reviewQueue, /const quiet = learningMode === "quiet"/);
  assert.match(reviewQueue, /<PracticePanel[\s\S]*?quiet=\{quiet\}[\s\S]*?source="REVIEW"/);
  assert.match(appSource, /QuizResultBanner result=\{resultBanner\} className="mb-4" nativeLanguage=\{nativeLanguage\}/);
});

test("quiet listening replacements remain visibly queued until real listening succeeds", () => {
  const home = appSource.slice(appSource.indexOf("function NaturalLearningHome"), appSource.indexOf("function PathView"));
  assert.match(home, /const deferredChannel = skillBalance\?\.deferred \|\| null/);
  assert.match(home, /deferredListeningCopy\(/);
  assert.match(dailyLearningSource, /Hören zu Hause nachholen/);
  assert.match(dailyLearningSource, /eine weitere stille Aufgabe würde diese Hörlücke nicht schließen/);
  assert.match(dailyLearningSource, /Nur eine korrekte Antwort aus dem Klang schließt diesen Auftrag/);
  assert.match(home, /deferredChannel && \(skillBalance\.quietDeferred \|\| deferredWaiting\)/);
  assert.match(home, /!skillBalance\.quietDeferred && !deferredWaiting/);
  assert.match(dailyLearningSource, /Echtes Hören jetzt nachholen/);
});

test("connected listening also returns as the actual hidden-transcript passage after quiet study", () => {
  const readingLab = appSource.slice(appSource.indexOf("function LessonReadingLab"), appSource.indexOf("function LessonPatternLab"));
  const home = appSource.slice(appSource.indexOf("function NaturalLearningHome"), appSource.indexOf("function PathView"));
  assert.match(readingLab, /targetChannel: listening \? "listening" : null/);
  assert.match(readingLab, /practiceMode: heardAudio \? "home" : "quiet-alternative"/);
  assert.match(readingLab, /completesChannelTarget: listening && questionIndex \+ 1 >= questions\.length/);
  assert.match(home, /deferredChannel\?\.kind === "connected-listening"/);
  assert.match(home, /<LessonReadingLab[\s\S]*?quiet=\{false\}/);
  assert.match(dailyLearningSource, /Hörtext jetzt nachholen/);
  assert.match(dailyLearningSource, /ohne sichtbares Transkript/);
});

test("quiet sound labs return as real audio discrimination rather than visual evidence", () => {
  const soundLab = appSource.slice(appSource.indexOf("function SoundFoundationLab"), appSource.indexOf("function LessonFoundationRecall"));
  const home = appSource.slice(appSource.indexOf("function NaturalLearningHome"), appSource.indexOf("function PathView"));
  assert.match(soundLab, /skill: quiet \? "visual" : "listening"/);
  assert.match(soundLab, /targetKind: "sound-discrimination"/);
  assert.match(soundLab, /if \(audioState === "playing"\) setListened\(true\)/);
  assert.match(home, /deferredChannel\?\.kind === "sound-listening"/);
  assert.match(home, /<SoundFoundationLab[\s\S]*?soundFoundationLab\(skillBalance\.lesson\?\.topicSlug\)/);
  assert.match(dailyLearningSource, /Klanglabor jetzt nachholen/);
});

test("connected comprehension feedback follows the actual question instead of assuming cause and effect", () => {
  const readingLab = appSource.slice(appSource.indexOf("function LessonReadingLab"), appSource.indexOf("function LessonPatternLab"));
  assert.match(appSource, /import \{ connectedInputRetryMessage \} from "\.\/connected-input-feedback\.mjs"/);
  assert.match(readingLab, /connectedInputRetryMessage\(question, \{ nativeLanguage, listening, quiet \}\)/);
  assert.doesNotMatch(readingLab, /Suche im Text nach dem Satz, der Ursache und Folge direkt verbindet/);
  assert.doesNotMatch(readingLab, /Find the sentence that directly connects cause and consequence/);
});
