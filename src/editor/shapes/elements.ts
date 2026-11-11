import { dia } from "@joint/core";
import { KINDS, type ShapeKind, type Tone } from "./kinds";

export const LABEL_FONT =
  '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Ports are named after the side they sit on: top, right, bottom, left. */
export type PortId = "t" | "r" | "b" | "l";

// Markup is the SVG each shape is drawn with. Selectors name the parts so attrs can style them.
const RECT_MARKUP: dia.MarkupJSON = [
  { tagName: "rect", selector: "body" },
  { tagName: "text", selector: "label" },
];

const PATH_MARKUP: dia.MarkupJSON = [
  { tagName: "path", selector: "body" },
  { tagName: "text", selector: "label" },
];

/** Four connection points, one per side. `dx` nudges the side ports in for slanted shapes. */
function ports(leftDx = 0, rightDx = 0) {
  const attrs = { portBody: { r: 5, magnet: true, class: "fc-port" } };
  const markup = [{ tagName: "circle", selector: "portBody" }];
  const group = (position: string, args = {}) => ({
    position: { name: position, args },
    attrs,
    markup,
  });
  return {
    groups: {
      t: group("top"),
      r: group("right", { dx: rightDx }),
      b: group("bottom"),
      l: group("left", { dx: leftDx }),
    },
    items: [
      { id: "t", group: "t" },
      { id: "r", group: "r" },
      { id: "b", group: "b" },
      { id: "l", group: "l" },
    ],
  };
}

/** Centered text that wraps inside the shape and ends in "…" if it runs out of room. */
function labelAttrs(wrapWidth: string, wrapHeight = "calc(h-10)") {
  return {
    class: "fc-label",
    x: "calc(0.5*w)",
    y: "calc(0.5*h)",
    textAnchor: "middle",
    textVerticalAnchor: "middle",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: LABEL_FONT,
    lineHeight: "1.25em",
    textWrap: { width: wrapWidth, height: wrapHeight, ellipsis: true },
    text: "",
  };
}

/** Everything the four shapes share, filled in from KINDS. */
function shapeDefaults(
  kind: ShapeKind,
  body: object,
  label: object,
  portDx: [number, number],
) {
  const spec = KINDS[kind];
  return {
    type: spec.type,
    kind,
    tone: spec.tone,
    size: { width: spec.width, height: spec.height },
    attrs: {
      // 'passive' lets a flow line end on the body but not start from it; lines start at ports.
      body: {
        class: `fc-body tone-${spec.tone}`,
        strokeWidth: 1.5,
        magnet: "passive",
        ...body,
      },
      label,
    },
    ports: ports(...portDx),
  };
}

/** Base class for every flowchart shape. */
export class FlowShape extends dia.Element {
  get kind(): ShapeKind {
    return this.get("kind");
  }

  get tone(): Tone {
    return this.get("tone") ?? KINDS[this.kind].tone;
  }

  get text(): string {
    return this.attr("label/text") ?? "";
  }

  setText(text: string): void {
    this.attr("label/text", text);
  }

  setTone(tone: Tone): void {
    this.set("tone", tone);
    this.attr("body/class", `fc-body tone-${tone}`);
  }
}

export class Terminal extends FlowShape {
  defaults() {
    return {
      ...super.defaults,
      ...shapeDefaults(
        "terminal",
        // A pill: corner radius of half the height.
        {
          width: "calc(w)",
          height: "calc(h)",
          rx: "calc(0.5*h)",
          ry: "calc(0.5*h)",
        },
        labelAttrs("calc(w-30)"),
        [0, 0],
      ),
    };
  }

  preinitialize(): void {
    this.markup = RECT_MARKUP;
  }
}

export class Process extends FlowShape {
  defaults() {
    return {
      ...super.defaults,
      ...shapeDefaults(
        "process",
        { width: "calc(w)", height: "calc(h)", rx: 6, ry: 6 },
        labelAttrs("calc(w-20)"),
        [0, 0],
      ),
    };
  }

  preinitialize(): void {
    this.markup = RECT_MARKUP;
  }
}

export class Decision extends FlowShape {
  defaults() {
    return {
      ...super.defaults,
      ...shapeDefaults(
        "decision",
        // A diamond through the middle of each side.
        {
          d: "M calc(0.5*w) 0 L calc(w) calc(0.5*h) L calc(0.5*w) calc(h) L 0 calc(0.5*h) Z",
        },
        // Text has less room inside a diamond.
        labelAttrs("calc(0.6*w)", "calc(0.62*h)"),
        [0, 0],
      ),
    };
  }

  preinitialize(): void {
    this.markup = PATH_MARKUP;
  }
}

export class InputOutput extends FlowShape {
  defaults() {
    return {
      ...super.defaults,
      ...shapeDefaults(
        "io",
        // A parallelogram slanted 16 px.
        { d: "M 16 0 H calc(w) L calc(w-16) calc(h) H 0 Z" },
        labelAttrs("calc(w-44)"),
        // Pull the side ports onto the slanted edges.
        [8, -8],
      ),
    };
  }

  preinitialize(): void {
    this.markup = PATH_MARKUP;
  }
}

/** Look up the class for a kind, e.g. `new SHAPE_CLASSES[kind]()`. */
export const SHAPE_CLASSES: Record<ShapeKind, typeof FlowShape> = {
  terminal: Terminal,
  process: Process,
  decision: Decision,
  io: InputOutput,
};

export const isFlowShape = (
  cell: dia.Cell | null | undefined,
): cell is FlowShape => cell instanceof FlowShape;
