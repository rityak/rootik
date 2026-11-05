import { type HTMLAttributes, type ReactNode, useState } from "react";
import type { Tone } from "../feedback/progress";
import { cx } from "../lib/cx";

export { Badge, type BadgeProps, StatusDot, type StatusDotProps } from "../feedback/status";

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const KEY_NAMES: Record<string, string> = IS_MAC
  ? { mod: "⌘", ctrl: "⌃", alt: "⌥", shift: "⇧", enter: "↵", backspace: "⌫", escape: "Esc" }
  : {
      mod: "Ctrl",
      ctrl: "Ctrl",
      alt: "Alt",
      shift: "Shift",
      enter: "Enter",
      backspace: "Backspace",
      escape: "Esc",
    };

/** Human label for a combo like "mod+k" — ⌘K on macOS, Ctrl+K elsewhere. */
export function formatShortcut(combo: string): string {
  return combo
    .split("+")
    .map((k) => KEY_NAMES[k.toLowerCase()] ?? (k.length === 1 ? k.toUpperCase() : k))
    .join(IS_MAC ? "" : "+");
}

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Combo string ("mod+shift+p"); alternatively pass children. */
  keys?: string;
  size?: "sm" | "md";
}

export function Kbd({ keys, size = "md", className, children, ...rest }: KbdProps) {
  return (
    <kbd {...rest} className={cx("rk-kbd", className)} data-size={size}>
      {keys ? formatShortcut(keys) : children}
    </kbd>
  );
}

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  name?: string;
  src?: string;
  size?: number;
  square?: boolean;
} & (
    | { status?: undefined; statusLabel?: undefined }
    | {
        /** Presence mark; its shape differs per tone (dot, half, minus, ring), not just its color. */
        status: Tone;
        /** Spoken presence ("Online", "Away"), appended to the accessible name. */
        statusLabel: string;
      }
  );

const WHITESPACE = /\s+/;

/** Image or initials; the initials background hue is derived from the name, so it's stable. */
export function Avatar({
  name = "",
  src,
  size = 32,
  square,
  status,
  statusLabel,
  className,
  style,
  ...rest
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const initials = name
    .split(WHITESPACE)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  let hue = 0;
  for (const ch of name) hue = (hue * 31 + ch.charCodeAt(0)) % 360;
  return (
    <span
      role="img"
      aria-label={[name, statusLabel].filter(Boolean).join(", ") || undefined}
      {...rest}
      className={cx("rk-avatar", className)}
      data-square={square || undefined}
      style={
        {
          width: size,
          height: size,
          fontSize: Math.max(11, size * 0.38),
          "--rk-avatar-h": hue,
          ...style,
        } as React.CSSProperties
      }
    >
      {src && src !== failedSrc ? <img src={src} alt="" onError={() => setFailedSrc(src)} /> : initials}
      {status && <span className="rk-avatar-status" data-tone={status} title={statusLabel} />}
    </span>
  );
}

export function AvatarGroup({
  children,
  max,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode[]; max?: number }) {
  const shown = max === undefined ? children : children.slice(0, Math.max(0, max));
  const extra = children.length - shown.length;
  return (
    <div {...rest} className={cx("rk-avatar-group", className)}>
      {shown}
      {extra > 0 && <span className="rk-avatar rk-avatar-more">+{extra}</span>}
    </div>
  );
}
