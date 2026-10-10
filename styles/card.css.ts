import { createGlobalVar, globalKeyframes, globalStyle } from "@vanilla-extract/css";
import type { CardProps } from "../src/components/card";
import { inverse, tokens } from "./tokens.css";

const variantSelector = (value: NonNullable<CardProps["variant"]>) => `.rk-card[data-variant="${value}"]`;

createGlobalVar("--rk-beam", {
  syntax: "<angle>",
  inherits: false,
  initialValue: "0deg",
});

globalStyle(".rk-card[data-running]::after", {
  content: '""',
  position: "absolute",
  inset: 0,
  zIndex: 2,
  padding: "1px",
  borderRadius: "inherit",
  background: `conic-gradient( from var(--rk-beam), transparent 0 70%, color-mix(in oklab, ${tokens.accent} 60%, transparent) 85%, ${tokens.accentText} 92%, transparent 96% )`,
  mask: "linear-gradient(black 0 0) content-box, linear-gradient(black 0 0)",
  maskComposite: "exclude",
  pointerEvents: "none",
  animation: `rk-beam calc(${tokens.durSlow} * 10) linear infinite`,
  animationPlayState: tokens.animationState,
});

globalStyle(".rk-card-spot", {
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  background: `radial-gradient( 280px circle at var(--rk-spot-x, 50%) var(--rk-spot-y, 0), color-mix(in oklab, ${tokens.accent} 14%, transparent), transparent 70% )`,
  opacity: 0,
  pointerEvents: "none",
  transition: `opacity ${tokens.durSlow} ${tokens.ease}`,
});

globalStyle(".rk-card:hover > .rk-card-spot", {
  opacity: 1,
});

globalKeyframes("rk-beam", {
  to: {
    vars: {
      "--rk-beam": "360deg",
    },
  },
});

globalStyle(".rk-card", {
  vars: {
    "--rk-card-pad": `${tokens.pad}`,
    "--rk-card-r": `var(--rk-card-r-in, ${tokens.radiusLg})`,
  },
  position: "relative",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  borderRadius: "var(--rk-card-r)",
  color: `${tokens.text}`,
});

globalStyle(
  '.rk-card:is([data-variant="inverse"], [data-variant="outline"], [data-variant="sunken"])::before',
  {
    display: "none",
  },
);

globalStyle('.rk-card[data-padding="none"]', {
  vars: {
    "--rk-card-pad": "0px",
  },
  overflow: "clip",
});

globalStyle('.rk-card[data-padding="sm"]', {
  vars: {
    "--rk-card-pad": `calc(${tokens.space} * 3)`,
  },
});

globalStyle('.rk-card[data-padding="lg"]', {
  vars: {
    "--rk-card-pad": `calc(${tokens.space} * 6)`,
  },
});

globalStyle(variantSelector("glow"), {
  background: `radial-gradient( 90% 70% at 100% 0%, color-mix(in oklab, ${tokens.accent} 20%, transparent), transparent 70% ), radial-gradient( 60% 50% at 0% 100%, color-mix(in oklab, ${tokens.chart1} 10%, transparent), transparent 70% ), color-mix(in oklab, ${tokens.surface1} var(--rk-surface-alpha, 100%), transparent)`,
  boxShadow: `${tokens.shadow1}, inset 0 0 0 1px color-mix(in oklab, ${tokens.accent} 14%, transparent)`,
});

