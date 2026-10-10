import { globalStyle } from "@vanilla-extract/css";
import type { Size } from "../src/components/button";
import { tokens } from "./tokens.css";

const sizeSelector = (value: Size) => `.rk-input[data-size="${value}"]`;

globalStyle(".rk-field", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 1.5)`,
  minWidth: 0,
});

globalStyle('.rk-field[data-layout="inline"]', {
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  columnGap: `calc(${tokens.space} * 6)`,
  rowGap: `${tokens.space}`,
});

globalStyle('.rk-field[data-layout="inline"] .rk-field-text', {
  flex: "1 1 200px",
});

globalStyle('.rk-field[data-layout="inline"] .rk-field-control', {
  flex: "0 1 auto",
  display: "flex",
  justifyContent: "flex-end",
});

globalStyle('.rk-field[data-layout="inline"] .rk-field-error', {
  flexBasis: "100%",
});

globalStyle(".rk-field-text", {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: 0,
});

globalStyle(".rk-field-top", {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: `${tokens.space}`,
});

globalStyle(".rk-field-label", {
  fontSize: `${tokens.textSm}`,
  fontWeight: 500,
  color: `${tokens.text}`,
});

globalStyle('[data-layout="stack"] > .rk-field-text .rk-field-label', {
  color: `${tokens.text2}`,
});

globalStyle(".rk-field-required", {
  color: `${tokens.danger}`,
});

globalStyle(".rk-field-aside", {
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
  fontVariantNumeric: "tabular-nums",
});

globalStyle(".rk-field-control", {
  minWidth: 0,
});

globalStyle(".rk-field-hint", {
  fontSize: `${tokens.textXs}`,
  lineHeight: 1.4,
  color: `${tokens.text3}`,
  textWrap: "pretty",
});

globalStyle(".rk-field-error", {
  fontSize: `${tokens.textXs}`,
  color: `oklch(from ${tokens.danger} calc(l + 0.08) c h)`,
});

globalStyle(".rk-input, .rk-textarea, .rk-select-trigger", {
  vars: {
    "--rk-ctl-edge": `${tokens.controlEdge}`,
  },
  background: `${tokens.well}`,
  borderRadius: `${tokens.radiusControl}`,
  boxShadow: "inset 0 0 0 1px var(--rk-ctl-edge)",
  color: `${tokens.text}`,
  transition: `box-shadow ${tokens.dur} ${tokens.ease}, background-color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-input:hover, .rk-textarea:hover, .rk-select-trigger:hover", {
  vars: {
    "--rk-ctl-edge": `${tokens.text3}`,
  },
});

globalStyle(
  '.rk-input:focus-within, .rk-textarea:focus-within, .rk-select-trigger:focus-within, .rk-input[aria-expanded="true"], .rk-textarea[aria-expanded="true"], .rk-select-trigger[aria-expanded="true"]',
  {
    vars: {
      "--rk-ctl-edge": `${tokens.accentLine}`,
    },
  },
);

globalStyle(
  ".rk-input:is(:focus-visible, :has(:focus-visible)), .rk-textarea:is(:focus-visible, :has(:focus-visible)), .rk-select-trigger:is(:focus-visible, :has(:focus-visible))",
  {
    outline: `2px solid ${tokens.focus}`,
    outlineOffset: "2px",
  },
);

globalStyle(
  '.rk-input[data-invalid], .rk-textarea[data-invalid], .rk-select-trigger[data-invalid], .rk-input[aria-invalid="true"], .rk-textarea[aria-invalid="true"], .rk-select-trigger[aria-invalid="true"]',
  {
    vars: {
      "--rk-ctl-edge": `color-mix(in oklab, ${tokens.danger} 70%, transparent)`,
    },
  },
);

globalStyle(
  ".rk-input[data-disabled], .rk-textarea[data-disabled], .rk-select-trigger[data-disabled], .rk-input:disabled, .rk-textarea:disabled, .rk-select-trigger:disabled",
  {
    opacity: 0.5,
    cursor: "not-allowed",
  },
);

globalStyle(".rk-input", {
  vars: {
    "--rk-input-h": `${tokens.hMd}`,
  },
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
  height: "var(--rk-input-h)",
  padding: `0 calc(${tokens.space} * 3)`,
  minWidth: 0,
  cursor: "text",
  fontSize: `${tokens.textMd}`,
});

globalStyle(sizeSelector("sm"), {
  vars: {
    "--rk-input-h": `${tokens.hSm}`,
  },
  padding: `0 calc(${tokens.space} * 2.5)`,
  fontSize: `${tokens.textSm}`,
});

globalStyle(sizeSelector("lg"), {
  vars: {
    "--rk-input-h": `${tokens.hLg}`,
  },
  padding: `0 calc(${tokens.space} * 4)`,
});

globalStyle(".rk-input-el", {
  flex: 1,
  minWidth: 0,
  height: "100%",
  padding: 0,
  margin: 0,
  border: 0,
  outline: "none",
  background: "transparent",
  color: "inherit",
  font: "inherit",
});

globalStyle(".rk-input-el::placeholder", {
  color: `${tokens.text3}`,
});

globalStyle(".rk-input-el[data-mono]", {
  fontFamily: `${tokens.fontMono}`,
  fontSize: "0.94em",
});

globalStyle(".rk-input-el::-webkit-search-cancel-button", {
  appearance: "none",
});

globalStyle(".rk-input-el:disabled", {
  cursor: "not-allowed",
});

globalStyle(".rk-input-icon", {
  color: `${tokens.text3}`,
  fontSize: "1.1em",
});

globalStyle(".rk-input:focus-within .rk-input-icon", {
  color: `${tokens.text2}`,
});

globalStyle(".rk-input-end", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  flexShrink: 0,
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-input-clear", {
  display: "grid",
  placeItems: "center",
  width: "20px",
  height: "20px",
  padding: 0,
  border: 0,
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.hover}`,
  color: `${tokens.text2}`,
  cursor: "pointer",
});

globalStyle(".rk-input-clear:hover", {
  background: `${tokens.press}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-textarea", {
  display: "block",
  width: "100%",
  minHeight: `calc(${tokens.hMd} * 2)`,
  borderRadius: `min(${tokens.radiusControl}, calc(${tokens.hMd} / 2))`,
  padding: `calc(${tokens.space} * 2) calc(${tokens.space} * 3)`,
  margin: 0,
  border: 0,
  font: "inherit",
  fontSize: `${tokens.textMd}`,
  lineHeight: 1.5,
  resize: "vertical",
});

globalStyle(".rk-textarea::placeholder", {
  color: `${tokens.text3}`,
});

globalStyle(".rk-textarea[data-mono]", {
  fontFamily: `${tokens.fontMono}`,
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-textarea[data-autosize]", {
  fieldSizing: "content",
  resize: "none",
  maxHeight: "40vh",
});

globalStyle(".rk-date-range", {
  display: "inline-flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "6px",
});

globalStyle(".rk-date-range .rk-input", {
  width: "auto",
});

globalStyle(".rk-date-range-sep", {
  color: `${tokens.text3}`,
});

globalStyle(".rk-input input::-webkit-calendar-picker-indicator", {
  opacity: 0.6,
  cursor: "pointer",
});

globalStyle(".rk-input input::-webkit-calendar-picker-indicator:hover", {
  opacity: 1,
});
