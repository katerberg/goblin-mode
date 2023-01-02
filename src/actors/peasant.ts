import {Position} from '../definitions/position';
import {Game} from '../game';
import {Enemy} from './enemy';

export class Peasant extends Enemy {
  constructor(position: Position, game: Game) {
    super(position, game);
    this.baseHp = 10;
  }
}
