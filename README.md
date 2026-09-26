<div align="center">

# rootik

**Dark-first React UI toolkit for dashboards, panels and desktop clients.**

[![npm](https://img.shields.io/npm/v/rootik?color=6366f1&label=npm)](https://www.npmjs.com/package/rootik)
[![CI](https://github.com/rityak/rootik/actions/workflows/ci.yml/badge.svg)](https://github.com/rityak/rootik/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-6366f1)](LICENSE)
![React 19](https://img.shields.io/badge/react-19-6366f1)
![Zero deps](https://img.shields.io/badge/runtime%20deps-0-6366f1)

<img src="https://raw.githubusercontent.com/rityak/rootik/main/.github/assets/dashboard.jpg" alt="Dashboard built with rootik" width="100%">

</div>

## Why

- **150+ components, zero runtime dependencies.** Only React 19 as a peer. Icons are inline SVG, positioning
  and listboxes are hand-written, everything else is the platform: `<dialog>`, the Popover API, `<details>`,
  native inputs.
- **Plain CSS on tokens.** Every color, radius, spacing and duration is a `--rk-*` custom property inside
  `@layer rootik`, so Tailwind or your own CSS wins without `!important`.
- **Themeable at runtime.** Accent, neutral tint, radius, density, font, surface material (solid, veil, frost,
  liquid glass) and motion are live settings, with a ready-made settings form you can extend.
- **Accessible by default.** ARIA APG keyboard patterns, a real focus ring, labels on icon-only controls,
  `prefers-reduced-motion` respected, and every string translatable.
- **Built for data.** Tables with virtual rows, trees, column menus and resizing; line, bar, scatter, donut,
  treemap, heatmap, gauge and sparkline charts with a validated palette; logs, JSON view and trackers.

<img src="https://raw.githubusercontent.com/rityak/rootik/main/.github/assets/desktop-client.jpg" alt="Desktop client layout with a floating dock" width="100%">

## Install

```bash
npm install rootik
```

```tsx
import "rootik/styles.css";
import { RootikProvider, Toaster, Button } from "rootik";

export function App() {
  return (
    <RootikProvider storageKey="myapp:appearance">
      <Button variant="primary">Deploy</Button>
      <Toaster />
    </RootikProvider>
  );
}
```

The default font stack starts with Geist; install `@fontsource-variable/geist` and import it if you want it.

With Tailwind v4, put the kit between Tailwind's base and utilities:

```css
@layer theme, base, rootik, components, utilities;
@import "tailwindcss";
@import "rootik/styles.css";
```

## Components

| Group | Components |
| --- | --- |
| **Actions** | Button, IconButton, ButtonGroup, ConfirmButton, SplitButton, CopyButton, PowerButton |
| **Inputs** | Field, Input, SearchInput, Textarea, PasswordInput, PinInput, NumberInput, InputGroup, TokenField, Editable, ColorPicker, DateRange, FileDrop |
| **Choice** | Checkbox, CheckboxGroup, Switch, RadioGroup, SegmentedControl, ChoiceCards, CheckboxCards, ChipGroup, ColorSwatches, Slider, RangeSlider |
| **Selection** | Select, NativeSelect, Combobox, SelectPanel, TreeSelect |
| **Forms** | Form, Fieldset, SchemaForm, SettingsGroup, SettingsRow |
| **Overlays** | Dialog, Drawer, CommandPalette, Menu, ContextMenu, Menubar, Popover, Tooltip, HoverCard, Toaster, ConfirmHost, Lightbox, Tour, ShortcutsSheet, FloatingWindow |
| **Navigation** | Tabs, TopNav, Sidebar, NavItem, Dock, Breadcrumbs, Pagination, TableOfContents, Stepper |
| **Layout** | AppShell, TitleBar, PageHeader, Toolbar, ActionBar, StatusBar, ResizablePanel, Splitter, MasterDetail, Disclosure, Scroller, StickToBottom, OverflowList |
| **Display** | Card, Stat, KeyValue, Callout, EmptyState, Badge, StatusDot, Kbd, Avatar, Indicator, Item, Timeline, Prose, Code, CodeBlock, Highlight, Truncate, Spoiler, QrCode, RelativeTime, Timer, RollingNumber, TextShimmer |
| **Feedback** | Progress, ProgressRing, Spinner, Skeleton, Meter, BusyOverlay, DataState |
| **Data** | Table, DataTable, ColumnsMenu, Tree, SortableList, SelectionBar, JsonView, LogView, ImageGrid, Tracker |
| **Charts** | LineChart, BarChart, Histogram, ScatterChart, StackedBarChart, DonutChart, WaffleChart, Treemap, BulletChart, BarsList, Heatmap, Gauge, Sparkline |
| **Theming** | RootikProvider, Scope, AppearanceSettings |

Every component has a story; run `bun run dev` to browse them. For AI assistants, [`llms.txt`](llms.txt)
indexes every component with its source location, story and summary.

## Theming

`RootikProvider` owns the appearance (accent, neutral tint, radius, density, font, material, motion), writes it
as CSS variables on `<html>` and persists it under `storageKey`. `<AppearanceSettings />` renders the same
schema as a settings form. Projects add their own sections with `extensions`:

```tsx
<RootikProvider
  defaults={{ accent: "oklch(0.72 0.19 35)" }}
  extensions={[
    {
      id: "editor",
      title: "Editor",
      fields: [
        { key: "editor.size", type: "slider", label: "Font size", default: 13, min: 11, max: 18, cssVar: "--app-editor-size", unit: "px" },
        { key: "editor.minimap", type: "toggle", label: "Minimap", default: true },
      ],
    },
  ]}
/>
```

Values are available via `useAppearance().values`.

### Light theme

The kit is dark-first, but components read only `--rk-*` tokens, so a light theme is one block of overrides.
A tested recipe lives in [`src/stories/light-theme.css`](src/stories/light-theme.css): copy it into your app
and switch with `<html data-theme="light">`. Put `data-rk-scope` next to it to make only a subtree light.

## Development

```bash
bun install
bun run dev      # stories on http://localhost:61000
bun run check    # typecheck + biome + tests
bun run build    # dist/: ESM + .d.ts + styles.css
bun run visual   # local screenshot tests of every story (Playwright)
```

When the kit is linked from source (a monorepo or a `file:` dependency), let the bundler resolve `src/`
instead of `dist/`:

```ts
// vite.config.ts
export default defineConfig({ resolve: { conditions: ["source"] } });
```

## License

[MIT](LICENSE)
