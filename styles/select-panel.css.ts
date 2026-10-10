import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-select-panel", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 1.5)`,
  width: "280px",
  padding: "6px",
  overflow: "hidden",
});

globalStyle(".rk-select-panel .rk-popover-title", { padding: "4px 6px 0" });

globalStyle(".rk-select-panel-search", { flexShrink: "0" });

globalStyle(".rk-select-panel-list", {
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  maxHeight: "min(300px, calc(var(--rk-available-h, 420px) - 120px))",
  overflowY: "auto",
  outline: "none",
});

globalStyle(".rk-select-panel-option", { fontSize: `${tokens.textSm}` });

globalStyle('.rk-select-panel-option[aria-selected="true"]', { fontWeight: "400" });

globalStyle(".rk-select-panel-box", {
  display: "grid",
  flexShrink: "0",
  placeItems: "center",
  width: "15px",
  height: "15px",
  borderRadius: `calc(4px * ${tokens.roundness})`,
  boxShadow: `inset 0 0 0 1.5px ${tokens.lineStrong}`,
  color: `${tokens.onAccent}`,
  transition: `background-color ${tokens.dur} ${tokens.ease},
    box-shadow ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-select-panel-box[data-checked]", { background: `${tokens.accent}`, boxShadow: "none" });

globalStyle(".rk-select-panel-box > svg", { width: "11px", height: "11px", strokeWidth: "3" });

globalStyle(".rk-select-panel-count", {
  flexShrink: "0",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textXs}`,
});

globalStyle(".rk-select-panel-empty", {
  padding: "14px 8px",
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
  textAlign: "center",
});

globalStyle(".rk-select-panel-foot", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "6px 2px 0 6px",
  borderTop: `1px solid ${tokens.line}`,
  color: `${tokens.text3}`,
  fontSize: `${tokens.textXs}`,
});

globalStyle(".rk-select-panel-foot > :first-child", { flex: "1" });
