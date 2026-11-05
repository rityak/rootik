import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".co-study", {
  minWidth: 0,
  color: `${tokens.text}`,
  background: `${tokens.bg}`,
  fontFamily: `${tokens.fontSans}`,
});
globalStyle(".co-settings", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,100%),1fr))",
  alignItems: "end",
  gap: `calc(${tokens.space} * 4)`,
  padding: `calc(${tokens.space} * 6)`,
  borderBottom: `1px solid ${tokens.line}`,
});
globalStyle(".co-canvas", {
  position: "relative",
  isolation: "isolate",
  minWidth: 0,
  padding: `calc(${tokens.space} * 7)`,
});
globalStyle(".co-canvas > .rk-svg-backdrop", { zIndex: -1 });
globalStyle(".co-canvas .rk-page-title", {
  fontSize: "clamp(26px,3.5vw,38px)",
  fontWeight: 550,
  letterSpacing: "-.035em",
  lineHeight: 1.2,
});
globalStyle(".co-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  alignItems: "stretch",
  gap: `calc(${tokens.space} * 6)`,
  marginTop: `calc(${tokens.space} * 7)`,
});

globalStyle(".co-wide", { gridColumn: "1 / -1" });
globalStyle(".co-grid > *", { minWidth: 0 });
globalStyle(".co-grid .rk-card-body", { minWidth: 0 });
globalStyle(".co-stack", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 4)`,
  minWidth: 0,
});
globalStyle(".co-intro", {
  display: "grid",
  gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)",
  alignItems: "center",
  gap: `calc(${tokens.space} * 8)`,
});
globalStyle(".co-intro h2", {
  margin: 0,
  fontSize: "clamp(28px,3.5vw,42px)",
  fontWeight: 500,
  letterSpacing: "-.035em",
  lineHeight: 1.15,
});
globalStyle(".co-intro em", {
  fontFamily: "var(--rk-font-display)",
  fontWeight: 450,
  color: tokens.accentText,
});
globalStyle(".co-intro p", { maxWidth: "56ch", lineHeight: 1.65 });
globalStyle(".co-stat", {
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  gap: `calc(${tokens.space} * 5)`,
});
globalStyle(".co-truncate", { display: "block", maxWidth: "100%" });
globalStyle(".co-log", { height: 320, minWidth: 0 });
globalStyle(".co-qr", {
  display: "flex",
  alignItems: "start",
  flexWrap: "wrap",
  gap: `calc(${tokens.space} * 5)`,
});
globalStyle(".co-qr .rk-kv", { flex: "1 1 180px", minWidth: 0 });
globalStyle(".co-notice", {
  fontSize: tokens.textXs,
  color: tokens.text3,
  margin: `calc(${tokens.space} * 5) 0 0`,
  lineHeight: 1.5,
});
globalStyle(".co-grid", { "@media": { "(max-width:900px)": { gridTemplateColumns: "minmax(0,1fr)" } } });
globalStyle(".co-intro", { "@media": { "(max-width:600px)": { gridTemplateColumns: "minmax(0,1fr)" } } });
globalStyle(".co-settings, .co-canvas", {
  "@media": { "(max-width:600px)": { padding: `calc(${tokens.space} * 4)` } },
});

globalStyle(".co-type-roles", {
  display: "flex",
  flexWrap: "wrap",
  gap: `calc(${tokens.space} * 3)`,
  color: tokens.text2,
});
