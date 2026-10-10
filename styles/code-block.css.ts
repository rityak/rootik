import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-code", {
  padding: "0.1em 0.4em",
  borderRadius: `calc(${tokens.radiusSm} * 0.6)`,
  background: `${tokens.surface3}`,
  color: `${tokens.text}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: "0.88em",
});

globalStyle(".rk-code-block", {
  display: "flex",
  flexDirection: "column",
  minWidth: "0",
  overflow: "hidden",
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.sunken}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(".rk-code-head", {
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 1.5)`,
  minHeight: "36px",
  padding: `0 calc(${tokens.space} * 1.5) 0 calc(${tokens.space} * 3.5)`,
  borderBottom: `1px solid ${tokens.line}`,
  fontSize: `${tokens.textXs}`,
});

globalStyle(".rk-code-title", {
  flex: "1",
  minWidth: "0",
  overflow: "hidden",
  color: `${tokens.text2}`,
  fontFamily: `${tokens.fontMono}`,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-code-lang", {
  padding: "1px 6px",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.surface3}`,
  color: `${tokens.text3}`,
  fontSize: `${tokens.text2xs}`,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
});

globalStyle(".rk-code-pre", {
  margin: "0",
  padding: `calc(${tokens.space} * 3) 0`,
  overflow: "auto",
  color: `${tokens.text}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: `calc(${tokens.fontSize} * 0.9)`,
  lineHeight: "1.65",
  tabSize: "2",
  counterReset: "rk-line",
});

globalStyle(".rk-code-pre:focus-visible", { outlineOffset: "-2px" });

globalStyle(".rk-code-pre code", { display: "block", minWidth: "max-content", font: "inherit" });

globalStyle(".rk-code-pre[data-wrap] code", { minWidth: "0" });

globalStyle(".rk-code-line", {
  display: "block",
  padding: `0 calc(${tokens.space} * 3.5)`,
  whiteSpace: "pre",
  counterIncrement: "rk-line",
});

globalStyle("[data-wrap] .rk-code-line", { whiteSpace: "pre-wrap", overflowWrap: "anywhere" });

globalStyle("[data-numbers] .rk-code-line::before", {
  content: "counter(rk-line)",
  display: "inline-block",
  width: "3ch",
  marginRight: "2ch",
  color: `${tokens.text3}`,
  textAlign: "right",
  userSelect: "none",
});

globalStyle("[data-numbers][data-wrap] .rk-code-line", {
  paddingLeft: `calc(${tokens.space} * 3.5 + 5ch)`,
  textIndent: "-5ch",
});

globalStyle(".rk-code-line[data-highlight]", {
  background: `${tokens.accentSoft}`,
  boxShadow: `inset 2px 0 0 ${tokens.accent}`,
});

globalStyle(".rk-code-editor", {
  display: "flex",
  flexDirection: "column",
  minWidth: "0",
  overflow: "hidden",
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.sunken}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
});

globalStyle(".rk-code-editor textarea", {
  width: "100%",
  maxHeight: "var(--rk-code-editor-max, none)",
  minHeight: "8em",
  resize: "vertical",
  padding: `calc(${tokens.space} * 3)`,
  border: "0",
  outline: "0",
  background: "transparent",
  color: `${tokens.text}`,
  caretColor: `${tokens.accentText}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: `calc(${tokens.fontSize} * 0.9)`,
  lineHeight: "1.65",
  tabSize: "2",
});

globalStyle(".rk-code-editor:has(textarea:focus-visible)", {
  outline: `2px solid ${tokens.focus}`,
  outlineOffset: "2px",
});

globalStyle(".rk-code-editor-theme", {
  vars: {
    "--rk-editor-selection": `color-mix(in oklab, ${tokens.accent} 28%, transparent)`,
    "--rk-editor-active-line": `${tokens.hover}`,
  },
});

globalStyle(".rk-code-editor-theme .cm-editor", {
  background: `${tokens.sunken}`,
  color: `${tokens.text}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: `calc(${tokens.fontSize} * 0.9)`,
});

globalStyle(".rk-code-editor-theme .cm-gutters", {
  border: "0",
  background: `${tokens.wellSoft}`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-code-editor-theme .cm-activeLine, .rk-code-editor-theme .cm-activeLineGutter", {
  background: "var(--rk-editor-active-line)",
});

globalStyle(".rk-code-editor-theme .cm-selectionBackground", { background: "var(--rk-editor-selection)" });

globalStyle(".rk-code-editor-theme .cm-cursor", { borderLeftColor: `${tokens.accentText}` });
