import { globalStyle } from "@vanilla-extract/css";
import type { TabsProps } from "../src/components/nav";
import { tokens } from "./tokens.css";

const variants = {
  line: '.rk-tabs[data-variant="line"]',
  pill: '.rk-tabs[data-variant="pill"]',
} satisfies Record<NonNullable<TabsProps["variant"]>, string>;

globalStyle(".rk-tabs", {
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  gap: "2px",
  minWidth: "0",
  overflowX: "auto",
  scrollbarWidth: "none",
  vars: { "--rk-tab-h": `${tokens.hMd}` },
});

globalStyle('.rk-tabs[data-size="sm"]', {
  fontSize: `${tokens.textSm}`,
  vars: { "--rk-tab-h": `${tokens.hSm}` },
});

globalStyle('.rk-tabs[data-size="lg"]', { vars: { "--rk-tab-h": `${tokens.hLg}` } });

globalStyle(".rk-tabs[data-fill] .rk-tab", { flex: "1" });

globalStyle(variants.line, {
  gap: `calc(${tokens.space} * 4)`,
  boxShadow: `inset 0 -1px 0 ${tokens.line}`,
});

globalStyle('.rk-tabs[data-variant="line"] .rk-tab', { padding: "0 2px" });

globalStyle('.rk-tabs[data-variant="line"] .rk-tabs-indicator', {
  bottom: "0",
  height: "2px",
  borderRadius: `calc(2px * ${tokens.roundness}) calc(2px * ${tokens.roundness}) 0 0`,
  background: `var(--rk-tab-line, ${tokens.text})`,
});

globalStyle(variants.pill, {
  display: "inline-flex",
  width: "fit-content",
  maxWidth: "100%",
  padding: "3px",
  borderRadius: `calc(${tokens.radiusControl} + 3px * ${tokens.roundness})`,
  background: `var(--rk-track-bg, ${tokens.well})`,
  boxShadow: `var(--rk-track-shadow, inset 0 0 0 1px ${tokens.line})`,
});

globalStyle('.rk-tabs[data-variant="pill"][data-fill]', { display: "flex", width: "auto" });

globalStyle('.rk-tabs[data-variant="pill"] .rk-tab', {
  height: "calc(var(--rk-tab-h) - 6px)",
  padding: `0 calc(${tokens.space} * 3.5)`,
  borderRadius: `${tokens.radiusControl}`,
});

globalStyle('.rk-tabs[data-variant="pill"] .rk-tab[aria-selected="true"]', {
  color: `var(--rk-selected-fg, ${tokens.onInverse})`,
});

globalStyle('.rk-tabs[data-variant="pill"] .rk-tabs-indicator', {
  top: "3px",
  bottom: "3px",
  borderRadius: `${tokens.radiusControl}`,
  background: `var(--rk-selected-bg, ${tokens.inverse})`,
  boxShadow: `var(--rk-selected-shadow, 0 2px 8px -2px oklch(${tokens.shade} / 0.5))`,
});

globalStyle(".rk-topnav", { minWidth: "0" });

globalStyle(".rk-topnav .rk-tab", { textDecoration: "none" });

globalStyle('.rk-topnav .rk-tab[aria-current="page"]', {
  color: `var(--rk-selected-fg, ${tokens.onInverse})`,
});

globalStyle('.rk-tabs[data-orientation="vertical"]', { flexDirection: "column", overflow: "visible" });

globalStyle('.rk-tabs[data-orientation="vertical"] .rk-tab', {
  justifyContent: "flex-start",
  paddingInline: `calc(${tokens.space} * 3)`,
});

globalStyle('.rk-tabs[data-orientation="vertical"] .rk-tabs-indicator', {
  transitionProperty: "top, bottom",
});

globalStyle('.rk-tabs[data-orientation="vertical"][data-variant="line"]', {
  gap: "2px",
  boxShadow: `inset 1px 0 0 ${tokens.line}`,
});

globalStyle('.rk-tabs[data-orientation="vertical"][data-variant="line"] .rk-tabs-indicator', {
  left: "0",
  width: "2px",
  height: "auto",
  borderRadius: `0 calc(2px * ${tokens.roundness}) calc(2px * ${tokens.roundness}) 0`,
});

globalStyle('.rk-tabs[data-orientation="vertical"][data-variant="pill"]', { display: "flex", width: "auto" });

globalStyle('.rk-tabs[data-orientation="vertical"][data-variant="pill"] .rk-tabs-indicator', {
  left: "3px",
  right: "3px",
});

