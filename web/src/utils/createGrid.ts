import { getPosition } from "./getPosition";

const GRID_COLOR_DARK = [204, 204, 204, 255]; // #CCCCCC
const GRID_COLOR_LIGHT = [255, 255, 255, 255]; // #FFFFFF

export const createGrid = (width: number, height: number) => {
  const pixels = Array.from({ length: width * height }, (_, i) => {
    const [x, y] = getPosition(width, i);

    if ((y % 2 === 0 && x % 2 === 0) || (y % 2 !== 0 && x % 2 !== 0)) {
      return GRID_COLOR_DARK;
    } else {
      return GRID_COLOR_LIGHT;
    }
  }).flat();

  const data = new Uint8ClampedArray(pixels);
  return new ImageData(data, width, height);
};
