import {
  cloneElement,
  type ReactElement,
  type Ref,
  type RefCallback,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/** Controlled when `value` is defined, otherwise keeps its own state. */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [own, setOwn] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setOwn(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : own, set];
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
}

type AnyProps = Record<string, unknown>;

/** Clone a trigger element, chaining its own handlers and ref with ours. */
export function cloneTrigger(
  trigger: ReactElement,
  extra: AnyProps & { ref?: Ref<HTMLElement> },
): ReactElement {
  const own = trigger.props as AnyProps;
  const merged: AnyProps = { ...extra };
  for (const key of Object.keys(extra)) {
    const mine = own[key];
    const theirs = extra[key];
    if (key.startsWith("on") && typeof mine === "function" && typeof theirs === "function") {
      merged[key] = (...args: unknown[]) => {
        mine(...args);
        theirs(...args);
      };
    }
  }
  merged.ref = mergeRefs(own.ref as Ref<HTMLElement> | undefined, extra.ref);
  return cloneElement(trigger, merged);
}

/** Latest value in a ref: for callbacks used inside long-lived listeners. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

/** Persist a value in localStorage; storage failures (private mode, quota) are ignored. */
export function readStorage<T>(key: string | undefined, fallback: T): T {
  if (!key) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string | undefined, value: unknown) {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Global keyboard shortcut. `combo` like "mod+k", "shift+?", "escape"; mod = Ctrl or ⌘. */
export function useHotkey(combo: string, handler: (event: KeyboardEvent) => void, enabled = true) {
  const latest = useLatest(handler);
  useEffect(() => {
    if (!enabled) return;
    const parts = combo.toLowerCase().split("+");
    const key = parts.pop();
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key) return;
      if (parts.includes("mod") !== (event.ctrlKey || event.metaKey)) return;
      if (parts.includes("shift") !== event.shiftKey || parts.includes("alt") !== event.altKey) return;
      event.preventDefault();
      latest.current(event);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [combo, enabled, latest]);
}
