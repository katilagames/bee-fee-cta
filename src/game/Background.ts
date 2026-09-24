import { Assets, Container, Sprite, Texture } from "pixi.js";
import Game from "./Game";

export default class Background extends Container {
  protected sprite?: Sprite;
  protected itemTexture?: Texture;

  private game: Game;

  constructor(game: Game) {
    super();
    this.game = game;
    this.applySettings("bg1");
  }

  applySettings(assetName: string) {
    this.itemTexture = Assets.get(assetName) as Texture;

    if (!this.itemTexture) {
      console.error("Missing bg texture");
      return;
    }

    if (!this.sprite) {
      this.sprite = new Sprite(this.itemTexture);
    } else if (this.itemTexture) {
      this.sprite.texture = this.itemTexture;
    }

    this.addChild(this.sprite);
    this.rescale();
  }

  rescale() {
    if (!this.sprite || !this.itemTexture) {
      return;
    }

    const { width, height } = this.game.screen;

    // Determine target size (explicit or parent)
    let targetW = width;
    let targetH = height;
    if ((!targetW || !targetH) && this.parent) {
      const bounds = this.parent.getBounds();
      if (bounds.width > 0 && bounds.height > 0) {
        targetW = bounds.width;
        targetH = bounds.height;
      }
    }

    // Preserve aspect ratio — scale to cover the available space and center
    const texW =
      this.itemTexture.orig?.width ||
      (this.itemTexture as any).width ||
      this.itemTexture.baseTexture?.width ||
      0;
    const texH =
      this.itemTexture.orig?.height ||
      (this.itemTexture as any).height ||
      this.itemTexture.baseTexture?.height ||
      0;

    if (targetW && targetH && texW > 0 && texH > 0 && this.sprite) {
      const scale = Math.max(targetW / texW, targetH / texH);
      if (this.sprite.anchor && typeof this.sprite.anchor.set === "function") {
        this.sprite.anchor.set(0.5, 0.5);
      }
      this.sprite.scale.set(scale, scale);
      this.sprite.x = targetW / 2;
      this.sprite.y = targetH / 2;
    } else {
      // Fallback: position top-left and stretch if possible
      if (this.sprite.anchor && typeof this.sprite.anchor.set === "function") {
        this.sprite.anchor.set(0, 0);
      }
      this.sprite.x = 0;
      this.sprite.y = 0;
      if (targetW && targetH) {
        this.sprite.width = targetW;
        this.sprite.height = targetH;
      }
    }
  }
}
