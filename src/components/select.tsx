import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { Floating } from "../lib/floating";
import { useControllable } from "../lib/hooks";
import { CheckIcon, ChevronDownIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import type { Size } from "./button";
import { useField } from "./input";

export interface SelectOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  /** Raw leading media instead of the square icon slot: flag, avatar, logo, preview. */
  media?: ReactNode;
  /** Secondary line under the label. */
  hint?: ReactNode;
  disabled?: boolean;
  /** Typeahead text when `label` isn't a string. */
  text?: string;
}

export interface SelectGroup<T extends string = string> {
  label: ReactNode;
  options: ReadonlyArray<SelectOption<T>>;
}

type SelectEntry<T extends string> = SelectOption<T> | SelectGroup<T>;
interface Choice<T extends string> {
  option?: SelectOption<T>;
  value: T | null;
  label: ReactNode;
  text: string;
}

const isGroup = <T extends string>(entry: SelectEntry<T>): entry is SelectGroup<T> => "options" in entry;

interface SelectBaseProps<T extends string = string> {
  options: ReadonlyArray<SelectEntry<T>>;
  clearLabel?: ReactNode;
  /** Renders a controlled value that is not present in options; defaults to the raw value. */
  renderValue?: (value: T) => ReactNode;
  placeholder?: ReactNode;
  size?: Size;
  /** `field`: input-like box; `button`: looks like a secondary button (toolbars, card headers). */
  variant?: "field" | "button";
  disabled?: boolean;
  invalid?: boolean;
  mono?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export type SelectProps<T extends string = string> = SelectBaseProps<T> &
  (
    | {
        /** Adds a first “none” option that sets the value to null. */
        clearable: true;
        value?: T | null;
        defaultValue?: T | null;
        onChange?: (value: T | null) => void;
      }
    | {
        clearable?: false;
        value?: T;
        defaultValue?: T;
        onChange?: (value: T) => void;
      }
  );

/**
 * Listbox select. Custom instead of native <select> because the native popup is drawn by the OS
 * (white on Windows/WebView2) and can't be themed. Focus stays on the trigger (aria-activedescendant).
 */
export function Select<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  clearable,
  clearLabel,
  renderValue,
  placeholder,
  size = "md",
  variant = "field",
  disabled,
  invalid,
  mono,
  className,
  style,
  ...rest
}: SelectProps<T>) {
  const strings = useLabels();
  const [current, setCurrent] = useControllable<T | null | undefined>(
    value,
    defaultValue,
    onChange as (v: T | null | undefined) => void,
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const listId = useId();
  const field = useField(rest);
  const flat = options.flatMap((entry) => (isGroup(entry) ? entry.options : [entry]));
  const chosen = flat.find((o) => o.value === current);
  const choices: Choice<T>[] = [
    ...(clearable
      ? [{ value: null, label: clearLabel ?? strings.none, text: String(clearLabel ?? strings.none) }]
      : []),
    ...flat.map((option) => ({
      option,
      value: option.value,
      label: option.label,
      text: option.text ?? (typeof option.label === "string" ? option.label : option.value),
    })),
  ];

  const enabled = (i: number) => choices[i] && !choices[i].option?.disabled;
  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < choices.length; i += dir) if (enabled(i)) return i;
    return from;
  };

  const show = () => {
    if (disabled) return;
    const i = choices.findIndex((choice) => choice.value === current);
    setActive(i >= 0 ? i : step(-1, 1));
    setOpen(true);
  };
  const pick = (i: number) => {
    const choice = choices[i];
    if (!choice || choice.option?.disabled) return;
    setCurrent(choice.value);
    setOpen(false);
    trigger.current?.focus();
  };

  // `active` is the trigger: keep the highlighted option scrolled into view
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    if (open) list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const seek = (key: string) => {
    const now = Date.now();
    const text = (now - typed.current.at < 800 ? typed.current.text : "") + key.toLowerCase();
    typed.current = { text, at: now };
    const found = choices.findIndex(
      (choice) => !choice.option?.disabled && choice.text.toLowerCase().startsWith(text),
    );
    if (found < 0) return;
    if (open) setActive(found);
    else pick(found);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const k = event.key;
    if (k === "ArrowDown" || k === "ArrowUp") {
      event.preventDefault();
      if (!open) return show();
      setActive((a) => step(a, k === "ArrowDown" ? 1 : -1));
    } else if (k === "Home" || k === "End") {
      if (!open) return;
      event.preventDefault();
      setActive(k === "Home" ? step(-1, 1) : step(choices.length, -1));
    } else if (k === "Enter" || k === " ") {
      event.preventDefault();
      if (open) pick(active);
      else show();
    } else if (k === "Tab" && open) {
      setOpen(false);
    } else if (k.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      seek(k);
    }
  };

  let cursor = clearable ? 1 : 0;
  const blocks = options.map((entry) => {
    const group = isGroup(entry);
    const block = {
      label: group ? entry.label : undefined,
      start: cursor,
      length: group ? entry.options.length : 1,
    };
    cursor += block.length;
    return block;
  });

  const renderChoice = ({ option: o, value: optionValue, label: optionLabel }: Choice<T>, i: number) => (
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled on the combobox trigger
    <div
      key={optionValue ?? "__empty"}
      id={`${listId}-${i}`}
      role="option"
      tabIndex={-1}
      aria-selected={optionValue === current}
      aria-disabled={o?.disabled || undefined}
      data-active={i === active}
      className="rk-menu-item"
      onPointerMove={() => !o?.disabled && setActive(i)}
      onClick={() => pick(i)}
    >
      {o?.media ? (
        <span className="rk-menu-media">{o.media}</span>
      ) : (
        o?.icon && <span className="rk-icon rk-menu-icon">{o.icon}</span>
      )}
      <span className="rk-menu-text">
        <span className="rk-truncate">{optionLabel}</span>
        {o?.hint && <span className="rk-menu-hint">{o.hint}</span>}
      </span>
      {optionValue === current && <CheckIcon className="rk-menu-check" />}
    </div>
  );

  return (
    <>
      <button
        {...field}
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={rest["aria-label"]}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || field["aria-invalid"]}
        disabled={disabled}
        className={cx("rk-select-trigger", className)}
        style={style}
        data-size={size}
        data-variant={variant}
        data-mono={mono || undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
      >
        {chosen?.media ? (
          <span className="rk-select-media">{chosen.media}</span>
        ) : (
          chosen?.icon && <span className="rk-icon">{chosen.icon}</span>
        )}
        <span className="rk-select-value" data-placeholder={current == null || undefined}>
          {chosen
            ? chosen.label
            : current != null
              ? (renderValue?.(current) ?? current)
              : (placeholder ?? strings.select)}
        </span>
        <ChevronDownIcon className="rk-select-chevron" />
      </button>
      <Floating
        ref={list}
        id={listId}
        role="listbox"
        anchor={trigger}
        open={open}
        onOpenChange={setOpen}
        matchWidth
        className="rk-menu rk-select-list"
        data-mono={mono || undefined}
      >
        {clearable && choices[0] && renderChoice(choices[0], 0)}
        {blocks.map((block, blockIndex) =>
          block.label === undefined ? (
            choices[block.start] && renderChoice(choices[block.start] as Choice<T>, block.start)
          ) : (
            <fieldset
              // biome-ignore lint/suspicious/noArrayIndexKey: groups are positional in the options array
              key={blockIndex}
              className="rk-select-group"
            >
              <legend className="rk-menu-label">{block.label}</legend>
              {choices
                .slice(block.start, block.start + block.length)
                .map((choice, i) => choice && renderChoice(choice, block.start + i))}
            </fieldset>
          ),
        )}
      </Floating>
    </>
  );
}
