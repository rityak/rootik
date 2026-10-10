import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-text", { margin: "0", color: `${tokens.text}`, font: "inherit" });

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
