import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-sortable", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  margin: "0",
  padding: "0",
  listStyle: "none",
});

globalStyle(".rk-sortable-item", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 8px 4px 4px",
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.wellSoft}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  transition: `background-color ${tokens.dur} ${tokens.ease},
    box-shadow ${tokens.dur} ${tokens.ease},
    scale ${tokens.dur} ${tokens.spring}`,
});

globalStyle(".rk-sortable-item[data-lifted]", {
  position: "relative",
  zIndex: "1",
  background: `${tokens.surface3}`,
  boxShadow: `inset 0 0 0 1px ${tokens.accentLine},
      0 8px 24px -10px oklch(${tokens.shade} / 0.7)`,
  scale: "1.01",
});

globalStyle(".rk-sortable-grip", {
  display: "grid",
  placeItems: "center",
  flexShrink: "0",
  width: "24px",
  height: "28px",
  padding: "0",
  border: "0",
  borderRadius: `calc(6px * ${tokens.roundness})`,
  background: "transparent",
  color: `${tokens.text3}`,
  fontSize: "16px",
  cursor: "grab",
  touchAction: "none",
});

globalStyle(".rk-sortable-grip:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });

globalStyle('.rk-sortable-grip[aria-pressed="true"]', { color: `${tokens.accentText}`, cursor: "grabbing" });

globalStyle(".rk-sortable-content", { flex: "1", minWidth: "0" });
