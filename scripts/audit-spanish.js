#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePaths = [
  path.join(root, "prisma", "seed.js"),
  path.join(root, "server", "learning-core.js")
];

const ignoredLinePatterns = [
  /\bslug:\s*["']/,
  /\blessonSlug:\s*["']/,
  /\btopicSlug:\s*["']/,
  /\bvocabularySlugs:\s*\[/,
  /\bimageKey:\s*["']/,
  /\bpromptMarkdown:\s*["']/,
  /\baccepted:\s*\[/,
  // Object entries whose KEY is a kebab-case identifier (e.g. the
  // exercise-slug -> imageKey map). These keys are intentionally ASCII
  // slugs, not display Spanish, so accent checks must not apply to them.
  /^\s*["'][a-z0-9-]+["']\s*:/,
  /^\s*const ESTAR_FORMS =/
];

const checks = [
  { pattern: /\besta\b(?=\s+(?:en|aquí|allí|bien|mal|cerca|lejos|feliz|triste|cansad[oa]s?|abiert[oa]s?|cerrad[oa]s?|rot[oa]s?|list[oa]s?|trabajando|comiendo|leyendo)\b|[.!?,;:])/g, expected: "está", note: "Use está for the estar form." },
  { pattern: /\bestan\b/g, expected: "están", note: "Use están for the estar form." },
  { pattern: /\bDonde\b/g, expected: "Dónde", note: "Use dónde for the question word." },
  { pattern: /\bQue\b/g, expected: "Qué", note: "Use qué for the question word." },
  { pattern: /\bCuanto\b/g, expected: "Cuánto", note: "Use cuánto for the question word." },
  { pattern: /\bQuien\b/g, expected: "Quién", note: "Use quién for the question word." },
  { pattern: /\bCuando\b/g, expected: "Cuándo", note: "Use cuándo for the question word." },
  { pattern: /\bComo\b/g, expected: "Cómo", note: "Use cómo for the question word." },
  { pattern: /¿quien\b/gi, expected: "¿quién", note: "Use quién in direct questions." },
  { pattern: /¿cuando\b/gi, expected: "¿cuándo", note: "Use cuándo in direct questions." },
  { pattern: /¿como\b/gi, expected: "¿cómo", note: "Use cómo in direct questions." },
  { pattern: /\b(el|un|al|del) cafe\b/gi, expected: "café", note: "Use café in Spanish phrases." },
  { pattern: /\bel menu\b/gi, expected: "el menú", note: "Use menú in Spanish phrases." },
  { pattern: /\bmas\b/g, expected: "más", note: "Use más." },
  { pattern: /\bespanol\b/g, expected: "español", note: "Use español." },
  { pattern: /\bgramatica\b/g, expected: "gramática", note: "Use gramática." },
  { pattern: /\bestacion\b/g, expected: "estación", note: "Use estación." },
  { pattern: /\blapiz\b/g, expected: "lápiz", note: "Use lápiz." },
  { pattern: /\bplatano\b/g, expected: "plátano", note: "Use plátano." },
  { pattern: /\blimon\b/g, expected: "limón", note: "Use limón." },
  { pattern: /\bautobus\b/g, expected: "autobús", note: "Use autobús." },
  { pattern: /\balli\b/g, expected: "allí", note: "Use allí." },
  { pattern: /\baqui\b/g, expected: "aquí", note: "Use aquí." },
  { pattern: /\bfrio\b/g, expected: "frío", note: "Use frío." },
  { pattern: /\bfria\b/g, expected: "fría", note: "Use fría." },
  { pattern: /\blampara\b/g, expected: "lámpara", note: "Use lámpara." },
  { pattern: /\bel sofa\b/gi, expected: "el sofá", note: "Use sofá in Spanish phrases." },
  { pattern: /\barbol\b/g, expected: "árbol", note: "Use árbol." },
  { pattern: /\bpajaro\b/g, expected: "pájaro", note: "Use pájaro." },
  { pattern: /\bperdon\b/g, expected: "perdón", note: "Use perdón." },
  { pattern: /\bninos\b/g, expected: "niños", note: "Use niños." },
  { pattern: /\bmanana\b/g, expected: "mañana", note: "Use mañana for morning/tomorrow." },
  { pattern: /\bTu\b/g, expected: "Tú", note: "Use tú for the pronoun." },
  { pattern: /\bEl es\b/g, expected: "Él es", note: "Use él for the subject pronoun." },
  { pattern: /\bquien asks\b/gi, expected: "quién asks", note: "Use quién when naming the question word." },
  { pattern: /\bcuando asks\b/gi, expected: "cuándo asks", note: "Use cuándo when naming the question word." },
  { pattern: /\bcomo asks\b/gi, expected: "cómo asks", note: "Use cómo when naming the question word." }
];

const issues = [];

for (const sourcePath of sourcePaths) {
  const source = fs.readFileSync(sourcePath, "utf8");
  let insideNormalizedStopwords = false;
  source.split(/\r?\n/).forEach((line, index) => {
    if (line.includes("const VOCABULARY_CONTEXT_STOPWORDS")) insideNormalizedStopwords = true;
    if (insideNormalizedStopwords) {
      if (line.includes("]);")) insideNormalizedStopwords = false;
      return;
    }
    if (ignoredLinePatterns.some((pattern) => pattern.test(line))) return;
    for (const check of checks) {
      check.pattern.lastIndex = 0;
      if (check.pattern.test(line)) {
        issues.push({
          sourcePath,
          line: index + 1,
          expected: check.expected,
          note: check.note,
          text: line.trim()
        });
      }
    }
  });
}

if (issues.length) {
  console.error(`Spanish audit found ${issues.length} possible canonical spelling issue(s):`);
  for (const issue of issues.slice(0, 80)) {
    console.error(`- ${issue.sourcePath}:${issue.line}: ${issue.note}`);
    console.error(`  ${issue.text}`);
  }
  if (issues.length > 80) {
    console.error(`...and ${issues.length - 80} more.`);
  }
  process.exit(1);
}

console.log("Spanish audit passed: no known unaccented canonical Spanish display text found.");
