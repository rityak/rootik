import type { Story } from "@ladle/react";
import { Code, CodeBlock } from "..";

export default { title: "Display" };

const yaml = `mixed-port: 7890
mode: rule
log-level: info
proxies:
  - name: n3-fra-01
    type: vless
    server: node-3.umiray.net
    port: 443
    uuid: 6f1c2a9e-3b7d-4f0a-9c55-8e2d41b7a0f3
    reality-opts: { public-key: "Zb3pX…", short-id: "8f2a" }
rules:
  - DOMAIN-SUFFIX,local,DIRECT
  - GEOIP,RU,DIRECT
  - MATCH,PROXY
`;

const log = `2026-09-25 01:12:03 INFO  step 1200 loss 0.4412 lr 3.0e-4 124 img/s
2026-09-25 01:12:09 WARN  grad norm 41.2 exceeds clip 10.0, clipping (this line is long on purpose to show horizontal scrolling or wrapping)
2026-09-25 01:12:15 INFO  step 1250 loss 0.4380 lr 3.0e-4 126 img/s`;

export const CodeBlocks: Story = () => (
  <div className="story-col" style={{ maxWidth: 620 }}>
    <p style={{ margin: 0 }}>
      Run <Code>bun run check</Code> before pushing; the config lives in{" "}
      <Code>%APPDATA%/umiray/config.yaml</Code>.
    </p>
    <CodeBlock
      title="config.yaml"
      language="yaml"
      code={yaml}
      lineNumbers
      highlight={[6, 7, 8]}
      maxHeight={260}
    />
    <CodeBlock title="train.log" code={log} />
    <CodeBlock code="bunx rootik init --preset graphite" copyable={false} />
  </div>
);
