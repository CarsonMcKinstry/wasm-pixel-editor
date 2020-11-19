export const isCanvas = (
  element: HTMLElement | null
): element is HTMLCanvasElement =>
  element != null && element.tagName === "CANVAS";

export const isCanvasContext = (
  context: CanvasRenderingContext2D | null
): context is CanvasRenderingContext2D => !!context && !!context.canvas;

export const isDiv = (element: HTMLElement | null): element is HTMLDivElement =>
  element != null && element.tagName === "DIV";
