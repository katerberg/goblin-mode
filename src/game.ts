import * as ROT from 'rot-js';
import Speed from 'rot-js/lib/scheduler/speed';
import {Sheep} from './actors/sheep';
import {times} from './constants';
import {setTextOnId} from './domManipulation';
import {GameMap} from './gameMap';
import {Actor} from './interfaces/actor';
import {filterInPlace, waitFor} from './utils';

export class Game {
  private scheduler: Speed;

  private sheepQueued: Sheep[];

  private sheepActive: Sheep[];

  private sheepArrived: Sheep[];

  private map: GameMap;

  constructor(width: number, height: number) {
    this.map = new GameMap(width, height);

    this.map.getStartGate().setBackgroundColor('tomato');
    this.map.getEndGate().setBackgroundColor('rebeccapurple');
    this.sheepQueued = [
      new Sheep(this.map.startGatePosition.x, this.map.startGatePosition.y, this, this.map),
      new Sheep(this.map.startGatePosition.x, this.map.startGatePosition.y, this, this.map),
      new Sheep(this.map.startGatePosition.x, this.map.startGatePosition.y, this, this.map),
      new Sheep(this.map.startGatePosition.x, this.map.startGatePosition.y, this, this.map),
      new Sheep(this.map.startGatePosition.x, this.map.startGatePosition.y, this, this.map),
    ];
    this.sheepActive = [new Sheep(this.map.startGatePosition.x, this.map.startGatePosition.y, this, this.map)];
    this.sheepArrived = [];
    this.scheduler = new ROT.Scheduler.Speed();
    this.sheepActive.forEach((sheep) => this.scheduler.add(sheep, true));
    this.init();
  }

  isTileEmpty(x: number, y: number): boolean {
    return this.sheepActive.findIndex((sheep) => sheep.x === x && sheep.y === y) === -1;
  }

  handleSheepAtGate(sheepAtGate: Sheep): void {
    this.map.redrawTile(sheepAtGate.x, sheepAtGate.y);
    this.sheepArrived.push(sheepAtGate);
    filterInPlace(this.sheepActive, (sheep) => sheepAtGate !== sheep);
    this.scheduler.remove(sheepAtGate);
    setTextOnId('active', `${this.sheepActive.length}`);
    setTextOnId('safe', `${this.sheepArrived.length}`);
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
      setTextOnId('active', `${this.sheepActive.length}`);
      this.scheduler.add(sheep, true);
    }
  }

  async nextTurn(): Promise<boolean> {
    const actor = this.scheduler.next() as Actor;
    if (!actor) {
      return false;
    }
    const startGate = this.map.getStartGate();
    if (this.sheepQueued.length !== 0 && this.isTileEmpty(startGate.x, startGate.y)) {
      this.spawnSheep();
    }
    if (this.sheepActive.length && actor === this.sheepActive[0]) {
      await waitFor(times.TURN_DELAY);
    }
    await actor.act();
    return true;
  }

  async init(): Promise<void> {
    this.map.drawTiles();
    this.sheepActive.forEach((sheep) => sheep.draw(this.map.getTileColor(sheep.x, sheep.y)));
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
