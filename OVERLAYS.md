# Overlays module

QA screenshots referenced below are local artifacts in the ignored `design-lab/screenshots/` directory; they are not included in Git or npm releases.

```tsx
import { Dialog, Popover, Toaster, ConfirmHost, toast } from "rootik/overlays";
import { Button, Input } from "rootik/controls";
import "rootik/overlays/styles.css";

const surface = { shape: "bevel" as const, padding: 24 };

<Dialog open={open} onClose={close} title="Connection" surface={surface}
  footer={<Button onClick={close}>Done</Button>}>
  <Input aria-label="Gateway" svgBorder="notch" />
</Dialog>

<Popover title="Filters" surface={{ shape: "ticket", padding: 24 }}
  trigger={<Button>Filters</Button>}>
  Filter controls
</Popover>

<Toaster surface={surface} />
<ConfirmHost surface={surface} svgBorder="notch" />
```

## Ownership and compatibility

`src/overlays/` owns Dialog, Drawer, Popover, Tooltip, HoverCard, Toaster/toast, ConfirmHost/confirm/prompt, CommandPalette and ShortcutsSheet. CommandPalette is split from Dialog. Root exports and legacy component modules re-export the same implementations and singleton stores. Existing code needs no prop changes. No runtime dependency or consumer compiler plugin is added.

`rootik/overlays/styles.css` includes native floating/dialog styles, materials, controls, motion, SVG surfaces, toast and confirmation styles. Individual selective CSS entries and the aggregate stylesheet remain available. Authoring stays in Vanilla Extract.

## Material and layout

All overlay families accept optional `surface: OverlaySurfaceOptions`. The native host reserves the same normalized padding as its absolute SVG background. Shape, edge, depth, span, position, glass, opacity, shadow and contours use the existing SvgSurface geometry. The background is aria-hidden and ignores pointer events. It never wraps or replaces the content.

SVG Off produces a plain material at the same dimensions. Square corners and Fluent remove rounding; Fluent also uses the plain material. Tooltip retains its inverse fill/text pair in SVG and CSS fallback modes. Interactive light plays once when the surface opens; the shared effects/motion settings, reduced-motion media and forced colors apply. No per-frame state or new timer loop is used.

Dialog keeps native showModal, Escape, inert background and focus trapping. Closing or conditionally unmounting closes the native dialog so the platform restores its opener. Pointer dismissal still requires both press and release on the backdrop. Consumer cancel/click/pointer handlers are composed and cancellation is respected. Explicit accessible labels and descriptions are preserved. Popover supports JSX titles through aria-labelledby; CommandPalette has a named combobox.

## Notifications and native modals

Mount one Toaster and one ConfirmHost per application. Notifications use a stable React portal container. A focus/open/DOM observer moves that container inside the active native modal, because visually promoting a popover into the top layer does not exempt it from modal inertness. Moving the container keeps the same notification nodes and remaining timers; native modal focus rules still apply. It does not recreate Toast components or repeat announcements.

The portal container copies its owner's computed custom properties, typography and appearance attributes, preserving a separately themed Toaster inside a different modal. React context remains with the owner. It returns to its original location when the modal closes, and observers/media listeners are removed on unmount. Actions and errors remain persistent by default; pointer/focus pause, loading updates, swipe and close behavior are retained.

## Preview and checks

Design Lab: `/design-lab/?direction=signal-dark&screen=overlays`. Ladle: **Overlays module / Signal**. The preview covers center/edge windows, nested popovers, tooltips, rich hover cards, command filtering, shortcuts, confirm/prompt and notification states. The comparison mode is disabled here so the example mounts singleton hosts once.

DOM tests cover export identity, dialog event composition, descriptions, unchanged native inputs/selection/focus across appearance modes, disabled commands, named popovers, toast actions and stable modal portal lifecycle. Happy DOM lacks native :modal and :popover-open behavior; those primitives are modeled only in tests. Actual inertness, native dismissal, focus return and popup placement require browser validation.

Packed source/dist and Node SSR checks exercise the public entry and selective CSS without a consumer VE plugin. Real consumer applications and the Firefox/Safari/WebView/NVDA matrix remain separate gates.

Latest local gate: 146 tests (109 unit/SSR, 37 DOM), typecheck, Biome, style freshness, Lab/Ladle builds and packed source/dist/Node SSR/Tailwind checks pass. Chromium covers first focus and Escape return, nested popover dismissal, interactive notification dismissal inside a modal, command search/Enter, prompt errors and confirmation cancel focus. SVG Off changes none of the nine dialog controls' positions or dimensions. Fluent has zero SVG frames/light layers and a zero-radius panel. A light modal fits a 375px viewport without content overflow. Selected SVG chips keep the inverse fill/text pair while hovered in both themes.

Evidence: selected chips, dark (`design-lab/screenshots/chips-hover-dark-fixed.png`), selected chips, light (`design-lab/screenshots/chips-hover-light-fixed.png`), modal notification (`design-lab/screenshots/overlays-dialog-toast.png`), drawer (`design-lab/screenshots/overlays-drawer-dark.png`), mobile (`design-lab/screenshots/overlays-mobile-light.png`), SVG geometry measurements (`design-lab/screenshots/overlays-stability.json`).

Tour now lives in `src/overlays/tour.tsx` and is available through the overlays entry without changing its API.

## Guided tours

`Tour surface` accepts the shared OverlaySurfaceOptions contract and opt-in motion through its existing native Floating host. Spotlight geometry follows the target immediately; it does not tween layout coordinates or temporarily highlight unrelated controls. Closing or unmounting the guide returns focus to its connected launcher when focus was still inside the guide, without stealing focus from an unrelated control. The overlays module includes a two-target example.

Step object identity changes do not restart guide focus or scrolling; only opening and changing the index do. Arrow shortcuts leave editable fields alone. Flat overlay surfaces use an inset rim so native overflow/resize clipping cannot erase the boundary.
