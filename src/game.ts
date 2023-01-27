import {FOV, Scheduler} from 'rot-js';
import Speed from 'rot-js/lib/scheduler/speed';
import {Character} from './actors/character';
import {Demon} from './actors/demon';
import {Enemy} from './actors/enemy';
import {Pause} from './actors/pause';
import {Peasant} from './actors/peasant';
import {Sheep} from './actors/sheep';
import {colors, maxLevel, Status, symbols, times} from './constants';
import {Controls} from './controls';
import {Actor} from './definitions/actor';
import {Position} from './definitions/position';
import {setLevel} from './domManipulation';
import {GameMap} from './gameMap';
import {isInFire} from './mapUtils';
import {clearRotScreen, filterInPlace, isDebug, waitFor} from './utils';

export class Game {
  private level: number;

  private scheduler: Speed;

  sheep: Sheep[];

  private enemies: Enemy[];

  private map: GameMap;

  private visibleTiles: {[key: `${number},${number}`]: true};

  private flag: Position;

  private demon: Demon;

  constructor(width: number, height: number) {
    new Controls(this);
    this.level = 0;
    this.map = new GameMap(width, height);
    this.visibleTiles = {};

    this.flag = {x: 0, y: 0};

    this.sheep = [];
    Array.from(Array(21).keys()).forEach(() => {
      this.sheep.push(new Sheep(0, 0, this, this.map));
    });
    this.scheduler = new Scheduler.Speed();
    this.enemies = [];
    this.demon = new Demon();
  }

  get sheepAlive(): Sheep[] {
    return this.sheep.filter((sheep) => sheep.status !== Status.DEAD);
  }

  get sheepActive(): Sheep[] {
    return this.sheep.filter((sheep) => sheep.status === Status.ACTIVE);
  }

  get sheepQueued(): Sheep[] {
    return this.sheep.filter((sheep) => sheep.status === Status.QUEUED);
  }

  get sheepArrived(): Sheep[] {
    return this.sheep.filter((sheep) => sheep.status === Status.SAFE);
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
    sheepAtGate.status = Status.SAFE;
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

  private spawnPeasant(): Peasant {
    for (let i = 0; i <= 1000; i++) {
      const tile = this.map.getRandomPassableTile();
      if (
        !this.sheepActive.some((sheep) => sheep.isOccupying({x: tile.x, y: tile.y})) &&
        !this.enemies.some((enemy) => enemy.isOccupying({x: tile.x, y: tile.y}))
      ) {
        return new Peasant({x: tile.x, y: tile.y}, this);
      }
    }
    throw new Error('no valid location');
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
    if (this.map.isSeenTile(endGate.x, endGate.y) || isDebug()) {
      this.redrawTile(endGate.x, endGate.y);
    }
    this.map.drawDemonFire(this.demon.burningSpaces);
  }

  killCharacter(character: Character): void {
    this.scheduler.remove(character);
    if (character instanceof Sheep) {
      character.status = Status.DEAD;
    }
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
    this.sheep.forEach(goalz);
  }

  private handleLevelEnd(): void {
    if (this.sheepArrived.length !== 0) {
      this.scheduler.clear();
    }
  }

  private spawnSheep(): void {
    if (this.sheepQueued.length) {
      const [sheep] = this.sheepQueued;
      const startGate = this.map.getStartGate();
      sheep.x = startGate.x;
      sheep.y = startGate.y;
      sheep.status = Status.ACTIVE;
      this.scheduler.add(sheep, true, 0);
    }
  }

  private populateEnemies(): void {
    this.enemies.length = 0;
    this.enemies.push(this.spawnPeasant());
    this.enemies.forEach((enemy) => this.scheduler.add(enemy, true));
    this.scheduler.add(this.demon, true);
  }

  private positionFlag(): void {
    const startGate = this.map.getStartGate();

    this.setFlag(startGate.x, startGate.y);
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
      this.sheep
        .filter((sheep) => isInFire(sheep.y, this.demon) && sheep.status !== Status.SAFE)
        .forEach((s) => this.killCharacter(s));
    }
    await actor.act(this.scheduler.getTime());
    return true;
  }

  public isLost(): boolean {
    return this.sheep.every((s) => s.status === Status.DEAD);
  }

  public isWon(): boolean {
    return this.level >= maxLevel;
  }

  private resetAllSheep(): void {
    this.sheep.forEach((s) => {
      if (s.status === Status.SAFE || s.status === Status.QUEUED) {
        s.status = Status.QUEUED;
        s.x = this.map.getStartGate().x;
        s.y = this.map.getStartGate().y;
      }
    });
  }

  async startNextLevel(): Promise<void> {
    this.scheduler.clear();

    setLevel(++this.level);
    this.demon.addDelay(1);

    this.map.init();
    this.resetAllSheep();

    this.populateEnemies();
    this.positionFlag();
    clearRotScreen();
    // eslint-disable-next-line no-constant-condition
    while (1) {
      // eslint-disable-next-line no-await-in-loop
      const good = await this.nextTurn();
      if (!good || (this.sheepActive.length === 0 && this.sheepQueued.length === 0)) {
        // eslint-disable-next-line no-console
        console.debug(`breaking due to no ${good ? 'sheep' : 'actors'}`);
        break;
      }
    }
  }
}
