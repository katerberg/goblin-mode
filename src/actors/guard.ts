import {Position} from '../definitions/position';
import {Game} from '../game';
import {Enemy} from './enemy';

export class Guard extends Enemy {
  constructor(position: Position, game: Game) {
    super(position, game);
    this.baseHp = 15;
    this.baseRange = 1;
    this.baseAttack = 3;
    this.baseArmor = 1;
    this.baseVisibility = 4;
  }
}
