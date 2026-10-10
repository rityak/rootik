import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = join(root, "src");
const IMPORT = /^@import\s+"([^"]+)"\s+layer\(rootik\);/gm;
export const cssSources = [...readFileSync(join(source, "styles.css"), "utf8").matchAll(IMPORT)].map((match) => match[1] as string);
const core = ["./tokens.css", "./theme/rain.css", "./base.css", "./fluent.css"];
const shared: Record<string, string[]> = {
  "lib/indicator-box": ["./components/indicator.css"],
  "components/select": ["./components/input.css", "./components/menu.css"],
  "components/combobox": ["./components/menu.css"],
  "components/token-field": ["./components/menu.css"],
  "components/heatmap": ["./components/tooltip.css"],
  "components/tracker": ["./components/tooltip.css"],
  "components/select-panel": ["./components/input.css", "./components/menu.css"],
  "components/tree": ["./components/data.css"],
  "components/tree-select": ["./components/input.css", "./components/menu.css"],
  "components/chart-parts": ["./components/charts.css"],
  "components/scatter-chart": ["./components/charts.css"],
};
export const cssEntries = [...new Set([...cssSources, ...readdirSync(join(source, "components")).filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx")).map((file) => `./components/${file.replace(/\.tsx$/, ".css")}`)])];

export function cssDependencies(entry: string) {
  if (core.includes(entry)) return [entry];
  const files = new Set<string>(core);
  const visited = new Set<string>();
  function visit(file: string) {
    if (visited.has(file)) return;
    visited.add(file);
    const stem = relative(source, file).replaceAll("\\", "/").replace(/\.tsx?$/, "");
    const css = `./${stem}.css`;
    if (cssSources.includes(css)) files.add(css);
    for (const dependency of shared[stem] ?? []) files.add(dependency);
    const transpiler = new Bun.Transpiler({ loader: "tsx" });
    const code = transpiler.transformSync(readFileSync(file, "utf8"));
    for (const imported of transpiler.scanImports(code)) {
      const specifier = imported.path;
      if (!specifier.startsWith(".")) continue;
      const path = resolve(dirname(file), specifier);
      const dependency = [path + ".tsx", path + ".ts"].find(existsSync);
      if (dependency) visit(dependency);
    }
  }
  const path = join(source, entry.replace(/\.css$/, ""));
  const module = [path + ".tsx", path + ".ts"].find(existsSync);
  if (module) visit(module);
  if (cssSources.includes(entry)) files.add(entry);
  return cssSources.filter((file) => files.has(file));
}

export async function generateCssExports(check = false) {
  const dir = join(source, "css");
  mkdirSync(dir, { recursive: true });
  for (const path of cssEntries) {
    const name = path.slice(path.lastIndexOf("/") + 1);
    const dependencies = core.includes(path) ? [path] : cssDependencies(path);
    const body = "/* Generated CSS export. Run bun run styles; do not edit. */\n" + dependencies.map((file) => `@import "../${file.slice(2)}" layer(rootik);`).join("\n") + "\n";
    const target = join(dir, name);
    const previous = existsSync(target) ? readFileSync(target, "utf8") : "";
    if (previous === body) continue;
    if (check) throw new Error(`Stale CSS export ${name}; run bun run styles`);
    writeFileSync(target, body);
  }
  const select = cssDependencies("./components/select.css");
  assert(select.includes("./components/menu.css") && select.includes("./components/input.css"), "Select CSS dependency closure is incomplete");
  assert(cssSources.length === new Set(cssSources.map((file) => file.slice(file.lastIndexOf("/") + 1))).size, "CSS export names collide");
}
