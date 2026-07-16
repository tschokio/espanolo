const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const q = (questionDe, questionEn, optionsDe, optionsEn) => ({ questionDe, questionEn, optionsDe, optionsEn });

const localizedQuestions = {
  "c1-narrative-tempo": [
    q("Welche Information verlangsamt die Erzählung und baut die Szene auf?", "Which information slows the narrative and builds the scene?", ["Die Beschreibung des Platzes und Martas Routine", "Die zufallende Tür", "Der Schrei nach dem Stromausfall"], ["The description of the square and Marta's routine", "The door slamming shut", "The shout after the blackout"]),
    q("Was beschleunigt die Erzählung?", "What accelerates the narrative?", ["Die Folge kurzer Ereignisse nach dem Stromausfall", "Martas wöchentliche Gewohnheit", "Die anfängliche Beschreibung der Händler"], ["The sequence of brief events after the blackout", "Marta's weekly habit", "The initial description of the vendors"])
  ],
  "c1-flashback-foreshadowing": [
    q("Was war geschehen, bevor der aktuelle Brief geöffnet wurde?", "What had happened before the current letter was opened?", ["Der Großvater hatte einen ähnlichen Umschlag hinterlassen und um Warten gebeten", "Die Hauptfigur hatte den Grund bereits entdeckt", "Der aktuelle Brief hatte schon alles verändert"], ["The grandfather had left a similar envelope and asked them to wait", "The protagonist had already discovered the reason", "The current letter had already changed everything"]),
    q("Was deutet der Text für den späteren Verlauf an?", "What does the text foreshadow?", ["Das Versprechen wird die Lage verändern und der Grund bald bekannt", "Der Großvater wird den Brief zurückholen", "Keiner der Umschläge wird je geöffnet"], ["The promise will change the situation and the reason will soon be known", "The grandfather will return to collect the letter", "Neither envelope will ever be opened"])
  ],
  "c1-viewpoint-distance": [
    q("Welche Behauptung stammt vom Direktor?", "Which claim belongs to the director?", ["Die Entscheidung sei unvermeidlich und eine Verzögerung hätte alles verschlimmert", "Es gebe eindeutig noch mehrere Alternativen", "Clara müsse endgültig entscheiden"], ["The decision was inevitable and delay would have worsened matters", "Several clear alternatives still remained", "Clara had to make the final decision"]),
    q("Welcher Teil ist Claras Interpretation?", "Which part is Clara's interpretation?", ["Der Direktor habe Alternativen vielleicht nicht erwogen oder wolle sie nicht nennen", "Die Entscheidung sei offiziell verkündet worden", "Jede Verzögerung hätte zwangsläufig geschadet"], ["The director may not have considered alternatives or may not want to mention them", "The decision had been officially announced", "Any delay would necessarily have caused harm"])
  ],
  "c1-participial-compression": [
    q("Was geschah unmittelbar nach dem Ende der Sitzung?", "What happened immediately after the meeting ended?", ["Die Vertreter verließen den Raum", "Die Sprecherin veröffentlichte die Dokumente", "Die Journalisten eröffneten eine weitere Sitzung"], ["The representatives left the room", "The spokesperson published the documents", "The journalists began another meeting"]),
    q("Wer hatte die Vereinbarung geprüft?", "Who had reviewed the agreement?", ["Die Sprecherin", "Alle Journalisten", "Die hinausgehenden Vertreter"], ["The spokesperson", "All the journalists", "The representatives leaving the room"])
  ],
  "c1-narrative-voice": [
    q("Welche Wissensgrenze nennt der Ich-Erzähler ausdrücklich?", "What limit does the first-person narrator state explicitly?", ["Er sah nicht, wer die Tür öffnete, und berichtet nur Erinnerung und Wahrnehmung", "Er kennt den vollständigen Feuerwehrbericht", "Er verfügt über die gemeinsame Version aller Zeugen"], ["He did not see who opened the door and reports only memory and perception", "He knows the full fire-service report", "He has the shared version of every witness"]),
    q("Wie wird die später bestätigte Information dargestellt?", "How is the later confirmed information presented?", ["Mit se supo und der Zuschreibung an mehrere Zeugen", "Als vollständige direkte Erinnerung des Erzählers", "Durch einen während des Vorfalls gegebenen Befehl"], ["With se supo and attribution to several witnesses", "As the narrator's complete direct memory", "Through an order given during the incident"])
  ],
  "checkpoint-c1-narrative-viewpoint": [
    q("Was war vor der Ankunft des Erzählers bereits geschehen?", "What had already happened before the narrator arrived?", ["Das Gebäude war evakuiert worden", "Die Feuerwehr hatte die Prüfung beendet", "Alle waren ins Gebäude zurückgekehrt"], ["The building had been evacuated", "The firefighters had finished checking", "Everyone had returned to the building"]),
    q("Wie verändert sich die Erklärung des vermeintlichen Rauchs?", "How does the explanation of the supposed smoke change?", ["Zuerst gilt er als Wahrnehmung einer Person, später als Dampf eines Rohrbruchs", "Zuerst wird ein Brand bestätigt, später ein weiteres Stockwerk entdeckt", "Die erste Erklärung bleibt unkorrigiert"], ["It is first attributed to someone's perception and later identified as steam from a broken pipe", "A fire is first confirmed and another floor later discovered", "The first explanation remains uncorrected"])
  ],
  "c1-thesis-scope": [
    q("Welche These vertritt der Text?", "Which thesis does the text defend?", ["Verbesserung erfordert Beschränkungen, Nahverkehr und Ausnahmen gemeinsam", "Ein Totalverbot löst alle Probleme", "Verkehr sollte niemals begrenzt werden"], ["Improvement requires combining restrictions, public transport, and exceptions", "A total ban solves every problem", "Traffic should never be restricted"]),
    q("Was verhindert, dass die These zu absolut wird?", "What prevents the thesis from becoming too absolute?", ["Sie erkennt unterschiedliche Folgen an und begrenzt die Wirkung einer Einzelmaßnahme", "Sie entfernt alle Hinweise auf betroffene Gruppen", "Sie präsentiert Vorlieben als bewiesene Fakten"], ["It acknowledges different effects and limits what one measure can achieve", "It removes every reference to affected groups", "It presents preference as proven fact"])
  ],
  "c1-evidence-causality": [
    q("Was belegt die genannte Zahl unmittelbar?", "What does the stated figure directly demonstrate?", ["Die Besuche stiegen nach der Verlängerung der Öffnungszeiten", "Die Öffnungszeiten verursachten allein den gesamten Anstieg", "Neue Aktivitäten hatten keinerlei Wirkung"], ["Visits increased after opening hours were extended", "Opening hours alone caused the entire increase", "New activities had no effect"]),
    q("Warum bleibt die kausale Schlussfolgerung begrenzt?", "Why is the causal conclusion limited?", ["Mehrere Faktoren änderten sich gleichzeitig", "Es gibt keinerlei Besuchsdaten", "Korrelation beweist immer Ursache"], ["Several factors changed at the same time", "There are no visitor data", "Correlation always proves causation"])
  ],
  "c1-source-integration": [
    q("Worin stimmen beide Quellen überein?", "What do both sources agree on?", ["Nach dem Radwegbau gibt es weniger Verkehr", "Alle Ladezonen müssen verschwinden", "Die Maßnahme bewirkte keine Veränderung"], ["Traffic fell after the cycle lane was created", "Every loading zone must be removed", "The measure produced no change"]),
    q("Was leistet die abschließende Synthese zusätzlich?", "What does the final synthesis add?", ["Sie verbindet die beobachtete Verbesserung mit notwendiger Anpassung", "Sie schreibt beiden Quellen eine fremde Meinung zu", "Sie ersetzt Berichte durch persönliche Erfahrung"], ["It combines observed improvement with the need for adjustment", "It attributes a view to both sources that neither expresses", "It replaces reports with personal experience"])
  ],
  "c1-counterargument-rebuttal": [
    q("Was räumt der Autor der Gegenposition ein?", "What does the author concede to the opposing position?", ["Es bestehen echte Risiken für Koordination und soziale Einbindung", "Homeoffice muss vollständig abgeschafft werden", "Autonomie besitzt keinen Wert"], ["There are real risks to coordination and social connection", "Remote work must be eliminated completely", "Autonomy has no value"]),
    q("Wie beantwortet der Autor den Einwand?", "How does the author answer the objection?", ["Mit einem flexiblen Modell aus Begegnungen und Präsenztagen", "Er ignoriert die genannten Risiken", "Er wechselt zum Thema Gehälter"], ["With a flexible model including meetings and in-person days", "He ignores the stated risks", "He changes the subject to salaries"])
  ],
  "c1-synthesis-recommendation": [
    q("Warum wird keine sofortige vollständige Ausweitung empfohlen?", "Why is immediate full expansion not recommended?", ["Ergebnisse und Kosten unterscheiden sich, und Unsicherheit bleibt", "Der Versuch brachte keinerlei Einsparung", "Wartung war unmöglich"], ["Results and costs vary, and uncertainty remains", "The trial produced no savings", "Maintenance was impossible"]),
    q("Was macht die Empfehlung verhältnismäßig?", "What makes the recommendation proportionate?", ["Schrittweise Ausweitung, Prioritäten und spätere Überprüfung", "Sie erklärt das Ergebnis für endgültig", "Sie verzichtet auf jede Kontrollbedingung"], ["Gradual expansion, priorities, and later review", "It presents the result as final", "It removes every monitoring condition"])
  ],
  "checkpoint-c1-argument-synthesis": [
    q("Welche Schlussfolgerung stützen die vorhandenen Belege?", "Which conclusion is supported by the available evidence?", ["Vor einer Verallgemeinerung sind breitere Versuche sinnvoll", "Das Modell wirkt in allen Branchen gleich", "Jeder weitere Versuch sollte aufgegeben werden"], ["Broader trials are advisable before generalizing the model", "The model works identically in every sector", "Any further trial should be abandoned"]),
    q("Welche Einschränkung verhindert eine allgemeingültige Schlussfolgerung?", "Which limitation prevents a universal conclusion?", ["Stichproben und Messungen decken weder alle Branchen noch Langzeitfolgen ab", "Die Studien maßen weder Zufriedenheit noch Fehlzeiten", "Beide Studien bewiesen allgemein sinkende Produktivität"], ["Samples and measurements cover neither all sectors nor long-term effects", "The studies measured neither satisfaction nor absence", "Both studies proved a general fall in productivity"])
  ],
  "c1-implicit-meaning": [
    q("Was beabsichtigt die erste Person?", "What does the first speaker intend?", ["Höflich darum bitten, das Fenster zu schließen", "Fragen, ob das Fenster kaputt ist", "Erklären, dass weiter gelüftet werden soll"], ["Politely ask for the window to be closed", "Ask whether the window is broken", "State that ventilation should continue"]),
    q("Was zeigt die Antwort der zweiten Person?", "What does the second speaker's response reveal?", ["Sie hatte die Situation anders verstanden", "Sie weigert sich, das Fenster zu schließen", "Sie hat die Bitte nicht gehört"], ["They had interpreted the situation differently", "They refuse to close the window", "They did not hear the request"])
  ],
  "c1-diplomatic-softening": [
    q("Welche Änderung verlangt die zweite Person?", "What change does the second speaker request?", ["Die zweite Schlussfolgerung besser begründen", "Die gesamte Struktur entfernen", "Den Bericht ungeprüft versenden"], ["Justify the second conclusion more clearly", "Remove the entire structure", "Send the report without reviewing it"]),
    q("Warum bleibt die Antwort trotz Abschwächung eindeutig?", "Why does the response remain clear despite softening?", ["Sie nennt Problem und Frist ausdrücklich", "Sie vermeidet jede konkrete Handlung", "Sie ersetzt Kritik durch eine kontextlose Frage"], ["It explicitly names the problem and deadline", "It avoids every concrete action", "It turns criticism into a contextless question"])
  ],
  "c1-turn-management": [
    q("Wie steigt die zweite Person in das Gespräch ein?", "How does the second speaker enter the conversation?", ["Sie bittet um Raum für einen anschließenden Gedanken", "Sie unterbricht ohne Signal und wechselt das Thema", "Sie wartet bis zum Sitzungsende"], ["They ask for space to add a connected point", "They interrupt and change topic without a signal", "They wait until the meeting ends"]),
    q("Welche Funktion hat te cedo la palabra?", "What function does te cedo la palabra serve?", ["Es übergibt das Rederecht an eine andere Person", "Es weist die vorherige Frage zurück", "Es beendet das Gespräch endgültig"], ["It yields the floor to another participant", "It rejects the previous question", "It ends the conversation permanently"])
  ],
  "c1-conversation-repair": [
    q("Was war zuvor falsch verstanden worden?", "What had been misunderstood?", ["Der Test am Donnerstag sei bereits abgesagt", "Die Entscheidung werde am Donnerstag getroffen", "Ein Test sei nie vorgesehen gewesen"], ["Thursday's trial had already been canceled", "The decision would be made on Thursday", "No trial had ever been planned"]),
    q("Wie prüfen die Beteiligten, ob die Klärung funktioniert hat?", "How do the speakers check that repair has succeeded?", ["Eine Person fasst die Vereinbarung zusammen und erhält Bestätigung", "Beide wechseln sofort das Thema", "Sie wiederholen die mehrdeutige Formulierung wörtlich"], ["One speaker summarizes the agreement and receives confirmation", "Both immediately change the subject", "They repeat the ambiguous wording exactly"])
  ],
  "c1-tone-stance": [
    q("Welche Haltung drückt Julia tatsächlich aus?", "What attitude does Julia actually express?", ["Frustration über mangelnde Planung", "Begeisterung für Handeln ohne Vorbereitung", "Gleichgültigkeit gegenüber dem Programm"], ["Frustration at the lack of planning", "Enthusiasm for acting without preparation", "Indifference toward the program"]),
    q("Wodurch lässt sich die Ironie erkennen?", "What makes the irony recognizable?", ["Durch den Gegensatz zwischen positiven Worten und negativem Kontext", "Durch ein genaues Datum", "Durch das völlige Ausbleiben einer Gruppenreaktion"], ["The contrast between positive words and negative context", "The presence of an exact date", "The complete absence of group reaction"])
  ],
  "checkpoint-c1-pragmatic-interaction": [
    q("Welche kommunikative Abfolge entwickelt der Dialog?", "What communicative sequence does the dialogue develop?", ["Indirekte Kritik, diplomatischer Vorschlag, Klärung und Bestätigung", "Wörtliches Lob, Ablehnung, Themenwechsel und Abschied", "Direkter Befehl, sofortige Zustimmung und Schweigen"], ["Indirect criticism, diplomatic proposal, clarification, and confirmation", "Literal praise, rejection, topic change, and farewell", "Direct order, immediate agreement, and silence"]),
    q("Warum ist die abschließende Zusammenfassung wirksam?", "Why is the final summary effective?", ["Sie überführt gemeinsames Verständnis in zwei konkrete Handlungen und Zeitpunkte", "Sie hält die Termine bewusst mehrdeutig", "Sie vermeidet die Antwort zu den Lieferungen"], ["It turns shared understanding into two concrete actions and times", "It deliberately keeps the dates ambiguous", "It avoids answering the question about deliveries"])
  ],
  "c1-relative-reference": [
    q("Warum steht conoce im Indicativo?", "Why is conoce in the indicative?", ["Es behauptet die Eigenschaft einer konkreten Übersetzerin", "Jeder Relativsatz verlangt Indicativo", "Der Rechtsbereich ist hypothetisch"], ["It asserts a quality of a specific translator", "Every relative clause requires the indicative", "The legal field is hypothetical"]),
    q("Was drückt alguien que pueda aus?", "What does alguien que pueda express?", ["Ein benötigtes Profil, dessen Person noch nicht identifiziert ist", "Eine konkrete Mitarbeiterin, die bereits zugesagt hat", "Die Verneinung jeder medizinischen Fähigkeit"], ["A needed profile whose person has not yet been identified", "A specific employee who has already agreed", "A denial of any medical ability"])
  ],
  "c1-future-time-clauses": [
    q("Warum steht recibimos im Indicativo?", "Why is recibimos in the indicative?", ["Es bezeichnet ein gestern abgeschlossenes Ereignis", "Cuando erlaubt niemals Subjuntivo", "Die Bestätigung ist noch ungewiss"], ["It presents an event completed yesterday", "Cuando never permits the subjunctive", "The confirmation is still uncertain"]),
    q("Welche Beziehung drückt hasta que hayan terminado aus?", "What relationship does hasta que hayan terminado express?", ["Eine zukünftige zeitliche Grenze vor dem Eintritt", "Eine tägliche Gewohnheit", "Ein bereits bestätigtes früheres Ereignis"], ["A future time boundary before entry", "A daily habit", "An already confirmed earlier event"])
  ],
  "c1-concession-certainty": [
    q("Was vermittelt aunque el presupuesto es limitado?", "What does aunque el presupuesto es limitado convey?", ["Die Einschränkung wird als reale Tatsache anerkannt", "Niemand weiß, ob es ein Budget gibt", "Das Projekt hängt von der Verneinung der Grenze ab"], ["The limitation is accepted as a real fact", "Nobody knows whether a budget exists", "The project depends on denying the limitation"]),
    q("Warum steht surjan im Subjuntivo?", "Why is surjan in the subjunctive?", ["Es umfasst mögliche, noch nicht identifizierte Ausgaben", "Aunque verlangt immer Subjuntivo", "Die Ausgaben wurden gestern erfasst"], ["It covers possible expenses not yet identified", "Aunque always requires the subjunctive", "The expenses were recorded yesterday"])
  ],
  "c1-purpose-prevention": [
    q("Warum wird in para reducir der Infinitiv verwendet?", "Why is the infinitive used in para reducir?", ["Dasselbe Team handelt und verfolgt das Ergebnis", "Reducir lässt sich nicht konjugieren", "Die Nutzer führen beide Handlungen aus"], ["The same team acts and pursues the result", "Reducir cannot be conjugated", "The users perform both actions"]),
    q("Was zeigt sin que los diseñadores intervinieran?", "What does sin que los diseñadores intervinieran show?", ["Der Test geschah ohne Eingreifen eines anderen Subjekts", "Die Designer führten den Test allein durch", "Das Eingreifen war das Hauptziel"], ["The trial occurred without another subject intervening", "The designers conducted the trial alone", "Intervention was the main objective"])
  ],
  "c1-open-contingency": [
    q("Was haben quien necesite und donde le resulte gemeinsam?", "What do quien necesite and donde le resulte have in common?", ["Die konkreten Bezüge bleiben offen und werden später bestimmt", "Sie beschreiben bereits bekannte Personen und Orte", "Sie verneinen, dass jemand Hilfe verlangen kann"], ["Their concrete referents remain open and will be determined later", "They describe already identified people and places", "They deny that anyone can request help"]),
    q("Welche Wirkung hat der Subjuntivo in diesen Strukturen?", "What effect does the subjunctive have in these structures?", ["Die Regel umfasst verschiedene nicht festgelegte Möglichkeiten", "Die Anweisungen werden zu vergangenen Tatsachen", "Hilfe wird auf einen bekannten Weg beschränkt"], ["The rule covers different unspecified possibilities", "The instructions become past facts", "Help is limited to one known route"])
  ],
  "checkpoint-c1-mood-meaning": [
    q("Welchen Gegensatz erklärt atiende gegenüber necesite?", "What contrast explains atiende versus necesite?", ["Ersteres beschreibt ein reales Team, Letzteres jede mögliche künftige Person", "Ersteres drückt Zweifel, Letzteres eine bekannte Person aus", "Beide beziehen sich nur auf die Vergangenheit"], ["The first describes a real team, the second any future person", "The first expresses doubt, the second a known person", "Both refer only to the past"]),
    q("Was organisiert der Subjuntivo im gesamten Text?", "What does the subjunctive organize throughout the text?", ["Zwecke, zukünftige Grenzen und noch offene oder unbekannte Fälle", "Nur bereits bestätigte Gewohnheiten", "Eine Liste unmöglicher Handlungen"], ["Purposes, future boundaries, and cases still open or unidentified", "Only already confirmed habits", "A list of impossible actions"])
  ]
};

