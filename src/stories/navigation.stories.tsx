import type { Story } from "@ladle/react";
import {
  Bell,
  ChartColumn,
  FileText,
  Folder,
  Globe,
  Home,
  Images,
  Info,
  LayoutDashboard,
  Palette,
  PanelLeft,
  Plus,
  Power,
  Settings,
  Share2,
  Sun,
  Workflow,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Badge,
  Breadcrumbs,
  Dock,
  DockSeparator,
  IconButton,
  NavGroup,
  NavItem,
  Pagination,
  Sidebar,
  StatusDot,
  TableOfContents,
  TabPanel,
  Tabs,
  TopNav,
  useScrollSpy,
} from "..";

export default { title: "Navigation" };

export const TabBars: Story = () => {
  const [tab, setTab] = useState("setup");
  return (
    <div className="story-col">
      <Tabs
        aria-label="Training"
        idPrefix="train"
        value={tab}
        onChange={setTab}
        items={[
          { value: "setup", label: "Setup" },
          { value: "samples", label: "Samples", badge: 12 },
          { value: "monitor", label: "Monitor", dirty: true },
          { value: "history", label: "History", disabled: true },
        ]}
      />
      <TabPanel idPrefix="train" value={tab} style={{ color: "var(--rk-text-3)" }}>
        Panel: {tab}
      </TabPanel>
      <Tabs
        variant="pill"
        aria-label="Sections"
        items={[
          { value: "dashboard", label: "Dashboard" },
          { value: "analytics", label: "Analytics", icon: <ChartColumn /> },
          { value: "document", label: "Document" },
          { value: "history", label: "Booking history" },
        ]}
      />
      <Tabs
        variant="pill"
        size="sm"
        aria-label="Icons"
        items={[
          { value: "a", icon: <LayoutDashboard />, hint: "Dashboard" },
          { value: "b", icon: <Images />, hint: "Gallery" },
          { value: "c", icon: <Workflow />, hint: "Graph" },
        ]}
      />
      <div style={{ width: 320 }}>
        <Tabs
          fill
          aria-label="Panel"
          items={[
            { value: "info", label: "Info" },
            { value: "tags", label: "Tags" },
            { value: "log", label: "Log" },
          ]}
        />
      </div>
    </div>
  );
};

export const TopNavBar: Story = () => {
  const [page, setPage] = useState("/datasets");
  return (
    <TopNav
      current={page}
      onNavigate={setPage}
      items={[
        { href: "/", label: "Overview", icon: <Home /> },
        { href: "/datasets", label: "Datasets", icon: <Folder /> },
        { href: "/runs", label: "Runs", icon: <ChartColumn /> },
        { href: "/settings", label: "Settings", icon: <Settings /> },
      ]}
    />
  );
};

export const VerticalTabs: Story = () => {
  const [tab, setTab] = useState("general");
  const items = [
    { value: "general", label: "General", icon: <Settings /> },
    { value: "network", label: "Network", icon: <Globe />, badge: 2 },
    { value: "appearance", label: "Appearance", icon: <Palette />, dirty: true },
    { value: "about", label: "About", icon: <Info /> },
  ];
  return (
    <div className="story-row" style={{ alignItems: "flex-start", gap: 40 }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, width: 480 }}>
        <Tabs
          orientation="vertical"
          aria-label="Settings"
          idPrefix="settings"
          value={tab}
          onChange={setTab}
          items={items}
        />
        <TabPanel idPrefix="settings" value={tab} style={{ color: "var(--rk-text-3)" }}>
          Panel: {tab}
        </TabPanel>
      </div>
      <div style={{ width: 200 }}>
        <Tabs orientation="vertical" variant="pill" aria-label="Settings (pill)" items={items} />
      </div>
    </div>
  );
};

