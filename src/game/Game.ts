import { AnimatedSprite, Assets, Container } from "pixi.js";
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
    const heroSS = Assets.get("hero_spritesheet");
    if (!heroSS) {
      console.error("Missing hero sprite sheet");
      return;
    }
    
    const heroAnimation = new AnimatedSprite(heroSS.animations["char_idle"]);
    heroAnimation.animationSpeed = 0.1;
    heroAnimation.play();

    this.addChild(heroAnimation);
  }
}
