import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".om-study", {
  minWidth: 0,
  color: `${tokens.text}`,
  background: `${tokens.bg}`,
  fontFamily: `${tokens.fontSans}`,
});
globalStyle(".om-settings", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,100%),1fr))",
  alignItems: "end",
  gap: `calc(${tokens.space} * 4)`,
  padding: `calc(${tokens.space} * 6)`,
  borderBottom: `1px solid ${tokens.line}`,
});
globalStyle(".om-canvas", {
  position: "relative",
  isolation: "isolate",
  minWidth: 0,
  padding: `calc(${tokens.space} * 7)`,
});
globalStyle(".om-canvas > .rk-svg-backdrop", { zIndex: -1 });
globalStyle(".om-canvas .rk-page-title", {
  fontSize: "clamp(26px,3.5vw,38px)",
  fontWeight: 550,
  letterSpacing: "-.035em",
  lineHeight: 1.2,
});
globalStyle(".om-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  alignItems: "start",
  gap: `calc(${tokens.space} * 6)`,
  marginTop: `calc(${tokens.space} * 7)`,
});
globalStyle(".om-card, .om-popover-content", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: `calc(${tokens.space} * 4)`,
  minWidth: 0,
});
globalStyle(".om-heading", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: `calc(${tokens.space} * 3)`,
  color: `${tokens.accentText}`,
});
globalStyle(".om-heading code, .om-status code", {
  font: `${tokens.textXs}/1.5 ${tokens.fontMono}`,
  letterSpacing: ".06em",
});
globalStyle(".om-card h2", {
  fontSize: `${tokens.textLg}`,
  fontWeight: 550,
  lineHeight: 1.3,
  letterSpacing: "-.025em",
  margin: 0,
});
globalStyle(".om-card p, .om-popover-content p, .om-note", {
  fontSize: `${tokens.textSm}`,
  lineHeight: 1.65,
  color: `${tokens.text2}`,
  margin: 0,
  overflowWrap: "anywhere",
});
globalStyle(".om-popover-content small", { color: `${tokens.text2}`, fontSize: `${tokens.textXs}` });
globalStyle(".om-row", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `calc(${tokens.space} * 3)`,
});
globalStyle(".om-status", {
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 3)`,
  paddingTop: `calc(${tokens.space} * 5)`,
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
});
globalStyle(".om-status > span", { flex: 1, overflowWrap: "anywhere" });
globalStyle(".om-grid", { "@media": { "(max-width: 850px)": { gridTemplateColumns: "minmax(0,1fr)" } } });
globalStyle(".om-canvas", { "@media": { "(max-width: 480px)": { padding: `calc(${tokens.space} * 3)` } } });
