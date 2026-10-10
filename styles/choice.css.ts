import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-check", {
  display: "inline-flex",
  alignItems: "flex-start",
  gap: `calc(${tokens.space} * 2.5)`,
  cursor: "pointer",
  fontSize: `${tokens.textMd}`,
  lineHeight: "1.35",
  WebkitTapHighlightColor: "transparent",
});

globalStyle(".rk-check > input", { marginTop: "calc((1.35em - 16px) / 2)" });

globalStyle(".rk-check > .rk-switch", { marginTop: "calc((1.35em - 18px) / 2)" });

globalStyle('.rk-check[data-position="start"]', {
  flexDirection: "row-reverse",
  justifyContent: "space-between",
  width: "100%",
});

globalStyle(".rk-check[data-disabled]", { opacity: "0.45", cursor: "not-allowed" });

globalStyle(".rk-check-text", { display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" });

globalStyle(".rk-check-desc", { fontSize: `${tokens.textXs}`, color: `${tokens.text3}`, textWrap: "pretty" });

globalStyle(".rk-checkbox,\n.rk-radio", {
  appearance: "none",
  position: "relative",
  flexShrink: "0",
  display: "inline-grid",
  placeItems: "center",
  width: "16px",
  height: "16px",
  margin: "0",
  borderRadius: `calc(5px * ${tokens.roundness})`,
  background: `${tokens.well}`,
  boxShadow: `inset 0 0 0 1.5px ${tokens.controlEdge}`,
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(":is(.rk-checkbox,\n.rk-radio)::after", {
  content: '""',
  width: "11px",
  height: "11px",
  background: `${tokens.onAccent}`,
  mask: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\")\n      center / contain no-repeat",
  scale: "0.4",
  opacity: "0",
  transition: `scale ${tokens.dur} ${tokens.spring},
      opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(":is(.rk-checkbox,\n.rk-radio):hover:not(:disabled)", {
  boxShadow: `inset 0 0 0 1.5px ${tokens.text3}`,
});

globalStyle(":is(.rk-checkbox,\n.rk-radio):checked, :is(.rk-checkbox,\n.rk-radio):indeterminate", {
  background: `${tokens.accent}`,
  boxShadow: "none",
});

globalStyle(
  ":is(:is(.rk-checkbox,\n.rk-radio):checked, :is(.rk-checkbox,\n.rk-radio):indeterminate)::after",
  { scale: "1", opacity: "1" },
);

globalStyle(":is(.rk-checkbox,\n.rk-radio):indeterminate::after", {
  mask: "none",
  height: "2px",
  width: "8px",
  borderRadius: `calc(1px * ${tokens.roundness})`,
});

globalStyle(":is(.rk-checkbox,\n.rk-radio):disabled", { cursor: "not-allowed" });

globalStyle(".rk-radio", { borderRadius: `${tokens.radiusRound}` });

globalStyle(".rk-radio::after", {
  mask: "none",
  width: "6px",
  height: "6px",
  borderRadius: `${tokens.radiusRound}`,
});

globalStyle(".rk-radio-group", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 2.5)`,
});

globalStyle('.rk-radio-group[data-orientation="horizontal"]', {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: `calc(${tokens.space} * 5)`,
});

globalStyle(".rk-switch", {
  appearance: "none",
  position: "relative",
  flexShrink: "0",
  width: "var(--rk-sw-w)",
  height: "var(--rk-sw-h)",
  margin: "0",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.surface4}`,
  boxShadow: `inset 0 0 0 1px ${tokens.controlEdge},
    inset 0 1px 2px oklch(${tokens.shade} / 0.35)`,
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease}`,
  vars: { "--rk-sw-w": "32px", "--rk-sw-h": "18px" },
});

globalStyle(".rk-switch::before", {
  content: '""',
  position: "absolute",
  top: "2px",
  left: "2px",
  width: "calc(var(--rk-sw-h) - 4px)",
  height: "calc(var(--rk-sw-h) - 4px)",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.text2}`,
  boxShadow: `0 1px 3px oklch(${tokens.shade} / 0.4)`,
  transition: `translate ${tokens.durSlow} ${tokens.spring},
      background-color ${tokens.dur} ${tokens.ease},
      width ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-switch:active:not(:disabled)::before", { width: "calc(var(--rk-sw-h) + 1px)" });

globalStyle(".rk-switch:checked", {
  background: `${tokens.accent}`,
  boxShadow: `inset 0 1px 2px oklch(${tokens.shade} / 0.35)`,
});

globalStyle(".rk-switch:checked::before", {
  translate: "calc(var(--rk-sw-w) - var(--rk-sw-h)) 0",
  background: `${tokens.onAccent}`,
});

globalStyle(".rk-switch:checked:active:not(:disabled)::before", {
  translate: "calc(var(--rk-sw-w) - var(--rk-sw-h) - 5px) 0",
});

globalStyle('.rk-switch[data-size="sm"]', { vars: { "--rk-sw-w": "26px", "--rk-sw-h": "14px" } });

globalStyle(".rk-switch:disabled", { cursor: "not-allowed" });

globalStyle(".rk-switch:disabled:not(.rk-check > *)", { opacity: "0.45" });

globalStyle(".rk-indicator", {
  position: "absolute",
  pointerEvents: "none",
  transition: `left ${tokens.durSlow} ${tokens.easeOut},
    right ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle('.rk-indicator[data-dir="1"]', {
  transitionDuration: `calc(${tokens.durSlow} * 1.15), calc(${tokens.durSlow} * 0.6)`,
});

globalStyle('.rk-indicator[data-dir="-1"]', {
  transitionDuration: `calc(${tokens.durSlow} * 0.6), calc(${tokens.durSlow} * 1.15)`,
});

globalStyle(".rk-segmented", {
  position: "relative",
  display: "inline-flex",
  alignItems: "stretch",
  flexShrink: "0",
  height: "var(--rk-seg-h)",
  padding: "3px",
  borderRadius: `calc(${tokens.radiusControl} + 3px * ${tokens.roundness})`,
  background: `var(--rk-track-bg, ${tokens.well})`,
  boxShadow: `var(--rk-track-shadow, inset 0 0 0 1px ${tokens.line})`,
  vars: { "--rk-seg-h": `${tokens.hMd}` },
});

globalStyle('.rk-segmented[data-size="sm"]', {
  fontSize: `${tokens.textSm}`,
  vars: { "--rk-seg-h": `${tokens.hSm}` },
});

globalStyle('.rk-segmented[data-size="lg"]', { vars: { "--rk-seg-h": `${tokens.hLg}` } });

globalStyle(".rk-segmented[data-fill]", { display: "flex", width: "100%" });

globalStyle(".rk-segmented[data-fill] .rk-segmented-item", { flex: "1" });

globalStyle(".rk-segmented[data-disabled]", { opacity: "0.5" });

globalStyle(".rk-segmented-thumb", {
  top: "3px",
  bottom: "3px",
  borderRadius: `${tokens.radiusControl}`,
  background: `var(--rk-selected-bg, ${tokens.inverse})`,
  boxShadow: `var(--rk-selected-shadow, 0 2px 8px -2px oklch(${tokens.shade} / 0.5))`,
});

globalStyle(".rk-segmented-item", {
  position: "relative",
  zIndex: "1",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: `0 calc(${tokens.space} * 3)`,
  borderRadius: `${tokens.radiusControl}`,
  color: `${tokens.text2}`,
  fontWeight: "500",
  whiteSpace: "nowrap",
  cursor: "pointer",
  userSelect: "none",
  transition: `color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-segmented-item:hover:not([data-checked]):not([data-disabled])", { color: `${tokens.text}` });

globalStyle(".rk-segmented-item[data-checked]", {
  background: "var(--rk-selected-bg, transparent)",
  color: `var(--rk-selected-fg, ${tokens.onInverse})`,
});

globalStyle(".rk-segmented-item[data-disabled]", { cursor: "not-allowed", opacity: "0.5" });

globalStyle(".rk-segmented-item:has(:focus-visible)", {
  outline: `2px solid ${tokens.focus}`,
  outlineOffset: "1px",
});

globalStyle(".rk-segmented-item .rk-icon", { fontSize: "1.1em" });

globalStyle(".rk-choice-cards", { display: "grid", gap: `calc(${tokens.space} * 2.5)` });

globalStyle(".rk-choice-card", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: `calc(${tokens.space} * 3) calc(${tokens.space} * 3.5)`,
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.wellSoft}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-choice-card:hover:not([data-disabled])", { background: `${tokens.hover}` });

globalStyle(".rk-choice-card:has(:checked)", {
  background: `${tokens.accentSoft}`,
  boxShadow: `inset 0 0 0 1px ${tokens.accentLine}`,
});

globalStyle(".rk-choice-card:has(:focus-visible)", {
  outline: `2px solid ${tokens.focus}`,
  outlineOffset: "2px",
});

globalStyle(".rk-choice-card[data-disabled]", { opacity: "0.45", cursor: "not-allowed" });

globalStyle(".rk-choice-card-head", { display: "flex", alignItems: "center", gap: "8px" });

globalStyle(".rk-choice-card-icon", { fontSize: "1.15em", color: `${tokens.text2}` });

globalStyle(":checked ~ .rk-choice-card-head > .rk-choice-card-icon", { color: `${tokens.accentText}` });

globalStyle(".rk-choice-card-label", { flex: "1", fontWeight: "600" });

globalStyle(".rk-choice-card-dot", {
  display: "grid",
  placeItems: "center",
  flexShrink: "0",
  width: "14px",
  height: "14px",
  borderRadius: `${tokens.radiusRound}`,
  boxShadow: `inset 0 0 0 1.5px ${tokens.controlEdge}`,
  transition: `box-shadow ${tokens.dur} ${tokens.spring},
    background-color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(":checked ~ .rk-choice-card-head > .rk-choice-card-dot", {
  boxShadow: `inset 0 0 0 4px ${tokens.accent}`,
});

globalStyle('.rk-choice-card-dot[data-type="checkbox"]', {
  borderRadius: `calc(4px * ${tokens.roundness})`,
  color: `${tokens.onAccent}`,
  fontSize: "10px",
});

globalStyle('.rk-choice-card-dot[data-type="checkbox"] svg', {
  opacity: "0",
  scale: "0.4",
  transition: `opacity ${tokens.dur} ${tokens.ease},
        scale ${tokens.dur} ${tokens.spring}`,
});

globalStyle(':checked ~ .rk-choice-card-head > .rk-choice-card-dot[data-type="checkbox"]', {
  background: `${tokens.accent}`,
  boxShadow: "none",
});

globalStyle(':checked ~ .rk-choice-card-head > .rk-choice-card-dot[data-type="checkbox"] svg', {
  opacity: "1",
  scale: "1",
});

globalStyle(".rk-choice-card-desc", {
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
  textWrap: "pretty",
});

globalStyle(".rk-choice-card-note", { fontSize: `${tokens.textXs}`, color: `${tokens.warn}` });

globalStyle(".rk-chip-group", { display: "flex", flexWrap: "wrap", gap: "6px" });

globalStyle(".rk-chip", {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  height: `${tokens.hSm}`,
  padding: `0 calc(${tokens.space} * 3)`,
  margin: "0",
  border: "0",
  borderRadius: `${tokens.radiusPill}`,
  background: "transparent",
  boxShadow: `inset 0 0 0 1px ${tokens.lineStrong}`,
  color: `${tokens.text2}`,
  font: "inherit",
  fontSize: `${tokens.textSm}`,
  fontWeight: "500",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.dur} ${tokens.ease},
    box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle('.rk-chip:hover:not([aria-pressed="true"], :disabled)', {
  background: `${tokens.hover}`,
  color: `${tokens.text}`,
});

globalStyle('.rk-chip[aria-pressed="true"]', {
  background: `${tokens.inverse}`,
  color: `${tokens.onInverse}`,
  boxShadow: "none",
});

globalStyle('.rk-chip[data-size="sm"]', {
  height: `calc(${tokens.hSm} - 6px)`,
  padding: `0 calc(${tokens.space} * 2.5)`,
  fontSize: `${tokens.textXs}`,
});

globalStyle(".rk-chip:disabled", { opacity: "0.45", cursor: "not-allowed" });

globalStyle(".rk-chip-count", { fontSize: "max(11px, 0.9em)", color: `${tokens.text3}` });

globalStyle('[aria-pressed="true"] > .rk-chip-count', { color: "inherit", opacity: "0.7" });

globalStyle(".rk-swatches", { display: "flex", flexWrap: "wrap", gap: "8px" });

globalStyle(".rk-swatch", {
  position: "relative",
  width: "24px",
  height: "24px",
  borderRadius: `${tokens.radiusRound}`,
  background: "var(--rk-swatch)",
  boxShadow: `inset 0 0 0 1px oklch(${tokens.tint} / 0.15)`,
  cursor: "pointer",
  transition: `scale ${tokens.dur} ${tokens.spring}`,
});

globalStyle(".rk-swatch:hover", { scale: "1.1" });

globalStyle(".rk-swatch:has(:checked), .rk-swatch[data-checked]", {
  boxShadow: `0 0 0 2px ${tokens.surface1},
      0 0 0 4px var(--rk-swatch)`,
});

globalStyle(".rk-swatch:has(:focus-visible)", { outline: `2px solid ${tokens.focus}`, outlineOffset: "4px" });

globalStyle(".rk-swatch[data-custom]", { background: `var(--rk-swatch, ${tokens.spectrum})` });

globalStyle(".rk-swatch[data-custom]:not([data-checked])::after", {
  content: '"+"',
  position: "absolute",
  inset: "0",
  display: "grid",
  placeItems: "center",
  color: `${tokens.onInverse}`,
  fontWeight: "700",
});