globalStyle(variantSelector("outline"), {
  background: "transparent",
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(variantSelector("sunken"), {
  background: `${tokens.well}`,
  boxShadow: `inset 0 1px 3px oklch(${tokens.shade} / 0.3)`,
});

globalStyle(variantSelector("inverse"), {
  vars: {
    "--rk-text": inverse.text,
    "--rk-text-2": inverse.secondary,
    "--rk-text-3": inverse.muted,
    "--rk-line": `oklch(${tokens.shade} / 0.1)`,
    "--rk-line-strong": `oklch(${tokens.shade} / 0.18)`,
    "--rk-hover": `oklch(${tokens.shade} / 0.05)`,
    "--rk-press": `oklch(${tokens.shade} / 0.09)`,
    "--rk-surface-3": inverse.surface,
    "--rk-surface-4": inverse.hover,
    "--rk-inverse": inverse.inverse,
    "--rk-on-inverse": inverse.onInverse,
    "--rk-well": `oklch(${tokens.shade} / 0.06)`,
    "--rk-well-soft": `oklch(${tokens.shade} / 0.04)`,
    "--rk-hatch": `repeating-linear-gradient(
      -45deg,
      oklch(${tokens.shade} / 0.12) 0 1.5px,
      transparent 1.5px 6px
    )`,
  },
  background: `var(--rk-inverse-bg, ${inverse.background})`,
  color: `${tokens.text}`,
  boxShadow: `0 10px 30px -12px oklch(${tokens.shade} / 0.5)`,
});

globalStyle(".rk-card[data-interactive]", {
  cursor: "pointer",
  transition: `translate ${tokens.dur} ${tokens.ease}, box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-card[data-interactive]:hover", {
  translate: "0 -2px",
  boxShadow: `${tokens.shadow2}`,
});

globalStyle(".rk-card[data-selected]", {
  boxShadow: `${tokens.shadow1}, inset 0 0 0 2px ${tokens.accentLine}`,
});

globalStyle(".rk-card:has(> .rk-card-hit:focus-visible)", {
  outline: `2px solid ${tokens.focus}`,
  outlineOffset: "2px",
});

globalStyle(
  ".rk-card[data-action] .rk-card-actions, .rk-card[data-action]\n      :is(.rk-card-media, .rk-card-titles, .rk-card-body, .rk-card-footer)\n      :is(a, button, input, select, textarea, summary, [tabindex]):not(.rk-card-hit)",
  {
    position: "relative",
    zIndex: 1,
  },
);

globalStyle(".rk-card-hit", {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  padding: 0,
  border: 0,
  borderRadius: "inherit",
  background: "none",
  cursor: "pointer",
  outline: 0,
});

globalStyle(".rk-card-header, .rk-card-body, .rk-card-footer", {
  vars: {
    "--rk-card-r-in": `max(calc(var(--rk-card-r) - var(--rk-card-pad)), ${tokens.radiusSm})`,
  },
});

globalStyle(".rk-card-header", {
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
  minHeight: `calc(${tokens.hMd} + var(--rk-card-pad))`,
  padding: "calc(var(--rk-card-pad) * 0.75) var(--rk-card-pad) 0",
});

globalStyle('[data-padding="none"] > .rk-card-header', {
  padding: `calc(${tokens.space} * 3) ${tokens.pad} 0`,
});

globalStyle(".rk-card-header:is(:last-child, :has(+ .rk-card-collapse))", {
  paddingBottom: "calc(var(--rk-card-pad) * 0.75)",
});

globalStyle(".rk-card[data-dense] > .rk-card-header", {
  minHeight: 0,
});

globalStyle(".rk-card[data-dense] > .rk-card-header + .rk-card-body", {
  paddingTop: `calc(${tokens.space} * 1.5)`,
});

globalStyle(".rk-card-toggle", {
  display: "flex",
  flex: 1,
  alignItems: "center",
  gap: `calc(${tokens.space} * 2.5)`,
  minWidth: 0,
  padding: 0,
  margin: 0,
  border: 0,
  background: "none",
  color: "inherit",
  font: "inherit",
  textAlign: "start",
});

globalStyle(".rk-card-toggle:is(button)", {
  cursor: "pointer",
  borderRadius: `${tokens.radiusSm}`,
});

globalStyle(".rk-card-chevron", {
  flexShrink: 0,
  color: `${tokens.text3}`,
  transition: `rotate ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-card-chevron[data-open]", {
  rotate: "90deg",
});

globalStyle(".rk-card-icon", {
  display: "grid",
  placeItems: "center",
  width: "30px",
  height: "30px",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.surface3}`,
  color: `${tokens.text2}`,
  fontSize: "15px",
});

globalStyle(".rk-card-media", {
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
});

globalStyle(".rk-card-icon[data-tone]", {
  background: `color-mix(in oklab, var(--rk-tone) 14%, ${tokens.surface3})`,
  color: "var(--rk-tone-text)",
  boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--rk-tone) 25%, transparent)",
});

globalStyle(".rk-card-titles", {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

globalStyle(".rk-card-heading", {
  display: "flex",
  flex: 1,
  minWidth: 0,
  margin: 0,
  font: "inherit",
});

globalStyle(".rk-card-title", {
  margin: 0,
  lineHeight: "inherit",
  fontSize: `${tokens.textLg}`,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-card-desc", {
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
  textWrap: "pretty",
});

globalStyle(".rk-card-actions", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexShrink: 0,
});

globalStyle(".rk-card-body", {
  flex: 1,
  minHeight: 0,
  padding: "var(--rk-card-pad)",
});

globalStyle(".rk-card-header + .rk-card-body", {
  paddingTop: `calc(${tokens.space} * 3)`,
});

globalStyle(".rk-card-footer", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: `calc(${tokens.space} * 3) var(--rk-card-pad)`,
  borderTop: `1px solid ${tokens.line}`,
});

globalStyle(".rk-card-collapse", {
  display: "grid",
  gridTemplateRows: "0fr",
  transition: `grid-template-rows ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle(".rk-card-collapse[data-open]", {
  gridTemplateRows: "1fr",
});

globalStyle(".rk-card-collapse-inner", {
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  overflow: "hidden",
});

globalStyle(".rk-card-header + .rk-card-collapse > .rk-card-collapse-inner > .rk-card-body:first-child", {
  paddingTop: 0,
});

globalStyle(".rk-stat", {
  vars: {
    "--rk-stat-size": `${tokens.text3xl}`,
  },
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 1.5)`,
  minWidth: 0,
});

globalStyle('.rk-stat[data-size="sm"]', {
  vars: {
    "--rk-stat-size": `${tokens.textXl}`,
  },
});

globalStyle('.rk-stat[data-size="lg"]', {
  vars: {
    "--rk-stat-size": `${tokens.textDisplay}`,
  },
});

globalStyle('.rk-stat[data-size="xl"]', {
  vars: {
    "--rk-stat-size": `calc(${tokens.fontSize} * 5)`,
  },
});

globalStyle(".rk-stat-head", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
});

globalStyle(".rk-stat-icon", {
  display: "grid",
  placeItems: "center",
  width: "28px",
  height: "28px",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.surface3}`,
  color: `${tokens.text}`,
  fontSize: "14px",
});

globalStyle(".rk-stat-label", {
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-stat-delta", {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  height: "20px",
  padding: "0 7px 0 5px",
  borderRadius: `${tokens.radiusPill}`,
  background: "color-mix(in oklab, var(--rk-tone) 16%, transparent)",
  color: "var(--rk-tone-text)",
  fontSize: `${tokens.textXs}`,
  fontWeight: 500,
});

globalStyle(".rk-stat-delta svg", {
  width: "12px",
  height: "12px",
});

globalStyle(".rk-stat-value", {
  display: "flex",
  alignItems: "baseline",
  gap: "5px",
  fontSize: "var(--rk-stat-size)",
  fontWeight: 300,
  lineHeight: 1,
  letterSpacing: "-0.035em",
  color: `${tokens.text}`,
  whiteSpace: "nowrap",
});

globalStyle(".rk-stat-unit", {
  fontSize: `max(${tokens.textSm}, calc(var(--rk-stat-size) * 0.3))`,
  fontWeight: 400,
  letterSpacing: 0,
  color: `${tokens.text3}`,
});

globalStyle(".rk-stat-hint", {
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-section-label", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  minHeight: "28px",
  fontSize: `${tokens.text2xs}`,
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: `${tokens.text3}`,
});

globalStyle(".rk-empty", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: `calc(${tokens.space} * 10) calc(${tokens.space} * 6)`,
  textAlign: "center",
});

globalStyle('.rk-empty[data-size="sm"]', {
  padding: `calc(${tokens.space} * 5) calc(${tokens.space} * 4)`,
});

globalStyle(".rk-empty-icon", {
  display: "grid",
  placeItems: "center",
  width: "52px",
  height: "52px",
  marginBottom: "8px",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.hatch}, ${tokens.surface2}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}, 0 0 0 6px color-mix(in oklab, ${tokens.surface2} 40%, transparent)`,
  color: `${tokens.text2}`,
  fontSize: "22px",
});

globalStyle('.rk-empty:not([data-tone="neutral"])[data-tone] .rk-empty-icon', {
  background: `color-mix(in oklab, var(--rk-tone) 14%, ${tokens.surface2})`,
  boxShadow:
    "inset 0 0 0 1px color-mix(in oklab, var(--rk-tone) 30%, transparent), 0 0 0 6px color-mix(in oklab, var(--rk-tone) 7%, transparent)",
  color: "var(--rk-tone-text)",
});

globalStyle(".rk-empty-title", {
  fontSize: `${tokens.textMd}`,
  fontWeight: 500,
});

globalStyle(".rk-empty-hint", {
  maxWidth: "44ch",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text3}`,
  textWrap: "pretty",
});

