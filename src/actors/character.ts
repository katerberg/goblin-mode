import {Position} from '../definitions/position';

export abstract class Character {
  public x: number;

  public y: number;

  constructor(position: Position) {
    this.x = position.x;
    this.y = position.y;
  }

  public isOccupying(position: Position): boolean {
    return position.x === this.x && position.y === this.y;
  }
}
