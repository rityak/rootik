import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-donut", { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 24px" });

globalStyle(".rk-donut-ring", { position: "relative", flexShrink: "0" });

globalStyle(".rk-donut-ring svg", { display: "block" });

globalStyle(".rk-donut-ring path", { transition: `opacity ${tokens.dur} ${tokens.ease}` });

globalStyle(".rk-donut-center", {
  position: "absolute",
  inset: "0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  padding: "20%",
  textAlign: "center",
  pointerEvents: "none",
});

globalStyle(".rk-donut-value", {
  fontSize: `${tokens.text2xl}`,
  fontWeight: "300",
  letterSpacing: "-0.03em",
  lineHeight: "1",
});

globalStyle(".rk-donut-label", {
  maxWidth: "100%",
  overflow: "hidden",
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-donut-legend", {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto auto",
  gap: "6px 12px",
  alignItems: "center",
  flex: "1",
  minWidth: "180px",
  margin: "0",
  padding: "0",
  listStyle: "none",
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-donut-legend li", { display: "contents" });

globalStyle(".rk-donut-legend li > *", { transition: `opacity ${tokens.dur} ${tokens.ease}` });

globalStyle(".rk-donut-legend li[data-dim] > *", { opacity: "0.45" });

globalStyle(".rk-donut-legend-label", { color: `${tokens.text2}` });

globalStyle(".rk-donut-share", { color: `${tokens.text3}`, textAlign: "end" });

globalStyle(".rk-waffle", {
  display: "grid",
  gridTemplateColumns: "repeat(var(--rk-waffle-side), 1fr)",
  gap: "3px",
  width: "100%",
  maxWidth: "260px",
});

globalStyle(".rk-waffle-cell", { aspectRatio: "1", borderRadius: `calc(3px * ${tokens.roundness})` });

globalStyle(".rk-waffle-cell[data-rest]", { background: `${tokens.hatch}, ${tokens.well}` });

globalStyle(".rk-treemap g", { transition: `opacity ${tokens.dur} ${tokens.ease}` });

globalStyle(".rk-treemap g[data-dim]", { opacity: "0.55" });

globalStyle(".rk-treemap-label", { fill: `${tokens.bg}`, fontSize: `${tokens.textXs}`, fontWeight: "600" });

globalStyle(".rk-treemap-value", { fill: `${tokens.bg}`, opacity: "0.8", fontSize: `${tokens.text2xs}` });

globalStyle(".rk-treemap [data-idle] text", { fill: `${tokens.text}` });

globalStyle(".rk-bullet", { display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" });

globalStyle(".rk-bullet-head", {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "12px",
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-bullet-label", { color: `${tokens.text2}` });

globalStyle(".rk-bullet-value", { fontWeight: "500" });

globalStyle(".rk-bullet-hint", { color: `${tokens.text3}`, fontWeight: "400" });

globalStyle(".rk-bullet-track", {
  position: "relative",
  height: "18px",
  borderRadius: `calc(5px * ${tokens.roundness})`,
  overflow: "hidden",
});

globalStyle(".rk-bullet-track svg", { position: "absolute", inset: "0", display: "block" });

globalStyle(".rk-bullet-bar", {
  position: "absolute",
  top: "6px",
  bottom: "6px",
  left: "0",
  borderRadius: `0 calc(3px * ${tokens.roundness}) calc(3px * ${tokens.roundness}) 0`,
  background: `${tokens.accent}`,
  transition: `width ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle(".rk-bullet-target", {
  position: "absolute",
  top: "2px",
  bottom: "2px",
  width: "2px",
  marginLeft: "-1px",
  borderRadius: `calc(1px * ${tokens.roundness})`,
  background: `${tokens.text}`,
});
