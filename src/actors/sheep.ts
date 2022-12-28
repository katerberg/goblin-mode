import {Path, SpeedActor} from 'rot-js';
import {symbols} from '../constants';
import {Game} from '../game';
import {GameMap} from '../gameMap';
import {Actor} from '../interfaces/actor';
import {Position} from '../interfaces/position';

export class Sheep implements SpeedActor, Actor {
  public x: number;

  public y: number;

  private speed: number;

  private game: Game;

  private map: GameMap;

  private goal: Position[];

  constructor(x: number, y: number, game: Game, map: GameMap) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.game = game;
    this.map = map;
    this.goal = [{x, y}];
  }

  setGoal(x: number, y: number): void {
    this.goal = [{x, y}];
  }

  get path(): number[][] {
    const aStarCallback = (x: number, y: number): boolean =>
      (x === this.x && y === this.y) || (this.map.isPassableTile(x, y) && !this.game.isOccupiedTile(x, y));
    const aStar = new Path.AStar(this.goal[0].x, this.goal[0].y, aStarCallback, {topology: 8});
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
    if (path[0] && !this.game.isOccupiedTile(path[0][0], path[0][1])) {
      const [[nextX, nextY]] = path;
      const previousX = this.x;
      const previousY = this.y;

      this.x = nextX;
      this.y = nextY;
      this.game.redrawTile(previousX, previousY);

      this.draw(this.map.getTileColor(this.x, this.y));

      const endGate = this.map.getEndGate();
      if (this.x === endGate.x && this.y === endGate.y) {
        this.game.handleSheepAtGate(this);
      }
    }
  }

  getSpeed(): number {
    return this.speed;
  }

  draw(bgColor: string): void {
    globalThis.display.draw(this.x, this.y, symbols.SHEEP, null, bgColor);
  }
}