const explanationByRange = (slug) => {
  if (["c1-narrative-tempo", "c1-flashback-foreshadowing", "c1-viewpoint-distance", "c1-participial-compression", "c1-narrative-voice", "checkpoint-c1-narrative-viewpoint"].includes(slug)) return "The answer preserves the event sequence, information source, and viewpoint established by the text.";
  if (["c1-thesis-scope", "c1-evidence-causality", "c1-source-integration", "c1-counterargument-rebuttal", "c1-synthesis-recommendation", "checkpoint-c1-argument-synthesis"].includes(slug)) return "The answer matches the scope of the evidence and the conclusion the text actually supports.";
  if (["c1-implicit-meaning", "c1-diplomatic-softening", "c1-turn-management", "c1-conversation-repair", "c1-tone-stance", "checkpoint-c1-pragmatic-interaction"].includes(slug)) return "The answer connects the wording with its function in the specific interaction.";
  return "The mood choice follows the status of the information in the full context, not the introductory word alone.";
};

async function main() {
  const entries = Object.entries(localizedQuestions);
  const lessons = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true, readingJson: true } });
  if (lessons.length !== entries.length) throw new Error(`C1 German comprehension requires ${entries.length} lessons, found ${lessons.length}.`);
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

  for (const [slug, localized] of entries) {
    const current = bySlug.get(slug).readingJson;
    if (!Array.isArray(current?.questions) || current.questions.length !== localized.length) throw new Error(`${slug} has an unexpected question structure.`);
    const questions = current.questions.map((question, index) => ({
      ...question,
      ...localized[index],
      explanationEn: explanationByRange(slug)
    }));
    await prisma.lesson.update({ where: { slug }, data: { readingJson: { ...current, questions } } });
  }
  console.log(`Localized German and optional English comprehension for ${entries.length} C1 packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { localizedQuestions };
