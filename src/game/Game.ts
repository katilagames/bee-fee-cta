import { Container, DestroyOptions } from "pixi.js";
import Main from "./Main";
import Hero from "./Hero";
import { MoveDirection } from "./MoveHandler";
import MoveArrows from "./MoveArrows";
import { isTouchDevice } from "../utils/utils";
import Item from "./Item";

export default class Game extends Container {
  private main: Main;
  private hero?: Hero;

  private moveArrows?: MoveArrows;

  private itemsContainer?: Container;
  private items: Item[] = [];

  constructor(main: Main) {
    super();
    this.main = main;
  }

  public init() {
    this.createItems();
    this.createHero();
    this.createMoveArrows();

    if (this.moveArrows) {
      this.main.getMoveHandler().addScreenArrows(this.moveArrows);
    }
  }

  public get app() {
    return this.main.app;
  }

  public get screen() {
    return this.app.renderer.screen;
  }

  private createItems() {
    this.itemsContainer = new Container();
    this.addChild(this.itemsContainer);

    this.createItem();
  }
  private createItem() {
    const item = new Item(this);
    item.x = this.screen.width/2;
    item.y = 100;

    this.items.push(item);
    this.itemsContainer?.addChild(item);
  }
  private createHero() {
    this.hero = new Hero(this);
    this.addChild(this.hero);
  }

  private createMoveArrows() {
    // prevent making screen arrows on Desktop
    if (!isTouchDevice()) {
      return;
    }
    this.moveArrows = new MoveArrows(this);
    this.addChild(this.moveArrows);
  }

  public onMove(direction: MoveDirection, delta: number) {
    if (!this.hero) {
      return;
    }

    if (direction === MoveDirection.NONE) {
      this.hero.setIdle();
      return;
    }

    if (direction === MoveDirection.LEFT) {
      this.hero.moveLeft(delta);
    } else if (direction === MoveDirection.RIGHT) {
      this.hero.moveRight(delta);
    }
  }

  destroy(options?: DestroyOptions): void {
    this.hero?.destroy(options);
    this.moveArrows?.destroy(options);

    super.destroy(options);
  }
}
