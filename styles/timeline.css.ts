import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-timeline", {
  display: "flex",
  flexDirection: "column",
  margin: "0",
  padding: "0",
  listStyle: "none",
  vars: { "--rk-tl-marker": "22px", "--rk-tl-dot": "10px", "--rk-tl-gap": `calc(${tokens.space} * 5)` },
});

globalStyle('.rk-timeline[data-size="sm"]', {
  vars: { "--rk-tl-marker": "16px", "--rk-tl-dot": "8px", "--rk-tl-gap": `calc(${tokens.space} * 3)` },
});

globalStyle(".rk-timeline-item", {
  position: "relative",
  display: "flex",
  gap: `calc(${tokens.space} * 3)`,
  paddingBottom: "var(--rk-tl-gap)",
  vars: { "--rk-tone": `${tokens.text3}` },
});

globalStyle(".rk-timeline-item:last-child", { paddingBottom: "0" });

globalStyle(".rk-timeline-item:not(:last-child)::before", {
  content: '""',
  position: "absolute",
  top: "calc(var(--rk-tl-marker) + 2px)",
  bottom: "2px",
  left: "calc(var(--rk-tl-marker) / 2 - 1px)",
  width: "2px",
  borderRadius: `calc(1px * ${tokens.roundness})`,
  background: `${tokens.lineStrong}`,
});

globalStyle(
  '.rk-timeline-item:is([data-status="current"], [data-status="pending"]):not(:last-child)::before',
  { background: `${tokens.hatch}`, backgroundSize: "6px 6px", opacity: "0.9" },
);

globalStyle('.rk-timeline-item[data-status="current"]', { vars: { "--rk-tone": `${tokens.accent}` } });

globalStyle(".rk-timeline-marker", {
  position: "relative",
  display: "grid",
  placeItems: "center",
  flex: "none",
  width: "var(--rk-tl-marker)",
  height: "var(--rk-tl-marker)",
  color: `var(--rk-tone-text, ${tokens.text2})`,
});

globalStyle(".rk-timeline-marker:not([data-icon])::after", {
  content: '""',
  width: "var(--rk-tl-dot)",
  height: "var(--rk-tl-dot)",
  borderRadius: `${tokens.radiusRound}`,
  background: "var(--rk-tone)",
});

globalStyle('[data-status="pending"] > .rk-timeline-marker:not([data-icon])::after', {
  background: "transparent",
  boxShadow: `inset 0 0 0 1.5px ${tokens.lineStrong}`,
});

globalStyle('[data-status="current"] > .rk-timeline-marker:not([data-icon])::after', {
  boxShadow: `0 0 0 4px ${tokens.accentSoft}`,
});

globalStyle(".rk-timeline-marker[data-icon]", {
  borderRadius: `${tokens.radiusRound}`,
  background: `color-mix(in oklab, var(--rk-tone) 16%, ${tokens.surface2})`,
  boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--rk-tone) 35%, transparent)",
});

globalStyle(".rk-timeline-marker[data-icon] > svg", { width: "60%", height: "60%" });

globalStyle('[data-status="pending"] > .rk-timeline-marker[data-icon]', {
  background: `${tokens.surface2}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-timeline-body", {
  flex: "1",
  minWidth: "0",
  paddingTop: "calc((var(--rk-tl-marker) - 1.45em) / 2)",
});

globalStyle(".rk-timeline-head", {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: `calc(${tokens.space} * 3)`,
});

globalStyle(".rk-timeline-title", { minWidth: "0", color: `${tokens.text}`, fontWeight: "500" });

globalStyle('[data-status="pending"] > .rk-timeline-body > .rk-timeline-head > .rk-timeline-title', {
  color: `${tokens.text3}`,
  fontWeight: "400",
});

globalStyle(".rk-timeline-time", {
  flex: "none",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textXs}`,
  fontVariantNumeric: "tabular-nums",
});

globalStyle(".rk-timeline-desc", {
  marginTop: "2px",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
  textWrap: "pretty",
});

globalStyle(".rk-timeline-extra", { marginTop: `calc(${tokens.space} * 2)` });
