import {Position} from '../definitions/position';
import {Game} from '../game';
import {Enemy} from './enemy';

export class Guard extends Enemy {
  constructor(position: Position, game: Game) {
    super(position, game);
    this.baseHp = 20;
    this.baseRange = 1;
    this.baseAttack = 4;
    this.baseVisibility = 4;
  }
}
