import type { Story } from "@ladle/react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Boxes,
  Brain,
  ChartColumn,
  Cpu,
  Database,
  Ellipsis,
  FolderOpen,
  Images,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  Terminal,
  Timer,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import {
  AppearanceSettings,
  AppShell,
  Avatar,
  Badge,
  BarChart,
  Breadcrumbs,
  Button,
  Card,
  ChipGroup,
  CommandPalette,
  DataTable,
  Gauge,
  IconButton,
  LineChart,
  NavGroup,
  NavItem,
  PageBody,
  PageHeader,
  SearchInput,
  Select,
  Sidebar,
  Sparkline,
  Stat,
  StatusBar,
  StatusDot,
  Tabs,
  TitleBar,
  toast,
  useHotkey,
} from "..";
import { Stage } from "./stage";

export default { title: "Overview" };

const loss = [0.92, 0.71, 0.58, 0.49, 0.43, 0.39, 0.35, 0.33, 0.3, 0.29, 0.27, 0.26, 0.25, 0.245, 0.24];
const val = [0.95, 0.76, 0.63, 0.55, 0.5, 0.47, 0.45, 0.44, 0.43, 0.43, 0.42, 0.42, 0.43, 0.43, 0.44];

const runs = [
  { id: "r-118", name: "anima-v4 · lora r32", status: "running", step: 4200, loss: 0.2412, time: "1h 12m" },
  { id: "r-117", name: "anima-v4 · lora r16", status: "done", step: 6000, loss: 0.2591, time: "2h 03m" },
  { id: "r-116", name: "seed2 · full ft", status: "failed", step: 812, loss: 0.9133, time: "14m" },
  { id: "r-115", name: "seed2 · lora r64", status: "done", step: 6000, loss: 0.2478, time: "2h 41m" },
];

const STATUS = {
  running: { tone: "accent", label: "Running" },
  done: { tone: "success", label: "Done" },
  failed: { tone: "danger", label: "Failed" },
} as const;

