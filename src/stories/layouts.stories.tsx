import type { Story } from "@ladle/react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  ChartSpline,
  Ellipsis,
  Globe,
  LayoutGrid,
  Power,
  RefreshCw,
  Route,
  ScrollText,
  Settings,
  Shield,
  Timer,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  ChoiceCards,
  DataTable,
  Dock,
  EmptyState,
  Field,
  Gauge,
  IconButton,
  LineChart,
  NavItem,
  Nest,
  PageHeader,
  Popover,
  PowerButton,
  Progress,
  SearchInput,
  SegmentedControl,
  Select,
  Sidebar,
  Sparkline,
  Stat,
  StatusDot,
  Switch,
  TitleBar,
  toast,
} from "..";
import { Stage } from "./stage";

export default { title: "Layouts" };

const NODES = Array.from({ length: 14 }, (_, i) => ({
  id: `n${i}`,
  code: ["JP", "DE", "NL", "US", "SG", "FI", "TR"][i % 7] as string,
  name: `${["Tokyo", "Frankfurt", "Amsterdam", "Ashburn", "Singapore", "Helsinki", "Istanbul"][i % 7]} 0${(i % 4) + 1}`,
  type: ["vless", "trojan", "hysteria2", "ss"][i % 4] as string,
  delay: i % 6 === 5 ? null : 38 + ((i * 53) % 240),
}));

const down = [12, 18, 15, 22, 30, 26, 24, 31, 28, 25, 27, 24.8];
const up = [2.1, 2.8, 2.4, 3.3, 4.1, 3.6, 3.2, 3.9, 3.5, 3.0, 3.3, 3.1];

const delayTone = (d: number | null) =>
  d === null ? "danger" : d < 120 ? "success" : d < 220 ? "warn" : "danger";

