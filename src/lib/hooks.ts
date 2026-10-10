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
  useSyncExternalStore,
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
    const cleanups: Array<() => void> = [];
    for (const ref of refs) {
      if (typeof ref === "function") {
        const cleanup = ref(node);
        if (node !== null) cleanups.push(typeof cleanup === "function" ? cleanup : () => ref(null));
      } else if (ref) {
        ref.current = node;
        if (node !== null)
          cleanups.push(() => {
            ref.current = null;
          });
      }
    }
    if (node !== null)
      return () => {
        for (const cleanup of cleanups) cleanup();
      };
  };
}

type AnyProps = Record<string, unknown>;
const ARIA_IDS_SEPARATOR = /\s+/;

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
    if (key === "aria-describedby" || key === "aria-labelledby") {
      merged[key] =
        [
          ...new Set(
            [mine, theirs]
              .filter((id): id is string => typeof id === "string")
              .flatMap((id) => id.split(ARIA_IDS_SEPARATOR)),
          ),
        ]
          .filter(Boolean)
          .join(" ") || undefined;
    }
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
  } catch {
    // storage unavailable (private mode, quota): the value just isn't persisted
  }
}

const NON_TEXT_INPUTS = new Set(["checkbox", "radio", "button", "submit", "reset", "range", "color", "file"]);

/** The event target takes typed text: plain-key shortcuts must not steal its keystrokes. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;
  return target instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(target.type);
}

/**
 * Global keyboard shortcut. `combo` like "mod+k", "shift+?", "escape"; mod = Ctrl or ⌘.
 * Combos without `mod` are ignored while typing in a field, so "shift+?" never swallows a "?".
 */
export interface HotkeyInfo {
  combo: string;
  /** Listed in the shortcuts sheet (ShortcutsSheet) when given. */
  description: string;
  group?: string;
}

// registered hotkeys that describe themselves: the shortcuts sheet and command hints read this
let registry: HotkeyInfo[] = [];
const registryListeners = new Set<() => void>();
const subscribeRegistry = (listener: () => void) => {
  registryListeners.add(listener);
  return () => registryListeners.delete(listener);
};

/** Every mounted `useHotkey` that has a description, in registration order. */
export function useHotkeys(): ReadonlyArray<HotkeyInfo> {
  return useSyncExternalStore(
    subscribeRegistry,
    () => registry,
    () => registry,
  );
}

/**
 * Global shortcut ("mod+k", "shift+?"; `mod` = Ctrl or ⌘). Plain keys are ignored while typing in a field.
 * The third argument is `enabled`, or options with a `description` that lists it in the shortcuts sheet.
 */
export function useHotkey(
  combo: string,
  handler: (event: KeyboardEvent) => void,
  options: boolean | { enabled?: boolean; description?: string; group?: string } = true,
) {
  const latest = useLatest(handler);
  const {
    enabled = true,
    description,
    group,
  } = typeof options === "boolean" ? { enabled: options } : options;
  useEffect(() => {
    if (!enabled) return;
    const parts = combo.toLowerCase().split("+");
    const key = parts.pop();
    const mod = parts.includes("mod");
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key) return;
      if (mod !== (event.ctrlKey || event.metaKey)) return;
      if (parts.includes("shift") !== event.shiftKey || parts.includes("alt") !== event.altKey) return;
      if (!mod && isTypingTarget(event.target)) return;
      event.preventDefault();
      latest.current(event);
    };
    window.addEventListener("keydown", onKey);
    const info = description ? { combo, description, group } : null;
    if (info) {
      registry = [...registry, info];
      for (const l of registryListeners) l();
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      if (info) {
        registry = registry.filter((h) => h !== info);
        for (const l of registryListeners) l();
      }
    };
  }, [combo, enabled, latest, description, group]);
}

/**
 * Copy text to the clipboard. `copied` stays true for `resetMs` after the last successful copy
 * (drives the check-mark swap); `copy` resolves to false when the clipboard is unavailable.
 */
