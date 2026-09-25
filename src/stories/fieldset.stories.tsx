import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, Checkbox, Field, Fieldset, Input, SegmentedControl, Select, Switch } from "..";

export default { title: "Inputs" };

export const Fieldsets: Story = () => {
  const [proxy, setProxy] = useState(false);
  return (
    <Card title="Connection" style={{ maxWidth: 520 }}>
      <div className="story-col">
        <Fieldset legend="Server" description="Where the client connects">
          <Field label="Host">
            <Input defaultValue="vpn.example.com" mono />
          </Field>
          <Fieldset row aria-label="Port and protocol">
            <Field label="Port">
              <Input defaultValue="443" mono inputMode="numeric" />
            </Field>
            <Field label="Protocol">
              <Select
                defaultValue="vless"
                options={[
                  { value: "vless", label: "VLESS" },
                  { value: "trojan", label: "Trojan" },
                ]}
              />
            </Field>
          </Fieldset>
        </Fieldset>
        <Switch
          label="Use an upstream proxy"
          labelPosition="start"
          checked={proxy}
          onChange={(e) => setProxy(e.target.checked)}
        />
        <Fieldset
          variant="outline"
          legend="Upstream proxy"
          description={
            proxy ? "Traffic goes through this proxy first" : "Disabled: the whole group is locked natively"
          }
          disabled={!proxy}
        >
          <Field label="Address">
            <Input placeholder="socks5://127.0.0.1:1080" mono />
          </Field>
          <SegmentedControl
            aria-label="Type"
            defaultValue="socks"
            options={[
              { value: "socks", label: "SOCKS5" },
              { value: "http", label: "HTTP" },
            ]}
          />
          <Checkbox label="Resolve DNS through the proxy" defaultChecked />
        </Fieldset>
      </div>
    </Card>
  );
};
