import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-schema-form", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  minWidth: "0",
});

globalStyle(".rk-schema-control", { display: "contents" });

globalStyle(".rk-schema-control:disabled .rk-swatches", { opacity: "0.45" });

globalStyle(
  '.rk-schema-row > [data-layout="inline"] > .rk-field-control :is(.rk-input, .rk-select-trigger, .rk-slider)',
  { width: "var(--rk-schema-control-width, 200px)" },
);

globalStyle('.rk-schema-row > [data-layout="inline"] > .rk-field-control .rk-textarea', {
  width: "calc(var(--rk-schema-control-width, 200px) * 1.4)",
});

globalStyle('.rk-schema-row > [data-layout="inline"] > .rk-field-control .rk-chip-group', {
  justifyContent: "flex-end",
});

globalStyle(
  '.rk-schema-row > [data-layout="stack"] > .rk-field-control :is(.rk-input, .rk-select-trigger, .rk-slider, .rk-textarea)',
  { width: "100%" },
);

globalStyle(".rk-schema-actions", {
  display: "flex",
  justifyContent: "flex-end",
  gap: `calc(${tokens.space} * 2)`,
});
