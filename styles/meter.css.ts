import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-meter", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 1.5)`,
  minWidth: "0",
  vars: { "--rk-meter-h": "6px" },
});

globalStyle('.rk-meter[data-size="sm"]', { vars: { "--rk-meter-h": "3px" } });

globalStyle('.rk-meter[data-size="lg"]', { vars: { "--rk-meter-h": "10px" } });

globalStyle(".rk-meter-head", {
  display: "flex",
  justifyContent: "space-between",
  gap: `${tokens.space}`,
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-meter-track", {
  display: "flex",
  height: "var(--rk-meter-h)",
  overflow: "hidden",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.hatch}, color-mix(in oklab, ${tokens.surface3} 70%, transparent)`,
});

globalStyle(".rk-meter-bar", {
  flexShrink: "0",
  height: "100%",
  background: "var(--rk-tone)",
  transition: `width ${tokens.durSlow} ${tokens.easeOut},
    background-color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-meter-bar:first-child", { borderRadius: `${tokens.radiusPill} 0 0 ${tokens.radiusPill}` });

globalStyle(".rk-meter-bar:last-child", { borderRadius: `0 ${tokens.radiusPill} ${tokens.radiusPill} 0` });

globalStyle(".rk-meter-bar:only-child", { borderRadius: `${tokens.radiusPill}` });

globalStyle(".rk-meter-bar[data-section] + .rk-meter-bar", {
  boxShadow: `inset 1.5px 0 0 ${tokens.surface1}`,
});
