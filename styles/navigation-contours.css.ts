import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

const control =
  ".rk-tab[data-svg-border], .rk-nav-link[data-svg-border], .rk-segmented-item[data-svg-border]";
globalStyle(control, {
  position: "relative",
  isolation: "isolate",
  background: "transparent",
  // Keep the label and SVG fill synchronous so selection cannot flash with the wrong contrast.
  transition: "none",
  vars: { "--rk-svg-control-fill": "transparent", "--rk-svg-control-edge": `${tokens.controlEdge}` },
});
globalStyle(":is(.rk-tab, .rk-nav-link, .rk-segmented-item)[data-svg-border] > .rk-svg-control-frame", {
  zIndex: -1,
});
globalStyle(
  ".rk-tabs[data-svg-border] > .rk-tabs-indicator, .rk-segmented[data-svg-border] > .rk-segmented-thumb",
  { display: "none" },
);
globalStyle(".rk-nav-item:has(> .rk-nav-link[data-svg-border])", { background: "transparent" });
globalStyle(
  ':is(.rk-tab, .rk-nav-link, .rk-segmented-item)[data-svg-border]:where(:hover):not(:where(:disabled, [data-disabled], [aria-disabled="true"]))',
  { vars: { "--rk-svg-control-fill": `${tokens.hover}` } },
);
globalStyle(
  '.rk-tab[data-svg-border][aria-selected="true"], .rk-segmented-item[data-svg-border][data-checked]',
  {
    background: "transparent",
    vars: { "--rk-svg-control-fill": `var(--rk-selected-bg, ${tokens.inverse})` },
  },
);
globalStyle(".rk-nav-item[data-active] > .rk-nav-link[data-svg-border]", {
  vars: { "--rk-svg-control-fill": `var(--rk-nav-active-bg, ${tokens.inverse})` },
});
const focus =
  ".rk-tab[data-svg-border]:focus-visible, .rk-nav-link[data-svg-border]:focus-visible, .rk-segmented-item[data-svg-border]:has(:focus-visible)";
globalStyle(focus, {
  outline: "none",
  vars: { "--rk-svg-control-stroke": "3", "--rk-svg-control-edge": "currentColor" },
  "@media": { "(forced-colors: active)": { outline: `2px solid ${tokens.focus}`, outlineOffset: "-2px" } },
});
