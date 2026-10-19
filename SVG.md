# SVG layout and artwork

Authoring lives in `styles/svg-*.css.ts` (Vanilla Extract); generated CSS is shipped for consumers. No SVG/animation runtime dependency is required. Import `rootik/styles.css`, or the selective `rootik/css/svg-surface.css`, `rootik/css/svg-backdrop.css`, `rootik/css/svg-artwork.css` entries you use.

```tsx
import { Button, SvgArtwork, SvgBackdrop, SvgSurface } from "rootik";

export function Panel() {
  return (
    <SvgSurface
      shape="saddle" edge="top" padding={{ top: 48, right: 36, bottom: 36, left: 36 }}
      depth={0.8} position={0.65} span={0.32} opacity={0.82} contours
    >
      <h2>Gateway</h2>
      <div style={{ width: 120 }}><SvgArtwork variant="ribbons" motion="drift" /></div>
      <Button>Connect</Button>
    </SvgSurface>
  );
}
```

## One padding contract

`shape`: `rounded`, `saddle`, `scoop`, `step`, `bevel`, `ticket`, `wave`, `corner`.
`edge`: `top`, `right`, `bottom`, `left`; `ticket` affects the opposite edge too.
`depth` and `position` are clamped to 0–1. Position runs left-to-right on horizontal edges and top-to-bottom on vertical edges; paired notches remain aligned. `span` is clamped to 0.12–0.75 of the edge's straight segment.
`padding` is pixels, scalar or a partial `{top,right,bottom,left}`, default 36, minimum 8; omitted sides use 36.

The same normalized padding places HTML content and limits inward deformation. Corner geometry and nested contours share that budget. Padding automatically limits depth; additional contour lines are omitted when there is no room. At tiny sizes the padding is capped to half the measured frame. No shape-specific CSS padding is needed. `showSafeArea` draws the protected rectangle, `wireframe` removes material fills, `contentClassName` sets the inner layout.

Keep children in normal layout. Explicit overflow, negative margins, absolute positioning or `!important` content padding in consumer CSS can intentionally escape this contract. The shell does not clip interactive content or focus rings. ResizeObserver measures the outer shell; SSR uses a stable 600×360 drawing until it is measured, while HTML content remains available.

`opacity` and `shadow` are 0–1; `glass` enables backdrop blur. `background` accepts a decorative React layer clipped to the shell. Cobalt, Albedo, Makima, Miyabi, Hoshino and Maomao are now production `RootikProvider.theme` values, with `colorMode: "light" | "dark"`. Each mode defines surfaces and action/secondary/detail colors. The canvas stays nearly neutral; tint belongs to panels and controls. See the [palette review](design-lab/PALETTES.md) and [layout usage](LAYOUT.md).

`RootikProvider` and `Scope` accept `svgShapes: false`: surfaces use ordinary CSS boundaries and controls omit SVG frames, keeping their content padding. `style: "fluent"` also disables contours and glass. `corners: "square"` or `radius: 0` removes all corner rounding, including SVG corners and pills; edge features remain independently switchable. A surface's optional `radius` caps geometry within the padding budget; a global square/zero-radius setting takes precedence. Artwork and background patterns are separate decorations and remain available with contours off.

## SVG control borders

```tsx
import { Button, IconButton, Input } from "rootik";

<Button svgBorder="cut" variant="primary">Save</Button>
<Input svgBorder="notch" aria-label="Gateway name" />
<IconButton svgBorder="ticket" variant="outline" icon={<Plus />} label="Add gateway" />
```

`svgBorder` is optional: `soft | cut | notch | ticket`. Without it, controls retain their existing markup and styling. Selective button/input CSS entries include the frame styles automatically. `SVG_CONTROL_BORDERS`, `SvgControlBorder` and `svgControlGeometry(width, height, border)` are exported for composition.

The frame measures its own SVG viewport with ResizeObserver. Contours use physical coordinates and non-scaling strokes; deformation stays in the existing control padding. Shapes remain static during resize; no animation loop or new dependency is added. The entire rectangular native control remains clickable, including cutouts. Keyboard focus thickens the existing SVG rim, gently changes the fill and adds a short shadow; no detached rectangle is drawn. Primary-button focus uses the label color so it remains visible against a filled action. Invalid fields retain their error rim. SVG buttons do not scale when pressed. Forced-colors mode retains a conventional outline as an accessibility fallback. `IconButton.round` affects the default CSS contour; when `svgBorder` is present, the SVG contour takes precedence. Attached ButtonGroup contours remain individual shapes; omit `svgBorder` for a continuous joined edge.

Fill and rim inherit the control's existing hover, pressed, disabled, loading and invalid state tokens. SVG never captures pointer events or enters the accessibility tree. These overrides are available for custom compositions: `--rk-svg-control-fill`, `--rk-svg-control-edge`.

## Custom backgrounds

Position the host relatively and give it a size. `SvgBackdrop` fills that host without entering layout or receiving pointer events. Patterns: `dots`, `stripes`, `grid`, `cross`, `hex`, `none`; `spacing` is 6–100 SVG units, `opacity` is 0–1. Stripes are real SVG pattern strokes, independent of a background gradient. Set `--rk-svg-backdrop` to a CSS gradient if needed.

```tsx
<div style={{ position: "relative", isolation: "isolate", minHeight: 300 }}>
  <SvgBackdrop pattern="stripes" spacing={20} animated>
    {({ id }) => (
      <>
        <defs>
          <linearGradient id={`${id}-ink`}>
            <stop stopColor="var(--rk-accent)" stopOpacity=".2" />
            <stop offset="1" stopColor="var(--rk-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="70%" cy="50%" r="120" fill={`url(#${id}-ink)`} />
      </>
    )}
  </SvgBackdrop>
  <SvgSurface shape="wave" edge="bottom"><Button>Open</Button></SvgSurface>
</div>
```

Use trusted React SVG elements. No raw SVG/HTML parser, remote resource loader or executable markup editor is included. The callback supplies a unique `id` prefix for custom defs and references; use it for every gradient, mask, pattern and clipPath. Provide a nested `<svg viewBox="0 0 600 400" width="100%" height="100%">` for a custom coordinate space.

## Abstract graphics and motion

`SvgArtwork.variant`: `orbits`, `ribbons`, `fold`, `lattice`, `contours`, `particles`. `motion`: `off` (default), `drift`, `orbit`. Custom children use a 240×240 coordinate space and receive their own unique `id`. Artwork and backdrops are decorative and hidden from assistive technology; put meaningful text/status in HTML.

Only wrappers transform; no JavaScript frame loop or layout measurement runs during animation. Durations derive from `--rk-dur-slow`, play state from `--rk-animation-state`. `RootikProvider defaults={{ motion: "off" }}` freezes them; `prefers-reduced-motion` disables animations. Custom SMIL/JS animations supplied by a consumer remain that consumer's responsibility.

Local surface overrides: `--rk-svg-fill`, `--rk-svg-fill-low`, `--rk-svg-edge-top`, `--rk-svg-edge`, `--rk-svg-shadow`, `--rk-svg-blur`. Background overrides: `--rk-svg-pattern-color`, `--rk-svg-backdrop`.

Stories: **SVG / Surfaces**, **Backgrounds**, **Artwork**, **Custom Background**, **Motion Off**. Design Lab demonstrates both palettes and modes, the eight shape presets, safe-area inspection, pattern contrast/spacing, six graphics and a custom ribbon background.
