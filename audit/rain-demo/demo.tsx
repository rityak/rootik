import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, Layers3, Search, SlidersHorizontal, Workflow } from "lucide-react";
import { Button } from "../../src/components/button";
import { Checkbox, SegmentedControl, Switch } from "../../src/components/choice";
import { type Column, DataTable } from "../../src/components/data";
import { Dialog } from "../../src/components/dialog";
import { Field, Input } from "../../src/components/input";
import { NavItem } from "../../src/components/nav";
import { Select } from "../../src/components/select";
import { Slider } from "../../src/components/slider";
import { ru } from "../../src/labels/ru";
import { RootikProvider } from "../../src/theme/provider";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "../../src/styles.css";
import "./demo.css";

type JobStatus = "running" | "ready" | "queued" | "error";
type StatusFilter = "all" | JobStatus;
type Material = "solid" | "glass";
type Density = "compact" | "default";

interface Job {
  id: string;
  name: string;
  count: number;
  status: JobStatus;
  progress: number;
  updated: string;
}

const jobs: readonly Job[] = [
  {
    id: "DS-014",
    name: "Portraits / Anima",
    count: 18420,
    status: "running",
    progress: 72,
    updated: "Сейчас",
  },
  { id: "DS-013", name: "City at dusk", count: 12680, status: "ready", progress: 100, updated: "12 минут" },
  { id: "DS-012", name: "Rain archive", count: 8460, status: "running", progress: 38, updated: "Сейчас" },
  { id: "DS-011", name: "Evening studies", count: 5120, status: "queued", progress: 0, updated: "28 минут" },
  { id: "DS-010", name: "Hands & details", count: 2840, status: "error", progress: 64, updated: "42 минуты" },
  { id: "DS-009", name: "Validation set", count: 1120, status: "ready", progress: 100, updated: "1 час" },
];
const statusLabels: Record<JobStatus, string> = {
  running: "Обработка",
  ready: "Готово",
  queued: "В очереди",
  error: "Ошибка",
};
const statusOptions = [
  { value: "all" as const, label: "Все статусы" },
  ...Object.entries(statusLabels).map(([value, label]) => ({ value: value as JobStatus, label })),
];
const materialOptions = [
  { value: "solid" as const, label: "Solid" },
  { value: "glass" as const, label: "Glass" },
];
const densityOptions = [
  { value: "compact" as const, label: "Плотно" },
  { value: "default" as const, label: "Обычно" },
];
const batchOptions = [
  { value: "16", label: "16 изображений" },
  { value: "32", label: "32 изображения" },
  { value: "64", label: "64 изображения" },
];
const number = new Intl.NumberFormat("ru-RU");
const columns: Column<Job>[] = [
  {
    key: "name",
    header: "Набор данных",
    cell: (job) => <span className="job-name">{job.name}</span>,
    value: (job) => job.name,
    sortable: true,
  },
  {
    key: "count",
    header: "Файлы",
    cell: (job) => number.format(job.count),
    value: (job) => job.count,
    align: "end",
    mono: true,
    sortable: true,
  },
  {
    key: "status",
    header: "Статус",
    cell: (job) => (
      <span className="job-status" data-status={job.status}>
        <i aria-hidden="true" />
        {statusLabels[job.status]}
      </span>
    ),
  },
  {
    key: "progress",
    header: "Прогресс",
    cell: (job) => (
      <span className="job-progress">
        <span className="progress-track" aria-hidden="true">
          <span style={{ width: `${job.progress}%` }} />
        </span>
        <span>{job.progress}%</span>
      </span>
    ),
    align: "end",
  },
];

