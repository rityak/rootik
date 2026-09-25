import type { Story } from "@ladle/react";
import { Copy, Download, FileJson, FileText, FolderOpen, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, IconButton, Menu, MenuCheckboxItem, MenuItem, MenuSeparator, MenuSub } from "..";

export default { title: "Overlays" };

export const Submenus: Story = () => {
  const [last, setLast] = useState("—");
  const [thumbs, setThumbs] = useState(true);
  return (
    <div className="story-row" style={{ alignItems: "flex-start", minHeight: 360 }}>
      <Menu trigger={<Button icon={<MoreHorizontal />}>Dataset</Button>}>
        <MenuItem icon={<FolderOpen />} shortcut="mod+o" onSelect={() => setLast("Open")}>
          Open
        </MenuItem>
        <MenuSub label="Export as" icon={<Download />}>
          <MenuItem icon={<FileJson />} onSelect={() => setLast("Export JSONL")}>
            JSONL
          </MenuItem>
          <MenuItem icon={<FileText />} onSelect={() => setLast("Export CSV")}>
            CSV
          </MenuItem>
          <MenuSub label="Captions" icon={<FileText />}>
            <MenuItem onSelect={() => setLast("Captions .txt per image")}>.txt per image</MenuItem>
            <MenuItem onSelect={() => setLast("Captions in one file")}>One file</MenuItem>
          </MenuSub>
        </MenuSub>
        <MenuSub label="Share" icon={<Share2 />} disabled>
          <MenuItem>Link</MenuItem>
        </MenuSub>
        <MenuSub label="View" icon={<Copy />}>
          <MenuCheckboxItem checked={thumbs} onCheckedChange={setThumbs}>
            Thumbnails
          </MenuCheckboxItem>
        </MenuSub>
        <MenuSeparator />
        <MenuItem icon={<Trash2 />} danger onSelect={() => setLast("Delete")}>
          Delete
        </MenuItem>
      </Menu>
      <IconButton icon={<MoreHorizontal />} label="Unused" variant="ghost" />
      <span style={{ color: "var(--rk-text-2)" }}>Last action: {last}</span>
    </div>
  );
};
