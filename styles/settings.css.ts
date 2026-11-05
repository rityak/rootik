import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-settings", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  minWidth: "0",
});

globalStyle(".rk-settings-select", { width: "min(160px, 100%)" });

globalStyle(".rk-settings-slider", { width: "min(200px, 100%)" });

globalStyle(".rk-settings-footer", { display: "flex", justifyContent: "flex-end" });
