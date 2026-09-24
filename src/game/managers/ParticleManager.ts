import { Container, Graphics, Texture } from "pixi.js";
import Game from "../Game";
import { Emitter } from "@barvynkoa/particle-emitter";

export default class ParticleManager {
  private game: Game;
  public particleLayer: Container;

  private particleTexture?: Texture;
  private emitters: Emitter[] = [];

  constructor(game: Game) {
    this.game = game;
    this.particleLayer = new Container();
  }

  private getTexture(): Texture {
    if (!this.particleTexture) {
      const graphics = new Graphics();
      graphics.rect(0, 0, 8, 8);
      graphics.fill(0xffffff);

      this.particleTexture = this.game.app.renderer.generateTexture(graphics);

      graphics.destroy();
    }

    return this.particleTexture;
  }

  private createEmitter(x: number, y: number, startColor: string, endColor: string) {
    const texture = this.getTexture();

    const config = {
      lifetime: {
        min: 0.4,
        max: 0.8,
      },
      frequency: 0.01,
      particlesPerWave: 1,
      emitterLifetime: 0.08,
      maxParticles: 100,
      pos: {
        x: 0,
        y: 0,
      },
      addAtBack: false,
      behaviors: [
        {
          type: "alpha",
          config: {
            alpha: {
              list: [
                {
                  value: 1,
                  time: 0,
                },
                {
                  value: 0,
                  time: 1,
                },
              ],
            },
          },
        },
        {
          type: "scale",
          config: {
            scale: {
              list: [
                {
                  value: 1,
                  time: 0,
                },
                {
                  value: 0.2,
                  time: 1,
                },
              ],
            },
          },
        },
        {
          type: "color",
          config: {
            color: {
              list: [
                {
                  value: startColor,
                  time: 0,
                },
                {
                  value: endColor,
                  time: 1,
                },
              ],
            },
          },
        },
        {
          type: "moveSpeed",
          config: {
            speed: {
              list: [
                {
                  value: 180,
                  time: 0,
                },
                {
                  value: 40,
                  time: 1,
                },
              ],
            },
            minMult: 0.5,
          },
        },
        {
          type: "rotationStatic",
          config: {
            min: 0,
            max: 360,
          },
        },
        {
          type: "spawnShape",
          config: {
            type: "torus",
            data: {
              x: 0,
              y: 0,
              radius: 4,
            },
          },
        },
        {
          type: "textureSingle",
          config: {
            texture,
          },
        },
      ],
    };

    const emitter = new Emitter(
      this.particleLayer,
      config as any
    );

    emitter.updateOwnerPos(x, y);
    emitter.playOnceAndDestroy();

    this.emitters.push(emitter);
  }

  public onCollectGoodItem(x: number, y: number) {
    this.createEmitter(x, y, "FFFFFF", "FF3300");
  }

  public onCollectBadItem(x: number, y: number) {
    this.createEmitter(x, y, "FFFFFF", "FF3300");
  }

  public update(delta: number) {
    for (let i = this.emitters.length - 1; i >= 0; i--) {
      const emitter = this.emitters[i];
      emitter.update(delta / 1000);

      if (emitter.destroyed) {
        this.emitters.splice(i, 1);
      }
    }
  }
}