# Navigation module

QA screenshots referenced below are local artifacts in the ignored `design-lab/screenshots/` directory; they are not included in Git or npm releases.

```tsx
import { useId, useState } from "react";
import { Tabs, TabPanel, SegmentedControl } from "rootik/navigation";
import { RootikProvider } from "rootik/theme";
import "rootik/navigation/styles.css";

export function Workspace() {
  const id = useId();
  const [tab, setTab] = useState("projects");
  return (
    <RootikProvider theme="cobalt" defaults={{ colorMode: "light" }}>
      <Tabs idPrefix={id} aria-label="Workspace" variant="pill" svgBorder="cut"
        value={tab} onChange={setTab}
        items={[{ value: "projects", label: "Projects" }, { value: "history", label: "History" }]} />
      <TabPanel idPrefix={id} value={tab}>{tab}</TabPanel>
      <SegmentedControl aria-label="View" svgBorder="notch"
        options={[{ value: "cards", label: "Cards" }, { value: "rows", label: "Rows" }]} />
    </RootikProvider>
  );
}
```

## Components and ownership

`rootik/navigation` exports Tabs, TabPanel, TopNav, TableOfContents, Sidebar, NavGroup, NavItem, Dock, DockSeparator, Breadcrumbs, Pagination, SegmentedControl, Menu, ContextMenu, MenuItem, MenuSub, MenuCheckboxItem, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuLabel, Menubar and MenubarMenu, with their existing types. Advanced menu containers retain MenuContext/onMenuKeyDown compatibility.

Routing remains consumer-owned. Sidebar, Dock, TopNav and Breadcrumbs report a route or action; Tabs select local content; SegmentedControl uses native radios. TopNav and enabled NavItem links preserve normal modified-click behavior. A disabled NavItem link has no URL and cannot navigate.

Sources are split into `src/navigation/` by responsibility. Existing root imports and `components/nav`, `components/menu`, `components/menubar` and `components/choice` paths re-export the same functions. Popover remains an overlay primitive in `components/popover.tsx`; its old import remains valid. Sidebar and dock read a lightweight shell context without importing AppShell. Navigation's selective CSS is asserted not to include AppShell styles.

## SVG contours and stability

NavItem, pill Tabs and SegmentedControl accept `svgBorder="soft" | "cut" | "notch" | "ticket"`. Line Tabs keep their underline. SVG controls use the existing measured control geometry and static decorative frames; the content and hit target stay native HTML. The SVG frame is absolute, hidden from assistive technology and ignores pointer events. It does not change the control's width or height. Compact frames limit notch depth as their height decreases.

Selected SVG contours replace the sliding indicator for that group, avoiding a rectangular fill outside a shaped boundary. Focus thickens the same rim; no scale or translation is added. Forced colors retain an inset outline. RootikProvider/Scope `svgShapes: false` and Fluent remove SVG frames and restore native CSS decoration without remounting controls. `corners: "square"` and radius 0 remove SVG corner rounding; inset edge features are independently switchable.

Dock keeps its capsule body and selected pill. AppShell `dockShape="surface"` optionally wraps it in the shell's SVG surface; `dockShape="capsule"` omits that extra shell. Materials, six palettes, light/dark modes, motion off and global geometry settings use the existing appearance schema. Authoring is Vanilla Extract and shipped CSS; no consumer plugin or runtime dependency is added.

## Keyboard and preview

Tabs use one enabled tab stop, arrow keys, Home/End and tab/panel ARIA links. Vertical tabs use Up/Down. Dock tab mode restores focus if its focused item is removed. SegmentedControl defaults to the first enabled native radio. Menu and Menubar retain native popovers, typeahead, submenu navigation, Escape and focus return; checkbox menu items may stay open.

Design Lab: `/design-lab/?direction=signal-light&screen=navigation`. Ladle: **Navigation module / Signal**. The example includes shared routing, horizontal/vertical tabs, native segments, breadcrumbs, pagination, context/submenus, menubar, sidebar and a capsule dock. Its controls compare palettes, modes, Fluent, SVG, zero radius and motion off.

Remaining controls/forms/overlays/data groups retain their current implementations until their migration stage. Real consumer applications and the full screen-reader/browser matrix remain separate validation gates.

## Validation evidence

`bun run check` passes 108 unit/SSR and 23 DOM tests. Packed source/dist, Node SSR and Tailwind consumer fixtures pass without a Vanilla Extract plugin; both Lab and Ladle production builds pass. Existing root exports retain identity with the new module.

Chromium verification covers horizontal/vertical tab keys, native radio navigation, pagination, sidebar/dock routing, menus/submenus, checkbox menus, menubar and Escape focus return. At 365px document width, the drawer and open menu fit without horizontal document overflow. Fluent removes SVG frames and rounding; SVG, zero radius and motion settings remain independently testable in Rootik.

For 15 native controls, switching SVG off produced zero width, height or horizontal-position change; the largest vertical difference was below 0.001px. Selection and native DOM identity are also covered by regression tests. See geometry measurements (`design-lab/screenshots/navigation-stability.json`), light SVG (`design-lab/screenshots/navigation-svg-light.png`), dark SVG (`design-lab/screenshots/navigation-svg-dark.png`) and Fluent (`design-lab/screenshots/navigation-fluent-light.png`).

Stepper now lives in `src/navigation/stepper.tsx` and is available through the navigation entry without changing its API.

## Stepper contours

`Stepper svgBorder` uses the same soft/cut/notch/ticket frame and motion gates as controls. Marker geometry does not change the step label or connector layout. Semantic state colors and textual state descriptions remain available with SVG disabled. The current clickable step retains its native button, so selecting a step does not discard keyboard focus; selecting the already-current step does not invoke onStepClick again. See the navigation module story for the three-step setup example.
