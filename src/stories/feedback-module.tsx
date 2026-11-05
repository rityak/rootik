import { Bell, Check, CircleHelp, Layers, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button, IconButton } from "../controls/button";
import { Switch } from "../controls/choice";
import { Input } from "../controls/input";
import { NativeSelect } from "../controls/native-select";
import {
  Badge,
  BusyOverlay,
  Callout,
  DataState,
  type DataStatus,
  EmptyState,
  type FeedbackAnimation,
  Indicator,
  Meter,
  Progress,
  ProgressRing,
  Skeleton,
  Spinner,
  StatusDot,
  type Tone,
} from "../feedback/index";
import { Field } from "../forms/field";
import { ru } from "../labels/ru";
import { PageHeader } from "../layout/page";
import { SvgBackdrop } from "../layout/svg-backdrop";
import { SvgSurface } from "../layout/svg-surface";
import { useControllable } from "../lib/hooks";
import { LabelsContext } from "../lib/labels";
import type { SvgShape } from "../lib/svg-geometry";
import { SIGNAL_PALETTES, type SignalPaletteId } from "../theme/palettes";
import { Scope } from "../theme/provider";
import { useMotionStudy } from "./motion-settings";
import "../fonts.css";
import "../css/feedback.css";
import "../css/layout.css";
import "../../.ladle/feedback-module.css";

const STATUSES: { tone: Tone; label: string }[] = [
  { tone: "neutral", label: "Ожидание" },
  { tone: "accent", label: "В работе" },
  { tone: "success", label: "Готово" },
  { tone: "warn", label: "Нужна проверка" },
  { tone: "danger", label: "Ошибка" },
  { tone: "info", label: "Информация" },
];

