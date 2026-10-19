import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-qr", {
  display: "block",
  flex: "none",
  maxWidth: "100%",
  height: "auto",
  borderRadius: `${tokens.radiusMd}`,
});

globalStyle(".rk-qr .rk-qr-plate", { fill: tokens.qrPlate });

globalStyle(".rk-qr .rk-qr-modules", { fill: tokens.qrInk });
