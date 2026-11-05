# Forms module

QA screenshots referenced below are local artifacts in the ignored `design-lab/screenshots/` directory; they are not included in Git or npm releases.

```tsx
import { Field, Fieldset, Form, SchemaForm } from "rootik/forms";
import { Button, Input } from "rootik/controls";
import "rootik/forms/styles.css";

<Form onSubmit={data => save(data)}>
  <Fieldset legend="Workspace" surface={{ shape: "bevel", padding: 24 }}>
    <Field label="Name" hint="At least three characters" required>
      <Input name="name" required minLength={3} svgBorder="notch" />
    </Field>
  </Fieldset>
  <Button type="submit" svgBorder="cut">Save</Button>
  <Button type="reset" variant="secondary">Reset</Button>
</Form>

<SchemaForm schema={schema} onSubmit={saveProfile}
  surface={{ shape: "ticket", padding: 24 }} svgBorder="notch"
  actions={<Button type="submit">Save profile</Button>} />
```

## Ownership and compatibility

`src/forms/` owns Field, Form, Fieldset, SettingsGroup, SettingsRow, SchemaForm, useFormError, useField/useFieldLabel, defaultSchemaValues and validateSchema. Root exports and old `src/components/*` modules resolve to the same implementations. Controls consume the shared field context independently of the form renderer. No runtime dependency or consumer compiler plugin is added.

`rootik/forms/styles.css` includes the generated dependency closure for fields, controls, settings, schema rows, native fieldsets, SVG surfaces and motion. Existing individual CSS entries remain valid. Styles are authored in `styles/*.css.ts`.

## Geometry and motion

`Fieldset`, `SettingsGroup` and `SchemaForm` accept optional `surface` options: shape, edge, depth, span, position, padding, glass, opacity, shadow and contours. SettingsGroup and SchemaForm apply them to card sections; plain sections retain their divided layout. Defaults remain compatible when no surface is passed.

Fieldset keeps its native element and first-child legend. Its decorative surface is absolute, aria-hidden and ignores pointer events. The same normalized padding reserves content space and limits the SVG geometry. Switching SVG off, choosing square corners or Fluent never replaces the form controls. Values, focus, selection, labels and errors stay attached to the same native nodes. Effects are optional and share `/motion`: one-shot interactive light, explicit ambient repetition, Motion Off, system reduced motion and forced-color fallbacks.

SchemaForm's optional `svgBorder` reaches text, textarea, numeric, select, segmented and chip controls. Custom renderers receive it through SchemaControlProps and can pass it to their own supported controls.

## Validation and reset

Form uses native constraints and optional `validate(FormData)` messages. Submit focuses the first invalid control. Field associates its visible label, hint/error and required state with the control. Form composes consumer `onInput` and `onReset`; canceled handlers are respected. Reset clears displayed errors and custom validity before the browser restores native defaults. Controlled values remain the consumer's responsibility. Controls barred from native validation, including disabled sections, are skipped.

SchemaForm retains existing touched/submit validation, conditional children, disabled controls, translated messages, external errors and default-value reset. It embeds as a div unless onSubmit is supplied, avoiding nested forms. Its reset action restores schema/defaultValues; external error ownership remains with the consumer. Blur validation waits when focus enters the same form's submit/reset button, so inserting an error cannot move the action between pointer down and click. Focus changes inside one composite field do not mark it touched.

## Preview and validation

Design Lab: `/design-lab/?direction=signal-dark&screen=forms`. Ladle: **Forms module / Signal**. Both use the public module, ordinary toolkit styles and optional local fonts. The example includes a native workspace form, a disabled fieldset, nested settings, a destructive action and a schema profile with reset.

DOM checks cover compatibility identities, custom validation, first-error focus, canceled reset, consumer handlers, full reset, section padding and native-node/focus preservation across SVG, corners, effects, motion and Fluent changes. Browser checks cover real inherited fieldset disabling, which Happy DOM does not implement. Packed source/dist and Node SSR checks exercise the forms entry and generated selective CSS without a VE plugin.

Consumer application migration and the WebView/Firefox/Safari/NVDA matrix remain separate checks.

Latest local gate: 141 tests (109 unit/SSR and 32 DOM), typecheck, Biome, style freshness, Design Lab/Ladle builds and packed source/dist/SSR/Tailwind consumers pass. Chromium verifies native invalid/valid submit, reset, first-click schema submit, schema reset, inherited fieldset disabling, Fluent and Motion Off. SVG Off changes none of the 35 native controls' measured positions or dimensions. The 365px viewport has no document or form-control overflow.

Evidence: dark (`design-lab/screenshots/forms-dark.png`), light (`design-lab/screenshots/forms-light.png`), mobile (`design-lab/screenshots/forms-mobile.png`).
