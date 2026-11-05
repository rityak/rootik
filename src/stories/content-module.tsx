import { FileCode2, Layers, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Card,
  Code,
  CodeBlock,
  CodeEditor,
  CopyButton,
  Disclosure,
  Divider,
  Editable,
  FileDrop,
  ImageGrid,
  JsonView,
  Kbd,
  KeyValue,
  Lightbox,
  type LogLine,
  LogView,
  Nest,
  Prose,
  QrCode,
  RelativeTime,
  RollingNumber,
  SectionLabel,
  Spoiler,
  Stat,
  Text,
  TextShimmer,
  Timeline,
  Truncate,
} from "../content/index";
import { Button } from "../controls/button";
import { Switch } from "../controls/choice";
import { Input } from "../controls/input";
import { NativeSelect } from "../controls/native-select";
import { Badge } from "../feedback/status";
import type { FeedbackAnimation } from "../feedback/track";
import { Field } from "../forms/field";
import { ru } from "../labels/ru";
import { PageHeader } from "../layout/page";
import { SvgBackdrop } from "../layout/svg-backdrop";
import { useControllable } from "../lib/hooks";
import { LabelsContext } from "../lib/labels";
import type { SvgShape } from "../lib/svg-geometry";
import { SIGNAL_PALETTES, type SignalPaletteId } from "../theme/palettes";
import { Scope } from "../theme/provider";
import { useMotionStudy } from "./motion-settings";
import "../fonts.css";
import "../css/content.css";
import "../css/layout.css";
import "../../.ladle/content-module.css";

const SAMPLE =
  'export const profile = {\n  name: "Northern gateway",\n  transport: "direct",\n  retries: 3,\n  enabled: true,\n};';
const ART = ["contour", "orbit", "signal", "fold"].map((name, i) => ({
  key: name,
  src: new URL(`./content-assets/${name}.svg`, import.meta.url).href,
  alt: `Абстрактная SVG-композиция ${i + 1}`,
  label: ["Рельеф", "Орбиты", "Сигнал", "Складки"][i],
  title: ["Рельеф", "Орбиты", "Сигнал", "Складки"][i],
}));

