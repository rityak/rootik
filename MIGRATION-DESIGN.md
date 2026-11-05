# Signal design migration

The accepted direction combines Soft Light materials, Instrument data rhythm, padding-safe SVG geometry, six palettes and the approved typography study. This is a staged migration of the actual toolkit, with one implementation per component.

## Module order

| Stage | Public entry | Scope | Completion gate |
| --- | --- | --- | --- |
| 0 | `/theme` | Shared palette recipes, light/dark modes, font roles, motion and material tokens | Scopes and persistence remain correct; local optional fonts; measured text/control contrast |
| 1 | `/layout` | AppShell, page structure, bars, resizable/master-detail panels, SVG surfaces/backdrops/artwork | Production exports and selective CSS, keyboard/mobile behavior, real layout story without lab CSS |
| 2 | `/navigation` | Sidebar, nav, tabs, segmented controls, dock, menus, breadcrumbs | Selected/focus states and keyboard navigation in both modes |
| 3 | `/controls` | Buttons, icon buttons, inputs, select, toggles, slider, number/date/color controls | Shared contour vocabulary, visible focus, no layout shifts, native behavior |
| 4 | `/forms` | Field, forms, validation, settings and schema forms | Labels, hints, errors and translations through existing contracts |
| 5 | `/overlays` | Dialog, drawer, popover, tooltip, hover card, toast, command palette | Native top layer, focus return, stacking, color inheritance |
| 6 | `/data` | Tables, lists, trees, sorting, selection, virtualized collections | Dense Cyrillic data, pinned columns and keyboard/virtualization behavior |
| 7 | `/feedback` | Status, badges, progress, meter, busy, skeleton, empty/error states | Semantic color/text alternatives and reduced motion |
| 8 | `/charts` | Charts, gauges, sparklines, trackers, heatmaps | Legible palettes in both modes and dense layouts |
| 9 | `/content` | Text, content cards, disclosure, code/log/JSON, avatars and media | Type hierarchy, content composition and existing interactions |

Stage 0 supplies the minimum shared foundation needed by stage 1. It is not a second theme provider. RootikProvider and Scope remain the appearance owners. Source implementations move with their module; old root imports and component paths re-export those same functions during migration.

## Architecture rules

- A module has `src/<group>/index.ts`, implementations split by responsibility, a public `rootik/<group>` export, and `rootik/<group>/styles.css` backed by the generated selective CSS closure.
- Author styles in Vanilla Extract. Generated CSS is never edited; consumers need no VE plugin. No runtime dependency besides React.
- Import other groups through their implementation files internally. A public barrel is a consumer boundary, not an internal dependency hub.
- Palette data belongs to the toolkit. Stories may import it; production code never imports a story or `.ladle` CSS.
- Keep six material recipes: Cobalt, Albedo, Makima, Miyabi, Hoshino and Maomao. The page canvas remains nearly neutral; color lives on surfaces, controls and meaningful details.
- Keep System as the zero-download font choice. Rubik and Onest are separate UI families, JetBrains Mono is a technical role, and Literata is a display option. Bundle optional local fonts with their licenses.
- SVG decoration stays outside the protected content rectangle, within padding. Controls keep native semantics and a visible contour focus without translation/scale. Respect reduced motion and forced colors.
- All stages integrate the shared `/motion` toolkit from the start: opt-in light variations, event-driven theme changes, stable geometry and complete effects/motion/SVG/Fluent fallbacks. See [MOTION.md](MOTION.md) and AGENTS.md.
- Preserve public APIs while migrating. Switch the package-wide default only after the dependent groups pass their gates; the new named themes are usable immediately for migrated layouts.

## Current slice


Stage 9 has its public `rootik/content` entry and selective CSS. Cards, text, readers/editors, native disclosure, avatars and media retain root and legacy identities. Shared SVG surfaces preserve protected padding and mounted content. Dedicated syntax ink, fixed QR polarity, text roles, native media recovery and Lightbox pointer/focus repairs complete this slice. See [CONTENT.md](CONTENT.md).

