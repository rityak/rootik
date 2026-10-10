import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle("html:has(.rk-dialog[open])", { overflow: "hidden" });

globalStyle(".rk-dialog", {
  width: "min(var(--rk-dialog-w), calc(100vw - 32px))",
  maxWidth: "none",
  maxHeight: "calc(100dvh - 48px)",
  padding: "0",
  margin: "auto",
  border: "0",
  background: "transparent",
  color: `${tokens.text}`,
  overflow: "visible",
  outline: "none",
  opacity: "0",
  scale: "0.96",
  translate: "0 8px",
  transition: `opacity ${tokens.dur} ${tokens.ease},
    scale ${tokens.dur} ${tokens.ease},
    translate ${tokens.dur} ${tokens.ease},
    display ${tokens.dur} allow-discrete,
    overlay ${tokens.dur} allow-discrete`,
  vars: { "--rk-dialog-w": "560px" },
});

globalStyle(".rk-dialog::backdrop", {
  background: `${tokens.scrim}`,
  backdropFilter: `blur(calc(${tokens.blur} * 0.2))`,
  opacity: "0",
  transition: `opacity ${tokens.dur} ${tokens.ease},
      display ${tokens.dur} allow-discrete,
      overlay ${tokens.dur} allow-discrete`,
});

globalStyle(".rk-dialog[open]", {
  display: "flex",
  opacity: "1",
  scale: "1",
  translate: "0 0",
  transitionDuration: `${tokens.durSlow}`,
  transitionTimingFunction: `${tokens.easeOut}`,
});

globalStyle(".rk-dialog[open]", { "@starting-style": { opacity: "0", scale: "0.96", translate: "0 8px" } });

globalStyle(".rk-dialog[open]::backdrop", { opacity: "1", transitionDuration: `${tokens.durSlow}` });

globalStyle(".rk-dialog[open]::backdrop", { "@starting-style": { opacity: "0" } });

globalStyle('.rk-dialog[data-size="sm"]', { vars: { "--rk-dialog-w": "400px" } });

globalStyle('.rk-dialog[data-size="lg"]', { vars: { "--rk-dialog-w": "820px" } });

globalStyle('.rk-dialog[data-size="xl"]', { vars: { "--rk-dialog-w": "1120px" } });

globalStyle('.rk-dialog[data-size="full"]', {
  height: "calc(100dvh - 48px)",
  vars: { "--rk-dialog-w": "100vw" },
});

globalStyle('.rk-dialog[data-placement="top"]', { margin: "12vh auto auto" });

globalStyle('.rk-dialog:is([data-placement="right"], [data-placement="left"])', {
  height: "100dvh",
  maxHeight: "100dvh",
  margin: "0 0 0 auto",
  vars: { "--rk-dialog-w": "440px" },
});

globalStyle('.rk-dialog:is([data-placement="right"], [data-placement="left"]) .rk-dialog-panel', {
  borderRadius: `${tokens.radiusLg} 0 0 ${tokens.radiusLg}`,
});

globalStyle('.rk-dialog:is([data-placement="right"], [data-placement="left"])[data-size="sm"]', {
  vars: { "--rk-dialog-w": "340px" },
});

globalStyle('.rk-dialog:is([data-placement="right"], [data-placement="left"])[data-size="lg"]', {
  vars: { "--rk-dialog-w": "640px" },
});

globalStyle('.rk-dialog:is([data-placement="right"], [data-placement="left"], [data-placement="bottom"])', {
  opacity: "1",
  scale: "1",
});

globalStyle(
  '.rk-dialog:is([data-placement="right"], [data-placement="left"], [data-placement="bottom"])[open]',
  { translate: "0 0" },
);

globalStyle(
  '.rk-dialog:is([data-placement="right"], [data-placement="left"], [data-placement="bottom"])[open]',
  { "@starting-style": { opacity: "1", scale: "1" } },
);

globalStyle('.rk-dialog[data-placement="right"]', { translate: "100% 0" });

globalStyle('.rk-dialog[data-placement="right"][open]', { "@starting-style": { translate: "100% 0" } });

