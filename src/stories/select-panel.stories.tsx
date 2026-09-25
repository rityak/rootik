import type { Story } from "@ladle/react";
import { ArrowDownUp, Filter, Tags } from "lucide-react";
import { useState } from "react";
import { Badge, Button, SelectPanel } from "..";

export default { title: "Inputs" };

const tags = [
  ["1girl", 18204],
  ["solo", 15320],
  ["long hair", 9812],
  ["smile", 8744],
  ["blue eyes", 6120],
  ["school uniform", 4471],
  ["outdoors", 3902],
  ["cherry blossoms", 1260],
  ["depth of field", 1104],
  ["masterpiece", 980],
] as const;

export const FilterPanels: Story = () => {
  const [picked, setPicked] = useState<string[]>(["solo", "smile"]);
  const [status, setStatus] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>(["newest"]);
  return (
    <div className="story-row" style={{ alignItems: "flex-start", minHeight: 460 }}>
      <SelectPanel
        title="Filter by tag"
        options={tags.map(([t, n]) => ({ value: t, label: t, count: n.toLocaleString("en") }))}
        value={picked}
        onChange={setPicked}
        trigger={
          <Button icon={<Tags />}>
            Tags {picked.length > 0 && <Badge size="sm">{picked.length}</Badge>}
          </Button>
        }
      />
      <SelectPanel
        deferred
        options={[
          { value: "tagged", label: "Tagged", count: 46210 },
          { value: "untagged", label: "Untagged", count: 2000 },
          { value: "flagged", label: "Flagged", count: 38 },
          { value: "duplicate", label: "Duplicate", count: 112 },
        ]}
        value={status}
        onChange={setStatus}
        trigger={
          <Button variant="ghost" icon={<Filter />}>
            Status{status.length > 0 ? `: ${status.join(", ")}` : ""}
          </Button>
        }
      />
      <SelectPanel
        single
        options={[
          { value: "newest", label: "Newest first" },
          { value: "oldest", label: "Oldest first" },
          { value: "name", label: "Name" },
          { value: "size", label: "File size" },
        ]}
        value={sort}
        onChange={setSort}
        trigger={
          <Button variant="ghost" icon={<ArrowDownUp />}>
            Sort
          </Button>
        }
      />
    </div>
  );
};
