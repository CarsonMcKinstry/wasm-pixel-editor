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

function paint(canvas, pixelSpace, cellSize, event) {
  const boundingRect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / cellSize), canvas.height - 1);
  const col = Math.min(Math.floor(canvasLeft / cellSize), canvas.width - 1);

  if (row >= 0 && col >= 0) {
    pixelSpace.paint(row, col, 0, 0, 0, 50);

    if (lastPixel.x !== row && lastPixel.y !== col) {
      lastPixel = {
        x: row,
        y: col,
      };
    }
  }
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
