import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-fieldset", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  minWidth: "0",
  margin: "0",
  padding: "0",
  border: "0",
});

globalStyle('.rk-fieldset[data-variant="outline"]', {
  padding: `calc(${tokens.space} * 4)`,
  borderRadius: `${tokens.radiusMd}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  background: `${tokens.wellSoft}`,
});

globalStyle(".rk-fieldset:disabled .rk-fieldset-legend, .rk-fieldset:disabled .rk-fieldset-desc", {
  opacity: "0.5",
});

globalStyle(
  ".rk-fieldset:disabled :is(.rk-check, .rk-segmented, .rk-swatches, .rk-slider, .rk-field-label)",
  { opacity: "0.45", cursor: "not-allowed" },
);

globalStyle(".rk-fieldset-legend", {
  float: "left",
  width: "100%",
  margin: "0",
  padding: "0",
  fontSize: `${tokens.textSm}`,
  fontWeight: "600",
  color: `${tokens.text}`,
});

globalStyle(".rk-fieldset-legend + *", { clear: "both" });

globalStyle(".rk-fieldset-desc", {
  margin: `calc(${tokens.space} * -2) 0 0`,
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
  textWrap: "pretty",
});

globalStyle(".rk-fieldset-body", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  minWidth: "0",
});

globalStyle(".rk-fieldset-body[data-row]", { flexDirection: "row", flexWrap: "wrap" });

globalStyle(".rk-fieldset-body[data-row] > *", { flex: "1 1 160px" });