globalStyle(".rk-empty-action", {
  marginTop: "10px",
});

globalStyle(".rk-callout", {
  display: "flex",
  gap: "10px",
  padding: "10px 12px",
  borderRadius: `${tokens.radiusMd}`,
  background: "color-mix(in oklab, var(--rk-tone) 9%, transparent)",
  boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--rk-tone) 26%, transparent)",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text}`,
});

globalStyle('.rk-callout[data-tone="neutral"]', {
  background: `${tokens.surface2}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(".rk-callout-icon", {
  alignSelf: "flex-start",
  height: "1.45em",
  fontSize: "16px",
  color: "var(--rk-tone-text)",
});

globalStyle(".rk-callout-body", {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "4px",
  minWidth: 0,
});

globalStyle(".rk-callout-title", {
  fontWeight: 600,
});

globalStyle(".rk-callout-text", {
  lineHeight: 1.5,
  color: `${tokens.text2}`,
  overflowWrap: "anywhere",
});

globalStyle(".rk-callout-actions", {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "4px",
});

globalStyle(".rk-callout-close", {
  display: "grid",
  placeItems: "center",
  width: "22px",
  height: "22px",
  margin: "-2px -4px 0 0",
  padding: 0,
  border: 0,
  borderRadius: `calc(6px * ${tokens.roundness})`,
  background: "transparent",
  color: `${tokens.text3}`,
  cursor: "pointer",
});

globalStyle(".rk-callout-close:hover", {
  background: `${tokens.hover}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-nest", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  marginInlineStart: "7px",
  padding: `2px 0 2px calc(${tokens.space} * 4)`,
  borderInlineStart: `1px solid ${tokens.lineStrong}`,
});