The remaining public helpers now live in their owning modules: FloatingWindow/Splitter in layout, SelectPanel in data, Stepper in navigation and Tour in overlays. All public component implementations are grouped; `components/` retains compatibility shims and the internal SVG control-frame helper.

Stage 8 now has its public `rootik/charts` entry and selective CSS. All chart families retain root and legacy identities. ChartPanel composes the shared SVG material with optional single-pass motion, stable axes and data/table state. Named light/dark data palettes and heatmap/treemap ink have measured contrast. See [CHARTS.md](CHARTS.md).

Stage 7 has its public `rootik/feedback` entry and selective CSS. Status, badges, progress/rings/meters, busy/skeleton and data/result states retain their root and legacy identities. Optional SVG tracks, segmented rings, message surfaces and repeat controls preserve geometry and accessible state. See [FEEDBACK.md](FEEDBACK.md) and [DATA.md](DATA.md).

- Layout module decomposition and compatibility exports.
- Production palette foundation, explicit light/dark appearance and independent font roles.
- SVG-backed shell parts and a custom backdrop slot in AppShell.
- Floating and edge-aligned frames, floating/taskbar dock, inspector, native drawer, resize and master/detail examples.
- Shared SVG contour toggle, global zero-radius handling and a square, solid Fluent fallback using the same palette.
- A production Layout story and a Design Lab entry that render the public module and toolkit styles.
- DOM/SSR/export/CSS closure checks and browser verification at desktop/mobile widths.

Stages 0–9 now have their module source and public/selective entries. This closes module decomposition and the local design-study pass; it does not switch the package-wide default or replace consumer integration/release gates.

The feedback gate includes finite accessible values, text alternatives, isolated SVG masks, retained busy content, caller-owned retry, motion/repeat fallbacks and packed module/CSS compatibility. The same slice repairs CommandPalette focus styling, SVG glass clipping, dark rim visibility and vertical tab composition. Real consumer applications and the full assistive-technology/browser matrix remain separate migration gates. The charts gate adds packed exports, bounded numeric helpers, conditional measurement reconnection, exact table/brush behavior and keyboard history recovery. The next gate is cross-module consumer integration and the browser/assistive-technology/performance matrix.


## Consumer verification (2026-10-19)

The current packed distribution typechecks and builds the existing umiray-client frontend with its Vite 7/Tailwind 4/React Compiler configuration. An isolated alias configuration points at the extracted tarball; the consumer checkout, package manifest and lockfile remain unchanged. A separate development-mode build includes the consumer's own mock bridge for browser checks and does not contact a native backend.

Chromium checks cover Cobalt light/dark, connection/groups/routing/log navigation, log search, equal document/client widths and appearance persistence after reload. Evidence: `audit/signal-consumer.json` and `design-lab/screenshots/consumer-cobalt-*.png`. Native Tauri networking, other browser engines, assistive technology, GPU/cold-start profiling and dataset-toolkit adoption are not validated by this frontend exercise. Dataset-toolkit currently has no Rootik dependency, so migrating its UI is separate application work. The package-wide legacy default remains unchanged pending release gates.

## Helper completion

FloatingWindow, SelectPanel and Tour now compose the shared SVG surface/motion contract on their native floating hosts. Stepper has optional SVG markers and retains its current button for focus stability. Splitter offers an optional grip with a reserved, appearance-independent hit area. The four module examples exercise these additions; DOM regressions cover retained fields/selection, keyboard behavior, caller Escape handling and guide focus return.


Helper validation: 112 unit/SSR tests and 77 DOM tests pass, including five helper regressions. Design Lab, Ladle and packed dist/source/SSR builds pass with helper imports. Chromium retained the inspector's 360 x 280 box, its moved x=136 position and typed value across SVG Off/Fluent; Stepper retained the selected button focus; Tour changed targets and returned focus to its launcher without stealing focus on SVG toggles. The picker at 365 CSS px stayed within the viewport with equal document/client widths, a separate selection-count row and its shared Input rim. Native platform and assistive-technology gates remain open.
