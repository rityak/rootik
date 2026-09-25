# Rootik — progress

Legend: `[x]` done (component + story, checked in browser) · `[ ]` planned · `~` partial.
Sources: **DT** = dataset-toolkit/client, **UR** = umiray-client. Priority: P0 needed by a consumer now,
P1 parity with mainstream kits (Radix/Mantine/shadcn), P2 nice to have.
`↗ Kit` = idea borrowed from another kit (2026-09 review of shadcn, Base UI, React Aria, Mantine 9, Ark, HeroUI v3,
Magic UI, M3 Expressive) or from new web platform features; component inventories checked against Mantine 9.6, Ark 5.39,
React Aria 1.21, Base UI 1.8, Radix, Radix Themes, HeroUI 3.2, Chakra 3.37, antd 6.6, Primer 38. `★` = own idea.

## Batch 2 — one PR per item

Same rules as Batch 1 (stubs registered up front, one line per PR, merge commits). The DataTable PRs all edit
`data.tsx`, so they are stacked: merge resize → tree rows → virtualization in that order. TokenField is stacked
on Combobox.

- [x] Foundation: `useVirtual` (fixed or per-row sizes, `scrollToIndex`), icons and labels for the batch, module stubs · `claude/dreamy-franklin-e2kev1`

- [x] SplitButton (button + menu) — P1 ↗ M3 Expressive, shadcn ButtonGroup · `claude/rk-split-button`

- [x] Combobox / Autocomplete — filterable select, async options (loading + empty state) — P1 (DT dynamic-select) · `claude/rk-combobox`

- [x] MultiSelect / TagInput as a TokenField — tokens inline with the text, autocomplete, auto-tokenize on separator; also `key:value` filter tokens for SearchInput — P1 (DT caption tags) ↗ React Aria TokenField · `claude/rk-token-field`

- [ ] SchemaForm (generic ParamsForm: string/text/number/slider/select/multi/color/boolean) — P1, reuse AppearanceSettings renderer — DT ParamsForm · `claude/rk-schema-form`

- [ ] Lightbox / ImageViewer — fullscreen preview, zoom/pan, prev/next, keyboard; pairs with ImageGrid — P1 (DT gallery) ↗ antd Image preview · `claude/rk-lightbox`

- [ ] ImageGrid / Thumbnail (selection, lazy) — P1 (DT gallery) · `claude/rk-image-grid`

- [ ] LogView — virtualized, levels, follow-tail — P1 (DT LogDock/RunLog, UR Logs/Console); built on `StickToBottom` (Layout) · `claude/rk-log-view`

- [ ] Menubar — desktop File/Edit/View bar next to TitleBar, APG menubar keyboard (arrows move between menus, hover-to-switch once open) — P1 ↗ Mantine 9.4, Base UI, Radix · `claude/rk-menubar`

- [ ] DataTable: column resize (drag + keyboard, persisted widths) — P1 · `claude/rk-table-resize`

- [ ] DataTable tree rows — expandable rows with indent guides (tree with columns, Finder-like) — P1 (candidates: DT TensorTree, UR NodeTree) ↗ React Aria Table · `claude/rk-table-tree`

- [ ] DataTable: row virtualization on `useVirtual` for large tables — P1 · `claude/rk-table-virtual`

## Batch 1 — one PR per item

Parallel PRs on top of the foundation PR; each touches only its own module (stubs are registered in
`index.ts`/`styles.css` up front), a new story file and its own line here — blank lines between items keep
those one-line edits conflict-free. Merge with merge commits (not squash). Folded back into the sections
below once the batch is in.

- [x] Foundation: `useHotkey` skips typing targets, `useClipboard`, `announce()`, `format*` parts, `useSelection`, CopyButton, icons (`icon()` exported) and labels for the batch, module stubs · `claude/dreamy-franklin-e2kev1`

- [x] Truncate — single/multi-line ellipsis that shows the full text in a Tooltip only when actually truncated — P1 ★ ↗ Primer Truncate · `claude/rk-truncate`

