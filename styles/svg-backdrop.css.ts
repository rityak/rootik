import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-svg-backdrop", {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  borderRadius: "inherit",
  pointerEvents: "none",
  color: `var(--rk-svg-pattern-color, ${tokens.text3})`,
  background: "var(--rk-svg-backdrop, transparent)",
});
globalStyle(".rk-svg-backdrop-field, .rk-svg-backdrop-motion", {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
});
globalStyle(".rk-svg-backdrop[data-animated] .rk-svg-backdrop-motion", {
  animation: `rk-svg-background-drift calc(${tokens.durSlow} * 70) ease-in-out infinite alternate`,
  animationPlayState: tokens.animationState,
  "@media": { "(prefers-reduced-motion: reduce)": { animationName: "none" } },
});
globalKeyframes("rk-svg-background-drift", {
  from: { transform: "translate(0, 0) scale(1.02)" },
  to: { transform: `translate(${tokens.space}, ${tokens.space}) scale(1.02)` },
});
