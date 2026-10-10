import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-stick", { position: "relative", display: "flex", flexDirection: "column", minHeight: "0" });

globalStyle(".rk-stick-viewport", {
  flex: "1",
  minHeight: "0",
  overflowY: "auto",
  overflowAnchor: "auto",
  overscrollBehaviorY: "contain",
});

globalStyle(".rk-stick-jump", {
  position: "absolute",
  bottom: `calc(${tokens.space} * 3)`,
  left: "50%",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  height: "28px",
  padding: "0 12px 0 10px",
  border: "0",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.inverse}`,
  boxShadow: `0 8px 24px -8px oklch(${tokens.shade} / 0.7)`,
  color: `${tokens.onInverse}`,
  font: "inherit",
  fontSize: `${tokens.textXs}`,
  fontWeight: "500",
  translate: "-50% 0",
  cursor: "pointer",
  transition: `opacity ${tokens.dur} ${tokens.ease},
    translate ${tokens.dur} ${tokens.easeOut}`,
});

globalStyle(".rk-stick-jump", { "@starting-style": { opacity: "0", translate: "-50% 8px" } });

globalStyle(".rk-stick-jump > svg", { width: "1.1em", height: "1.1em" });

globalStyle(".rk-stick-unseen", {
  minWidth: "18px",
  padding: "0 5px",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.accent}`,
  color: `${tokens.onAccent}`,
  fontSize: `${tokens.text2xs}`,
  lineHeight: "18px",
  textAlign: "center",
});
