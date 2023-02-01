import {Position} from '../definitions/position';
import {Game} from '../game';
import {Enemy} from './enemy';

export class Archer extends Enemy {
  constructor(position: Position, game: Game) {
    super(position, game);
    this.baseHp = 5;
    this.baseRange = 3;
    this.baseVisibility = 5;
  }
}
