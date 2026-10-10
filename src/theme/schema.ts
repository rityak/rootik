import type { ReactNode } from "react";
import { formatOklch, type Oklch, oklchToLinearRgb, parseColor } from "../lib/color";

export type SettingValue = string | number | boolean;
export interface BuiltinAppearanceValues {
  palette: "legacy" | "rain";
  accent: string;
  neutral: string;
  style: "rootik" | "fluent";
  radius: number;
  pill: boolean;
  corners: "round" | "squircle" | "square";
  layout: "islands" | "inset";
  spacing: "flush" | "tight" | "default" | "roomy";
  dock: "float" | "bar";
  density: "compact" | "default" | "comfortable";
  font: "geist" | "inter" | "system" | "mono";
  fontSize: number;
  glow: "accent" | "neutral" | "custom" | "off";
  "glow.color": string;
  "glow.secondary": string;
  "glow.strength": number;
  "glow.gradient": "material" | "clouds" | "linear";
  "glow.angle": number;
  "glow.x": number;
  "glow.y": number;
  "glow.spread": number;
  "glow.softness": number;
  backdrop: string;
  "backdrop.dim": number;
  material: "solid" | "veil" | "frost" | "liquid";
  "material.transparency": number;
  "material.blur": number;
  "material.reflection": number;
  "material.reflectionAngle": number;
  glass: boolean;
  "glass.transparency": number;
  "glass.blur": number;
  motion: "system" | "full" | "off";
}
/** Known keys are typed; consumer extension keys remain supported. */
export type AppearanceValues = Partial<BuiltinAppearanceValues> & Record<string, SettingValue>;
/** CSS custom properties to write; `null` removes a property (falls back to tokens.css). */
export type CssVars = Record<string, string | null>;

export const THEMES = {
  iris: { accent: "oklch(0.57 0.2 277)", neutral: "graphite", material: "veil", radius: 18 },
  ocean: { accent: "oklch(0.58 0.14 245)", neutral: "slate", material: "frost", radius: 16 },
  ember: { accent: "oklch(0.6 0.19 35)", neutral: "mocha", material: "solid", radius: 12 },
  mono: { accent: "oklch(0.94 0 0)", neutral: "zinc", material: "solid", radius: 8 },
  rain: {
    palette: "rain",
    accent: "oklch(0.53 0.1 275)",
    neutral: "rain",
    material: "frost",
    radius: 16,
    glow: "custom",
    "glow.color": "oklch(0.58 0.09 255)",
    "glow.secondary": "oklch(0.5 0.08 285)",
    "glow.gradient": "clouds",
    "glow.strength": 70,
    "glow.x": 75,
    "glow.y": 10,
    "glow.spread": 130,
    "glow.softness": 85,
    "material.reflection": 35,
  },
  // Windows 10 (UWP) spirit in the kit's own colors: flat solid panels edge to edge, taskbar dock
  fluent: { style: "fluent", spacing: "flush", layout: "inset", dock: "bar" },
} as const satisfies Record<string, Partial<AppearanceValues>>;

export type ThemeName = keyof typeof THEMES;

interface FieldBase {
  /** Unique key in the values record. Dots are just a naming convention ("editor.fontSize"). */
  key: string;
  label: ReactNode;
  hint?: ReactNode;
  /** Nested fields, rendered indented under this one; shown while this field's value is truthy. */
  children?: SettingsField[];
  /** Hide the field (and its children) unless this returns true. */
  visible?: (values: AppearanceValues) => boolean;
  /** Also write the value as this data attribute (`"rk-style"` → `data-rk-style`) for CSS selectors. */
  dataAttr?: string;
  /** Write the value to this CSS custom property (numbers get `unit`). */
  cssVar?: string;
  unit?: string;
  /** Full control over CSS output; receives all values (for fields that depend on each other). */
  apply?: (value: SettingValue, values: AppearanceValues) => CssVars;
}

