import {
  ArrowDownLeft,
  ArrowUpRight,
  AudioLines,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  Gauge,
  Globe2,
  Layers,
  LayoutGrid,
  Plus,
  Power,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Type,
  Wifi,
  X,
} from "lucide-react";
import { lazy, Suspense, useState } from "react";
import {
  Badge,
  Button,
  Card,
  DataTable,
  Dialog,
  Field,
  Form,
  IconButton,
  Input,
  Progress,
  RootikProvider,
  SegmentedControl,
  Slider,
  Switch,
} from "..";
import "../../.ladle/design-lab.css";
import "../../.ladle/design-signal.css";
import { SvgLab } from "./svg-lab";

const TypographyLab = lazy(() =>
  import("./typography-lab").then((module) => ({ default: module.TypographyLab })),
);
const LayoutModule = lazy(() =>
  import("./layout-module").then((module) => ({ default: module.LayoutModule })),
);
const ControlsModule = lazy(() =>
  import("./controls-module").then((module) => ({ default: module.ControlsModule })),
);
const FormsModule = lazy(() => import("./forms-module").then((module) => ({ default: module.FormsModule })));
const ContentModule = lazy(() =>
  import("./content-module").then((module) => ({ default: module.ContentModule })),
);
const ChartsModule = lazy(() =>
  import("./charts-module").then((module) => ({ default: module.ChartsModule })),
);
const FeedbackModule = lazy(() =>
  import("./feedback-module").then((module) => ({ default: module.FeedbackModule })),
);
const DataModule = lazy(() => import("./data-module").then((module) => ({ default: module.DataModule })));
const OverlaysModule = lazy(() =>
  import("./overlays-module").then((module) => ({ default: module.OverlaysModule })),
);
const NavigationModule = lazy(() =>
  import("./navigation-module").then((module) => ({ default: module.NavigationModule })),
);

const directions = [
  {
    id: "signal-light",
    name: "Rootik Signal / Light",
    subtitle: "Мягкий свет · точные данные",
    summary: "Светлый матовый корпус, Iris и приборная графика.",
    source: "Soft light × Instrument × Rootik",
    detail:
      "Матовый светлый материал и тактильные контролы от Soft light, сегментные шкалы и точечные данные от Instrument. От оригинального Rootik — Iris, лёгкие крупные числа, обратная selected-pill и штрихованный остаток. Таблица лежит на ровной поверхности; рельеф сосредоточен на действиях.",
    tradeoff:
      "Полям нужны собственные контрастные границы. Тень показывает глубину, но состояние фокуса и выбора задают явные контуры и заливки.",
  },
  {
    id: "signal-dark",
    name: "Rootik Signal / Dark",
    subtitle: "Тот же материал · в графите",
    summary: "Та же геометрия, графит с оттенком Iris и мягкий рельеф.",
    source: "Soft light × Instrument × Rootik",
    detail:
      "Общая со светлой темой структура, размеры и приборная графика. Тёмный корпус сохраняет мягкий верхний свет; Iris выделяет главное действие и данные. Светлая selected-pill возвращает навигации характер оригинального Rootik.",
    tradeoff:
      "Мелкие подписи и неактивные сегменты должны оставаться видимыми на графите. Свечение ограничено, графики и формы используют те же отступы, что и светлая тема.",
  },
  {
    id: "current",
    name: "Current Rootik",
    subtitle: "Точка отсчёта",
    summary: "Graphite & Iris · действующие компоненты и default appearance.",
    source: "Текущая dev",
    detail:
      "Островные карточки, светлая selected-pill, стеклянные поверхности и Iris для основного действия. Это действующие стили библиотеки, а не их перерисовка.",
    tradeoff: "Много равноправных контейнеров; визуальный вес распределён почти равномерно.",
  },
  {
    id: "graphite",
    name: "Graphite",
    subtitle: "Тактильный графит",
    summary: "Одна рабочая поверхность. Глубина на элементах управления.",
    source: "Референсы 2 / 4",
    detail:
      "Навигация утоплена в общий корпус, активный раздел приподнят. Основной контент почти плоский; боковой инспектор отделён материалом. Мятный акцент обозначает активное соединение и главное действие.",
    tradeoff:
      "Тени должны дополнять границы и selected-state. Одних светотеней недостаточно для управления с клавиатуры.",
  },
  {
    id: "instrument",
    name: "Instrument",
    subtitle: "Панель приборов",
    summary: "Чёрное поле, точечные данные, один оранжевый сигнал.",
    source: "Референсы 5 / 6",
    detail:
      "Крупные числа, моноширинные подписи, секции вместо карточки вокруг каждого блока. Боковая навигация превращается в узкую рейку. Точки и сегменты кодируют загрузку и историю.",
    tradeoff:
      "Точечная графика — только для данных. Основной текст остаётся обычным шрифтом; длинные формы требуют более спокойного ритма.",
  },
  {
    id: "porcelain",
    name: "Porcelain",
    subtitle: "Контрастная рамка",
    summary: "Светлый корпус и тёмные рабочие модули с узкими швами.",
    source: "Референсы 3 / 7",
    detail:
      "Навигация уходит наверх, светлая рамка становится частью композиции. Крупный типографический блок ведёт в тёмный мониторинг. Таблица и инспектор объединены в плотную модульную сетку.",
    tradeoff:
      "Светлый корпус и тёмный контент требуют двух согласованных наборов токенов. Нужна отдельная проверка всех overlay и focus states.",
  },
  {
    id: "soft",
    name: "Soft light",
    subtitle: "Мягкий свет",
    summary: "Светлый матовый материал, утопленные поля, синий акцент.",
    source: "Референсы 1 / 3",
    detail:
      "Общий светлый canvas, вертикальная навигация и тактильные элементы. Рельеф сосредоточен на главном действии и переключателях; таблица остаётся плоской и читаемой.",
    tradeoff:
      "Новая светлая палитра — отдельная задача для всего toolkit. Слабый серый текст и исчезающие границы из референса переносить нельзя.",
  },
] as const;

