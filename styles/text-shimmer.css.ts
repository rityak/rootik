import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-text-shimmer[data-active]", {
  background: `linear-gradient(90deg, ${tokens.text3} 42%, ${tokens.text} 50%, ${tokens.text3} 58%) 100% 0 / 250% 100%`,
  backgroundClip: "text",
  color: "transparent",
  animation: `rk-text-shimmer calc(${tokens.durSlow} * 6.25) linear infinite`,
  animationPlayState: `${tokens.animationState}`,
});

globalKeyframes("rk-text-shimmer", { to: { backgroundPosition: "0 0" } });
globalStyle(".rk-text-shimmer[data-active]", {
  "@media": { "(forced-colors: active)": { color: "CanvasText", background: "none" } },
});
