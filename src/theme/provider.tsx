import {
  type CSSProperties,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { readStorage, writeStorage } from "../lib/hooks";
import { LABELS, type Labels, LabelsContext } from "../lib/labels";
import {
  APPEARANCE_SECTIONS,
  type AppearanceValues,
  type BuiltinAppearanceValues,
  defaultValues,
  normalizeAppearanceValues,
  type SettingsSection,
  type SettingValue,
  THEMES,
  type ThemeName,
  toCssVars,
  toDataAttrs,
} from "./schema";

interface AppearanceContext {
  sections: ReadonlyArray<SettingsSection>;
  values: AppearanceValues;
  defaults: AppearanceValues;
  set: (key: string, value: SettingValue) => void;
  /** Reset one key, or everything. */
  reset: (key?: string) => void;
}

const Ctx = createContext<AppearanceContext | null>(null);
const EMPTY_SECTIONS: ReadonlyArray<SettingsSection> = [];

export interface RootikProviderProps {
  children: ReactNode;
  /** Project sections appended to the built-in appearance schema. */
  extensions?: ReadonlyArray<SettingsSection>;
  /** Replace built-in sections (e.g. filter some out). */
  sections?: ReadonlyArray<SettingsSection>;
  /** Override defaults of any key (brand accent, radius…). */
  defaults?: Partial<AppearanceValues>;
  /** Named built-in theme preset, switchable with one value. */
  theme?: ThemeName;
  /** Controlled values (store them wherever — server settings, a store). */
  value?: AppearanceValues;
  onChange?: (values: AppearanceValues) => void;
  /** Uncontrolled: persist values in localStorage under this key. */
  storageKey?: string;
  /** Element receiving CSS vars; defaults to <html> so portals and top-layer elements inherit them. */
  target?: HTMLElement | null;
  /** Translations of the kit's own strings (accessible names, placeholders). */
  labels?: Partial<Labels>;
}

/**
 * Owns appearance values and writes them as CSS custom properties. Works without it too:
 * tokens.css holds the same defaults.
 */
export function RootikProvider({
  children,
  extensions = EMPTY_SECTIONS,
  sections: baseSections = APPEARANCE_SECTIONS,
  defaults: overrides,
  theme = "iris",
  value,
  onChange,
  storageKey,
  target,
  labels,
}: RootikProviderProps) {
  const sections = useMemo(() => [...baseSections, ...extensions], [baseSections, extensions]);
  const strings = useMemo(() => ({ ...LABELS, ...labels }), [labels]);
  const defaults = useMemo(
    () => ({
      ...defaultValues(sections),
      ...normalizeAppearanceValues(sections, { ...THEMES[theme], ...overrides }),
    }),
    [sections, theme, overrides],
  );
  const [own, setOwn] = useState<AppearanceValues>({});
  const controlled = value !== undefined;
  // The first client render must match SSR; persisted preferences apply before the next paint.
  useLayoutEffect(() => {
    if (!controlled) setOwn(readStorage<AppearanceValues>(storageKey, {}));
  }, [storageKey, controlled]);
  const stored = value ?? own;
  const clean = useMemo(() => normalizeAppearanceValues(sections, stored), [sections, stored]);
  const values = useMemo(() => ({ ...defaults, ...clean }), [defaults, clean]);
  useLayoutEffect(() => {
    const el = target ?? document.documentElement;
    const scoped = el !== document.documentElement;
    const vars = toCssVars(sections, values);
    const restore: (() => void)[] = [];
    for (const [name, v] of Object.entries(vars)) {
      if (v === null && !scoped) continue;
      const previous = el.style.getPropertyValue(name);
      const priority = el.style.getPropertyPriority(name);
      el.style.setProperty(name, v ?? SCOPE_DEFAULTS[name] ?? "initial");
      const written = el.style.getPropertyValue(name);
      restore.push(() => {
        if (el.style.getPropertyValue(name) !== written) return;
        if (previous) el.style.setProperty(name, previous, priority);
        else el.style.removeProperty(name);
      });
    }
    const attrs = { ...toDataAttrs(sections, values), ...(scoped ? { "data-rk-scope": "" } : {}) };
    for (const [name, v] of Object.entries(attrs)) {
      const previous = el.getAttribute(name);
      el.setAttribute(name, v);
      restore.push(() => {
        if (el.getAttribute(name) !== v) return;
        if (previous !== null) el.setAttribute(name, previous);
        else el.removeAttribute(name);
      });
    }
    return () => {
      for (const undo of restore) undo();
    };
  }, [sections, values, target]);

  const commit = (next: AppearanceValues) => {
    const normalized = normalizeAppearanceValues(sections, next);
    if (!controlled) setOwn(normalized);
    onChange?.(normalized);
    if (value === undefined) writeStorage(storageKey, normalized);
  };

  const ctx: AppearanceContext = {
    sections,
    values,
    defaults,
    set: (key, v) => commit({ ...clean, [key]: v }),
    reset: (key) => {
      if (!key) return commit({});
      const { [key]: _, ...rest } = clean;
      commit(rest);
    },
  };
  return (
    <Ctx value={ctx}>
      <LabelsContext value={strings}>{children}</LabelsContext>
    </Ctx>
  );
}

/** One appearance value, or undefined outside a RootikProvider (components use it with a fallback). */
export function useAppearanceValue<K extends keyof BuiltinAppearanceValues>(
  key: K,
): BuiltinAppearanceValues[K] | undefined;
export function useAppearanceValue(key: string): SettingValue | undefined;
export function useAppearanceValue(key: string): SettingValue | undefined {
  return useContext(Ctx)?.values[key];
}

export function useAppearance(): AppearanceContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppearance() needs <RootikProvider> above it");
  return ctx;
}

