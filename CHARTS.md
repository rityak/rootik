# Charts module

```tsx
import { ChartPanel, LineChart } from "rootik/charts";
import "rootik/charts/styles.css";

<ChartPanel
  title="Network traffic"
  description="Mbit/s, last 24 hours"
  shape="saddle"
  padding={24}
  animation="once"
  revision={queryRevision}
>
  <LineChart
    aria-label="Traffic over time"
    labels={["00:00", "06:00", "12:00", "18:00"]}
    series={[{ name: "Inbound", data: [24, 32, null, 64] }]}
    tableView
    brush
  />
</ChartPanel>
```

The module contains Sparkline, BarChart, Histogram/bin, LineChart, Gauge, StackedBarChart, DonutChart, WaffleChart, Treemap, BulletChart, ScatterChart, Heatmap, Tracker, BarsList and the shared Legend/formatting helpers. Existing root and `components/*` exports re-export the same implementations. No runtime dependency was added.

## Composition and appearance

`ChartPanel` supplies the caption, optional description, summary and actions around any chart. It accepts the existing SvgSurface geometry/material props: shape, edge, depth, position, span, padding, radius, opacity, shadow, glass, contours and background. It never owns chart values, queries, range selection or table state.

The surface deforms only inside padding. SVG Off and Fluent use the existing flat surface fallback; square corners apply independently. Plot SVG is data, not decoration: it remains present when decorative SVG is disabled. Caption, controls and plot coordinates keep their geometry when these settings change.

Named themes use six stable categorical slots, identical in meaning across theme changes. Light and dark modes have separate mark lightness and label ink. Categories do not inherit a theme's action color: a red theme must not silently change the identity of a series. Prefer legends and exact values; color alone is not a series name.

Heatmap uses one sequential blue ramp in both modes. Its text changes between near-white and near-black at the ramp midpoint, independently of the page text colors. Null, missing and non-finite cells share the explicit translated no-data state. Treemap uses `--rk-chart-on-fill` instead of canvas color for labels. Custom chart colors/ramps remain the consumer's contrast responsibility.

## Motion

`ChartPanel.animation` is `off` by default. `once` draws the line on entry and adds one SVG light pass; no looping timer or React frame updates. Changing `revision` replays only the decorative light, preserving mounted chart children, table state and native focus. Values, axes and hit targets are never translated or scaled.

Effects Off, Motion Off, SVG Off and Fluent disable this decoration. Reduced motion and forced colors disable the line animation in CSS; the shared light layer respects their existing fallbacks. Data and text remain visible in static states. Existing gauge color transitions use shared duration tokens. Tracker hover uses an inset edge instead of enlarging bars. Gauge has no permanent glow.

## Reading and interaction

- Set meaningful chart names and series/category labels. A Sparkline is decorative; pair it with a textual value/trend.
- Enable `tableView` on supported plots for exact values. Switching views reconnects the shared size observer to the mounted plot, including after a container resize.
- LineChart keeps null gaps and optional brush selection; an all-null series has no area polygon.
- Heatmap supports arrows and Home/End, tooltips, exact table values and no-data cells. Tracker keeps one tab stop after history shrinks.
- Gauge exposes the same clamped finite value/domain as it draws, names React labels through `aria-labelledby`, and bounds segment counts and dimensions.
- BarsList uses native buttons when `onItemClick` is provided. Its default Other label comes from `useLabels()`.

## Validation

The chart palette regression measures all six slots against canvas, surfaces and wells for every named theme/mode: at least 3:1 for marks and 4.5:1 for text on fills. It also checks label contrast along the heatmap ramp and the existing dark mark lightness band of 0.48–0.67.

Focused regressions cover compatibility identities, bounded tick generation, thin bar geometry, gauge semantics, retained native/table state, conditional observer reconnection, missing heatmap values and tracker keyboard recovery. Build/packed checks import the public module and its selective CSS in dist/source, Node SSR and Tailwind fixtures. The old `rootik/css/charts.css` entry now contains the complete chart group dependency closure.

The production story and Design Lab `screen=charts` cover every chart family with theme, material, SVG, radius and motion controls. Real consumer applications, other browser engines, assistive technologies and GPU profiling remain separate release gates.

Local Chromium verification covered chart/table round trips after resize, brush keyboard selection, heatmap/tracker arrow navigation and a native BarsList action. SVG Off retained all plots: 17 measured boxes changed by at most 0.00021 px. Fluent removed decorative frames/light and set radius to zero. Both animation Off and global Motion Off produced no line animation or panel light. Light Maomao at 365 CSS px had equal document/client widths and no invalid SVG path coordinates. Screenshots and measurement evidence are under `design-lab/screenshots/charts-*`.
