import { PixelSpace } from "wasm-pixel-editor";
import { memory } from "wasm-pixel-editor/wasm_pixel_editor_bg.wasm";
import { Canvas } from "./canvas/Canvas";
import { Tool } from "./toolbox";

interface EditorConfig {
  pixelWidth?: number;
  pixelHeight?: number;
  pixelSize?: number;
  tools?: Tool[];
  attachment?: HTMLElement;
}

export class Editor {
  canvas: Canvas;
  // toolbox
  root: HTMLElement = document.body;

  pixelWidth: number = 64;
  pixelHeight: number = 48;
  pixelSize: number = 10;
  pixelSpace: PixelSpace;
  memory: WebAssembly.Memory;

  constructor(options: EditorConfig) {
    const { pixelWidth, pixelHeight, pixelSize, attachment } = options;

    this.pixelSpace = PixelSpace.new(pixelWidth, pixelHeight);
    this.memory = memory;

    this.pixelWidth = pixelWidth || this.pixelWidth;
    this.pixelHeight = pixelHeight || this.pixelHeight;
    this.pixelSize = pixelSize || this.pixelSize;

    this.root = attachment || this.root;

    this.canvas = new Canvas(
      {
        width: this.pixelWidth,
        height: this.pixelHeight,
        pixelSize: this.pixelSize,
      },
      this
    );
  }

  init() {
    this.canvas.mount();
    this.canvas.init();
  }

  get imageData() {
    const ptr = this.pixelSpace.pixels();
    const pixels = new Uint8ClampedArray(
      this.memory.buffer,
      ptr,
      this.pixelHeight * this.pixelWidth * 4
    );

    return new ImageData(pixels, this.pixelWidth, this.pixelHeight);
  }
}
