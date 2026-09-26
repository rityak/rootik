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

/**
 * Surface materials: how cards sit on the page. Raw vars read by card.css / layout.css with solid
 * fallbacks, so `solid` is simply "nothing set". The ambient glow behind the app is what glass refracts.
 */
export const MATERIALS: Record<string, CssVars> = {
  solid: {
    "--rk-surface-alpha": null,
    "--rk-surface-filter": null,
    "--rk-surface-edge": null,
    "--rk-surface-sheen": null,
    "--rk-surface-shadow": null,
    "--rk-ambient": null,
  },
  veil: {
    "--rk-surface-alpha": "80%",
    "--rk-surface-filter": "blur(10px) saturate(1.25)",
    "--rk-surface-edge": `linear-gradient(150deg, ${tint(0.16)}, ${tint(0.03)} 45%, ${tint(0.08)})`,
    "--rk-surface-sheen": null,
    "--rk-surface-shadow": `0 1px 2px ${shade(0.3)}`,
    "--rk-ambient": [
      glow("var(--rk-accent)", 14, "85% -10%", "60% 45%"),
      glow("var(--rk-chart-1)", 10, "0% 100%", "50% 40%"),
    ].join(", "),
  },
  frost: {
    "--rk-surface-alpha": "58%",
    "--rk-surface-filter": "blur(22px) saturate(1.5)",
    "--rk-surface-edge": `linear-gradient(160deg, ${tint(0.22)}, ${tint(0.04)} 40%, ${tint(0.1)})`,
    "--rk-surface-sheen": `linear-gradient(180deg, ${tint(0.05)}, transparent 30%)`,
    "--rk-surface-shadow": `0 12px 32px -16px ${shade(0.6)}`,
    "--rk-ambient": [
      glow("var(--rk-accent)", 24, "85% 0%"),
      glow("var(--rk-chart-1)", 18, "5% 95%"),
      glow("var(--rk-chart-3)", 10, "45% 60%", "40% 35%"),
    ].join(", "),
  },
  // glass character (high transparency, specular rim, sheen) with a restrained, mostly neutral backdrop:
  // saturate() stays low so the glow isn't amplified into a neon wash
  liquid: {
    "--rk-surface-alpha": "40%",
    "--rk-surface-filter": "blur(26px) saturate(1.15)",
    "--rk-surface-edge": `linear-gradient(135deg, ${tint(0.3)}, ${tint(0.05)} 30%, ${tint(0.02)} 60%, ${tint(0.14)})`,
    "--rk-surface-sheen": `radial-gradient(120% 60% at 0% 0%, ${tint(0.07)}, transparent 50%), linear-gradient(180deg, ${tint(0.04)}, transparent 35%)`,
    "--rk-surface-shadow": `inset 0 1px 0 ${tint(0.14)}, inset 0 -1px 0 ${tint(0.05)}, 0 20px 40px -20px ${shade(0.7)}`,
    "--rk-ambient": [
      glow("var(--rk-accent)", 16, "82% 0%"),
      glow("var(--rk-chart-1)", 10, "8% 92%"),
      glow(tint(1), 5, "45% 35%", "50% 40%"),
    ].join(", "),
  },
};

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
        key: "radius",
        type: "slider",
        label: "Corner radius",
        default: 18,
        min: 0,
        max: 28,
        format: (v) => `${v}px`,
        apply: (v, all) => ({
          "--rk-radius": `${v}px`,
          "--rk-radius-control": all.pill ? "999px" : `${Math.round(Number(v) * 0.55)}px`,
        }),
      },
      {
        key: "pill",
        type: "toggle",
        label: "Pill controls",
        hint: "Fully rounded buttons and inputs",
        default: false,
      },
      {
        key: "corners",
        type: "segmented",
        label: "Corners",
        hint: "Squircle: smoother, continuous curves where the browser supports corner-shape",
        default: "round",
        options: [
          { value: "round", label: "Round" },
          { value: "squircle", label: "Squircle" },
        ],
        cssVar: "--rk-corner-shape",
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
        apply: (v) => MATERIALS[String(v)] ?? MATERIALS.solid ?? {},
      },
      {
        key: "glass",
        type: "toggle",
        label: "Glass",
        hint: "Translucent blurred menus, dialogs and docks",
        default: true,
        apply: (v, all) => ({
          "--rk-glass": v ? "1" : "0",
          "--rk-blur": v ? `${all["glass.blur"] ?? 20}px` : "0px",
        }),
        children: [
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
