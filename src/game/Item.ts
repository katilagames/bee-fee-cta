import { Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";
import Game from "./Game";

const ITEM_GRAPHIC_SIZE = 16;
const ITEM_TEXTURE_SIZE = { x: 8, y: 8 };

const ITEMS_NAMES_TEXTURE_POS: Record<string,[number, number]> = {
  cookie: [0, 0],
  pig: [1, 1],
  beer: [4, 3],
  cake: [4, 4],
}
export default class Item extends Container {
  private game: Game;
  private sprite: Sprite;

  private itemTexture;

  constructor(game: Game) {
    super();
    this.game = game;

    this.itemTexture = Assets.get('food');

    // this.sprite = new Sprite(this.itemTexture);
    // this.sprite = new Sprite(this.getItemTextureByName("cake"));
    const randTexture = this.getItemTextureByRandom(false);
    this.sprite = new Sprite(randTexture);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(2);
    this.sprite.texture.source.scaleMode = 'nearest';
    this.addChild(this.sprite);
  }

  private isPositionOnTheList(pos: { x: number, y: number }): boolean {
    const { x, y } = pos;
    const foundItem = Object.entries(ITEMS_NAMES_TEXTURE_POS).find(([_, [posX, posY]]) => posX === x && posY === y);

    return !!foundItem;
  }
  private getPossiblePositions(excludeNamed: boolean = false) {
    const possibleItemPositions = [];
    for(let x = 0; x < ITEM_TEXTURE_SIZE.x; x++) {
      for(let y = 0; y < ITEM_TEXTURE_SIZE.y; y++) {
        const pos = { x, y };

        if (excludeNamed && this.isPositionOnTheList(pos)) {
          continue;
        }
        
        possibleItemPositions.push(pos);
      }
    }

    return possibleItemPositions;
  }

  getItemTextureByRandom(excludeNamed: boolean = false) {
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

  getItemTextureByName(name: string) {
    const itemPos = ITEMS_NAMES_TEXTURE_POS[name];
    if (!itemPos){ 
      console.warn("missing item by name");
    }

    const [col, row] = itemPos;
    return this.getItemTextureByPos(col, row)
  }

  getItemTextureByPos(col: number, row: number) {
    const posX = col * ITEM_GRAPHIC_SIZE;
    const posY = row * ITEM_GRAPHIC_SIZE;

    const frame = new Rectangle(posX, posY, ITEM_GRAPHIC_SIZE, ITEM_GRAPHIC_SIZE);
    return new Texture({ source: this.itemTexture, frame })
  }
}