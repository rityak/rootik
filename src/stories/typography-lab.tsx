import { ArrowRight, Check, Search } from "lucide-react";
import { type CSSProperties, useState } from "react";
import { Button, Field, IconButton, Input, Select, Slider, SvgSurface, Switch } from "..";
import { type SvgPaletteId, svgPalettes } from "./svg-palettes";
import {
  cyrillicProbe,
  type DisplayTypefaceId,
  type MonoTypefaceId,
  typefaces,
  typeScale,
  type UiTypefaceId,
} from "./typography-model";
import "@fontsource-variable/inter/standard.css";
import "@fontsource-variable/inter/standard-italic.css";
import "@fontsource-variable/rubik";
import "@fontsource-variable/rubik/wght-italic.css";
import "@fontsource-variable/onest";
import "@fontsource-variable/golos-text";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/jetbrains-mono/wght-italic.css";
import "@fontsource-variable/literata/standard.css";
import "@fontsource-variable/literata/standard-italic.css";
import "@fontsource-variable/geist/wght-italic.css";
import "@fontsource-variable/geist-mono/wght-italic.css";
import "../../.ladle/svg-lab.css";
import "../../.ladle/typography-lab.css";

const weightSamples = [400, 500, 600, 700];
const sampleRows = [
  { city: "Москва", id: "RU-01", latency: "7", traffic: "1 284,04" },
  { city: "Санкт-Петербург", id: "RU-02", latency: "24", traffic: "128,40" },
  { city: "Владивосток", id: "RU-03", latency: "108", traffic: "8,05" },
];

