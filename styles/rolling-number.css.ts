import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-rolling", { display: "inline-flex", whiteSpace: "nowrap" });

globalStyle(".rk-rolling-track", { display: "inline-flex" });

globalStyle(".rk-rolling-digit", { display: "inline-block", height: "1lh", overflow: "hidden" });

globalStyle(".rk-rolling-strip", {
  display: "flex",
  flexDirection: "column",
  translate: "0 calc(var(--rk-digit) * -1lh)",
  transition: `translate ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle(".rk-rolling-strip", { "@starting-style": { translate: "0 0" } });

globalStyle(".rk-rolling-strip > span", { height: "1lh" });

globalStyle(".rk-rolling-sign", { whiteSpace: "pre" });
