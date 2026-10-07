import type { ReactNode } from "react";

export type SettingValue = string | number | boolean;
export type AppearanceValues = Record<string, SettingValue>;
/** CSS custom properties to write; `null` removes a property (falls back to tokens.css). */
export type CssVars = Record<string, string | null>;

export const THEMES = {
  iris: { accent: "oklch(0.57 0.2 277)", neutral: "graphite", material: "veil", radius: 18 },
  ocean: { accent: "oklch(0.58 0.14 245)", neutral: "slate", material: "frost", radius: 16 },
  ember: { accent: "oklch(0.6 0.19 35)", neutral: "mocha", material: "solid", radius: 12 },
  mono: { accent: "oklch(0.94 0 0)", neutral: "zinc", material: "solid", radius: 8 },
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

/**
 * Accent presets. Mid-lightness ones carry white labels, light ones dark labels (--rk-on-accent flips at
 * L 0.73); every preset keeps its label at WCAG >= 4.1 / APCA |Lc| >= 71 on the fill.
 */
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
}

/** CSS vars of a surface material, tuned by the Background / Surfaces settings. Unknown names fall back to solid. */
export function materialVars(name: string, o: MaterialOptions = {}): CssVars {
  const m = MATERIAL_SPECS[name];
  if (!m || m.alpha === 100) return { ...SOLID };
  const t = (o.transparency ?? 100) / 100;
  const b = (o.blur ?? 100) / 100;
  const k = (o.glowStrength ?? 100) / 100;
  const colors = glowColors(o.glow ?? "accent", o.glowColor ?? "var(--rk-accent)");
  const ambient =
    o.glow === "off" || k <= 0
      ? null
      : m.glows.map(([slot, pct, at, size]) => glow(colors[slot], round(pct * k), at, size)).join(", ");
  return {
    "--rk-surface-alpha": `${round(100 - (100 - m.alpha) * t)}%`,
    "--rk-surface-filter": `blur(${round(m.blur * b)}px) saturate(${m.saturate})`,
    "--rk-surface-edge": m.edge,
    "--rk-surface-sheen": m.sheen,
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

/** Built-in appearance schema. Projects append their own sections via `extensions`. */
export const APPEARANCE_SECTIONS: SettingsSection[] = [
  {
    id: "color",
    title: "Color",
    fields: [
      {
        key: "accent",
        type: "color",
        label: "Accent",
        default: ACCENTS[0].value,
        swatches: ACCENTS,
        cssVar: "--rk-accent",
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
        visible: glassy,
        // material reads it
        apply: () => ({}),
        children: [
          {
            key: "glow.color",
            type: "color",
            label: "Color",
            default: ACCENTS[0].value,
            swatches: ACCENTS,
            visible: (all) => all.glow === "custom",
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
              }),
        children: [
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
        apply: (v) => ({ "--rk-motion": v === "full" ? "1" : v === "off" ? "0" : null }),
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
  walkFields(sections, (f) => {
    const v = values[f.key] ?? f.default;
    if (f.apply) Object.assign(out, f.apply(v, values));
    else if (f.cssVar) out[f.cssVar] = typeof v === "number" ? `${v}${f.unit ?? ""}` : String(v);
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
