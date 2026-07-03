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
    imageKey: "travel-and-survival:1",
    order: 6
  },
  {
    slug: "location-prepositions",
    title: "Location and Prepositions",
    description: "Say where objects and places are with estar plus simple location phrases.",
    cefrLevel: "A1",
    imageKey: "grammar-scenes:13",
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
    imageKey: "travel-and-survival:5",
    order: 10
  },
  {
    slug: "question-words",
    title: "Question Words",
    description: "Build practical questions with que, quien, donde, cuando, como, and cuanto.",
    cefrLevel: "A1",
    imageKey: "grammar-scenes:11",
    order: 11
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
      ["el libro", "book", "noun", "masculine", "El libro esta en la mesa.", "classroom-basics:3"],
      ["el lapiz", "pencil", "noun", "masculine", "El lapiz esta en la mesa.", "classroom-basics:4"],
      ["la silla", "chair", "noun", "feminine", "La silla esta al lado del escritorio.", "classroom-basics:6"],
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
      ["hablar", "to speak", "verb", null, "Yo hablo espanol.", "daily-actions:1"],
      ["estudiar", "to study", "verb", null, "Ella estudia gramatica.", "daily-actions:2"],
      ["trabajar", "to work", "verb", null, "Nosotros trabajamos hoy.", "daily-actions:3"],
      ["comprar", "to buy", "verb", null, "Tu compras pan.", "daily-actions:4"],
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
      ["el cafe", "cafe", "noun", "masculine", "Estoy en el cafe.", "places-around-town:1"],
      ["la tienda", "store", "noun", "feminine", "La tienda esta cerca.", "places-around-town:2"],
      ["el parque", "park", "noun", "masculine", "Los ninos estan en el parque.", "places-around-town:3"],
      ["la estacion", "station", "noun", "feminine", "La estacion esta lejos.", "places-around-town:4"],
      ["la casa", "home", "noun", "feminine", "Estoy en casa.", "places-around-town:7"],
      ["el restaurante", "restaurant", "noun", "masculine", "El restaurante esta abierto.", "places-around-town:10"]
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
      ["triste", "sad", "adjective", null, "Ella esta triste.", "emotions-and-states:2"],
      ["cansado", "tired", "adjective", "masculine", "El estudiante esta cansado.", "emotions-and-states:3"],
      ["nerviosa", "nervous", "adjective", "feminine", "Ana esta nerviosa.", "emotions-and-states:4"],
      ["enfermo", "sick", "adjective", "masculine", "Estoy enfermo hoy.", "emotions-and-states:7"],
      ["emocionado", "excited", "adjective", "masculine", "Estoy emocionado.", "emotions-and-states:11"]
    ]
  },
  {
    slug: "food-and-ordering",
    title: "Food and Ordering",
    description: "Food, drink, and cafe phrases for practical beginner conversations.",
    situation: "restaurant",
    imageKey: "food-and-ordering:17",
    words: [
      ["el agua", "water", "noun", "masculine", "Quiero agua, por favor.", "food-and-ordering:1"],
      ["el cafe", "coffee", "noun", "masculine", "Quiero un cafe.", "food-and-ordering:2"],
      ["el pan", "bread", "noun", "masculine", "El pan esta fresco.", "food-and-ordering:3"],
      ["la sopa", "soup", "noun", "feminine", "La sopa esta caliente.", "food-and-ordering:5"],
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
      ["el hotel", "hotel", "noun", "masculine", "El hotel esta cerca.", "travel-and-survival:2"],
      ["el tren", "train", "noun", "masculine", "Necesito un boleto de tren.", "city-transport:2"],
      ["el mapa", "map", "noun", "masculine", "Tengo un mapa.", "travel-and-survival:5"],
      ["el taxi", "taxi", "noun", "masculine", "Busco un taxi.", "city-transport:3"],
      ["el museo", "museum", "noun", "masculine", "El museo esta abierto.", "travel-and-survival:9"],
      ["la estacion", "station", "noun", "feminine", "La estacion esta alli.", "city-transport:7"]
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
      ["el platano", "banana", "noun", "masculine", "El platano es amarillo.", "fruit-and-produce:2"],
      ["la naranja", "orange", "noun", "feminine", "Quiero una naranja.", "fruit-and-produce:3"],
      ["el limon", "lemon", "noun", "masculine", "El limon es amarillo.", "fruit-and-produce:4"],
      ["la fresa", "strawberry", "noun", "feminine", "La fresa es roja.", "fruit-and-produce:5"],
      ["las uvas", "grapes", "noun", "feminine plural", "Las uvas estan frescas.", "fruit-and-produce:6"],
      ["la pera", "pear", "noun", "feminine", "Quiero una pera.", "fruit-and-produce:7"],
      ["el tomate", "tomato", "noun", "masculine", "El tomate esta fresco.", "fruit-and-produce:11"],
      ["la zanahoria", "carrot", "noun", "feminine", "La zanahoria es naranja.", "fruit-and-produce:13"],
      ["la ensalada", "salad", "noun", "feminine", "La ensalada esta en la mesa.", "fruit-and-produce:24"],
      ["la fruta", "fruit", "noun", "feminine", "La fruta esta en la cesta.", "fruit-and-produce:20"],
      ["el mercado", "market", "noun", "masculine", "Compro fruta en el mercado.", "fruit-and-produce:21"]
    ]
  },
  {
    slug: "useful-phrases",
    title: "Useful Phrases",
    description: "Survival phrases for conversations, ordering, and getting unstuck.",
    situation: "conversation",
    imageKey: "daily-actions:15",
    words: [
      ["por favor", "please", "phrase", null, "Un cafe, por favor.", null],
      ["gracias", "thank you", "phrase", null, "Gracias por la ayuda.", null],
      ["perdon", "sorry / excuse me", "phrase", null, "Perdon, ¿donde esta el hotel?", "travel-and-survival:1"],
      ["necesito ayuda", "I need help", "phrase", null, "Necesito ayuda, por favor.", "travel-and-survival:12"],
      ["no entiendo", "I do not understand", "phrase", null, "No entiendo la pregunta.", "grammar-scenes:12"],
      ["mas despacio", "more slowly", "phrase", null, "Mas despacio, por favor.", "daily-actions:6"],
      ["¿cuanto cuesta?", "how much does it cost?", "phrase", null, "¿Cuanto cuesta el pan?", "travel-and-survival:19"],
      ["la cuenta, por favor", "the bill, please", "phrase", null, "La cuenta, por favor.", "food-and-ordering:18"]
    ]
  },
  {
    slug: "home-and-objects",
    title: "Home and Objects",
    description: "Objects and rooms for location and article practice.",
    situation: "home",
    imageKey: "home-objects:1",
    words: [
      ["la mesa", "table", "noun", "feminine", "El libro esta en la mesa.", "home-objects:1"],
      ["la silla", "chair", "noun", "feminine", "La silla esta aqui.", "home-objects:2"],
      ["la cama", "bed", "noun", "feminine", "La cama esta en el dormitorio.", "home-objects:3"],
      ["el sofa", "sofa", "noun", "masculine", "El sofa esta en casa.", "home-objects:4"],
      ["la puerta", "door", "noun", "feminine", "La puerta esta abierta.", "home-objects:5"],
      ["la ventana", "window", "noun", "feminine", "La ventana esta cerrada.", "home-objects:6"],
      ["la lampara", "lamp", "noun", "feminine", "La lampara esta en la mesa.", "home-objects:7"],
      ["la llave", "key", "noun", "feminine", "Busco la llave.", "home-objects:8"],
      ["la cocina", "kitchen", "noun", "feminine", "Estoy en la cocina.", "home-objects:11"],
      ["el vaso", "cup", "noun", "masculine", "El vaso esta en la mesa.", "home-objects:17"],
      ["la mochila", "backpack", "noun", "feminine", "La mochila esta en la silla.", "classroom-basics:8"],
      ["el reloj", "clock", "noun", "masculine", "El reloj esta en la pared.", "weather-and-time:13"]
    ]
  },
  {
    slug: "people-and-pronouns",
    title: "People and Pronouns",
    description: "People words that help you build sentences with verb agreement.",
    situation: "introductions",
    imageKey: "people-and-family:1",
    words: [
      ["yo", "I", "pronoun", null, "Yo soy estudiante.", "people-and-family:1"],
      ["tu", "you", "pronoun", null, "Tu estudias mucho.", "people-and-family:2"],
      ["el", "he", "pronoun", null, "El trabaja hoy.", "people-and-family:10"],
      ["ella", "she", "pronoun", null, "Ella esta feliz.", "people-and-family:1"],
      ["nosotros", "we", "pronoun", null, "Nosotros caminamos.", "people-and-family:16"],
      ["ellos", "they", "pronoun", null, "Ellos estan en el parque.", "people-and-family:16"],
      ["la persona", "person", "noun", "feminine", "La persona habla espanol.", "people-and-family:1"],
      ["el amigo", "friend", "noun", "masculine", "Llamo a mi amigo.", "people-and-family:2"],
      ["el estudiante", "student", "noun", "masculine", "El estudiante lee.", "people-and-family:3"],
      ["la profesora", "teacher", "noun", "feminine", "La profesora explica.", "people-and-family:4"],
      ["la familia", "family", "noun", "feminine", "La familia esta en casa.", "people-and-family:9"]
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
      ["la camiseta", "t-shirt", "noun", "feminine", "La camiseta esta limpia.", "clothing-basics:2"],
      ["los pantalones", "pants", "noun", "masculine plural", "Los pantalones son azules.", "clothing-basics:3"],
      ["el vestido", "dress", "noun", "masculine", "El vestido es bonito.", "clothing-basics:5"],
      ["la chaqueta", "jacket", "noun", "feminine", "Necesito una chaqueta.", "clothing-basics:7"],
      ["los zapatos", "shoes", "noun", "masculine plural", "Los zapatos estan aqui.", "clothing-basics:10"],
      ["el sombrero", "hat", "noun", "masculine", "El sombrero es nuevo.", "clothing-basics:12"],
      ["la bufanda", "scarf", "noun", "feminine", "La bufanda es roja.", "clothing-basics:13"],
      ["la mochila", "backpack", "noun", "feminine", "La mochila esta en la silla.", "clothing-basics:16"],
      ["las botas", "boots", "noun", "feminine plural", "Las botas estan en casa.", "clothing-basics:23"]
    ]
  },
  {
    slug: "city-transport",
    title: "City Transport",
    description: "Transport and travel objects for getting around.",
    situation: "transport",
    imageKey: "city-transport:1",
    words: [
      ["el autobus", "bus", "noun", "masculine", "El autobus esta aqui.", "city-transport:1"],
      ["el tren", "train", "noun", "masculine", "Necesito un boleto de tren.", "city-transport:2"],
      ["el taxi", "taxi", "noun", "masculine", "Busco un taxi.", "city-transport:3"],
      ["la bicicleta", "bicycle", "noun", "feminine", "La bicicleta es nueva.", "city-transport:4"],
      ["el metro", "subway", "noun", "masculine", "El metro esta cerca.", "city-transport:5"],
      ["el aeropuerto", "airport", "noun", "masculine", "El aeropuerto esta lejos.", "city-transport:6"],
      ["la plataforma", "platform", "noun", "feminine", "La plataforma esta alli.", "city-transport:7"],
      ["la maleta", "suitcase", "noun", "feminine", "Tengo una maleta.", "city-transport:10"],
      ["el pasaporte", "passport", "noun", "masculine", "Necesito el pasaporte.", "city-transport:11"],
      ["el mapa", "map", "noun", "masculine", "Tengo un mapa.", "city-transport:12"]
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
      ["esta nublado", "it is cloudy", "phrase", null, "El cielo esta nublado.", "weather-and-time:3"],
      ["hace viento", "it is windy", "phrase", null, "Hoy hace viento.", "weather-and-time:4"],
      ["hace frio", "it is cold", "phrase", null, "Hace frio hoy.", "weather-and-time:7"],
      ["hace calor", "it is hot", "phrase", null, "Hace calor hoy.", "weather-and-time:6"],
      ["la manana", "morning", "noun", "feminine", "Estudio por la manana.", "weather-and-time:8"],
      ["la tarde", "afternoon", "noun", "feminine", "Trabajo por la tarde.", "weather-and-time:9"],
      ["la noche", "night", "noun", "feminine", "Leo por la noche.", "weather-and-time:11"],
      ["el paraguas", "umbrella", "noun", "masculine", "Necesito un paraguas.", "weather-and-time:14"]
    ]
  }
];

