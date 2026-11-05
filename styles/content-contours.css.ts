import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-content-surface", { position: "relative" });
globalStyle(".rk-card[data-surface]", { gap: `calc(${tokens.space} * 4)`, overflow: "visible" });
globalStyle(".rk-card[data-surface]::before, .rk-card[data-surface]::after", { display: "none" });
globalStyle(".rk-card[data-surface] > .rk-card-header", { minHeight: 0, padding: 0, flexWrap: "wrap" });
globalStyle(
  ".rk-card[data-surface] > .rk-card-body, .rk-card[data-surface] .rk-card-collapse-inner > .rk-card-body",
  { padding: 0 },
);
globalStyle(".rk-card[data-surface] :is(.rk-card-header, .rk-card-body, .rk-card-footer)", { minWidth: 0 });
globalStyle(
  ".rk-card[data-surface] > .rk-card-footer, .rk-card[data-surface] .rk-card-collapse-inner > .rk-card-footer",
  { padding: `calc(${tokens.space} * 3) 0 0`, background: "transparent", flexWrap: "wrap" },
);
globalStyle(".rk-card[data-surface] .rk-card-title", {
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
});
globalStyle(".rk-card[data-surface] .rk-card-collapse-inner", { gap: `calc(${tokens.space} * 4)` });
globalStyle(".rk-card[data-surface][data-interactive]:hover, .rk-card[data-surface][data-selected]", {
  boxShadow: "none",
});
globalStyle(".rk-card[data-surface][data-selected]", {
  vars: { "--rk-svg-edge-top": tokens.accentText, "--rk-svg-edge": tokens.accentText },
});
globalStyle(".rk-card:has(> .rk-card-hit:focus-visible)", {
  outline: "none",
  boxShadow: `inset 0 0 0 2px ${tokens.focus}`,
});
globalStyle(".rk-card[data-surface]:has(> .rk-card-hit:focus-visible)", {
  boxShadow: "none",
  vars: { "--rk-svg-edge-top": tokens.focus, "--rk-svg-edge": tokens.focus },
});
globalStyle(
  ".rk-card[data-surface]:has(> .rk-card-hit:focus-visible) > .rk-overlay-surface .rk-svg-surface-rim",
  { strokeWidth: 2 },
);
globalStyle(".rk-card[data-surface]:has(> .rk-card-hit:focus-visible) > .rk-overlay-surface[data-flat]", {
  boxShadow: `inset 0 0 0 2px ${tokens.focus}`,
});
globalStyle('.rk-card[data-running][data-animation="once"]::after', { animationIterationCount: 1 });
globalStyle('.rk-card[data-running][data-animation="off"]::after', { display: "none" });
globalStyle(".rk-content-motion", { inset: "var(--rk-overlay-pad)", borderRadius: tokens.radiusSm });
// Keep decoration outside the native details-content clip and its discrete visibility transition.
globalStyle(".rk-disclosure-surface", { display: "contents" });
globalStyle(".rk-disclosure-surface[data-surface]", {
  display: "block",
  position: "relative",
  isolation: "isolate",
});
globalStyle(".rk-disclosure-surface > .rk-overlay-surface", {
  position: "absolute",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
});

// Collapsible cards clip their contents, so the flat rim must stay inside its own box.
globalStyle(".rk-disclosure-surface > .rk-overlay-surface[data-flat]", {
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(".rk-disclosure[data-surface] > summary", {
  padding: 0,
  minHeight: tokens.hMd,
  borderRadius: tokens.radiusSm,
});
globalStyle(".rk-disclosure[data-surface] > .rk-disclosure-body", {
  padding: `calc(${tokens.space} * 3) 0 0`,
  overflowWrap: "anywhere",
});
globalStyle(".rk-disclosure-surface + .rk-disclosure-surface > .rk-disclosure", {
  borderTop: 0,
  borderRadius: tokens.radiusMd,
});
globalStyle('.rk-text-shimmer[data-active][data-animation="once"]', { animationIterationCount: 1 });
globalStyle(".rk-text-shimmer[data-active], .rk-card[data-running]::after", {
  "@media": { "(prefers-reduced-motion:reduce)": { animation: "none" } },
});
globalStyle(".rk-text-shimmer[data-active]", {
  "@media": { "(prefers-reduced-motion:reduce)": { background: "none", color: tokens.text3 } },
});
globalStyle(".rk-card:has(> .rk-card-hit:focus-visible)", {
  "@media": { "(forced-colors:active)": { outline: "2px solid Highlight", outlineOffset: -2 } },
});
globalStyle(".rk-code-editor:has(textarea:focus-visible)", {
  outline: "none",
  boxShadow: `inset 0 0 0 2px ${tokens.focus}`,
});
globalStyle(".rk-code-editor:has(textarea:focus-visible)", {
  "@media": { "(forced-colors:active)": { outline: "2px solid Highlight", outlineOffset: -2 } },
});

globalStyle(".rk-card[data-surface] > .rk-card-header > :is(.rk-card-toggle, .rk-card-heading)", {
  flex: `1 1 min(100%, calc(${tokens.space} * 56))`,
});
globalStyle(".rk-card[data-surface] > .rk-card-header > .rk-card-actions", { flexWrap: "wrap", minWidth: 0 });

globalStyle(
  ".rk-disclosure-surface:not([data-surface]) + .rk-disclosure-surface:not([data-surface]) > .rk-disclosure",
  {
    borderTop: `1px solid ${tokens.line}`,
    borderRadius: 0,
  },
);
