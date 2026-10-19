import { globalStyle } from "@vanilla-extract/css";

globalStyle(".cm-study", {
  color: "var(--rk-text)",
  background: "var(--rk-bg)",
  fontFamily: "var(--rk-font-sans)",
  minWidth: 0,
});
globalStyle(".cm-settings", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,100%),1fr))",
  alignItems: "end",
  gap: "18px",
  padding: "24px",
  borderBottom: "1px solid var(--rk-line)",
});
globalStyle(".cm-canvas", { position: "relative", isolation: "isolate", padding: "28px", minWidth: 0 });
globalStyle(".cm-canvas > .rk-svg-backdrop", { zIndex: -1 });
globalStyle(".cm-canvas > .rk-page-header", { marginBottom: "28px" });
globalStyle(".cm-canvas .rk-page-title", {
  fontSize: "clamp(26px,3.5vw,38px)",
  fontWeight: 550,
  letterSpacing: "-.035em",
  lineHeight: 1.18,
});
globalStyle(".cm-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  alignItems: "start",
  gap: "24px",
});
globalStyle(".cm-wide", { gridColumn: "1 / -1" });
globalStyle(".cm-vpn", { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px" });
globalStyle(".cm-vpn-dial", { display: "grid", placeItems: "center", padding: "16px", flexShrink: 0 });
globalStyle(".cm-vpn-copy", { display: "grid", gap: "14px", flex: "1 1 260px", minWidth: 0 });
globalStyle(".cm-vpn-copy code", {
  font: "11px/1.5 var(--rk-font-mono)",
  letterSpacing: ".12em",
  color: "var(--rk-accent-text)",
});
globalStyle(".cm-vpn-copy h2", {
  fontSize: "clamp(22px,3vw,30px)",
  fontWeight: 550,
  margin: 0,
  letterSpacing: "-.025em",
});
globalStyle(".cm-vpn-copy p, .cm-vpn-copy small", {
  margin: 0,
  color: "var(--rk-text-2)",
  fontSize: "13px",
  lineHeight: 1.6,
});
globalStyle(".cm-vpn-copy small", { color: "var(--rk-text-3)", fontSize: "11px" });
globalStyle(".cm-content", { display: "grid", gap: "20px", minWidth: 0 });
globalStyle(".cm-heading", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  minWidth: 0,
});
globalStyle(".cm-heading code", {
  font: "11px/1.5 var(--rk-font-mono)",
  color: "var(--rk-text-3)",
  letterSpacing: ".05em",
});
globalStyle(".cm-heading h2", {
  fontSize: "clamp(18px,2vw,22px)",
  fontWeight: 550,
  margin: "8px 0 0",
  lineHeight: 1.3,
  letterSpacing: "-.025em",
});
globalStyle(".cm-heading > svg", { color: "var(--rk-accent-text)" });
globalStyle(".cm-art", { width: "90px", height: "54px", opacity: 0.45, flexShrink: 0 });
globalStyle(".cm-row", { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", minWidth: 0 });
globalStyle(".cm-row > .rk-input-group", { flex: "1 1 180px", minWidth: 0 });
globalStyle(".cm-note", {
  fontSize: "12px",
  color: "var(--rk-text-2)",
  lineHeight: 1.6,
  overflowWrap: "anywhere",
});
globalStyle(".cm-status", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "20px 0 0",
  fontSize: "12px",
  color: "var(--rk-text-2)",
});
globalStyle(".cm-status > span", { flex: 1, overflowWrap: "anywhere" });
globalStyle(".cm-status > code", { fontFamily: "var(--rk-font-mono)", color: "var(--rk-text-3)" });
globalStyle(".cm-grid", { "@media": { "(max-width: 900px)": { gridTemplateColumns: "minmax(0,1fr)" } } });
globalStyle(".cm-canvas", { "@media": { "(max-width: 480px)": { padding: "12px" } } });
