import { dia } from "@joint/core";
import { describe, expect, it } from "vitest";
import {
  Decision,
  InputOutput,
  Process,
  SHAPE_CLASSES,
  Terminal,
  isFlowShape,
} from "./elements";
import { KINDS, KIND_ORDER } from "./kinds";

describe.each(KIND_ORDER)("a new %s", (kind) => {
  const shape = new SHAPE_CLASSES[kind]();

  it("uses the defaults from KINDS", () => {
    const spec = KINDS[kind];
    expect(shape.kind).toBe(kind);
    expect(shape.get("type")).toBe(spec.type);
    expect(shape.tone).toBe(spec.tone);
    expect(shape.size()).toEqual({ width: spec.width, height: spec.height });
  });

  it("has a port on each side", () => {
    expect(shape.getPorts().map((port) => port.id)).toEqual([
      "t",
      "r",
      "b",
      "l",
    ]);
  });
});

describe("FlowShape", () => {
  it("changes its label and color", () => {
    const shape = new Process();
    shape.setText("i++");
    shape.setTone("rose");
    expect(shape.text).toBe("i++");
    expect(shape.tone).toBe("rose");
    expect(shape.attr("body/class")).toBe("fc-body tone-rose");
  });

  it("comes back as the same class after a save and load", () => {
    const namespace = { fc: { Terminal, Process, Decision, IO: InputOutput } };
    const graph = new dia.Graph({}, { cellNamespace: namespace });
    const shape = new Decision();
    shape.setText("x < 2");
    shape.setTone("slate");
    graph.addCell(shape);

    const saved = JSON.parse(JSON.stringify(graph.toJSON()));
    const loaded = new dia.Graph({}, { cellNamespace: namespace });
    loaded.fromJSON(saved);

    const [copy] = loaded.getElements();
    expect(copy).toBeInstanceOf(Decision);
    expect(isFlowShape(copy) && copy.text).toBe("x < 2");
    expect(isFlowShape(copy) && copy.tone).toBe("slate");
  });
});
