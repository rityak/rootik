import { globalStyle } from "@vanilla-extract/css";

globalStyle(".nm-study", {
  color: "var(--rk-text)",
  background: "var(--rk-bg)",
  fontFamily: "var(--rk-font-sans)",
  minWidth: 0,
});
globalStyle(".nm-controls", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  alignItems: "end",
  gap: "16px",
  padding: "20px",
});
globalStyle(".nm-shell", {
  height: "860px",
  maxWidth: "100%",
  border: "1px solid var(--rk-line)",
  borderRadius: "var(--rk-radius-lg)",
});
globalStyle(".nm-page", { display: "grid", gap: "24px", paddingBlock: "20px", minWidth: 0 });
globalStyle(".nm-page > .rk-page-header, .nm-page > .rk-topnav", { marginInline: "28px" });
globalStyle(".nm-page .rk-page-title", { fontSize: "clamp(26px,4cqw,36px)" });
globalStyle(".nm-section-head", {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
});
globalStyle(".nm-code", { font: "11px/1.5 var(--rk-font-mono)", color: "var(--rk-text-3)" });
globalStyle(".nm-projects", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: "12px",
  marginBlock: "24px",
});
globalStyle('.nm-projects[data-view="rows"]', { gridTemplateColumns: "minmax(0,1fr)" });
globalStyle(".nm-project", {
  display: "flex",
  gap: "14px",
  alignItems: "center",
  minWidth: 0,
  padding: "20px",
  border: "1px solid var(--rk-control-edge)",
  borderRadius: "var(--rk-radius-md)",
  color: "var(--rk-text)",
  background: "var(--rk-well-soft)",
  font: "inherit",
  textAlign: "start",
  cursor: "pointer",
});
globalStyle(".nm-project:hover", { background: "var(--rk-hover)" });
globalStyle(".nm-project:focus-visible", { outline: "2px solid var(--rk-focus)", outlineOffset: "-2px" });
globalStyle(".nm-project > svg", { flexShrink: 0, color: "var(--rk-accent-text)" });
globalStyle(".nm-project strong, .nm-project small", { display: "block", overflowWrap: "anywhere" });
globalStyle(".nm-project strong", { fontWeight: 550, fontSize: "14px", lineHeight: 1.4 });
globalStyle(".nm-project small", {
  color: "var(--rk-text-3)",
  fontSize: "12px",
  lineHeight: 1.5,
  marginTop: "6px",
});
globalStyle(".nm-preferences", { display: "grid", gridTemplateColumns: "180px minmax(0,1fr)", gap: "28px" });
globalStyle(".nm-copy", { fontSize: "14px", color: "var(--rk-text-2)", lineHeight: 1.6 });
globalStyle(".nm-page h2", { fontSize: "20px", fontWeight: 550, margin: "0 0 24px" });
globalStyle(".nm-page h3", { fontSize: "16px", fontWeight: 550, margin: "0 0 12px" });
globalStyle(".nm-projects, .nm-preferences", {
  "@media": { "(max-width: 700px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
