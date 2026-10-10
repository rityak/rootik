import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(':where(:root, [data-rk-scope])[data-rk-palette="rain"]', {
  vars: {
    [tokens.bg]: `oklch(0.17 ${tokens.neutralC} ${tokens.neutralH})`,
    [tokens.surface1]: `oklch(0.205 calc(${tokens.neutralC} * 1.25) ${tokens.neutralH})`,
    [tokens.surface2]: `oklch(0.245 calc(${tokens.neutralC} * 1.5) ${tokens.neutralH})`,
    [tokens.surface3]: `oklch(0.285 calc(${tokens.neutralC} * 1.75) ${tokens.neutralH})`,
    [tokens.surface4]: `oklch(0.325 calc(${tokens.neutralC} * 1.83) ${tokens.neutralH})`,
    [tokens.sunken]: `oklch(0.18 ${tokens.neutralC} ${tokens.neutralH})`,
    [tokens.well]: `oklch(0.18 ${tokens.neutralC} ${tokens.neutralH})`,
    [tokens.wellSoft]: `oklch(0.19 calc(${tokens.neutralC} * 1.08) ${tokens.neutralH})`,
    [tokens.text]: `oklch(0.94 calc(${tokens.neutralC} * 0.75) ${tokens.neutralH})`,
    [tokens.text2]: `oklch(0.78 calc(${tokens.neutralC} * 1.58) ${tokens.neutralH})`,
    [tokens.text3]: `oklch(0.7 calc(${tokens.neutralC} * 1.83) ${tokens.neutralH})`,
    [tokens.inverse]: `oklch(0.86 calc(${tokens.neutralC} * 1.5) ${tokens.neutralH})`,
    [tokens.onInverse]: `oklch(0.205 calc(${tokens.neutralC} * 1.25) ${tokens.neutralH})`,
    [tokens.controlEdge]: `oklch(0.62 calc(${tokens.neutralC} * 1.67) ${tokens.neutralH})`,
    [tokens.accentHover]: `oklch(from ${tokens.accent} calc(l - 0.01) c h)`,
    [tokens.focus]: `oklch(from ${tokens.accent} max(l, 0.8) min(c, 0.07) h)`,
  },
});
