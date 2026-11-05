type Color = readonly [number, number, number];

interface PaletteMode {
  canvas: Color;
  surface: Color;
  raised: Color;
  well: Color;
  action: Color;
  secondary: Color;
  detail: Color;
}

interface Palette {
  id: string;
  name: string;
  copy: string;
  description: string;
  light: PaletteMode;
  dark: PaletteMode;
}

export const SIGNAL_PALETTES = [
  {
    id: "cobalt",
    name: "Cobalt",
    copy: "Steel · cobalt · ice",
    description: "Холодная сталь и насыщенный синий. Базовая рабочая тема.",
    light: {
      canvas: [0.935, 0.012, 250],
      surface: [0.967, 0.007, 250],
      raised: [0.995, 0.003, 250],
      well: [0.945, 0.01, 250],
      action: [0.46, 0.17, 260],
      secondary: [0.43, 0.065, 220],
      detail: [0.47, 0.04, 260],
    },
    dark: {
      canvas: [0.17, 0.016, 255],
      surface: [0.235, 0.021, 255],
      raised: [0.29, 0.024, 255],
      well: [0.2, 0.018, 255],
      action: [0.75, 0.12, 255],
      secondary: [0.77, 0.075, 220],
      detail: [0.75, 0.045, 260],
    },
  },
  {
    id: "albedo",
    name: "Albedo",
    copy: "Porcelain · obsidian · gold",
    description: "Нейтральный фарфор и обсидиан. Золото только в деталях.",
    light: {
      canvas: [0.94, 0.003, 285],
      surface: [0.978, 0.002, 285],
      raised: [0.998, 0.001, 285],
      well: [0.953, 0.003, 285],
      action: [0.27, 0.018, 285],
      secondary: [0.46, 0.085, 85],
      detail: [0.45, 0.07, 295],
    },
    dark: {
      canvas: [0.19, 0.004, 285],
      surface: [0.255, 0.006, 285],
      raised: [0.315, 0.008, 285],
      well: [0.22, 0.005, 285],
      action: [0.89, 0.008, 85],
      secondary: [0.78, 0.09, 85],
      detail: [0.76, 0.08, 295],
    },
  },
  {
    id: "makima",
    name: "Makima",
    copy: "Rose stone · cinnabar · charcoal",
    description: "Розоватый камень, киноварь и холодный угольный. Без кремовой подложки.",
    light: {
      canvas: [0.925, 0.018, 355],
      surface: [0.965, 0.01, 355],
      raised: [0.992, 0.004, 355],
      well: [0.94, 0.014, 355],
      action: [0.46, 0.15, 26],
      secondary: [0.43, 0.06, 235],
      detail: [0.46, 0.075, 50],
    },
    dark: {
      canvas: [0.165, 0.01, 265],
      surface: [0.235, 0.012, 335],
      raised: [0.29, 0.015, 345],
      well: [0.205, 0.01, 265],
      action: [0.75, 0.115, 26],
      secondary: [0.77, 0.065, 235],
      detail: [0.78, 0.075, 55],
    },
  },
  {
    id: "miyabi",
    name: "Miyabi",
    copy: "Sea glass · midnight · vermilion",
    description: "Морское стекло и ночной индиго. Киноварь — тонкая деталь графики.",
    light: {
      canvas: [0.9, 0.022, 190],
      surface: [0.95, 0.014, 190],
      raised: [0.985, 0.006, 190],
      well: [0.925, 0.018, 190],
      action: [0.35, 0.075, 265],
      secondary: [0.41, 0.075, 185],
      detail: [0.46, 0.13, 25],
    },
    dark: {
      canvas: [0.155, 0.028, 265],
      surface: [0.215, 0.034, 260],
      raised: [0.28, 0.035, 250],
      well: [0.185, 0.03, 265],
      action: [0.79, 0.09, 190],
      secondary: [0.76, 0.055, 225],
      detail: [0.77, 0.1, 25],
    },
  },
  {
    id: "hoshino",
    name: "Hoshino",
    copy: "Lilac · plum · rose",
    description: "Лиловые поверхности, глубокий сливовый и приглушённая роза.",
    light: {
      canvas: [0.925, 0.023, 305],
      surface: [0.965, 0.014, 305],
      raised: [0.992, 0.004, 305],
      well: [0.942, 0.019, 305],
      action: [0.43, 0.155, 305],
      secondary: [0.44, 0.105, 345],
      detail: [0.43, 0.075, 225],
    },
    dark: {
      canvas: [0.195, 0.022, 310],
      surface: [0.26, 0.026, 310],
      raised: [0.32, 0.029, 310],
      well: [0.225, 0.023, 310],
      action: [0.78, 0.115, 305],
      secondary: [0.79, 0.1, 345],
      detail: [0.78, 0.075, 225],
    },
  },
  {
    id: "maomao",
    name: "Maomao",
    copy: "Celadon · jade · plum",
    description: "Селадон, нефрит и приглушённая слива. Зелёная тема с прохладным характером.",
    light: {
      canvas: [0.925, 0.019, 155],
      surface: [0.964, 0.014, 155],
      raised: [0.992, 0.004, 155],
      well: [0.943, 0.018, 155],
      action: [0.4, 0.09, 160],
      secondary: [0.45, 0.075, 315],
      detail: [0.46, 0.07, 80],
    },
    dark: {
      canvas: [0.18, 0.02, 165],
      surface: [0.24, 0.025, 165],
      raised: [0.3, 0.028, 165],
      well: [0.21, 0.021, 165],
      action: [0.78, 0.095, 165],
      secondary: [0.77, 0.08, 315],
      detail: [0.79, 0.08, 80],
    },
  },
] as const satisfies readonly Palette[];

