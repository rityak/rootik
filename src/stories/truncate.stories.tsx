import type { Story } from "@ladle/react";
import { Card, Table, Truncate } from "..";

export default { title: "Display" };

const path = "D:/datasets/anime-faces-v3/train/images/2024-06/batch-017/img_004213_crop_512.png";

export const Truncation: Story = () => (
  <div className="story-col" style={{ maxWidth: 560 }}>
    <Card title="Drag the corner: tooltips appear only while text is cut">
      <div style={{ resize: "horizontal", overflow: "hidden", width: 280, minWidth: 120, maxWidth: 520 }}>
        <div className="story-col">
          <Truncate>Short label</Truncate>
          <Truncate>Frankfurt · Hetzner FSN1 · 94.130.12.7 · WireGuard over UDP 51820</Truncate>
          <Truncate middle={18}>{path}</Truncate>
          <Truncate lines={2}>
            Caption: 1girl, solo, long hair, looking at viewer, smile, blue eyes, school uniform, outdoors,
            cherry blossoms, depth of field, masterpiece
          </Truncate>
        </div>
      </div>
    </Card>
    <Table framed density="compact" style={{ tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th style={{ width: "40%" }}>File</th>
          <th>Hash</th>
        </tr>
      </thead>
      <tbody>
        {["img_0001.png", "img_000213_with_a_very_long_generated_name_from_the_scraper.png"].map((f) => (
          <tr key={f}>
            <td>
              <Truncate>{f}</Truncate>
            </td>
            <td className="rk-mono">
              <Truncate middle={6}>
                sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
              </Truncate>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);
