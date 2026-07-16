const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "b1-opinion-frames": {
    title: "¿Trabajar desde casa o en la oficina?",
    inputMode: "listening",
    orientationDe: "Höre zuerst, welche Aussagen persönliche Sichtweisen sind. Achte danach darauf, wie jede Person ihre Haltung sprachlich begrenzt.",
    orientationEn: "First listen for personal viewpoints. Then notice how each speaker linguistically limits their position.",
    paragraphs: [
      "Marta dice: «Para mí, trabajar desde casa es práctico porque no pierdo tiempo en el transporte. Creo que también me concentro mejor por la mañana».",
      "Luis responde: «Yo pienso que la oficina es útil para resolver problemas con el equipo. En mi opinión, la mejor solución es combinar los dos lugares»."
    ],
    questions: [
      { questionDe: "Welche Haltung vertritt Marta?", questionEn: "What is Marta's view?", optionsDe: ["Sie findet Arbeit zu Hause praktisch", "Sie möchte jeden Tag ins Büro", "Sie lehnt beide Möglichkeiten ab"], optionsEn: ["She finds working from home practical", "She wants to go to the office every day", "She rejects both options"], correct: 0, explanationDe: "Para mí und creo que kennzeichnen Martas persönliche positive Sicht auf die Arbeit zu Hause.", explanationEn: "Para mí and creo que mark Marta's positive personal view of working from home." },
      { questionDe: "Was empfiehlt Luis?", questionEn: "What does Luis recommend?", optionsDe: ["Beide Arbeitsorte kombinieren", "Nur allein arbeiten", "Den Arbeitsplatz wechseln"], optionsEn: ["Combine both workplaces", "Work alone only", "Change jobs"], correct: 0, explanationDe: "Er nennt einen Vorteil des Büros und formuliert danach ausdrücklich eine kombinierte Lösung.", explanationEn: "He names one advantage of the office and then explicitly proposes a combined solution." }
    ],
    recallPromptDe: "Gib auf Spanisch eine der beiden Sichtweisen mit creo que, para mí oder en mi opinión wieder.",
    recallPromptEn: "Restate one of the two viewpoints in Spanish using creo que, para mí, or en mi opinión.",
    modelSummary: "Para Marta, trabajar desde casa es práctico, pero Luis piensa que es mejor combinar la casa y la oficina."
  },
  "b1-give-reasons": {
    title: "Por qué Clara elige el tren",
    orientationDe: "Ordne Claras Position, ihre Gründe, einen Nachteil und ihre abschließende Folgerung.",
    orientationEn: "Track Clara's position, her reasons, one drawback, and her final conclusion.",
    paragraphs: [
      "Clara prefiere viajar en tren porque durante el trayecto puede leer o descansar. Además, la estación está cerca de su casa y no necesita buscar aparcamiento.",
      "Aunque el billete a veces es más caro que el autobús, el viaje suele ser más rápido. Por eso Clara paga un poco más cuando tiene una cita importante."
    ],
    questions: [
      { questionDe: "Welche zwei Vorteile nennt Clara zuerst?", questionEn: "Which two advantages does Clara mention first?", optionsDe: ["Sie kann lesen oder ruhen und die Station ist nah", "Der Zug ist immer kostenlos und leer", "Sie kann ihr Auto im Zug reparieren"], optionsEn: ["She can read or rest and the station is nearby", "The train is always free and empty", "She can repair her car on the train"], correct: 0, explanationDe: "Der erste Absatz nennt nutzbare Reisezeit und die nahe Station als zwei getrennte Gründe.", explanationEn: "The first paragraph gives usable travel time and the nearby station as two separate reasons." },
      { questionDe: "Wann akzeptiert Clara den höheren Preis?", questionEn: "When does Clara accept the higher price?", optionsDe: ["Wenn sie einen wichtigen Termin hat", "Wenn der Zug langsamer ist", "Nur wenn sie parken muss"], optionsEn: ["When she has an important appointment", "When the train is slower", "Only when she must park"], correct: 0, explanationDe: "Por eso verbindet die vorherige Abwägung mit ihrer Entscheidung bei wichtigen Terminen.", explanationEn: "Por eso connects the preceding balance of reasons to her decision for important appointments." }
    ],
    recallPromptDe: "Fasse Claras Wahl auf Spanisch mit porque und obwohl beziehungsweise aunque zusammen.",
    recallPromptEn: "Summarize Clara's choice in Spanish using porque and aunque.",
    modelSummary: "Clara prefiere el tren porque puede descansar y llega más rápido, aunque a veces cuesta más."
  },
  "b1-agree-disagree-politely": {
    title: "Una discusión sobre el centro",
    inputMode: "listening",
    orientationDe: "Höre, wo Pablo zuerst Zustimmung zeigt und an welcher Stelle er anschließend höflich widerspricht.",
    orientationEn: "Listen for where Pablo first shows agreement and where he then disagrees politely.",
    paragraphs: [
      "Elena propone cerrar el centro a los coches los sábados. Dice que así las familias podrían caminar con más tranquilidad y habría menos ruido.",
      "Pablo responde: «Tienes razón sobre el ruido y entiendo tu punto. Sin embargo, no estoy del todo de acuerdo con cerrar todas las calles, porque algunas personas necesitan llegar en coche»."
    ],
    questions: [
      { questionDe: "Welchen Punkt erkennt Pablo ausdrücklich an?", questionEn: "Which point does Pablo explicitly acknowledge?", optionsDe: ["Das Problem mit dem Lärm", "Dass niemand ein Auto braucht", "Dass alle Straßen bereits geschlossen sind"], optionsEn: ["The problem of noise", "That nobody needs a car", "That all streets are already closed"], correct: 0, explanationDe: "Tienes razón sobre el ruido bestätigt genau diesen Teil von Elenas Argument.", explanationEn: "Tienes razón sobre el ruido confirms exactly that part of Elena's argument." },
      { questionDe: "Wogegen richtet sich sein Einwand?", questionEn: "What does his objection target?", optionsDe: ["Gegen die Schließung aller Straßen", "Gegen ruhiges Gehen", "Gegen Gespräche über Verkehr"], optionsEn: ["Closing every street", "Walking peacefully", "Discussing traffic"], correct: 0, explanationDe: "No estoy del todo de acuerdo begrenzt den Widerspruch; er lehnt nicht die ganze Idee, sondern deren vollständige Ausdehnung ab.", explanationEn: "No estoy del todo de acuerdo limits the disagreement; he rejects the full scope, not the entire idea." }
    ],
    recallPromptDe: "Antworte Elena auf Spanisch mit Anerkennung, aber einem begrenzten Widerspruch.",
    recallPromptEn: "Reply to Elena in Spanish with acknowledgment followed by a limited disagreement.",
    modelSummary: "Pablo entiende la preocupación por el ruido, pero no está del todo de acuerdo con cerrar todas las calles."
  },
  "b1-compare-options": {
    title: "Dos caminos al nuevo trabajo",
    orientationDe: "Vergleiche Zeit, Preis und Bequemlichkeit. Suche danach das Kriterium, von dem die Empfehlung abhängt.",
    orientationEn: "Compare time, cost, and convenience. Then find the criterion on which the recommendation depends.",
    paragraphs: [
      "Para llegar al nuevo trabajo, Julia puede tomar un tren directo que tarda treinta minutos. Es más rápido y cómodo que el autobús, pero el abono mensual cuesta bastante más.",
      "El autobús tarda cincuenta minutos y a veces va lleno. Sin embargo, para cerca de su casa y cuesta menos. Si Julia debe ir todos los días, elegirá el tren; si solo va dos veces por semana, prefiere ahorrar y tomar el autobús."
    ],
    questions: [
      { questionDe: "Welchen Vorteil besitzt der Bus trotz der längeren Fahrt?", questionEn: "What advantage does the bus have despite the longer trip?", optionsDe: ["Er hält nah an Julias Haus und ist günstiger", "Er ist immer leer", "Er fährt ohne Haltestellen"], optionsEn: ["It stops near Julia's home and is cheaper", "It is always empty", "It runs without stops"], correct: 0, explanationDe: "Der zweite Absatz stellt Nähe und Preis den Nachteilen Zeit und Auslastung gegenüber.", explanationEn: "The second paragraph contrasts proximity and price with the disadvantages of time and crowding." },
      { questionDe: "Wovon hängt Julias Entscheidung hauptsächlich ab?", questionEn: "What does Julia's decision mainly depend on?", optionsDe: ["Von der Zahl ihrer Bürotage", "Von der Farbe des Fahrzeugs", "Von der Jahreszeit"], optionsEn: ["The number of days she goes to the office", "The vehicle's color", "The season"], correct: 0, explanationDe: "Der letzte Satz gibt für tägliche und seltenere Fahrten ausdrücklich unterschiedliche Empfehlungen.", explanationEn: "The final sentence explicitly gives different choices for daily and less frequent travel." }
    ],
    recallPromptDe: "Vergleiche Zug und Bus in höchstens zwei spanischen Sätzen und gib eine bedingte Empfehlung.",
    recallPromptEn: "Compare train and bus in no more than two Spanish sentences and give a conditional recommendation.",
    modelSummary: "El tren es más rápido y cómodo, pero el autobús es más barato; la mejor opción depende de cuántos días viaja Julia."
  },
  "b1-connected-opinion": {
    title: "Aprender en línea sin quedarse solo",
    inputMode: "listening",
    orientationDe: "Höre auf die vollständige Argumentationslinie: Position, zwei Vorteile, Einschränkung und Schlussfolgerung.",
    orientationEn: "Listen for the full line of argument: position, two advantages, limitation, and conclusion.",
    paragraphs: [
      "En mi opinión, estudiar en línea es una buena opción para muchas personas. Primero, permite organizar el horario con más libertad. Además, evita viajes largos y ofrece materiales que se pueden repetir.",
      "Sin embargo, si todo el aprendizaje ocurre a solas, falta conversación espontánea. Por eso recomiendo combinar el estudio digital con encuentros regulares en los que sea necesario hablar y escuchar."
    ],
    questions: [
      { questionDe: "Welche Einschränkung nennt die Sprecherin?", questionEn: "What limitation does the speaker mention?", optionsDe: ["Allein fehlt spontane Konversation", "Digitale Materialien lassen sich nicht wiederholen", "Online-Lernen verlangt tägliche Reisen"], optionsEn: ["Studying alone lacks spontaneous conversation", "Digital materials cannot be repeated", "Online learning requires daily travel"], correct: 0, explanationDe: "Sin embargo eröffnet den Gegenpunkt: Flexibilität allein erzeugt noch keine spontane Interaktion.", explanationEn: "Sin embargo introduces the counterpoint: flexibility alone does not create spontaneous interaction." },
      { questionDe: "Welche Lösung folgt daraus?", questionEn: "What solution follows from that?", optionsDe: ["Digitales Lernen mit regelmäßigen Treffen verbinden", "Nur noch Materialien lesen", "Jede Wiederholung vermeiden"], optionsEn: ["Combine digital learning with regular meetings", "Only read materials", "Avoid all repetition"], correct: 0, explanationDe: "Por eso leitet die Empfehlung direkt aus der zuvor genannten Einschränkung ab.", explanationEn: "Por eso derives the recommendation directly from the preceding limitation." }
    ],
    recallPromptDe: "Gib Position, wichtigsten Vorteil und Einschränkung in zwei verbundenen spanischen Sätzen wieder.",
    recallPromptEn: "Restate the position, main advantage, and limitation in two connected Spanish sentences.",
    modelSummary: "Estudiar en línea es flexible y evita viajes, pero debe combinarse con conversación para no aprender siempre a solas."
  },
  "checkpoint-b1-opinions": {
    title: "¿Cómo debería cambiar el transporte del barrio?",
    orientationDe: "Trenne die beiden Positionen, ihre Kriterien und die gemeinsame Schlussfolgerung. Der Checkpoint liefert keine Formulierungshilfe.",
    orientationEn: "Separate the two positions, their criteria, and the shared conclusion. The checkpoint provides no wording support.",
    paragraphs: [
      "Nora cree que el barrio necesita más autobuses porque muchas personas tardan demasiado en llegar al trabajo. Además, piensa que un servicio frecuente reduciría el número de coches.",
      "Iván está de acuerdo con mejorar el transporte, aunque prefiere crear primero carriles seguros para bicicletas porque cuestan menos. Al final, los dos recomiendan probar ambas medidas durante seis meses y comparar los resultados."
    ],
    questions: [
      { questionDe: "Worin stimmen Nora und Iván überein?", questionEn: "What do Nora and Iván agree on?", optionsDe: ["Der Verkehr im Viertel soll verbessert werden", "Nur Autos sollen gefördert werden", "Es sollen keine Ergebnisse gemessen werden"], optionsEn: ["Transport in the neighborhood should improve", "Only cars should be supported", "No results should be measured"], correct: 0, explanationDe: "Sie bevorzugen unterschiedliche erste Maßnahmen, teilen aber das Ziel einer Verkehrsverbesserung.", explanationEn: "They prefer different initial measures but share the goal of improving transport." },
      { questionDe: "Warum ist ihre gemeinsame Empfehlung ausgewogen?", questionEn: "Why is their joint recommendation balanced?", optionsDe: ["Beide Maßnahmen werden getestet und anhand von Ergebnissen verglichen", "Noras Ansicht wird ohne Prüfung übernommen", "Die Entscheidung wird unbegrenzt verschoben"], optionsEn: ["Both measures are tested and compared using results", "Nora's view is accepted without testing", "The decision is postponed indefinitely"], correct: 0, explanationDe: "Die Probephase verbindet beide Vorschläge mit einem sichtbaren Bewertungskriterium.", explanationEn: "The trial period combines both proposals with an explicit evaluation criterion." }
    ],
    recallPromptDe: "Fasse beide Positionen und die gemeinsame Empfehlung auf Spanisch in höchstens drei Sätzen zusammen.",
    recallPromptEn: "Summarize both positions and the joint recommendation in Spanish in no more than three sentences.",
    modelSummary: "Nora propone más autobuses e Iván prefiere carriles para bicicletas. Aunque priorizan medidas diferentes, recomiendan probar las dos y comparar los resultados."
  },
  "b1-story-main-idea": {
    title: "Una mañana que cambió en diez minutos",
    inputMode: "listening",
    orientationDe: "Höre zuerst nur auf das zentrale Problem und seine wichtigste Folge. Einzelheiten kommen im zweiten Durchgang.",
    orientationEn: "First listen only for the central problem and its main consequence. Details come on the second pass.",
    paragraphs: [
      "Ana salió temprano de casa, pero el autobús no llegó a la hora habitual. Después de esperar diez minutos, decidió caminar hasta otra parada. Allí vio pasar su autobús sin poder subir.",
      "Como consecuencia, llegó tarde al trabajo y su compañera empezó la reunión sin ella. Ana explicó lo ocurrido al final y todos entendieron que el problema de transporte había cambiado su mañana."
    ],
    questions: [
      { questionDe: "Was ist das zentrale Problem?", questionEn: "What is the central problem?", optionsDe: ["Ana verpasst wegen des unzuverlässigen Busses ihre Verbindung", "Ana vergisst den Ort ihrer Arbeit", "Die Besprechung wird abgesagt"], optionsEn: ["Ana misses her connection because of the unreliable bus", "Ana forgets where she works", "The meeting is canceled"], correct: 0, explanationDe: "Wartezeit, Haltestellenwechsel und vorbeifahrender Bus bilden gemeinsam das zentrale Ereignis.", explanationEn: "The wait, change of stop, and passing bus form the central event together." },
      { questionDe: "Welche wichtigste Folge entsteht?", questionEn: "What is the main consequence?", optionsDe: ["Die Besprechung beginnt ohne Ana", "Ana kommt früher an", "Ihre Kollegin nimmt den Bus"], optionsEn: ["The meeting starts without Ana", "Ana arrives early", "Her colleague takes the bus"], correct: 0, explanationDe: "Die verspätete Ankunft führt direkt dazu, dass die Kollegin ohne sie beginnt.", explanationEn: "Her late arrival directly causes the colleague to begin without her." }
    ],
    recallPromptDe: "Verdichte Problem und Folge in einem spanischen Satz mit así que oder como consecuencia.",
    recallPromptEn: "Condense the problem and consequence into one Spanish sentence using así que or como consecuencia.",
    modelSummary: "Ana perdió el autobús, así que llegó tarde y la reunión empezó sin ella."
  },
  "b1-story-sequence": {
    title: "Un sábado con cambio de planes",
    orientationDe: "Rekonstruiere die Ereignisse über primero, luego, mientras, después und por último.",
    orientationEn: "Reconstruct the events through primero, luego, mientras, después, and por último.",
    paragraphs: [
      "Primero, Diego preparó el desayuno y revisó la lista de compras. Luego fue al centro en autobús. Mientras esperaba en la parada, empezó a llover y llamó a Marta para cambiar el lugar de encuentro.",
      "Después de comprar lo necesario, Diego encontró a Marta en un café cercano. Por último, como seguía lloviendo, los dos volvieron a casa en taxi."
    ],
    questions: [
      { questionDe: "Was geschieht während Diego auf den Bus wartet?", questionEn: "What happens while Diego waits for the bus?", optionsDe: ["Es beginnt zu regnen", "Er fährt bereits im Taxi", "Er beendet den Einkauf"], optionsEn: ["It starts to rain", "He is already riding in a taxi", "He finishes shopping"], correct: 0, explanationDe: "Mientras markiert den laufenden Hintergrund, in den der Regen als neues Ereignis eintritt.", explanationEn: "Mientras marks the ongoing background into which the rain enters as a new event." },
      { questionDe: "Warum fahren beide am Ende mit dem Taxi?", questionEn: "Why do both take a taxi at the end?", optionsDe: ["Weil es weiterhin regnet", "Weil der Einkauf noch nicht begonnen hat", "Weil das Café geschlossen ist"], optionsEn: ["Because it is still raining", "Because shopping has not started", "Because the café is closed"], correct: 0, explanationDe: "Como seguía lloviendo nennt den direkten Grund für die letzte Handlung.", explanationEn: "Como seguía lloviendo gives the direct reason for the final action." }
    ],
    recallPromptDe: "Erzähle drei Stationen der Handlung auf Spanisch mit mindestens zwei Reihenfolgesignalen.",
    recallPromptEn: "Retell three stages of the action in Spanish using at least two sequence markers.",
    modelSummary: "Primero Diego fue de compras, luego se encontró con Marta y, como llovía, por último volvieron en taxi."
  },
  "b1-relative-que": {
    title: "El barrio que eligió Sara",
    orientationDe: "Achte darauf, welches Nomen jeder Relativsatz mit que genauer beschreibt.",
    orientationEn: "Notice which noun each relative clause with que describes more precisely.",
    paragraphs: [
      "Sara vive en un barrio que tiene todo lo necesario cerca. La panadería que abre temprano está al lado de una biblioteca que organiza talleres gratuitos.",
      "También conoce a una vecina que trabaja en el centro cultural y le recomienda actividades. Para Sara, es un lugar que permite hacer muchas cosas sin usar el coche."
    ],
    questions: [
      { questionDe: "Was organisiert die Bibliothek?", questionEn: "What does the library organize?", optionsDe: ["Kostenlose Workshops", "Autofahrten", "Wohnungsbesichtigungen"], optionsEn: ["Free workshops", "Car trips", "Apartment viewings"], correct: 0, explanationDe: "Der Relativsatz que organiza talleres gratuitos bezieht sich unmittelbar auf biblioteca.", explanationEn: "The relative clause que organiza talleres gratuitos directly modifies biblioteca." },
      { questionDe: "Warum gefällt Sara das Viertel besonders?", questionEn: "Why does Sara especially like the neighborhood?", optionsDe: ["Sie kann vieles ohne Auto erledigen", "Alle Gebäude sind neu", "Ihre Arbeit befindet sich dort"], optionsEn: ["She can do many things without a car", "Every building is new", "Her workplace is there"], correct: 0, explanationDe: "Der letzte Relativsatz fasst die praktische Eigenschaft des gesamten Ortes zusammen.", explanationEn: "The final relative clause summarizes the practical quality of the whole place." }
    ],
    recallPromptDe: "Beschreibe auf Spanisch zwei Dinge oder Personen aus dem Viertel mit que.",
    recallPromptEn: "Describe two things or people from the neighborhood in Spanish using que.",
    modelSummary: "Sara vive en un barrio que ofrece servicios cercanos y conoce a una vecina que le recomienda actividades."
  },
  "b1-report-what-someone-said": {
    title: "El mensaje que pasó por tres personas",
    inputMode: "listening",
    orientationDe: "Höre darauf, wer welche Information ursprünglich gibt und welche Teile später nur weiterberichtet werden.",
    orientationEn: "Listen for who originally gives each piece of information and which parts are later reported by someone else.",
    paragraphs: [
      "Marta llamó a Pablo y le dijo que la reunión empezaría a las nueve, no a las ocho. También explicó que el director llegaría un poco tarde.",
      "Pablo escribió a Ana: «Marta dice que empezamos a las nueve y que el director llegará después». Ana respondió que había recibido el mensaje y que avisaría a los demás."
    ],
    questions: [
      { questionDe: "Wer liefert Pablo die ursprüngliche Information?", questionEn: "Who gives Pablo the original information?", optionsDe: ["Marta", "Ana", "Der Direktor"], optionsEn: ["Marta", "Ana", "The director"], correct: 0, explanationDe: "Der erste Satz verankert Marta als Quelle; Pablo gibt ihre Nachricht anschließend weiter.", explanationEn: "The first sentence anchors Marta as the source; Pablo then passes her message on." },
      { questionDe: "Was verspricht Ana zu tun?", questionEn: "What does Ana promise to do?", optionsDe: ["Die anderen informieren", "Die Besprechung absagen", "Um acht beginnen"], optionsEn: ["Inform the others", "Cancel the meeting", "Start at eight"], correct: 0, explanationDe: "Avisaría a los demás steht als von Ana berichtete zukünftige Handlung.", explanationEn: "Avisaría a los demás is reported as Ana's future action." }
    ],
    recallPromptDe: "Gib auf Spanisch Quelle, neue Uhrzeit und Anas Reaktion als berichtete Information wieder.",
    recallPromptEn: "Report the source, the new time, and Ana's reaction in Spanish.",
    modelSummary: "Marta dijo que la reunión empezaría a las nueve; Pablo se lo contó a Ana y ella respondió que avisaría a los demás."
  },
  "b1-inference-context": {
    title: "¿Qué le pasó a Carlos?",
    orientationDe: "Trenne sichtbare Hinweise von deiner Schlussfolgerung. Der Text nennt den Grund nicht direkt.",
    orientationEn: "Separate visible clues from your inference. The text does not state the reason directly.",
    paragraphs: [
      "Carlos entró en la oficina con el paraguas mojado, dejó los zapatos junto a la puerta y buscó una toalla para secarse el pelo. En la calle, varias personas corrían bajo los balcones.",
      "Nadie dijo qué tiempo hacía. Sin embargo, a partir de esos detalles, sus compañeros pensaron que Carlos había caminado bajo una lluvia fuerte."
    ],
    questions: [
      { questionDe: "Welche Information steht ausdrücklich im Text?", questionEn: "Which information is explicitly stated?", optionsDe: ["Carlos' Regenschirm ist nass", "Ein Wetterbericht meldet starken Regen", "Carlos war den ganzen Tag draußen"], optionsEn: ["Carlos's umbrella is wet", "A weather report announces heavy rain", "Carlos was outside all day"], correct: 0, explanationDe: "Der nasse Schirm ist ein beobachtbarer Hinweis; der starke Regen wird daraus erst erschlossen.", explanationEn: "The wet umbrella is an observable clue; heavy rain is inferred from it." },
      { questionDe: "Welche Schlussfolgerung ist gut gestützt?", questionEn: "Which inference is well supported?", optionsDe: ["Carlos ist durch starken Regen gegangen", "Carlos hat seinen Regenschirm gekauft", "Carlos arbeitet nicht im Büro"], optionsEn: ["Carlos walked through heavy rain", "Carlos bought his umbrella", "Carlos does not work in the office"], correct: 0, explanationDe: "Mehrere passende Hinweise – Schirm, Schuhe, Haare und rennende Menschen – stützen gemeinsam diese Hypothese.", explanationEn: "Several converging clues—the umbrella, shoes, hair, and running people—support this hypothesis together." }
    ],
    recallPromptDe: "Formuliere auf Spanisch zuerst einen Hinweis und danach eine vorsichtige Schlussfolgerung mit probablemente.",
    recallPromptEn: "State one clue in Spanish and then a cautious inference using probablemente.",
    modelSummary: "El paraguas y el pelo de Carlos estaban mojados, así que probablemente había caminado bajo la lluvia."
  },
  "checkpoint-b1-stories": {
    title: "El retraso que abrió una oportunidad",
    inputMode: "listening",
    orientationDe: "Erfasse Ereignisfolge, Relativinformationen, berichtete Nachricht und begründete Schlussfolgerung ohne vorherige Hilfen.",
    orientationEn: "Track event sequence, relative information, reported speech, and supported inference without prior support.",
    paragraphs: [
      "Aunque Lucía salió temprano, perdió el tren que iba al centro. Luego llamó a Marta y le dijo que llegaría tarde. Mientras esperaba el siguiente tren, vio un café que acababa de abrir frente a la estación.",
      "Entró porque su abrigo estaba mojado y pidió un café. Allí habló con una mujer que trabajaba en una empresa cercana. La mujer dijo que buscaban una nueva diseñadora. En resumen, un retraso inesperado cambió los planes de Lucía y quizá le abrió una oportunidad profesional."
    ],
    questions: [
      { questionDe: "Welche Ereignisfolge ist korrekt?", questionEn: "Which event sequence is correct?", optionsDe: ["Zug verpassen, Marta anrufen, Café betreten, Frau kennenlernen", "Frau kennenlernen, Zug nehmen, Marta anrufen", "Café schließen, Arbeit absagen, nach Hause gehen"], optionsEn: ["Miss the train, call Marta, enter the café, meet a woman", "Meet a woman, take the train, call Marta", "Close the café, cancel work, go home"], correct: 0, explanationDe: "Die Reihenfolgesignale luego und mientras sowie die beiden Absätze legen genau diese Abfolge fest.", explanationEn: "The sequence markers luego and mientras plus the two paragraphs establish exactly this order." },
      { questionDe: "Welche Schlussfolgerung bleibt bewusst unsicher?", questionEn: "Which conclusion deliberately remains uncertain?", optionsDe: ["Das Treffen könnte beruflich nützlich werden", "Lucía hat den Zug verpasst", "Die Frau arbeitet in einer Firma"], optionsEn: ["The meeting could become professionally useful", "Lucía missed the train", "The woman works at a company"], correct: 0, explanationDe: "Quizá markiert die mögliche berufliche Chance als Schlussfolgerung, während Zug und Arbeitsplatz ausdrücklich genannt werden.", explanationEn: "Quizá marks the professional opportunity as an inference, while the train and workplace are explicitly stated." }
    ],
    recallPromptDe: "Erzähle auf Spanisch in höchstens drei Sätzen Problem, Begegnung und mögliche Folge.",
    recallPromptEn: "Retell the problem, encounter, and possible result in Spanish in no more than three sentences.",
    modelSummary: "Lucía perdió el tren y avisó a Marta. Mientras esperaba, entró en un café donde conoció a una mujer que dijo que su empresa buscaba una diseñadora."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const existing = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (existing.length !== entries.length) throw new Error(`B1 connected input requires ${entries.length} lessons, found ${existing.length}.`);
  for (const [slug, readingJson] of entries) {
    await prisma.lesson.update({
      where: { slug },
      data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 19 : 15 }
    });
  }
  console.log(`Seeded connected reading/listening input for ${entries.length} B1 learning packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
