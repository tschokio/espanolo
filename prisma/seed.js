const bcrypt = require("bcryptjs");
const {
  PrismaClient,
  Role,
  ExerciseType,
  ChallengeType
} = require("@prisma/client");

const prisma = new PrismaClient();

const hashPassword = (password) => bcrypt.hash(password, 12);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const levelForXp = (xp) => Math.max(1, Math.floor(xp / 250) + 1);

async function upsertGroupWord(groupId, [spanish, english, partOfSpeech, gender, example, imageKey]) {
  const existing = await prisma.word.findFirst({ where: { groupId, spanish } });
  const data = {
    groupId,
    spanish,
    english,
    partOfSpeech,
    gender,
    example,
    imageKey: imageKey || null
  };

  if (existing) {
    return prisma.word.update({ where: { id: existing.id }, data });
  }
  return prisma.word.create({ data });
}

const topics = [
  {
    slug: "absolute-basics",
    title: "Absolute Basics",
    description: "Start from zero: pronouns, tiny meaning units, and the first forms of to be.",
    cefrLevel: "A1",
    imageKey: "grammar-scenes:10",
    order: 0
  },
  {
    slug: "ser-estar",
    title: "Ser vs Estar",
    description: "Use ser for identity and stable traits. Use estar for states, locations, and temporary conditions.",
    cefrLevel: "A1",
    imageKey: "grammar-scenes:1",
    order: 1
  },
  {
    slug: "articles-gender",
    title: "Articles and Gender",
    description: "Choose el, la, los, and las by gender and number, then connect them to real nouns.",
    cefrLevel: "A1",
    imageKey: "grammar-scenes:7",
    order: 2
  },
  {
    slug: "present-tense-ar",
    title: "Present Tense -ar Verbs",
    description: "Conjugate regular -ar verbs for everyday actions in the present tense.",
    cefrLevel: "A1",
    imageKey: "grammar-scenes:9",
    order: 3
  },
  {
    slug: "estar-emotions",
    title: "Estar with Feelings",
    description: "Describe temporary states, feelings, temperature, hunger, and tiredness with estar.",
    cefrLevel: "A1",
    imageKey: "emotions-and-states:1",
    order: 4
  },
  {
    slug: "ordering-food",
    title: "Ordering Food",
    description: "Use articles, quiero, and polite ordering phrases for cafes and restaurants.",
    cefrLevel: "A1",
    imageKey: "food-and-ordering:17",
    order: 5
  },
  {
    slug: "travel-questions",
    title: "Travel Questions",
    description: "Ask where things are, what you need, and how to handle common travel situations.",
    cefrLevel: "A1",
    imageKey: "directions-and-question-intents:7",
    order: 6
  },
  {
    slug: "location-prepositions",
    title: "Location and Prepositions",
    description: "Say where objects and places are with estar plus simple location phrases.",
    cefrLevel: "A1",
    imageKey: "object-location-scenes:1",
    order: 7
  },
  {
    slug: "plural-agreement",
    title: "Plural Agreement",
    description: "Make nouns, articles, and adjectives agree in number.",
    cefrLevel: "A1",
    imageKey: "grammar-scenes:8",
    order: 8
  },
  {
    slug: "negation-basics",
    title: "Negation Basics",
    description: "Build simple negative sentences with no before the verb.",
    cefrLevel: "A1",
    imageKey: "grammar-scenes:12",
    order: 9
  },
  {
    slug: "tener-necesitar",
    title: "Tener and Necesitar",
    description: "Use tengo and necesito for practical needs and possessions.",
    cefrLevel: "A1",
    imageKey: "wants-needs-and-possession:1",
    order: 10
  },
  {
    slug: "question-words",
    title: "Question Words",
    description: "Build practical questions with qué, quién, dónde, cuándo, cómo, and cuánto.",
    cefrLevel: "A1",
    imageKey: "directions-and-question-intents:20",
    order: 11
  },
  {
    slug: "daily-routine-time",
    title: "Daily Routine and Time",
    description: "Describe normal days with reflexive verbs, time words, and frequency.",
    cefrLevel: "A2",
    imageKey: "a2-daily-routine:1",
    order: 12
  },
  {
    slug: "irregular-present-frames",
    title: "Irregular Present and Useful Frames",
    description: "Use high-frequency irregular yo forms and frames with infinitives for needs, plans, and ability.",
    cefrLevel: "A2",
    imageKey: "irregular-verbs:1",
    order: 13
  },
  {
    slug: "likes-preferences",
    title: "Likes and Preferences",
    description: "Talk about likes, dislikes, favorites, hobbies, and simple choices with gustar, encantar, and preferir.",
    cefrLevel: "A2",
    imageKey: "preferences-and-hobbies:1",
    order: 14
  },
  {
    slug: "scenario-practice",
    title: "Scenario Practice",
    description: "Practice controlled multi-turn conversations for restaurants, travel, pharmacies, and common problems.",
    cefrLevel: "A2",
    imageKey: "conversation-and-opinion:1",
    order: 15
  },
  {
    slug: "input-comprehension",
    title: "Input Comprehension",
    description: "Build reading and listening comprehension with short graded texts, transcript reveal, and recall questions.",
    cefrLevel: "A2",
    imageKey: "reading-and-listening-lab:1",
    order: 16
  }
];

const vocabularyGroups = [
  {
    slug: "classroom-basics",
    title: "Classroom Basics",
    description: "Objects and people useful for the first grammar examples.",
    situation: "school",
    imageKey: "classroom-basics:1",
    words: [
      ["el estudiante", "student", "noun", "masculine", "El estudiante lee.", "classroom-basics:1"],
      ["la profesora", "teacher", "noun", "feminine", "La profesora explica.", "classroom-basics:2"],
      ["el libro", "book", "noun", "masculine", "El libro está en la mesa.", "classroom-basics:3"],
      ["el lápiz", "pencil", "noun", "masculine", "El lápiz está en la mesa.", "classroom-basics:4"],
      ["la silla", "chair", "noun", "feminine", "La silla está al lado del escritorio.", "classroom-basics:6"],
      ["la biblioteca", "library", "noun", "feminine", "Estoy en la biblioteca.", "classroom-basics:10"]
    ]
  },
  {
    slug: "daily-actions",
    title: "Daily Actions",
    description: "High-frequency regular verbs for quick conjugation practice.",
    situation: "daily life",
    imageKey: "daily-actions:1",
    words: [
      ["hablar", "to speak", "verb", null, "Yo hablo español.", "daily-actions:1"],
      ["estudiar", "to study", "verb", null, "Ella estudia gramática.", "daily-actions:2"],
      ["trabajar", "to work", "verb", null, "Nosotros trabajamos hoy.", "daily-actions:3"],
      ["comprar", "to buy", "verb", null, "Tú compras pan.", "daily-actions:4"],
      ["caminar", "to walk", "verb", null, "Nosotros caminamos al parque.", "daily-actions:5"],
      ["leer", "to read", "verb", null, "Leo un libro.", "daily-actions:7"]
    ]
  },
  {
    slug: "places-around-town",
    title: "Places Around Town",
    description: "Places used to practice location with estar.",
    situation: "city",
    imageKey: "places-around-town:1",
    words: [
      ["el café", "café", "noun", "masculine", "Estoy en el café.", "places-around-town:1"],
      ["la tienda", "store", "noun", "feminine", "La tienda está cerca.", "places-around-town:2"],
      ["el parque", "park", "noun", "masculine", "Los niños están en el parque.", "places-around-town:3"],
      ["la estación", "station", "noun", "feminine", "La estación está lejos.", "city-transport:7"],
      ["la casa", "home", "noun", "feminine", "Estoy en casa.", "places-around-town:7"],
      ["el restaurante", "restaurant", "noun", "masculine", "El restaurante está abierto.", "places-around-town:10"]
    ]
  },
  {
    slug: "emotions-and-states",
    title: "Emotions and States",
    description: "Temporary states that pair naturally with estar.",
    situation: "feelings",
    imageKey: "emotions-and-states:1",
    words: [
      ["feliz", "happy", "adjective", null, "Estoy feliz.", "emotions-and-states:1"],
      ["triste", "sad", "adjective", null, "Ella está triste.", "emotions-and-states:2"],
      ["cansado", "tired", "adjective", "masculine", "El estudiante está cansado.", "emotions-and-states:3"],
      ["nerviosa", "nervous", "adjective", "feminine", "Ana está nerviosa.", "emotions-and-states:4"],
      ["enfermo", "sick", "adjective", "masculine", "Estoy enfermo hoy.", "emotions-and-states:7"],
      ["emocionado", "excited", "adjective", "masculine", "Estoy emocionado.", "emotions-and-states:11"]
    ]
  },
  {
    slug: "food-and-ordering",
    title: "Food and Ordering",
    description: "Food, drink, and café phrases for practical beginner conversations.",
    situation: "restaurant",
    imageKey: "food-and-ordering:17",
    words: [
      ["el agua", "water", "noun", "masculine", "Quiero agua, por favor.", "food-and-ordering:1"],
      ["el café", "coffee", "noun", "masculine", "Quiero un café.", "food-and-ordering:2"],
      ["el pan", "bread", "noun", "masculine", "El pan está fresco.", "food-and-ordering:3"],
      ["la sopa", "soup", "noun", "feminine", "La sopa está caliente.", "food-and-ordering:5"],
      ["la manzana", "apple", "noun", "feminine", "La manzana es roja.", "fruit-and-produce:1"],
      ["la cuenta", "bill", "noun", "feminine", "La cuenta, por favor.", "food-and-ordering:18"]
    ]
  },
  {
    slug: "travel-and-survival",
    title: "Travel and Survival",
    description: "Essential travel situations for asking questions and finding places.",
    situation: "travel",
    imageKey: "travel-and-survival:1",
    words: [
      ["el hotel", "hotel", "noun", "masculine", "El hotel está cerca.", "city-transport:13"],
      ["el tren", "train", "noun", "masculine", "Necesito un boleto de tren.", "city-transport:2"],
      ["el mapa", "map", "noun", "masculine", "Tengo un mapa.", "travel-and-survival:5"],
      ["el taxi", "taxi", "noun", "masculine", "Busco un taxi.", "city-transport:3"],
      ["el museo", "museum", "noun", "masculine", "El museo está abierto.", "travel-and-survival:9"],
      ["la estación", "station", "noun", "feminine", "La estación está allí.", "city-transport:7"]
    ]
  },
  {
    slug: "fruit-and-produce",
    title: "Fruit and Produce",
    description: "Common foods that are easy to remember with visual practice.",
    situation: "market",
    imageKey: "fruit-and-produce:1",
    words: [
      ["la manzana", "apple", "noun", "feminine", "La manzana es roja.", "fruit-and-produce:1"],
      ["el plátano", "banana", "noun", "masculine", "El plátano es amarillo.", "fruit-and-produce:2"],
      ["la naranja", "orange", "noun", "feminine", "Quiero una naranja.", "fruit-and-produce:3"],
      ["el limón", "lemon", "noun", "masculine", "El limón es amarillo.", "fruit-and-produce:4"],
      ["la fresa", "strawberry", "noun", "feminine", "La fresa es roja.", "fruit-and-produce:5"],
      ["las uvas", "grapes", "noun", "feminine plural", "Las uvas están frescas.", "fruit-and-produce:6"],
      ["la pera", "pear", "noun", "feminine", "Quiero una pera.", "fruit-and-produce:7"],
      ["el tomate", "tomato", "noun", "masculine", "El tomate está fresco.", "fruit-and-produce:11"],
      ["la zanahoria", "carrot", "noun", "feminine", "La zanahoria es naranja.", "fruit-and-produce:13"],
      ["la ensalada", "salad", "noun", "feminine", "La ensalada está en la mesa.", "fruit-and-produce:24"],
      ["la fruta", "fruit", "noun", "feminine", "La fruta está en la cesta.", "fruit-and-produce:20"],
      ["el mercado", "market", "noun", "masculine", "Compro fruta en el mercado.", "fruit-and-produce:21"]
    ]
  },
  {
    slug: "useful-phrases",
    title: "Useful Phrases",
    description: "Survival phrases for conversations, ordering, and getting unstuck.",
    situation: "conversation",
    imageKey: "communication-repair:16",
    words: [
      ["hola", "hello", "phrase", null, "Hola, soy Ana.", "communication-repair:1"],
      ["me llamo", "my name is", "phrase", null, "Hola, me llamo Ana.", "communication-repair:2"],
      ["soy de", "I am from", "phrase", null, "Soy de Austria.", "communication-repair:3"],
      ["por favor", "please", "phrase", null, "Un café, por favor.", "communication-repair:5"],
      ["gracias", "thank you", "phrase", null, "Gracias por la ayuda.", "communication-repair:4"],
      ["perdón", "sorry / excuse me", "phrase", null, "Perdón, ¿dónde está el hotel?", "communication-repair:7"],
      ["necesito ayuda", "I need help", "phrase", null, "Necesito ayuda, por favor.", "communication-repair:11"],
      ["no entiendo", "I do not understand", "phrase", null, "No entiendo la pregunta.", "communication-repair:8"],
      ["más despacio", "more slowly", "phrase", null, "Más despacio, por favor.", "communication-repair:9"],
      ["¿cuánto cuesta?", "how much does it cost?", "phrase", null, "¿Cuánto cuesta el pan?", "communication-repair:12"],
      ["la cuenta, por favor", "the bill, please", "phrase", null, "La cuenta, por favor.", "communication-repair:13"]
    ]
  },
  {
    slug: "essential-words",
    title: "Essential Words",
    description: "High-frequency words for basic questions, time, quantity, and connecting ideas.",
    situation: "everyday conversation",
    imageKey: "communication-repair:16",
    words: [
      ["sí", "yes", "adverb", null, "Sí, entiendo.", "communication-repair:16"],
      ["no", "no", "adverb", null, "No, gracias.", null],
      ["aquí", "here", "adverb", null, "El libro está aquí.", null],
      ["allí", "there", "adverb", null, "La estación está allí.", "directions-and-question-intents:22"],
      ["ahora", "now", "adverb", null, "Necesito ayuda ahora.", null],
      ["hoy", "today", "adverb", null, "Trabajo hoy.", null],
      ["mañana", "tomorrow", "adverb", null, "Estudio mañana.", null],
      ["ayer", "yesterday", "adverb", null, "Trabajé ayer.", null],
      ["bien", "well", "adverb", null, "Estoy bien, gracias.", null],
      ["mal", "badly", "adverb", null, "Me siento mal.", null],
      ["mucho", "a lot", "adverb", null, "Estudio mucho.", null],
      ["poco", "a little", "adverb", null, "Hablo un poco de español.", null],
      ["siempre", "always", "adverb", null, "Siempre desayuno aquí.", null],
      ["nunca", "never", "adverb", null, "Nunca trabajo de noche.", null],
      ["también", "also", "adverb", null, "Yo también quiero café.", null],
      ["muy", "very", "adverb", null, "El café está muy caliente.", null],
      ["y", "and", "conjunction", null, "Quiero pan y agua.", null],
      ["o", "or", "conjunction", null, "¿Café o té?", null],
      ["pero", "but", "conjunction", null, "Quiero ir, pero estoy cansado.", null],
      ["porque", "because", "conjunction", null, "Estudio porque quiero aprender.", null],
      ["con", "with", "preposition", null, "Café con leche, por favor.", null],
      ["sin", "without", "preposition", null, "Agua sin gas, por favor.", null],
      ["en", "in / on", "preposition", null, "Estoy en casa.", null],
      ["para", "for / in order to", "preposition", null, "Es para Ana.", null],
      ["qué", "what", "question word", null, "¿Qué quieres?", "directions-and-question-intents:20"],
      ["quién", "who", "question word", null, "¿Quién es ella?", "directions-and-question-intents:21"],
      ["dónde", "where", "question word", null, "¿Dónde está el hotel?", "directions-and-question-intents:22"],
      ["cuándo", "when", "question word", null, "¿Cuándo trabajas?", "directions-and-question-intents:23"],
      ["cómo", "how", "question word", null, "¿Cómo estás?", "directions-and-question-intents:24"],
      ["por qué", "why", "question word", null, "¿Por qué estudias español?", null]
    ]
  },
  {
    slug: "home-and-objects",
    title: "Home and Objects",
    description: "Objects and rooms for location and article practice.",
    situation: "home",
    imageKey: "home-objects:1",
    words: [
      ["la mesa", "table", "noun", "feminine", "El libro está en la mesa.", "home-objects:1"],
      ["la silla", "chair", "noun", "feminine", "La silla está aquí.", "home-objects:2"],
      ["la cama", "bed", "noun", "feminine", "La cama está en el dormitorio.", "home-objects:3"],
      ["el sofá", "sofa", "noun", "masculine", "El sofá está en casa.", "home-objects:4"],
      ["la puerta", "door", "noun", "feminine", "La puerta está abierta.", "home-objects:5"],
      ["la ventana", "window", "noun", "feminine", "La ventana está cerrada.", "home-objects:6"],
      ["la lámpara", "lamp", "noun", "feminine", "La lámpara está en la mesa.", "home-objects:7"],
      ["la llave", "key", "noun", "feminine", "Busco la llave.", "home-objects:8"],
      ["la cocina", "kitchen", "noun", "feminine", "Estoy en la cocina.", "home-objects:11"],
      ["el vaso", "drinking glass", "noun", "masculine", "El vaso está en la mesa.", "food-and-ordering:1"],
      ["la mochila", "backpack", "noun", "feminine", "La mochila está en la silla.", "classroom-basics:8"],
      ["el reloj", "clock", "noun", "masculine", "El reloj está en la pared.", "weather-and-time:13"]
    ]
  },
  {
    slug: "people-and-pronouns",
    title: "People and Pronouns",
    description: "People words that help you build sentences with verb agreement.",
    situation: "introductions",
    imageKey: "subject-pronouns-and-roles:15",
    words: [
      ["yo", "I", "pronoun", null, "Yo soy estudiante.", "subject-pronouns-and-roles:1"],
      ["tú", "you", "pronoun", null, "Tú estudias mucho.", "subject-pronouns-and-roles:3"],
      ["él", "he", "pronoun", null, "Él trabaja hoy.", "subject-pronouns-and-roles:4"],
      ["ella", "she", "pronoun", null, "Ella está feliz.", "subject-pronouns-and-roles:5"],
      ["nosotros", "we", "pronoun", null, "Nosotros caminamos.", "subject-pronouns-and-roles:6"],
      ["ellos", "they", "pronoun", null, "Ellos están en el parque.", "subject-pronouns-and-roles:7"],
      ["la persona", "person", "noun", "feminine", "La persona habla español.", "subject-pronouns-and-roles:8"],
      ["el amigo", "friend", "noun", "masculine", "Llamo a mi amigo.", "subject-pronouns-and-roles:9"],
      ["el estudiante", "student", "noun", "masculine", "El estudiante lee.", "subject-pronouns-and-roles:10"],
      ["la profesora", "teacher", "noun", "feminine", "La profesora explica.", "subject-pronouns-and-roles:13"],
      ["la familia", "family", "noun", "feminine", "La familia está en casa.", "subject-pronouns-and-roles:14"]
    ]
  },
  {
    slug: "clothing-basics",
    title: "Clothing Basics",
    description: "Common clothing words for daily descriptions and travel.",
    situation: "clothing",
    imageKey: "clothing-basics:1",
    words: [
      ["la camisa", "shirt", "noun", "feminine", "La camisa es blanca.", "clothing-basics:1"],
      ["la camiseta", "t-shirt", "noun", "feminine", "La camiseta está limpia.", "clothing-basics:2"],
      ["los pantalones", "pants", "noun", "masculine plural", "Los pantalones son azules.", "clothing-basics:3"],
      ["el vestido", "dress", "noun", "masculine", "El vestido es bonito.", "clothing-basics:5"],
      ["la chaqueta", "jacket", "noun", "feminine", "Necesito una chaqueta.", "clothing-basics:7"],
      ["los zapatos", "shoes", "noun", "masculine plural", "Los zapatos están aquí.", "clothing-basics:10"],
      ["el sombrero", "hat", "noun", "masculine", "El sombrero es nuevo.", "clothing-basics:12"],
      ["la bufanda", "scarf", "noun", "feminine", "La bufanda es roja.", "clothing-basics:13"],
      ["la mochila", "backpack", "noun", "feminine", "La mochila está en la silla.", "clothing-basics:16"],
      ["las botas", "boots", "noun", "feminine plural", "Las botas están en casa.", "clothing-basics:23"]
    ]
  },
  {
    slug: "city-transport",
    title: "City Transport",
    description: "Transport and travel objects for getting around.",
    situation: "transport",
    imageKey: "city-transport:1",
    words: [
      ["el autobús", "bus", "noun", "masculine", "El autobús está aquí.", "city-transport:1"],
      ["el tren", "train", "noun", "masculine", "Necesito un boleto de tren.", "city-transport:2"],
      ["el taxi", "taxi", "noun", "masculine", "Busco un taxi.", "city-transport:3"],
      ["la bicicleta", "bicycle", "noun", "feminine", "La bicicleta es nueva.", "city-transport:4"],
      ["el metro", "subway", "noun", "masculine", "El metro está cerca.", "city-transport:5"],
      ["el aeropuerto", "airport", "noun", "masculine", "El aeropuerto está lejos.", "city-transport:6"],
      ["la plataforma", "platform", "noun", "feminine", "La plataforma está allí.", "city-transport:7"],
      ["la maleta", "suitcase", "noun", "feminine", "Tengo una maleta.", "city-transport:10"],
      ["el pasaporte", "passport", "noun", "masculine", "Necesito el pasaporte.", "city-transport:11"],
      ["el mapa", "map", "noun", "masculine", "Tengo un mapa.", "travel-and-survival:5"]
    ]
  },
  {
    slug: "weather-and-time",
    title: "Weather and Time",
    description: "Weather, time of day, and simple conditions.",
    situation: "weather",
    imageKey: "weather-and-time:1",
    words: [
      ["hace sol", "it is sunny", "phrase", null, "Hoy hace sol.", "weather-and-time:1"],
      ["llueve", "it is raining", "verb", null, "Hoy llueve.", "weather-and-time:2"],
      ["está nublado", "it is cloudy", "phrase", null, "El cielo está nublado.", "weather-and-time:3"],
      ["hace viento", "it is windy", "phrase", null, "Hoy hace viento.", "weather-and-time:4"],
      ["hace frío", "it is cold", "phrase", null, "Hace frío hoy.", "weather-and-time:7"],
      ["hace calor", "it is hot", "phrase", null, "Hace calor hoy.", "weather-and-time:6"],
      ["la mañana", "morning", "noun", "feminine", "Estudio por la mañana.", "weather-and-time:8"],
      ["la tarde", "afternoon", "noun", "feminine", "Trabajo por la tarde.", "weather-and-time:9"],
      ["la noche", "night", "noun", "feminine", "Leo por la noche.", "weather-and-time:11"],
      ["el paraguas", "umbrella", "noun", "masculine", "Necesito un paraguas.", "weather-and-time:14"]
    ]
  },
  {
    slug: "body-and-health",
    title: "Body and Health",
    description: "Simple body words and health states for saying what hurts or how you feel.",
    situation: "health",
    imageKey: "body-and-health:6",
    words: [
      ["la cabeza", "head", "noun", "feminine", "Me duele la cabeza.", "body-and-health:1"],
      ["la mano", "hand", "noun", "feminine", "Levanto la mano.", "body-and-health:2"],
      ["el ojo", "eye", "noun", "masculine", "El ojo está rojo.", "body-and-health:3"],
      ["la boca", "mouth", "noun", "feminine", "La boca está seca.", "body-and-health:4"],
      ["el pie", "foot", "noun", "masculine", "Me duele el pie.", "body-and-health:5"],
      ["el cuerpo", "body", "noun", "masculine", "El cuerpo está cansado.", "body-and-health:6"],
      ["me duele", "it hurts me", "phrase", null, "Me duele la cabeza.", "body-and-health:7"],
      ["tengo frío", "I am cold", "phrase", null, "Tengo frío hoy.", "body-and-health:8"],
      ["tengo calor", "I am hot", "phrase", null, "Tengo calor hoy.", "body-and-health:9"],
      ["tengo hambre", "I am hungry", "phrase", null, "Tengo hambre.", "body-and-health:10"],
      ["tengo sed", "I am thirsty", "phrase", null, "Tengo sed.", "body-and-health:11"],
      ["el doctor", "doctor", "noun", "masculine", "Necesito un doctor.", "body-and-health:12"]
    ]
  },
  {
    slug: "numbers-and-colors",
    title: "Numbers & Colors",
    description: "Count from zero to twenty and use common color words in descriptions and shopping.",
    situation: "describing things",
    imageKey: "quantities-and-clear-colors:25",
    words: [
      ["cero", "zero", "number", null, "Tengo cero mensajes.", null],
      ["uno", "one", "number", null, "Tengo uno.", "quantities-and-clear-colors:1"],
      ["dos", "two", "number", null, "Tengo dos manzanas.", "quantities-and-clear-colors:2"],
      ["tres", "three", "number", null, "Tengo tres libros.", "quantities-and-clear-colors:3"],
      ["cuatro", "four", "number", null, "Quiero cuatro uvas.", "quantities-and-clear-colors:4"],
      ["cinco", "five", "number", null, "Tengo cinco minutos.", "quantities-and-clear-colors:5"],
      ["seis", "six", "number", null, "Tengo seis uvas.", "quantities-and-clear-colors:11"],
      ["siete", "seven", "number", null, "Tengo siete libros.", "quantities-and-clear-colors:12"],
      ["ocho", "eight", "number", null, "Tengo ocho manzanas.", "quantities-and-clear-colors:13"],
      ["nueve", "nine", "number", null, "Quiero nueve fresas.", "quantities-and-clear-colors:14"],
      ["diez", "ten", "number", null, "Tengo diez minutos.", "quantities-and-clear-colors:10"],
      ["once", "eleven", "number", null, "Tengo once libros.", null],
      ["doce", "twelve", "number", null, "Hay doce estudiantes.", null],
      ["trece", "thirteen", "number", null, "Tengo trece años.", null],
      ["catorce", "fourteen", "number", null, "Hay catorce sillas.", null],
      ["quince", "fifteen", "number", null, "Necesito quince minutos.", null],
      ["dieciséis", "sixteen", "number", null, "Hay dieciséis preguntas.", null],
      ["diecisiete", "seventeen", "number", null, "Tengo diecisiete euros.", null],
      ["dieciocho", "eighteen", "number", null, "La clase tiene dieciocho estudiantes.", null],
      ["diecinueve", "nineteen", "number", null, "Hay diecinueve libros.", null],
      ["veinte", "twenty", "number", null, "Necesito veinte minutos.", null],
      ["el color", "color", "noun", "masculine", "El color es azul.", "quantities-and-clear-colors:25"],
      ["rojo", "red", "adjective", "masculine", "El tomate es rojo.", "quantities-and-clear-colors:24"],
      ["roja", "red", "adjective", "feminine", "La manzana es roja.", "quantities-and-clear-colors:24"],
      ["azul", "blue", "adjective", null, "La camisa es azul.", "quantities-and-clear-colors:17"],
      ["verde", "green", "adjective", null, "La ensalada es verde.", "quantities-and-clear-colors:18"],
      ["amarillo", "yellow", "adjective", "masculine", "El plátano es amarillo.", "quantities-and-clear-colors:19"],
      ["amarilla", "yellow", "adjective", "feminine", "La camisa es amarilla.", "quantities-and-clear-colors:15"],
      ["blanco", "white", "adjective", "masculine", "El pan es blanco.", "quantities-and-clear-colors:20"],
      ["blanca", "white", "adjective", "feminine", "La camisa es blanca.", "quantities-and-clear-colors:22"],
      ["negro", "black", "adjective", "masculine", "El café es negro.", "quantities-and-clear-colors:21"],
      ["negra", "black", "adjective", "feminine", "La mochila es negra.", "quantities-and-clear-colors:23"],
      ["naranja", "orange", "adjective", null, "La zanahoria es naranja.", "fruit-and-produce:13"],
      ["morado", "purple", "adjective", "masculine", "El vestido es morado.", null],
      ["rosa", "pink", "adjective", null, "La camisa es rosa.", null],
      ["marrón", "brown", "adjective", null, "La mesa es marrón.", "home-objects:1"],
      ["gris", "gray", "adjective", null, "El sombrero es gris.", "clothing-basics:12"]
    ]
  },
  {
    slug: "nature-and-animals",
    title: "Nature and Animals",
    description: "Friendly outdoor words for parks, weather, and simple descriptions.",
    situation: "outside",
    imageKey: "nature-and-animals:10",
    words: [
      ["el árbol", "tree", "noun", "masculine", "El árbol está en el parque.", "nature-and-animals:1"],
      ["la flor", "flower", "noun", "feminine", "La flor es roja.", "nature-and-animals:2"],
      ["el perro", "dog", "noun", "masculine", "El perro está en casa.", "nature-and-animals:3"],
      ["el gato", "cat", "noun", "masculine", "El gato está en la silla.", "nature-and-animals:4"],
      ["el pájaro", "bird", "noun", "masculine", "El pájaro está en el árbol.", "nature-and-animals:5"],
      ["el sol", "sun", "noun", "masculine", "Hace sol.", "nature-and-animals:6"],
      ["la lluvia", "rain", "noun", "feminine", "La lluvia está fuerte.", "nature-and-animals:7"],
      ["la playa", "beach", "noun", "feminine", "Estoy en la playa.", "nature-and-animals:8"],
      ["el agua", "water", "noun", "masculine", "El agua está fría.", "nature-and-animals:9"],
      ["bonito", "pretty", "adjective", "masculine", "El parque es bonito.", "nature-and-animals:10"]
    ]
  },
  {
    slug: "a2-daily-routine",
    title: "A2 Daily Routine",
    description: "Routine actions, reflexive morning verbs, time words, and weekly frequency.",
    situation: "normal day",
    imageKey: "a2-daily-routine:1",
    words: [
      ["despertarse", "to wake up", "verb", null, "Me despierto temprano.", "a2-daily-routine:1"],
      ["levantarse", "to get up", "verb", null, "Me levanto a las siete.", "a2-daily-routine:2"],
      ["ducharse", "to shower", "verb", null, "Me ducho por la mañana.", "a2-daily-routine:3"],
      ["cepillarse los dientes", "to brush one's teeth", "phrase", null, "Me cepillo los dientes.", "a2-daily-routine:4"],
      ["vestirse", "to get dressed", "verb", null, "Me visto antes de desayunar.", "a2-daily-routine:5"],
      ["desayunar", "to eat breakfast", "verb", null, "Desayuno a las ocho.", "a2-daily-routine:6"],
      ["ir al trabajo", "to go to work", "phrase", null, "Voy al trabajo por la mañana.", "a2-daily-routine:7"],
      ["estudiar", "to study", "verb", null, "Estudio por la tarde.", "a2-daily-routine:8"],
      ["cocinar la cena", "to cook dinner", "phrase", null, "Cocino la cena por la noche.", "a2-daily-routine:9"],
      ["limpiar el cuarto", "to clean the room", "phrase", null, "Limpio el cuarto los sábados.", "a2-daily-routine:10"],
      ["acostarse", "to go to bed", "verb", null, "Me acuesto a las diez.", "a2-daily-routine:11"],
      ["leer por la noche", "to read at night", "phrase", null, "Leo por la noche.", "a2-daily-routine:12"],
      ["por la mañana", "in the morning", "phrase", null, "Trabajo por la mañana.", "a2-daily-routine:13"],
      ["por la tarde", "in the afternoon", "phrase", null, "Estudio por la tarde.", "a2-daily-routine:14"],
      ["cada semana", "every week", "phrase", null, "Limpio cada semana.", "a2-daily-routine:15"],
      ["estar cansado", "to be tired", "phrase", null, "Estoy cansado después del trabajo.", "a2-daily-routine:16"]
    ]
  },
  {
    slug: "a2-irregular-verbs",
    title: "A2 Irregular Verbs and Frames",
    description: "High-frequency irregular present forms and useful verb frames with infinitives.",
    situation: "plans and obligations",
    imageKey: "irregular-verbs:1",
    words: [
      ["ir a la tienda", "to go to the store", "phrase", null, "Voy a la tienda.", "irregular-verbs:1"],
      ["venir a casa", "to come home", "phrase", null, "Vengo a casa por la tarde.", "irregular-verbs:2"],
      ["salir de casa", "to leave home", "phrase", null, "Salgo de casa a las ocho.", "irregular-verbs:3"],
      ["poner", "to put", "verb", null, "Pongo el libro en la mesa.", "irregular-verbs:4"],
      ["traer", "to bring", "verb", null, "Traigo una bolsa.", "irregular-verbs:5"],
      ["decir", "to say", "verb", null, "Digo la verdad.", "irregular-verbs:6"],
      ["hacer la tarea", "to do homework", "phrase", null, "Hago la tarea por la tarde.", "irregular-verbs:7"],
      ["hacer comida", "to make food", "phrase", null, "Hago comida en casa.", "irregular-verbs:8"],
      ["ver", "to see", "verb", null, "Veo el letrero.", "irregular-verbs:9"],
      ["oír", "to hear", "verb", null, "Oigo música.", "irregular-verbs:10"],
      ["saber", "to know a fact", "verb", null, "Sé la respuesta.", "irregular-verbs:11"],
      ["conocer", "to know / meet a person", "verb", null, "Conozco a una persona.", "irregular-verbs:12"],
      ["poder", "can / to be able to", "verb", null, "Puedo abrir la puerta.", "irregular-verbs:13"],
      ["querer", "to want", "verb", null, "Quiero comprar un billete.", "irregular-verbs:14"],
      ["tener que", "to have to", "phrase", null, "Tengo que trabajar.", "irregular-verbs:15"],
      ["dar", "to give", "verb", null, "Doy el libro a Ana.", "irregular-verbs:16"]
    ]
  },
  {
    slug: "a2-preferences-hobbies",
    title: "A2 Preferences and Hobbies",
    description: "Concrete words for likes, dislikes, favorites, and hobby conversations.",
    situation: "free time",
    imageKey: "preferences-and-hobbies:1",
    words: [
      ["la música", "music", "noun", "feminine", "Me gusta la música.", "preferences-and-hobbies:1"],
      ["las películas", "movies", "noun", "feminine plural", "Me gustan las películas.", "preferences-and-hobbies:2"],
      ["el fútbol", "soccer", "noun", "masculine", "Me gusta el fútbol.", "preferences-and-hobbies:3"],
      ["leer", "to read", "verb", null, "Me gusta leer.", "preferences-and-hobbies:4"],
      ["cocinar", "to cook", "verb", null, "Me encanta cocinar.", "preferences-and-hobbies:5"],
      ["viajar", "to travel", "verb", null, "Me gusta viajar.", "preferences-and-hobbies:6"],
      ["el café", "coffee", "noun", "masculine", "Me gusta el café.", "preferences-and-hobbies:7"],
      ["la lluvia", "rain", "noun", "feminine", "No me gusta la lluvia.", "preferences-and-hobbies:8"],
      ["el té", "tea", "noun", "masculine", "Prefiero el té.", "preferences-and-hobbies:9"],
      ["la playa", "beach", "noun", "feminine", "Prefiero la playa.", "preferences-and-hobbies:10"],
      ["el restaurante favorito", "favorite restaurant", "phrase", "masculine", "Mi restaurante favorito es pequeño.", "preferences-and-hobbies:11"],
      ["el color favorito", "favorite color", "phrase", "masculine", "Mi color favorito es azul.", "preferences-and-hobbies:12"],
      ["la clase", "class", "noun", "feminine", "Me gusta la clase de español.", "preferences-and-hobbies:13"],
      ["el fin de semana", "weekend", "phrase", "masculine", "Viajo el fin de semana.", "preferences-and-hobbies:14"],
      ["estar aburrido", "to be bored", "phrase", null, "Estoy aburrido.", "preferences-and-hobbies:15"],
      ["estar emocionado", "to be excited", "phrase", null, "Estoy emocionado.", "preferences-and-hobbies:16"]
    ]
  },
  {
    slug: "a2-scenario-survival",
    title: "A2 Scenario Survival",
    description: "Practical phrases for ordering, asking directions, and requesting pharmacy help.",
    situation: "practical conversations",
    imageKey: "conversation-and-opinion:1",
    words: [
      ["¿Qué recomienda?", "What do you recommend?", "phrase", null, "¿Qué recomienda para comer?", "communication-repair:14"],
      ["Quisiera", "I would like", "phrase", null, "Quisiera una mesa, por favor.", "food-and-ordering:19"],
      ["para llevar", "to go", "phrase", null, "Quisiera dos cafés para llevar.", "food-and-ordering:20"],
      ["sin", "without", "preposition", null, "Quisiera agua sin gas.", "food-and-ordering:1"],
      ["la dirección", "address / direction", "noun", "feminine", "Necesito la dirección del hotel.", "directions-and-question-intents:6"],
      ["siga derecho", "go straight", "phrase", null, "Siga derecho hasta la estación.", "directions-and-question-intents:1"],
      ["gire a la izquierda", "turn left", "phrase", null, "Gire a la izquierda en la plaza.", "directions-and-question-intents:2"],
      ["la farmacia", "pharmacy", "noun", "feminine", "La farmacia está cerca.", "places-around-town:13"],
      ["el dolor", "pain", "noun", "masculine", "Tengo dolor de cabeza.", "body-and-health:7"],
      ["la medicina", "medicine", "noun", "feminine", "Necesito medicina para el dolor.", "pharmacy-and-medicine:1"],
      ["la alergia", "allergy", "noun", "feminine", "Tengo alergia a la aspirina.", "pharmacy-and-medicine:7"],
      ["¿Cada cuánto?", "How often?", "phrase", null, "¿Cada cuánto tomo la medicina?", "pharmacy-and-medicine:9"]
    ]
  },
  {
    slug: "a2-reading-listening-lab",
    title: "A2 Reading and Listening Lab",
    description: "Words for short texts, audio prompts, transcripts, and comprehension checks.",
    situation: "input practice",
    imageKey: "reading-and-listening-lab:1",
    words: [
      ["el texto", "text", "noun", "masculine", "Leo el texto dos veces.", "reading-and-listening-lab:1"],
      ["el audio", "audio", "noun", "masculine", "Escucho el audio sin leer.", "reading-and-listening-lab:2"],
      ["la pregunta", "question", "noun", "feminine", "Contesto la pregunta.", "reading-and-listening-lab:5"],
      ["la respuesta", "answer", "noun", "feminine", "Escribo la respuesta.", "reading-and-listening-lab:6"],
      ["el resumen", "summary", "noun", "masculine", "Escribo un resumen corto.", "reading-and-listening-lab:6"],
      ["la palabra nueva", "new word", "phrase", "feminine", "Guardo una palabra nueva.", "reading-and-listening-lab:4"],
      ["escuchar", "to listen", "verb", null, "Escucho primero.", "reading-and-listening-lab:2"],
      ["leer", "to read", "verb", null, "Leo después.", "reading-and-listening-lab:1"],
      ["la transcripción", "transcript", "noun", "feminine", "Reviso la transcripción.", "reading-and-listening-lab:4"],
      ["la idea principal", "main idea", "phrase", "feminine", "Busco la idea principal.", "reading-and-listening-lab:9"]
    ]
  }
];

