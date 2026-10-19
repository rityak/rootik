import { Circle, Grid2X2, Layers, PanelRight, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button, IconButton } from "../components/button";
import { Switch } from "../components/choice";
import { Field, Input } from "../components/input";
import { Dock, NavItem, Sidebar } from "../components/nav";
import { Select } from "../components/select";
import {
  ActionBar,
  AppShell,
  Disclosure,
  FloatingWindow,
  MasterDetail,
  PageBody,
  PageHeader,
  ResizablePanel,
  ShellMenuButton,
  Spacer,
  Splitter,
  StatusBar,
  SVG_SHAPES,
  SvgArtwork,
  SvgBackdrop,
  type SvgShape,
  SvgSurface,
  TitleBar,
  Toolbar,
} from "../layout/index";
import { useControllable } from "../lib/hooks";
import { SIGNAL_PALETTES, type SignalPaletteId } from "../theme/palettes";
import { Scope } from "../theme/provider";
import { useMotionStudy } from "./motion-settings";
import "../fonts.css";
import "../css/layout.css";
import "../css/nav.css";
import "../css/select.css";
import "../../.ladle/layout-module.css";

const NAV_ITEMS = [
  { value: "workspace", label: "Рабочая область", icon: <Grid2X2 size={17} /> },
  { value: "geometry", label: "Геометрия", icon: <SlidersHorizontal size={17} /> },
  { value: "modules", label: "Модули", icon: <Layers size={17} /> },
];

const MODULES = [
  {
    id: "frame",
    title: "AppShell",
    description: "Sidebar, header, inspector, footer и dock в одном адаптивном корпусе.",
  },
  {
    id: "page",
    title: "PageBody + PageHeader",
    description: "Ограниченная ширина страницы и отдельная иерархия заголовка, описания и действий.",
  },
  {
    id: "panels",
    title: "ResizablePanel",
    description: "Изменение размера мышью и стрелками. Shift увеличивает шаг с 12 до 48 px.",
  },
];

