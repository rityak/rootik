import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-json", {
  display: "flex",
  flexDirection: "column",
  minWidth: "0",
  fontFamily: `${tokens.fontMono}`,
  fontSize: `${tokens.textXs}`,
  lineHeight: "1.5",
  vars: { "--rk-indent": "16px" },
});

globalStyle(".rk-json-row", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  minHeight: "24px",
  padding: "0 4px 0 calc(2px + var(--rk-depth) * var(--rk-indent))",
  borderRadius: `calc(${tokens.radiusControl} - 2px)`,
  color: `${tokens.text2}`,
  outline: "none",
  backgroundImage: `repeating-linear-gradient(
    to right,
    transparent 0 8px,
    ${tokens.line} 8px 9px,
    transparent 9px var(--rk-indent)
  )`,
  backgroundSize: "calc(var(--rk-depth) * var(--rk-indent)) 100%",
  backgroundPosition: "2px 0",
  backgroundRepeat: "no-repeat",
  vars: { "--rk-depth": "0" },
});

globalStyle(".rk-json-row[aria-expanded]", { cursor: "pointer" });

globalStyle(".rk-json-row:hover", { backgroundColor: `${tokens.hover}` });

globalStyle(".rk-json-row:focus-visible", { boxShadow: `inset 0 0 0 2px ${tokens.focus}` });

globalStyle(".rk-json-toggle", {
  display: "grid",
  placeItems: "center",
  flex: "none",
  width: "14px",
  height: "14px",
  color: `${tokens.text3}`,
});

globalStyle(".rk-json-toggle svg", {
  width: "12px",
  height: "12px",
  transition: `rotate ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-json-toggle svg[data-open]", { rotate: "90deg" });

globalStyle(".rk-json-key", { flex: "none", color: `${tokens.text}` });

globalStyle(".rk-json-key::after", { content: '":"', color: `${tokens.text3}` });

globalStyle(".rk-json-key[data-index]", { color: `${tokens.text3}` });

globalStyle(".rk-json-summary", {
  display: "inline-flex",
  alignItems: "baseline",
  gap: "6px",
  minWidth: "0",
});

globalStyle(".rk-json-brace", { color: `${tokens.text3}` });

globalStyle(".rk-json-size", {
  fontFamily: `${tokens.fontSans}`,
  fontSize: `${tokens.text2xs}`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-json-value", {
  minWidth: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle('.rk-json-value[data-kind="string"]', {
  color: `oklch(from ${tokens.chart3} calc(l + 0.14) c h)`,
});

globalStyle('.rk-json-value[data-kind="number"]', {
  color: `oklch(from ${tokens.chart2} calc(l + 0.12) c h)`,
});

globalStyle('.rk-json-value[data-kind="boolean"]', {
  color: `oklch(from ${tokens.chart4} calc(l + 0.16) c h)`,
});

globalStyle('.rk-json-value:is([data-kind="null"], [data-kind="undefined"])', {
  color: `${tokens.text3}`,
  fontStyle: "italic",
});

globalStyle(".rk-json-actions", { display: "inline-flex", marginInlineStart: "auto", flex: "none" });

globalStyle(".rk-json-actions .rk-button", { width: "22px", height: "22px" });
