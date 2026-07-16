const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "c1-register-context": {
    title: "Una misma petición para tres destinatarios",
    inputMode: "listening",
    orientationDe: "Vergleiche nicht nur Höflichkeit, sondern Beziehung, Medium und institutionelle Distanz. Die Absicht bleibt gleich; Direktheit, Anrede, Zeitrahmen und explizite Begründung ändern sich.",
    orientationEn: "Compare not only politeness but relationship, medium, and institutional distance. The intention remains; directness, address, timing, and explicit framing change.",
    paragraphs: [
      "Clara necesita un informe antes de que termine el día. A un compañero cercano le escribe: «¿Te importa enviármelo hoy? Así puedo cerrar las cifras». En una videollamada profesional pregunta: «¿Podría enviármelo a lo largo del día?». ",
      "Para una directora a la que apenas conoce redacta: «Le agradecería que me lo enviara antes de finalizar la jornada, ya que debemos remitir la documentación mañana». Las tres versiones persiguen el mismo resultado, pero la última nombra el motivo, usa usted y reduce cualquier apariencia de exigencia personal."
    ],
    questions: [
      { questionDe: "Welche Version schafft die größte institutionelle Distanz?", questionEn: "Which version creates the greatest institutional distance?", optionsDe: ["Le agradecería que me lo enviara...", "¿Te importa enviármelo hoy?", "Envíamelo ya"], optionsEn: ["Le agradecería que me lo enviara...", "¿Te importa enviármelo hoy?", "Send it now"], correct: 0, explanationDe: "Le agradecería, die usted-Objektform und der Imperfecto de Subjuntivo gestalten die Bitte formell; die sachliche Begründung bindet sie zusätzlich an den Arbeitskontext.", explanationEn: "Le agradecería, the usted object form, and the imperfect subjunctive make the request formal; the objective reason anchors it in professional context." },
      { questionDe: "Was bleibt in allen drei Formulierungen inhaltlich konstant?", questionEn: "What remains constant in all three formulations?", optionsDe: ["Der Bericht soll noch am selben Arbeitstag eintreffen", "Clara droht mit einer Sanktion", "Die Empfänger stehen Clara gleich nah"], optionsEn: ["The report should arrive within the same working day", "Clara threatens a penalty", "All recipients are equally close to Clara"], correct: 0, explanationDe: "Registerwechsel verändert die soziale Verpackung, nicht den Kernauftrag: Clara benötigt das Dokument vor Ende des laufenden Arbeitstags.", explanationEn: "Changing register alters the social packaging, not the core request: Clara needs the document before the current working day ends." }
    ],
    recallPromptDe: "Formuliere Claras Bitte auf Spanisch für einen engen Kollegen, eine professionelle Gesprächspartnerin und eine formelle schriftliche Nachricht, ohne Ziel oder Frist zu verändern.",
    recallPromptEn: "Formulate Clara's request in Spanish for a close colleague, a professional contact, and a formal written message without changing the goal or deadline.",
    modelSummary: "A un compañero Clara le pregunta si puede enviárselo hoy; a una directora le agradecería que se lo enviara antes de finalizar la jornada por una necesidad documental."
  },
  "c1-precise-paraphrase": {
    title: "Un informe técnico explicado sin deformarlo",
    orientationDe: "Prüfe bei jeder Umformulierung drei Konstanten: Problemursache, Reichweite der Aussage und Handlungskonsequenz. Einfacher oder kürzer darf nicht allgemeiner, sicherer oder dramatischer bedeuten.",
    orientationEn: "Check three constants in every reformulation: cause of the problem, scope of the claim, and action consequence. Simpler or shorter must not mean broader, more certain, or more dramatic.",
    paragraphs: [
      "El informe afirma que el problema no procede de una escasez absoluta de recursos, sino de que estos se distribuyen sin coordinación entre departamentos. Añade que ninguna intervención aislada corregirá por sí sola los retrasos observados.",
      "Para el público general, la portavoz explica: «En términos sencillos, tenemos medios suficientes, pero no los organizamos bien». Después resume: «Lo esencial es coordinar los recursos existentes; dicho de otro modo, no hace falta multiplicarlos, sino usarlos conjuntamente». La versión accesible conserva causa, límite y recomendación."
    ],
    questions: [
      { questionDe: "Welche Umschreibung würde die Aussage unzulässig verändern?", questionEn: "Which paraphrase would distort the claim?", optionsDe: ["Es fehlen grundsätzlich sämtliche Ressourcen", "Die vorhandenen Mittel werden schlecht koordiniert", "Keine Einzelmaßnahme reicht allein aus"], optionsEn: ["All resources are fundamentally lacking", "Existing resources are poorly coordinated", "No single measure is sufficient alone"], correct: 0, explanationDe: "Der Ausgangstext verneint gerade eine absolute Knappheit. Eine Behauptung vollständigen Mangels kehrt die zentrale Unterscheidung um und ist keine treue Paraphrase.", explanationEn: "The source explicitly denies absolute scarcity. Claiming a total lack reverses the central distinction and is not a faithful paraphrase." },
      { questionDe: "Welche Kernempfehlung bleibt in der Kurzfassung erhalten?", questionEn: "Which core recommendation remains in the concise version?", optionsDe: ["Vorhandene Ressourcen gemeinsam koordinieren", "Jede Abteilung vollständig abschaffen", "Nur eine einzelne Maßnahme einsetzen"], optionsEn: ["Coordinate existing resources jointly", "Abolish every department", "Use only one isolated measure"], correct: 0, explanationDe: "Die Kurzfassung entfernt technische Einzelheiten, behält aber genau die aus der Diagnose folgende Handlung bei: bessere gemeinsame Koordination.", explanationEn: "The concise version removes technical detail but preserves the action that follows from the diagnosis: better joint coordination." }
    ],
    recallPromptDe: "Gib den technischen Befund auf Spanisch zuerst in einem einfachen Satz und danach in einer formellen Kurzfassung wieder; Ursache, Einschränkung und Empfehlung müssen erhalten bleiben.",
    recallPromptEn: "Restate the technical finding in Spanish first as a plain sentence and then as a formal concise version, preserving cause, limitation, and recommendation.",
    modelSummary: "En términos sencillos, no faltan recursos, sino coordinación. En resumidas cuentas, ninguna medida aislada bastará y conviene organizar conjuntamente los medios existentes."
  },
  "c1-stance-nuance": {
    title: "Una respuesta que acepta datos pero cuestiona conclusiones",
    inputMode: "listening",
    orientationDe: "Ordne jeder Formulierung eine genaue Stärke zu: partielle Zustimmung, Anerkennung der Daten, Vorbehalt gegenüber ihrer Deutung, evidenzgestützte Tendenz und vorsichtige Empfehlung.",
    orientationEn: "Assign an exact strength to each expression: partial agreement, acceptance of data, reservation about interpretation, evidence-supported tendency, and cautious recommendation.",
    paragraphs: [
      "En una reunión, Pablo responde a un informe optimista: «Hasta cierto punto, comparto el diagnóstico. No pondría en duda los resultados, aunque sí la interpretación que se ha hecho de ellos». No rechaza las pruebas ni acepta toda la conclusión.",
      "Continúa: «Todo apunta a que la medida tendrá un efecto limitado. Por convincente que parezca el argumento, no resuelve la cuestión principal. Me inclino a pensar que convendría esperar a la próxima evaluación». La postura avanza desde una concesión precisa hasta una recomendación deliberadamente provisional."
    ],
    questions: [
      { questionDe: "Was stellt Pablo ausdrücklich nicht infrage?", questionEn: "What does Pablo explicitly refrain from questioning?", optionsDe: ["Die erhobenen Ergebnisse", "Die Interpretation der Ergebnisse", "Die Notwendigkeit einer weiteren Prüfung"], optionsEn: ["The collected results", "The interpretation of the results", "The need for further review"], correct: 0, explanationDe: "No pondría en duda los resultados grenzt den anerkannten Teil ab; aunque sí su interpretación setzt den eigentlichen Vorbehalt präzise dagegen.", explanationEn: "No pondría en duda los resultados marks the accepted part; aunque sí su interpretación precisely locates the reservation." },
      { questionDe: "Wie verbindlich ist me inclino a pensar que convendría esperar?", questionEn: "How committed is me inclino a pensar que convendría esperar?", optionsDe: ["Eine begründete, aber vorsichtige Empfehlung", "Ein unumstößlicher Befehl", "Eine vollständige Zustimmung zum Bericht"], optionsEn: ["A reasoned but cautious recommendation", "An absolute command", "Complete agreement with the report"], correct: 0, explanationDe: "Me inclino a pensar begrenzt die persönliche Festlegung und convendría formuliert den Rat im Condicional statt als kategorische Verpflichtung.", explanationEn: "Me inclino a pensar limits personal commitment, and convendría frames advice in the conditional rather than as a categorical obligation." }
    ],
    recallPromptDe: "Rekonstruiere Pablos Position auf Spanisch mit partieller Zustimmung, klar begrenztem Einwand, evidenzgestützter Tendenz, Einräumung und vorsichtiger Empfehlung.",
    recallPromptEn: "Reconstruct Pablo's position in Spanish with partial agreement, a precisely limited objection, an evidence-based tendency, concession, and cautious recommendation.",
    modelSummary: "Pablo comparte el diagnóstico hasta cierto punto y no cuestiona los resultados, sino su interpretación; todo apunta a un efecto limitado, por lo que se inclina a esperar."
  },
  "c1-cohesion-reference": {
    title: "Cómo una solución temporal acabó siendo permanente",
    orientationDe: "Verfolge, worauf esta decisión, los, a ello, de este modo und dicha transformación jeweils zurückweisen. Gute Kohäsion führt das Thema weiter, ohne unklare Pronomen oder monotone Wiederholung.",
    orientationEn: "Track what esta decisión, los, a ello, de este modo, and dicha transformación refer back to. Cohesion advances the topic without unclear pronouns or monotonous repetition.",
    paragraphs: [
      "La empresa redujo los plazos para responder más rápido a sus clientes. Esta decisión, sin embargo, aumentó la presión sobre el equipo. El primer informe omitía varios datos; el segundo, en cambio, los analizaba con detalle y mostró una subida de errores.",
      "A ello se sumó la dificultad de encontrar personal especializado. La empresa amplió entonces una medida de apoyo que solo debía durar dos meses. De este modo, una solución temporal acabó convirtiéndose en permanente. Dicha transformación mejoró la calidad, aunque no estuvo exenta de costes."
    ],
    questions: [
      { questionDe: "Auf welchen zuvor beschriebenen Problemkomplex verweist a ello se sumó?", questionEn: "What previously described problem complex does a ello se sumó refer back to?", optionsDe: ["Auf den bereits beschriebenen Druck und die gestiegenen Fehler", "Nur auf die Kundschaft", "Auf eine noch nicht erwähnte Lösung"], optionsEn: ["The pressure and increased errors already described", "Only the customers", "A solution not yet mentioned"], correct: 0, explanationDe: "A ello bündelt den vorherigen Problemkomplex und fügt die Personalsuche als weiteren belastenden Faktor hinzu, ohne alles erneut auszuschreiben.", explanationEn: "A ello packages the preceding problem complex and adds recruitment difficulty as another factor without repeating everything." },
      { questionDe: "Was bezeichnet dicha transformación?", questionEn: "What does dicha transformación denote?", optionsDe: ["Den Übergang von temporärer zu dauerhafter Unterstützung", "Die Verkürzung eines einzelnen Berichts", "Das Ende der Kundenkontakte"], optionsEn: ["The shift from temporary to permanent support", "The shortening of a single report", "The end of customer contact"], correct: 0, explanationDe: "Dicha transformación greift den unmittelbar vorher erklärten Statuswechsel auf und hält ihn als Thema für die Bewertung von Qualität und Kosten fest.", explanationEn: "Dicha transformación refers to the status change just explained and maintains it as the topic for evaluating quality and cost." }
    ],
    recallPromptDe: "Fasse den Prozess auf Spanisch als kohärenten Absatz zusammen und verwende esta decisión, en cambio, a ello se sumó, de este modo und dicha transformación mit eindeutigen Bezügen.",
    recallPromptEn: "Summarize the process in Spanish as a cohesive paragraph using esta decisión, en cambio, a ello se sumó, de este modo, and dicha transformación with clear references.",
    modelSummary: "La empresa acortó los plazos; esta decisión elevó la presión y los errores. A ello se sumó la falta de personal y, de este modo, una ayuda temporal se volvió permanente."
  },
  "c1-idiomatic-collocations": {
    title: "Un acuerdo que sentó un precedente",
    inputMode: "listening",
    orientationDe: "Höre die Wortverbindungen als abrufbare Bedeutungseinheiten. Ersetze nicht einzelne Bestandteile wörtlich: sentar un precedente, tener en cuenta, entrar en vigor, arrojar luz und dar lugar a funktionieren als Partnerschaften.",
    orientationEn: "Hear the word partnerships as retrievable meaning units. Do not replace individual parts literally: sentar un precedente, tener en cuenta, entrar en vigor, arrojar luz, and dar lugar a work as chunks.",
    paragraphs: [
      "El ayuntamiento aprobó un acuerdo que sentó un precedente para otros barrios. Antes de aplicarlo, tuvo en cuenta las consecuencias a largo plazo y anunció que las nuevas reglas entrarían en vigor el mes siguiente.",
      "Un estudio posterior arrojó luz sobre los efectos de la medida: redujo el tráfico, pero también dio lugar a protestas de algunos comerciantes. Las expresiones no son adornos intercambiables; condensan relaciones convencionales precisas de precedente, consideración, vigencia, esclarecimiento y resultado."
    ],
    questions: [
      { questionDe: "Welche Kollokation bezeichnet den offiziellen Beginn der Regeln?", questionEn: "Which collocation denotes the rules officially becoming effective?", optionsDe: ["Entrar en vigor", "Arrojar luz sobre", "Sentar un precedente"], optionsEn: ["Entrar en vigor", "Arrojar luz sobre", "Sentar un precedente"], correct: 0, explanationDe: "Entrar en vigor ist die konventionelle Verbindung für das rechtliche oder institutionelle Wirksamwerden einer Regel oder Vereinbarung.", explanationEn: "Entrar en vigor is the conventional expression for a rule or agreement becoming legally or institutionally effective." },
      { questionDe: "Welche zwei Folgen zeigt der spätere Bericht?", questionEn: "Which two effects does the later report reveal?", optionsDe: ["Weniger Verkehr und Proteste einiger Händler", "Mehr Verkehr und sofortige Aufhebung", "Keine erkennbare Veränderung"], optionsEn: ["Less traffic and protests from some shopkeepers", "More traffic and immediate repeal", "No observable change"], correct: 0, explanationDe: "Arrojó luz sobre führt die Erkenntnis ein; dio lugar a verbindet die Maßnahme mit den Protesten als ausgelöstem Ergebnis.", explanationEn: "Arrojó luz sobre introduces the finding; dio lugar a links the measure to the protests as a resulting outcome." }
    ],
    recallPromptDe: "Fasse die Entwicklung auf Spanisch zusammen und verwende alle fünf Kollokationen in einer sinnvollen Ereignisfolge, ohne ihre festen Bestandteile auszutauschen.",
    recallPromptEn: "Summarize the development in Spanish using all five collocations in a meaningful event sequence without replacing their fixed components.",
    modelSummary: "El acuerdo sentó un precedente, tuvo en cuenta efectos futuros y entró en vigor; un estudio arrojó luz sobre sus resultados, entre ellos las protestas a las que dio lugar."
  },
  "checkpoint-c1-register-precision": {
    title: "Una recomendación profesional cuidadosamente delimitada",
    orientationDe: "Bewerte den Gesamttext auf fünf Ebenen: adressatengerechtes Register, inhaltstreue Reformulierung, Stärke der Haltung, eindeutige Rückbezüge und natürliche Kollokationen.",
    orientationEn: "Evaluate the full text on five levels: audience-appropriate register, faithful reformulation, stance strength, clear reference, and natural collocations.",
    paragraphs: [
      "Señora directora: le agradecería que tuviera en cuenta las circunstancias actuales antes de aprobar la reducción de plazos. Dicho de otro modo, no cuestionamos el objetivo de responder con rapidez, sino el procedimiento propuesto para alcanzarlo.",
      "Hasta cierto punto, los datos respaldan la medida; ahora bien, a ello se suma un factor que no se había tenido en cuenta: la falta de personal especializado. En resumidas cuentas, me inclino a pensar que convendría aplazar la decisión, evaluar sus efectos a largo plazo y evitar que siente un precedente difícil de corregir."
    ],
    questions: [
      { questionDe: "Welche Grenze setzt die Reformulierung der Kritik?", questionEn: "What boundary does the reformulation place on the criticism?", optionsDe: ["Kritisiert wird das Verfahren, nicht das Ziel", "Abgelehnt werden Ziel und sämtliche Daten", "Die Personalsituation ist bedeutungslos"], optionsEn: ["The procedure is criticized, not the goal", "Both the goal and all data are rejected", "Staffing is irrelevant"], correct: 0, explanationDe: "No cuestionamos el objetivo, sino el procedimiento bewahrt die genaue Reichweite des Einwands und verhindert eine pauschale Ablehnung.", explanationEn: "No cuestionamos el objetivo, sino el procedimiento preserves the exact scope of the objection and prevents blanket rejection." },
      { questionDe: "Warum ist die Schlussfolgerung nicht kategorisch?", questionEn: "Why is the conclusion not categorical?", optionsDe: ["Sie kombiniert me inclino a pensar mit convendría", "Sie verwendet einen direkten Imperativ", "Sie behauptet vollständige Gewissheit"], optionsEn: ["It combines me inclino a pensar with convendría", "It uses a direct imperative", "It claims complete certainty"], correct: 0, explanationDe: "Beide Rahmen begrenzen die Festlegung: Der Sprecher gibt eine begründete Empfehlung, präsentiert sie aber nicht als einzig mögliche oder unumstößliche Entscheidung.", explanationEn: "Both frames limit commitment: the speaker gives a reasoned recommendation but does not present it as the only possible or unquestionable decision." }
    ],
    recallPromptDe: "Verfasse auf Spanisch eine professionelle Kurzempfehlung, die formelle Bitte, präzise Reformulierung, begrenzte Zustimmung, kohärente Ergänzung, Kollokation und vorsichtige Schlussfolgerung verbindet.",
    recallPromptEn: "Write a concise professional recommendation in Spanish combining a formal request, precise reformulation, limited agreement, cohesive addition, collocation, and cautious conclusion.",
    modelSummary: "Le agradecería que revisara las circunstancias. No cuestionamos el objetivo, sino el procedimiento; aunque los datos lo respaldan parcialmente, convendría aplazar la decisión y tener en cuenta sus efectos a largo plazo."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const existing = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (existing.length !== entries.length) throw new Error(`C1 register input requires ${entries.length} lessons, found ${existing.length}.`);
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 24 : 20 } });
  }
  console.log(`Seeded connected input for ${entries.length} C1 register-and-precision packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
