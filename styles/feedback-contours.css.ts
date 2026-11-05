import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-feedback-surface", { position: "relative" });
globalStyle(".rk-callout[data-surface] > .rk-overlay-surface", {
  vars: {
    "--rk-svg-fill": `color-mix(in oklab, var(--rk-tone) 8%, ${tokens.surface2})`,
    "--rk-svg-fill-low": `color-mix(in oklab, var(--rk-tone) 4%, ${tokens.surface1})`,
    "--rk-svg-edge-top": `color-mix(in oklab, var(--rk-tone) 30%, ${tokens.lineStrong})`,
  },
});

globalStyle(".rk-callout[data-surface] > .rk-overlay-surface[data-flat]", {
  background: `color-mix(in oklab, var(--rk-tone) 8%, ${tokens.surface2})`,
});

globalStyle(".rk-badge[data-svg-border], .rk-busy-badge[data-svg-border]", {
  position: "relative",
  isolation: "isolate",
  background: "transparent",
  boxShadow: "none",
  vars: {
    "--rk-svg-control-fill": `color-mix(in oklab, var(--rk-tone) 15%, ${tokens.surface1})`,
    "--rk-svg-control-edge": `color-mix(in oklab, var(--rk-tone) 45%, ${tokens.lineStrong})`,
  },
});
globalStyle('.rk-badge[data-svg-border][data-tone="neutral"]', {
  vars: { "--rk-svg-control-fill": tokens.surface3, "--rk-svg-control-edge": tokens.lineStrong },
});
globalStyle('.rk-badge[data-svg-border][data-variant="solid"]', {
  vars: { "--rk-svg-control-fill": "var(--rk-tone)", "--rk-svg-control-edge": "var(--rk-tone)" },
});
globalStyle('.rk-badge[data-svg-border][data-variant="outline"]', {
  vars: { "--rk-svg-control-fill": "transparent" },
});
globalStyle(".rk-busy-badge[data-svg-border]", {
  vars: { "--rk-svg-control-fill": tokens.glassBg, "--rk-svg-control-edge": tokens.lineStrong },
});
globalStyle(".rk-badge > .rk-svg-control-frame, .rk-busy-badge > .rk-svg-control-frame", { zIndex: -1 });

globalStyle(".rk-feedback-track", {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
});
globalStyle(".rk-meter-track", { position: "relative" });
globalStyle(".rk-progress-bar, .rk-meter-bar", {
  position: "relative",
  isolation: "isolate",
  overflow: "clip",
});
globalStyle(".rk-progress-bar > .rk-motion-layer, .rk-meter-bar > .rk-motion-layer", { zIndex: 0 });
globalStyle('.rk-spinner[data-variant="orbit"]', { borderColor: "transparent", color: tokens.accentText });
globalStyle('.rk-spinner[data-variant="orbit"] > svg', {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
});
globalStyle(".rk-spinner", { position: "relative" });

const repeatTargets = (value: string) =>
  [
    `.rk-spinner[data-animation="${value}"]`,
    `.rk-progress[data-animation="${value}"] .rk-progress-bar`,
    `.rk-skeleton[data-animation="${value}"]`,
    `.rk-skeleton-lines[data-animation="${value}"] > .rk-skeleton`,
    `.rk-status[data-animation="${value}"] .rk-status-dot::after`,
    `.rk-indicator-anchor[data-animation="${value}"] .rk-indicator-mark::after`,
  ].join(", ");

globalStyle(repeatTargets("once"), { animationIterationCount: 1 });
globalStyle(repeatTargets("off"), { animation: "none" });

globalStyle(
  ".rk-spinner, .rk-skeleton, .rk-progress-bar, .rk-ring-bar, .rk-status-dot::after, .rk-indicator-mark::after",
  {
    "@media": {
      "(prefers-reduced-motion: reduce), (forced-colors: active)": { animation: "none", transition: "none" },
    },
  },
);
globalStyle(".rk-progress-track[data-indeterminate] > .rk-progress-bar", {
  "@media": {
    "(prefers-reduced-motion: reduce), (forced-colors: active)": {
      width: "100%",
      translate: "none",
      opacity: 0.5,
    },
  },
});
globalStyle(".rk-badge[data-svg-border], .rk-busy-badge[data-svg-border]", {
  "@media": {
    "(forced-colors: active)": { background: "Canvas", color: "CanvasText", outline: "1px solid CanvasText" },
  },
});
globalStyle(".rk-feedback-track, .rk-badge > .rk-svg-control-frame, .rk-busy-badge > .rk-svg-control-frame", {
  "@media": { "(forced-colors: active)": { display: "none" } },
});
