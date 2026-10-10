import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-color-picker", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  width: "256px",
  maxWidth: "100%",
  vars: {
    "--rk-cp-checker": `repeating-conic-gradient(${tokens.surface4} 0 25%, ${tokens.surface2} 0 50%) 0 0 / 8px 8px`,
  },
});

globalStyle(".rk-cp-area", {
  position: "relative",
  aspectRatio: "3 / 2",
  borderRadius: `${tokens.radiusMd}`,
  backgroundColor: `${tokens.surface1}`,
  backgroundImage: `${tokens.hatch}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  touchAction: "none",
  cursor: "crosshair",
});

globalStyle(".rk-cp-canvas", {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
});

globalStyle(".rk-cp-thumb", {
  position: "absolute",
  width: "16px",
  height: "16px",
  borderRadius: `${tokens.radiusRound}`,
  translate: "-50% -50%",
  background: "var(--rk-cp-opaque)",
  boxShadow: `0 0 0 2px ${tokens.inverse},
    0 1px 6px 1px oklch(${tokens.shade} / 0.6)`,
  outlineOffset: "3px",
});

globalStyle(".rk-cp-thumb[data-outside]", {
  boxShadow: `0 0 0 2px ${tokens.inverse},
      0 0 0 4px ${tokens.warn},
      0 1px 6px 1px oklch(${tokens.shade} / 0.6)`,
});

globalStyle(".rk-cp-row", { display: "flex", alignItems: "center", gap: `calc(${tokens.space} * 2)` });

globalStyle(".rk-cp-preview", {
  flex: "none",
  width: "32px",
  height: "32px",
  borderRadius: `${tokens.radiusSm}`,
  background: "linear-gradient(var(--rk-cp-color), var(--rk-cp-color)), var(--rk-cp-checker)",
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(".rk-cp-sliders", {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 2)`,
  minWidth: "0",
});

globalStyle(".rk-cp-slider", {
  appearance: "none",
  display: "block",
  width: "100%",
  height: "12px",
  margin: "0",
  borderRadius: `${tokens.radiusPill}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  cursor: "pointer",
});

globalStyle('.rk-cp-slider[data-kind="hue"]', { background: "linear-gradient(to right, var(--rk-cp-hues))" });

globalStyle('.rk-cp-slider[data-kind="alpha"]', {
  background: "linear-gradient(to right, transparent, var(--rk-cp-opaque)), var(--rk-cp-checker)",
});

globalStyle(".rk-cp-slider::-webkit-slider-thumb", {
  appearance: "none",
  width: "14px",
  height: "14px",
  borderRadius: `${tokens.radiusRound}`,
  background: "transparent",
  boxShadow: `0 0 0 2px ${tokens.inverse},
      0 1px 4px oklch(${tokens.shade} / 0.6)`,
});

globalStyle(".rk-cp-slider::-moz-range-thumb", {
  width: "14px",
  height: "14px",
  border: "0",
  borderRadius: `${tokens.radiusRound}`,
  background: "transparent",
  boxShadow: `0 0 0 2px ${tokens.inverse},
      0 1px 4px oklch(${tokens.shade} / 0.6)`,
});

globalStyle(".rk-cp-slider:focus-visible", { outlineOffset: "3px" });

globalStyle(".rk-cp-text", { flex: "1" });