- [x] Meter — `<meter>` semantics, low/high/optimum pick the tone, stacked sections with hatched rest (disk, quota, CPU) — P1 ↗ Base UI/React Aria/HeroUI Meter, Mantine Progress sections, Tremor CategoryBar · `claude/rk-meter`

- [x] Tracker — row of small status bars (uptime/latency per hour or day) with tooltips — P1 ★ (UR node health) ↗ Tremor Tracker · `claude/rk-tracker`

- [x] RollingNumber — digits roll on value change (tabular column + translate, CSS only, off with `--rk-motion`); used by Stat/Gauge — P1 ↗ Mantine RollingNumber, Magic UI Number Ticker · `claude/rk-rolling-number`

- [x] RelativeTime ("5 s ago", live tick) + duration/timer (session uptime) on `Intl.RelativeTimeFormat` — P1 ↗ Primer RelativeTime, Ark Timer · `claude/rk-relative-time`

- [x] Item — generic row: media/icon + title + description + trailing actions, sizes, interactive, list container — P1 ↗ shadcn Item · `claude/rk-item`

- [x] Editable — rename in place: click/Enter edits, Enter commits, Esc cancels (dataset, profile, server names) — P1 ★ ↗ Ark/Chakra Editable · `claude/rk-editable`

- [x] NumberInput — steppers, min/max clamp, wheel, units — P1 (DT number params) ↗ Base UI NumberField, HeroUI v3 · `claude/rk-number-input`

- [x] OverflowList (priority+) — items that don't fit collapse into a "+N" menu; used by Toolbar, Tabs, Breadcrumbs, ChipGroup, AvatarGroup — P1 ↗ Mantine 9 OverflowList · `claude/rk-overflow-list`

- [x] Scroller — horizontal overflow with edge fade + arrows only when scrollable (`scroll-state()`, JS fallback); for Tabs/Dock/ChipGroup on phones — P1 ↗ Mantine 9 Scroller · `claude/rk-scroller`

- [x] `StickToBottom` scroll container — follow tail, "jump to latest", keeps position on prepended history; base for LogView (and a chat later) — P1 ↗ shadcn MessageScroller · `claude/rk-stick-to-bottom`

- [x] SelectionBar — floating "N selected" bar with bulk actions + clear, appears with DataTable/ImageGrid selection — P1 ↗ Mantine/Chakra ActionBar · `claude/rk-selection-bar`

- [x] `confirm()` / `prompt()` — promise-based dialogs over Dialog (`await confirm({ title, tone: "danger" })`) — P1 ↗ Base UI AlertDialog, Primer ConfirmationDialog · `claude/rk-confirm`

- [x] Code / CodeBlock (copy, line numbers) — P1 (UR SourceCode, DT RunLog) · `claude/rk-code-block`

- [x] SelectPanel — button-triggered popover: search, checkable list with counts, Clear/Apply footer; for table and chart filters — P1 ↗ Primer SelectPanel · `claude/rk-select-panel`

- [x] FileDrop / DropZone (hatched) — P1 (DT dataset import) · `claude/rk-file-drop`

- [x] SettingsGroup / SettingsRow — title + description left, control right, divided rows; extract from the AppearanceSettings layout — P1 ★ · `claude/rk-settings-list`

- [x] Heatmap (sequential ramp) — P1 (DT co-occurrence) · `claude/rk-heatmap`

- [x] RangeSlider (two thumbs, min distance) + vertical Slider — P1 ↗ Mantine RangeSlider, Radix/Base UI Slider · `claude/rk-range-slider`

- [x] Toolbar: `role="toolbar"` without arrow-key roving focus (APG) — add it — P1 ★ · `claude/rk-toolbar-roving`

- [x] Animated open/close for Disclosure (`interpolate-size: allow-keywords` + `::details-content`); collapsible Card on the same technique instead of unmounting the body — P1 · `claude/rk-disclosure-motion`

- [x] KeyValue `copyable` values (IDs, hashes, IPs) — copy button on hover — P1 ★ · `claude/rk-kv-copyable`

- [x] DataTable row selection checkboxes (`useSelection`, Shift ranges, select all) + keyboard-reachable scroll wrapper for Table (`tabIndex=0` + label when it overflows) — P1 ↗ Primer ScrollableRegion · `claude/rk-data-selection`

