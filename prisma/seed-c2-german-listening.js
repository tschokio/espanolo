const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const q = (questionDe, questionEn, optionsDe, optionsEn) => ({ questionDe, questionEn, optionsDe, optionsEn });

const localizedQuestions = {
  "c2-scope-ambiguity": [
    q("Welches Problem hatte die ursprüngliche Formulierung?", "What problem did the original wording have?", ["Sie erlaubte mehrere Deutungen darüber, wer Hilfe erhält", "Sie enthielt keinerlei Verneinung", "Sie garantierte eindeutig identische Hilfe"], ["It allowed multiple interpretations of who would receive help", "It contained no negative form", "It clearly guaranteed identical support"]),
    q("Was legt die überarbeitete Fassung eindeutig fest?", "What does the revised version establish clearly?", ["Hilfe für alle; nur die Form kann variieren", "Ausschluss eines Teils der Beteiligten", "Keine Anpassung an Bedürfnisse"], ["Support for everyone, with only the form allowed to vary", "Exclusion of some participants", "No adaptation to needs"])
  ],
  "c2-faithful-compression": [
    q("Was ginge durch die Kurzfassung la intervención funcionó verloren?", "What would be lost in the summary la intervención funcionó?", ["Unterschiede, kausale Grenzen und Abbruch der Nachbeobachtung", "Nur die Namen der Autoren", "Keine relevante Information"], ["Variation, causal limits, and discontinued follow-up", "Only the authors' names", "No relevant information"]),
    q("Welche Schlussfolgerung erlaubt die Studie tatsächlich?", "What conclusion does the study actually permit?", ["Es gab eine verbundene Verbesserung, aber keine sichere Einzelursache", "Die Intervention wirkte überall exakt gleich", "Abbrechende Zentren bewiesen vollständiges Scheitern"], ["There was an associated improvement, but it cannot be assigned to one cause with certainty", "The intervention had exactly the same effect everywhere", "Centers that withdrew proved total failure"])
  ],
  "c2-audience-mediation": [
    q("Welche Inhalte bewahrt die allgemein verständliche Reformulierung?", "What does the accessible reformulation preserve?", ["Grenzwert, Handlung, weitere Kontrolle und mehrere Messungen", "Nur den Befehl, ein Fenster zu öffnen", "Dass eine einzelne Messung immer genügt"], ["Threshold, action, continued monitoring, and multiple measurements", "Only an order to open a window", "That a single reading is always sufficient"]),
    q("Was verändert sich durch die Anpassung an das Publikum?", "What changes when adapting to the audience?", ["Fachsprache und Ausdrücklichkeit der Schritte, nicht das technische Kriterium", "Grenzwert und Stabilitätsbedingung", "Die Notwendigkeit weiterer Messungen"], ["Terminology and explicitness of steps, not the technical criterion", "The threshold and stability condition", "The need to continue measuring"])
  ],
  "c2-reconcile-accounts": [
    q("Warum müssen sich die beiden Berichte nicht widersprechen?", "Why need the two reports not contradict each other?", ["Sie messen verschiedene Größen und Zeitfenster", "Einer besitzt überhaupt keine Daten", "Beide beschreiben genau dieselbe Erfahrung"], ["They measure different variables and time periods", "One contains no data at all", "Both describe exactly the same experience"]),
    q("Welche Synthese erklärt beide Ergebnisse?", "Which synthesis explains both results?", ["Der Durchschnitt verbesserte sich, während Spitzenzeiten problematisch blieben", "Die Wartezeiten stiegen jederzeit gleich", "Subjektive Wahrnehmung widerlegt jede Messung"], ["The average improved while peak periods could remain problematic", "Waiting times rose equally at all times", "Subjective perception invalidates every measurement"])
  ],
  "c2-connotation-effect": [
    q("Worin unterscheiden sich ambiciosa und pretenciosa?", "How do ambiciosa and pretenciosa differ?", ["Beide bezeichnen Reichweite, bewerten sie aber unterschiedlich", "Sie sind in Ton und Wirkung gleich", "Das zweite Wort ist stets technisch neutral"], ["Both convey scope but evaluate it differently", "They are identical in tone and effect", "The second is always technically neutral"]),
    q("Was muss eine anspruchsvolle Paraphrase erhalten?", "What must a high-level paraphrase preserve?", ["Sachverhalt, Wertung, Intensität und Sprecherdistanz", "Nur die wichtigsten Nomen", "Dieselbe Länge unabhängig von der Haltung"], ["Fact, evaluation, intensity, and speaker distance", "Only the main nouns", "The same length even if stance changes"])
  ],
  "checkpoint-c2-precision-mediation": [
    q("Welche Verzerrung vermeidet die überarbeitete öffentliche Mitteilung?", "What distortion does the revised public communication avoid?", ["Die Verbesserung zu verallgemeinern und einer unbelegten Ursache zuzuschreiben", "Den gesunkenen Durchschnitt zu erwähnen", "Eine Prüfung der Spitzenzeiten vorzuschlagen"], ["Generalizing the improvement and attributing it to an unproven cause", "Mentioning that the average fell", "Proposing an evaluation of peak periods"]),
    q("Wie führt die Mitteilung beide Quellen zusammen?", "How does the communication integrate both sources?", ["Sie trennt Gesamtdurchschnitt und Erfahrung bei höchster Nachfrage", "Sie erklärt die Umfrage für falsch", "Sie behauptet, sämtliche Verzögerungen seien verschwunden"], ["It distinguishes the overall average from experience at peak demand", "It declares the survey false", "It claims every delay disappeared"])
  ],
  "c2-lexical-precision": [
    q("Welche zusätzliche Bedeutung trägt desencadenar?", "What additional meaning does desencadenar carry?", ["Einen abrupten Beginn mit schwer kontrollierbarer Folgekette", "Eine zwingend positive Bewertung", "Völlige Folgenlosigkeit"], ["A sudden beginning and a chain difficult to contain", "A necessarily positive evaluation", "A complete absence of consequences"]),
    q("Wann kann ein einfacheres Wort präziser sein?", "When can a simpler word be more precise?", ["Wenn es Register und gemeinte Beziehung besser trifft", "Wenn es jedes Verb vermeidet", "Nur bei sehr kurzen Texten"], ["When it better matches the register and intended relationship", "When it avoids every verb", "Only when the text is very short"])
  ],
  "c2-idiom-figurative-meaning": [
    q("Was bedeutet dejar cabos sueltos im Text?", "What does dejar cabos sueltos mean in the text?", ["Wichtige Fragen ungelöst lassen", "Mit fehlerhaftem Material arbeiten", "Alle Schwierigkeiten beseitigen"], ["Leave important matters unresolved", "Work with defective materials", "Eliminate every difficulty"]),
    q("Welche Wirkung hat no es poca cosa?", "What effect does no es poca cosa create?", ["Es verstärkt Bedeutung durch eine abschwächende Form", "Es erklärt die Sache für wertlos", "Es führt eine rechtliche Bedingung ein"], ["It intensifies importance through understated wording", "It declares the matter worthless", "It introduces a legal condition"])
  ],
  "c2-genre-conventions": [
    q("Was muss in beiden Textsorten erhalten bleiben?", "What must be preserved across both genres?", ["Entscheidung, neues Datum und praktische Folge", "Exakt dieselbe Satzstellung", "Alle juristischen Formeln auch in der öffentlichen Notiz"], ["The decision, new date, and practical effect", "Exactly the same syntax", "Every legal formula in the public notice"]),
    q("Warum verändert sich die Reihenfolge der Informationen?", "Why does the information order change?", ["Jede Textsorte erfüllt einen anderen Zweck und andere Erwartungen", "Das Datum wird unwahr", "Die Entscheidung soll unerwähnt bleiben"], ["Each genre serves a different purpose and expectations", "The date ceases to be true", "The decision must be avoided"])
  ],
  "c2-information-structure": [
    q("Was hebt Fue el viernes cuando... hervor?", "What does Fue el viernes cuando... highlight?", ["Den Zeitpunkt der Fehlerentdeckung", "Die genaue Schwere des Fehlers", "Die Identität des Berichtverfassers"], ["The time when the error was detected", "The exact severity of the error", "The identity of the report's author"]),
    q("Welches Risiko birgt eine schlecht gebaute Thematisierung?", "What risk does poorly constructed thematization create?", ["Bezug und Kontrast werden unklar", "Jeder Satz wird informell", "Verben verschwinden zwangsläufig"], ["Reference and contrast become unclear", "Every sentence becomes informal", "Verbs necessarily disappear"])
  ],
  "c2-rhetorical-architecture": [
    q("Was leistet ein wirksamer Schluss?", "What does an effective conclusion do?", ["Er beantwortet das Ausgangsproblem mit gerechtfertigter Sicherheit", "Er führt ein völlig neues Thema ein", "Er wiederholt alle Absätze wörtlich"], ["It answers the initial problem with justified certainty", "It introduces a completely new topic", "It repeats every paragraph literally"]),
    q("Wann ist eine Wiederholung funktional?", "When is repetition functional?", ["Wenn sie eine Kernidee für Kohäsion oder Betonung wiederaufnimmt", "Immer wenn sie den Text verlängert", "Nur wenn sie alle Konnektoren ersetzt"], ["When it retrieves a central idea for cohesion or emphasis", "Whenever it lengthens the text", "Only when it replaces every connector"])
  ],
  "checkpoint-c2-genre-rhetoric": [
    q("Was bedeutet abrió una puerta importante?", "What does abrió una puerta importante mean?", ["Es schuf eine bedeutsame Möglichkeit", "Es zwang zur Schließung des Programms", "Es beseitigte jede Bedingung"], ["It created an important opportunity", "It forced the program to close", "It eliminated the need for conditions"]),
    q("Was ordnet die öffentliche Fassung an erster Stelle an?", "What does the public version prioritize first?", ["Die praktische Entscheidung und ihre Hauptbedingung", "Alle methodischen Verweise", "Die wörtliche Beschreibung einer Tür"], ["The practical decision and its main condition", "Every methodological reference", "A literal description of a door"])
  ],
  "c2-panhispanic-grammar": [
    q("Was zeigt der Dialog über regionale Grammatik?", "What does the dialogue show about regional grammar?", ["Mehrere systematische Regionalformen können dieselbe Funktion erfüllen", "Nur eine Sprecherin verwendet Grammatik", "Ustedes bedeutet immer Förmlichkeit"], ["Several systematic regional forms can serve equivalent functions", "Only one speaker uses grammar", "Ustedes always indicates formality"]),
    q("Welche Strategie empfiehlt sich für die eigene Produktion?", "What strategy is recommended for one's own production?", ["In einer Varietät konsistent bleiben und andere rezeptiv verstehen", "In jedem Satz das System wechseln", "Jede Form der zweiten Person vermeiden"], ["Remain consistent within one variety while understanding others receptively", "Change system in every sentence", "Avoid every second-person form"])
  ],
  "c2-regional-lexicon": [
    q("Was lässt sich aus einer einzelnen regionalen Wortvariante nicht sicher schließen?", "What cannot be concluded safely from one regional lexical variant?", ["Die genaue Herkunft einer Person", "Dass Regionalwörter existieren", "Dass Kontext beim Verstehen hilft"], ["A person's exact origin", "That regional words exist", "That context helps interpretation"]),
    q("Was bewirkt die Rückfrage zum Wort colectivo?", "What does the question about colectivo achieve?", ["Sie prüft die Bedeutung, ohne die Variante als Fehler darzustellen", "Sie verbietet lokale Wörter", "Sie wechselt das Reisethema"], ["It checks meaning without presenting the variant as an error", "It bans local words", "It changes the travel topic"])
  ],
  "c2-address-social-distance": [
    q("Warum genügt die Regel informell gleich tú, formell gleich usted nicht?", "Why is the rule informal equals tú and formal equals usted insufficient?", ["Region, Beziehung, Hierarchie und Gewohnheit wirken ebenfalls", "Usted besitzt keine Verbformen", "Alle Gemeinschaften verwenden tú"], ["Region, relationship, hierarchy, and convention also matter", "Usted has no verb forms", "Every community uses tú"]),
    q("Was erreicht podemos tutearnos?", "What does podemos tutearnos achieve?", ["Es handelt ausdrücklich eine nähere Anredeform aus", "Es zwingt die ganze Gruppe zu usted", "Es vermeidet jede zweite Person"], ["It explicitly negotiates a closer form of address", "It imposes usted on the whole group", "It avoids every second-person form"])
  ],
  "c2-face-euphemism": [
    q("Warum ist die konkrete Kritik am Bericht besser?", "Why is the specific criticism of the report better?", ["Sie schützt die Beziehung, benennt aber Problem und nötige Handlung", "Sie entfernt jede Erwähnung der Zahlen", "Sie beschuldigt eine Person ohne Beleg"], ["It protects the relationship while identifying the problem and required action", "It removes every mention of the figures", "It blames a person without evidence"]),
    q("Welches Risiko hat se produjeron irregularidades?", "What risk does se produjeron irregularidades carry?", ["Relevante Handelnde, Fakten und Verantwortung können verborgen werden", "Es ist immer zu umgangssprachlich", "Es benennt exakt, wer handelte"], ["Relevant agents, facts, and responsibility can be obscured", "It is always too colloquial", "It states exactly who acted"])
  ],
  "c2-humor-cultural-reference": [
    q("Was aktiviert die Ironie des angeblichen Effizienzrekords?", "What activates the irony of the supposed efficiency record?", ["Der Gegensatz zwischen wörtlichem Lob und unproduktiver Sitzung", "Eine offizielle Produktivitätsmessung", "Das völlige Fehlen von Kontext"], ["The contrast between literal praise and an unproductive meeting", "An official productivity measurement", "The complete absence of context"]),
    q("Wie vermittelt man eine unbekannte kulturelle Anspielung?", "How should an unfamiliar cultural reference be mediated?", ["Ihre Funktion erklären oder ein Mittel mit ähnlicher Wirkung wählen", "Jedes Wort übersetzen und gleiche Wirkung voraussetzen", "Jede Wertung vollständig entfernen"], ["Explain its function or choose a device with a comparable effect", "Translate each word and assume the same effect", "Always remove every evaluation"])
  ],
  "checkpoint-c2-sociolinguistic-variation": [
    q("Was macht der Koordinator besonders gut?", "What does the coordinator do well?", ["Er klärt Bedeutung und vereinbart gemeinsame Praxis ohne Abwertung", "Er bezeichnet voseo als Fehler", "Er zwingt alle zum gleichen Akzent"], ["He clarifies meaning and agrees a shared practice without delegitimizing variation", "He presents voseo as an error", "He forces everyone to use the same accent"]),
    q("Wie behandelt er die ironische Bemerkung?", "How does he handle the ironic comment?", ["Er erkennt das bezeichnete Kommunikationsproblem und reagiert kooperativ", "Er versteht sie endgültig als wörtliches Lob", "Er unterstellt ohne weitere Hinweise Feindseligkeit"], ["He recognizes the communication problem it signals and responds cooperatively", "He treats it definitively as literal praise", "He attributes hostility without further evidence"])
  ]
};

