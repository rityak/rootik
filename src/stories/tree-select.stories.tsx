import type { Story } from "@ladle/react";
import { Folder } from "lucide-react";
import { useState } from "react";
import { Field, type TreeNode, TreeSelect } from "..";

export default { title: "Inputs" };

const dir = (id: string, children?: TreeNode[]): TreeNode => ({
  id,
  label: id.split("/").at(-1) ?? id,
  icon: <Folder />,
  children,
});

const FOLDERS: TreeNode[] = [
  dir("datasets", [
    dir("datasets/anime-faces-v3", [
      dir("datasets/anime-faces-v3/train"),
      dir("datasets/anime-faces-v3/val"),
    ]),
    dir("datasets/scenery-mix"),
  ]),
  dir("exports", [dir("exports/2026-09"), dir("exports/2026-08")]),
];

export const TreeSelects: Story = () => {
  const [folder, setFolder] = useState<string | null>("datasets/anime-faces-v3/val");
  const [many, setMany] = useState<string[]>([]);
  return (
    <div className="story-col" style={{ maxWidth: 320, gap: 16 }}>
      <Field label="Output folder" hint={folder ?? "Nothing picked"}>
        <TreeSelect items={FOLDERS} value={folder} onChange={setFolder} />
      </Field>
      <Field label="Include folders">
        <TreeSelect
          items={FOLDERS}
          multiple
          values={many}
          onValuesChange={setMany}
          placeholder="All folders"
        />
      </Field>
    </div>
  );
};
