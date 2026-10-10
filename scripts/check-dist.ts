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
  ...(["@starting-style", "@container scroll-state", "@supports (appearance: base-select)", "@keyframes rk-indeterminate", "tr:hover > :is(.rk-table .rk-table-pin)", ".rk-floating:not(:popover-open)"].flatMap((rule) => css.includes(rule) ? [] : [`missing CSS serialization contract: ${rule}`])),
  ...(existsSync(join(root, "dist/tailwind.css")) ? [] : ["missing tailwind.css"]),
  ...(["tokens.css", "base.css", "button.css", "text.css", "rain.css"].flatMap((file) =>
    existsSync(join(root, "dist/css", file)) ? [] : [`missing CSS export: ${file}`],
  )),
  ...(["en.js", "en.d.ts", "ru.js", "ru.d.ts"].flatMap((file) =>
    existsSync(join(root, "dist/labels", file)) ? [] : [`missing labels export: ${file}`],
  )),
];
const ssr = Bun.spawn(["node", "--input-type=module", "--eval", `
  import { createElement } from 'react';
  import { renderToString } from 'react-dom/server';
  import { Button, Card, Input, RootikProvider } from './dist/index.js';
  const html = renderToString(createElement(RootikProvider, { theme: 'rain' },
    createElement(Card, { title: 'SSR' }, createElement(Button, null, 'Save'), createElement(Input, { name: 'query' }))));
  if (!html.includes('rk-button') || !html.includes('rk-input') || !html.includes('rk-card')) throw new Error('SSR styles/markup contract failed');
`], { cwd: root, stdout: "pipe", stderr: "pipe" });
if (await ssr.exited !== 0) problems.push(`Node SSR: ${await new Response(ssr.stderr).text()}`);
if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`dist ok: ${dist.length} exports, ${(css.length / 1024).toFixed(0)} KB css`);
