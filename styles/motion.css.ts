import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalKeyframes("rk-light-sheen", {
  "0%": { transform: "translateX(-110%)", opacity: 0 },
  "25%": { opacity: "var(--rk-effects-strength, 0)" },
  "75%": { opacity: "var(--rk-effects-strength, 0)" },
  "100%": { transform: "translateX(110%)", opacity: 0 },
});
globalKeyframes("rk-light-ripple", {
  from: { transform: "scale(.2)", opacity: "var(--rk-effects-strength, 0)" },
  to: { transform: "scale(1.7)", opacity: 0 },
});
globalKeyframes("rk-light-press", {
  from: { transform: "scale(.5)", opacity: "var(--rk-effects-strength, 0)" },
  to: { transform: "scale(1.5)", opacity: 0 },
});
globalKeyframes("rk-light-flow", {
  "0%, 100%": { transform: "translateX(-25%)", opacity: 0 },
  "30%, 65%": { opacity: "var(--rk-effects-strength, 0)" },
  "50%": { transform: "translateX(25%)" },
});
globalStyle(".rk-motion-layer", {
  position: "absolute",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
  overflow: "hidden",
  borderRadius: "inherit",
  contain: "paint",
});
globalStyle(".rk-motion-light", {
  display: "block",
  position: "absolute",
  inset: 0,
  opacity: 0,
  animationDuration: `calc(${tokens.durSlow} * 3)`,
  animationTimingFunction: `${tokens.easeOut}`,
  animationFillMode: "both",
  animationPlayState: `${tokens.animationState}`,
});
globalStyle(".rk-motion-light > svg", { display: "block", width: "100%", height: "100%" });
globalStyle('.rk-motion-layer[data-effect="ripple"]', {
  vars: { "--rk-effect-animation": "rk-light-ripple" },
});
globalStyle('.rk-motion-layer[data-effect="sheen"]', { vars: { "--rk-effect-animation": "rk-light-sheen" } });
globalStyle('.rk-motion-layer[data-effect="flow"]', { vars: { "--rk-effect-animation": "rk-light-flow" } });

const trigger =
  ':where(button, a, label, .rk-input, .rk-native-select-wrap, .rk-textarea-wrap, .rk-svg-surface):is(:hover, :focus-visible, :has(:focus-visible), [aria-pressed="true"], [aria-selected="true"], [aria-current="page"], [data-checked]):not(:disabled, [data-disabled], [aria-disabled="true"]) > .rk-motion-layer > .rk-motion-light';
globalStyle(
  `${trigger}, .rk-motion-layer[data-active] > .rk-motion-light, .rk-nav-item[data-active] > .rk-nav-link > .rk-motion-layer > .rk-motion-light`,
  {
    animationName: "var(--rk-effect-animation)",
  },
);
globalStyle(".rk-motion-layer[data-loop] > .rk-motion-light", {
  animationDuration: `calc(${tokens.durSlow} * 20)`,
  animationTimingFunction: "ease-in-out",
  animationIterationCount: "infinite",
});
globalStyle(
  ":is(.rk-button, .rk-dock-item, .rk-tab, .rk-nav-link, .rk-segmented-item, .rk-input, .rk-select-trigger, .rk-choice-card, .rk-chip):has(> .rk-motion-layer)",
  { position: "relative", isolation: "isolate" },
);
globalStyle(
  ':is(button, a, label):active:not(:disabled, [data-disabled], [aria-disabled="true"]) > .rk-motion-layer > .rk-motion-light',
  { animationName: "rk-light-press", animationDuration: `${tokens.durSlow}` },
);
globalStyle(".rk-button > .rk-motion-layer, .rk-input[data-svg-border] > .rk-motion-layer", { zIndex: 0 });
globalStyle(".rk-button:has(> .rk-motion-layer) > :not(.rk-motion-layer, .rk-svg-control-frame)", {
  position: "relative",
  zIndex: 1,
});
globalStyle(".rk-svg-surface > .rk-motion-layer, .rk-svg-backdrop > .rk-motion-layer", { zIndex: 0 });

globalKeyframes("rk-switch-light", {
  from: { boxShadow: `inset 0 0 0 calc(${tokens.space} * 4) oklch(${tokens.tint} / .4)` },
  to: { boxShadow: `inset 0 0 0 0 oklch(${tokens.tint} / 0)` },
});
globalStyle(".rk-switch:checked", {
  animation: `var(--rk-switch-animation, none) calc(${tokens.durSlow} * 2) ${tokens.easeOut} both`,
  animationPlayState: `${tokens.animationState}`,
});
globalStyle(
  ":root[data-rk-theme-transition]::view-transition, :root[data-rk-theme-transition]::view-transition-group(*), :root[data-rk-theme-transition]::view-transition-image-pair(*), :root[data-rk-theme-transition]::view-transition-old(*), :root[data-rk-theme-transition]::view-transition-new(*)",
  { pointerEvents: "none" },
);
globalStyle(
  ":root[data-rk-theme-transition]::view-transition-old(*), :root[data-rk-theme-transition]::view-transition-new(*)",
  {
    animationDuration: `calc(${tokens.durSlow} * 1.5)`,
    animationTimingFunction: `${tokens.easeOut}`,
  },
);
globalKeyframes("rk-theme-wipe", {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0 0 0)" },
});
globalKeyframes("rk-theme-iris", {
  from: { clipPath: "circle(0% at 50% 35%)" },
  to: { clipPath: "circle(150% at 50% 35%)" },
});
for (const kind of ["wipe", "iris"]) {
  globalStyle(`:root[data-rk-theme-transition="${kind}"]::view-transition-new(*)`, {
    animationName: `rk-theme-${kind}`,
    mixBlendMode: "normal",
  });
  globalStyle(`:root[data-rk-theme-transition="${kind}"]::view-transition-old(*)`, {
    animationName: "none",
    mixBlendMode: "normal",
  });
}
globalStyle(".rk-motion-layer, .rk-switch:checked", {
  "@media": { "(prefers-reduced-motion: reduce), (forced-colors: active)": { animation: "none" } },
});
globalStyle(".rk-motion-layer", {
  "@media": { "(prefers-reduced-motion: reduce), (forced-colors: active)": { display: "none" } },
});
globalStyle(".rk-motion-light", {
  "@media": { "(prefers-reduced-motion: reduce), (forced-colors: active)": { animation: "none" } },
});
globalStyle(".rk-power[data-pending] > .rk-power-orbit", {
  "@media": { "(prefers-reduced-motion: reduce), (forced-colors: active)": { animation: "none" } },
});
