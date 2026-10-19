import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL("..", import.meta.url)),
  optimizeDeps: { entries: ["design-lab/index.html"] },
  esbuild: { jsx: "automatic" },
  server: { host: "127.0.0.1", port: 61002, strictPort: true },
  build: {
    outDir: "build-design-lab",
    rollupOptions: { input: "design-lab/index.html" },
  },
});
