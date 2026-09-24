import { Assets, Container, Rectangle, Sprite, Texture, TextureSource } from "pixi.js";
import Game from "../Game";

export enum ITEM_TYPES {
  normal = "normal",
  big = "big",
  fast = "fast",
  killing = "killing"
}

const ITEM_GRAPHIC_SIZE = 16;
const ITEM_TEXTURE_SIZE = { x: 8, y: 8 };

const ITEMS_NAMES_TEXTURE_POS: Record<string, [number, number]> = {
  cookie: [0, 0],
  pig: [1, 1],
  beer: [4, 3],
  cake: [4, 4],
};
export default class Item extends Container {
  protected game: Game;
  protected sprite?: Sprite;

  protected itemTexture: TextureSource;

  protected speed: number = 200;
  isActive: boolean = false;

  type: ITEM_TYPES = ITEM_TYPES.normal;

  constructor(game: Game) {
    super();
    this.game = game;
    this.itemTexture = Assets.get("food");
  }

  applySettings(speed?: number) {
    if (speed) {
      this.speed = speed;
    }
  }

  init(namedTexture?: string) {
    const texture = namedTexture
      ? this.getItemTextureByName(namedTexture)
      : this.getItemTextureByRandom(true);

    if (!texture) {
      console.error("Item init missing texture");
      return;
    }

    if (!this.sprite) {
      this.sprite = new Sprite(texture);
    } else {
      this.sprite.texture = texture;
    }

    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(2);
    this.sprite.texture.source.scaleMode = "nearest";
    this.addChild(this.sprite);

    this.isActive = true;
    this.visible = true;
  }

  move(delta: number) {
    const distance = (this.speed * delta) / 1000;

    this.y += distance;

    if (this.y - this.height > this.game.screen.height) {
      this.isActive = false;
      this.visible = false;
    }
  }

  protected deactivate() {
    this.isActive = false;
    this.visible = false;
  }
  missed() {
    this.deactivate();

    this.game.addLives(-1);
  }
  collect() {
    this.deactivate();

    this.game.addPoints(5);
  }

  private isPositionOnTheList(pos: { x: number; y: number }): boolean {
    const { x, y } = pos;
    const foundItem = Object.entries(ITEMS_NAMES_TEXTURE_POS).find(
      ([_, [posX, posY]]) => posX === x && posY === y,
    );

    return !!foundItem;
  }
  private getPossiblePositions(excludeNamed: boolean = false) {
    const possibleItemPositions = [];
    for (let x = 0; x < ITEM_TEXTURE_SIZE.x; x++) {
      for (let y = 0; y < ITEM_TEXTURE_SIZE.y; y++) {
        const pos = { x, y };

        if (excludeNamed && this.isPositionOnTheList(pos)) {
          continue;
        }

        possibleItemPositions.push(pos);
      }
    }

    return possibleItemPositions;
  }

  protected getItemTextureByRandom(excludeNamed: boolean = false) {
    const positions = this.getPossiblePositions(excludeNamed);

    if (positions.length === 0) {
      console.warn("No matching texture for random Item");
      return;
    }
    const randIndex = Math.floor(Math.random() * positions.length);
    const texturePosition = positions[randIndex];
    if (!texturePosition) {
      console.warn("No matching texture of that position");
      return;
    }

    return this.getItemTextureByPos(texturePosition.x, texturePosition.y);
  }

  protected getItemTextureByName(name: string) {
    const itemPos = ITEMS_NAMES_TEXTURE_POS[name];
    if (!itemPos) {
      console.warn("missing item by name");
    }

    const [col, row] = itemPos;
    return this.getItemTextureByPos(col, row);
  }

  protected getItemTextureByPos(col: number, row: number) {
    const posX = col * ITEM_GRAPHIC_SIZE;
    const posY = row * ITEM_GRAPHIC_SIZE;

    const frame = new Rectangle(
      posX,
      posY,
      ITEM_GRAPHIC_SIZE,
      ITEM_GRAPHIC_SIZE,
    );
    return new Texture({ source: this.itemTexture, frame });
  }
}