- [x] Submenus in Menu — P1 (Menubar follows in batch 2) · `claude/rk-menu-submenus`

- [x] Exit animations for dialog/popover (`allow-discrete`) — P1 · `claude/rk-exit-animations`

- [x] Squircle corners: `--rk-corner-shape` token (`corner-shape: squircle`, progressive — plain radius elsewhere) + Settings → Shape "Corners: round / squircle" — P1 ↗ CSS `corner-shape` · `claude/rk-squircle`

- [x] Table view toggle for every chart (a11y) — P1 · `claude/rk-chart-table`

- [x] Unit checks for pure logic (`niceTicks`, `pageRange`, `computePosition`, `toCssVars`) — P1 · `claude/rk-logic-tests`

- [x] Light theme recipe/example token override (docs + story) — P1 · `claude/rk-light-theme`

## Foundation

- [x] Tokens (`tokens.css`): OKLCH neutrals from 2 knobs, accent + derived (soft/line/on-accent via relative color), status, 6-slot validated chart palette, geometry from density, type scale from base size, depth, hatch texture, motion
- [x] Base (`base.css`): page base, focus ring, scrollbars, `.rk-num/.rk-mono/.rk-hatch/.rk-sr-only/.rk-truncate`, `[data-tone]` mapping
- [x] `@layer rootik` + Tailwind layer-order recipe
- [x] Floating layer on Popover API (`lib/floating.tsx`): top layer, flip/shift, follows anchor, virtual anchors
- [x] `RootikProvider` + `useAppearance`: values → CSS vars on `<html>`, localStorage or controlled
- [x] `AppearanceSettings`: schema-driven form, project `extensions`, nested fields (`children`), `visible`, `cssVar`/`apply`
- [x] `useHotkey`, `useControllable`, `cx`, inline icon set
- [x] Surface materials (Settings → Effects → Surfaces): solid / veil (default) / frost / liquid via `.rk-surface` (cards + layout parts), ambient glow on the AppShell canvas, gradient hairline rim
- [x] CI (`.github/workflows/ci.yml`): typecheck, `biome ci`, unit tests, Ladle build on push to main and PRs
- [x] Strict Biome: extra rules on top of `recommended`, kit code may import only peer deps (no dev deps like lucide-react), `noHexColors`, GritQL plugin `biome/untinted-neutral.grit` (translucent `oklch(L 0 0 / a)` overlays)
- [ ] Label-on-fill token (`--rk-on-danger` or a generic `--rk-on-tone`) instead of hardcoded `oklch(0.99 0 0)` in Button armed and TitleBar close hover, `oklch(0.15 0 0)` on the custom swatch — P2 ★
- [ ] Dist build (`bun build` + d.ts) for npm publishing; now consumed from source — P2
- [ ] Visual regression (Playwright screenshots of stories), as a CI job on top of the Ladle build — P2
- [ ] Floating on CSS anchor positioning (`position-anchor`, `position-try-fallbacks`), `computePosition` stays as fallback; anchored container queries so a flipped popover animates from the anchor side — P2 ↗ CSS anchor positioning
- [ ] Sliding indicator (Tabs/SegmentedControl/Dock) anchored to the active item instead of measuring in `lib/indicator.ts` — P2 ↗ CSS anchor positioning
- [ ] Scroll shadows: sticky table head / PageHeader get a shadow only while content is scrolled under them (`@container scroll-state()`) — P2 ↗ CSS scroll-state queries
- [ ] Pointer spotlight on interactive cards (glow follows the pointer via `--x/--y`, ≤ 16%), a material option — P2 ↗ Linear/Vercel, Magic UI
- [ ] `llms.txt` generated from stories (component → props → story example) so AI assistants use the kit correctly during migrations — P2 ↗ HeroUI v3, Mantine 9, shadcn registry
- [x] `useHotkey` fires inside inputs: plain and `shift+` combos (e.g. `shift+?`) swallow typing — skip editable targets unless the combo has `mod` — P1 ★
- [ ] Scoped appearance: `<Scope density="compact" accent=…>` writes the same CSS vars on a subtree (dense table inside a roomy page) — P2 ★ ↗ Radix Themes nested Theme

