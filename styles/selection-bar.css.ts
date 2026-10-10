import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-selection-bar", {
  position: "fixed",
  inset: "auto auto var(--rk-selection-offset) 50%",
  display: "flex",
  alignItems: "center",
  gap: `calc(${tokens.space} * 2)`,
  maxWidth: "calc(100vw - 32px)",
  margin: "0",
  padding: "6px 6px 6px 14px",
  border: "0",
  borderRadius: `${tokens.radiusPill}`,
  color: `${tokens.text}`,
  translate: "-50% 0",
  transition: `opacity ${tokens.dur} ${tokens.ease},
    translate ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle(".rk-selection-bar:not(:popover-open)", { display: "none" });

globalStyle(".rk-selection-bar", { "@starting-style": { opacity: "0", translate: "-50% 16px" } });

globalStyle(".rk-selection-count", { fontSize: `${tokens.textSm}`, fontWeight: "500", whiteSpace: "nowrap" });

globalStyle(".rk-selection-clear", {
  display: "grid",
  placeItems: "center",
  width: "22px",
  height: "22px",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.surface4}`,
  color: `${tokens.text2}`,
  fontSize: "13px",
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-selection-clear:hover", { color: `${tokens.text}` });

globalStyle(".rk-selection-clear > svg", { width: "1em", height: "1em" });

globalStyle(".rk-selection-sep", {
  alignSelf: "stretch",
  width: "1px",
  marginBlock: "4px",
  background: `${tokens.lineStrong}`,
});

globalStyle(".rk-selection-actions", { display: "flex", alignItems: "center", gap: "4px" });

globalStyle(".rk-selection-actions .rk-button", { borderRadius: `${tokens.radiusPill}` });
