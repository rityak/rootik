import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-settings-rows", { display: "flex", flexDirection: "column" });

globalStyle(".rk-settings-row", {
  display: "flex",
  flexDirection: "column",
  gap: `calc(${tokens.space} * 3)`,
  paddingBlock: `calc(${tokens.space} * 3)`,
  borderBottom: `1px solid ${tokens.line}`,
});

globalStyle(".rk-settings-row:first-child", { paddingTop: "0" });

globalStyle(".rk-settings-row:last-child", { paddingBottom: "0", borderBottom: "0" });

globalStyle(".rk-nest .rk-settings-row", { paddingBlock: "0", borderBottom: "0" });

globalStyle(".rk-settings-group", { display: "flex", flexDirection: "column", gap: "8px" });

globalStyle(".rk-settings-group + .rk-settings-group", {
  paddingTop: `calc(${tokens.space} * 4)`,
  borderTop: `1px solid ${tokens.line}`,
});

globalStyle(".rk-settings-title", {
  margin: "0 0 4px",
  fontSize: `${tokens.text2xs}`,
  fontWeight: "500",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: `${tokens.text3}`,
});

globalStyle('[data-tone="danger"] > .rk-settings-title', { color: "var(--rk-tone-text)" });

globalStyle(".rk-settings-desc", {
  margin: "-4px 0 4px",
  fontSize: `${tokens.textXs}`,
  color: `${tokens.text3}`,
});

globalStyle('.rk-settings-card[data-tone="danger"]', {
  boxShadow: `var(--rk-surface-shadow, ${tokens.shadow1}),
    inset 0 0 0 1px color-mix(in oklab, ${tokens.danger} 45%, transparent)`,
});

globalStyle('.rk-settings-card[data-tone="danger"] .rk-card-title', { color: "var(--rk-tone-text)" });
