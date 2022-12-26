import * as ROT from 'rot-js';
import Speed from 'rot-js/lib/scheduler/speed';
import {Actor} from './interfaces/actor';
import {Sheep} from './sheep';
import {Tile} from './tile';

type Position = {x: number; y: number};

function filterInPlace<Type>(array: Array<Type>, fn: (arg0: Type) => boolean): void {
  let from = 0,
    to = 0;
  while (from < array.length) {
    if (fn(array[from])) {
      array[to] = array[from];
      to++;
    }
    from++;
  }
  array.length = to;
}

export class Game {
  private startGatePosition: Position;

  private endGatePosition: Position;

  private scheduler: Speed;

  private sheep: Sheep[];

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
    this.sheep = [new Sheep(this.startGatePosition.x, this.startGatePosition.y, this)];
    this.sheepArrived = [];
    this.scheduler = new ROT.Scheduler.Speed();
    this.sheep.forEach((sheep) => this.scheduler.add(sheep, true));
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

  isValidSpace(x: number, y: number): boolean {
    return !!this.getTile(x, y);
  }

  redrawTile(x: number, y: number): void {
    this.getTile(x, y)?.draw();
  }

  handleSheepAtGate(sheepAtGate: Sheep): void {
    this.sheepArrived.push(sheepAtGate);
    filterInPlace(this.sheep, (sheep) => sheepAtGate !== sheep);
  }

  winGame(): void {
    this.scheduler.clear();
    // eslint-disable-next-line no-console
    console.log('you win');
  }

  async nextTurn(): Promise<boolean> {
    const actor = this.scheduler.next() as Actor;
    if (!actor) {
      return false;
    }
    let resolve: () => void;
    const promise = new Promise((promiseResolve) => {
      resolve = promiseResolve as () => void;
    });
    setTimeout(() => resolve(), 100);
    await promise;
    await actor.act();
    return true;
  }

  async init(): Promise<void> {
    this.tiles.forEach((tileRow) => tileRow.forEach((tile) => tile.draw()));
    this.sheep.forEach((sheep) => sheep.draw(this.tiles[sheep.x][sheep.y].backgroundColor));
    // eslint-disable-next-line no-constant-condition
    while (1) {
      // eslint-disable-next-line no-await-in-loop
      const good = await this.nextTurn();
      if (!good) {
        break;
      }
    }
  }
}
