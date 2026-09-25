import type { Story } from "@ladle/react";
import { Copy, Download, Ellipsis, Filter, Pencil, Plus, Settings, Share2, Trash } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  CommandPalette,
  ContextMenu,
  Dialog,
  Drawer,
  Field,
  IconButton,
  Input,
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Popover,
  Select,
  Slider,
  Tooltip,
  toast,
  useHotkey,
} from "..";

export default { title: "Overlays" };

export const Tooltips: Story = () => (
  <div className="story-row" style={{ padding: 60 }}>
    <Tooltip content="Top (default)">
      <Button>Hover me</Button>
    </Tooltip>
    <Tooltip content="Saves the preset" shortcut="Ctrl+S" placement="bottom">
      <Button variant="primary">With shortcut</Button>
    </Tooltip>
    <Tooltip content="Right side" placement="right">
      <Button variant="ghost">Right</Button>
    </Tooltip>
    <IconButton icon={<Settings />} label="IconButton labels are tooltips" />
  </div>
);

export const Menus: Story = () => {
  const [wrap, setWrap] = useState(true);
  const [grid, setGrid] = useState(false);
  return (
    <div className="story-row" style={{ alignItems: "flex-start" }}>
      <Menu trigger={<Button iconEnd={<Ellipsis />}>Actions</Button>}>
        <MenuItem icon={<Pencil />} shortcut="F2">
          Rename
        </MenuItem>
        <MenuItem icon={<Copy />} shortcut="Ctrl+D">
          Duplicate
        </MenuItem>
        <MenuItem icon={<Share2 />} hint="Copies a link to clipboard">
          Share
        </MenuItem>
        <MenuItem icon={<Download />} disabled>
          Export (soon)
        </MenuItem>
        <MenuSeparator />
        <MenuLabel>View</MenuLabel>
        <MenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
          Word wrap
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
          Show grid
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuItem icon={<Trash />} danger onSelect={() => toast.error("Deleted")}>
          Delete
        </MenuItem>
      </Menu>
      <Menu
        placement="bottom-end"
        trigger={<IconButton icon={<Ellipsis />} label="More" variant="secondary" />}
      >
        <MenuItem>Aligned to the end</MenuItem>
        <MenuItem>Second item</MenuItem>
      </Menu>
      <ContextMenu
        content={
          <>
            <MenuItem icon={<Copy />}>Copy path</MenuItem>
            <MenuItem icon={<Plus />}>New folder</MenuItem>
            <MenuSeparator />
            <MenuItem icon={<Trash />} danger>
              Move to trash
            </MenuItem>
          </>
        }
      >
        <div
          style={{
            width: 280,
            height: 140,
            display: "grid",
            placeItems: "center",
            borderRadius: 14,
            background: "var(--rk-hatch), var(--rk-surface-1)",
            color: "var(--rk-text-3)",
          }}
        >
          Right-click here
        </div>
      </ContextMenu>
    </div>
  );
};

export const Popovers: Story = () => (
  <Popover title="Filters" trigger={<Button icon={<Filter />}>Filters</Button>}>
    <div className="story-col" style={{ width: 260, gap: 12 }}>
      <Field label="Min resolution">
        <Select
          size="sm"
          defaultValue="512"
          options={["512", "768", "1024"].map((v) => ({ value: v, label: `${v}px` }))}
        />
      </Field>
      <Slider label="Aesthetic ≥" defaultValue={5} min={0} max={10} step={0.5} showValue />
      <Checkbox label="Only captioned" defaultChecked />
      <Button variant="primary" size="sm" block>
        Apply
      </Button>
    </div>
  </Popover>
);

export const Dialogs: Story = () => {
  const [open, setOpen] = useState<null | "dialog" | "drawer" | "sheet" | "confirm">(null);
  const close = () => setOpen(null);
  return (
    <div className="story-row">
      <Button onClick={() => setOpen("dialog")}>Dialog</Button>
      <Button onClick={() => setOpen("drawer")}>Drawer</Button>
      <Button onClick={() => setOpen("sheet")}>Bottom sheet</Button>
      <Button variant="danger" onClick={() => setOpen("confirm")}>
        Confirm
      </Button>

      <Dialog
        open={open === "dialog"}
        onClose={close}
        title="Save preset"
        description="Presets keep the whole graph and its parameters"
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={close}>
              Save
            </Button>
          </>
        }
      >
        <div className="story-col">
          <Field label="Name">
            <Input placeholder="Caption + tag cleanup" />
          </Field>
          <Field label="Folder">
            <Select
              defaultValue="root"
              options={[
                { value: "root", label: "/" },
                { value: "tag", label: "/tagging" },
              ]}
            />
          </Field>
        </div>
      </Dialog>
      <Drawer open={open === "drawer"} onClose={close} title="Node settings">
        <div className="story-col">
          <Field label="Name">
            <Input defaultValue="JP · Tokyo 03" />
          </Field>
          <Slider
            label="Timeout"
            defaultValue={5000}
            min={1000}
            max={10000}
            step={500}
            showValue={(v) => `${v} ms`}
          />
        </div>
      </Drawer>
      <Dialog open={open === "sheet"} onClose={close} placement="bottom" title="Bottom sheet">
        Mobile-style sheet docked to the bottom edge.
      </Dialog>
      <Dialog
        open={open === "confirm"}
        onClose={close}
        size="sm"
        title="Delete 12 images?"
        description="They go to the system trash."
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                close();
                toast.error("12 images deleted", { action: { label: "Undo", onClick: () => {} } });
              }}
            >
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
};

export const Toasts: Story = () => (
  <div className="story-row">
    <Button onClick={() => toast("Preset saved")}>Plain</Button>
    <Button
      onClick={() =>
        toast.success("Training finished", { description: "anima-v4 · 6,000 steps · loss 0.241" })
      }
    >
      Success
    </Button>
    <Button onClick={() => toast.warn("VRAM almost full", { description: "22.9 / 24 GB" })}>Warn</Button>
    <Button
      onClick={() =>
        toast.error("Core crashed", { action: { label: "Restart", onClick: () => {} }, duration: 0 })
      }
    >
      Error (sticky)
    </Button>
    <Button
      onClick={() => {
        const id = toast({ title: "Downloading core…", loading: true });
        setTimeout(() => toast({ id, title: "Core 1.19.2 installed", tone: "success" }), 2000);
      }}
    >
      Loading → done
    </Button>
  </div>
);

export const Commands: Story = () => {
  const [open, setOpen] = useState(false);
  useHotkey("mod+k", () => setOpen(true));
  return (
    <Card style={{ maxWidth: 420 }}>
      <Button onClick={() => setOpen(true)}>Open palette (Ctrl/⌘ K)</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={[
          { id: "1", group: "Navigate", label: "Gallery", run: () => {} },
          { id: "2", group: "Navigate", label: "Training", run: () => {} },
          { id: "3", group: "Navigate", label: "Analysis", run: () => {} },
          {
            id: "4",
            group: "Actions",
            label: "New run",
            icon: <Plus />,
            shortcut: "mod+n",
            run: () => toast("New run"),
          },
          {
            id: "5",
            group: "Actions",
            label: "Settings",
            icon: <Settings />,
            keywords: "preferences appearance",
            run: () => {},
          },
        ]}
      />
    </Card>
  );
};
