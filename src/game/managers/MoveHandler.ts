import MoveArrows from "../MoveArrows";

export enum MoveDirection {
  LEFT = "left",
  RIGHT = "right",
  NONE = "none",
  UP = "up",
  DOWN = "down",
}

export type OnMoveCallback = (direction: MoveDirection, delta: number) => void;

export default class MoveHandler {
  private onMove?: OnMoveCallback;
  private screenArrows?: MoveArrows;

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

  addScreenArrows(screenArrows: MoveArrows): void {
    this.screenArrows = screenArrows;
    this.addArrowEventListeners();
  }

  onStageUp() {
    this.handleWindowBlur();
  }

  private addArrowEventListeners(): void {
    if (!this.screenArrows) {
      console.warn("Screen arrows not set. Call addScreenArrows() first.");
      return;
    }

    const { left, right, up, down } = this.screenArrows;

    if (left) {
      left.addEventListener("pointerdown", this.onClickLeft);
      left.addEventListener("pointerup", this.onPressUpLeft);
      left.cursor = "pointer";
      left.eventMode = "static";
    }

    if (right) {
      right.addEventListener("pointerdown", this.onClickRight);
      right.addEventListener("pointerup", this.onPressUpRight);
      right.cursor = "pointer";
      right.eventMode = "static";
    }

    if (up) {
      up.addEventListener("pointerdown", this.onClickUp);
      up.cursor = "pointer";
      up.eventMode = "static";
    }

    if (down) {
      down.addEventListener("pointerdown", this.onClickDown);
      down.cursor = "pointer";
      down.eventMode = "static";
    }
  }

  private removeArrowEventListeners(): void {
    if (!this.screenArrows) {
      return;
    }

    const { left, right, up, down } = this.screenArrows;

    if (left) {
      left.removeEventListener("pointerdown", this.onClickLeft);
      left.removeEventListener("pointerup", this.onPressUpLeft);
    }

    if (right) {
      right.removeEventListener("pointerdown", this.onClickRight);
      right.removeEventListener("pointerup", this.onPressUpRight);
    }

    up?.removeEventListener("pointerdown", this.onClickUp);
    down?.removeEventListener("pointerdown", this.onClickDown);
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
