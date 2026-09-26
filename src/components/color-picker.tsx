import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { useLatest } from "../lib/hooks";
import { PipetteIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { IconButton } from "./button";
import { ColorSwatches } from "./choice";
import { Input } from "./input";

/** OKLCH color: lightness 0–1, chroma ≥ 0, hue in degrees, alpha 0–1. */
export interface Oklch {
  l: number;
  c: number;
  h: number;
  alpha: number;
}

type Rgb = [number, number, number];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number, digits: number) => Number(n.toFixed(digits));
const toLinear = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const toGamma = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);

/** OKLCH → linear sRGB (Björn Ottosson's OKLab matrices); values outside 0–1 are out of gamut. */
export function oklchToLinearRgb({ l, c, h }: Pick<Oklch, "l" | "c" | "h">): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

/** sRGB channels 0–1 → OKLCH (hue 0 for greys). */
export function rgbToOklch([r, g, b]: Rgb, alpha = 1): Oklch {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const c = Math.hypot(A, B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h, alpha };
}

export function inSrgbGamut(color: Pick<Oklch, "l" | "c" | "h">, eps = 1e-4): boolean {
  return oklchToLinearRgb(color).every((x) => x >= -eps && x <= 1 + eps);
}

/** #rrggbb (gamut-clipped). */
export function oklchToHex(color: Pick<Oklch, "l" | "c" | "h">): string {
  return `#${oklchToLinearRgb(color)
    .map((x) =>
      Math.round(clamp(toGamma(clamp(x, 0, 1)), 0, 1) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** `oklch(0.57 0.2 277)`, with ` / 0.5` when translucent. */
export function formatOklch({ l, c, h, alpha }: Oklch): string {
  const base = `${round(l, 3)} ${round(c, 3)} ${round(c < 1e-4 ? 0 : h, 1)}`;
  return alpha < 1 ? `oklch(${base} / ${round(alpha, 2)})` : `oklch(${base})`;
}

const NUM = String.raw`(-?[\d.]+%?)`;
const OKLCH_RE = new RegExp(
  String.raw`^oklch\(\s*${NUM}\s+${NUM}\s+${NUM}(?:deg)?\s*(?:\/\s*${NUM}\s*)?\)$`,
  "i",
);
const HEX_RE = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const RGB_RE = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i;

const fraction = (text: string, scale = 1) =>
  text.endsWith("%") ? Number.parseFloat(text) / 100 : Number.parseFloat(text) / scale;

/** Parse `oklch(…)`, `#rgb[a]`, `#rrggbb[aa]` or `rgb[a](…)`; null when it isn't one of those. */
export function parseColor(text: string): Oklch | null {
  const t = text.trim();
  const ok = OKLCH_RE.exec(t);
  if (ok) {
    const [, L = "0", C = "0", H = "0", A] = ok;
    // chroma percentages are relative to 0.4 (CSS Color 4)
    const c = C.endsWith("%") ? (Number.parseFloat(C) / 100) * 0.4 : Number.parseFloat(C);
    return {
      l: clamp(fraction(L), 0, 1),
      c: Math.max(0, c),
      h: ((Number.parseFloat(H) % 360) + 360) % 360,
      alpha: A ? clamp(fraction(A), 0, 1) : 1,
    };
  }
  const hex = HEX_RE.exec(t)?.[1];
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((d) => d + d).join("") : hex;
    const byte = (i: number) => Number.parseInt(full.slice(i, i + 2), 16) / 255;
    return rgbToOklch([byte(0), byte(2), byte(4)], full.length === 8 ? byte(6) : 1);
  }
  const rgb = RGB_RE.exec(t);
  if (rgb) {
    const [, r = "0", g = "0", b = "0", a] = rgb;
    return rgbToOklch([Number(r) / 255, Number(g) / 255, Number(b) / 255], a ? clamp(fraction(a), 0, 1) : 1);
  }
  return null;
}

