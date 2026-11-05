import { globalStyle } from "@vanilla-extract/css";
import { monoFamilies, SYSTEM_SERIF, typefaces } from "../src/stories/typography-model";

const scope = ".rt-lab, .rd-app:has(.rt-lab)";
globalStyle(scope, {
  vars: {
    "--rk-font-size": "14px",
    "--rk-text-md": "var(--rk-font-size)",
    "--rk-text-sm": "calc(var(--rk-font-size) * 0.93)",
    "--rk-text-xs": "12px",
    "--rk-text-2xs": "11px",
  },
  fontKerning: "normal",
  fontOpticalSizing: "auto",
  fontSynthesis: "none",
});
for (const font of typefaces) {
  globalStyle(`.rt-lab[data-family="${font.id}"], .rd-app:has(.rt-lab[data-family="${font.id}"])`, {
    vars: { "--rk-font-sans": font.family },
    fontFamily: font.family,
  });
  globalStyle(`.rt-font-card[data-specimen="${font.id}"] .rt-font-sample`, { fontFamily: font.family });
}
for (const [id, family] of Object.entries(monoFamilies)) {
  globalStyle(`.rt-lab[data-mono="${id}"], .rd-app:has(.rt-lab[data-mono="${id}"])`, {
    vars: { "--rk-font-mono": family },
  });
}
globalStyle('.rt-lab[data-display="literata"]', {
  vars: { "--rt-display-family": `"Literata Variable", ${SYSTEM_SERIF}` },
});
globalStyle('.rt-lab[data-display="system"]', { vars: { "--rt-display-family": SYSTEM_SERIF } });
globalStyle(".rt-lab", {
  vars: { "--rt-display-family": "var(--rk-font-sans)" },
  fontSize: "var(--rk-font-size)",
  fontWeight: "var(--rt-body-weight, 400)",
  lineHeight: 1.6,
  letterSpacing: "normal",
  gap: "28px",
});
globalStyle(".rt-lab :is(p,h2,h3,h4)", { margin: 0 });
globalStyle(".rt-intro", { display: "grid", gap: "12px", maxWidth: "650px" });
globalStyle(".rt-kicker", {
  display: "block",
  font: "500 11px/1.5 var(--rk-font-mono)",
  letterSpacing: ".04em",
  color: "var(--rk-text-3)",
});
globalStyle(".rt-intro h2", {
  fontSize: "clamp(30px,4cqw,44px)",
  fontWeight: 550,
  lineHeight: 1.12,
  letterSpacing: "-.035em",
  color: "var(--rk-text)",
});
globalStyle(".rt-intro p", {
  fontSize: "14px",
  lineHeight: 1.65,
  color: "var(--rk-text-2)",
  maxWidth: "60ch",
});
globalStyle(".rt-presets", {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  border: 0,
  padding: 0,
  margin: 0,
  minWidth: 0,
});
globalStyle(".rt-settings", {
  display: "grid",
  gridTemplateColumns: "repeat(4,minmax(0,1fr))",
  gap: "24px 18px",
  padding: "24px",
  border: "1px solid var(--rk-line)",
  borderRadius: "16px",
  background: "var(--rk-surface-1)",
  "@container": {
    "(max-width: 1100px)": { gridTemplateColumns: "repeat(2,minmax(0,1fr))" },
    "(max-width: 600px)": { gridTemplateColumns: "minmax(0,1fr)" },
  },
  "@media": {
    "(max-width: 600px)": { padding: "18px", gap: "22px 14px", gridTemplateColumns: "minmax(0,1fr)" },
  },
});
globalStyle(".rt-settings .rk-field-label, .rt-settings .rk-slider-label", {
  fontSize: "12px",
  fontWeight: 550,
  lineHeight: 1.45,
});
globalStyle(".rt-settings .rk-check-text", { fontSize: "12px", lineHeight: 1.5 });
globalStyle(".rt-live-heading, .rt-section-head", {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});
globalStyle(".rt-live-heading h2", {
  fontSize: "20px",
  lineHeight: 1.4,
  fontWeight: 600,
  letterSpacing: "-.015em",
});
globalStyle(".rt-live-heading > span, .rt-section-head > span", {
  font: "11px/1.5 var(--rk-font-mono)",
  color: "var(--rk-text-3)",
});
globalStyle(".rt-live", {
  display: "grid",
  gridTemplateColumns: "minmax(0,1.05fr) minmax(0,1fr)",
  gap: "18px",
  alignItems: "stretch",
  "@container": { "(max-width: 1050px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
globalStyle(".rt-hero .rk-svg-surface-content", {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  minHeight: "420px",
});
globalStyle(".rt-hero h2", {
  fontFamily: "var(--rt-display-family)",
  fontSize: "clamp(34px,5cqw,54px)",
  lineHeight: 1.08,
  fontWeight: 450,
  letterSpacing: "-.035em",
  overflowWrap: "anywhere",
});
globalStyle(".rt-hero h2 em", { color: "var(--rk-accent-text)", fontWeight: 500 });
globalStyle('.rt-lab[data-italic="false"] .rt-hero h2 em', { fontStyle: "normal" });
globalStyle(".rt-body", {
  fontSize: "var(--rk-font-size)",
  lineHeight: 1.6,
  fontWeight: "var(--rt-body-weight,400)",
  color: "var(--rk-text-2)",
  maxWidth: "64ch",
  textWrap: "pretty",
});
globalStyle(".rt-panel", {
  padding: "28px",
  background: "var(--rk-surface-2)",
  border: "1px solid var(--rk-line)",
  borderRadius: "18px",
  minWidth: 0,
  "@media": { "(max-width: 600px)": { padding: "20px" } },
});
globalStyle(".rt-metric", {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginTop: "auto",
  fontVariantNumeric: "var(--rt-numbers)",
});
globalStyle(".rt-metric strong", {
  fontSize: "clamp(40px,5cqw,56px)",
  lineHeight: 1.1,
  fontWeight: 350,
  letterSpacing: "-.035em",
  color: "var(--rk-text)",
});
globalStyle(".rt-metric > span", { fontSize: "12px", lineHeight: 1.5, color: "var(--rk-text-3)" });
globalStyle(".rt-hero-actions, .rt-form-actions", {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
});
globalStyle(".rt-status", {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  fontSize: "12px",
  color: "var(--rk-text-2)",
});
globalStyle(".rt-status i", {
  width: "5px",
  height: "5px",
  borderRadius: "50%",
  background: "var(--rk-success)",
});
globalStyle(".rt-form", { display: "grid", alignContent: "start", gap: "20px" });
globalStyle(".rt-form h3", { fontSize: "22px", lineHeight: 1.3, fontWeight: 600, letterSpacing: "-.02em" });
globalStyle(".rt-form .rk-field-label", { fontSize: "13px", lineHeight: 1.4, fontWeight: 550 });
globalStyle(".rt-form .rk-field-hint", { fontSize: "12px", lineHeight: 1.5 });
globalStyle(".rt-data-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: "18px",
  "@container": { "(max-width: 1050px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
globalStyle(".rt-section-head h3", {
  fontSize: "18px",
  lineHeight: 1.4,
  fontWeight: 600,
  letterSpacing: "-.015em",
});
globalStyle(".rt-table-scroll", { overflowX: "auto", marginBlock: "20px" });
globalStyle(".rt-number-probe", {
  display: "flex",
  flexWrap: "wrap",
  gap: "24px",
  marginTop: "20px",
  fontSize: "22px",
  fontVariantNumeric: "var(--rt-numbers)",
  color: "var(--rk-accent-text)",
});
globalStyle(".rt-number-probe span", { width: "max-content", borderBottom: "1px solid var(--rk-line)" });
globalStyle(".rt-table-panel table", {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "var(--rk-font-size)",
  lineHeight: 1.5,
});
globalStyle(".rt-table-panel :is(th,td)", {
  padding: "12px 0",
  borderBottom: "1px solid var(--rk-line)",
  textAlign: "right",
  whiteSpace: "nowrap",
  fontVariantNumeric: "var(--rt-numbers)",
});
globalStyle(".rt-table-panel th", { fontSize: "12px", fontWeight: 550, color: "var(--rk-text-3)" });
globalStyle(".rt-table-panel :is(th,td):first-child", { textAlign: "left", paddingRight: "22px" });
globalStyle(".rt-table-panel :is(th,td):nth-child(2)", { paddingInline: "16px" });
globalStyle(".rt-table-panel td small", {
  display: "block",
  font: "11px/1.6 var(--rk-font-mono)",
  color: "var(--rk-text-3)",
  marginTop: "3px",
});
globalStyle(".rt-caption", {
  fontSize: "12px",
  lineHeight: 1.5,
  color: "var(--rk-text-3)",
  maxWidth: "68ch",
});
globalStyle(".rt-code-panel pre", {
  font: "13px/1.75 var(--rk-font-mono)",
  fontVariantLigatures: "var(--rt-ligatures)",
  overflowX: "auto",
  marginBlock: "20px",
  padding: "18px",
  background: "var(--rk-well)",
  border: "1px solid var(--rk-line)",
  borderRadius: "10px",
  color: "var(--rk-text)",
  tabSize: 2,
});
globalStyle(".rt-code-panel code", { font: "inherit" });
globalStyle(".rt-scale", { display: "grid", gap: "22px" });
globalStyle(".rt-scale-row", {
  display: "grid",
  gridTemplateColumns: "140px minmax(0,1fr)",
  alignItems: "baseline",
  gap: "20px",
  paddingTop: "18px",
  borderTop: "1px solid var(--rk-line)",
  "@media": { "(max-width: 600px)": { gridTemplateColumns: "minmax(0,1fr)", gap: "10px" } },
});
globalStyle(".rt-scale-row > div", { fontSize: "12px", lineHeight: 1.5, color: "var(--rk-text-2)" });
globalStyle(".rt-scale-row small", {
  display: "block",
  font: "11px/1.6 var(--rk-font-mono)",
  color: "var(--rk-text-3)",
  marginTop: "3px",
});
globalStyle(".rt-scale-row p", { overflowWrap: "anywhere", color: "var(--rk-text)" });
globalStyle('.rt-scale [data-role="display"]', {
  fontFamily: "var(--rt-display-family)",
  fontSize: "clamp(32px,5cqw,48px)",
  fontWeight: 450,
  lineHeight: 1.08,
  letterSpacing: "-.03em",
});
globalStyle('.rt-scale [data-role="title"]', {
  fontSize: "28px",
  fontWeight: 550,
  lineHeight: 1.22,
  letterSpacing: "-.02em",
});
globalStyle('.rt-scale [data-role="section"]', { fontSize: "20px", fontWeight: 600, lineHeight: 1.4 });
globalStyle('.rt-scale [data-role="body"]', { fontSize: "14px", fontWeight: 400, lineHeight: "22px" });
globalStyle('.rt-scale [data-role="label"]', { fontSize: "13px", fontWeight: 550, lineHeight: "18px" });
globalStyle('.rt-scale [data-role="caption"]', { fontSize: "12px", fontWeight: 400, lineHeight: "18px" });
globalStyle(".rt-font-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: "18px",
  "@container": { "(max-width: 850px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
globalStyle(".rt-font-card", { display: "flex", flexDirection: "column", gap: "24px" });
globalStyle('.rt-font-card[data-selected="true"]', {
  borderColor: "var(--rk-accent-text)",
  boxShadow: "inset 0 2px 0 var(--rk-accent-text)",
});
globalStyle(".rt-font-card header", { display: "grid", gap: "5px" });
globalStyle(".rt-font-card header h3", { fontSize: "18px", lineHeight: 1.4, fontWeight: 600 });
globalStyle(".rt-font-card header > span", { fontSize: "12px", lineHeight: 1.5, color: "var(--rk-text-3)" });
globalStyle(".rt-font-card header small", {
  font: "11px/1.5 var(--rk-font-mono)",
  color: "var(--rk-text-3)",
});
globalStyle(".rt-font-sample", {
  display: "grid",
  gap: "18px",
  fontSize: "14px",
  lineHeight: 1.6,
  fontWeight: 400,
  fontSynthesis: "none",
});
globalStyle(".rt-font-sample h4", {
  fontSize: "30px",
  lineHeight: 1.13,
  letterSpacing: "-.025em",
  fontWeight: 500,
});
globalStyle(".rt-font-sample strong", { fontWeight: 700, lineHeight: 1.5 });
globalStyle(".rt-font-sample em", { fontSize: "16px", fontStyle: "italic", fontWeight: 400 });
globalStyle(".rt-font-sample .rt-bold-italic", { fontWeight: 700 });
globalStyle(".rt-no-italic", {
  fontSize: "12px",
  lineHeight: 1.5,
  color: "var(--rk-text-3)",
  fontStyle: "normal",
});
globalStyle(".rt-weights", {
  display: "grid",
  gridTemplateColumns: "repeat(4,minmax(0,1fr))",
  gap: "8px",
  fontSize: "15px",
  lineHeight: 1.6,
});
globalStyle(".rt-glyphs", {
  fontSize: "18px",
  lineHeight: 1.5,
  paddingTop: "16px",
  borderTop: "1px solid var(--rk-line)",
  overflowWrap: "anywhere",
});
globalStyle(".rt-font-note", {
  color: "var(--rk-text-2)",
  fontSize: "12px",
  lineHeight: 1.65,
  marginTop: "auto",
  maxWidth: "64ch",
});
globalStyle(".rt-font-card footer", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});
globalStyle(".rt-font-card footer a", {
  color: "var(--rk-accent-text)",
  fontSize: "12px",
  lineHeight: 1.5,
  textUnderlineOffset: "3px",
});
globalStyle(".rt-recommendation", { display: "grid", gap: "16px" });
globalStyle(".rt-recommendation h2", {
  fontSize: "clamp(24px,3cqw,32px)",
  lineHeight: 1.2,
  fontWeight: 550,
  letterSpacing: "-.025em",
});
globalStyle(".rt-recommendation > p", { maxWidth: "72ch", color: "var(--rk-text-2)", lineHeight: 1.65 });
