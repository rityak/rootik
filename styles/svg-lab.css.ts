import { globalStyle } from "@vanilla-extract/css";
import { paletteColor, svgPalettes, svgPaletteVars } from "../src/stories/svg-palettes";

globalStyle(".rx-lab", {
  vars: {
    "--rk-svg-fill": "var(--rx-surface-light)",
    "--rk-svg-fill-low": "var(--rx-surface-low)",
    "--rk-svg-edge-top": "var(--rx-edge-top)",
    "--rk-svg-edge": "var(--rx-edge-bottom)",
    "--rk-svg-shadow": "var(--rx-shadow)",
    "--rk-svg-pattern-color": "var(--rk-text-3)",
    "--rk-svg-blur": "7px",
  },
});
globalStyle(".rx-stage > :not(.rk-svg-backdrop)", { position: "relative", zIndex: 1 });
globalStyle(".rx-lab .rk-input-el:focus-visible", { outline: "none" });

// Legacy exploration relief must not draw a second rectangular rim over SVG controls.
globalStyle(
  '.rd-app[data-direction^="signal-"] .rx-lab .rk-button[data-svg-border], .rd-app[data-direction^="signal-"] .rx-lab .rk-input[data-svg-border]',
  {
    background: "transparent",
    boxShadow: "none",
  },
);
globalStyle(".rx-artwork-gallery", {
  display: "grid",
  gridTemplateColumns: "repeat(6,minmax(0,1fr))",
  gap: "12px",
  "@media": { "(max-width: 800px)": { gridTemplateColumns: "repeat(3,minmax(0,1fr))" } },
});
globalStyle(".rx-artwork-choice", {
  appearance: "none",
  minWidth: 0,
  padding: "12px",
  border: "1px solid var(--rk-line)",
  borderRadius: "12px",
  background: "transparent",
  color: "var(--rk-text-2)",
  font: "10px var(--rk-font-mono)",
});
globalStyle('.rx-artwork-choice[aria-pressed="true"]', {
  borderColor: "var(--rk-accent-text)",
  color: "var(--rk-accent-text)",
});
globalStyle(".rx-custom-study", {
  position: "relative",
  isolation: "isolate",
  padding: "36px",
  overflow: "hidden",
  borderRadius: "18px",
  border: "1px solid var(--rk-line)",
  background: "var(--rx-stage)",
  minHeight: "230px",
});
globalStyle(".rx-custom-study > div:not(.rk-svg-backdrop)", {
  position: "relative",
  maxWidth: "410px",
  zIndex: 1,
});
globalStyle(".rx-custom-study h2", { fontWeight: 350, fontSize: "25px", marginBlock: "12px" });
globalStyle(".rx-custom-study p", { color: "var(--rk-text-2)", fontSize: "12px", lineHeight: 1.7 });

globalStyle('.rd-app[data-direction]:is([data-screen="svg"], [data-screen="typography"])', {
  gridTemplateColumns: "174px minmax(0, 1fr)",
  gridTemplateAreas: '"top top" "side main" "status status"',
});

globalStyle('.rd-app:is([data-screen="svg"], [data-screen="typography"]) > .rd-inspector', {
  display: "none",
});

globalStyle(".rx-lab", {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  minWidth: "0",
  vars: {
    "--rk-accent-hover": "oklch(from var(--rk-accent) calc(l - 0.035) c h)",
    "--rk-on-accent-hover": "var(--rk-on-accent)",
    "--rk-accent-soft": "color-mix(in oklab, var(--rk-accent) 12%, transparent)",
    "--rk-accent-line": "var(--rk-accent)",
    "--rk-focus": "var(--rk-accent)",
    "--rk-hover": "color-mix(in oklab, var(--rx-secondary) 12%, transparent)",
    "--rk-press": "color-mix(in oklab, var(--rx-secondary) 20%, transparent)",
    "--rk-line-strong": "var(--rk-control-edge)",
  },
});

