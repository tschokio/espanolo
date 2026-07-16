const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const seedSource = fs.readFileSync(path.join(root, "prisma", "seed.js"), "utf8");
const soundFoundationSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a1-sound-foundation.js"), "utf8");
const a1CheckpointTransferSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a1-checkpoint-microtransfers.js"), "utf8");
const essentialPresentBridgeSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a1-essential-present-bridge.js"), "utf8");
const contractionsChoiceSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a1-contractions-choice.js"), "utf8");
const personalProfileSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a1-personal-profile.js"), "utf8");
const numbersInLifeSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a1-numbers-in-life.js"), "utf8");
const gettingAroundSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a1-getting-around.js"), "utf8");
const objectPronounSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-object-pronouns.js"), "utf8");
const pastEventsSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-past-events.js"), "utf8");
const describingComparingSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-describing-comparing.js"), "utf8");
const makingPlansSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-making-plans.js"), "utf8");
const formalAddressSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-formal-address.js"), "utf8");
const everydayProblemsSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-solving-everyday-problems.js"), "utf8");
const healthAppointmentsSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-health-appointments.js"), "utf8");
const phoneMessagesSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-phone-messages.js"), "utf8");
const indefiniteNegativeSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-indefinite-negative-words.js"), "utf8");
const adjectiveFoundationSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-adjective-foundation.js"), "utf8");
const quantityPossessiveSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-a2-quantity-possessives.js"), "utf8");
const opinionSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-opinions.js"), "utf8");
const storySeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-stories.js"), "utf8");
const futureSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-future-conditions.js"), "utf8");
const subjunctiveSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-subjunctive.js"), "utf8");
const perfectSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-perfect-tenses.js"), "utf8");
const conditionalSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-conditional.js"), "utf8");
const commandsSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-commands-pronouns.js"), "utf8");
const porParaSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-por-para.js"), "utf8");
const workplaceCollaborationSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-workplace-collaboration.js"), "utf8");
const everydayConversationSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-everyday-conversation.js"), "utf8");
const messagesEmailsSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b1-messages-emails.js"), "utf8");
const b2DiscourseSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b2-discourse.js"), "utf8");
const b2ReportedSpeechSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b2-reported-speech.js"), "utf8");
const b2RelativeClauseSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b2-relative-clauses.js"), "utf8");
const b2SeConstructionSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b2-se-constructions.js"), "utf8");
const b2PastSubjunctiveSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b2-past-subjunctive.js"), "utf8");
const b2VerbalPeriphrasesSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b2-verbal-periphrases.js"), "utf8");
const b2ReadingInferenceSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b2-reading-inference.js"), "utf8");
const b2ListeningComprehensionSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-b2-listening-comprehension.js"), "utf8");
const c1RegisterPrecisionSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c1-register-precision.js"), "utf8");
const c1NarrativeViewpointSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c1-narrative-viewpoint.js"), "utf8");
const c1ArgumentSynthesisSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c1-argument-synthesis.js"), "utf8");
const c1PragmaticInteractionSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c1-pragmatic-interaction.js"), "utf8");
const c1MoodMeaningSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c1-mood-meaning.js"), "utf8");
const c1DenseListeningSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c1-dense-listening.js"), "utf8");
const c2PrecisionMediationSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c2-precision-mediation.js"), "utf8");
const c2GenreRhetoricSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c2-genre-rhetoric.js"), "utf8");
const c2SociolinguisticVariationSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c2-sociolinguistic-variation.js"), "utf8");
const c2HighStakesNegotiationSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c2-high-stakes-negotiation.js"), "utf8");
const c2LiteraryCreativeControlSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c2-literary-creative-control.js"), "utf8");
const c2ExpertListeningSynthesisSeedSource = fs.readFileSync(path.join(root, "prisma", "seed-c2-expert-listening-synthesis.js"), "utf8");
const serverSource = fs.readFileSync(path.join(root, "server", "index.js"), "utf8");
const packageConfig = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

function extractArraySection(source, declarationName) {
  const marker = `const ${declarationName} = [`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${declarationName} array should exist`);
  let depth = 0;
  for (let index = start + marker.length - 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Could not parse ${declarationName}`);
}

function collectObjectBlocks(arraySection) {
  const blocks = [];
  let depth = 0;
  let start = -1;
  for (let index = 0; index < arraySection.length; index += 1) {
    const char = arraySection[index];
    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        blocks.push(arraySection.slice(start, index + 1));
        start = -1;
      }
    }
  }
  return blocks;
}

function fieldValue(block, fieldName) {
  return new RegExp(`${fieldName}:\\s*["']([^"']+)["']`).exec(block)?.[1] || "";
}

function numberField(block, fieldName) {
  const value = new RegExp(`${fieldName}:\\s*(\\d+(?:\\.\\d+)?)`).exec(block)?.[1];
  return value ? Number(value) : null;
}

function arrayValues(block, fieldName) {
  const match = new RegExp(`${fieldName}:\\s*\\[([^\\]]*)\\]`).exec(block);
  if (!match) return [];
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((item) => item[1]);
}

function arrayFieldSection(block, fieldName) {
  const match = new RegExp(`${fieldName}:\\s*\\[`).exec(block);
  if (!match) return "";

  const start = match.index + match[0].lastIndexOf("[");
  let depth = 0;
  let quote = "";
  for (let index = start; index < block.length; index += 1) {
    const char = block[index];
    if (quote) {
      if (char === "\\") {
        index += 1;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) return block.slice(start, index + 1);
    }
  }
  return "";
}

function sentenceSpanishValues(block) {
  const sentences = arrayFieldSection(block, "sentences");
  return [...sentences.matchAll(/\[\s*"((?:\\.|[^"\\])*)"\s*,/g)].map((match) => JSON.parse(`"${match[1]}"`));
}

function vocabularySpanishValues(block) {
  const words = arrayFieldSection(block, "words");
  return [...words.matchAll(/\[\s*"((?:\\.|[^"\\])*)"\s*,/g)].map((match) => JSON.parse(`"${match[1]}"`));
}

function normalizeSeedText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function exerciseAnswer(block) {
  const direct = fieldValue(block, "correct");
  return direct || arrayValues(block, "correctWords").join(" ");
}

function hasContextualPrompt(value) {
  return (String(value || "").match(/\p{L}+/gu) || []).length >= 2;
}

