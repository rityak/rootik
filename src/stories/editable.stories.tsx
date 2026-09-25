import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, Editable, KeyValue, Table } from "..";

export default { title: "Inputs" };

const taken = ["anime-faces-v3", "scenery-mix"];

export const InPlaceEditing: Story = () => {
  const [title, setTitle] = useState("Training run #42");
  return (
    <div className="story-col" style={{ maxWidth: 480 }}>
      <Card title={<Editable value={title} onChange={setTitle} label="Rename run" />}>
        <KeyValue
          items={[
            { label: "Profile", value: <Editable defaultValue="Work laptop" /> },
            { label: "Tag", value: <Editable defaultValue="" placeholder="Add a tag" mono /> },
            { label: "Locked", value: <Editable defaultValue="Default" disabled /> },
          ]}
        />
      </Card>
      <Table framed>
        <thead>
          <tr>
            <th>Dataset (rename to “anime-faces-v3” to see validation)</th>
          </tr>
        </thead>
        <tbody>
          {["portraits-2024", "scenery-mix"].map((name) => (
            <tr key={name}>
              <td>
                <Editable
                  defaultValue={name}
                  validate={(v) => (v !== name && taken.includes(v) ? `“${v}” already exists` : null)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
