# 2.0 preparation: migration notes

The package version remains 0.6.1 on `dev`. This branch prepares 2.0; it is not a stable 2.0 release.

## Styling and imports

Keep `import "rootik/styles.css"` and your existing component imports. Vanilla Extract is a build-time
authoring dependency of the toolkit only. Consumers need no new plugin, runtime dependency or provider.
Public `rk-*` classes, `--rk-*` tokens and data selectors remain available. Source resolution also uses
pre-extracted CSS. Toolkit contributors need Node.js 24 and edit `styles/*.css.ts`.

Selective imports such as `rootik/css/select.css` now include core styles and component dependencies.
All entries use the same named layer; mixing selective and aggregate imports is unnecessary. With Tailwind:

```css
@layer theme, base, rootik, components, utilities;
@import "tailwindcss";
@import "rootik/css/select.css";
@import "rootik/tailwind.css";
```

Utilities and later layers override Rootik. Unlayered consumer rules also take precedence. Selective
imports previously emitted unlayered component rules: applications relying on that priority should
declare their override layer explicitly.

## Strict columns are opt-in

`Column<T>` remains compatible. Use `defineColumns<T>()` to reject misspelled accessor keys and require
a renderer for computed or object-valued columns:

```tsx
import { DataTable, defineColumns } from "rootik";

type Row = { id: string; name: string; metadata: { region: string } };
const columns = defineColumns<Row>()([
  { key: "name", header: "Name" },
  { key: "region", header: "Region", cell: (row) => row.metadata.region },
]);
<DataTable rows={rows} columns={columns} rowKey={(row) => row.id} />;
```

Legacy object-valued cells without a formatter now render empty instead of crashing React. `rowProps`
handlers run before built-in behavior; call `event.preventDefault()` to cancel selection or activation.
Interactive descendants retain their own behavior.

## Custom Combobox values are strings

Finite enums remain supported with `allowCustom={false}` (the default). When `allowCustom` is true,
the callback receives `string`, because arbitrary input cannot satisfy a finite enum:

```tsx
<Combobox allowCustom value={value} onChange={(next: string | null) => setValue(next)} options={options} />
```

Async load failures have a distinct state and optional `onLoadError` / `errorText`. A changed selected
option label appears without reselecting the value.

## Appearance values and storage

Known built-in fields have explicit types; registered extension keys remain open for compatibility.
Schema normalization rejects invalid types/enums, clamps ranges and falls back on non-finite numbers.
Color fields accept hex, RGB and OKLCH, normalized to OKLCH. Replace named colors or HSL with one of
these formats. `var()`, `color-mix()` and other expressions belong in trusted consumer CSS or an
extension `type: "text"` with an explicit `apply` handler, rather than a portable color field.

Flat storage keys are unchanged. Preferences are read after the initial matching SSR render, before
paint. Use one global `RootikProvider` and nested `Scope` for subtree overrides; concurrent global
providers writing the same target are not supported. Provider cleanup restores prior declarations
without overwriting later external writes.

Rain is opt-in via `theme="rain"`; Graphite & Iris remains the default. Canvas gradients and surface
reflection are independent. Custom accent label colors use actual sRGB luminance; arbitrary CSS token
overrides and translucent background contrast still require application-level verification.

## Corrected behavior

- Form validates native controls without ids and focuses the first invalid control.
- React 19 callback-ref cleanup, Tab/Tree focus recovery and nested Fluent boundaries are preserved.
- Invalid numeric steps, malformed colors and reversed date ranges are rejected or normalized.
- Removing the final Confirm host resolves queued confirmation/prompt requests to `false` / `null`.
- Transient toasts expire even when hidden by `max`; hover/focus pauses retain the remaining duration.
  Error, loading and actionable toasts remain sticky by default.
- Internal default copy uses translated labels; explicit caller copy remains authoritative.

## Before a stable release

Automated contracts, packed source/dist/Tailwind fixtures and SSR are covered. Complete the browser
and WebView matrix, NVDA/forced-colors checks, composited glass contrast, dense-screen visual approval
and reference-machine performance gates listed in `AUDIT-2.0.md` before publishing 2.0.
