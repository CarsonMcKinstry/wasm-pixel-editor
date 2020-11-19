import { Canvas } from "./Canvas";

export const zoom = (canvas: Canvas) => (event: WheelEvent) => {
    event.preventDefault();
    const { deltaY } = event;

    if (!Number.isInteger(deltaY)) {
        canvas.scale -= 0.005 * deltaY;
        canvas.origin = canvas.getOrigin();
    }
}

export const pan = (canvas: Canvas) => (event: WheelEvent) => {
    event.preventDefault();
    const { deltaX, deltaY } = event;

    if (Number.isInteger(deltaY)) {
        canvas.origin.x -= deltaX;
        canvas.origin.y -= deltaY;
    }
}

export const handleWindowResize = (canvas: Canvas) => () => {
    canvas.canvas.width = window.innerWidth;
    canvas.canvas.height = window.innerHeight;

    canvas.origin = canvas.getOrigin();
}