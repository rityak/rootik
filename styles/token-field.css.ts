import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-token-field", {
  flexWrap: "wrap",
  gap: "4px",
  height: "auto",
  minHeight: "var(--rk-input-h)",
  paddingBlock: "3px",
  paddingInline: `4px calc(${tokens.space} * 3)`,
});

globalStyle(".rk-token-input", {
  flex: "1 0 80px",
  height: "calc(var(--rk-input-h) - 8px)",
  paddingLeft: "4px",
});

globalStyle(".rk-token", {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  maxWidth: "100%",
  height: "calc(var(--rk-input-h) - 10px)",
  padding: "0 2px 0 8px",
  borderRadius: `calc(${tokens.radiusControl} * 0.7)`,
  background: `${tokens.surface3}`,
  boxShadow: `${tokens.highlight}`,
  color: `${tokens.text}`,
  fontSize: `${tokens.textSm}`,
  transition: `background-color ${tokens.dur} ${tokens.ease},
    box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-token[data-armed]", {
  background: `${tokens.accentSoft}`,
  boxShadow: `inset 0 0 0 1px ${tokens.accentLine}`,
});

globalStyle(".rk-token-text", { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });

globalStyle(".rk-token-key", { color: `${tokens.text3}` });

globalStyle(".rk-token-remove", {
  display: "grid",
  placeItems: "center",
  width: "18px",
  height: "18px",
  padding: "0",
  border: "0",
  borderRadius: `calc(${tokens.radiusControl} * 0.5)`,
  background: "transparent",
  color: `${tokens.text3}`,
  cursor: "pointer",
});

globalStyle(".rk-token-remove > svg", { width: "12px", height: "12px" });

globalStyle(".rk-token-remove:hover", { background: `${tokens.hover}`, color: `${tokens.text}` });

globalStyle(".rk-token-error", {
  display: "block",
  marginTop: "4px",
  color: `oklch(from ${tokens.danger} calc(l + 0.08) c h)`,
  fontSize: `${tokens.textXs}`,
});
