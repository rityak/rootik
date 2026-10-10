import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-indicator-anchor", {
  position: "relative",
  display: "inline-flex",
  verticalAlign: "middle",
});

globalStyle(".rk-indicator-mark", {
  position: "absolute",
  zIndex: "1",
  display: "inline-grid",
  placeItems: "center",
  width: "10px",
  height: "10px",
  borderRadius: `${tokens.radiusPill}`,
  background: "var(--rk-tone)",
  color: "var(--rk-on-tone)",
  boxShadow: `0 0 0 2px var(--rk-indicator-ring, ${tokens.bg})`,
  fontSize: `${tokens.text2xs}`,
  fontWeight: "600",
  fontVariantNumeric: "tabular-nums",
  lineHeight: "1",
  pointerEvents: "none",
  vars: { "--rk-mark-inset": "0%" },
});

globalStyle(".rk-indicator-mark[data-count]", {
  width: "auto",
  minWidth: "16px",
  height: "16px",
  padding: "0 4px",
});

globalStyle(".rk-indicator-mark[data-round]", { vars: { "--rk-mark-inset": "14.6%" } });

globalStyle('.rk-indicator-mark[data-position^="top"]', {
  top: "var(--rk-mark-inset)",
  vars: { "--rk-mark-y": "-50%" },
});

globalStyle('.rk-indicator-mark[data-position^="bottom"]', {
  bottom: "var(--rk-mark-inset)",
  vars: { "--rk-mark-y": "50%" },
});

globalStyle('.rk-indicator-mark[data-position$="end"]', {
  right: "var(--rk-mark-inset)",
  translate: "50% var(--rk-mark-y)",
});

globalStyle('.rk-indicator-mark[data-position$="start"]', {
  left: "var(--rk-mark-inset)",
  translate: "-50% var(--rk-mark-y)",
});

globalStyle(".rk-indicator-mark[data-pulse]::after", {
  content: '""',
  position: "absolute",
  inset: "0",
  borderRadius: "inherit",
  background: "inherit",
  animation: `rk-indicator-ping calc(${tokens.durSlow} * 5) ${tokens.easeOut} infinite`,
  animationPlayState: `${tokens.animationState}`,
});

globalKeyframes("rk-indicator-ping", {
  from: { opacity: "0.6", scale: "1" },
  to: { opacity: "0", scale: "2.4" },
});
globalStyle(".rk-indicator-mark[data-pulse]::after", {
  "@media": { "(prefers-reduced-motion: reduce)": { animation: "none" } },
});
