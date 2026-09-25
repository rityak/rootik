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
  heatmap: "Heatmap",
  showTable: "Show as table",
  showChart: "Show as chart",
  copy: "Copy",
  copied: "Copied",
  rename: "Rename",
  increment: "Increment",
  decrement: "Decrement",
  minimum: "Minimum",
  maximum: "Maximum",
  /** OverflowList: the "+3" chip and its accessible name. */
  moreCount: (count: number): string => `+${count}`,
  moreItems: (count: number): string => `${count} more`,
  scrollBack: "Scroll back",
  scrollForward: "Scroll forward",
  jumpToLatest: "Jump to latest",
  selectedCount: (count: number): ReactNode => `${count} selected`,
  clearSelection: "Clear selection",
  selectAll: "Select all",
  selectRow: "Select row",
  ok: "OK",
  cancel: "Cancel",
  apply: "Apply",
  filter: "Filter…",
  noResults: "No results",
  dropFiles: "Drop files here or",
  browseFiles: "browse",
  wrapLines: "Wrap lines",
  moreActions: "More actions",
  showOptions: "Show options",
  removeToken: (label: string): string => `Remove ${label}`,
  previous: "Previous",
  next: "Next",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  fitToScreen: "Fit to screen",
  imageCounter: (index: number, count: number): string => `${index} / ${count}`,
  selectItem: "Select",
  logLevels: "Levels",
};

export type Labels = typeof LABELS;

export const LabelsContext = createContext<Labels>(LABELS);

export const useLabels = () => useContext(LabelsContext);
