# Motion and SVG light

QA screenshots referenced below are local artifacts in the ignored `design-lab/screenshots/` directory; they are not included in Git or npm releases.

`rootik/motion` exports `MotionLayer`, `startThemeTransition`, `cancelThemeTransition` and their types. Import `rootik/motion/styles.css` for custom uses. Layout/navigation/controls selective styles include the dependency automatically. Authoring is Vanilla Extract; there are no new runtime dependencies.

## Appearance

```tsx
<RootikProvider defaults={{
  effects: "subtle",       // off (default), subtle, expressive
  effectStyle: "sheen",    // sheen, ripple, flow
  themeTransition: "iris", // fade, wipe, iris
  motion: "system",
}}>
  <App />
</RootikProvider>
```

The same fields are exposed by AppearanceSettings and can be overridden with Scope. Production defaults remain off; the three module laboratories initially enable subtle effects for comparison. SVG Off and Fluent remove the decorative light layers. Motion Off removes them and pauses the existing status/artwork animations. System reduced motion always hides the new decoration and bypasses theme transitions, including when Motion is Full. Forced colors hide light decoration too. Square corners remain supported.

## Reusable layer

```tsx
<div style={{ position: "relative", isolation: "isolate", borderRadius: "var(--rk-radius-lg)" }}>
  <MotionLayer effect="flow" active loop />
  Custom content
</div>
```

The layer is absolute, clipped, aria-hidden and ignores pointer events. The host must provide a positioning context; its content remains ordinary HTML. `clipPath` optionally accepts the host's padding-safe SVG path in pixel coordinates. Existing measured control frames and SvgSurface supply that path automatically. The SVG gradients stay static; a wrapper animates transform and opacity. No per-frame React state, layout dimensions, animated blur or host translation is used.

Interactive layers play once on hover, keyboard focus or selection. Pressing changes the decorative animation without moving the host. Repeated ambient light requires `loop` explicitly. SvgBackdrop only mounts ambient light when its existing `animated` prop is true. A Scope with `effects: "off"` disables a local group. Native checkboxes, radio inputs and sliders keep their own semantics; switch activation gets a token-timed material flash.

Coverage includes SVG/native action buttons, shaped fields, selects, tags, choice cards, tabs, sidebar items, segments, dock, surfaces and backdrops. Plain NativeSelect retains its OS picker and simple decoration. All future modules must follow the rule in AGENTS.md rather than creating independent animation engines.

## Theme changes

RootikProvider's appearance setters animate palette and colorMode changes when effects are enabled. Controlled theme state and Scope state should wrap their event-driven update explicitly:

```tsx
startThemeTransition(() => setPalette("maomao"), {
  effects: "subtle", motion: "system", themeTransition: "wipe",
});
```

Only decorative backgrounds (`SvgBackdrop` or a background-only element marked `data-rk-motion-canvas`) receive snapshot names. The document root and native controls remain live: text and control colors update atomically, while fade/wipe/iris animate the background artwork. This prevents both low-contrast text interpolation and temporary input blocking. The snapshot overlay ignores pointer events. Avoid putting interactive content inside a custom motion canvas.

The helper is for event handlers, not render/effect callbacks. Missing browser support, missing decorative canvases, reduced motion or a compositor startup failure commits the update directly. SVG Off and Fluent use fade. Existing transitions are skipped before a new one starts; temporary names and attributes are restored without overwriting later consumer writes. Application callback errors are not retried. The returned ViewTransition remains available to callers for its completion promises.

The implementation follows the [browser View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) and uses [React's flushSync integration API](https://react.dev/reference/react-dom/flushSync) only at this browser snapshot boundary.

`cancelThemeTransition()` stops the visual transition and restores temporary styles; it never reverts application state. AppearanceSettings invokes it when motion/effects are disabled. Controlled consumers can do the same when changing their own settings. Forced colors bypass theme transitions as well as light layers.

## VPN power button

```tsx
<PowerButton label="VPN connection" variant="signal" size="lg"
  on={connected} pending={connecting}
  onChange={requestConnectionChange} />
```

`variant="orb"` preserves the existing design. `signal` adds concentric status tracks; `reactor` moves a status segment along a fixed angular contour, with matching inset ticks. Both support all existing sizes, disabled, custom icon, tone, controlled/uncontrolled on state and pending. The accessible name stays stable; aria-pressed and aria-busy report state. Clicking remains available during pending so an application can cancel the request. The component never starts a connection or infers success. Its static dial survives Effects Off, while SVG Off and Fluent use the CSS button. Motion Off pauses the pending indicator; Effects Off only removes decorative light. Focus remains visible in every mode.

Design Lab `/design-lab/?direction=signal-light&screen=controls` includes a cancellable connection simulation. The same animation settings are present in Layout and Navigation. Ladle **Motion / Light effects** compares three effects; **Motion / VPN variants** shows both dials in disconnected, pending, connected and disabled states.

## Validation

`bun run check`: 138 tests (109 unit/SSR, 29 DOM), TypeScript, Biome and style freshness pass. Tests cover opt-in settings, motion/Fluent fallbacks, SVG ID isolation, native-node/focus/status preservation, matching Reactor contours, full color-area raster coverage, one-shot theme commits, cancellation and compositor startup failure. Packed source/dist, Node SSR and selective Tailwind fixtures pass without a consumer compiler plugin; Lab and Ladle production builds pass.

Chromium checks cover the three module settings, active ripple tabs, native wipe/iris transitions, interactive VPN actions during a background transition, pending cancellation, Motion Off and Fluent. Effects switching across 91 native controls records zero width, height or position change. Mobile widths of 331px and 365px have no document overflow. Full OS reduced-motion emulation, WebView/Firefox/Safari visual review and GPU profiling remain unrun; the media rules and reduced-motion API fallback are covered statically and in DOM tests.

Evidence: Signal (`design-lab/screenshots/motion-vpn-signal.png`), Reactor (`design-lab/screenshots/motion-vpn-reactor.png`), pending (`design-lab/screenshots/motion-vpn-pending.png`), mobile (`design-lab/screenshots/motion-vpn-mobile.png`), geometry measurements (`design-lab/screenshots/motion-stability.json`).
