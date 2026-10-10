import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-copy-button .rk-icon > svg", {
  transition: `scale ${tokens.dur} ${tokens.spring},
      opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(".rk-copy-button .rk-icon > svg", { "@starting-style": { scale: "0.5", opacity: "0" } });

globalStyle(".rk-copy-button[data-copied]", { vars: { "--rk-btn-fg": `${tokens.success}` } });

globalStyle(".rk-copy-button[data-copied] .rk-icon", { color: `${tokens.success}` });