for (const palette of svgPalettes) {
  globalStyle(`.rx-theme-choice[data-palette="${palette.id}"]`, {
    vars: {
      "--rx-chip-1": paletteColor(palette.light.canvas),
      "--rx-chip-2": paletteColor(palette.light.action),
      "--rx-chip-3": paletteColor(palette.light.secondary),
    },
  });
  for (const mode of ["light", "dark"] as const) {
    const prefix = mode === "dark" ? '.rd-app[data-direction="signal-dark"] ' : "";
    const host = `.rd-app:is([data-screen="svg"], [data-screen="typography"])${mode === "dark" ? '[data-direction="signal-dark"]' : ""}:has(.rx-lab[data-palette="${palette.id}"])`;
    globalStyle(`${prefix}.rx-lab[data-palette="${palette.id}"], ${host}`, {
      vars: svgPaletteVars(palette, mode),
    });
  }
}

globalStyle(".rx-theme-bar,\n.rx-theme-bar > fieldset", {
  display: "flex",
  gap: "8px",
  alignItems: "center",
});

globalStyle(".rx-theme-bar > fieldset", {
  border: "0",
  padding: "0",
  margin: "0",
  minWidth: "0",
});

globalStyle(".rx-theme-bar", {
  justifyContent: "space-between",
  paddingBottom: "18px",
  borderBottom: "1px solid var(--rk-line)",
});

globalStyle(".rx-theme-bar > span", {
  color: "var(--rk-text-3)",
  font: "8px var(--rk-font-mono)",
});

globalStyle(".rx-theme-choice", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 16px",
  color: "var(--rk-text)",
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: "12px",
  font: "13px var(--rk-font-sans)",
  textAlign: "left",
});

globalStyle('.rx-theme-choice[aria-pressed="true"]', {
  background: "var(--rx-surface-light)",
  borderColor: "var(--rx-edge)",
});

globalStyle('.rd-app[data-direction="signal-dark"] .rx-theme-choice[aria-pressed="true"]', {
  background: "var(--rx-surface-low)",
});

globalStyle(".rx-theme-choice small", {
  display: "block",
  color: "var(--rk-text-3)",
  fontSize: "9px",
  marginTop: "3px",
});

globalStyle(".rx-intro", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "4px 0",
});

globalStyle(".rx-intro > span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  whiteSpace: "nowrap",
  color: "var(--rk-accent-text)",
  font: "10px var(--rk-font-mono)",
  letterSpacing: "0.035em",
});

globalStyle(".rx-intro p", {
  maxWidth: "410px",
  color: "var(--rk-text-3)",
  fontSize: "11px",
  textAlign: "right",
});

globalStyle(".rx-workbench", {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 300px",
  gap: "22px",
  minWidth: "0",
});

globalStyle(".rx-stage", {
  background: "radial-gradient(ellipse at 10% 10%, var(--rx-wash), transparent 75%), var(--rx-stage)",
  position: "relative",
  border: "1px solid var(--rk-line)",
  borderRadius: "17px",
  padding: "18px 10px 12px",
  minWidth: "0",
  isolation: "isolate",
});

globalStyle(".rx-stage-caption,\n.rx-stage-bottom", {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  padding: "0 15px",
  font: "9px var(--rk-font-mono)",
  color: "var(--rk-text-3)",
});

globalStyle(".rx-stage-bottom", {
  paddingBlock: "4px",
});

globalStyle(".rx-stage-bottom > span:last-child", {
  fontSize: "8px",
});

globalStyle(".rx-hero", {
  minHeight: "366px",
  marginBlock: "12px",
});

globalStyle(".rx-hero .rk-svg-surface-content", {
  display: "flex",
  flexDirection: "column",
  gap: "26px",
  minHeight: "366px",
});

globalStyle(".rx-card-top", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  font: "9px var(--rk-font-mono)",
  color: "var(--rk-text-3)",
});

globalStyle(".rx-card-top > span", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

globalStyle(".rx-live", {
  fontSize: "8px",
});

globalStyle(".rx-live i", {
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  background: "var(--rk-success)",
});

globalStyle('.rx-live[data-active="false"] i', {
  background: "var(--rk-text-3)",
});

globalStyle(".rx-hero-middle", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
});

globalStyle(".rx-overline", {
  display: "block",
  font: "8px var(--rk-font-mono)",
  color: "var(--rk-text-3)",
  letterSpacing: "0.07em",
});

