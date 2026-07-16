import { germanCourseSentenceMeaning } from "./course-sentence-meanings.mjs";

const GERMAN_EXERCISE_QUESTIONS = {
  "Which row shows the five Spanish vowels in order?": "Welche Reihe zeigt die fünf spanischen Vokale in der richtigen Reihenfolge?",
  "Which word is the anchor for the Spanish vowel u?": "Welches Wort dient als Klanganker für den spanischen Vokal u?",
  "Which Spanish word begins with a silent h?": "Welches spanische Wort beginnt mit einem stummen h?",
  "Which spelling keeps a k sound before e?": "Welche Schreibweise erhält vor e den k-Laut?",
  "Which pair contrasts a single r with rr?": "Welches Wortpaar stellt ein einzelnes r einem rr gegenüber?",
  "Which letter pair normally does not create a meaning-changing sound contrast in Spanish?": "Welches Buchstabenpaar bildet im Spanischen normalerweise keinen bedeutungsunterscheidenden Lautkontrast?",
  "Which word needs a written accent in standard spelling?": "Welches Wort benötigt in der Standardschreibung ein Akzentzeichen?",
  "Which word normally carries final stress without a written accent?": "Welches Wort wird ohne Akzentzeichen normalerweise auf der letzten Silbe betont?",
  "Which sentence uses the complete Spanish question marks?": "Welcher Satz verwendet die vollständigen spanischen Fragezeichen?",
  "Which sentence contains an explicit spoken contrast?": "Welcher Satz enthält einen ausdrücklich markierten Gegensatz?",
  "Which example shows a meaning-changing r–rr contrast?": "Welches Beispiel zeigt einen bedeutungsunterscheidenden R/RR-Kontrast?",
  "Which word combines ñ with a written question context?": "Welches Wort verbindet ñ mit einem geschriebenen Fragekontext?",
  "After the store, what does the speaker want to do?": "Was möchte der Sprecher nach dem Einkauf tun?",
  "Ask where the station is.": "Frage auf Spanisch, wo der Bahnhof ist.",
  "I come home.": "Ich komme nach Hause.",
  "I eat breakfast.": "Ich frühstücke.",
  "In the cafe text, what does Ana prefer in the afternoon?": "Was bevorzugt Ana laut dem Café-Text am Nachmittag?",
  "Listen to the sentence.": "Höre den spanischen Satz und schreibe ihn auf.",
  "Say you need medicine for pain.": "Sage auf Spanisch, dass du ein Medikament gegen Schmerzen brauchst.",
  "Order two coffees to go.": "Bestelle auf Spanisch zwei Kaffee zum Mitnehmen.",
  "Summarize: Ana works, goes to a cafe, and prefers tea.": "Fasse auf Spanisch zusammen: Ana arbeitet, geht in ein Café und bevorzugt Tee.",
  "The hotel is near the station.": "Das Hotel ist in der Nähe des Bahnhofs.",
  "Type what you hear.": "Schreibe den spanischen Satz auf, den du hörst.",
  "What does Ana prefer in the afternoon?": "Was bevorzugt Ana am Nachmittag?",
  "What does the speaker have to buy?": "Was muss der Sprecher kaufen?",
  "When does Ana work?": "Wann arbeitet Ana?",
  "Where is the cafe?": "Wo ist das Café?",
  "Why does Me gustan las películas use gustan?": "Warum steht in „Me gustan las películas“ die Form „gustan“?",
  "Write the key sentence you hear.": "Schreibe den entscheidenden spanischen Satz auf, den du hörst.",
  "Write: At night I read and go to bed.": "Schreibe auf Spanisch: Abends lese ich und gehe ins Bett.",
  "Write: I like music, but I prefer movies.": "Schreibe auf Spanisch: Ich mag Musik, aber ich bevorzuge Filme.",
  "Write: I wake up at seven and eat breakfast at eight.": "Schreibe auf Spanisch: Ich wache um sieben Uhr auf und frühstücke um acht Uhr.",
  "Write: I want to go to the store, but I have to work.": "Schreibe auf Spanisch: Ich möchte zum Geschäft gehen, aber ich muss arbeiten.",
  "You need the station.": "Sage auf Spanisch: Du brauchst den Bahnhof.",
  "Which sentence identifies Marta as the direct object?": "Welcher Satz kennzeichnet Marta als direkt betroffenes Personenobjekt?",
  "I see Marta every morning.": "Ich sehe Marta jeden Morgen.",
  "I am looking for any available doctor.": "Ich suche irgendeinen verfügbaren Arzt.",
  "We are looking for the doctor.": "Wir suchen den bestimmten Arzt.",
  "I have two brothers.": "Ich habe zwei Brüder.",
  "I know your parents.": "Ich kenne deine Eltern.",
  "Say that you are waiting for Daniel.": "Sage auf Spanisch, dass du auf Daniel wartest.",
  "Marta sees me every morning.": "Marta sieht mich jeden Morgen.",
  "I will call you this afternoon.": "Ich rufe dich heute Nachmittag an.",
  "Ana helps us with the problem.": "Ana hilft uns bei dem Problem.",
  "Could you give me the menu, please?": "Könnten Sie mir bitte die Speisekarte geben?",
  "I am sending you the address now.": "Ich schicke dir jetzt die Adresse.",
  "Promise to call the other person this afternoon.": "Versprich auf Spanisch, die andere Person heute Nachmittag anzurufen.",
  "Say that nobody is in the office.": "Sage auf Spanisch, dass niemand im Büro ist.",
  "Agree that you do not like driving either.": "Stimme auf Spanisch zu, dass du ebenfalls nicht gern Auto fährst.",
  "Say that you do not know anyone available either.": "Sage auf Spanisch, dass du ebenfalls niemanden kennst, der verfügbar ist.",
  "Say that you are looking for a quiet area.": "Sage auf Spanisch, dass du eine ruhige Gegend suchst.",
  "Ask whether there is any problem.": "Frage auf Spanisch, ob es irgendein Problem gibt.",
  "Recommend the first apartment as a great option.": "Empfiehl die erste Wohnung auf Spanisch als eine großartige Möglichkeit.",
  "Say that you drink a lot of water.": "Sage auf Spanisch, dass du viel Wasser trinkst.",
  "Compare your small room with the other person's large room.": "Vergleiche auf Spanisch dein kleines Zimmer mit dem großen Zimmer der anderen Person.",
  "Say that the quietest room is the other person's.": "Sage auf Spanisch, dass das ruhigste Zimmer der anderen Person gehört.",
  "Say that you go to the market.": "Sage auf Spanisch, dass du zum Markt gehst.",
  "Ask for the other person's phone number.": "Frage die andere Person auf Spanisch nach ihrer Telefonnummer.",
  "Ask which hotel belongs to the other person?": "Frage auf Spanisch, welches Hotel das der anderen Person ist."
};

