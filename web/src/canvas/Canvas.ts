import { getPosition } from "./../utils/getPosition";
import { isCanvasContext } from "../types";
import { Editor } from "../Editor";
import { clamp } from "lodash";
import { zoom, pan, handleWindowResize } from "./interactions";
import { createGrid } from "../utils";

interface CanvasOptions {
  width: number;
  height: number;
  pixelSize: number;
}

interface Point {
  x: number;
  y: number;
}

export class Canvas {
  width: number;
  height: number;
  _pixelSize: number;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  buffer: HTMLCanvasElement;
  bufferCtx: CanvasRenderingContext2D;

  private fpsLimit: number = 60;
  private previousDelta: number = 0;

  private currentRender: number | null = null;

  editor: Editor;

  _scale: number = 1;
  origin: Point = { x: 0, y: 0 };

  zoom = zoom(this);
  pan = pan(this);
  handleWindowResize = handleWindowResize(this);

  backgroundGrid: ImageData;

  constructor({ width, height, pixelSize }: CanvasOptions, editor: Editor) {
    this.editor = editor;
    this.width = width;
    this.height = height;
    this._pixelSize = pixelSize;

    this.backgroundGrid = createGrid(this.width, this.height);

    const canvas = document.createElement("canvas");
    const buffer = document.createElement("canvas");
    buffer.height = this.height;
    buffer.width = this.width;

    this.canvas = canvas;
    this.buffer = buffer;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const ctx = this.canvas.getContext("2d");
    const bufferCtx = this.buffer.getContext("2d");

    if (isCanvasContext(ctx) && isCanvasContext(bufferCtx)) {
      this.ctx = ctx;
      this.bufferCtx = bufferCtx;

      this.ctx.imageSmoothingEnabled = false;
    } else {
      throw new Error("Unable to get context from canvas");
    }

    this.origin = this.getOrigin();
  }

  init() {
    this.render();
    this.renderLoop(1);
  }

  get scale() {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = clamp(value, 0.5, 8);
  }

  get pixelSize() {
    return this._pixelSize * this.scale;
  }

  get trueSize() {
    return {
      width: this.pixelSize * this.width,
      height: this.pixelSize * this.height,
    };
  }

  getOrigin() {
    const canvasMidPoint = {
      x: (this.width * this.pixelSize) / 2,
      y: (this.height * this.pixelSize) / 2,
    };

    return {
      x: clamp(
        this.canvas.width / 2 - canvasMidPoint.x,
        -this.trueSize.width,
        this.trueSize.width
      ),
      y: clamp(
        this.canvas.height / 2 - canvasMidPoint.y,
        -this.trueSize.height,
        this.trueSize.height
      ),
    };
  }

  getPosition(index: number) {
    return getPosition(this.width, index);
  }

  drawPixels() {
    const { imageData } = this.editor;

    this.bufferCtx.putImageData(imageData, 0, 0);
    this.renderToCanvas();
  }

  drawGrid() {
    this.bufferCtx.putImageData(this.backgroundGrid, 0, 0);
    this.renderToCanvas();
  }

  mount() {
    this.editor.root.appendChild(this.canvas);

    window.addEventListener("wheel", this.zoom, {
      passive: false,
    });
    window.addEventListener("wheel", this.pan, {
      passive: false,
    });
  }

  unmount() {
    this.editor.root.removeChild(this.canvas);

    window.removeEventListener("wheel", this.zoom);
    window.removeEventListener("wheel", this.pan);
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

  renderToCanvas() {
    this.ctx.drawImage(
      this.buffer,
      this.origin.x,
      this.origin.y,
      this.width * this.pixelSize,
      this.height * this.pixelSize
    );
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawPixels();
  }
}
