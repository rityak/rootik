# Layout module

```tsx
import { AppShell, PageHeader, ShellMenuButton, SvgBackdrop, TitleBar } from "rootik/layout";
import { RootikProvider } from "rootik/theme";
import { Dock, NavItem, Sidebar } from "rootik";
import "rootik/layout/styles.css";
import "rootik/css/nav.css";

export function App() {
  return (
    <RootikProvider theme="maomao" defaults={{ colorMode: "light", font: "system" }}>
      <AppShell
        variant="islands"
        surface={{ shape: "bevel", padding: 20, depth: 0.7 }}
        backdrop={<SvgBackdrop pattern="dots" opacity={0.12} />}
        sidebar={<Sidebar><NavItem label="Overview" active /></Sidebar>}
        header={<TitleBar start={<><ShellMenuButton /><span>Workspace</span></>} />}
        dock={<Dock items={[{ value: "overview", label: "Overview", icon: "01" }]} value="overview" />}
      >
        <PageHeader title="Overview" description="The frame stays still; content scrolls." />
      </AppShell>
    </RootikProvider>
  );
}
```

## Two frames

- `variant="islands"`: separate sidebar, header, inspector and footer float over the canvas. Optional `surface` applies padding-safe SVG contours to these parts and the floating dock. `headerShape="none"` leaves a bare header.
- `variant="inset"`: one continuous content/inspector region. In Signal palettes, the outer padding and perimeter radius are zero, so the frame touches its host's edges. Use `dockPlacement="bar"` for a bottom taskbar. Legacy palettes retain their existing inset spacing.

Omit `variant` and `dockPlacement` to use the existing `layout` and `dock` appearance settings. An AppShell fills its containing height (100dvh by default); use a bounded height for embedded examples. A floating dock reserves measured space under content. `aside` accepts a ResizablePanel. Below `compactBelow` (720px), the sidebar becomes a rail and the inspector moves below content. Below `drawerBelow` (520px), ShellMenuButton opens the sidebar in a native drawer; navigating closes it.

`dockShape="capsule"` keeps the floating Dock's rounded body and selected pill without wrapping it in an SVG panel. Other shell parts keep their selected contours. `dockShape="surface"` follows the shell's `surface` settings (default). Omit the prop to use the `dockShape` appearance setting, also exposed in AppearanceSettings. Global square corners, zero radius and Fluent still take precedence; taskbar placement retains its edge-aligned shape.

AppShell places the application frame using flex. Content owns its CSS Grid or flex layout; a public Grid/Stack primitive is not shipped yet. In the Layout example, cards share one content grid and their outer edges align with the header, without an extra horizontal page gutter. SVG keeps its protected padding inside each grid item. The content region scrolls independently below the fixed header.

## Appearance and fallback

These values use the existing RootikProvider, Scope and AppearanceSettings contracts, including storage, controlled values and nested scopes:

| Value | Effect |
| --- | --- |
| `palette` / `theme` | `cobalt`, `albedo`, `makima`, `miyabi`, `hoshino`, `maomao`; distinct surface and secondary/detail colors |
| `colorMode` | `light` or `dark`; nearly neutral page canvas |
| `svgShapes: false` | Ordinary CSS panels and native control boundaries; no notches, same content padding |
| `corners: "square"` or `radius: 0` | Zero corner radius, including SVG corners, icon buttons and pills |
| `style: "fluent"` | Square, solid Fluent substyle; no SVG contours or glass; accent selection markers |
| `theme="fluent"` | Also defaults to inset, flush spacing, taskbar dock and System fonts; independent of palette choice |

SVG contours and rounding are independent: square corners may keep edge features, while contours off may keep ordinary rounded corners. Fluent overrides both while selected; switching the substyle back restores the stored choices. Artwork/background patterns remain separate decorations. Existing native focus, forced-colors and reduced-motion behavior remains in effect.

`font` accepts `system`, `rubik`, `onest` and the legacy choices. `monoFont` is independent (`system`, `jetbrains`, `geist`); `displayFont` is `ui` or `literata`. System requires no download. For bundled Rubik, Onest, JetBrains Mono and Literata, import `rootik/fonts.css` once. WOFF2 files contain Latin/Cyrillic subsets, normal and available italic faces, with OFL licenses; other scripts use fallbacks.

## Composition

`rootik/layout` exports AppShell, ShellMenuButton, TitleBar, Toolbar, Spacer, ActionBar, StatusBar, PageHeader, PageBody, ResizablePanel, MasterDetail, Disclosure, SvgSurface, SvgBackdrop and SvgArtwork. ResizablePanel supports pointer drag and arrow keys (12px; Shift: 48px). MasterDetail switches between side-by-side and list/detail navigation at its own width threshold. Toolbar manages arrow-key focus between controls; fields retain their own arrow behavior.

Sidebar, Dock and navigation primitives are available from `rootik/navigation` with `rootik/navigation/styles.css`; existing imports remain compatible. Root imports and old source paths re-export the same layout functions. Authoring remains in Vanilla Extract; generated CSS retains its legacy component paths as a compatibility bridge. Consumers need no Vanilla Extract plugin or extra runtime dependency. See [navigation](NAVIGATION.md).

Preview: Design Lab `screen=layout` or Ladle **Layout module / Signal**. The Modules tab shows the remaining composition primitives. Other toolkit groups retain their existing implementations; light palettes do not imply a completed visual audit of charts or every legacy component.

FloatingWindow and Splitter source implementations now live in `src/layout/`; their legacy/root identities are unchanged.

## Floating panels and splitter grips

FloatingWindow accepts the shared `surface` options used by dialogs and cards. SVG material, safe padding and opt-in motion stay behind the native manual popover; header dragging, arrow-key movement and native corner resizing remain on the same host. SVG Off and Fluent preserve its size, position and fields. Pointer cancellation ends dragging, and the caller's root key handler can prevent Escape closing.

`Splitter grip` reserves a wider handle (`--rk-space * 3`) with a decorative SVG grip. This hit area remains identical when SVG or motion is off and in Fluent. The separator retains its existing percentage, storage and keyboard contracts; lost pointer capture clears dragging. Focus has a visible outline independent of the decorative grip.

Design Lab `screen=layout` includes the floating inspector and a two-pane splitter.

## Overflow containment

Layout slots use zero automatic minima so nested flex/grid content can shrink. The floating dock is bounded by its workspace; its track scrolls when actions do not fit. Dialog headers and footers keep their height while the body scrolls. Long labels wrap; compact button labels truncate while retaining their accessible text. Code, tables and deeply nested JSON scroll locally instead of widening the page.

Floating layers cap their dimensions to the visible viewport before measuring placement. Matching an anchor width cannot exceed that cap. Visual viewport resize/scroll events cover zoom and on-screen keyboards; floating windows also clamp their initial position and native resize. Inline schema fields and key/value grids can shrink below their usual preferred widths. The layout preview responds to its content column, including side-by-side comparisons, rather than only the browser width.

These defaults do not override explicit consumer inline sizes or make arbitrary child layouts responsive. Keep `min-width: 0` on custom flex/grid slots, reserve room for fixed actions, and use a local scroll container for intrinsically wide content.
