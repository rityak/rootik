import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-combobox", { paddingRight: `calc(${tokens.space} * 1)` });

globalStyle(".rk-combobox-toggle", {
  display: "grid",
  placeItems: "center",
  width: "22px",
  height: "22px",
  padding: "0",
  border: "0",
  borderRadius: `calc(${tokens.radiusControl} * 0.6)`,
  background: "transparent",
  color: `${tokens.text3}`,
  cursor: "pointer",
});

globalStyle(".rk-combobox-toggle > svg", {
  width: "1em",
  height: "1em",
  transition: `rotate ${tokens.dur} ${tokens.ease}`,
});

globalStyle('[aria-expanded="true"] ~ .rk-input-end > .rk-combobox-toggle > svg', { rotate: "180deg" });

globalStyle(".rk-combobox-toggle:hover:not(:disabled)", {
  background: `${tokens.hover}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-combobox-list", { fontSize: `${tokens.textMd}` });

globalStyle(".rk-combobox-mark", { background: "none", color: `${tokens.accentText}`, fontWeight: "600" });

globalStyle(".rk-combobox-empty", {
  padding: "10px 8px",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
  textAlign: "center",
});
