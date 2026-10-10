import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-busy", { position: "relative", minWidth: "0" });

globalStyle(".rk-busy-content", {
  transition: `opacity ${tokens.dur} ${tokens.ease},
    filter ${tokens.dur} ${tokens.ease}`,
});

globalStyle("[data-busy] > .rk-busy-content", {
  opacity: "0.45",
  transitionDelay: "var(--rk-busy-delay, 200ms)",
});

globalStyle("[data-busy]:has(> [data-blur]) > .rk-busy-content", { filter: "blur(2px)" });

globalStyle(".rk-busy-overlay", {
  position: "absolute",
  inset: "0",
  zIndex: "2",
  display: "grid",
  placeItems: "center",
  borderRadius: "inherit",
  cursor: "progress",
  animation: `rk-busy-in ${tokens.dur} ${tokens.ease} var(--rk-busy-delay, 200ms) both`,
});

globalStyle(".rk-busy-badge", {
  display: "inline-flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
  padding: `calc(${tokens.space} * 1.5) calc(${tokens.space} * 3)`,
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur})`,
  boxShadow: `${tokens.shadowPop}`,
  color: `${tokens.text2}`,
  fontSize: `${tokens.textSm}`,
});

globalKeyframes("rk-busy-in", { from: { opacity: "0" }, to: { opacity: "1" } });
