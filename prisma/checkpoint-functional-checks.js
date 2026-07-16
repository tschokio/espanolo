const CHECKS = {
  "checkpoint-a1-personal-profile-recall": {
    minimumMatched: 4,
    groups: [
      { key: "ability", labelDe: "Sprachkenntnis ausdrücken", labelEn: "state language ability", required: true, any: ["hablo", "sé hablar", "se hablar", "puedo hablar"] },
      { key: "german", labelDe: "Deutsch nennen", labelEn: "name German", required: true, any: ["alemán", "aleman"] },
      { key: "spanish", labelDe: "Spanisch nennen", labelEn: "name Spanish", required: true, any: ["español"] },
      { key: "limited", labelDe: "begrenztes Niveau ausdrücken", labelEn: "express limited proficiency", required: true, any: ["un poco", "algo de", "algo"] }
    ]
  },
  "checkpoint-a1-personal-profile-dialogue": {
    minimumMatched: 3,
    groups: [
      { key: "birthday", labelDe: "Geburtstag als Angabe", labelEn: "birthday statement", required: true, any: ["cumpleaños", "cumpleanos"] },
      { key: "day", labelDe: "zwölfter Tag", labelEn: "twelfth day", required: true, any: ["doce", "12"] },
      { key: "month", labelDe: "Mai", labelEn: "May", required: true, any: ["mayo"] }
    ]
  },
  "checkpoint-a1-personal-profile-profile": {
    minimumMatched: 3,
    groups: [
      { key: "repair", labelDe: "höfliche Reparatur einleiten", labelEn: "open a polite repair", required: true, any: ["perdona", "disculpa", "lo siento", "por favor"] },
      { key: "repeat", labelDe: "um Wiederholung bitten", labelEn: "ask for repetition", required: true, any: ["puedes repetir", "podrías repetir", "podrias repetir", "puede repetir", "repita"] },
      { key: "number", labelDe: "Nummer gezielt benennen", labelEn: "identify the number", required: true, any: ["número", "numero", "teléfono", "telefono"] }
    ]
  },
  "checkpoint-a2-making-plans-dialogue": {
    minimumMatched: 2,
    groups: [
      { key: "suitability", labelDe: "Eignung der Uhrzeit erfragen", labelEn: "ask whether the time works", required: true, any: ["te va bien", "te viene bien", "puedes a", "qué tal a", "que tal a"] },
      { key: "time", labelDe: "vier Uhr", labelEn: "four o'clock", required: true, any: ["cuatro", "4"] }
    ]
  },
  "checkpoint-a2-making-plans-recall": {
    minimumMatched: 4,
    groups: [
      { key: "day", labelDe: "Sonntag", labelEn: "Sunday", required: true, any: ["domingo"] },
      { key: "time", labelDe: "vier Uhr", labelEn: "four o'clock", required: true, any: ["cuatro", "4"] },
      { key: "landmark", labelDe: "Museum", labelEn: "museum", required: true, any: ["museo"] },
      { key: "meeting-point", labelDe: "Treffpunkt davor", labelEn: "meeting point in front", required: true, any: ["delante", "frente"] }
    ]
  },
  "checkpoint-a2-making-plans-contingency": {
    minimumMatched: 2,
    groups: [
      { key: "condition", labelDe: "mögliche Änderung als Bedingung", labelEn: "possible change as a condition", required: true, any: ["si cambia", "si hay algún cambio", "si hay algun cambio"] },
      { key: "notify", labelDe: "Bescheid geben", labelEn: "promise to notify", required: true, any: ["te aviso", "te informaré", "te informare", "te digo"] }
    ]
  },
  "checkpoint-a2-everyday-problems-short-answer": {
    minimumMatched: 3,
    groups: [
      { key: "problem-start", labelDe: "Problem oder Beginn benennen", labelEn: "identify the problem or its start", required: true, any: ["problema", "empezó", "empezo", "comenzó", "comenzo", "no funciona"] },
      { key: "past-time", labelDe: "gestern Abend als Beginn", labelEn: "last night as the start", required: true, any: ["anoche", "desde anoche"] },
      { key: "current-cold", labelDe: "aktuelle Kälte", labelEn: "current cold condition", required: true, any: ["ahora hace mucho frío", "ahora hace frio", "ahora está muy frío", "ahora esta muy frio", "ahora tengo frío", "ahora tengo frio"] }
    ]
  },
  "checkpoint-a2-everyday-problems-dialogue-reply": {
    minimumMatched: 3,
    groups: [
      { key: "today-unavailable", labelDe: "heute nicht verfügbar", labelEn: "unavailable today", required: true, any: ["hoy no puedo", "hoy no estoy", "hoy me va mal"] },
      { key: "tomorrow", labelDe: "morgen als Alternative", labelEn: "tomorrow as the alternative", required: true, any: ["mañana"] },
      { key: "home", labelDe: "zu Hause verfügbar", labelEn: "available at home", required: true, any: ["estoy en casa", "estaré en casa", "estare en casa", "puedo estar en casa"] }
    ]
  },
  "checkpoint-a2-everyday-problems-write": {
    minimumMatched: 3,
    groups: [
      { key: "wait-call", labelDe: "auf den Anruf warten", labelEn: "wait for the call", required: true, any: ["espero la llamada", "esperaré la llamada", "esperare la llamada", "quedo a la espera de la llamada"] },
      { key: "condition", labelDe: "mögliche Änderung", labelEn: "possible change", required: true, any: ["si cambia algo", "si hay algún cambio", "si hay algun cambio"] },
      { key: "notify", labelDe: "um Nachricht bitten", labelEn: "request notification", required: true, any: ["me avisa", "avíseme", "aviseme", "dígame", "digame"] }
    ]
  },
  "checkpoint-a2-health-appointments-short-answer": {
    minimumMatched: 3,
    groups: [
      { key: "request", labelDe: "Termin höflich erbitten", labelEn: "politely request an appointment", required: true, any: ["quisiera", "me gustaría", "me gustaria", "quiero", "necesito"] },
      { key: "appointment", labelDe: "Termin", labelEn: "appointment", required: true, any: ["cita"] },
      { key: "afternoon", labelDe: "heute Nachmittag", labelEn: "this afternoon", required: true, any: ["esta tarde", "hoy por la tarde"] }
    ]
  },
  "checkpoint-a2-health-appointments-dialogue-reply": {
    minimumMatched: 2,
    groups: [
      { key: "no-medication", labelDe: "keine Medikamente", labelEn: "no medication", required: true, any: ["no tomo ningún medicamento", "no tomo ningun medicamento", "no tomo medicamentos", "no estoy tomando medicamentos"] },
      { key: "no-allergies", labelDe: "keine Allergien", labelEn: "no allergies", required: true, any: ["no tengo alergias", "no soy alérgico", "no soy alergico", "no soy alérgica", "no soy alergica"] }
    ]
  },
  "checkpoint-a2-health-appointments-write": {
    minimumMatched: 4,
    groups: [
      { key: "after-food", labelDe: "nach dem Essen", labelEn: "after eating", required: true, any: ["después de comer", "despues de comer", "con comida"] },
      { key: "duration", labelDe: "zwei Tage lang", labelEn: "for two days", required: true, any: ["durante dos días", "durante dos dias", "por dos días", "por dos dias"] },
      { key: "worse-condition", labelDe: "Verschlechterung als Bedingung", labelEn: "worsening as a condition", required: true, any: ["si estoy peor", "si me encuentro peor", "si empeoro"] },
      { key: "return", labelDe: "dann zurückkehren", labelEn: "return if needed", required: true, any: ["vuelvo", "volveré", "volvere", "regreso", "regresaré", "regresare"] }
    ]
  },
  "checkpoint-a2-phone-messages-short-answer": {
    minimumMatched: 3,
    groups: [
      { key: "speak-request", labelDe: "um Gespräch bitten", labelEn: "request to speak", required: true, any: ["puedo hablar con", "podría hablar con", "podria hablar con", "quisiera hablar con"] },
      { key: "person", labelDe: "Frau Molina", labelEn: "Ms Molina", required: true, any: ["señora Molina", "senora Molina"] },
      { key: "polite", labelDe: "höflicher Abschluss", labelEn: "polite marker", required: true, any: ["por favor"] }
    ]
  },
  "checkpoint-a2-phone-messages-dialogue-reply": {
    minimumMatched: 4,
    groups: [
      { key: "relay", labelDe: "Nachricht an sie weitergeben", labelEn: "relay the message to her", required: true, any: ["dígale", "digale", "dile", "puede decirle"] },
      { key: "friday", labelDe: "Freitag nicht möglich", labelEn: "Friday is not possible", required: true, any: ["viernes no puedo", "no puedo el viernes", "viernes no me va bien"] },
      { key: "monday", labelDe: "Montag bevorzugen", labelEn: "prefer Monday", required: true, any: ["prefiero el lunes", "me viene mejor el lunes", "me va mejor el lunes"] },
      { key: "afternoon", labelDe: "am Nachmittag", labelEn: "in the afternoon", required: true, any: ["por la tarde", "de tarde"] }
    ]
  },
  "checkpoint-a2-phone-messages-write": {
    minimumMatched: 4,
    groups: [
      { key: "time", labelDe: "fünf Uhr", labelEn: "five o'clock", required: true, any: ["a las cinco", "5"] },
      { key: "condition", labelDe: "mögliches Problem als Bedingung", labelEn: "possible problem as a condition", required: true, any: ["si hay algún problema", "si hay algun problema", "si tiene algún problema", "si tiene algun problema"] },
      { key: "call", labelDe: "Rückruf ermöglichen", labelEn: "allow a callback", required: true, any: ["puede llamarme", "puedes llamarme", "llámeme", "llameme"] },
      { key: "number", labelDe: "vollständige Telefonnummer", labelEn: "complete phone number", required: true, any: ["seis ocho dos cuatro uno nueve", "682419"] }
    ]
  }
};

function checkpointFunctionalCheck(slug) {
  return CHECKS[String(slug || "")] || null;
}

module.exports = { CHECKS, checkpointFunctionalCheck };