export function LayoutModule({
  mode: controlledMode,
  onModeChange,
}: {
  mode?: "light" | "dark";
  onModeChange?: (mode: "light" | "dark") => void;
}) {
  const [mode, setMode] = useControllable(controlledMode, "light", onModeChange);
  const [palette, setPalette] = useState<SignalPaletteId>("maomao");
  const [font, setFont] = useState<"rubik" | "onest" | "system">("rubik");
  const [shape, setShape] = useState<SvgShape>("bevel");
  const [variant, setVariant] = useState<"islands" | "inset">("islands");
  const [appearanceStyle, setAppearanceStyle] = useState<"rootik" | "fluent">("rootik");
  const [svgShapes, setSvgShapes] = useState(true);
  const [rounded, setRounded] = useState(true);
  const [dock, setDock] = useState(true);
  const [dockShape, setDockShape] = useState<"surface" | "capsule">("capsule");
  const [inspector, setInspector] = useState(true);
  const [detail, setDetail] = useState<string | null>(null);
  const [guides, setGuides] = useState(false);
  const [selected, setSelected] = useState("workspace");
  const [saved, setSaved] = useState(false);
  const [motion, setMotion] = useState(true);
  const [floating, setFloating] = useState(false);
  const animation = useMotionStudy(motion, svgShapes, appearanceStyle);
  return (
    <Scope
      values={{
        ...animation.values,
        motion: motion ? "system" : "off",
        palette,
        style: appearanceStyle,
        svgShapes,
        dockShape,
        corners: rounded ? "round" : "square",
        radius: rounded ? 16 : 0,
        colorMode: mode,
        font,
        fontSize: 14,
        monoFont: "jetbrains",
        displayFont: font === "onest" ? "literata" : "ui",
        glow: "off",
        "material.reflection": 0,
      }}
    >
      <div className="lm-study">
        <div className="lm-controls">
          <Switch
            label="Анимация layout"
            checked={motion}
            onChange={(event) => setMotion(event.target.checked)}
          />
          <Button onClick={() => setFloating(true)} disabled={floating}>
            Открыть плавающую панель
          </Button>
          {animation.settings}
          <Field label="Палитра layout">
            <Select
              value={palette}
              onChange={(value) => animation.transition(() => setPalette(value))}
              options={SIGNAL_PALETTES.map((item) => ({ value: item.id, label: item.name }))}
            />
          </Field>
          <Field label="Шрифт layout">
            <Select
              value={font}
              onChange={setFont}
              options={[
                { value: "rubik", label: "Rubik" },
                { value: "onest", label: "Onest + Literata" },
                { value: "system", label: "System" },
              ]}
            />
          </Field>
          <Field label="Форма панелей">
            <Select
              disabled={!svgShapes || appearanceStyle === "fluent"}
              value={shape}
              onChange={setShape}
              options={SVG_SHAPES.map((value) => ({ value, label: value }))}
            />
          </Field>
          <Field label="Компоновка layout">
            <Select
              value={variant}
              onChange={setVariant}
              options={[
                { value: "islands", label: "Парящий" },
                { value: "inset", label: "К краям" },
              ]}
            />
          </Field>
          <Field label="Подстиль layout">
            <Select
              value={appearanceStyle}
              onChange={setAppearanceStyle}
              options={[
                { value: "rootik", label: "Rootik" },
                { value: "fluent", label: "Fluent" },
              ]}
            />
          </Field>
          <Field label="Форма dock">
            <Select
              value={dockShape}
              onChange={setDockShape}
              disabled={!dock || variant === "inset"}
              options={[
                { value: "capsule", label: "Капсула" },
                { value: "surface", label: "Как панели / SVG" },
              ]}
            />
          </Field>
          <Switch
            checked={mode === "dark"}
            onChange={(event) => {
              const value = event.target.checked ? "dark" : "light";
              animation.transition(() => setMode(value));
            }}
            label="Тёмный layout"
          />
          <Switch
            checked={svgShapes && appearanceStyle !== "fluent"}
            disabled={appearanceStyle === "fluent"}
            onChange={(event) => setSvgShapes(event.target.checked)}
            label="SVG-контуры"
          />
          <Switch
            checked={rounded && appearanceStyle !== "fluent"}
            disabled={appearanceStyle === "fluent"}
            onChange={(event) => setRounded(event.target.checked)}
            label="Скругления"
          />
          <Switch checked={dock} onChange={(event) => setDock(event.target.checked)} label="Dock" />
          <Switch
            checked={inspector}
            onChange={(event) => setInspector(event.target.checked)}
            label="Inspector"
          />
          <Switch
            checked={guides}
            onChange={(event) => setGuides(event.target.checked)}
            label="Безопасные отступы"
          />
        </div>
        <AppShell
          className="lm-shell"
          variant={variant}
          dockPlacement={variant === "inset" ? "bar" : "float"}
          surface={{ shape, padding: 20, depth: 0.7, shadow: 0.25 }}
          dock={
            dock && (
              <Dock
                aria-label="Dock layout"
                items={NAV_ITEMS}
                value={selected}
                onChange={setSelected}
                variant="labels"
              />
            )
          }
          aside={
            inspector && (
              <ResizablePanel className="lm-inspector" handle="left" defaultSize={208} min={180} max={320}>
                <div className="lm-inspector-content">
                  <span className="lm-eyebrow">INSPECTOR</span>
                  <h2>Параметры панели</h2>
                  <Disclosure title="Геометрия" open>
                    <dl className="lm-properties">
                      <dt>Контур</dt>
                      <dd>{appearanceStyle === "fluent" || !svgShapes ? "Обычный" : shape}</dd>
                      <dt>Углы</dt>
                      <dd>{appearanceStyle === "fluent" || !rounded ? "0 px" : "16 px"}</dd>
                      <dt>Режим</dt>
                      <dd>{variant === "islands" ? "Парящий" : "К краям"}</dd>
                    </dl>
                  </Disclosure>
                  <Disclosure title="Изменение размера">
                    <p>Потяни левую грань или выбери её клавишей Tab и нажми стрелку. Shift — крупный шаг.</p>
                  </Disclosure>
                  <Button onClick={() => setInspector(false)}>Закрыть inspector</Button>
                </div>
              </ResizablePanel>
            )
          }
          backdrop={
            <SvgBackdrop animated={animation.values.effects !== "off"} pattern="dots" opacity={0.12}>
              {({ id }) => (
                <g id={`${id}-custom`} opacity=".08">
                  <path
                    d="M 0 80 Q 260 0 520 100 T 1100 80"
                    fill="none"
                    stroke="var(--rk-secondary)"
                    strokeWidth="2"
                  />
                </g>
              )}
            </SvgBackdrop>
          }
          sidebar={
            <Sidebar header={<strong>rootik / layout</strong>} footer={<small>MODULE 01 · SIGNAL</small>}>
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.value}
                  label={item.label}
                  icon={item.icon}
                  active={selected === item.value}
                  onClick={() => setSelected(item.value)}
                />
              ))}
            </Sidebar>
          }
          header={
            <TitleBar
              start={
                <>
                  <ShellMenuButton />
                  <span>Рабочее пространство</span>
                </>
              }
              end={
                <IconButton
                  icon={<PanelRight size={16} />}
                  label="Переключить inspector"
                  active={inspector}
                  onClick={() => setInspector(!inspector)}
                />
              }
            />
          }
          footer={
            <StatusBar end="SVG / CSS tokens / React">
              {saved ? "Изменения сохранены в примере" : "Панели готовы к работе"}
            </StatusBar>
          }
        >
          <div className="lm-page">
            <PageHeader
              size="lg"
              title={
                selected === "modules"
                  ? "Система из модулей."
                  : selected === "geometry"
                    ? "Форма знает границы."
                    : "Спокойный фон. Точная форма."
              }
              description="Публичный layout тулкита: поверхности и палитры работают без стилей лаборатории."
              actions={
                <Button svgBorder="cut" variant="primary" onClick={() => setSaved(true)}>
                  {saved ? "Сохранено" : "Сохранить"}
                </Button>
              }
            />
            {selected === "modules" ? (
              <SvgSurface shape="step" padding={28} showSafeArea={guides}>
                <Toolbar aria-label="Инструменты layout">
                  <Button onClick={() => setDetail(null)}>Все компоненты</Button>
                  <Spacer />
                  <Button onClick={() => setInspector(!inspector)}>Inspector</Button>
                </Toolbar>
                <MasterDetail
                  listWidth={200}
                  stackBelow={580}
                  onBack={() => setDetail(null)}
                  list={MODULES.map((item) => (
                    <Button key={item.id} active={detail === item.id} onClick={() => setDetail(item.id)}>
                      {item.title}
                    </Button>
                  ))}
                  empty={
                    <p>
                      Выбери компонент слева. На узком экране список сменяется деталями и кнопкой возврата.
                    </p>
                  }
                  detail={
                    detail && (
                      <PageBody width={480}>
                        <h2>{MODULES.find((item) => item.id === detail)?.title}</h2>
                        <p>{MODULES.find((item) => item.id === detail)?.description}</p>
                      </PageBody>
                    )
                  }
                />
                <ActionBar status="Layout → navigation → controls">
                  <Button variant="primary" onClick={() => setSaved(true)}>
                    Применить компоновку
                  </Button>
                </ActionBar>
              </SvgSurface>
            ) : (
              <>
                <SvgSurface
                  shape={shape}
                  padding={28}
                  showSafeArea={guides}
                  className="lm-feature"
                  background={<SvgBackdrop pattern="stripes" spacing={24} opacity={0.07} />}
                >
                  <div className="lm-feature-grid">
                    <div>
                      <span className="lm-eyebrow">SURFACE / PROTECTED CONTENT</span>
                      <h2>
                        Геометрия держит
                        <br />
                        <em>содержание.</em>
                      </h2>
                      <p>
                        Вырезы, ступени и скругления занимают только отступы. Текст, поля и действия остаются
                        в общей безопасной области.
                      </p>
                    </div>
                    <SvgArtwork variant="orbits" />
                  </div>
                  <div className="lm-data">
                    <strong>
                      128,4 <small>ГБ</small>
                    </strong>
                    <span>
                      Один контракт отступов
                      <br />
                      для восьми форм
                    </span>
                  </div>
                </SvgSurface>
                <div className="lm-grid">
                  <SvgSurface shape="saddle" padding={24} showSafeArea={guides}>
                    <h2>Внутри — обычный HTML</h2>
                    <p>
                      SVG отвечает за кромку и материал. Поле сохраняет собственную семантику и клавиатурный
                      фокус.
                    </p>
                    <Field label="Название пространства">
                      <Input svgBorder="notch" defaultValue="Северный шлюз" />
                    </Field>
                    <Button svgBorder="cut" onClick={() => setSaved(true)}>
                      Применить
                    </Button>
                  </SvgSurface>
                  <SvgSurface shape="ticket" padding={24} showSafeArea={guides}>
                    <span className="lm-eyebrow">SECONDARY / DETAIL / SIGNAL</span>
                    <h2>Цвет живёт в деталях</h2>
                    <p>Основной холст почти нейтрален. Дополнительные цвета выделяют связи и метки.</p>
                    <div className="lm-swatches">
                      <Circle fill="var(--rk-accent)" />
                      <Circle fill="var(--rk-secondary)" />
                      <Circle fill="var(--rk-detail)" />
                    </div>
                    <code>padding → geometry → content</code>
                  </SvgSurface>
                </div>
              </>
            )}
          </div>
          <SvgSurface shape="rounded" padding={24}>
            <h2>Разделитель панелей</h2>
            <Splitter grip handleLabel="Размер панели списка" style={{ height: 160 }}>
              {[
                <p key="list">Список · ← / → меняют ширину</p>,
                <Field key="detail" label="Заметка панели">
                  <Input defaultValue="Сохраняется при смене темы" />
                </Field>,
              ]}
            </Splitter>
          </SvgSurface>
        </AppShell>
        <FloatingWindow
          open={floating}
          title="Инспектор пространства"
          onClose={() => setFloating(false)}
          surface={{ shape, padding: 20, depth: 0.35 }}
          defaultPosition={{ x: 120, y: 140 }}
        >
          <Field label="Название панели">
            <Input defaultValue="Северная лаборатория" svgBorder="notch" />
          </Field>
          <p>Заголовок: стрелки перемещают окно. SVG Off и Fluent сохраняют положение и поле.</p>
        </FloatingWindow>
      </div>
    </Scope>
  );
}
