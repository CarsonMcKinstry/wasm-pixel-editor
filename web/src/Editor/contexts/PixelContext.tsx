import React, { createContext, FC, useMemo, useContext } from "react";
import { PixelSpace } from "wasm-pixel-editor";

const PIXEL_SIZE = 10;

const pixelSizeContext = createContext<number>(PIXEL_SIZE);
const pixelWidthContext = createContext<number>(64);
const pixelHeightContext = createContext<number>(48);

const pixelSpaceContext = createContext<PixelSpace | null>(null);

const { Provider: PixelSizeProvider } = pixelSizeContext;
const { Provider: PixelSpaceProvider } = pixelSpaceContext;
const { Provider: PixelWidthContext } = pixelWidthContext;
const { Provider: PixelHeightContext } = pixelHeightContext;

interface PixelSpaceOptions {
  width: number;
  height: number;
}

export const PixelSpaceContextProvider: FC<PixelSpaceOptions> = ({
  children,
  width,
  height,
}) => {
  const pixelSpace = useMemo(() => PixelSpace.new(width, height), [
    width,
    height,
  ]);

  return (
    <PixelSpaceProvider value={pixelSpace}>
      <PixelWidthContext value={width}>
        <PixelHeightContext value={height}>
          <PixelSizeProvider value={PIXEL_SIZE}>{children}</PixelSizeProvider>
        </PixelHeightContext>
      </PixelWidthContext>
    </PixelSpaceProvider>
  );
};

export const usePixelSpace = () => {
  const pixelSize = useContext(pixelSizeContext);
  const pixelWidth = useContext(pixelWidthContext);
  const pixelHeight = useContext(pixelHeightContext);
  const pixelSpace = useContext(pixelSpaceContext);

  return {
    pixelSize,
    pixelWidth,
    pixelHeight,
    pixelSpace,
  };
};
