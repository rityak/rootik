import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-spinner", {
  display: "inline-block",
  flexShrink: "0",
  width: "var(--rk-size)",
  height: "var(--rk-size)",
  borderRadius: `${tokens.radiusRound}`,
  border: "2px solid color-mix(in oklab, currentColor 22%, transparent)",
  borderTopColor: "currentColor",
  animation: `rk-spin calc(${tokens.durSlow} * 2.1875) linear infinite`,
  animationPlayState: `${tokens.animationState}`,
  vars: { "--rk-size": "16px" },
});

globalStyle(".rk-progress", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 1.5)`,
  minWidth: "0",
  vars: { "--rk-progress-h": "6px" },
});

globalStyle('.rk-progress[data-size="sm"]', { vars: { "--rk-progress-h": "3px" } });

globalStyle('.rk-progress[data-size="lg"]', { vars: { "--rk-progress-h": "10px" } });

globalStyle('.rk-progress[data-variant="edge"]', {
  position: "absolute",
  inset: "0",
  zIndex: "1",
  display: "block",
  overflow: "clip",
  borderRadius: `var(--rk-card-r, ${tokens.radiusLg})`,
  pointerEvents: "none",
});

globalStyle('.rk-progress[data-variant="edge"] .rk-progress-track', {
  position: "absolute",
  inset: "auto 0 0",
  height: "3px",
  borderRadius: "0",
  background: "none",
});

globalStyle('.rk-progress[data-variant="edge"] .rk-progress-bar', { borderRadius: "0", boxShadow: "none" });

globalStyle(".rk-progress-head", {
  display: "flex",
  justifyContent: "space-between",
  gap: `${tokens.space}`,
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-progress-track", {
  position: "relative",
  height: "var(--rk-progress-h)",
  overflow: "hidden",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.hatch}, color-mix(in oklab, ${tokens.surface3} 70%, transparent)`,
});

globalStyle(".rk-progress-bar", {
  height: "100%",
  borderRadius: "inherit",
  background: "var(--rk-tone)",
  boxShadow: "0 0 12px -2px color-mix(in oklab, var(--rk-tone) 60%, transparent)",
  transition: `width ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle("[data-indeterminate] > .rk-progress-bar", {
  width: `calc(100% - 65% * ${tokens.motion})`,
  opacity: `calc(0.35 + 0.65 * ${tokens.motion})`,
  animation: `rk-indeterminate calc(${tokens.durSlow} * 4) ${tokens.ease} infinite`,
  animationPlayState: `${tokens.animationState}`,
});

globalKeyframes("rk-indeterminate", { from: { translate: "-100% 0" }, to: { translate: "300% 0" } });
globalStyle(".rk-ring", {
  position: "relative",
  display: "inline-grid",
  placeItems: "center",
  flexShrink: "0",
});

globalStyle(".rk-ring svg", { position: "absolute", inset: "0", rotate: "-90deg" });

globalStyle(".rk-ring circle", { fill: "none" });

globalStyle(".rk-ring-track", { stroke: `${tokens.surface3}` });

globalStyle(".rk-ring-bar", {
  stroke: "var(--rk-tone)",
  strokeLinecap: `${tokens.linecap}`,
  transition: `stroke-dashoffset ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle(".rk-ring-label", { fontSize: `${tokens.textXs}`, fontWeight: "500" });

globalStyle(".rk-skeleton", {
  height: "0.9em",
  borderRadius: `${tokens.radiusSm}`,
  background: `linear-gradient(90deg, ${tokens.surface2} 30%, ${tokens.surface3} 50%, ${tokens.surface2} 70%) 0 0 /
    300% 100%`,
  animation: `rk-shimmer calc(${tokens.durSlow} * 5) linear infinite`,
  animationPlayState: `${tokens.animationState}`,
});

globalStyle(".rk-skeleton[data-round]", { borderRadius: `${tokens.radiusPill}` });

globalStyle(".rk-skeleton-lines", { display: "flex", flexDirection: "column", gap: "0.6em" });
