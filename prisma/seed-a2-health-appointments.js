const { PrismaClient, ExerciseType } = require("@prisma/client");
const { checkpointFunctionalCheck } = require("./checkpoint-functional-checks");

const prisma = new PrismaClient();

const lessons = [
  {
    slug: "a2-describe-symptoms-duration", title: "Describe Symptoms, Duration, and Severity", order: 831.71, imageKey: "body-and-health:8",
    summary: "Move beyond one pain phrase by naming symptoms, duration, severity, and an important negative fact in separate clear steps.", situation: "explaining why you need medical help",
    sentences: [
      ["Me duele la garganta.", "My throat hurts.", "Me duele agrees with one affected body area; the article stays with the body part."],
      ["Tengo fiebre y tos.", "I have a fever and a cough.", "Spanish uses tener for these symptoms."],
      ["Estoy así desde hace dos días.", "I have felt like this for two days.", "Desde hace plus a duration connects the continuing condition to its starting point."],
      ["El dolor es bastante fuerte.", "The pain is quite severe.", "A degree word makes the description more useful than dolor alone."],
      ["No tengo dificultad para respirar.", "I do not have difficulty breathing.", "A relevant negative answer is information, not an omitted part of the description."]
    ],
    readingJson: {
      title: "Cuatro dimensiones de un síntoma",
      orientationDe: "Ordne die Angaben nach Art, Dauer, Stärke und wichtigem verneintem Begleitsymptom. Die Aufgabe ist sprachliche Präzision, keine eigene Diagnose: Jede Angabe bleibt eine beobachtbare Information für medizinisches Personal.",
      orientationEn: "Sort the details into type, duration, severity, and an important absent symptom. The task is linguistic precision, not self-diagnosis: each detail remains observable information for medical staff.",
      paragraphs: [
        "Eva llama a un centro de salud. Explica: Me duele la garganta y tengo fiebre y tos. Estoy así desde hace dos días. El dolor es bastante fuerte.",
        "La recepcionista pregunta si Eva tiene dificultad para respirar. Eva responde que no. Ha comunicado síntomas, duración, intensidad y una respuesta negativa importante sin intentar decir qué enfermedad tiene."
      ],
      questions: [
        { questionDe: "Welche vier Arten von Information gibt Eva?", questionEn: "Which four kinds of information does Eva give?", optionsDe: ["Symptome, Dauer, Stärke und ein verneintes Begleitsymptom", "Nur ihren Namen und Wohnort", "Eine selbst gestellte Diagnose"], optionsEn: ["Symptoms, duration, severity, and one absent symptom", "Only her name and address", "A self-diagnosis"], correct: 0, explanationDe: "Die Beschreibung bleibt bei beobachtbaren Angaben und liefert trotzdem genug Struktur für die nächste Rückfrage.", explanationEn: "The description stays with observable details while providing enough structure for the next question." },
        { questionDe: "Was drückt desde hace dos días aus?", questionEn: "What does desde hace dos días express?", optionsDe: ["Die bis jetzt andauernde Dauer", "Einen Termin in zwei Tagen", "Eine abgeschlossene Reise"], optionsEn: ["A duration continuing until now", "An appointment in two days", "A completed trip"], correct: 0, explanationDe: "Der Zustand begann vor zwei Tagen und dauert am Sprechzeitpunkt noch an.", explanationEn: "The condition began two days ago and is still continuing at the time of speaking." }
      ],
      recallPromptDe: "Beschreibe auf Spanisch eine erfundene Beschwerde ohne Diagnose: Körperstelle oder Symptom, ein weiteres Symptom, Dauer mit desde hace, Stärke und eine wichtige verneinte Beobachtung.",
      recallPromptEn: "Describe an invented complaint in Spanish without diagnosing it: body area or symptom, one additional symptom, duration with desde hace, severity, and one important negative observation.",
      modelSummary: "Eva describe dolor de garganta, fiebre y tos, indica que lleva así dos días, precisa la intensidad y responde que no tiene dificultad para respirar."
    }
  },
  {
    slug: "a2-request-medical-appointment", title: "Request and Confirm a Medical Appointment", order: 831.72, imageKey: "body-and-health:9",
    summary: "State the purpose, ask for availability, negotiate one constraint, and repeat the complete appointment.", situation: "calling a health center for an appointment",
    sentences: [
      ["Quisiera pedir una cita con una médica.", "I would like to make an appointment with a doctor.", "Quisiera pedir una cita states the purpose respectfully and directly."],
      ["¿Tiene alguna hora disponible hoy?", "Do you have any appointment available today?", "Alguna hora asks about availability without assuming one exact time."],
      ["Por la mañana no puedo, pero por la tarde sí.", "I cannot in the morning, but I can in the afternoon.", "A boundary plus an alternative keeps the appointment possible."],
      ["Puede venir a las cinco y media.", "You can come at half past five.", "Puede venir offers one concrete slot to the respectfully addressed patient."],
      ["Entonces, hoy a las cinco y media con la doctora Ruiz.", "So, today at half past five with Doctor Ruiz.", "The closing repeats day, time, and professional together."]
    ],
    readingJson: {
      title: "Una cita cerrada, no solo ofrecida",
      inputMode: "listening",
      orientationDe: "Höre auf Gesprächszweck, erste Verfügbarkeit, zeitliche Grenze, Alternative und Schlussbestätigung. Ein angebotener Termin wird erst durch die gemeinsam wiederholten Angaben zu einer belastbaren Vereinbarung.",
      orientationEn: "Listen for purpose, initial availability, time constraint, alternative, and final confirmation. An offered slot becomes a reliable arrangement only when the details are repeated together.",
      paragraphs: [
        "Eva dice: Quisiera pedir una cita con una médica. La recepcionista pregunta si puede ir por la mañana. Eva responde: Por la mañana no puedo, pero por la tarde sí.",
        "La recepcionista ofrece las cinco y media con la doctora Ruiz. Eva no termina con un simple sí; confirma: Entonces, hoy a las cinco y media con la doctora Ruiz."
      ],
      questions: [
        { questionDe: "Welche Grenze nennt Eva?", questionEn: "What constraint does Eva state?", optionsDe: ["Am Vormittag kann sie nicht", "Sie kann heute überhaupt nicht", "Sie möchte keine Ärztin"], optionsEn: ["She cannot come in the morning", "She cannot come today at all", "She does not want a doctor"], correct: 0, explanationDe: "Pero por la tarde sí liefert unmittelbar einen verwendbaren alternativen Zeitraum.", explanationEn: "Pero por la tarde sí immediately supplies a usable alternative period." },
        { questionDe: "Welche drei Termindaten bestätigt Eva?", questionEn: "Which three appointment details does Eva confirm?", optionsDe: ["Tag, Uhrzeit und Ärztin", "Nur den Wochentag", "Symptom, Stärke und Medikament"], optionsEn: ["Day, time, and doctor", "Only the day", "Symptom, severity, and medicine"], correct: 0, explanationDe: "Hoy, a las cinco y media und doctora Ruiz schließen gemeinsam die Terminabsprache.", explanationEn: "Hoy, a las cinco y media, and doctora Ruiz jointly close the appointment arrangement." }
      ],
      recallPromptDe: "Vereinbare auf Spanisch einen Arzttermin: Zweck nennen, nach heutiger Verfügbarkeit fragen, einen Zeitraum mit Grundrahmen ablehnen, Alternative akzeptieren und Tag, Uhrzeit sowie Fachperson bestätigen.",
      recallPromptEn: "Arrange a medical appointment in Spanish: state the purpose, ask about availability today, decline one period, accept an alternative, and confirm day, time, and professional.",
      modelSummary: "Eva pide una cita, no puede por la mañana, acepta una hora por la tarde y confirma el día, la hora y el nombre de la doctora."
    }
  },
  {
    slug: "a2-check-in-health-details", title: "Check In and Give Essential Health Details", order: 831.73, imageKey: "body-and-health:10",
    summary: "Give identity and appointment details, then volunteer allergies and current medication as separate safety-relevant information.", situation: "checking in at a medical reception desk",
    sentences: [
      ["Tengo una cita a nombre de Eva Klein.", "I have an appointment under the name Eva Klein.", "A nombre de links the appointment to the registered name."],
      ["Aquí tiene mi tarjeta sanitaria.", "Here is my health card.", "Aquí tiene hands a document to one respectfully addressed employee."],
      ["Mi fecha de nacimiento es el seis de abril de mil novecientos noventa.", "My date of birth is April sixth, nineteen ninety.", "A complete date helps distinguish patients with similar names."],
      ["Tengo alergia a la penicilina.", "I am allergic to penicillin.", "Tengo alergia a names the substance explicitly."],
      ["Ahora no tomo ningún medicamento.", "I am not taking any medication now.", "No plus ningún gives a complete negative answer about current medication."]
    ],
    readingJson: {
      title: "Identidad primero, información de salud después",
      orientationDe: "Trenne Verwaltungsdaten und Gesundheitsangaben. Name, Karte und Geburtsdatum identifizieren den Termin; Allergie und aktuelle Medikamente sind eigene inhaltliche Angaben und dürfen nicht in einer schnellen Dokumentübergabe verschwinden.",
      orientationEn: "Separate administrative data from health information. Name, card, and date of birth identify the appointment; allergy and current medication are separate content details and should not disappear in a quick document handover.",
      paragraphs: [
        "En la recepción, Eva dice que tiene una cita a nombre de Eva Klein. Entrega su tarjeta sanitaria y confirma su fecha de nacimiento para que la empleada encuentre el registro correcto.",
        "Después Eva añade dos datos de salud: tiene alergia a la penicilina y ahora no toma ningún medicamento. Una respuesta negativa completa también comunica información útil."
      ],
      questions: [
        { questionDe: "Wozu dienen Name, Karte und Geburtsdatum?", questionEn: "What are the name, card, and date of birth used for?", optionsDe: ["Zur eindeutigen Zuordnung des Termins", "Zur Beschreibung der Schmerzstärke", "Zur Wahl eines Restaurants"], optionsEn: ["To match the appointment correctly", "To describe pain severity", "To choose a restaurant"], correct: 0, explanationDe: "Diese Angaben gehören zur Aufnahme und identifizieren den richtigen Datensatz.", explanationEn: "These details belong to check-in and identify the correct record." },
        { questionDe: "Welche zwei Gesundheitsangaben ergänzt Eva?", questionEn: "Which two health details does Eva add?", optionsDe: ["Penicillinallergie und keine aktuellen Medikamente", "Nur ihre Telefonnummer", "Hunger und Durst"], optionsEn: ["Penicillin allergy and no current medication", "Only her phone number", "Hunger and thirst"], correct: 0, explanationDe: "Beide Angaben werden ausdrücklich und getrennt von den Verwaltungsdaten genannt.", explanationEn: "Both details are stated explicitly and separately from the administrative information." }
      ],
      recallPromptDe: "Spiele die Anmeldung auf Spanisch: Terminname, Dokument und vollständiges Geburtsdatum nennen; danach eine erfundene Allergie oder deren Verneinung und aktuelle Medikamente getrennt angeben.",
      recallPromptEn: "Role-play check-in in Spanish: give the appointment name, document, and full date of birth; then separately state an invented allergy or its absence and current medication.",
      modelSummary: "Eva identifica su cita con nombre, tarjeta y fecha de nacimiento. Después comunica por separado una alergia y que no toma ningún medicamento actualmente."
    }
  },
  {
    slug: "a2-answer-clinical-questions", title: "Understand and Answer Basic Clinical Questions", order: 831.74, imageKey: "body-and-health:11",
    summary: "Recognize what a basic question is asking and answer only duration, location, severity, associated symptom, or change.", situation: "answering a clinician's first questions",
    sentences: [
      ["¿Desde cuándo se encuentra así?", "How long have you felt like this?", "Desde cuándo asks for the starting point or continuing duration."],
      ["Desde hace dos días.", "For two days.", "The short answer is complete because the question supplies the condition."],
      ["¿Dónde le duele exactamente?", "Where exactly does it hurt?", "Le keeps respectful address while dónde asks for location."],
      ["Me duele más al tragar.", "It hurts more when I swallow.", "Más al tragar states when the symptom becomes stronger."],
      ["Hoy estoy un poco mejor que ayer.", "Today I feel a little better than yesterday.", "Mejor que compares change over time rather than giving a static label."]
    ],
    readingJson: {
      title: "Cada pregunta pide una dimensión",
      inputMode: "listening",
      orientationDe: "Bestimme vor jeder Antwort, welche Dimension erfragt wird: Beginn, Ort, Auslöser oder Veränderung. Antworte genau darauf und erfinde keine zusätzliche Diagnose. Kurze Antworten sind hier vollständig, wenn der Fragekontext erhalten bleibt.",
      orientationEn: "Before each answer, identify the requested dimension: onset, location, trigger, or change. Answer exactly that without inventing a diagnosis. Short answers are complete when the question context remains clear.",
      paragraphs: [
        "La doctora pregunta: ¿Desde cuándo se encuentra así? Eva responde: Desde hace dos días. Después pregunta: ¿Dónde le duele exactamente? Eva señala la garganta.",
        "Eva explica que le duele más al tragar. La doctora pregunta si el dolor ha cambiado y Eva compara: Hoy estoy un poco mejor que ayer. Cada respuesta corresponde a una dimensión concreta."
      ],
      questions: [
        { questionDe: "Worauf antwortet desde hace dos días?", questionEn: "What does desde hace dos días answer?", optionsDe: ["Auf die Dauer", "Auf den genauen Ort", "Auf eine Medikamentendosis"], optionsEn: ["Duration", "Exact location", "A medicine dose"], correct: 0, explanationDe: "Desde cuándo und desde hace gehören als Frage-Antwort-Paar zur zeitlichen Einordnung.", explanationEn: "Desde cuándo and desde hace form a question-answer pair for time and duration." },
        { questionDe: "Welche Veränderung beschreibt Eva?", questionEn: "What change does Eva describe?", optionsDe: ["Heute etwas besser als gestern", "Heute viel schlechter als morgen", "Keine zeitliche Veränderung"], optionsEn: ["A little better today than yesterday", "Much worse today than tomorrow", "No change over time"], correct: 0, explanationDe: "Mejor que ayer vergleicht denselben Zustand an zwei Zeitpunkten.", explanationEn: "Mejor que ayer compares the same condition at two times." }
      ],
      recallPromptDe: "Beantworte vier erfundene medizinische Basisfragen auf Spanisch: Dauer, genauer Ort, Situation mit stärkerem Symptom und Veränderung seit gestern. Antworte pro Frage nur mit der verlangten Information.",
      recallPromptEn: "Answer four invented basic medical questions in Spanish: duration, exact location, situation in which the symptom is stronger, and change since yesterday. Give only the requested information each time.",
      modelSummary: "Eva responde por dimensiones: lleva dos días así, localiza el dolor en la garganta, explica que aumenta al tragar y compara cómo se siente hoy con ayer."
    }
  },
  {
    slug: "a2-understand-care-instructions", title: "Understand Basic Care Instructions", order: 831.75, imageKey: "body-and-health:12",
    summary: "Extract action, amount or frequency, timing condition, duration, and the condition for seeking further help.", situation: "listening to basic instructions from a clinician or pharmacist",
    sentences: [
      ["Tome una pastilla cada ocho horas.", "Take one tablet every eight hours.", "Treat the formal instruction as one service chunk and extract action, amount, and frequency."],
      ["Tómela después de comer.", "Take it after eating.", "La replaces la pastilla and después de comer gives the timing condition."],
      ["Descanse y beba bastante agua.", "Rest and drink plenty of water.", "Two coordinated formal instructions require two actions."],
      ["Hágalo durante tres días.", "Do it for three days.", "Durante gives the duration; lo refers to the instructed plan."],
      ["Si se encuentra peor, vuelva al centro de salud.", "If you feel worse, return to the health center.", "The si clause states the condition that changes the next action."]
    ],
    readingJson: {
      title: "Acción, frecuencia, momento, duración y condición",
      orientationDe: "Höre nicht nur auf Medikamentennamen. Zerlege jede Anweisung in Handlung, Menge oder Häufigkeit, Zeitpunkt, Dauer und Bedingung für den nächsten Kontakt. Die Beispiele dienen dem Sprachlernen, nicht als persönliche Behandlungsempfehlung.",
      orientationEn: "Do not listen only for medicine names. Break each instruction into action, amount or frequency, timing, duration, and condition for further contact. The examples teach language and are not personal treatment advice.",
      paragraphs: [
        "La doctora explica un plan de ejemplo: Tome una pastilla cada ocho horas y tómela después de comer. También indica dos acciones: Descanse y beba bastante agua.",
        "La duración es de tres días. La última instrucción depende de una condición: Si se encuentra peor, vuelva al centro de salud. Eva debe distinguir el plan normal del paso que solo corresponde si cambia su estado."
      ],
      questions: [
        { questionDe: "Welche fünf Informationstypen enthält der Plan?", questionEn: "Which five information types does the plan contain?", optionsDe: ["Handlung, Häufigkeit, Zeitpunkt, Dauer und Bedingung", "Nur Farbe und Preis", "Name, Adresse und Beruf"], optionsEn: ["Action, frequency, timing, duration, and condition", "Only color and price", "Name, address, and occupation"], correct: 0, explanationDe: "Erst diese fünf Bausteine machen aus einzelnen Wörtern eine vollständig verstandene Anweisung.", explanationEn: "These five parts turn individual words into a fully understood instruction." },
        { questionDe: "Wann soll Eva erneut zum Gesundheitszentrum?", questionEn: "When should Eva return to the health center?", optionsDe: ["Wenn es ihr schlechter geht", "Automatisch nach jeder Mahlzeit", "Nur wenn sie sich besser fühlt"], optionsEn: ["If she feels worse", "Automatically after every meal", "Only if she feels better"], correct: 0, explanationDe: "Si se encuentra peor ist die Bedingung, die eine andere nächste Handlung auslöst.", explanationEn: "Si se encuentra peor is the condition that triggers a different next action." }
      ],
      recallPromptDe: "Rekonstruiere den Beispielplan auf Spanisch: Handlung und Häufigkeit, Zeitpunkt, zwei weitere Handlungen, Dauer und eine si-Bedingung für erneuten Kontakt. Kennzeichne ihn ausdrücklich als erfundenes Sprachbeispiel.",
      recallPromptEn: "Reconstruct the example plan in Spanish: action and frequency, timing, two additional actions, duration, and a si condition for further contact. Explicitly label it as an invented language example.",
      modelSummary: "El ejemplo incluye una pastilla cada ocho horas después de comer, descanso, agua durante tres días y una vuelta al centro solamente si Eva se encuentra peor."
    }
  },
  {
    slug: "a2-clarify-health-instructions", title: "Clarify and Confirm Health Instructions", order: 831.76, imageKey: "body-and-health:13",
    summary: "Interrupt respectfully, isolate the unclear detail, test an interpretation, and repeat the complete instruction in your own words.", situation: "checking that you understood health instructions correctly",
    sentences: [
      ["Perdone, no he entendido la frecuencia.", "Excuse me, I did not understand the frequency.", "Name the unclear category so the professional knows what to repeat."],
      ["¿Ha dicho cada seis o cada ocho horas?", "Did you say every six or every eight hours?", "An either-or question isolates the uncertain number."],
      ["Cada ocho horas, siempre después de comer.", "Every eight hours, always after eating.", "The answer repeats frequency and timing condition together."],
      ["Entonces, una pastilla cada ocho horas después de comer.", "So, one tablet every eight hours after eating.", "Entonces introduces a teach-back in the patient's own complete frame."],
      ["Exacto. Si tiene otra duda, vuelva a preguntar.", "Exactly. If you have another question, ask again.", "The professional confirms the interpretation and explicitly keeps repair available."]
    ],
    readingJson: {
      title: "No repetir todo: localizar y comprobar",
      inputMode: "listening",
      orientationDe: "Verfolge vier Reparaturschritte: unklare Kategorie benennen, zwei gehörte Möglichkeiten gegenüberstellen, korrigierte Angabe aufnehmen und den vollständigen Plan selbst wiedergeben. Das ist stärker als ein höfliches, aber inhaltlich leeres sí.",
      orientationEn: "Follow four repair steps: name the unclear category, contrast two heard possibilities, take in the corrected detail, and restate the full plan yourself. This is stronger than a polite but empty yes.",
      paragraphs: [
        "Eva interrumpe con respeto: Perdone, no he entendido la frecuencia. No pide repetir toda la consulta, sino que pregunta: ¿Ha dicho cada seis o cada ocho horas?",
        "La doctora responde: Cada ocho horas, siempre después de comer. Eva comprueba la interpretación repitiendo dosis, frecuencia y momento. La doctora confirma que es correcto y mantiene abierta otra pregunta."
      ],
      questions: [
        { questionDe: "Welche Angabe isoliert Eva?", questionEn: "Which detail does Eva isolate?", optionsDe: ["Die Häufigkeit", "Den Namen der Ärztin", "Die Adresse des Cafés"], optionsEn: ["Frequency", "The doctor's name", "The café address"], correct: 0, explanationDe: "Frecuencia sowie cada seis o cada ocho grenzen genau die unsichere Information ein.", explanationEn: "Frecuencia and cada seis o cada ocho precisely isolate the uncertain information." },
        { questionDe: "Wodurch beweist Eva ihr Verstehen?", questionEn: "How does Eva demonstrate understanding?", optionsDe: ["Sie gibt Menge, Häufigkeit und Zeitpunkt gemeinsam wieder", "Sie sagt nur sí", "Sie wechselt das Thema"], optionsEn: ["She restates amount, frequency, and timing together", "She only says yes", "She changes the subject"], correct: 0, explanationDe: "Die Rückbestätigung macht sichtbar, welche konkrete Interpretation Eva mitnimmt.", explanationEn: "The teach-back makes the exact interpretation Eva is taking away visible." }
      ],
      recallPromptDe: "Repariere eine erfundene Anweisung auf Spanisch: benenne die unklare Kategorie, stelle zwei mögliche Zahlen gegenüber, lass die richtige Angabe wiederholen und fasse anschließend den ganzen Satz selbst zusammen.",
      recallPromptEn: "Repair an invented instruction in Spanish: name the unclear category, contrast two possible numbers, have the correct detail repeated, and then summarize the whole sentence yourself.",
      modelSummary: "Eva identifica la frecuencia como punto incierto, contrasta seis y ocho horas, recibe la corrección y repite dosis, frecuencia y momento para confirmar su comprensión."
    }
  },
  {
    slug: "checkpoint-a2-health-appointments", title: "Checkpoint: Manage a Basic Health Appointment", order: 831.77, imageKey: "body-and-health:14", checkpoint: true,
    summary: "Transfer the full sequence to a new stomach complaint, from symptom report and appointment through questions, instructions, and teach-back.", situation: "managing a new basic health-center interaction without sentence-by-sentence hints",
    sentences: [
      ["Me duele el estómago desde anoche.", "My stomach has hurt since last night.", "The new symptom combines location with a starting point."],
      ["Quisiera pedir una cita para esta tarde.", "I would like to make an appointment for this afternoon.", "The request states purpose and preferred period."],
      ["El dolor es leve, pero tengo náuseas.", "The pain is mild, but I feel nauseous.", "Pero separates severity from an associated symptom."],
      ["No tomo ningún medicamento y no tengo alergias.", "I am not taking any medication and I have no allergies.", "Two complete negative answers cover separate questions."],
      ["Perdone, ¿ha dicho antes o después de comer?", "Excuse me, did you say before or after eating?", "The focused repair isolates one timing condition."],
      ["Entonces, después de comer durante dos días; si estoy peor, vuelvo.", "So, after eating for two days; if I feel worse, I return.", "The teach-back combines timing, duration, and conditional next action."]
    ],
    readingJson: {
      title: "Una consulta nueva de principio a fin",
      inputMode: "listening",
      orientationDe: "Übertrage die Handlungskette auf eine neue Beschwerde. Beweise nicht medizinisches Wissen, sondern sprachliche Handlungsfähigkeit: Symptome beobachten, Termin koordinieren, Fragen passend beantworten, eine unsichere Anweisung isolieren und den verstandenen Plan zurückgeben.",
      orientationEn: "Transfer the action chain to a new complaint. Demonstrate linguistic action, not medical knowledge: observe symptoms, coordinate an appointment, answer questions, isolate an uncertain instruction, and restate the understood plan.",
      paragraphs: [
        "Jonas tiene dolor de estómago desde anoche y náuseas. Llama para pedir una cita por la tarde. En la consulta explica que el dolor es leve, que no toma medicamentos y que no tiene alergias.",
        "Al oír un plan de ejemplo, Jonas no entiende el momento y pregunta si la acción va antes o después de comer. Después confirma con sus palabras el momento, la duración y qué hará si se encuentra peor."
      ],
      questions: [
        { questionDe: "Welche Angaben macht Jonas vor der Anweisung?", questionEn: "Which details does Jonas give before the instruction?", optionsDe: ["Beschwerde, Beginn, Begleitsymptom, Stärke, Medikamente und Allergien", "Nur seinen Namen", "Eine eigene Diagnose und Behandlung"], optionsEn: ["Complaint, onset, associated symptom, severity, medication, and allergies", "Only his name", "His own diagnosis and treatment"], correct: 0, explanationDe: "Die Angaben bleiben beobachtbar und beantworten unterschiedliche praktische Fragen der Situation.", explanationEn: "The details remain observable and answer different practical questions in the interaction." },
        { questionDe: "Was enthält Jonas’ Rückbestätigung?", questionEn: "What does Jonas's teach-back contain?", optionsDe: ["Zeitpunkt, Dauer und Bedingung für Rückkehr", "Nur ein allgemeines Danke", "Terminname und Adresse"], optionsEn: ["Timing, duration, and condition for return", "Only a general thank you", "Appointment name and address"], correct: 0, explanationDe: "Damit wird der verstandene Handlungsplan überprüfbar und eine mögliche Verwechslung sichtbar.", explanationEn: "This makes the understood action plan checkable and exposes any possible confusion." }
      ],
      recallPromptDe: "Spiele die neue Sequenz vollständig auf Spanisch: Beschwerde und Beginn, Terminwunsch, Stärke und Begleitsymptom, Medikamente und Allergien, gezielte Rückfrage sowie Rückbestätigung mit Zeitpunkt, Dauer und si-Bedingung.",
      recallPromptEn: "Role-play the new sequence fully in Spanish: complaint and onset, appointment request, severity and associated symptom, medication and allergies, focused clarification, and teach-back with timing, duration, and a si condition.",
      modelSummary: "Jonas comunica una nueva molestia, coordina la cita, responde sobre intensidad, medicación y alergias, repara un momento incierto y confirma el plan con una condición."
    }
  }
];

