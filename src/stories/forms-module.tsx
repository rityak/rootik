import { Check, Layers, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "../controls/button";
import { Switch } from "../controls/choice";
import { Input } from "../controls/input";
import { NativeSelect } from "../controls/native-select";
import { Field, Fieldset, Form, type Schema, SchemaForm, SettingsGroup, SettingsRow } from "../forms/index";
import { ru } from "../labels/ru";
import { PageHeader } from "../layout/page";
import { SvgArtwork } from "../layout/svg-artwork";
import { SvgBackdrop } from "../layout/svg-backdrop";
import { useControllable } from "../lib/hooks";
import { LabelsContext } from "../lib/labels";
import type { SvgControlBorder, SvgShape } from "../lib/svg-geometry";
import { SIGNAL_PALETTES, type SignalPaletteId } from "../theme/palettes";
import { Scope } from "../theme/provider";
import { useMotionStudy } from "./motion-settings";
import "../fonts.css";
import "../css/forms.css";
import "../css/layout.css";
import "../../.ladle/forms-module.css";

const CONNECTION: Schema = [
  {
    id: "gateway",
    title: "Профиль подключения",
    description: "Схема задаёт поля и правила, оформление остаётся общим.",
    fields: [
      {
        key: "name",
        type: "string",
        label: "Название профиля",
        hint: "От 3 до 40 символов",
        required: true,
        minLength: 3,
        maxLength: 40,
        default: "Северный маршрут",
      },
      {
        key: "region",
        type: "select",
        label: "Регион профиля",
        default: "north",
        options: [
          { value: "north", label: "Северная Европа" },
          { value: "east", label: "Восточная Азия" },
        ],
      },
      {
        key: "strategy",
        type: "select",
        label: "Стратегия",
        display: "segmented",
        default: "auto",
        options: [
          { value: "auto", label: "Авто" },
          { value: "manual", label: "Вручную" },
        ],
      },
      {
        key: "timeout",
        type: "number",
        label: "Таймаут",
        default: 15,
        min: 5,
        max: 120,
        unit: "с",
        required: true,
      },
      {
        key: "retry",
        type: "boolean",
        label: "Повторное подключение",
        default: true,
        children: [
          {
            key: "attempts",
            type: "number",
            label: "Число попыток",
            default: 3,
            min: 1,
            max: 10,
            required: true,
          },
          {
            key: "delay",
            type: "slider",
            label: "Пауза между попытками",
            default: 5,
            min: 1,
            max: 30,
            format: (value) => `${value} с`,
          },
        ],
      },
    ],
  },
  {
    id: "details",
    title: "Контекст профиля",
    fields: [
      {
        key: "tags",
        type: "multi",
        label: "Метки профиля",
        default: ["personal"],
        options: [
          { value: "personal", label: "Личный" },
          { value: "work", label: "Рабочий" },
          { value: "test", label: "Тестовый" },
        ],
      },
      {
        key: "color",
        type: "color",
        label: "Цвет метки",
        default: "#557fc1",
        swatches: [
          { value: "#557fc1", label: "Синий" },
          { value: "#a76282", label: "Розовый" },
          { value: "#50866e", label: "Зелёный" },
        ],
      },
      {
        key: "notes",
        type: "text",
        label: "Комментарий к профилю",
        default: "Основной маршрут для рабочего пространства.",
        maxLength: 200,
      },
    ],
  },
];

/** The public forms module, with native and schema-driven validation under the same appearance. */
export function FormsModule({
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
  const [svg, setSvg] = useState(true);
  const [rounded, setRounded] = useState(true);
  const [motion, setMotion] = useState(true);
  const animation = useMotionStudy(motion, svg, style);
  const [locked, setLocked] = useState(false);
  const [schemaLocked, setSchemaLocked] = useState(false);
  const [density, setDensity] = useState<"default" | "compact">("default");
  const [notifications, setNotifications] = useState(true);
  const [status, setStatus] = useState("Изменения остаются в этом примере");
  const surface = { shape, padding: 24, depth: 0.55, shadow: 0.2 };
  return (
    <LabelsContext value={ru}>
      <Scope
        values={{
          ...animation.values,
          palette,
          colorMode: mode,
          density,
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
        <div className="fm-study">
          <div className="fm-settings">
            {animation.settings}
            <Field label="Палитра forms">
              <NativeSelect
                value={palette}
                options={SIGNAL_PALETTES.map((p) => ({ value: p.id, label: p.name }))}
                onChange={(event) => {
                  const next = event.target.value as SignalPaletteId;
                  animation.transition(() => setPalette(next));
                }}
              />
            </Field>
            <Field label="Подстиль forms">
              <NativeSelect
                value={style}
                options={[
                  { value: "rootik", label: "Rootik" },
                  { value: "fluent", label: "Fluent" },
                ]}
                onChange={(event) => setStyle(event.target.value as typeof style)}
              />
            </Field>
            <Field label="Форма секций">
              <NativeSelect
                value={shape}
                options={["rounded", "bevel", "saddle", "ticket", "step"].map((value) => ({
                  value,
                  label: value,
                }))}
                onChange={(event) => setShape(event.target.value as SvgShape)}
              />
            </Field>
            <Field label="Контур полей forms">
              <NativeSelect
                value={border}
                options={["soft", "cut", "notch", "ticket"].map((value) => ({ value, label: value }))}
                onChange={(event) => setBorder(event.target.value as SvgControlBorder)}
              />
            </Field>
            <Switch
              label="Тёмная forms"
              checked={mode === "dark"}
              onChange={(event) => {
                const next = event.target.checked ? "dark" : "light";
                animation.transition(() => setMode(next));
              }}
            />
            <Switch
              label="SVG-контуры forms"
              checked={svg && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setSvg(event.target.checked)}
            />
            <Switch
              label="Скругления forms"
              checked={rounded && style !== "fluent"}
              disabled={style === "fluent"}
              onChange={(event) => setRounded(event.target.checked)}
            />
            <Switch
              label="Анимация forms"
              checked={motion}
              onChange={(event) => setMotion(event.target.checked)}
            />
          </div>
          <div className="fm-canvas">
            <SvgBackdrop pattern="dots" opacity={0.1} animated={animation.values.effects !== "off"} />
            <PageHeader
              title="Каждое поле на своём месте."
              description="Нативная проверка, понятные ошибки и единый материал для обычных и схемных форм."
            />
            <div className="fm-intro">
              <code>04 / FORMS</code>
              <span>Field · Form · Fieldset · Settings · Schema</span>
              <SvgArtwork variant="fold" className="fm-art" />
            </div>
            <div className="fm-grid">
              <Form
                aria-label="Рабочее пространство"
                className="fm-native"
                validate={(data) => ({
                  workspace:
                    String(data.get("workspace")).trim().length < 3
                      ? "Название должно содержать хотя бы 3 символа"
                      : undefined,
                })}
                onSubmit={(data) => setStatus(`Пространство «${data.get("workspace")}» сохранено в примере`)}
                onReset={() => setStatus("Поля пространства сброшены")}
              >
                <Fieldset
                  legend="Рабочее пространство"
                  description="Проверьте пустую отправку и возврат фокуса к ошибке."
                  surface={surface}
                >
                  <div className="fm-field-grid">
                    <Field
                      label="Название пространства"
                      required
                      hint="От 3 символов; например, Северная сеть"
                    >
                      <Input name="workspace" required svgBorder={border} placeholder="Северная сеть" />
                    </Field>
                    <Field label="Контактный email" required hint="Для уведомлений о состоянии">
                      <Input
                        name="email"
                        type="email"
                        required
                        svgBorder={border}
                        placeholder="name@example.com"
                      />
                    </Field>
                  </div>
                  <Field label="Описание пространства" hint="Необязательное поле">
                    <Input name="description" svgBorder={border} defaultValue="Мои устройства и маршруты" />
                  </Field>
                </Fieldset>
                <Fieldset
                  legend="Дополнительные параметры"
                  description="Заблокированные поля сохраняют значения и не отправляются."
                  surface={{ ...surface, shape: "ticket" }}
                  disabled={locked}
                >
                  <Field label="Шлюз по умолчанию">
                    <Input name="gateway" svgBorder={border} defaultValue="north.edge.local" mono />
                  </Field>
                  <Field label="Регион пространства">
                    <NativeSelect
                      name="region"
                      svgBorder={border}
                      defaultValue="north"
                      options={[
                        { value: "north", label: "Северная Европа" },
                        { value: "east", label: "Восточная Азия" },
                      ]}
                    />
                  </Field>
                </Fieldset>
                <div className="fm-actions">
                  <Button type="submit" variant="primary" icon={<Save size={16} />} svgBorder={border}>
                    Сохранить пространство
                  </Button>
                  <Button type="reset" variant="secondary" icon={<RotateCcw size={16} />} svgBorder={border}>
                    Сбросить пространство
                  </Button>
                </div>
              </Form>
              <div className="fm-side">
                <SettingsGroup
                  title="Поведение пространства"
                  description="Подпись и описание слева. Управление — в общей колонке."
                  surface={surface}
                  actions={<ShieldCheck size={20} aria-hidden="true" />}
                >
                  <SettingsRow label="Заблокировать параметры" hint="Отключает соседнюю секцию целиком">
                    <Switch checked={locked} onChange={(event) => setLocked(event.target.checked)} />
                  </SettingsRow>
                  <SettingsRow
                    label="Получать уведомления"
                    hint="Вложенные параметры появляются по запросу"
                    nested={
                      notifications && (
                        <SettingsRow label="Канал уведомлений">
                          <NativeSelect
                            aria-label="Канал уведомлений"
                            svgBorder={border}
                            options={[
                              { value: "system", label: "Системный" },
                              { value: "app", label: "В приложении" },
                            ]}
                          />
                        </SettingsRow>
                      )
                    }
                  >
                    <Switch
                      checked={notifications}
                      onChange={(event) => setNotifications(event.target.checked)}
                    />
                  </SettingsRow>
                  <SettingsRow label="Плотность формы">
                    <NativeSelect
                      svgBorder={border}
                      value={density}
                      options={[
                        { value: "default", label: "Обычная" },
                        { value: "compact", label: "Компактная" },
                      ]}
                      onChange={(event) => setDensity(event.target.value as typeof density)}
                    />
                  </SettingsRow>
                </SettingsGroup>
                <SettingsGroup
                  title="Опасная зона"
                  description="Отдельный смысловой тон. Действие доступно только по явному нажатию."
                  tone="danger"
                  surface={{ ...surface, shape: "corner" }}
                >
                  <SettingsRow
                    label="Очистить локальный пример"
                    hint="Сбросит сообщение внизу; данные приложения не затрагиваются"
                  >
                    <Button
                      variant="danger"
                      svgBorder={border}
                      onClick={() => setStatus("Локальное сообщение очищено")}
                    >
                      Очистить сообщение
                    </Button>
                  </SettingsRow>
                </SettingsGroup>
                <div className="fm-caption">
                  <Layers size={18} aria-hidden="true" />
                  <p>
                    Контур занимает отступы. Выключение SVG и анимаций сохраняет поля, значения и порядок Tab.
                  </p>
                </div>
              </div>
            </div>
            <div className="fm-schema-heading">
              <div>
                <code>SCHEMA / SAME COMPONENTS</code>
                <h2>Одна схема. Те же правила.</h2>
              </div>
              <Switch
                label="Заблокировать схему"
                checked={schemaLocked}
                onChange={(event) => setSchemaLocked(event.target.checked)}
              />
            </div>
            <SchemaForm
              aria-label="Схема профиля"
              schema={CONNECTION}
              surface={surface}
              svgBorder={border}
              layout="inline"
              className="fm-schema"
              disabled={schemaLocked}
              onSubmit={(values) =>
                setStatus(`Профиль «${values.name}» прошёл проверку и сохранён в примере`)
              }
              actions={
                <>
                  <Button type="reset" variant="secondary" svgBorder={border}>
                    Сбросить профиль
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={schemaLocked}
                    icon={<Check size={16} />}
                    svgBorder={border}
                  >
                    Проверить и сохранить профиль
                  </Button>
                </>
              }
            />
            <div className="fm-status" role="status">
              <Check size={16} aria-hidden="true" />
              <span>{status}</span>
              <code>/forms</code>
            </div>
          </div>
        </div>
      </Scope>
    </LabelsContext>
  );
}
