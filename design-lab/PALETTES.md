# Palette review

QA screenshots referenced below are local artifacts in the ignored `design-lab/screenshots/` directory; they are not included in Git or npm releases.

## Problems in the previous revision

- One lightness/chroma formula made every dark theme the same pastel accent on tinted graphite.
- Albedo, Makima and Nogotoro shared a warm paper hue and gold-tinted wash, so large surfaces looked interchangeable.
- The surrounding shell retained Iris even when the sample palette changed.
- Generic rectangular focus outlines disagreed with notches and clipped corners. Stacking field and input outlines made a double frame.

## Curated set

| Theme | Material and hierarchy | Decision |
| --- | --- | --- |
| Cobalt | Steel panels, saturated blue action, cold secondary ink. Blue graphite in dark mode. | Rename Classic Blue; keep a predictable technical baseline. |
| Albedo | Nearly achromatic porcelain and obsidian. Gold belongs to secondary details; the dark primary action becomes an ivory pill. | Remove the creamy canvas and purple-primary duplication. |
| Makima | Rose stone panels, cinnabar action, cool slate secondary. Cool charcoal wells in dark mode. | Remove yellow paper and gold wash; separate it from Albedo. |
| Miyabi | Sea-glass surfaces and deep indigo action; midnight surfaces with an icy jade action in dark mode. Vermilion is a restrained graphic detail. | Preserve a distinct cool material rather than another blue preset. |
| Hoshino | Lilac surfaces, plum action, muted rose secondary and small blue details. | Keep the expressive purple family; avoid a uniformly pink page. |
| Maomao | Celadon surfaces, jade action, muted plum secondary and small brass details. | Replace the redundant Nogotoro direction and the provisional Moss name. |

These are visual design choices, not literal character color extractions. Every theme has explicit light and dark material recipes. The page canvas is shared, almost neutral: light `oklch(0.962 0.001 265)`, dark `oklch(0.175 0.001 265)`. There is no accent wash on the page. The sample stage and actual panels retain the theme's tint; text remains low-chroma.

## Roles and interaction

- Action: the primary button, interactive text, focus and chosen datum. More saturated than surfaces.
- Secondary: subordinate Preview actions and supporting SVG strokes. Tonal fills keep them subordinate to Save.
- Detail: small decorative SVG marks, never the only indication of a route/status/error.
- Material: canvas-independent surface/raised/well colors. Layer separation uses lightness, a restrained rim and short shadow.
- Semantics: success, warning, error and info retain consistent roles. Errors have visible messages and `aria-invalid`; active connection includes text.

## Focus without layout changes

SVG controls keep the same native element, dimensions and rectangular hit target. Keyboard focus thickens the existing path to 3px and subtly changes its fill; a short drop shadow is supplementary. Filled buttons use their label color for the focus stroke, so the cue remains visible on both light and dark action fills. Input errors keep their red stroke. No extra rectangular ring, scale, translation or content reflow is introduced. Forced-colors mode keeps the ordinary outline fallback.

Panel-specimen focus and selection use the real SVG rim. Palette/artwork tiles use their existing border plus shadow; selection also has `aria-pressed` and a surface change. Native controls outside this SVG experiment retain Rootik's existing focus behavior.

## Validation criteria

Contrast gates use [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) (4.5:1) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) (3:1). [Use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) requires another cue for meaningful states; labels and native semantics remain in place.

`src/stories/svg-palettes.test.ts` checks opaque text/action/hover, field edges, error colors, selected-navigation labels, palette material separation and the shared neutral canvas. Browser verification additionally checks computed colors, real SVG focus, dimensions before/after focus, theme switching and narrow layout. These are selected checks, not an accessibility certification or a guarantee for arbitrary glass backdrops.

The palettes remain Design Lab scopes. Public SvgSurface/SvgBackdrop/SvgArtwork and optional control borders are shipped by the toolkit. Firefox, Safari, Windows WebView, screen readers, forced-colors visual behavior and GPU profiling require separate validation.

## Verified revision

- `bun run check`: 122 tests passed (105 unit / 17 DOM), types, Biome and generated CSS checks passed.
- Toolkit package build, declaration output, selective CSS and Node SSR passed. Ladle and standalone Design Lab production builds passed.
- All twelve palette/mode combinations were captured in Chromium. Every light theme renders the same `oklch(0.962 0.001 265)` page; every dark theme renders `oklch(0.175 0.001 265)`. Panel colors differ independently.
- 144 browser-computed contrast checks passed, including field boundaries, errors, secondary actions and focused button/input colors. Minimum primary-label ratio: 7.21:1. Minimum checked focus-stroke ratio: 5.81:1. No rounding was applied before threshold comparisons.
- Native input and wrapper outlines are absent for SVG controls in normal mode; the focused SVG stroke measures 3px. Button/input document coordinates and dimensions match before and after focus across all twelve combinations. Buttons have no scale transform.
- Shaped specimen keyboard focus uses its 3px SVG rim; selected specimens use a 1.5px rim. Both have no detached rectangle.
- At 375px CSS viewport width, light Makima and dark Maomao have no horizontal document overflow or clipped controls. Browser console contained no errors during the checked flows.

Artifacts: six palettes (`screenshots/palettes-refined-board.jpg`), soft/notched focus (`screenshots/focus-refined-board.jpg`), mobile light (`screenshots/palettes-refined-mobile-light.png`), mobile dark (`screenshots/palettes-refined-mobile-dark.png`).
