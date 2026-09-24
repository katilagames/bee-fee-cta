import { AnimatedSprite, Assets, Container, Spritesheet } from "pixi.js";
import Game from "./Game";

export enum HeroState {
  idle = "idle",
  walk_left = "walk_left",
  walk_right = "walk_right"
}

export default class Hero extends Container{ 
  private game: Game;
  private heroSS: Spritesheet;
  private animations: Record<string, any>;

  private heroSprite?: AnimatedSprite;
  private defaultState = HeroState.idle;
  private state: HeroState = this.defaultState;

  constructor(game: Game) {
    super();
    this.game = game;

    this.heroSS = Assets.get("hero_spritesheet");
    if (!this.heroSS) {
      throw Error("Missing hero spritesheet");
    }

    this.animations = {
      idle: this.heroSS.animations['char_idle'],
      walk_left: this.heroSS.animations['char_run_left'],
      walk_right: this.heroSS.animations['char_run_right'],
    }
    
    this.createSprite();
    this.setState(this.defaultState);
  }
  createSprite() {
    if (this.heroSprite) {
      return;
    }

    this.heroSprite = new AnimatedSprite(this.animations.idle);
    this.heroSprite.texture.source.scaleMode = 'nearest';
    this.heroSprite.animationSpeed = 0.1;
    this.heroSprite.play();

    this.addChild(this.heroSprite);
  }

  setState(state: HeroState) {    
    if (this.state === state) {
      return;
    }

    if (!this.animations[state]) {
      console.error("Hero animation doesn't exists");
      return;
    }
    this.state = state;

    if (!this.heroSprite) {
      console.error("Missing heroSprite in Hero");
      return;
    }
    this.heroSprite.textures = this.animations[state];
    this.heroSprite.texture.source.scaleMode = 'nearest';
    this.heroSprite.gotoAndPlay(0);
  }

  setIdle() {
    this.setState(HeroState.idle);
  }

  setWalkLeft() {
    this.setState(HeroState.walk_left);
  }

  setWalkRight() {
    this.setState(HeroState.walk_right);
  }
}