const lessons = [
  {
    slug: "intro-greetings-pronouns-ser",
    title: "Greetings, Pronouns, and SER",
    summary: "Say hello, use yo, and introduce yourself with soy and me llamo.",
    cefrLevel: "A1",
    theme: "Self-introduction",
    situation: "meeting someone",
    imageKey: "communication-repair:2",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns", "useful-phrases"],
    order: 10,
    estimatedMinutes: 8,
    outcomes: [
      "You can introduce yourself.",
      "You can say where you are from.",
      "You can recognize when soy is used for identity."
    ],
    conceptKeys: ["greetings", "pronouns", "ser-identity", "self-introduction"],
    reviewSummary: "You practiced hello, yo, soy, me llamo, and soy de for a simple introduction.",
    sentences: [
      ["Hola.", "Hello.", "Use hola to start a simple greeting."],
      ["Yo soy Ana.", "I am Ana.", "Use soy for identity, names, and roles."],
      ["Me llamo Ana.", "My name is Ana.", "Me llamo is the natural phrase for giving your name."],
      ["Soy de Austria.", "I am from Austria.", "Origin uses soy because it is part of identity."]
    ]
  },
  {
    slug: "zero-pronouns",
    title: "Zero: Core Subject Pronouns",
    summary: "Learn yo, tú, él, and ella as the four person words used in the first beginner sentences.",
    cefrLevel: "A1",
    theme: "Absolute Basics",
    situation: "starting from zero",
    imageKey: "subject-pronouns-and-roles:15",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns"],
    order: 20,
    estimatedMinutes: 7,
    outcomes: [
      "You can identify who a sentence is about: I, you, he, or she.",
      "You can separate the pronoun él from the article el.",
      "You can use the four pronouns that appear in the next beginner lessons."
    ],
    conceptKeys: ["pronouns", "subject-pronouns", "yo-tu-el-ella", "accent-awareness"],
    reviewSummary: "You practiced the first four subject pronouns: yo, tú, él, and ella.",
    sentences: [
      ["yo", "I", "Use yo when the speaker is talking about themself."],
      ["Yo soy Ana.", "I am Ana.", "Yo points to the speaker; later lessons focus on soy."],
      ["tú", "you", "Use tú for one familiar person you are speaking to."],
      ["Tú estudias.", "You study.", "Tú points to the listener; the accent keeps it separate from tu, meaning your."],
      ["él", "he", "Él with an accent means he."],
      ["Él habla.", "He speaks.", "The accent matters: él is a person, while el without accent is an article you learn later."],
      ["ella", "she", "Ella means she."],
      ["Ella está feliz.", "She is happy.", "Ella points to one female person; later lessons focus on está."]
    ]
  },
  {
    slug: "zero-soy",
    title: "Zero: Soy",
    summary: "Use soy for your name, role, and origin before comparing it with other forms of to be.",
    cefrLevel: "A1",
    theme: "Absolute Basics",
    situation: "identity",
    imageKey: "identity-and-introductions:4",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns", "classroom-basics"],
    order: 30,
    estimatedMinutes: 7,
    outcomes: [
      "You can introduce yourself with soy.",
      "You can use soy for a role or identity.",
      "You can say where you are from with soy de."
    ],
    conceptKeys: ["absolute-basics", "ser", "soy", "identity", "origin"],
    reviewSummary: "You practiced soy for your name, identity, role, and origin.",
    sentences: [
      ["soy", "I am for identity or origin", "Soy is the I-form of ser."],
      ["Yo soy estudiante.", "I am a student.", "Use soy for identity, role, or what someone is."],
      ["Soy Ana.", "I am Ana.", "Soy is the I-form of ser. A name is identity."],
      ["Soy de Austria.", "I am from Austria.", "Use soy de for origin, not estoy de."],
      ["Yo soy Ana y soy estudiante.", "I am Ana and I am a student.", "You can use soy twice to give two identity facts."],
      ["Soy estudiante y soy de Austria.", "I am a student and I am from Austria.", "Role and origin both use soy."]
    ]
  },
  {
    slug: "zero-estoy",
    title: "Zero: Estoy",
    summary: "Use estoy for how you are right now and where you are.",
    cefrLevel: "A1",
    theme: "Absolute Basics",
    situation: "state and location",
    imageKey: "grammar-scenes:5",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["emotions-and-states", "places-around-town"],
    order: 40,
    estimatedMinutes: 7,
    outcomes: [
      "You can say how you feel with estoy.",
      "You can say where you are with estoy.",
      "You can recognize that estoy describes a current state or location."
    ],
    conceptKeys: ["absolute-basics", "estar", "estoy", "state", "location"],
    reviewSummary: "You practiced estoy for current feelings, conditions, and locations.",
    sentences: [
      ["estoy", "I am for a current state or location", "Estoy is the I-form of estar."],
      ["Estoy feliz.", "I am happy.", "Estoy is the I-form of estar. Use it for how you are right now."],
      ["Estoy en casa.", "I am at home.", "Use estoy for where you are."],
      ["Estoy cansado hoy.", "I am tired today.", "A temporary condition such as tired uses estoy."],
      ["Estoy en el café.", "I am at the café.", "Use estoy before en plus a place."],
      ["Hoy estoy feliz en casa.", "Today I am happy at home.", "Hoy can come first, but estoy still shows your current state."]
    ]
  },
  {
    slug: "zero-es-esta",
    title: "Zero: Es and Está",
    summary: "Use es for identity or a trait, and está for a current state or location.",
    cefrLevel: "A1",
    theme: "Absolute Basics",
    situation: "he, she, it",
    imageKey: "grammar-scenes:4",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns", "classroom-basics", "places-around-town", "emotions-and-states"],
    order: 50,
    estimatedMinutes: 9,
    outcomes: [
      "You can use es for who someone is or what something is like.",
      "You can use está for a current feeling or location.",
      "You can explain why es and está cannot be chosen from the English word is alone."
    ],
    conceptKeys: ["absolute-basics", "ser", "estar", "es", "estar-third-person-singular", "identity", "location", "state"],
    reviewSummary: "You practiced es for identity and traits, and está for current states and locations.",
    sentences: [
      ["es", "is for identity or a trait", "Es comes from ser and is used for identity or traits."],
      ["está", "is for a current state or location", "Está comes from estar and is used for a temporary state or location."],
      ["Ella es profesora.", "She is a teacher.", "Identity uses es."],
      ["Ella está en casa.", "She is at home.", "Location uses está."],
      ["Ana está feliz hoy.", "Ana is happy today.", "A current feeling uses está."],
      ["Ana es profesora, pero está cansada hoy.", "Ana is a teacher, but she is tired today.", "The same person can use es for identity and está for a current state."],
      ["El libro es nuevo.", "The book is new.", "A normal trait of the book uses es."]
    ]
  },
  {
    slug: "checkpoint-a1-absolute-start",
    title: "A1.0 Absolute Start Checkpoint",
    summary: "Test first pronouns, soy, estoy, es, está, and a basic introduction.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "first conversation",
    imageKey: "identity-and-introductions:16",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns", "useful-phrases", "places-around-town"],
    order: 55,
    estimatedMinutes: 8,
    outcomes: [
      "You can introduce yourself with soy or me llamo.",
      "You can separate identity from location.",
      "You can answer a first basic greeting."
    ],
    conceptKeys: ["checkpoint", "absolute-basics", "ser-identity", "estar-location"],
    reviewSummary: "You checked the first A1 building blocks: pronouns, soy, estoy, es, está, and name phrases.",
    sentences: [
      ["Soy Ana.", "I am Ana.", "Use soy for identity."],
      ["Estoy en casa.", "I am at home.", "Use estoy for location."],
      ["Ella es profesora.", "She is a teacher.", "Use es for identity."],
      ["Ella está en casa.", "She is at home.", "Use está for location."]
    ]
  },
  {
    slug: "ser-vs-estar-basics",
    title: "Ser vs Estar",
    summary: "Choose ser for identity and normal traits, and estar for location and current states.",
    cefrLevel: "A1",
    theme: "Grammar Foundations",
    situation: "introductions and places",
    imageKey: "grammar-scenes:1",
    topicSlug: "ser-estar",
    vocabularySlugs: ["people-and-pronouns", "classroom-basics", "places-around-town", "emotions-and-states"],
    order: 60,
    estimatedMinutes: 12,
    outcomes: [
      "You can choose ser for identity, profession, and a normal trait.",
      "You can choose estar for location and a temporary state.",
      "You can use soy, es, son, estoy, está, and están in the model sentences.",
      "You can correct the common mistake of using es for a temporary state."
    ],
    conceptKeys: ["ser-estar", "identity", "traits", "location", "temporary-state", "conjugation"],
    reviewSummary: "You practiced ser for identity and traits, and estar for location and current states across singular and plural forms.",
    sentences: [
      ["Yo soy estudiante.", "I am a student.", "Ser describes identity or profession."],
      ["Estoy en la biblioteca.", "I am in the library.", "Estar describes location."],
      ["Ella está cansada.", "She is tired.", "Estar describes a temporary state."],
      ["Ana es profesora.", "Ana is a teacher.", "Use es for another person's identity or profession."],
      ["Ellos son estudiantes.", "They are students.", "Use son for a plural identity or role."],
      ["Ellos están en la biblioteca.", "They are in the library.", "Use están for a plural location."],
      ["El libro es nuevo.", "The book is new.", "Use es for a normal trait of the book."],
      ["Ana es profesora, pero está cansada hoy.", "Ana is a teacher, but she is tired today.", "Use es for who Ana is and está for how she is right now."]
    ]
  },
  {
    slug: "articles-and-nouns",
    title: "Articles and Nouns",
    summary: "Match articles to Spanish noun gender and number.",
    cefrLevel: "A1",
    theme: "Noun Patterns",
    situation: "objects and places",
    imageKey: "classroom-basics:3",
    topicSlug: "articles-gender",
    vocabularySlugs: ["classroom-basics", "places-around-town"],
    order: 70,
    estimatedMinutes: 7,
    sentences: [
      ["El libro es nuevo.", "The book is new.", "Libro is masculine singular."],
      ["La tienda está abierta.", "The store is open.", "Tienda is feminine singular."],
      ["Los estudiantes hablan.", "The students speak.", "Los marks masculine plural."]
    ]
  },
  {
    slug: "present-ar-verbs",
    title: "Present Tense -ar Verbs",
    summary: "Conjugate regular -ar verbs in useful sentences.",
    cefrLevel: "A1",
    theme: "Verbs",
    situation: "daily actions",
    imageKey: "daily-actions:1",
    topicSlug: "present-tense-ar",
    vocabularySlugs: ["daily-actions"],
    order: 80,
    estimatedMinutes: 9,
    sentences: [
      ["Yo hablo español.", "I speak Spanish.", "Yo uses the -o ending."],
      ["Tú estudias mucho.", "You study a lot.", "Tú uses the -as ending."],
      ["Ellos trabajan hoy.", "They work today.", "Ellos uses the -an ending."],
      ["Nosotros caminamos al parque.", "We walk to the park.", "Nosotros uses the -amos ending."]
    ]
  },
  {
    slug: "feelings-with-estar",
    title: "Feelings with Estar",
    summary: "Describe emotions and temporary states with estar.",
    cefrLevel: "A1",
    theme: "States and Feelings",
    situation: "talking about how you feel",
    imageKey: "emotions-and-states:1",
    topicSlug: "estar-emotions",
    vocabularySlugs: ["emotions-and-states"],
    order: 90,
    estimatedMinutes: 8,
    sentences: [
      ["Estoy feliz hoy.", "I am happy today.", "Use estar for feelings that can change."],
      ["Ella está cansada.", "She is tired.", "Cansada agrees with ella."],
      ["Estamos nerviosos.", "We are nervous.", "Estamos matches nosotros."],
      ["El estudiante está enfermo.", "The student is sick.", "Use estar for temporary health states."],
      ["Ana está nerviosa.", "Ana is nervous.", "Use está with Ana because she is one person."]
    ]
  },
  {
    slug: "checkpoint-a1-core-grammar",
    title: "A1.1 Core Grammar Checkpoint",
    summary: "Check ser, estar, articles, regular -ar forms, and feeling sentences.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "core grammar review",
    imageKey: "grammar-scenes:1",
    topicSlug: "ser-estar",
    vocabularySlugs: ["classroom-basics", "daily-actions", "emotions-and-states"],
    order: 95,
    estimatedMinutes: 9,
    outcomes: [
      "You can choose ser or estar for basic meanings.",
      "You can match el, la, and los with common nouns.",
      "You can produce a simple -ar verb form."
    ],
    conceptKeys: ["checkpoint", "ser-estar", "articles", "present-tense-ar", "estar-emotions"],
    reviewSummary: "You checked the first grammar layer: identity, location, articles, -ar verbs, and feelings.",
    sentences: [
      ["Yo soy estudiante.", "I am a student.", "Use soy for identity."],
      ["El libro es nuevo.", "The book is new.", "Libro uses el."],
      ["Yo hablo español.", "I speak Spanish.", "Yo uses the -o ending."],
      ["Estoy feliz hoy.", "I am happy today.", "Use estar for current feelings."]
    ]
  },
  {
    slug: "food-ordering-basics",
    title: "Food Ordering Basics",
    summary: "Use quiero, articles, and polite phrases at a café or restaurant.",
    cefrLevel: "A1",
    theme: "Food and Ordering",
    situation: "restaurant and café",
    imageKey: "food-and-ordering:17",
    topicSlug: "ordering-food",
    vocabularySlugs: ["food-and-ordering"],
    order: 100,
    estimatedMinutes: 9,
    sentences: [
      ["Quiero un café, por favor.", "I want a coffee, please.", "Use un before masculine singular café."],
      ["La sopa está caliente.", "The soup is hot.", "La matches feminine singular sopa."],
      ["La cuenta, por favor.", "The bill, please.", "A useful restaurant phrase."],
      ["El pan está fresco.", "The bread is fresh.", "El matches masculine singular pan."]
    ]
  },
  {
    slug: "travel-survival-questions",
    title: "Travel Survival Questions",
    summary: "Ask where places are and handle common travel moments.",
    cefrLevel: "A1",
    theme: "Travel Spanish",
    situation: "hotel, station, and city travel",
    imageKey: "directions-and-question-intents:9",
    topicSlug: "travel-questions",
    vocabularySlugs: ["travel-and-survival", "places-around-town"],
    order: 110,
    estimatedMinutes: 9,
    sentences: [
      ["¿Dónde está el hotel?", "Where is the hotel?", "Dónde asks for location."],
      ["Necesito un taxi.", "I need a taxi.", "Necesito is a high-frequency survival verb."],
      ["La estación está cerca.", "The station is nearby.", "Use estar for location."],
      ["Tengo un mapa.", "I have a map.", "Tengo is useful for travel situations."]
    ]
  },
  {
    slug: "location-around-you",
    title: "Location Around You",
    summary: "Place people and objects with estar, en, cerca, and simple location phrases.",
    cefrLevel: "A1",
    theme: "Places and Position",
    situation: "home, classroom, and city",
    imageKey: "object-location-scenes:1",
    topicSlug: "location-prepositions",
    vocabularySlugs: ["classroom-basics", "home-and-objects", "places-around-town"],
    order: 120,
    estimatedMinutes: 9,
    sentences: [
      ["El libro está en la mesa.", "The book is on the table.", "Use estar for object location."],
      ["La mochila está en la silla.", "The backpack is on the chair.", "La mochila needs está."],
      ["La tienda está cerca.", "The store is nearby.", "Cerca is a simple location word."],
      ["Las llaves están en la cocina.", "The keys are in the kitchen.", "Plural keys use están."]
    ]
  },
  {
    slug: "plural-agreement-basics",
    title: "Plural Agreement Basics",
    summary: "Make articles, nouns, and adjectives work together in plural sentences.",
    cefrLevel: "A1",
    theme: "Noun Patterns",
    situation: "people and objects",
    imageKey: "grammar-scenes:8",
    topicSlug: "plural-agreement",
    vocabularySlugs: ["classroom-basics", "people-and-pronouns"],
    order: 130,
    estimatedMinutes: 8,
    sentences: [
      ["Los estudiantes están en clase.", "The students are in class.", "Los marks masculine or mixed plural."],
      ["Las sillas son nuevas.", "The chairs are new.", "Las and nuevas are feminine plural."],
      ["Ellos trabajan hoy.", "They work today.", "Ellos needs the plural verb ending."],
      ["Las manzanas son rojas.", "The apples are red.", "Plural nouns often add -s."]
    ]
  },
  {
    slug: "question-words-basics",
    title: "Question Words Basics",
    summary: "Ask what, where, when, who, and how much with practical sentence frames.",
    cefrLevel: "A1",
    theme: "Questions",
    situation: "conversation and travel",
    imageKey: "directions-and-question-intents:20",
    topicSlug: "question-words",
    vocabularySlugs: ["useful-phrases", "travel-and-survival"],
    order: 140,
    estimatedMinutes: 8,
    sentences: [
      ["¿Qué quieres?", "What do you want?", "Qué asks what."],
      ["¿Dónde está la estación?", "Where is the station?", "Dónde asks where."],
      ["¿Cuánto cuesta?", "How much does it cost?", "Cuánto asks how much."],
      ["¿Quién habla?", "Who is speaking?", "Quién asks who."]
    ]
  },
  {
    slug: "negation-simple-sentences",
    title: "Simple Negation",
    summary: "Say what you are not, do not have, or do not understand.",
    cefrLevel: "A1",
    theme: "Sentence Control",
    situation: "conversation repair",
    imageKey: "grammar-scenes:12",
    topicSlug: "negation-basics",
    vocabularySlugs: ["useful-phrases", "daily-actions"],
    order: 150,
    estimatedMinutes: 7,
    sentences: [
      ["No entiendo.", "I do not understand.", "No goes before the verb."],
      ["No soy profesor.", "I am not a teacher.", "Negate ser with no before soy."],
      ["No tengo un mapa.", "I do not have a map.", "No goes before tengo."],
      ["Ella no trabaja hoy.", "She does not work today.", "The verb stays conjugated."]
    ]
  },
  {
    slug: "tener-and-necesitar",
    title: "Tener and Necesitar",
    summary: "Talk about what you have and what you need in real situations.",
    cefrLevel: "A1",
    theme: "Useful Verbs",
    situation: "travel and daily needs",
    imageKey: "wants-needs-and-possession:1",
    topicSlug: "tener-necesitar",
    vocabularySlugs: ["travel-and-survival", "useful-phrases", "home-and-objects"],
    order: 160,
    estimatedMinutes: 9,
    sentences: [
      ["Tengo un mapa.", "I have a map.", "Tengo means I have."],
      ["Necesito ayuda.", "I need help.", "Necesito is useful when stuck."],
      ["Necesito las llaves.", "I need the keys.", "Las marks plural feminine."],
      ["Tenemos una mesa.", "We have a table.", "Tenemos means we have."]
    ]
  },
  {
    slug: "checkpoint-a1-survival-spanish",
    title: "A1.2 Survival Spanish Checkpoint",
    summary: "Check food, travel, location, questions, negation, tener, and necesitar.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "travel survival",
    imageKey: "travel-and-survival:1",
    topicSlug: "travel-questions",
    vocabularySlugs: ["food-and-ordering", "travel-and-survival", "places-around-town", "useful-phrases"],
    order: 165,
    estimatedMinutes: 10,
    outcomes: [
      "You can ask where an important place is.",
      "You can say what you need in a travel situation.",
      "You can make a simple negative sentence."
    ],
    conceptKeys: ["checkpoint", "travel-questions", "negation", "tener-necesitar", "location"],
    reviewSummary: "You checked survival Spanish for food, travel, locations, questions, and practical needs.",
    sentences: [
      ["¿Dónde está el hotel?", "Where is the hotel?", "Use dónde está for location questions."],
      ["Necesito un taxi.", "I need a taxi.", "Necesito is a practical need verb."],
      ["No tengo un mapa.", "I do not have a map.", "No goes before the verb."],
      ["Quiero un café, por favor.", "I want a coffee, please.", "A practical café request."]
    ]
  },
  {
    slug: "daily-actions-expanded",
    title: "Daily Actions Expanded",
    summary: "Practice more daily verbs and build flexible present-tense sentences.",
    cefrLevel: "A1",
    theme: "Verbs",
    situation: "daily routine",
    imageKey: "daily-actions:7",
    topicSlug: "present-tense-ar",
    vocabularySlugs: ["daily-actions", "people-and-pronouns"],
    order: 170,
    estimatedMinutes: 9,
    sentences: [
      ["Yo compro pan.", "I buy bread.", "Comprar is a regular -ar verb."],
      ["Nosotros caminamos al parque.", "We walk to the park.", "Nosotros uses -amos."],
      ["Ella lee un libro.", "She reads a book.", "Leer is useful even before full -er verb study."],
      ["Tú hablas con un amigo.", "You speak with a friend.", "Tú uses -as for regular -ar verbs."]
    ]
  },
  {
    slug: "market-and-fruit",
    title: "Market and Fruit",
    summary: "Build food vocabulary with articles, color descriptions, and buying phrases.",
    cefrLevel: "A1",
    theme: "Food and Ordering",
    situation: "market",
    imageKey: "fruit-and-produce:21",
    topicSlug: "ordering-food",
    vocabularySlugs: ["fruit-and-produce", "food-and-ordering"],
    order: 180,
    estimatedMinutes: 8,
    sentences: [
      ["Quiero una manzana.", "I want an apple.", "Una matches feminine singular manzana."],
      ["El plátano es amarillo.", "The banana is yellow.", "Use ser for a normal trait."],
      ["Compro fruta en el mercado.", "I buy fruit at the market.", "Compro is the yo form of comprar."],
      ["La ensalada está fresca.", "The salad is fresh.", "La and fresca agree."]
    ]
  },
  {
    slug: "restaurant-conversation",
    title: "Restaurant Conversation",
    summary: "Use ordering phrases, requests, and polite conversation repair.",
    cefrLevel: "A1",
    theme: "Food and Ordering",
    situation: "restaurant",
    imageKey: "food-and-ordering:19",
    topicSlug: "ordering-food",
    vocabularySlugs: ["food-and-ordering", "useful-phrases"],
    order: 190,
    estimatedMinutes: 9,
    sentences: [
      ["Un café, por favor.", "A coffee, please.", "A short polite order is enough."],
      ["La cuenta, por favor.", "The bill, please.", "A complete restaurant phrase."],
      ["No entiendo el menú.", "I do not understand the menu.", "Use no before entiendo."],
      ["¿Cuánto cuesta el postre?", "How much does the dessert cost?", "Cuánto asks price."]
    ]
  },
  {
    slug: "polite-words-one-at-a-time",
    title: "Polite Words One at a Time",
    summary: "Slow down and practice por favor, gracias, and perdón as separate building blocks.",
    cefrLevel: "A1",
    theme: "Conversation Repair",
    situation: "polite basics",
    imageKey: "communication-repair:5",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["useful-phrases"],
    order: 200,
    estimatedMinutes: 5,
    sentences: [
      ["Por favor.", "Please.", "Use por favor to make a request polite."],
      ["Gracias.", "Thank you.", "Gracias is the basic thank-you phrase."],
      ["Perdón.", "Sorry / excuse me.", "Use perdón to apologize or get attention."],
      ["Perdón, por favor.", "Excuse me, please.", "Two short phrases can work together."]
    ]
  },
  {
    slug: "slow-down-and-repeat",
    title: "Slow Down and Repeat",
    summary: "Practice the exact phrase you need when speech feels too fast.",
    cefrLevel: "A1",
    theme: "Conversation Repair",
    situation: "asking someone to slow down",
    imageKey: "communication-repair:9",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["useful-phrases"],
    order: 210,
    estimatedMinutes: 5,
    sentences: [
      ["Más despacio.", "More slowly.", "Use más despacio when someone speaks too fast."],
      ["Más despacio, por favor.", "More slowly, please.", "Add por favor to make the request polite."],
      ["No entiendo.", "I do not understand.", "Use this when you are lost."],
      ["No entiendo, más despacio.", "I do not understand, more slowly.", "Combine repair phrases in one sentence."]
    ]
  },
  {
    slug: "checkpoint-a1-daily-life",
    title: "A1.3 Daily Life Checkpoint",
    summary: "Check daily actions, market phrases, restaurant requests, and repair phrases.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "daily errands",
    imageKey: "food-and-ordering:19",
    topicSlug: "ordering-food",
    vocabularySlugs: ["daily-actions", "fruit-and-produce", "food-and-ordering", "useful-phrases"],
    order: 215,
    estimatedMinutes: 10,
    outcomes: [
      "You can produce a simple daily action.",
      "You can order or ask about food politely.",
      "You can use repair phrases when you do not understand."
    ],
    conceptKeys: ["checkpoint", "daily-actions", "ordering-food", "conversation-repair"],
    reviewSummary: "You checked daily-life actions, market and restaurant phrases, and repair language.",
    sentences: [
      ["Compro pan.", "I buy bread.", "Comprar becomes compro for yo."],
      ["Quiero una manzana.", "I want an apple.", "Una matches manzana."],
      ["Un café, por favor.", "A coffee, please.", "A short polite order works."],
      ["No entiendo, más despacio, por favor.", "I do not understand, more slowly please.", "Use this when speech is too fast."]
    ]
  },
  {
    slug: "soy-with-people",
    title: "Soy with People",
    summary: "Use soy for simple identity sentences with people words.",
    cefrLevel: "A1",
    theme: "Identity",
    situation: "introducing yourself",
    imageKey: "people-and-family:3",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns", "classroom-basics"],
    order: 220,
    estimatedMinutes: 6,
    sentences: [
      ["Soy estudiante.", "I am a student.", "Soy is enough when the subject is I."],
      ["Yo soy estudiante.", "I am a student.", "Yo can be included for emphasis or clarity."],
      ["Soy profesor.", "I am a teacher.", "Use soy for roles and identities."],
      ["Yo soy una persona.", "I am a person.", "Una matches persona."]
    ]
  },
  {
    slug: "soy-de-origin",
    title: "Soy de for Origin",
    summary: "Learn the tiny frame soy de for saying where you are from.",
    cefrLevel: "A1",
    theme: "Identity",
    situation: "saying where you are from",
    imageKey: "travel-and-survival:5",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["useful-phrases", "people-and-pronouns"],
    order: 230,
    estimatedMinutes: 5,
    sentences: [
      ["Soy de Austria.", "I am from Austria.", "Use soy de for origin."],
      ["Yo soy de Austria.", "I am from Austria.", "Yo is optional but useful for beginners."],
      ["Ella es de Austria.", "She is from Austria.", "Use es de for he, she, or it."],
      ["Él es de Austria.", "He is from Austria.", "Él plus es gives he is."]
    ]
  },
  {
    slug: "el-article-masculine",
    title: "El for Masculine Nouns",
    summary: "Practice one article at a time: el before masculine singular nouns.",
    cefrLevel: "A1",
    theme: "Articles",
    situation: "objects and places",
    imageKey: "classroom-basics:3",
    topicSlug: "articles-gender",
    vocabularySlugs: ["classroom-basics", "places-around-town"],
    order: 240,
    estimatedMinutes: 6,
    sentences: [
      ["El libro.", "The book.", "Libro uses el."],
      ["El parque.", "The park.", "Parque uses el."],
      ["El estudiante.", "The student.", "Estudiante can use el for a male student."],
      ["El libro es nuevo.", "The book is new.", "El marks a masculine singular noun."]
    ]
  },
  {
    slug: "la-article-feminine",
    title: "La for Feminine Nouns",
    summary: "Practice one article at a time: la before feminine singular nouns.",
    cefrLevel: "A1",
    theme: "Articles",
    situation: "objects and places",
    imageKey: "classroom-basics:6",
    topicSlug: "articles-gender",
    vocabularySlugs: ["classroom-basics", "places-around-town"],
    order: 250,
    estimatedMinutes: 6,
    sentences: [
      ["La silla.", "The chair.", "Silla uses la."],
      ["La tienda.", "The store.", "Tienda uses la."],
      ["La profesora.", "The teacher.", "Profesora uses la."],
      ["La tienda está abierta.", "The store is open.", "La marks a feminine singular noun."]
    ]
  },
  {
    slug: "un-and-una",
    title: "Un and Una",
    summary: "Move from the to a/an with one masculine and one feminine form.",
    cefrLevel: "A1",
    theme: "Articles",
    situation: "asking for things",
    imageKey: "food-and-ordering:3",
    topicSlug: "articles-gender",
    vocabularySlugs: ["food-and-ordering", "classroom-basics"],
    order: 260,
    estimatedMinutes: 6,
    sentences: [
      ["Un café.", "A coffee.", "Café uses un."],
      ["Una manzana.", "An apple.", "Manzana uses una."],
      ["Quiero un café.", "I want a coffee.", "Use un before café."],
      ["Quiero una manzana.", "I want an apple.", "Use una before manzana."]
    ]
  },
  {
    slug: "estoy-en-one-place",
    title: "Estoy en One Place",
    summary: "Use estoy en for saying where you are right now.",
    cefrLevel: "A1",
    theme: "Location",
    situation: "where you are",
    imageKey: "places-around-town:7",
    topicSlug: "location-prepositions",
    vocabularySlugs: ["places-around-town", "home-and-objects"],
    order: 270,
    estimatedMinutes: 6,
    sentences: [
      ["Estoy en casa.", "I am at home.", "Estoy en gives your current location."],
      ["Estoy en el café.", "I am in the café.", "Use en el before masculine place nouns."],
      ["Estoy en la tienda.", "I am in the store.", "Use en la before feminine place nouns."],
      ["Estoy en la biblioteca.", "I am in the library.", "Estar handles location."]
    ]
  },
  {
    slug: "esta-cerca-y-lejos",
    title: "Está Cerca y Lejos",
    summary: "Say that a place is near or far with está.",
    cefrLevel: "A1",
    theme: "Location",
    situation: "finding places",
    imageKey: "directions-and-question-intents:4",
    topicSlug: "location-prepositions",
    vocabularySlugs: ["places-around-town", "travel-and-survival"],
    order: 280,
    estimatedMinutes: 6,
    sentences: [
      ["La tienda está cerca.", "The store is nearby.", "Use está for location."],
      ["La estación está lejos.", "The station is far.", "Lejos means far."],
      ["El hotel está cerca.", "The hotel is nearby.", "Hotel uses el."],
      ["El museo está lejos.", "The museum is far.", "Museo uses el."]
    ]
  },
  {
    slug: "no-before-the-verb",
    title: "No Before the Verb",
    summary: "Practice the simplest Spanish negation pattern slowly.",
    cefrLevel: "A1",
    theme: "Negation",
    situation: "simple negatives",
    imageKey: "grammar-scenes:12",
    topicSlug: "negation-basics",
    vocabularySlugs: ["useful-phrases", "daily-actions"],
    order: 290,
    estimatedMinutes: 6,
    sentences: [
      ["No entiendo.", "I do not understand.", "No goes before entiendo."],
      ["No hablo español.", "I do not speak Spanish.", "No goes before hablo."],
      ["No soy estudiante.", "I am not a student.", "No goes before soy."],
      ["Ella no trabaja hoy.", "She does not work today.", "No stays before the conjugated verb."]
    ]
  },
  {
    slug: "checkpoint-a1-building-blocks",
    title: "A1.4 Building Blocks Checkpoint",
    summary: "Check identity, origin, articles, location, and simple negation.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "basic sentence control",
    imageKey: "grammar-scenes:12",
    topicSlug: "negation-basics",
    vocabularySlugs: ["people-and-pronouns", "classroom-basics", "places-around-town", "useful-phrases"],
    order: 295,
    estimatedMinutes: 10,
    outcomes: [
      "You can say where you are from.",
      "You can choose common articles one at a time.",
      "You can negate a simple identity sentence."
    ],
    conceptKeys: ["checkpoint", "identity", "articles", "location", "negation"],
    reviewSummary: "You checked the core sentence blocks: identity, origin, articles, location, and no before the verb.",
    sentences: [
      ["Soy de Austria.", "I am from Austria.", "Use soy de for origin."],
      ["La tienda está abierta.", "The store is open.", "La matches tienda."],
      ["Estoy en el café.", "I am in the café.", "Use estoy en for location."],
      ["No soy estudiante.", "I am not a student.", "No goes before soy."]
    ]
  },
  {
    slug: "quiero-one-thing",
    title: "Quiero One Thing",
    summary: "Use quiero with one food or drink before building longer orders.",
    cefrLevel: "A1",
    theme: "Ordering",
    situation: "café",
    imageKey: "wants-needs-and-possession:9",
    topicSlug: "ordering-food",
    vocabularySlugs: ["food-and-ordering", "fruit-and-produce"],
    order: 300,
    estimatedMinutes: 6,
    sentences: [
      ["Quiero agua.", "I want water.", "Quiero can be followed directly by a noun."],
      ["Quiero un café.", "I want a coffee.", "Add un before café."],
      ["Quiero pan.", "I want bread.", "Some food requests do not need an article."],
      ["Quiero una naranja.", "I want an orange.", "Una matches naranja."]
    ]
  },
  {
    slug: "necesito-one-thing",
    title: "Necesito One Thing",
    summary: "Use necesito for practical needs one object at a time.",
    cefrLevel: "A1",
    theme: "Useful Verbs",
    situation: "travel needs",
    imageKey: "wants-needs-and-possession:3",
    topicSlug: "tener-necesitar",
    vocabularySlugs: ["travel-and-survival", "home-and-objects", "useful-phrases"],
    order: 310,
    estimatedMinutes: 6,
    sentences: [
      ["Necesito ayuda.", "I need help.", "A survival phrase for getting unstuck."],
      ["Necesito un mapa.", "I need a map.", "Use un before mapa."],
      ["Necesito la llave.", "I need the key.", "Use la before llave."],
      ["Necesito el pasaporte.", "I need the passport.", "Use el before pasaporte."]
    ]
  },
  {
    slug: "tengo-one-thing",
    title: "Tengo One Thing",
    summary: "Use tengo to say what you have before adding longer sentences.",
    cefrLevel: "A1",
    theme: "Useful Verbs",
    situation: "possessions",
    imageKey: "wants-needs-and-possession:1",
    topicSlug: "tener-necesitar",
    vocabularySlugs: ["travel-and-survival", "home-and-objects"],
    order: 320,
    estimatedMinutes: 6,
    sentences: [
      ["Tengo un mapa.", "I have a map.", "Tengo means I have."],
      ["Tengo una llave.", "I have a key.", "Use una before llave."],
      ["Tengo una mochila.", "I have a backpack.", "Mochila uses una."],
      ["No tengo el pasaporte.", "I do not have the passport.", "No goes before tengo."]
    ]
  },
  {
    slug: "donde-esta-frame",
    title: "Dónde Está Frame",
    summary: "Learn one question frame: dónde está plus a place.",
    cefrLevel: "A1",
    theme: "Questions",
    situation: "asking for location",
    imageKey: "directions-and-question-intents:9",
    topicSlug: "question-words",
    vocabularySlugs: ["travel-and-survival", "places-around-town"],
    order: 330,
    estimatedMinutes: 6,
    sentences: [
      ["¿Dónde está el hotel?", "Where is the hotel?", "Dónde asks where."],
      ["¿Dónde está la estación?", "Where is the station?", "Use la before estación."],
      ["¿Dónde está el museo?", "Where is the museum?", "Use el before museo."],
      ["¿Dónde está el restaurante?", "Where is the restaurant?", "One frame works with many places."]
    ]
  },
  {
    slug: "que-quieres-frame",
    title: "Qué Quieres Frame",
    summary: "Use qué quieres to ask what someone wants.",
    cefrLevel: "A1",
    theme: "Questions",
    situation: "simple choices",
    imageKey: "directions-and-question-intents:20",
    topicSlug: "question-words",
    vocabularySlugs: ["food-and-ordering", "useful-phrases"],
    order: 340,
    estimatedMinutes: 6,
    sentences: [
      ["¿Qué quieres?", "What do you want?", "Qué asks what."],
      ["Quiero agua.", "I want water.", "Answer with quiero."],
      ["Quiero un café.", "I want a coffee.", "A short answer is natural."],
      ["No entiendo la pregunta.", "I do not understand the question.", "Use a repair phrase when needed."]
    ]
  },
  {
    slug: "cuanto-cuesta-frame",
    title: "Cuánto Cuesta Frame",
    summary: "Practice one price question before using it in restaurants and markets.",
    cefrLevel: "A1",
    theme: "Questions",
    situation: "prices",
    imageKey: "directions-and-question-intents:25",
    topicSlug: "question-words",
    vocabularySlugs: ["food-and-ordering", "fruit-and-produce", "useful-phrases"],
    order: 350,
    estimatedMinutes: 6,
    sentences: [
      ["¿Cuánto cuesta?", "How much does it cost?", "A complete useful question."],
      ["¿Cuánto cuesta el pan?", "How much does the bread cost?", "Use el before pan."],
      ["¿Cuánto cuesta la manzana?", "How much does the apple cost?", "Use la before manzana."],
      ["La cuenta, por favor.", "The bill, please.", "Useful after asking about prices."]
    ]
  },
  {
    slug: "yo-ar-verbs",
    title: "Yo with -ar Verbs",
    summary: "Practice just the I form of common -ar verbs.",
    cefrLevel: "A1",
    theme: "Verbs",
    situation: "talking about yourself",
    imageKey: "daily-actions:1",
    topicSlug: "present-tense-ar",
    vocabularySlugs: ["daily-actions", "food-and-ordering"],
    order: 360,
    estimatedMinutes: 7,
    sentences: [
      ["Yo hablo español.", "I speak Spanish.", "Yo uses the -o ending."],
      ["Yo estudio hoy.", "I study today.", "Estudiar becomes estudio."],
      ["Yo trabajo hoy.", "I work today.", "Trabajar becomes trabajo."],
      ["Yo compro pan.", "I buy bread.", "Comprar becomes compro."]
    ]
  },
  {
    slug: "tu-ar-verbs",
    title: "Tú with -ar Verbs",
    summary: "Practice just the you form of common -ar verbs.",
    cefrLevel: "A1",
    theme: "Verbs",
    situation: "talking to one person",
    imageKey: "daily-actions:2",
    topicSlug: "present-tense-ar",
    vocabularySlugs: ["daily-actions", "people-and-pronouns"],
    order: 370,
    estimatedMinutes: 7,
    sentences: [
      ["Tú hablas español.", "You speak Spanish.", "Tú uses the -as ending."],
      ["Tú estudias hoy.", "You study today.", "Estudiar becomes estudias."],
      ["Tú trabajas hoy.", "You work today.", "Trabajar becomes trabajas."],
      ["Tú compras pan.", "You buy bread.", "Comprar becomes compras."]
    ]
  },
  {
    slug: "nosotros-and-ellos-ar-verbs",
    title: "Nosotros and Ellos with -ar Verbs",
    summary: "Practice we and they forms after yo and tú feel familiar.",
    cefrLevel: "A1",
    theme: "Verbs",
    situation: "groups",
    imageKey: "subject-pronouns-and-roles:6",
    topicSlug: "present-tense-ar",
    vocabularySlugs: ["daily-actions", "people-and-pronouns"],
    order: 380,
    estimatedMinutes: 7,
    sentences: [
      ["Nosotros hablamos español.", "We speak Spanish.", "Nosotros uses -amos."],
      ["Nosotros caminamos al parque.", "We walk to the park.", "Caminar becomes caminamos."],
      ["Ellos trabajan hoy.", "They work today.", "Ellos uses -an."],
      ["Ellos estudian hoy.", "They study today.", "Estudiar becomes estudian."]
    ]
  },
  {
    slug: "feeling-words-slowly",
    title: "Feeling Words Slowly",
    summary: "Use estoy with one feeling at a time before adding agreement details.",
    cefrLevel: "A1",
    theme: "Feelings",
    situation: "how you feel",
    imageKey: "emotions-and-states:1",
    topicSlug: "estar-emotions",
    vocabularySlugs: ["emotions-and-states"],
    order: 390,
    estimatedMinutes: 6,
    sentences: [
      ["Estoy feliz.", "I am happy.", "Use estoy for a current feeling."],
      ["Estoy triste.", "I am sad.", "Triste works for masculine and feminine."],
      ["Estoy cansado.", "I am tired.", "Cansado is a masculine form."],
      ["Estoy emocionado.", "I am excited.", "Use estar for current emotional state."],
      ["Ella está triste.", "She is sad.", "Use está for one person: ella."],
      ["Ana está nerviosa.", "Ana is nervous.", "Nerviosa is a feminine form."]
    ]
  },
  {
    slug: "objects-on-the-table",
    title: "Objects on the Table",
    summary: "Use estar en with concrete objects around the home and classroom.",
    cefrLevel: "A1",
    theme: "Location",
    situation: "objects around you",
    imageKey: "object-location-scenes:1",
    topicSlug: "location-prepositions",
    vocabularySlugs: ["home-and-objects", "classroom-basics"],
    order: 400,
    estimatedMinutes: 7,
    sentences: [
      ["El libro está en la mesa.", "The book is on the table.", "Use estar for object location."],
      ["El lápiz está en la mesa.", "The pencil is on the table.", "El marks lápiz."],
      ["La mochila está en la silla.", "The backpack is on the chair.", "La marks mochila."],
      ["La llave está en la mesa.", "The key is on the table.", "La marks llave."]
    ]
  },
  {
    slug: "plural-articles-slowly",
    title: "Plural Articles Slowly",
    summary: "Move from el and la to los and las with easy examples.",
    cefrLevel: "A1",
    theme: "Plural Agreement",
    situation: "people and objects",
    imageKey: "grammar-scenes:8",
    topicSlug: "plural-agreement",
    vocabularySlugs: ["classroom-basics", "people-and-pronouns", "fruit-and-produce"],
    order: 410,
    estimatedMinutes: 7,
    sentences: [
      ["Los estudiantes.", "The students.", "Los marks masculine or mixed plural."],
      ["Las sillas.", "The chairs.", "Las marks feminine plural."],
      ["Las uvas están frescas.", "The grapes are fresh.", "Las works with feminine plural nouns."],
      ["Los estudiantes hablan.", "The students speak.", "Plural people use a plural verb form."]
    ]
  },
  {
    slug: "checkpoint-a1-verb-frames",
    title: "A1.5 Verb Frames Checkpoint",
    summary: "Check quiero, necesito, tengo, question frames, -ar verb forms, feelings, location, and plurals.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "mixed A1 frames",
    imageKey: "grammar-scenes:10",
    topicSlug: "present-tense-ar",
    vocabularySlugs: ["food-and-ordering", "travel-and-survival", "daily-actions", "home-and-objects", "classroom-basics"],
    order: 415,
    estimatedMinutes: 12,
    outcomes: [
      "You can use quiero, necesito, and tengo in useful sentences.",
      "You can ask a simple location or price question.",
      "You can produce common regular -ar forms."
    ],
    conceptKeys: ["checkpoint", "verb-frames", "question-words", "present-tense-ar", "plural-agreement"],
    reviewSummary: "You checked A1 verb frames, question frames, -ar forms, location, feelings, and plural articles.",
    sentences: [
      ["Quiero un café, por favor.", "I want a coffee, please.", "Quiero can introduce a food or drink request."],
      ["Tengo una mochila.", "I have a backpack.", "Tengo states possession."],
      ["Nosotros hablamos español.", "We speak Spanish.", "Nosotros uses the -amos ending."],
      ["El libro está en la mesa.", "The book is on the table.", "Use estar for location."]
    ]
  },
  {
    slug: "checkpoint-a1-foundations",
    title: "Final A1 Foundations Checkpoint",
    summary: "Mix identity, location, articles, verbs, food, travel, health, numbers, descriptions, and weather.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "mixed review",
    imageKey: "grammar-scenes:1",
    topicSlug: "question-words",
    vocabularySlugs: ["classroom-basics", "daily-actions", "food-and-ordering", "travel-and-survival", "useful-phrases", "body-and-health", "numbers-and-colors", "weather-and-time"],
    order: 495,
    estimatedMinutes: 16,
    outcomes: [
      "You can produce mixed A1 sentences without seeing the answer list first.",
      "You can combine identity, location, needs, and daily-life language.",
      "You can handle basic health, color, number, and weather statements."
    ],
    conceptKeys: ["checkpoint", "a1-final", "ser-estar", "articles", "questions", "health", "weather"],
    reviewSummary: "You completed the final A1 checkpoint across identity, location, food, travel, repair phrases, health, numbers, descriptions, and weather.",
    sentences: [
      ["Yo soy estudiante y estoy en la biblioteca.", "I am a student and I am in the library.", "Mix ser for identity and estar for location."],
      ["Quiero un café, por favor.", "I want a coffee, please.", "Use un with café."],
      ["¿Dónde está la estación?", "Where is the station?", "Travel question frame."],
      ["No entiendo, más despacio, por favor.", "I do not understand, more slowly please.", "Conversation repair phrase."],
      ["Me duele la cabeza.", "My head hurts.", "Use me duele with one thing that hurts."],
      ["Hace sol en el parque.", "It is sunny in the park.", "Hace sol describes sunny weather."]
    ]
  },
  {
    slug: "body-words-slowly",
    title: "Body Words Slowly",
    summary: "Learn a few body words before using health phrases.",
    cefrLevel: "A1",
    theme: "Health",
    situation: "body vocabulary",
    imageKey: "body-and-health:6",
    topicSlug: "tener-necesitar",
    vocabularySlugs: ["body-and-health"],
    order: 430,
    estimatedMinutes: 6,
    sentences: [
      ["La cabeza.", "The head.", "Cabeza uses la."],
      ["La mano.", "The hand.", "Mano uses la."],
      ["El pie.", "The foot.", "Pie uses el."],
      ["El cuerpo está cansado.", "The body is tired.", "Use estar for a current state."]
    ]
  },
  {
    slug: "me-duele-basics",
    title: "Me Duele Basics",
    summary: "Use me duele to say what hurts.",
    cefrLevel: "A1",
    theme: "Health",
    situation: "saying what hurts",
    imageKey: "body-and-health:7",
    topicSlug: "tener-necesitar",
    vocabularySlugs: ["body-and-health", "useful-phrases"],
    order: 440,
    estimatedMinutes: 7,
    sentences: [
      ["Me duele la cabeza.", "My head hurts.", "Use me duele with one thing that hurts."],
      ["Me duele el pie.", "My foot hurts.", "El matches pie."],
      ["Necesito un doctor.", "I need a doctor.", "Use necesito for practical needs."],
      ["No entiendo al doctor.", "I do not understand the doctor.", "Use no before entiendo."]
    ]
  },
  {
    slug: "hunger-thirst-hot-cold",
    title: "Hunger, Thirst, Hot, Cold",
    summary: "Use tengo for common body states.",
    cefrLevel: "A1",
    theme: "Health",
    situation: "body states",
    imageKey: "body-and-health:10",
    topicSlug: "tener-necesitar",
    vocabularySlugs: ["body-and-health", "food-and-ordering", "weather-and-time"],
    order: 450,
    estimatedMinutes: 7,
    sentences: [
      ["Tengo hambre.", "I am hungry.", "Spanish uses tengo with hunger."],
      ["Tengo sed.", "I am thirsty.", "Spanish uses tengo with thirst."],
      ["Tengo frío.", "I am cold.", "Spanish uses tengo with cold."],
      ["Tengo calor.", "I am hot.", "Spanish uses tengo with heat."]
    ]
  },
  {
    slug: "checkpoint-a1-health-and-states",
    title: "A1.6 Health and Body States Checkpoint",
    summary: "Check body words, me duele, necesito, and common tengo states.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "pharmacy or doctor",
    imageKey: "body-and-health:7",
    topicSlug: "tener-necesitar",
    vocabularySlugs: ["body-and-health", "useful-phrases", "food-and-ordering", "weather-and-time"],
    order: 455,
    estimatedMinutes: 9,
    outcomes: [
      "You can name basic body parts with the right article.",
      "You can say what hurts.",
      "You can express hunger, thirst, heat, and cold with tengo."
    ],
    conceptKeys: ["checkpoint", "health", "tener-states", "me-duele"],
    reviewSummary: "You checked body words, me duele, necesito, and common states with tengo.",
    sentences: [
      ["La cabeza.", "The head.", "Cabeza uses la."],
      ["Me duele la cabeza.", "My head hurts.", "Use me duele for one hurting body part."],
      ["Necesito un doctor.", "I need a doctor.", "Use necesito for practical needs."],
      ["Tengo hambre.", "I am hungry.", "Spanish uses tengo with hunger."]
    ]
  },
  {
    slug: "numbers-one-to-five",
    title: "Numbers One to Five",
    summary: "Count from one to five with familiar objects.",
    cefrLevel: "A1",
    theme: "Numbers",
    situation: "counting",
    imageKey: "quantities-and-clear-colors:5",
    topicSlug: "plural-agreement",
    vocabularySlugs: ["numbers-and-colors", "fruit-and-produce", "classroom-basics"],
    order: 460,
    estimatedMinutes: 7,
    sentences: [
      ["Tengo uno.", "I have one.", "Uno means one."],
      ["Tengo dos manzanas.", "I have two apples.", "Dos means two."],
      ["Tengo tres libros.", "I have three books.", "Tres means three."],
      ["Quiero cuatro uvas.", "I want four grapes.", "Cuatro means four."],
      ["Tengo cinco minutos.", "I have five minutes.", "Cinco means five."]
    ]
  },
  {
    slug: "numbers-six-to-ten",
    title: "Numbers Six to Ten",
    summary: "Finish the first counting set so you can count from one to ten.",
    cefrLevel: "A1",
    theme: "Numbers",
    situation: "counting",
    imageKey: "quantities-and-clear-colors:10",
    topicSlug: "plural-agreement",
    vocabularySlugs: ["numbers-and-colors", "fruit-and-produce", "classroom-basics"],
    order: 465,
    estimatedMinutes: 7,
    sentences: [
      ["Tengo seis uvas.", "I have six grapes.", "Seis means six."],
      ["Tengo siete libros.", "I have seven books.", "Siete means seven."],
      ["Tengo ocho manzanas.", "I have eight apples.", "Ocho means eight."],
      ["Quiero nueve fresas.", "I want nine strawberries.", "Nueve means nine."],
      ["Tengo diez minutos.", "I have ten minutes.", "Diez means ten."]
    ]
  },
  {
    slug: "color-words-basics",
    title: "Basic Color Words",
    summary: "Name the core colors before describing real objects.",
    cefrLevel: "A1",
    theme: "Descriptions",
    situation: "naming colors",
    imageKey: "quantities-and-clear-colors:16",
    topicSlug: "articles-gender",
    vocabularySlugs: ["numbers-and-colors"],
    order: 470,
    estimatedMinutes: 7,
    sentences: [
      ["El color es rojo.", "The color is red.", "Rojo is the basic masculine form for red."],
      ["El color es azul.", "The color is blue.", "Azul does not change for masculine or feminine."],
      ["El color es verde.", "The color is green.", "Verde does not change for masculine or feminine."],
      ["El color es amarillo.", "The color is yellow.", "Amarillo is the basic masculine form for yellow."],
      ["El color es blanco.", "The color is white.", "Blanco is the basic masculine form for white."],
      ["El color es negro.", "The color is black.", "Negro is the basic masculine form for black."]
    ]
  },
  {
    slug: "colors-with-things",
    title: "Colors with Things",
    summary: "Use color words with masculine and feminine things.",
    cefrLevel: "A1",
    theme: "Descriptions",
    situation: "describing objects",
    imageKey: "quantities-and-clear-colors:25",
    topicSlug: "articles-gender",
    vocabularySlugs: ["numbers-and-colors", "fruit-and-produce", "clothing-basics", "home-and-objects"],
    order: 475,
    estimatedMinutes: 8,
    sentences: [
      ["La manzana es roja.", "The apple is red.", "Roja agrees with manzana."],
      ["El tomate es rojo.", "The tomato is red.", "Rojo agrees with tomate."],
      ["La camisa es azul.", "The shirt is blue.", "Azul works for masculine and feminine."],
      ["La ensalada es verde.", "The salad is green.", "Verde works for masculine and feminine."],
      ["El plátano es amarillo.", "The banana is yellow.", "Amarillo agrees with plátano."],
      ["La camisa es blanca.", "The shirt is white.", "Blanca agrees with camisa."],
      ["La mochila es negra.", "The backpack is black.", "Negra agrees with mochila."]
    ]
  },
  {
    slug: "park-nature-words",
    title: "Park Nature Words",
    summary: "Use outdoor words with estar and simple descriptions.",
    cefrLevel: "A1",
    theme: "Outside",
    situation: "in the park",
    imageKey: "nature-and-animals:10",
    topicSlug: "location-prepositions",
    vocabularySlugs: ["nature-and-animals", "places-around-town"],
    order: 480,
    estimatedMinutes: 7,
    sentences: [
      ["El árbol está en el parque.", "The tree is in the park.", "Use estar for location."],
      ["La flor es roja.", "The flower is red.", "Use ser for a normal description."],
      ["El perro está en casa.", "The dog is at home.", "Use estar for location."],
      ["El parque es bonito.", "The park is pretty.", "Use ser for a general description."]
    ]
  },
  {
    slug: "weather-outside",
    title: "Weather Outside",
    summary: "Connect weather words with outdoor places.",
    cefrLevel: "A1",
    theme: "Weather",
    situation: "outside",
    imageKey: "nature-and-animals:6",
    topicSlug: "question-words",
    vocabularySlugs: ["weather-and-time", "nature-and-animals"],
    order: 490,
    estimatedMinutes: 7,
    sentences: [
      ["Hace sol en el parque.", "It is sunny in the park.", "Hace sol describes sunny weather."],
      ["Llueve en la ciudad.", "It rains in the city.", "Llueve means it rains."],
      ["El agua está fría.", "The water is cold.", "Use estar for current temperature."],
      ["Estoy en la playa.", "I am at the beach.", "Use estar for where you are."]
    ]
  },
  {
    slug: "a2-daily-routine-overview",
    title: "A2 Daily Routine Overview",
    summary: "Describe a simple day from morning to night with time phrases.",
    cefrLevel: "A2",
    theme: "Daily Routine",
    situation: "normal day",
    imageKey: "a2-daily-routine:1",
    topicSlug: "daily-routine-time",
    vocabularySlugs: ["a2-daily-routine", "weather-and-time"],
    order: 520,
    estimatedMinutes: 9,
    outcomes: [
      "You can describe a normal morning and evening.",
      "You can connect routine actions with time phrases.",
      "You can recognize the difference between action verbs and reflexive verbs."
    ],
    conceptKeys: ["daily-routine", "time-phrases", "sequence"],
    reviewSummary: "You practiced describing a daily routine with morning, afternoon, and night phrases.",
    sentences: [
      ["Me despierto temprano.", "I wake up early.", "Despertarse is reflexive: the me shows the action returns to the speaker."],
      ["Desayuno a las ocho.", "I eat breakfast at eight.", "Non-reflexive action verbs do not need me."],
      ["Estudio por la tarde.", "I study in the afternoon.", "Por la tarde means in the afternoon."],
      ["Leo por la noche.", "I read at night.", "Por la noche is a common time phrase."]
    ]
  },
  {
    slug: "a2-reflexive-morning",
    title: "Reflexive Morning Verbs",
    summary: "Use me with common morning actions: wake up, get up, shower, brush teeth, and get dressed.",
    cefrLevel: "A2",
    theme: "Reflexive Verbs",
    situation: "morning routine",
    imageKey: "a2-daily-routine:4",
    topicSlug: "daily-routine-time",
    vocabularySlugs: ["a2-daily-routine"],
    order: 530,
    estimatedMinutes: 10,
    outcomes: [
      "You can use me before a reflexive verb in the yo form.",
      "You can say several morning actions in sequence.",
      "You can avoid adding me to normal non-reflexive verbs."
    ],
    conceptKeys: ["reflexive-verbs", "yo-form", "morning-routine"],
    reviewSummary: "You practiced me despierto, me levanto, me ducho, me cepillo, and me visto.",
    sentences: [
      ["Me despierto a las siete.", "I wake up at seven.", "Use me with despierto because the verb is reflexive here."],
      ["Me levanto después.", "I get up afterward.", "Me levanto is the yo form of levantarse."],
      ["Me ducho por la mañana.", "I shower in the morning.", "Me stays before the conjugated verb."],
      ["Me cepillo los dientes.", "I brush my teeth.", "Spanish says me cepillo los dientes, not mi dientes."],
      ["Me visto antes de desayunar.", "I get dressed before breakfast.", "Antes de plus infinitive means before doing something."]
    ]
  },
  {
    slug: "a2-frequency-and-time",
    title: "Frequency and Time",
    summary: "Say when and how often routine actions happen.",
    cefrLevel: "A2",
    theme: "Time",
    situation: "weekly schedule",
    imageKey: "a2-daily-routine:15",
    topicSlug: "daily-routine-time",
    vocabularySlugs: ["a2-daily-routine", "weather-and-time"],
    order: 540,
    estimatedMinutes: 8,
    outcomes: [
      "You can place actions in the morning, afternoon, or night.",
      "You can use cada semana for weekly habits.",
      "You can build short routine sentences without translating word by word."
    ],
    conceptKeys: ["frequency", "time-phrases", "habit"],
    reviewSummary: "You practiced por la mañana, por la tarde, por la noche, and cada semana.",
    sentences: [
      ["Trabajo por la mañana.", "I work in the morning.", "Use por la mañana for a general time of day."],
      ["Estudio por la tarde.", "I study in the afternoon.", "Por la tarde comes after the action."],
      ["Limpio cada semana.", "I clean every week.", "Cada semana marks frequency."],
      ["Cocino la cena por la noche.", "I cook dinner at night.", "Spanish often puts the time phrase after the action."]
    ]
  },
  {
    slug: "a2-routine-sequence",
    title: "Routine Sequence",
    summary: "Connect routine actions into a small personal paragraph.",
    cefrLevel: "A2",
    theme: "Daily Routine",
    situation: "describing your day",
    imageKey: "a2-daily-routine:12",
    topicSlug: "daily-routine-time",
    vocabularySlugs: ["a2-daily-routine", "daily-actions"],
    order: 550,
    estimatedMinutes: 10,
    outcomes: [
      "You can combine several routine actions in order.",
      "You can use después to connect events.",
      "You can write a short controlled description of your day."
    ],
    conceptKeys: ["sequence", "writing", "routine"],
    reviewSummary: "You practiced linking routine actions into a short description.",
    sentences: [
      ["Primero me levanto.", "First I get up.", "Primero signals the first action."],
      ["Después desayuno.", "Afterward I eat breakfast.", "Después connects the next event."],
      ["Luego voy al trabajo.", "Then I go to work.", "Luego is another simple connector."],
      ["Por la noche leo y me acuesto.", "At night I read and go to bed.", "You can join two routine actions with y."]
    ]
  },
  {
    slug: "checkpoint-a2-daily-routine",
    title: "A2 Daily Routine Checkpoint",
    summary: "Prove you can understand, build, and write beginner routine sentences.",
    cefrLevel: "A2",
    theme: "Checkpoint",
    situation: "daily routine review",
    imageKey: "a2-daily-routine:15",
    topicSlug: "daily-routine-time",
    vocabularySlugs: ["a2-daily-routine"],
    order: 560,
    estimatedMinutes: 12,
    outcomes: [
      "You can produce routine sentences with correct reflexive me.",
      "You can use time and frequency phrases naturally.",
      "You can write a short controlled daily routine."
    ],
    conceptKeys: ["checkpoint", "daily-routine", "reflexive-verbs", "time-phrases"],
    reviewSummary: "You completed the A2 daily routine checkpoint.",
    sentences: [
      ["Me despierto a las siete y desayuno a las ocho.", "I wake up at seven and eat breakfast at eight.", "Use me only with the reflexive verb."],
      ["Trabajo por la mañana y estudio por la tarde.", "I work in the morning and study in the afternoon.", "Time phrases usually follow the action."],
      ["Por la noche leo y me acuesto.", "At night I read and go to bed.", "Me acuesto is reflexive."],
      ["Limpio el cuarto cada semana.", "I clean the room every week.", "Cada semana marks frequency."]
    ]
  },
  {
    slug: "a2-irregular-present-overview",
    title: "Irregular Present Verbs",
    summary: "Learn high-frequency irregular yo forms used in normal daily sentences.",
    cefrLevel: "A2",
    theme: "Irregular Verbs",
    situation: "daily actions",
    imageKey: "irregular-verbs:1",
    topicSlug: "irregular-present-frames",
    vocabularySlugs: ["a2-irregular-verbs", "a2-daily-routine"],
    order: 570,
    estimatedMinutes: 10,
    outcomes: [
      "You can use voy, hago, digo, vengo, and salgo in short sentences.",
      "You can recognize that common verbs often have irregular yo forms.",
      "You can produce several irregular forms without answer choices."
    ],
    conceptKeys: ["irregular-present", "yo-form", "high-frequency-verbs"],
    reviewSummary: "You practiced common irregular yo forms: voy, hago, digo, vengo, and salgo.",
    sentences: [
      ["Voy a la tienda.", "I go to the store.", "Ir becomes voy in the yo form."],
      ["Hago la tarea por la tarde.", "I do homework in the afternoon.", "Hacer becomes hago."],
      ["Digo la verdad.", "I say the truth.", "Decir becomes digo."],
      ["Vengo a casa por la tarde.", "I come home in the afternoon.", "Venir becomes vengo."],
      ["Salgo de casa a las ocho.", "I leave home at eight.", "Salir becomes salgo."]
    ]
  },
  {
    slug: "a2-useful-verb-frames",
    title: "Useful Verb Frames",
    summary: "Use puedo, quiero, necesito, tengo que, and voy a before an infinitive.",
    cefrLevel: "A2",
    theme: "Verb Frames",
    situation: "plans and needs",
    imageKey: "irregular-verbs:13",
    topicSlug: "irregular-present-frames",
    vocabularySlugs: ["a2-irregular-verbs", "daily-actions"],
    order: 580,
    estimatedMinutes: 10,
    outcomes: [
      "You can put an infinitive after puedo, quiero, necesito, and tengo que.",
      "You can use voy a plus infinitive for a simple future plan.",
      "You can describe ability, desire, need, obligation, and plans."
    ],
    conceptKeys: ["verb-frames", "infinitive", "near-future"],
    reviewSummary: "You practiced useful frames: puedo, quiero, necesito, tengo que, and voy a plus infinitive.",
    sentences: [
      ["Puedo estudiar hoy.", "I can study today.", "Use the infinitive estudiar after puedo."],
      ["Quiero ir a la tienda.", "I want to go to the store.", "Use the infinitive ir after quiero."],
      ["Necesito hacer la tarea.", "I need to do homework.", "Necesito can be followed by an infinitive."],
      ["Tengo que trabajar.", "I have to work.", "Tengo que plus infinitive expresses obligation."],
      ["Voy a estudiar mañana.", "I am going to study tomorrow.", "Voy a plus infinitive makes a near-future plan."]
    ]
  },
  {
    slug: "a2-more-irregular-actions",
    title: "More Irregular Actions",
    summary: "Practice pongo, traigo, veo, oigo, sé, conozco, and doy.",
    cefrLevel: "A2",
    theme: "Irregular Verbs",
    situation: "objects and information",
    imageKey: "irregular-verbs:4",
    topicSlug: "irregular-present-frames",
    vocabularySlugs: ["a2-irregular-verbs", "home-and-objects"],
    order: 590,
    estimatedMinutes: 10,
    outcomes: [
      "You can use several irregular yo forms with objects.",
      "You can separate saber for facts from conocer for people.",
      "You can understand and type simple object-action sentences."
    ],
    conceptKeys: ["irregular-present", "object-actions", "saber-conocer"],
    reviewSummary: "You practiced pongo, traigo, veo, oigo, sé, conozco, and doy in concrete sentences.",
    sentences: [
      ["Pongo el libro en la mesa.", "I put the book on the table.", "Poner becomes pongo."],
      ["Traigo una bolsa.", "I bring a bag.", "Traer becomes traigo."],
      ["Veo el letrero.", "I see the sign.", "Ver becomes veo."],
      ["Oigo música.", "I hear music.", "Oír becomes oigo."],
      ["Sé la respuesta.", "I know the answer.", "Saber becomes sé for knowing a fact."],
      ["Conozco a Ana.", "I know Ana.", "Conocer becomes conozco for knowing a person."]
    ]
  },
  {
    slug: "a2-plans-obligations",
    title: "Plans and Obligations",
    summary: "Combine irregular verbs and frames to talk about what you can, want, have to, and plan to do.",
    cefrLevel: "A2",
    theme: "Plans",
    situation: "tomorrow and today",
    imageKey: "irregular-verbs:15",
    topicSlug: "irregular-present-frames",
    vocabularySlugs: ["a2-irregular-verbs", "a2-daily-routine", "daily-actions"],
    order: 600,
    estimatedMinutes: 11,
    outcomes: [
      "You can answer simple questions about today and tomorrow.",
      "You can combine a reason or contrast with pero.",
      "You can write controlled plan sentences with useful frames."
    ],
    conceptKeys: ["plans", "obligation", "near-future", "contrast"],
    reviewSummary: "You practiced combining useful frames into short plan and obligation sentences.",
    sentences: [
      ["Tengo que trabajar hoy.", "I have to work today.", "Tengo que introduces an obligation."],
      ["Quiero ir a la tienda, pero tengo que trabajar.", "I want to go to the store, but I have to work.", "Pero adds a contrast."],
      ["Voy a traer una bolsa.", "I am going to bring a bag.", "Voy a plus infinitive expresses a plan."],
      ["Puedo estudiar por la noche.", "I can study at night.", "Puedo plus infinitive expresses ability."]
    ]
  },
  {
    slug: "checkpoint-a2-verb-frames",
    title: "A2 Verb Frames Checkpoint",
    summary: "Prove you can produce irregular present forms and useful infinitive frames.",
    cefrLevel: "A2",
    theme: "Checkpoint",
    situation: "plans and needs review",
    imageKey: "irregular-verbs:13",
    topicSlug: "irregular-present-frames",
    vocabularySlugs: ["a2-irregular-verbs", "a2-daily-routine"],
    order: 610,
    estimatedMinutes: 13,
    outcomes: [
      "You can produce common irregular yo forms.",
      "You can use puedo, quiero, tengo que, and voy a with infinitives.",
      "You can answer a basic question about tomorrow's plan."
    ],
    conceptKeys: ["checkpoint", "irregular-present", "verb-frames", "near-future"],
    reviewSummary: "You completed the A2 verb frames checkpoint across irregular yo forms, obligation, ability, and plans.",
    sentences: [
      ["Vengo a casa por la tarde.", "I come home in the afternoon.", "Venir becomes vengo."],
      ["Salgo de casa a las ocho.", "I leave home at eight.", "Salir becomes salgo."],
      ["Puedo abrir la puerta.", "I can open the door.", "Poder becomes puedo."],
      ["Voy a traer una bolsa.", "I am going to bring a bag.", "Voy a plus infinitive expresses a plan."]
    ]
  },
  {
    slug: "a2-gustar-basics",
    title: "Gustar Basics",
    summary: "Learn the Spanish pattern for saying what you like and dislike.",
    cefrLevel: "A2",
    theme: "Likes and Preferences",
    situation: "talking about interests",
    imageKey: "preferences-and-hobbies:1",
    topicSlug: "likes-preferences",
    vocabularySlugs: ["a2-preferences-hobbies"],
    order: 620,
    estimatedMinutes: 10,
    outcomes: [
      "You can say that you like one thing.",
      "You can say that you do not like one thing.",
      "You can avoid translating I like word for word."
    ],
    conceptKeys: ["gustar", "indirect-object-me", "likes-dislikes"],
    reviewSummary: "You practiced me gusta and no me gusta for single things.",
    sentences: [
      ["Me gusta la música.", "I like music.", "Spanish says the music is pleasing to me: me gusta la música."],
      ["Me gusta el café.", "I like coffee.", "Use gusta with one singular thing."],
      ["No me gusta la lluvia.", "I do not like rain.", "Put no before me gusta to make it negative."],
      ["¿Te gusta el fútbol?", "Do you like soccer?", "Use te gusta when asking one familiar person what they like."]
    ]
  },
  {
    slug: "a2-gustar-plurals-and-infinitives",
    title: "Gustar with Plurals and Activities",
    summary: "Use gusta with activities and gustan with plural things.",
    cefrLevel: "A2",
    theme: "Likes and Preferences",
    situation: "hobbies and activities",
    imageKey: "preferences-and-hobbies:4",
    topicSlug: "likes-preferences",
    vocabularySlugs: ["a2-preferences-hobbies", "daily-actions"],
    order: 630,
    estimatedMinutes: 10,
    outcomes: [
      "You can choose gusta or gustan by what is liked.",
      "You can say you like doing an activity.",
      "You can use encanta for a stronger like."
    ],
    conceptKeys: ["gustar-plural", "infinitive-after-gustar", "encantar"],
    reviewSummary: "You practiced me gustan for plural things and me gusta plus infinitive for activities.",
    sentences: [
      ["Me gustan las películas.", "I like movies.", "Use gustan because las películas is plural."],
      ["Me gusta leer.", "I like to read.", "Use gusta before an infinitive activity."],
      ["Me encanta cocinar.", "I love cooking.", "Encantar works like gustar but is stronger."],
      ["No me gustan las películas largas.", "I do not like long movies.", "Use no me gustan with plural things you dislike."]
    ]
  },
  {
    slug: "a2-preferir-and-favorites",
    title: "Preferir and Favorites",
    summary: "Say what you prefer and name simple favorites.",
    cefrLevel: "A2",
    theme: "Preferences",
    situation: "choosing between options",
    imageKey: "preferences-and-hobbies:9",
    topicSlug: "likes-preferences",
    vocabularySlugs: ["a2-preferences-hobbies", "food-and-ordering", "numbers-and-colors"],
    order: 640,
    estimatedMinutes: 10,
    outcomes: [
      "You can use prefiero for I prefer.",
      "You can name a favorite color, place, or restaurant.",
      "You can contrast a like with a preference."
    ],
    conceptKeys: ["preferir", "favorites", "contrast-pero"],
    reviewSummary: "You practiced prefiero, favorito, favorita, and simple preference contrasts.",
    sentences: [
      ["Prefiero el té.", "I prefer tea.", "Preferir is stem-changing; the yo form is prefiero."],
      ["Prefiero la playa.", "I prefer the beach.", "Use prefiero when choosing one option over another."],
      ["Mi color favorito es azul.", "My favorite color is blue.", "Favorito agrees with masculine color."],
      ["Me gusta el café, pero prefiero el té.", "I like coffee, but I prefer tea.", "Use pero to contrast a like and a stronger preference."]
    ]
  },
  {
    slug: "a2-preference-dialogues",
    title: "Preference Dialogues",
    summary: "Answer simple questions about hobbies, choices, and favorites.",
    cefrLevel: "A2",
    theme: "Dialogue",
    situation: "small talk",
    imageKey: "conversation-and-opinion:2",
    topicSlug: "likes-preferences",
    vocabularySlugs: ["a2-preferences-hobbies", "useful-phrases"],
    order: 650,
    estimatedMinutes: 11,
    outcomes: [
      "You can answer what you like doing.",
      "You can choose between two options.",
      "You can ask a preference question back."
    ],
    conceptKeys: ["dialogue", "preference-questions", "te-gusta"],
    reviewSummary: "You practiced short preference answers in conversation.",
    sentences: [
      ["¿Qué te gusta hacer?", "What do you like to do?", "Answer with me gusta plus an infinitive."],
      ["Me gusta leer y cocinar.", "I like to read and cook.", "You can connect two activities with y."],
      ["¿Prefieres café o té?", "Do you prefer coffee or tea?", "Use o to offer a choice."],
      ["Prefiero el té. ¿Y tú?", "I prefer tea. And you?", "Add ¿Y tú? to ask the same question back."]
    ]
  },
  {
    slug: "checkpoint-a2-likes-preferences",
    title: "A2.3 Likes and Preferences Checkpoint",
    summary: "Check gustar, encantar, preferir, favorites, and preference dialogue replies.",
    cefrLevel: "A2",
    theme: "Checkpoint",
    situation: "preference review",
    imageKey: "preferences-and-hobbies:10",
    topicSlug: "likes-preferences",
    vocabularySlugs: ["a2-preferences-hobbies", "food-and-ordering"],
    order: 660,
    estimatedMinutes: 13,
    outcomes: [
      "You can produce likes and dislikes from English prompts.",
      "You can choose gusta or gustan correctly.",
      "You can answer a short preference question."
    ],
    conceptKeys: ["checkpoint", "gustar", "preferir", "dialogue"],
    reviewSummary: "You completed the A2.3 checkpoint for likes, dislikes, favorites, and preferences.",
    sentences: [
      ["Me gusta viajar.", "I like to travel.", "Use gusta before an infinitive."],
      ["Me gustan las películas.", "I like movies.", "Use gustan with a plural liked thing."],
      ["Prefiero la playa.", "I prefer the beach.", "Prefiero is the yo form of preferir."],
      ["No me gusta la lluvia.", "I do not like rain.", "Negate gustar with no before me."]
    ]
  },
  {
    slug: "scenario-restaurant-order",
    title: "Restaurant Scenario",
    summary: "Order politely, ask for a recommendation, and handle a simple bill request.",
    cefrLevel: "A2",
    theme: "Scenario",
    situation: "restaurant",
    imageKey: "communication-repair:14",
    topicSlug: "scenario-practice",
    vocabularySlugs: ["a2-scenario-survival", "food-and-ordering", "useful-phrases"],
    order: 670,
    estimatedMinutes: 12,
    outcomes: [
      "You can start a restaurant order politely.",
      "You can ask for a recommendation.",
      "You can ask for the bill."
    ],
    conceptKeys: ["scenario", "restaurant", "polite-request"],
    reviewSummary: "You practiced a controlled restaurant conversation.",
    sentences: [
      ["Quisiera una mesa, por favor.", "I would like a table, please.", "Quisiera is softer and more polite than quiero in service situations."],
      ["¿Qué recomienda?", "What do you recommend?", "Use recomienda with usted in polite service contexts."],
      ["Quisiera dos cafés para llevar.", "I would like two coffees to go.", "Para llevar means to go."],
      ["La cuenta, por favor.", "The bill, please.", "A complete restaurant closing phrase."]
    ]
  },
  {
    slug: "scenario-travel-directions",
    title: "Travel Directions Scenario",
    summary: "Ask where a place is and understand simple direction replies.",
    cefrLevel: "A2",
    theme: "Scenario",
    situation: "directions",
    imageKey: "directions-and-question-intents:7",
    topicSlug: "scenario-practice",
    vocabularySlugs: ["a2-scenario-survival", "travel-and-survival", "city-transport"],
    order: 680,
    estimatedMinutes: 12,
    outcomes: [
      "You can ask where a station or hotel is.",
      "You can understand straight and left/right directions.",
      "You can ask someone to repeat or slow down."
    ],
    conceptKeys: ["scenario", "directions", "conversation-repair"],
    reviewSummary: "You practiced travel direction questions and repair phrases.",
    sentences: [
      ["Perdón, ¿dónde está la estación?", "Excuse me, where is the station?", "Start with perdón to get attention politely."],
      ["Siga derecho.", "Go straight.", "Siga is a polite command form used in directions."],
      ["Gire a la izquierda.", "Turn left.", "Use izquierda for left and derecha for right."],
      ["¿Puede repetir, por favor?", "Can you repeat, please?", "Use puede repetir when you need the direction again."]
    ]
  },
  {
    slug: "scenario-pharmacy-help",
    title: "Pharmacy Scenario",
    summary: "Explain a simple health problem and ask how often to take medicine.",
    cefrLevel: "A2",
    theme: "Scenario",
    situation: "pharmacy",
    imageKey: "pharmacy-and-medicine:3",
    topicSlug: "scenario-practice",
    vocabularySlugs: ["a2-scenario-survival", "body-and-health", "useful-phrases"],
    order: 690,
    estimatedMinutes: 12,
    outcomes: [
      "You can say what hurts.",
      "You can ask for medicine for a common symptom.",
      "You can ask how often to take it."
    ],
    conceptKeys: ["scenario", "pharmacy", "health"],
    reviewSummary: "You practiced a controlled pharmacy conversation for symptoms and medicine.",
    sentences: [
      ["Me duele la cabeza.", "My head hurts.", "Use me duele with one thing that hurts."],
      ["Necesito medicina para el dolor.", "I need medicine for pain.", "Para introduces the purpose here."],
      ["Tengo alergia a la aspirina.", "I have an allergy to aspirin.", "Use a plus the thing you are allergic to."],
      ["¿Cada cuánto tomo la medicina?", "How often do I take the medicine?", "Cada cuánto asks about frequency."]
    ]
  },
  {
    slug: "lab-a2-cafe-reading",
    title: "Cafe Reading Lab",
    summary: "Read a short A2 text, then answer comprehension and summary questions.",
    cefrLevel: "A2",
    theme: "Reading Lab",
    situation: "short cafe text",
    imageKey: "reading-and-listening-lab:1",
    topicSlug: "input-comprehension",
    vocabularySlugs: ["a2-reading-listening-lab", "a2-preferences-hobbies", "food-and-ordering"],
    order: 700,
    estimatedMinutes: 12,
    outcomes: [
      "You can find the main idea of a short text.",
      "You can answer detail questions without seeing an answer list first.",
      "You can write a one-sentence summary from a model."
    ],
    conceptKeys: ["reading", "main-idea", "comprehension"],
    reviewSummary: "You practiced reading a short cafe text and answering comprehension questions.",
    sentences: [
      ["Ana trabaja por la mañana.", "Ana works in the morning.", "First identify who the text is about and when the action happens."],
      ["Después va a un café cerca de la estación.", "Afterward she goes to a cafe near the station.", "Después connects the next event."],
      ["Le gusta el café, pero prefiere el té por la tarde.", "She likes coffee, but she prefers tea in the afternoon.", "The contrast tells you her stronger preference."],
      ["También lee un libro pequeño antes de volver a casa.", "She also reads a small book before returning home.", "También adds another detail to the routine."]
    ]
  },
  {
    slug: "lab-a2-weekend-listening",
    title: "Weekend Listening Lab",
    summary: "Listen to a short weekend plan, reveal the transcript, then answer comprehension checks.",
    cefrLevel: "A2",
    theme: "Listening Lab",
    situation: "weekend plan audio",
    imageKey: "reading-and-listening-lab:2",
    topicSlug: "input-comprehension",
    vocabularySlugs: ["a2-reading-listening-lab", "a2-irregular-verbs", "places-around-town"],
    order: 710,
    estimatedMinutes: 12,
    outcomes: [
      "You can catch the main plan in short audio.",
      "You can use transcript reveal to check what you missed.",
      "You can answer dictation and detail questions."
    ],
    conceptKeys: ["listening", "transcript", "comprehension"],
    reviewSummary: "You practiced listening for a weekend plan and checking details with the transcript.",
    sentences: [
      ["Mañana voy a la tienda.", "Tomorrow I am going to the store.", "Voy a plus infinitive expresses a near-future plan."],
      ["Tengo que comprar pan y una bolsa.", "I have to buy bread and a bag.", "Tengo que introduces an obligation."],
      ["Después quiero escuchar música en casa.", "Afterward I want to listen to music at home.", "Después marks the next step."],
      ["Por la noche voy a leer un libro.", "At night I am going to read a book.", "Por la noche sets the time."]
    ]
  },
  {
    slug: "checkpoint-a2-scenarios-input",
    title: "A2.4 Scenarios and Input Checkpoint",
    summary: "Check restaurant, travel, pharmacy, reading, and listening comprehension skills.",
    cefrLevel: "A2",
    theme: "Checkpoint",
    situation: "scenario and input review",
    imageKey: "conversation-and-opinion:1",
    topicSlug: "scenario-practice",
    vocabularySlugs: ["a2-scenario-survival", "a2-reading-listening-lab", "food-and-ordering", "body-and-health"],
    order: 720,
    estimatedMinutes: 15,
    outcomes: [
      "You can complete short scenario replies.",
      "You can answer simple reading details.",
      "You can type a short heard sentence."
    ],
    conceptKeys: ["checkpoint", "scenario", "reading", "listening"],
    reviewSummary: "You completed the A2.4 checkpoint for controlled scenarios and input comprehension.",
    sentences: [
      ["Quisiera dos cafés para llevar.", "I would like two coffees to go.", "Restaurant request."],
      ["Perdón, ¿dónde está la estación?", "Excuse me, where is the station?", "Travel direction question."],
      ["Necesito medicina para el dolor.", "I need medicine for pain.", "Pharmacy request."],
      ["Mañana voy a la tienda.", "Tomorrow I am going to the store.", "Listening detail."]
    ]
  }
];

