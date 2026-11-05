import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const output = resolve(import.meta.dir, "../build-design-lab");
const assets = join(output, "assets");
const css = readdirSync(assets).filter((file) => file.endsWith(".css")).map((file) => readFileSync(join(assets, file), "utf8")).join("\n");
const faces = css.match(/@font-face\{[^}]+\}/g) ?? [];
const fonts = [
  ["geist", "Geist Variable", true], ["geist-mono", "Geist Mono Variable", true],
  ["inter", "Inter Variable", true], ["onest", "Onest Variable", false],
  ["rubik", "Rubik Variable", true],
  ["golos-text", "Golos Text Variable", false], ["jetbrains-mono", "JetBrains Mono Variable", true],
  ["literata", "Literata Variable", true],
] as const;

for (const [id, family, italic] of fonts) {
  for (const style of italic ? ["normal", "italic"] : ["normal"]) {
    const face = faces.find((rule) => rule.includes(`font-family:${family};`) && rule.includes(`font-style:${style};`) && /U\+0?400-0?45F/i.test(rule));
    assert(face, `Missing Cyrillic ${family}/${style}; font files alone do not load a face`);
  }
  assert(/open font license/i.test(readFileSync(join(output, "font-licenses", `${id}.txt`), "utf8")), `Missing ${family} license`);
}
for (const face of faces) {
  assert(!/https?:\/\//.test(face), "Remote font URL in the local font bundle");
  const url = /url\(([^)]+)\)/.exec(face)?.[1]?.replaceAll(/["']/g, "");
  const inlinePrefix = "data:font/woff2;base64,";
  if (url?.startsWith(inlinePrefix)) {
    assert(Buffer.from(url.slice(inlinePrefix.length), "base64").byteLength > 0, "Empty inline font");
    continue;
  }
  assert(url?.startsWith("/assets/"), "Unexpected non-local font source");
  assert(readFileSync(join(output, url.slice(1))).byteLength > 0, `Missing font asset: ${url}`);
}
console.log(`Design Lab: ${faces.length} local font faces, ${fonts.length} families, Cyrillic/italic and licenses verified`);
