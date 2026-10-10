import "csstype";

declare module "csstype" {
  interface Properties {
    /** CSS Borders 4; the installed csstype version predates this property. */
    cornerShape?: "round" | "squircle" | "inherit" | `var(--${string})`;
  }
}
