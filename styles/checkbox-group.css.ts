import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-checkbox-group", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 2.5)`,
  minWidth: "0",
});

globalStyle(".rk-checkbox-group-items", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 2.5)`,
});

globalStyle('.rk-checkbox-group-items[data-orientation="horizontal"]', {
  flexDirection: "row",
  flexWrap: "wrap",
  columnGap: `calc(${tokens.space} * 5)`,
});

globalStyle(".rk-checkbox-group-nested", {
  marginInlineStart: "7px",
  padding: `2px 0 2px calc(${tokens.space} * 4)`,
  borderInlineStart: `1px solid ${tokens.lineStrong}`,
});
