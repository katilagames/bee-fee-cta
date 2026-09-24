import { Container, DestroyOptions } from "pixi.js";
import Main from "./Main";
import Hero from "./Hero";
import { MoveDirection } from "./managers/MoveHandler";
import MoveArrows from "./MoveArrows";
import { isTouchDevice } from "../utils/utils";
import Item, { ITEM_TYPES } from "./items/Item";
import CollisionManager from "./managers/CollisionManager";
import ItemBig from "./items/ItemBig";
import ItemFast from "./items/ItemFast";
import ItemKilling from "./items/ItemKilling";
import LevelsManager, { LevelSettings } from "./managers/LevelsManager";
import Background from "./Background";

export default class Game extends Container {
  private main: Main;
  private hero?: Hero;

  private isActive = false;
  private points: number;
  private pointsSinceLastLevel: number = 0;
  private pointsToLevelUp: number = Infinity;
  private lives: number;
  private level: number;
  private maxLevels: number = 1;
  private levelSettings?: LevelSettings;
  private maxLivesToLose = 10;

  private moveArrows?: MoveArrows;

  private itemsContainer?: Container;
  private items: Item[] = [];
  private spawnItemEveryMs = 1500;
  private spawnTimeAccumulatorMs = 0;
  private spawnNumberOfItems = 1;

  private collisionManager: CollisionManager;
  private levelsManager: LevelsManager;

  private background?: Background;

  constructor(main: Main) {
    super();
    this.main = main;
    this.collisionManager = new CollisionManager();
    this.levelsManager = new LevelsManager();

    this.lives = this.maxLivesToLose;
    this.points = 0;
    this.level = 1;
  }

  public init() {
    this.levelSettings = this.levelsManager.getSettings(this.level);
    this.spawnItemEveryMs = this.levelSettings.items.spawnItemEveryMs;
    this.spawnNumberOfItems = this.levelSettings.items.maxAtOnce;
    this.pointsToLevelUp = this.levelSettings.pointsToLevelUp;
    this.maxLevels = this.levelsManager.getLevelsNum();

    this.createBackground();
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

  private getItemSettings() {
    let possibleTypes = this.levelSettings?.items.types;
    if (!possibleTypes) {
      possibleTypes = ["normal"];
    }
    const randomTypeKey = Math.floor(Math.random() * possibleTypes.length);
    const randomType = possibleTypes[randomTypeKey];

    return {
      type: randomType,
      speed: this.levelSettings?.items.speed,
    };
  }
  private createItem() {
    let { type, speed } = this.getItemSettings();

    const itemType = this.toItemType(type);
    const item = this.getItem(itemType);
    item.applySettings(speed);
    item.init();
    item.x = item.width + (this.screen.width - item.width * 2) * Math.random();
    item.y = -item.height - Math.random() * 2 * item.height;
    this.itemsContainer?.addChild(item);
  }
  private createItemByType(itemType: ITEM_TYPES) {
    switch (itemType) {
      case ITEM_TYPES.big:
        return new ItemBig(this);
      case ITEM_TYPES.fast:
        return new ItemFast(this);
      case ITEM_TYPES.killing:
        return new ItemKilling(this);
      case ITEM_TYPES.normal:
      default:
        return new Item(this);
    }
  }
  private getItem(itemType: ITEM_TYPES) {
    let item = this.items.find(
      (foundItem) => !foundItem.isActive && foundItem.type === itemType,
    );
    if (!item) {
      item = this.createItemByType(itemType);
      this.items.push(item);
    }

    item.init();
    return item;
  }

  private toItemType(key?: string): ITEM_TYPES {
    if (!key) return ITEM_TYPES.normal;
    const vals = Object.values(ITEM_TYPES) as string[];
    return vals.includes(key) ? (key as ITEM_TYPES) : ITEM_TYPES.normal;
  }

  private createHero() {
    this.hero = new Hero(this);
    this.hero.applySettings(this.levelSettings?.hero.speed);
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

  private createBackground() {
    if (!this.levelSettings?.background) {
      console.log("no levelsettings for bg)");
      return;
    }
    if (!this.background) {
      this.background = new Background(this);
    }

    this.background.applySettings(this.levelSettings.background);
    this.addChild(this.background);
  }
  public onMove(direction: MoveDirection, delta: number) {
    if (!this.isActive) {
      return;
    }

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

  public addPoints(points: number) {
    this.points += points;
    console.log("points", this.points);
    this.pointsSinceLastLevel += points;
    if (this.pointsSinceLastLevel > this.pointsToLevelUp) {
      this.levelUp();
    }
  }
  public addLives(lives: number) {
    this.lives += lives;
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  private levelUp() {
    this.level++;
    this.pointsSinceLastLevel = 0;
    if (this.level > this.maxLevels) {
      // reached last level — stop at max and do nothing
      this.level = this.maxLevels;
      return;
    }

    // Load new level settings
    this.levelSettings = this.levelsManager.getSettings(this.level);
    this.spawnItemEveryMs = this.levelSettings.items.spawnItemEveryMs;
    this.spawnNumberOfItems = this.levelSettings.items.maxAtOnce;
    this.pointsToLevelUp = this.levelSettings.pointsToLevelUp;

    // Update hero settings
    if (this.hero) {
      this.hero.applySettings(this.levelSettings.hero.speed);
    }

    // Update background
    if (!this.background) {
      this.background = new Background(this);
      this.addChildAt(this.background, 0);
    }
    this.background.applySettings(this.levelSettings.background);
  }
  private moveItems(delta: number) {
    for (const item of this.items) {
      if (!item.isActive) {
        continue;
      }

      item.move(delta);

      if (item.y - item.height / 2 > this.screen.height) {
        item.missed();
      }

      if (this.collisionManager.heroVsItemCollsion(this.hero!, item)) {
        item.collect();
      }
    }
  }

  private gameOver() {
    this.isActive = false;
    this.hero?.setIdle();
    console.log("GAME OVER");
  }
  handleTick(delta: number) {
    if (!this.isActive) {
      return;
    }

    this.spawnTimeAccumulatorMs += delta;

    while (this.spawnTimeAccumulatorMs >= this.spawnItemEveryMs) {
      this.spawnTimeAccumulatorMs -= this.spawnItemEveryMs;

      for (let i = 0; i < this.spawnNumberOfItems; i++) {
        // make additional items random
        if (i > 0 && Math.random() < 0.5) {
          continue;
        }
        this.createItem();
      }
    }

    this.moveItems(delta);
  }
  destroy(options?: DestroyOptions): void {
    this.hero?.destroy(options);
    this.moveArrows?.destroy(options);
    this.background?.destroy(options);

    super.destroy(options);
  }
}