## Utilities & hooks

- [x] Format helpers on `Intl` returning parts `{ value, unit }` so Stat/charts render big number + small unit: `formatBytes`, `formatBitrate`, `formatDuration`, `formatPercent`, `formatNumber` — P1 ★ ↗ Ark/Chakra Format, Mantine NumberFormatter
- [x] `useSelection` — single/multi, Shift range, Ctrl/⌘ toggle, select all; shared by DataTable, Tree, ImageGrid, Item lists — P1 ↗ Mantine use-selection
- [x] `useVirtual` — one windowing hook for LogView, DataTable, Tree, ImageGrid — P1 ↗ React Aria Virtualizer, antd Listy
- [x] `announce()` — live region for screen readers (copied, saved, "12 results") — P1 ↗ Primer live-region
- [x] `useClipboard` (copied state + reset); base for CopyButton, CodeBlock, KeyValue `copyable` — P1 ↗ Mantine use-clipboard, Ark Clipboard
- [ ] `usePersistentState` — public `readStorage`/`writeStorage` with cross-tab sync (`storage` event) — P2 ★
- [ ] `useInterval` / polling that pauses while the document is hidden (dashboard refresh) — P2 ↗ Mantine use-interval + use-document-visibility
- [ ] `useMediaQuery`, `useElementSize` — P2 ↗ Mantine hooks
- [ ] Export `useIndicator` for consumers' custom controls — P2 ↗ Mantine FloatingIndicator
- [ ] Hotkey registry: `useHotkey` registers into context → generated shortcuts sheet on `?` and CommandPalette hints from the same source — P2 ★
- [ ] `useWindowFocus` + inactive shell state (TitleBar and selection dim when the window loses focus, like native apps) — P2 ★ (Tauri)

## Actions

