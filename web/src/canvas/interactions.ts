import { Canvas } from "./Canvas";
import { clamp } from "lodash";

export const zoom = (canvas: Canvas) => (event: WheelEvent) => {
  event.preventDefault();

  const { clientX, clientY, deltaY } = event;
  if (!Number.isInteger(deltaY)) {
    const { scale, origin } = canvas;

    const wheel = deltaY < 0 ? 1 : -1;

    const zoom = Math.exp(wheel * 0.05);

    canvas.scale = scale * zoom;
  }
};

export const pan = (canvas: Canvas) => (event: WheelEvent) => {
  event.preventDefault();
  const { deltaX, deltaY } = event;

  if (Number.isInteger(deltaY)) {
    canvas.origin.x = clamp(
      canvas.origin.x - deltaX,
      0 - canvas.trueSize.width,
      canvas.canvas.width
    );
    canvas.origin.y = clamp(
      canvas.origin.y - deltaY,
      0 - canvas.trueSize.height,
      canvas.canvas.height
    );
  }
};

export const handleWindowResize = (canvas: Canvas) => () => {
  canvas.canvas.width = window.innerWidth;
  canvas.canvas.height = window.innerHeight;

  canvas.origin = canvas.getOrigin();
};
