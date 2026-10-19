import { RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  BarsList,
  BulletChart,
  ChartPanel,
  DonutChart,
  Gauge,
  Heatmap,
  Histogram,
  LineChart,
  ScatterChart,
  Sparkline,
  StackedBarChart,
  Tracker,
  Treemap,
  WaffleChart,
} from "../charts/index";
import { Button } from "../controls/button";
import { Switch } from "../controls/choice";
import { NativeSelect } from "../controls/native-select";
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
import "../css/charts.css";
import "../css/layout.css";
import "../../.ladle/charts-module.css";

const LABELS = [
  "00:00",
  "02:00",
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];
const PARTS = [
  { label: "Прокси", value: 42 },
  { label: "Прямое", value: 28 },
  { label: "Локальное", value: 18 },
  { label: "Прочее", value: 12 },
];

/** Fixed samples exercise every production chart without simulated network activity. */
export function ChartsModule({
  mode: controlledMode,
  onModeChange,
}: {
  mode?: "light" | "dark";
  onModeChange?: (mode: "light" | "dark") => void;
}) {
  const [mode, setMode] = useControllable(controlledMode, "light", onModeChange);
  const [palette, setPalette] = useState<SignalPaletteId>("cobalt");
  const [style, setStyle] = useState<"rootik" | "fluent">("rootik");
  const [shape, setShape] = useState<SvgShape>("saddle");
  const [svg, setSvg] = useState(true),
    [rounded, setRounded] = useState(true),
    [motion, setMotion] = useState(true);
  const [animationMode, setAnimationMode] = useState<"once" | "off">("once");
  const animation = useMotionStudy(motion, svg, style);
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState("Выбери маршрут в рейтинге");
  const panel = { shape, padding: 24, depth: 0.45, shadow: 0.2, animation: animationMode, revision };
  const traffic = [24, 32, 28, 46, 52, 49, null, 64, 72, 65, 84, 78].map((value) =>
    value === null ? null : value + (revision % 3) * 4,
  );
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
        <div className="ch-study">
          <div className="ch-settings">
            {animation.settings}
            <Field label="Палитра charts">
              <NativeSelect
                value={palette}
                options={SIGNAL_PALETTES.map((p) => ({ value: p.id, label: p.name }))}
                onChange={(event) => {
                  const next = event.target.value as SignalPaletteId;
                  animation.transition(() => setPalette(next));
                }}
              />
            </Field>
            <Field label="Подстиль charts">
              <NativeSelect
                value={style}
                options={[
                  { value: "rootik", label: "Rootik" },
                  { value: "fluent", label: "Fluent" },
                ]}
                onChange={(event) => setStyle(event.target.value as typeof style)}
              />
            </Field>
            <Field label="Форма графиков">
              <NativeSelect
                value={shape}
                options={["rounded", "bevel", "ticket", "saddle", "corner", "wave"].map((option) => ({
                  value: option,
                  label: option,
                }))}
                onChange={(event) => setShape(event.target.value as SvgShape)}
              />
            </Field>
            <Field label="Появление графиков">
              <NativeSelect
                value={animationMode}
                options={[
                  { value: "once", label: "Один раз" },
                  { value: "off", label: "Выключено" },
                ]}
                onChange={(event) => setAnimationMode(event.target.value as typeof animationMode)}
              />
            </Field>
            <Switch
              label="Тёмная charts"
              checked={mode === "dark"}
              onChange={(event) => {
                const next = event.target.checked ? "dark" : "light";
                animation.transition(() => setMode(next));
              }}
            />
            <Switch
              label="SVG-контуры charts"
              checked={svg && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setSvg(event.target.checked)}
            />
            <Switch
              label="Скругления charts"
              checked={rounded && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setRounded(event.target.checked)}
            />
            <Switch
              label="Анимация charts"
              checked={motion}
              onChange={(event) => setMotion(event.target.checked)}
            />
          </div>
          <div className="ch-canvas">
            <SvgBackdrop pattern="dots" opacity={0.09} />
            <PageHeader
              title="Данные без лишнего шума."
              description="Оси остаются на месте. Форма обрамляет график, цвет различает серии, таблица раскрывает точные значения."
              actions={
                <Button
                  icon={<RefreshCw size={15} />}
                  svgBorder="cut"
                  onClick={() => setRevision((value) => value + 1)}
                >
                  Следующий срез
                </Button>
              }
            />
            <div className="ch-grid">
              <ChartPanel
                {...panel}
                className="ch-wide"
                title="Пропускная способность"
                description="Мбит/с · 24 часа · разрыв означает отсутствие измерения"
                summary={
                  <div className="ch-summary">
                    <strong>
                      {78 + (revision % 3) * 4}
                      <small>Мбит/с</small>
                    </strong>
                    <span>
                      Северный шлюз
                      <br />
                      Входящий и исходящий трафик
                    </span>
                    <Sparkline data={[24, 32, 28, 46, 52, 49, 64, 72, 65, 84, 78]} height={40} />
                  </div>
                }
              >
                <LineChart
                  aria-label="Трафик за сутки"
                  labels={LABELS}
                  height={220}
                  area
                  brush
                  tableView
                  defaultRange={[0, 11]}
                  series={[
                    { name: "Входящий", data: traffic },
                    { name: "Исходящий", data: [10, 18, 14, 21, 24, 26, null, 35, 30, 37, 42, 38] },
                  ]}
                />
              </ChartPanel>
              <ChartPanel
                {...panel}
                title="Маршруты и задержка"
                description="Категории слева, распределение выборки снизу"
              >
                <div className="ch-stack">
                  <BarChart
                    aria-label="Активные маршруты"
                    height={180}
                    data={PARTS}
                    highlight="Прокси"
                    labels="all"
                    tableView
                    reference={{ value: 35, label: "План" }}
                  />
                  <Histogram
                    aria-label="Распределение задержки"
                    height={150}
                    values={[12, 14, 16, 17, 18, 20, 22, 23, 24, 24, 27, 31, 35, 42, 44, 48, 52, 58]}
                    bins={6}
                    tableView
                  />
                </div>
              </ChartPanel>
              <ChartPanel {...panel} title="Состав трафика" description="Значения и доли остаются в легенде">
                <div className="ch-stack">
                  <DonutChart
                    aria-label="Доли маршрутов"
                    data={PARTS}
                    size={144}
                    thickness={18}
                    label="ГБ за сутки"
                    tableView
                  />
                  <BulletChart
                    label="Лимит профиля"
                    value={78 + (revision % 3) * 4}
                    target={90}
                    ranges={[50, 80, 100]}
                    max={100}
                    hint="из 100 ГБ"
                  />
                </div>
              </ChartPanel>
              <ChartPanel
                {...panel}
                title="Нагрузка по узлам"
                description="Стрелки перемещают фокус, штриховка означает отсутствие данных"
              >
                <Heatmap
                  label="Загрузка узлов по времени"
                  rows={["Осло", "Токио", "Рига", "Берлин"]}
                  columns={["00", "04", "08", "12", "16", "20"]}
                  values={[
                    [12, 18, 32, 44, 71, 54],
                    [42, 65, 78, 91, 82, 64],
                    [null, 14, 26, 39, 52, 44],
                    [24, 32, 46, 58, 64, 49],
                  ]}
                  min={0}
                  max={100}
                  showValues
                />
              </ChartPanel>
              <ChartPanel
                {...panel}
                title="Качество соединения"
                description="Две группы измерений · задержка и скорость"
              >
                <ScatterChart
                  aria-label="Задержка и скорость"
                  height={240}
                  xLabel="Задержка, мс"
                  yLabel="Мбит/с"
                  tableView
                  series={[
                    {
                      name: "Провод",
                      points: [
                        { x: 12, y: 92 },
                        { x: 18, y: 86 },
                        { x: 22, y: 80 },
                        { x: 29, y: 74 },
                        { x: 35, y: 68 },
                      ],
                    },
                    {
                      name: "Wi-Fi",
                      points: [
                        { x: 24, y: 76 },
                        { x: 32, y: 65 },
                        { x: 38, y: 60 },
                        { x: 46, y: 52 },
                        { x: 52, y: 44 },
                      ],
                    },
                  ]}
                />
              </ChartPanel>
              <ChartPanel
                {...panel}
                title="Канал и история"
                description="Значение доступно как meter, каждый период имеет текстовую подпись"
              >
                <div className="ch-stack">
                  <div className="ch-gauge">
                    <Gauge value={64 + (revision % 3) * 4} label="Использование канала" unit="%" size={168} />
                  </div>
                  <Tracker
                    aria-label="История доступности"
                    label="Северный шлюз"
                    summary="99,8%"
                    start="30 дней назад"
                    end="Сегодня"
                    items={Array.from({ length: 30 }, (_, i) => ({
                      tone: i === 6 ? "danger" : i === 7 ? "warn" : i > 26 ? "idle" : "success",
                      label: `День ${i + 1}: ${i === 6 ? "недоступен" : i === 7 ? "задержка" : i > 26 ? "нет данных" : "доступен"}`,
                    }))}
                  />
                </div>
              </ChartPanel>
              <ChartPanel
                {...panel}
                title="Хранилище профиля"
                description="Площадь соответствует объёму, подписи дополнены таблицей"
              >
                <Treemap
                  aria-label="Размеры наборов данных"
                  height={260}
                  tableView
                  data={[
                    { label: "Изображения", value: 42 },
                    { label: "Модели", value: 24 },
                    { label: "Архивы", value: 16 },
                    { label: "Логи", value: 10 },
                    { label: "Прочее", value: 8 },
                  ]}
                />
              </ChartPanel>
              <ChartPanel
                {...panel}
                title="Подготовка и рейтинг"
                description="Квадрат — один процент. Список можно открыть с клавиатуры."
              >
                <div className="ch-stack">
                  <WaffleChart
                    aria-label="Подготовленные данные"
                    data={PARTS.slice(0, 2)}
                    total={100}
                    side={10}
                  />
                  <BarsList
                    aria-label="Рейтинг маршрутов"
                    data={PARTS.map(({ label, value }) => ({ name: label, value }))}
                    showPercent
                    onItemClick={(item) => setSelected(`Маршрут ${item.name}: ${item.value} ГБ`)}
                  />
                  <p className="ch-note" role="status">
                    {selected}
                  </p>
                </div>
              </ChartPanel>
              <ChartPanel
                {...panel}
                title="Источники по периодам"
                description="Сравнение суммарных значений и состава"
              >
                <StackedBarChart
                  aria-label="Трафик по периодам"
                  categories={["Утро", "День", "Вечер", "Ночь"]}
                  series={[
                    { name: "Прокси", data: [24, 42, 35, 18] },
                    { name: "Прямое", data: [18, 24, 22, 12] },
                    { name: "Локальное", data: [8, 12, 10, 6] },
                  ]}
                  height={240}
                  tableView
                />
              </ChartPanel>
            </div>
          </div>
        </div>
      </Scope>
    </LabelsContext>
  );
}
