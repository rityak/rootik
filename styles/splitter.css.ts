import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-splitter", { display: "grid", minWidth: "0", minHeight: "0" });

globalStyle('.rk-splitter[data-orientation="horizontal"]', {
  gridTemplateColumns: "minmax(0, var(--rk-split)) auto minmax(0, 1fr)",
});

globalStyle('.rk-splitter[data-orientation="vertical"]', {
  gridTemplateRows: "minmax(0, var(--rk-split)) auto minmax(0, 1fr)",
});

globalStyle(".rk-splitter[data-dragging]", { userSelect: "none" });

globalStyle(".rk-splitter[data-dragging] .rk-splitter-pane", { pointerEvents: "none" });

globalStyle(".rk-splitter-pane", { minWidth: "0", minHeight: "0", overflow: "auto" });

globalStyle(".rk-splitter-handle", {
  position: "relative",
  zIndex: "1",
  background: `${tokens.line}`,
  touchAction: "none",
  outline: "none",
});

globalStyle(".rk-splitter-handle::before", { content: '""', position: "absolute" });

globalStyle(".rk-splitter-handle::after", {
  content: '""',
  position: "absolute",
  borderRadius: `calc(2px * ${tokens.roundness})`,
  background: `${tokens.accent}`,
  opacity: "0",
  transition: `opacity ${tokens.dur} ${tokens.ease}`,
});

globalStyle(
  ".rk-splitter-handle:is(:hover, :focus-visible, :active)::after, [data-dragging] > .rk-splitter-handle::after",
  { opacity: "0.85" },
);

globalStyle('[data-orientation="horizontal"] > .rk-splitter-handle', { width: "1px", cursor: "col-resize" });

globalStyle('[data-orientation="horizontal"] > .rk-splitter-handle::before', { inset: "0 -4px" });

globalStyle('[data-orientation="horizontal"] > .rk-splitter-handle::after', { inset: "0 -1px" });

globalStyle('[data-orientation="vertical"] > .rk-splitter-handle', { height: "1px", cursor: "row-resize" });

globalStyle('[data-orientation="vertical"] > .rk-splitter-handle::before', { inset: "-4px 0" });

globalStyle('[data-orientation="vertical"] > .rk-splitter-handle::after', { inset: "-1px 0" });
