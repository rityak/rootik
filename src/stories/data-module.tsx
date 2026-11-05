import { File, Folder, Globe2, Layers, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, IconButton } from "../controls/button";
import { Switch } from "../controls/choice";
import { SearchInput } from "../controls/input";
import { NativeSelect } from "../controls/native-select";
import {
  type Column,
  ColumnsMenu,
  DataTable,
  Item,
  ItemGroup,
  OverflowList,
  Scroller,
  SelectionBar,
  SelectPanel,
  SortableList,
  Tree,
  type TreeNode,
  TreeSelect,
} from "../data/index";
import { Field } from "../forms/field";
import { ru } from "../labels/ru";
import { PageHeader } from "../layout/page";
import { SvgArtwork } from "../layout/svg-artwork";
import { SvgBackdrop } from "../layout/svg-backdrop";
import { SvgSurface } from "../layout/svg-surface";
import { useControllable } from "../lib/hooks";
import { LabelsContext } from "../lib/labels";
import type { SvgShape } from "../lib/svg-geometry";
import { SIGNAL_PALETTES, type SignalPaletteId } from "../theme/palettes";
import { Scope } from "../theme/provider";
import { useMotionStudy } from "./motion-settings";
import "../fonts.css";
import "../css/data.css";
import "../css/layout.css";
import "../../.ladle/data-module.css";

const LOCATIONS = ["Хельсинки", "Токио", "Франкфурт", "Сингапур", "Амстердам", "Варшава"];
const GATEWAYS = Array.from({ length: 72 }, (_, index) => ({
  id: `edge-${index + 1}`,
  name: `${LOCATIONS[index % LOCATIONS.length]} / ${String(index + 1).padStart(2, "0")}`,
  protocol: ["WireGuard", "QUIC", "VLESS"][index % 3] ?? "WireGuard",
  delay: 18 + ((index * 31) % 180),
  traffic: `${((index * 3.7) % 94).toFixed(1)} ГБ`,
  state: index % 9 === 0 ? "Резерв" : "Доступен",
}));
const COLUMNS: Column<(typeof GATEWAYS)[number]>[] = [
  { key: "name", header: "Шлюз", sortable: true, width: 220, hideable: false },
  { key: "protocol", header: "Протокол", sortable: true, mono: true, width: 140 },
  { key: "delay", header: "Задержка, мс", sortable: true, align: "end", mono: true, width: 160 },
  { key: "traffic", header: "Трафик", align: "end", mono: true, width: 130 },
  { key: "state", header: "Состояние", width: 140 },
];
const EVENTS = Array.from({ length: 10000 }, (_, index) => ({
  id: `event-${index + 1}`,
  sequence: index + 1,
  source: LOCATIONS[index % LOCATIONS.length] ?? "Токио",
  message: index % 7 === 0 ? "Проверка резервного маршрута" : "Соединение установлено",
}));
const EVENT_COLUMNS: Column<(typeof EVENTS)[number]>[] = [
  { key: "sequence", header: "№", mono: true, width: 80 },
  { key: "source", header: "Источник", width: 160 },
  { key: "message", header: "Событие", width: 280 },
];
const TREE: TreeNode[] = [
  {
    id: "europe",
    label: "Европа",
    icon: <Folder size={16} />,
    children: LOCATIONS.filter((_, i) => i !== 1 && i !== 3).map((name) => ({
      id: name,
      label: name,
      icon: <Globe2 size={15} />,
    })),
  },
  {
    id: "asia",
    label: "Азия",
    icon: <Folder size={16} />,
    children: [
      { id: "Токио", label: "Токио", icon: <Globe2 size={15} /> },
      { id: "Сингапур", label: "Сингапур", icon: <Globe2 size={15} /> },
    ],
  },
  { id: "archive", label: "Архив", icon: <Folder size={16} />, disabled: true },
];

