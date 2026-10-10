import { defineConfig } from "vite";

// biome-ignore lint/style/noDefaultExport: Vite loads its configuration from the default export.
export default defineConfig({
  server: { host: "127.0.0.1" },
  plugins: [
    {
      name: "rootik-library-reload",
      handleHotUpdate({ file, server }) {
        const path = file.replaceAll("\\", "/");
        if (
          path.includes("/src/") &&
          !path.includes("/stories/") &&
          (path.endsWith(".ts") || path.endsWith(".tsx"))
        ) {
          // Ladle's virtual configuration cycle cannot safely fast-refresh toolkit barrel exports.
          server.ws.send({ type: "full-reload" });
          return [];
        }
      },
    },
  ],
});
