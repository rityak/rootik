import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".ch-study", {
  minWidth: 0,
  color: `${tokens.text}`,
  background: `${tokens.bg}`,
  fontFamily: `${tokens.fontSans}`,
});
globalStyle(".ch-settings", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,100%),1fr))",
  alignItems: "end",
  gap: `calc(${tokens.space} * 4)`,
  padding: `calc(${tokens.space} * 6)`,
  borderBottom: `1px solid ${tokens.line}`,
});
globalStyle(".ch-canvas", {
  position: "relative",
  isolation: "isolate",
  minWidth: 0,
  padding: `calc(${tokens.space} * 7)`,
});
globalStyle(".ch-canvas > .rk-svg-backdrop", { zIndex: -1 });
globalStyle(".ch-canvas .rk-page-title", {
  fontSize: "clamp(26px,3.5vw,38px)",
  fontWeight: 550,
  letterSpacing: "-.035em",
  lineHeight: 1.2,
});
globalStyle(".ch-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  alignItems: "stretch",
  gap: `calc(${tokens.space} * 6)`,
  marginTop: `calc(${tokens.space} * 7)`,
});

globalStyle(".ch-wide", { gridColumn: "1 / -1" });
globalStyle(".ch-stack", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 5)`,
  minWidth: 0,
});
globalStyle(".ch-summary", {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: `calc(${tokens.space} * 5)`,
});
globalStyle(".ch-summary strong", {
  fontSize: "36px",
  lineHeight: 1.1,
  fontWeight: 300,
  letterSpacing: "-.035em",
});
globalStyle(".ch-summary small", {
  fontSize: tokens.textXs,
  color: tokens.text3,
  marginInlineStart: `calc(${tokens.space} * 2)`,
  letterSpacing: 0,
});
globalStyle(".ch-summary > span, .ch-note", {
  margin: 0,
  color: tokens.text3,
  fontSize: tokens.textXs,
  lineHeight: 1.5,
});
globalStyle(".ch-summary .rk-sparkline", {
  flex: "1 1 120px",
  maxWidth: "220px",
  minWidth: 0,
  marginInlineStart: "auto",
});
globalStyle(".ch-gauge", { display: "flex", justifyContent: "center" });
globalStyle(".ch-grid > *", { minWidth: 0 });
globalStyle(".ch-grid", { "@media": { "(max-width:900px)": { gridTemplateColumns: "minmax(0,1fr)" } } });
globalStyle(".ch-settings, .ch-canvas", {
  "@media": { "(max-width:600px)": { padding: `calc(${tokens.space} * 4)` } },
});
