import type { SVGAttributes } from "react";
import { cx } from "../lib/cx";

/*
 * Zero-dependency QR Code encoder (ISO/IEC 18004), byte mode only, versions 1–40. Structure follows
 * Project Nayuki's reference implementation: data + Reed–Solomon ECC in interleaved blocks, function
 * patterns, zigzag placement, and the lowest-penalty of the eight masks.
 */

export type QrLevel = "L" | "M" | "Q" | "H";

const LEVEL_INDEX: Record<QrLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };
const FORMAT_BITS: Record<QrLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };

// per level (L, M, Q, H), per version (index 0 unused)
const ECC_PER_BLOCK = [
  [
    -1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28,
    30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
  [
    -1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28,
    28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  ],
  [
    -1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30,
    28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
  [
    -1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30,
    30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
];
const ECC_BLOCKS = [
  [
    -1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16,
    17, 18, 19, 19, 20, 21, 22, 24, 25,
  ],
  [
    -1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28,
    29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49,
  ],
  [
    -1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35,
    38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68,
  ],
  [
    -1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42,
    45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81,
  ],
];

const table = (t: number[][], level: QrLevel, version: number) => t[LEVEL_INDEX[level]]?.[version] ?? 0;

function rawDataModules(version: number) {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2;
    result -= (25 * align - 10) * align - 55;
    if (version >= 7) result -= 36;
  }
  return result;
}

const dataCodewords = (version: number, level: QrLevel) =>
  Math.floor(rawDataModules(version) / 8) -
  table(ECC_PER_BLOCK, level, version) * table(ECC_BLOCKS, level, version);

/** GF(256) multiply modulo x^8 + x^4 + x^3 + x^2 + 1. */
function gfMul(x: number, y: number) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function rsDivisor(degree: number) {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMul(result[j] ?? 0, root);
      if (j + 1 < degree) result[j] = (result[j] ?? 0) ^ (result[j + 1] ?? 0);
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data: number[], divisor: number[]) {
  const result = new Array<number>(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ (result.shift() ?? 0);
    result.push(0);
    divisor.forEach((coef, i) => {
      result[i] = (result[i] ?? 0) ^ gfMul(coef, factor);
    });
  }
  return result;
}

function interleave(data: number[], version: number, level: QrLevel) {
  const blocks = table(ECC_BLOCKS, level, version);
  const eccLen = table(ECC_PER_BLOCK, level, version);
  const raw = Math.floor(rawDataModules(version) / 8);
  const shortBlocks = blocks - (raw % blocks);
  const shortLen = Math.floor(raw / blocks);
  const divisor = rsDivisor(eccLen);
  const all: number[][] = [];
  for (let i = 0, k = 0; i < blocks; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < shortBlocks ? 0 : 1));
    k += dat.length;
    const ecc = rsRemainder(dat, divisor);
    if (i < shortBlocks) dat.push(0);
    all.push(dat.concat(ecc));
  }
  const out: number[] = [];
  for (let i = 0; i < (all[0]?.length ?? 0); i++)
    all.forEach((block, j) => {
      if (i !== shortLen - eccLen || j >= shortBlocks) out.push(block[i] ?? 0);
    });
  return out;
}

function alignmentPositions(version: number, size: number) {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = Math.floor((version * 8 + count * 3 + 5) / (count * 4 - 4)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < count; pos -= step) result.splice(1, 0, pos);
  return result;
}

const bit = (x: number, i: number) => ((x >>> i) & 1) !== 0;

const MASKS: Array<(x: number, y: number) => boolean> = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

function penalty(m: boolean[][]) {
  const size = m.length;
  let score = 0;
  const line = (get: (i: number) => boolean) => {
    // rule 1: runs of five or more; rule 3: finder-like 1:1:3:1:1 with four light modules on a side
    let run = 1;
    for (let i = 1; i <= size; i++) {
      if (i < size && get(i) === get(i - 1)) run++;
      else {
        if (run >= 5) score += run - 2;
        run = 1;
      }
    }
    const pattern = [true, false, true, true, true, false, true];
    for (let i = 0; i + 7 <= size; i++) {
      if (!pattern.every((p, k) => get(i + k) === p)) continue;
      const lightBefore = [1, 2, 3, 4].every((k) => i - k < 0 || !get(i - k));
      const lightAfter = [0, 1, 2, 3].every((k) => i + 7 + k >= size || !get(i + 7 + k));
      if (lightBefore || lightAfter) score += 40;
    }
  };
  for (let y = 0; y < size; y++) line((x) => m[y]?.[x] === true);
  for (let x = 0; x < size; x++) line((y) => m[y]?.[x] === true);
  // rule 2: 2×2 blocks
  for (let y = 0; y < size - 1; y++)
    for (let x = 0; x < size - 1; x++) {
      const c = m[y]?.[x];
      if (c === m[y]?.[x + 1] && c === m[y + 1]?.[x] && c === m[y + 1]?.[x + 1]) score += 3;
    }
  // rule 4: balance of dark modules
  const dark = m.reduce((n, row) => n + row.filter(Boolean).length, 0);
  const total = size * size;
  score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
  return score;
}

