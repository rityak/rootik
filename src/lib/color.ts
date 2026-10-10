/** OKLCH color: lightness 0–1, chroma ≥ 0, hue in degrees, alpha 0–1. */
export interface Oklch {
  l: number;
  c: number;
  h: number;
  alpha: number;
}

type Rgb = [number, number, number];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number, digits: number) => Number(n.toFixed(digits));
const toLinear = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
export const toGamma = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);

/** OKLCH → linear sRGB (Björn Ottosson's OKLab matrices); values outside 0–1 are out of gamut. */
export function oklchToLinearRgb({ l, c, h }: Pick<Oklch, "l" | "c" | "h">): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

/** sRGB channels 0–1 → OKLCH (hue 0 for greys). */
export function rgbToOklch([r, g, b]: Rgb, alpha = 1): Oklch {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const c = Math.hypot(A, B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h, alpha };
}

export function inSrgbGamut(color: Pick<Oklch, "l" | "c" | "h">, eps = 1e-4): boolean {
  return oklchToLinearRgb(color).every((x) => x >= -eps && x <= 1 + eps);
}

/** #rrggbb (gamut-clipped). */
export function oklchToHex(color: Pick<Oklch, "l" | "c" | "h">): string {
  return `#${oklchToLinearRgb(color)
    .map((x) =>
      Math.round(clamp(toGamma(clamp(x, 0, 1)), 0, 1) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** `oklch(0.57 0.2 277)`, with ` / 0.5` when translucent. */
export function formatOklch({ l, c, h, alpha }: Oklch): string {
  const base = `${round(l, 3)} ${round(c, 3)} ${round(c < 1e-4 ? 0 : h, 1)}`;
  return alpha < 1 ? `oklch(${base} / ${round(alpha, 2)})` : `oklch(${base})`;
}

const NUM = String.raw`([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?%?)`;
const OKLCH_RE = new RegExp(
  String.raw`^oklch\(\s*${NUM}\s+${NUM}\s+${NUM}(?:deg)?\s*(?:\/\s*${NUM}\s*)?\)$`,
  "i",
);
const HEX_RE = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const RGB_RE = new RegExp(String.raw`^rgba?\(\s*${NUM}[\s,]+${NUM}[\s,]+${NUM}(?:[\s,/]+${NUM})?\s*\)$`, "i");

const fraction = (text: string, scale = 1) =>
  text.endsWith("%") ? Number.parseFloat(text) / 100 : Number.parseFloat(text) / scale;

/** Parse `oklch(…)`, `#rgb[a]`, `#rrggbb[aa]` or `rgb[a](…)`; null when it isn't one of those. */
export function parseColor(text: string): Oklch | null {
  const t = text.trim();
  const ok = OKLCH_RE.exec(t);
  if (ok) {
    const [, L = "0", C = "0", H = "0", A] = ok;
    // chroma percentages are relative to 0.4 (CSS Color 4)
    const c = C.endsWith("%") ? (Number.parseFloat(C) / 100) * 0.4 : Number.parseFloat(C);
    if (![fraction(L), c, Number.parseFloat(H), A ? fraction(A) : 1].every(Number.isFinite)) return null;
    const color = {
      l: clamp(fraction(L), 0, 1),
      c: Math.max(0, c),
      h: ((Number.parseFloat(H) % 360) + 360) % 360,
      alpha: A ? clamp(fraction(A), 0, 1) : 1,
    };
    return Object.values(color).every(Number.isFinite) ? color : null;
  }
  const hex = HEX_RE.exec(t)?.[1];
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((d) => d + d).join("") : hex;
    const byte = (i: number) => Number.parseInt(full.slice(i, i + 2), 16) / 255;
    return rgbToOklch([byte(0), byte(2), byte(4)], full.length === 8 ? byte(6) : 1);
  }
  const rgb = RGB_RE.exec(t);
  if (rgb) {
    const [, r = "0", g = "0", b = "0", a] = rgb;
    const channels: Rgb = [fraction(r, 255), fraction(g, 255), fraction(b, 255)];
    const alpha = a ? fraction(a) : 1;
    if (![...channels, alpha].every(Number.isFinite)) return null;
    return rgbToOklch(channels.map((x) => clamp(x, 0, 1)) as Rgb, clamp(alpha, 0, 1));
  }
  return null;
}
