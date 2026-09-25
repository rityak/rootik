import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { XIcon } from "../lib/icons";
import type { Tone } from "./progress";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: "soft" | "solid" | "outline";
  size?: "sm" | "md";
  icon?: ReactNode;
  /** Leading status dot. */
  dot?: boolean;
  /** Makes it a removable tag. */
  onRemove?: () => void;
  removeLabel?: string;
}

export function Badge({
  tone = "neutral",
  variant = "soft",
  size = "md",
  icon,
  dot,
  onRemove,
  removeLabel = "Remove",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={cx("rk-badge", className)}
      data-tone={tone}
      data-variant={variant}
      data-size={size}
    >
      {dot && <span className="rk-badge-dot" />}
      {icon && <span className="rk-icon">{icon}</span>}
      {children}
      {onRemove && (
        <button type="button" className="rk-badge-remove" aria-label={removeLabel} onClick={onRemove}>
          <XIcon />
        </button>
      )}
    </span>
  );
}

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** Animated halo: live / connecting. */
  pulse?: boolean;
  label?: ReactNode;
}

export function StatusDot({ tone = "success", pulse, label, className, ...rest }: StatusDotProps) {
  return (
    <span {...rest} className={cx("rk-status", className)} data-tone={tone}>
      <span
        className="rk-status-dot"
        data-pulse={pulse || undefined}
        aria-hidden={label ? true : undefined}
      />
      {label}
    </span>
  );
}

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

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string;
  src?: string;
  size?: number;
  square?: boolean;
  status?: Tone;
}

/** Image or initials; the initials background hue is derived from the name, so it's stable. */
export function Avatar({
  name = "",
  src,
  size = 32,
  square,
  status,
  className,
  style,
  ...rest
}: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  let hue = 0;
  for (const ch of name) hue = (hue * 31 + ch.charCodeAt(0)) % 360;
  return (
    <span
      role="img"
      aria-label={name || undefined}
      {...rest}
      className={cx("rk-avatar", className)}
      data-square={square || undefined}
      style={
        {
          width: size,
          height: size,
          fontSize: size * 0.38,
          "--rk-avatar-h": hue,
          ...style,
        } as React.CSSProperties
      }
    >
      {src ? <img src={src} alt="" /> : initials}
      {status && <span className="rk-avatar-status" data-tone={status} />}
    </span>
  );
}

export function AvatarGroup({
  children,
  max,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode[]; max?: number }) {
  const shown = max ? children.slice(0, max) : children;
  const extra = children.length - shown.length;
  return (
    <div {...rest} className={cx("rk-avatar-group", className)}>
      {shown}
      {extra > 0 && <span className="rk-avatar rk-avatar-more">+{extra}</span>}
    </div>
  );
}