/** Deterministic content editing, inspection and local media scenarios; no upload or network work. */
export function ContentModule({
  mode: controlledMode,
  onModeChange,
}: {
  mode?: "light" | "dark";
  onModeChange?: (mode: "light" | "dark") => void;
}) {
  const [mode, setMode] = useControllable(controlledMode, "light", onModeChange);
  const [palette, setPalette] = useState<SignalPaletteId>("cobalt");
  const [style, setStyle] = useState<"rootik" | "fluent">("rootik");
  const [shape, setShape] = useState<SvgShape>("corner");
  const [svg, setSvg] = useState(true),
    [rounded, setRounded] = useState(true),
    [motion, setMotion] = useState(true);
  const [animationMode, setAnimationMode] = useState<FeedbackAnimation>("once");
  const animation = useMotionStudy(motion, svg, style);
  const [font, setFont] = useState<"system" | "rubik" | "onest">("rubik");
  const [profile, setProfile] = useState("Северный шлюз"),
    [code, setCode] = useState(SAMPLE);
  const [revision, setRevision] = useState(0),
    [pending, setPending] = useState(false),
    [selected, setSelected] = useState(false);
  const [opened, setOpened] = useState<number | null>(null),
    [imageKeys, setImageKeys] = useState<string[]>([]);
  const [notice, setNotice] = useState("Изменения сохраняются только в этом примере");
  const lines = useMemo<LogLine[]>(
    () =>
      Array.from({ length: 10000 + revision }, (_, i) => ({
        level: i % 71 === 0 ? "error" : i % 29 === 0 ? "warn" : i % 5 === 0 ? "debug" : "info",
        time: `12:${String(Math.floor(i / 60) % 60).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`,
        source: i % 2 ? "profile" : "transport",
        message:
          i % 71 === 0
            ? `Ошибка проверки маршрута ${i + 1}`
            : i % 29 === 0
              ? `Таймаут, повтор ${i + 1}`
              : `Маршрут ${i + 1}: параметры проверены`,
      })),
    [revision],
  );
  const card = { surface: { shape, padding: 24, depth: 0.4, shadow: 0.2 }, animation: animationMode };
  return (
    <LabelsContext value={ru}>
      <Scope
        values={{
          ...animation.values,
          palette,
          colorMode: mode,
          style,
          svgShapes: svg,
          corners: rounded ? "round" : "square",
          radius: 16,
          fontSize: 14,
          font,
          monoFont: "jetbrains",
          displayFont: "literata",
          glow: "off",
          "material.reflection": 0,
          motion: motion ? "full" : "off",
        }}
      >
        <div className="co-study">
          <div className="co-settings">
            {animation.settings}
            <Field label="Палитра content">
              <NativeSelect
                value={palette}
                options={SIGNAL_PALETTES.map((p) => ({ value: p.id, label: p.name }))}
                onChange={(event) => {
                  const next = event.target.value as SignalPaletteId;
                  animation.transition(() => setPalette(next));
                }}
              />
            </Field>
            <Field label="Подстиль content">
              <NativeSelect
                value={style}
                options={[
                  { value: "rootik", label: "Rootik" },
                  { value: "fluent", label: "Fluent" },
                ]}
                onChange={(event) => setStyle(event.target.value as typeof style)}
              />
            </Field>
            <Field label="Шрифт content">
              <NativeSelect
                value={font}
                options={[
                  { value: "system", label: "System" },
                  { value: "rubik", label: "Rubik" },
                  { value: "onest", label: "Onest" },
                ]}
                onChange={(event) => setFont(event.target.value as typeof font)}
              />
            </Field>
            <Field label="Форма контента">
              <NativeSelect
                value={shape}
                options={["rounded", "bevel", "ticket", "saddle", "corner", "wave"].map((option) => ({
                  value: option,
                  label: option,
                }))}
                onChange={(event) => setShape(event.target.value as SvgShape)}
              />
            </Field>
            <Field label="Повтор активности">
              <NativeSelect
                value={animationMode}
                options={[
                  { value: "loop", label: "Цикл" },
                  { value: "once", label: "Один раз" },
                  { value: "off", label: "Выключено" },
                ]}
                onChange={(event) => setAnimationMode(event.target.value as FeedbackAnimation)}
              />
            </Field>
            <Switch
              label="Тёмная content"
              checked={mode === "dark"}
              onChange={(event) => {
                const next = event.target.checked ? "dark" : "light";
                animation.transition(() => setMode(next));
              }}
            />
            <Switch
              label="SVG-контуры content"
              checked={svg && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setSvg(event.target.checked)}
            />
            <Switch
              label="Скругления content"
              checked={rounded && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setRounded(event.target.checked)}
            />
            <Switch
              label="Анимация content"
              checked={motion}
              onChange={(event) => setMotion(event.target.checked)}
            />
          </div>

          <div className="co-canvas">
            <SvgBackdrop pattern="dots" opacity={0.09} />
            <PageHeader
              title="Содержание держит форму."
              description="Читать, редактировать, сравнивать и раскрывать. Декоративный слой остаётся снаружи содержимого."
              actions={
                <Button
                  icon={<RefreshCw size={15} />}
                  svgBorder="cut"
                  onClick={() => setRevision((value) => value + 1)}
                >
                  Обновить значения
                </Button>
              }
            />
            <div className="co-grid">
              <Card
                {...card}
                className="co-wide"
                title={<Editable value={profile} onChange={setProfile} label="Переименовать профиль" />}
                description="CONTENT / PERSONAL WORKSPACE"
                media={<Avatar name="Алексей Северный" size={42} status="success" statusLabel="В сети" />}
                actions={
                  <CopyButton value={profile} svgBorder="cut">
                    Копировать имя
                  </CopyButton>
                }
                footer={
                  <>
                    <Badge tone="success" svgBorder="soft">
                      Локальный профиль
                    </Badge>
                    <Text size="xs" tone="muted">
                      Изменён <RelativeTime date="2026-10-18T10:00:00Z" locale="ru" />
                    </Text>
                  </>
                }
              >
                <div className="co-intro">
                  <div>
                    <h2>
                      Меньше шума.
                      <br />
                      <em>Больше смысла.</em>
                    </h2>
                    <Text as="p" tone="muted">
                      Рубленый шрифт держит интерфейс, курсив выделяет мысль, моноширинный — точные значения.{" "}
                      <Code>rootik/content</Code> объединяет эти роли.
                    </Text>
                  </div>
                  <div className="co-stat">
                    <Stat
                      label="Подготовлено данных"
                      value={<RollingNumber value={128 + revision * 8} locale="ru" />}
                      unit="ГБ"
                      delta={12.4}
                      hint="Локальный пример показателей"
                    />
                    <AvatarGroup max={3}>
                      {["Анна Лесная", "Илья Северный", "Мария Речная", "Денис Тихий"].map((name) => (
                        <Avatar key={name} name={name} />
                      ))}
                    </AvatarGroup>
                  </div>
                </div>
              </Card>
              <Card
                {...card}
                title="Текст и композиция"
                description="Prose · Text · Code · Truncate"
                icon={<Layers size={18} />}
              >
                <div className="co-stack">
                  <Prose>
                    <h3>Иерархия без случайных размеров</h3>
                    <p>
                      Обычный текст остаётся <strong>чётким</strong>, <em>курсив</em> работает как смысловой
                      акцент. Технические значения: <Code>24 ms</Code>, <Code>128 GB</Code>.
                    </p>
                    <blockquote>Форма подчёркивает содержание, а не забирает внимание.</blockquote>
                    <p>
                      <a href="#content-notes">Перейти к заметкам</a> или открыть сочетанием{" "}
                      <Kbd keys="mod+shift+p" /> — пример записи клавиш.
                    </p>
                  </Prose>
                  <Divider />
                  <div className="co-type-roles">
                    <Text family="sans" weight="semibold">
                      Кириллица · Sans
                    </Text>
                    <Text family="mono" weight="medium">
                      128.4 GB / 24 ms
                    </Text>
                    <Text family="display" italic>
                      Мягкий акцент
                    </Text>
                  </div>
                  <SectionLabel>Длинное имя</SectionLabel>
                  <Truncate className="co-truncate">
                    Очень длинное название рабочего пространства с дополнительными параметрами и описанием
                    маршрутизации
                  </Truncate>
                  <Nest>
                    <Text size="sm" tone="muted">
                      Вложенный блок использует общие отступы и цвет текста.
                    </Text>
                  </Nest>
                </div>
              </Card>
              <Card
                {...card}
                title="Локальные параметры"
                description="Collapsible Card · native details · Spoiler"
                collapsible
              >
                <div className="co-stack">
                  <Field label="Комментарий профиля">
                    <Input defaultValue="Сохраняется при смене оформления" svgBorder="soft" />
                  </Field>
                  <Disclosure
                    title="Дополнительные параметры"
                    surface={{ shape: "ticket", padding: 16, depth: 0.35 }}
                  >
                    <div className="co-stack">
                      <Switch label="Проверять профиль" defaultChecked />
                      <Text size="sm" tone="muted">
                        Нативный details хранит раскрытие при переключении темы.
                      </Text>
                    </div>
                  </Disclosure>
                  <Spoiler maxHeight={96}>
                    <Prose size="sm">
                      {Array.from({ length: 5 }, (_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: fixed positional notes never reorder
                        <p key={i}>
                          Заметка {i + 1}. Интерфейс сохраняет фокус, значения и выбранные элементы, когда
                          меняются материал, контур и анимация.
                        </p>
                      ))}
                    </Prose>
                  </Spoiler>
                </div>
              </Card>
              <Card
                {...card}
                title="Конфигурация"
                description="CodeEditor · CodeBlock · CopyButton"
                icon={<FileCode2 size={18} />}
                footer={
                  <Button
                    svgBorder="cut"
                    onClick={() => setNotice(`В примере сохранено ${code.length} символов`)}
                  >
                    Сохранить в примере
                  </Button>
                }
              >
                <div className="co-stack">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    title="profile.ts"
                    aria-label="Редактор профиля"
                    language="ts"
                    rows={6}
                  />
                  <CodeBlock
                    code={'{\n  "mode": "local",\n  "enabled": true\n}'}
                    title="defaults.json"
                    language="json"
                    lineNumbers
                    highlight={[3]}
                    maxHeight={170}
                  />
                </div>
              </Card>
              <Card
                {...card}
                title="Структура профиля"
                description="JsonView · дерево с клавиатурой и копированием"
              >
                <JsonView
                  aria-label="Данные профиля"
                  defaultExpandDepth={2}
                  data={{
                    name: profile,
                    connection: { host: "gateway.example", port: 443, tls: true },
                    tags: ["Личный", "Локальный"],
                    quota: null,
                  }}
                />
              </Card>
              <Card
                {...card}
                className="co-wide"
                title="Журнал событий"
                description={`Строк: ${lines.length.toLocaleString("ru")} · фильтры уровней · поиск · виртуализация`}
                actions={
                  <Button size="sm" svgBorder="cut" onClick={() => setRevision((value) => value + 1)}>
                    Добавить запись
                  </Button>
                }
              >
                <LogView
                  label="Журнал профиля"
                  className="co-log"
                  lines={lines}
                  lineNumbers
                  rowHeight={24}
                  onLineClick={(_, index) => setNotice(`Выбрана строка журнала ${index + 1}`)}
                />
              </Card>
              <Card
                {...card}
                title="SVG как содержимое"
                description="ImageGrid · Thumbnail · native Lightbox"
                footer={
                  <Text size="xs" tone="muted">
                    Выбрано обложек: {imageKeys.length}. Enter открывает изображение.
                  </Text>
                }
              >
                <div className="co-stack">
                  <ImageGrid
                    aria-label="Абстрактные SVG-обложки"
                    items={ART}
                    size={126}
                    aspect={16 / 9}
                    selectable
                    selected={imageKeys}
                    onSelectedChange={setImageKeys}
                    onOpen={(_, index) => setOpened(index)}
                  />
                  <FileDrop
                    accept=".svg,.png,.jpg"
                    maxSize={5 * 1024 * 1024}
                    hint="SVG, PNG или JPG до 5 МБ. Файлы никуда не отправляются."
                    size="sm"
                    onFiles={(files) =>
                      setNotice(`Выбраны локальные файлы: ${files.map((file) => file.name).join(", ")}`)
                    }
                    onReject={(files) => setNotice(`Отклонено файлов: ${files.length}`)}
                  />
                </div>
              </Card>
              <Card
                {...card}
                title="Профиль как данные"
                description="QR остаётся тёмным на светлой подложке в обеих темах"
              >
                <div className="co-qr">
                  <QrCode value="rootik://profile/demo" label="Демонстрационный QR профиля" size={144} />
                  <KeyValue
                    items={[
                      { label: "Имя", value: profile, copy: true },
                      { label: "Режим", value: "Локальный" },
                      { label: "Формат", value: "rootik://profile" },
                    ]}
                  />
                </div>
              </Card>
              <Card {...card} title="История изменений" description="Timeline · текстовые состояния">
                <Timeline
                  items={[
                    {
                      id: "created",
                      title: "Профиль создан",
                      description: "Добавлены имя и параметры",
                      time: "10:40",
                      status: "done",
                      tone: "success",
                    },
                    {
                      id: "checked",
                      title: "Параметры проверены",
                      description: "Ошибок в локальном примере нет",
                      time: "10:42",
                      status: "current",
                      tone: "accent",
                    },
                    {
                      id: "shared",
                      title: "Экспорт профиля",
                      description: "Следующий шаг выполняет пользователь",
                      status: "pending",
                    },
                  ]}
                />
              </Card>
              <Card
                {...card}
                title="Активная карточка"
                description="Статус, выбор и анимация независимы"
                running={pending}
                interactive
                selected={selected}
                onAction={() => setSelected((value) => !value)}
                footer={
                  <Button svgBorder="soft" onClick={() => setPending((value) => !value)}>
                    {pending ? "Остановить активность" : "Показать активность"}
                  </Button>
                }
              >
                <div className="co-stack">
                  <TextShimmer active={pending} animation={animationMode}>
                    {pending ? "Подготовка профиля…" : "Профиль готов"}
                  </TextShimmer>
                  <Text size="sm" tone="muted">
                    Клик по карточке меняет выбор. Кнопка управляет активностью отдельно; наведение не двигает
                    блок.
                  </Text>
                </div>
              </Card>
            </div>
            <p id="content-notes" className="co-notice" role="status">
              {notice}
            </p>
            {opened !== null && (
              <Lightbox
                images={ART}
                index={opened}
                onIndexChange={setOpened}
                onClose={() => setOpened(null)}
              />
            )}
          </div>
        </div>
      </Scope>
    </LabelsContext>
  );
}
