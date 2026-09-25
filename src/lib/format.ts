/**
 * Number formatting that returns the number and its unit separately, so KPIs can render a big value
 * with a small dim unit (`<Stat value={p.value} unit={p.unit} />`). `text` joins them for plain output.
 */
export interface NumberParts {
  /** Localized number: "1.2", "1,284". */
  value: string;
  /** Unit or suffix: "MB", "K", "%", "h"; empty when there is none. */
  unit: string;
  /** Value and unit together: "1.2 MB", "42%". */
  text: string;
}

export interface FormatOptions {
  locale?: string | string[];
  /** Maximum fraction digits. Default: 1 below 10, 0 from 10 up. */
  digits?: number;
}

const NBSP = " ";

const join = (value: string, unit: string, gap = NBSP): NumberParts => ({
  value,
  unit,
  text: unit ? `${value}${gap}${unit}` : value,
});

const autoDigits = (n: number) => (Math.abs(n) < 10 ? 1 : 0);

const num = (n: number, digits: number, locale?: string | string[]) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(n);

/** Plain or compact ("1.2K") number; the compact suffix goes to `unit`. */
export function formatNumber(
  n: number,
  { compact, digits, locale }: FormatOptions & { compact?: boolean } = {},
): NumberParts {
  if (!compact) {
    const value = new Intl.NumberFormat(locale, { maximumFractionDigits: digits ?? 2 }).format(n);
    return join(value, "");
  }
  const parts = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: digits ?? 1,
  }).formatToParts(n);
  const unit = parts
    .filter((p) => p.type === "compact")
    .map((p) => p.value)
    .join("");
  const value = parts
    .filter((p) => p.type !== "compact" && p.type !== "literal")
    .map((p) => p.value)
    .join("");
  return join(value, unit, "");
}

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];
const BIT_UNITS = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"];

function scaled(n: number, base: number, units: string[], { digits, locale }: FormatOptions) {
  const abs = Math.abs(n);
  const i = abs < 1 ? 0 : Math.min(units.length - 1, Math.floor(Math.log(abs) / Math.log(base)));
  const v = n / base ** i;
  return { value: num(v, i === 0 ? 0 : (digits ?? autoDigits(v)), locale), unit: units[i] ?? "" };
}

/**
 * File sizes and traffic. `base` 1024 (default) matches what file managers show; `per: "s"` gives
 * a rate ("MB/s").
 */
export function formatBytes(
  bytes: number,
  { base = 1024, per, ...opts }: FormatOptions & { base?: 1000 | 1024; per?: string } = {},
): NumberParts {
  const { value, unit } = scaled(bytes, base, BYTE_UNITS, opts);
  return join(value, per ? `${unit}/${per}` : unit);
}

/** Network speed in bits per second: "940 Mbps". */
export function formatBitrate(bitsPerSecond: number, opts: FormatOptions = {}): NumberParts {
  const { value, unit } = scaled(bitsPerSecond, 1000, BIT_UNITS, opts);
  return join(value, unit);
}

/** Ratio 0..1 as a percentage: 0.425 → "42.5%". */
export function formatPercent(ratio: number, { digits, locale }: FormatOptions = {}): NumberParts {
  const pct = ratio * 100;
  return join(num(pct, digits ?? autoDigits(pct), locale), "%", "");
}

const STEPS: ReadonlyArray<[unit: string, ms: number]> = [
  ["d", 86_400_000],
  ["h", 3_600_000],
  ["m", 60_000],
  ["s", 1000],
];

/**
 * Durations in milliseconds.
 * - `units` (default): two largest non-zero units, "1h 2m", "45s", "320ms";
 * - `clock`: "1:02:03", "2:03" — timers and media;
 * - `compact`: the largest unit with a fraction, value "1.5" + unit "h" — KPIs.
 */
export function formatDuration(
  ms: number,
  { style = "units", digits, locale }: FormatOptions & { style?: "units" | "clock" | "compact" } = {},
): NumberParts {
  const sign = ms < 0 ? "-" : "";
  const abs = Math.abs(ms);
  if (style === "clock") {
    const total = Math.floor(abs / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return join(sign + (h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`), "");
  }
  if (abs < 1000) return join(sign + num(abs, 0, locale), "ms");
  if (style === "compact") {
    const [unit, size] = STEPS.find(([, step]) => abs >= step) ?? ["s", 1000];
    const v = abs / size;
    return join(sign + num(v, digits ?? autoDigits(v), locale), unit);
  }
  const out: string[] = [];
  let rest = abs;
  for (const [unit, size] of STEPS) {
    const n = Math.floor(rest / size);
    rest -= n * size;
    if (n || out.length > 0) out.push(`${num(n, 0, locale)}${unit}`);
    if (out.length === 2) break;
  }
  const text = sign + out.filter((part, i) => i === 0 || !part.startsWith("0")).join(" ");
  return join(text, "");
}
