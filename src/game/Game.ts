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
  private spawnItemEveryMs = 1500;
  private spawnTimeAccumulatorMs = 0;

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
    const item = this.getItem();
    item.init();
    item.x = item.width + (this.screen.width - item.width * 2) * Math.random();
    item.y = -item.height;
    this.itemsContainer?.addChild(item);
  }
  private getItem() {
    let item = this.items.find((foundItem) => !foundItem.isActive);
    if (!item) {
      item = new Item(this);
      this.items.push(item);
    }

    item.init();
    return item;
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

  private moveItems(delta: number) {
    for (const item of this.items) {
      if (!item.isActive) {
        continue;
      }

      item.move(delta);
    }
  }

  handleTick(delta: number) {
    this.spawnTimeAccumulatorMs += delta;

    while (this.spawnTimeAccumulatorMs >= this.spawnItemEveryMs) {
      this.spawnTimeAccumulatorMs -= this.spawnItemEveryMs;
      this.createItem();
    }

    this.moveItems(delta);
  }
  destroy(options?: DestroyOptions): void {
    this.hero?.destroy(options);
    this.moveArrows?.destroy(options);

    super.destroy(options);
  }
}
