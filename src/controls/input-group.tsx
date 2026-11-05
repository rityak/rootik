import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Stretch to the container width (the input part grows). */
  block?: boolean;
}

/**
 * Joins inputs, selects, buttons and InputAddon text segments into one control: shared edges, outer
 * corners only, and the focused part stays on top so its ring isn't covered.
 */
export function InputGroup({ block, className, ...rest }: InputGroupProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset can't be an inline flex row of joined parts
    <div role="group" {...rest} className={cx("rk-input-group", className)} data-block={block || undefined} />
  );
}

export interface InputAddonProps extends HTMLAttributes<HTMLSpanElement> {
  mono?: boolean;
}

/** Static text segment in an InputGroup: `https://`, `.com`, `px`, `ms`. */
export function InputAddon({ mono, className, ...rest }: InputAddonProps) {
  return <span {...rest} className={cx("rk-input-addon", className)} data-mono={mono || undefined} />;
}