type Direction = (typeof directions)[number]["id"];
type Screen =
  | "overview"
  | "nodes"
  | "settings"
  | "svg"
  | "typography"
  | "layout"
  | "navigation"
  | "controls"
  | "forms"
  | "overlays"
  | "data"
  | "feedback"
  | "charts"
  | "content";
const nodes = [
  {
    name: "Stockholm",
    code: "SE-01",
    endpoint: "sto.edge.local",
    latency: 24,
    load: 62,
    sessions: 128,
    state: "Online",
  },
  {
    name: "Amsterdam",
    code: "NL-02",
    endpoint: "ams.edge.local",
    latency: 31,
    load: 48,
    sessions: 96,
    state: "Online",
  },
  {
    name: "Helsinki",
    code: "FI-03",
    endpoint: "hel.edge.local",
    latency: 18,
    load: 34,
    sessions: 84,
    state: "Online",
  },
  {
    name: "Berlin",
    code: "DE-04",
    endpoint: "ber.edge.local",
    latency: 42,
    load: 0,
    sessions: 0,
    state: "Maintenance",
  },
  {
    name: "London",
    code: "UK-05",
    endpoint: "lon.edge.local",
    latency: 48,
    load: 73,
    sessions: 114,
    state: "Online",
  },
  {
    name: "Oslo",
    code: "NO-06",
    endpoint: "osl.edge.local",
    latency: 22,
    load: 28,
    sessions: 63,
    state: "Online",
  },
];
const traffic = [
  24, 28, 25, 36, 32, 39, 33, 49, 43, 47, 41, 34, 45, 50, 44, 60, 56, 62, 51, 57, 70, 65, 72, 67, 75, 62, 68,
  61, 72, 65, 80, 71, 76, 68, 74, 64, 69, 61, 78, 73, 86, 78, 81, 69, 76, 68, 73, 65,
];
const trafficSamples = traffic.map((value, tick) => ({ value, minute: tick * 30, x: tick * 12 }));
const meterThresholds = Array.from({ length: 20 }, (_, step) => step * 5);
const dotLevels = Array.from({ length: 10 }, (_, step) => step);
const dialAngles = Array.from({ length: 40 }, (_, step) => -126 + step * 6.46);

