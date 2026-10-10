import type { Story } from "@ladle/react";
import { useState } from "react";
import {
  AppearanceSettings,
  AppShell,
  Badge,
  Button,
  Card,
  DataTable,
  Form,
  Input,
  RootikProvider,
  Scope,
  SegmentedControl,
  Slider,
  Spinner,
  Switch,
  useAppearance,
} from "..";

export default { title: "Appearance" };

const rows = [
  { name: "Stockholm", latency: 24, sessions: 128, state: "Online" },
  { name: "Amsterdam", latency: 31, sessions: 96, state: "Online" },
  { name: "Helsinki", latency: 18, sessions: 84, state: "Online" },
  { name: "Berlin", latency: 42, sessions: 72, state: "Maintenance" },
  { name: "London", latency: 48, sessions: 114, state: "Online" },
  { name: "Oslo", latency: 22, sessions: 63, state: "Online" },
];

function Pilot() {
  const { values, set } = useAppearance();
  const [submitted, setSubmitted] = useState(false);
  return (
    <AppShell
      style={{ height: "min(960px, 100dvh)", minHeight: 600 }}
      header={
        <div
          className="story-row"
          style={{ padding: "var(--rk-pad)", justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div>
            <span className="rk-section-label">ROOTIK / RAIN</span>
            <h1 style={{ margin: 0, fontSize: "var(--rk-text-xl)" }}>Network workspace</h1>
          </div>
          <SegmentedControl
            aria-label="Surface material"
            value={String(values.material)}
            onChange={(v) => set("material", v)}
            options={[
              { value: "solid", label: "Solid" },
              { value: "veil", label: "Veil" },
              { value: "frost", label: "Frost" },
              { value: "liquid", label: "Liquid" },
            ]}
          />
        </div>
      }
      aside={
        <div
          style={{
            padding: "var(--rk-pad)",
            overflow: "auto",
            width: "clamp(320px, 42vw, 540px)",
            maxWidth: "100%",
          }}
        >
          <AppearanceSettings only={["background", "effects", "color", "type"]} variant="plain" />
        </div>
      }
    >
      <div className="story-col" style={{ padding: "var(--rk-pad)" }}>
        <Card
          title="Edge nodes"
          description="Connections across the northern region"
          actions={<Button variant="primary">Add node</Button>}
          padding="none"
        >
          <DataTable
            rows={rows}
            rowKey={(row) => row.name}
            columns={[
              { key: "name", header: "Location" },
              { key: "latency", header: "Latency", cell: (row) => `${row.latency} ms` },
              { key: "sessions", header: "Sessions" },
              { key: "state", header: "State", cell: (row) => <Badge>{row.state}</Badge> },
            ]}
          />
        </Card>
        <div className="story-row" style={{ alignItems: "stretch", flexWrap: "wrap" }}>
          <Card title="Connection policy" style={{ flex: "1 1 260px" }}>
            <Form onSubmit={() => setSubmitted(true)}>
              <div className="story-col">
                <Input aria-label="Workspace name" name="workspace" placeholder="Workspace name" required />
                <Slider label="Timeout" defaultValue={30} min={5} max={120} showValue={(v) => `${v}s`} />
                <Switch defaultChecked label="Reconnect automatically" />
                <div className="story-row">
                  <Button type="submit" variant="primary">
                    Save policy
                  </Button>
                  <Button disabled>Export</Button>
                </div>
                <output aria-live="polite">{submitted ? "Policy saved" : "No changes saved"}</output>
              </div>
            </Form>
          </Card>
          <Scope values={{ material: "solid", density: "compact", motion: "off" }}>
            <Card
              title="Scoped solid"
              description="Opaque, compact, motion off"
              style={{ flex: "1 1 220px" }}
            >
              <div className="story-col">
                <Input placeholder="Filter" />
                <Button>Secondary</Button>
                <Button variant="ghost">Ghost action</Button>
                <Spinner label="Waiting" />
              </div>
            </Card>
          </Scope>
        </div>
      </div>
    </AppShell>
  );
}

/** Real provider/settings/components; no prototype skin or hard-coded material overrides. */
export const Rain: Story = () => {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setTarget} data-rk-scope="">
      {target && (
        <RootikProvider target={target} theme="rain" storageKey="rootik:rain-pilot">
          <Pilot />
        </RootikProvider>
      )}
    </div>
  );
};