export type SettingsField =
  | (FieldBase & { type: "toggle"; default: boolean })
  | (FieldBase & {
      type: "select" | "segmented";
      default: string;
      options: ReadonlyArray<{ value: string; label: string }>;
    })
  | (FieldBase & {
      type: "slider";
      default: number;
      min: number;
      max: number;
      step?: number;
      format?: (value: number) => string;
    })
  | (FieldBase & {
      type: "color";
      default: string;
      swatches?: ReadonlyArray<{ value: string; label: string }>;
    })
  | (FieldBase & { type: "text"; default: string; placeholder?: string })
  | (FieldBase & {
      type: "custom";
      default: SettingValue;
      render: (
        value: SettingValue,
        set: (value: SettingValue) => void,
        values: AppearanceValues,
      ) => ReactNode;
    });

export interface SettingsSection {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  fields: SettingsField[];
}

/** Accent presets; the provider chooses light/dark labels from the actual sRGB luminance. */
export const ACCENTS = [
  { value: "oklch(0.57 0.2 277)", label: "Iris" },
  { value: "oklch(0.58 0.14 245)", label: "Tide" },
  { value: "oklch(0.57 0.21 300)", label: "Violet" },
  { value: "oklch(0.58 0.2 0)", label: "Rose" },
  { value: "oklch(0.6 0.19 35)", label: "Ember" },
  { value: "oklch(0.84 0.15 80)", label: "Amber" },
  { value: "oklch(0.84 0.13 170)", label: "Mint" },
  { value: "oklch(0.88 0.18 125)", label: "Sprout" },
  { value: "oklch(0.94 0 0)", label: "Mono" },
] as const;

const NEUTRALS: Record<string, [hue: number, chroma: number]> = {
  rain: [255, 0.012],
  graphite: [260, 0.012],
  slate: [250, 0.02],
  zinc: [0, 0],
  moss: [150, 0.014],
  mocha: [50, 0.014],
  plum: [320, 0.015],
};

export const FONTS: Record<string, string | null> = {
  geist: null,
  inter: '"Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif',
  system: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: '"Geist Mono Variable", "JetBrains Mono", ui-monospace, monospace',
};

const tint = (a: number) => `oklch(var(--rk-tint) / ${a})`;
const shade = (a: number) => `oklch(var(--rk-shade) / ${a})`;
const glow = (color: string, pct: number, at: string, size = "55% 50%") =>
  `radial-gradient(${size} at ${at}, color-mix(in oklab, ${color} ${pct}%, transparent), transparent 70%)`;
const round = (n: number) => Math.round(n * 100) / 100;

/** Ambient glow slot: which color (0 primary, 1 secondary, 2 third, 3 neutral sheen), %, position, size. */
type Glow = [slot: 0 | 1 | 2 | 3, pct: number, at: string, size?: string];

interface Material {
  /** Opacity of surfaces, %; 100 = opaque. */
  alpha: number;
  blur: number;
  saturate: number;
  edge: string | null;
  sheen: string | null;
  shadow: string | null;
  glows: Glow[];
}

