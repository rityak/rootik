import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle("html:has(.rk-lightbox[open])", { overflow: "hidden" });

globalStyle(".rk-lightbox", {
  width: "100vw",
  height: "100dvh",
  maxWidth: "none",
  maxHeight: "none",
  margin: "0",
  padding: "0",
  border: "0",
  background: `oklch(${tokens.shade} / 0.86)`,
  color: `${tokens.text}`,
  overflow: "hidden",
  outline: "none",
  opacity: "0",
  transition: `opacity ${tokens.dur} ${tokens.ease},
    display ${tokens.dur} allow-discrete,
    overlay ${tokens.dur} allow-discrete`,
});

globalStyle(".rk-lightbox::backdrop", {
  background: "transparent",
  backdropFilter: `blur(calc(${tokens.blur} * 0.6)) saturate(0.8)`,
});

globalStyle(".rk-lightbox[open]", { display: "flex", flexDirection: "column", opacity: "1" });

globalStyle(".rk-lightbox[open]", { "@starting-style": { opacity: "0" } });

globalStyle(".rk-lightbox-bar", {
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 3)`,
  padding: `calc(${tokens.space} * 2) calc(${tokens.space} * 3)`,
});

globalStyle(".rk-lightbox-title", {
  display: "flex",
  alignItems: "baseline",
  gap: `calc(${tokens.space} * 3)`,
  flex: "1",
  minWidth: "0",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-lightbox-counter", { flex: "none", color: `${tokens.text3}` });

globalStyle(".rk-lightbox-tools", {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  padding: "3px",
  borderRadius: `calc(${tokens.radiusControl} + 3px * ${tokens.roundness})`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.1)`,
  boxShadow: `${tokens.shadowPop}`,
});

globalStyle(".rk-lightbox-zoom", {
  minWidth: "5ch",
  textAlign: "center",
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-lightbox-stage", {
  position: "relative",
  flex: "1",
  minHeight: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `calc(${tokens.space} * 2) calc(${tokens.hLg} + ${tokens.space} * 5)`,
  overflow: "hidden",
  touchAction: "none",
  outline: "none",
});

globalStyle(".rk-lightbox-img", {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  userSelect: "none",
  cursor: "zoom-in",
  opacity: "0",
  transition: `transform ${tokens.dur} ${tokens.easeOut},
    opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-lightbox-img[data-ready]", { opacity: "1" });

globalStyle("[data-zoomed] > .rk-lightbox-img", { cursor: "grab" });

globalStyle("[data-dragging] > .rk-lightbox-img", {
  cursor: "grabbing",
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-lightbox-spinner", { position: "absolute", color: `${tokens.text3}` });

globalStyle(".rk-lightbox-error", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-lightbox-error > svg", { width: "40px", height: "40px", strokeWidth: "1.25" });

globalStyle(".rk-lightbox-nav", {
  position: "absolute",
  top: "50%",
  translate: "0 -50%",
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur})`,
  boxShadow: `${tokens.shadow2}`,
});

globalStyle('.rk-lightbox-nav[data-side="prev"]', { left: `calc(${tokens.space} * 3)` });

globalStyle('.rk-lightbox-nav[data-side="next"]', { right: `calc(${tokens.space} * 3)` });

globalStyle(".rk-lightbox-nav:disabled", { opacity: "0" });

globalStyle(".rk-lightbox-caption", {
  margin: "0",
  padding: `0 calc(${tokens.space} * 6) calc(${tokens.space} * 2)`,
  textAlign: "center",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text2}`,
  textWrap: "balance",
});

globalStyle(".rk-lightbox-strip", {
  display: "flex",
  gap: `calc(${tokens.space} * 1.5)`,
  padding: `calc(${tokens.space} * 2) calc(${tokens.space} * 3) calc(${tokens.space} * 3)`,
  overflowX: "auto",
  scrollbarWidth: "none",
});

globalStyle(".rk-lightbox-strip > :first-child", { marginInlineStart: "auto" });

globalStyle(".rk-lightbox-strip > :last-child", { marginInlineEnd: "auto" });

globalStyle(".rk-lightbox-thumb", {
  position: "relative",
  display: "grid",
  placeItems: "center",
  flex: "none",
  width: "56px",
  height: "56px",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusSm}`,
  overflow: "hidden",
  background: `${tokens.surface2}`,
  opacity: "0.5",
  cursor: "pointer",
  transition: `opacity ${tokens.dur} ${tokens.ease},
    box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-lightbox-thumb > svg", { width: "20px", height: "20px", color: `${tokens.text3}` });

globalStyle(".rk-lightbox-thumb > img", {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

globalStyle(".rk-lightbox-thumb:hover", { opacity: "0.8" });

globalStyle('.rk-lightbox-thumb[aria-current="true"]', {
  opacity: "1",
  boxShadow: `0 0 0 2px ${tokens.bg},
      0 0 0 4px ${tokens.inverse}`,
});
