import {
  type CSSProperties,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { cx } from "../lib/cx";
import { readStorage, useControllable, writeStorage } from "../lib/hooks";
import { LABELS, type Labels, LabelsContext } from "../lib/labels";
import {
  APPEARANCE_SECTIONS,
  type AppearanceValues,
  defaultValues,
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
  extensions = [],
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
    () => ({ ...defaultValues(sections), ...THEMES[theme], ...overrides }) as AppearanceValues,
    [sections, theme, overrides],
  );
  const [stored, setStored] = useControllable(value, readStorage<AppearanceValues>(storageKey, {}), onChange);
  const values = useMemo(() => ({ ...defaults, ...stored }), [defaults, stored]);
  const written = useRef<string[]>([]);
  const writtenAttrs = useRef<string[]>([]);

  useLayoutEffect(() => {
    const el = target ?? document.documentElement;
    const vars = toCssVars(sections, values);
    for (const name of written.current)
      if (!(name in vars) || vars[name] === null) el.style.removeProperty(name);
    const next: string[] = [];
    for (const [name, v] of Object.entries(vars)) {
      if (v === null) continue;
      el.style.setProperty(name, v);
      next.push(name);
    }
    written.current = next;
    const attrs = toDataAttrs(sections, values);
    for (const name of writtenAttrs.current) if (!(name in attrs)) el.removeAttribute(name);
    for (const [name, v] of Object.entries(attrs)) el.setAttribute(name, v);
    writtenAttrs.current = Object.keys(attrs);
  }, [sections, values, target]);

  useLayoutEffect(
    () => () => {
      const el = target ?? document.documentElement;
      for (const name of written.current) el.style.removeProperty(name);
      for (const name of writtenAttrs.current) el.removeAttribute(name);
    },
    [target],
  );

  const commit = (next: AppearanceValues) => {
    setStored(next);
    if (value === undefined) writeStorage(storageKey, next);
  };

  const ctx: AppearanceContext = {
    sections,
    values,
    defaults,
    set: (key, v) => commit({ ...stored, [key]: v }),
    reset: (key) => {
      if (!key) return commit({});
      const { [key]: _, ...rest } = stored;
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
export function useAppearanceValue(key: string): SettingValue | undefined {
  return useContext(Ctx)?.values[key];
}

export function useAppearance(): AppearanceContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppearance() needs <RootikProvider> above it");
  return ctx;
}

/** CSS vars that `overrides` change relative to `base` (null = "use the stylesheet default": left to inherit). */
export function scopeVars(
  sections: ReadonlyArray<SettingsSection>,
  base: AppearanceValues,
  overrides: Partial<AppearanceValues>,
): Record<string, string> {
  const before = toCssVars(sections, base);
  const after = toCssVars(sections, { ...base, ...overrides } as AppearanceValues);
  const out: Record<string, string> = {};
  for (const [name, v] of Object.entries(after)) if (v !== null && v !== before[name]) out[name] = v;
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
export function Scope({ values, className, style, ...rest }: ScopeProps) {
  const ctx = useContext(Ctx);
  const sections = ctx?.sections ?? APPEARANCE_SECTIONS;
  const base = ctx?.values ?? defaultValues(sections);
  const vars = scopeVars(sections, base, values);
  const attrs = toDataAttrs(sections, { ...base, ...values } as AppearanceValues);
  return (
    <div
      data-rk-scope=""
      {...attrs}
      {...rest}
      className={cx("rk-scope", className)}
      style={{ ...(vars as CSSProperties), ...style }}
    />
  );
}
