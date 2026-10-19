# Rootik design directions

QA screenshots referenced below are local artifacts in the ignored `design-lab/screenshots/` directory; they are not included in Git or npm releases.

## Production controls module

The shared motion study is available in Controls, Layout and Navigation: choose decorative strength, sheen/ripple/flow and fade/wipe/iris theme changes. Controls includes Signal/Reactor VPN power buttons with cancellable pending states. Production effects default to off; module studies start with subtle effects. [Motion API and accessibility contracts](../MOTION.md).

Open `/design-lab/?direction=signal-light&screen=controls` or choose **Controls / модуль**. Seventeen production control families use `rootik/controls` and its selective CSS. The screen compares six palettes, light/dark, four contours, sizes, SVG off, square corners, motion and Fluent. Actions, loading/errors, native fields, custom/native selects, combobox/tags, number/PIN, choices, sliders, dates and color are interactive. [API and contracts](../CONTROLS.md).

Validation: 133 tests (108 unit/SSR, 25 DOM), packed source/dist/Node SSR/Tailwind fixtures and both production builds pass. Chromium checks cover native control interactions, light/dark, Fluent, zero radius and motion off. SVG/CSS switching produces zero size/position changes across 43 boxes; 365px layouts keep large PIN cells inside their content region. Light (`screenshots/controls-svg-light.png`), dark (`screenshots/controls-svg-dark.png`), Fluent (`screenshots/controls-fluent-light.png`), mobile (`screenshots/controls-mobile.png`), measurements (`screenshots/controls-stability.json`).

## Production navigation module

Open `/design-lab/?direction=signal-light&screen=navigation` or choose **Navigation / модуль**. It uses `rootik/navigation` implementations and selective CSS. SVG borders appear on sidebar rows, pill tabs and segments; the same native controls remain mounted with SVG off or Fluent selected. The example includes routing, line-free pill tabs, vertical tabs, native radio segments, breadcrumbs, pagination, context/submenus and menubar. [API and contracts](../NAVIGATION.md).

## Production layout module

Open `/design-lab/?direction=signal-light&screen=layout`. This screen uses the public layout implementation and selective toolkit CSS. Controls compare floating and edge-aligned frames, six palettes, light/dark modes, typography, SVG contours, square corners and the Fluent fallback. Dock and inspector can be toggled; the inspector resizes with mouse or keyboard. The Modules view demonstrates Toolbar, MasterDetail, PageBody and ActionBar; narrow screens use ShellMenuButton and a real drawer.

The older SVG and typography screens remain design studies. [Migration plan](../MIGRATION-DESIGN.md), [layout API](../LAYOUT.md).

Saved browser examples: floating Rootik (`screenshots/layout-rootik-floating.png`), dark Rootik (`screenshots/layout-rootik-dark.png`), edge-aligned Fluent (`screenshots/layout-fluent-edge.png`), mobile frame (`screenshots/layout-mobile.png`). Browser checks cover contour/radius disabling, both frame modes, dock navigation, keyboard resize, toolbar focus, narrow master/detail and drawer navigation. Package checks cover packed source/dist, Node SSR, selective CSS and Tailwind integration; real consumer applications have not been migrated in this slice.

## Typography study

Open `/design-lab/?direction=signal-light&screen=typography&palette=maomao` or choose **Typography** in the lab. Eight family specimens, real Cyrillic/italic/bold samples, live controls, table figures, logs and a role scale compare System, Inter, Rubik, Onest, Golos Text, Geist, JetBrains Mono and Literata. The three presets are System, Rubik + JetBrains, and Onest + Literata. Rubik replaces the rejected Inter preset with a separate UI family; System remains the initial lab default. Public toolkit defaults are unchanged.

See [selection rationale, sources and checks](TYPOGRAPHY.md), Rubik / Onest interface comparison (`screenshots/typography-rubik-ui-board.jpg`), and Rubik / Onest specimens (`screenshots/typography-rubik-board.jpg`). Earlier comparisons remain in the study notes. `bun run build:design-lab` also verifies Cyrillic face declarations, local font assets and licenses.

## Current SVG study: curated palettes and contour focus

Open `/design-lab/?direction=signal-light&screen=svg&palette=albedo`. Six palettes support both modes: `cobalt`, `albedo`, `makima`, `miyabi`, `hoshino`, `maomao`. Cobalt replaces Classic Blue; Maomao replaces the redundant Nogotoro/Moss direction.

