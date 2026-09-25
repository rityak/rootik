# Rootik — progress

Legend: `[x]` done (component + story, checked in browser) · `[ ]` planned · `~` partial.
Sources: **DT** = dataset-toolkit/client, **UR** = umiray-client. Priority: P0 needed by a consumer now,
P1 parity with mainstream kits (Radix/Mantine/shadcn), P2 nice to have.
`↗ Kit` = idea borrowed from another kit (2026-09 review of shadcn, Base UI, React Aria, Mantine 9, Ark, HeroUI v3,
Magic UI, M3 Expressive) or from new web platform features.

## Foundation

- [x] Tokens (`tokens.css`): OKLCH neutrals from 2 knobs, accent + derived (soft/line/on-accent via relative color), status, 6-slot validated chart palette, geometry from density, type scale from base size, depth, hatch texture, motion
- [x] Base (`base.css`): page base, focus ring, scrollbars, `.rk-num/.rk-mono/.rk-hatch/.rk-sr-only/.rk-truncate`, `[data-tone]` mapping
- [x] `@layer rootik` + Tailwind layer-order recipe
- [x] Floating layer on Popover API (`lib/floating.tsx`): top layer, flip/shift, follows anchor, virtual anchors
- [x] `RootikProvider` + `useAppearance`: values → CSS vars on `<html>`, localStorage or controlled
- [x] `AppearanceSettings`: schema-driven form, project `extensions`, nested fields (`children`), `visible`, `cssVar`/`apply`
- [x] `useHotkey`, `useControllable`, `cx`, inline icon set
- [x] Surface materials (Settings → Effects → Surfaces): solid / veil (default) / frost / liquid via `.rk-surface` (cards + layout parts), ambient glow on the AppShell canvas, gradient hairline rim
- [ ] Light theme recipe/example token override (docs + story) — P1
- [ ] Dist build (`bun build` + d.ts) for npm publishing; now consumed from source — P2
- [ ] Visual regression (Playwright screenshots of stories) — P2
- [ ] Unit checks for pure logic (`niceTicks`, `pageRange`, `computePosition`, `toCssVars`) — P1
- [ ] Squircle corners: `--rk-corner-shape` token (`corner-shape: squircle`, progressive — plain radius elsewhere) + Settings → Shape "Corners: round / squircle" — P1 ↗ CSS `corner-shape`
- [ ] Floating on CSS anchor positioning (`position-anchor`, `position-try-fallbacks`), `computePosition` stays as fallback; anchored container queries so a flipped popover animates from the anchor side — P2 ↗ CSS anchor positioning
- [ ] Sliding indicator (Tabs/SegmentedControl/Dock) anchored to the active item instead of measuring in `lib/indicator.ts` — P2 ↗ CSS anchor positioning
- [ ] Scroll shadows: sticky table head / PageHeader get a shadow only while content is scrolled under them (`@container scroll-state()`) — P2 ↗ CSS scroll-state queries
- [ ] Pointer spotlight on interactive cards (glow follows the pointer via `--x/--y`, ≤ 16%), a material option — P2 ↗ Linear/Vercel, Magic UI
- [ ] `llms.txt` generated from stories (component → props → story example) so AI assistants use the kit correctly during migrations — P2 ↗ HeroUI v3, Mantine 9, shadcn registry

## Actions

- [x] Button — variants primary/secondary/outline/ghost/inverse/danger/warn, sizes, icon/iconEnd, loading, active (toggle), block — DT Button, UR Button
- [x] IconButton — label = aria-label + tooltip, round — DT IconButton, UR `size=icon*`
- [x] ButtonGroup
- [x] ConfirmButton — two-step destructive (UR `on`/armed `Remove`)
- [ ] CopyButton — P2
- [ ] SplitButton (button + menu) — P1 ↗ M3 Expressive, shadcn ButtonGroup

## Inputs & forms

