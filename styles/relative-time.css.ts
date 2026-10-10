import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-relative-time", { whiteSpace: "nowrap" });

globalStyle(".rk-timer", { whiteSpace: "nowrap" });

globalStyle(".rk-timer[data-ended]", { color: `${tokens.text3}` });
