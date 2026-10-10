import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-tooltip", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  maxWidth: "280px",
  padding: "5px 9px",
  borderRadius: `calc(${tokens.radiusSm} * 0.8)`,
  background: `${tokens.inverse}`,
  color: `${tokens.onInverse}`,
  boxShadow: `0 8px 24px -8px oklch(${tokens.shade} / 0.6)`,
  fontSize: `${tokens.textXs}`,
  fontWeight: "500",
  lineHeight: "1.35",
});

globalStyle(".rk-tooltip-kbd", {
  fontFamily: `${tokens.fontMono}`,
  fontSize: `${tokens.text2xs}`,
  opacity: "0.6",
});
