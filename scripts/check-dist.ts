// After `bun run build`: dist must export exactly what src does, and styles.css must be self-contained.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const src = Object.keys(await import(join(root, "src/index.ts"))).sort();
const dist = Object.keys(await import(join(root, "dist/index.js"))).sort();
const missing = src.filter((k) => !dist.includes(k));
const extra = dist.filter((k) => !src.includes(k));
const css = readFileSync(join(root, "dist/styles.css"), "utf8");
const problems = [
  ...missing.map((k) => `missing in dist: ${k}`),
  ...extra.map((k) => `extra in dist: ${k}`),
  ...(css.includes("@import") ? ["styles.css still has @import"] : []),
  ...(["tokens.css", "base.css", "button.css", "text.css"].flatMap((file) =>
    existsSync(join(root, "dist/css", file)) ? [] : [`missing CSS export: ${file}`],
  )),
  ...(["en.js", "en.d.ts", "ru.js", "ru.d.ts"].flatMap((file) =>
    existsSync(join(root, "dist/labels", file)) ? [] : [`missing labels export: ${file}`],
  )),
];
if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`dist ok: ${dist.length} exports, ${(css.length / 1024).toFixed(0)} KB css`);