const MATERIAL_SPECS: Record<string, Material> = {
  solid: { alpha: 100, blur: 0, saturate: 1, edge: null, sheen: null, shadow: null, glows: [] },
  veil: {
    alpha: 80,
    blur: 10,
    saturate: 1.25,
    edge: `linear-gradient(150deg, ${tint(0.16)}, ${tint(0.03)} 45%, ${tint(0.08)})`,
    sheen: null,
    shadow: `0 1px 2px ${shade(0.3)}`,
    glows: [
      [0, 14, "85% -10%", "60% 45%"],
      [1, 10, "0% 100%", "50% 40%"],
    ],
  },
  frost: {
    alpha: 58,
    blur: 22,
    saturate: 1.5,
    edge: `linear-gradient(160deg, ${tint(0.22)}, ${tint(0.04)} 40%, ${tint(0.1)})`,
    sheen: `linear-gradient(180deg, ${tint(0.05)}, transparent 30%)`,
    shadow: `0 12px 32px -16px ${shade(0.6)}`,
    glows: [
      [0, 24, "85% 0%"],
      [1, 18, "5% 95%"],
      [2, 10, "45% 60%", "40% 35%"],
    ],
  },
  // glass character (high transparency, specular rim, sheen) with a restrained, mostly neutral backdrop:
  // saturate() stays low so the glow isn't amplified into a neon wash
  liquid: {
    alpha: 40,
    blur: 26,
    saturate: 1.15,
    edge: `linear-gradient(135deg, ${tint(0.3)}, ${tint(0.05)} 30%, ${tint(0.02)} 60%, ${tint(0.14)})`,
    sheen: `radial-gradient(120% 60% at 0% 0%, ${tint(0.07)}, transparent 50%), linear-gradient(180deg, ${tint(0.04)}, transparent 35%)`,
    shadow: `inset 0 1px 0 ${tint(0.14)}, inset 0 -1px 0 ${tint(0.05)}, 0 20px 40px -20px ${shade(0.7)}`,
    glows: [
      [0, 16, "82% 0%"],
      [1, 10, "8% 92%"],
      [3, 5, "45% 35%", "50% 40%"],
    ],
  },
};

/** Ambient glow colors per `glow` mode; slot 3 is the neutral sheen every mode keeps. */
const glowColors = (mode: string, custom: string): [string, string, string, string] => {
  const sheen = tint(1);
  if (mode === "neutral") return [sheen, sheen, sheen, sheen];
  if (mode === "custom") return [custom, custom, custom, sheen];
  return ["var(--rk-accent)", "var(--rk-chart-1)", "var(--rk-chart-3)", sheen];
};

const SOLID: CssVars = {
  "--rk-surface-alpha": null,
  "--rk-surface-filter": null,
  "--rk-surface-edge": null,
  "--rk-surface-sheen": null,
  "--rk-surface-shadow": null,
  "--rk-ambient": null,
};

export interface MaterialOptions {
  /** accent (default) | neutral | custom | off */
  glow?: string;
  glowColor?: string;
  /** Glow strength, % of the material's own (100 = as designed). */
  glowStrength?: number;
  /** Surface transparency, % of the material's own (0 = opaque, 100 = as designed). */
  transparency?: number;
  /** Surface blur, % of the material's own. */
  blur?: number;
  gradient?: BuiltinAppearanceValues["glow.gradient"];
  secondaryColor?: string;
  angle?: number;
  x?: number;
  y?: number;
  spread?: number;
  softness?: number;
  /** Reflection strength, %; independent of canvas glow. */
  reflection?: number;
  reflectionAngle?: number;
}

const bounded = (value: number | undefined, fallback: number, min: number, max: number) =>
  value === undefined || !Number.isFinite(value) ? fallback : Math.min(max, Math.max(min, value));

function ambientGradient(m: (typeof MATERIAL_SPECS)[string], o: MaterialOptions): string | null {
  const k = bounded(o.glowStrength, 100, 0, 250) / 100;
  if (o.glow === "off" || k === 0) return null;
  const colors = glowColors(o.glow ?? "accent", o.glowColor ?? "var(--rk-accent)");
  if (o.glow === "custom" && o.secondaryColor) colors[1] = o.secondaryColor;
  if (!o.gradient || o.gradient === "material")
    return (
      m.glows.map(([slot, pct, at, size]) => glow(colors[slot], round(pct * k), at, size)).join(", ") || null
    );
  const angle = bounded(o.angle, 145, 0, 360);
  const softness = bounded(o.softness, 70, 20, 100);
  const first = `color-mix(in oklab, ${colors[0]} ${round(16 * k)}%, transparent)`;
  const second = `color-mix(in oklab, ${colors[1]} ${round(12 * k)}%, transparent)`;
  if (o.gradient === "linear")
    return `linear-gradient(${angle}deg, ${first}, transparent ${softness}%, ${second})`;
  const x = bounded(o.x, 85, 0, 100);
  const y = bounded(o.y, 0, 0, 100);
  const spread = bounded(o.spread, 100, 40, 200) / 100;
  return `radial-gradient(${round(60 * spread)}% ${round(50 * spread)}% at ${x}% ${y}%, ${first}, transparent ${softness}%), radial-gradient(${round(55 * spread)}% ${round(45 * spread)}% at ${100 - x}% ${100 - y}%, ${second}, transparent ${softness}%)`;
}

