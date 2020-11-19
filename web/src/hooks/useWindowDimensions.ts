import { useState, useCallback, useLayoutEffect } from "react";

export const useWindowDimensions = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  const windowResizeCallback = useCallback(() => {
    const { innerHeight, innerWidth } = window;

    if (innerHeight !== height) {
      setHeight(innerHeight);
    }

    if (innerWidth !== width) {
      setWidth(innerWidth);
    }
  }, [setHeight, setWidth]);

  useLayoutEffect(() => {
    window.addEventListener("resize", windowResizeCallback);
    return () => {
      window.removeEventListener("resize", windowResizeCallback);
    };
  }, [windowResizeCallback]);

  return {
    width,
    height,
  };
};
