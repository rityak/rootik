import {
  createContext,
  type FormHTMLAttributes,
  type ReactNode,
  type SyntheticEvent,
  useContext,
  useState,
} from "react";
import { cx } from "../lib/cx";

/** Errors by control id, read by Field as its default `error`. */
const FormErrors = createContext<Record<string, string>>({});

export const useFormError = (controlId: string | undefined) => {
  const errors = useContext(FormErrors);
  return controlId ? errors[controlId] : undefined;
};

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const isControl = (el: Element): el is Control => "validity" in el && "name" in el;

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Called only when every control is valid. */
  onSubmit?: (data: FormData, event: SyntheticEvent<HTMLFormElement>) => void;
  /** Rules the constraint attributes can't express, by control `name` → message. */
  validate?: (data: FormData) => Record<string, string | undefined> | undefined;
  children: ReactNode;
}

/**
 * Form on the native constraint API: `required`, `min`, `pattern`, `type=email`… on the controls. Submit
 * shows the browser's (localized) messages in each Field, focuses the first invalid control, and clears
 * a message as soon as its control becomes valid.
 */
export function Form({ onSubmit, validate, className, children, ...rest }: FormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const collect = (form: HTMLFormElement) => {
    const custom = validate?.(new FormData(form)) ?? {};
    const next: Record<string, string> = {};
    let first: Control | undefined;
    for (const el of Array.from(form.elements)) {
      if (!isControl(el) || !el.id) continue;
      el.setCustomValidity(custom[el.name] ?? "");
      if (!el.checkValidity()) {
        next[el.id] = el.validationMessage;
        first ??= el;
      }
    }
    return { next, first };
  };

  return (
    <FormErrors value={errors}>
      <form
        noValidate
        {...rest}
        className={cx("rk-form", className)}
        onSubmit={(event) => {
          event.preventDefault();
          const { next, first } = collect(event.currentTarget);
          setErrors(next);
          if (first) first.focus();
          else onSubmit?.(new FormData(event.currentTarget), event);
        }}
        // once shown, an error follows the value: it goes away the moment the control is valid again
        onInput={(event) => {
          const el = event.target as Element;
          if (!isControl(el) || !(el.id in errors)) return;
          const { next } = collect(event.currentTarget);
          setErrors((prev) => {
            const out = { ...prev };
            if (next[el.id]) out[el.id] = next[el.id] as string;
            else delete out[el.id];
            return out;
          });
        }}
      >
        {children}
      </form>
    </FormErrors>
  );
}
