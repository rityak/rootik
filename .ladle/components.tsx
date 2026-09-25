import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "../src/styles.css";
import "./ladle.css";
import type { GlobalProvider } from "@ladle/react";
import { RootikProvider, type SettingsSection, Toaster } from "../src";

/** Example of a project extending appearance settings: custom CSS vars + a nested field. */
const extensions: SettingsSection[] = [
  {
    id: "gallery",
    title: "Gallery",
    description: "Project-specific appearance added through `extensions`",
    fields: [
      {
        key: "gallery.thumb",
        type: "slider",
        label: "Thumbnail size",
        default: 160,
        min: 96,
        max: 320,
        step: 8,
        format: (v) => `${v}px`,
        cssVar: "--app-thumb",
        unit: "px",
      },
      {
        key: "gallery.captions",
        type: "toggle",
        label: "Show captions",
        hint: "Caption preview under each image",
        default: true,
        children: [
          {
            key: "gallery.captionLines",
            type: "segmented",
            label: "Lines",
            default: "2",
            options: [
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            cssVar: "--app-caption-lines",
          },
        ],
      },
    ],
  },
];

export const Provider: GlobalProvider = ({ children }) => (
  <RootikProvider storageKey="rootik:ladle" extensions={extensions}>
    {children}
    <Toaster />
  </RootikProvider>
);
