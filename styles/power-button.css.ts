import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-power", {
  position: "relative",
  display: "grid",
  placeItems: "center",
  flexShrink: "0",
  width: "var(--rk-power-size)",
  aspectRatio: "1",
  margin: "var(--rk-power-halo)",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.surface3}`,
  color: `${tokens.text2}`,
  fontSize: "calc(var(--rk-power-size) * 0.3)",
  cursor: "pointer",
  boxShadow: `inset 0 1px 0 oklch(${tokens.tint} / 0.12),
    0 0 0 var(--rk-power-halo) oklch(${tokens.tint} / 0.05)`,
  transition: `background-color ${tokens.durSlow} ${tokens.ease},
    color ${tokens.durSlow} ${tokens.ease},
    box-shadow ${tokens.durSlow} ${tokens.ease},
    scale ${tokens.dur} ${tokens.spring}`,
  vars: { "--rk-power-size": "112px", "--rk-power-halo": "calc(var(--rk-power-size) * 0.08)" },
});

globalStyle('.rk-power[data-size="sm"]', { vars: { "--rk-power-size": "72px" } });

globalStyle('.rk-power[data-size="xs"]', { vars: { "--rk-power-size": "52px" } });

globalStyle('.rk-power[data-size="lg"]', { vars: { "--rk-power-size": "148px" } });

globalStyle(".rk-power:hover", { color: `${tokens.text}` });

globalStyle(".rk-power:active", { scale: "var(--rk-button-press-scale, 0.96)" });

globalStyle(".rk-power:focus-visible", { outlineOffset: "-2px" });

globalStyle(".rk-power:disabled", { opacity: "0.45", cursor: "not-allowed" });

globalStyle('.rk-power[data-tone="danger"]:not([data-on])', {
  background: `color-mix(in oklab, ${tokens.danger} 14%, ${tokens.surface3})`,
  color: "var(--rk-tone-text)",
  boxShadow: `inset 0 1px 0 oklch(${tokens.tint} / 0.12),
      0 0 0 var(--rk-power-halo) color-mix(in oklab, ${tokens.danger} 10%, transparent)`,
});

globalStyle(".rk-power[data-on]", {
  background: `var(--rk-tone, ${tokens.accent})`,
  color: `var(--rk-on-tone, ${tokens.onAccent})`,
  boxShadow: `inset 0 1px 0 oklch(${tokens.tint} / 0.3),
      0 0 0 var(--rk-power-halo) color-mix(in oklab, var(--rk-tone, ${tokens.accent}) 16%, transparent),
      0 0 calc(var(--rk-power-size) * 0.45) calc(var(--rk-power-size) * -0.05)
      color-mix(in oklab, var(--rk-tone, ${tokens.accent}) 16%, transparent)`,
});

globalStyle(".rk-power[data-pending]::after", {
  content: '""',
  position: "absolute",
  inset: "calc(var(--rk-power-halo) * -1)",
  borderRadius: `${tokens.radiusRound}`,
  background: `conic-gradient(var(--rk-tone-text, ${tokens.accentText}) 0 18%, transparent 0)`,
  mask: "radial-gradient(closest-side, transparent calc(100% - 3px), black calc(100% - 2.5px))",
  animation: `rk-spin calc(${tokens.durSlow} * 3.5) linear infinite`,
  animationPlayState: `${tokens.animationState}`,
  pointerEvents: "none",
});

globalStyle(".rk-power-icon", { fontSize: "inherit" });

globalStyle('.rk-power[data-variant="signal"], .rk-power[data-variant="reactor"]', {
  isolation: "isolate",
  background: `linear-gradient(145deg, ${tokens.surface3}, ${tokens.well})`,
  color: `${tokens.text2}`,
  boxShadow: `inset 0 0 0 1px ${tokens.controlEdge}, ${tokens.shadow1}`,
  scale: "none",
  outlineOffset: "-2px",
});
globalStyle('.rk-power:is([data-variant="signal"], [data-variant="reactor"])[data-on]', {
  color: `${tokens.accentText}`,
  background: `linear-gradient(145deg, ${tokens.accentSoft}, ${tokens.surface2})`,
  boxShadow: `inset 0 0 0 1px ${tokens.accentLine}, ${tokens.shadow1}`,
});
globalStyle('.rk-power[data-variant="reactor"]', { borderRadius: `${tokens.radiusLg}` });
globalStyle('.rk-power:is([data-variant="signal"], [data-variant="reactor"])[data-pending]::after', {
  display: "none",
});
globalStyle(".rk-power-dial, .rk-power-orbit", {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  borderRadius: "inherit",
  overflow: "hidden",
});
globalStyle(".rk-power-dial svg, .rk-power-orbit svg", { display: "block", width: "100%", height: "100%" });
globalStyle(".rk-power-track, .rk-power-ticks, .rk-power-status", {
  fill: "none",
  stroke: `${tokens.controlEdge}`,
  strokeWidth: "1",
  transition: `stroke ${tokens.durSlow} ${tokens.ease}, stroke-dashoffset ${tokens.durSlow} ${tokens.ease}, opacity ${tokens.dur} ${tokens.ease}`,
});
globalStyle(".rk-power-track", { opacity: 0.4 });
globalStyle(".rk-power-ticks", { strokeDasharray: "1 4", strokeWidth: "3", opacity: 0.5 });
globalStyle(".rk-power-status", {
  stroke: `${tokens.accentText}`,
  strokeWidth: "1.8",
  strokeDasharray: "100",
  strokeDashoffset: "100",
  transform: "rotate(-90deg)",
  transformOrigin: "center",
});
globalStyle(".rk-power[data-on] .rk-power-status", { strokeDashoffset: "0" });
globalStyle(".rk-power[data-pending] .rk-power-status", { strokeDashoffset: "72" });
globalKeyframes("rk-power-contour", {
  from: { strokeDashoffset: "0" },
  to: { strokeDashoffset: "-100" },
});
globalStyle('.rk-power[data-variant="reactor"] .rk-power-status', {
  transform: "none",
  strokeLinejoin: "round",
});
globalStyle('.rk-power[data-variant="reactor"][data-pending] .rk-power-status', {
  strokeDasharray: "24 76",
  strokeDashoffset: "0",
  transition: "none",
  animation: `rk-power-contour calc(${tokens.durSlow} * 5) linear infinite`,
  animationPlayState: `${tokens.animationState}`,
  "@media": { "(prefers-reduced-motion: reduce), (forced-colors: active)": { animation: "none" } },
});
globalStyle(".rk-power[data-on] .rk-power-ticks", { stroke: `${tokens.accentText}`, opacity: 0.8 });
globalStyle(".rk-power-orbit", {
  opacity: 0,
  color: `${tokens.accentText}`,
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});
globalStyle(".rk-power-orbit circle", { fill: "currentColor" });
globalStyle(".rk-power[data-pending] > .rk-power-orbit", {
  opacity: 1,
  animation: `rk-spin calc(${tokens.durSlow} * 5) linear infinite`,
  animationPlayState: `${tokens.animationState}`,
});
globalStyle(".rk-power > .rk-power-icon", { position: "relative", zIndex: 1 });