const vocabulary = [
  ["la garganta", "throat", "noun", "feminine", "Me duele la garganta."],
  ["la fiebre", "fever", "noun", "feminine", "Tengo fiebre."],
  ["la tos", "cough", "noun", "feminine", "Tengo tos."],
  ["desde hace", "for a continuing duration", "phrase", null, "Estoy así desde hace dos días."],
  ["leve", "mild", "adjective", null, "El dolor es leve."],
  ["fuerte", "severe or strong", "adjective", null, "El dolor es fuerte."],
  ["la dificultad para respirar", "difficulty breathing", "phrase", "feminine", "No tengo dificultad para respirar."],
  ["pedir una cita", "to make an appointment", "phrase", null, "Quisiera pedir una cita."],
  ["la hora disponible", "available appointment time", "phrase", "feminine", "¿Tiene alguna hora disponible?"],
  ["el centro de salud", "health center", "phrase", "masculine", "Vuelva al centro de salud."],
  ["la tarjeta sanitaria", "health card", "phrase", "feminine", "Aquí tiene mi tarjeta sanitaria."],
  ["la fecha de nacimiento", "date of birth", "phrase", "feminine", "Mi fecha de nacimiento es el seis de abril."],
  ["la penicilina", "penicillin", "noun", "feminine", "Tengo alergia a la penicilina."],
  ["tomar un medicamento", "to take medication", "phrase", null, "No tomo ningún medicamento."],
  ["¿desde cuándo?", "since when?", "question", null, "¿Desde cuándo se encuentra así?"],
  ["exactamente", "exactly", "adverb", null, "¿Dónde le duele exactamente?"],
  ["tragar", "to swallow", "verb", null, "Me duele al tragar."],
  ["la pastilla", "tablet or pill", "noun", "feminine", "Tome una pastilla."],
  ["cada ocho horas", "every eight hours", "phrase", null, "Tome una pastilla cada ocho horas."],
  ["después de comer", "after eating", "phrase", null, "Tómela después de comer."],
  ["durante", "for or during", "preposition", null, "Hágalo durante tres días."],
  ["encontrarse peor", "to feel worse", "phrase", null, "Si se encuentra peor, vuelva."],
  ["la frecuencia", "frequency", "noun", "feminine", "No he entendido la frecuencia."],
  ["las náuseas", "nausea", "noun", "feminine", "Tengo náuseas."]
];

