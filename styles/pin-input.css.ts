import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-pin", {
  display: "inline-flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 3)`,
  vars: { "--rk-pin-size": `${tokens.hMd}` },
});

globalStyle('.rk-pin[data-size="sm"]', { vars: { "--rk-pin-size": `${tokens.hSm}` } });

globalStyle('.rk-pin[data-size="lg"]', { vars: { "--rk-pin-size": `${tokens.hLg}` } });

globalStyle(".rk-pin-group", { display: "inline-flex", gap: `calc(${tokens.space} * 1.5)` });

globalStyle(".rk-pin-cell", {
  width: "calc(var(--rk-pin-size) * 1.05)",
  height: "calc(var(--rk-pin-size) * 1.2)",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusControl}`,
  background: `${tokens.well}`,
  boxShadow: "inset 0 0 0 1px var(--rk-ctl-edge)",
  color: `${tokens.text}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: "calc(var(--rk-pin-size) * 0.5)",
  fontVariantNumeric: "tabular-nums",
  textAlign: "center",
  textTransform: "uppercase",
  caretColor: `${tokens.accent}`,
  outline: "none",
  appearance: "none",
  transition: `box-shadow ${tokens.dur} ${tokens.ease}`,
  vars: { "--rk-ctl-edge": `${tokens.controlEdge}` },
});

globalStyle(".rk-pin-cell[data-filled]", { vars: { "--rk-ctl-edge": `${tokens.text3}` } });

globalStyle(".rk-pin-cell:hover:not(:disabled)", { vars: { "--rk-ctl-edge": `${tokens.text2}` } });

globalStyle(".rk-pin-cell:focus", { vars: { "--rk-ctl-edge": `${tokens.accentLine}` } });

globalStyle(".rk-pin-cell:focus-visible", { outline: `2px solid ${tokens.focus}`, outlineOffset: "1px" });

globalStyle("[data-invalid] .rk-pin-cell", {
  vars: { "--rk-ctl-edge": `color-mix(in oklab, ${tokens.danger} 70%, transparent)` },
});

globalStyle(".rk-pin-cell:disabled", { opacity: "0.5", cursor: "not-allowed" });

globalStyle(".rk-pin-group + .rk-pin-group::before", {
  content: '""',
  alignSelf: "center",
  width: `calc(${tokens.space} * 2)`,
  height: "2px",
  marginInline: `calc(${tokens.space} * -1) calc(${tokens.space} * 0.5)`,
  borderRadius: `calc(1px * ${tokens.roundness})`,
  background: `${tokens.lineStrong}`,
});
