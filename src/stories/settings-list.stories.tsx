import type { Story } from "@ladle/react";
import { useState } from "react";
import { Button, Checkbox, SegmentedControl, Select, SettingsGroup, SettingsRow, Switch } from "..";

export default { title: "Layout" };

export const SettingsPage: Story = () => {
  const [killSwitch, setKillSwitch] = useState(true);
  const [protocol, setProtocol] = useState("auto");
  return (
    <div className="story-col" style={{ maxWidth: 560 }}>
      <SettingsGroup title="General" description="How the app starts and talks to you">
        <SettingsRow label="Launch at startup" hint="Start minimized to the tray">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Language">
          <Select
            size="sm"
            style={{ width: 160 }}
            defaultValue="en"
            options={[
              { value: "en", label: "English" },
              { value: "ru", label: "Русский" },
            ]}
          />
        </SettingsRow>
      </SettingsGroup>
      <SettingsGroup title="Connection">
        <SettingsRow label="Protocol" hint="Auto picks the fastest one per server">
          <SegmentedControl
            size="sm"
            value={protocol}
            onChange={setProtocol}
            options={[
              { value: "auto", label: "Auto" },
              { value: "wg", label: "WireGuard" },
              { value: "vless", label: "VLESS" },
            ]}
          />
        </SettingsRow>
        <SettingsRow
          label="Kill switch"
          hint="Block traffic when the tunnel drops"
          nested={
            killSwitch && (
              <>
                <Checkbox label="Allow LAN while blocked" defaultChecked />
                <Checkbox label="Block until the app reconnects" />
              </>
            )
          }
        >
          <Switch checked={killSwitch} onChange={(e) => setKillSwitch(e.target.checked)} />
        </SettingsRow>
      </SettingsGroup>
      <SettingsGroup title="Danger zone" tone="danger">
        <SettingsRow label="Reset all settings" hint="Profiles and servers stay">
          <Button size="sm" variant="danger">
            Reset…
          </Button>
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
};
