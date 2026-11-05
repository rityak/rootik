import { cx } from "../lib/cx";
import { useControllable } from "../lib/hooks";
import { EyeIcon, EyeOffIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";
import { Input, type InputProps } from "./input";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  /** Shown as plain text. */
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

/**
 * Password field with a reveal toggle. The toggle keeps the caret in the field (it doesn't take focus
 * on click), reports its state with aria-pressed, and the field keeps `autocomplete` for managers.
 */
export function PasswordInput({
  visible,
  defaultVisible = false,
  onVisibleChange,
  end,
  className,
  autoComplete = "current-password",
  ...rest
}: PasswordInputProps) {
  const labels = useLabels();
  const [shown, setShown] = useControllable(visible, defaultVisible, onVisibleChange);
  return (
    <Input
      {...rest}
      className={cx("rk-password", className)}
      type={shown ? "text" : "password"}
      autoComplete={autoComplete}
      // revealed text shouldn't be corrected or capitalized either
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      end={
        <>
          {end}
          <button
            type="button"
            className="rk-password-toggle"
            aria-label={shown ? labels.hidePassword : labels.showPassword}
            aria-pressed={shown}
            disabled={rest.disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setShown(!shown)}
          >
            {shown ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </>
      }
    />
  );
}