export interface ColorPickerProps {
  /** Any color parseColor understands; changes are emitted as `oklch(…)`. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, color: Oklch) => void;
  /** Alpha slider and `/ a` in the output. */
  alpha?: boolean;
  /** Preset swatches under the sliders. */
  swatches?: ReadonlyArray<{ value: string; label: string }>;
  /** Right edge of the chroma axis (0.37 covers Display P3). */
  maxChroma?: number;
  className?: string;
  style?: CSSProperties;
}

const AREA_W = 240;
const AREA_H = 160;

interface EyeDropperResult {
  sRGBHex: string;
}
type EyeDropperCtor = new () => { open: () => Promise<EyeDropperResult> };

/**
 * OKLCH color picker: a lightness × chroma area for the current hue (the part outside sRGB is hatched,
 * the kit's "rest" texture), hue and alpha sliders, a text field that takes oklch / hex / rgb, preset
 * swatches and the EyeDropper API where the browser has it.
 */
export function ColorPicker({
  value,
  defaultValue = "oklch(0.57 0.2 277)",
  onChange,
  alpha = false,
  swatches,
  maxChroma = 0.37,
  className,
  style,
}: ColorPickerProps) {
  const labels = useLabels();
  const [color, setColor] = useState<Oklch>(
    () => parseColor(value ?? defaultValue) ?? { l: 0.57, c: 0.2, h: 277, alpha: 1 },
  );
  const emitted = useRef<string | undefined>(value);
  const [text, setText] = useState(() => formatOklch(color));
  const canvas = useRef<HTMLCanvasElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const latestColor = useLatest(color);

  // follow an outside value, but keep our hue when it is a grey (hue is undefined at zero chroma)
  useEffect(() => {
    if (value === undefined || value === emitted.current) return;
    const parsed = parseColor(value);
    if (!parsed) return;
    const next = parsed.c < 1e-4 ? { ...parsed, h: latestColor.current.h } : parsed;
    emitted.current = value;
    setColor(next);
    setText(formatOklch(next));
  }, [value, latestColor]);

  const update = (patch: Partial<Oklch>) => {
    const next = { ...latestColor.current, ...patch };
    if (!alpha) next.alpha = 1;
    latestColor.current = next;
    setColor(next);
    const out = formatOklch(next);
    setText(out);
    emitted.current = out;
    onChange?.(out, next);
  };

  // the area: every pixel at this hue; out-of-gamut pixels stay transparent so the hatch shows through
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(AREA_W, AREA_H);
    for (let y = 0; y < AREA_H; y++) {
      const l = 1 - y / (AREA_H - 1);
      for (let x = 0; x < AREA_W; x++) {
        const c = (x / (AREA_W - 1)) * maxChroma;
        const rgb = oklchToLinearRgb({ l, c, h: color.h });
        // tight tolerance: near black every channel is tiny, so a loose one lets out-of-gamut pixels through
        if (!rgb.every((v) => v >= -1e-7 && v <= 1 + 1e-7)) continue;
        const i = (y * AREA_W + x) * 4;
        img.data[i] = Math.round(toGamma(clamp(rgb[0], 0, 1)) * 255);
        img.data[i + 1] = Math.round(toGamma(clamp(rgb[1], 0, 1)) * 255);
        img.data[i + 2] = Math.round(toGamma(clamp(rgb[2], 0, 1)) * 255);
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [color.h, maxChroma]);

  const pickAt = (clientX: number, clientY: number) => {
    const r = area.current?.getBoundingClientRect();
    if (!r) return;
    update({
      c: clamp((clientX - r.left) / r.width, 0, 1) * maxChroma,
      l: 1 - clamp((clientY - r.top) / r.height, 0, 1),
    });
  };
  const onAreaKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const k = event.shiftKey ? 10 : 1;
    const { l, c } = latestColor.current;
    const moves: Record<string, Partial<Oklch>> = {
      ArrowUp: { l: clamp(l + 0.01 * k, 0, 1) },
      ArrowDown: { l: clamp(l - 0.01 * k, 0, 1) },
      ArrowRight: { c: clamp(c + 0.005 * k, 0, maxChroma) },
      ArrowLeft: { c: clamp(c - 0.005 * k, 0, maxChroma) },
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    update(move);
  };

  const Dropper = (globalThis as { EyeDropper?: EyeDropperCtor }).EyeDropper;
  const pickFromScreen = async () => {
    if (!Dropper) return;
    try {
      const { sRGBHex } = await new Dropper().open();
      const parsed = parseColor(sRGBHex);
      if (parsed) update({ ...parsed, alpha: latestColor.current.alpha });
    } catch {
      // the user pressed Esc
    }
  };

  // only typed text commits: a blur caused by clicking the area must not re-apply the old text
  const edited = useRef(false);
  const commitText = () => {
    if (!edited.current) return;
    edited.current = false;
    const parsed = parseColor(text);
    if (parsed) update(parsed.c < 1e-4 ? { ...parsed, h: color.h } : parsed);
    else setText(formatOklch(color));
  };

  const css = formatOklch(color);
  const opaque = formatOklch({ ...color, alpha: 1 });
  const outside = !inSrgbGamut(color);
  const hueStops = Array.from(
    { length: 13 },
    (_, i) => `oklch(${round(color.l, 3)} ${round(Math.min(color.c, 0.2), 3)} ${i * 30})`,
  ).join(", ");

  return (
    <div
      className={cx("rk-color-picker", className)}
      style={
        {
          ...style,
          "--rk-cp-color": css,
          "--rk-cp-opaque": opaque,
          "--rk-cp-hues": hueStops,
        } as CSSProperties
      }
    >
      <div
        ref={area}
        className="rk-cp-area"
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          pickAt(event.clientX, event.clientY);
          event.currentTarget.querySelector<HTMLElement>(".rk-cp-thumb")?.focus({ preventScroll: true });
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) pickAt(event.clientX, event.clientY);
        }}
      >
        <canvas ref={canvas} width={AREA_W} height={AREA_H} className="rk-cp-canvas" />
        <div
          role="slider"
          tabIndex={0}
          aria-label={labels.colorArea}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(color.l * 100)}
          aria-valuetext={`L ${Math.round(color.l * 100)}%, C ${round(color.c, 3)}`}
          className="rk-cp-thumb"
          data-outside={outside || undefined}
          style={{ left: `${(color.c / maxChroma) * 100}%`, top: `${(1 - color.l) * 100}%` }}
          onKeyDown={onAreaKey}
        />
      </div>

      <div className="rk-cp-row">
        <span className="rk-cp-preview" aria-hidden="true" />
        <div className="rk-cp-sliders">
          <input
            type="range"
            className="rk-cp-slider"
            data-kind="hue"
            aria-label={labels.hue}
            min={0}
            max={360}
            step={1}
            value={Math.round(color.h)}
            onChange={(e) => update({ h: Number(e.target.value) })}
          />
          {alpha && (
            <input
              type="range"
              className="rk-cp-slider"
              data-kind="alpha"
              aria-label={labels.opacity}
              min={0}
              max={1}
              step={0.01}
              value={color.alpha}
              onChange={(e) => update({ alpha: Number(e.target.value) })}
            />
          )}
        </div>
      </div>

      <div className="rk-cp-row">
        <Input
          size="sm"
          mono
          className="rk-cp-text"
          value={text}
          invalid={parseColor(text) === null}
          aria-label={labels.customColor}
          onChange={(e) => {
            edited.current = true;
            setText(e.target.value);
          }}
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitText();
          }}
        />
        {Dropper && (
          <IconButton
            size="sm"
            variant="secondary"
            icon={<PipetteIcon />}
            label={labels.pickFromScreen}
            onClick={pickFromScreen}
          />
        )}
      </div>

      {swatches && (
        <ColorSwatches
          options={swatches}
          value={swatches.find((s) => formatOklch(parseColor(s.value) ?? color) === css)?.value ?? ""}
          onChange={(v) => {
            const parsed = parseColor(v);
            if (parsed) update(parsed);
          }}
        />
      )}
    </div>
  );
}
