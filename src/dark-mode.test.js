const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const styles = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");

test("dark mode covers the semantic learning surfaces used for guidance and feedback", () => {
  assert.match(styles, /html\[data-theme="dark"\] :is\(\.bg-lagoon-50, \.bg-sky-50\)/);
  assert.match(styles, /html\[data-theme="dark"\] :is\(\.bg-coral-50, \.bg-red-50\)/);
  assert.match(styles, /html\[data-theme="dark"\] :is\(\.bg-emerald-50, \.bg-green-50\)/);
  assert.match(styles, /html\[data-theme="dark"\] :is\(\.bg-honey-50, \.bg-honey-100/);
  assert.match(styles, /\.border-coral-100, \.border-coral-200, \.border-coral-300/);
  assert.match(styles, /\.border-emerald-200, \.border-emerald-300, \.border-emerald-400/);
  assert.match(styles, /\.border-amber-100, \.border-amber-200/);
  assert.match(styles, /:is\(input:not\(\[type="checkbox"\]\), select, textarea\)/);
});
