const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const checks = Object.freeze({
  "checkpoint-a2-tomorrow-plan": {
    minimumMatched: 1,
    groups: [
      { key: "plan", labelDe: "eigenen morgigen Plan nennen", labelEn: "give your own plan for tomorrow", required: true, followedBy: ["voy a", "pienso", "quiero"], minimumTrailingWords: 1, notAny: ["no voy a", "no pienso", "no quiero"] }
    ]
  },
  "checkpoint-a2-weekend-preference": {
    minimumMatched: 1,
    groups: [
      { key: "preference", labelDe: "eigene Wochenendaktivität nennen", labelEn: "give your own weekend activity", required: true, followedBy: ["me gusta", "me encanta", "prefiero"], minimumTrailingWords: 1, notAny: ["no me gusta", "no me encanta"] }
    ]
  },
  "checkpoint-a2-scenario-order-coffee": {
    minimumMatched: 4,
    groups: [
      { key: "request", labelDe: "Bestellung einleiten", labelEn: "open the order", required: true, any: ["quisiera", "quiero", "me gustaría", "deme", "póngame"] },
      { key: "quantity", labelDe: "zwei bestellen", labelEn: "order two", required: true, any: ["dos"] },
      { key: "coffee", labelDe: "Kaffee nennen", labelEn: "name coffee", required: true, any: ["café", "cafés"] },
      { key: "takeaway", labelDe: "zum Mitnehmen sagen", labelEn: "say to go", required: true, any: ["para llevar"] },
      { key: "courtesy", labelDe: "höflich abschließen", labelEn: "close politely", required: false, any: ["por favor", "gracias"] }
    ]
  },
  "checkpoint-a2-scenario-ask-station": {
    minimumMatched: 2,
    groups: [
      { key: "directions", labelDe: "nach dem Ort oder Weg fragen", labelEn: "ask for the place or route", required: true, any: ["dónde está", "dónde queda", "dónde hay", "cómo llego a"] },
      { key: "station", labelDe: "Bahnhof als Ziel nennen", labelEn: "name the station as destination", required: true, any: ["estación"] },
      { key: "courtesy", labelDe: "Gespräch höflich öffnen", labelEn: "open politely", required: false, any: ["perdón", "disculpe", "por favor"] }
    ]
  },
  "checkpoint-a2-scenario-medicine": {
    minimumMatched: 3,
    groups: [
      { key: "need", labelDe: "Bedarf oder Bitte ausdrücken", labelEn: "express a need or request", required: true, any: ["necesito", "busco", "quisiera", "me hace falta"] },
      { key: "medicine", labelDe: "Medikament oder Mittel nennen", labelEn: "name medicine or a remedy", required: true, any: ["medicina", "medicamento", "algo"] },
      { key: "pain", labelDe: "Schmerz als Zweck oder Problem nennen", labelEn: "name pain as purpose or problem", required: true, any: ["para el dolor", "contra el dolor", "me duele", "dolor de"] }
    ]
  },
  "checkpoint-b1-opinions-dialogue-response": {
    minimumMatched: 3,
    groups: [
      { key: "train", labelDe: "Vorteil des Zuges nennen", labelEn: "state the train's advantage", required: true, any: ["tren es más rápido", "tren va más rápido", "tren tarda menos"] },
      { key: "contrast", labelDe: "klaren Gegensatz verbinden", labelEn: "connect a clear contrast", required: true, any: ["aunque", "si bien", "pero"] },
      { key: "bus", labelDe: "Preisvorteil des Busses nennen", labelEn: "state the bus's price advantage", required: true, any: ["autobús es menos caro", "autobús es más barato", "bus es más barato", "autobús cuesta menos"] }
    ]
  },
  "checkpoint-b1-opinions-write-model": {
    minimumMatched: 2,
    groups: [
      { key: "addition", labelDe: "weiteren Punkt hinzufügen", labelEn: "add another point", required: true, any: ["además", "también", "por otra parte"] },
      { key: "time", labelDe: "Zeitersparnis ausdrücken", labelEn: "express saving time", required: true, any: ["podemos ahorrar tiempo", "ahorraremos tiempo", "nos permite ahorrar tiempo"] }
    ]
  },
  "checkpoint-b1-future-conditions-produce": {
    minimumMatched: 3,
    groups: [
      { key: "condition", labelDe: "realistische Problembedingung", labelEn: "realistic problem condition", required: true, any: ["si hay un problema", "si surge un problema", "si tenemos un problema"] },
      { key: "solution", labelDe: "zukünftige Lösung nennen", labelEn: "state the future solution", required: true, any: ["lo resolveremos", "podremos resolverlo", "lo solucionaremos"] },
      { key: "together", labelDe: "gemeinsames Handeln ausdrücken", labelEn: "express joint action", required: true, any: ["juntos", "juntas", "entre todos"] }
    ]
  },
  "checkpoint-b1-future-conditions-apply": {
    minimumMatched: 3,
    groups: [
      { key: "absence", labelDe: "Martas Abwesenheit feststellen", labelEn: "state Marta's absence", required: true, any: ["marta no está aquí", "marta no se encuentra aquí"] },
      { key: "inference", labelDe: "Vermutung mit Futur ausdrücken", labelEn: "express an inference with the future", required: true, any: ["estará", "se habrá ido"] },
      { key: "meeting", labelDe: "Besprechung als vermuteten Ort nennen", labelEn: "name a meeting as the inferred place", required: true, any: ["reunión"] }
    ]
  },
  "checkpoint-b1-subjunctive-respond": {
    minimumMatched: 3,
    groups: [
      { key: "wish", labelDe: "Wunsch nach dem Kommen ausdrücken", labelEn: "express the wish to come", required: true, any: ["quiero que vengas", "me gustaría que vinieras"] },
      { key: "contrast", labelDe: "Verständnis kontrastierend anschließen", labelEn: "add understanding as a contrast", required: true, any: ["pero", "aunque"] },
      { key: "busy", labelDe: "Beschäftigtsein anerkennen", labelEn: "acknowledge being busy", required: true, any: ["entiendo que estás ocupado", "entiendo que estás ocupada", "sé que estás ocupado", "sé que estás ocupada", "comprendo que estás ocupado", "comprendo que estás ocupada"] }
    ]
  },
  "checkpoint-b1-subjunctive-apply": {
    minimumMatched: 2,
    groups: [
      { key: "reaction", labelDe: "Freude als Reaktion rahmen", labelEn: "frame happiness as a reaction", required: true, any: ["me alegra que", "me alegro de que", "qué bien que"] },
      { key: "outcome", labelDe: "positiven Verlauf im Subjuntivo nennen", labelEn: "state the positive outcome in the subjunctive", required: true, any: ["todo salga bien", "todo vaya bien", "las cosas vayan bien"] }
    ]
  },
  "checkpoint-b1-conditional-respond": {
    minimumMatched: 3,
    groups: [
      { key: "advice", labelDe: "Rat aus fremder Perspektive rahmen", labelEn: "frame advice from another perspective", required: true, any: ["yo que tú", "en tu lugar"] },
      { key: "conditional", labelDe: "Rat im Konditional geben", labelEn: "give the advice in the conditional", required: true, any: ["hablaría", "consultaría"] },
      { key: "director", labelDe: "zuständige Leitung nennen", labelEn: "name the responsible director", required: true, any: ["director", "directora", "responsable"] }
    ]
  },
  "checkpoint-b1-conditional-imagine": {
    minimumMatched: 3,
    groups: [
      { key: "hypothesis", labelDe: "hypothetische Bedingung im Subjuntivo", labelEn: "hypothetical condition in the subjunctive", required: true, any: ["si encontrara", "si encontrase", "si consiguiera", "si consiguiese"] },
      { key: "position", labelDe: "passende Stelle oder Arbeit nennen", labelEn: "name a suitable position or job", required: true, any: ["puesto", "trabajo", "empleo"] },
      { key: "result", labelDe: "Annahme im Konditional ausdrücken", labelEn: "express acceptance in the conditional", required: true, any: ["aceptaría", "lo aceptaría", "diría que sí"] }
    ]
  },
  "checkpoint-b1-commands-pronouns-respond": {
    minimumMatched: 3,
    groups: [
      { key: "command", labelDe: "Sendeaufforderung mit angehängtem Pronomen", labelEn: "send command with attached pronoun", required: true, any: ["mándame", "envíame", "pásame"] },
      { key: "document", labelDe: "Dokument oder Datei nennen", labelEn: "name the document or file", required: true, any: ["documento", "archivo", "informe"] },
      { key: "courtesy", labelDe: "Bitte höflich markieren", labelEn: "mark the request politely", required: true, any: ["por favor"] }
    ]
  },
  "checkpoint-b1-commands-pronouns-instruct": {
    minimumMatched: 2,
    groups: [
      { key: "negative-command", labelDe: "negative Sendeaufforderung mit Pronomen", labelEn: "negative send command with pronoun", required: true, any: ["no se lo envíes", "no se lo mandes", "no lo envíes", "no lo mandes"] },
      { key: "recipient", labelDe: "Marta als ausgeschlossene Empfängerin", labelEn: "Marta as the excluded recipient", required: true, any: ["marta"] }
    ]
  },
  "checkpoint-b1-por-para-explain": {
    minimumMatched: 2,
    groups: [
      { key: "path", labelDe: "Wegbeziehung mit por ausdrücken", labelEn: "express a route relationship with por", required: true, any: ["por la carretera", "por el camino", "por la ruta"] },
      { key: "north", labelDe: "nördliche Route bestimmen", labelEn: "identify the northern route", required: true, any: ["norte", "septentrional"] }
    ]
  },
  "checkpoint-b1-por-para-apply": {
    minimumMatched: 3,
    groups: [
      { key: "purchase", labelDe: "Kauf als abgeschlossenes Ereignis", labelEn: "state the purchase as a completed event", required: true, any: ["he comprado", "compré"] },
      { key: "gift", labelDe: "Geschenk nennen", labelEn: "name the gift", required: true, any: ["regalo"] },
      { key: "recipient", labelDe: "Empfänger mit para markieren", labelEn: "mark the recipient with para", required: true, any: ["para mi compañera", "para mi compañero", "para un colega", "para una colega"] }
    ]
  },
  "checkpoint-b1-workplace-collaboration-short-answer": {
    minimumMatched: 2,
    groups: [
      { key: "completed", labelDe: "fertige Analyse melden", labelEn: "report the completed analysis", required: true, any: ["terminado el análisis", "completado el análisis", "acabado el análisis"] },
      { key: "remaining", labelDe: "noch offene Schlussfolgerung nennen", labelEn: "name the conclusion still remaining", required: true, any: ["falta la conclusión", "terminar la conclusión", "completar la conclusión", "queda la conclusión"] }
    ]
  },
  "checkpoint-b1-workplace-collaboration-dialogue-reply": {
    minimumMatched: 3,
    groups: [
      { key: "recommendation", labelDe: "Beispiel als Verbesserung empfehlen", labelEn: "recommend an example as an improvement", required: true, any: ["conviene añadir", "sería útil añadir", "deberíamos añadir", "podemos añadir"] },
      { key: "example", labelDe: "Beispiel als Inhalt nennen", labelEn: "name the example as content", required: true, any: ["ejemplo"] },
      { key: "commitment", labelDe: "Einfügen auf Seite zwei übernehmen", labelEn: "commit to adding it on page two", required: true, any: ["voy a incluirlo en la segunda página", "lo incluiré en la segunda página", "lo pondré en la segunda página"] }
    ]
  },
  "checkpoint-b1-workplace-collaboration-write": {
    minimumMatched: 3,
    groups: [
      { key: "misunderstanding", labelDe: "Missverständnis benennen", labelEn: "name the misunderstanding", required: true, any: ["malentendido", "confusión"] },
      { key: "written", labelDe: "schriftliche Bestätigung vorschlagen", labelEn: "propose written confirmation", required: true, any: ["confirmemos por escrito", "vamos a confirmar por escrito", "deberíamos confirmar por escrito"] },
      { key: "version", labelDe: "benötigte Version klären", labelEn: "clarify the required version", required: true, any: ["qué versión necesitamos", "cuál es la versión correcta", "qué versión hace falta"] }
    ]
  }
});

async function main() {
  for (const [slug, functionalCheck] of Object.entries(checks)) {
    const exercise = await prisma.exercise.findUnique({ where: { slug }, select: { answerJson: true } });
    if (!exercise) throw new Error(`Missing A2/B1 checkpoint transfer exercise: ${slug}`);
    await prisma.exercise.update({
      where: { slug },
      data: {
        answerJson: {
          ...(exercise.answerJson || {}),
          rubric: "Complete the visible communication functions in natural Spanish; equivalent wording is accepted when every required move is present.",
          functionalCheck
        }
      }
    });
  }
  console.log(`Added natural functional grading to ${Object.keys(checks).length} A2/B1 checkpoint transfer tasks.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