globalStyle(".rx-hero h2", {
  fontSize: "clamp(37px, 4cqw, 61px)",
  fontWeight: "350",
  lineHeight: "0.98",
  letterSpacing: "-0.06em",
  marginTop: "10px",
});

globalStyle(".rx-hero h2 em", {
  fontFamily: "Georgia, serif",
  fontWeight: "400",
  color: "var(--rk-accent-text)",
});

globalStyle(".rx-hero-middle p", {
  fontSize: "10px",
  color: "var(--rk-text-3)",
  marginTop: "14px",
});

globalStyle(".rx-orbit", {
  position: "relative",
  width: "134px",
  height: "134px",
  flexShrink: "0",
  color: "var(--rk-accent-text)",
});

globalStyle(".rx-orbit > svg", {
  width: "100%",
  height: "100%",
});

globalStyle(".rx-orbit > span", {
  position: "absolute",
  inset: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "34px",
  fontWeight: "300",
  letterSpacing: "-0.09em",
  color: "var(--rk-text)",
});

globalStyle(".rx-orbit > span > span", {
  alignSelf: "center",
  font: "8px var(--rk-font-mono)",
  marginLeft: "6px",
  marginTop: "-19px",
  color: "var(--rk-text-3)",
});

globalStyle(".rx-hero-footer", {
  display: "flex",
  alignItems: "center",
  gap: "22px",
  marginTop: "auto",
});

globalStyle(".rx-hero-footer > div", {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: "var(--rk-text-3)",
});

globalStyle(".rx-hero-footer strong", {
  color: "var(--rk-text)",
  fontSize: "18px",
  fontWeight: "350",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
});

globalStyle(".rx-hero-footer small", {
  fontSize: "9px",
  color: "var(--rk-text-3)",
});

globalStyle(".rx-hero-footer .rk-button", {
  marginLeft: "auto",
  fontSize: "10px",
});

globalStyle(".rx-controls", {
  padding: "15px 2px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  minWidth: "0",
});

globalStyle(".rx-controls-head", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "var(--rk-text-2)",
});

globalStyle(".rx-controls h2", {
  fontSize: "12px",
  fontWeight: "500",
});

globalStyle(".rx-controls .rk-slider-label,\n.rx-controls .rk-check-text", {
  fontSize: "11px",
});

globalStyle(".rx-engine-note", {
  borderTop: "1px solid var(--rk-line)",
  paddingTop: "16px",
  marginTop: "auto",
});

globalStyle(".rx-engine-note > span", {
  display: "block",
  font: "8px var(--rk-font-mono)",
  color: "var(--rk-accent-text)",
});

globalStyle(".rx-engine-note p", {
  fontSize: "10px",
  color: "var(--rk-text-3)",
  lineHeight: "1.7",
  marginTop: "8px",
});

globalStyle(".rx-gallery-head", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  marginTop: "4px",
});

globalStyle(".rx-gallery-head h2", {
  fontSize: "14px",
  fontWeight: "450",
  letterSpacing: "-0.02em",
});

globalStyle(".rx-gallery-head > span", {
  fontSize: "10px",
  color: "var(--rk-text-3)",
});

globalStyle(".rx-gallery", {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "8px 12px",
});

globalStyle(".rx-specimen", {
  appearance: "none",
  border: "0",
  background: "transparent",
  color: "var(--rk-text)",
  padding: "0",
  textAlign: "left",
  borderRadius: "28px",
  minWidth: "0",
  font: "inherit",
});

globalStyle(".rx-specimen:focus-visible", {
  outlineOffset: "-12px",
});

globalStyle('.rx-specimen[aria-pressed="true"] .rx-specimen-caption', {
  color: "var(--rk-accent-text)",
});

globalStyle(".rx-gallery-surface", {
  minHeight: "235px",
});

globalStyle(".rx-gallery-surface .rk-svg-surface-content", {
  display: "flex",
  flexDirection: "column",
  minHeight: "235px",
  gap: "15px",
});

globalStyle(".rx-specimen-caption", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  color: "var(--rk-text-3)",
  font: "8px var(--rk-font-mono)",
  letterSpacing: "0.03em",
});