export function germanExerciseQuestion(question) {
  const source = String(question || "").trim();
  return GERMAN_EXERCISE_QUESTIONS[source] || germanCourseSentenceMeaning(source) || "";
}

export function looksLikeEnglishLearningText(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (/(?:^|[^\p{L}])I(?:$|[^\p{L}])/u.test(text)) return true;
  const englishMarkers = new Set([
    "you", "she", "we", "they", "my", "your", "our", "their", "his", "her", "its", "the", "this", "that",
    "these", "those", "it", "am", "is", "are", "was", "were", "have", "does", "did", "can", "could",
    "would", "should", "will", "because", "before", "after", "today", "tomorrow", "what", "when", "where", "why",
    "how", "which", "who", "whose", "ask", "answer", "choose", "hear", "listen", "order", "read",
    "repeat", "reply", "say", "speaker", "summarize", "translate", "type", "write", "word", "words", "sentence",
    "sentences", "example", "examples", "student", "students", "teacher", "teachers", "learn", "learns", "learning",
    "grammar", "adjective", "adjectives", "noun", "nouns", "verb", "verbs", "good", "bad", "first", "second",
    "meaning", "means", "show", "shows", "describes", "express", "expresses"
  ]);
  return (text.toLowerCase().match(/\p{L}+/gu) || []).some((token) => englishMarkers.has(token));
}

export const germanExerciseQuestionKeys = Object.freeze(Object.keys(GERMAN_EXERCISE_QUESTIONS));
