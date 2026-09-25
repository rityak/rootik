import type { Story } from "@ladle/react";
import { Card, JsonView } from "..";

export default { title: "Display" };

const CONFIG = {
  model: "sdxl-base-1.0",
  run: { id: "run_2026_09_25_0931", started: new Date(Date.UTC(2026, 8, 25, 9, 31)), resumed: false },
  training: {
    epochs: 10,
    learning_rate: 0.0001,
    "lr scheduler": "cosine_with_restarts",
    batch_size: 4,
    mixed_precision: "bf16",
    optimizer: { name: "AdamW8bit", betas: [0.9, 0.999], weight_decay: 0.01 },
  },
  dataset: {
    path: "D:/datasets/anime-faces",
    images: 2412,
    buckets: [
      [1024, 1024],
      [832, 1216],
      [1216, 832],
    ],
    caption_extension: ".txt",
    shuffle_tags: true,
    keep_tokens: 1,
    comment: null,
    long_prompt:
      "masterpiece, best quality, 1girl, solo, long hair, looking at viewer, smile, bangs, simple background, shirt, long sleeves, holding, closed mouth, upper body, white shirt, collared shirt, hand up, black eyes",
  },
  tags: ["lora", "sdxl", "faces"],
};

export const Json: Story = () => (
  <Card
    title="Run config"
    description="Hover or focus a row to copy its value or path (c / p on the keyboard)"
    style={{ maxWidth: 620 }}
  >
    <JsonView aria-label="Run config" data={CONFIG} defaultExpandDepth={2} maxStringLength={80} />
  </Card>
);