globalStyle(".rk-divider", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: `${tokens.text3}`,
  fontSize: `${tokens.text2xs}`,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

globalStyle(".rk-divider::before, .rk-divider::after", {
  content: '""',
  flex: 1,
  height: "1px",
  background: `${tokens.line}`,
});

globalStyle(".rk-divider:not(:has(span))::after", {
  display: "none",
});

globalStyle(".rk-divider[data-vertical]", {
  alignSelf: "stretch",
  width: "1px",
  background: `${tokens.line}`,
});

globalStyle(".rk-divider[data-vertical]::before, .rk-divider[data-vertical]::after", {
  display: "none",
});

globalStyle(".rk-kv", {
  margin: 0,
  display: "flex",
  flexDirection: "column",
});

globalStyle(".rk-kv dt", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: `${tokens.text2}`,
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-kv dd", {
  margin: 0,
  fontWeight: 500,
  fontVariantNumeric: "tabular-nums",
  minWidth: 0,
  overflowWrap: "anywhere",
});

globalStyle('.rk-kv[data-layout="rows"] .rk-kv-item', {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "16px",
  padding: "8px 0",
  borderBottom: `1px solid ${tokens.line}`,
});

globalStyle('.rk-kv[data-layout="rows"] .rk-kv-item:last-child', {
  borderBottom: 0,
});

globalStyle('.rk-kv[data-layout="rows"] .rk-kv-item dt', {
  flexShrink: 0,
});

globalStyle('.rk-kv[data-layout="rows"] .rk-kv-item dd', {
  flex: "1 1 auto",
  textAlign: "end",
});

globalStyle('.rk-kv[data-layout="grid"]', {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "14px 20px",
});

globalStyle('.rk-kv[data-layout="grid"] .rk-kv-item', {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
});

globalStyle('.rk-kv[data-layout="grid"] dt', {
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-kv-copyable", {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  maxWidth: "100%",
  minWidth: 0,
  verticalAlign: "middle",
});

globalStyle('[data-layout="rows"] .rk-kv-copyable', {
  flexDirection: "row-reverse",
});

globalStyle(".rk-kv-value", {
  minWidth: 0,
});

globalStyle(".rk-kv-copy", {
  vars: {
    "--rk-btn-h": "22px",
  },
  marginBlock: "-4px",
  opacity: 0,
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-kv-item:hover .rk-kv-copy, .rk-kv-copy:focus-visible, .rk-kv-copy[data-copied]", {
  opacity: 1,
});

globalStyle(".rk-kv-copy", {
  "@media": {
    "(hover: none)": {
      opacity: 1,
    },
  },
});
