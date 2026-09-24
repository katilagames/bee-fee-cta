import { Container, Graphics, Sprite, Texture } from "pixi.js";
import Game from "../Game";

interface MyParticle {
  sprite: Sprite;
  vx: number;
  vy: number;
  life: number;
  decay: number;
}

export default class ParticleManagerCustom {
  private game: Game;
  private particleLayer: Container;
  private pureColorTexture?: Texture;
  
  private activeParticles: MyParticle[] = [];
  private spritePool: Sprite[] = [];

  constructor(game: Game) {
    this.game = game;

    this.particleLayer = new Container();
    this.game.addChild(this.particleLayer); 
  }

  private ensureTexture(): Texture {
    if (!this.pureColorTexture) {
      const g = new Graphics();
      g.rect(0, 0, 4, 4);
      g.fill({ color: 0xffffff });

      this.pureColorTexture = this.game.app.renderer.textureGenerator.generateTexture({ target: g });
      g.destroy();
    }
    return this.pureColorTexture;
  }


  onCollectGoodItem(x: number, y: number) {
    const texture = this.ensureTexture();
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      let sprite: Sprite;

      if (this.spritePool.length > 0) {
        sprite = this.spritePool.pop()!;
        sprite.visible = true;
      } else {
        sprite = new Sprite(texture);
        this.particleLayer.addChild(sprite);
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;

      sprite.position.set(x, y);
      sprite.anchor.set(0.5);
      sprite.alpha = 1;
      sprite.tint = 0x00ffcc;

      this.activeParticles.push({
        sprite: sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.04
      });
    }
  }

  onCollectBadItem(x: number, y: number) {
    const texture = this.ensureTexture();
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      let sprite: Sprite;

      if (this.spritePool.length > 0) {
        sprite = this.spritePool.pop()!;
        sprite.visible = true;
      } else {
        sprite = new Sprite(texture);
        this.particleLayer.addChild(sprite);
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 3;

      sprite.position.set(x, y);
      sprite.anchor.set(0.5);
      sprite.alpha = 1;
      sprite.tint = 0xff3300;

      this.activeParticles.push({
        sprite: sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.03 + Math.random() * 0.03
      });
    }
  }

  update(delta: number) {
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];

      p.sprite.x += p.vx * delta;
      p.sprite.y += p.vy * delta;

      p.vy += 0.05 * delta;

      p.life -= p.decay * delta;
      p.sprite.alpha = p.life;

      if (p.sprite.tint === 0x00ffcc) {
        p.sprite.tint = 0x9900ff;
      }

      if (p.life <= 0) {
        p.sprite.visible = false;
        this.spritePool.push(p.sprite);
        this.activeParticles.splice(i, 1);
      }
    }
  }
}
