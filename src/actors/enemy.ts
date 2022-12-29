import {SpeedActor} from 'rot-js';
import {Actor} from '../definitions/actor';
import {Position} from '../definitions/position';
import {Game} from '../game';
import {isNextTo} from '../utils';
import {Character} from './character';

export class Enemy extends Character implements SpeedActor, Actor {
  private game: Game;

  private speed: number;

  private goal: Position;

  constructor(position: Position, game: Game) {
    super(position);
    this.game = game;
    this.speed = 1;
    this.goal = position;
  }

  getSpeed(): number {
    return this.speed;
  }

  public async act(): Promise<void> {
    let nextTo: Position | undefined;

    for (const sheepPosition of this.game.getSheepPositions()) {
      if (isNextTo({x: this.x, y: this.y}, sheepPosition)) {
        nextTo = sheepPosition;
        break;
      }
    }
    if (nextTo) {
      console.log(this.x, this.y, ' is next to ', nextTo.x, nextTo.y);
    }
  }
}
