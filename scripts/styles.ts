import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { vanillaExtractPlugin } from "@vanilla-extract/rollup-plugin";
import { rollup } from "rollup";
import { readdirSync } from "node:fs";

const root = fileURLToPath(new URL("../", import.meta.url));
const RAW_COLOR = /oklch\(\s*[\d.]|#[\da-f]{3,8}\b/i;
export const STYLE_FAMILIES = {
  button: "src/components/button.css", input: "src/components/input.css",
  card: "src/components/card.css", rain: "src/theme/rain.css",
  choice: "src/components/choice.css", nav: "src/components/nav.css",
  fluent: "src/fluent.css", foundation: "src/tokens.css",
  base: "src/base.css", settings: "src/theme/settings.css",
  ...Object.fromEntries(readdirSync(join(root, "src/components")).filter((file) => file.endsWith(".css")).map((file) => [file.slice(0, -4), `src/components/${file}`])),
};

/** Pre-extract for dist and source consumers; neither needs a VE transform or runtime. */
export async function generateStyles(check = false) {
  // The upstream VE evaluator requires Node's CJS/VM semantics on Windows.
  if (typeof Bun !== "undefined") {
    const child = Bun.spawn(["node", fileURLToPath(import.meta.url), ...(check ? ["--check"] : [])], {
      cwd: root, stdout: "inherit", stderr: "inherit",
    });
    if (await child.exited !== 0) throw new Error("Style extraction failed");
    const { generateCssExports } = await import("./css-exports");
    await generateCssExports(check);
    return;
  }
  const hash = (text: string) => createHash("sha256").update(text).digest("hex");
  const cachePath = join(root, "node_modules/.cache/rootik-styles.json");
  const cached: unknown = await readFile(cachePath, "utf8").then(JSON.parse).catch(() => ({}));
  const cache: Record<string, { authoring: string; css: string }> = cached && typeof cached === "object" && !Array.isArray(cached) ? cached as Record<string, { authoring: string; css: string }> : {};
  const shared = await Promise.all(["styles/tokens.css.ts", "styles/css-types.d.ts", "bun.lock", "biome.json", "scripts/styles.ts"].map((file) => readFile(join(root, file), "utf8")));
  const sharedHash = hash(shared.join("\n"));
  for (const [family, target] of Object.entries(STYLE_FAMILIES)) {
    const authoring = await readFile(join(root, `styles/${family}.css.ts`), "utf8");
    const fingerprint = hash(authoring + sharedHash);
    const path = join(root, target);
    const existing = await readFile(path, "utf8").catch(() => "");
    if (family !== "rain" && family !== "foundation") {
      if (RAW_COLOR.test(authoring)) throw new Error(`Raw color in ${family}; move it into the token contract`);
    }
    if (!check && cache[family]?.authoring === fingerprint && cache[family]?.css === hash(existing)) continue;
    const bundle = await rollup({
      input: join(root, `styles/${family}.css.ts`),
      plugins: [vanillaExtractPlugin({ identifiers: "short", extract: { name: `${family}.css` } })],
      onwarn(warning, warn) { if (warning.code !== "EMPTY_BUNDLE") warn(warning); },
    });
    try {
      const { output } = await bundle.generate({ format: "es", assetFileNames: "[name][extname]" });
      const css = output.find((file) => file.type === "asset" && file.fileName.endsWith(".css"));
      if (!css || css.type !== "asset" || typeof css.source !== "string") throw new Error(`No extracted CSS for ${family}`);
      const source = `/* Generated from styles/${family}.css.ts. Run bun run styles; do not edit. */\n${css.source}`;
      const formatted = await new Promise<string>((resolve, reject) => {
        const formatter = spawn("bun", ["x", "biome", "format", "--stdin-file-path", target], { cwd: root });
        let stdout = "", stderr = "";
        formatter.stdout.on("data", (data) => { stdout += data; });
        formatter.stderr.on("data", (data) => { stderr += data; });
        formatter.on("error", reject);
        formatter.on("close", (status) => status === 0 ? resolve(stdout) : reject(new Error(stderr)));
        formatter.stdin.end(source);
      });
      cache[family] = { authoring: fingerprint, css: hash(formatted) };
      if (existing === formatted) continue;
      if (check) throw new Error(`Stale ${target}; run bun run styles`);
      await writeFile(path, formatted);
    } finally { await bundle.close(); }
  }
  if (!check) {
    await mkdir(join(root, "node_modules/.cache"), { recursive: true });
    await writeFile(cachePath, JSON.stringify(cache));
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await generateStyles(process.argv.includes("--check"));
