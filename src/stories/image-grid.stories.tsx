import type { Story } from "@ladle/react";
import { TagIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, ImageGrid, type ImageGridItem, SelectionBar, Thumbnail } from "..";

export default { title: "Data" };

/** Tiny generated images: no network, varied hue and aspect. */
const art = (i: number, w = 240, h = 240) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><linearGradient id="g" x2="1" y2="1">
        <stop offset="0" stop-color="oklch(0.66 0.13 ${(i * 47) % 360})"/>
        <stop offset="1" stop-color="oklch(0.3 0.07 ${(i * 47 + 60) % 360})"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="${w * (0.3 + ((i * 13) % 40) / 100)}" cy="${h * 0.45}" r="${Math.min(w, h) * 0.18}" fill="white" fill-opacity="0.22"/>
    </svg>`,
  )}`;

const name = (i: number) => `img_${String(i + 1).padStart(4, "0")}.png`;

const makeItems = (count: number): ImageGridItem[] =>
  Array.from({ length: count }, (_, i) => ({
    key: String(i),
    src: i === 5 ? "missing.png" : art(i, i % 3 === 0 ? 320 : 240, i % 4 === 1 ? 360 : 240),
    alt: name(i),
    label: name(i),
    badge: i % 7 === 0 ? `${12 + (i % 9)} tags` : undefined,
  }));

export const ImageGallery: Story = () => {
  const items = useMemo(() => makeItems(24), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [opened, setOpened] = useState<string | null>(null);
  return (
    <div className="story-col" style={{ maxWidth: 900 }}>
      <p style={{ margin: 0, color: "var(--rk-text-3)" }}>
        Click selects (Ctrl/⌘ toggles, Shift extends), the corner check toggles, double-click or Enter opens.
        Arrows move in 2-D, Space toggles, Ctrl+A selects all, Esc clears.
        {opened && ` Opened: ${opened}`}
      </p>
      <ImageGrid
        aria-label="Dataset images"
        items={items}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        onOpen={(item) => setOpened(item.alt ?? item.key)}
      />
      <SelectionBar count={selected.length} onClear={() => setSelected([])}>
        <Button size="sm" variant="ghost" icon={<TagIcon />}>
          Tag
        </Button>
        <Button size="sm" variant="ghost" icon={<Trash2Icon />}>
          Delete
        </Button>
      </SelectionBar>
    </div>
  );
};

export const VirtualImageGrid: Story = () => {
  const items = useMemo(() => makeItems(5000).map((i) => ({ ...i, label: undefined })), []);
  return (
    <div className="story-col">
      <p style={{ margin: 0, color: "var(--rk-text-3)" }}>5 000 images, only the rows in view are mounted.</p>
      <ImageGrid
        aria-label="Large dataset"
        items={items}
        size={112}
        virtual
        selectable
        style={{ height: 480, maxWidth: 900 }}
      />
    </div>
  );
};

export const Thumbnails: Story = () => (
  <div className="story-row" style={{ alignItems: "flex-start" }}>
    <Thumbnail style={{ width: 160 }} src={art(1, 320, 240)} label="cover 1:1" badge="1024²" />
    <Thumbnail style={{ width: 160 }} src={art(2, 320, 240)} fit="contain" label="contain 1:1" />
    <Thumbnail style={{ width: 213 }} src={art(3, 320, 240)} aspect={4 / 3} label="4:3" selected />
    <Thumbnail style={{ width: 160 }} src="missing.png" label="missing file" />
  </div>
);
