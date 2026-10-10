# Rootik: аудит и программа обновления до 2.0

Дата: 10 октября 2026. База: `rootik@0.6.1`, commit `2ddc8f7287881f9af7558dc880ddbc8fb2801168`. Рабочая ветка: `dev`.

## Статус реализации в `dev`

Версия остаётся `0.6.1`. Реализация подготовлена к review и merge; npm 2.0 release не выполняется до предрелизных gates. Findings ниже описывают исходный commit, а таблица статуса — текущее исправление.

- Все 74 toolkit stylesheet-модуля переведены на Vanilla Extract в `styles/*.css.ts`. Единственный maintained authoring source — TypeScript; прежние CSS paths являются generated bridge. Public classes, tokens и data selectors сохранены, consumer plugin/runtime dependency не нужен.
- Гибкие градиенты входят в production appearance API: material/clouds/linear, два цвета, intensity/angle/origin/spread/falloff и независимый surface reflection. Solid также показывает canvas gradient. Rain opt-in, Graphite & Iris остаётся default.
- 81 selective CSS entry автоматически включает core и component dependency closure, source/dist имеют одинаковый layer contract. Packed Vite fixtures проверяют aggregate и selective Tailwind imports, Node SSR и отсутствие tests/VE в опубликованном runtime.
- 111 tests / 962 assertions: 98 logic/SSR tests и 13 DOM lifecycle/interaction tests. DOM shim проверяет contracts; реальная геометрия Popover проверяется отдельно в Chromium.

| Findings исходного аудита | Текущий статус |
| --- | --- |
| 1–3: Form, schema, refs | Исправлены; native validation, deterministic regex, finite types, React 19 cleanup / StrictMode regressions |
| 4–5: focus и Scope | Исправлены; Tab/Tree recovery, virtual commit synchronization, immediate-parent context, explicit resets, nested Fluent boundaries |
| 6–8: contrast, Fluent, motion | Opaque contrast и state selectors исправлены, 550 contrast assertions; composited glass/custom CSS contrast остаётся release gate |
| 9–12: DataTable, appearance, types, labels | Handlers составлены, defineColumns additive, object cells защищены, defaults translated; known fields typed, registered schema validated |
| 13: interaction gates | DOM suite и CI внедрены; полный screen reader/browser/visual matrix ещё впереди |
| 14–16: Combobox, Floating, Confirm | Custom callback string-safe, async failure и label refresh; resize/layout-shift observers; host unmount cancels queue |
| 17–19: NumberInput, dates, toast | Scientific steps, range validation, queue-level expiry/update/pause исправлены и покрыты regressions |
| 20: CSS package | Layer/dependency closure исправлены; source/dist/Tailwind/pack fixtures проходят |

Appearance color fields принимают hex/RGB/OKLCH и нормализуют в OKLCH. Named colors/HSL/CSS expressions не входят в portable contract; migration описана в `MIGRATION-2.0.md`. Open extension keys и flat storage сохранены ради совместимости. Stored preferences читаются после matching SSR render, перед paint; hydration regression проходит. Одновременные global providers на одной target не поддерживаются: один global provider + Scope или explicit target.

### Фактическая pipeline и измерения

Rollup + `@vanilla-extract/rollup-plugin` извлекают CSS отдельно; tsc выпускает прежний per-module ESM и declarations. Node 24 запускает compiler, Bun — команды и тесты. `bun run dev` пересобирает изменённые styles, cache проверяет authoring/output hashes; `styles:check` всегда выполняет полную extraction и отвергает stale output. Ladle library changes используют full reload из-за virtual-config Fast Refresh cycle; story refresh и CSS HMR сохранены.

Используется globalStyle с прежними публичными selectors; runtime recipes/private hashes не добавлены. Typed token contract и maps отдельных prop axes проверяют authoring, но не обещают compile-time проверку каждого legacy selector. Advanced rules сохраняются: @starting-style, container scroll-state, supports, keyframes и reverse parent selectors.

| Измерение | Исходная база | Текущий build |
| --- | ---: | ---: |
| Aggregate CSS | 210 589 B | 209 564 B (−0,49%) |
| Aggregate CSS gzip | 39 876 B | 32 647 B (−18,13%) |
| Isolated Button source JS / gzip | 4 612 / 2 140 B | 4 617 / 2 140 B |
| Tests / assertions | 83 / 292 | 111 / 962 |

Повторяемые package measurements: `audit/pilot-build.json`. Chromium evidence и screenshot фиксируются отдельно; старая `preview-production.jpg` — предыдущая pilot iteration. Реальная consumer build evidence находится в `audit/consumer-build.json`. Нельзя сравнивать isolated Button JS с полным app bundle как один benchmark.

### Оставшиеся release gates

Safari/Firefox/Windows WebView, NVDA и forced-colors; composited glass contrast; пять плотных экранов с approval; 10 000 rows и GPU/frame profiling на reference machine; cold-start/build overhead против той же baseline. RSC и dataset-toolkit integration также не объявлены проверенными. Закрытые extension-key helpers не вводятся без конкретного consumer requirement: open index — сознательный compatibility contract.

## 1. Решение

Тулкит имеет пригодный фундамент: небольшие React-компоненты, CSS variables, семантические токены, native dialog/popover, отдельные stories, отсутствие runtime-зависимостей кроме React. Переписывать его целиком не нужно. До смены визуальных defaults необходимо исправить нарушения контрактов форм, refs, scoped appearance, типов данных и клавиатурной навигации.

**Целевой путь 2.0 — Vanilla Extract: CSS-in-TypeScript, typed theme contracts и recipes, статический CSS в опубликованном пакете.** По уточнённому требованию переход на CSS-in-JS входит в план; прежняя рекомендация оставить plain CSS основным authoring-подходом заменена. Runtime style injection не требуется: динамика идёт через variables и конечные варианты. Названия `rk-*`, `--rk-*`, `data-*` и CSS exports сохраняются как практический контракт совместимости.

Визуальная цель — **Rain / «После дождя»**: прохладный графит, приглушённый Iris signal, рассеянный свет сверху слева, матовый контент и сдержанное стекло навигации/overlays. Меланхоличный характер создаётся светом и материалом при высокой читаемости. Rootik/Fluent используют общую palette/type/state систему; прежний Graphite & Iris остаётся transition profile.

Исходный аудит включал ветку `dev`, отчёт, дизайн-спецификацию и проверку предложенной палитры. Его baseline остаётся в разделе 2; предложения — в разделах 4–5. Актуальные production fixes, VE pipeline и результаты package/build пилота перечислены в статусе реализации в начале документа.

## 2. Объём и проверенная база

Просмотрены устройство и связи всех семейств через exports, imports, CSS и stories; углублённо проверены формы, таблицы, навигация, выбор, floating layers, dialogs/confirm/toast, theme/provider/schema, общие hooks и сборка. Выполнены отдельные проверки в браузере и диагностические вызовы функций. Это не заявление о ручной проверке каждого состояния каждого компонента.

| Показатель | Фактический результат |
| --- | --- |
| Компонентные модули / CSS / story-файлы | 77 / 69 / 84; это файлы, не число отдельных публичных компонентов |
| Runtime exports | 257 |
| `bun run check` | TypeScript + Biome + 83 теста в 25 файлах, 292 assertions: успешно |
| `bun run build` | Успешно; проверка dist exports и aggregate CSS проходит |
| `bun scripts/llms.ts --check` | Успешно |
| `bun run build:stories` | Успешно; два предупреждения о CSS nesting для старых target browsers |
| `npm pack --dry-run --json` | 623 файла, 580 712 bytes tarball estimate, 2 666 109 bytes unpacked; обнаружен опубликованный source test |
| `dist/styles.css` | 210 589 bytes; gzip 39 876 bytes |
| Изолированный Button, минифицированный browser bundle | 4 612 bytes JS, gzip 2 140 bytes; React external, без CSS |
| Версии локального запуска | Bun 1.3.14; `packageManager` фиксирует 1.3.11; TypeScript 7.0.2, React 19.3.0 |

Размер Button — синтетический контроль tree shaking, не размер приложения и не сравнение styling engines. Нельзя складывать его с размером npm tarball или переносить на все компоненты.

Браузер: Chromium в Codex IAB. Проверены dashboard с Veil/Liquid/Fluent, responsive viewport 375×812, SelectPanel, а также изолированные сценарии Form, refs, Scope, Tabs, Tree, DataTable, Combobox, ConfirmHost и Floating. На мобильном dashboard document width = 375 px; глобального горизонтального overflow нет. Drawer открывается, Escape закрывает его и возвращает фокус на trigger. Горизонтальная полоса tabs требует собственной проверки доступности прокрутки.