/** Real collections with a decorative shell outside native scrolling and virtualization. */
export function DataModule({
  mode: controlledMode,
  onModeChange,
}: {
  mode?: "light" | "dark";
  onModeChange?: (mode: "light" | "dark") => void;
}) {
  const [mode, setMode] = useControllable(controlledMode, "light", onModeChange);
  const [palette, setPalette] = useState<SignalPaletteId>("cobalt");
  const [style, setStyle] = useState<"rootik" | "fluent">("rootik");
  const [shape, setShape] = useState<SvgShape>("bevel");
  const [svg, setSvg] = useState(true),
    [rounded, setRounded] = useState(true),
    [motion, setMotion] = useState(true);
  const animation = useMotionStudy(motion, svg, style);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [density, setDensity] = useState<"compact" | "default" | "comfortable">("default");
  const [checked, setChecked] = useState<string[]>([]);
  const [treeQuery, setTreeQuery] = useState("");
  const [chosen, setChosen] = useState<string | null>("europe");
  const [priorities, setPriorities] = useState(LOCATIONS.slice(0, 3));
  const [profile, setProfile] = useState("Личный");
  const [notice, setNotice] = useState("Изменения остаются в примере");
  const rows = useMemo(
    () =>
      GATEWAYS.filter((row) =>
        `${row.name} ${row.protocol}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      ),
    [query],
  );
  const surface = { shape, padding: 20, depth: 0.45, shadow: 0.25 };
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
          font: "rubik",
          monoFont: "jetbrains",
          glow: "off",
          "material.reflection": 0,
          motion: motion ? "full" : "off",
        }}
      >
        <div className="dm-study">
          <div className="dm-settings">
            {animation.settings}
            <Field label="Палитра data">
              <NativeSelect
                value={palette}
                options={SIGNAL_PALETTES.map((p) => ({ value: p.id, label: p.name }))}
                onChange={(event) => {
                  const next = event.target.value as SignalPaletteId;
                  animation.transition(() => setPalette(next));
                }}
              />
            </Field>
            <Field label="Подстиль data">
              <NativeSelect
                value={style}
                options={[
                  { value: "rootik", label: "Rootik" },
                  { value: "fluent", label: "Fluent" },
                ]}
                onChange={(event) => setStyle(event.target.value as typeof style)}
              />
            </Field>
            <Field label="Форма коллекций">
              <NativeSelect
                value={shape}
                options={["rounded", "bevel", "ticket", "saddle", "corner", "wave"].map((value) => ({
                  value,
                  label: value,
                }))}
                onChange={(event) => setShape(event.target.value as SvgShape)}
              />
            </Field>
            <Field label="Плотность таблицы">
              <NativeSelect
                value={density}
                options={[
                  { value: "compact", label: "Компактная" },
                  { value: "default", label: "Обычная" },
                  { value: "comfortable", label: "Свободная" },
                ]}
                onChange={(event) => setDensity(event.target.value as typeof density)}
              />
            </Field>
            <Switch
              label="Тёмная data"
              checked={mode === "dark"}
              onChange={(event) => {
                const next = event.target.checked ? "dark" : "light";
                animation.transition(() => setMode(next));
              }}
            />
            <Switch
              label="SVG-контуры data"
              checked={svg && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setSvg(event.target.checked)}
            />
            <Switch
              label="Скругления data"
              checked={rounded && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setRounded(event.target.checked)}
            />
            <Switch
              label="Анимация data"
              checked={motion}
              onChange={(event) => setMotion(event.target.checked)}
            />
          </div>
          <div className="dm-canvas">
            <SvgBackdrop pattern="dots" opacity={0.1} animated={animation.values.effects !== "off"} />
            <PageHeader
              title="Порядок в каждом ряду."
              description="Коллекции с характером. Строки, прокрутка и действия — на своих местах."
            />
            <div className="dm-grid">
              <section className="dm-table-section" aria-label="Шлюзы">
                <div className="dm-heading">
                  <div>
                    <code>01 / TABLE & SELECTION</code>
                    <h2>Маршруты пространства</h2>
                  </div>
                  <span className="dm-count">{rows.length} / 72</span>
                </div>
                <div className="dm-toolbar">
                  <SearchInput
                    aria-label="Поиск шлюзов"
                    placeholder="Город или протокол"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onClear={() => setQuery("")}
                    svgBorder="notch"
                  />
                  <SelectPanel
                    title="Протоколы пространства"
                    surface={{ shape: "ticket", padding: 20 }}
                    searchable
                    deferred
                    trigger={<Button svgBorder="cut">Выбрать протоколы</Button>}
                    options={[
                      { value: "direct", label: "Напрямую", count: 12 },
                      { value: "https", label: "HTTPS", count: 24 },
                      { value: "wireguard", label: "WireGuard", count: 36 },
                    ]}
                    onChange={(values) => setNotice(`Выбрано протоколов: ${values.length}`)}
                  />
                  <ColumnsMenu
                    columns={COLUMNS}
                    hidden={hidden}
                    onHiddenChange={setHidden}
                    trigger={
                      <Button svgBorder="cut" icon={<Settings2 size={15} />}>
                        Колонки
                      </Button>
                    }
                  />
                </div>
                <DataTable
                  surface={surface}
                  aria-label="Шлюзы пространства"
                  className="dm-gateways"
                  rows={rows}
                  rowKey={(row) => row.id}
                  columns={COLUMNS}
                  selection="multiple"
                  selected={selected}
                  onSelectedChange={setSelected}
                  hiddenColumns={hidden}
                  pinFirstColumn
                  resizable
                  sticky
                  maxHeight={354}
                  density={density}
                  zebra
                  empty="Совпадений нет. Измените запрос."
                />
                <p className="dm-note">
                  Сортировка заголовком · Shift для диапазона · ←/→ на границе колонки для ширины
                </p>
              </section>
              <SvgSurface {...surface} contentClassName="dm-card">
                <div className="dm-heading">
                  <div>
                    <code>02 / TREE & PICKER</code>
                    <h2>География связей</h2>
                  </div>
                  <Layers size={20} aria-hidden="true" />
                </div>
                <SearchInput
                  aria-label="Поиск в дереве"
                  value={treeQuery}
                  onChange={(event) => setTreeQuery(event.target.value)}
                  onClear={() => setTreeQuery("")}
                  svgBorder="notch"
                />
                <Tree
                  aria-label="Регионы шлюзов"
                  items={TREE}
                  filter={treeQuery}
                  defaultExpanded={["europe", "asia"]}
                  checkable
                  checked={checked}
                  onCheckedChange={setChecked}
                  selected={chosen}
                  onSelect={setChosen}
                />
                <Field label="Маршрут назначения">
                  <TreeSelect
                    aria-label="Маршрут назначения"
                    items={TREE}
                    value={chosen}
                    onChange={setChosen}
                    svgBorder="cut"
                  />
                </Field>
                <p className="dm-note">
                  Выбрано конечных узлов: {checked.length}. Стрелки раскрывают ветви, Space меняет отметку.
                </p>
              </SvgSurface>
              <section aria-label="Виртуальная коллекция">
                <div className="dm-heading">
                  <div>
                    <code>03 / VIRTUAL COLLECTION</code>
                    <h2>10 000 событий</h2>
                  </div>
                  <SvgArtwork variant="lattice" className="dm-artwork" />
                </div>
                <DataTable
                  surface={surface}
                  aria-label="Виртуальные события"
                  rows={EVENTS}
                  rowKey={(row) => row.id}
                  columns={EVENT_COLUMNS}
                  virtual
                  maxHeight={244}
                  density="compact"
                  pinFirstColumn
                  zebra
                />
                <p className="dm-note">
                  В DOM только видимые строки и запас. Ctrl+End в области прокрутки — к концу.
                </p>
              </section>
              <SvgSurface {...surface} shape="ticket" contentClassName="dm-card">
                <div className="dm-heading">
                  <div>
                    <code>04 / SORT & PRIORITY</code>
                    <h2>Порядок подключения</h2>
                  </div>
                  <Folder size={20} aria-hidden="true" />
                </div>
                <SortableList
                  aria-label="Приоритет маршрутов"
                  items={priorities}
                  getKey={(item) => item}
                  getLabel={(item) => item}
                  onReorder={setPriorities}
                  renderItem={(item) => (
                    <span className="dm-sort-row">
                      <Globe2 size={16} aria-hidden="true" />
                      {item}
                    </span>
                  )}
                />
                <p className="dm-note">
                  На рукоятке: Space — взять, ↑/↓ — переместить, Space — сохранить, Escape — отменить.
                </p>
                <OverflowList
                  aria-label="Все локации"
                  items={LOCATIONS}
                  renderItem={(item) => (
                    <Button size="sm" svgBorder="soft" onClick={() => setNotice(`Локация: ${item}`)}>
                      {item}
                    </Button>
                  )}
                />
              </SvgSurface>
              <section className="dm-wide" aria-label="Профили подключения">
                <div className="dm-heading">
                  <div>
                    <code>05 / LIST & SCROLLER</code>
                    <h2>Профили и быстрый доступ</h2>
                  </div>
                  <span className="dm-count">03</span>
                </div>
                <ItemGroup surface={surface} variant="divided" aria-label="Профили">
                  {["Личный", "Рабочий", "Тестовый"].map((name) => (
                    <Item
                      key={name}
                      title={name}
                      description={
                        name === "Рабочий"
                          ? "Раздельная маршрутизация · Европа"
                          : "Автоматический выбор шлюза"
                      }
                      selected={profile === name}
                      onClick={() => setProfile(name)}
                      icon={<File size={18} />}
                      meta={name === "Тестовый" ? "Резерв" : "Готов"}
                      actions={
                        <IconButton
                          label={`Настройки: ${name}`}
                          icon={<Settings2 size={16} />}
                          svgBorder="cut"
                          size="sm"
                          onClick={() => setNotice(`Настройки профиля: ${name}`)}
                        />
                      }
                    />
                  ))}
                </ItemGroup>
                <Scroller aria-label="Быстрый выбор локации">
                  <div className="dm-quick">
                    {LOCATIONS.map((name) => (
                      <Button
                        key={name}
                        svgBorder="ticket"
                        icon={<Globe2 size={16} />}
                        onClick={() => setNotice(`Локация: ${name}`)}
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </Scroller>
              </section>
            </div>
            <p className="dm-status" role="status">
              {notice}
            </p>
          </div>
          <SelectionBar
            count={selected.length}
            onClear={() => setSelected([])}
            surface={{ shape: "ticket", padding: 12, shadow: 0.3 }}
          >
            <Button
              size="sm"
              svgBorder="cut"
              onClick={() => {
                setNotice(`Проверено шлюзов: ${selected.length}`);
                setSelected([]);
              }}
            >
              Проверить выбранные
            </Button>
          </SelectionBar>
        </div>
      </Scope>
    </LabelsContext>
  );
}
