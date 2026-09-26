import {
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  // interest invokers: where supported and the trigger is a button or link, the browser shows/hides the
  // hint on hover, focus and long press with its own delays and Esc; the JS below stays as the fallback
  const [native, setNative] = useState(false);
  useLayoutEffect(() => {
    const el = anchor.current;
    setNative(
      !disabled &&
        "interestForElement" in HTMLButtonElement.prototype &&
        (el instanceof HTMLButtonElement || el instanceof HTMLAnchorElement),
    );
  }, [disabled]);

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
  // leaving the trigger waits a moment, so the pointer can cross the gap onto the tooltip (WCAG 1.4.13)
  const leave = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(hide, 120);
  };
  const stay = () => clearTimeout(timer.current);

  // Esc dismisses a hover-opened tooltip too, wherever focus is
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && hide();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  if (disabled || content === undefined || content === null || content === "") return children;

  if (native)
    return (
      <>
        {cloneTrigger(children, { ref: anchor, interestfor: id, "aria-describedby": id })}
        <Floating hint id={id} role="tooltip" anchor={anchor} placement={placement} className="rk-tooltip">
          {content}
          {shortcut && <kbd className="rk-tooltip-kbd">{shortcut}</kbd>}
        </Floating>
      </>
    );

  return (
    <>
      {cloneTrigger(children, {
        ref: anchor,
        "aria-describedby": open ? id : undefined,
        onPointerEnter: show,
        onPointerLeave: leave,
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          if (event.currentTarget.matches(":focus-visible")) show();
        },
        onBlur: hide,
        onPointerDown: hide,
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
          onPointerEnter={stay}
          onPointerLeave={leave}
        >
          {content}
          {shortcut && <kbd className="rk-tooltip-kbd">{shortcut}</kbd>}
        </Floating>
      )}
    </>
  );
}
