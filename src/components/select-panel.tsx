import {
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { Floating, type Placement } from "../lib/floating";
import { cloneTrigger, useControllable } from "../lib/hooks";
import { CheckIcon, SearchIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Button } from "./button";

export interface SelectPanelOption<T extends string = string> {
  value: T;
  label: ReactNode;
  /** Search text when `label` isn't a string. */
  text?: string;
  /** Right-aligned count ("1,204"). */
  count?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectPanelProps<T extends string = string> {
  /** A button element; receives ref, aria and click wiring. */
  trigger: ReactElement;
  options: ReadonlyArray<SelectPanelOption<T>>;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  /** One value; picking closes the panel. */
  single?: boolean;
  title?: ReactNode;
  /** Filter field; default on above 7 options. */
  searchable?: boolean;
  /** Accessible name of the filter input; defaults to the shared search label. */
  searchLabel?: string;
  /** Stage changes and commit them with Apply (closing discards). */
  deferred?: boolean;
  placement?: Placement;
  emptyText?: ReactNode;
  className?: string;
}

const textOf = <T extends string>(o: SelectPanelOption<T>) =>
  o.text ?? (typeof o.label === "string" ? o.label : o.value);

/**
 * Filter picker behind a button: search, checkable options with counts, Clear (and Apply in `deferred`
 * mode). Focus stays in the search field; ↑/↓ move the highlight, Enter toggles, Esc closes.
 */
export function SelectPanel<T extends string = string>({
  trigger,
  options,
  value,
  defaultValue = [],
  onChange,
  single,
  title,
  searchable = options.length > 7,
  searchLabel,
  deferred,
  placement = "bottom-start",
  emptyText,
  className,
}: SelectPanelProps<T>) {
  const labels = useLabels();
  const [selected, setSelected] = useControllable(value, defaultValue, onChange);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<T[]>(selected);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const anchor = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  const current = deferred ? draft : selected;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => textOf(o).toLowerCase().includes(q)) : options;
  }, [options, query]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only when the panel opens
  useEffect(() => {
    if (!open) return;
    setDraft(selected);
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => (searchable ? search.current : list.current)?.focus());
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `active` drives the scroll
  useEffect(() => {
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const commit = (next: T[]) => (deferred ? setDraft(next) : setSelected(next));
  const toggle = (option: SelectPanelOption<T> | undefined) => {
    if (!option || option.disabled) return;
    if (single) {
      setSelected([option.value]);
      setOpen(false);
      return;
    }
    commit(
      current.includes(option.value) ? current.filter((v) => v !== option.value) : [...current, option.value],
    );
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const last = shown.length - 1;
    if (event.key === "ArrowDown") setActive((a) => Math.min(last, a + 1));
    else if (event.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (event.key === "Home" && !searchable) setActive(0);
    else if (event.key === "End" && !searchable) setActive(last);
    else if (event.key === "Enter" || (event.key === " " && !searchable)) toggle(shown[active]);
    else return;
    event.preventDefault();
  };

  const listbox = (
    <div
      ref={list}
      id={`${id}-list`}
      role="listbox"
      aria-multiselectable={!single || undefined}
      aria-activedescendant={shown[active] ? `${id}-${active}` : undefined}
      tabIndex={searchable ? -1 : 0}
      className="rk-select-panel-list"
      onKeyDown={searchable ? undefined : onKeyDown}
    >
      {shown.length === 0 && <div className="rk-select-panel-empty">{emptyText ?? labels.noResults}</div>}
      {shown.map((o, i) => {
        const on = current.includes(o.value);
        return (
          // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard is handled by the search field / listbox
          <div
            key={o.value}
            id={`${id}-${i}`}
            role="option"
            tabIndex={-1}
            aria-selected={on}
            aria-disabled={o.disabled || undefined}
            data-active={i === active}
            className="rk-menu-item rk-select-panel-option"
            onPointerMove={() => setActive(i)}
            onClick={() => toggle(o)}
          >
            {!single && (
              <span className="rk-select-panel-box" data-checked={on || undefined}>
                {on && <CheckIcon />}
              </span>
            )}
            {o.icon && <span className="rk-icon rk-menu-icon">{o.icon}</span>}
            <span className="rk-menu-text rk-truncate">{o.label}</span>
            {o.count !== undefined && <span className="rk-select-panel-count rk-num">{o.count}</span>}
            {single && on && <CheckIcon className="rk-menu-check" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {cloneTrigger(trigger, {
        ref: anchor,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": id,
        onClick: () => setOpen(!open),
      })}
      <Floating
        ref={panel}
        id={id}
        role="dialog"
        aria-label={typeof title === "string" ? title : undefined}
        anchor={anchor}
        open={open}
        onOpenChange={(next) => {
          if (!next && panel.current?.contains(document.activeElement)) anchor.current?.focus();
          if (next !== open) setOpen(next);
        }}
        placement={placement}
        className={cx("rk-popover rk-select-panel", className)}
      >
        {title && <div className="rk-popover-title">{title}</div>}
        {searchable && (
          <label className="rk-input rk-select-panel-search" data-size="sm">
            <SearchIcon className="rk-input-icon" />
            <input
              ref={search}
              className="rk-input-el"
              value={query}
              placeholder={labels.filter}
              aria-label={searchLabel ?? labels.searchLabel}
              role="combobox"
              aria-expanded
              aria-controls={`${id}-list`}
              aria-activedescendant={shown[active] ? `${id}-${active}` : undefined}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
          </label>
        )}
        {listbox}
        {!single && (
          <div className="rk-select-panel-foot">
            <span className="rk-num">{current.length > 0 ? labels.selectedCount(current.length) : null}</span>
            <Button size="sm" variant="ghost" disabled={current.length === 0} onClick={() => commit([])}>
              {labels.clear}
            </Button>
            {deferred && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setSelected(draft);
                  setOpen(false);
                }}
              >
                {labels.apply}
              </Button>
            )}
          </div>
        )}
      </Floating>
    </>
  );
}