globalStyle(".rk-tab", {
  position: "relative",
  zIndex: "1",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  flexShrink: "0",
  height: "var(--rk-tab-h)",
  margin: "0",
  border: "0",
  background: "none",
  color: `${tokens.text2}`,
  font: "inherit",
  fontWeight: "500",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: `color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-tab:hover:not(:disabled)", { color: `${tokens.text}` });

globalStyle('.rk-tab[aria-selected="true"]', { color: `${tokens.text}` });

globalStyle(".rk-tab:focus-visible", { outlineOffset: "-2px" });

globalStyle(".rk-tab:disabled", { opacity: "0.4", cursor: "not-allowed" });

globalStyle(".rk-tab .rk-icon", { fontSize: "1.1em" });

globalStyle(".rk-tab-media", {
  display: "inline-flex",
  flexShrink: "0",
  height: "1.5em",
  maxWidth: "2.5em",
  overflow: "hidden",
  borderRadius: `calc(${tokens.radiusSm} * 0.7)`,
});

globalStyle(".rk-tab-media > :is(img, svg, video)", { width: "auto", height: "100%", objectFit: "cover" });

globalStyle(".rk-tab-badge", {
  minWidth: "18px",
  padding: "1px 5px",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.surface3}`,
  color: `${tokens.text2}`,
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
});

globalStyle('[aria-selected="true"] > .rk-tab-badge', {
  background: "color-mix(in oklab, currentColor 14%, transparent)",
  color: "inherit",
});

globalStyle(".rk-tab-dirty", {
  width: "6px",
  height: "6px",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.warn}`,
});

globalStyle(".rk-sidebar", {
  display: "flex",
  flexDirection: "column",
  minHeight: "0",
  height: "100%",
  width: "100%",
});

globalStyle(".rk-sidebar-header", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minHeight: "56px",
  padding: "0 14px",
  flexShrink: "0",
});

globalStyle(".rk-sidebar-body", {
  display: "flex",
  flex: "1",
  flexDirection: "column",
  gap: "14px",
  minHeight: "0",
  padding: "6px 8px",
  overflowY: "auto",
});

globalStyle(".rk-sidebar-footer", {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  padding: "8px",
  flexShrink: "0",
});

globalStyle(".rk-sidebar[data-collapsed] .rk-sidebar-header", { justifyContent: "center", padding: "0" });

globalStyle(".rk-sidebar[data-collapsed] .rk-nav-item", { justifyContent: "center" });

globalStyle(".rk-sidebar[data-collapsed] .rk-nav-link", {
  flex: "0 0 auto",
  width: `${tokens.hMd}`,
  justifyContent: "center",
  padding: "0",
});

globalStyle(".rk-sidebar[data-collapsed] .rk-nav-label", {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

globalStyle(".rk-sidebar[data-collapsed] .rk-sidebar-header > :not(:first-child)", { display: "none" });

globalStyle(".rk-sidebar[data-collapsed] .rk-sidebar-footer .rk-nav-item", { justifyContent: "center" });

globalStyle(".rk-nav-group", { display: "flex", flexDirection: "column", gap: "2px" });

globalStyle(".rk-nav-group-head", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "6px",
  minHeight: "26px",
  padding: "0 4px 0 10px",
});

globalStyle(".rk-nav-group-label", {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "0",
  border: "0",
  background: "none",
  color: `${tokens.text3}`,
  font: "inherit",
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

globalStyle(".rk-nav-group-label:is(button)", { cursor: "pointer" });

globalStyle(".rk-nav-group-label:is(button):hover", { color: `${tokens.text2}` });

globalStyle(".rk-nav-group-items", { display: "flex", flexDirection: "column", gap: "1px" });

globalStyle(".rk-nav-item", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  minHeight: `${tokens.hSm}`,
  borderRadius: `${tokens.radiusControl}`,
  color: `${tokens.text2}`,
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.dur} ${tokens.ease}`,
  vars: { "--rk-depth": "0" },
});

