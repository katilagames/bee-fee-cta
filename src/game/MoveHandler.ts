import { Sprite } from "pixi.js";

export enum MoveDirection {
  LEFT = "left",
  RIGHT = "right",
  NONE = "none",
  UP = "up",
  DOWN = "down",
}

export type OnMoveCallback = (direction: MoveDirection, delta: number) => void;

type ScreenArrows = {
  left_mc?: Sprite;
  right_mc?: Sprite;
  up_mc?: Sprite;
  down_mc?: Sprite;
};

export default class MoveHandler {
  private onMove?: OnMoveCallback;
  private screenArrows?: ScreenArrows;

  private isLeftPressed = false;
  private isRightPressed = false;

  constructor(onMove: OnMoveCallback) {
    this.onMove = onMove;

    this.onClickDown = this.onClickDown.bind(this);
    this.onClickUp = this.onClickUp.bind(this);
    this.onClickLeft = this.onClickLeft.bind(this);
    this.onClickRight = this.onClickRight.bind(this);

    this.onPressUpLeft = this.onPressUpLeft.bind(this);
    this.onPressUpRight = this.onPressUpRight.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleWindowBlur);
  }

  addScreenArrows(screenArrows: ScreenArrows): void {
    this.screenArrows = screenArrows;
    this.addArrowEventListeners();
  }

  private addArrowEventListeners(): void {
    if (!this.screenArrows) {
      console.warn("Screen arrows not set. Call addScreenArrows() first.");
      return;
    }

    const { left_mc, right_mc, up_mc, down_mc } = this.screenArrows;

    if (left_mc) {
      left_mc.addEventListener("mousedown", this.onClickLeft);
      left_mc.addEventListener("pressup", this.onPressUpLeft);
      left_mc.cursor = "pointer";
    }

    if (right_mc) {
      right_mc.addEventListener("mousedown", this.onClickRight);
      right_mc.addEventListener("pressup", this.onPressUpRight);
      right_mc.cursor = "pointer";
    }

    if (up_mc) {
      up_mc.addEventListener("mousedown", this.onClickUp);
      up_mc.cursor = "pointer";
    }

    if (down_mc) {
      down_mc.addEventListener("mousedown", this.onClickDown);
      down_mc.cursor = "pointer";
    }
  }

  private removeArrowEventListeners(): void {
    if (!this.screenArrows) {
      return;
    }

    const { left_mc, right_mc, up_mc, down_mc } = this.screenArrows;

    if (left_mc) {
      left_mc.removeEventListener("mousedown", this.onClickLeft);
      left_mc.removeEventListener("pressup", this.onPressUpLeft);
    }

    if (right_mc) {
      right_mc.removeEventListener("mousedown", this.onClickRight);
      right_mc.removeEventListener("pressup", this.onPressUpRight);
    }

    up_mc?.removeEventListener("mousedown", this.onClickUp);
    down_mc?.removeEventListener("mousedown", this.onClickDown);
  }

  private onClickLeft(): void {
    this.isLeftPressed = true;
  }
  private onPressUpLeft(): void {
    this.isLeftPressed = false;
  }

  private onClickRight(): void {
    this.isRightPressed = true;
  }
  private onPressUpRight(): void {
    this.isRightPressed = false;
  }

  private onClickUp(): void {
    this.handleOneShotMove(MoveDirection.UP);
  }

  private onClickDown(): void {
    this.handleOneShotMove(MoveDirection.DOWN);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowRight":
      case "d":
      case "D":
        event.preventDefault();
        this.isRightPressed = true;
        break;

      case "ArrowLeft":
      case "a":
      case "A":
        event.preventDefault();
        this.isLeftPressed = true;
        break;

      case "ArrowUp":
      case "w":
      case "W":
        if (!event.repeat) {
          this.handleOneShotMove(MoveDirection.UP);
        }
        break;

      case "ArrowDown":
      case "s":
      case "S":
        if (!event.repeat) {
          this.handleOneShotMove(MoveDirection.DOWN);
        }
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowRight":
      case "d":
      case "D":
        this.isRightPressed = false;
        if (!this.isLeftPressed) {
          this.onMove?.(MoveDirection.NONE, 0);
        }
        break;

      case "ArrowLeft":
      case "a":
      case "A":
        this.isLeftPressed = false;
        if (!this.isRightPressed) {
          this.onMove?.(MoveDirection.NONE, 0);
        }
        break;
    }
  }

  public handleTick(delta: number): void {
    if (this.isLeftPressed && !this.isRightPressed) {
      this.onMove?.(MoveDirection.LEFT, delta);
    } else if (this.isRightPressed && !this.isLeftPressed) {
      this.onMove?.(MoveDirection.RIGHT, delta);
    } else {
      this.onMove?.(MoveDirection.NONE, 0);
    }
  }

  private handleOneShotMove(direction: MoveDirection): void {
    this.onMove?.(direction, 0);
  }

  private handleWindowBlur(): void {
    this.isLeftPressed = false;
    this.isRightPressed = false;
    this.onMove?.(MoveDirection.NONE, 0);
  }

  public destroy(): void {
    this.removeArrowEventListeners();

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleWindowBlur);

    this.onMove = undefined;
    this.screenArrows = undefined;
  }
}
