import { SYSTEM_MONO, SYSTEM_SANS, SYSTEM_SERIF } from "../theme/fonts";

export { SYSTEM_MONO, SYSTEM_SANS, SYSTEM_SERIF } from "../theme/fonts";

export const typefaces = [
  {
    id: "system",
    name: "System",
    family: SYSTEM_SANS,
    role: "Системный набор",
    note: "Без загрузки файлов. Родной шрифт платформы; метрики различаются между ОС.",
    italic: true,
    min: 300,
    max: 700,
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-family",
  },
  {
    id: "inter",
    name: "Inter",
    family: `"Inter Variable", ${SYSTEM_SANS}`,
    role: "Альтернатива для плотного UI",
    note: "Плотные контролы, таблицы и длинные подписи. Настоящий курсив и оптический размер.",
    italic: true,
    min: 100,
    max: 900,
    source: "https://rsms.me/inter/",
  },
  {
    id: "rubik",
    name: "Rubik",
    family: `"Rubik Variable", ${SYSTEM_SANS}`,
    role: "Новое направление · скруглённый гротеск",
    note: "Угловатые формы со скруглениями, плотные заголовки и открытая кириллица. Настоящий курсив.",
    italic: true,
    min: 300,
    max: 900,
    source: "https://github.com/google/fonts/tree/main/ofl/rubik",
  },
  {
    id: "onest",
    name: "Onest",
    family: `"Onest Variable", ${SYSTEM_SANS}`,
    role: "Мягкая геометрия",
    note: "Более округлый рисунок для спокойных панелей. Курсив в семье отсутствует.",
    italic: false,
    min: 100,
    max: 900,
    source: "https://fontsource.org/fonts/onest/about",
  },
  {
    id: "golos",
    name: "Golos Text",
    family: `"Golos Text Variable", ${SYSTEM_SANS}`,
    role: "Кириллица и чтение",
    note: "Выразительная кириллица и уверенный текстовый набор. Вес от 400; без курсива.",
    italic: false,
    min: 400,
    max: 900,
    source: "https://github.com/googlefonts/golos-text",
  },
  {
    id: "geist",
    name: "Geist",
    family: `"Geist Variable", ${SYSTEM_SANS}`,
    role: "Текущий вариант Rootik",
    note: "Сохраняем для прямого сравнения. Теперь в образце подключён и настоящий курсив.",
    italic: true,
    min: 100,
    max: 900,
    source: "https://vercel.com/font",
  },
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    family: `"JetBrains Mono Variable", ${SYSTEM_MONO}`,
    role: "Логи, адреса и идентификаторы",
    note: "Моноширинный набор с курсивом. Для технических данных; для длинного UI заметно шире.",
    italic: true,
    min: 100,
    max: 800,
    source: "https://github.com/JetBrains/JetBrainsMono",
  },
  {
    id: "literata",
    name: "Literata",
    family: `"Literata Variable", ${SYSTEM_SERIF}`,
    role: "Крупный акцент и курсив",
    note: "Антиква для заголовков и заметок. Не предлагается основным шрифтом плотных контролов.",
    italic: true,
    min: 200,
    max: 900,
    source: "https://github.com/googlefonts/literata",
  },
] as const;

export type TypefaceId = (typeof typefaces)[number]["id"];
export type UiTypefaceId = Exclude<TypefaceId, "literata">;
export type MonoTypefaceId = "system" | "jetbrains" | "geist";
export type DisplayTypefaceId = "ui" | "literata" | "system";

export const monoFamilies = {
  system: SYSTEM_MONO,
  jetbrains: `"JetBrains Mono Variable", ${SYSTEM_MONO}`,
  geist: `"Geist Mono Variable", ${SYSTEM_MONO}`,
};

export const cyrillicProbe =
  "Съешь ещё этих мягких французских булок, да выпей чаю. Ёё Йй Дд Лл Жж Щщ Ыы Ъъ № ₽";
export const typeScale = [
  { id: "display", label: "Акцент", text: "Форма. Ритм. Характер.", usage: "48 / 52 · 450" },
  { id: "title", label: "Заголовок", text: "Параметры подключения", usage: "28 / 34 · 550" },
  { id: "section", label: "Раздел", text: "Маршрутизация и доступ", usage: "20 / 28 · 600" },
  {
    id: "body",
    label: "Основной текст",
    text: "Изменения сохраняются для всех устройств в рабочем пространстве.",
    usage: "14 / 22 · 400",
  },
  { id: "label", label: "Контрол", text: "Имя подключения", usage: "13 / 18 · 550" },
  {
    id: "caption",
    label: "Подпись",
    text: "Последняя синхронизация · 2 минуты назад",
    usage: "12 / 18 · 400",
  },
] as const;
