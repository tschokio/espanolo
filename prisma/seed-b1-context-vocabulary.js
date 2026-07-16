const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const groups = [
  {
    slug: "b1-opinion-discussion-vocabulary",
    title: "B1 Opinion and Discussion Vocabulary",
    description: "Reusable words and chunks for explaining, comparing, qualifying, and closing an everyday opinion.",
    situation: "giving a connected opinion and responding to another view",
    imageKey: "conversation-and-opinion:8",
    topicSlug: "opinions-connected-production",
    words: [
      ["el punto", "point in a discussion", "noun", "masculine", "Entiendo tu punto, pero lo veo de otra manera."],
      ["la opción", "option or choice", "noun", "feminine", "La segunda opción es más práctica."],
      ["práctico", "practical", "adjective", "masculine", "Vivir cerca del trabajo es práctico."],
      ["necesario", "necessary", "adjective", "masculine", "El transporte público es necesario."],
      ["útil", "useful", "adjective", null, "El curso es muy útil para hablar con más seguridad."],
      ["el ritmo", "pace or rhythm", "noun", "masculine", "Puedo estudiar a mi ritmo."],
      ["la práctica oral", "speaking practice", "phrase", "feminine", "Necesito más práctica oral fuera de clase."],
      ["tener razón", "to be right", "phrase", null, "No necesitas tener razón para escuchar otro punto de vista."],
      ["de otra manera", "in a different way", "phrase", null, "Yo lo veo de otra manera."],
      ["el presupuesto", "budget", "noun", "masculine", "La elección depende del presupuesto disponible."],
      ["disponible", "available", "adjective", null, "Tenemos poco tiempo disponible."],
      ["en resumen", "in summary", "phrase", null, "En resumen, es flexible, pero exige práctica activa."]
    ]
  },
  {
    slug: "b1-story-sequencing-vocabulary",
    title: "B1 Story and Sequence Vocabulary",
    description: "Concrete event, sequence, and inference language for understanding and recounting short stories.",
    situation: "reconstructing what happened and why",
    imageKey: "conversation-and-opinion:9",
    topicSlug: "stories-comprehension",
    words: [
      ["el tráfico", "traffic", "noun", "masculine", "Había mucho tráfico y Ana llegó tarde."],
      ["lo ocurrido", "what happened", "phrase", null, "Ana explicó lo ocurrido al equipo."],
      ["la idea principal", "main idea", "phrase", "feminine", "La idea principal aparece al final del relato."],
      ["primero", "first in a sequence", "adverb", null, "Primero, preparé el desayuno."],
      ["luego", "then or afterward", "adverb", null, "Luego, fui al centro."],
      ["mientras", "while", "conjunction", null, "Mientras esperaba, empezó a llover."],
      ["por último", "lastly", "phrase", null, "Por último, volvimos a casa."],
      ["me encontré con", "I ran into or met", "phrase", null, "Después de comprar, me encontré con Marta."],
      ["el paraguas", "umbrella", "noun", "masculine", "Carlos entró con el paraguas mojado."],
      ["mojado", "wet", "adjective", "masculine", "Dejó el abrigo mojado junto a la puerta."],
      ["el cartel", "sign or notice", "noun", "masculine", "El cartel decía que la tienda abría a las cuatro."],
      ["una lluvia fuerte", "heavy rain", "phrase", "feminine", "Carlos había caminado bajo una lluvia fuerte."]
    ]
  },
  {
    slug: "b1-future-planning-vocabulary",
    title: "B1 Future Planning Vocabulary",
    description: "Time, planning, probability, and problem-solving language for realistic future situations.",
    situation: "planning ahead and reacting to possible outcomes",
    imageKey: "conversation-and-opinion:10",
    topicSlug: "future-real-conditions",
    words: [
      ["el próximo año", "next year", "phrase", "masculine", "El próximo año viajaré más."],
      ["el proyecto", "project", "noun", "masculine", "Podremos terminar el proyecto mañana."],
      ["salir bien", "to turn out well", "phrase", null, "Prepararse ayuda a que todo pueda salir bien."],
      ["más o menos", "more or less", "phrase", null, "Serán las ocho, más o menos."],
      ["ocupado", "busy", "adjective", "masculine", "No responderá porque está ocupado."],
      ["temprano", "early", "adverb", null, "Si termino temprano, prepararé la cena."],
      ["el equipo", "team", "noun", "masculine", "Después hablaré con el equipo."],
      ["resolver", "to solve or resolve", "verb", null, "Tenemos que resolver el problema juntos."],
      ["juntos", "together", "adverb", null, "Podemos resolverlo juntos."],
      ["antes del viernes", "before Friday", "phrase", null, "Tendremos una respuesta antes del viernes."],
      ["la respuesta", "answer or response", "noun", "feminine", "Espero recibir la respuesta mañana."],
      ["revisar", "to review or check", "verb", null, "Mañana voy a revisar el plan."]
    ]
  },
  {
    slug: "b1-subjunctive-interaction-vocabulary",
    title: "B1 Subjunctive Interaction Vocabulary",
    description: "Meaning frames for wishes, importance, possibility, concern, reactions, advice, and change.",
    situation: "reacting to and influencing another person's action",
    imageKey: "grammar-scenes:9",
    topicSlug: "present-subjunctive-meaning",
    words: [
      ["es importante que", "it is important that", "phrase", null, "Es importante que descanses."],
      ["es posible que", "it is possible that", "phrase", null, "Es posible que haya un problema."],
      ["es necesario que", "it is necessary that", "phrase", null, "Es necesario que hablemos hoy."],
      ["preocuparse", "to be concerned or worried", "verb", null, "Es normal preocuparse antes de una decisión importante."],
      ["sorprender", "to surprise", "verb", null, "La noticia puede sorprender a todo el equipo."],
      ["descansar", "to rest", "verb", null, "Es mejor descansar un poco antes de continuar."],
      ["buscar otra opción", "to look for another option", "phrase", null, "Podemos buscar otra opción si esta no funciona."],
      ["tener tiempo", "to have time", "phrase", null, "Quiero tener tiempo para hablar contigo mañana."],
      ["hablar más despacio", "to speak more slowly", "phrase", null, "Puedes hablar más despacio si alguien no entiende."],
      ["cambiar el plan", "to change the plan", "phrase", null, "No creo que sea necesario cambiar el plan."],
      ["estar mejor", "to feel or be better", "phrase", null, "Espero estar mejor después de descansar."],
      ["salga bien", "that it goes well", "phrase", null, "Espero que todo salga bien."]
    ]
  },
  {
    slug: "b1-perfect-experience-vocabulary",
    title: "B1 Experience and Perfect-Time Vocabulary",
    description: "Time markers and event vocabulary for recent experience and events before another past moment.",
    situation: "connecting experience, recent events, and earlier past causes",
    imageKey: "grammar-scenes:10",
    topicSlug: "perfect-past-connections",
    words: [
      ["esta semana", "this week", "phrase", "feminine", "Esta semana hemos hablado tres veces."],
      ["alguna vez", "ever or at some point", "phrase", null, "¿Has estado alguna vez en Sevilla?"],
      ["los hechos recientes", "recent events", "phrase", "masculine", "La forma elegida para los hechos recientes cambia según la región."],
      ["durante", "during or for", "preposition", null, "Hemos vivido aquí durante un año."],
      ["el correo", "mail or email", "noun", "masculine", "El correo ha llegado esta mañana."],
      ["todavía no", "not yet", "phrase", null, "Todavía no me ha respondido."],
      ["nunca", "never", "adverb", null, "Nunca hemos visitado Chile."],
      ["últimamente", "lately", "adverb", null, "Últimamente he dormido poco."],
      ["perder la llave", "to lose the key", "phrase", null, "Perder la llave puede cambiar todos tus planes."],
      ["por suerte", "fortunately", "phrase", null, "Por suerte, había escrito la dirección."],
      ["cerrar", "to close", "verb", null, "Decidieron cerrar la farmacia más temprano."],
      ["volver", "to return", "verb", null, "Quiero volver a casa antes de las ocho."]
    ]
  },
  {
    slug: "b1-conditional-advice-vocabulary",
    title: "B1 Conditional and Advice Vocabulary",
    description: "Chunks for polite possibilities, advice, imagined situations, and work or life decisions.",
    situation: "giving tactful advice and imagining alternatives",
    imageKey: "grammar-scenes:11",
    topicSlug: "conditional-hypotheses",
    words: [
      ["sería una buena idea", "it would be a good idea", "phrase", null, "Sería una buena idea reservar antes."],
      ["deberías", "you should", "verb", null, "Deberías descansar más."],
      ["yo que tú", "if I were you", "phrase", null, "Yo que tú, esperaría un día."],
      ["sería mejor", "it would be better", "phrase", null, "Sería mejor hablar primero con la directora."],
      ["¿te importaría...?", "would you mind...?", "phrase", null, "¿Te importaría repetirlo?"],
      ["cambiar de trabajo", "to change jobs", "phrase", null, "Me gustaría cambiar de trabajo."],
      ["buscar algo", "to look for something", "phrase", null, "Podría buscar algo más cerca."],
      ["el puesto", "job position", "noun", "masculine", "Si encontrara un buen puesto, lo aceptaría."],
      ["aceptar", "to accept", "verb", null, "Voy a aceptar el puesto si las condiciones son buenas."],
      ["terminar", "to finish", "verb", null, "Podríamos terminar hoy."],
      ["cerca del mar", "near the sea", "phrase", null, "Viviríamos cerca del mar."],
      ["dar una opinión", "to give an opinion", "phrase", null, "Antes de dar una opinión, quiero conocer todos los datos."]
    ]
  },
  {
    slug: "b1-command-action-vocabulary",
    title: "B1 Command and Action Vocabulary",
    description: "Everyday objects and action chunks used when giving, softening, or refusing instructions.",
    situation: "guiding another person through a practical task",
    imageKey: "grammar-scenes:12",
    topicSlug: "commands-combined-pronouns",
    words: [
      ["más despacio", "more slowly", "phrase", null, "Habla más despacio, por favor."],
      ["la puerta", "door", "noun", "feminine", "Abre la puerta y espera aquí."],
      ["aquí", "here", "adverb", null, "Escribe tu nombre aquí."],
      ["un momento", "a moment", "phrase", "masculine", "Espera un momento."],
      ["las verduras", "vegetables", "noun", "feminine", "Primero corta las verduras."],
      ["la salsa", "sauce", "noun", "feminine", "Después prepara la salsa."],
      ["tener cuidado", "to be careful", "phrase", null, "Es importante tener cuidado al salir."],
      ["otra vez", "again", "phrase", null, "Explícamelo otra vez, por favor."],
      ["todavía", "still or yet", "adverb", null, "No cierres la página todavía."],
      ["enviar", "to send", "verb", null, "Voy a enviar el documento esta tarde."],
      ["la aplicación", "application or app", "noun", "feminine", "Abre la aplicación."],
      ["el documento", "document", "noun", "masculine", "Mándame el documento, por favor."]
    ]
  },
  {
    slug: "b1-purpose-cause-route-vocabulary",
    title: "B1 Purpose, Cause, and Route Vocabulary",
    description: "Concrete nouns and chunks that make por and para relationships meaningful in real situations.",
    situation: "explaining purpose, cause, route, exchange, and deadlines",
    imageKey: "grammar-scenes:13",
    topicSlug: "por-para-relationships",
    words: [
      ["el objetivo", "goal or purpose", "noun", "masculine", "El objetivo es aprender español para viajar."],
      ["el destinatario", "recipient", "noun", "masculine", "Para introduce al destinatario de un regalo."],
      ["la fecha límite", "deadline", "phrase", "feminine", "Necesito el informe para la fecha límite."],
      ["el intercambio", "exchange", "noun", "masculine", "Por puede expresar un intercambio."],
      ["la causa", "cause or reason", "noun", "feminine", "La lluvia fue la causa del retraso."],
      ["la ruta", "route", "noun", "feminine", "Caminamos por una ruta cerca del río."],
      ["la duración", "duration", "noun", "feminine", "Por puede introducir la duración aproximada."],
      ["por teléfono", "by phone", "phrase", null, "Te llamo por teléfono esta tarde."],
      ["por correo", "by mail or email", "phrase", null, "Enviamos el documento por correo."],
      ["la carretera", "road or highway", "noun", "feminine", "Voy por la carretera del norte."],
      ["organizar", "to organize", "verb", null, "Gracias por organizar el viaje."],
      ["ganar dinero", "to earn money", "phrase", null, "Trabajo para ganar dinero."]
    ]
  }
];

async function main() {
  for (const groupInput of groups) {
    const { words, topicSlug, ...data } = groupInput;
    const group = await prisma.vocabularyGroup.upsert({
      where: { slug: groupInput.slug },
      update: data,
      create: { slug: groupInput.slug, ...data }
    });
    for (const [spanish, english, partOfSpeech, gender, example] of words) {
      const existing = await prisma.word.findFirst({ where: { groupId: group.id, spanish } });
      const wordData = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: group.id };
      if (existing) await prisma.word.update({ where: { id: existing.id }, data: wordData });
      else await prisma.word.create({ data: wordData });
    }
    await prisma.word.deleteMany({ where: { groupId: group.id, spanish: { notIn: words.map((word) => word[0]) } } });
    const lessons = await prisma.lesson.findMany({ where: { topic: { slug: topicSlug }, isPublished: true }, select: { id: true } });
    for (const lesson of lessons) {
      await prisma.lesson.update({ where: { id: lesson.id }, data: { vocabularyGroups: { connect: { id: group.id } } } });
    }
  }
  console.log(`Seeded ${groups.length} contextual B1 vocabulary groups with ${groups.reduce((total, group) => total + group.words.length, 0)} words.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());

module.exports = { groups };
