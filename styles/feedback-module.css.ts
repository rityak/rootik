import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".fb-study", {
  minWidth: 0,
  color: `${tokens.text}`,
  background: `${tokens.bg}`,
  fontFamily: `${tokens.fontSans}`,
});
globalStyle(".fb-settings", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,100%),1fr))",
  alignItems: "end",
  gap: `calc(${tokens.space} * 4)`,
  padding: `calc(${tokens.space} * 6)`,
  borderBottom: `1px solid ${tokens.line}`,
});
globalStyle(".fb-canvas", {
  position: "relative",
  isolation: "isolate",
  minWidth: 0,
  padding: `calc(${tokens.space} * 7)`,
});
globalStyle(".fb-canvas > .rk-svg-backdrop", { zIndex: -1 });
globalStyle(".fb-canvas .rk-page-title", {
  fontSize: "clamp(26px,3.5vw,38px)",
  fontWeight: 550,
  letterSpacing: "-.035em",
  lineHeight: 1.2,
});
globalStyle(".fb-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  alignItems: "start",
  gap: `calc(${tokens.space} * 6)`,
  marginTop: `calc(${tokens.space} * 7)`,
});
globalStyle(".fb-card, .fb-popover-content", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: `calc(${tokens.space} * 4)`,
  minWidth: 0,
});

globalStyle(".fb-grid > *", { minWidth: 0 });
globalStyle(".fb-heading", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: `calc(${tokens.space} * 3)`,
});
globalStyle(".fb-heading code", {
  color: tokens.accentText,
  font: `${tokens.textXs}/1.5 ${tokens.fontMono}`,
  letterSpacing: ".05em",
});
globalStyle(".fb-heading h2", {
  margin: `${tokens.space} 0 0`,
  fontSize: tokens.textLg,
  fontWeight: 550,
  letterSpacing: "-.025em",
  lineHeight: 1.3,
});
globalStyle(".fb-row, .fb-badges, .fb-ring-row", {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: `calc(${tokens.space} * 3)`,
});
globalStyle(".fb-ring-row", { flexWrap: "nowrap", gap: `calc(${tokens.space} * 5)` });
globalStyle(".fb-ring-row > div:last-child", { minWidth: 0 });
globalStyle(".fb-ring-number", {
  font: `300 30px/1 ${tokens.fontSans}`,
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "-.04em",
});
globalStyle(".fb-ring-number small", {
  fontSize: tokens.textXs,
  marginLeft: tokens.space,
  color: tokens.text3,
});
globalStyle(".fb-note, .fb-status", {
  margin: 0,
  color: tokens.text3,
  fontSize: tokens.textXs,
  lineHeight: 1.6,
});
globalStyle(".fb-note", { marginTop: `calc(${tokens.space} * 2)` });
globalStyle(".fb-stale, .fb-placeholder", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 4)`,
  padding: `calc(${tokens.space} * 3)`,
});
globalStyle(".fb-state", { minHeight: `calc(${tokens.space} * 42)` });
globalStyle(".fb-status", { marginTop: `calc(${tokens.space} * 6)` });
globalStyle(".fb-wide", { gridColumn: "1 / -1" });
globalStyle(".fb-grid", { "@media": { "(max-width: 900px)": { gridTemplateColumns: "minmax(0,1fr)" } } });
globalStyle(".fb-canvas", { "@media": { "(max-width: 600px)": { padding: `calc(${tokens.space} * 4)` } } });
