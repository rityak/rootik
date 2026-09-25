import { createContext, type ReactNode, useContext } from "react";

/**
 * Strings the kit renders on its own: accessible names, placeholders, default copy.
 * Translate them once with `<RootikProvider labels={…}>`; per-component props still override.
 */
export const LABELS = {
  close: "Close",
  minimize: "Minimize",
  maximize: "Maximize",
  dismiss: "Dismiss",
  remove: "Remove",
  clear: "Clear",
  loading: "Loading",
  search: "Search…",
  select: "Select…",
  notifications: "Notifications",
  navigation: "Navigation",
  breadcrumb: "Breadcrumb",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  resize: "Resize",
  customColor: "Custom color",
  unsaved: "Unsaved changes",
  /** Screen-reader text for a dot badge without its own label. */
  newItems: "new",
  skipToContent: "Skip to content",
  resetDefaults: "Reset to defaults",
  noData: "No data",
  commandPalette: "Command palette",
  commandPlaceholder: "Type a command or search…",
  noCommands: (query: string): ReactNode => (query ? `No commands match “${query}”` : "No commands"),
  /** Armed ConfirmButton: repeats the action ("Delete?"). */
  confirm: (action: ReactNode): ReactNode => <>{action}?</>,
  barChart: "Bar chart",
  lineChart: "Line chart",
};

export type Labels = typeof LABELS;

export const LabelsContext = createContext<Labels>(LABELS);

export const useLabels = () => useContext(LabelsContext);
