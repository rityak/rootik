import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-password-toggle", {
  display: "grid",
  placeItems: "center",
  width: "24px",
  height: "24px",
  marginInlineEnd: "-4px",
  padding: "0",
  border: "0",
  borderRadius: `calc(${tokens.radiusControl} - 4px)`,
  background: "none",
  color: `${tokens.text3}`,
  cursor: "pointer",
  transition: `background-color ${tokens.dur} ${tokens.ease},
    color ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-password-toggle > svg", { width: "15px", height: "15px" });

globalStyle(".rk-password-toggle:hover:not(:disabled)", {
  background: `${tokens.hover}`,
  color: `${tokens.text}`,
});

globalStyle('.rk-password-toggle[aria-pressed="true"]', { color: `${tokens.text2}` });

globalStyle(".rk-password-toggle:disabled", { cursor: "not-allowed" });

globalStyle(".rk-password input::-ms-reveal", { display: "none" });
