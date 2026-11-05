import { type DragEvent, type HTMLAttributes, type ReactNode, useRef, useState } from "react";
import { cx } from "../lib/cx";
import { UploadIcon } from "../lib/icons";
import { useLabels } from "../lib/labels";

/** `accept` like the input attribute: ".png,.zip", "image/*", "application/json". */
export function acceptsFile(file: { name: string; type: string }, accept: string | undefined) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) =>
      rule.startsWith(".")
        ? name.endsWith(rule)
        : rule.endsWith("/*")
          ? type.startsWith(rule.slice(0, -1))
          : type === rule,
    );
}

export interface FileRejection {
  file: File;
  reason: "type" | "size" | "count";
}

export interface FileDropProps extends Omit<HTMLAttributes<HTMLDivElement>, "onDrop"> {
  onFiles: (files: File[]) => void;
  /** Files that failed `accept`, `maxSize` or `maxFiles`. */
  onReject?: (rejected: FileRejection[]) => void;
  accept?: string;
  multiple?: boolean;
  /** Bytes per file. */
  maxSize?: number;
  maxFiles?: number;
  /** Pick a folder in the browse dialog (drops can always contain files from folders). */
  directory?: boolean;
  disabled?: boolean;
  /** Small print under the prompt: "PNG, JPG up to 20 MB". */
  hint?: ReactNode;
  icon?: ReactNode;
  /** `sm` — one-line strip instead of a tall zone. */
  size?: "sm" | "md";
  /** Replaces the default prompt. */
  children?: ReactNode;
}

/**
 * Hatched drop zone with a browse button (keyboard path). Validates type, size and count, reports
 * accepted files and rejections separately. In Tauri, window-level file drops must be allowed
 * (`dragDropEnabled: false`) for HTML drag events to reach the page.
 */
export function FileDrop({
  onFiles,
  onReject,
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  directory,
  disabled,
  hint,
  icon,
  size = "md",
  className,
  children,
  ...rest
}: FileDropProps) {
  const labels = useLabels();
  const input = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);

  const take = (list: FileList | null) => {
    if (!list || disabled) return;
    const ok: File[] = [];
    const bad: FileRejection[] = [];
    const limit = multiple ? (maxFiles ?? Number.POSITIVE_INFINITY) : 1;
    for (const file of Array.from(list)) {
      if (!acceptsFile(file, accept)) bad.push({ file, reason: "type" });
      else if (maxSize !== undefined && file.size > maxSize) bad.push({ file, reason: "size" });
      else if (ok.length >= limit) bad.push({ file, reason: "count" });
      else ok.push(file);
    }
    if (ok.length > 0) onFiles(ok);
    if (bad.length > 0) onReject?.(bad);
  };

  const drag = {
    onDragEnter: (event: DragEvent) => {
      if (disabled || !event.dataTransfer.types.includes("Files")) return;
      event.preventDefault();
      depth.current++;
      setDragging(true);
    },
    onDragOver: (event: DragEvent) => {
      if (disabled || !event.dataTransfer.types.includes("Files")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    // children fire their own enter/leave: count them so the highlight doesn't flicker
    onDragLeave: () => {
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setDragging(false);
    },
    onDrop: (event: DragEvent) => {
      event.preventDefault();
      depth.current = 0;
      setDragging(false);
      take(event.dataTransfer.files);
    },
  };

  return (
    <div
      {...rest}
      {...drag}
      className={cx("rk-file-drop", className)}
      data-size={size}
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        ref={input}
        type="file"
        className="rk-sr-only"
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        {...(directory ? { webkitdirectory: "" } : {})}
        onChange={(event) => {
          take(event.target.files);
          event.target.value = "";
        }}
      />
      {children ?? (
        <>
          <span className="rk-file-drop-icon rk-icon">{icon ?? <UploadIcon />}</span>
          <span className="rk-file-drop-text">
            <span>
              {labels.dropFiles}{" "}
              <button
                type="button"
                className="rk-file-drop-browse"
                disabled={disabled}
                onClick={() => input.current?.click()}
              >
                {labels.browseFiles}
              </button>
            </span>
            {hint && <span className="rk-file-drop-hint">{hint}</span>}
          </span>
        </>
      )}
    </div>
  );
}
