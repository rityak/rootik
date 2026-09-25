import { type ReactNode, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { ErrorIcon, InfoIcon, SuccessIcon, WarnIcon, XIcon } from "../lib/icons";
import { Spinner, type Tone } from "./progress";

export interface ToastInput {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  /** Shows a spinner, never auto-dismisses; update it later with the same id. */
  loading?: boolean;
  action?: { label: string; onClick: () => void };
  /** ms; 0 keeps it until dismissed. Default 5000. */
  duration?: number;
  /** Reusing an id updates the toast in place (progress → done). */
  id?: string;
}

interface ToastItem extends ToastInput {
  id: string;
}

let items: ToastItem[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const emit = () => {
  for (const listener of listeners) listener();
};

export function toast(input: ToastInput | string): string {
  const next: ToastItem =
    typeof input === "string" ? { title: input, id: `t${++seq}` } : { ...input, id: input.id ?? `t${++seq}` };
  const at = items.findIndex((t) => t.id === next.id);
  items = at >= 0 ? items.map((t, i) => (i === at ? next : t)) : [...items, next];
  emit();
  return next.id;
}
toast.success = (title: ReactNode, rest?: Omit<ToastInput, "title" | "tone">) =>
  toast({ ...rest, title, tone: "success" });
toast.error = (title: ReactNode, rest?: Omit<ToastInput, "title" | "tone">) =>
  toast({ ...rest, title, tone: "danger" });
toast.warn = (title: ReactNode, rest?: Omit<ToastInput, "title" | "tone">) =>
  toast({ ...rest, title, tone: "warn" });
toast.dismiss = (id?: string) => {
  items = id ? items.filter((t) => t.id !== id) : [];
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const ICONS: Partial<Record<Tone, ReactNode>> = {
  success: <SuccessIcon />,
  danger: <ErrorIcon />,
  warn: <WarnIcon />,
  info: <InfoIcon />,
};

export interface ToasterProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "bottom-center" | "top-center";
  /** Visible at once; older ones wait. */
  max?: number;
}

/** Mount once. Lives in the top layer (manual popover) so toasts stay above modal dialogs. */
export function Toaster({ position = "bottom-right", max = 4 }: ToasterProps) {
  const list = useSyncExternalStore(
    subscribe,
    () => items,
    () => items,
  );
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Re-show on change: moves the toaster above any dialog opened after it.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.matches(":popover-open")) el.hidePopover();
    if (list.length) el.showPopover();
  }, [list]);

  const shown = position.startsWith("top") ? list.slice(0, max) : list.slice(-max);
  return (
    <section
      ref={ref}
      popover="manual"
      aria-label="Notifications"
      className="rk-toaster"
      data-position={position}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {shown.map((t) => (
        <Toast key={t.id} item={t} paused={paused} />
      ))}
    </section>
  );
}

function Toast({ item, paused }: { item: ToastItem; paused: boolean }) {
  const duration = item.loading ? 0 : (item.duration ?? 5000);
  const left = useRef(duration);
  useEffect(() => {
    left.current = duration;
  }, [duration]);
  // `duration` restarts the timer when a toast is updated in place (loading → done)
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    if (paused || !left.current) return;
    const start = Date.now();
    const id = setTimeout(() => toast.dismiss(item.id), left.current);
    return () => {
      clearTimeout(id);
      left.current -= Date.now() - start;
    };
  }, [paused, item.id, duration]);

  const tone = item.tone ?? "neutral";
  return (
    <div role={tone === "danger" ? "alert" : "status"} className="rk-toast" data-tone={tone}>
      {item.loading ? (
        <Spinner size={16} className="rk-toast-icon" />
      ) : (
        ICONS[tone] && <span className="rk-icon rk-toast-icon">{ICONS[tone]}</span>
      )}
      <div className="rk-toast-body">
        <div className="rk-toast-title">{item.title}</div>
        {item.description && <div className="rk-toast-desc">{item.description}</div>}
      </div>
      {item.action && (
        <button
          type="button"
          className="rk-toast-action"
          onClick={() => {
            item.action?.onClick();
            toast.dismiss(item.id);
          }}
        >
          {item.action.label}
        </button>
      )}
      <button
        type="button"
        className="rk-toast-close"
        aria-label="Dismiss"
        onClick={() => toast.dismiss(item.id)}
      >
        <XIcon />
      </button>
    </div>
  );
}
