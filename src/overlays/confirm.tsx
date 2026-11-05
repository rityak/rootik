import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "../controls/button";
import { Input } from "../controls/input";
import { Field } from "../forms/field";
import { useLabels } from "../lib/labels";
import type { SvgControlBorder } from "../lib/svg-geometry";
import { Dialog } from "./dialog";
import type { OverlaySurfaceOptions } from "./surface";

export interface ConfirmHostProps {
  surface?: OverlaySurfaceOptions;
  svgBorder?: SvgControlBorder;
}

export interface ConfirmOptions {
  title: ReactNode;
  description?: ReactNode;
  /** Primary button text; default "OK". */
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** `danger`: red primary and Cancel gets the initial focus. */
  tone?: "accent" | "danger";
}

export interface PromptOptions extends Omit<ConfirmOptions, "tone"> {
  /** Field label above the input. */
  label?: ReactNode;
  defaultValue?: string;
  placeholder?: string;
  /** Message keeps the dialog open: empty name, duplicate, bad characters. */
  validate?: (value: string) => string | null | undefined;
}

type Request =
  | { id: number; kind: "confirm"; options: ConfirmOptions; resolve: (ok: boolean) => void }
  | { id: number; kind: "prompt"; options: PromptOptions; resolve: (value: string | null) => void };

let queue: Request[] = [];
let seq = 0;
let hosts = 0;
const listeners = new Set<() => void>();
const emit = () => {
  for (const listener of listeners) listener();
};
const push = (request: Request) => {
  queue = [...queue, request];
  emit();
};
const settle = (id: number) => {
  queue = queue.filter((r) => r.id !== id);
  emit();
};
const text = (node: ReactNode) => (typeof node === "string" || typeof node === "number" ? String(node) : "");

/**
 * `await confirm({ title: "Delete preset?", tone: "danger" })` → true / false. Needs `<ConfirmHost />`
 * mounted once; without it falls back to `window.confirm`.
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  // biome-ignore lint/suspicious/noAlert: fallback when no ConfirmHost is mounted
  if (hosts === 0) return Promise.resolve(window.confirm(text(options.title)));
  return new Promise((resolve) => push({ id: ++seq, kind: "confirm", options, resolve }));
}

/** `await prompt({ title: "Rename", defaultValue })` → the text, or null when cancelled. */
export function prompt(options: PromptOptions): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  // biome-ignore lint/suspicious/noAlert: fallback when no ConfirmHost is mounted
  if (hosts === 0) return Promise.resolve(window.prompt(text(options.title), options.defaultValue));
  return new Promise((resolve) => push({ id: ++seq, kind: "prompt", options, resolve }));
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Mount once (next to the Toaster). Shows queued confirm()/prompt() dialogs one at a time. */
export function ConfirmHost({ surface, svgBorder }: ConfirmHostProps = {}) {
  const list = useSyncExternalStore(
    subscribe,
    () => queue,
    () => queue,
  );
  useEffect(() => {
    hosts++;
    return () => {
      hosts--;
      // StrictMode immediately mounts again; cancel only after the final host has left.
      queueMicrotask(() => {
        if (hosts !== 0 || queue.length === 0) return;
        const cancelled = queue;
        queue = [];
        for (const request of cancelled)
          if (request.kind === "confirm") request.resolve(false);
          else request.resolve(null);
        emit();
      });
    };
  }, []);
  const current = list[0];
  if (!current) return null;
  return current.kind === "confirm" ? (
    <ConfirmDialog key={current.id} request={current} surface={surface} svgBorder={svgBorder} />
  ) : (
    <PromptDialog key={current.id} request={current} surface={surface} svgBorder={svgBorder} />
  );
}

function ConfirmDialog({
  request,
  surface,
  svgBorder,
}: ConfirmHostProps & { request: Extract<Request, { kind: "confirm" }> }) {
  const labels = useLabels();
  const { title, description, confirmLabel, cancelLabel, tone = "accent" } = request.options;
  const done = (ok: boolean) => {
    request.resolve(ok);
    settle(request.id);
  };
  const danger = tone === "danger";
  return (
    <Dialog
      surface={surface}
      size="sm"
      role="alertdialog"
      title={title}
      description={description}
      hideClose
      onClose={() => done(false)}
      footer={
        <>
          <Button svgBorder={svgBorder} autoFocus={danger} onClick={() => done(false)}>
            {cancelLabel ?? labels.cancel}
          </Button>
          <Button
            svgBorder={svgBorder}
            autoFocus={!danger}
            variant={danger ? "danger" : "primary"}
            onClick={() => done(true)}
          >
            {confirmLabel ?? labels.ok}
          </Button>
        </>
      }
    />
  );
}

function PromptDialog({
  request,
  surface,
  svgBorder,
}: ConfirmHostProps & { request: Extract<Request, { kind: "prompt" }> }) {
  const labels = useLabels();
  const {
    title,
    description,
    label,
    defaultValue = "",
    placeholder,
    validate,
    confirmLabel,
    cancelLabel,
  } = request.options;
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.select();
  }, []);
  const done = (result: string | null) => {
    request.resolve(result);
    settle(request.id);
  };
  const submit = () => {
    const problem = validate?.(value);
    if (problem) {
      setError(problem);
      input.current?.focus();
      return;
    }
    done(value);
  };
  return (
    <Dialog
      surface={surface}
      size="sm"
      title={title}
      description={description}
      hideClose
      onClose={() => done(null)}
      footer={
        <>
          <Button svgBorder={svgBorder} onClick={() => done(null)}>
            {cancelLabel ?? labels.cancel}
          </Button>
          <Button svgBorder={svgBorder} variant="primary" type="submit" form={`rk-prompt-${request.id}`}>
            {confirmLabel ?? labels.ok}
          </Button>
        </>
      }
    >
      <form
        id={`rk-prompt-${request.id}`}
        className="rk-prompt-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Field label={label} error={error}>
          <Input
            svgBorder={svgBorder}
            ref={input}
            autoFocus
            value={value}
            placeholder={placeholder}
            onChange={(event) => {
              setValue(event.target.value);
              setError(null);
            }}
          />
        </Field>
      </form>
    </Dialog>
  );
}
