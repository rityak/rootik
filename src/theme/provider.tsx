import { createContext, type ReactNode, useContext, useLayoutEffect, useMemo, useRef } from "react";
import { readStorage, useControllable, writeStorage } from "../lib/hooks";
import { LABELS, type Labels, LabelsContext } from "../lib/labels";
import {
  APPEARANCE_SECTIONS,
  type AppearanceValues,
  defaultValues,
  type SettingsSection,
  type SettingValue,
  toCssVars,
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
  value,
  onChange,
  storageKey,
  target,
  labels,
}: RootikProviderProps) {
  const sections = useMemo(() => [...baseSections, ...extensions], [baseSections, extensions]);
  const strings = useMemo(() => ({ ...LABELS, ...labels }), [labels]);
  const defaults = useMemo(
    () => ({ ...defaultValues(sections), ...overrides }) as AppearanceValues,
    [sections, overrides],
  );
  const [stored, setStored] = useControllable(value, readStorage<AppearanceValues>(storageKey, {}), onChange);
  const values = useMemo(() => ({ ...defaults, ...stored }), [defaults, stored]);
  const written = useRef<string[]>([]);

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
  }, [sections, values, target]);

  useLayoutEffect(
    () => () => {
      const el = target ?? document.documentElement;
      for (const name of written.current) el.style.removeProperty(name);
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
