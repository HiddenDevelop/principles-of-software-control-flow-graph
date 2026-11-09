import { describe, expect, it } from "vitest";
import { KINDS, KIND_ORDER, snapToGrid } from "./kinds";

describe("snapToGrid", () => {
  it("rounds to the nearest grid line", () => {
    expect(snapToGrid(14)).toBe(10);
    expect(snapToGrid(15)).toBe(20);
    expect(snapToGrid(-6)).toBe(-10);
  });
});

describe("KINDS", () => {
  it("lists every kind exactly once in the stencil order", () => {
    expect([...KIND_ORDER].sort()).toEqual(Object.keys(KINDS).sort());
  });

  it("gives every kind a default size at least as big as its minimum", () => {
    for (const spec of Object.values(KINDS)) {
      expect(spec.width).toBeGreaterThanOrEqual(spec.minWidth);
      expect(spec.height).toBeGreaterThanOrEqual(spec.minHeight);
    }
  });
});
