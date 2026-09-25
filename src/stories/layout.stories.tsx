import type { Story } from "@ladle/react";
import { Folder, Play, RefreshCw, Save } from "lucide-react";
import {
  ActionBar,
  Breadcrumbs,
  Button,
  Card,
  Disclosure,
  PageBody,
  PageHeader,
  ResizablePanel,
  SearchInput,
  SegmentedControl,
  Spacer,
  StatusBar,
  Tabs,
  Toolbar,
} from "..";

export default { title: "Layout" };

export const ToolPage: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: 520,
      borderRadius: 18,
      overflow: "hidden",
      background: "var(--rk-bg)",
      boxShadow: "var(--rk-shadow-1)",
    }}
  >
    <PageHeader
      eyebrow={<Breadcrumbs items={[{ label: "Training", onClick: () => {} }, { label: "anima-v4" }]} />}
      title="LoRA training"
      description="anima-v4 · 2,412 images · rank 32"
      actions={
        <Tabs
          variant="pill"
          size="sm"
          aria-label="Mode"
          items={[
            { value: "setup", label: "Setup" },
            { value: "sample", label: "Sample" },
            { value: "monitor", label: "Monitor" },
          ]}
        />
      }
    />
    <Toolbar>
      <SearchInput size="sm" style={{ width: 220 }} />
      <SegmentedControl
        size="sm"
        aria-label="View"
        options={[
          { value: "a", label: "All" },
          { value: "b", label: "Changed" },
        ]}
      />
      <Spacer />
      <Button size="sm" variant="ghost" icon={<RefreshCw />}>
        Reload
      </Button>
    </Toolbar>
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <ResizablePanel
        defaultSize={220}
        storageKey="story:side"
        style={{ borderRight: "1px solid var(--rk-line)", padding: 12 }}
      >
        <div style={{ color: "var(--rk-text-3)", fontSize: 12 }}>
          Drag or focus the edge and use arrow keys
        </div>
      </ResizablePanel>
      <PageBody width={720}>
        <Card title="Dataset" icon={<Folder />} collapsible>
          Paths and repeats…
        </Card>
        <Card title="Optimizer" collapsible defaultOpen={false}>
          AdamW8bit
        </Card>
        <Card>
          <Disclosure name="adv" title="Advanced: noise offset">
            0.0357
          </Disclosure>
          <Disclosure name="adv" title="Advanced: min SNR gamma">
            5
          </Disclosure>
        </Card>
      </PageBody>
    </div>
    <ActionBar status="Ready · estimated 2h 10m">
      <Button icon={<Save />}>Save preset</Button>
      <Button variant="primary" icon={<Play />}>
        Start
      </Button>
    </ActionBar>
    <StatusBar running progress={0.35} end="GPU 86%">
      Caching latents 845 / 2,412
    </StatusBar>
  </div>
);
