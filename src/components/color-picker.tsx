import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { formatOklch, inSrgbGamut, type Oklch, oklchToLinearRgb, parseColor, toGamma } from "../lib/color";
import { cx } from "../lib/cx";
import { useLatest } from "../lib/hooks";
import { PipetteIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { IconButton } from "./button";
import { ColorSwatches } from "./choice";
import { Input } from "./input";

export {
  formatOklch,
  inSrgbGamut,
  type Oklch,
  oklchToHex,
  oklchToLinearRgb,
  parseColor,
  rgbToOklch,
} from "../lib/color";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number, digits: number) => Number(n.toFixed(digits));
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
