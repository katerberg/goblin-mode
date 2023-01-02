import {SpeedActor} from 'rot-js';
import {Actor} from '../definitions/actor';
import {Position} from '../definitions/position';
import {Game} from '../game';
import {isWithin} from '../utils';
import {Character} from './character';
import {Sheep} from './sheep';

export class Enemy extends Character implements SpeedActor, Actor {
  private speed: number;

  private baseVisibility: number;

  private initialPosition: Position;

  constructor(position: Position, game: Game) {
    super(position, game);
    this.initialPosition = position;
    this.speed = 1;
    this.baseVisibility = 2;
  }

  get visibility(): number {
    return this.baseVisibility;
  }

  get position(): Position {
    return {x: this.x, y: this.y};
  }

  getSpeed(): number {
    return this.speed;
  }

  private getClosestSheepInRange(): Sheep | undefined {
    let closestSheep: Sheep | undefined;
    for (let i = 1; i <= this.baseVisibility; i++) {
      for (const sheepPosition of this.game.getSheepPositions()) {
        if (isWithin(this.position, sheepPosition, i)) {
          closestSheep = this.game.getSheepAt(sheepPosition);
          break;
        }
      }
      if (closestSheep) {
        break;
      }
    }
    return closestSheep;
  }

  public async act(): Promise<void> {
    const sheep = this.getClosestSheepInRange();
    if (sheep) {
      this.goal = sheep.position;
    }
    if (sheep && isWithin(this.position, this.goal, 1)) {
      console.log('attacking');
    } else if (isWithin(this.goal, this.initialPosition, 0)) {
      console.log('at home');
    } else if (!isWithin(this.goal, this.position, this.baseVisibility)) {
      console.log('walk home');
      this.goal = this.initialPosition;
    } else {
      console.log('walking to', this.goal, 'from', this.position);
      const {path} = this;
      if (path[0] && !this.game.isOccupiedTile(path[0][0], path[0][1])) {
        const [[nextX, nextY]] = path;

        this.x = nextX;
        this.y = nextY;
      }
      this.game.drawFov();
    }
  }
}
