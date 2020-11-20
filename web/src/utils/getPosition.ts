import { curry } from "lodash/fp";

export const getPosition = curry((width: number, index: number) => [
  index % width,
  Math.floor(index / width),
]);
