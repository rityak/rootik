import type { Story } from "@ladle/react";
import { DownloadIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { IconButton, Lightbox, type LightboxImage } from "..";

export default { title: "Overlays" };

/** Generated photos-to-be: big enough to zoom, varied aspect ratios, no network. */
const art = (w: number, h: number, hue: number, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="oklch(0.62 0.14 ${hue})"/><stop offset="1" stop-color="oklch(0.28 0.08 ${hue + 40})"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <g fill="none" stroke="white" stroke-opacity="0.18">
        ${Array.from({ length: 24 }, (_, i) => `<circle cx="${w / 2}" cy="${h / 2}" r="${(i + 1) * Math.max(w, h) * 0.025}"/>`).join("")}
      </g>
      <text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="${h / 12}" text-anchor="middle" dominant-baseline="middle">${label}</text>
      <text x="${w - 24}" y="${h - 24}" fill="white" fill-opacity="0.6" font-family="monospace" font-size="${h / 40}" text-anchor="end">${w}×${h}</text>
    </svg>`,
  )}`;

const IMAGES: LightboxImage[] = [
  {
    src: art(2400, 1600, 250, "sample_0001"),
    alt: "sample_0001.png",
    caption: "1girl, solo, looking at viewer",
  },
  {
    src: art(1200, 1800, 30, "sample_0002"),
    alt: "sample_0002.png",
    caption: "landscape, mountains, sunset",
  },
  { src: art(1024, 1024, 160, "sample_0003"), alt: "sample_0003.png" },
  {
    src: art(640, 360, 300, "sample_0004"),
    alt: "sample_0004.png",
    caption: "Smaller than the screen: never upscaled",
  },
  { src: "missing.png", alt: "sample_0005.png (missing)" },
  { src: art(3000, 1200, 90, "sample_0006"), alt: "sample_0006.png" },
];

export const Gallery: Story = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="story-col">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {IMAGES.map((im, i) => (
          <button
            key={im.alt}
            type="button"
            onClick={() => setOpen(i)}
            style={{
              width: 96,
              height: 96,
              padding: 0,
              border: 0,
              borderRadius: 10,
              overflow: "hidden",
              background: "var(--rk-surface-2)",
              cursor: "zoom-in",
            }}
          >
            <img src={im.src} alt={im.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
      <p style={{ color: "var(--rk-text-3)", margin: 0 }}>
        Wheel / pinch / double-click zoom, drag to pan, ←/→ and Home/End, +/−/0, swipe at fit, Esc.
      </p>
      {open !== null && (
        <Lightbox
          images={IMAGES}
          index={open}
          onIndexChange={setOpen}
          onClose={() => setOpen(null)}
          actions={(image) => (
            <>
              <IconButton size="sm" icon={<DownloadIcon />} label={`Download ${image.alt}`} />
              <IconButton size="sm" icon={<Trash2Icon />} label="Delete" />
            </>
          )}
        />
      )}
    </div>
  );
};

export const SingleImage: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      {open && <Lightbox images={IMAGES.slice(0, 1)} onClose={() => setOpen(false)} />}
    </>
  );
};