const normalize = (value) => String(value || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñü]+/g, " ").trim();
const accepted = (value) => [...new Set([value, normalize(value), `${normalize(value)}.`, `${normalize(value)}?`, `${normalize(value)}!`])];
const tokenize = (value) => String(value || "").match(/[¿¡]?[^\s.,;:!?]+|[.,;:!?]/g) || [];

function checksFor(input) {
  const s = input.sentences;
  return [
    ...[0, 1, 2].map((index) => ({ key: `recognize-${index + 1}`, type: ExerciseType.MULTIPLE_CHOICE, question: s[index][1], correct: s[index][0], options: [s[index][0], s[(index + 1) % s.length][0], s[(index + 2) % s.length][0]] })),
    ...[3, 4].map((index) => ({ key: `build-${index + 1}`, type: ExerciseType.SENTENCE_BUILDER, question: s[index][1], correct: s[index][0] })),
    ...[0, 2].map((index) => ({ key: `translate-${index + 1}`, type: ExerciseType.TRANSLATION, question: s[index][1], correct: s[index][0] })),
    { key: "short-answer", type: ExerciseType.SHORT_ANSWER, question: s[1][1], correct: s[1][0] },
    { key: "dialogue-reply", type: ExerciseType.DIALOGUE_REPLY, question: s[3][1], correct: s[3][0] },
    { key: "write", type: ExerciseType.WRITING_PROMPT, question: s.at(-1)[1], correct: s.at(-1)[0] }
  ];
}

