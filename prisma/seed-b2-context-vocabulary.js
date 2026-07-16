const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const groups = [
  {
    slug: "b2-discourse-context-vocabulary",
    title: "B2 Discourse in Context",
    description: "Concrete language for concessions, causes, cautious claims, and structured proposals.",
    situation: "weighing evidence and organizing a balanced argument",
    imageKey: "conversation-and-opinion:13",
    topicSlug: "b2-discourse-connectors",
    words: [
      ["la formación", "training or education", "noun", "feminine", "La formación merece la pena porque abre nuevas posibilidades."],
      ["sus oportunidades", "his, her, or their opportunities", "phrase", "feminine", "El curso puede mejorar sus oportunidades profesionales."],
      ["gastar tanto dinero", "to spend so much money", "phrase", null, "No sabe si es el momento adecuado para gastar tanto dinero."],
      ["otros gastos", "other expenses", "phrase", "masculine", "Tendrá que reducir otros gastos durante unos meses."],
      ["la hora prevista", "the scheduled time", "phrase", "feminine", "El festival abrió a la hora prevista."],
      ["el público", "the audience or public", "noun", "masculine", "El público permaneció en la plaza a pesar del frío."],
      ["cancelar", "to cancel", "verb", null, "Tuvieron que cancelar el último concierto."],
      ["el plazo inicial", "the initial deadline", "phrase", "masculine", "El plazo inicial había sido demasiado corto."],
      ["errores en los informes", "errors in the reports", "phrase", "masculine", "El plazo breve produjo errores en los informes."],
      ["nuevas tarifas", "new rates or fees", "phrase", "feminine", "Todavía no han anunciado nuevas tarifas."],
      ["gradualmente", "gradually", "adverb", null, "La propuesta debe aplicarse gradualmente."],
      ["una posibilidad", "a possibility", "phrase", "feminine", "El sacrificio económico todavía es una posibilidad."]
    ]
  },
  {
    slug: "b2-reported-context-vocabulary",
    title: "B2 Reported Communication in Context",
    description: "Reference, source, timing, and workplace language for accurately relaying another person's message.",
    situation: "reporting statements, questions, requests, and shifted references",
    imageKey: "conversation-and-opinion:14",
    topicSlug: "b2-reported-speech",
    words: [
      ["la fecha final", "the final date", "phrase", "feminine", "Luis afirma que todavía no conoce la fecha final."],
      ["revisar los datos", "to review the data", "phrase", null, "Ana necesita más tiempo para revisar los datos."],
      ["el seguimiento", "follow-up or monitoring", "noun", "masculine", "El informe recomienda mantener el seguimiento."],
      ["al día siguiente", "the following day", "phrase", null, "Ana prometió que llamaría al día siguiente."],
      ["el trayecto diario", "the daily commute or journey", "phrase", "masculine", "El trayecto diario también explicaba su cansancio."],
      ["las dudas del equipo", "the team's questions or doubts", "phrase", "feminine", "Clara explicó las dudas del equipo."],
      ["la versión definitiva", "the final version", "phrase", "feminine", "Luis quería saber dónde estaba la versión definitiva."],
      ["cambiar de opinión", "to change one's mind", "phrase", null, "Pablo explicó por qué había decidido cambiar de opinión."],
      ["la primera sesión", "the first session", "phrase", "feminine", "Pidieron que nadie llegara tarde a la primera sesión."],
      ["la perspectiva", "perspective", "noun", "feminine", "Las referencias cambiaron con la perspectiva del hablante."],
      ["buena cobertura", "good signal or coverage", "phrase", "feminine", "Ana explicó que allí no había buena cobertura."],
      ["una última vez", "one last time", "phrase", "feminine", "El profesor pidió que revisaran la presentación una última vez."]
    ]
  },
  {
    slug: "b2-relative-context-vocabulary",
    title: "B2 Relative-Clause Context Vocabulary",
    description: "People, projects, evidence, and place language carried by increasingly precise relative clauses.",
    situation: "connecting detailed information without losing its relationship",
    imageKey: "grammar-scenes:14",
    topicSlug: "b2-relative-clauses",
    words: [
      ["los nuevos voluntarios", "the new volunteers", "phrase", "masculine", "Marta explica las necesidades a los nuevos voluntarios."],
      ["una página web", "a website", "phrase", "feminine", "Buscan a alguien que pueda diseñar una página web."],
      ["todas las herramientas necesarias", "all the necessary tools", "phrase", "feminine", "No hay nadie que conozca todas las herramientas necesarias."],
      ["la falta de presupuesto", "lack of budget", "phrase", "feminine", "El problema es la falta de presupuesto."],
      ["proteger los árboles", "to protect the trees", "phrase", null, "El primer diseño no permitía proteger los árboles."],
      ["la mayoría", "the majority", "noun", "feminine", "La mayoría prefería la propuesta más económica."],
      ["miembros indecisos", "undecided members", "phrase", "masculine", "La explicación convenció a varios miembros indecisos."],
      ["el congreso", "conference or congress", "noun", "masculine", "En el congreso conocimos a una arquitecta."],
      ["una arquitecta", "a female architect", "phrase", "feminine", "Conocimos a una arquitecta cuyos proyectos transformaron el barrio."],
      ["comunidades locales", "local communities", "phrase", "feminine", "Su estudio trabaja con comunidades locales."],
      ["el impacto", "impact", "noun", "masculine", "Presentó una iniciativa cuyo impacto puede medirse."],
      ["un conflicto", "a conflict", "phrase", "masculine", "Una vecina resolvió un conflicto de manera inesperada."]
    ]
  },
  {
    slug: "b2-se-context-vocabulary",
    title: "B2 Se Constructions in Context",
    description: "People, objects, rules, and events that make each distinct function of se concrete.",
    situation: "describing reciprocal, impersonal, passive, and accidental events",
    imageKey: "grammar-scenes:15",
    topicSlug: "b2-se-constructions",
    words: [
      ["en el espejo", "in the mirror", "phrase", null, "Ana se mira en el espejo antes de salir."],
      ["viejos amigos", "old friends", "phrase", "masculine", "Ana se encuentra con dos viejos amigos."],
      ["números de teléfono", "phone numbers", "phrase", "masculine", "Los amigos se escriben sus nuevos números de teléfono."],
      ["con tranquilidad", "calmly or peacefully", "phrase", null, "En este barrio se vive con tranquilidad."],
      ["sin permiso", "without permission", "phrase", null, "No se puede entrar sin permiso."],
      ["tres habitaciones", "three rooms", "phrase", "feminine", "En el barrio se alquilan tres habitaciones."],
      ["un proyecto cultural", "a cultural project", "phrase", "masculine", "Se necesitan personas con experiencia para un proyecto cultural."],
      ["los resultados de una consulta", "the results of a survey", "phrase", "masculine", "Ayer se publicaron los resultados de una consulta."],
      ["varias medidas", "several measures", "phrase", "feminine", "Esta semana se han tomado varias medidas."],
      ["la cartera", "wallet", "noun", "feminine", "Se me olvidó la cartera en la cocina."],
      ["las tostadas", "toast", "noun", "feminine", "Se te han quemado las tostadas."],
      ["tres candidatos", "three candidates", "phrase", "masculine", "Se entrevistó a tres candidatos."]
    ]
  },
  {
    slug: "b2-past-subjunctive-context-vocabulary",
    title: "B2 Past Subjunctive in Context",
    description: "Classroom, influence, reaction, and counterfactual vocabulary used around past subjunctive choices.",
    situation: "reconstructing past wishes, uncertainty, and unreal alternatives",
    imageKey: "grammar-scenes:16",
    topicSlug: "b2-past-subjunctive",
    words: [
      ["las tres conjugaciones", "the three conjugations", "phrase", "feminine", "El procedimiento sirve para las tres conjugaciones."],
      ["una segunda lista independiente", "a second independent list", "phrase", "feminine", "Los cambios no forman una segunda lista independiente."],
      ["una sorpresa", "a surprise", "phrase", "feminine", "La familia preparaba una sorpresa."],
      ["los preparativos", "the preparations", "noun", "masculine", "Todos terminaron los preparativos ese día."],
      ["el primer aviso", "the first warning or notice", "phrase", "masculine", "Nadie respondió al primer aviso."],
      ["el plan provisional", "the provisional plan", "phrase", "masculine", "Dudaban que el plan provisional funcionara."],
      ["reparar el servidor", "to repair the server", "phrase", null, "Buscaban a alguien que supiera reparar el servidor."],
      ["todas las habitaciones", "all the rooms", "phrase", "feminine", "Dudaban que hubieran reservado todas las habitaciones."],
      ["el último tren", "the last train", "phrase", "masculine", "Más tarde perdieron el último tren."],
      ["el tren directo", "the direct train", "phrase", "masculine", "Habrían tomado el tren directo si hubieran salido antes."],
      ["una larga espera", "a long wait", "phrase", "feminine", "El cambio de horario produjo una larga espera."],
      ["la carretera estaba cortada", "the road was closed or blocked", "phrase", "feminine", "No sabían que la carretera estaba cortada."]
    ]
  },
  {
    slug: "b2-periphrasis-context-vocabulary",
    title: "B2 Verbal Periphrasis in Context",
    description: "Time, continuity, duration, habit, and change vocabulary surrounding verbal periphrases.",
    situation: "locating an action inside its current phase",
    imageKey: "grammar-scenes:17",
    topicSlug: "b2-verbal-periphrases",
    words: [
      ["inmediatamente antes", "immediately before", "phrase", null, "La acción ocurrió inmediatamente antes de la conversación."],
      ["la conversación actual", "the current conversation", "phrase", "feminine", "La salida no es anterior a la conversación actual."],
      ["la continuidad", "continuity", "noun", "feminine", "Seguir destaca la continuidad de una acción."],
      ["el obstáculo", "obstacle", "noun", "masculine", "El obstáculo no interrumpe necesariamente la acción."],
      ["media hora", "half an hour", "phrase", "feminine", "Llevamos media hora esperando."],
      ["un punto de referencia", "a reference point", "phrase", "masculine", "El contexto sitúa un punto de referencia en el pasado."],
      ["lo típico", "what is typical", "phrase", null, "La pregunta busca lo típico de la rutina actual."],
      ["en bicicleta", "by bicycle", "phrase", null, "Pablo suele ir al trabajo en bicicleta."],
      ["financiación", "funding", "noun", "feminine", "El equipo dejó de trabajar porque faltaba financiación."],
      ["usuarios reales", "real users", "phrase", "masculine", "Empezaron a probar la aplicación con usuarios reales."],
      ["funciones nuevas", "new features or functions", "phrase", "feminine", "Dejaron de añadir funciones nuevas."],
      ["una fase distinta", "a different phase", "phrase", "feminine", "Cada perífrasis muestra una fase distinta del cambio."]
    ]
  },
  {
    slug: "b2-reading-context-vocabulary",
    title: "B2 Reading and Inference in Context",
    description: "Civic, workplace, and evidence vocabulary required for identifying claims and drawing supported inferences.",
    situation: "reading for cause, evidence, viewpoint, and reference",
    imageKey: "reading-scenes:5",
    topicSlug: "b2-reading-inference",
    words: [
      ["el ayuntamiento", "city council", "noun", "masculine", "El ayuntamiento amplió el horario de la biblioteca."],
      ["el horario", "schedule or opening hours", "noun", "masculine", "El nuevo horario permite asistir por la tarde."],
      ["un espacio de encuentro", "a meeting place", "phrase", "masculine", "La biblioteca funciona también como un espacio de encuentro."],
      ["atascos diarios", "daily traffic jams", "phrase", "masculine", "La calle sufría atascos diarios."],
      ["los peatones", "pedestrians", "noun", "masculine", "Los peatones apenas tenían espacio."],
      ["las ventas", "sales", "noun", "feminine", "Las ventas no disminuyeron después del cambio."],
      ["tiempo de desplazamiento", "commuting or travel time", "phrase", "masculine", "Muchos empleados ahorran tiempo de desplazamiento."],
      ["un modelo híbrido", "a hybrid model", "phrase", "masculine", "La empresa adoptó un modelo híbrido."],
      ["varias ramas", "several branches", "phrase", "feminine", "La tormenta derribó varias ramas."],
      ["una nota de agradecimiento", "a thank-you note", "phrase", "feminine", "Julia dejó una nota de agradecimiento."],
      ["una solicitud previa", "a prior application or request", "phrase", "feminine", "El uso de la sala requiere una solicitud previa."],
      ["veinticuatro horas de antelación", "twenty-four hours' notice", "phrase", "feminine", "La cancelación exige veinticuatro horas de antelación."]
    ]
  },
  {
    slug: "b2-listening-context-vocabulary",
    title: "B2 Listening Tasks in Context",
    description: "High-value details from voicemails, announcements, interviews, narratives, and instructions.",
    situation: "extracting decisive details from connected spoken messages",
    imageKey: "conversation-and-opinion:15",
    topicSlug: "b2-listening-comprehension",
    words: [
      ["la lista definitiva", "the final list", "phrase", "feminine", "Clara tiene que enviar la lista definitiva antes de las seis."],
      ["obras urgentes", "urgent construction work", "phrase", "feminine", "La línea cerrará debido a unas obras urgentes."],
      ["autobuses gratuitos", "free buses", "phrase", "masculine", "Habrá autobuses gratuitos cada quince minutos."],
      ["el servicio normal", "normal service", "phrase", "masculine", "El servicio normal se reanudará el lunes."],
      ["afectados", "affected", "adjective", "masculine", "Los trenes hacia el aeropuerto no se verán afectados."],
      ["a solas", "alone or on one's own", "phrase", null, "Diego se concentra mejor a solas."],
      ["la cartera", "wallet", "noun", "feminine", "Una mujer había encontrado la cartera."],
      ["la carpeta", "folder", "noun", "feminine", "Sube el documento a la carpeta de proyectos finales."],
      ["comprimir", "to compress", "verb", null, "Si el archivo ocupa demasiado, debes comprimir el documento."],
      ["quedar registrado", "to remain recorded", "phrase", null, "El archivo debe quedar registrado en la plataforma."],
      ["mantener su plaza", "to keep one's place", "phrase", null, "Los inscritos pueden mantener su plaza."],
      ["al mediodía", "at noon", "phrase", null, "Deben responder antes del viernes al mediodía."]
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
  console.log(`Seeded ${groups.length} contextual B2 vocabulary groups with ${groups.reduce((total, group) => total + group.words.length, 0)} words.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());

module.exports = { groups };
