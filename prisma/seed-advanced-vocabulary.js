const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const groups = [
  {
    slug: "b1-conversation-stories",
    title: "B1 Conversation and Stories",
    description: "High-frequency language for expressing opinions, weighing options, and telling connected stories.",
    situation: "sharing a viewpoint and recounting what happened",
    imageKey: "conversation-and-opinion:8",
    words: [
      ["la opinión", "opinion", "noun", "feminine", "Quisiera conocer tu opinión antes de decidir."],
      ["estar de acuerdo", "to agree", "phrase", null, "Podemos estar de acuerdo en el objetivo principal."],
      ["no estar de acuerdo", "to disagree", "phrase", null, "Es posible no estar de acuerdo y hablar con respeto."],
      ["desde mi punto de vista", "from my point of view", "phrase", null, "Desde mi punto de vista, la segunda opción es más práctica."],
      ["por una parte", "on the one hand", "phrase", null, "Por una parte, el cambio ahorra tiempo."],
      ["por otra parte", "on the other hand", "phrase", null, "Por otra parte, requiere más formación."],
      ["el motivo", "reason or motive", "noun", "masculine", "El motivo principal es la falta de tiempo."],
      ["la ventaja", "advantage", "noun", "feminine", "La mayor ventaja es la flexibilidad."],
      ["el inconveniente", "drawback", "noun", "masculine", "El inconveniente es que cuesta más."],
      ["recomendar", "to recommend", "verb", null, "Puedo recomendar este curso por su enfoque práctico."],
      ["proponer", "to propose or suggest", "verb", null, "Voy a proponer una solución más sencilla."],
      ["contar", "to tell or recount", "verb", null, "Te voy a contar lo que ocurrió ayer."],
      ["ocurrir", "to happen", "verb", null, "Nadie sabía qué iba a ocurrir después."],
      ["darse cuenta de", "to realize", "phrase", null, "Tardó unos minutos en darse cuenta de su error."],
      ["de repente", "suddenly", "phrase", null, "De repente, se apagaron todas las luces."],
      ["mientras tanto", "meanwhile", "phrase", null, "Mientras tanto, nosotros buscamos otra salida."],
      ["al principio", "at first", "phrase", null, "Al principio, nadie entendía el problema."],
      ["al final", "in the end", "phrase", null, "Al final, encontramos una solución."],
      ["según", "according to", "preposition", null, "Según Ana, la reunión empezó tarde."],
      ["por lo visto", "apparently", "phrase", null, "Por lo visto, cambiaron el horario esta mañana."]
    ]
  },
  {
    slug: "b1-plans-reactions",
    title: "B1 Plans and Reactions",
    description: "Useful chunks for plans, wishes, reactions, advice, conditions, causes, and time relationships.",
    situation: "coordinating plans and reacting to possible outcomes",
    imageKey: "conversation-and-opinion:10",
    words: [
      ["tener previsto", "to plan or intend", "phrase", null, "Tener previsto un plan alternativo evita decisiones apresuradas."],
      ["estar a punto de", "to be about to", "phrase", null, "Estar a punto de salir no significa que ya sea tarde."],
      ["quedar en", "to agree on", "phrase", null, "Podemos quedar en llamarnos mañana."],
      ["aplazar", "to postpone", "verb", null, "Tuvieron que aplazar la reunión hasta el lunes."],
      ["cumplir", "to fulfill or comply", "verb", null, "Es importante cumplir lo prometido."],
      ["prometer", "to promise", "verb", null, "No puedo prometer que llegaré a tiempo."],
      ["esperar que", "to hope that", "phrase", null, "Esperar que todo salga bien no basta: también hay que prepararse."],
      ["querer que", "to want someone to", "phrase", null, "Querer que todo cambie de inmediato no siempre es realista."],
      ["alegrarse de que", "to be glad that", "phrase", null, "Alegrarse de que alguien progrese fortalece la relación."],
      ["dudar que", "to doubt that", "phrase", null, "Dudar que terminen hoy no significa rendirse."],
      ["aconsejar", "to advise", "verb", null, "Te puedo aconsejar que descanses un poco."],
      ["ojalá", "hopefully or if only", "adverb", null, "Ojalá tengamos buen tiempo mañana."],
      ["si pudiera", "if I could", "phrase", null, "Si pudiera, viajaría durante un mes."],
      ["me gustaría", "I would like", "phrase", null, "Me gustaría aprender a hablar con más fluidez."],
      ["por culpa de", "because of something negative", "phrase", null, "Llegamos tarde por culpa de una avería."],
      ["gracias a", "thanks to", "phrase", null, "Terminamos a tiempo gracias a tu ayuda."],
      ["a través de", "through or by means of", "phrase", null, "Nos conocimos a través de una amiga."],
      ["con tal de que", "provided that", "phrase", null, "Iré con tal de que volvamos temprano."],
      ["tan pronto como", "as soon as", "phrase", null, "Te llamaré tan pronto como llegue."],
      ["antes de que", "before", "phrase", null, "Tenemos que salir antes de que empiece a llover."]
    ]
  },
  {
    slug: "b2-discourse-reporting",
    title: "B2 Discourse and Reporting",
    description: "Connectors and reporting language for balanced arguments, causes, consequences, and attributed information.",
    situation: "building an argument and accurately reporting another person's message",
    imageKey: "conversation-and-opinion:13",
    words: [
      ["aunque", "although or even if", "conjunction", null, "Aunque sea difícil, vale la pena intentarlo."],
      ["pese a que", "despite the fact that", "phrase", null, "Pese a que llovía, continuaron el acto."],
      ["sin embargo", "however", "phrase", null, "La idea es interesante; sin embargo, falta financiación."],
      ["por consiguiente", "consequently", "phrase", null, "No recibimos respuesta; por consiguiente, aplazamos la decisión."],
      ["por lo tanto", "therefore", "phrase", null, "Los datos están incompletos; por lo tanto, no podemos concluir nada."],
      ["debido a", "due to", "phrase", null, "El vuelo fue cancelado debido a la tormenta."],
      ["dado que", "given that or since", "phrase", null, "Dado que todos están de acuerdo, podemos avanzar."],
      ["siempre que", "provided that", "phrase", null, "Puedes participar siempre que respetes las normas."],
      ["a menos que", "unless", "phrase", null, "Saldremos mañana a menos que cambie el tiempo."],
      ["afirmar", "to state or assert", "verb", null, "La portavoz se negó a afirmar que el acuerdo fuera definitivo."],
      ["señalar", "to point out", "verb", null, "El informe debe señalar los límites del estudio."],
      ["admitir", "to admit or acknowledge", "verb", null, "El director tuvo que admitir que hubo errores."],
      ["negar", "to deny", "verb", null, "La empresa decidió negar las acusaciones."],
      ["advertir", "to warn", "verb", null, "Los expertos quieren advertir de un posible riesgo."],
      ["preguntar si", "to ask whether", "phrase", null, "Ana llamó para preguntar si quedaban plazas."],
      ["pedir que", "to ask someone to", "phrase", null, "Nos van a pedir que enviemos otra copia."],
      ["según explicó", "as someone explained", "phrase", null, "Según explicó la médica, el cambio será gradual."],
      ["la fuente", "source", "noun", "feminine", "La fuente no quiso revelar su identidad."],
      ["la afirmación", "claim or statement", "noun", "feminine", "La afirmación necesita pruebas más sólidas."],
      ["la consecuencia", "consequence", "noun", "feminine", "La consecuencia principal fue un retraso de dos días."]
    ]
  },
  {
    slug: "b2-complex-structures",
    title: "B2 Complex Structures",
    description: "Functional vocabulary for reference, impersonal structures, verbal periphrases, hypotheses, requirements, and exceptions.",
    situation: "following dense instructions and expressing complex relationships precisely",
    imageKey: "grammar-scenes:14",
    words: [
      ["el antecedente", "antecedent", "noun", "masculine", "El antecedente del pronombre no está claro."],
      ["la referencia", "reference", "noun", "feminine", "La referencia apunta al párrafo anterior."],
      ["cuyo", "whose", "pronoun", null, "Conocí a una autora cuyo libro ganó el premio."],
      ["el cual", "which or who", "pronoun", null, "Firmaron un acuerdo, el cual entrará en vigor mañana."],
      ["lo que", "what or that which", "pronoun", null, "No entiendo lo que quieres decir."],
      ["se trata de", "it concerns or it is about", "phrase", null, "Se trata de encontrar una solución duradera."],
      ["se permite", "it is permitted", "phrase", null, "Se permite entrar hasta las ocho."],
      ["se requiere", "it is required", "phrase", null, "Se requiere experiencia previa para el puesto."],
      ["se me olvidó", "I forgot accidentally", "phrase", null, "Se me olvidó enviar el documento."],
      ["llevar tiempo haciendo algo", "to have been doing something for a while", "phrase", null, "Llevar tiempo haciendo algo expresa duración hasta el presente."],
      ["seguir haciendo algo", "to continue doing something", "phrase", null, "Vamos a seguir haciendo algo útil cada día."],
      ["soler", "to usually do", "verb", null, "Soler cenar tarde no significa dormir poco."],
      ["acabar de", "to have just done", "phrase", null, "Acabar de llegar indica que la llegada es muy reciente."],
      ["dejar de", "to stop doing", "phrase", null, "Decidió dejar de fumar."],
      ["volver a", "to do again", "phrase", null, "Tenemos que volver a intentarlo."],
      ["la hipótesis", "hypothesis", "noun", "feminine", "La hipótesis explica los datos de forma provisional."],
      ["el requisito", "requirement", "noun", "masculine", "El requisito principal es presentar una identificación."],
      ["la excepción", "exception", "noun", "feminine", "La norma tiene una excepción importante."],
      ["la condición", "condition", "noun", "feminine", "Aceptaron el acuerdo con una condición."],
      ["el punto clave", "key point", "noun", "masculine", "El punto clave aparece al final del mensaje."]
    ]
  },
  {
    slug: "c1-register-argument",
    title: "C1 Register and Argument",
    description: "Precise vocabulary for qualifying claims, weighing evidence, and structuring a nuanced argument.",
    situation: "discussing evidence and defending a qualified position",
    imageKey: "conversation-and-opinion:14",
    words: [
      ["matizar", "to qualify or nuance a claim", "verb", null, "Conviene matizar esa afirmación antes de publicarla."],
      ["sostener", "to maintain or argue", "verb", null, "La autora puede sostener que la medida fue insuficiente."],
      ["cuestionar", "to question or challenge", "verb", null, "Los datos permiten cuestionar esa conclusión."],
      ["rebatir", "to refute", "verb", null, "El informe intenta rebatir la objeción con nuevos datos."],
      ["respaldar", "to support with evidence", "verb", null, "Dos estudios pueden respaldar esta interpretación."],
      ["el planteamiento", "line of reasoning or approach", "noun", "masculine", "El planteamiento resulta claro, aunque incompleto."],
      ["la premisa", "premise", "noun", "feminine", "La conclusión depende de una premisa discutible."],
      ["la objeción", "objection", "noun", "feminine", "La ponente respondió a la objeción principal."],
      ["la salvedad", "qualification or caveat", "noun", "feminine", "Aceptó la propuesta con una salvedad importante."],
      ["el alcance", "scope or reach", "noun", "masculine", "Debemos precisar el alcance de la conclusión."],
      ["la postura", "stance or position", "noun", "feminine", "Su postura cambió al conocer los resultados."],
      ["el sesgo", "bias", "noun", "masculine", "La selección de participantes puede introducir un sesgo."],
      ["la evidencia", "evidence", "noun", "feminine", "La evidencia disponible todavía es limitada."],
      ["verosímil", "plausible", "adjective", null, "Es una explicación verosímil, pero no demostrada."],
      ["contundente", "compelling or forceful", "adjective", null, "El argumento parece contundente a primera vista."],
      ["pertinente", "relevant or pertinent", "adjective", null, "La comparación no es pertinente en este contexto."],
      ["no obstante", "nevertheless", "phrase", null, "La muestra es pequeña; no obstante, el patrón se repite."],
      ["ahora bien", "that said or however", "phrase", null, "La propuesta es viable. Ahora bien, requiere financiación."],
      ["en la medida en que", "insofar as", "phrase", null, "La medida será útil en la medida en que se aplique bien."],
      ["cabe señalar", "it is worth noting", "phrase", null, "Cabe señalar que los datos son provisionales."]
    ]
  },
  {
    slug: "c1-narrative-interaction",
    title: "C1 Narrative and Interaction",
    description: "Vocabulary for viewpoint, implied meaning, narrative structure, and tactful spoken interaction.",
    situation: "reconstructing events and managing a nuanced discussion",
    imageKey: "conversation-and-opinion:12",
    words: [
      ["el desenlace", "outcome or ending", "noun", "masculine", "El desenlace cambia nuestra interpretación del relato."],
      ["el trasfondo", "background or underlying context", "noun", "masculine", "Sin ese trasfondo, la decisión parece arbitraria."],
      ["el indicio", "clue or indication", "noun", "masculine", "Ese detalle constituye el primer indicio del conflicto."],
      ["el punto de vista", "point of view", "noun", "masculine", "La escena se narra desde otro punto de vista."],
      ["dar a entender", "to imply", "phrase", null, "Su respuesta parece dar a entender que ya lo sabía."],
      ["pasar por alto", "to overlook", "phrase", null, "El resumen no debe pasar por alto una condición esencial."],
      ["rectificar", "to correct oneself", "verb", null, "La portavoz tuvo que rectificar la cifra durante la entrevista."],
      ["interrumpir", "to interrupt", "verb", null, "No quisiera interrumpir, pero falta un dato."],
      ["discrepar", "to disagree", "verb", null, "Es posible discrepar sin perder de vista el objetivo común."],
      ["ceder la palabra", "to yield the floor", "phrase", null, "Voy a ceder la palabra a mi compañera."],
      ["tomar la palabra", "to take the floor", "phrase", null, "El moderador le invitó a tomar la palabra."],
      ["aclarar", "to clarify", "verb", null, "Quisiera aclarar qué ocurrió exactamente."],
      ["insinuar", "to hint or insinuate", "verb", null, "El narrador parece insinuar una causa sin afirmarla."],
      ["reprochar", "to reproach", "verb", null, "No sirve reprochar a nadie no haber avisado antes."],
      ["mostrarse reacio", "to be reluctant", "phrase", null, "El equipo puede mostrarse reacio a cambiar el plan."],
      ["de ahí que", "hence the fact that", "phrase", null, "Faltaban pruebas, de ahí que aplazaran la decisión."],
      ["a raíz de", "as a result of", "phrase", null, "A raíz de este incidente, revisaron el protocolo."],
      ["por aquel entonces", "back then", "phrase", null, "Por aquel entonces, nadie conocía el riesgo."],
      ["al fin y al cabo", "after all", "phrase", null, "Al fin y al cabo, todos buscaban una solución."],
      ["a grandes rasgos", "in broad terms", "phrase", null, "A grandes rasgos, las dos versiones coinciden."]
    ]
  },
  {
    slug: "c2-precision-mediation-vocabulary",
    title: "C2 Precision and Mediation",
    description: "Vocabulary for resolving ambiguity, preserving evidence, reconciling sources, and mediating dense information.",
    situation: "editing and reformulating complex information without distortion",
    imageKey: "grammar-scenes:16",
    words: [
      ["la ambigüedad", "ambiguity", "noun", "feminine", "La ambigüedad permite dos interpretaciones incompatibles."],
      ["el referente", "referent", "noun", "masculine", "El pronombre no tiene un referente claro."],
      ["la atribución", "attribution", "noun", "feminine", "La atribución causal todavía no está demostrada."],
      ["el umbral", "threshold", "noun", "masculine", "La concentración superó el umbral establecido."],
      ["el hallazgo", "finding", "noun", "masculine", "El hallazgo debe interpretarse con cautela."],
      ["la fiabilidad", "reliability", "noun", "feminine", "La pérdida de datos reduce la fiabilidad del resultado."],
      ["la incertidumbre", "uncertainty", "noun", "feminine", "La síntesis conserva el grado de incertidumbre."],
      ["distorsionar", "to distort", "verb", null, "Una simplificación excesiva puede distorsionar el mensaje."],
      ["conciliar", "to reconcile", "verb", null, "El análisis intenta conciliar los dos informes."],
      ["jerarquizar", "to prioritize information", "verb", null, "Resumir exige jerarquizar la información."],
      ["reformular", "to reformulate", "verb", null, "Hay que reformular la frase para un público general."],
      ["desambiguar", "to disambiguate", "verb", null, "Repetir el sustantivo permite desambiguar el referente."],
      ["la inferencia", "inference", "noun", "feminine", "La inferencia es razonable, aunque no necesaria."],
      ["el matiz", "nuance", "noun", "masculine", "La versión breve pierde un matiz decisivo."],
      ["la connotación", "connotation", "noun", "feminine", "Las dos palabras tienen distinta connotación."],
      ["inequívoco", "unambiguous", "adjective", null, "El criterio debe quedar expresado de modo inequívoco."],
      ["concluyente", "conclusive", "adjective", null, "La asociación observada no es concluyente."],
      ["fidedigno", "faithful or reliable", "adjective", null, "Necesitamos un resumen breve pero fidedigno."],
      ["en términos llanos", "in plain terms", "phrase", null, "En términos llanos, el riesgo sigue presente."],
      ["sin menoscabo de", "without prejudice to", "phrase", null, "La medida se aplicará sin menoscabo de sus derechos."]
    ]
  },
  {
    slug: "c2-rhetoric-variation-vocabulary",
    title: "C2 Rhetoric and Variation",
    description: "Vocabulary for rhetorical effect, genre, social distance, and variation across the Spanish-speaking world.",
    situation: "interpreting style, power, irony, and regional language choices",
    imageKey: "conversation-and-opinion:16",
    words: [
      ["la ironía", "irony", "noun", "feminine", "La ironía invierte la valoración aparente."],
      ["el eufemismo", "euphemism", "noun", "masculine", "El comunicado emplea un eufemismo para suavizar el conflicto."],
      ["la hipérbole", "hyperbole", "noun", "feminine", "La hipérbole intensifica el efecto cómico."],
      ["la atenuación", "mitigation or softening", "noun", "feminine", "La atenuación protege la relación entre los interlocutores."],
      ["el énfasis", "emphasis", "noun", "masculine", "El cambio de orden desplaza el énfasis."],
      ["el registro", "language register", "noun", "masculine", "El registro debe ajustarse al público y al propósito."],
      ["el tratamiento", "form of address", "noun", "masculine", "El tratamiento revela cercanía y jerarquía."],
      ["el voseo", "use of vos", "noun", "masculine", "El voseo es habitual en varias regiones."],
      ["el tuteo", "use of tú", "noun", "masculine", "El tuteo puede indicar cercanía."],
      ["el ustedeo", "use of usted", "noun", "masculine", "El ustedeo no expresa la misma distancia en todas partes."],
      ["dialectal", "dialectal", "adjective", null, "La forma es dialectal, no incorrecta."],
      ["coloquial", "colloquial", "adjective", null, "La expresión resulta natural en un contexto coloquial."],
      ["solemne", "solemn", "adjective", null, "El cierre adopta un tono deliberadamente solemne."],
      ["despectivo", "derogatory", "adjective", null, "El sufijo puede adquirir un valor despectivo."],
      ["entrañar", "to entail", "verb", null, "La elección puede entrañar una valoración implícita."],
      ["suscitar", "to prompt or arouse", "verb", null, "La formulación puede suscitar rechazo."],
      ["recalcar", "to emphasize", "verb", null, "La autora quiere recalcar la excepción más importante."],
      ["subvertir", "to subvert", "verb", null, "El texto busca subvertir la convención para producir humor."],
      ["a sabiendas", "knowingly", "phrase", null, "Omitió el dato a sabiendas de su importancia."],
      ["dicho sea de paso", "incidentally", "phrase", null, "Dicho sea de paso, el término ha cambiado de sentido."]
    ]
  }
];

async function main() {
  for (const groupInput of groups) {
    const { words, ...data } = groupInput;
    const group = await prisma.vocabularyGroup.upsert({
      where: { slug: groupInput.slug },
      update: data,
      create: data
    });
    for (const [spanish, english, partOfSpeech, gender, example] of words) {
      const existing = await prisma.word.findFirst({ where: { groupId: group.id, spanish } });
      const wordData = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: group.id };
      if (existing) await prisma.word.update({ where: { id: existing.id }, data: wordData });
      else await prisma.word.create({ data: wordData });
    }
  }
  console.log(`Seeded ${groups.length} advanced vocabulary groups with ${groups.reduce((total, group) => total + group.words.length, 0)} words.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());

module.exports = { groups };