globalStyle(".rx-specimen h3", {
  margin: "0",
  fontSize: "25px",
  lineHeight: "1.05",
  letterSpacing: "-0.04em",
  fontWeight: "350",
});

globalStyle(".rx-specimen p", {
  color: "var(--rk-text-2)",
  fontSize: "11px",
  lineHeight: "1.6",
  maxWidth: "300px",
});

globalStyle(".rx-specimen-bottom", {
  marginTop: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  font: "8px var(--rk-font-mono)",
  color: "var(--rk-text-3)",
});

globalStyle(".rx-material-line", {
  width: "76px",
  height: "3px",
  background: "repeating-linear-gradient(90deg, var(--rk-text-3) 0 2px, transparent 2px 5px)",
  opacity: "0.5",
  borderRadius: "4px",
});

globalStyle(".rx-in-context", {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 1fr)",
  gap: "20px",
  alignItems: "center",
  paddingTop: "20px",
  borderTop: "1px solid var(--rk-line)",
});

globalStyle(".rx-in-context > div:first-child", {
  paddingLeft: "6px",
});

globalStyle(".rx-in-context h2", {
  fontSize: "18px",
  fontWeight: "400",
  letterSpacing: "-0.025em",
  marginTop: "9px",
});

globalStyle(".rx-in-context p", {
  fontSize: "11px",
  color: "var(--rk-text-3)",
  lineHeight: "1.8",
  maxWidth: "320px",
  marginTop: "12px",
});