export function TypographyLab() {
  const [family, setFamily] = useState<UiTypefaceId>(() => {
    const query =
      typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("font");
    const font = typefaces.find((item) => item.id === query);
    return font && font.id !== "literata" ? font.id : "system";
  });
  const [mono, setMono] = useState<MonoTypefaceId>("system");
  const [display, setDisplay] = useState<DisplayTypefaceId>("ui");
  const [palette, setPalette] = useState<SvgPaletteId>(() => {
    const query =
      typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("palette");
    return svgPalettes.find((item) => item.id === query)?.id ?? "maomao";
  });
  const [size, setSize] = useState(14);
  const [weight, setWeight] = useState(400);
  const [tabular, setTabular] = useState(true);
  const [ligatures, setLigatures] = useState(false);
  const [saved, setSaved] = useState(false);
  const selected = typefaces.find((font) => font.id === family) ?? typefaces[0];
  const italic = display !== "ui" || selected.italic;
  const vars = {
    "--rk-font-size": `${size}px`,
    "--rt-body-weight": weight,
    "--rt-numbers": tabular ? "tabular-nums lining-nums" : "proportional-nums lining-nums",
    "--rt-ligatures": ligatures ? "common-ligatures contextual" : "none",
  } as CSSProperties;
  const applyPreset = (preset: "system" | "precision" | "soft") => {
    setFamily(preset === "precision" ? "rubik" : preset === "soft" ? "onest" : "system");
    setMono(preset === "system" ? "system" : "jetbrains");
    setDisplay(preset === "soft" ? "literata" : "ui");
    setSize(14);
    setWeight(400);
  };
  return (
    <div
      className="rx-lab rt-lab"
      data-palette={palette}
      data-family={family}
      data-mono={mono}
      data-display={display}
      data-italic={italic}
      style={vars}
    >
      <div className="rt-intro">
        <span className="rt-kicker">ROOTIK / TYPE STUDY / RU + EN</span>
        <h2>Буквы держат интерфейс.</h2>
        <p>Один текст и одни контролы. Меняем рисунок, вес и ритм — сравниваем читаемость.</p>
      </div>
      <fieldset className="rt-presets" aria-label="Typography presets">
        <Button svgBorder="soft" onClick={() => applyPreset("system")}>
          Системные
        </Button>
        <Button svgBorder="soft" variant="primary" onClick={() => applyPreset("precision")}>
          Rubik + JetBrains
        </Button>
        <Button svgBorder="soft" onClick={() => applyPreset("soft")}>
          Onest + Literata
        </Button>
      </fieldset>
      <section className="rt-settings" aria-label="Typography settings">
        <Field label="Шрифт интерфейса">
          <Select
            value={family}
            onChange={setFamily}
            options={typefaces
              .filter((font) => font.id !== "literata")
              .map((font) => ({ value: font.id, label: font.name }))}
          />
        </Field>
        <Field label="Моноширинный">
          <Select
            value={mono}
            onChange={setMono}
            options={[
              { value: "system", label: "System Mono" },
              { value: "jetbrains", label: "JetBrains Mono" },
              { value: "geist", label: "Geist Mono" },
            ]}
          />
        </Field>
        <Field label="Акцентные заголовки">
          <Select
            value={display}
            onChange={setDisplay}
            options={[
              { value: "ui", label: "Как интерфейс" },
              { value: "literata", label: "Literata" },
              { value: "system", label: "System Serif" },
            ]}
          />
        </Field>
        <Field label="Палитра">
          <Select
            value={palette}
            onChange={setPalette}
            options={svgPalettes.map((item) => ({ value: item.id, label: item.name }))}
          />
        </Field>
        <Slider
          label="Размер основного текста"
          value={size}
          onChange={setSize}
          min={13}
          max={16}
          step={0.5}
          showValue={(value) => `${value} px`}
        />
        <Slider
          label="Вес основного текста"
          value={weight}
          onChange={setWeight}
          min={400}
          max={600}
          step={50}
          showValue
        />
        <Switch
          label="Табличные цифры"
          checked={tabular}
          onChange={(event) => setTabular(event.target.checked)}
        />
        <Switch
          label="Лигатуры в коде"
          checked={ligatures}
          onChange={(event) => setLigatures(event.target.checked)}
        />
      </section>
      <div className="rt-live-heading">
        <h2>В интерфейсе</h2>
        <span>
          {selected.name} / {size} px / {weight}
        </span>
      </div>
      <section className="rt-live" aria-label="Live typography specimen">
        <SvgSurface className="rt-hero" shape="corner" padding={32} depth={0.8} shadow={0.25}>
          <span className="rt-kicker">СЕВЕРНЫЙ ШЛЮЗ / РАБОЧЕЕ ПРОСТРАНСТВО</span>
          <h2>
            Форма. Ритм.
            <br />
            <em>Характер.</em>
          </h2>
          <p className="rt-body">
            Связь остаётся понятной, когда подписи, числа и действия говорят на одном языке.
          </p>
          <div className="rt-metric">
            <strong>128,4</strong>
            <span>
              ГБ передано
              <br />
              за последние сутки
            </span>
          </div>
          <div className="rt-hero-actions">
            <Button
              svgBorder="cut"
              variant="primary"
              icon={<Check size={15} />}
              onClick={() => setSaved(!saved)}
            >
              {saved ? "Сохранено" : "Сохранить"}
            </Button>
            <span className="rt-status">
              <i />
              Защищён
            </span>
          </div>
        </SvgSurface>
        <div className="rt-panel rt-form">
          <span className="rt-kicker">ПЛОТНЫЙ UI / НЕ КАРТИНКА</span>
          <h3>Параметры подключения</h3>
          <p className="rt-body">Длинные русские подписи проверяем рядом с настоящими полями и кнопками.</p>
          <Field label="Имя подключения" hint="От 3 до 64 символов. Можно использовать кириллицу.">
            <Input
              svgBorder="notch"
              defaultValue="Северный шлюз · Москва"
              onChange={() => setSaved(false)}
              icon={<Search size={15} />}
            />
          </Field>
          <Field label="Поиск по журналу">
            <Input svgBorder="soft" placeholder="Найти событие или идентификатор" />
          </Field>
          <div className="rt-form-actions">
            <Button svgBorder="soft" iconEnd={<ArrowRight size={14} />} onClick={() => setSaved(true)}>
              Применить изменения
            </Button>
            <IconButton
              svgBorder="cut"
              variant="outline"
              label="Подтвердить настройки"
              icon={<Check size={15} />}
              tooltip={false}
              onClick={() => setSaved(true)}
            />
          </div>
        </div>
      </section>
      <section className="rt-data-grid" aria-label="Numbers and code">
        <div className="rt-panel rt-table-panel">
          <div className="rt-section-head">
            <h3>Цифры в колонках</h3>
            <span>1 111,11 / 8 888,88</span>
          </div>
          <div className="rt-number-probe">
            <span>1 111,11</span>
            <span>8 888,88</span>
          </div>
          <div className="rt-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Узел</th>
                  <th>Задержка, мс</th>
                  <th>Трафик, ГБ</th>
                </tr>
              </thead>
              <tbody>
                {sampleRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.city}
                      <small>{row.id}</small>
                    </td>
                    <td>{row.latency}</td>
                    <td>{row.traffic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rt-caption">
            Для сравнения чисел важнее одинаковая ширина цифр, чем моноширинный шрифт всего интерфейса.
          </p>
        </div>
        <div className="rt-panel rt-code-panel">
          <div className="rt-section-head">
            <h3>Логи и идентификаторы</h3>
            <span>0O · 1Il · З3 · В8</span>
          </div>
          <pre>
            <code>
              {
                '14:08:32  INFO  Подключение установлено\nnode_id = "RU-01-NORTH"\nif (latency <= 24 && retries != 0) {\n  route => "Москва → Токио"\n}\n0O 1Il 0123456789 / Ёжик № 42'
              }
            </code>
          </pre>
          <p className="rt-caption">Лигатуры меняют только рисунок. Символы в коде остаются прежними.</p>
        </div>
      </section>
      <section className="rt-panel rt-scale" aria-label="Type hierarchy">
        <div className="rt-section-head">
          <h3>Иерархия и ритм</h3>
          <span>Без сжатия букв в мелком тексте</span>
        </div>
        {typeScale.map((role) => (
          <div className="rt-scale-row" key={role.id}>
            <div>
              <span>{role.label}</span>
              <small>{role.usage}</small>
            </div>
            <p data-role={role.id}>{role.text}</p>
          </div>
        ))}
      </section>
      <div className="rt-live-heading">
        <h2>{typefaces.length} образцов · один текст</h2>
        <span>Подключённые семейства и системный набор</span>
      </div>
      <section className="rt-font-grid" aria-label="Typeface comparison">
        {typefaces.map((font) => (
          <article
            className="rt-font-card rt-panel"
            key={font.id}
            data-specimen={font.id}
            data-selected={font.id === family || (font.id === "literata" && display === "literata")}
          >
            <header>
              <h3>{font.name}</h3>
              <span>{font.role}</span>
              <small>
                {font.id === "system"
                  ? "Начертания зависят от ОС"
                  : `${font.min}–${font.max} · ${font.italic ? "Regular / Italic" : "Regular"}`}
              </small>
            </header>
            <div className="rt-font-sample">
              <h4>
                Ясный ритм.
                <br />
                Чёткий контур.
              </h4>
              <p>{cyrillicProbe}</p>
              <strong>Сильный акцент · Bold 700</strong>
              {font.italic ? (
                <>
                  <em>Настоящий курсив · Italic 400</em>
                  <em className="rt-bold-italic">Жирный курсив · Bold Italic 700</em>
                </>
              ) : (
                <span className="rt-no-italic">Настоящего курсива нет — наклон не имитируем.</span>
              )}
              <div className="rt-weights">
                {weightSamples.map((value) => (
                  <span key={value} style={{ fontWeight: value }}>
                    {value}
                    <br />
                    Аа Бб 08
                  </span>
                ))}
              </div>
              <div className="rt-glyphs">0ОO · 1Il · ДЛЖЩ · Ёё · № ₽</div>
            </div>
            <p className="rt-font-note">{font.note}</p>
            <footer>
              <Button
                size="sm"
                svgBorder="soft"
                active={font.id === family || (font.id === "literata" && display === "literata")}
                onClick={() => (font.id === "literata" ? setDisplay("literata") : setFamily(font.id))}
              >
                {font.id === "literata" ? "В заголовки" : `Применить ${font.name}`}
              </Button>
              <a href={font.source} target="_blank" rel="noreferrer">
                Источник ↗
              </a>
            </footer>
          </article>
        ))}
      </section>
      <aside className="rt-recommendation rt-panel">
        <span className="rt-kicker">РЕКОМЕНДАЦИЯ ДЛЯ ROOTIK</span>
        <h2>Rubik — чёткая форма. Onest — мягкий ритм.</h2>
        <p>
          Rubik добавляет самостоятельный рисунок интерфейса и настоящий курсив. Onest + Literata сохраняем
          как более мягкое направление. JetBrains используем в технических данных, Golos Text — для насыщенных
          кириллицей экранов. Системный стек — вариант без загрузки файлов и fallback для каждого семейства.
        </p>
        <p className="rt-caption">
          Шрифты загружаются локально из сборки, только когда нужны браузеру. В этом исследовании нет внешних
          CDN и искусственного курсива.
        </p>
      </aside>
    </div>
  );
}
