import { Application } from "pixi.js";
import Game from "./Game";
import Preloader from "./Preloader";
import manifest from "../assets/manifest.json";

export default class Main {
  private pixiApp: Application;
  private game: Game;
  private preloader: Preloader;

  constructor() {
    console.log('Main');
    this.pixiApp = new Application();
    this.game = new Game(this);
    this.preloader = new Preloader(manifest.assets);
  }

  public get app() {
    return this.pixiApp;
  }

  async init() {
    await this.pixiApp.init({
      background: "red",
      resizeTo: window,
    });

    document.body.append(this.pixiApp.canvas);

    await this.preloader.load();

    this.app.stage.addChild(this.game);
    await this.game.init();
  }
}
