import { Application, Ticker } from "pixi.js";
import Game from "./Game";
import Preloader from "./Preloader";
import manifest from "../assets/manifest.json";
import MoveHandler, { MoveDirection } from "./managers/MoveHandler";
import HtmlManager from "./managers/HtmlManager";

export default class Main {
  private pixiApp: Application;
  private game: Game;
  private preloader: Preloader;
  private moveHandler: MoveHandler;
  htmlManager: HtmlManager;

  constructor() {
    console.log("Main");
    this.htmlManager = new HtmlManager();
    this.pixiApp = new Application();
    this.game = new Game(this);
    this.preloader = new Preloader(manifest.assets);

    this.handleTicker = this.handleTicker.bind(this);
    this.onStageUp = this.onStageUp.bind(this);
    this.onMove = this.onMove.bind(this);

    this.moveHandler = new MoveHandler(this.onMove);
  }

  public get app() {
    return this.pixiApp;
  }

  public getMoveHandler() {
    return this.moveHandler;
  }
  async init() {
    this.htmlManager.showPreloader();

    await this.pixiApp.init({
      background: "grey",
      resizeTo: window,
    });

    document.body.append(this.pixiApp.canvas);

    await this.preloader.load((progress) => {
      this.htmlManager.setLoadingProgress(progress);
    });


    this.htmlManager.hidePreloader();
    
    this.app.stage.addChild(this.game);
    this.app.stage.eventMode = "static";

    this.app.stage.addEventListener("pointerupoutside", this.onStageUp);

    this.game.init();

    this.app.ticker.add(this.handleTicker);
  }

  private handleTicker(ticker: Ticker) {
    this.moveHandler?.handleTick(ticker.deltaMS);
    this.game.handleTick(ticker.deltaMS);
  }

  private onMove(direction: MoveDirection, delta: number) {
    this.game.onMove(direction, delta);
  }

  private onStageUp() {
    this.moveHandler.onStageUp();
  }
}
