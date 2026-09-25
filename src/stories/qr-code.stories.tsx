import type { Story } from "@ladle/react";
import { useState } from "react";
import { Card, CopyButton, Field, Input, QrCode, SegmentedControl } from "..";

export default { title: "Display" };

const LINK =
  "vless://9f2c1a7b-3e44-4c1d-a1b2-c3d4e5f60718@vpn.example.com:443?security=reality&sni=www.example.com&fp=chrome&type=tcp#Tokyo-01";

export const QrCodes: Story = () => {
  const [text, setText] = useState(LINK);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  return (
    <div className="story-row" style={{ alignItems: "flex-start" }}>
      <Card title="Share connection" description="Scan in the mobile app" style={{ width: 300 }}>
        <div className="story-col" style={{ alignItems: "center" }}>
          <QrCode value={text || " "} level={level} size={220} label="Connection link" />
          <CopyButton value={text} variant="secondary" size="sm">
            Copy link
          </CopyButton>
        </div>
      </Card>
      <Card title="Try it" style={{ width: 360 }}>
        <div className="story-col">
          <Field label="Text or URL">
            <Input mono value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <SegmentedControl
            aria-label="Error correction"
            value={level}
            onChange={setLevel}
            options={(["L", "M", "Q", "H"] as const).map((v) => ({ value: v, label: v }))}
          />
          <div className="story-row">
            <QrCode value="https://example.com" size={72} quiet={2} />
            <QrCode value="Привет 🌍" size={72} quiet={2} level="H" />
          </div>
        </div>
      </Card>
    </div>
  );
};
