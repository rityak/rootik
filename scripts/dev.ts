import { watch } from "node:fs";
import { join } from "node:path";
import { generateStyles } from "./styles";

await generateStyles();
let pending: ReturnType<typeof setTimeout> | undefined;
let generating = Promise.resolve();
const watcher = watch(join(import.meta.dir, "../styles"), { recursive: true }, () => {
  clearTimeout(pending);
  pending = setTimeout(() => {
    generating = generating.then(() => generateStyles()).catch((error) => console.error(error));
  }, 80);
});
const ladle = Bun.spawn(["bunx", "ladle", "serve", ...process.argv.slice(2)], {
  stdin: "inherit", stdout: "inherit", stderr: "inherit",
});
const stop = () => { watcher.close(); clearTimeout(pending); ladle.kill(); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
const status = await ladle.exited;
stop();
process.exit(status);
