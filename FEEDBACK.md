# Feedback and state

```tsx
import { Badge, Callout, DataState, Progress, ProgressRing } from "rootik/feedback";
import "rootik/feedback/styles.css";

<Progress value={64} label="Processed files" showValue decoration="segments" />;
<ProgressRing value={64} variant="segmented" aria-label="Processed files" />;
<Badge tone="success" svgBorder="cut">Ready</Badge>;
<Callout tone="warn" title="Review routing" surface={{shape: "saddle", padding: 24}}>
  Two rules use a fallback gateway.
</Callout>;
```

The module owns Badge, StatusDot, Indicator, Progress, ProgressRing, Spinner,
Skeleton, Meter/meterTone, BusyOverlay, DataState/dataStatus, Callout and EmptyState.
Root exports and legacy component paths resolve to the same implementations.
Avatar/Kbd and general Card/Stat content remain in their existing families.

## Optional SVG and motion

- Progress and Meter accept `decoration="ticks" | "segments"`. The fixed-viewBox
  SVG ornament never participates in layout; HTML retains values and semantics.
- ProgressRing adds `variant="segmented"`. Each mask has an isolated ID. SVG Off
  and Fluent use the continuous ring; the label stays mounted.
- Spinner adds `variant="orbit"`; SVG Off and Fluent use the original CSS spinner.
- Badge and BusyOverlay accept `svgBorder`. Callout and EmptyState accept the
  existing overlay `surface` geometry/material options. DataState forwards those
  options and `svgBorder` to its default empty/error/retry presentation.
- Spinner, Skeleton, Progress, StatusDot, Indicator and BusyOverlay accept
  `animation="loop" | "once" | "off"`. This controls activity animation; status,
  text and values remain visible. A new once indicator runs one iteration.
  Mount a new decorative indicator to explicitly replay a completed cycle.
- Shared MotionLayer effects remain opt-in through appearance. Determinate value
  changes play decorative light once. They do not create work, clocks or fake
  progress. Motion Off and reduced motion stop activity while retaining a visible
  static indeterminate bar. Reduced-motion and forced-color styles also suppress
  decorative animation independently of the configured appearance.

BusyOverlay preserves children while busy and marks them inert. Keep completion
and cancellation controls outside that content. DataState only invokes function
children when ready; fetching, retries and transitions remain consumer-owned.
Static Callout stays silent unless `live` is requested. Color is accompanied by
text/icons; icon-only StatusDot has its existing label requirement.

## Ranges and labels

Progress and ProgressRing draw and expose the same clamped value. Invalid maxima
fall back to 100; non-finite values fall back to zero. Ring dimensions and stroke
width stay finite. Meter clamps section amounts to the remaining span, ignoring
negative/non-finite amounts. Section amounts start at `min`; with min=10, max=110
and one section of 20, the value is 30 and the bar occupies 20% of the span.

Explicit meter labels now reach the `role="meter"` element. React labels for
Progress/Meter use generated `aria-labelledby` references.

## Related visual repairs

CommandPalette's search field now has a toolkit class and one focus underline on
the complete search row. Laboratory raw-input styles no longer draw a second
rectangle. Filtering, Enter execution, disabled commands and return focus remain.

SVG surface blur is a child of the clipped glass layer, so backdrop filtering
cannot paint a rectangular patch across a cutout. Dark surface rims keep a
visible bottom edge. Vertical pill tabs have a separate selection contour,
34 px default rows and 6 px separation; inactive rows no longer have repeated
outlines inside an outer frame. The navigation example uses a soft selection.

## Validation

The Feedback Module story and Design Lab `?direction=signal-dark&screen=feedback`
exercise manual progress, thresholds/sections, all tones, once/off activity,
preserved busy content, retry/empty/ready states and message actions. They use
public production components and generated selective CSS.

Unit/DOM coverage checks module identity, bounded accessible values, isolated SVG
masks, preserved controls/inert content, deferred data content and caller-owned
retry. Additional regressions cover command search semantics, clipped blur
composition and vertical keyboard tabs. Browser checks cover activity repetition,
Motion Off, dark/light, SVG/Fluent fallbacks, mobile width and the reported visual
repairs. Packed source/dist, Node SSR and selective Tailwind fixtures exercise
the public module without a consumer Vanilla Extract plugin.

The local run passes 160 tests (109 unit/SSR and 51 DOM), Design Lab/Ladle builds
and packed source/dist/SSR/Tailwind checks. The root keeps 271 runtime exports;
there are 99 selective CSS entries. In Chromium, 17 visible feedback elements
change by less than 0.001 px across SVG Off. Page width equals viewport width at
365 px and 1,299 px. The hex backdrop remains visible through the saddle cutout
at 100% material density. Screenshots and geometry are in `design-lab/screenshots`.

Real consumer applications, Firefox/Safari/WebView, NVDA and GPU profiling remain
separate validation gates.
