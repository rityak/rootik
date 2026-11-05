import { expect, test } from "bun:test";
import {
  SVG_CONTROL_BORDERS,
  SVG_SHAPES,
  type SvgEdge,
  svgControlGeometry,
  svgGeometry,
} from "./svg-geometry";

test("zero radius removes corner curves without changing protected padding", () => {
  const round = svgGeometry(300, 180, { shape: "bevel", padding: 24 });
  const square = svgGeometry(300, 180, { shape: "bevel", padding: 24, radius: 0 });
  expect(square.content).toEqual(round.content);
  expect(square.path).not.toContain(" Q ");
  expect(square.path).not.toBe(round.path);
  expect(svgControlGeometry(120, 34, "soft", 0).path).not.toContain(" Q ");
});

test("compact control contours retain a protected content rectangle for icon and text controls", () => {
  const compactNotch = svgControlGeometry(120, 18, "notch");
  const feature = compactNotch.coordinates.filter(([x, y]) => x > 40 && x < 80 && y < 9);
  expect(feature.length).toBeGreaterThan(0);
  expect(Math.max(...feature.map(([, y]) => y))).toBeLessThan(compactNotch.content.y - 2);
  for (const border of SVG_CONTROL_BORDERS) {
    for (const height of [28, 34, 42]) {
      for (const width of [height, 120, 340]) {
        const result = svgControlGeometry(width, height, border);
        const { x, y, width: contentWidth, height: contentHeight } = result.content;
        expect(
          result.coordinates.every(
            ([px, py]) =>
              Number.isFinite(px) && Number.isFinite(py) && px >= 0 && py >= 0 && px <= width && py <= height,
          ),
        ).toBe(true);
        expect(
          result.coordinates.every(
            ([px, py]) => px <= x || px >= x + contentWidth || py <= y || py >= y + contentHeight,
          ),
        ).toBe(true);
        expect(result.path).not.toContain("NaN");
      }
    }
  }
  const paths = SVG_CONTROL_BORDERS.map((border) => svgControlGeometry(120, 34, border).path);
  expect(new Set(paths).size).toBe(4);
});

test("control contours reserve the full focus stroke inside the host at every size", () => {
  for (const border of SVG_CONTROL_BORDERS) {
    for (const height of [18, 28, 34, 42]) {
      for (const width of [height, 120, 340]) {
        for (const radius of [0, 16]) {
          const result = svgControlGeometry(width, height, border, radius);
          expect(
            result.coordinates.every(
              ([x, y]) => x >= 1.5 && y >= 1.5 && x <= width - 1.5 && y <= height - 1.5,
            ),
          ).toBe(true);
        }
      }
    }
  }
});

test("all contour control points remain outside the shared content rectangle at padding/size extremes", () => {
  for (const shape of SVG_SHAPES)
    for (const edge of ["top", "right", "bottom", "left"] as SvgEdge[]) {
      for (const [width, height] of [
        [16, 12],
        [180, 140],
        [375, 380],
        [1200, 220],
      ]) {
        for (const padding of [8, 24, 72, { top: 18, right: 72, bottom: 36, left: 48 }]) {
          for (const value of [0, 1]) {
            const result = svgGeometry(width ?? 1, height ?? 1, {
              shape,
              edge,
              padding,
              depth: 1,
              position: value,
              span: 0.75,
            });
            expect(result.path.endsWith(" Z")).toBe(true);
            expect(
              result.coordinates.every(
                ([x, y]) =>
                  Number.isFinite(x) &&
                  Number.isFinite(y) &&
                  x >= 0 &&
                  y >= 0 &&
                  x <= result.width &&
                  y <= result.height,
              ),
            ).toBe(true);
            const { content } = result;
            expect(
              result.coordinates.every(
                ([x, y]) =>
                  x <= content.x ||
                  x >= content.x + content.width ||
                  y <= content.y ||
                  y >= content.y + content.height,
              ),
            ).toBe(true);
          }
        }
      }
    }
});

test("geometry normalizes numeric boundaries and moves a feature on every side", () => {
  expect(svgGeometry(Number.NaN, Number.POSITIVE_INFINITY)).toEqual(svgGeometry(600, 360));
  expect(svgGeometry(320, 300, { depth: 99, position: -1, padding: 2 })).toEqual(
    svgGeometry(320, 300, { depth: 1, position: 0, padding: 8 }),
  );
  for (const edge of ["top", "right", "bottom", "left"] as const) {
    expect(svgGeometry(400, 300, { shape: "saddle", edge, position: 0 }).path).not.toBe(
      svgGeometry(400, 300, { shape: "saddle", edge, position: 1 }).path,
    );
  }
});

test("paired ticket notches align across opposite sides at an off-centre position", () => {
  const geometry = svgGeometry(400, 300, {
    shape: "ticket",
    edge: "left",
    padding: 44,
    depth: 1,
    position: 0,
  });
  const left = geometry.coordinates
    .filter(([x]) => x === 36)
    .map(([, y]) => Math.round(y * 1000) / 1000)
    .filter((y) => y >= 44 && y <= 256)
    .sort((a, b) => a - b);
  const right = geometry.coordinates
    .filter(([x]) => x === 364)
    .map(([, y]) => Math.round(y * 1000) / 1000)
    .filter((y) => y >= 44 && y <= 256)
    .sort((a, b) => a - b);
  expect(left).toEqual(right);
});
