import * as ROT from 'rot-js';
import Speed from 'rot-js/lib/scheduler/speed';
import {Sheep} from './actors/sheep';
import {Actor} from './interfaces/actor';
import {Tile} from './tile';
import {filterInPlace, waitFor} from './utils';

type Position = {x: number; y: number};

export class Game {
  private startGatePosition: Position;

  private endGatePosition: Position;

  private scheduler: Speed;

  private sheepQueued: Sheep[];

  private sheepActive: Sheep[];

  private sheepArrived: Sheep[];

  private tiles: Tile[][];

  constructor(width: number, height: number) {
    this.tiles = [];
    for (let w = 0; w < width; w++) {
      this.tiles[w] = [];
      for (let h = 0; h < height; h++) {
        this.tiles[w][h] = new Tile(w, h);
      }
    }
    this.startGatePosition = {
      x: this.getRandomXCoordinate(),
      y: this.tiles.length - 1,
    };
    this.endGatePosition = {
      x: this.getRandomXCoordinate(),
      y: 0,
    };

    this.getStartGate().setBackgroundColor('tomato');
    this.getEndGate().setBackgroundColor('rebeccapurple');
    this.sheepQueued = [
      new Sheep(this.startGatePosition.x, this.startGatePosition.y, this),
      new Sheep(this.startGatePosition.x, this.startGatePosition.y, this),
      new Sheep(this.startGatePosition.x, this.startGatePosition.y, this),
      new Sheep(this.startGatePosition.x, this.startGatePosition.y, this),
      new Sheep(this.startGatePosition.x, this.startGatePosition.y, this),
    ];
    this.sheepActive = [new Sheep(this.startGatePosition.x, this.startGatePosition.y, this)];
    this.sheepArrived = [];
    this.scheduler = new ROT.Scheduler.Speed();
    this.sheepActive.forEach((sheep) => this.scheduler.add(sheep, true));
    this.init();
  }

  private getRandomXCoordinate(): number {
    return Math.floor(Math.random() * (this.tiles[this.tiles.length - 1].length - 1));
  }

  private getTile(x: number, y: number): Tile | undefined {
    return this.tiles?.[x]?.[y];
  }

  getStartGate(): Tile {
    return this.tiles[this.startGatePosition.x][this.startGatePosition.y];
  }

  getEndGate(): Tile {
    return this.tiles[this.endGatePosition.x][this.endGatePosition.y];
  }

  getTileColor(x: number, y: number): string {
    return this.getTile(x, y)?.backgroundColor || '#fff';
  }

  isValidTile(x: number, y: number): boolean {
    return !!this.getTile(x, y);
  }

  isTileEmpty(x: number, y: number): boolean {
    return this.sheepActive.findIndex((sheep) => sheep.x === x && sheep.y === y) === -1;
  }

  redrawTile(x: number, y: number): void {
    this.getTile(x, y)?.draw();
  }

  handleSheepAtGate(sheepAtGate: Sheep): void {
    this.redrawTile(sheepAtGate.x, sheepAtGate.y);
    this.sheepArrived.push(sheepAtGate);
    filterInPlace(this.sheepActive, (sheep) => sheepAtGate !== sheep);
    this.scheduler.remove(sheepAtGate);
    if (this.sheepActive.length === 0) {
      this.handleLevelEnd();
    }
  }

  private handleLevelEnd(): void {
    if (this.sheepArrived.length !== 0) {
      // eslint-disable-next-line no-console
      console.log('you win');
    }
  }

  private spawnSheep(): void {
    const sheep = this.sheepQueued.pop();
    if (sheep) {
      this.sheepActive.push(sheep);
      this.scheduler.add(sheep, true);
    }
  }

  async nextTurn(): Promise<boolean> {
    const actor = this.scheduler.next() as Actor;
    if (!actor) {
      return false;
    }
    const startGate = this.getStartGate();
    if (this.sheepQueued.length !== 0 && this.isTileEmpty(startGate.x, startGate.y)) {
      this.spawnSheep();
    }
    if (this.sheepActive.length && actor === this.sheepActive[0]) {
      await waitFor(100);
    }
    await actor.act();
    return true;
  }

  async init(): Promise<void> {
    this.tiles.forEach((tileRow) => tileRow.forEach((tile) => tile.draw()));
    this.sheepActive.forEach((sheep) => sheep.draw(this.tiles[sheep.x][sheep.y].backgroundColor));
    // eslint-disable-next-line no-constant-condition
    while (1) {
      // eslint-disable-next-line no-await-in-loop
      const good = await this.nextTurn();
      if (!good) {
        // eslint-disable-next-line no-console
        console.debug('breaking due to no actors');
        break;
      }
    }
  }
}
