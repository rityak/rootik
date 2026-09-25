import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, Dialog, Drawer, Menu, MenuItem, Popover } from "..";

export default { title: "Overlays" };

export const EnterAndExit: Story = () => {
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  return (
    <div className="story-row" style={{ minHeight: 300, alignItems: "flex-start" }}>
      <Button onClick={() => setDialog(true)}>Dialog</Button>
      <Button onClick={() => setDrawer(true)}>Drawer</Button>
      <Menu trigger={<Button>Menu</Button>}>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Duplicate</MenuItem>
      </Menu>
      <Popover title="Details" trigger={<Button>Popover</Button>}>
        Fades out as smoothly as it fades in.
      </Popover>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Leaving is animated too"
        description="Esc, the close button or a backdrop click play the exit."
        footer={<Button onClick={() => setDialog(false)}>Close</Button>}
      />
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Inspector">
        Slides back to the edge on close.
      </Drawer>
    </div>
  );
};
