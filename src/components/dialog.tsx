import {
  type HTMLAttributes,
  type ReactNode,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { EnterIcon, SearchIcon, XIcon } from "../lib/icons";
import { formatShortcut } from "./display";

export interface DialogProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
  /** Defaults to true so `{show && <Dialog …/>}` works. */
  open?: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Bottom actions; primary goes last. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** center — modal; right/left/bottom — drawer/sheet. */
  placement?: "center" | "top" | "right" | "left" | "bottom";
  /** Backdrop click closes (Esc always does). */
  dismissible?: boolean;
  hideClose?: boolean;
  bodyClassName?: string;
}

/**
 * Native modal <dialog>: top layer, focus trap, inert page and Esc come from the platform.
 * We only add backdrop-click dismissal and the look.
 */
export function Dialog({
  open = true,
  onClose,
  title,
  description,
  footer,
  size = "md",
  placement = "center",
  dismissible = true,
  hideClose,
  className,
  bodyClassName,
  children,
  ...rest
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const downOnBackdrop = useRef(false);
  const titleId = useId();
  const descId = useId();

  useLayoutEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click only; Esc closes natively
    <dialog
      {...rest}
      ref={ref}
      className={cx("rk-dialog", className)}
      data-size={size}
      data-placement={placement}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        downOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        // both press and release on the backdrop: a text-selection drag that ends outside doesn't close
        if (dismissible && downOnBackdrop.current && event.target === event.currentTarget) onClose();
      }}
    >
      <div className="rk-dialog-panel">
        {(title || !hideClose) && (
          <header className="rk-dialog-header">
            <div className="rk-dialog-titles">
              {title && (
                <h2 id={titleId} className="rk-dialog-title">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="rk-dialog-desc">
                  {description}
                </p>
              )}
            </div>
            {!hideClose && (
              <button type="button" className="rk-dialog-close" aria-label="Close" onClick={onClose}>
                <XIcon />
              </button>
            )}
          </header>
        )}
        {children !== undefined && <div className={cx("rk-dialog-body", bodyClassName)}>{children}</div>}
        {footer && <footer className="rk-dialog-footer">{footer}</footer>}
      </div>
    </dialog>
  );
}

/** Side sheet: a Dialog docked to an edge. */
export function Drawer({ placement = "right", size = "md", ...rest }: DialogProps) {
  return <Dialog {...rest} placement={placement} size={size} />;
}

export interface Command {
  id: string;
  label: string;
  icon?: ReactNode;
  group?: string;
  /** Combo like "mod+k", displayed platform-aware. */
  shortcut?: string;
  /** Extra search terms. */
  keywords?: string;
  hint?: ReactNode;
  disabled?: boolean;
  run: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: ReadonlyArray<Command>;
  placeholder?: string;
  emptyText?: ReactNode;
}

/** Ctrl/⌘K launcher: fuzzy-ish word filter, groups, keyboard only. Pair with `useHotkey("mod+k", …)`. */
export function CommandPalette({
  open,
  onClose,
  commands,
  placeholder = "Type a command or search…",
  emptyText = "Nothing found",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const listId = useId();

  useLayoutEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
  }, [open]);

  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = commands.filter((c) => {
      const hay = `${c.label} ${c.keywords ?? ""} ${c.group ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    // prefix matches on the label first, then original order
    const first = words[0];
    return first
      ? hits.sort(
          (a, b) =>
            Number(!a.label.toLowerCase().startsWith(first)) -
            Number(!b.label.toLowerCase().startsWith(first)),
        )
      : hits;
  }, [commands, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Array<{ cmd: Command; index: number }>>();
    filtered.forEach((cmd, index) => {
      const key = cmd.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push({ cmd, index });
    });
    return [...map];
  }, [filtered]);

  const exec = (cmd: Command | undefined) => {
    if (!cmd || cmd.disabled) return;
    onClose();
    cmd.run();
  };

  const move = (dir: 1 | -1) => {
    setActive((a) => {
      const next = (a + dir + filtered.length) % Math.max(1, filtered.length);
      requestAnimationFrame(() =>
        list.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: "nearest" }),
      );
      return next;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      placement="top"
      size="md"
      hideClose
      className="rk-command"
      aria-label="Command palette"
    >
      <div className="rk-command-search">
        <SearchIcon />
        <input
          autoFocus
          value={query}
          placeholder={placeholder}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={filtered[active] ? `${listId}-${active}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              move(event.key === "ArrowDown" ? 1 : -1);
            } else if (event.key === "Enter") {
              event.preventDefault();
              exec(filtered[active]);
            }
          }}
        />
        <kbd className="rk-kbd" data-size="sm">
          Esc
        </kbd>
      </div>
      <div ref={list} id={listId} role="listbox" className="rk-command-list">
        {filtered.length === 0 && <div className="rk-command-empty">{emptyText}</div>}
        {groups.map(([group, items]) => (
          // biome-ignore lint/a11y/useSemanticElements: ARIA listbox group
          <div key={group} role="group" aria-label={group || undefined}>
            {group && <div className="rk-menu-label">{group}</div>}
            {items.map(({ cmd, index }) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled on the search input
              <div
                key={cmd.id}
                id={`${listId}-${index}`}
                role="option"
                tabIndex={-1}
                aria-selected={index === active}
                aria-disabled={cmd.disabled || undefined}
                data-index={index}
                data-active={index === active}
                className="rk-menu-item"
                onPointerMove={() => setActive(index)}
                onClick={() => exec(cmd)}
              >
                {cmd.icon && <span className="rk-icon rk-menu-icon">{cmd.icon}</span>}
                <span className="rk-menu-text">
                  <span className="rk-truncate">{cmd.label}</span>
                  {cmd.hint && <span className="rk-menu-hint">{cmd.hint}</span>}
                </span>
                {cmd.shortcut ? (
                  <kbd className="rk-menu-shortcut">{formatShortcut(cmd.shortcut)}</kbd>
                ) : (
                  index === active && <EnterIcon className="rk-command-enter" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Dialog>
  );
}
