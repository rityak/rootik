import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-stepper", {
  display: "flex",
  margin: "0",
  padding: "0",
  listStyle: "none",
  vars: { "--rk-step-marker": "26px" },
});

globalStyle('.rk-stepper[data-size="sm"]', {
  fontSize: `${tokens.textSm}`,
  vars: { "--rk-step-marker": "20px" },
});

globalStyle('.rk-stepper[data-orientation="vertical"]', { flexDirection: "column" });

globalStyle(".rk-step", { position: "relative", flex: "1", minWidth: "0" });

globalStyle(".rk-step:not(:last-child)::after", {
  content: '""',
  position: "absolute",
  borderRadius: `calc(1px * ${tokens.roundness})`,
  background: `${tokens.hatch}`,
});

globalStyle(".rk-step[data-done]:not(:last-child)::after", { background: `${tokens.accent}` });

globalStyle('[data-orientation="horizontal"] > .rk-step:not(:last-child)::after', {
  top: "calc(var(--rk-step-marker) / 2 - 1px)",
  left: `calc(50% + var(--rk-step-marker) / 2 + ${tokens.space} * 2)`,
  right: `calc(var(--rk-step-marker) / 2 + ${tokens.space} * 2 - 50%)`,
  height: "2px",
});

globalStyle('[data-orientation="vertical"] > .rk-step', { paddingBottom: `calc(${tokens.space} * 5)` });

globalStyle('[data-orientation="vertical"] > .rk-step:not(:last-child)::after', {
  top: `calc(var(--rk-step-marker) + ${tokens.space} * 1.5)`,
  bottom: `calc(${tokens.space} * 1.5)`,
  left: "calc(var(--rk-step-marker) / 2 - 1px)",
  width: "2px",
});

globalStyle(".rk-step-inner", {
  display: "flex",
  alignItems: "flex-start",
  gap: `calc(${tokens.space} * 2.5)`,
  padding: "0",
  border: "0",
  background: "none",
  color: "inherit",
  font: "inherit",
  textAlign: "start",
});

globalStyle('[data-orientation="horizontal"] .rk-step-inner', {
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  paddingInline: `calc(${tokens.space} * 2)`,
  textAlign: "center",
});

globalStyle(".rk-step-inner:is(button)", { borderRadius: `${tokens.radiusControl}`, cursor: "pointer" });

globalStyle(".rk-step-inner:is(button):hover .rk-step-label", {
  color: `${tokens.text}`,
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
});

globalStyle(".rk-step-inner[data-disabled]", { opacity: "0.5" });

globalStyle(".rk-step-marker", {
  display: "grid",
  placeItems: "center",
  flex: "none",
  width: "var(--rk-step-marker)",
  height: "var(--rk-step-marker)",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.surface2}`,
  boxShadow: `inset 0 0 0 1px ${tokens.lineStrong}`,
  color: `${tokens.text3}`,
  fontSize: `${tokens.textXs}`,
  fontWeight: "600",
  fontVariantNumeric: "tabular-nums",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-step-marker > svg", {
  width: "round(calc(var(--rk-step-marker) * 0.6), 2px)",
  height: "round(calc(var(--rk-step-marker) * 0.6), 2px)",
  strokeWidth: "2.5",
});

globalStyle('[data-state="complete"] .rk-step-marker', {
  background: `${tokens.accent}`,
  boxShadow: "none",
  color: `${tokens.onAccent}`,
});

globalStyle('[data-state="current"] .rk-step-marker', {
  background: `${tokens.inverse}`,
  boxShadow: `0 0 0 4px ${tokens.accentSoft}`,
  color: `${tokens.onInverse}`,
});

globalStyle('[data-state="error"] .rk-step-marker', {
  background: `${tokens.danger}`,
  boxShadow: "none",
  color: `${tokens.onDanger}`,
});

globalStyle(".rk-step-text", {
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  minWidth: "0",
  paddingTop: "calc((var(--rk-step-marker) - 1.45em) / 2)",
});

globalStyle('[data-orientation="horizontal"] .rk-step-text', { alignItems: "center", paddingTop: "0" });

globalStyle(".rk-step-label", { color: `${tokens.text2}`, fontWeight: "500" });

globalStyle('[data-state="current"] .rk-step-label', { color: `${tokens.text}` });

globalStyle('[data-state="upcoming"] .rk-step-label', { color: `${tokens.text3}` });

globalStyle('[data-state="error"] .rk-step-label', {
  color: `oklch(from ${tokens.danger} calc(l + 0.08) c h)`,
});

globalStyle(".rk-step-desc", { color: `${tokens.text3}`, fontSize: `${tokens.textXs}` });
