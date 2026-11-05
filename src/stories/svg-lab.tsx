import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Plus,
  Power,
  ScanLine,
  Search,
  Settings2,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  Button,
  Field,
  IconButton,
  Input,
  Select,
  Slider,
  SVG_ARTWORKS,
  SVG_CONTROL_BORDERS,
  SvgArtwork,
  type SvgArtworkVariant,
  SvgBackdrop,
  type SvgEdge,
  type SvgPattern,
  type SvgShape,
  SvgSurface,
  Switch,
} from "..";
import { type SvgPaletteId, svgPalettes } from "./svg-palettes";
import "../../.ladle/svg-lab.css";

const materials = [
  {
    id: "ceramic",
    shape: "saddle",
    edge: "top",
    name: "Sculpted ceramic",
    label: "Седловина",
    copy: "Верхняя выемка под статус, заголовок или ручку панели.",
    code: "01 / SADDLE",
  },
  {
    id: "glass",
    shape: "rounded",
    edge: "top",
    name: "Quiet glass",
    label: "Скругление",
    copy: "Спокойная базовая плоскость для таблиц и длинных форм.",
    code: "02 / ROUND",
  },
  {
    id: "contour",
    shape: "scoop",
    edge: "left",
    name: "Contour strata",
    label: "Боковая выемка",
    copy: "Мягкая выемка и тонкий обвод для связанных модулей.",
    code: "03 / SCOOP",
  },
  {
    id: "machined",
    shape: "step",
    edge: "bottom",
    name: "Machined shell",
    label: "Ступенька",
    copy: "Локальная ступенька под действие, метку или стык панелей.",
    code: "04 / STEP",
  },
  {
    id: "bevel",
    shape: "bevel",
    edge: "right",
    name: "Beveled slot",
    label: "Фаска",
    copy: "Прямой срез с наклонными плечами для приборных блоков.",
    code: "05 / BEVEL",
  },
  {
    id: "ticket",
    shape: "ticket",
    edge: "left",
    name: "Linked ticket",
    label: "Парные вырезы",
    copy: "Симметричные выемки обозначают связь двух сторон панели.",
    code: "06 / TICKET",
  },
  {
    id: "wave",
    shape: "wave",
    edge: "bottom",
    name: "Wave edge",
    label: "Волна",
    copy: "Три спокойных изгиба в декоративной полосе отступа.",
    code: "07 / WAVE",
  },
  {
    id: "corner",
    shape: "corner",
    edge: "top",
    name: "Cut corners",
    label: "Срезанные углы",
    copy: "Четыре фаски для компактных инструментальных секций.",
    code: "08 / CORNER",
  },
] as const satisfies readonly {
  id: string;
  shape: SvgShape;
  edge: SvgEdge;
  name: string;
  label: string;
  copy: string;
  code: string;
}[];
type Material = (typeof materials)[number]["id"];

interface SurfaceSettings {
  bend: number;
  position: number;
  span: number;
  padding: number;
  opacity: number;
  depth: number;
  edge: SvgEdge;
  contours: boolean;
  wireframe: boolean;
  safeArea: boolean;
}

function Surface({
  material,
  settings,
  children,
  className,
}: {
  material: Material;
  settings: SurfaceSettings;
  children: ReactNode;
  className?: string;
}) {
  const selected = materials.find((item) => item.id === material) ?? materials[0];
  return (
    <SvgSurface
      shape={selected.shape}
      edge={settings.edge}
      depth={settings.bend / 100}
      position={settings.position / 100}
      span={settings.span / 100}
      padding={settings.padding}
      opacity={settings.opacity / 100}
      shadow={settings.depth / 20}
      contours={settings.contours || material === "contour"}
      wireframe={settings.wireframe}
      showSafeArea={settings.safeArea}
      className={className}
    >
      {children}
    </SvgSurface>
  );
}

