/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.tsx",
  defaultStory: "overview--dashboard",
  addons: {
    theme: { enabled: false, defaultState: "dark" },
    mode: { enabled: false },
    rtl: { enabled: false },
    a11y: { enabled: true },
    width: { enabled: true, options: { mobile: 375, tablet: 768, desktop: 1280 } },
  },
};
