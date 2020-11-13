import { GRID_COLOR, GridColor } from "./constants";
import { isCanvas, isCanvasContext } from "./types";
import { PixelSpace } from "wasm-pixel-editor";
import { memory } from "wasm-pixel-editor/wasm_pixel_editor_bg.wasm";
import { Editor } from "./Editor";

interface CanvasOptions {
  width: number;
  height: number;
  pixelSize: number;
}

export class Canvas {
  width: number;
  height: number;
  pixelSize: number;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private fpsLimit: number = 60;
  private previousDelta: number = 0;

  private currentRender: number | null = null;

  editor: Editor;

  constructor({ width, height, pixelSize }: CanvasOptions, editor: Editor) {
    this.editor = editor;
    this.width = width;
    this.height = height;
    this.pixelSize = pixelSize;

    const canvas = document.getElementById("canvas");

    if (isCanvas(canvas)) {
      this.canvas = canvas;
    } else {
      throw new Error('Unable to find canvas element with id = "canvas"');
    }

    this.canvas.width = this.width * this.pixelSize;
    this.canvas.height = this.height * this.pixelSize;

    const ctx = this.canvas.getContext("2d");

    if (isCanvasContext(ctx)) {
      this.ctx = ctx;
    } else {
      throw new Error("Unable to get context from canvas");
    }
  }

  get gridPixelSize() {
    return this.pixelSize + 1;
  }

  init() {
    this.render();
    this.renderLoop(1);
  }

  renderLoop(currentDelta: number) {
    this.currentRender = requestAnimationFrame(this.renderLoop.bind(this));

    const delta = currentDelta;

    if (this.fpsLimit && delta < 1000 / this.fpsLimit) {
      return;
    }

    this.render();

    this.previousDelta = currentDelta;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawPixels();
  }

  getPosition(index: number) {
    return [index % this.width, Math.floor(index / this.width)];
  }

  drawPixels() {
    const { pixels } = this.editor;

    for (const [i, pixel] of pixels.entries()) {
      const [r, g, b, a] = pixel;
      const [x, y] = this.getPosition(i);

      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(${r},${g},${b},${a / 100})`;
      this.ctx.fillRect(
        x * this.pixelSize,
        y * this.pixelSize,
        this.pixelSize,
        this.pixelSize
      );
      this.ctx.closePath();
    }
  }

  drawGrid() {
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        this.ctx.beginPath();

        if ((j % 2 === 0 && i % 2 === 0) || (j % 2 !== 0 && i % 2 !== 0)) {
          this.ctx.fillStyle = GridColor.DARK;
        } else {
          this.ctx.fillStyle = GridColor.LIGHT;
        }
        this.ctx.fillRect(
          i * this.pixelSize,
          j * this.pixelSize,
          this.pixelSize,
          this.pixelSize
        );
        this.ctx.closePath();
      }
    }
  }
}
