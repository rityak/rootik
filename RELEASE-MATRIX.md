# 1.0 release matrix

Stable `latest` is blocked until every required row below has a dated pass and an evidence link. Beta releases may publish to `next` with pending manual rows called out in the release notes.

## Automated gates

| Gate | Command | Current evidence |
| --- | --- | --- |
| Types, generated CSS, lint, unit and DOM contracts | `bun run check` | CI `check` job |
| Packed dist/source, selective CSS, Tailwind and Node SSR | `bun run check:pilot` | CI `package` job |
| Production stories, serious/critical axe rules and keyboard interactions | `bun run build:stories && bun run test:browser` | CI `stories` job; Chromium, 375 px phone, table resize, dialog focus return |
| Development dependency advisories | `bun audit` | Must report `No vulnerabilities found` before tagging |

## Manual release gates

Record the date, OS/browser or hardware version, tester and evidence URL in the final column. A blank result is not a pass.

| Area | Required pass | Result / evidence |
| --- | --- | --- |
| Firefox | Critical stories; popover/dialog positioning; keyboard-only navigation; 200% zoom | Pending |
| Safari macOS/iOS | Critical stories; native dialog/popover; phone layouts; system font fallback | Pending |
| Windows WebView2/Tauri | AppShell, TitleBar drag regions/window controls, overlays, focus recovery and cold start | Pending |
| NVDA + Chromium/WebView2 | Form errors, Select, table selection/resize, dialog, toast action | Pending |
| Forced colors | Controls, focus rings, selected states, charts/status alternatives and SVG-off fallback remain distinguishable | Pending |
| Composited glass | Text/control contrast over flat dark, chart and photo backdrops; opaque fallback | Pending |
| Dense Rain screens | Five representative consumer screens approved at 100% and 200% zoom | Pending |
| Reference performance | 10,000 variable-height rows, resize/scroll/dialog-open frames and memory; cold start/build overhead within the budgets in `AUDIT-2.0.md` | Pending |
| dataset-toolkit | Packed beta installed; token mapping, Tailwind layout, typecheck/build and primary flows pass | Pending |

For per-machine screenshot review, run `bun run visual -- --update-snapshots`, inspect the baseline, then run `bun run visual`. Baselines stay local because cross-machine rendering noise is not release evidence.
