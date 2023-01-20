import {SpeedActor} from 'rot-js';
import {symbols} from '../constants';
import {Actor} from '../definitions/actor';
import {Position} from '../definitions/position';
import {Game} from '../game';
import {GameMap} from '../gameMap';
import {isWithin} from '../mapUtils';
import {getGoblinName, getRandomGreen} from '../utils';
import {Character} from './character';
import {Enemy} from './enemy';

export class Sheep extends Character implements SpeedActor, Actor {
  private speed: number;

  private map: GameMap;

  private baseVisibility: number;

  public name: string;

  private xp: number;

  color: string;

  constructor(x: number, y: number, game: Game, map: GameMap) {
    super({x, y}, game);
    this.xp = 0;
    this.name = getGoblinName();
    this.color = getRandomGreen();
    this.baseVisibility = 5;
    this.speed = 100;
    this.map = map;
  }

  setGoal(x: number, y: number): void {
    this.goal = `${x},${y}`;
  }

  // 1: 0
  // 2: 1
  // 3: 3
  // 4: 6
  // 5: 10
  // 6: 15
  public get level(): number {
    let level = 1;
    let {xp} = this;
    while (xp > 0) {
      xp -= level++;
    }
    return level;
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

  private gainXp(xp: number): void {
    this.xp += xp;
  }

  public async act(): Promise<void> {
    const enemy = this.getClosestEnemyWithinRange();
    if (enemy) {
      // this.goal = `${enemy.position.x},${enemy.position.y}`;
      if (isWithin(this.position, enemy, this.range)) {
        enemy.takeDamage(this.attack);
        this.gainXp(this.attack);
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
