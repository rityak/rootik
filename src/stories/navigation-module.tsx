import { Folder, Grid2X2, MoreHorizontal, Settings, Shield, SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../components/button";
import { Switch } from "../components/choice";
import { Field } from "../components/input";
import { Select } from "../components/select";
import {
  AppShell,
  PageHeader,
  ShellMenuButton,
  StatusBar,
  SvgBackdrop,
  SvgSurface,
  TitleBar,
} from "../layout/index";
import { useControllable } from "../lib/hooks";
import {
  Breadcrumbs,
  ContextMenu,
  Dock,
  Menu,
  Menubar,
  MenubarMenu,
  MenuCheckboxItem,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuSub,
  NavGroup,
  NavItem,
  Pagination,
  SegmentedControl,
  Sidebar,
  Stepper,
  TabPanel,
  Tabs,
  TopNav,
} from "../navigation/index";
import { SIGNAL_PALETTES, type SignalPaletteId } from "../theme/palettes";
import { Scope } from "../theme/provider";
import { useMotionStudy } from "./motion-settings";
import "../fonts.css";
import "../css/layout.css";
import "../css/navigation.css";
import "../../.ladle/navigation-module.css";

const ROUTES = [
  { value: "overview", label: "Обзор", icon: <Grid2X2 size={17} /> },
  { value: "projects", label: "Проекты", icon: <Folder size={17} /> },
  { value: "settings", label: "Настройки", icon: <Settings size={17} /> },
];
const PROJECTS = [
  "Северный шлюз",
  "Тихая гавань",
  "Синий час",
  "Тёплый фронт",
  "Новая орбита",
  "Мягкий сигнал",
];

export function NavigationModule({
  mode: controlledMode,
  onModeChange,
}: {
  mode?: "light" | "dark";
  onModeChange?: (mode: "light" | "dark") => void;
}) {
  const [mode, setMode] = useControllable(controlledMode, "light", onModeChange);
  const [palette, setPalette] = useState<SignalPaletteId>("cobalt");
  const [style, setStyle] = useState<"rootik" | "fluent">("rootik");
  const [rounded, setRounded] = useState(true);
  const [svg, setSvg] = useState(true);
  const [motion, setMotion] = useState(true);
  const animation = useMotionStudy(motion, svg, style);
  const [route, setRoute] = useState("overview");
  const [tab, setTab] = useState("workspace");
  const [vertical, setVertical] = useState("profile");
  const [view, setView] = useState("cards");
  const [page, setPage] = useState(1);
  const [pinned, setPinned] = useState(false);
  const [status, setStatus] = useState("Готово к работе");
  const [step, setStep] = useState(1);
  const id = useId();
  const title = ROUTES.find((item) => item.value === route)?.label ?? "Обзор";
  const actions = (
    <>
      <MenuLabel>Раздел</MenuLabel>
      <MenuItem onSelect={() => setStatus("Ссылка на раздел подготовлена")}>Подготовить ссылку</MenuItem>
      <MenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
        Закрепить раздел
      </MenuCheckboxItem>
      <MenuSub label="Открыть раздел">
        {ROUTES.map((item) => (
          <MenuItem key={item.value} onSelect={() => setRoute(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </MenuSub>
      <MenuSeparator />
      <MenuItem disabled>Экспорт недоступен</MenuItem>
    </>
  );
  return (
    <Scope
      values={{
        ...animation.values,
        palette,
        colorMode: mode,
        style,
        corners: rounded ? "round" : "square",
        svgShapes: svg,
        motion: motion ? "system" : "off",
        font: "rubik",
        fontSize: 14,
        monoFont: "jetbrains",
        radius: 16,
        glow: "off",
        "material.reflection": 0,
      }}
    >
      <div className="nm-study">
        <div className="nm-controls">
          {animation.settings}
          <Field label="Палитра navigation">
            <Select
              value={palette}
              onChange={(value) => animation.transition(() => setPalette(value))}
              options={SIGNAL_PALETTES.map((item) => ({ value: item.id, label: item.name }))}
            />
          </Field>
          <Field label="Подстиль navigation">
            <Select
              value={style}
              onChange={setStyle}
              options={[
                { value: "rootik", label: "Rootik" },
                { value: "fluent", label: "Fluent" },
              ]}
            />
          </Field>
          <Switch
            checked={mode === "dark"}
            label="Тёмная navigation"
            onChange={(event) => {
              const value = event.target.checked ? "dark" : "light";
              animation.transition(() => setMode(value));
            }}
          />
          <Switch
            checked={svg && style !== "fluent"}
            disabled={style === "fluent"}
            label="SVG-контуры navigation"
            onChange={(event) => setSvg(event.target.checked)}
          />
          <Switch
            checked={rounded && style !== "fluent"}
            disabled={style === "fluent"}
            label="Скругления navigation"
            onChange={(event) => setRounded(event.target.checked)}
          />
          <Switch
            checked={motion}
            label="Анимация navigation"
            onChange={(event) => setMotion(event.target.checked)}
          />
        </div>
        <AppShell
          className="nm-shell"
          variant={style === "fluent" ? "inset" : "islands"}
          dockPlacement={style === "fluent" ? "bar" : "float"}
          dockShape="capsule"
          surface={{ shape: "bevel", padding: 20, depth: 0.6, shadow: 0.2 }}
          backdrop={
            <SvgBackdrop animated={animation.values.effects !== "off"} pattern="dots" opacity={0.1} />
          }
          sidebar={
            <Sidebar
              header={<strong>rootik / navigation</strong>}
              footer={<code className="nm-code">/{route}</code>}
            >
              <NavGroup label="Пространство" collapsible>
                {ROUTES.map((item) => (
                  <NavItem
                    svgBorder="cut"
                    key={item.value}
                    label={item.label}
                    icon={item.icon}
                    active={route === item.value}
                    onClick={() => setRoute(item.value)}
                  />
                ))}
              </NavGroup>
              <NavGroup label="Библиотека" collapsible>
                <NavItem
                  label="Избранное"
                  icon={<Shield size={17} />}
                  trailing={pinned ? "1" : "0"}
                  onClick={() => {
                    setRoute("projects");
                    setStatus("Открыто избранное");
                  }}
                />
                <NavItem label="Архив недоступен" href="#archive" disabled icon={<Folder size={17} />} />
              </NavGroup>
            </Sidebar>
          }
          header={
            <TitleBar
              start={
                <>
                  <ShellMenuButton />
                  <span>Навигация</span>
                </>
              }
              end={
                <Menu trigger={<Button icon={<MoreHorizontal size={16} />}>Меню раздела</Button>}>
                  {actions}
                </Menu>
              }
            >
              <Menubar aria-label="Меню приложения">
                <MenubarMenu label="Пространство">
                  {ROUTES.map((item) => (
                    <MenuItem key={item.value} onSelect={() => setRoute(item.value)}>
                      {item.label}
                    </MenuItem>
                  ))}
                </MenubarMenu>
                <MenubarMenu label="Вид">
                  <MenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
                    Закрепить раздел
                  </MenuCheckboxItem>
                  <MenuItem onSelect={() => setView(view === "cards" ? "rows" : "cards")}>
                    Переключить представление
                  </MenuItem>
                </MenubarMenu>
              </Menubar>
            </TitleBar>
          }
          dock={
            <Dock
              aria-label="Dock navigation"
              variant="labels"
              items={ROUTES}
              value={route}
              onChange={setRoute}
            />
          }
          footer={
            <StatusBar end={pinned ? "Раздел закреплён" : "MODULE 02 / NAVIGATION"}>
              <span role="status">{status}</span>
            </StatusBar>
          }
        >
          <div className="nm-page">
            <PageHeader
              size="lg"
              eyebrow={
                <Breadcrumbs
                  items={[{ label: "Пространство", onClick: () => setRoute("overview") }, { label: title }]}
                />
              }
              title={title === "Обзор" ? "Навигация без шума." : title}
              description="Sidebar, ссылки и dock управляют одним маршрутом. Вкладки и переключатели сохраняют собственное состояние."
            />
            <TopNav
              aria-label="Разделы пространства"
              current={`#${route}`}
              onNavigate={(href) => setRoute(href.slice(1))}
              items={ROUTES.map((item) => ({ href: `#${item.value}`, label: item.label, icon: item.icon }))}
            />
            <SvgSurface shape="saddle" padding={28}>
              <div className="nm-section-head">
                <span className="nm-code">TABS / NATIVE RADIO / PAGINATION</span>
                <SegmentedControl
                  svgBorder="notch"
                  aria-label="Представление проектов"
                  value={view}
                  onChange={setView}
                  options={[
                    { value: "cards", label: "Карточки", icon: <Grid2X2 size={15} /> },
                    { value: "rows", label: "Список", icon: <SlidersHorizontal size={15} /> },
                  ]}
                />
              </div>
              <Tabs
                variant="pill"
                svgBorder="cut"
                aria-label="Содержимое пространства"
                idPrefix={id}
                value={tab}
                onChange={setTab}
                items={[
                  { value: "workspace", label: "Рабочие", badge: 6 },
                  { value: "history", label: "История" },
                  { value: "locked", label: "Ограничено", disabled: true },
                ]}
              />
              <TabPanel idPrefix={id} value={tab}>
                {tab === "workspace" ? (
                  <>
                    <div className="nm-projects" data-view={view}>
                      {PROJECTS.slice((page - 1) * 2, page * 2).map((project) => (
                        <ContextMenu
                          key={project}
                          content={
                            <>
                              <MenuItem onSelect={() => setStatus(`Выбран проект: ${project}`)}>
                                Открыть проект
                              </MenuItem>
                              <MenuItem onSelect={() => setStatus(`Закреплён проект: ${project}`)}>
                                Закрепить проект
                              </MenuItem>
                            </>
                          }
                        >
                          <button
                            type="button"
                            className="nm-project"
                            onClick={() => setStatus(`Выбран проект: ${project}`)}
                          >
                            <Folder size={22} />
                            <span>
                              <strong>{project}</strong>
                              <small>Локальное пространство · ПКМ для действий</small>
                            </span>
                          </button>
                        </ContextMenu>
                      ))}
                    </div>
                    <Pagination page={page} pageCount={3} pageSize={2} total={6} onChange={setPage} />
                  </>
                ) : (
                  <p className="nm-copy">
                    {status}. Здесь отображается история действий из меню и карточек этого примера.
                  </p>
                )}
              </TabPanel>
            </SvgSurface>
            <SvgSurface shape="ticket" padding={24}>
              <h2>Шаги настройки</h2>
              <Stepper
                svgBorder="cut"
                current={step}
                linear={false}
                onStepClick={setStep}
                steps={[
                  { id: "profile", label: "Профиль" },
                  { id: "access", label: "Доступ" },
                  { id: "ready", label: "Готово" },
                ]}
              />
            </SvgSurface>
            <SvgSurface shape="corner" padding={28}>
              <h2>Вертикальные вкладки</h2>
              <div className="nm-preferences">
                <Tabs
                  svgBorder="soft"
                  variant="pill"
                  orientation="vertical"
                  aria-label="Настройки пространства"
                  idPrefix={`${id}-vertical`}
                  value={vertical}
                  onChange={setVertical}
                  items={[
                    { value: "profile", label: "Профиль", icon: <Settings size={16} /> },
                    { value: "access", label: "Доступ", icon: <Shield size={16} /> },
                  ]}
                />
                <TabPanel idPrefix={`${id}-vertical`} value={vertical}>
                  <h3>{vertical === "profile" ? "Профиль пространства" : "Управление доступом"}</h3>
                  <p className="nm-copy">
                    {vertical === "profile"
                      ? "Каждая группа вкладок имеет собственные ARIA-связи. Используй ↑ и ↓ для выбора раздела."
                      : "Выбран другой раздел. Локальный маршрут, вкладки и представление проектов остаются на месте."}
                  </p>
                </TabPanel>
              </div>
            </SvgSurface>
          </div>
        </AppShell>
      </div>
    </Scope>
  );
}
