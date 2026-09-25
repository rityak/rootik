import type { Story } from "@ladle/react";
import { PauseIcon, PlayIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { IconButton, type LogLine, LogView } from "..";

export default { title: "Data" };

const SOURCES = ["trainer", "loader", "cuda", "saver"];

function fakeLine(i: number, time: number): LogLine {
  const r = (i * 7919) % 100;
  if (r < 3)
    return {
      time,
      level: "error",
      source: "cuda",
      message: `CUDA error: out of memory (tried to allocate ${(r + 1) * 0.5} GiB)`,
    };
  if (r < 10)
    return {
      time,
      level: "warn",
      source: "trainer",
      message: `loss spiked to ${(2 + r / 10).toFixed(3)} at step ${i}`,
    };
  if (r < 40)
    return {
      time,
      level: "debug",
      source: SOURCES[i % 4],
      message: `batch ${i % 250}/250 · ${(r * 3.1).toFixed(1)} img/s`,
    };
  if (r < 45) return { time, message: `[stdout] ${"=".repeat(r % 30)}> ${r}%` };
  return {
    time,
    level: "info",
    source: SOURCES[i % 4],
    message: `step ${i} · loss ${(1 / (1 + i / 400)).toFixed(4)} · lr 1.0e-4 · grad_norm ${(0.5 + (r % 13) / 10).toFixed(2)}`,
  };
}

const START = Date.UTC(2026, 8, 25, 9, 0, 0);

export const TrainingLog: Story = () => {
  const [lines, setLines] = useState<LogLine[]>(() =>
    Array.from({ length: 2000 }, (_, i) => fakeLine(i, START + i * 137)),
  );
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLines((prev) => [
        ...prev,
        ...Array.from({ length: 3 }, (_, k) => fakeLine(prev.length + k, START + (prev.length + k) * 137)),
      ]);
    }, 400);
    return () => clearInterval(t);
  }, [running]);
  return (
    <LogView
      label="Training log"
      style={{ height: 460, maxWidth: 980 }}
      lines={lines}
      lineNumbers
      actions={
        <>
          <IconButton
            size="sm"
            icon={running ? <PauseIcon /> : <PlayIcon />}
            label={running ? "Pause" : "Resume"}
            onClick={() => setRunning(!running)}
          />
          <IconButton size="sm" icon={<Trash2Icon />} label="Clear" onClick={() => setLines([])} />
        </>
      }
    />
  );
};

export const BareLog: Story = () => (
  <LogView
    label="Process output"
    toolbar={false}
    showSource={false}
    style={{ height: 220, maxWidth: 640 }}
    lines={[
      { time: "09:00:00", level: "info", message: "Listening on 127.0.0.1:7860" },
      { time: "09:00:02", level: "warn", message: "xformers not available, falling back to SDPA" },
      {
        time: "09:00:05",
        message:
          "Loading weights [a1b2c3] from models/sdxl.safetensors — this line is long enough to scroll sideways instead of wrapping",
      },
      {
        time: "09:00:09",
        level: "error",
        message: "Traceback (most recent call last): FileNotFoundError: vae.pt",
      },
    ]}
  />
);
