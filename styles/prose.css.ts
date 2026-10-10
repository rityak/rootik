import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-prose", {
  minWidth: "0",
  color: `${tokens.text2}`,
  fontSize: `${tokens.textMd}`,
  lineHeight: "1.65",
  overflowWrap: "break-word",
  vars: { "--rk-prose-gap": "0.9em" },
});

globalStyle('.rk-prose[data-size="sm"]', { fontSize: `${tokens.textSm}` });

globalStyle(".rk-prose > :first-child", { marginTop: "0" });

globalStyle(".rk-prose > :last-child", { marginBottom: "0" });

globalStyle(".rk-prose :is(p, ul, ol, pre, blockquote, table, figure, hr)", {
  margin: "0 0 var(--rk-prose-gap)",
});

globalStyle(".rk-prose :is(h1, h2, h3, h4)", {
  margin: "1.6em 0 0.6em",
  color: `${tokens.text}`,
  fontWeight: "600",
  lineHeight: "1.25",
  letterSpacing: "-0.01em",
  textWrap: "balance",
});

globalStyle(".rk-prose h1", { fontSize: `${tokens.text2xl}`, fontWeight: "500", letterSpacing: "-0.02em" });

globalStyle(".rk-prose h2", { fontSize: `${tokens.textXl}` });

globalStyle(".rk-prose h3", { fontSize: `${tokens.textLg}` });

globalStyle(".rk-prose h4", { fontSize: `${tokens.textMd}` });

globalStyle(".rk-prose :is(h1, h2, h3, h4) + :is(h1, h2, h3, h4)", { marginTop: "0.4em" });

globalStyle(".rk-prose strong", { color: `${tokens.text}`, fontWeight: "600" });

globalStyle(".rk-prose a", {
  color: `${tokens.accentText}`,
  textDecoration: "underline",
  textDecorationColor: `color-mix(in oklab, ${tokens.accentText} 40%, transparent)`,
  textUnderlineOffset: "0.2em",
});

globalStyle(".rk-prose a:hover", { textDecorationColor: "currentColor" });

globalStyle(".rk-prose :is(ul, ol)", { paddingInlineStart: "1.4em" });

globalStyle(".rk-prose li", { marginBlock: "0.25em" });

globalStyle(".rk-prose li::marker", { color: `${tokens.text3}` });

globalStyle(".rk-prose li > :is(ul, ol)", { marginBlock: "0.25em 0" });

globalStyle(".rk-prose :not(pre) > code", {
  padding: "0.1em 0.35em",
  borderRadius: `calc(5px * ${tokens.roundness})`,
  background: `${tokens.well}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  color: `${tokens.text}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: "0.88em",
});

globalStyle(".rk-prose pre", {
  padding: `calc(${tokens.space} * 3) calc(${tokens.space} * 4)`,
  borderRadius: `${tokens.radiusMd}`,
  background: `${tokens.sunken}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  overflowX: "auto",
  color: `${tokens.text}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: "0.86em",
  lineHeight: "1.6",
});

globalStyle(".rk-prose blockquote", {
  paddingInlineStart: "1em",
  borderInlineStart: `2px solid ${tokens.lineStrong}`,
  color: `${tokens.text3}`,
});

globalStyle(".rk-prose hr", {
  height: "0",
  border: "0",
  borderTop: `1px solid ${tokens.line}`,
  marginBlock: "1.6em",
});

globalStyle(".rk-prose table", {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.93em",
  fontVariantNumeric: "tabular-nums",
});

globalStyle(".rk-prose :is(th, td)", {
  padding: "0.45em 0.8em",
  borderBottom: `1px solid ${tokens.line}`,
  textAlign: "start",
});

globalStyle(".rk-prose th", {
  color: `${tokens.text3}`,
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
});

globalStyle(".rk-prose img", { maxWidth: "100%", height: "auto", borderRadius: `${tokens.radiusMd}` });

globalStyle(".rk-prose figcaption", {
  marginTop: "0.4em",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textXs}`,
});

globalStyle(".rk-prose kbd", {
  padding: "0.05em 0.4em",
  borderRadius: `calc(4px * ${tokens.roundness})`,
  background: `${tokens.surface3}`,
  boxShadow: `inset 0 -1px 0 ${tokens.lineStrong}`,
  color: `${tokens.text}`,
  fontFamily: `${tokens.fontMono}`,
  fontSize: "0.82em",
});
