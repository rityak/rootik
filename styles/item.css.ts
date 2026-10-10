import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-item", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 3)`,
  minHeight: "calc(var(--rk-item-h) + 6px)",
  padding: "6px var(--rk-item-pad)",
  borderRadius: `${tokens.radiusMd}`,
  color: `${tokens.text}`,
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.dur} ${tokens.ease}`,
  vars: {
    "--rk-item-h": `${tokens.hLg}`,
    "--rk-item-pad": `calc(${tokens.space} * 3)`,
    "--rk-item-media": "32px",
  },
});

globalStyle('.rk-item[data-size="sm"]', {
  gap: `calc(${tokens.space} * 2.5)`,
  minHeight: "var(--rk-item-h)",
  paddingBlock: "2px",
  vars: {
    "--rk-item-h": `${tokens.hSm}`,
    "--rk-item-media": "24px",
    "--rk-item-pad": `calc(${tokens.space} * 2.5)`,
  },
});

globalStyle('.rk-item[data-size="lg"]', {
  paddingBlock: "10px",
  vars: { "--rk-item-h": "56px", "--rk-item-media": "40px", "--rk-item-pad": `calc(${tokens.space} * 4)` },
});

globalStyle('.rk-item[data-variant="outline"]', { boxShadow: `inset 0 0 0 1px ${tokens.line}` });

globalStyle('.rk-item[data-variant="surface"]', {
  background: `${tokens.surface2}`,
  boxShadow: `${tokens.highlight}`,
});

globalStyle(".rk-item[data-interactive]:not([data-disabled], [data-selected]):hover", {
  background: `${tokens.hover}`,
});

globalStyle(".rk-item[data-selected]", {
  background: `${tokens.inverse}`,
  color: `${tokens.onInverse}`,
  vars: {
    [tokens.text]: `${tokens.onInverse}`,
    [tokens.text2]: `color-mix(in oklab, ${tokens.onInverse} 75%, transparent)`,
    [tokens.surface3]: `oklch(${tokens.shade} / 0.08)`,
    [tokens.hover]: `oklch(${tokens.shade} / 0.08)`,
    [tokens.press]: `oklch(${tokens.shade} / 0.14)`,
  },
});

globalStyle(".rk-item[data-selected] .rk-item-desc, .rk-item[data-selected] .rk-item-meta", {
  color: `color-mix(in oklab, ${tokens.onInverse} 65%, transparent)`,
});

globalStyle(".rk-item[data-selected] .rk-item-media[data-icon]", {
  background: `oklch(${tokens.shade} / 0.08)`,
  color: "inherit",
});

globalStyle('.rk-item[data-selected] .rk-badge:not([data-tone="neutral"], [data-variant="solid"])', {
  color: `color-mix(in oklab, var(--rk-tone) 55%, ${tokens.onInverse})`,
});

globalStyle(".rk-item[data-disabled]", { opacity: "0.45" });

globalStyle(".rk-item:has(.rk-item-hit:focus-visible)", {
  outline: `2px solid ${tokens.focus}`,
  outlineOffset: "2px",
});

globalStyle(".rk-item-media", {
  display: "flex",
  flexShrink: "0",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "var(--rk-item-media)",
});

globalStyle(".rk-item-media[data-icon]", {
  width: "var(--rk-item-media)",
  height: "var(--rk-item-media)",
  borderRadius: `calc(${tokens.radiusMd} - ${tokens.space})`,
  background: `${tokens.surface3}`,
  color: `${tokens.text2}`,
  fontSize: "calc(var(--rk-item-media) * 0.5)",
});

globalStyle(".rk-item-media[data-icon] > svg", { width: "1em", height: "1em" });

globalStyle(".rk-item-media[data-icon][data-tone]", {
  background: `color-mix(in oklab, var(--rk-tone) 14%, ${tokens.surface3})`,
  color: "var(--rk-tone-text)",
  boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--rk-tone) 25%, transparent)",
});

globalStyle(".rk-item-body", {
  display: "flex",
  flex: "1",
  flexDirection: "column",
  gap: "1px",
  minWidth: "0",
});

globalStyle(".rk-item-title", {
  overflow: "hidden",
  fontWeight: "500",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-item-desc", {
  overflow: "hidden",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle('[data-size="sm"] > .rk-item-body > .rk-item-desc', { fontSize: `${tokens.textXs}` });

globalStyle(".rk-item-meta", { flexShrink: "0", color: `${tokens.text3}`, fontSize: `${tokens.textSm}` });

globalStyle(".rk-item-actions", {
  position: "relative",
  zIndex: "1",
  display: "flex",
  flexShrink: "0",
  alignItems: "center",
  gap: "2px",
});

globalStyle(".rk-item-hit", { all: "unset", cursor: "pointer" });

globalStyle(".rk-item-hit::after", {
  content: '""',
  position: "absolute",
  inset: "0",
  borderRadius: "inherit",
});

globalStyle(".rk-item-hit:disabled", { cursor: "not-allowed" });

globalStyle(".rk-item-hit:focus-visible", { outline: "none" });

globalStyle(".rk-item-group", {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  margin: "0",
  padding: "0",
  listStyle: "none",
  minHeight: "0",
  overflowY: "auto",
});

globalStyle(".rk-item-group > .rk-item", { flexShrink: "0" });

globalStyle('.rk-item-group[data-variant="divided"]', { gap: "0" });

globalStyle('.rk-item-group[data-variant="divided"] > .rk-item + .rk-item::before', {
  content: '""',
  position: "absolute",
  top: "0",
  right: "var(--rk-item-pad)",
  left: "var(--rk-item-pad)",
  borderTop: `1px solid ${tokens.line}`,
});

globalStyle(
  '.rk-item-group[data-variant="divided"] > .rk-item:is([data-selected], :hover) + .rk-item::before, .rk-item-group[data-variant="divided"] > .rk-item[data-selected]::before, .rk-item-group[data-variant="divided"] > .rk-item[data-interactive]:hover::before',
  { opacity: "0" },
);

globalStyle('.rk-item-group[data-variant="cards"]', { gap: `calc(${tokens.space} * 2)` });

globalStyle('.rk-item-group[data-variant="cards"] > .rk-item:not([data-selected])', {
  background: `${tokens.surface2}`,
  boxShadow: `${tokens.highlight}`,
});
