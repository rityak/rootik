import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-number-input", { paddingRight: `calc(${tokens.space} * 0.75)` });

globalStyle(".rk-number-input .rk-input-el", { fontVariantNumeric: "tabular-nums" });

globalStyle(".rk-number-input .rk-input-end", { gap: `calc(${tokens.space} * 2)` });

globalStyle(".rk-number-unit", {
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
  pointerEvents: "none",
});

globalStyle(".rk-number-stepper", {
  display: "flex",
  flexDirection: "column",
  alignSelf: "stretch",
  justifyContent: "center",
  gap: "1px",
  width: "calc(var(--rk-input-h) * 0.62)",
  paddingBlock: "3px",
});

globalStyle(".rk-number-step", {
  display: "flex",
  flex: "1",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "0",
  padding: "0",
  border: "0",
  borderRadius: `calc(${tokens.radiusControl} * 0.55)`,
  background: "transparent",
  color: `${tokens.text3}`,
  fontSize: "calc(var(--rk-input-h) * 0.32)",
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-number-step:hover:not(:disabled)", {
  background: `${tokens.hover}`,
  color: `${tokens.text}`,
});

globalStyle(".rk-number-step:active:not(:disabled)", { background: `${tokens.press}` });

globalStyle(".rk-number-step:disabled", { opacity: "0.35", cursor: "default" });

globalStyle(".rk-number-step > svg", { width: "1em", height: "1em" });