function ConnectView({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) {
  const [node, setNode] = useState("n0");
  const current = NODES.find((n) => n.id === node) ?? NODES[0];
  return (
    <div className="vpn-grid">
      <Card className="vpn-hero" padding="lg">
        <div className="vpn-hero-row">
          <PowerButton label="VPN connection" size="lg" on={on} onChange={setOn} />
          <div className="vpn-hero-text">
            <StatusDot
              tone={on ? "success" : "neutral"}
              pulse={on}
              label={on ? "Protected" : "Not connected"}
            />
            <div className="vpn-timer rk-num">{on ? "02:14:36" : "00:00:00"}</div>
            <div className="vpn-node">
              <Badge size="sm">{current?.code}</Badge>
              {current?.name} · {current?.type}
              {current?.delay != null && (
                <Badge size="sm" tone={delayTone(current.delay)}>
                  {current.delay} ms
                </Badge>
              )}
            </div>
          </div>
          <Select
            variant="button"
            size="sm"
            value={node}
            onChange={setNode}
            options={NODES.slice(0, 7).map((n) => ({
              value: n.id,
              label: `${n.code} · ${n.name}`,
              hint: n.type,
            }))}
          />
        </div>
      </Card>
      <Card>
        <Stat label="Download" value={on ? "24.8" : "0"} unit="MB/s" icon={<ArrowDown size={14} />}>
          <Sparkline data={on ? down : down.map(() => 0)} color="var(--rk-chart-1)" />
        </Stat>
      </Card>
      <Card>
        <Stat label="Upload" value={on ? "3.1" : "0"} unit="MB/s" icon={<ArrowUp size={14} />}>
          <Sparkline data={on ? up : up.map(() => 0)} color="var(--rk-chart-3)" />
        </Stat>
      </Card>
      <Card>
        <Stat label="This month" value="38.4" unit="GB" icon={<Timer size={14} />} hint="of 100 GB plan">
          <Progress value={38.4} size="sm" />
        </Stat>
      </Card>
      <Card title="Traffic" description="Last 60 seconds" className="vpn-wide">
        <LineChart
          area
          height={180}
          labels={down.map((_, i) => `${i * 5}s`)}
          series={[
            { name: "Download", data: down },
            { name: "Upload", data: up },
          ]}
        />
      </Card>
    </div>
  );
}

function NodesView() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>("n0");
  const rows = NODES.filter((n) => `${n.code} ${n.name} ${n.type}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Card
      padding="none"
      title="Nodes"
      description={`${NODES.length} from 2 subscriptions`}
      actions={
        <>
          <SearchInput size="sm" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} />
          <Button size="sm" icon={<RefreshCw />} onClick={() => toast("Testing latency…")}>
            Test all
          </Button>
        </>
      }
    >
      <DataTable
        rows={rows}
        rowKey={(r) => r.id}
        selectedKey={selected}
        onRowClick={(r) => setSelected(r.id)}
        defaultSort={{ key: "delay", dir: "asc" }}
        columns={[
          {
            key: "name",
            header: "Node",
            sortable: true,
            cell: (r) => (
              <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <Badge size="sm">{r.code}</Badge>
                {r.name}
              </span>
            ),
          },
          { key: "type", header: "Protocol", mono: true },
          {
            key: "delay",
            header: "Delay",
            sortable: true,
            align: "end",
            cell: (r) => (
              <Badge size="sm" tone={delayTone(r.delay)} dot>
                {r.delay === null ? "timeout" : `${r.delay} ms`}
              </Badge>
            ),
          },
        ]}
      />
    </Card>
  );
}

const LOG = [
  ["14:02:11", "info", "tun: stack mixed, mtu 9000"],
  ["14:02:11", "info", "dns: fake-ip enabled, 198.18.0.1/16"],
  ["14:02:12", "info", "[TCP] 192.168.1.4:51123 → github.com:443 match DomainSuffix using JP Tokyo 01"],
  ["14:02:13", "warn", "[UDP] dial 1.1.1.1:53 timeout, fallback to 8.8.8.8"],
  ["14:02:15", "info", "[TCP] 192.168.1.4:51127 → api.openai.com:443 match GeoSite using NL Amsterdam 03"],
  ["14:02:18", "error", "proxy DE Frankfurt 02: handshake failed: EOF"],
  ["14:02:20", "info", "[TCP] 192.168.1.4:51131 → youtube.com:443 match Rule-Set using JP Tokyo 01"],
] as const;

function LogsView() {
  return (
    <Card
      padding="none"
      title="Logs"
      actions={
        <SegmentedControl
          size="sm"
          aria-label="Level"
          options={[
            { value: "all", label: "All" },
            { value: "warn", label: "Warn+" },
          ]}
        />
      }
    >
      <div className="vpn-log rk-mono">
        {LOG.map(([t, level, text]) => (
          <div key={`${t}${text}`} className="vpn-log-row">
            <span className="vpn-log-time">{t}</span>
            <Badge size="sm" tone={level === "error" ? "danger" : level === "warn" ? "warn" : "neutral"}>
              {level}
            </Badge>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SettingsView() {
  const [tun, setTun] = useState(true);
  return (
    <div className="vpn-settings">
      <Card title="Connection">
        <div className="vpn-fields">
          <Field layout="inline" label="System proxy" hint="Route system traffic through the core">
            <Switch defaultChecked />
          </Field>
          <Field layout="inline" label="TUN mode" hint="Capture all traffic, needs admin">
            <Switch checked={tun} onChange={(e) => setTun(e.target.checked)} />
          </Field>
          {tun && (
            <Nest>
              <ChoiceCards
                aria-label="TUN stack"
                defaultValue="mixed"
                minWidth={150}
                options={[
                  { value: "system", label: "System", description: "OS stack, fastest" },
                  { value: "gvisor", label: "gVisor", description: "Most compatible" },
                  { value: "mixed", label: "Mixed", description: "TCP system, UDP gVisor" },
                ]}
              />
            </Nest>
          )}
        </div>
      </Card>
      <Card title="Startup">
        <div className="vpn-fields">
          <Field layout="inline" label="Launch at login">
            <Switch />
          </Field>
          <Field layout="inline" label="Connect on launch" hint="Uses the last node">
            <Switch defaultChecked />
          </Field>
        </div>
      </Card>
    </div>
  );
}

const DOCK = [
  { value: "connect", icon: <Power />, label: "Connection" },
  { value: "nodes", icon: <Globe />, label: "Nodes" },
  { value: "rules", icon: <Route />, label: "Rules" },
  { value: "logs", icon: <ScrollText />, label: "Logs", badge: 3 },
  { value: "settings", icon: <Settings />, label: "Settings" },
];

function VpnDesktopApp() {
  const [view, setView] = useState("connect");
  const [on, setOn] = useState(true);
  const [mode, setMode] = useState("rule");
  return (
    <AppShell
      dimWhenInactive
      header={
        <TitleBar
          start={
            <>
              <span className="demo-logo">
                <Shield size={16} />
              </span>
              <strong>umiray</strong>
              <Badge tone={on ? "success" : "neutral"} dot>
                {on ? "Connected" : "Offline"}
              </Badge>
            </>
          }
          end={<IconButton icon={<Bell />} label="Notifications" />}
          onMinimize={() => {}}
          onMaximize={() => {}}
          onClose={() => {}}
        >
          <SegmentedControl
            size="sm"
            aria-label="Routing mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "rule", label: "Rule" },
              { value: "global", label: "Global" },
              { value: "direct", label: "Direct" },
            ]}
          />
        </TitleBar>
      }
      dock={<Dock aria-label="Sections" variant="labels" items={DOCK} value={view} onChange={setView} />}
    >
      {view === "connect" && <ConnectView on={on} setOn={setOn} />}
      {view === "nodes" && <NodesView />}
      {view === "rules" && (
        <Card>
          <EmptyState
            icon={<Route />}
            title="No custom rules"
            hint="Built-in rule sets route streaming and AI services through the selected node."
            action={<Button variant="primary">Add rule</Button>}
          />
        </Card>
      )}
      {view === "logs" && <LogsView />}
      {view === "settings" && <SettingsView />}
    </AppShell>
  );
}

/** Desktop VPN client (frameless Tauri window): title bar on top, dock at the bottom, cards in between. */
export const VpnDesktop: Story = () => (
  <Stage frame="window">
    <VpnDesktopApp />
  </Stage>
);
VpnDesktop.storyName = "VPN desktop";

function VpnCompactApp() {
  const [on, setOn] = useState(true);
  const [view, setView] = useState("connect");
  return (
    <AppShell
      headerShape="none"
      header={
        <div className="vpn-compact-bar">
          <IconButton icon={<Bell />} label="Notifications" round variant="secondary" />
          <strong>umiray</strong>
          <Avatar name="Ira Kat" size={34} />
        </div>
      }
      dock={
        <Dock
          aria-label="Sections"
          value={view}
          onChange={setView}
          items={[
            { value: "connect", icon: <Zap />, label: "Connection" },
            { value: "nodes", icon: <Globe />, label: "Nodes" },
            { value: "stats", icon: <ChartSpline />, label: "Stats" },
            { value: "settings", icon: <Settings />, label: "Settings" },
          ]}
        />
      }
    >
      <div className="vpn-compact">
        <Card className="vpn-compact-hero">
          <div className="vpn-compact-title">
            <span>
              Tokyo 03 <Badge size="sm">JP</Badge>
            </span>
            <StatusDot
              tone={on ? "success" : "neutral"}
              pulse={on}
              label={on ? "Protected · 48 ms" : "Not connected"}
            />
          </div>
          <div className="vpn-compact-gauge">
            <Gauge
              value={on ? 24.8 : 0}
              max={50}
              display={on ? "24.8" : "0"}
              unit="MB/s"
              label="download"
              size={230}
              segments={40}
            />
          </div>
          <Button
            variant={on ? "inverse" : "primary"}
            size="lg"
            block
            icon={<Power />}
            onClick={() => setOn(!on)}
          >
            {on ? "Disconnect" : "Connect"}
          </Button>
        </Card>
        <div className="vpn-compact-tiles">
          <Card padding="sm">
            <Stat
              size="sm"
              label="Upload"
              value={on ? "3.1" : "0"}
              unit="MB/s"
              icon={<ArrowUp size={14} />}
            />
          </Card>
          <Card padding="sm">
            <Stat size="sm" label="This month" value="38.4" unit="GB" icon={<Timer size={14} />} />
          </Card>
        </div>
        <Card padding="sm">
          <div className="vpn-compact-row">
            <Stat size="sm" label="Kill switch" value="28" unit="days protected" />
            <Switch defaultChecked aria-label="Kill switch" />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

/** Phone-sized client in the style of the energy-app reference: gauge hero, tiles, dock. */
export const VpnCompact: Story = () => (
  <Stage frame="phone">
    <VpnCompactApp />
  </Stage>
);
VpnCompact.storyName = "VPN compact";

function VpnTaskbarApp() {
  const [view, setView] = useState("connect");
  const [on, setOn] = useState(true);
  const [launcher, setLauncher] = useState(false);
  const go = (v: string) => {
    setView(v);
    setLauncher(false);
  };
  const current = DOCK.find((d) => d.value === view);
  return (
    <AppShell
      dimWhenInactive
      dockPlacement="bar"
      header={
        <TitleBar
          start={<strong>umiray</strong>}
          onMinimize={() => {}}
          onMaximize={() => {}}
          onClose={() => {}}
        />
      }
      sidebar={
        <Sidebar>
          {DOCK.map((d) => (
            <NavItem
              key={d.value}
              icon={d.icon}
              label={d.label}
              active={d.value === view}
              onClick={() => go(d.value)}
            />
          ))}
        </Sidebar>
      }
      dock={
        <Dock
          aria-label="Sections"
          variant="labels"
          items={DOCK}
          value={view}
          onChange={setView}
          start={
            <Popover
              open={launcher}
              onOpenChange={setLauncher}
              placement="top-start"
              title="All sections"
              trigger={<IconButton icon={<LayoutGrid />} label="All sections" size="lg" />}
            >
              <div className="demo-launcher">
                {DOCK.map((d) => (
                  <Button key={d.value} variant="ghost" icon={d.icon} onClick={() => go(d.value)}>
                    {d.label}
                  </Button>
                ))}
              </div>
            </Popover>
          }
        >
          <IconButton icon={<Ellipsis />} label="More" size="lg" />
        </Dock>
      }
    >
      <PageHeader title={current?.label} />
      {view === "connect" && <ConnectView on={on} setOn={setOn} />}
      {view === "nodes" && <NodesView />}
      {view === "logs" && <LogsView />}
      {view === "settings" && <SettingsView />}
    </AppShell>
  );
}

/**
 * Dock as a taskbar (`dockPlacement="bar"`, a launcher in `start`): try Style → Fluent and Spacing → Flush
 * in the bar above for the Windows 10 take; `theme="fluent"` sets the whole combination.
 */
export const VpnTaskbar: Story = () => (
  <Stage frame="window">
    <VpnTaskbarApp />
  </Stage>
);
VpnTaskbar.storyName = "VPN taskbar";
