import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-hover-card", {
  width: "max-content",
  maxWidth: "min(340px, var(--rk-floating-max-w, calc(100dvw - 16px)))",
  padding: `calc(${tokens.space} * 3)`,
  borderRadius: `${tokens.radiusLg}`,
  background: `${tokens.glassBg}`,
  backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
  boxShadow: `${tokens.shadowPop}`,
  fontSize: `${tokens.textSm}`,
});

globalStyle(".rk-hover-card", { overflowWrap: "anywhere", overflow: "auto", overscrollBehavior: "contain" });
