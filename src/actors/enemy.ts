import {SpeedActor} from 'rot-js';
import {Actor} from '../definitions/actor';
import {Position} from '../definitions/position';
import {Game} from '../game';
import {getPositionFromCoords, isWithin} from '../mapUtils';
import {Character} from './character';
import {Sheep} from './sheep';

export abstract class Enemy extends Character implements SpeedActor, Actor {
  protected speed: number;

  protected baseVisibility: number;

  private initialPosition: `${number},${number}`;

  constructor(position: Position, game: Game) {
    super(position, game);
    this.initialPosition = `${position.x},${position.y}`;
    this.speed = 100;
    this.baseVisibility = 3;
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
    for (let i = 1; i <= this.visibility; i++) {
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

  getGoal(): Position {
    return getPositionFromCoords(this.goal);
  }

  public async act(): Promise<boolean> {
    const sheep = this.getClosestSheepInRange();
    if (sheep) {
      this.goal = `${sheep.position.x},${sheep.position.y}`;
    }
    if (sheep && isWithin(this.position, this.getGoal(), this.range) && !sheep.isHidden()) {
      sheep.takeDamage(this.attack);
      return true;
    } else if (
      (!isWithin(this.getGoal(), this.position, this.baseVisibility) || isWithin(this.getGoal(), this.position, 0)) &&
      this.goal !== this.initialPosition
    ) {
      this.goal = this.initialPosition;
      return false;
    }
    const {path} = this;
    if (path[0] && !this.game.isOccupiedTile(path[0][0], path[0][1])) {
      const [[nextX, nextY]] = path;

      this.x = nextX;
      this.y = nextY;

      this.game.drawFov();
      return true;
    }
    this.game.drawFov();
    return false;
  }
}
