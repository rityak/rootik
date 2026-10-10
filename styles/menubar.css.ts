import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-menubar", { display: "inline-flex", alignItems: "center", gap: "1px", minWidth: "0" });

globalStyle(".rk-menubar-trigger", {
  height: `calc(${tokens.hSm} - 4px)`,
  padding: `0 calc(${tokens.space} * 2.5)`,
  border: "0",
  borderRadius: `calc(${tokens.radiusControl} - 2px)`,
  background: "transparent",
  color: `${tokens.text2}`,
  font: "inherit",
  fontSize: `${tokens.textSm}`,
  whiteSpace: "nowrap",
  cursor: "default",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-menubar-trigger:hover, .rk-menubar-trigger:focus-visible", {
  background: `${tokens.hover}`,
  color: `${tokens.text}`,
});

globalStyle('.rk-menubar-trigger[aria-expanded="true"]', {
  background: `${tokens.press}`,
  color: `${tokens.text}`,
});

globalStyle('.rk-menubar-trigger[aria-disabled="true"]', { opacity: "0.45" });

globalStyle(".rk-menubar-trigger:focus-visible", { outlineOffset: "-1px" });
