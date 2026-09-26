import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, ShortcutsSheet, toast, useHotkey, useHotkeys } from "..";

export default { title: "Utilities" };

export const Shortcuts: Story = () => {
  const [open, setOpen] = useState(false);
  useHotkey("mod+s", () => toast("Saved"), { description: "Save", group: "File" });
  useHotkey("mod+o", () => toast("Open…"), { description: "Open dataset", group: "File" });
  useHotkey("j", () => toast("Next image"), { description: "Next image", group: "Gallery" });
  useHotkey("k", () => toast("Previous image"), { description: "Previous image", group: "Gallery" });
  // the same source feeds anything else, e.g. CommandPalette hints
  const hotkeys = useHotkeys();
  return (
    <div className="story-col" style={{ maxWidth: 420 }}>
      <p style={{ margin: 0, color: "var(--rk-text-3)" }}>
        Press <kbd className="rk-kbd">?</kbd> or the button; {hotkeys.length} shortcuts registered.
      </p>
      <Button onClick={() => setOpen(true)}>Keyboard shortcuts</Button>
      <ShortcutsSheet open={open} onOpenChange={setOpen} />
    </div>
  );
};
