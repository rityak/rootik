import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-log", {
  display: "flex",
  flexDirection: "column",
  minHeight: "0",
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.sunken}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  overflow: "hidden",
});

globalStyle(".rk-log-toolbar", {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: `calc(${tokens.space} * 2)`,
  padding: `calc(${tokens.space} * 2)`,
  borderBottom: `1px solid ${tokens.line}`,
  background: `${tokens.wellSoft}`,
});

globalStyle(".rk-log-search", { flex: "1 1 160px", maxWidth: "280px" });

globalStyle(".rk-log-actions", { display: "flex", gap: "2px", marginInlineStart: "auto" });

globalStyle(".rk-log-body", { flex: "1", minHeight: "0" });

globalStyle(".rk-log-body > .rk-stick-viewport", { overflow: "auto", outlineOffset: "-2px" });

globalStyle(".rk-log-spacer", { position: "relative", minWidth: "100%" });

globalStyle(".rk-log-row", {
  position: "absolute",
  top: "0",
  left: "0",
  display: "flex",
  gap: `calc(${tokens.space} * 3)`,
  minWidth: "100%",
  width: "max-content",
  height: "var(--rk-log-row)",
  paddingInline: `calc(${tokens.space} * 3)`,
  alignItems: "center",
  fontFamily: `${tokens.fontMono}`,
  fontSize: `${tokens.textXs}`,
  lineHeight: "var(--rk-log-row)",
  whiteSpace: "pre",
  color: `${tokens.text2}`,
  vars: { "--rk-tone": "transparent", "--rk-tone-text": `${tokens.text}` },
});

globalStyle('.rk-log-row[data-level="trace"], .rk-log-row[data-level="debug"]', {
  color: `${tokens.text3}`,
  vars: { "--rk-tone-text": `${tokens.text3}` },
});

globalStyle('.rk-log-row[data-level="info"]', { vars: { "--rk-tone-text": `${tokens.info}` } });

globalStyle('.rk-log-row[data-level="warn"]', {
  vars: { "--rk-tone": `${tokens.warn}`, "--rk-tone-text": `${tokens.warn}` },
});

globalStyle('.rk-log-row[data-level="error"]', {
  color: `${tokens.text}`,
  vars: {
    "--rk-tone": `${tokens.danger}`,
    "--rk-tone-text": `oklch(from ${tokens.danger} calc(l + 0.08) c h)`,
  },
});

globalStyle('.rk-log-row:is([data-level="warn"], [data-level="error"])', {
  background: "color-mix(in oklab, var(--rk-tone) 7%, transparent)",
  boxShadow: "inset 2px 0 0 color-mix(in oklab, var(--rk-tone) 70%, transparent)",
});

globalStyle(".rk-log-row:hover", { backgroundColor: `${tokens.hover}` });

globalStyle(".rk-log-row[data-clickable]", { cursor: "pointer" });

globalStyle(".rk-log-row mark", {
  borderRadius: `calc(2px * ${tokens.roundness})`,
  background: `color-mix(in oklab, ${tokens.accent} 40%, transparent)`,
  color: `${tokens.text}`,
});

globalStyle(".rk-log-no", {
  minWidth: "calc(var(--rk-log-digits, 3) * 1ch)",
  textAlign: "end",
  color: `${tokens.text3}`,
  opacity: "0.7",
  userSelect: "none",
});

globalStyle(".rk-log-time", { color: `${tokens.text3}`, fontVariantNumeric: "tabular-nums" });

globalStyle(".rk-log-level", {
  minWidth: "5ch",
  fontWeight: "600",
  fontSize: `${tokens.text2xs}`,
  letterSpacing: "0.04em",
  color: "var(--rk-tone-text)",
});

globalStyle(".rk-log-level[data-empty]", { color: `${tokens.text3}`, fontWeight: "400" });

globalStyle(".rk-log-source", { color: `${tokens.text3}` });

globalStyle(".rk-log-source::after", { content: '":"' });

globalStyle(".rk-log-msg", { color: "inherit" });

globalStyle(".rk-log-empty", {
  padding: `calc(${tokens.space} * 8)`,
  textAlign: "center",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text3}`,
});
