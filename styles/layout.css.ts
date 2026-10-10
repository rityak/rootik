import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-shell", {
  display: "flex",
  gap: "var(--rk-shell-gap)",
  height: "100dvh",
  minHeight: "0",
  padding: "var(--rk-shell-gap)",
  background: `var(--rk-ambient, none), var(--rk-backdrop, none), ${tokens.bg}`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  overflow: "hidden",
  vars: {
    "--rk-shell-gap": `calc(${tokens.space} * 2.5 * var(--rk-shell-space, 1))`,
    "--rk-shell-round": "clamp(0, var(--rk-shell-space, 1) * 1000, 1)",
  },
});

globalStyle(
  ".rk-shell :is(.rk-shell-sidebar, .rk-shell-aside, .rk-shell-panel, .rk-shell-dockbar > .rk-dock)",
  { borderRadius: `calc(${tokens.radiusLg} * var(--rk-shell-round))` },
);

globalStyle('.rk-shell[data-background="none"]', { background: "transparent" });

globalStyle(".rk-shell-sidebar", { display: "flex", flexShrink: "0", minHeight: "0" });

globalStyle(".rk-shell-main", {
  display: "flex",
  flex: "1",
  flexDirection: "column",
  gap: "var(--rk-shell-gap)",
  minWidth: "0",
  minHeight: "0",
});

globalStyle(".rk-shell-header", { flexShrink: "0" });

globalStyle(".rk-shell :is(.rk-shell-header, .rk-shell-footer)", {
  borderRadius: `calc(${tokens.radiusMd} * var(--rk-shell-round))`,
});

globalStyle('.rk-shell :is(.rk-shell-header, .rk-shell-footer)[data-shape="pill"]', {
  borderRadius: `calc(${tokens.radiusPill} * var(--rk-shell-round))`,
});

globalStyle(".rk-shell-body", {
  position: "relative",
  display: "flex",
  flex: "1",
  gap: "var(--rk-shell-gap)",
  minHeight: "0",
});

globalStyle(".rk-shell-content", {
  display: "flex",
  flex: "1",
  flexDirection: "column",
  minWidth: "0",
  minHeight: "0",
  overflow: "auto",
  padding: `calc(${tokens.pad} * (1 - var(--rk-shell-round)))`,
});

globalStyle(".rk-shell-content[data-dock]", {
  paddingBottom: "calc(var(--rk-dock-height) + var(--rk-shell-gap) * 2)",
});

globalStyle(".rk-shell-content > .rk-page-header", { paddingInline: "4px" });

globalStyle(".rk-shell-content .rk-page-column", {
  paddingInline: "0",
  paddingTop: `calc(${tokens.space} * 1)`,
});

globalStyle(".rk-shell-aside", { display: "flex", flexShrink: "0", minHeight: "0" });

globalStyle(".rk-shell-dock", {
  position: "absolute",
  bottom: "calc(var(--rk-shell-gap) + 4px)",
  left: "50%",
  zIndex: "3",
  translate: "-50% 0",
});

globalStyle(".rk-shell-dockbar", { display: "flex", flexShrink: "0", minWidth: "0" });

globalStyle(".rk-shell-dockbar > .rk-dock", { flex: "1" });

globalStyle(".rk-shell-footer", { flexShrink: "0", overflow: "hidden" });

globalStyle(".rk-shell-footer .rk-status-bar", { borderTop: "0" });

globalStyle('.rk-shell[data-variant="inset"]', { backgroundColor: `${tokens.sunken}` });

globalStyle('.rk-shell[data-variant="inset"] .rk-shell-main', { gap: "0" });

globalStyle(
  '.rk-shell[data-variant="inset"] .rk-shell-header, .rk-shell[data-variant="inset"] .rk-shell-footer',
  { borderRadius: "0" },
);

globalStyle('.rk-shell[data-variant="inset"] .rk-shell-header', {
  paddingBottom: "calc(var(--rk-shell-gap) * 0.6)",
});

globalStyle('.rk-shell[data-variant="inset"] .rk-shell-footer', {
  marginTop: "calc(var(--rk-shell-gap) * 0.4)",
});

globalStyle('.rk-shell[data-variant="inset"] .rk-shell-body', { gap: "0" });

globalStyle('.rk-shell[data-variant="inset"] .rk-shell-content', { padding: `${tokens.pad}` });

