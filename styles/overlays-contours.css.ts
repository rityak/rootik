import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-toast-host", { display: "contents" });

globalStyle(".rk-overlay[data-surface]", {
  isolation: "isolate",
  padding: "var(--rk-overlay-pad)",
  background: "transparent",
  boxShadow: "none",
  backdropFilter: "none",
});
globalStyle(".rk-dialog-panel[data-surface]", { position: "relative", overflow: "visible" });
globalStyle(".rk-overlay > .rk-overlay-surface", {
  position: "absolute",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
});
globalStyle(".rk-overlay-surface > .rk-svg-surface-content", { display: "none" });
globalStyle(".rk-dialog-panel[data-surface] > .rk-dialog-header", { padding: 0 });
globalStyle(".rk-dialog-panel[data-surface] > .rk-dialog-body", {
  padding: `calc(${tokens.space} * 4) 0`,
  overflowWrap: "anywhere",
});
globalStyle(".rk-dialog-panel[data-surface] > .rk-dialog-footer", {
  padding: `calc(${tokens.space} * 3) 0 0`,
  background: "transparent",
});
globalStyle(".rk-command .rk-dialog-panel[data-surface] > .rk-dialog-body", { padding: 0 });
globalStyle(".rk-command .rk-dialog-panel[data-surface] .rk-command-search", { paddingInline: 0 });
globalStyle(".rk-command .rk-dialog-panel[data-surface] .rk-command-list", { paddingInline: 0 });
globalStyle(".rk-dialog-panel[data-surface] > .rk-dialog-header:last-child", { padding: 0 });
globalStyle(".rk-tooltip[data-surface] > .rk-overlay-surface", {
  vars: {
    "--rk-svg-fill": `${tokens.inverse}`,
    "--rk-svg-fill-low": `${tokens.inverse}`,
    "--rk-svg-edge-top": `${tokens.inverse}`,
    "--rk-svg-edge": `${tokens.inverse}`,
  },
});
globalStyle(".rk-tooltip[data-surface] > .rk-overlay-surface[data-flat]", {
  background: `${tokens.inverse}`,
});
globalStyle(".rk-toast[data-behind] > .rk-overlay-surface", { opacity: 1 });
globalStyle(".rk-toast[data-surface]", { overflowWrap: "anywhere", overflow: "visible" });
globalStyle(".rk-toast[data-surface] .rk-toast-action", {
  whiteSpace: "normal",
  height: "auto",
  minHeight: `calc(${tokens.space} * 6)`,
  paddingBlock: `${tokens.space}`,
});
globalStyle(
  ".rk-dialog[open] > .rk-dialog-panel > .rk-overlay-surface .rk-motion-light, .rk-floating:popover-open > .rk-overlay-surface .rk-motion-light, .rk-toast > .rk-overlay-surface .rk-motion-light",
  { animationName: "var(--rk-effect-animation)" },
);
globalStyle(".rk-overlay[data-surface]", {
  "@media": {
    "(forced-colors: active)": { outline: "1px solid CanvasText", background: "Canvas", color: "CanvasText" },
  },
});

// Native resizable/floating hosts can clip exterior shadows; keep the flat rim inside its box.
globalStyle(".rk-overlay > .rk-overlay-surface[data-flat]", { boxShadow: `inset 0 0 0 1px ${tokens.line}` });
