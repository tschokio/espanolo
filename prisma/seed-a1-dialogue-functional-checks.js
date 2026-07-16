const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const checks = Object.freeze({
  "checkpoint-a1-absolute-dialogue-name": {
    minimumMatched: 1,
    groups: [
      { key: "name", labelDe: "eigener Name nach me llamo", labelEn: "own name after me llamo", required: true, followedBy: ["me llamo"], minimumTrailingWords: 1, notAny: ["no me llamo"] }
    ]
  },
  "checkpoint-a1-core-grammar-dialogue-transfer": {
    minimumMatched: 2,
    groups: [
      { key: "identity", labelDe: "sagen, wer du bist", labelEn: "say who you are", required: true, any: ["soy estudiante", "soy alumno", "soy alumna", "me llamo"] },
      { key: "state", labelDe: "heutigen Zustand nennen", labelEn: "give today's state", required: true, followedBy: ["estoy", "me siento"], minimumTrailingWords: 1 }
    ]
  },
  "checkpoint-a1-survival-cafe-reply": {
    minimumMatched: 1,
    groups: [
      { key: "order", labelDe: "einen eigenen Wunsch bestellen", labelEn: "order an item of your choice", required: true, followedBy: ["quiero", "quisiera", "me gustaría", "para mí"], minimumTrailingWords: 1, notAny: ["no quiero", "no quisiera"] },
      { key: "courtesy", labelDe: "höflich abschließen", labelEn: "close politely", required: false, any: ["por favor", "gracias"] }
    ]
  },
  "checkpoint-a1-daily-life-dialogue-transfer": {
    minimumMatched: 2,
    groups: [
      { key: "problem", labelDe: "Verständnisproblem nennen", labelEn: "state the comprehension problem", required: true, any: ["no entiendo", "no comprendo"] },
      { key: "repair", labelDe: "um langsamere Wiederholung bitten", labelEn: "ask for slower repetition", required: true, any: ["más despacio", "puede repetir", "puedes repetir", "repita", "otra vez"] }
    ]
  },
  "checkpoint-a1-building-blocks-dialogue-transfer": {
    minimumMatched: 1,
    groups: [
      { key: "origin", labelDe: "eigene Herkunft nach soy de nennen", labelEn: "give your own origin after soy de", required: true, followedBy: ["soy de", "vengo de"], minimumTrailingWords: 1, notAny: ["no soy de", "no vengo de"] }
    ]
  },
  "checkpoint-a1-verb-frames-dialogue-transfer": {
    minimumMatched: 1,
    groups: [
      { key: "possession", labelDe: "einen eigenen Gegenstand nennen", labelEn: "name an item you have", required: true, followedBy: ["tengo", "llevo"], minimumTrailingWords: 1, notAny: ["no tengo", "no llevo"] }
    ]
  },
  "checkpoint-a1-numbers-in-life-dialogue": {
    minimumMatched: 2,
    groups: [
      { key: "age-frame", labelDe: "Alter mit tengo ausdrücken", labelEn: "express age with tengo", required: true, followedBy: ["tengo"], minimumTrailingWords: 2, notAny: ["no tengo"] },
      { key: "years", labelDe: "Jahre mit años nennen", labelEn: "state years with años", required: true, any: ["años"] }
    ]
  },
  "checkpoint-a1-health-doctor-reply": {
    minimumMatched: 1,
    groups: [
      { key: "need", labelDe: "benötigte Hilfe oder Person nennen", labelEn: "name the help or person needed", required: true, followedBy: ["necesito", "busco", "me hace falta"], minimumTrailingWords: 1, notAny: ["no necesito", "no busco"] }
    ]
  },
  "checkpoint-a1-foundations-dialogue-transfer": {
    minimumMatched: 2,
    groups: [
      { key: "identity", labelDe: "sagen, wer du bist", labelEn: "say who you are", required: true, any: ["soy estudiante", "soy alumno", "soy alumna", "me llamo"] },
      { key: "location", labelDe: "eigenen Aufenthaltsort nennen", labelEn: "give your own location", required: true, followedBy: ["estoy en", "me encuentro en"], minimumTrailingWords: 1, notAny: ["no estoy en", "no me encuentro en"] }
    ]
  },
  "checkpoint-a1-essential-present-time-dialogue": {
    minimumMatched: 2,
    groups: [
      { key: "start", labelDe: "Beginn mit empieza oder comienza nennen", labelEn: "state the start with empieza or comienza", required: true, any: ["empieza", "comienza"], notAny: ["no empieza", "no comienza"] },
      { key: "time", labelDe: "eine Uhrzeit nach a la/a las nennen", labelEn: "give a time after a la/a las", required: true, followedBy: ["a la", "a las"], minimumTrailingWords: 1 }
    ]
  },
  "checkpoint-a1-contractions-choice-dialogue": {
    minimumMatched: 2,
    groups: [
      { key: "selection", labelDe: "mit cuál nach einer konkreten Auswahl fragen", labelEn: "use cuál to ask for a specific choice", required: true, any: ["cuál"] },
      { key: "hotel", labelDe: "das zu identifizierende Hotel nennen", labelEn: "name the hotel being identified", required: true, any: ["hotel"] }
    ]
  },
  "checkpoint-a1-getting-around-dialogue": {
    minimumMatched: 2,
    groups: [
      { key: "problem", labelDe: "das konkrete Problem beschreiben", labelEn: "describe the concrete problem", required: true, any: ["no funciona", "no puedo abrir", "no puedo entrar", "está rota", "está roto", "he perdido"] },
      { key: "travel-object", labelDe: "betroffenen Reisegegenstand oder Ort nennen", labelEn: "name the affected travel item or place", required: true, any: ["llave", "tarjeta", "puerta", "habitación"] }
    ]
  }
});

async function main() {
  for (const [slug, functionalCheck] of Object.entries(checks)) {
    const exercise = await prisma.exercise.findUnique({ where: { slug }, select: { answerJson: true } });
    if (!exercise) throw new Error(`Missing A1 dialogue checkpoint exercise: ${slug}`);
    await prisma.exercise.update({
      where: { slug },
      data: { answerJson: { ...(exercise.answerJson || {}), functionalCheck } }
    });
  }
  console.log(`Added natural functional grading to ${Object.keys(checks).length} A1 checkpoint dialogues.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
