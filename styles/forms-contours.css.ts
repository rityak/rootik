import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-form", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 4)`,
  minWidth: 0,
});
globalStyle(".rk-settings-content", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 5)`,
});
globalStyle(".rk-settings-header", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "start",
  justifyContent: "space-between",
  gap: `calc(${tokens.space} * 3)`,
});
globalStyle(".rk-settings-header > div:first-child", { minWidth: 0, flex: "1 1 180px" });
globalStyle(".rk-settings-heading", {
  margin: 0,
  fontSize: `${tokens.textMd}`,
  lineHeight: 1.4,
  fontWeight: 600,
  color: `${tokens.text}`,
});
globalStyle(".rk-settings-description", {
  margin: `${tokens.space} 0 0`,
  fontSize: `${tokens.textXs}`,
  lineHeight: 1.6,
  color: `${tokens.text2}`,
});
globalStyle('.rk-settings-surface[data-tone="danger"]', {
  vars: {
    "--rk-svg-edge-top": `${tokens.danger}`,
    "--rk-svg-edge": `color-mix(in oklab, ${tokens.danger} 40%, ${tokens.line})`,
  },
});
globalStyle('.rk-settings-surface[data-tone="danger"] .rk-settings-heading', { color: `${tokens.danger}` });
globalStyle(".rk-fieldset[data-surface]", {
  position: "relative",
  isolation: "isolate",
  padding: "var(--rk-form-pad)",
  background: "none",
  boxShadow: "none",
});
globalStyle(".rk-fieldset > .rk-fieldset-surface", {
  position: "absolute",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
});
globalStyle(".rk-fieldset-surface > .rk-svg-surface-content", { display: "none" });
globalStyle(".rk-fieldset:is(:hover, :focus-within) > .rk-fieldset-surface .rk-motion-light", {
  animationName: "var(--rk-effect-animation)",
});
globalStyle(".rk-fieldset:disabled > .rk-fieldset-surface .rk-motion-light", { animationName: "none" });
globalStyle('.rk-schema-row > [data-layout="inline"] > .rk-field-control', { maxWidth: "100%" });
globalStyle(
  '.rk-schema-row > [data-layout="inline"] > .rk-field-control :is(.rk-input, .rk-select-trigger, .rk-slider, .rk-textarea)',
  { maxWidth: "100%" },
);
globalStyle(".rk-settings-actions, .rk-schema-actions", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
});