async function saveExercise(lesson, input, check, order) {
  const slug = `${input.slug}-${check.key}`;
  const functionalCheck = checkpointFunctionalCheck(slug);
  const answerJson = check.type === ExerciseType.SENTENCE_BUILDER
    ? { correctWords: tokenize(check.correct), goal: "health_interaction_word_order" }
    : {
        correct: check.correct,
        accepted: accepted(check.correct),
        goal: "health_interaction_step",
        rubric: functionalCheck
          ? "Communicate the requested observable detail or clarification clearly; natural equivalent Spanish is acceptable."
          : "Retrieve the lesson's Spanish health-interaction model accurately before the checkpoint transfer.",
        ...(functionalCheck ? { functionalCheck } : {})
      };
  const data = {
    lessonId: lesson.id, topicId: lesson.topicId, type: check.type,
    prompt: check.type === ExerciseType.MULTIPLE_CHOICE ? "Choose the Spanish turn that answers the current health-interaction task" : check.type === ExerciseType.SENTENCE_BUILDER ? "Build the next Spanish health-interaction turn" : "Continue the interaction in clear Spanish",
    instruction: "Identify whether the turn asks for symptom, duration, appointment detail, health detail, instruction, or clarification. Answer only that task and do not invent a diagnosis.",
    questionText: check.question, answerJson,
    explanation: input.sentences.find((sentence) => sentence[0] === check.correct)?.[2] || input.summary,
    difficulty: check.type === ExerciseType.MULTIPLE_CHOICE ? 1 : check.type === ExerciseType.SENTENCE_BUILDER ? 2 : 3,
    order, xpReward: 14, imageKey: input.imageKey
  };
  const exercise = await prisma.exercise.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id } });
  if (check.options) await prisma.exerciseOption.createMany({ data: check.options.map((text, index) => ({ exerciseId: exercise.id, text, value: text, isCorrect: index === 0, order: index + 1 })) });
}

