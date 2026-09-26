# rootik

Dark-first React UI toolkit — "Graphite & Iris". Zero runtime deps besides React 19.

```bash
npm install rootik
```

```tsx
import "rootik/styles.css";
import { Button } from "rootik";
```

Development:

```bash
bun install
bun run dev     # stories on http://localhost:61000
bun run check   # tsc + biome + tests
bun run build   # dist/ for npm (ESM + .d.ts + styles.css)
```

Linked from source during development (a monorepo or `file:` dependency), let the bundler resolve `src/`
instead of `dist/`:

```ts
// vite.config.ts
export default defineConfig({ resolve: { conditions: ["source"] } });
```

AI assistants: point them at `llms.txt` — an index of every component with its source location and story.

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

Not shipped — the kit is dark-first — but every component reads only `--rk-*` tokens, so a light theme is one
block of overrides. A tested recipe lives in [`src/stories/light-theme.css`](src/stories/light-theme.css)
(story: Overview → Light Theme). Copy it into your app and switch with an attribute:

```html
<html data-theme="light">
```

- Override the **neutrals** (`--rk-bg`, `--rk-surface-1…4`, `--rk-sunken`, `--rk-text*`, `--rk-inverse`,
  `--rk-on-inverse`) and flip `--rk-tint` / `--rk-shade` to dark triplets: lines, hovers, hatch and shadows
  derive from them. Keep the `--rk-neutral-h/c` knobs in the formulas so the tint setting still works.
- Re-state the tokens that assume a dark canvas: `--rk-well*`, `--rk-scrim`, `--rk-highlight`,
  `--rk-accent-text` (darken instead of lift) and the status colours.
- For a light **subtree** instead of the whole page, put `data-rk-scope` next to `data-theme="light"` so the
  derived tokens recompute there. Token overrides inside a scope must use explicit values (see CLAUDE.md).
- The chart palette was validated for the dark band; re-run the dataviz validator with `--mode light` against
  your light surface before shipping charts.
