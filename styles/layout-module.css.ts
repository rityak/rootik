import { globalStyle } from "@vanilla-extract/css";

globalStyle(".lm-study", {
  minWidth: 0,
  color: "var(--rk-text)",
  fontFamily: "var(--rk-font-sans)",
  background: "var(--rk-bg)",
});
globalStyle(".lm-controls", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(145px,100%),1fr))",
  alignItems: "end",
  gap: "16px",
  padding: "20px",
});
globalStyle(".lm-shell", {
  height: "800px",
  border: "1px solid var(--rk-line)",
  borderRadius: "var(--rk-radius-lg)",
  maxWidth: "100%",
});
globalStyle(".lm-page", {
  container: "rk-layout-preview / inline-size",
  gridTemplateColumns: "minmax(0, 1fr)",
  paddingBlock: "16px",
  display: "grid",
  gap: "20px",
  minWidth: 0,
});
globalStyle(".lm-page > .rk-page-header", { paddingBlock: "10px 16px", paddingInline: "28px" });
globalStyle(".lm-page .rk-page-title", { fontSize: "clamp(24px,4cqw,34px)" });
globalStyle(".lm-page h2", { fontSize: "20px", fontWeight: 550, lineHeight: 1.3, margin: "0 0 14px" });
globalStyle(".lm-page p", {
  fontSize: "14px",
  lineHeight: 1.6,
  color: "var(--rk-text-2)",
  maxWidth: "60ch",
  margin: "0 0 20px",
});
globalStyle(".lm-build, .lm-eyebrow", { font: "11px/1.5 var(--rk-font-mono)", color: "var(--rk-text-3)" });
globalStyle(".lm-feature-grid", {
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) 120px",
  gap: "24px",
  alignItems: "center",
});
globalStyle(".lm-feature h2", {
  marginBlock: "20px",
  font: "450 clamp(28px,4cqw,44px)/1.1 var(--rk-font-display, var(--rk-font-sans))",
  letterSpacing: "-.03em",
});
globalStyle(".lm-feature h2 em", { color: "var(--rk-accent-text)" });
globalStyle(".lm-data", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "20px",
  marginTop: "20px",
});
globalStyle(".lm-data strong", {
  fontSize: "48px",
  fontWeight: 350,
  lineHeight: 1.1,
  fontVariantNumeric: "tabular-nums",
});
globalStyle(".lm-data small, .lm-data > span", {
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: 1.5,
  color: "var(--rk-text-3)",
});
globalStyle(".lm-grid", { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "20px" });
globalStyle(".lm-grid .rk-button", { marginTop: "16px" });
globalStyle(".lm-swatches", {
  display: "flex",
  gap: "14px",
  marginBlock: "22px",
  color: "var(--rk-line-strong)",
});
globalStyle(".lm-grid code", { font: "12px/1.5 var(--rk-font-mono)", overflowWrap: "anywhere" });
globalStyle(".lm-inspector", { maxWidth: "100%", minHeight: 0, overflow: "auto" });
globalStyle(".rk-shell[data-compact] .lm-inspector", { minWidth: "100%" });
globalStyle(".lm-inspector-content", { padding: "16px", display: "grid", gap: "16px" });
globalStyle(".lm-inspector h2", { fontSize: "16px", lineHeight: 1.3, margin: "0" });
globalStyle(".lm-inspector p", { fontSize: "12px", lineHeight: 1.6, color: "var(--rk-text-2)", margin: "0" });
globalStyle(".lm-properties", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  fontSize: "12px",
  margin: "0",
});
globalStyle(".lm-properties dt", { color: "var(--rk-text-3)" });
globalStyle(".lm-properties dd", { margin: "0", textAlign: "end" });
globalStyle(".lm-page .rk-master-detail", { minHeight: "200px", marginBlock: "24px" });
globalStyle(".lm-page .rk-master-detail-list", { gap: "8px" });
globalStyle(".lm-feature, .lm-grid", {
  "@container": { "rk-layout-preview (width < 700px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
globalStyle(".lm-feature-grid", {
  "@container": { "rk-layout-preview (width < 700px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
globalStyle(".lm-feature-grid > .rk-svg-artwork", {
  "@container": { "rk-layout-preview (width < 700px)": { display: "none" } },
});
