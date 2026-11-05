import { type SIGNAL_PALETTES, signalPaletteVars } from "../theme/palettes";

export {
  paletteColor,
  SIGNAL_PALETTES as svgPalettes,
  type SignalPaletteId as SvgPaletteId,
} from "../theme/palettes";

export function svgPaletteVars(
  palette: (typeof SIGNAL_PALETTES)[number],
  mode: "light" | "dark",
): Record<string, string> {
  const vars = signalPaletteVars(palette, mode);
  return {
    ...vars,
    "--rx-secondary": vars["--rk-secondary"] ?? "",
    "--rx-detail": vars["--rk-detail"] ?? "",
    "--rx-shadow": vars["--rk-svg-shadow"] ?? "",
    "--rx-surface-light": vars["--rk-svg-fill"] ?? "",
    "--rx-surface-low": vars["--rk-svg-fill-low"] ?? "",
    "--rx-edge-top": vars["--rk-svg-edge-top"] ?? "",
    "--rx-edge-bottom": vars["--rk-svg-edge"] ?? "",
    "--rx-edge": vars["--rk-material-edge"] ?? "",
    "--rx-stage": vars["--rk-stage"] ?? "",
    "--rx-wash": vars["--rk-wash"] ?? "",
    "--rd-relief-dark": vars["--rk-relief-shadow"] ?? "",
    "--rd-relief-light": vars["--rk-relief-light"] ?? "",
  };
}
