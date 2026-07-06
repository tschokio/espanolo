#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "src", "App.jsx");
const seedPath = path.join(root, "prisma", "seed.js");
const imageDir = path.join(root, "images");

const appSource = fs.readFileSync(appPath, "utf8");
const seedSource = fs.readFileSync(seedPath, "utf8");

function parseImageSheets(source) {
  const sheets = new Map();
  const regex = /"([^"]+)":\s*{\s*src:\s*"([^"]+)",\s*grid:\s*(\d+)/g;
  let match;
  while ((match = regex.exec(source))) {
    sheets.set(match[1], {
      src: match[2],
      grid: Number(match[3])
    });
  }
  return sheets;
}

function collectImageKeys(source, fileLabel) {
  const keys = [];
  const regex = /(?:imageKey:\s*)?["']([a-z0-9-]+:\d+)["']/gi;
  let match;
  while ((match = regex.exec(source))) {
    keys.push({
      file: fileLabel,
      key: match[1],
      index: match.index
    });
  }
  return keys;
}

function extractArraySection(source, declarationName) {
  const marker = `const ${declarationName} = [`;
  const start = source.indexOf(marker);
  if (start === -1) return "";
  let depth = 0;
  for (let index = start + marker.length - 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  return "";
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
  const match = new RegExp(`${fieldName}:\\s*["']([^"']+)["']`).exec(block);
  return match?.[1] || "";
}

function validateImageKey(key, sheets) {
  const [sheetId, cellText] = key.split(":");
  const cell = Number(cellText);
  const sheet = sheets.get(sheetId);
  if (!sheet) return `Unknown image sheet "${sheetId}"`;
  if (!Number.isInteger(cell) || cell < 1 || cell > sheet.grid * sheet.grid) {
    return `Cell ${cellText} is outside ${sheetId}'s ${sheet.grid}x${sheet.grid} grid`;
  }
  return "";
}

const sheets = parseImageSheets(appSource);
const referencedKeys = [
  ...collectImageKeys(appSource, "src/App.jsx"),
  ...collectImageKeys(seedSource, "prisma/seed.js")
];
const issues = [];
const warnings = [];

for (const [sheetId, sheet] of sheets) {
  const imagePath = path.join(root, sheet.src.replace(/^\//, ""));
  if (!fs.existsSync(imagePath)) {
    issues.push(`Missing image file for ${sheetId}: ${sheet.src}`);
  }
}

for (const item of referencedKeys) {
  const issue = validateImageKey(item.key, sheets);
  if (issue) issues.push(`${item.file}: ${item.key} - ${issue}`);
}

const exerciseBlocks = collectObjectBlocks(extractArraySection(seedSource, "exercises"));
for (const block of exerciseBlocks) {
  const slug = fieldValue(block, "slug");
  const imageKey = fieldValue(block, "imageKey");
  if (/^(rewards-and-progress|minigame-ui-rewards):/.test(imageKey)) {
    warnings.push(`Exercise "${slug}" uses non-content artwork: ${imageKey}`);
  }
}

const lessonBlocks = collectObjectBlocks(extractArraySection(seedSource, "lessons"));
for (const block of lessonBlocks) {
  const slug = fieldValue(block, "slug");
  const title = fieldValue(block, "title");
  const theme = fieldValue(block, "theme");
  const imageKey = fieldValue(block, "imageKey");
  const isCheckpoint = /checkpoint/i.test(`${title} ${theme}`);
  if (!isCheckpoint && /^(rewards-and-progress|minigame-ui-rewards):/.test(imageKey)) {
    warnings.push(`Lesson "${slug}" uses non-content artwork outside a checkpoint: ${imageKey}`);
  }
}

const reuse = new Map();
for (const block of exerciseBlocks) {
  const imageKey = fieldValue(block, "imageKey");
  const slug = fieldValue(block, "slug");
  if (!imageKey) continue;
  if (!reuse.has(imageKey)) reuse.set(imageKey, []);
  reuse.get(imageKey).push(slug);
}
for (const [imageKey, slugs] of reuse.entries()) {
  if (slugs.length >= 6 && !/^(grammar-scenes|people-and-family):/.test(imageKey)) {
    warnings.push(`Exercise image ${imageKey} is reused ${slugs.length} times. Check visual fit: ${slugs.slice(0, 4).join(", ")}...`);
  }
}

console.log(`Asset audit scanned ${sheets.size} sheets and ${referencedKeys.length} image references.`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (issues.length) {
  console.error("\nErrors:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("\nNo missing or out-of-range image keys found.");
