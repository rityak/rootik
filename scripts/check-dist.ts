// After `bun run build`: dist must export exactly what src does, and styles.css must be self-contained.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const src = Object.keys(await import(join(root, "src/index.ts"))).sort();
const dist = Object.keys(await import(join(root, "dist/index.js"))).sort();
const missing = src.filter((k) => !dist.includes(k));
const extra = dist.filter((k) => !src.includes(k));
const css = readFileSync(join(root, "dist/styles.css"), "utf8");
const problems = [
  ...missing.map((k) => `missing in dist: ${k}`),
  ...extra.map((k) => `extra in dist: ${k}`),
  ...(css.includes("@import") ? ["styles.css still has @import"] : []),
  ...(["@starting-style", "@container scroll-state", "@supports (appearance: base-select)", "@keyframes rk-indeterminate", "tr:hover > :is(.rk-table .rk-table-pin)", ".rk-floating:not(:popover-open)"].flatMap((rule) => css.includes(rule) ? [] : [`missing CSS serialization contract: ${rule}`])),
  ...(existsSync(join(root, "dist/tailwind.css")) ? [] : ["missing tailwind.css"]),
  ...(["tokens.css", "base.css", "button.css", "text.css", "rain.css", "svg-surface.css", "svg-backdrop.css", "svg-artwork.css"].flatMap((file) =>
    existsSync(join(root, "dist/css", file)) ? [] : [`missing CSS export: ${file}`],
  )),
  ...(["en.js", "en.d.ts", "ru.js", "ru.d.ts"].flatMap((file) =>
    existsSync(join(root, "dist/labels", file)) ? [] : [`missing labels export: ${file}`],
  )),
];
const ssr = Bun.spawn(["node", "--input-type=module", "--eval", `
  import { createElement } from 'react';
  import { renderToString } from 'react-dom/server';
  import { Button, Card, Input, RootikProvider, SvgSurface, SvgBackdrop, SvgArtwork } from './dist/index.js';
  import { AppShell, SvgSurface as LayoutSurface } from 'rootik/layout';
  import { RootikProvider as ThemeProvider } from 'rootik/theme';
  import { Tabs, Dock, SegmentedControl, Menu, Menubar } from 'rootik/navigation';
  import * as kit from './dist/index.js';
  import * as controls from 'rootik/controls';
  import * as forms from 'rootik/forms';
  import * as overlays from 'rootik/overlays';
  import * as data from 'rootik/data';
  import * as content from 'rootik/content';
  for (const [name, component] of Object.entries(content)) {
    if (kit[name] !== component) throw new Error('Content compatibility failed: ' + name);
  }
  const article = renderToString(createElement(content.Card, {title:'Packed content',surface:{shape:'saddle'}}, createElement(content.CodeBlock,{code:'const value = 42;',title:'profile.ts'}),createElement(content.Avatar,{name:'North Gateway'}),createElement(content.QrCode,{value:'rootik:content'})));
  if (!['rk-card','rk-overlay-surface','rk-code-block','rk-avatar','rk-qr'].every(part=>article.includes(part))) throw new Error('Content SSR failed');
  import * as charts from 'rootik/charts';
  for (const [name, component] of Object.entries(charts)) {
    if (kit[name] !== component) throw new Error('Charts compatibility failed: ' + name);
  }
  const graph = renderToString(createElement(charts.ChartPanel, {title:'Packed charts',shape:'saddle'},createElement(charts.Gauge,{value:42,label:'Capacity'})));
  if (!['rk-chart-panel','rk-gauge','meter','Capacity'].every(part=>graph.includes(part))) throw new Error('Charts SSR failed');
  import * as feedback from 'rootik/feedback';
  for (const [name, component] of Object.entries(feedback)) {
    if (kit[name] !== component) throw new Error('Feedback compatibility failed: ' + name);
  }
  const status = renderToString(createElement(feedback.Callout, {surface:{shape:'bevel'},title:'Packed status',tone:'warn'}, createElement(feedback.Progress, {value:42,label:'Work',decoration:'ticks'})));
  if (!['rk-callout','rk-overlay-surface','rk-feedback-track','progressbar'].every(part=>status.includes(part))) throw new Error('Feedback SSR failed');
  for (const [name, component] of Object.entries(data)) {
    if (kit[name] !== component) throw new Error('Data compatibility failed: ' + name);
  }
  const table = renderToString(createElement(data.DataTable, { surface:{shape:'bevel'},columns:[{key:'name',header:'Name'}],rows:[{name:'North'}],rowKey:r=>r.name,'aria-label':'Packed rows' }));
  if (!['<table','<th','<td','rk-table-surface','North'].every(part => table.includes(part))) throw new Error('Data SSR semantics failed');
  import { MotionLayer, startThemeTransition } from 'rootik/motion';
  if (kit.MotionLayer !== MotionLayer || kit.startThemeTransition !== startThemeTransition) throw new Error('Motion compatibility failed');
  for (const [name, component] of Object.entries(controls)) {
    if (kit[name] !== component) throw new Error('Controls compatibility failed: ' + name);
  }
  for (const [name, component] of Object.entries(forms)) {
    if (kit[name] !== component) throw new Error('Forms compatibility failed: ' + name);
  }
  for (const [name, component] of Object.entries(overlays)) {
    if (kit[name] !== component) throw new Error('Overlays compatibility failed: ' + name);
  }
  const overlay = renderToString(createElement(overlays.Dialog, { open:false,onClose:()=>{},surface:{shape:'bevel'},title:'Packed modal' }, 'Content'));
  if (!['<dialog','rk-overlay-surface','rk-dialog-body'].every(part => overlay.includes(part))) throw new Error('Overlay SSR semantics failed');
  const form = renderToString(createElement(forms.Form, null,
    createElement(forms.Fieldset, { legend: 'Native group', surface: {shape:'bevel'} },
      createElement(forms.Field, { label: 'Gateway' }, createElement(Input, {name:'gateway',svgBorder:'cut'})))));
  if (!['<fieldset', '<legend', '<label', 'rk-svg-surface'].every(part => form.includes(part))) throw new Error('Forms SSR semantics failed');
  for (const [name, component] of Object.entries({ Tabs, Dock, SegmentedControl, Menu, Menubar })) {
    if (kit[name] !== component) throw new Error('Navigation compatibility failed: ' + name);
  }
  if (!renderToString(createElement(Tabs, { items: [{value: 'one', label: 'One'}] })).includes('role="tablist"')) throw new Error('Navigation SSR failed');
  if (LayoutSurface !== SvgSurface || ThemeProvider !== RootikProvider) throw new Error('Module compatibility identity failed');
  const helpers = renderToString(createElement('div', null,
    createElement(kit.FloatingWindow, {open:false,title:'Inspector',surface:{shape:'bevel'}}, 'Content'),
    createElement(kit.Splitter, {grip:true}, [createElement('span',{key:'one'},'One'),createElement('span',{key:'two'},'Two')]),
    createElement(kit.Stepper, {svgBorder:'cut',current:0,steps:[{id:'one',label:'One'}]}),
    createElement(kit.SelectPanel, {surface:{shape:'ticket'},title:'Picker',options:[{value:'one',label:'One'}],trigger:createElement(Button,null,'Pick')})));
  if (!['rk-floating-window','rk-splitter-grip','rk-stepper','rk-select-panel','rk-overlay-surface'].every(part=>helpers.includes(part))) throw new Error('Helper SVG SSR contract failed');
  const frame = renderToString(createElement(AppShell, { surface: { shape: 'bevel' }, header: 'Header' }, 'Content'));
  if (!frame.includes('rk-shell-part-content') || !frame.includes('<main')) throw new Error('Layout SSR failed');
  const html = renderToString(createElement(RootikProvider, { theme: 'rain' },
    createElement(Card, { title: 'SSR' }, createElement(Button, { svgBorder: 'cut' }, 'Save'), createElement(Input, { name: 'query', svgBorder: 'notch' })),
    createElement(SvgSurface, { shape: 'ticket' }, createElement(SvgArtwork)), createElement(SvgBackdrop, { pattern: 'stripes' })));
  if (!html.includes('rk-button') || !html.includes('rk-input') || !html.includes('rk-card')) throw new Error('SSR styles/markup contract failed');
  if (!['rk-svg-surface', 'rk-svg-backdrop', 'rk-svg-artwork', 'rk-svg-control-frame'].every((name) => html.includes(name))) throw new Error('SVG SSR contract failed');
`], { cwd: root, stdout: "pipe", stderr: "pipe" });
if (await ssr.exited !== 0) problems.push(`Node SSR: ${await new Response(ssr.stderr).text()}`);
const fontCss = readFileSync(join(root, "dist/fonts.css"), "utf8");
for (const match of fontCss.matchAll(/url\(["']?\.\/(fonts\/[^)'"\s]+)/g)) {
  if (!existsSync(join(root, "dist", match[1] ?? ""))) problems.push(`Missing local font: ${match[1]}`);
}
for (const family of ["rubik", "onest", "jetbrains-mono", "literata"]) {
  if (!existsSync(join(root, "dist/fonts", `${family}-LICENSE.txt`))) problems.push(`Missing font license: ${family}`);
}
if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`dist ok: ${dist.length} exports, ${(css.length / 1024).toFixed(0)} KB css`);
