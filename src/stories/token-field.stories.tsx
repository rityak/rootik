import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, Field, TokenField } from "..";

export default { title: "Inputs" };

const tags = [
  "1girl",
  "solo",
  "long hair",
  "short hair",
  "smile",
  "blue eyes",
  "school uniform",
  "outdoors",
  "cherry blossoms",
  "masterpiece",
];
const KNOWN_KEY = /^(tag|status|size|source):/;
const filters = [
  "tag:",
  "status:tagged",
  "status:untagged",
  "status:flagged",
  "size:>512",
  "size:<256",
  "source:scraper",
];

export const Tokens: Story = () => {
  const [caption, setCaption] = useState(["1girl", "solo", "smile"]);
  const [query, setQuery] = useState(["status:flagged", "size:>512"]);
  return (
    <Card title="Tokens" style={{ maxWidth: 480, minHeight: 420 }}>
      <div className="story-col">
        <Field
          label="Caption tags"
          hint="Enter or comma adds, Backspace twice removes the last; paste a comma list"
        >
          <TokenField value={caption} onChange={setCaption} suggestions={tags} placeholder="Add tags…" />
        </Field>
        <Field label="Filter" hint="key:value tokens; only known keys">
          <TokenField
            value={query}
            onChange={setQuery}
            suggestions={filters}
            validate={(t) => (t.includes(":") && !KNOWN_KEY.test(t) ? `Unknown key in “${t}”` : null)}
            placeholder="status:… size:… tag:…"
            size="sm"
          />
        </Field>
        <Field label="At most 3">
          <TokenField defaultValue={["a", "b"]} max={3} />
        </Field>
      </div>
    </Card>
  );
};
