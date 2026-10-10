import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-editable", {
  position: "relative",
  display: "inline-flex",
  maxWidth: "100%",
  minWidth: "0",
  verticalAlign: "top",
});

globalStyle(".rk-editable[data-mono]", { fontFamily: `${tokens.fontMono}` });

globalStyle(".rk-editable-view,\n.rk-editable-input", {
  margin: `0 calc(${tokens.space} * -1.5)`,
  padding: `1px calc(${tokens.space} * 1.5)`,
  border: "0",
  borderRadius: `calc(${tokens.radiusControl} * 0.7)`,
  color: "inherit",
  font: "inherit",
  letterSpacing: "inherit",
});

globalStyle(".rk-editable-view", {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4em",
  maxWidth: `calc(100% + ${tokens.space} * 3)`,
  background: "transparent",
  cursor: "text",
  textAlign: "start",
  transition: `background-color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-editable-view:hover:not(:disabled)", { background: `${tokens.hover}` });

globalStyle(".rk-editable-view:disabled", { cursor: "default" });

globalStyle(".rk-editable-text", { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });

globalStyle(".rk-editable-text[data-empty]", { color: `${tokens.text3}` });

globalStyle(".rk-editable-icon", {
  flexShrink: "0",
  width: "0.85em",
  height: "0.85em",
  color: `${tokens.text3}`,
  opacity: "0",
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-editable-view:is(:hover, :focus-visible) > .rk-editable-icon", { opacity: "1" });

globalStyle(".rk-editable-input", {
  fieldSizing: "content",
  minWidth: "4ch",
  maxWidth: `calc(100% + ${tokens.space} * 3)`,
  background: `${tokens.well}`,
  outline: `2px solid ${tokens.focus}`,
  outlineOffset: "-2px",
});

globalStyle('.rk-editable-input[aria-invalid="true"]', {
  outlineColor: `oklch(from ${tokens.danger} calc(l + 0.08) c h)`,
});

globalStyle(".rk-editable-input::placeholder", { color: `${tokens.text3}` });

globalStyle(".rk-editable-error", {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: "0",
  zIndex: "1",
  padding: "3px 8px",
  borderRadius: `${tokens.radiusSm}`,
  background: `${tokens.surface3}`,
  boxShadow: `${tokens.shadow2}`,
  color: `oklch(from ${tokens.danger} calc(l + 0.08) c h)`,
  fontFamily: `${tokens.fontSans}`,
  fontSize: `${tokens.textXs}`,
  fontWeight: "400",
  whiteSpace: "nowrap",
});
