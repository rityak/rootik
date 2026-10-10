import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(':where(:root, [data-rk-scope], [data-rk-style="rootik"])', {
  vars: {
    "--rk-selected-bg": "initial",
    "--rk-selected-fg": "initial",
    "--rk-selected-shadow": "initial",
    "--rk-track-bg": "initial",
    "--rk-track-shadow": "initial",
    "--rk-tab-line": "initial",
    "--rk-nav-active-bg": "initial",
    "--rk-nav-active-fg": "initial",
    "--rk-nav-active-icon": "initial",
    "--rk-nav-marker": "initial",
    "--rk-dock-radius": "initial",
    "--rk-dock-active-bg": "initial",
    "--rk-dock-active-fg": "initial",
    "--rk-dock-indicator-top": "initial",
    "--rk-dock-indicator-height": "initial",
    "--rk-dock-indicator-radius": "initial",
    "--rk-dock-indicator-bg": "initial",
    "--rk-dock-indicator-shadow": "initial",
  },
});

globalStyle(':where([data-rk-style="fluent"])', {
  vars: {
    [tokens.highlight]: "inset 0 0 0 0 transparent",
    [tokens.shadow1]: `0 0 0 1px ${tokens.line}`,
    [tokens.shadow2]: `0 0 0 1px ${tokens.lineStrong}, 0 8px 24px -12px oklch(${tokens.shade} / 0.6)`,
    [tokens.shadowPop]: `0 0 0 1px ${tokens.lineStrong}, 0 16px 40px -12px oklch(${tokens.shade} / 0.7)`,
    "--rk-selected-bg": `${tokens.accent}`,
    "--rk-selected-fg": `${tokens.onAccent}`,
    "--rk-selected-shadow": "none",
    "--rk-track-bg": "transparent",
    "--rk-track-shadow": `inset 0 0 0 1px ${tokens.controlEdge}`,
    "--rk-tab-line": `${tokens.accent}`,
    "--rk-nav-active-bg": `${tokens.press}`,
    "--rk-nav-active-fg": `${tokens.text}`,
    "--rk-nav-active-icon": `${tokens.accentText}`,
    "--rk-nav-marker": '""',
    "--rk-dock-radius": `${tokens.radiusLg}`,
    "--rk-dock-active-bg": `${tokens.hover}`,
    "--rk-dock-active-fg": `${tokens.text}`,
    "--rk-dock-indicator-top": "auto",
    "--rk-dock-indicator-height": "3px",
    "--rk-dock-indicator-radius": `calc(2px * ${tokens.roundness})`,
    "--rk-dock-indicator-bg": `${tokens.accent}`,
    "--rk-dock-indicator-shadow": "none",
  },
});