/** CSS vars of a surface material, tuned by the Background / Surfaces settings. Unknown names fall back to solid. */
export function materialVars(name: string, o: MaterialOptions = {}): CssVars {
  const m = MATERIAL_SPECS[name];
  if (!m) return { ...SOLID };
  const ambient = ambientGradient(m, o);
  if (m.alpha === 100) return { ...SOLID, "--rk-ambient": ambient };
  const t = bounded(o.transparency, 100, 0, 150) / 100;
  const b = bounded(o.blur, 100, 0, 200) / 100;
  const reflection = bounded(o.reflection, 100, 0, 200) / 100;
  return {
    "--rk-surface-alpha": `${round(100 - (100 - m.alpha) * t)}%`,
    "--rk-surface-filter": `blur(${round(m.blur * b)}px) saturate(${m.saturate})`,
    "--rk-surface-edge": m.edge,
    "--rk-surface-sheen":
      (o.reflection === undefined || o.reflection === 100) &&
      (o.reflectionAngle === undefined || o.reflectionAngle === 145)
        ? m.sheen
        : reflection === 0
          ? "none"
          : `linear-gradient(${bounded(o.reflectionAngle, 145, 0, 360)}deg, ${tint(round(0.05 * reflection))}, transparent 65%)`,
    "--rk-surface-shadow": m.shadow,
    "--rk-ambient": ambient,
  };
}

/**
 * Surface materials as designed (no Background / Surfaces tuning): how cards sit on the page. Raw vars read
 * by card.css / layout.css with solid fallbacks, so `solid` is simply "nothing set". The ambient glow behind
 * the app is what glass refracts.
 */
export const MATERIALS: Record<string, CssVars> = Object.fromEntries(
  Object.keys(MATERIAL_SPECS).map((name) => [name, materialVars(name)]),
);