- [x] Field — label/hint/error/required/aside, stack & inline layout, wires id/aria via context — DT `field.ts`, UR Field
- [x] Input — icon, end slot, sizes, invalid, mono — DT fieldClass, UR Field
- [x] SearchInput — clear, shortcut hint — DT SearchField
- [x] Textarea — autoSize (field-sizing), mono — UR Area
- [x] Select — custom listbox, keyboard + typeahead, hints/icons/disabled, `field`/`button` variants — UR Select, DT native selects
- [x] Slider — hatched rest, value readout/format, marks — DT slider params
- [x] Checkbox (indeterminate), Switch (toggle), RadioGroup — DT checkbox, UR Check
- [x] SegmentedControl — sliding inverted pill, native radios — UR Switch, DT Tabs segmented
- [x] ChoiceCards — radio cards with description/note — UR Segment
- [x] ChipGroup — toggle chips multi/single, counts — DT MultiSelectField
- [x] ColorSwatches — presets + native custom picker — DT color param
- [ ] NumberInput — steppers, min/max clamp, wheel, units — P1 (DT number params) ↗ Base UI NumberField, HeroUI v3
- [ ] Combobox / Autocomplete — filterable select, async options (loading + empty state) — P1 (DT dynamic-select)
- [ ] MultiSelect / TagInput as a TokenField — tokens inline with the text, autocomplete, auto-tokenize on separator; also `key:value` filter tokens for SearchInput — P1 (DT caption tags) ↗ React Aria TokenField
- [ ] PasswordInput (reveal) — P2
- [ ] OTP / PinInput — per-cell input, paste, autofill (`autocomplete="one-time-code"`) — P2 ↗ Base UI OTPField, Ark PinInput
- [ ] Select `native` variant on `appearance: base-select` (real `<select>` in kit styling) for simple cases — P2 ↗ customizable select
- [ ] FileDrop / DropZone (hatched) — P1 (DT dataset import)
- [ ] PathField — stays in DT (needs its FS API); build on Input + Dialog
- [ ] DateInput / DateRange presets — P2 (native `<input type=date>` styled first)
- [ ] SchemaForm (generic ParamsForm: string/text/number/slider/select/multi/color/boolean) — P1, reuse AppearanceSettings renderer — DT ParamsForm

## Display

- [x] Badge — tones × soft/solid/outline, dot, icon, removable (tag) — DT Badge, UR Chip/Count
- [x] StatusDot — pulse halo — UR on/connecting/off states
- [x] Kbd + `formatShortcut` (platform-aware)
- [x] Avatar, AvatarGroup
- [x] Card — default/glow/inverse/outline/sunken, header/actions/footer, collapsible, interactive — DT Card, UR pane/PanelHead
- [x] Stat (KPI) — big light numbers, unit, delta (invert), hint, trend slot
- [x] KeyValue — rows/grid
- [x] SectionLabel — DT SectionLabel, UR Caption
- [x] EmptyState — hatched icon well — DT EmptyState, UR Empty
- [x] Callout — tones, actions, dismiss — DT Callout, UR Banner/Hint
- [x] Nest — nested option group — UR Nest
- [x] Divider (label, vertical)
- [x] Progress (hatched rest, indeterminate), ProgressRing, Spinner, Skeleton — DT ProgressBar
- [ ] RollingNumber — digits roll on value change (tabular column + translate, CSS only, off with `--rk-motion`); used by Stat/Gauge — P1 ↗ Mantine RollingNumber, Magic UI Number Ticker
- [ ] Item — generic row: media/icon + title + description + trailing actions, sizes, interactive, list container — P1 ↗ shadcn Item
- [ ] RelativeTime ("5 s ago", live tick) + duration/timer (session uptime) on `Intl.RelativeTimeFormat` — P1 ↗ Primer RelativeTime, Ark Timer
- [ ] Text shimmer for pending labels ("Connecting…", "Indexing…") via `background-clip: text` — P2 ↗ AI UIs, Magic UI
- [ ] Card `data-state="running"`: light beam travelling along the gradient rim (`@property` angle + conic gradient), status only — P2 ↗ Magic UI Border Beam
- [ ] Code / CodeBlock (copy, line numbers) — P1 (UR SourceCode, DT RunLog)
- [ ] LogView — virtualized, levels, follow-tail — P1 (DT LogDock/RunLog, UR Logs/Console); built on `StickToBottom` (Layout)
- [ ] Timeline — P2
- [ ] ImageGrid / Thumbnail (selection, lazy) — P1 (DT gallery)
- [ ] Flag (country) — stays in UR

## Overlays

- [x] Tooltip — delay + warm-up, shortcut
- [x] Popover — anchored panel
- [x] Menu — items/checkbox items/labels/separators, shortcuts, roving focus, typeahead
- [x] ContextMenu — pointer-anchored — UR onContextMenu
- [x] Dialog — native `<dialog>`, sizes, footer, backdrop dismiss — DT Modal, UR Dialog
- [x] Drawer / bottom sheet (Dialog placements)
- [x] CommandPalette — groups, keywords, shortcuts — DT CommandPalette
- [x] Toast / Toaster — tones, action, sticky, loading→done update, pause on hover — DT Tasks notifications
- [ ] Submenus in Menu — P1 (blocks Menubar)
- [ ] Menubar — desktop File/Edit/View bar next to TitleBar, APG menubar keyboard (arrows move between menus, hover-to-switch once open) — P1 ↗ Mantine 9.4, Base UI, Radix
- [ ] Menu radio items — P2
- [ ] Menu async loading + empty state — P2 ↗ React Aria 1.21
- [ ] HoverCard — interactive popover on hover/focus/long press; `interestfor` where supported, JS delay fallback — P2 ↗ React Aria PreviewTrigger
- [ ] Tooltip on `interestfor` + `popover="hint"` (native hover/focus delays and Esc), current JS as fallback — P2 ↗ interest invokers
- [ ] Exit animations for dialog/popover (`allow-discrete`) — P1
- [ ] Toast stack: collapsed deck that expands on hover/focus, swipe to dismiss — P2 ↗ Sonner

