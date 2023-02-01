import {Position} from '../definitions/position';
import {Game} from '../game';
import {Enemy} from './enemy';

export class Judge extends Enemy {
  constructor(position: Position, game: Game) {
    super(position, game);
    this.baseHp = 6;
    this.baseRange = 1;
    this.baseAttack = 6;
    this.baseVisibility = 4;
  }
}
