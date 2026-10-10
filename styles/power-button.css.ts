import { globalStyle } from "@vanilla-extract/css";
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

globalStyle(".rk-power:active", { scale: "0.96" });

globalStyle(".rk-power:focus-visible", { outlineOffset: "calc(var(--rk-power-halo) + 3px)" });

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
