import type { Story } from "@ladle/react";
import { useState } from "react";
import { Highlight, SearchInput } from "..";

export default { title: "Display" };

const TAGS = ["1girl", "long_hair", "looking_at_viewer", "smile", "short_hair", "outdoors", "hair_ornament"];

export const Highlights: Story = () => {
  const [query, setQuery] = useState("hair");
  return (
    <div className="story-col" style={{ maxWidth: 360 }}>
      <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} />
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
        {TAGS.filter((t) => t.includes(query.trim().toLowerCase())).map((t) => (
          <li key={t}>
            <Highlight query={query}>{t}</Highlight>
          </li>
        ))}
      </ul>
    </div>
  );
};
