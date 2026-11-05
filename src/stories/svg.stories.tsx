import type { Story } from "@ladle/react";
import {
  Button,
  Field,
  IconButton,
  Input,
  RootikProvider,
  SVG_ARTWORKS,
  SVG_CONTROL_BORDERS,
  SVG_SHAPES,
  SvgArtwork,
  SvgBackdrop,
  SvgSurface,
} from "..";

export default { title: "SVG" };

export const Controls: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 24 }}>
    {SVG_CONTROL_BORDERS.map((border) => (
      <div key={border} style={{ display: "grid", gap: 16 }}>
        <h2>{border}</h2>
        <Button svgBorder={border} variant="primary">
          Save changes
        </Button>
        <Input svgBorder={border} aria-label={`${border} name`} placeholder="Gateway name" />
        <div style={{ display: "flex", gap: 8 }}>
          <IconButton svgBorder={border} variant="outline" label={`Add ${border}`} icon={<span>+</span>} />
          <Button svgBorder={border} size="sm">
            Small
          </Button>
          <Button svgBorder={border} size="lg">
            Large
          </Button>
        </div>
        <Field label="Required name" error="Enter a name">
          <Input svgBorder={border} />
        </Field>
        <Button svgBorder={border} loading>
          Saving
        </Button>
        <Button svgBorder={border} disabled>
          Disabled
        </Button>
      </div>
    ))}
  </div>
);

export const Surfaces: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 24 }}>
    {SVG_SHAPES.map((shape) => (
      <SvgSurface
        key={shape}
        shape={shape}
        edge={shape === "ticket" ? "left" : "top"}
        padding={40}
        depth={1}
        showSafeArea
      >
        <h2>{shape}</h2>
        <Field label="Panel name">
          <Input defaultValue="Protected content" />
        </Field>
        <Button>Open panel</Button>
      </SvgSurface>
    ))}
  </div>
);

export const Backgrounds: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
    {(["dots", "stripes", "grid", "cross", "hex", "none"] as const).map((pattern) => (
      <div
        key={pattern}
        style={{
          position: "relative",
          isolation: "isolate",
          height: 180,
          borderRadius: 18,
          overflow: "hidden",
          background: "var(--rk-surface-1)",
        }}
      >
        <SvgBackdrop pattern={pattern} opacity={0.4} />
        <span style={{ position: "relative", padding: 24, display: "block" }}>{pattern}</span>
      </div>
    ))}
  </div>
);

export const Artwork: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16, maxWidth: 800 }}>
    {SVG_ARTWORKS.map((variant) => (
      <div key={variant}>
        <SvgArtwork variant={variant} motion={variant === "orbits" ? "orbit" : "drift"} />
        {variant}
      </div>
    ))}
  </div>
);

export const MotionOff: Story = () => (
  <RootikProvider defaults={{ motion: "off" }}>
    <div style={{ width: 240 }}>
      <SvgArtwork motion="orbit" />
    </div>
  </RootikProvider>
);

export const CustomBackground: Story = () => (
  <div
    style={{
      position: "relative",
      isolation: "isolate",
      height: 300,
      overflow: "hidden",
      borderRadius: 18,
      background: "var(--rk-surface-1)",
    }}
  >
    <SvgBackdrop pattern="cross">
      {({ id }) => (
        <>
          <defs>
            <linearGradient id={`${id}-ink`}>
              <stop stopColor="var(--rk-accent)" stopOpacity=".25" />
              <stop offset="1" stopColor="var(--rk-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="70%" cy="50%" r="120" fill={`url(#${id}-ink)`} />
        </>
      )}
    </SvgBackdrop>
    <SvgSurface shape="saddle" style={{ maxWidth: 360 }}>
      <h2>Custom SVG</h2>
      <Button>Still clickable</Button>
    </SvgSurface>
  </div>
);