Потребитель `umiray-client` использует Rootik 0.6.1, aggregate CSS/Tailwind bridge и прямые `.rk-*` overrides. В текущем `dataset-toolkit/client` зависимость и imports Rootik не найдены: его нельзя считать проверенным интеграционным стендом. Сборки и запуск потребителей в рамках этого аудита не выполнялись.

Ключевые результаты и способ их получения сохранены в [audit/evidence.json](audit/evidence.json). Для повторения логических reproductions: два вызова validateSchema с одним `/a/g`; number=NaN; `clampNumber(2e-7,{step:1e-7})`; resolveRange с from > to; mergeRefs с callback, возвращающим cleanup; DataTable с object-valued key без cell. Browser scenarios требуют mounted React tree, а не renderToStaticMarkup: submit required Input без id, смена options label при постоянном value, перемещение anchor без scroll, вложенные Scope, удаление ConfirmHost, rowProps click и disabled/filtered tab stop. Временные probes выполнены из gitignored test-results, не включены в публичный пакет.

## 3. Проблемы по приоритету

Обозначения: **P1** — ошибка корректности, доступности или контракта, блокирует выпуск 2.0; **P2** — существенная непредсказуемость или технический долг, исправить до стабильного выпуска либо явно ограничить поддерживаемый сценарий. P0 по выполненным проверкам не обнаружены; это не отдельный security penetration test.

### 1. P1 — Form отправляет невалидные controls без `id`

- Место: `src/components/form.tsx:43`, `:59–64`.
- Доказательство: `Form` устанавливает `noValidate`, затем пропускает controls без `id`. Пустой `<Input name="name" required aria-label="Name" />` без Field/id вызывает `onSubmit`; воспроизведено в браузере.
- Исправление: проверять native validity всех поддерживаемых controls. `id` нужен для адресации сообщения и фокуса, но не должен решать, валиден ли control. Для безымянного error slot нужен общий form error, а не пропуск.
- Влияние: ошибочные submit/запись данных. Исправление совместимо с документированным контрактом; тестировать required, email, min, custom validation, disabled и controls вне Field.

### 2. P1 — validateSchema недетерминирован и пропускает NaN

- Место: `src/components/schema-form.tsx:182`, `:185–188`.
- Доказательство: два вызова с одним `/a/g` и строкой `"a"` дают сначала `{}`, затем `Invalid format`, поскольку меняется `lastIndex`. Required number со значением `NaN`, min=0 и max=10 возвращает `{}`.
- Исправление: исключить состояние RegExp из валидации; проверять фактический тип и `Number.isFinite` перед диапазонами. Определить допустимость numeric strings явно, а не получать её случайно через `Number()`.
- Влияние: нестабильный submit и попадание некорректных чисел в callbacks. Добавить повторную валидацию, `/g`, `/y`, NaN, Infinity, пустые и неверно типизированные значения.

### 3. P1 — mergeRefs теряет cleanup callbacks React 19

