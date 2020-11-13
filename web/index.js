import * as wasm from "wasm-pixel-editor";
import { memory } from "wasm-pixel-editor/wasm_pixel_editor_bg";
import { chunk } from "lodash";
import {
  handleClick,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
  fill,
} from "./paint";

const width = 64;
const height = 48;
const cellSize = 10;

const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");

const tool = document.getElementById("tool");

// canvas.width = document.documentElement.clientWidth;
// canvas.height = document.documentElement.clientHeight;
canvas.width = width * cellSize;
canvas.height = height * cellSize;

const pixelSpace = wasm.PixelSpace.new(width, height);
const getPosition = (i) => {
  return {
    x: i % width,
    y: Math.floor(i / width),
  };
};

const mouseDown = handleMouseDown(canvas, pixelSpace, cellSize);
const mouseUp = handleMouseUp;
const mouseMove = handleMouseMove(canvas, pixelSpace, cellSize);
const bucketFill = fill(canvas, pixelSpace, cellSize);

let paintBrushRegistered = true;
let paintBucketRegistered = false;

const registerPaintBrush = () => {
  paintBrushRegistered = true;
  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mousemove", mouseMove);
  canvas.addEventListener("mouseup", mouseUp);
};

const deregisterPaintBrush = () => {
  paintBrushRegistered = false;
  canvas.removeEventListener("mousedown", mouseDown);
  canvas.removeEventListener("mousemove", mouseMove);
  canvas.removeEventListener("mouseup", mouseUp);
};

const registerPaintBucket = () => {
  paintBucketRegistered = true;
  canvas.addEventListener("click", bucketFill);
};

const deregisterPaintBucket = () => {
  paintBucketRegistered = false;
  canvas.removeEventListener("click", bucketFill);
};

tool.addEventListener("change", (event) => {
  if (event.target.checked) {
    deregisterPaintBrush();
    registerPaintBucket();
  } else {
    if (!paintBrushRegistered) {
      registerPaintBrush();
    }
    deregisterPaintBucket();
  }
});

registerPaintBrush();

document.addEventListener("scroll", (event) => {
  console.log(event);
});

// const origin = {
//   x: Math.floor(canvas.width / 2) - Math.floor((width * cellSize) / 2),
//   y: Math.floor(canvas.height / 2) - Math.floor((height * cellSize) / 2),
// };

const origin = {
  x: 0,
  y: 0,
};

function animate() {
  requestAnimationFrame(animate);
  const pixelsPointer = pixelSpace.pixels();
  const pixels = chunk(
    new Uint8Array(memory.buffer, pixelsPointer, width * height * 4),
    4
  );

  ctx.clearRect(origin.x, origin.y, width * cellSize, height * cellSize);
  ctx.strokeRect(origin.x, origin.y, width * cellSize, height * cellSize);

  for (let i = 0; i < pixels.length; i++) {
    const [r, g, b, a] = pixels[i];

    const { x, y } = getPosition(i);

    ctx.beginPath();

    ctx.fillStyle = `rgba(${r},${g},${b},${a / 100})`;
    ctx.fillRect(
      x * cellSize + origin.x,
      y * cellSize + origin.y,
      cellSize,
      cellSize
    );
  }
}

animate();