async function main() {
  const topic = await prisma.grammarTopic.upsert({
    where: { slug: "health-appointments-instructions" },
    update: { title: "Health Appointments and Instructions", description: "Observable symptom details, appointment coordination, check-in, basic questions, instruction comprehension, and teach-back clarification.", cefrLevel: "A2", imageKey: "body-and-health:8" },
    create: { slug: "health-appointments-instructions", title: "Health Appointments and Instructions", description: "Observable symptom details, appointment coordination, check-in, basic questions, instruction comprehension, and teach-back clarification.", cefrLevel: "A2", imageKey: "body-and-health:8" }
  });
  const vocabularyGroup = await prisma.vocabularyGroup.upsert({
    where: { slug: "a2-health-appointments" },
    update: { title: "A2 Health Appointments", description: "Reusable words and chunks for symptom description, appointments, check-in, basic questions, and instruction clarification.", situation: "managing a basic appointment without diagnosing yourself", imageKey: "body-and-health:8" },
    create: { slug: "a2-health-appointments", title: "A2 Health Appointments", description: "Reusable words and chunks for symptom description, appointments, check-in, basic questions, and instruction clarification.", situation: "managing a basic appointment without diagnosing yourself", imageKey: "body-and-health:8" }
  });
  for (const [spanish, english, partOfSpeech, gender, example] of vocabulary) {
    const existing = await prisma.word.findFirst({ where: { groupId: vocabularyGroup.id, spanish } });
    const data = { spanish, english, partOfSpeech, gender, example, imageKey: null, groupId: vocabularyGroup.id };
    if (existing) await prisma.word.update({ where: { id: existing.id }, data });
    else await prisma.word.create({ data });
  }
  const supportingGroups = await prisma.vocabularyGroup.findMany({ where: { slug: { in: ["body-and-health", "useful-phrases", "a2-formal-address-service"] } } });
  const groups = [vocabularyGroup, ...supportingGroups];
  for (const input of lessons) {
    const common = {
      title: input.title, summary: input.summary, cefrLevel: "A2", theme: input.checkpoint ? "Checkpoint" : "Health Interaction", situation: input.situation,
      imageKey: input.imageKey,
      outcomesJson: ["You can describe observable symptoms with duration and severity without inventing a diagnosis.", "You can coordinate and check in for a basic appointment and answer focused questions.", "You can extract, clarify, and teach back the parts of an instruction."],
      conceptKeys: ["a2", "health-appointments-instructions", "health-interaction", input.slug], reviewSummary: input.summary, readingJson: input.readingJson,
      order: input.order, estimatedMinutes: input.checkpoint ? 19 : 16, topicId: topic.id
    };
    const lesson = await prisma.lesson.upsert({
      where: { slug: input.slug },
      update: { ...common, vocabularyGroups: { set: groups.map(({ id }) => ({ id })) } },
      create: { slug: input.slug, ...common, vocabularyGroups: { connect: groups.map(({ id }) => ({ id })) } }
    });
    await prisma.sentence.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.sentence.createMany({ data: input.sentences.map(([spanish, english, note]) => ({ lessonId: lesson.id, topicId: topic.id, spanish, english, note })) });
    const checks = checksFor(input);
    for (let index = 0; index < checks.length; index += 1) await saveExercise(lesson, input, checks[index], index + 1);
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, slug: { startsWith: `${input.slug}-` }, NOT: { slug: { in: checks.map((check) => `${input.slug}-${check.key}`) } } } });
  }
  console.log(`Seeded ${lessons.length} A2.10 health-appointment learning packages and ${vocabulary.length} aligned vocabulary items.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { lessons, vocabulary };