/** Deterministic status scenarios: the consumer owns work, values and retry decisions. */
export function FeedbackModule({
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
  const [animationMode, setAnimationMode] = useState<FeedbackAnimation>("loop");
  const animation = useMotionStudy(motion, svg, style);
  const [value, setValue] = useState(64),
    [busy, setBusy] = useState(false);
  const [state, setState] = useState<DataStatus>("loading");
  const [warning, setWarning] = useState(true),
    [tag, setTag] = useState(true),
    [unread, setUnread] = useState(8);
  const [notice, setNotice] = useState("Состояния переключаются вручную, без сетевых запросов");
  const surface = { shape, padding: 24, depth: 0.5, shadow: 0.25 };
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
        <div className="fb-study">
          <div className="fb-settings">
            {animation.settings}
            <Field label="Палитра feedback">
              <NativeSelect
                value={palette}
                options={SIGNAL_PALETTES.map((p) => ({ value: p.id, label: p.name }))}
                onChange={(event) => {
                  const next = event.target.value as SignalPaletteId;
                  animation.transition(() => setPalette(next));
                }}
              />
            </Field>
            <Field label="Подстиль feedback">
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
                options={["rounded", "bevel", "ticket", "saddle", "corner", "wave"].map((option) => ({
                  value: option,
                  label: option,
                }))}
                onChange={(event) => setShape(event.target.value as SvgShape)}
              />
            </Field>
            <Field label="Повтор индикаторов">
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
              label="Тёмная feedback"
              checked={mode === "dark"}
              onChange={(event) => {
                const next = event.target.checked ? "dark" : "light";
                animation.transition(() => setMode(next));
              }}
            />
            <Switch
              label="SVG-контуры feedback"
              checked={svg && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setSvg(event.target.checked)}
            />
            <Switch
              label="Скругления feedback"
              checked={rounded && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setRounded(event.target.checked)}
            />
            <Switch
              label="Анимация feedback"
              checked={motion}
              onChange={(event) => setMotion(event.target.checked)}
            />
          </div>
          <div className="fb-canvas">
            <SvgBackdrop pattern="dots" opacity={0.1} animated={animation.values.effects !== "off"} />
            <PageHeader
              title="Состояние видно сразу."
              description="Ход работы, результат и следующий шаг. Цвет помогает, текст объясняет."
            />
            <div className="fb-grid">
              <SvgSurface {...surface} contentClassName="fb-card">
                <div className="fb-heading">
                  <div>
                    <code>01 / PROGRESS & METER</code>
                    <h2>От начала до результата</h2>
                  </div>
                  <Layers size={20} aria-hidden="true" />
                </div>
                <div className="fb-ring-row">
                  <ProgressRing
                    aria-label="Подготовка профиля"
                    value={value}
                    size={100}
                    thickness={7}
                    variant="segmented"
                  >
                    <span className="fb-ring-number">
                      {value}
                      <small>%</small>
                    </span>
                  </ProgressRing>
                  <div>
                    <StatusDot
                      tone={value === 100 ? "success" : "accent"}
                      label={value === 100 ? "Профиль подготовлен" : "Подготовка профиля"}
                      pulse={value < 100}
                      animation={animationMode}
                    />
                    <p className="fb-note">
                      Значение и сегменты меняются вместе. Кольцо остаётся читаемым без анимации.
                    </p>
                  </div>
                </div>
                <Progress
                  value={value}
                  label="Проверено маршрутов"
                  showValue
                  decoration="segments"
                  size="lg"
                  tone={value === 100 ? "success" : "accent"}
                  animation={animationMode}
                />
                <div className="fb-row">
                  <Button svgBorder="cut" onClick={() => setValue((v) => Math.min(100, v + 12))}>
                    Продвинуть
                  </Button>
                  <Button svgBorder="notch" onClick={() => setValue(100)}>
                    Завершить
                  </Button>
                  <Button svgBorder="soft" onClick={() => setValue(0)}>
                    Сбросить
                  </Button>
                </div>
                <Meter
                  value={72}
                  label="Место в хранилище"
                  showValue
                  decoration="ticks"
                  size="lg"
                  low={70}
                  high={90}
                  optimum={0}
                />
                <Meter
                  label="Использование места"
                  aria-label="Использование места по категориям"
                  decoration="segments"
                  sections={[
                    { value: 34, label: "Данные", color: "var(--rk-accent)" },
                    { value: 21, label: "Кэш", color: "var(--rk-secondary)" },
                    { value: 17, label: "Индексы", color: "var(--rk-detail)" },
                  ]}
                  size="lg"
                />
              </SvgSurface>
              <SvgSurface {...surface} shape="ticket" contentClassName="fb-card">
                <div className="fb-heading">
                  <div>
                    <code>02 / STATUS & BADGE</code>
                    <h2>Различимы без догадок</h2>
                  </div>
                  <ShieldCheck size={20} aria-hidden="true" />
                </div>
                <div className="fb-badges">
                  {STATUSES.map(({ tone, label }) => (
                    <Badge
                      key={tone}
                      tone={tone}
                      svgBorder="cut"
                      icon={
                        tone === "success" ? (
                          <Check size={12} />
                        ) : tone === "info" ? (
                          <CircleHelp size={12} />
                        ) : undefined
                      }
                      dot={tone !== "success" && tone !== "info"}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
                <div className="fb-badges">
                  {STATUSES.map(({ tone, label }) => (
                    <Badge key={tone} tone={tone} variant="outline" svgBorder="notch">
                      {label}
                    </Badge>
                  ))}
                </div>
                <div className="fb-row">
                  <StatusDot label="Соединение активно" pulse animation={animationMode} />
                  <StatusDot tone="warn" label="Есть предупреждение" />
                </div>
                <div className="fb-row">
                  <Indicator
                    count={unread}
                    label={`Непрочитанных уведомлений: ${unread}`}
                    pulse
                    animation={animationMode}
                  >
                    <IconButton
                      label="Прочитать уведомления"
                      icon={<Bell size={18} />}
                      svgBorder="ticket"
                      onClick={() => {
                        setUnread(0);
                        setNotice("Все уведомления прочитаны");
                      }}
                    />
                  </Indicator>
                  <Button size="sm" svgBorder="soft" onClick={() => setUnread(8)}>
                    Добавить уведомления
                  </Button>
                  {tag && (
                    <Badge
                      tone="accent"
                      svgBorder="ticket"
                      onRemove={() => setTag(false)}
                      removeLabel="Удалить метку профиля"
                    >
                      Рабочий профиль
                    </Badge>
                  )}
                </div>
                <p className="fb-note">
                  У каждого состояния есть подпись. Тон не подменяет статус, числовой индикатор имеет полное
                  текстовое имя.
                </p>
              </SvgSurface>
              <SvgSurface {...surface} contentClassName="fb-card">
                <div className="fb-heading">
                  <div>
                    <code>03 / LOADING & BUSY</code>
                    <h2>Работа продолжается</h2>
                  </div>
                  <RefreshCw size={20} aria-hidden="true" />
                </div>
                <div className="fb-row">
                  <Spinner variant="orbit" size={30} animation={animationMode} />
                  <Spinner size={20} animation={animationMode} />
                  <span>Получаем параметры подключения</span>
                </div>
                <Progress
                  label="Ожидание ответа шлюза"
                  decoration="ticks"
                  animation={animationMode}
                  size="lg"
                />
                <BusyOverlay
                  busy={busy}
                  label="Обновление параметров"
                  svgBorder="ticket"
                  animation={animationMode}
                  blur
                >
                  <div className="fb-stale">
                    <Field label="Название профиля">
                      <Input defaultValue="Северный маршрут" name="feedbackProfile" svgBorder="notch" />
                    </Field>
                    <Skeleton lines={2} animation={animationMode} />
                    <Button svgBorder="cut" onClick={() => setNotice("Профиль применён")}>
                      Применить профиль
                    </Button>
                  </div>
                </BusyOverlay>
                <Button svgBorder="cut" onClick={() => setBusy((v) => !v)}>
                  {busy ? "Закончить обновление" : "Начать обновление"}
                </Button>
                <p className="fb-note">
                  Во время обновления содержимое сохраняется и становится inert. Кнопка завершения остаётся
                  снаружи.
                </p>
              </SvgSurface>
              <SvgSurface {...surface} shape="corner" contentClassName="fb-card">
                <div className="fb-heading">
                  <div>
                    <code>04 / DATA STATE</code>
                    <h2>Сразу понятен следующий шаг</h2>
                  </div>
                  <CircleHelp size={20} aria-hidden="true" />
                </div>
                <Field label="Состояние данных">
                  <NativeSelect
                    value={state}
                    onChange={(event) => setState(event.target.value as DataStatus)}
                    options={[
                      { value: "loading", label: "Загрузка" },
                      { value: "error", label: "Ошибка" },
                      { value: "empty", label: "Пусто" },
                      { value: "ready", label: "Готово" },
                    ]}
                  />
                </Field>
                <div className="fb-state">
                  <DataState
                    status={state}
                    animation={animationMode}
                    surface={{ shape: "bevel", padding: 20, shadow: 0.1 }}
                    svgBorder="cut"
                    error="Шлюз не ответил. Проверьте соединение и повторите запрос."
                    onRetry={() => {
                      setState("ready");
                      setNotice("Повторная проверка завершена");
                    }}
                    skeleton={
                      <div className="fb-placeholder">
                        <Skeleton width={120} height={22} animation={animationMode} />
                        <Skeleton lines={3} animation={animationMode} />
                      </div>
                    }
                    emptyState={{
                      title: "Маршрутов пока нет",
                      hint: "Добавьте профиль для первого подключения.",
                      action: (
                        <Button svgBorder="cut" onClick={() => setState("ready")}>
                          Добавить профиль
                        </Button>
                      ),
                    }}
                  >
                    <Callout
                      tone="success"
                      title="Маршрут доступен"
                      surface={{ shape: "bevel", padding: 20, shadow: 0.1 }}
                    >
                      Параметры получены. Можно продолжить работу.
                    </Callout>
                  </DataState>
                </div>
                <p className="fb-note">
                  Загрузка, ошибка, пустой результат и готовность используют один контракт. Повтор вызывается
                  приложением.
                </p>
              </SvgSurface>
              <div className="fb-wide fb-card">
                {warning ? (
                  <Callout
                    tone="warn"
                    title="Есть изменения маршрутизации"
                    surface={{ shape: "saddle", padding: 24, shadow: 0.2 }}
                    onDismiss={() => setWarning(false)}
                    actions={
                      <Button
                        size="sm"
                        svgBorder="cut"
                        onClick={() => {
                          setNotice("Изменения маршрутизации подтверждены");
                          setWarning(false);
                        }}
                      >
                        Подтвердить изменения
                      </Button>
                    }
                  >
                    Два правила используют резервный шлюз. Проверьте порядок перед применением.
                  </Callout>
                ) : (
                  <EmptyState
                    title="Все проверки завершены"
                    tone="success"
                    size="sm"
                    surface={surface}
                    action={
                      <Button size="sm" svgBorder="cut" onClick={() => setWarning(true)}>
                        Показать предупреждение
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
            <p className="fb-status" role="status">
              {notice}
            </p>
          </div>
        </div>
      </Scope>
    </LabelsContext>
  );
}