const fluent = (all: AppearanceValues) => all.style === "fluent";
const glassy = (all: AppearanceValues) => !fluent(all) && all.material !== "solid";
// quotes, backslashes and newlines would end the url() token early
const cssUrl = (src: string) => `url("${src.replace(/[\n\r]/g, "").replace(/["\\]/g, "\\$&")}")`;
const UNSAFE_COLOR = /[;{}\\]|url\s*\(|[\r\n]/i;

function accentLabel(color: Oklch): string {
  const [r, g, b] = oklchToLinearRgb(color).map((channel) => Math.max(0, Math.min(1, channel))) as [
    number,
    number,
    number,
  ];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const light = 1.05 / (luminance + 0.05);
  const dark = (luminance + 0.05) / (0.08 ** 3 + 0.05);
  return light >= dark ? "var(--rk-label-light)" : "var(--rk-label-dark)";
}

/** Built-in appearance schema. Projects append their own sections via `extensions`. */
export const APPEARANCE_SECTIONS: SettingsSection[] = [
  {
    id: "color",
    title: "Color",
    fields: [
      {
        key: "palette",
        type: "segmented",
        label: "Palette",
        default: "legacy",
        options: [
          { value: "legacy", label: "Graphite & Iris" },
          { value: "rain", label: "Rain" },
        ],
        dataAttr: "rk-palette",
      },
      {
        key: "accent",
        type: "color",
        label: "Accent",
        default: ACCENTS[0].value,
        swatches: ACCENTS,
        cssVar: "--rk-accent",
        apply: (v, all) => {
          const color = parseColor(String(v));
          const hover = color && {
            ...color,
            l: Math.max(0, color.l - (all.palette === "rain" ? 0.01 : 0.02)),
          };
          return {
            "--rk-accent": String(v),
            "--rk-accent-label": color ? accentLabel(color) : null,
            "--rk-accent-hover-label": hover ? accentLabel(hover) : null,
          };
        },
      },
      {
        key: "neutral",
        type: "select",
        label: "Surface tint",
        hint: "Hue of backgrounds and text",
        default: "graphite",
        options: Object.keys(NEUTRALS).map((k) => ({ value: k, label: k[0]?.toUpperCase() + k.slice(1) })),
        apply: (v) => {
          const [h, c] = NEUTRALS[String(v)] ?? NEUTRALS.graphite ?? [260, 0.012];
          return { "--rk-neutral-h": String(h), "--rk-neutral-c": String(c) };
        },
      },
    ],
  },
  {
    id: "shape",
    title: "Shape",
    fields: [
      {
        key: "style",
        type: "segmented",
        label: "Style",
        hint: "Fluent: flat Windows 10 panels in the same colors: small corners, accent bars mark the selection, no glass",
        default: "rootik",
        options: [
          { value: "rootik", label: "Rootik" },
          { value: "fluent", label: "Fluent" },
        ],
        dataAttr: "rk-style",
        // radius, material and glass read it
        apply: () => ({}),
      },
      {
        key: "radius",
        type: "slider",
        label: "Corner radius",
        default: 18,
        min: 0,
        max: 28,
        format: (v) => `${v}px`,
        visible: (all) => all.corners !== "square" && !fluent(all),
        apply: (v, all) => {
          const square = all.corners === "square";
          if (fluent(all) && !square) return { "--rk-radius": "4px", "--rk-radius-control": "2px" };
          const r = square ? 0 : Number(v);
          return {
            "--rk-radius": `${r}px`,
            "--rk-radius-control": all.pill && !square ? "999px" : `${Math.round(r * 0.55)}px`,
          };
        },
      },
      {
        key: "pill",
        type: "toggle",
        label: "Pill controls",
        hint: "Fully rounded buttons and inputs",
        default: false,
        visible: (all) => all.corners !== "square" && !fluent(all),
      },
      {
        key: "corners",
        type: "segmented",
        label: "Corners",
        hint: "Squircle: smoother curves where the browser supports corner-shape. Square: no rounding at all, buttons and circles included",
        default: "round",
        options: [
          { value: "round", label: "Round" },
          { value: "squircle", label: "Squircle" },
          { value: "square", label: "Square" },
        ],
        apply: (v) => ({
          "--rk-corner-shape": v === "squircle" ? "squircle" : "round",
          "--rk-roundness": v === "square" ? "0" : null,
          "--rk-linecap": v === "square" ? "butt" : null,
        }),
      },
      {
        key: "layout",
        type: "segmented",
        label: "Layout",
        hint: "Islands: every part is its own panel. Inset: sidebar and bars on the background, content in one block",
        default: "islands",
        options: [
          { value: "islands", label: "Islands" },
          { value: "inset", label: "Inset" },
        ],
        // read by AppShell, no CSS vars
        apply: () => ({}),
      },
      {
        key: "spacing",
        type: "segmented",
        label: "Panel spacing",
        hint: "Space between the app's panels and around the window edge. Flush: panels touch",
        default: "default",
        options: [
          { value: "flush", label: "Flush" },
          { value: "tight", label: "Tight" },
          { value: "default", label: "Default" },
          { value: "roomy", label: "Roomy" },
        ],
        apply: (v) => ({
          "--rk-shell-space": v === "flush" ? "0" : v === "tight" ? "0.5" : v === "roomy" ? "1.6" : null,
        }),
      },
      {
        key: "dock",
        type: "segmented",
        label: "Dock",
        hint: "Floating: a capsule over the content. Bar: a taskbar along the bottom edge",
        default: "float",
        options: [
          { value: "float", label: "Floating" },
          { value: "bar", label: "Bar" },
        ],
        // read by AppShell, no CSS vars
        apply: () => ({}),
      },
    ],
  },
  {
    id: "type",
    title: "Density & type",
    fields: [
      {
        key: "density",
        type: "segmented",
        label: "Density",
        default: "default",
        options: [
          { value: "compact", label: "Compact" },
          { value: "default", label: "Default" },
          { value: "comfortable", label: "Comfy" },
        ],
        apply: (v) => ({ "--rk-density": v === "compact" ? "0.86" : v === "comfortable" ? "1.14" : null }),
      },
      {
        key: "font",
        type: "select",
        label: "Font",
        default: "geist",
        options: [
          { value: "geist", label: "Geist" },
          { value: "inter", label: "Inter" },
          { value: "system", label: "System" },
          { value: "mono", label: "Mono" },
        ],
        apply: (v) => ({ "--rk-font-sans": FONTS[String(v)] ?? null }),
      },
      {
        key: "fontSize",
        type: "slider",
        label: "Text size",
        default: 13,
        min: 12,
        max: 16,
        step: 0.5,
        format: (v) => `${v}px`,
        cssVar: "--rk-font-size",
        unit: "px",
      },
    ],
  },
  {
    id: "background",
    title: "Background",
    fields: [
      {
        key: "glow",
        type: "segmented",
        label: "Glow",
        hint: "Ambient light behind translucent surfaces",
        default: "accent",
        options: [
          { value: "accent", label: "Accent" },
          { value: "neutral", label: "Neutral" },
          { value: "custom", label: "Custom" },
          { value: "off", label: "Off" },
        ],
        visible: (all) => !fluent(all),
        // material reads it
        apply: () => ({}),
        children: [
          {
            key: "glow.gradient",
            type: "segmented",
            label: "Gradient",
            default: "material",
            options: [
              { value: "material", label: "Material" },
              { value: "clouds", label: "Clouds" },
              { value: "linear", label: "Linear" },
            ],
            visible: (all) => all.glow !== "off",
          },
          {
            key: "glow.color",
            type: "color",
            label: "Color",
            default: ACCENTS[0].value,
            swatches: ACCENTS,
            visible: (all) => all.glow === "custom",
          },
          {
            key: "glow.secondary",
            type: "color",
            label: "Second color",
            default: "oklch(0.5 0.08 285)",
            swatches: ACCENTS,
            visible: (all) => all.glow === "custom" && all["glow.gradient"] !== "material",
          },
          {
            key: "glow.strength",
            type: "slider",
            label: "Strength",
            default: 100,
            min: 0,
            max: 250,
            step: 10,
            format: (v) => `${v}%`,
            visible: (all) => all.glow !== "off",
          },
          {
            key: "glow.angle",
            type: "slider",
            label: "Direction",
            default: 145,
            min: 0,
            max: 360,
            step: 5,
            format: (v) => `${v}°`,
            visible: (all) => all.glow !== "off" && all["glow.gradient"] === "linear",
          },
          ...(
            [
              ["x", "Horizontal origin", 85, 0, 100],
              ["y", "Vertical origin", 0, 0, 100],
              ["spread", "Spread", 100, 40, 200],
            ] as const
          ).map(
            ([key, label, value, min, max]): SettingsField => ({
              key: `glow.${key}`,
              type: "slider",
              label,
              default: value,
              min,
              max,
              step: 5,
              format: (v) => `${v}%`,
              visible: (all) => all.glow !== "off" && all["glow.gradient"] === "clouds",
            }),
          ),
          {
            key: "glow.softness",
            type: "slider",
            label: "Falloff",
            default: 70,
            min: 20,
            max: 100,
            step: 5,
            format: (v) => `${v}%`,
            visible: (all) => all.glow !== "off" && all["glow.gradient"] !== "material",
          },
        ],
      },
      {
        key: "backdrop",
        type: "text",
        label: "Image",
        hint: "URL behind the app (https:, data:, blob:, asset:). Dimmed so text on the canvas stays readable",
        default: "",
        placeholder: "https://",
        apply: (v, all) => {
          const src = String(v).trim();
          if (!src) return { "--rk-backdrop": null };
          const dim = shade(Number(all["backdrop.dim"] ?? 55) / 100);
          return { "--rk-backdrop": `linear-gradient(${dim}, ${dim}), ${cssUrl(src)}` };
        },
        children: [
          {
            key: "backdrop.dim",
            type: "slider",
            label: "Dim",
            default: 55,
            min: 0,
            max: 90,
            step: 5,
            format: (v) => `${v}%`,
          },
        ],
      },
    ],
  },
  {
    id: "effects",
    title: "Effects",
    fields: [
      {
        key: "material",
        type: "segmented",
        label: "Surfaces",
        hint: "How cards sit on the page: opaque, veiled or glass",
        default: "veil",
        options: [
          { value: "solid", label: "Solid" },
          { value: "veil", label: "Veil" },
          { value: "frost", label: "Frost" },
          { value: "liquid", label: "Liquid" },
        ],
        visible: (all) => !fluent(all),
        apply: (v, all) =>
          fluent(all)
            ? { ...SOLID }
            : materialVars(String(v), {
                glow: String(all.glow ?? "accent"),
                glowColor: String(all["glow.color"] ?? ACCENTS[0].value),
                glowStrength: Number(all["glow.strength"] ?? 100),
                transparency: Number(all["material.transparency"] ?? 100),
                blur: Number(all["material.blur"] ?? 100),
                gradient: all["glow.gradient"],
                secondaryColor: String(all["glow.secondary"] ?? "oklch(0.5 0.08 285)"),
                angle: Number(all["glow.angle"]),
                x: Number(all["glow.x"]),
                y: Number(all["glow.y"]),
                spread: Number(all["glow.spread"]),
                softness: Number(all["glow.softness"]),
                reflection: Number(all["material.reflection"]),
                reflectionAngle: Number(all["material.reflectionAngle"]),
              }),
        children: [
          {
            key: "material.reflection",
            type: "slider",
            label: "Reflection",
            default: 100,
            min: 0,
            max: 200,
            step: 5,
            hint: "Soft tinted light on the surface; independent of the background",
            format: (v) => `${v}%`,
            visible: glassy,
            children: [
              {
                key: "material.reflectionAngle",
                type: "slider",
                label: "Reflection direction",
                default: 145,
                min: 0,
                max: 360,
                step: 5,
                format: (v) => `${v}°`,
              },
            ],
          },
          {
            key: "material.transparency",
            type: "slider",
            label: "Transparency",
            hint: "Of the chosen material: 0% is opaque",
            default: 100,
            min: 0,
            max: 150,
            step: 5,
            format: (v) => `${v}%`,
            visible: glassy,
          },
          {
            key: "material.blur",
            type: "slider",
            label: "Blur",
            default: 100,
            min: 0,
            max: 200,
            step: 10,
            format: (v) => `${v}%`,
            visible: glassy,
          },
        ],
      },
      {
        key: "glass",
        type: "toggle",
        label: "Glass",
        hint: "Translucent blurred menus, dialogs and docks",
        default: true,
        visible: (all) => !fluent(all),
        apply: (v, all) => {
          const on = v && !fluent(all);
          return {
            "--rk-glass": on ? String(Number(all["glass.transparency"] ?? 100) / 100) : "0",
            "--rk-blur": on ? `${all["glass.blur"] ?? 20}px` : "0px",
          };
        },
        children: [
          {
            key: "glass.transparency",
            type: "slider",
            label: "Transparency",
            default: 100,
            min: 25,
            max: 300,
            step: 25,
            format: (v) => `${v}%`,
          },
          {
            key: "glass.blur",
            type: "slider",
            label: "Blur",
            default: 20,
            min: 4,
            max: 40,
            format: (v) => `${v}px`,
          },
        ],
      },
      {
        key: "motion",
        type: "segmented",
        label: "Motion",
        default: "system",
        options: [
          { value: "system", label: "System" },
          { value: "full", label: "Full" },
          { value: "off", label: "Off" },
        ],
        // "system" leaves --rk-motion to the prefers-reduced-motion rule in tokens.css
        apply: (v) => ({
          "--rk-motion": v === "full" ? "1" : v === "off" ? "0" : null,
          "--rk-animation-state": v === "full" ? "running" : v === "off" ? "paused" : null,
        }),
      },
    ],
  },
];

export function walkFields(sections: ReadonlyArray<SettingsSection>, visit: (field: SettingsField) => void) {
  const walk = (fields: ReadonlyArray<SettingsField>) => {
    for (const f of fields) {
      visit(f);
      if (f.children) walk(f.children);
    }
  };
  for (const s of sections) walk(s.fields);
}

export function defaultValues(sections: ReadonlyArray<SettingsSection>): AppearanceValues {
  const out: AppearanceValues = {};
  walkFields(sections, (f) => {
    out[f.key] = f.default;
  });
  return out;
}

export function toCssVars(sections: ReadonlyArray<SettingsSection>, values: AppearanceValues): CssVars {
  const out: CssVars = {};
  const effective = { ...defaultValues(sections), ...normalizeAppearanceValues(sections, values) };
  walkFields(sections, (f) => {
    const v = effective[f.key] ?? f.default;
    if (f.apply) Object.assign(out, f.apply(v, effective));
    else if (f.cssVar) out[f.cssVar] = typeof v === "number" ? `${v}${f.unit ?? ""}` : String(v);
  });
  return out;
}

/** Validate untrusted appearance values against the active schema, including consumer extensions. */
export function normalizeAppearanceValues(
  sections: ReadonlyArray<SettingsSection>,
  input: unknown,
): AppearanceValues {
  const out: AppearanceValues = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return out;
  const source = input as Record<string, unknown>;
  walkFields(sections, (field) => {
    if (!Object.hasOwn(source, field.key)) return;
    const value = source[field.key];
    switch (field.type) {
      case "toggle":
        if (typeof value === "boolean") out[field.key] = value;
        break;
      case "slider":
        if (typeof value === "number" && Number.isFinite(value))
          out[field.key] = Math.min(field.max, Math.max(field.min, value));
        break;
      case "select":
      case "segmented":
        if (typeof value === "string" && field.options.some((option) => option.value === value))
          out[field.key] = value;
        break;
      case "color":
        if (typeof value === "string" && !UNSAFE_COLOR.test(value)) {
          const color = parseColor(value);
          if (color) out[field.key] = formatOklch(color);
        }
        break;
      case "text":
        if (typeof value === "string") out[field.key] = value;
        break;
      case "custom":
        if (typeof value === typeof field.default && (typeof value !== "number" || Number.isFinite(value)))
          out[field.key] = value as SettingValue;
        break;
      default:
    }
  });
  return out;
}

/** Data attributes of fields with `dataAttr` (`{ "data-rk-style": "fluent" }`). */
export function toDataAttrs(sections: ReadonlyArray<SettingsSection>, values: AppearanceValues) {
  const out: Record<string, string> = {};
  walkFields(sections, (f) => {
    if (f.dataAttr) out[`data-${f.dataAttr}`] = String(values[f.key] ?? f.default);
  });
  return out;
}
