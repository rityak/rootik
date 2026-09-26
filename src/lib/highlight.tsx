import { type HTMLAttributes, type RefObject, useLayoutEffect, useRef } from "react";
import { cx } from "./cx";

// every mounted user contributes its ranges to one shared registry entry
const owners = new Map<object, Range[]>();
const NAME = "rk-match";
const WHITESPACE = /\s+/;

function publish() {
  if (typeof CSS === "undefined" || !("highlights" in CSS)) return;
  const all = [...owners.values()].flat();
  if (all.length === 0) CSS.highlights.delete(NAME);
  // the global, not the component below
  else CSS.highlights.set(NAME, new globalThis.Highlight(...all));
}

/** Ranges of every query word (case-insensitive) in the text under `root`, optionally only inside `selector`. */
export function findRanges(root: Node, query: string, selector?: string): Range[] {
  const words = query.toLowerCase().split(WHITESPACE).filter(Boolean);
  if (words.length === 0) return [];
  const ranges: Range[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (selector && !node.parentElement?.closest(selector)) continue;
    const text = node.textContent?.toLowerCase() ?? "";
    for (const w of words) {
      for (let i = text.indexOf(w); i !== -1; i = text.indexOf(w, i + w.length)) {
        const range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + w.length);
        ranges.push(range);
      }
    }
  }
  return ranges;
}

/**
 * Marks matches of `query` under `ref` with the CSS Custom Highlight API: no DOM wrapping, so React's
 * tree and text selection stay intact. Re-scans after every render of the caller. No-op where unsupported.
 */
export function useHighlight(ref: RefObject<Element | null>, query: string, selector?: string) {
  const self = useRef({});
  useLayoutEffect(() => {
    const el = ref.current;
    const key = self.current;
    owners.set(key, el ? findRanges(el, query, selector) : []);
    publish();
    return () => {
      owners.delete(key);
      publish();
    };
  });
}

export interface HighlightProps extends HTMLAttributes<HTMLSpanElement> {
  query: string;
}

/** Text with `query` matches highlighted (search results, filtered lists). */
export function Highlight({ query, className, ...rest }: HighlightProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useHighlight(ref, query);
  return <span ref={ref} {...rest} className={cx("rk-highlight", className)} />;
}
