import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { avatar, tokens } from "./tokens.css";

globalStyle(".rk-badge", {
  display: "inline-flex",
  alignItems: "center",
  flexShrink: "0",
  gap: "5px",
  height: "22px",
  padding: "0 8px",
  borderRadius: `${tokens.radiusPill}`,
  background: "color-mix(in oklab, var(--rk-tone) 15%, transparent)",
  color: "var(--rk-tone-text)",
  fontSize: `${tokens.textXs}`,
  fontWeight: "500",
  fontVariantNumeric: "tabular-nums",
  lineHeight: "1",
  whiteSpace: "nowrap",
});

globalStyle('.rk-badge[data-tone="neutral"]', { background: `${tokens.surface3}`, color: `${tokens.text2}` });

globalStyle('.rk-badge[data-variant="solid"]', {
  background: "var(--rk-tone)",
  color: "oklch(from var(--rk-tone) clamp(0.16, (0.7 - l) * 100, 0.99) 0 0)",
});

globalStyle('.rk-badge[data-variant="outline"]', {
  background: "transparent",
  boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--rk-tone) 45%, transparent)",
});

globalStyle('.rk-badge[data-size="sm"]', {
  height: "18px",
  padding: "0 6px",
  gap: "4px",
  fontSize: `${tokens.text2xs}`,
});

globalStyle(".rk-badge .rk-icon", { fontSize: "1.1em" });

globalStyle(".rk-badge-media", {
  display: "inline-flex",
  flexShrink: "0",
  height: "1.35em",
  maxWidth: "2em",
  overflow: "hidden",
  borderRadius: `calc(0.3em * ${tokens.roundness})`,
});

globalStyle(".rk-badge-media > :is(img, svg, video)", { width: "auto", height: "100%", objectFit: "cover" });

globalStyle(".rk-badge-dot", {
  width: "6px",
  height: "6px",
  borderRadius: `${tokens.radiusRound}`,
  background: "currentColor",
});

globalStyle(".rk-badge-remove", {
  display: "grid",
  placeItems: "center",
  width: "14px",
  height: "14px",
  marginInline: "1px -4px",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusRound}`,
  background: "transparent",
  color: "inherit",
  opacity: "0.7",
  cursor: "pointer",
});

globalStyle(".rk-badge-remove:hover", { opacity: "1", background: `oklch(${tokens.tint} / 0.12)` });

globalStyle(".rk-status", {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  fontSize: `${tokens.textSm}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-status-dot", {
  position: "relative",
  flexShrink: "0",
  width: "8px",
  height: "8px",
  borderRadius: `${tokens.radiusRound}`,
  background: "var(--rk-tone)",
  boxShadow: "0 0 8px -1px var(--rk-tone)",
});

globalStyle(".rk-status-dot[data-pulse]::after", {
  content: '""',
  position: "absolute",
  inset: "0",
  borderRadius: `${tokens.radiusRound}`,
  background: "var(--rk-tone)",
  animation: `rk-halo calc(${tokens.durSlow} * 5.6) ${tokens.easeOut} infinite`,
  animationPlayState: `var(--rk-anim-state, ${tokens.animationState})`,
});

globalKeyframes("rk-halo", { from: { scale: "1", opacity: "0.6" }, to: { scale: "3", opacity: "0" } });
globalStyle(".rk-status-dot[data-pulse]::after", {
  "@media": { "(prefers-reduced-motion: reduce)": { animation: "none" } },
});

globalStyle(".rk-kbd", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "20px",
  height: "20px",
  padding: "0 5px",
  borderRadius: `calc(5px * ${tokens.roundness})`,
  background: `${tokens.surface3}`,
  boxShadow: `inset 0 -1px 0 oklch(${tokens.shade} / 0.4),
    inset 0 0 0 1px ${tokens.line}`,
  color: `${tokens.text2}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
  lineHeight: "1",
  whiteSpace: "nowrap",
});

globalStyle('.rk-kbd[data-size="sm"]', {
  minWidth: "17px",
  height: "17px",
  padding: "0 4px",
  borderRadius: `calc(4px * ${tokens.roundness})`,
});

globalStyle(".rk-avatar", {
  position: "relative",
  display: "inline-grid",
  placeItems: "center",
  flexShrink: "0",
  width: "32px",
  height: "32px",
  borderRadius: `${tokens.radiusRound}`,
  background: avatar.background,
  color: avatar.foreground,
  fontWeight: "600",
  fontSize: "12px",
  letterSpacing: "0.02em",
  userSelect: "none",
});

globalStyle(".rk-avatar img", { width: "100%", height: "100%", borderRadius: "inherit", objectFit: "cover" });

globalStyle(".rk-avatar[data-square]", { borderRadius: `calc(28% * ${tokens.roundness})` });

globalStyle(".rk-avatar-status", {
  position: "absolute",
  right: "0",
  bottom: "0",
  width: "28%",
  height: "28%",
  borderRadius: `${tokens.radiusRound}`,
  background: "var(--rk-tone)",
  boxShadow: `0 0 0 2px ${tokens.surface1}`,
});

globalStyle('.rk-avatar-status[data-tone="warn"]', {
  background: `linear-gradient(90deg, var(--rk-tone) 50%, ${tokens.surface1} 0)`,
  boxShadow: `0 0 0 2px ${tokens.surface1},
    inset 0 0 0 1.5px var(--rk-tone)`,
});

globalStyle('.rk-avatar-status[data-tone="neutral"]', {
  background: `${tokens.surface1}`,
  boxShadow: `0 0 0 2px ${tokens.surface1},
    inset 0 0 0 2px var(--rk-tone)`,
});

globalStyle('.rk-avatar-status[data-tone="danger"]::after', {
  content: '""',
  position: "absolute",
  inset: "42% 22%",
  borderRadius: `calc(1px * ${tokens.roundness})`,
  background: `${tokens.surface1}`,
});

globalStyle(".rk-avatar-group", { display: "inline-flex" });

globalStyle(".rk-avatar-group > .rk-avatar", { boxShadow: `0 0 0 2px ${tokens.surface1}` });

globalStyle(".rk-avatar-group > .rk-avatar:not(:first-child)", { marginInlineStart: "-8px" });

globalStyle(".rk-avatar-more", { background: `${tokens.surface3}`, color: `${tokens.text2}` });
