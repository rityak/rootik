# rootik

Dark-first React UI toolkit — "Graphite & Iris". Zero runtime deps besides React 19.

```bash
bun install
bun run dev     # stories on http://localhost:61000
bun run check   # tsc + biome
```

## Use

```tsx
import "@fontsource-variable/geist"; // optional, the default font stack starts with Geist
import "rootik/styles.css";
import { Button, RootikProvider, AppearanceSettings, Toaster } from "rootik";

<RootikProvider storageKey="myapp:appearance" defaults={{ accent: "oklch(0.72 0.19 35)" }}>
  <App />
  <Toaster />
</RootikProvider>;
```

With Tailwind v4, put the kit between Tailwind's base and utilities:

```css
@layer theme, base, rootik, components, utilities;
@import "tailwindcss";
@import "rootik/styles.css";
```

## Extending appearance settings

```tsx
<RootikProvider
  extensions={[
    {
      id: "editor",
      title: "Editor",
      fields: [
        { key: "editor.size", type: "slider", label: "Font size", default: 13, min: 11, max: 18, cssVar: "--app-editor-size", unit: "px" },
        {
          key: "editor.minimap", type: "toggle", label: "Minimap", default: true,
          children: [{ key: "editor.minimap.scale", type: "segmented", label: "Scale", default: "1", options: [{ value: "1", label: "1×" }, { value: "2", label: "2×" }] }],
        },
      ],
    },
  ]}
/>
```

Values are available via `useAppearance().values`; `<AppearanceSettings />` renders built-in and project sections.

## Light theme

Not shipped. Override tokens under your own selector, e.g. `:root[data-theme="light"] { --rk-bg: …; --rk-surface-1: …; --rk-text: …; }` — every component reads only `--rk-*` tokens (see `src/tokens.css`).