function DashboardApp() {
  const [page, setPage] = useState("dashboard");
  const [tab, setTab] = useState("overview");
  const [palette, setPalette] = useState(false);
  const [range, setRange] = useState("week");
  const [filter, setFilter] = useState<string[]>(["loss"]);
  useHotkey("mod+k", () => setPalette(true));

  const nav = (id: string, label: string, icon: React.ReactNode, trailing?: React.ReactNode) => (
    <NavItem icon={icon} label={label} active={page === id} onClick={() => setPage(id)} trailing={trailing} />
  );

  return (
    <AppShell
      sidebar={
        <div style={{ width: 232, display: "flex" }}>
          <Sidebar
            header={
              <>
                <span className="demo-logo">
                  <Sparkles size={16} />
                </span>
                <strong style={{ fontSize: 15, letterSpacing: "-0.02em" }}>rootik</strong>
              </>
            }
            footer={nav("settings", "Settings", <Settings />)}
          >
            <NavGroup label="Workspace">
              {nav("dashboard", "Dashboard", <LayoutDashboard />)}
              {nav("gallery", "Gallery", <Images />, <Badge size="sm">2.4K</Badge>)}
              {nav("constructor", "Constructor", <Workflow />)}
              {nav("analysis", "Analysis", <ChartColumn />)}
            </NavGroup>
            <NavGroup
              label="Training"
              collapsible
              action={<IconButton size="sm" icon={<Plus />} label="New run" />}
            >
              {nav("runs", "Runs", <Activity />, <StatusDot tone="accent" pulse />)}
              {nav("models", "Models", <Boxes />)}
              {nav("datasets", "Datasets", <Database />)}
            </NavGroup>
          </Sidebar>
        </div>
      }
      header={
        <TitleBar
          start={<Breadcrumbs items={[{ label: "Workspace", onClick: () => {} }, { label: "Dashboard" }]} />}
          end={
            <>
              <IconButton icon={<Bell />} label="Notifications" />
              <Avatar name="Ira Kat" size={28} />
            </>
          }
        >
          <SearchInput
            size="sm"
            shortcut="⌘K"
            style={{ width: 280 }}
            onFocus={() => setPalette(true)}
            readOnly
          />
        </TitleBar>
      }
      footer={
        <StatusBar running progress={0.7} end={<span className="rk-num">VRAM 18.2 / 24 GB</span>}>
          Training anima-v4 · step 4,200 / 6,000
        </StatusBar>
      }
    >
      <PageHeader
        size="lg"
        title="Your statistics"
        description="Datasets, runs and hardware at a glance"
        actions={
          <>
            <Select
              variant="button"
              value={range}
              onChange={setRange}
              options={[
                { value: "day", label: "Today" },
                { value: "week", label: "This week" },
                { value: "month", label: "Last 30 days" },
              ]}
            />
            <Button
              variant="primary"
              icon={<Plus />}
              onClick={() => toast.success("Run queued", { description: "anima-v4 · lora r32" })}
            >
              New run
            </Button>
          </>
        }
      />
      <PageBody width="none">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <Tabs
            variant="pill"
            value={tab}
            onChange={setTab}
            aria-label="Views"
            items={[
              { value: "overview", label: "Overview" },
              { value: "training", label: "Training", badge: 3 },
              { value: "datasets", label: "Datasets" },
              { value: "hardware", label: "Hardware" },
            ]}
          />
        </div>

        <div className="demo-grid demo-kpis">
          <Card>
            <Stat
              label="Images processed"
              value="128.4K"
              delta={12}
              icon={<Images size={14} />}
              hint="vs last week"
            >
              <Sparkline data={[12, 18, 14, 22, 19, 27, 31, 29, 36]} />
            </Stat>
          </Card>
          <Card>
            <Stat
              label="Avg caption"
              value="42.8"
              unit="tokens"
              delta={-3.1}
              icon={<Sparkles size={14} />}
              hint="vs last week"
            >
              <Sparkline data={[48, 47, 45, 46, 44, 43, 44, 42, 43]} color="var(--rk-chart-1)" />
            </Stat>
          </Card>
          <Card>
            <Stat
              label="GPU utilization"
              value="86"
              unit="%"
              icon={<Cpu size={14} />}
              hint="RTX 4090 · 71 °C"
            >
              <Sparkline data={[60, 72, 88, 91, 84, 86, 90, 85, 86]} color="var(--rk-chart-3)" />
            </Stat>
          </Card>
          <Card>
            <Stat
              label="Train loss"
              value="0.2412"
              delta={-8.4}
              invert
              icon={<Brain size={14} />}
              hint="step 4,200"
            >
              <Sparkline data={loss} color="var(--rk-chart-2)" />
            </Stat>
          </Card>
        </div>

        <div className="demo-grid demo-main">
          <Card
            title="Throughput"
            description="Images captioned per day"
            icon={<ChartColumn />}
            actions={<IconButton icon={<Ellipsis />} label="More" />}
          >
            <BarChart
              variant="hatch"
              highlight="Wed"
              reference={{ value: 1800, label: "target 1.8K" }}
              height={230}
              data={[
                { label: "Mon", value: 1320 },
                { label: "Tue", value: 1640 },
                { label: "Wed", value: 2140 },
                { label: "Thu", value: 1210 },
                { label: "Fri", value: 980 },
                { label: "Sat", value: 1560 },
                { label: "Sun", value: 890 },
              ]}
            />
          </Card>
          <Card title="Dataset health" icon={<Activity />} actions={<Badge tone="accent">+10%</Badge>}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Gauge value={432} max={500} label="quality score" size={210} />
              <Badge tone="neutral" icon={<Sparkles />}>
                Cleaner than 85% of your datasets
              </Badge>
            </div>
          </Card>
          <Card variant="inverse" className="demo-report">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 30, fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1 }}>
                Weekly
                <br />
                report
              </div>
              <Badge tone="neutral" variant="outline">
                4 runs
              </Badge>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <IconButton icon={<Plus />} label="Add" variant="secondary" round size="lg" />
              <IconButton icon={<ArrowUpRight />} label="Open" variant="inverse" round size="lg" />
            </div>
          </Card>
        </div>

        <div className="demo-grid demo-bottom">
          <Card
            title="Loss"
            description="anima-v4 · lora r32"
            actions={
              <ChipGroup
                size="sm"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: "loss", label: "Train" },
                  { value: "val", label: "Validation" },
                ]}
              />
            }
          >
            <LineChart
              area
              height={220}
              format={(v) => v.toFixed(2)}
              labels={loss.map((_, i) => `${(i + 1) * 400}`)}
              series={[
                { name: "Train", data: loss },
                ...(filter.includes("val") ? [{ name: "Validation", data: val }] : []),
              ]}
            />
          </Card>
          <Card
            title="Recent runs"
            icon={<Timer />}
            padding="none"
            actions={
              <Button size="sm" variant="ghost" iconEnd={<ArrowUpRight />}>
                All runs
              </Button>
            }
          >
            <DataTable
              rows={runs}
              rowKey={(r) => r.id}
              onRowClick={(r) => toast(r.name)}
              defaultSort={{ key: "loss", dir: "asc" }}
              columns={[
                { key: "name", header: "Run", sortable: true },
                {
                  key: "status",
                  header: "Status",
                  cell: (r) => (
                    <Badge tone={STATUS[r.status as keyof typeof STATUS].tone} dot>
                      {STATUS[r.status as keyof typeof STATUS].label}
                    </Badge>
                  ),
                },
                { key: "loss", header: "Loss", sortable: true, align: "end", cell: (r) => r.loss.toFixed(4) },
                { key: "time", header: "Time", align: "end" },
              ]}
            />
          </Card>
        </div>
      </PageBody>

      <CommandPalette
        open={palette}
        onClose={() => setPalette(false)}
        commands={[
          {
            id: "dash",
            group: "Navigate",
            label: "Dashboard",
            icon: <LayoutDashboard />,
            run: () => setPage("dashboard"),
          },
          {
            id: "gal",
            group: "Navigate",
            label: "Gallery",
            icon: <Images />,
            shortcut: "mod+1",
            run: () => setPage("gallery"),
          },
          {
            id: "con",
            group: "Navigate",
            label: "Constructor",
            icon: <Workflow />,
            run: () => setPage("constructor"),
          },
          {
            id: "open",
            group: "Actions",
            label: "Open dataset folder…",
            icon: <FolderOpen />,
            shortcut: "mod+o",
            run: () => {},
          },
          {
            id: "log",
            group: "Actions",
            label: "Toggle logs",
            icon: <Terminal />,
            shortcut: "mod+j",
            run: () => {},
          },
          {
            id: "set",
            group: "Actions",
            label: "Settings",
            icon: <Settings />,
            keywords: "preferences theme",
            run: () => setPage("settings"),
          },
        ]}
      />
    </AppShell>
  );
}

/** Every layout part is its own surface over the ambient canvas; switch the material on top. */
export const Dashboard: Story = () => (
  <Stage>
    <DashboardApp />
  </Stage>
);

/** Built-in appearance knobs + the "Gallery" extension declared in .ladle/components.tsx. */
export const Settings_: Story = () => (
  <div style={{ maxWidth: 720 }}>
    <AppearanceSettings />
  </div>
);
Settings_.storyName = "Settings";
