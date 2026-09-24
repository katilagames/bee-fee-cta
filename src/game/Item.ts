import { Assets, Container, Sprite } from "pixi.js";
import Game from "./Game";

export default class Item extends Container {
  private game: Game;
  private sprite: Sprite;

  constructor(game: Game) {
    super();
    this.game = game;

    // TODO: create spritesheet 
    const itemTexture = Assets.get('food');

    this.sprite = new Sprite(itemTexture);
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);
  }
}