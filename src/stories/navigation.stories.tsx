import type { Story } from "@ladle/react";
import {
  Bell,
  ChartColumn,
  FileText,
  Folder,
  Home,
  Images,
  LayoutDashboard,
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
  TabPanel,
  Tabs,
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
            {item("graph", "Constructor", <Workflow />, <StatusDot tone="accent" pulse />)}
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
        variant="labels"
        value={section}
        onChange={setSection}
        items={[
          { value: "connection", icon: <Power />, label: "Connection" },
          { value: "nodes", icon: <Share2 />, label: "Nodes" },
          { value: "alerts", icon: <Bell />, label: "Alerts", badge: 3 },
          { value: "settings", icon: <Settings />, label: "Settings" },
        ]}
      >
        <DockSeparator />
        <IconButton icon={<Plus />} label="Add node" variant="primary" round size="lg" />
      </Dock>
    </div>
  );
};

export const Crumbs: Story = () => {
  const [page, setPage] = useState(4);
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
    </div>
  );
};