## Navigation

- [x] Tabs — line / pill (sliding indicator), badge, dirty dot, icon-only, fill, TabPanel — DT Tabs, UR Tabs
- [x] Sidebar (collapsible rail) + NavGroup + NavItem (depth, trailing, hover actions) — DT NavItem/SideRail, UR SideNav
- [x] Dock — `icons` (round buttons + tooltips) and `labels` (icon + text pills) variants, fixed item size with a sliding inverted indicator, dot/count badges, `DockSeparator` + extra actions — UR Dock
- [x] Breadcrumbs, Pagination
- [ ] Stepper / Wizard — P2
- [ ] TopNav (pill nav as links, not tabs) — P2

## Layout

- [x] AppShell — two layouts (prop `variant` or Settings → Shape → Layout): **islands** — sidebar, header, aside, footer, dock are separate `.rk-surface` panels over the ambient canvas; **inset** — frame parts sit on the background, content + aside are one surface block. Content scrolls under the dock. `headerShape`: bar / pill (concentric with round controls) / none (mobile top rows on the canvas)
- [x] TitleBar — frameless window bar (Tauri drag regions, window controls) — UR TitleBar
- [x] Layout stories: dashboard (sidebar + header), VPN desktop window (title bar + dock), VPN compact/phone (gauge hero + dock), each with a material switcher
- [x] PageHeader (sm/lg), PageBody, Toolbar + Spacer, ActionBar, StatusBar (progress line) — DT Page.tsx, UR Toolbar
- [x] ResizablePanel — pointer + keyboard, persisted — DT ResizableSidebar, LogDock
- [x] Disclosure (native details, exclusive accordion via `name`)
- [ ] Animated open/close for Disclosure (`interpolate-size: allow-keywords` + `::details-content`); collapsible Card on the same technique instead of unmounting the body — P1
- [ ] OverflowList (priority+) — items that don't fit collapse into a "+N" menu; used by Toolbar, Tabs, Breadcrumbs, ChipGroup, AvatarGroup — P1 ↗ Mantine 9 OverflowList
- [ ] Scroller — horizontal overflow with edge fade + arrows only when scrollable (`scroll-state()`, JS fallback); for Tabs/Dock/ChipGroup on phones — P1 ↗ Mantine 9 Scroller
- [ ] `StickToBottom` scroll container — follow tail, "jump to latest", keeps position on prepended history; base for LogView (and a chat later) — P1 ↗ shadcn MessageScroller
- [ ] FloatingWindow — draggable/resizable non-modal panel (inspector, log, preview) — P2 ↗ Mantine FloatingWindow, Ark FloatingPanel
- [ ] Splitter (two panes) — P2
- [ ] PowerButton / hero toggle orb (now a story-only `.vpn-orb`) — P1 when umiray migrates
- Not planned: Stack/Grid/Box — use CSS/Tailwind in apps

## Data

- [x] Table — styled native table, density/sticky/zebra/framed — UR Table
- [x] DataTable — columns, client/server sort, row click/selection, empty — DT TagTable, UR NodeTable/ReportTable
- [x] Tree — keyboard per APG, lazy nodes, trailing, indent guides — DT FolderTree/TensorTree, UR NodeTree
- [ ] DataTable: row selection checkboxes, column resize, virtualization — P1
- [ ] Tree: virtualization for large models, drag & drop — P2
- [ ] DataTable tree rows — expandable rows with indent guides (tree with columns, Finder-like) — P1 (candidates: DT TensorTree, UR NodeTree) ↗ React Aria Table

## Charts

- [x] Sparkline
- [x] BarChart — vertical/horizontal, solid/hatch, highlight, reference line, tooltips — DT charts HBar/VBar
- [x] LineChart — multi-series, area, gaps, crosshair tooltip, legend — DT RunCharts, UR TrafficChart
- [x] Gauge — segmented arc
- [x] Legend, `seriesColor`, `niceTicks`, `formatCompact`
- [ ] Heatmap (sequential ramp) — P1 (DT co-occurrence)
- [ ] Scatter (log axes) — P2 (DT tag scatter)
- [ ] StackedBar / Donut — P2
- [ ] BarsList — top-N list of horizontal bars with name + value, hatched rest — P2 ↗ Mantine 9 BarsList
- [ ] Table view toggle for every chart (a11y) — P1

## Not planned (2026-09 review)

- Motion-library effects (animated beams, globe, retro grid, marquee), Dock magnification, M3 Expressive shape
  morphing — marketing flourish; break density and the short-motion rule
- Custom ScrollArea (styled native scrollbars are enough), Carousel

## Migration (after P0 is stable)

- [ ] dataset-toolkit: replace `shared/ui/*` with rootik, map tokens (`--color-*` → `--rk-*`), keep Tailwind for layout
- [ ] umiray-client: replace `shell/*`, move theme presets (midnight/green/purple) to `RootikProvider defaults` + `extensions` (background image field)
