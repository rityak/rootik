import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-tour-spot", {
  position: "fixed",
  zIndex: "2147483646",
  borderRadius: `${tokens.radiusMd}`,
  boxShadow: `0 0 0 2px ${tokens.accent},
    0 0 0 100vmax oklch(${tokens.shade} / 0.55)`,
  pointerEvents: "none",
  transition: `left ${tokens.durSlow} ${tokens.easeOut},
    top ${tokens.durSlow} ${tokens.easeOut},
    width ${tokens.durSlow} ${tokens.easeOut},
    height ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle(".rk-tour", {
  width: "min(320px, calc(100vw - 16px))",
  padding: "14px",
  borderRadius: `${tokens.radiusLg}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
  boxShadow: `${tokens.shadowPop}`,
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-tour:focus-visible", { outlineOffset: "2px" });

globalStyle(".rk-tour-head", { display: "flex", alignItems: "flex-start", gap: "8px" });

globalStyle(".rk-tour-title", { flex: "1", fontSize: `${tokens.textMd}`, fontWeight: "600" });

globalStyle(".rk-tour-close", {
  display: "grid",
  placeItems: "center",
  width: "24px",
  height: "24px",
  margin: "-4px -4px 0 0",
  border: "0",
  borderRadius: `calc(6px * ${tokens.roundness})`,
  background: "transparent",
  color: `${tokens.text3}`,
  cursor: "pointer",
});

globalStyle(".rk-tour-close:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });

globalStyle(".rk-tour-content", { marginTop: "6px", color: `${tokens.text2}`, textWrap: "pretty" });

globalStyle(".rk-tour-foot", { display: "flex", alignItems: "center", gap: "6px", marginTop: "14px" });

globalStyle(".rk-tour-count", { flex: "1", color: `${tokens.text3}`, fontSize: `${tokens.textXs}` });
