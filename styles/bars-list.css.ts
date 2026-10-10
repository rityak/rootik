import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-bars", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  margin: "0",
  padding: "0",
  listStyle: "none",
  fontSize: `${tokens.textSm}`,
  vars: { "--rk-bars-h": "26px" },
});

globalStyle(".rk-bars-row,\n.rk-bars-button", {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  columnGap: `calc(${tokens.space} * 3)`,
});

globalStyle("[data-percent] :is(.rk-bars-row,\n.rk-bars-button)", {
  gridTemplateColumns: "minmax(0, 1fr) auto 6ch",
});

globalStyle(".rk-bars-button", {
  gridColumn: "1 / -1",
  width: "100%",
  padding: "0",
  border: "0",
  borderRadius: `calc(${tokens.radiusControl} - 2px)`,
  background: "none",
  color: "inherit",
  font: "inherit",
  textAlign: "start",
  cursor: "pointer",
});

globalStyle(".rk-bars-button:hover .rk-bars-fill", { filter: "brightness(1.15)" });

globalStyle(".rk-bars-row:has(> .rk-bars-button)", { display: "block" });

globalStyle(".rk-bars-track", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  height: "var(--rk-bars-h)",
  minWidth: "0",
  borderRadius: `calc(${tokens.radiusControl} - 2px)`,
  background: `${tokens.hatch}`,
  overflow: "hidden",
});

globalStyle(".rk-bars-fill", {
  position: "absolute",
  inset: "0 auto 0 0",
  width: "calc(var(--rk-bar) * 100%)",
  borderRadius: "inherit",
  background: `color-mix(in oklab, ${tokens.chart1} 42%, ${tokens.surface2})`,
  transition: `width ${tokens.durSlow} ${tokens.easeOut}`,
});

globalStyle("[data-highlight] .rk-bars-fill", {
  background: `color-mix(in oklab, ${tokens.accent} 70%, ${tokens.surface2})`,
});

globalStyle("[data-other] .rk-bars-fill", { background: `${tokens.chartIdle}` });

globalStyle(".rk-bars-name", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  minWidth: "0",
  paddingInline: `calc(${tokens.space} * 2.5)`,
  color: `${tokens.text}`,
});

globalStyle(".rk-bars-name .rk-icon", { color: `${tokens.text2}` });

globalStyle(".rk-bars-value", { color: `${tokens.text}`, textAlign: "end" });

globalStyle(".rk-bars-pct", { color: `${tokens.text3}`, fontSize: `${tokens.textXs}`, textAlign: "end" });
