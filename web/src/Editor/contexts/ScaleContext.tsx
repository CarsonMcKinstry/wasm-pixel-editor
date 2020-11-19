import { clamp } from "lodash";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

const defaultScale = 1;

const scaleContext = createContext<number>(defaultScale);
const setScaleContext = createContext<(scale: number) => void>(() => {});

const { Provider: ScaleContext } = scaleContext;
const { Provider: SetScaleContextProvider } = setScaleContext;

export const ScaleContextProvider: FC = ({ children }) => {
  const [scale, _setScale] = useState(defaultScale);

  const setOrigin = useCallback(
    (s: number) => {
      _setScale(s);
    },
    [_setScale]
  );

  const setScaleOnWheel = useCallback(
    (event: WheelEvent) => {
      const { deltaY } = event;

      if (deltaY > 0) {
        _setScale((s) => clamp(s - 0.0725, 0.5, 5));
      } else {
        _setScale((s) => clamp(s + 0.0725, 0.5, 5));
      }
    },
    [_setScale]
  );

  useLayoutEffect(() => {
    window.addEventListener("wheel", setScaleOnWheel);
    return () => {
      window.removeEventListener("wheel", setScaleOnWheel);
    };
  }, [setScaleOnWheel]);

  return (
    <SetScaleContextProvider value={setOrigin}>
      <ScaleContext value={scale}>{children}</ScaleContext>
    </SetScaleContextProvider>
  );
};

export const useScaleContext = () => {
  const scale = useContext(scaleContext);
  const setScale = useContext(setScaleContext);

  return {
    scale,
    setScale,
  };
};