const lessonBlocks = [
  ...collectObjectBlocks(extractArraySection(seedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(soundFoundationSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(essentialPresentBridgeSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(contractionsChoiceSeedSource, "packages")),
  ...collectObjectBlocks(extractArraySection(personalProfileSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(numbersInLifeSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(gettingAroundSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(objectPronounSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(pastEventsSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(describingComparingSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(makingPlansSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(formalAddressSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(everydayProblemsSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(healthAppointmentsSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(phoneMessagesSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(indefiniteNegativeSeedSource, "packages")),
  ...collectObjectBlocks(extractArraySection(adjectiveFoundationSeedSource, "packages")),
  ...collectObjectBlocks(extractArraySection(quantityPossessiveSeedSource, "packages")),
  ...collectObjectBlocks(extractArraySection(opinionSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(storySeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(futureSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(subjunctiveSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(perfectSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(conditionalSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(commandsSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(porParaSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(workplaceCollaborationSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(everydayConversationSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(messagesEmailsSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(b2DiscourseSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(b2ReportedSpeechSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(b2RelativeClauseSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(b2SeConstructionSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(b2PastSubjunctiveSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(b2VerbalPeriphrasesSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(b2ReadingInferenceSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(b2ListeningComprehensionSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c1RegisterPrecisionSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c1NarrativeViewpointSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c1ArgumentSynthesisSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c1PragmaticInteractionSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c1MoodMeaningSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c1DenseListeningSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c2PrecisionMediationSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c2GenreRhetoricSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c2SociolinguisticVariationSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c2HighStakesNegotiationSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c2LiteraryCreativeControlSeedSource, "lessons")),
  ...collectObjectBlocks(extractArraySection(c2ExpertListeningSynthesisSeedSource, "lessons"))
];
const exerciseBlocks = collectObjectBlocks(extractArraySection(seedSource, "exercises"));

const topics = new Set(collectObjectBlocks(extractArraySection(seedSource, "topics")).map((block) => fieldValue(block, "slug")));
topics.add("sound-five-vowels");
topics.add("sound-consonant-map");
topics.add("sound-key-contrasts");
topics.add("sound-stress-accents");
topics.add("sound-rhythm-intonation");
topics.add("sound-foundation-checkpoint");
topics.add("essential-present-bridge");
topics.add("al-del-contractions");
topics.add("que-cual-selection");
topics.add("contractions-choice-checkpoint");
topics.add("personal-profile-basics");
topics.add("numbers-in-life");
topics.add("getting-around-services");
topics.add("object-pronouns-shopping");
topics.add("past-events-foundation");
topics.add("describing-comparing-progressive");
topics.add("making-plans-interaction");
topics.add("formal-address-service");
topics.add("solving-everyday-problems");
topics.add("health-appointments-instructions");
topics.add("phone-calls-messages");
topics.add("indefinite-people-things");
topics.add("positive-negative-agreement");
topics.add("indefinite-negative-checkpoint");
topics.add("adjective-agreement-position");
topics.add("common-adjective-short-forms");
topics.add("adjective-foundation-checkpoint");
topics.add("quantity-noun-adverb");
topics.add("independent-possessives");
topics.add("quantity-possessive-checkpoint");
topics.add("opinions-connected-production");
topics.add("stories-comprehension");
topics.add("future-real-conditions");
topics.add("present-subjunctive-meaning");
topics.add("perfect-past-connections");
topics.add("conditional-hypotheses");
topics.add("commands-combined-pronouns");
topics.add("por-para-relationships");
topics.add("workplace-collaboration-coordination");
topics.add("everyday-conversation-relationships");
topics.add("messages-emails-written-action");
topics.add("b2-discourse-connectors");
topics.add("b2-reported-speech");
topics.add("b2-relative-clauses");
topics.add("b2-se-constructions");
topics.add("b2-past-subjunctive");
topics.add("b2-verbal-periphrases");
topics.add("b2-reading-inference");
topics.add("b2-listening-comprehension");
topics.add("c1-register-precision");
topics.add("c1-narrative-viewpoint");
topics.add("c1-argument-synthesis");
topics.add("c1-pragmatic-interaction");
topics.add("c1-mood-meaning");
topics.add("c1-dense-listening");
topics.add("c2-precision-mediation");
topics.add("c2-genre-rhetoric");
topics.add("c2-sociolinguistic-variation");
topics.add("c2-high-stakes-negotiation");
topics.add("c2-literary-creative-control");
topics.add("c2-expert-listening-synthesis");
const vocabularyGroupBlocks = collectObjectBlocks(extractArraySection(seedSource, "vocabularyGroups"));
const vocabularyGroups = new Set(vocabularyGroupBlocks.map((block) => fieldValue(block, "slug")));
const lessons = lessonBlocks.map((block) => ({
  block,
  slug: fieldValue(block, "slug"),
  title: fieldValue(block, "title"),
  theme: fieldValue(block, "theme"),
  topicSlug: fieldValue(block, "topicSlug") || /topic:\s*{\s*slug:\s*["']([^"']+)["']/.exec(block)?.[1] || (numberField(block, "order") >= 498 && numberField(block, "order") <= 518
    ? "essential-present-bridge"
    : numberField(block, "order") >= 729.1 && numberField(block, "order") <= 729.6
      ? "formal-address-service"
    : numberField(block, "order") >= 831.1 && numberField(block, "order") <= 831.7
      ? "solving-everyday-problems"
    : numberField(block, "order") >= 831.71 && numberField(block, "order") <= 831.77
      ? "health-appointments-instructions"
    : numberField(block, "order") >= 831.78 && numberField(block, "order") <= 831.84
      ? "phone-calls-messages"
    : numberField(block, "order") >= 832 && numberField(block, "order") <= 838
      ? "describing-comparing-progressive"
    : numberField(block, "order") >= 1311.1 && numberField(block, "order") <= 1311.7
      ? "workplace-collaboration-coordination"
    : numberField(block, "order") >= 1312.1 && numberField(block, "order") <= 1312.7
      ? "everyday-conversation-relationships"
    : numberField(block, "order") >= 1313.1 && numberField(block, "order") <= 1313.7
      ? "messages-emails-written-action"
    : numberField(block, "order") >= 2460
    ? "c2-expert-listening-synthesis"
    : numberField(block, "order") >= 2400
    ? "c2-literary-creative-control"
    : numberField(block, "order") >= 2340
    ? "c2-high-stakes-negotiation"
    : numberField(block, "order") >= 2280
    ? "c2-sociolinguistic-variation"
    : numberField(block, "order") >= 2220
    ? "c2-genre-rhetoric"
    : numberField(block, "order") >= 2160
    ? "c2-precision-mediation"
    : numberField(block, "order") >= 2100
    ? "c1-dense-listening"
    : numberField(block, "order") >= 2040
    ? "c1-mood-meaning"
    : numberField(block, "order") >= 1980
    ? "c1-pragmatic-interaction"
    : numberField(block, "order") >= 1920
    ? "c1-argument-synthesis"
    : numberField(block, "order") >= 1860
    ? "c1-narrative-viewpoint"
    : numberField(block, "order") >= 1800
    ? "c1-register-precision"
    : numberField(block, "order") >= 1740
    ? "b2-listening-comprehension"
    : numberField(block, "order") >= 1680
      ? "b2-reading-inference"
    : numberField(block, "order") >= 1620
      ? "b2-verbal-periphrases"
    : numberField(block, "order") >= 1560
      ? "b2-past-subjunctive"
    : numberField(block, "order") >= 1500
      ? "b2-se-constructions"
    : numberField(block, "order") >= 1440
      ? "b2-relative-clauses"
    : numberField(block, "order") >= 1380
      ? "b2-reported-speech"
    : numberField(block, "order") >= 1320
      ? "b2-discourse-connectors"
    : numberField(block, "order") >= 1260
      ? "por-para-relationships"
    : numberField(block, "order") >= 1200
      ? "commands-combined-pronouns"
      : numberField(block, "order") >= 1140
        ? "conditional-hypotheses"
        : numberField(block, "order") >= 1080
          ? "perfect-past-connections"
          : numberField(block, "order") >= 1020
            ? "present-subjunctive-meaning"
            : numberField(block, "order") >= 960
              ? "future-real-conditions"
              : numberField(block, "order") >= 900
                ? "stories-comprehension"
                : numberField(block, "order") >= 840
                  ? "opinions-connected-production"
                  : numberField(block, "order") >= 780
                    ? "past-events-foundation"
                    : "object-pronouns-shopping"),
  vocabularySlugs: arrayValues(block, "vocabularySlugs"),
  order: numberField(block, "order"),
  isCheckpoint: /checkpoint/i.test(`${fieldValue(block, "theme")} ${fieldValue(block, "title")}`),
  sentenceCount: sentenceSpanishValues(block).length
}));
const exercises = exerciseBlocks.map((block) => ({
  block,
  slug: fieldValue(block, "slug"),
  lessonSlug: fieldValue(block, "lessonSlug"),
  topicSlug: fieldValue(block, "topicSlug"),
  type: /type:\s*ExerciseType\.([A-Z_]+)/.exec(block)?.[1] || "",
  hasCorrect: /correct:\s*["']/.test(block) || /correctWords:\s*\[/.test(block)
}));
for (const lesson of lessons.filter((item) => item.topicSlug.startsWith("sound-"))) {
  const types = lesson.isCheckpoint
    ? ["MULTIPLE_CHOICE", "LISTENING_DICTATION", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "ERROR_CORRECTION"]
    : ["MULTIPLE_CHOICE", "LISTENING_DICTATION", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER"];
  for (const [index, type] of types.entries()) {
    exercises.push({ slug: `${lesson.slug}-sound-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "essential-present-bridge")) {
  const types = lesson.isCheckpoint
    ? ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "TRANSFORMATION", "SHORT_ANSWER"]
    : ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "TRANSFORMATION"];
  for (const [index, type] of types.entries()) {
    exercises.push({ slug: `${lesson.slug}-bridge-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "personal-profile-basics")) {
  const types = lesson.isCheckpoint
    ? ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"]
    : ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-profile-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "numbers-in-life")) {
  const types = lesson.isCheckpoint
    ? ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"]
    : ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-number-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "getting-around-services")) {
  const types = lesson.isCheckpoint
    ? ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"]
    : ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-travel-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "describing-comparing-progressive")) {
  const types = lesson.isCheckpoint
    ? ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "TRANSFORMATION", "SHORT_ANSWER"]
    : ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "TRANSFORMATION"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-description-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "making-plans-interaction")) {
  const types = lesson.isCheckpoint
    ? ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "TRANSLATION", "SHORT_ANSWER", "WRITING_PROMPT"]
    : ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "TRANSLATION", "SHORT_ANSWER"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-planning-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "formal-address-service")) {
  const types = ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-formal-address-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "solving-everyday-problems")) {
  const types = ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-problem-solution-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "health-appointments-instructions")) {
  const types = ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-health-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "phone-calls-messages")) {
  const types = ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER", "DIALOGUE_REPLY", "WRITING_PROMPT"];
  for (const [index, type] of types.entries()) exercises.push({ slug: `${lesson.slug}-phone-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
}
for (const lesson of lessons.filter((item) => item.topicSlug === "object-pronouns-shopping")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "past-events-foundation")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSLATION", "SHORT_ANSWER"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "opinions-connected-production")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "stories-comprehension")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "SHORT_ANSWER", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "future-real-conditions")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "SHORT_ANSWER", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "present-subjunctive-meaning")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "perfect-past-connections")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "SHORT_ANSWER", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "conditional-hypotheses")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "commands-combined-pronouns")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "por-para-relationships")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "SHORT_ANSWER", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "b2-discourse-connectors")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "b2-reported-speech")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "b2-relative-clauses")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "b2-se-constructions")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "b2-past-subjunctive")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "b2-verbal-periphrases")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "b2-reading-inference")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "SHORT_ANSWER", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "b2-listening-comprehension")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "LISTENING_DICTATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c1-register-precision")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c1-narrative-viewpoint")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c1-argument-synthesis")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c1-pragmatic-interaction")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "DIALOGUE_REPLY"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c1-mood-meaning")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c1-dense-listening")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "LISTENING_DICTATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c2-precision-mediation")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c2-genre-rhetoric")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c2-sociolinguistic-variation")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c2-high-stakes-negotiation")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "DIALOGUE_REPLY", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c2-literary-creative-control")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "TRANSFORMATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
for (const lesson of lessons.filter((item) => item.topicSlug === "c2-expert-listening-synthesis")) {
  for (const [index, type] of ["MULTIPLE_CHOICE", "SENTENCE_BUILDER", "LISTENING_DICTATION", "TRANSFORMATION", "WRITING_PROMPT"].entries()) {
    exercises.push({ slug: `${lesson.slug}-modular-${index}`, lessonSlug: lesson.slug, topicSlug: lesson.topicSlug, type, hasCorrect: true });
  }
}
const activeUnits = collectObjectBlocks(extractArraySection(serverSource, "curriculumUnits"))
  .filter((block) => !/planned:\s*true/.test(block))
  .map((block) => ({
    slug: fieldValue(block, "slug"),
    label: fieldValue(block, "label"),
    startOrder: numberField(block, "startOrder"),
    endOrder: numberField(block, "endOrder")
  }));

test("seed lesson order and references are valid", () => {
  const orderCounts = new Map();
  for (const lesson of lessons) {
    orderCounts.set(lesson.order, (orderCounts.get(lesson.order) || 0) + 1);
    assert.ok(topics.has(lesson.topicSlug), `${lesson.slug} references missing topic ${lesson.topicSlug}`);
    for (const groupSlug of lesson.vocabularySlugs) {
      assert.ok(vocabularyGroups.has(groupSlug), `${lesson.slug} references missing vocabulary group ${groupSlug}`);
    }
  }
  const duplicates = [...orderCounts.entries()].filter(([, count]) => count > 1);
  assert.deepEqual(duplicates, []);
});

test("every lesson ships as a teachable package with examples and a topic guide", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "App.jsx"), "utf8");
  const advancedGermanConceptSource = fs.readFileSync(path.join(__dirname, "..", "src", "advanced-german-concept-titles.mjs"), "utf8");
  const foundationCardSource = fs.readFileSync(path.join(__dirname, "..", "src", "foundation-card-localization.mjs"), "utf8");
  const authoredGuideSource = `${appSource}\n${foundationCardSource}`;
  const conceptStart = appSource.indexOf("const germanConceptTitles =");
  const conceptEnd = appSource.indexOf("function germanConceptTitle", conceptStart);
  const germanConceptSource = `${appSource.slice(conceptStart, conceptEnd)}\n${advancedGermanConceptSource}`;
  for (const lesson of lessons) {
    assert.ok(lesson.sentenceCount >= 3, `${lesson.slug} needs at least three contextual model sentences`);
    assert.match(authoredGuideSource, new RegExp(`^[ \\t]*["']${lesson.topicSlug}["']\\s*:`, "m"), `${lesson.slug} topic ${lesson.topicSlug} needs authored teaching cards`);
    assert.match(germanConceptSource, new RegExp(`^[ \\t]*["']${lesson.topicSlug}["']\\s*:`, "m"), `${lesson.slug} topic ${lesson.topicSlug} needs concrete German learning goals`);
  }
});

test("lesson guide examples always use Spanish target text", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "App.jsx"), "utf8");
  assert.doesNotMatch(appSource, /example:\s*sentence\.english/, "English meanings must never become spoken lesson examples");
  assert.match(appSource, /example:\s*sentence\.spanish/, "sentence-derived guide examples should use Spanish");
});

test("words mode includes expanded numbers, colors, and essential words", () => {
  const wordsFor = (slug) => {
    const group = vocabularyGroupBlocks.find((block) => fieldValue(block, "slug") === slug);
    assert.ok(group, `${slug} vocabulary group should exist`);
    return new Set(vocabularySpanishValues(group));
  };
  const numbersAndColors = wordsFor("numbers-and-colors");
  const essentials = wordsFor("essential-words");
  const weatherAndTime = wordsFor("weather-and-time");

  for (const word of ["cero", "diez", "once", "quince", "veinte", "veintidós", "veinticuatro", "treinta", "cuarenta", "cincuenta", "noventa", "cien", "rojo", "azul", "naranja", "morado", "gris"]) {
    assert.ok(numbersAndColors.has(word), `numbers-and-colors should include ${word}`);
  }
  for (const word of ["sí", "no", "hoy", "mañana", "bien", "pero", "con", "qué", "dónde", "por qué"]) {
    assert.ok(essentials.has(word), `essential-words should include ${word}`);
  }
  for (const word of ["lunes", "miércoles", "domingo", "enero", "mayo", "septiembre", "diciembre", "¿Qué hora es?", "y cuarto", "y media", "menos cuarto", "mediodía", "medianoche"]) {
    assert.ok(weatherAndTime.has(word), `weather-and-time should include ${word}`);
  }
});

test("active curriculum units have lessons and checkpoints", () => {
  for (const unit of activeUnits) {
    const unitLessons = lessons.filter((lesson) => lesson.order >= unit.startOrder && lesson.order <= unit.endOrder);
    assert.ok(unitLessons.length > 0, `${unit.label} has no lessons`);
    assert.ok(unitLessons.some((lesson) => lesson.isCheckpoint), `${unit.label} has no checkpoint lesson`);
  }
});

test("seed exercises reference existing lessons, topics, and answer specs", () => {
  const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
  for (const exercise of exercises) {
    assert.ok(lessonSlugs.has(exercise.lessonSlug), `${exercise.slug} references missing lesson ${exercise.lessonSlug}`);
    assert.ok(topics.has(exercise.topicSlug), `${exercise.slug} references missing topic ${exercise.topicSlug}`);
    assert.ok(exercise.hasCorrect, `${exercise.slug} is missing a correct answer spec`);
  }
});

test("the standard seed command reconciles supplemental lesson practice", () => {
  const command = packageConfig.scripts?.["db:seed"] || "";

  assert.match(command, /prisma\/seed\.js/, "db:seed should update the authored lesson content");
  assert.match(command, /prisma\/seed-a1-sound-foundation\.js/, "db:seed should include the early sound foundation");
  assert.match(command, /prisma\/seed-a1-checkpoint-microtransfers\.js/, "db:seed should include controlled A1 checkpoint transfer input");
  assert.match(command, /prisma\/seed-a1-dialogue-functional-checks\.js/, "db:seed should preserve natural learner-owned answers in A1 checkpoint dialogues");
  assert.match(command, /prisma\/seed-a2-b1-natural-transfer\.js/, "db:seed should preserve natural A2/B1 checkpoint transfer grading");
  assert.match(command, /prisma\/seed-b2-c2-natural-transfer\.js/, "db:seed should preserve natural B2–C2 meaning and register transfer grading");
  assert.match(command, /prisma\/seed-a1-essential-present-bridge\.js/, "db:seed should include the A1-to-A2 essential present bridge");
  assert.match(command, /prisma\/seed-a1-personal-profile\.js/, "db:seed should include the German-first A1 personal-profile unit");
  assert.match(command, /prisma\/seed-a1-numbers-in-life\.js/, "db:seed should include the prerequisite A1 everyday-number unit");
  assert.match(command, /prisma\/seed-a1-getting-around\.js/, "db:seed should include the A1 getting-around transfer unit");
  assert.match(command, /prisma\/seed-lesson-practice\.js/, "db:seed should remove stale generated questions and add scoped practice");
  assert.match(command, /prisma\/seed-a2-object-pronouns\.js/, "db:seed should include the active A2.5 curriculum unit");
  assert.match(command, /prisma\/seed-a2-past-events\.js/, "db:seed should include the active A2.6 curriculum unit");
  assert.match(command, /prisma\/seed-a2-connected-scenarios\.js/, "db:seed should include connected A2 dialogue, scenario, reading, and listening input");
  assert.match(command, /prisma\/seed-a2-connected-routines-verbs\.js/, "db:seed should include connected A2 routine and verb-frame input");
  assert.match(command, /prisma\/seed-a2-connected-preferences\.js/, "db:seed should include connected A2 preference input");
  assert.match(command, /prisma\/seed-a2-connected-object-pronouns\.js/, "db:seed should include connected A2 object-pronoun input");
  assert.match(command, /prisma\/seed-a2-connected-past-events\.js/, "db:seed should include connected A2 past-event input");
  assert.match(command, /prisma\/seed-a2-describing-comparing\.js/, "db:seed should include the A2.8 description and comparison bridge");
  assert.match(command, /prisma\/seed-a2-making-plans\.js/, "db:seed should include the A2 everyday-coordination bridge");
  assert.match(command, /prisma\/seed-a2-formal-address\.js/, "db:seed should include the A2 formal-address bridge");
  assert.match(command, /prisma\/seed-a2-solving-everyday-problems\.js/, "db:seed should include the A2 everyday problem-solving transfer unit");
  assert.match(command, /prisma\/seed-a2-health-appointments\.js/, "db:seed should include the A2 health appointment and instruction unit");
  assert.match(command, /prisma\/seed-a2-phone-messages\.js/, "db:seed should include the A2 phone and message transfer unit");
  assert.match(command, /prisma\/seed-b1-opinions\.js/, "db:seed should include the active B1.1 curriculum unit");
  assert.match(command, /prisma\/seed-b1-stories\.js/, "db:seed should include the active B1.2 curriculum unit");
  assert.match(command, /prisma\/seed-b1-connected-input\.js/, "db:seed should include connected B1 reading and listening input");
  assert.match(command, /prisma\/seed-b1-connected-input-grammar\.js/, "db:seed should include connected B1 future and subjunctive input");
  assert.match(command, /prisma\/seed-b1-connected-input-perfect-conditional\.js/, "db:seed should include connected B1 perfect and conditional input");
  assert.match(command, /prisma\/seed-b1-connected-input-commands-por-para\.js/, "db:seed should include connected B1 commands and por/para input");
  assert.match(command, /prisma\/seed-b1-context-vocabulary\.js/, "db:seed should attach contextual B1 vocabulary after the curriculum units exist");
  assert.match(command, /prisma\/seed-b2-context-vocabulary\.js/, "db:seed should attach contextual B2 vocabulary after the curriculum units exist");
  assert.match(command, /prisma\/seed-c1-c2-context-vocabulary\.js/, "db:seed should attach contextual C1/C2 vocabulary after the curriculum units exist");
  assert.match(command, /prisma\/seed-b1-future-conditions\.js/, "db:seed should include the active B1.3 curriculum unit");
  assert.match(command, /prisma\/seed-b1-subjunctive\.js/, "db:seed should include the active B1.4 curriculum unit");
  assert.match(command, /prisma\/seed-b1-perfect-tenses\.js/, "db:seed should include the active B1.5 curriculum unit");
  assert.match(command, /prisma\/seed-b1-conditional\.js/, "db:seed should include the active B1.6 curriculum unit");
  assert.match(command, /prisma\/seed-b1-commands-pronouns\.js/, "db:seed should include the active B1.7 curriculum unit");
  assert.match(command, /prisma\/seed-b1-por-para\.js/, "db:seed should include the active B1.8 curriculum unit");
  assert.match(command, /prisma\/seed-b1-workplace-collaboration\.js/, "db:seed should include the practical B1.9 workplace collaboration unit");
  assert.match(command, /prisma\/seed-b1-everyday-conversation\.js/, "db:seed should include the practical B1.10 everyday conversation unit");
  assert.match(command, /prisma\/seed-b1-messages-emails\.js/, "db:seed should include the practical B1.11 messages and emails unit");
  assert.match(command, /prisma\/seed-b2-discourse\.js/, "db:seed should include the active B2.1 curriculum unit");
  assert.match(command, /prisma\/seed-b2-reported-speech\.js/, "db:seed should include the active B2.2 curriculum unit");
  assert.match(command, /prisma\/seed-b2-connected-input-discourse-reported\.js/, "db:seed should include connected B2 discourse and reported-speech input");
  assert.match(command, /prisma\/seed-b2-connected-input-relatives-se\.js/, "db:seed should include connected B2 relative-clause and se input");
  assert.match(command, /prisma\/seed-b2-connected-input-past-periphrases\.js/, "db:seed should include connected B2 past-subjunctive and periphrasis input");
  assert.match(command, /prisma\/seed-b2-relative-clauses\.js/, "db:seed should include the active B2.3 curriculum unit");
  assert.match(command, /prisma\/seed-b2-se-constructions\.js/, "db:seed should include the active B2.4 curriculum unit");
  assert.match(command, /prisma\/seed-b2-past-subjunctive\.js/, "db:seed should include the active B2.5 curriculum unit");
  assert.match(command, /prisma\/seed-b2-verbal-periphrases\.js/, "db:seed should include the active B2.6 curriculum unit");
  assert.match(command, /prisma\/seed-b2-reading-inference\.js/, "db:seed should include the active B2.7 curriculum unit");
  assert.match(command, /prisma\/seed-b2-listening-comprehension\.js/, "db:seed should include the active B2.8 curriculum unit");
  assert.match(command, /prisma\/seed-c1-register-precision\.js/, "db:seed should include the active C1.1 curriculum unit");
  assert.match(command, /prisma\/seed-c1-connected-input-register-precision\.js/, "db:seed should include connected C1 register-and-precision input");
  assert.match(command, /prisma\/seed-c1-narrative-viewpoint\.js/, "db:seed should include the active C1.2 curriculum unit");
  assert.match(command, /prisma\/seed-c1-argument-synthesis\.js/, "db:seed should include the active C1.3 curriculum unit");
  assert.match(command, /prisma\/seed-c1-pragmatic-interaction\.js/, "db:seed should include the active C1.4 curriculum unit");
  assert.match(command, /prisma\/seed-c1-mood-meaning\.js/, "db:seed should include the active C1.5 curriculum unit");
  assert.match(command, /prisma\/seed-c1-german-comprehension\.js/, "db:seed should localize C1 connected comprehension into German and optional English");
  assert.match(command, /prisma\/seed-c1-dense-listening\.js/, "db:seed should include the active C1.6 curriculum unit");
  assert.match(command, /prisma\/seed-c2-precision-mediation\.js/, "db:seed should include the active C2.1 curriculum unit");
  assert.match(command, /prisma\/seed-c2-genre-rhetoric\.js/, "db:seed should include the active C2.2 curriculum unit");
  assert.match(command, /prisma\/seed-c2-sociolinguistic-variation\.js/, "db:seed should include the active C2.3 curriculum unit");
  assert.match(command, /prisma\/seed-c2-high-stakes-negotiation\.js/, "db:seed should include the active C2.4 curriculum unit");
  assert.match(command, /prisma\/seed-c2-literary-creative-control\.js/, "db:seed should include the active C2.5 curriculum unit");
  assert.match(command, /prisma\/seed-c2-expert-listening-synthesis\.js/, "db:seed should include the active C2.6 curriculum unit");
  assert.match(command, /prisma\/seed-c2-german-listening\.js/, "db:seed should localize C2 comprehension and add connected listening");
  assert.match(packageConfig.prisma?.seed || "", /db:seed/, "Prisma should use the standard reconciled seed command");
});

test("checkpoint lessons have enough mixed checks", () => {
  const countByLesson = new Map();
  for (const exercise of exercises) {
    countByLesson.set(exercise.lessonSlug, (countByLesson.get(exercise.lessonSlug) || 0) + 1);
  }
  assert.match(workplaceCollaborationSeedSource, /function checksFor[\s\S]*recognize-[\s\S]*build-[\s\S]*translate-[\s\S]*short-answer[\s\S]*dialogue-reply[\s\S]*write/);
  countByLesson.set("checkpoint-b1-workplace-collaboration", 10);
  assert.match(everydayConversationSeedSource, /function checksFor[\s\S]*recognize-[\s\S]*build-[\s\S]*translate-[\s\S]*short-answer[\s\S]*dialogue-reply[\s\S]*write/);
  countByLesson.set("checkpoint-b1-everyday-conversation", 10);
  assert.match(messagesEmailsSeedSource, /function checksFor[\s\S]*recognize-[\s\S]*build-[\s\S]*translate-[\s\S]*short-answer[\s\S]*dialogue-reply[\s\S]*write/);
  countByLesson.set("checkpoint-b1-messages-emails", 10);
  assert.match(indefiniteNegativeSeedSource, /function checks\(input\)[\s\S]*MULTIPLE_CHOICE[\s\S]*SENTENCE_BUILDER[\s\S]*TRANSLATION[\s\S]*LISTENING_DICTATION[\s\S]*SHORT_ANSWER[\s\S]*DIALOGUE_REPLY/);
  countByLesson.set("checkpoint-a2-indefinite-negative-words", 8);
  assert.match(adjectiveFoundationSeedSource, /function checks\(input\)[\s\S]*MULTIPLE_CHOICE[\s\S]*SENTENCE_BUILDER[\s\S]*TRANSLATION[\s\S]*LISTENING_DICTATION[\s\S]*SHORT_ANSWER[\s\S]*DIALOGUE_REPLY/);
  countByLesson.set("checkpoint-a2-adjective-foundation", 8);
  assert.match(quantityPossessiveSeedSource, /function checks\(input\)[\s\S]*MULTIPLE_CHOICE[\s\S]*SENTENCE_BUILDER[\s\S]*TRANSLATION[\s\S]*LISTENING_DICTATION[\s\S]*SHORT_ANSWER[\s\S]*DIALOGUE_REPLY/);
  countByLesson.set("checkpoint-a2-quantity-possessives", 8);
  assert.match(contractionsChoiceSeedSource, /function checks\(input\)[\s\S]*MULTIPLE_CHOICE[\s\S]*SENTENCE_BUILDER[\s\S]*TRANSLATION[\s\S]*LISTENING_DICTATION[\s\S]*SHORT_ANSWER[\s\S]*DIALOGUE_REPLY/);
  countByLesson.set("checkpoint-a1-contractions-choice", 8);
  const underbuilt = lessons
    .filter((lesson) => lesson.isCheckpoint)
    .filter((lesson) => (countByLesson.get(lesson.slug) || 0) < 4)
    .map((lesson) => lesson.slug);
  assert.deepEqual(underbuilt, []);
});

test("daily planning exposes content-based lesson and compact review estimates", () => {
  assert.match(serverSource, /estimatedMinutes: estimateLessonMinutes\(lesson\)/);
  assert.match(serverSource, /reviewEstimatedMinutes: estimateLessonReviewMinutes\(lesson\)/);
  assert.match(serverSource, /estimatedMinutes: due \? currentLesson\.reviewEstimatedMinutes : currentLesson\.estimatedMinutes/);
});

test("daily planning uses recurrence and overdue age instead of review count alone", () => {
  assert.match(serverSource, /buildReviewUrgencyDiagnostics\(\{[\s\S]*?dueDates:[\s\S]*?weakSpots:[\s\S]*?reviewTotal:/);
  assert.match(serverSource, /const recurringMistakeCount = Number\(review\.diagnostics\?\.recurringMistakeCount/);
  assert.match(serverSource, /const oldestOverdueDays = Number\(review\.diagnostics\?\.oldestOverdueDays/);
  assert.match(serverSource, /diagnosis[\s\S]*?reasonCode[\s\S]*?lessonProgress/);
});

test("concept repair adds only familiar contrasts without inflating due review debt", () => {
  assert.match(serverSource, /const conceptWeaknesses = buildConceptWeaknesses\(uniqueWeakSpots\)/);
  assert.match(serverSource, /attempts: \{ some: \{ userId, isCorrect: true \} \}/);
  assert.match(serverSource, /attempts: \{[\s\S]*?where: \{ userId, isCorrect: true \}[\s\S]*?take: 1/);
  assert.match(serverSource, /selectConceptContrastCandidates\(\{[\s\S]*?excludedExerciseIds:[\s\S]*?limit: 2/);
  assert.match(serverSource, /if \(items\.length >= limit\) break;[\s\S]*?items\.push\(contrast\)/);
  assert.match(serverSource, /counts: \{[\s\S]*?total: distinctDueCount[\s\S]*?sessionCounts/);
  assert.match(serverSource, /weakConcept: topWeakConcept \?/);
});

test("pronunciation availability is cached, tri-state, and used to prioritize playback", () => {
  assert.match(serverSource, /const pronunciationAvailabilityCache = new Map\(\)/);
  assert.match(serverSource, /async function probePronunciationSource[\s\S]*?receivedResponse \? "unavailable" : "unknown"/);
  assert.match(serverSource, /async function resolvePronunciationWithAvailability[\s\S]*?summarizePronunciationProviders\(sources\)/);
  assert.match(serverSource, /uncertain \? 5 \* 60 \* 1000 : PRONUNCIATION_AVAILABILITY_TTL_MS/);
  assert.match(serverSource, /shouldVerify[\s\S]*?resolvePronunciationWithAvailability\(req\.query\.text\)/);
  assert.match(serverSource, /const priority = \{ playable: 0, unknown: 1, unavailable: 2 \}/);
});

test("exercise telemetry preserves correction attempts separately from independent recall", () => {
  assert.match(serverSource, /const correctionAttempt = Boolean\(req\.body\.correctionAttempt\)/);
  assert.match(serverSource, /const usedSupport = Boolean\(req\.body\.usedSupport\) \|\| correctionAttempt/);
  assert.match(serverSource, /retrieval: \{[\s\S]*?usedSupport,[\s\S]*?correctionAttempt,/);
  assert.match(serverSource, /inputMethod: req\.body\.inputMethod === "speech" \? "speech" : "keyboard"/);
  assert.match(serverSource, /activityMode,/);
  assert.match(serverSource, /"\/api\/practice-signals"/);
  assert.match(serverSource, /speaking: new Set\(\["pronunciation", "authored-conversation"\]\)/);
  assert.match(serverSource, /conversation: new Set\(\["authored-conversation"\]\)/);
  assert.match(serverSource, /allowedSignalModes\[skill\]\?\.has\(mode\)/);
});

test("dashboard skill balancing stays inside familiar material and respects quiet mode", () => {
  assert.match(serverSource, /selectFamiliarPracticeTargetForSkill\([\s\S]*?familiarTargets,[\s\S]*?skillProfile\.nextFocus/);
  assert.match(serverSource, /const skillBalanceKey = pendingDeferredPractice\?\.channel \|\| skillProfile\.nextFocus/);
  assert.match(serverSource, /quietDeferred: user\.learningMode === "quiet" && \["listening", "speaking"\]\.includes\(skillBalanceKey\)/);
  assert.match(serverSource, /skillBalance/);
});

test("every non-pronunciation A1 checkpoint includes a taught dialogue transfer", async () => {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const checkpoints = await prisma.lesson.findMany({
      where: {
        cefrLevel: "A1",
        isPublished: true,
        slug: { contains: "checkpoint", not: "checkpoint-a1-sound-foundation" }
      },
      select: {
        slug: true,
        exercises: { where: { type: "DIALOGUE_REPLY" }, select: { questionText: true, answerJson: true } }
      }
    });
    assert.equal(checkpoints.length, 13, "expected all thirteen meaning-focused A1 checkpoints");
    for (const checkpoint of checkpoints) {
      assert.ok(checkpoint.exercises.length >= 1, `${checkpoint.slug} needs a conversational response`);
      for (const exercise of checkpoint.exercises) {
        assert.match(exercise.questionText, /[¿?]/, `${checkpoint.slug} dialogue should contain a real question`);
        assert.ok(exercise.answerJson?.correct, `${checkpoint.slug} dialogue needs a model response`);
        assert.ok(exercise.answerJson?.accepted?.length >= 2, `${checkpoint.slug} dialogue needs forgiving accepted forms`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
  assert.match(a1CheckpointTransferSeedSource, /goal: "dialogue_reply"/);
  assert.match(a1CheckpointTransferSeedSource, /supportDe:/);
});

test("every published lesson ends in varied active production rather than recognition alone", async () => {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  const productiveTypes = new Set([
    "CLOZE",
    "TRANSLATION",
    "SENTENCE_BUILDER",
    "ERROR_CORRECTION",
    "CONJUGATION",
    "SHORT_ANSWER",
    "TRANSFORMATION",
    "DIALOGUE_REPLY",
    "LISTENING_DICTATION",
    "WRITING_PROMPT"
  ]);
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      select: { slug: true, sentences: { select: { id: true } }, exercises: { select: { type: true } } }
    });
    assert.ok(lessons.length >= 258, "expected the complete published curriculum through C2.6");
    for (const lesson of lessons) {
      const types = new Set(lesson.exercises.map((exercise) => exercise.type));
      const productiveCount = lesson.exercises.filter((exercise) => productiveTypes.has(exercise.type)).length;
      assert.ok(lesson.sentences.length >= 3, `${lesson.slug} needs enough contextual model sentences`);
      assert.ok(types.size >= 3, `${lesson.slug} needs at least three retrieval formats`);
      assert.ok(productiveCount >= 2, `${lesson.slug} needs at least two productive retrieval checks`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("every published connected-input package is complete for German-first comprehension", async () => {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      select: { slug: true, cefrLevel: true, readingJson: true }
    });
    const connected = lessons.filter((lesson) => Array.isArray(lesson.readingJson?.paragraphs) && lesson.readingJson.paragraphs.length > 0);
    const listeningLevels = new Set();
    let questionCount = 0;

    assert.ok(connected.length >= 190, "expected connected reading or listening throughout the published curriculum");
    for (const lesson of connected) {
      const content = lesson.readingJson;
      const questions = Array.isArray(content.questions) ? content.questions : [];
      assert.ok(content.orientationDe, `${lesson.slug} needs a concrete German orientation`);
      assert.ok(content.recallPromptDe, `${lesson.slug} needs a German active-recall prompt`);
      assert.ok(content.modelSummary, `${lesson.slug} needs a Spanish summary model`);
      assert.ok(questions.length >= 2, `${lesson.slug} needs at least two comprehension checks`);
      for (const [index, question] of questions.entries()) {
        assert.ok(question.questionDe, `${lesson.slug} question ${index + 1} needs German wording`);
        assert.ok(Array.isArray(question.optionsDe) && question.optionsDe.length >= 2, `${lesson.slug} question ${index + 1} needs German choices`);
        assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < question.optionsDe.length, `${lesson.slug} question ${index + 1} needs a valid answer`);
        assert.ok(question.explanationDe, `${lesson.slug} question ${index + 1} needs German feedback`);
      }
      questionCount += questions.length;
      if (content.inputMode === "listening") listeningLevels.add(lesson.cefrLevel);
    }

    assert.ok(questionCount >= 390, "expected substantial connected-input comprehension practice");
    for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      assert.ok(listeningLevels.has(level), `${level} needs connected listening, not only reading or dictation`);
    }
  } finally {
    await prisma.$disconnect();
  }
});

test("C1.2 packages teach narrative choices through connected input before production", () => {
  const c1NarrativeLessons = lessons.filter((lesson) => lesson.topicSlug === "c1-narrative-viewpoint");
  assert.equal(c1NarrativeLessons.length, 6);
  for (const lesson of c1NarrativeLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish passage`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs comprehension checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish recall model`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused model sentences`);
  }
  assert.match(c1NarrativeViewpointSeedSource, /inputMode: "reading"/);
  assert.match(c1NarrativeViewpointSeedSource, /optionsDe: \[answer, distractorOne, distractorTwo\]/);
  assert.match(c1NarrativeViewpointSeedSource, /recallPromptDe: "Fasse Ereignisfolge, Perspektive und entscheidende Veränderung/);
});

test("C1.3 packages build evidence-based argument through connected input and synthesis", () => {
  const argumentLessons = lessons.filter((lesson) => lesson.topicSlug === "c1-argument-synthesis");
  assert.equal(argumentLessons.length, 6);
  for (const lesson of argumentLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish argument`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs evidence comprehension checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish synthesis model`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused model sentences`);
  }
  assert.match(c1ArgumentSynthesisSeedSource, /orientationDe: "Bestimme zuerst These, Belege und Schluss/);
  assert.match(c1ArgumentSynthesisSeedSource, /optionsDe: \[answer, distractorOne, distractorTwo\]/);
  assert.match(c1ArgumentSynthesisSeedSource, /recallPromptDe: "Fasse These, wichtigsten Beleg und begrenzte Schlussfolgerung/);
  assert.match(c1ArgumentSynthesisSeedSource, /ExerciseType\.WRITING_PROMPT/);
});

test("C1.4 packages teach pragmatic interpretation before spoken interaction", () => {
  const pragmaticLessons = lessons.filter((lesson) => lesson.topicSlug === "c1-pragmatic-interaction");
  assert.equal(pragmaticLessons.length, 6);
  for (const lesson of pragmaticLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish interaction`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs intention comprehension checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish pragmatic summary`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused interaction models`);
  }
  assert.match(c1PragmaticInteractionSeedSource, /orientationDe: "Lies zuerst die Situation und den Dialog/);
  assert.match(c1PragmaticInteractionSeedSource, /optionsDe: \[answer, distractorOne, distractorTwo\]/);
  assert.match(c1PragmaticInteractionSeedSource, /recallPromptDe: "Erkläre die Absicht oder das Missverständnis/);
  assert.match(c1PragmaticInteractionSeedSource, /ExerciseType\.DIALOGUE_REPLY/);
});

test("C1.5 packages teach mood as a meaning contrast rather than a trigger list", () => {
  const moodLessons = lessons.filter((lesson) => lesson.topicSlug === "c1-mood-meaning");
  assert.equal(moodLessons.length, 6);
  for (const lesson of moodLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish context`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs meaning-based comprehension checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish contrast summary`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused mood models`);
  }
  assert.match(c1MoodMeaningSeedSource, /orientationDe: "Bestimme vor der Formwahl/);
  assert.match(c1MoodMeaningSeedSource, /optionsDe: \[answer, distractorOne, distractorTwo\]/);
  assert.match(c1MoodMeaningSeedSource, /recallPromptDe: "Erkläre den entscheidenden Bedeutungsunterschied/);
  assert.match(c1MoodMeaningSeedSource, /ExerciseType\.WRITING_PROMPT/);
});

test("C1.6 packages teach dense listening through structure and focused replay", () => {
  const listeningLessons = lessons.filter((lesson) => lesson.topicSlug === "c1-dense-listening");
  assert.equal(listeningLessons.length, 6);
  for (const lesson of listeningLessons) {
    assert.match(lesson.block, /transcript:\s*\[/, `${lesson.slug} needs connected Spanish audio content`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs listening comprehension checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish relay model`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused spoken models`);
  }
  assert.match(c1DenseListeningSeedSource, /inputMode: "listening"/);
  assert.match(c1DenseListeningSeedSource, /orientationDe: "Höre einmal vollständig auf Aufbau und Endaussage/);
  assert.match(c1DenseListeningSeedSource, /recallPromptDe: "Gib Endaussage, entscheidende Einschränkung/);
  assert.match(c1DenseListeningSeedSource, /ExerciseType\.LISTENING_DICTATION/);
});

test("C2.1 packages teach precise reformulation and mediation through connected input", () => {
  const precisionLessons = lessons.filter((lesson) => lesson.topicSlug === "c2-precision-mediation");
  assert.equal(precisionLessons.length, 6);
  for (const lesson of precisionLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish source text`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs meaning-preservation checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish mediation model`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused reformulation models`);
  }
  assert.match(c2PrecisionMediationSeedSource, /orientationDe: "Trenne zuerst Kernaussage, Reichweite, Quelle/);
  assert.match(c2PrecisionMediationSeedSource, /optionsDe: \[answerDe, distractorOneDe, distractorTwoDe\]/);
  assert.match(c2PrecisionMediationSeedSource, /recallPromptDe: "Formuliere die Kernaussage für einen neuen Leser auf Spanisch/);
  assert.match(c2PrecisionMediationSeedSource, /ExerciseType\.WRITING_PROMPT/);
});

test("C2.2 packages teach lexical, genre, and rhetorical control through connected input", () => {
  const rhetoricLessons = lessons.filter((lesson) => lesson.topicSlug === "c2-genre-rhetoric");
  assert.equal(rhetoricLessons.length, 6);
  for (const lesson of rhetoricLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish source text`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs form-and-function checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish rhetorical summary`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused expression models`);
  }
  assert.match(c2GenreRhetoricSeedSource, /orientationDe: "Bestimme zuerst Aussage, Textsorte, Adressat/);
  assert.match(c2GenreRhetoricSeedSource, /optionsDe: \[answer, distractorOne, distractorTwo\]/);
  assert.match(c2GenreRhetoricSeedSource, /recallPromptDe: "Fasse die Kernaussage auf Spanisch zusammen/);
  assert.match(c2GenreRhetoricSeedSource, /ExerciseType\.WRITING_PROMPT/);
});

test("C2.3 packages teach panhispanic variation and socially appropriate accommodation", () => {
  const variationLessons = lessons.filter((lesson) => lesson.topicSlug === "c2-sociolinguistic-variation");
  assert.equal(variationLessons.length, 6);
  for (const lesson of variationLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish interaction`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs sociolinguistic interpretation checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish accommodation model`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused sociolinguistic models`);
  }
  assert.match(c2SociolinguisticVariationSeedSource, /orientationDe: "Beobachte zuerst Region, Beziehung, Rollen/);
  assert.match(c2SociolinguisticVariationSeedSource, /optionsDe: \[answer, distractorOne, distractorTwo\]/);
  assert.match(c2SociolinguisticVariationSeedSource, /recallPromptDe: "Erkläre die regionale oder soziale Bedeutung auf Spanisch/);
  assert.match(c2SociolinguisticVariationSeedSource, /ExerciseType\.DIALOGUE_REPLY/);
});

test("C2.4 packages teach accountable high-stakes negotiation through German-first connected input", () => {
  const negotiationLessons = lessons.filter((lesson) => lesson.topicSlug === "c2-high-stakes-negotiation");
  assert.equal(negotiationLessons.length, 6);
  for (const lesson of negotiationLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish negotiation`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs German and English comprehension bridges`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish synthesis model`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused negotiation models`);
  }
  assert.match(c2HighStakesNegotiationSeedSource, /inputMode: input\.inputMode/);
  assert.match(c2HighStakesNegotiationSeedSource, /orientationDe: "Bestimme zuerst Positionen, zugrunde liegende Interessen/);
  assert.match(c2HighStakesNegotiationSeedSource, /recallPromptDe: "Fasse die Verhandlungslage auf Spanisch zusammen/);
  assert.match(c2HighStakesNegotiationSeedSource, /ExerciseType\.TRANSFORMATION/);
  assert.match(c2HighStakesNegotiationSeedSource, /ExerciseType\.DIALOGUE_REPLY/);
  assert.match(c2HighStakesNegotiationSeedSource, /ExerciseType\.WRITING_PROMPT/);
  assert.match(c2HighStakesNegotiationSeedSource, /functionalCheck/);
});

test("C2.5 packages teach evidence-bounded literary interpretation and controlled rewriting", () => {
  const literaryLessons = lessons.filter((lesson) => lesson.topicSlug === "c2-literary-creative-control");
  assert.equal(literaryLessons.length, 6);
  for (const lesson of literaryLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected Spanish literary passage`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs bilingual evidence checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish interpretive synthesis`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five analytical models`);
  }
  assert.match(c2LiteraryCreativeControlSeedSource, /inputMode: input\.inputMode/);
  assert.match(c2LiteraryCreativeControlSeedSource, /orientationDe: "Lies oder höre zuerst auf konkrete Textsignale/);
  assert.match(c2LiteraryCreativeControlSeedSource, /recallPromptDe: "Fasse die Deutung auf Spanisch zusammen/);
  assert.match(c2LiteraryCreativeControlSeedSource, /ExerciseType\.TRANSFORMATION/);
  assert.match(c2LiteraryCreativeControlSeedSource, /ExerciseType\.WRITING_PROMPT/);
  assert.match(c2LiteraryCreativeControlSeedSource, /open interpretation is not scored as if semantic AI evaluation were available/);
});

test("C2.6 packages teach expert multi-speaker listening and actionable synthesis", () => {
  const listeningLessons = lessons.filter((lesson) => lesson.topicSlug === "c2-expert-listening-synthesis");
  assert.equal(listeningLessons.length, 6);
  for (const lesson of listeningLessons) {
    assert.match(lesson.block, /passage:\s*\[/, `${lesson.slug} needs a connected multi-speaker passage`);
    assert.match(lesson.block, /questions:\s*\[/, `${lesson.slug} needs bilingual listening checks`);
    assert.match(lesson.block, /modelSummary:\s*"/, `${lesson.slug} needs a Spanish actionable relay`);
    assert.equal(sentenceSpanishValues(lesson.block).length, 5, `${lesson.slug} needs five focused listening models`);
  }
  assert.match(c2ExpertListeningSynthesisSeedSource, /inputMode: "listening"/);
  assert.match(c2ExpertListeningSynthesisSeedSource, /orientationDe: "Höre zuerst auf die endgültige Aussage/);
  assert.match(c2ExpertListeningSynthesisSeedSource, /recallPromptDe: "Gib die endgültige Aussage auf Spanisch weiter/);
  assert.match(c2ExpertListeningSynthesisSeedSource, /ExerciseType\.LISTENING_DICTATION/);
  assert.match(c2ExpertListeningSynthesisSeedSource, /ExerciseType\.WRITING_PROMPT/);
  assert.match(c2ExpertListeningSynthesisSeedSource, /functionalCheck/);
});

test("zero pronoun lesson and checks stay scoped to taught pronouns", () => {
  const lesson = lessons.find((item) => item.slug === "zero-pronouns");
  assert.ok(lesson, "zero-pronouns lesson should exist");
  for (const pronoun of ["yo", "tú", "él", "ella"]) {
    assert.match(lesson.block, new RegExp(`["']${pronoun}`, "i"), `zero-pronouns should teach ${pronoun}`);
  }
  assert.doesNotMatch(lesson.block, /nosotros/i, "zero-pronouns should not teach nosotros");

  const lessonExercises = exercises.filter((exercise) => exercise.lessonSlug === "zero-pronouns");
  assert.ok(lessonExercises.length >= 6, "zero-pronouns should have enough focused checks");
  for (const exercise of lessonExercises) {
    assert.doesNotMatch(exercise.block, /nosotros/i, `${exercise.slug} should not quiz nosotros`);
  }
});

test("early ser and estar lessons teach enough contextual examples before practice", () => {
  for (const slug of ["zero-soy", "zero-estoy", "zero-es-esta", "ser-vs-estar-basics"]) {
    const lesson = lessons.find((item) => item.slug === slug);
    assert.ok(lesson, `${slug} lesson should exist`);
    const contextualExamples = sentenceSpanishValues(lesson.block).filter(
      (sentence) => (sentence.match(/\p{L}+/gu) || []).length >= 2
    );
    const minimumExamples = slug === "ser-vs-estar-basics" ? 6 : 5;
    assert.ok(
      contextualExamples.length >= minimumExamples,
      `${slug} should teach at least ${minimumExamples} contextual Spanish examples before its quiz, found ${contextualExamples.length}`
    );
  }
});

test("es and está checks use distinct sentence contexts", () => {
  const zeroExercises = exercises.filter((exercise) => exercise.lessonSlug === "zero-es-esta");
  const answerByPrompt = new Map();

  assert.ok(zeroExercises.length >= 4, "zero-es-esta should have several focused checks");
  assert.ok(zeroExercises.some((exercise) => normalizeSeedText(exerciseAnswer(exercise.block)) === "es"));
  assert.ok(zeroExercises.some((exercise) => normalizeSeedText(exerciseAnswer(exercise.block)) === "esta"));

  for (const exercise of zeroExercises) {
    const question = fieldValue(exercise.block, "questionText");
    const normalizedQuestion = normalizeSeedText(question);
    const answer = normalizeSeedText(exerciseAnswer(exercise.block));
    assert.ok(hasContextualPrompt(question), `${exercise.slug} should ask for a form in a sentence context`);
    assert.notEqual(normalizedQuestion, "es", `${exercise.slug} must not quiz a bare es prompt`);
    assert.notEqual(normalizedQuestion, "esta", `${exercise.slug} must not quiz a bare está prompt`);
    assert.notEqual(normalizedQuestion, "he she it is", `${exercise.slug} must not use the ambiguous he/she/it is prompt`);
    if (answerByPrompt.has(normalizedQuestion)) {
      assert.equal(answerByPrompt.get(normalizedQuestion), answer, `${exercise.slug} conflicts with another answer for the same prompt`);
    } else {
      answerByPrompt.set(normalizedQuestion, answer);
    }
  }
});

test("ser vs estar lesson has focused contextual recall across both verbs", () => {
  const lessonExercises = exercises.filter((exercise) => exercise.lessonSlug === "ser-vs-estar-basics");
  const answers = lessonExercises.map((exercise) => normalizeSeedText(exerciseAnswer(exercise.block)));

  assert.ok(lessonExercises.length >= 8, "ser-vs-estar-basics should have at least eight focused checks");
  assert.ok(
    lessonExercises.every((exercise) => hasContextualPrompt(fieldValue(exercise.block, "questionText"))),
    "ser-vs-estar-basics checks should all use meaningful sentence contexts"
  );
  assert.ok(answers.some((answer) => /\b(ser|soy|eres|es|somos|son)\b/.test(answer)), "the lesson should test ser forms");
  assert.ok(
    answers.some((answer) => /\b(estar|estoy|estas|esta|estamos|estan)\b/.test(answer)),
    "the lesson should test estar forms"
  );
});

test("the focused lesson API exposes persisted recurrence state for compact due reviews", () => {
  const focusedLessonRoute = serverSource.slice(
    serverSource.indexOf('app.get(\n  "/api/lessons/:id"'),
    serverSource.indexOf('app.post(\n  "/api/lessons/:id/reinforcement-complete"')
  );
  assert.match(focusedLessonRoute, /reviewDue: summary\.reviewDue/);
  assert.match(focusedLessonRoute, /reviewDueAt: summary\.reviewDueAt/);
  assert.match(focusedLessonRoute, /lessonReviewCount: summary\.lessonReviewCount/);
  assert.match(focusedLessonRoute, /publicExercise\([\s\S]*?lesson\.sentences/);
  assert.match(serverSource, /silentMeaning: listeningAlternativeMeaning\(exercise, lessonSentences\)/);
  assert.match(serverSource, /const practiceMode = \["home", "quiet-alternative"\]\.includes\(req\.body\.practiceMode\)/);
  assert.match(serverSource, /practiceMode,/);
  assert.match(serverSource, /independentScore: evidence\.independentScore/);
  assert.match(serverSource, /lessonReinforcementInterval\(\{/);
  assert.match(serverSource, /evidence: \{ firstPassScore, independentScore \}/);
});

test("review debt counts distinct learning entities instead of duplicate category labels", () => {
  const reviewBuilder = serverSource.slice(
    serverSource.indexOf("async function buildDueReview"),
    serverSource.indexOf("function recentAchievementFromLessons")
  );
  assert.match(reviewBuilder, /const uniqueWeakSpots = deduplicateReviewEntities\(weakSpots\)/);
  assert.match(reviewBuilder, /const items = deduplicateReviewEntities\(candidates\)\.slice\(0, limit\)/);
  assert.match(reviewBuilder, /const distinctDueCount = new Set\(\[/);
  assert.match(reviewBuilder, /total: distinctDueCount/);
  assert.match(reviewBuilder, /estimatedMinutes: Math\.max\(3, Math\.ceil\(items\.length \* 0\.7\)\)/);
  assert.doesNotMatch(reviewBuilder, /total: grammarCount \+ wordCount \+ weakSpots\.length/);
});

test("word attempts store native-language-neutral directions", () => {
  const wordAttemptRoute = serverSource.slice(
    serverSource.indexOf('app.post(\n  "/api/words/:id/attempt"'),
    serverSource.indexOf('app.post(\n  "/api/minigames/:gameKey/score"')
  );
  assert.match(wordAttemptRoute, /const mode = normalizeWordAttemptMode\(req\.body\.mode\)/);
  assert.match(wordAttemptRoute, /const expectsSpanish = wordAttemptExpectsSpanish\(mode\)/);
  assert.match(wordAttemptRoute, /const contextualAnswer = activityMode === "context" \? wordContextAnswer\(word\) : ""/);
  assert.match(wordAttemptRoute, /const expected = contextualAnswer \|\| \(expectsSpanish \? word\.spanish : word\.english\)/);
  assert.match(wordAttemptRoute, /evaluateSpanishWordAnswer\(expected, answer\)/);
  assert.match(wordAttemptRoute, /evaluation\.orthographyWarning \? "hard"/);
  assert.doesNotMatch(wordAttemptRoute, /mode === "en-es"/);
});

test("exercise attempts preserve a not-yet-due relearning deadline", () => {
  const updater = serverSource.slice(
    serverSource.indexOf("async function updateReviewItem"),
    serverSource.indexOf("async function updateWordReview")
  );
  const attemptRoute = serverSource.slice(
    serverSource.indexOf('app.post(\n  "/api/exercises/:id/attempt"'),
    serverSource.indexOf('app.post(\n  "/api/minigames/:gameKey/score"')
  );

  assert.match(updater, /scheduleExercisePractice\(existing, quality\)/);
  assert.match(updater, /scheduleAdvanced: scheduled\.scheduleAdvanced/);
  assert.match(attemptRoute, /scheduleAdvanced: reviewItem\.scheduleAdvanced/);
  assert.match(attemptRoute, /Useful reinforcement recorded; the existing due time remains unchanged/);
});

test("quiet listening creates a separate durable home-listening obligation", () => {
  const updater = serverSource.slice(
    serverSource.indexOf("async function updateDeferredChannelPractice"),
    serverSource.indexOf("async function updateWordReview")
  );
  const dashboard = serverSource.slice(
    serverSource.indexOf("async function buildDashboard"),
    serverSource.indexOf('app.post(\n  "/api/auth/register"')
  );
  const attemptRoute = serverSource.slice(
    serverSource.indexOf('app.post(\n  "/api/exercises/:id/attempt"'),
    serverSource.indexOf('app.post(\n  "/api/minigames/:gameKey/score"')
  );

  assert.match(updater, /action === "keep"/);
  assert.match(updater, /completedAt: now/);
  assert.match(updater, /dueAt: addMinutes\(now, 10\)/);
  assert.match(attemptRoute, /await updateDeferredChannelPractice\(\{/);
  assert.match(dashboard, /completedAt: null/);
  assert.match(dashboard, /pendingDeferredPractice\?\.channel \|\| skillProfile\.nextFocus/);
  assert.match(dashboard, /readyCount: deferredReadyCount/);
});

test("connected quiet listening persists the lesson target and can only close through real listening evidence", () => {
  const signalRoute = serverSource.slice(
    serverSource.indexOf('app.post(\n  "/api/practice-signals"'),
    serverSource.indexOf('app.delete(\n  "/api/pronunciation/vocabulary/:wordId"')
  );
  const dashboard = serverSource.slice(
    serverSource.indexOf("async function buildDashboard"),
    serverSource.indexOf('app.post(\n  "/api/auth/register"')
  );

  assert.match(signalRoute, /req\.body\.targetChannel === "listening" && req\.body\.completesChannelTarget/);
  assert.match(signalRoute, /lesson\?\.readingJson\?\.inputMode === "listening"/);
  assert.match(signalRoute, /const quietEvidenceSkill = targetKind === "sound-discrimination" \? "visual" : "reading"/);
  assert.match(signalRoute, /practiceMode === "home" \? skill === "listening" : skill === quietEvidenceSkill/);
  assert.match(signalRoute, /updateDeferredLessonListeningPractice\(\{/);
  assert.match(dashboard, /pendingDeferredPractice\.lesson\?\.readingJson\?\.inputMode === "listening"/);
  assert.match(dashboard, /"sound-listening"/);
  assert.match(dashboard, /readingJson: pendingDeferredPractice\?\.lessonId \? deferredLesson\.readingJson : null/);
});
