const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedInputByLesson = {
  "a2-direct-objects-lo-la": {
    title: "El pan y la camisa sin repetir",
    inputMode: "listening",
    orientationDe: "Höre zuerst das bekannte Ding und danach sein Ersatzwort. Lo ersetzt ein einzelnes männliches Objekt, la ein einzelnes weibliches Objekt; beide stehen vor dem konjugierten Verb.",
    orientationEn: "First hear the known thing and then its replacement. Lo replaces one masculine object, la one feminine object; both stand before the conjugated verb.",
    paragraphs: [
      "Marta necesita el pan para la cena. En la tienda lo ve junto a la puerta y lo compra. Después busca una camisa azul.",
      "La camisa está en una mesa. Marta la mira, la prueba y finalmente la compra. Ya no repite el pan o la camisa porque los dos objetos son conocidos."
    ],
    questions: [
      { questionDe: "Was ersetzt lo im ersten Abschnitt?", questionEn: "What does lo replace in the first paragraph?", optionsDe: ["Das Brot", "Die Tür", "Marta"], optionsEn: ["The bread", "The door", "Marta"], correct: 0, explanationDe: "El pan ist ein einzelnes männliches Objekt. Danach ersetzen lo ve und lo compra genau dieses bekannte Brot.", explanationEn: "El pan is one masculine object. Lo ve and lo compra then replace that same known bread." },
      { questionDe: "Warum heißt es bei der Bluse la prueba?", questionEn: "Why is la prueba used for the shirt?", optionsDe: ["Camisa ist weiblich und Singular", "Marta ist weiblich", "Probar verlangt immer la"], optionsEn: ["Camisa is feminine singular", "Marta is female", "Probar always requires la"], correct: 0, explanationDe: "Das Pronomen richtet sich nach dem ersetzten Objekt la camisa, nicht nach der Person, die die Handlung ausführt.", explanationEn: "The pronoun agrees with the replaced object la camisa, not with the person performing the action." }
    ],
    recallPromptDe: "Erzähle den Einkauf auf Spanisch in vier kurzen Sätzen. Nenne Brot und Bluse jeweils einmal und verwende danach mindestens zweimal lo und zweimal la.",
    recallPromptEn: "Retell the shopping trip in four short Spanish sentences. Name the bread and shirt once, then use lo and la at least twice each.",
    modelSummary: "Marta ve el pan y lo compra. Después mira la camisa, la prueba y también la compra."
  },
  "a2-direct-objects-los-las": {
    title: "Los libros y las llaves de la mudanza",
    orientationDe: "Lies auf die Mehrzahl. Los ersetzt mehrere männliche oder gemischte Dinge; las ersetzt mehrere weibliche Dinge. Das Pronomen bleibt direkt vor dem Verb.",
    orientationEn: "Read for plural objects. Los replaces several masculine or mixed things; las replaces several feminine things. The pronoun stays directly before the verb.",
    paragraphs: [
      "Leo prepara una mudanza. Necesita los libros de la mesa y los pone en una caja. También busca los vasos; los encuentra en la cocina.",
      "No ve las llaves ni las bolsas. Su amiga encuentra las llaves y las deja junto a la puerta. Después compra las bolsas porque Leo las necesita."
    ],
    questions: [
      { questionDe: "Was legt Leo in einen Karton?", questionEn: "What does Leo put in a box?", optionsDe: ["Die Bücher", "Die Schlüssel", "Die Taschen"], optionsEn: ["The books", "The keys", "The bags"], correct: 0, explanationDe: "Los in los pone en una caja verweist auf die zuvor genannten los libros und verhindert ihre Wiederholung.", explanationEn: "Los in los pone en una caja refers back to los libros and avoids repeating them." },
      { questionDe: "Worauf bezieht sich las in Leo las necesita?", questionEn: "What does las refer to in Leo las necesita?", optionsDe: ["Auf die Taschen", "Auf die Gläser", "Auf die Bücher"], optionsEn: ["The bags", "The glasses", "The books"], correct: 0, explanationDe: "Unmittelbar davor steht las bolsas. Das feminine Pluralpronomen las übernimmt genau dieses bekannte Objekt.", explanationEn: "Las bolsas appears immediately before it. The feminine plural pronoun las replaces that known object." }
    ],
    recallPromptDe: "Beschreibe die Umzugsvorbereitung auf Spanisch. Nenne Bücher, Gläser, Schlüssel und Taschen zuerst vollständig und ersetze sie danach passend mit los oder las.",
    recallPromptEn: "Describe the moving preparation in Spanish. First name the books, glasses, keys, and bags, then replace them correctly with los or las.",
    modelSummary: "Leo pone los libros en una caja y los vasos en la cocina. Su amiga encuentra las llaves y compra las bolsas."
  },
  "a2-indirect-object-le": {
    title: "Un regalo y un mensaje para Ana",
    inputMode: "listening",
    orientationDe: "Höre auf zwei Rollen: Die Sache bleibt genannt, le markiert die empfangende Person. Frage bei jedem Satz: Was wird gegeben oder gezeigt – und wem?",
    orientationEn: "Listen for two roles: the thing remains named, while le marks the receiving person. Ask what is given or shown, and to whom.",
    paragraphs: [
      "Hoy es el cumpleaños de Ana. Pablo le compra un libro y le escribe una tarjeta. Después le envía un mensaje con la hora de la fiesta.",
      "En la fiesta, Clara le da el regalo a Ana y le muestra unas fotos. Le siempre marca a Ana como receptora; el libro, el mensaje y las fotos siguen explícitos."
    ],
    questions: [
      { questionDe: "Wer ist die empfangende Person bei le compra un libro?", questionEn: "Who receives in le compra un libro?", optionsDe: ["Ana", "Pablo", "Das Buch"], optionsEn: ["Ana", "Pablo", "The book"], correct: 0, explanationDe: "Der Geburtstag gehört Ana und die späteren Sätze nennen a Ana ausdrücklich. Le verweist daher auf sie als Empfängerin.", explanationEn: "It is Ana's birthday and a later sentence says a Ana explicitly, so le refers to her as recipient." },
      { questionDe: "Welche Sache zeigt Clara der Empfängerin?", questionEn: "What does Clara show the recipient?", optionsDe: ["Einige Fotos", "Eine Uhr", "Eine Tür"], optionsEn: ["Some photos", "A clock", "A door"], correct: 0, explanationDe: "Le muestra unas fotos enthält beide Rollen: le bezeichnet Ana, unas fotos bezeichnet die gezeigte Sache.", explanationEn: "Le muestra unas fotos contains both roles: le identifies Ana, while unas fotos names the thing shown." }
    ],
    recallPromptDe: "Erzähle auf Spanisch, was Pablo und Clara für Ana tun. Verwende le mindestens viermal und nenne jedes gegebene, gesendete oder gezeigte Ding ausdrücklich.",
    recallPromptEn: "Say in Spanish what Pablo and Clara do for Ana. Use le at least four times and explicitly name each thing given, sent, or shown.",
    modelSummary: "Pablo le compra un libro y le envía un mensaje a Ana. Clara le da el regalo y le muestra unas fotos."
  },
  "a2-shopping-with-pronouns": {
    title: "La camisa azul en la tienda",
    inputMode: "listening",
    orientationDe: "Höre ein kurzes Verkaufsgespräch. Sobald ein Produkt bekannt ist, ersetzen lo, la, los oder las das Produkt; le bezeichnet dagegen die bediente Person.",
    orientationEn: "Listen to a short sales exchange. Once a product is known, lo, la, los, or las replaces it; le instead identifies the customer receiving service.",
    paragraphs: [
      "Cliente: ¿Tiene la camisa azul? Vendedora: Sí, la tengo. ¿Le muestro otra talla? Cliente: Sí, gracias. La pruebo ahora. También veo unos zapatos negros.",
      "Vendedora: Los tenemos en su talla. Cliente: Me gustan y los quiero, pero no necesito las bolsas. No las compro. Al final compra la camisa y los zapatos."
    ],
    questions: [
      { questionDe: "Was ersetzt la in la pruebo ahora?", questionEn: "What does la replace in la pruebo ahora?", optionsDe: ["Die blaue Bluse", "Die andere Größe", "Die Verkäuferin"], optionsEn: ["The blue shirt", "The other size", "The salesperson"], correct: 0, explanationDe: "Das Gespräch hat la camisa azul bereits eingeführt. La greift dieses weibliche Einzelobjekt beim Anprobieren wieder auf.", explanationEn: "The conversation has already introduced la camisa azul. La refers back to that feminine singular object when trying it on." },
      { questionDe: "Was bedeutet le in le muestro otra talla?", questionEn: "What does le mean in le muestro otra talla?", optionsDe: ["Der Kundin oder dem Kunden", "Die Bluse", "Die Schuhe"], optionsEn: ["To the customer", "The shirt", "The shoes"], correct: 0, explanationDe: "Otra talla bleibt die gezeigte Sache; le markiert die Person, der die Verkäuferin diese Größe zeigt.", explanationEn: "Otra talla remains the thing shown; le marks the person to whom the salesperson shows that size." }
    ],
    recallPromptDe: "Spiele den Einkauf auf Spanisch nach. Frage nach der Bluse und den Schuhen und antworte anschließend mit la, los, las und le, ohne die bekannten Wörter unnötig zu wiederholen.",
    recallPromptEn: "Act out the shopping exchange in Spanish. Ask about the shirt and shoes, then answer with la, los, las, and le without needless repetition.",
    modelSummary: "La clienta prueba la camisa y la compra. También quiere los zapatos y los compra, pero no necesita las bolsas."
  },
  "checkpoint-a2-object-pronouns-shopping": {
    title: "Una compra completa con cuatro pronombres",
    inputMode: "listening",
    orientationDe: "Entscheide bei jedem Pronomen zuerst zwischen Sache und Empfänger. Prüfe bei Sachen anschließend Anzahl und grammatisches Geschlecht: lo, la, los oder las; Empfänger: le.",
    orientationEn: "For each pronoun, first decide between a thing and a recipient. For things, then check number and grammatical gender: lo, la, los, or las; recipient: le.",
    paragraphs: [
      "Sara compra pan para su padre. Lo encuentra en el mercado y lo pone en una bolsa. También ve dos camisas; las mira, pero no las compra.",
      "Después encuentra unos zapatos para su madre y los compra. En casa le da el pan a su padre y le muestra los zapatos a su madre."
    ],
    questions: [
      { questionDe: "Welche Gegenstände kauft Sara tatsächlich?", questionEn: "Which items does Sara actually buy?", optionsDe: ["Brot und Schuhe", "Blusen und Brot", "Nur Blusen"], optionsEn: ["Bread and shoes", "Shirts and bread", "Only shirts"], correct: 0, explanationDe: "Lo pone en una bolsa bestätigt den Brotkauf; los compra bestätigt die Schuhe. Bei den Blusen steht ausdrücklich no las compra.", explanationEn: "Lo pone en una bolsa confirms the bread purchase; los compra confirms the shoes. The shirts explicitly have no las compra." },
      { questionDe: "Warum kann le im letzten Satz zwei Personen meinen?", questionEn: "Why can le refer to two people in the final sentence?", optionsDe: ["Le markiert männliche und weibliche Empfänger", "Le ersetzt immer mehrere Sachen", "Le bedeutet Vater und Mutter zugleich"], optionsEn: ["Le marks male and female recipients", "Le always replaces several things", "Le means father and mother together"], correct: 0, explanationDe: "Le verändert sich nicht nach dem Geschlecht: a su padre und a su madre sind jeweils einzelne empfangende Personen.", explanationEn: "Le does not change for gender: a su padre and a su madre are each one receiving person." }
    ],
    recallPromptDe: "Fasse Saras Einkauf auf Spanisch zusammen. Verwende lo für das Brot, las für die Blusen, los für die Schuhe und le in je einem Satz für Vater und Mutter.",
    recallPromptEn: "Summarize Sara's shopping trip in Spanish. Use lo for the bread, las for the shirts, los for the shoes, and le once each for her father and mother.",
    modelSummary: "Sara compra el pan y lo guarda. No compra las camisas, pero compra los zapatos. Después le da el pan a su padre."
  }
};

async function main() {
  const entries = Object.entries(connectedInputByLesson);
  const lessons = await prisma.lesson.findMany({ where: { slug: { in: entries.map(([slug]) => slug) } }, select: { slug: true } });
  if (lessons.length !== entries.length) throw new Error(`A2 object-pronoun input requires ${entries.length} lessons, found ${lessons.length}.`);
  for (const [slug, readingJson] of entries) await prisma.lesson.update({ where: { slug }, data: { readingJson, estimatedMinutes: slug.startsWith("checkpoint-") ? 18 : 15 } });
  console.log(`Seeded connected micro-input for ${entries.length} A2 object-pronoun packages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());

module.exports = { connectedInputByLesson };
