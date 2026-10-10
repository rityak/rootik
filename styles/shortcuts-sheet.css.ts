import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-shortcuts", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
  gap: "16px 24px",
});

globalStyle(".rk-shortcuts-title", {
  margin: "0 0 6px",
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: `${tokens.text3}`,
});

globalStyle(".rk-shortcuts-group dl", { margin: "0" });

globalStyle(".rk-shortcuts-row", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "5px 0",
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-shortcuts-row + .rk-shortcuts-row", { boxShadow: `inset 0 1px 0 ${tokens.line}` });

globalStyle(".rk-shortcuts-row dt", { color: `${tokens.text2}` });

globalStyle(".rk-shortcuts-row dd", { margin: "0" });
