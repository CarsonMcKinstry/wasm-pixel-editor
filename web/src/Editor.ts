import { PixelSpace } from "wasm-pixel-editor";
import { memory } from "wasm-pixel-editor/wasm_pixel_editor_bg.wasm";
import { Canvas } from "./Canvas";
import { Tool } from "./toolbox";
import { chunk } from "lodash";

interface EditorConfig {
  pixelWidth: number;
  pixelHeight: number;
  pixelSize: number;
  tools: Tool[];
}

const defaultOptions: EditorConfig = {
  pixelWidth: 64,
  pixelHeight: 48,
  pixelSize: 10,
  tools: [],
};

export class Editor {
  canvas: Canvas;
  // toolbox

  pixelWidth: number;
  pixelHeight: number;
  pixelSize: number;
  pixelSpace: PixelSpace;
  memory: WebAssembly.Memory;

  constructor(options: EditorConfig = defaultOptions) {
    const { pixelWidth, pixelHeight, pixelSize } = options;

    this.pixelSpace = PixelSpace.new(pixelWidth, pixelHeight);
    this.memory = memory;

    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
    this.pixelSize = pixelSize;

    this.canvas = new Canvas(
      {
        width: pixelWidth,
        height: pixelHeight,
        pixelSize,
      },
      this
    );
  }

  init() {
    this.canvas.init();
  }

  get pixels() {
    const ptr = this.pixelSpace.pixels();
    const pixels = chunk(
      new Uint8Array(
        this.memory.buffer,
        ptr,
        this.pixelHeight * this.pixelWidth * 4
      ),
      4
    );

    return pixels;
  }
}
