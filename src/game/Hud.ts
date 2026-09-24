import { Container, Text, TextStyle } from "pixi.js";
import Game from "./Game";

export default class Hud extends Container {
  private game: Game;
  private pointsText?: Text;
  private livesText?: Text;

  constructor(game: Game) {
    super();
    this.game = game;
    this.createElements();
  }

  private createElements() {
    this.pointsText = new Text({ 
      text: "Points: 0", 
      style: {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        align: "left",
      }
    });

    this.livesText = new Text({ 
      text: "Lives: 0", 
      style: {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        align: "right",
      }
    });

    this.addChild(this.pointsText);
    this.addChild(this.livesText);

    this.layout();
  }

  layout() {
    const { width } = this.game.screen;
    this.pointsText!.x = 8;
    this.pointsText!.y = 8;

    this.livesText!.x = Math.round(width - 8);
    this.livesText!.y = 8;
    this.livesText?.anchor.set(1, 0);
  }

  setPoints(points: number) {
    if (!this.pointsText) {
      return;
    }
      
    this.pointsText.text = `Points: ${points}`;
  }

  setLives(lives: number) {
    if (!this.livesText) {
      return;
    }

    this.livesText.text = `Lives: ${lives}`;
  }

  destroy(options?: any) {
    this.pointsText?.destroy(options);
    this.livesText?.destroy(options);
    super.destroy(options);
  }
}
