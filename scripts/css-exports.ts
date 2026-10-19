import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = join(root, "src");
const IMPORT = /^@import\s+"([^"]+)"\s+layer\(rootik\);/gm;
export const cssSources = [...readFileSync(join(source, "styles.css"), "utf8").matchAll(IMPORT)].map((match) => match[1] as string);
const core = ["./tokens.css", "./theme/rain.css", "./theme/signal.css", "./base.css", "./fluent.css"];
const shared: Record<string, string[]> = {
  "layout/floating-window": ["./components/floating-window.css"],
  "layout/splitter": ["./components/splitter.css"],
  "data/select-panel": ["./components/select-panel.css", "./components/input.css", "./components/menu.css"],
  "navigation/stepper": ["./components/stepper.css"],
  "overlays/tour": ["./components/tour.css"],

  "content/card": ["./components/card.css", "./content/content-contours.css"],
  "content/display": ["./components/display.css", "./content/content-contours.css"],
  "content/text": ["./components/text.css", "./content/content-contours.css"],
  "content/prose": ["./components/prose.css", "./content/content-contours.css"],
  "content/code-block": ["./components/code-block.css", "./content/content-contours.css"],
  "content/copy-button": ["./components/copy-button.css", "./content/content-contours.css"],
  "content/editable": ["./components/editable.css", "./content/content-contours.css"],
  "content/file-drop": ["./components/file-drop.css", "./content/content-contours.css"],
  "content/image-grid": ["./components/image-grid.css", "./content/content-contours.css"],
  "content/json-view": ["./components/json-view.css", "./content/content-contours.css"],
  "content/lightbox": ["./components/lightbox.css", "./content/content-contours.css"],
  "content/log-view": ["./components/log-view.css", "./content/content-contours.css"],
  "content/qr-code": ["./components/qr-code.css", "./content/content-contours.css"],
  "content/relative-time": ["./components/relative-time.css", "./content/content-contours.css"],
  "content/rolling-number": ["./components/rolling-number.css", "./content/content-contours.css"],
  "content/spoiler": ["./components/spoiler.css", "./content/content-contours.css"],
  "content/text-shimmer": ["./components/text-shimmer.css", "./content/content-contours.css"],
  "content/timeline": ["./components/timeline.css", "./content/content-contours.css"],
  "content/truncate": ["./components/truncate.css", "./content/content-contours.css"],
  "content/stick-to-bottom": ["./components/stick-to-bottom.css", "./content/content-contours.css"],
  "content/disclosure": ["./components/layout.css", "./content/content-contours.css"],

  "charts/charts": ["./components/charts.css"],
  "charts/chart-parts": ["./components/charts.css"],
  "charts/part-charts": ["./components/part-charts.css"],
  "charts/scatter-chart": ["./components/charts.css"],
  "charts/heatmap": ["./components/heatmap.css", "./components/tooltip.css"],
  "charts/tracker": ["./components/tracker.css", "./components/tooltip.css"],
  "charts/bars-list": ["./components/bars-list.css"],
  "charts/chart-panel": ["./charts/charts-contours.css"],

  "feedback/progress": ["./components/progress.css", "./feedback/feedback-contours.css"],
  "feedback/meter": ["./components/meter.css", "./feedback/feedback-contours.css"],
  "feedback/indicator": ["./components/indicator.css", "./feedback/feedback-contours.css"],
  "feedback/busy-overlay": ["./components/busy-overlay.css", "./feedback/feedback-contours.css"],
  "feedback/data-state": ["./components/data-state.css", "./feedback/feedback-contours.css"],
  "feedback/status": ["./components/display.css", "./feedback/feedback-contours.css"],
  "feedback/notice": ["./components/card.css", "./feedback/feedback-contours.css"],

  "data/data": ["./components/data.css"],
  "data/tree": ["./components/data.css"],
  "data/tree-select": ["./components/input.css", "./components/menu.css", "./controls/controls-contours.css"],
  "data/item": ["./components/item.css"],
  "data/sortable-list": ["./components/sortable-list.css"],
  "data/selection-bar": ["./components/selection-bar.css"],
  "data/scroller": ["./components/scroller.css"],
  "data/overflow-list": ["./components/overflow-list.css"],

  "overlays/dialog": ["./components/dialog.css"],
  "overlays/command-palette": ["./components/dialog.css", "./components/menu.css"],
  "overlays/popover": ["./components/menu.css"],
  "overlays/tooltip": ["./components/tooltip.css"],
  "overlays/hover-card": ["./components/hover-card.css"],
  "overlays/toast": ["./components/toast.css"],
  "overlays/confirm": ["./components/confirm.css"],
  "overlays/shortcuts-sheet": ["./components/shortcuts-sheet.css"],
  "overlays/surface": ["./overlays/overlays-contours.css"],
  "forms/field": ["./components/input.css", "./forms/forms-contours.css"],
  "forms/form": ["./forms/forms-contours.css"],
  "forms/fieldset": ["./components/fieldset.css", "./forms/forms-contours.css"],
  "forms/settings-list": ["./components/settings-list.css", "./forms/forms-contours.css"],
  "forms/schema-form": ["./components/schema-form.css", "./forms/forms-contours.css"],
  "motion/layer": ["./motion/motion.css"],
  "motion/theme-transition": ["./motion/motion.css"],
  "controls/button": ["./components/button.css"],
  "controls/input": ["./components/input.css"],
  "controls/choice": ["./components/choice.css"],
  "controls/checkbox-group": ["./components/checkbox-group.css"],
  "controls/slider": ["./components/slider.css"],
  "controls/number-input": ["./components/number-input.css"],
  "controls/password-input": ["./components/password-input.css"],
  "controls/pin-input": ["./components/pin-input.css"],
  "controls/native-select": ["./components/native-select.css"],
  "controls/combobox": ["./components/combobox.css"],
  "controls/token-field": ["./components/token-field.css"],
  "controls/color-picker": ["./components/color-picker.css"],
  "controls/input-group": ["./components/input-group.css"],
  "controls/split-button": ["./components/split-button.css"],
  "controls/power-button": ["./components/power-button.css"],
  "controls/select": ["./components/input.css", "./components/menu.css"],
  "controls/date-range": ["./components/input.css"],
  "components/field": ["./components/input.css"],
  "navigation/tabs": ["./components/nav.css", "./components/choice.css", "./navigation/navigation-contours.css"],
  "navigation/sidebar": ["./components/nav.css", "./navigation/navigation-contours.css"],
  "navigation/dock": ["./components/nav.css", "./components/choice.css"],
  "navigation/breadcrumbs": ["./components/nav.css"],
  "navigation/pagination": ["./components/nav.css"],
  "navigation/segmented": ["./components/choice.css", "./navigation/navigation-contours.css"],
  "navigation/menu": ["./components/menu.css"],
  "navigation/menubar": ["./components/menubar.css"],
  "components/popover": ["./components/menu.css"],
  "layout/app-shell": ["./components/layout.css"],
  "layout/chrome": ["./components/layout.css"],
  "layout/page": ["./components/layout.css"],
  "layout/resizable-panel": ["./components/layout.css"],
  "layout/master-detail": ["./components/layout.css"],
  "layout/disclosure": ["./components/layout.css"],
  "layout/svg-surface": ["./components/svg-surface.css"],
  "layout/svg-backdrop": ["./components/svg-backdrop.css"],
  "layout/svg-artwork": ["./components/svg-artwork.css"],
  "lib/indicator-box": ["./components/indicator.css"],
  "components/select": ["./components/input.css", "./components/menu.css"],
  "components/combobox": ["./components/menu.css"],
  "components/token-field": ["./components/menu.css"],
  "components/heatmap": ["./components/tooltip.css"],
  "components/tracker": ["./components/tooltip.css"],
  "components/select-panel": ["./components/input.css", "./components/menu.css"],
  "components/tree": ["./components/data.css"],
  "components/tree-select": ["./components/input.css", "./components/menu.css"],
  "components/chart-parts": ["./components/charts.css"],
  "components/scatter-chart": ["./components/charts.css"],
};
export const cssEntries = [...new Set([...cssSources, "./navigation.css", "./controls.css", "./forms.css", "./overlays.css", "./feedback.css", "./content.css", ...readdirSync(join(source, "components")).filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx")).map((file) => `./components/${file.replace(/\.tsx$/, ".css")}`)])];

export function cssDependencies(entry: string) {
  if (core.includes(entry)) return [entry];
  const files = new Set<string>(core);
  const visited = new Set<string>();
  function visit(file: string) {
    if (visited.has(file)) return;
    visited.add(file);
    const stem = relative(source, file).replaceAll("\\", "/").replace(/\.tsx?$/, "");
    const css = `./${stem}.css`;
    if (cssSources.includes(css)) files.add(css);
    if (stem.startsWith("controls/")) files.add("./controls/controls-contours.css");
    for (const dependency of shared[stem] ?? []) files.add(dependency);
    const transpiler = new Bun.Transpiler({ loader: "tsx" });
    const code = transpiler.transformSync(readFileSync(file, "utf8"));
    for (const imported of transpiler.scanImports(code)) {
      const specifier = imported.path;
      if (!specifier.startsWith(".")) continue;
      const path = resolve(dirname(file), specifier);
      const dependency = [path + ".tsx", path + ".ts"].find(existsSync);
      if (dependency) visit(dependency);
    }
  }
  const path = join(source, entry.replace(/\.css$/, ""));
  const module = [path + ".tsx", path + ".ts", join(path, "index.ts")].find(existsSync);
  if (entry === "./components/data.css") visit(join(source, "data/index.ts"));
  else if (entry === "./components/charts.css") visit(join(source, "charts/index.ts"));
  else if (module) visit(module);
  if (cssSources.includes(entry)) files.add(entry);
  return cssSources.filter((file) => files.has(file));
}

export async function generateCssExports(check = false) {
  const dir = join(source, "css");
  mkdirSync(dir, { recursive: true });
  for (const path of cssEntries) {
    const name = path.slice(path.lastIndexOf("/") + 1);
    const dependencies = core.includes(path) ? [path] : cssDependencies(path);
    const body = "/* Generated CSS export. Run bun run styles; do not edit. */\n" + dependencies.map((file) => `@import "../${file.slice(2)}" layer(rootik);`).join("\n") + "\n";
    const target = join(dir, name);
    const previous = existsSync(target) ? readFileSync(target, "utf8") : "";
    if (previous === body) continue;
    if (check) throw new Error(`Stale CSS export ${name}; run bun run styles`);
    writeFileSync(target, body);
  }
  const content = cssDependencies("./content.css");
  assert(["card", "display", "text", "prose", "code-block", "json-view", "log-view", "image-grid", "lightbox", "qr-code", "svg-surface"].every((family) => content.includes(`./components/${family}.css`)) && content.includes("./content/content-contours.css"), "Content CSS dependency closure is incomplete");
  const charts = cssDependencies("./components/charts.css");
  assert(["charts", "part-charts", "heatmap", "tracker", "bars-list", "svg-surface", "tooltip"].every((family) => charts.includes(`./components/${family}.css`)) && charts.includes("./charts/charts-contours.css"), "Charts CSS dependency closure is incomplete");
  const feedback = cssDependencies("./feedback.css");
  assert(["progress", "meter", "indicator", "busy-overlay", "data-state", "display", "card", "svg-surface", "svg-control-frame"].every((family) => feedback.includes(`./components/${family}.css`)) && feedback.includes("./feedback/feedback-contours.css"), "Feedback CSS dependency closure is incomplete");
  const data = cssDependencies("./components/data.css");
  assert(["data", "item", "sortable-list", "selection-bar", "scroller", "overflow-list", "svg-surface"].every((family) => data.includes(`./components/${family}.css`)), "Data CSS dependency closure is incomplete");
  const select = cssDependencies("./components/select.css");
  assert(select.includes("./components/menu.css") && select.includes("./components/input.css"), "Select CSS dependency closure is incomplete");
  const controls = cssDependencies("./controls.css");
  assert(["button", "input", "choice", "slider", "native-select", "menu", "svg-control-frame"].every((family) => controls.includes(`./components/${family}.css`)), "Controls CSS dependency closure is incomplete");
  const layout = cssDependencies("./components/layout.css");
  const forms = cssDependencies("./forms.css");
  const overlays = cssDependencies("./overlays.css");
  assert(["dialog", "menu", "tooltip", "hover-card", "toast", "confirm", "shortcuts-sheet", "svg-surface"].every((family) => overlays.includes(`./components/${family}.css`)) && overlays.includes("./overlays/overlays-contours.css"), "Overlays CSS dependency closure is incomplete");
  assert(["fieldset", "settings-list", "schema-form", "input", "svg-surface", "svg-control-frame"].every((family) => forms.includes(`./components/${family}.css`)) && forms.includes("./forms/forms-contours.css"), "Forms CSS dependency closure is incomplete");
  const navigation = cssDependencies("./navigation.css");
  assert(["nav", "choice", "menu", "menubar", "svg-control-frame"].every((family) => navigation.includes(`./components/${family}.css`)) && navigation.includes("./navigation/navigation-contours.css"), "Navigation CSS dependency closure is incomplete");
  assert(!navigation.includes("./components/layout.css"), "Navigation unexpectedly depends on AppShell styles");
  assert(["svg-surface", "svg-backdrop", "svg-artwork"].every((family) => layout.includes(`./components/${family}.css`)), "Layout SVG CSS dependency closure is incomplete");
  assert(cssSources.length === new Set(cssSources.map((file) => file.slice(file.lastIndexOf("/") + 1))).size, "CSS export names collide");
}
