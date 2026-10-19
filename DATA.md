# Data collections

```tsx
import { DataTable, Item, ItemGroup, Tree, TreeSelect } from "rootik/data";
import "rootik/data/styles.css";

<DataTable
  aria-label="Gateway list"
  surface={{ shape: "bevel", padding: 20, depth: 0.45 }}
  rows={gateways}
  rowKey={(row) => row.id}
  columns={columns}
  selection="multiple"
  selected={selected}
  onSelectedChange={setSelected}
  sticky
  pinFirstColumn
  resizable
  maxHeight={360}
/>;
```

The module exports Table, DataTable, defineColumns, ColumnsMenu, Tree, TreeSelect,
Item, ItemGroup, SortableList, SelectionBar, Scroller, OverflowList, useSelection
and useVirtual, with their existing types. Root imports and legacy component paths
resolve to the same implementations. No runtime dependency was added.

## Geometry and appearance

- Table/DataTable and ItemGroup accept `surface?: DataSurfaceOptions`, a subset of
  SvgSurface geometry/material options. Default safe padding is 20 px. Omit the prop
  for the original unwrapped markup; native table/list attributes remain on those elements.
- The shaped shell surrounds the scroll viewport. It never clips table content or
  measures individual rows. Keep the same `surface` prop when toggling appearance:
  `svgShapes: false` or `style: "fluent"` removes decorative contours without
  replacing content or resetting selection, widths, sort, focus or scroll position.
- TreeSelect accepts the same `svgBorder` vocabulary as controls. SelectionBar
  accepts the shared overlay `surface`, including explicit compact padding.
- Sort controls, interactive list items and shells use the existing MotionLayer.
  Effects are opt-in through appearance, play once per interaction/selection and
  honor Motion Off, SVG Off, Fluent and reduced motion. No new animation clock or
  per-frame React state was introduced. Reordering moves actual rows; lift styling
  and selection toolbar appearance no longer scale or translate their contents.
- Selected table cells, including pinned cells, share an inverse fill/text pair.
  Header typography uses sentence case, tabular numbers and the configured mono role.
- `rootik/css/data.css` remains valid; it now supplies the complete collection group,
  the same closure as `rootik/data/styles.css`. This intentionally expands the old
  table stylesheet to avoid colliding generated export filenames.

## Interaction contracts

DataTable preserves client/server sorting, resize/persisted widths, column hiding,
checkbox/range selection, treegrid rows and fixed-height virtualization. Virtual
rows still require `maxHeight` and one-line cells of a consistent height. Do not
add wrapped content with different row heights to a fixed-pitch table.

Tree keeps APG keyboard navigation, tri-state leaf checks, filtering and virtual
rows. Disabled branches retain their own checked state but are excluded from
ancestor bulk changes. SortableList uses Space/Enter to lift/drop, arrows to move,
and Escape to cancel; pointer-only Tree moves still require a consumer keyboard
alternative. Item actions remain siblings of the stretched row action.

Scroller exposes its overflowing viewport to keyboard focus. Motion Off disables
smooth arrow-button scrolling as well as decorative effects. SelectionBar composes
consumer key handlers and respects `preventDefault()` before clearing on Escape.

## Example and validation

The Data Module story and Design Lab `?direction=signal-dark&screen=data` use public
production components/styles: 72 Cyrillic gateways, pinned/resizable columns,
selection actions, tree/picker, keyboard reorder, overflow/scroller and 10,000
virtual events. Settings cover all six palettes, both modes, density, shapes,
square corners, Fluent, SVG and shared animation recipes.

DOM tests cover module identity, state/content preservation, sort/selection,
disabled tree checks, filtering, keyboard reorder/cancel, composed Escape,
bounded virtual rows and keyboard/no-motion scrolling. Packed dist/source and
Node SSR fixtures exercise the public module and selective CSS without a consumer
Vanilla Extract plugin. Native sticky positioning, scrolling and visual layout
require the real-browser check; unit tests alone do not prove them.

The local Chromium run verified sorting, Shift-range selection and bulk actions,
column hiding/resizing, TreeSelect search/focus return, tree checks and keyboard
reordering. At the end of the virtual collection, event 10,000 is reachable with
17 rows mounted; the pinned header stays above pinned body cells. Across SVG Off,
33 visible elements changed by less than 0.001 px. Document width equals viewport
width at 365 px and 1,299 px, including the hidden OverflowList measurement copy.
Light Maomao and dark Cobalt screenshots are in `design-lab/screenshots/data-*`.

`bun run check` passes 153 tests (109 unit/SSR and 44 DOM). Design Lab, Ladle,
packed dist/source, Node SSR and selective Tailwind checks pass. The package keeps
271 root runtime exports and 97 selective CSS exports.

Real consumer applications, Firefox/Safari/WebView, NVDA and GPU profiling remain
separate validation gates.

SelectPanel now lives in `src/data/select-panel.tsx` and is exported from the data module, with its existing input/menu CSS closure.

## Filter panels

`SelectPanel surface` adds the shared SVG material around the existing native popover. Its filter reuses Input with an optional soft SVG rim, while deferred choices and Apply/Clear retain their existing model. Surface panels put the selection count on a separate footer row so translated actions fit inside the protected padding on narrow screens. SVG Off and Fluent keep the same native field, draft selection and hit targets. The data module example demonstrates the protocol picker.
