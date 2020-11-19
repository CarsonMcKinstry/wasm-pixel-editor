import { Toolbox } from "./Toolbox";

export abstract class Tool {
  abstract name: string;
  abstract activate: () => void;
  abstract deactivate: () => void;

  element: HTMLInputElement;

  icon: string = "https://via.placeholder.com/36";

  toolbox?: Toolbox;

  constructor() {
    this.element = document.createElement("input");

    this.element.type = "image";
    this.element.src = this.icon;
  }

  init(toolbox: Toolbox) {
    this.toolbox = toolbox;
  }
}