- Место: `src/lib/hooks.ts:32–38`, `:60`; потребители: Input, Combobox, NumberInput, Floating, cloneTrigger/Tooltip и другие.
- Доказательство: возвращаемый `ref(node)` cleanup отбрасывается. В браузере Input получил четыре attach и ноль cleanup после rerenders/unmount. `useElementSize().ref` возвращает disconnect, который теряется при композиции с trigger ref.
- Исправление: объединённый callback должен возвращать cleanup всех callback refs и корректно очищать object refs; для refs без cleanup сохранять null-семантику. Стабилизировать identity там, где объединённый ref пересоздаётся без изменения зависимостей.
- Влияние: утечки наблюдателей и некорректный жизненный цикл refs. Контракт React 19 подтверждён [документацией refs](https://react.dev/reference/react-dom/components/common). Проверить StrictMode, замену node, object/callback refs и unmount.

### 4. P1 — Tabs и Tree теряют доступ через Tab

- Место: `src/components/nav.tsx:71`, `:122`; `src/components/tree.tsx:159`, `:267`.
- Доказательство: первый disabled tab получает selected/tabIndex=0, enabled tab — −1; Tab не входит в группу. У Tree selected id, скрытый фильтром, остаётся tab stop, а единственная видимая строка получает −1. Оба сценария проверены.
- Исправление: вычислять tab stop по текущему видимому enabled набору. Controlled selection и положение фокуса разделить; удаление/фильтрация/disable выбранного элемента должны оставлять доступную точку входа.
- Влияние: группы недоступны пользователю клавиатуры. Проверить стрелки, Home/End, удаление текущей строки, пустой набор и восстановление фильтра.

### 5. P1 — Scope не сбрасывает material и неверно наследует nested scopes

- Место: `src/theme/provider.tsx:147–175`.
- Доказательство: solid даёт пустой набор override vars вместо сброса inherited material. Под root liquid вложенный solid сохраняет alpha=40% и blur(26px). Outer compact → inner default оставляет compact: высота md control около 29.23 px вместо 34 px. Scope сравнивает значения с root context и не создаёт context для следующего Scope/useAppearanceValue.
- Исправление: effective parent context для вложенных scopes; явные значения reset для inherited custom properties. Обновить scoped appearance context вместе с CSS и data attributes. Проверить descendant selectors Fluent на пересечение границ вложенных профилей.
- Влияние: consumer не может надёжно задать локальную тему/плотность/материал. Сигнатуры можно сохранить; значения внутри Scope должны стать согласованными между hooks и CSS.

### 6. P1 — контраст проходит в normal, но ломается в hover и на других поверхностях

- Место: `src/tokens.css:76–90`; filled states и semantic fills.
- Доказательство: расчёт WCAG relative luminance для непрозрачных in-gamut token pairs: Iris normal + foreground ≈4.62:1, Iris hover ≈3.91:1, filled danger ≈3.07:1; muted text на surface-3 ≈3.98:1. Filled danger используется, например, armed ConfirmButton; это не утверждение о каждой danger Button.
- Исправление: пары background/foreground для каждого state и tone; не использовать единственный luminance threshold для всех OKLCH chroma/hue. Проверить прозрачные слои после композиции с реальным backdrop, а также custom accents.
- Влияние: обычный текст 13 px не достигает AA 4.5:1. [WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) допускает 3:1 для крупного текста, но это не относится к обычным labels текущих controls. APCA можно использовать дополнительно, не вместо AA gate.

### 7. P1 — Fluent выбранный Segment имеет неправильный foreground

- Место: `src/fluent.css:45–48`; `src/components/choice.tsx:191`, `:215`.
- Доказательство: CSS проверяет `aria-pressed`, компонент ставит `data-checked` на label с native radio. После смены pill на Iris background текст остаётся тёмным. Computed colors в браузере дают около 4.02:1 вместо требуемых 4.5:1 для этого текста.
- Исправление: согласовать selector с DOM state; проверять state contract для всех profile overrides. Смена styling engine сама по себе не связывает ARIA attributes и CSS selectors.
- Влияние: неверный selected state и контраст в одном из основных стилевых направлений. API не меняется.

### 8. P1 — Motion: Off не останавливает looping animations

- Место: `src/components/progress.css:11`, `:127`; `src/components/text-shimmer.css:8`; smooth scrolling также следует проверить против user motion override.
- Доказательство: при `--rk-motion:0` spinner остаётся infinite с периодом 2.8 s, skeleton — 1600 s, text shimmer — 2000 s. Проверено computed styles в браузере. Это нарушает проектное правило статичного состояния при Motion: Off; намеренное замедление spinner прямо записано в CSS comment.
- Исправление: статичные состояния для off/reduced motion, не деление duration на малое число. Busy state остаётся доступным через текст/ARIA; system, on, off должны иметь единый источник effective motion.
- Влияние: настройка обещает поведение, которого нет. Native prefers-reduced-motion в default system уже предусмотрен — сам default не является обнаруженной ошибкой.

### 9. P1 — DataTable игнорирует handlers из rowProps

- Место: `src/components/data.tsx:651–690`.
- Доказательство: spread custom row props перекрывается внутренними `onClick`, `onKeyDown`, `onFocus`, `onMouseDown`, `tabIndex`. В браузере rowProps.onClick не вызывается даже без onRowClick/selection; заданный tabIndex=0 исчезает. Текущий SSR-тест проверяет class/data, поэтому пропускает ошибку.
- Исправление: композиция handlers с определённым порядком и уважением `defaultPrevented`; сохранять пользовательские props, когда внутренний composite widget contract не требует другого значения. Задокументировать исключения.
- Влияние: уже публичный extension point ненадёжен. Сохранить сигнатуру rowProps; проверить selection, tree rows и вложенные интерактивные controls.

### 10. P1 — AppearanceValues не имеет типов известных настроек и не проверяет storage

- Место: `src/theme/schema.ts:3–6`, `:293–299`, `:606–613`; `src/theme/provider.tsx:30`, `:80`; `src/lib/hooks.ts:74`.
- Доказательство: `{radius:'bad', motion:true, unknownKey:'typo'}` проходит TypeScript. radius превращается в `NaNpx`, accent=`bad` попадает в CSS. JSON storage кастуется в T без schema validation.
- Исправление: typed built-in appearance keys и их value types, generic extension keys; runtime sanitization enum/range/color на чтении storage и commit. Versioned storage migration и понятный fallback. Валидацию appearance делать у этого владельца schema, не в generic readStorage для всех произвольных данных.
- Влияние: строгий TS config не защищает центральную тему; повреждённые/устаревшие настройки могут ломать интерфейс после reload. Не выкидывать неизвестные consumer extensions при миграции без их schema.

### 11. P1 — Column<T> разрешает опечатки и объект вместо React child

- Место: `src/components/data.tsx:107–112`, `:295–297`, default cell renderer.
- Доказательство: Column<{name:string}> с key=`naem` компилируется. Column<{meta:{count:number}}> с key=`meta` без cell также компилируется, но render падает: Objects are not valid as a React child. Диагностический SSR подтверждает ошибку.
- Исправление: различать accessor key и идентификатор computed column. Для object-valued fields требовать cell/value formatter; типизированный helper/overload вводить additive. Не заменять все string keys на keyof T: виртуальные columns с custom cell — законные существующие callers.
- Влияние: runtime crash при коде, принятом TS. Сначала добавить строгий рекомендованный путь и безопасный fallback/warning; removal permissive overload требует migration note.

### 12. P1 — labels/accessibility контракт не соблюдён во всех внутренних строках

- Место: `src/components/select-panel.tsx:191–206`; `src/components/data.tsx:314`; `src/lib/labels.tsx:69`.
- Доказательство: поиск SelectPanel имеет пустой label с aria-hidden icon, placeholder `Filter…`, но нет aria-label/labelledby. AX tree показывает combobox без имени; проверено в браузере. DataTable default empty=`No data` обходит существующий labels.noData.
- Исправление: собственное имя search control из useLabels, separate props override; все default copy брать из labels, а не destructuring literal. Проверить все icon-only controls и составные `aria-describedby` при cloneTrigger.
- Влияние: экранному читателю не объяснено назначение поиска, русская локализация неполна. Existing consumer labels/empty override сохранить.

### 13. P1 — текущие gates не проверяют реальные контракты взаимодействия

- Место: `src/components/toolkit-gaps.test.tsx`, tests hooks/theme, `visual/`, `.github/workflows/ci.yml:5`.
- Доказательство: 83 теста проходят при всех перечисленных reproductions. Значительная часть component tests — static SSR; локальные screenshots сняты без interaction suite, baselines gitignored и зависят от машины. Push запускает CI только на main; `dev` проверяется через PR или workflow_dispatch.
- Исправление: добавить browser regressions для подтверждённых сценариев Form/refs/Scope/focus/DataTable/Combobox/Floating/ConfirmHost/SelectPanel, negative type fixtures для 10/11/14, deterministic visual subset в CI. Зафиксировать storage, locale, fonts, clock, viewport, motion и profiles. Добавить gate для dev или обязательный PR из dev; baseline build использовать pinned Bun 1.3.11.
- Влияние: зелёная сборка не означает стабильность API/доступность. Не нужно превращать все stories в скриншоты каждой возможной комбинации; критические states и interactions должны иметь явную coverage matrix.

### 14. P2 — Combobox сохраняет устаревший label и небезопасно типизирует allowCustom

- Место: `src/components/combobox.tsx:101–117`, `:129–139`, custom-value branch.
- Доказательство: options label `Original` → `Updated` при неизменном controlled value оставляет `Original` в input; воспроизведено. `Combobox<'a'|'b'> allowCustom` компилирует onChange как `'a'|'b'|null`, хотя произвольный ввод приводится к T. Ошибка async load перехватывается без error state и может оставлять options от предыдущего запроса.
- Исправление: синхронизация display label с источником options с учётом незакоммиченного ввода; discriminated props/overload для custom string, понятная политика loading/error/stale options.
- Влияние: UI показывает старые данные, а callback получает значение вне обещанного union. Ужесточение allowCustom-типа — обоснованный небольшой source breaking change; обычный Combobox<T> сохранить.

### 15. P2 — Floating перестаёт следовать за anchor при layout shift

- Место: `src/lib/floating.tsx:86–123`.
- Доказательство: ResizeObserver наблюдает floating element, не anchor; отслеживаются scroll/resize. В открытом popover anchor перемещён с x=28 на x=228 без изменения viewport/scroll, popover остался x=28; воспроизведено с постоянным ref.
- Исправление: наблюдать anchor resize и layout shift; сохранить virtual anchors, viewport collision и cleanup. Предпочтительный следующий шаг — пилот `@floating-ui/dom`, заменяющий только position engine.
- Влияние: popup отрывается от control при раскрытии sidebar, изменении layout или контента. [autoUpdate](https://floating-ui.com/docs/autoupdate) покрывает ancestor scroll/resize, element resize и layout shift; оно не заменяет focus management.

### 16. P2 — unmount последнего ConfirmHost оставляет Promise pending

- Место: `src/components/confirm.tsx:30–32`, `:78–84`.
- Доказательство: global queue сохраняется, cleanup только уменьшает hosts. Вызвать confirm и удалить последний Host — Promise остаётся pending, диалога нет; воспроизведено. При новом host старый request может вернуться.
- Исправление: при удалении последнего host завершать requests cancellation-значением (`false`/`null`) и очищать очередь ровно один раз. Определить поведение SSR, fallback и нескольких hosts.
- Влияние: зависшие действия при смене route/window. Обычный confirm API сохранить; позднее additive AbortSignal допустим только при реальном caller requirement.

### 17. P2 — NumberInput обнуляет значения при scientific notation шага

- Место: `src/components/number-input.tsx:16–25`.
- Доказательство: `clampNumber(2e-7, {step:1e-7})` возвращает 0: `String(step)` не содержит decimal point, digits=0.
- Исправление: precision derivation с exponent notation либо явный безопасный контракт precision; проверять finite step > 0 и допустимый precision. Не вводить decimal dependency для UI параметров без требования точной финансовой арифметики.
- Влияние: небольшие training/numeric parameters повреждаются при commit. Сохранить step/precision props; проверить keyboard, wheel и typed commit одной общей функцией.

### 18. P2 — resolveRange принимает обратный диапазон

- Место: `src/components/date-range.tsx:19–29`.
- Доказательство: from=`2026-10-10T18:00`, to=`2026-10-09T18:00` возвращает ненулевой диапазон from > to. Для preset также нет finite/nonnegative проверки duration.
- Исправление: проверять конечность, порядок и preset duration в функции, не полагаться на min/max native input. Обозначить `datetime-local` как local wall time; timezone-aware контракт сделать отдельным additive API.
- Влияние: некорректные запросы для logs/charts. Изменение результата на null для невалидного диапазона соответствует существующему nullable контракту.

### 19. P2 — Toast max ограничивает показ, но не очередь transient сообщений

- Место: `src/components/toast.tsx:110`, `:198–208` и global items.
- Доказательство по коду: `slice(-max)` монтирует только последние сообщения; expiration timer создаётся в mounted Toast. Скрытые older items не истекают, пока не попадут на экран. Под потоком сообщений это сохраняет stale очередь и откладывает старые successes. Длительный нагрузочный benchmark не выполнялся.
- Исправление: lifecycle/expiry transient toast в queue store независимо от render; coalescing/deduplication и ограничение backlog. Errors/actions с duration=0 сохранять по явно заданной политике, не удалять их молча ради cap.
- Влияние: память и устаревшие уведомления при массовых operations. Не требуется внешняя очередь или event bus.

### 20. P2 — selective CSS exports отличаются от aggregate и неполны; npm включает test source

- Место: `scripts/build.ts:31–47`; `package.json:40–50`, files allowlist.
- Доказательство: aggregate обёрнут в `@layer rootik`, отдельные CSS скопированы без слоя. Unlayered author CSS получает другую cascade priority относительно consumer layers/Tailwind. Select не имеет собственного select.css: его стили разделены между input/menu; Fluent и theme/settings не скопированы в dist/css. Dry-run pack включает `src/components/toolkit-gaps.test.tsx`, несмотря на исключение tests из dist.
- Исправление: одинаковый layer contract для обоих способов импорта; явный dependency manifest/CSS bundles для families, полный набор theme/base exports; exclude `*.test.tsx` из source package. Проверять реальный npm pack в test consumer.
- Влияние: обещание selective imports не обеспечивает одинаковый вид/переопределения. Смена priority отдельных CSS может изменить consumer overrides: это небольшой документируемый breaking change, требующий fixture с Tailwind и обычным CSS.

## 4. CSS-in-JS: целевая архитектура 2.0

### 4.1. Принятое направление

По уточнённому требованию переход на CSS-in-JS входит в программу 2.0. Выбор — **Vanilla Extract: CSS-in-TypeScript с извлечением статического CSS при сборке**. Решающий критерий: type-safe авторинг внутри библиотеки без обязательного style runtime/cache/provider у потребителя. Runtime Emotion понадобился бы при генерации принципиально новых правил во время работы; текущая динамика Rootik описывается конечными вариантами и CSS variables.

Это меняет предыдущую рекомендацию оставить plain CSS основным путём. Plain CSS остаётся форматом поставки; все existing toolkit families уже имеют TypeScript authoring source. Направление миграции выбрано; технический пилот проверяет build/test/package контракты, а не подменяет решение бесконечным сравнением библиотек.

| Уровень | Ответственность | Что получает 2.0 |
| --- | --- | --- |
| Theme contract | Typed ссылки на существующие `--rk-*`, primitive и semantic roles | Автодополнение, ошибка неизвестного ключа, стабильный CSS override API |
| Theme values | Rain, legacy Graphite & Iris, существующие consumer overrides | Один набор palette/geometry/elevation значений; без копии палитры в каждом компоненте |
| Style module `.css.ts` | Private scoped classes, native pseudos, media/feature queries, slots | Изоляция implementation styles и связь с TS imports |
| Component recipe | Конечные variant/size/tone комбинации, только реальные compound cases | Проверяемые variant maps без nested условных ternaries |
| React component | Value, events, focus, refs, ARIA и native behavior | Существующий публичный API; styling migration не меняет interaction logic |
| Build/package | ESM, declarations, extracted CSS, CSS family manifest | Consumer подключает Rootik и stylesheet; Vanilla Extract остаётся заботой авторов kit |

Recipes имеют runtime функцию выбора class names, хотя сам CSS создаётся при сборке. Нельзя обещать «нулевой JS» всей системы. Это не runtime injection CSS; bytes class-selection helper нужно измерить и при необходимости включить в dist. [Vanilla Extract Recipes](https://vanilla-extract.style/documentation/packages/recipes/) описывает variants, defaults, compound variants и вывод типов.

### 4.2. Токены: один contract, три уровня

1. **Primitive values:** Rain palette, spacing scale, radii, durations. Raw values определены только здесь.
2. **Semantic roles:** canvas/content/raised/well, text/secondary/muted, control edge/divider, signal fill/text/focus, selected/on-selected, panel/overlay shadow. Компонент выбирает смысл, а не оттенок из палитры.
3. **Component tokens:** только реальные исключения, например table row height или slider track thickness. Не создавать отдельную palette для каждого Button/Input/Card.

Существующие CSS names сохраняются. Использовать global theme contract с явными именами, а не hashed public variables. Иллюстрация будущего модуля, не внедрённый код:

```ts
import { createGlobalThemeContract } from '@vanilla-extract/css';

export const vars = createGlobalThemeContract({
  color: {
    canvas: 'rk-bg',
    content: 'rk-surface-1',
    raised: 'rk-surface-2',
    text: 'rk-text',
    secondary: 'rk-text-2',
    muted: 'rk-text-3',
    controlEdge: 'rk-control-edge',
    signal: 'rk-accent',
    onSignal: 'rk-on-accent',
  },
  control: {
    sm: 'rk-h-sm',
    md: 'rk-h-md',
    lg: 'rk-h-lg',
    radius: 'rk-radius-control',
  },
});
```

Ссылки превращаются в `var(--rk-...)`; внешний CSS продолжает менять те же custom properties. Это поддерживается [createGlobalThemeContract](https://vanilla-extract.style/documentation/global-api/create-global-theme-contract/). Private локальные vars можно создавать для implementation деталей, но не подменять ими public tokens.

CSS property types не запрещают произвольную строку цвета или неверный с точки зрения дизайна размер. Поэтому отдельно нужен narrow token policy для `.css.ts`: color/spacing/radius/duration используют contract; исключения — structural 0/1px, процентная геометрия и обоснованные CSS math. Текущий CSS Grit после переноса не увидит значения в TS: перенести этот конкретный check либо проверять extracted CSS. Не объявлять TypeScript заменой lint и contrast tests.

### 4.3. Варианты и состояния

- Сохранить действительные prop enums каждого family. У Button сейчас `primary | secondary | ghost | inverse | danger | warn | outline`, `size=sm|md|lg`; default secondary/md не меняется из-за recipes. Не вводить обязательный tone во все старые компоненты ради симметрии.
- Public unions находятся в чистом TS contracts module без `.css.ts` и VE imports. Recipe maps проверяются через эти contracts; типы public props и declarations не должны заставлять consumer устанавливать `@vanilla-extract/recipes`.
- Для family с несколькими variant осями — один recipe/slot group. Простой primitive без взаимодействия вариантов использует `style`/`styleVariants` и typed class map. Compound variants только для специфического взаимодействия, например filled danger foreground. Не разворачивать полный Cartesian product size×tone×variant×state×material×density.
- `hover`, `focus-visible`, `active`, `disabled`, `checked`, `readonly`, `invalid` по возможности описывать native CSS states. Controlled composite состояния остаются `data-*`/ARIA, полученными из одного React state. Не создавать JS `hovered`/`focused` только для styling.
- Loading отделить от disabled: interaction может блокироваться, но label и width сохраняются. Для existing `active`/`aria-pressed` сохраняется текущий toggle contract.
- Свет/геометрия/material поступают через semantic vars из effective theme; компонент не получает отдельный recipe branch для каждого theme preset.
- Styles для child slots принадлежат этим slots. VE selectors целятся в собственный element; не переносить весь legacy descendant CSS одним огромным globalStyle. [Styling API](https://vanilla-extract.style/documentation/styling-api/) задаёт правила scoped selectors.

Стабильные `rk-button`, `rk-input`, `rk-card` и их parts остаются в DOM; текущая реализация не добавляет generated classes. Data attributes сохраняются даже там, где recipe уже выбрал class: это public styling/testing hooks. Consumers не должны знать generated hashes. Selector specificity и cascade проверяются отдельно: сохранение имени class само по себе не гарантирует прежний приоритет override.

Обновить явные правила проекта вместе с реализацией: AGENTS.md о plain CSS/variant classes и Biome import boundaries. Recipes используют private variant classes; public API по-прежнему выражает variants через props/data attributes. Это согласованное изменение authoring conventions, а не незаметное нарушение действующего правила. CSS tokens-only политика сохраняется в TS форме.

### 4.4. Theme, Scope и динамика

Rain — новый theme preset. `style=rootik|fluent` определяет профиль геометрии; `material` выбирает материал; `density` определяет рабочую плотность. Это разные оси, не пять независимых способностей поменять одну и ту же заливку.

`RootikProvider`, `AppearanceSettings`, consumer extensions и labels сохраняются. Сначала исправить findings 5/10: effective context вложенных Scope, explicit resets, typed known keys, runtime storage validation. Vanilla Extract не исправляет inherited values автоматически.

Runtime accent, tint, density, font, радиус, число колонок и positioning координаты меняются через variables/inline numeric geometry. Не создавать новую CSS rule/class на каждый resize, slider value, row или chart point. Current direct CSS-variable writer можно сохранить; `@vanilla-extract/dynamic` добавлять только если его typed assignment даёт проверяемый выигрыш. Отдельный theme context поверх RootikProvider не нужен.

На SSR preset должен быть доступен до первого paint через статический CSS/theme attribute. Storage preference без доступа на сервере требует согласованного initial state и отдельного раннего применения appearance; не объявлять FOUC/hydration решёнными только потому, что CSS extracted. CSP policy для inline vars или раннего script определяется consumer; extractor этого не отменяет.

### 4.5. Layers и совместимость CSS

Сохранён внешний `rootik` layer и прежний порядок rules. Nested layers не вводятся без отдельной проверки cascade compatibility. Consumers по-прежнему ставят свои layers после rootik. Внешний порядок с Tailwind: `theme, base, rootik, components, utilities`.

Использовать именованные global layers, не случайные hashed layers для публичной cascade. [globalLayer](https://vanilla-extract.style/documentation/global-api/global-layer/) поддерживает nested layers. Native focus/disabled selectors должны исключать конфликтные hover states; layers не заменяют корректные selectors.

В переходный период legacy и VE стили НЕ управляют одним и тем же component root. Миграция family атомарна: старое правило выводится из aggregate, новое занимает его место. Legacy unlayered CSS необходимо нормализовать до pilot сравнения, иначе результат будет зависеть от import order.

`styles.css` остаётся полным entry. `css/*.css` остаются доступными под прежними именами и формируются из dependency closure: component → slots/shared control CSS → base/tokens/profile requirements. Пилот обязан решить finding 20, а не только выпустить красивый Button. Не отгружать пустой старый CSS path как «совместимый».

### 4.6. Сборка, source condition и tests

Внедрённый build: Bun orchestration, Node 24 + Rollup VE extraction, затем tsc per-module ESM/declarations. Rollup не перепаковывает React JS. Dev-only dependencies: VE css/Rollup plugin, Rollup, csstype. Recipes/Vite VE plugin не нужны: Ladle и source consumers используют generated CSS. Public declarations и SSR entry не импортируют VE.

Source bridge сохраняет React TSX и прежние CSS paths; 81 selective wrapper построен из module dependency graph и explicit shared-style ownership. CI проверяет stale generated output; packed fixtures проверяют identical dependency closure в source/dist. Unit/DOM tests импортируют обычный source без style transformation.

### 4.7. Пилот и порядок полного переноса

Пилот: Button + Input + Card, primitive/semantic contracts, Rain и legacy preset, сборка/dist/source bridge, SSR import, CSS overrides, Bun regressions. Затем shared form controls/choice, overlays, navigation/layout, feedback, data/chart families. Все existing families перенесены; pilot fixtures сохранены как regression gates.

До rollout проверить сериализацию нынешних advanced CSS features: relative OKLCH, corner-shape, container/scroll-state queries, Popover hiding selector и reduced-motion rules. Поддержку конкретных свойств сверить с установленными VE/csstype/Rollup versions. Для отсутствующего TS property использовать узкое type extension/явный documented escape hatch, не `as any` всего style object и не удаление browser fallback. Existing CSS bundler limitations нельзя считать устранёнными по факту добавления dependency.

Gate пилота:

- Существующие imports/props/refs/labels/data hooks работают; consumer dist не добавляет VE plugin или provider.
- Нет runtime CSS injection; CSS и private classes совпадают между module JS и stylesheet; публичные tokens/classes стабильны.
- Clean package `.d.ts`, Node SSR import, Vite+Tailwind overrides и source condition проходят реальные fixtures.
- Negative types ловят неверные variant keys и token refs; runtime appearance validation работает независимо от type assertions.
- Одинаковые fixtures дают не более +10% gzip JS/CSS к baseline. Build/cold start измерены; прирост более 20% требует отдельно принятой причины. Это целевые budgets, не замеры установленного VE.
- Dynamic appearance не увеличивает число style rules во время slider/resize; нет duplicate helper/CSS per family; motion off, scoped resets и contrast проходят.

При превышении budget сначала убрать unnecessary recipe helper из простых primitives и дублированные rules; не менять engine и не создавать собственный recipe framework. Размеры сравниваются для identical family dependency closures, а не для одного старого Button без CSS против полного нового stylesheet.

Если gate не пройден, остановить rollout на следующий family и устранить конкретную причину. Уже выбранное направление не оправдывает broken package/source API. Запасной runtime engine рассматривается только при невозможности выразить нужный динамический CSS через variables, а не как косметическая перестановка dependencies.

## 5. Визуальный язык Rain — «После дождя»

### 5.1. Mood, тон и самостоятельный характер

**Rain:** меланхоличный, собранный, прохладный. Графит после дождя, холодный рассеянный свет, спокойная глубина, небольшая асимметрия освещения. Интерфейс выглядит дорогим за счёт точных расстояний, читаемого текста, согласованных краёв и предсказуемых состояний.

Образ выражается поверхностями и светом. Не использовать буквальные капли, мокрые текстуры, облака, движущийся дождь или weather illustrations в рабочем UI. Лёгкий ветер передаётся вытянутым static ambient gradient и аккуратным появлением overlay; постоянная анимация не нужна.

Узнаваемая деталь: **мягкая световая кромка сверху слева на поднятом слое**, которая исчезает на плоской data surface. У всех материалов одна ось света: верх слева → низ справа. Кромка не обходит каждую карточку белым specular контуром.

Apple/AEZ — ориентир точности и исполнения. Не заимствовать их layout, фирменные controls, typography hero, translucent chrome или branding. Здесь собственная идентичность: холодный приглушённый графит, небольшой muted Iris signal, плотная инженерная сетка, лёгкая инверсия выбранного navigation item.

### 5.2. Что меняется относительно текущего Graphite & Iris

Canvas чуть светлее текущего почти чёрного: L 0.17 вместо 0.145; это позволяет различать уровни без чрезмерного glow. Accent chroma падает с 0.20 до 0.10. Основной текст остаётся хорошо видимым: атмосферность нельзя получать уменьшением readability.

Liquid сейчас повторяет alpha=40%, blur=26px, rim, sheen и shadow на соседних surfaces. В Rain контент преимущественно opaque, стекло обозначает navigation/floating роль. Frost glow до 24/18% и accent glow обычных controls исключаются из нового default. Legacy presets сохраняются в transition profile, а новые значения включаются через Rain opt-in до consumer review.

### 5.3. Стартовая палитра и контраст

Это проверенная по opaque contrast **проектная палитра**, ещё не внесённая в `src/tokens.css`. Hue 255 держит нейтрали холодными, chroma растёт умеренно с lightness. Raw colors живут только в future theme values; components используют semantic vars.

| Роль | OKLCH | Назначение / mapping |
| --- | --- | --- |
| Canvas | `oklch(0.17 0.012 255)` | `--rk-bg`, общий ambient фон |
| Well | `oklch(0.15 0.012 255)` | Recessed fields/tracks; без внешнего shadow |
| Content | `oklch(0.205 0.015 255)` | `--rk-surface-1`, cards/table/forms |
| Raised | `oklch(0.245 0.018 255)` | `--rk-surface-2`, navigation/raised backing |
| Hover surface | `oklch(0.285 0.021 255)` | Верхний рабочий neutral step, не новый background для всего app |
| Primary text | `oklch(0.94 0.009 250)` | `--rk-text`, labels/values |
| Secondary text | `oklch(0.78 0.019 255)` | `--rk-text-2`, descriptions/column labels |
| Muted text | `oklch(0.69 0.022 255)` | `--rk-text-3`, units/metadata; не применять opacity поверх |
| Signal fill | `oklch(0.53 0.10 275)` | `--rk-accent`, primary CTA |
| Signal hover / pressed | `oklch(0.54 0.10 275)` / `oklch(0.50 0.10 275)` | Отдельные проверенные fills; не общий `L + 0.04` |
| On signal | `oklch(0.97 0.006 255)` | `--rk-on-accent`, один foreground для этих трёх fills |
| Selected navigation | `oklch(0.86 0.018 255)` | `--rk-inverse`, небольшая светлая pill |
| On selected | `oklch(0.205 0.015 255)` | `--rk-on-inverse`, тёмный label/icon |
| Control edge | `oklch(0.58 0.02 255)` | `--rk-control-edge`, meaningful control rim; не divider |
| Focus / signal text | `oklch(0.80 0.07 275)` | Видимый ring и accent text на dark surfaces; не fill CTA |

Расчёт OKLCH → linear sRGB → WCAG relative luminance подтвердил in-gamut pairs: primary/content 15.03:1, secondary/raised 8.11:1, muted/hover 5.18:1, on-signal normal/hover/pressed 4.94/4.74/5.62:1, on-selected 11.71:1, edge/hover 3.35:1. Результаты в [audit/rain-contrast.json](audit/rain-contrast.json). Значения нельзя переносить на glass без расчёта финального composited background.

Success/warn/danger/info сохраняют семантику, но не используются для декорации. Их text/fill пары калибруются отдельно; не назначать Rain signal foreground любому status fill. Chart palette сохраняет различимость категорий и CVD validation: спокойствие canvas не является поводом обесцветить все series.

Divider: tinted line alpha 6–8% для группировки. Control rim: отдельный opaque/validated edge. Outer panel edge можно сделать слабым, если граница панели не единственный способ понять интерактивность. Прозрачность text/icons не применять к whole component для disabled или hover.

### 5.4. Типографика

Основной шрифт оставить **Geist Variable**, уже используемый в stories; проверенный локальный metadata содержит Cyrillic/Cyrillic-ext. Загружать нужные RU/EN subsets без внешнего CDN. Font loading остаётся explicit consumer responsibility; системный fallback не должен менять рабочую структуру. Не вводить второй декоративный шрифт для ощущения luxury.

| Роль | Размер / line-height | Weight / tracking | Правило |
| --- | --- | --- | --- |
| UI label / control value | 13 / 18 px | 400–500 / 0 | Основная рабочая типографика |
| Body / длинная help copy | 14 / 21 px | 400 / 0 | Не масштабировать весь toolkit до 14 px |
| Metadata / table heading | 12 / 16 px | 400–500 / 0…+0.01em | 11 px допустим только для minor chart ticks; не для важных labels |
| Section title | 15 / 20 px | 500 / −0.01em | Формирует группу, без uppercase decoration |
| Page title | 24 / 30 px | 500 / −0.02em | Не требует отдельного hero блока |
| KPI | 32 / 36 px | 400 / −0.025em | Weight 300 только в крупных свободных summary blocks |
| Code / log / numeric columns | 12–13 / 18 px | 400 / 0 | Geist Mono либо existing mono fallback; numbers tabular |

Использовать tabular numerals у дат/времени/значений, right alignment у numeric columns. Смысловые units остаются рядом с value baseline, но меньшего размера и muted. Не делать весь экран моноширинным. Русские headings не сжимать агрессивным tracking; длинный label может переноситься в форме, value/control не должен обрезаться вслед за ним.

В таблице bold зарезервирован для summary/ключевой строки, а не каждого value. Дороговизну создаёт повторяемый ритм строк и колонок, не смесь весов 300/700 в каждой ячейке.

### 5.5. Пространство и плотность

Шкала: **4, 8, 12, 16, 20, 24, 32 px**. 4/8 — детали и связанные controls; 12/16 — содержимое группы; 20/24 — различимые группы; 32 — смена крупной зоны. Это semantic tokens, не разрешение разбрасывать raw px по component styles.

| Контекст | Конкретное правило |
| --- | --- |
| Desktop рабочая область | Page inset 20–24 px; gap между крупными panel 16–20 px |
| Card/settings panel | Padding 16 px; header→content 12–16 px; footer/action group отделить 12 px и divider только при необходимости |
| Settings row | Label/value columns; gap 16 px; label width 176–232 px, control area flexible; row block padding 8–10 px |
| Related fields | Gap 8–12 px; group label сверху; section gap 20–24 px |
| Toolbar | Controls gap 8 px; между search/filter и bulk actions 16 px; перенос по смысловым groups |
| Table | Cell inline padding 12 px, compact 10 px; row 38–40 px default, 30–32 px compact; сложная 2-line row 48–56 px |
| Shell | Sidebar 208–232 px; contextual aside 288–336 px; контент растёт, outer margins не растут пропорционально окну |
| Узкая panel | При ширине <560 px label над control; gap 6 px внутри field, 16 px между fields |

Controls сохраняют Size sm=28, md=34, lg=42 px. Default screen использует md, compact data tools — sm, touch profile — lg с hit target минимум 44 px. Не превращать density в global transform/умножение всего интерфейса: font/иконы/радиусы и outer page gaps не обязаны уменьшаться вместе с row height. Нынешние scaling semantics `--rk-density` сохранить в legacy profile; change нового Rain mapping явно описать.

«Воздух» создаётся на границах групп, внутри связанного набора остаётся рабочая плотность. Не оборачивать каждую строку настроек в отдельную card; один group panel на 4–8 связанных настроек обычно лучше восьми одинаковых поверхностей. Не оставлять пустые полэкрана между двумя toggle rows; при небольшом содержимом ограничить panel width и высоту по контенту.

Для широкого settings screen: основной столбец с form + узкий contextual aside, либо 2 columns для независимых sections; не делить одну последовательную форму пополам только ради заполнения пространства. Начальное ограничение основной form width 720–880 px; таблицы используют доступную ширину.

### 5.6. Материал, свет и глубина

| Роль поверхности | Alpha / blur | Edge / shadow | Применение |
| --- | --- | --- | --- |
| Canvas | Opaque, blur 0 | Static ambient только за shell; локальный lightness lift порядка 0.01–0.02 | Общий фон |
| Content | 100%, blur 0 | Один слабый top highlight; обычная card без большого outer shadow | Tables, settings, content cards |
| Navigation | 92%, blur 10 px, saturate около 1.05 | Top highlight 6–8%, лёгкий panel shadow | Sidebar/header/dock над meaningful backdrop |
| Popover/dialog | 96%, blur 12 px; solid fallback | Чёткая backing surface, overlay shadow | Dropdowns, dialogs, floating panels |
| Recessed well | Opaque, blur 0 | Inner edge без внешнего floating shadow | Input, segmented track, editor gutter |

Не больше одного blur-bearing ancestor для обычного content subtree. Native top-layer overlay может иметь собственный blur, но его контент не получает второй blur. По мере усложнения backdrop повышать opacity, не blur. `@supports`/performance fallback — opaque backing, а не прозрачный бесформенный popup.

Три elevation tokens:

- `control`: тонкий inner highlight/edge, без coloured outer glow.
- `panel`: мягкий close shadow 0/2/6 px и слабый diffuse 0/12/32 px; tinted shade alpha примерно 0.20/0.14. Только для реально поднятой оболочки, не каждой table cell.
- `overlay`: 0/8/24 px + 0/24/64 px, alpha примерно 0.24/0.20; edge даёт отделение над самым тёмным фоном. Финальные alpha проверяются в visual pilot.

Highlight одного тона нейтралей; никакой rainbow/chromatic refraction по borders. Accent ambient максимум 6% в default Rain, один широкий участок вне content. Background noise не включать по умолчанию: слабая фактура быстро становится шумом на мелких числах. Никаких blur filter на самом тексте или всей panel bitmap.

Сохраняются `solid / veil / frost / liquid` identifiers. В Rain это mapping на content/navigation/overlay roles; legacy profile хранит прежний внешний вид. Fluent использует ту же palette/type/state систему, более прямую geometry и преимущественно opaque surfaces. У него нет отдельной конкурирующей палитры, собственных semantics или отдельных hover glows.

### 5.7. Геометрия, иконки и акценты

- Rain panel radius 16 px; dialog 20 px; control 8 px; nested group 10–12 px. Небольшой badge 6 px либо pill, tabs/segments/nav selection — pill. Эти значения входят в preset; public radius override сохраняется.
- Для вложенной рамки inner radius = max(outer radius − фактический inset, минимально допустимый radius). Не ставить 16 px одновременно внешней card и её inset children.
- Не применять full pill к каждому Input/Button. Светлая pill узнаваемо показывает один выбранный navigation item; это не shape всех полей.
- UI icons 16 px, isolated action 18 px, крупный icon-only target 20 px; uniform stroke около 1.5–1.75. Проверять optical alignment, не рисовать разные stroke weights в одном toolbar.
- В рабочем viewport обычно одна primary CTA на task region. Secondary actions нейтральные; destructive action цветная по назначению. Не использовать Iris border/text на каждой card.
- Selected table row — muted tint/маркер + `aria-selected`; selected navigation — inverted pill. Цвет row и focus ring различимы, selected не подменяет focus.

### 5.8. Состояния и движение

| State | Visual rule | Behavior rule |
| --- | --- | --- |
| Hover | Neutral + один surface step или проверенный signal hover; без glow и scale | Не единственный способ увидеть доступный action |
| Pressed | Чуть более recessed/dark fill; стабильные габариты | Не анимировать control до scale(0.96), текст остаётся резким |
| Focus-visible | 2 px ring, offset 2 px; Rain focus tone | Не зависит от mouse hover; не обрезается overflow parent |
| Disabled | Muted label + спокойный fill/rim, без whole-element opacity | Native disabled/ARIA по назначению; не исчезает граница control |
| Readonly | Normal readable value, subdued editable affordance | Copy/select текста остаётся доступным |
| Invalid | Meaningful danger edge/icon + error copy | Error связан через aria-describedby; не только красный цвет |
| Loading | Label/width сохраняются; static busy alternative для motion off | Повторное действие блокируется согласно текущему API |
| Empty / error | Короткое explanation + релевантное действие, компактный layout | Не декоративная иллюстрация на полтаблицы |

Micro tonal transitions 120 ms, indicator 160 ms, overlay enter/exit 180 ms, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Overlay travel максимум 4 px; dropdown не «плывёт» через половину экрана. Width/row height не анимировать в data table. Native focus outline появляется сразу.

Motion off и system при `prefers-reduced-motion: reduce` выключают loops и movement. Wind mood остаётся в static light distribution; не заставлять canvas дышать постоянно. Spring разрешён для tracking toggle thumb при движении, с малым или нулевым overshoot, не для window/card entrances.

### 5.9. Правила для плотных экранов

**Table:** один общий surface; vertical separators только между смысловыми clusters, не сетка вокруг каждой cell. Sticky header opaque, row hover слабый, selection explicit. Numeric columns right-aligned, labels left-aligned; metadata не занимает самостоятельный цветовой слой. Row actions доступны через keyboard focus и menu, а не mouse hover only. Long values truncate с доступным full text/copy; критические status/error не обрезаются молча.

**Settings:** section title + краткая help copy, затем плотные label/control rows. Toggle aligned справа, описание связано с control. Зависимые настройки имеют indentation 16 px и собственную ясную grouping; не бесконечную вложенность рамок. Sticky Save/Apply footer нужен только для explicit-commit flow. Auto-save и Apply не смешиваются без отдельного объяснения.

**Dashboard:** крупное число, короткий label, secondary delta. Два–четыре KPI на summary strip, не 12 конкурирующих карточек. Charts имеют спокойную grid, плотные легенды и проверенную series palette. Rain ambient не проходит через plot text.

**Desktop shell:** постоянные navigation anchors и контекстная рабочая область. Разделение sidebar/content читается тональным шагом и gap; не большим пустым margin. TitleBar drag region и window controls не получают decorative transforms; функциональная geometry проверяется в Tauri отдельно.

### 5.10. Короткий checklist для UI-кита

1. Выбран один content background, один raised и один recessed уровень по смыслу.
2. Body/label минимум 13 px; secondary metadata 12 px; важный текст не уходит в opacity.
3. Related controls разделены 8 px, sections — 20–24 px; panel padding 16 px.
4. md control 34 px, compact sm 28 px; границы controls проходят 3:1.
5. Radius roles согласованы; нет одинакового большого rounding на каждой вложенности.
6. У контента нет backdrop blur; navigation 92%/10 px, overlays 96%/12 px как стартовые defaults.
7. Focus ring 2/2 px; visible и selected states различимы.
8. Accent chroma 0.10, primary fill отдельно от accent text; все state foreground pairs проверены.
9. Один слабый top-light direction, без glow вокруг каждой card/button.
10. Table/form остаются usable в compact и RU; grouping сильнее decorative borders.
11. Motion off статичен; row/control не уменьшается transform при click.
12. Every icon-only action имеет accessible name; error/status имеют текстовую альтернативу.

### 5.11. Приёмка дизайн-направления

Пять полноценных экранов: dashboard, плотная таблица, settings с errors/dependent controls, desktop shell, overlay stack. Rootik/Fluent, Rain/legacy, solid/glass, RU/EN, compact/default, desktop 1280 px и mobile 375 px. Снять representative states normal/hover/focus/disabled/error/loading вместо полного Cartesian screenshot matrix.

Сцены backdrop: flat dark, chart behind overlay, контрастное фото за navigation. Glass проходит composited contrast и opaque fallback. Проверить 200% zoom, font fallback, forced colors, focus not obscured и screen-reader names. Для touch AA threshold — [24×24 px или spacing exceptions](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum); 44×44 — принятая цель touch profile.

Rain принят, когда на плотной таблице и длинной форме сохраняются характер, ясная иерархия и contrast. Один эффектный пустой dashboard не доказывает зрелость визуальной системы. Production Rain story и opaque token tests реализованы; полный пятиэкранный visual review и composited glass contrast остаются gates. Styling migration завершена.


## 6. Библиотеки и функциональное покрытие

Рекомендация: одно обоснованное изменение position engine; остальные зависимости подключать только в optional entry/consumer при требовании соответствующей функции. Не собирать обязательный набор из animation/date/headless/table библиотек.

| Возможность | Конкретный выбор | Когда нужен / граница решения | Цена и интеграция |
| --- | --- | --- | --- |
| Позиционирование overlays | `@floating-ui/dom` | Первая кандидатура: текущий engine уже пропускает layout shift; нужны reliable flip/shift/size/virtual anchor | Проверить packaged gzip и cleanup; оставить native popover/top layer и текущие props; оправдать исключение из zero-deps политикой или optional adapter |
| Focus/modal | Native dialog + исправленные roving/refs | Для нынешних modal dialogs платформа уже делает основу; focus return/initial focus/SelectPanel проверяются Rootik tests | Не добавлять второй focus trap поверх native modal; для custom nonmodal composite отдельно пилот React Aria hooks, если APG logic растёт |
| Dates/timezones/calendars | `Intl` для текущих labels; `@internationalized/date` для полноценного date picker | Нужны timezone/DST, диапазоны календаря и international calendars; current datetime-local их не решает | Optional calendar/date entry; [React Aria date/time design](https://react-aria.adobe.com/blog/date-and-time-pickers-for-all); conversion к существующему API на boundary |
| Анимации | CSS tokens; optional `motion` | Только interruptible enter/exit, coordinated transitions или drag interactions, которых CSS не покрывает | Consumer/optional entry; [useReducedMotion](https://motion.dev/docs/react-use-reduced-motion); не ставить motion wrapper на каждый control |
| Variable-height virtualization | `@tanstack/react-virtual` при требовании | Current fixed-height useVirtual оставить; переходить для dynamic row measurement/сложного scroll anchoring | Headless adapter, preserve table/tree APIs; [TanStack Virtual](https://tanstack.com/virtual/latest/docs/introduction); benchmark на реальных строках до решения |
| Accessibility regression | `@axe-core/playwright` как dev dependency + keyboard assertions | Для CI semantic violations; axe не доказывает удобство keyboard/screen reader | Один dev test harness; ручной NVDA проход критических flows остаётся обязательным |

`@floating-ui/react` целиком, Radix/Mantine целиком, GSAP, обязательные date-fns/dayjs и внешний state/event infrastructure для core сейчас не обоснованы. Они увеличат обслуживание и создадут второй API рядом с существующим. Точные bundle deltas выбранных adapters в этом аудите не измерялись.

### Функции, которые должны закрывать реальные admin/desktop сценарии

- Overlays: collision/scroll parents/layout shift, nested menu/select/dialog, Escape ordering, focus return, touch dismissal, available height. API для anchors сохранить.
- Forms: native/schema validation, async submit state/error slot, accessible errors и стабильная связь Field/control; строгая типизация schema values. Async validation добавлять при consumer use case, а не как отдельный form framework.
- DataTable: rowProps, typed accessors, sort/selection/tree, controlled updates, virtual keyboard navigation, widths persistence; серверный sort/filter/page через callbacks. Не встраивать data fetching/cache.
- Dates: текущий range привести к корректному контракту; календарь/range picker/timezone — отдельное family при потребности приложений.
- Desktop shell: TitleBar/drag regions, resize/overflow, dock/sidebar drawer, keyboard shortcuts с исключением editable controls; проверка в Tauri WebView обязательна перед обещанием desktop compatibility.
- Feedback: toast backlog, cancelable operations, empty/error/loading/retry states, progress с reduced motion и labels. Использовать текущие компоненты, не добавлять дублирующие primitives.

## 7. Миграция и совместимость

### Контракт, который сохраняем

Public imports/exports, component names, обычные props, `rk-*` hooks, semantic tokens, data states, labels overrides, aggregate stylesheet и existing CSS paths. Нельзя считать CSS-классы приватными: `umiray-client` ими пользуется.

Не увеличивать version до 2.0 до выполнения критериев. `dev` — интеграционная ветка; пользователь разрешил реализацию и подготовку Git handoff. Stable release требует gates ниже.

| Этап | Работа | Результат и gate | Совместимость |
| --- | --- | --- | --- |
| 0. База и решение | Этот отчёт, baseline, Rain specification и VE architecture | Выполнено; baseline сохранён, VE build внедрён | Production API не менялся |
| 1. Корректность | Findings 1–5, 8–9, 12, 16–19; regressions до фиксов | Browser/logic tests воспроизводят дефект до изменения, проходят после; no P1 lifecycle/validation/focus | Bugfixes; labels и cancellation behavior описать |
| 2. Типы и тема | Findings 10–11, 14; runtime appearance validation, effective scopes, storage migration | Negative compile cases, valid extensions, controlled/uncontrolled, hydration/storage cases | Строгие helpers additive; unsafe custom value type может потребовать source migration |
| 3. VE pipeline и технический пилот | Button/Input/Card, contracts, Rollup extraction, Ladle integration, Bun tests, source bridge, CSS manifest | Dist/source/SSR/clean declarations/override fixtures проходят; measured budgets и advanced CSS checks | Props/classes/tokens/data attributes/CSS paths сохранены |
| 4. Rain visual pilot | Пять плотных экранов; palette/type/spacing/material/state rules раздела 5 | Visual review, contrast, font/zoom/keyboard tests; glass compositing отдельно | Rain opt-in; legacy preset остаётся доступен |
| 5. Полная styling migration | Choice/form → overlays → navigation/layout → feedback → data/charts; устранение duplicated legacy rules | Все families из inventory переведены; только один authoring source на family; aggregate/selective imports эквивалентны | Никаких случайных enum/default/DOM semantics изменений |
| 6. Overlay и optional features | Floating DOM pilot; date/virtualization/motion только по use case | Boundary props сохранены; измерены bytes/positioning/performance | Adapter предпочтительнее замены всего family |
| 7. Предрелиз | Packed npm install в consumers, SSR/hydration, WebViews, browser matrix, docs/changelog | `2.0.0-beta.*` → RC → stable после полного release gate | Migration guide с before/after, aliases, deprecation horizon |

Correctness fixes остаются release blockers. VE pipeline и дизайн-проектирование можно вести рядом с ними, но перенос следующего family проходит только после gates технического и визуального пилота. Визуальное обновление не маскирует unresolved correctness. Длительность полного rollout определять по пилоту и объёму optional features; точная оценка недель до этих данных будет выдумкой.

### Допустимые breaking changes

1. Коррекция unsafe `allowCustom` callback type: произвольный ввод не может обещать ограниченный enum. Дать пример migration и тип для custom string.
2. Invalid appearance values больше не применяются: fallback + diagnostic вместо NaN/invalid CSS. Сохранить valid extensions и известные настройки storage.
3. Invalid range/number/schema input отклоняется. Это исправление поведения; отметить тем callers, которые случайно полагались на coercion.
4. Selective CSS получает consistent layer; documented CSS priority change. Поддержать consumer override через явный порядок layers.
5. Смена visual default допускается для 2.0 после opt-in пилота; прежний профиль доступен в transition window.

Крупные breaking changes — hashed public classes, замена components на иной headless framework, обязательный consumer build plugin, другой theme/provider API — сейчас не дают достаточного выигрыша и не рекомендуются.

## 8. Критерии «готово к 2.0»

### Корректность и типы

- Все P1 исправлены и имеют regression coverage; P2 закрыты или переведены в конкретное documented limitation с владельцем и причиной. Нельзя скрывать обычный поддерживаемый сценарий под limitation ради выпуска.
- Ни один валидный typed default path DataTable/Combobox/SchemaForm/appearance не требует unsafe cast в consumer. Negative fixtures отклоняют typo keys, object cells без renderer, enum/custom mismatch и неправильные appearance values.
- Callback refs очищаются ровно по React lifecycle; observers/listeners/timers не остаются после unmount. StrictMode и повторное mount/unmount проверены.
- Controlled/uncontrolled и динамические options/rows/filters сохраняют value/focus contract; pending confirm/async operations имеют определённое завершение.

### Доступность

- Все критические flows проходимы Tab/Shift+Tab/arrows/Home/End/Enter/Space/Escape без mouse; focus return и focus visibility проверены.
- В critical stories нет axe serious/critical violations; false positives разобраны, а не глобально выключены. Manual NVDA smoke: Form errors, table selection, combobox, dialog, toast.
- Text AA contrast и control/meaningful icon contrast проходят для поддерживаемых default profiles/states; custom accent sanitization/fallback определены. Glass проверен на реальном backdrop.
- Motion off/reduced — статичные loops; forced-colors controls различимы; zoom 200% и RU labels не теряют действия.

### Визуальная зрелость

- Rain specification раздела 5 принята на пяти плотных экранах; Rootik и Fluent используют общую semantic palette/type/spacing/elevation/state систему. Legacy profile проходит compatibility fixtures.
- Все existing families имеют story и проверенный normal/focus/disabled/error/loading state там, где состояние применимо. Не остаётся неизвестных selector/markup mismatches.
- Пройдены пять полноценных экранов и mobile width 375 px; white rim/blur не заменяет иерархию данных. Переносы, overflow, concentric radii и heights согласованы.
- Visual baselines детерминированы; изменения approved как обновление spec, не принимаются массовым `--update-snapshots` без просмотра.

### Поставка и производительность

- Check/build/llms/stories/pack проходят на pinned toolchain в CI; dev/PR не обходят gate.
- Реальный packed install проверен в umiray-client и отдельном consumer fixture с Vite+Tailwind, React SSR/hydration и selective CSS. Dataset-toolkit — дополнительный интеграционный этап после фактического подключения.
- Browser support matrix явно зафиксирована для native popover/dialog/CSS features и Tauri Windows WebView; заявленные Firefox/Safari версии проверены. Ladle target warnings не используются как доказательство поддержки старых browsers.
- Styling authoring перенесён на Vanilla Extract; нет runtime CSS injection/cache и непреднамеренных VE imports в public `.d.ts`/Node SSR entry. Class-selection helper, если используется, включён в package и измерен. Dist/source conditions не требуют нового consumer plugin.
- Rollup/Ladle/Bun/TypeScript 7 pipeline проверен на pinned версиях; все existing families имеют ровно один maintained style source, legacy/Rain profiles — значения и осмысленные overrides этого же contract. Advanced CSS/fallbacks сохранены.
- Package/CSS/JS deltas измерены на одинаковых fixtures; увеличение gzip >10% или build/cold start >20% требует конкретного объяснения и принятого budget. Эти пороги являются release policy, а не результатом текущего benchmark.
- Virtual scrolling проверен на 10 000 строк, resize/scroll/dialog-open на reference desktop; CPU, frames и memory сравниваются с baseline на том же стенде. В этом аудите такие performance результаты не получены.
- Migration guide, changelog, examples и llms.txt описывают фактический API; npm tarball не содержит tests/stories/audit fixtures.

## 9. Границы доказательств

Подтверждённые reproductions и прочитанные code paths перечислены в findings. Baseline `audit/evidence.json` относится к исходному 0.6.1. Дополнительно проверены девять opaque Rain color pairs, результат в `audit/rain-contrast.json`; это proposed preset, не measured UI после rollout. Для translucent glass нужны отдельные composited screenshot measurements. Subjective визуальные оценки не являются performance benchmark.

Проверены real packed umiray-client build, Node SSR и DOM hydration. Не выполнены: полный RSC test, NVDA, Firefox/Safari, Windows/Tauri WebView, forced-colors visual run, GPU/frame profiling glass, длительная toast нагрузка, variable-height table benchmark, dataset-toolkit integration и сравнение нескольких установленных CSS-in-JS engines. Эти проверки включены в release gates.

Dependencies/build config/components изменены согласно статусу в начале отчёта. Исходные 20 findings оставлены как evidence исходной базы, а не утверждение, что дефекты по-прежнему присутствуют. Subjective дизайн-оценка и single Chromium preview не доказывают readiness всего toolkit.
