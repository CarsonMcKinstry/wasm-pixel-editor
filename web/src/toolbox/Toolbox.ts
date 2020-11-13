import { Tool } from "./Tool";
import { Editor } from "../Editor";
import { isDiv } from "../types";

export class Toolbox {
  editor: Editor;
  tools: Tool[];
  currentTool: Tool;

  toolbox: HTMLDivElement;

  constructor(tools: Tool[], editor: Editor) {
    this.editor = editor;

    this.tools = tools;
    this.currentTool = this.tools[0];

    const toolbox = document.getElementById("toolbox");

    if (isDiv(toolbox)) {
      this.toolbox = toolbox;
    } else {
      throw new Error('Unable to find div with id="toolbox"');
    }
  }

  init() {
    for (const tool of this.tools) {
      tool.init(this);
      this.toolbox.appendChild(tool.element);
    }
  }
}
