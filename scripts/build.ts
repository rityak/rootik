// npm build: per-module ESM + declarations from tsc (tree-shakeable, React stays a peer), and one
// dist/styles.css with everything in @layer rootik. The "source" export condition still resolves src/.
import { $ } from "bun";
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(import.meta.dir, "..");
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });

await $`bunx tsc -p ${join(root, "tsconfig.build.json")}`;

// Node ESM and webpack (fullySpecified) need file extensions on relative imports; tsc keeps them bare.
const RELATIVE = /((?:from|import)\s*\(?\s*["'])(\.{1,2}\/[^"']+?)(["'])/g;
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
for (const file of walk(dist).filter((f) => f.endsWith(".js") || f.endsWith(".d.ts"))) {
  const code = readFileSync(file, "utf8");
  const fixed = code.replace(RELATIVE, (_, a: string, spec: string, b: string) =>
    /\.(js|css|json)$/.test(spec) ? `${a}${spec}${b}` : `${a}${spec}.js${b}`,
  );
  if (fixed !== code) writeFileSync(file, fixed);
}

// Bun's CSS bundler can't parse newer at-rules (scroll-state queries), so inline the imports ourselves:
// `@import "x" layer(rootik)` becomes `@layer rootik { …x… }`, the same cascade as in development.
const IMPORT = /^@import\s+"([^"]+)"\s+layer\((\w+)\);\s*$/gm;
const entry = join(root, "src/styles.css");
const css = readFileSync(entry, "utf8").replace(IMPORT, (_, path: string, layer: string) => {
  const body = readFileSync(join(dirname(entry), path), "utf8");
  if (body.includes("@import")) throw new Error(`nested @import in ${path}`);
  return `/* ${path} */\n@layer ${layer} {\n${body.trim()}\n}\n`;
});
if (css.includes("@import")) throw new Error("unresolved @import in styles.css");
writeFileSync(join(dist, "styles.css"), css);
console.log("dist: ESM modules + .d.ts, styles.css");