const listeningSlugs = new Set([
  "c2-scope-ambiguity",
  "c2-audience-mediation",
  "c2-connotation-effect",
  "c2-lexical-precision",
  "c2-genre-conventions",
  "c2-rhetorical-architecture",
  "c2-panhispanic-grammar",
  "c2-address-social-distance",
  "c2-humor-cultural-reference"
]);

const explanationEn = (slug) => {
  if (slug.includes("precision") || ["c2-scope-ambiguity", "c2-faithful-compression", "c2-audience-mediation", "c2-reconcile-accounts", "c2-connotation-effect"].includes(slug)) return "The answer preserves scope, evidence status, and the communicative effect of the source text.";
  if (["c2-lexical-precision", "c2-idiom-figurative-meaning", "c2-genre-conventions", "c2-information-structure", "c2-rhetorical-architecture", "checkpoint-c2-genre-rhetoric"].includes(slug)) return "The answer connects the form with its precise meaning and communicative function.";
  return "The answer respects regional distribution, social relationship, and conversational function without devaluing any variety.";
};

async function main() {
  const entries = Object.entries(localizedQuestions);
  const lessons = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true, readingJson: true } });
  if (lessons.length !== entries.length) throw new Error(`C2 localization requires ${entries.length} lessons, found ${lessons.length}.`);
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

  for (const [slug, localized] of entries) {
    const current = bySlug.get(slug).readingJson;
    if (!Array.isArray(current?.questions) || current.questions.length !== localized.length) throw new Error(`${slug} has an unexpected question structure.`);
    const questions = current.questions.map((question, index) => ({ ...question, ...localized[index], explanationEn: explanationEn(slug) }));
    await prisma.lesson.update({
      where: { slug },
      data: { readingJson: { ...current, inputMode: listeningSlugs.has(slug) ? "listening" : "reading", questions } }
    });
  }
  console.log(`Localized ${entries.length} C2 packages and enabled ${listeningSlugs.size} connected listening paths.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { localizedQuestions, listeningSlugs };
