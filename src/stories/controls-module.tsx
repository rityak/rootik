import { ArrowUpRight, Check, Copy, Download, Plus, Search, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { Field } from "../components/field";
import {
  Button,
  ButtonGroup,
  type ButtonVariant,
  Checkbox,
  CheckboxCards,
  CheckboxGroup,
  ChipGroup,
  ChoiceCards,
  ColorPicker,
  Combobox,
  ConfirmButton,
  DateRange,
  IconButton,
  Input,
  InputAddon,
  InputGroup,
  NativeSelect,
  NumberInput,
  PasswordInput,
  PinInput,
  PowerButton,
  RadioGroup,
  RangeSlider,
  SearchInput,
  Select,
  type Size,
  Slider,
  SplitButton,
  Switch,
  Textarea,
  TokenField,
} from "../controls/index";
import { PageHeader, SvgArtwork, SvgBackdrop, SvgSurface } from "../layout/index";
import { useControllable } from "../lib/hooks";
import type { SvgControlBorder } from "../lib/svg-geometry";
import { MenuItem } from "../navigation/menu";
import { SIGNAL_PALETTES, type SignalPaletteId } from "../theme/palettes";
import { Scope } from "../theme/provider";
import { useMotionStudy } from "./motion-settings";
import { VpnPowerStudy } from "./vpn-power-study";
import "../fonts.css";
import "../css/layout.css";
import "../css/controls.css";
import "../../.ladle/controls-module.css";

const VARIANTS: ReadonlyArray<{ value: ButtonVariant; label: string }> = [
  { value: "primary", label: "Сохранить" },
  { value: "secondary", label: "Настроить" },
  { value: "inverse", label: "Открыть" },
  { value: "outline", label: "Подробнее" },
  { value: "ghost", label: "Отменить" },
  { value: "danger", label: "Удалить" },
  { value: "warn", label: "Приостановить" },
];
const REGIONS = [
  { value: "north", label: "Северный шлюз" },
  { value: "locked", label: "Закрытый шлюз", disabled: true },
  { value: "east", label: "Восточный шлюз" },
  { value: "west", label: "Западный шлюз" },
];
const MODES = [
  {
    value: "auto",
    label: "Автоматически",
    description: "Система выбирает маршрут",
    icon: <ArrowUpRight size={18} />,
  },
  { value: "manual", label: "Вручную", description: "Выбор остаётся за вами", icon: <Settings size={18} /> },
];

export function ControlsModule({
  mode: controlledMode,
  onModeChange,
}: {
  mode?: "light" | "dark";
  onModeChange?: (mode: "light" | "dark") => void;
}) {
  const [mode, setMode] = useControllable(controlledMode, "light", onModeChange);
  const [palette, setPalette] = useState<SignalPaletteId>("cobalt");
  const [style, setStyle] = useState<"rootik" | "fluent">("rootik");
  const [border, setBorder] = useState<SvgControlBorder>("cut");
  const [size, setSize] = useState<Size>("md");
  const [svg, setSvg] = useState(true);
  const [rounded, setRounded] = useState(true);
  const [motion, setMotion] = useState(true);
  const animation = useMotionStudy(motion, svg, style);
  const [status, setStatus] = useState("Все изменения остаются в примере");
  const [query, setQuery] = useState("");
  const [name, setName] = useState("Северный шлюз");
  const [region, setRegion] = useState("north");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(false);
  const [power, setPower] = useState(false);
  const [count, setCount] = useState<number | null>(8);
  const [level, setLevel] = useState(64);
  const [tags, setTags] = useState(["env:dev"]);
  const [pin, setPin] = useState("");
  return (
    <Scope
      values={{
        ...animation.values,
        palette,
        fontSize: 14,
        radius: 16,
        glow: "off",
        "material.reflection": 0,
        colorMode: mode,
        style,
        svgShapes: svg,
        corners: rounded ? "round" : "square",
        motion: motion ? "full" : "off",
        font: "rubik",
        monoFont: "jetbrains",
      }}
    >
      <div className="cm-study">
        <div className="cm-settings">
          {animation.settings}
          <Field label="Палитра controls">
            <NativeSelect
              value={palette}
              onChange={(event) => {
                const value = event.target.value as SignalPaletteId;
                animation.transition(() => setPalette(value));
              }}
              options={SIGNAL_PALETTES.map((item) => ({ value: item.id, label: item.name }))}
            />
          </Field>
          <Field label="Подстиль controls">
            <NativeSelect
              value={style}
              onChange={(event) => setStyle(event.target.value as "rootik" | "fluent")}
              options={[
                { value: "rootik", label: "Rootik" },
                { value: "fluent", label: "Fluent" },
              ]}
            />
          </Field>
          <Field label="Контур controls">
            <NativeSelect
              value={border}
              onChange={(event) => setBorder(event.target.value as SvgControlBorder)}
              options={["soft", "cut", "notch", "ticket"].map((value) => ({ value, label: value }))}
            />
          </Field>
          <Field label="Размер controls">
            <NativeSelect
              value={size}
              onChange={(event) => setSize(event.target.value as Size)}
              options={["sm", "md", "lg"].map((value) => ({ value, label: value }))}
            />
          </Field>
          <Switch
            label="Тёмная controls"
            checked={mode === "dark"}
            onChange={(event) => {
              const value = event.target.checked ? "dark" : "light";
              animation.transition(() => setMode(value));
            }}
          />
          <Switch
            label="SVG-контуры controls"
            checked={svg && style !== "fluent"}
            disabled={style === "fluent"}
            onChange={(event) => setSvg(event.target.checked)}
          />
          <Switch
            label="Скругления controls"
            checked={rounded && style !== "fluent"}
            disabled={style === "fluent"}
            onChange={(event) => setRounded(event.target.checked)}
          />
          <Switch
            label="Анимация controls"
            checked={motion}
            onChange={(event) => setMotion(event.target.checked)}
          />
        </div>
        <div className="cm-canvas">
          <SvgBackdrop animated={animation.values.effects !== "off"} pattern="dots" opacity={0.1} />
          <PageHeader
            title="Точный контур. Живой контроль."
            description="Нативные действия, читаемые состояния и SVG, который знает своё место."
          />
          <div className="cm-grid">
            <SvgSurface shape="saddle" padding={28} shadow={0.25} className="cm-wide">
              <VpnPowerStudy />
            </SvgSurface>
            <SvgSurface
              shape="bevel"
              padding={24}
              shadow={0.2}
              contentClassName="cm-content"
              className="cm-wide"
            >
              <div className="cm-heading">
                <div>
                  <code>01 / ACTIONS</code>
                  <h2>Действие видно сразу</h2>
                </div>
                <SvgArtwork variant="orbits" motion="drift" className="cm-art" />
              </div>
              <div className="cm-row">
                {VARIANTS.map((item) => (
                  <Button
                    key={item.value}
                    variant={item.value}
                    size={size}
                    svgBorder={border}
                    onClick={() => setStatus(`Действие: ${item.label}`)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              <div className="cm-row">
                <Button
                  icon={<Check size={16} />}
                  svgBorder={border}
                  size={size}
                  active={active}
                  onClick={() => setActive(!active)}
                >
                  Закрепить
                </Button>
                <Button svgBorder={border} size={size} loading={busy}>
                  Обработка
                </Button>
                <Switch
                  label="Показать загрузку"
                  checked={busy}
                  onChange={(event) => setBusy(event.target.checked)}
                />
                <Button svgBorder={border} size={size} disabled>
                  Недоступно
                </Button>
                <IconButton
                  label="Добавить"
                  icon={<Plus size={18} />}
                  size={size}
                  svgBorder={border}
                  onClick={() => setStatus("Добавление выбрано")}
                />
                <IconButton
                  label="Копировать пример"
                  icon={<Copy size={18} />}
                  size={size}
                  variant="secondary"
                  svgBorder={border}
                  onClick={() => setStatus("Действие копирования выбрано")}
                />
                <IconButton
                  label="Удалить пример"
                  icon={<Trash2 size={18} />}
                  size={size}
                  variant="danger"
                  svgBorder={border}
                  onClick={() => setStatus("Действие удаления выбрано")}
                />
              </div>
              <div className="cm-row">
                <ButtonGroup aria-label="Масштаб">
                  <Button size={size} onClick={() => setStatus("Масштаб 75%")}>
                    75%
                  </Button>
                  <Button size={size} active onClick={() => setStatus("Масштаб 100%")}>
                    100%
                  </Button>
                  <Button size={size} onClick={() => setStatus("Масштаб 125%")}>
                    125%
                  </Button>
                </ButtonGroup>
                <SplitButton
                  size={size}
                  svgBorder={border}
                  icon={<Download size={16} />}
                  onClick={() => setStatus("Экспорт JSON выбран")}
                  menu={
                    <>
                      <MenuItem onSelect={() => setStatus("Экспорт CSV выбран")}>CSV</MenuItem>
                      <MenuItem onSelect={() => setStatus("Экспорт JSON выбран")}>JSON</MenuItem>
                    </>
                  }
                >
                  Экспорт
                </SplitButton>
                <ConfirmButton
                  size={size}
                  svgBorder={border}
                  confirmLabel="Точно сбросить?"
                  onConfirm={() => setStatus("Локальные настройки сброшены")}
                >
                  Сбросить
                </ConfirmButton>
                <PowerButton label="Подключение примера" size="xs" on={power} onChange={setPower} />
                <span className="cm-note">{power ? "Подключено" : "Отключено"}</span>
              </div>
            </SvgSurface>
            <SvgSurface shape="saddle" padding={24} shadow={0.2} contentClassName="cm-content">
              <div className="cm-heading">
                <div>
                  <code>02 / INPUT</code>
                  <h2>Содержание под защитой</h2>
                </div>
                <Search size={21} />
              </div>
              <form
                className="cm-content"
                onSubmit={(event) => {
                  event.preventDefault();
                  setStatus(`Сохранён пример: ${name}`);
                }}
              >
                <Field label="Название пространства" required hint="Контур занимает только внутренний отступ">
                  <Input
                    name="workspace"
                    required
                    svgBorder={border}
                    size={size}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Field>
                <Field label="Поиск в примере">
                  <SearchInput
                    svgBorder={border}
                    size={size}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onClear={() => setQuery("")}
                    shortcut="Ctrl K"
                  />
                </Field>
                <Field label="Пароль примера">
                  <PasswordInput svgBorder={border} size={size} defaultValue="demo-only" autoComplete="off" />
                </Field>
                <Field label="Адрес" error="Проверьте формат адреса">
                  <Input svgBorder={border} size={size} defaultValue="gateway..local" />
                </Field>
                <Field label="Поле только для чтения">
                  <Input svgBorder={border} size={size} readOnly value="rootik / controls" mono />
                </Field>
                <Field label="Заблокированное поле">
                  <Input svgBorder={border} size={size} disabled defaultValue="Нет доступа" />
                </Field>
                <Field label="Заметка">
                  <Textarea
                    svgBorder={border}
                    defaultValue="Ничего не прыгает при переключении SVG. Поле остаётся обычным textarea."
                  />
                </Field>
                <div className="cm-row">
                  <Button type="submit" variant="primary" svgBorder={border} size={size}>
                    Сохранить пространство
                  </Button>
                  <InputGroup>
                    <InputAddon>https://</InputAddon>
                    <Input aria-label="Имя хоста" defaultValue="rootik.local" size={size} />
                  </InputGroup>
                </div>
              </form>
            </SvgSurface>
            <SvgSurface shape="ticket" padding={24} shadow={0.2} contentClassName="cm-content">
              <div className="cm-heading">
                <div>
                  <code>03 / SELECT</code>
                  <h2>От простого к составному</h2>
                </div>
              </div>
              <Field label="Регион">
                <Select
                  size={size}
                  svgBorder={border}
                  options={REGIONS}
                  value={region}
                  onChange={setRegion}
                />
              </Field>
              <Field label="Нативный регион">
                <NativeSelect
                  size={size}
                  svgBorder={border}
                  options={REGIONS}
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                />
              </Field>
              <Field label="Найти шлюз">
                <Combobox
                  size={size}
                  svgBorder={border}
                  options={REGIONS}
                  defaultValue="north"
                  onChange={(value) => setStatus(`Шлюз: ${value ?? "не выбран"}`)}
                />
              </Field>
              <Field label="Метки" hint="Enter добавляет метку; Backspace выбирает последнюю">
                <TokenField
                  size={size}
                  svgBorder={border}
                  value={tags}
                  onChange={setTags}
                  suggestions={["env:dev", "env:prod", "region:north", "region:east"]}
                  placeholder="Добавить метку"
                />
              </Field>
              <Field label="Количество потоков" hint="Стрелки, Home/End и шаг 2; диапазон 2–32">
                <NumberInput
                  size={size}
                  svgBorder={border}
                  min={2}
                  max={32}
                  step={2}
                  value={count}
                  onChange={setCount}
                />
              </Field>
              <Field label="Код подтверждения" hint="Локальный пример, код никуда не отправляется">
                <PinInput
                  size={size}
                  length={6}
                  value={pin}
                  onChange={setPin}
                  groups={[3, 3]}
                  name="demo-code"
                  onComplete={() => setStatus("Код из шести символов заполнен")}
                />
              </Field>
              <div className="cm-note">
                Выбран регион: {REGIONS.find((item) => item.value === region)?.label}
              </div>
            </SvgSurface>
            <SvgSurface shape="step" padding={24} shadow={0.2} contentClassName="cm-content">
              <div className="cm-heading">
                <div>
                  <code>04 / CHOICE</code>
                  <h2>Состояние без догадок</h2>
                </div>
              </div>
              <div className="cm-row">
                <Checkbox label="Сохранять историю" defaultChecked />
                <Checkbox label="Частичный выбор" indeterminate />
                <Checkbox label="Недоступный выбор" disabled />
              </div>
              <Switch label="Автоподключение" description="После запуска приложения" defaultChecked />
              <RadioGroup
                aria-label="Стратегия"
                options={[
                  { value: "fast", label: "Быстрее" },
                  { value: "stable", label: "Стабильнее" },
                  { value: "locked", label: "Скоро", disabled: true },
                ]}
                defaultValue="stable"
                orientation="horizontal"
              />
              <ChoiceCards
                aria-label="Способ подключения"
                svgBorder={border}
                options={MODES}
                defaultValue="auto"
                minWidth={160}
              />
              <CheckboxCards
                aria-label="Дополнения"
                svgBorder={border}
                options={[
                  { value: "logs", label: "Журнал" },
                  { value: "cache", label: "Кэш" },
                ]}
                defaultValue={["logs"]}
                minWidth={160}
              />
              <ChipGroup
                aria-label="Фильтры"
                svgBorder={border}
                options={[
                  { value: "online", label: "В сети", count: 12 },
                  { value: "favorite", label: "Избранные", count: 4 },
                  { value: "archived", label: "Архив", disabled: true },
                ]}
                defaultValue={["online"]}
              />
              <CheckboxGroup
                aria-label="События"
                selectAll="Все события"
                options={[
                  { value: "info", label: "Информация" },
                  { value: "warn", label: "Предупреждения" },
                  { value: "error", label: "Ошибки" },
                ]}
                defaultValue={["error"]}
              />
            </SvgSurface>
            <SvgSurface shape="wave" padding={24} shadow={0.2} contentClassName="cm-content">
              <div className="cm-heading">
                <div>
                  <code>05 / VALUES</code>
                  <h2>Числа, время и цвет</h2>
                </div>
              </div>
              <Slider
                label="Интенсивность"
                value={level}
                onChange={setLevel}
                showValue={(value) => `${value}%`}
                marks={[0, 25, 50, 75, 100]}
              />
              <RangeSlider label="Рабочий диапазон" defaultValue={[20, 80]} minDistance={10} showValue />
              <Slider label="Недоступный слайдер" defaultValue={45} disabled showValue />
              <Field label="Период">
                <DateRange aria-label="Период примера" svgBorder={border} size={size} />
              </Field>
              <ColorPicker
                defaultValue="oklch(0.58 0.13 250)"
                alpha
                onChange={(value) => setStatus(`Выбран цвет: ${value}`)}
              />
            </SvgSurface>
          </div>
          <div className="cm-status" role="status">
            <Check size={15} />
            <span>{status}</span>
            <code>/controls</code>
          </div>
        </div>
      </div>
    </Scope>
  );
}
