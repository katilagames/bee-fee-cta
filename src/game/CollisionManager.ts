import { Container } from "pixi.js";
import Hero from "./Hero";
import Item from "./items/Item";

export default class CollisionManager {
  heroVsItemCollsion(hero: Hero, item: Item) {
    return this.checkCollision(hero, item);
  }

  private checkCollision(objA: Container, objB: Container) {
    const boundsA = objA.getBounds();
    const boundsB = objB.getBounds();

    return (
      boundsA.x < boundsB.x + boundsB.width &&
      boundsA.x + boundsA.width > boundsB.x &&
      boundsA.y < boundsB.y + boundsB.height &&
      boundsA.y + boundsA.height > boundsB.y
    );
  }
}
