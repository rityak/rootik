import { useEffect, useState } from "react";
import { Field } from "../components/field";
import { NativeSelect } from "../controls/native-select";
import { cancelThemeTransition, startThemeTransition } from "../motion/theme-transition";
import type { BuiltinAppearanceValues } from "../theme/schema";

/** Shared laboratory controls; production defaults remain off. */
export function useMotionStudy(motion: boolean, svgShapes: boolean, style: "rootik" | "fluent") {
  const [effects, setEffects] = useState<BuiltinAppearanceValues["effects"]>("subtle");
  const [effectStyle, setEffectStyle] = useState<BuiltinAppearanceValues["effectStyle"]>("sheen");
  const [themeTransition, setThemeTransition] = useState<BuiltinAppearanceValues["themeTransition"]>("fade");
  useEffect(() => {
    if (!motion || effects === "off") cancelThemeTransition();
  }, [motion, effects]);
  return {
    values: { effects, effectStyle, themeTransition },
    transition: (update: () => void) =>
      startThemeTransition(update, {
        effects,
        themeTransition,
        motion: motion ? "system" : "off",
        svgShapes,
        style,
      }),
    settings: (
      <>
        <Field label="Декоративная анимация">
          <NativeSelect
            value={effects}
            onChange={(event) => setEffects(event.target.value as typeof effects)}
            options={[
              { value: "off", label: "Выключено" },
              { value: "subtle", label: "Мягко" },
              { value: "expressive", label: "Выразительно" },
            ]}
          />
        </Field>
        <Field label="Вариант перелива">
          <NativeSelect
            value={effectStyle}
            onChange={(event) => setEffectStyle(event.target.value as typeof effectStyle)}
            options={[
              { value: "sheen", label: "Блик" },
              { value: "ripple", label: "Волна" },
              { value: "flow", label: "Течение" },
            ]}
          />
        </Field>
        <Field label="Переход темы">
          <NativeSelect
            value={themeTransition}
            onChange={(event) => setThemeTransition(event.target.value as typeof themeTransition)}
            options={[
              { value: "fade", label: "Растворение" },
              { value: "wipe", label: "Шторка" },
              { value: "iris", label: "Диафрагма" },
            ]}
          />
        </Field>
      </>
    ),
  };
}
