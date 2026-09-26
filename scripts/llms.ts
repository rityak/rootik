// Generates llms.txt: kit rules plus an index of components and hooks that points at the source (file:line)
// and the story showing it, with the JSDoc summary when there is one. The code stays the reference;
// this file only tells an assistant where to look. `--check` fails when it's stale.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = join(import.meta.dir, "..");
const read = (p: string) => readFileSync(join(root, p), "utf8").replace(/\r\n/g, "\n");
const pkg = JSON.parse(read("package.json")) as { name: string; description: string };

/** First sentence of the JSDoc block right above `index`, or "". */
function summary(src: string, index: number): string {
  const before = src.slice(0, index).trimEnd();
  if (!before.endsWith("*/")) return "";
  const start = before.lastIndexOf("/**");
  if (start < 0) return "";
  const text = before
    .slice(start + 3, -2)
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim())
    .filter(Boolean)
    .join(" ");
  return (/^.*?\.(\s|$)/.exec(text)?.[0] ?? text).trim();
}

const lineOf = (src: string, index: number) => src.slice(0, index).split("\n").length;

const kebab = (s: string) =>
  s
    .replace(/_+$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

// Ladle story ids and sources: each component links the shortest story that renders it
const stories: Array<{ id: string; code: string }> = [];
for (const file of readdirSync(join(root, "src/stories")).filter((f) => f.endsWith(".stories.tsx"))) {
  const src = read(`src/stories/${file}`);
  const family = /export default \{ title: "([^"]+)" \}/.exec(src)?.[1] ?? basename(file, ".stories.tsx");
  const starts = [...src.matchAll(/^export const (\w+): Story/gm)];
  starts.forEach((m, k) => {
    stories.push({
      id: `${kebab(family)}--${kebab(m[1] as string)}`,
      code: src.slice(m.index, starts[k + 1]?.index ?? src.length),
    });
  });
}

const modules = [
  ...readdirSync(join(root, "src/components"))
    .filter((f) => f.endsWith(".tsx") && f !== "chart-parts.tsx")
    .map((f) => `src/components/${f}`),
  "src/theme/provider.tsx",
  "src/theme/settings.tsx",
  "src/lib/highlight.tsx",
];

let components = "";
let count = 0;
for (const file of modules) {
  const src = read(file);
  const found = [...src.matchAll(/^export function ([A-Z]\w*)/gm)];
  if (found.length === 0) continue;
  components += `\n### ${file}\n\n`;
  for (const m of found) {
    const name = m[1] as string;
    const story = stories
      .filter((s) => new RegExp(`<${name}[\\s/>]`).test(s.code))
      .sort((a, b) => a.code.length - b.code.length)[0];
    const doc = summary(src, m.index);
    components += `- \`${name}\` — ${file}:${lineOf(src, m.index)}${story ? `, story \`${story.id}\`` : ""}${doc ? `. ${doc}` : ""}\n`;
    count++;
  }
}

let hooks = "";
for (const file of readdirSync(join(root, "src/lib"))
  .filter((f) => /\.tsx?$/.test(f) && !f.includes(".test."))
  .map((f) => `src/lib/${f}`)) {
  const src = read(file);
  for (const m of src.matchAll(/^export function ([a-z]\w*)/gm)) {
    const doc = summary(src, m.index);
    hooks += `- \`${m[1]}\` — ${file}:${lineOf(src, m.index)}${doc ? `. ${doc}` : ""}\n`;
  }
}

const text = `# ${pkg.name}

> ${pkg.description}. React 19, zero runtime dependencies besides React, plain CSS with \`--rk-*\` custom properties in \`@layer rootik\`. Dark-first ("Graphite & Iris").

The source is the reference: each entry below points at the component (read its \`…Props\` interface and JSDoc there) and at a story (\`src/stories/*.stories.tsx\`, open in Ladle with \`?story=<id>\`) that shows real usage.

## Setup

\`\`\`tsx
import "${pkg.name}/styles.css";
import { RootikProvider, Toaster } from "${pkg.name}";

<RootikProvider storageKey="app:appearance">
  <App />
  <Toaster />
</RootikProvider>;
\`\`\`

With Tailwind v4 declare \`@layer theme, base, rootik, components, utilities;\` before the imports.

## Rules

- Style through tokens only (\`src/tokens.css\`: \`--rk-accent\`, \`--rk-surface-1…4\`, \`--rk-text/-2/-3\`, \`--rk-radius*\`, \`--rk-space\`); never hard-code colors.
- Props share one vocabulary: \`variant\`, \`size\` (\`sm | md | lg\`), \`tone\` (\`neutral | accent | success | warn | danger | info\`), \`icon: ReactNode\`. Rest props go to the root element; \`className\` merges.
- Controlled or uncontrolled: \`value\`/\`onChange\` or \`defaultValue\`; open state is \`open\`/\`onOpenChange\`.
- Wrap form controls in \`Field\` (label, hint, error, aria wiring). Icon-only buttons need \`label\`; status by color needs a text label.
- Translate the kit's strings with \`<RootikProvider labels>\` (\`src/lib/labels.tsx\`); appearance via \`defaults\`, \`extensions\` or \`<Scope values>\`.
- Charts take plain arrays; categorical colors come from \`seriesColor(i)\` in fixed order; accent marks the highlighted datum.

## Components (${count})
${components}
## Hooks and utilities

${hooks}`;

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = read("llms.txt");
  } catch {}
  if (current !== text) {
    console.error("llms.txt is stale — run `bun run llms`");
    process.exit(1);
  }
} else {
  writeFileSync(join(root, "llms.txt"), text);
  console.log(`llms.txt: ${count} components`);
}
