import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-thumb", {
  display: "flex",
  flexDirection: "column",
  gap: `${tokens.space}`,
  margin: "0",
  minWidth: "0",
});

globalStyle(".rk-thumb-frame", {
  position: "relative",
  aspectRatio: "var(--rk-thumb-aspect, 1)",
  overflow: "hidden",
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.surface2}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  display: "grid",
  placeItems: "center",
});

globalStyle(".rk-thumb-frame > img", {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0",
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle('[data-fit="contain"] > .rk-thumb-frame > img', { objectFit: "contain" });

globalStyle('[data-status="ready"] > .rk-thumb-frame > img', { opacity: "1" });

globalStyle('[data-status="loading"] > .rk-thumb-frame', {
  backgroundImage: `linear-gradient(
      100deg,
      transparent 30%,
      oklch(${tokens.tint} / 0.05) 50%,
      transparent 70%
    )`,
  backgroundSize: "200% 100%",
  animation: `rk-shimmer calc(${tokens.durSlow} * 5) linear infinite`,
  animationPlayState: `${tokens.animationState}`,
});

globalStyle(".rk-thumb-missing", {
  width: "28%",
  maxWidth: "32px",
  height: "auto",
  color: `${tokens.text3}`,
  strokeWidth: "1.5",
});

globalStyle(".rk-thumb-badge", {
  position: "absolute",
  top: `calc(${tokens.space} * 1.5)`,
  right: `calc(${tokens.space} * 1.5)`,
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "1px 6px",
  borderRadius: `${tokens.radiusPill}`,
  fontSize: `${tokens.text2xs}`,
  fontVariantNumeric: "tabular-nums",
  color: `${tokens.text}`,
  background: `oklch(${tokens.shade} / 0.6)`,
  backdropFilter: "blur(6px)",
});

globalStyle(".rk-thumb-label", { fontSize: `${tokens.textXs}`, color: `${tokens.text2}`, lineHeight: "1.4" });

globalStyle(".rk-thumb[data-selected] > .rk-thumb-frame", { boxShadow: `inset 0 0 0 2px ${tokens.accent}` });

globalStyle(".rk-thumb[data-selected] > .rk-thumb-frame > img", {
  scale: "0.94",
  borderRadius: `calc(${tokens.radiusMd} * 0.7)`,
});

globalStyle(".rk-thumb[data-selected] > .rk-thumb-label", { color: `${tokens.text}` });

globalStyle(".rk-image-grid", { minWidth: "0", outline: "none" });

globalStyle(".rk-image-grid[data-virtual]", { overflow: "auto", padding: "4px" });

globalStyle(".rk-image-grid-cells", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(var(--rk-grid-size, 160px), 1fr))",
  gap: `calc(${tokens.space} * 3) calc(${tokens.space} * 2)`,
});

globalStyle(".rk-image-grid-item", {
  position: "relative",
  minWidth: "0",
  borderRadius: `${tokens.radiusMd}`,
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
});

globalStyle(".rk-image-grid-item img", {
  transition: `opacity ${tokens.dur} ${tokens.ease},
      scale ${tokens.dur} ${tokens.easeOut}`,
});

globalStyle(".rk-image-grid-item:hover .rk-thumb-frame::after", {
  content: '""',
  position: "absolute",
  inset: "0",
  background: `oklch(${tokens.tint} / 0.06)`,
  pointerEvents: "none",
});

globalStyle(".rk-image-grid-check", {
  position: "absolute",
  top: `calc(${tokens.space} * 1.5)`,
  left: `calc(${tokens.space} * 1.5)`,
  display: "grid",
  placeItems: "center",
  width: "20px",
  height: "20px",
  borderRadius: `${tokens.radiusRound}`,
  color: "transparent",
  background: `oklch(${tokens.shade} / 0.45)`,
  boxShadow: `inset 0 0 0 1.5px oklch(${tokens.tint} / 0.7)`,
  opacity: "0",
  transition: `opacity ${tokens.dur} ${tokens.ease},
    background-color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-image-grid-check > svg", { width: "12px", height: "12px", strokeWidth: "3" });

globalStyle(
  '.rk-image-grid-item:is(:hover, :focus-visible) > .rk-image-grid-check, .rk-image-grid:has([aria-selected="true"]) .rk-image-grid-check',
  { opacity: "1" },
);

globalStyle(".rk-image-grid-check[data-checked]", {
  color: `${tokens.onAccent}`,
  background: `${tokens.accent}`,
  boxShadow: "none",
});

globalStyle(".rk-image-grid-empty", {
  padding: `calc(${tokens.space} * 8)`,
  textAlign: "center",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
});
