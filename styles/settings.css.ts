import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-settings", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  minWidth: "0",
});

globalStyle(".rk-settings-select", { width: "160px" });

globalStyle(".rk-settings-slider", { width: "200px" });

globalStyle(".rk-settings-footer", { display: "flex", justifyContent: "flex-end" });
