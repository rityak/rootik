import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-table-wrap", { minWidth: "0", overflow: "auto", containerType: "scroll-state" });

globalStyle(".rk-table-wrap[data-framed]", {
  borderRadius: `${tokens.radiusMd}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(".rk-table-wrap:focus-visible", { outlineOffset: "-2px" });

globalStyle(".rk-table-wrap:has(> [data-sticky])::-webkit-scrollbar-track:vertical", { marginTop: "34px" });

globalStyle(".rk-table .rk-table-select", { width: "1%", paddingRight: "0" });

globalStyle(".rk-table .rk-table-select .rk-checkbox", { verticalAlign: "middle" });

globalStyle(".rk-table", {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0",
  fontSize: `${tokens.textSm}`,
  fontVariantNumeric: "tabular-nums",
  vars: { "--rk-cell-py": "8px" },
});

globalStyle('.rk-table[data-density="compact"]', { vars: { "--rk-cell-py": "4px" } });

globalStyle('.rk-table[data-density="comfortable"]', { vars: { "--rk-cell-py": "12px" } });

globalStyle(".rk-table th, .rk-table td", {
  padding: "var(--rk-cell-py) 12px",
  textAlign: "start",
  verticalAlign: "middle",
  borderBottom: `1px solid ${tokens.line}`,
});

globalStyle(".rk-table th", {
  height: "34px",
  paddingBlock: "0",
  color: `${tokens.text3}`,
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
});

globalStyle(".rk-table td", { color: `${tokens.text}` });

globalStyle(".rk-table td[data-mono]", { fontFamily: `${tokens.fontMono}`, fontSize: "0.94em" });

globalStyle(".rk-table tbody tr:last-child td", { borderBottom: "0" });

globalStyle(".rk-table tbody tr", { transition: `background-color ${tokens.dur} ${tokens.ease}` });

globalStyle(".rk-table tbody tr:hover", { background: `${tokens.hover}` });

globalStyle(".rk-table tbody tr[data-clickable]", { cursor: "pointer" });

globalStyle('.rk-table tbody tr[aria-selected="true"]', {
  background: `${tokens.accentSoft}`,
  boxShadow: `inset 2px 0 0 ${tokens.accent}`,
});

globalStyle(".rk-table tbody tr:focus-visible", {
  outline: `2px solid ${tokens.focus}`,
  outlineOffset: "-2px",
});

globalStyle('.rk-table[data-zebra] tbody tr:nth-child(even):not(:hover):not([aria-selected="true"])', {
  background: `oklch(${tokens.tint} / 0.025)`,
});

globalStyle(
  '.rk-table[data-zebra][data-virtual] tbody tr:nth-child(even):not(:hover):not([aria-selected="true"])',
  { background: "none" },
);

globalStyle(
  '.rk-table[data-zebra][data-virtual] tbody tr[data-alt]:not(:hover):not([aria-selected="true"])',
  { background: `oklch(${tokens.tint} / 0.025)` },
);

globalStyle(".rk-table[data-sticky] thead th", {
  position: "sticky",
  top: "0",
  zIndex: "1",
  background: `${tokens.surface1}`,
  transition: `box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-table[data-sticky] thead th", {
  "@container": {
    "scroll-state(scrollable: top)": {
      boxShadow: `inset 0 -1px 0 ${tokens.line},
      0 6px 12px -8px oklch(${tokens.shade} / 0.7)`,
    },
  },
});

globalStyle(".rk-th-sort", {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  margin: "0 -4px",
  padding: "4px",
  border: "0",
  borderRadius: `calc(6px * ${tokens.roundness})`,
  background: "none",
  color: "inherit",
  font: "inherit",
  letterSpacing: "inherit",
  textTransform: "inherit",
  cursor: "pointer",
});

globalStyle(".rk-th-sort svg", { width: "12px", height: "12px", opacity: "0.5" });

globalStyle(".rk-th-sort:hover", { color: `${tokens.text}`, background: `${tokens.hover}` });

globalStyle(".rk-th-sort[data-sorted]", { color: `${tokens.text}` });

globalStyle(".rk-th-sort[data-sorted] svg", { opacity: "1" });

globalStyle(".rk-table[data-resizable]:not([data-sticky]) th", { position: "relative" });