const lessons = [
  {
    slug: "zero-pronouns",
    title: "Zero: Yo, Tu, El, Ella",
    summary: "Learn the tiny person words before building sentences.",
    cefrLevel: "A1",
    theme: "Absolute Basics",
    situation: "starting from zero",
    imageKey: "people-and-family:1",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns"],
    order: 1,
    estimatedMinutes: 4,
    sentences: [
      ["yo", "I", "Use yo when you talk about yourself."],
      ["tu", "you", "Use tu when speaking to one person informally."],
      ["el", "he", "El can mean he. Later you also see el as the masculine article."],
      ["ella", "she", "Ella means she."]
    ]
  },
  {
    slug: "zero-soy",
    title: "Zero: Soy",
    summary: "Learn soy before comparing it with anything else.",
    cefrLevel: "A1",
    theme: "Absolute Basics",
    situation: "identity",
    imageKey: "grammar-scenes:1",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns", "classroom-basics"],
    order: 2,
    estimatedMinutes: 5,
    sentences: [
      ["soy", "I am", "Soy is the I-form of ser."],
      ["Yo soy estudiante.", "I am a student.", "Use soy for identity, role, or what someone is."],
      ["Soy Ana.", "I am Ana.", "Names and identity use soy when speaking about yourself."]
    ]
  },
  {
    slug: "zero-estoy",
    title: "Zero: Estoy",
    summary: "Learn estoy as I am right now or I am located.",
    cefrLevel: "A1",
    theme: "Absolute Basics",
    situation: "state and location",
    imageKey: "grammar-scenes:5",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["emotions-and-states", "places-around-town"],
    order: 3,
    estimatedMinutes: 5,
    sentences: [
      ["estoy", "I am", "Estoy is the I-form of estar."],
      ["Estoy feliz.", "I am happy.", "Use estoy for how you are right now."],
      ["Estoy en casa.", "I am at home.", "Use estoy for where you are."]
    ]
  },
  {
    slug: "zero-es-esta",
    title: "Zero: Es and Esta",
    summary: "Learn he/she/it is forms before longer sentences.",
    cefrLevel: "A1",
    theme: "Absolute Basics",
    situation: "he, she, it",
    imageKey: "grammar-scenes:4",
    topicSlug: "absolute-basics",
    vocabularySlugs: ["people-and-pronouns", "places-around-town", "emotions-and-states"],
    order: 4,
    estimatedMinutes: 6,
    sentences: [
      ["es", "he/she/it is", "Es comes from ser and is used for identity or traits."],
      ["esta", "he/she/it is", "Esta comes from estar and is used for state or location."],
      ["Ella es profesora.", "She is a teacher.", "Identity uses es."],
      ["Ella esta en casa.", "She is at home.", "Location uses esta."]
    ]
  },
  {
    slug: "ser-vs-estar-basics",
    title: "Ser vs Estar",
    summary: "Learn when to use ser and estar in everyday situations.",
    cefrLevel: "A1",
    theme: "Grammar Foundations",
    situation: "introductions and places",
    imageKey: "grammar-scenes:1",
    topicSlug: "ser-estar",
    vocabularySlugs: ["classroom-basics", "places-around-town"],
    order: 5,
    estimatedMinutes: 8,
    sentences: [
      ["Yo soy estudiante.", "I am a student.", "Ser describes identity or profession."],
      ["Estoy en la biblioteca.", "I am in the library.", "Estar describes location."],
      ["Ella esta cansada.", "She is tired.", "Estar describes a temporary state."]
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
    order: 6,
    estimatedMinutes: 7,
    sentences: [
      ["El libro es nuevo.", "The book is new.", "Libro is masculine singular."],
      ["La tienda esta abierta.", "The store is open.", "Tienda is feminine singular."],
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
    order: 7,
    estimatedMinutes: 9,
    sentences: [
      ["Yo hablo espanol.", "I speak Spanish.", "Yo uses the -o ending."],
      ["Tu estudias mucho.", "You study a lot.", "Tu uses the -as ending."],
      ["Ellos trabajan hoy.", "They work today.", "Ellos uses the -an ending."]
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
    order: 8,
    estimatedMinutes: 8,
    sentences: [
      ["Estoy feliz hoy.", "I am happy today.", "Use estar for feelings that can change."],
      ["Ella esta cansada.", "She is tired.", "Cansada agrees with ella."],
      ["Estamos nerviosos.", "We are nervous.", "Estamos matches nosotros."],
      ["El estudiante esta enfermo.", "The student is sick.", "Use estar for temporary health states."]
    ]
  },
  {
    slug: "food-ordering-basics",
    title: "Food Ordering Basics",
    summary: "Use quiero, articles, and polite phrases at a cafe or restaurant.",
    cefrLevel: "A1",
    theme: "Food and Ordering",
    situation: "restaurant and cafe",
    imageKey: "food-and-ordering:17",
    topicSlug: "ordering-food",
    vocabularySlugs: ["food-and-ordering"],
    order: 9,
    estimatedMinutes: 9,
    sentences: [
      ["Quiero un cafe, por favor.", "I want a coffee, please.", "Use un before masculine singular cafe."],
      ["La sopa esta caliente.", "The soup is hot.", "La matches feminine singular sopa."],
      ["La cuenta, por favor.", "The bill, please.", "A useful restaurant phrase."],
      ["El pan esta fresco.", "The bread is fresh.", "El matches masculine singular pan."]
    ]
  },
  {
    slug: "travel-survival-questions",
    title: "Travel Survival Questions",
    summary: "Ask where places are and handle common travel moments.",
    cefrLevel: "A1",
    theme: "Travel Spanish",
    situation: "hotel, station, and city travel",
    imageKey: "travel-and-survival:1",
    topicSlug: "travel-questions",
    vocabularySlugs: ["travel-and-survival", "places-around-town"],
    order: 10,
    estimatedMinutes: 9,
    sentences: [
      ["¿Donde esta el hotel?", "Where is the hotel?", "Donde asks for location."],
      ["Necesito un taxi.", "I need a taxi.", "Necesito is a high-frequency survival verb."],
      ["La estacion esta cerca.", "The station is nearby.", "Use estar for location."],
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
    imageKey: "grammar-scenes:13",
    topicSlug: "location-prepositions",
    vocabularySlugs: ["classroom-basics", "home-and-objects", "places-around-town"],
    order: 11,
    estimatedMinutes: 9,
    sentences: [
      ["El libro esta en la mesa.", "The book is on the table.", "Use estar for object location."],
      ["La mochila esta en la silla.", "The backpack is on the chair.", "La mochila needs esta."],
      ["La tienda esta cerca.", "The store is nearby.", "Cerca is a simple location word."],
      ["Las llaves estan en la cocina.", "The keys are in the kitchen.", "Plural keys use estan."]
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
    order: 12,
    estimatedMinutes: 8,
    sentences: [
      ["Los estudiantes estan en clase.", "The students are in class.", "Los marks masculine or mixed plural."],
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
    imageKey: "grammar-scenes:11",
    topicSlug: "question-words",
    vocabularySlugs: ["useful-phrases", "travel-and-survival"],
    order: 13,
    estimatedMinutes: 8,
    sentences: [
      ["¿Que quieres?", "What do you want?", "Que asks what."],
      ["¿Donde esta la estacion?", "Where is the station?", "Donde asks where."],
      ["¿Cuanto cuesta?", "How much does it cost?", "Cuanto asks how much."],
      ["¿Quien habla?", "Who is speaking?", "Quien asks who."]
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
    order: 14,
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
    imageKey: "travel-and-survival:5",
    topicSlug: "tener-necesitar",
    vocabularySlugs: ["travel-and-survival", "useful-phrases", "home-and-objects"],
    order: 15,
    estimatedMinutes: 9,
    sentences: [
      ["Tengo un mapa.", "I have a map.", "Tengo means I have."],
      ["Necesito ayuda.", "I need help.", "Necesito is useful when stuck."],
      ["Necesito las llaves.", "I need the keys.", "Las marks plural feminine."],
      ["Tenemos una mesa.", "We have a table.", "Tenemos means we have."]
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
    order: 16,
    estimatedMinutes: 9,
    sentences: [
      ["Yo compro pan.", "I buy bread.", "Comprar is a regular -ar verb."],
      ["Nosotros caminamos al parque.", "We walk to the park.", "Nosotros uses -amos."],
      ["Ella lee un libro.", "She reads a book.", "Leer is useful even before full -er verb study."],
      ["Tu hablas con un amigo.", "You speak with a friend.", "Tu uses -as for regular -ar verbs."]
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
    order: 17,
    estimatedMinutes: 8,
    sentences: [
      ["Quiero una manzana.", "I want an apple.", "Una matches feminine singular manzana."],
      ["El platano es amarillo.", "The banana is yellow.", "Use ser for a normal trait."],
      ["Compro fruta en el mercado.", "I buy fruit at the market.", "Compro is the yo form of comprar."],
      ["La ensalada esta fresca.", "The salad is fresh.", "La and fresca agree."]
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
    order: 18,
    estimatedMinutes: 9,
    sentences: [
      ["Un cafe, por favor.", "A coffee, please.", "A short polite order is enough."],
      ["La cuenta, por favor.", "The bill, please.", "A complete restaurant phrase."],
      ["No entiendo el menu.", "I do not understand the menu.", "Use no before entiendo."],
      ["¿Cuanto cuesta el postre?", "How much does the dessert cost?", "Cuanto asks price."]
    ]
  },
  {
    slug: "checkpoint-a1-foundations",
    title: "A1 Foundations Checkpoint",
    summary: "Mix identity, location, articles, verbs, food, and travel in one review checkpoint.",
    cefrLevel: "A1",
    theme: "Checkpoint",
    situation: "mixed review",
    imageKey: "rewards-and-progress:15",
    topicSlug: "question-words",
    vocabularySlugs: ["classroom-basics", "daily-actions", "food-and-ordering", "travel-and-survival", "useful-phrases"],
    order: 19,
    estimatedMinutes: 12,
    sentences: [
      ["Yo soy estudiante y estoy en la biblioteca.", "I am a student and I am in the library.", "Mix ser for identity and estar for location."],
      ["Quiero un cafe, por favor.", "I want a coffee, please.", "Use un with cafe."],
      ["¿Donde esta la estacion?", "Where is the station?", "Travel question frame."],
      ["No entiendo, mas despacio por favor.", "I do not understand, more slowly please.", "Conversation repair phrase."]
    ]
  }
];

const exercises = [
  {
    slug: "zero-yo-means-i",
    lessonSlug: "zero-pronouns",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Tiny word meaning.",
    instruction: "Choose the meaning.",
    questionText: "yo",
    answerJson: { correct: "I", accepted: ["I", "i"] },
    explanation: "Yo means I. It points to the person speaking.",
    difficulty: 1,
    order: 1,
    xpReward: 8,
    imageKey: "classroom-basics:1",
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
    questionText: "tu",
    answerJson: { correct: "you", accepted: ["you"] },
    explanation: "Tu means you, when speaking to one person informally.",
    difficulty: 1,
    order: 2,
    xpReward: 8,
    imageKey: "daily-actions:16",
    options: [
      ["you", "you", true],
      ["I", "I", false],
      ["they", "they", false]
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
    answerJson: { correct: "she", accepted: ["she"] },
    explanation: "Ella means she.",
    difficulty: 1,
    order: 3,
    xpReward: 8,
    imageKey: "emotions-and-states:1",
    options: [
      ["she", "she", true],
      ["he", "he", false],
      ["I", "I", false]
    ]
  },
  {
    slug: "zero-soy-means-i-am",
    lessonSlug: "zero-soy",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Meaning first.",
    instruction: "Choose the meaning.",
    questionText: "soy",
    answerJson: { correct: "I am", accepted: ["I am", "i am"] },
    explanation: "Soy means I am when you talk about identity, name, role, or what you are.",
    difficulty: 1,
    order: 1,
    xpReward: 10,
    imageKey: "grammar-scenes:1",
    options: [
      ["I am", "I am", true],
      ["you are", "you are", false],
      ["they are", "they are", false]
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
    imageKey: "classroom-basics:1",
    options: [
      ["soy", "soy", true],
      ["estoy", "estoy", false],
      ["es", "es", false]
    ]
  },
  {
    slug: "zero-estoy-means-i-am",
    lessonSlug: "zero-estoy",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Meaning first.",
    instruction: "Choose the meaning.",
    questionText: "estoy",
    answerJson: { correct: "I am", accepted: ["I am", "i am"] },
    explanation: "Estoy also means I am, but it is for right-now states or location.",
    difficulty: 1,
    order: 1,
    xpReward: 10,
    imageKey: "grammar-scenes:5",
    options: [
      ["I am", "I am", true],
      ["he is", "he is", false],
      ["we are", "we are", false]
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
    imageKey: "places-around-town:7",
    options: [
      ["estoy", "estoy", true],
      ["soy", "soy", false],
      ["son", "son", false]
    ]
  },
  {
    slug: "zero-es-means-is",
    lessonSlug: "zero-es-esta",
    topicSlug: "absolute-basics",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "He/she/it form.",
    instruction: "Choose the meaning.",
    questionText: "es",
    answerJson: { correct: "is", accepted: ["is", "he is", "she is", "it is"] },
    explanation: "Es means is for identity or traits: Ella es profesora.",
    difficulty: 1,
    order: 1,
    xpReward: 10,
    imageKey: "grammar-scenes:2",
    options: [
      ["is", "is", true],
      ["I am", "I am", false],
      ["they are", "they are", false]
    ]
  },
  {
    slug: "zero-esta-location",
    lessonSlug: "zero-es-esta",
    topicSlug: "absolute-basics",
    type: ExerciseType.CLOZE,
    prompt: "State or location.",
    instruction: "Use esta for she is located.",
    questionText: "Ella ____ en casa.",
    answerJson: { correct: "esta", accepted: ["esta", "está"] },
    explanation: "Ella esta en casa uses esta because it tells location.",
    difficulty: 1,
    order: 2,
    xpReward: 10,
    imageKey: "places-around-town:7",
    options: [
      ["esta", "esta", true],
      ["es", "es", false],
      ["soy", "soy", false]
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
    imageKey: "classroom-basics:1",
    options: [
      ["soy", "soy", true],
      ["estoy", "estoy", false],
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
    answerJson: { correct: "estan", accepted: ["estan", "están"] },
    explanation: "Use estar for location. Ellos estan en la biblioteca.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "classroom-basics:10",
    options: [
      ["estan", "estan", true],
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
    questionText: "Ana ____ cansada hoy.",
    answerJson: { correct: "esta", accepted: ["esta", "está"] },
    explanation: "Use estar for temporary states: Ana esta cansada hoy.",
    difficulty: 2,
    order: 3,
    xpReward: 14,
    imageKey: "emotions-and-states:3",
    options: [
      ["esta", "esta", true],
      ["es", "es", false],
      ["soy", "soy", false]
    ]
  },
  {
    slug: "sentence-builder-soy-estudiante",
    lessonSlug: "ser-vs-estar-basics",
    topicSlug: "ser-estar",
    type: ExerciseType.SENTENCE_BUILDER,
    prompt: "Build the sentence.",
    instruction: "Put the words in order.",
    questionText: "I am a student.",
    answerJson: { correctWords: ["Yo", "soy", "estudiante", "."] },
    explanation: "The natural order is subject + verb + noun: Yo soy estudiante.",
    difficulty: 1,
    order: 4,
    xpReward: 16,
    imageKey: "grammar-scenes:10",
    options: [
      ["Yo", "Yo", false],
      ["soy", "soy", false],
      ["estudiante", "estudiante", false],
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
    questionText: "Yo ____ espanol. (hablar)",
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
    questionText: "Tu ____ mucho. (estudiar)",
    answerJson: { correct: "estudias", accepted: ["estudias"] },
    explanation: "For tu, regular -ar verbs use -as: estudiar -> estudias.",
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
    answerJson: { correct: "esta", accepted: ["esta", "está"] },
    explanation: "Ella uses esta, and cansada agrees with ella.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "emotions-and-states:3",
    options: [
      ["esta", "esta", true],
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
      ["estan", "estan", false],
      ["somos", "somos", false]
    ]
  },
  {
    slug: "food-un-cafe",
    lessonSlug: "food-ordering-basics",
    topicSlug: "ordering-food",
    type: ExerciseType.MULTIPLE_CHOICE,
    prompt: "Order politely.",
    instruction: "Choose the article for cafe.",
    questionText: "Quiero ____ cafe, por favor.",
    answerJson: { correct: "un", accepted: ["un"] },
    explanation: "Cafe is masculine singular, so use un: Quiero un cafe.",
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
    questionText: "____ sopa esta caliente.",
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
    questionText: "¿____ esta el hotel?",
    answerJson: { correct: "Donde", accepted: ["donde", "dónde", "Donde", "Dónde"] },
    explanation: "Use donde to ask where something is: ¿Donde esta el hotel?",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "travel-and-survival:2",
    options: [
      ["Donde", "Donde", true],
      ["Cuando", "Cuando", false],
      ["Quien", "Quien", false]
    ]
  },
  {
    slug: "travel-estacion-cerca",
    lessonSlug: "travel-survival-questions",
    topicSlug: "travel-questions",
    type: ExerciseType.CLOZE,
    prompt: "Use location with estar.",
    instruction: "Choose the correct verb.",
    questionText: "La estacion ____ cerca.",
    answerJson: { correct: "esta", accepted: ["esta", "está"] },
    explanation: "Use estar for location: La estacion esta cerca.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "city-transport:7",
    options: [
      ["esta", "esta", true],
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
    answerJson: { correct: "esta", accepted: ["esta", "está"] },
    explanation: "Use estar for location: El libro esta en la mesa.",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "grammar-scenes:13",
    options: [
      ["esta", "esta", true],
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
    answerJson: { correct: "estan", accepted: ["estan", "están"] },
    explanation: "Las llaves is plural, so use estan.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "home-objects:8",
    options: [
      ["estan", "estan", true],
      ["esta", "esta", false],
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
    answerJson: { correctWords: ["La", "mochila", "esta", "en", "la", "silla", "."] },
    explanation: "Use estar for location: La mochila esta en la silla.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "classroom-basics:8",
    options: [
      ["La", "La", false],
      ["mochila", "mochila", false],
      ["esta", "esta", false],
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
    questionText: "____ estudiantes estan en clase.",
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
    answerJson: { correct: "Que", accepted: ["que", "qué", "Que", "Qué"] },
    explanation: "Use que to ask what: ¿Que quieres?",
    difficulty: 1,
    order: 1,
    xpReward: 12,
    imageKey: "grammar-scenes:11",
    options: [
      ["Que", "Que", true],
      ["Donde", "Donde", false],
      ["Quien", "Quien", false]
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
    answerJson: { correct: "Cuanto", accepted: ["cuanto", "cuánto", "Cuanto", "Cuánto"] },
    explanation: "Use cuanto to ask how much something costs.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "travel-and-survival:19",
    options: [
      ["Cuanto", "Cuanto", true],
      ["Cuando", "Cuando", false],
      ["Quien", "Quien", false]
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
    answerJson: { correctWords: ["Donde", "esta", "la", "estacion", "?"] },
    explanation: "Use donde with estar for location questions.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "travel-and-survival:22",
    options: [
      ["Donde", "Donde", false],
      ["esta", "esta", false],
      ["la", "la", false],
      ["estacion", "estacion", false],
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
      ["Esta", "Esta", false]
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
    imageKey: "daily-actions:4",
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
    answerJson: { correctWords: ["Tu", "hablas", "con", "un", "amigo", "."] },
    explanation: "Tu uses hablas for regular -ar verbs.",
    difficulty: 2,
    order: 3,
    xpReward: 16,
    imageKey: "daily-actions:1",
    options: [
      ["Tu", "Tu", false],
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
    questionText: "El platano ____ amarillo.",
    answerJson: { correct: "es", accepted: ["es"] },
    explanation: "Use ser for a normal characteristic: El platano es amarillo.",
    difficulty: 1,
    order: 2,
    xpReward: 12,
    imageKey: "fruit-and-produce:2",
    options: [
      ["es", "es", true],
      ["esta", "esta", false],
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
    answerJson: { correctWords: ["Un", "cafe", "por", "favor", "."] },
    explanation: "A short polite order is: Un cafe, por favor.",
    difficulty: 1,
    order: 1,
    xpReward: 14,
    imageKey: "food-and-ordering:2",
    options: [
      ["Un", "Un", false],
      ["cafe", "cafe", false],
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
    questionText: "Entiendo no el menu.",
    answerJson: { correct: "No entiendo el menu.", accepted: ["no entiendo el menu", "no entiendo el menu."] },
    explanation: "No goes before the verb: No entiendo el menu.",
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
    instruction: "Use cuanto for price.",
    questionText: "¿____ cuesta el postre?",
    answerJson: { correct: "Cuanto", accepted: ["cuanto", "cuánto", "Cuanto", "Cuánto"] },
    explanation: "Use cuanto to ask how much something costs.",
    difficulty: 1,
    order: 3,
    xpReward: 12,
    imageKey: "food-and-ordering:15",
    options: [
      ["Cuanto", "Cuanto", true],
      ["Donde", "Donde", false],
      ["Quien", "Quien", false]
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
    imageKey: "rewards-and-progress:15",
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
    answerJson: { correctWords: ["Quiero", "un", "cafe", "por", "favor", "."] },
    explanation: "Quiero un cafe, por favor is a complete polite order.",
    difficulty: 2,
    order: 2,
    xpReward: 18,
    imageKey: "food-and-ordering:2",
    options: [
      ["Quiero", "Quiero", false],
      ["un", "un", false],
      ["cafe", "cafe", false],
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
    questionText: "¿____ esta la estacion?",
    answerJson: { correct: "Donde", accepted: ["donde", "dónde", "Donde", "Dónde"] },
    explanation: "Use donde to ask where a place is.",
    difficulty: 2,
    order: 3,
    xpReward: 18,
    imageKey: "city-transport:7",
    options: [
      ["Donde", "Donde", true],
      ["Cuanto", "Cuanto", false],
      ["Que", "Que", false]
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
    answerJson: { correctWords: ["No", "entiendo", "mas", "despacio", "por", "favor", "."] },
    explanation: "This phrase helps you slow down real conversations.",
    difficulty: 2,
    order: 4,
    xpReward: 20,
    imageKey: "daily-actions:6",
    options: [
      ["No", "No", false],
      ["entiendo", "entiendo", false],
      ["mas", "mas", false],
      ["despacio", "despacio", false],
      ["por", "por", false],
      ["favor", "favor", false],
      [".", ".", false]
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
    slug: "people-and-family",
    title: "People and Family",
    category: "Vocabulary",
    gridSize: 4,
    canvasSize: 1254,
    imagePath: "/images/people-and-family.webp",
    promptMarkdown: "4x4 people and family sheet. Cells include person, friend greeting, student, teacher, mother, father, siblings, grandparent, family group, worker, doctor, waiter, traveler, customer, neighbor, group conversation."
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
  }
];

async function upsertExercise(exercise, lessonBySlug, topicBySlug) {
  const lesson = lessonBySlug.get(exercise.lessonSlug);
  const topic = topicBySlug.get(exercise.topicSlug);

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
      imageKey: exercise.imageKey || null
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
      imageKey: exercise.imageKey || null
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
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@espanolo.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "change-me";

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

  await prisma.user.upsert({
    where: { email: "ana@example.local" },
    update: {},
    create: {
      email: "ana@example.local",
      name: "Ana",
      passwordHash: await hashPassword("demo1234"),
      xp: 840,
      level: levelForXp(840),
      streakDays: 6,
      lastPracticeDate: new Date()
    }
  });

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

    await prisma.word.deleteMany({ where: { groupId: savedGroup.id } });
    await prisma.word.createMany({
      data: group.words.map(([spanish, english, partOfSpeech, gender, example, imageKey]) => ({
        groupId: savedGroup.id,
        spanish,
        english,
        partOfSpeech,
        gender,
        example,
        imageKey: imageKey || null
      }))
    });
  }

  const groupRecords = await prisma.vocabularyGroup.findMany();
  const groupBySlug = new Map(groupRecords.map((group) => [group.slug, group]));

  for (const lesson of lessons) {
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

  console.log(`Seeded Espanolo. Admin login: ${adminEmail} / ${adminPassword}`);
  console.log("Demo learner login: ana@example.local / demo1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
