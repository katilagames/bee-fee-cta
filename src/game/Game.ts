import { Container, DestroyOptions } from "pixi.js";
import Main from "./Main";
import Hero from "./Hero";
import { MoveDirection } from "./MoveHandler";
import MoveArrows from "./MoveArrows";
import { isTouchDevice } from "../utils/utils";
import Item from "./Item";
import CollisionManager from "./CollisionManager";

export default class Game extends Container {
  private main: Main;
  private hero?: Hero;

  private isActive = false;
  private points: number;
  private lives: number;
  private maxLivesToLose = 2;

  private moveArrows?: MoveArrows;

  private itemsContainer?: Container;
  private items: Item[] = [];
  private spawnItemEveryMs = 1500;
  private spawnTimeAccumulatorMs = 0;
  
  private collisionManager: CollisionManager;

  constructor(main: Main) {
    super();
    this.main = main;
    this.collisionManager = new CollisionManager();

    this.lives = this.maxLivesToLose;
    this.points = 0;
  }

  public init() {
    this.createItems();
    this.createHero();
    this.createMoveArrows();

    if (this.moveArrows) {
      this.main.getMoveHandler().addScreenArrows(this.moveArrows);
    }

    this.isActive = true;
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

  private addPoints(points: number) {
    this.points += points;
  }
  private addLives(lives: number) {
    this.lives += lives;
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  private moveItems(delta: number) {
    for (const item of this.items) {
      if (!item.isActive) {
        continue;
      }

      item.move(delta);

      if (item.y - item.height/2 > this.screen.height) {
        item.missed();
        this.addLives(-1);
      }

      if (this.collisionManager.heroVsItemCollsion(this.hero!, item)) {
        item.collect();
        this.addPoints(5);
      }
    }
  }

  private gameOver() {
    this.isActive = false;
    console.log("GAME OVER");
  }
  handleTick(delta: number) {
    if (!this.isActive) {
      return;
    }

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
