const { PrismaClient, ExerciseType } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a1-locate-landmarks-on-route", topicSlug: "getting-around-services", title: "Locate Landmarks on a Route", order: 518.1, imageKey: "city-transport:2",
    summary: "Ask for one destination and understand stable location frames before processing movement instructions.", situation: "orienting yourself in an unfamiliar town",
    sentences: [
      ["Perdón, ¿dónde está la estación?", "Excuse me, where is the station?", "Open politely, then use dónde está for one destination."],
      ["Está al lado del museo.", "It is next to the museum.", "Al lado de uses del before a masculine noun with el."],
      ["Está enfrente del hotel.", "It is opposite the hotel.", "Enfrente de identifies a landmark across from the destination."],
      ["Está entre el café y el parque.", "It is between the café and the park.", "Entre connects the two reference points with y."],
      ["La entrada está allí, a la derecha.", "The entrance is there, on the right.", "Allí points farther away and a la derecha gives the side."]
    ],
    dialogueCue: "Perdón, ¿dónde está la estación?", dialogueAnswerIndex: 1
  },
  {
    slug: "a1-follow-short-directions", topicSlug: "getting-around-services", title: "Follow Short Directions", order: 518.2, imageKey: "city-transport:1",
    summary: "Treat common polite direction forms as service chunks and execute one movement step at a time.", situation: "following a short route to the station",
    sentences: [
      ["Siga todo recto.", "Go straight ahead.", "Siga is a useful polite direction chunk; its full command system is taught later."],
      ["Gire a la derecha.", "Turn right.", "Gire a plus a side gives one movement instruction."],
      ["Gire a la izquierda en la segunda calle.", "Turn left at the second street.", "En introduces the landmark where the turn happens."],
      ["Cruce la calle delante del banco.", "Cross the street in front of the bank.", "Cruce is another polite service chunk for a route step."],
      ["Entonces, recto y después a la izquierda.", "So, straight ahead and then left.", "Repeat the decisive steps to check that the route was understood."]
    ],
    dialogueCue: "¿Cómo llego a la estación?"
  },
  {
    slug: "a1-buy-a-transport-ticket", topicSlug: "getting-around-services", title: "Buy a Transport Ticket", order: 518.3, imageKey: "travel-and-survival:4",
    summary: "Request one ticket, choose single or return, ask the price, and state a payment method without improvising a long exchange.", situation: "buying a train or bus ticket",
    sentences: [
      ["Quisiera un billete para Madrid.", "I would like a ticket to Madrid.", "Quisiera plus a ticket and destination makes a polite service request."],
      ["¿Solo ida o ida y vuelta?", "One way or return?", "This fixed either-or question asks for the ticket type."],
      ["Ida y vuelta, por favor.", "Return, please.", "Answer only the missing ticket detail."],
      ["¿Cuánto cuesta el billete?", "How much does the ticket cost?", "Cuánto cuesta asks for the price of one item."],
      ["Pago con tarjeta.", "I am paying by card.", "Con tarjeta states the payment method."]
    ],
    dialogueCue: "¿Solo ida o ida y vuelta?", dialogueAnswerIndex: 2
  },
  {
    slug: "a1-check-departure-and-platform", topicSlug: "getting-around-services", title: "Check Departure and Platform", order: 518.4, imageKey: "city-transport:8",
    summary: "Separate departure time, platform, and arrival time so each critical travel detail can be checked independently.", situation: "checking train information",
    sentences: [
      ["¿A qué hora sale el tren?", "What time does the train leave?", "Salir asks for departure; a qué hora requests its time."],
      ["Sale a las nueve y cuarto.", "It leaves at quarter past nine.", "The answer keeps a las plus the precise time."],
      ["¿De qué andén sale?", "Which platform does it leave from?", "De qué andén isolates the departure platform."],
      ["Sale del andén tres.", "It leaves from platform three.", "Del combines de and el before andén."],
      ["Llega a Valencia a las once.", "It arrives in Valencia at eleven.", "Llegar a plus a place and a las plus a time gives the arrival detail."]
    ],
    dialogueCue: "¿De qué andén sale el tren?", dialogueAnswerIndex: 3
  },
  {
    slug: "a1-check-in-at-a-hotel", topicSlug: "getting-around-services", title: "Check In at a Hotel", order: 518.5, imageKey: "travel-and-survival:2",
    summary: "Give the reservation name, present identification, receive the room and key, and ask one useful service-time question.", situation: "arriving at hotel reception",
    sentences: [
      ["Hola, tengo una reserva.", "Hello, I have a reservation.", "Tengo una reserva opens the check-in task directly."],
      ["La reserva está a nombre de Lena Weber.", "The reservation is under the name Lena Weber.", "A nombre de identifies the person attached to the booking."],
      ["Aquí tiene mi pasaporte.", "Here is my passport.", "Aquí tiene is a polite fixed handover phrase."],
      ["Su habitación es la doscientos cuatro.", "Your room is number 204.", "Hotel room numbers are often treated as identifying numbers."],
      ["¿A qué hora es el desayuno?", "What time is breakfast?", "Reuse a qué hora to ask for a service time."]
    ],
    dialogueCue: "Buenas tardes, ¿tiene una reserva?", dialogueAnswerIndex: 0
  },
  {
    slug: "a1-repair-a-travel-problem", topicSlug: "getting-around-services", title: "Repair a Travel Problem", order: 518.6, imageKey: "travel-and-survival:12",
    summary: "Name the exact travel problem, request one action, and confirm the corrected detail instead of repeating a vague no entiendo.", situation: "solving a small problem while travelling",
    sentences: [
      ["Perdón, la llave no funciona.", "Excuse me, the key does not work.", "Name the object and problem before requesting help."],
      ["Necesito otra llave, por favor.", "I need another key, please.", "Otra plus a noun requests a replacement of the same kind."],
      ["No he entendido el número de habitación.", "I did not understand the room number.", "Identify the exact detail that was missed."],
      ["¿Puede repetirlo más despacio?", "Can you repeat it more slowly?", "The object pronoun lo refers back to the unclear detail."],
      ["Entonces, la habitación es la doscientos cuatro.", "So, the room is number 204.", "Repeat the corrected number to close the repair loop."]
    ],
    dialogueCue: "Buenas tardes, ¿qué problema hay?", dialogueAnswerIndex: 0
  },
  {
    slug: "checkpoint-a1-getting-around", topicSlug: "getting-around-services", title: "A1.11 Getting Around Checkpoint", order: 518.7, imageKey: "travel-and-survival:25", checkpoint: true,
    summary: "Combine orientation, directions, ticket purchase, departure details, hotel arrival, and targeted repair in one bounded journey.", situation: "travelling from the station to a hotel",
    sentences: [
      ["Quisiera un billete de ida y vuelta.", "I would like a return ticket.", "The ticket request includes the missing type immediately."],
      ["El tren sale del andén tres a las nueve y cuarto.", "The train leaves from platform three at quarter past nine.", "Platform and departure time form one checkable statement."],
      ["Siga recto y gire a la derecha.", "Go straight ahead and turn right.", "Two short direction chunks form a manageable route."],
      ["Tengo una reserva a nombre de Lena Weber.", "I have a reservation under the name Lena Weber.", "The check-in frame combines the booking and identifying name."],
      ["Perdón, la llave no funciona.", "Excuse me, the key does not work.", "A precise problem statement enables a useful response."],
      ["¿Puede repetir el número de habitación más despacio?", "Can you repeat the room number more slowly?", "Name the unclear detail and the requested repair action."]
    ],
    dialogueCue: "Buenas tardes, ¿en qué puedo ayudarle?",
    readingJson: {
      title: "De la estación al hotel",
      inputMode: "listening",
      orientationDe: "Höre zuerst auf die drei Stationen der Reise: Fahrkarte, Weg und Hotel. Beim zweiten Hören notierst du nur die entscheidenden Angaben zu Gleis, Uhrzeit, Richtung und Zimmerproblem.",
      orientationEn: "First listen for the journey's three stages: ticket, route, and hotel. On the second listen, note only the decisive platform, time, direction, and room problem.",
      paragraphs: [
        "Lena compra un billete de ida y vuelta. El tren sale del andén tres a las nueve y cuarto. Al llegar, pregunta por el hotel.",
        "Debe seguir recto y girar a la derecha. En el hotel tiene una reserva, pero la llave no funciona y pide otra llave."
      ],
      questions: [
        { questionDe: "Von welchem Gleis fährt Lenas Zug ab?", questionEn: "Which platform does Lena's train leave from?", optionsDe: ["Gleis drei", "Gleis neun", "Gleis vier"], optionsEn: ["Platform three", "Platform nine", "Platform four"], correct: 0, explanationDe: "El tren sale del andén tres verbindet die Abfahrt ausdrücklich mit Gleis drei; neun und vier gehören nur zur Uhrzeit neun Uhr fünfzehn.", explanationEn: "El tren sale del andén tres explicitly connects departure with platform three; nine and four belong only to the quarter-past-nine time." },
        { questionDe: "Welches Problem nennt Lena im Hotel?", questionEn: "Which problem does Lena name at the hotel?", optionsDe: ["Der Schlüssel funktioniert nicht", "Die Reservierung fehlt", "Das Hotel ist geschlossen"], optionsEn: ["The key does not work", "The reservation is missing", "The hotel is closed"], correct: 0, explanationDe: "La llave no funciona benennt genau den defekten Schlüssel; Lena besitzt bereits eine Reservierung und befindet sich an der geöffneten Rezeption.", explanationEn: "La llave no funciona identifies the faulty key; Lena already has a reservation and is at the open reception desk." }
      ],
      recallPromptDe: "Erzähle Lenas Reise auf Spanisch in mindestens sechs kurzen Sätzen nach: Fahrkartenart, Gleis, Abfahrtszeit, zwei Wegschritte, Reservierung und Schlüsselproblem. Bitte zusätzlich gezielt um Wiederholung einer Angabe.",
      recallPromptEn: "Retell Lena's journey in Spanish in at least six short sentences: ticket type, platform, departure time, two route steps, reservation, and key problem. Also ask specifically for one detail to be repeated.",
      modelSummary: "Lena compra un billete de ida y vuelta, sale del andén tres a las nueve y cuarto, sigue dos indicaciones y en el hotel cambia una llave que no funciona."
    }
  }
];

