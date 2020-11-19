import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useEditorContext } from "../Editor/EditorContext";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { getPixels, getIndex, toRgba } from "./utils";

enum GridColor {
  LIGHT = "#EEEEEE",
  DARK = "#CCCCCC",
}

const BACKGROUND_COLOR = "#AAAAAA";

export const Canvas = () => {
  const {
    canvas,
    ctx,
    pixelSpace,
    pixelHeight,
    pixelWidth,
    pixelSize,
    origin,
  } = useEditorContext();
  const { width, height } = useWindowDimensions();
  const [scale, setScale] = useState<number>(1);
  const animationId = useRef<number | null>(null);

  const renderLoop = useCallback(() => {
    animationId.current = requestAnimationFrame(renderLoop);
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, width, height);

      const scaledPixelSize = pixelSize * scale;

      for (let i = 0; i < pixelWidth * pixelHeight; i++) {
        const [x, y] = getIndex(i, pixelWidth);

        if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)) {
          ctx.fillStyle = GridColor.LIGHT;
        } else {
          ctx.fillStyle = GridColor.DARK;
        }
        ctx.fillRect(
          x * scaledPixelSize + origin.x,
          y * scaledPixelSize + origin.y,
          scaledPixelSize,
          scaledPixelSize
        );
      }

      if (pixelSpace) {
        const pixels = getPixels(pixelSpace, pixelWidth, pixelHeight);

        for (const [i, pixel] of pixels.entries()) {
          const [x, y] = getIndex(i, pixelWidth);

          ctx.fillStyle = toRgba(pixel);
          ctx.fillRect(
            x * scaledPixelSize + origin.x,
            y * scaledPixelSize + origin.y,
            scaledPixelSize,
            scaledPixelSize
          );
        }
      }
    }
  }, [
    ctx,
    height,
    width,
    pixelSize,
    pixelWidth,
    pixelHeight,
    pixelSpace,
    origin.x,
    origin.y,
    scale,
  ]);

  useEffect(() => {
    if (ctx) {
      renderLoop();
    }
  }, [renderLoop, ctx]);

  useLayoutEffect(() => {
    window.addEventListener("wheel", () => {
      setScale((s) => (s < 5 ? s + 0.05 : 1));
    });
  }, []);

  return <canvas ref={canvas} width={width} height={height} />;
};
