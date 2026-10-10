import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-chart-frame", { display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" });

globalStyle(".rk-chart-top", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  minHeight: "24px",
});

globalStyle(".rk-chart-top .rk-chart-toggle", { marginInlineStart: "auto" });

globalStyle(".rk-chart-table tbody th", {
  color: `${tokens.text2}`,
  fontSize: "inherit",
  fontWeight: "400",
  letterSpacing: "normal",
  textTransform: "none",
});

globalStyle(".rk-chart", {
  position: "relative",
  minWidth: "0",
  width: "100%",
  fontVariantNumeric: "tabular-nums",
});

globalStyle(".rk-chart svg", { display: "block", overflow: "visible" });

globalStyle(".rk-chart-tick", { fill: `${tokens.text3}`, fontSize: `${tokens.text2xs}` });

globalStyle(".rk-chart-tick[data-hot]", { fill: `${tokens.text}`, fontWeight: "500" });

globalStyle(".rk-chart-label", { fill: `${tokens.text2}`, fontSize: `${tokens.textXs}` });

globalStyle(".rk-chart-value", { fill: `${tokens.text}`, fontSize: `${tokens.textXs}`, fontWeight: "500" });

globalStyle(".rk-chart-bar path", {
  transition: `fill ${tokens.dur} ${tokens.ease},
      opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-chart-bar[data-hot] path:last-of-type", { filter: "brightness(1.15)" });

globalStyle(".rk-chart-ref line", { stroke: `${tokens.text2}`, strokeDasharray: "3 4" });

globalStyle(".rk-chart-ref text", {
  fill: `${tokens.text2}`,
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
});

globalStyle(".rk-chart-tip", {
  position: "absolute",
  zIndex: "2",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: "80px",
  padding: "6px 10px",
  borderRadius: `calc(10px * ${tokens.roundness})`,
  background: `${tokens.inverse}`,
  color: `${tokens.onInverse}`,
  boxShadow: `0 8px 24px -8px oklch(${tokens.shade} / 0.6)`,
  fontSize: `${tokens.textXs}`,
  lineHeight: "1.3",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  translate: "-50% calc(-100% - 10px)",
});

globalStyle(".rk-chart-tip strong", { fontSize: `${tokens.textMd}`, fontWeight: "600" });

globalStyle(".rk-chart-tip > span:not(.rk-chart-tip-row)", { opacity: "0.7" });

globalStyle(".rk-chart-tip-head", { marginBottom: "2px", fontWeight: "500" });

globalStyle(".rk-chart-tip-row", { display: "flex", alignItems: "center", gap: "6px" });

globalStyle(".rk-chart-tip-row > span:last-child", { opacity: "0.65" });

globalStyle(".rk-legend", {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px 16px",
  margin: "0",
  padding: "0",
  listStyle: "none",
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-legend li", { display: "inline-flex", alignItems: "center", gap: "6px" });

globalStyle(".rk-legend-key", {
  flexShrink: "0",
  width: "10px",
  height: "10px",
  borderRadius: `calc(3px * ${tokens.roundness})`,
});

globalStyle('.rk-legend-key[data-shape="line"]', {
  width: "14px",
  height: "2px",
  borderRadius: `calc(1px * ${tokens.roundness})`,
});

globalStyle('.rk-legend-key[data-shape="dot"]', {
  width: "8px",
  height: "8px",
  borderRadius: `${tokens.radiusRound}`,
});

globalStyle(".rk-sparkline", { width: "100%", minWidth: "40px" });

globalStyle(".rk-sparkline svg", { display: "block", overflow: "visible" });

globalStyle(".rk-gauge", { position: "relative", display: "inline-block", flexShrink: "0" });

globalStyle(".rk-gauge svg", { display: "block" });

globalStyle(".rk-gauge line", { transition: `stroke ${tokens.durSlow} ${tokens.ease}` });

globalStyle(".rk-gauge-center", {
  position: "absolute",
  inset: "0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: "6%",
  gap: "2px",
});

globalStyle(".rk-gauge-value", {
  display: "flex",
  alignItems: "baseline",
  gap: "4px",
  fontWeight: "300",
  letterSpacing: "-0.04em",
  lineHeight: "1",
});

globalStyle(".rk-gauge-unit", {
  fontSize: "max(11px, 0.3em)",
  fontWeight: "400",
  letterSpacing: "0",
  color: `${tokens.text3}`,
});

globalStyle(".rk-gauge-label", { fontSize: `${tokens.textSm}`, color: `${tokens.text3}` });

globalStyle(".rk-chart-brush", { display: "flex", flexDirection: "column", gap: "4px" });

globalStyle(".rk-chart-brush-overview", { marginInline: "8px" });

globalStyle(".rk-chart-brush-overview svg", { display: "block", overflow: "visible" });

globalStyle(".rk-chart-brush-shade", { fill: `${tokens.bg}`, opacity: "0.7" });
