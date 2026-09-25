import type { Story } from "@ladle/react";
import { Download, Tag, Trash2 } from "lucide-react";
import { Button, Checkbox, IconButton, SelectionBar, Table, useSelection } from "..";

export default { title: "Overlays" };

const files = Array.from({ length: 8 }, (_, i) => ({
  id: `img_${String(i + 1).padStart(4, "0")}.png`,
  size: 180 + i * 37,
}));

export const Selection: Story = () => {
  const sel = useSelection({ keys: files.map((f) => f.id), defaultValue: ["img_0002.png", "img_0003.png"] });
  return (
    <div style={{ maxWidth: 520, paddingBottom: 90 }}>
      <Table framed density="compact">
        <thead>
          <tr>
            <th style={{ width: 36 }}>
              <Checkbox
                aria-label="Select all"
                checked={sel.allSelected}
                indeterminate={sel.someSelected}
                onChange={() => (sel.allSelected ? sel.clear() : sel.selectAll())}
              />
            </th>
            <th>File (Shift+click for ranges)</th>
            <th style={{ textAlign: "end" }}>KB</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f.id}>
              <td>
                <Checkbox
                  aria-label={`Select ${f.id}`}
                  checked={sel.isSelected(f.id)}
                  onChange={(e) => sel.toggle(f.id, (e.nativeEvent as MouseEvent).shiftKey)}
                />
              </td>
              <td className="rk-mono">{f.id}</td>
              <td className="rk-num" style={{ textAlign: "end" }}>
                {f.size}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <SelectionBar count={sel.count} onClear={sel.clear}>
        <Button size="sm" variant="ghost" icon={<Tag />}>
          Tag
        </Button>
        <Button size="sm" variant="ghost" icon={<Download />}>
          Export
        </Button>
        <IconButton size="sm" variant="ghost" icon={<Trash2 />} label="Delete" />
      </SelectionBar>
    </div>
  );
};
