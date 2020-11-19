import React, {
  FC,
  createContext,
  useContext,
  MutableRefObject,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

const canvasContext = createContext<MutableRefObject<HTMLCanvasElement | null> | null>(
  null
);
const renderingContext = createContext<CanvasRenderingContext2D | null>(null);

const { Provider: CanvasProvider } = canvasContext;
const { Provider: RenderingContextProvider } = renderingContext;

export const CanvasContextProvider: FC = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [
    renderingContext,
    setRenderingContext,
  ] = useState<CanvasRenderingContext2D | null>(null);

  useLayoutEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        setRenderingContext(ctx);
      }
    }
  }, []);

  return (
    <CanvasProvider value={canvasRef}>
      <RenderingContextProvider value={renderingContext}>
        {children}
      </RenderingContextProvider>
    </CanvasProvider>
  );
};

export const useCanvas = () => {
  const canvas = useContext(canvasContext);
  const ctx = useContext(renderingContext);

  return {
    canvas,
    ctx,
  };
};