globalStyle(".rx-control-surface .rk-svg-surface-content", {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

globalStyle(".rx-inline-controls", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
});

globalStyle(".rx-inline-controls .rk-check-text", {
  fontSize: "10px",
});

globalStyle('.rd-app[data-direction]:is([data-screen="svg"], [data-screen="typography"])', {
  "@container": {
    "(max-width: 1100px)": {
      gridTemplateColumns: "58px minmax(0, 1fr)",
    },
  },
});

globalStyle(".rx-hero .rk-svg-surface-content", {
  "@container": {
    "(max-width: 1100px)": {},
  },
});

globalStyle(".rx-hero h2", {
  "@container": {
    "(max-width: 1100px)": {
      fontSize: "45px",
    },
  },
});

globalStyle(".rx-orbit", {
  "@container": {
    "(max-width: 1100px)": {
      width: "112px",
      height: "112px",
    },
  },
});

globalStyle(".rx-workbench", {
  "@container": {
    "(max-width: 1100px)": {
      gridTemplateColumns: "minmax(0, 1fr) 270px",
      gap: "16px",
    },
  },
});

globalStyle('.rd-app[data-direction]:is([data-screen="svg"], [data-screen="typography"])', {
  "@container": {
    "(max-width: 780px)": {
      gridTemplateColumns: "54px minmax(0, 1fr)",
      gridTemplateRows: "55px 1fr 31px",
      gridTemplateAreas: '"top top" "side main" "status status"',
    },
  },
});

globalStyle(".rx-workbench", {
  "@container": {
    "(max-width: 780px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

globalStyle(".rx-controls", {
  "@container": {
    "(max-width: 780px)": {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "22px",
      padding: "10px 6px",
    },
  },
});

globalStyle(".rx-controls-head,\n  .rx-engine-note", {
  "@container": {
    "(max-width: 780px)": {
      gridColumn: "1 / -1",
    },
  },
});

globalStyle(".rx-intro", {
  "@container": {
    "(max-width: 780px)": {
      alignItems: "flex-start",
      flexDirection: "column",
      gap: "10px",
    },
  },
});

globalStyle(".rx-intro p", {
  "@container": {
    "(max-width: 780px)": {
      textAlign: "left",
    },
  },
});

globalStyle(".rx-gallery-surface .rk-svg-surface-content", {
  "@container": {
    "(max-width: 780px)": {},
  },
});

globalStyle(".rx-specimen h3", {
  "@container": {
    "(max-width: 780px)": {
      fontSize: "22px",
    },
  },
});

globalStyle(".rx-in-context", {
  "@container": {
    "(max-width: 780px)": {
      gridTemplateColumns: "1fr",
      gap: "12px",
    },
  },
});

globalStyle('.rd-app[data-direction]:is([data-screen="svg"], [data-screen="typography"])', {
  "@media": {
    "(max-width: 600px)": {
      gridTemplateColumns: "minmax(0, 1fr)",
      gridTemplateRows: "50px auto 1fr 31px",
      gridTemplateAreas: '"top" "side" "main" "status"',
    },
  },
});

globalStyle('.rd-app .rd-sidebar button[title="Material lab"]', {
  "@media": {
    "(max-width: 600px)": {
      flex: "0 0 30px",
    },
  },
});

globalStyle(".rd-lab .rd-view-picker, .rd-lab .rd-sidebar nav", {
  "@media": { "(max-width: 600px)": { flexWrap: "wrap" } },
});

globalStyle(".rd-lab-toolbar, .rd-view-picker", { flexWrap: "wrap" });
globalStyle(".rd-view-picker button", { whiteSpace: "nowrap" });
globalStyle(".rd-lab-options", { flexShrink: 0, flexWrap: "wrap" });

globalStyle('.rd-app .rd-sidebar button[title="Material lab"] > span', {
  "@media": {
    "(max-width: 600px)": {
      display: "none",
    },
  },
});

globalStyle(".rx-theme-bar > span", {
  "@media": {
    "(max-width: 600px)": {
      display: "none",
    },
  },
});

globalStyle(".rx-theme-bar > fieldset", {
  "@media": {
    "(max-width: 600px)": {
      width: "100%",
    },
  },
});

globalStyle(".rx-theme-choice", {
  "@media": {
    "(max-width: 600px)": {
      flex: "1",
      padding: "9px",
      gap: "7px",
    },
  },
});

globalStyle(".rx-theme-choice small", {
  "@media": {
    "(max-width: 600px)": {
      fontSize: "8px",
    },
  },
});

globalStyle(".rx-theme-choice i", {
  "@media": {
    "(max-width: 600px)": {
      width: "15px",
      height: "15px",
      flexShrink: "0",
    },
  },
});

globalStyle(".rx-lab", {
  "@media": {
    "(max-width: 600px)": {
      gap: "18px",
    },
  },
});

globalStyle(".rx-stage", {
  "@media": {
    "(max-width: 600px)": {
      padding: "15px 0 12px",
    },
  },
});

globalStyle(".rx-stage-caption,\n  .rx-stage-bottom", {
  "@media": {
    "(max-width: 600px)": {
      paddingInline: "12px",
      fontSize: "8px",
    },
  },
});

globalStyle(".rx-stage-caption > span:last-child,\n  .rx-stage-bottom > span:last-child", {
  "@media": {
    "(max-width: 600px)": {
      display: "none",
    },
  },
});

globalStyle(".rx-hero", {
  "@media": {
    "(max-width: 600px)": {
      marginTop: "8px",
      minHeight: "354px",
    },
  },
});

globalStyle(".rx-hero .rk-svg-surface-content", {
  "@media": {
    "(max-width: 600px)": {
      minHeight: "354px",
      gap: "22px",
    },
  },
});

globalStyle(".rx-card-top", {
  "@media": {
    "(max-width: 600px)": {
      fontSize: "8px",
      gap: "6px",
    },
  },
});

globalStyle(".rx-card-top > span > svg", {
  "@media": {
    "(max-width: 600px)": {
      display: "none",
    },
  },
});

globalStyle(".rx-hero h2", {
  "@media": {
    "(max-width: 600px)": {
      fontSize: "45px",
    },
  },
});

globalStyle(".rx-hero-middle", {
  "@media": {
    "(max-width: 600px)": {
      position: "relative",
    },
  },
});

globalStyle(".rx-orbit", {
  "@media": {
    "(max-width: 600px)": {
      position: "absolute",
      width: "87px",
      height: "87px",
      right: "-4px",
      top: "38px",
      opacity: "0.3",
    },
  },
});

globalStyle(".rx-orbit > span", {
  "@media": {
    "(max-width: 600px)": {
      display: "none",
    },
  },
});

globalStyle(".rx-hero-footer", {
  "@media": {
    "(max-width: 600px)": {
      flexWrap: "wrap",
      gap: "9px 16px",
    },
  },
});

globalStyle(".rx-hero-footer .rk-button", {
  "@media": {
    "(max-width: 600px)": {
      width: "100%",
      marginLeft: "0",
    },
  },
});

globalStyle(".rx-hero-footer strong", {
  "@media": {
    "(max-width: 600px)": {
      fontSize: "17px",
    },
  },
});

globalStyle(".rx-gallery", {
  "@media": {
    "(max-width: 600px)": {
      gridTemplateColumns: "1fr",
      gap: "4px",
    },
  },
});

globalStyle(".rx-gallery-head", {
  "@media": {
    "(max-width: 600px)": {
      alignItems: "flex-start",
      flexDirection: "column",
      gap: "6px",
    },
  },
});

globalStyle(".rx-gallery-head h2", {
  "@media": {
    "(max-width: 600px)": {
      fontSize: "13px",
    },
  },
});

globalStyle(".rx-controls", {
  "@media": {
    "(max-width: 600px)": {
      gap: "22px 15px",
    },
  },
});

globalStyle(".rx-controls h2", {
  "@media": {
    "(max-width: 600px)": {
      fontSize: "12px",
    },
  },
});

globalStyle(".rx-controls .rk-slider-label", {
  "@media": {
    "(max-width: 600px)": {
      fontSize: "10px",
    },
  },
});

globalStyle(".rx-controls .rk-check-text", {
  "@media": {
    "(max-width: 600px)": {
      fontSize: "10px",
    },
  },
});

globalStyle(".rx-control-surface .rk-svg-surface-content", {
  "@media": {
    "(max-width: 600px)": {},
  },
});

globalStyle(".rx-workbench", { alignItems: "start" });
globalStyle(".rx-controls", {
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: "18px 14px",
});
globalStyle(".rx-controls-head, .rx-engine-note", { gridColumn: "1 / -1" });

globalStyle(".rx-theme-bar", { display: "block" });
globalStyle(".rx-theme-bar > fieldset", {
  display: "grid",
  gridTemplateColumns: "repeat(3,minmax(0,1fr))",
  gap: "8px",
  "@media": { "(max-width: 600px)": { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
});
globalStyle(".rx-theme-bar > span", { display: "block", marginTop: "12px", textAlign: "right" });
globalStyle(".rx-theme-choice", { minWidth: 0, padding: "12px", cursor: "pointer", gap: "8px" });
globalStyle(".rx-theme-choice > span:last-child", { minWidth: 0 });
globalStyle(".rx-theme-choice small", { lineHeight: 1.5 });
globalStyle(".rx-theme-chips", { display: "flex", flexShrink: 0, width: "30px" });
globalStyle(".rx-theme-chips i", {
  width: "13px",
  height: "26px",
  borderRadius: "8px",
  marginRight: "-4px",
  border: "1px solid var(--rx-surface-light)",
  background: "var(--rx-chip-1)",
});
globalStyle(".rx-theme-chips i:nth-child(2)", { background: "var(--rx-chip-2)" });
globalStyle(".rx-theme-chips i:nth-child(3)", { background: "var(--rx-chip-3)" });
globalStyle(".rx-color-study", {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "22px 24px",
  border: "1px solid var(--rk-line)",
  borderRadius: "16px",
  background: "var(--rx-surface-light)",
});
globalStyle(".rx-color-study h2", {
  marginBlock: "8px",
  fontSize: "23px",
  fontWeight: 350,
  letterSpacing: "-.04em",
});
globalStyle(".rx-color-study p", { fontSize: "10px", color: "var(--rk-text-3)" });
globalStyle(".rx-color-roles", { display: "flex", gap: "6px", flex: "1 1 240px", maxWidth: "440px" });
globalStyle(".rx-color-roles > div", {
  flex: 1,
  minWidth: 0,
  font: "8px var(--rk-font-mono)",
  color: "var(--rk-text-2)",
});
globalStyle(".rx-color-roles i", {
  display: "block",
  height: "34px",
  marginBottom: "8px",
  borderRadius: "6px",
  border: "1px solid var(--rk-line)",
});
globalStyle('.rx-color-roles [data-role="ink"] i', { background: "var(--rk-accent)" });
globalStyle('.rx-color-roles [data-role="secondary"] i', { background: "var(--rx-secondary)" });
globalStyle('.rx-color-roles [data-role="detail"] i', { background: "var(--rx-detail)" });
globalStyle('.rx-color-roles [data-role="paper"] i', { background: "var(--rx-surface-low)" });
globalStyle('.rx-color-roles [data-role="graphite"] i', { background: "var(--rk-text)" });
globalStyle(".rx-control-gallery", {
  display: "grid",
  gridTemplateColumns: "repeat(4,minmax(0,1fr))",
  gap: "12px",
  "@container": { "(max-width: 1100px)": { gridTemplateColumns: "repeat(2,minmax(0,1fr))" } },
  "@media": { "(max-width: 600px)": { gridTemplateColumns: "minmax(0,1fr)" } },
});
globalStyle(".rx-control-specimen", {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  minWidth: 0,
  padding: "22px 18px 16px",
  border: "1px solid var(--rk-line)",
  borderRadius: "16px",
  background: "var(--rx-surface-light)",
});
globalStyle(".rx-control-caption, .rx-control-detail", {
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  color: "var(--rk-text-3)",
  font: "8px var(--rk-font-mono)",
});
globalStyle(".rx-control-caption > span:first-child", { color: "var(--rk-accent-text)" });
globalStyle(".rx-control-actions", { display: "flex", alignItems: "center", gap: "8px" });
globalStyle(".rx-control-actions > .rx-secondary-action", {
  marginRight: "auto",
  vars: {
    "--rk-btn-bg": "color-mix(in oklab,var(--rx-secondary) 13%,var(--rx-surface-light))",
    "--rk-btn-fg": "var(--rx-secondary)",
    "--rk-btn-edge": "color-mix(in oklab,var(--rx-secondary) 48%,var(--rx-surface-low))",
  },
});
globalStyle(".rx-control-detail", {
  borderTop: "1px solid var(--rk-line)",
  paddingTop: "14px",
  color: "var(--rk-text-3)",
});
globalStyle(".rx-control-states", {
  display: "flex",
  flexWrap: "wrap",
  gap: "18px 12px",
  alignItems: "center",
  padding: "22px",
  border: "1px solid var(--rk-line)",
  borderRadius: "16px",
});
globalStyle(".rx-control-states > .rx-overline", { flexBasis: "100%" });
globalStyle(".rx-control-states > .rk-field", { flex: "1 1 190px" });
globalStyle(".rx-orbit .rk-svg-artwork svg > :nth-child(3n+2)", { stroke: "var(--rx-secondary)" });
globalStyle(".rx-orbit .rk-svg-artwork svg > :nth-child(3n+3)", { stroke: "var(--rx-detail)" });
globalStyle(".rx-hero-footer > div:first-child > svg", { color: "var(--rx-secondary)" });
globalStyle(".rx-hero-footer > div:nth-child(2) > svg", { color: "var(--rx-detail)" });

globalStyle(".rx-lab .rk-field-error", { color: "var(--rk-danger)" });
globalStyle(".rx-lab .rk-input[data-invalid]", { vars: { "--rk-ctl-edge": "var(--rk-danger)" } });

globalStyle(
  ".rx-lab .rk-button[data-svg-border]:focus-visible, .rx-lab .rk-input[data-svg-border]:has(:focus-visible)",
  {
    outline: "none",
    "@media": { "(forced-colors: active)": { outline: "2px solid var(--rk-focus)", outlineOffset: "-2px" } },
  },
);
globalStyle(".rx-lab .rx-theme-choice:focus-visible, .rx-lab .rx-artwork-choice:focus-visible", {
  outline: "none",
  borderColor: "var(--rk-focus)",
  boxShadow: "inset 0 0 0 1px var(--rk-focus), 0 2px 5px oklch(var(--rk-shade) / 0.12)",
});
globalStyle(".rx-lab .rx-specimen:focus-visible", { outline: "none" });
globalStyle('.rx-specimen[aria-pressed="true"] .rk-svg-surface-rim', {
  stroke: "var(--rk-accent-text)",
  strokeWidth: 1.5,
});
globalStyle(".rx-specimen:focus-visible .rk-svg-surface-rim", { stroke: "var(--rk-focus)", strokeWidth: 3 });
