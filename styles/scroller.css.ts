import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-scroller", { position: "relative", minWidth: "0", vars: { "--rk-scroller-fade": "32px" } });

globalStyle(".rk-scroller-viewport", {
  display: "flex",
  alignItems: "center",
  gap: "inherit",
  overflowX: "auto",
  overscrollBehaviorX: "contain",
  scrollbarWidth: "none",
});

globalStyle(".rk-scroller-viewport::-webkit-scrollbar", { display: "none" });

globalStyle(".rk-scroller-viewport > *", { flex: "none", flexWrap: "nowrap" });

globalStyle(".rk-scroller[data-back] > .rk-scroller-viewport", {
  maskImage: "linear-gradient(to right, transparent, black var(--rk-scroller-fade))",
});

globalStyle(".rk-scroller[data-forward] > .rk-scroller-viewport", {
  maskImage: "linear-gradient(to left, transparent, black var(--rk-scroller-fade))",
});

globalStyle(".rk-scroller[data-back][data-forward] > .rk-scroller-viewport", {
  maskImage:
    "linear-gradient(\n      to right,\n      transparent,\n      black var(--rk-scroller-fade),\n      black calc(100% - var(--rk-scroller-fade)),\n      transparent\n    )",
});

globalStyle(".rk-scroller-btn", {
  position: "absolute",
  top: "50%",
  display: "grid",
  placeItems: "center",
  width: "24px",
  height: "24px",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusPill}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur})`,
  boxShadow: `${tokens.shadow2}`,
  color: `${tokens.text2}`,
  fontSize: "14px",
  translate: "0 -50%",
  cursor: "pointer",
  transition: `color ${tokens.dur} ${tokens.ease},
    opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle('.rk-scroller-btn[data-dir="back"]', { left: "0" });

globalStyle('.rk-scroller-btn[data-dir="forward"]', { right: "0" });

globalStyle(".rk-scroller-btn:hover", { color: `${tokens.text}` });

globalStyle(".rk-scroller-btn[hidden]", { display: "none" });

globalStyle(".rk-scroller-btn > svg", { width: "1em", height: "1em" });
