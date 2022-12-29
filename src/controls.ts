import {Position} from './definitions/position';
import {Game} from './game';
import {getPosition} from './touch';

export class Controls {
  private game: Game;

  private startingTouchCell: Position | null;

  private movedTouchCell: Position | null;

  constructor(game: Game) {
    this.game = game;
    this.startingTouchCell = null;
    this.movedTouchCell = null;

    globalThis.gameElement.ontouchstart = this.handleTouchStart.bind(this);
    globalThis.gameElement.onmousedown = this.handleMouseDown.bind(this);
    globalThis.gameElement.ontouchcancel = this.handleTouchCancel.bind(this);
    globalThis.gameElement.ontouchmove = this.handleTouchMove.bind(this);
    globalThis.gameElement.ontouchend = this.handleTouchEnd.bind(this);
    globalThis.gameElement.onmouseup = this.handleMouseUp.bind(this);
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    this.startingTouchCell = getPosition(event);
  }

  private handleMouseDown(event: MouseEvent): void {
    this.startingTouchCell = getPosition(event);
  }

  private handleTouchCancel(event: TouchEvent): void {
    event.preventDefault();
    this.startingTouchCell = null;
    this.movedTouchCell = null;
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    this.movedTouchCell = getPosition(event);
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    if (!this.startingTouchCell) {
      return;
    }
    const target = !this.movedTouchCell ? this.startingTouchCell : this.movedTouchCell;
    if (this.matchesStartingPosition(target)) {
      this.game.handleSelect(target.x, target.y);
    }
    this.startingTouchCell = null;
    this.movedTouchCell = null;
  }

  private handleMouseUp(event: MouseEvent): void {
    if (!this.startingTouchCell) {
      return;
    }
    const position = getPosition(event);
    if (this.matchesStartingPosition(position)) {
      this.game.handleSelect(position.x, position.y);
    }
    this.startingTouchCell = null;
  }

  private matchesStartingPosition(position: Position): boolean {
    if (!this.startingTouchCell || !position) {
      return false;
    }
    return position.x === this.startingTouchCell.x && position.y === this.startingTouchCell.y;
  }
}