export type SignalPaletteId = (typeof SIGNAL_PALETTES)[number]["id"];
export const paletteColor = ([l, c, h]: Color) => `oklch(${l} ${c} ${h})`;

/** Shared by static CSS extraction and contrast checks; each mode has its own material recipe. */
export function signalPaletteVars(palette: Palette, mode: "light" | "dark"): Record<string, string> {
  const dark = mode === "dark";
  const colors = palette[mode];
  const page = paletteColor([dark ? 0.175 : 0.962, 0.001, 265]);
  const [, chroma, hue] = colors.canvas;
  const neutral = Math.min(chroma, 0.018);
  const text = (l: number) => paletteColor([l, neutral, hue]);
  return {
    "--rk-bg": page,
    "--rk-neutral-h": String(hue),
    "--rk-neutral-c": String(neutral),
    "--rk-surface-1": paletteColor(colors.surface),
    "--rk-surface-2": paletteColor(colors.raised),
    "--rk-surface-3": paletteColor(colors.surface),
    "--rk-surface-4": `color-mix(in oklab, ${paletteColor(colors.action)} 7%, ${paletteColor(colors.raised)})`,
    "--rk-well": paletteColor(colors.well),
    "--rk-sunken": paletteColor(colors.well),
    "--rk-accent": paletteColor(colors.action),
    "--rk-accent-text": paletteColor(colors.action),
    "--rk-on-accent": text(dark ? 0.17 : 0.995),
    "--rk-text": text(dark ? 0.95 : 0.24),
    "--rk-text-2": text(dark ? 0.82 : 0.38),
    "--rk-text-3": text(dark ? 0.73 : 0.44),
    "--rk-control-edge": text(dark ? 0.66 : 0.51),
    "--rk-inverse": text(dark ? 0.93 : 0.26),
    "--rk-on-inverse": text(dark ? 0.2 : 0.985),
    "--rk-line": `color-mix(in oklab, ${text(dark ? 0.78 : 0.42)} 24%, transparent)`,
    "--rk-tint": `${dark ? 0.94 : 0.995} ${neutral} ${hue}`,
    "--rk-shade": `${dark ? 0.08 : 0.24} ${neutral} ${hue}`,
    "--rk-danger": paletteColor([dark ? 0.76 : 0.46, dark ? 0.13 : 0.15, 25]),
    "--rk-success": paletteColor([dark ? 0.77 : 0.42, 0.095, 155]),
    "--rk-warn": paletteColor([dark ? 0.82 : 0.45, 0.095, 75]),
    ...Object.fromEntries(
      [250, 45, 185, 300, 135, 355].map((h, i) => [
        `--rk-chart-${i + 1}`,
        paletteColor([dark ? 0.66 : 0.46, dark ? 0.105 : 0.1, h]),
      ]),
    ),
    "--rk-syntax-string": paletteColor([dark ? 0.78 : 0.4, 0.075, 185]),
    "--rk-syntax-number": paletteColor([dark ? 0.8 : 0.43, 0.085, 65]),
    "--rk-syntax-boolean": paletteColor([dark ? 0.8 : 0.43, 0.1, 300]),
    "--rk-qr-plate": paletteColor([0.995, 0.001, 265]),
    "--rk-qr-ink": paletteColor([0.13, 0.01, 265]),
    "--rk-chart-grid": `color-mix(in oklab, ${text(dark ? 0.78 : 0.42)} 20%, transparent)`,
    "--rk-chart-idle": paletteColor(colors.well),
    "--rk-chart-on-fill": paletteColor([dark ? 0.13 : 0.995, 0.001, 250]),
    "--rk-chart-seq-lo": paletteColor([0.26, 0.035, 250]),
    "--rk-chart-seq-hi": paletteColor([0.86, 0.12, 250]),
    "--rk-chart-seq-text-lo": paletteColor([0.995, 0.001, 250]),
    "--rk-chart-seq-text-hi": paletteColor([0.07, 0.001, 250]),
    "--rk-info": paletteColor([dark ? 0.78 : 0.45, 0.11, 250]),
    "--rk-secondary": paletteColor(colors.secondary),
    "--rk-detail": paletteColor(colors.detail),
    "--rk-svg-shadow": text(dark ? 0.08 : 0.28),
    "--rk-svg-fill": paletteColor(colors.raised),
    "--rk-svg-fill-low": paletteColor(colors.surface),
    "--rk-svg-edge-top": `color-mix(in oklab, ${text(dark ? 0.7 : 0.995)} ${dark ? 38 : 88}%, transparent)`,
    "--rk-material-edge": `color-mix(in oklab, ${text(dark ? 0.7 : 0.45)} 35%, transparent)`,
    "--rk-svg-edge": `color-mix(in oklab, ${text(dark ? 0.68 : 0.45)} ${dark ? 32 : 45}%, transparent)`,
    "--rk-stage": paletteColor(colors.canvas),
    "--rk-wash": `color-mix(in oklab, ${paletteColor(colors.raised)} ${dark ? 42 : 65}%, ${paletteColor(colors.canvas)})`,
    "--rk-relief-shadow": `color-mix(in oklab, ${text(dark ? 0.08 : 0.4)} ${dark ? 55 : 20}%, transparent)`,
    "--rk-relief-light": `color-mix(in oklab, ${text(dark ? 0.65 : 0.995)} ${dark ? 17 : 85}%, transparent)`,
  };
}