globalStyle('.rk-shell[data-variant="inset"] .rk-shell-content[data-dock]', {
  paddingBottom: "calc(var(--rk-dock-height) + var(--rk-shell-gap) * 2)",
});

globalStyle('.rk-shell[data-variant="inset"] .rk-shell-aside', {
  borderInlineStart: `1px solid ${tokens.line}`,
});

globalStyle(".rk-shell-panel", {
  overflow: "hidden",
  borderRadius: `${tokens.radiusLg}`,
  background: `var(--rk-surface-sheen, none),
    color-mix(in oklab, ${tokens.bg} var(--rk-surface-alpha, 100%), transparent)`,
  backdropFilter: "var(--rk-surface-filter, none)",
  boxShadow: `var(--rk-surface-shadow, ${tokens.shadow1})`,
});

globalStyle(".rk-shell-panel::before", {
  content: '""',
  position: "absolute",
  inset: "0",
  zIndex: "4",
  padding: "1px",
  borderRadius: "inherit",
  background: "var(--rk-surface-edge, none)",
  mask: "linear-gradient(black 0 0) content-box,\n      linear-gradient(black 0 0)",
  maskComposite: "exclude",
  pointerEvents: "none",
});

globalStyle(".rk-shell[data-inactive]", {
  vars: { [tokens.inverse]: `${tokens.surface4}`, [tokens.onInverse]: `${tokens.text}` },
});

globalStyle(".rk-shell[data-inactive] .rk-titlebar", {
  opacity: "0.6",
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-titlebar", {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: "12px",
  minHeight: `calc(${tokens.hMd} + 16px)`,
  padding: "6px 8px 6px 14px",
  userSelect: "none",
  container: "rk-titlebar / inline-size",
});

globalStyle(".rk-titlebar-start", {
  "@container": { "rk-titlebar (width < 32rem)": { gridArea: "1 / 1 / 2 / 3" } },
});

globalStyle(".rk-titlebar-end", { "@container": { "rk-titlebar (width < 32rem)": { gridArea: "1 / 3" } } });

globalStyle(".rk-titlebar-center", {
  "@container": { "rk-titlebar (width < 32rem)": { gridArea: "2 / 1 / 3 / -1", justifyContent: "stretch" } },
});

globalStyle(".rk-titlebar-center > *", { "@container": { "rk-titlebar (width < 32rem)": { flex: "1" } } });

globalStyle(".rk-titlebar-start,\n.rk-titlebar-end", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minWidth: "0",
});

globalStyle(".rk-titlebar-end", { justifyContent: "flex-end" });

globalStyle(".rk-titlebar-center", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "0",
});

globalStyle(".rk-titlebar-controls", { display: "flex", gap: "2px", marginInlineStart: "4px" });

globalStyle(".rk-titlebar-controls button", {
  display: "grid",
  placeItems: "center",
  width: "32px",
  height: "28px",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusControl}`,
  background: "transparent",
  color: `${tokens.text3}`,
  fontSize: "14px",
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
      color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-titlebar-controls button:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });

globalStyle(".rk-titlebar-controls button[data-close]:hover", {
  background: `${tokens.danger}`,
  color: `${tokens.onDanger}`,
});

globalStyle(".rk-page-header", {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px 20px",
  minHeight: "56px",
  padding: `10px calc(${tokens.pad} * 1.25)`,
  flexShrink: "0",
});

globalStyle('.rk-page-header[data-size="lg"]', {
  alignItems: "flex-end",
  paddingBlock: `calc(${tokens.pad} * 1.5) ${tokens.pad}`,
});

globalStyle('.rk-page-header[data-size="lg"] .rk-page-title', {
  fontSize: `${tokens.text3xl}`,
  fontWeight: "400",
  letterSpacing: "-0.035em",
  lineHeight: "1.05",
});

globalStyle('.rk-page-header[data-size="lg"] .rk-page-desc', {
  marginTop: "6px",
  fontSize: `${tokens.textMd}`,
});

globalStyle(".rk-page-titles", { flex: "1 1 240px", minWidth: "0" });

globalStyle(".rk-page-eyebrow", { marginBottom: "6px" });

globalStyle(".rk-page-title", {
  margin: "0",
  fontSize: `${tokens.textLg}`,
  fontWeight: "600",
  letterSpacing: "-0.015em",
  lineHeight: "1.25",
});

globalStyle(".rk-page-desc", {
  margin: "2px 0 0",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text3}`,
  textWrap: "pretty",
});

