import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-input-group", {
  display: "inline-flex",
  alignItems: "stretch",
  minWidth: "0",
  vars: { "--rk-group-radius": `${tokens.radiusControl}` },
});

globalStyle(".rk-input-group[data-block]", { display: "flex" });

globalStyle(".rk-input-group[data-block] > .rk-input", { flex: "1" });

globalStyle(".rk-input-group > :is(.rk-input, .rk-select-trigger, .rk-button, .rk-input-addon)", {
  position: "relative",
  borderRadius: "0",
});

globalStyle(
  ".rk-input-group > :is(.rk-input, .rk-select-trigger, .rk-button, .rk-input-addon):not(:nth-child(1 of :not(.rk-floating)))",
  { marginInlineStart: "-1px" },
);

globalStyle(
  ".rk-input-group > :is(.rk-input, .rk-select-trigger, .rk-button, .rk-input-addon):nth-child(1 of :not(.rk-floating))",
  { borderStartStartRadius: "var(--rk-group-radius)", borderEndStartRadius: "var(--rk-group-radius)" },
);

globalStyle(
  ".rk-input-group > :is(.rk-input, .rk-select-trigger, .rk-button, .rk-input-addon):nth-last-child(1 of :not(.rk-floating))",
  { borderStartEndRadius: "var(--rk-group-radius)", borderEndEndRadius: "var(--rk-group-radius)" },
);

globalStyle(
  ".rk-input-group > :is(.rk-input, .rk-select-trigger, .rk-button, .rk-input-addon):is(:focus-visible, :focus-within, :hover)",
  { zIndex: "1" },
);

globalStyle(".rk-input-group > .rk-button", { height: "auto" });

globalStyle(".rk-input-addon", {
  display: "inline-flex",
  alignItems: "center",
  flexShrink: "0",
  paddingInline: `calc(${tokens.space} * 3)`,
  background: `${tokens.wellSoft}`,
  boxShadow: `inset 0 0 0 1px ${tokens.line}`,
  color: `${tokens.text3}`,
  fontSize: `${tokens.textSm}`,
  whiteSpace: "nowrap",
  userSelect: "none",
});

globalStyle(".rk-input-addon[data-mono]", {
  fontFamily: `${tokens.fontMono}`,
  fontSize: `calc(${tokens.textSm} * 0.94)`,
});
