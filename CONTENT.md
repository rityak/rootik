# Content module

```tsx
import { Card, CodeEditor, Disclosure, Prose, Text } from "rootik/content";
import "rootik/content/styles.css";

<Card title="Profile" surface={{ shape: "corner", padding: 24 }}>
  <Prose>
    <p>Clear content with <strong>semantic emphasis</strong>.</p>
  </Prose>
  <Text family="mono" weight="medium">128.4 GB / 24 ms</Text>
  <Disclosure title="Advanced" surface={{ shape: "ticket", padding: 16 }}>
    <CodeEditor title="profile.ts" value={code} onChange={setCode} />
  </Disclosure>
</Card>
```

## Public families

- Card, Stat, SectionLabel, Nest, Divider and KeyValue.
- Text, Prose, Code, Kbd/formatShortcut, Truncate and Spoiler.
- CodeBlock, CodeEditor, CopyButton and Editable.
- JsonView and LogView, including existing query/format helpers; StickToBottom and its ref handle.
- Avatar/AvatarGroup, Thumbnail/ImageGrid, FileDrop, Lightbox and QrCode/encoding helpers.
- Timeline, RelativeTime/Timer, RollingNumber and TextShimmer.
- Disclosure: the same native details implementation remains available through `rootik/layout`.

Root and legacy component paths re-export the same functions. Existing state models, callbacks, copy behavior, image selection, virtualization and native semantics remain intact. No runtime dependency was added.

The final source-location cleanup also places FloatingWindow/Splitter in `/layout`, SelectPanel in `/data`, Stepper in `/navigation` and Tour in `/overlays`. Their root and legacy exports remain compatible. FloatingWindow/SelectPanel/Tour now support shared surfaces; Stepper supports SVG marker borders and Splitter an optional grip. Their owning module docs cover decoration and focus behavior.

## Typography

`Text.family` selects `sans`, `mono` or `display` from the appearance font roles; omission inherits the surrounding family. `weight` supports normal (400), medium (500), semibold (600) and bold (700). `italic` explicitly enables or clears italics. Native tags, language, labels and caller attributes stay on the same root.

Use System, Rubik or Onest for UI text through RootikProvider/Scope. JetBrains Mono and the optional Literata display family remain separate roles. Import the optional `rootik/fonts.css` to self-host bundled faces; System needs no font download.

Prose supplies readable text rhythm, headings, lists, quotes, links and code. A highlighter remains a consumer choice through CodeBlock.renderLine; the toolkit does not pull in a syntax engine. JSON strings/numbers/booleans have dedicated text tokens instead of brightening categorical plot colors. Their contrast is tested at 4.5:1 against every named material in both modes.

## Geometry and motion

Card and Disclosure accept `surface` using the existing OverlaySurfaceOptions contract. The absolute SvgSurface decoration and native host share the same protected padding. Content, collapse state and input/editor nodes do not remount when SVG, corners, mode or Fluent changes. An explicit surface takes precedence over legacy `variant` material recipes (including inverse); it keeps normal named-theme ink and prevents mixing a light-card text override with a dark SVG fill. Omit `surface` to use the existing inverse/glow/outline/sunken variants.

Card remains a section with native header actions, a separate stretched hit button and retained/inert collapsed content. SVG-selected and keyboard-focused cards use the surface rim; flat fallback uses an inset edge. Interactive hover no longer translates the card. The surface's caption/body/footer sit inside the same safe padding.

Disclosure retains native details/summary, including exclusive `name` accordions. A stable decorative wrapper places the surface beside details, outside its animated content clip. One shell therefore covers both expanded and collapsed states, with identical safe padding in Rootik, SVG Off and Fluent. Props, className, style and ref still target the native details. Without a surface the wrapper uses display: contents; adjacent legacy accordions retain their dividers. The flat rim is inset so a parent collapse clip cannot hide its sides.

Card.animation and TextShimmer.animation accept loop, once and off. Card.running continues to expose busy state even when decoration is off. Shared SVG light obeys effects/motion/SVG/Fluent gates; TextShimmer has its own repeat policy and global motion/effects fallback. Reduced motion leaves static readable text. Follow-tail jump scrolling now honors Motion Off as well as system reduced motion. No new animation timer or per-frame React work was introduced.

## Content and media behavior

Avatar falls back to initials after an image error and attempts a new source when provided. AvatarGroup.max=0 hides all avatars and shows the overflow count. Missing Thumbnail images retain their textual alternative.

ImageGrid selection and keyboard opening use the existing model. Lightbox stays on native dialog; its stage bypasses buttons before capturing pointers, so navigation clicks work alongside swipe/pan. Unmount closes the modal before its DOM disappears, restoring native focus. Zoom still follows the image's natural size; vector study assets have explicit intrinsic dimensions.

QrCode uses fixed light-plate/dark-module tokens in every theme. SVG Off disables decorative frames, not image data, QR modules or icons. QR encoding is unchanged; an actual scanner/device matrix is a separate gate.

FileDrop validates type/size/count and reports accepted/rejected local files. The demo does not upload or transmit them. LogView retains filtering, regex search, fixed-height virtualization and follow-tail. JsonView retains tree keyboard navigation and value/path copy. Nested rows use distinct icons for the two actions; the root exposes only value copying. C/P shortcuts remain available, including the root JSONPath ($). CopyButton accepts a custom idle icon and retains its shared success check. CodeEditor remains a textarea, not an IDE replacement.

## Validation

The content regression suite checks all public module identities, retained native/collapse/editor state, independent card actions, disclosure, image error recovery, text roles and repeat gates, gallery keyboard selection, log empty results, modal pointer navigation/cleanup and motion-aware scrolling. Palette tests cover syntax contrast and QR polarity. Packed fixtures import the public module/CSS in dist/source and Node SSR without a VE plugin.

Production stories and Design Lab `screen=content` render a shared example with 10,000 log lines, editing, JSON, native disclosure, SVG media and Lightbox. Screenshot evidence is stored under `design-lab/screenshots/content-*`. Real consumer apps, other engines, assistive technologies, scanner devices and GPU profiling remain separate validation gates.

Local Chromium verification covered rename/edit/save in the demo, JSON tree keys, CodeBlock wrapping, log filtering/empty states and 10,000-row virtualization (22 mounted rows in the filtered view). Lightbox pointer navigation, zoom and native focus return were verified after repair. SVG Off changed 20 measured boxes by at most 0.00016 px while preserving code, the native field, four media images and QR data. Fluent removed all decorative SVG/light and set radius to zero. Once/Off/Motion Off were checked against busy state and computed animation. Light Maomao with Onest at 365 CSS px had equal document/client widths; narrow headers wrap their actions instead of squeezing the title. No scanner hardware, GPU profiling or real consumer application was exercised.

Disclosure browser verification confirms one material shell in both states, 16 px safe padding before and after expansion, and an inset Fluent rim visible inside a collapsing Card. The DOM regression also covers retained details/input identity when changing Fluent or removing the surface.
