import { globalStyle, keyframes } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

const draw = keyframes({ from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } });
globalStyle(".rk-chart-panel-content", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 5)`,
  minWidth: 0,
});
globalStyle(".rk-chart-panel-heading", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "start",
  justifyContent: "space-between",
  gap: `calc(${tokens.space} * 3)`,
});
globalStyle(".rk-chart-panel-caption", { flex: "1 1 160px", minWidth: 0 });
globalStyle(".rk-chart-panel-caption h3", {
  margin: 0,
  fontSize: tokens.textMd,
  fontWeight: 550,
  lineHeight: 1.4,
  letterSpacing: "-.02em",
});
globalStyle(".rk-chart-panel-caption p", {
  margin: `${tokens.space} 0 0`,
  color: tokens.text3,
  fontSize: tokens.textXs,
  lineHeight: 1.5,
});
globalStyle(".rk-chart-panel-actions", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: tokens.space,
});
globalStyle(".rk-chart-panel-summary", { color: tokens.text, fontVariantNumeric: "tabular-nums" });
globalStyle(".rk-chart-panel-body", { position: "relative", minWidth: 0, isolation: "isolate" });
globalStyle('.rk-chart-panel[data-animation="once"] .rk-chart-line', {
  strokeDasharray: 1,
  strokeDashoffset: 0,
  animation: `${draw} calc(${tokens.durSlow} * 2) ${tokens.easeOut} backwards`,
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
    "(forced-colors: active)": { animation: "none" },
  },
});
globalStyle('.rk-chart-panel[data-animation="once"] .rk-chart-line', {
  "@supports": { "not (stroke-dasharray: 1)": { animation: "none" } },
});
globalStyle(".rk-chart-panel .rk-gauge", { maxWidth: "100%" });
globalStyle(".rk-chart-panel .rk-heatmap-scale", { flexWrap: "wrap", minWidth: 0 });
globalStyle(".rk-chart-panel .rk-heatmap-ramp", { width: `calc(${tokens.space} * 16)` });
globalStyle(".rk-chart-panel .rk-bars-row", { minWidth: 0 });
