import Game from "../Game";
import Item, { ITEM_TYPES } from "./Item";

export default class ItemKilling extends Item {
  constructor(game: Game) {
    super(game);
    this.speed = 100;
    this.type = ITEM_TYPES.killing;
  }

  init(namedTexture?: string) {
    namedTexture = "pig";
    super.init(namedTexture);

    this.sprite?.scale.set(4);
  }

  collect(): void {
    this.deactivate();

    this.game.addLives(-1);
  }

  missed(): void {
    this.deactivate();

    this.game.addPoints(100);
  }
}
