import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-heatmap", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  minWidth: "0",
});

globalStyle(".rk-heatmap-bar", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: `${tokens.space}`,
});

globalStyle(".rk-heatmap-scale", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: `${tokens.text2}`,
  fontSize: `${tokens.textXs}`,
});

globalStyle(".rk-heatmap-ramp", {
  width: "120px",
  height: "8px",
  borderRadius: `${tokens.radiusPill}`,
  background: `linear-gradient(to right in oklch, ${tokens.chartSeqLo}, ${tokens.chartSeqHi})`,
});

globalStyle(".rk-heatmap-swatch", {
  width: "12px",
  height: "12px",
  marginLeft: "8px",
  borderRadius: `calc(3px * ${tokens.roundness})`,
  background: `${tokens.hatch}, ${tokens.wellSoft}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(".rk-heatmap-grid", {
  display: "grid",
  gridTemplateColumns: "max-content repeat(var(--rk-cols), minmax(16px, 1fr))",
  gap: "2px",
  outline: "none",
  maxWidth: "100%",
  overflowX: "auto",
  overscrollBehaviorX: "contain",
});

globalStyle(".rk-heatmap-row", {
  display: "grid",
  gridColumn: "1 / -1",
  gridTemplateColumns: "subgrid",
  alignItems: "center",
});

globalStyle(".rk-heatmap-rowhead,\n.rk-heatmap-col", {
  color: `${tokens.text3}`,
  fontSize: `${tokens.textXs}`,
  transition: `color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(":is(.rk-heatmap-rowhead,\n.rk-heatmap-col)[data-hot]", { color: `${tokens.text}` });

globalStyle(".rk-heatmap-rowhead", { paddingRight: "8px", textAlign: "end", whiteSpace: "nowrap" });

globalStyle(".rk-heatmap-col", {
  display: "flex",
  justifyContent: "center",
  alignSelf: "end",
  paddingBottom: "6px",
});

globalStyle(".rk-heatmap-col > span", {
  maxHeight: "120px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  writingMode: "vertical-rl",
  rotate: "180deg",
});

globalStyle(".rk-heatmap-cell", {
  display: "grid",
  placeItems: "center",
  aspectRatio: "1",
  borderRadius: `calc(3px * ${tokens.roundness})`,
  color: `${tokens.text}`,
  fontSize: `${tokens.text2xs}`,
  transition: `box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-heatmap-cell[data-bright]", { color: `${tokens.onInverse}` });

globalStyle(".rk-heatmap-cell[data-empty]", { background: `${tokens.hatch}, ${tokens.wellSoft}` });

globalStyle(".rk-heatmap-cell:hover, .rk-heatmap-cell:focus-visible", {
  outline: "none",
  boxShadow: `0 0 0 2px ${tokens.surface1},
      0 0 0 3.5px ${tokens.text}`,
});
