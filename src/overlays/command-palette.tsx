import { type ReactNode, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { formatShortcut } from "../components/display";
import { useHighlight } from "../lib/highlight";
import { EnterIcon, SearchIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Dialog } from "./dialog";
import type { OverlaySurfaceOptions } from "./surface";

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
  surface?: OverlaySurfaceOptions;
}

const WHITESPACE = /\s+/;

/** Ctrl/⌘K launcher: fuzzy-ish word filter, groups, keyboard only. Pair with `useHotkey("mod+k", …)`. */
export function CommandPalette({
  open,
  onClose,
  commands,
  placeholder,
  emptyText,
  surface,
}: CommandPaletteProps) {
  const strings = useLabels();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const listId = useId();
  useHighlight(list, query, ".rk-menu-text > .rk-truncate");

  useLayoutEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
  }, [open]);

  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(WHITESPACE).filter(Boolean);
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
      surface={surface}
      open={open}
      onClose={onClose}
      placement="top"
      size="md"
      hideClose
      className="rk-command"
      aria-label={strings.commandPalette}
    >
      <div className="rk-command-search">
        <SearchIcon />
        <input
          className="rk-command-input"
          autoFocus
          value={query}
          placeholder={placeholder ?? strings.commandPlaceholder}
          role="combobox"
          aria-autocomplete="list"
          aria-label={strings.commandPalette}
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
      <div
        ref={list}
        id={listId}
        role="listbox"
        aria-label={strings.commandPalette}
        className="rk-command-list"
      >
        {filtered.length === 0 && (
          <div className="rk-command-empty">{emptyText ?? strings.noCommands(query.trim())}</div>
        )}
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
