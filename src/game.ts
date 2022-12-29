import {Scheduler} from 'rot-js';
import Speed from 'rot-js/lib/scheduler/speed';
import {Enemy} from './actors/enemy';
import {Sheep} from './actors/sheep';
import {symbols, times} from './constants';
import {Actor} from './definitions/actor';
import {Position} from './definitions/position';
import {setTextOnId} from './domManipulation';
import {GameMap} from './gameMap';
import {filterInPlace, waitFor} from './utils';

export class Game {
  private scheduler: Speed;

  private sheepQueued: Sheep[];

  private sheepActive: Sheep[];

  private sheepArrived: Sheep[];

  private enemies: Enemy[];

  private map: GameMap;

  private flag: Position;

  constructor(width: number, height: number) {
    this.map = new GameMap(width, height);
    const startGate = this.map.getStartGate();
    const endGate = this.map.getEndGate();

    this.flag = {x: startGate.x, y: startGate.y};

    this.sheepQueued = [
      new Sheep(startGate.x, startGate.y, this, this.map),
      new Sheep(startGate.x, startGate.y, this, this.map),
      new Sheep(startGate.x, startGate.y, this, this.map),
      new Sheep(startGate.x, startGate.y, this, this.map),
      new Sheep(startGate.x, startGate.y, this, this.map),
    ];
    this.sheepActive = [new Sheep(startGate.x, startGate.y, this, this.map)];
    this.sheepArrived = [];
    this.scheduler = new Scheduler.Speed();
    this.sheepActive.forEach((sheep) => this.scheduler.add(sheep, true));
    let enemyLocation: Position | undefined;
    let enemyLocationIndex = 1;
    while (!enemyLocation) {
      if (this.map.isNonWallTile(endGate.x, endGate.y + enemyLocationIndex)) {
        enemyLocation = {y: endGate.y + enemyLocationIndex, x: endGate.x};
      } else if (++enemyLocationIndex > height) {
        throw new Error('no valid location');
      }
    }
    this.map.getEndGate();
    this.enemies = [new Enemy(enemyLocation, this)];
    this.enemies.forEach((enemy) => this.scheduler.add(enemy, true));

    this.init();

    startGate.setBackgroundColor('tomato');
    endGate.setBackgroundColor('rebeccapurple');
    this.redrawTile(this.enemies[0].x, this.enemies[0].y);
    this.redrawTile(endGate.x, endGate.y);
    globalThis.gameElement.ontouchstart = this.handleTouchStart.bind(this);
    globalThis.gameElement.onmousedown = this.handleMouseDown.bind(this);
  }

  isTileFreeOfSheep(x: number, y: number): boolean {
    return this.sheepActive.findIndex((sheep) => sheep.x === x && sheep.y === y) === -1;
  }

  handleSelect(x: number, y: number): void {
    if (this.map.isNonWallTile(x, y)) {
      this.setFlag(x, y);
    }
  }

  handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    this.handleSelect(...globalThis.display.eventToPosition(event));
  }

  handleMouseDown(event: MouseEvent): void {
    this.handleSelect(...globalThis.display.eventToPosition(event));
  }

  handleSheepAtGate(sheepAtGate: Sheep): void {
    this.redrawTile(sheepAtGate.x, sheepAtGate.y);
    this.sheepArrived.push(sheepAtGate);
    filterInPlace(this.sheepActive, (sheep) => sheepAtGate !== sheep);
    this.scheduler.remove(sheepAtGate);
    setTextOnId('active', `${this.sheepActive.length}`);
    setTextOnId('safe', `${this.sheepArrived.length}`);
    this.redrawTile(this.map.getEndGate().x, this.map.getEndGate().y);
    if (this.sheepActive.length === 0) {
      this.handleLevelEnd();
    }
  }

  getSheepPositions(sheep?: Sheep): Position[] {
    return this.sheepActive.filter((s) => sheep !== s).map((s) => ({x: s.x, y: s.y}));
  }

  isOccupiedTile(x: number, y: number): boolean {
    return (
      this.sheepActive.some((sheep) => sheep.isOccupying({x, y})) ||
      this.enemies.some((enemy) => enemy.isOccupying({x, y}))
    );
  }

  redrawTile(x: number, y: number): void {
    let symbol = symbols.SPACE_OPEN;
    if (this.sheepActive.some((sheep) => sheep.isOccupying({x, y}))) {
      symbol = symbols.SHEEP;
    } else if (this.enemies.some((enemy) => enemy.isOccupying({x, y}))) {
      symbol = symbols.ENEMY;
    } else if (this.flag.x === x && this.flag.y === y) {
      symbol = symbols.FLAG;
    } else if (this.map.matchesGate(x, y)) {
      symbol = symbols.GATE;
    }
    globalThis.display.draw(x, y, symbol, '#000', this.map.getTileColor(x, y));
  }

  private setFlag(x: number, y: number): void {
    const previousX = this.flag.x;
    const previousY = this.flag.y;
    this.flag = {x, y};
    this.redrawTile(x, y);
    this.redrawTile(previousX, previousY);

    const goalz = (sheep: Sheep): void => {
      sheep.setGoal(x, y);
    };
    this.sheepQueued.forEach(goalz);
    this.sheepActive.forEach(goalz);
  }

  private handleLevelEnd(): void {
    if (this.sheepArrived.length !== 0) {
      this.scheduler.clear();
      // eslint-disable-next-line no-console
      console.debug('you win');
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
    if (this.sheepQueued.length !== 0 && this.isTileFreeOfSheep(startGate.x, startGate.y)) {
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
