import { AnimatedSprite, Assets, Container } from "pixi.js";
import Main from "./Main";
import Hero from "./Hero";

export default class Game extends Container {
  private main: Main;
  private hero?: Hero;

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
    this.hero = new Hero(this);
    this.addChild(this.hero);
  }
}
