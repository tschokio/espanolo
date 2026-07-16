const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();
const CORE_EXERCISE_COUNT = 10;
const CHECKPOINT_EXERCISE_COUNT = 12;

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const slugPart = (value) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

const tokensForBuilder = (sentence) => String(sentence || "").match(/[\p{L}\p{N}]+|[¿?¡!.,]/gu) || [];

const acceptedSentence = (sentence) => {
  const plain = normalize(sentence);
  return [...new Set([plain, `${plain}.`, `${plain}?`, `${plain}!`])];
};

const lowerRaw = (value) => String(value || "").toLocaleLowerCase("es");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasRawSpanishToken(rawText, token) {
  if (!token) return false;
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(lowerRaw(token))}([^\\p{L}\\p{N}]|$)`, "u").test(rawText);
}

function hasNormalizedTerm(normalizedText, term) {
  if (!term || term.length < 3) return false;
  return new RegExp(`(^|\\s)${escapeRegExp(term)}(\\s|$)`).test(normalizedText);
}

function lessonTeachingCorpus(lesson) {
  const pieces = [
    lesson.title,
    lesson.summary,
    lesson.situation,
    lesson.reviewSummary,
    ...(lesson.sentences || []).flatMap((sentence) => [sentence.spanish, sentence.english, sentence.note])
  ].filter(Boolean);
  const raw = lowerRaw(pieces.join(" "));
  return {
    raw,
    normalized: normalize(raw)
  };
}

function vocabularySearchTerms(word) {
  const spanish = normalize(word.spanish);
  const english = normalize(word.english);
  const terms = new Set([spanish, english].filter((term) => term.length >= 3));
  const spanishWithoutArticle = spanish.replace(/^(el|la|los|las|un|una|unos|unas)\s+/, "");
  const englishWithoutTo = english.replace(/^to\s+/, "");
  if (spanishWithoutArticle.length >= 3) terms.add(spanishWithoutArticle);
  if (englishWithoutTo.length >= 3) terms.add(englishWithoutTo);
  return [...terms];
}

function vocabularyWordIsTaught(word, corpus) {
  if (word.partOfSpeech === "pronoun") {
    return hasRawSpanishToken(corpus.raw, word.spanish);
  }
  return vocabularySearchTerms(word).some((term) => hasNormalizedTerm(corpus.normalized, term));
}

function semanticImageKey(text, fallback) {
  const normalized = normalize(text);
  if (/\b(no tengo (un |el )?mapa|do not have (a |the )?map)\b/.test(normalized)) return "wants-needs-and-possession:2";
  if (/\b(tengo (un |el )?mapa|i have (a |the )?map)\b/.test(normalized)) return "wants-needs-and-possession:1";
  if (/\b(necesito (la |las )?llave|need (the )?keys?)\b/.test(normalized)) return "wants-needs-and-possession:3";
  if (/\b(tengo (una |la )?llave|i have (a |the )?key)\b/.test(normalized)) return "wants-needs-and-possession:4";
  if (/\b(tengo una mochila|i have a backpack)\b/.test(normalized)) return "wants-needs-and-possession:5";
  if (/\b(necesito (el |un )?pasaporte|need (the |a )?passport)\b/.test(normalized)) return "wants-needs-and-possession:6";
  if (/\b(tengo (el |un )?pasaporte|i have (the |a )?passport)\b/.test(normalized)) return "wants-needs-and-possession:7";
  if (/\b(quiero agua|i want water)\b/.test(normalized)) return "wants-needs-and-possession:8";
  if (/\b(quiero (un )?cafe|i want (a )?coffee)\b/.test(normalized)) return "wants-needs-and-possession:9";
  if (/\b(quiero una naranja|i want an orange)\b/.test(normalized)) return "wants-needs-and-possession:10";
  if (/\b(necesitamos una mesa|we need a table|mesa para dos|table for two|quisiera una mesa)\b/.test(normalized)) return "wants-needs-and-possession:11";
  if (/\b(necesito ayuda|i need help|need help)\b/.test(normalized)) return "wants-needs-and-possession:12";
  if (/\b(necesito (un )?taxi|i need a taxi)\b/.test(normalized)) return "wants-needs-and-possession:13";
  if (/\b(necesito (un )?doctor|i need a doctor)\b/.test(normalized)) return "wants-needs-and-possession:14";
  if (/\b(traigo una bolsa|bring a bag)\b/.test(normalized)) return "wants-needs-and-possession:15";
  if (/\b(doy el libro a ana|give the book to ana)\b/.test(normalized)) return "wants-needs-and-possession:16";

  if (/\b(el libro esta en la mesa|book is on the table)\b/.test(normalized)) return "object-location-scenes:1";
  if (/\b(la mochila esta en la silla|backpack is on the chair)\b/.test(normalized)) return "object-location-scenes:2";
  if (/\b(las llaves estan en la cocina|keys are in the kitchen)\b/.test(normalized)) return "object-location-scenes:3";
  if (/\b(el lapiz esta en la mesa|pencil is on the table)\b/.test(normalized)) return "object-location-scenes:4";
  if (/\b(el vaso esta en la mesa|glass is on the table)\b/.test(normalized)) return "object-location-scenes:5";
  if (/\b(pelota.*debajo.*silla|ball.*under.*chair)\b/.test(normalized)) return "object-location-scenes:6";
  if (/\b(mochila.*al lado.*escritorio|backpack.*beside.*desk)\b/.test(normalized)) return "object-location-scenes:7";
  if (/\b(lampara.*mesa auxiliar|lamp.*side table)\b/.test(normalized)) return "object-location-scenes:8";
  if (/\b(libro.*debajo.*silla|book.*under.*chair)\b/.test(normalized)) return "object-location-scenes:9";
  if (/\b(llave.*al lado.*libro|key.*beside.*book)\b/.test(normalized)) return "object-location-scenes:10";
  if (/\b(taza.*en la mesa|cup.*on the table)\b/.test(normalized)) return "object-location-scenes:11";
  if (/\b(gato.*en la silla|cat.*on the chair)\b/.test(normalized)) return "object-location-scenes:12";
  if (/\b(pajaro.*en el arbol|bird.*in the tree)\b/.test(normalized)) return "object-location-scenes:13";
  if (/\b(arbol.*en el parque|tree.*in the park)\b/.test(normalized)) return "object-location-scenes:14";
  if (/\b(tienda.*al lado.*cafe|store.*beside.*cafe)\b/.test(normalized)) return "object-location-scenes:15";
  if (/\b(estoy en el cafe|i am in the cafe)\b/.test(normalized)) return "object-location-scenes:16";
  if (/\b(estoy en la biblioteca|i am in the library)\b/.test(normalized)) return "object-location-scenes:17";
  if (/\b(estoy en casa|i am at home)\b/.test(normalized)) return "object-location-scenes:18";
  if (/\b(estoy en la estacion|i am in the station)\b/.test(normalized)) return "object-location-scenes:19";
  if (/\b(estoy en el museo|i am in the museum)\b/.test(normalized)) return "object-location-scenes:20";
  if (/\b(la tienda esta cerca|store is near)\b/.test(normalized)) return "object-location-scenes:21";
  if (/\b(el museo esta lejos|museum is far)\b/.test(normalized)) return "object-location-scenes:22";
  if (/\b(restaurante.*al lado.*plaza|restaurant.*beside.*plaza)\b/.test(normalized)) return "object-location-scenes:24";
  if (/\b(maleta.*al lado.*puerta.*hotel|suitcase.*beside.*hotel.*door)\b/.test(normalized)) return "object-location-scenes:25";

  if (/\b(siga derecho|go straight)\b/.test(normalized)) return "directions-and-question-intents:1";
  if (/\b(gire a la izquierda|turn left)\b/.test(normalized)) return "directions-and-question-intents:2";
  if (/\b(gire a la derecha|turn right)\b/.test(normalized)) return "directions-and-question-intents:3";
  if (/\b(direccion del hotel|address.*hotel)\b/.test(normalized)) return "directions-and-question-intents:6";
  if (/\b(donde esta el hotel|where is the hotel)\b/.test(normalized)) return "directions-and-question-intents:9";
  if (/\b(donde esta la estacion|where is the station)\b/.test(normalized)) return "directions-and-question-intents:10";
  if (/\b(donde esta el museo|where is the museum)\b/.test(normalized)) return "directions-and-question-intents:11";
  if (/\b(donde esta el restaurante|where is the restaurant)\b/.test(normalized)) return "directions-and-question-intents:12";
  if (/\b(hotel.*cerca.*estacion|station.*near.*hotel)\b/.test(normalized)) return "object-location-scenes:23";
  if (/\b(que quieres|what do you want)\b/.test(normalized)) return "directions-and-question-intents:20";
  if (/\b(quien|who)\b/.test(normalized)) return "directions-and-question-intents:21";
  if (/\b(cuando|when)\b/.test(normalized)) return "directions-and-question-intents:23";

  if (/\b(me duele la cabeza|my head hurts)\b/.test(normalized) && /\b(farmacia|pharmacy|medicina|medicine)\b/.test(normalized)) return "pharmacy-and-medicine:4";
  if (/\b(necesito medicina|need medicine|ask for medicine)\b/.test(normalized)) return "pharmacy-and-medicine:3";
  if (/\b(alergia|allergy|aspirina|aspirin)\b/.test(normalized)) return "pharmacy-and-medicine:7";
  if (/\b(cada cuanto|how often)\b/.test(normalized)) return "pharmacy-and-medicine:9";

  if (/\b(no entiendo|do not understand)\b/.test(normalized)) return "communication-repair:8";
  if (/\b(mas despacio|more slowly)\b/.test(normalized)) return "communication-repair:9";
  if (/\b(puede repetir|please repeat|can you repeat)\b/.test(normalized)) return "communication-repair:10";
  if (/\b(cuanto cuesta|how much does it cost)\b/.test(normalized)) return "communication-repair:12";
  if (/\b(la cuenta|the bill)\b/.test(normalized)) return "communication-repair:13";
  if (/\b(que recomienda|what do you recommend)\b/.test(normalized)) return "communication-repair:14";
  if (/\b(gracias|thank you)\b/.test(normalized)) return "communication-repair:4";
  if (/\b(perdon|sorry|excuse me)\b/.test(normalized)) return "communication-repair:7";
  if (/\b(por favor|please)\b/.test(normalized)) return "communication-repair:5";

  if (/\b(seis uvas|six grapes)\b/.test(normalized)) return "quantities-and-clear-colors:11";
  if (/\b(siete libros|seven books)\b/.test(normalized)) return "quantities-and-clear-colors:12";
  if (/\b(ocho manzanas|eight apples)\b/.test(normalized)) return "quantities-and-clear-colors:13";
  if (/\b(nueve fresas|nine strawberries)\b/.test(normalized)) return "quantities-and-clear-colors:14";
  if (/\b(diez|ten)\b/.test(normalized)) return "quantities-and-clear-colors:10";
  if (/\b(nueve|nine)\b/.test(normalized)) return "quantities-and-clear-colors:9";
  if (/\b(ocho|eight)\b/.test(normalized)) return "quantities-and-clear-colors:8";
  if (/\b(siete|seven)\b/.test(normalized)) return "quantities-and-clear-colors:7";
  if (/\b(seis|six)\b/.test(normalized)) return "quantities-and-clear-colors:6";
  if (/\b(cinco|five)\b/.test(normalized)) return "quantities-and-clear-colors:5";
  if (/\b(cuatro|four)\b/.test(normalized)) return "quantities-and-clear-colors:4";
  if (/\b(tres|three)\b/.test(normalized)) return "quantities-and-clear-colors:3";
  if (/\b(dos|two)\b/.test(normalized)) return "quantities-and-clear-colors:2";
  if (/\b(uno|one)\b/.test(normalized)) return "quantities-and-clear-colors:1";
  if (/\b(tomate.*roj|red tomato|manzana.*roj|red apple|apple is red)\b/.test(normalized)) return "quantities-and-clear-colors:24";
  if (/\b(camisa.*amarill|yellow shirt|shirt is yellow)\b/.test(normalized)) return "quantities-and-clear-colors:15";
  if (/\b(camisa.*blanc|white shirt|shirt is white)\b/.test(normalized)) return "quantities-and-clear-colors:22";
  if (/\b(mochila.*negr|black backpack|backpack is black)\b/.test(normalized)) return "quantities-and-clear-colors:23";
  if (/\b(rojo|roja|red)\b/.test(normalized)) return "quantities-and-clear-colors:16";
  if (/\b(azul|blue)\b/.test(normalized)) return "quantities-and-clear-colors:17";
  if (/\b(verde|green)\b/.test(normalized)) return "quantities-and-clear-colors:18";
  if (/\b(amarillo|amarilla|yellow)\b/.test(normalized)) return "quantities-and-clear-colors:19";
  if (/\b(blanco|blanca|white)\b/.test(normalized)) return "quantities-and-clear-colors:20";
  if (/\b(negro|negra|black)\b/.test(normalized)) return "quantities-and-clear-colors:21";
  if (/\b(me llamo|my name is)\b/.test(normalized)) return "communication-repair:2";
  if (/\b(yo soy ana|soy ana|i am ana)\b/.test(normalized)) return "identity-and-introductions:1";
  if (/\b(soy de|from austria)\b/.test(normalized)) return "communication-repair:3";
  if (/\b(hola|hello)\b/.test(normalized)) return "communication-repair:1";
  if (/^yo i\b/.test(normalized) || normalized === "yo") return "subject-pronouns-and-roles:1";
  if (/^tu you\b/.test(normalized) || normalized === "tu") return "subject-pronouns-and-roles:3";
  if (/^ella she\b/.test(normalized) || normalized === "ella") return "subject-pronouns-and-roles:5";
  if (/^(el he|he el)\b/.test(normalized) || normalized === "el" || /\bel means he\b/.test(normalized)) return "subject-pronouns-and-roles:4";
  if (/\b(nosotros|we)\b/.test(normalized)) return "subject-pronouns-and-roles:6";
  if (/\b(ellos|they)\b/.test(normalized)) return "subject-pronouns-and-roles:7";
  if (/\b(yo soy estudiante|yo estudiante|i am a student)\b/.test(normalized)) return "identity-and-introductions:8";
  if (/\b(ana esta cansada|ana is tired)\b/.test(normalized)) return "identity-and-introductions:9";
  if (/\b(nervios|nervous)\b/.test(normalized)) return "emotions-and-states:4";
  if (/\b(cansad|tired)\b/.test(normalized)) return "emotions-and-states:3";
  if (/\b(feliz|happy)\b/.test(normalized)) return "emotions-and-states:1";
  if (/\b(estoy en casa|ella esta en casa|i am at home|she is at home)\b/.test(normalized)) return "identity-and-introductions:7";
  if (/\b(me gusta el cafe|like coffee)\b/.test(normalized)) return "preferences-and-hobbies:7";
  if (/\b(en el cafe|in the cafe|where is the cafe)\b/.test(normalized)) return "places-around-town:1";
  if (/\b(un cafe|a coffee|coffee please|coffees|quiero.*cafe|order.*coffee)\b/.test(normalized)) return "food-and-ordering:2";
  if (/\b(la cuenta|the bill)\b/.test(normalized)) return "food-and-ordering:18";
  if (/\b(menu)\b/.test(normalized)) return "food-and-ordering:17";
  if (/\b(mesa para dos|table for two|cuantas personas)\b/.test(normalized)) return "food-and-ordering:19";
  if (/\b(para llevar|to go)\b/.test(normalized)) return "food-and-ordering:20";
  if (/\b(sopa|soup)\b/.test(normalized)) return "food-and-ordering:5";
  if (/\b(pan|bread)\b/.test(normalized)) return "food-and-ordering:3";
  if (/\b(dos manzanas|two apples)\b/.test(normalized)) return "numbers-and-colors:2";
  if (/\b(la manzana es roja|apple is red)\b/.test(normalized)) return "numbers-and-colors:7";
  if (/\b(manzana|apple)\b/.test(normalized)) return "fruit-and-produce:1";
  if (/\b(platano|banana)\b/.test(normalized)) return "fruit-and-produce:2";
  if (/\b(naranja|orange)\b/.test(normalized)) return "fruit-and-produce:3";
  if (/\b(limon|lemon)\b/.test(normalized)) return "fruit-and-produce:4";
  if (/\b(fresa|strawberr)\b/.test(normalized)) return "fruit-and-produce:5";
  if (/\b(uvas|grapes)\b/.test(normalized)) return "fruit-and-produce:6";
  if (/\b(pera|pear)\b/.test(normalized)) return "fruit-and-produce:7";
  if (/\b(tomate|tomato)\b/.test(normalized)) return "fruit-and-produce:11";
  if (/\b(ensalada|salad)\b/.test(normalized)) return "fruit-and-produce:24";
  if (/\b(fruta|fruit)\b/.test(normalized)) return "fruit-and-produce:20";
  if (/\b(taxi)\b/.test(normalized)) return "city-transport:3";
  if (/\b(hotel)\b/.test(normalized)) return "city-transport:13";
  if (/\b(estacion|station|platform)\b/.test(normalized)) return "city-transport:7";
  if (/\b(pasaporte|passport)\b/.test(normalized)) return "city-transport:11";
  if (/\b(mapa|map)\b/.test(normalized)) return "travel-and-survival:5";
  if (/\b(me duele.*cabeza|head hurts|my head hurts)\b/.test(normalized)) return "body-and-health:7";
  if (/\b(cabeza|head)\b/.test(normalized)) return "body-and-health:1";
  if (/\b(mano|hand)\b/.test(normalized)) return "body-and-health:2";
  if (/\b(ojo|eye)\b/.test(normalized)) return "body-and-health:3";
  if (/\b(boca|mouth)\b/.test(normalized)) return "body-and-health:4";
  if (/\b(pie|foot)\b/.test(normalized)) return "body-and-health:5";
  if (/\b(cuerpo|body)\b/.test(normalized)) return "body-and-health:6";
  if (/\b(doctor|medico)\b/.test(normalized)) return "body-and-health:12";
  if (/\b(farmacia|farmaceutica|pharmacy|pharmacist)\b/.test(normalized)) return "pharmacy-and-medicine:2";
  if (/\b(medicine|medicina)\b/.test(normalized)) return "pharmacy-and-medicine:1";
  if (/\b(hambre|hungry)\b/.test(normalized)) return "body-and-health:10";
  if (/\b(sed|thirsty)\b/.test(normalized)) return "body-and-health:11";
  if (/\b(tengo frio|i am cold)\b/.test(normalized)) return "body-and-health:8";
  if (/\b(tengo calor|i am hot)\b/.test(normalized)) return "body-and-health:9";
  if (/\b(no me gusta la lluvia|do not like rain)\b/.test(normalized)) return "preferences-and-hobbies:8";
  if (/\b(lluvia|rain)\b/.test(normalized)) return "weather-and-time:2";
  if (/\b(hace sol|sunny)\b/.test(normalized)) return "weather-and-time:1";
  if (/\b(prefiero la playa|prefer the beach)\b/.test(normalized)) return "preferences-and-hobbies:10";
  if (/\b(playa|beach)\b/.test(normalized)) return "places-around-town:16";
  if (/\b(me despierto|despertarse|wake up)\b/.test(normalized)) return "a2-daily-routine:1";
  if (/\b(me levanto|levantarse|get up)\b/.test(normalized)) return "a2-daily-routine:2";
  if (/\b(cepill|brush teeth)\b/.test(normalized)) return "a2-daily-routine:4";
  if (/\b(desayun|breakfast)\b/.test(normalized)) return "a2-daily-routine:6";
  if (/\b(trabajo por la manana|work in the morning)\b/.test(normalized)) return "identity-and-introductions:10";
  if (/\b(estudio por la tarde|study in the afternoon)\b/.test(normalized)) return "a2-daily-routine:8";
  if (/\b(limpio cada semana|clean every week)\b/.test(normalized)) return "a2-daily-routine:15";
  if (/\b(cocino|cook)\b/.test(normalized)) return "a2-daily-routine:9";
  if (/\b(limpio el cuarto|clean the room)\b/.test(normalized)) return "a2-daily-routine:10";
  if (/\b(me acuesto|acostarse|go to bed)\b/.test(normalized)) return "a2-daily-routine:11";
  if (/\b(por la noche.*le|read at night|at night.*read)\b/.test(normalized)) return "a2-daily-routine:12";
  if (/\b(leo|leer|read)\b/.test(normalized)) return "daily-actions:7";
  if (/\b(musica|music)\b/.test(normalized)) return "preferences-and-hobbies:1";
  if (/\b(peliculas|movies)\b/.test(normalized)) return "preferences-and-hobbies:2";
  if (/\b(futbol|soccer)\b/.test(normalized)) return "preferences-and-hobbies:3";
  if (/\b(el te|tea|prefieres cafe o te|prefiero el te)\b/.test(normalized)) return "preferences-and-hobbies:9";
  if (/\b(color favorito|favorite color)\b/.test(normalized)) return "preferences-and-hobbies:12";
  if (/\b(repetir|repeat)\b/.test(normalized)) return "communication-repair:10";
  if (/\b(libro|book)\b/.test(normalized)) return "classroom-basics:3";
  if (/\b(lapiz|pencil)\b/.test(normalized)) return "classroom-basics:4";
  if (/\b(biblioteca|library)\b/.test(normalized)) return "classroom-basics:10";
  if (/\b(profesora|teacher)\b/.test(normalized)) return "classroom-basics:2";
  if (/\b(estudiante|student)\b/.test(normalized)) return "classroom-basics:1";
  if (/\b(llave|keys?)\b/.test(normalized)) return "home-objects:8";
  if (/\b(mochila|backpack)\b/.test(normalized)) return "classroom-basics:8";
  if (/\b(silla|chair)\b/.test(normalized)) return "home-objects:2";
  if (/\b(mesa|table)\b/.test(normalized)) return "home-objects:1";
  if (/\b(tienda|store)\b/.test(normalized)) return "places-around-town:2";
  if (/\b(parque|park)\b/.test(normalized)) return "places-around-town:3";
  if (/\b(restaurante|restaurant)\b/.test(normalized)) return "places-around-town:10";
  if (/\b(museo|museum)\b/.test(normalized)) return "places-around-town:15";
  if (/\b(arbol|tree)\b/.test(normalized)) return "nature-and-animals:1";
  if (/\b(flor|flower)\b/.test(normalized)) return "nature-and-animals:2";
  if (/\b(perro|dog)\b/.test(normalized)) return "nature-and-animals:3";
  if (/\b(gato|cat)\b/.test(normalized)) return "nature-and-animals:4";
  if (/\b(pajaro|bird)\b/.test(normalized)) return "nature-and-animals:5";
  if (/\b(hablo|hablar|speak)\b/.test(normalized)) return "daily-actions:1";
  if (/\b(estudio|estudiar|study)\b/.test(normalized)) return "daily-actions:2";
  if (/\b(trabajo|trabajar|work)\b/.test(normalized)) return "daily-actions:3";
  if (/\b(compro|comprar|buy)\b/.test(normalized)) return "daily-actions:4";
  if (/\b(camino|caminamos|caminar|walk)\b/.test(normalized)) return "daily-actions:5";
  return fallback;
}

function choiceOptions(correct, distractors) {
  return [
    [correct, correct, true],
    ...distractors
      .filter(Boolean)
      .filter((item) => normalize(item) !== normalize(correct))
      .filter((item, index, list) => list.findIndex((candidate) => normalize(candidate) === normalize(item)) === index)
      .slice(0, 3)
      .map((item) => [item, item, false])
  ];
}

function sentenceExercises(lesson) {
  const exercises = [];
  const contextualSentences = lesson.sentences
    .map((sentence, index) => ({ sentence, index, words: tokensForBuilder(String(sentence.spanish || "").trim()) }))
    .filter(({ sentence, words }) => sentence.spanish?.trim() && sentence.english?.trim() && words.filter((word) => /[\p{L}\p{N}]/u.test(word)).length >= 2);

  for (const { sentence, index, words } of contextualSentences) {
    const spanish = sentence.spanish.trim();
    const english = sentence.english.trim();

    if (contextualSentences.length >= 3) {
      exercises.push({
        key: `recognize-${index + 1}`,
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Recognize the complete message.",
        instruction: "Choose the Spanish sentence that expresses this meaning.",
        questionText: english,
        answerJson: {
          correct: spanish,
          accepted: acceptedSentence(spanish),
          goal: "sentence_recognition"
        },
        explanation: sentence.note || `The matching Spanish sentence is: ${spanish}`,
        difficulty: 1,
        imageKey: semanticImageKey(`${spanish} ${english}`, lesson.imageKey),
        options: choiceOptions(spanish, contextualSentences.map((item) => item.sentence.spanish.trim()).filter((value) => value !== spanish))
      });
    }

    exercises.push({
      key: `translate-${index + 1}`,
      type: ExerciseType.TRANSLATION,
      prompt: "Active production.",
      instruction: "Type the Spanish sentence.",
      questionText: english,
      answerJson: {
        correct: spanish,
        accepted: acceptedSentence(spanish),
        goal: "active_production"
      },
      explanation: sentence.note || `A natural answer is: ${spanish}`,
      difficulty: 2,
      imageKey: semanticImageKey(`${spanish} ${english}`, lesson.imageKey),
      options: []
    });

    if (words.length >= 3 && words.length <= 10) {
      exercises.push({
        key: `builder-${index + 1}`,
        type: ExerciseType.SENTENCE_BUILDER,
        prompt: "Build the sentence.",
        instruction: "Put the words in order.",
        questionText: english,
        answerJson: {
          correctWords: words,
          goal: "word_order"
        },
        explanation: sentence.note || `The word order is: ${spanish}`,
        difficulty: 1,
        imageKey: semanticImageKey(`${spanish} ${english}`, lesson.imageKey),
        options: words.map((word) => [word, word, false])
      });
    }
  }
  return exercises;
}

function vocabularyExercises(lesson) {
  const corpus = lessonTeachingCorpus(lesson);
  const lessonWords = lesson.vocabularyGroups
    .flatMap((group) => group.words || [])
    .filter((word) => vocabularyWordIsTaught(word, corpus));
  const exercises = [];
  for (const [index, word] of lessonWords.entries()) {
    const distractors = lessonWords
      .filter((candidate) => candidate.id !== word.id)
      .map((candidate) => candidate.english)
      .filter(Boolean);
    const options = choiceOptions(word.english, distractors);
    if (options.length < 2) continue;

    exercises.push({
      key: `vocab-${index + 1}`,
      type: ExerciseType.MULTIPLE_CHOICE,
      prompt: "Vocabulary in this lesson.",
      instruction: "Choose the meaning.",
      questionText: word.spanish,
      answerJson: {
        correct: word.english,
        accepted: [word.english],
        goal: "vocabulary_recognition"
      },
      explanation: `${word.spanish} means ${word.english}.`,
      difficulty: 1,
      imageKey: semanticImageKey(`${word.spanish} ${word.english}`, word.imageKey),
      options
    });
  }
  return exercises;
}

function isCheckpointLesson(lesson) {
  return /checkpoint/i.test(`${lesson?.slug || ""} ${lesson?.theme || ""} ${lesson?.title || ""}`);
}

function balancedSupplementSelection(candidates, authoredExercises, targetCount) {
  const needed = Math.max(0, targetCount - authoredExercises.length);
  if (!needed) return [];

  const authoredTypes = new Set(authoredExercises.map((exercise) => exercise.type));
  const preferredTypes = [
    ExerciseType.MULTIPLE_CHOICE,
    ExerciseType.SENTENCE_BUILDER,
    ExerciseType.TRANSLATION,
    ExerciseType.SHORT_ANSWER,
    ExerciseType.DIALOGUE_REPLY,
    ExerciseType.WRITING_PROMPT
  ];
  const queues = new Map();
  for (const candidate of candidates) {
    if (!queues.has(candidate.type)) queues.set(candidate.type, []);
    queues.get(candidate.type).push(candidate);
  }

  const selected = [];
  const selectedKeys = new Set();
  const take = (type) => {
    const queue = queues.get(type) || [];
    const candidate = queue.find((item) => !selectedKeys.has(item.key));
    if (!candidate || selected.length >= needed) return false;
    selected.push(candidate);
    selectedKeys.add(candidate.key);
    return true;
  };

  for (const type of preferredTypes) {
    if (!authoredTypes.has(type)) take(type);
  }
  while (selected.length < needed) {
    let added = false;
    for (const type of preferredTypes) added = take(type) || added;
    for (const type of queues.keys()) added = take(type) || added;
    if (!added) break;
  }
  return selected;
}

async function upsertExercise(lesson, topicId, exercise, order) {
  const slug = `supplement-${lesson.slug}-${exercise.key}`;
  const saved = await prisma.exercise.upsert({
    where: { slug },
    update: {
      lessonId: lesson.id,
      topicId,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      questionText: exercise.questionText,
      answerJson: exercise.answerJson,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty,
      order,
      xpReward: exercise.type === ExerciseType.TRANSLATION ? 16 : exercise.type === ExerciseType.SENTENCE_BUILDER ? 14 : 10,
      imageKey: exercise.imageKey || null
    },
    create: {
      slug,
      lessonId: lesson.id,
      topicId,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      questionText: exercise.questionText,
      answerJson: exercise.answerJson,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty,
      order,
      xpReward: exercise.type === ExerciseType.TRANSLATION ? 16 : exercise.type === ExerciseType.SENTENCE_BUILDER ? 14 : 10,
      imageKey: exercise.imageKey || null
    }
  });

  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (exercise.options.length) {
    await prisma.exerciseOption.createMany({
      data: exercise.options.map(([text, value, isCorrect], index) => ({
        exerciseId: saved.id,
        text,
        value,
        isCorrect,
        order: index + 1
      }))
    });
  }

  return saved;
}

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      sentences: { orderBy: { id: "asc" } },
      vocabularyGroups: { include: { words: true } },
      exercises: { orderBy: { order: "asc" } }
    }
  });

  let createdOrUpdated = 0;
  let removedStale = 0;
  for (const lesson of lessons) {
    const supplementPrefix = `supplement-${lesson.slug}-`;
    const authoredExercises = lesson.exercises.filter((exercise) => !exercise.slug.startsWith(supplementPrefix));
    const candidates = [...sentenceExercises(lesson), ...vocabularyExercises(lesson)]
      .filter((exercise) => exercise.options.length === 0 || exercise.options.length >= 2)
      .filter((exercise, index, list) => list.findIndex((candidate) => candidate.key === exercise.key) === index);
    const targetCount = isCheckpointLesson(lesson) ? CHECKPOINT_EXERCISE_COUNT : CORE_EXERCISE_COUNT;
    const selected = balancedSupplementSelection(candidates, authoredExercises, targetCount);
    const validSupplementSlugs = new Set(selected.map((exercise) => `${supplementPrefix}${exercise.key}`));
    const staleSupplements = lesson.exercises.filter(
      (exercise) => exercise.slug.startsWith(supplementPrefix) && !validSupplementSlugs.has(exercise.slug)
    );
    if (staleSupplements.length) {
      await prisma.exercise.deleteMany({ where: { id: { in: staleSupplements.map((exercise) => exercise.id) } } });
      removedStale += staleSupplements.length;
    }

    let order = Math.max(0, ...authoredExercises.map((exercise) => exercise.order || 0)) + 1;
    for (const exercise of selected) {
      await upsertExercise(lesson, lesson.topicId, exercise, order);
      order += 1;
      createdOrUpdated += 1;
    }
    console.log(`${lesson.slug}: ${authoredExercises.length} authored + ${selected.length} supplemental`);
  }

  console.log(`Supplemental lesson practice upserted: ${createdOrUpdated} exercises`);
  console.log(`Stale supplemental lesson practice removed: ${removedStale} exercises`);
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = {
  balancedSupplementSelection,
  CORE_EXERCISE_COUNT,
  CHECKPOINT_EXERCISE_COUNT,
  lessonTeachingCorpus,
  semanticImageKey,
  sentenceExercises,
  vocabularyExercises,
  vocabularyWordIsTaught
};
