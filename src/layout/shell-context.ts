import { createContext, useContext } from "react";

export const ShellContext = createContext({
  compact: false,
  drawer: false,
  dockBar: false,
  openDrawer: () => {
    // outside an AppShell there is no drawer
  },
});

/** True inside a compacted AppShell (narrow window, high zoom). Sidebar reads it to become a rail. */
export const useShellCompact = () => useContext(ShellContext).compact;

/** True for a Dock rendered as the AppShell taskbar (`dockPlacement="bar"`). */
export const useShellDockBar = () => useContext(ShellContext).dockBar;
