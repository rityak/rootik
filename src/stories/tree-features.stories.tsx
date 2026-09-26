import type { Story } from "@ladle/react";
import { File, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, SearchInput, Tree, type TreeDropPosition, type TreeNode } from "..";

export default { title: "Data" };

const file = (id: string, label = id): TreeNode => ({ id, label, icon: <File /> });
const dir = (id: string, children: TreeNode[], label = id): TreeNode => ({
  id,
  label,
  icon: <Folder />,
  children,
});

const FILES: TreeNode[] = [
  dir("datasets", [
    dir("anime-faces-v3", [
      file("train.json"),
      file("val.json"),
      dir("images", [file("0001.png"), file("0002.png")]),
    ]),
    dir("scenery-mix", [file("captions.txt"), file("tags.csv")]),
  ]),
  dir("models", [file("anima-v4.safetensors"), file("anima-v3.safetensors")]),
  file("README.md"),
];

// move `id` next to / into `target` in a plain nested array (what an app does in onMove)
function moveNode(nodes: TreeNode[], id: string, target: string, pos: TreeDropPosition): TreeNode[] {
  let moving: TreeNode | undefined;
  const without = (list: TreeNode[]): TreeNode[] =>
    list.flatMap((n) => {
      if (n.id === id) {
        moving = n;
        return [];
      }
      return [n.children ? { ...n, children: without(n.children) } : n];
    });
  const place = (list: TreeNode[]): TreeNode[] =>
    list.flatMap((n) => {
      if (n.id !== target || !moving) return [n.children ? { ...n, children: place(n.children) } : n];
      if (pos === "inside") return [{ ...n, children: [...(n.children ?? []), moving] }];
      return pos === "before" ? [moving, n] : [n, moving];
    });
  return place(without(nodes));
}

export const TreeFeatures: Story = () => {
  const [items, setItems] = useState(FILES);
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<string[]>(["train.json"]);
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <div
      className="story-grid"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}
    >
      <Card title="Filter + drag & drop" description="Type to filter; drag rows to move them">
        <div className="story-col" style={{ gap: 8 }}>
          <SearchInput
            size="sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
          <Tree
            aria-label="Files"
            items={items}
            filter={query}
            defaultExpanded={["datasets", "models"]}
            onMove={(id, target, pos) => setItems((list) => moveNode(list, id, target, pos))}
          />
        </div>
      </Card>
      <Card title="Checkboxes" description={`${checked.length} files checked`}>
        <Tree
          aria-label="Export"
          items={FILES}
          checkable
          checked={checked}
          onCheckedChange={setChecked}
          defaultExpanded={["datasets", "anime-faces-v3"]}
        />
      </Card>
      <Card title="Multi-select" description={picked.join(", ") || "Ctrl/Shift-click, Space, Ctrl+A"}>
        <Tree
          aria-label="Pick"
          items={FILES}
          selectionMode="multiple"
          selectedIds={picked}
          onSelectionChange={setPicked}
          defaultExpanded={["datasets", "models"]}
        />
      </Card>
    </div>
  );
};

export const TreeVirtual: Story = () => {
  const big = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) =>
        dir(
          `layer.${i}`,
          Array.from({ length: 50 }, (__, j) => file(`layer.${i}.w${j}`, `weight_${j}  [4096 × 4096]`)),
          `layer.${i}`,
        ),
      ),
    [],
  );
  return (
    <Card title="10,200 nodes" description="height={360}: only visible rows render" style={{ maxWidth: 420 }}>
      <Tree
        aria-label="Tensors"
        items={big}
        height={360}
        defaultExpanded={["layer.0", "layer.1", "layer.2"]}
      />
    </Card>
  );
};
