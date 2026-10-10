import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-split-toggle", { width: "calc(var(--rk-btn-h) * 0.8)", vars: { "--rk-btn-px": "0" } });

globalStyle(".rk-split-toggle .rk-icon", {
  fontSize: "1em",
  transition: `rotate ${tokens.dur} ${tokens.ease}`,
});

globalStyle('.rk-split-toggle[aria-expanded="true"] .rk-icon', { rotate: "180deg" });

globalStyle(".rk-split-button", { gap: "0" });

globalStyle(".rk-split-button > .rk-button + .rk-button", { position: "relative" });

globalStyle(".rk-split-button > .rk-button + .rk-button::before", {
  content: '""',
  position: "absolute",
  insetBlock: "22%",
  insetInlineStart: "0",
  width: "1px",
  background: "color-mix(in oklab, var(--rk-btn-fg) 24%, transparent)",
});