function Demo() {
  const [material, setMaterial] = useState<Material>("glass");
  const [density, setDensity] = useState<Density>("default");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Job>(jobs[0]!);
  const [profile, setProfile] = useState("Rain / balanced");
  const [batch, setBatch] = useState("32");
  const [threshold, setThreshold] = useState(75);
  const [automatic, setAutomatic] = useState(true);
  const [metadata, setMetadata] = useState(false);
  const [review, setReview] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [saved, setSaved] = useState(false);
  const visible = jobs.filter(
    (job) =>
      job.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) &&
      (status === "all" || job.status === status),
  );
  const size = density === "compact" ? "sm" : "md";

  return (
    <RootikProvider labels={ru} defaults={{ material: "solid" }}>
      <div className="rain-demo" data-rk-scope="" data-material={material} data-density={density}>
        <a className="skip-link" href="#jobs">
          К наборам данных
        </a>
        <aside className="sidebar material-panel" aria-label="Навигация">
          <div className="brand">
            <img className="brand-mark" src="./assets/rootik-mark.svg" width="36" height="36" alt="" />
            <span>
              rootik<span className="brand-caption">RAIN STUDY / 01</span>
            </span>
          </div>
          <div className="workspace">
            <span className="workspace-symbol" aria-hidden="true">
              A
            </span>
            <div>
              Archive studio<small>Локальное пространство</small>
            </div>
          </div>
          <nav>
            <span className="eyebrow">Рабочая среда</span>
            <NavItem
              label="Наборы данных"
              icon={<Layers3 />}
              href="#jobs"
              active
              trailing={<span className="nav-count">6</span>}
            />
            <NavItem label="Настройки" icon={<SlidersHorizontal />} href="#settings" />
            <NavItem label="Состояния UI" icon={<Workflow />} href="#states" />
          </nav>
          <div className="sidebar-foot">
            <span className="connection-dot" aria-hidden="true" />
            Локальная демка<span className="foot-version">v2 / concept</span>
          </div>
        </aside>

        <main>
          <header className="topbar">
            <div className="breadcrumb">
              Пространство<span>/</span>
              <span>Обзор</span>
            </div>
            <span className="study-label">Визуальный прототип · без сохранения</span>
          </header>
          <div className="page-heading">
            <div>
              <span className="eyebrow">Archive studio</span>
              <h1>Тихий порядок.</h1>
              <p>Данные, процессы и настройки в одном рабочем пространстве.</p>
            </div>
            <span className="edition">
              RAIN<span>01 — 06</span>
            </span>
          </div>

          <section className="demo-controls material-panel" aria-label="Параметры демки">
            <span className="control-caption">Посмотреть в работе</span>
            <div>
              <span>Материал</span>
              <SegmentedControl
                options={materialOptions}
                value={material}
                onChange={setMaterial}
                size="sm"
                aria-label="Материал"
              />
            </div>
            <div>
              <span>Плотность</span>
              <SegmentedControl
                options={densityOptions}
                value={density}
                onChange={setDensity}
                size="sm"
                aria-label="Плотность"
              />
            </div>
          </section>

          <div className="statistics" aria-label="Сводка">
            <div>
              <span>Всего файлов</span>
              <strong>
                48<span className="stat-space"> </span>640
              </strong>
              <small>В шести наборах</small>
            </div>
            <div>
              <span>В обработке</span>
              <strong>02</strong>
              <small>Два активных процесса</small>
            </div>
            <div>
              <span>Готовы к работе</span>
              <strong>
                14<span className="stat-space"> </span>800
              </strong>
              <small>Проверенные изображения</small>
            </div>
          </div>

          <div className="content-grid">
            <div className="data-column">
              <section id="jobs" className="content-panel">
                <header className="panel-heading">
                  <div>
                    <h2>Наборы данных</h2>
                    <p>Текущие задачи и состояние коллекций</p>
                  </div>
                  <span className="subtle-number">06</span>
                </header>
                <div className="table-tools">
                  <Input
                    type="search"
                    icon={<Search />}
                    aria-label="Поиск наборов"
                    placeholder="Найти набор…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    size={size}
                  />
                  <Select
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    aria-label="Фильтр статуса"
                    size={size}
                  />
                </div>
                <DataTable
                  columns={columns}
                  rows={visible}
                  rowKey={(job) => job.id}
                  selectedKey={selected.id}
                  onRowClick={setSelected}
                  density={density}
                  empty="Наборы не найдены"
                />
                <div className="table-caption" aria-live="polite">
                  Показано {visible.length} из {jobs.length}
                  <span>Выберите строку для просмотра</span>
                </div>
                <div className="selection-detail">
                  <div>
                    <span className="eyebrow">Выбранный набор · {selected.id}</span>
                    <h3>{selected.name}</h3>
                    <p>
                      {number.format(selected.count)} файлов<span>·</span>Обновление:{" "}
                      {selected.updated.toLocaleLowerCase()}
                    </p>
                  </div>
                  <span className="selection-percent">
                    {selected.progress}
                    <small>%</small>
                  </span>
                </div>
              </section>

              <section id="states" className="content-panel states-panel">
                <header className="panel-heading">
                  <div>
                    <h2>Контролы и состояния</h2>
                    <p>Один акцент, читаемые границы, спокойная иерархия</p>
                  </div>
                </header>
                <div className="button-samples">
                  <Button variant="primary" size={size} onClick={() => setDialog(true)}>
                    Основное действие
                  </Button>
                  <Button
                    variant="secondary"
                    size={size}
                    onClick={() => {
                      setQuery("");
                      setStatus("all");
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                  <Button
                    variant="outline"
                    size={size}
                    iconEnd={<ArrowUpRight />}
                    onClick={() =>
                      document
                        .getElementById("settings")
                        ?.scrollIntoView({ behavior: "instant", block: "center" })
                    }
                  >
                    К настройкам
                  </Button>
                  <Button disabled size={size}>
                    Недоступно
                  </Button>
                </div>
                <div className="states-footer">
                  <Checkbox
                    label="Проверять перед запуском"
                    checked={review}
                    onChange={(event) => setReview(event.target.checked)}
                  />
                  <span>
                    <kbd>Tab</kbd> для проверки фокуса
                  </span>
                </div>
              </section>
            </div>

            <section id="settings" className="content-panel settings-panel">
              <header className="panel-heading">
                <div>
                  <span className="eyebrow">Параметры обработки</span>
                  <h2>Спокойный режим</h2>
                  <p>Предсказуемо. Без лишнего шума.</p>
                </div>
              </header>
              <div className="settings-fields">
                <Field label="Название профиля">
                  <Input
                    value={profile}
                    onChange={(event) => {
                      setProfile(event.target.value);
                      setSaved(false);
                    }}
                    size={size}
                  />
                </Field>
                <Field label="Размер пакета" hint="Количество изображений за один проход">
                  <Select
                    options={batchOptions}
                    value={batch}
                    onChange={(value) => {
                      setBatch(value);
                      setSaved(false);
                    }}
                    size={size}
                  />
                </Field>
                <div className="threshold-field">
                  <Slider
                    label="Порог уверенности"
                    value={threshold}
                    onChange={(value) => {
                      setThreshold(value);
                      setSaved(false);
                    }}
                    min={40}
                    max={95}
                    showValue={(value) => `${value}%`}
                  />
                </div>
                <div className="setting-toggles">
                  <Switch
                    label="Автоматический запуск"
                    description="Продолжать очередь после завершения"
                    checked={automatic}
                    onChange={(event) => {
                      setAutomatic(event.target.checked);
                      setSaved(false);
                    }}
                    size="sm"
                  />
                  <Switch
                    label="Сохранять метаданные"
                    description="Добавлять параметры к результату"
                    checked={metadata}
                    onChange={(event) => {
                      setMetadata(event.target.checked);
                      setSaved(false);
                    }}
                    size="sm"
                  />
                </div>
                <Field label="Папка результатов" hint="В демке путь изменить нельзя">
                  <Input value="/archive/processed" readOnly disabled mono size={size} />
                </Field>
              </div>
              <footer className="settings-footer">
                <Button
                  variant="primary"
                  block
                  size={size}
                  onClick={() => setDialog(true)}
                  disabled={!profile.trim()}
                >
                  Применить настройки
                </Button>
                <p aria-live="polite">
                  {saved ? "Применено в текущей демке" : "Изменения действуют только в этой демке"}
                </p>
              </footer>
            </section>
          </div>
          <footer className="page-footer">
            <span>Rootik / Rain — исследование визуального языка</span>
            <span>Geist · graphite · muted iris</span>
          </footer>
        </main>

        <Dialog
          open={dialog}
          onClose={() => setDialog(false)}
          title="Применить профиль"
          description="Настройки изменят только состояние этой демки."
          size="sm"
          footer={
            <>
              <Button onClick={() => setDialog(false)}>Отмена</Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSaved(true);
                  setDialog(false);
                }}
              >
                Подтвердить
              </Button>
            </>
          }
        >
          <dl className="dialog-summary">
            <div>
              <dt>Профиль</dt>
              <dd>{profile || "Без названия"}</dd>
            </div>
            <div>
              <dt>Пакет</dt>
              <dd>{batch} изображения</dd>
            </div>
            <div>
              <dt>Уверенность</dt>
              <dd>{threshold}%</dd>
            </div>
            <div>
              <dt>Автозапуск</dt>
              <dd>{automatic ? "Включён" : "Выключен"}</dd>
            </div>
          </dl>
        </Dialog>
      </div>
    </RootikProvider>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Demo root is missing");
createRoot(root).render(<Demo />);