/** Encode text (UTF-8, byte mode) as a QR matrix: rows of dark (true) / light modules, no quiet zone. */
export function encodeQr(text: string, level: QrLevel = "M"): boolean[][] {
  const bytes = [...new TextEncoder().encode(text)];
  let version = 1;
  for (; version <= 40; version++) {
    const countBits = version < 10 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= dataCodewords(version, level) * 8) break;
  }
  if (version > 40) throw new RangeError("QR: text too long");

  // bit stream: mode 0100, length, bytes, terminator, padding
  const bits: number[] = [];
  const push = (value: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, version < 10 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  const capacity = dataCodewords(version, level) * 8;
  push(0, Math.min(4, capacity - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8);
  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8)
    codewords.push(bits.slice(i, i + 8).reduce((v, b) => (v << 1) | b, 0));

  const size = version * 4 + 17;
  const modules = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const reserved = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => {
    const row = modules[y];
    const res = reserved[y];
    if (!row || !res) return;
    row[x] = dark;
    res[x] = true;
  };

  // function patterns
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  for (const [cx0, cy0] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ] as const)
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx0 + dx;
        const y = cy0 + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4);
      }
  const align = alignmentPositions(version, size);
  const last = align.length - 1;
  for (const [ai, ax] of align.entries())
    for (const [aj, ay] of align.entries()) {
      // the three corners already hold finder patterns
      if ((ai === 0 && aj === 0) || (ai === 0 && aj === last) || (ai === last && aj === 0)) continue;
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  const drawFormat = (mask: number) => {
    const data = (FORMAT_BITS[level] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const f = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) set(8, i, bit(f, i));
    set(8, 7, bit(f, 6));
    set(8, 8, bit(f, 7));
    set(7, 8, bit(f, 8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(f, i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(f, i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(f, i));
    set(8, size - 8, true);
  };
  drawFormat(0);
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const v = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, bit(v, i));
      set(b, a, bit(v, i));
    }
  }

  // data in the zigzag, right to left in column pairs, skipping the vertical timing column
  const data = interleave(codewords, version, level);
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++)
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        const row = modules[y];
        if (row && !reserved[y]?.[x] && i < data.length * 8) {
          row[x] = bit(data[i >>> 3] ?? 0, 7 - (i & 7));
          i++;
        }
      }
  }

  const applyMask = (mask: number) => {
    const fn = MASKS[mask];
    if (!fn) return;
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const row = modules[y];
        if (row && !reserved[y]?.[x] && fn(x, y)) row[x] = !row[x];
      }
  };
  let best = 0;
  let bestScore = Number.POSITIVE_INFINITY;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(mask);
    drawFormat(mask);
    const score = penalty(modules);
    if (score < bestScore) {
      best = mask;
      bestScore = score;
    }
    applyMask(mask);
  }
  applyMask(best);
  drawFormat(best);
  return modules;
}

/** SVG path of the dark modules, horizontal runs merged, offset by the quiet zone. */
export function qrPath(matrix: boolean[][], quiet = 0): string {
  let d = "";
  matrix.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!row[x]) continue;
      let end = x;
      while (row[end + 1]) end++;
      d += `M${x + quiet} ${y + quiet}h${end - x + 1}v1h${-(end - x + 1)}z`;
      x = end;
    }
  });
  return d;
}

export interface QrCodeProps extends Omit<SVGAttributes<SVGSVGElement>, "values"> {
  /** Text or URL to encode. */
  value: string;
  /** Error correction: L 7%, M 15%, Q 25%, H 30% of the code can be damaged. */
  level?: QrLevel;
  /** Rendered size in px. */
  size?: number;
  /** Light border in modules (scanners want 4). */
  quiet?: number;
  /** Accessible name (default: the encoded value). */
  label?: string;
}

/**
 * QR code as crisp SVG. Always dark modules on a light plate, since scanners expect that, so it reads
 * on the dark canvas too (the plate uses the inverse tokens).
 */
export function QrCode({
  value,
  level = "M",
  size = 160,
  quiet = 4,
  label,
  className,
  ...rest
}: QrCodeProps) {
  const matrix = encodeQr(value, level);
  const box = matrix.length + quiet * 2;
  return (
    <svg
      role="img"
      aria-label={label ?? value}
      {...rest}
      className={cx("rk-qr", className)}
      width={size}
      height={size}
      viewBox={`0 0 ${box} ${box}`}
      shapeRendering="crispEdges"
    >
      <rect className="rk-qr-plate" width={box} height={box} rx={Math.min(quiet, 2)} />
      <path className="rk-qr-modules" d={qrPath(matrix, quiet)} />
    </svg>
  );
}
