import {
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../lib/cx";
import { ArrowDownIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

export interface StickToBottomHandle {
  /** Scroll to the end and resume following. */
  scrollToBottom: (smooth?: boolean) => void;
}

export interface StickToBottomProps extends HTMLAttributes<HTMLDivElement> {
  /** Distance from the end (px) that still counts as "at the bottom". */
  threshold?: number;
  /** Count on the jump button ("12 new"), e.g. lines that arrived while scrolled up. */
  unseen?: number;
  /** Custom jump button content. */
  jumpLabel?: ReactNode;
  onFollowChange?: (following: boolean) => void;
  ref?: Ref<StickToBottomHandle>;
}

/**
 * Scroll container for logs, consoles and chats: stays pinned to the newest content while the user is at
 * the bottom, stops when they scroll up (a "Jump to latest" button appears), and keeps the reading
 * position when history is prepended (native scroll anchoring).
 */
export function StickToBottom({
  threshold = 24,
  unseen,
  jumpLabel,
  onFollowChange,
  ref,
  className,
  children,
  ...rest
}: StickToBottomProps) {
  const labels = useLabels();
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [following, setFollowing] = useState(true);
  const state = useRef({ following: true, jumpingUntil: 0 });

  const setFollow = (next: boolean) => {
    if (state.current.following === next) return;
    state.current.following = next;
    setFollowing(next);
    onFollowChange?.(next);
  };

  const scrollToBottom = (smooth = true) => {
    const el = viewport.current;
    if (!el) return;
    const animate = smooth && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    // a smooth scroll passes through "not at bottom": keep following while it runs
    state.current.jumpingUntil = animate ? Date.now() + 700 : 0;
    setFollow(true);
    el.scrollTo({ top: el.scrollHeight, behavior: animate ? "smooth" : "auto" });
  };
  useImperativeHandle(ref, () => ({ scrollToBottom }));

  useLayoutEffect(() => {
    const el = viewport.current;
    const inner = content.current;
    if (!el || !inner) return;
    el.scrollTop = el.scrollHeight;
    const pin = () => {
      if (state.current.following) el.scrollTop = el.scrollHeight;
    };
    const observer = new ResizeObserver(pin);
    observer.observe(inner);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onScroll = () => {
    const el = viewport.current;
    if (!el || Date.now() < state.current.jumpingUntil) return;
    setFollow(el.scrollHeight - el.scrollTop - el.clientHeight <= threshold);
  };

  return (
    <div {...rest} className={cx("rk-stick", className)} data-following={following || undefined}>
      <div ref={viewport} className="rk-stick-viewport" onScroll={onScroll}>
        <div ref={content} className="rk-stick-content">
          {children}
        </div>
      </div>
      {!following && (
        <button type="button" className="rk-stick-jump" onClick={() => scrollToBottom()}>
          <ArrowDownIcon />
          {jumpLabel ?? labels.jumpToLatest}
          {unseen ? <span className="rk-stick-unseen rk-num">{unseen}</span> : null}
        </button>
      )}
    </div>
  );
}
