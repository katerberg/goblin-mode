import {Position} from './definitions/position';
import {toggleCharacterListVisibility} from './domManipulation';
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
    globalThis.gameElement.ontouchcancel = this.handleTouchCancel.bind(this);
    globalThis.gameElement.ontouchmove = this.handleTouchMove.bind(this);
    globalThis.gameElement.ontouchend = this.handleTouchEnd.bind(this);
    const characterListButton = document.getElementById('character-list-button');
    if (characterListButton) {
      characterListButton.classList.add('visible');
      characterListButton.ontouchstart = this.handleCharacterListOpen.bind(this);
    }
    const characterListCancel = document.getElementById('character-list-cancel-button');
    if (characterListCancel) {
      characterListCancel.ontouchstart = this.handleCharacterListClose.bind(this);
    }
  }

  private handleCharacterListOpen(): void {
    this.game.pauseTimer();
    toggleCharacterListVisibility(this.game.sheepAlive);
  }

  private handleCharacterListClose(): void {
    toggleCharacterListVisibility(this.game.sheepAlive);
    this.game.unpauseTimer();
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
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

  private matchesStartingPosition(position: Position): boolean {
    if (!this.startingTouchCell || !position) {
      return false;
    }
    return position.x === this.startingTouchCell.x && position.y === this.startingTouchCell.y;
  }
}
