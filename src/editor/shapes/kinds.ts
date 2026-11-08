export type ShapeKind = "terminal" | "process" | "decision" | "io";

export type Tone = "green" | "blue" | "gold" | "violet" | "rose" | "slate";

export interface KindSpec {
  type: string;
  name: string;
  description: string;
  tone: Tone;
  width: number;
  height: number;
  text: string;
  minWidth: number;
  minHeight: number;
}

export const KINDS: Record<ShapeKind, KindSpec> = {
  terminal: {
    type: "fc.Terminal",
    name: "Terminal",
    description: "Start or end of the flow",
    tone: "green",
    width: 150,
    height: 50,
    text: "Start",
    minWidth: 80,
    minHeight: 30,
  },
  process: {
    type: "fc.Process",
    name: "Process",
    description: "An operation or step",
    tone: "blue",
    width: 170,
    height: 64,
    text: "Do something",
    minWidth: 80,
    minHeight: 40,
  },
  decision: {
    type: "fc.Decision",
    name: "Decision",
    description: "A yes / no question",
    tone: "gold",
    width: 160,
    height: 100,
    text: "Condition?",
    minWidth: 100,
    minHeight: 60,
  },
  io: {
    type: "fc.IO",
    name: "Input / Output",
    description: "Data read in or written out",
    tone: "violet",
    width: 170,
    height: 64,
    text: "Read input",
    minWidth: 100,
    minHeight: 40,
  },
};

export const KIND_ORDER: readonly ShapeKind[] = [
  "terminal",
  "process",
  "decision",
  "io",
];

export const TONES: readonly Tone[] = [
  "green",
  "blue",
  "gold",
  "violet",
  "rose",
  "slate",
];

export const GRID_SIZE = 10;

export const snapToGrid = (value: number): number =>
  Math.round(value / GRID_SIZE) * GRID_SIZE;
