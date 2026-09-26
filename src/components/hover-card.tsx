import { type HTMLAttributes, type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { Floating, type Placement } from "../lib/floating";
import { cloneTrigger } from "../lib/hooks";

export interface HoverCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** Usually a link: the card previews where it goes, so everything in it must also be reachable there. */
  children: ReactElement;
  content: ReactNode;
  placement?: Placement;
  openDelay?: number;
  closeDelay?: number;
}

/**
 * Rich, interactive preview on hover or keyboard focus (user card, dataset summary). Non-modal: the
 * pointer can cross onto it, Tab from the trigger moves into it, Esc or leaving both closes it.
 */
export function HoverCard({
  children,
  content,
  placement = "bottom-start",
  openDelay = 500,
  closeDelay = 250,
  className,
  ...rest
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Esc hands focus back to the trigger; that focus must not reopen the card
  const refocused = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const later = (next: boolean, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), ms);
  };
  const stay = () => clearTimeout(timer.current);
  const leave = () => later(false, closeDelay);
  // focus moving between trigger and card keeps it open
  const onBlur = (event: React.FocusEvent) => {
    const to = event.relatedTarget as Node | null;
    if (to && (anchor.current?.contains(to) || card.current?.contains(to))) return;
    later(false, 0);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      clearTimeout(timer.current);
      if (card.current?.contains(document.activeElement)) {
        refocused.current = true;
        anchor.current?.focus();
      }
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {cloneTrigger(children, {
        ref: anchor,
        onPointerEnter: (event: React.PointerEvent) =>
          event.pointerType === "mouse" && later(true, openDelay),
        onPointerLeave: leave,
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          if (refocused.current) refocused.current = false;
          else if (event.currentTarget.matches(":focus-visible")) later(true, openDelay);
        },
        onBlur,
      })}
      {open && (
        <Floating
          {...rest}
          ref={card}
          open
          manual
          anchor={anchor}
          placement={placement}
          className={cx("rk-hover-card", className)}
          onPointerEnter={stay}
          onPointerLeave={leave}
          onFocus={stay}
          onBlur={onBlur}
        >
          {content}
        </Floating>
      )}
    </>
  );
}