globalStyle(".rk-table[data-fixed] :is(th, td):not(.rk-table-select)", {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-th-content", { display: "inline-flex", maxWidth: "100%", verticalAlign: "middle" });

globalStyle(".rk-th-resize", {
  position: "absolute",
  top: "0",
  right: "0",
  bottom: "0",
  width: "9px",
  cursor: "col-resize",
  touchAction: "none",
  outline: "none",
});

globalStyle(".rk-th-resize::after", {
  content: '""',
  position: "absolute",
  top: "30%",
  bottom: "30%",
  right: "0",
  width: "1px",
  background: `${tokens.lineStrong}`,
  transition: `background-color ${tokens.dur} ${tokens.ease},
      inset ${tokens.dur} ${tokens.ease},
      width ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-th-resize:is(:hover, :focus-visible, :active)::after", {
  top: "0",
  bottom: "0",
  width: "2px",
  background: `${tokens.accent}`,
});

globalStyle(".rk-table-tree-cell", {
  backgroundImage: `repeating-linear-gradient(
    to right,
    transparent 0 9px,
    ${tokens.lineStrong} 9px 10px,
    transparent 10px var(--rk-indent)
  )`,
  backgroundSize: "calc(var(--rk-depth, 0) * var(--rk-indent)) 100%",
  backgroundPosition: "12px 0",
  backgroundRepeat: "no-repeat",
  vars: { "--rk-indent": "20px" },
});

globalStyle(".rk-table-tree-inner", {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  maxWidth: "100%",
  marginInlineStart: "calc(var(--rk-depth, 0) * var(--rk-indent))",
  verticalAlign: "middle",
});

globalStyle(".rk-table-tree-content", { minWidth: "0", overflow: "hidden", textOverflow: "ellipsis" });

globalStyle(".rk-table[data-virtual] :is(th, td):not(.rk-table-select)", {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-table[data-virtual] tbody tr", { scrollMarginTop: "var(--rk-table-head, 0px)" });

globalStyle(".rk-table[data-virtual] tr.rk-table-spacer td", { padding: "0", border: "0" });

globalStyle(".rk-table td.rk-table-empty", {
  padding: "32px 12px",
  textAlign: "center",
  color: `${tokens.text3}`,
});

globalStyle(".rk-tree", {
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  fontSize: `${tokens.textMd}`,
});

globalStyle(".rk-tree-row", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  height: `${tokens.hSm}`,
  padding: "0 6px 0 calc(4px + var(--rk-depth) * 16px)",
  borderRadius: `${tokens.radiusControl}`,
  color: `${tokens.text2}`,
  cursor: "pointer",
  userSelect: "none",
  outline: "none",
  vars: { "--rk-depth": "0" },
});

globalStyle(".rk-tree-row:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });

globalStyle(".rk-tree-row:focus-visible", { boxShadow: `inset 0 0 0 2px ${tokens.focus}` });

globalStyle('.rk-tree-row[aria-selected="true"]', {
  background: `${tokens.inverse}`,
  color: `${tokens.onInverse}`,
});

globalStyle(
  '.rk-tree-row[aria-selected="true"] .rk-tree-icon, .rk-tree-row[aria-selected="true"] .rk-tree-toggle',
  { color: "inherit" },
);

globalStyle('.rk-tree-row[aria-disabled="true"]', { opacity: "0.45", cursor: "default" });

globalStyle('.rk-tree-row:not([aria-level="1"])::before', {
  content: '""',
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "calc(13px + (var(--rk-depth) - 1) * 16px)",
  width: "1px",
  background: `${tokens.line}`,
});

globalStyle(".rk-tree[data-virtual]", { display: "block", overflow: "auto" });

globalStyle(".rk-tree[data-virtual] .rk-tree-row", { height: `calc(${tokens.hSm})` });

globalStyle(".rk-tree-space", { position: "relative" });

globalStyle('.rk-tree-row[data-drop="inside"]', {
  background: `${tokens.accentSoft}`,
  boxShadow: `inset 0 0 0 1px ${tokens.accentLine}`,
});

globalStyle('.rk-tree-row:is([data-drop="before"], [data-drop="after"])::after', {
  content: '""',
  position: "absolute",
  left: "calc(4px + var(--rk-depth) * 16px)",
  right: "4px",
  height: "2px",
  borderRadius: `calc(1px * ${tokens.roundness})`,
  background: `${tokens.accent}`,
});

globalStyle('.rk-tree-row[data-drop="before"]::after', { top: "-1px" });

globalStyle('.rk-tree-row[data-drop="after"]::after', { bottom: "-1px" });

globalStyle(".rk-tree-check", {
  display: "grid",
  placeItems: "center",
  flexShrink: "0",
  width: "15px",
  height: "15px",
  borderRadius: `calc(4px * ${tokens.roundness})`,
  boxShadow: `inset 0 0 0 1.5px ${tokens.controlEdge}`,
  color: `${tokens.onAccent}`,
  fontSize: "11px",
});

globalStyle(".rk-tree-check svg", { strokeWidth: "3", opacity: "0" });

globalStyle(".rk-tree-check[data-state]", { background: `${tokens.accent}`, boxShadow: "none" });

globalStyle(".rk-tree-check[data-state] svg", { opacity: "1" });

globalStyle(".rk-tree-toggle", {
  display: "grid",
  placeItems: "center",
  flexShrink: "0",
  width: "18px",
  height: "18px",
  borderRadius: `calc(5px * ${tokens.roundness})`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-tree-toggle svg", { transition: `rotate ${tokens.dur} ${tokens.ease}` });

globalStyle(".rk-tree-toggle svg[data-open]", { rotate: "90deg" });

globalStyle(".rk-tree-toggle:hover", { background: `${tokens.press}` });

globalStyle(".rk-tree-icon", { fontSize: "15px", color: `${tokens.text3}` });

globalStyle(".rk-tree-label", {
  flex: "1",
  minWidth: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-tree-trailing", {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  flexShrink: "0",
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
});

globalStyle('[aria-selected="true"] > .rk-tree-trailing', { color: "inherit", opacity: "0.7" });

globalStyle(".rk-table .rk-table-pin", {
  position: "sticky",
  zIndex: "1",
  background: `linear-gradient(var(--rk-pin-tint), var(--rk-pin-tint)), ${tokens.surface1}`,
  vars: { "--rk-pin-tint": "transparent" },
});

globalStyle(".rk-table .rk-table-pin[data-pin-edge]", { boxShadow: `inset -1px 0 0 ${tokens.line}` });

globalStyle("tr:hover > :is(.rk-table .rk-table-pin)", { vars: { "--rk-pin-tint": `${tokens.hover}` } });

globalStyle('tr[aria-selected="true"] > :is(.rk-table .rk-table-pin)', {
  vars: { "--rk-pin-tint": `${tokens.accentSoft}` },
});

globalStyle(".rk-table thead .rk-table-pin", { zIndex: "2" });
