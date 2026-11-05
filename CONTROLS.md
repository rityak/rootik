# Controls module

QA screenshots referenced below are local artifacts in the ignored `design-lab/screenshots/` directory; they are not included in Git or npm releases.

```tsx
import { Button, Input, NativeSelect } from "rootik/controls";
import { RootikProvider } from "rootik/theme";
import "rootik/controls/styles.css";

export function Controls() {
  return (
    <RootikProvider theme="cobalt" defaults={{ colorMode: "light" }}>
      <Input aria-label="Gateway" svgBorder="notch" defaultValue="north" />
      <NativeSelect aria-label="Region" svgBorder="ticket"
        options={[{ value: "north", label: "North" }]} />
      <Button variant="primary" svgBorder="cut">Save</Button>
    </RootikProvider>
  );
}
```

## Ownership and compatibility

`src/controls/` owns Button, IconButton, ButtonGroup, ConfirmButton, SplitButton, PowerButton, Input, SearchInput, PasswordInput, Textarea, InputGroup, InputAddon, NumberInput, PinInput, Select, NativeSelect, Combobox, TokenField, Checkbox, Switch, RadioGroup, ChoiceCards, CheckboxCards, ChipGroup, CheckboxGroup, ColorSwatches, Slider, RangeSlider, DateRange and ColorPicker. Existing types and parsing/color helpers remain available. SegmentedControl is re-exported for compatibility; its implementation belongs to navigation.

The old `src/components/` files re-export the same implementations. Root imports and existing props retain identity. Field remains a form component (`components/field.tsx`), with shared wiring hooks in `lib/field-context.tsx`; the legacy `components/input` export remains valid. No runtime dependencies are added. Styles are authored in Vanilla Extract and shipped as extracted CSS; consumers need no compiler plugin.

## Optional SVG

`svgBorder="soft" | "cut" | "notch" | "ticket"` decorates Button/IconButton/ConfirmButton/SplitButton, Input/SearchInput/PasswordInput/NumberInput, Textarea, Select/NativeSelect/Combobox, TokenField, DateRange, ChoiceCards/CheckboxCards and ChipGroup. Native checkbox/switch/radio/slider/pin controls keep compact CSS boundaries; their state is more legible without notches. ButtonGroup keeps joined CSS edges; individual shaped actions are demonstrated separately.

The frame is absolute, ignores pointer events and is hidden from assistive technology. Native elements own input, selection, refs, form data, keyboard behavior and focus. Geometry remains within the existing padding; compact contours reduce depth. Focus thickens the same path within a reserved 1.5px stroke margin, with an inward forced-colors outline fallback. CSS focus outlines also stay inside the host (2px wide, -2px offset), including wrapper-owned input focus, so scroll containers need no extra focus padding. There is no positional animation.

SVG can be disabled through RootikProvider/Scope `svgShapes: false`; Fluent disables it automatically. Switching appearance preserves native nodes, values, selection and focus. Zero radius and square corners remain independent of the SVG switch. Textarea reserves a wrapper when its `svgBorder` prop is supplied, even while SVG is globally off; its `ref`, `style`, `className`, rows and resize behavior still target the native textarea. NativeSelect's existing wrapper owns the decorative frame while the select keeps its native picker.

Signal uses palette-aware danger/warn text in light and dark modes. Selected/hover SVG fills and label colors update together, avoiding contrast flashes. PowerButton, swatches and slider thumbs retain fixed geometry in Signal. SplitButton disables both actions while loading. Bare Checkbox/Switch preserve consumer className. PIN groups shrink within their available width instead of entering a panel's padding at large size.

## Preview and validation

PowerButton also supports `variant="signal" | "reactor"` for VPN-style status dials. The common `/motion` settings add optional SVG light to actions and shaped inputs. The Controls preview includes a cancellable connection simulation and the same motion settings used by Layout and Navigation. See [MOTION.md](MOTION.md).

Selected SVG chips keep their inverse material on hover; hover fill only applies to unselected chips and choice cards. This keeps the selected label and its background in the same contrast pair.

Design Lab: `/design-lab/?direction=signal-light&screen=controls`. Ladle: **Controls module / Signal**. The screen exercises actions, loading, native validation, errors, disabled/read-only states, custom/native selects, search, tags, number bounds, PIN, radio/checkbox choices, sliders, date ranges and the OKLCH color picker. Settings compare six palettes, both modes, four contours, three sizes, Fluent, SVG, corners and motion.

Tests cover appearance switching without native-node replacement, field labels/errors, native form values, selection/caret/focus preservation, Select keyboard behavior, NumberInput bounds, className and loading contracts. Packed source/dist/Node SSR fixtures verify public identity and CSS dependency closure. Real application migration and the complete screen-reader/browser matrix remain separate gates.

`bun run check` passes 133 tests (108 unit/SSR and 25 DOM), TypeScript, Biome and style freshness. `bun run check:pilot`, the standalone Lab build and Ladle build pass. Node SSR verifies all controls exports against root exports; the root retains 268 exports.

Chromium checks cover Select disabled-option skipping and focus return, search clearing, combobox filtering, tag entry, NumberInput bounds, native form submission, confirmation, slider/range bounds, custom dates, Fluent and motion off. SVG/CSS comparison across 43 control boxes recorded zero size or position changes. At 365px width, large PIN cells fit the protected content box and the document has no horizontal overflow. Lists use a denser glass material so underlying text does not compete with options.

Evidence: light SVG (`design-lab/screenshots/controls-svg-light.png`), dark Makima (`design-lab/screenshots/controls-svg-dark.png`), Fluent (`design-lab/screenshots/controls-fluent-light.png`), mobile (`design-lab/screenshots/controls-mobile.png`), geometry measurements (`design-lab/screenshots/controls-stability.json`).
