import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-file-drop", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: `calc(${tokens.space} * 3)`,
  minHeight: "160px",
  padding: `calc(${tokens.space} * 6)`,
  borderRadius: `${tokens.radiusLg}`,
  background: `${tokens.hatch}, ${tokens.wellSoft}`,
  boxShadow: `inset 0 0 0 1.5px ${tokens.lineStrong}`,
  color: `${tokens.text2}`,
  textAlign: "center",
  transition: `box-shadow ${tokens.dur} ${tokens.ease},
    background-color ${tokens.dur} ${tokens.ease}`,
});

globalStyle('.rk-file-drop[data-size="sm"]', {
  flexDirection: "row",
  gap: `calc(${tokens.space} * 2.5)`,
  minHeight: `${tokens.hLg}`,
  padding: `calc(${tokens.space} * 2) calc(${tokens.space} * 4)`,
  borderRadius: `${tokens.radiusMd}`,
  textAlign: "start",
});

globalStyle(".rk-file-drop[data-dragging]", {
  background: `${tokens.hatch}, ${tokens.accentSoft}`,
  boxShadow: `inset 0 0 0 1.5px ${tokens.accentLine},
      0 0 0 3px ${tokens.accentSoft}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-file-drop[data-disabled]", { opacity: "0.5" });

globalStyle(".rk-file-drop:has(.rk-file-drop-browse:focus-visible)", {
  boxShadow: `inset 0 0 0 1.5px ${tokens.accentLine}`,
});

globalStyle(".rk-file-drop-icon", {
  display: "grid",
  placeItems: "center",
  width: "44px",
  height: "44px",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.surface3}`,
  boxShadow: `${tokens.highlight}`,
  color: `${tokens.text2}`,
  fontSize: "20px",
});

globalStyle('[data-size="sm"] > .rk-file-drop-icon', { width: "28px", height: "28px", fontSize: "14px" });

globalStyle("[data-dragging] > .rk-file-drop-icon", { color: `${tokens.accentText}` });

globalStyle(".rk-file-drop-text", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: `${tokens.textMd}`,
});

globalStyle(".rk-file-drop-browse", {
  padding: "0",
  border: "0",
  background: "none",
  color: `${tokens.accentText}`,
  font: "inherit",
  fontWeight: "500",
  textDecoration: "underline",
  textDecorationColor: `${tokens.accentLine}`,
  textUnderlineOffset: "3px",
  cursor: "pointer",
});

globalStyle(".rk-file-drop-browse:hover", { textDecorationColor: "currentColor" });

globalStyle(".rk-file-drop-browse:disabled", { cursor: "not-allowed" });

globalStyle(".rk-file-drop-hint", { color: `${tokens.text3}`, fontSize: `${tokens.textXs}` });
