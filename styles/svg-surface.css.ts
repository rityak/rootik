import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-svg-surface", { position: "relative", minWidth: 0, isolation: "isolate" });
globalStyle(".rk-svg-surface[data-flat]", {
  borderRadius: `${tokens.radiusLg}`,
  background: `${tokens.surface1}`,
  boxShadow: `${tokens.shadow1}`,
});
globalStyle(".rk-svg-surface[data-flat] > .rk-svg-surface-glass", {
  borderRadius: "inherit",
  overflow: "hidden",
});
globalStyle(".rk-svg-surface-frame, .rk-svg-surface-glass", {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
});
globalStyle(".rk-svg-surface-frame", { overflow: "visible" });
globalStyle(".rk-svg-surface-glass", { overflow: "hidden" });

globalStyle(".rk-svg-surface-blur", {
  position: "absolute",
  inset: 0,
  backdropFilter: `blur(var(--rk-svg-blur, ${tokens.space}))`,
});
globalStyle(".rk-svg-surface-content", {
  position: "relative",
  zIndex: 1,
  minWidth: 0,
  overflowWrap: "anywhere",
  padding: "var(--rk-svg-pad-top) var(--rk-svg-pad-right) var(--rk-svg-pad-bottom) var(--rk-svg-pad-left)",
});
globalStyle(".rk-svg-surface-guide", { pointerEvents: "none", opacity: 0.65 });
