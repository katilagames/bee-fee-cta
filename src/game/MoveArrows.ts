import { Assets, Container, DestroyOptions, Sprite } from "pixi.js";
import Game from "./Game";

export default class MoveArrows extends Container {
  left?: Sprite;
  right?: Sprite;

  up?: Sprite;
  down?: Sprite;

  game: Game;

  constructor(game: Game) {
    super();

    this.game = game;

    const margin = 10;
    const scale = 0.5;
    const arrowTexture = Assets.get("arrow");

    this.left = new Sprite(arrowTexture);
    const leftBounds = this.left.getBounds();
    this.left.anchor.set(0.5);
    this.left.scale.set(scale);
    this.left.x = leftBounds.width/2 + margin;
    this.left.y = this.game.screen.height - leftBounds.height/2 - margin;
    
    const bottomMarginFix = 5;
    this.right = new Sprite(arrowTexture);
    const rightBounds = this.right.getBounds();
    this.right.anchor.set(0.5);
    this.right.scale.set(scale);
    this.right.angle = 180;
    this.right.x = this.game.screen.width - rightBounds.width/2 - margin;
    this.right.y = this.game.screen.height - rightBounds.height/2 - margin + bottomMarginFix;

    this.addChild(this.right, this.left);
  }

  destroy(options?: DestroyOptions): void {
    this.left?.destroy(options);
    this.right?.destroy(options);
    this.up?.destroy(options);
    this.down?.destroy(options);
    super.destroy(options);
  }
}
