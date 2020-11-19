import React, { FC } from "react";
import { Canvas } from "../Canvas/Canvas";
import { EditorContext } from "./EditorContext";

export const Editor: FC = () => {
  return (
    <EditorContext>
      <Canvas />
    </EditorContext>
  );
};
