import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-overflow-list", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 1.5)`,
  minWidth: "0",
});

globalStyle(".rk-overflow-item", { display: "flex", flexShrink: "0" });

globalStyle(".rk-overflow-measure", {
  position: "absolute",
  top: "0",
  left: "0",
  display: "flex",
  gap: "inherit",
  width: "max-content",
  visibility: "hidden",
  pointerEvents: "none",
});

globalStyle(".rk-overflow-more", {
  display: "inline-flex",
  flexShrink: "0",
  alignItems: "center",
  height: "22px",
  padding: "0 8px",
  border: "0",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.surface3}`,
  color: `${tokens.text2}`,
  font: "inherit",
  fontSize: `${tokens.textXs}`,
  fontWeight: "500",
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.dur} ${tokens.ease}`,
});

globalStyle('.rk-overflow-more:hover, .rk-overflow-more[aria-expanded="true"]', {
  background: `${tokens.surface4}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-overflow-menu", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: `calc(${tokens.space} * 1.5)`,
  maxHeight: "min(320px, var(--rk-available-h, 320px))",
  overflow: "auto",
});
