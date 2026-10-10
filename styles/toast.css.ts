import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-toaster", {
  position: "fixed",
  inset: "auto",
  margin: "0",
  padding: "16px",
  border: "0",
  background: "transparent",
  overflow: "visible",
  width: "min(380px, 100vw)",
  pointerEvents: "none",
});

globalStyle(".rk-toaster:not(:popover-open)", { display: "none" });

globalStyle('.rk-toaster[data-position^="bottom"]', { bottom: "0" });

globalStyle('.rk-toaster[data-position^="top"]', { top: "0" });

globalStyle('.rk-toaster[data-position$="right"]', { right: "0" });

globalStyle('.rk-toaster[data-position$="left"]', { left: "0" });

globalStyle('.rk-toaster[data-position$="center"]', { left: "50%", translate: "-50% 0" });

globalStyle(".rk-toaster-list", {
  position: "relative",
  transition: `height ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle(".rk-toast", {
  position: "absolute",
  insetInline: "0",
  translate: "var(--rk-toast-x, 0) var(--rk-toast-y, 0)",
  scale: "var(--rk-toast-scale, 1)",
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "12px 12px 12px 14px",
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
  boxShadow: `${tokens.shadowPop}`,
  fontSize: `${tokens.textSm}`,
  pointerEvents: "auto",
  overflow: "hidden",
  touchAction: "pan-y",
  transition: `opacity ${tokens.durSlow} ${tokens.ease},
    translate ${tokens.durSlow} ${tokens.easeOut},
    scale ${tokens.durSlow} ${tokens.easeOut},
    height ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle('[data-position^="bottom"] .rk-toast', { bottom: "0", transformOrigin: "50% 0" });

globalStyle('[data-position^="top"] .rk-toast', { top: "0", transformOrigin: "50% 100%" });

globalStyle(".rk-toast[data-behind] > *", { opacity: "0" });

globalStyle(".rk-toast > *", { transition: `opacity ${tokens.dur} ${tokens.ease}` });

globalStyle(".rk-toast[data-swiping]", { transition: "none" });

globalStyle(".rk-toast", {
  "@starting-style": { opacity: "0", translate: "0 calc(var(--rk-toast-y, 0px) + 12px)" },
});

globalStyle('[data-position^="top"] .rk-toast', {
  "@starting-style": { translate: "0 calc(var(--rk-toast-y, 0px) - 12px)" },
});

globalStyle(".rk-toast-icon", { marginTop: "1px", fontSize: "16px", color: "var(--rk-tone-text)" });

globalStyle(".rk-toast-body", { flex: "1", minWidth: "0" });

globalStyle(".rk-toast-title", { fontWeight: "500", color: `${tokens.text}` });

globalStyle(".rk-toast-desc", { marginTop: "2px", color: `${tokens.text3}`, overflowWrap: "anywhere" });

globalStyle(".rk-toast-action", {
  flexShrink: "0",
  height: "24px",
  padding: "0 10px",
  border: "0",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.inverse}`,
  color: `${tokens.onInverse}`,
  font: "inherit",
  fontSize: `${tokens.textXs}`,
  fontWeight: "600",
  cursor: "pointer",
});

globalStyle(".rk-toast-close", {
  display: "grid",
  placeItems: "center",
  flexShrink: "0",
  width: "22px",
  height: "22px",
  padding: "0",
  border: "0",
  borderRadius: `calc(6px * ${tokens.roundness})`,
  background: "transparent",
  color: `${tokens.text3}`,
  cursor: "pointer",
});

globalStyle(".rk-toast-close:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });
