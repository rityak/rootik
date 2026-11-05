import type { Story } from "@ladle/react";
import {
  Archive,
  ArrowLeftRight,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Code2,
  FileText,
  Filter,
  History,
  Inbox,
  MessageSquare,
  Monitor,
  Network,
  PanelRight,
  Pencil,
  Plus,
  RefreshCw,
  RotateCw,
  Server,
  Settings,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  ChipGroup,
  CopyButton,
  Editable,
  IconButton,
  PageBody,
  SearchInput,
  Select,
  StatusBar,
  StatusDot,
  Switch,
  Table,
  TabPanel,
  Tabs,
  Textarea,
  TitleBar,
  toast,
} from "..";
import { Stage } from "./stage";
import "./support-workspace.css";

export default { title: "Layouts" };

const TAGS = [
  { value: "demo", label: "DEMO", count: 8 },
  { value: "new", label: "NEW", count: 3 },
  { value: "network", label: "NETWORK", count: 5 },
  { value: "billing", label: "BILLING", count: 2 },
  { value: "account", label: "ACCOUNT", count: 4 },
  { value: "ipv6", label: "IPv6", count: 2 },
  { value: "priority", label: "P1", count: 1 },
  { value: "security", label: "SECURITY", count: 2 },
  { value: "review", label: "REVIEW", count: 3 },
  { value: "maintenance", label: "MAINTENANCE", count: 2 },
  { value: "control", label: "QA", count: 1 },
] as const;

const TICKETS = [
  {
    id: "DEMO-1001",
    title: "Демонстрационный запрос",
    time: "Демо · 09:00",
    level: "L1",
    delta: 1,
    owner: "Оператор 01",
    tags: ["demo", "ipv6"],
  },
  {
    id: "DEMO-1002",
    title: "Тест сетевого профиля",
    time: "Демо · 09:15",
    level: "L1",
    delta: 1,
    owner: "Оператор 02",
    tags: ["new", "network"],
  },
  {
    id: "DEMO-1003",
    title: "Проверка IPv6",
    time: "Демо · 09:30",
    level: "L1",
    delta: 1,
    owner: "Оператор 03",
    tags: ["network", "ipv6"],
  },
  {
    id: "DEMO-1004",
    title: "Учебная операция",
    time: "Демо · 10:00",
    level: "L1",
    delta: 2,
    owner: "Оператор 04",
    tags: ["account"],
  },
  {
    id: "DEMO-1005",
    title: "Проверка конфигурации",
    time: "Демо · 10:15",
    level: "L1",
    delta: 1,
    owner: "Оператор 05",
    tags: ["control"],
  },
  {
    id: "DEMO-1006",
    title: "Тест сертификата",
    time: "Демо · 10:30",
    level: "L1",
    delta: 2,
    owner: "Оператор 06",
    tags: ["security"],
  },
  {
    id: "DEMO-1007",
    title: "Проверка доступа",
    time: "Демо · 11:00",
    level: "L1",
    delta: 1,
    owner: "Оператор 07",
    tags: ["security"],
  },
  {
    id: "DEMO-1008",
    title: "Учебная миграция",
    time: "Демо · 11:15",
    level: "L1",
    delta: 2,
    owner: "Оператор 08",
    tags: ["review", "control"],
  },
  {
    id: "DEMO-1009",
    title: "Тест обслуживания",
    time: "Демо · 11:30",
    level: "L1",
    delta: 3,
    owner: "Оператор 09",
    tags: ["maintenance"],
  },
];

interface IpRow {
  id: number;
  ip: string;
  mask: string;
  gateway: string;
  domain: string;
  type: "Основной" | "Дополнительный";
}

const INITIAL_IPS: IpRow[] = [
  {
    id: 1,
    ip: "192.0.2.10",
    mask: "255.255.255.255",
    gateway: "192.0.2.1",
    domain: "— нажмите для добавления",
    type: "Основной",
  },
  {
    id: 2,
    ip: "198.51.100.20",
    mask: "255.255.255.255",
    gateway: "198.51.100.1",
    domain: "— нажмите для добавления",
    type: "Дополнительный",
  },
];

function InfoCard({ children }: { children: ReactNode }) {
  return (
    <Card padding="sm" className="support-info-card">
      <dl className="support-info-list">{children}</dl>
    </Card>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function TicketQueue({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("unanswered");
  const [tags, setTags] = useState<string[]>([]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ru");
    return TICKETS.filter(
      (ticket) =>
        (!needle ||
          `${ticket.title} ${ticket.id} ${ticket.owner}`.toLocaleLowerCase("ru").includes(needle)) &&
        (tags.length === 0 || tags.some((tag) => ticket.tags.includes(tag))),
    );
  }, [query, tags]);

  return (
    <div className="support-sidebar-shell">
      <nav className="support-rail" aria-label="Разделы поддержки">
        <IconButton active icon={<Inbox />} label="Тикеты" />
        <IconButton icon={<Settings />} label="Настройки" />
        <IconButton icon={<Wrench />} label="Резолвер" />
        <span className="support-rail-spacer" />
        <IconButton icon={<CircleHelp />} label="Помощь" />
      </nav>
      <section className="support-queue" aria-label="Очередь тикетов">
        <div className="support-queue-controls">
          <SearchInput
            size="sm"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Поиск по тикетам"
            aria-label="Поиск по тикетам"
          />
          <div className="support-filter-row">
            <IconButton
              size="sm"
              icon={<RefreshCw />}
              label="Обновить очередь"
              onClick={() => toast.success("Очередь обновлена")}
            />
            <IconButton size="sm" icon={<Filter />} label="Фильтры" active={tags.length > 0} />
            <Select
              size="sm"
              aria-label="Статус тикета"
              value={status}
              onChange={setStatus}
              options={[
                { value: "unanswered", label: "Без ответа" },
                { value: "all", label: "Все тикеты" },
                { value: "mine", label: "Мои тикеты" },
              ]}
            />
          </div>
          <ChipGroup
            size="sm"
            aria-label="Теги тикетов"
            value={tags}
            onChange={setTags}
            options={TAGS.map((tag) => ({ ...tag }))}
            className="support-tags"
          />
        </div>
        <div className="support-ticket-list" aria-live="polite">
          {filtered.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              className="support-ticket"
              aria-pressed={ticket.id === selected}
              onClick={() => onSelect(ticket.id)}
            >
              <Avatar name={ticket.owner} size={34} />
              <span className="support-ticket-copy">
                <span className="support-ticket-meta">
                  <span>{ticket.time}</span>
                  <Badge size="sm">{ticket.level}</Badge>
                </span>
                <strong>{ticket.title}</strong>
              </span>
              <span className="support-ticket-end">
                <span className="rk-num">{ticket.id}</span>
                <Badge size="sm" tone="info" variant="solid">
                  +{ticket.delta}
                </Badge>
                <StatusDot tone="success" label="Есть новый ответ" hideLabel />
              </span>
            </button>
          ))}
          {filtered.length === 0 && <p className="support-empty">По этим условиям тикетов нет.</p>}
        </div>
      </section>
    </div>
  );
}

function AddressPanel() {
  const [ips, setIps] = useState<IpRow[]>(INITIAL_IPS);
  const addIp = () => {
    const next = ips.length + 20;
    setIps((rows) => [
      ...rows,
      {
        id: Date.now(),
        ip: `203.0.113.${next}`,
        mask: "255.255.255.255",
        gateway: "203.0.113.1",
        domain: "— нажмите для добавления",
        type: "Дополнительный",
      },
    ]);
    toast.success("IP-адрес добавлен");
  };
  return (
    <div className="support-addresses">
      <section className="support-section">
        <header>
          <h2>
            <Network size={16} /> IPv6
          </h2>
        </header>
        <Table framed density="compact" aria-label="IPv6 адреса">
          <thead>
            <tr>
              <th>Подсеть</th>
              <th>Шлюз</th>
              <th>Тип</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="rk-num">2001:db8:100::/48</td>
              <td className="rk-num">2001:db8:100::1</td>
              <td>
                <Badge size="sm">Дополнительный</Badge>
              </td>
              <td>
                <Badge size="sm" tone="success" variant="solid">
                  ACTIVE
                </Badge>
              </td>
            </tr>
          </tbody>
        </Table>
      </section>
      <section className="support-section">
        <header>
          <h2>
            <Server size={16} /> IPv4
          </h2>
          <div className="support-section-actions">
            <Button size="sm" variant="primary" icon={<Plus />} onClick={addIp}>
              Добавить IP
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={<RotateCw />}
              onClick={() => toast.success("IP-адреса синхронизированы")}
            >
              Синхронизировать
            </Button>
          </div>
        </header>
        <Table framed density="compact" aria-label="IPv4 адреса">
          <thead>
            <tr>
              <th>IP</th>
              <th>Маска</th>
              <th>Шлюз</th>
              <th>Домен</th>
              <th>Тип</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((row) => (
              <tr key={row.id}>
                <td className="rk-num">{row.ip}</td>
                <td className="rk-num">{row.mask}</td>
                <td className="rk-num">{row.gateway}</td>
                <td>
                  <Editable defaultValue={row.domain} required={false} label="Изменить домен" />
                </td>
                <td>
                  <Badge size="sm" tone={row.type === "Основной" ? "info" : "neutral"}>
                    {row.type}
                  </Badge>
                </td>
                <td>
                  <Badge size="sm" tone="success" variant="solid">
                    ACTIVE
                  </Badge>
                </td>
                <td>
                  <div className="support-row-actions">
                    <IconButton
                      size="sm"
                      icon={<ArrowLeftRight />}
                      label="Сделать основным"
                      onClick={() => toast.success(`${row.ip} выбран основным`)}
                    />
                    {row.type !== "Основной" && (
                      <IconButton
                        size="sm"
                        icon={<Trash2 />}
                        label="Удалить IP"
                        onClick={() => setIps((items) => items.filter((item) => item.id !== row.id))}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
      <section className="support-history">
        <h2>
          <History size={16} /> История IP
        </h2>
        <div className="support-history-list">
          {["192.0.2.11", "192.0.2.10", "198.51.100.20"].map((ip) => (
            <Badge key={ip} size="sm" variant="outline">
              {ip}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}

function SecondaryPanel({ tab }: { tab: string }) {
  if (tab === "tasker")
    return (
      <div className="support-secondary-grid">
        {["Проверить доступность после смены IP", "Обновить PTR-запись", "Сообщить клиенту о завершении"].map(
          (task, index) => (
            <Card
              key={task}
              dense
              title={task}
              description={index === 0 ? "Автоматически · через 15 минут" : "Назначено на поддержку"}
              actions={<Switch defaultChecked={index === 0} aria-label={`Задача: ${task}`} />}
            />
          ),
        )}
      </div>
    );
  if (tab === "transactions")
    return (
      <Table framed zebra aria-label="История транзакций">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Операция</th>
            <th>Период</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 янв. 2030</td>
            <td>Демо-операция A</td>
            <td>Тестовый период</td>
            <td>0,00 €</td>
            <td>
              <Badge tone="success">Оплачено</Badge>
            </td>
          </tr>
          <tr>
            <td>1 дек. 2029</td>
            <td>Демо-операция B</td>
            <td>Тестовый период</td>
            <td>0,00 €</td>
            <td>
              <Badge tone="success">Оплачено</Badge>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  return (
    <div className="support-secondary-grid">
      <Card
        icon={<Archive />}
        title="Демо-снимок A"
        description="Тестовая дата · 0.0 GB"
        actions={
          <Button size="sm" onClick={() => toast.success("Восстановление запущено")}>
            Восстановить
          </Button>
        }
      />
      <Card
        icon={<Archive />}
        title="Демо-снимок B"
        description="Тестовая дата · 0.0 GB"
        actions={
          <Button size="sm" onClick={() => toast.success("Восстановление запущено")}>
            Восстановить
          </Button>
        }
      />
    </div>
  );
}

function SupportWorkspaceApp() {
  const [selected, setSelected] = useState<string>(TICKETS[0]?.id ?? "");
  const [tab, setTab] = useState("addresses");
  const [autoRenew, setAutoRenew] = useState(false);
  const [rescue, setRescue] = useState(false);
  const [note, setNote] = useState("");
  const [editingNote, setEditingNote] = useState(false);
  const [template, setTemplate] = useState("templates");
  const ticket = TICKETS.find((item) => item.id === selected) ?? TICKETS[0];

  return (
    <AppShell
      className="support-app"
      sidebarWidth={360}
      compactBelow={1080}
      drawerBelow={760}
      sidebar={<TicketQueue selected={selected} onSelect={setSelected} />}
      header={
        <TitleBar
          start={
            <div className="support-title">
              <Badge size="sm" variant="solid">
                DEMO
              </Badge>
              <strong>demo-workspace</strong>
              <span className="rk-num">{ticket?.id}</span>
              <Badge size="sm" tone="info" variant="outline">
                DEMO DATA
              </Badge>
              <Badge size="sm" media={<Avatar name="Demo Agent" size={18} />}>
                agent@example.com
              </Badge>
            </div>
          }
          end={
            <>
              <IconButton icon={<Pencil />} label="Редактировать тикет" />
              <IconButton
                icon={<RefreshCw />}
                label="Обновить"
                onClick={() => toast.success("Данные обновлены")}
              />
              <IconButton icon={<Monitor />} label="Открыть консоль" />
              <IconButton icon={<Code2 />} label="Команды" />
              <CopyButton value="https://example.com/tickets/DEMO-1001" label="Копировать ссылку" />
              <Button size="sm" variant="outline" iconEnd={<ChevronDown />}>
                Действия
              </Button>
            </>
          }
        />
      }
      aside={
        <nav className="support-templates" aria-label="Боковые инструменты">
          {[
            ["templates", <ClipboardList key="templates" />, "Шаблоны"],
            ["messages", <MessageSquare key="messages" />, "Ответы"],
            ["users", <Users key="users" />, "Клиент"],
            ["details", <PanelRight key="details" />, "Детали"],
          ].map(([id, icon, label]) => (
            <IconButton
              key={id as string}
              active={template === id}
              icon={icon}
              label={label as string}
              onClick={() => setTemplate(id as string)}
            />
          ))}
        </nav>
      }
      footer={
        <StatusBar
          running
          end={
            <div className="support-status-end">
              <span>
                <Inbox size={13} /> 12
              </span>
              <span>
                <MessageSquare size={13} /> 8
              </span>
              <span>
                <Users size={13} /> 4
              </span>
              <Badge size="sm" tone="success" dot>
                00:00:00
              </Badge>
            </div>
          }
        >
          Поддержка на связи · выбран {ticket?.id}
        </StatusBar>
      }
    >
      <PageBody width="none" className="support-page">
        <div className="support-summary-grid">
          <InfoCard>
            <InfoRow label="IP">
              <span className="support-value">
                <strong className="rk-num">192.0.2.10</strong>
                <CopyButton size="sm" value="192.0.2.10" label="Копировать IP" />
              </span>
            </InfoRow>
            <InfoRow label="Статус">
              <StatusDot tone="success" label="Активен" />
            </InfoRow>
            <InfoRow label="Стоимость">
              <Editable defaultValue="0,00 € / демо" label="Изменить стоимость" />
            </InfoRow>
            <InfoRow label="Период оплаты">
              <Editable defaultValue="Месяц" label="Изменить период оплаты" />
            </InfoRow>
            <InfoRow label="Автопродление">
              <Switch
                checked={autoRenew}
                onChange={(event) => setAutoRenew(event.target.checked)}
                aria-label="Автопродление"
              />
            </InfoRow>
            <InfoRow label="Rescue режим">
              <Switch
                checked={rescue}
                onChange={(event) => setRescue(event.target.checked)}
                aria-label="Rescue режим"
              />
            </InfoRow>
          </InfoCard>
          <InfoCard>
            <InfoRow label="Куплен">1 янв. 2030 00:00</InfoRow>
            <InfoRow label="Создан">1 янв. 2030 00:00</InfoRow>
            <InfoRow label="Действует до">
              <span className="support-stack">
                <strong>1 февр. 2030 00:00</strong>
                <small>Демонстрационный период</small>
              </span>
            </InfoRow>
            <InfoRow label="ModuleID">
              <span className="support-value">
                <strong className="rk-num">DEMO-MODULE-001</strong>
                <CopyButton size="sm" value="DEMO-MODULE-001" label="Копировать ModuleID" />
              </span>
            </InfoRow>
          </InfoCard>
          <InfoCard>
            <InfoRow label="Локация">Demo Region</InfoRow>
            <InfoRow label="Тариф">
              <strong>DEMO-PLAN</strong>
            </InfoRow>
            <InfoRow label="Система">Demo OS 1.0</InfoRow>
            <InfoRow label="Процессор">2 demo cores</InfoRow>
            <InfoRow label="RAM">4 GB demo</InfoRow>
            <InfoRow label="Хранилище">40 GB demo</InfoRow>
            <InfoRow label="Нода">
              <strong>DEMO-NODE-01</strong>
            </InfoRow>
          </InfoCard>
        </div>

        <Card
          padding="sm"
          variant="sunken"
          title="Заметка"
          icon={<FileText />}
          actions={
            !editingNote && (
              <IconButton
                size="sm"
                icon={<Pencil />}
                label="Изменить заметку"
                onClick={() => setEditingNote(true)}
              />
            )
          }
        >
          {editingNote ? (
            <div className="support-note-editor">
              <Textarea
                autoSize
                rows={2}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Добавьте внутреннюю заметку…"
              />
              <Button size="sm" variant="primary" onClick={() => setEditingNote(false)}>
                Сохранить
              </Button>
            </div>
          ) : (
            <button type="button" className="support-note-empty" onClick={() => setEditingNote(true)}>
              {note || "Заметка отсутствует. Нажмите, чтобы добавить."}
            </button>
          )}
        </Card>

        <Tabs
          idPrefix="support"
          value={tab}
          onChange={setTab}
          aria-label="Разделы сервера"
          items={[
            { value: "addresses", label: "IP-адреса" },
            { value: "tasker", label: "Таскер", badge: 3 },
            { value: "transactions", label: "История транзакций" },
            { value: "backups", label: "Бэкапы", badge: 2 },
          ]}
        />
        <TabPanel idPrefix="support" value={tab}>
          {tab === "addresses" ? <AddressPanel /> : <SecondaryPanel tab={tab} />}
        </TabPanel>
      </PageBody>
    </AppShell>
  );
}

export const SupportWorkspace: Story = () => (
  <Stage frame="full">
    <SupportWorkspaceApp />
  </Stage>
);
SupportWorkspace.storyName = "Support workspace";
