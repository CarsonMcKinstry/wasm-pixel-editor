import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { useCanvas } from "./CanvasContext";
import { usePixelSpace } from "./PixelContext";

const defaultOrigin = {
  x: 0,
  y: 0,
};

const originContext = createContext<{ x: number; y: number }>(defaultOrigin);
const setOriginContext = createContext<(x: number, y: number) => void>(
  () => {}
);

const { Provider: OriginContext } = originContext;
const { Provider: SetOriginContextProvider } = setOriginContext;

export const OriginContextProvider: FC = ({ children }) => {
  const { canvas } = useCanvas();
  const { pixelSize, pixelWidth, pixelHeight } = usePixelSpace();
  const [origin, _setOrigin] = useState(defaultOrigin);

  const setOrigin = useCallback(
    (x: number, y: number) => {
      _setOrigin({
        x,
        y,
      });
    },
    [_setOrigin]
  );

  useLayoutEffect(() => {
    if (canvas && canvas.current) {
      const { width, height } = canvas.current;

      const x = width / 2 - (pixelWidth * pixelSize) / 2;
      const y = height / 2 - (pixelHeight * pixelSize) / 2;

      setOrigin(x, y);
    }
  }, [canvas, pixelSize, pixelWidth, pixelHeight, setOrigin]);

  return (
    <SetOriginContextProvider value={setOrigin}>
      <OriginContext value={origin}>{children}</OriginContext>
    </SetOriginContextProvider>
  );
};

export const useOriginContext = () => {
  const origin = useContext(originContext);
  const setOrigin = useContext(setOriginContext);

  return {
    origin,
    setOrigin,
  };
};
