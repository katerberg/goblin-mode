import {Path} from 'rot-js';
import {Position} from '../definitions/position';
import {Game} from '../game';

export abstract class Character {
  public x: number;

  public y: number;

  protected baseRange: number;

  protected baseAttack: number;

  protected baseArmor: number;

  public baseHp: number;

  protected sufferedDamage: number;

  goal: `${number},${number}`;

  game: Game;

  constructor(position: Position, game: Game) {
    this.game = game;
    this.baseRange = 1;
    this.baseHp = 1;
    this.baseAttack = 1;
    this.baseArmor = 0;
    this.sufferedDamage = 0;
    this.x = position.x;
    this.y = position.y;
    this.goal = `${position.x},${position.y}`;
  }

  public get range(): number {
    return this.baseRange;
  }

  public get attack(): number {
    return this.baseAttack;
  }

  public get armor(): number {
    return this.baseArmor;
  }

  public get hp(): number {
    return this.baseHp - this.sufferedDamage;
  }

  public isOccupying(position: Position): boolean {
    return position.x === this.x && position.y === this.y;
  }

  public die(): void {
    this.game.killCharacter(this);
  }

  public percentageHealth(): number {
    return this.hp / this.baseHp;
  }

  public takeDamage(amount: number): void {
    let takenDamage: number = amount;
    const reducedDamage = amount - this.armor;
    if (reducedDamage > 0) {
      takenDamage = reducedDamage;
    } else if (amount === 1 && this.armor) {
      takenDamage = 0;
    } else if (reducedDamage <= 0) {
      takenDamage = 0.3;
    }
    this.sufferedDamage += takenDamage;
    if (this.hp <= 0) {
      this.die();
    }
  }

  get path(): number[][] {
    const goal = this.goal.split(',');
    const pathToGoal = this.pathTo({x: Number.parseInt(goal[0], 10), y: Number.parseInt(goal[1], 10)});
    if (pathToGoal.length) {
      return pathToGoal;
    }
    const otherPositions = this.game.getSheepPositions(this);
    for (const position of otherPositions) {
      const pathToPosition = this.pathTo(position);
      if (pathToPosition.length) {
        return pathToPosition;
      }
    }
    return [];
  }

  private pathTo(position: Position): number[][] {
    const aStar = new Path.AStar(position.x, position.y, this.aStarCallback.bind(this), {topology: 8});
    const path: number[][] = [];
    const pathCallback = (x: number, y: number): void => {
      path.push([x, y]);
    };
    aStar.compute(this.x, this.y, pathCallback);
    path.shift();

    return path;
  }

  private aStarCallback(x: number, y: number): boolean {
    return (x === this.x && y === this.y) || this.game.isWalkableTile(x, y);
  }
}
