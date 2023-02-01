import {Enemy} from '../actors/enemy';
import {Game} from '../game';
import {Position} from './position';

export interface Actor {
  act: (time: number) => Promise<boolean>;
}

export interface EnemyInitializer {
  new (position: Position, game: Game): Enemy;
}
