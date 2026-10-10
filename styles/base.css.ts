import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle("html", {
  background: `${tokens.bg}`,
  color: `${tokens.text}`,
  fontFamily: `${tokens.fontSans}`,
  fontSize: `${tokens.textMd}`,
  lineHeight: "1.45",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  fontFeatureSettings: '"cv11", "ss01"',
  textRendering: "optimizeLegibility",
});

globalStyle("::selection", { background: `color-mix(in oklab, ${tokens.accent} 35%, transparent)` });

globalStyle("*", { scrollbarWidth: "thin", scrollbarColor: `${tokens.surface4} transparent` });

globalStyle("*", {
  "@supports": { "selector(::-webkit-scrollbar)": { scrollbarWidth: "auto", scrollbarColor: "auto" } },
});

globalStyle("::-webkit-scrollbar", {
  "@supports": { "selector(::-webkit-scrollbar)": { width: "10px", height: "10px" } },
});

globalStyle("::-webkit-scrollbar-track", {
  "@supports": { "selector(::-webkit-scrollbar)": { margin: "6px", background: "transparent" } },
});

globalStyle("::-webkit-scrollbar-thumb", {
  "@supports": {
    "selector(::-webkit-scrollbar)": {
      border: "3px solid transparent",
      borderRadius: `${tokens.radiusPill}`,
      background: `${tokens.surface4} padding-box`,
    },
  },
});

globalStyle("::-webkit-scrollbar-thumb:hover", {
  "@supports": { "selector(::-webkit-scrollbar)": { backgroundColor: `${tokens.text3}` } },
});

globalStyle("::-webkit-scrollbar-button,\n  ::-webkit-scrollbar-corner", {
  "@supports": { "selector(::-webkit-scrollbar)": { display: "none", background: "transparent" } },
});

globalStyle(':where([class*="rk-"]):focus-visible', {
  outline: `2px solid ${tokens.focus}`,
  outlineOffset: "2px",
});

globalStyle(':where([class*="rk-"])', { boxSizing: "border-box" });

globalStyle(".rk-floating", {
  position: "fixed",
  inset: "auto",
  margin: "0",
  padding: "0",
  border: "0",
  overflow: "visible",
  background: "transparent",
  color: `${tokens.text}`,
  font: "inherit",
});

globalStyle(".rk-floating:not(:popover-open)", { display: "none" });

globalStyle(".rk-floating", {
  opacity: "0",
  scale: "0.97",
  transition: `opacity ${tokens.dur} ${tokens.ease},
    scale ${tokens.dur} ${tokens.easeOut},
    display ${tokens.dur} allow-discrete,
    overlay ${tokens.dur} allow-discrete`,
});

globalStyle(".rk-floating[data-placed]", { opacity: "1", scale: "1" });

globalStyle(".rk-floating[data-placed]:not(:popover-open)", { opacity: "0", scale: "0.97" });

globalStyle('.rk-floating[data-side="bottom"]', { transformOrigin: "top" });

globalStyle('.rk-floating[data-side="top"]', { transformOrigin: "bottom" });

globalStyle('.rk-floating[data-side="left"]', { transformOrigin: "right" });

globalStyle('.rk-floating[data-side="right"]', { transformOrigin: "left" });

globalStyle(".rk-floating[data-placed]", { "@starting-style": { opacity: "0", scale: "0.97" } });

globalStyle("[data-tone]", {
  vars: {
    "--rk-tone": `${tokens.accent}`,
    "--rk-tone-text": `${tokens.accentText}`,
    "--rk-on-tone": "oklch(from var(--rk-tone) clamp(0.16, (0.73 - l) * 100, 0.99) 0 0)",
  },
});

globalStyle('[data-tone="neutral"]', {
  vars: { "--rk-tone": `${tokens.text3}`, "--rk-tone-text": `${tokens.text2}` },
});

globalStyle('[data-tone="success"]', {
  vars: { "--rk-tone": `${tokens.success}`, "--rk-tone-text": `${tokens.success}` },
});

globalStyle('[data-tone="warn"]', {
  vars: { "--rk-tone": `${tokens.warn}`, "--rk-tone-text": `${tokens.warn}` },
});

globalStyle('[data-tone="danger"]', {
  vars: {
    "--rk-tone": `${tokens.danger}`,
    "--rk-tone-text": `oklch(from ${tokens.danger} calc(l + 0.08) c h)`,
  },
});

globalStyle('[data-tone="info"]', {
  vars: { "--rk-tone": `${tokens.info}`, "--rk-tone-text": `${tokens.info}` },
});

globalStyle(".rk-surface", {
  position: "relative",
  borderRadius: `${tokens.radiusLg}`,
  background: `var(--rk-surface-sheen, none),
    linear-gradient(
      180deg,
      color-mix(in oklab, ${tokens.surface2} var(--rk-surface-alpha, 100%), transparent) -60%,
      color-mix(in oklab, ${tokens.surface1} var(--rk-surface-alpha, 100%), transparent) 40%
    )`,
  backdropFilter: "var(--rk-surface-filter, none)",
  boxShadow: `var(--rk-surface-shadow, ${tokens.shadow1})`,
});

globalStyle(".rk-surface::before", {
  content: '""',
  position: "absolute",
  inset: "0",
  padding: "1px",
  borderRadius: "inherit",
  background: "var(--rk-surface-edge, none)",
  mask: "linear-gradient(black 0 0) content-box,\n      linear-gradient(black 0 0)",
  maskComposite: "exclude",
  pointerEvents: "none",
  zIndex: "2",
});

globalStyle(".rk-panel-glass", {
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
  boxShadow: `${tokens.shadowPop}`,
});

globalStyle(".rk-num", { fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" });

globalStyle(".rk-mono", { fontFamily: `${tokens.fontMono}`, fontSize: "0.94em" });

globalStyle(".rk-hatch", { backgroundImage: `${tokens.hatch}` });

globalStyle(".rk-truncate", {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: "0",
});

globalStyle(".rk-sr-only", {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: "0",
});

globalStyle(".rk-icon", {
  display: "inline-flex",
  flexShrink: "0",
  alignItems: "center",
  justifyContent: "center",
});

globalStyle(".rk-icon svg", { width: "1em", height: "1em", strokeWidth: `${tokens.iconStroke}` });

globalKeyframes("rk-spin", { to: { rotate: "360deg" } });
globalKeyframes("rk-pulse", { "50%": { opacity: "0.35" } });
globalKeyframes("rk-shimmer", {
  from: { backgroundPosition: "150% 0" },
  to: { backgroundPosition: "-50% 0" },
});
globalStyle(
  ":where(\n    .rk-surface,\n    .rk-card,\n    .rk-button:not([data-round]),\n    .rk-input,\n    .rk-textarea,\n    .rk-select-trigger,\n    .rk-menu,\n    .rk-popover,\n    .rk-dialog-panel,\n    .rk-toast,\n    .rk-callout,\n    .rk-choice-card,\n    .rk-table-wrap\n  )",
  { "@supports": { "(corner-shape: squircle)": { cornerShape: "var(--rk-corner-shape, round)" } } },
);

globalStyle(".rk-surface::before", {
  "@supports": { "(corner-shape: squircle)": { cornerShape: "inherit" } },
});

globalStyle("::highlight(rk-match)", {
  color: `${tokens.accentText}`,
  textDecoration: `underline 1.5px color-mix(in oklab, ${tokens.accentText} 70%, transparent)`,
  textUnderlineOffset: "3px",
});

globalStyle(".rk-scope", {
  display: "contents",
  fontFamily: `${tokens.fontSans}`,
  fontSize: `${tokens.fontSize}`,
});