const SCOPE_DEFAULTS: Record<string, string> = {
  "--rk-density": "1",
  "--rk-roundness": "1",
  "--rk-linecap": "round",
  "--rk-font-sans": "var(--rk-font-default)",
  "--rk-motion": "var(--rk-system-motion)",
  "--rk-animation-state": "var(--rk-system-animation-state)",
};

/** Reset nulls explicitly so a child cannot inherit an effect it disabled. */
export function scopeVars(
  sections: ReadonlyArray<SettingsSection>,
  base: AppearanceValues,
  overrides: Partial<AppearanceValues>,
): Record<string, string> {
  const before = toCssVars(sections, base);
  const after = toCssVars(sections, { ...base, ...normalizeAppearanceValues(sections, overrides) });
  const out: Record<string, string> = {};
  for (const [name, v] of Object.entries(after))
    if (v !== before[name]) out[name] = v ?? SCOPE_DEFAULTS[name] ?? "initial";
  return out;
}

export interface ScopeProps extends HTMLAttributes<HTMLDivElement> {
  /** Appearance keys to override for this subtree, e.g. `{ density: "compact", accent: "…" }`. */
  values: Partial<AppearanceValues>;
}

/**
 * Appearance for a subtree (a dense table in a roomy page, a differently accented panel): writes the same
 * CSS vars RootikProvider writes, and `[data-rk-scope]` re-derives every token from them. Layout-neutral
 * (`display: contents`).
 */
export function Scope({ values, className, style, children, ...rest }: ScopeProps) {
  const ctx = useContext(Ctx);
  const sections = ctx?.sections ?? APPEARANCE_SECTIONS;
  const base = ctx?.values ?? defaultValues(sections);
  const vars = scopeVars(sections, base, values);
  const effective = { ...base, ...normalizeAppearanceValues(sections, values) };
  const attrs = toDataAttrs(sections, effective);
  const writeWithoutProvider = () => {
    throw new Error("Editing appearance needs <RootikProvider> above <Scope>");
  };
  const local: AppearanceContext = ctx
    ? { ...ctx, values: effective }
    : {
        sections,
        values: effective,
        defaults: base,
        set: writeWithoutProvider,
        reset: writeWithoutProvider,
      };
  return (
    <div
      data-rk-scope=""
      {...attrs}
      {...rest}
      className={cx("rk-scope", className)}
      style={{ ...(vars as CSSProperties), ...style }}
    >
      <Ctx value={local}>{children}</Ctx>
    </div>
  );
}
