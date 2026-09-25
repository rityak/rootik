import type { Story } from "@ladle/react";
import { useState } from "react";
import { Callout, Card, FileDrop, type FileRejection, formatBytes, icons } from "..";

export default { title: "Inputs" };

export const DropZone: Story = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);
  return (
    <div className="story-col" style={{ maxWidth: 520 }}>
      <Card title="Import images">
        <div className="story-col">
          <FileDrop
            accept="image/*,.zip"
            maxSize={20 * 1024 ** 2}
            hint="PNG, JPG, WebP or a .zip — up to 20 MB each"
            onFiles={(f) => setFiles((prev) => [...prev, ...f])}
            onReject={setRejected}
          />
          <FileDrop
            size="sm"
            accept=".json"
            multiple={false}
            hint="One captions.json"
            onFiles={(f) => setFiles((prev) => [...prev, ...f])}
          />
          <FileDrop size="sm" disabled onFiles={() => {}} hint="Disabled while an import runs" />
        </div>
      </Card>
      {rejected.length > 0 && (
        <Callout tone="warn" title={`${rejected.length} file(s) skipped`} onDismiss={() => setRejected([])}>
          {rejected.map((r) => `${r.file.name} (${r.reason})`).join(", ")}
        </Callout>
      )}
      {files.map((f) => (
        <div key={f.name + f.size} className="story-row" style={{ gap: 8 }}>
          <icons.FileIcon />
          <span className="rk-mono">{f.name}</span>
          <span style={{ color: "var(--rk-text-3)" }}>{formatBytes(f.size).text}</span>
        </div>
      ))}
    </div>
  );
};