export const Sidebars: Story = () => {
  const [page, setPage] = useState("gallery");
  const [collapsed, setCollapsed] = useState(false);
  const item = (id: string, label: string, icon: React.ReactNode, trailing?: React.ReactNode) => (
    <NavItem label={label} icon={icon} active={page === id} onClick={() => setPage(id)} trailing={trailing} />
  );
  return (
    <div style={{ display: "flex", gap: 24, height: 460 }}>
      <div
        style={{
          width: collapsed ? 56 : 240,
          background: "var(--rk-sunken)",
          borderRadius: 16,
          transition: "width 200ms",
        }}
      >
        <Sidebar
          collapsed={collapsed}
          header={
            <IconButton
              icon={<PanelLeft />}
              label={collapsed ? "Expand" : "Collapse"}
              onClick={() => setCollapsed(!collapsed)}
            />
          }
          footer={item("settings", "Settings", <Settings />)}
        >
          <NavGroup label="Workspace">
            {item("home", "Home", <Home />)}
            {item("gallery", "Gallery", <Images />, <Badge size="sm">2.4K</Badge>)}
            {item(
              "graph",
              "Constructor",
              <Workflow />,
              <StatusDot tone="accent" pulse label="Running" hideLabel />,
            )}
          </NavGroup>
          <NavGroup
            label="Presets"
            collapsible
            action={<IconButton size="sm" icon={<Plus />} label="New preset" />}
          >
            {item("p1", "Tagging", <Folder />)}
            <NavItem
              depth={1}
              label="wd14 + cleanup"
              icon={<FileText />}
              active={page === "p2"}
              onClick={() => setPage("p2")}
            />
            <NavItem
              depth={1}
              label="florence captions"
              icon={<FileText />}
              active={page === "p3"}
              onClick={() => setPage("p3")}
            />
            {item("p4", "Upscale", <Folder />)}
          </NavGroup>
        </Sidebar>
      </div>
    </div>
  );
};

export const DockBar: Story = () => {
  const [v, setV] = useState("power");
  const [section, setSection] = useState("connection");
  return (
    <div className="story-col" style={{ alignItems: "center", paddingTop: 40, gap: 28 }}>
      <Dock
        value={v}
        onChange={setV}
        items={[
          { value: "power", icon: <Zap />, label: "Energy" },
          { value: "sun", icon: <Sun />, label: "Solar" },
          { value: "stats", icon: <ChartColumn />, label: "Stats" },
          { value: "alerts", icon: <Bell />, label: "Alerts", badge: true },
          { value: "settings", icon: <Settings />, label: "Settings" },
        ]}
      />
      <Dock
        mode="tabs"
        variant="labels"
        value={section}
        onChange={setSection}
        items={[
          { value: "connection", icon: <Power />, label: "Connection" },
          { value: "nodes", icon: <Share2 />, label: "Nodes" },
          { value: "alerts", icon: <Bell />, label: "Alerts", badge: 3 },
          { value: "settings", icon: <Settings />, label: "Settings" },
        ].map((item) => ({ ...item, id: `dock-tab-${item.value}`, controls: "dock-panel" }))}
      >
        <DockSeparator />
        <IconButton icon={<Plus />} label="Add node" variant="primary" round size="lg" />
      </Dock>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: APG focuses a panel with no focusable content */}
      <div id="dock-panel" role="tabpanel" aria-labelledby={`dock-tab-${section}`} tabIndex={0}>
        {section}
      </div>
    </div>
  );
};

export const Crumbs: Story = () => {
  const [page, setPage] = useState(4);
  const [size, setSize] = useState(25);
  const total = 480;
  const pages = Math.ceil(total / size);
  return (
    <div className="story-col">
      <Breadcrumbs
        items={[
          { label: "Datasets", icon: <Folder size={14} />, onClick: () => {} },
          { label: "anima", onClick: () => {} },
          { label: "train_v4" },
        ]}
      />
      <Pagination page={page} pageCount={12} onChange={setPage} />
      <Pagination
        page={Math.min(page, pages)}
        pageCount={pages}
        onChange={setPage}
        pageSize={size}
        total={total}
        onPageSizeChange={(n) => {
          setSize(n);
          setPage(1);
        }}
      />
      <Pagination variant="compact" page={page} pageCount={12} onChange={setPage} />
    </div>
  );
};

const SECTIONS = [
  { id: "toc-general", label: "General" },
  { id: "toc-network", label: "Network" },
  { id: "toc-dns", label: "DNS", depth: 1 },
  { id: "toc-routing", label: "Routing", depth: 1 },
  { id: "toc-appearance", label: "Appearance" },
  { id: "toc-about", label: "About" },
];

export const Contents: Story = () => {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const active = useScrollSpy(
    SECTIONS.map((s) => s.id),
    { root, offset: 24 },
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 24, height: 420 }}>
      <div ref={setRoot} style={{ overflow: "auto", paddingRight: 8 }}>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} style={{ minHeight: 200, scrollMarginTop: 12 }}>
            <h3 style={{ margin: "0 0 8px" }}>{s.label}</h3>
            <p style={{ color: "var(--rk-text-3)", margin: 0 }}>Settings for {s.label.toLowerCase()}.</p>
          </section>
        ))}
      </div>
      <TableOfContents items={SECTIONS} active={active} style={{ alignSelf: "start" }} />
    </div>
  );
};
