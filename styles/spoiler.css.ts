import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-spoiler", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: `calc(${tokens.space} * 1.5)`,
  minWidth: "0",
});

globalStyle(".rk-spoiler-content", {
  alignSelf: "stretch",
  overflow: "hidden",
  transition: `max-height ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle("[data-overflowing]:not([data-expanded]) > .rk-spoiler-content", {
  maskImage: "linear-gradient(to bottom, black calc(100% - 2.5em), transparent)",
});

globalStyle(".rk-spoiler-toggle", {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "2px 6px",
  marginInlineStart: "-6px",
  border: "0",
  borderRadius: `calc(${tokens.radiusControl} - 4px)`,
  background: "none",
  color: `${tokens.accentText}`,
  font: "inherit",
  fontSize: `${tokens.textSm}`,
  fontWeight: "500",
  cursor: "pointer",
});

globalStyle(".rk-spoiler-toggle:hover", { background: `${tokens.hover}` });

globalStyle(".rk-spoiler-toggle > svg", {
  width: "14px",
  height: "14px",
  transition: `rotate ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-spoiler-toggle > svg[data-open]", { rotate: "180deg" });
