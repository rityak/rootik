import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { announce } from "../lib/announce";
import { ErrorIcon, InfoIcon, SuccessIcon, WarnIcon, XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Spinner, type Tone } from "./progress";

export interface ToastInput {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  /** Shows a spinner, never auto-dismisses; update it later with the same id. */
  loading?: boolean;
  action?: { label: string; onClick: () => void };
  /**
   * ms; 0 keeps it until dismissed. Default 5000, but 0 for errors and toasts with an action: an "Undo"
   * that expires before a keyboard user can reach it is a lost action.
   */
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
  /**
   * Collapsed deck: only the newest toast shows in full, older ones peek behind it; hovering or focusing
   * the stack fans it out. `false` always lists them.
   */
  stack?: boolean;
}

const PEEK = 10;
const GAP = 8;

/** Mount once. Lives in the top layer (manual popover) so toasts stay above modal dialogs. */
export function Toaster({ position = "bottom-right", max = 4, stack = true }: ToasterProps) {
  const list = useSyncExternalStore(
    subscribe,
    () => items,
    () => items,
  );
  const ref = useRef<HTMLDivElement>(null);
  const labels = useLabels();
  // timers pause while the pointer is over the stack or focus is inside it; the same fans the deck out
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const [heights, setHeights] = useState<Record<string, number>>({});

  // Re-show on change: moves the toaster above any dialog opened after it.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.matches(":popover-open")) el.hidePopover();
    if (list.length > 0) el.showPopover();
  }, [list]);

  const shown = list.slice(-max);
  // natural heights (scrollHeight ignores the clamp a collapsed toast gets)
  useLayoutEffect(() => {
    const next: Record<string, number> = {};
    for (const el of ref.current?.querySelectorAll<HTMLElement>(".rk-toast") ?? [])
      next[el.dataset.id as string] = el.scrollHeight;
    setHeights((prev) =>
      Object.keys(next).length === Object.keys(prev).length &&
      Object.entries(next).every(([k, v]) => prev[k] === v)
        ? prev
        : next,
    );
  });

  const top = position.startsWith("top");
  const expanded = !stack || paused;
  const newest = shown.at(-1);
  const frontH = (newest && heights[newest.id]) || 64;
  let acc = 0;
  const layout = [...shown].reverse().map((t, k) => {
    const h = heights[t.id] ?? frontH;
    const offset = expanded ? acc : k * PEEK;
    acc += h + GAP;
    return { t, k, offset };
  });
  const total = expanded ? Math.max(0, acc - GAP) : frontH + Math.min(shown.length - 1, 2) * PEEK;

  return (
    <section
      ref={ref}
      popover="manual"
      aria-label={labels.notifications}
      className="rk-toaster"
      data-position={position}
      data-expanded={expanded || undefined}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="rk-toaster-list" style={{ height: total }}>
        {layout.map(({ t, k, offset }) => (
          <Toast
            key={t.id}
            item={t}
            paused={paused}
            style={
              {
                "--rk-toast-y": `${top ? offset : -offset}px`,
                "--rk-toast-scale": expanded ? 1 : 1 - k * 0.05,
                zIndex: shown.length - k,
                opacity: !expanded && k > 2 ? 0 : undefined,
                height: !expanded && k > 0 ? frontH : undefined,
              } as CSSProperties
            }
            behind={!expanded && k > 0}
          />
        ))}
      </div>
    </section>
  );
}

function Toast({
  item,
  paused,
  style,
  behind,
}: {
  item: ToastItem;
  paused: boolean;
  style: CSSProperties;
  behind: boolean;
}) {
  const [swipe, setSwipe] = useState(0);
  const swipeFrom = useRef<number | null>(null);
  const tone = item.tone ?? "neutral";
  const duration = item.loading ? 0 : (item.duration ?? (item.action || tone === "danger" ? 0 : 5000));
  const labels = useLabels();
  const body = useRef<HTMLDivElement>(null);
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

  // spoken through the shared live regions: a live region inserted together with its text is often skipped
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new item object (update in place) speaks again
  useEffect(() => {
    const text = body.current?.textContent;
    if (text) announce(text, tone === "danger" ? "assertive" : "polite");
  }, [item]);

  return (
    // swipe sideways to dismiss (touch and mouse); the close button is the keyboard path
    <div
      className="rk-toast"
      data-tone={tone}
      data-id={item.id}
      data-behind={behind || undefined}
      data-swiping={swipeFrom.current !== null || undefined}
      inert={behind}
      style={
        {
          ...style,
          "--rk-toast-x": `${swipe}px`,
          opacity: style.opacity ?? (swipe ? 1 - Math.min(1, Math.abs(swipe) / 160) : undefined),
        } as CSSProperties
      }
      onPointerDown={(event) => {
        if ((event.target as Element).closest("button")) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        swipeFrom.current = event.clientX;
      }}
      onPointerMove={(event) => {
        if (swipeFrom.current !== null) setSwipe(event.clientX - swipeFrom.current);
      }}
      onPointerUp={() => {
        swipeFrom.current = null;
        if (Math.abs(swipe) > 80) toast.dismiss(item.id);
        else setSwipe(0);
      }}
      onPointerCancel={() => {
        swipeFrom.current = null;
        setSwipe(0);
      }}
    >
      {item.loading ? (
        <Spinner size={16} className="rk-toast-icon" />
      ) : (
        ICONS[tone] && <span className="rk-icon rk-toast-icon">{ICONS[tone]}</span>
      )}
      <div ref={body} className="rk-toast-body">
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
        aria-label={labels.dismiss}
        onClick={() => toast.dismiss(item.id)}
      >
        <XIcon />
      </button>
    </div>
  );
}
