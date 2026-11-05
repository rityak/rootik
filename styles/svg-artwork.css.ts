import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-svg-artwork", {
  position: "relative",
  width: "100%",
  aspectRatio: "1",
  color: "currentColor",
  pointerEvents: "none",
});
globalStyle(".rk-svg-artwork-motion, .rk-svg-artwork svg", { width: "100%", height: "100%" });
globalStyle('.rk-svg-artwork[data-motion="drift"] .rk-svg-artwork-motion', {
  animation: `rk-svg-artwork-drift calc(${tokens.durSlow} * 35) ease-in-out infinite alternate`,
  animationPlayState: tokens.animationState,
});
globalStyle('.rk-svg-artwork[data-motion="orbit"] .rk-svg-artwork-motion', {
  animation: `rk-svg-artwork-orbit calc(${tokens.durSlow} * 100) linear infinite`,
  animationPlayState: tokens.animationState,
});
globalStyle(".rk-svg-artwork[data-motion] .rk-svg-artwork-motion", {
  "@media": { "(prefers-reduced-motion: reduce)": { animationName: "none" } },
});
globalKeyframes("rk-svg-artwork-drift", {
  from: { transform: "translateY(0) rotate(-2deg)" },
  to: { transform: `translateY(calc(${tokens.space} * -1)) rotate(2deg)` },
});
globalKeyframes("rk-svg-artwork-orbit", { to: { transform: "rotate(360deg)" } });