const backgroundLines = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function CustomBackdrop({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-ribbon`} x2="1" y2="1">
          <stop stopColor="currentColor" stopOpacity=".15" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M -20 330 C 200 330 120 -100 450 80 S 550 500 680 200"
        fill="none"
        stroke={`url(#${id}-ribbon)`}
        strokeWidth="70"
      />
      {backgroundLines.map((i) => (
        <path
          key={i}
          d={`M -30 ${220 + i * 14} C 180 ${400 - i * 8} 370 ${-80 + i * 10} 630 ${100 + i * 16}`}
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
          opacity=".12"
        />
      ))}
    </svg>
  );
}

export function SvgLab() {
  const [material, setMaterial] = useState<Material>("ceramic");
  const [bend, setBend] = useState(62);
  const [position, setPosition] = useState(50);
  const [palette, setPalette] = useState<SvgPaletteId>(() => {
    const value =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("palette") : null;
    return svgPalettes.find((item) => item.id === value)?.id ?? "cobalt";
  });
  const [pattern, setPattern] = useState("dots");
  const [depth, setDepth] = useState(12);
  const [opacity, setOpacity] = useState(72);
  const [contours, setContours] = useState(false);
  const [safeArea, setSafeArea] = useState(false);
  const [edge, setEdge] = useState<SvgEdge>("top");
  const [span, setSpan] = useState(32);
  const [padding, setPadding] = useState(44);
  const [artwork, setArtwork] = useState<SvgArtworkVariant>("orbits");
  const [animated, setAnimated] = useState(true);
  const [patternOpacity, setPatternOpacity] = useState(28);
  const [spacing, setSpacing] = useState(20);
  const [wireframe, setWireframe] = useState(false);
  const [connected, setConnected] = useState(true);
  const [applied, setApplied] = useState(false);
  const [controlActive, setControlActive] = useState(false);
  const settings = { bend, position, depth, opacity, contours, wireframe, safeArea, edge, span, padding };
  const selected = materials.find((item) => item.id === material) ?? materials[0];
  const selectedPalette = svgPalettes.find((item) => item.id === palette) ?? svgPalettes[0];
  return (
    <div className="rx-lab" data-palette={palette} data-pattern={pattern}>
      <div className="rx-intro">
        <span>
          <ScanLine size={15} /> ROOTIK / MATERIAL STUDY
        </span>
        <p>Шесть палитр. Цвета с отдельными ролями. SVG-кромки в масштабе интерфейса.</p>
      </div>
      <div className="rx-theme-bar">
        <fieldset aria-label="Material palette">
          {svgPalettes.map(({ id, name, copy }) => (
            <button
              key={id}
              type="button"
              className="rx-theme-choice"
              data-palette={id}
              aria-label={name}
              aria-pressed={palette === id}
              onClick={() => setPalette(id)}
            >
              <span className="rx-theme-chips" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>
                {name}
                <small>{copy}</small>
              </span>
            </button>
          ))}
        </fieldset>
        <span>06 PALETTES / 02 MODES</span>
      </div>
      <section className="rx-color-study" aria-label="Palette roles">
        <div>
          <span className="rx-overline">{selectedPalette.name.toUpperCase()} / COLOR ROLES</span>
          <h2>{selectedPalette.name}</h2>
          <p>{selectedPalette.description}</p>
        </div>
        <div className="rx-color-roles">
          {[
            ["ink", "Действие"],
            ["secondary", "Связи"],
            ["detail", "Детали"],
            ["paper", "Материал"],
            ["graphite", "Текст"],
          ].map(([role, label]) => (
            <div key={role} data-role={role}>
              <i />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="rx-workbench">
        <div className="rx-stage">
          <SvgBackdrop
            pattern={pattern === "plain" || pattern === "custom" ? "none" : (pattern as SvgPattern)}
            spacing={spacing}
            opacity={patternOpacity / 100}
            animated={animated}
          >
            {pattern === "custom" ? ({ id }) => <CustomBackdrop id={id} /> : null}
          </SvgBackdrop>
          <div className="rx-stage-caption">
            <span>{selected.code}</span>
            <span>{palette.toUpperCase()} / MATERIAL 01</span>
          </div>
          <Surface material={material} settings={settings} className="rx-hero">
            <div className="rx-card-top">
              <span>
                <Layers size={16} /> ROOTIK / SIGNAL
              </span>
              <span className="rx-live" data-active={connected}>
                <i /> {connected ? "ACTIVE" : "STANDBY"}
              </span>
            </div>
            <div className="rx-hero-middle">
              <div>
                <span className="rx-overline">NORTHERN GATEWAY</span>
                <h2>
                  Quiet, by
                  <br />
                  <em>design.</em>
                </h2>
                <p>{selected.label}</p>
              </div>
              <div className="rx-orbit" aria-hidden="true">
                <SvgArtwork
                  variant={artwork}
                  motion={animated ? (artwork === "orbits" ? "orbit" : "drift") : "off"}
                />
                <span>
                  rk<span>®</span>
                </span>
              </div>
            </div>
            <div className="rx-hero-footer">
              <div>
                <ArrowDownLeft size={14} />
                <strong>
                  128.4 <small>GB</small>
                </strong>
              </div>
              <div>
                <ArrowUpRight size={14} />
                <strong>
                  24 <small>ms</small>
                </strong>
              </div>
              <Button
                svgBorder="cut"
                icon={<Power size={15} />}
                variant="primary"
                onClick={() => setConnected(!connected)}
              >
                {connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </Surface>
          <div className="rx-stage-bottom">
            <span>{selected.name}</span>
            <span>HTML controls / SVG surface</span>
          </div>
        </div>
        <aside className="rx-controls" aria-label="SVG material controls">
          <div className="rx-controls-head">
            <ScanLine size={15} />
            <h2>Свойства материала</h2>
          </div>
          <Field label="Рисунок фона">
            <Select
              value={pattern}
              onChange={setPattern}
              options={[
                { value: "dots", label: "Точки" },
                { value: "stripes", label: "Полосы" },
                { value: "grid", label: "Сетка" },
                { value: "cross", label: "Крестики" },
                { value: "hex", label: "Соты" },
                { value: "custom", label: "Custom SVG / ленты" },
                { value: "plain", label: "Только градиент" },
              ]}
            />
          </Field>
          <Field label="Сторона формы">
            <Select
              value={edge}
              onChange={setEdge}
              options={[
                { value: "top", label: "Сверху" },
                { value: "right", label: "Справа" },
                { value: "bottom", label: "Снизу" },
                { value: "left", label: "Слева" },
              ]}
            />
          </Field>
          <Slider label="Отступ контента" value={padding} onChange={setPadding} min={24} max={72} showValue />
          <Slider label="Глубина формы" value={bend} onChange={setBend} showValue min={0} max={100} />
          <Slider
            label="Положение выреза"
            value={position}
            onChange={setPosition}
            showValue
            min={0}
            max={100}
            disabled={material === "glass" || material === "corner"}
          />
          <Slider label="Ширина выреза" value={span} onChange={setSpan} showValue min={12} max={75} />
          <Slider label="Шаг фона" value={spacing} onChange={setSpacing} showValue min={8} max={40} />
          <Slider
            label="Контраст рисунка"
            value={patternOpacity}
            onChange={setPatternOpacity}
            showValue
            min={10}
            max={60}
          />
          <Slider
            label="Плотность стекла"
            value={opacity}
            onChange={setOpacity}
            showValue={(value) => `${value}%`}
            min={35}
            max={100}
          />
          <Slider label="Высота тени" value={depth} onChange={setDepth} showValue min={0} max={20} />
          <Switch
            label="Двойной контур"
            checked={contours}
            onChange={(event) => setContours(event.target.checked)}
          />
          <Switch
            label="Показать пути"
            checked={wireframe}
            onChange={(event) => setWireframe(event.target.checked)}
          />
          <Switch
            label="Безопасная зона"
            checked={safeArea}
            onChange={(event) => setSafeArea(event.target.checked)}
          />
          <Switch
            label="Лёгкая анимация"
            checked={animated}
            onChange={(event) => setAnimated(event.target.checked)}
          />
          <div className="rx-engine-note">
            <span>SHAPE → GLASS → SHADOW</span>
            <p>Форма меняется в пределах отступа. Стекло размывает фон, сохраняя резкость текста.</p>
          </div>
        </aside>
      </div>
      <div className="rx-gallery-head">
        <h2>SVG-кромки · нативные контролы</h2>
        <span>Soft / Cut / Notch / Ticket</span>
      </div>
      <section className="rx-control-gallery" aria-label="SVG control borders">
        {SVG_CONTROL_BORDERS.map((border, index) => (
          <div className="rx-control-specimen" key={border}>
            <div className="rx-control-caption">
              <span>
                0{index + 1} / {border.toUpperCase()}
              </span>
              <span>1.5 PX</span>
            </div>
            <Button
              svgBorder={border}
              variant="primary"
              block
              iconEnd={<ChevronRight size={14} />}
              onClick={() => setApplied(!applied)}
            >
              {applied ? "Saved" : "Save changes"}
            </Button>
            <Field label={`${border} gateway`}>
              <Input svgBorder={border} icon={<Search size={14} />} defaultValue="Northern gateway" />
            </Field>
            <div className="rx-control-actions">
              <Button svgBorder={border} size="sm" className="rx-secondary-action">
                Preview
              </Button>
              <IconButton
                svgBorder={border}
                variant="outline"
                icon={<Settings2 size={15} />}
                label={`${border} settings`}
                active={controlActive}
                onClick={() => setControlActive(!controlActive)}
                tooltip={false}
              />
              <IconButton
                svgBorder={border}
                variant="primary"
                icon={<Plus size={16} />}
                label={`${border} add`}
                tooltip={false}
                onClick={() => setApplied(true)}
              />
            </div>
            <div className="rx-control-detail">
              <span>LINKED ROUTE</span>
              <span>NORTH / 24 ms</span>
            </div>
          </div>
        ))}
      </section>
      <div className="rx-control-states">
        <span className="rx-overline">STATES / SAME CONTOUR</span>
        <Button svgBorder="cut" size="sm">
          Small
        </Button>
        <Button svgBorder="cut">Default</Button>
        <Button svgBorder="cut" size="lg">
          Large
        </Button>
        <Button svgBorder="ticket" disabled>
          Disabled
        </Button>
        <Button svgBorder="notch" loading>
          Saving
        </Button>
        <Field label="Invalid gateway" error="Gateway name is required">
          <Input svgBorder="notch" placeholder="Enter a name" />
        </Field>
      </div>
      <div className="rx-gallery-head">
        <h2>Восемь форм · один контракт отступов</h2>
        <span>Выбери материал</span>
      </div>
      <div className="rx-gallery">
        {materials.map((item) => (
          <button
            type="button"
            key={item.id}
            className="rx-specimen"
            aria-label={`Select ${item.name}`}
            aria-pressed={material === item.id}
            onClick={() => {
              setMaterial(item.id);
              setEdge(item.edge);
            }}
          >
            <Surface
              material={item.id}
              settings={{ ...settings, wireframe: false, edge: item.edge }}
              className="rx-gallery-surface"
            >
              <div className="rx-specimen-caption">
                <span>{item.code}</span>
                <ChevronRight size={16} />
              </div>
              <h3>{item.name}</h3>
              <p>{item.copy}</p>
              <div className="rx-specimen-bottom">
                <span className="rx-material-line" />
                <span>{item.id === material ? "SELECTED" : "EXPLORE"}</span>
              </div>
            </Surface>
          </button>
        ))}
      </div>
      <div className="rx-gallery-head">
        <h2>Абстрактные SVG-элементы</h2>
        <span>Выбери графику для главного образца</span>
      </div>
      <div className="rx-artwork-gallery">
        {SVG_ARTWORKS.map((variant) => (
          <button
            type="button"
            className="rx-artwork-choice"
            key={variant}
            aria-label={`Select artwork ${variant}`}
            aria-pressed={artwork === variant}
            onClick={() => setArtwork(variant)}
          >
            <SvgArtwork variant={variant} />
            <span>{variant}</span>
          </button>
        ))}
      </div>
      <div className="rx-custom-study">
        <SvgBackdrop pattern="cross" animated={animated}>
          {({ id }) => <CustomBackdrop id={id} />}
        </SvgBackdrop>
        <div>
          <span className="rx-overline">CUSTOM SVG / COMPOSITION SLOT</span>
          <h2>Твой фон. Те же правила.</h2>
          <p>
            SVG передаётся React-узлами. Каждый экземпляр получает собственный префикс для gradient, mask и
            clipPath. Фон не перехватывает клики и не меняет layout.
          </p>
        </div>
      </div>
      <div className="rx-in-context">
        <div>
          <span className="rx-overline">IN CONTEXT / CONTROL STUDY</span>
          <h2>Та же кромка, меньше масштаб</h2>
          <p>Проверяем, остаётся ли материал уместным рядом с обычными полями и переключателями.</p>
        </div>
        <Surface material={material} settings={settings} className="rx-control-surface">
          <Field label="Gateway name">
            <Input svgBorder="notch" defaultValue="Northern workspace" onChange={() => setApplied(false)} />
          </Field>
          <div className="rx-inline-controls">
            <Switch defaultChecked label="Secure routing" />
            <Button svgBorder="ticket" size="sm" variant="primary" onClick={() => setApplied(true)}>
              {applied ? "Applied" : "Apply"}
            </Button>
          </div>
        </Surface>
      </div>
    </div>
  );
}
