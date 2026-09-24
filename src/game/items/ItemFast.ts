import Game from "../Game";
import Item, { ITEM_TYPES } from "./Item";

export default class ItemFast extends Item {
  constructor(game: Game) {
    super(game);
    this.speed *= 2;
    this.type = ITEM_TYPES.fast;
  }

  init(namedTexture?: string) {
    super.init(namedTexture);

    this.sprite?.scale.set(2);
  }

  collect(): void {
    this.deactivate();
    this.game.addPoints(10);
  }
}