globalStyle('.rk-dialog[data-placement="left"]', { margin: "0 auto 0 0", translate: "-100% 0" });

globalStyle('.rk-dialog[data-placement="left"] .rk-dialog-panel', {
  borderRadius: `0 ${tokens.radiusLg} ${tokens.radiusLg} 0`,
});

globalStyle('.rk-dialog[data-placement="left"][open]', { "@starting-style": { translate: "-100% 0" } });

globalStyle('.rk-dialog[data-placement="bottom"]', {
  width: "100vw",
  maxHeight: "85dvh",
  margin: "auto 0 0",
  translate: "0 100%",
});

globalStyle('.rk-dialog[data-placement="bottom"] .rk-dialog-panel', {
  borderRadius: `${tokens.radiusXl} ${tokens.radiusXl} 0 0`,
});

globalStyle('.rk-dialog[data-placement="bottom"][open]', { "@starting-style": { translate: "0 100%" } });

globalStyle(".rk-dialog-panel", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "0",
  borderRadius: `${tokens.radiusXl}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
  boxShadow: `${tokens.shadowPop}`,
  overflow: "hidden",
});

globalStyle(".rk-dialog-header", {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: `calc(${tokens.pad} * 1.1) calc(${tokens.pad} * 1.25) 0`,
});

globalStyle(".rk-dialog-header:is(:last-child, :has(+ .rk-dialog-footer))", {
  paddingBottom: `calc(${tokens.pad} * 1.1)`,
});

globalStyle(".rk-dialog-titles", { flex: "1", minWidth: "0" });

globalStyle(".rk-dialog-title", {
  margin: "0",
  fontSize: `${tokens.textLg}`,
  fontWeight: "600",
  letterSpacing: "-0.01em",
  lineHeight: "1.3",
});

globalStyle(".rk-dialog-desc", { margin: "4px 0 0", fontSize: `${tokens.textSm}`, color: `${tokens.text3}` });

globalStyle(".rk-dialog-close", {
  display: "grid",
  placeItems: "center",
  width: "30px",
  height: "30px",
  margin: "-4px -6px 0 0",
  padding: "0",
  border: "0",
  borderRadius: `${tokens.radiusRound}`,
  background: `${tokens.hover}`,
  color: `${tokens.text2}`,
  fontSize: "16px",
  cursor: "pointer",
});

globalStyle(".rk-dialog-close:hover", { background: `${tokens.press}`, color: `${tokens.text}` });

globalStyle(".rk-dialog-body", {
  flex: "1",
  minHeight: "0",
  overflowY: "auto",
  padding: `calc(${tokens.pad} * 1.25)`,
});

globalStyle(".rk-dialog-footer", {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexWrap: "wrap",
  gap: "8px",
  padding: `calc(${tokens.space} * 3) calc(${tokens.pad} * 1.25)`,
  borderTop: `1px solid ${tokens.line}`,
  background: `${tokens.wellSoft}`,
});

globalStyle(".rk-command .rk-dialog-body", { padding: "0", display: "flex", flexDirection: "column" });

globalStyle(".rk-command-search", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "0 16px",
  height: "52px",
  borderBottom: `1px solid ${tokens.line}`,
  color: `${tokens.text3}`,
  fontSize: "16px",
});

globalStyle(".rk-command-search input", {
  flex: "1",
  minWidth: "0",
  height: "100%",
  border: "0",
  outline: "none",
  background: "transparent",
  color: `${tokens.text}`,
  font: "inherit",
  fontSize: `${tokens.textLg}`,
});

globalStyle(".rk-command-search input::placeholder", { color: `${tokens.text3}` });

globalStyle(".rk-command-list", {
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  maxHeight: "min(420px, 60dvh)",
  overflowY: "auto",
  padding: "6px",
});

globalStyle(".rk-command-empty", { padding: "28px 12px", textAlign: "center", color: `${tokens.text3}` });

globalStyle(".rk-command-enter", { color: `${tokens.text3}`, flexShrink: "0" });
