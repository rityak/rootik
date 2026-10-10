import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-slider", {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  minWidth: "120px",
  vars: { "--rk-track": "6px", "--rk-thumb": "16px" },
});

globalStyle(".rk-slider-head", {
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-slider-value", { marginInlineStart: "auto", color: `${tokens.text}`, fontWeight: "500" });

globalStyle(".rk-slider-input", {
  appearance: "none",
  width: "100%",
  height: "var(--rk-thumb)",
  margin: "0",
  background: "transparent",
  cursor: "pointer",
});

globalStyle(".rk-slider-input::-webkit-slider-runnable-track", {
  height: "var(--rk-track)",
  borderRadius: `${tokens.radiusPill}`,
  background: `linear-gradient(to right, ${tokens.accent} var(--rk-fill), transparent var(--rk-fill)), ${tokens.hatch},
      ${tokens.surface3}`,
});

globalStyle(".rk-slider-input::-moz-range-track", {
  height: "var(--rk-track)",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.hatch}, ${tokens.surface3}`,
});

globalStyle(".rk-slider-input::-moz-range-progress", {
  height: "var(--rk-track)",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.accent}`,
});

globalStyle(".rk-slider-input::-webkit-slider-thumb", {
  appearance: "none",
  width: "var(--rk-thumb)",
  height: "var(--rk-thumb)",
  marginTop: "calc((var(--rk-track) - var(--rk-thumb)) / 2)",
  border: "0",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.inverse}`,
  boxShadow: `0 0 0 0 ${tokens.accentSoft},
      0 2px 6px oklch(${tokens.shade} / 0.5)`,
  transition: `box-shadow ${tokens.dur} ${tokens.ease},
      scale ${tokens.dur} ${tokens.spring}`,
});

globalStyle(".rk-slider-input::-moz-range-thumb", {
  width: "var(--rk-thumb)",
  height: "var(--rk-thumb)",
  border: "0",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.inverse}`,
  boxShadow: `0 2px 6px oklch(${tokens.shade} / 0.5)`,
});

globalStyle(".rk-slider-input:hover::-webkit-slider-thumb", {
  boxShadow: `0 0 0 5px ${tokens.accentSoft},
      0 2px 6px oklch(${tokens.shade} / 0.5)`,
});

globalStyle(".rk-slider-input:active::-webkit-slider-thumb", { scale: "1.15" });

globalStyle(".rk-slider-input:focus-visible", { outline: "none" });

globalStyle(".rk-slider-input:focus-visible::-webkit-slider-thumb", {
  boxShadow: `0 0 0 2px ${tokens.bg},
        0 0 0 4px ${tokens.focus}`,
});

globalStyle(".rk-slider-input:focus-visible::-moz-range-thumb", {
  boxShadow: `0 0 0 2px ${tokens.bg},
        0 0 0 4px ${tokens.focus}`,
});

globalStyle(".rk-slider-input:disabled", { opacity: "0.45", cursor: "not-allowed" });

globalStyle(".rk-slider-marks", {
  position: "relative",
  height: "1.2em",
  margin: "0 calc(var(--rk-thumb) / 2)",
  fontSize: `${tokens.text2xs}`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-slider-marks span", { position: "absolute", translate: "-50% 0" });

globalStyle('.rk-slider[data-orientation="vertical"]', {
  flexDirection: "column-reverse",
  alignItems: "center",
  minWidth: "0",
  minHeight: "120px",
});

globalStyle('.rk-slider[data-orientation="vertical"] .rk-slider-input', {
  flex: "1",
  width: "var(--rk-thumb)",
  height: "auto",
  writingMode: "vertical-lr",
  direction: "rtl",
});

globalStyle('.rk-slider[data-orientation="vertical"] .rk-slider-input::-webkit-slider-runnable-track', {
  width: "var(--rk-track)",
  height: "100%",
  background: `linear-gradient(to top, ${tokens.accent} var(--rk-fill), transparent var(--rk-fill)), ${tokens.hatch},
        ${tokens.surface3}`,
});

globalStyle('.rk-slider[data-orientation="vertical"] .rk-slider-input::-webkit-slider-thumb', {
  marginTop: "0",
  marginLeft: "calc((var(--rk-track) - var(--rk-thumb)) / 2)",
});

globalStyle(".rk-range-body", { position: "relative", height: "var(--rk-thumb)" });

globalStyle(".rk-range-body[data-disabled]", { opacity: "0.45" });

globalStyle(".rk-range-track", {
  position: "absolute",
  inset: "calc((var(--rk-thumb) - var(--rk-track)) / 2) 0",
  borderRadius: `${tokens.radiusPill}`,
  background: `linear-gradient(
      to right,
      transparent var(--rk-lo),
      ${tokens.accent} var(--rk-lo),
      ${tokens.accent} var(--rk-hi),
      transparent var(--rk-hi)
    ),
    ${tokens.hatch}, ${tokens.surface3}`,
});

globalStyle(".rk-range-input", { position: "absolute", inset: "0", pointerEvents: "none" });

globalStyle(".rk-range-input[data-top]", { zIndex: "1" });

globalStyle(".rk-range-input::-webkit-slider-runnable-track", { background: "transparent" });

globalStyle(".rk-range-input::-moz-range-track, .rk-range-input::-moz-range-progress", {
  background: "transparent",
});

globalStyle(".rk-range-input::-webkit-slider-thumb", { pointerEvents: "auto" });

globalStyle(".rk-range-input::-moz-range-thumb", { pointerEvents: "auto" });

globalStyle(".rk-range-input:disabled", { opacity: "1" });
