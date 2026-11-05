import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".dm-study", {
  minWidth: 0,
  color: tokens.text,
  background: tokens.bg,
  fontFamily: tokens.fontSans,
});
globalStyle(".dm-settings", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,100%),1fr))",
  alignItems: "end",
  gap: `calc(${tokens.space} * 4)`,
  padding: `calc(${tokens.space} * 6)`,
  borderBottom: `1px solid ${tokens.line}`,
});
globalStyle(".dm-canvas", {
  position: "relative",
  isolation: "isolate",
  minWidth: 0,
  padding: `calc(${tokens.space} * 7)`,
});
globalStyle(".dm-canvas > .rk-svg-backdrop", { zIndex: -1 });
globalStyle(".dm-canvas .rk-page-title", {
  fontSize: "clamp(26px,3.5vw,38px)",
  fontWeight: 550,
  letterSpacing: "-.035em",
  lineHeight: 1.2,
});
globalStyle(".dm-grid", {
  display: "grid",
  gridTemplateColumns: "minmax(0,1.75fr) minmax(260px,1fr)",
  alignItems: "start",
  gap: `calc(${tokens.space} * 6)`,
  marginTop: `calc(${tokens.space} * 7)`,
  "@media": { "(max-width: 1000px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
globalStyle(".dm-grid > *", { minWidth: 0 });
globalStyle(".dm-wide", { gridColumn: "1 / -1" });
globalStyle(".dm-card", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 4)`,
  minWidth: 0,
});
globalStyle(".dm-heading", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: `calc(${tokens.space} * 3)`,
  marginBottom: `calc(${tokens.space} * 4)`,
});
globalStyle(".dm-heading code", {
  color: tokens.accentText,
  font: `${tokens.textXs}/1.5 ${tokens.fontMono}`,
  letterSpacing: ".05em",
});
globalStyle(".dm-heading h2", {
  margin: `${tokens.space} 0 0`,
  fontSize: tokens.textLg,
  fontWeight: 550,
  letterSpacing: "-.025em",
  lineHeight: 1.3,
});
globalStyle(".dm-count", {
  color: tokens.text3,
  font: `${tokens.textSm}/1.5 ${tokens.fontMono}`,
  whiteSpace: "nowrap",
});
globalStyle(".dm-toolbar", {
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
  marginBottom: `calc(${tokens.space} * 3)`,
});
globalStyle(".dm-toolbar > .rk-input", { flex: 1, minWidth: 0 });
globalStyle(".dm-gateways", { minWidth: "780px" });
globalStyle(".dm-note, .dm-status", {
  color: tokens.text3,
  fontSize: tokens.textXs,
  lineHeight: 1.6,
  margin: `calc(${tokens.space} * 3) 0 0`,
});
globalStyle(".dm-sort-row", { display: "flex", alignItems: "center", gap: `calc(${tokens.space} * 3)` });
globalStyle(".dm-artwork", {
  width: `calc(${tokens.space} * 12)`,
  height: `calc(${tokens.space} * 12)`,
  color: "var(--rk-secondary, var(--rk-accent-text))",
});
globalStyle(".dm-quick", {
  display: "flex",
  gap: `calc(${tokens.space} * 2)`,
  width: "max-content",
  paddingBlock: `calc(${tokens.space} * 3)`,
});
globalStyle(".dm-wide > .rk-scroller", { marginTop: `calc(${tokens.space} * 3)` });
globalStyle(".dm-canvas", { "@media": { "(max-width: 600px)": { padding: `calc(${tokens.space} * 4)` } } });
