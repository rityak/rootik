import { createContext, useContext } from "react";
import { cx } from "./cx";

interface FieldCtx {
  id: string;
  /** Id of the visible label, for group controls a <label for> can't name (radiogroups, swatches). */
  labelId?: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

export const FieldContext = createContext<FieldCtx | null>(null);

/** Wires a control to the surrounding <Field>: id for the label, hint/error for aria-describedby. */
export function useField(props: {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: unknown;
  "aria-required"?: unknown;
}) {
  const field = useContext(FieldContext);
  return {
    id: props.id ?? field?.id,
    "aria-describedby": cx(props["aria-describedby"], field?.describedBy) || undefined,
    "aria-invalid": (props["aria-invalid"] as boolean | undefined) ?? (field?.invalid || undefined),
    "aria-required": (props["aria-required"] as boolean | undefined) ?? (field?.required || undefined),
  };
}

/** The surrounding Field's label id: group controls pass it as aria-labelledby. */
export function useFieldLabel(): string | undefined {
  return useContext(FieldContext)?.labelId;
}
