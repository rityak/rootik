import { globalStyle } from "@vanilla-extract/css";
import type { ButtonVariant } from "../src/components/button";
import { tokens } from "./tokens.css";

const variantSelector = (value: ButtonVariant) => `.rk-button[data-variant="${value}"]`;

globalStyle(".rk-button", {
  vars: {
    "--rk-btn-h": `${tokens.hMd}`,
    "--rk-btn-px": `calc(${tokens.space} * 3.5)`,
    "--rk-btn-bg": `${tokens.surface3}`,
    "--rk-btn-fg": `${tokens.text}`,
    "--rk-btn-edge": `${tokens.line}`,
  },
  display: "inline-flex",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5em",
  height: "var(--rk-btn-h)",
  padding: "0 var(--rk-btn-px)",
  margin: 0,
  border: 0,
  borderRadius: `${tokens.radiusControl}`,
  background: "var(--rk-btn-bg)",
  color: "var(--rk-btn-fg)",
  boxShadow: "inset 0 0 0 1px var(--rk-btn-edge)",
  font: "inherit",
  fontSize: `${tokens.textMd}`,
  fontWeight: 500,
  lineHeight: 1,
  whiteSpace: "nowrap",
  cursor: "pointer",
  userSelect: "none",
  WebkitTapHighlightColor: "transparent",
  transition: `background-color ${tokens.dur} ${tokens.ease}, color ${tokens.dur} ${tokens.ease}, box-shadow ${tokens.dur} ${tokens.ease}, scale ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-button .rk-icon", {
  fontSize: "1.15em",
});

globalStyle(".rk-button:hover:not(:disabled)", {
  vars: {
    "--rk-btn-bg": `${tokens.surface4}`,
  },
});

globalStyle(".rk-button:active:not(:disabled)", {
  scale: 0.96,
});

globalStyle(".rk-button:disabled", {
  cursor: "not-allowed",
  opacity: 0.38,
  filter: "saturate(0.25)",
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(".rk-button[aria-busy]", {
  cursor: "progress",
  opacity: 0.8,
});

globalStyle(".rk-button[data-block]", {
  width: "100%",
});

globalStyle('.rk-button[data-size="sm"]', {
  vars: {
    "--rk-btn-h": `${tokens.hSm}`,
    "--rk-btn-px": `calc(${tokens.space} * 2.5)`,
  },
  fontSize: `${tokens.textSm}`,
});

globalStyle('.rk-button[data-size="lg"]', {
  vars: {
    "--rk-btn-h": `${tokens.hLg}`,
    "--rk-btn-px": `calc(${tokens.space} * 4.5)`,
  },
  fontSize: `${tokens.textMd}`,
});

globalStyle(variantSelector("primary"), {
  vars: {
    "--rk-btn-bg": `${tokens.accent}`,
    "--rk-btn-fg": `${tokens.onAccent}`,
    "--rk-btn-edge": "transparent",
  },
  boxShadow: `inset 0 1px 0 oklch(${tokens.tint} / 0.25), 0 0 0 1px color-mix(in oklab, ${tokens.accent} 40%, transparent), 0 6px 20px -8px color-mix(in oklab, ${tokens.accent} 60%, transparent)`,
});

globalStyle(`${variantSelector("primary")}:hover:not(:disabled)`, {
  vars: {
    "--rk-btn-bg": `${tokens.accentHover}`,
    "--rk-btn-fg": `${tokens.onAccentHover}`,
  },
});

globalStyle(variantSelector("inverse"), {
  vars: {
    "--rk-btn-bg": `${tokens.inverse}`,
    "--rk-btn-fg": `${tokens.onInverse}`,
    "--rk-btn-edge": "transparent",
  },
});

globalStyle(`${variantSelector("inverse")}:hover:not(:disabled)`, {
  vars: {
    "--rk-btn-bg": `oklch(from ${tokens.inverse} calc(l - 0.07) c h)`,
  },
});

globalStyle(variantSelector("ghost"), {
  vars: {
    "--rk-btn-bg": "transparent",
    "--rk-btn-fg": `${tokens.text2}`,
    "--rk-btn-edge": "transparent",
  },
});

globalStyle(`${variantSelector("ghost")}:hover:not(:disabled)`, {
  vars: {
    "--rk-btn-bg": `${tokens.hover}`,
    "--rk-btn-fg": `${tokens.text}`,
  },
});

globalStyle(`${variantSelector("ghost")}:active:not(:disabled)`, {
  vars: {
    "--rk-btn-bg": `${tokens.press}`,
  },
});

globalStyle(variantSelector("outline"), {
  vars: {
    "--rk-btn-bg": "transparent",
    "--rk-btn-edge": `${tokens.lineStrong}`,
  },
});

globalStyle(`${variantSelector("outline")}:hover:not(:disabled)`, {
  vars: {
    "--rk-btn-bg": `${tokens.hover}`,
  },
});

globalStyle(`${variantSelector("danger")}, ${variantSelector("warn")}`, {
  vars: {
    "--rk-tone": `${tokens.danger}`,
    "--rk-btn-bg": "color-mix(in oklab, var(--rk-tone) 14%, transparent)",
    "--rk-btn-fg": "oklch(from var(--rk-tone) max(l, 0.78) c h)",
    "--rk-btn-edge": "color-mix(in oklab, var(--rk-tone) 28%, transparent)",
  },
});

globalStyle(
  `${variantSelector("danger")}:hover:not(:disabled), ${variantSelector("warn")}:hover:not(:disabled)`,
  {
    vars: {
      "--rk-btn-bg": "color-mix(in oklab, var(--rk-tone) 24%, transparent)",
    },
  },
);

globalStyle(variantSelector("warn"), {
  vars: {
    "--rk-tone": `${tokens.warn}`,
  },
});

globalStyle(".rk-button[data-armed]", {
  vars: {
    "--rk-btn-bg": `${tokens.danger}`,
    "--rk-btn-fg": `${tokens.onDanger}`,
  },
});

globalStyle(".rk-button[data-armed]:hover:not(:disabled)", {
  vars: {
    "--rk-btn-bg": `oklch(from ${tokens.danger} calc(l + 0.04) c h)`,
  },
});

globalStyle('.rk-button[aria-pressed="true"]', {
  vars: {
    "--rk-btn-bg": `${tokens.accentSoft}`,
    "--rk-btn-fg": `${tokens.accentText}`,
    "--rk-btn-edge": `${tokens.accentLine}`,
  },
});

globalStyle('.rk-button[aria-pressed="true"]:hover:not(:disabled)', {
  vars: {
    "--rk-btn-bg": `color-mix(in oklab, ${tokens.accent} 22%, transparent)`,
  },
});

globalStyle(".rk-button-label", {
  overflow: "hidden",
  textOverflow: "ellipsis",
});

globalStyle(".rk-icon-button", {
  width: "var(--rk-btn-h)",
  padding: 0,
});

globalStyle(".rk-icon-button .rk-icon", {
  fontSize: "1.2em",
});

globalStyle(".rk-icon-button[data-round]", {
  borderRadius: `${tokens.radiusPill}`,
});

globalStyle(".rk-button-group", {
  display: "inline-flex",
  gap: "1px",
});

globalStyle(".rk-button-group > .rk-button:not(:first-of-type)", {
  borderStartStartRadius: 0,
  borderEndStartRadius: 0,
});

globalStyle(".rk-button-group > .rk-button:not(:last-of-type)", {
  borderStartEndRadius: 0,
  borderEndEndRadius: 0,
});
