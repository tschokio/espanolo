const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const group = (key, labelDe, labelEn, any) => ({ key, labelDe, labelEn, required: true, any });

const checks = Object.freeze({
  "checkpoint-b2-discourse-respond": { minimumMatched: 3, groups: [
    group("scope", "Wissensgrenze markieren", "mark the limit of knowledge", ["hasta donde sé", "que yo sepa", "por lo que sé"]),
    group("still", "weiterhin fehlenden Stand nennen", "state the continuing absence", ["todavía no", "aún no"]),
    group("alternative", "fehlende bessere Alternative ausdrücken", "express the lack of a better alternative", ["alternativa mejor", "mejor alternativa", "opción mejor", "mejor opción"])
  ] },
  "checkpoint-b2-discourse-produce": { minimumMatched: 4, groups: [
    group("first-side", "erste Argumentseite öffnen", "open the first side of the argument", ["por un lado", "por una parte"]),
    group("cost", "Kostenreduktion im Konditional", "state cost reduction in the conditional", ["reduciría los costes", "reduciría los costos", "bajaría los costes", "bajaría los costos", "disminuiría los costes"]),
    group("second-side", "Gegenseite anschließen", "connect the opposing side", ["por otro", "por otra parte", "en cambio"]),
    group("time", "zusätzlichen Zeitbedarf nennen", "state the additional time requirement", ["exigiría más tiempo", "requeriría más tiempo", "necesitaría más tiempo"])
  ] },
  "checkpoint-b2-reported-speech-respond": { minimumMatched: 4, groups: [
    group("addition", "zusätzliche Aussage markieren", "mark the additional report", ["también", "además"]),
    group("request", "Bitte indirekt berichten", "report the request indirectly", ["pidió que", "solicitó que"]),
    group("postpone", "Verschieben im Imperfecto de Subjuntivo", "put postponement in the imperfect subjunctive", ["aplazáramos", "pospusiéramos", "retrasáramos"]),
    group("decision", "Entscheidung als Gegenstand nennen", "name the decision as the object", ["decisión"])
  ] },
  "checkpoint-b2-reported-speech-produce": { minimumMatched: 4, groups: [
    group("report", "Erklärung aus neuer Perspektive berichten", "report the explanation from the new viewpoint", ["explicó que", "comentó que", "dijo que"]),
    group("prior", "früheren Empfang im Pluscuamperfecto", "place the earlier receipt in the pluperfect", ["había recibido", "había obtenido"]),
    group("information", "neue Information nennen", "name the new information", ["nuevos datos", "nueva información"]),
    group("morning", "Morgen aus Berichtsperspektive verankern", "anchor the morning from the reporting viewpoint", ["aquella mañana", "esa mañana"])
  ] },
  "checkpoint-b2-relative-clauses-respond": { minimumMatched: 3, groups: [
    group("neighborhood", "Verbesserungsziel Stadtviertel", "name improving the neighborhood as the goal", ["mejorar el barrio"]),
    group("relative", "Ortsbezug relativ anschließen", "connect the place with a relative form", ["donde", "en el que", "en el cual"]),
    group("families", "dort lebende Familien nennen", "name the families living there", ["viven muchas familias", "residen muchas familias"])
  ] },
  "checkpoint-b2-relative-clauses-produce": { minimumMatched: 3, groups: [
    group("architect", "Begegnung mit Architekt/in nennen", "state meeting an architect", ["conocimos a una arquitecta", "conocimos a un arquitecto"]),
    group("whose", "Besitzbezug mit cuyo/cuya", "express possession with cuyo/cuya", ["cuyas ideas", "cuyos proyectos"]),
    group("impact", "Wirkung auf uns nennen", "state the effect on us", ["nos impresionaron", "nos sorprendieron"])
  ] },
  "checkpoint-b2-se-constructions-respond": { minimumMatched: 2, groups: [
    group("se", "Interview mit passendem se-Muster", "use the appropriate se interview pattern", ["se entrevistó a", "se entrevistaron"]),
    group("candidates", "alle Kandidaten erfassen", "include all candidates", ["todos los candidatos", "todas las candidatas"])
  ] },
  "checkpoint-b2-se-constructions-produce": { minimumMatched: 3, groups: [
    group("accidental", "unbeabsichtigtes Vergessen mit se + Dativ", "use accidental se plus dative", ["se me olvidaron", "se me quedaron"]),
    group("documents", "Dokumente als betroffenes Subjekt", "name the documents as the affected subject", ["documentos", "papeles"]),
    group("home", "Ort zu Hause nennen", "name home as the location", ["en casa"])
  ] },
  "checkpoint-b2-past-subjunctive-respond": { minimumMatched: 3, groups: [
    group("doubt", "vergangenen Zweifel rahmen", "frame doubt in the past", ["dudábamos que", "dudamos que"]),
    group("subjunctive", "Zeit im Imperfecto de Subjuntivo", "put time in the imperfect subjunctive", ["hubiera", "hubiese"]),
    group("enough", "ausreichende Menge ausdrücken", "express sufficiency", ["suficiente", "bastante"])
  ] },
  "checkpoint-b2-past-subjunctive-produce": { minimumMatched: 4, groups: [
    group("condition", "irreale Vergangenheit im Pluscuamperfecto de Subjuntivo", "use the pluperfect subjunctive for the unreal past", ["si hubiéramos recibido", "si hubiésemos recibido"]),
    group("information", "mehr Information als Bedingung", "name more information as the condition", ["más información", "más datos"]),
    group("result", "Folge im Condicional compuesto", "put the result in the conditional perfect", ["habríamos cambiado", "habríamos modificado"]),
    group("plan", "Plan als betroffenes Ergebnis", "name the plan as the affected result", ["plan"])
  ] },
  "checkpoint-b2-verbal-periphrases-respond": { minimumMatched: 2, groups: [
    group("continuity", "Fortdauer als Verbperiphrase", "express continuity with a verbal periphrasis", ["sigo practicando", "continúo practicando"]),
    group("frequency", "tägliche Häufigkeit nennen", "state daily frequency", ["todos los días", "cada día", "diariamente"])
  ] },
  "checkpoint-b2-verbal-periphrases-produce": { minimumMatched: 3, groups: [
    group("past-habit", "frühere Gewohnheit ausdrücken", "express the former habit", ["no solía hablar", "no acostumbraba a hablar", "antes apenas hablaba"]),
    group("contrast", "Gegenwart kontrastieren", "contrast the present", ["pero ahora", "mientras que ahora"]),
    group("participation", "stärkere Beteiligung nennen", "state increased participation", ["participo más", "participo mucho más", "intervengo más"])
  ] },
  "checkpoint-b2-reading-inference-respond": { minimumMatched: 4, groups: [
    group("period", "Zeitraum von sechs Monaten", "state the six-month period", ["después de seis meses", "al cabo de seis meses", "tras seis meses"]),
    group("waste", "Abfall als Messgröße nennen", "name waste as the measured quantity", ["residuos", "desechos"]),
    group("reduction", "vorher erreichte Senkung ausdrücken", "express the earlier reduction", ["habían bajado", "se habían reducido", "habían disminuido"]),
    group("percentage", "vierzig Prozent nennen", "state forty percent", ["cuarenta por ciento", "40 por ciento", "40 %"])
  ] },
  "checkpoint-b2-reading-inference-produce": { minimumMatched: 4, groups: [
    group("waiting", "Wartezeiten als Messgröße", "name waiting times as the measure", ["tiempos de espera", "esperas"]),
    group("increase", "Anstieg nennen", "state the increase", ["aumentaron", "crecieron"]),
    group("only", "Einschränkung auf nur markieren", "mark the limitation to only", ["solo", "únicamente"]),
    group("days", "erste Tage als Zeitraum", "state the first days as the period", ["primeros días", "días iniciales"])
  ] },
  "checkpoint-b2-listening-comprehension-produce": { minimumMatched: 3, groups: [
    group("addition", "zusätzliche Möglichkeit markieren", "mark the additional option", ["también", "además"]),
    group("choice", "Wahlmöglichkeit ausdrücken", "express the choice", ["pueden elegir", "pueden escoger", "tienen la opción de elegir"]),
    group("nature", "Naturvortrag nennen", "name the nature talk", ["charla sobre naturaleza", "charla de naturaleza", "conferencia sobre naturaleza"])
  ] },
  "checkpoint-c1-register-precision-produce": { minimumMatched: 3, groups: [
    group("addition", "präzisen additiven Anschluss", "use a precise additive link", ["a ello se suma", "a esto se añade", "además hay"]),
    group("factor", "zusätzlichen Faktor nennen", "name the additional factor", ["factor"]),
    group("unconsidered", "frühere Nichtberücksichtigung ausdrücken", "express the earlier lack of consideration", ["no se había tenido en cuenta", "no había sido considerado", "no se había considerado"])
  ] },
  "checkpoint-c1-narrative-viewpoint-produce": { minimumMatched: 3, groups: [
    group("resolved", "Klärung vor der Folge verdichten", "compress clarification before the result", ["aclarado el incidente", "una vez aclarado el incidente", "después de aclarar el incidente"]),
    group("everyone", "alle Beteiligten erfassen", "include everyone involved", ["todos", "todas"]),
    group("return", "mögliche Rückkehr als Folge", "state the possible return as the result", ["pudieron regresar", "pudieron volver"])
  ] },
  "checkpoint-c1-argument-synthesis-synthesize": { minimumMatched: 4, groups: [
    group("conclusion", "Folgerung markieren", "mark the conclusion", ["por tanto", "por consiguiente", "por eso"]),
    group("recommendation", "Empfehlung vorsichtig formulieren", "formulate the recommendation cautiously", ["convendría", "sería aconsejable", "sería conveniente"]),
    group("trials", "Ausweitung der Prüfungen nennen", "name expanding the trials", ["ampliar las pruebas", "ampliar los ensayos"]),
    group("before", "vor allgemeiner Entscheidung begrenzen", "limit it to before a general decision", ["antes de adoptar una decisión general", "antes de tomar una decisión general"])
  ] },
  "checkpoint-c1-pragmatic-interaction-respond": { minimumMatched: 3, groups: [
    group("alignment", "kooperativ Übereinstimmung prüfen", "check alignment cooperatively", ["a ver si estamos de acuerdo", "para comprobar que estamos de acuerdo", "veamos si coincidimos"]),
    group("today", "heutige Bewertung festlegen", "set evaluation for today", ["hoy evaluamos", "hoy valoramos"]),
    group("tomorrow", "Entscheidung auf morgen setzen", "set the decision for tomorrow", ["mañana decidimos", "mañana tomamos la decisión"])
  ] },
  "checkpoint-c1-mood-meaning-produce": { minimumMatched: 3, groups: [
    group("open-case", "offenen Fall konzessiv rahmen", "frame the open case concessively", ["sea cual sea", "pase lo que pase", "en cualquier caso"]),
    group("confirmation", "Bestätigung als nächsten Schritt", "state confirmation as the next step", ["confirmaremos", "verificaremos", "comprobaremos"]),
    group("information", "Information als Gegenstand nennen", "name the information as the object", ["datos", "información"])
  ] },
  "checkpoint-c1-dense-listening-relay": { minimumMatched: 4, groups: [
    group("purpose", "Priorität als Zweck erhalten", "preserve priority as the purpose", ["para conservar la prioridad", "para mantener su prioridad"]),
    group("obligation", "zukünftige Verpflichtung ausdrücken", "express the future obligation", ["deberán", "tendrán que"]),
    group("response", "Antwort als Handlung nennen", "name responding as the action", ["responder", "contestar"]),
    group("deadline", "Frist vor morgen Mittag", "state the deadline before noon tomorrow", ["antes de mañana al mediodía", "antes del mediodía de mañana"])
  ] },
  "checkpoint-c2-precision-mediation-mediate": { minimumMatched: 4, groups: [
    group("synthesis", "präzise oder rigorose Synthese", "name a precise or rigorous synthesis", ["síntesis precisa", "síntesis rigurosa"]),
    group("preserve", "Bedeutungserhalt ausdrücken", "express preservation", ["conserva", "preserva", "mantiene"]),
    group("progress", "Fortschritt einschließen", "include the progress", ["avance", "avances", "progreso"]),
    group("unresolved", "ungelöstes Problem einschließen", "include the unresolved problem", ["problema pendiente", "cuestión aún sin resolver", "problema no resuelto"])
  ] },
  "checkpoint-c2-genre-rhetoric-compose": { minimumMatched: 3, groups: [
    group("continue", "Weiterführen als Thema setzen", "set continuing as the topic", ["continuar", "seguir"]),
    group("not-mean", "Bedeutung ausdrücklich verneinen", "explicitly negate the implication", ["no significa", "no implica", "no equivale a"]),
    group("limits", "Fortschritt ohne Grenzen zurückweisen", "reject progress without limits", ["avanzar sin límites", "avanzar sin límite alguno"])
  ] },
  "checkpoint-c2-sociolinguistic-variation-accommodate": { minimumMatched: 3, groups: [
    group("inclusive", "inklusive gemeinsame Aufforderung", "use an inclusive joint proposal", ["mantengamos", "conservemos"]),
    group("forms", "eigene Formen respektieren", "respect each side's own forms", ["nuestras formas", "nuestras propias formas"]),
    group("differences", "Unterschiede gemeinsam klären", "clarify the differences together", ["aclaremos lo que cambie", "expliquemos las diferencias", "aclararemos las diferencias"])
  ] },
  "checkpoint-c2-sociolinguistic-variation-mediate": { minimumMatched: 4, groups: [
    group("shared", "gemeinsame Norm nennen", "name a shared norm", ["norma compartida", "norma común"]),
    group("build", "Aufbau als Möglichkeit ausdrücken", "express building it as possible", ["puede construirse", "es posible construir"]),
    group("without", "Aufbau ohne Zwang begrenzen", "limit the process to no imposition", ["sin imponer"]),
    group("variety", "eine einzige Varietät als vermiedenen Zwang", "name a single variety as the avoided imposition", ["variedad única", "sola variedad"])
  ] }
});

async function main() {
  for (const [slug, functionalCheck] of Object.entries(checks)) {
    const exercise = await prisma.exercise.findUnique({ where: { slug }, select: { answerJson: true } });
    if (!exercise) throw new Error(`Missing B2–C2 checkpoint transfer exercise: ${slug}`);
    await prisma.exercise.update({
      where: { slug },
      data: {
        answerJson: {
          ...(exercise.answerJson || {}),
          rubric: "Preserve every visible meaning, structure, and register function; natural equivalent Spanish is accepted when all required goals are present.",
          functionalCheck
        }
      }
    });
  }
  console.log(`Added natural functional grading to ${Object.keys(checks).length} B2–C2 checkpoint transfer tasks.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
