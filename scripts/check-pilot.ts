import assert from "node:assert/strict";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { cssEntries, cssDependencies } from "./css-exports";
import { STYLE_FAMILIES } from "./styles";

const root = join(import.meta.dir, "..");
const fixture = join(root, "audit/package-fixture");
const installed = join(fixture, "node_modules/rootik");
await mkdir(installed, { recursive: true });

async function run(args: string[], cwd = root) {
  const child = Bun.spawn(args, { cwd, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, status] = await Promise.all([
    new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
  ]);
  assert.equal(status, 0, `${args.join(" ")}\n${stderr}\n${stdout}`);
  return stdout;
}

await run(["bun", "pm", "pack", "--ignore-scripts", "--quiet", "--filename", join(fixture, "rootik.tgz")]);
const entries = await run(["tar", "-tf", join(fixture, "rootik.tgz")]);
assert(!entries.includes(".test.ts"), "Tests leaked into the package");
assert(!entries.includes("package/styles/"), "Authoring files leaked into the package");
await run(["tar", "-xf", join(fixture, "rootik.tgz"), "-C", installed, "--strip-components=1"]);
await writeFile(join(fixture, "package.json"), JSON.stringify({ name: "rootik-pilot-consumer", private: true, type: "module" }));
await writeFile(join(fixture, "index.html"), '<div id="root"></div><script type="module" src="/app.tsx"></script>');
await writeFile(join(fixture, "app.tsx"), `
import { createRoot } from 'react-dom/client';
import { Card } from 'rootik';
import { Button, Input, NativeSelect, ChoiceCards } from 'rootik/controls';
import { RootikProvider } from 'rootik/theme';
import { AppShell, FloatingWindow, Splitter, SvgBackdrop, SvgSurface } from 'rootik/layout';
import { Tabs, Dock, Stepper } from 'rootik/navigation';
import 'rootik/styles.css';
import 'rootik/layout/styles.css';
import 'rootik/navigation/styles.css';
import 'rootik/controls/styles.css';
import 'rootik/fonts.css';
import { MotionLayer } from 'rootik/motion';
import { Field, Fieldset, Form, SchemaForm } from 'rootik/forms';
import { Dialog, Popover, Tour } from 'rootik/overlays';
import 'rootik/motion/styles.css';
import 'rootik/forms/styles.css';
import 'rootik/overlays/styles.css';
import { DataTable, TreeSelect, SelectPanel } from 'rootik/data';
import 'rootik/data/styles.css';
import { Progress, Badge, Callout } from 'rootik/feedback';
import 'rootik/feedback/styles.css';
import { ChartPanel, Gauge, Heatmap } from 'rootik/charts';
import 'rootik/charts/styles.css';
import { Card as ContentCard, CodeBlock, JsonView, Avatar } from 'rootik/content';
import 'rootik/content/styles.css';
createRoot(document.getElementById('root')!).render(<RootikProvider theme="maomao" defaults={{colorMode:'light',effects:'expressive',font:'rubik',monoFont:'jetbrains'}}><AppShell surface={{shape:'bevel'}} header="Packed layout" dock={<Dock items={[{value:'one',label:'One',icon:'1'}]} value="one" />} backdrop={<SvgBackdrop pattern="stripes" />}><FloatingWindow open={false} title="Packed inspector" surface={{shape:"bevel"}}><Input aria-label="Inspector field" /></FloatingWindow><Splitter grip>{[<span key="left">List</span>,<span key="right">Preview</span>]}</Splitter><Stepper svgBorder="cut" current={1} steps={[{id:"one",label:"One"},{id:"two",label:"Two"}]} /><SelectPanel title="Packed picker" surface={{shape:"ticket"}} trigger={<Button>Pick</Button>} options={[{value:"one",label:"One"}]} /><Tour open={false} steps={[]} onClose={()=>{}} surface={{shape:"bevel"}} /><Tabs variant="pill" svgBorder="cut" items={[{value:'one',label:'One'}]} /><SvgSurface shape="ticket"><Card title="Packed consumer"><MotionLayer active effect="flow" /><Input aria-label="Search" svgBorder="cut" /><NativeSelect svgBorder="ticket" aria-label="Native region" options={[{value:"one",label:"One"}]} /><ChoiceCards svgBorder="notch" options={[{value:"one",label:"One"}]} /><Button variant="primary">Save</Button><Dialog open={false} onClose={()=>{}} title="Packed dialog" surface={{shape:"bevel"}}>Packed content</Dialog><Popover title="Packed popover" surface={{shape:"ticket"}} trigger={<Button>Open preview</Button>}>Details</Popover><ContentCard title="Packed article" surface={{shape:"ticket"}}><Avatar name="North Gateway" /><CodeBlock title="profile.ts" code="const value = 42;" /><JsonView data={{ready:true}} /></ContentCard><ChartPanel title="Packed chart" shape="saddle" animation="once"><Gauge value={42} label="Capacity" /><Heatmap label="Packed heatmap" rows={["North"]} columns={["Now"]} values={[[42]]} showValues /></ChartPanel><Callout title="Packed feedback" surface={{shape:"bevel"}}><Badge svgBorder="cut" tone="success">Ready</Badge><Progress value={42} label="Packed progress" decoration="segments" /></Callout><DataTable surface={{shape:"bevel"}} aria-label="Packed rows" rows={[{name:"North"}]} rowKey={r=>r.name} columns={[{key:"name",header:"Name"}]} /><TreeSelect aria-label="Packed tree" items={[{id:"one",label:"One"}]} svgBorder="cut" /><Form><Fieldset legend="Packed form" surface={{shape:"bevel"}}><Field label="Form gateway"><Input name="formGateway" svgBorder="cut" /></Field></Fieldset></Form><SchemaForm schema={[{key:"name",type:"string",label:"Profile",default:"North"}]} surface={{shape:"ticket"}} svgBorder="cut" /></Card></SvgSurface></AppShell></RootikProvider>);
`);
await writeFile(join(fixture, "button.ts"), "export { Button } from 'rootik';\n");
const output: Record<string, unknown> = {};
for (const entry of cssEntries) {
  const file = entry.slice(entry.lastIndexOf("/") + 1);
  const wrapper = await readFile(join(installed, "dist/css", file), "utf8");
  for (const dependency of cssDependencies(entry))
    assert(wrapper.includes(`./internal/${dependency.slice(dependency.lastIndexOf("/") + 1)}`), `Missing dependency in ${file}: ${dependency}`);
  assert(wrapper.includes("layer(rootik)"), `Missing CSS layer in ${file}`);
}
for (const mode of ["dist", "source"] as const) {
  const config = join(fixture, `vite-${mode}.mjs`);
  await writeFile(config, `export default {
    resolve: { conditions: ${JSON.stringify(mode === "source" ? ["source"] : [])} },
    esbuild: { jsx: 'automatic' },
    build: { outDir: 'build-${mode}', target: 'esnext', minify: false }
  };`);
  await run(["bunx", "vite", "build", fixture, "--config", config]);
  const assets = join(fixture, `build-${mode}/assets`);
  const cssFiles = (await readdir(assets)).filter((file) => file.endsWith(".css"));
  assert.equal(cssFiles.length, 1);
  const css = await readFile(join(assets, cssFiles[0] as string), "utf8");
  assert(css.includes(".rk-button") && css.includes(".rk-input") && css.includes(".rk-card"));
  assert(css.includes("data-rk-palette"));
  assert(css.includes(".rk-svg-surface") && css.includes("Rubik Variable"), `Packed ${mode} missed layout or fonts`);
  assert(css.includes("rk-light-sheen"), `Packed ${mode} missed motion styles`);
  assert(css.includes(".rk-content-surface") && css.includes(".rk-json-value") && css.includes(".rk-lightbox") && css.includes(".rk-code-editor"), `Packed ${mode} missed content styles`);
  assert(css.includes(".rk-chart-panel") && css.includes(".rk-heatmap-cell") && css.includes(".rk-tracker-bar"), `Packed ${mode} missed charts styles`);
  assert(css.includes(".rk-feedback-track") && css.includes(".rk-feedback-surface"), `Packed ${mode} missed feedback styles`);
  assert(css.includes(".rk-table-surface") && css.includes(".rk-tree-row") && css.includes(".rk-selection-bar"), `Packed ${mode} missed data styles`);
  assert(css.includes(".rk-fieldset-surface") && css.includes(".rk-settings-content"), `Packed ${mode} missed forms styles`);
  assert(css.includes(".rk-overlay-surface") && css.includes(".rk-dialog-panel[data-surface]"), `Packed ${mode} missed overlay styles`);
  assert(css.includes(".rk-native-select-wrap[data-svg-border]"), `Packed ${mode} missed SVG controls styles`);
  assert(css.includes(".rk-nav-link[data-svg-border]"), `Packed ${mode} missed SVG navigation styles`);
  assert((await readdir(assets)).some((file) => file.endsWith(".woff2")), `Packed ${mode} missed font assets`);
  const built = await Bun.build({ entrypoints: [join(fixture, "button.ts")], conditions: mode === "source" ? ["source"] : [], minify: true, target: "browser", external: ["react", "react-dom"] });
  assert(built.success);
  const js = await built.outputs[0]?.text();
  assert(js && !js.includes("vanilla-extract"));
  output[mode] = { cssBytes: Buffer.byteLength(css), buttonJsBytes: Buffer.byteLength(js), buttonJsGzipBytes: gzipSync(js).byteLength };
}

await writeFile(join(fixture, "app.tsx"), `
import { createRoot } from 'react-dom/client';
import { Button, Combobox, Select, TreeSelect, RootikProvider } from 'rootik';
import './selective.css';
createRoot(document.getElementById('root')!).render(<RootikProvider theme="rain"><Button className="rounded-none">Square utility</Button><Select aria-label="Select" options={[{value:'one',label:'One'}]} /><Combobox aria-label="Combo" options={[]} /><TreeSelect aria-label="Tree" items={[{id:'one',label:'One'}]} /></RootikProvider>);
`);
await writeFile(join(fixture, "selective.css"), `
@layer theme, base, rootik, components, utilities;
@import "tailwindcss";
@import "rootik/css/button.css";
@import "rootik/css/select.css";
@import "rootik/css/combobox.css";
@import "rootik/css/tree-select.css";
@import "rootik/tailwind.css";
@source "./app.tsx";
.rk-button.consumer-override { border-radius: 0; }
`);
for (const mode of ["dist", "source"] as const) {
  const config = join(fixture, `vite-tailwind-${mode}.mjs`);
  await writeFile(config, `import tailwind from '@tailwindcss/vite'; export default {
    plugins: [tailwind()],
    resolve: { conditions: ${JSON.stringify(mode === "source" ? ["source"] : [])} },
    esbuild: { jsx: 'automatic' },
    build: { outDir: 'build-tailwind-${mode}', target: 'esnext', minify: false }
  };`);
  await run(["bunx", "vite", "build", fixture, "--config", config]);
  const assets = join(fixture, `build-tailwind-${mode}/assets`);
  const files = (await readdir(assets)).filter((file) => file.endsWith(".css"));
  const css = await readFile(join(assets, files[0] as string), "utf8");
  for (const selector of [".rk-select-trigger", ".rk-menu-item", ".rk-combobox", ".rk-tree-row", ".rounded-none"])
    assert(css.includes(selector), `Selective/Tailwind ${mode} missed ${selector}`);
  assert(css.includes("@layer rootik") && css.includes("@layer utilities") && !css.includes("@import"));
  output[`tailwind-${mode}`] = { cssBytes: Buffer.byteLength(css), dependencyClosure: "passed", layerOrder: "theme, base, rootik, components, utilities" };
}
await run(["node", "--input-type=module", "--eval", `
  import { createElement } from 'react';
  import { renderToString } from 'react-dom/server';
  import { Button } from 'rootik';
  if (!renderToString(createElement(Button, null, 'Packed SSR')).includes('rk-button')) throw new Error('Packed SSR failed');
`], fixture);
const css = await readFile(join(root, "dist/styles.css"));
const evidence = { ...output, stylesBytes: css.byteLength, stylesGzipBytes: gzipSync(css).byteLength, packedSsr: "passed", consumerPlugin: "none", cssExports: cssEntries.length, extractedStyleModules: Object.keys(STYLE_FAMILIES).length, testsInPackage: false };
await writeFile(join(root, "audit/pilot-build.json"), JSON.stringify(evidence, null, 2) + "\n");
console.log(evidence);