const travelWords = [
  ["todo recto", "straight ahead", "direction", "Siga todo recto."], ["a la derecha", "to the right", "direction", "Gire a la derecha."],
  ["a la izquierda", "to the left", "direction", "Gire a la izquierda."], ["el billete", "ticket", "noun", "Quisiera un billete."],
  ["solo ida", "one way", "ticket phrase", "Quisiera un billete de solo ida."], ["ida y vuelta", "return ticket", "ticket phrase", "Ida y vuelta, por favor."],
  ["el andén", "platform", "noun", "Sale del andén tres."], ["la parada", "stop", "noun", "La parada está cerca."],
  ["la salida", "departure / exit", "noun", "La salida es a las nueve."], ["la llegada", "arrival", "noun", "La llegada es a las once."],
  ["la reserva", "reservation", "noun", "Tengo una reserva."], ["la recepción", "reception desk", "noun", "La recepción está aquí."],
  ["la habitación", "hotel room", "noun", "La habitación es la doscientos cuatro."], ["la llave", "key", "noun", "La llave no funciona."],
  ["el ascensor", "elevator", "noun", "El ascensor está a la derecha."], ["el desayuno", "breakfast", "noun", "El desayuno es a las ocho."],
  ["en efectivo", "in cash", "payment phrase", "Pago en efectivo."], ["con tarjeta", "by card", "payment phrase", "Pago con tarjeta."]
];

