const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const groups = [
  {
    slug: "c1-register-context-vocabulary",
    title: "C1 Register and Precision in Context",
    description: "Institutional, analytical, and collocational language for precise register choices.",
    situation: "adapting a precise message to relationship and purpose",
    imageKey: "conversation-and-opinion:14",
    topicSlug: "c1-register-precision",
    words: [
      ["antes de finalizar la jornada", "before the end of the working day", "phrase", null, "Le agradecería que respondiera antes de finalizar la jornada."],
      ["remitir la documentación", "to forward the documentation", "phrase", null, "Debemos remitir la documentación mañana."],
      ["apariencia de exigencia", "appearance of a demand", "phrase", "feminine", "La formulación reduce cualquier apariencia de exigencia."],
      ["escasez absoluta", "absolute shortage", "phrase", "feminine", "El problema no procede de una escasez absoluta de recursos."],
      ["entre departamentos", "between departments", "phrase", null, "Los recursos se distribuyen sin coordinación entre departamentos."],
      ["el público general", "the general public", "phrase", "masculine", "La portavoz adapta la explicación para el público general."],
      ["un efecto limitado", "a limited effect", "phrase", "masculine", "Todo apunta a que la medida tendrá un efecto limitado."],
      ["la próxima evaluación", "the next evaluation", "phrase", "feminine", "Convendría esperar a la próxima evaluación."],
      ["personal especializado", "specialized staff", "phrase", "masculine", "Resulta difícil encontrar personal especializado."],
      ["una medida de apoyo", "a support measure", "phrase", "feminine", "La empresa amplió una medida de apoyo temporal."],
      ["entrar en vigor", "to enter into force", "phrase", null, "Las nuevas reglas van a entrar en vigor el próximo mes."],
      ["numerosas protestas", "numerous protests", "phrase", "feminine", "El cambio dio lugar a numerosas protestas."]
    ]
  },
  {
    slug: "c1-narrative-context-vocabulary",
    title: "C1 Narrative Viewpoint in Context",
    description: "Scene, tempo, memory, viewpoint, and reporting language for controlled narratives.",
    situation: "controlling narrative distance and the release of information",
    imageKey: "conversation-and-opinion:12",
    topicSlug: "c1-narrative-viewpoint",
    words: [
      ["casi vacía", "almost empty", "phrase", "feminine", "La plaza estaba casi vacía."],
      ["sin prisa", "without hurry", "phrase", null, "Marta caminaba sin prisa por la plaza."],
      ["de golpe", "suddenly or with a bang", "phrase", null, "Una puerta se cerró de golpe."],
      ["unos segundos", "a few seconds", "phrase", "masculine", "Durante unos segundos, nadie se movió."],
      ["años atrás", "years earlier", "phrase", null, "Años atrás, su abuelo le había dejado una carta."],
      ["un sobre idéntico", "an identical envelope", "phrase", "masculine", "Su abuelo le había dejado un sobre idéntico."],
      ["la letra", "handwriting or letter", "noun", "feminine", "Al abrir la carta, reconoció enseguida la letra."],
      ["una decisión inevitable", "an unavoidable decision", "phrase", "feminine", "El director aseguró que era una decisión inevitable."],
      ["alternativas", "alternatives", "noun", "feminine", "Clara pensaba que aún quedaban alternativas."],
      ["sin hacer declaraciones", "without making a statement", "phrase", null, "Los representantes salieron sin hacer declaraciones."],
      ["una alarma defectuosa", "a faulty alarm", "phrase", "feminine", "Una alarma defectuosa había provocado la confusión."],
      ["la orden de evacuar", "the evacuation order", "phrase", "feminine", "Nadie había dado la orden de evacuar."]
    ]
  },
  {
    slug: "c1-argument-context-vocabulary",
    title: "C1 Argument and Synthesis in Context",
    description: "Scope, evidence, source, objection, and recommendation language for responsible synthesis.",
    situation: "building a qualified argument from multiple sources",
    imageKey: "conversation-and-opinion:15",
    topicSlug: "c1-argument-synthesis",
    words: [
      ["la cuestión central", "the central issue", "phrase", "feminine", "La cuestión central es cómo actuar de forma justa."],
      ["ninguna medida aislada", "no isolated measure", "phrase", "feminine", "Ninguna medida aislada puede resolver el problema."],
      ["movilidad urbana", "urban mobility", "phrase", "feminine", "El análisis se limita a la movilidad urbana."],
      ["una relación causal", "a causal relationship", "phrase", "feminine", "Los datos no demuestran una relación causal."],
      ["datos comparables", "comparable data", "phrase", "masculine", "Harían falta datos comparables antes y después."],
      ["el informe municipal", "the municipal report", "phrase", "masculine", "Según el informe municipal, disminuyeron los trayectos en coche."],
      ["zonas de carga", "loading zones", "phrase", "feminine", "Las zonas de carga resultan insuficientes."],
      ["ajustes operativos", "operational adjustments", "phrase", "masculine", "La medida funciona, pero necesita ajustes operativos."],
      ["el riesgo de aislamiento", "the risk of isolation", "phrase", "masculine", "También existe el riesgo de aislamiento."],
      ["días presenciales", "in-person days", "phrase", "masculine", "Las objeciones justifican algunos días presenciales."],
      ["la prueba piloto", "the pilot trial", "phrase", "feminine", "La prueba piloto redujo el consumo."],
      ["consumo energético", "energy consumption", "phrase", "masculine", "El programa redujo el consumo energético."]
    ]
  },
  {
    slug: "c1-pragmatic-context-vocabulary",
    title: "C1 Pragmatic Interaction in Context",
    description: "Intention, mitigation, turn-taking, repair, and irony language for nuanced interaction.",
    situation: "interpreting and managing what speakers mean beyond literal words",
    imageKey: "conversation-and-opinion:16",
    topicSlug: "c1-pragmatic-interaction",
    words: [
      ["una petición cortés", "a polite request", "phrase", "feminine", "La pregunta funciona como una petición cortés."],
      ["interpretación anterior", "previous interpretation", "phrase", "feminine", "El hablante explica su interpretación anterior."],
      ["una valoración concreta", "a specific assessment", "phrase", "feminine", "La respuesta protege la relación mediante una valoración concreta."],
      ["antes del envío", "before sending", "phrase", null, "La justificación tiene que revisarse antes del envío."],
      ["los datos de la encuesta", "the survey data", "phrase", "masculine", "Los datos de la encuesta señalan otra dificultad."],
      ["te cedo la palabra", "I yield the floor to you", "phrase", null, "Termino esta idea y te cedo la palabra."],
      ["un contraste explícito", "an explicit contrast", "phrase", "masculine", "La reparación sustituye la ambigüedad por un contraste explícito."],
      ["obtiene confirmación", "obtains confirmation", "phrase", null, "El otro hablante reformula el acuerdo y obtiene confirmación."],
      ["el programa definitivo", "the final program", "phrase", "masculine", "El equipo recibió el programa definitivo demasiado tarde."],
      ["falta de planificación", "lack of planning", "phrase", "feminine", "Julia critica la falta de planificación."],
      ["mediante ironía", "through irony", "phrase", null, "La crítica se expresa mediante ironía."],
      ["una propuesta concreta", "a concrete proposal", "phrase", "feminine", "La respuesta convierte la crítica en una propuesta concreta."]
    ]
  },
  {
    slug: "c1-mood-context-vocabulary",
    title: "C1 Mood and Reference in Context",
    description: "Domain, future-boundary, concession, prevention, and open-reference language around mood choices.",
    situation: "choosing mood from reference and communicative meaning",
    imageKey: "grammar-scenes:18",
    topicSlug: "c1-mood-meaning",
    words: [
      ["el sector jurídico", "the legal sector", "phrase", "masculine", "La traductora conoce bien el sector jurídico."],
      ["textos médicos", "medical texts", "phrase", "masculine", "Necesitamos a alguien que trabaje con textos médicos."],
      ["palabra por palabra", "word for word", "phrase", null, "No buscamos a una persona que traduzca palabra por palabra."],
      ["el perfil buscado", "the desired profile", "phrase", "masculine", "El subjuntivo ayuda a definir el perfil buscado."],
      ["las pruebas técnicas", "the technical tests", "phrase", "feminine", "Entraremos cuando hayan terminado las pruebas técnicas."],
      ["gastos imprevistos", "unexpected expenses", "phrase", "masculine", "La segunda fase seguirá aunque surjan gastos imprevistos."],
      ["la seguridad", "safety or security", "noun", "feminine", "Los gastos no deben comprometer la seguridad."],
      ["datos incompletos", "incomplete data", "phrase", "masculine", "La confirmación evita que se envíen datos incompletos."],
      ["una única vía", "a single route or channel", "phrase", "feminine", "El equipo no impone una única vía."],
      ["el horario habitual", "the usual opening hours", "phrase", "masculine", "La oficina atiende consultas fuera del horario habitual."],
      ["la persona de guardia", "the person on duty", "phrase", "feminine", "La persona de guardia responderá al mensaje."],
      ["una incidencia", "an incident or issue", "phrase", "feminine", "Se conservará una copia por si ocurre una incidencia."]
    ]
  },
  {
    slug: "c1-listening-context-vocabulary",
    title: "C1 Dense Listening in Context",
    description: "Decisive detail, correction, implicit task, viewpoint, and exception language from dense listening.",
    situation: "tracking structure and corrections in demanding spoken input",
    imageKey: "conversation-and-opinion:17",
    topicSlug: "c1-dense-listening",
    words: [
      ["la caída de las ventas", "the drop in sales", "phrase", "feminine", "La caída de las ventas no se explica solo por el precio."],
      ["menor disponibilidad", "lower availability", "phrase", "feminine", "El problema combinó retrasos y menor disponibilidad."],
      ["la demanda", "demand", "noun", "feminine", "La demanda no fue la causa principal."],
      ["la visita externa", "the external visit", "phrase", "feminine", "La sesión coincide con la visita externa."],
      ["un margen", "a buffer or margin", "phrase", "masculine", "La media hora adicional será solo un margen."],
      ["marcado como borrador", "marked as a draft", "phrase", "masculine", "El documento sigue marcado como borrador."],
      ["la última cifra", "the last figure", "phrase", "feminine", "Elena debe comprobar la última cifra."],
      ["la versión definitiva", "the final version", "phrase", "feminine", "Tiene que dejar preparada la versión definitiva."],
      ["centros piloto", "pilot sites", "phrase", "masculine", "No sabemos si el efecto seguirá fuera de los centros piloto."],
      ["toda la documentación", "all the documentation", "phrase", "feminine", "Las solicitudes deben incluir toda la documentación."],
      ["el justificante", "supporting document or proof", "noun", "masculine", "Hay que adjuntar el justificante antes de las dos."],
      ["un plazo adicional", "an additional deadline or period", "phrase", "masculine", "Se concederá un plazo adicional para aportar el documento."]
    ]
  },
  {
    slug: "c2-precision-context-vocabulary",
    title: "C2 Precision and Mediation in Context",
    description: "Scope, evidence, measurement, attribution, and stance language for faithful mediation.",
    situation: "preserving evidence and stance while reformulating dense information",
    imageKey: "grammar-scenes:19",
    topicSlug: "c2-precision-mediation",
    words: [
      ["el alcance de la negación", "the scope of negation", "phrase", "masculine", "La frase dejaba abierto el alcance de la negación."],
      ["cobertura universal", "universal coverage", "phrase", "feminine", "La versión revisada garantiza la cobertura universal."],
      ["alta rotación de personal", "high staff turnover", "phrase", "feminine", "El efecto fue menor con alta rotación de personal."],
      ["cambios simultáneos", "simultaneous changes", "phrase", "masculine", "El diseño no permite aislar otros cambios simultáneos."],
      ["pérdida de datos", "data loss", "phrase", "feminine", "La síntesis debe conservar la pérdida de datos."],
      ["una lectura aislada", "an isolated reading", "phrase", "feminine", "Una lectura aislada no basta para evaluar la tendencia."],
      ["el promedio mensual", "the monthly average", "phrase", "masculine", "El primer informe compara el promedio mensual."],
      ["horas de mayor demanda", "peak-demand hours", "phrase", "feminine", "El segundo informe recoge opiniones en horas de mayor demanda."],
      ["una experiencia negativa", "a negative experience", "phrase", "feminine", "Las esperas siguieron generando una experiencia negativa."],
      ["evaluación negativa", "negative evaluation", "phrase", "feminine", "Pretenciosa introduce una evaluación negativa."],
      ["resistencia previa", "prior resistance", "phrase", "feminine", "Admitió presenta resistencia previa."],
      ["distancia crítica", "critical distance", "phrase", "feminine", "La paráfrasis no debe transformar distancia crítica en entusiasmo."]
    ]
  },
  {
    slug: "c2-rhetoric-context-vocabulary",
    title: "C2 Genre and Rhetoric in Context",
    description: "Lexical effect, idiom, genre, information structure, and architecture language.",
    situation: "controlling rhetorical effect across genres",
    imageKey: "conversation-and-opinion:18",
    topicSlug: "c2-genre-rhetoric",
    words: [
      ["un inicio brusco", "an abrupt beginning", "phrase", "masculine", "Desencadenar sugiere un inicio brusco."],
      ["una fuerza favorable", "a favorable force", "phrase", "feminine", "Impulsar atribuye una fuerza favorable."],
      ["registro reflexivo", "reflective register", "phrase", "masculine", "Albergar dudas aporta un registro reflexivo."],
      ["cabos sueltos", "loose ends", "phrase", "masculine", "La reforma dejó demasiados cabos sueltos."],
      ["negación aparente", "apparent negation", "phrase", "feminine", "No es poca cosa intensifica mediante una negación aparente."],
      ["una resolución administrativa", "an administrative decision", "phrase", "feminine", "Una resolución administrativa debe identificar la decisión."],
      ["el fundamento", "the basis or grounds", "noun", "masculine", "La resolución presenta la decisión y el fundamento."],
      ["el estilo jurídico", "legal style", "phrase", "masculine", "Copiar el estilo jurídico puede ocultar información práctica."],
      ["el punto de partida", "the starting point", "phrase", "masculine", "La posición inicial establece el punto de partida."],
      ["una arquitectura reconocible", "a recognizable structure", "phrase", "feminine", "Un texto complejo necesita una arquitectura reconocible."],
      ["certeza inexistente", "nonexistent certainty", "phrase", "feminine", "El cierre no debe fingir una certeza inexistente."],
      ["aplanar el ritmo", "to flatten the rhythm", "phrase", null, "La repetición mecánica puede aplanar el ritmo."]
    ]
  },
  {
    slug: "c2-variation-context-vocabulary",
    title: "C2 Sociolinguistic Variation in Context",
    description: "Panhispanic systems, accommodation, social distance, face, accountability, irony, and cultural reference.",
    situation: "adapting across regions and relationships without erasing identity",
    imageKey: "conversation-and-opinion:19",
    topicSlug: "c2-sociolinguistic-variation",
    words: [
      ["sistemas regionales asentados", "established regional systems", "phrase", "masculine", "Las formas pertenecen a sistemas regionales asentados."],
      ["competencia panhispánica", "Panhispanic competence", "phrase", "feminine", "La competencia panhispánica exige comprender varias normas."],
      ["la variedad elegida", "the chosen variety", "phrase", "feminine", "Conviene mantener coherencia con la variedad elegida."],
      ["el origen exacto", "the exact origin", "phrase", "masculine", "Una palabra no permite identificar el origen exacto de una persona."],
      ["la identidad lingüística", "linguistic identity", "phrase", "feminine", "La acomodación no debe borrar la identidad lingüística."],
      ["distancia profesional", "professional distance", "phrase", "feminine", "Usted puede expresar distancia profesional."],
      ["costumbre regional", "regional custom", "phrase", "feminine", "La elección también depende de la costumbre regional."],
      ["la imagen del interlocutor", "the interlocutor's face or social image", "phrase", "feminine", "Una formulación cuidadosa protege la imagen del interlocutor."],
      ["rendición de cuentas", "accountability", "phrase", "feminine", "La delicadeza no debe impedir la rendición de cuentas."],
      ["una lectura irónica", "an ironic reading", "phrase", "feminine", "La situación y la entonación crean una lectura irónica."],
      ["una referencia cultural", "a cultural reference", "phrase", "feminine", "Una referencia cultural puede activar asociaciones compartidas."],
      ["acomodación recíproca", "reciprocal accommodation", "phrase", "feminine", "El grupo propone una acomodación recíproca."]
    ]
  },
  {
    slug: "c2-negotiation-context-vocabulary",
    title: "C2 High-stakes Negotiation in Context",
    description: "Interests, constraints, concessions, assumptions, reservations, de-escalation, and accountable closure.",
    situation: "building a durable agreement when interests conflict and trust is fragile",
    imageKey: "conversation-and-opinion:18",
    topicSlug: "c2-high-stakes-negotiation",
    words: [
      ["intereses subyacentes", "underlying interests", "phrase", "masculine", "La mediadora distingue los intereses subyacentes de las posiciones públicas."],
      ["una condición no negociable", "a non-negotiable condition", "phrase", "feminine", "Completar las pruebas críticas es una condición no negociable."],
      ["margen de maniobra", "room for maneuver", "phrase", "masculine", "Todavía existe margen de maniobra en el alcance de la primera fase."],
      ["una concesión recíproca", "a reciprocal concession", "phrase", "feminine", "La ampliación del contrato exige una concesión recíproca sobre el servicio."],
      ["un supuesto no demostrado", "an unproven assumption", "phrase", "masculine", "El cálculo depende de un supuesto no demostrado sobre la carga futura."],
      ["una carga desproporcionada", "a disproportionate burden", "phrase", "feminine", "La centralización no debe crear una carga desproporcionada para el equipo."],
      ["reservas expresas", "explicit reservations", "phrase", "feminine", "Los comercios mantienen reservas expresas sobre el horario de reparto."],
      ["un consenso provisional", "a provisional consensus", "phrase", "masculine", "El grupo alcanzó un consenso provisional sujeto a tres condiciones."],
      ["constar en acta", "to be entered in the minutes", "phrase", null, "Las condiciones y responsabilidades deben constar en acta."],
      ["rebajar la tensión", "to de-escalate tension", "phrase", null, "Reconocer el impacto ayuda a rebajar la tensión sin ocultar el problema."],
      ["sin eludir responsabilidades", "without evading responsibility", "phrase", null, "El director corrigió el dato sin eludir responsabilidades por el proceso."],
      ["compromisos verificables", "verifiable commitments", "phrase", "masculine", "La reunión termina con compromisos verificables, responsables y fechas."]
    ]
  },
  {
    slug: "c2-literary-context-vocabulary",
    title: "C2 Literary and Creative Control in Context",
    description: "Evidence, voice, patterned symbolism, intertextual relation, and constrained rewriting.",
    situation: "interpreting and transforming a literary passage without exceeding its evidence",
    imageKey: "conversation-and-opinion:14",
    topicSlug: "c2-literary-creative-control",
    words: [
      ["ambigüedad productiva", "productive ambiguity", "phrase", "feminine", "El final mantiene una ambigüedad productiva apoyada en varios indicios."],
      ["un indicio textual", "a textual clue", "phrase", "masculine", "La puerta entreabierta funciona como un indicio textual de posibilidad."],
      ["un límite interpretativo", "an interpretive limit", "phrase", "masculine", "La ausencia de pruebas establece un límite interpretativo claro."],
      ["estilo indirecto libre", "free indirect discourse", "phrase", "masculine", "El estilo indirecto libre acerca la narración a la conciencia del personaje."],
      ["una voz doble", "a double voice", "phrase", "feminine", "La ironía crea una voz doble entre narrador y personaje."],
      ["léxico evaluativo", "evaluative wording", "phrase", "masculine", "El adverbio claro forma parte del léxico evaluativo de Tomás."],
      ["un motivo recurrente", "a recurring motif", "phrase", "masculine", "El espejo se convierte en un motivo recurrente a lo largo del relato."],
      ["una red simbólica", "a symbolic network", "phrase", "feminine", "Las cartas y la ventana construyen una red simbólica de apertura aplazada."],
      ["un eco intertextual", "an intertextual echo", "phrase", "masculine", "La prohibición de mirar atrás activa un eco intertextual reconocible."],
      ["memoria cultural", "cultural memory", "phrase", "feminine", "La melodía compartida despierta una forma de memoria cultural y familiar."],
      ["invariantes factuales", "factual invariants", "phrase", "feminine", "La reescritura debe conservar las invariantes factuales del texto base."],
      ["decisiones estilísticas", "stylistic decisions", "phrase", "feminine", "Perspectiva, distancia y ritmo son decisiones estilísticas controlables."]
    ]
  },
  {
    slug: "c2-expert-listening-context-vocabulary",
    title: "C2 Expert Listening and Synthesis in Context",
    description: "Repair, attribution, qualified stance, nested rules, ownership, contingency, and actionable relay.",
    situation: "following a dense spoken decision and relaying only its final actionable meaning",
    imageKey: "conversation-and-opinion:17",
    topicSlug: "c2-expert-listening-synthesis",
    words: [
      ["una formulación provisional", "a provisional wording", "phrase", "feminine", "La primera cifra aparece como una formulación provisional que después se corrige."],
      ["una autocorrección", "a self-correction", "phrase", "feminine", "La expresión dicho de otro modo introduce una autocorrección decisiva."],
      ["el alcance final", "the final scope", "phrase", "masculine", "El oyente debe conservar el alcance final de la afirmación."],
      ["atribución de hablantes", "speaker attribution", "phrase", "feminine", "Una síntesis rigurosa exige una atribución de hablantes sin confusiones."],
      ["apoyo condicionado", "conditional support", "phrase", "masculine", "Sara expresa apoyo condicionado a un protocolo y una evaluación posterior."],
      ["una reserva diplomática", "a diplomatic reservation", "phrase", "feminine", "Eso sí permite introducir una reserva diplomática sin romper la cooperación."],
      ["una excepción anidada", "a nested exception", "phrase", "feminine", "La urgencia autorizada funciona como una excepción anidada dentro de la regla."],
      ["efectos retroactivos", "retroactive effects", "phrase", "masculine", "Una autorización tardía no produce efectos retroactivos."],
      ["un responsable explícito", "an explicit owner", "phrase", "masculine", "Cada acción del resumen necesita un responsable explícito."],
      ["un plazo vinculante", "a binding deadline", "phrase", "masculine", "La verificación debe completarse dentro de un plazo vinculante."],
      ["un plan de contingencia", "a contingency plan", "phrase", "masculine", "Diego prepara un plan de contingencia por si falla la integración."],
      ["una síntesis accionable", "an actionable synthesis", "phrase", "feminine", "La reunión termina con una síntesis accionable de decisión, riesgo y tareas."]
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
  console.log(`Seeded ${groups.length} contextual C1/C2 vocabulary groups with ${groups.reduce((total, group) => total + group.words.length, 0)} words.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());

module.exports = { groups };
