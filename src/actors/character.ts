import {Path} from 'rot-js';
import {Position} from '../definitions/position';
import {Game} from '../game';

export abstract class Character {
  public x: number;

  public y: number;

  goal: `${number},${number}`;

  game: Game;

  constructor(position: Position, game: Game) {
    this.game = game;
    this.x = position.x;
    this.y = position.y;
    this.goal = `${position.x},${position.y}`;
  }

  public isOccupying(position: Position): boolean {
    return position.x === this.x && position.y === this.y;
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
