import type { Story } from "@ladle/react";
import { CopyIcon, SearchIcon } from "lucide-react";
import { Button, Field, IconButton, Input, InputAddon, InputGroup, Select } from "..";

export default { title: "Inputs" };

export const InputGroups: Story = () => (
  <div className="story-col" style={{ maxWidth: 460 }}>
    <Field label="Webhook URL">
      <InputGroup block>
        <InputAddon mono>https://</InputAddon>
        <Input mono defaultValue="hooks.example" />
        <InputAddon mono>.com/run</InputAddon>
      </InputGroup>
    </Field>
    <Field label="Timeout">
      <InputGroup>
        <Input defaultValue="1500" inputMode="numeric" style={{ width: 120 }} />
        <InputAddon>ms</InputAddon>
      </InputGroup>
    </Field>
    <Field label="Server">
      <InputGroup block>
        <Select
          defaultValue="vless"
          style={{ width: 120 }}
          options={[
            { value: "vless", label: "VLESS" },
            { value: "trojan", label: "Trojan" },
            { value: "ss", label: "Shadowsocks" },
          ]}
        />
        <Input mono placeholder="host:port" />
        <Button variant="primary">Connect</Button>
      </InputGroup>
    </Field>
    <Field label="Share link">
      <InputGroup block>
        <Input mono readOnly defaultValue="vless://9f2c…@vpn.example.com:443" />
        <IconButton variant="secondary" icon={<CopyIcon />} label="Copy link" />
      </InputGroup>
    </Field>
    <InputGroup block aria-label="Search images">
      <Input size="sm" icon={<SearchIcon />} placeholder="Search images…" />
      <Button size="sm">Search</Button>
    </InputGroup>
  </div>
);