globalStyle(".rk-page-actions", { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" });

globalStyle(".rk-page-body", { flex: "1", minHeight: "0", overflowY: "auto", containerType: "scroll-state" });

globalStyle(".rk-page-body::before", {
  content: '""',
  position: "sticky",
  top: "0",
  zIndex: "3",
  display: "block",
  height: "1px",
  marginBottom: "-1px",
  transition: `box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-page-body::before", {
  "@container": {
    "scroll-state(scrollable: top)": {
      boxShadow: `0 0 0 1px ${tokens.line},
      0 4px 12px 0 oklch(${tokens.shade} / 0.5)`,
    },
  },
});

globalStyle(".rk-page-column", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  margin: "0 auto",
  padding: `${tokens.pad} calc(${tokens.pad} * 1.25) calc(${tokens.pad} * 2)`,
});

globalStyle(".rk-toolbar", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minHeight: `calc(${tokens.hMd} + 14px)`,
  padding: "6px 12px",
  borderBottom: `1px solid ${tokens.line}`,
  flexShrink: "0",
  overflowX: "auto",
  scrollbarWidth: "none",
});

globalStyle(".rk-spacer", { flex: "1" });

globalStyle(".rk-action-bar", {
  flexShrink: "0",
  padding: `10px calc(${tokens.pad} * 1.25)`,
  borderTop: `1px solid ${tokens.line}`,
  background: `${tokens.wellSoft}`,
});

globalStyle(".rk-action-bar-row", { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" });

globalStyle(".rk-action-bar-status", {
  flex: "1",
  minWidth: "0",
  marginInlineEnd: "auto",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-status-bar", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  height: "28px",
  padding: "0 12px",
  borderTop: `1px solid ${tokens.line}`,
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
  flexShrink: "0",
});

globalStyle(".rk-status-bar-dot", {
  width: "6px",
  height: "6px",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.accent}`,
  animation: `rk-pulse calc(${tokens.durSlow} * 3.75) ease-in-out infinite`,
  animationPlayState: `${tokens.animationState}`,
});

globalStyle(".rk-status-bar-end", {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginInlineStart: "auto",
});

globalStyle(".rk-status-bar-progress", {
  position: "absolute",
  top: "-1px",
  left: "0",
  height: "2px",
  background: `${tokens.accent}`,
  boxShadow: `0 0 8px ${tokens.accent}`,
  transition: `width ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle(".rk-resizable", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flexShrink: "0",
  minWidth: "0",
  minHeight: "0",
});

globalStyle(".rk-resize-handle", { position: "absolute", zIndex: "2", touchAction: "none", outline: "none" });

globalStyle(".rk-resize-handle::after", {
  content: '""',
  position: "absolute",
  borderRadius: `calc(2px * ${tokens.roundness})`,
  background: `${tokens.accent}`,
  opacity: "0",
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(
  ".rk-resize-handle:hover::after, .rk-resize-handle:focus-visible::after, .rk-resize-handle:active::after",
  { opacity: "0.8" },
);

globalStyle('[data-handle="right"] > .rk-resize-handle, [data-handle="left"] > .rk-resize-handle', {
  top: "0",
  bottom: "0",
  width: "9px",
  cursor: "col-resize",
});

globalStyle(
  ':is([data-handle="right"] > .rk-resize-handle, [data-handle="left"] > .rk-resize-handle)::after',
  { top: "0", bottom: "0", left: "4px", width: "2px" },
);

globalStyle('[data-handle="right"] > .rk-resize-handle', { right: "-5px" });

globalStyle('[data-handle="left"] > .rk-resize-handle', { left: "-5px" });

globalStyle('[data-handle="top"] > .rk-resize-handle, [data-handle="bottom"] > .rk-resize-handle', {
  left: "0",
  right: "0",
  height: "9px",
  cursor: "row-resize",
});

globalStyle(
  ':is([data-handle="top"] > .rk-resize-handle, [data-handle="bottom"] > .rk-resize-handle)::after',
  { left: "0", right: "0", top: "4px", height: "2px" },
);

globalStyle('[data-handle="top"] > .rk-resize-handle', { top: "-5px" });

globalStyle('[data-handle="bottom"] > .rk-resize-handle', { bottom: "-5px" });

globalStyle(".rk-disclosure", { borderRadius: `${tokens.radiusMd}`, interpolateSize: "allow-keywords" });

globalStyle(".rk-disclosure::details-content", {
  blockSize: "0",
  overflowY: "clip",
  transition: `block-size ${tokens.durSlow} ${tokens.easeOut},
      content-visibility ${tokens.durSlow} allow-discrete`,
});

globalStyle(".rk-disclosure[open]::details-content", { blockSize: "auto" });

globalStyle(".rk-disclosure > summary", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minHeight: `${tokens.hMd}`,
  padding: "0 6px",
  borderRadius: `${tokens.radiusControl}`,
  listStyle: "none",
  fontWeight: "500",
  cursor: "pointer",
  userSelect: "none",
});

globalStyle(".rk-disclosure > summary::-webkit-details-marker", { display: "none" });

globalStyle(".rk-disclosure > summary:hover", { background: `${tokens.hover}` });

globalStyle(".rk-disclosure[open] > summary .rk-disclosure-chevron", { rotate: "90deg" });

globalStyle(".rk-disclosure + .rk-disclosure", { borderTop: `1px solid ${tokens.line}`, borderRadius: "0" });

globalStyle(".rk-disclosure-chevron", {
  flexShrink: "0",
  color: `${tokens.text3}`,
  transition: `rotate ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-disclosure-title", { flex: "1", minWidth: "0" });

globalStyle(".rk-disclosure-body", { padding: "4px 6px 12px 28px", color: `${tokens.text2}` });

globalStyle(".rk-skip", {
  position: "absolute",
  top: "calc(var(--rk-shell-gap) + 6px)",
  left: "calc(var(--rk-shell-gap) + 6px)",
  zIndex: "10",
  padding: "8px 14px",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.inverse}`,
  color: `${tokens.onInverse}`,
  fontWeight: "500",
  textDecoration: "none",
  translate: "0 calc(-100% - 40px)",
});

globalStyle(".rk-skip:focus-visible", { translate: "none" });

globalStyle(".rk-shell-content:focus", { outline: "none" });

globalStyle(".rk-shell", { position: "relative" });

globalStyle(".rk-shell-sidebar", { width: "var(--rk-sidebar-w, auto)" });

globalStyle(".rk-shell[data-compact] .rk-shell-sidebar", { width: "auto" });

globalStyle(".rk-shell[data-compact] .rk-shell-body:has(> .rk-shell-aside)", {
  flexDirection: "column",
  overflowY: "auto",
});

globalStyle(".rk-shell[data-compact] .rk-shell-body:has(> .rk-shell-aside) > .rk-shell-content", {
  flex: "none",
  overflow: "visible",
});

globalStyle(".rk-shell[data-compact] .rk-shell-body:has(> .rk-shell-aside) > .rk-shell-aside", {
  width: "auto",
});

globalStyle(".rk-shell[data-compact] .rk-shell-body:has(> .rk-shell-aside) > .rk-shell-dock", {
  position: "sticky",
  left: "auto",
  alignSelf: "center",
  marginTop: "auto",
  translate: "none",
});

globalStyle(".rk-shell-drawer-body", { display: "flex", flex: "1", minHeight: "0", padding: "0" });

globalStyle(".rk-shell-drawer-inner", { display: "flex", flex: "1", minHeight: "0" });

globalStyle(".rk-shell-drawer-inner > *", { flex: "1" });

globalStyle(".rk-master-detail", {
  display: "grid",
  gridTemplateColumns: "var(--rk-md-list-w) minmax(0, 1fr)",
  gap: "var(--rk-gap, 12px)",
  minHeight: "0",
});

globalStyle(".rk-master-detail[data-stacked]", { gridTemplateColumns: "minmax(0, 1fr)" });

globalStyle(".rk-master-detail-list,\n.rk-master-detail-detail", {
  display: "flex",
  flexDirection: "column",
  minWidth: "0",
  minHeight: "0",
});

globalStyle(".rk-master-detail-bar", { display: "flex", alignItems: "center", marginBottom: "8px" });

globalStyle(".rk-master-detail-back", {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  height: `${tokens.hSm}`,
  padding: "0 10px 0 6px",
  border: "0",
  borderRadius: `${tokens.radiusControl}`,
  background: "transparent",
  color: `${tokens.text2}`,
  font: "inherit",
  fontSize: `${tokens.textSm}`,
  cursor: "pointer",
});

globalStyle(".rk-master-detail-back:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });
