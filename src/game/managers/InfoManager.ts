import { Container, Text, TextStyle } from "pixi.js";
import Game from "../Game";

export default class InfoManager extends Container {
  private game: Game;
  private text?: Text;
  private hideTimeout?: ReturnType<typeof setTimeout>;

  constructor(game: Game) {
    super();
    this.game = game;
  }

  showMessage(message: string, duration = 3000, style?: Partial<TextStyle>) {
    if (!this.text) {
      this.text = new Text({
        text: message,
        style: {
          fontFamily: "Arial",
          fontSize: 48,
          fill: 0xffffff,
          align: "center",
          stroke: 0x000000,
          ...style,
        }
      });

      if ((this.text as any).anchor &&
        typeof (this.text as any).anchor.set === "function") {
        (this.text as any).anchor.set(0.5, 0.5);
      }
      this.addChild(this.text);

    } else {
      this.text.text = message;
      if (style) {
        Object.assign(this.text.style as any, style);
      }
    }

    const { width, height } = this.game.screen;
    this.text.x = Math.round(width / 2);
    this.text.y = Math.round(height * 0.15);
    this.text.visible = true;

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(() => this.hide(), duration);
  }

  hide() {
    if (this.text) {
      this.text.visible = false;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  destroy(options?: any) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    this.text?.destroy(options);
    this.text = undefined;
    super.destroy(options);
  }
}
