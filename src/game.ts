import {FOV, Scheduler} from 'rot-js';
import Speed from 'rot-js/lib/scheduler/speed';
import {Character} from './actors/character';
import {Demon} from './actors/demon';
import {Enemy} from './actors/enemy';
import {Pause} from './actors/pause';
import {Peasant} from './actors/peasant';
import {Sheep} from './actors/sheep';
import {colors, symbols, times} from './constants';
import {Controls} from './controls';
import {Actor} from './definitions/actor';
import {Position} from './definitions/position';
import {GameMap} from './gameMap';
import {isInFire} from './mapUtils';
import {filterInPlace, waitFor} from './utils';

export class Game {
  private scheduler: Speed;

  private sheepQueued: Sheep[];

  private sheepActive: Sheep[];

  private sheepArrived: Sheep[];

  private enemies: Enemy[];

  private map: GameMap;

  private visibleTiles: {[key: `${number},${number}`]: true};

  private flag: Position;

  private demon: Demon;

  constructor(width: number, height: number) {
    new Controls(this);
    this.map = new GameMap(width, height);
    this.visibleTiles = {};
    const startGate = this.map.getStartGate();
    const endGate = this.map.getEndGate();

    this.flag = {x: startGate.x, y: startGate.y};

    this.sheepQueued = [];

    Array.from(Array(20).keys()).forEach(() => {
      this.sheepQueued.push(new Sheep(startGate.x, startGate.y, this, this.map));
    });
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
    this.enemies = [new Peasant(enemyLocation, this)];
    this.enemies.forEach((enemy) => this.scheduler.add(enemy, true));
    this.demon = new Demon();
    this.scheduler.add(this.demon, true, 1);

    this.init();
  }

  public get sheep(): Sheep[] {
    return [...this.sheepActive, ...this.sheepQueued, ...this.sheepArrived];
  }

  isTileFreeOfSheep(x: number, y: number): boolean {
    return this.sheepActive.findIndex((sheep) => sheep.x === x && sheep.y === y) === -1;
  }

  handleSelect(x: number, y: number): void {
    if (this.map.isNonWallTile(x, y) && this.map.isSeenTile(x, y) && !isInFire(y, this.demon)) {
      this.setFlag(x, y);
    }
  }

  handleSheepAtGate(sheepAtGate: Sheep): void {
    this.redrawTile(sheepAtGate.x, sheepAtGate.y);
    this.sheepArrived.push(sheepAtGate);
    filterInPlace(this.sheepActive, (sheep) => sheepAtGate !== sheep);
    this.scheduler.remove(sheepAtGate);
    this.redrawTile(sheepAtGate.x, sheepAtGate.y);
    this.redrawTile(this.map.getEndGate().x, this.map.getEndGate().y);
    if (this.sheepActive.length === 0) {
      this.handleLevelEnd();
    }
  }

  getSheepPositions(sheep?: Character): Position[] {
    return this.sheepActive.filter((s) => sheep !== s).map((s) => ({x: s.x, y: s.y}));
  }

  getSheepAt(position: Position): Sheep | undefined {
    return this.sheepActive.find((sheep) => sheep.isOccupying(position));
  }

  getEnemyPositions(): Position[] {
    return this.enemies.map((e) => ({x: e.x, y: e.y}));
  }

  getEnemyAt(position: Position): Enemy | undefined {
    return this.enemies.find((enemy) => enemy.isOccupying(position));
  }

  isWalkableTile(x: number, y: number): boolean {
    return !this.isOccupiedTile(x, y) && this.map.isNonWallTile(x, y);
  }

  isOccupiedTile(x: number, y: number): boolean {
    return (
      this.sheepActive.some((sheep) => sheep.isOccupying({x, y})) ||
      this.enemies.some((enemy) => enemy.isOccupying({x, y}))
    );
  }

  redrawTile(x: number, y: number): void {
    let symbol = symbols.SPACE_OPEN;
    let fgColor = '#000';
    if (this.sheepActive.some((sheep) => sheep.isOccupying({x, y}))) {
      symbol = symbols.SHEEP;
      fgColor = this.getSheepAt({x, y})?.color || '#000';
    } else if (this.enemies.some((enemy) => enemy.isOccupying({x, y}))) {
      const enemy = this.enemies.find((e) => e.isOccupying({x, y}));
      if (enemy instanceof Peasant) {
        symbol = symbols.PEASANT;
      } else {
        symbol = symbols.ENEMY;
      }
    } else if (this.flag.x === x && this.flag.y === y) {
      fgColor = colors.FLAG;
      symbol = symbols.FLAG;
    } else if (this.map.matchesGate(x, y)) {
      fgColor = colors.GATE;
      symbol = symbols.GATE;
    }

    globalThis.display.draw(x, y, symbol, fgColor, this.getTileBackgroundColor(x, y));
  }

  private getTileBackgroundColor(x: number, y: number): string {
    if (this.map.isNonWallTile(x, y)) {
      if (this.map.matchesGate(x, y)) {
        return colors.BACKGROUND_GATE;
      }
      if (this.visibleTiles[`${x},${y}`]) {
        return colors.BACKGROUND_VISIBLE_PASSABLE;
      }
      return colors.BACKGROUND_NONVISIBLE_PASSABLE;
    }
    return colors.BACKGROUND_NONVISIBLE_IMPASSABLE;
  }

  pauseTimer(): void {
    this.scheduler.add(new Pause(), false, 0);
  }

  unpauseTimer(): void {
    if (this.scheduler._current?.resolve) {
      this.scheduler._current.resolve();
    }
  }

  drawFov(): void {
    const fov = new FOV.PreciseShadowcasting(this.map.isNonWallTile.bind(this.map));
    this.map.drawTiles();
    this.visibleTiles = {};
    this.sheepActive.forEach((sheep) => {
      fov.compute(sheep.x, sheep.y, sheep.visibility, (x, y) => {
        this.map.seeTile(`${x},${y}`);
        this.visibleTiles[`${x},${y}`] = true;
      });
    });
    Object.keys(this.visibleTiles).forEach((tile) => {
      const [x, y] = tile.split(',');
      this.redrawTile(Number.parseInt(x, 10), Number.parseInt(y, 10));
    });
    this.redrawTile(this.flag.x, this.flag.y);
    this.redrawTile(this.map.getStartGate().x, this.map.getStartGate().y);
    const endGate = this.map.getEndGate();
    if (this.map.isSeenTile(endGate.x, endGate.y)) {
      this.redrawTile(endGate.x, endGate.y);
    }
    this.map.drawDemonFire(this.demon.burningSpaces);
  }

  killCharacter(character: Character): void {
    this.scheduler.remove(character);
    filterInPlace(this.sheepActive, (sheep) => character !== sheep);
    filterInPlace(this.enemies, (enemy) => character !== enemy);
    this.redrawTile(character.x, character.y);
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
    if (this.sheepActive.length) {
      if (actor === this.sheepActive[0]) {
        await waitFor(times.TURN_DELAY);
      }
      filterInPlace(this.sheepActive, (sheep) => !isInFire(sheep.y, this.demon));
    }
    await actor.act();
    return true;
  }

  async init(): Promise<void> {
    this.sheepActive.forEach((sheep) => sheep.act());
    this.map.drawTiles();
    // eslint-disable-next-line no-constant-condition
    while (1) {
      // eslint-disable-next-line no-await-in-loop
      const good = await this.nextTurn();
      if (!good || this.sheepActive.length === 0) {
        // eslint-disable-next-line no-console
        console.debug(`breaking due to no ${good ? 'sheep' : 'actors'}`);
        break;
      }
    }
  }
}
