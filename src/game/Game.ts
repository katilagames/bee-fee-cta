import { Assets, Container, Sprite } from "pixi.js";
import Main from "./Main";

export default class Game extends Container {
  private main: Main;

  constructor(main: Main) {
    super();
    this.main = main;
  }

  public async init() {
    await this.createHero();
  }

  private get app() {
    return this.main.app;
  }

  private async createHero() {
    const heroTexture = Assets.get("hero_static");
    if (!heroTexture) {
      return;
    }

    const heroSprite = new Sprite(heroTexture);
    this.addChild(heroSprite);
  }
}