const exercises = [
  {
    slug: "intro-hola-means-hello",
    lessonSlug: "intro-greetings-pronouns-ser",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Greeting.",
    instruction: "Choose the meaning.",
    questionText: "hola",
    answerJson: { correct: "hello", accepted: ["hello", "hi"], goal: "vocabulary_recognition" },
    explanation: "Hola means hello. It is the easiest way to start a greeting.",
    difficulty: 1,
    order: 1,
    xpReward: 8,
    imageKey: "identity-and-introductions:13",
    options: [
      ["hello", "hello", true],
      ["thank you", "thank you", false],
      ["goodbye", "goodbye", false]
    ]
  },
  {
    slug: "intro-yo-soy-name",
    lessonSlug: "intro-greetings-pronouns-ser",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "Identity with SER.",
    instruction: "Use soy for I am plus a name.",
    questionText: "Yo ____ Ana.",
    answerJson: {
      correct: "soy",
      accepted: ["soy"],
      goal: "ser_identity",
      errorHints: {
        ser_estar: "Use soy here because a name is identity. Correct: Yo soy Ana."
      }
    },
    explanation: "Use soy for identity: Yo soy Ana.",
    difficulty: 1,
    order: 2,
    xpReward: 10,
    imageKey: "identity-and-introductions:1",
    options: [
      ["soy", "soy", true],
      ["estoy", "estoy", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "intro-me-llamo-ana",
    lessonSlug: "intro-greetings-pronouns-ser",
    topicSlug: "absolute-basics",
    type: ExerciseType.TRANSLATION,
    prompt: "Introduce your name.",
    instruction: "Type the Spanish phrase.",
    questionText: "My name is Ana.",
    answerJson: {
      correct: "Me llamo Ana.",
      accepted: ["me llamo ana", "me llamo ana."],
      alternatives: [{ answer: "Soy Ana.", note: "Soy Ana is also a natural short introduction." }],
      goal: "active_production"
    },
    explanation: "Me llamo Ana is the natural Spanish phrase for My name is Ana.",
    difficulty: 2,
    order: 3,
    xpReward: 14,
    imageKey: "identity-and-introductions:2",
    options: []
  },
  {
    slug: "intro-build-hola-soy-ana",
    lessonSlug: "intro-greetings-pronouns-ser",
    topicSlug: "absolute-basics",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build an introduction.",
    instruction: "Put the words in order.",
    questionText: "Hello, I am Ana.",
    answerJson: {
      correctWords: ["Hola", ",", "soy", "Ana", "."],
      goal: "word_order"
    },
    explanation: "A simple introduction can be Hola, soy Ana.",
    difficulty: 1,
    order: 4,
    xpReward: 14,
    imageKey: "identity-and-introductions:1",
    options: [
      ["Hola", "Hola", false],
      [",", ",", false],
      ["soy", "soy", false],
      ["Ana", "Ana", false],
      [".", ".", false]
    ]
  },
  {
    slug: "intro-soy-de-austria",
    lessonSlug: "intro-greetings-pronouns-ser",
    topicSlug: "absolute-basics",
    type: ExerciseType.TRANSLATION,
    prompt: "Say origin.",
    instruction: "Type the Spanish sentence.",
    questionText: "I am from Austria.",
    answerJson: {
      correct: "Soy de Austria.",
      accepted: ["soy de austria", "soy de austria."],
      goal: "ser_origin",
      errorHints: {
        ser_estar: "Use soy for origin. Correct: Soy de Austria. Estoy de Austria is not used."
      }
    },
    explanation: "Use soy de for origin: Soy de Austria.",
    difficulty: 2,
    order: 5,
    xpReward: 16,
    imageKey: "identity-and-introductions:12",
    options: []
  },
  {
    slug: "intro-correct-estoy-de-austria",
    lessonSlug: "intro-greetings-pronouns-ser",
    topicSlug: "absolute-basics",
    type: ExerciseType.ERROR_CORRECTION,
    prompt: "Fix the mistake.",
    instruction: "Rewrite the sentence correctly.",
    questionText: "Estoy de Austria.",
    answerJson: {
      correct: "Soy de Austria.",
      accepted: ["soy de austria", "soy de austria."],
      goal: "mistake_correction",
      errorHints: {
        ser_estar: "Origin uses ser, not estar. Correct: Soy de Austria."
      }
    },
    explanation: "Use ser for origin. Soy de Austria is correct.",
    difficulty: 2,
    order: 6,
    xpReward: 16,
    imageKey: "identity-and-introductions:12",
    options: []
  },
  {
    slug: "intro-scenario-cafe-greeting",
    lessonSlug: "intro-greetings-pronouns-ser",
    topicSlug: "absolute-basics",
    type: ExerciseType.TRANSLATION,
    prompt: "Scenario response.",
    instruction: "You meet someone. Say hello and give your name.",
    questionText: "Say: Hello, my name is Ana.",
    answerJson: {
      correct: "Hola, me llamo Ana.",
      accepted: ["hola me llamo ana", "hola, me llamo ana", "hola me llamo ana.", "hola, me llamo ana."],
      alternatives: [{ answer: "Hola, soy Ana.", note: "Hola, soy Ana is also a valid short introduction." }],
      goal: "scenario_response"
    },
    explanation: "Hola, me llamo Ana is a complete practical introduction.",
    difficulty: 2,
    order: 7,
    xpReward: 18,
    imageKey: "identity-and-introductions:2",
    options: []
  },
  {
    slug: "zero-yo-means-i",
    lessonSlug: "zero-pronouns",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Tiny word meaning.",
    instruction: "Choose the meaning.",
    questionText: "yo",
    answerJson: { correct: "I", accepted: ["I", "i"], goal: "pronoun_recognition" },
    explanation: "Yo means I. It points to the person speaking.",
    difficulty: 1,
    order: 1,
    xpReward: 8,
    imageKey: "identity-and-introductions:5",
    options: [
      ["I", "I", true],
      ["you", "you", false],
      ["she", "she", false]
    ]
  },
  {
    slug: "zero-tu-means-you",
    lessonSlug: "zero-pronouns",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Tiny word meaning.",
    instruction: "Choose the meaning.",
    questionText: "tú",
    answerJson: { correct: "you", accepted: ["you"], goal: "pronoun_recognition" },
    explanation: "Tú means you, when speaking to one person informally.",
    difficulty: 1,
    order: 2,
    xpReward: 8,
    imageKey: "identity-and-introductions:6",
    options: [
      ["you", "you", true],
      ["I", "I", false],
      ["he", "he", false]
    ]
  },
  {
    slug: "zero-el-means-he",
    lessonSlug: "zero-pronouns",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Tiny word meaning.",
    instruction: "Choose the meaning.",
    questionText: "él",
    answerJson: { correct: "he", accepted: ["he"], goal: "pronoun_recognition" },
    explanation: "Él means he. The accent separates the pronoun from el, an article you learn later.",
    difficulty: 1,
    order: 3,
    xpReward: 8,
    imageKey: "people-and-family:1",
    options: [
      ["he", "he", true],
      ["she", "she", false],
      ["you", "you", false]
    ]
  },
  {
    slug: "zero-ella-means-she",
    lessonSlug: "zero-pronouns",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Tiny word meaning.",
    instruction: "Choose the meaning.",
    questionText: "ella",
    answerJson: { correct: "she", accepted: ["she"], goal: "pronoun_recognition" },
    explanation: "Ella means she.",
    difficulty: 1,
    order: 4,
    xpReward: 8,
    imageKey: "identity-and-introductions:1",
    options: [
      ["she", "she", true],
      ["he", "he", false],
      ["I", "I", false]
    ]
  },
  {
    slug: "zero-speaker-pronoun",
    lessonSlug: "zero-pronouns",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Who is speaking?",
    instruction: "Choose the Spanish pronoun for the speaker.",
    questionText: "The person says: I",
    answerJson: { correct: "yo", accepted: ["yo"], goal: "pronoun_selection" },
    explanation: "Use yo when the speaker means I.",
    difficulty: 1,
    order: 5,
    xpReward: 10,
    imageKey: "identity-and-introductions:5",
    options: [
      ["yo", "yo", true],
      ["tú", "tú", false],
      ["ella", "ella", false]
    ]
  },
  {
    slug: "zero-listener-pronoun",
    lessonSlug: "zero-pronouns",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Who are you talking to?",
    instruction: "Choose the pronoun for one familiar listener.",
    questionText: "You are talking to one familiar person.",
    answerJson: { correct: "tú", accepted: ["tu", "tú"], goal: "pronoun_selection" },
    explanation: "Use tú when you are speaking to one familiar person.",
    difficulty: 1,
    order: 6,
    xpReward: 10,
    imageKey: "identity-and-introductions:6",
    options: [
      ["tú", "tú", true],
      ["yo", "yo", false],
      ["él", "él", false]
    ]
  },
  {
    slug: "zero-accented-el-pronoun",
    lessonSlug: "zero-pronouns",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Accent awareness.",
    instruction: "Choose the pronoun that means he.",
    questionText: "he",
    answerJson: { correct: "él", accepted: ["el", "él"], goal: "accent_awareness" },
    explanation: "The pronoun he is él with an accent.",
    difficulty: 1,
    order: 7,
    xpReward: 10,
    imageKey: "people-and-family:1",
    options: [
      ["él", "él", true],
      ["ella", "ella", false],
      ["yo", "yo", false]
    ]
  },
  {
    slug: "zero-soy-means-i-am",
    lessonSlug: "zero-soy",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Soy in context.",
    instruction: "Choose the meaning of the full sentence.",
    questionText: "Soy Ana.",
    answerJson: { correct: "I am Ana.", accepted: ["I am Ana.", "i am ana"] },
    explanation: "Soy Ana means I am Ana. Soy identifies the speaker.",
    difficulty: 1,
    order: 1,
    xpReward: 10,
    imageKey: "identity-and-introductions:4",
    options: [
      ["I am Ana.", "I am Ana.", true],
      ["I am at home.", "I am at home.", false],
      ["She is Ana.", "She is Ana.", false]
    ]
  },
  {
    slug: "zero-soy-identity",
    lessonSlug: "zero-soy",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "First identity sentence.",
    instruction: "Use soy for I am as identity.",
    questionText: "Yo ____ estudiante.",
    answerJson: { correct: "soy", accepted: ["soy"] },
    explanation: "Yo soy estudiante means I am a student. Soy is for identity here.",
    difficulty: 1,
    order: 2,
    xpReward: 10,
    imageKey: "identity-and-introductions:8",
    options: [
      ["soy", "soy", true],
      ["estoy", "estoy", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "zero-soy-origin",
    lessonSlug: "zero-soy",
    topicSlug: "absolute-basics",
    type: ExerciseType.TRANSLATION,
    prompt: "Origin with soy.",
    instruction: "Type the Spanish sentence.",
    questionText: "I am from Austria.",
    answerJson: { correct: "Soy de Austria.", accepted: ["soy de austria", "soy de austria."] },
    explanation: "Use soy de for origin: Soy de Austria.",
    difficulty: 2,
    order: 3,
    xpReward: 14,
    imageKey: "identity-and-introductions:12",
    options: []
  },
  {
    slug: "zero-estoy-means-i-am",
    lessonSlug: "zero-estoy",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Estoy in context.",
    instruction: "Choose the meaning of the full sentence.",
    questionText: "Estoy feliz.",
    answerJson: { correct: "I am happy.", accepted: ["I am happy.", "i am happy"] },
    explanation: "Estoy feliz means I am happy. Estoy describes a current feeling.",
    difficulty: 1,
    order: 1,
    xpReward: 10,
    imageKey: "grammar-scenes:5",
    options: [
      ["I am happy.", "I am happy.", true],
      ["I am a student.", "I am a student.", false],
      ["She is happy.", "She is happy.", false]
    ]
  },
  {
    slug: "zero-estoy-location",
    lessonSlug: "zero-estoy",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "First location sentence.",
    instruction: "Use estoy for where I am.",
    questionText: "Yo ____ en casa.",
    answerJson: { correct: "estoy", accepted: ["estoy"] },
    explanation: "Yo estoy en casa means I am at home. Use estoy for your location.",
    difficulty: 1,
    order: 2,
    xpReward: 10,
    imageKey: "identity-and-introductions:7",
    options: [
      ["estoy", "estoy", true],
      ["soy", "soy", false],
      ["son", "son", false]
    ]
  },
  {
    slug: "zero-estoy-state",
    lessonSlug: "zero-estoy",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "Current condition.",
    instruction: "Use estoy for a temporary condition.",
    questionText: "Yo ____ cansado hoy.",
    answerJson: { correct: "estoy", accepted: ["estoy"] },
    explanation: "Yo estoy cansado hoy uses estoy for how the speaker feels right now.",
    difficulty: 1,
    order: 3,
    xpReward: 12,
    imageKey: "emotions-and-states:3",
    options: [
      ["estoy", "estoy", true],
      ["soy", "soy", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "zero-estoy-cafe-builder",
    lessonSlug: "zero-estoy",
    topicSlug: "absolute-basics",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build a location sentence.",
    instruction: "Put the words in order.",
    questionText: "I am at the café.",
    answerJson: { correctWords: ["Estoy", "en", "el", "café", "."] },
    explanation: "Use estoy en to say where you are: Estoy en el café.",
    difficulty: 1,
    order: 4,
    xpReward: 14,
    imageKey: "places-around-town:1",
    options: [
      ["Estoy", "Estoy", false],
      ["en", "en", false],
      ["el", "el", false],
      ["café", "café", false],
      [".", ".", false]
    ]
  },
  {
    slug: "zero-es-means-is",
    lessonSlug: "zero-es-esta",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Identity or role.",
    instruction: "Complete the sentence with the identity form.",
    questionText: "Ella ____ profesora.",
    answerJson: { correct: "es", accepted: ["es"] },
    explanation: "Ella es profesora uses es because a profession is identity.",
    difficulty: 1,
    order: 1,
    xpReward: 10,
    imageKey: "people-and-family:4",
    options: [
      ["es", "es", true],
      ["está", "está", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "zero-esta-location",
    lessonSlug: "zero-es-esta",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "State or location.",
    instruction: "Use está for she is located.",
    questionText: "Ella ____ en casa.",
    answerJson: { correct: "está", accepted: ["esta", "está"] },
    explanation: "Ella está en casa uses está because it tells location.",
    difficulty: 1,
    order: 2,
    xpReward: 10,
    imageKey: "identity-and-introductions:7",
    options: [
      ["está", "está", true],
      ["es", "es", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "zero-es-trait",
    lessonSlug: "zero-es-esta",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "Normal trait.",
    instruction: "Use es for what the book is like.",
    questionText: "El libro ____ nuevo.",
    answerJson: { correct: "es", accepted: ["es"] },
    explanation: "El libro es nuevo uses es for a normal trait.",
    difficulty: 1,
    order: 3,
    xpReward: 12,
    imageKey: "classroom-basics:3",
    options: [
      ["es", "es", true],
      ["está", "está", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "zero-esta-state",
    lessonSlug: "zero-es-esta",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "Current feeling.",
    instruction: "Use está for how Ana feels today.",
    questionText: "Ana ____ feliz hoy.",
    answerJson: { correct: "está", accepted: ["esta", "está"] },
    explanation: "Ana está feliz hoy uses está because happiness is her current state.",
    difficulty: 1,
    order: 4,
    xpReward: 12,
    imageKey: "emotions-and-states:1",
    options: [
      ["está", "está", true],
      ["es", "es", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "zero-es-esta-correction",
    lessonSlug: "zero-es-esta",
    topicSlug: "absolute-basics",
    type: ExerciseType.ERROR_CORRECTION,
    prompt: "Fix the state verb.",
    instruction: "Rewrite the sentence correctly.",
    questionText: "Ana es cansada hoy.",
    answerJson: { correct: "Ana está cansada hoy.", accepted: ["ana esta cansada hoy", "ana esta cansada hoy."] },
    explanation: "Use está for Ana's current condition: Ana está cansada hoy.",
    difficulty: 2,
    order: 5,
    xpReward: 16,
    imageKey: "identity-and-introductions:9",
    options: []
  },
  {
    slug: "zero-es-esta-contrast-builder",
    lessonSlug: "zero-es-esta",
    topicSlug: "absolute-basics",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the contrast.",
    instruction: "Put the words in order.",
    questionText: "Ana is a teacher, but she is tired today.",
    answerJson: { correctWords: ["Ana", "es", "profesora", ",", "pero", "está", "cansada", "hoy", "."] },
    explanation: "Use es for Ana's profession and está for how she feels now.",
    difficulty: 2,
    order: 6,
    xpReward: 18,
    imageKey: "identity-and-introductions:9",
    options: [
      ["Ana", "Ana", false],
      ["es", "es", false],
      ["profesora", "profesora", false],
      [",", ",", false],
      ["pero", "pero", false],
      ["está", "está", false],
      ["cansada", "cansada", false],
      ["hoy", "hoy", false],
      [".", ".", false]
    ]
  },
  {
    slug: "ser-estar-identity-soy",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Choose the correct form.",
    instruction: "Complete the sentence with ser or estar.",
    questionText: "Yo ____ estudiante.",
    answerJson: { correct: "soy", accepted: ["soy"] },
    explanation: "Use ser for identity and profession: Yo soy estudiante.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "identity-and-introductions:8",
    options: [
      ["soy", "soy", true],
      ["estoy", "estoy", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "ser-estar-identity-es",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Another person's identity.",
    instruction: "Use ser for Ana's profession.",
    questionText: "Ana ____ profesora.",
    answerJson: { correct: "es", accepted: ["es"] },
    explanation: "Ana es profesora uses es because a profession is identity.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "people-and-family:4",
    options: [
      ["es", "es", true],
      ["está", "está", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "ser-estar-identity-son",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.CLOZE,
    prompt: "Plural identity.",
    instruction: "Use son for a plural role or identity.",
    questionText: "Ellos ____ estudiantes.",
    answerJson: { correct: "son", accepted: ["son"] },
    explanation: "Ellos son estudiantes uses son because the group is being identified.",
    difficulty: 1,
    order: 3,
    xpReward: 12,
    imageKey: "classroom-basics:1",
    options: [
      ["son", "son", true],
      ["están", "están", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "ser-estar-trait-es",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Normal trait.",
    instruction: "Use ser for what the book is like.",
    questionText: "El libro ____ nuevo.",
    answerJson: { correct: "es", accepted: ["es"] },
    explanation: "El libro es nuevo uses es for a normal trait.",
    difficulty: 1,
    order: 4,
    xpReward: 12,
    imageKey: "classroom-basics:3",
    options: [
      ["es", "es", true],
      ["está", "está", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "ser-estar-location-estoy",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.CLOZE,
    prompt: "My location.",
    instruction: "Use estar for where I am.",
    questionText: "Yo ____ en la biblioteca.",
    answerJson: { correct: "estoy", accepted: ["estoy"] },
    explanation: "Yo estoy en la biblioteca uses estoy for your location.",
    difficulty: 1,
    order: 5,
    xpReward: 12,
    imageKey: "classroom-basics:10",
    options: [
      ["estoy", "estoy", true],
      ["soy", "soy", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "ser-estar-location-estan",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.CLOZE,
    prompt: "Choose the location form.",
    instruction: "Use estar for location.",
    questionText: "Ellos ____ en la biblioteca.",
    answerJson: { correct: "están", accepted: ["estan", "están"] },
    explanation: "Use estar for location. Ellos están en la biblioteca.",
    difficulty: 1,
    order: 6,
    xpReward: 12,
    imageKey: "classroom-basics:10",
    options: [
      ["están", "están", true],
      ["son", "son", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "ser-estar-state-cansada",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Temporary state or identity?",
    instruction: "Choose the best verb.",
    questionText: "Ella ____ cansada.",
    answerJson: { correct: "está", accepted: ["esta", "está"] },
    explanation: "Use estar for a temporary state: Ella está cansada.",
    difficulty: 2,
    order: 7,
    xpReward: 14,
    imageKey: "identity-and-introductions:9",
    options: [
      ["está", "está", true],
      ["es", "es", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "ser-estar-state-correction",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.ERROR_CORRECTION,
    prompt: "Fix the temporary state.",
    instruction: "Rewrite the sentence with the correct form of to be.",
    questionText: "Ana es cansada hoy.",
    answerJson: { correct: "Ana está cansada hoy.", accepted: ["ana esta cansada hoy", "ana esta cansada hoy."] },
    explanation: "Ana's profession can use es, but her temporary tiredness uses está.",
    difficulty: 2,
    order: 8,
    xpReward: 16,
    imageKey: "identity-and-introductions:9",
    options: []
  },
  {
    slug: "sentence-builder-soy-estudiante",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the contrast.",
    instruction: "Put the words in order.",
    questionText: "Ana is a teacher, but she is tired today.",
    answerJson: { correctWords: ["Ana", "es", "profesora", ",", "pero", "está", "cansada", "hoy", "."] },
    explanation: "Use es for Ana's profession and está for how she feels right now.",
    difficulty: 2,
    order: 9,
    xpReward: 18,
    imageKey: "identity-and-introductions:9",
    options: [
      ["Ana", "Ana", false],
      ["es", "es", false],
      ["profesora", "profesora", false],
      [",", ",", false],
      ["pero", "pero", false],
      ["está", "está", false],
      ["cansada", "cansada", false],
      ["hoy", "hoy", false],
      [".", ".", false]
    ]
  },
  {
    slug: "article-libro-el",
    lessonSlug: "articles-and-nouns",
    topicSlug: "articles-gender",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "Choose the article.",
    instruction: "Pick the correct definite article.",
    questionText: "____ libro",
    answerJson: { correct: "el", accepted: ["el"] },
    explanation: "Libro is masculine singular, so it uses el.",
    difficulty: 1,
    order: 1,
    xpReward: 10,
    imageKey: "classroom-basics:3",
    options: [
      ["el", "el", true],
      ["la", "la", false],
      ["los", "los", false]
    ]
  },
  {
    slug: "article-tienda-la",
    lessonSlug: "articles-and-nouns",
    topicSlug: "articles-gender",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "Choose the article.",
    instruction: "Pick the correct definite article.",
    questionText: "____ tienda",
    answerJson: { correct: "la", accepted: ["la"] },
    explanation: "Tienda is feminine singular, so it uses la.",
    difficulty: 1,
    order: 2,
    xpReward: 10,
    imageKey: "places-around-town:2",
    options: [
      ["la", "la", true],
      ["el", "el", false],
      ["las", "las", false]
    ]
  },
  {
    slug: "article-estudiantes-los",
    lessonSlug: "articles-and-nouns",
    topicSlug: "articles-gender",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "Choose the article.",
    instruction: "Pick the correct plural article.",
    questionText: "____ estudiantes",
    answerJson: { correct: "los", accepted: ["los"] },
    explanation: "Estudiantes can be masculine or mixed plural, so the article is los.",
    difficulty: 2,
    order: 3,
    xpReward: 12,
    imageKey: "classroom-basics:1",
    options: [
      ["los", "los", true],
      ["el", "el", false],
      ["las", "las", false]
    ]
  },
  {
    slug: "conjugation-hablar-yo",
    lessonSlug: "present-ar-verbs",
    topicSlug: "present-tense-ar",
    type: ExerciseType.CONJUGATION,
    prompt: "Conjugate hablar.",
    instruction: "Write the present tense form.",
    questionText: "Yo ____ español. (hablar)",
    answerJson: { correct: "hablo", accepted: ["hablo"] },
    explanation: "For yo, regular -ar verbs use -o: hablar -> hablo.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "daily-actions:1",
    options: [
      ["hablo", "hablo", true],
      ["hablas", "hablas", false],
      ["habla", "habla", false]
    ]
  },
  {
    slug: "conjugation-estudiar-tu",
    lessonSlug: "present-ar-verbs",
    topicSlug: "present-tense-ar",
    type: ExerciseType.CONJUGATION,
    prompt: "Conjugate estudiar.",
    instruction: "Choose the present tense form.",
    questionText: "Tú ____ mucho. (estudiar)",
    answerJson: { correct: "estudias", accepted: ["estudias"] },
    explanation: "For tú, regular -ar verbs use -as: estudiar -> estudias.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "daily-actions:2",
    options: [
      ["estudias", "estudias", true],
      ["estudia", "estudia", false],
      ["estudio", "estudio", false]
    ]
  },
  {
    slug: "error-correction-trabajan",
    lessonSlug: "present-ar-verbs",
    topicSlug: "present-tense-ar",
    type: ExerciseType.ERROR_CORRECTION,
    prompt: "Fix the sentence.",
    instruction: "Type the corrected Spanish sentence.",
    questionText: "Ellos trabaja hoy.",
    answerJson: { correct: "Ellos trabajan hoy.", accepted: ["ellos trabajan hoy", "ellos trabajan hoy."] },
    explanation: "Ellos needs the -an ending: Ellos trabajan hoy.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "daily-actions:3",
    options: []
  },
  {
    slug: "estar-feeling-estoy-feliz",
    lessonSlug: "feelings-with-estar",
    topicSlug: "estar-emotions",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Choose the feeling form.",
    instruction: "Use estar for a temporary feeling.",
    questionText: "Yo ____ feliz hoy.",
    answerJson: { correct: "estoy", accepted: ["estoy"] },
    explanation: "Use estoy for how you feel right now: Yo estoy feliz hoy.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "emotions-and-states:1",
    options: [
      ["estoy", "estoy", true],
      ["soy", "soy", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "estar-feeling-ella-cansada",
    lessonSlug: "feelings-with-estar",
    topicSlug: "estar-emotions",
    type: ExerciseType.CLOZE,
    prompt: "Match verb and adjective.",
    instruction: "Choose the form that fits ella.",
    questionText: "Ella ____ cansada.",
    answerJson: { correct: "está", accepted: ["esta", "está"] },
    explanation: "Ella uses está, and cansada agrees with ella.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "emotions-and-states:3",
    options: [
      ["está", "está", true],
      ["estoy", "estoy", false],
      ["son", "son", false]
    ]
  },
  {
    slug: "estar-feeling-nosotros-nerviosos",
    lessonSlug: "feelings-with-estar",
    topicSlug: "estar-emotions",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Choose the plural form.",
    instruction: "Match nosotros with estar.",
    questionText: "Nosotros ____ nerviosos.",
    answerJson: { correct: "estamos", accepted: ["estamos"] },
    explanation: "Nosotros uses estamos: Nosotros estamos nerviosos.",
    difficulty: 2,
    order: 3,
    xpReward: 14,
    imageKey: "emotions-and-states:4",
    options: [
      ["estamos", "estamos", true],
      ["están", "están", false],
      ["somos", "somos", false]
    ]
  },
  {
    slug: "food-un-cafe",
    lessonSlug: "food-ordering-basics",
    topicSlug: "ordering-food",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Order politely.",
    instruction: "Choose the article for café.",
    questionText: "Quiero ____ café, por favor.",
    answerJson: { correct: "un", accepted: ["un"] },
    explanation: "Café is masculine singular, so use un: Quiero un café.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "food-and-ordering:2",
    options: [
      ["un", "un", true],
      ["una", "una", false],
      ["unas", "unas", false]
    ]
  },
  {
    slug: "food-la-sopa",
    lessonSlug: "food-ordering-basics",
    topicSlug: "ordering-food",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "Choose the article.",
    instruction: "Pick the article that matches sopa.",
    questionText: "____ sopa está caliente.",
    answerJson: { correct: "la", accepted: ["la"] },
    explanation: "Sopa is feminine singular, so it uses la.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "food-and-ordering:5",
    options: [
      ["la", "la", true],
      ["el", "el", false],
      ["los", "los", false]
    ]
  },
  {
    slug: "food-sentence-cuenta",
    lessonSlug: "food-ordering-basics",
    topicSlug: "ordering-food",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the phrase.",
    instruction: "Put the words in order.",
    questionText: "The bill, please.",
    answerJson: { correctWords: ["La", "cuenta", "por", "favor", "."] },
    explanation: "A natural restaurant phrase is: La cuenta, por favor.",
    difficulty: 1,
    order: 3,
    xpReward: 16,
    imageKey: "food-and-ordering:18",
    options: [
      ["La", "La", false],
      ["cuenta", "cuenta", false],
      ["por", "por", false],
      ["favor", "favor", false],
      [".", ".", false]
    ]
  },
  {
    slug: "travel-donde-hotel",
    lessonSlug: "travel-survival-questions",
    topicSlug: "travel-questions",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Ask for a location.",
    instruction: "Choose the question word.",
    questionText: "¿____ está el hotel?",
    answerJson: { correct: "Dónde", accepted: ["donde", "dónde", "Donde", "Dónde"] },
    explanation: "Use dónde to ask where something is: ¿Dónde está el hotel?",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "city-transport:13",
    options: [
      ["Dónde", "Dónde", true],
      ["Cuándo", "Cuándo", false],
      ["Quién", "Quién", false]
    ]
  },
  {
    slug: "travel-estacion-cerca",
    lessonSlug: "travel-survival-questions",
    topicSlug: "travel-questions",
    type: ExerciseType.CLOZE,
    prompt: "Use location with estar.",
    instruction: "Choose the correct verb.",
    questionText: "La estación ____ cerca.",
    answerJson: { correct: "está", accepted: ["esta", "está"] },
    explanation: "Use estar for location: La estación está cerca.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "city-transport:7",
    options: [
      ["está", "está", true],
      ["es", "es", false],
      ["son", "son", false]
    ]
  },
  {
    slug: "travel-necesito-taxi",
    lessonSlug: "travel-survival-questions",
    topicSlug: "travel-questions",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the travel sentence.",
    instruction: "Put the words in order.",
    questionText: "I need a taxi.",
    answerJson: { correctWords: ["Necesito", "un", "taxi", "."] },
    explanation: "Necesito is a practical travel verb: Necesito un taxi.",
    difficulty: 1,
    order: 3,
    xpReward: 16,
    imageKey: "city-transport:3",
    options: [
      ["Necesito", "Necesito", false],
      ["un", "un", false],
      ["taxi", "taxi", false],
      [".", ".", false]
    ]
  },
  {
    slug: "location-libro-mesa",
    lessonSlug: "location-around-you",
    topicSlug: "location-prepositions",
    type: ExerciseType.CLOZE,
    prompt: "Put the object in place.",
    instruction: "Use estar for object location.",
    questionText: "El libro ____ en la mesa.",
    answerJson: { correct: "está", accepted: ["esta", "está"] },
    explanation: "Use estar for location: El libro está en la mesa.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "grammar-scenes:13",
    options: [
      ["está", "está", true],
      ["es", "es", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "location-llaves-cocina",
    lessonSlug: "location-around-you",
    topicSlug: "location-prepositions",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Choose the plural location verb.",
    instruction: "Las llaves is plural.",
    questionText: "Las llaves ____ en la cocina.",
    answerJson: { correct: "están", accepted: ["estan", "están"] },
    explanation: "Las llaves is plural, so use están.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "home-objects:8",
    options: [
      ["están", "están", true],
      ["está", "está", false],
      ["son", "son", false]
    ]
  },
  {
    slug: "location-build-mochila",
    lessonSlug: "location-around-you",
    topicSlug: "location-prepositions",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the location sentence.",
    instruction: "Put the words in order.",
    questionText: "The backpack is on the chair.",
    answerJson: { correctWords: ["La", "mochila", "está", "en", "la", "silla", "."] },
    explanation: "Use estar for location: La mochila está en la silla.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "classroom-basics:8",
    options: [
      ["La", "La", false],
      ["mochila", "mochila", false],
      ["está", "está", false],
      ["en", "en", false],
      ["la", "la", false],
      ["silla", "silla", false],
      [".", ".", false]
    ]
  },
  {
    slug: "plural-los-estudiantes",
    lessonSlug: "plural-agreement-basics",
    topicSlug: "plural-agreement",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "Choose the plural article.",
    instruction: "Match the plural noun.",
    questionText: "____ estudiantes están en clase.",
    answerJson: { correct: "Los", accepted: ["los", "Los"] },
    explanation: "Use los for masculine or mixed plural nouns.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "classroom-basics:1",
    options: [
      ["Los", "Los", true],
      ["El", "El", false],
      ["La", "La", false]
    ]
  },
  {
    slug: "plural-las-sillas",
    lessonSlug: "plural-agreement-basics",
    topicSlug: "plural-agreement",
    type: ExerciseType.CLOZE,
    prompt: "Make it agree.",
    instruction: "Choose the adjective form.",
    questionText: "Las sillas son ____.",
    answerJson: { correct: "nuevas", accepted: ["nuevas"] },
    explanation: "Las sillas is feminine plural, so the adjective is nuevas.",
    difficulty: 2,
    order: 2,
    xpReward: 14,
    imageKey: "classroom-basics:6",
    options: [
      ["nuevas", "nuevas", true],
      ["nuevo", "nuevo", false],
      ["nueva", "nueva", false]
    ]
  },
  {
    slug: "plural-manzanas-rojas",
    lessonSlug: "plural-agreement-basics",
    topicSlug: "plural-agreement",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the plural sentence.",
    instruction: "Put the words in order.",
    questionText: "The apples are red.",
    answerJson: { correctWords: ["Las", "manzanas", "son", "rojas", "."] },
    explanation: "Las, manzanas, and rojas all agree in feminine plural.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "fruit-and-produce:1",
    options: [
      ["Las", "Las", false],
      ["manzanas", "manzanas", false],
      ["son", "son", false],
      ["rojas", "rojas", false],
      [".", ".", false]
    ]
  },
  {
    slug: "questions-que-quieres",
    lessonSlug: "question-words-basics",
    topicSlug: "question-words",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Choose the question word.",
    instruction: "Ask what someone wants.",
    questionText: "¿____ quieres?",
    answerJson: { correct: "Qué", accepted: ["que", "qué", "Que", "Qué"] },
    explanation: "Use qué to ask what: ¿Qué quieres?",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "grammar-scenes:11",
    options: [
      ["Qué", "Qué", true],
      ["Dónde", "Dónde", false],
      ["Quién", "Quién", false]
    ]
  },
  {
    slug: "questions-cuanto-cuesta",
    lessonSlug: "question-words-basics",
    topicSlug: "question-words",
    type: ExerciseType.CLOZE,
    prompt: "Ask the price.",
    instruction: "Choose the price question word.",
    questionText: "¿____ cuesta?",
    answerJson: { correct: "Cuánto", accepted: ["cuanto", "cuánto", "Cuanto", "Cuánto"] },
    explanation: "Use cuánto to ask how much something costs.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "travel-and-survival:19",
    options: [
      ["Cuánto", "Cuánto", true],
      ["Cuándo", "Cuándo", false],
      ["Quién", "Quién", false]
    ]
  },
  {
    slug: "questions-donde-estacion",
    lessonSlug: "question-words-basics",
    topicSlug: "question-words",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the question.",
    instruction: "Put the words in order.",
    questionText: "Where is the station?",
    answerJson: { correctWords: ["Dónde", "está", "la", "estación", "?"] },
    explanation: "Use dónde with estar for location questions.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "city-transport:7",
    options: [
      ["Dónde", "Dónde", false],
      ["está", "está", false],
      ["la", "la", false],
      ["estación", "estación", false],
      ["?", "?", false]
    ]
  },
  {
    slug: "negation-no-entiendo",
    lessonSlug: "negation-simple-sentences",
    topicSlug: "negation-basics",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build a repair phrase.",
    instruction: "Put no before the verb.",
    questionText: "I do not understand.",
    answerJson: { correctWords: ["No", "entiendo", "."] },
    explanation: "Spanish negation often puts no directly before the verb.",
    difficulty: 1,
    order: 1,
    xpReward: 14,
    imageKey: "grammar-scenes:12",
    options: [
      ["No", "No", false],
      ["entiendo", "entiendo", false],
      [".", ".", false]
    ]
  },
  {
    slug: "negation-no-tengo-mapa",
    lessonSlug: "negation-simple-sentences",
    topicSlug: "negation-basics",
    type: ExerciseType.CLOZE,
    prompt: "Choose the missing word.",
    instruction: "Negate tengo.",
    questionText: "____ tengo un mapa.",
    answerJson: { correct: "No", accepted: ["no", "No"] },
    explanation: "Put no before tengo: No tengo un mapa.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "travel-and-survival:5",
    options: [
      ["No", "No", true],
      ["Soy", "Soy", false],
      ["Está", "Está", false]
    ]
  },
  {
    slug: "negation-ella-no-trabaja",
    lessonSlug: "negation-simple-sentences",
    topicSlug: "negation-basics",
    type: ExerciseType.ERROR_CORRECTION,
    prompt: "Fix the sentence.",
    instruction: "Put no before the verb.",
    questionText: "Ella trabaja no hoy.",
    answerJson: { correct: "Ella no trabaja hoy.", accepted: ["ella no trabaja hoy", "ella no trabaja hoy."] },
    explanation: "No goes before trabaja: Ella no trabaja hoy.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "daily-actions:3",
    options: []
  },
  {
    slug: "tener-tengo-mapa",
    lessonSlug: "tener-and-necesitar",
    topicSlug: "tener-necesitar",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Choose the tener form.",
    instruction: "Use the yo form.",
    questionText: "Yo ____ un mapa.",
    answerJson: { correct: "tengo", accepted: ["tengo"] },
    explanation: "Yo uses tengo: Yo tengo un mapa.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "travel-and-survival:5",
    options: [
      ["tengo", "tengo", true],
      ["tiene", "tiene", false],
      ["tenemos", "tenemos", false]
    ]
  },
  {
    slug: "tener-necesito-ayuda",
    lessonSlug: "tener-and-necesitar",
    topicSlug: "tener-necesitar",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the need phrase.",
    instruction: "Put the words in order.",
    questionText: "I need help.",
    answerJson: { correctWords: ["Necesito", "ayuda", "."] },
    explanation: "Necesito ayuda is a high-value phrase when stuck.",
    difficulty: 1,
    order: 2,
    xpReward: 14,
    imageKey: "travel-and-survival:12",
    options: [
      ["Necesito", "Necesito", false],
      ["ayuda", "ayuda", false],
      [".", ".", false]
    ]
  },
  {
    slug: "tener-tenemos-mesa",
    lessonSlug: "tener-and-necesitar",
    topicSlug: "tener-necesitar",
    type: ExerciseType.CLOZE,
    prompt: "Choose the nosotros form.",
    instruction: "Match nosotros.",
    questionText: "Nosotros ____ una mesa.",
    answerJson: { correct: "tenemos", accepted: ["tenemos"] },
    explanation: "Nosotros uses tenemos: Nosotros tenemos una mesa.",
    difficulty: 2,
    order: 3,
    xpReward: 14,
    imageKey: "home-objects:1",
    options: [
      ["tenemos", "tenemos", true],
      ["tengo", "tengo", false],
      ["tienen", "tienen", false]
    ]
  },
  {
    slug: "actions-compro-pan",
    lessonSlug: "daily-actions-expanded",
    topicSlug: "present-tense-ar",
    type: ExerciseType.CONJUGATION,
    prompt: "Conjugate comprar.",
    instruction: "Use the yo form.",
    questionText: "Yo ____ pan. (comprar)",
    answerJson: { correct: "compro", accepted: ["compro"] },
    explanation: "For yo, regular -ar verbs use -o: comprar becomes compro.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "food-and-ordering:3",
    options: [
      ["compro", "compro", true],
      ["compras", "compras", false],
      ["compra", "compra", false]
    ]
  },
  {
    slug: "actions-caminamos-parque",
    lessonSlug: "daily-actions-expanded",
    topicSlug: "present-tense-ar",
    type: ExerciseType.CLOZE,
    prompt: "Choose the nosotros ending.",
    instruction: "Match nosotros.",
    questionText: "Nosotros ____ al parque. (caminar)",
    answerJson: { correct: "caminamos", accepted: ["caminamos"] },
    explanation: "Nosotros uses -amos for regular -ar verbs.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "daily-actions:5",
    options: [
      ["caminamos", "caminamos", true],
      ["caminan", "caminan", false],
      ["camino", "camino", false]
    ]
  },
  {
    slug: "actions-hablas-amigo",
    lessonSlug: "daily-actions-expanded",
    topicSlug: "present-tense-ar",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the action sentence.",
    instruction: "Put the words in order.",
    questionText: "You speak with a friend.",
    answerJson: { correctWords: ["Tú", "hablas", "con", "un", "amigo", "."] },
    explanation: "Tú uses hablas for regular -ar verbs.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "daily-actions:1",
    options: [
      ["Tú", "Tú", false],
      ["hablas", "hablas", false],
      ["con", "con", false],
      ["un", "un", false],
      ["amigo", "amigo", false],
      [".", ".", false]
    ]
  },
  {
    slug: "market-una-manzana",
    lessonSlug: "market-and-fruit",
    topicSlug: "ordering-food",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "Choose the article.",
    instruction: "Match manzana.",
    questionText: "Quiero ____ manzana.",
    answerJson: { correct: "una", accepted: ["una"] },
    explanation: "Manzana is feminine singular, so use una.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "fruit-and-produce:1",
    options: [
      ["una", "una", true],
      ["un", "un", false],
      ["unos", "unos", false]
    ]
  },
  {
    slug: "market-platano-amarillo",
    lessonSlug: "market-and-fruit",
    topicSlug: "ordering-food",
    type: ExerciseType.CLOZE,
    prompt: "Describe the fruit.",
    instruction: "Use ser for a normal trait.",
    questionText: "El plátano ____ amarillo.",
    answerJson: { correct: "es", accepted: ["es"] },
    explanation: "Use ser for a normal characteristic: El plátano es amarillo.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "fruit-and-produce:2",
    options: [
      ["es", "es", true],
      ["está", "está", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "market-compro-fruta",
    lessonSlug: "market-and-fruit",
    topicSlug: "ordering-food",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the market sentence.",
    instruction: "Put the words in order.",
    questionText: "I buy fruit at the market.",
    answerJson: { correctWords: ["Compro", "fruta", "en", "el", "mercado", "."] },
    explanation: "Compro is the yo form of comprar.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "fruit-and-produce:21",
    options: [
      ["Compro", "Compro", false],
      ["fruta", "fruta", false],
      ["en", "en", false],
      ["el", "el", false],
      ["mercado", "mercado", false],
      [".", ".", false]
    ]
  },
  {
    slug: "restaurant-un-cafe",
    lessonSlug: "restaurant-conversation",
    topicSlug: "ordering-food",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the order.",
    instruction: "Put the words in order.",
    questionText: "A coffee, please.",
    answerJson: { correctWords: ["Un", "café", "por", "favor", "."] },
    explanation: "A short polite order is: Un café, por favor.",
    difficulty: 1,
    order: 1,
    xpReward: 14,
    imageKey: "food-and-ordering:2",
    options: [
      ["Un", "Un", false],
      ["café", "café", false],
      ["por", "por", false],
      ["favor", "favor", false],
      [".", ".", false]
    ]
  },
  {
    slug: "restaurant-no-entiendo-menu",
    lessonSlug: "restaurant-conversation",
    topicSlug: "ordering-food",
    type: ExerciseType.ERROR_CORRECTION,
    prompt: "Fix the sentence.",
    instruction: "Use no before entiendo.",
    questionText: "Entiendo no el menú.",
    answerJson: { correct: "No entiendo el menú.", accepted: ["no entiendo el menu", "no entiendo el menu."] },
    explanation: "No goes before the verb: No entiendo el menú.",
    difficulty: 2,
    order: 2,
    xpReward: 16,
    imageKey: "food-and-ordering:17",
    options: []
  },
  {
    slug: "restaurant-cuanto-postre",
    lessonSlug: "restaurant-conversation",
    topicSlug: "ordering-food",
    type: ExerciseType.CLOZE,
    prompt: "Ask the price.",
    instruction: "Use cuánto for price.",
    questionText: "¿____ cuesta el postre?",
    answerJson: { correct: "Cuánto", accepted: ["cuanto", "cuánto", "Cuanto", "Cuánto"] },
    explanation: "Use cuánto to ask how much something costs.",
    difficulty: 1,
    order: 3,
    xpReward: 12,
    imageKey: "food-and-ordering:15",
    options: [
      ["Cuánto", "Cuánto", true],
      ["Dónde", "Dónde", false],
      ["Quién", "Quién", false]
    ]
  },
  {
    slug: "checkpoint-ser-estar",
    lessonSlug: "checkpoint-a1-foundations",
    topicSlug: "question-words",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Mixed checkpoint.",
    instruction: "Choose the correct verb.",
    questionText: "Yo ____ estudiante y ____ en la biblioteca.",
    answerJson: { correct: "soy / estoy", accepted: ["soy estoy", "soy / estoy"] },
    explanation: "Use soy for identity and estoy for location.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "identity-and-introductions:8",
    options: [
      ["soy / estoy", "soy / estoy", true],
      ["estoy / soy", "estoy / soy", false],
      ["soy / soy", "soy / soy", false]
    ]
  },
  {
    slug: "checkpoint-order-coffee",
    lessonSlug: "checkpoint-a1-foundations",
    topicSlug: "question-words",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Mixed checkpoint.",
    instruction: "Build the order.",
    questionText: "I want a coffee, please.",
    answerJson: { correctWords: ["Quiero", "un", "café", "por", "favor", "."] },
    explanation: "Quiero un café, por favor is a complete polite order.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "food-and-ordering:2",
    options: [
      ["Quiero", "Quiero", false],
      ["un", "un", false],
      ["café", "café", false],
      ["por", "por", false],
      ["favor", "favor", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-travel-question",
    lessonSlug: "checkpoint-a1-foundations",
    topicSlug: "question-words",
    type: ExerciseType.CLOZE,
    prompt: "Mixed checkpoint.",
    instruction: "Ask for the station.",
    questionText: "¿____ está la estación?",
    answerJson: { correct: "Dónde", accepted: ["donde", "dónde", "Donde", "Dónde"] },
    explanation: "Use dónde to ask where a place is.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "city-transport:7",
    options: [
      ["Dónde", "Dónde", true],
      ["Cuánto", "Cuánto", false],
      ["Qué", "Qué", false]
    ]
  },
  {
    slug: "checkpoint-repair-phrase",
    lessonSlug: "checkpoint-a1-foundations",
    topicSlug: "question-words",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Mixed checkpoint.",
    instruction: "Build a repair phrase.",
    questionText: "I do not understand, more slowly please.",
    answerJson: { correctWords: ["No", "entiendo", "más", "despacio", "por", "favor", "."] },
    explanation: "This phrase helps you slow down real conversations.",
    difficulty: 2,
    order: 4,
    xpReward: 20,
    imageKey: "daily-actions:6",
    options: [
      ["No", "No", false],
      ["entiendo", "entiendo", false],
      ["más", "más", false],
      ["despacio", "despacio", false],
      ["por", "por", false],
      ["favor", "favor", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-a1-absolute-soy-ana",
    lessonSlug: "checkpoint-a1-absolute-start",
    topicSlug: "absolute-basics",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.0 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I am Ana.",
    answerJson: { correct: "Soy Ana.", accepted: ["soy ana", "soy ana."] },
    explanation: "Use soy for identity: Soy Ana.",
    difficulty: 1,
    order: 1,
    xpReward: 14,
    imageKey: "identity-and-introductions:1",
    options: []
  },
  {
    slug: "checkpoint-a1-absolute-ella-esta",
    lessonSlug: "checkpoint-a1-absolute-start",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "A1.0 checkpoint.",
    instruction: "Use estar for location.",
    questionText: "Ella ____ en casa.",
    answerJson: { correct: "está", accepted: ["esta", "está"] },
    explanation: "Use está for where someone is: Ella está en casa.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "identity-and-introductions:7",
    options: [
      ["está", "está", true],
      ["es", "es", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "checkpoint-a1-absolute-intro-builder",
    lessonSlug: "checkpoint-a1-absolute-start",
    topicSlug: "absolute-basics",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "A1.0 checkpoint.",
    instruction: "Build the introduction.",
    questionText: "Hello, my name is Ana.",
    answerJson: { correctWords: ["Hola", ",", "me", "llamo", "Ana", "."] },
    explanation: "A natural first introduction is Hola, me llamo Ana.",
    difficulty: 1,
    order: 3,
    xpReward: 16,
    imageKey: "identity-and-introductions:2",
    options: [
      ["Hola", "Hola", false],
      [",", ",", false],
      ["me", "me", false],
      ["llamo", "llamo", false],
      ["Ana", "Ana", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-a1-absolute-dialogue-name",
    lessonSlug: "checkpoint-a1-absolute-start",
    topicSlug: "absolute-basics",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "A1.0 checkpoint.",
    instruction: "Type a natural answer.",
    questionText: "Hola, ¿cómo te llamas?",
    answerJson: {
      correct: "Me llamo Ana.",
      accepted: ["me llamo ana", "me llamo ana.", "soy ana", "soy ana."]
    },
    explanation: "Answer with your name: Me llamo Ana.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "identity-and-introductions:15",
    options: []
  },
  {
    slug: "checkpoint-a1-core-soy-estudiante",
    lessonSlug: "checkpoint-a1-core-grammar",
    topicSlug: "ser-estar",
    type: ExerciseType.CLOZE,
    prompt: "A1.1 checkpoint.",
    instruction: "Use ser for identity.",
    questionText: "Yo ____ estudiante.",
    answerJson: { correct: "soy", accepted: ["soy"] },
    explanation: "Identity uses ser: Yo soy estudiante.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "grammar-scenes:1",
    options: [
      ["soy", "soy", true],
      ["estoy", "estoy", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "checkpoint-a1-core-el-libro",
    lessonSlug: "checkpoint-a1-core-grammar",
    topicSlug: "articles-gender",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "A1.1 checkpoint.",
    instruction: "Choose the article.",
    questionText: "____ libro",
    answerJson: { correct: "el", accepted: ["el"] },
    explanation: "Libro is masculine singular, so it uses el.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "classroom-basics:3",
    options: [
      ["el", "el", true],
      ["la", "la", false],
      ["los", "los", false]
    ]
  },
  {
    slug: "checkpoint-a1-core-hablo",
    lessonSlug: "checkpoint-a1-core-grammar",
    topicSlug: "present-tense-ar",
    type: ExerciseType.CONJUGATION,
    prompt: "A1.1 checkpoint.",
    instruction: "Write the yo form.",
    questionText: "Yo ____ español. (hablar)",
    answerJson: { correct: "hablo", accepted: ["hablo"] },
    explanation: "For yo, hablar becomes hablo.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "daily-actions:1",
    options: []
  },
  {
    slug: "checkpoint-a1-core-estoy-feliz",
    lessonSlug: "checkpoint-a1-core-grammar",
    topicSlug: "estar-emotions",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.1 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I am happy today.",
    answerJson: { correct: "Estoy feliz hoy.", accepted: ["estoy feliz hoy", "estoy feliz hoy."] },
    explanation: "Use estoy for a current feeling: Estoy feliz hoy.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "emotions-and-states:1",
    options: []
  },
  {
    slug: "checkpoint-a1-survival-need-taxi",
    lessonSlug: "checkpoint-a1-survival-spanish",
    topicSlug: "travel-questions",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "A1.2 checkpoint.",
    instruction: "Build the travel sentence.",
    questionText: "I need a taxi.",
    answerJson: { correctWords: ["Necesito", "un", "taxi", "."] },
    explanation: "Necesito un taxi is a practical travel sentence.",
    difficulty: 1,
    order: 1,
    xpReward: 16,
    imageKey: "city-transport:3",
    options: [
      ["Necesito", "Necesito", false],
      ["un", "un", false],
      ["taxi", "taxi", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-a1-survival-hotel",
    lessonSlug: "checkpoint-a1-survival-spanish",
    topicSlug: "travel-questions",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.2 checkpoint.",
    instruction: "Translate the question.",
    questionText: "Where is the hotel?",
    answerJson: { correct: "¿Dónde está el hotel?", accepted: ["donde esta el hotel", "donde esta el hotel?"] },
    explanation: "Use dónde está for where is: ¿Dónde está el hotel?",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "city-transport:13",
    options: []
  },
  {
    slug: "checkpoint-a1-survival-no-map",
    lessonSlug: "checkpoint-a1-survival-spanish",
    topicSlug: "negation-basics",
    type: ExerciseType.TRANSFORMATION,
    prompt: "A1.2 checkpoint.",
    instruction: "Make the sentence negative.",
    questionText: "Tengo un mapa.",
    answerJson: { correct: "No tengo un mapa.", accepted: ["no tengo un mapa", "no tengo un mapa."] },
    explanation: "No goes before tengo: No tengo un mapa.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "travel-and-survival:5",
    options: []
  },
  {
    slug: "checkpoint-a1-survival-cafe-reply",
    lessonSlug: "checkpoint-a1-survival-spanish",
    topicSlug: "ordering-food",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "A1.2 checkpoint.",
    instruction: "Type a polite answer.",
    questionText: "En un café: ¿Qué quieres?",
    answerJson: {
      correct: "Quiero un café, por favor.",
      accepted: ["quiero un cafe por favor", "quiero un cafe, por favor", "un cafe por favor", "un cafe, por favor"]
    },
    explanation: "A polite answer is Quiero un café, por favor.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "food-and-ordering:2",
    options: []
  },
  {
    slug: "checkpoint-a1-daily-compro",
    lessonSlug: "checkpoint-a1-daily-life",
    topicSlug: "present-tense-ar",
    type: ExerciseType.CONJUGATION,
    prompt: "A1.3 checkpoint.",
    instruction: "Write the yo form.",
    questionText: "Yo ____ pan. (comprar)",
    answerJson: { correct: "compro", accepted: ["compro"] },
    explanation: "For yo, comprar becomes compro.",
    difficulty: 2,
    order: 1,
    xpReward: 16,
    imageKey: "food-and-ordering:3",
    options: []
  },
  {
    slug: "checkpoint-a1-daily-una-manzana",
    lessonSlug: "checkpoint-a1-daily-life",
    topicSlug: "ordering-food",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "A1.3 checkpoint.",
    instruction: "Choose the article.",
    questionText: "Quiero ____ manzana.",
    answerJson: { correct: "una", accepted: ["una"] },
    explanation: "Manzana is feminine singular, so use una.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "fruit-and-produce:1",
    options: [
      ["una", "una", true],
      ["un", "un", false],
      ["unos", "unos", false]
    ]
  },
  {
    slug: "checkpoint-a1-daily-coffee-order",
    lessonSlug: "checkpoint-a1-daily-life",
    topicSlug: "ordering-food",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "A1.3 checkpoint.",
    instruction: "Build the order.",
    questionText: "A coffee, please.",
    answerJson: { correctWords: ["Un", "café", "por", "favor", "."] },
    explanation: "A short polite order is Un café, por favor.",
    difficulty: 1,
    order: 3,
    xpReward: 16,
    imageKey: "food-and-ordering:2",
    options: [
      ["Un", "Un", false],
      ["café", "café", false],
      ["por", "por", false],
      ["favor", "favor", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-a1-daily-repair",
    lessonSlug: "checkpoint-a1-daily-life",
    topicSlug: "absolute-basics",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.3 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I do not understand, more slowly please.",
    answerJson: {
      correct: "No entiendo, más despacio, por favor.",
      accepted: ["no entiendo mas despacio por favor", "no entiendo, mas despacio, por favor", "no entiendo mas despacio por favor."]
    },
    explanation: "Use No entiendo, más despacio, por favor when speech is too fast.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "daily-actions:6",
    options: []
  },
  {
    slug: "checkpoint-a1-blocks-origin",
    lessonSlug: "checkpoint-a1-building-blocks",
    topicSlug: "absolute-basics",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.4 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I am from Austria.",
    answerJson: { correct: "Soy de Austria.", accepted: ["soy de austria", "soy de austria."] },
    explanation: "Origin uses soy de: Soy de Austria.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "identity-and-introductions:12",
    options: []
  },
  {
    slug: "checkpoint-a1-blocks-la-tienda",
    lessonSlug: "checkpoint-a1-building-blocks",
    topicSlug: "articles-gender",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "A1.4 checkpoint.",
    instruction: "Choose the article.",
    questionText: "____ tienda",
    answerJson: { correct: "la", accepted: ["la"] },
    explanation: "Tienda is feminine singular, so use la.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "places-around-town:2",
    options: [
      ["la", "la", true],
      ["el", "el", false],
      ["los", "los", false]
    ]
  },
  {
    slug: "checkpoint-a1-blocks-cafe-location",
    lessonSlug: "checkpoint-a1-building-blocks",
    topicSlug: "location-prepositions",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.4 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I am in the café.",
    answerJson: { correct: "Estoy en el café.", accepted: ["estoy en el cafe", "estoy en el cafe."] },
    explanation: "Use estoy en for location: Estoy en el café.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "places-around-town:1",
    options: []
  },
  {
    slug: "checkpoint-a1-blocks-no-soy",
    lessonSlug: "checkpoint-a1-building-blocks",
    topicSlug: "negation-basics",
    type: ExerciseType.TRANSFORMATION,
    prompt: "A1.4 checkpoint.",
    instruction: "Make the sentence negative.",
    questionText: "Soy estudiante.",
    answerJson: { correct: "No soy estudiante.", accepted: ["no soy estudiante", "no soy estudiante."] },
    explanation: "No goes before soy: No soy estudiante.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "grammar-scenes:12",
    options: []
  },
  {
    slug: "checkpoint-a1-frames-un-cafe",
    lessonSlug: "checkpoint-a1-verb-frames",
    topicSlug: "ordering-food",
    type: ExerciseType.CLOZE,
    prompt: "A1.5 checkpoint.",
    instruction: "Choose the article.",
    questionText: "Quiero ____ café, por favor.",
    answerJson: { correct: "un", accepted: ["un"] },
    explanation: "Café is masculine singular, so use un.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "food-and-ordering:2",
    options: [
      ["un", "un", true],
      ["una", "una", false],
      ["las", "las", false]
    ]
  },
  {
    slug: "checkpoint-a1-frames-backpack",
    lessonSlug: "checkpoint-a1-verb-frames",
    topicSlug: "tener-necesitar",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.5 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I have a backpack.",
    answerJson: { correct: "Tengo una mochila.", accepted: ["tengo una mochila", "tengo una mochila."] },
    explanation: "Use tengo for I have, and una with mochila.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "classroom-basics:8",
    options: []
  },
  {
    slug: "checkpoint-a1-frames-price-question",
    lessonSlug: "checkpoint-a1-verb-frames",
    topicSlug: "question-words",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "A1.5 checkpoint.",
    instruction: "Build the price question.",
    questionText: "How much does the bread cost?",
    answerJson: { correctWords: ["Cuánto", "cuesta", "el", "pan", "?"] },
    explanation: "Use cuánto cuesta to ask price: ¿Cuánto cuesta el pan?",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "food-and-ordering:3",
    options: [
      ["Cuánto", "Cuánto", false],
      ["cuesta", "cuesta", false],
      ["el", "el", false],
      ["pan", "pan", false],
      ["?", "?", false]
    ]
  },
  {
    slug: "checkpoint-a1-frames-hablamos",
    lessonSlug: "checkpoint-a1-verb-frames",
    topicSlug: "present-tense-ar",
    type: ExerciseType.CONJUGATION,
    prompt: "A1.5 checkpoint.",
    instruction: "Write the nosotros form.",
    questionText: "Nosotros ____ español. (hablar)",
    answerJson: { correct: "hablamos", accepted: ["hablamos"] },
    explanation: "Nosotros uses -amos: hablamos.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "people-and-family:16",
    options: []
  },
  {
    slug: "checkpoint-a1-frames-book-table",
    lessonSlug: "checkpoint-a1-verb-frames",
    topicSlug: "location-prepositions",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.5 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "The book is on the table.",
    answerJson: { correct: "El libro está en la mesa.", accepted: ["el libro esta en la mesa", "el libro esta en la mesa."] },
    explanation: "Use estar for object location: El libro está en la mesa.",
    difficulty: 2,
    order: 5,
    xpReward: 18,
    imageKey: "home-objects:1",
    options: []
  },
  {
    slug: "checkpoint-a1-health-la-cabeza",
    lessonSlug: "checkpoint-a1-health-and-states",
    topicSlug: "tener-necesitar",
    type: ExerciseType.ARTICLE_MATCH,
    prompt: "A1.6 checkpoint.",
    instruction: "Choose the article.",
    questionText: "____ cabeza",
    answerJson: { correct: "la", accepted: ["la"] },
    explanation: "Cabeza uses la.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "body-and-health:1",
    options: [
      ["la", "la", true],
      ["el", "el", false],
      ["los", "los", false]
    ]
  },
  {
    slug: "checkpoint-a1-health-head-hurts",
    lessonSlug: "checkpoint-a1-health-and-states",
    topicSlug: "tener-necesitar",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A1.6 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "My head hurts.",
    answerJson: { correct: "Me duele la cabeza.", accepted: ["me duele la cabeza", "me duele la cabeza."] },
    explanation: "Use me duele with one body part: Me duele la cabeza.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "body-and-health:7",
    options: []
  },
  {
    slug: "checkpoint-a1-health-hunger",
    lessonSlug: "checkpoint-a1-health-and-states",
    topicSlug: "tener-necesitar",
    type: ExerciseType.CLOZE,
    prompt: "A1.6 checkpoint.",
    instruction: "Choose the state word.",
    questionText: "Tengo ____.",
    answerJson: { correct: "hambre", accepted: ["hambre"] },
    explanation: "Tengo hambre means I am hungry.",
    difficulty: 1,
    order: 3,
    xpReward: 12,
    imageKey: "body-and-health:10",
    options: [
      ["hambre", "hambre", true],
      ["cabeza", "cabeza", false],
      ["doctor", "doctor", false]
    ]
  },
  {
    slug: "checkpoint-a1-health-doctor-reply",
    lessonSlug: "checkpoint-a1-health-and-states",
    topicSlug: "tener-necesitar",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "A1.6 checkpoint.",
    instruction: "Type a practical answer.",
    questionText: "En la farmacia: ¿Qué necesita?",
    answerJson: {
      correct: "Necesito un doctor.",
      accepted: ["necesito un doctor", "necesito un doctor.", "necesito ayuda", "necesito ayuda."]
    },
    explanation: "A practical answer is Necesito un doctor.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "body-and-health:12",
    options: []
  },
  {
    slug: "checkpoint-final-a1-head-hurts",
    lessonSlug: "checkpoint-a1-foundations",
    topicSlug: "tener-necesitar",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Final A1 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "My head hurts.",
    answerJson: { correct: "Me duele la cabeza.", accepted: ["me duele la cabeza", "me duele la cabeza."] },
    explanation: "Use me duele with one body part: Me duele la cabeza.",
    difficulty: 2,
    order: 5,
    xpReward: 20,
    imageKey: "body-and-health:7",
    options: []
  },
  {
    slug: "checkpoint-final-a1-sunny-park",
    lessonSlug: "checkpoint-a1-foundations",
    topicSlug: "question-words",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Final A1 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "It is sunny in the park.",
    answerJson: { correct: "Hace sol en el parque.", accepted: ["hace sol en el parque", "hace sol en el parque."] },
    explanation: "Hace sol describes sunny weather: Hace sol en el parque.",
    difficulty: 2,
    order: 6,
    xpReward: 20,
    imageKey: "weather-and-time:1",
    options: []
  },
  {
    slug: "checkpoint-final-a1-apple-red",
    lessonSlug: "checkpoint-a1-foundations",
    topicSlug: "articles-gender",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Final A1 checkpoint.",
    instruction: "Build the description.",
    questionText: "The apple is red.",
    answerJson: { correctWords: ["La", "manzana", "es", "roja", "."] },
    explanation: "Manzana is feminine, so use la and roja.",
    difficulty: 2,
    order: 7,
    xpReward: 20,
    imageKey: "numbers-and-colors:7",
    options: [
      ["La", "La", false],
      ["manzana", "manzana", false],
      ["es", "es", false],
      ["roja", "roja", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-final-a1-two-apples",
    lessonSlug: "checkpoint-a1-foundations",
    topicSlug: "plural-agreement",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Final A1 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I have two apples.",
    answerJson: { correct: "Tengo dos manzanas.", accepted: ["tengo dos manzanas", "tengo dos manzanas."] },
    explanation: "Use dos with plural manzanas: Tengo dos manzanas.",
    difficulty: 2,
    order: 8,
    xpReward: 20,
    imageKey: "numbers-and-colors:2",
    options: []
  },
  {
    slug: "a2-routine-despierto",
    lessonSlug: "a2-daily-routine-overview",
    topicSlug: "daily-routine-time",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Daily routine.",
    instruction: "Translate the sentence.",
    questionText: "I wake up early.",
    answerJson: { correct: "Me despierto temprano.", accepted: ["me despierto temprano", "me despierto temprano."] },
    explanation: "Use me despierto for I wake up: Me despierto temprano.",
    difficulty: 2,
    order: 1,
    xpReward: 16,
    imageKey: "a2-daily-routine:1",
    options: []
  },
  {
    slug: "a2-routine-desayuno-ocho",
    lessonSlug: "a2-daily-routine-overview",
    topicSlug: "daily-routine-time",
    type: ExerciseType.CLOZE,
    prompt: "Time phrase.",
    instruction: "Choose the routine verb.",
    questionText: "____ a las ocho.",
    answerJson: { correct: "Desayuno", accepted: ["desayuno", "Desayuno"] },
    explanation: "Desayuno means I eat breakfast: Desayuno a las ocho.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "a2-daily-routine:6",
    options: [
      ["Desayuno", "Desayuno", true],
      ["Me levanto", "Me levanto", false],
      ["Me acuesto", "Me acuesto", false]
    ]
  },
  {
    slug: "a2-routine-study-afternoon",
    lessonSlug: "a2-daily-routine-overview",
    topicSlug: "daily-routine-time",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the routine sentence.",
    instruction: "Put the words in order.",
    questionText: "I study in the afternoon.",
    answerJson: { correctWords: ["Estudio", "por", "la", "tarde", "."] },
    explanation: "The time phrase follows the action: Estudio por la tarde.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "a2-daily-routine:8",
    options: [
      ["Estudio", "Estudio", false],
      ["por", "por", false],
      ["la", "la", false],
      ["tarde", "tarde", false],
      [".", ".", false]
    ]
  },
  {
    slug: "a2-reflexive-me-levanto",
    lessonSlug: "a2-reflexive-morning",
    topicSlug: "daily-routine-time",
    type: ExerciseType.CONJUGATION,
    prompt: "Reflexive yo form.",
    instruction: "Write the complete yo form.",
    questionText: "Yo ____ a las siete. (levantarse)",
    answerJson: { correct: "me levanto", accepted: ["me levanto"] },
    explanation: "Levantarse becomes me levanto in the yo form.",
    difficulty: 2,
    order: 1,
    xpReward: 14,
    imageKey: "a2-daily-routine:2",
    options: []
  },
  {
    slug: "a2-reflexive-brush-teeth",
    lessonSlug: "a2-reflexive-morning",
    topicSlug: "daily-routine-time",
    type: ExerciseType.TRANSFORMATION,
    prompt: "Rewrite with yo.",
    instruction: "Change the infinitive phrase into a complete yo sentence.",
    questionText: "cepillarse los dientes",
    answerJson: { correct: "Me cepillo los dientes.", accepted: ["me cepillo los dientes", "me cepillo los dientes."] },
    explanation: "For yo, cepillarse becomes me cepillo: Me cepillo los dientes.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "a2-daily-routine:4",
    options: []
  },
  {
    slug: "a2-reflexive-me-or-no-me",
    lessonSlug: "a2-reflexive-morning",
    topicSlug: "daily-routine-time",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Reflexive or normal verb?",
    instruction: "Choose the natural sentence.",
    questionText: "I eat breakfast.",
    answerJson: { correct: "Desayuno.", accepted: ["desayuno", "desayuno."] },
    explanation: "Desayunar is not reflexive here, so do not add me.",
    difficulty: 1,
    order: 3,
    xpReward: 12,
    imageKey: "a2-daily-routine:6",
    options: [
      ["Desayuno.", "Desayuno.", true],
      ["Me desayuno.", "Me desayuno.", false],
      ["Me despierto.", "Me despierto.", false]
    ]
  },
  {
    slug: "a2-time-cada-semana",
    lessonSlug: "a2-frequency-and-time",
    topicSlug: "daily-routine-time",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Frequency phrase.",
    instruction: "Translate the sentence.",
    questionText: "I clean every week.",
    answerJson: { correct: "Limpio cada semana.", accepted: ["limpio cada semana", "limpio cada semana."] },
    explanation: "Cada semana means every week: Limpio cada semana.",
    difficulty: 2,
    order: 1,
    xpReward: 16,
    imageKey: "a2-daily-routine:15",
    options: []
  },
  {
    slug: "a2-time-cook-night",
    lessonSlug: "a2-frequency-and-time",
    topicSlug: "daily-routine-time",
    type: ExerciseType.LISTENING_DICTATION,
    prompt: "Dictation.",
    instruction: "Listen, then type the Spanish sentence.",
    questionText: "Listen to the sentence.",
    answerJson: { correct: "Cocino la cena por la noche.", accepted: ["cocino la cena por la noche", "cocino la cena por la noche."], audioText: "Cocino la cena por la noche." },
    explanation: "This sentence means I cook dinner at night.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "a2-daily-routine:9",
    options: []
  },
  {
    slug: "a2-time-afternoon-choice",
    lessonSlug: "a2-frequency-and-time",
    topicSlug: "daily-routine-time",
    type: ExerciseType.CLOZE,
    prompt: "Time of day.",
    instruction: "Choose the phrase for in the afternoon.",
    questionText: "Estudio ____.",
    answerJson: { correct: "por la tarde", accepted: ["por la tarde"] },
    explanation: "Por la tarde means in the afternoon.",
    difficulty: 1,
    order: 3,
    xpReward: 12,
    imageKey: "a2-daily-routine:14",
    options: [
      ["por la tarde", "por la tarde", true],
      ["por la mañana", "por la mañana", false],
      ["cada semana", "cada semana", false]
    ]
  },
  {
    slug: "a2-sequence-first-after",
    lessonSlug: "a2-routine-sequence",
    topicSlug: "daily-routine-time",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the sequence.",
    instruction: "Put the words in order.",
    questionText: "First I get up.",
    answerJson: { correctWords: ["Primero", "me", "levanto", "."] },
    explanation: "Primero comes first, and levantarse becomes me levanto.",
    difficulty: 2,
    order: 1,
    xpReward: 16,
    imageKey: "a2-daily-routine:2",
    options: [
      ["Primero", "Primero", false],
      ["me", "me", false],
      ["levanto", "levanto", false],
      [".", ".", false]
    ]
  },
  {
    slug: "a2-sequence-dialogue-reply",
    lessonSlug: "a2-routine-sequence",
    topicSlug: "daily-routine-time",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Reply naturally.",
    instruction: "Type a natural answer in Spanish.",
    questionText: "¿Qué haces por la noche?",
    answerJson: {
      correct: "Leo por la noche.",
      accepted: ["leo por la noche", "leo por la noche.", "por la noche leo", "por la noche leo."],
      alternatives: [{ answer: "Me acuesto por la noche.", note: "This is also a natural routine answer." }]
    },
    explanation: "Answer the question with a routine action plus a time phrase.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "a2-daily-routine:12",
    options: []
  },
  {
    slug: "a2-sequence-writing",
    lessonSlug: "a2-routine-sequence",
    topicSlug: "daily-routine-time",
    type: ExerciseType.WRITING_PROMPT,
    prompt: "Controlled writing.",
    instruction: "Write the full model sentence.",
    questionText: "Write: At night I read and go to bed.",
    answerJson: {
      correct: "Por la noche leo y me acuesto.",
      accepted: ["por la noche leo y me acuesto", "por la noche leo y me acuesto.", "leo por la noche y me acuesto", "leo por la noche y me acuesto."],
      rubric: "Use a night phrase, leo, y, and me acuesto."
    },
    explanation: "Me acuesto is reflexive, but leo is not.",
    difficulty: 3,
    order: 3,
    xpReward: 20,
    imageKey: "a2-daily-routine:11",
    options: []
  },
  {
    slug: "checkpoint-a2-reflexive-me",
    lessonSlug: "checkpoint-a2-daily-routine",
    topicSlug: "daily-routine-time",
    type: ExerciseType.CONJUGATION,
    prompt: "A2 checkpoint.",
    instruction: "Write the complete yo form.",
    questionText: "Yo ____ a las siete. (despertarse)",
    answerJson: { correct: "me despierto", accepted: ["me despierto"] },
    explanation: "Despertarse becomes me despierto in the yo form.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "a2-daily-routine:1",
    options: []
  },
  {
    slug: "checkpoint-a2-time-phrase",
    lessonSlug: "checkpoint-a2-daily-routine",
    topicSlug: "daily-routine-time",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A2 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I work in the morning.",
    answerJson: { correct: "Trabajo por la mañana.", accepted: ["trabajo por la mañana", "trabajo por la mañana."] },
    explanation: "Por la mañana means in the morning.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "a2-daily-routine:13",
    options: []
  },
  {
    slug: "checkpoint-a2-routine-sequence",
    lessonSlug: "checkpoint-a2-daily-routine",
    topicSlug: "daily-routine-time",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "A2 checkpoint.",
    instruction: "Build the sentence.",
    questionText: "Afterward I eat breakfast.",
    answerJson: { correctWords: ["Después", "desayuno", "."] },
    explanation: "Después connects the next event in a routine.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "a2-daily-routine:6",
    options: [
      ["Después", "Después", false],
      ["desayuno", "desayuno", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-a2-short-routine",
    lessonSlug: "checkpoint-a2-daily-routine",
    topicSlug: "daily-routine-time",
    type: ExerciseType.WRITING_PROMPT,
    prompt: "A2 checkpoint.",
    instruction: "Write the full model sentence.",
    questionText: "Write: I wake up at seven and eat breakfast at eight.",
    answerJson: {
      correct: "Me despierto a las siete y desayuno a las ocho.",
      accepted: ["me despierto a las siete y desayuno a las ocho", "me despierto a las siete y desayuno a las ocho."],
      rubric: "Use me despierto, a las siete, y, desayuno, and a las ocho."
    },
    explanation: "Use me with despierto, but not with desayuno.",
    difficulty: 3,
    order: 4,
    xpReward: 22,
    imageKey: "a2-daily-routine:1",
    options: []
  },
  {
    slug: "a2-irregular-voy-tienda",
    lessonSlug: "a2-irregular-present-overview",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.CONJUGATION,
    prompt: "Irregular yo form.",
    instruction: "Write the present yo form.",
    questionText: "Yo ____ a la tienda. (ir)",
    answerJson: { correct: "voy", accepted: ["voy"], trainer: { tense: "present", person: "yo", family: "irregular", infinitive: "ir" } },
    explanation: "Ir becomes voy in the yo form.",
    difficulty: 2,
    order: 1,
    xpReward: 16,
    imageKey: "irregular-verbs:1",
    options: []
  },
  {
    slug: "a2-irregular-hago-tarea",
    lessonSlug: "a2-irregular-present-overview",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.CONJUGATION,
    prompt: "Irregular yo form.",
    instruction: "Write the present yo form.",
    questionText: "Yo ____ la tarea. (hacer)",
    answerJson: { correct: "hago", accepted: ["hago"], trainer: { tense: "present", person: "yo", family: "irregular", infinitive: "hacer" } },
    explanation: "Hacer becomes hago in the yo form.",
    difficulty: 2,
    order: 2,
    xpReward: 16,
    imageKey: "irregular-verbs:7",
    options: []
  },
  {
    slug: "a2-irregular-vengo-casa",
    lessonSlug: "a2-irregular-present-overview",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Irregular sentence.",
    instruction: "Translate the sentence.",
    questionText: "I come home.",
    answerJson: { correct: "Vengo a casa.", accepted: ["vengo a casa", "vengo a casa."] },
    explanation: "Venir becomes vengo: Vengo a casa.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "irregular-verbs:2",
    options: []
  },
  {
    slug: "a2-frame-puedo-estudiar",
    lessonSlug: "a2-useful-verb-frames",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.CLOZE,
    prompt: "Useful frame.",
    instruction: "Choose the yo form before the infinitive.",
    questionText: "Yo ____ estudiar hoy.",
    answerJson: { correct: "puedo", accepted: ["puedo"] },
    explanation: "Puedo plus infinitive means I can: Puedo estudiar hoy.",
    difficulty: 1,
    order: 1,
    xpReward: 14,
    imageKey: "irregular-verbs:13",
    options: [
      ["puedo", "puedo", true],
      ["puede", "puede", false],
      ["pueden", "pueden", false]
    ]
  },
  {
    slug: "a2-frame-tengo-que-trabajar",
    lessonSlug: "a2-useful-verb-frames",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Obligation frame.",
    instruction: "Build the sentence.",
    questionText: "I have to work.",
    answerJson: { correctWords: ["Tengo", "que", "trabajar", "."] },
    explanation: "Tengo que plus infinitive expresses obligation.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "irregular-verbs:15",
    options: [
      ["Tengo", "Tengo", false],
      ["que", "que", false],
      ["trabajar", "trabajar", false],
      [".", ".", false]
    ]
  },
  {
    slug: "a2-frame-voy-a-estudiar",
    lessonSlug: "a2-useful-verb-frames",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Near future.",
    instruction: "Translate the sentence.",
    questionText: "I am going to study tomorrow.",
    answerJson: { correct: "Voy a estudiar mañana.", accepted: ["voy a estudiar manana", "voy a estudiar mañana", "voy a estudiar manana.", "voy a estudiar mañana."] },
    explanation: "Voy a plus infinitive makes a near-future plan.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "irregular-verbs:1",
    options: []
  },
  {
    slug: "a2-more-pongo-libro",
    lessonSlug: "a2-more-irregular-actions",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.CONJUGATION,
    prompt: "Irregular yo form.",
    instruction: "Write the present yo form.",
    questionText: "Yo ____ el libro en la mesa. (poner)",
    answerJson: { correct: "pongo", accepted: ["pongo"], trainer: { tense: "present", person: "yo", family: "irregular", infinitive: "poner" } },
    explanation: "Poner becomes pongo in the yo form.",
    difficulty: 2,
    order: 1,
    xpReward: 16,
    imageKey: "irregular-verbs:4",
    options: []
  },
  {
    slug: "a2-more-traigo-dictation",
    lessonSlug: "a2-more-irregular-actions",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.LISTENING_DICTATION,
    prompt: "Dictation.",
    instruction: "Listen, then type the Spanish sentence.",
    questionText: "Listen to the sentence.",
    answerJson: { correct: "Traigo una bolsa.", accepted: ["traigo una bolsa", "traigo una bolsa."], audioText: "Traigo una bolsa." },
    explanation: "Traer becomes traigo: Traigo una bolsa.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "irregular-verbs:5",
    options: []
  },
  {
    slug: "a2-more-veo-letrero",
    lessonSlug: "a2-more-irregular-actions",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Irregular sentence.",
    instruction: "Translate the sentence.",
    questionText: "I see the sign.",
    answerJson: { correct: "Veo el letrero.", accepted: ["veo el letrero", "veo el letrero."] },
    explanation: "Ver becomes veo: Veo el letrero.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "irregular-verbs:9",
    options: []
  },
  {
    slug: "a2-plans-dialogue-tengo-que",
    lessonSlug: "a2-plans-obligations",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Answer with an obligation.",
    instruction: "Type a natural answer in Spanish.",
    questionText: "¿Qué tienes que hacer hoy?",
    answerJson: {
      correct: "Tengo que trabajar.",
      accepted: ["tengo que trabajar", "tengo que trabajar.", "tengo que estudiar", "tengo que estudiar."]
    },
    explanation: "Answer with tengo que plus an infinitive.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "irregular-verbs:15",
    options: []
  },
  {
    slug: "a2-plans-puedo-transform",
    lessonSlug: "a2-plans-obligations",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.TRANSFORMATION,
    prompt: "Change desire to ability.",
    instruction: "Rewrite the sentence with puedo.",
    questionText: "Quiero estudiar.",
    answerJson: { correct: "Puedo estudiar.", accepted: ["puedo estudiar", "puedo estudiar."] },
    explanation: "Use puedo plus infinitive: Puedo estudiar.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "irregular-verbs:13",
    options: []
  },
  {
    slug: "a2-plans-writing-store-work",
    lessonSlug: "a2-plans-obligations",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.WRITING_PROMPT,
    prompt: "Controlled writing.",
    instruction: "Write the full model sentence.",
    questionText: "Write: I want to go to the store, but I have to work.",
    answerJson: {
      correct: "Quiero ir a la tienda, pero tengo que trabajar.",
      accepted: ["quiero ir a la tienda pero tengo que trabajar", "quiero ir a la tienda, pero tengo que trabajar", "quiero ir a la tienda pero tengo que trabajar."],
      rubric: "Use quiero + ir, pero, and tengo que trabajar."
    },
    explanation: "Quiero and tengo que both take an infinitive after them.",
    difficulty: 3,
    order: 3,
    xpReward: 22,
    imageKey: "irregular-verbs:1",
    options: []
  },
  {
    slug: "checkpoint-a2-vengo",
    lessonSlug: "checkpoint-a2-verb-frames",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.CONJUGATION,
    prompt: "A2 checkpoint.",
    instruction: "Write the present yo form.",
    questionText: "Yo ____ a casa. (venir)",
    answerJson: { correct: "vengo", accepted: ["vengo"], trainer: { tense: "present", person: "yo", family: "irregular", infinitive: "venir" } },
    explanation: "Venir becomes vengo in the yo form.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "irregular-verbs:2",
    options: []
  },
  {
    slug: "checkpoint-a2-salgo",
    lessonSlug: "checkpoint-a2-verb-frames",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.CONJUGATION,
    prompt: "A2 checkpoint.",
    instruction: "Write the present yo form.",
    questionText: "Yo ____ a las ocho. (salir)",
    answerJson: { correct: "salgo", accepted: ["salgo"], trainer: { tense: "present", person: "yo", family: "irregular", infinitive: "salir" } },
    explanation: "Salir becomes salgo in the yo form.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "irregular-verbs:3",
    options: []
  },
  {
    slug: "checkpoint-a2-puedo-open",
    lessonSlug: "checkpoint-a2-verb-frames",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A2 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I can open the door.",
    answerJson: { correct: "Puedo abrir la puerta.", accepted: ["puedo abrir la puerta", "puedo abrir la puerta."] },
    explanation: "Puedo plus infinitive expresses ability.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "irregular-verbs:13",
    options: []
  },
  {
    slug: "checkpoint-a2-bring-bag",
    lessonSlug: "checkpoint-a2-verb-frames",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "A2 checkpoint.",
    instruction: "Build the plan.",
    questionText: "I am going to bring a bag.",
    answerJson: { correctWords: ["Voy", "a", "traer", "una", "bolsa", "."] },
    explanation: "Voy a plus infinitive expresses a plan: Voy a traer una bolsa.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "irregular-verbs:5",
    options: [
      ["Voy", "Voy", false],
      ["a", "a", false],
      ["traer", "traer", false],
      ["una", "una", false],
      ["bolsa", "bolsa", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-a2-tomorrow-plan",
    lessonSlug: "checkpoint-a2-verb-frames",
    topicSlug: "irregular-present-frames",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "A2 checkpoint.",
    instruction: "Type a natural answer in Spanish.",
    questionText: "¿Qué vas a hacer mañana?",
    answerJson: {
      correct: "Voy a estudiar mañana.",
      accepted: ["voy a estudiar manana", "voy a estudiar mañana", "voy a estudiar manana.", "voy a estudiar mañana."]
    },
    explanation: "Answer with voy a plus an infinitive for a plan.",
    difficulty: 2,
    order: 5,
    xpReward: 20,
    imageKey: "irregular-verbs:7",
    options: []
  },
  {
    slug: "a2-gustar-meaning-musica",
    lessonSlug: "a2-gustar-basics",
    topicSlug: "likes-preferences",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Gustar meaning.",
    instruction: "Choose the meaning.",
    questionText: "Me gusta la música.",
    answerJson: { correct: "I like music.", accepted: ["I like music", "I like music."] },
    explanation: "Me gusta la música means I like music. The liked thing is singular, so use gusta.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "preferences-and-hobbies:1",
    options: [
      ["I like music.", "I like music.", true],
      ["I am music.", "I am music.", false],
      ["I need music.", "I need music.", false]
    ]
  },
  {
    slug: "a2-gustar-me-cafe",
    lessonSlug: "a2-gustar-basics",
    topicSlug: "likes-preferences",
    type: ExerciseType.CLOZE,
    prompt: "Build a like.",
    instruction: "Complete the pattern.",
    questionText: "____ gusta el café.",
    answerJson: { correct: "Me", accepted: ["me"], goal: "gustar" },
    explanation: "Use me gusta for I like: Me gusta el café.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "preferences-and-hobbies:7",
    options: [
      ["Me", "Me", true],
      ["Yo", "Yo", false],
      ["Tengo", "Tengo", false]
    ]
  },
  {
    slug: "a2-gustar-no-lluvia",
    lessonSlug: "a2-gustar-basics",
    topicSlug: "likes-preferences",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Dislike.",
    instruction: "Translate the sentence.",
    questionText: "I do not like rain.",
    answerJson: { correct: "No me gusta la lluvia.", accepted: ["no me gusta la lluvia", "no me gusta la lluvia."] },
    explanation: "Put no before me gusta: No me gusta la lluvia.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "preferences-and-hobbies:8",
    options: []
  },
  {
    slug: "a2-gustar-dialogue-futbol",
    lessonSlug: "a2-gustar-basics",
    topicSlug: "likes-preferences",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Answer a like question.",
    instruction: "Type a natural answer in Spanish.",
    questionText: "¿Te gusta el fútbol?",
    answerJson: {
      correct: "Sí, me gusta el fútbol.",
      accepted: ["sí, me gusta el fútbol", "si, me gusta el futbol", "me gusta el fútbol", "me gusta el futbol"]
    },
    explanation: "Answer a te gusta question from your view with me gusta.",
    difficulty: 2,
    order: 4,
    xpReward: 16,
    imageKey: "preferences-and-hobbies:3",
    options: []
  },
  {
    slug: "a2-gustar-plural-peliculas",
    lessonSlug: "a2-gustar-plurals-and-infinitives",
    topicSlug: "likes-preferences",
    type: ExerciseType.CLOZE,
    prompt: "Plural liked thing.",
    instruction: "Choose gusta or gustan.",
    questionText: "Me ____ las películas.",
    answerJson: { correct: "gustan", accepted: ["gustan"], goal: "gustar_plural" },
    explanation: "Use gustan because las películas is plural.",
    difficulty: 2,
    order: 1,
    xpReward: 14,
    imageKey: "preferences-and-hobbies:2",
    options: [
      ["gustan", "gustan", true],
      ["gusta", "gusta", false],
      ["prefiero", "prefiero", false]
    ]
  },
  {
    slug: "a2-gustar-infinitive-leer",
    lessonSlug: "a2-gustar-plurals-and-infinitives",
    topicSlug: "likes-preferences",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Activity with gustar.",
    instruction: "Translate the sentence.",
    questionText: "I like to read.",
    answerJson: { correct: "Me gusta leer.", accepted: ["me gusta leer", "me gusta leer."] },
    explanation: "Use gusta before an infinitive activity: Me gusta leer.",
    difficulty: 2,
    order: 2,
    xpReward: 16,
    imageKey: "preferences-and-hobbies:4",
    options: []
  },
  {
    slug: "a2-gustar-encanta-cocinar",
    lessonSlug: "a2-gustar-plurals-and-infinitives",
    topicSlug: "likes-preferences",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build a strong like.",
    instruction: "Put the words in order.",
    questionText: "I love cooking.",
    answerJson: { correctWords: ["Me", "encanta", "cocinar", "."] },
    explanation: "Me encanta cocinar means I love cooking.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "preferences-and-hobbies:5",
    options: [
      ["Me", "Me", false],
      ["encanta", "encanta", false],
      ["cocinar", "cocinar", false],
      [".", ".", false]
    ]
  },
  {
    slug: "a2-gustar-why-gustan",
    lessonSlug: "a2-gustar-plurals-and-infinitives",
    topicSlug: "likes-preferences",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Pattern check.",
    instruction: "Choose the reason.",
    questionText: "Why does Me gustan las películas use gustan?",
    answerJson: { correct: "Because movies are plural.", accepted: ["Because movies are plural", "Because movies are plural."] },
    explanation: "Gustar agrees with the thing liked. Las películas is plural, so use gustan.",
    difficulty: 2,
    order: 4,
    xpReward: 14,
    imageKey: "preferences-and-hobbies:2",
    options: [
      ["Because movies are plural.", "Because movies are plural.", true],
      ["Because me is plural.", "Because me is plural.", false],
      ["Because it is negative.", "Because it is negative.", false]
    ]
  },
  {
    slug: "a2-preferir-yo-prefiero",
    lessonSlug: "a2-preferir-and-favorites",
    topicSlug: "likes-preferences",
    type: ExerciseType.CONJUGATION,
    prompt: "Preferir yo form.",
    instruction: "Write the present yo form.",
    questionText: "Yo ____ el té. (preferir)",
    answerJson: {
      correct: "prefiero",
      accepted: ["prefiero"],
      trainer: { tense: "present", person: "yo", family: "stem-changing", infinitive: "preferir" }
    },
    explanation: "Preferir changes e to ie in the yo form: prefiero.",
    difficulty: 2,
    order: 1,
    xpReward: 16,
    imageKey: "preferences-and-hobbies:9",
    options: []
  },
  {
    slug: "a2-preferir-playa",
    lessonSlug: "a2-preferir-and-favorites",
    topicSlug: "likes-preferences",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Preference.",
    instruction: "Translate the sentence.",
    questionText: "I prefer the beach.",
    answerJson: { correct: "Prefiero la playa.", accepted: ["prefiero la playa", "prefiero la playa."] },
    explanation: "Use prefiero for I prefer: Prefiero la playa.",
    difficulty: 2,
    order: 2,
    xpReward: 16,
    imageKey: "preferences-and-hobbies:10",
    options: []
  },
  {
    slug: "a2-favorite-color-blue",
    lessonSlug: "a2-preferir-and-favorites",
    topicSlug: "likes-preferences",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Favorite.",
    instruction: "Translate the sentence.",
    questionText: "My favorite color is blue.",
    answerJson: { correct: "Mi color favorito es azul.", accepted: ["mi color favorito es azul", "mi color favorito es azul."] },
    explanation: "Color is masculine, so use favorito: Mi color favorito es azul.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "preferences-and-hobbies:12",
    options: []
  },
  {
    slug: "a2-preferir-cafe-te-contrast",
    lessonSlug: "a2-preferir-and-favorites",
    topicSlug: "likes-preferences",
    type: ExerciseType.TRANSFORMATION,
    prompt: "Add a preference.",
    instruction: "Rewrite the sentence so it says you like coffee but prefer tea.",
    questionText: "Me gusta el café.",
    answerJson: {
      correct: "Me gusta el café, pero prefiero el té.",
      accepted: ["me gusta el cafe pero prefiero el te", "me gusta el café, pero prefiero el té", "me gusta el café pero prefiero el té"]
    },
    explanation: "Use pero to contrast a like with a stronger preference.",
    difficulty: 3,
    order: 4,
    xpReward: 20,
    imageKey: "preferences-and-hobbies:7",
    options: []
  },
  {
    slug: "a2-dialogue-que-te-gusta-hacer",
    lessonSlug: "a2-preference-dialogues",
    topicSlug: "likes-preferences",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Hobby answer.",
    instruction: "Type a natural answer in Spanish.",
    questionText: "¿Qué te gusta hacer?",
    answerJson: {
      correct: "Me gusta leer.",
      accepted: ["me gusta leer", "me gusta leer.", "me gusta cocinar", "me gusta cocinar.", "me gusta viajar", "me gusta viajar."]
    },
    explanation: "Answer with me gusta plus an infinitive activity.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "preferences-and-hobbies:4",
    options: []
  },
  {
    slug: "a2-dialogue-prefieres-cafe-te",
    lessonSlug: "a2-preference-dialogues",
    topicSlug: "likes-preferences",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Choose one option.",
    instruction: "Type a natural answer in Spanish.",
    questionText: "¿Prefieres café o té?",
    answerJson: {
      correct: "Prefiero el té.",
      accepted: ["prefiero el te", "prefiero el té", "prefiero el cafe", "prefiero el café"]
    },
    explanation: "Use prefiero plus the option you choose.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "preferences-and-hobbies:9",
    options: []
  },
  {
    slug: "a2-dialogue-color-favorito",
    lessonSlug: "a2-preference-dialogues",
    topicSlug: "likes-preferences",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Favorite answer.",
    instruction: "Answer in Spanish.",
    questionText: "¿Cuál es tu color favorito?",
    answerJson: {
      correct: "Mi color favorito es azul.",
      accepted: ["mi color favorito es azul", "mi color favorito es azul.", "mi color favorito es rojo", "mi color favorito es rojo."]
    },
    explanation: "Use mi color favorito es plus the color.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "preferences-and-hobbies:12",
    options: []
  },
  {
    slug: "a2-dialogue-writing-musica-peliculas",
    lessonSlug: "a2-preference-dialogues",
    topicSlug: "likes-preferences",
    type: ExerciseType.WRITING_PROMPT,
    prompt: "Preference contrast.",
    instruction: "Write the full model sentence.",
    questionText: "Write: I like music, but I prefer movies.",
    answerJson: {
      correct: "Me gusta la música, pero prefiero las películas.",
      accepted: ["me gusta la musica pero prefiero las peliculas", "me gusta la música, pero prefiero las películas"],
      rubric: "Use me gusta, pero, prefiero, and the plural noun las películas."
    },
    explanation: "Use gusta with la música and prefiero with las películas.",
    difficulty: 3,
    order: 4,
    xpReward: 22,
    imageKey: "preferences-and-hobbies:2",
    options: []
  },
  {
    slug: "checkpoint-a2-like-travel",
    lessonSlug: "checkpoint-a2-likes-preferences",
    topicSlug: "likes-preferences",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "A2.3 checkpoint.",
    instruction: "Translate the sentence.",
    questionText: "I like to travel.",
    answerJson: { correct: "Me gusta viajar.", accepted: ["me gusta viajar", "me gusta viajar."] },
    explanation: "Use me gusta before an infinitive: Me gusta viajar.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "preferences-and-hobbies:6",
    options: []
  },
  {
    slug: "checkpoint-a2-gustan-peliculas",
    lessonSlug: "checkpoint-a2-likes-preferences",
    topicSlug: "likes-preferences",
    type: ExerciseType.CLOZE,
    prompt: "A2.3 checkpoint.",
    instruction: "Choose gusta or gustan.",
    questionText: "Me ____ las películas.",
    answerJson: { correct: "gustan", accepted: ["gustan"] },
    explanation: "Use gustan because las películas is plural.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "preferences-and-hobbies:2",
    options: [
      ["gustan", "gustan", true],
      ["gusta", "gusta", false],
      ["gusto", "gusto", false]
    ]
  },
  {
    slug: "checkpoint-a2-prefiero-playa",
    lessonSlug: "checkpoint-a2-likes-preferences",
    topicSlug: "likes-preferences",
    type: ExerciseType.CONJUGATION,
    prompt: "A2.3 checkpoint.",
    instruction: "Write the present yo form.",
    questionText: "Yo ____ la playa. (preferir)",
    answerJson: {
      correct: "prefiero",
      accepted: ["prefiero"],
      trainer: { tense: "present", person: "yo", family: "stem-changing", infinitive: "preferir" }
    },
    explanation: "The yo form is prefiero.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "preferences-and-hobbies:10",
    options: []
  },
  {
    slug: "checkpoint-a2-no-like-rain-builder",
    lessonSlug: "checkpoint-a2-likes-preferences",
    topicSlug: "likes-preferences",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "A2.3 checkpoint.",
    instruction: "Build the sentence.",
    questionText: "I do not like rain.",
    answerJson: { correctWords: ["No", "me", "gusta", "la", "lluvia", "."] },
    explanation: "No goes before me gusta: No me gusta la lluvia.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "preferences-and-hobbies:8",
    options: [
      ["No", "No", false],
      ["me", "me", false],
      ["gusta", "gusta", false],
      ["la", "la", false],
      ["lluvia", "lluvia", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-a2-weekend-preference",
    lessonSlug: "checkpoint-a2-likes-preferences",
    topicSlug: "likes-preferences",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "A2.3 checkpoint.",
    instruction: "Answer with a hobby or activity.",
    questionText: "¿Qué te gusta hacer el fin de semana?",
    answerJson: {
      correct: "Me gusta viajar.",
      accepted: ["me gusta viajar", "me gusta viajar.", "me gusta leer", "me gusta leer.", "me gusta cocinar", "me gusta cocinar."]
    },
    explanation: "Use me gusta plus an infinitive activity.",
    difficulty: 2,
    order: 5,
    xpReward: 20,
    imageKey: "preferences-and-hobbies:14",
    options: []
  },
  {
    slug: "scenario-restaurant-table-for-two",
    lessonSlug: "scenario-restaurant-order",
    topicSlug: "scenario-practice",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Restaurant opening.",
    instruction: "Reply as the customer.",
    questionText: "El camarero dice: Buenas tardes. ¿Cuántas personas?",
    answerJson: {
      correct: "Una mesa para dos, por favor.",
      accepted: ["una mesa para dos por favor", "una mesa para dos, por favor", "somos dos", "somos dos, por favor"],
      scenario: { setting: "restaurant", partner: "Camarero", learnerRole: "Cliente", goal: "Ask for a table for two." }
    },
    explanation: "Una mesa para dos, por favor is a polite restaurant reply.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "food-and-ordering:19",
    options: []
  },
  {
    slug: "scenario-restaurant-recommend",
    lessonSlug: "scenario-restaurant-order",
    topicSlug: "scenario-practice",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Ask for a recommendation.",
    instruction: "Ask the waiter what they recommend.",
    questionText: "El camarero dice: Tenemos sopa y pollo.",
    answerJson: {
      correct: "¿Qué recomienda?",
      accepted: ["que recomienda", "qué recomienda", "¿qué recomienda?"],
      scenario: { setting: "restaurant", partner: "Camarero", learnerRole: "Cliente", goal: "Ask for a recommendation." }
    },
    explanation: "¿Qué recomienda? is a concise polite question with usted.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "food-and-ordering:17",
    options: []
  },
  {
    slug: "scenario-restaurant-para-llevar",
    lessonSlug: "scenario-restaurant-order",
    topicSlug: "scenario-practice",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "To go or here.",
    instruction: "Answer that it is to go.",
    questionText: "¿Para aquí o para llevar?",
    answerJson: {
      correct: "Para llevar, por favor.",
      accepted: ["para llevar", "para llevar por favor", "para llevar, por favor"],
      scenario: { setting: "restaurant", partner: "Camarero", learnerRole: "Cliente", goal: "Say the order is to go." }
    },
    explanation: "Para llevar means to go.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "food-and-ordering:20",
    options: []
  },
  {
    slug: "scenario-restaurant-bill",
    lessonSlug: "scenario-restaurant-order",
    topicSlug: "scenario-practice",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Close the meal.",
    instruction: "Ask for the bill.",
    questionText: "The bill, please.",
    answerJson: {
      correct: "La cuenta, por favor.",
      accepted: ["la cuenta por favor", "la cuenta, por favor"]
    },
    explanation: "La cuenta, por favor is the standard short phrase for asking for the bill.",
    difficulty: 1,
    order: 4,
    xpReward: 16,
    imageKey: "food-and-ordering:18",
    options: []
  },
  {
    slug: "scenario-travel-ask-station",
    lessonSlug: "scenario-travel-directions",
    topicSlug: "scenario-practice",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Ask directions.",
    instruction: "Ask politely where the station is.",
    questionText: "You need the station.",
    answerJson: {
      correct: "Perdón, ¿dónde está la estación?",
      accepted: ["perdon donde esta la estacion", "perdón dónde está la estación", "perdón, ¿dónde está la estación?"],
      scenario: { setting: "street", partner: "Persona local", learnerRole: "Viajero", goal: "Ask where the station is." }
    },
    explanation: "Start with perdón, then ask ¿dónde está la estación?",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "city-transport:7",
    options: []
  },
  {
    slug: "scenario-travel-siga-derecho",
    lessonSlug: "scenario-travel-directions",
    topicSlug: "scenario-practice",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Understand directions.",
    instruction: "Choose the meaning.",
    questionText: "Siga derecho.",
    answerJson: { correct: "Go straight.", accepted: ["Go straight", "Go straight."] },
    explanation: "Siga derecho means go straight in polite directions.",
    difficulty: 1,
    order: 2,
    xpReward: 14,
    imageKey: "city-transport:14",
    options: [
      ["Go straight.", "Go straight.", true],
      ["Turn left.", "Turn left.", false],
      ["Go back.", "Go back.", false]
    ]
  },
  {
    slug: "scenario-travel-repeat-builder",
    lessonSlug: "scenario-travel-directions",
    topicSlug: "scenario-practice",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Repair phrase.",
    instruction: "Build the polite question.",
    questionText: "Can you repeat, please?",
    answerJson: { correctWords: ["¿", "Puede", "repetir", ",", "por", "favor", "?"] },
    explanation: "Use puede repetir when you need someone to repeat.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "conversation-and-opinion:7",
    options: [
      ["¿", "¿", false],
      ["Puede", "Puede", false],
      ["repetir", "repetir", false],
      [",", ",", false],
      ["por", "por", false],
      ["favor", "favor", false],
      ["?", "?", false]
    ]
  },
  {
    slug: "scenario-travel-hotel-near-station",
    lessonSlug: "scenario-travel-directions",
    topicSlug: "scenario-practice",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Location detail.",
    instruction: "Translate the sentence.",
    questionText: "The hotel is near the station.",
    answerJson: {
      correct: "El hotel está cerca de la estación.",
      accepted: ["el hotel esta cerca de la estacion", "el hotel está cerca de la estación"]
    },
    explanation: "Use está for location: El hotel está cerca de la estación.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "city-transport:13",
    options: []
  },
  {
    slug: "scenario-pharmacy-head-hurts",
    lessonSlug: "scenario-pharmacy-help",
    topicSlug: "scenario-practice",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Symptom.",
    instruction: "Translate the sentence.",
    questionText: "My head hurts.",
    answerJson: { correct: "Me duele la cabeza.", accepted: ["me duele la cabeza", "me duele la cabeza."] },
    explanation: "Use me duele with one thing that hurts.",
    difficulty: 2,
    order: 1,
    xpReward: 18,
    imageKey: "body-and-health:7",
    options: []
  },
  {
    slug: "scenario-pharmacy-need-medicine",
    lessonSlug: "scenario-pharmacy-help",
    topicSlug: "scenario-practice",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "Ask for medicine.",
    instruction: "Reply to the pharmacist.",
    questionText: "La farmacéutica dice: ¿Qué necesita?",
    answerJson: {
      correct: "Necesito medicina para el dolor.",
      accepted: ["necesito medicina para el dolor", "necesito medicina para el dolor."],
      scenario: { setting: "pharmacy", partner: "Farmacéutica", learnerRole: "Cliente", goal: "Ask for pain medicine." }
    },
    explanation: "Necesito medicina para el dolor is a clear pharmacy request.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "body-and-health:13",
    options: []
  },
  {
    slug: "scenario-pharmacy-allergy",
    lessonSlug: "scenario-pharmacy-help",
    topicSlug: "scenario-practice",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Safety detail.",
    instruction: "Translate the sentence.",
    questionText: "I have an allergy to aspirin.",
    answerJson: { correct: "Tengo alergia a la aspirina.", accepted: ["tengo alergia a la aspirina", "tengo alergia a la aspirina."] },
    explanation: "Use tengo alergia a plus the medicine or substance.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "body-and-health:13",
    options: []
  },
  {
    slug: "scenario-pharmacy-how-often",
    lessonSlug: "scenario-pharmacy-help",
    topicSlug: "scenario-practice",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Medicine frequency.",
    instruction: "Ask the question in Spanish.",
    questionText: "How often do I take the medicine?",
    answerJson: { correct: "¿Cada cuánto tomo la medicina?", accepted: ["cada cuanto tomo la medicina", "cada cuánto tomo la medicina", "¿cada cuánto tomo la medicina?"] },
    explanation: "¿Cada cuánto? asks how often.",
    difficulty: 3,
    order: 4,
    xpReward: 20,
    imageKey: "body-and-health:13",
    options: []
  },
  {
    slug: "lab-reading-ana-works-when",
    lessonSlug: "lab-a2-cafe-reading",
    topicSlug: "input-comprehension",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Reading detail.",
    instruction: "Answer from the text.",
    questionText: "When does Ana work?",
    answerJson: { correct: "In the morning.", accepted: ["In the morning", "In the morning."] },
    explanation: "The text says Ana trabaja por la mañana.",
    difficulty: 1,
    order: 1,
    xpReward: 14,
    imageKey: "reading-and-listening-lab:1",
    options: [
      ["In the morning.", "In the morning.", true],
      ["At night.", "At night.", false],
      ["On Sunday.", "On Sunday.", false]
    ]
  },
  {
    slug: "lab-reading-ana-prefers-tea",
    lessonSlug: "lab-a2-cafe-reading",
    topicSlug: "input-comprehension",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Reading contrast.",
    instruction: "Answer from the text.",
    questionText: "What does Ana prefer in the afternoon?",
    answerJson: { correct: "Tea.", accepted: ["Tea", "Tea."] },
    explanation: "The text says she likes coffee, but prefers tea in the afternoon.",
    difficulty: 1,
    order: 2,
    xpReward: 14,
    imageKey: "preferences-and-hobbies:9",
    options: [
      ["Tea.", "Tea.", true],
      ["Rain.", "Rain.", false],
      ["Soccer.", "Soccer.", false]
    ]
  },
  {
    slug: "lab-reading-cafe-location",
    lessonSlug: "lab-a2-cafe-reading",
    topicSlug: "input-comprehension",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Reading detail.",
    instruction: "Answer in Spanish.",
    questionText: "Where is the cafe?",
    answerJson: {
      correct: "Está cerca de la estación.",
      accepted: ["esta cerca de la estacion", "está cerca de la estación", "el cafe esta cerca de la estacion", "el café está cerca de la estación"]
    },
    explanation: "The text says the cafe is near the station.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "places-around-town:1",
    options: []
  },
  {
    slug: "lab-reading-summary-ana",
    lessonSlug: "lab-a2-cafe-reading",
    topicSlug: "input-comprehension",
    type: ExerciseType.WRITING_PROMPT,
    prompt: "Reading summary.",
    instruction: "Write the model summary.",
    questionText: "Summarize: Ana works, goes to a cafe, and prefers tea.",
    answerJson: {
      correct: "Ana trabaja, va a un café y prefiere el té.",
      accepted: ["ana trabaja va a un cafe y prefiere el te", "ana trabaja, va a un café y prefiere el té"],
      rubric: "Mention Ana, trabaja, va a un café, and prefiere el té."
    },
    explanation: "A good summary keeps the main actions and the preference.",
    difficulty: 3,
    order: 4,
    xpReward: 22,
    imageKey: "reading-and-listening-lab:7",
    options: []
  },
  {
    slug: "lab-listening-manana-tienda-dictation",
    lessonSlug: "lab-a2-weekend-listening",
    topicSlug: "input-comprehension",
    type: ExerciseType.LISTENING_DICTATION,
    prompt: "Listening dictation.",
    instruction: "Listen and type the sentence.",
    questionText: "Type what you hear.",
    answerJson: {
      correct: "Mañana voy a la tienda.",
      accepted: ["manana voy a la tienda", "mañana voy a la tienda"],
      audioText: "Mañana voy a la tienda."
    },
    explanation: "The sentence is Mañana voy a la tienda.",
    difficulty: 2,
    order: 1,
    xpReward: 20,
    imageKey: "reading-and-listening-lab:2",
    options: []
  },
  {
    slug: "lab-listening-buy-what",
    lessonSlug: "lab-a2-weekend-listening",
    topicSlug: "input-comprehension",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Listening detail.",
    instruction: "Answer from the audio.",
    questionText: "What does the speaker have to buy?",
    answerJson: { correct: "Bread and a bag.", accepted: ["Bread and a bag", "Bread and a bag."] },
    explanation: "The audio says Tengo que comprar pan y una bolsa.",
    difficulty: 1,
    order: 2,
    xpReward: 14,
    imageKey: "food-and-ordering:3",
    options: [
      ["Bread and a bag.", "Bread and a bag.", true],
      ["Tea and a ticket.", "Tea and a ticket.", false],
      ["Medicine and water.", "Medicine and water.", false]
    ]
  },
  {
    slug: "lab-listening-after-store",
    lessonSlug: "lab-a2-weekend-listening",
    topicSlug: "input-comprehension",
    type: ExerciseType.SHORT_ANSWER,
    prompt: "Listening sequence.",
    instruction: "Answer in Spanish.",
    questionText: "After the store, what does the speaker want to do?",
    answerJson: {
      correct: "Quiere escuchar música en casa.",
      accepted: ["quiere escuchar musica en casa", "quiere escuchar música en casa", "escuchar musica en casa", "escuchar música en casa"]
    },
    explanation: "The audio says Después quiero escuchar música en casa.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "reading-and-listening-lab:2",
    options: []
  },
  {
    slug: "lab-listening-night-book-builder",
    lessonSlug: "lab-a2-weekend-listening",
    topicSlug: "input-comprehension",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Listening sentence.",
    instruction: "Build the sentence.",
    questionText: "At night I am going to read a book.",
    answerJson: { correctWords: ["Por", "la", "noche", "voy", "a", "leer", "un", "libro", "."] },
    explanation: "Por la noche sets the time, and voy a leer gives the plan.",
    difficulty: 2,
    order: 4,
    xpReward: 18,
    imageKey: "reading-and-listening-lab:3",
    options: [
      ["Por", "Por", false],
      ["la", "la", false],
      ["noche", "noche", false],
      ["voy", "voy", false],
      ["a", "a", false],
      ["leer", "leer", false],
      ["un", "un", false],
      ["libro", "libro", false],
      [".", ".", false]
    ]
  },
  {
    slug: "checkpoint-a2-scenario-order-coffee",
    lessonSlug: "checkpoint-a2-scenarios-input",
    topicSlug: "scenario-practice",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "A2.4 checkpoint.",
    instruction: "Order politely.",
    questionText: "Order two coffees to go.",
    answerJson: {
      correct: "Quisiera dos cafés para llevar.",
      accepted: ["quisiera dos cafes para llevar", "quisiera dos cafés para llevar", "dos cafes para llevar por favor"],
      scenario: { setting: "restaurant", partner: "Camarero", learnerRole: "Cliente", goal: "Order two coffees to go." }
    },
    explanation: "Quisiera is polite, and para llevar means to go.",
    difficulty: 2,
    order: 1,
    xpReward: 20,
    imageKey: "food-and-ordering:20",
    options: []
  },
  {
    slug: "checkpoint-a2-scenario-ask-station",
    lessonSlug: "checkpoint-a2-scenarios-input",
    topicSlug: "scenario-practice",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "A2.4 checkpoint.",
    instruction: "Ask for directions.",
    questionText: "Ask where the station is.",
    answerJson: {
      correct: "Perdón, ¿dónde está la estación?",
      accepted: ["perdon donde esta la estacion", "perdón dónde está la estación", "perdón, ¿dónde está la estación?"],
      scenario: { setting: "street", partner: "Persona local", learnerRole: "Viajero", goal: "Ask where the station is." }
    },
    explanation: "Use perdón plus ¿dónde está la estación?",
    difficulty: 2,
    order: 2,
    xpReward: 20,
    imageKey: "city-transport:7",
    options: []
  },
  {
    slug: "checkpoint-a2-scenario-medicine",
    lessonSlug: "checkpoint-a2-scenarios-input",
    topicSlug: "scenario-practice",
    type: ExerciseType.DIALOGUE_REPLY,
    prompt: "A2.4 checkpoint.",
    instruction: "Ask for pharmacy help.",
    questionText: "Say you need medicine for pain.",
    answerJson: {
      correct: "Necesito medicina para el dolor.",
      accepted: ["necesito medicina para el dolor", "necesito medicina para el dolor."],
      scenario: { setting: "pharmacy", partner: "Farmacéutica", learnerRole: "Cliente", goal: "Ask for pain medicine." }
    },
    explanation: "Necesito medicina para el dolor is direct and clear.",
    difficulty: 2,
    order: 3,
    xpReward: 20,
    imageKey: "body-and-health:12",
    options: []
  },
  {
    slug: "checkpoint-a2-input-dictation",
    lessonSlug: "checkpoint-a2-scenarios-input",
    topicSlug: "input-comprehension",
    type: ExerciseType.LISTENING_DICTATION,
    prompt: "A2.4 checkpoint.",
    instruction: "Listen and type the sentence.",
    questionText: "Type what you hear.",
    answerJson: {
      correct: "Mañana voy a la tienda.",
      accepted: ["manana voy a la tienda", "mañana voy a la tienda"],
      audioText: "Mañana voy a la tienda."
    },
    explanation: "The sentence is Mañana voy a la tienda.",
    difficulty: 2,
    order: 4,
    xpReward: 20,
    imageKey: "reading-and-listening-lab:2",
    options: []
  },
  {
    slug: "checkpoint-a2-reading-preference",
    lessonSlug: "checkpoint-a2-scenarios-input",
    topicSlug: "input-comprehension",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "A2.4 checkpoint.",
    instruction: "Answer from the reading lab text.",
    questionText: "In the cafe text, what does Ana prefer in the afternoon?",
    answerJson: { correct: "Tea.", accepted: ["Tea", "Tea."] },
    explanation: "The text says Ana likes coffee, but prefers tea in the afternoon.",
    difficulty: 1,
    order: 5,
    xpReward: 16,
    imageKey: "preferences-and-hobbies:9",
    options: [
      ["Tea.", "Tea.", true],
      ["Coffee.", "Coffee.", false],
      ["Rain.", "Rain.", false]
    ]
  }
];

const badges = [
  ["on-fire", "On Fire", "Practice three days in a row.", "flame", 3],
  ["grammar-guru", "Grammar Guru", "Complete five grammar exercises.", "book-open", 5],
  ["challenge-ace", "Challenge Ace", "Finish a weekly challenge.", "trophy", 1],
  ["article-scout", "Article Scout", "Master your first article exercise.", "badge-check", 1]
];

const assetPrompts = [
  {
    slug: "quantities-and-clear-colors",
    title: "Quantities and Clear Colors",
    category: "Vocabulary",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/quantities-and-clear-colors.webp",
    promptMarkdown: "5x5 exact quantities and colors sheet. Cells include one through ten blue counting disks, six grapes, seven books, eight apples, nine strawberries, yellow and white shirts, black backpack, six isolated color tiles, a red tomato and apple, and compact masculine/feminine color pairs."
  },
  {
    slug: "subject-pronouns-and-roles",
    title: "Subject Pronouns and Roles",
    category: "Grammar",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/subject-pronouns-and-roles.webp",
    promptMarkdown: "4x4 subject pronoun and role sheet. Cells distinguish yo, tú, él, ella, nosotros, and ellos, followed by a person, friends, students, teachers, a family, a group, and a speaking pair."
  },
  {
    slug: "communication-repair",
    title: "Communication Repair and Politeness",
    category: "Situations",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/communication-repair.webp",
    promptMarkdown: "4x4 communication sheet. Cells include hello, introducing a name and origin, thanks, please, apology, excuse me, not understanding, slower speech, repetition, help, asking a price, requesting the bill, a recommendation, goodbye, and successful understanding."
  },
  {
    slug: "directions-and-question-intents",
    title: "Directions and Question Intents",
    category: "Situations",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/directions-and-question-intents.webp",
    promptMarkdown: "5x5 navigation and question-intent sheet. Cells include straight, left, right, near, far, address and map help, hotel, station, museum, restaurant, street scenes, route gestures, and qué, quién, dónde, cuándo, cómo, and cuánto concepts."
  },
  {
    slug: "pharmacy-and-medicine",
    title: "Pharmacy and Medicine",
    category: "Situations",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/pharmacy-and-medicine.webp",
    promptMarkdown: "4x4 pharmacy and medicine sheet. Cells include generic medicine, pharmacist interactions, headache, foot and body pain, medicine allergy, dosage frequency, morning and evening doses, a doctor conversation, medicine instructions, rest, and taking a pill with water."
  },
  {
    slug: "object-location-scenes",
    title: "Exact Object Location Scenes",
    category: "Grammar",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/object-location-scenes.webp",
    promptMarkdown: "5x5 exact location sheet. Cells show named objects on, under, or beside furniture; animals and places; people inside common destinations; near and far landmarks; and a suitcase beside a hotel-room door."
  },
  {
    slug: "wants-needs-and-possession",
    title: "Wants, Needs, and Possession",
    category: "Situations",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/wants-needs-and-possession.webp",
    promptMarkdown: "4x4 practical verb-frame sheet. Cells show having or lacking a map, needing keys or a passport, having a key, backpack, or passport, wanting water, coffee, or an orange, needing a table, help, taxi, or doctor, bringing a bag, and giving a book."
  },
  {
    slug: "classroom-basics",
    title: "Classroom Basics",
    category: "Vocabulary",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/classroom-basics.webp",
    promptMarkdown: "4x4 classroom vocabulary sheet. Cells include student, teacher, book, pencil, desk, chair, clock, school bag, whiteboard, library shelf, ruler, eraser, globe, pen cup, worksheet, classroom corner."
  },
  {
    slug: "daily-actions",
    title: "Daily Actions",
    category: "Verbs",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/daily-actions.webp",
    promptMarkdown: "5x5 daily action verb sheet. Cells include speaking, studying, working, buying, walking, listening, reading, writing, cooking, cleaning, opening, closing, waiting, looking, asking, answering, drinking, eating, traveling, paying, calling, watching, practicing, resting, celebrating."
  },
  {
    slug: "places-around-town",
    title: "Places Around Town",
    category: "Situations",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/places-around-town.webp",
    promptMarkdown: "4x4 places sheet. Cells include cafe, store, park, station, library, classroom, kitchen, bedroom, office, restaurant, bus stop, airport gate, pharmacy, hotel reception, museum, beach walkway."
  },
  {
    slug: "food-and-ordering",
    title: "Food and Ordering",
    category: "Vocabulary",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/food-and-ordering.webp",
    promptMarkdown: "5x5 food and restaurant sheet. Cells include water, coffee, bread, rice, soup, apple, banana, orange, tomato, cheese, fish, chicken, salad, sandwich, dessert, waiter, customer with menu, paying bill, table, market stand, cooking pot, cutlery, basket, breakfast, family dinner."
  },
  {
    slug: "fruit-and-produce",
    title: "Fruit and Produce",
    category: "Vocabulary",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/fruit-and-produce.webp",
    promptMarkdown: "5x5 fruit and produce sheet. Cells include apple, banana, orange, lemon, strawberry, grapes, pear, peach, pineapple, watermelon, tomato, potato, carrot, onion, lettuce, cucumber, pepper, corn, garlic, mixed fruit basket, market stand, vegetables on board, grocery bag, salad, smoothie."
  },
  {
    slug: "clothing-basics",
    title: "Clothing Basics",
    category: "Vocabulary",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/clothing-basics.webp",
    promptMarkdown: "5x5 clothing vocabulary sheet. Cells include shirt, t-shirt, pants, jeans, dress, skirt, jacket, coat, sweater, shoes, socks, hat, scarf, gloves, belt, backpack, glasses, watch, pajamas, suit, raincoat, sandals, boots, shorts, laundry basket."
  },
  {
    slug: "home-objects",
    title: "Home Objects",
    category: "Vocabulary",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/home-objects.webp",
    promptMarkdown: "5x5 home objects sheet. Cells include table, chair, bed, sofa, door, window, lamp, key, mirror, rug, kitchen, bathroom sink, shower, refrigerator, oven, plate, cup, spoon, knife, fork, towel, pillow, blanket, shelf, plant."
  },
  {
    slug: "city-transport",
    title: "City Transport",
    category: "Situations",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/city-transport.webp",
    promptMarkdown: "4x4 city transport sheet. Cells include bus, train, taxi, bicycle, subway entrance, airport gate, train platform, bus stop, ticket machine, suitcase, passport, map, hotel, street corner, crosswalk, plaza."
  },
  {
    slug: "weather-and-time",
    title: "Weather and Time",
    category: "Vocabulary",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/weather-and-time.webp",
    promptMarkdown: "4x4 weather and time sheet. Cells include sunny, rainy, cloudy, windy, snowy, hot, cold, morning, afternoon, evening, night, calendar, clock, umbrella, sunglasses, scarf."
  },
  {
    slug: "body-and-health",
    title: "Body and Health",
    category: "Vocabulary",
    gridSize: 4,
    canvasSize: 1200,
    imagePath: "/images/body-and-health.webp",
    promptMarkdown: "4x4 body and health sheet. Cells include head, hand, eye, mouth, foot, full body, headache, cold, hot, hungry, thirsty, doctor, pharmacy, first-aid kit, bed rest, and drinking water."
  },
  {
    slug: "numbers-and-colors",
    title: "Numbers and Colors",
    category: "Vocabulary",
    gridSize: 4,
    canvasSize: 1200,
    imagePath: "/images/numbers-and-colors.webp",
    promptMarkdown: "4x4 numbers and colors sheet. Cells include one apple, two apples, three books, four grapes, five objects, red tomato, red apple, blue shirt, green salad, yellow banana, white bread, black coffee, colorful clothes, mixed fruit, colored pencils, and color swatches."
  },
  {
    slug: "nature-and-animals",
    title: "Nature and Animals",
    category: "Vocabulary",
    gridSize: 4,
    canvasSize: 1200,
    imagePath: "/images/nature-and-animals.webp",
    promptMarkdown: "4x4 nature and animals sheet. Cells include tree, flower, dog, cat, bird, sun, rain, beach, water, park, walking outside, family in park, picnic, garden path, cloud, and person enjoying nature."
  },
  {
    slug: "people-and-family",
    title: "People and Family",
    category: "Vocabulary",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/people-and-family.webp",
    promptMarkdown: "4x4 people and family sheet. Cells include person, friend greeting, student, teacher, mother, father, siblings, grandparent, family group, worker, doctor, waiter, traveler, customer, neighbor, group conversation."
  },
  {
    slug: "identity-and-introductions",
    title: "Identity and Introductions",
    category: "Situations",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/identity-and-introductions.webp",
    promptMarkdown: "4x4 self-introduction and identity sheet centered on Ana. Cells include Ana portrait, Ana introducing herself, cafe introduction, blank ID card, first-person gesture, one-on-one conversation, woman at home, student identity, tired Ana, morning work, choosing tea at cafe, travel origin, hello greeting, group conversation, counter introduction, and successful introduction."
  },
  {
    slug: "emotions-and-states",
    title: "Emotions and States",
    category: "Adjectives",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/emotions-and-states.webp",
    promptMarkdown: "4x4 emotions and temporary states sheet. Cells include happy, sad, tired, nervous, calm, busy, sick, surprised, angry, confused, excited, bored, hungry, thirsty, cold, hot."
  },
  {
    slug: "grammar-scenes",
    title: "Grammar Scenes",
    category: "Grammar",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/grammar-scenes.webp",
    promptMarkdown: "4x4 grammar concept sheet. Cells include identity, profession, origin, location, temporary state, permanent trait, gender agreement, plural agreement, conjugation, sentence order, questions, negation, preposition on, preposition under, preposition beside, time expression."
  },
  {
    slug: "travel-and-survival",
    title: "Travel and Survival",
    category: "Situations",
    gridSize: 5,
    canvasSize: 1254,
    imagePath: "/images/travel-and-survival.webp",
    promptMarkdown: "5x5 travel situations sheet. Cells include directions, hotel check-in, ordering coffee, buying train ticket, map, packing, airport security, taxi, museum, card payment, asking for bathroom, lost traveler, meeting local, landmark photo, bike rental, menu, shopping bags, waiting in line, asking price, receipt, bus boarding, platform search, hotel room door, plaza, successful conversation."
  },
  {
    slug: "rewards-and-progress",
    title: "Rewards and Progress",
    category: "Rewards",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/rewards-and-progress.webp",
    promptMarkdown: "4x4 rewards and progress sheet. Cells include flame badge, book badge, trophy badge, medal badge, XP star, calendar, path, rocket, shield, puzzle, check sparkle, crown, mystery badge, unlocked badge, target, celebration."
  },
  {
    slug: "minigame-ui-rewards",
    title: "Mini Game UI Rewards",
    category: "Rewards",
    gridSize: 4,
    canvasSize: 1200,
    imagePath: "/images/minigame-ui-rewards.webp",
    promptMarkdown: "4x4 mini-game UI rewards sheet. Cells include falling word card, catch basket, timer, life heart, correct glow, missed answer, combo flame, trophy, arena, target card, speed boost, focus icon, confetti, replay arrow, locked badge, and unlocked badge."
  },
  {
    slug: "a2-daily-routine",
    title: "A2 Daily Routine",
    category: "A2 Vocabulary",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/a2-daily-routine.png",
    promptMarkdown: "4x4 daily routine sheet. Cells include wake up, get up, shower, brush teeth, get dressed, eat breakfast, go to work, study, cook dinner, clean room, go to bed, read at night, morning clock, afternoon clock, weekly calendar, and tired after work."
  },
  {
    slug: "irregular-verbs",
    title: "A2 Irregular Verbs",
    category: "A2 Verbs",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/irregular-verbs.webp",
    promptMarkdown: "4x4 irregular verbs sheet. Cells include go to a store, come home, leave a house, put object on table, bring a bag, say something, do homework, make food, see a sign, hear music, know a fact, meet a person, can open a door, want a ticket, have to work, and give an item."
  },
  {
    slug: "preferences-and-hobbies",
    title: "A2 Preferences and Hobbies",
    category: "A2 Vocabulary",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/preferances-and-hobbies.webp",
    promptMarkdown: "4x4 preferences and hobbies sheet. Cells include likes music, likes movies, likes soccer, likes reading, likes cooking, likes travel, likes coffee, dislikes rain, prefers tea, prefers the beach, favorite restaurant, favorite color, hobby class, weekend activity, bored person, and excited person."
  },
  {
    slug: "object-pronouns-and-shopping",
    title: "A2 Object Pronouns and Shopping",
    category: "A2 Grammar",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/object-pronouns-and-shopping.webp",
    promptMarkdown: "4x4 object pronouns and shopping sheet. Cells include buying bread, buying apples, giving a book, giving keys, showing a map, seeing a movie, reading a menu, calling a friend, writing a message, paying a bill, carrying bags, returning an item, asking for help, offering water, sending a photo, and receiving a package."
  },
  {
    slug: "past-events",
    title: "A2 Past Events",
    category: "A2 Grammar",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/past-events.webp",
    promptMarkdown: "4x4 past events sheet. Cells include yesterday at cafe, last week trip, childhood home, old school, person was tired, person went to station, person bought food, person met a friend, rain during trip, lost passport, found keys, called doctor, took bus, worked yesterday, studied last night, and walked in park."
  },
  {
    slug: "conversation-and-opinion",
    title: "B1 Conversation and Opinion",
    category: "B1 Communication",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/conversation-and-opinion.webp",
    promptMarkdown: "4x4 conversation and opinion sheet. Cells include two people discussing plans, explaining a problem, giving opinion, friendly disagreement, work meeting, phone call, asking for clarification, apologizing, making a recommendation, comparing options, reading news, writing email, presenting idea, planning a trip, interview conversation, and group discussion."
  },
  {
    slug: "reading-and-listening-lab",
    title: "Reading and Listening Lab",
    category: "Comprehension",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/reading-ad-listening-lab.webp",
    promptMarkdown: "4x4 reading and listening lab sheet. Cells include reading short article, listening with headphones, transcript document, highlighted vocabulary, comprehension question, notebook summary, audio waveform, podcast scene, news article, story page, dictionary lookup, saved word list, corrected writing, listening quiz, reading progress, and study desk."
  }
];

const exerciseImageOverrides = {
  "intro-hola-means-hello": "communication-repair:1",
  "intro-me-llamo-ana": "communication-repair:2",
  "intro-soy-de-austria": "communication-repair:3",
  "intro-correct-estoy-de-austria": "communication-repair:3",
  "intro-scenario-cafe-greeting": "communication-repair:2",
  "zero-yo-means-i": "subject-pronouns-and-roles:1",
  "zero-tu-means-you": "subject-pronouns-and-roles:3",
  "zero-el-means-he": "subject-pronouns-and-roles:4",
  "zero-ella-means-she": "subject-pronouns-and-roles:5",
  "zero-speaker-pronoun": "subject-pronouns-and-roles:1",
  "zero-listener-pronoun": "subject-pronouns-and-roles:3",
  "zero-accented-el-pronoun": "subject-pronouns-and-roles:4",
  "travel-donde-hotel": "directions-and-question-intents:9",
  "travel-estacion-cerca": "directions-and-question-intents:4",
  "travel-necesito-taxi": "wants-needs-and-possession:13",
  "location-libro-mesa": "object-location-scenes:1",
  "location-llaves-cocina": "object-location-scenes:3",
  "location-build-mochila": "object-location-scenes:2",
  "questions-que-quieres": "directions-and-question-intents:20",
  "questions-cuanto-cuesta": "directions-and-question-intents:25",
  "questions-donde-estacion": "directions-and-question-intents:10",
  "negation-no-entiendo": "communication-repair:8",
  "negation-no-tengo-mapa": "wants-needs-and-possession:2",
  "tener-tengo-mapa": "wants-needs-and-possession:1",
  "tener-necesito-ayuda": "wants-needs-and-possession:12",
  "tener-tenemos-mesa": "wants-needs-and-possession:11",
  "food-sentence-cuenta": "communication-repair:13",
  "restaurant-no-entiendo-menu": "communication-repair:8",
  "restaurant-cuanto-postre": "communication-repair:12",
  "checkpoint-travel-question": "directions-and-question-intents:10",
  "checkpoint-repair-phrase": "communication-repair:8",
  "checkpoint-a1-survival-hotel": "directions-and-question-intents:9",
  "checkpoint-a1-survival-need-taxi": "wants-needs-and-possession:13",
  "checkpoint-a1-survival-no-map": "wants-needs-and-possession:2",
  "checkpoint-a1-daily-repair": "communication-repair:8",
  "checkpoint-a1-blocks-cafe-location": "object-location-scenes:16",
  "checkpoint-a1-frames-price-question": "communication-repair:12",
  "checkpoint-a1-frames-book-table": "object-location-scenes:1",
  "checkpoint-a1-health-doctor-reply": "pharmacy-and-medicine:3",
  "scenario-restaurant-table-for-two": "wants-needs-and-possession:11",
  "scenario-restaurant-recommend": "communication-repair:14",
  "scenario-restaurant-bill": "communication-repair:13",
  "scenario-travel-ask-station": "directions-and-question-intents:7",
  "scenario-travel-siga-derecho": "directions-and-question-intents:1",
  "scenario-travel-repeat-builder": "communication-repair:10",
  "scenario-travel-hotel-near-station": "object-location-scenes:23",
  "scenario-pharmacy-head-hurts": "pharmacy-and-medicine:4",
  "scenario-pharmacy-need-medicine": "pharmacy-and-medicine:3",
  "scenario-pharmacy-allergy": "pharmacy-and-medicine:7",
  "scenario-pharmacy-how-often": "pharmacy-and-medicine:9",
  "checkpoint-a2-scenario-medicine": "pharmacy-and-medicine:3"
};

function slugifyText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sentenceCase(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function normalizeSeedLesson(lesson) {
  const themeKey = slugifyText(lesson.theme);
  const conceptKeys = lesson.conceptKeys?.length
    ? lesson.conceptKeys
    : [...new Set([lesson.topicSlug, themeKey, lesson.cefrLevel?.toLowerCase()].filter(Boolean))];
  const outcomes = lesson.outcomes?.length
    ? lesson.outcomes
    : [
        `You can state the main ${lesson.theme.toLowerCase()} rule in your own words.`,
        `You can use the model sentence for ${lesson.situation} without seeing the answer first.`,
        "You can name the common mistake this lesson is trying to prevent."
      ];

  return {
    ...lesson,
    outcomes,
    conceptKeys,
    reviewSummary: lesson.reviewSummary || `You practiced ${sentenceCase(lesson.summary)}`
  };
}

async function upsertExercise(exercise, lessonBySlug, topicBySlug) {
  const lesson = lessonBySlug.get(exercise.lessonSlug);
  const topic = topicBySlug.get(exercise.topicSlug);
  const imageKey = exerciseImageOverrides[exercise.slug] || exercise.imageKey || null;

  const saved = await prisma.exercise.upsert({
    where: { slug: exercise.slug },
    update: {
      lessonId: lesson.id,
      topicId: topic.id,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      questionText: exercise.questionText,
      answerJson: exercise.answerJson,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty,
      order: exercise.order,
      xpReward: exercise.xpReward,
      imageKey
    },
    create: {
      slug: exercise.slug,
      lessonId: lesson.id,
      topicId: topic.id,
      type: exercise.type,
      prompt: exercise.prompt,
      instruction: exercise.instruction,
      questionText: exercise.questionText,
      answerJson: exercise.answerJson,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty,
      order: exercise.order,
      xpReward: exercise.xpReward,
      imageKey
    }
  });

  await prisma.exerciseOption.deleteMany({ where: { exerciseId: saved.id } });
  if (exercise.options.length > 0) {
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
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: Role.ADMIN, name: "Admin" },
      create: {
        email: adminEmail,
        name: "Admin",
        role: Role.ADMIN,
        passwordHash: await hashPassword(adminPassword),
        xp: 1250,
        level: levelForXp(1250),
        streakDays: 23,
        lastPracticeDate: new Date()
      }
    });
  }

  for (const topic of topics) {
    await prisma.grammarTopic.upsert({
      where: { slug: topic.slug },
      update: topic,
      create: topic
    });
  }

  const topicRecords = await prisma.grammarTopic.findMany();
  const topicBySlug = new Map(topicRecords.map((topic) => [topic.slug, topic]));

  for (const group of vocabularyGroups) {
    const savedGroup = await prisma.vocabularyGroup.upsert({
      where: { slug: group.slug },
      update: {
        title: group.title,
        description: group.description,
        situation: group.situation,
        imageKey: group.imageKey || null
      },
      create: {
        slug: group.slug,
        title: group.title,
        description: group.description,
        situation: group.situation,
        imageKey: group.imageKey || null
      }
    });

    const retainedWordIds = [];
    for (const word of group.words) {
      const savedWord = await upsertGroupWord(savedGroup.id, word);
      retainedWordIds.push(savedWord.id);
    }
    await prisma.word.deleteMany({
      where: {
        groupId: savedGroup.id,
        id: { notIn: retainedWordIds }
      }
    });
  }

  const audioLabGroup = await prisma.vocabularyGroup.findUnique({ where: { slug: "audio-lab-saved" } });
  if (audioLabGroup) {
    await prisma.vocabularyGroup.update({
      where: { id: audioLabGroup.id },
      data: { imageKey: "reading-and-listening-lab:2" }
    });
    await prisma.word.updateMany({
      where: { groupId: audioLabGroup.id },
      data: { imageKey: null }
    });
  }

  const groupRecords = await prisma.vocabularyGroup.findMany();
  const groupBySlug = new Map(groupRecords.map((group) => [group.slug, group]));

  for (const lessonInput of lessons) {
    const lesson = normalizeSeedLesson(lessonInput);
    const topic = topicBySlug.get(lesson.topicSlug);
    const savedLesson = await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: {
        title: lesson.title,
        summary: lesson.summary,
        cefrLevel: lesson.cefrLevel,
        theme: lesson.theme,
        situation: lesson.situation,
        imageKey: lesson.imageKey || null,
        outcomesJson: lesson.outcomes || [],
        conceptKeys: lesson.conceptKeys || [],
        reviewSummary: lesson.reviewSummary || "",
        order: lesson.order,
        estimatedMinutes: lesson.estimatedMinutes,
        topicId: topic.id,
        vocabularyGroups: {
          set: lesson.vocabularySlugs.map((slug) => ({ id: groupBySlug.get(slug).id }))
        }
      },
      create: {
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        cefrLevel: lesson.cefrLevel,
        theme: lesson.theme,
        situation: lesson.situation,
        imageKey: lesson.imageKey || null,
        outcomesJson: lesson.outcomes || [],
        conceptKeys: lesson.conceptKeys || [],
        reviewSummary: lesson.reviewSummary || "",
        order: lesson.order,
        estimatedMinutes: lesson.estimatedMinutes,
        topicId: topic.id,
        vocabularyGroups: {
          connect: lesson.vocabularySlugs.map((slug) => ({ id: groupBySlug.get(slug).id }))
        }
      }
    });

    await prisma.sentence.deleteMany({ where: { lessonId: savedLesson.id } });
    await prisma.sentence.createMany({
      data: lesson.sentences.map(([spanish, english, note]) => ({
        lessonId: savedLesson.id,
        topicId: topic.id,
        spanish,
        english,
        note
      }))
    });
  }

  const lessonRecords = await prisma.lesson.findMany();
  const lessonBySlug = new Map(lessonRecords.map((lesson) => [lesson.slug, lesson]));
  const exerciseRecords = [];
  for (const exercise of exercises) {
    exerciseRecords.push(await upsertExercise(exercise, lessonBySlug, topicBySlug));
  }

  for (const [slug, title, description, icon, threshold] of badges) {
    await prisma.badge.upsert({
      where: { slug },
      update: { title, description, icon, threshold },
      create: { slug, title, description, icon, threshold }
    });
  }

  const now = new Date();
  const challenge = await prisma.challenge.upsert({
    where: { slug: "ser-estar-weekly-sprint" },
    update: {
      title: "Ser vs Estar Sprint",
      description: "Complete 9 exercises on ser, estar, articles, and -ar verbs.",
      type: ChallengeType.WEEKLY,
      startsAt: addDays(now, -1),
      endsAt: addDays(now, 6),
      targetCount: 9,
      xpReward: 150,
      badgeSlug: "challenge-ace"
    },
    create: {
      slug: "ser-estar-weekly-sprint",
      title: "Ser vs Estar Sprint",
      description: "Complete 9 exercises on ser, estar, articles, and -ar verbs.",
      type: ChallengeType.WEEKLY,
      startsAt: addDays(now, -1),
      endsAt: addDays(now, 6),
      targetCount: 9,
      xpReward: 150,
      badgeSlug: "challenge-ace"
    }
  });

  await prisma.challengeExercise.deleteMany({ where: { challengeId: challenge.id } });
  await prisma.challengeExercise.createMany({
    data: exerciseRecords.slice(0, 9).map((exercise, index) => ({
      challengeId: challenge.id,
      exerciseId: exercise.id,
      order: index + 1
    }))
  });

  for (const asset of assetPrompts) {
    await prisma.assetPrompt.upsert({
      where: { slug: asset.slug },
      update: asset,
      create: asset
    });
  }

  console.log("Seeded Espanolo content.");
  if (adminEmail && adminPassword) {
    console.log(`Seeded admin login: ${adminEmail}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