- [x] Button — variants primary/secondary/outline/ghost/inverse/danger/warn, sizes, icon/iconEnd, loading, active (toggle), block — DT Button, UR Button
- [x] IconButton — label = aria-label + tooltip, round — DT IconButton, UR `size=icon*`
- [x] ButtonGroup
- [x] ConfirmButton — two-step destructive (UR `on`/armed `Remove`)
- [x] CopyButton — icon swaps to a check on success, `announce()` — P1 (needed by CodeBlock, LogView, KeyValue) ↗ Ark Clipboard, Mantine CopyButton

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
- [ ] InputGroup addons — text prefix/suffix segments (`https://`, `px`, `ms`), attached buttons — P2 ↗ shadcn/HeroUI/Chakra InputGroup
- [ ] ColorPicker in OKLCH — L/C area, hue + alpha sliders, text input, EyeDropper API button; also for the AppearanceSettings accent — P2 ↗ Ark/HeroUI/React Aria ColorPicker
- [ ] ChoiceCards `multiple` (checkbox cards) — P2 ↗ Radix Themes CheckboxCards, Chakra CheckboxCard
- [ ] CheckboxGroup with a parent "select all" (indeterminate) — P2 ↗ Base UI CheckboxGroup
- [ ] Fieldset — native `<fieldset>` + legend, `disabled` covers the whole group; used by SchemaForm — P2 ↗ Base UI/Mantine Fieldset
- [ ] Form on the native constraint API — `validity` → Field error, focus the first invalid field on submit — P2 ↗ Base UI Form, React Aria Form
- [ ] TreeSelect / Cascader — P2 ↗ Mantine 9, antd
- [ ] PasswordInput (reveal) — P2
- [ ] OTP / PinInput — per-cell input, paste, autofill (`autocomplete="one-time-code"`) — P2 ↗ Base UI OTPField, Ark PinInput
- [ ] Select `native` variant on `appearance: base-select` (real `<select>` in kit styling) for simple cases — P2 ↗ customizable select
- [ ] PathField — stays in DT (needs its FS API); build on Input + Dialog
- [ ] DateInput / DateRange presets (Last 1h / 24h / 7d / custom) + TimeInput — P2 (native `<input type=date>` styled first) ↗ Mantine dates, React Aria DatePicker

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
- [ ] Text shimmer for pending labels ("Connecting…", "Indexing…") via `background-clip: text` — P2 ↗ AI UIs, Magic UI
- [ ] Card `data-state="running"`: light beam travelling along the gradient rim (`@property` angle + conic gradient), status only — P2 ↗ Magic UI Border Beam
- [ ] Highlight — search matches via CSS Custom Highlight API (`::highlight()`, no DOM wrapping) for CommandPalette, Tree filter, DataTable search — P2 ↗ Mantine/Ark/Chakra Highlight
- [ ] Indicator — dot/count pinned to the corner of any element (avatar, icon button) — P2 ↗ Mantine Indicator, Chakra Float
- [ ] JsonView — collapsible JSON tree, typed colors, copy value/path — P2 ↗ Ark JsonTreeView
- [ ] QrCode — zero-dep SVG encoder (share a connection/subscription link) — P2 ↗ Ark/Chakra/antd QrCode
- [ ] Prose — `.rk-prose` for markdown help/release notes (headings, lists, code, quotes, links) — P2 ↗ Mantine Typography, Radix Themes
- [ ] Spoiler — clamp long text with a fade + "Show more" — P2 ↗ Mantine Spoiler
- [ ] EmptyState presets/tones (success, error, no access, offline) — P2 ↗ antd Result, Primer Blankslate
- [ ] Busy overlay for a region — `inert` + dim + spinner over a card/table while refetching — P2 ↗ Mantine LoadingOverlay
- [ ] Timeline — P2
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
- [ ] Menu radio items — P2
- [ ] Menu async loading + empty state — P2 ↗ React Aria 1.21
- [ ] HoverCard — interactive popover on hover/focus/long press; `interestfor` where supported, JS delay fallback — P2 ↗ React Aria PreviewTrigger
- [ ] Tooltip on `interestfor` + `popover="hint"` (native hover/focus delays and Esc), current JS as fallback — P2 ↗ interest invokers
- [ ] Toast stack: collapsed deck that expands on hover/focus, swipe to dismiss — P2 ↗ Sonner
- [ ] Tour — step-by-step coach marks anchored to elements — P2 ↗ Ark/antd Tour

## Navigation

- [x] Tabs — line / pill (sliding indicator), badge, dirty dot, icon-only, fill, TabPanel — DT Tabs, UR Tabs
- [x] Sidebar (collapsible rail) + NavGroup + NavItem (depth, trailing, hover actions) — DT NavItem/SideRail, UR SideNav
- [x] Dock — `icons` (round buttons + tooltips) and `labels` (icon + text pills) variants, fixed item size with a sliding inverted indicator, dot/count badges, `DockSeparator` + extra actions — UR Dock
- [x] Breadcrumbs, Pagination
- [ ] Stepper / Wizard — P2
- [ ] TopNav (pill nav as links, not tabs) — P2
- [ ] Vertical Tabs (`orientation`) for settings pages — P2 ↗ Radix/Base UI Tabs
- [ ] TableOfContents + `useScrollSpy` for long settings/docs pages — P2 ↗ Mantine TableOfContents, Ark Toc
- [ ] Pagination: page-size select, compact variant ("3 / 20" + prev/next), total — P2 ★
- [ ] SkipLink ("Skip to content") in AppShell — P2 ↗ Chakra SkipNav

## Layout

