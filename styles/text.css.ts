import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-text", { margin: "0", color: `${tokens.text}`, font: "inherit", overflowWrap: "anywhere" });

globalStyle('.rk-text[data-size="xs"]', { fontSize: `${tokens.textXs}` });

globalStyle('.rk-text[data-size="sm"]', { fontSize: `${tokens.textSm}` });

globalStyle('.rk-text[data-size="lg"]', { fontSize: `${tokens.textLg}` });

globalStyle('.rk-text[data-text-tone="muted"]', { color: `${tokens.text2}` });

globalStyle('.rk-text[data-text-tone="faint"]', { color: `${tokens.text3}` });

globalStyle('.rk-text[data-text-tone="accent"]', { color: `${tokens.accentText}` });

globalStyle('.rk-text[data-text-tone="success"]', { color: `${tokens.success}` });

globalStyle('.rk-text[data-text-tone="warn"]', { color: `${tokens.warn}` });

globalStyle('.rk-text[data-text-tone="danger"]', { color: `${tokens.danger}` });

globalStyle('.rk-text[data-text-tone="info"]', { color: `${tokens.info}` });

globalStyle('.rk-text[data-family="sans"]', { fontFamily: tokens.fontSans });
globalStyle('.rk-text[data-family="mono"]', {
  fontFamily: tokens.fontMono,
  fontVariantNumeric: "tabular-nums",
});
globalStyle('.rk-text[data-family="display"]', { fontFamily: "var(--rk-font-display)" });
globalStyle('.rk-text[data-weight="normal"]', { fontWeight: 400 });
globalStyle('.rk-text[data-weight="medium"]', { fontWeight: 500 });
globalStyle('.rk-text[data-weight="semibold"]', { fontWeight: 600 });
globalStyle('.rk-text[data-weight="bold"]', { fontWeight: 700 });
globalStyle('.rk-text[data-italic="true"]', { fontStyle: "italic" });
globalStyle('.rk-text[data-italic="false"]', { fontStyle: "normal" });