globalStyle(".rk-nav-item:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });

globalStyle(".rk-nav-item[data-muted]", { color: `${tokens.text3}` });

globalStyle(".rk-nav-item[data-active]", {
  background: `var(--rk-nav-active-bg, ${tokens.inverse})`,
  color: `var(--rk-nav-active-fg, ${tokens.onInverse})`,
});

globalStyle(".rk-nav-item[data-active]::before", {
  content: "var(--rk-nav-marker, none)",
  position: "absolute",
  insetBlock: "22%",
  insetInlineStart: "0",
  width: "3px",
  borderRadius: `calc(2px * ${tokens.roundness})`,
  background: `${tokens.accent}`,
});

globalStyle(".rk-nav-item[data-active] .rk-nav-icon", { color: "var(--rk-nav-active-icon, inherit)" });

globalStyle('.rk-nav-item[data-active] .rk-badge[data-tone="neutral"]', {
  background: `oklch(${tokens.shade} / 0.08)`,
  color: "inherit",
});

globalStyle(".rk-nav-link", {
  display: "flex",
  flex: "1",
  alignItems: "center",
  gap: "10px",
  minWidth: "0",
  height: `${tokens.hSm}`,
  padding: "0 10px 0 calc(10px + var(--rk-depth) * 14px)",
  margin: "0",
  border: "0",
  borderRadius: "inherit",
  background: "none",
  color: "inherit",
  font: "inherit",
  fontSize: `${tokens.textMd}`,
  textAlign: "start",
  textDecoration: "none",
  cursor: "pointer",
});

globalStyle(".rk-nav-link:disabled, .rk-nav-link[aria-disabled]", { opacity: "0.45", cursor: "not-allowed" });

globalStyle(".rk-nav-link:focus-visible", { outlineOffset: "-2px" });

globalStyle(".rk-nav-icon", { fontSize: "16px", color: `${tokens.text3}` });

globalStyle(".rk-nav-item:hover .rk-nav-icon", { color: `${tokens.text2}` });

globalStyle(".rk-nav-label", {
  flex: "1",
  minWidth: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-nav-trailing", {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  paddingInlineEnd: "4px",
  flexShrink: "0",
});

globalStyle(".rk-nav-trailing[data-hover]", {
  opacity: "0",
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-nav-item:is(:hover, :focus-within) .rk-nav-trailing[data-hover]", { opacity: "1" });

globalStyle(".rk-dock", {
  maxWidth: "100%",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px",
  borderRadius: `var(--rk-dock-radius, ${tokens.radiusPill})`,
  boxShadow: `var(--rk-surface-shadow, ${tokens.shadow1}),
    0 16px 40px -16px oklch(${tokens.shade} / 0.7)`,
});

globalStyle('.rk-dock[data-shape="bar"]', {
  display: "flex",
  width: "100%",
  padding: "4px",
  borderRadius: `${tokens.radiusLg}`,
  boxShadow: `var(--rk-surface-shadow, ${tokens.shadow1})`,
});

globalStyle('.rk-dock[data-shape="bar"] .rk-dock-track', { flex: "1" });

globalStyle('.rk-dock[data-shape="bar"][data-align="center"] .rk-dock-track', {
  justifyContent: "safe center",
});

globalStyle('.rk-dock[data-shape="bar"] .rk-dock-item', {
  height: `${tokens.hLg}`,
  borderRadius: `${tokens.radiusControl}`,
});

globalStyle('.rk-dock[data-shape="bar"][data-variant="icons"] .rk-dock-item', {
  width: `calc(${tokens.hLg} + 8px)`,
  background: "transparent",
});

globalStyle('.rk-dock[data-shape="bar"] .rk-dock-indicator', {
  borderRadius: `var(--rk-dock-indicator-radius, ${tokens.radiusControl})`,
});

globalStyle(".rk-dock-track", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  minWidth: "0",
  padding: "4px",
  margin: "-4px",
  overflowX: "auto",
  scrollbarWidth: "none",
});

globalStyle(".rk-dock-indicator", {
  top: "var(--rk-dock-indicator-top, 4px)",
  height: "var(--rk-dock-indicator-height, auto)",
  bottom: "4px",
  borderRadius: `var(--rk-dock-indicator-radius, ${tokens.radiusPill})`,
  background: `var(--rk-dock-indicator-bg, ${tokens.inverse})`,
  boxShadow: `var(--rk-dock-indicator-shadow, 0 4px 14px -4px oklch(${tokens.shade} / 0.6))`,
});

globalStyle(".rk-dock-item", {
  position: "relative",
  zIndex: "1",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  flexShrink: "0",
  width: "44px",
  height: "44px",
  padding: "0",
  border: "0",
  borderRadius: `var(--rk-dock-radius, ${tokens.radiusPill})`,
  background: `${tokens.hover}`,
  color: `${tokens.text2}`,
  font: "inherit",
  fontSize: `${tokens.textMd}`,
  fontWeight: "500",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.durSlow} ${tokens.ease}`,
});

globalStyle(".rk-dock-item .rk-icon", { fontSize: "18px" });

globalStyle('.rk-dock-item:hover:not([aria-current]):not([aria-selected="true"]):not(:disabled)', {
  background: `${tokens.press}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-dock-item:active:not(:disabled) .rk-icon", { scale: "0.96" });

globalStyle('.rk-dock-item:is([aria-current="page"], [aria-selected="true"])', {
  background: "var(--rk-dock-active-bg, transparent)",
  color: `var(--rk-dock-active-fg, ${tokens.onInverse})`,
});

globalStyle(".rk-dock-item:disabled", { opacity: "0.4", cursor: "not-allowed" });

globalStyle('[data-variant="labels"] .rk-dock-item', {
  width: "auto",
  padding: "0 18px 0 15px",
  background: "transparent",
});

globalStyle(
  '[data-variant="labels"] .rk-dock-item:hover:not([aria-current]):not([aria-selected="true"]):not(:disabled)',
  { background: `${tokens.hover}` },
);

globalStyle(".rk-dock-dot", {
  position: "absolute",
  top: "9px",
  right: "9px",
  width: "7px",
  height: "7px",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.accent}`,
  boxShadow: `0 0 0 2px ${tokens.surface2}`,
});

globalStyle('[data-variant="labels"] .rk-dock-dot', { top: "10px", left: "27px", right: "auto" });

globalStyle(".rk-dock-count", {
  position: "absolute",
  top: "1px",
  right: "-2px",
  minWidth: "18px",
  height: "18px",
  padding: "0 5px",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.accent}`,
  color: `${tokens.onAccent}`,
  fontSize: `${tokens.text2xs}`,
  fontWeight: "600",
  lineHeight: "18px",
  textAlign: "center",
});

globalStyle('[data-variant="labels"] .rk-dock-count', { position: "static" });

globalStyle(".rk-dock-sep", {
  width: "1px",
  height: "24px",
  margin: "0 4px",
  background: `${tokens.lineStrong}`,
});

globalStyle(".rk-breadcrumbs ol", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "4px",
  margin: "0",
  padding: "0",
  listStyle: "none",
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-breadcrumbs li", {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  minWidth: "0",
});

globalStyle(".rk-breadcrumbs li :is(a, button)", {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "2px 4px",
  border: "0",
  borderRadius: `calc(6px * ${tokens.roundness})`,
  background: "none",
  color: `${tokens.text3}`,
  font: "inherit",
  textDecoration: "none",
  cursor: "pointer",
});

globalStyle(".rk-breadcrumbs li :is(a, button):hover", {
  color: `${tokens.text}`,
  background: `${tokens.hover}`,
});

globalStyle(".rk-breadcrumbs li [aria-current]", {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "2px 4px",
  color: `${tokens.text}`,
  fontWeight: "500",
});

globalStyle(".rk-breadcrumbs-sep", { color: `${tokens.text3}`, opacity: "0.6" });

globalStyle(".rk-pagination", { display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "4px" });

globalStyle(".rk-pagination > button:not(.rk-select-trigger)", {
  display: "inline-grid",
  placeItems: "center",
  minWidth: `${tokens.hSm}`,
  height: `${tokens.hSm}`,
  padding: "0 6px",
  border: "0",
  borderRadius: `${tokens.radiusControl}`,
  background: "transparent",
  color: `${tokens.text2}`,
  font: "inherit",
  fontSize: `${tokens.textSm}`,
  fontVariantNumeric: "tabular-nums",
  cursor: "pointer",
});

globalStyle(".rk-pagination > button:not(.rk-select-trigger):hover:not(:disabled)", {
  background: `${tokens.hover}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-pagination > button:not(.rk-select-trigger)[aria-current]", {
  background: `var(--rk-selected-bg, ${tokens.inverse})`,
  color: `var(--rk-selected-fg, ${tokens.onInverse})`,
  fontWeight: "600",
});

globalStyle(".rk-pagination > button:not(.rk-select-trigger):disabled", {
  opacity: "0.35",
  cursor: "not-allowed",
});

globalStyle(".rk-pagination-info", {
  marginInlineEnd: "8px",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
  whiteSpace: "nowrap",
});

globalStyle(".rk-pagination-size", { width: "auto", marginInlineEnd: "8px" });

globalStyle(".rk-pagination-current", {
  minWidth: "56px",
  textAlign: "center",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text2}`,
  whiteSpace: "nowrap",
});

globalStyle(".rk-pagination-gap", { minWidth: "20px", textAlign: "center", color: `${tokens.text3}` });

globalStyle(".rk-toc", {
  display: "flex",
  flexDirection: "column",
  boxShadow: `inset 1px 0 0 ${tokens.line}`,
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-toc-link", {
  position: "relative",
  padding: "4px 10px 4px calc(12px + var(--rk-toc-depth) * 12px)",
  borderRadius: `0 ${tokens.radiusSm} ${tokens.radiusSm} 0`,
  color: `${tokens.text3}`,
  textDecoration: "none",
  transition: `color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-toc-link:hover", { color: `${tokens.text}` });

globalStyle(".rk-toc-link[aria-current]", { color: `${tokens.text}`, fontWeight: "500" });

globalStyle(".rk-toc-link[aria-current]::before", {
  content: '""',
  position: "absolute",
  inset: "4px auto 4px 0",
  width: "2px",
  borderRadius: `0 calc(2px * ${tokens.roundness}) calc(2px * ${tokens.roundness}) 0`,
  background: `${tokens.text}`,
});

globalStyle(".rk-toc-link:focus-visible", { outlineOffset: "-2px" });
