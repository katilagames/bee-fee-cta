import { Application } from "pixi.js";

export default class Main {
  private app: Application;
  constructor() {
    console.log('Main');
    this.app = new Application();
  }

  async init() {
    await this.app.init({
      background: "red",
      resizeTo: window
    });

    document.body.append(this.app.canvas);
  }
}