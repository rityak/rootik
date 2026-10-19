export const SYSTEM_SANS =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif';
export const SYSTEM_MONO =
  '"Cascadia Code", "Cascadia Mono", ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace';
export const SYSTEM_SERIF = 'Georgia, "Times New Roman", serif';

export const FONTS: Record<string, string | null> = {
  geist: null,
  inter: `"Inter Variable", "Inter", ${SYSTEM_SANS}`,
  rubik: `"Rubik Variable", ${SYSTEM_SANS}`,
  onest: `"Onest Variable", ${SYSTEM_SANS}`,
  system: SYSTEM_SANS,
  mono: `"Geist Mono Variable", "JetBrains Mono", ${SYSTEM_MONO}`,
};

export const MONO_FONTS: Record<string, string> = {
  system: SYSTEM_MONO,
  jetbrains: `"JetBrains Mono Variable", ${SYSTEM_MONO}`,
  geist: `"Geist Mono Variable", ${SYSTEM_MONO}`,
};
