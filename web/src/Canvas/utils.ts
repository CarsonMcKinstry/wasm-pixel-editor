import { memory } from "wasm-pixel-editor/wasm_pixel_editor_bg.wasm";
import { chunk } from "lodash";
import { PixelSpace } from "wasm-pixel-editor";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

export const getPixels = (
  pixelSpace: PixelSpace,
  pixelWidth: number,
  pixelHeight: number
) => {
  const ptr = pixelSpace.pixels();
  const size = pixelHeight * pixelWidth * 4;
  return ptr ? chunk(new Uint8Array(memory.buffer, ptr, size), 4) : [];
};

export const getIndex = (index: number, pixelWidth: number) => {
  return [index % pixelWidth, Math.floor(index / pixelWidth)];
};

export const toRgba = ([r, g, b, a]: number[]) =>
  `rgba(${r},${g},${b},${a / 100})`;
