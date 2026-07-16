const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SPANISH_CONNECTED_CONTENT_TITLES = Object.freeze({
  "checkpoint-a2-making-plans": "Comprobación: un plan con cambio y reparación",
  "c1-narrative-tempo": "Controlar el ritmo narrativo",
  "c1-flashback-foreshadowing": "Usar retrospecciones y anticipaciones",
  "c1-viewpoint-distance": "Cambiar el punto de vista y la distancia",
  "c1-participial-compression": "Comprimir la información con naturalidad",
  "c1-narrative-voice": "Elegir una voz narrativa eficaz",
  "checkpoint-c1-narrative-viewpoint": "C1.2 · Control de narración y punto de vista",
  "c1-thesis-scope": "Formular una tesis precisa",
  "c1-evidence-causality": "Evaluar las pruebas y la causalidad",
  "c1-source-integration": "Integrar y comparar fuentes",
  "c1-counterargument-rebuttal": "Responder a los contraargumentos con rigor",
  "c1-synthesis-recommendation": "Sintetizar y recomendar",
  "checkpoint-c1-argument-synthesis": "C1.3 · Control de argumentación y síntesis",
  "c1-implicit-meaning": "Inferir el sentido pretendido",
  "c1-diplomatic-softening": "Atenuar sin caer en la vaguedad",
  "c1-turn-management": "Gestionar los turnos con naturalidad",
  "c1-conversation-repair": "Reparar malentendidos",
  "c1-tone-stance": "Interpretar el tono y la postura",
  "checkpoint-c1-pragmatic-interaction": "C1.4 · Control de interacción pragmática",
  "c1-relative-reference": "Elegir el modo según la referencia",
  "c1-future-time-clauses": "Anclar el tiempo antes de elegir el modo",
  "c1-concession-certainty": "Separar el hecho de la concesión",
  "c1-purpose-prevention": "Relacionar finalidad, prevención y sujeto",
  "c1-open-contingency": "Expresar una contingencia abierta",
  "checkpoint-c1-mood-meaning": "C1.5 · Control de modo y significado",
  "c1-listening-structure-focus": "Percibir la estructura antes que el detalle",
  "c1-listening-self-correction": "Seguir una autocorrección oral",
  "c1-listening-implicit-purpose": "Inferir la respuesta requerida",
  "c1-listening-viewpoint-shifts": "Atribuir cambios de punto de vista",
  "c1-listening-conditions-exceptions": "Retener condiciones y excepciones",
  "checkpoint-c1-dense-listening": "C1.6 · Control de comprensión auditiva densa",
  "c2-scope-ambiguity": "Resolver el alcance y la ambigüedad",
  "c2-faithful-compression": "Comprimir sin distorsionar",
  "c2-audience-mediation": "Mediar para un nuevo público",
  "c2-reconcile-accounts": "Conciliar versiones contradictorias",
  "c2-connotation-effect": "Conservar la connotación y el efecto",
  "checkpoint-c2-precision-mediation": "C2.1 · Control de precisión y mediación",
  "c2-lexical-precision": "Precisión léxica y colocaciones",
  "c2-idiom-figurative-meaning": "Modismos y sentido figurado",
  "c2-genre-conventions": "Convenciones de género y comunicación",
  "c2-information-structure": "Estructura informativa y énfasis",
  "c2-rhetorical-architecture": "Arquitectura retórica y estilo",
  "checkpoint-c2-genre-rhetoric": "C2.2 · Control de género y retórica",
  "c2-panhispanic-grammar": "Variación gramatical panhispánica",
  "c2-regional-lexicon": "Léxico regional y adaptación",
  "c2-address-social-distance": "Tratamiento, poder y distancia social",
  "c2-face-euphemism": "Cortesía, eufemismo y significado delicado",
  "c2-humor-cultural-reference": "Humor, ironía y referencias culturales",
  "checkpoint-c2-sociolinguistic-variation": "C2.3 · Control de variación sociolingüística",
  "c2-interests-under-positions": "Posiciones, intereses y restricciones",
  "c2-conditional-concessions": "Ofertas condicionales y concesiones recíprocas",
  "c2-challenge-assumptions": "Cuestionar supuestos implícitos con diplomacia",
  "c2-multiparty-synthesis": "Síntesis entre varias partes y reservas",
  "c2-deescalation-accountability": "Desescalar sin perder responsabilidad",
  "checkpoint-c2-high-stakes-negotiation": "C2.4 · Control de negociación de alto riesgo",
  "c2-literary-ambiguity": "Ambigüedad productiva y límites interpretativos",
  "c2-voice-free-indirect-discourse": "Voz, distancia y estilo indirecto libre",
  "c2-motif-symbol-network": "Motivos, símbolos y redes de significado",
  "c2-intertext-cultural-memory": "Intertextualidad y memoria cultural",
  "c2-creative-voice-constraint": "Reescritura creativa controlada",
  "checkpoint-c2-literary-creative-control": "C2.5 · Control literario y creativo",
  "c2-spoken-repair-compression": "Reparaciones, incisos y habla comprimida",
  "c2-polyphonic-stance-tracking": "Polifonía y atribución de hablantes",
  "c2-implicit-alignment-dissent": "Alineamiento implícito y desacuerdo diplomático",
  "c2-briefing-conditions-exceptions": "Condiciones, excepciones y consecuencias operativas",
  "c2-live-synthesis-relay": "Síntesis en directo y transmisión orientada a la acción",
  "checkpoint-c2-expert-listening-synthesis": "C2.6 · Control de escucha experta y síntesis"
});

async function seedConnectedContentSpanishTitles(client = prisma) {
  for (const [slug, titleEs] of Object.entries(SPANISH_CONNECTED_CONTENT_TITLES)) {
    const lesson = await client.lesson.findUnique({
      where: { slug },
      select: { id: true, readingJson: true }
    });
    if (!lesson?.readingJson || typeof lesson.readingJson !== "object") {
      throw new Error(`Connected content is missing for ${slug}`);
    }
    const content = lesson.readingJson;
    await client.lesson.update({
      where: { id: lesson.id },
      data: {
        readingJson: {
          ...content,
          title: titleEs,
          titleEs,
          titleEn: content.titleEn || content.title
        }
      }
    });
  }
}

if (require.main === module) {
  seedConnectedContentSpanishTitles()
    .then(() => console.log(`Localized ${Object.keys(SPANISH_CONNECTED_CONTENT_TITLES).length} connected-content titles in Spanish.`))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}

module.exports = {
  SPANISH_CONNECTED_CONTENT_TITLES,
  seedConnectedContentSpanishTitles
};
