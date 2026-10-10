import { expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { RootikProvider, Scope, scopeVars, useAppearanceValue } from "./provider";
import {
  APPEARANCE_SECTIONS,
  defaultValues,
  materialVars,
  normalizeAppearanceValues,
  type SettingsSection,
  toCssVars,
} from "./schema";

const NONFINITE_CSS = /NaN|Infinity/;

test("gradient controls work on solid, clamp unsafe numeric input and preserve the legacy default", () => {
  const base = defaultValues(APPEARANCE_SECTIONS);
  expect(toCssVars(APPEARANCE_SECTIONS, base)["--rk-ambient"]).toContain("var(--rk-accent) 14%");
  const linear = materialVars("solid", {
    gradient: "linear",
    angle: 220,
    glowStrength: 50,
    glow: "custom",
    glowColor: "red",
    secondaryColor: "blue",
  });
  expect(linear["--rk-ambient"]).toContain("linear-gradient(220deg");
  expect(linear["--rk-ambient"]).toContain("red 8%");
  expect(linear["--rk-ambient"]).toContain("blue 6%");
  expect(materialVars("solid")["--rk-ambient"]).toBeNull();
  const clouds = materialVars("frost", {
    gradient: "clouds",
    x: 70,
    y: 20,
    spread: 150,
    softness: 90,
    reflection: 0,
  });
  expect(clouds["--rk-ambient"]).toContain("90% 75% at 70% 20%");
  expect(clouds["--rk-ambient"]).toContain("at 30% 80%");
  expect(clouds["--rk-surface-sheen"]).toBe("none");
  const reflection = materialVars("frost", {
    gradient: "linear",
    angle: 45,
    reflection: 50,
    reflectionAngle: 220,
  });
  expect(reflection["--rk-surface-sheen"]).toContain("linear-gradient(220deg");
  expect(
    materialVars("frost", { gradient: "linear", angle: 300, reflection: 50, reflectionAngle: 220 })[
      "--rk-surface-sheen"
    ],
  ).toBe(reflection["--rk-surface-sheen"]);
  expect(toCssVars(APPEARANCE_SECTIONS, { material: "veil" })["--rk-surface-sheen"]).toBeNull();
  expect(materialVars("veil", { gradient: "clouds", glow: "off" })["--rk-ambient"]).toBeNull();
  expect(
    JSON.stringify(
      materialVars("liquid", { x: Number.NaN, blur: Number.POSITIVE_INFINITY, glowStrength: -100 }),
    ),
  ).not.toMatch(NONFINITE_CSS);
});

test("appearance validates storage, controlled values and registered consumer extensions", () => {
  const extra: SettingsSection = {
    id: "app",
    title: "App",
    fields: [{ key: "app.zoom", type: "slider", label: "Zoom", default: 1, min: 0.5, max: 2 }],
  };
  const sections = [...APPEARANCE_SECTIONS, extra];
  expect(normalizeAppearanceValues(sections, null)).toEqual({});
  expect(normalizeAppearanceValues(sections, [1, 2])).toEqual({});
  expect(
    normalizeAppearanceValues(sections, {
      radius: "bad",
      density: "tiny",
      motion: true,
      accent: "bad",
      glass: "yes",
      fontSize: Number.NaN,
      "glow.angle": 800,
      "glow.x": -10,
      "glow.secondary": "red; background:url(x)",
      "app.zoom": 9,
      typo: true,
    }),
  ).toEqual({ "glow.angle": 360, "glow.x": 0, "app.zoom": 2 });
});

test("scopes reset inherited material, density, backdrop and system motion", () => {
  const base = {
    ...defaultValues(APPEARANCE_SECTIONS),
    material: "liquid",
    density: "compact",
    motion: "off",
    backdrop: "rain.png",
  } as const;
  const vars = scopeVars(APPEARANCE_SECTIONS, base, {
    material: "solid",
    density: "default",
    motion: "system",
    backdrop: "",
  });
  expect(vars["--rk-surface-filter"]).toBe("initial");
  expect(vars["--rk-ambient"]).toBe("initial");
  expect(vars["--rk-density"]).toBe("1");
  expect(vars["--rk-backdrop"]).toBe("initial");
  expect(vars["--rk-motion"]).toBe("var(--rk-system-motion)");
});

function Probe() {
  return (
    <span>
      {useAppearanceValue("density")}/{useAppearanceValue("material")}
    </span>
  );
}

test("nested scopes expose their effective values to hooks and inherit the immediate parent", () => {
  const html = renderToString(
    <RootikProvider defaults={{ density: "comfortable", material: "liquid" }}>
      <Scope values={{ density: "compact" }}>
        <Probe />
        <Scope values={{ material: "solid" }}>
          <Probe />
        </Scope>
      </Scope>
    </RootikProvider>,
  );
  expect(html).toContain("compact<!-- -->/<!-- -->liquid");
  expect(html).toContain("compact<!-- -->/<!-- -->solid");
});
