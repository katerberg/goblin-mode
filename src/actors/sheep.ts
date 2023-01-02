import {Path, SpeedActor} from 'rot-js';
import {symbols} from '../constants';
import {Actor} from '../definitions/actor';
import {Position} from '../definitions/position';
import {Game} from '../game';
import {GameMap} from '../gameMap';
import {getGoblinName, getRandomGreen} from '../utils';
import {Character} from './character';

export class Sheep extends Character implements SpeedActor, Actor {
  private speed: number;

  private game: Game;

  private map: GameMap;

  private goal: Position;

  private baseVisibility: number;

  public name: string;

  private color: string;

  constructor(x: number, y: number, game: Game, map: GameMap) {
    super({x, y});
    this.name = getGoblinName();
    this.color = getRandomGreen();
    this.baseVisibility = 3;
    this.speed = 1;
    this.game = game;
    this.map = map;
    this.goal = {x, y};
  }

  setGoal(x: number, y: number): void {
    this.goal = {x, y};
  }

  public get visibility(): number {
    return this.baseVisibility;
  }

  public async act(): Promise<void> {
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

  get path(): number[][] {
    const pathToGoal = this.pathTo(this.goal);
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
    return (x === this.x && y === this.y) || (this.map.isNonWallTile(x, y) && !this.game.isOccupiedTile(x, y));
  }
}
