import { type ReactElement, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Floating, type Placement } from "../lib/floating";
import { cloneTrigger } from "../lib/hooks";

// Once a tooltip was shown, neighbours open instantly (scanning a toolbar shouldn't wait each time).
let warmUntil = 0;

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: Placement;
  delay?: number;
  /** Keyboard shortcut shown next to the text. */
  shortcut?: string;
  disabled?: boolean;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 450,
  shortcut,
  disabled,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), Date.now() < warmUntil ? 0 : delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    if (open) warmUntil = Date.now() + 500;
    setOpen(false);
  };

  if (disabled || content === undefined || content === null || content === "") return children;

  return (
    <>
      {cloneTrigger(children, {
        ref: anchor,
        "aria-describedby": open ? id : undefined,
        onPointerEnter: show,
        onPointerLeave: hide,
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          if (event.currentTarget.matches(":focus-visible")) show();
        },
        onBlur: hide,
        onPointerDown: hide,
        onKeyDown: (event: React.KeyboardEvent) => event.key === "Escape" && hide(),
      })}
      {open && (
        <Floating
          open
          manual
          id={id}
          role="tooltip"
          anchor={anchor}
          placement={placement}
          className="rk-tooltip"
        >
          {content}
          {shortcut && <kbd className="rk-tooltip-kbd">{shortcut}</kbd>}
        </Floating>
      )}
    </>
  );
}
