import * as wasm from "wasm-pixel-editor";
import { memory } from "wasm-pixel-editor/wasm_pixel_editor_bg";
import { chunk } from "lodash";
import {
  handleClick,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
} from "./paint";

const width = 64;
const height = 48;
const cellSize = 10;

const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");

canvas.width = width * cellSize;
canvas.height = height * cellSize;

const pixelSpace = wasm.PixelSpace.new(width, height);
const getPosition = (i) => {
  return {
    x: i % width,
    y: Math.floor(i / width),
  };
};

canvas.addEventListener(
  "mousedown",
  handleMouseDown(canvas, pixelSpace, cellSize)
);
canvas.addEventListener(
  "mousemove",
  handleMouseMove(canvas, pixelSpace, cellSize)
);
canvas.addEventListener("mouseup", handleMouseUp);

function animate() {
  requestAnimationFrame(animate);
  const pixelsPointer = pixelSpace.pixels();
  const pixels = chunk(
    new Uint8Array(memory.buffer, pixelsPointer, width * height * 4),
    4
  );

  ctx.clearRect(0, 0, width * cellSize, height * cellSize);

  for (let i = 0; i < pixels.length; i++) {
    const [r, g, b, a] = pixels[i];

    const { x, y } = getPosition(i);

    ctx.beginPath();

    ctx.fillStyle = `rgba(${r},${g},${b},${a / 100})`;

    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
}

animate();