export function useClipboard(resetMs = 1500) {
  const [copiedAt, setCopiedAt] = useState(0);
  useEffect(() => {
    if (!copiedAt) return;
    const id = setTimeout(() => setCopiedAt(0), resetMs);
    return () => clearTimeout(id);
  }, [copiedAt, resetMs]);
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return false;
    }
    setCopiedAt(Date.now());
    return true;
  }, []);
  return { copy, copied: copiedAt > 0 };
}

/** Live media query match: `useMediaQuery("(max-width: 640px)")`. */
export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(() =>
    typeof matchMedia === "function" ? matchMedia(query).matches : initial,
  );
  useEffect(() => {
    const list = matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** Content-box size of an element: `const { ref, width, height } = useElementSize()`. */
export function useElementSize<T extends Element = HTMLElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useCallback((el: T | null) => {
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, width: size.width, height: size.height };
}

/**
 * Run `callback` every `ms` (null stops). Polling pauses while the tab is hidden and runs once right
 * away when it comes back, so a dashboard is fresh without burning requests in the background.
 */
export function useInterval(callback: () => void, ms: number | null, { whenHidden = false } = {}) {
  const latest = useLatest(callback);
  useEffect(() => {
    if (ms === null) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      id ??= setInterval(() => latest.current(), ms);
    };
    const stop = () => {
      clearInterval(id);
      id = undefined;
    };
    const onVisibility = () => {
      if (document.hidden) return stop();
      latest.current();
      start();
    };
    if (whenHidden || !document.hidden) start();
    if (!whenHidden) document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ms, whenHidden, latest]);
}

const STORAGE_SYNC = "rootik:storage";

/**
 * useState persisted in localStorage (JSON). Every hook on the same key stays in sync: across tabs via the
 * `storage` event, within the tab via a custom event.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initial));
  const current = useLatest(value);
  const fallback = useLatest(initial);
  const self = useRef({});

  useEffect(() => {
    setValue(readStorage(key, fallback.current));
    const reread = () => setValue(readStorage(key, fallback.current));
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) reread();
    };
    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; source: object }>).detail;
      if (detail.key === key && detail.source !== self.current) reread();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(STORAGE_SYNC, onSync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(STORAGE_SYNC, onSync);
    };
  }, [key, fallback]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(current.current) : next;
      current.current = resolved;
      writeStorage(key, resolved);
      setValue(resolved);
      window.dispatchEvent(new CustomEvent(STORAGE_SYNC, { detail: { key, source: self.current } }));
    },
    [key, current],
  );
  return [value, set] as const;
}

/** Whether the app window has focus (native apps dim their chrome and selection when it doesn't). */
export function useWindowFocus(): boolean {
  const [focused, setFocused] = useState(() => typeof document === "undefined" || document.hasFocus());
  useEffect(() => {
    const on = () => setFocused(true);
    const off = () => setFocused(false);
    setFocused(document.hasFocus());
    window.addEventListener("focus", on);
    window.addEventListener("blur", off);
    return () => {
      window.removeEventListener("focus", on);
      window.removeEventListener("blur", off);
    };
  }, []);
  return focused;
}

/**
 * Id of the section currently being read: the last one whose top has passed `offset` px below the top of
 * `root` (the viewport by default). Recomputed on scroll, rAF-throttled.
 */
export function useScrollSpy(
  ids: ReadonlyArray<string>,
  { root, offset = 80 }: { root?: HTMLElement | null; offset?: number } = {},
) {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const key = ids.join("|");
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands for `ids`
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const top = (root?.getBoundingClientRect().top ?? 0) + offset;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= top) current = id;
      }
      // scrolled to the very end: the last section counts even if it's too short to reach the top
      const scroller = root ?? document.scrollingElement;
      if (scroller && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2)
        current = ids.at(-1);
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    const target: HTMLElement | Window = root ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key, root, offset]);
  return active;
}
