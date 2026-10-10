import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-qr", { display: "block", flex: "none", borderRadius: `${tokens.radiusMd}` });

globalStyle(".rk-qr .rk-qr-plate", { fill: `${tokens.inverse}` });

globalStyle(".rk-qr .rk-qr-modules", { fill: `${tokens.onInverse}` });
