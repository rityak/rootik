import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Floating, type Placement } from "../lib/floating";
import { XIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Button } from "./button";

export interface TourStep {
  /** CSS selector or element getter of the thing to point at. */
  target: string | (() => Element | null);
  title: ReactNode;
  content?: ReactNode;
  placement?: Placement;
}

export interface TourProps {
  steps: ReadonlyArray<TourStep>;
  open: boolean;
  onClose: () => void;
  /** Controlled step index. */
  step?: number;
  onStepChange?: (step: number) => void;
}

const resolve = (target: TourStep["target"]) =>
  typeof target === "string" ? document.querySelector(target) : target();

/**
 * Step-by-step coach marks: the target is spotlit, a card next to it explains it. Focus moves to the card
 * each step; Esc or the close button ends the tour, ←/→ step through.
 */
export function Tour({ steps, open, onClose, step: controlled, onStepChange }: TourProps) {
  const labels = useLabels();
  const [own, setOwn] = useState(0);
  const index = controlled ?? own;
  const go = (i: number) => (onStepChange ? onStepChange(i) : setOwn(i));
  const current = steps[index];
  const [rect, setRect] = useState<DOMRect | null>(null);
  const card = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const el = current && resolve(current.target);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [current]);

  useLayoutEffect(() => {
    if (!open || !current) return;
    resolve(current.target)?.scrollIntoView({ block: "nearest", inline: "nearest" });
    measure();
    requestAnimationFrame(() =>
      card.current?.querySelector<HTMLElement>(".rk-tour-foot > :last-child")?.focus(),
    );
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, current, measure]);

  useEffect(() => {
    if (!open) setOwn(0);
  }, [open]);

  if (!open || !current) return null;
  const last = index === steps.length - 1;
  const anchor = () => rect;
  const pad = 6;
  return (
    <>
      {rect && (
        <div
          className="rk-tour-spot"
          aria-hidden="true"
          style={{
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          }}
        />
      )}
      <Floating
        ref={card}
        open
        manual
        anchor={anchor}
        placement={current.placement ?? "bottom-start"}
        offset={pad + 8}
        role="dialog"
        aria-label={typeof current.title === "string" ? current.title : undefined}
        tabIndex={-1}
        className="rk-tour"
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          else if (event.key === "ArrowRight" && !last) go(index + 1);
          else if (event.key === "ArrowLeft" && index > 0) go(index - 1);
        }}
      >
        <div className="rk-tour-head">
          <div className="rk-tour-title">{current.title}</div>
          <button type="button" className="rk-tour-close" aria-label={labels.close} onClick={onClose}>
            <XIcon />
          </button>
        </div>
        {current.content && <div className="rk-tour-content">{current.content}</div>}
        <div className="rk-tour-foot">
          <span className="rk-tour-count rk-num">{labels.stepOf(index + 1, steps.length)}</span>
          {index > 0 && (
            <Button size="sm" variant="ghost" onClick={() => go(index - 1)}>
              {labels.previous}
            </Button>
          )}
          <Button size="sm" variant="primary" onClick={() => (last ? onClose() : go(index + 1))}>
            {last ? labels.done : labels.next}
          </Button>
        </div>
      </Floating>
    </>
  );
}
