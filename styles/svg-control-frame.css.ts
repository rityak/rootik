import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-svg-control-frame", {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "hidden",
});
globalStyle(".rk-button[data-svg-border], .rk-input[data-svg-border]", {
  position: "relative",
  isolation: "isolate",
  background: "transparent",
  boxShadow: "none",
});
globalStyle(".rk-button[data-svg-border]", {
  vars: { "--rk-svg-control-fill": "var(--rk-btn-bg)", "--rk-svg-control-edge": "var(--rk-btn-edge)" },
});
globalStyle(".rk-input[data-svg-border]", {
  vars: { "--rk-svg-control-fill": `${tokens.well}`, "--rk-svg-control-edge": "var(--rk-ctl-edge)" },
});
globalStyle(
  ".rk-button[data-svg-border] > :not(.rk-svg-control-frame, .rk-motion-layer), .rk-input[data-svg-border] > :not(.rk-svg-control-frame, .rk-motion-layer)",
  {
    position: "relative",
    zIndex: 1,
  },
);

const buttonFocus = ".rk-button[data-svg-border]:focus-visible";
const inputFocus = ".rk-input[data-svg-border]:has(:focus-visible)";

globalStyle(".rk-input[data-svg-border] .rk-input-el:focus-visible", { outline: "none" });

globalStyle(`${buttonFocus}, ${inputFocus}`, {
  outline: "none",
  vars: { "--rk-svg-control-stroke": "3" },
  "@media": { "(forced-colors: active)": { outline: `2px solid ${tokens.focus}`, outlineOffset: "-2px" } },
});
globalStyle(buttonFocus, {
  vars: {
    "--rk-svg-control-edge": "var(--rk-btn-fg)",
    "--rk-svg-control-fill": "color-mix(in oklab, var(--rk-btn-bg) 94%, var(--rk-btn-fg))",
  },
});
globalStyle(inputFocus, {
  vars: {
    "--rk-svg-control-edge": `${tokens.focus}`,
    "--rk-svg-control-fill": `color-mix(in oklab, ${tokens.well} 95%, ${tokens.focus})`,
  },
});
globalStyle(".rk-input[data-svg-border][data-invalid]:has(:focus-visible)", {
  vars: { "--rk-svg-control-edge": `${tokens.danger}` },
});
globalStyle(".rk-button[data-svg-border]:active:not(:disabled)", { scale: "none" });
