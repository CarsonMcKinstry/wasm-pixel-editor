import React, { FC } from "react";
import {
  CanvasContextProvider,
  useCanvas,
  PixelSpaceContextProvider,
  usePixelSpace,
  OriginContextProvider,
  useOriginContext,
  // ScaleContextProvider,
  // useScaleContext,
} from "./contexts";

interface EditorContextOptions {
  height?: number;
  width?: number;
}

export const EditorContext: FC<EditorContextOptions> = ({
  children,
  width = 64,
  height = 48,
}) => {
  return (
    <CanvasContextProvider>
      <PixelSpaceContextProvider width={width} height={height}>
        <OriginContextProvider>{children}</OriginContextProvider>
      </PixelSpaceContextProvider>
    </CanvasContextProvider>
  );
};

export const useEditorContext = () => {
  const origin = useOriginContext();
  const canvas = useCanvas();
  const pixelSpace = usePixelSpace();
  // const scale = useScaleContext();

  return {
    ...origin,
    ...canvas,
    ...pixelSpace,
    // ...scale,
  };
};