- [x] AppShell — two layouts (prop `variant` or Settings → Shape → Layout): **islands** — sidebar, header, aside, footer, dock are separate `.rk-surface` panels over the ambient canvas; **inset** — frame parts sit on the background, content + aside are one surface block. Content scrolls under the dock. `headerShape`: bar / pill (concentric with round controls) / none (mobile top rows on the canvas)
- [x] TitleBar — frameless window bar (Tauri drag regions, window controls) — UR TitleBar
- [x] Layout stories: dashboard (sidebar + header), VPN desktop window (title bar + dock), VPN compact/phone (gauge hero + dock), each with a material switcher
- [x] PageHeader (sm/lg), PageBody, Toolbar + Spacer, ActionBar, StatusBar (progress line) — DT Page.tsx, UR Toolbar
- [x] ResizablePanel — pointer + keyboard, persisted — DT ResizableSidebar, LogDock
- [x] Disclosure (native details, exclusive accordion via `name`)
- [ ] FloatingWindow — draggable/resizable non-modal panel (inspector, log, preview) — P2 ↗ Mantine FloatingWindow, Ark FloatingPanel
- [ ] Responsive AppShell — below a container width the sidebar turns into a Drawer, header gets a menu button (layout.css has no breakpoints yet) — P2 ★ ↗ Mantine AppShell + Burger
- [ ] MasterDetail — list + detail side by side, stacked with a back button when narrow — P2 ★
- [ ] DataState — one switch for loading (Skeleton) / error (Callout + retry) / empty (EmptyState) / content — P2 ★
- [ ] Splitter (two panes) — P2
- [ ] PowerButton / hero toggle orb (now a story-only `.vpn-orb`) — P1 when umiray migrates
- Not planned: Stack/Grid/Box — use CSS/Tailwind in apps

## Data

- [x] Table — styled native table, density/sticky/zebra/framed — UR Table
- [x] DataTable — columns, client/server sort, row click/selection, empty — DT TagTable, UR NodeTable/ReportTable
- [x] Tree — keyboard per APG, lazy nodes, trailing, indent guides — DT FolderTree/TensorTree, UR NodeTree
- [ ] Tree: virtualization for large models, drag & drop — P2
- [ ] Tree: tri-state checkboxes, multi-select, type-to-filter — P2 ↗ Ark TreeView, antd Tree
- [ ] DataTable: column visibility menu, pinned first column, inline cell edit — P2 ↗ antd, Primer DataTable
- [ ] Sortable list — reorder by drag and by keyboard (Space lifts, arrows move) — P2 ↗ React Aria useDragAndDrop

## Charts

- [x] Sparkline
- [x] BarChart — vertical/horizontal, solid/hatch, highlight, reference line, tooltips — DT charts HBar/VBar
- [x] LineChart — multi-series, area, gaps, crosshair tooltip, legend — DT RunCharts, UR TrafficChart
- [x] Gauge — segmented arc
- [x] Legend, `seriesColor`, `niceTicks`, `formatCompact`
- [ ] Scatter (log axes) — P2 (DT tag scatter)
- [ ] StackedBar / Donut — P2
- [ ] BarsList — top-N list of horizontal bars with name + value, hatched rest — P2 ↗ Mantine 9 BarsList
- [ ] Brush / zoom range on LineChart for long series (training runs) — P2 ↗ Mantine ChartBrush
- [ ] BulletChart — value vs target + qualitative ranges — P2 ↗ Mantine BulletChart
- [ ] Waffle — part-of-whole grid with hatched rest — P2 ↗ Mantine WaffleChart
- [ ] Treemap — composition (dataset classes, disk usage) — P2 ↗ Mantine Treemap
- [ ] Histogram via a `bin()` helper on top of BarChart — P2 ★ (DT distributions)

## Not planned (2026-09 review)

- Motion-library effects (animated beams, globe, retro grid, marquee), Dock magnification, M3 Expressive shape
  morphing — marketing flourish; break density and the short-motion rule
- Custom ScrollArea (styled native scrollbars are enough), Carousel
- Rating, Transfer, Mentions, Watermark, SignaturePad, FloatButton, NavigationMenu (site mega-menu) — not dashboard/desktop needs
- AngleSlider, ImageCropper, Masonry — until a consumer asks (masonry via CSS grid lanes when it ships)
- Pie, Radar, Sankey, Funnel, Candlestick, Sunburst — Donut/StackedBar/Treemap cover our cases

## Migration (after P0 is stable)

- [ ] dataset-toolkit: replace `shared/ui/*` with rootik, map tokens (`--color-*` → `--rk-*`), keep Tailwind for layout
- [ ] umiray-client: replace `shell/*`, move theme presets (midnight/green/purple) to `RootikProvider defaults` + `extensions` (background image field)