const tokenize = (value) => value.match(/[\p{L}\p{N}]+|[¿?¡!.,;]/gu) || [];
const accepted = (value) => {
  const plain = value.toLowerCase().replace(/[¿?¡!.,;]/g, "").replace(/\s+/g, " ").trim();
  return [plain, `${plain}.`, `${plain}?`];
};

function checksFor(input) {
  const checks = [
    { key: "meaning", type: ExerciseType.MULTIPLE_CHOICE, question: input.sentences[0][1], correct: input.sentences[0][0], options: [input.sentences[0][0], input.sentences[1][0], input.sentences[2][0]] },
    { key: "build", type: ExerciseType.SENTENCE_BUILDER, question: input.sentences[1][1], correct: input.sentences[1][0] },
    { key: "translate", type: ExerciseType.TRANSLATION, question: input.sentences[2][1], correct: input.sentences[2][0] },
    { key: "recall", type: ExerciseType.SHORT_ANSWER, question: input.sentences[3][1], correct: input.sentences[3][0] },
    { key: "dialogue", type: ExerciseType.DIALOGUE_REPLY, question: input.dialogueCue, correct: input.sentences[input.dialogueAnswerIndex ?? 4][0] }
  ];
  if (input.checkpoint) checks.push({ key: "repair", type: ExerciseType.WRITING_PROMPT, question: input.sentences[5][1], correct: input.sentences[5][0] });
  return checks;
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "travel_service_word_order" }
    : { correct: check.correct, accepted: accepted(check.correct), goal: "travel_service_task", rubric: "Complete the immediate travel task with a clear full Spanish frame." };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the matching Spanish travel sentence" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the complete travel frame" : "Respond with the learned Spanish travel frame",
    instruction: "Identify the immediate travel task and retrieve only the complete frame needed for that step.",
    questionText: check.question, answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 1 : check.type === ExerciseType.SENTENCE_BUILDER ? 2 : 3,
    order, xpReward: 12, imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "getting-around-services" },
    update: { title: "Getting Around and Arriving", description: "Orient yourself, follow directions, use transport, check into a hotel, and repair one travel problem.", cefrLevel: "A1", imageKey: "travel-and-survival:25" },
    create: { slug: "getting-around-services", title: "Getting Around and Arriving", description: "Orient yourself, follow directions, use transport, check into a hotel, and repair one travel problem.", cefrLevel: "A1", imageKey: "travel-and-survival:25" }
  });
  const groups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["travel-and-survival", "city-transport", "places-around-town", "useful-phrases", "weather-and-time"] } } });
  for (const groupSlug of ["travel-and-survival", "city-transport"]) {
    const group = groups.find((item) => item.slug === groupSlug);
    if (!group) continue;
    for (const [spanish, english, partOfSpeech, example] of travelWords) {
      const existing = await prisma.word.findFirst({ where: { groupId: group.id, spanish } });
      const data = { groupId: group.id, spanish, english, partOfSpeech, gender: null, example, imageKey: null };
      if (existing) await prisma.word.update({ where: { id: existing.id }, data });
      else await prisma.word.create({ data });
    }
  }
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "A1", theme: input.checkpoint ? "Checkpoint" : "Travel",
      situation: input.situation, imageKey: input.imageKey,
      outcomesJson: ["You can identify the immediate travel task before responding.", "You can retrieve a short complete Spanish service frame.", "You can isolate and repair an unclear direction, time, platform, or room detail."],
      conceptKeys: ["a1", "getting-around", input.slug], reviewSummary: input.summary, readingJson: input.readingJson || null,
      order: input.order, estimatedMinutes: input.checkpoint ? 18 : 15, topicId: topic.id
    };
    const lesson = await prisma.lesson.upsert({ where: { slug: input.slug }, update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } }, create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } } });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const checks = checksFor(input);
    for (let index = 0; index < checks.length; index += 1) await saveExercise(lesson, input, checks[index], index + 1);
    const keep = checks.map((check) => `${input.slug}-${check.key}`);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: [{ slug: { in: keep } }, { slug: { startsWith: `supplement-${input.slug}-` } }] } });
  }
  console.log(`Seeded ${lessons.length} A1.11 getting-around learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons };
