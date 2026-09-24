import Game from "../Game";
import Item, { ITEM_TYPES } from "./Item";

export default class ItemBig extends Item {
  constructor(game: Game) {
    super(game);
    this.type = ITEM_TYPES.big
  }

  init(namedTexture?: string) {
    namedTexture = "cake";
    super.init(namedTexture);

    this.sprite?.scale.set(8);
  }

  collect(): void {
    this.deactivate();
    this.game.addPoints(50);
  }
}