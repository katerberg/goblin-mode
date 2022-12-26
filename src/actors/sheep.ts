import {Path, SpeedActor} from 'rot-js';
import {Game} from '../game';
import {Actor} from '../interfaces/actor';

export class Sheep implements SpeedActor, Actor {
  public x: number;

  public y: number;

  private speed: number;

  private game: Game;

  constructor(x: number, y: number, game: Game) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.game = game;
  }

  get path(): number[][] {
    const aStarCallback = (x: number, y: number): boolean => this.game.isValidTile(x, y);
    const endGate = this.game.getEndGate();
    const aStar = new Path.AStar(endGate.x, endGate.y, aStarCallback, {topology: 8});
    const path: number[][] = [];
    const pathCallback = (x: number, y: number): void => {
      path.push([x, y]);
    };
    aStar.compute(this.x, this.y, pathCallback);
    path.shift();
    return path;
  }

  public async act(): Promise<void> {
    const {path} = this;
    if (path[0]) {
      const [[nextX, nextY]] = path;

      this.game.redrawTile(this.x, this.y);
      this.x = nextX;
      this.y = nextY;

      this.draw(this.game.getTileColor(this.x, this.y));

      const endGate = this.game.getEndGate();
      if (this.x === endGate.x && this.y === endGate.y) {
        this.game.handleSheepAtGate(this);
      }
    }
  }

  getSpeed(): number {
    return this.speed;
  }

  draw(bgColor: string): void {
    globalThis.display.draw(this.x, this.y, '웃', null, bgColor);
  }
}
