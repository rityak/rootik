import { globalStyle } from "@vanilla-extract/css";

globalStyle(".rk-truncate-text", {
  display: "inline-block",
  maxWidth: "100%",
  minWidth: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  verticalAlign: "top",
});

globalStyle(".rk-truncate-text[data-lines]", {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: "var(--rk-lines)",
  lineClamp: "var(--rk-lines)",
  whiteSpace: "normal",
});

globalStyle(".rk-truncate-text[data-middle]", { display: "inline-flex" });

globalStyle(".rk-truncate-text[data-middle] .rk-truncate-start", {
  minWidth: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(".rk-truncate-text[data-middle] .rk-truncate-end", { flex: "none", whiteSpace: "pre" });
