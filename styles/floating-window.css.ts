import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-floating-window", {
  position: "fixed",
  inset: "auto",
  display: "flex",
  flexDirection: "column",
  minWidth: "220px",
  minHeight: "120px",
  maxWidth: "calc(100vw - 16px)",
  maxHeight: "calc(100dvh - 16px)",
  margin: "0",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusLg}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
  boxShadow: `${tokens.shadowPop}`,
  color: `${tokens.text}`,
  overflow: "hidden",
  resize: "both",
});

globalStyle(".rk-floating-window-bar", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexShrink: "0",
  padding: "6px 6px 6px 12px",
  boxShadow: `inset 0 -1px 0 ${tokens.line}`,
  cursor: "grab",
  touchAction: "none",
  userSelect: "none",
});

globalStyle(".rk-floating-window-bar:active", { cursor: "grabbing" });

globalStyle(".rk-floating-window-title", {
  flex: "1",
  padding: "0",
  border: "0",
  background: "none",
  color: "inherit",
  font: "inherit",
  textAlign: "start",
  cursor: "inherit",
  minWidth: "0",
  overflow: "hidden",
  borderRadius: `${tokens.radiusSm}`,
  fontSize: `${tokens.textSm}`,
  fontWeight: "600",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-floating-window-close", {
  display: "grid",
  placeItems: "center",
  width: `${tokens.hSm}`,
  height: `${tokens.hSm}`,
  border: "0",
  borderRadius: `${tokens.radiusControl}`,
  background: "transparent",
  color: `${tokens.text2}`,
  cursor: "pointer",
});

globalStyle(".rk-floating-window-close:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });

globalStyle(".rk-floating-window-body", { flex: "1", minHeight: "0", overflow: "auto", padding: "12px" });
