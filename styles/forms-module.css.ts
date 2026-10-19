import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".fm-study", {
  minWidth: 0,
  color: `${tokens.text}`,
  background: `${tokens.bg}`,
  fontFamily: `${tokens.fontSans}`,
});
globalStyle(".fm-settings", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,100%),1fr))",
  alignItems: "end",
  gap: `calc(${tokens.space} * 4)`,
  padding: `calc(${tokens.space} * 6)`,
  borderBottom: `1px solid ${tokens.line}`,
});
globalStyle(".fm-canvas", {
  position: "relative",
  isolation: "isolate",
  minWidth: 0,
  padding: `calc(${tokens.space} * 7)`,
});
globalStyle(".fm-intro > .fm-art", { "@media": { "(max-width: 480px)": { display: "none" } } });
globalStyle(".fm-canvas > .rk-svg-backdrop", { zIndex: -1 });
globalStyle(".fm-canvas .rk-page-title", {
  fontSize: "clamp(26px,3.5vw,38px)",
  fontWeight: 550,
  letterSpacing: "-.035em",
  lineHeight: 1.2,
});
globalStyle(".fm-intro", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `calc(${tokens.space} * 4)`,
  marginBlock: `calc(${tokens.space} * 6)`,
  color: `${tokens.text2}`,
  fontSize: `${tokens.textSm}`,
});
globalStyle(".fm-intro code, .fm-schema-heading code, .fm-status code", {
  fontFamily: `${tokens.fontMono}`,
  fontSize: `${tokens.textXs}`,
  letterSpacing: ".06em",
  color: `${tokens.accentText}`,
});
globalStyle(".fm-intro > .fm-art", { width: "80px", height: "44px", marginLeft: "auto", opacity: 0.5 });
globalStyle(".fm-grid", {
  display: "grid",
  gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)",
  gap: `calc(${tokens.space} * 6)`,
  alignItems: "start",
});
globalStyle(".fm-native, .fm-side", {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  gap: `calc(${tokens.space} * 5)`,
});
globalStyle(".fm-field-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,210px),1fr))",
  gap: `calc(${tokens.space} * 4)`,
});
globalStyle(".fm-actions", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
  paddingInline: `${tokens.space}`,
});
globalStyle(".fm-caption", {
  display: "flex",
  gap: `calc(${tokens.space} * 3)`,
  alignItems: "start",
  padding: `calc(${tokens.space} * 3)`,
});
globalStyle(".fm-caption > svg", { flexShrink: 0, color: `${tokens.accentText}` });
globalStyle(".fm-caption p", {
  margin: 0,
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
  lineHeight: 1.7,
});
globalStyle(".fm-schema-heading", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: `calc(${tokens.space} * 4)`,
  marginBlock: `calc(${tokens.space} * 10) calc(${tokens.space} * 5)`,
});
globalStyle(".fm-schema-heading h2", {
  margin: `${tokens.space} 0 0`,
  fontSize: `${tokens.textLg}`,
  fontWeight: 550,
  letterSpacing: "-.025em",
});
globalStyle(".fm-schema", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  alignItems: "start",
  gap: `calc(${tokens.space} * 6)`,
});
globalStyle(".fm-schema > .rk-schema-actions", { gridColumn: "1 / -1" });
globalStyle(".fm-status", {
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 3)`,
  marginTop: `calc(${tokens.space} * 6)`,
  paddingTop: `calc(${tokens.space} * 4)`,
  borderTop: `1px solid ${tokens.line}`,
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
});
globalStyle(".fm-status > span", { flex: 1, overflowWrap: "anywhere" });
globalStyle(".fm-grid, .fm-schema", {
  "@media": { "(max-width: 1050px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
globalStyle(".fm-canvas", { "@media": { "(max-width: 480px)": { padding: `calc(${tokens.space} * 3)` } } });
