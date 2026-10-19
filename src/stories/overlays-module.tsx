import {
  Bell,
  Check,
  Command as CommandIcon,
  ExternalLink,
  Layers,
  PanelRight,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../controls/button";
import { ChipGroup, Switch } from "../controls/choice";
import { Input } from "../controls/input";
import { NativeSelect } from "../controls/native-select";
import { Field } from "../forms/field";
import { Form } from "../forms/form";
import { ru } from "../labels/ru";
import { PageHeader } from "../layout/page";
import { SvgBackdrop } from "../layout/svg-backdrop";
import { SvgSurface } from "../layout/svg-surface";
import { useControllable, useHotkey } from "../lib/hooks";
import { LabelsContext } from "../lib/labels";
import type { SvgControlBorder, SvgShape } from "../lib/svg-geometry";
import {
  CommandPalette,
  ConfirmHost,
  confirm,
  Dialog,
  type DialogProps,
  HoverCard,
  Popover,
  prompt,
  ShortcutsSheet,
  Toaster,
  type ToastInput,
  Tooltip,
  Tour,
  toast,
} from "../overlays/index";
import { SIGNAL_PALETTES, type SignalPaletteId } from "../theme/palettes";
import { Scope } from "../theme/provider";
import { useMotionStudy } from "./motion-settings";
import "../fonts.css";
import "../css/overlays.css";
import "../css/layout.css";
import "../../.ladle/overlays-module.css";

/** Native top-layer components with one optional SVG material and shared motion settings. */
export function OverlaysModule({
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
  const [border, setBorder] = useState<SvgControlBorder>("notch");
  const [svg, setSvg] = useState(true),
    [rounded, setRounded] = useState(true),
    [motion, setMotion] = useState(true);
  const animation = useMotionStudy(motion, svg, style);
  const [placement, setPlacement] = useState<DialogProps["placement"] | null>(null);
  const [commandOpen, setCommandOpen] = useState(false),
    [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [stack, setStack] = useState(true);
  const [tour, setTour] = useState(false);
  const tourStart = useRef<HTMLButtonElement>(null);
  const tourDialog = useRef<HTMLButtonElement>(null);
  const [tags, setTags] = useState(["personal"]);
  const [pendingToast, setPendingToast] = useState<string | null>(null);
  const [status, setStatus] = useState("Выберите компонент для проверки");
  const toastIds = useRef(new Set<string>());
  useEffect(() => {
    const ids = toastIds.current;
    return () => {
      for (const id of ids) toast.dismiss(id);
    };
  }, []);
  useHotkey("mod+k", () => setCommandOpen((open) => !open), {
    description: "Открыть палитру команд",
    group: "Рабочее пространство",
  });
  useHotkey("mod+shift+o", () => setPlacement("right"), {
    description: "Открыть панель параметров",
    group: "Рабочее пространство",
  });
  const surface = { shape, padding: 24, depth: 0.5, shadow: 0.25 };
  const showToast = (item: ToastInput) => {
    const id = toast(item);
    toastIds.current.add(id);
    return id;
  };
  const askConfirm = async () => {
    const ok = await confirm({
      title: "Очистить историю примера?",
      description: "Это демонстрация подтверждения. Данные приложения не затрагиваются.",
      tone: "danger",
      confirmLabel: "Очистить историю",
    });
    setStatus(ok ? "История примера очищена" : "Очистка отменена");
  };
  const askName = async () => {
    const name = await prompt({
      title: "Переименовать профиль",
      label: "Новое название",
      defaultValue: "Северный маршрут",
      confirmLabel: "Переименовать",
      validate: (value) => (value.trim().length < 3 ? "Введите минимум 3 символа" : undefined),
    });
    setStatus(name ? `Профиль переименован: ${name}` : "Переименование отменено");
  };
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
        <div className="om-study">
          <div className="om-settings">
            {animation.settings}
            <Field label="Палитра overlays">
              <NativeSelect
                value={palette}
                options={SIGNAL_PALETTES.map((p) => ({ value: p.id, label: p.name }))}
                onChange={(event) => {
                  const next = event.target.value as SignalPaletteId;
                  animation.transition(() => setPalette(next));
                }}
              />
            </Field>
            <Field label="Подстиль overlays">
              <NativeSelect
                value={style}
                options={[
                  { value: "rootik", label: "Rootik" },
                  { value: "fluent", label: "Fluent" },
                ]}
                onChange={(event) => setStyle(event.target.value as typeof style)}
              />
            </Field>
            <Field label="Форма окон">
              <NativeSelect
                value={shape}
                options={["rounded", "bevel", "saddle", "ticket", "corner"].map((value) => ({
                  value,
                  label: value,
                }))}
                onChange={(event) => setShape(event.target.value as SvgShape)}
              />
            </Field>
            <Field label="Контур действий">
              <NativeSelect
                value={border}
                options={["soft", "cut", "notch", "ticket"].map((value) => ({ value, label: value }))}
                onChange={(event) => setBorder(event.target.value as SvgControlBorder)}
              />
            </Field>
            <Switch
              label="Тёмная overlays"
              checked={mode === "dark"}
              onChange={(event) => {
                const next = event.target.checked ? "dark" : "light";
                animation.transition(() => setMode(next));
              }}
            />
            <Switch
              label="SVG-контуры overlays"
              checked={svg && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setSvg(event.target.checked)}
            />
            <Switch
              label="Скругления overlays"
              checked={rounded && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setRounded(event.target.checked)}
            />
            <Switch
              label="Анимация overlays"
              checked={motion}
              onChange={(event) => setMotion(event.target.checked)}
            />
          </div>
          <div className="om-canvas">
            <SvgBackdrop pattern="dots" opacity={0.1} animated={animation.values.effects !== "off"} />
            <PageHeader
              title="Поверх рабочего пространства."
              description="Диалоги, панели и уведомления с единым материалом. Контекст остаётся, фокус возвращается."
            />
            <div className="om-grid">
              <SvgSurface {...surface} contentClassName="om-card">
                <div className="om-heading">
                  <code>01 / DIALOG & DRAWER</code>
                  <Layers size={20} aria-hidden="true" />
                </div>
                <h2>Пауза для решения.</h2>
                <p>Обычное окно или панель у края. Escape закрывает окно и возвращает к действию.</p>
                <Button
                  variant="primary"
                  svgBorder={border}
                  icon={<ExternalLink size={16} />}
                  ref={tourDialog}
                  onClick={() => setPlacement("center")}
                >
                  Открыть диалог
                </Button>
                <div className="om-row">
                  {(["right", "left", "bottom"] as const).map((edge) => (
                    <Button
                      key={edge}
                      svgBorder={border}
                      icon={<PanelRight size={16} />}
                      onClick={() => setPlacement(edge)}
                    >
                      {edge === "right" ? "Справа" : edge === "left" ? "Слева" : "Снизу"}
                    </Button>
                  ))}
                </div>
              </SvgSurface>
              <SvgSurface {...surface} shape="ticket" contentClassName="om-card">
                <div className="om-heading">
                  <code>02 / POPOVER & HINT</code>
                  <Search size={20} aria-hidden="true" />
                </div>
                <h2>Детали по запросу.</h2>
                <p>Привязка к кнопке, вложенные поля и подсказки с клавиатуры.</p>
                <div className="om-row">
                  <Popover
                    surface={surface}
                    title="Фильтры пространства"
                    trigger={<Button svgBorder={border}>Открыть фильтры</Button>}
                  >
                    <div className="om-popover-content">
                      <Field label="Поиск в фильтрах">
                        <Input svgBorder={border} placeholder="Название или метка" />
                      </Field>
                      <Field label="Метки фильтра">
                        <ChipGroup
                          svgBorder={border}
                          value={tags}
                          onChange={setTags}
                          options={[
                            { value: "personal", label: "Личный" },
                            { value: "work", label: "Рабочий" },
                            { value: "test", label: "Тестовый" },
                          ]}
                        />
                      </Field>
                      <small>Выбрано меток: {tags.length}</small>
                    </div>
                  </Popover>
                  <Tooltip
                    content="Подсказка доступна по наведению и фокусу"
                    shortcut="Tab"
                    surface={{ ...surface, padding: 12, glass: false, opacity: 1 }}
                  >
                    <Button svgBorder={border}>Подсказка</Button>
                  </Tooltip>
                  <HoverCard
                    surface={surface}
                    openDelay={200}
                    content={
                      <div className="om-popover-content">
                        <strong>Северный шлюз</strong>
                        <p>Параметры доступны без ухода с текущего экрана.</p>
                        <Button svgBorder={border} onClick={() => setStatus("Профиль шлюза выбран")}>
                          Выбрать шлюз
                        </Button>
                      </div>
                    }
                  >
                    <Button svgBorder={border}>Карточка шлюза</Button>
                  </HoverCard>
                </div>
              </SvgSurface>
              <SvgSurface {...surface} shape="saddle" contentClassName="om-card">
                <div className="om-heading">
                  <code>03 / COMMAND & CONFIRM</code>
                  <CommandIcon size={20} aria-hidden="true" />
                </div>
                <h2>Действие без поиска.</h2>
                <p>Команды, подтверждение опасной операции и ввод с проверкой.</p>
                <div className="om-row">
                  <Button svgBorder={border} onClick={() => setCommandOpen(true)}>
                    Палитра команд
                  </Button>
                  <Button svgBorder={border} onClick={() => setShortcutsOpen(true)}>
                    Горячие клавиши
                  </Button>
                  <Button svgBorder={border} onClick={askName}>
                    Переименовать профиль
                  </Button>
                  <Button svgBorder={border} variant="danger" onClick={askConfirm}>
                    Очистить историю
                  </Button>
                </div>
              </SvgSurface>
              <SvgSurface {...surface} shape="corner" contentClassName="om-card">
                <div className="om-heading">
                  <code>04 / TOAST</code>
                  <Bell size={20} aria-hidden="true" />
                </div>
                <h2>Результат остаётся рядом.</h2>
                <p>
                  Ошибки и сообщения с действием ждут решения. Наведение и фокус приостанавливают закрытие.
                </p>
                <div className="om-row">
                  <Button
                    svgBorder={border}
                    onClick={() =>
                      showToast({
                        title: "Профиль сохранён",
                        description: "Настройки доступны в рабочем пространстве",
                        tone: "success",
                      })
                    }
                  >
                    Успешно
                  </Button>
                  <Button
                    svgBorder={border}
                    onClick={() =>
                      showToast({
                        title: "Шлюз недоступен",
                        description: "Проверьте параметры и повторите подключение",
                        tone: "danger",
                      })
                    }
                  >
                    Ошибка
                  </Button>
                  <Button
                    svgBorder={border}
                    onClick={() =>
                      showToast({
                        title: "Метка удалена",
                        action: { label: "Вернуть", onClick: () => setStatus("Метка восстановлена") },
                      })
                    }
                  >
                    С действием
                  </Button>
                  <Button
                    svgBorder={border}
                    onClick={() => {
                      if (pendingToast) {
                        showToast({ id: pendingToast, title: "Проверка завершена", tone: "success" });
                        setPendingToast(null);
                      } else setPendingToast(showToast({ title: "Проверяем профиль…", loading: true }));
                    }}
                  >
                    {pendingToast ? "Завершить проверку" : "Начать проверку"}
                  </Button>
                </div>
                <Switch
                  label="Стопка уведомлений"
                  checked={stack}
                  onChange={(event) => setStack(event.target.checked)}
                />
              </SvgSurface>
            </div>
            <div className="om-status" role="status">
              <Check size={16} aria-hidden="true" />
              <span>{status}</span>
              <code>/overlays</code>
            </div>
          </div>
          {placement && (
            <Dialog
              placement={placement}
              surface={surface}
              title={placement === "center" ? "Параметры подключения" : "Панель параметров"}
              description="Изменения сохраняются только в этом примере."
              onClose={() => setPlacement(null)}
              footer={
                <>
                  <Button svgBorder={border} onClick={() => setPlacement(null)}>
                    Отмена
                  </Button>
                  <Button type="submit" form="overlay-connection" variant="primary" svgBorder={border}>
                    Сохранить подключение
                  </Button>
                </>
              }
            >
              <Form
                id="overlay-connection"
                onSubmit={(data) => {
                  setStatus(`Подключение «${data.get("name")}» сохранено`);
                  setPlacement(null);
                }}
              >
                <Field label="Имя подключения" required>
                  <Input name="name" defaultValue="Северный шлюз" required minLength={3} svgBorder={border} />
                </Field>
                <Field label="Адрес шлюза" required>
                  <Input name="endpoint" defaultValue="north.edge.local" required svgBorder={border} mono />
                </Field>
                <div className="om-row">
                  <Switch
                    label="SVG в окне"
                    checked={svg && style !== "fluent"}
                    disabled={style === "fluent"}
                    onChange={(event) => setSvg(event.target.checked)}
                  />
                  <Switch
                    label="Анимация в окне"
                    checked={motion}
                    onChange={(event) => setMotion(event.target.checked)}
                  />
                </div>
                <Popover
                  surface={{ ...surface, padding: 20 }}
                  title="Дополнительная информация"
                  trigger={<Button svgBorder={border}>Детали внутри окна</Button>}
                >
                  <p className="om-note">
                    Вложенная панель сохраняет цветовую схему окна и доступна с клавиатуры.
                  </p>
                </Popover>
                <Button
                  svgBorder={border}
                  onClick={() =>
                    showToast({
                      title: "Параметры проверены",
                      description: "Уведомление доступно поверх открытого окна",
                      tone: "success",
                    })
                  }
                >
                  Уведомление поверх окна
                </Button>
              </Form>
            </Dialog>
          )}
          <CommandPalette
            surface={surface}
            open={commandOpen}
            onClose={() => setCommandOpen(false)}
            commands={[
              {
                id: "profile",
                label: "Открыть параметры подключения",
                group: "Рабочее пространство",
                icon: <PanelRight size={16} />,
                shortcut: "mod+shift+o",
                run: () => setPlacement("right"),
              },
              {
                id: "save",
                label: "Сохранить текущий профиль",
                group: "Рабочее пространство",
                icon: <ShieldCheck size={16} />,
                run: () => setStatus("Текущий профиль сохранён"),
              },
              {
                id: "locked",
                label: "Экспорт недоступен",
                group: "Другие действия",
                disabled: true,
                run: () => undefined,
              },
            ]}
          />
          <Tour
            open={tour}
            onClose={() => setTour(false)}
            surface={surface}
            steps={[
              {
                target: () => tourStart.current,
                title: "Короткий обзор",
                content: "Нативная плавающая панель. Стрелки переключают шаги, Escape закрывает обзор.",
              },
              {
                target: () => tourDialog.current,
                title: "Один контракт поверхности",
                content: "SVG, безопасные отступы и анимация используют общие настройки модуля.",
              },
            ]}
          />
          <ShortcutsSheet
            surface={surface}
            hotkey={false}
            open={shortcutsOpen}
            onOpenChange={setShortcutsOpen}
          />
          <Button ref={tourStart} svgBorder={border} onClick={() => setTour(true)}>
            Обзор интерфейса
          </Button>
          <ConfirmHost surface={surface} svgBorder={border} />
          <Toaster surface={surface} stack={stack} max={3} />
        </div>
      </Scope>
    </LabelsContext>
  );
}
