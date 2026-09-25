// Ladle ships its types as .tsx sources that don't compile under TS 7 (skipLibCheck ignores only .d.ts).
// tsconfig maps "@ladle/react" here; only what the stories use.
import type { FC, ReactNode } from "react";

export type Story<P = object> = FC<P> & { storyName?: string; args?: Partial<P> };
export type GlobalProvider = FC<{ children: ReactNode; globalState: unknown; storyMeta?: unknown }>;
export type UserConfig = Record<string, unknown>;
