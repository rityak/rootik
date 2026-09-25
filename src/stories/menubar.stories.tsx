import type { Story } from "@ladle/react";
import { useState } from "react";
import {
  Menubar,
  MenubarMenu,
  MenuCheckboxItem,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuSub,
  TitleBar,
} from "..";

export default { title: "Navigation" };

function AppMenus({ onPick }: { onPick: (what: string) => void }) {
  const [sidebar, setSidebar] = useState(true);
  const [statusBar, setStatusBar] = useState(false);
  const pick = (what: string) => () => onPick(what);
  return (
    <Menubar aria-label="Application">
      <MenubarMenu label="File">
        <MenuItem shortcut="Ctrl+N" onSelect={pick("New dataset")}>
          New dataset
        </MenuItem>
        <MenuItem shortcut="Ctrl+O" onSelect={pick("Open…")}>
          Open…
        </MenuItem>
        <MenuSub label="Open recent">
          <MenuItem onSelect={pick("anime-faces")}>anime-faces</MenuItem>
          <MenuItem onSelect={pick("product-shots")}>product-shots</MenuItem>
          <MenuSeparator />
          <MenuItem onSelect={pick("Clear recent")}>Clear recent</MenuItem>
        </MenuSub>
        <MenuSeparator />
        <MenuItem shortcut="Ctrl+S" onSelect={pick("Save")}>
          Save
        </MenuItem>
        <MenuItem shortcut="Ctrl+Shift+E" onSelect={pick("Export…")}>
          Export…
        </MenuItem>
        <MenuSeparator />
        <MenuItem shortcut="Ctrl+Q" onSelect={pick("Quit")}>
          Quit
        </MenuItem>
      </MenubarMenu>
      <MenubarMenu label="Edit">
        <MenuItem shortcut="Ctrl+Z" onSelect={pick("Undo")}>
          Undo
        </MenuItem>
        <MenuItem shortcut="Ctrl+Shift+Z" disabled>
          Redo
        </MenuItem>
        <MenuSeparator />
        <MenuItem shortcut="Ctrl+A" onSelect={pick("Select all")}>
          Select all
        </MenuItem>
        <MenuItem shortcut="Ctrl+F" onSelect={pick("Find")}>
          Find
        </MenuItem>
      </MenubarMenu>
      <MenubarMenu label="View">
        <MenuLabel>Panels</MenuLabel>
        <MenuCheckboxItem checked={sidebar} onCheckedChange={setSidebar} shortcut="Ctrl+B">
          Sidebar
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
          Status bar
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuItem shortcut="F11" onSelect={pick("Full screen")}>
          Full screen
        </MenuItem>
      </MenubarMenu>
      <MenubarMenu label="Run">
        <MenuItem shortcut="F5" onSelect={pick("Start training")}>
          Start training
        </MenuItem>
        <MenuItem danger onSelect={pick("Stop")}>
          Stop
        </MenuItem>
      </MenubarMenu>
      <MenubarMenu label="Help" disabled>
        <MenuItem>About</MenuItem>
      </MenubarMenu>
    </Menubar>
  );
}

export const MenubarInTitleBar: Story = () => {
  const [last, setLast] = useState<string>("—");
  return (
    <div className="story-col" style={{ maxWidth: 900 }}>
      <TitleBar
        className="rk-surface"
        start={
          <>
            <strong style={{ padding: "0 8px 0 4px" }}>Dataset Toolkit</strong>
            <AppMenus onPick={setLast} />
          </>
        }
        onMinimize={() => undefined}
        onMaximize={() => undefined}
        onClose={() => undefined}
      />
      <p style={{ margin: 0, color: "var(--rk-text-3)" }}>
        Tab to the bar, ←/→ between menus, ↓/Enter open, ↑ opens at the bottom, hover switches once a menu is
        open, Esc closes. Last picked: {last}
      </p>
    </div>
  );
};
