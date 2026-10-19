# Typography study

QA screenshots referenced below are local artifacts in the ignored `design-lab/screenshots/` directory; they are not included in Git or npm releases.

Open `/design-lab/?direction=signal-light&screen=typography&palette=maomao` or **Design Lab / Typography** in Ladle. This is an implemented comparison surface, not a new public appearance API. The initial UI and mono stacks are system fonts; the existing toolkit defaults remain unchanged.

## Recommendation

Compare **Rubik + JetBrains Mono** with **Onest + Literata** as two distinct UI directions. Rubik replaces the rejected Inter preset: squared forms with rounded corners bring more character to labels, controls and headings, with genuine Cyrillic italic and weights 300–900. Onest retains its softer drawing. JetBrains Mono is limited to logs, addresses, identifiers and code in both directions. Proportional UI with tabular figures is preferable to making every number monospace.

Onest has no genuine italic. The **Onest + Literata** preset uses Literata for expressive display italics and Onest in controls. The **Rubik + JetBrains** preset uses Rubik in both places. Inter remains an individual comparison family. Golos Text remains a Cyrillic reading alternative. Geist is retained as the existing comparison baseline rather than presented as another new direction.

These are current available families, not a ranking of fashion or popularity. Research checked official family sources and the actual installed Fontsource metadata and CSS on 2026-10-18.

| Family | Installed package | Weight range | Genuine italic | Intended role |
| --- | --- | --- | --- | --- |
| System | Platform | Platform-dependent | Platform-dependent | Default and fallback |
| Inter | 5.3.0 | 100–900 | Yes | Dense UI alternative |
| Rubik | 5.3.0 | 300–900 | Yes | Rounded angular UI direction |
| Onest | 5.3.1 | 100–900 | No | Soft UI direction |
| Golos Text | 5.3.0 | 400–900 | No | Cyrillic text and reading |
| Geist | 5.3.0 | 100–900 | Yes | Existing baseline |
| JetBrains Mono | 5.3.0 | 100–800 | Yes | Technical data |
| Literata | 5.3.0 | 200–900 | Yes | Display headings and expressive italic |

Geist Mono 5.3.0 is also available in the mono selector, with its actual normal/italic variable faces. Package versions describe the distribution, not upstream family version numbers.

Sources: [Inter](https://rsms.me/inter/), [Rubik current metadata](https://github.com/google/fonts/blob/main/ofl/rubik/METADATA.pb), [Rubik design and Cyrillic](https://github.com/googlefonts/rubik), [Onest distribution and styles](https://fontsource.org/fonts/onest/about), [Golos Text](https://github.com/googlefonts/golos-text), [Geist](https://vercel.com/font), [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), [Literata](https://github.com/googlefonts/literata).

## Type rules

- Body: 14px / 22px, weight 400. Controls: 13px / 18px, weight 550. Captions: 12px / 18px. Mono metadata: 11px only where space is constrained.
- Section: 20px / 28px, weight 600. Title: 28px / 34px, weight 550. Display: up to 48px / 52px, weight 450, reduced at narrow widths.
- Normal letter spacing for body text; restrained negative tracking for large headings only. No uppercase treatment for long Russian labels.
- Bold and italic express hierarchy rather than compensate for small text. No synthetic bold or italic: `font-synthesis: none`. Onest/Golos specimens explicitly identify their lack of italic. Requested weights outside a family's range resolve to its nearest available weight.
- Optical sizing and kerning are enabled. Table figures use `tabular-nums`; code ligatures are optional. Identical glyph probes cover Cyrillic, Ё/Й, №/₽ and ambiguous Latin/digit forms.
- Each comparison card has normal, 400/500/600/700 weights, bold, and actual italic/bold italic where supplied. Fixed role samples remain fixed while live body controls allow 13–16px and 400–600.

## Implementation and cost

`typography-model.ts` contains family metadata and fallbacks; `typography-lab.tsx` composes existing Rootik controls; `styles/typography-lab.css.ts` authors static CSS through Vanilla Extract. The family, mono and display selectors are independent. Three presets configure complete combinations. Palette and light/dark switching preserve the selected combination.

Fontsource packages are development dependencies only. The typography screen is lazy-loaded; its CSS and new face declarations are deferred until the screen opens. The comparison page deliberately displays all families, so it loads several faces even when System is selected. A production consumer should bundle only its chosen families, scripts and styles. No CDN or runtime font library is required, and the new samples are excluded from the published toolkit sources.

Direct CSS imports belong in the component module: a CSS-only TypeScript intermediary can be removed by this repository's CSS-only `sideEffects` policy. The build guard checks actual Cyrillic normal/italic `@font-face` declarations, local WOFF2 references (including small inline data fonts), and bundled OFL license files. Font files existing in assets alone do not prove that a browser loads them.

All eight family licenses (including Geist Mono) are copied to `public/font-licenses/` and carried into the standalone output. System stacks use platform fonts and do not require bundled files themselves.

## Artifacts and validation

Rubik addition: `bun run check` passes all 123 tests; the preset regression verifies different UI families for Rubik and Onest while retaining the shared mono choice. Standalone and Ladle builds pass. The production guard verifies Cyrillic normal/italic declarations, local assets and the Rubik license. Chromium confirms Rubik in real input controls, declared Cyrillic 300–900 normal/italic faces, and loaded rendered italic/bold italic. At 375px CSS width with 16px / 600 body text, document width equals the 365px client area in both modes. Rubik remains selected across theme switching; Onest + Literata retains its original UI/mono/display combination. No browser console warnings/errors were captured.

- Rubik and Onest specimens (`screenshots/typography-rubik-board.jpg`)
- Rubik and Onest + Literata on the same controls (`screenshots/typography-rubik-ui-board.jpg`)
- Rubik full page (`screenshots/typography-rubik-current.png`), Rubik mobile dark stress case (`screenshots/typography-rubik-mobile-dark.png`)

- Original interface combinations, before the Rubik addition (`screenshots/typography-board.jpg`)
- Original seven family specimens (`screenshots/typography-specimens.jpg`)
- Inter light, full page (`screenshots/typography-inter.png`), Inter dark (`screenshots/typography-inter-dark.png`), 375px stress case (`screenshots/typography-mobile.png`)
- `bun run build:design-lab` builds the standalone page and runs the font declaration/asset/license guard.
- `bun run check`: 123 passing tests, including independent typography instances, presets, native field/actions, italic availability and unique control IDs.
- Chromium on Windows: declared Cyrillic faces and loaded rendered italic/bold italic verified; Inter tabular examples have equal widths, proportional examples differ; code ligature setting changes computed features. Both modes preserve the selected family pair. No console warnings/errors in the tested page.
- At 375px CSS width, every UI family was tested with 16px / 600 body text: document width equals its 365px client area. Tables/code keep their own horizontal scrolling. The normal desktop viewport was also checked without document overflow.

Platform font metrics on macOS/Linux, Safari/Firefox/WebView, screen-reader reading, OS-level font failure and full performance profiling remain unverified. These checks do not certify the rest of the UI kit's typography or accessibility.