The page canvas is nearly neutral (approximately #f2f2f3 in light mode) and identical across themes. Color belongs to panels, wells, actions and SVG details. Each mode has an explicit recipe, rather than a common hue-rotation formula. Albedo is achromatic porcelain/obsidian with small gold details; Makima uses rose stone and cool charcoal without a yellow base. Theme colors apply to the surrounding Material Lab shell as well as the samples. Other screens retain their existing study styling.

Keyboard focus on shaped Button/Input/IconButton follows the SVG contour: a thicker existing rim, a small fill change and a short shadow. No detached rectangular outline or pressed scaling is used. Native refs, labels, disabled/loading/error states and hit targets remain unchanged. Forced-colors mode retains a conventional outline. Palette/artwork tiles use a flush border and shadow; shaped specimen selection/focus follows the surface's own SVG rim.

- Eight panel shapes share one protected-padding contract.
- Dots, stripes, grid, crosses, hexagons and custom React SVG backgrounds are included.
- Six abstract SVG artworks support optional motion through Rootik tokens.
- Four control borders: `soft`, `cut`, `notch`, `ticket`.
- Styles are authored in Vanilla Extract, including the palette recipes' generated CSS. No runtime dependencies were added.

See the [palette rationale, color roles and validation limits](PALETTES.md), [SVG API](../SVG.md), and six-palette comparison (`screenshots/palettes-refined-board.jpg`).

The original exploration and previous screenshots below remain reference artifacts.

## Current study: Rootik Signal

Signal combines the selected Soft light direction with Instrument's segmented indicators and dotted data. Both themes share geometry, controls, charts and screen layout. Rootik's Iris accent, light numeric typography, inverted navigation selection and hatched remainder carry through.

- **Light:** matte neutral surfaces, recessed inputs, a continuous metric band, visible field edges and darker secondary text.
- **Dark:** the same surfaces and spacing in tinted graphite, with restrained relief and a light selected navigation pill.
- Theme changes preserve added nodes, selected node, filters, connection state and settings drafts.
- Compare with the other theme, Soft light, Instrument or the current toolkit. The first exploration remains under **Previous directions**.

Screenshots: Signal pair (`screenshots/signal-board.jpg`), Light (`screenshots/signal-light.png`), Dark (`screenshots/signal-dark.png`), Light settings (`screenshots/signal-light-settings.png`), Dark settings (`screenshots/signal-dark-settings.png`).

Measured from the browser's rendered token values using the existing OKLCH conversion helper:

| Opaque pair | Light | Dark |
| --- | ---: | ---: |
| Secondary text, worst of the four main surfaces | 5.12:1 | 5.68:1 |
| Input edge against recessed field | 3.57:1 | 4.83:1 |
| Primary action label | 5.37:1 | 8.55:1 |
| Selected navigation label | 14.25:1 | 14.43:1 |

These are selected contrast pairs, not a complete accessibility audit. Browser checks cover native form validation, creation, filtering, dial updates from selection, settings submission, theme state retention and measured CSS widths of 375, 768 and 1440px without document overflow. Compact table rows measure about 45px versus 51px at normal density in the tested browser.

The new skin lives in `.ladle/design-signal.css`; the existing comparison screen and actual Rootik controls are reused. Toolkit defaults and the public appearance API are unchanged.

## Run

Run from the repository root:

```powershell
node node_modules/vite/bin/vite.js --config design-lab/vite.config.ts
```

Open http://127.0.0.1:61002/design-lab/. Also available in Ladle as **Design Lab / Directions** after a server restart.

The baseline renders the current Rootik Card, DataTable, Button, Input, Slider, Switch, Form and Dialog styles in the same demonstration screen as the experiments. The shared screen is a comparison fixture, not a screenshot of an existing consumer. Its navigation and chart composition are specific to the fixture.

| Direction | Reference | Experiment | Cost |
| --- | --- | --- | --- |
| Current Rootik | Current dev | Actual Iris / Veil defaults | Baseline |
| Graphite | Images 2, 4 | Continuous chassis, recessed navigation, raised active controls, mint signal | Relief must keep visible boundaries |
| Instrument | Images 5, 6 | Narrow rail, open sections, mono labels, segmented and dotted data | Keep body text conventional; avoid decoration on every label |
| Porcelain | Images 3, 7 | Bright perimeter, top navigation, dark inset modules | Two surface contexts need coordinated tokens |
| Soft light | Images 1, 3 | Matte light canvas, tactile controls, flat readable table | Full light palette and contrast validation needed |

All experiments stay in `.ladle/design-lab.css`, scoped under `.rd-lab`. No toolkit styles, public exports, dependencies or appearance defaults change. These are independent design directions in one review surface, not four changes to the production theme system.

Screenshots: comparison board (`screenshots/directions-board.jpg`), current (`screenshots/current.png`), Graphite (`screenshots/graphite.png`), Instrument (`screenshots/instrument.png`), Porcelain (`screenshots/porcelain.png`), Soft light (`screenshots/soft.png`).

## Review

- Switch between Overview, Table and Settings; choose compact density.
- Compare with the selected reference. At wide widths the previews sit side by side; smaller windows stack them.
- Filter/sort nodes, select a row to update the inspector, toggle the local connection state.
- Add a node with a validated native dialog; Escape closes it. Data is local and resets when changing to an archived direction or reloading; switching between Signal's light and dark themes preserves it.
- Submit the settings form. Saving only confirms local demo state and sends no network requests.

Fixture traffic is synthetic, reused across time ranges to compare the same visual marks; period totals and axis labels are illustrative. This is visual research, not performance or accessibility certification. No images, fonts or data are requested from external services.

Build a standalone copy with the installed Vite CLI:

```powershell
node node_modules/vite/bin/vite.js build --config design-lab/vite.config.ts
```

Output: `build-design-lab/design-lab/index.html` with local JS/CSS/font assets. Serve the `build-design-lab` directory over HTTP. This output is separate from Ladle's `build/` so either build can run without deleting the other.

## Navigation module validation

Open `/design-lab/?direction=signal-light&screen=navigation` for the production navigation module. `bun run check` passes 131 tests (108 unit/SSR, 23 DOM); packed source/dist/Node SSR/Tailwind fixtures, Lab and Ladle builds pass. Chromium checks cover keyboard tabs/radios, pagination, drawer/sidebar/dock routing, menus/submenus, menubar and focus return. A 365px document has no horizontal overflow. SVG/CSS switching preserves native controls and selection, with zero measured width/height/horizontal shifts across 15 controls and vertical differences below 0.001px.

Evidence: light SVG (`screenshots/navigation-svg-light.png`), dark SVG (`screenshots/navigation-svg-dark.png`), Fluent (`screenshots/navigation-fluent-light.png`), geometry measurements (`screenshots/navigation-stability.json`). Component contracts and remaining validation gates are in [NAVIGATION.md](../NAVIGATION.md).

## Validation — previous design-lab revision

Verified in Chromium: all five directions; desktop comparison; 375px viewport without document-level horizontal overflow; native invalid-form feedback and valid node creation; filtering, row selection, settings submission. The shared screen intentionally scrolls its table horizontally at small widths.

`bun run check`: 117 tests passed, including a DOM regression covering empty node submission, successful creation, inspector updates, independent comparison data and connection state, SVG ID isolation, palette isolation and parameterized geometry. Both the standalone Vite production build and Ladle build pass; The generated `llms.txt` index is current. Firefox, Safari, WebView, screen readers, complete light-theme contrast and production performance have not been validated for these experiments.


## SVG core validation — previous revision

- `bun run check`: 117 tests passed (101 unit / 16 DOM), including the shared geometry budget, paired-notch alignment, minimal-padding contours, unique IDs, real stripe paths and interactive HTML controls.
- `bun run build`: ESM, declarations, aggregate/selective CSS and Node SSR passed. `bun run build:stories` passed. The standalone build passed on bundled Node 24.19; system Node 24.15 once raised a libuv assertion during shutdown after writing output.
- Chromium: SVG stripe rendering verified independently from the gradient; custom ribbon slot, dark palette, shape controls, clipping, motion and motion-off toggle inspected. On 375px CSS width, both 24px and 72px content padding were checked with extreme depth/width/position; document width remained 365px without horizontal overflow. Field editing and Apply work inside the shaped surface.
- The first sandbox preview accepted a port but did not respond to HTTP. Its PID/command was verified and it was restarted outside the sandbox; the exact final build was reloaded in the browser.
- Windows WebView, Firefox/Safari, complete contrast measurements, OS-level reduced-motion emulation and GPU profiling remain unverified.

Screenshots: overview board (`screenshots/svg-core-board.jpg`), light full page (`screenshots/svg-core-light.png`), dark full page (`screenshots/svg-core-dark.png`), eight light shapes (`screenshots/svg-core-light-forms.png`), abstract SVG studies (`screenshots/svg-core-dark-artwork.png`), mobile safe-area check (`screenshots/svg-core-mobile.png`).
