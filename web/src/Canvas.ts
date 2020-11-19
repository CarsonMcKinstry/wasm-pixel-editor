import { GRID_COLOR, GridColor } from "./constants";
import { isCanvas, isCanvasContext } from "./types";
import { PixelSpace } from "wasm-pixel-editor";
import { memory } from "wasm-pixel-editor/wasm_pixel_editor_bg.wasm";
import { Editor } from "./Editor";
import { clamp } from "lodash";

interface CanvasOptions {
  width: number;
  height: number;
  pixelSize: number;
}

export class Canvas {
  width: number;
  height: number;
  _pixelSize: number;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private fpsLimit: number = 60;
  private previousDelta: number = 0;

  private currentRender: number | null = null;

  editor: Editor;

  scale: number = 1;
  origin: { x: number; y: number } = { x: 0, y: 0 };

  constructor({ width, height, pixelSize }: CanvasOptions, editor: Editor) {
    this.editor = editor;
    this.width = width;
    this.height = height;
    this._pixelSize = pixelSize;

    const canvas = document.createElement("canvas");

    this.canvas = canvas;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.origin = this.getOrigin();

    const ctx = this.canvas.getContext("2d");

    if (isCanvasContext(ctx)) {
      this.ctx = ctx;
    } else {
      throw new Error("Unable to get context from canvas");
    }
  }

  get pixelSize() {
    return this._pixelSize * this.scale;
  }

  get gridPixelSize() {
    return this.pixelSize + 1;
  }

  getOrigin() {
    return {
      x: this.canvas.width / 2 - (this.width * this.pixelSize) / 2,
      y: this.canvas.height / 2 - (this.height * this.pixelSize) / 2,
    };
  }

  mount() {
    this.editor.root.appendChild(this.canvas);

    window.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();

        const { deltaX, deltaY } = event;

        if (Number.isInteger(deltaY)) {
          this.origin.x -= deltaX;
          this.origin.y -= deltaY;
        } else {
          if (deltaY < 0) {
            this.scale = clamp((this.scale += 0.005 * deltaY), 0.5, 8);
          } else {
            this.scale = clamp((this.scale += 0.005 * deltaY), 0.5, 8);
          }
          this.origin = this.getOrigin();
        }
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      this.origin = this.getOrigin();
    });
  }

  unmount() {
    this.editor.root.removeChild(this.canvas);
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
        x * this.pixelSize + this.origin.x,
        y * this.pixelSize + this.origin.y,
        this.pixelSize,
        this.pixelSize
      );
      this.ctx.closePath();
    }
  }

  drawGrid() {
    for (let i = 0; i < this.height * this.width; i++) {
      const [x, y] = this.getPosition(i);
      this.ctx.beginPath();

      if ((y % 2 === 0 && x % 2 === 0) || (y % 2 !== 0 && x % 2 !== 0)) {
        this.ctx.fillStyle = GridColor.DARK;
      } else {
        this.ctx.fillStyle = GridColor.LIGHT;
      }
      this.ctx.fillRect(
        x * this.pixelSize + this.origin.x,
        y * this.pixelSize + this.origin.y,
        this.pixelSize,
        this.pixelSize
      );
      this.ctx.closePath();
    }
  }
}
