import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

const field =
  ".rk-select-trigger[data-svg-border], .rk-native-select-wrap[data-svg-border], .rk-textarea-wrap[data-svg-border]";
const choice = ".rk-choice-card[data-svg-border], .rk-chip[data-svg-border]";
const hosts = `${field}, ${choice}`;

globalStyle(hosts, {
  position: "relative",
  isolation: "isolate",
  background: "transparent",
  boxShadow: "none",
  vars: {
    "--rk-svg-control-fill": `${tokens.well}`,
    "--rk-svg-control-edge": `${tokens.controlEdge}`,
  },
});

for (const host of hosts.split(", ")) {
  globalStyle(`${host} > .rk-svg-control-frame`, { zIndex: -1 });
}

globalStyle(
  ".rk-native-select-wrap[data-svg-border] > select, .rk-textarea-wrap[data-svg-border] > textarea",
  {
    background: "transparent",
    boxShadow: "none",
    outline: "none",
  },
);
globalStyle(".rk-textarea-wrap", { display: "grid", minWidth: 0 });
globalStyle(".rk-textarea-wrap > textarea", { minWidth: 0, maxWidth: "100%" });
globalStyle(".rk-native-select-wrap[data-svg-border] > select", { position: "relative" });
globalStyle(
  ".rk-native-select-wrap[data-svg-border][data-disabled] > .rk-svg-control-frame, .rk-textarea-wrap[data-svg-border][data-disabled] > .rk-svg-control-frame",
  { opacity: 0.5 },
);

globalStyle(
  '.rk-choice-card[data-svg-border]:hover:not([data-disabled]):not(:has(:checked)), .rk-chip[data-svg-border]:hover:not(:disabled, [aria-pressed="true"])',
  {
    vars: { "--rk-svg-control-fill": `${tokens.hover}` },
  },
);
globalStyle(".rk-choice-card[data-svg-border]:has(:checked)", {
  vars: { "--rk-svg-control-fill": `${tokens.accentSoft}`, "--rk-svg-control-edge": `${tokens.accent}` },
});
globalStyle('.rk-chip[data-svg-border][aria-pressed="true"]', {
  vars: { "--rk-svg-control-fill": `${tokens.inverse}`, "--rk-svg-control-edge": `${tokens.inverse}` },
});
globalStyle(".rk-chip[data-svg-border]", { lineHeight: 1 });
globalStyle(
  ".rk-select-trigger[data-svg-border]:hover:not(:disabled), .rk-native-select-wrap[data-svg-border]:hover:not([data-disabled]), .rk-textarea-wrap[data-svg-border]:hover:not([data-disabled])",
  {
    vars: { "--rk-svg-control-edge": `${tokens.text3}` },
  },
);
globalStyle('.rk-select-trigger[data-svg-border][aria-expanded="true"]', {
  vars: { "--rk-svg-control-edge": `${tokens.accent}` },
});

const focus =
  ".rk-select-trigger[data-svg-border]:focus-visible, .rk-native-select-wrap[data-svg-border]:has(:focus-visible), .rk-textarea-wrap[data-svg-border]:has(:focus-visible), .rk-choice-card[data-svg-border]:has(:focus-visible), .rk-chip[data-svg-border]:focus-visible";
globalStyle(focus, {
  outline: "none",
  vars: { "--rk-svg-control-edge": `${tokens.focus}`, "--rk-svg-control-stroke": "3" },
  "@media": { "(forced-colors: active)": { outline: `2px solid ${tokens.focus}`, outlineOffset: "-2px" } },
});
globalStyle('.rk-chip[data-svg-border][aria-pressed="true"]:focus-visible', {
  vars: { "--rk-svg-control-edge": `${tokens.onInverse}` },
});
globalStyle(
  '.rk-select-trigger[data-svg-border][aria-invalid="true"], .rk-native-select-wrap[data-svg-border][data-invalid], .rk-textarea-wrap[data-svg-border][data-invalid]',
  {
    vars: { "--rk-svg-control-edge": `${tokens.danger}` },
  },
);
// Keep the SVG fill and label synchronous during selection and hover.
globalStyle(`${hosts}, .rk-button[data-svg-border]`, { transition: "none" });
globalStyle(".rk-button[data-svg-border] > .rk-svg-control-frame", {
  filter: `drop-shadow(0 calc(${tokens.space} / 2) ${tokens.space} oklch(${tokens.shade} / 0.1))`,
});

globalStyle(".rk-button[data-svg-border]:disabled", { boxShadow: "none" });

globalStyle(
  ':is(.rk-choice-card, .rk-chip, .rk-select-trigger)[data-svg-border]:is(:hover, :focus-within, :has(:checked), [aria-pressed="true"], [aria-expanded="true"])',
  {
    background: "transparent",
    boxShadow: "none",
  },
);
