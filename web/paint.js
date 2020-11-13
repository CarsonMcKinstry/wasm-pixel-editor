import { Pixel } from "wasm-pixel-editor";
let held = false;
let lastPixel = {
  x: 0,
  y: 0,
};

let color = {
  r: 0,
  g: 0,
  b: 0,
  a: 1,
};

export const fill = (canvas, pixelSpace, cellSize) => (event) => {
  console.log("called");
  const boundingRect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  // const origin = {
  //   x: Math.floor(canvas.width / 2) - Math.floor((width * cellSize) / 2),
  //   y: Math.floor(canvas.height / 2) - Math.floor((height * cellSize) / 2),
  // };
  const origin = {
    x: 0,
    y: 0,
  };

  const canvasLeft = (event.clientX - origin.x - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - origin.y - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / cellSize), canvas.height - 1);
  const col = Math.min(Math.floor(canvasLeft / cellSize), canvas.width - 1);

  pixelSpace.bucket(row, col, Pixel.new(0, 0, 0, 50));

  lastPixel = {
    x: row,
    y: col,
  };
};

const width = 64;
const height = 48;

const eraser = document.getElementById("eraser");

function paint(canvas, pixelSpace, cellSize, event) {
  const boundingRect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  // const origin = {
  //   x: Math.floor(canvas.width / 2) - Math.floor((width * cellSize) / 2),
  //   y: Math.floor(canvas.height / 2) - Math.floor((height * cellSize) / 2),
  // };
  const origin = {
    x: 0,
    y: 0,
  };

  const canvasLeft = (event.clientX - origin.x - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - origin.y - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / cellSize), canvas.height - 1);
  const col = Math.min(Math.floor(canvasLeft / cellSize), canvas.width - 1);

  if (eraser.checked) {
    pixelSpace.erase(row, col);
  } else {
    pixelSpace.paint(row, col, Pixel.new(0, 0, 0, 50));
  }

  lastPixel = {
    x: row,
    y: col,
  };
}

export const handleMouseDown = (canvas, pixelSpace, cellSize) => (event) => {
  held = true;
  paint(canvas, pixelSpace, cellSize, event);
};

export const handleMouseUp = () => {
  held = false;
};

export const handleMouseMove = (canvas, pixelSpace, cellSize) => (event) => {
  if (held) {
    paint(canvas, pixelSpace, cellSize, event);
  }
};
