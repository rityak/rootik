# Changelog

## 1.0.0-beta.2

### Added

- Public `layout`, `navigation`, `controls`, `forms`, `overlays`, `data`, `feedback`, `charts`, `content`, `motion` and `theme` module entries with matching selective CSS.
- Six Signal palettes with separate light/dark recipes: Cobalt, Albedo, Makima, Miyabi, Hoshino and Maomao. UI, mono and display font roles support optional licensed local font assets.
- Padding-safe SVG surfaces, compact control contours, custom backdrops and abstract artwork. SVG decoration can be disabled independently of square corners; Fluent provides plain geometry.
- Shared opt-in SVG light and theme transitions, repeat/off controls and Signal/Reactor power buttons. Motion follows system reduced motion and toolkit settings.
- Production module stories and a Design Lab for comparing palettes, fonts, materials and layout variants.

### Changed

- Production implementations are grouped by module. Existing root and legacy component imports re-export the same components.
- Appearance switches preserve mounted native controls, values, selection, keyboard focus and application state.
- Floating and edge-aligned shells share surfaces, inspector panels, dock variants, drawers, splitters and master/detail layouts.

### Fixed

- Focus outlines stay inside control bounds. SVG focus strokes reserve their full width without moving the contour or content.
- Flex/grid slots shrink within narrow containers; long labels wrap or truncate, while wide code, JSON and data use local scrolling.
- Floating layers respect visible viewport bounds, zoom, resize and on-screen keyboards. Matching an anchor width cannot widen a popup beyond the viewport.
- Dialog headers, footers and dismiss controls stay outside shrinking scroll bodies. Floating windows clamp their initial and resized position without remounting fields.
- SVG rims/glass, vertical navigation, command search focus, disclosure spacing, JSON copy actions and color-picker gamut rendering.

### Compatibility and release status

- React remains the only runtime dependency; Vanilla Extract is build-time only. Consumers import pre-extracted CSS and need no Vanilla Extract plugin.
- The package-wide legacy appearance default is unchanged. Signal palettes, fonts and decorative effects are explicit choices.
- This is a prerelease for the npm `next` channel. Version preparation and a local tarball do not publish it; publishing the matching GitHub prerelease triggers the existing npm workflow.
- Native WebView/browser and assistive-technology coverage, composited glass contrast, reference-machine performance and remaining consumer adoption are stable-release gates. See `AUDIT-2.0.md` and `MIGRATION-DESIGN.md`.

## 1.0.0-beta.1

Initial 1.0 preview: Vanilla Extract authoring, extracted/selective CSS, package compatibility checks and the first migration/audit fixes. Published previews use `next`; stable releases use `latest`.
