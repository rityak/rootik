import { globalStyle } from "@vanilla-extract/css";
import { SIGNAL_PALETTES, signalPaletteVars } from "../src/theme/palettes";

for (const palette of SIGNAL_PALETTES) {
  for (const mode of ["light", "dark"] as const) {
    const selector = `[data-rk-palette="${palette.id}"]${mode === "light" ? '[data-rk-mode="light"]' : ':not([data-rk-mode="light"])'}`;
    const vars = signalPaletteVars(palette, mode);
    globalStyle(selector, {
      colorScheme: mode,
      color: "var(--rk-text)",
      vars: {
        ...vars,
        "--rk-accent-label": vars["--rk-on-accent"] ?? "",
        "--rk-accent-hover-label": vars["--rk-on-accent"] ?? "",
        "--rk-on-accent-hover": vars["--rk-on-accent"] ?? "",
        "--rk-accent-hover": "oklch(from var(--rk-accent) calc(l - 0.035) c h)",
        "--rk-accent-soft": "color-mix(in oklab, var(--rk-accent) 12%, transparent)",
        "--rk-accent-line": "var(--rk-accent)",
        "--rk-focus": "var(--rk-accent)",
        "--rk-hover": "color-mix(in oklab, var(--rk-secondary) 12%, transparent)",
        "--rk-press": "color-mix(in oklab, var(--rk-secondary) 20%, transparent)",
        "--rk-line-strong": "var(--rk-control-edge)",
        "--rk-on-danger": vars["--rk-on-accent"] ?? "",
        "--rk-svg-pattern-color": "var(--rk-text-3)",
        "--rk-svg-blur": "7px",
        "--rk-button-press-scale": "1",
        "--rk-button-primary-shadow": "var(--rk-shadow-1)",
      },
    });
    globalStyle(`${selector} .rk-shell`, {
      fontFamily: "var(--rk-font-sans)",
      fontSynthesis: "none",
      fontOpticalSizing: "auto",
      lineHeight: 1.55,
      letterSpacing: "normal",
    });
    globalStyle(`${selector} .rk-shell[data-variant="inset"]`, {
      vars: { "--rk-shell-space": "0" },
      borderRadius: "0",
    });
    globalStyle(`${selector} .rk-page-title`, {
      fontFamily: "var(--rk-font-display, var(--rk-font-sans))",
      fontWeight: 550,
      lineHeight: 1.18,
      letterSpacing: "-.025em",
    });
    globalStyle(`${selector} .rk-page-desc`, { lineHeight: 1.6, color: "var(--rk-text-2)" });
    globalStyle(`${selector} .rk-button`, {
      vars: { "--rk-button-tone-text": "var(--rk-tone)" },
    });
    globalStyle(`${selector} .rk-field-error`, { color: "var(--rk-danger)" });
    globalStyle(`${selector} .rk-swatch:hover`, { scale: "1" });
    globalStyle(`${selector} .rk-slider-input:active::-webkit-slider-thumb`, { scale: "1" });
    globalStyle(`${selector} .rk-power`, { boxShadow: "inset 0 0 0 1px var(--rk-control-edge)" });
    globalStyle(`${selector} .rk-power[data-on]`, {
      boxShadow: "inset 0 0 0 1px var(--rk-accent), var(--rk-shadow-1)",
    });
    globalStyle(`${selector} :is(.rk-select-list, .rk-combobox-list, .rk-token-list)`, {
      background: "color-mix(in oklab, var(--rk-surface-2) 90%, var(--rk-glass-bg))",
    });
  }
}
