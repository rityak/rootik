import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-menu", {
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  minWidth: "180px",
  maxWidth: "min(360px, calc(100vw - 16px))",
  maxHeight: "min(360px, var(--rk-available-h, 360px))",
  overflowY: "auto",
  padding: "5px",
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
  boxShadow: `${tokens.shadowPop}`,
  outline: "none",
});

globalStyle(".rk-menu-item", {
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2.5)`,
  minHeight: `calc(${tokens.hSm} + 2px)`,
  width: "100%",
  padding: `4px calc(${tokens.space} * 2.5)`,
  margin: "0",
  border: "0",
  borderRadius: `calc(${tokens.radiusMd} - 5px)`,
  background: "transparent",
  color: `${tokens.text}`,
  font: "inherit",
  fontSize: `${tokens.textMd}`,
  textAlign: "start",
  cursor: "pointer",
  outline: "none",
  scrollMargin: "5px",
});

globalStyle('.rk-menu-item:focus-visible, .rk-menu-item:focus, .rk-menu-item[data-active="true"]', {
  background: `${tokens.press}`,
});

globalStyle('.rk-menu-item[aria-selected="true"]', { color: `${tokens.text}`, fontWeight: "500" });

globalStyle('.rk-menu-item[aria-disabled="true"]', { opacity: "0.4", cursor: "default" });

globalStyle(".rk-menu-item[data-danger]", { color: `oklch(from ${tokens.danger} calc(l + 0.08) c h)` });

globalStyle(".rk-menu-item[data-danger]:focus", {
  background: `color-mix(in oklab, ${tokens.danger} 16%, transparent)`,
});

globalStyle(".rk-menu-icon", { fontSize: "1.1em", color: `${tokens.text2}` });

globalStyle("[data-danger] > .rk-menu-icon", { color: "inherit" });

globalStyle(".rk-menu-media,\n.rk-select-media", {
  display: "inline-flex",
  flexShrink: "0",
  width: "auto",
  height: "1.5em",
  maxWidth: "2.5em",
  overflow: "hidden",
  borderRadius: `calc(${tokens.radiusSm} * 0.7)`,
});

globalStyle(":is(.rk-menu-media,\n.rk-select-media) > :is(img, svg, video)", {
  width: "auto",
  height: "100%",
  objectFit: "cover",
});

globalStyle(".rk-menu-text", { display: "flex", flex: "1", flexDirection: "column", minWidth: "0" });

globalStyle(".rk-select-group", { minWidth: "0", margin: "0", padding: "0", border: "0" });

globalStyle(".rk-menu-hint", { fontSize: `${tokens.textXs}`, color: `${tokens.text3}`, fontWeight: "400" });

globalStyle(".rk-menu-check", { flexShrink: "0", color: `${tokens.accentText}` });

globalStyle(".rk-menu-shortcut", {
  marginInlineStart: "auto",
  paddingInlineStart: "12px",
  fontFamily: `${tokens.fontMono}`,
  fontSize: `${tokens.text2xs}`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-menu-separator", {
  height: "1px",
  margin: "4px 6px",
  background: `${tokens.line}`,
  flexShrink: "0",
});

globalStyle(".rk-menu-status", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 10px",
  color: `${tokens.text3}`,
});

globalStyle(".rk-menu-label", {
  padding: "6px 10px 2px",
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: `${tokens.text3}`,
});

globalStyle(".rk-select-list[data-mono]", { fontFamily: `${tokens.fontMono}` });

globalStyle(".rk-popover", {
  minWidth: "220px",
  maxWidth: "min(420px, calc(100vw - 16px))",
  maxHeight: "var(--rk-available-h, 480px)",
  overflow: "auto",
  padding: `${tokens.pad}`,
  borderRadius: `${tokens.radiusLg}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
  boxShadow: `${tokens.shadowPop}`,
});

globalStyle(".rk-popover-title", {
  marginBottom: `calc(${tokens.space} * 3)`,
  fontSize: `${tokens.textMd}`,
  fontWeight: "600",
});

globalStyle(".rk-select-trigger", {
  display: "inline-flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
  width: "100%",
  minWidth: "0",
  height: "var(--rk-sel-h)",
  padding: `0 calc(${tokens.space} * 2.5) 0 calc(${tokens.space} * 3)`,
  margin: "0",
  border: "0",
  font: "inherit",
  fontSize: `${tokens.textMd}`,
  textAlign: "start",
  cursor: "pointer",
  vars: { "--rk-sel-h": `${tokens.hMd}` },
});

globalStyle('.rk-select-trigger[data-size="sm"]', {
  paddingInlineStart: `calc(${tokens.space} * 2.5)`,
  fontSize: `${tokens.textSm}`,
  vars: { "--rk-sel-h": `${tokens.hSm}` },
});

globalStyle('.rk-select-trigger[data-size="lg"]', { vars: { "--rk-sel-h": `${tokens.hLg}` } });

globalStyle(".rk-select-trigger[data-mono] .rk-select-value", {
  fontFamily: `${tokens.fontMono}`,
  fontSize: "0.94em",
});

globalStyle('.rk-select-trigger[data-variant="button"]', {
  width: "auto",
  background: `${tokens.surface3}`,
  fontWeight: "500",
});

globalStyle('.rk-select-trigger[data-variant="button"]:hover', { background: `${tokens.surface4}` });

globalStyle(".rk-select-value", {
  flex: "1",
  minWidth: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-select-value[data-placeholder]", { color: `${tokens.text3}` });

globalStyle(".rk-select-chevron", {
  flexShrink: "0",
  color: `${tokens.text3}`,
  transition: `rotate ${tokens.dur} ${tokens.ease}`,
});

globalStyle('[aria-expanded="true"] > .rk-select-chevron', { rotate: "180deg" });

globalStyle('.rk-menu-sub-trigger[aria-expanded="true"]', { background: `${tokens.press}` });

globalStyle(".rk-menu-sub-chevron", { flexShrink: "0", marginInlineStart: "auto", color: `${tokens.text3}` });

globalStyle(".rk-tree-select", { gap: "6px", maxWidth: "min(420px, calc(100vw - 16px))" });

globalStyle(".rk-tree-select .rk-tree", { overflowY: "auto", minHeight: "0" });
