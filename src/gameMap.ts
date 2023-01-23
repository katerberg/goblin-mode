import {Map} from 'rot-js';
import {colors, topOffset} from './constants';
import {Position} from './definitions/position';
import {Tile} from './tile';
import {clearScreen, getRandomNumber} from './utils';

export class GameMap {
  private startGatePosition: Position;

  private endGatePosition: Position;

  private tiles: Tile[][];

  private width: number;

  private height: number;

  private seenTiles: {[key: `${number},${number}`]: Tile};

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.seenTiles = {};
    this.startGatePosition = {x: 0, y: 0};
    this.endGatePosition = {x: 0, y: 0};
    this.init();
  }

  get numberOfPassableTiles(): number {
    return this.tiles.reduce((p, c) => p + c.filter((t) => t.isPassable).length, 0);
  }

  init(): void {
    for (const prop of Object.getOwnPropertyNames(this.seenTiles)) {
      delete this.seenTiles[prop as `${number},${number}`];
    }

    this.tiles.length = 0;
    const map = new Map.Cellular(this.width, this.height);
    const mapCallback = (x: number, y: number, contents: number): void => {
      const tileX = x;
      const tileY = y + topOffset;
      if (!this.tiles[tileX]) {
        this.tiles[tileX] = [];
      }
      this.tiles[tileX][tileY] = new Tile(tileX, tileY, contents === 1);
    };
    map.randomize(0.55);
    Array.from(Array(5).keys()).forEach(() => {
      map.create(mapCallback.bind(this));
    });
    map.connect(mapCallback.bind(this), 1);
    const startTile = this.getRandomTileFromRow(this.tiles[topOffset].length - 1, false);
    this.startGatePosition = {
      x: startTile.x,
      y: startTile.y,
    };
    const endTile = this.getRandomTileFromRow(topOffset, true);
    this.endGatePosition = {
      x: endTile.x,
      y: endTile.y,
    };
  }

  getRandomPassableTile(): Tile {
    for (let i = 0; i <= 1000; i++) {
      const firstRandom = getRandomNumber(0, this.tiles.length - 1);
      const secondRandom = getRandomNumber(0, this.tiles[0].length - 1);
      const tile = this.tiles[firstRandom][secondRandom];
      if (tile?.isPassable && !this.matchesGate(tile.x, tile.y)) {
        return tile;
      }
    }
    throw new Error('Could not find a valid tile');
  }

  getStartGate(): Tile {
    return this.tiles[this.startGatePosition.x][this.startGatePosition.y];
  }

  getEndGate(): Tile {
    return this.tiles[this.endGatePosition.x][this.endGatePosition.y];
  }

  matchesGate(x: number, y: number): boolean {
    return (
      (this.startGatePosition.x === x && this.startGatePosition.y === y) ||
      (this.endGatePosition.x === x && this.endGatePosition.y === y)
    );
  }

  drawDemonFire(burningSpaces: number): void {
    const fireColors = [
      colors.DEMON_FIRE_5, // lightest
      colors.DEMON_FIRE_4,
      colors.DEMON_FIRE_3,
      colors.DEMON_FIRE_2,
      colors.DEMON_FIRE_1, // darkest
    ];

    for (let y = 0; y < burningSpaces; y++) {
      for (let x = 0; x < this.tiles.length; x++) {
        const percentage = (fireColors.length * y) / burningSpaces + 0.02;
        globalThis.display.draw(
          x,
          this.tiles[1].length - 1 - y,
          '',
          null,
          fireColors[Math.random() > 0.5 ? Math.ceil(percentage) : Math.floor(percentage)],
        );
      }
    }
  }

  drawTiles(): void {
    this.tiles.forEach((tileRow) =>
      tileRow.forEach((tile) => {
        if (this.seenTiles[`${tile.x},${tile.y}`]) {
          tile.draw();
        }
      }),
    );
  }

  isSeenTile(x: number, y: number): boolean {
    return !!this.seenTiles[`${x},${y}`];
  }

  isNonWallTile(x: number, y: number): boolean {
    return !!this.getTile(x, y)?.isPassable;
  }

  seeTile(position: `${number},${number}`): void {
    if (this.seenTiles[position] !== undefined) {
      return;
    }

    const [x, y] = position.split(',');
    this.seenTiles[position] = this.tiles[x as unknown as number]?.[y as unknown as number] || null;
  }

  private getTile(x: number, y: number): Tile | undefined {
    return this.tiles?.[x]?.[y];
  }

  private getRandomTileFromRow(startRow: number, increasing: boolean): Tile {
    let tile: Tile | undefined = undefined;
    for (let rowNumber = startRow; !tile; rowNumber += increasing ? 1 : -1) {
      const filteredColumns = this.tiles.filter((column) => column[rowNumber].isPassable);
      if (filteredColumns.length) {
        tile = filteredColumns[Math.floor(Math.random() * filteredColumns.length)][rowNumber];
      }
    }
    return tile;
  }
}