function Traffic({ dotted, period }: { dotted: boolean; period: string }) {
  const path = traffic
    .map((value, index) => `${index === 0 ? "M" : "L"}${index * 12} ${130 - value}`)
    .join(" ");
  return (
    <>
      {dotted ? (
        <div
          className="rd-dot-chart"
          role="img"
          aria-label={`Demo traffic for ${period}; activity rises toward the end of the period`}
        >
          {trafficSamples.map(({ value, minute }) => (
            <span key={minute}>
              {dotLevels.map((level) => (
                <i key={level} data-lit={level < Math.ceil(value / 9) || undefined} />
              ))}
            </span>
          ))}
        </div>
      ) : (
        <svg
          className="rd-chart"
          viewBox="0 0 570 152"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Demo traffic for ${period}; download activity rises toward the end of the period`}
        >
          {[32, 64, 96, 128].map((y) => (
            <path key={y} d={`M0 ${y}H570`} className="rd-chart-grid" />
          ))}
          <path d={`${path} L564 130 L0 130Z`} fill="currentColor" opacity="0.09" />
          <path d={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path
            d="M0 122 L35 118 L60 124 L95 109 L125 114 L165 100 L190 110 L235 103 L265 116 L310 100 L345 108 L385 93 L420 103 L455 97 L490 109 L530 100 L564 105"
            className="rd-chart-secondary"
          />
        </svg>
      )}
      <div className="rd-chart-axis" aria-hidden="true">
        {(period === "24h"
          ? ["00:00", "06:00", "12:00", "18:00", "23:59"]
          : period === "7d"
            ? ["Mon", "Tue", "Thu", "Sat", "Sun"]
            : ["01 Oct", "08 Oct", "15 Oct", "22 Oct", "30 Oct"]
        ).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </>
  );
}

function Meter({ value }: { value: number }) {
  return (
    <span className="rd-meter" role="img" aria-label={`${value}% load`}>
      {meterThresholds.map((threshold) => (
        <i key={threshold} data-on={threshold < value || undefined} />
      ))}
    </span>
  );
}

function Workspace({
  direction,
  screen,
  setScreen,
  dense,
}: {
  direction: Direction;
  screen: Screen;
  setScreen: (value: Screen) => void;
  dense: boolean;
}) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState(nodes[0]);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("24h");
  const [connected, setConnected] = useState(true);
  const [name, setName] = useState("Northern workspace");
  const [timeout, setTimeoutValue] = useState(30);
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<typeof nodes>([]);
  const allNodes = [...nodes, ...added];
  const onlineCount = allNodes.filter((row) => row.state === "Online").length;
  const filtered = allNodes.filter((row) =>
    `${row.name} ${row.code}`.toLowerCase().includes(query.toLowerCase()),
  );
  const metadata = directions.find((item) => item.id === direction) ?? directions[0];
  const signal = direction.startsWith("signal-");
  const study = screen === "svg" || screen === "typography";
  return (
    <div ref={setTarget} className="rd-provider" data-rk-scope="">
      {target && (
        <RootikProvider
          target={target}
          theme="iris"
          defaults={{
            material: direction === "current" ? "veil" : "solid",
            motion: "system",
            density: dense ? "compact" : "default",
          }}
        >
          <div
            className="rd-app"
            data-direction={direction}
            data-screen={screen}
            data-density={dense ? "compact" : "default"}
          >
            <header className="rd-topbar">
              <button
                type="button"
                className="rd-brand"
                onClick={() => setScreen("overview")}
                aria-label="Rootik home"
              >
                <span className="rd-monogram">
                  <Layers size={19} />
                </span>
                <strong>
                  rootik<span> / edge</span>
                </strong>
              </button>
              <div className="rd-workspace-name">
                {name} <ChevronDown size={13} />
              </div>
              <div className="rd-top-actions">
                <span className="rd-demo">DEMO</span>
                <IconButton
                  icon={<CircleHelp />}
                  label="About this direction"
                  onClick={() => setScreen("settings")}
                />
                <span className="rd-avatar" role="img" aria-label="Alex, demo user">
                  AK
                </span>
              </div>
            </header>
            <aside className="rd-sidebar">
              <div className="rd-sidebar-heading">
                WORKSPACE <span>01</span>
              </div>
              <nav aria-label="Workspace sections">
                {(
                  [
                    { id: "overview", icon: LayoutGrid, label: "Overview" },
                    { id: "nodes", icon: Globe2, label: "Edge nodes" },
                    { id: "settings", icon: SlidersHorizontal, label: "Settings" },
                    { id: "svg", icon: Sparkles, label: "Material lab" },
                    { id: "typography", icon: Type, label: "Typography" },
                  ] as const
                ).map(({ id, icon: Icon, label }) => (
                  <button
                    type="button"
                    key={id}
                    className="rd-nav-item"
                    aria-current={screen === id ? "page" : undefined}
                    onClick={() => setScreen(id)}
                    title={label}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                    {id === "nodes" && <small>{nodes.length + added.length}</small>}
                  </button>
                ))}
              </nav>
              <div className="rd-sidebar-bottom">
                <span className="rd-network-mark">
                  <Wifi size={16} /> All systems normal
                </span>
                <div className="rd-keyhint">
                  <Command size={13} /> Local demo <span>v.01</span>
                </div>
              </div>
            </aside>
            <main className="rd-main">
              <div className="rd-page-head">
                <div>
                  <div className="rd-eyebrow">
                    WORKSPACE /{" "}
                    {screen === "typography"
                      ? "TYPOGRAPHY"
                      : screen === "svg"
                        ? "MATERIALS"
                        : screen === "settings"
                          ? "PREFERENCES"
                          : "MONITORING"}
                  </div>
                  <h1>
                    {screen === "typography"
                      ? "Типографика"
                      : screen === "svg"
                        ? "Material lab"
                        : screen === "overview"
                          ? "Network overview"
                          : screen === "nodes"
                            ? "Edge nodes"
                            : "Workspace settings"}
                    <span className="rd-title-dot">.</span>
                  </h1>
                  <p>
                    {screen === "typography"
                      ? "Кириллица, начертания и ритм интерфейса"
                      : screen === "svg"
                        ? "SVG surfaces / shape, glass and shadow"
                        : screen === "settings"
                          ? "Connection policy and local preferences"
                          : "Your network, at a glance. Everything in its place."}
                  </p>
                </div>
                {!study && (
                  <Button icon={<Plus size={15} />} variant="primary" onClick={() => setAdding(true)}>
                    Add node
                  </Button>
                )}
              </div>
              {screen === "svg" && <SvgLab />}
              {screen === "typography" && (
                <Suspense fallback={<p role="status">Загрузка типографики…</p>}>
                  <TypographyLab />
                </Suspense>
              )}
              {screen !== "settings" && !study && (
                <>
                  <div className="rd-metrics">
                    <Card className="rd-metric" dense>
                      <div className="rd-metric-label">
                        <ArrowDownLeft size={15} /> TRANSFERRED <span>24H</span>
                      </div>
                      <div className="rd-number">
                        128.4<span>GB</span>
                      </div>
                      <div className="rd-metric-foot">
                        <span className="rd-trend">
                          <ArrowUpRight size={13} /> 12.8%
                        </span>
                        <span>vs. yesterday</span>
                      </div>
                      <div className="rd-mini-bars" aria-hidden="true">
                        {trafficSamples.slice(0, 22).map(({ value, minute }) => (
                          <i key={minute} style={{ height: `${value}%` }} />
                        ))}
                      </div>
                    </Card>
                    <Card className="rd-metric" dense>
                      <div className="rd-metric-label">
                        <Gauge size={15} /> AVG. LATENCY <span>LIVE</span>
                      </div>
                      <div className="rd-number">
                        24<span>ms</span>
                      </div>
                      <div className="rd-metric-foot">
                        <span className="rd-trend">−4 ms</span>
                        <span>stable connection</span>
                      </div>
                      <Meter value={35} />
                    </Card>
                    <Card className="rd-metric" dense>
                      <div className="rd-metric-label">
                        <Globe2 size={15} /> EDGE NODES <span>EU</span>
                      </div>
                      <div className="rd-number">
                        {String(onlineCount).padStart(2, "0")}
                        <span>/ {String(allNodes.length).padStart(2, "0")}</span>
                      </div>
                      <div className="rd-metric-foot">
                        <span className="rd-status-dot" /> <span>1 in maintenance</span>
                      </div>
                      <div
                        className="rd-node-dots"
                        role="img"
                        aria-label={`${onlineCount} online nodes, one in maintenance`}
                      >
                        {allNodes.map((node) => (
                          <i key={node.code} data-off={node.state !== "Online" || undefined} />
                        ))}
                      </div>
                    </Card>
                  </div>
                  {screen === "overview" && (
                    <Card
                      className="rd-traffic"
                      title="Traffic activity"
                      actions={
                        <SegmentedControl
                          aria-label="Traffic period"
                          value={period}
                          onChange={setPeriod}
                          size="sm"
                          options={[
                            { value: "24h", label: "24h" },
                            { value: "7d", label: "7d" },
                            { value: "30d", label: "30d" },
                          ]}
                        />
                      }
                    >
                      <div className="rd-traffic-meta">
                        <span>
                          <i /> Download{" "}
                          <strong>
                            {period === "24h" ? "128.4 GB" : period === "7d" ? "862.1 GB" : "3.68 TB"}
                          </strong>
                        </span>
                        <span>
                          Upload{" "}
                          <strong>
                            {period === "24h" ? "18.2 GB" : period === "7d" ? "126.4 GB" : "542.0 GB"}
                          </strong>
                        </span>
                        <span className="rd-chart-note">DEMO / {period.toUpperCase()}</span>
                      </div>
                      <Traffic dotted={direction === "instrument" || signal} period={period} />
                    </Card>
                  )}
                  <Card
                    className="rd-node-table"
                    title="Edge nodes"
                    description={`${filtered.length} locations in your workspace`}
                    actions={
                      <Input
                        size="sm"
                        aria-label="Filter nodes"
                        placeholder="Find a node…"
                        icon={<Search size={14} />}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    }
                    padding="none"
                  >
                    <DataTable
                      aria-label="Edge nodes"
                      rows={filtered}
                      rowKey={(row) => row.code}
                      selectedKey={selected?.code}
                      onRowClick={setSelected}
                      columns={[
                        {
                          key: "name",
                          header: "LOCATION",
                          sortable: true,
                          cell: (row) => (
                            <span className="rd-location">
                              <span className="rd-location-icon">
                                <Globe2 size={15} />
                              </span>
                              <span>
                                {row.name}
                                <small>{row.code}</small>
                              </span>
                            </span>
                          ),
                        },
                        {
                          key: "latency",
                          header: "LATENCY",
                          sortable: true,
                          cell: (row) => (
                            <span className="rd-cell-latency">
                              <AudioLines size={13} /> {row.latency} <small>ms</small>
                            </span>
                          ),
                        },
                        {
                          key: "load",
                          header: "LOAD",
                          cell: (row) => (
                            <span className="rd-load-cell">
                              <Meter value={row.load} />
                              <small>{row.load}%</small>
                            </span>
                          ),
                        },
                        { key: "sessions", header: "SESSIONS", align: "end", sortable: true },
                        {
                          key: "state",
                          header: "STATUS",
                          cell: (row) => (
                            <Badge size="sm" dot tone={row.state === "Online" ? "success" : "neutral"}>
                              {row.state}
                            </Badge>
                          ),
                        },
                      ]}
                    />
                    {filtered.length === 0 && <p className="rd-empty">No matching nodes</p>}
                    <div className="rd-table-footer">
                      <span>Click a location to inspect</span>
                      <span>
                        Last sync just now <Check size={12} />
                      </span>
                    </div>
                  </Card>
                </>
              )}
              {screen === "settings" && (
                <div className="rd-settings-grid">
                  <Card title="Connection policy" description="Local demo — changes stay in this preview.">
                    <Form onSubmit={() => setSaved(true)}>
                      <div className="rd-form-stack">
                        <Field label="Workspace name">
                          <Input
                            value={name}
                            onChange={(event) => {
                              setName(event.target.value);
                              setSaved(false);
                            }}
                            required
                          />
                        </Field>
                        <Slider
                          label="Connection timeout"
                          value={timeout}
                          onChange={(value) => {
                            setTimeoutValue(value);
                            setSaved(false);
                          }}
                          min={5}
                          max={120}
                          showValue={(value) => `${value} sec`}
                        />
                        <Switch
                          label="Reconnect automatically"
                          description="Restore the session after a connection drop"
                          defaultChecked
                        />
                        <Switch label="Launch on startup" description="Open the workspace with your device" />
                        <div className="rd-form-actions">
                          <Button type="submit" variant="primary" icon={<Check size={15} />}>
                            Save changes
                          </Button>
                          <output aria-live="polite">
                            {saved ? "Changes saved locally" : "Demo preferences"}
                          </output>
                        </div>
                      </div>
                    </Form>
                  </Card>
                  <Card title={metadata.name} description={metadata.subtitle}>
                    <p className="rd-direction-copy">{metadata.detail}</p>
                    <p className="rd-direction-copy rd-muted">{metadata.tradeoff}</p>
                  </Card>
                </div>
              )}
            </main>
            <aside className="rd-inspector" aria-label="Node inspector">
              <div className="rd-inspector-title">
                NODE INSPECTOR <Settings2 size={15} />
              </div>
              <div className="rd-connection-orb" data-connected={connected}>
                {signal ? (
                  <>
                    <svg
                      className="rd-signal-dial"
                      viewBox="0 0 120 120"
                      role="img"
                      aria-label={`Node load: ${selected?.load ?? 0}%`}
                    >
                      {dialAngles.map((angle, index) => (
                        <path
                          key={angle}
                          d="M60 7V16"
                          transform={`rotate(${angle} 60 60)`}
                          data-lit={index < (selected?.load ?? 0) / 2.5 || undefined}
                        />
                      ))}
                    </svg>
                    <div className="rd-dial-readout">
                      <span>
                        {selected?.load ?? 0}
                        <small>%</small>
                      </span>
                      <span>NODE LOAD</span>
                    </div>
                  </>
                ) : (
                  <Globe2 size={45} strokeWidth={1} />
                )}
                <span />
              </div>
              <h2>
                {selected?.name ?? "Stockholm"}
                <span>{selected?.code ?? "SE-01"} / EUROPE NORTH</span>
              </h2>
              <div className="rd-connected">
                <i data-connected={connected} />
                {connected ? "Connected" : "Disconnected"}
              </div>
              <Button
                className="rd-connect"
                icon={<Power size={15} />}
                onClick={() => setConnected(!connected)}
                block
              >
                {connected ? "Disconnect" : "Connect"}
              </Button>
              <dl className="rd-properties">
                <div>
                  <dt>Protocol</dt>
                  <dd>Hysteria 2</dd>
                </div>
                <div>
                  <dt>Endpoint</dt>
                  <dd>{selected?.endpoint}</dd>
                </div>
                <div>
                  <dt>Latency</dt>
                  <dd>{selected?.latency} ms</dd>
                </div>
                <div>
                  <dt>Session</dt>
                  <dd>{connected ? "02:14:38" : "—"}</dd>
                </div>
              </dl>
              <div className="rd-capacity">
                <div>
                  <span>Node capacity</span>
                  <strong>{selected?.load}%</strong>
                </div>
                <Progress value={selected?.load ?? 0} aria-label="Node capacity" />
              </div>
              <div className="rd-quick-policy">
                <Switch size="sm" label="Auto reconnect" defaultChecked />
                <Switch size="sm" label="Route DNS securely" defaultChecked />
              </div>
              <div className="rd-secure-note">
                <ShieldCheck size={16} />
                <span>
                  End-to-end encrypted<small>Traffic stays private</small>
                </span>
              </div>
            </aside>
            <footer className="rd-statusbar">
              <span>
                <span className="rd-status-dot" />{" "}
                {connected ? "Secure tunnel active" : "Tunnel disconnected"}
              </span>
              <span>
                <Terminal size={12} /> Demo data{" "}
                <span className="rd-status-platform">/ Desktop workspace</span>
              </span>
            </footer>
            {adding && (
              <Dialog
                title="Add an edge node"
                description="Adds a sample node to this local preview."
                onClose={() => setAdding(false)}
                size="sm"
              >
                <Form
                  onSubmit={(values) => {
                    const nodeName = String(values.get("locationName") ?? "").trim();
                    if (!nodeName) return;
                    const next = {
                      name: nodeName,
                      code: `EU-${added.length + 7}`,
                      endpoint: "new.edge.local",
                      latency: 28,
                      load: 12,
                      sessions: 0,
                      state: "Online",
                    };
                    setAdded([...added, next]);
                    setSelected(next);
                    setAdding(false);
                  }}
                >
                  <div className="rd-form-stack">
                    <Field label="Location name">
                      <Input name="locationName" required placeholder="Copenhagen" />
                    </Field>
                    <Button type="submit" variant="primary">
                      Add node
                    </Button>
                  </div>
                </Form>
              </Dialog>
            )}
          </div>
        </RootikProvider>
      )}
    </div>
  );
}

export function DesignLab() {
  const initial = new URLSearchParams(window.location.search).get("direction");
  const [direction, setDirection] = useState<Direction>(
    directions.find((item) => item.id === initial)?.id ?? "signal-light",
  );
  const [screen, setScreen] = useState<Screen>(() => {
    const requested = new URLSearchParams(window.location.search).get("screen");
    return requested === "svg" ||
      requested === "typography" ||
      requested === "layout" ||
      requested === "navigation" ||
      requested === "controls" ||
      requested === "forms" ||
      requested === "overlays" ||
      requested === "data" ||
      requested === "feedback" ||
      requested === "charts" ||
      requested === "content"
      ? requested
      : "overview";
  });
  const [compare, setCompare] = useState(false);
  const [reference, setReference] = useState("paired");
  const [dense, setDense] = useState(false);
  const [notes, setNotes] = useState(true);
  const metadata = directions.find((item) => item.id === direction) ?? directions[0];
  const signal = direction.startsWith("signal-");
  const referenceDirection: Direction =
    reference === "paired"
      ? direction === "signal-light"
        ? "signal-dark"
        : "signal-light"
      : reference === "soft"
        ? "soft"
        : reference === "instrument"
          ? "instrument"
          : "current";
  const referenceMetadata = directions.find((item) => item.id === referenceDirection) ?? directions[0];
  return (
    <div className="rd-lab" data-study="signal">
      <header className="rd-lab-header">
        <div>
          <span className="rd-lab-wordmark">
            ROOTIK <span>SIGNAL / DESIGN STUDY</span>
          </span>
          <h1>
            Мягкая форма.
            <br />
            Точные данные.
          </h1>
          <p>Soft light × Instrument · одна система, светлая и тёмная темы.</p>
        </div>
        <div className="rd-lab-index">
          <span>EXPLORATION / OCT 2026</span>
          <strong>
            Soft form. Clear signal.<span>↗</span>
          </strong>
          <small>Живые компоненты · демонстрационные данные</small>
        </div>
      </header>
      <nav className="rd-direction-picker" data-primary="" aria-label="Design direction">
        {directions
          .filter((item) => item.id.startsWith("signal-"))
          .map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={direction === item.id}
              onClick={() => setDirection(item.id)}
              data-direction={item.id}
            >
              <span className="rd-direction-swatch" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>
                <small>{item.source}</small>
                <strong>{item.name}</strong>
                <span>{item.subtitle}</span>
              </span>
              <ChevronRight size={17} />
            </button>
          ))}
      </nav>
      <details className="rd-history">
        <summary>Предыдущие направления</summary>
        <nav aria-label="Previous directions">
          {directions
            .filter((item) => !item.id.startsWith("signal-"))
            .map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setDirection(item.id)}
                aria-pressed={direction === item.id}
              >
                {item.name}
              </button>
            ))}
        </nav>
      </details>
      <div className="rd-lab-toolbar">
        <fieldset className="rd-view-picker" aria-label="Preview screen">
          {(
            [
              { id: "overview", label: "Обзор" },
              { id: "nodes", label: "Таблица" },
              { id: "settings", label: "Настройки" },
              { id: "svg", label: "SVG / материалы" },
              { id: "typography", label: "Типографика" },
              { id: "layout", label: "Layout / модуль" },
              { id: "navigation", label: "Navigation / модуль" },
              { id: "controls", label: "Controls / модуль" },
              { id: "forms", label: "Forms / модуль" },
              { id: "overlays", label: "Overlays / модуль" },
              { id: "data", label: "Data / модуль" },
              { id: "feedback", label: "Feedback / модуль" },
              { id: "charts", label: "Charts / модуль" },
              { id: "content", label: "Content / модуль" },
            ] as const
          ).map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={screen === item.id}
              onClick={() => setScreen(item.id)}
            >
              {item.label}
            </button>
          ))}
        </fieldset>
        <div className="rd-lab-options">
          <label>
            <input type="checkbox" checked={dense} onChange={(event) => setDense(event.target.checked)} />
            Плотнее
          </label>
          <label>
            <input
              type="checkbox"
              checked={compare && screen !== "overlays"}
              disabled={screen === "overlays"}
              onChange={(event) => setCompare(event.target.checked)}
            />
            Сравнить
          </label>
          {compare && screen !== "overlays" && (
            <label className="rd-compare-select">
              С чем
              <select
                aria-label="Comparison reference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              >
                <option value="paired">Другой темой</option>
                <option value="soft">Soft light</option>
                <option value="instrument">Instrument</option>
                <option value="current">Current Rootik</option>
              </select>
            </label>
          )}
          <button type="button" aria-pressed={notes} onClick={() => setNotes(!notes)}>
            <span>Заметки</span>
            {notes ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>
      <div className="rd-preview-grid" data-compare={(compare && screen !== "overlays") || undefined}>
        {compare && screen !== "overlays" && referenceDirection !== direction && (
          <section className="rd-preview">
            <div className="rd-preview-caption">
              <span>BASELINE</span>
              <strong>{referenceMetadata.name}</strong>
              <small>{referenceMetadata.subtitle}</small>
            </div>
            {screen === "content" ? (
              <Suspense fallback={<p role="status">Загрузка content…</p>}>
                <ContentModule mode={referenceDirection === "signal-dark" ? "dark" : "light"} />
              </Suspense>
            ) : screen === "charts" ? (
              <Suspense fallback={<p role="status">Загрузка charts…</p>}>
                <ChartsModule mode={referenceDirection === "signal-dark" ? "dark" : "light"} />
              </Suspense>
            ) : screen === "feedback" ? (
              <Suspense fallback={<p role="status">Загрузка feedback…</p>}>
                <FeedbackModule mode={referenceDirection === "signal-dark" ? "dark" : "light"} />
              </Suspense>
            ) : screen === "data" ? (
              <Suspense fallback={<p role="status">Загрузка data…</p>}>
                <DataModule mode={referenceDirection === "signal-dark" ? "dark" : "light"} />
              </Suspense>
            ) : screen === "forms" ? (
              <Suspense fallback={<p role="status">Загрузка forms…</p>}>
                <FormsModule />
              </Suspense>
            ) : screen === "controls" ? (
              <Suspense fallback={<p role="status">Загрузка controls…</p>}>
                <ControlsModule />
              </Suspense>
            ) : screen === "navigation" ? (
              <Suspense fallback={<p role="status">Загрузка navigation…</p>}>
                <NavigationModule />
              </Suspense>
            ) : screen === "layout" ? (
              <Suspense fallback={<p role="status">Загрузка layout…</p>}>
                <LayoutModule />
              </Suspense>
            ) : (
              <Workspace direction={referenceDirection} screen={screen} setScreen={setScreen} dense={dense} />
            )}
          </section>
        )}
        <section className="rd-preview">
          <div className="rd-preview-caption">
            <span>{direction === "current" ? "BASELINE" : "DIRECTION"}</span>
            <strong>{metadata.name}</strong>
            <small>
              {screen === "content"
                ? "Публичный rootik/content · текст, код, данные и медиа"
                : screen === "charts"
                  ? "Публичный rootik/charts · SVG-графики, шкалы и точные значения"
                  : screen === "feedback"
                    ? "Публичный rootik/feedback · статусы, прогресс и состояния"
                    : screen === "data"
                      ? "Публичный rootik/data · таблицы, деревья и коллекции"
                      : screen === "overlays"
                        ? "Публичный rootik/overlays · нативный верхний слой и SVG-материал"
                        : screen === "forms"
                          ? "Публичный rootik/forms · поля, валидация и схемные формы"
                          : screen === "controls"
                            ? "Публичный rootik/controls · нативное поведение и SVG-контуры"
                            : screen === "navigation"
                              ? "Публичный rootik/navigation · маршруты, вкладки и меню"
                              : screen === "layout"
                                ? "Публичный rootik/layout · реальные компоненты и токены тулкита"
                                : screen === "typography"
                                  ? "Шрифты с кириллицей · живые контролы · настоящие начертания"
                                  : screen === "svg"
                                    ? "Нейтральный холст · шесть палитр материала и состояний"
                                    : metadata.summary}
            </small>
          </div>
          {screen === "content" ? (
            <Suspense fallback={<p role="status">Загрузка content…</p>}>
              <ContentModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : screen === "charts" ? (
            <Suspense fallback={<p role="status">Загрузка charts…</p>}>
              <ChartsModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : screen === "feedback" ? (
            <Suspense fallback={<p role="status">Загрузка feedback…</p>}>
              <FeedbackModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : screen === "data" ? (
            <Suspense fallback={<p role="status">Загрузка data…</p>}>
              <DataModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : screen === "overlays" ? (
            <Suspense fallback={<p role="status">Загрузка overlays…</p>}>
              <OverlaysModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : screen === "forms" ? (
            <Suspense fallback={<p role="status">Загрузка forms…</p>}>
              <FormsModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : screen === "controls" ? (
            <Suspense fallback={<p role="status">Загрузка controls…</p>}>
              <ControlsModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : screen === "navigation" ? (
            <Suspense fallback={<p role="status">Загрузка navigation…</p>}>
              <NavigationModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : screen === "layout" ? (
            <Suspense fallback={<p role="status">Загрузка layout…</p>}>
              <LayoutModule
                mode={direction === "signal-dark" ? "dark" : "light"}
                onModeChange={(mode) => setDirection(mode === "dark" ? "signal-dark" : "signal-light")}
              />
            </Suspense>
          ) : (
            <Workspace
              key={signal ? "signal" : direction}
              direction={direction}
              screen={screen}
              setScreen={setScreen}
              dense={dense}
            />
          )}
        </section>
      </div>
      {notes && (
        <section className="rd-lab-notes">
          <div>
            <span className="rd-note-label">ИДЕЯ</span>
            <h2>
              {screen === "content"
                ? "Девятый модуль: content"
                : screen === "charts"
                  ? "Восьмой модуль: charts"
                  : screen === "feedback"
                    ? "Седьмой модуль: feedback"
                    : screen === "data"
                      ? "Шестой модуль: data"
                      : screen === "overlays"
                        ? "Пятый модуль: overlays"
                        : screen === "forms"
                          ? "Четвёртый модуль: forms"
                          : screen === "controls"
                            ? "Третий модуль: controls"
                            : screen === "navigation"
                              ? "Второй модуль: navigation"
                              : screen === "layout"
                                ? "Первый модуль нового тулкита"
                                : screen === "typography"
                                  ? "Типографика держит иерархию"
                                  : screen === "svg"
                                    ? "Материал следует форме"
                                    : metadata.subtitle}
            </h2>
            <p>
              {screen === "content"
                ? "Card и Disclosure задают SVG-материал вокруг текста, редактирования, данных и медиа. Содержимое остаётся нативным и сохраняет состояние."
                : screen === "charts"
                  ? "ChartPanel объединяет графики общим материалом. Категориальные цвета сохраняют порядок, подписи и таблицы показывают точные значения."
                  : screen === "feedback"
                    ? "Метки, шкалы, загрузка и сообщения используют общий SVG-материал. Подписи, числовые значения и действия сохраняют смысл без цвета и анимации."
                    : screen === "data"
                      ? "Таблицы, деревья и списки используют общий материал. Контур находится снаружи прокрутки: строки, закреплённые колонки и виртуализация сохраняют свою геометрию."
                      : screen === "overlays"
                        ? "Dialog, Drawer, Popover, Tooltip, HoverCard, Toast, Confirm/Prompt, CommandPalette и ShortcutsSheet используют общий SVG-материал, сохраняя нативные элементы и фокус."
                        : screen === "forms"
                          ? "Field, Form, Fieldset, SettingsGroup/Row и SchemaForm используют один материал. SVG меняет форму в пределах отступов; подписи, ошибки и нативные элементы остаются на месте."
                          : screen === "controls"
                            ? "Кнопки, поля, выборы, слайдеры, дата и цвет собраны в rootik/controls. SVG меняет только оформление; нативные элементы сохраняют фокус, значения и размеры."
                            : screen === "navigation"
                              ? "Sidebar, dock, ссылки, вкладки, сегменты и меню используют общие токены. Маршрут, вкладка и локальное представление разделены."
                              : screen === "layout"
                                ? "AppShell, страницы, панели, бары и SVG-поверхности вынесены в rootik/layout. Палитры и шрифтовые роли доступны через RootikProvider и Scope."
                                : screen === "typography"
                                  ? "Системный стек без загрузки файлов, Rubik и Onest — разные направления основного UI. JetBrains Mono — для технических данных, Literata — для выразительных заголовков."
                                  : screen === "svg"
                                    ? "Шесть палитр в светлой и тёмной теме: Cobalt, Albedo, Makima, Miyabi, Hoshino и Maomao. Основной холст нейтрален; характер темы задают поверхности и действия. SVG-кромка показывает фокус без внешней прямоугольной рамки."
                                    : metadata.detail}
            </p>
          </div>
          <div>
            <span className="rd-note-label">ЦЕНА РЕШЕНИЯ</span>
            <p>
              {screen === "content"
                ? "Старые импорты совместимы. Светлая тема использует отдельные цвета синтаксиса. Контуры, скругления и анимация отключаются независимо. Изображения и QR остаются данными, а не декорацией."
                : screen === "charts"
                  ? "Старые импорты совместимы. Анимация линии и световой проход включаются отдельно; оси, фокус и значения остаются на месте. SVG Off отключает украшения, сохраняя графики данных."
                  : screen === "feedback"
                    ? "Старые импорты совместимы. Декоративные эффекты отключаются отдельно от реальной загрузки. Повтор индикаторов: цикл, один раз или выключено. Фон и числовые значения не зависят от анимации."
                    : screen === "data"
                      ? "Старые импорты и модели данных сохранены. SVG измеряется на контейнере, а не на каждой строке. Эффекты действий проигрываются один раз и отключаются вместе с Motion или SVG."
                      : screen === "overlays"
                        ? "Старые импорты сохранены. Подложка не заменяет содержимое; SVG, эффекты и анимации отключаются независимо. Глобальные ConfirmHost и Toaster монтируются один раз, поэтому сравнение двух экземпляров отключено."
                        : screen === "forms"
                          ? "Существующие API и импорты сохранены. Валидация, отключённые секции и переводы работают через прежние контракты; SVG и анимации подключаются опционально."
                          : screen === "controls"
                            ? "Старые импорты сохранены. Field отделён от контролов; оформление поставляется через controls/styles.css, без runtime-зависимостей."
                            : screen === "navigation"
                              ? "Старые импорты сохранены. Контекст оболочки отделён от AppShell, CSS поставляется отдельным входом navigation/styles.css."
                              : screen === "layout"
                                ? "Старые импорты сохранены. Все группы уже перенесены; общий default остаётся совместимым до проверки нативных платформ."
                                : screen === "typography"
                                  ? "Файлы открытых шрифтов подключены локально и только в лаборатории. Итоговый набор выбираем по читаемости кириллицы и устойчивости размеров, а не по названию семейства."
                                  : screen === "svg"
                                    ? "Стекло использует обрезку по SVG-пути и backdrop blur. Перед переносом в библиотеку нужны замеры WebView и проверка контраста на разных фонах."
                                    : metadata.tradeoff}
            </p>
          </div>
          <div>
            <span className="rd-note-label">ЧТО ПРОВЕРИТЬ</span>
            <p>
              {screen === "content"
                ? "Переименуй профиль, измени код, раскрой параметры и JSON. Отфильтруй журнал, выбери SVG-обложку и открой Lightbox. Проверь SVG Off, Fluent и мобильную ширину."
                : screen === "charts"
                  ? "Переключи график в таблицу, сузь диапазон brush, пройди heatmap и tracker стрелками. Сравни светлую и тёмную темы, SVG Off, Fluent и мобильную ширину."
                  : screen === "feedback"
                    ? "Проверь завершение и сброс прогресса, инертность при обновлении, удаление метки, уведомления, повтор ошибки, пустое состояние и отключение SVG/анимаций."
                    : screen === "data"
                      ? "Проверь сортировку, выбор диапазона через Shift, закрепление первой колонки, дерево с клавиатуры, перестановку Space/стрелки и прокрутку 10 000 строк. Затем отключи SVG и анимацию."
                      : screen === "overlays"
                        ? "Проверь Escape, возврат фокуса, вложенный popover, фильтрацию и Enter в командах, проверку prompt, уведомление поверх диалога, обе темы и мобильную ширину."
                        : screen === "forms"
                          ? "Отправь пустую форму, исправь ошибки, сбрось значения, отключи секцию, проверь вложенные настройки и схемную форму. Затем сравни SVG, Fluent и мобильную ширину."
                          : screen === "controls"
                            ? "Проверь SVG и Fluent, ошибку и фокус, ввод и очистку, стрелки в select и NumberInput, метки и мобильную ширину."
                            : screen === "navigation"
                              ? "Проверь стрелки и Home/End во вкладках, native radio в сегментах, Escape и возврат фокуса в меню, отключённые ссылки и мобильный drawer."
                              : screen === "layout"
                                ? "Переключи палитру, форму, шрифт и режим. Проверь поле, безопасные отступы и мобильный drawer."
                                : screen === "typography"
                                  ? "Сравни одинаковый текст во всех семействах, плотную таблицу, цифры и настоящий курсив. Переключи тему, увеличь текст до 16 px и проверь длинную русскую подпись."
                                  : screen === "svg"
                                    ? "Выбери палитру, форму и рисунок фона. Сравни четыре SVG-кромки у кнопок, инпутов и иконок. Проверь размеры, фокус, ошибки и отключённые состояния в обеих темах."
                                    : "Переключи экран на таблицу и настройки. Выбери строку, отфильтруй узлы, открой Add node. Оцени выбранное состояние, поле ввода, фокус и плотность."}
            </p>
          </div>
        </section>
      )}
      <footer className="rd-lab-footer">
        <span>ROOTIK / VISUAL RESEARCH</span>
        <span>
          {[
            "layout",
            "navigation",
            "controls",
            "forms",
            "overlays",
            "data",
            "feedback",
            "charts",
            "content",
          ].includes(screen)
            ? "Все группы входят в библиотеку. Проверены импорты, темы и браузерный клиент; нативные платформы остаются отдельной проверкой."
            : screen === "typography"
              ? "System, Rubik и Onest доступны в библиотеке. Моноширинная и акцидентная роли настраиваются отдельно; локальные шрифты подключаются опционально."
              : screen === "svg"
                ? "SVG-примитивы доступны в ките. Палитры остаются экспериментальными."
                : "Изолированные прототипы. Действующий дизайн библиотеки не меняется."}
        </span>
      </footer>
    </div>
  );
}
