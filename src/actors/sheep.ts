import {SpeedActor} from 'rot-js';
import {symbols} from '../constants';
import {Actor} from '../definitions/actor';
import {Position} from '../definitions/position';
import {Game} from '../game';
import {GameMap} from '../gameMap';
import {getGoblinName, getRandomGreen, isWithin} from '../utils';
import {Character} from './character';
import {Enemy} from './enemy';

export class Sheep extends Character implements SpeedActor, Actor {
  private speed: number;

  private map: GameMap;

  private baseVisibility: number;

  public name: string;

  color: string;

  constructor(x: number, y: number, game: Game, map: GameMap) {
    super({x, y}, game);
    this.name = getGoblinName();
    this.color = getRandomGreen();
    this.baseVisibility = 5;
    this.speed = 1;
    this.map = map;
  }

  setGoal(x: number, y: number): void {
    this.goal = `${x},${y}`;
  }

  public get position(): Position {
    return {x: this.x, y: this.y};
  }

  public get visibility(): number {
    return this.baseVisibility;
  }

  private getClosestEnemyWithinRange(): Enemy | undefined {
    let closestEnemy: Enemy | undefined;
    for (let i = 1; i <= this.visibility; i++) {
      for (const enemyPosition of this.game.getEnemyPositions()) {
        if (isWithin(this.position, enemyPosition, i)) {
          closestEnemy = this.game.getEnemyAt(enemyPosition);
          break;
        }
      }
      if (closestEnemy) {
        break;
      }
    }
    return closestEnemy;
  }

  public async act(): Promise<void> {
    const enemy = this.getClosestEnemyWithinRange();
    if (enemy) {
      // this.goal = `${enemy.position.x},${enemy.position.y}`;
      if (isWithin(this.position, enemy, this.range)) {
        enemy.takeDamage(this.attack);
        return;
      }
    }

    const {path} = this;
    if (path[0] && !this.game.isOccupiedTile(path[0][0], path[0][1])) {
      const [[nextX, nextY]] = path;

      this.x = nextX;
      this.y = nextY;

      const endGate = this.map.getEndGate();
      if (this.x === endGate.x && this.y === endGate.y) {
        this.game.handleSheepAtGate(this);
      }
    }
    this.game.drawFov();
  }

  getSpeed(): number {
    return this.speed;
  }

  draw(bgColor: string): void {
    globalThis.display.draw(this.x, this.y, symbols.SHEEP, this.color, bgColor);
  }
}
