import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-tracker", {
  container: "rk-tracker / inline-size",
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 1.5)`,
  minWidth: "0",
  vars: { "--rk-tracker-h": "28px" },
});

globalStyle('.rk-tracker[data-size="sm"]', { vars: { "--rk-tracker-h": "16px" } });

globalStyle('.rk-tracker[data-size="lg"]', { vars: { "--rk-tracker-h": "40px" } });

globalStyle(".rk-tracker-head,\n.rk-tracker-foot", {
  display: "flex",
  justifyContent: "space-between",
  gap: `${tokens.space}`,
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text2}`,
});

globalStyle(".rk-tracker-foot", { color: `${tokens.text3}` });

globalStyle(".rk-tracker-bars", {
  display: "flex",
  margin: "0",
  padding: "0",
  listStyle: "none",
  gap: "2px",
  height: "var(--rk-tracker-h)",
});

globalStyle(".rk-tracker-bar", {
  flex: "1 1 0",
  minWidth: "2px",
  borderRadius: `calc(2px * ${tokens.roundness})`,
  background: "var(--rk-tone)",
  transition: `opacity ${tokens.dur} ${tokens.ease},
    scale ${tokens.dur} ${tokens.easeOut}`,
});

globalStyle(".rk-tracker-bar[data-idle]", {
  background: `${tokens.hatch}, color-mix(in oklab, ${tokens.surface3} 70%, transparent)`,
});

globalStyle(".rk-tracker-bars:has([data-shown]) > .rk-tracker-bar:not([data-shown])", { opacity: "0.55" });

globalStyle(".rk-tracker-bar[data-shown]", { scale: "1 1.12" });

globalStyle(".rk-tracker-bar:focus-visible", { outlineOffset: "1px" });

globalStyle(".rk-tracker-bars", { "@container": { "rk-tracker (width < 26rem)": { gap: "1px" } } });

globalStyle(".rk-tracker-bar", {
  "@container": {
    "rk-tracker (width < 26rem)": { minWidth: "1px", borderRadius: `calc(1px * ${tokens.roundness})` },
  },
});
