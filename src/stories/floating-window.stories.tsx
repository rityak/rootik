import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, FloatingWindow, KeyValue } from "..";

export default { title: "Layout" };

export const FloatingWindows: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={open}>
        Open inspector
      </Button>
      {open && (
        <FloatingWindow
          title="Inspector · sample_0001.png"
          onClose={() => setOpen(false)}
          defaultPosition={{ x: 220, y: 60 }}
        >
          <KeyValue
            items={[
              { label: "Size", value: "2400 × 1600" },
              { label: "Tags", value: "1girl, solo, smile" },
              { label: "Aesthetic", value: "6.4" },
            ]}
          />
        </FloatingWindow>
      )}
    </>
  );
};
