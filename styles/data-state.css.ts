import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-data-state", { minWidth: "0" });

globalStyle('.rk-data-state[data-status="loading"]', { paddingBlock: `calc(${tokens.space} * 2)` });
